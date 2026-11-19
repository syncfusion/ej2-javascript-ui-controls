import {
    BackgroundFill,
    COLOR_MAP_KEYS,
    COLOR_SCHEME_SLOTS,
    ColorValue,
    DirectSlideBackground,
    getNotes,
    Presentation,
    PRESENTATION_WORKER_SOURCE,
    PictureMediaResponse,
    readTextParagraphContentSnapshot,
    readTextParagraphDirectStyleSnapshot,
    readTextParagraphEndCharacterSnapshot,
    ResolvedSlideBackground,
    Shape,
    Slide,
    TextBody,
    ThemeFillStyle,
    ThemeLineStyle
} from '@syncfusion/ej2-pptx';
import { NotesSnapshot, NotesRunSnapshot, NotesParagraphSnapshot, NotesBulletSnapshot } from '../notes/notes-model';
import {
    SlideShapeLevels, SlideShapeSnapshot, TextBodySnapshot, TextParagraphSnapshot, TextRunSnapshot
} from '../render/shape-render-model';
import {
    PresentationFrameInfo,
    SlideFrameBackgroundLevels,
    SlideFrameBackgroundSnapshot,
    SlideFrameDirectBackgroundSnapshot,
    SlideFrameFill,
    SlideFrameLineStyle,
    SlideFrameSnapshot,
    SlideFrameThemeSnapshot
} from '../main-slide/slide-frame-model';
import {
    PresentationLoadError,
    PresentationLoadErrorCode
} from './presentation-source';

/** Clone-safe metadata for an opened presentation session. */
export interface PresentationSessionInfo extends PresentationFrameInfo {
    readonly slideCount: number;
    readonly entryCount?: number;
    readonly hasMacros: boolean;
    readonly mode: 'worker' | 'main-thread';
}

/** Public limits applied before untrusted package parts are inflated. */
export interface PresentationSecurityLimits {
    readonly entryCount: number;
    readonly totalUncompressedBytes: number;
    readonly singlePartUncompressedBytes: number;
    readonly compressionRatio: number;
}

/** Conservative default limits for untrusted PPTX package contents. */
export const DEFAULT_PRESENTATION_SECURITY_LIMITS: PresentationSecurityLimits = Object.freeze({
    entryCount: 10000,
    totalUncompressedBytes: 1024 * 1024 * 1024,
    singlePartUncompressedBytes: 256 * 1024 * 1024,
    compressionRatio: 200
});

/** JSON-safe slide snapshot returned by the lazy parse session. */
export interface SlideRenderSnapshot extends SlideFrameSnapshot {
    readonly compressedSize?: number;
    readonly uncompressedSize?: number;
    readonly shapeCount?: number;
    readonly shapes: SlideShapeLevels;
}

/** Lazy browser parse session used to request slides and embedded media. */
export interface PresentationSession {
    readonly info: PresentationSessionInfo;
    requestSlide(index: number, signal?: AbortSignal): Promise<SlideRenderSnapshot>;
    /** Requests exact embedded picture bytes retained by the lazy package session. */
    requestMedia(mediaRequestId: string, signal?: AbortSignal): Promise<PictureMediaResponse>;
    /**
     * Requests the `c:chartSpace` XML of one chart part (read-only). Optional so sessions created
     * without chart support keep working. Worker sessions use `chartRequestId`; main-thread sessions
     * use `partName`.
     *
     * @private
     */
    requestChart?(request: ChartPartRequest, signal?: AbortSignal): Promise<string>;
    /**
     * Requests the speaker notes of one slide (read-only). Optional so sessions
     * created without notes support keep working.
     */
    requestNotes?(index: number, signal?: AbortSignal): Promise<NotesSnapshot>;
    close(): void;
}

/**
 * Identifies one chart part for {@link PresentationSession.requestChart}.
 *
 * @internal
 */
export interface ChartPartRequest {
    /** Opaque id from `fallbackFrame.resolved.chartRequestId` (worker sessions). */
    readonly chartRequestId?: string;
    /** Absolute part name from `fallbackFrame.resolved.contentPartName` (main-thread sessions). */
    readonly partName?: string;
}

/** Worker, fallback and security options used when opening a session. */
export interface OpenPresentationSessionOptions {
    readonly forceMainThread?: boolean;
    readonly workerFactory?: (url: string) => Worker;
    readonly onFallback?: (reason: unknown) => void;
    readonly limits?: Partial<PresentationSecurityLimits>;
}

