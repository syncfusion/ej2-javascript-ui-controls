import { PointF, PdfPage, PdfGraphics, PdfPen, PdfColor, PdfSolidBrush, PdfPath, RectangleF } from '@syncfusion/ej2-pdf-export';
import { Gantt } from '../base/gantt';
import { TimelineDetails } from '../base/interface';
import { pixelToPoint } from '../base/utils';
import { ISCurveChartPoint, ISCurvePoint } from '../renderer/scurve';

/**
 * Draws the S-Curve paths and markers in the exported PDF (tooltips are not exported).
 */
export class PdfSCurve {
    public parent: Gantt;
    private readonly offset: number = 10;
    private readonly radius: number = 4;

    constructor(parent: Gantt) {
        this.parent = parent;
    }

    private parseColor(color: string): PdfColor {
        const probe: HTMLElement = document.createElement('span');
        probe.style.color = color;
        document.body.appendChild(probe);
        const computed: string = getComputedStyle(probe).color;
        document.body.removeChild(probe);
        const parts: RegExpMatchArray = computed.match(/\d+/g);
        return parts && parts.length >= 3 ?
            new PdfColor(parseInt(parts[0], 10), parseInt(parts[1], 10), parseInt(parts[2], 10)) : new PdfColor(0, 0, 0);
    }

    /**
     * Builds a circle from Bezier segments because PdfPath.addEllipse renders
     * stretched markers with the current PDF export library.
     *
     * @param {PointF} center - The marker center in PDF coordinates.
     * @returns {PdfPath} A closed path for the S-Curve marker.
     */
    private createMarkerPath(center: PointF): PdfPath {
        // Store the circle's four curved sections in a PDF path.
        const path: PdfPath = new PdfPath();
        // Bezier control handles approximate a quarter-circle without flattening its curve.
        const controlOffset: number = this.radius * 0.5522847498;
        // Calculate the marker's four bounds around its center.
        const left: number = center.x - this.radius;
        const right: number = center.x + this.radius;
        const top: number = center.y - this.radius;
        const bottom: number = center.y + this.radius;

        // Trace the circle clockwise: right to bottom, left, top, then back to right.
        path.addBezier(right, center.y, right, center.y + controlOffset,
                       center.x + controlOffset, bottom, center.x, bottom);
        path.addBezier(center.x, bottom, center.x - controlOffset, bottom,
                       left, center.y + controlOffset, left, center.y);
        path.addBezier(left, center.y, left, center.y - controlOffset,
                       center.x - controlOffset, top, center.x, top);
        path.addBezier(center.x, top, center.x + controlOffset, top,
                       right, center.y - controlOffset, right, center.y);
        path.closeFigure();
        return path;
    }

    /**
     * Draws every dataset on one page for the timeline range of the given detail.
     *
     * @param {PdfPage} page - target page.
     * @param {PointF} startPoint - chart start point.
     * @param {number} cumulativeWidth - width of the previous timeline segments.
     * @param {TimelineDetails} detail - timeline segment details.
     * @param {number} top - top of the chart body on the page.
     * @param {number} height - chart body height on the page.
     * @param {number} width - chart body width on the page.
     * @returns {void}
     */
    public drawSCurve(page: PdfPage, startPoint: PointF, cumulativeWidth: number, detail: TimelineDetails,
                      top: number, height: number, width: number): void {
        if (!this.parent.sCurveModule) {
            return;
        }
        const datasets: { points: ISCurveChartPoint[]; color: string }[] = this.parent.sCurveModule.getExportData();
        if (datasets.length === 0 || height <= this.offset * 2) {
            return;
        }
        const graphics: PdfGraphics = page.graphics;
        const isAutoFit: boolean = this.parent.pdfExportModule.gantt.taskbar.isAutoFit();
        const plot: number = height - this.offset * 2;
        graphics.save();
        graphics.setClip(new RectangleF(startPoint.x, top, width, height));
        for (let i: number = 0; i < datasets.length; i++) {
            const color: PdfColor = this.parseColor(datasets[i as number].color);
            const pen: PdfPen = new PdfPen(color, 1);
            const brush: PdfSolidBrush = new PdfSolidBrush(color);
            const coordinates: PointF[] = datasets[i as number].points.map((point: ISCurveChartPoint): PointF => {
                const left: number = point.x;
                const x: number = startPoint.x + (isAutoFit ? (left - cumulativeWidth) : pixelToPoint(left - cumulativeWidth));
                const y: number = top + (height - this.offset) - (point.percentage / 100) * plot;
                return new PointF(x, y);
            });
            for (let j: number = 1; j < coordinates.length; j++) {
                graphics.drawLine(pen, coordinates[j - 1], coordinates[j as number]);
            }
            for (let j: number = 0; j < coordinates.length; j++) {
                const path: PdfPath = this.createMarkerPath(coordinates[j as number]);
                graphics.drawPath(pen, brush, path);
            }
        }
        graphics.restore();
    }
}
