import { EvaluatedGeometry, GeometryPoint } from './basic-presets';
import { BATCH_B_PRESET_DATA } from './generated/batch-b-preset-data';
import { BATCH_C_PRESET_DATA } from './generated/batch-c-preset-data';
import { PresetDefinition, PresetPathCommand, PresetPathDefinition, PresetPointExpression } from './preset-geometry-types';

/**
 * @internal
 */
export interface EvaluatedPresetPath {
    readonly path: string;
    readonly points: ReadonlyArray<GeometryPoint>;
    readonly fill: string;
    readonly stroke: boolean;
}

/**
 * @internal
 */
export interface EvaluatedBatchBPreset extends EvaluatedGeometry {
    readonly family: PresetDefinition['family'];
    readonly paths: ReadonlyArray<EvaluatedPresetPath>;
}

/**
 * @internal
 */
export type EvaluatedPresetGeometry = EvaluatedBatchBPreset;

/**
 * ports the batch-(b) guide/path tables used by `FormulaValues.ParseShapeFormula` and `ShapePath`.
 * @param {string} preset - preset
 * @param {number} width - width
 * @param {number} height - height
 * @param {Object} authored - authored
 * @returns {EvaluatedBatchBPreset|undefined} result
 * @internal
 */
export function evaluateBatchBPreset(
    preset: string,
    width: number,
    height: number,
    authored: Readonly<Record<string, number>> = {}
): EvaluatedBatchBPreset | undefined {
    return evaluatePresetDefinition(BATCH_B_PRESET_DATA, preset, width, height, authored);
}

/**
 * ports the batch-(c) guide/path tables used by `FormulaValues.ParseShapeFormula` and `ShapePath`.
 * @param {string} preset - preset
 * @param {number} width - width
 * @param {number} height - height
 * @param {Object} authored - authored
 * @returns {EvaluatedPresetGeometry|undefined} result
 * @internal
 */
export function evaluateBatchCPreset(
    preset: string,
    width: number,
    height: number,
    authored: Readonly<Record<string, number>> = {}
): EvaluatedPresetGeometry | undefined {
    return evaluatePresetDefinition(BATCH_C_PRESET_DATA, preset, width, height, authored);
}

function evaluatePresetDefinition(
    definitions: Readonly<Record<string, PresetDefinition>>,
    preset: string,
    width: number,
    height: number,
    authored: Readonly<Record<string, number>>
): EvaluatedPresetGeometry | undefined {
    const definition: PresetDefinition | undefined = definitions[preset];
    if (!definition) {
        return undefined;
    }
    const values: Record<string, number> = presetValues(width, height);
    for (const name of Object.keys(definition.defaults)) {
        values[name] = authored[name] === undefined ? definition.defaults[name] : authored[name];
    }
    for (const name of Object.keys(authored)) {
        values[name] = preset === 'circularArrow' && name !== 'adj1' && name !== 'adj5'
            ? authored[name] / 60000
            : authored[name];
    }
    for (const guide of definition.guides) {
        values[guide[0]] = evaluateGuide(guide[1], values);
    }
    const rendererOverride: EvaluatedPresetGeometry | undefined = evaluateRendererOverride(
        preset, definition.family, values, width, height);
    if (rendererOverride) {
        return rendererOverride;
    }
    const offsetX: number = (preset === 'callout1' || preset === 'borderCallout1')
        ? -Math.min(0, values.x1, values.x2)
        : 0;
    const paths: EvaluatedPresetPath[] = definition.paths.map(
        (path: PresetPathDefinition): EvaluatedPresetPath =>
            evaluatePath(path, values, width, height, Boolean(definition.mirrorY), offsetX));
    const outlinePaths: ReadonlyArray<EvaluatedPresetPath> = paths.filter(
        (path: EvaluatedPresetPath): boolean => path.fill === 'none' && path.stroke);
    const numericPaths: ReadonlyArray<EvaluatedPresetPath> = outlinePaths.length ? outlinePaths : paths;
    return {
        preset,
        family: definition.family,
        paths,
        points: numericPaths.reduce((all: GeometryPoint[], path: EvaluatedPresetPath): GeometryPoint[] =>
            all.concat(path.points as GeometryPoint[]), []),
        path: paths.map((value: EvaluatedPresetPath): string => value.path).join(' ')
    };
}