interface WorkerReply {
    readonly type: 'opened' | 'slide' | 'notes' | 'media' | 'chart' | 'error';
    readonly requestId: number;
    readonly snapshot?: {
        readonly slideCount?: number;
        readonly entryCount?: number;
        readonly index?: number;
        readonly partName?: string;
        readonly compressedSize?: number;
        readonly uncompressedSize?: number;
        readonly shapeCount?: number;
        readonly hasMacros?: boolean;
        readonly slideWidthPt?: number;
        readonly slideHeightPt?: number;
        readonly slideSizeType?: string;
        readonly theme?: SlideFrameThemeSnapshot;
        readonly isHidden?: boolean;
        readonly showMasterShapes?: boolean;
        readonly layoutShowMasterShapes?: boolean;
        readonly backgrounds?: SlideFrameBackgroundLevels;
        readonly background?: SlideFrameBackgroundSnapshot;
        readonly shapes?: SlideShapeLevels;
        readonly paragraphs?: NotesParagraphSnapshot[];
    };
    readonly code?: string;
    readonly mediaRequestId?: string;
    readonly mimeType?: string;
    readonly intrinsicSize?: PictureMediaResponse['intrinsicSize'];
    readonly data?: ArrayBuffer;
    readonly xml?: string;
}

type WorkerCallbacks = {
    readonly resolve: (reply: WorkerReply) => void;
    readonly reject: (error: unknown) => void;
    readonly cleanup: () => void;
};

type WorkerSnapshot = NonNullable<WorkerReply['snapshot']>;

/**
 * Opens a worker-held package, falling back to a yielding library parse.
 * @param {ArrayBuffer} bytes - bytes
 * @param {OpenPresentationSessionOptions} options - options
 * @returns {Promise} result
 */
export async function openPresentationSession(
    bytes: ArrayBuffer,
    options: OpenPresentationSessionOptions = {}
): Promise<PresentationSession> {
    if (!options.forceMainThread && canUseInlineWorker()) {
        try {
            return await openWorkerSession(bytes, options);
        } catch (error) {
            if (options.onFallback) {
                options.onFallback(error);
            }
            // Worker construction is commonly blocked by CSP. Parse the same bytes on
            // the main thread only when it has not been detached by postMessage.
            if (bytes.byteLength === 0) {
                throw error;
            }
        }
    }
    return openMainThreadSession(bytes, options);
}

function canUseInlineWorker(): boolean {
    return typeof Worker === 'function' &&
    typeof Blob === 'function' &&
    typeof URL !== 'undefined' &&
    typeof URL.createObjectURL === 'function';
}

