import { Maps, ITooltipRenderEventArgs, tooltipRender, MapsTooltipOption, ITooltipRenderCompleteEventArgs, FontModel, PolygonTooltipSettingsModel, PolygonSettingModel, GeoPosition } from '../index';
import { Tooltip } from '@syncfusion/ej2-svg-base';
import { createElement, Browser, isNullOrUndefined, extend, remove } from '@syncfusion/ej2-base';
import { TooltipSettingsModel, LayerSettings, MarkerSettingsModel, BubbleSettingsModel } from '../index';
import { MapLocation, getMousePosition, Internalize, checkPropertyPath, getValueFromObject,
    formatValue, convertStringToValue } from '../utils/helper';
/**
 * Map Tooltip
 */
export class MapsTooltip {
    private maps: Maps;
    /**
     * @private
     */
    public svgTooltip: Tooltip;
    private isTouch: boolean;
    private tooltipId: string;
    private clearTimeout: number;
    /**
     * @private
     */
    public tooltipTargetID: string;
    constructor(maps: Maps) {
        this.maps = maps;
        this.tooltipId = this.maps.element.id + '_mapsTooltip';
        this.addEventListener();
    }

    /**
     * @param {PointerEvent} e - Specifies the event.
     * @returns {void}
     * @private
     */
    public renderTooltip(e: PointerEvent): void {
        let pageX: number; let pageY: number;
        let target: Element; let touchArg: TouchEvent;
        let tooltipArgs: ITooltipRenderEventArgs;
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
        if (this.maps.isDevice) {
            clearTimeout(this.clearTimeout);
            this.clearTimeout = setTimeout(this.removeTooltip.bind(this), 2000);
        }
        if (target.id.indexOf(this.maps.element.id) === -1) {
            const ancestor: Element = target.closest('.' + this.maps.element.id + '_marker_template_element');
            if (!isNullOrUndefined(ancestor) && ancestor.id.indexOf('_MarkerIndex_') > -1) {
                target = ancestor;
            }
        }
        let option: TooltipSettingsModel;
        let polygonTooltipOption : PolygonTooltipSettingsModel;
        let currentData: string = '';
        const targetId: string = target.id;
        let tooltipEle: HTMLElement;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let templateData: any = [];
        let keyString: string;
        let index: number = targetId.indexOf('_LayerIndex_') > -1 && parseFloat(targetId.split('_LayerIndex_')[1].split('_')[0]);
        const layer: LayerSettings = <LayerSettings>this.maps.layersCollection[index as number];
        const tooltipContent: string[] = []; let markerFill: string;
        const location: MapLocation = getMousePosition(pageX, pageY, this.maps.svgObject);
        this.tooltipTargetID = targetId;
        let polygonTextStyle: FontModel;
        let polygonFill : string;
        let polygon : PolygonSettingModel;
        let latitude: number = null;
        let longitude: number = null;
        const latLongValue: GeoPosition = this.maps.getClickLocation(targetId, e.pageX, e.pageY, (target as HTMLElement), e['layerX'], e['layerY'], 'tooltip');
        if (!isNullOrUndefined(latLongValue)) {
            latitude = latLongValue.latitude;
            longitude = latLongValue.longitude;
        }
        const isPolygon: boolean = targetId.indexOf('_PolygonIndex_') > -1;
        const istooltipRender: boolean = (targetId.indexOf('_shapeIndex_') > -1)
            || (targetId.indexOf('_MarkerIndex_') > -1) || (targetId.indexOf('_BubbleIndex_') > -1)
            || (targetId.indexOf('_PolygonIndex_') > -1);
        if (istooltipRender && this.maps.markerDragArgument === null) {
            if (targetId.indexOf('_PolygonIndex_') > -1) {
                const polygonIndex: number = parseInt(targetId.split('_PolygonIndex_')[1].split('_')[0], 10);
                polygonTooltipOption = layer.polygonSettings.tooltipSettings;
                polygon = layer.polygonSettings.polygons[polygonIndex as number];
                polygonTextStyle = polygonTooltipOption.textStyle;
                polygonFill = polygonTooltipOption.fill;
                tooltipContent.push(polygon.tooltipText);
            } else if (targetId.indexOf('_shapeIndex_') > -1) {
                option = layer.tooltipSettings;
                const shape: number = parseInt(targetId.split('_shapeIndex_')[1].split('_')[0], 10);
                if (isNullOrUndefined(layer.layerData) || isNullOrUndefined(layer.layerData[shape as number])) {
                    return;
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const value: any = layer.layerData[shape as number]['property']; let isShape: boolean = false;
                const properties: string[] = (Object.prototype.toString.call(layer.shapePropertyPath) === '[object Array]' ?
                    layer.shapePropertyPath : [layer.shapePropertyPath]) as string[];
                if (!isNullOrUndefined(properties)) {
                    for (let k: number = 0; k < properties.length; k++) {
                        for (let i: number = 0; i < layer['dataSource']['length']; i++) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const data: any[] = layer.dataSource[i as number];
                            const dataPath: string = (layer.shapeDataPath.indexOf('.') > -1 ) ?
                                (getValueFromObject(data, layer.shapeDataPath)) : data[layer.shapeDataPath];
                            const dataPathValue: string = !isNullOrUndefined(dataPath) && isNaN(data[layer.shapeDataPath])
                                ? dataPath.toLowerCase() : dataPath;
                            const propertyValue: string = !isNullOrUndefined(value[properties[k as number]])
                                && isNaN(value[properties[k as number]]) ? value[properties[k as number]].toLowerCase() :
                                value[properties[k as number]];
                            if (dataPathValue === propertyValue) {
                                isShape = true; index = i;
                                k = properties.length;
                                break;
                            }
                        }
                    }
                    index = isShape ? index : null;
                    if (!isNullOrUndefined(layer.dataSource[index as number])) {
                        templateData = JSON.parse(JSON.stringify(layer.dataSource[index as number]));
                        for (keyString in value) {
                            // eslint-disable-next-line no-prototype-builtins
                            if (!templateData.hasOwnProperty(keyString)) {
                                templateData[keyString as string] = value[keyString as string];
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
                                (getValueFromObject(layer.dataSource[index as number], option.valuePath)) :
                                layer.dataSource[index as number][option.valuePath]),
                                        this.maps) : value[shapePath as string];
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
                const marker: MarkerSettingsModel = layer.markerSettings[markerIdex as number];
                option = marker.tooltipSettings;
                templateData = marker.dataSource[dataIndex as number];
                if (option.visible && !isNaN(markerIdex)) {
                    if (marker.tooltipSettings.format) {
                        currentData = this.formatter(marker.tooltipSettings.format, marker.dataSource[dataIndex as number]);
                    } else {
                        if (typeof marker.template !== 'function' && marker.template && !marker.tooltipSettings.valuePath) {
                            currentData =  marker.template.split('>')[1].split('<')[0];
                        } else {
                            currentData =
                            formatValue(((marker.tooltipSettings.valuePath. indexOf('.') > -1) ?
                                (getValueFromObject(marker.dataSource[dataIndex as number], marker.tooltipSettings.valuePath)) :
                                marker.dataSource[dataIndex as number][marker.tooltipSettings.valuePath]),
                                        this.maps
                            ) as string;
                        }
                    }
                }
                //location.y = this.template(option, location);
            } else if (targetId.indexOf('_BubbleIndex_') > -1) {
                const bubbleIndex: number = parseInt(targetId.split('_BubbleIndex_')[1].split('_')[0], 10);
                const dataIndex: number = parseInt(targetId.split('_BubbleIndex_')[1].split('_')[2], 10);
                const bubble: BubbleSettingsModel = layer.bubbleSettings[bubbleIndex as number];
                option = bubble.tooltipSettings;
                templateData = bubble.dataSource[dataIndex as number];
                if (option.visible && !isNaN(dataIndex)) {
                    if (bubble.tooltipSettings.format) {
                        currentData = this.formatter(bubble.tooltipSettings.format, bubble.dataSource[dataIndex as number]);
                    } else {
                        currentData =
                        formatValue(((bubble.tooltipSettings.valuePath.indexOf('.') > -1) ?
                            (getValueFromObject(bubble.dataSource[dataIndex as number], bubble.tooltipSettings.valuePath)) :
                            bubble.dataSource[dataIndex as number][bubble.tooltipSettings.valuePath]),
                                    this.maps
                        ) as string;
                    }
                }
                //location.y = this.template(option, location);
            }
            if (isPolygon ? polygonTooltipOption.visible : option.visible) {
                if (document.getElementById(this.tooltipId)) {
                    tooltipEle = document.getElementById(this.tooltipId);
                } else {
                    tooltipEle = createElement('div', {
                        id: this.maps.element.id + '_mapsTooltip',
                        className: 'EJ2-maps-Tooltip'
                    });
                    if (isNullOrUndefined(isPolygon ? polygon.tooltipTemplate : option.template) || (isPolygon ? polygon.tooltipTemplate === '' : option.template === '') || this.maps.tooltipDisplayMode === 'MouseMove') {
                        tooltipEle.style.cssText = 'position: absolute;pointer-events:none;';
                    } else {
                        tooltipEle.style.position = 'absolute';
                    }
                    document.getElementById(this.maps.element.id + '_Secondary_Element').appendChild(tooltipEle);
                }
                // eslint-disable-next-line no-constant-condition
                if (typeof (isPolygon ? polygon.tooltipTemplate !== 'function' : option.template !== 'function') && (isPolygon ? polygon.tooltipTemplate !== null : option.template !== null) && Object.keys(typeof (isPolygon ? polygon.tooltipTemplate === 'object' : option.template === 'object') ? (isPolygon ? polygon.tooltipTemplate : option.template) : {}).length === 1) {
                    if (isPolygon) {
                        polygon.tooltipTemplate = polygon.tooltipTemplate[Object.keys(polygon.tooltipTemplate)[0]];
                    } else {
                        option.template = option.template[Object.keys(option.template)[0]];
                    }
                }
                templateData = this.setTooltipContent(option, templateData);
                const tooltipTextStyle: FontModel = {
                    // eslint-disable-next-line max-len
                    color: isPolygon ? polygonTextStyle.color : option.textStyle.color, fontFamily: isPolygon ? polygonTextStyle.fontFamily : option.textStyle.fontFamily, fontStyle: isPolygon ? polygonTextStyle.fontStyle : option.textStyle.fontStyle,
                    // eslint-disable-next-line max-len
                    fontWeight: isPolygon ? polygonTextStyle.fontWeight : option.textStyle.fontWeight, opacity: isPolygon ? polygonTextStyle.opacity : option.textStyle.opacity, size: isPolygon ? polygonTextStyle.size : option.textStyle.size
                };
                const tooltipOption : MapsTooltipOption = {
                    location: location, text: tooltipContent, data: templateData,
                    textStyle: tooltipTextStyle,
                    template: isPolygon ? polygon.tooltipTemplate : option.template
                };
                tooltipArgs = {
                    cancel: false, name: tooltipRender,
                    options: tooltipOption,
                    fill: isPolygon ? polygonFill : option.fill,
                    maps: this.maps, latitude: latitude, longitude: longitude,
                    element: target, eventArgs: e, content: isPolygon ? polygon.tooltipText : !isNullOrUndefined(currentData) ? currentData.toString() : ''
                };
                if (tooltipArgs.content !== '' || tooltipArgs.options['template'] !== '') {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    this.maps.trigger(tooltipRender, tooltipArgs, (args: ITooltipRenderEventArgs) => {
                        if (!tooltipArgs.cancel && !isNullOrUndefined(currentData) &&
                            (targetId.indexOf('_cluster_') === -1 && targetId.indexOf('_dataLabel_') === -1)) {
                            this.maps['isProtectedOnChange'] = true;
                            tooltipArgs.options['textStyle']['size'] = tooltipArgs.options['textStyle']['size']
                            || this.maps.themeStyle.fontSize;
                            tooltipArgs.options['textStyle']['color'] = tooltipArgs.options['textStyle']['color']
                                || this.maps.themeStyle.tooltipFontColor;
                            tooltipArgs.options['textStyle']['fontFamily'] = tooltipArgs.options['textStyle']['fontFamily']
                                || this.maps.themeStyle.fontFamily;
                            tooltipArgs.options['textStyle']['fontWeight'] = tooltipArgs.options['textStyle']['fontWeight']
                                || this.maps.themeStyle.fontWeight;
                            tooltipArgs.options['textStyle']['opacity'] = tooltipArgs.options['textStyle']['opacity']
                                || this.maps.themeStyle.tooltipTextOpacity;
                            if (tooltipArgs.cancel) {
                                this.svgTooltip = new Tooltip({
                                    enable: true,
                                    header: '',
                                    data: option['data'],
                                    template: option['template'],
                                    content: tooltipArgs.content.toString() !== currentData.toString() ? [tooltipArgs.content.toString()] :
                                        [currentData.toString()],
                                    shapes: [],
                                    location: option['location'],
                                    palette: [markerFill],
                                    areaBounds: this.maps.mapAreaRect,
                                    textStyle: option['textStyle'],
                                    availableSize: this.maps.availableSize,
                                    fill: option.fill || this.maps.themeStyle.tooltipFillColor,
                                    enableShadow: true,
                                    border: isPolygon ? polygonTooltipOption.border : option.border
                                });
                            } else {
                                this.svgTooltip = new Tooltip({
                                    enable: true,
                                    header: '',
                                    data: tooltipArgs.options['data'],
                                    template: tooltipArgs.options['template'],
                                    content: tooltipArgs.content.toString() !== currentData.toString() ? [tooltipArgs.content.toString()] :
                                        [currentData.toString()],
                                    shapes: [],
                                    location: tooltipArgs.options['location'],
                                    palette: [markerFill],
                                    areaBounds: this.maps.mapAreaRect,
                                    textStyle: tooltipArgs.options['textStyle'],
                                    availableSize: this.maps.availableSize,
                                    fill: tooltipArgs.fill || this.maps.themeStyle.tooltipFillColor,
                                    enableShadow: true,
                                    border: isPolygon ? polygonTooltipOption.border : option.border
                                });
                            }
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            if ((this.maps as any).isVue || (this.maps as any).isVue3) {
                                this.svgTooltip.controlInstance = this.maps;
                            }
                            this.svgTooltip.opacity = this.maps.themeStyle.tooltipFillOpacity || this.svgTooltip.opacity;
                            this.svgTooltip.appendTo(tooltipEle);
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (this.maps as any).renderReactTemplates();
                        } else {
                            this.clearTooltip(<HTMLElement>e.target);
                        }
                    });
                } else {
                    this.clearTooltip(<HTMLElement>e.target);
                }

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
                    this.clearTooltip(<HTMLElement>e.target);
                }
            } else {
                this.clearTooltip(<HTMLElement>e.target);
            }
        } else {
            const tooltipElement: Element = (e.target as HTMLElement).closest('#' + this.maps.element.id + '_mapsTooltipparent_template');
            if (isNullOrUndefined(tooltipElement)) {
                this.clearTooltip(<HTMLElement>e.target);
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
            format = (typeof data[key as string] === 'object') ? convertStringToValue('', format, data, this.maps) :
                format.split('${' + key + '}').join(formatValue(data[key as string], this.maps));
        }
        return format;
    }
    /**
     * Handles the mouse up
     *
     * @param {PointerEvent} e - Specifies the event
     * @returns {void}
     * @private
     */
    public mouseUpHandler(e: PointerEvent): void {
        if (!isNullOrUndefined(this.maps)) {
            this.renderTooltip(e);
            if (this.maps.tooltipDisplayMode === 'MouseMove') {
                clearTimeout(this.clearTimeout);
                this.clearTimeout = setTimeout(this.removeTooltip.bind(this), 2000);
            }
        }
    }

    /**
     * Removes the tooltip
     *
     * @returns {boolean} - Returns the boolean whether tooltip is removed or not.
     * @private
     */
    public removeTooltip(): boolean {
        let isTooltipRemoved: boolean = false;
        if (document.getElementsByClassName('EJ2-maps-Tooltip').length > 0) {
            remove(document.getElementsByClassName('EJ2-maps-Tooltip')[0]);
            isTooltipRemoved = true;
        }
        return isTooltipRemoved;
    }

    private clearTooltip(element: HTMLElement): void {
        // eslint-disable-next-line @typescript-eslint/tslint/config
        const tooltipElement = element.closest('#' + this.maps.element.id + '_mapsTooltipparent_template');
        if (isNullOrUndefined(tooltipElement)) {
            const isTooltipRemoved: boolean = this.removeTooltip();
            if (isTooltipRemoved) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (this.maps as any).clearTemplate();
            }
        }

    }
    /**
     * To bind events for tooltip module
     *
     * @returns {void}
     * @private
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
        this.maps.on(Browser.touchCancelEvent, this.removeTooltip, this);
        this.maps.element.addEventListener('contextmenu', this.removeTooltip);
    }
    /**
     * Removes the event listeners
     *
     * @returns {void}
     * @private
     */
    public removeEventListener(): void {
        if (this.maps) {
            if (this.maps.isDestroyed) {
                return;
            }
            if (this.maps.tooltipDisplayMode === 'DoubleClick') {
                this.maps.off('dblclick', this.renderTooltip);
            } else if (this.maps.tooltipDisplayMode === 'Click') {
                this.maps.off(Browser.touchEndEvent, this.mouseUpHandler);
            } else {
                this.maps.off(Browser.touchMoveEvent, this.renderTooltip);
            }
            this.maps.off(Browser.touchCancelEvent, this.removeTooltip);
            this.maps.element.removeEventListener('contextmenu', this.removeTooltip);
        }
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
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.svgTooltip)) {
            this.svgTooltip.destroy();
        }
        this.svgTooltip = null;
        this.maps = null;
    }
}
