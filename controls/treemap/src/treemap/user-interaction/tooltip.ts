import { TreeMap } from '../treemap';
import { Tooltip } from '@syncfusion/ej2-svg-base';
import { Browser, createElement, isNullOrUndefined, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { Location, getMousePosition, textFormatter, formatValue } from '../utils/helper';
import { TooltipSettingsModel } from '../model/base-model';
import { ITreeMapTooltipRenderEventArgs, ITreeMapTooltipArgs } from '../model/interface';
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
    private clearTimeout: number;
    constructor(treeMap: TreeMap) {
        this.treemap = treeMap;
        this.tooltipSettings = this.treemap.tooltipSettings;
        this.tooltipId = this.treemap.element.id + '_TreeMapTooltip';
        this.addEventListener();
    }

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let value: number; const targetId: string = target.id; let item: any = {}; let tooltipEle: HTMLElement;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let location: Location; let toolTipData: any = {};
        let tooltipContent: string[] = []; let markerFill: string;
        if (targetId.indexOf('_Item_Index') > -1) {
            item = this.treemap.layout.renderItems[parseFloat(targetId.split('_Item_Index_')[1])];
            if (!isNullOrUndefined(item)) {
                value = item['weight'];
                toolTipData = item['data'];
                if (!isNullOrUndefined(item['options'])) {
                    markerFill = item['options']['fill'];
                }
                if (this.treemap.enableRtl) {
                    tooltipContent = [SanitizeHtmlHelper.sanitize(textFormatter(this.tooltipSettings.format, toolTipData, this.treemap)) ||
                        SanitizeHtmlHelper.sanitize(formatValue(value, this.treemap) + ' : ' + this.treemap.weightValuePath.toString())];
                } else {
                    tooltipContent = [SanitizeHtmlHelper.sanitize(textFormatter(this.tooltipSettings.format, toolTipData, this.treemap)) ||
                        SanitizeHtmlHelper.sanitize(this.treemap.weightValuePath.toString() + ' : ' + formatValue(value, this.treemap))];
                }
                if (document.getElementById(this.tooltipId)) {
                    tooltipEle = document.getElementById(this.tooltipId);
                } else {
                    tooltipEle = createElement('div', {
                        id: this.treemap.element.id + '_TreeMapTooltip',
                        className: 'EJ2-TreeMap-Tooltip'
                    });
                    tooltipEle.style.cssText = 'position: absolute;pointer-events:none;';
                    document.getElementById(this.treemap.element.id + '_Secondary_Element').appendChild(tooltipEle);
                }
                location = getMousePosition(pageX, pageY, this.treemap.svgObject);
                location.y = (this.tooltipSettings.template) ? location.y + 10 : location.y;
                this.tooltipSettings.textStyle.size = this.tooltipSettings.textStyle.size || this.treemap.themeStyle.tooltipFontSize;
                this.tooltipSettings.textStyle.fontFamily = this.treemap.themeStyle.fontFamily;
                this.tooltipSettings.textStyle.fontStyle = !isNullOrUndefined(this.tooltipSettings.textStyle.fontStyle) ? this.tooltipSettings.textStyle.fontStyle : 'Normal';
                this.tooltipSettings.textStyle.fontWeight = this.tooltipSettings.textStyle.fontWeight || this.treemap.themeStyle.fontWeight;
                this.tooltipSettings.textStyle.color = this.treemap.themeStyle.tooltipFontColor
                    || this.tooltipSettings.textStyle.color;
                this.tooltipSettings.textStyle.opacity = this.treemap.themeStyle.tooltipTextOpacity
                    || this.tooltipSettings.textStyle.opacity;
                tootipArgs = {
                    cancel: false, name: tooltipRendering, item: item,
                    options: {
                        location: location, text: tooltipContent, data: toolTipData,
                        textStyle: this.tooltipSettings.textStyle, template: this.tooltipSettings.template
                    },
                    treemap: this.treemap,
                    element: target, eventArgs: e
                };

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this.treemap.trigger(tooltipRendering, tootipArgs, (args?: ITreeMapTooltipRenderEventArgs) => {
                    this.addTooltip(tootipArgs, markerFill, tooltipEle);
                });

            }
        } else {
            this.removeTooltip();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.treemap as any).clearTemplate();
        }
    }

    private addTooltip(
        tootipArgs: ITreeMapTooltipRenderEventArgs, markerFill: string, tooltipEle: HTMLElement, eventArgs?: ITreeMapTooltipArgs
    ) : void {
        let cancel : boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let args : any;
        if (!isNullOrUndefined(tootipArgs)) {
            const {cancel : c, ...otherArgs} : ITreeMapTooltipRenderEventArgs = tootipArgs;
            cancel = c;
            args = otherArgs.options;
        } else {
            cancel = eventArgs.cancel;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            args = eventArgs as any;
        }
        if (!cancel) {
            this.svgTooltip = new Tooltip({
                enable: true,
                header: '',
                data: args['data'],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                template: args['template'] as any,
                content: args['text'],
                shapes: [],
                location: args['location'],
                palette: [markerFill],
                areaBounds: this.treemap.areaRect,
                textStyle: args['textStyle'],
                fill: this.treemap.tooltipSettings.fill ? this.treemap.tooltipSettings.fill : this.treemap.themeStyle.tooltipFillColor
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((this.treemap as any).isVue || (this.treemap as any).isVue3) {
                this.svgTooltip.controlInstance = this.treemap;
            }
            this.svgTooltip.opacity = this.treemap.themeStyle.tooltipFillOpacity || this.svgTooltip.opacity;
            this.svgTooltip.appendTo(tooltipEle);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.treemap as any).renderReactTemplates();
        } else {
            this.removeTooltip();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.treemap as any).clearTemplate();
        }
    }

    public mouseUpHandler(e: PointerEvent): void {
        this.renderTooltip(e);
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(this.removeTooltip.bind(this), 2000);
    }

    public removeTooltip(): void {
        if (document.getElementsByClassName('EJ2-TreeMap-Tooltip').length > 0) {
            const tooltipElementId: Element = document.getElementsByClassName('EJ2-TreeMap-Tooltip')[0];
            tooltipElementId.parentNode.removeChild(tooltipElementId);
        }
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * To bind events for tooltip module
     * @private
     */
    public addEventListener(): void {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.on(Browser.touchMoveEvent, this.renderTooltip, this);
        this.treemap.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    }
    // eslint-disable-next-line valid-jsdoc
    /**
     * To unbind events for tooltip module
     * @private
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
     *
     * @returns {string} returns string
     */
    protected getModuleName(): string {
        return 'treeMapTooltip';
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
        this.tooltipSettings = null;
        this.removeEventListener();
        this.treemap = null;
    }
}
