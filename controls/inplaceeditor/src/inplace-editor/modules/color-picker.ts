import { ColorPicker as EJ2ColorPicker, ColorPickerModel } from '@syncfusion/ej2-inputs';
import { Base } from './base-module';
import { InPlaceEditor } from '../base/inplace-editor';
import { NotifyParams, IComponent } from '../base/interface';

/**
 * The `ColorPicker` module is used configure the properties of Color picker type editor.
 */
export class ColorPicker implements IComponent {
    private base: Base;
    protected parent: InPlaceEditor;
    public compObj: EJ2ColorPicker = undefined;

    constructor(parent?: InPlaceEditor) {
        this.parent = parent;
        this.parent.colorModule = this;
        this.base = new Base(this.parent, this);
    }

    public render(e: NotifyParams): void {
        this.compObj = new EJ2ColorPicker(this.parent.model as ColorPickerModel, e.target as HTMLInputElement);
    }

    public focus(): void {
        this.compObj.element.focus();
    }

    public updateValue(e: NotifyParams): void {
        if (this.compObj && e.type === 'Color') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    }

    /**
     * Destroys the module.
     * @method destroy
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.base.destroy();
    }

    /**
     * For internal use only - Get the module name.
     */
    private getModuleName(): string {
        return 'color-picker';
    }
}