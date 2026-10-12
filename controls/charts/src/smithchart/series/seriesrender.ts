import { Smithchart } from '../../smithchart';
import { Marker } from './marker';
import { SmithchartFontModel } from '../../smithchart/utils/utils-model';
import { SeriesMarkerDataLabelBorderModel } from '../../smithchart/series/series-model';
import { SmithchartSeriesModel, SeriesMarkerDataLabelModel } from './series-model';
import { TextOption, renderTextElement } from '../../smithchart/utils/helper';
import { SmithchartRect, Point, LineSegment, PointRegion, DataLabelTextOptions } from '../../smithchart/utils/utils';
import { _getEpsilonValue, PathOption, RectOption, getAnimationFunction, templateAnimate } from '../../smithchart/utils/helper';
import { AxisRender } from '../../smithchart/axis/axisrender';
import { ISmithchartAnimationCompleteEventArgs, ISmithchartSeriesRenderEventArgs } from '../../smithchart/model/interface';
import { animationComplete } from '../../smithchart/model/constant';
import { DataLabel } from '../../smithchart/series/datalabel';
import { ISmithchartTextRenderEventArgs } from '../../smithchart/model/interface';
import { Animation, AnimationOptions, animationMode } from '@syncfusion/ej2-base';
import { textRender, seriesRender } from '../model/constant';

export class SeriesRender {

    public xValues: number[] = [];
    public yValues: number[] = [];
    public pointsRegion: PointRegion[][] = [];
    public lineSegments: LineSegment[] = [];
    public location: Point[][] = [];
    public clipRectElement: Element;
    private dataLabel: DataLabel = new DataLabel();

