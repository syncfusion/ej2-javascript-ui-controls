import { createElement, isNullOrUndefined, Browser, remove } from '@syncfusion/ej2-base';
import { Toolbar, ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { DateRangePicker, RangeEventArgs } from '@syncfusion/ej2-calendars';
import { getElement } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { RangeIntervalType } from '../utils/enum';
import { RangeNavigator, RangeSlider } from '../../range-navigator/index';
import { PeriodsModel } from '../model/base-model';
import { ISelectorRenderArgs, IPeriodSelectorControl, IRangeSelectorRenderEventArgs } from '../../common/model/interface';
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
    public datePickerTriggered: boolean;
    public rootControl: StockChart | RangeNavigator;
    //constructor for period selector
    constructor(control: RangeNavigator | StockChart) {
        this.rootControl = control;
    }
    /**
     * To set the control values
     * @param control
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
     *  To initialize the period selector properties
     */
    public appendSelector(options: ISelectorRenderArgs, x : number = 0): void {
        this.renderSelectorElement(null, options, x);
        this.renderSelector();
    }
    /**
     * renderSelector div
     * @param control
     */
    public renderSelectorElement(control?: RangeNavigator, options?: ISelectorRenderArgs, x? : number): void {
        //render border
        this.periodSelectorSize = control ? this.periodSelectorSize : new Rect(x, (this.rootControl as StockChart).titleSize.height,
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
     * renderSelector elements
     */
    // tslint:disable-next-line:max-func-body-length
    public renderSelector(): void {
        this.setControlValues(this.rootControl);
        let enableCustom: boolean = true;
        let selectorElement: Element = createElement('div', { id: this.control.element.id + '_selector' });
        this.periodSelectorDiv.appendChild(selectorElement); let buttons: PeriodsModel[] = this.control.periods;
        let selector: ItemModel[] = this.updateCustomElement();
        let buttonStyles: string = 'text-transform: none; text-overflow: unset';
        for (let i: number = 0; i < buttons.length; i++) {
            selector.push({ align: 'Left', text: buttons[i].text });
        }
        if (this.rootControl.getModuleName() === 'stockChart') {
            enableCustom = (<StockChart>this.rootControl).enableCustomRange;
        }
        let selctorArgs: IRangeSelectorRenderEventArgs;
        if (enableCustom) {
            this.calendarId = this.control.element.id + '_calendar';
            selector.push({ template: '<button id=' + this.calendarId + '></button>', align: 'Right' });
            selctorArgs = {
                selector: selector, name: 'RangeSelector', cancel: false, enableCustomFormat: true, content: 'Date Range'
            };
        }
        if (this.rootControl.getModuleName() === 'stockChart') {
            selector.push({ template: createElement('button', { id: 'resetClick', innerHTML: 'Reset',
                                        styles: buttonStyles, className: 'e-dropdown-btn e-btn' }),
                            align: 'Right'});
            if ((<StockChart>this.rootControl).exportType.indexOf('Print') > -1) {
                selector.push({ template: createElement('button', { id: 'print', innerHTML: 'Print', styles: buttonStyles,
                                 className: 'e-dropdown-btn e-btn' }),
                            align: 'Right'});
            }
            if ((<StockChart>this.rootControl).exportType.length) {
                selector.push({ template: createElement('button', { id: 'export', innerHTML: 'Export', styles: buttonStyles,
                                    className: 'e-dropdown-btn e-btn' }),
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
                        if (period.selected) {
                            this.control.startValue = this.changedRange(
                                period.intervalType, this.control.endValue, period.interval
                            ).getTime();
                            this.selectedIndex = (this.nodes.childNodes.length - buttons.length) + index;
                        }
                    });
                }
                this.setSelectedStyle(this.selectedIndex);
            }
        });
        this.toolbar.appendTo(selectorElement as HTMLElement);
        this.triggerChange = true;
        this.datePicker = new DateRangePicker({
            min: new Date(this.control.seriesXMin),
            max: new Date(this.control.seriesXMax),
            format: 'dd\'\/\'MM\'\/\'yyyy', placeholder: 'Select a range',
            showClearButton: false, startDate: new Date(this.control.startValue),
            endDate: new Date(this.control.endValue),
            created: (args: RangeEventArgs) => {
                if (selctorArgs.enableCustomFormat) {
                    let datePickerElement: HTMLElement = <HTMLElement>document.getElementsByClassName('e-date-range-wrapper')[0];
                    datePickerElement.style.display = 'none';
                    datePickerElement.insertAdjacentElement('afterend', createElement('div', {
                        id: 'customRange',
                        innerHTML: selctorArgs.content, className: 'e-btn e-dropdown-btn',
                        styles: 'font-family: "Segoe UI"; font-size: 14px; font-weight: 500; text-transform: none '
                    }));
                    getElement('customRange').insertAdjacentElement('afterbegin', (createElement('span', {
                        id: 'dateIcon', className: 'e-input-group-icon e-range-icon e-btn-icon e-icons',
                        styles: (this.rootControl.theme === 'Material') ? 'padding-top: 4px' : 'padding-top: 5px'
                    })));
                    document.getElementById('customRange').onclick = () => {
                        this.datePicker.show(<HTMLElement>getElement('customRange'));
                    };
                }
            },
            change: (args: RangeEventArgs) => {
                if (this.triggerChange) {
                    if (this.control.rangeSlider && args.event) {
                        this.control.rangeSlider.performAnimation(
                            (args.startDate as Date).getTime(), (args.endDate as Date).getTime(), this.control.rangeNavigatorControl
                        );
                    } else if (args.event) {
                        (this.rootControl as StockChart).rangeChanged((args.startDate as Date).getTime(),
                                                                      (args.endDate as Date).getTime());
                    }
                    this.nodes = this.toolbar.element.querySelectorAll('.e-toolbar-left')[0];
                    if (!(this.rootControl as StockChart).resizeTo && this.control.rangeSlider && this.control.rangeSlider.isDrag) {
                        /**
                         * Issue: While disabling range navigator console error throws
                         * Fix:Check with rangeSlider present or not. Then checked with isDrag.
                         */
                        for (let i: number = 0, length: number = this.nodes.childNodes.length; i < length; i++) {
                            (this.nodes.childNodes[i].childNodes[0] as Element).classList.remove('e-active');
                            (this.nodes.childNodes[i].childNodes[0] as Element).classList.remove('e-active');
                        }
                    }
                }
            }
        });
        this.datePicker.appendTo('#' + this.calendarId);
    }
    private updateCustomElement(): ItemModel[] {
        let selector: ItemModel[] = [];
        let buttonStyles: string = 'text-transform: none; text-overflow: unset';
        if (this.rootControl.getModuleName() === 'stockChart') {
            if ((<StockChart>this.rootControl).seriesType.length) {
                selector.push({ template: createElement('button', { id: 'seriesType', innerHTML: 'Series', styles: buttonStyles }),
                            align: 'Left'});
            }
            if ((<StockChart>this.rootControl).indicatorType.length) {
                selector.push({ template: createElement('button', { id: 'indicatorType', innerHTML: 'Indicators', styles: buttonStyles }),
                            align: 'Left'});
            }
            if ((<StockChart>this.rootControl).trendlineType.length) {
                selector.push({ template: createElement('button', { id: 'trendType', innerHTML: 'Trendline', styles: buttonStyles }),
                            align: 'Left'});
            }
        }
        return selector;
    }
    /**
     * To set and deselect the acrive style
     * @param buttons
     */
    private setSelectedStyle(selectedIndex: number): void {
        if (this.control.disableRangeSelector || this.rootControl.getModuleName() === 'stockChart') {
            for (let i: number = 0, length: number = this.nodes.childNodes.length; i < length; i++) {
                (this.nodes.childNodes[i].childNodes[0] as Element).classList.remove('e-active');
                (this.nodes.childNodes[i].childNodes[0] as Element).classList.remove('e-active');
            }
            (this.nodes.childNodes[selectedIndex].childNodes[0] as Element).classList.add('e-flat');
            (this.nodes.childNodes[selectedIndex].childNodes[0] as Element).classList.add('e-active');
        }
    }

    /**
     * Button click handling
     */
    private buttonClick(args: ClickEventArgs, control: IPeriodSelectorControl): void {
        let toolBarItems: ItemModel[] = this.toolbar.items;
        let clickedEle: ItemModel = args.item;
        let slider: RangeSlider = this.control.rangeSlider;
        let updatedStart: number;
        let updatedEnd: number;
        let buttons: PeriodsModel[] = this.control.periods;
        let button: PeriodsModel = <PeriodsModel>buttons.filter((btn: PeriodsModel) => (btn.text === clickedEle.text));
        buttons.map((period: PeriodsModel, index: number) => {
            if (period.text === args.item.text) {
                this.selectedIndex = (this.nodes.childNodes.length - buttons.length) + index;
            }
        });
        if (args.item.text !== '') {
            this.setSelectedStyle(this.selectedIndex);
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
                updatedStart = new Date(new Date(slider.currentEnd).getFullYear().toString()).getTime();
                updatedEnd = slider.currentEnd;
                slider.performAnimation(updatedStart, updatedEnd, this.control.rangeNavigatorControl);
            } else {
                updatedStart = new Date(new Date((this.rootControl as StockChart).currentEnd).getFullYear().toString()).getTime();
                updatedEnd = (this.rootControl as StockChart).currentEnd;
                (this.rootControl as StockChart).rangeChanged(updatedStart, updatedEnd);
            }
        } else if (clickedEle.text.toLowerCase() !== '') {
            if (slider) {
                updatedStart = this.changedRange(button[0].intervalType, slider.currentEnd, button[0].interval).getTime();
                updatedEnd = slider.currentEnd;
                slider.performAnimation(updatedStart, updatedEnd, this.control.rangeNavigatorControl);
            } else {
                updatedStart = this.changedRange(button[0].intervalType, (this.rootControl as StockChart).currentEnd,
                                                 button[0].interval).getTime();
                updatedEnd = (this.rootControl as StockChart).currentEnd;
                (this.rootControl as StockChart).rangeChanged(updatedStart, updatedEnd);
            }
        }
        if (this.rootControl.getModuleName() === 'stockChart') {
            (this.rootControl as StockChart).zoomChange = false;
        }

        if (getElement(this.calendarId + '_popup') && !Browser.isDevice) {
            let element: HTMLElement = getElement(this.calendarId + '_popup') as HTMLElement;
            (element.querySelectorAll('.e-range-header')[0] as HTMLElement).style.display = 'none';
        }
    }
    /**
     *
     * @param type updatedRange for selector
     * @param end
     * @param interval
     */
    public changedRange(type: RangeIntervalType, end: number, interval: number): Date {
        let result: Date = new Date(end);
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
    };

    /**
     * Get module name
     */
    protected getModuleName(): string {
        return 'PeriodSelector';
    }

    /**
     * To destroy the period selector.
     * @return {void}
     * @private
     */
    public destroy(): void {
        /**
         * destroy method
         */
    }
}
