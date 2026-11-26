import {
    PdfBrush,
    PdfDashStyle,
    PdfFillMode,
    PdfFont,
    PdfFontFamily,
    PdfFontStyle,
    PdfGraphics,
    PdfGraphicsState,
    PdfPath,
    PdfPen,
    PdfStandardFont,
    PdfStringFormat,
    PdfTextAlignment,
    PdfVerticalAlignment,
    Point,
    Rectangle
} from '@syncfusion/ej2-pdf';
import { IShape, ICellStyle, IRichTextRun, ExcelPattern, ExcelHAlign, ExcelVAlign, ExcelLineStyle } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { parseHexColor, toPdfColor } from '../common/index';
import { RichTextRenderer } from './rich-text-renderer';

type NormPt = [number, number];

/**
 * Renders all OpenXML AutoShape presets (rectangles, polygons, stars, arrows, callouts, equations, etc.)
 * with rotation, dash styles, fill/stroke styling, and aligned text.
 */
export class ShapeRenderer {
    /**
     * Renders a vector AutoShape onto the target graphics canvas.
     *
     * @param {PdfGraphics} graphics - The target PDF page graphics context.
     * @param {IShape} shape - The shape data model.
     * @param {Rectangle} rect - The bounding rectangle where the shape should be drawn in points.
     * @returns {boolean} True if the shape was successfully rendered.
     */
    public static renderAutoShape(graphics: PdfGraphics, shape: IShape, rect: Rectangle): boolean {
        const preset: string = (shape.presetType || shape.type || 'rect').trim();
        const key: string = preset.toLowerCase();
        const fillBrush: PdfBrush | null = shape.fillColor ? new PdfBrush(toPdfColor(shape.fillColor)) : null;
        let borderPen: PdfPen | null = null;
        if (isNullOrUndefined(shape.borderWidth) || shape.borderWidth > 0) {
            const borderCol: { r: number; g: number; b: number } = shape.borderColor
                ? toPdfColor(shape.borderColor)
                : { r: 68, g: 114, b: 196 };
            borderPen = new PdfPen(borderCol, shape.borderWidth || 1);
            this.applyDashStyle(borderPen, shape.borderDashStyle);
        }
        const hasRotation: boolean = Boolean(shape.rotation && Math.abs(shape.rotation) > 0.01);
        let savedState: PdfGraphicsState | null = null;
        if (hasRotation) {
            savedState = graphics.save();
            const cx: number = rect.x + rect.width / 2;
            const cy: number = rect.y + rect.height / 2;
            const graphicsWithTransform: {
                translateTransform: (point: { x: number; y: number }) => void;
                rotateTransform: (angle: number) => void;
            } = graphics as unknown as {
                translateTransform: (point: { x: number; y: number }) => void;
                rotateTransform: (angle: number) => void;
            };
            graphicsWithTransform.translateTransform({ x: cx, y: cy });
            graphicsWithTransform.rotateTransform(shape.rotation || 0);
            graphicsWithTransform.translateTransform({ x: -cx, y: -cy });
        }
        const drawn: boolean = this.drawPresetGeometry(graphics, key, rect, fillBrush, borderPen, shape);
        if (drawn) {
            this.drawShapeText(graphics, shape, rect);
        }
        if (hasRotation && !isNullOrUndefined(savedState)) {
            graphics.restore(savedState);
        }
        return drawn;
    }

    private static applyDashStyle(pen: PdfPen, dashStyle?: string): void {
        if (!dashStyle) { return; }
        switch (dashStyle.toLowerCase()) {
        case 'dash':
        case 'dashed':
            pen.dashStyle = PdfDashStyle.dash;
            break;
        case 'dot':
        case 'dotted':
            pen.dashStyle = PdfDashStyle.dot;
            break;
        case 'dashdot':
            pen.dashStyle = PdfDashStyle.dashDot;
            break;
        case 'dashdotdot':
            pen.dashStyle = PdfDashStyle.dashDotDot;
            break;
        default:
            pen.dashStyle = PdfDashStyle.solid;
            break;
        }
    }

