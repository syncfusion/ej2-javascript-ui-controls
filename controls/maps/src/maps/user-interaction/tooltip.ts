/* eslint-disable @typescript-eslint/no-unused-vars */
import { Maps, ITooltipRenderEventArgs, tooltipRender, MapsTooltipOption, ITooltipRenderCompleteEventArgs } from '../index';
import { Tooltip } from '@syncfusion/ej2-svg-base';
import { createElement, Browser, isNullOrUndefined, extend, remove } from '@syncfusion/ej2-base';
import { TooltipSettingsModel, LayerSettings, MarkerSettingsModel, BubbleSettingsModel } from '../index';
import { MapLocation, getMousePosition, Internalize, checkPropertyPath, getValueFromObject,
    formatValue, convertStringToValue } from '../utils/helper';
import { click } from '../model/constants';
/**
 * Map Tooltip
 */
export class MapsTooltip {
    private maps: Maps;
    private tooltipSettings: TooltipSettingsModel;
    /**
     * @private
     */
    public svgTooltip: Tooltip;
    private isTouch: boolean;
    private tooltipId: string;
    private currentTime: number;
    private clearTimeout: number;
    public tooltipTargetID: string;
    constructor(maps: Maps) {
        this.maps = maps;
        this.tooltipId = this.maps.element.id + '_mapsTooltip';
        this.addEventListener();
    }

