/** A single font substitute or an ordered list of substitutes.  @internal */
/**
 * @internal
 */
export type FontSubstitution = string | ReadonlyArray<string>;

/** Application-supplied substitutions keyed by authored font family.  @internal */
/**
 * @internal
 */
export interface FontSubstitutionMap {
    readonly [originalName: string]: FontSubstitution;
}

/** Why a render family was selected.  @internal */
/**
 * @internal
 */
export type FontResolutionSource = 'user' | 'authored' | 'default' | 'generic';

/** Ordering policy for authored and shipped substitute font families.  @internal */
/**
 * @internal
 */
export type FontResolutionMode = 'authored-first' | 'substitute-first';

/** One immutable font selection shared by measurement and DOM rendering.  @internal */
/**
 * @internal
 */
export interface ApplicationFontResolution {
    readonly originalName: string;
    readonly resolvedFamily: string;
    readonly candidates: ReadonlyArray<string>;
    readonly source: FontResolutionSource;
    readonly substituted: boolean;
    readonly isLoaded: boolean | undefined;
    readonly authoredFamilyUsed: boolean;
    readonly reason: string;
}

/** A missing/substituted font reported to the host application.  @internal */
/**
 * @internal
 */
export interface FontResolutionNotice extends ApplicationFontResolution {
    readonly timedOut: boolean;
}

/** Options for the browser font provider.  @internal */
/**
 * @internal
 */
export interface FontProviderOptions {
    readonly substitutions?: FontSubstitutionMap;
    readonly loadTimeoutMs?: number;
    readonly fontLoadHost?: FontLoadHost;
    readonly fontProbe?: FontAvailabilityProbe;
    readonly fontResolution?: FontResolutionMode;
    readonly warn?: (message: string) => void;
}

/** Minimal `FontFaceSet` boundary, injectable for deterministic tests.  @internal */
/**
 * @internal
 */
export interface FontLoadHost {
    load(font: string, text?: string): Promise<ReadonlyArray<unknown>>;
    check(font: string, text?: string): boolean;
    addEventListener?(name: 'loadingdone', listener: () => void): void;
}

/** Browser/system-font availability boundary, injectable for deterministic tests.  @internal */
/**
 * @internal
 */
export interface FontAvailabilityProbe {
    isAvailable(family: string, weight: string, style: string): boolean | undefined;
    clear(): void;
}

interface FontProbeContext {
    font: string;
    measureText(text: string): { readonly width: number };
}

interface OffscreenCanvasConstructor {
    new(width: number, height: number): { getContext(name: '2d'): FontProbeContext | null };
}

declare const OffscreenCanvas: OffscreenCanvasConstructor;

/** Shared resolver used before both measurement and DOM text emission.  @internal */
/**
 * @internal
 */
export interface FontProvider {
    readonly revision: number;
    resolve(originalName: string): ApplicationFontResolution;
    prepare(originalName: string, sizePt?: number, sampleText?: string,
        weight?: string, style?: string): Promise<ApplicationFontResolution>;
    setSubstitution(originalName: string, substitute: FontSubstitution | undefined): void;
    setSubstitutions(substitutions: FontSubstitutionMap): void;
    setResolutionMode(mode: FontResolutionMode): void;
    getNotices(): ReadonlyArray<FontResolutionNotice>;
    getResolutionReport(): ReadonlyArray<FontResolutionNotice>;
}

/**
 * Open, metric-compatible substitutions shipped as names only. The host owns
 * `@font-face` declarations and font files.
 * @internal
 */
export const DEFAULT_FONT_SUBSTITUTIONS: FontSubstitutionMap = Object.freeze({
    Arial: 'Liberation Sans',
    Calibri: 'Carlito',
    Cambria: 'Caladea',
    'Courier New': 'Liberation Mono',
    'Gill Sans': ['Gill Sans MT', 'Gill Sans Nova', 'Lato', 'Calibri', 'sans-serif'],
    Helvetica: ['Arial', 'Liberation Sans', 'sans-serif'],
    'Helvetica Neue': ['Arial', 'Liberation Sans', 'sans-serif'],
    'Times New Roman': 'Liberation Serif'
});

