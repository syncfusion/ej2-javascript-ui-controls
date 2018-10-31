/**
 * 
 */
import { Smithchart} from '../../smithchart';
import { Marker} from './marker';
import { SmithchartFontModel} from '../../smithchart/utils/utils-model';
import { SeriesMarkerDataLabelBorderModel } from '../../smithchart/series/series-model';
import { SmithchartSeriesModel, SeriesMarkerModel, SeriesMarkerDataLabelModel} from './series-model';
import { TextOption, renderTextElement} from '../../smithchart/utils/helper';
import { SmithchartRect, Point, LineSegment, PointRegion, DataLabelTextOptions } from '../../smithchart/utils/utils';
import { _getEpsilonValue, PathOption, RectOption, getAnimationFunction, templateAnimate} from '../../smithchart/utils/helper';
import { AxisRender} from '../../smithchart/axis/axisrender';
import { ISmithchartAnimationCompleteEventArgs, ISmithchartSeriesRenderEventArgs} from '../../smithchart/model/interface';
import { animationComplete} from '../../smithchart/model/constant';
import { DataLabel} from '../../smithchart/series/datalabel';
import { ISmithchartTextRenderEventArgs} from '../../smithchart/model/interface';
import { Animation, AnimationOptions } from '@syncfusion/ej2-base';

/* tslint:disable:no-string-literal */
export class SeriesRender {

    public xValues: number[] = [];
    public yValues: number[] = [];
    public pointsRegion: PointRegion[][] = [];
    public lineSegments: LineSegment[] = [];
    public location: Point[][] = [];
    public clipRectElement: Element;
    private dataLabel: DataLabel = new DataLabel();

    private processData(series: SmithchartSeriesModel): void {
        let dataArray: object[] = <object[]>series.dataSource;
        let resistance: string = series.resistance;
        let reactance: string = series.reactance;
        series.points = [];
        for (let i: number = 0; i < dataArray.length; i++) {
            series.points.push({resistance: dataArray[i][resistance],
                               reactance: dataArray[i][reactance]});
        }
     }
 // tslint:disable:max-func-body-length
public draw(smithchart: Smithchart, axisRender: AxisRender, bounds: SmithchartRect): void {

let groupElement: Element = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + '_seriesCollections'});

let resistantCx: number;
let reactanceCy: number;
let series: SmithchartSeriesModel[] = smithchart.series;
let seriesLength: number = series.length;
let chartAreaRadius: number = axisRender.areaRadius;
let interSectPoint: Point;
let index: number;
for (let m: number = 0; m < seriesLength; m++) {
        let seriesIndex: number = m;
        if (series[m].dataSource && series[m].resistance && series[m].reactance) {
            this.processData(series[m]);
        }
        this.pointsRegion[m] = [];
        this.location[m] = [];
        for (let j: number = 0; j < series[m].points.length; j++) {
            this.xValues[j] = series[m].points[j]['resistance'];
            this.yValues[j] = series[m].points[j]['reactance'];
        }
        let chartAreaCx: number = axisRender.circleCenterX;
        let chartAreaCy: number = axisRender.circleCenterY;
        let diameter: number = axisRender.areaRadius * 2;
        let reactanceStartPoint: Point = { x: chartAreaCx + ((smithchart.renderType === 'Impedance') ?
                                           chartAreaRadius : -chartAreaRadius), y: chartAreaCy };
        let resistantCy: number = chartAreaCy;
        let reactanceCx: number = reactanceStartPoint.x;
        for (let k: number = 0; k < series[m].points.length; k++) {
            let resistance: number = this.xValues[k];
            let resistantR: number = (diameter * (1 / (resistance + 1))) / 2;
            let reactance: number = this.yValues[k];
            let reactanceR: number = Math.abs(((1 / reactance) * diameter) / 2);
            if (smithchart.renderType === 'Impedance') {
                reactanceCy = reactance > 0 ? chartAreaCy - reactanceR : chartAreaCy + reactanceR;
                resistantCx = (axisRender.circleLeftX + diameter - resistantR);
            } else {
                reactanceCy = reactance < 0 ? chartAreaCy - reactanceR : chartAreaCy + reactanceR;
                resistantCx = (axisRender.circleLeftX + resistantR);
            }
            interSectPoint = axisRender.intersectingCirclePoints(reactanceCx, reactanceCy, reactanceR,
                                                                 resistantCx, resistantCy, resistantR,
                                                                 smithchart.renderType);
            let epsilon: number = _getEpsilonValue();
            if (Math.abs(reactance) < epsilon) {
                interSectPoint.x = (smithchart.renderType === 'Impedance') ?
                                              resistantCx - resistantR : resistantCx + resistantR;
                interSectPoint.y = chartAreaCy;
            }
            this.pointsRegion[m][k] = new PointRegion();
            this.pointsRegion[m][k] = { point: interSectPoint, x: resistance, y: reactance };
            this.location[m][k] = { x: interSectPoint.x, y: interSectPoint.y };
            }
        for (let i: number = 0; i < series[m].points.length - 1; i++) {
                index = i + 1;
                this.lineSegments[i] = new LineSegment();
                this.lineSegments[i] = { x1: this.xValues[i], y1: this.yValues[i], x2: this.xValues[index], y2: this.yValues[index] };
        }
        smithchart.svgObject.appendChild(groupElement);
        this.drawSeries(smithchart, seriesIndex, groupElement, bounds);
    }
