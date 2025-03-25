import { Maps } from '../../index';
import { HighlightSettingsModel, ISelectionEventArgs, itemHighlight, shapeHighlight, IShapeSelectedEventArgs } from '../index';
import { Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getElementsByClassName, getElement, removeClass, createStyle, customizeStyle, getTargetElement } from '../utils/helper';
/**
 * Highlight module class
 */

export class Highlight {
    private maps: Maps;
    /**
     * @private
     */
    public highlightSettings: HighlightSettingsModel;
    constructor(maps: Maps) {
        this.maps = maps;
        this.addEventListener();
    }
    /**
     * To bind events for highlight module.
     *
     * @returns {void}
     */
    private addEventListener(): void {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.maps.on(Browser.touchStartEvent, this.mouseMove, this);
    }
    /**
     * To unbind events for highlight module.
     *
     * @returns {void}
     * @private
     */
    public removeEventListener(): void {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.off(Browser.touchMoveEvent, this.mouseMove);
        this.maps.off(Browser.touchStartEvent, this.mouseMove);
    }
    /**
     * Public method for highlight module.
     *
     * @param {number} layerIndex - Specifies the index of the layer.
     * @param {string} name - Specifies the name.
     * @param {boolean} enable - Specifies the enabling of highlight in map.
     * @returns {void}
     * @private
     */
    public addHighlight(layerIndex: number, name: string, enable: boolean): void {
        const targetEle: Element = getTargetElement(layerIndex, name, enable, this.maps);
        if (enable) {
            this.mapHighlight(targetEle, null, null);
        } else {
            removeClass(targetEle);
        }
    }
    private mouseMove(e: PointerEvent): void {
        let targetEle: Element = <Element>e.target;
        let layerIndex: number;
        const isTouch: boolean = e.pointerType === 'touch' || e.pointerType === '2' || (e.type.indexOf('touch') > -1);
        if ((targetEle.id.indexOf('LayerIndex') !== -1 || targetEle.id.indexOf('NavigationIndex') > -1) &&
            targetEle.getAttribute('class') !== 'ShapeselectionMapStyle' && !isTouch &&
            targetEle.getAttribute('class') !== 'MarkerselectionMapStyle' &&
            targetEle.getAttribute('class') !== 'BubbleselectionMapStyle' &&
            targetEle.getAttribute('class') !== 'navigationlineselectionMapStyle' &&
            targetEle.getAttribute('class') !== 'PolygonselectionMapStyle' &&
            targetEle.getAttribute('class') !== 'LineselectionMapStyle') {
            layerIndex = parseInt(targetEle.id.split('_LayerIndex_')[1].split('_')[0], 10);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let shapeData: any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let data: any;
            let shapeIn: number;
            let dataIndex: number;
            if (targetEle.id.indexOf('shapeIndex') > -1) {
                shapeIn = parseInt(targetEle.id.split('_shapeIndex_')[1].split('_')[0], 10);
                shapeData = this.maps.layers[layerIndex as number].shapeData['features'] &&
                !isNullOrUndefined(this.maps.layersCollection[layerIndex as number].layerData[shapeIn as number]) ?
                    this.maps.layersCollection[layerIndex as number].layerData[shapeIn as number]['property'] : null;
                dataIndex = parseInt(targetEle.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = isNullOrUndefined(dataIndex) ? null : this.maps.layers[layerIndex as number].dataSource[dataIndex as number];
                this.highlightSettings = this.maps.layers[layerIndex as number].highlightSettings;
            } else if (targetEle.id.indexOf('BubbleIndex') > -1) {
                const bubble: number = parseInt(targetEle.id.split('_BubbleIndex_')[1].split('_')[0], 10);
                dataIndex = parseInt(targetEle.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex as number].bubbleSettings[bubble as number].dataSource[dataIndex as number];
                this.highlightSettings = this.maps.layers[layerIndex as number].bubbleSettings[bubble as number].highlightSettings;
            } else if (targetEle.id.indexOf('MarkerIndex') > -1) {
                const marker: number = parseInt(targetEle.id.split('_MarkerIndex_')[1].split('_')[0], 10);
                dataIndex = parseInt(targetEle.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex as number].markerSettings[marker as number].dataSource[dataIndex as number];
                this.highlightSettings = this.maps.layers[layerIndex as number].markerSettings[marker as number].highlightSettings;
            } else if (targetEle.id.indexOf('_PolygonIndex_') > -1) {
                dataIndex = parseInt(targetEle.id.split('_PolygonIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex as number].polygonSettings.polygons[dataIndex as number].points;
                this.highlightSettings = this.maps.layers[layerIndex as number].polygonSettings.highlightSettings;
            } else {
                const index: number = parseInt(targetEle.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                layerIndex = parseInt(targetEle.id.split('_LayerIndex_')[1].split('_')[0], 10);
                shapeData = null;
                data = {
                    latitude: this.maps.layers[layerIndex as number].navigationLineSettings[index as number].latitude,
                    longitude: this.maps.layers[layerIndex as number].navigationLineSettings[index as number].longitude
                };
                this.highlightSettings = this.maps.layers[layerIndex as number].navigationLineSettings[index as number].highlightSettings;
            }
            if (this.highlightSettings.enable) {
                this.handleHighlight(targetEle, layerIndex, data, shapeData);
            } else {
                const element: Element = document.getElementsByClassName('highlightMapStyle')[0];
                if (!isNullOrUndefined(element)) {
                    removeClass(element);
                    if (element.id.indexOf('NavigationIndex') > -1) {
                        const index: number = parseInt(element.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                        const layerIndex: number = parseInt(element.parentElement.id.split('_LayerIndex_')[1].split('_')[0], 10);
                        element.setAttribute(
                            'stroke-width', this.maps.layers[layerIndex as number].navigationLineSettings[index as number].width.toString());
                        element.setAttribute('stroke', this.maps.layers[layerIndex as number].navigationLineSettings[index as number].color);
                    }
                }
            }
        } else if (getElementsByClassName('highlightMapStyle').length > 0) {
            targetEle = <Element>getElementsByClassName('highlightMapStyle')[0];
            if (targetEle.id.indexOf('NavigationIndex') > -1) {
                const index: number = parseInt(targetEle.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                layerIndex = parseInt(targetEle.parentElement.id.split('_LayerIndex_')[1].split('_')[0], 10);
                targetEle.setAttribute('stroke-width', this.maps.layers[layerIndex as number].navigationLineSettings[index as number].width.toString());
                targetEle.setAttribute('stroke', this.maps.layers[layerIndex as number].navigationLineSettings[index as number].color);
            }
            removeClass(targetEle);
            if (this.maps.legendSettings.visible && this.maps.legendModule) {
                this.maps.legendModule.removeShapeHighlightCollection();
            }
        } else if ((targetEle.id.indexOf(this.maps.element.id + '_Legend_Shape_Index') !== -1 ||
            targetEle.id.indexOf(this.maps.element.id + '_Legend_Index') !== -1) && this.maps.legendModule &&
            this.maps.legendSettings.visible && targetEle.id.indexOf('_Text') === -1) {
            this.maps.legendModule.legendHighLightAndSelection(targetEle, 'highlight');
        } else {
            if (this.maps.legendSettings.visible && this.maps.legendModule) {
                this.maps.legendModule.removeLegendHighlightCollection();
            }
        }
    }

    /**
     * Handles the highlighting events in map.
     *
     * @param {Element} targetElement - Specifies the target element.
     * @param {number} layerIndex - Specifies the index of the layer.
     * @param {object} data - Specifies the data for the map.
     * @param {object} shapeData - Specifies the data for the map to render.
     * @returns {void}
     * @private
     */
    public handleHighlight(targetElement: Element, layerIndex: number, data: object, shapeData: object): void {
        if (this.maps.legendSettings.visible && targetElement.id.indexOf('_MarkerIndex_') === -1 && this.maps.legendModule
            && this.maps.legendSettings.type === 'Layers') {
            this.maps.legendModule.shapeHighLightAndSelection(
                targetElement, data, this.highlightSettings, 'highlight', layerIndex);
        }
        const selectHighLight: boolean = targetElement.id.indexOf('shapeIndex') > -1 && (this.maps.legendSettings.visible && this.maps.legendModule) ?
            this.maps.legendModule.shapeToggled : true;
        if (selectHighLight) {
            this.mapHighlight(targetElement, shapeData, data);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapHighlight(targetEle: Element, shapeData: any, data: any): void {
        const layerIndex: number = parseInt(targetEle.id.split('_LayerIndex_')[1].split('_')[0], 10);
        let isMarkerSelect: boolean = false;
        if (targetEle.id.indexOf('MarkerIndex') > -1) {
            const marker: number = parseInt(targetEle.id.split('_MarkerIndex_')[1].split('_')[0], 10);
            isMarkerSelect = this.maps.layers[layerIndex as number].markerSettings[marker as number].highlightSettings.enable;
        }
        const borderColor: string = (targetEle.parentElement.id.indexOf('LineString') === -1) ? this.highlightSettings.border.color : (this.highlightSettings.fill || this.highlightSettings.border.color);
        const borderWidth: number = (targetEle.parentElement.id.indexOf('LineString') === -1) ? (this.highlightSettings.border.width / (isMarkerSelect ? 1 : this.maps.scale)) : (this.highlightSettings.border.width / this.maps.scale);
        const borderOpacity: number = isNullOrUndefined(this.highlightSettings.border.opacity) ? this.highlightSettings.opacity :
            this.highlightSettings.border.opacity;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eventArgs: any = {
            opacity: this.highlightSettings.opacity,
            fill: (targetEle.parentElement.id.indexOf('LineString') === -1) ? (targetEle.id.indexOf('NavigationIndex') === -1 ? !isNullOrUndefined(this.highlightSettings.fill)
                ? this.highlightSettings.fill : targetEle.getAttribute('fill') : 'none') : 'transparent',
            border: { color: borderColor, width: borderWidth, opacity: borderOpacity },
            cancel: false
        };
        const shapeEventArgs: IShapeSelectedEventArgs = {
            opacity: eventArgs.opacity,
            fill: eventArgs.fill,
            border: { color: borderColor, width: borderWidth, opacity: borderOpacity },
            name: shapeHighlight,
            target: targetEle.id,
            cancel: false,
            shapeData: shapeData,
            data: data,
            maps: this.maps
        };
        if (targetEle.id.indexOf('shapeIndex') > -1) {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            this.maps.trigger(shapeHighlight, shapeEventArgs, () => { });
        }
        const itemEventArgs: ISelectionEventArgs = {
            opacity: eventArgs.opacity,
            fill: eventArgs.fill,
            border: { color: borderColor, width: borderWidth, opacity: borderOpacity },
            name: itemHighlight,
            target: targetEle.id,
            cancel: false,
            shapeData: shapeData,
            data: data,
            maps: this.maps
        };
        this.maps.trigger(itemHighlight, itemEventArgs, () => {
            itemEventArgs.cancel = eventArgs.cancel !== itemEventArgs.cancel ? itemEventArgs.cancel : targetEle.id.indexOf('shapeIndex') > -1 ? shapeEventArgs.cancel : eventArgs.cancel;
            itemEventArgs.fill = eventArgs.fill !== itemEventArgs.fill ? itemEventArgs.fill : targetEle.id.indexOf('shapeIndex') > -1 ? shapeEventArgs.fill : eventArgs.fill;
            itemEventArgs.opacity = eventArgs.opacity !== itemEventArgs.opacity ? itemEventArgs.opacity : targetEle.id.indexOf('shapeIndex') > -1 ? shapeEventArgs.opacity : eventArgs.opacity;
            itemEventArgs.border.color = eventArgs.border.color !== itemEventArgs.border.color ? itemEventArgs.border.color : targetEle.id.indexOf('shapeIndex') > -1 ? shapeEventArgs.border.color : eventArgs.border.color;
            itemEventArgs.border.width = eventArgs.border.width !== itemEventArgs.border.width ? itemEventArgs.border.width : targetEle.id.indexOf('shapeIndex') > -1 ? shapeEventArgs.border.width : eventArgs.border.width;
            itemEventArgs.border.opacity = eventArgs.border.opacity !== itemEventArgs.border.opacity ? itemEventArgs.border.opacity : targetEle.id.indexOf('shapeIndex') > -1 ? shapeEventArgs.border.opacity : eventArgs.border.opacity;
            this.highlightMap(targetEle, itemEventArgs);
        });
    }
    private highlightMap(targetEle: Element, eventArgs: ISelectionEventArgs): void {
        if (targetEle.getAttribute('class') === 'highlightMapStyle' || eventArgs.cancel) {
            return;
        } else {
            if (getElementsByClassName('highlightMapStyle').length > 0) {
                const elem: Element = <Element>getElementsByClassName('highlightMapStyle')[0];
                removeClass(elem);
                if (elem.id.indexOf('NavigationIndex') > -1) {
                    const index: number = parseInt(elem.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                    const layerIndex: number = parseInt(elem.parentElement.id.split('_LayerIndex_')[1].split('_')[0], 10);
                    elem.setAttribute('stroke-width', this.maps.layers[layerIndex as number].navigationLineSettings[index as number].width.toString());
                    elem.setAttribute('stroke', this.maps.layers[layerIndex as number].navigationLineSettings[index as number].color);
                }
            }
            if (!getElement('highlightMap')) {
                document.body.appendChild(createStyle('highlightMap', 'highlightMapStyle', eventArgs));
            } else {
                customizeStyle('highlightMap', 'highlightMapStyle', eventArgs);
            }
            targetEle.setAttribute('class', 'highlightMapStyle');
        }
    }
    /**
     * Get module name.
     *
     * @returns {string} - Specifies the module name
     */
    protected getModuleName(): string {
        return 'Highlight';
    }

    /**
     * To destroy the highlight.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.highlightSettings = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(this.maps as any).refreshing) {
            this.maps = null;
        }
    }
}
