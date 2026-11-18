import {
    DirectLine, FallbackFrameRenderSnapshot, PictureEmbeddedSourceSnapshot, PictureMediaResponse, PictureRenderSnapshot,
    TableCellRenderSnapshot, TableCellTextBodySnapshot, TableJsonValue, TableRenderSnapshot
} from '@syncfusion/ej2-pptx';
import {
    BackgroundPaint, EvaluatedPresetGeometry, EvaluatedPresetPath, GeometryPoint, GroupTransform, RenderColor,
    SlideRenderModel, SlideShapeSnapshot
} from '../render';
import {
    emuToPoint, evaluateBasicPreset, evaluateBatchBPreset, evaluateBatchCPreset, evaluateCustomGeometry,
    groupSvgTransform, mapGroupPoint, renderBackground, resolveRenderColor, routeConnector
} from '../render';
import { MATCH_SKIA_SOLID_PRESET_DASH } from '../render/line/skia-line-policy';
import { ImageRenderer, ImageRenderResult } from '../render/image/image-renderer';
import { SlideShapeLevels } from '../render/shape-render-model';
import { TextMeasurer } from '../render/text/measure-text';
import {
    emitHtmlTextBox, TextHyperlinkActivationHandler
} from '../render/text/html-text-emitter';
import {
    layoutTextBody, resolvePresetTextBounds, resolveTextBody, resolveTextTransform
} from '@syncfusion/ej2-pptx';
import { SlideFrameFill } from './slide-frame-model';
import { ChartFrameInfo, ChartRenderer, ChartRendererDisposable } from '../base/types';
import { loadOfficeChartFactory } from '../render/chart/office-chart-loader';
import { OfficeChartComponentFactory, OfficeChartHandle, renderOfficeChart } from '../render/chart/office-chart-renderer';
import { TableRenderer } from '../render/table/table-renderer';
import { registerClipboardPicture, registerClipboardTableCell } from '../semantic/semantic-clipboard';

const SVG_NS: string = 'http://www.w3.org/2000/svg';
const GRADIENT_ID: string = 'ej2-pptx-slide-background-gradient';
const MAX_PAINT_ORDER_LAYERS: number = 64;
const PX_PER_PT: number = 96 / 72;
const IMAGE_LAYER_CLASS: string = 'ej2-pptx-image-layer';

interface PaintOrderBounds {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

interface PaintOrderCandidate {
    readonly id: string;
    readonly bounds: PaintOrderBounds;
    readonly hasText: boolean;
    readonly paintsGeometry: boolean;
}

interface PaintOrderLayer {
    readonly candidateIndexes: ReadonlyArray<number>;
}

interface PaintOrderPlan {
    readonly layers: ReadonlyArray<PaintOrderLayer>;
    readonly capped: boolean;
}

interface FlattenedPaintEntry {
    readonly shape: SlideShapeSnapshot;
    readonly textShape: SlideShapeSnapshot;
    readonly source: 'master' | 'layout' | 'slide';
    readonly ancestors: ReadonlyArray<{ readonly shapeId: string; readonly transform: GroupTransform }>;
    readonly index: number;
}

/** Lazy picture-byte boundary implemented by the presentation package session. * @internal
 */
export interface PictureMediaProvider {
    request(mediaRequestId: string, signal?: AbortSignal): Promise<PictureMediaResponse>;
    requestExternal?(target: string, signal?: AbortSignal): Promise<PictureMediaResponse | undefined>;
    reportUnsupported?(issue: UnsupportedRenderIssue): void;
    /** @private */
    chartRenderer?: ChartRenderer;
    /**
     * Reads one chart part's XML from the package session; enables the built-in ej2-office-chart renderer.
     *
     * @private
     */
    requestChart?(request: { chartRequestId?: string; partName?: string }, signal?: AbortSignal): Promise<string>;
    /**
     * Overrides how the ej2-office-chart converter is created (tests); defaults to a lazy import.
     *
     * @private
     */
    chartFactory?: () => Promise<OfficeChartComponentFactory>;
    activateHyperlink?: TextHyperlinkActivationHandler;
}

/** Clone-safe unsupported-picture evidence forwarded to the public editor event. * @internal
 */
export interface PictureUnsupportedIssue {
    readonly shapeId: string;
    readonly shapeName: string;
    readonly kind: 'metafile' | 'linkedPicture' | 'picture';
    readonly reason: 'linked-picture-blocked' | 'unsupported-format' | 'missing-source';
    readonly fallbackUsed: boolean;
    readonly bounds: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
}

/** Clone-safe evidence for every non-native frame, with or without a preview fallback. * @internal
 */
export interface FallbackFrameUnsupportedIssue {
    readonly shapeId: string;
    readonly shapeName: string;
    readonly kind: 'chart' | 'smartArt' | 'ole' | 'media' | 'other';
    readonly reason: 'native-content-not-rendered' | 'preview-fallback-used';
    readonly fallbackUsed: boolean;
    readonly bounds: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
}

/** Every unsupported rendering notification raised by the frame emitter. * @internal
 */
export type UnsupportedRenderIssue = PictureUnsupportedIssue | FallbackFrameUnsupportedIssue;

/** Emits the S1 slide frame as inline SVG. * @internal
 */
export class SlideFrameEmitter {
    private readonly host: HTMLElement;
    private svg: SVGSVGElement | null = null;
    private textLayer: HTMLElement | null = null;
    private readonly objectUrls: Set<string> = new Set();
    private readonly chartRendererDisposables: Set<ChartRendererDisposable> = new Set();
    private chartTheme: SlideRenderModel<SlideShapeSnapshot>['theme'] | undefined;
    private renderGeneration: number = 0;

    public constructor(host: HTMLElement) {
        this.host = host;
    }

    /*
 * Emits one slide frame and replaces only renderer-owned markup.
 * @param {SlideRenderModel} model - model
 * @returns {void} result
 */
    public render(model: SlideRenderModel<SlideShapeSnapshot>): void {
        this.clear();
        this.host.dataset.backgroundSource = model.backgroundSource;
        this.host.dataset.slideHidden = String(model.hidden);
        if (model.viewport.sizeType) {
            this.host.dataset.slideSizeType = model.viewport.sizeType;
        }
        const flattened: ReadonlyArray<FlattenedPaintEntry> = flattenPaintEntries(model);
        const plan: PaintOrderPlan = planPaintOrderLayers(flattened.map(toPaintOrderCandidate));
        const plannedLayers: ReadonlyArray<PaintOrderLayer> =
            plan.layers.length > 0 ? plan.layers : [{ candidateIndexes: [] }];
        for (let layerIndex: number = 0; layerIndex < plannedLayers.length; layerIndex++) {
            const plannedIndexes: ReadonlyArray<number> = plannedLayers[layerIndex].candidateIndexes;
            const entries: FlattenedPaintEntry[] = plannedIndexes.map(
                (entryIndex: number): FlattenedPaintEntry => flattened[entryIndex]);
            const svg: SVGSVGElement = document.createElementNS(SVG_NS, 'svg') as SVGSVGElement;
            svg.classList.add('ej2-pptx-slide-frame');
            svg.dataset.paintLayer = String(layerIndex);
            svg.dataset.paintLayerKind = 'svg';
            svg.setAttribute('viewBox', `0 0 ${format(model.viewport.widthPt)} ${format(model.viewport.heightPt)}`);
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.setAttribute('preserveAspectRatio', 'none');
            svg.setAttribute('role', 'group');
            svg.setAttribute('aria-label', `Slide drawing layer ${layerIndex + 1}`);
            svg.setAttribute('focusable', 'false');
            if (layerIndex === 0) {
                svg.appendChild(this.emitBackground(model.background, model.viewport.widthPt, model.viewport.heightPt));
            }
            for (const entry of entries) {
                let element: SVGElement | undefined = this.emitShape(entry.shape, entry.source, model, entry.index);
                for (let ancestorIndex: number = entry.ancestors.length - 1;
                    element && ancestorIndex >= 0; ancestorIndex--) {
                    const wrapper: SVGGElement = document.createElementNS(SVG_NS, 'g') as SVGGElement;
                    wrapper.dataset.shapeId = entry.ancestors[ancestorIndex].shapeId;
                    wrapper.dataset.elementKind = 'grpSp';
                    wrapper.setAttribute('transform', groupSvgTransform(entry.ancestors[ancestorIndex].transform));
                    wrapper.appendChild(element);
                    element = wrapper;
                }
                if (element) {
                    svg.appendChild(element);
                }
            }
            const text: HTMLElement = document.createElement('div');
            text.className = 'ej2-pptx-text-layer';
            text.dataset.paintLayer = String(layerIndex);
            text.dataset.paintLayerKind = 'html';
            this.host.append(svg, text);
            for (const entry of entries) {
                if (entry.shape.contentKind === 'table' && entry.shape.table) {
                    this.emitTable(text, entry.shape, entry.textShape, entry.source, model);
                }
            }
            if (layerIndex === 0) {
                this.svg = svg;
                this.textLayer = text;
            }
        }
        this.host.dataset.paintLayerCount = String(plannedLayers.length);
        this.host.dataset.paintLayerCap = String(MAX_PAINT_ORDER_LAYERS);
        this.host.dataset.paintLayerCapped = String(plan.capped);
    }

    /*
 * Ports `RendererBase.DrawImage` source selection and `GDIRenderer.DrawImage` picture paint.
 * @param {SlideRenderModel} model - model
 * @param {PictureMediaProvider} provider - provider
 * @param {AbortSignal} signal - signal
 * @returns {Promise} result
 */
    public async renderPictures(
        model: SlideRenderModel<SlideShapeSnapshot>,
        provider: PictureMediaProvider,
        signal?: AbortSignal
    ): Promise<void> {
        const generation: number = this.renderGeneration;
        this.chartTheme = model.theme;
        for (const entry of flattenPaintEntries(model)) {
            await this.renderPictureShape(entry.shape, entry.textShape, entry.source, provider, signal, generation);
            if (generation !== this.renderGeneration || optionalProperty(signal, 'aborted')) {
                return;
            }
        }
    }

    private async renderPictureShape(
        shape: SlideShapeSnapshot,
        placedShape: SlideShapeSnapshot,
        source: 'master' | 'layout' | 'slide',
        provider: PictureMediaProvider,
        signal: AbortSignal | undefined,
        generation: number
    ): Promise<void> {
        if (shape.hidden) {
            return;
        }
        if (shape.fallbackFrame) {
            await this.renderFallbackFrame(shape, placedShape, shape.fallbackFrame, provider, signal, generation);
            return;
        }
        const picture: PictureRenderSnapshot | undefined = shape.elementKind === 'pic'
            ? shape.picture : shape.pictureFill;
        if (!picture) {
            return;
        }
        const selection: PictureSourceSelection | undefined = selectEmbeddedPictureSource(picture);
        let media: PictureMediaResponse | undefined;
        if (!selection && picture.resolved.linked && provider.requestExternal) {
            media = await provider.requestExternal(picture.resolved.linked.target, signal);
        }
        if (!selection && !media) {
            if (provider.reportUnsupported) {
                provider.reportUnsupported(unsupportedPictureIssue(shape, picture, false));
            }
            return;
        }
        if (selection.fallbackUsed) {
            if (provider.reportUnsupported) {
                provider.reportUnsupported(unsupportedPictureIssue(shape, picture, true));
            }
        }
        media = media || await provider.request(optionalProperty(optionalProperty(selection, 'source'), 'mediaRequestId') || '', signal);
        if (generation !== this.renderGeneration || optionalProperty(signal, 'aborted')) {
            return;
        }
        if (shape.elementKind === 'pic') {
            this.placeHtmlPicture(shape, placedShape, picture, media, source);
            return;
        }
        const renderedPicture: SVGElement | undefined = this.emitShapePictureFill(shape, picture, media);
        if (!renderedPicture) {
            return;
        }
        renderedPicture.dataset.source = source;
        const paintedShape: SVGPathElement | undefined = Array.from(
            this.host.querySelectorAll<SVGPathElement>('.ej2-pptx-shape')
        ).find((element: SVGPathElement): boolean => element.dataset.shapeId === shape.id);
        const paintedParent: HTMLElement | SVGElement | null | undefined = optionalProperty(paintedShape, 'parentElement');
        if (paintedParent !== undefined && paintedParent !== null) {
            paintedParent.before(renderedPicture);
        }
    }