for (let j: number = 0; j < smithchart.series.length; j++) {
    if (smithchart.series[j].enableSmartLabels && smithchart.series[j].marker.dataLabel.visible) {
            let gdlcEle: Element = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg'
                                  + '_series' + j + '_Datalabel' + '_connectorLines'});
            let element: Element = document.getElementById(smithchart.element.id + '_svg' + '_seriesCollection' + j);
            if (element) {
                element.appendChild(gdlcEle);
            }
            this.dataLabel.calculateSmartLabels(this.dataLabel.labelOptions[j], j);
            for (let k: number = 0; k < smithchart.series[j].points.length; k++) {
                       let currentPoint: DataLabelTextOptions = this.dataLabel.labelOptions[j]['textOptions'][k];
                       if ((currentPoint.xPosition + currentPoint.width) > (smithchart.chartArea.x + smithchart.chartArea.width)
                            || currentPoint.xPosition < smithchart.chartArea.x || currentPoint.yPosition < smithchart.chartArea.y ||
                            currentPoint.yPosition + currentPoint.height > smithchart.chartArea.y + smithchart.chartArea.height) {
                            this.dataLabel.labelOptions[j].textOptions[k].connectorFlag = false;
                            this.dataLabel.labelOptions[j].textOptions[k].visible = false;
                        }
                       if (currentPoint['connectorFlag']) {
                            this.dataLabel.drawConnectorLines(smithchart, j, k, currentPoint, gdlcEle);
                        }
                    }
        }
     }
for (let j: number = 0; j < smithchart.series.length; j++) {
        let dataLabel: SeriesMarkerDataLabelModel = smithchart.series[j].marker.dataLabel;
        if (smithchart.series[j].marker.dataLabel.visible) {
        let element: Element = document.getElementById(smithchart.element.id + '_svg' + '_seriesCollection' + j);
        let gdEle: Element = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg'
            + '_series' + j + '_Datalabel' });
        if (element) {
            element.appendChild(gdEle);
        }
        for (let k: number = 0; k < smithchart.series[j].points.length; k++) {
            let currentPoint: DataLabelTextOptions = this.dataLabel.labelOptions[j]['textOptions'][k];
            if (!dataLabel.template && currentPoint.visible) {

        let options: DataLabelTextOptions = new DataLabelTextOptions();
        options = this.dataLabel.labelOptions[j]['textOptions'][k];
        let font: SmithchartFontModel = dataLabel.textStyle;
        let x: number = options['xPosition'];
        let y: number = options['yPosition'];
        let id: string = smithchart.element.id + '_Series' + j + '_Points' + k + '_dataLabel' + '_symbol' + k;
        let fill: string = dataLabel['fill'] ? dataLabel['fill'] : (smithchart.series[j].fill ||
                                                                     smithchart.seriesColors[j % smithchart.seriesColors.length]);
        let border: SeriesMarkerDataLabelBorderModel = smithchart.series[j].marker.dataLabel.border;

        let rectOptions: RectOption = new RectOption(
                id, fill, border, options['opacity'], new SmithchartRect(x, y, options['width'], options['height'])
            );
        let dataEle: Element = smithchart.renderer.drawRectangle(rectOptions) as SVGRectElement;
        gdEle.appendChild(dataEle);
        let textRenderEventArgs: ISmithchartTextRenderEventArgs = { text: options['text'], x: options['x'], y: options['y'], seriesIndex: j,
                                                          pointIndex: k, name: 'textRender', cancel: false};
        smithchart.trigger('textRender', textRenderEventArgs);
        let textoptions: TextOption = new TextOption(
                options['id'], textRenderEventArgs.x, textRenderEventArgs.y, 'start', textRenderEventArgs.text
            );
        let color: string = font.color ? font.color : smithchart.themeStyle.dataLabel;
        let element: Element = renderTextElement(textoptions, font, color, gdEle);
        gdEle.appendChild(element);
        } else if (dataLabel.template) {
                let element: HTMLElement = document.getElementById(dataLabel.template + '_seriesIndex' + j + '_pointIndex' +
                                                                       k + smithchart.element.id);
                element.style.left = this.dataLabel.labelOptions[j]['textOptions'][k].xPosition + 'px';
                element.style.top = this.dataLabel.labelOptions[j]['textOptions'][k].yPosition + 'px';
                     }
                 }
            }
    }
for (let i: number = 0; i < smithchart.series.length; i++) {
     if (smithchart.series[i].enableAnimation && smithchart.animateSeries) {
             if (smithchart.series[i].marker.dataLabel.template) {
               this.animateDataLabelTemplate(i, smithchart);
             }
             let element: Element = document.getElementById(smithchart.element.id + '_svg' + '_seriesCollection' + i);
             this.performAnimation(smithchart, element, i);
          }
     }
}

