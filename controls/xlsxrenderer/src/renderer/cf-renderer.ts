import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfGraphics, PdfBrush, PdfPen, PdfDashStyle, Rectangle, PdfBitmap } from '@syncfusion/ej2-pdf';
import { CfDataBar, Rgba } from '../common/index';
import { parseHexColor, toPdfColor } from '../common/index';
import { cfIconImages, cfSetMap } from '../common/index';

interface RGB { r: number; g: number; b: number; }
interface Point2D { x: number; y: number; }

const RED: RGB = { r: 198, g: 76, b: 54 };
const YELLOW: RGB = { r: 217, g: 170, b: 100 };
const GREEN: RGB = { r: 104, g: 159, b: 135 };
const GRAY: RGB = { r: 150, g: 150, b: 150 };
const BLACK: RGB = { r: 50, g: 50, b: 50 };
const WHITE: RGB = { r: 255, g: 255, b: 255 };
const BLUE: RGB = { r: 68, g: 114, b: 196 };

/**
 * Handles rendering of conditional formatting data bars, gradient fills, and icon sets.
 */
export class CfRenderer {
    static gradientStrongAtBase: boolean = true;
    static nativePolygon: ((graphics: PdfGraphics, points: Point2D[], color: RGB) => void) | null = null;

    private static fillPolygon(graphics: PdfGraphics, points: Point2D[], color: RGB, clipX?: number): void {
        if (this.nativePolygon && isNullOrUndefined(clipX)) {
            this.nativePolygon(graphics, points, color);
            return;
        }
        let minY: number = Infinity;
        let maxY: number = -Infinity;
        points.forEach((pt: Point2D) => {
            if (pt.y < minY) { minY = pt.y; }
            if (pt.y > maxY) { maxY = pt.y; }
        });
        const scanStep: number = Math.max(0.35, (maxY - minY) / 28);
        const brush: PdfBrush = new PdfBrush({ r: color.r, g: color.g, b: color.b });
        for (let scanY: number = minY; scanY < maxY - 1e-6; scanY += scanStep) {
            const sampleY: number = Math.min(scanY + scanStep / 2, maxY - 1e-6);
            const intersections: number[] = [];
            for (let pointIndex: number = 0; pointIndex < points.length; pointIndex++) {
                const startPt: Point2D = points[pointIndex as number];
                const nextPtIdx: number = (pointIndex + 1) % points.length;
                const endPt: Point2D = points[nextPtIdx as number];
                if ((startPt.y <= sampleY && endPt.y > sampleY) || (endPt.y <= sampleY && startPt.y > sampleY)) {
                    intersections.push(startPt.x + (sampleY - startPt.y) / (endPt.y - startPt.y) * (endPt.x - startPt.x));
                }
            }
            intersections.sort((firstX: number, secondX: number) => firstX - secondX);
            for (let pairIndex: number = 0; pairIndex + 1 < intersections.length; pairIndex += 2) {
                const leftX: number = intersections[pairIndex as number];
                let rightX: number = intersections[(pairIndex + 1) as number];
                if (!isNullOrUndefined(clipX)) { rightX = Math.min(rightX, clipX); }
                if (rightX > leftX) {
                    graphics.drawRectangle(
                        { x: leftX, y: scanY, width: rightX - leftX, height: Math.min(scanStep + 0.15, maxY - scanY + 0.15) },
                        brush
                    );
                }
            }
        }
    }

    private static outlinePolygon(
        graphics: PdfGraphics,
        points: Point2D[],
        color: RGB,
        strokeWidth: number,
        closePath: boolean = true
    ): void {
        const pen: PdfPen = new PdfPen({ r: color.r, g: color.g, b: color.b }, strokeWidth);
        const edgeCount: number = closePath ? points.length : points.length - 1;
        for (let pointIndex: number = 0; pointIndex < edgeCount; pointIndex++) {
            const startPt: Point2D = points[pointIndex as number];
            const nextIdx: number = (pointIndex + 1) % points.length;
            const endPt: Point2D = points[nextIdx as number];
            graphics.drawLine(pen, { x: startPt.x, y: startPt.y }, { x: endPt.x, y: endPt.y });
        }
    }

