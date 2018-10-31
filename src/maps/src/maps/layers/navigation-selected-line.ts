import { Maps } from '../../index';
import { LayerSettings, convertTileLatLongToPoint  } from '../index';
import { convertGeoToPoint, Point, PathOption } from '../utils/helper';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * navigation-selected-line
 */
export class NavigationLine {
    private maps: Maps;
    constructor(maps: Maps) {
        this.maps = maps;
    }
    /* tslint:disable:no-string-literal */
    //tslint:disable:max-func-body-length
    /**
     * To render navigation line for maps
     */
    public renderNavigation(layer: LayerSettings, factor: number, layerIndex: number): Element {
        let navigationEle: Element;
        let navigation: object[];
        navigation = layer.navigationLineSettings;
        let longitude: object;
        let point: object[] = [];
        let latitude: object;
        let visible: boolean;
        let angle: number;
        let width: number;
        let color: string;
        let dashArray: string;
        let pathOption: PathOption;
        let direction: number;
        let markerWidth: number;
        let arcId: string;
        let radius: number;
        let showArrow: boolean;
        let arrowColor: string;
        let arrowSize: number;
        let arrowSettings: object;
        let arrowPosition: string;
        let startArrow: string;
        let endArrow: string;
        let offSet: number;
        let offSetValue: number;
        let navigationGroup: Element;
        let d: string;
        let group: Element = (this.maps.renderer.createGroup({
            id: this.maps.element.id + '_layerIndex_' + layerIndex + '_line_Group'
        }));
        for (let i: number = 0; i < navigation.length; i++) {
            latitude = navigation[i]['properties']['latitude'];
            longitude = navigation[i]['properties']['longitude'];
            visible = navigation[i]['properties']['visible'];
            angle = navigation[i]['properties']['angle'];
            width = navigation[i]['width'] || 1;
            color = navigation[i]['color'];
            dashArray = navigation[i]['properties']['dashArray'];
            arrowSettings = navigation[i]['properties']['arrowSettings'];
            showArrow = (isNullOrUndefined(arrowSettings)) ? false : arrowSettings['properties']['showArrow'];
            if (longitude['length'] === latitude['length'] && visible) {
                for (let i: number = 0; i < longitude['length']; i++) {
                    let location: Point = (this.maps.isTileMap) ? convertTileLatLongToPoint(
                        new Point(longitude[i], latitude[i]), factor, this.maps.tileTranslatePoint, true
                    ) : convertGeoToPoint(latitude[i], longitude[i], factor, layer, this.maps);
                    point.push(location);
                }
            }
            navigationGroup = (this.maps.renderer.createGroup({
                id: this.maps.element.id + '_layerIndex_' + layerIndex + '_NavigationGroup' + i + ''
            }));
            for (let j: number = 0; j < point['length'] - 1; j++) {
                angle = (-1 > angle) ? -1 : angle;
                angle = (1 < angle) ? 1 : angle;
                let arcId: string = this.maps.element.id + '_LayerIndex_' + layerIndex + '_NavigationIndex_' + i + '_Line' + j + '';
                let radius: number = this.convertRadius(point[j], point[j + 1]);
                if (angle <= 1 && angle > 0) {
                    direction = 0;
                    if (point[j]['x'] > point[j + 1]['x']) {
                        direction = 1;
                    }
                }
                if (angle >= -1 && angle < 0) {
                    direction = 1;
                    if (point[j]['x'] > point[j + 1]['x']) {
                        direction = 0;
                    }
                }
                if (point[j]['x'] !== point[j + 1]['x']) {
                    if (showArrow) {
                        arrowColor = arrowSettings['properties']['color'];
                        arrowSize = arrowSettings['properties']['size'];
                        offSetValue = (arrowSettings['properties']['offSet'] === undefined) ? 0 : arrowSettings['properties']['offSet'];
                        let divide: number = (Math.round(arrowSize / 2));
                        arrowPosition = arrowSettings['properties']['position'];
                        startArrow = (arrowPosition === 'Start') ? 'url(#triangle' + i + ')' : null;
                        endArrow = (arrowPosition === 'End') ? 'url(#triangle' + i + ')' : null;
                        if (offSet !== 0 && angle === 0) {
                            offSet = (arrowPosition === 'Start') ? offSetValue : -(offSetValue);
                        }
                        offSet = (isNullOrUndefined(offSet)) ? 0 : offSet;
                        let triId: string = this.maps.element.id + '_triangle';
                        let defElement: Element = this.maps.renderer.createDefs();
                        let xmlns: string = 'http://www.w3.org/2000/svg';
                        let markerEle: Element = document.createElementNS (xmlns, 'marker');
                        markerEle.setAttribute('id', 'triangle' + i);
                        markerEle.setAttribute('markerWidth', (arrowSize.toString()));
                        markerEle.setAttribute('markerHeight', (arrowSize.toString()));
                        markerEle.setAttribute('refX', (divide - offSet).toString());
                        markerEle.setAttribute('refY', divide.toString());
                        markerEle.setAttribute('orient', 'auto');
                        let d2: string = 'M 0,0  L 0,' + arrowSize + ' L ' + divide + ', ' + divide + ' Z';
                        pathOption = new PathOption(triId, arrowColor, width, color, 1, dashArray, d2);
                        navigationEle = this.maps.renderer.drawPath(pathOption);
                        markerEle.appendChild(navigationEle);
                        defElement.appendChild(markerEle);
                        navigationGroup.appendChild(defElement);
                    }
                    d = (angle === 0) ? 'M ' + point[j]['x'] + ',' + point[j]['y'] + 'L ' + point[j + 1]['x']
                        + ',' + point[j + 1]['y'] + '' :
                        'M ' + point[j]['x'] + ',' + point[j]['y'] + ' A ' + (angle * radius) + ' ' +
                        (angle * radius) + ' ' + 0 + ',' + 0 + ',' + direction + ' , ' + point[j + 1]['x'] + ',' + point[j + 1]['y'] + ' ';
                    pathOption = new PathOption(arcId, 'none', 2, color, 1, dashArray, d);
                    navigationEle = this.maps.renderer.drawPath(pathOption) as SVGLineElement;
                    if (!isNullOrUndefined(arrowPosition)) {
                        (arrowPosition === 'Start') ? navigationEle.setAttribute('marker-start', startArrow)
                            : navigationEle.setAttribute('marker-end', endArrow);
                    }
                    navigationGroup.appendChild(navigationEle);
                    group.appendChild(navigationGroup);
                }
            }
            point = [];
        }
        return group;
    }
    private convertRadius(point1: object, point2: object): number {
        let value1: number = point2['x'] - point1['x'];
        let value2: number = point2['y'] - point1['y'];
        let value: number = Math.sqrt((Math.pow(value1, 2) + Math.pow(value2, 2)));
        return value;
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'NavigationLine';
    }

    /**
     * To destroy the layers. 
     * @return {void}
     * @private
     */
    public destroy(maps: Maps): void {
        /**
         * Destroy method performed here
         */
    }
} 