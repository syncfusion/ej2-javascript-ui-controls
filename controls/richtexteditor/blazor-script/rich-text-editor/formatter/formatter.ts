import { extend, isNullOrUndefined as isNOU, KeyboardEventArgs, Browser, closest } from '../../../base'; /*externalscript*/
import * as eventConstant from '../constant';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { KEY_DOWN, KEY_UP } from '../../editor-scripts/common/constant';
import { NodeSelection } from '../../editor-scripts/selection/selection';
import { isIDevice } from '../../editor-scripts/common/util';
import * as CONSTANT from '../constant';
import { IHtmlUndoRedoData } from '../../editor-scripts/editor-manager/base/interface';
import { MarkdownUndoRedoData } from '../../editor-scripts/markdown-parser/base/interface';
import { IHtmlFormatterCallBack, IMarkdownFormatterCallBack, IUndoCallBack } from '../../editor-scripts/common/interface';
import { ActionBeginEventArgs, IDropDownItemModel, IShowPopupArgs, IVideoCommandsArgs } from '../../editor-scripts/common/interface';
import { IEditorModel, IItemCollectionArgs, ActionCompleteEventArgs } from '../../editor-scripts/common/interface';

/**
 * Formatter
 */
export class Formatter {
    public editorManager: IEditorModel;
    private successArgs: IMarkdownFormatterCallBack | IHtmlFormatterCallBack;
    private enableUndoRedo: { [key: string]: boolean };

