import { createElement, isNullOrUndefined, Browser, remove } from '@syncfusion/ej2-base';
import { Toolbar, ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { DateRangePicker, RangeEventArgs } from '@syncfusion/ej2-calendars';
import { getElement } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { RangeIntervalType } from '../utils/enum';
import { RangeNavigator, RangeSlider } from '../../range-navigator/index';
import { PeriodsModel } from '../model/base-model';
import { ISelectorRenderArgs, IPeriodSelectorControl } from '../../common/model/interface';
import { IRangeSelectorRenderEventArgs } from '../../chart/model/chart-interface';
import { StockChart } from '../../stock-chart/stock-chart';

/**
 * Period selector class
 */
export class PeriodSelector {

    public periodSelectorSize: Rect;
    public periodSelectorDiv: Element;
    public control: IPeriodSelectorControl = {} as IPeriodSelectorControl;
    public toolbar: Toolbar;
    public datePicker: DateRangePicker;
    public triggerChange: boolean;
    private nodes: Node;
    public calendarId: string;
    public selectedIndex: number;
    public selectedPeriod: PeriodsModel;
    public datePickerTriggered: boolean;
    public rootControl: StockChart | RangeNavigator;
    public isDatetimeCategory: boolean = false;
    public sortedData: number[] = [];
    private startValue: number = 0;
    private endValue: number = 0;
    //constructor for period selector
    constructor(control: RangeNavigator | StockChart) {
        this.rootControl = control;
        if (this.rootControl.getModuleName() === 'stockChart') {
            this.sortedData = (this.rootControl as StockChart).sortedData;
            this.isDatetimeCategory = (this.rootControl as StockChart).isDateTimeCategory;
        }
    }
    /**
     * To set the control values
     *
     * @param control
     * @returns {void}
     */

    public setControlValues(control: RangeNavigator | StockChart): void {
        if (control.getModuleName() === 'rangeNavigator') {
            this.control.periods = (this.rootControl as RangeNavigator).periodSelectorSettings.periods;
            this.control.seriesXMax = (control as RangeNavigator).chartSeries.xMax;
            this.control.seriesXMin = (control as RangeNavigator).chartSeries.xMin;
            this.control.rangeSlider = (control as RangeNavigator).rangeSlider;
            this.control.rangeNavigatorControl = control as RangeNavigator;
            this.control.endValue = (control as RangeNavigator).endValue;
            this.control.startValue = (control as RangeNavigator).startValue;
        } else {
            this.control.periods = (this.rootControl as StockChart).periods;
            this.control.endValue = this.control.seriesXMax = (control as StockChart).seriesXMax;
            this.control.startValue = this.control.seriesXMin = (control as StockChart).seriesXMin;
            this.control.rangeNavigatorControl = (this.rootControl as StockChart).rangeNavigator;
            if (this.control.rangeNavigatorControl) {
                this.control.rangeSlider = (this.rootControl as StockChart).rangeNavigator.rangeSlider;
            }
        }
        this.control.element = control.element;
        this.control.disableRangeSelector = (control as RangeNavigator).disableRangeSelector;
    }
    /**
     * To initialize the period selector properties.
     *
     * @param options
     * @param x
     * @param options
     * @param x
     */

    public appendSelector(options: ISelectorRenderArgs, x: number  = 0): void {
        this.renderSelectorElement(null, options, x);
        this.renderSelector();
    }
    /**
     * renderSelector div.
     *
     * @param control
     * @param options
     * @param x
     * @param options
     * @param x
     */

    public renderSelectorElement(control?: RangeNavigator, options?: ISelectorRenderArgs, x? : number): void {
        //render border
        this.periodSelectorSize = control ? this.periodSelectorSize : new Rect(x, (this.rootControl as StockChart).titleSize.height ? (this.rootControl as StockChart).titleSize.height : 10,
                                                                               options.width, options.height);
        let thumbSize: number;
        let element: HTMLElement;
        if (control) {
            thumbSize = control.themeStyle.thumbWidth;
            element = control.element;
        } else {
            thumbSize = options.thumbSize;
            element = options.element;
        }
        if (getElement(element.id + '_Secondary_Element')) {
            remove(getElement(element.id + '_Secondary_Element'));
        }
        this.periodSelectorDiv = createElement('div', {
            id: element.id + '_Secondary_Element',
            styles: 'width: ' + (this.periodSelectorSize.width - thumbSize) + 'px;height: ' +
                this.periodSelectorSize.height + 'px;top:' +
                this.periodSelectorSize.y + 'px;left:' +
                (this.periodSelectorSize.x + thumbSize / 2) + 'px; position: absolute'
        });
        element.appendChild(this.periodSelectorDiv);
    }

    /**
     * renderSelector elements.
     *
     * @returns {void}
     */

    public renderSelector(): void {
        this.setControlValues(this.rootControl);
        let enableCustom: boolean = true;
        const controlId: string = this.control.element.id;
        const selectorElement: Element = createElement('div', { id: controlId + '_selector' });
        const buttons: PeriodsModel[] = this.control.periods;
        const selector: ItemModel[] = this.updateCustomElement();
        const buttonStyles: string = 'text-transform: none; text-overflow: unset';
        const isStringTemplate: string = 'isStringTemplate';
        const dateRangeId: string = controlId + 'customRange';
        let selectedPeriod: PeriodsModel;
        this.periodSelectorDiv.appendChild(selectorElement);
        for (let i: number = 0; i < buttons.length; i++) {
            selector.push({ align: 'Left', text: buttons[i as number].text });
        }
        if (this.rootControl.getModuleName() === 'stockChart') {
            enableCustom = (<StockChart>this.rootControl).enableCustomRange;
        }
        if (enableCustom) {
            this.calendarId = controlId + '_calendar';
            selector.push({ template: '<button id=' + this.calendarId + '></button>', align: 'Right' });
        }
        const selctorArgs: IRangeSelectorRenderEventArgs = {
            selector: selector, name: 'RangeSelector', cancel: false, enableCustomFormat: true, content: 'Date Range'
        };
        if (this.rootControl.getModuleName() === 'stockChart') {
            if ((<StockChart>this.rootControl).exportType.length) {
                let exportElement: HTMLElement = createElement('button', { id: controlId + '_export', styles: buttonStyles,
                className: 'e-dropdown-btn e-btn e-flat' });
                exportElement.innerText = 'Export';
                selector.push({ template: exportElement,
                align: 'Right'});
            }
        }
        this.rootControl.trigger('selectorRender', selctorArgs);
        this.toolbar = new Toolbar({
            items: selctorArgs.selector, height: this.periodSelectorSize.height,
            clicked: (args: ClickEventArgs) => {
                this.buttonClick(args, this.control);
            }, created: () => {
                this.nodes = this.toolbar.element.querySelectorAll('.e-toolbar-left')[0];
                if (isNullOrUndefined(this.selectedIndex)) {
                    buttons.map((period: PeriodsModel, index: number) => {
                        if (period.selected && this.selectedPeriod !== null) {
                            selectedPeriod = period;
                            this.control.startValue = this.changedRange(
                                period.intervalType, this.control.endValue, period.interval
                            ).getTime();
                            if (this.isDatetimeCategory) {
                                this.control.startValue = this.rootControl.getModuleName() !== 'stockChart' ? this.findStartValue(this.control.startValue, this.control.endValue) : this.rootControl.startValue;
                            }
                            this.control.startValue = (period.text && period.text.toLowerCase() === 'all') ? this.control.seriesXMin : this.control.startValue;
                            this.control.endValue = (period.text && period.text.toLowerCase() === 'all') ? this.control.seriesXMax : this.control.endValue;
                            this.selectedIndex = (this.nodes.childNodes.length - buttons.length) + index;
                            const slider: RangeSlider = this.control.rangeSlider;
                            if (slider) {
                                slider.selectedPeriod = period.text;
                            }
                        }
                    });
                }
                if (!selectedPeriod && this.rootControl.getModuleName() !== 'stockChart') {
                    this.selectedIndex = this.findSelectedIndex(this.control.startValue, this.control.endValue, buttons);
                }
                this.setSelectedStyle(this.selectedIndex);
            }
        });
        this.toolbar[isStringTemplate as string] = true;
        this.toolbar.appendTo(selectorElement as HTMLElement);
        this.triggerChange = true;
        if (enableCustom) {
            this.datePicker = new DateRangePicker({
                min: this.isDatetimeCategory ? new Date(this.sortedData[this.control.seriesXMin]) : new Date(this.control.seriesXMin),
                max: this.isDatetimeCategory ? new Date(this.sortedData[this.control.seriesXMax]) : new Date(this.control.seriesXMax),
                // eslint-disable-next-line no-useless-escape
                format: 'dd\'\/\'MM\'\/\'yyyy', placeholder: 'Select a range',
                showClearButton: false,
                startDate: this.isDatetimeCategory ? new Date(this.sortedData[Math.floor(this.control.startValue)]) :
                    new Date(this.control.startValue),
                endDate: this.isDatetimeCategory ? new Date(this.sortedData[Math.floor(this.control.endValue)]) :
                    new Date(this.control.endValue),
                created: () => {
                    if (selctorArgs.enableCustomFormat) {
                        const datePicker: HTMLCollection = <HTMLCollection>document.getElementsByClassName('e-date-range-wrapper');
                        let datePickerElement: HTMLElement;
                        for (let i: number = 0; i < datePicker.length; i++) {
                            if (datePicker[i as number].children[0].id.indexOf(controlId) !== -1) {
                                datePickerElement = <HTMLElement>datePicker[i as number];
                            }
                        }
                        datePickerElement.style.display = 'none';
                        let element: HTMLElement = createElement('div', {
                            id: dateRangeId,
                            className: 'e-btn e-dropdown-btn e-flat',
                            styles: 'font-family: "Segoe UI"; font-size: 14px; font-weight: 500; text-transform: none '
                        });
                        element.innerText = selctorArgs.content;
                        datePickerElement.insertAdjacentElement('afterend', element);
                        getElement(dateRangeId).insertAdjacentElement('afterbegin', (createElement('span', {
                            id: controlId + 'dateIcon', className: 'e-input-group-icon e-range-icon e-btn-icon e-icons',
                            styles: 'font-size: 16px; min-height: 0px; margin: -3px 0 0 0; outline: none; min-width: 30px'
                            // fix for date range icon alignment issue.
                        })));
                        document.getElementById(dateRangeId).onclick = () => {
                            this.datePicker.show(<HTMLElement>getElement(dateRangeId));
                        };
                    }
                },
                change: (args: RangeEventArgs) => {
                    if (this.triggerChange) {
                        if (this.isDatetimeCategory) {
                            this.startValue = (args.startDate as Date).getTime();
                            this.endValue = (args.endDate as Date).getTime();
                            this.findPeriodValue(this.startValue , this.endValue);
                        }
                        if (this.control.rangeSlider && args.event) {
                            if (this.rootControl.getModuleName() !== 'stockChart') {
                                this.control.rangeNavigatorControl.startValue = this.isDatetimeCategory ? this.startValue :
                                    args.startDate.getTime();
                                this.control.rangeNavigatorControl.endValue = this.isDatetimeCategory ? this.endValue :
                                    args.endDate.getTime();
                                this.selectedIndex = undefined;
                                this.selectedPeriod = null;
                                this.control.rangeNavigatorControl.refresh();
                            }
                            this.control.rangeSlider.performAnimation(
                                this.isDatetimeCategory ? this.startValue : (args.startDate as Date).getTime(), this.isDatetimeCategory ?
                                    this.endValue : (args.endDate as Date).getTime(), this.control.rangeNavigatorControl
                            );
                        } else if (args.event) {
                            (this.rootControl as StockChart).rangeChanged(this.isDatetimeCategory ? this.startValue :
                                (args.startDate as Date).getTime(), this.isDatetimeCategory ? this.endValue :
                                (args.endDate as Date).getTime());
                        }
                        this.nodes = this.toolbar.element.querySelectorAll('.e-toolbar-left')[0];
                        if (!(this.rootControl as StockChart).resizeTo && this.control.rangeSlider && this.control.rangeSlider.isDrag) {
                        /**
                         * Issue: While disabling range navigator console error throws
                         * Fix:Check with rangeSlider present or not. Then checked with isDrag.
                         */
                            for (let i: number = 0, length: number = this.nodes.childNodes.length; i < length; i++) {
                                (this.nodes.childNodes[i as number].childNodes[0] as Element).classList.remove('e-active');
                                (this.nodes.childNodes[i as number].childNodes[0] as Element).classList.remove('e-active');
                            }
                        }
                    }
                }
            });
            this.datePicker.appendTo('#' + this.calendarId);
        }
    }

    /**
     * To find start and end value
     * @param startValue
     * @param endValue
     */

    private findPeriodValue(startValue: number, endValue: number): void {
        for (let index: number = 0; index < (this.sortedData).length; index++) {
            if ((this.sortedData[index as number]) >= startValue) {
                this.startValue = index;
                break;
            }
        }
        for (let index: number = this.sortedData.length - 1; index >= 0; index--) {
            if ((this.sortedData[index as number]) <= endValue) {
                this.endValue = index;
                break;
            }
        }
    }

    public findSelectedIndex(startDate: number, endDate: number, buttons: PeriodsModel[]): number {
        const daysDiffence: number = (endDate - startDate) / (1000 * 60 * 60 * 24);
        let selectedIndex: number;
        for (let i: number = 0; i < buttons.length; i++) {
            const period: PeriodsModel = buttons[i as number];
            if (period.intervalType === 'Years' && daysDiffence / 365 === period.interval) {
                selectedIndex = i;
            }
            else if (period.intervalType === 'Months' && (daysDiffence / 30 === period.interval || daysDiffence / 31 === period.interval)) {
                selectedIndex = i;
            }
            else if (period.intervalType === 'Days' && daysDiffence === period.interval) {
                selectedIndex = i;
            }
            else if (period.intervalType === 'Weeks' && daysDiffence / 7 === period.interval) {
                selectedIndex = i;
            }
            else if (period.intervalType === 'Hours' && daysDiffence * 24 === period.interval) {
                selectedIndex = i;
            }
            else if (period.intervalType === 'Seconds' && (daysDiffence * 24 * 3600) === period.interval) {
                selectedIndex = i;
            }
        }
        return selectedIndex;
    }

    private updateCustomElement(): ItemModel[] {
        const selector: ItemModel[] = [];
        const controlId: string = this.rootControl.element.id;
        const buttonStyles: string = 'text-transform: none; text-overflow: unset';
        const className: string = 'e-dropdown-btn e-btn e-flat';
        if (this.rootControl.getModuleName() === 'stockChart') {
            if ((<StockChart>this.rootControl).seriesType.length) {
                let SeriesElement: HTMLElement = createElement('button', { id: controlId + '_seriesType',
                styles: buttonStyles,
                className: className });
                SeriesElement.innerText = 'Series';
                selector.push({ template: SeriesElement,
                align: 'Left'});
            }
            if ((<StockChart>this.rootControl).indicatorType.length) {
                let indicatorElement: HTMLElement = createElement('button', {
                    id: controlId + '_indicatorType',
                    styles: buttonStyles,
                    className: className
                });  
                indicatorElement.innerText = 'Indicators';
                selector.push({ template: indicatorElement,
                align: 'Left'});
            }
            if ((<StockChart>this.rootControl).trendlineType.length) {
                let trendlineElement: HTMLElement = createElement('button', {
                    id: controlId + '_trendType',
                    styles: buttonStyles,
                    className: className
                });
                trendlineElement.innerText = 'Trendline';
                selector.push({ template: trendlineElement,
                align: 'Left'});
            }
        }
        return selector;
    }
    /**
     * To set and remove the period style.
     *
     * @param buttons
     * @param selectedIndex
     * @returns {void}
     */

    public setSelectedStyle(selectedIndex: number): void {
        for (let i: number = 0, length: number = this.nodes.childNodes.length; i < length; i++) {
            (this.nodes.childNodes[i as number].childNodes[0] as Element).classList.remove('e-active');
        }
        if (!isNullOrUndefined(selectedIndex)) {
            (this.nodes.childNodes[selectedIndex as number].childNodes[0] as Element).classList.add('e-flat');
            (this.nodes.childNodes[selectedIndex as number].childNodes[0] as Element).classList.add('e-active');
        }
    }

    /**
     * Button click handling.
     *
     * @param args
     * @param control
     * @param args
     * @param control
     */

    private buttonClick(args: ClickEventArgs, control: IPeriodSelectorControl): void {
        const clickedEle: ItemModel = args.item;
        const slider: RangeSlider = this.control.rangeSlider;
        const buttons: PeriodsModel[] = this.control.periods;
        const button: PeriodsModel = <PeriodsModel>buttons.filter((btn: PeriodsModel) => (btn.text === clickedEle.text));
        let updatedStart: number;
        let updatedEnd: number;
        buttons.map((period: PeriodsModel, index: number) => {
            if (period.selected && this.rootControl.getModuleName() !== 'stockChart') {
                period.selected = false;
            }
            if (period.text === args.item.text) {
                this.selectedIndex = (this.nodes.childNodes.length - buttons.length) + index;
                if (this.rootControl.getModuleName() !== 'stockChart') {
                    period.selected = true;
                }
            }
        });
        if (args.item.text !== '') {
            this.setSelectedStyle(this.selectedIndex);
        }
        if (slider && clickedEle.text) {
            slider.selectedPeriod = clickedEle.text;
        }
        if (clickedEle.text.toLowerCase() === 'all') {
            updatedStart = control.seriesXMin;
            updatedEnd = control.seriesXMax;
            if (slider) {
                slider.performAnimation(updatedStart, updatedEnd, this.control.rangeNavigatorControl);
            } else {
                (this.rootControl as StockChart).rangeChanged(updatedStart, updatedEnd);
            }
        } else if (clickedEle.text.toLowerCase() === 'ytd') {
            if (slider) {
                updatedStart = this.isDatetimeCategory ?
                    new Date(new Date(this.sortedData[Math.floor(slider.currentEnd)]).getFullYear().toString()).getTime() :
                    new Date(new Date(slider.currentEnd).getFullYear().toString()).getTime();
                updatedStart = this.isDatetimeCategory ? this.findStartValue(updatedStart, slider.currentEnd) : updatedStart;
                updatedEnd = slider.currentEnd;
                slider.performAnimation(updatedStart, updatedEnd, this.control.rangeNavigatorControl);
            } else {
                updatedStart = this.isDatetimeCategory ? new Date(
                    new Date(this.sortedData[Math.floor((this.rootControl as StockChart).currentEnd)]).getFullYear().toString()).getTime() :
                    new Date(new Date((this.rootControl as StockChart).currentEnd).getFullYear().toString()).getTime();
                updatedStart = this.isDatetimeCategory ? this.findStartValue(updatedStart, (this.rootControl as StockChart).currentEnd) :
                    updatedStart;
                updatedEnd = (this.rootControl as StockChart).currentEnd;
                (this.rootControl as StockChart).rangeChanged(updatedStart, updatedEnd);
            }
        } else if (clickedEle.text.toLowerCase() !== '') {
            if (slider) {
                updatedStart = this.changedRange(button[0].intervalType, slider.currentEnd, button[0].interval).getTime();
                updatedStart = this.isDatetimeCategory ? this.findStartValue(updatedStart, slider.currentEnd) : updatedStart;
                updatedEnd = slider.currentEnd;
                slider.performAnimation(updatedStart, updatedEnd, this.control.rangeNavigatorControl);
            } else {
                updatedStart = this.changedRange(button[0].intervalType, (this.rootControl as StockChart).currentEnd,
                                                 button[0].interval).getTime();
                updatedStart = this.isDatetimeCategory ? this.findStartValue(updatedStart, (this.rootControl as StockChart).currentEnd) :
                    updatedStart;
                updatedEnd = (this.rootControl as StockChart).currentEnd;
                (this.rootControl as StockChart).rangeChanged(updatedStart, updatedEnd);
            }
        }
        if (this.rootControl.getModuleName() === 'stockChart') {
            (this.rootControl as StockChart).zoomChange = false;
        }

        if (getElement(this.calendarId + '_popup') && !Browser.isDevice) {
            const element: HTMLElement = getElement(this.calendarId + '_popup') as HTMLElement;
            (element.querySelectorAll('.e-range-header')[0] as HTMLElement).style.display = 'none';
        }
    }
    /**
     * To find the start value
     * @param startValue
     * @param endValue
     */

    public findStartValue(startValue: number, endValue: number): number {
        for (let index: number = Math.floor(endValue); index >= 0; index--) {
            if (this.sortedData[index as number] <= startValue) {
                return (index + 1);
            }
        }
        return 0;
    }
    /**
     *
     * @param type updatedRange for selector
     * @param end
     * @param interval
     */

    public changedRange(type: RangeIntervalType, end: number, interval: number): Date {
        const result: Date = this.isDatetimeCategory ? new Date(this.sortedData[Math.floor(end)]) : new Date(end);
        switch (type) {
        case 'Quarter':
            result.setMonth(result.getMonth() - (3 * interval));
            break;
        case 'Months':
            result.setMonth(result.getMonth() - interval);
            break;
        case 'Weeks':
            result.setDate(result.getDate() - (interval * 7));
            break;
        case 'Days':
            result.setDate(result.getDate() - interval);
            break;
        case 'Hours':
            result.setHours(result.getHours() - interval);
            break;
        case 'Minutes':
            result.setMinutes(result.getMinutes() - interval);
            break;
        case 'Seconds':
            result.setSeconds(result.getSeconds() - interval);
            break;
        default:
            result.setFullYear(result.getFullYear() - interval);
            break;
        }
        return result;
    }

    /**
     * Get module name
     *
     * @returns {string}
     */

    protected getModuleName(): string {
        return 'PeriodSelector';
    }

    /**
     * To destroy the period selector.
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
        /**
         * destroy method
         */
    }
}
