import { Smithchart } from '../../smithchart';
import { SmithchartFontModel } from '../../smithchart/utils/utils-model';
import { SmithchartAxisModel, SmithchartAxisLineModel, SmithchartMinorGridLinesModel } from '../../smithchart/axis/axis-model';
import { SmithchartMajorGridLinesModel } from '../../smithchart/axis/axis-model';
import { measureText } from '../../smithchart/utils/helper';
import { SmithchartRect, HorizontalLabelCollection, LabelCollection, LabelRegion, Point, Direction } from '../../smithchart/utils/utils';
import { GridArcPoints, RadialLabelCollections, SmithchartSize } from '../../smithchart/utils/utils';
import { PathOption, TextOption, renderTextElement, _getEpsilonValue } from '../../smithchart/utils/helper';
import { RenderType } from '../../smithchart/utils/enum';
import { ISmithchartAxisLabelRenderEventArgs } from '../../smithchart/model/interface';
import { axisLabelRender } from '../model/constant';


export class AxisRender {
    public areaRadius: number;
    public circleLeftX: number;
    public circleTopY: number;
    public circleCenterX: number;
    public circleCenterY: number;
    public radialLabels: number[] = [-50, -20, -10, -5, -4, -3, -2, -1.5, -1, -0.8, -0.6, -0.4, -0.2,
        0, 0.2, 0.4, 0.6, 0.8, 1, 1.5, 2, 3, 4, 5, 10, 20, 50];
    public radialLabelCollections: LabelCollection[] = [];
    public horizontalLabelCollections: HorizontalLabelCollection[] = [];
    public majorHGridArcPoints: GridArcPoints[];
    public minorHGridArcPoints: GridArcPoints[];
    public majorRGridArcPoints: GridArcPoints[];
    public minorGridArcPoints: GridArcPoints[];
    public labelCollections: RadialLabelCollections[] = [];
    public direction: Direction = new Direction();

    public renderArea(smithchart: Smithchart, bounds: SmithchartRect): void {
        this.calculateChartArea(smithchart, bounds);
        this.calculateCircleMargin(smithchart, bounds);
        this.calculateXAxisRange(smithchart);
        this.calculateRAxisRange(smithchart);
        this.measureHorizontalAxis(smithchart);
        this.measureRadialAxis(smithchart);
        if (smithchart.horizontalAxis.visible) {
            this.updateHAxis(smithchart);
        }
        if (smithchart.radialAxis.visible) {
            this.updateRAxis(smithchart);
        }
        if (smithchart.horizontalAxis.visible) {
            this.drawHAxisLabels(smithchart);
        }
        if (smithchart.radialAxis.visible) {
            this.drawRAxisLabels(smithchart);
        }
    }

    private updateHAxis(smithchart: Smithchart): void {
        const majorGridLines: SmithchartMajorGridLinesModel = smithchart.horizontalAxis.majorGridLines;
        const minorGridLines: SmithchartMinorGridLinesModel = smithchart.horizontalAxis.minorGridLines;
        const axisLine: SmithchartAxisLineModel = smithchart.horizontalAxis.axisLine;

        if (majorGridLines.visible) {
            this.updateHMajorGridLines(smithchart);
        }
        if (minorGridLines.visible) {
            this.updateHMinorGridLines(smithchart);
        }
        if (axisLine.visible) {
            this.updateHAxisLine(smithchart);
        }
    }

    private updateRAxis(smithchart: Smithchart): void {
        const majorGridLines: SmithchartMajorGridLinesModel = smithchart.radialAxis.majorGridLines;
        const minorGridLines: SmithchartMinorGridLinesModel = smithchart.radialAxis.minorGridLines;
        const axisLine: SmithchartAxisLineModel = smithchart.radialAxis.axisLine;
        if (majorGridLines.visible) {
            this.updateRMajorGridLines(smithchart);
        }
        if (minorGridLines.visible) {
            this.updateRMinorGridLines(smithchart);
        }
        if (axisLine.visible) {
            this.updateRAxisLine(smithchart);
        }
    }

    private measureHorizontalAxis(smithchart: Smithchart): void {
        const minorGridLines: SmithchartMinorGridLinesModel = smithchart.horizontalAxis.minorGridLines;
        this.measureHMajorGridLines(smithchart);
        if (minorGridLines.visible) {
            this.measureHMinorGridLines(smithchart);
        }
    }

    private measureRadialAxis(smithchart: Smithchart): void {
        const minorGridLines: SmithchartMinorGridLinesModel = smithchart.radialAxis.minorGridLines;
        this.measureRMajorGridLines(smithchart);
        if (minorGridLines.visible) {
            this.measureRMinorGridLines(smithchart);
        }
    }

    private calculateChartArea(smithchart: Smithchart, bounds: SmithchartRect): void {
        let width: number = smithchart.availableSize.width;
        let height: number = smithchart.availableSize.height;
        width = bounds.width;
        height = bounds.height;
        const chartAreaWidth: number = Math.min(width, height);
        const chartAreaHeight: number = Math.min(width, height);
        const x: number = bounds.x + (bounds.width / 2 - chartAreaWidth / 2);
        const y: number = bounds.y + ((height - chartAreaHeight) / 2 > 0 ? (height - chartAreaHeight) / 2 : 0);
        smithchart.chartArea = { x: x, y: y, width: chartAreaWidth, height: chartAreaHeight };
    }

    private calculateCircleMargin(smithchart: Smithchart, bounds: SmithchartRect): void {
        const padding: number = 10;
        let maxLabelWidth: number = 0;
        const width: number = smithchart.chartArea.width;
        const radius: number = smithchart.radius;
        maxLabelWidth = this.maximumLabelLength(smithchart);
        const labelMargin: number = (smithchart.radialAxis.labelPosition === 'Outside') ? (maxLabelWidth + padding) : padding;
        const diameter: number = width - labelMargin * 2 > 0 ? width - labelMargin * 2 : 0;
        const actualRadius: number = diameter / 2;
        const circleCoefficient: number = radius > 1 ? 1 : (radius < 0.1 ? 0.1 : radius);
        this.areaRadius = actualRadius * circleCoefficient;
        this.circleLeftX = smithchart.chartArea.x + labelMargin + (actualRadius * (1 - circleCoefficient));
        this.circleTopY = smithchart.chartArea.y + labelMargin + (actualRadius * (1 - circleCoefficient));
        this.circleCenterX = this.circleLeftX + this.areaRadius;
        this.circleCenterY = bounds.y + bounds.height / 2;
    }

