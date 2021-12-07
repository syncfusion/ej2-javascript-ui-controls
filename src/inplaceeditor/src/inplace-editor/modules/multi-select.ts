import { closest, EmitType } from '@syncfusion/ej2-base';
import { MultiSelect as EJ2MultiSelect, MultiSelectModel, PopupEventArgs } from '@syncfusion/ej2-dropdowns';
import { Base } from './base-module';
import { InPlaceEditor } from '../base/inplace-editor';
import { NotifyParams, IComponent } from '../base/interface';

/**
 * The `MultiSelect` module is used configure the properties of Multi select type editor.
 */
export class MultiSelect implements IComponent {
    private base: Base;
    protected parent: InPlaceEditor;
    private isPopOpen: boolean = false;
    public compObj: EJ2MultiSelect = undefined;
    private openEvent: EmitType<PopupEventArgs>;
    private closeEvent: EmitType<PopupEventArgs>;

    public constructor(parent?: InPlaceEditor) {
        this.parent = parent;
        this.parent.multiSelectModule = this;
        this.base = new Base(this.parent, this);
    }

    public render(e: NotifyParams): void {
        const compModel: MultiSelectModel = { ...this.parent.model as MultiSelectModel };
        this.openEvent = compModel.open;
        this.closeEvent = compModel.close;
        compModel.open = this.openHandler.bind(this);
        compModel.close = this.closeHandler.bind(this);
        this.compObj = new EJ2MultiSelect(compModel);
        this.compObj.appendTo(e.target);
    }

    private openHandler(e: PopupEventArgs): void {
        this.isPopOpen = true;
        if (this.openEvent) {
            this.compObj.setProperties({ open: this.openEvent }, true);
            this.compObj.trigger('open', e);
        }
    }

    private closeHandler(e: PopupEventArgs): void {
        this.isPopOpen = false;
        if (this.closeEvent) {
            this.compObj.setProperties({ close: this.closeEvent }, true);
            this.compObj.trigger('close', e);
        }
    }

    public focus(): void {
        if (!this.isPopOpen) {
            const evt: MouseEvent = document.createEvent('MouseEvent') as MouseEvent;
            evt.initEvent('mousedown', true, true);
            (closest(this.compObj.element, '.e-multi-select-wrapper') as HTMLElement).dispatchEvent(evt);
        }
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
        return 'multi-select';
    }
}