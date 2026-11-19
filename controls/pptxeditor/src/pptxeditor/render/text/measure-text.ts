import { PptxError } from '../../base/pptx-error';
import { FontProvider } from './font-provider';
import { PINNED_FONT_METRIC_UNITS, skiaFontMetrics } from './skia-font-metrics';
import { FontDesignUnit, TextPoint } from './text-units';
import { textPoint } from './text-units';

const PIXELS_PER_POINT: number = 96 / 72;

/** One deterministic text-advance measurement request.  @internal */
/**
 * @internal
 */
export interface TextMeasureRequest {
    /** Caller-owned correlation identifier. */
    readonly id: string;
    /** Text whose advance is measured. */
    readonly text: string;
    /** Already-resolved pinned font family. */
    readonly family: string;
    /** Ordered fallbacks shared with the HTML renderer. */
    readonly fontCandidates?: ReadonlyArray<string>;
    /** Font size in typographic points. */
    readonly sizePt: TextPoint;
    /** Whether the bold face is selected. */
    readonly bold: boolean;
    /** Whether the italic face is selected. */
    readonly italic: boolean;
    /** Additional spacing between adjacent characters, in points. @defaultValue `0`. */
    readonly letterSpacingPt?: TextPoint;
}

/** Clone-safe width and vertical metrics for one measured request.  @internal */
/**
 * @internal
 */
export interface TextMeasureResult {
    /** Correlation identifier copied from the request. */
    readonly id: string;
    /** Resolved pinned family used for measurement. */
    readonly family: string;
    /** Ordered CSS family list selected by the application resolver. */
    readonly fontCandidates?: ReadonlyArray<string>;
    /** Measured text advance in points. */
    readonly widthPt: TextPoint;
    /** Canvas ink ascent in points. */
    readonly actualAscentPt: TextPoint;
    /** Canvas ink descent in points. */
    readonly actualDescentPt: TextPoint;
    /** Renderer cell ascent in points. */
    readonly ascentPt: TextPoint;
    /** Renderer half-cell descent in points. */
    readonly descentPt: TextPoint;
    /** Renderer line spacing in points. */
    readonly lineSpacingPt: TextPoint;
    /** Requested em size in points. */
    readonly emHeightPt: TextPoint;
    /** Font em-square size in design units. */
    readonly emHeightUnits: FontDesignUnit;
}

/** Minimal Canvas 2D surface consumed by the pure measurement port.  @internal */
/**
 * @internal
 */
export interface TextMeasureContext {
    /** CSS font shorthand applied before measurement. */
    font: string;
    /** CSS kerning policy when the host supports it. */
    fontKerning?: string;
    /** Measures browser pixel values for one string. */
    measureText(text: string): {
    /** Advance width in CSS pixels. */
        readonly width: number;
        /** Ink ascent in CSS pixels when available. */
        readonly actualBoundingBoxAscent?: number;
        /** Ink descent in CSS pixels when available. */
        readonly actualBoundingBoxDescent?: number;
        /** Font-box ascent in CSS pixels when available. */
        readonly fontBoundingBoxAscent?: number;
        /** Font-box descent in CSS pixels when available. */
        readonly fontBoundingBoxDescent?: number;
        /** Em-box ascent in CSS pixels when available. */
        readonly emHeightAscent?: number;
        /** Em-box descent in CSS pixels when available. */
        readonly emHeightDescent?: number;
    };
}

type BrowserTextMetrics = {
    readonly width: number;
    readonly actualBoundingBoxAscent?: number;
    readonly actualBoundingBoxDescent?: number;
    readonly fontBoundingBoxAscent?: number;
    readonly fontBoundingBoxDescent?: number;
    readonly emHeightAscent?: number;
    readonly emHeightDescent?: number;
};

type MeasureCallbacks = {
    readonly resolve: (value: ReadonlyArray<TextMeasureResult>) => void;
    readonly reject: (reason: unknown) => void;
};

/** Asynchronous Worker-first text measurement service.  @internal */
/**
 * @internal
 */
export interface TextMeasurer {
    /** Active execution path. */
    readonly mode: 'worker' | 'main-thread';
    /** Measures a clone-safe batch in request order. */
    measure(requests: ReadonlyArray<TextMeasureRequest>): Promise<ReadonlyArray<TextMeasureResult>>;
    /** Releases Worker and Blob URL resources. */
    close(): void;
}

/** Optional dependencies for application-aware measurement.  @internal */
/**
 * @internal
 */
