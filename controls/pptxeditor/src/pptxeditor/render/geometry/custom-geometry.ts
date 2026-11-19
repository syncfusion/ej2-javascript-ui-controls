import { CustomGeometry, GeometryGuide } from '@syncfusion/ej2-pptx';
import { GeometryPoint } from './basic-presets';
import { EvaluatedPresetPath } from './preset-geometry';

/**
 * @internal
 */
export interface EvaluatedConnectionSite extends GeometryPoint {
    readonly angleDegrees: number;
}

/**
 * @internal
 */
export interface EvaluatedCustomGeometry {
    readonly paths: ReadonlyArray<EvaluatedPresetPath>;
    readonly connectionSites: ReadonlyArray<EvaluatedConnectionSite>;
}

type CustomGeometryPath = CustomGeometry['paths'][number];
type CustomGeometryPoint = CustomGeometryPath['commands'][number] extends infer Command
    ? Command extends { readonly point: infer Point } ? Point
        : Command extends { readonly points: ReadonlyArray<infer Point> } ? Point : never
    : never;

/**
 * ports `SlideToImageConverter.GetGeomentryPath` custom-path dispatch.
 * @param {CustomGeometry} geometry - geometry
 * @param {number} width - width
 * @param {number} height - height
 * @returns {EvaluatedCustomGeometry} result
 * @internal
 */
export function evaluateCustomGeometry(
    geometry: CustomGeometry,
    width: number,
    height: number
): EvaluatedCustomGeometry {
    const firstPath: CustomGeometryPath | undefined = geometry.paths[0];
    const coordinateWidth: number = positive(optionalProperty(firstPath, 'width'), width);
    const coordinateHeight: number = positive(optionalProperty(firstPath, 'height'), height);
    const values: Record<string, number> = seedValues(coordinateWidth, coordinateHeight);
    evaluateGuides(geometry.adjustments, values);
    evaluateGuides(geometry.guides, values);
    const connectionSites: EvaluatedConnectionSite[] = geometry.connectionSites.map((site: import('@syncfusion/ej2-pptx').CustomGeometryConnectionSite): EvaluatedConnectionSite => ({
        ...scalePoint(site.point, values, coordinateWidth, coordinateHeight, width, height),
        angleDegrees: operand(site.angle, values) / 60000
    }));
    return {
        paths: geometry.paths.map((path: CustomGeometryPath): EvaluatedPresetPath =>
            evaluatePath(path, values, width, height)),
        connectionSites
    };
}

function evaluatePath(
    definition: CustomGeometryPath,
    inheritedValues: Readonly<Record<string, number>>,
    width: number,
    height: number
): EvaluatedPresetPath {
    const coordinateWidth: number = positive(definition.width, width);
    const coordinateHeight: number = positive(definition.height, height);
    const values: Record<string, number> = {
        ...seedValues(coordinateWidth, coordinateHeight), ...inheritedValues
    };
    const scaleX: number = width / coordinateWidth;
    const scaleY: number = height / coordinateHeight;
    const commands: string[] = [];
    const points: GeometryPoint[] = [];
    let current: GeometryPoint = { x: 0, y: 0 };
    for (const command of definition.commands) {
        if (command.kind === 'close') {
            commands.push('Z');
            continue;
        }
        if (command.kind === 'arc') {
            const radiusX: number = Math.abs(operand(command.widthRadius, values) / 12700);
            const radiusY: number = Math.abs(operand(command.heightRadius, values) / 12700);
            const start: number = operand(command.startAngle, values) / 60000;
            const sweep: number = operand(command.sweepAngle, values) / 60000;
            appendArc(commands, points, current, radiusX, radiusY, start, sweep);
            current = points[points.length - 1] || current;
            continue;
        }
        if (command.kind === 'move' || command.kind === 'line') {
            current = scalePoint(command.point, values, coordinateWidth, coordinateHeight, width, height);
            points.push(current);
            commands.push(`${command.kind === 'move' ? 'M' : 'L'} ${format(current.x)} ${format(current.y)}`);
            continue;
        }
        if (command.kind !== 'quadratic' && command.kind !== 'cubic') {
            continue;
        }
        const evaluated: GeometryPoint[] = command.points.map((point: CustomGeometryPoint): GeometryPoint =>
            scalePoint(point, values, coordinateWidth, coordinateHeight, width, height));
        if (command.kind === 'quadratic' && evaluated.length >= 2) {
            const control: GeometryPoint = evaluated[0];
            const end: GeometryPoint = evaluated[1];
            points.push(control, end, end);
            commands.push(`C ${format(control.x)} ${format(control.y)} ${format(end.x)} ${format(end.y)} ${format(end.x)} ${format(end.y)}`);
        } else {
            points.push(...evaluated);
            commands.push(`C ${evaluated.map((point: GeometryPoint): string =>
                `${format(point.x)} ${format(point.y)}`).join(' ')}`);
        }
        current = evaluated[evaluated.length - 1] || current;
    }
    return {
        path: commands.join(' '),
        points,
        fill: definition.fill || 'norm',
        stroke: definition.stroke !== false
    };
}

/**
 * ports `SlideToImageConverter.GetGeomentryPath`'s origin-anchored EMU arc.
 * @param {string[]} commands - commands
 * @param {GeometryPoint[]} points - points
 * @param {GeometryPoint} current - current
 * @param {number} radiusX - radiusX
 * @param {number} radiusY - radiusY
 * @param {number} startDegrees - startDegrees
 * @param {number} sweepDegrees - sweepDegrees
 * @returns {void} result
 */
