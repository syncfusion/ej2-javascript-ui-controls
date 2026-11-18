import { Smithchart} from '../../smithchart';
import { SeriesMarkerModel, SeriesMarkerBorderModel } from './series-model';
import { CircleOption, PathOption } from '../../smithchart/utils/helper';
import { SmithchartSize, Point, PointRegion, MarkerOptions } from '../../smithchart/utils/utils';

export class Marker {

    public drawMarker(smithchart: Smithchart, seriesindex: number, groupElement: Element, pointsRegion: PointRegion[]): void {

        if (smithchart.series[seriesindex as number].marker.visible) {
            const marker: SeriesMarkerModel = smithchart.series[seriesindex as number].marker;
            const count: number = smithchart.series[seriesindex as number].points.length - 1;
            const width: number = marker.width;
            const height: number = marker.height;
            const symbolName: string =  marker.shape;
            const gmEle: Element = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' +
                                                                         '_series' + seriesindex + '_Marker' });
            groupElement.appendChild(gmEle);
            const borderWidth: number =  marker.border.width;
            const borderColor: string = marker.border.color;
            const opacity: number = marker.opacity;
            const fill: string = marker.fill ? marker.fill : (smithchart.series[seriesindex as number].fill ||
                                                                    smithchart.seriesColors[seriesindex % smithchart.seriesColors.length]);
            for (let i: number = 0; i < count + 1; i++) {
                const location: Point = pointsRegion[i as number]['point'];
                const pointIndex: number = i;
                const options: MarkerOptions = new MarkerOptions(
                    smithchart.element.id + '_Series' + seriesindex + '_Points' + pointIndex + '_Marker' + pointIndex,
                    fill,
                    borderColor,
                    borderWidth,
                    opacity
                );
                gmEle.appendChild(this.drawSymbol(symbolName, marker.imageUrl, location,
                                                  new SmithchartSize(width, height), options, smithchart));
            }
        }
    }

    private drawSymbol(symbolName: string, url: string, location: Point, size: SmithchartSize,
                       options: MarkerOptions, smithchart: Smithchart): Element {
        let markerEle: Element;
        const shape: string = symbolName.toLowerCase();
        let circleOptions: CircleOption;
        let pathOptions: PathOption;
        let path: string;
        const border: SeriesMarkerBorderModel = { color: options['borderColor'], width: options['borderWidth'] };
        const opacity: number = options.opacity;
        const startX: number = location.x;
        const startY: number = location.y;
        const radius: number = Math.sqrt(size.height * size.height + size.width * size.width) / 2;
        const eq: number = 72;
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
            for (let i: number = 0; i <= 5; i++) {
                const xValue: number = radius * Math.cos((Math.PI / 180) * (i * eq));
                const yValue: number = radius * Math.sin((Math.PI / 180) * (i * eq));
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
        markerEle.setAttribute('role', 'img');
        markerEle.setAttribute('aria-label', 'x: ' + (location.x) + ', ' + 'y: ' + (location.y));
        if ((smithchart.element.id + '_Series0_Points0_Marker0') === (options.id)) {
            markerEle.setAttribute('tabindex', '0');
        }
        return markerEle;
    }
}
