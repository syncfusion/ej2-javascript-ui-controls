import { evaluateFormulae, FormulaGuideMap } from './formula-evaluator';

/**
 * @internal
 */
export interface GeometryPoint { readonly x: number; readonly y: number; }
/**
 * @internal
 */
export interface EvaluatedGeometry {
    readonly preset: string;
    readonly points: ReadonlyArray<GeometryPoint>;
    readonly path: string;
}

const FORMULAE: Readonly<Record<string, FormulaGuideMap>> = {
    roundRect: { a: 'pin 0 adj 50000', x1: '*/ ss a 100000' },
    triangle: { a: 'pin 0 adj 100000', x2: '*/ w a 100000' },
    parallelogram: {
        maxAdj: '*/ 100000 w ss', a: 'pin 0 adj maxAdj', x2: '*/ ss a 100000', x5: '+- r 0 x2'
    },
    trapezoid: {
        maxAdj: '*/ 50000 w ss', a: 'pin 0 adj maxAdj', x2: '*/ ss a 100000', x3: '+- r 0 x2'
    },
    pentagon: {
        swd2: '*/ wd2 hf 100000', shd2: '*/ hd2 vf 100000', svc: '*/ vc vf 100000',
        dx1: 'cos swd2 18', dx2: 'cos swd2 306', dy1: 'sin shd2 18', dy2: 'sin shd2 306',
        x1: '+- hc 0 dx1', x2: '+- hc 0 dx2', x3: '+- hc dx2 0', x4: '+- hc dx1 0',
        y1: '+- svc 0 dy1', y2: '+- svc 0 dy2'
    },
    hexagon: {
        maxAdj: '*/ 50000 w ss', a: 'pin 0 adj maxAdj', shd2: '*/ hd2 vf 100000',
        x1: '*/ ss a 100000', x2: '+- r 0 x1', dy1: 'sin shd2 60',
        y1: '+- vc 0 dy1', y2: '+- vc dy1 0'
    },
    heptagon: {
        swd2: '*/ wd2 hf 100000', shd2: '*/ hd2 vf 100000', svc: '*/ vc vf 100000',
        dx1: '*/ swd2 97493 100000', dx2: '*/ swd2 78183 100000', dx3: '*/ swd2 43388 100000',
        dy1: '*/ shd2 62349 100000', dy2: '*/ shd2 22252 100000', dy3: '*/ shd2 90097 100000',
        x1: '+- hc 0 dx1', x2: '+- hc 0 dx2', x3: '+- hc 0 dx3', x4: '+- hc dx3 0',
        x5: '+- hc dx2 0', x6: '+- hc dx1 0', y1: '+- svc 0 dy1', y2: '+- svc dy2 0', y3: '+- svc dy3 0'
    },
    octagon: { a: 'pin 0 adj 50000', x1: '*/ ss a 100000', x2: '+- r 0 x1', y2: '+- b 0 x1' },
    decagon: {
        shd2: '*/ hd2 vf 100000', dx1: 'cos wd2 36', dx2: 'cos wd2 72',
        x1: '+- hc 0 dx1', x2: '+- hc 0 dx2', x3: '+- hc dx2 0', x4: '+- hc dx1 0',
        dy1: 'sin shd2 72', dy2: 'sin shd2 36', y1: '+- vc 0 dy1', y2: '+- vc 0 dy2',
        y3: '+- vc dy2 0', y4: '+- vc dy1 0'
    },
    dodecagon: {
        x1: '*/ w 2894 21600', x2: '*/ w 7906 21600', x3: '*/ w 13694 21600', x4: '*/ w 18706 21600',
        y1: '*/ h 2894 21600', y2: '*/ h 7906 21600', y3: '*/ h 13694 21600', y4: '*/ h 18706 21600'
    }
};

const DEFAULTS: Readonly<Record<string, Readonly<Record<string, number>>>> = {
    roundRect: { adj: 16667 }, triangle: { adj: 50000 }, parallelogram: { adj: 25000 }, trapezoid: { adj: 25000 },
    pentagon: { hf: 105146, vf: 110557 }, hexagon: { adj: 25000, vf: 115470 },
    heptagon: { hf: 102572, vf: 105210 }, octagon: { adj: 29289 }, decagon: { vf: 105146 }, dodecagon: {}
};

/**
 * ports the basic-shape methods in `ShapePath` (`GetRoundedRectanglePath` through `GetDodecagonPath`).
 * @param {string} preset - preset
 * @param {number} width - width
 * @param {number} height - height
 * @param {Object} authored - authored
 * @returns {EvaluatedGeometry|undefined} result
 * @internal
 */
