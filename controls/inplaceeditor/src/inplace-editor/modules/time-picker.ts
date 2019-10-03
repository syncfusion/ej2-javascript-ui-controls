import { TimePicker as EJ2TimePicker, TimePickerModel } from '@syncfusion/ej2-calendars';
import { Base } from './base-module';
import { InPlaceEditor } from '../base/inplace-editor';
import { NotifyParams, IComponent } from '../base/interface';

/**
 * The `TimePicker` module is used configure the properties of Time picker type editor.
 */
export class TimePicker implements IComponent {
    private base: Base;
    protected parent: InPlaceEditor;
    public compObj: EJ2TimePicker = undefined;

    constructor(parent?: InPlaceEditor) {
        this.parent = parent;
        this.parent.timeModule = this;
        this.base = new Base(this.parent, this);
    }

    public render(e: NotifyParams): void {
        this.compObj = new EJ2TimePicker(this.parent.model as TimePickerModel, e.target as HTMLInputElement);
    }

    public focus(): void {
        this.compObj.focusIn();
    }

    public updateValue(e: NotifyParams): void {
        if (this.compObj && e.type === 'Time') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    }

    /**
     * Destroys the module.
     * @method destroy
     * @return {void}

     */
    public destroy(): void {
        this.base.destroy();
    }

    /**
     * For internal use only - Get the module name.
     */
    private getModuleName(): string {
        return 'time-picker';
    }
}