    private maximumLabelLength(smithchart: Smithchart): number {
        let maximumLabelLength: number = 0;
        const font: SmithchartFontModel = smithchart.horizontalAxis.labelStyle;
        let label: string;
        let textSize: SmithchartSize;

        for (let i: number = 0; i < this.radialLabels.length; i++) {
            label = this.radialLabels[i as number].toString();
            textSize = measureText(label, font, smithchart.themeStyle.axisLabelFont);
            if (maximumLabelLength < textSize.width) {
                maximumLabelLength = textSize.width;
            }
        }
        return maximumLabelLength;
    }

    private calculateAxisLabels(): number[] {
        const spacingBetweenGridLines: number = 30;
        let previousR: number = 0;
        let j: number = 0;
        const labels: number[] = [];
        const diameter: number = this.areaRadius * 2;
        for (let i: number = 0; i < 2; i = i + 0.1) {
            i = Math.round(i * 10) / 10;
            const coeff: number = 1 / (i + 1);
            let isOverlap1: boolean = false;
            let isOverlap2: boolean = false;
            const radius: number = ((diameter * coeff) / 2) * 2;
            if (previousR === 0.0 || i === 1) {
                previousR = radius;
                labels[j as number] = i;
                j++;
                continue;
            }
            if (i < 1) {
                isOverlap1 = this.isOverlap(1, diameter, radius, spacingBetweenGridLines);
            }
            if (i > 1) {
                isOverlap2 = this.isOverlap(2, diameter, radius, spacingBetweenGridLines);
            }
            if (isOverlap1 || isOverlap2) {
                continue;
            }
            if (previousR - radius >= spacingBetweenGridLines) {
                labels[j as number] = i;
                j++;
                previousR = radius;
            }
        }
        const staticlabels: number[] = [2, 3, 4, 5, 10, 20, 50];
        for (let k: number = 0; k < staticlabels.length; k++) {
            labels[j as number] = staticlabels[k as number];
            j++;
        }
        return labels;
    }

    private isOverlap(x: number, d: number, previousR: number, spacingBetweenGridLines: number): boolean {
        const coeff: number = 1 / (x + 1); // (1 / 1+r) find the radius for the x value
        const radius: number = ((d * coeff) / 2) * 2;
        return previousR - radius < spacingBetweenGridLines;
    }

    private calculateXAxisRange(smithchart: Smithchart): void {
        let x: number;
        let coeff: number;
        let radius: number;
        let cx: number;
        const diameter: number = this.areaRadius * 2;
        const horizontalAxisLabels: number[] = this.calculateAxisLabels();
        const cy: number = this.circleCenterY;
        const circleStartX: number = this.circleLeftX;
        let leftX: number = this.circleLeftX;
        for (let i: number = 0; i < horizontalAxisLabels.length; i++) {
            x = horizontalAxisLabels[i as number];
            coeff = 1 / (x + 1);
            radius = (diameter * coeff) / 2;
            if (smithchart.renderType === 'Impedance') {
                leftX = circleStartX + diameter - (radius * 2);
            }
            cx = leftX + radius;
            this.horizontalLabelCollections.push({
                centerX: cx, centerY: cy, radius: radius, value: x, region: null
            });
        }
    }

    private calculateRAxisRange(smithchart: Smithchart): void {
        let arcCy: number;
        let arcRadius: number;
        const diameter: number = this.areaRadius * 2;
        let y: number;
        const point: Point = new Point();
        if (smithchart.renderType === 'Impedance') {
            point.x = this.circleLeftX + diameter;
            point.y = this.circleTopY + this.areaRadius;
        } else {
            point.x = this.circleLeftX;
            point.y = this.circleTopY + this.areaRadius;
        }
        for (let i: number = 0; i < this.radialLabels.length; i++) {
            y = this.radialLabels[i as number];
            arcRadius = Math.abs(((1 / y) * diameter) / 2);
            if (smithchart.renderType === 'Impedance') {
                arcCy = y > 0 ? point.y - arcRadius : point.y + arcRadius;
            } else {
                arcCy = y < 0 ? point.y - arcRadius : point.y + arcRadius;
            }
            this.radialLabelCollections.push({
                centerX: point.x, centerY: arcCy, radius: arcRadius, value: y
            });
        }
    }

    private measureHMajorGridLines(smithchart: Smithchart): void {
        let arcPoints: LabelCollection[][] = [];
        let startPoint: Point;
        let endPoint: Point;
        let radialPoint1: LabelCollection[];
        let radialPoint2: LabelCollection[];
        let size: SmithchartSize;
        this.majorHGridArcPoints = [];
        for (let i: number = 0; i < this.horizontalLabelCollections.length; i++) {
            let circlePoint: HorizontalLabelCollection = new HorizontalLabelCollection();
            circlePoint = this.horizontalLabelCollections[i as number];
            arcPoints = this.calculateHMajorArcStartEndPoints(circlePoint.value);
            if (smithchart.renderType === 'Impedance') {
                radialPoint1 = arcPoints[0];
                radialPoint2 = arcPoints[1];
            } else {
                radialPoint1 = arcPoints[1];
                radialPoint2 = arcPoints[0];
            }
            size = { width: circlePoint.radius, height: circlePoint.radius };
            if (circlePoint.value !== 0.0 && circlePoint.value !== 50.0) {
                startPoint = this.intersectingCirclePoints(
                    radialPoint1[0].centerX, radialPoint1[0].centerY, radialPoint1[0].radius, circlePoint.centerX, circlePoint.centerY,
                    circlePoint.radius, smithchart.renderType);
                endPoint = this.intersectingCirclePoints(
                    radialPoint2[0].centerX, radialPoint2[0].centerY, radialPoint2[0].radius, circlePoint.centerX, circlePoint.centerY,
                    circlePoint.radius, smithchart.renderType);

                this.majorHGridArcPoints.push({
                    startPoint: startPoint,
                    endPoint: endPoint,
                    rotationAngle: 2 * Math.PI,
                    sweepDirection: (smithchart.renderType === 'Impedance') ?
                        this.direction['counterclockwise'] : this.direction['clockwise'],
                    isLargeArc: true,
                    size: size
                });
            } else {
                startPoint = { x: circlePoint.centerX + circlePoint.radius, y: circlePoint.centerY };
                endPoint = { x: circlePoint.centerX + circlePoint.radius, y: circlePoint.centerY - 0.05 };
                this.majorHGridArcPoints.push({
                    startPoint: startPoint,
                    endPoint: endPoint,
                    rotationAngle: 2 * Math.PI,
                    sweepDirection: this.direction['clockwise'],
                    isLargeArc: true,
                    size: size
                });
            }
        }
    }