/**
 * ports the non-table path construction in `ShapePath` and `SlideToImageConverter.GetPath`.
 * @param {string} preset - preset
 * @param {Object} family - family
 * @param {Object} values - values
 * @param {number} width - width
 * @param {number} height - height
 * @returns {EvaluatedPresetGeometry|undefined} result
 */
function evaluateRendererOverride(
    preset: string,
    family: PresetDefinition['family'],
    values: Readonly<Record<string, number>>,
    width: number,
    height: number
): EvaluatedPresetGeometry | undefined {
    if (preset === 'flowChartInputOutput') {
        const inset: number = Math.min(width, height) / 4;
        return polygonOverride(preset, family, [
            { x: 0, y: height }, { x: inset, y: 0 }, { x: width, y: 0 }, { x: width - inset, y: height }
        ]);
    }
    if (preset === 'flowChartPunchedTape') {
        const builder: PathBuilder = pathBuilder();
        builder.arc(0, height / 10, width / 2, height / 5, 180, -180, true);
        builder.arc(width / 2, height / 10, width / 2, height / 5, 180, 180);
        builder.line(width, height * 0.9);
        builder.arc(width / 2, height * 0.9, width / 2, height / 5, 0, -180);
        builder.arc(0, height * 0.9, width / 2, height / 5, 0, 180);
        builder.close();
        return builderOverride(preset, family, builder);
    }
    if (preset === 'arc' || preset === 'pie' || preset === 'chord') {
        const start: number = values.stAng / 60000;
        const sweep: number = values.swAng / 60000;
        const builder: PathBuilder = pathBuilder();
        if (preset === 'pie') {
            builder.move(width / 2, height / 2);
        }
        builder.arc(0, 0, width, height, start, sweep, preset !== 'pie');
        if (preset !== 'arc') {
            builder.close();
        }
        const path: EvaluatedPresetPath = builder.value(preset === 'arc' ? 'none' : 'norm', true);
        if (preset !== 'arc') {
            return geometryOverride(preset, family, [path], builder.points);
        }
        const pie: PathBuilder = pathBuilder();
        pie.move(width / 2, height / 2); pie.arc(0, 0, width, height, start, sweep); pie.close();
        return geometryOverride(preset, family, [path, pie.value('norm', false)], builder.points);
    }
    if (preset === 'bracePair') {
        const x1: number = values.x1; const x2: number = values.x2;
        const builder: PathBuilder = pathBuilder();
        builder.arc(-x1 + x2, height - x1 * 2, x1 * 2, x1 * 2, 90, 90, true);
        builder.arc(-x1, values.y3 - x1, x1 * 2, x1 * 2, 0, -90);
        builder.arc(-x1, values.y3 - x1 * 3, x1 * 2, x1 * 2, 90, -90);
        builder.arc(-x1 + x2, 0, x1 * 2, x1 * 2, 180, 90);
        builder.arc(values.x3 - x1, 0, x1 * 2, x1 * 2, 270, 90, true);
        builder.arc(width - x1, values.y2 - x1, x1 * 2, x1 * 2, 180, -90);
        builder.arc(width - x1, values.y2 + x1, x1 * 2, x1 * 2, 270, -90);
        builder.arc(values.x3 - x1, values.y4, x1 * 2, x1, 0, 90);
        return builderOverride(preset, family, builder);
    }
    if (preset === 'blockArc') {
        const builder: PathBuilder = pathBuilder();
        builder.arc(0, 0, width, height, values.stAng / 60000, values.swAng / 60000, true);
        const innerHeight: number = Math.max(1, values.ihd2) * 2;
        const y: number = height - (values.y1 + values.ihd2);
        const alternateY: number = height - values.y6;
        builder.arc(values.dr, y > 0 || alternateY > 150 ? values.dr : alternateY,
                    Math.max(1, values.iwd2) * 2, innerHeight, values.istAng / 60000, values.iswAng / 60000);
        builder.close();
        return builderOverride(preset, family, builder);
    }
    if (preset === 'noSmoking') {
        const builder: PathBuilder = pathBuilder();
        for (const start of [180, 270, 0, 90]) {
            builder.arc(0, 0, width, height, start, 90, start === 180);
        }
        builder.close();
        const innerWidth: number = Math.max(1, values.iwd2) * 2;
        const innerHeight: number = Math.max(1, values.ihd2) * 2;
        builder.arc(values.dr, values.dr, innerWidth, innerHeight, values.stAng1, values.swAng, true);
        builder.close();
        builder.arc(values.dr, values.dr, innerWidth, innerHeight, values.stAng2, values.swAng, true);
        builder.close();
        return builderOverride(preset, family, builder);
    }
    if (preset === 'moon') {
        const builder: PathBuilder = pathBuilder();
        builder.arc(0, 0, width * 2, height, 90, 180, true);
        let start: number = values.stAng1;
        if (start < 180) {
            start += 180;
        }
        builder.arc(values.g0w, height / 2 - values.dy1, values.g18w * 2, values.dy1 * 2,
                    start, values.swAng1 % 360);
        builder.close();
        return builderOverride(preset, family, builder);
    }
    if (preset === 'funnel') {
        const builder: PathBuilder = pathBuilder();
        builder.arc(0, 0, width, height / 2, values.stAng1 - 2, values.swAng1 + 4, true);
        builder.line(values.x3, values.y2);
        builder.arc(values.x3 - values.rw3 * 2, values.y2 - values.rh3,
                    values.rw3 * 2, values.rh3 * 2, values.da, values.swAng3);
        builder.close();
        // Skia's GraphicsPath ignores the renderer's 360-degree AddArc call.
        return builderOverride(preset, family, builder);
    }
    if (preset === 'cloud') {
        const builder: PathBuilder = pathBuilder();
        const sx: (value: number) => number = (value: number): number => value * width / 43200;
        const sy: (value: number) => number = (value: number): number => value * height / 43200;
        const sizes: ReadonlyArray<[number, number]> = [
            [6753, 9190], [5333, 7267], [4365, 5945], [4857, 6595], [5333, 7273], [6775, 9220],
            [5785, 7867], [6752, 9215], [7720, 10543], [4360, 5918], [4345, 5945]
        ];
        const boxes: ReadonlyArray<[number, number]> = [
            [sx(4076), sy(3912)], [sx(13469), sy(1304)], [width / 2 + sx(531), 1],
            [sx(3900) + values.g27 + width / 2 + sx(3013), 1],
            [width - sx(5333) * 2 - sx(708), sy(6595) - sy(1127)],
            [width - sx(6775) * 2 + sx(354), height / 2 - sy(9129)],
            [width / 2 + sx(4608), height / 2 + sy(869)],
            [width / 2 - sx(6752) + sx(886), height - sy(9215) * 2],
            [sx(4962), height - sy(10543) * 2 - sy(2173)],
            [sx(1063), height / 2 + sy(2608)], [1, height / 2 - sy(5945) - sy(1304)]
        ];
        const angles: ReadonlyArray<[number, number]> = [
            [-11429249, 7426832], [-8646143, 5396714], [-8748475, 5983381], [-7859164, 7034504],
            [-4722533, 6541615], [-2776035, 7816140], [37501, 6842000], [1347096, 6910353],
            [3974558, 4542661], [-16496525, 8804134], [-14809710, 9151131]
        ];
        sizes.forEach((size: [number, number], index: number): void => builder.arc(
            boxes[index][0], boxes[index][1], sx(size[0]) * 2, sy(size[1]) * 2,
            Math.trunc(angles[index][0] / 60000), Math.trunc(angles[index][1] / 60000), index === 0));
        builder.close();
        builder.arc(width / 2 + sx(2658), height / 2, sx(6753) * 2, sy(9190) * 2,
                    Math.trunc(-824660 / 60000) - 45, Math.trunc(891534 / 60000) + 45, true);
        return builderOverride(preset, family, builder);
    }
    return undefined;
}