    private async renderFallbackFrame(
        shape: SlideShapeSnapshot,
        placedShape: SlideShapeSnapshot,
        fallback: FallbackFrameRenderSnapshot,
        provider: PictureMediaProvider,
        signal: AbortSignal | undefined,
        generation: number
    ): Promise<void> {
        const selection: PictureSourceSelection | undefined = fallback.preview
            ? selectEmbeddedPictureSource(fallback.preview) : undefined;
        if (fallback.kind === 'chart') {
            const renderer: ChartRenderer | undefined = provider.chartRenderer ||
                await this.createOfficeChartRenderer(fallback, provider, signal, generation);
            if (renderer && generation === this.renderGeneration && this.renderChartFrame(shape, fallback, renderer)) {
                return;
            }
        }
        if (provider.reportUnsupported) {
            provider.reportUnsupported(unsupportedFrameIssue(shape, fallback, Boolean(selection)));
        }
        if (!fallback.preview || !selection) {
            return;
        }
        const media: PictureMediaResponse = await provider.request(selection.source.mediaRequestId, signal);
        if (generation !== this.renderGeneration || optionalProperty(signal, 'aborted')) {
            return;
        }
        this.placeHtmlPicture(shape, placedShape, fallback.preview, media, undefined, fallback.kind);
    }

    /*
     * Built-in chart path: reads the chart part, lazily loads ej2-office-chart, and returns a renderer that maps
     * the ej2-pptx chart model onto it. Returns `undefined` (placeholder/preview fallback stays) when the part
     * cannot be read or ej2-office-chart is unavailable.
     */
    private async createOfficeChartRenderer(
        fallback: FallbackFrameRenderSnapshot,
        provider: PictureMediaProvider,
        signal: AbortSignal | undefined,
        generation: number
    ): Promise<ChartRenderer | undefined> {
        const resolved: FallbackFrameRenderSnapshot['resolved'] = fallback.resolved;
        const chartRequestId: string | undefined = optionalProperty(resolved, 'chartRequestId');
        const partName: string | undefined = optionalProperty(resolved, 'contentPartName');
        if (!provider.requestChart || (!chartRequestId && !partName)) {
            return undefined;
        }
        try {
            const xml: string = await provider.requestChart({ chartRequestId, partName }, signal);
            const factory: OfficeChartComponentFactory = await (provider.chartFactory || loadOfficeChartFactory)();
            if (generation !== this.renderGeneration || optionalProperty(signal, 'aborted')) {
                return undefined;
            }
            const theme: SlideRenderModel<SlideShapeSnapshot>['theme'] | undefined = this.chartTheme;
            return (frame: ChartFrameInfo, host: HTMLElement): ChartRendererDisposable => {
                const handle: OfficeChartHandle | undefined = renderOfficeChart(
                    xml, host, { widthPt: frame.bounds.width, heightPt: frame.bounds.height }, theme, factory);
                if (!handle) {
                    throw new Error('chart-not-representable');
                }
                host.dataset.chartRendered = 'office-chart';
                if (handle.mapping.unsupported.length > 0) {
                    host.dataset.chartUnsupported = handle.mapping.unsupported.join('; ');
                }
                return handle;
            };
        } catch {
            return undefined;
        }
    }

    private renderChartFrame(
        shape: SlideShapeSnapshot,
        fallback: FallbackFrameRenderSnapshot,
        renderer: ChartRenderer
    ): boolean {
        const transform: import('@syncfusion/ej2-pptx').DirectTransform = shape.transform;
        if (!transform || transform.cx === undefined || transform.cy === undefined) {
            return false;
        }
        const width: number = emuToPoint(transform.cx);
        const height: number = emuToPoint(transform.cy);
        const placeholder: SVGElement | undefined = Array.from(
            this.host.querySelectorAll<SVGElement>('[data-placeholder-kind="chart"]')
        ).find((element: SVGElement): boolean => element.dataset.shapeId === shape.id);
        if (!placeholder || width <= 0 || height <= 0) {
            return false;
        }
        const group: SVGGElement = document.createElementNS(SVG_NS, 'g') as SVGGElement;
        group.dataset.chartRendererShapeId = shape.id;
        group.setAttribute('transform', objectTransform(shape, width, height));
        const foreignObject: SVGForeignObjectElement = document.createElementNS(
            SVG_NS, 'foreignObject') as SVGForeignObjectElement;
        foreignObject.setAttribute('width', format(width));
        foreignObject.setAttribute('height', format(height));
        const chartHost: HTMLDivElement = document.createElement('div');
        chartHost.dataset.chartRendererHost = shape.id;
        chartHost.style.width = '100%';
        chartHost.style.height = '100%';
        chartHost.setAttribute('role', 'img');
        chartHost.setAttribute('aria-label', fallback.description || fallback.title || shape.name || 'Chart');
        foreignObject.appendChild(chartHost);
        group.appendChild(foreignObject);
        const frame: ChartFrameInfo = {
            shapeId: shape.id,
            shapeName: shape.name,
            relationshipId: fallback.direct.contentRelationshipId,
            chartPartName: optionalProperty(fallback.resolved, 'contentPartName'),
            bounds: {
                x: emuToPoint(transform.x || 0), y: emuToPoint(transform.y || 0),
                width, height
            },
            rotationDegrees: transform.rotationDegrees || 0,
            altText: fallback.description || fallback.title || shape.name || `Chart ${shape.id}`,
            fallbackImage: fallback.preview,
            chartRequestId: optionalProperty(fallback.resolved, 'chartRequestId')
        };
        placeholder.replaceWith(group);
        try {
            const disposable: void | ChartRendererDisposable = renderer(frame, chartHost);
            if (disposable) {
                this.chartRendererDisposables.add(disposable);
            }
            return true;
        } catch {
            group.replaceWith(placeholder);
            return false;
        }
    }

    /*
     * Renders a picture as `<div><img></div>` into the HTML image sub-layer of the paint layer
     * that owns the SVG placeholder, then removes the placeholder.
     */
    private placeHtmlPicture(
        shape: SlideShapeSnapshot,
        placedShape: SlideShapeSnapshot,
        picture: PictureRenderSnapshot,
        media: PictureMediaResponse,
        source?: 'master' | 'layout' | 'slide',
        fallbackKind?: string
    ): void {
        const placeholder: Element | undefined = Array.from(
            this.host.querySelectorAll(`[data-placeholder-kind="${placeholderKind(shape)}"]`)
        ).find((element: Element): boolean => (element as SVGElement).dataset.shapeId === shape.id);
        const layer: Element | null | undefined = placeholder ? placeholder.closest('[data-paint-layer]') : undefined;
        const transform: SlideShapeSnapshot['transform'] = placedShape.transform;
        if (!placeholder || !layer || !transform || transform.cx === undefined || transform.cy === undefined) {
            return;
        }
        const widthPx: number = emuToPoint(transform.cx) * PX_PER_PT;
        const heightPx: number = emuToPoint(transform.cy) * PX_PER_PT;
        const rendered: ImageRenderResult | undefined = new ImageRenderer().render({
            shape: placedShape,
            picture,
            media,
            url: this.createEmbeddedUrl(media.data, media.mimeType),
            clipPathPx: widthPx > 0 && heightPx > 0 ? pictureClipPath(placedShape, widthPx, heightPx) : undefined
        });
        const textLayer: HTMLElement | null = this.host.querySelector<HTMLElement>(
            `:scope > .ej2-pptx-text-layer[data-paint-layer="${(layer as HTMLElement).dataset.paintLayer}"]`);
        if (!rendered || !textLayer) {
            return;
        }
        if (source) {
            rendered.element.dataset.source = source;
        }
        if (fallbackKind) {
            rendered.element.dataset.fallbackFrameKind = fallbackKind;
        }
        imageSubLayer(textLayer).append(...(rendered.border ? [rendered.element, rendered.border] : [rendered.element]));
        placeholder.remove();
        const authoredAlt: string = picture.description || picture.title || '';
        registerClipboardPicture(this.host, rendered.element, {
            shapeId: shape.id, altText: authoredAlt, decorative: authoredAlt.length === 0
        });
    }

    private emitShapePictureFill(
        shape: SlideShapeSnapshot,
        picture: PictureRenderSnapshot,
        media: PictureMediaResponse
    ): SVGElement | undefined {
        const transform: import('@syncfusion/ej2-pptx').DirectTransform = shape.transform;
        if (!transform || transform.cx === undefined || transform.cy === undefined) {
            return undefined;
        }
        const width: number = emuToPoint(transform.cx);
        const height: number = emuToPoint(transform.cy);
        if (width <= 0 || height <= 0) {
            return undefined;
        }
        const basicGeometry: import('../render/index').EvaluatedGeometry = shape.geometry.kind === 'preset'
            ? evaluateBasicPreset(shape.geometry.preset, width, height, {}) : undefined;
        const batchGeometry: import('../render/index').EvaluatedBatchBPreset = shape.geometry.kind === 'preset' && !basicGeometry
            ? evaluateBatchBPreset(shape.geometry.preset, width, height, {}) ||
                evaluateBatchCPreset(shape.geometry.preset, width, height, {}) : undefined;
        const geometryPath: string | undefined = optionalProperty(basicGeometry, 'path') ||
            optionalProperty(optionalProperty(optionalProperty(batchGeometry, 'paths'), 0), 'path');
        if (!geometryPath) {
            return undefined;
        }
        const group: SVGGElement = document.createElementNS(SVG_NS, 'g') as SVGGElement;
        group.dataset.pictureFillShapeId = shape.id;
        group.setAttribute('transform', objectTransform(shape, width, height));
        group.setAttribute('aria-hidden', 'true');
        const clipId: string = `ej2-pptx-picture-fill-clip-${safeId(shape.id)}`;
        const defs: SVGDefsElement = document.createElementNS(SVG_NS, 'defs') as SVGDefsElement;
        const clip: SVGClipPathElement = document.createElementNS(SVG_NS, 'clipPath') as SVGClipPathElement;
        clip.id = clipId;
        const clipPath: SVGPathElement = document.createElementNS(SVG_NS, 'path') as SVGPathElement;
        clipPath.setAttribute('d', geometryPath);
        clip.appendChild(clipPath); defs.appendChild(clip); group.appendChild(defs);
        const url: string = this.createEmbeddedUrl(media.data, media.mimeType);
        group.appendChild(picture.direct.tile
            ? this.emitTiledPicture(picture, url, media, width, height, clipId, defs,
                                    emuToPoint(transform.x || 0), emuToPoint(transform.y || 0))
            : this.emitStretchedPicture(picture, url, width, height, clipId));
        return group;
    }

