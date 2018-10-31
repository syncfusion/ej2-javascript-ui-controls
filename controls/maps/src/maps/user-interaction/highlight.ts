import { Maps } from '../../index';
import { HighlightSettingsModel, ISelectionEventArgs, itemHighlight } from '../index';
import { Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getElementsByClassName, getElement, removeClass, createStyle, customizeStyle, getTargetElement } from '../utils/helper';
/**
 * Highlight module class
 */
/* tslint:disable:no-string-literal */
export class Highlight {
    private maps: Maps;
    private highlightSettings: HighlightSettingsModel;
    constructor(maps: Maps) {
        this.maps = maps;
        this.addEventListener();
    }
    /**
     * To bind events for highlight module
     */
    private addEventListener(): void {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.maps.on(Browser.touchStartEvent, this.mouseMove, this);
    }
    /**
     * To unbind events for highlight module
     */
    private removeEventListener(): void {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.off(Browser.touchMoveEvent, this.mouseMove);
        this.maps.off(Browser.touchStartEvent, this.mouseMove);
    }
    /**
     * Public method for highlight module
     */
    public addHighlight(layerIndex: number, name: string, enable: boolean): void {
        let targetEle: Element = getTargetElement(layerIndex, name, enable, this.maps);
        if (enable) {
            this.mapHighlight(targetEle, null, null);
        } else {
            removeClass(targetEle);
        }
    }
    private mouseMove(e: PointerEvent): void {
        let targetEle: Element = <Element>e.target;
        let layerIndex: number;
        let isTouch: boolean = e.pointerType === 'touch' || e.pointerType === '2' || (e.type.indexOf('touch') > -1);
        if ((targetEle.id.indexOf('LayerIndex') !== -1 || targetEle.id.indexOf('NavigationIndex') > -1) &&
            targetEle.getAttribute('class') !== 'ShapeselectionMapStyle' && !isTouch) {
            layerIndex = parseInt(targetEle.id.split('_LayerIndex_')[1].split('_')[0], 10);
            let shapeData: object;
            let data: object;
            let shapeIn: number;
            let dataIndex: number;
            if (targetEle.id.indexOf('ShapeIndex') > -1) {
                shapeIn = parseInt(targetEle.id.split('_ShapeIndex_')[1].split('_')[0], 10);
                shapeData = this.maps.layers[layerIndex].shapeData['features'] ?
                    this.maps.layers[layerIndex].shapeData['features'][shapeIn]['properties'] : null;
                dataIndex = parseInt(targetEle.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = isNullOrUndefined(dataIndex) ? null : this.maps.layers[layerIndex].dataSource[dataIndex];
                this.highlightSettings = this.maps.layers[layerIndex].highlightSettings;
            } else if (targetEle.id.indexOf('BubbleIndex') > -1) {
                let bubble: number = parseInt(targetEle.id.split('_BubbleIndex_')[1].split('_')[0], 10);
                dataIndex = parseInt(targetEle.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex].bubbleSettings[bubble].dataSource[dataIndex];
                this.highlightSettings = this.maps.layers[layerIndex].bubbleSettings[bubble].highlightSettings;
            } else if (targetEle.id.indexOf('MarkerIndex') > -1) {
                let marker: number = parseInt(targetEle.id.split('_MarkerIndex_')[1].split('_')[0], 10);
                dataIndex = parseInt(targetEle.id.split('_DataIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex].markerSettings[marker].dataSource[dataIndex];
                this.highlightSettings = this.maps.layers[layerIndex].markerSettings[marker].highlightSettings;
            } else {
                let index: number = parseInt(targetEle.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                layerIndex = parseInt(targetEle.id.split('_LayerIndex_')[1].split('_')[0], 10);
                shapeData = null;
                data = {
                    latitude: this.maps.layers[layerIndex].navigationLineSettings[index].latitude,
                    longitude: this.maps.layers[layerIndex].navigationLineSettings[index].longitude
                };
                this.highlightSettings = this.maps.layers[layerIndex].navigationLineSettings[index].highlightSettings;
            }
            if (this.highlightSettings.enable) {
                this.mapHighlight(targetEle, shapeData, data);
            } else {
                let element: Element = document.getElementsByClassName('highlightMapStyle')[0];
                if (!isNullOrUndefined(element)) {
                    removeClass(element);
                    if (element.id.indexOf('NavigationIndex') > -1) {
                        let index: number = parseInt(element.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                        let layerIndex: number = parseInt(element.parentElement.id.split('_layerIndex_')[1].split('_')[0], 10);
                        element.setAttribute(
                            'stroke-width', this.maps.layers[layerIndex].navigationLineSettings[index].width.toString());
                        element.setAttribute('stroke', this.maps.layers[layerIndex].navigationLineSettings[index].color);
                    }
                }
            }
        } else if (getElementsByClassName('highlightMapStyle').length > 0) {
            targetEle = <Element>getElementsByClassName('highlightMapStyle')[0];
            if (targetEle.id.indexOf('NavigationIndex') > -1) {
                let index: number = parseInt(targetEle.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                layerIndex = parseInt(targetEle.parentElement.id.split('_layerIndex_')[1].split('_')[0], 10);
                targetEle.setAttribute('stroke-width', this.maps.layers[layerIndex].navigationLineSettings[index].width.toString());
                targetEle.setAttribute('stroke', this.maps.layers[layerIndex].navigationLineSettings[index].color);
            }
            removeClass(targetEle);
        }
    }
    private mapHighlight(targetEle: Element, shapeData: object, data: object): void {
        let eventArgs: ISelectionEventArgs = {
            opacity: this.highlightSettings.opacity,
            fill: targetEle.id.indexOf('NavigationIndex') === -1 ? this.highlightSettings.fill : 'none',
            border: { color: this.highlightSettings.border.color, width: this.highlightSettings.border.width },
            name: itemHighlight,
            target: targetEle.id,
            cancel: false,
            shapeData: shapeData,
            data: data
        };
        this.maps.trigger(itemHighlight, eventArgs);
        this.highlightMap(targetEle, eventArgs);
    }
    private highlightMap(targetEle: Element, eventArgs: ISelectionEventArgs): void {
        let parentElement: Element;
        let children: HTMLCollection;
        if (targetEle.getAttribute('class') === 'highlightMapStyle') {
            return;
        } else {
            if (getElementsByClassName('highlightMapStyle').length > 0) {
                let elem: Element = <Element>getElementsByClassName('highlightMapStyle')[0];
                removeClass(elem);
                if (elem.id.indexOf('NavigationIndex') > -1) {
                    let index: number = parseInt(elem.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                    let layerIndex: number = parseInt(elem.parentElement.id.split('_layerIndex_')[1].split('_')[0], 10);
                    elem.setAttribute('stroke-width', this.maps.layers[layerIndex].navigationLineSettings[index].width.toString());
                    elem.setAttribute('stroke', this.maps.layers[layerIndex].navigationLineSettings[index].color);
                }
            }
            if (!getElement('highlightMap')) {
                document.body.appendChild(createStyle('highlightMap', 'highlightMapStyle', eventArgs));
            } else {
                customizeStyle('highlightMap', 'highlightMapStyle', eventArgs);
            }
            targetEle.setAttribute('stroke-width', eventArgs.border.width.toString());
            targetEle.setAttribute('stroke', eventArgs.border.color);
            targetEle.setAttribute('class', 'highlightMapStyle');
        }
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'Highlight';
    }

    /**
     * To destroy the highlight. 
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