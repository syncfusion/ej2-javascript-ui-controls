import { GeometryPoint } from './basic-presets';

/**
 * @internal
 */
export interface GroupTransform {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly childX: number;
    readonly childY: number;
    readonly childWidth: number;
    readonly childHeight: number;
    readonly flipHorizontal: boolean;
    readonly flipVertical: boolean;
    readonly rotationDegrees: number;
}

/**
 * ports `RendererBase.DrawGroupShape` child-coordinate mapping; flip precedes rotation.
 * @param {GeometryPoint} point - point
 * @param {GroupTransform} group - group
 * @returns {GeometryPoint} result
 * @internal
 */
export function mapGroupPoint(point: GeometryPoint, group: GroupTransform): GeometryPoint {
    const safeChildWidth: number = group.childWidth === 0 ? 1 : group.childWidth;
    const safeChildHeight: number = group.childHeight === 0 ? 1 : group.childHeight;
    let x: number = group.x + (point.x - group.childX) * group.width / safeChildWidth;
    let y: number = group.y + (point.y - group.childY) * group.height / safeChildHeight;
    const centerX: number = group.x + group.width / 2;
    const centerY: number = group.y + group.height / 2;
    if (group.flipHorizontal) {
        x = centerX * 2 - x;
    }
    if (group.flipVertical) {
        y = centerY * 2 - y;
    }
    if (group.rotationDegrees) {
        const radians: number = group.rotationDegrees * Math.PI / 180;
        const dx: number = x - centerX;
        const dy: number = y - centerY;
        x = centerX + dx * Math.cos(radians) - dy * Math.sin(radians);
        y = centerY + dx * Math.sin(radians) + dy * Math.cos(radians);
    }
    return { x, y };
}

/**
 * ports the group `chOff/chExt` affine mapping used by `RendererBase.DrawGroupShape`.
 * @param {GroupTransform} group - group
 * @returns {string} result
 * @internal
 */
export function groupSvgTransform(group: GroupTransform): string {
    const scaleX: number = group.width / (group.childWidth || 1);
    const scaleY: number = group.height / (group.childHeight || 1);
    const centerX: number = group.x + group.width / 2;
    const centerY: number = group.y + group.height / 2;
    const operations: string[] = [];
    if (group.rotationDegrees) {
        operations.push(`rotate(${format(group.rotationDegrees)} ${format(centerX)} ${format(centerY)})`);
    }
    if (group.flipHorizontal || group.flipVertical) {
        operations.push(`translate(${format(centerX)} ${format(centerY)})`);
        operations.push(`scale(${group.flipHorizontal ? -1 : 1} ${group.flipVertical ? -1 : 1})`);
        operations.push(`translate(${format(-centerX)} ${format(-centerY)})`);
    }
    operations.push(`translate(${format(group.x - group.childX * scaleX)} ${format(group.y - group.childY * scaleY)})`);
    operations.push(`scale(${format(scaleX)} ${format(scaleY)})`);
    return operations.join(' ');
}

/**
 * ports the same group affine mapping for the positioned HTML text layer.
 * @param {GroupTransform} group - group
 * @returns {string} result
 * @internal
 */
export function groupCssTransform(group: GroupTransform): string {
    const origin: GeometryPoint = mapGroupPoint({ x: 0, y: 0 }, group);
    const horizontal: GeometryPoint = mapGroupPoint({ x: 1, y: 0 }, group);
    const vertical: GeometryPoint = mapGroupPoint({ x: 0, y: 1 }, group);
    return `matrix(${format(horizontal.x - origin.x)}, ${format(horizontal.y - origin.y)}, ` +
        `${format(vertical.x - origin.x)}, ${format(vertical.y - origin.y)}, ` +
        // CSS matrix translation components are unitless CSS pixels, while
        // the group mapper and positioned text boxes are expressed in points.
        `${format(origin.x * 96 / 72)}, ${format(origin.y * 96 / 72)})`;
}

function format(value: number): string {
    return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));
}