    private emitStretchedPicture(
        picture: PictureRenderSnapshot,
        url: string,
        width: number,
        height: number,
        clipId: string
    ): SVGImageElement {
        const crop: import('@syncfusion/ej2-pptx').PictureRelativeRectangleSnapshot = picture.direct.sourceRectangle;
        const visibleWidth: number = Math.max(0.000001, 1 - (optionalProperty(crop, 'left') || 0) - (optionalProperty(crop, 'right') || 0));
        const visibleHeight: number = Math.max(0.000001, 1 - (optionalProperty(crop, 'top') || 0) - (optionalProperty(crop, 'bottom') || 0));
        const image: SVGImageElement = document.createElementNS(SVG_NS, 'image') as SVGImageElement;
        image.classList.add('ej2-pptx-picture');
        image.setAttribute('href', url);
        image.setAttribute('x', format(-((optionalProperty(crop, 'left') || 0) / visibleWidth) * width));
        image.setAttribute('y', format(-((optionalProperty(crop, 'top') || 0) / visibleHeight) * height));
        image.setAttribute('width', format(width / visibleWidth));
        image.setAttribute('height', format(height / visibleHeight));
        image.setAttribute('preserveAspectRatio', 'none');
        image.setAttribute('clip-path', `url(#${clipId})`);
        applyPictureEffects(image, picture);
        return image;
    }

    private emitTiledPicture(
        picture: PictureRenderSnapshot,
        url: string,
        media: PictureMediaResponse,
        width: number,
        height: number,
        clipId: string,
        defs: SVGDefsElement,
        pageX: number,
        pageY: number
    ): SVGRectElement {
        const tile: import('@syncfusion/ej2-pptx').PictureTileSnapshot = picture.direct.tile;
        const intrinsic: import('@syncfusion/ej2-pptx').PictureIntrinsicSizeSnapshot = media.intrinsicSize;
        // Ports GDIRenderer.GetTextureBrush: image pixel dimensions enter the
        // brush coordinate system directly before ScaleTransform is applied.
        const tileWidth: number = Math.max(1, (optionalProperty(intrinsic, 'widthPx') || width) * (optionalProperty(tile, 'scaleX') || 1));
        const tileHeight: number = Math.max(1, (optionalProperty(intrinsic, 'heightPx') || height) * (optionalProperty(tile, 'scaleY') || 1));
        const pattern: SVGPatternElement = document.createElementNS(SVG_NS, 'pattern') as SVGPatternElement;
        pattern.id = `${clipId}-tile`;
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');
        // TextureBrush is page-anchored; compensate for this SVG group's
        // object translation so its local user space has the same origin.
        pattern.setAttribute('x', format(skiaTilePatternOffset(optionalProperty(tile, 'offsetXEmu')) - pageX));
        pattern.setAttribute('y', format(skiaTilePatternOffset(optionalProperty(tile, 'offsetYEmu')) - pageY));
        const flipX: boolean = optionalProperty(tile, 'flip') === 'x' || optionalProperty(tile, 'flip') === 'xy';
        const flipY: boolean = optionalProperty(tile, 'flip') === 'y' || optionalProperty(tile, 'flip') === 'xy';
        pattern.setAttribute('width', format(tileWidth * (flipX ? 2 : 1)));
        pattern.setAttribute('height', format(tileHeight * (flipY ? 2 : 1)));
        const appendTile: (x: number, y: number, mirrorX: boolean, mirrorY: boolean) => void = (
            x: number,
            y: number,
            mirrorX: boolean,
            mirrorY: boolean
        ): void => {
            const image: SVGImageElement = document.createElementNS(SVG_NS, 'image') as SVGImageElement;
            image.setAttribute('href', url);
            image.setAttribute('x', format(mirrorX ? 0 : x));
            image.setAttribute('y', format(mirrorY ? 0 : y));
            image.setAttribute('width', format(tileWidth)); image.setAttribute('height', format(tileHeight));
            image.setAttribute('preserveAspectRatio', 'none');
            if (mirrorX || mirrorY) {
                image.setAttribute('transform',
                                   `translate(${format(x + (mirrorX ? tileWidth : 0))} ${format(y + (mirrorY ? tileHeight : 0))}) ` +
                    `scale(${mirrorX ? -1 : 1} ${mirrorY ? -1 : 1})`);
            }
            image.dataset.tileFlip = optionalProperty(tile, 'flip') || 'none';
            applyPictureEffects(image, picture);
            pattern.appendChild(image);
        };
        appendTile(0, 0, false, false);
        if (flipX) {
            appendTile(tileWidth, 0, true, false);
        }
        if (flipY) {
            appendTile(0, tileHeight, false, true);
        }
        if (flipX && flipY) {
            appendTile(tileWidth, tileHeight, true, true);
        }
        defs.appendChild(pattern);
        const rect: SVGRectElement = document.createElementNS(SVG_NS, 'rect') as SVGRectElement;
        rect.classList.add('ej2-pptx-picture');
        rect.setAttribute('width', format(width));
        rect.setAttribute('height', format(height));
        rect.setAttribute('fill', `url(#${pattern.id})`);
        rect.setAttribute('clip-path', `url(#${clipId})`);
        return rect;
    }

    /*
 * Ports text-object dispatch after SVG shape paint, using real HTML text.
 * @param {SlideRenderModel} model - model
 * @param {SlideShapeLevels} levels - levels
 * @param {TextMeasurer} measurer - measurer
 * @param {TextHyperlinkActivationHandler} onHyperlink - onHyperlink
 * @returns {Promise} result
 */
    public async renderText(
        model: SlideRenderModel<SlideShapeSnapshot>,
        levels: SlideShapeLevels,
        measurer: TextMeasurer,
        onHyperlink?: TextHyperlinkActivationHandler
    ): Promise<void> {
        const generation: number = ++this.renderGeneration;
        const flattened: ReadonlyArray<FlattenedPaintEntry> = flattenPaintEntries(model);
        const plan: PaintOrderPlan = planPaintOrderLayers(flattened.map(toPaintOrderCandidate));
        const plannedLayers: ReadonlyArray<PaintOrderLayer> =
            plan.layers.length > 0 ? plan.layers : [{ candidateIndexes: [] }];
        const textLayers: ReadonlyArray<HTMLElement> = Array.from(
            this.host.querySelectorAll<HTMLElement>(':scope > .ej2-pptx-text-layer[data-paint-layer-kind="html"]'));
        for (let layerIndex: number = 0; layerIndex < plannedLayers.length; layerIndex++) {
            const textLayer: HTMLElement | undefined = textLayers[layerIndex];
            if (!textLayer) {
                continue;
            }
            // Pictures (image sub-layer) and tables are painted before text; only stale text is cleared.
            Array.from(textLayer.children).forEach((child: Element): void => {
                if (!child.classList.contains(IMAGE_LAYER_CLASS) && !child.classList.contains('ej2-pptx-table-frame')) {
                    child.remove();
                }
            });
            for (const entryIndex of plannedLayers[layerIndex].candidateIndexes) {
                const entry: FlattenedPaintEntry = flattened[entryIndex];
                await this.emitTextShape(
                    entry.textShape, entry.source, textLayer, model,
                    levels, measurer, generation, onHyperlink);
                if (generation !== this.renderGeneration) {
                    return;
                }
            }
        }
    }

    /*
 * ports recursive `RendererBase.DrawGroupShape` dispatch for the HTML text overlay.
 * @param {SlideShapeSnapshot} shape - shape
 * @param {string} source - source
 * @param {HTMLElement} host - host
 * @param {SlideRenderModel} model - model
 * @param {SlideShapeLevels} levels - levels
 * @param {TextMeasurer} measurer - measurer
 * @param {number} generation - generation
 * @param {TextHyperlinkActivationHandler} onHyperlink - onHyperlink
 * @returns {Promise} result
 */
    private async emitTextShape(
        shape: SlideShapeSnapshot,
        source: 'master' | 'layout' | 'slide',
        host: HTMLElement,
        model: SlideRenderModel<SlideShapeSnapshot>,
        levels: SlideShapeLevels,
        measurer: TextMeasurer,
        generation: number,
        onHyperlink?: TextHyperlinkActivationHandler
    ): Promise<void> {
        if (shape.hidden) {
            return;
        }
        if (shape.elementKind === 'grpSp') {
            const transform: import('@syncfusion/ej2-pptx').DirectTransform = shape.transform;
            const childSpace: import('@syncfusion/ej2-pptx').GroupChildSpace = shape.groupChildSpace;
            if (!transform || transform.cx === undefined || transform.cy === undefined ||
            !optionalProperty(childSpace, 'chOff') || !childSpace.chExt) {
                return;
            }
            const groupTransform: GroupTransform = {
                x: emuToPoint(transform.x || 0), y: emuToPoint(transform.y || 0),
                width: emuToPoint(transform.cx), height: emuToPoint(transform.cy),
                childX: emuToPoint(childSpace.chOff.x), childY: emuToPoint(childSpace.chOff.y),
                childWidth: emuToPoint(childSpace.chExt.width), childHeight: emuToPoint(childSpace.chExt.height),
                flipHorizontal: transform.flipHorizontal === true,
                flipVertical: transform.flipVertical === true,
                rotationDegrees: transform.rotationDegrees || 0
            };
            for (const child of shape.children || []) {
                await this.emitTextShape(
                    mapTextShapeIntoGroup(child, groupTransform), source, host,
                    model, levels, measurer, generation, onHyperlink);
                if (generation !== this.renderGeneration) {
                    return;
                }
            }
            return;
        }
        if (!shape.textBody) {
            return;
        }
        // Placeholder prompt text belongs to the editing surface. The slide
        // resolves its values from layout/master but does not paint those prompt
        // strings as separate objects in the Skia slideshow render path.
        if (source !== 'slide' && shape.placeholder) {
            return;
        }
        const body: import('@syncfusion/ej2-pptx').ResolvedTextBody = resolveTextBody(shape, levels, model.theme);
        const transform: import('@syncfusion/ej2-pptx').DirectTransform = resolveTextTransform(shape, levels);
        if (!body || !transform) {
            return;
        }
        const adjustments: Record<string, number> = {};
        if (shape.geometry.kind === 'preset') {
            shape.geometry.adjustments.forEach((guide: import('@syncfusion/ej2-pptx').GeometryGuide): void => {
                const match: RegExpMatchArray | null = guide.formula.match(
                    /^val\s+(-?(?:\d+(?:\.\d*)?|\.\d+))$/u);
                if (match) {
                    adjustments[guide.name] = Number(match[1]);
                }
            });
        }
        const textFrame: import('../render/text/shape-text-bounds').ShapeTextBounds = shape.geometry.kind === 'preset'
            ? resolvePresetTextBounds(shape.geometry.preset, emuToPoint(transform.cx || 0),
                                      emuToPoint(transform.cy || 0), adjustments)
            : undefined;
        const layout: import('../render/index').TextBoxLayout = await layoutTextBody(
            body, transform, measurer as unknown as import('@syncfusion/ej2-pptx').TextMeasurer,
            model.theme, textFrame);
        if (generation !== this.renderGeneration) {
            return;
        }
        const box: HTMLElement = emitHtmlTextBox(host, shape.id, layout, shape.name, onHyperlink, body);
        box.dataset.source = source;
        box.dataset.proofDefaultFontSizePt = String(nullishValue(optionalProperty(body.paragraphs[0], 'defaultFontSizePt'), () => ''));
        box.dataset.proofFontSizeSource = optionalProperty(optionalProperty(body.paragraphs[0], 'styleSources'), 'fontSizePt') || '';
    }