export function evaluateBasicPreset(
    preset: string,
    width: number,
    height: number,
    authored: Readonly<Record<string, number>> = {}
): EvaluatedGeometry | undefined {
    if (preset === 'rect') {
        return polygon(preset, [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height }]);
    }
    if (preset === 'ellipse') {
        return { preset, points: [], path: `M 0 ${f(height / 2)} A ${f(width / 2)} ${f(height / 2)} 0 1 0 ${f(width)} ${f(height / 2)} A ${f(width / 2)} ${f(height / 2)} 0 1 0 0 ${f(height / 2)} Z` };
    }
    if (preset === 'rtTriangle') {
        return polygon(preset, [{ x: 0, y: 0 }, { x: 0, y: height }, { x: width, y: height }]);
    }
    if (preset === 'diamond') {
        return polygon(preset, [{ x: 0, y: height / 2 }, { x: width / 2, y: 0 }, { x: width, y: height / 2 }, { x: width / 2, y: height }]);
    }
    const formulae: FormulaGuideMap | undefined = FORMULAE[preset];
    if (!formulae) {
        return undefined;
    }
    const defaults: Readonly<Record<string, number>> = DEFAULTS[preset];
    const guides: Record<string, string> = {};
    for (const name of Object.keys(defaults)) {
        guides[name] = `val ${authored[name] === undefined ? defaults[name] : authored[name]}`;
    }
    for (const name of Object.keys(authored)) {
        guides[name] = `val ${authored[name]}`;
    }
    const v: Readonly<Record<string, number>> = evaluateFormulae({ width, height }, formulae, guides);
    if (preset === 'roundRect') {
        const radius: number = v.x1;
        return {
            preset,
            points: [{ x: 0, y: radius }, { x: radius, y: 0 }, { x: width - radius, y: 0 }, { x: width, y: radius },
                { x: width, y: height - radius }, { x: width - radius, y: height }, { x: radius, y: height }, { x: 0, y: height - radius }],
            path: `M 0 ${f(radius)} A ${f(radius)} ${f(radius)} 0 0 1 ${f(radius)} 0 H ${f(width - radius)} A ${f(radius)} ${f(radius)} 0 0 1 ${f(width)} ${f(radius)} V ${f(height - radius)} A ${f(radius)} ${f(radius)} 0 0 1 ${f(width - radius)} ${f(height)} H ${f(radius)} A ${f(radius)} ${f(radius)} 0 0 1 0 ${f(height - radius)} Z`
        };
    }
    const points: ReadonlyArray<GeometryPoint> = pointsFor(preset, width, height, v);
    return polygon(preset, points);
}

function pointsFor(p: string, w: number, h: number, v: Readonly<Record<string, number>>): ReadonlyArray<GeometryPoint> {
    if (p === 'triangle') {
        return [{ x: 0, y: h }, { x: v.x2, y: 0 }, { x: w, y: h }];
    }
    if (p === 'parallelogram') {
        return [{ x: 0, y: h }, { x: v.x2, y: 0 }, { x: w, y: 0 }, { x: v.x5, y: h }];
    }
    if (p === 'trapezoid') {
        return [{ x: 0, y: h }, { x: v.x2, y: 0 }, { x: v.x3, y: 0 }, { x: w, y: h }];
    }
    if (p === 'pentagon') {
        return [
            { x: v.x1, y: v.y1 }, { x: w / 2, y: 0 }, { x: v.x4, y: v.y1 },
            { x: v.x3, y: v.y2 }, { x: v.x2, y: v.y2 }
        ];
    }
    if (p === 'hexagon') {
        return [
            { x: 0, y: h / 2 }, { x: v.x1, y: v.y1 }, { x: v.x2, y: v.y1 },
            { x: w, y: h / 2 }, { x: v.x2, y: v.y2 }, { x: v.x1, y: v.y2 }
        ];
    }
    if (p === 'heptagon') {
        return [
            { x: v.x1, y: v.y2 }, { x: v.x2, y: v.y1 }, { x: w / 2, y: 0 },
            { x: v.x5, y: v.y1 }, { x: v.x6, y: v.y2 }, { x: v.x4, y: v.y3 }, { x: v.x3, y: v.y3 }
        ];
    }
    if (p === 'octagon') {
        return [
            { x: 0, y: v.x1 }, { x: v.x1, y: 0 }, { x: v.x2, y: 0 }, { x: w, y: v.x1 },
            { x: w, y: v.y2 }, { x: v.x2, y: h }, { x: v.x1, y: h }, { x: 0, y: v.y2 }
        ];
    }
    if (p === 'decagon') {
        return [
            { x: 0, y: h / 2 }, { x: v.x1, y: v.y2 }, { x: v.x2, y: v.y1 }, { x: v.x3, y: v.y1 },
            { x: v.x4, y: v.y2 }, { x: w, y: h / 2 }, { x: v.x4, y: v.y3 }, { x: v.x3, y: v.y4 },
            { x: v.x2, y: v.y4 }, { x: v.x1, y: v.y3 }
        ];
    }
    return [
        { x: 0, y: v.y2 }, { x: v.x1, y: v.y1 }, { x: v.x2, y: 0 }, { x: v.x3, y: 0 },
        { x: v.x4, y: v.y1 }, { x: w, y: v.y2 }, { x: w, y: v.y3 }, { x: v.x4, y: v.y4 },
        { x: v.x3, y: h }, { x: v.x2, y: h }, { x: v.x1, y: v.y4 }, { x: 0, y: v.y3 }
    ];
}

function polygon(preset: string, points: ReadonlyArray<GeometryPoint>): EvaluatedGeometry {
    return { preset, points, path: `${points.map((point: GeometryPoint, index: number): string => `${index ? 'L' : 'M'} ${f(point.x)} ${f(point.y)}`).join(' ')} Z` };
}

function f(value: number): string {
    return String(Number(value.toFixed(6)));
}
