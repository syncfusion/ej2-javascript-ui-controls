import { extend, isNullOrUndefined, KeyboardEventArgs, Browser } from '@syncfusion/ej2-base';
import * as eventConstant from '../constant';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { KEY_DOWN, KEY_UP } from '../../src/common/constant';
import { NodeSelection } from '../../src/selection/selection';
import { isIDevice } from '../../src/rich-text-editor/base/util';
import * as CONSTANT from '../../src/rich-text-editor/base/constant';
import { IHtmlUndoRedoData } from '../../src/editor-manager/base/interface';
import { MarkdownUndoRedoData } from '../../src/markdown-parser/base/interface';
import { IHtmlFormatterCallBack, IMarkdownFormatterCallBack, IUndoCallBack } from '../../src/common/interface';
import { ActionBeginEventArgs, IDropDownItemModel, IShowPopupArgs } from '../../src/rich-text-editor/base/interface';
import { IEditorModel, IItemCollectionArgs, ActionCompleteEventArgs } from '../../src/rich-text-editor/base/interface';

/**
 * Formatter
 */
export class Formatter {
    public editorManager: IEditorModel;
    private successArgs: IMarkdownFormatterCallBack | IHtmlFormatterCallBack;

    public process(
        self: SfRichTextEditor, args: ActionBeginEventArgs, event: MouseEvent | KeyboardEvent, value: IItemCollectionArgs): void {
        let selection: Selection = self.getDocument().getSelection();
        let range: Range = (selection.rangeCount > 0) ? selection.getRangeAt(selection.rangeCount - 1) : null;
        let saveSelection: NodeSelection;
        if (self.editorMode === 'HTML') {
            saveSelection = this.editorManager.nodeSelection.save(range, self.getDocument());
        }
        if (!isNullOrUndefined(args)
            && args.item.command
            && args.item.command !== 'Table'
            && args.item.command !== 'Actions'
            && args.item.command !== 'Links'
            && args.item.command !== 'Images'
            && range
            && !(self.getEditPanel().contains(this.getAncestorNode(range.commonAncestorContainer))
                || self.getEditPanel() === range.commonAncestorContainer
                || self.getPanel() === range.commonAncestorContainer)) {
            return;
        }
        if (isNullOrUndefined(args)) {
            let action: string = (event as KeyboardEventArgs).action;
            if (action !== 'tab' && action !== 'enter' && action !== 'space' && action !== 'escape') {
                args = {};
                if (self.editorMode === 'Markdown' && action === 'insert-table') {
                    value = <{}>{
                        'headingText': 'TableHeadingText',
                        'colText': 'TableColText'
                    };
                }
                let items: object = {
                    originalEvent: event, cancel: false,
                    requestType: action || ((event as KeyboardEventArgs).key + 'Key'),
                };
                extend(args, args, items, true);
                delete args.item;
                args.originalEvent = { ...args.originalEvent, target: null };
                if (self.actionBeginEnabled) {
                    // @ts-ignore-start
                    self.dotNetRef.invokeMethodAsync(eventConstant.actionBeginEvent, args).then((actionBeginArgs: ActionBeginEventArgs) => {
                        // @ts-ignore-end
                        if (args.cancel) {
                            if (action === 'paste' || action === 'cut' || action === 'copy') { event.preventDefault(); }
                        }
                    });
                }
            }
            let isTableModule: boolean = isNullOrUndefined(self.tableModule) ? true : self.tableModule ?
                self.tableModule.ensureInsideTableList : false;
            if ((event.which === 9 && isTableModule) || event.which !== 9) {
                this.editorManager.observer.notify((event.type === 'keydown' ? KEY_DOWN : KEY_UP), {
                    event: event,
                    callBack: this.onSuccess.bind(this, self),
                    value: value
                });
            }
        } else if (!isNullOrUndefined(args) && args.item.command && args.item.subCommand && ((args.item.command !== args.item.subCommand
            && args.item.command !== 'Font')
            || ((args.item.subCommand === 'FontName' || args.item.subCommand === 'FontSize') && args.name === 'dropDownSelect')
            || ((args.item.subCommand === 'BackgroundColor' || args.item.subCommand === 'FontColor')
                && args.name === 'colorPickerChanged'))) {
            args.originalEvent = { ...args.originalEvent, target: null };
            extend(args, args, { requestType: args.item.subCommand, cancel: false }, true);
            if (self.actionBeginEnabled) {
                // @ts-ignore-start
                self.dotNetRef.invokeMethodAsync(eventConstant.actionBeginEvent, args).then((actionBeginArgs: ActionBeginEventArgs) => {
                    // @ts-ignore-end
                    if (!actionBeginArgs.cancel) { this.actionBeginCallBack(self, args, saveSelection, event, value); }
                });
            } else {
                this.actionBeginCallBack(self, args, saveSelection, event, value);
            }
        }
        if (isNullOrUndefined(event) || event && (event as KeyboardEventArgs).action !== 'copy') {
            this.enableUndo(self);
        }
    }
    private getAncestorNode(node: Node): Node {
        node = node.nodeType === 3 ? node.parentNode : node;
        return node;
    }
    public onKeyHandler(self: SfRichTextEditor, e: KeyboardEvent): void {
        this.editorManager.observer.notify(KEY_UP, {
            event: e, callBack: () => {
                self.observer.notify(CONSTANT.contentChanged, {});
                this.enableUndo(self);
            }
        });
    }
    public onSuccess(self: SfRichTextEditor, events: IMarkdownFormatterCallBack | IHtmlFormatterCallBack): void {
        self.observer.notify(CONSTANT.contentChanged, {});
        if (events && (isNullOrUndefined(events.event) || (events.event as KeyboardEventArgs).action !== 'copy')) {
            this.enableUndo(self);
            self.observer.notify(CONSTANT.execCommandCallBack, events);
        }
        events.event = { ...events.event, target: null };
        this.successArgs = { ...events };
        delete (events as IHtmlFormatterCallBack).elements;
        delete (events as IHtmlFormatterCallBack).range;
        if (self.actionCompleteEnabled) {
            // @ts-ignore-start
            self.dotNetRef.invokeMethodAsync(eventConstant.actionCompleteEvent, events).then((callbackArgs: ActionCompleteEventArgs) => {
                // @ts-ignore-end
                this.actionCompleteCallBack(self, callbackArgs);
            });
        } else {
            this.actionCompleteCallBack(self, events as ActionCompleteEventArgs);
        }
    }
    public saveData(e?: KeyboardEvent | MouseEvent | IUndoCallBack): void {
        this.editorManager.undoRedoManager.saveData(e);
    }
    public getUndoStatus(): { [key: string]: boolean } {
        return this.editorManager.undoRedoManager.getUndoStatus();
    }
    public getUndoRedoStack(): IHtmlUndoRedoData[] | MarkdownUndoRedoData[] {
        return this.editorManager.undoRedoManager.undoRedoStack;
    }
    public enableUndo(self: SfRichTextEditor): void {
        if (self.undoRedoStatus) {
            let status: { [key: string]: boolean } = this.getUndoStatus();
            if (self.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
                self.dotNetRef.invokeMethodAsync(eventConstant.updateUndoRedoStatus, status);
                // updateUndoRedoStatus(self.quickToolbarModule.inlineQTBar.quickTBarObj, status);
            } else {
                if (self.toolbarModule) {
                    self.dotNetRef.invokeMethodAsync(eventConstant.updateUndoRedoStatus, status);
                }
            }
        }
    }
    private actionBeginCallBack(
        self: SfRichTextEditor, args: ActionBeginEventArgs, selection: NodeSelection,
        event: MouseEvent | KeyboardEvent, value: IItemCollectionArgs): void {
        if (this.getUndoRedoStack().length === 0 && args.item.command !== 'Links'
            && args.item.command !== 'Images') {
            this.saveData();
        }
        self.isBlur = false;
        (self.getEditPanel() as HTMLElement).focus();
        if (self.editorMode === 'HTML') {
            selection.restore();
        }
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
                args.item.subCommand === 'Pre' && args.name === 'dropDownSelect' ?
                    { name: args.name } : value,
                ('#' + '' + ' iframe')
            );
        }
    }
    private actionCompleteCallBack(self: SfRichTextEditor, args: ActionCompleteEventArgs): void {
        self.setPlaceHolder();
        if (args.requestType === 'Images' || args.requestType === 'Links' && args.editorMode === 'HTML') {
            let successArgs: IHtmlFormatterCallBack = this.successArgs as IHtmlFormatterCallBack;
            if (args.requestType === 'Links' && args.event && (args.event as KeyboardEvent).type === 'keydown' &&
                (args.event as KeyboardEvent).keyCode === 32) { return; }
            self.observer.notify(CONSTANT.insertCompleted, {
                args: successArgs.event, type: args.requestType, isNotify: true, elements: successArgs.elements
            } as IShowPopupArgs);
        }
        self.autoResize();
    }
}