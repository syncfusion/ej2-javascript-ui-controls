/**
 * Resolved DrawingML preset pattern (`a:pattFill`) ready for SVG.
 *
 * @internal
 */
export interface ChartPatternSpec {
    /** `ST_PresetPatternVal`, e.g. `ltHorz`, `pct50`, `wdUpDiag`. */
    preset: string;
    /** Stroke colour (`a:fgClr`), CSS. */
    foreground: string;
    /** Background colour (`a:bgClr`), CSS. */
    background: string;
}

const SVG_NS: string = 'http://www.w3.org/2000/svg';
const TILE: number = 8;
const BAYER_8: number[][] = [
    [0, 32, 8, 40, 2, 34, 10, 42], [48, 16, 56, 24, 50, 18, 58, 26], [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22], [3, 35, 11, 43, 1, 33, 9, 41], [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37], [63, 31, 55, 23, 61, 29, 53, 21]
];

function percentPath(percent: number): string {
    const on: number = Math.round(percent * 64 / 100);
    let d: string = '';
    for (let y: number = 0; y < TILE; y++) {
        for (let x: number = 0; x < TILE; x++) {
            if (BAYER_8[y][x] < on) {
                d += 'M' + x + ' ' + y + 'h1v1h-1z';
            }
        }
    }
    return d;
}

function bands(horizontal: boolean, thickness: number, period: number, dash?: number): string {
    let d: string = '';
    for (let offset: number = 0; offset < TILE; offset += period) {
        if (dash === undefined) {
            d += horizontal ? 'M0 ' + offset + 'h' + TILE + 'v' + thickness + 'h-' + TILE + 'z'
                : 'M' + offset + ' 0h' + thickness + 'v' + TILE + 'h-' + thickness + 'z';
        } else {
            for (let run: number = 0; run < TILE; run += dash * 2) {
                d += horizontal ? 'M' + run + ' ' + offset + 'h' + dash + 'v' + thickness + 'h-' + dash + 'z'
                    : 'M' + offset + ' ' + run + 'h' + thickness + 'v' + dash + 'h-' + thickness + 'z';
            }
        }
    }
    return d;
}

function diagonal(down: boolean, thickness: number, period: number): string {
    let d: string = '';
    for (let offset: number = -TILE; offset < TILE * 2; offset += period) {
        const x2: number = down ? offset + TILE : offset - TILE;
        d += 'M' + offset + ' 0L' + x2 + ' ' + TILE + 'L' + x2 + ' ' + (TILE + thickness) +
            'L' + offset + ' ' + thickness + 'z';
    }
    return d;
}

function checker(size: number): string {
    let d: string = '';
    for (let y: number = 0; y < TILE; y += size) {
        for (let x: number = 0; x < TILE; x += size) {
            if (((x + y) / size) % 2 === 0) {
                d += 'M' + x + ' ' + y + 'h' + size + 'v' + size + 'h-' + size + 'z';
            }
        }
    }
    return d;
}

function shapeFor(preset: string): string {
    const percent: RegExpMatchArray | null = /^pct(\d+)$/.exec(preset);
    if (percent) {
        return percentPath(Number(percent[1]));
    }
    const table: { [name: string]: () => string } = {
        horz: (): string => bands(true, 1, 4), ltHorz: (): string => bands(true, 1, 4), dkHorz: (): string => bands(true, 2, 4),
        narHorz: (): string => bands(true, 1, 2), dashHorz: (): string => bands(true, 1, 4, 2),
        vert: (): string => bands(false, 1, 4), ltVert: (): string => bands(false, 1, 4), dkVert: (): string => bands(false, 2, 4),
        narVert: (): string => bands(false, 1, 2), dashVert: (): string => bands(false, 1, 4, 2),
        cross: (): string => bands(true, 1, 8) + bands(false, 1, 8),
        smGrid: (): string => bands(true, 1, 4) + bands(false, 1, 4),
        lgGrid: (): string => bands(true, 1, 8) + bands(false, 1, 8),
        dotGrid: (): string => bands(true, 1, 2, 1) + bands(false, 1, 2, 1),
        dnDiag: (): string => diagonal(true, 1, 4), ltDnDiag: (): string => diagonal(true, 1, 4),
        dkDnDiag: (): string => diagonal(true, 2, 4), wdDnDiag: (): string => diagonal(true, 3, 8),
        dashDnDiag: (): string => diagonal(true, 1, 8),
        upDiag: (): string => diagonal(false, 1, 4), ltUpDiag: (): string => diagonal(false, 1, 4),
        dkUpDiag: (): string => diagonal(false, 2, 4), wdUpDiag: (): string => diagonal(false, 3, 8),
        dashUpDiag: (): string => diagonal(false, 1, 8),
        diagCross: (): string => diagonal(true, 1, 8) + diagonal(false, 1, 8),
        smCheck: (): string => checker(2), lgCheck: (): string => checker(4)
    };
    const known: (() => string) | undefined = table[preset];
    return known ? known() : percentPath(25);
}

