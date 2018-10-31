import { createElement, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { Toolbar, ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Button } from '@syncfusion/ej2-buttons';
import { DateRangePicker, RangeEventArgs } from '@syncfusion/ej2-calendars';
import { Rect, getElement } from '../../common/utils/helper';
import { RangeIntervalType } from '../utils/enum';
import { RangeNavigator, RangeSlider, IRangeSelectorRenderEventArgs } from '../index';
import { PeriodsModel } from '../model/range-base-model';

/**
 * Period selector class
 */
export class PeriodSelector {

    public periodSelectorSize: Rect;
    public periodSelectorDiv: Element;
    public control: RangeNavigator;
    public toolbar: Toolbar;
    public datePicker: DateRangePicker;
    public triggerChange: boolean;
    private nodes: Node;
    public calendarId: string;
    public selectedIndex: number;

    //constructor for period selector
    constructor(rangeNavigator: RangeNavigator) {
        this.control = rangeNavigator;
    }

    /**
     * renderSelector div
     * @param control 
     */
    public renderSelectorElement(control: RangeNavigator): void {
        //render border
        let periodSelectorSize: Rect = this.periodSelectorSize;
        let thumbSize: number = control.themeStyle.thumbWidth;
        this.periodSelectorDiv = createElement('div', {
            id: control.element.id + '_Secondary_Element',
            styles: 'width: ' + (this.periodSelectorSize.width - thumbSize) + 'px;height: ' +
                this.periodSelectorSize.height + 'px;top:' +
                this.periodSelectorSize.y + 'px;left:' +
                (this.periodSelectorSize.x + thumbSize / 2) + 'px; position: absolute'
        });
        this.control.element.appendChild(this.periodSelectorDiv);
    }

    /**
     * renderSelector elements
     */
    public renderSelector(): void {
        let selectorElement: Element = createElement('div', { id: this.control.element.id + '_selector' });
        this.periodSelectorDiv.appendChild(selectorElement);
        //render toolbar
        let selector: ItemModel[] = [];
        let buttons: PeriodsModel[] = this.control.periodSelectorSettings.periods;
        for (let i: number = 0; i < buttons.length; i++) {
            selector.push({ align: 'Left', text: buttons[i].text });
        }
        this.calendarId = this.control.element.id + '_calendar';
        selector.push({ template: '<div><input type="text" id=' + this.calendarId + '></input></div>', align: 'Right' });
        let selctorArgs: IRangeSelectorRenderEventArgs = {
            selector: selector,
            name: 'RangeSelector',
            cancel: false,
            enableCustomFormat: false,
            content: ''
        };
        this.control.trigger('selectorRender', selctorArgs);
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
        //render calendar
        this.datePicker = new DateRangePicker({
            min: new Date(this.control.chartSeries.xMin),
            max: new Date(this.control.chartSeries.xMax),
            format: 'dd\'\/\'MM\'\/\'yyyy',
            placeholder: 'Select a range',
            showClearButton: false,
            startDate: new Date(this.control.startValue),
            endDate: new Date(this.control.endValue),
            created: (args: RangeEventArgs) => {
                if (selctorArgs.enableCustomFormat) {
                    let datePickerElement: HTMLElement = <HTMLElement>document.getElementsByClassName('e-date-range-wrapper')[0];
                    datePickerElement.style.display = 'none';
                    datePickerElement.insertAdjacentElement('afterend', createElement('div', { id: 'customRange',
                    innerHTML: selctorArgs.content, className: 'e-btn e-small' }));
                    getElement('customRange').insertAdjacentElement('afterbegin', (createElement('span', { id: 'dateIcon',
                    className: 'e-input-group-icon e-range-icon e-icons', styles: 'margin-right: 10px'})));
                    document.getElementById('customRange').onclick = () => {
                        this.datePicker.show(<HTMLElement>getElement('customRange'));
                    };
                }
            },
            change: (args: RangeEventArgs) => {
                if (this.triggerChange) {
                    this.control.rangeSlider.performAnimation(
                        (args.startDate as Date).getTime(), (args.endDate as Date).getTime(), this.control
                    );
                }
            }
        });
        this.datePicker.appendTo('#' + this.calendarId);
    }
    /**
     * To set and deselect the acrive style
     * @param buttons 
     */
    private setSelectedStyle(selectedIndex: number): void {
        if (this.control.disableRangeSelector) {
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
    private buttonClick(args: ClickEventArgs, control: RangeNavigator): void {
        let toolBarItems: ItemModel[] = this.toolbar.items;
        let clickedEle: ItemModel = args.item;
        let slider: RangeSlider = control.rangeSlider;
        let updatedStart: number;
        let updatedEnd: number;
        let buttons: PeriodsModel[] = control.periodSelectorSettings.periods;
        let button: PeriodsModel = <PeriodsModel>buttons.filter((btn: PeriodsModel) => (btn.text === clickedEle.text));
        buttons.map((period: PeriodsModel, index: number) => {
            if (period.text === args.item.text) {
                this.selectedIndex = (this.nodes.childNodes.length - buttons.length) + index;
            }
        });
        this.setSelectedStyle(this.selectedIndex);

        if (clickedEle.text.toLowerCase() === 'all') {
            updatedStart = control.chartSeries.xMin;
            updatedEnd = control.chartSeries.xMax;
            slider.performAnimation(updatedStart, updatedEnd, control);
        } else if (clickedEle.text.toLowerCase() === 'ytd') {
            updatedStart = new Date(new Date(slider.currentEnd).getFullYear().toString()).getTime();
            updatedEnd = slider.currentEnd;
            slider.performAnimation(updatedStart, updatedEnd, control);
        } else if (clickedEle.text.toLowerCase() !== '') {
            updatedStart = this.changedRange(button[0].intervalType, slider.currentEnd, button[0].interval).getTime();
            updatedEnd = slider.currentEnd;
            slider.performAnimation(updatedStart, updatedEnd, control);
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
    private changedRange(type: RangeIntervalType, end: number, interval: number): Date {
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