interface PathBuilder {
    readonly points: GeometryPoint[];
    move(x: number, y: number): void;
    line(x: number, y: number): void;
    arc(x: number, y: number, width: number, height: number, start: number, sweep: number, newFigure?: boolean): void;
    close(): void;
    value(fill: string, stroke: boolean): EvaluatedPresetPath;
}

function pathBuilder(): PathBuilder {
    const commands: string[] = []; const points: GeometryPoint[] = [];
    let current: GeometryPoint | undefined;
    const move: (x: number, y: number) => void = (x: number, y: number): void => {
        commands.push(`M ${format(x)} ${format(y)}`); points.push({ x, y }); current = { x, y };
    };
    const line: (x: number, y: number) => void = (x: number, y: number): void => {
        commands.push(`L ${format(x)} ${format(y)}`); points.push({ x, y }); current = { x, y };
    };
    const arc: (
        x: number, y: number, width: number, height: number,
        start: number, sweep: number, newFigure?: boolean
    ) => void = (
        x: number, y: number, arcWidth: number, arcHeight: number,
        start: number, sweep: number, newFigure: boolean = false
    ): void => {
        const radiusX: number = arcWidth / 2; const radiusY: number = arcHeight / 2;
        const centerX: number = x + radiusX; const centerY: number = y + radiusY;
        const pointAt: (angle: number) => GeometryPoint = (angle: number): GeometryPoint => ({
            x: centerX + radiusX * Math.cos(angleRadians(angle)),
            y: centerY + radiusY * Math.sin(angleRadians(angle))
        });
        const startPoint: GeometryPoint = pointAt(start);
        if (newFigure || commands.length === 0) {
            move(startPoint.x, startPoint.y);
        } else if (!current || Math.hypot(current.x - startPoint.x, current.y - startPoint.y) > 0.000001) {
            line(startPoint.x, startPoint.y);
        }
        let remaining: number = sweep; let angle: number = start;
        while (Math.abs(remaining) > 0.000001) {
            const step: number = Math.sign(remaining) * Math.min(180, Math.abs(remaining));
            angle += step; remaining -= step;
            const end: GeometryPoint = pointAt(angle);
            commands.push(`A ${format(Math.abs(radiusX))} ${format(Math.abs(radiusY))} 0 ${Math.abs(step) > 180 ? 1 : 0} ${step >= 0 ? 1 : 0} ${format(end.x)} ${format(end.y)}`);
            points.push(end); current = end;
        }
    };
    return {
        points, move, line, arc, close: (): void => {
            commands.push('Z');
        },
        value: (fill: string, stroke: boolean): EvaluatedPresetPath => ({ path: commands.join(' '), points, fill, stroke })
    };
}

