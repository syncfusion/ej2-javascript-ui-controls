/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Maps } from '../../index';
import { LayerSettings, convertTileLatLongToPoint  } from '../index';
import { convertGeoToPoint, Point, PathOption, maintainSelection } from '../utils/helper';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * navigation-selected-line
 */
export class NavigationLine {
    private maps: Maps;
    constructor(maps: Maps) {
        this.maps = maps;
    }
    // eslint-disable-next-line valid-jsdoc
    /**
     * To render navigation line for maps
     */
    public renderNavigation(layer: LayerSettings, factor: number, layerIndex: number): Element {
        let navigationEle: Element;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const navigation: any[] = layer.navigationLineSettings;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let longitude: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let point: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let latitude: any;
        let visible: boolean;
        let angle: number;
        let width: number;
        let color: string;
        let dashArray: string;
        let pathOption: PathOption;
        let direction: number;
        let showArrow: boolean;
        let arrowColor: string;
        let arrowSize: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let arrowSettings: any;
        let arrowPosition: string;
        let startArrow: string;
        let endArrow: string;
        let offSet: number;
        let offSetValue: number;
        let navigationGroup: Element;
        let d: string;
        const group: Element = (this.maps.renderer.createGroup({
            id: this.maps.element.id + '_LayerIndex_' + layerIndex + '_line_Group'
        }));
        for (let i: number = 0; i < navigation.length; i++) {
            latitude = navigation[i]['properties']['latitude'];
            longitude = navigation[i]['properties']['longitude'];
            visible = navigation[i]['properties']['visible'];
            angle = navigation[i]['angle'];
            width = navigation[i]['width'] || 1;
            color = navigation[i]['color'];
            dashArray = navigation[i]['properties']['dashArray'];
            arrowSettings = navigation[i]['properties']['arrowSettings'];
            showArrow = (isNullOrUndefined(arrowSettings)) ? false : arrowSettings['properties']['showArrow'];
            if (longitude['length'] === latitude['length'] && visible) {
                for (let i: number = 0; i < longitude['length']; i++) {
                    const location: Point = (this.maps.isTileMap) ? convertTileLatLongToPoint(
                        new Point(longitude[i], latitude[i]), factor, this.maps.tileTranslatePoint, true
                    ) : convertGeoToPoint(latitude[i], longitude[i], factor, layer, this.maps);
                    point.push(location);
                }
            }
            navigationGroup = (this.maps.renderer.createGroup({
                id: this.maps.element.id + '_LayerIndex_' + layerIndex + '_NavigationGroup' + i + ''
            }));
            for (let j: number = 0; j < point['length'] - 1; j++) {
                angle = (-1 > angle) ? -1 : angle;
                angle = (1 < angle) ? 1 : angle;
                const arcId: string = this.maps.element.id + '_LayerIndex_' + layerIndex + '_NavigationIndex_' + i + '_Line' + j + '';
                const radius: number = this.convertRadius(point[j], point[j + 1]);
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
                if (showArrow) {
                    arrowColor = arrowSettings['properties']['color'];
                    arrowSize = arrowSettings['properties']['size'];
                    offSetValue = (arrowSettings['properties']['offSet'] === undefined) ? 0 : arrowSettings['properties']['offSet'];
                    const divide: number = (Math.round(arrowSize / 2));
                    arrowPosition = arrowSettings['properties']['position'];
                    startArrow = (arrowPosition === 'Start') ? 'url(#triangle' + i + ')' : null;
                    endArrow = (arrowPosition === 'End') ? 'url(#triangle' + i + ')' : null;
                    if (offSet !== 0 && angle === 0) {
                        offSet = (arrowPosition === 'Start') ? offSetValue : -(offSetValue);
                    }
                    offSet = (isNullOrUndefined(offSet)) ? 0 : offSet;
                    const triId: string = this.maps.element.id + '_triangle';
                    const defElement: Element = this.maps.renderer.createDefs();
                    defElement.innerHTML += '<marker id="' + 'triangle' + i + '"></marker>';
                    const markerEle: Element = defElement.querySelector('#' + 'triangle' + i);
                    markerEle.setAttribute('markerWidth', (arrowSize.toString()));
                    markerEle.setAttribute('markerHeight', (arrowSize.toString()));
                    markerEle.setAttribute('refX', (divide - offSet).toString());
                    markerEle.setAttribute('refY', divide.toString());
                    markerEle.setAttribute('orient', 'auto');
                    const d2: string = 'M 0,0  L 0,' + arrowSize + ' L ' + divide + ', ' + divide + ' Z';
                    pathOption = new PathOption(triId, arrowColor, width, color, 1, 1, dashArray, d2);
                    navigationEle = this.maps.renderer.drawPath(pathOption);
                    markerEle.appendChild(navigationEle);
                    defElement.appendChild(markerEle);
                    navigationGroup.appendChild(defElement);
                }
                angle = Math.abs(angle);
                d = (angle === 0) ? 'M ' + point[j]['x'] + ',' + point[j]['y'] + 'L ' + point[j + 1]['x']
                        + ',' + point[j + 1]['y'] + ' ' :
                    'M ' + point[j]['x'] + ',' + point[j]['y'] + ' A ' + (radius / 2 + (1 - angle) * radius / (angle * 10)) +
                        ' ' + (radius / 2 + (1 - angle) * radius / (angle * 10)) + ' ' + 0 + ',' + 0 + ','
                        + direction + ' , ' + point[j + 1]['x'] + ',' + point[j + 1]['y'] + ' ';
                pathOption = new PathOption(arcId, 'none', width, color, 1, 1, dashArray, d);
                navigationEle = this.maps.renderer.drawPath(pathOption) as SVGLineElement;
                if (!isNullOrUndefined(arrowPosition)) {
                    const position: void = (arrowPosition === 'Start') ? navigationEle.setAttribute('marker-start', startArrow)
                        : navigationEle.setAttribute('marker-end', endArrow);
                }
                maintainSelection(this.maps.selectedNavigationElementId, this.maps.navigationSelectionClass, navigationEle,
                                    'navigationlineselectionMapStyle');
                navigationGroup.appendChild(navigationEle);
                group.appendChild(navigationGroup);
            }
            point = [];
        }
        return group;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private convertRadius(point1: any, point2: any): number {
        const value1: number = point2['x'] - point1['x'];
        const value2: number = point2['y'] - point1['y'];
        const value: number = Math.sqrt((Math.pow(value1, 2) + Math.pow(value2, 2)));
        return value;
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name
     */
    protected getModuleName(): string {
        return 'NavigationLine';
    }

    /**
     * To destroy the layers.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.maps = null;
    }
}
