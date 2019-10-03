import { closest } from '@syncfusion/ej2-base';
import { MultiSelect as EJ2MultiSelect, MultiSelectModel } from '@syncfusion/ej2-dropdowns';
import { Base } from './base-module';
import { InPlaceEditor } from '../base/inplace-editor';
import { NotifyParams, IComponent } from '../base/interface';

/**
 * The `MultiSelect` module is used configure the properties of Multi select type editor.
 */
export class MultiSelect implements IComponent {
    private base: Base;
    protected parent: InPlaceEditor;
    public compObj: EJ2MultiSelect = undefined;

    constructor(parent?: InPlaceEditor) {
        this.parent = parent;
        this.parent.multiSelectModule = this;
        this.base = new Base(this.parent, this);
    }

    public render(e: NotifyParams): void {
        this.compObj = new EJ2MultiSelect(this.parent.model as MultiSelectModel, e.target);
    }

    /**

     */
    public showPopup(): void {
        this.compObj.focusIn();
        this.compObj.showPopup();
    }

    public focus(): void {
        closest(this.compObj.element, '.e-multi-select-wrapper').dispatchEvent(new MouseEvent('mousedown'));
    }

    public updateValue(e: NotifyParams): void {
        if (this.compObj && e.type === 'MultiSelect') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    }

    public getRenderValue(): void {
        this.parent.printValue = this.compObj.text;
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
        return 'multi-select';
    }
}