function polygonOverride(
    preset: string, family: PresetDefinition['family'], points: ReadonlyArray<GeometryPoint>
): EvaluatedPresetGeometry {
    const path: string = points.map((point: GeometryPoint, index: number): string =>
        `${index === 0 ? 'M' : 'L'} ${format(point.x)} ${format(point.y)}`).join(' ') + ' Z';
    return geometryOverride(preset, family, [{ path, points, fill: 'norm', stroke: true }], points);
}

function builderOverride(
    preset: string, family: PresetDefinition['family'], builder: PathBuilder
): EvaluatedPresetGeometry {
    return geometryOverride(preset, family, [builder.value('norm', true)], builder.points);
}

function geometryOverride(
    preset: string,
    family: PresetDefinition['family'],
    paths: ReadonlyArray<EvaluatedPresetPath>,
    points: ReadonlyArray<GeometryPoint>
): EvaluatedPresetGeometry {
    return { preset, family, paths, points, path: paths.map((value: EvaluatedPresetPath): string => value.path).join(' ') };
}

function evaluatePath(
    definition: PresetPathDefinition,
    values: Readonly<Record<string, number>>,
    width: number,
    height: number,
    mirrorY: boolean,
    offsetX: number
): EvaluatedPresetPath {
    const coordinateWidth: number = definition.width ? operand(definition.width, values) : width;
    const coordinateHeight: number = definition.height ? operand(definition.height, values) : height;
    const scaleX: number = width / coordinateWidth;
    const scaleY: number = height / coordinateHeight;
    let current: GeometryPoint = { x: 0, y: 0 };
    let first: GeometryPoint = current;
    const points: GeometryPoint[] = [];
    const commands: string[] = [];
    const point: (expression: PresetPointExpression) => GeometryPoint = (expression: PresetPointExpression): GeometryPoint => {
        const rawY: number = operand(expression.y, values) * scaleY;
        return { x: operand(expression.x, values) * scaleX + offsetX, y: mirrorY ? height - rawY : rawY };
    };
    for (const command of definition.commands) {
        if (command.type === 'close') {
            commands.push('Z'); current = first; continue;
        }
        if (command.type === 'arc') {
            const radiusX: number = Math.abs(operand(command.widthRadius, values) * scaleX);
            const radiusY: number = Math.abs(operand(command.heightRadius, values) * scaleY);
            const start: number = angleRadians(operand(command.startAngle, values));
            const rawSweep: number = operand(command.sweepAngle, values);
            const authoredSweep: number = Math.abs(rawSweep) === 21600000
                ? rawSweep / 60000 * Math.PI / 180
                : angleRadians(rawSweep);
            const sweep: number = mirrorY ? -authoredSweep : authoredSweep;
            const centerX: number = current.x - radiusX * Math.cos(start);
            const centerY: number = current.y - (mirrorY ? -1 : 1) * radiusY * Math.sin(start);
            if (Math.abs(sweep) >= Math.PI * 2 - 0.000001) {
                const midpoint: GeometryPoint = {
                    x: centerX + radiusX * Math.cos(start + authoredSweep / 2),
                    y: centerY + (mirrorY ? -1 : 1) * radiusY * Math.sin(start + authoredSweep / 2)
                };
                const end: GeometryPoint = {
                    x: centerX + radiusX * Math.cos(start + authoredSweep),
                    y: centerY + (mirrorY ? -1 : 1) * radiusY * Math.sin(start + authoredSweep)
                };
                const sweepFlag: number = sweep >= 0 ? 1 : 0;
                commands.push(`A ${format(radiusX)} ${format(radiusY)} 0 0 ${sweepFlag} ${format(midpoint.x)} ${format(midpoint.y)}`);
                commands.push(`A ${format(radiusX)} ${format(radiusY)} 0 0 ${sweepFlag} ${format(end.x)} ${format(end.y)}`);
                // `midpoint` exists only to encode the SVG full circle; the DrawingML
                // authored anchor set still has one arc endpoint.
                points.push(end); current = end; continue;
            }
            const endAngle: number = start + authoredSweep;
            const end: GeometryPoint = {
                x: centerX + radiusX * Math.cos(endAngle),
                y: centerY + (mirrorY ? -1 : 1) * radiusY * Math.sin(endAngle)
            };
            commands.push(`A ${format(radiusX)} ${format(radiusY)} 0 ${Math.abs(sweep) > Math.PI ? 1 : 0} ${sweep >= 0 ? 1 : 0} ${format(end.x)} ${format(end.y)}`);
            points.push(end); current = end; continue;
        }
        const evaluated: GeometryPoint[] = command.points.map(point);
        const end: GeometryPoint = evaluated[evaluated.length - 1];
        if (command.type === 'move') {
            commands.push(`M ${format(end.x)} ${format(end.y)}`); first = end;
        } else if (command.type === 'line') {
            commands.push(`L ${format(end.x)} ${format(end.y)}`);
        } else if (command.type === 'quad') {
            commands.push(`Q ${evaluated.map(formatPoint).join(' ')}`);
        } else {
            commands.push(`C ${evaluated.map(formatPoint).join(' ')}`);
        }
        points.push(command.type === 'move' || command.type === 'line' ? evaluated[0] : end); current = end;
    }
    return { path: commands.join(' '), points, fill: definition.fill, stroke: definition.stroke };
}