    private static drawPresetGeometry(
        graphics: PdfGraphics,
        key: string,
        rect: Rectangle,
        fillBrush: PdfBrush | null,
        borderPen: PdfPen | null,
        shape: IShape
    ): boolean {
        if (shape.pathPoints && shape.pathPoints.length >= 3) {
            this.drawAbsolutePolygon(graphics, shape.pathPoints, fillBrush, borderPen);
            return true;
        }
        switch (key) {
        case 'line':
        case 'straightconnector1': {
            if (borderPen) {
                graphics.drawLine(borderPen, { x: rect.x, y: rect.y }, { x: rect.x + rect.width, y: rect.y + rect.height });
            }
            return true;
        }
        case 'rect':
        case 'rectangle':
        case 'textbox': {
            if (fillBrush) { graphics.drawRectangle(rect, fillBrush); }
            if (borderPen) { graphics.drawRectangle(rect, borderPen); }
            return true;
        }
        case 'roundrect':
        case 'rounded rectangle':
        case 'round1rect':
        case 'round2samerect':
        case 'round2diagrect':
        case 'sniproundrect': {
            this.drawRoundedRectVariant(graphics, key, rect, fillBrush, borderPen);
            return true;
        }
        case 'ellipse':
        case 'oval':
        case 'circle': {
            if (fillBrush) { graphics.drawEllipse(rect, fillBrush); }
            if (borderPen) { graphics.drawEllipse(rect, borderPen); }
            return true;
        }
        case 'donut':
        case 'hollow circle': {
            const path: PdfPath = new PdfPath();
            path.fillMode = PdfFillMode.alternate;
            path.addEllipse(rect);
            const insetX: number = rect.width * 0.22;
            const insetY: number = rect.height * 0.22;
            path.addEllipse({
                x: rect.x + insetX,
                y: rect.y + insetY,
                width: Math.max(2, rect.width - 2 * insetX),
                height: Math.max(2, rect.height - 2 * insetY)
            });
            this.drawPdfPath(graphics, path, fillBrush, borderPen);
            return true;
        }
        case 'pie': {
            const path: PdfPath = new PdfPath();
            path.addPie(rect, 0, 270);
            this.drawPdfPath(graphics, path, fillBrush, borderPen);
            return true;
        }
        case 'stripedrightarrow': {
            this.drawNormalizedPolygon(graphics, rect, [[0, 0.25], [0.06, 0.25], [0.06, 0.75], [0, 0.75]], fillBrush, borderPen);
            this.drawNormalizedPolygon(graphics, rect, [[0.1, 0.25], [0.16, 0.25], [0.16, 0.75], [0.1, 0.75]], fillBrush, borderPen);
            this.drawNormalizedPolygon(
                graphics, rect,
                [[0.2, 0.25], [0.65, 0.25], [0.65, 0], [1, 0.5], [0.65, 1], [0.65, 0.75], [0.2, 0.75]],
                fillBrush, borderPen
            );
            return true;
        }
        case 'chord': {
            const path: PdfPath = new PdfPath();
            path.addArc(rect, 30, 240);
            path.closeFigure();
            this.drawPdfPath(graphics, path, fillBrush, borderPen);
            return true;
        }
        case 'heart': {
            this.drawHeart(graphics, rect, fillBrush, borderPen);
            return true;
        }
        case 'teardrop': {
            this.drawTeardrop(graphics, rect, fillBrush, borderPen);
            return true;
        }
        case 'mathdivide': {
            this.drawMathDivide(graphics, rect, fillBrush, borderPen);
            return true;
        }
        case 'mathequal': {
            this.drawNormalizedPolygon(graphics, rect, [[0.1, 0.22], [0.9, 0.22], [0.9, 0.42], [0.1, 0.42]], fillBrush, borderPen);
            this.drawNormalizedPolygon(graphics, rect, [[0.1, 0.58], [0.9, 0.58], [0.9, 0.78], [0.1, 0.78]], fillBrush, borderPen);
            return true;
        }
        case 'frame': {
            const path: PdfPath = new PdfPath();
            path.fillMode = PdfFillMode.alternate;
            path.addRectangle(rect);
            const pad: number = Math.min(rect.width, rect.height) * 0.16;
            path.addRectangle({
                x: rect.x + pad,
                y: rect.y + pad,
                width: Math.max(2, rect.width - 2 * pad),
                height: Math.max(2, rect.height - 2 * pad)
            });
            this.drawPdfPath(graphics, path, fillBrush, borderPen);
            return true;
        }
        default: {
            const pts: NormPt[] | null = this.getNormalizedPolygonPoints(key);
            if (pts) {
                this.drawNormalizedPolygon(graphics, rect, pts, fillBrush, borderPen);
                return true;
            }
            if (fillBrush) { graphics.drawRectangle(rect, fillBrush); }
            if (borderPen) { graphics.drawRectangle(rect, borderPen); }
            return true;
        }
        }
    }

