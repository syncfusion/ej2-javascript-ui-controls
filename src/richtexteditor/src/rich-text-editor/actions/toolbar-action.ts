import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { IRichTextEditor, IColorPickerEventArgs, IDropDownClickArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';

/**
 * `ToolbarAction` module is used to toolbar click action
 */
export class ToolbarAction {
    protected parent: IRichTextEditor;
    private serviceLocator: ServiceLocator;
    constructor(parent?: IRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
        this.serviceLocator = new ServiceLocator;
        this.serviceLocator.register('rendererFactory', new RendererFactory);
    }

    private addEventListener(): void {
        this.parent.on(events.toolbarClick, this.toolbarClick, this);
        this.parent.on(events.dropDownSelect, this.dropDownSelect, this);
        this.parent.on(events.colorPickerChanged, this.renderSelection, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
    }

    private toolbarClick(args: IDropDownClickArgs): void {
        if (isNOU(args.item)) { return; }
        if (!isNOU((args.item as { [key: string]: object }).controlParent)) {
            let activeEle: HTMLElement = (((args.item as { [key: string]: object }).controlParent as { [key: string]: object })
                .activeEle as HTMLElement);
            if (activeEle) {
                activeEle.tabIndex = -1;
            }
        }
        this.parent.notify(events.htmlToolbarClick, args);
        this.parent.notify(events.markdownToolbarClick, args);
    }
    private dropDownSelect(e: IDropDownClickArgs): void {
        this.parent.notify(events.selectionRestore, {});
        if (!(document.body.contains(document.body.querySelector('.e-rte-quick-toolbar'))
            && e.item && (e.item.command === 'Images' || e.item.command === 'Display' || e.item.command as string === 'Table'))) {
            this.parent.formatter.process(this.parent, e, e.originalEvent, null);
        }
        this.parent.notify(events.selectionSave, {});
    }

    private renderSelection(args: IColorPickerEventArgs): void {
        this.parent.notify(events.selectionRestore, {});
        this.parent.formatter.process(this.parent, args, args.originalEvent, null);
        this.parent.notify(events.selectionSave, {});
    }

    private removeEventListener(): void {
        this.parent.off(events.toolbarClick, this.toolbarClick);
        this.parent.off(events.dropDownSelect, this.dropDownSelect);
        this.parent.off(events.colorPickerChanged, this.renderSelection);
        this.parent.off(events.destroy, this.removeEventListener);
    }
}