/**
 * Adds (replacing any previous) an SVG `<pattern id>` for `spec` under `svg`'s `<defs>`.
 * @param {SVGElement} svg - Chart SVG root.
 * @param {string} id - Pattern id, unique inside the document.
 * @param {ChartPatternSpec} spec - Preset and colours.
 * @returns {string} `url(#id)` paint reference.
 *
 * @internal
 */
export function addPatternDef(svg: Element, id: string, spec: ChartPatternSpec): string {
    const doc: Document = svg.ownerDocument;
    let defs: Element | null = svg.querySelector('defs');
    if (!defs) {
        defs = doc.createElementNS(SVG_NS, 'defs');
        svg.insertBefore(defs, svg.firstChild);
    }
    const stale: Element | null = defs.querySelector('[id="' + id + '"]');
    if (stale) {
        defs.removeChild(stale);
    }
    const pattern: Element = doc.createElementNS(SVG_NS, 'pattern');
    pattern.setAttribute('id', id);
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    pattern.setAttribute('width', String(TILE));
    pattern.setAttribute('height', String(TILE));
    const background: Element = doc.createElementNS(SVG_NS, 'rect');
    background.setAttribute('width', String(TILE));
    background.setAttribute('height', String(TILE));
    background.setAttribute('fill', spec.background);
    const strokes: Element = doc.createElementNS(SVG_NS, 'path');
    strokes.setAttribute('d', shapeFor(spec.preset));
    strokes.setAttribute('fill', spec.foreground);
    strokes.setAttribute('shape-rendering', 'crispEdges');
    pattern.appendChild(background);
    pattern.appendChild(strokes);
    defs.appendChild(pattern);
    return 'url(#' + id + ')';
}

/**
 * Resolved DrawingML gradient (`a:gradFill`) ready for SVG.
 *
 * @internal
 */
export interface ChartGradientSpec {
    /** Stops, `position` 0..100, CSS colours (may be `rgba`). */
    stops: Array<{ position: number; color: string }>;
    /** `a:lin/@ang` degrees clockwise from the x axis; ignored for path gradients. */
    angleDeg: number;
    /** `a:path` gradients are drawn radial. */
    radial: boolean;
}

/**
 * Adds (replacing any previous) an SVG gradient under `svg`'s `<defs>`.
 * @param {Element} svg - Chart SVG root.
 * @param {string} id - Gradient id, unique inside the document.
 * @param {ChartGradientSpec} spec - Stops and direction.
 * @returns {string} `url(#id)` paint reference.
 *
 * @internal
 */
export function addGradientDef(svg: Element, id: string, spec: ChartGradientSpec): string {
    const doc: Document = svg.ownerDocument;
    let defs: Element | null = svg.querySelector('defs');
    if (!defs) {
        defs = doc.createElementNS(SVG_NS, 'defs');
        svg.insertBefore(defs, svg.firstChild);
    }
    const stale: Element | null = defs.querySelector('[id="' + id + '"]');
    if (stale) {
        defs.removeChild(stale);
    }
    const gradient: Element = doc.createElementNS(SVG_NS, spec.radial ? 'radialGradient' : 'linearGradient');
    gradient.setAttribute('id', id);
    if (!spec.radial) {
        const radians: number = spec.angleDeg * Math.PI / 180;
        const dx: number = Math.cos(radians) / 2;
        const dy: number = Math.sin(radians) / 2;
        gradient.setAttribute('x1', String(0.5 - dx));
        gradient.setAttribute('y1', String(0.5 - dy));
        gradient.setAttribute('x2', String(0.5 + dx));
        gradient.setAttribute('y2', String(0.5 + dy));
    }
    spec.stops.forEach((stop: { position: number; color: string }): void => {
        const node: Element = doc.createElementNS(SVG_NS, 'stop');
        node.setAttribute('offset', stop.position + '%');
        node.setAttribute('stop-color', stop.color);
        gradient.appendChild(node);
    });
    defs.appendChild(gradient);
    return 'url(#' + id + ')';
}
