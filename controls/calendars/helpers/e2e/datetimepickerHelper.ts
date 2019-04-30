import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class datetimepickerHelper extends TestHelper {
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

    getDateIcon() {
        return this.selector('.e-datetime-wrapper .e-date-icon');
    }

    getTimeIcon() {
        return this.selector('.e-datetime-wrapper .e-time-icon');
    }

    getClearIcon() {
        return this.selector('.e-datetime-wrapper .e-clear-icon');
    }

    getInputFocus() {
        return this.selector('.e-datetime-wrapper.e-input-focus');
    }

    getPopupElement() {
        return this.selector('.e-datepicker.e-popup-wrapper');
    }

    getCalender() {
        return this.selector('.e-datepicker .e-calendar.e-lib.e-keyboard');
    }

    getCalendarMonthHeader() {
        return this.selector('.e-datepicker .e-calendar .e-header.e-month');
    }

    getCalendarYearHeader() {
        return this.selector('.e-datepicker .e-calendar .e-header.e-year');
    }

    getCalendarDecadeHeader() {
        return this.selector('.e-datepicker .e-calendar .e-header.e-decade');
    }

    getTitleElement() {
        return this.selector('.e-datepicker .e-calendar .e-header .e-day.e-title');
    }

    getIconContainer() {
        return this.selector('.e-datepicker .e-calendar .e-header .e-icon-container');
    }

    getPrevIcon() {
        return this.selector('.e-datepicker .e-calendar .e-header .e-icon-container .e-prev');
    }

    getNextIcon() {
        return this.selector('.e-datepicker .e-calendar .e-header .e-icon-container .e-next');
    }

    getWeeKHeader() {
        return this.selector('.e-datepicker .e-calendar .e-content .e-week-header');
    }

    getCellElement() {
        return this.selector('.e-datepicker .e-calendar .e-content .e-cell');
    }

    getOtherMonthCellElement() {
        return this.selector('.e-datepicker .e-calendar .e-content .e-cell.e-other-month');
    }

    getSelectedCellElement() {
        return this.selector('.e-datepicker .e-calendar .e-content .e-cell.e-selected');
    }

    getTodayElement() {
        return this.selector('.e-datepicker .e-calendar .e-content .e-cell.e-today');
    }

    getDisabledElement() {
        return this.selector('.e-datepicker .e-calendar .e-content .e-cell.e-disabled.e-overlay');
    }

    getFocusedElement() {
        return this.selector('.e-datepicker .e-calendar .e-content .e-cell.e-focused-date');
    }

    getWeenkendElement() {
        return this.selector('.e-datepicker .e-calendar .e-content .e-cell.e-weekend');
    }

    getFooterContainer() {
        return this.selector('.e-datepicker .e-calendar .e-footer-container');
    }

    getToday() {
        return this.selector('.e-datepicker .e-calendar .e-footer-container .e-today');
    }

    getWeekNumber() {
        return this.selector('.e-datepicker .e-calendar.e-week-number .e-content .e-cell.e-week-number');
    }

    /*timepopup*/

    getTimePopup() {
        return this.selector('.e-datetimepicker.e-popup');
    }

    getTimePopupContent() {
        return this.selector('.e-datetimepicker.e-popup .e-content .e-list-parent');
    }

    getTimePopupItem() {
        return this.selector('.e-datetimepicker.e-popup .e-content .e-list-parent .e-list-item');
    }

    getTimePopupActiveItem() {
        return this.selector('.e-datetimepicker.e-popup .e-content .e-list-parent .e-list-item.e-active');
    }

    getTimePopupHoverItem() {
        return this.selector('.e-datetimepicker.e-popup .e-content .e-list-parent .e-list-item.e-hover');
    }

    getTimePopupDisabledItem() {
        return this.selector('.e-datetimepicker.e-popup .e-content .e-list-parent .e-list-item.e-disabled');
    }
}