async function openWorkerSession(
    bytes: ArrayBuffer,
    options: OpenPresentationSessionOptions
): Promise<PresentationSession> {
    const blob: Blob = new Blob([PRESENTATION_WORKER_SOURCE], {
        type: 'text/javascript'
    });
    const url: string = URL.createObjectURL(blob);
    let worker: Worker;
    try {
        worker = options.workerFactory ? options.workerFactory(url) : new Worker(url);
    } catch (error) {
        URL.revokeObjectURL(url);
        throw error;
    }

    // Older library Workers never reply to `notes`; keep a private copy so notes can be
    // read on the main thread (lazily) instead of hanging forever.
    const notesFallbackBytes: ArrayBuffer | undefined = workerSupportsNotes() ? undefined : bytes.slice(0);
    let notesFallback: Promise<Presentation> | undefined;
    let nextRequestId: number = 1;
    const mediaCache: Map<string, PictureMediaResponse> = new Map();
    let mediaCacheBytes: number = 0;
    const mediaCacheBudget: number = pictureMediaCacheBudget();
    const pending: Map<number, WorkerCallbacks> = new Map();

    const close: () => void = (): void => {
        worker.postMessage({ type: 'close' });
        worker.terminate();
        URL.revokeObjectURL(url);
        pending.forEach((callbacks: WorkerCallbacks): void => {
            callbacks.reject(new PresentationLoadError('Aborted'));
            callbacks.cleanup();
        });
        pending.clear();
        notesFallback = undefined;
        mediaCache.clear();
        mediaCacheBytes = 0;
    };

    worker.onmessage = (event: MessageEvent): void => {
        const reply: WorkerReply = event.data as WorkerReply;
        const callbacks: WorkerCallbacks | undefined = pending.get(reply.requestId);
        if (!callbacks) {
            return;
        }
        pending.delete(reply.requestId);
        callbacks.cleanup();
        if (reply.type === 'error') {
            callbacks.reject(workerError(reply.code));
        } else {
            callbacks.resolve(reply);
        }
    };
    worker.onerror = (event: ErrorEvent): void => {
        const error: PresentationLoadError = new PresentationLoadError(
            'Corrupt',
            { cause: event.error || event.message }
        );
        pending.forEach((callbacks: WorkerCallbacks): void => {
            callbacks.reject(error);
            callbacks.cleanup();
        });
        pending.clear();
    };

    const request: (message: Record<string, unknown>, transfer?: Transferable[], signal?: AbortSignal) => Promise<WorkerReply> = (
        message: Record<string, unknown>,
        transfer?: Transferable[],
        signal?: AbortSignal
    ): Promise<WorkerReply> => {
        const requestId: number = nextRequestId++;
        return new Promise<WorkerReply>((
            resolve: (value: WorkerReply | PromiseLike<WorkerReply>) => void,
            reject: (reason?: unknown) => void
        ): void => {
            if (signal && signal.aborted) {
                reject(new PresentationLoadError('Aborted'));
                return;
            }
            const onAbort: () => void = (): void => {
                pending.delete(requestId);
                worker.postMessage({ type: 'cancel', requestId });
                reject(new PresentationLoadError('Aborted'));
            };
            const cleanup: () => void = (): void => {
                if (signal) {
                    signal.removeEventListener('abort', onAbort);
                }
            };
            if (signal) {
                signal.addEventListener('abort', onAbort, { once: true });
            }
            pending.set(requestId, { resolve, reject, cleanup });
            worker.postMessage({ ...message, requestId }, transfer || []);
        });
    };

    let opened: WorkerReply;
    try {
        opened = await request({ type: 'open', bytes, limits: resolveLimits(options.limits) }, [bytes]);
    } catch (error) {
        close();
        throw error;
    }
    const openedSnapshot: WorkerSnapshot | undefined = opened.snapshot;
    if (!openedSnapshot || typeof openedSnapshot.slideCount !== 'number') {
        close();
        throw new PresentationLoadError('Corrupt');
    }

    return {
        info: {
            slideCount: openedSnapshot.slideCount,
            entryCount: openedSnapshot.entryCount,
            hasMacros: openedSnapshot.hasMacros === true,
            mode: 'worker',
            slideWidthPt: positive(openedSnapshot.slideWidthPt, 960),
            slideHeightPt: positive(openedSnapshot.slideHeightPt, 540),
            slideSizeType: openedSnapshot.slideSizeType,
            theme: openedSnapshot.theme
        },
        requestSlide: async (index: number, signal?: AbortSignal): Promise<SlideRenderSnapshot> => {
            const reply: WorkerReply = await request({ type: 'slide', index }, undefined, signal);
            const snapshot: WorkerSnapshot | undefined = reply.snapshot;
            if (!snapshot || typeof snapshot.index !== 'number' || !snapshot.partName) {
                throw new PresentationLoadError('Corrupt');
            }
            const background: SlideFrameBackgroundSnapshot = snapshot.background || defaultBackground();
            const backgrounds: SlideFrameBackgroundLevels = snapshot.backgrounds || levelsFromResolved(background);
            return {
                index: snapshot.index,
                partName: snapshot.partName,
                compressedSize: snapshot.compressedSize,
                uncompressedSize: snapshot.uncompressedSize,
                shapeCount: snapshot.shapeCount,
                isHidden: snapshot.isHidden === true,
                showMasterShapes: snapshot.showMasterShapes !== false,
                layoutShowMasterShapes: snapshot.layoutShowMasterShapes !== false,
                backgrounds,
                background,
                shapes: snapshot.shapes || emptyShapeLevels()
            };
        },
        requestNotes: async (index: number, signal?: AbortSignal): Promise<NotesSnapshot> => {
            if (notesFallbackBytes) {
                if (!notesFallback) {
                    notesFallback = Presentation.open(notesFallbackBytes, { limits: resolveLimits(options.limits) });
                }
                return notesSnapshotFromPresentation(await notesFallback, index);
            }
            const reply: WorkerReply = await request({ type: 'notes', index }, undefined, signal);
            const snapshot: WorkerSnapshot | undefined = reply.snapshot;
            if (!snapshot || typeof snapshot.index !== 'number') {
                throw new PresentationLoadError('Corrupt');
            }
            return { index: snapshot.index, paragraphs: snapshot.paragraphs || [] };
        },
        requestMedia: async (mediaRequestId: string, signal?: AbortSignal): Promise<PictureMediaResponse> => {
            const cached: PictureMediaResponse | undefined = mediaCache.get(mediaRequestId);
            if (cached) {
                mediaCache.delete(mediaRequestId);
                mediaCache.set(mediaRequestId, cached);
                return cached;
            }
            const reply: WorkerReply = await request({ type: 'media', mediaRequestId }, undefined, signal);
            if (reply.type !== 'media' || reply.mediaRequestId !== mediaRequestId || !reply.mimeType || !reply.data) {
                throw new PresentationLoadError('Corrupt');
            }
            const response: PictureMediaResponse = {
                type: 'media', requestId: '', mediaRequestId,
                mimeType: reply.mimeType, intrinsicSize: reply.intrinsicSize, data: reply.data
            };
            mediaCache.set(mediaRequestId, response);
            mediaCacheBytes += response.data.byteLength;
            while (mediaCacheBytes > mediaCacheBudget && mediaCache.size > 1) {
                const oldestId: string | undefined = mediaCache.keys().next().value;
                if (oldestId === undefined) {
                    break;
                }
                const oldest: PictureMediaResponse | undefined = mediaCache.get(oldestId);
                mediaCache.delete(oldestId);
                mediaCacheBytes -= optionalProperty(optionalProperty(oldest, 'data'), 'byteLength') || 0;
            }
            return response;
        },
        requestChart: async (chartRequest: ChartPartRequest, signal?: AbortSignal): Promise<string> => {
            if (!chartRequest.chartRequestId) {
                throw new PresentationLoadError('Unsupported');
            }
            const reply: WorkerReply = await request(
                { type: 'chart', chartRequestId: chartRequest.chartRequestId }, undefined, signal);
            if (reply.type !== 'chart' || typeof reply.xml !== 'string') {
                throw new PresentationLoadError('Corrupt');
            }
            return reply.xml;
        },
        close
    };
}