    public process(
        self: SfRichTextEditor, args: ActionBeginEventArgs, event: MouseEvent | KeyboardEvent, value: IItemCollectionArgs): void {
        const selection: Selection = self.getDocument().getSelection();
        const range: Range = (selection.rangeCount > 0) ? selection.getRangeAt(selection.rangeCount - 1) : null;
        const isKeyboardVideoInsert: boolean = (!isNOU(value) && !isNOU((value as IVideoCommandsArgs).cssClass) &&
            (value as IVideoCommandsArgs).cssClass !== 'e-video-inline');
        let saveSelection: NodeSelection;
        if (self.editorMode === 'HTML') {
            if (!isNOU(args) && !isKeyboardVideoInsert) {
                if ((isNOU(args) && isNOU(args.name)) || (!isNOU(args.name) && args.name !== 'showDialog') && !(/Version\/\d+\.\d+.*Safari/.test(navigator.userAgent) && args.item.command === 'Table')) {
                    saveSelection = this.editorManager.nodeSelection.save(range, self.getDocument());
                }
            }
        }
        if (!isNOU(args)
            && args.item.command
            && args.item.command !== 'Table'
            && args.item.command !== 'Actions'
            && args.item.command !== 'Links'
            && args.item.command !== 'Images'
            && args.item.command !== 'Audios'
            && args.item.command !== 'Videos'
            && range
            && !(self.getEditPanel().contains(this.getAncestorNode(range.commonAncestorContainer))
                || self.getEditPanel() === range.commonAncestorContainer
                || self.getPanel() === range.commonAncestorContainer)) {
            return;
        }
        if (isNOU(args)) {
            const action: string = (event as KeyboardEventArgs).action;
            args = {};
            const items: object = {
                originalEvent: event, cancel: false,
                requestType: action || ((event as KeyboardEventArgs).key + 'Key')
            };
            extend(args, args, items, true);
            delete args.item;
            args.originalEvent = { ...args.originalEvent, target: null };
            if (action !== 'tab' && action !== 'enter' && action !== 'space' && action !== 'escape') {
                if (self.editorMode === 'Markdown' && action === 'insert-table') {
                    value = <{}>{
                        'headingText': self.localeData.headingText,
                        'colText': self.localeData.colText
                    };
                }
                const range: Range = (selection.rangeCount > 0) ? selection.getRangeAt(selection.rangeCount - 1) : null;
                const rangeContainer: Node = range ? range.commonAncestorContainer : null;
                if (self.actionBeginEnabled && (action !== 'backspace' && action !== 'delete' || (rangeContainer && rangeContainer.nodeType === Node.ELEMENT_NODE && (rangeContainer as HTMLElement).querySelectorAll('img, audio, video').length > 0))) {
                    (self.dotNetRef.invokeMethodAsync(eventConstant.actionBeginEvent, args)  as unknown as
                    Promise<ActionBeginEventArgs>).then((actionBeginArgs: ActionBeginEventArgs) => {
                        if (args.cancel) {
                            if (action === 'paste' || action === 'cut' || action === 'copy') { event.preventDefault(); }
                        }
                    });
                }
            }
            if (!args.cancel) {
                const isTableModule: boolean = isNOU(self.tableModule) ? true : self.tableModule ?
                    self.tableModule.tableObj && self.tableModule.tableObj.ensureInsideTableList : false;
                if ((event.which === 9 && isTableModule) || event.which !== 9) {
                    if (event.which === 13 && self.editorMode === 'HTML') {
                        value =  <{}>{
                            'enterAction': self.enterKey
                        };
                    }
                    this.editorManager.observer.notify((event.type === 'keydown' ? KEY_DOWN : KEY_UP), {
                        event: event,
                        callBack: this.onSuccess.bind(this, self),
                        value: value,
                        enterAction: self.enterKey,
                        enableTabKey: self.enableTabKey
                    });
                }
            }
        } else if (!isNOU(args) && args.item.command && args.item.subCommand && ((args.item.command !== args.item.subCommand
            && args.item.command !== 'Font' && args.item.command !== 'Export')
            || ((args.item.subCommand === 'FontName' || args.item.subCommand === 'FontSize') && args.name === 'dropDownSelect')
            || ((args.item.subCommand === 'BackgroundColor' || args.item.subCommand === 'FontColor')
                && args.name === 'colorPickerChanged') || args.item.subCommand === 'FormatPainter' || args.item.subCommand === 'CodeBlock')) {
            args.originalEvent = { ...args.originalEvent, target: null };
            extend(args, args, { requestType: args.item.subCommand, cancel: false }, true);
            if (self.actionBeginEnabled) {
                (self.dotNetRef.invokeMethodAsync(eventConstant.actionBeginEvent, args) as unknown as
                Promise<ActionBeginEventArgs>).then((actionBeginArgs: ActionBeginEventArgs) => {
                    if (!actionBeginArgs.cancel) { this.actionBeginCallBack(self, args, saveSelection, event, value); }
                });
            } else {
                this.actionBeginCallBack(self, args, saveSelection, event, value);
            }
        }
        if ((isNOU(event) || event && (event as KeyboardEventArgs).action !== 'copy') &&
            !(event && event.shiftKey && (event as KeyboardEventArgs).key === 'Tab')) {
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
            },
            enterAction : self.enterKey
        });
    }
    public onSuccess(self: SfRichTextEditor, events: IMarkdownFormatterCallBack | IHtmlFormatterCallBack): void {
        self.observer.notify(CONSTANT.contentChanged, {});
        if (events && (isNOU(events.event) || (events.event as KeyboardEventArgs).action !== 'copy')) {
            if (events.requestType === 'Paste') {
                self.observer.notify(CONSTANT.execCommandCallBack, events);
                this.enableUndo(self);
            } else {
                this.enableUndo(self);
                self.observer.notify(CONSTANT.execCommandCallBack, events);
            }
        }
        events.event = { ...events.event, target: null };
        this.successArgs = { ...events };
        delete (events as IHtmlFormatterCallBack).elements;
        delete (events as IHtmlFormatterCallBack).range;
        const selection: Selection = self.getDocument().getSelection();
        const range: Range = (selection.rangeCount > 0) ? selection.getRangeAt(selection.rangeCount - 1) : null;
        const rangeContainer: Node = range ? range.commonAncestorContainer : null;
        if (self.actionCompleteEnabled && (events.requestType !== 'delete' || (rangeContainer && rangeContainer.nodeType === Node.ELEMENT_NODE && (rangeContainer as HTMLElement).querySelectorAll('img, audio, video').length > 0))) {
            (self.dotNetRef.invokeMethodAsync(eventConstant.actionCompleteEvent, events) as unknown as
            Promise<ActionCompleteEventArgs>).then((callbackArgs: ActionCompleteEventArgs) => {
                this.actionCompleteCallBack(self, callbackArgs);
            });
        } else {
            this.actionCompleteCallBack(self, events as ActionCompleteEventArgs);
        }
        if (events.requestType === 'VideosPlayPause') {
            self.observer.notify('editAreaClick', { args: {} });
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
        const status: { [key: string]: boolean } = this.getUndoStatus();
        if (self.undoRedoStatus && (isNOU(this.enableUndoRedo)
            || (status.undo !== this.enableUndoRedo.undo || status.redo !== this.enableUndoRedo.redo))) {
            if (self.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
                self.dotNetRef.invokeMethodAsync(eventConstant.updateUndoRedoStatus, status);
            } else {
                if (self.toolbarModule && (self.iframeSettings.enable ? self.getPanel().ownerDocument.body.contains(self.element) :
                    self.getDocument().body.contains(self.element))) {
                    self.dotNetRef.invokeMethodAsync(eventConstant.updateUndoRedoStatus, status);
                }
            }
        }
        this.enableUndoRedo = status;
    }
    private actionBeginCallBack(
        self: SfRichTextEditor, args: ActionBeginEventArgs, selection: NodeSelection,
        event: MouseEvent | KeyboardEvent, value: IItemCollectionArgs): void {
        if (this.getUndoRedoStack().length === 0 && args.item.command !== 'Links'
            && args.item.command !== 'Images' && args.item.command !== 'Audios' && args.item.command !== 'Videos') {
            this.saveData();
        }
        self.isBlur = false;
        if (isNOU(selection) || isNOU(closest(selection.range.startContainer.parentElement, '.e-img-caption')) ? true : !((closest(selection.range.startContainer.parentElement, '.e-img-caption') as Element).getAttribute('contenteditable') === 'false')) {
            (self.getEditPanel() as HTMLElement).focus({preventScroll: true});
        }
        const isKeyboardVideoInsert: boolean = (!isNOU(value) && !isNOU((value as IVideoCommandsArgs).cssClass) &&
        (value as IVideoCommandsArgs).cssClass !== 'e-video-inline');
        if (self.editorMode === 'HTML' && !isKeyboardVideoInsert) {
            if ((isNOU(args.selectType) || (!isNOU(args.selectType) && args.selectType !== 'showDialog')) && !isNOU(selection)) {
                selection.restore();
            }
        }
        const command: string = args.item.subCommand.toLocaleLowerCase();
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
                ('#' + '' + ' iframe'),
                self.enterKey
            );
        }
    }
    private actionCompleteCallBack(self: SfRichTextEditor, args: ActionCompleteEventArgs): void {
        self.setPlaceHolder();
        if (args.requestType === 'Images' || args.requestType === 'Audios' || args.requestType === 'Videos' || args.requestType === 'Links' && args.editorMode === 'HTML') {
            const successArgs: IHtmlFormatterCallBack = this.successArgs as IHtmlFormatterCallBack;
            if (args.requestType === 'Links' && args.event && (args.event as KeyboardEvent).type === 'keydown' &&
                (args.event as KeyboardEvent).keyCode === 32) { return; }
            self.observer.notify(CONSTANT.insertCompleted, {
                args: successArgs.event, type: args.requestType, isNotify: true, elements: successArgs.elements
            } as IShowPopupArgs);
        }
        self.autoResize();
    }
    public getCurrentStackIndex(): undefined | number {
        return this.editorManager.undoRedoManager.getCurrentStackIndex();
    }

    /**
     * clearUndoRedoStack method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public clearUndoRedoStack(): void {
        this.editorManager.undoRedoManager.clear();
    }
}
