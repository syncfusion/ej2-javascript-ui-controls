import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { IRichTextEditor } from '../base/interface';
import { IColorPickerEventArgs, IDropDownClickArgs } from '../../common/interface';
import { IAdvanceListItem, ICodeBlockItem } from '../../common';

/**
 * `ToolbarAction` module is used to toolbar click action
 */
export class ToolbarAction {
    /**
     *
     * @hidden
     * @private
     */
    public parent: IRichTextEditor;
    public constructor(parent?: IRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(events.toolbarClick, this.toolbarClick, this);
        this.parent.on(events.dropDownSelect, this.dropDownSelect, this);
        this.parent.on(events.colorPickerChanged, this.renderSelection, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
    }

    private toolbarClick(args: IDropDownClickArgs): void {
        if (this.parent.userAgentData.isSafari() && this.parent.formatter.editorManager.nodeSelection &&
            !this.parent.inputElement.contains(this.parent.getRange().startContainer)) {
            this.parent.notify(events.selectionRestore, {});
        }
        if (isNOU(args.item)) {
            return;
        }
        if (!isNOU((args.item as { [key: string]: object }).controlParent)) {
            // eslint-disable-next-line
            let activeEle: HTMLElement = (((args.item as { [key: string]: object }).controlParent as { [key: string]: object })
                .activeEle as HTMLElement);
            if (activeEle) {
                activeEle.tabIndex = -1;
            }
        }
        if (args.item.command === 'NumberFormatList' || args.item.command === 'BulletFormatList') {
            const targetEle: HTMLElement = (args.originalEvent.target as HTMLElement).nodeName === 'SPAN' ?
                (args.originalEvent.target as HTMLElement).closest('.e-rte-dropdown.e-split-btn') as HTMLElement : (args.originalEvent.target as HTMLElement);
            if (targetEle) {
                const hasNumberList: boolean | null = targetEle.classList.contains('e-rte-numberformatlist-dropdown');
                if (hasNumberList || targetEle.classList.contains('e-rte-bulletformatlist-dropdown')) {
                    args.item.command = 'Lists' ;
                    args.item.subCommand = args.item.subCommand === 'NumberFormatList' ? 'OL' : 'UL';
                }
            }
        }
        if (args.item.command === 'Lists') {
            if ((((args.originalEvent.target as HTMLElement).classList.contains('e-rte-numberformatlist-dropdown') ||
                (args.originalEvent.target as HTMLElement).classList.contains('e-rte-bulletformatlist-dropdown')) &&
                ((args.originalEvent.target as HTMLElement).classList.contains('e-dropdown-btn'))) ||
                (args.originalEvent.target as HTMLElement).classList.contains('e-caret')) {
                return;
            }
        }
        if (args.item.subCommand === 'HorizontalLine') {
            args.item.value = '<hr/>';
        }
        this.parent.notify(events.htmlToolbarClick, args);
        this.parent.notify(events.markdownToolbarClick, args);
    }
    private dropDownSelect(e: IDropDownClickArgs): void {
        this.parent.notify(events.selectionRestore, {});
        if (!(document.body.contains(document.body.querySelector('.e-rte-quick-toolbar'))
            && e.item && (e.item.command === 'Images' || e.item.command === 'Audios' || e.item.command === 'Videos' ||
			e.item.command === 'VideoLayoutOption' || e.item.command === 'Display' || e.item.command as string === 'Table'))) {
            const value: string = e.item.controlParent && this.parent.quickToolbarModule && this.parent.quickToolbarModule.tableQTBar
                && this.parent.quickToolbarModule.tableQTBar.element.contains(e.item.controlParent.element) ? 'Table' : null;
            if (e.item.command === 'Lists') {
                const listItem: IAdvanceListItem = {listStyle: e.item.value, listImage: e.item.listImage, type: e.item.subCommand};
                this.parent.formatter.process(this.parent, e, e.originalEvent, listItem);
            } else if (e.item.command === 'CodeBlock') {
                const codeBlockItems: ICodeBlockItem = { language: e.item.text, label: e.item.label, action: 'createCodeBlock' };
                this.parent.formatter.process(this.parent, e, e.originalEvent, codeBlockItems);
            } else {
                this.parent.formatter.process(this.parent, e, e.originalEvent, value);
            }
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