    /*
 * ports `RendererBase.DrawShape` dispatch and `GDIRenderer.DrawShape` paint order.
 * @param {SlideShapeSnapshot} shape - shape
 * @param {string} source - source
 * @param {SlideRenderModel} model - model
 * @param {number} index - index
 * @returns {SVGElement|undefined} result
 */
    private emitShape(
        shape: SlideShapeSnapshot,
        source: 'master' | 'layout' | 'slide',
        model: SlideRenderModel<SlideShapeSnapshot>,
        index: number
    ): SVGElement | undefined {
        if (shape.hidden) {
            return undefined;
        }
        if (shape.elementKind === 'grpSp') {
            return this.emitGroup(shape, source, model, index);
        }
        if (shape.contentKind === 'table' && shape.table) {
            return undefined;
        }
        if (shape.elementKind !== 'sp' && shape.elementKind !== 'cxnSp') {
            return this.emitPlaceholder(shape, source);
        }
        const transform: import('@syncfusion/ej2-pptx').DirectTransform = shape.transform;
        if (!transform || transform.cx === undefined || transform.cy === undefined) {
            return undefined;
        }
        const width: number = emuToPoint(transform.cx);
        const height: number = emuToPoint(transform.cy);
        if (width < 0 || height < 0 || (width === 0 && height === 0)) {
            return undefined;
        }
        const adjustments: Record<string, number> = {};
        const authoredAdjustments: ReadonlyArray<import('@syncfusion/ej2-pptx').GeometryGuide> = shape.geometry.kind === 'none' ? [] : shape.geometry.adjustments;
        for (const guide of authoredAdjustments) {
            const match: RegExpMatchArray | null = guide.formula.match(/^val\s+(-?(?:\d+(?:\.\d*)?|\.\d+))$/);
            if (match) {
                adjustments[guide.name] = Number(match[1]);
            }
        }
        const preset: string | undefined = shape.geometry.kind === 'preset' ? shape.geometry.preset : undefined;
        const isConnector: boolean = shape.elementKind === 'cxnSp' || Boolean(preset && /Connector/.test(preset));
        const batchGeometry: EvaluatedPresetGeometry | undefined = preset ? evaluateBatchBPreset(
            preset, width, height, adjustments) || evaluateBatchCPreset(preset, width, height, adjustments) : undefined;
        const geometry: import('../render/index').EvaluatedGeometry = preset ? evaluateBasicPreset(preset, width, height, adjustments) || batchGeometry : undefined;
        const customPaths: ReadonlyArray<EvaluatedPresetPath> | undefined = shape.geometry.kind === 'custom'
            ? evaluateCustomGeometry(shape.geometry, width, height).paths : undefined;
        const connectorPath: string | undefined = isConnector && preset
            ? routeConnector(preset, width, height, adjustments).path : undefined;
        if (!geometry && !customPaths && !connectorPath) {
            return undefined;
        }
        const group: SVGGElement = document.createElementNS(SVG_NS, 'g') as SVGGElement;
        const geometryPaths: ReadonlyArray<EvaluatedPresetPath> = customPaths || (batchGeometry
            ? batchGeometry.paths
            : [{ path: connectorPath || optionalProperty(geometry, 'path') || '', points: [], fill: isConnector ? 'none' : 'norm', stroke: true }]);
        geometryPaths.forEach((geometryPath: EvaluatedPresetPath, pathIndex: number): void => {
            const path: SVGPathElement = document.createElementNS(SVG_NS, 'path') as SVGPathElement;
            path.classList.add('ej2-pptx-shape');
            path.dataset.shapeId = shape.id;
            path.dataset.elementKind = shape.elementKind;
            path.dataset.source = source;
            path.setAttribute('aria-hidden', 'true');
            path.setAttribute('d', geometryPath.path);
            if (geometryPath.fill === 'none') {
                path.setAttribute('fill', 'none');
            } else {
                this.applyFill(group, path, shape, model, index * 100 + pathIndex, width, height);
            }
            if (geometryPath.stroke) {
                this.applyLine(group, path, shape, model, index * 100 + pathIndex);
            } else {
                path.setAttribute('stroke', 'none');
            }
            group.appendChild(path);
        });
        this.applyOuterShadow(group, shape, model, index);
        const x: number = emuToPoint(transform.x || 0);
        const y: number = emuToPoint(transform.y || 0);
        const operations: string[] = [`translate(${format(x)} ${format(y)})`];
        const centerX: number = width / 2;
        const centerY: number = height / 2;
        if (transform.rotationDegrees) {
            operations.push(`rotate(${format(transform.rotationDegrees)} ${format(centerX)} ${format(centerY)})`);
        }
        const flipHorizontal: boolean = transform.flipHorizontal === true;
        const flipVertical: boolean = transform.flipVertical === true;
        if (flipHorizontal || flipVertical) {
            operations.push(`translate(${format(centerX)} ${format(centerY)})`);
            operations.push(`scale(${flipHorizontal ? -1 : 1} ${flipVertical ? -1 : 1})`);
            operations.push(`translate(${format(-centerX)} ${format(-centerY)})`);
        }
        group.setAttribute('transform', operations.join(' '));
        return group;
    }

    private applyOuterShadow(
        group: SVGGElement,
        shape: SlideShapeSnapshot,
        model: SlideRenderModel<SlideShapeSnapshot>,
        index: number
    ): void {
        const shadow: import('@syncfusion/ej2-pptx').OuterShadowEffectSnapshot = ((shape.effects) !== undefined && (shape.effects) !== null ? (shape.effects).find((effect: import('@syncfusion/ej2-pptx').OuterShadowEffectSnapshot): boolean => effect.kind === 'outerShadow') : undefined);
        if (!shadow) {
            return;
        }
        const id: string = `ej2-pptx-shadow-${index}-${safeId(shape.id)}`;
        const defs: SVGDefsElement = document.createElementNS(SVG_NS, 'defs') as SVGDefsElement;
        const filter: SVGFilterElement = document.createElementNS(SVG_NS, 'filter') as SVGFilterElement;
        filter.id = id;
        filter.setAttribute('x', '-50%'); filter.setAttribute('y', '-50%');
        filter.setAttribute('width', '200%'); filter.setAttribute('height', '200%');
        const dropShadow: SVGElement = document.createElementNS(SVG_NS, 'feDropShadow') as SVGElement;
        const distance: number = emuToPoint(shadow.distanceEmu || 0);
        const radians: number = (shadow.directionDegrees || 0) * Math.PI / 180;
        const color: RenderColor = resolveRenderColor(shadow.color, shadow.colorTransforms, model.theme);
        dropShadow.setAttribute('dx', format(distance * Math.cos(radians)));
        dropShadow.setAttribute('dy', format(distance * Math.sin(radians)));
        dropShadow.setAttribute('stdDeviation', format(emuToPoint(shadow.blurRadiusEmu || 0) / 2));
        dropShadow.setAttribute('flood-color', color.color);
        dropShadow.setAttribute('flood-opacity', format(color.opacity));
        filter.appendChild(dropShadow);
        defs.appendChild(filter);
        group.prepend(defs);
        group.dataset.effect = 'outerShadow';
        group.setAttribute('filter', `url(#${id})`);
    }

    /*
 * Emits a table as HTML `<table>` through `TableRenderer`; ports `RendererBase.DrawTable`.
 * @param {HTMLElement} host - Text layer receiving the table frame.
 * @param {SlideShapeSnapshot} shape - Table graphic frame.
 * @param {SlideShapeSnapshot} placed - Frame mapped into slide space (group aware).
 * @param {string} source - Display-list source.
 * @param {SlideRenderModel} model - Render model supplying the theme.
 * @returns {void}
 */
    private emitTable(
        host: HTMLElement,
        shape: SlideShapeSnapshot,
        placed: SlideShapeSnapshot,
        source: 'master' | 'layout' | 'slide',
        model: SlideRenderModel<SlideShapeSnapshot>
    ): void {
        const transform: import('@syncfusion/ej2-pptx').DirectTransform = placed.transform;
        if (!transform || transform.cx === undefined || transform.cy === undefined) {
            return;
        }
        const frame: HTMLDivElement | undefined = new TableRenderer().render({
            shapeId: shape.id,
            name: shape.name,
            table: shape.table as TableRenderSnapshot,
            bounds: {
                xPt: emuToPoint(transform.x || 0), yPt: emuToPoint(transform.y || 0),
                widthPt: emuToPoint(transform.cx), heightPt: emuToPoint(transform.cy),
                rotationDegrees: transform.rotationDegrees || 0,
                flipHorizontal: transform.flipHorizontal === true,
                flipVertical: transform.flipVertical === true
            },
            theme: model.theme,
            onCell: (cell: HTMLElement, snapshot: TableCellRenderSnapshot, text: string): void => {
                if (text) {
                    registerClipboardTableCell(this.host, cell, {
                        shapeId: shape.id, row: snapshot.row, column: snapshot.column,
                        rowSpan: snapshot.rowSpan, columnSpan: snapshot.columnSpan, text
            });
        }
    }
        });
        if (frame) {
            frame.dataset.source = source;
            host.appendChild(frame);
    }
        }

    /*
     * Emits visible, accessible Stage 1 evidence for content that is not yet drawn natively.
     *
     * @param {SlideShapeSnapshot} shape Authored content snapshot and transform.
     * @returns {SVGElement | undefined} An accessible placeholder, or undefined for missing/empty bounds.
 * @param {string} source - source
     */
    private emitPlaceholder(
        shape: SlideShapeSnapshot,
        source: 'master' | 'layout' | 'slide'
    ): SVGElement | undefined {
        const transform: SlideShapeSnapshot['transform'] = shape.transform;
        if (!transform || transform.cx === undefined || transform.cy === undefined) {
            return undefined;
        }
        const width: number = emuToPoint(transform.cx);
        const height: number = emuToPoint(transform.cy);
        if (width <= 0 || height <= 0) {
            return undefined;
        }
        const label: string = placeholderLabel(shape);
        const group: SVGGElement = document.createElementNS(SVG_NS, 'g') as SVGGElement;
        group.classList.add('ej2-pptx-content-placeholder');
        group.dataset.shapeId = shape.id;
        group.dataset.source = source;
        group.dataset.placeholderKind = placeholderKind(shape);
        group.setAttribute('role', 'img');
        group.setAttribute('aria-label', `${label} placeholder: ${shape.name || `shape ${shape.id}`}`);
        group.setAttribute('transform', objectTransform(shape, width, height));

        const title: SVGTitleElement = document.createElementNS(SVG_NS, 'title') as SVGTitleElement;
        title.textContent = `${label} placeholder`;
        const rect: SVGRectElement = document.createElementNS(SVG_NS, 'rect') as SVGRectElement;
        rect.setAttribute('width', format(width));
        rect.setAttribute('height', format(height));
        rect.setAttribute('rx', format(Math.min(6, width / 12, height / 12)));
        rect.setAttribute('fill', '#F8FAFC');
        rect.setAttribute('fill-opacity', '0.92');
        rect.setAttribute('stroke', '#475569');
        rect.setAttribute('stroke-width', '1.5');
        rect.setAttribute('stroke-dasharray', '6 4');
        const text: SVGTextElement = document.createElementNS(SVG_NS, 'text') as SVGTextElement;
        text.setAttribute('x', format(width / 2));
        text.setAttribute('y', format(height / 2));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('fill', '#334155');
        text.setAttribute('font-family', 'Arial, sans-serif');
        text.setAttribute('font-size', format(Math.max(8, Math.min(18, height / 5, width / 7))));
        text.setAttribute('font-weight', '700');
        text.textContent = label.toUpperCase();
        group.append(title, rect, text);
        return group;
    }