private drawSeries(smithchart: Smithchart, seriesindex: number, groupElement: Element, bounds: SmithchartRect): void {

         let gsEle: Element = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + '_seriesCollection' + seriesindex,
                                                                'clip-path': 'url(#' + smithchart.element.id + '_ChartSeriesClipRect_' +
                                                                 seriesindex + ')'   });
         gsEle.setAttribute('visibility', smithchart.series[seriesindex].visibility);
         groupElement.appendChild(gsEle);
         let sb: string = '';
         let path: string;
         let marker: SeriesMarkerModel = smithchart.series[seriesindex].marker;
         let element: Element;
         let count: number = smithchart.series[seriesindex].points.length - 1;
         for (let i: number = 0; i < count; i++) {
                    let point1: Point = this.pointsRegion[seriesindex][i]['point'];
                    let point2: Point = this.pointsRegion[seriesindex][i + 1]['point'];
                    sb = sb + ('M' + ' ' + (point1.x) + ' ' + (point1.y) + ' ' + 'L' +
                         ' ' + (point2.x) + ' ' + (point2.y) + ' ');
                }
         path = sb.toString();
         let fill: string = smithchart.series[seriesindex].fill || smithchart.seriesColors[seriesindex % smithchart.seriesColors.length];
         let seriesEventArgs: ISmithchartSeriesRenderEventArgs = { text: smithchart.series[seriesindex].name, fill: fill,
                                                          name: 'seriesRender', cancel: false};
         smithchart.trigger('seriesRender', seriesEventArgs);
         let options: PathOption = new PathOption(
                     smithchart.element.id + '_series' + seriesindex + '_points',
                     'none',
                     smithchart.series[seriesindex].width,
                     seriesEventArgs.fill,
                     smithchart.series[seriesindex].opacity,
                     'none',
                     path
                );
         this.clipRectElement = smithchart.renderer.drawClipPath(new RectOption(
                    smithchart.element.id + '_ChartSeriesClipRect_' + seriesindex, 'transparent', { width: 1, color: 'Gray' }, 1,
                    {
                        x: bounds.x, y: bounds.y,
                        width: smithchart.availableSize.width,
                        height: smithchart.availableSize.height
                    }));
         gsEle.appendChild(this.clipRectElement);
         let gspEle: Element = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + seriesindex});
         element = smithchart.renderer.drawPath(options);
         gspEle.appendChild(element);
         gsEle.appendChild(gspEle);
         let markerrender: Marker = new Marker();
         markerrender.drawMarker(smithchart, seriesindex, gsEle, this.pointsRegion[seriesindex]);
         this.dataLabel.drawDataLabel(smithchart, seriesindex, gsEle, this.pointsRegion[seriesindex], bounds);

}

private animateDataLabelTemplate(seriesindex: number, smithchart: Smithchart): void {
     let length: number = smithchart.series[seriesindex].points.length;
     let opacity : number = 0;
     let delay: number = 0;
     let duration: number = parseFloat(smithchart.series[seriesindex].animationDuration);
     for (let i: number = 0; i < length; i++) {
         let element: HTMLElement = <HTMLElement>document.getElementById(smithchart.series[seriesindex].marker.dataLabel.template +
          '_seriesIndex' + seriesindex + '_pointIndex' + i + smithchart.element.id);
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
    let animation: Animation = new Animation({});
    let element: HTMLElement = document.getElementById('container_svg_seriesCollections');
    let clipRect : HTMLElement = <HTMLElement> gsEle.childNodes[0].childNodes[0].childNodes[0];
    let effect: Function = getAnimationFunction('Linear');
    let reveffect: Function = getAnimationFunction('Reverse');
    let width : number = +clipRect.getAttribute('width');
    let x: number = +clipRect.getAttribute('x');
    let value: number;
    animation.animate(clipRect, {
                      duration : parseFloat(smithchart.series[seriesIndex].animationDuration),
                      progress : (args: AnimationOptions): void => {
                      if (smithchart.renderType === 'Impedance') {
                      value = effect(args.timeStamp - args.delay, 0, width, args.duration);
                      clipRect.setAttribute('width', value.toString());
                    } else {
                       value = reveffect(args.timeStamp - args.delay, width, 0, args.duration);
                       clipRect.setAttribute('x', value.toString());
                      }
                      },
        end: (model: AnimationOptions) => {
            if (smithchart.renderType === 'Impedance') {
             clipRect.setAttribute('width', width.toString());
            } else {
             clipRect.setAttribute('x', x.toString());
            }
            let event: ISmithchartAnimationCompleteEventArgs = {
                cancel: false, name: animationComplete, smithchart: smithchart
            };
            smithchart.trigger(animationComplete, event );
        }
    });
  }
  public getLocation(seriesindex: number, pointIndex: number): Point {
    let x: number;
    let y: number;
    x = this.location[seriesindex][pointIndex].x;
    y = this.location[seriesindex][pointIndex].y;
    return { x: x, y: y };
  }
}