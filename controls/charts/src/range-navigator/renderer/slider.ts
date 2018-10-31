import { RangeNavigator, RangeValueType } from '../index';
import { SvgRenderer, Browser, createElement } from '@syncfusion/ej2-base';
import { Rect, RectOption } from '../../common/utils/helper';
import { getXLocation, getExactData, getRangeValueXByPoint, DataPoint, getNearestValue } from '../utils/helper';
import { drawSymbol, PathOption, VisibleRangeModel, linear, VisibleLabels, Axis } from '../../chart/index';
import { Animation, AnimationOptions } from '@syncfusion/ej2-base';
import { IChangedEventArgs, IRangeStyle } from '../model/range-navigator-interface';
import { ThumbSettingsModel, StyleSettingsModel } from '../model/range-base-model';

/**
 * Class for slider
 */
export class RangeSlider {

    private leftUnSelectedElement: Element;
    private rightUnSelectedElement: Element;
    private selectedElement: Element;
    private leftSlider: Element;
    private rightSlider: Element;
    private control: RangeNavigator;
    private isDrag: boolean;
    private elementId: string;
    public currentSlider: string;
    public startX: number;
    public endX: number;
    private sliderWidth: number;
    public currentStart: number;
    public currentEnd: number;
    private previousMoveX: number;
    private thumpPadding: number;
    private thumbColor: string;
    public points: DataPoint[];
    public leftRect: Rect;
    public rightRect: Rect;
    public midRect: Rect;
    private labelIndex: number;
    private thumbVisible: boolean;
    private thumpY: number;
    public sliderY: number;
    /** @private */
    public isIOS: Boolean;