    /*
 * ports `RendererBase.DrawGroupShape` recursive z-order and child-space transform.
 * @param {SlideShapeSnapshot} shape - shape
 * @param {string} source - source
 * @param {SlideRenderModel} model - model
 * @param {number} index - index
 * @returns {SVGElement|undefined} result
 */
    private emitGroup(
        shape: SlideShapeSnapshot,
        source: 'master' | 'layout' | 'slide',
        model: SlideRenderModel<SlideShapeSnapshot>,
        index: number
    ): SVGElement | undefined {
        const transform: import('@syncfusion/ej2-pptx').DirectTransform = shape.transform;
        const childSpace: import('@syncfusion/ej2-pptx').GroupChildSpace = shape.groupChildSpace;
        if (!transform || transform.cx === undefined || transform.cy === undefined ||
        !optionalProperty(childSpace, 'chOff') || !childSpace.chExt) {
            return undefined;
        }
        const group: SVGGElement = document.createElementNS(SVG_NS, 'g') as SVGGElement;
        group.classList.add('ej2-pptx-shape-group');
        group.dataset.shapeId = shape.id;
        group.dataset.elementKind = shape.elementKind;
        group.dataset.source = source;
        group.setAttribute('transform', groupSvgTransform({
            x: emuToPoint(transform.x || 0), y: emuToPoint(transform.y || 0),
            width: emuToPoint(transform.cx), height: emuToPoint(transform.cy),
            childX: emuToPoint(childSpace.chOff.x), childY: emuToPoint(childSpace.chOff.y),
            childWidth: emuToPoint(childSpace.chExt.width), childHeight: emuToPoint(childSpace.chExt.height),
            flipHorizontal: transform.flipHorizontal === true,
            flipVertical: transform.flipVertical === true,
            rotationDegrees: transform.rotationDegrees || 0
        }));
        (shape.children || []).forEach((child: SlideShapeSnapshot, childIndex: number): void => {
            const element: SVGElement | undefined = this.emitShape(child, source, model, index * 100 + childIndex);
            if (element) {
                group.appendChild(element);
            }
        });
        return group;
    }

    private applyFill(
        group: SVGGElement,
        path: SVGPathElement,
        shape: SlideShapeSnapshot,
        model: SlideRenderModel<SlideShapeSnapshot>,
        index: number,
        width: number,
        height: number
    ): void {
        const fill: import('@syncfusion/ej2-pptx').DirectFill = shape.fill;
        if (fill.kind === 'solid') {
            const color: RenderColor = resolveRenderColor(fill.color, fill.colorTransforms, model.theme);
            path.setAttribute('fill', color.color);
            path.setAttribute('fill-opacity', format(color.opacity));
            return;
        }
        if (fill.kind === 'gradient') {
            const id: string = `ej2-pptx-shape-gradient-${index}`;
            const paint: BackgroundPaint = renderBackground({
                source: 'slide', background: { kind: 'fill', fill }
            }, model.theme);
            if (paint.kind !== 'linearGradient' && paint.kind !== 'radialGradient') {
                return;
            }
            const gradient: SVGLinearGradientElement | SVGRadialGradientElement = paint.kind === 'radialGradient'
                ? document.createElementNS(SVG_NS, 'radialGradient') as SVGRadialGradientElement
                : document.createElementNS(SVG_NS, 'linearGradient') as SVGLinearGradientElement;
            gradient.id = id;
            if (paint.kind === 'linearGradient') {
                const vector: GradientVector = gradientVector(paint.angle);
                // ports Net.Core `LinearGradientBrush(pathBounds, ..., false)`:
                // coordinates are evaluated in device/user space. Object-box
                // coordinates invert the aspect-ratio contribution to angle.
                gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
                gradient.setAttribute('x1', format(vector.x1 * width));
                gradient.setAttribute('y1', format(vector.y1 * height));
                gradient.setAttribute('x2', format(vector.x2 * width));
                gradient.setAttribute('y2', format(vector.y2 * height));
            } else {
                gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
                gradient.setAttribute('cx', format(paint.centerX * width));
                gradient.setAttribute('cy', format(paint.centerY * height));
                gradient.setAttribute('fx', format(paint.focusX * width));
                gradient.setAttribute('fy', format(paint.focusY * height));
                gradient.setAttribute('r', format(paint.radiusOfMaxDimension * Math.max(width, height)));
            }
            for (const value of paint.stops) {
                const stop: SVGStopElement = document.createElementNS(SVG_NS, 'stop') as SVGStopElement;
                stop.setAttribute('offset', format(value.offset));
                stop.setAttribute('stop-color', value.color);
                stop.setAttribute('stop-opacity', format(value.opacity));
                gradient.appendChild(stop);
            }
            const defs: SVGDefsElement = document.createElementNS(SVG_NS, 'defs') as SVGDefsElement;
            defs.appendChild(gradient);
            group.appendChild(defs);
            path.setAttribute('fill', `url(#${id})`);
            return;
        }
        if (fill.kind === 'pattern') {
            const id: string = `ej2-pptx-shape-pattern-${index}`;
            const pattern: SVGPatternElement = document.createElementNS(SVG_NS, 'pattern') as SVGPatternElement;
            pattern.id = id;
            pattern.setAttribute('patternUnits', 'userSpaceOnUse');
            // ports GDI HatchBrush's 8-device-pixel cross cell at 96 dpi.
            pattern.setAttribute('width', '6');
            pattern.setAttribute('height', '6');
            const background: RenderColor = resolveRenderColor(fill.backgroundColor, fill.backgroundTransforms, model.theme);
            const foreground: RenderColor = resolveRenderColor(fill.foregroundColor, fill.foregroundTransforms, model.theme);
            const rect: SVGRectElement = document.createElementNS(SVG_NS, 'rect') as SVGRectElement;
            rect.setAttribute('width', '6'); rect.setAttribute('height', '6'); rect.setAttribute('fill', background.color);
            const stripe: SVGPathElement = document.createElementNS(SVG_NS, 'path') as SVGPathElement;
            stripe.setAttribute('d', patternPath(fill.preset));
            stripe.setAttribute('stroke', foreground.color);
            stripe.setAttribute('stroke-width', '0.75');
            pattern.appendChild(rect); pattern.appendChild(stripe);
            const defs: SVGDefsElement = document.createElementNS(SVG_NS, 'defs') as SVGDefsElement;
            defs.appendChild(pattern); group.appendChild(defs);
            path.setAttribute('fill', `url(#${id})`);
            path.dataset.pattern = fill.preset || 'unknown';
            return;
        }
        if (fill.kind === 'noFill') {
            // An explicit a:noFill overrides the style's fillRef.
            path.setAttribute('fill', 'none');
            return;
        }
        const fillRef: NonNullable<SlideShapeSnapshot['styleRefs']>['fillRef'] = optionalProperty(shape.styleRefs, 'fillRef');
        const fillStyleIndex: number = Number(optionalProperty(fillRef, 'idx') || 0);
        const themeFill: SlideFrameFill | undefined = fillStyleIndex > 0
            ? optionalProperty(optionalProperty(model.theme, 'fillStyles'), fillStyleIndex - 1) : undefined;
        if (themeFill !== undefined && themeFill.kind === 'solid') {
            const solidThemeFill: Extract<SlideFrameFill, { readonly kind: 'solid' }> = themeFill;
            const color: RenderColor = resolveRenderColor(
                solidThemeFill.color, solidThemeFill.colorTransforms, model.theme,
                optionalProperty(fillRef, 'color'), optionalProperty(fillRef, 'colorTransforms'));
            path.setAttribute('fill', color.color);
            path.setAttribute('fill-opacity', format(color.opacity));
            return;
        }
        path.setAttribute('fill', 'none');
    }

    private applyLine(
        group: SVGGElement,
        path: SVGPathElement,
        shape: SlideShapeSnapshot,
        model: SlideRenderModel<SlideShapeSnapshot>,
        index: number
    ): void {
        const direct: DirectLine = shape.line;
        const lineRef: import('@syncfusion/ej2-pptx').StyleMatrixReference = optionalProperty(shape.styleRefs, 'lnRef');
        const themeLine: import('./slide-frame-model').SlideFrameLineStyle = lineRef ? optionalProperty(optionalProperty(model.theme, 'lineStyles'), Math.max(0, Number(lineRef.idx) - 1)) : undefined;
        const fill: SlideFrameFill = direct.fill.kind !== 'missing' ? direct.fill : optionalProperty(themeLine, 'fill');
        if (!fill || fill.kind !== 'solid') {
            path.setAttribute('stroke', 'none');
            return;
        }
        const color: RenderColor = resolveRenderColor(
            fill.color, fill.colorTransforms, model.theme,
            optionalProperty(lineRef, 'color'), optionalProperty(lineRef, 'colorTransforms'));
        const width: number = direct.widthEmu !== undefined
            ? emuToPoint(direct.widthEmu)
            : optionalProperty(themeLine, 'width') === undefined ? 1 : themeLine.width;
        path.setAttribute('stroke', color.color);
        path.setAttribute('stroke-opacity', format(color.opacity));
        path.setAttribute('stroke-width', format(width));
        const cap: string | undefined = nullishValue(direct.cap, () => optionalProperty(themeLine, 'cap'));
        path.setAttribute('stroke-linecap', cap === 'rnd' ? 'round' : cap === 'sq' ? 'square' : 'butt');
        const join: import('@syncfusion/ej2-pptx').LineJoin = direct.join;
        path.setAttribute('stroke-linejoin', optionalProperty(join, 'kind') === 'round'
            ? 'round' : optionalProperty(join, 'kind') === 'bevel' ? 'bevel' : 'miter');
        // Licensed Net.Core 35.1.39 accepts preset dash metadata but its Skia path
        // paints the tested presets solid; Stage 1 intentionally ports that output.
        const presetDash: string | undefined = nullishValue(direct.presetDash, () => optionalProperty(themeLine, 'dash'));
        if (presetDash) {
            path.dataset.requestedDash = presetDash;
            if (!MATCH_SKIA_SOLID_PRESET_DASH) {
                const dash: string | undefined = dashArray(presetDash, width);
                if (dash) {
                    path.setAttribute('stroke-dasharray', dash);
                }
            }
        }
        this.applyLineEnd(group, path, direct.present ? direct.headEnd : undefined, color.color, width, `head-${index}`, 'start');
        this.applyLineEnd(group, path, direct.present ? direct.tailEnd : undefined, color.color, width, `tail-${index}`, 'end');
    }

