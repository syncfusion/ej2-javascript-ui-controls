import { Observer } from '@syncfusion/ej2-base';
import { ICommandModel } from './interface';
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
import { TableCommand } from './../plugin/table';
import { SelectionBasedExec } from './../plugin/selection-exec';
import { InsertHtmlExec } from './../plugin/inserthtml-exec';
import { ClearFormatExec } from './../plugin/clearformat-exec';
import { UndoRedoManager } from './../plugin/undo';
import * as EVENTS from './../../common/constant';

/**
 * EditorManager internal component
 * @hidden
 */
export class EditorManager {
    public currentDocument: HTMLDocument;
    public observer: Observer;
    public listObj: Lists;
    public nodeSelection: NodeSelection;
    public domNode: DOMNode;
    public formatObj: Formats;
    public linkObj: LinkCommand;
    public alignmentObj: Alignments;
    public indentsObj: Indents;
    public imgObj: ImageCommand;
    public tableObj: TableCommand;
    public selectionObj: SelectionBasedExec;
    public inserthtmlObj: InsertHtmlExec;
    public clearObj: ClearFormatExec;
    public undoRedoManager: UndoRedoManager;

    public editableElement: Element;
    /**
     * Constructor for creating the component
     * @hidden
     */
    constructor(options: ICommandModel) {
        this.currentDocument = options.document;
        this.editableElement = options.editableElement;
        this.nodeSelection = new NodeSelection();
        this.domNode = new DOMNode(this.editableElement, this.currentDocument);
        this.observer = new Observer(this);
        this.listObj = new Lists(this);
        this.formatObj = new Formats(this);
        this.alignmentObj = new Alignments(this);
        this.indentsObj = new Indents(this);
        this.linkObj = new LinkCommand(this);
        this.imgObj = new ImageCommand(this);
        this.selectionObj = new SelectionBasedExec(this);
        this.inserthtmlObj = new InsertHtmlExec(this);
        this.clearObj = new ClearFormatExec(this);
        this.tableObj = new TableCommand(this);
        this.undoRedoManager = new UndoRedoManager(this, options.options);
        this.wireEvents();

    }
    private wireEvents(): void {
        this.observer.on(EVENTS.KEY_DOWN, this.editorKeyDown, this);
        this.observer.on(EVENTS.KEY_UP, this.editorKeyUp, this);
    }
    private editorKeyDown(e: IHtmlKeyboardEvent): void {
        this.observer.notify(EVENTS.KEY_DOWN_HANDLER, e);
    }
    private editorKeyUp(e: IHtmlKeyboardEvent): void {
        this.observer.notify(EVENTS.KEY_UP_HANDLER, e);
    }
    public execCommand<T>(command: ExecCommand, value: T, event?: Event, callBack?: Function, text?: string | Node, exeValue?: T): void {
        switch (command.toLocaleLowerCase()) {
            case 'lists':
                this.observer.notify(EVENTS.LIST_TYPE, { subCommand: value, event: event, callBack: callBack });
                break;
            case 'formats':
                this.observer.notify(EVENTS.FORMAT_TYPE, { subCommand: value, event: event, callBack: callBack });
                break;
            case 'alignments':
                this.observer.notify(CONSTANT.ALIGNMENT_TYPE, { subCommand: value, event: event, callBack: callBack });
                break;
            case 'indents':
                this.observer.notify(CONSTANT.INDENT_TYPE, { subCommand: value, event: event, callBack: callBack });
                break;
            case 'links':
                this.observer.notify(CONSTANT.LINK, { item: exeValue, event: event, callBack: callBack });
                break;
            case 'images':
                this.observer.notify(CONSTANT.IMAGE, { item: exeValue, event: event, callBack: callBack });
                break;
            case 'table':
                switch (value.toString().toLocaleLowerCase()) {
                    case 'createtable':
                        this.observer.notify(CONSTANT.TABLE, { item: exeValue, event: event, callBack: callBack });
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
                }

                break;
            case 'font':
            case 'style':
            case 'effects':
            case 'casing':
                this.observer.notify(
                    CONSTANT.SELECTION_TYPE,
                    { subCommand: value, event: event, callBack: callBack, value: text });
                break;
            case 'inserthtml':
                this.observer.notify(CONSTANT.INSERTHTML_TYPE, { callBack: callBack, value: text });
                break;
            case 'clear':
                this.observer.notify(CONSTANT.CLEAR_TYPE, { subCommand: value, event: event, callBack: callBack });
                break;
            case 'actions':
                this.observer.notify(EVENTS.ACTION, { subCommand: value, event: event, callBack: callBack });
                break;
        }
    }
}

