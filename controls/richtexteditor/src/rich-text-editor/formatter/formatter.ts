import { extend, isNullOrUndefined as isNOU, KeyboardEventArgs, Browser, closest } from '@syncfusion/ej2-base';
import * as CONSTANT from '../base/constant';
import { updateUndoRedoStatus, isIDevice } from '../base/util';
import { ActionBeginEventArgs, IDropDownItemModel, IShowPopupArgs, IVideoCommandsArgs } from './../base/interface';
import { IRichTextEditor, IEditorModel, IItemCollectionArgs } from './../base/interface';
import { IHtmlFormatterCallBack, IMarkdownFormatterCallBack, IUndoCallBack } from './../../common/interface';
import { KEY_DOWN, KEY_UP } from './../../common/constant';
import { MarkdownUndoRedoData } from '../../markdown-parser/base/interface';
import { IHtmlUndoRedoData } from '../../editor-manager/base/interface';
import { NodeSelection } from '../../selection/selection';
/**
 * Formatter
 *
 * @hidden
 * @deprecated
 */
export class Formatter {
    public editorManager: IEditorModel;
    private timeInterval: number;
    /**
     * To execute the command
     *
     * @param  {IRichTextEditor} self - specifies the self element.
     * @param  {ActionBeginEventArgs} args - specifies the event arguments.
     * @param  {MouseEvent|KeyboardEvent} event - specifies the keyboard event.
     * @param  {IItemCollectionArgs} value - specifies the collection arguments
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public process(self: IRichTextEditor, args: ActionBeginEventArgs, event: MouseEvent | KeyboardEvent, value: IItemCollectionArgs): void {
        const selection: Selection = self.contentModule.getDocument().getSelection();
        const range: Range = (selection.rangeCount > 0) ? selection.getRangeAt(selection.rangeCount - 1) : null;
        let saveSelection: NodeSelection;
        let newRange: Range;
        if (!isNOU(value) && !isNOU(value.selection)) {
            newRange = value.selection.range;
        }
        const isKeyboardVideoInsert: boolean = (!isNOU(value) && !isNOU((value as IVideoCommandsArgs).cssClass) &&
            (value as IVideoCommandsArgs).cssClass !== 'e-video-inline');
        if (self.editorMode === 'HTML') {
            if (!isNOU(args) && !isKeyboardVideoInsert) {
                if (isNOU(args.name) || (!isNOU(args.name) && args.name !== 'showDialog')) {
                    if (newRange) {
                        saveSelection = this.editorManager.nodeSelection.save(newRange, self.contentModule.getDocument());
                    }
                    else {
                        saveSelection = this.editorManager.nodeSelection.save(range, self.contentModule.getDocument());
                    }
                }
            }
        }
        if (!isNOU(args)
            && args.item.command
            && args.item.command !== 'Table'
            && args.item.command !== 'Actions'
            && args.item.command !== 'Links'
            && args.item.command !== 'Images'
            && args.item.command !== 'Files'
            && args.item.command !== 'Audios'
            && args.item.command !== 'Videos'
            && args.item.command !== 'EmojiPicker'
            && range
            && !(self.contentModule.getEditPanel().contains(this.getAncestorNode(range.commonAncestorContainer))
                || self.contentModule.getEditPanel() === range.commonAncestorContainer
                || self.contentModule.getPanel() === range.commonAncestorContainer)) {
            return;
        }
        if (!isNOU(args) && self.maxLength !== -1 && !isNOU(args.item.command)) {
            let currentInsertContentLength: number = 0;
            if (args.item.command === 'Links') {
                currentInsertContentLength = value.text.length === 0 ? value.url.length : value.text.length;
            }
            if (args.item.command === 'Images' || args.item.command === 'Videos' || args.item.command === 'Table' || args.item.command === 'Files') {
                currentInsertContentLength = 1;
            }
            const currentLength: number = self.getText().trim().replace(/(\r\n|\n|\r|\t)/gm, '').replace(/\u200B/g, '').length;
            const selectionLength: number = self.getSelection().length;
            const totalLength: number = (currentLength - selectionLength) + currentInsertContentLength;
            if (!(self.maxLength === -1 || totalLength <= self.maxLength)) {
                return;
            }
        }
        if (isNOU(args)) {
            const action: string = (event as KeyboardEventArgs).action;
            args = {};
            const items: ActionBeginEventArgs = {
                originalEvent: event, cancel: false,
                requestType: action || ((event as KeyboardEventArgs).key + 'Key'),
                itemCollection: value
            };
            extend(args, args, items, true);
            if (action !== 'tab' && action !== 'enter' && action !== 'space' && action !== 'escape') {
                if (self.editorMode === 'Markdown' && action === 'insert-table') {
                    value = <{}>{
                        'headingText': self.localeObj.getConstant('TableHeadingText'),
                        'colText': self.localeObj.getConstant('TableColText')
                    };
                }
                self.trigger(CONSTANT.actionBegin, args, (actionBeginArgs: ActionBeginEventArgs) => {
                    if (actionBeginArgs.cancel) {
                        if (action === 'paste' || action === 'cut' || action === 'copy') {
                            event.preventDefault();
                        }
                    }
                });
            }
            if (!args.cancel) {
                const isTableModule: boolean = isNOU(self.tableModule) ? true : self.tableModule ?
                    self.tableModule.ensureInsideTableList : false;
                if ((event.which === 9 && isTableModule) || event.which !== 9) {
                    if (event.which === 13 && self.editorMode === 'HTML') {
                        value = <{}>{
                            'enterAction': self.enterKey
                        };
                    }
                    this.editorManager.observer.notify((event.type === 'keydown' ? KEY_DOWN : KEY_UP), {
                        event: event,
                        callBack: this.onSuccess.bind(this, self),
                        value: value,
                        enterAction: self.enterKey
                    });
                }
            }
        } else if (!isNOU(args) && args.item.command && args.item.subCommand && ((args.item.command !== args.item.subCommand
            && args.item.command !== 'Font' && args.item.command !== 'Export')
            || ((args.item.subCommand === 'FontName' || args.item.subCommand === 'FontSize') && args.name === 'dropDownSelect')
            || ((args.item.subCommand === 'BackgroundColor' || args.item.subCommand === 'FontColor')
                && args.name === 'colorPickerChanged') || args.item.subCommand === 'FormatPainter' || args.item.subCommand === 'EmojiPicker')) {
            extend(args, args, { requestType: args.item.subCommand, cancel: false, itemCollection: value, selectType: args.name }, true);
            self.trigger(CONSTANT.actionBegin, args, (actionBeginArgs: ActionBeginEventArgs) => {
                if (!actionBeginArgs.cancel) {
                    const formatPainterCopy: boolean = !isNOU(actionBeginArgs.requestType) && actionBeginArgs.requestType === 'FormatPainter' && actionBeginArgs.name === 'format-copy';
                    const formatPainterPaste: boolean = !isNOU(actionBeginArgs.requestType) && actionBeginArgs.requestType === 'FormatPainter' && actionBeginArgs.name === 'format-paste';
                    if ((this.getUndoRedoStack().length === 0 && actionBeginArgs.item.command !== 'Links' && actionBeginArgs.item.command !== 'Images' && !formatPainterCopy)
                        || formatPainterPaste) {
                        this.saveData();
                    }
                    self.isBlur = false;
                    const quickToolbarAction: boolean = !isNOU(event) && !isNOU(event.target) && (!isNOU(closest(event.target as HTMLElement, '.e-rte-elements.e-dropdown-popup.e-rte-dropdown-popup.e-quick-dropdown.e-popup-open')) || !isNOU(closest(event.target as HTMLElement, '.e-rte-elements.e-rte-quick-popup.e-popup-open')));
                    if (isNOU(saveSelection) || (!quickToolbarAction && (isNOU(closest(saveSelection.range.startContainer.parentElement, '.e-img-caption')) ? true : !((closest(saveSelection.range.startContainer.parentElement, '.e-img-caption') as Element).getAttribute('contenteditable') === 'false'))) && !(Browser.userAgent.indexOf('Firefox') !== -1)) {
                        (self.contentModule.getEditPanel() as HTMLElement).focus();
                    }
                    if (self.editorMode === 'HTML' && !isKeyboardVideoInsert) {
                        if (isNOU(args.selectType) || (!isNOU(args.selectType) && args.selectType !== 'showDialog')) {
                            saveSelection.restore();
                        }
                    }
                    const command: string = actionBeginArgs.item.subCommand.toLocaleLowerCase();
                    if (command === 'image') {
                        value = actionBeginArgs.itemCollection;
                    }
                    if (command === 'paste' || command === 'cut' || command === 'copy') {
                        self.clipboardAction(command, event);
                    } else {
                        this.editorManager.observer.notify(CONSTANT.checkUndo, { subCommand: actionBeginArgs.item.subCommand });
                        this.editorManager.execCommand(
                            actionBeginArgs.item.command,
                            actionBeginArgs.item.subCommand,
                            event,
                            this.onSuccess.bind(this, self),
                            (actionBeginArgs.item as IDropDownItemModel).value,
                            actionBeginArgs.item.subCommand === 'Pre' && actionBeginArgs.selectType === 'dropDownSelect' ?
                                { name: actionBeginArgs.selectType } : value,
                            ('#' + self.getID() + ' iframe'),
                            self.enterKey
                        );
                    }
                }
            });
        }
        if ((isNOU(event) || event && (event as KeyboardEventArgs).action !== 'copy')) {
            this.enableUndo(self);
        }
    }
    private getAncestorNode(node: Node): Node {
        node = node.nodeType === 3 ? node.parentNode : node;
        return node;
    }
    /**
     * onKeyHandler method
     *
     * @param {IRichTextEditor} self - specifies the self element.
     * @param {KeyboardEvent} e - specifies the keyboard event.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public onKeyHandler(self: IRichTextEditor, e: KeyboardEvent): void {
        this.editorManager.observer.notify(KEY_UP, {
            event: e, callBack: () => {
                self.notify(CONSTANT.contentChanged, {});
                this.enableUndo(self);
            },
            enterAction : self.enterKey
        });
    }
    /**
     * onSuccess method
     *
     * @param {IRichTextEditor} self - specifies the self element.
     * @param {IMarkdownFormatterCallBack} events - specifies the event call back
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public onSuccess(self: IRichTextEditor, events: IMarkdownFormatterCallBack | IHtmlFormatterCallBack): void {
        self.notify(CONSTANT.contentChanged, {});
        if (events && (isNOU(events.event) || (events.event as KeyboardEventArgs).action !== 'copy')) {
            this.enableUndo(self);
            self.notify(CONSTANT.execCommandCallBack, events);
        }
        self.trigger(CONSTANT.actionComplete, events, (callbackArgs: IMarkdownFormatterCallBack | IHtmlFormatterCallBack) => {
            self.setPlaceHolder();
            if ((callbackArgs.requestType === 'Images' || callbackArgs.requestType === 'Links' || callbackArgs.requestType === 'Audios' || callbackArgs.requestType === 'Videos') && self.editorMode === 'HTML') {
                const args: IHtmlFormatterCallBack = callbackArgs as IHtmlFormatterCallBack;
                if (callbackArgs.requestType === 'Links' && callbackArgs.event &&
                    (callbackArgs.event as KeyboardEvent).type === 'keydown' &&
                    (callbackArgs.event as KeyboardEvent).keyCode === 32) {
                    return;
                }
                self.notify(CONSTANT.insertCompleted, {
                    args: args.event, type: callbackArgs.requestType, isNotify: true,
                    elements: args.elements
                } as IShowPopupArgs);
            }
            if (callbackArgs.requestType === 'VideosPlayPause') {
                self.notify('editAreaClick', { args: event });
            }
            self.autoResize();
        });
    }
    /**
     * Save the data for undo and redo action.
     *
     * @param {KeyboardEvent} e - specifies the keyboard event.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public saveData(e?: KeyboardEvent | MouseEvent | IUndoCallBack): void {
        this.editorManager.undoRedoManager.saveData(e);
    }

    /**
     * getUndoStatus method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getUndoStatus(): { [key: string]: boolean } {
        return this.editorManager.undoRedoManager.getUndoStatus();
    }

    /* eslint-disable */
    /**
     * getUndoRedoStack method
     *
     * @param {IHtmlUndoRedoData}  - specifies the redo data.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    /* eslint-enable */
    public getUndoRedoStack(): IHtmlUndoRedoData[] | MarkdownUndoRedoData[] {
        return this.editorManager.undoRedoManager.undoRedoStack;
    }

    /**
     * enableUndo method
     *
     * @param {IRichTextEditor} self - specifies the self element.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public enableUndo(self: IRichTextEditor): void {
        const status: { [key: string]: boolean } = this.getUndoStatus();
        if (self.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            updateUndoRedoStatus(self.quickToolbarModule.inlineQTBar.quickTBarObj, status);
        } else {
            if (self.toolbarModule && self.toolbarModule.baseToolbar) {
                updateUndoRedoStatus(self.toolbarModule.baseToolbar, status);
            }
        }
    }

    public beforeSlashMenuApply(): void {
        this.editorManager.beforeSlashMenuApplyFormat();
    }
}