    /*
 * ports `GDIRenderer.GetCustomLineGapGraphicsPath`.
 * @param {SVGGElement} group - group
 * @param {SVGPathElement} path - path
 * @param {Object} lineEnd - lineEnd
 * @param {string} color - color
 * @param {number} lineWidth - lineWidth
 * @param {string} idSuffix - idSuffix
 * @param {string} edge - edge
 * @returns {void} result
 */
    private applyLineEnd(
        group: SVGGElement,
        path: SVGPathElement,
        lineEnd: SlideShapeSnapshot['line']['headEnd'],
        color: string,
        lineWidth: number,
        idSuffix: string,
        edge: 'start' | 'end'
    ): void {
        if (!optionalProperty(lineEnd, 'type') || lineEnd.type === 'none') {
            return;
        }
        const marker: SVGMarkerElement = document.createElementNS(SVG_NS, 'marker') as SVGMarkerElement;
        const id: string = `ej2-pptx-line-end-${idSuffix}`;
        const length: number = lineEnd.length === 'lg' ? 5 : lineEnd.length === 'sm' ? 2 : 3;
        const width: number = lineEnd.width === 'lg' ? 5 : lineEnd.width === 'sm' ? 2 : 3;
        marker.id = id;
        marker.setAttribute('markerUnits', 'strokeWidth');
        marker.setAttribute('orient', 'auto-start-reverse');
        // The marker x-axis follows the path direction, so each cap keeps its
        // tip at the connector endpoint (refX/refY 0) and its body along -x.
        marker.setAttribute('refX', '0');
        marker.setAttribute('refY', '0');
        let cap: SVGPathElement | SVGEllipseElement;
        if (lineEnd.type === 'oval') {
            marker.setAttribute('viewBox', `${format(-2 * length)} ${format(-width)} ${format(2 * length)} ${format(2 * width)}`);
            marker.setAttribute('markerWidth', format(2 * length));
            marker.setAttribute('markerHeight', format(2 * width));
            cap = document.createElementNS(SVG_NS, 'ellipse') as SVGEllipseElement;
            cap.setAttribute('cx', format(-length));
            cap.setAttribute('cy', '0');
            cap.setAttribute('rx', format(length));
            cap.setAttribute('ry', format(width));
            cap.setAttribute('fill', color);
        } else {
            const center: boolean = lineEnd.type === 'diamond';
            const originX: number = center ? -length / 2 : -length;
            marker.setAttribute('viewBox', `${format(originX)} ${format(-width)} ${format(length)} ${format(2 * width)}`);
            marker.setAttribute('markerWidth', format(length));
            marker.setAttribute('markerHeight', format(2 * width));
            cap = document.createElementNS(SVG_NS, 'path') as SVGPathElement;
            // Content geometry: tip at (0, 0), body behind it along the path axis.
            const values: Readonly<Record<string, string>> = {
                triangle: `M 0 0 L ${format(-length)} ${format(-width)} L ${format(-length)} ${format(width)} Z`,
                arrow: `M ${format(-length)} ${format(-width)} L 0 0 L ${format(-length)} ${format(width)}`,
                stealth: `M 0 0 L ${format(-length)} ${format(-width)} L ${format(-length / 2)} 0 L ${format(-length)} ${format(width)} Z`,
                // Diamond is centred on the endpoint, tip-to-tip along the path axis.
                diamond: `M ${format(length / 2)} 0 L 0 ${format(-width)} L ${format(-length / 2)} 0 L 0 ${format(width)} Z`
            };
            cap.setAttribute('d', values[lineEnd.type] || values.triangle);
            cap.setAttribute('fill', lineEnd.type === 'arrow' ? 'none' : color);
            cap.setAttribute('stroke', color);
            // markerUnits=strokeWidth already scales content by the line width,
            // so the open `arrow` chevron keeps the authored line thickness.
            cap.setAttribute('stroke-width', lineEnd.type === 'arrow' ? '1' : '0');
            cap.setAttribute('stroke-linecap', 'round');
            cap.setAttribute('stroke-linejoin', 'round');
        }
        marker.appendChild(cap);
        const defs: SVGDefsElement = document.createElementNS(SVG_NS, 'defs') as SVGDefsElement;
        defs.appendChild(marker); group.appendChild(defs);
        path.setAttribute(edge === 'start' ? 'marker-start' : 'marker-end', `url(#${id})`);
    }

    /*
 * Releases renderer-owned DOM and object URLs.
 * @returns {void} result
 */
    public destroy(): void {
        this.clear();
    }

    private emitBackground(paint: BackgroundPaint, width: number, height: number): SVGElement {
        if (paint.kind === 'picture') {
            return this.emitPicture(paint, width, height);
        }
        const group: SVGGElement = document.createElementNS(SVG_NS, 'g') as SVGGElement;
        const rect: SVGRectElement = document.createElementNS(SVG_NS, 'rect') as SVGRectElement;
        rect.setAttribute('x', '0');
        rect.setAttribute('y', '0');
        rect.setAttribute('width', format(width));
        rect.setAttribute('height', format(height));
        if (paint.kind === 'solid') {
            rect.setAttribute('fill', paint.color);
            rect.setAttribute('fill-opacity', format(paint.opacity));
            group.appendChild(rect);
            return group;
        }
        const defs: SVGDefsElement = document.createElementNS(SVG_NS, 'defs') as SVGDefsElement;
        const gradient: SVGLinearGradientElement | SVGRadialGradientElement = paint.kind === 'linearGradient'
            ? document.createElementNS(SVG_NS, 'linearGradient') as SVGLinearGradientElement
            : document.createElementNS(SVG_NS, 'radialGradient') as SVGRadialGradientElement;
        gradient.id = GRADIENT_ID;
        gradient.setAttribute('gradientUnits', 'objectBoundingBox');
        if (paint.kind === 'linearGradient') {
            const vector: GradientVector = gradientVector(paint.angle);
            gradient.setAttribute('x1', format(vector.x1));
            gradient.setAttribute('y1', format(vector.y1));
            gradient.setAttribute('x2', format(vector.x2));
            gradient.setAttribute('y2', format(vector.y2));
        } else {
            gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
            gradient.setAttribute('cx', format(paint.centerX * width));
            gradient.setAttribute('cy', format(paint.centerY * height));
            gradient.setAttribute('fx', format(paint.focusX * width));
            gradient.setAttribute('fy', format(paint.focusY * height));
            gradient.setAttribute('r', format(paint.radiusOfMaxDimension * Math.max(width, height)));
        }
        for (const value of paint.stops) {
            const stop: SVGStopElement = document.createElementNS(SVG_NS, 'stop') as SVGStopElement;
            stop.setAttribute('offset', format(value.offset));
            stop.setAttribute('stop-color', value.color);
            stop.setAttribute('stop-opacity', format(value.opacity));
            gradient.appendChild(stop);
        }
        defs.appendChild(gradient);
        group.appendChild(defs);
        rect.setAttribute('fill', `url(#${GRADIENT_ID})`);
        group.appendChild(rect);
        return group;
    }

    private emitPicture(
        paint: Extract<BackgroundPaint, { readonly kind: 'picture' }>,
        width: number,
        height: number
    ): SVGImageElement {
        const image: SVGImageElement = document.createElementNS(SVG_NS, 'image') as SVGImageElement;
        image.classList.add('ej2-pptx-slide-background-image');
        image.setAttribute('x', '0');
        image.setAttribute('y', '0');
        image.setAttribute('width', format(width));
        image.setAttribute('height', format(height));
        image.setAttribute('preserveAspectRatio', 'none');
        const source: string | undefined = paint.data
            ? this.createEmbeddedUrl(paint.data, paint.contentType)
            : paint.externalUrl;
        if (source) {
            image.setAttribute('href', source);
        }
        image.dataset.mode = paint.mode;
        return image;
    }

    private createEmbeddedUrl(data: ArrayBuffer, contentType?: string): string {
        const url: string = URL.createObjectURL(new Blob([data], {
            type: contentType ? normalizePictureMime(contentType) : 'application/octet-stream'
        }));
        this.objectUrls.add(url);
        return url;
    }