    private measureRMajorGridLines(smithchart: Smithchart): void {
        let radialPoint: LabelCollection;
        let y: number;
        let arcPoints: Point[] = [];
        let innerInterSectPoint: Point;
        let outerInterSectPoint: Point;
        let outterInterSectRadian: number;
        let outterInterSectAngle: number;
        let startPoint: Point;
        let endPoint: Point;
        let size: SmithchartSize;
        let sweepDirection: number;
        this.majorRGridArcPoints = [];
        this.labelCollections = [];
        const epsilon: number = _getEpsilonValue();
        for (let i: number = 0; i < this.radialLabelCollections.length; i++) {
            radialPoint = this.radialLabelCollections[i as number];

            if (radialPoint.radius <= epsilon) {
                continue;
            }
            y = radialPoint.value;
            arcPoints = this.calculateMajorArcStartEndPoints(radialPoint, Math.abs(y), smithchart);
            innerInterSectPoint = arcPoints[0];
            outerInterSectPoint = arcPoints[1];
            outterInterSectRadian = this.circleXYRadianValue(
                this.circleCenterX, this.circleCenterY, outerInterSectPoint.x, outerInterSectPoint.y);
            outterInterSectAngle = outterInterSectRadian * (180 / Math.PI);
            if (y !== 0.0) {
                startPoint = { x: innerInterSectPoint.x, y: innerInterSectPoint.y };
                endPoint = { x: outerInterSectPoint.x, y: outerInterSectPoint.y };
                size = { width: radialPoint.radius, height: radialPoint.radius };
                sweepDirection = y > 0 ? this.direction['clockwise'] : this.direction['counterclockwise'];
                this.majorRGridArcPoints.push({
                    startPoint: startPoint,
                    endPoint: endPoint,
                    size: size,
                    rotationAngle: 2 * Math.PI,
                    isLargeArc: false,
                    sweepDirection: sweepDirection
                });
                this.labelCollections.push({
                    centerX: outerInterSectPoint.x,
                    centerY: outerInterSectPoint.y,
                    angle: outterInterSectAngle,
                    value: y,
                    radius: this.areaRadius,
                    region: null
                });
            } else {
                startPoint = { x: this.circleLeftX, y: this.circleCenterY };
                endPoint = { x: this.circleCenterX + this.areaRadius, y: this.circleCenterY };
                this.majorRGridArcPoints.push({
                    startPoint: startPoint,
                    endPoint: endPoint,
                    size: null,
                    rotationAngle: null,
                    isLargeArc: null,
                    sweepDirection: null
                });
                this.labelCollections.push({
                    centerX: (smithchart.renderType === 'Impedance') ?
                        (this.circleCenterX - this.areaRadius) : (this.circleCenterX + this.areaRadius),
                    centerY: this.circleCenterY,
                    angle: (smithchart.renderType === 'Impedance') ?
                        180 : 360,
                    value: y,
                    radius: this.areaRadius,
                    region: null
                });
            }
        }
    }

    private circleXYRadianValue(centerX: number, centerY: number, outterX: number, outterY: number): number {
        let radian: number;
        radian = Math.atan2(outterY - centerY, outterX - centerX);
        radian = radian < 0 ? (radian + (360 * Math.PI / 180)) : radian;
        return radian;
    }

    private calculateMajorArcStartEndPoints(radialPoint: LabelCollection, value: number, smithchart: Smithchart): Point[] {
        const arcPoints: Point[] = [];
        let circlePoint: HorizontalLabelCollection[] = [];
        const cx: number = this.circleCenterX;
        const cy: number = this.circleCenterY;
        if (value >= 10) {
            arcPoints[0] = (smithchart.renderType === 'Impedance') ?
                { x: cx + this.areaRadius, y: cy } : { x: cx - this.areaRadius, y: cy };
        } else if (value >= 3) {
            circlePoint = this.horizontalLabelCollections.filter((c: HorizontalLabelCollection) => c.value === 10);
        } else if (value >= 1) {
            circlePoint = this.horizontalLabelCollections.filter((c: HorizontalLabelCollection) => c.value === 5);
        } else {
            circlePoint = this.horizontalLabelCollections.filter((c: HorizontalLabelCollection) => c.value === 3);
        }
        if (circlePoint.length > 0) {
            arcPoints[0] = this.intersectingCirclePoints(
                radialPoint.centerX, radialPoint.centerY, radialPoint.radius, circlePoint[0].centerX, circlePoint[0].centerY,
                circlePoint[0].radius, smithchart.renderType);
        }
        arcPoints[1] = this.intersectingCirclePoints(
            radialPoint.centerX, radialPoint.centerY, radialPoint.radius, cx, cy, this.areaRadius,
            smithchart.renderType);
        return arcPoints;
    }