function evaluateGuide(formula: string, values: Readonly<Record<string, number>>): number {
    const parts: string[] = formula.trim().split(/\s+/);
    const args: number[] = parts.slice(1).map((value: string): number => operand(value, values));
    switch (parts[0]) {
    case '*/': return args[2] === 0 ? 0 : args[0] * args[1] / args[2];
    case '+-': return args[0] + args[1] - args[2];
    case '+/': return args[2] === 0 ? 0 : (args[0] + args[1]) / args[2];
    case '?:': return args[0] > 0 ? args[1] : args[2];
    case 'abs': return Math.abs(args[0]);
    case 'at2': return Math.atan(args[1] / args[0]);
    case 'cat2': return args[0] * Math.cos(Math.atan2(args[2], args[1]));
    case 'cos': return args[0] * Math.cos(angleRadians(args[1]));
    case 'max': return Math.max(args[0], args[1]);
    case 'min': return Math.min(args[0], args[1]);
    case 'mod': return Math.sqrt(args[0] * args[0] + args[1] * args[1] + args[2] * args[2]);
    case 'pin': return Math.min(Math.max(args[1], args[0]), args[2]);
    case 'sat2': return args[0] * Math.sin(Math.atan2(args[2], args[1]));
    case 'sin': return args[0] * Math.sin(angleRadians(args[1]));
    case 'sqrt': return Math.sqrt(args[0]);
    case 'tan': return args[0] * Math.tan(angleRadians(args[1]));
    case 'val': return args[0];
    default: throw new Error(`Unsupported DrawingML guide formula: ${formula}`);
    }
}

