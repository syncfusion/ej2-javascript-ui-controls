import { ComboBox as EJ2ComboBox, ComboBoxModel } from '@syncfusion/ej2-dropdowns';
import { Base } from './base-module';
import { InPlaceEditor } from '../base/inplace-editor';
import { NotifyParams, IComponent } from '../base/interface';

/**
 * The `ComboBox` module is used configure the properties of Combo box type editor.
 */
export class ComboBox implements IComponent {
    private base: Base;
    protected parent: InPlaceEditor;
    public compObj: EJ2ComboBox = undefined;

    constructor(parent?: InPlaceEditor) {
        this.parent = parent;
        this.parent.comboBoxModule = this;
        this.base = new Base(this.parent, this);
    }

    public render(e: NotifyParams): void {
        this.compObj = new EJ2ComboBox(this.parent.model as ComboBoxModel);
        this.compObj.appendTo(e.target);
    }

    public focus(): void {
        this.compObj.element.focus();
    }

    /**
     * @hidden
     */
    public showPopup(): void {
        this.compObj.focusIn();
        this.compObj.showPopup();
    }

    public updateValue(e: NotifyParams): void {
        if (this.compObj && e.type === 'ComboBox') {
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
        return 'combo-box';
    }
}