    private calculateHMajorArcStartEndPoints(value: number): LabelCollection[][] {
        const arcHPoints: LabelCollection[][] = [];
        let calValue1: number;
        let calValue2: number;
        if (value <= 0.3) {
            calValue1 = 2.0;
            calValue2 = -2.0;
        } else if (value <= 1.0) {
            calValue1 = 3.0;
            calValue2 = -3.0;
        } else if (value <= 2.0) {
            calValue1 = 5.0;
            calValue2 = -5.0;
        } else if (value <= 5.0) {
            calValue1 = 10.0;
            calValue2 = -10.0;
        } else {
            calValue1 = 50.0;
            calValue2 = -50.0;
        }
        arcHPoints[0] = this.radialLabelCollections.filter((c: LabelCollection) => c.value === calValue1);
        arcHPoints[1] = this.radialLabelCollections.filter((c: LabelCollection) => c.value === calValue2);
        return arcHPoints;
    }
    private calculateMinorArcStartEndPoints(value: number): LabelCollection[][] {
        let calValue1: number;
        let calValue2: number;
        const marcHPoints: LabelCollection[][] = [];
        if (value <= 0.1) {
            calValue1 = 1.0;
            calValue2 = -1.0;
        } else if (value <= 0.2) {
            calValue1 = 0.8;
            calValue2 = -0.8;
        } else if (value <= 0.3) {
            calValue1 = 0.4;
            calValue2 = -0.4;
        } else if (value <= 0.6) {
            calValue1 = 1.0;
            calValue2 = -1.0;
        } else if (value <= 1.0) {
            calValue1 = 1.5;
            calValue2 = -1.5;
        } else if (value <= 1.5) {
            calValue1 = 2.0;
            calValue2 = -2.0;
        } else if (value <= 2.0) {
            calValue1 = 1.0;
            calValue2 = -1.0;
        } else if (value <= 5.0) {
            calValue1 = 3.0;
            calValue2 = -3.0;
        } else {
            calValue1 = 10.0;
            calValue2 = -10.0;
        }
        marcHPoints[0] = this.radialLabelCollections.filter((c: LabelCollection) => c['value'] === calValue1);
        marcHPoints[1] = this.radialLabelCollections.filter((c: LabelCollection) => c['value'] === calValue2);
        return marcHPoints;
    }