    public renderTooltip(e: PointerEvent): void {
        let pageX: number; let pageY: number;
        let target: Element; let touchArg: TouchEvent;
        let tooltipArgs: ITooltipRenderEventArgs; let tooltipTemplateElement: HTMLElement;
        if (e.type.indexOf('touch') !== - 1) {
            this.isTouch = true;
            touchArg = <TouchEvent & PointerEvent>e;
            pageX = touchArg.changedTouches[0].pageX;
            pageY = touchArg.changedTouches[0].pageY;
            target = <Element>touchArg.target;
        } else {
            this.isTouch = e.pointerType === 'touch';
            pageX = e.pageX;
            pageY = e.pageY;
            target = <Element>e.target;
        }
        let option: TooltipSettingsModel;
        let currentData: string = '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const targetId: string = target.id; const item: any = {};
        let tooltipEle: HTMLElement;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let templateData: any = [];
        let keyString: string;
        let index: number = targetId.indexOf('_LayerIndex_') > -1 && parseFloat(targetId.split('_LayerIndex_')[1].split('_')[0]);
        const layer: LayerSettings = <LayerSettings>this.maps.layersCollection[index];
        const tooltipContent: string[] = []; let markerFill: string;
        const location: MapLocation = getMousePosition(pageX, pageY, this.maps.svgObject);
        this.tooltipTargetID = targetId;
        const istooltipRender: boolean = (targetId.indexOf('_shapeIndex_') > -1)
            || (targetId.indexOf('_MarkerIndex_') > -1) || (targetId.indexOf('_BubbleIndex_') > -1);
        if (istooltipRender) {
            if (targetId.indexOf('_shapeIndex_') > -1) {
                option = layer.tooltipSettings;
                option.textStyle.fontFamily = this.maps.themeStyle.fontFamily || option.textStyle.fontFamily;
                option.textStyle.opacity = this.maps.themeStyle.tooltipTextOpacity || option.textStyle.opacity;
                const shape: number = parseInt(targetId.split('_shapeIndex_')[1].split('_')[0], 10);
                if (isNullOrUndefined(layer.layerData) || isNullOrUndefined(layer.layerData[shape])) {
                    return;
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const value: any = layer.layerData[shape]['property']; let isShape: boolean = false;
                const properties: string[] = (Object.prototype.toString.call(layer.shapePropertyPath) === '[object Array]' ?
                    layer.shapePropertyPath : [layer.shapePropertyPath]) as string[];
                if (!isNullOrUndefined(properties)) {
                    for (let k: number = 0; k < properties.length; k++) {
                        for (let i: number = 0; i < layer['dataSource']['length']; i++) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const data: any[] = layer.dataSource[i];
                            const dataPath: string = (layer.shapeDataPath.indexOf('.') > -1 ) ?
                                (getValueFromObject(data, layer.shapeDataPath)) : data[layer.shapeDataPath];
                            const dataPathValue: string = !isNullOrUndefined(dataPath) && isNaN(data[layer.shapeDataPath])
                                ? dataPath.toLowerCase() : dataPath;
                            const propertyValue: string = !isNullOrUndefined(value[properties[k]])
                                && isNaN(value[properties[k]]) ? value[properties[k]].toLowerCase() :
                                value[properties[k]];
                            if (dataPathValue === propertyValue) {
                                isShape = true; index = i;
                                k = properties.length;
                                break;
                            }
                        }
                    }
                    index = isShape ? index : null;
                    if (!isNullOrUndefined(layer.dataSource[index])) {
                        templateData = JSON.parse(JSON.stringify(layer.dataSource[index]));
                        for (keyString in value) {
                            // eslint-disable-next-line no-prototype-builtins
                            if (!templateData.hasOwnProperty(keyString)) {
                                templateData[keyString] = value[keyString];
                            }
                        }
                    }
                }
                if (option.visible && ((!isNullOrUndefined(index) && !isNaN(index)) || (!isNullOrUndefined(value)))) {
                    if (layer.tooltipSettings.format) {
                        currentData = this.formatter(layer.tooltipSettings.format, templateData);
                    } else {
                        const shapePath: string = checkPropertyPath(layer.shapeDataPath, layer.shapePropertyPath, value);
                        currentData = (!isNullOrUndefined(layer.dataSource) && !isNullOrUndefined(index)) ?
                            formatValue(((option.valuePath.indexOf('.') > -1) ?
                                (getValueFromObject(layer.dataSource[index], option.valuePath)) :
                                layer.dataSource[index][option.valuePath]),
                                        this.maps) : value[shapePath];
                        if (isNullOrUndefined(currentData)) {
                            currentData = (option.valuePath.indexOf('.') > -1) ?
                                (getValueFromObject(value, option.valuePath)) : value[option.valuePath];
                        }
                    }
                }
                //location.y = this.template(option, location);

            } else if (targetId.indexOf('_MarkerIndex_') > -1) {
                const markerIdex: number = parseInt(targetId.split('_MarkerIndex_')[1].split('_')[0], 10);
                const dataIndex: number = parseInt(targetId.split('_MarkerIndex_')[1].split('_')[2], 10);
                const marker: MarkerSettingsModel = layer.markerSettings[markerIdex];
                option = marker.tooltipSettings;
                templateData = marker.dataSource[dataIndex];
                if (option.visible && !isNaN(markerIdex)) {
                    if (marker.tooltipSettings.format) {
                        currentData = this.formatter(marker.tooltipSettings.format, marker.dataSource[dataIndex]);
                    } else {
                        if (marker.template && !marker.tooltipSettings.valuePath) {
                            currentData =  marker.template.split('>')[1].split('<')[0];
                        } else {
                            currentData =
                            formatValue(((marker.tooltipSettings.valuePath. indexOf('.') > -1) ?
                                (getValueFromObject(marker.dataSource[dataIndex], marker.tooltipSettings.valuePath)) :
                                marker.dataSource[dataIndex][marker.tooltipSettings.valuePath]),
                                        this.maps
                            ) as string;
                        }
                    }
                }
                //location.y = this.template(option, location);
            } else if (targetId.indexOf('_BubbleIndex_') > -1) {
                const bubbleIndex: number = parseInt(targetId.split('_BubbleIndex_')[1].split('_')[0], 10);
                const dataIndex: number = parseInt(targetId.split('_BubbleIndex_')[1].split('_')[2], 10);
                const bubble: BubbleSettingsModel = layer.bubbleSettings[bubbleIndex];
                option = bubble.tooltipSettings;
                templateData = bubble.dataSource[dataIndex];
                if (option.visible && !isNaN(dataIndex)) {
                    if (bubble.tooltipSettings.format) {
                        currentData = this.formatter(bubble.tooltipSettings.format, bubble.dataSource[dataIndex]);
                    } else {
                        currentData =
                        formatValue(((bubble.tooltipSettings.valuePath.indexOf('.') > -1) ?
                            (getValueFromObject(bubble.dataSource[dataIndex], bubble.tooltipSettings.valuePath)) :
                            bubble.dataSource[dataIndex][bubble.tooltipSettings.valuePath]),
                                    this.maps
                        ) as string;
                    }
                }
                //location.y = this.template(option, location);
            }
            if (document.getElementById(this.tooltipId)) {
                tooltipEle = document.getElementById(this.tooltipId);
            } else {
                tooltipEle = createElement('div', {
                    id: this.maps.element.id + '_mapsTooltip',
                    className: 'EJ2-maps-Tooltip',
                    styles: 'position: absolute;pointer-events:none;'
                });
                document.getElementById(this.maps.element.id + '_Secondary_Element').appendChild(tooltipEle);
            }
            if (option.template !== null && Object.keys(typeof option.template === 'object' ? option.template : {}).length === 1) {
                option.template = option.template[Object.keys(option.template)[0]];
            }
            templateData = this.setTooltipContent(option, templateData);
            const tooltipOption : MapsTooltipOption = {
                location: location, text: tooltipContent, data: templateData,
                textStyle: option.textStyle,
                template: option.template
            };
            tooltipArgs = {
                cancel: false, name: tooltipRender,
                options: tooltipOption,
                fill: option.fill,
                maps: this.maps,
                element: target, eventArgs: e
            };
            
                this.maps.trigger(tooltipRender, tooltipArgs, (args: ITooltipRenderEventArgs) => {
                    if (!tooltipArgs.cancel && option.visible && !isNullOrUndefined(currentData) &&
                        (targetId.indexOf('_cluster_') === -1 && targetId.indexOf('_dataLabel_') === -1)) {
                        this.maps['isProtectedOnChange'] = true;
                        tooltipArgs.options['textStyle']['color'] = tooltipArgs.options['textStyle']['color']
                            || this.maps.themeStyle.tooltipFontColor;
                        if (tooltipArgs.cancel) {
                            this.svgTooltip = new Tooltip({
                                enable: true,
                                header: '',
                                data: option['data'],
                                template: option['template'],
                                content: [currentData.toString()],
                                shapes: [],
                                location: option['location'],
                                palette: [markerFill],
                                areaBounds: this.maps.mapAreaRect,
                                textStyle: option['textStyle'],
                                availableSize: this.maps.availableSize,
                                fill: option.fill || this.maps.themeStyle.tooltipFillColor
                            });
                        } else {
                            this.svgTooltip = new Tooltip({
                                enable: true,
                                header: '',
                                data: tooltipArgs.options['data'],
                                template: tooltipArgs.options['template'],
                                content: [currentData.toString()],
                                shapes: [],
                                location: tooltipArgs.options['location'],
                                palette: [markerFill],
                                areaBounds: this.maps.mapAreaRect,
                                textStyle: tooltipArgs.options['textStyle'],
                                availableSize: this.maps.availableSize,
                                fill: tooltipArgs.fill || this.maps.themeStyle.tooltipFillColor
                            });
                        }
                        this.svgTooltip.opacity = this.maps.themeStyle.tooltipFillOpacity || this.svgTooltip.opacity;
                        this.svgTooltip.appendTo(tooltipEle);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (this.maps as any).renderReactTemplates();
                        tooltipTemplateElement = document.getElementById(this.maps.element.id + '_mapsTooltip');
                        if (tooltipTemplateElement !== null && tooltipTemplateElement.innerHTML.indexOf('href') !== -1
                            && tooltipTemplateElement.innerHTML.indexOf('</a>') !== -1) {
                            let templateStyle : string = tooltipTemplateElement.getAttribute('style');
                            templateStyle = templateStyle.replace('pointer-events: none;' , 'position-events:all;');
                            tooltipTemplateElement.setAttribute('style', templateStyle);
                        }
                    } else {
                        this.removeTooltip();
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (this.maps as any).clearTemplate();
                    }
                });
			
            if (this.svgTooltip) {
                this.maps.trigger('tooltipRenderComplete', {
                    cancel: false, name: 'tooltipRenderComplete', maps: this.maps, options: tooltipOption,
                    element: this.svgTooltip.element
                } as ITooltipRenderCompleteEventArgs);
            }
            if (this.svgTooltip) {
                this.maps.trigger('tooltipRenderComplete', {
                    cancel: false, name: 'tooltipRenderComplete', maps: this.maps, options: tooltipOption, element: this.svgTooltip.element
                } as ITooltipRenderCompleteEventArgs);
            } else {
                this.removeTooltip();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (this.maps as any).clearTemplate();
            }
        } else {
            tooltipTemplateElement = document.getElementById(this.maps.element.id + '_mapsTooltip');
            if (tooltipTemplateElement !== null && tooltipTemplateElement.innerHTML.indexOf('href') !== -1
                && tooltipTemplateElement.innerHTML.indexOf('</a>') !== -1) {
                this.maps.notify(click, this);
            } else {
                this.removeTooltip();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (this.maps as any).clearTemplate();
            }
        }
    }