    private static getNormalizedPolygonPoints(key: string): NormPt[] | null {
        switch (key) {
        case 'snip1rect':
            return [[0, 0], [0.82, 0], [1, 0.18], [1, 1], [0, 1]];
        case 'snip2samerect':
            return [[0.18, 0], [0.82, 0], [1, 0.18], [1, 1], [0, 1], [0, 0.18]];
        case 'snip2diagrect':
            return [[0.18, 0], [1, 0], [1, 0.82], [0.82, 1], [0, 1], [0, 0.18]];
        case 'diamond':
            return [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]];
        case 'triangle':
        case 'isoscelestriangle':
            return [[0.5, 0], [1, 1], [0, 1]];
        case 'rttriangle':
            return [[0, 0], [1, 1], [0, 1]];
        case 'parallelogram':
            return [[0.2, 0], [1, 0], [0.8, 1], [0, 1]];
        case 'trapezoid':
            return [[0.2, 0], [0.8, 0], [1, 1], [0, 1]];
        case 'pentagon':
            return this.regularPolygon(5, -Math.PI / 2);
        case 'hexagon':
            return this.regularPolygon(6, 0);
        case 'heptagon':
            return this.regularPolygon(7, -Math.PI / 2);
        case 'octagon':
            return this.regularPolygon(8, Math.PI / 8);
        case 'decagon':
            return this.regularPolygon(10, -Math.PI / 2);
        case 'dodecagon':
            return this.regularPolygon(12, Math.PI / 12);
        case 'plus':
        case 'mathplus':
            return [
                [0.35, 0], [0.65, 0], [0.65, 0.35], [1, 0.35], [1, 0.65], [0.65, 0.65],
                [0.65, 1], [0.35, 1], [0.35, 0.65], [0, 0.65], [0, 0.35], [0.35, 0.35]
            ];
        case 'mathminus':
            return [[0.08, 0.36], [0.92, 0.36], [0.92, 0.64], [0.08, 0.64]];
        case 'mathmultiply':
            return [
                [0.2, 0.06], [0.5, 0.36], [0.8, 0.06], [0.94, 0.2], [0.64, 0.5], [0.94, 0.8],
                [0.8, 0.94], [0.5, 0.64], [0.2, 0.94], [0.06, 0.8], [0.36, 0.5], [0.06, 0.2]
            ];
        case 'halfframe':
            return [[0, 0], [1, 0], [0.8, 0.25], [0.25, 0.25], [0.25, 0.8], [0, 1]];
        case 'rightarrow':
        case 'arrow':
            return [[0, 0.25], [0.62, 0.25], [0.62, 0], [1, 0.5], [0.62, 1], [0.62, 0.75], [0, 0.75]];
        case 'leftarrow':
            return [[1, 0.25], [0.38, 0.25], [0.38, 0], [0, 0.5], [0.38, 1], [0.38, 0.75], [1, 0.75]];
        case 'uparrow':
            return [[0.25, 1], [0.25, 0.38], [0, 0.38], [0.5, 0], [1, 0.38], [0.75, 0.38], [0.75, 1]];
        case 'downarrow':
            return [[0.25, 0], [0.25, 0.62], [0, 0.62], [0.5, 1], [1, 0.62], [0.75, 0.62], [0.75, 0]];
        case 'leftrightarrow':
            return [
                [0, 0.5], [0.25, 0], [0.25, 0.25], [0.75, 0.25], [0.75, 0], [1, 0.5],
                [0.75, 1], [0.75, 0.75], [0.25, 0.75], [0.25, 1]
            ];
        case 'updownarrow':
            return [
                [0.5, 0], [1, 0.25], [0.75, 0.25], [0.75, 0.75], [1, 0.75], [0.5, 1],
                [0, 0.75], [0.25, 0.75], [0.25, 0.25], [0, 0.25]
            ];
        case 'quadarrow':
            return [
                [0.5, 0], [0.66, 0.2], [0.58, 0.2], [0.58, 0.42], [0.8, 0.42], [0.8, 0.34], [1, 0.5],
                [0.8, 0.66], [0.8, 0.58], [0.58, 0.58], [0.58, 0.8], [0.66, 0.8], [0.5, 1],
                [0.34, 0.8], [0.42, 0.8], [0.42, 0.58], [0.2, 0.58], [0.2, 0.66], [0, 0.5],
                [0.2, 0.34], [0.2, 0.42], [0.42, 0.42], [0.42, 0.2], [0.34, 0.2]
            ];
        case 'notchedrightarrow':
            return [[0, 0.25], [0.65, 0.25], [0.65, 0], [1, 0.5], [0.65, 1], [0.65, 0.75], [0, 0.75], [0.15, 0.5]];
        case 'stripedrightarrow':
            return [[0.2, 0.25], [0.65, 0.25], [0.65, 0], [1, 0.5], [0.65, 1], [0.65, 0.75], [0.2, 0.75]];
        case 'rightarrowcallout':
            return [
                [0, 0], [0.65, 0], [0.65, 0.35], [0.82, 0.35], [0.82, 0.2], [1, 0.5],
                [0.82, 0.8], [0.82, 0.65], [0.65, 0.65], [0.65, 1], [0, 1]
            ];
        case 'leftarrowcallout':
            return [
                [0.35, 0], [1, 0], [1, 1], [0.35, 1], [0.35, 0.65], [0.18, 0.65],
                [0.18, 0.8], [0, 0.5], [0.18, 0.2], [0.18, 0.35], [0.35, 0.35]
            ];
        case 'uparrowcallout':
            return [
                [0.5, 0], [0.8, 0.18], [0.65, 0.18], [0.65, 0.35], [1, 0.35], [1, 1],
                [0, 1], [0, 0.35], [0.35, 0.35], [0.35, 0.18], [0.2, 0.18]
            ];
        case 'downarrowcallout':
            return [
                [0, 0], [1, 0], [1, 0.65], [0.65, 0.65], [0.65, 0.82], [0.8, 0.82],
                [0.5, 1], [0.2, 0.82], [0.35, 0.82], [0.35, 0.65], [0, 0.65]
            ];
        case 'homeplate':
            return [[0, 0], [0.75, 0], [1, 0.5], [0.75, 1], [0, 1]];
        case 'chevron':
            return [[0, 0], [0.75, 0], [1, 0.5], [0.75, 1], [0, 1], [0.25, 0.5]];
        case 'star4': return this.starPolygon(4, 0.36);
        case 'star5': return this.starPolygon(5, 0.38);
        case 'star6': return this.starPolygon(6, 0.5);
        case 'star7': return this.starPolygon(7, 0.45);
        case 'star8': return this.starPolygon(8, 0.42);
        case 'star10': return this.starPolygon(10, 0.45);
        case 'star12': return this.starPolygon(12, 0.5);
        case 'star16': return this.starPolygon(16, 0.6);
        case 'star24': return this.starPolygon(24, 0.68);
        case 'star32': return this.starPolygon(32, 0.74);
        default:
            return null;
        }
    }

    private static regularPolygon(sides: number, startAngle: number): NormPt[] {
        const pts: NormPt[] = [];
        for (let sideIndex: number = 0; sideIndex < sides; sideIndex++) {
            const angle: number = startAngle + (sideIndex * 2 * Math.PI) / sides;
            pts.push([0.5 + 0.5 * Math.cos(angle), 0.5 + 0.5 * Math.sin(angle)]);
        }
        return pts;
    }

    private static starPolygon(points: number, innerRatio: number): NormPt[] {
        const pts: NormPt[] = [];
        const total: number = points * 2;
        for (let pointIndex: number = 0; pointIndex < total; pointIndex++) {
            const radius: number = pointIndex % 2 === 0 ? 0.5 : 0.5 * innerRatio;
            const angle: number = -Math.PI / 2 + (pointIndex * Math.PI) / points;
            pts.push([0.5 + radius * Math.cos(angle), 0.5 + radius * Math.sin(angle)]);
        }
        return pts;
    }

    private static drawRoundedRectVariant(
        graphics: PdfGraphics,
        key: string,
        rect: Rectangle,
        fillBrush: PdfBrush | null,
        borderPen: PdfPen | null
    ): void {
        const r: number = Math.min(rect.width, rect.height) * 0.16;
        const d: number = r * 2;
        if (d <= 0.5) {
            if (fillBrush) { graphics.drawRectangle(rect, fillBrush); }
            if (borderPen) { graphics.drawRectangle(rect, borderPen); }
            return;
        }
        const tl: boolean = key !== 'round1rect';
        const tr: boolean = key !== 'round2diagrect' && key !== 'sniproundrect';
        const br: boolean = key !== 'round1rect' && key !== 'round2samerect';
        const bl: boolean = key !== 'round1rect' && key !== 'round2samerect' && key !== 'round2diagrect';
        const trSnip: boolean = key === 'sniproundrect';
        const path: PdfPath = new PdfPath();
        const x1: number = rect.x;
        const y1: number = rect.y;
        const x2: number = rect.x + rect.width;
        const y2: number = rect.y + rect.height;
        if (tl) { path.addArc({ x: x1, y: y1, width: d, height: d }, 180, 90); }
        else { path.addLine({ x: x1, y: y1 }, { x: x1 + r, y: y1 }); }
        if (trSnip) {
            path.addLine({ x: x1 + r, y: y1 }, { x: x2 - r, y: y1 });
            path.addLine({ x: x2 - r, y: y1 }, { x: x2, y: y1 + r });
        } else if (tr) {
            path.addArc({ x: x2 - d, y: y1, width: d, height: d }, 270, 90);
        } else {
            path.addLine({ x: x2 - r, y: y1 }, { x: x2, y: y1 });
            path.addLine({ x: x2, y: y1 }, { x: x2, y: y1 + r });
        }
        if (br) { path.addArc({ x: x2 - d, y: y2 - d, width: d, height: d }, 0, 90); }
        else {
            path.addLine({ x: x2, y: y2 - r }, { x: x2, y: y2 });
            path.addLine({ x: x2, y: y2 }, { x: x2 - r, y: y2 });
        }
        if (bl) { path.addArc({ x: x1, y: y2 - d, width: d, height: d }, 90, 90); }
        else {
            path.addLine({ x: x1 + r, y: y2 }, { x: x1, y: y2 });
            path.addLine({ x: x1, y: y2 }, { x: x1, y: y2 - r });
        }
        path.closeFigure();
        this.drawPdfPath(graphics, path, fillBrush, borderPen);
    }

    private static drawHeart(graphics: PdfGraphics, rect: Rectangle, fillBrush: PdfBrush | null, borderPen: PdfPen | null): void {
        const x: (nx: number) => number = (nx: number): number => rect.x + nx * rect.width;
        const y: (ny: number) => number = (ny: number): number => rect.y + ny * rect.height;
        const path: PdfPath = new PdfPath();
        path.addBezier({ x: x(0.5), y: y(0.26) }, { x: x(0.35), y: y(-0.02) }, { x: x(0.0), y: y(0.08) }, { x: x(0.0), y: y(0.36) });
        path.addBezier({ x: x(0.0), y: y(0.36) }, { x: x(0.0), y: y(0.62) }, { x: x(0.28), y: y(0.8) }, { x: x(0.5), y: y(1.0) });
        path.addBezier({ x: x(0.5), y: y(1.0) }, { x: x(0.72), y: y(0.8) }, { x: x(1.0), y: y(0.62) }, { x: x(1.0), y: y(0.36) });
        path.addBezier({ x: x(1.0), y: y(0.36) }, { x: x(1.0), y: y(0.08) }, { x: x(0.65), y: y(-0.02) }, { x: x(0.5), y: y(0.26) });
        path.closeFigure();
        this.drawPdfPath(graphics, path, fillBrush, borderPen);
    }

    private static drawTeardrop(graphics: PdfGraphics, rect: Rectangle, fillBrush: PdfBrush | null, borderPen: PdfPen | null): void {
        const x: (nx: number) => number = (nx: number): number => rect.x + nx * rect.width;
        const y: (ny: number) => number = (ny: number): number => rect.y + ny * rect.height;
        const path: PdfPath = new PdfPath();
        path.addArc(rect, 0, 270);
        path.addLine({ x: x(0.5), y: y(0) }, { x: x(1), y: y(0) });
        path.addLine({ x: x(1), y: y(0) }, { x: x(1), y: y(0.5) });
        path.closeFigure();
        this.drawPdfPath(graphics, path, fillBrush, borderPen);
    }

    private static drawMathDivide(graphics: PdfGraphics, rect: Rectangle, fillBrush: PdfBrush | null, borderPen: PdfPen | null): void {
        this.drawNormalizedPolygon(graphics, rect, [[0.1, 0.42], [0.9, 0.42], [0.9, 0.58], [0.1, 0.58]], fillBrush, borderPen);
        const dotSize: number = Math.min(rect.width, rect.height) * 0.18;
        const dotX: number = rect.x + (rect.width - dotSize) / 2;
        const topDot: Rectangle = { x: dotX, y: rect.y + rect.height * 0.14, width: dotSize, height: dotSize };
        const botDot: Rectangle = { x: dotX, y: rect.y + rect.height * 0.68, width: dotSize, height: dotSize };
        if (fillBrush) { graphics.drawEllipse(topDot, fillBrush); graphics.drawEllipse(botDot, fillBrush); }
        if (borderPen) { graphics.drawEllipse(topDot, borderPen); graphics.drawEllipse(botDot, borderPen); }
    }

    private static drawNormalizedPolygon(
        graphics: PdfGraphics,
        rect: Rectangle,
        normPts: NormPt[],
        fillBrush: PdfBrush | null,
        borderPen: PdfPen | null
    ): void {
        const pts: Point[] = normPts.map(([nx, ny]: NormPt): Point => ({
            x: rect.x + nx * rect.width,
            y: rect.y + ny * rect.height
        }));
        this.drawAbsolutePolygon(graphics, pts, fillBrush, borderPen);
    }

    private static drawAbsolutePolygon(
        graphics: PdfGraphics,
        pts: Point[],
        fillBrush: PdfBrush | null,
        borderPen: PdfPen | null
    ): void {
        if (pts.length < 2) { return; }
        const path: PdfPath = new PdfPath();
        for (let ptIndex: number = 0; ptIndex < pts.length; ptIndex++) {
            const nextIndex: number = (ptIndex + 1) % pts.length;
            const p1: Point = pts[ptIndex as number];
            const p2: Point = pts[nextIndex as number];
            if (p1 && p2) {
                path.addLine(p1, p2);
            }
        }
        path.closeFigure();
        this.drawPdfPath(graphics, path, fillBrush, borderPen);
    }

    private static drawPdfPath(graphics: PdfGraphics, path: PdfPath, fillBrush: PdfBrush | null, borderPen: PdfPen | null): void {
        if (fillBrush && borderPen) {
            graphics.drawPath(path, borderPen, fillBrush);
        } else if (fillBrush) {
            graphics.drawPath(path, fillBrush);
        } else if (borderPen) {
            graphics.drawPath(path, borderPen);
        }
    }

    private static drawShapeText(graphics: PdfGraphics, shape: IShape, rect: Rectangle): void {
        const text: string = shape.richText && shape.richText.length > 0
            ? shape.richText.map((r: IRichTextRun): string => r.text).join('')
            : (shape.text || '');
        if (!text) { return; }

        const hAlign: string = String(shape.textHorizontalAlignment || 'center').toLowerCase();
        const horizontalAlign: PdfTextAlignment = hAlign === 'left'
            ? PdfTextAlignment.left
            : (hAlign === 'right' ? PdfTextAlignment.right : PdfTextAlignment.center);
        const vAlign: string = String(shape.textVerticalAlignment || 'middle').toLowerCase();
        const verticalAlign: PdfVerticalAlignment = vAlign === 'top'
            ? PdfVerticalAlignment.top
            : (vAlign === 'bottom' ? PdfVerticalAlignment.bottom : PdfVerticalAlignment.middle);

        const padX: number = Math.max(4, Math.min(rect.width * 0.1, 10));
        const padY: number = Math.max(3, Math.min(rect.height * 0.1, 8));
        const textRect: Rectangle = {
            x: rect.x + padX,
            y: rect.y + padY,
            width: Math.max(4, rect.width - padX * 2),
            height: Math.max(4, rect.height - padY * 2)
        };

        const resolvedHAlign: ExcelHAlign = horizontalAlign === PdfTextAlignment.left
            ? ExcelHAlign.Left
            : (horizontalAlign === PdfTextAlignment.right ? ExcelHAlign.Right : ExcelHAlign.Center);
        const resolvedVAlign: ExcelVAlign = verticalAlign === PdfVerticalAlignment.top
            ? ExcelVAlign.Top
            : (verticalAlign === PdfVerticalAlignment.bottom ? ExcelVAlign.Bottom : ExcelVAlign.Center);

        const baseStyle: ICellStyle = {
            fontName: shape.fontFamily || 'Helvetica',
            fontSize: shape.fontSizePt || 10,
            bold: Boolean(shape.fontBold),
            italic: Boolean(shape.fontItalic),
            underline: false,
            strikeout: false,
            fontColor: shape.fontColor || { r: 0, g: 0, b: 0, a: 255 },
            fillPattern: ExcelPattern.None,
            fillColor: { r: 255, g: 255, b: 255, a: 0 },
            hAlign: resolvedHAlign,
            vAlign: resolvedVAlign,
            wrapText: true,
            indent: 0,
            rotation: 0,
            shrinkToFit: false,
            borders: {
                top: { lineStyle: ExcelLineStyle.None, color: { r: 0, g: 0, b: 0, a: 0 } },
                bottom: { lineStyle: ExcelLineStyle.None, color: { r: 0, g: 0, b: 0, a: 0 } },
                left: { lineStyle: ExcelLineStyle.None, color: { r: 0, g: 0, b: 0, a: 0 } },
                right: { lineStyle: ExcelLineStyle.None, color: { r: 0, g: 0, b: 0, a: 0 } },
                diagonalDown: { lineStyle: ExcelLineStyle.None, color: { r: 0, g: 0, b: 0, a: 0 } },
                diagonalUp: { lineStyle: ExcelLineStyle.None, color: { r: 0, g: 0, b: 0, a: 0 } }
            },
            numberFormat: ''
        };

        const getFont: (st: ICellStyle) => PdfFont = (st: ICellStyle): PdfFont => {
            let styleFlags: PdfFontStyle = PdfFontStyle.regular;
            if (st.bold && st.italic) { styleFlags = PdfFontStyle.bold | PdfFontStyle.italic; }
            else if (st.bold) { styleFlags = PdfFontStyle.bold; }
            else if (st.italic) { styleFlags = PdfFontStyle.italic; }
            if (st.underline) { styleFlags |= PdfFontStyle.underline; }
            if (st.strikeout) { styleFlags |= PdfFontStyle.strikeout; }
            return new PdfStandardFont(PdfFontFamily.helvetica, Math.max(1, st.fontSize || 10), styleFlags);
        };

        if (shape.richText && shape.richText.length > 0) {
            const runs: IRichTextRun[] = shape.richText.map((r: IRichTextRun): IRichTextRun => {
                const rawRun: Record<string, unknown> = r as unknown as Record<string, unknown>;
                const st: Record<string, string | undefined> = (rawRun['style'] || {}) as Record<string, string | undefined>;
                const parsedSz: number = st.fontSize ? parseFloat(st.fontSize) : NaN;
                const textDec: string = String(st.textDecoration || '').toLowerCase();
                const vAlignStr: string = String(st.verticalAlign || '').toLowerCase();
                return {
                    text: r.text || '',
                    fontName: st.fontFamily,
                    fontSize: !isNaN(parsedSz) && parsedSz > 0 ? parsedSz : undefined,
                    bold: st.fontWeight === 'bold' ? true : (st.fontWeight ? false : undefined),
                    italic: st.fontStyle === 'italic' ? true : (st.fontStyle ? false : undefined),
                    underline: textDec ? (textDec.indexOf('underline') !== -1) : undefined,
                    strikeout: textDec ? (textDec.indexOf('line-through') !== -1 || textDec.indexOf('strike') !== -1) : undefined,
                    fontColor: st.color ? (parseHexColor(st.color) || undefined) : undefined,
                    subscript: vAlignStr === 'subscript' ? true : (vAlignStr ? false : undefined),
                    superscript: vAlignStr === 'superscript' ? true : (vAlignStr ? false : undefined)
                };
            });

            RichTextRenderer.drawRichText(
                runs,
                textRect,
                graphics,
                baseStyle,
                getFont,
                false,
                horizontalAlign,
                verticalAlign,
                true
            );
            return;
        }

        const font: PdfFont = getFont(baseStyle);
        const brush: PdfBrush = new PdfBrush(toPdfColor(baseStyle.fontColor));
        const format: PdfStringFormat = new PdfStringFormat();
        format.alignment = horizontalAlign;
        format.lineAlignment = verticalAlign;
        graphics.drawString(text, font, textRect, brush, format);
    }
}