    constructor(range: RangeNavigator) {
        this.control = range;
        this.points = [];
        this.isIOS = Browser.isIos || Browser.isIos7;
        let thumb: ThumbSettingsModel = range.navigatorStyleSettings.thumb;
        this.thumbVisible = (range.themeStyle.thumbWidth !== 0 && range.themeStyle.thumbHeight !== 0);
        this.elementId = range.element.id;
        this.thumpPadding = range.themeStyle.thumbWidth / 2;
        this.addEventListener();
        this.thumbColor = range.disableRangeSelector ? 'transparent' :
            (thumb.fill || range.themeStyle.thumbBackground);
    }
    /**
     * Render Slider elements for range navigator
     * @param range 
     */
    public render(range: RangeNavigator): void {
        let renderer: SvgRenderer = range.renderer;
        let style: StyleSettingsModel = range.navigatorStyleSettings;
        let disabledColor: string = (range.disableRangeSelector) ? 'transparent' : null;
        let sliderGroup: Element = renderer.createGroup({
            'id': this.elementId + '_sliders',
            style: (range.disableRangeSelector) ? 'pointer-events:none;' : ''
        });
        let option: RectOption = new RectOption(
            this.elementId + '_leftUnSelectedArea',
            disabledColor || style.unselectedRegionColor || range.themeStyle.unselectedRectColor, { width: 0 }, 1, {
                x: range.bounds.x, y: range.bounds.y,
                width: range.bounds.width / 3,
                height: range.bounds.height
            }
        );
        this.leftUnSelectedElement = renderer.drawRectangle(option) as Element;
        option.id = this.elementId + '_rightUnSelectedArea';
        this.rightUnSelectedElement = renderer.drawRectangle(option) as Element;
        option.id = this.elementId + '_SelectedArea';
        option.fill = disabledColor || style.selectedRegionColor || range.themeStyle.selectedRegionColor;
        this.selectedElement = renderer.drawRectangle(option) as Element;
        this.selectedElement.setAttribute('style', 'cursor: -webkit-grab');
        this.leftSlider = renderer.createGroup({
            'id': this.elementId + '_LeftSlider', 'style': 'cursor: ew-resize'
        });
        this.rightSlider = renderer.createGroup({
            'id': this.elementId + '_RightSlider', 'style': 'cursor: ew-resize'
        });
        this.createThump(renderer, range.bounds, this.leftSlider, this.elementId + '_LeftSlider', sliderGroup);
        this.createThump(renderer, range.bounds, this.rightSlider, this.elementId + '_RightSlider');
        sliderGroup.appendChild(this.leftUnSelectedElement);
        sliderGroup.appendChild(this.rightUnSelectedElement);
        sliderGroup.appendChild(this.selectedElement);
        sliderGroup.appendChild(this.leftSlider);
        sliderGroup.appendChild(this.rightSlider);
        range.svgObject.appendChild(sliderGroup);
    }
    /**
     * Thumb creation performed
     * @param render 
     * @param bounds 
     * @param parent 
     * @param id 
     */
    public createThump(render: SvgRenderer, bounds: Rect, parent: Element, id: string, sliderGroup?: Element): void {
        let control: RangeNavigator = this.control;
        let thump: ThumbSettingsModel = control.navigatorStyleSettings.thumb;
        let style: IRangeStyle = control.themeStyle;
        let y: number = bounds.y + bounds.height / 2;
        let x: number = this.thumpPadding;
        let tickLength: number = (control.themeStyle.thumbHeight / 2) - 5;
        let disabledColor: string = control.disableRangeSelector ? 'transparent' : null;
        let lineColor: string = disabledColor || thump.border.color || style.thumpLineColor;
        let shadowElement: Element;
        parent.appendChild(render.drawPath(new PathOption(
            id + '_ThumpLine', 'transparent',
            thump.border.width, control.series.length ? lineColor : 'transparent', 1, null,
            'M' + ' ' + (x) + ' ' + (bounds.y) + ' ' + 'L' + ' ' + (x) + ' ' + (bounds.y + bounds.height) + ' '
        )));
        this.thumpY = y - (control.themeStyle.thumbHeight / 2);
        this.sliderY = bounds.y > this.thumpY ? this.thumpY : bounds.y;
        if (sliderGroup && !control.disableRangeSelector) {
            shadowElement = render.createDefs();
            shadowElement.innerHTML = '<rect xmlns="http://www.w3.org/2000/svg" id="path-1" x="0" ' +
                'y="' + this.thumpY + '" width="' + control.themeStyle.thumbWidth + '" height="' + control.themeStyle.thumbHeight + '"' +
                ' rx="' + (thump.type === 'Circle' ? '50%' : '0%') + '"/>' +
                '<filter xmlns="http://www.w3.org/2000/svg" x="-25.0%" y="-20.0%" width="150.0%" height="150.0%"' +
                ' filterUnits="objectBoundingBox" id="ej2-range-shadow"><feOffset dx="0" dy="1" in="SourceAlpha"' +
                'result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="1.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"/>' +
                '<feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"/>' +
                '<feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.16 0" type="matrix" in="shadowBlurOuter1"/>' +
                '</filter>';
            sliderGroup.appendChild(shadowElement);
        }
        parent.innerHTML += '<use xmlns="http://www.w3.org/2000/svg" fill="black" fill-opacity="1" filter="url(#ej2-range-shadow)"' +
            ' xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-1"/>';
        if (thump.type === 'Circle') {
            parent.appendChild(drawSymbol(
                { x: x, y: y }, 'Circle',
                { width: control.themeStyle.thumbWidth, height: control.themeStyle.thumbHeight }, '',
                new PathOption(
                    id + '_ThumpSymbol', disabledColor || this.thumbColor,
                    thump.border.width, lineColor, 1, null
                ),
                'Thumb'
            ));
        } else {
            parent.appendChild(render.drawRectangle(new RectOption(
                id + '_ThumpSymbol',
                disabledColor || this.thumbColor,
                { width: thump.border.width, color: lineColor }, 1,
                {
                    x: x - (control.themeStyle.thumbWidth / 2), y: y - (control.themeStyle.thumbHeight / 2),
                    width: control.themeStyle.thumbWidth,
                    height: control.themeStyle.thumbHeight
                },
                2, 2
            )) as Element);
        }
        if (this.thumbVisible) {
            parent.appendChild(render.drawPath(new PathOption(
                id + '_ThumpGrip', 'transparent',
                1, disabledColor || control.themeStyle.gripColor, 1, null,
                'M' + ' ' + (x + 2) + ' ' + (y + tickLength) + ' ' + 'L' + ' ' + (x + 2) + ' ' + (y - tickLength) + ' ' +
                'M' + ' ' + (x) + ' ' + (y + tickLength) + ' ' + 'L' + ' ' + (x) + ' ' + (y - tickLength) + ' ' +
                'M' + ' ' + (x - 2) + ' ' + (y + tickLength) + ' ' + 'L' + ' ' + (x - 2) + ' ' + (y - tickLength) + ' '
            )));
        }
    }
    /**
     * Set slider value for range navigator
     * @param start 
     * @param end 
     */
    public setSlider(start: number, end: number, trigger: boolean, showTooltip: boolean): void {
        let range: RangeNavigator = this.control;
        let padding: number = range.bounds.x;
        let axisRange: VisibleRangeModel = range.chartSeries.xAxis.actualRange;
        let isLeightWeight: boolean = range.series.length === 0;
        if (!(end >= start)) {
            start = [end, end = start][0];
        }
        start = end >= start ? start : [end, end = start][0];
        start = Math.max(start, axisRange.min);
        end = Math.min(end, axisRange.max);
        this.startX = padding + getXLocation(start, axisRange, range.bounds.width, range.enableRtl);
        this.endX = padding + getXLocation(end, axisRange, range.bounds.width, range.enableRtl);
        let selectedX: number = range.enableRtl ? this.endX : this.startX;
        let rightPadding: number = range.enableRtl ? this.startX : this.endX;
        this.sliderWidth = Math.abs(this.endX - this.startX);
        this.selectedElement.setAttribute('x', (selectedX) + '');
        this.selectedElement.setAttribute('width', this.sliderWidth + '');
        this.leftUnSelectedElement.setAttribute('width', (selectedX - padding) + '');
        this.rightUnSelectedElement.setAttribute('x', rightPadding + '');
        this.rightUnSelectedElement.setAttribute('width', (range.bounds.width - (rightPadding - padding)) + '');
        this.leftSlider.setAttribute('transform', 'translate(' + (this.startX - this.thumpPadding) + ', 0)');
        this.rightSlider.setAttribute('transform', 'translate(' + (this.endX - this.thumpPadding) + ', 0)');
        let left: number = this.control.svgObject.getBoundingClientRect().left -
            this.control.element.getBoundingClientRect().left;
        let leftX: number = this.control.enableRtl ? this.endX : this.startX;
        let rightX: number = this.control.enableRtl ? this.startX : this.endX;
        this.leftRect = {
            x: isLeightWeight ? left + padding : padding,
            y: isLeightWeight ? 0 : range.bounds.y,
            width: isLeightWeight ? leftX - padding : leftX,
            height: isLeightWeight ? this.thumpY : range.bounds.height
        };
        this.rightRect = {
            x: isLeightWeight ? left + rightX : rightX,
            y: isLeightWeight ? 0 : range.bounds.y,
            width: (range.bounds.width - (rightPadding - padding)),
            height: isLeightWeight ? this.thumpY : range.bounds.height
        };
        this.midRect = {
            x: isLeightWeight ? leftX + left : 0,
            y: isLeightWeight ? 0 : range.bounds.y,
            width: isLeightWeight ? Math.abs(this.endX - this.startX) : rightX,
            height: isLeightWeight ? this.thumpY : range.bounds.height
        };
        this.currentStart = start;
        this.currentEnd = end;
        if (showTooltip) {
            this.control.rangeTooltipModule.renderLeftTooltip(this);
            this.control.rangeTooltipModule.renderRightTooltip(this);
        }
        if (trigger) {
            this.triggerEvent(axisRange);
        }
    }
    /**
     * Trigger changed event
     * @param range 
     */
    private triggerEvent(range: VisibleRangeModel): void {
        let argsData: IChangedEventArgs;
        let xAxis: Axis = this.control.chartSeries.xAxis;
        let valueType: RangeValueType = xAxis.valueType as RangeValueType;
        argsData = {
            cancel: false,
            start: valueType === 'DateTime' ? new Date(this.currentStart) :
                (valueType === 'Logarithmic' ? Math.pow(xAxis.logBase, this.currentStart) : this.currentStart),
            end: valueType === 'DateTime' ? new Date(this.currentEnd) :
                (valueType === 'Logarithmic' ? Math.pow(xAxis.logBase, this.currentEnd) : this.currentEnd),
            name: 'changed',
            selectedData: getExactData(this.points, this.currentStart, this.currentEnd),
            zoomPosition: (this.control.enableRtl ? range.max - this.currentEnd :
                this.currentStart - range.min) / range.delta,
            zoomFactor: (this.currentEnd - this.currentStart) / range.delta
        };
        this.control.trigger('changed', argsData);
    }