function pictureMediaCacheBudget(): number {
    const absoluteLimit: number = 128 * 1024 * 1024;
    const navigatorWithMemory: Navigator & { readonly deviceMemory?: number } | undefined =
        typeof navigator === 'undefined' ? undefined : navigator;
    const deviceMemoryGb: number | undefined = optionalProperty(navigatorWithMemory, 'deviceMemory');
    return deviceMemoryGb && deviceMemoryGb > 0
        ? Math.min(absoluteLimit, deviceMemoryGb * 1024 * 1024 * 1024 * 0.25)
        : absoluteLimit;
}

async function openMainThreadSession(
    bytes: ArrayBuffer,
    options: OpenPresentationSessionOptions
): Promise<PresentationSession> {
    await yieldToEventLoop();
    let presentation: Presentation;
    try {
        presentation = await Presentation.open(bytes, { limits: resolveLimits(options.limits) });
    } catch (error) {
        throw mapLibraryError(error);
    }
    await yieldToEventLoop();
    let closed: boolean = false;
    return {
        info: {
            slideCount: presentation.slides.length,
            entryCount: presentation.listPartNames().length,
            hasMacros: presentation.hasMacros,
            mode: 'main-thread',
            slideWidthPt: presentation.slideWidth,
            slideHeightPt: presentation.slideHeight,
            slideSizeType: presentation.slideSizeType,
            theme: buildThemeSnapshot(presentation)
        },
        requestSlide: async (index: number, signal?: AbortSignal): Promise<SlideRenderSnapshot> => {
            if (closed || (signal && signal.aborted)) {
                throw new PresentationLoadError('Aborted');
            }
            await yieldToEventLoop();
            if (signal && signal.aborted) {
                throw new PresentationLoadError('Aborted');
            }
            const slide: Slide | undefined = presentation.slides[index];
            if (!slide) {
                throw new PresentationLoadError('Corrupt');
            }
            const slideBackground: SlideFrameDirectBackgroundSnapshot = convertDirectBackground(slide.background);
            const layoutBackground: SlideFrameDirectBackgroundSnapshot = convertDirectBackground(slide.layout.background);
            const masterBackground: SlideFrameDirectBackgroundSnapshot = convertDirectBackground(slide.layout.master.background);
            const backgrounds: SlideFrameBackgroundLevels = {
                slide: slideBackground,
                layout: layoutBackground,
                master: masterBackground,
                resolved: resolveConvertedBackground(slideBackground, layoutBackground, masterBackground)
            };
            const snapshot: SlideRenderSnapshot = {
                index,
                partName: slide.partName,
                shapeCount: slide.shapes.length,
                isHidden: slide.isHidden,
                showMasterShapes: slide.showMasterShapes,
                layoutShowMasterShapes: slide.layout.showMasterShapes,
                backgrounds,
                background: backgrounds.resolved,
                shapes: {
                    master: slide.layout.master.shapes.map(convertShape),
                    layout: slide.layout.shapes.map(convertShape),
                    slide: slide.shapes.map(convertShape)
                }
            };
            await yieldToEventLoop();
            if (signal && signal.aborted) {
                throw new PresentationLoadError('Aborted');
            }
            return snapshot;
        },
        requestNotes: async (index: number, signal?: AbortSignal): Promise<NotesSnapshot> => {
            if (closed || (signal && signal.aborted)) {
                throw new PresentationLoadError('Aborted');
            }
            const slide: Slide | undefined = presentation.slides[index];
            if (!slide) {
                throw new PresentationLoadError('Corrupt');
            }
            return notesSnapshotFromPresentation(presentation, index);
        },
        requestChart: async (chartRequest: ChartPartRequest): Promise<string> => {
            if (closed || !chartRequest.partName) {
                throw new PresentationLoadError('Unsupported');
            }
            const part: { readonly data: Uint8Array } | undefined =
                presentation.packagePartAccess().getPart(chartRequest.partName);
            if (!part) {
                throw new PresentationLoadError('Corrupt');
            }
            return new TextDecoder('utf-8').decode(part.data);
        },
        requestMedia: async (): Promise<PictureMediaResponse> => {
            // L7 deliberately keeps media in the package Worker. The public library
            // does not yet expose an equivalent main-thread picture snapshot reader.
            throw new PresentationLoadError('Unsupported');
        },
        close: (): void => {
            closed = true;
        }
    };
}