function appendArc(
    commands: string[],
    points: GeometryPoint[],
    current: GeometryPoint,
    radiusX: number,
    radiusY: number,
    startDegrees: number,
    sweepDegrees: number
): void {
    const startRadians: number = startDegrees * Math.PI / 180;
    const centerX: number = radiusX;
    const centerY: number = radiusY;
    const startPoint: GeometryPoint = {
        x: centerX + radiusX * Math.cos(startRadians),
        y: centerY + radiusY * Math.sin(startRadians)
    };
    if (Math.hypot(current.x - startPoint.x, current.y - startPoint.y) > 0.000001) {
        commands.push(`L ${format(startPoint.x)} ${format(startPoint.y)}`);
        points.push(startPoint);
    }
    let remaining: number = sweepDegrees;
    let angle: number = startDegrees;
    while (Math.abs(remaining) > 0.000001) {
        const step: number = Math.sign(remaining) * Math.min(180, Math.abs(remaining));
        angle += step;
        remaining -= step;
        const radians: number = angle * Math.PI / 180;
        const end: GeometryPoint = {
            x: centerX + radiusX * Math.cos(radians),
            y: centerY + radiusY * Math.sin(radians)
        };
        commands.push(`A ${format(radiusX)} ${format(radiusY)} 0 0 ${step >= 0 ? 1 : 0} ${format(end.x)} ${format(end.y)}`);
        points.push(end);
    }
}

function evaluateGuides(guides: ReadonlyArray<GeometryGuide>, values: Record<string, number>): void {
    for (const guide of guides) {
        values[guide.name] = evaluateGuide(guide.formula, values);
    }
}

/**
 * ports `FormulaValues.GetResultValue` for authored custom-geometry guides.
 * @param {string} formula - formula
 * @param {Object} values - values
 * @returns {number} result
 */
function evaluateGuide(formula: string, values: Readonly<Record<string, number>>): number {
    const tokens: string[] = formula.trim().split(/\s+/);
    const op: string = tokens[0] || 'val';
    const args: number[] = tokens.slice(1).map((token: string): number => operand(token, values));
    switch (op) {
    case '*/': return args[2] === 0 ? 0 : args[0] * args[1] / args[2];
    case '+-': return args[0] + args[1] - args[2];
    case '+/': return args[2] === 0 ? 0 : (args[0] + args[1]) / args[2];
    case '?:': return args[0] > 0 ? args[1] : args[2];
    case 'abs': return Math.abs(args[0]);
    case 'max': return Math.max(args[0], args[1]);
    case 'min': return Math.min(args[0], args[1]);
    case 'pin': return Math.min(Math.max(args[1], args[0]), args[2]);
    case 'sqrt': return Math.sqrt(Math.max(0, args[0]));
    case 'mod': return Math.hypot(args[0], args[1], args[2]);
    case 'at2': return Math.atan2(args[1], args[0]) * 180 / Math.PI * 60000;
    case 'sin': return args[0] * Math.sin(args[1] / 60000 * Math.PI / 180);
    case 'cos': return args[0] * Math.cos(args[1] / 60000 * Math.PI / 180);
    case 'tan': return args[0] * Math.tan(args[1] / 60000 * Math.PI / 180);
    case 'cat2': return args[0] * Math.cos(Math.atan2(args[2], args[1]));
    case 'sat2': return args[0] * Math.sin(Math.atan2(args[2], args[1]));
    default: return args[0] || 0;
    }
}

function seedValues(width: number, height: number): Record<string, number> {
    const short: number = Math.min(width, height);
    return {
        l: 0, t: 0, r: width, b: height, w: width, h: height,
        hc: width / 2, vc: height / 2, wd2: width / 2, wd4: width / 4,
        hd2: height / 2, hd4: height / 4, ss: short, ssd2: short / 2,
        cd2: 10800000, cd4: 5400000, cd8: 2700000,
        '3cd4': 16200000, '3cd8': 8100000, '5cd8': 13500000, '7cd8': 18900000
    };
}

function operand(token: string, values: Readonly<Record<string, number>>): number {
    const numeric: number = Number(token);
    return Number.isFinite(numeric) ? numeric : values[token] === undefined ? 0 : values[token];
}

function scalePoint(
    point: CustomGeometryPoint,
    values: Readonly<Record<string, number>>,
    coordinateWidth: number,
    coordinateHeight: number,
    width: number,
    height: number
): GeometryPoint {
    return {
        x: operand(point.x, values) * width / coordinateWidth,
        y: operand(point.y, values) * height / coordinateHeight
    };
}

function positive(value: string | undefined, fallback: number): number {
    const numeric: number = Number(value);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : Math.max(fallback, 1);
}

function format(value: number): string {
    const normalized: number = Math.abs(value) < 0.0000005 ? 0 : value;
    return Number.isInteger(normalized) ? String(normalized) : String(Number(normalized.toFixed(6)));
}

/** Reads a property only when its owner is present.
 * @param {*} value - Potentially absent owner.
 * @param {*} key - Property key.
 * @returns {*} Property value or undefined.
 */
function optionalProperty<T, K extends keyof T>(value: T | null | undefined, key: K): T[K] | undefined {
    return value !== undefined && value !== null ? value[key] : undefined;
}