    public intersectingCirclePoints(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number, renderType: RenderType): Point {
        const point: Point = { x: 0, y: 0 };
        const cx: number = x1 - x2;
        const cy: number = y1 - y2;
        const midRadius: number = Math.sqrt(cx * cx + cy * cy);
        const radiusSquare: number = midRadius * midRadius;
        const a: number = (r1 * r1 - r2 * r2) / (2 * radiusSquare);
        const radiusSquare2: number = (r1 * r1 - r2 * r2);
        const c: number = Math.sqrt(
            2 * (r1 * r1 + r2 * r2) / radiusSquare - (radiusSquare2 * radiusSquare2) / (radiusSquare * radiusSquare) - 1
        );
        const fx: number = (x1 + x2) / 2 + a * (x2 - x1);
        const gx: number = c * (y2 - y1) / 2;
        const ix1: number = fx + gx;
        const ix2: number = fx - gx;
        const fy: number = (y1 + y2) / 2 + a * (y2 - y1);
        const gy: number = c * (x1 - x2) / 2;
        const iy1: number = fy + gy;
        const iy2: number = fy - gy;
        if (renderType === 'Impedance') {
            if (ix2 < ix1) {
                point.x = ix2;
                point.y = iy2;
            } else {
                point.x = ix1;
                point.y = iy1;
            }
        } else {
            if (ix1 > ix2) {
                point.x = ix1;
                point.y = iy1;
            } else {
                point.x = ix2;
                point.y = iy2;
            }
        }
        return { x: point.x, y: point.y };
    }
    private updateHMajorGridLines(smithchart: Smithchart): void {
        const majorGridLine: SmithchartMajorGridLinesModel = smithchart.horizontalAxis.majorGridLines;
        const groupElement: Element = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + '_horizontalAxisMajorGridLines' });
        groupElement.setAttribute('aria-hidden', 'true');
        const path: string = this.calculateGridLinesPath(this.majorHGridArcPoints);
        const haxismgoptions: PathOption = new PathOption(
            smithchart.element.id + '_horizontalAxisMajorGridLines',
            'none',
            majorGridLine['width'],
            majorGridLine.color ? majorGridLine.color : smithchart.themeStyle.majorGridLine,
            majorGridLine['opacity'],
            majorGridLine['dashArray'],
            path
        );
        const element: Element = smithchart.renderer.drawPath(haxismgoptions);
        groupElement.appendChild(element);
        smithchart.svgObject.appendChild(groupElement);
    }

    private updateRMajorGridLines(smithchart: Smithchart): void {
        const majorGridLine: SmithchartMajorGridLinesModel = smithchart.radialAxis.majorGridLines;
        const groupElement: Element = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + '_radialAxisMajorGridLines' });
        groupElement.setAttribute('aria-hidden', 'true');
        const path: string = this.calculateGridLinesPath(this.majorRGridArcPoints);
        const raxismgoptions: PathOption = new PathOption(
            smithchart.element.id + '_radialAxisMajorGridLines',
            'none',
            majorGridLine['width'],
            majorGridLine.color ? majorGridLine.color : smithchart.themeStyle.majorGridLine,
            majorGridLine['opacity'],
            majorGridLine['dashArray'],
            path
        );
        const element: Element = smithchart.renderer.drawPath(raxismgoptions);
        groupElement.appendChild(element);
        smithchart.svgObject.appendChild(groupElement);
    }

    private updateHAxisLine(smithchart: Smithchart): void {
        const radius: number = this.areaRadius;
        const axisLine: SmithchartAxisLineModel = smithchart.horizontalAxis.axisLine;
        const groupElement: Element = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + '_hAxisLine' });
        groupElement.setAttribute('aria-hidden', 'true');
        const point1: Point = { x: this.circleCenterX + radius, y: this.circleCenterY };
        const point2: Point = { x: this.circleCenterX + radius, y: (this.circleCenterY - 0.05) };
        const size: SmithchartSize = { width: radius, height: radius };
        const sweep: number = this.direction['clockwise'];
        const isLargeArc: number = 1;
        const angle: number = Math.PI * 2;
        const direction: string = 'M' + '' + point1.x + ' ' + point1.y + ' ' + 'A' + ' ' + size.width +
            ' ' + size.height + ' ' + angle + ' ' + isLargeArc + ' ' + sweep + ' ' + point2.x + ' ' + point2.y + '';
        const options: PathOption = new PathOption(
            smithchart.element.id + '_horizontalAxisLine',
            'none',
            axisLine.width,
            axisLine.color ? axisLine.color : smithchart.themeStyle.axisLine,
            1,
            axisLine.dashArray,
            direction
        );
        const element: Element = smithchart.renderer.drawPath(options);
        groupElement.appendChild(element);
        smithchart.svgObject.appendChild(groupElement);
    }

    private updateRAxisLine(smithchart: Smithchart): void {
        const radius: number = this.areaRadius;
        const axisLine: SmithchartAxisLineModel = smithchart.radialAxis.axisLine;
        const point1: Point = { x: this.circleCenterX - radius, y: this.circleCenterY };
        const point2: Point = { x: this.circleCenterX + radius, y: this.circleCenterY };
        const size: SmithchartSize = { width: 0, height: 0 };
        const sweep: number = this.direction['counterclockwise'];
        const isLargeArc: number = 0;
        const angle: number = 0;
        const direction: string = 'M' + ' ' + point1.x + ' ' + point1.y + ' ' + 'A' + ' ' +
            size.width + ' ' + size.height + ' ' + angle + ' ' + isLargeArc + ' ' + sweep + ' ' +
            point2.x + ' ' + point2.y + '';
        const options: PathOption = new PathOption(
            smithchart.element.id + '_radialAxisLine',
            'none',
            axisLine.width,
            axisLine.color ? axisLine.color : smithchart.themeStyle.axisLine,
            1,
            axisLine.dashArray,
            direction
        );
        const groupElement: Element = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + '_rAxisLine' });
        groupElement.setAttribute('aria-hidden', 'true');
        const element: Element = smithchart.renderer.drawPath(options);
        groupElement.appendChild(element);
        smithchart.svgObject.appendChild(groupElement);
    }

    private drawHAxisLabels(smithchart: Smithchart): void {
        const hAxis: SmithchartAxisModel = smithchart.horizontalAxis;
        smithchart.radialAxis.labelStyle.fontFamily = smithchart.themeStyle.fontFamily || smithchart.radialAxis.labelStyle.fontFamily;
        const font: SmithchartFontModel = smithchart.horizontalAxis.labelStyle;
        let circleAxis: HorizontalLabelCollection;
        let label: string;
        let x: number;
        let y: number;
        let textSize: SmithchartSize;
        let curLabel: HorizontalLabelCollection;
        let curLabelBounds: SmithchartRect;
        let curWidth: number;
        let curX: number;
        let preLabel: HorizontalLabelCollection;
        let preLabelBounds: SmithchartRect;
        let preWidth: number;
        let preX: number;
        const groupEle: Element = smithchart.renderer.createGroup({ id: smithchart.element.id + '_HAxisLabels' });
        groupEle.setAttribute('aria-hidden', 'true');
        for (let i: number = 0; i < this.horizontalLabelCollections.length; i++) {
            circleAxis = this.horizontalLabelCollections[i as number];
            label = this.horizontalLabelCollections[i as number].value.toString();
            if (circleAxis.value !== 0.0) {
                x = (smithchart.renderType === 'Impedance') ?
                    circleAxis.centerX - circleAxis.radius : circleAxis.centerX + circleAxis.radius;
                y = circleAxis.centerY;
                textSize = measureText(label, font, smithchart.themeStyle.axisLabelFont);
                x = (smithchart.renderType === 'Impedance') ? x - textSize.width : x;
                if (hAxis.labelPosition === 'Outside') {
                    y -= textSize.height / 4;
                } else {
                    y += textSize.height;
                }
                this.horizontalLabelCollections[i as number].region = this.calculateRegion(label, textSize, x, y);
                if (hAxis.labelIntersectAction === 'Hide') {
                    curLabel = this.horizontalLabelCollections[i as number];
                    curLabelBounds = curLabel.region.bounds;
                    curWidth = curLabelBounds.width;
                    curX = curLabelBounds.x;
                    for (let j: number = 1; j < i; j++) {
                        preLabel = this.horizontalLabelCollections[j as number];
                        preLabelBounds = preLabel.region.bounds;
                        preWidth = preLabelBounds.width;
                        preX = preLabelBounds.x;
                        if ((smithchart.renderType === 'Impedance') &&
                            (preX + preWidth) > (curX)) {
                            label = '';
                        }
                        if ((smithchart.renderType === 'Admittance') &&
                            (preX) < curX + curWidth) {
                            label = '';
                        }
                    }
                }
                const axisLabelRenderEventArgs: ISmithchartAxisLabelRenderEventArgs = {
                    text: label.toString(),
                    x: x,
                    y: y,
                    name: axisLabelRender,
                    cancel: false
                };
                const axisLabelRenderSuccess: Function = (args: ISmithchartAxisLabelRenderEventArgs) => {
                    if (!args.cancel) {
                        const options: TextOption = new TextOption(
                            smithchart.element.id + '_HLabel_' + i, axisLabelRenderEventArgs.x,
                            axisLabelRenderEventArgs.y, 'none', axisLabelRenderEventArgs.text
                        );
                        const color: string = font.color ? font.color : smithchart.themeStyle.axisLabelFont.color;
                        font.fontFamily = font.fontFamily || smithchart.themeStyle.labelFontFamily;
                        const element: Element = renderTextElement(options, font, color, groupEle, smithchart.themeStyle.axisLabelFont);
                        groupEle.appendChild(element);
                    }
                };
                axisLabelRenderSuccess.bind(this);
                smithchart.trigger(axisLabelRender, axisLabelRenderEventArgs, axisLabelRenderSuccess);
            }
        }
        smithchart.svgObject.appendChild(groupEle);
    }

    private drawRAxisLabels(smithchart: Smithchart): void {
        const paddingRadius: number = 2;
        smithchart.radialAxis.labelStyle.fontFamily = smithchart.themeStyle.fontFamily || smithchart.radialAxis.labelStyle.fontFamily;
        const font: SmithchartFontModel = smithchart.radialAxis.labelStyle;
        let interSectPoint: RadialLabelCollections = new RadialLabelCollections();
        let label: string;
        let textSize: SmithchartSize;
        let angle: number;
        let position: Point;
        let textPosition: Point;
        let curX: number;
        let curY: number;
        let curWidth: number;
        let curHeight: number;
        let curLabel: RadialLabelCollections;
        let curLabelBounds: SmithchartRect;
        let preX: number;
        let preY: number;
        let preWidth: number;
        let preHeight: number;
        let preLabel: RadialLabelCollections;
        let preLabelBounds: SmithchartRect;
        const rAxis: SmithchartAxisModel = smithchart.radialAxis;
        const groupEle: Element = smithchart.renderer.createGroup({ id: smithchart.element.id + '_RAxisLabels' });
        groupEle.setAttribute('aria-hidden', 'true');
        for (let i: number = 0; i < this.labelCollections.length; i++) {
            interSectPoint = this.labelCollections[i as number];
            label = interSectPoint.value.toString();
            textSize = measureText(label, font, smithchart.themeStyle.axisLabelFont);
            angle = Math.round(interSectPoint.angle * 100) / 100;
            if (rAxis.labelPosition === 'Outside') {
                position = this.circlePointPosition(
                    this.circleCenterX, this.circleCenterY, interSectPoint['angle'],
                    this.areaRadius + paddingRadius);
                textPosition = this.setLabelsOutsidePosition(angle, position.x, position.y, textSize);
            } else {
                position = this.circlePointPosition(
                    this.circleCenterX, this.circleCenterY, interSectPoint['angle'],
                    this.areaRadius - paddingRadius);
                textPosition = this.setLabelsInsidePosition(angle, position.x, position.y, textSize);
            }
            this.labelCollections[i as number]['region'] = this.calculateRegion(label, textSize, textPosition.x, textPosition.y);
            if (rAxis.labelIntersectAction === 'Hide') {
                curLabel = this.labelCollections[i as number];
                curLabelBounds = curLabel['region']['bounds'];
                curWidth = curLabelBounds['width'];
                curHeight = curLabelBounds['height'];
                curX = curLabelBounds['x'];
                curY = curLabelBounds['y'];
                for (let j: number = 0; j < i; j++) {
                    preLabel = this.labelCollections[j as number];
                    preLabelBounds = preLabel['region']['bounds'];
                    preWidth = preLabelBounds['width'];
                    preHeight = preLabelBounds['height'];
                    preX = preLabelBounds['x'];
                    preY = preLabelBounds['y'];
                    if ((preX <= curX + curWidth) && (curX <= preX + preWidth) && (preY <= curY + curHeight)
                        && (curY <= preY + preHeight)) {
                        label = ' ';
                    }
                }
            }
            const axisLabelRenderEventArgs: ISmithchartAxisLabelRenderEventArgs = {
                text: label.toString(),
                x: textPosition.x,
                y: textPosition.y,
                name: axisLabelRender,
                cancel: false
            };
            const axisLabelRenderSuccess: Function = (args: ISmithchartAxisLabelRenderEventArgs) => {
                if (!args.cancel) {
                    const options: TextOption = new TextOption(
                        smithchart.element.id + '_RLabel_' + i, axisLabelRenderEventArgs.x, axisLabelRenderEventArgs.y,
                        'none', axisLabelRenderEventArgs.text
                    );
                    const color: string = font.color ? font.color : smithchart.themeStyle.axisLabelFont.color;
                    font.fontFamily = smithchart.themeStyle.labelFontFamily ? smithchart.themeStyle.labelFontFamily : font.fontFamily;
                    const element: Element = renderTextElement(options, font, color, groupEle, smithchart.themeStyle.axisLabelFont);
                    groupEle.appendChild(element);
                }
            };
            axisLabelRenderSuccess.bind(this);
            smithchart.trigger(axisLabelRender, axisLabelRenderEventArgs, axisLabelRenderSuccess);
        }
        smithchart.svgObject.appendChild(groupEle);
    }

    private calculateRegion(label: string, textSize: SmithchartSize, textPositionX: number, textPositionY: number): LabelRegion {
        let xAxisLabelRegions: LabelRegion = new LabelRegion();
        const bounds: SmithchartRect = { x: textPositionX, y: textPositionY, width: textSize.width, height: textSize.height };
        xAxisLabelRegions = { bounds: bounds, labelText: label };
        return xAxisLabelRegions;
    }

    private updateHMinorGridLines(smithchart: Smithchart): void {
        const minorGridLine: SmithchartMinorGridLinesModel = smithchart.horizontalAxis.minorGridLines;
        const groupElement: Element = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + '_horizontalAxisMinorGridLines' });
        const path: string = this.calculateGridLinesPath(this.minorHGridArcPoints);
        const haxismioptions: PathOption = new PathOption(
            smithchart.element.id + '_horizontalAxisMinorGridLines',
            'none',
            minorGridLine['width'],
            minorGridLine.color ? minorGridLine.color : smithchart.themeStyle.minorGridLine,
            minorGridLine['opacity'],
            minorGridLine['dashArray'],
            path
        );
        const element: Element = smithchart.renderer.drawPath(haxismioptions);
        groupElement.appendChild(element);
        smithchart.svgObject.appendChild(groupElement);

    }

    private updateRMinorGridLines(smithchart: Smithchart): void {
        const minorGridLine: SmithchartMinorGridLinesModel = smithchart.radialAxis.minorGridLines;
        const groupElement: Element = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + '_radialAxisMinorGridLines' });
        const path: string = this.calculateGridLinesPath(this.minorGridArcPoints);
        const raxismioptions: PathOption = new PathOption(
            smithchart.element.id + '_radialAxisMinorGridLines',
            'none',
            minorGridLine['width'],
            minorGridLine.color ? minorGridLine.color : smithchart.themeStyle.minorGridLine,
            minorGridLine['opacity'],
            minorGridLine['dashArray'],
            path
        );
        const element: Element = smithchart.renderer.drawPath(raxismioptions);
        groupElement.appendChild(element);
        smithchart.svgObject.appendChild(groupElement);
    }

    private calculateGridLinesPath(points: GridArcPoints[]): string {
        let x1: number;
        let y1: number;
        let x2: number;
        let y2: number;
        let r1: number;
        let r2: number;
        let pathSegment: GridArcPoints = new GridArcPoints();
        let angle: number;
        let isLargeArc: number;
        let sweep: number;
        let sb: string = '';
        for (let i: number = 0; i < points.length; i++) {
            pathSegment = points[i as number];
            x1 = pathSegment.startPoint.x;
            y1 = pathSegment.startPoint.y;
            x2 = pathSegment.endPoint.x;
            y2 = pathSegment.endPoint.y;
            r1 = pathSegment.size ? pathSegment.size.width : 0;
            r2 = pathSegment.size ? pathSegment.size.height : 0;
            angle = pathSegment.rotationAngle ? pathSegment.rotationAngle : 0;
            isLargeArc = pathSegment.isLargeArc ? 1 : 0;
            sweep = pathSegment.sweepDirection ? pathSegment.sweepDirection : 0;
            sb = sb + ('M' + ' ' + x1 + ' ' + y1 + ' ' + 'A' + ' ' + r1 + ' ' + r2 + ' ' +
                angle + ' ' + isLargeArc + ' ' + sweep + ' ' + x2 + ' ' + y2 + ' ');
        }
        const path: string = sb.toString();
        return path;
    }

    private measureHMinorGridLines(smithchart: Smithchart): void {
        let radialPoint1: LabelCollection[];
        let radialPoint2: LabelCollection[];
        let arcPoints: LabelCollection[][] = [];
        let isLargeArc: boolean;
        let startPoint: Point;
        let endPoint: Point;
        let size: SmithchartSize;
        let cx: number;
        const maxCount: number = smithchart.horizontalAxis.minorGridLines.count;
        let previous: HorizontalLabelCollection;
        let next: HorizontalLabelCollection;
        let space: number;
        let count: number;
        let interval: number;
        let radius: number;
        let leftX: number;
        this.minorHGridArcPoints = [];
        const diameter: number = this.areaRadius * 2;
        for (let i: number = 0; i < this.horizontalLabelCollections.length - 3; i++) {
            previous = this.horizontalLabelCollections[i as number];
            next = this.horizontalLabelCollections[i + 1];
            space = (previous['radius'] - next['radius']) * 2;
            count = Math.floor((maxCount / 100) * space);
            interval = space / count;
            for (let j: number = 0; j < count; j++) {
                radius = next['radius'] + (j * interval) / 2;
                leftX = (smithchart.renderType === 'Impedance') ?
                    (this.circleLeftX + diameter) - (radius * 2) : this.circleLeftX;
                cx = leftX + radius;
                isLargeArc = next['value'] > 5;
                arcPoints = this.calculateMinorArcStartEndPoints(next['value']);
                if (smithchart.renderType === 'Impedance') {
                    radialPoint1 = arcPoints[0];
                    radialPoint2 = arcPoints[1];
                } else {
                    radialPoint1 = arcPoints[1];
                    radialPoint2 = arcPoints[0];
                }
                startPoint = this.intersectingCirclePoints(
                    radialPoint1[0].centerX, radialPoint1[0].centerY, radialPoint1[0].radius,
                    cx, previous['centerY'], radius, smithchart.renderType);
                endPoint = this.intersectingCirclePoints(
                    radialPoint2[0].centerX, radialPoint2[0].centerY, radialPoint2[0].radius,
                    cx, previous['centerY'], radius, smithchart.renderType);
                size = { width: radius, height: radius };
                this.minorHGridArcPoints.push({
                    startPoint: startPoint,
                    endPoint: endPoint,
                    rotationAngle: 2 * Math.PI,
                    sweepDirection: (smithchart.renderType === 'Impedance') ?
                        this.direction['counterclockwise'] : this.direction['clockwise'],
                    isLargeArc: isLargeArc,
                    size: size
                });
            }
        }

    }
    private measureRMinorGridLines(smithchart: Smithchart): void {
        const maxCount: number = smithchart.radialAxis.minorGridLines.count;
        let arcCx: number;
        let nextAngle: number;
        // let k: number = 0;
        let betweenAngle: number;
        let circlePoint: LabelCollection[];
        let previous: RadialLabelCollections;
        let next: RadialLabelCollections;
        let size: SmithchartSize;
        let distance: number;
        let count: number;
        let interval: number;
        let centerValue: number;
        const circumference: number = Math.PI * (this.areaRadius * 2);
        const arcStartX: number = arcCx = (smithchart.renderType === 'Impedance') ?
            this.circleCenterX + this.areaRadius : this.circleCenterX - this.areaRadius;
        const arcStartY: number = this.circleCenterY;
        this.minorGridArcPoints = [];
        const arcStartPoint: Point = { x: arcStartX, y: arcStartY };
        for (let i: number = 2; i < this.labelCollections.length - 3; i++) {
            previous = this.labelCollections[i as number];
            next = this.labelCollections[i + 1];
            if (smithchart.renderType === 'Impedance') {
                nextAngle = next['angle'] === 360 ? 0 : next['angle'];
                betweenAngle = Math.abs(nextAngle - previous['angle']);
            } else {
                nextAngle = previous['angle'] === 360 ? 0 : previous['angle'];
                betweenAngle = Math.abs(nextAngle - next['angle']);
            }
            distance = (circumference / 360) * betweenAngle;
            count = Math.floor((maxCount / 100) * distance);
            interval = betweenAngle / count;
            centerValue = next['value'] > 0 ? next['value'] : previous['value'];
            circlePoint = this.minorGridLineArcIntersectCircle(Math.abs(centerValue));
            for (let j: number = 1; j < count; j++) {
                const outterInterSectAngle: number = (interval * j) + (previous['angle'] === 360 ? nextAngle : previous['angle']);
                const outerInterSectPoint: Point = this.circlePointPosition(
                    this.circleCenterX, this.circleCenterY, outterInterSectAngle, this.areaRadius);
                const radius: number = this.arcRadius(arcStartPoint, outerInterSectPoint, outterInterSectAngle);
                const arcCy: number = outterInterSectAngle > 180 ? this.circleCenterY - radius : this.circleCenterY + radius;
                const innerInterSectPoint: Point = this.intersectingCirclePoints(
                    arcCx, arcCy, radius, circlePoint[0].centerX, circlePoint[0].centerY, circlePoint[0].radius,
                    smithchart.renderType);
                const startPoint: Point = { x: innerInterSectPoint.x, y: innerInterSectPoint.y };
                const endPoint: Point = { x: outerInterSectPoint.x, y: outerInterSectPoint.y };
                size = { width: radius, height: radius };
                const sweepDirection: number = previous['value'] >= 0 ? this.direction['clockwise'] : this.direction['counterclockwise'];
                this.minorGridArcPoints.push({
                    startPoint: startPoint,
                    endPoint: endPoint,
                    rotationAngle: 2 * Math.PI,
                    sweepDirection: sweepDirection,
                    isLargeArc: false,
                    size: size
                });
                // k++;
            }
        }
    }

    private minorGridLineArcIntersectCircle(centerValue: number): LabelCollection[] {
        let calValue: number;
        if (centerValue >= 3) {
            calValue = 20;
        } else if (centerValue >= 1.5) {
            calValue = 10;
        } else if (centerValue >= 0.6) {
            calValue = 3;
        } else {
            calValue = 2;
        }
        const circlePoint: LabelCollection[] = this.horizontalLabelCollections.filter((c: LabelCollection) => c['value'] === calValue);
        return circlePoint;
    }

    private circlePointPosition(cx: number, cy: number, angle: number, r: number): Point {
        const radian: number = angle * (Math.PI / 180);
        const pointX: number = cx + r * Math.cos(radian);
        const pointY: number = cy + r * Math.sin(radian);
        return { x: pointX, y: pointY };
    }

    private setLabelsInsidePosition(angle: number, px: number, py: number, textSize: SmithchartSize): Point {
        let x: number = px;
        let y: number = py;
        if (angle === 0 || angle === 360) {
            x -= textSize.width;
            y -= textSize.height / 2;
        } else if (angle === 90) {
            x -= textSize.width;
            y += textSize.height / 8;
        } else if (angle === 180) {
            y += textSize.height;
        } else if (angle === 270) {
            y += textSize.height / 2;
        } else if (angle > 0 && angle <= 20) {
            x -= (textSize.width);
        } else if (angle > 20 && angle <= 60) {
            x -= (textSize.width + textSize.width / 2);
            y += textSize.height / 2;
        } else if (angle > 60 && angle < 90) {
            x -= (textSize.width + textSize.width / 4);
            y += textSize.height / 4;
        } else if (angle > 90 && angle <= 135) {
            x -= (textSize.width / 2);
            y += (textSize.height) / 16;
        } else if (angle > 135 && angle <= 150) {
            x += (textSize.width / 2);
            y += (textSize.height / 2);
        } else if (angle > 150 && angle < 180) {
            x += (textSize.width / 2);
            y += (textSize.height);
        } else if (angle > 180 && angle <= 210) {
            x += (textSize.width / 6);
            y += (textSize.height / 6);
        } else if (angle > 210 && angle < 240) {
            y += (textSize.height / 4);
        } else if (angle > 225 && angle < 270) {
            y += (textSize.height / 3);
        } else if (angle > 270 && angle <= 300) {
            x -= (textSize.width + textSize.width / 4);
            y += (textSize.height / 4);
        } else if (angle > 300 && angle <= 330) {
            x -= (textSize.width + textSize.width / 3);
            y += (textSize.height / 4);
        } else if (angle > 330 && angle <= 340) {
            x -= (textSize.width + textSize.width / 2);
            y += textSize.height / 4;
        } else if (angle > 340) {
            x -= textSize.width;
            y += textSize.height / 8;
        }
        return { x: x, y: y };
    }

    private setLabelsOutsidePosition(angle: number, px: number, py: number, textSize: SmithchartSize): Point {
        let x: number = px;
        let y: number = py;
        if (angle === 90) {
            x -= textSize.width / 2;
            y += textSize.height;
        } else if (angle === 180) {
            x -= (textSize.width + 5);
            y -= textSize.height / 4;
        } else if (angle === 270) {
            x -= textSize.width / 2;
            y -= textSize.height / 4;
        } else if (angle === 360) {
            x += 5;
            y -= textSize.height / 2;
        } else if (angle > 0 && angle <= 30) {
            x += textSize.width / 4;
            y += textSize.height / 8;
        } else if (angle > 30 && angle <= 60) {
            x += textSize.width / 2;
            y += textSize.height / 4;
        } else if (angle > 60 && angle <= 90) {
            x -= textSize.width / 2;
            y += textSize.height;
        } else if (angle > 90 && angle <= 135) {
            x -= textSize.width;
            y += textSize.height;
        } else if (angle > 135 && angle <= 180) {
            x -= (textSize.width + textSize.width / 4);
            y += textSize.height / 4;
        } else if (angle > 180 && angle <= 210) {
            x -= textSize.width + textSize.width / 4;
            y -= textSize.height / 4;
        } else if (angle > 210 && angle <= 270) {
            x -= textSize.width;
            y -= textSize.height / 4;
        } else if (angle > 270 && angle <= 340) {
            y -= textSize.height / 4;
        } else if (angle > 340) {
            y += textSize.height / 4;
            x += textSize.width / 6;
        }
        return { x: x, y: y };
    }

    private arcRadius(startPoint: Point, endPoint: Point, angle: number): number {
        const radian: number = angle > 180 ? (90 * Math.PI / 180) : (270 * Math.PI / 180); // Angle 90 and 270 used for calculating upper and lower circle
        const mx: number = (endPoint.x - startPoint.x) / 2;
        const my: number = (endPoint.y - startPoint.y) / 2;
        const u: number = (Math.cos(radian) * my - Math.sin(radian) * mx) / (Math.cos(radian) * mx + Math.sin(radian) * my);
        const t: number = (my - mx * u) / Math.sin(radian);
        const cy: number = startPoint.y + Math.sin(radian) * t;
        const radius: number = Math.abs(startPoint.y - cy);
        return radius;
    }
}
