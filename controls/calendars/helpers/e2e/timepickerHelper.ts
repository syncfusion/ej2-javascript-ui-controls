import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class timepickerHelper extends TestHelper {
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

    getTimePickerInput() {
        return this.selector('.e-control.e-timepicker.e-lib.e-input');
    }

    getTimePickerIcon() {
        return this.selector('.e-time-wrapper .e-time-icon');
    }

    getTimePickerClearIcon() {
        return this.selector('.e-time-wrapper .e-clear-icon');
    }

    getTimePicker() {
        return this.selector('.e-input-group.e-control-wrapper');
    }

    getTimePickerContent() {
        return this.selector('.e-timepicker .e-content');
    }

    getTimePickerListContent() {
        return this.selector('.e-timepicker .e-content .e-list-parent');
    }

    getTimePickerListItem() {
        return this.selector('.e-timepicker .e-content .e-list-parent .e-list-item');
    }

    getTimePickerDisabledTime() {
        return this.selector('.e-timepicker .e-content .e-list-parent .e-list-item.e-disabled');
    }

    getTimePickerSelectedTime() {
        return this.selector('.e-timepicker .e-content .e-list-parent .e-list-item.e-active');
    }
}