    private static buildCirclePoints(
        centerX: number,
        centerY: number,
        radius: number,
        segments: number = 28,
        startAngle: number = 0,
        endAngle: number = 360
    ): Point2D[] {
        const result: Point2D[] = [];
        for (let stepIndex: number = 0; stepIndex <= segments; stepIndex++) {
            const radians: number = (startAngle + (endAngle - startAngle) * stepIndex / segments) * Math.PI / 180;
            result.push({ x: centerX + radius * Math.cos(radians), y: centerY + radius * Math.sin(radians) });
        }
        return result;
    }

    private static rotatePoints(points: Point2D[], centerX: number, centerY: number, degrees: number): Point2D[] {
        const radians: number = degrees * Math.PI / 180;
        const cosAngle: number = Math.cos(radians);
        const sinAngle: number = Math.sin(radians);
        return points.map((pt: Point2D) => ({
            x: centerX + (pt.x - centerX) * cosAngle - (pt.y - centerY) * sinAngle,
            y: centerY + (pt.x - centerX) * sinAngle + (pt.y - centerY) * cosAngle
        }));
    }

    private static drawDisc(
        graphics: PdfGraphics,
        centerX: number,
        centerY: number,
        radius: number,
        fillColor: RGB,
        lineColor?: RGB
    ): void {
        const points: Point2D[] = this.buildCirclePoints(centerX, centerY, radius);
        this.fillPolygon(graphics, points, fillColor);
        if (lineColor) {
            this.outlinePolygon(graphics, points, lineColor, 0.5);
        }
    }

    static drawDataBar(graphics: PdfGraphics, rect: Rectangle, dataBar: CfDataBar, blackAndWhite: boolean): void {
        if (dataBar.lenFrac <= 0 || rect.width <= 4 || rect.height <= 5) {
            return;
        }
        const innerX: number = rect.x + 2;
        const innerWidth: number = rect.width - 4;
        const barTop: number = rect.y + 2.5;
        const barHeight: number = rect.height - 5;
        let startFraction: number = dataBar.startFrac;
        const lengthFraction: number = dataBar.lenFrac;
        if (dataBar.rtl) { startFraction = 1 - dataBar.startFrac - dataBar.lenFrac; }
        const barX: number = innerX + startFraction * innerWidth;
        const barWidth: number = Math.max(1, lengthFraction * innerWidth);
        const fillColor: Rgba = parseHexColor(dataBar.color);
        graphics.drawRectangle({ x: barX, y: barTop, width: barWidth, height: barHeight }, new PdfBrush(toPdfColor(fillColor)));
        if (dataBar.border) {
            const borderColor: Rgba = parseHexColor(dataBar.border);
            graphics.drawRectangle(
                { x: barX, y: barTop, width: barWidth, height: barHeight },
                new PdfPen(toPdfColor(borderColor), 0.5)
            );
        }
        if (!isNullOrUndefined(dataBar.axisFrac) && !blackAndWhite) {
            const axisX: number = innerX + (dataBar.rtl ? 1 - dataBar.axisFrac : dataBar.axisFrac) * innerWidth;
            const axisColor: Rgba = parseHexColor(dataBar.axisColor || '#000000');
            const pen: PdfPen = new PdfPen(toPdfColor(axisColor), 0.75);
            pen.dashStyle = PdfDashStyle.dash;
            graphics.drawLine(pen, { x: axisX, y: rect.y }, { x: axisX, y: rect.y + rect.height });
        }
    }