function notesSnapshotFromPresentation(presentation: Presentation, index: number): NotesSnapshot {
    const slide: Slide | undefined = presentation.slides[index];
    if (!slide) {
        throw new PresentationLoadError('Corrupt');
    }
    const notes: ReturnType<typeof getNotes> = getNotes(slide, presentation.packagePartAccess());
    const body: TextBody | undefined = notes ? notes.bodyTextBody : undefined;
    return { index, paragraphs: body ? body.paragraphs.map(convertNotesParagraph) : [] };
}

/** True when the bundled library Worker answers `notes` requests (older library builds do not). */
function workerSupportsNotes(): boolean {
    return PRESENTATION_WORKER_SOURCE.indexOf("message.type === 'notes'") >= 0;
}

function srgbHex(color: string | undefined): string | undefined {
    const hex: string = (color || '').replace(/^#/, '');
    return /^[0-9a-fA-F]{6}$/.test(hex) ? hex.toUpperCase() : undefined;
}

type ParagraphElement = ReturnType<import('@syncfusion/ej2-pptx').Paragraph['getElement']>;
type ParagraphChild = ParagraphElement['children'][number];

function convertNotesParagraph(paragraph: import('@syncfusion/ej2-pptx').Paragraph): NotesParagraphSnapshot {
    const runs: NotesRunSnapshot[] = [];
    const textParts: ReadonlyArray<import('@syncfusion/ej2-pptx').TextPart> = paragraph.runs;
    let runPosition: number = 0;
    paragraph.getElement().children.forEach((child: { kind: string; localName?: string }): void => {
        if (child.kind !== 'element') {
            return;
        }
        if (child.localName === 'br') {
            runs.push({ text: '\n' });
        } else if (child.localName === 'r') {
            const run: import('@syncfusion/ej2-pptx').TextPart = textParts[runPosition++];
            if (run && run.text) {
                const underline: string | undefined = run.font.underline;
                const strike: string | undefined = run.font.strikeType;
                const color: string | undefined = srgbHex(run.font.color);
                const highlight: string | undefined = srgbHex(run.font.highlightColor);
                runs.push({
                    text: run.text,
                    ...(run.font.bold ? { bold: true } : {}),
                    ...(run.font.italic ? { italic: true } : {}),
                    ...(underline && underline !== 'none' ? { underline: true } : {}),
                    ...(strike && strike !== 'noStrike' ? { strike: true } : {}),
                    ...(color ? { color } : {}),
                    ...(highlight ? { highlight } : {})
                });
            }
        }
    });
    const paragraphProperties: ParagraphElement | undefined = paragraph.getElement().children
        .find((child: ParagraphChild): child is ParagraphElement => child.kind === 'element' && child.localName === 'pPr');
    const bullet: NotesBulletSnapshot | undefined = paragraphProperties
        ? convertNotesBullet(readTextParagraphDirectStyleSnapshot(paragraphProperties).bullet)
        : undefined;
    return {
        runs,
        ...(paragraph.level ? { level: paragraph.level } : {}),
        ...(paragraph.leftIndent !== undefined ? { leftMarginPt: paragraph.leftIndent } : {}),
        ...(paragraph.firstLineIndent !== undefined ? { indentPt: paragraph.firstLineIndent } : {}),
        ...(bullet ? { bullet } : {})
    };
}

function convertNotesBullet(bullet: import('@syncfusion/ej2-pptx').TextBulletSnapshot | undefined): NotesBulletSnapshot | undefined {
    if (!bullet) {
        return undefined;
    }
    if (bullet.kind === 'character' && bullet.character) {
        return { kind: 'character', character: bullet.character };
    }
    if (bullet.kind === 'numbered') {
        return { kind: 'numbered', scheme: bullet.scheme, ...(bullet.startAt ? { startAt: bullet.startAt } : {}) };
    }
    return undefined;
}

function emptyShapeLevels(): SlideShapeLevels {
    return { master: [], layout: [], slide: [] };
}

function convertShape(shape: Shape): SlideShapeSnapshot {
    const groupChildSpace: import('@syncfusion/ej2-pptx').GroupChildSpace = shape.readGroupChildSpace();
    const styleRefs: import('@syncfusion/ej2-pptx').ShapeStyleRefs = shape.styleRefs;
    return {
        id: shape.id,
        name: shape.name,
        hidden: shape.hidden,
        elementKind: shape.elementKind,
        contentKind: shape.kind,
        hasTextBody: shape.textBody !== undefined,
        ...(shape.placeholder ? {
            placeholder: { type: shape.placeholder.type, index: shape.placeholder.idx }
        } : {}),
        ...(shape.textBody ? { textBody: convertTextBody(shape.textBody) } : {}),
        ...(groupChildSpace ? { groupChildSpace } : {}),
        children: shape.children.map(convertShape),
        connectorEnds: shape.readConnectorEnds(),
        ...(styleRefs ? { styleRefs } : {}),
        ...(shape.transform ? { transform: { ...shape.transform } } : {}),
        geometry: shape.geometry,
        fill: shape.fill,
        line: shape.line
    };
}

function convertTextBody(body: TextBody): TextBodySnapshot {
    const properties: import('@syncfusion/ej2-pptx').TextBodyProperties = body.directProperties;
    return {
        properties: {
            leftInsetPt: properties.leftInset,
            topInsetPt: properties.topInset,
            rightInsetPt: properties.rightInset,
            bottomInsetPt: properties.bottomInset,
            anchor: properties.anchor,
            wrap: properties.wrap,
            columnCount: properties.columnCount,
            columnSpacingPt: properties.columnSpacing,
            verticalType: properties.verticalType,
            autoFit: properties.autoFit
        },
        paragraphs: body.paragraphs.map((paragraph: import('@syncfusion/ej2-pptx').Paragraph): TextParagraphSnapshot => ({
            // Direct `a:pPr/a:defRPr` values only. The public Font getters are
            // resolved values and must not overwrite the L4 inheritance input.
            ...readTextParagraphDirectStyleSnapshot(paragraph.getElement()),
            level: paragraph.level,
            alignment: paragraph.horizontalAlignment,
            leftMarginPt: paragraph.leftIndent,
            indentPt: paragraph.firstLineIndent,
            lineSpacing: paragraph.lineSpacing,
            spaceBefore: paragraph.spaceBefore,
            spaceAfter: paragraph.spaceAfter,
            tabs: paragraph.tabStops.map((tab: import('@syncfusion/ej2-pptx').TextTabStop) => ({ positionPt: tab.position, alignment: tab.alignment })),
            runs: paragraph.runs.map((run: import('@syncfusion/ej2-pptx').TextPart): TextRunSnapshot => ({
                text: run.text,
                fontFamily: run.font.fontName,
                fontSizePt: run.font.fontSize,
                bold: run.font.bold,
                italic: run.font.italic,
                underline: run.font.underline,
                strike: run.font.strikeType,
                caps: run.font.capsType,
                baselinePercent: run.font.superscript ? 30 : run.font.subscript ? -25 : undefined,
                color: run.font.color ? { value: { kind: 'srgb', val: run.font.color.replace(/^#/, '') }, transforms: [] } : undefined,
                highlight: run.font.highlightColor ? {
                    value: { kind: 'srgb', val: run.font.highlightColor.replace(/^#/, '') }, transforms: []
                } : undefined
            })),
            content: readTextParagraphContentSnapshot(paragraph.getElement()),
            endParagraphProperties: readTextParagraphEndCharacterSnapshot(paragraph.getElement())
        }))
    };
}

function defaultBackground(): SlideFrameBackgroundSnapshot {
    return {
        source: 'default',
        background: {
            kind: 'fill',
            fill: { kind: 'solid', color: { kind: 'srgb', val: 'FFFFFF' } }
        }
    };
}

function buildThemeSnapshot(presentation: Presentation): SlideFrameThemeSnapshot | undefined {
    const theme: import('@syncfusion/ej2-pptx').ThemePart = presentation.theme;
    const firstSlide: Slide | undefined = presentation.slides[0];
    if (!theme) {
        return undefined;
    }
    const colors: Partial<Record<string, ColorValue>> = {};
    COLOR_SCHEME_SLOTS.forEach((slot: string): void => {
        colors[slot] = theme.colorScheme.getSlot(slot as Parameters<typeof theme.colorScheme.getSlot>[0]);
    });
    const colorMap: Partial<Record<string, string>> = {};
    const context: import('@syncfusion/ej2-pptx').EffectiveColorContext = firstSlide ? presentation.getColorContext(firstSlide) : undefined;
    if (context) {
        COLOR_MAP_KEYS.forEach((key: string): void => {
            colorMap[key] = context.mapping.get(key as Parameters<typeof context.mapping.get>[0]);
        });
    }
    return {
        colors,
        colorMap,
        fonts: {
            major: {
                latin: theme.fontScheme.major.latin.typeface,
                eastAsian: theme.fontScheme.major.eastAsian.typeface,
                complexScript: theme.fontScheme.major.complexScript.typeface,
                supplementalFonts: theme.fontScheme.major.supplementalFonts
            },
            minor: {
                latin: theme.fontScheme.minor.latin.typeface,
                eastAsian: theme.fontScheme.minor.eastAsian.typeface,
                complexScript: theme.fontScheme.minor.complexScript.typeface,
                supplementalFonts: theme.fontScheme.minor.supplementalFonts
            }
        },
        fillStyles: theme.formatScheme.fillStyles.map(convertThemeFill),
        backgroundFillStyles: theme.formatScheme.backgroundFillStyles.map(convertThemeFill),
        lineStyles: theme.formatScheme.lineStyles.map(convertThemeLine)
    };
}

function convertBackground(background: ResolvedSlideBackground): SlideFrameBackgroundSnapshot {
    if (background.background.kind === 'theme') {
        return {
            source: background.source,
            background: {
                kind: 'theme',
                styleIndex: background.background.styleIndex,
                color: background.background.color,
                colorTransforms: background.background.colorTransforms
            }
        };
    }
    return {
        source: background.source,
        background: {
            kind: 'fill',
            fill: convertFill(background.background.fill),
            shadeToTitle: background.background.shadeToTitle
        }
    };
}

function convertDirectBackground(background: DirectSlideBackground): SlideFrameDirectBackgroundSnapshot {
    if (background.kind === 'missing') {
        return { kind: 'missing' };
    }
    return convertBackground({ source: 'slide', background }).background;
}

function resolveConvertedBackground(
    slide: SlideFrameDirectBackgroundSnapshot,
    layout: SlideFrameDirectBackgroundSnapshot,
    master: SlideFrameDirectBackgroundSnapshot
): SlideFrameBackgroundSnapshot {
    if (slide.kind !== 'missing') {
        return { source: 'slide', background: slide };
    }
    if (layout.kind !== 'missing') {
        return { source: 'layout', background: layout };
    }
    if (master.kind !== 'missing') {
        return { source: 'master', background: master };
    }
    return defaultBackground();
}

function levelsFromResolved(background: SlideFrameBackgroundSnapshot): SlideFrameBackgroundLevels {
    const missing: SlideFrameDirectBackgroundSnapshot = { kind: 'missing' };
    return {
        slide: background.source === 'slide' ? background.background : missing,
        layout: background.source === 'layout' ? background.background : missing,
        master: background.source === 'master' ? background.background : missing,
        resolved: background
    };
}

function convertThemeFill(fill: ThemeFillStyle): SlideFrameFill {
    return convertFill(fill as BackgroundFill);
}

function convertThemeLine(line: ThemeLineStyle): SlideFrameLineStyle {
    return {
        width: line.width,
        cap: line.cap,
        compound: line.compound,
        alignment: line.alignment,
        dash: line.dash,
        fill: convertThemeFill(line.fill)
    };
}

function convertFill(fill: BackgroundFill): SlideFrameFill {
    if (fill.kind === 'picture') {
        return {
            kind: 'picture',
            ...(fill.data ? { data: copyArrayBuffer(fill.data) } : {}),
            ...(fill.contentType ? { contentType: fill.contentType } : {}),
            ...(fill.externalUrl ? { externalUrl: fill.externalUrl } : {}),
            ...(fill.mode ? { mode: fill.mode } : {})
        };
    }
    if (fill.kind === 'solid') {
        return { kind: 'solid', color: fill.color, colorTransforms: fill.colorTransforms };
    }
    if (fill.kind === 'gradient') {
        return {
            kind: 'gradient',
            angle: fill.angle,
            stops: fill.stops.map((stop: import('@syncfusion/ej2-pptx').ThemeGradientStop) => ({
                position: stop.position,
                color: stop.color,
                colorTransforms: stop.colorTransforms
            }))
        };
    }
    if (fill.kind === 'pattern') {
        return { kind: 'pattern', preset: fill.preset };
    }
    if (fill.kind === 'noFill') {
        return { kind: 'noFill' };
    }
    if (fill.kind === 'group') {
        return { kind: 'group' };
    }
    return { kind: 'unknown' };
}

function copyArrayBuffer(data: Uint8Array): ArrayBuffer {
    const copy: Uint8Array = new Uint8Array(data.byteLength);
    copy.set(data);
    return copy.buffer;
}

function resolveLimits(overrides?: Partial<PresentationSecurityLimits>): PresentationSecurityLimits {
    return {
        entryCount: positive(overrides && overrides.entryCount, DEFAULT_PRESENTATION_SECURITY_LIMITS.entryCount),
        totalUncompressedBytes: positive(
            overrides && overrides.totalUncompressedBytes,
            DEFAULT_PRESENTATION_SECURITY_LIMITS.totalUncompressedBytes
        ),
        singlePartUncompressedBytes: positive(
            overrides && overrides.singlePartUncompressedBytes,
            DEFAULT_PRESENTATION_SECURITY_LIMITS.singlePartUncompressedBytes
        ),
        compressionRatio: positive(
            overrides && overrides.compressionRatio,
            DEFAULT_PRESENTATION_SECURITY_LIMITS.compressionRatio
        )
    };
}

function positive(value: number | undefined, fallback: number): number {
    return typeof value === 'number' && isFinite(value) && value > 0 ? value : fallback;
}

function yieldToEventLoop(): Promise<void> {
    return new Promise<void>((resolve: (value: void | PromiseLike<void>) => void): void => {
        setTimeout(resolve, 0);
    });
}

function workerError(code: string | undefined): PresentationLoadError {
    const known: Record<string, PresentationLoadErrorCode> = {
        NotZip: 'NotZip',
        NotPptx: 'NotPptx',
        Corrupt: 'Corrupt',
        Encrypted: 'Encrypted',
        Unsupported: 'Unsupported',
        TooLarge: 'TooLarge',
        Aborted: 'Aborted'
    };
    return new PresentationLoadError(known[code || ''] || 'Corrupt');
}

function mapLibraryError(error: unknown): PresentationLoadError {
    if (error instanceof PresentationLoadError) {
        return error;
    }
    const name: string = error instanceof Error ? error.name : '';
    const message: string = error instanceof Error ? error.message.toLowerCase() : '';
    if (name === 'EncryptedPackageError' || message.indexOf('encrypted') >= 0) {
        return new PresentationLoadError('Encrypted', { cause: error });
    }
    if (name === 'PackageLimitError') {
        return new PresentationLoadError('TooLarge', { cause: error });
    }
    if (message.indexOf('content_types') >= 0 || message.indexOf('presentation main') >= 0) {
        return new PresentationLoadError('NotPptx', { cause: error });
    }
    return new PresentationLoadError('Corrupt', { cause: error });
}

/** Reads a property only when its owner is present.
 * @param {*} value - Potentially absent owner.
 * @param {*} key - Property key.
 * @returns {*} Property value or undefined.
 */
function optionalProperty<T, K extends keyof T>(value: T | null | undefined, key: K): T[K] | undefined {
    return value !== undefined && value !== null ? value[key] : undefined;
}
