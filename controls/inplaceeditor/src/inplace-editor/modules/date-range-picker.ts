import { DateRangePicker as EJ2DateRangePicker, DateRangePickerModel } from '@syncfusion/ej2-calendars';
import { Base } from './base-module';
import { InPlaceEditor } from '../base/inplace-editor';
import { NotifyParams, IComponent } from '../base/interface';

/**
 * The `DateRangePicker` module is used configure the properties of Date range picker type editor.
 */
export class DateRangePicker implements IComponent {
    private base: Base;
    public compObj: EJ2DateRangePicker = undefined;
    protected parent: InPlaceEditor;

    public constructor(parent?: InPlaceEditor) {
        this.parent = parent;
        this.parent.dateRangeModule = this;
        this.base = new Base(this.parent, this);
    }

    public render(e: NotifyParams): void {
        this.compObj = new EJ2DateRangePicker(this.parent.model as DateRangePickerModel);
        this.compObj.appendTo(e.target as HTMLInputElement);
    }

    public focus(): void {
        this.compObj.element.focus();
    }

    /**
     * For internal use only - Get the module name.
     * 
     * @returns {string} - returns the string
     */
    private getModuleName(): string {
        return 'date-range-picker';
    }

    public updateValue(e: NotifyParams): void {
        if (this.compObj && e.type === 'DateRange') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    }

    /**
     * Destroys the module.
     *
     * @function destroy
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.base.destroy();
    }
}