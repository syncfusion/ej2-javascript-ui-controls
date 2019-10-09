/**
 * 
 */
import { Smithchart} from '../../smithchart';
import { SeriesMarkerModel, SeriesMarkerBorderModel } from './series-model';
import { CircleOption, PathOption } from '../../smithchart/utils/helper';
import { SmithchartSize, Point, PointRegion, MarkerOptions } from '../../smithchart/utils/utils';
/* tslint:disable:no-string-literal */
export class Marker {


 public drawMarker(smithchart: Smithchart, seriesindex: number, groupElement: Element, pointsRegion: PointRegion[]): void {

 if (smithchart.series[seriesindex].marker.visible) {
                    let marker: SeriesMarkerModel = smithchart.series[seriesindex].marker;
                    let count: number = smithchart.series[seriesindex].points.length - 1;
                    let width: number = marker.width;
                    let height: number = marker.height;
                    let symbolName: string =  marker.shape;
                    let gmEle: Element = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' +
                                                                         '_series' + seriesindex + '_Marker' });
                    groupElement.appendChild(gmEle);
                    let borderWidth: number =  marker.border.width;
                    let borderColor: string = marker.border.color;
                    let opacity: number = marker.opacity;
                    let fill: string = marker.fill ? marker.fill : (smithchart.series[seriesindex].fill ||
                                                                    smithchart.seriesColors[seriesindex % smithchart.seriesColors.length]);
                    for (let i: number = 0; i < count + 1; i++) {
                        let location: Point = pointsRegion[i]['point'];
                        let pointIndex: number = i;
                        let options: MarkerOptions = new MarkerOptions(
                            smithchart.element.id + '_Series' + seriesindex + '_Points' + pointIndex + '_Marker' + pointIndex,
                            fill,
                            borderColor,
                            borderWidth,
                            opacity,
                        );
                        gmEle.appendChild(this.drawSymbol(symbolName, marker.imageUrl, location,
                                                          new SmithchartSize(width, height), options, smithchart));
                    }
                }
 }

 private drawSymbol(symbolName: string, url: string, location: Point, size: SmithchartSize,
                    options: MarkerOptions, smithchart: Smithchart): Element {
    let markerEle: Element;
    let shape: string = symbolName.toLowerCase();
    let circleOptions: CircleOption;
    let pathOptions: PathOption;
    let path: string;
    let border: SeriesMarkerBorderModel = { color: options['borderColor'], width: options['borderWidth'] };
    let opacity: number = options.opacity;
    let startX: number = location.x;
    let startY: number = location.y;
    let radius: number = Math.sqrt(size.height * size.height + size.width * size.width) / 2;
    switch (shape) {
    case 'circle':
            circleOptions = new CircleOption(options['id'], options['fill'], border, opacity, location.x, location.y, radius, null);
            markerEle = smithchart.renderer.drawCircle(circleOptions) as SVGCircleElement;
            break;
    case 'rectangle':
            path = 'M' + ' ' + (startX + (-size.width / 2)) + ' ' + (startY + (-size.height / 2)) +
            ' ' + 'L' + ' ' + (startX + (size.width / 2)) + ' ' + (startY + (-size.height / 2)) + ' ' +
                   'L' + ' ' + (startX + (size.width / 2)) + ' ' + (startY + (size.height / 2)) +
                   ' ' + 'L' + ' ' + (startX + (-size.width / 2)) +
                    ' ' + (startY + (size.height / 2)) + ' ' + 'L' + ' ' +
                   (startX + (-size.width / 2)) + ' ' + (startY + (-size.height / 2)) + 'z';
            pathOptions = new PathOption(options['id'], options['fill'],
                                         border.width, border.color, opacity, '', path);
            markerEle = smithchart.renderer.drawPath(pathOptions) as SVGPathElement;
    break;
    case 'triangle':
            path = 'M' + ' ' + (startX + (-size.width / 2)) + ' ' + (startY + (size.height / 2)) + ' ' + 'L' + ' ' + (startX) + ' ' +
                  (startY + (-size.height / 2)) + ' ' + 'L' + ' ' + (startX + (size.width / 2)) + ' ' +
                  (startY + (size.height / 2)) + ' ' + 'L' + ' ' +
                  (startX + (-size.width / 2)) + ' ' + (startY + (size.height / 2)) + 'z';
            pathOptions = new PathOption(options['id'], options['fill'],
                                         border.width, border.color, opacity, '', path);
            markerEle = smithchart.renderer.drawPath(pathOptions) as SVGPathElement;
    break;
    case 'diamond':
            path = 'M' + ' ' + (startX + (-size.width / 2)) + ' ' + (startY) + ' ' + 'L' + ' ' +
                  (startX) + ' ' + (startY + (-size.height / 2)) + ' ' + 'L' + ' ' + (startX + (size.width / 2)) + ' ' +
                  (startY) + ' ' + 'L' + ' ' + (startX) + ' ' + (startY + (size.height / 2)) + ' ' + 'L' + ' ' +
                  (startX + (-size.width / 2)) + ' ' + (startY) + 'z';
            pathOptions = new PathOption(options['id'], options['fill'],
                                         border.width, border.color, opacity, '', path);
            markerEle = smithchart.renderer.drawPath(pathOptions) as SVGPathElement;
    break;
    case 'pentagon':
            let eq: number = 72;
            for (let i: number = 0; i <= 5; i++) {
            let xValue: number = radius * Math.cos((Math.PI / 180) * (i * eq));
            let yValue: number = radius * Math.sin((Math.PI / 180) * (i * eq));
            if (i === 0) {
            path = 'M' + ' ' + (startX + xValue) + ' ' + (startY + yValue) + ' ';
            } else {
            path = path.concat('L' + ' ' + (startX + xValue) + ' ' + (startY + yValue) + ' ');
           }
         }
    path = path.concat('Z');
    pathOptions = new PathOption(options['id'], options['fill'],
                                 border.width, border.color, opacity, '', path);
    markerEle = smithchart.renderer.drawPath(pathOptions) as SVGPathElement;
    break;
    }
    return markerEle;
 }
}