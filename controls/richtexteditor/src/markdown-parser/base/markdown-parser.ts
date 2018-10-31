import { Observer } from '@syncfusion/ej2-base';
import { MarkdownExecCommand } from './types';
import * as CONSTANT from './constant';
import { MDLists } from './../plugin/lists';
import { MDFormats } from './../plugin/formats';
import { IMarkdownParserModel } from './../base/interface';
import { IMDKeyboardEvent } from './interface';
import { MDSelectionFormats } from './../plugin/md-selection-formats';
import { MarkdownSelection } from './../plugin/markdown-selection';
import { extend } from '@syncfusion/ej2-base';
import { markdownFormatTags, markdownListsTags, markdownSelectionTags } from './../../common/config';
import { UndoRedoCommands } from './../plugin/undo';
import { MDLink } from './../plugin/link';
import * as EVENTS from './../../common/constant';
import { ClearFormat } from './../plugin/clearformat';

/**
 * MarkdownParser internal component
 * @hidden
 */
export class MarkdownParser {
    public observer: Observer;
    public listObj: MDLists;
    public formatObj: MDFormats;
    public formatTags: { [key: string]: string };
    public listTags: { [key: string]: string };
    public selectionTags: { [key: string]: string };
    public element: Element;
    public undoRedoManager: UndoRedoCommands;
    public mdSelectionFormats: MDSelectionFormats;
    public markdownSelection: MarkdownSelection;
    public linkObj: MDLink;
    public clearObj: ClearFormat;
    /**
     * Constructor for creating the component
     * @hidden
     */
    constructor(options: IMarkdownParserModel) {
        this.initialize();
        extend(this, this, options, true);
        this.observer = new Observer(this);
        this.markdownSelection = new MarkdownSelection();
        this.listObj = new MDLists({ parent: this, syntax: this.listTags });
        this.formatObj = new MDFormats({ parent: this, syntax: this.formatTags });
        this.undoRedoManager = new UndoRedoCommands(this, options.options);
        this.mdSelectionFormats = new MDSelectionFormats({ parent: this, syntax: this.selectionTags });
        this.linkObj = new MDLink(this);
        this.clearObj = new ClearFormat(this);
        this.wireEvents();
    }
    private initialize(): void {
        this.formatTags = markdownFormatTags;
        this.listTags = markdownListsTags;
        this.selectionTags = markdownSelectionTags;
    }
    private wireEvents(): void {
        this.observer.on(EVENTS.KEY_DOWN, this.editorKeyDown, this);
        this.observer.on(EVENTS.KEY_UP, this.editorKeyUp, this);
    }
    private editorKeyDown(e: IMDKeyboardEvent): void {
        this.observer.notify(EVENTS.KEY_DOWN_HANDLER, e);
    }
    private editorKeyUp(e: IMDKeyboardEvent): void {
        this.observer.notify(EVENTS.KEY_UP_HANDLER, e);
    }
    public execCommand<T>(command: MarkdownExecCommand, value: T, event?: Event, callBack?: Function, text?: string, exeValue?: T): void {
        switch (command.toLocaleLowerCase()) {
            case 'lists':
                this.observer.notify(CONSTANT.LISTS_COMMAND, { subCommand: value, event: event, callBack: callBack });
                break;
            case 'formats':
                this.observer.notify(EVENTS.FORMAT_TYPE, { subCommand: value, event: event, callBack: callBack });
                break;
            case 'actions':
                this.observer.notify(EVENTS.ACTION, { subCommand: value, event: event, callBack: callBack });
                break;
            case 'style':
            case 'effects':
            case 'casing':
                this.observer.notify(CONSTANT.selectionCommand, { subCommand: value, event: event, callBack: callBack });
                break;
            case 'links':
            case 'images':
                this.observer.notify(CONSTANT.LINK_COMMAND, { subCommand: value, event: event, callBack: callBack, item: exeValue });
                break;
            case 'clear':
                this.observer.notify(CONSTANT.CLEAR_COMMAND, { subCommand: value, event: event, callBack: callBack });
                break;

        }
    }
}