function presetValues(width: number, height: number): Record<string, number> {
    const shortSide: number = Math.min(width, height);
    const values: Record<string, number> = {
        l: 0, t: 0, r: width, b: height, w: width, h: height, hc: width / 2, vc: height / 2,
        ss: shortSide, ls: Math.max(width, height)
    };
    for (const divisor of [2, 3, 4, 5, 6, 8, 10, 12, 16, 32]) {
        values[`wd${divisor}`] = width / divisor;
        values[`hd${divisor}`] = height / divisor;
        values[`ssd${divisor}`] = shortSide / divisor;
    }
    for (const divisor of [2, 4, 8, 16, 32]) {
        values[`cd${divisor}`] = 360 / divisor;
    }
    values['3cd4'] = 270; values['3cd8'] = 135;
    values['5cd8'] = 225; values['7cd8'] = 315;
    return values;
}

function operand(token: string, values: Readonly<Record<string, number>>): number {
    const numeric: number = Number(token);
    if (!Number.isNaN(numeric)) {
        return numeric;
    }
    if (values[token] !== undefined) {
        return values[token];
    }
    throw new Error(`Unknown DrawingML guide operand: ${token}`);
}

function angleRadians(value: number): number {
    return value * Math.PI / 180;
}
function formatPoint(value: GeometryPoint): string {
    return `${format(value.x)} ${format(value.y)}`;
}
function format(value: number): string {
    return String(Number(value.toFixed(6)));
}
