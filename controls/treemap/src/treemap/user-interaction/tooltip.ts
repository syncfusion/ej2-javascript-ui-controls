import { TreeMap } from '../treemap';
import { Tooltip } from '@syncfusion/ej2-svg-base';
import { Browser, createElement } from '@syncfusion/ej2-base';
import { Location, getMousePosition, textFormatter, formatValue } from '../utils/helper';
import { TooltipSettingsModel } from '../model/base-model';
import { ITreeMapTooltipRenderEventArgs } from '../model/interface';
import { tooltipRendering } from '../model/constants';
/**
 * Render Tooltip
 */

export class TreeMapTooltip {
    private treemap: TreeMap;
    private tooltipSettings: TooltipSettingsModel;
    private svgTooltip: Tooltip;
    private isTouch: boolean;
    private tooltipId: string;
    private currentTime: number;
    private clearTimeout: number;
    constructor(treeMap: TreeMap) {
        this.treemap = treeMap;
        this.tooltipSettings = this.treemap.tooltipSettings;
        this.tooltipId = this.treemap.element.id + '_TreeMapTooltip';
        this.addEventListener();
    }

    /* tslint:disable:no-string-literal */
    public renderTooltip(e: PointerEvent): void {
        let pageX: number; let pageY: number;
        let target: Element; let touchArg: TouchEvent;
        let tootipArgs: ITreeMapTooltipRenderEventArgs;
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
        let targetId: string = target.id; let item: Object = {};
        let tooltipEle: HTMLElement; let location: Location;
        let toolTipHeader: string; let toolTipData: Object = {};
        let tooltipContent: string[] = []; let markerFill: string;
        if (targetId.indexOf('_Item_Index') > -1) {
            item = this.treemap.layout.renderItems[parseFloat(targetId.split('_')[6])];
            toolTipHeader = item['name'];
            value = item['weight'];
            this.currentTime = new Date().getTime();
            toolTipData = item['data'];
            markerFill = item['options']['fill'];
            tooltipContent = [textFormatter(this.tooltipSettings.format, toolTipData, this.treemap) ||
                this.treemap.weightValuePath.toString() + ' : ' + formatValue(value, this.treemap)];
            if (document.getElementById(this.tooltipId)) {
                tooltipEle = document.getElementById(this.tooltipId);
            } else {
                tooltipEle = createElement('div', {
                    id: this.treemap.element.id + '_TreeMapTooltip',
                    className: 'EJ2-TreeMap-Tooltip',
                    styles: 'position: absolute;pointer-events:none;'
                });
                document.getElementById(this.treemap.element.id + '_Secondary_Element').appendChild(tooltipEle);
            }
            location = getMousePosition(pageX, pageY, this.treemap.svgObject);
            location.y = (this.tooltipSettings.template) ? location.y + 10 : location.y;
            tootipArgs = {
                cancel: false, name: tooltipRendering, item: item,
                options: {
                    location: location, text: tooltipContent, data: toolTipData,
                    textStyle: this.tooltipSettings.textStyle, template: this.tooltipSettings.template
                },
                treemap: this.treemap,
                element: target, eventArgs: e
            };
            this.treemap.trigger(tooltipRendering, tootipArgs);
            if (!tootipArgs.cancel) {
                this.svgTooltip = new Tooltip({
                    enable: true,
                    header: '',
                    data: tootipArgs.options['data'],
                    template: tootipArgs.options['template'],
                    content: tootipArgs.options['text'],
                    shapes: [],
                    location: tootipArgs.options['location'],
                    palette: [markerFill],
                    areaBounds: this.treemap.areaRect,
                    textStyle: tootipArgs.options['textStyle'],
                    theme: this.treemap.theme
                });
                this.svgTooltip.appendTo(tooltipEle);
            } else {
                this.removeTooltip();
            }
        } else {
            this.removeTooltip();
        }
    }

    public mouseUpHandler(e: PointerEvent): void {
        this.renderTooltip(e);
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(this.removeTooltip.bind(this), 2000);
    }

    public removeTooltip(): void {
        if (document.getElementsByClassName('EJ2-TreeMap-Tooltip').length > 0) {
            document.getElementsByClassName('EJ2-TreeMap-Tooltip')[0].remove();
        }
    }

    /**
     * To bind events for tooltip module
     */
    public addEventListener(): void {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.on(Browser.touchMoveEvent, this.renderTooltip, this);
        this.treemap.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    }
    /**
     * To unbind events for tooltip module
     */
    public removeEventListener(): void {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.off(Browser.touchMoveEvent, this.renderTooltip);
        this.treemap.off(Browser.touchEndEvent, this.mouseUpHandler);
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'treeMapTooltip';
    }
    /**
     * To destroy the tooltip. 
     * @return {void}
     * @private
     */
    public destroy(treeMap: TreeMap): void {
        /**
         * Destroy method performed here
         */
        this.removeEventListener();
    }
}