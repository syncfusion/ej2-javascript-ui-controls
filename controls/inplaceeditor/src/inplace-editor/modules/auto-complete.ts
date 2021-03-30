
import { AutoComplete as EJ2AutoComplete, AutoCompleteModel } from '@syncfusion/ej2-dropdowns';
import { Base } from './base-module';
import { InPlaceEditor } from '../base/inplace-editor';
import { NotifyParams, IComponent } from '../base/interface';

/**
 * The `AutoComplete` module is used configure the properties of Auto complete type editor.
 */
export class AutoComplete implements IComponent {
    private base: Base;
    protected parent: InPlaceEditor;
    public compObj: EJ2AutoComplete = undefined;

    public constructor(parent?: InPlaceEditor) {
        this.parent = parent;
        this.parent.atcModule = this;
        this.base = new Base(this.parent, this);
    }

    public render(e: NotifyParams): void {
        this.compObj = new EJ2AutoComplete(this.parent.model as AutoCompleteModel);
        this.compObj.appendTo(e.target);
    }

    /**
     * @hidden
     * @returns {void}
     */
    public showPopup(): void {
        this.compObj.focusIn();
        this.compObj.showPopup();
    }

    public focus(): void {
        this.compObj.element.focus();
    }

    public updateValue(e: NotifyParams): void {
        if (this.compObj && e.type === 'AutoComplete') {
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

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - returns the string
     */
    private getModuleName(): string {
        return 'auto-complete';
    }
}