export interface TextMeasurerOptions {
    /** Resolver shared with the HTML text renderer. Omit for pinned oracle runs. */
    readonly fontProvider?: FontProvider;
    /** Internal fidelity-harness control for document-scoped `FontFace` assets. */
    readonly forceMainThread?: boolean;
}

/** Stable text-measurement failure codes.  @internal */
/**
 * @internal
 */
export type TextMeasureErrorCode = 'Unavailable' | 'Worker';

/** Error raised when neither Worker nor fallback measurement can complete.  @internal */
/**
 * @internal
 */
export class TextMeasureError extends PptxError<TextMeasureErrorCode> {
    /**
     * Creates a stable measurement error.
     *
     * @param {TextMeasureErrorCode} code - Machine-readable failure category.
     * @param {string} message - Diagnostic message that contains no document content.
     * @internal
 */
    public constructor(code: TextMeasureErrorCode, message: string) {
        super('TextMeasureError', code, message);
    }
}

/**
 * Ports the Skia metric consumption in `PresentationRenderer.MeasureString`.
 *
 * @param {TextMeasureContext} context - Canvas-compatible pixel measurement boundary.
 * @param {Array.<TextMeasureRequest>} requests - Clone-safe requests in output order.
 * @returns {Array.<TextMeasureResult>} Skia-compatible point metrics in request order.
 * @internal
 */
export function measureTextBatchWithContext(
    context: TextMeasureContext,
    requests: ReadonlyArray<TextMeasureRequest>
): ReadonlyArray<TextMeasureResult> {
    return requests.map((request: TextMeasureRequest): TextMeasureResult => {
        context.font = cssFont(request);
        context.fontKerning = 'none';
        const metrics: BrowserTextMetrics = context.measureText(request.text);
        const skia: import('./skia-font-metrics').SkiaFontMetrics = skiaFontMetrics(request.family, request.sizePt);
        const spacingPx: number = Math.max(0, request.text.length - 1) *
      Math.max(0, request.letterSpacingPt || 0) * PIXELS_PER_POINT;
        return {
            id: request.id,
            family: request.family,
            widthPt: points(metrics.width + spacingPx),
            actualAscentPt: points(metric(metrics.actualBoundingBoxAscent, 0)),
            actualDescentPt: points(metric(metrics.actualBoundingBoxDescent, 0)),
            ascentPt: skia.rendererAscentPt,
            descentPt: skia.rendererDescentPt,
            lineSpacingPt: skia.lineSpacingPt,
            emHeightPt: request.sizePt,
            emHeightUnits: skia.emHeightUnits
        };
    });
}

/** Inline Worker source; the canvas exists only for measurement, never slide rendering.  @internal */
/**
 * @internal
 */
export const TEXT_MEASURE_WORKER_SOURCE: string = `
(function () {
  'use strict';
  var canvas = new OffscreenCanvas(1, 1);
  var context = canvas.getContext('2d');
  var pixelsPerPoint = 96 / 72;
  var pinnedUnits = ${JSON.stringify(PINNED_FONT_METRIC_UNITS)};
  function point(value) { return value / pixelsPerPoint; }
  function metric(primary, fallback) { return typeof primary === 'number' ? primary : fallback; }
  function cssFont(request) {
    var families = [request.family].concat(request.fontCandidates || []).filter(function (family, index, all) {
      return all.indexOf(family) === index;
    }).map(function (family) {
      return /^(serif|sans-serif|monospace)$/.test(family) ? family : '"' + family.replace(/"/g, '\\"') + '"';
    }).join(', ');
    return (request.italic ? 'italic' : 'normal') + ' ' + (request.bold ? '700' : '400') + ' ' +
      (request.sizePt * pixelsPerPoint) + 'px ' + families;
  }
  self.onmessage = function (event) {
    var requests = event.data.requests || [];
    try {
      if (!context) { throw new Error('2d context unavailable'); }
      var results = requests.map(function (request) {
        context.font = cssFont(request);
        context.fontKerning = 'none';
        var metrics = context.measureText(request.text);
        var units = pinnedUnits[request.family] || pinnedUnits['Arial'];
        var scale = request.sizePt / units.emHeight;
        var spacing = Math.max(0, request.text.length - 1) * Math.max(0, request.letterSpacingPt || 0) * pixelsPerPoint;
        return {
          id: request.id, family: request.family, widthPt: point(metrics.width + spacing),
          actualAscentPt: point(metric(metrics.actualBoundingBoxAscent, 0)),
          actualDescentPt: point(metric(metrics.actualBoundingBoxDescent, 0)),
          ascentPt: units.ascent * scale, descentPt: units.descent * scale / 2,
          lineSpacingPt: units.lineSpacing * scale,
          emHeightPt: request.sizePt, emHeightUnits: units.emHeight
        };
      });
      self.postMessage({ id: event.data.id, results: results });
    } catch (error) {
      self.postMessage({ id: event.data.id, error: String(error && error.message || error) });
    }
  };
}());`;