    /**
     * To get content for the current toolitp
     *
     * @param {TooltipSettingsModel} options - Specifies the options for rendering tooltip
     * @param {any} templateData - Specifies the template data
     * @returns {any} - Returns the local data
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private setTooltipContent(options: TooltipSettingsModel, templateData: any): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let localData: any = extend({}, templateData, null, true);
        if (this.maps.format && !isNaN(Number(localData[options.valuePath]))) {
            localData[options.valuePath] = Internalize(this.maps, Number(localData[options.valuePath]));
        } else {
            localData = Object.keys(localData).length ? localData : undefined;
        }
        return localData;
    }

    /*private template(tooltip: TooltipSettingsModel, location: MapLocation): number {
        location.y = (tooltip.template) ? location.y + 10 : location.y;
        return location.y;
    }*/
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private formatter(format: string, data: any = {}): string {
        const keys: string[] = Object.keys(data);
        for (const key of keys) {
            format = (typeof data[key] === 'object') ? convertStringToValue('', format, data, this.maps) :
                format.split('${' + key + '}').join(formatValue(data[key], this.maps));
        }
        return format;
    }
    public mouseUpHandler(e: PointerEvent): void {
        this.renderTooltip(e);
        if (this.maps.tooltipDisplayMode === 'MouseMove') {
            clearTimeout(this.clearTimeout);
            this.clearTimeout = setTimeout(this.removeTooltip.bind(this), 2000);
        }
    }