const DEFAULT_LOAD_TIMEOUT_MS: number = 3000;

/** Browser implementation of the S3b application font policy.  @internal */
/**
 * @internal
 */
export class BrowserFontProvider implements FontProvider {
    private userSubstitutions: FontSubstitutionMap;
    private readonly loadTimeoutMs: number;
    private readonly fontLoadHost: FontLoadHost | undefined;
    private readonly fontProbe: FontAvailabilityProbe | undefined;
    private readonly warn: (message: string) => void;
    private readonly notices: Map<string, FontResolutionNotice> = new Map();
    private readonly reports: Map<string, FontResolutionNotice> = new Map();
    private readonly availability: Map<string, boolean | undefined> = new Map();
    private resolutionMode: FontResolutionMode;
    private _revision: number = 0;

    public constructor(options: FontProviderOptions = {}) {
        this.userSubstitutions = copyMap(options.substitutions || {});
        this.loadTimeoutMs = Math.max(0, nullishValue(options.loadTimeoutMs, () => DEFAULT_LOAD_TIMEOUT_MS));
        this.fontLoadHost = Object.prototype.hasOwnProperty.call(options, 'fontLoadHost')
            ? options.fontLoadHost : browserFontLoadHost();
        this.fontProbe = Object.prototype.hasOwnProperty.call(options, 'fontProbe')
            ? options.fontProbe : browserFontAvailabilityProbe();
        this.resolutionMode = options.fontResolution || 'authored-first';
        this.warn = options.warn || ((message: string): void => console.warn(message));
        if (this.fontLoadHost && this.fontLoadHost.addEventListener) {
            this.fontLoadHost.addEventListener('loadingdone', (): void => this.invalidateAvailability());
        }
    }

    /* Monotonic value included in measurement-cache keys. */
    public get revision(): number {
        return this._revision;
    }

    /*
 * Resolves without probing the browser font set.
 * @param {string} originalName - originalName
 * @returns {ApplicationFontResolution} result
 */
    public resolve(originalName: string): ApplicationFontResolution {
        const original: string = normalizeDisplayName(originalName);
        const user: FontSubstitution | undefined = lookup(this.userSubstitutions, original);
        const shipped: FontSubstitution | undefined = lookup(DEFAULT_FONT_SUBSTITUTIONS, original);
        const generic: string = genericFamily(original);
        const candidates: ReadonlyArray<string> = this.resolutionMode === 'substitute-first'
            ? oldOrder(user, shipped, generic) : authoredOrder(user, original, shipped, generic);
        const source: FontResolutionSource = candidateSource(candidates[0], original, user, shipped, generic);
        return {
            originalName: original,
            resolvedFamily: candidates[0],
            candidates,
            source,
            substituted: !sameFamily(original, candidates[0]),
            isLoaded: undefined,
            authoredFamilyUsed: sameFamily(original, candidates[0]),
            reason: initialReason(source)
        };
    }

    /*
     * Waits for an ordered substitute and returns the exact family to measure/draw.
     * @param {string} originalName - originalName
     * @param {number} sizePt - sizePt
     * @param {string} sampleText - sampleText
     * @param {string} weight - weight
     * @param {string} style - style
     * @returns {Promise} result
     */
    public async prepare(
        originalName: string,
        sizePt: number = 12,
        sampleText: string = 'BESbswy',
        weight: string = '400',
        style: string = 'normal'
    ): Promise<ApplicationFontResolution> {
        const resolution: ApplicationFontResolution = this.resolve(originalName);
        let timedOut: boolean = false;
        for (const candidate of resolution.candidates) {
            const source: FontResolutionSource = candidateSource(candidate, resolution.originalName,
                                                                 lookup(this.userSubstitutions, resolution.originalName),
                                                                 lookup(DEFAULT_FONT_SUBSTITUTIONS, resolution.originalName),
                                                                 genericFamily(resolution.originalName));
            if (source === 'generic') {
                return this.report(selectedResolution(resolution, candidate, source, true,
                                                      'no-candidate-available-generic-used'), timedOut);
            }
            const state: 'loaded' | 'missing' | 'timeout' = await this.candidateState(
                candidate, sizePt, sampleText, weight, style);
            timedOut = timedOut || state === 'timeout';
            if (state === 'loaded') {
                return this.report(selectedResolution(resolution, candidate, source, true,
                                                      resolutionReason(source, resolution.originalName, candidate)), timedOut);
            }
        }
        const fallback: string = genericFamily(resolution.originalName);
        return this.report(selectedResolution(resolution, fallback, 'generic', false,
                                              'no-candidate-available-generic-used'), timedOut);
    }