/**
 * Creates the OffscreenCanvas Worker measurer, with a detached-canvas fallback.
 *
 * @returns {TextMeasurer} A closeable asynchronous measurement service.
 * @throws {TextMeasureError} when neither measurement path is available.
 * @param {TextMeasurerOptions} options - options
 * @internal
 */
export function createTextMeasurer(options: TextMeasurerOptions = {}): TextMeasurer {
    const measurer: TextMeasurer = options.forceMainThread ? createMainThreadTextMeasurer() : createRawTextMeasurer();
    return options.fontProvider ? createResolvingTextMeasurer(measurer, options.fontProvider) : measurer;
}

function createRawTextMeasurer(): TextMeasurer {
    if (typeof Worker !== 'function' || typeof Blob !== 'function' ||
      typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
        return createMainThreadTextMeasurer();
    }
    const url: string = URL.createObjectURL(new Blob([TEXT_MEASURE_WORKER_SOURCE], { type: 'text/javascript' }));
    let worker: Worker;
    try {
        worker = new Worker(url);
    } catch {
        URL.revokeObjectURL(url);
        return createMainThreadTextMeasurer();
    }
    const fallback: TextMeasurer = createMainThreadTextMeasurer();
    let workerFailed: boolean = false;
    let nextId: number = 1;
    const pending: Map<number, MeasureCallbacks> = new Map();
    worker.onmessage = (event: MessageEvent): void => {
        const data: {
            readonly id: number;
            readonly results?: ReadonlyArray<TextMeasureResult>;
            readonly error?: string;
        } = event.data;
        const callbacks: MeasureCallbacks | undefined = pending.get(data.id);
        if (!callbacks) {
            return;
        }
        pending.delete(data.id);
        if (data.error) {
            workerFailed = true;
            callbacks.reject(new TextMeasureError('Worker', data.error));
        } else {
            callbacks.resolve(data.results || []);
        }
    };
    worker.onerror = (event: ErrorEvent): void => {
        workerFailed = true;
        const error: TextMeasureError = new TextMeasureError('Worker', event.message || 'Text measure worker failed');
        pending.forEach((callbacks: MeasureCallbacks): void => callbacks.reject(error));
        pending.clear();
    };
    return {
        mode: 'worker',
        measure: (requests: ReadonlyArray<TextMeasureRequest>): Promise<ReadonlyArray<TextMeasureResult>> => {
            if (workerFailed) {
                return fallback.measure(requests);
            }
            const id: number = nextId++;
            return new Promise<ReadonlyArray<TextMeasureResult>>((
                resolve: (value: ReadonlyArray<TextMeasureResult> | PromiseLike<ReadonlyArray<TextMeasureResult>>) => void,
                reject: (reason?: unknown) => void
            ): void => {
                pending.set(id, { resolve, reject });
                worker.postMessage({ id, requests });
            }).catch((): Promise<ReadonlyArray<TextMeasureResult>> => fallback.measure(requests));
        },
        close: (): void => {
            worker.terminate();
            URL.revokeObjectURL(url);
            fallback.close();
            pending.forEach((callbacks: MeasureCallbacks): void =>
                callbacks.reject(new TextMeasureError('Worker', 'Text measure worker closed')));
            pending.clear();
        }
    };
}

/**
 * Adds shared font resolution and a revision-aware cache to any measurer.
 * The resolved family is the value forwarded to OffscreenCanvas and returned
 * to the DOM layout caller.
 * @param {TextMeasurer} delegate - delegate
 * @param {FontProvider} fontProvider - fontProvider
 * @returns {TextMeasurer} result
 * @internal
 */
