import { extend, isNullOrUndefined, KeyboardEventArgs, Browser } from '@syncfusion/ej2-base';
import * as CONSTANT from '../base/constant';
import { updateUndoRedoStatus } from '../base/util';
import { ActionBeginEventArgs, IDropDownItemModel, IShowPopupArgs } from './../base/interface';
import { IRichTextEditor, IEditorModel, NotifyArgs } from './../base/interface';
import { IHtmlFormatterCallBack, IMarkdownFormatterCallBack, IUndoCallBack } from './../../common/interface';
import { KEY_DOWN, KEY_UP } from './../../common/constant';
import { MarkdownUndoRedoData } from '../../markdown-parser/base/interface';
import { IHtmlUndoRedoData } from '../../editor-manager/base/interface';
/**
 * Formatter
 * @hidden
 */
export class Formatter {
    public editorManager: IEditorModel;
    /**
     * To execute the command
     * @param  {IRichTextEditor} self
     * @param  {ActionBeginEventArgs} args
     * @param  {MouseEvent|KeyboardEvent} event
     * @param  {NotifyArgs} value
     */
    public process(self: IRichTextEditor, args: ActionBeginEventArgs, event: MouseEvent | KeyboardEvent, value: NotifyArgs): void {
        let selection: Selection = self.contentModule.getDocument().getSelection();
        let range: Range = (selection.rangeCount > 0) ? selection.getRangeAt(selection.rangeCount - 1) : null;
        if (!isNullOrUndefined(args)
            && args.item.command
            && args.item.command !== 'Table'
            && args.item.command !== 'Actions'
            && args.item.command !== 'Links'
            && args.item.command !== 'Images'
            && range
            && !(self.contentModule.getEditPanel().contains(this.getAncestorNode(range.commonAncestorContainer))
                || self.contentModule.getEditPanel() === range.commonAncestorContainer
                || self.contentModule.getPanel() === range.commonAncestorContainer)) {
            return;
        }
        if (isNullOrUndefined(args)) {
            let action: string = (event as KeyboardEventArgs).action;
            if (action !== 'tab' && action !== 'enter' && action !== 'space' && action !== 'escape') {
                args = {};
                let items: object = {
                    originalEvent: event, cancel: false,
                    requestType: action || ((event as KeyboardEventArgs).key + 'Key'),
                    itemCollection: value
                };
                extend(args, args, items, true);
                self.trigger(CONSTANT.actionBegin, args);
                if (args.cancel) {
                    if (action === 'paste' || action === 'cut' || action === 'copy') {
                        event.preventDefault();
                    }
                    return;
                }
            }
            this.editorManager.observer.notify((event.type === 'keydown' ? KEY_DOWN : KEY_UP), {
                event: event,
                callBack: this.onSuccess.bind(this, self),
                value: value
            });
        } else if (!isNullOrUndefined(args) && args.item.command && args.item.subCommand && ((args.item.command !== args.item.subCommand
            && args.item.command !== 'Font')
            || ((args.item.subCommand === 'FontName' || args.item.subCommand === 'FontSize') && args.name === 'dropDownSelect')
            || ((args.item.subCommand === 'BackgroundColor' || args.item.subCommand === 'FontColor')
                && args.name === 'colorPickerChanged'))) {
            extend(args, args, { requestType: args.item.subCommand, cancel: false, itemCollection: value }, true);
            self.trigger(CONSTANT.actionBegin, args);
            if (args.cancel) { return; }
            if (this.getUndoRedoStack().length === 0 && args.item.command !== 'Links' && args.item.command !== 'Images') {
                this.saveData();
            }
            self.isBlur = false;
            (self.contentModule.getEditPanel() as HTMLElement).focus();
            let command: string = args.item.subCommand.toLocaleLowerCase();
            if (command === 'paste' || command === 'cut' || command === 'copy') {
                self.clipboardAction(command, event);
            } else {
                this.editorManager.observer.notify(CONSTANT.checkUndo, { subCommand: args.item.subCommand });
                this.editorManager.execCommand(
                    args.item.command,
                    args.item.subCommand,
                    event, this.onSuccess.bind(this, self),
                    (args.item as IDropDownItemModel).value,
                    value);
            }
        }
        this.enableUndo(self);
    }
    private getAncestorNode(node: Node): Node {
        node = node.nodeType === 3 ? node.parentNode : node;
        return node;
    }
    public onKeyHandler(self: IRichTextEditor, e: KeyboardEvent): void {
        this.editorManager.observer.notify(KEY_UP, {
            event: e, callBack: () => {
                this.enableUndo(self);
            }
        });
    }
    public onSuccess(self: IRichTextEditor, events: IMarkdownFormatterCallBack | IHtmlFormatterCallBack): void {
        this.enableUndo(self);
        self.notify(CONSTANT.execCommandCallBack, events);
        self.trigger(CONSTANT.actionComplete, events);
        if (events.requestType === 'Images' || events.requestType === 'Links' && self.editorMode === 'HTML') {
            let args: IHtmlFormatterCallBack = events as IHtmlFormatterCallBack;
            if (events.requestType === 'Links' && events.event &&
                (events.event as KeyboardEvent).type === 'keydown' &&
                (events.event as KeyboardEvent).keyCode === 32) {
                return;
            }
            self.notify(CONSTANT.insertCompleted, {
                args: args.event, type: events.requestType, isNotify: true,
                elements: args.elements
            } as IShowPopupArgs);
        }
    }
    /**
     * Save the data for undo and redo action.
     */
    public saveData(e?: KeyboardEvent | MouseEvent | IUndoCallBack): void {
        this.editorManager.undoRedoManager.saveData(e);
    }

    public getUndoStatus(): { [key: string]: boolean } {
        return this.editorManager.undoRedoManager.getUndoStatus();
    }

    public getUndoRedoStack(): IHtmlUndoRedoData[] | MarkdownUndoRedoData[] {
        return this.editorManager.undoRedoManager.undoRedoStack;
    }

    public enableUndo(self: IRichTextEditor): void {
        let status: { [key: string]: boolean } = this.getUndoStatus();
        if (self.inlineMode.enable && !Browser.isDevice) {
            updateUndoRedoStatus(self.quickToolbarModule.inlineQTBar.quickTBarObj, status);
        } else {
            if (self.toolbarModule) {
                updateUndoRedoStatus(self.toolbarModule.baseToolbar, status);
            }
        }
    }
}