    private clear(): void {
        this.renderGeneration++;
        this.chartRendererDisposables.forEach((disposable: ChartRendererDisposable): void => {
            try {
                disposable.dispose();
            } catch {
                // Host cleanup must not prevent the editor from replacing a slide.
            }
        });
        this.chartRendererDisposables.clear();
        this.host.querySelectorAll(':scope > [data-paint-layer]').forEach((element: Element): void => element.remove());
        this.svg = null;
        this.textLayer = null;
        this.objectUrls.forEach((url: string): void => URL.revokeObjectURL(url));
        this.objectUrls.clear();
        delete this.host.dataset.backgroundSource;
        delete this.host.dataset.slideHidden;
        delete this.host.dataset.slideSizeType;
        delete this.host.dataset.paintLayerCount;
        delete this.host.dataset.paintLayerCap;
        delete this.host.dataset.paintLayerCapped;
        this.host.style.backgroundColor = '';
        this.host.style.backgroundImage = '';
    }
}

/**
 * Ports the presentation-order invariant of `RendererBase.BaseDrawSlide` while
 * preserving HTML text: later intersecting geometry opens a new layer pair.
 *
 * @param {ReadonlyArray<PaintOrderCandidate>} candidates Ordered paint candidates.
 * @param {number} maximumLayers Safety cap for generated layer pairs.
 * @returns {PaintOrderPlan} Bounded ordered layer plan.
 */
function planPaintOrderLayers(
    candidates: ReadonlyArray<PaintOrderCandidate>,
    maximumLayers: number = MAX_PAINT_ORDER_LAYERS
): PaintOrderPlan {
    if (!Number.isInteger(maximumLayers) || maximumLayers < 1) {
        throw new RangeError('maximumLayers must be a positive integer');
    }
    const layers: Array<{ candidateIndexes: number[]; textBounds: PaintOrderBounds[] }> = [];
    let capped: boolean = false;
    for (let index: number = 0; index < candidates.length; index++) {
        const candidate: PaintOrderCandidate = candidates[index];
        let layer: { candidateIndexes: number[]; textBounds: PaintOrderBounds[] } =
            layers[layers.length - 1];
        const intersectsEarlierText: boolean = Boolean(layer && candidate.paintsGeometry &&
            layer.textBounds.some((bounds: PaintOrderBounds): boolean => intersects(candidate.bounds, bounds)));
        if (!layer || (intersectsEarlierText && layers.length < maximumLayers)) {
            layer = { candidateIndexes: [], textBounds: [] };
            layers.push(layer);
        } else if (intersectsEarlierText) {
            capped = true;
        }
        layer.candidateIndexes.push(index);
        if (candidate.hasText) {
            layer.textBounds.push(candidate.bounds);
        }
    }
    return {
        layers: layers.map((layer: { candidateIndexes: number[]; textBounds: PaintOrderBounds[] }): PaintOrderLayer =>
            ({ candidateIndexes: layer.candidateIndexes })),
        capped
    };
}

/**
 * Tests whether two positive-area slide-space bounds overlap.
 *
 * @param {PaintOrderBounds} left First bounds.
 * @param {PaintOrderBounds} right Second bounds.
 * @returns {boolean} True when the bounds overlap.
 */
function intersects(left: PaintOrderBounds, right: PaintOrderBounds): boolean {
    return left.width > 0 && left.height > 0 && right.width > 0 && right.height > 0 &&
        left.x < right.x + right.width && left.x + left.width > right.x &&
        left.y < right.y + right.height && left.y + left.height > right.y;
}

/**
 * Flattens authored groups while retaining ancestor transforms and order.
 *
 * @param {SlideRenderModel} model Resolved slide render model.
 * @returns {ReadonlyArray<FlattenedPaintEntry>} Ordered leaf entries.
 */
function flattenPaintEntries(
    model: SlideRenderModel<SlideShapeSnapshot>
): ReadonlyArray<FlattenedPaintEntry> {
    const entries: FlattenedPaintEntry[] = [];
    let index: number = 0;
    const levels: SlideShapeLevels = {
        master: model.masterShapes || [], layout: model.layoutShapes || [], slide: []
    };
    const append: (
        shape: SlideShapeSnapshot,
        textShape: SlideShapeSnapshot,
        source: 'master' | 'layout' | 'slide',
        ancestors: ReadonlyArray<{ readonly shapeId: string; readonly transform: GroupTransform }>
    ) => void = (
        shape: SlideShapeSnapshot,
        textShape: SlideShapeSnapshot,
        source: 'master' | 'layout' | 'slide',
        ancestors: ReadonlyArray<{ readonly shapeId: string; readonly transform: GroupTransform }>
    ): void => {
        if (shape.hidden) {
            return;
        }
        if (shape.elementKind !== 'grpSp') {
            const placed: SlideShapeSnapshot = withInheritedTransform(shape, levels);
            entries.push({
                shape: placed, textShape: textShape === shape ? placed : textShape, source, ancestors, index
            });
            index++;
            return;
        }
        const geometryTransform: GroupTransform | undefined = groupTransformForShape(shape);
        const textTransform: GroupTransform | undefined = groupTransformForShape(textShape);
        if (!geometryTransform || !textTransform) {
            return;
        }
        for (const child of shape.children || []) {
            append(
                child,
                mapTextShapeIntoGroup(child, textTransform),
                source,
                [...ancestors, { shapeId: shape.id, transform: geometryTransform }]
            );
        }
    };
    for (const entry of model.displayList) {
        append(entry.item, entry.item, entry.source, []);
    }
    return entries;
}

/**
 * Gives a placeholder-bound picture or frame that authored no `a:xfrm` the position and size
 * of the matching layout/master placeholder, as PowerPoint does for an empty `p:spPr`.
 *
 * @param {SlideShapeSnapshot} shape Non-group slide element.
 * @param {SlideShapeLevels} levels Master and layout shapes that can supply the transform.
 * @returns {SlideShapeSnapshot} The same shape, or a copy carrying the inherited transform.
 */
function withInheritedTransform(shape: SlideShapeSnapshot, levels: SlideShapeLevels): SlideShapeSnapshot {
    if (shape.transform || !shape.placeholder || shape.elementKind === 'sp' || shape.elementKind === 'cxnSp') {
        return shape;
    }
    const inherited: SlideShapeSnapshot['transform'] = resolveTextTransform(shape, levels);
    return inherited ? { ...shape, transform: inherited } : shape;
}

/**
 * Resolves one group snapshot into the shared geometry transform model.
 *
 * @param {SlideShapeSnapshot} shape Group shape.
 * @returns {GroupTransform | undefined} Transform when group extents are complete.
 */
function groupTransformForShape(shape: SlideShapeSnapshot): GroupTransform | undefined {
    const transform: import('@syncfusion/ej2-pptx').DirectTransform = shape.transform;
    const childSpace: import('@syncfusion/ej2-pptx').GroupChildSpace = shape.groupChildSpace;
    if (!transform || transform.cx === undefined || transform.cy === undefined ||
    !optionalProperty(childSpace, 'chOff') || !childSpace.chExt) {
        return undefined;
    }
    return {
        x: emuToPoint(transform.x || 0), y: emuToPoint(transform.y || 0),
        width: emuToPoint(transform.cx), height: emuToPoint(transform.cy),
        childX: emuToPoint(childSpace.chOff.x), childY: emuToPoint(childSpace.chOff.y),
        childWidth: emuToPoint(childSpace.chExt.width), childHeight: emuToPoint(childSpace.chExt.height),
        flipHorizontal: transform.flipHorizontal === true,
        flipVertical: transform.flipVertical === true,
        rotationDegrees: transform.rotationDegrees || 0
    };
}

/**
 * Converts one flattened leaf into the planner's minimal input.
 *
 * @param {FlattenedPaintEntry} entry Flattened shape entry.
 * @returns {PaintOrderCandidate} Planner candidate.
 */
function toPaintOrderCandidate(entry: FlattenedPaintEntry): PaintOrderCandidate {
    return {
        id: entry.shape.id,
        bounds: paintBounds(entry.textShape),
        hasText: shapePaintsHtmlText(entry.textShape, entry.source) || shapePaintsHtmlImage(entry.shape) || shapePaintsHtmlTable(entry.shape),
        paintsGeometry: shapePaintsGeometry(entry.shape)
    };
}

/**
 * Computes conservative axis-aligned slide-space paint bounds.
 *
 * @param {SlideShapeSnapshot} shape Shape snapshot.
 * @returns {PaintOrderBounds} Rotated axis-aligned bounds.
 */
function paintBounds(shape: SlideShapeSnapshot): PaintOrderBounds {
    const transform: import('@syncfusion/ej2-pptx').DirectTransform = shape.transform;
    if (!transform || transform.cx === undefined || transform.cy === undefined) {
        return { x: 0, y: 0, width: 0, height: 0 };
    }
    const x: number = emuToPoint(transform.x || 0);
    const y: number = emuToPoint(transform.y || 0);
    const width: number = Math.abs(emuToPoint(transform.cx));
    const height: number = Math.abs(emuToPoint(transform.cy));
    const radians: number = Math.abs(transform.rotationDegrees || 0) * Math.PI / 180;
    const rotatedWidth: number = Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians));
    const rotatedHeight: number = Math.abs(width * Math.sin(radians)) + Math.abs(height * Math.cos(radians));
    return {
        x: x + (width - rotatedWidth) / 2,
        y: y + (height - rotatedHeight) / 2,
        width: rotatedWidth,
        height: rotatedHeight
    };
}

/**
 * Reports whether a leaf emits visible HTML text at this inheritance tier.
 *
 * @param {SlideShapeSnapshot} shape Shape snapshot.
 * @param {string} source Display-list source.
 * @returns {boolean} True when HTML text is emitted.
 */
function shapePaintsHtmlText(
    shape: SlideShapeSnapshot,
    source: 'master' | 'layout' | 'slide'
): boolean {
    return Boolean(shape.textBody && (source === 'slide' || !shape.placeholder));
}

/**
 * Reports whether a leaf is painted as an HTML picture. HTML pictures sit above their
 * layer's SVG geometry, so later overlapping geometry must open a new paint layer.
 *
 * @param {SlideShapeSnapshot} shape Shape snapshot.
 * @returns {boolean} True when the leaf is rendered as an HTML image.
 */
function shapePaintsHtmlImage(shape: SlideShapeSnapshot): boolean {
    return shape.elementKind === 'pic' || Boolean(shape.fallbackFrame && shape.fallbackFrame.preview);
}

/**
/**
 * Reports whether a leaf is painted as an HTML table, which sits above its layer's SVG geometry.
 *
 * @param {SlideShapeSnapshot} shape Shape snapshot.
 * @returns {boolean} True when the leaf is rendered as an HTML table.
 */
function shapePaintsHtmlTable(shape: SlideShapeSnapshot): boolean {
    return shape.contentKind === 'table' && Boolean(shape.table);
}

/**
 * Reports whether a leaf can cover earlier HTML text with painted geometry.
 *
 * @param {SlideShapeSnapshot} shape Shape snapshot.
 * @returns {boolean} True when geometry is painted.
 */
function shapePaintsGeometry(shape: SlideShapeSnapshot): boolean {
    if (shape.elementKind !== 'sp') {
        return true;
    }
    const fillKind: string = shape.fill.kind;
    const styledFill: boolean = Number(optionalProperty(optionalProperty(shape.styleRefs, 'fillRef'), 'idx') || 0) > 0;
    return Boolean(shape.pictureFill || shape.fallbackFrame || shape.table ||
        shape.line.present || styledFill || optionalProperty(shape.effects, 'length') ||
        (fillKind !== 'noFill' && fillKind !== 'none' && fillKind !== 'missing'));
}

/**
 * Ports the non-scaling-font part of `RendererBase.DrawGroupShape`: group
 * transforms change the child text frame, while the authored font size stays
 * unchanged. Applying a CSS matrix to the whole text subtree incorrectly
 * scales glyphs when `chExt` and `ext` differ.
 *
 * @param {SlideShapeSnapshot} shape - Child shape in group coordinates.
 * @param {GroupTransform} group - Parent group transform.
 * @returns {SlideShapeSnapshot} Child shape mapped into slide coordinates.
 */
function mapTextShapeIntoGroup(
    shape: SlideShapeSnapshot,
    group: GroupTransform
): SlideShapeSnapshot {
    const transform: import('@syncfusion/ej2-pptx').DirectTransform = shape.transform;
    if (!transform || transform.cx === undefined || transform.cy === undefined) {
        return shape;
    }
    const x: number = emuToPoint(transform.x || 0);
    const y: number = emuToPoint(transform.y || 0);
    const width: number = emuToPoint(transform.cx);
    const height: number = emuToPoint(transform.cy);
    const center: GeometryPoint = mapGroupPoint({
        x: x + width / 2, y: y + height / 2
    }, group);
    const horizontalStart: GeometryPoint = mapGroupPoint({ x, y }, group);
    const horizontalEnd: GeometryPoint = mapGroupPoint({ x: x + width, y }, group);
    const verticalEnd: GeometryPoint = mapGroupPoint({ x, y: y + height }, group);
    const mappedWidth: number = Math.hypot(
        horizontalEnd.x - horizontalStart.x, horizontalEnd.y - horizontalStart.y);
    const mappedHeight: number = Math.hypot(
        verticalEnd.x - horizontalStart.x, verticalEnd.y - horizontalStart.y);
    const groupAngle: number = Math.atan2(
        horizontalEnd.y - horizontalStart.y, horizontalEnd.x - horizontalStart.x) * 180 / Math.PI;
    return {
        ...shape,
        transform: {
            ...transform,
            x: (center.x - mappedWidth / 2) * 12700,
            y: (center.y - mappedHeight / 2) * 12700,
            cx: mappedWidth * 12700,
            cy: mappedHeight * 12700,
            rotationDegrees: (transform.rotationDegrees || 0) + groupAngle
        }
    };
}

interface GradientVector { readonly x1: number; readonly y1: number; readonly x2: number; readonly y2: number; }

/**
 * Produces the stable DOM category for an unsupported element.
 *
 * @param {SlideShapeSnapshot} shape Unsupported slide element.
 * @returns {string} Stable placeholder category.
 */
function placeholderKind(shape: SlideShapeSnapshot): string {
    if (shape.contentKind === 'diagram') {
        return 'smartArt';
    }
    if (shape.contentKind === 'unknown') {
        return shape.elementKind;
    }
    return shape.contentKind;
}

/**
 * Produces the user-facing placeholder family label.
 *
 * @param {SlideShapeSnapshot} shape Unsupported slide element.
 * @returns {string} Human-readable family label.
 */
function placeholderLabel(shape: SlideShapeSnapshot): string {
    const labels: Readonly<Record<string, string>> = {
        picture: 'Picture', table: 'Table', chart: 'Chart', diagram: 'SmartArt',
        ole: 'OLE', media: 'Media', unknown: 'Unsupported content'
    };
    return labels[shape.contentKind] || labels.unknown;
}

interface PictureSourceSelection {
    readonly source: PictureEmbeddedSourceSnapshot;
    readonly fallbackUsed: boolean;
}

function selectEmbeddedPictureSource(picture: PictureRenderSnapshot): PictureSourceSelection | undefined {
    if (picture.resolved.svg && isBrowserPictureMime(picture.resolved.svg.mimeType)) {
        return { source: picture.resolved.svg, fallbackUsed: false };
    }
    if (picture.resolved.embedded && isBrowserPictureMime(picture.resolved.embedded.mimeType)) {
        return { source: picture.resolved.embedded, fallbackUsed: false };
    }
    const fallback: PictureEmbeddedSourceSnapshot = optionalProperty(picture.resolved.alternateContentFallback, 'embedded');
    return fallback && isBrowserPictureMime(fallback.mimeType)
        ? { source: fallback, fallbackUsed: true }
        : undefined;
}