    /*
 * Adds, changes, or removes one application override.
 * @param {string} originalName - originalName
 * @param {FontSubstitution|undefined} substitute - substitute
 * @returns {void} result
 */
    public setSubstitution(originalName: string, substitute: FontSubstitution | undefined): void {
        const next: Record<string, FontSubstitution> = { ...this.userSubstitutions };
        const existing: string | undefined = keyFor(next, originalName);
        if (existing) {
            delete next[existing];
        }
        if (substitute !== undefined) {
            next[normalizeDisplayName(originalName)] = substitute;
        }
        this.setSubstitutions(next);
    }

    /*
 * Replaces application overrides and invalidates prior measurements.
 * @param {FontSubstitutionMap} substitutions - substitutions
 * @returns {void} result
 */
    public setSubstitutions(substitutions: FontSubstitutionMap): void {
        this.userSubstitutions = copyMap(substitutions);
        this.invalidateAvailability();
    }

    /** Changes candidate ordering and invalidates cached measurements.
     * @param {FontResolutionMode} mode - mode
     * @returns {void} result
     */
    public setResolutionMode(mode: FontResolutionMode): void {
        if (this.resolutionMode !== mode) {
            this.resolutionMode = mode;
            this.invalidateAvailability();
        }
    }

    /*
 * Returns a stable snapshot suitable for an application notice.
 * @returns {Array.<FontResolutionNotice>} result
 */
    public getNotices(): ReadonlyArray<FontResolutionNotice> {
        return Array.from(this.notices.values());
    }

    /** Returns every family prepared during this session, including authored matches.
     * @returns {Array.<FontResolutionNotice>} result
     */
    public getResolutionReport(): ReadonlyArray<FontResolutionNotice> {
        return Array.from(this.reports.values());
    }

    private async candidateState(candidate: string, sizePt: number, sampleText: string,
                                 weight: string, style: string): Promise<'loaded' | 'missing' | 'timeout'> {
        const key: string = [candidate.toLocaleLowerCase('en-US'), weight, style].join('|');
        if (this.availability.has(key)) {
            return this.availability.get(key) === true ? 'loaded' : 'missing';
        }
        let hostState: 'loaded' | 'missing' | 'timeout' = 'missing';
        if (this.fontLoadHost) {
            const css: string = `${style} ${weight} ${sizePt}pt "${escapeFamily(candidate)}"`;
            hostState = await loadWithTimeout(this.fontLoadHost, css, sampleText, this.loadTimeoutMs);
            if (hostState === 'loaded') {
                this.availability.set(key, true);
                return 'loaded';
            }
        }
        const probed: boolean | undefined = this.fontProbe
            ? this.fontProbe.isAvailable(candidate, weight, style) : undefined;
        this.availability.set(key, probed);
        return probed === true ? 'loaded' : hostState === 'timeout' ? 'timeout' : 'missing';
    }

    private invalidateAvailability(): void {
        this.availability.clear();
        if (this.fontProbe) {
            this.fontProbe.clear();
        }
        this.notices.clear();
        this.reports.clear();
        this._revision++;
    }

    private report(resolution: ApplicationFontResolution, timedOut: boolean): ApplicationFontResolution {
        const key: string = resolution.originalName.toLocaleLowerCase('en-US');
        const report: FontResolutionNotice = { ...resolution, timedOut };
        this.reports.set(key, report);
        if (!resolution.substituted && resolution.isLoaded !== false) {
            return resolution;
        }
        if (!this.notices.has(key)) {
            this.notices.set(key, report);
            const availability: string = resolution.isLoaded === false ? ' (substitute unavailable)' : '';
            this.warn(`[PptxEditor] Font "${resolution.originalName}" resolved to ` +
        `"${resolution.resolvedFamily}"${availability}.`);
        }
        return resolution;
    }
}

