import { GeometryPoint } from './basic-presets';

/**
 * @internal
 */
export interface EvaluatedConnector {
    readonly path: string;
    readonly points: ReadonlyArray<GeometryPoint>;
}

/**
 * ports the rectangle-family cases in `Connector.GetPositionsWithConnectionSite`.
 * @param {number} x - x
 * @param {number} y - y
 * @param {number} width - width
 * @param {number} height - height
 * @param {number} siteIndex - siteIndex
 * @returns {GeometryPoint|undefined} result
 * @internal
 */
export function rectangleConnectionSite(
    x: number,
    y: number,
    width: number,
    height: number,
    siteIndex: number
): GeometryPoint | undefined {
    switch (siteIndex) {
    case 0: return { x: x + width / 2, y };
    case 1: return { x, y: y + height / 2 };
    case 2: return { x: x + width / 2, y: y + height };
    case 3: return { x: x + width, y: y + height / 2 };
    default: return undefined;
    }
}

/**
 * ports `ShapePath.GetBentConnector*Path` and `ShapePath.GetCurvedConnector*Path`.
 * @param {string} preset - preset
 * @param {number} width - width
 * @param {number} height - height
 * @param {Object} adjustments - adjustments
 * @returns {EvaluatedConnector} result
 * @internal
 */
export function routeConnector(
    preset: string,
    width: number,
    height: number,
    adjustments: Readonly<Record<string, number>>
): EvaluatedConnector {
    const ratio: (name: string, fallback: number) => number = (name: string, fallback: number): number =>
        Math.min(1, Math.max(0, (adjustments[name] === undefined ? fallback : adjustments[name]) / 100000));
    if (preset === 'bentConnector2') {
        const points: { x: number; y: number; }[] = [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }];
        return { points, path: polyline(points) };
    }
    if (/^bentConnector[3-5]$/.test(preset)) {
        const x1: number = width * ratio('adj1', 50000);
        const y2: number = height * ratio('adj2', 50000);
        const x3: number = width * ratio('adj3', 50000);
        const points: { x: number; y: number; }[] = preset === 'bentConnector3'
            ? [{ x: 0, y: 0 }, { x: x1, y: 0 }, { x: x1, y: height }, { x: width, y: height }]
            : preset === 'bentConnector4'
                ? [{ x: 0, y: 0 }, { x: x1, y: 0 }, { x: x1, y: y2 }, { x: width, y: y2 }, { x: width, y: height }]
                : [{ x: 0, y: 0 }, { x: x1, y: 0 }, { x: x1, y: y2 }, { x: x3, y: y2 },
                    { x: x3, y: height }, { x: width, y: height }];
        return { points, path: polyline(points) };
    }
    if (preset === 'curvedConnector2') {
        const points: { x: number; y: number; }[] = [
            { x: 0, y: 0 },
            { x: width / 2, y: 0 },
            { x: width, y: height / 2 },
            { x: width, y: height }
        ];
        return { points, path: bezierPath(points) };
    }
    if (preset === 'curvedConnector3') {
        const x2: number = width * ratio('adj1', 50000);
        const points: { x: number; y: number; }[] = [
            { x: 0, y: 0 }, { x: x2 / 2, y: 0 }, { x: x2, y: height / 4 }, { x: x2, y: height / 2 },
            { x: x2, y: height * 3 / 4 }, { x: (width + x2) / 2, y: height }, { x: width, y: height }
        ];
        return { points, path: bezierPath(points) };
    }
    if (preset === 'curvedConnector4') {
        const x2: number = width * ratio('adj1', 50000); const y4: number = height * ratio('adj2', 50000);
        const x3: number = (width + x2) / 2; const y1: number = y4 / 2;
        const points: { x: number; y: number; }[] = [
            { x: 0, y: 0 }, { x: x2 / 2, y: 0 }, { x: x2, y: y1 / 2 }, { x: x2, y: y1 },
            { x: x2, y: (y1 + y4) / 2 }, { x: (x2 + x3) / 2, y: y4 }, { x: x3, y: y4 },
            { x: (x3 + width) / 2, y: y4 }, { x: width, y: (height + y4) / 2 }, { x: width, y: height }
        ];
        return { points, path: bezierPath(points) };
    }
    if (preset === 'curvedConnector5') {
        const x3: number = width * ratio('adj1', 50000); const y4: number = height * ratio('adj2', 50000);
        const x6: number = width * ratio('adj3', 50000); const x1: number = (x3 + x6) / 2; const y1: number = y4 / 2;
        const y5: number = (height + y4) / 2;
        const points: { x: number; y: number; }[] = [
            { x: 0, y: 0 }, { x: x3 / 2, y: 0 }, { x: x3, y: y1 / 2 }, { x: x3, y: y1 },
            { x: x3, y: (y1 + y4) / 2 }, { x: (x3 + x1) / 2, y: y4 }, { x: x1, y: y4 },
            { x: (x6 + x1) / 2, y: y4 }, { x: x6, y: (y5 + y4) / 2 }, { x: x6, y: y5 },
            { x: x6, y: (y5 + height) / 2 }, { x: (x6 + width) / 2, y: height }, { x: width, y: height }
        ];
        return { points, path: bezierPath(points) };
    }
    const points: GeometryPoint[] = [{ x: 0, y: 0 }, { x: width, y: height }];
    return { points, path: polyline(points) };
}

function bezierPath(points: ReadonlyArray<GeometryPoint>): string {
    const commands: string[] = [`M ${format(points[0].x)} ${format(points[0].y)}`];
    for (let index: number = 1; index + 2 < points.length; index += 3) {
        commands.push(`C ${format(points[index].x)} ${format(points[index].y)} ` +
      `${format(points[index + 1].x)} ${format(points[index + 1].y)} ` +
      `${format(points[index + 2].x)} ${format(points[index + 2].y)}`);
    }
    return commands.join(' ');
}

function polyline(points: ReadonlyArray<GeometryPoint>): string {
    return points.map((point: GeometryPoint, index: number): string =>
        `${index === 0 ? 'M' : 'L'} ${format(point.x)} ${format(point.y)}`).join(' ');
}

function format(value: number): string {
    return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));
}