/**
 * Maps non-standard but widespread image content types (for example `image/jpg`, which many
 * producers declare for JPEG parts) to the registered media type browsers understand.
 *
 * @param {string} mimeType Content type declared by the package.
 * @returns {string} Registered media type, lower-cased.
 */
function normalizePictureMime(mimeType: string): string {
    const value: string = (mimeType || '').trim().toLowerCase();
    if (value === 'image/jpg' || value === 'image/pjpeg') {
        return 'image/jpeg';
    }
    return value === 'image/x-png' ? 'image/png' : value;
}

function isBrowserPictureMime(rawMimeType: string): boolean {
    const mimeType: string = normalizePictureMime(rawMimeType);
    return mimeType === 'image/png' || mimeType === 'image/jpeg' || mimeType === 'image/gif' ||
        mimeType === 'image/webp' || mimeType === 'image/bmp' || mimeType === 'image/svg+xml';
}

function unsupportedPictureIssue(
    shape: SlideShapeSnapshot,
    picture: PictureRenderSnapshot,
    fallbackUsed: boolean
): PictureUnsupportedIssue {
    const transform: import('@syncfusion/ej2-pptx').DirectTransform = shape.transform;
    const embeddedMime: string | undefined = optionalProperty(picture.resolved.embedded, 'mimeType');
    const metafile: boolean = embeddedMime === 'image/x-emf' || embeddedMime === 'image/x-wmf' ||
        embeddedMime === 'image/emf' || embeddedMime === 'image/wmf' || embeddedMime === 'image/tiff';
    return {
        shapeId: shape.id,
        shapeName: shape.name,
        kind: metafile ? 'metafile' : picture.resolved.linked ? 'linkedPicture' : 'picture',
        reason: picture.resolved.linked ? 'linked-picture-blocked' : embeddedMime
            ? 'unsupported-format' : 'missing-source',
        fallbackUsed,
        bounds: {
            x: emuToPoint(optionalProperty(transform, 'x') || 0), y: emuToPoint(optionalProperty(transform, 'y') || 0),
            width: emuToPoint(optionalProperty(transform, 'cx') || 0), height: emuToPoint(optionalProperty(transform, 'cy') || 0)
        }
    };
}

function unsupportedFrameIssue(
    shape: SlideShapeSnapshot,
    fallback: FallbackFrameRenderSnapshot,
    fallbackUsed: boolean
): FallbackFrameUnsupportedIssue {
    const transform: import('@syncfusion/ej2-pptx').DirectTransform = shape.transform;
    return {
        shapeId: shape.id,
        shapeName: shape.name,
        kind: fallback.kind === 'diagram' ? 'smartArt' : fallback.kind === 'unknown' ? 'other' : fallback.kind,
        reason: fallbackUsed ? 'preview-fallback-used' : 'native-content-not-rendered',
        fallbackUsed,
        bounds: {
            x: emuToPoint(optionalProperty(transform, 'x') || 0), y: emuToPoint(optionalProperty(transform, 'y') || 0),
            width: emuToPoint(optionalProperty(transform, 'cx') || 0), height: emuToPoint(optionalProperty(transform, 'cy') || 0)
        }
    };
}

/**
 * Ports the subset of `RendererBase.ApplyImageEffect` expressible as browser image filters.
 * @param {SVGImageElement} image - image
 * @param {PictureRenderSnapshot} picture - picture
 * @returns {void} result
 */
function applyPictureEffects(
    image: SVGImageElement,
    picture: PictureRenderSnapshot
): void {
    const filters: string[] = [];
    let opacity: number = 1;
    for (const effect of picture.direct.effects) {
        if (effect.kind === 'grayscale') {
            filters.push('grayscale(1)');
        }
        if (effect.kind === 'luminance') {
            if (effect.brightness !== undefined) {
                filters.push(`brightness(${format(1 + effect.brightness)})`);
            }
            if (effect.contrast !== undefined) {
                filters.push(`contrast(${format(1 + effect.contrast)})`);
            }
        }
        if (effect.kind === 'alphaModFix' && effect.amount !== undefined) {
            opacity *= effect.amount;
        }
        if (effect.kind === 'alphaOffset' && effect.amount !== undefined) {
            opacity += effect.amount;
        }
    }
    if (filters.length > 0) {
        image.style.filter = filters.join(' ');
    }
    if (opacity !== 1) {
        image.setAttribute('opacity', format(Math.max(0, Math.min(1, opacity))));
    }
}

/**
 * Returns the HTML image sub-layer, created as the first child so pictures sit under text.
 *
 * @param {HTMLElement} textLayer Paint layer HTML container.
 * @returns {HTMLElement} Image sub-layer.
 */
function imageSubLayer(textLayer: HTMLElement): HTMLElement {
    const existing: HTMLElement | null = textLayer.querySelector<HTMLElement>(`:scope > .${IMAGE_LAYER_CLASS}`);
    if (existing) {
        return existing;
    }
    const layer: HTMLElement = document.createElement('div');
    layer.className = IMAGE_LAYER_CLASS;
    layer.style.position = 'absolute';
    layer.style.left = '0';
    layer.style.top = '0';
    layer.style.width = '100%';
    layer.style.height = '100%';
    layer.style.pointerEvents = 'none';
    textLayer.insertBefore(layer, textLayer.firstChild);
    return layer;
}

function safeId(value: string): string {
    return value.replace(/[^A-Za-z0-9_-]/gu, '-');
}

/**
 * Resolves the authored object transform in SVG operation order.
 *
 * @param {SlideShapeSnapshot} shape Slide element carrying the authored transform.
 * @param {number} width Object width in points.
 * @param {number} height Object height in points.
 * @returns {string} SVG transform expression.
 */
function objectTransform(shape: SlideShapeSnapshot, width: number, height: number): string {
    const transform: SlideShapeSnapshot['transform'] = shape.transform;
    const operations: string[] = [
        `translate(${format(emuToPoint(optionalProperty(transform, 'x') || 0))} ${format(emuToPoint(optionalProperty(transform, 'y') || 0))})`
    ];
    const centerX: number = width / 2;
    const centerY: number = height / 2;
    if (optionalProperty(transform, 'rotationDegrees')) {
        operations.push(`rotate(${format(transform.rotationDegrees)} ${format(centerX)} ${format(centerY)})`);
    }
    if (optionalProperty(transform, 'flipHorizontal') || optionalProperty(transform, 'flipVertical')) {
        operations.push(`translate(${format(centerX)} ${format(centerY)})`);
        operations.push(`scale(${transform.flipHorizontal ? -1 : 1} ${transform.flipVertical ? -1 : 1})`);
        operations.push(`translate(${format(-centerX)} ${format(-centerY)})`);
    }
    return operations.join(' ');
}

/**
 * ports `GDIRenderer.SetPathClip` for non-rectangular `p:pic` geometry.
 * @param {SlideShapeSnapshot} shape - shape
 * @param {number} width - width
 * @param {number} height - height
 * @returns {string|undefined} result
 */
function pictureClipPath(shape: SlideShapeSnapshot, width: number, height: number): string | undefined {
    if (shape.geometry.kind === 'custom') {
        return optionalProperty(evaluateCustomGeometry(shape.geometry, width, height).paths[0], 'path');
    }
    if (shape.geometry.kind !== 'preset' || shape.geometry.preset === 'rect') {
        return undefined;
    }
    const basic: import('../render/index').EvaluatedGeometry = evaluateBasicPreset(shape.geometry.preset, width, height, {});
    const batch: import('../render/index').EvaluatedBatchBPreset = !basic ? evaluateBatchBPreset(shape.geometry.preset, width, height, {}) ||
        evaluateBatchCPreset(shape.geometry.preset, width, height, {}) : undefined;
    return optionalProperty(basic, 'path') ||
        optionalProperty(optionalProperty(optionalProperty(batch, 'paths'), 0), 'path');
}

/**
 * ports `GDIRenderer.GetTextureBrush` after `TilePicOption.OffsetX/OffsetY` point conversion.
 * @param {number|undefined} offsetEmu - offsetEmu
 * @returns {number} result
 */
function skiaTilePatternOffset(offsetEmu: number | undefined): number {
    return emuToPoint(offsetEmu || 0) / 12700;
}

function gradientVector(angle: number): GradientVector {
    const radians: number = angle * Math.PI / 180;
    const dx: number = Math.cos(radians);
    const dy: number = Math.sin(radians);
    const scale: number = 0.5 / Math.max(Math.abs(dx), Math.abs(dy), Number.EPSILON);
    return {
        x1: snap(0.5 - dx * scale),
        y1: snap(0.5 - dy * scale),
        x2: snap(0.5 + dx * scale),
        y2: snap(0.5 + dy * scale)
    };
}

function snap(value: number): number {
    if (Math.abs(value) < 1e-12) {
        return 0;
    }
    if (Math.abs(value - 0.5) < 1e-12) {
        return 0.5;
    }
    if (Math.abs(value - 1) < 1e-12) {
        return 1;
    }
    return value;
}

function format(value: number): string {
    return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));
}

function patternPath(preset: string | undefined): string {
    if (preset === 'horz') {
        return 'M 0 3 H 6';
    }
    if (preset === 'vert') {
        return 'M 3 0 V 6';
    }
    if (preset === 'cross') {
        return 'M 0 3 H 6 M 3 0 V 6';
    }
    if (preset === 'diagCross') {
        return 'M 0 0 L 6 6 M 6 0 L 0 6';
    }
    if (preset === 'dnDiag') {
        return 'M 0 0 L 6 6 M -3 3 L 3 9 M 3 -3 L 9 3';
    }
    return 'M 6 0 L 0 6 M 3 -3 L -3 3 M 9 3 L 3 9';
}

function dashArray(preset: string, lineWidth: number): string | undefined {
    const unit: number = Math.max(lineWidth, 0.25);
    const values: Readonly<Record<string, ReadonlyArray<number>>> = {
        dash: [4, 3], dashDot: [4, 3, 1, 3], dot: [1, 3], lgDash: [8, 3],
        lgDashDot: [8, 3, 1, 3], lgDashDotDot: [8, 3, 1, 3, 1, 3], sysDash: [3, 1],
        sysDashDot: [3, 1, 1, 1], sysDashDotDot: [3, 1, 1, 1, 1, 1], sysDot: [1, 1]
    };
    return ((values[preset]) !== undefined && (values[preset]) !== null ? (values[preset]).map((value: number): string => format(value * unit)) : undefined).join(' ');
}

/** Reads a property only when its owner is present.
 * @param {*} value - Potentially absent owner.
 * @param {*} key - Property key.
 * @returns {*} Property value or undefined.
 */
function optionalProperty<T, K extends keyof T>(value: T | null | undefined, key: K): T[K] | undefined {
    return value !== undefined && value !== null ? value[key] : undefined;
}

/** Returns a value unless it is nullish.
 * @param {*} value - Preferred value.
 * @param {Function} fallback - Lazy fallback.
 * @returns {*} Preferred value or fallback.
 */
function nullishValue<T, U>(value: T | null | undefined, fallback: () => U): T | U {
    return value !== undefined && value !== null ? value : fallback();
}