export function createResolvingTextMeasurer(
    delegate: TextMeasurer,
    fontProvider: FontProvider
): TextMeasurer {
    const cache: Map<string, TextMeasureResult> = new Map();
    let revision: number = fontProvider.revision;
    return {
        mode: delegate.mode,
        measure: async (requests: ReadonlyArray<TextMeasureRequest>): Promise<ReadonlyArray<TextMeasureResult>> => {
            if (revision !== fontProvider.revision) {
                cache.clear();
                revision = fontProvider.revision;
            }
            const resolved: TextMeasureRequest[] = [];
            const candidateLists: ReadonlyArray<string>[] = [];
            for (const request of requests) {
                const font: import('./font-provider').ApplicationFontResolution = await fontProvider.prepare(
                    request.family, request.sizePt, request.text,
                    request.bold ? '700' : '400', request.italic ? 'italic' : 'normal');
                resolved.push({ ...request, family: font.resolvedFamily, fontCandidates: font.candidates });
                candidateLists.push(font.candidates);
            }
            const output: Array<TextMeasureResult | undefined> = new Array(resolved.length);
            const misses: TextMeasureRequest[] = [];
            const missIndexes: number[] = [];
            resolved.forEach((request: TextMeasureRequest, index: number): void => {
                const key: string = textMeasureCacheKey(request, revision);
                const cached: TextMeasureResult | undefined = cache.get(key);
                if (cached) {
                    output[index] = { ...cached, id: request.id };
                } else {
                    misses.push(request);
                    missIndexes.push(index);
                }
            });
            if (misses.length > 0) {
                const measured: ReadonlyArray<TextMeasureResult> = await delegate.measure(misses);
                measured.forEach((result: TextMeasureResult, missIndex: number): void => {
                    const outputIndex: number = missIndexes[missIndex];
                    const request: TextMeasureRequest = resolved[outputIndex];
                    cache.set(textMeasureCacheKey(request, revision), result);
                    output[outputIndex] = { ...result, fontCandidates: candidateLists[outputIndex] };
                });
            }
            return output.map((result: TextMeasureResult | undefined, index: number): TextMeasureResult => {
                if (!result) {
                    throw new TextMeasureError('Unavailable', 'Text measurement returned no result');
                }
                return { ...result, fontCandidates: candidateLists[index] };
            });
        },
        close: (): void => {
            cache.clear();
            delegate.close();
        }
    };
}

/**
 * Stable cache key; the resolved family and provider revision are mandatory.
 * @param {TextMeasureRequest} request - request
 * @param {number} providerRevision - providerRevision
 * @returns {string} result
 * @internal
 */
export function textMeasureCacheKey(request: TextMeasureRequest, providerRevision: number): string {
    return JSON.stringify([
        providerRevision, request.family, request.sizePt, request.bold, request.italic,
        request.letterSpacingPt || 0, request.fontCandidates || [], request.text
    ]);
}

function createMainThreadTextMeasurer(): TextMeasurer {
    let closed: boolean = false;
    return {
        mode: 'main-thread',
        measure: async (requests: ReadonlyArray<TextMeasureRequest>): Promise<ReadonlyArray<TextMeasureResult>> => {
            if (closed || typeof document === 'undefined' ||
          (typeof navigator !== 'undefined' && /jsdom/iu.test(navigator.userAgent))) {
                throw new TextMeasureError('Unavailable', 'Browser text measurement is unavailable');
            }
            const context: CanvasRenderingContext2D | null = document.createElement('canvas').getContext('2d');
            if (!context) {
                throw new TextMeasureError('Unavailable', 'Canvas 2D text metrics are unavailable');
            }
            return measureTextBatchWithContext(context, requests);
        },
        close: (): void => {
            closed = true;
        }
    };
}

function cssFont(request: TextMeasureRequest): string {
    const families: string = [request.family, ...(request.fontCandidates || [])]
        .filter((family: string, index: number, values: ReadonlyArray<string>): boolean =>
            values.findIndex((value: string): boolean => value === family) === index)
        .map((family: string): string => /^(?:serif|sans-serif|monospace)$/u.test(family)
            ? family : `"${family.replace(/"/gu, '\\"')}"`).join(', ');
    return `${request.italic ? 'italic' : 'normal'} ${request.bold ? '700' : '400'} ` +
    `${request.sizePt * PIXELS_PER_POINT}px ${families}`;
}

function metric(value: number | undefined, fallback: number | undefined): number {
    return typeof value === 'number' ? value : typeof fallback === 'number' ? fallback : 0;
}

function points(pixels: number): TextPoint {
    return textPoint(pixels / PIXELS_PER_POINT);
}