/**
 * Creates the browser provider used by the editor and render pipeline.
 * @param {FontProviderOptions} options - options
 * @returns {FontProvider} result
 * @internal
 */
export function createFontProvider(options: FontProviderOptions = {}): FontProvider {
    return new BrowserFontProvider(options);
}

function browserFontLoadHost(): FontLoadHost | undefined {
    if (typeof document === 'undefined' || !document.fonts) {
        return undefined;
    }
    return document.fonts;
}

function browserFontAvailabilityProbe(): FontAvailabilityProbe | undefined {
    let context: FontProbeContext | null = null;
    if (typeof OffscreenCanvas !== 'undefined') {
        context = new OffscreenCanvas(1, 1).getContext('2d');
    } else if (typeof document !== 'undefined' && document.createElement) {
        if (typeof navigator !== 'undefined' && /jsdom/iu.test(navigator.userAgent)) {
            return undefined;
        }
        context = document.createElement('canvas').getContext('2d');
    }
    if (!context) {
        return undefined;
    }
    const cache: Map<string, boolean> = new Map();
    return {
        isAvailable: (family: string, weight: string, style: string): boolean => {
            const key: string = [family.toLocaleLowerCase('en-US'), weight, style].join('|');
            const cached: boolean | undefined = cache.get(key);
            if (cached !== undefined) {
                return cached;
            }
            const sample: string = 'mmmmmmmmmmlliWW00@#';
            const available: boolean = ['monospace', 'serif', 'sans-serif'].some((base: string): boolean => {
                context.font = `${style} ${weight} 100px "${escapeFamily(family)}", ${base}`;
                const candidateWidth: number = context.measureText(sample).width;
                context.font = `${style} ${weight} 100px ${base}`;
                return Math.abs(candidateWidth - context.measureText(sample).width) > 0.01;
            });
            cache.set(key, available);
            return available;
        },
        clear: (): void => cache.clear()
    };
}

async function loadWithTimeout(
    host: FontLoadHost,
    css: string,
    text: string,
    timeoutMs: number
): Promise<'loaded' | 'missing' | 'timeout'> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout: Promise<'timeout'> = new Promise<'timeout'>((resolve: (value: 'timeout' | PromiseLike<'timeout'>) => void): void => {
        timer = setTimeout((): void => resolve('timeout'), timeoutMs);
    });
    const load: Promise<'missing' | 'loaded'> = host.load(css, text).then((faces: ReadonlyArray<unknown>): 'loaded' | 'missing' =>
        faces.length > 0 && host.check(css, text) ? 'loaded' : 'missing', (): 'missing' => 'missing');
    const result: 'loaded' | 'missing' | 'timeout' = await Promise.race([load, timeout]);
    if (timer !== undefined) {
        clearTimeout(timer);
    }
    return result;
}

function genericFamily(name: string): 'serif' | 'sans-serif' | 'monospace' {
    const value: string = name.toLocaleLowerCase('en-US');
    if (/mono|courier|consolas|code/u.test(value)) {
        return 'monospace';
    }
    if (/serif|times|cambria|georgia|garamond|caladea/u.test(value)) {
        return 'serif';
    }
    return 'sans-serif';
}

function normalizeCandidates(value: FontSubstitution | undefined): ReadonlyArray<string> {
    const values: ReadonlyArray<string> = typeof value === 'string' ? [value] : value || [];
    const normalized: string[] = values.map(normalizeDisplayName).filter(Boolean);
    return normalized.length > 0 ? normalized : ['sans-serif'];
}

function authoredOrder(user: FontSubstitution | undefined, original: string,
                       shipped: FontSubstitution | undefined, generic: string): ReadonlyArray<string> {
    return uniqueFamilies([
        ...normalizeOptionalCandidates(user), original,
        ...normalizeOptionalCandidates(shipped), generic
    ]);
}

