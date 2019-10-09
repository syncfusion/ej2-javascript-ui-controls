import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class datepickerHelper extends TestHelper {
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
        return this.selector('.e-date-wrapper .e-date-icon');
    }

    getClearIcon() {
        return this.selector('.e-date-wrapper .e-clear-icon');
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
        return this.selector('.e-datepicker .e-calendar .e-header.e-month .e-day.e-title');
    }

    getIconContainer() {
        return this.selector('.e-datepicker .e-calendar .e-header .e-icon-container');
    }

    getPreviousIcon() {
        return this.selector('.e-datepicker .e-calendar .e-header .e-icon-container .e-prev');
    }

    getNextIcon() {
        return this.selector('.e-datepicker .e-calendar .e-header .e-icon-container .e-next');
    }

    getWeekHeader() {
        return this.selector('.e-datepicker .e-calendar .e-content.e-month .e-week-header');
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

    getDisabledElement() {
        return this.selector('.e-datepicker .e-calendar .e-content .e-cell.e-disabled.e-overlay');
    }

    getDisabledWeekEndElement() {
        return this.selector('.e-datepicker .e-calendar .e-content .e-cell.e-disabled.e-overlay.e-weekend');
    }

    getTodayCellElement() {
        return this.selector('.e-datepicker .e-calendar .e-content  .e-cell.e-today');
    }

    getWeenkendElement() {
        return this.selector('.e-datepicker .e-calendar .e-content .e-cell.e-weekend');
    }

    getFooterContainer() {
        return this.selector('.e-datepicker .e-calendar .e-footer-container');
    }

    getTodayElement() {
        return this.selector('.e-datepicker .e-calendar .e-footer-container .e-today');
    }
}

