import { Maps, ITooltipRenderEventArgs, tooltipRender } from '../index';
import { Tooltip } from '@syncfusion/ej2-svg-base';
import { createElement, Browser, isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { TooltipSettingsModel,  LayerSettings, MarkerSettingsModel, BubbleSettingsModel } from '../index';
import {  MapLocation, checkShapeDataFields, getMousePosition, Internalize } from '../utils/helper';
/**
 * Map Tooltip
 */
export class MapsTooltip {
    private maps: Maps;
    private tooltipSettings: TooltipSettingsModel;
    private svgTooltip: Tooltip;
    private isTouch: boolean;
    private tooltipId: string;
    private currentTime: number;
    private clearTimeout: number;

    constructor(maps: Maps) {
        this.maps = maps;
        this.tooltipId = this.maps.element.id + '_mapsTooltip';
        this.addEventListener();
    }
    /* tslint:disable:no-string-literal */
    //tslint:disable:max-func-body-length
    public renderTooltip(e: PointerEvent): void {
        let pageX: number; let pageY: number;
        let target: Element; let touchArg: TouchEvent;
        let tootipArgs: ITooltipRenderEventArgs;
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
        let formatFunction: Function; let value: number;
        let option: TooltipSettingsModel;
        let currentData: string = '';
        let targetId: string = target.id; let item: Object = {};
        let tooltipEle: HTMLElement; let location: MapLocation;
        let toolTipData: Object = {};
        let templateData: object = [];
        let index: number = parseFloat(targetId.split('_')[2]);
        let layer: LayerSettings = <LayerSettings>this.maps.layersCollection[index];
        let tooltipContent: string[] = []; let markerFill: string;
        location = getMousePosition(pageX, pageY, this.maps.svgObject);
        let istooltipRender: boolean = (targetId.indexOf('_ShapeIndex_') > -1)
         || (targetId.indexOf('_MarkerIndex_') > -1) || (targetId.indexOf('_BubbleIndex_') > -1);
        if (istooltipRender) {
            if (targetId.indexOf('_ShapeIndex_') > -1) {
                option = layer.tooltipSettings;
                let shape: number = parseInt(targetId.split('_')[4], 10);
                if (isNullOrUndefined(layer.shapeData['features'])) {
                    return;
                }
                let value: object = layer.shapeData['features'][shape]['properties'];
                index = checkShapeDataFields(<Object[]>layer.dataSource, value, layer.shapeDataPath, layer.shapePropertyPath);
                templateData = layer.dataSource[index];
                if (option.visible && ((!isNullOrUndefined(index) && !isNaN(index)) || (!isNullOrUndefined(value)))) {
                    if (layer.tooltipSettings.format) {
                        currentData = this.formatter(layer.tooltipSettings.format, layer.dataSource[index]);
                    }else {
                        currentData = ((!isNullOrUndefined(layer.dataSource)) && ((!isNullOrUndefined(index)))) ?
                        this.formatValue(layer.dataSource[index][option.valuePath], this.maps) : value[layer.shapePropertyPath];
                    }
                }
                //location.y = this.template(option, location);

            } else if (targetId.indexOf('_MarkerIndex_') > -1) {
                let markerIdex: number = parseInt(targetId.split('_')[4], 10);
                let dataIndex: number = parseInt(targetId.split('_')[6], 10);
                let marker: MarkerSettingsModel = layer.markerSettings[markerIdex];
                option = marker.tooltipSettings;
                templateData = marker.dataSource[dataIndex];
                if (option.visible && !isNaN(markerIdex)) {
                    if (marker.tooltipSettings.format) {
                        currentData = this.formatter(marker.tooltipSettings.format, marker.dataSource[dataIndex]);
                    }else {
                        currentData = this.formatValue(marker.dataSource[dataIndex][marker.tooltipSettings.valuePath], this.maps) as string;
                    }
                }
                //location.y = this.template(option, location);
            } else if (targetId.indexOf('_BubbleIndex_') > -1) {
                let bubbleIndex: number = parseInt(targetId.split('_')[4], 10);
                let dataIndex: number = parseInt(targetId.split('_')[6], 10);
                let bubble: BubbleSettingsModel = layer.bubbleSettings[bubbleIndex];
                option = bubble.tooltipSettings;
                templateData = bubble.dataSource[dataIndex];
                if (option.visible && !isNaN(dataIndex)) {
                    if (bubble.tooltipSettings.format) {
                        currentData = this.formatter(bubble.tooltipSettings.format, bubble.dataSource[dataIndex]);
                    }else {
                        currentData = this.formatValue(bubble.dataSource[dataIndex][bubble.tooltipSettings.valuePath], this.maps) as string;
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
            let content: string;
            if (option.template !== null && Object.keys(option.template).length === 1) {
                option.template = option.template[Object.keys(option.template)[0]];
            }
            templateData = this.setTooltipContent(option, templateData);
            tootipArgs = {
                cancel: false, name: tooltipRender,
                options: {
                    location: location, text: tooltipContent, data: templateData,
                    textStyle: option.textStyle,
                    template: option.template
                },
                maps: this.maps,
                element: target, eventArgs: e
            };
            this.maps.trigger(tooltipRender, tootipArgs);
            if (!tootipArgs.cancel && option.visible && !isNullOrUndefined(currentData)) {
                tootipArgs.options['textStyle']['color'] = ( this.maps.theme === 'Highcontrast') ? '#00000' : '#FFFFFF';
                this.svgTooltip = new Tooltip({
                    enable: true,
                    header: '',
                    data: tootipArgs.options['data'],
                    template: tootipArgs.options['template'],
                    content: [currentData.toString()],
                    shapes: [],
                    location: tootipArgs.options['location'],
                    palette: [markerFill],
                    areaBounds: this.maps.mapAreaRect,
                    textStyle: tootipArgs.options['textStyle'],
                    theme: this.maps.theme,
                    fill: (this.maps.theme === 'Highcontrast') ? '#FFFFFF' : '#00000'
                });
                this.svgTooltip.appendTo(tooltipEle);
            } else {
                this.removeTooltip();
            }
        } else {
            this.removeTooltip();
        }
    }

    /**
     * To get content for the current toolitp 
     */
    private setTooltipContent(options: TooltipSettingsModel, templateData: object): object {
        let localData: object = extend({}, templateData, null, true);
        if (this.maps.format && !isNaN(Number(localData[options.valuePath]))) {
            localData[options.valuePath] = Internalize(this.maps, Number(localData[options.valuePath]));
        } else {
            localData = Object.keys(localData).length ? localData : undefined;
        }
        return localData;
    }

    private formatValue(value: string, maps: Maps): string {
        let formatValue: string; let formatFunction: Function;
        if (maps.format && !isNaN(Number(value))) {
            formatFunction = maps.intl.getNumberFormat(
                { format: maps.format, useGrouping: maps.useGroupingSeparator });
            formatValue = formatFunction(Number(value));
        } else {
            formatValue = value;
        }
        return formatValue;
    }
    /*private template(tooltip: TooltipSettingsModel, location: MapLocation): number {
        location.y = (tooltip.template) ? location.y + 10 : location.y;
        return location.y;
    }*/
    private formatter(format: string, data: object = {}): string {
        let keys: string[] = Object.keys(data);
        for (let key of keys) {
            format = format.split('${' + key + '}').join(this.formatValue(data[key], this.maps));
        }
        return format;
    }
    public mouseUpHandler(e: PointerEvent): void {
        this.renderTooltip(e);
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(this.removeTooltip.bind(this), 2000);
    }

    public removeTooltip(): void {
        if (document.getElementsByClassName('EJ2-maps-Tooltip').length > 0) {
            document.getElementsByClassName('EJ2-maps-Tooltip')[0].remove();
        }
    }
    /**
     * To bind events for tooltip module
     */
    public addEventListener(): void {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.on(Browser.touchMoveEvent, this.renderTooltip, this);
        this.maps.on(Browser.touchEndEvent, this.mouseUpHandler, this);
        this.maps.on(Browser.touchCancelEvent, this.removeTooltip, this);
    }
    public removeEventListener(): void {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.off(Browser.touchMoveEvent, this.renderTooltip);
        this.maps.off(Browser.touchEndEvent, this.mouseUpHandler);
        this.maps.off(Browser.touchCancelEvent, this.removeTooltip);
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'MapsTooltip';
    }
    /**
     * To destroy the tooltip. 
     * @return {void}
     * @private
     */
    public destroy(maps: Maps): void {
        this.removeEventListener();
    }
}