import { Slider as EJ2Slider, SliderModel } from '@syncfusion/ej2-inputs';
import { Base } from './base-module';
import { InPlaceEditor } from '../base/inplace-editor';
import { NotifyParams, IComponent } from '../base/interface';

/**
 * The `Slider` module is used configure the properties of Slider type editor.
 */
export class Slider implements IComponent {
    private base: Base;
    protected parent: InPlaceEditor;
    public compObj: EJ2Slider = undefined;

    public constructor(parent?: InPlaceEditor) {
        this.parent = parent;
        this.parent.sliderModule = this;
        this.base = new Base(this.parent, this);
    }

    public render(e: NotifyParams): void {
        this.compObj = new EJ2Slider(this.parent.model as SliderModel);
        this.compObj.appendTo(e.target as HTMLInputElement);
    }

    public focus(): void {
        this.compObj.element.focus();
    }

    public updateValue(e: NotifyParams): void {
        if (this.compObj && e.type === 'Slider') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    }

    public refresh(): void {
        this.compObj.refresh();
    }

    /**
     * Destroys the slider module.
     *
     * @function destroy
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.base.destroy();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - returns the string
     */
    private getModuleName(): string {
        return 'slider';
    }
}