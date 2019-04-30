import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class daterangepickerHelper extends TestHelper {
    // tslint:disable
    public id: string;
    public wrapperFn: Function;

    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn
        }
        return this;
    }

    selector(arg: any) {
        return (this.wrapperFn ? this.wrapperFn(arg) : arg);
    }

    getElement() {
        return this.selector('#' + this.id);
    }

    getRangeIcon() {
        return this.selector('.e-date-range-wrapper .e-range-icon');
    }

    getClearIcon() {
        return this.selector('.e-date-range-wrapper .e-clear-icon');
    }

    getInputFocus() {
        return this.selector('.e-date-range-wrapper.e-input-focus');
    }

    getRangeContainer() {
        return this.selector('.e-daterangepicker .e-date-range-container');
    }

    getRangeHeader() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-range-header');
    }

    getStartLabelElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-range-header .e-start-end .e-start-label');
    }

    getEndLabelElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-range-header .e-start-end .e-end-label');
    }

    getRangeChangeIconElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-range-header .e-start-end .e-change-icon ');
    }

    getCalendarContainer() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container');
    }

    getLeftCalendarContainer() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-left-container');
    }

    getRightCalendarContainer() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-right-container');
    }

    getLeftCalendar() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-left-container .e-left-calendar');
    }

    getRightCalendar() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-right-container .e-right-calendar');
    }

    /*left Calendar*/
    getLeftCalendarMonthHeaderElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-left-container .e-left-calendar .e-header.e-month');
    }

    getLeftCalendarPrevIconElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-left-container .e-left-calendar .e-header.e-month .e-prev');
    }

    getLeftCalendarNextIconElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-left-container .e-left-calendar .e-header.e-month .e-next');
    }

    getleftCalndarWeekHeaderElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-left-container .e-left-calendar .e-content.e-month .e-week-header');
    }

    getleftcalendarCellElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-left-container .e-left-calendar .e-content.e-month .e-cell');
    }

    getleftCalendarWeekNumberElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-left-container .e-left-calendar .e-content.e-month .e-cell.e-week-number');
    }

    /*right Calendar*/
    getRightCalendarMonthHeaderElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-right-container .e-right-calendar .e-header.e-month');
    }

    getRightCalendarPrevIconElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-right-container .e-right-calendar .e-header.e-month .e-prev');
    }

    getRightCalendarNextIconElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-right-container .e-right-calendar .e-header.e-month .e-next');
    }

    getRightCalndarWeekHeaderElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-right-container .e-right-calendar .e-content.e-month .e-week-header');
    }

    getRightcalendarCellElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-right-container .e-right-calendar .e-content.e-month .e-cell');
    }

    getRightCalendarWeekNumberElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-right-container .e-right-calendar .e-content.e-month .e-cell.e-week-number');
    }

    /*common*/
    getSelectedStartDateCellElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-content.e-month .e-cell.e-selected.e-start-date');
    }

    getSelectedEndDateCellElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-content.e-month .e-cell.e-selected.e-end-date');
    }

    getFocusedCellElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-content.e-month .e-cell.e-focused-date');
    }

    getRangeOverCellElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-content.e-month .e-cell.e-range-hover');
    }

    getDisabledCellElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-content.e-month .e-cell.e-disabled.e-overlay');
    }

    getOtherMonthCellElement() {
        return this.selector('.e-daterangepicker .e-date-range-container .e-calendar-container .e-content.e-month .e-cell.e-other-month');
    }
}