    static drawIcon(graphics: PdfGraphics, set: string, index: number, iconX: number, iconY: number, iconSize: number): void {
        const iconList: string[] | undefined = cfSetMap[set as string];
        if (iconList && index >= 0 && index < iconList.length && !set.startsWith('vector_')) {
            const iconName: string = iconList[index as number];
            const base64Data: string | undefined = cfIconImages[iconName as string];
            if (base64Data) {
                const cleanBase64: string = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
                const bitmap: PdfBitmap = new PdfBitmap(cleanBase64);
                graphics.drawImage(bitmap, { x: iconX, y: iconY, width: iconSize, height: iconSize });
                return;
            }
        }
        const effectiveSet: string = set.startsWith('vector_') ? set.substring(7) : set;
        const centerX: number = iconX + iconSize / 2;
        const centerY: number = iconY + iconSize / 2;
        const radius: number = iconSize / 2 - 0.5;
        const pointAt: (unitX: number, unitY: number) => Point2D = (unitX: number, unitY: number): Point2D =>
            ({ x: iconX + unitX * iconSize, y: iconY + unitY * iconSize });
        const drawArrow: (degrees: number, color: RGB) => void = (degrees: number, color: RGB): void => {
            const basePoints: Point2D[] = [
                pointAt(0.5, 0.02),
                pointAt(0.96, 0.58),
                pointAt(0.64, 0.46),
                pointAt(0.64, 0.98),
                pointAt(0.36, 0.98),
                pointAt(0.36, 0.46),
                pointAt(0.04, 0.58)
            ];
            const rotatedPoints: Point2D[] = this.rotatePoints(basePoints, centerX, centerY, degrees);
            this.fillPolygon(graphics, rotatedPoints, color);
            const strokeColor: RGB = {
                r: Math.max(0, color.r - 30),
                g: Math.max(0, color.g - 30),
                b: Math.max(0, color.b - 30)
            };
            this.outlinePolygon(graphics, rotatedPoints, strokeColor, 0.5);
        };
        const drawLights: (colors: RGB[], darkBackground: boolean) => void = (colors: RGB[], darkBackground: boolean): void => {
            const lightColor: RGB = colors[index as number] || colors[0 as number];
            if (darkBackground) {
                const rimPen: PdfPen = new PdfPen({ r: 30, g: 30, b: 30 }, 0.5);
                const rimBrush: PdfBrush = new PdfBrush({ r: 60, g: 60, b: 60 });
                graphics.drawRectangle({ x: iconX, y: iconY, width: iconSize, height: iconSize }, rimBrush);
                graphics.drawRectangle({ x: iconX, y: iconY, width: iconSize, height: iconSize }, rimPen);
                this.drawDisc(graphics, centerX, centerY, radius * 0.72, lightColor);
            } else {
                this.drawDisc(graphics, centerX, centerY, radius, lightColor, { r: 90, g: 90, b: 90 });
            }
        };
        switch (effectiveSet) {
        case '3Arrows': {
            const degs: number[] = [180, 90, 0];
            const cols: RGB[] = [RED, YELLOW, GREEN];
            const safeIdx: number = Math.max(0, Math.min(index, cols.length - 1));
            drawArrow(degs[safeIdx as number], cols[safeIdx as number]);
            break;
        }
        case '3ArrowsGray': {
            const degs: number[] = [180, 90, 0];
            const safeIdx: number = Math.max(0, Math.min(index, degs.length - 1));
            drawArrow(degs[safeIdx as number], GRAY);
            break;
        }
        case '4Arrows': {
            const degs: number[] = [180, 135, 45, 0];
            const cols: RGB[] = [RED, YELLOW, YELLOW, GREEN];
            const safeIdx: number = Math.max(0, Math.min(index, cols.length - 1));
            drawArrow(degs[safeIdx as number], cols[safeIdx as number]);
            break;
        }
        case '4ArrowsGray': {
            const degs: number[] = [180, 135, 45, 0];
            const safeIdx: number = Math.max(0, Math.min(index, degs.length - 1));
            drawArrow(degs[safeIdx as number], GRAY);
            break;
        }
        case '5Arrows': {
            const degs: number[] = [180, 135, 90, 45, 0];
            const cols: RGB[] = [RED, YELLOW, YELLOW, YELLOW, GREEN];
            const safeIdx: number = Math.max(0, Math.min(index, cols.length - 1));
            drawArrow(degs[safeIdx as number], cols[safeIdx as number]);
            break;
        }
        case '5ArrowsGray': {
            const degs: number[] = [180, 135, 90, 45, 0];
            const safeIdx: number = Math.max(0, Math.min(index, degs.length - 1));
            drawArrow(degs[safeIdx as number], GRAY);
            break;
        }
        case '3Flags': {
            const colors: RGB[] = [RED, YELLOW, GREEN];
            const flagColor: RGB = colors[index as number] || colors[0 as number];
            const staffPen: PdfPen = new PdfPen(GRAY, Math.max(1, iconSize * 0.14));
            graphics.drawLine(staffPen, pointAt(0.18, 0.08), pointAt(0.18, 0.94));
            this.fillPolygon(graphics, [pointAt(0.24, 0.10), pointAt(0.92, 0.32), pointAt(0.24, 0.54)], flagColor);
            break;
        }
        case '3TrafficLights1': drawLights([RED, YELLOW, GREEN], false); break;
        case '3TrafficLights2': drawLights([RED, YELLOW, GREEN], true); break;
        case '4TrafficLights': drawLights([BLACK, RED, YELLOW, GREEN], false); break;
        case '4RedToBlack': drawLights([BLACK, GRAY, { r: 198, g: 140, b: 130 }, RED], false); break;
        case '3Signs':
            if (index === 0) {
                this.fillPolygon(graphics, [pointAt(0.5, 0.02), pointAt(0.98, 0.5), pointAt(0.5, 0.98), pointAt(0.02, 0.5)], RED);
            } else if (index === 1) {
                this.fillPolygon(graphics, [pointAt(0.5, 0.03), pointAt(0.98, 0.95), pointAt(0.02, 0.95)], YELLOW);
            } else {
                this.drawDisc(graphics, centerX, centerY, radius, GREEN);
            }
            break;
        case '3Symbols':
        case '3Symbols2': {
            const symCols: RGB[] = [RED, YELLOW, GREEN];
            const safeIdx: number = Math.max(0, Math.min(index, symCols.length - 1));
            const symbolColor: RGB = symCols[safeIdx as number];
            const withCircle: boolean = effectiveSet === '3Symbols';
            if (withCircle) { this.drawDisc(graphics, centerX, centerY, radius, symbolColor); }
            const glyphColor: RGB = withCircle ? WHITE : symbolColor;
            const pen: PdfPen = new PdfPen({ r: glyphColor.r, g: glyphColor.g, b: glyphColor.b }, Math.max(1, iconSize * 0.16));
            if (index === 2) {
                graphics.drawLine(pen, pointAt(0.25, 0.52), pointAt(0.43, 0.72));
                graphics.drawLine(pen, pointAt(0.43, 0.72), pointAt(0.76, 0.28));
            } else if (index === 1) {
                graphics.drawLine(pen, pointAt(0.5, 0.22), pointAt(0.5, 0.58));
                graphics.drawRectangle(
                    { x: centerX - iconSize * 0.08, y: iconY + iconSize * 0.7, width: iconSize * 0.16, height: iconSize * 0.14 },
                    new PdfBrush({ r: glyphColor.r, g: glyphColor.g, b: glyphColor.b })
                );
            } else {
                graphics.drawLine(pen, pointAt(0.28, 0.28), pointAt(0.72, 0.72));
                graphics.drawLine(pen, pointAt(0.72, 0.28), pointAt(0.28, 0.72));
            }
            break;
        }
        case '3Triangles':
            if (index === 0) {
                this.fillPolygon(graphics, [pointAt(0.02, 0.1), pointAt(0.98, 0.1), pointAt(0.5, 0.92)], RED);
            } else if (index === 1) {
                graphics.drawRectangle(
                    { x: iconX + iconSize * 0.05, y: iconY + iconSize * 0.4, width: iconSize * 0.9, height: iconSize * 0.2 },
                    new PdfBrush({ r: YELLOW.r, g: YELLOW.g, b: YELLOW.b })
                );
            } else {
                this.fillPolygon(graphics, [pointAt(0.5, 0.08), pointAt(0.98, 0.9), pointAt(0.02, 0.9)], GREEN);
            }
            break;
        case '3Stars': {
            const starPoints: Point2D[] = [];
            for (let vertexIndex: number = 0; vertexIndex < 10; vertexIndex++) {
                const radians: number = (-90 + vertexIndex * 36) * Math.PI / 180;
                const vertexRadius: number = vertexIndex % 2 === 0 ? radius : radius * 0.42;
                const vertY: number = centerY + vertexRadius * Math.sin(radians) + iconSize * 0.04;
                starPoints.push({ x: centerX + vertexRadius * Math.cos(radians), y: vertY });
            }
            this.fillPolygon(graphics, starPoints, { r: 235, g: 235, b: 235 });
            if (index === 2) {
                this.fillPolygon(graphics, starPoints, { r: 255, g: 192, b: 0 });
            } else if (index === 1) {
                this.fillPolygon(graphics, starPoints, { r: 255, g: 192, b: 0 }, centerX);
            }
            this.outlinePolygon(graphics, starPoints, { r: 190, g: 150, b: 0 }, 0.4);
            break;
        }
        case '4Rating':
        case '5Rating': {
            const filledCount: number = set === '4Rating' ? index + 1 : index;
            for (let barIndex: number = 0; barIndex < 4; barIndex++) {
                const barWidth: number = iconSize / 4 - 0.8;
                const barHeight: number = iconSize * (0.3 + 0.7 * (barIndex + 1) / 4);
                graphics.drawRectangle(
                    { x: iconX + barIndex * (iconSize / 4), y: iconY + iconSize - barHeight, width: barWidth, height: barHeight },
                    new PdfBrush(barIndex < filledCount ? { r: BLUE.r, g: BLUE.g, b: BLUE.b } : { r: 200, g: 200, b: 200 })
                );
            }
            break;
        }
        case '5Quarters': {
            this.drawDisc(graphics, centerX, centerY, radius, WHITE, BLACK);
            if (index >= 4) {
                this.drawDisc(graphics, centerX, centerY, radius, BLACK);
            } else if (index > 0) {
                const circlePts: Point2D[] = this.buildCirclePoints(centerX, centerY, radius, 8 * index, -90, -90 + 90 * index);
                this.fillPolygon(
                    graphics,
                    [{ x: centerX, y: centerY }].concat(circlePts),
                    BLACK
                );
            }
            break;
        }
        case '5Boxes': {
            const boxWidth: number = iconSize / 2 - 0.5;
            const fillBrush: PdfBrush = new PdfBrush({ r: 68, g: 114, b: 196 });
            const emptyBrush: PdfBrush = new PdfBrush({ r: 166, g: 166, b: 166 });
            const gridPen: PdfPen = new PdfPen({ r: 120, g: 120, b: 120 }, 0.5);
            const boxOrder: Array<{ col: number; row: number }> = [
                { col: 0, row: 1 },
                { col: 1, row: 1 },
                { col: 0, row: 0 },
                { col: 1, row: 0 }
            ];
            for (let boxIndex: number = 0; boxIndex < 4; boxIndex++) {
                const pos: { col: number; row: number } = boxOrder[boxIndex as number];
                const boxX: number = iconX + pos.col * (iconSize / 2);
                const boxY: number = iconY + pos.row * (iconSize / 2);
                const boxRect: Rectangle = { x: boxX, y: boxY, width: boxWidth, height: boxWidth };
                graphics.drawRectangle(boxRect, boxIndex < index ? fillBrush : emptyBrush);
                graphics.drawRectangle(boxRect, gridPen);
            }
            break;
        }
        default: break;
        }
    }

    static iconSize(cellHeight: number, fontPt: number): number {
        return Math.max(6, Math.min(cellHeight - 2, fontPt * 0.9));
    }
}
