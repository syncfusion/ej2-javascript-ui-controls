import { Maps } from '../../index';
import { SelectionSettingsModel, click, ISelectionEventArgs, itemSelection } from '../index';
import { getElement, createStyle, customizeStyle, removeClass, getTargetElement, getElementByID} from '../utils/helper';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { BorderModel } from '../model/base-model';
/**
 * Selection module class
 */
export class Selection {
    private maps: Maps;
    /**
     * @private
     */
    public selectionsettings: SelectionSettingsModel;
    /**
     * @private
     */
    public selectionType: string;
    constructor(maps: Maps) {
        this.maps = maps;
        this.addEventListener();
    }
    /**
     * For binding events to selection module
     *
     * @returns {void}
     */
    private addEventListener(): void {
        if (!this.maps.isDestroyed) {
            this.maps.on(click, this.mouseClick, this);
        }
    }
    /**
     * For removing events from selection modue
     *
     * @returns {void}
     */
    private removeEventListener(): void {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.off(click, this.mouseClick);
    }
    private mouseClick(targetElement: Element): void {
        if (!isNullOrUndefined(targetElement['type']) && targetElement['type'].indexOf('touch') !== -1 &&
            isNullOrUndefined(targetElement.id)) {
            targetElement = targetElement['target'];
        }
        if (!isNullOrUndefined(targetElement.id) && (targetElement.id.indexOf('LayerIndex') > -1 ||
            targetElement.id.indexOf('NavigationIndex') > -1)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let shapeData: any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let data: any;
            let shapeIndex: number;
            let dataIndex: number;
            const layerIndex: number = parseInt(targetElement.id.split('_LayerIndex_')[1].split('_')[0], 10);
            if (targetElement.id.indexOf('shapeIndex') > -1) {
                shapeIndex = parseInt(targetElement.id.split('_shapeIndex_')[1].split('_')[0], 10);
                shapeData = !isNullOrUndefined(this.maps.layers[layerIndex as number].shapeData['features'])
                            && this.maps.layers[layerIndex as number].shapeData['features']['length'] > shapeIndex ?
                    this.maps.layers[layerIndex as number].shapeData['features'][shapeIndex as number]['properties'] :
                    !isNullOrUndefined(this.maps.layers[layerIndex as number].shapeData['geometries'])
                            && this.maps.layers[layerIndex as number].shapeData['geometries']['length'] > shapeIndex ?
                        this.maps.layers[layerIndex as number].shapeData['geometries'][shapeIndex as number]['properties'] : null ;
                dataIndex = parseInt(targetElement.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = isNullOrUndefined(dataIndex) ? null : this.maps.layers[layerIndex as number].dataSource[dataIndex as number];
                this.selectionsettings = this.maps.layers[layerIndex as number].selectionSettings;
                this.selectionType = 'Shape';
            } else if (targetElement.id.indexOf('BubbleIndex') > -1) {
                const bubbleIndex: number = parseInt(targetElement.id.split('_BubbleIndex_')[1].split('_')[0], 10);
                dataIndex = parseInt(targetElement.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex as number].bubbleSettings[bubbleIndex as number].dataSource[dataIndex as number];
                this.selectionsettings = this.maps.layers[layerIndex as number].bubbleSettings[bubbleIndex as number].selectionSettings;
                this.selectionType = 'Bubble';
            } else if (targetElement.id.indexOf('MarkerIndex') > -1) {
                const markerIndex: number = parseInt(targetElement.id.split('_MarkerIndex_')[1].split('_')[0], 10);
                dataIndex = parseInt(targetElement.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex as number].markerSettings[markerIndex as number].dataSource[dataIndex as number];
                this.selectionsettings = this.maps.layers[layerIndex as number].markerSettings[markerIndex as number].selectionSettings;
                this.selectionType = 'Marker';
            }  else if (targetElement.id.indexOf('_PolygonIndex_') > -1) {
                dataIndex = parseInt(targetElement.id.split('_PolygonIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex as number].polygonSettings.polygons[dataIndex as number].points;
                this.selectionsettings = this.maps.layers[layerIndex as number].polygonSettings.selectionSettings;
                this.selectionType = 'Polygon';
            } else if (targetElement.id.indexOf('NavigationIndex') > -1){
                const index: number = parseInt(targetElement.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                shapeData = null;
                data = {
                    latitude: this.maps.layers[layerIndex as number].navigationLineSettings[index as number].latitude,
                    longitude: this.maps.layers[layerIndex as number].navigationLineSettings[index as number].longitude
                };
                this.selectionsettings = this.maps.layers[layerIndex as number].navigationLineSettings[index as number].selectionSettings;
                this.selectionType = 'navigationline';
            }
            if (!isNullOrUndefined(this.selectionsettings) && this.selectionsettings.enable) {
                this.selectElement(targetElement, layerIndex, data, shapeData);
            }
        } else if ((this.maps.legendSettings.visible && !this.maps.legendSettings.toggleLegendSettings.enable && this.maps.legendModule) &&
                   !isNullOrUndefined(targetElement.id) && targetElement.id.indexOf('_Text') === -1 &&
                   (targetElement.id.indexOf(this.maps.element.id + '_Legend_Shape_Index') > -1 ||
                targetElement.id.indexOf(this.maps.element.id + '_Legend_Index') !== -1)) {
            this.maps.legendModule.legendHighLightAndSelection(targetElement, 'selection');
        }
    }

    /**
     * Selects the element in the map
     *
     * @param {Element} targetElement - Specifies the target element.
     * @param {number} layerIndex - Specifies the index of the layer.
     * @param {object} data - Specifies the data for the map.
     * @param {object} shapeData - Specifies the data for the map to render.
     * @returns {void}
     * @private
     */
    public selectElement(targetElement: Element, layerIndex: number, data: object, shapeData: object): void {
        this.maps.mapSelect = targetElement ? true : false;
        if (this.maps.legendModule && this.maps.legendSettings.visible && targetElement.id.indexOf('_MarkerIndex_') === -1) {
            this.maps.legendModule.shapeHighLightAndSelection(
                targetElement, data, this.selectionsettings, 'selection', layerIndex);
        }
        const shapeToggled: boolean = (targetElement.id.indexOf('shapeIndex') > -1 && this.maps.legendSettings.visible && this.maps.legendModule) ?
            this.maps.legendModule.shapeToggled : true;
        if (shapeToggled) {
            this.selectMap(targetElement, shapeData, data);
        }
    }

    /**
     * Public method for selection
     *
     * @param {number} layerIndex - Specifies the index of the layer.
     * @param {string} name - Specifies the name.
     * @param {boolean} enable - Specifies the enabling of selection in map.
     * @returns {void}
     * @private
     */
    public addSelection(layerIndex: number, name: string, enable: boolean): void {
        const targetElement: Element = getTargetElement(layerIndex, name, enable, this.maps);
        if (enable) {
            this.selectMap(targetElement, null, null);
        } else {
            removeClass(targetElement);
        }
    }
    /**
     * Method for selection
     *
     * @param {Element} targetElement - Specifies the target element
     * @param {any} shapeData - Specifies the shape data
     * @param {any} data - Specifies the data
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private selectMap(targetElement: Element, shapeData: any, data: any): void {
        const isLineStringShape: boolean = targetElement.parentElement.id.indexOf('LineString') > -1;
        const border: BorderModel = {
            color: isLineStringShape ? (this.selectionsettings.fill || this.selectionsettings.border.color) :
                this.selectionsettings.border.color,
            width: isLineStringShape ? (this.selectionsettings.border.width / this.maps.scale) :
                (this.selectionsettings.border.width / (this.selectionType === 'Marker' ? 1 : this.maps.scale)),
            opacity: this.selectionsettings.border.opacity
        };
        const eventArgs: ISelectionEventArgs = {
            opacity: this.selectionsettings.opacity,
            fill: isLineStringShape ? 'transparent' : (this.selectionType !== 'navigationline' ? this.selectionsettings.fill : 'none'),
            border: border,
            name: itemSelection,
            target: targetElement.id,
            cancel: false,
            shapeData: shapeData,
            data: data,
            maps: this.maps
        };
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.maps.trigger('itemSelection', eventArgs, (observedArgs: ISelectionEventArgs) => {
            eventArgs.border.opacity = isNullOrUndefined(this.selectionsettings.border.opacity) ?
                this.selectionsettings.opacity : this.selectionsettings.border.opacity;
            if (!eventArgs.cancel) {
                if (targetElement.getAttribute('class') === this.selectionType + 'selectionMapStyle'
                    || targetElement.getAttribute('class') === 'LineselectionMapStyle') {
                    removeClass(targetElement);
                    this.removedSelectionList(targetElement);
                    for (let m: number = 0; m < this.maps.shapeSelectionItem.length; m++) {
                        if (this.maps.shapeSelectionItem[m as number] === eventArgs.shapeData) {
                            this.maps.shapeSelectionItem.splice(m, 1);
                            break;
                        }
                    }
                    if (targetElement.id.indexOf('NavigationIndex') > -1) {
                        const index: number = parseInt(targetElement.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                        const layerIndex: number = parseInt(targetElement.parentElement.id.split('_LayerIndex_')[1].split('_')[0], 10);
                        targetElement.setAttribute(
                            'stroke-width', this.maps.layers[layerIndex as number].navigationLineSettings[index as number].width.toString()
                        );
                        targetElement.setAttribute('stroke', this.maps.layers[layerIndex as number].navigationLineSettings[index as number].color);
                    }
                } else {
                    const layetElement: Element = getElementByID(this.maps.element.id + '_Layer_Collections');
                    if (!this.selectionsettings.enableMultiSelect &&
                        (layetElement.getElementsByClassName(this.selectionType + 'selectionMapStyle').length > 0 ||
                        layetElement.getElementsByClassName('LineselectionMapStyle').length > 0)) {
                        let eleCount : number = layetElement.getElementsByClassName(this.selectionType + 'selectionMapStyle').length;
                        let ele : Element;
                        for (let k : number = 0 ; k < eleCount; k++) {
                            ele = layetElement.getElementsByClassName(this.selectionType + 'selectionMapStyle')[0];
                            removeClass(ele);
                            this.removedSelectionList(ele);
                        }
                        if (layetElement.getElementsByClassName('LineselectionMapStyle').length > 0) {
                            eleCount = layetElement.getElementsByClassName('LineselectionMapStyle').length;
                            for (let k : number = 0 ; k < eleCount; k++) {
                                ele = layetElement.getElementsByClassName('LineselectionMapStyle')[0];
                                removeClass(ele);
                                this.removedSelectionList(ele);
                            }
                        }
                        if (this.selectionType === 'Shape') {
                            this.maps.shapeSelectionItem = [];
                            const selectionLength: number = this.maps.selectedElementId.length;
                            for (let i: number = 0; i < selectionLength; i++) {
                                ele = layetElement.getElementsByClassName(this.selectionType + 'selectionMapStyle')[0];
                                removeClass(ele);
                                const selectedElementIdIndex: number = this.maps.selectedElementId.indexOf(ele.getAttribute('id'));
                                this.maps.selectedElementId.splice(selectedElementIdIndex, 1);
                            }
                        }
                        if (ele.id.indexOf('NavigationIndex') > -1) {
                            const index: number = parseInt(targetElement.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                            const layerIndex: number = parseInt(targetElement.parentElement.id.split('_LayerIndex_')[1].split('_')[0], 10);
                            ele.setAttribute('stroke-width', this.maps.layers[layerIndex as number].navigationLineSettings[index as number].width.toString());
                            ele.setAttribute('stroke', this.maps.layers[layerIndex as number].navigationLineSettings[index as number].color);
                        }
                    }
                    if (!isLineStringShape) {
                        if (!getElement(this.selectionType + 'selectionMap')) {
                            document.body.appendChild(createStyle(this.selectionType + 'selectionMap',
                                                                  this.selectionType + 'selectionMapStyle', eventArgs));
                        } else {
                            customizeStyle(this.selectionType + 'selectionMap', this.selectionType + 'selectionMapStyle', eventArgs);
                        }
                        targetElement.setAttribute('class', this.selectionType + 'selectionMapStyle');
                    } else {
                        if (!getElement('LineselectionMap')) {
                            document.body.appendChild(createStyle('LineselectionMap', 'LineselectionMapStyle', eventArgs));
                        } else {
                            customizeStyle('LineselectionMap', 'LineselectionMapStyle', eventArgs);
                        }
                        targetElement.setAttribute('class', 'LineselectionMapStyle');
                    }
                    if (targetElement.getAttribute('class') === 'ShapeselectionMapStyle') {
                        this.maps.shapeSelectionClass = getElement(this.selectionType + 'selectionMap');
                        this.maps.selectedElementId.push(targetElement.getAttribute('id'));
                        this.maps.shapeSelectionItem.push(eventArgs.shapeData);
                    }
                    if (targetElement.getAttribute('class') === 'MarkerselectionMapStyle') {
                        this.maps.markerSelectionClass = getElement(this.selectionType + 'selectionMap');
                        this.maps.selectedMarkerElementId.push(targetElement.getAttribute('id'));
                    }
                    if (targetElement.getAttribute('class') === 'BubbleselectionMapStyle') {
                        this.maps.bubbleSelectionClass = getElement(this.selectionType + 'selectionMap');
                        this.maps.selectedBubbleElementId.push(targetElement.getAttribute('id'));
                    }
                    if (targetElement.getAttribute('class') === 'navigationlineselectionMapStyle') {
                        this.maps.navigationSelectionClass = getElement(this.selectionType + 'selectionMap');
                        this.maps.selectedNavigationElementId.push(targetElement.getAttribute('id'));
                    }
                    if (targetElement.getAttribute('class') === 'PolygonselectionMapStyle') {
                        this.maps.polygonSelectionClass = getElement(this.selectionType + 'selectionMap');
                        this.maps.selectedPolygonElementId.push(targetElement.getAttribute('id'));
                    }
                }
            }
        });
    }
    /**
     * Remove legend selection
     */
    // private removeLegendSelection(legendCollection: Object[], targetElement: Element): void {
    //     let shape: Element;
    //     if (!this.selectionsettings.enableMultiSelect) {
    //        for (let i: number = 0; i < legendCollection.length; i++) {
    //             for (let data of legendCollection[i]['data']) {
    //                 shape = getElement(this.maps.element.id + '_LayerIndex_' + data['layerIndex'] +
    //                            '_shapeIndex_' + data['shapeIndex'] + '_dataIndex_' + data['dataIndex']);
    //                 removeClass(shape);
    //             }
    //         }
    //     }
    // }

    /**
     * Get module name.
     *
     * @param {Element} targetElement - Specifies the target element
     * @returns {void}
     * @private
     */
    public removedSelectionList(targetElement: Element): void {
        if (this.selectionType === 'Shape') {
            this.maps.selectedElementId.splice(this.maps.selectedElementId.indexOf(targetElement.getAttribute('id')), 1);
        }
        if (this.selectionType === 'Bubble') {
            this.maps.selectedBubbleElementId.splice(this.maps.selectedBubbleElementId.indexOf(targetElement.getAttribute('id')), 1);
        }
        if (this.selectionType === 'Marker') {
            this.maps.selectedMarkerElementId.splice(this.maps.selectedMarkerElementId.indexOf(targetElement.getAttribute('id')), 1);
        }
        if (this.selectionType === 'navigationline') {
            this.maps.selectedBubbleElementId.splice(this.maps.selectedBubbleElementId.indexOf(targetElement.getAttribute('id')), 1);
        }
        if (this.selectionType === 'Polygon') {
            this.maps.selectedPolygonElementId.splice(this.maps.selectedPolygonElementId.indexOf(targetElement.getAttribute('id')), 1);
        }
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name
     */
    protected getModuleName(): string {
        return 'Selection';
    }

    /**
     * To destroy the selection.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.selectionsettings = null;
        this.removeEventListener();
        this.maps = null;
    }
}
