
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

    constructor(parent?: InPlaceEditor) {
        this.parent = parent;
        this.parent.atcModule = this;
        this.base = new Base(this.parent, this);
    }

    public render(e: NotifyParams): void {
        (this.parent.model as AutoCompleteModel).showClearButton = true;
        this.compObj = new EJ2AutoComplete(this.parent.model as AutoCompleteModel, e.target);
    }

    public focus(): void {
        this.compObj.element.focus();
    }

    public updateValue(e: NotifyParams): void {
        if (this.compObj && e.type === 'AutoComplete') {
            this.parent.setProperties({ value: this.compObj.value }, true);
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
        return 'auto-complete';
    }
}