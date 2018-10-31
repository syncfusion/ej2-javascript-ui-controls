import { Maps } from '../../index';
import { SelectionSettingsModel, click, ISelectionEventArgs, itemSelection } from '../index';
import { getElementsByClassName, getElement, createStyle, customizeStyle, removeClass, getTargetElement } from '../utils/helper';
import { isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
/**
 * Selection module class
 */
export class Selection {
    private maps: Maps;
    private selectionsettings: SelectionSettingsModel;
    private selectionType: string;
    /* tslint:disable:no-string-literal */
    constructor(maps: Maps) {
        this.maps = maps;
        this.addEventListener();
    }
    /**
     * For binding events to selection module
     */
    private addEventListener(): void {
        if (!this.maps.isDestroyed) {
            this.maps.on(click, this.mouseClick, this);
            this.maps.on(Browser.touchEndEvent, this.mouseClick, this);
        }
    }
    /** 
     * For removing events from selection modue
     */
    private removeEventListener(): void {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.off(click, this.mouseClick);
        this.maps.off(Browser.touchEndEvent, this.mouseClick);
    }
    private mouseClick(targetEle: Element): void {
        if (!isNullOrUndefined(targetEle['type']) && targetEle['type'].indexOf('touch') !== -1 && isNullOrUndefined(targetEle.id)) {
            targetEle = targetEle['target'];
        }
        if (!isNullOrUndefined(targetEle.id) && (targetEle.id.indexOf('LayerIndex') > -1 || targetEle.id.indexOf('NavigationIndex') > -1)) {
            let layerIndex: number;
            let shapeData: object;
            let data: object;
            let shapeIndex: number;
            let dataIndex: number;
            layerIndex = parseInt(targetEle.id.split('_LayerIndex_')[1].split('_')[0], 10);
            if (targetEle.id.indexOf('ShapeIndex') > -1) {
                shapeIndex = parseInt(targetEle.id.split('_ShapeIndex_')[1].split('_')[0], 10);
                shapeData = this.maps.layers[layerIndex].shapeData['features'] ?
                this.maps.layers[layerIndex].shapeData['features'][shapeIndex]['properties'] : null;
                dataIndex = parseInt(targetEle.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = isNullOrUndefined(dataIndex) ? null : this.maps.layers[layerIndex].dataSource[dataIndex];
                this.selectionsettings = this.maps.layers[layerIndex].selectionSettings;
                this.selectionType = 'Shape';
            }else if (targetEle.id.indexOf('BubbleIndex') > -1) {
                let bubbleIndex: number = parseInt(targetEle.id.split('_BubbleIndex_')[1].split('_')[0], 10);
                dataIndex = parseInt(targetEle.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex].bubbleSettings[bubbleIndex].dataSource[dataIndex];
                this.selectionsettings = this.maps.layers[layerIndex].bubbleSettings[bubbleIndex].selectionSettings;
                this.selectionType = 'Bubble';
            }else if (targetEle.id.indexOf('MarkerIndex') > -1) {
                let markerIndex: number = parseInt(targetEle.id.split('_MarkerIndex_')[1].split('_')[0], 10);
                dataIndex = parseInt(targetEle.id.split('_DataIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex].markerSettings[markerIndex].dataSource[dataIndex];
                this.selectionsettings = this.maps.layers[layerIndex].markerSettings[markerIndex].selectionSettings;
                this.selectionType = 'Marker';
            }else {
                let index: number = parseInt(targetEle.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                shapeData = null;
                data = {
                    latitude: this.maps.layers[layerIndex].navigationLineSettings[index].latitude,
                    longitude: this.maps.layers[layerIndex].navigationLineSettings[index].longitude
                };
                this.selectionsettings = this.maps.layers[layerIndex].navigationLineSettings[index].selectionSettings;
                this.selectionType = 'navigationline';
            }
            if (this.selectionsettings.enable) {
                this.selectMap(targetEle, shapeData, data);
            }
        }
    }
    /**
     * Public method for selection
     */
    public addSelection(layerIndex: number, name: string, enable: boolean): void {
        let targetEle: Element = getTargetElement(layerIndex, name, enable, this.maps);
        if (enable) {
            this.selectMap(targetEle, null, null);
        }else {
            removeClass(targetEle);
        }
    }
    /**
     * Method for selection
     */
    private selectMap(targetEle: Element, shapeData: object, data: object): void {
        let parentElement: Element;
        let children: HTMLCollection;
        let selectionsettings: SelectionSettingsModel = this.selectionsettings;
        let eventArgs: ISelectionEventArgs = {
            opacity: this.selectionsettings.opacity,
            fill: this.selectionType !== 'navigationline' ? this.selectionsettings.fill : 'none',
            border: { color: this.selectionsettings.border.color, width: this.selectionsettings.border.width},
            name: itemSelection,
            target: targetEle.id,
            cancel: false,
            shapeData: shapeData,
            data: data
        };
        this.maps.trigger(itemSelection, eventArgs);
        // if (this.maps.legendSettings.visible && !this.maps.legendSettings.toggleVisibility && this.maps.legendSettings.legendSelection) {
        //     this.removeLegendSelection(this.maps.legendModule.legendCollection, targetEle);
        // }
        if (targetEle.getAttribute('class') === this.selectionType + 'selectionMapStyle') {
                removeClass(targetEle);
                if (targetEle.id.indexOf('NavigationIndex') > -1) {
                    let index: number = parseInt(targetEle.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                    let layerIndex: number = parseInt(targetEle.parentElement.id.split('_layerIndex_')[1].split('_')[0], 10);
                    targetEle.setAttribute('stroke-width', this.maps.layers[layerIndex].navigationLineSettings[index].width.toString());
                    targetEle.setAttribute('stroke', this.maps.layers[layerIndex].navigationLineSettings[index].color );
                }
        }else {
            if (!this.selectionsettings.enableMultiSelect && getElementsByClassName(this.selectionType + 'selectionMapStyle').length > 0) {
                let ele: Element = getElementsByClassName(this.selectionType + 'selectionMapStyle')[0];
                removeClass(ele);
                if (ele.id.indexOf('NavigationIndex') > -1) {
                    let index: number = parseInt(targetEle.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                    let layerIndex: number = parseInt(targetEle.parentElement.id.split('_layerIndex_')[1].split('_')[0], 10);
                    ele.setAttribute('stroke-width', this.maps.layers[layerIndex].navigationLineSettings[index].width.toString());
                    ele.setAttribute('stroke', this.maps.layers[layerIndex].navigationLineSettings[index].color );
                }
            }
            if (!getElement(this.selectionType + 'selectionMap')) {
                document.body.appendChild(
                    createStyle(this.selectionType + 'selectionMap', this.selectionType + 'selectionMapStyle', eventArgs));
            }else {
                customizeStyle(this.selectionType + 'selectionMap', this.selectionType + 'selectionMapStyle', eventArgs);
            }
            targetEle.setAttribute('stroke-width', eventArgs.border.width.toString());
            targetEle.setAttribute('stroke', eventArgs.border.color);
            targetEle.setAttribute('class', this.selectionType + 'selectionMapStyle');
        }
    }
    /**
     * Remove legend selection
     */
    // private removeLegendSelection(legendCollection: Object[], targetEle: Element): void {
    //     let shape: Element;
    //     if (!this.selectionsettings.enableMultiSelect) {
    //        for (let i: number = 0; i < legendCollection.length; i++) {
    //             for (let data of legendCollection[i]['data']) {
    //                 shape = getElement(this.maps.element.id + '_LayerIndex_' + data['layerIndex'] +
    //                            '_ShapeIndex_' + data['shapeIndex'] + '_dataIndex_' + data['dataIndex']);
    //                 removeClass(shape);
    //             }
    //         }
    //     }
    // }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'Selection';
    }

    /**
     * To destroy the selection. 
     * @return {void}
     * @private
     */
    public destroy(maps: Maps): void {
        /**
         * Destroy method performed here
         */
        this.removeEventListener();
    }
}