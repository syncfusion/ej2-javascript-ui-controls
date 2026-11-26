import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfColor, PdfGraphics, PdfGraphicsState, PdfPage, PdfPen, RectangleF } from '@syncfusion/ej2-pdf-export';
import { IGanttData, TimelineDetails } from '../base/interface';
import { Gantt } from '../base/gantt';
import { pixelToPoint, pointToPixel } from '../base/utils';
import { ProgressLine } from '../actions/progress-line';

export interface IPdfProgressLineSegment {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export interface IPdfProgressLineBounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export interface IPdfProgressLineRow {
    globalTop: number;
    rowHeight: number;
    taskbarCenter: number;
    progressX: number;
}

export interface IPdfProgressLinePage {
    page: PdfPage;
    left: number;
    top: number;
    right: number;
    bottom: number;
    globalTop: number;
}

/**
 * Draws the progress line over the PDF taskbars, clipped to each chart page.
 */
export class PdfProgressLine {
    private parent: Gantt;

    constructor(parent: Gantt) {
        this.parent = parent;
    }

    public drawProgressLine(records: IGanttData[], statusX: number, rows: IPdfProgressLineRow[], pages: IPdfProgressLinePage[],
                            detail: TimelineDetails, isAutoFit: boolean): void {
        if (isNullOrUndefined(statusX) || !records || !rows || !pages || pages.length === 0) {
            return;
        }
        const segments: IPdfProgressLineSegment[] = PdfProgressLine.getSegments(records, statusX, rows);
        const color: string = isNullOrUndefined(this.parent.progressLine.lineColor) ? '#ff0000' : this.parent.progressLine.lineColor;
        const lineWidth: number = this.parent.progressLine.lineWidth > 0 ?
            pixelToPoint(this.parent.progressLine.lineWidth) : pixelToPoint(2);
        const pen: PdfPen = new PdfPen(PdfProgressLine.getPdfColor(color), lineWidth);
        for (let pageIndex: number = 0; pageIndex < pages.length; pageIndex++) {
            const page: IPdfProgressLinePage = pages[pageIndex as number];
            const bounds: IPdfProgressLineBounds = {
                left: page.left,
                top: page.top,
                right: page.right,
                bottom: page.bottom
            };
            const yOffset: number = page.top - page.globalTop;
            const graphics: PdfGraphics = page.page.graphics;
            const state: PdfGraphicsState = graphics.save();
            try {
                graphics.setClip(new RectangleF(page.left, page.top, page.right - page.left, page.bottom - page.top));
                for (let segmentIndex: number = 0; segmentIndex < segments.length; segmentIndex++) {
                    const segment: IPdfProgressLineSegment = segments[segmentIndex as number];
                    const pageSegment: IPdfProgressLineSegment = {
                        x1: PdfProgressLine.getPageX(segment.x1, detail.startPoint, page.left, isAutoFit),
                        y1: segment.y1 + yOffset,
                        x2: PdfProgressLine.getPageX(segment.x2, detail.startPoint, page.left, isAutoFit),
                        y2: segment.y2 + yOffset
                    };
                    const clipped: IPdfProgressLineSegment = PdfProgressLine.clipSegment(pageSegment, bounds);
                    if (clipped) {
                        graphics.drawLine(pen, clipped.x1, clipped.y1, clipped.x2, clipped.y2);
                    }
                }
            } finally {
                graphics.restore(state);
            }
        }
    }

    public static getSegments(records: IGanttData[], statusX: number, rows: IPdfProgressLineRow[]): IPdfProgressLineSegment[] {
        const segments: IPdfProgressLineSegment[] = [];
        let previousX: number = statusX;
        let previousY: number = rows.length > 0 ? rows[0].globalTop : 0;
        for (let index: number = 0; index < records.length && index < rows.length; index++) {
            const row: IPdfProgressLineRow = rows[index as number];
            const record: IGanttData = records[index as number];
            const rowBottom: number = row.globalTop + row.rowHeight;
            if (!ProgressLine.isSkipped(record)) {
                segments.push({
                    x1: previousX,
                    y1: previousY,
                    x2: row.progressX,
                    y2: row.taskbarCenter
                });
                previousX = row.progressX;
                previousY = row.taskbarCenter;
            }
            segments.push({
                x1: previousX,
                y1: previousY,
                x2: statusX,
                y2: rowBottom
            });
            previousX = statusX;
            previousY = rowBottom;
        }
        return segments;
    }

    public static getPageX(x: number, timelineStartPoint: number, pageLeft: number, isAutoFit: boolean): number {
        return pageLeft + (isAutoFit ? x - pointToPixel(timelineStartPoint) : pixelToPoint(x) - timelineStartPoint);
    }

    public static getPdfColor(color: string): PdfColor {
        const probe: HTMLSpanElement = document.createElement('span');
        probe.style.color = color;
        if (!probe.style.color) {
            throw new Error('Invalid progress line color: ' + color);
        }
        const context: CanvasRenderingContext2D = document.createElement('canvas').getContext('2d');
        if (!context) {
            throw new Error('Unable to create a canvas context to convert the progress line color.');
        }
        context.fillStyle = probe.style.color;
        context.fillRect(0, 0, 1, 1);
        const channels: Uint8ClampedArray = context.getImageData(0, 0, 1, 1).data;
        return new PdfColor(channels[3], channels[0], channels[1], channels[2]);
    }

    /**
     * Clips progress-line segments to a PDF chart viewport.
     *
     * @param {IPdfProgressLineSegment} segment .
     * @param {IPdfProgressLineBounds} bounds .
     * @returns {IPdfProgressLineSegment} .
     */
    public static clipSegment(segment: IPdfProgressLineSegment, bounds: IPdfProgressLineBounds): IPdfProgressLineSegment {
        const deltaX: number = segment.x2 - segment.x1;
        const deltaY: number = segment.y2 - segment.y1;
        const p: number[] = [-deltaX, deltaX, -deltaY, deltaY];
        const q: number[] = [
            segment.x1 - bounds.left,
            bounds.right - segment.x1,
            segment.y1 - bounds.top,
            bounds.bottom - segment.y1
        ];
        let startRatio: number = 0;
        let endRatio: number = 1;

        for (let i: number = 0; i < p.length; i++) {
            if (p[i as number] === 0) {
                if (q[i as number] < 0) {
                    return null;
                }
            } else {
                const ratio: number = q[i as number] / p[i as number];
                if (p[i as number] < 0) {
                    startRatio = Math.max(startRatio, ratio);
                } else {
                    endRatio = Math.min(endRatio, ratio);
                }
                if (startRatio > endRatio) {
                    return null;
                }
            }
        }

        return {
            x1: segment.x1 + startRatio * deltaX,
            y1: segment.y1 + startRatio * deltaY,
            x2: segment.x1 + endRatio * deltaX,
            y2: segment.y1 + endRatio * deltaY
        };
    }
}