function oldOrder(user: FontSubstitution | undefined, shipped: FontSubstitution | undefined,
                  generic: string): ReadonlyArray<string> {
    const selected: ReadonlyArray<string> = normalizeOptionalCandidates(user !== undefined ? user : shipped);
    return uniqueFamilies([...selected, generic]);
}

function normalizeOptionalCandidates(value: FontSubstitution | undefined): ReadonlyArray<string> {
    return value === undefined ? [] : normalizeCandidates(value);
}

function uniqueFamilies(values: ReadonlyArray<string>): ReadonlyArray<string> {
    const result: string[] = [];
    values.forEach((value: string): void => {
        const normalized: string = normalizeDisplayName(value);
        if (!result.some((candidate: string): boolean => sameFamily(candidate, normalized))) {
            result.push(normalized);
        }
    });
    return result;
}

function candidateSource(candidate: string, original: string, user: FontSubstitution | undefined,
                         shipped: FontSubstitution | undefined, generic: string): FontResolutionSource {
    if (normalizeOptionalCandidates(user).some((value: string): boolean => sameFamily(value, candidate))) {
        return 'user';
    }
    if (sameFamily(candidate, original)) {
        return 'authored';
    }
    if (normalizeOptionalCandidates(shipped).some((value: string): boolean => sameFamily(value, candidate))) {
        return 'default';
    }
    return sameFamily(candidate, generic) ? 'generic' : 'default';
}

function selectedResolution(resolution: ApplicationFontResolution, family: string,
                            source: FontResolutionSource, loaded: boolean, reason: string): ApplicationFontResolution {
    return {
        ...resolution, resolvedFamily: family, source,
        substituted: !sameFamily(resolution.originalName, family), isLoaded: loaded,
        authoredFamilyUsed: sameFamily(resolution.originalName, family), reason
    };
}

function initialReason(source: FontResolutionSource): string {
    return source === 'user' ? 'user-substitution-selected' :
        source === 'authored' ? 'authored-candidate-selected' :
            source === 'default' ? 'default-substitute-selected' : 'generic-selected';
}

function resolutionReason(source: FontResolutionSource, original: string, family: string): string {
    if (source === 'user') {
        return 'user-substitution-used';
    }
    if (source === 'authored') {
        return 'authored-installed';
    }
    if (source === 'default') {
        return sameFamily(original, family) ? 'authored-installed' : 'authored-unavailable-default-used';
    }
    return 'no-candidate-available-generic-used';
}

function copyMap(map: FontSubstitutionMap): FontSubstitutionMap {
    const copy: Record<string, FontSubstitution> = {};
    Object.keys(map).forEach((key: string): void => {
        const value: FontSubstitution = map[key];
        copy[normalizeDisplayName(key)] = typeof value === 'string' ? value : value.slice();
    });
    return copy;
}

function lookup(map: FontSubstitutionMap, name: string): FontSubstitution | undefined {
    const key: string | undefined = keyFor(map, name);
    return key ? map[key] : undefined;
}

function keyFor(map: FontSubstitutionMap, name: string): string | undefined {
    const normalized: string = normalizeDisplayName(name).toLocaleLowerCase('en-US');
    return Object.keys(map).find((key: string): boolean =>
        key.toLocaleLowerCase('en-US') === normalized);
}

function normalizeDisplayName(value: string): string {
    const normalized: string = value.trim().replace(/^['"]|['"]$/gu, '');
    return normalized || 'Arial';
}

function sameFamily(left: string, right: string): boolean {
    return left.toLocaleLowerCase('en-US') === right.toLocaleLowerCase('en-US');
}

function escapeFamily(value: string): string {
    return value.replace(/["\\]/gu, '\\$&');
}

/** Returns a value unless it is nullish.
 * @param {*} value - Preferred value.
 * @param {Function} fallback - Lazy fallback.
 * @returns {*} Preferred value or fallback.
 */
function nullishValue<T, U>(value: T | null | undefined, fallback: () => U): T | U {
    return value !== undefined && value !== null ? value : fallback();
}
