import { Observer } from '@syncfusion/ej2-base';
import { ICommandModel, IFormatPainterEditor } from './interface';
import { IHtmlKeyboardEvent } from './interface';
import { EditorExecCommand as ExecCommand } from './types';
import * as CONSTANT from './constant';
import { Lists } from './../plugin/lists';
import { NodeSelection } from './../../selection/index';
import { DOMNode } from './../plugin/dom-node';
import { Formats } from './../plugin/formats';
import { LinkCommand } from './../plugin/link';
import { Alignments } from './../plugin/alignments';
import { Indents } from './../plugin/indents';
import { ImageCommand } from './../plugin/image';
import { AudioCommand } from './../plugin/audio';
import { VideoCommand } from './../plugin/video';
import { TableCommand } from './../plugin/table';
import { SelectionBasedExec } from './../plugin/selection-exec';
import { InsertHtmlExec } from './../plugin/inserthtml-exec';
import { ClearFormatExec } from './../plugin/clearformat-exec';
import { UndoRedoManager } from './../plugin/undo';
import { MsWordPaste } from '../plugin/ms-word-clean-up';
import { NotifyArgs } from './../../rich-text-editor/base/interface';
import * as EVENTS from './../../common/constant';
import { InsertTextExec } from '../plugin/insert-text';
import { NodeCutter } from '../plugin/nodecutter';
import { FormatPainterActions } from '../plugin/format-painter-actions';
import { EmojiPickerAction } from '../plugin/emoji-picker-action';
/**
 * EditorManager internal component
 *
 * @hidden
 * @deprecated
 */