    public removeTooltip(): void {
        if (document.getElementsByClassName('EJ2-maps-Tooltip').length > 0) {
            remove(document.getElementsByClassName('EJ2-maps-Tooltip')[0]);
        }
    }
    // eslint-disable-next-line valid-jsdoc
    /**
     * To bind events for tooltip module
     */
    public addEventListener(): void {
        if (this.maps.isDestroyed) {
            return;
        }
        if (this.maps.tooltipDisplayMode === 'DoubleClick') {
            this.maps.on('dblclick', this.renderTooltip, this);
        } else if (this.maps.tooltipDisplayMode === 'Click') {
            this.maps.on(Browser.touchEndEvent, this.mouseUpHandler, this);
        } else {
            this.maps.on(Browser.touchMoveEvent, this.renderTooltip, this);
        }
        this.maps.element.addEventListener('contextmenu', this.removeTooltip);
        this.maps.on(Browser.touchCancelEvent, this.removeTooltip, this);
    }
    public removeEventListener(): void {
        if (this.maps.isDestroyed) {
            return;
        }
        if (this.maps.tooltipDisplayMode === 'DoubleClick') {
            this.maps.off('dblclick', this.removeTooltip);
        } else if (this.maps.tooltipDisplayMode === 'Click') {
            this.maps.off(Browser.touchEndEvent, this.mouseUpHandler);
        } else {
            this.maps.off(Browser.touchMoveEvent, this.renderTooltip);
        }
        this.maps.off(Browser.touchCancelEvent, this.removeTooltip);
    }
    /**
     * Get module name.
     *
     * @returns {string} Returns the module name
     */
    protected getModuleName(): string {
        return 'MapsTooltip';
    }
    /**
     * To destroy the tooltip.
     *
     * @param {Maps} maps Specifies the maps instance
     * @returns {void}
     * @private
     */
    public destroy(maps: Maps): void {
        this.removeEventListener();
    }
}