    /**
     * @hidden
     */
    private addEventListener(): void {
        if (this.control.isDestroyed) { return; }
        this.control.on(Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.control.on(Browser.touchStartEvent, this.mouseDownHandler, this);
        this.control.on(Browser.touchEndEvent, this.mouseUpHandler, this);
        this.control.on(Browser.isPointer ? 'pointerleave' : 'mouseleave', this.mouseCancelHandler, this);
    }
    /**
     * @hidden
     */
    private removeEventListener(): void {
        if (this.control.isDestroyed) { return; }
        this.control.off(Browser.touchMoveEvent, this.mouseMoveHandler);
        this.control.off(Browser.touchStartEvent, this.mouseDownHandler);
        this.control.off(Browser.touchEndEvent, this.mouseUpHandler);
        this.control.off(Browser.isPointer ? 'pointerleave' : 'mouseleave', this.mouseCancelHandler);
    }
    /**
     * Move move handler perfomed here
     * @hidden
     * @param e 
     */
    private mouseMoveHandler(e: PointerEvent | TouchEvent): void {
        let control: RangeNavigator = this.control;
        let axisRange: VisibleRangeModel = control.chartSeries.xAxis.actualRange;
        let bounds: Rect = control.bounds;
        let start: number;
        let end: number;
        this.getCurrentSlider((<Element>e.target).id);
        if (this.isDrag && control.mouseX >= bounds.x) {
            switch (this.currentSlider) {
                case 'Left':
                    control.startValue = this.getRangeValue(Math.abs(control.mouseX - bounds.x));
                    break;
                case 'Right':
                    control.endValue = this.getRangeValue(Math.abs(control.mouseX - bounds.x));
                    break;
                case 'Middle':
                    start = Math.max(
                        this.getRangeValue(Math.abs(this.startX - (this.previousMoveX - control.mouseX) - bounds.x)), axisRange.min
                    );
                    end = Math.min(
                        this.getRangeValue(Math.abs(this.endX - (this.previousMoveX - control.mouseX) - bounds.x)), axisRange.max
                    );
                    let currentWidth: number = Math.floor(Math.abs(
                        getXLocation(end, axisRange, control.bounds.width, control.enableRtl) -
                        getXLocation(start, axisRange, control.bounds.width, control.enableRtl)
                    ));
                    if (currentWidth === Math.floor(this.sliderWidth)) {
                        control.startValue = start;
                        control.endValue = end;
                    }
                    break;
            }
            if (e.preventDefault && this.isIOS) {
                e.preventDefault();
            }
            this.setSlider(
                control.startValue, control.endValue,
                !control.enableDeferredUpdate,
                (control.rangeTooltipModule && control.tooltip.enable)
            );
            this.previousMoveX = control.mouseX;
        }
    }
    /**
     * To get the range value
     * @param x 
     */
    private getRangeValue(x: number): number {
        let control: RangeNavigator = this.control;
        let axisRange: VisibleRangeModel = control.chartSeries.xAxis.actualRange;
        let bounds: Rect = control.bounds;
        return getRangeValueXByPoint(
            x, bounds.width, axisRange, control.enableRtl
        );
    }
    /**
     * Moused down handler for slider perform here
     * @param e 
     */
    private mouseDownHandler(e: PointerEvent): void {
        this.currentSlider = this.getCurrentSlider((<Element>e.target).id);
        this.selectedElement.setAttribute('style', 'cursor: -webkit-grabbing');
        this.isDrag = !(this.currentSlider === 'UnSelectedArea' || !this.currentSlider);
        this.previousMoveX = this.control.mouseDownX;
    }
    /**
     * To get the current slider element
     * @param id 
     */
    private getCurrentSlider(id: string): string {
        let hoverColor: string = this.control.themeStyle.thumbHoverColor;
        if (id.indexOf(this.elementId + '_LeftSlider') > -1) {
            (this.leftSlider.childNodes[2] as Element).setAttribute('fill', hoverColor);
            return 'Left';
        } else if (id.indexOf(this.elementId + '_RightSlider') > -1) {
            (this.rightSlider.childNodes[2] as Element).setAttribute('fill', hoverColor);
            return 'Right';
        } else if (id.indexOf(this.elementId + '_SelectedArea') > -1) {
            return 'Middle';
        } else if (id.indexOf('UnSelectedArea') > -1) {
            (this.leftSlider.childNodes[2] as Element).setAttribute('fill', this.thumbColor);
            (this.rightSlider.childNodes[2] as Element).setAttribute('fill', this.thumbColor);
            return 'UnSelectedArea';
        } else if (id.indexOf(this.elementId + '_AxisLabel_') > -1 && this.control.valueType === 'DateTime') {
            this.labelIndex = +id.split('_')[2];
            return 'firstLevelLabels';
        } else if (id.indexOf(this.elementId + '_SecondaryLabel') > -1 && this.control.valueType === 'DateTime') {
            this.labelIndex = +id.split('_')[2];
            return 'secondLevelLabels';
        } else {
            (this.leftSlider.childNodes[2] as Element).setAttribute('fill', this.thumbColor);
            (this.rightSlider.childNodes[2] as Element).setAttribute('fill', this.thumbColor);
            if (this.control.periodSelectorModule) {
                this.control.periodSelectorModule.triggerChange = true;
            }
            return null;
        }
    }
    /**
     * Mouse up handler performed here
     * @param e 
     */
    private mouseUpHandler(e: PointerEvent): void {
        let control: RangeNavigator = this.control;
        let range: VisibleRangeModel = control.chartSeries.xAxis.actualRange;
        let trigger: boolean = control.enableDeferredUpdate;
        let endbledTooltip: boolean = control.tooltip.enable;
        if (this.currentSlider === 'UnSelectedArea') {
            let value: number; let start: number; let end: number;
            let isRtl: boolean = control.enableRtl;
            let difference: number = control.endValue - control.startValue;
            if (control.mouseDownX < this.startX) {
                value = Math.max(
                    this.getRangeValue((control.mouseDownX - (this.sliderWidth / 2) - control.bounds.x)),
                    range.min
                );
                end = isRtl ? value : (value + difference);
                start = isRtl ? (value - difference) : value;
            } else {
                value = Math.min(
                    this.getRangeValue((control.mouseDownX + (this.sliderWidth / 2) - control.bounds.x)),
                    range.max
                );
                start = isRtl ? value : (value - difference);
                end = isRtl ? (value + difference) : value;
            }
            this.performAnimation(start, end, control);
            trigger = false;
        } else if (this.currentSlider === 'firstLevelLabels' || this.currentSlider === 'secondLevelLabels') {
            let secondLabel: VisibleLabels = control.rangeAxis[this.currentSlider][this.labelIndex + 1];
            this.performAnimation(
                control.rangeAxis[this.currentSlider][this.labelIndex].value,
                (secondLabel ? secondLabel.value : range.max), control
            );
            trigger = false;
        }
        if (this.isDrag && control.allowSnapping) {
            this.setAllowSnapping(control, this.currentStart, this.currentEnd, trigger, endbledTooltip);
            trigger = false;
        }
        if (trigger) {
            this.setSlider(this.currentStart, this.currentEnd, true, endbledTooltip);
        }
        if (this.currentSlider !== null) {
            if (this.control.periodSelectorSettings.periods.length > 0) {
                this.control.periodSelectorModule.triggerChange = false;
                this.control.periodSelectorModule.datePicker.startDate = new Date(this.currentStart);
                this.control.periodSelectorModule.datePicker.endDate = new Date(this.currentEnd);
            }
        }
        this.selectedElement.setAttribute('style', 'cursor: -webkit-grab');
        control.startValue = this.currentStart;
        control.endValue = this.currentEnd;
        this.isDrag = false;
        this.labelIndex = null;
        this.currentSlider = null;
    }
    /**
     * Allow Snapping perfomed here
     * @param control
     * @param start 
     * @param end 
     */
    private setAllowSnapping(
        control: RangeNavigator, start: number, end: number,
        trigger: boolean, tooltip: boolean
    ): void {
        let values: number[] = control.rangeAxis.lowerValues;
        values.push(control.chartSeries.xAxis.actualRange.max);
        this.setSlider(getNearestValue(values, start), getNearestValue(values, end), trigger, tooltip);
        control.startValue = this.currentStart;
        control.endValue = this.currentEnd;
    }
    /**
     * Animation Calculation for slider navigation
     * @param start 
     * @param end
     */
    public performAnimation(start: number, end: number, control: RangeNavigator): void {
        let currentStart: number = this.currentStart;
        let currentEnd: number = this.currentEnd;
        let isDeffered: boolean = control.enableDeferredUpdate;
        let enableTooltip: boolean = control.tooltip.enable;
        new Animation({}).animate(createElement('div'), {
            duration: this.control.animationDuration,
            progress: (args: AnimationOptions): void => {
                this.setSlider(
                    linear(args.timeStamp, 0, start - currentStart, args.duration) + currentStart,
                    linear(args.timeStamp, 0, end - currentEnd, args.duration) + currentEnd, !isDeffered,
                    enableTooltip
                );
            },
            end: (model: AnimationOptions) => {
                if (control.allowSnapping) {
                    this.setAllowSnapping(control, start, end, true, enableTooltip);
                } else {
                    this.setSlider(start, end, true, enableTooltip);
                }
                this.control.startValue = this.currentStart;
                this.control.endValue = this.currentEnd;
                if (this.control.periodSelectorSettings.periods.length > 0) {
                    this.control.periodSelectorModule.triggerChange = false;
                    this.control.periodSelectorModule.datePicker.startDate = new Date(this.currentStart);
                    this.control.periodSelectorModule.datePicker.endDate = new Date(this.currentEnd);
                }
            }
        });
    }
    /**
     * Mouse Cancel Handler
     */
    private mouseCancelHandler(): void {
        this.isDrag = false;
        this.currentSlider = null;
        this.control.startValue = this.currentStart;
        this.control.endValue = this.currentEnd;
    }
    /**
     * Destroy Method Calling here
     */
    public destroy(): void {
        this.removeEventListener();
    }
}