export class EditorManager {
    public currentDocument: HTMLDocument;
    public observer: Observer;
    public listObj: Lists;
    public nodeSelection: NodeSelection;
    public nodeCutter: NodeCutter
    public domNode: DOMNode;
    public formatObj: Formats;
    public linkObj: LinkCommand;
    public alignmentObj: Alignments;
    public indentsObj: Indents;
    public imgObj: ImageCommand;
    public audioObj: AudioCommand;
    public videoObj: VideoCommand;
    public tableObj: TableCommand;
    public selectionObj: SelectionBasedExec;
    public inserthtmlObj: InsertHtmlExec;
    public insertTextObj: InsertTextExec;
    public clearObj: ClearFormatExec;
    public undoRedoManager: UndoRedoManager;
    public msWordPaste: MsWordPaste;
    public formatPainterEditor: IFormatPainterEditor;
    public editableElement: Element;
    public emojiPickerObj: EmojiPickerAction;
    /**
     * Constructor for creating the component
     *
     * @hidden
     * @deprecated
     * @param {ICommandModel} options - specifies the command Model
     */
    public constructor(options: ICommandModel) {
        this.currentDocument = options.document;
        this.editableElement = options.editableElement;
        this.nodeSelection = new NodeSelection();
        this.nodeCutter = new NodeCutter();
        this.domNode = new DOMNode(this.editableElement, this.currentDocument);
        this.observer = new Observer(this);
        this.listObj = new Lists(this);
        this.formatObj = new Formats(this);
        this.alignmentObj = new Alignments(this);
        this.indentsObj = new Indents(this);
        this.linkObj = new LinkCommand(this);
        this.imgObj = new ImageCommand(this);
        this.audioObj = new AudioCommand(this);
        this.videoObj = new VideoCommand(this);
        this.selectionObj = new SelectionBasedExec(this);
        this.inserthtmlObj = new InsertHtmlExec(this);
        this.insertTextObj = new InsertTextExec(this);
        this.clearObj = new ClearFormatExec(this);
        this.tableObj = new TableCommand(this);
        this.undoRedoManager = new UndoRedoManager(this, options.options);
        this.msWordPaste = new MsWordPaste(this);
        this.formatPainterEditor = new FormatPainterActions(this, options.formatPainterSettings);
        this.emojiPickerObj = new EmojiPickerAction(this);
        this.wireEvents();
    }
    private wireEvents(): void {
        this.observer.on(EVENTS.KEY_DOWN, this.editorKeyDown, this);
        this.observer.on(EVENTS.KEY_UP, this.editorKeyUp, this);
        this.observer.on(EVENTS.KEY_UP, this.editorKeyUp, this);
        this.observer.on(EVENTS.MODEL_CHANGED, this.onPropertyChanged, this);
        this.observer.on(EVENTS.MS_WORD_CLEANUP, this.onWordPaste, this);
        this.observer.on(EVENTS.ON_BEGIN, this.onBegin, this);
    }
    private onWordPaste(e: NotifyArgs): void {
        this.observer.notify(EVENTS.MS_WORD_CLEANUP_PLUGIN, e);
    }
    private onPropertyChanged(props: { [key: string]: Object }): void {
        this.observer.notify(EVENTS.MODEL_CHANGED_PLUGIN, props);
    }
    private editorKeyDown(e: IHtmlKeyboardEvent): void {
        this.observer.notify(EVENTS.KEY_DOWN_HANDLER, e);
    }
    private editorKeyUp(e: IHtmlKeyboardEvent): void {
        this.observer.notify(EVENTS.KEY_UP_HANDLER, e);
    }
    private onBegin(e: IHtmlKeyboardEvent): void {
        this.observer.notify(EVENTS.SPACE_ACTION, e);
    }
    /* eslint-disable */
    /**
     * execCommand
     *
     * @param {ExecCommand} command - specifies the execution command
     * @param {T} value - specifes the value.
     * @param {Event} event - specifies the call back event
     * @param {Function} callBack - specifies the function
     * @param {string} text - specifies the string value
     * @param {T} exeValue - specifies the values to be executed
     * @param {string} selector - specifies the selector values
     * @returns {void}
     * @hidden
     * @deprecated
     */
    /* eslint-enable */
    public execCommand<T>(
        command: ExecCommand, value: T, event?: Event, callBack?: Function, text?: string | Node, exeValue?: T,
        selector?: string, enterAction?: string): void {
        switch (command.toLowerCase()) {
        case 'lists':
            this.observer.notify(EVENTS.LIST_TYPE, { subCommand: value, event: event, callBack: callBack,
                selector: selector, item: exeValue, enterAction: enterAction });
            break;
        case 'formats':
            this.observer.notify(EVENTS.FORMAT_TYPE, { subCommand: value, event: event, callBack: callBack,
                selector: selector, exeValue: exeValue, enterAction: enterAction
            });
            break;
        case 'alignments':
            this.observer.notify(CONSTANT.ALIGNMENT_TYPE, {
                subCommand: value, event: event, callBack: callBack,
                selector: selector,
                value: exeValue
            });
            break;
        case 'indents':
            this.observer.notify(CONSTANT.INDENT_TYPE, { subCommand: value, event: event, callBack: callBack, selector: selector });
            break;
        case 'links':
            this.observer.notify(CONSTANT.LINK, { command: command, value: value, item: exeValue, event: event, callBack: callBack });
            break;
        case 'files':
            this.observer.notify(CONSTANT.IMAGE, {
                command: command, value: 'Image', item: exeValue, event: event, callBack: callBack, selector: selector });
            break;
        case 'images':
            this.observer.notify(CONSTANT.IMAGE, {
                command: command, value: value, item: exeValue, event: event, callBack: callBack, selector: selector });
            break;
        case 'audios':
            this.observer.notify(CONSTANT.AUDIO, {
                command: command, value: value, item: exeValue, event: event, callBack: callBack, selector: selector });
            break;
        case 'videos':
            this.observer.notify(CONSTANT.VIDEO, {
                command: command, value: value, item: exeValue, event: event, callBack: callBack, selector: selector });
            break;
        case 'table':
            switch (value.toString().toLocaleLowerCase()) {
            case 'createtable':
                this.observer.notify(CONSTANT.TABLE, { item: exeValue, event: event, callBack: callBack, enterAction: enterAction });
                break;
            case 'insertrowbefore':
            case 'insertrowafter':
                this.observer.notify(CONSTANT.INSERT_ROW, { item: exeValue, event: event, callBack: callBack });
                break;
            case 'insertcolumnleft':
            case 'insertcolumnright':
                this.observer.notify(CONSTANT.INSERT_COLUMN, { item: exeValue, event: event, callBack: callBack });
                break;
            case 'deleterow':
                this.observer.notify(CONSTANT.DELETEROW, { item: exeValue, event: event, callBack: callBack });
                break;
            case 'deletecolumn':
                this.observer.notify(CONSTANT.DELETECOLUMN, { item: exeValue, event: event, callBack: callBack });
                break;
            case 'tableremove':
                this.observer.notify(CONSTANT.REMOVETABLE, { item: exeValue, event: event, callBack: callBack });
                break;
            case 'tableheader':
                this.observer.notify(CONSTANT.TABLEHEADER, { item: exeValue, event: event, callBack: callBack });
                break;
            case 'aligntop':
            case 'alignmiddle':
            case 'alignbottom':
                this.observer.notify(CONSTANT.TABLE_VERTICAL_ALIGN, { item: exeValue, event: event, callBack: callBack });
                break;
            case 'merge':
                this.observer.notify(CONSTANT.TABLE_MERGE, { item: exeValue, event: event, callBack: callBack });
                break;
            case 'horizontalsplit':
                this.observer.notify(CONSTANT.TABLE_HORIZONTAL_SPLIT, { item: exeValue, event: event, callBack: callBack });
                break;
            case 'verticalsplit':
                this.observer.notify(CONSTANT.TABLE_VERTICAL_SPLIT, { item: exeValue, event: event, callBack: callBack });
                break;
            }

            break;
        case 'font':
        case 'style':
        case 'effects':
        case 'casing':
            this.observer.notify(
                CONSTANT.SELECTION_TYPE,
                { subCommand: value, event: event, callBack: callBack, value: text, selector: selector, enterAction: enterAction });
            break;
        case 'inserthtml':
            this.observer.notify(CONSTANT.INSERTHTML_TYPE, { subCommand: value, callBack: callBack, value: text, enterAction: enterAction});
            break;
        case 'inserttext':
            this.observer.notify(CONSTANT.INSERT_TEXT_TYPE, { subCommand: value, callBack: callBack, value: text });
            break;
        case 'clear':
            this.observer.notify(
                CONSTANT.CLEAR_TYPE,
                { subCommand: value, event: event, callBack: callBack, selector: selector, enterAction: enterAction });
            break;
        case 'actions':
            this.observer.notify(EVENTS.ACTION, { subCommand: value, event: event, callBack: callBack, selector: selector });
            break;
        case 'formatpainter':
            this.observer.notify(EVENTS.FORMAT_PAINTER_ACTIONS, { item: exeValue, subCommand: value, event: event, callBack: callBack });
            break;
        case 'emojipicker':
            this.observer.notify(EVENTS.EMOJI_PICKER_ACTIONS, { item: exeValue, subCommand: value, value: text,
                event : event, callBack: callBack });
        }
    }
}