    private processData(series: SmithchartSeriesModel): void {
        const dataArray: object[] = <object[]>series.dataSource;
        const resistance: string = series.resistance;
        const reactance: string = series.reactance;
        const tooltip: string = series.tooltipMappingName;
        series.points = [];
        for (let i: number = 0; i < dataArray.length; i++) {
            series.points.push({
                resistance: dataArray[i as number][resistance as string],
                reactance: dataArray[i as number][reactance as string],
                tooltip: dataArray[i as number][tooltip as string]
            });
        }
    }
    public draw(smithchart: Smithchart, axisRender: AxisRender, bounds: SmithchartRect): void {
        const groupElement: Element = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + '_seriesCollections' });
        let resistantCx: number;
        let reactanceCy: number;
        const series: SmithchartSeriesModel[] = smithchart.series;
        const seriesLength: number = series.length;
        const chartAreaRadius: number = axisRender.areaRadius;
        let interSectPoint: Point;
        let index: number;
        for (let m: number = 0; m < seriesLength; m++) {
            const seriesIndex: number = m;
            if (series[m as number].dataSource && series[m as number].resistance && series[m as number].reactance) {
                this.processData(series[m as number]);
            }
            this.pointsRegion[m as number] = [];
            this.location[m as number] = [];
            for (let j: number = 0; j < series[m as number].points.length; j++) {
                this.xValues[j as number] = series[m as number].points[j as number]['resistance'];
                this.yValues[j as number] = series[m as number].points[j as number]['reactance'];
            }
            const chartAreaCx: number = axisRender.circleCenterX;
            const chartAreaCy: number = axisRender.circleCenterY;
            const diameter: number = axisRender.areaRadius * 2;
            const reactanceStartPoint: Point = {
                x: chartAreaCx + ((smithchart.renderType === 'Impedance') ?
                    chartAreaRadius : -chartAreaRadius), y: chartAreaCy
            };
            const resistantCy: number = chartAreaCy;
            const reactanceCx: number = reactanceStartPoint.x;
            for (let k: number = 0; k < series[m as number].points.length; k++) {
                const resistance: number = this.xValues[k as number];
                const resistantR: number = (diameter * (1 / (resistance + 1))) / 2;
                const reactance: number = this.yValues[k as number];
                const reactanceR: number = Math.abs(((1 / reactance) * diameter) / 2);
                if (smithchart.renderType === 'Impedance') {
                    reactanceCy = reactance > 0 ? chartAreaCy - reactanceR : chartAreaCy + reactanceR;
                    resistantCx = (axisRender.circleLeftX + diameter - resistantR);
                } else {
                    reactanceCy = reactance < 0 ? chartAreaCy - reactanceR : chartAreaCy + reactanceR;
                    resistantCx = (axisRender.circleLeftX + resistantR);
                }
                interSectPoint = axisRender.intersectingCirclePoints(
                    reactanceCx, reactanceCy, reactanceR, resistantCx, resistantCy, resistantR, smithchart.renderType);
                const epsilon: number = _getEpsilonValue();
                if (Math.abs(reactance) < epsilon) {
                    interSectPoint.x = (smithchart.renderType === 'Impedance') ?
                        resistantCx - resistantR : resistantCx + resistantR;
                    interSectPoint.y = chartAreaCy;
                }
                this.pointsRegion[m as number][k as number] = new PointRegion();
                this.pointsRegion[m as number][k as number] = { point: interSectPoint, x: resistance, y: reactance };
                this.location[m as number][k as number] = { x: interSectPoint.x, y: interSectPoint.y };
            }
            for (let i: number = 0; i < series[m as number].points.length - 1; i++) {
                index = i + 1;
                this.lineSegments[i as number] = new LineSegment();
                this.lineSegments[i as number] = { x1: this.xValues[i as number], y1: this.yValues[i as number],
                    x2: this.xValues[index as number], y2: this.yValues[index as number] };
            }
            smithchart.svgObject.appendChild(groupElement);
            this.drawSeries(smithchart, seriesIndex, groupElement, bounds);
        }
        for (let j: number = 0; j < smithchart.series.length; j++) {
            if (smithchart.series[j as number].enableSmartLabels && smithchart.series[j as number].marker.dataLabel.visible) {
                const gdlcEle: Element = smithchart.renderer.createGroup({
                    'id': smithchart.element.id + '_svg'
                        + '_series' + j + '_Datalabel' + '_connectorLines'
                });
                const element: Element = document.getElementById(smithchart.element.id + '_svg' + '_seriesCollection' + j);
                if (element) {
                    element.setAttribute('aria-label', ('Smithchart with ' + series[j as number].points.length + ' points'));
                    element.appendChild(gdlcEle);
                }
                this.dataLabel.calculateSmartLabels(this.dataLabel.labelOptions[j as number], j);
                for (let k: number = 0; k < smithchart.series[j as number].points.length; k++) {
                    const currentPoint: DataLabelTextOptions = this.dataLabel.labelOptions[j as number]['textOptions'][k as number];
                    if ((currentPoint.xPosition + currentPoint.width) > (smithchart.chartArea.x + smithchart.chartArea.width)
                        || currentPoint.xPosition < smithchart.chartArea.x || currentPoint.yPosition < smithchart.chartArea.y ||
                        currentPoint.yPosition + currentPoint.height > smithchart.chartArea.y + smithchart.chartArea.height) {
                        this.dataLabel.labelOptions[j as number].textOptions[k as number].connectorFlag = false;
                        this.dataLabel.labelOptions[j as number].textOptions[k as number].visible = false;
                    }
                    if (currentPoint['connectorFlag']) {
                        this.dataLabel.drawConnectorLines(smithchart, j, k, currentPoint, gdlcEle);
                    }
                }
            }
        }
        for (let j: number = 0; j < smithchart.series.length; j++) {
            const dataLabel: SeriesMarkerDataLabelModel = smithchart.series[j as number].marker.dataLabel;
            if (smithchart.series[j as number].marker.dataLabel.visible) {
                const element: Element = document.getElementById(smithchart.element.id + '_svg' + '_seriesCollection' + j);
                const gdEle: Element = smithchart.renderer.createGroup({
                    'id': smithchart.element.id + '_svg'
                        + '_series' + j + '_Datalabel'
                });
                gdEle.setAttribute('aria-hidden', 'true');
                if (element) {
                    element.appendChild(gdEle);
                }
                for (let k: number = 0; k < smithchart.series[j as number].points.length; k++) {
                    const currentPoint: DataLabelTextOptions = this.dataLabel.labelOptions[j as number]['textOptions'][k as number];
                    if (!dataLabel.template && currentPoint.visible) {
                        let options: DataLabelTextOptions = new DataLabelTextOptions();
                        options = this.dataLabel.labelOptions[j as number]['textOptions'][k as number];
                        const font: SmithchartFontModel = dataLabel.textStyle;
                        const x: number = options['xPosition'];
                        const y: number = options['yPosition'];
                        const id: string = smithchart.element.id + '_Series' + j + '_Points' + k + '_dataLabel' + '_symbol' + k;
                        const fill: string = dataLabel['fill'] ? dataLabel['fill'] : (smithchart.series[j as number].fill ||
                            smithchart.seriesColors[j % smithchart.seriesColors.length]);
                        const border: SeriesMarkerDataLabelBorderModel = smithchart.series[j as number].marker.dataLabel.border;

                        const rectOptions: RectOption = new RectOption(
                            id, fill, border, options['opacity'], new SmithchartRect(x, y, options['width'], options['height'])
                        );
                        const dataEle: Element = smithchart.renderer.drawRectangle(rectOptions) as SVGRectElement;
                        gdEle.appendChild(dataEle);
                        const textRenderEventArgs: ISmithchartTextRenderEventArgs = {
                            text: options['text'],
                            x: options['x'],
                            y: options['y'],
                            seriesIndex: j,
                            pointIndex: k,
                            name: textRender,
                            cancel: false
                        };
                        const textRenderSuccess: Function = (args: ISmithchartTextRenderEventArgs) => {
                            if (!args.cancel) {
                                const textoptions: TextOption = new TextOption(
                                    options['id'], args.x, args.y, 'start', args.text
                                );
                                const color: string = font.color ? font.color : smithchart.themeStyle.dataLabelFont.color;
                                const element: Element = renderTextElement(textoptions, font, color, gdEle,
                                                                           smithchart.themeStyle.dataLabelFont);
                                gdEle.appendChild(element);
                            }
                        };
                        textRenderSuccess.bind(this);
                        smithchart.trigger(textRender, textRenderEventArgs, textRenderSuccess);
                    } else if (dataLabel.template) {
                        const element: HTMLElement = document.getElementById(dataLabel.template + '_seriesIndex' + j + '_pointIndex' +
                            k + smithchart.element.id);
                        element.style.left = this.dataLabel.labelOptions[j as number]['textOptions'][k as number].xPosition + 'px';
                        element.style.top = this.dataLabel.labelOptions[j as number]['textOptions'][k as number].yPosition + 'px';
                    }
                }
            }
        }
        for (let i: number = 0; i < smithchart.series.length; i++) {
            if (((smithchart.series[i as number].enableAnimation && animationMode !== 'Disable') || animationMode === 'Enable') && smithchart.animateSeries) {
                if (smithchart.series[i as number].marker.dataLabel.template) {
                    this.animateDataLabelTemplate(i, smithchart);
                }
                const element: Element = document.getElementById(smithchart.element.id + '_svg' + '_seriesCollection' + i);
                element.setAttribute('aria-label', ('Smithchart with ' + series[i as number].points.length + ' points'));
                this.performAnimation(smithchart, element, i);
            }
        }
    }

    private drawSeries(smithchart: Smithchart, seriesindex: number, groupElement: Element, bounds: SmithchartRect): void {

        const gsEle: Element = smithchart.renderer.createGroup({
            'id': smithchart.element.id + '_svg' + '_seriesCollection' + seriesindex,
            'clip-path': 'url(#' + smithchart.element.id + '_ChartSeriesClipRect_' +
                seriesindex + ')'
        });
        if (!smithchart.series[seriesindex as number].marker.visible) {
            gsEle.setAttribute('tabindex', seriesindex === 0 ? '0' : '');
            (gsEle as HTMLElement).style.outline = 'none';
        }
        gsEle.setAttribute('visibility', smithchart.series[seriesindex as number].visibility);
        gsEle.setAttribute('role', 'region');
        gsEle.setAttribute('aria-label', ('Smithchart with ' + smithchart.series[seriesindex as number].points.length + ' points'));
        groupElement.appendChild(gsEle);
        let sb: string = '';
        let element: Element;
        const count: number = smithchart.series[seriesindex as number].points.length - 1;
        for (let i: number = 0; i < count; i++) {
            const point1: Point = this.pointsRegion[seriesindex as number][i as number]['point'];
            const point2: Point = this.pointsRegion[seriesindex as number][i + 1]['point'];
            sb = sb + ('M' + ' ' + (point1.x) + ' ' + (point1.y) + ' ' + 'L' +
                ' ' + (point2.x) + ' ' + (point2.y) + ' ');
        }
        const path: string = sb.toString();
        const fill: string = smithchart.series[seriesindex as number].fill ||
            smithchart.seriesColors[seriesindex % smithchart.seriesColors.length];
        const seriesEventArgs: ISmithchartSeriesRenderEventArgs = {
            text: smithchart.series[seriesindex as number].name,
            fill: fill,
            name: seriesRender,
            cancel: false
        };
        const seriesRenderSuccess: Function = (args: ISmithchartSeriesRenderEventArgs) => {
            if (!args.cancel) {
                const options: PathOption = new PathOption(
                    smithchart.element.id + '_series' + seriesindex + '_points', 'none', smithchart.series[seriesindex as number].width,
                    seriesEventArgs.fill, smithchart.series[seriesindex as number].opacity, 'none', path
                );
                this.clipRectElement = smithchart.renderer.drawClipPath(new RectOption(
                    smithchart.element.id + '_ChartSeriesClipRect_' + seriesindex, 'transparent', { width: 1, color: 'Gray' }, 1,
                    {
                        x: bounds.x, y: bounds.y,
                        width: smithchart.availableSize.width,
                        height: smithchart.availableSize.height
                    }));
                gsEle.appendChild(this.clipRectElement);
                const gspEle: Element = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + seriesindex });
                element = smithchart.renderer.drawPath(options);
                gspEle.appendChild(element);
                gsEle.appendChild(gspEle);
            }
        };
        seriesRenderSuccess.bind(this);
        smithchart.trigger(seriesRender, seriesEventArgs, seriesRenderSuccess);
        const markerrender: Marker = new Marker();
        markerrender.drawMarker(smithchart, seriesindex, gsEle, this.pointsRegion[seriesindex as number]);
        this.dataLabel.drawDataLabel(smithchart, seriesindex, gsEle, this.pointsRegion[seriesindex as number], bounds);
    }

    private animateDataLabelTemplate(seriesindex: number, smithchart: Smithchart): void {
        const length: number = smithchart.series[seriesindex as number].points.length;
        const delay: number = 0;
        const duration: number = parseFloat(smithchart.series[seriesindex as number].animationDuration);
        for (let i: number = 0; i < length; i++) {
            const element: HTMLElement = <HTMLElement>document.getElementById(smithchart.series[seriesindex as number].marker.dataLabel.template + '_seriesIndex' + seriesindex + '_pointIndex' + i + smithchart.element.id);
            (<HTMLElement>element).style.visibility = 'hidden';
            templateAnimate(smithchart, element, delay, duration, 'FadeIn');
            // this.fadein(element);
        }
    }
    /*private fadein(element: HTMLElement): void {
      let op: number = 0.1;
      element.style.display = 'block';
      let timer: number = setInterval( (): void => {
            if (op >= 1) {
                clearInterval(timer);
            }
            element.style.opacity = op.toString();
            element.style.filter = 'alpha(opacity=' + op * 100 + ')';
            op += op * 0.1;
    }, 50);
    }*/

    private performAnimation(smithchart: Smithchart, gsEle: Element, seriesIndex: number): void {
        const animation: Animation = new Animation({});
        const clipRect: HTMLElement = <HTMLElement>gsEle.childNodes[0].childNodes[0].childNodes[0];
        const effect: Function = getAnimationFunction('Linear');
        const reveffect: Function = getAnimationFunction('Reverse');
        const width: number = +clipRect.getAttribute('width');
        const x: number = +clipRect.getAttribute('x');
        let value: number;
        animation.animate(clipRect, {
            duration: (parseFloat(smithchart.series[seriesIndex as number].animationDuration) === 0 && animationMode === 'Enable') ? 2000 : parseFloat(smithchart.series[seriesIndex as number].animationDuration),
            progress: (args: AnimationOptions): void => {
                if (smithchart.renderType === 'Impedance') {
                    value = effect(args.timeStamp - args.delay, 0, width, args.duration);
                    clipRect.setAttribute('width', value.toString());
                } else {
                    value = reveffect(args.timeStamp - args.delay, width, 0, args.duration);
                    clipRect.setAttribute('x', value.toString());
                }
            },
            end: () => {
                if (smithchart.renderType === 'Impedance') {
                    clipRect.setAttribute('width', width.toString());
                } else {
                    clipRect.setAttribute('x', x.toString());
                }
                const event: ISmithchartAnimationCompleteEventArgs = {
                    cancel: false,
                    name: animationComplete,
                    smithchart: smithchart
                };
                smithchart.trigger(animationComplete, event);
            }
        });
    }
    public getLocation(seriesindex: number, pointIndex: number): Point {
        const x: number = this.location[seriesindex as number][pointIndex as number].x;
        const y: number = this.location[seriesindex as number][pointIndex as number].y;
        return { x: x, y: y };
    }
}
