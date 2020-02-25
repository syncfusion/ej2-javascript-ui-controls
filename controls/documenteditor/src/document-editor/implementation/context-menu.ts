import { ContextMenu as Menu, ContextMenuModel, MenuItemModel, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { LayoutViewer, DocumentHelper } from './viewer';
import { isNullOrUndefined, L10n, classList } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../document-editor';
import { Selection, ContextElementInfo } from './index';
import { TextPosition } from './selection/selection-helper';
import { FieldElementBox } from './viewer/page';
import { SpellChecker } from './spell-check/spell-checker';
import { Point } from './editor/editor-helper';

const CONTEXTMENU_COPY: string = '_contextmenu_copy';
const CONTEXTMENU_CUT: string = '_contextmenu_cut';
const CONTEXTMENU_PASTE: string = '_contextmenu_paste';
const CONTEXTMENU_ADD_COMMENT: string = '_add_comment';
const CONTEXTMENU_UPDATE_FIELD: string = '_contextmenu_update_field';
const CONTEXTMENU_EDIT_FIELD: string = '_contextmenu_edit_field';
const CONTEXTMENU_HYPERLINK: string = '_contextmenu_hyperlink';
const CONTEXTMENU_OPEN_HYPERLINK: string = '_contextmenu_open_hyperlink';
const CONTEXTMENU_COPY_HYPERLINK: string = '_contextmenu_copy_hyperlink';
const CONTEXTMENU_REMOVE_HYPERLINK: string = '_contextmenu_remove_hyperlink';
const CONTEXTMENU_EDIT_HYPERLINK: string = '_contextmenu_edit_hyperlink';
const CONTEXTMENU_FONT_DIALOG: string = '_contextmenu_font_dialog';
const CONTEXTMENU_PARAGRAPH: string = '_contextmenu_paragraph_dialog';
const CONTEXTMENU_TABLE: string = '_contextmenu_table_dialog';
const CONTEXTMENU_INSERT_TABLE: string = '_contextmenu_insert_table';
const CONTEXTMENU_DELETE_TABLE: string = '_contextmenu_delete_table';
const CONTEXTMENU_INSERT_ABOVE: string = '_contextmenu_insert_above';
const CONTEXTMENU_INSERT_BELOW: string = '_contextmenu_insert_below';
const CONTEXTMENU_INSERT_RIGHT: string = '_contextmenu_insert_right';
const CONTEXTMENU_INSERT_LEFT: string = '_contextmenu_insert_left';
const CONTEXTMENU_COMPLETE_DELETE_TABLE: string = '_contextmenu_complete_table_delete';
const CONTEXTMENU_DELETE_ROW: string = '_contextmenu_delete_row';
const CONTEXTMENU_DELETE_COLUMN: string = '_contextmenu_delete_column';
const CONTEXTMENU_MERGE_CELL: string = '_contextmenu_merge_cell';
const CONTEXTMENU_AUTO_FIT: string = '_contextmenu_auto_fit';
const CONTEXTMENU_AUTO_FIT_TO_CONTENTS: string = '_contextmenu_auto_fit_contents';
const CONTEXTMENU_AUTO_FIT_TO_WINDOW: string = '_contextmenu_auto_fit_window';
const CONTEXTMENU_FIXED_COLUMN_WIDTH: string = '_contextmenu_fixed_column_width';
const CONTEXTMENU_CONTINUE_NUMBERING: string = '_contextmenu_continue_numbering';
const CONTEXTMENU_RESTART_AT: string = '_contextmenu_restart_at';
const CONTEXTMENU_SPELLING_DIALOG: string = '_contextmenu_spelling_dialog';
const CONTEXTMENU_SPELLCHECK_OTHERSUGGESTIONS: string = '_contextmenu_otherSuggestions_spellcheck_';
const CONTEXTMENU_NO_SUGGESTION: string = '_contextmenu_no_suggestion';
/**
 * Context Menu class
 */
export class ContextMenu {
    private documentHelper: DocumentHelper;
    /**
     * @private
     */
    public contextMenuInstance: Menu = undefined;
    /**
     * @private
     */
    public contextMenu: HTMLElement;
    /**
     * @private
     */
    public menuItems: MenuItemModel[] = [];
    /**
     * @private
     */
    public customMenuItems: MenuItemModel[] = [];
    /**
     * @private
     */
    public locale: L10n;
    /**
     * @private
     */
    public ids: string[] = [];
    /**
     * @private
     */
    public enableCustomContextMenu: boolean;
    /**
     * @private
     */
    public enableCustomContextMenuBottom: boolean;

    private currentContextInfo: ContextElementInfo;
    private noSuggestion: HTMLElement;
    private spellContextItems: MenuItemModel[] = [];
    private customItems: MenuItemModel[] = [];
    /**
     * @private
     */
    constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
        this.locale = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        this.locale.setLocale(this.documentHelper.owner.locale);
        this.initContextMenu(this.locale, this.documentHelper.owner.enableRtl);
    }
    get viewer(): LayoutViewer {
        return this.documentHelper.owner.viewer;
    }
    /**
     * Gets the spell checker
     * @private
     */
    get spellChecker(): SpellChecker {
        return this.documentHelper.owner.spellChecker;
    }
    /**
     * Gets module name.
     */
    private getModuleName(): string {
        return 'ContextMenu';
    }
    /**
     * Initialize context menu.
     * @param localValue Localize value.
     * @private
     */
    // tslint:disable:max-func-body-length
    public initContextMenu(localValue: L10n, isRtl?: boolean): void {
        let id: string = this.documentHelper.owner.element.id;
        this.contextMenu = document.createElement('div');
        this.contextMenu.id = this.documentHelper.owner.containerId + 'e-de-contextmenu';
        document.body.appendChild(this.contextMenu);
        let ul: HTMLUListElement = document.createElement('ul');
        ul.style.width = 'auto';
        ul.id = this.documentHelper.owner.containerId + 'e-de-contextmenu-list';
        ul.style.listStyle = 'none';
        ul.style.margin = '0px';
        ul.style.maxHeight = 'auto';
        ul.oncontextmenu = this.disableBrowserContextmenu;
        this.contextMenu.appendChild(ul);
        this.menuItems = [
            {
                text: localValue.getConstant('Cut'),
                iconCss: 'e-icons e-de-cut',
                id: id + CONTEXTMENU_CUT
            },
            {
                text: localValue.getConstant('Copy'),
                iconCss: 'e-icons e-de-copy',
                id: id + CONTEXTMENU_COPY
            },
            {
                text: localValue.getConstant('Paste'),
                iconCss: 'e-icons e-de-paste',
                id: id + CONTEXTMENU_PASTE
            },
            {
                separator: true
            },
            {
                text: localValue.getConstant('New Comment'),
                iconCss: 'e-icons e-de-cmt-add',
                id: id + CONTEXTMENU_ADD_COMMENT
            },
            {
                separator: true
            },
            {
                text: localValue.getConstant('Update Field'),
                iconCss: 'e-icons e-de-update_field',
                id: id + CONTEXTMENU_UPDATE_FIELD
            },
            {
                text: localValue.getConstant('Edit Field'),
                iconCss: 'e-icons e-de-edit_field',
                id: id + CONTEXTMENU_EDIT_FIELD
            },
            {
                text: localValue.getConstant('Continue Numbering'),
                iconCss: 'e-icons e-de-continue-numbering',
                id: id + CONTEXTMENU_CONTINUE_NUMBERING
            },
            {
                text: localValue.getConstant('Restart At') + ' 1',
                iconCss: 'e-icons e-de-restart-at',
                id: id + CONTEXTMENU_RESTART_AT
            },
            {
                separator: true
            },
            {
                text: localValue.getConstant('Hyperlink'),
                iconCss: 'e-icons e-de-insertlink',
                id: id + CONTEXTMENU_HYPERLINK
            },
            {
                text: localValue.getConstant('Edit Hyperlink') + '...',
                iconCss: 'e-icons e-de-edit-hyperlink',
                id: id + CONTEXTMENU_EDIT_HYPERLINK
            },
            {
                text: localValue.getConstant('Open Hyperlink'),
                iconCss: 'e-icons e-de-open-hyperlink',
                id: id + CONTEXTMENU_OPEN_HYPERLINK
            },
            {
                text: localValue.getConstant('Copy Hyperlink'),
                iconCss: 'e-icons e-de-copy-hyperlink',
                id: id + CONTEXTMENU_COPY_HYPERLINK
            },
            {
                text: localValue.getConstant('Remove Hyperlink'),
                iconCss: 'e-icons e-de-remove-hyperlink',
                id: id + CONTEXTMENU_REMOVE_HYPERLINK
            },
            {
                separator: true
            },
            {
                text: localValue.getConstant('Font'),
                iconCss: 'e-icons e-de-fonts',
                id: id + CONTEXTMENU_FONT_DIALOG
            },
            {
                text: localValue.getConstant('Paragraph'),
                iconCss: 'e-icons e-de-paragraph',
                id: id + CONTEXTMENU_PARAGRAPH
            },
            {
                separator: true,
            },
            {
                text: localValue.getConstant('Table Properties'),
                id: id + CONTEXTMENU_TABLE,
                iconCss: 'e-icons e-de-table'
            },
            {
                text: localValue.getConstant('Merge Cells'),
                id: id + CONTEXTMENU_MERGE_CELL,
                iconCss: 'e-icons e-de-ctnr-mergecell'
            },
            {
                text: localValue.getConstant('AutoFit'),
                id: id + CONTEXTMENU_AUTO_FIT,
                iconCss: 'e-icons',
                items: [
                    {
                        text: localValue.getConstant('AutoFit to Contents'),
                        id: id + CONTEXTMENU_AUTO_FIT_TO_CONTENTS,
                        iconCss: 'e-icons e-de-icon-autofit e-de-autofit-contents'
                    },
                    {
                        text: localValue.getConstant('AutoFit to Window'),
                        id: id + CONTEXTMENU_AUTO_FIT_TO_WINDOW,
                        iconCss: 'e-icons e-de-icon-auto-fitwindow e-de-autofit-window'
                    },
                    {
                        text: localValue.getConstant('Fixed Column Width'),
                        id: id + CONTEXTMENU_FIXED_COLUMN_WIDTH,
                        iconCss: 'e-icons e-de-icon-fixed-columnwidth e-de-fixed-column'
                    }
                ]
            },
            {
                text: localValue.getConstant('Insert'),
                id: id + CONTEXTMENU_INSERT_TABLE,
                iconCss: 'e-icons',
                items: [
                    {
                        text: localValue.getConstant('Insert Above'),
                        id: id + CONTEXTMENU_INSERT_ABOVE,
                        iconCss: 'e-icons e-de-insertabove'
                    },
                    {
                        text: localValue.getConstant('Insert Below'),
                        id: id + CONTEXTMENU_INSERT_BELOW,
                        iconCss: 'e-icons e-de-insertbelow'
                    },
                    {
                        text: localValue.getConstant('Insert Left'),
                        id: id + CONTEXTMENU_INSERT_LEFT,
                        iconCss: 'e-icons e-de-insertleft'
                    },
                    {
                        text: localValue.getConstant('Insert Right'),
                        id: id + CONTEXTMENU_INSERT_RIGHT,
                        iconCss: 'e-icons e-de-insertright'
                    }
                ]
            },
            {
                text: localValue.getConstant('Delete'),
                id: id + CONTEXTMENU_DELETE_TABLE,
                iconCss: 'e-icons',
                items: [
                    {
                        text: localValue.getConstant('Delete Table'),
                        id: id + CONTEXTMENU_COMPLETE_DELETE_TABLE,
                        iconCss: 'e-icons e-de-delete-table'
                    },
                    {
                        text: localValue.getConstant('Delete Row'),
                        id: id + CONTEXTMENU_DELETE_ROW,
                        iconCss: 'e-icons e-de-deleterow'
                    },
                    {
                        text: localValue.getConstant('Delete Column'),
                        id: id + CONTEXTMENU_DELETE_COLUMN,
                        iconCss: 'e-icons e-de-deletecolumn'
                    }
                ]
            },
        ];
        let menuOptions: ContextMenuModel = {
            target: '#' + this.documentHelper.owner.containerId + 'e-de-contextmenu',
            enableRtl: isRtl,
            items: this.addMenuItems(this.menuItems),
            select: (args: MenuEventArgs) => {
                let item: string = args.element.id;
                this.handleContextMenuItem(item);
            },
        };
        this.contextMenuInstance = new Menu(menuOptions, '#' + this.documentHelper.owner.containerId + 'e-de-contextmenu-list');
        this.contextMenuInstance.beforeOpen = () => {
            for (let index: number = 0; index < this.customMenuItems.length; index++) {
                if (typeof this.customMenuItems[index].id !== 'undefined') {
                    this.ids[index] = this.customMenuItems[index].id;
                } else {
                    this.ids[index] = this.customMenuItems[index + 1].id;
                }
            }
            this.documentHelper.owner.fireCustomContextMenuBeforeOpen(this.ids);
            if (this.enableCustomContextMenu) {
                for (let index: number = 0; index < this.menuItems.length; index++) {
                    if (typeof this.menuItems[index].id !== 'undefined') {
                        document.getElementById(this.menuItems[index].id).style.display = 'none';
                    } else {
                        (document.getElementById(this.menuItems[index - 1].id).nextSibling as HTMLElement).style.display = 'none';
                    }
                }
            }
            if (this.viewer && this.documentHelper.selection) {
                classList(this.documentHelper.selection.caret, [], ['e-de-cursor-animation']);
                this.documentHelper.selection.showCaret();
            }
        };
        this.contextMenuInstance.onClose = () => {
            if (this.viewer && this.documentHelper.selection) {
                classList(this.documentHelper.selection.caret, ['e-de-cursor-animation'], []);
                this.documentHelper.updateFocus();
            }
        };
    }
    /**
     * Disable browser context menu.
     */
    private disableBrowserContextmenu(): boolean {
        return false;
    }
    /**
     * Handles context menu items.
     * @param  {string} item Specifies which item is selected.
     * @private
     */
    public handleContextMenuItem(item: string): void {
        let id: string = this.documentHelper.owner.element.id;
        switch (item) {
            case id + CONTEXTMENU_COPY:
                this.documentHelper.selection.copy();
                break;
            case id + CONTEXTMENU_CUT:
                this.documentHelper.owner.editor.cut();
                break;
            case id + CONTEXTMENU_PASTE:
                if (!this.documentHelper.owner.isReadOnlyMode) {
                    this.documentHelper.owner.editorModule.pasteInternal(undefined);
                }
                break;
            case id + CONTEXTMENU_ADD_COMMENT:
                if (!this.documentHelper.owner.isReadOnlyMode) {
                    this.documentHelper.owner.editorModule.insertComment();
                }
                break;
            case id + CONTEXTMENU_UPDATE_FIELD:
                if (!this.documentHelper.owner.isReadOnlyMode) {
                    this.documentHelper.owner.editorModule.updateToc();
                }
                break;
            case id + CONTEXTMENU_EDIT_FIELD:
                if (!this.documentHelper.owner.isReadOnlyMode) {
                    this.documentHelper.owner.tableOfContentsDialogModule.show();
                }
                break;
            case id + CONTEXTMENU_FONT_DIALOG:
                if (this.documentHelper.owner.fontDialogModule) {
                    this.documentHelper.owner.fontDialogModule.showFontDialog();
                }
                break;
            case id + CONTEXTMENU_OPEN_HYPERLINK:
                this.documentHelper.selection.navigateHyperlink();
                break;
            case id + CONTEXTMENU_COPY_HYPERLINK:
                this.documentHelper.selection.copyHyperlink();
                break;
            case id + CONTEXTMENU_EDIT_HYPERLINK:
            case id + CONTEXTMENU_HYPERLINK:
                if (this.documentHelper.owner.hyperlinkDialogModule) {
                    this.documentHelper.owner.hyperlinkDialogModule.show();
                }
                break;
            case id + CONTEXTMENU_REMOVE_HYPERLINK:
                this.documentHelper.owner.editor.removeHyperlink();
                break;
            case id + CONTEXTMENU_PARAGRAPH:
                if (this.documentHelper.owner.paragraphDialogModule) {
                    this.documentHelper.owner.paragraphDialogModule.show();
                }
                break;
            case id + CONTEXTMENU_TABLE:
                this.documentHelper.owner.tablePropertiesDialogModule.show();
                break;
            case id + CONTEXTMENU_MERGE_CELL:
                this.documentHelper.owner.editor.mergeCells();
                break;
            case id + CONTEXTMENU_INSERT_ABOVE:
                this.documentHelper.owner.editor.insertRow(true);
                break;
            case id + CONTEXTMENU_INSERT_BELOW:
                this.documentHelper.owner.editor.insertRow(false);
                break;
            case id + CONTEXTMENU_INSERT_LEFT:
                this.documentHelper.owner.editor.insertColumn(true);
                break;
            case id + CONTEXTMENU_INSERT_RIGHT:
                this.documentHelper.owner.editor.insertColumn(false);
                break;
            case id + CONTEXTMENU_COMPLETE_DELETE_TABLE:
                this.documentHelper.owner.editor.deleteTable();
                break;
            case id + CONTEXTMENU_DELETE_ROW:
                this.documentHelper.owner.editor.deleteRow();
                break;
            case id + CONTEXTMENU_DELETE_COLUMN:
                this.documentHelper.owner.editor.deleteColumn();
                break;
            case id + CONTEXTMENU_CONTINUE_NUMBERING:
                this.documentHelper.owner.editorModule.applyContinueNumbering(this.documentHelper.selection);
                break;
            case id + CONTEXTMENU_RESTART_AT:
                this.documentHelper.owner.editorModule.applyRestartNumbering(this.documentHelper.selection);
                break;
            case id + CONTEXTMENU_AUTO_FIT_TO_CONTENTS:
                this.documentHelper.owner.editor.autoFitTable('FitToContents');
                break;
            case id + CONTEXTMENU_AUTO_FIT_TO_WINDOW:
                this.documentHelper.owner.editor.autoFitTable('FitToWindow');
                break;
            case id + CONTEXTMENU_FIXED_COLUMN_WIDTH:
                this.documentHelper.owner.editor.autoFitTable('FixedColumnWidth');
                break;
            case id + CONTEXTMENU_SPELLING_DIALOG:
                let contextInfo: ContextElementInfo = this.spellChecker.retriveText();
                this.currentContextInfo = null;
                this.documentHelper.owner.spellCheckDialog.show(contextInfo.text, contextInfo.element);
                break;
            default:
                let expectedData: string = this.documentHelper.owner.element.id + CONTEXTMENU_SPELLCHECK_OTHERSUGGESTIONS;
                if (item.substring(0, expectedData.length) === expectedData) {
                    let content: string = item.substring(item.lastIndexOf('_') + 1);
                    this.callSelectedOption(content);
                    break;
                } else {
                    // fires customContextMenuSelect while selecting the added custom menu item
                    this.documentHelper.owner.fireCustomContextMenuSelect(item);
                    break;
                }
        }
    }
    /**
     * Method to call the selected item
     * @param {string} content 
     */
    private callSelectedOption(content: string): void {
        if (content === 'Add To Dictionary') {
            this.spellChecker.handleAddToDictionary();
        } else if (content === 'Ignore All') {
            this.spellChecker.handleIgnoreAllItems();
        } else {
            this.spellChecker.manageReplace(content);
        }
    }

    /**
     * To add and customize custom context menu
     * @param {MenuItemModel[]} items - To add custom menu item
     * @param {boolean} isEnable - To hide existing menu item and show custom menu item alone
     * @param {boolean} isBottom - To show the custom menu item in bottom of the existing item
     */
    public addCustomMenu(items: MenuItemModel[], isEnable?: boolean, isBottom?: boolean): void {
        let menuItems: MenuItemModel[] = JSON.parse(JSON.stringify(items));
        this.destroy();
        if (this.spellContextItems.length === 0) {
            this.customItems = items;
        }
        for (let index: number = 0; index < menuItems.length; index++) {
            this.customMenuItems.push(menuItems[index]);
            this.customMenuItems[index].id = this.documentHelper.owner.element.id + this.customMenuItems[index].id;
        }
        this.enableCustomContextMenu = isEnable;
        this.enableCustomContextMenuBottom = isBottom;
        this.initContextMenu(this.locale);
    }
    /**
     * Context Menu Items.
     * @param {MenuItemModel[]} menuItems - To add MenuItem to context menu
     * @private
     */
    public addMenuItems(menuItems: MenuItemModel[]): MenuItemModel[] {
        if (this.enableCustomContextMenuBottom) {
            return menuItems.concat(this.customMenuItems);
        } else {
            return this.customMenuItems.concat(menuItems);
        }
    }
    /**
     * Handles on context menu key pressed.
     * @param  {MouseEvent} event
     * @private
     */
    public onContextMenuInternal = (event: MouseEvent | TouchEvent): void => {
        let isTouch: boolean = !(event instanceof MouseEvent);
        if (this.documentHelper.owner.isSpellCheck && this.spellChecker.allowSpellCheckAndSuggestion) {
            event.preventDefault();
            this.currentContextInfo = this.spellChecker.findCurretText();
            let splittedSuggestion: string[];
            /* tslint:disable:no-any */
            let allSuggestions: any;
            let exactData: string = this.spellChecker.manageSpecialCharacters(this.currentContextInfo.text, undefined, true);
            if (!isNullOrUndefined(exactData) && this.spellChecker.errorWordCollection.containsKey(exactData)) {
                this.spellChecker.currentContextInfo = this.currentContextInfo;
                if (this.spellChecker.errorSuggestions.containsKey(exactData)) {
                    allSuggestions = this.spellChecker.errorSuggestions.get(exactData).slice();
                    splittedSuggestion = this.spellChecker.handleSuggestions(allSuggestions);
                    this.processSuggestions(allSuggestions, splittedSuggestion, isTouch ? event as TouchEvent : event as MouseEvent);
                } else {
                    if (this.spellChecker.enableOptimizedSpellCheck) {
                        // tslint:disable-next-line:max-line-length
                        this.spellChecker.CallSpellChecker(this.spellChecker.languageID, exactData, false, true, false, false).then((data: any) => {
                            /* tslint:disable:no-any */
                            let jsonObject: any = JSON.parse(data);
                            allSuggestions = jsonObject.Suggestions;
                            if (!isNullOrUndefined(allSuggestions)) {
                                this.spellChecker.errorSuggestions.add(exactData, allSuggestions.slice());
                                splittedSuggestion = this.spellChecker.handleSuggestions(allSuggestions);
                            }
                            // tslint:disable-next-line:max-line-length
                            this.processSuggestions(allSuggestions, splittedSuggestion, isTouch ? event as TouchEvent : event as MouseEvent);
                        });
                    } else {
                        // tslint:disable-next-line:max-line-length
                        this.processSuggestions(allSuggestions, splittedSuggestion, isTouch ? event as TouchEvent : event as MouseEvent);
                    }
                }
            } else {
                this.hideSpellContextItems();
                this.showContextMenuOnSel(isTouch ? event as TouchEvent : event as MouseEvent);
            }
        } else {
            this.hideSpellContextItems();
            this.showContextMenuOnSel(isTouch ? event as TouchEvent : event as MouseEvent);
        }
    }
    /**
     * Opens context menu.
     * @param {MouseEvent | TouchEvent} event 
     */
    private showContextMenuOnSel(event: MouseEvent | TouchEvent): void {
        let isTouch: boolean = !(event instanceof MouseEvent);
        let xPos: number = 0;
        let yPos: number = 0;
        if (isTouch) {
            let point: Point = this.documentHelper.getTouchOffsetValue(event as TouchEvent);
            xPos = point.x;
            yPos = point.y;
        } else {
            yPos = (event as MouseEvent).y;
            xPos = (event as MouseEvent).x;
        }
        if (this.showHideElements(this.documentHelper.selection)) {
            if (isTouch) {
                this.documentHelper.isMouseDown = false;
            }
            this.contextMenuInstance.open(yPos, xPos);
            event.preventDefault();
        }
    }
    /**
     * Method to hide spell context items
     */
    public hideSpellContextItems(): void {
        if (this.spellContextItems.length > 0) {
            for (let i: number = 0; i < this.spellContextItems.length; i++) {
                let item: HTMLElement = document.getElementById(this.documentHelper.owner.element.id + this.spellContextItems[i].id);
                if (!isNullOrUndefined(item)) {
                    item.style.display = 'none';
                }
            }
        }
    }
    /**
     * Method to process suggestions to add in context menu
     * @param {any} allSuggestions 
     * @param {string[]} splittedSuggestion 
     * @param {MouseEvent} event 
     * @private
     */
    /* tslint:disable:no-any */
    public processSuggestions(allSuggestions: any, splittedSuggestion: string[], event: MouseEvent | TouchEvent): void {
        this.spellContextItems = this.constructContextmenu(allSuggestions, splittedSuggestion);
        this.addCustomMenu(this.spellContextItems);
        this.noSuggestion = document.getElementById(this.documentHelper.owner.element.id + CONTEXTMENU_NO_SUGGESTION);
        if (!isNullOrUndefined(this.noSuggestion)) {
            this.noSuggestion.style.display = 'block';
            classList(this.noSuggestion, ['e-disabled'], ['e-focused']);
        }
        this.showContextMenuOnSel(event);
    }
    /**
     * Method to add inline menu
     * @private 
     */
    /* tslint:disable:no-any */
    public constructContextmenu(allSuggestion: any[], splittedSuggestion: any): any[] {
        let contextMenuItems: any[] = this.customItems.length > 0 ? this.customItems.slice() : [];
        // classList(this.noSuggestion,['e-disabled'],[]);
        if (isNullOrUndefined(allSuggestion) || allSuggestion.length === 0) {
            contextMenuItems.push({ text: 'no suggestions', id: CONTEXTMENU_NO_SUGGESTION, classList: ['e-focused'], iconCss: '' });
        } else {
            for (let i: number = 0; i < allSuggestion.length; i++) {
                // tslint:disable-next-line:max-line-length
                contextMenuItems.push({ text: allSuggestion[i], id: CONTEXTMENU_SPELLCHECK_OTHERSUGGESTIONS + allSuggestion[i], iconCss: '' });
            }
        }
        contextMenuItems.push({ separator: true, id: '_contextmenu_suggestion_seperator' });
        if (!isNullOrUndefined(splittedSuggestion) && splittedSuggestion.length > 1) {
            contextMenuItems.push({ text: 'More Suggestion', items: splittedSuggestion });
            contextMenuItems.push({ separator: true, id: '_contextmenu_moreSuggestion_seperator' });
        } else {
            // tslint:disable-next-line:max-line-length
            contextMenuItems.push({ text: 'Add To Dictionary ', id: '_contextmenu_otherSuggestions_spellcheck_Add To Dictionary', iconCss: '' });
        }
        contextMenuItems.push({ text: 'Ignore Once', id: '_contextmenu_otherSuggestions_spellcheck_Ignore Once', iconCss: '' });
        contextMenuItems.push({ text: 'Ignore All', id: '_contextmenu_otherSuggestions_spellcheck_Ignore All', iconCss: '' });
        contextMenuItems.push({ separator: true, id: '_contextmenu_change_seperator' });
        // tslint:disable-next-line:max-line-length
        contextMenuItems.push({ text: this.locale.getConstant('Spelling'), id: CONTEXTMENU_SPELLING_DIALOG, iconCss: 'e-icons e-de-spellcheck', items: [] });
        contextMenuItems.push({ separator: true, id: '_contextmenu_spelling_seperator' });
        return contextMenuItems;
    }

    private showHideElements(selection: Selection): boolean {
        if (isNullOrUndefined(selection)) {
            return false;
        }
        selection.hideToolTip();
        let owner: DocumentEditor = this.documentHelper.owner;
        let id: string = owner.element.id;
        let copy: HTMLElement = document.getElementById(id + CONTEXTMENU_COPY);
        let cut: HTMLElement = document.getElementById(id + CONTEXTMENU_CUT);
        let paste: HTMLElement = document.getElementById(id + CONTEXTMENU_PASTE);
        let updateField: HTMLElement = document.getElementById(id + CONTEXTMENU_UPDATE_FIELD);
        let editField: HTMLElement = document.getElementById(id + CONTEXTMENU_EDIT_FIELD);
        let font: HTMLElement = document.getElementById(id + CONTEXTMENU_FONT_DIALOG);
        let paragraph: HTMLElement = document.getElementById(id + CONTEXTMENU_PARAGRAPH);
        let tableProperties: HTMLElement = document.getElementById(id + CONTEXTMENU_TABLE);
        let insertTable: HTMLElement = document.getElementById(id + CONTEXTMENU_INSERT_TABLE);
        let deleteTable: HTMLElement = document.getElementById(id + CONTEXTMENU_DELETE_TABLE);
        let mergeCells: HTMLElement = document.getElementById(id + CONTEXTMENU_MERGE_CELL);
        let hyperlink: HTMLElement = document.getElementById(id + CONTEXTMENU_HYPERLINK);
        let openHyperlink: HTMLElement = document.getElementById(id + CONTEXTMENU_OPEN_HYPERLINK);
        let editHyperlink: HTMLElement = document.getElementById(id + CONTEXTMENU_EDIT_HYPERLINK);
        let copyHyperlink: HTMLElement = document.getElementById(id + CONTEXTMENU_COPY_HYPERLINK);
        let removeHyperlink: HTMLElement = document.getElementById(id + CONTEXTMENU_REMOVE_HYPERLINK);
        let continueNumbering: HTMLElement = document.getElementById(id + CONTEXTMENU_CONTINUE_NUMBERING);
        let restartAt: HTMLElement = document.getElementById(id + CONTEXTMENU_RESTART_AT);
        let autoFitTable: HTMLElement = document.getElementById(id + CONTEXTMENU_AUTO_FIT);
        let addComment: HTMLElement = document.getElementById(id + CONTEXTMENU_ADD_COMMENT);
        let isDialogHidden: boolean = false;
        cut.style.display = 'none';
        paste.style.display = 'none';
        (paste.nextSibling as HTMLElement).style.display = 'none';
        hyperlink.style.display = 'none';
        (font.previousSibling as HTMLElement).style.display = 'none';
        openHyperlink.style.display = 'none';
        copyHyperlink.style.display = 'none';
        editHyperlink.style.display = 'none';
        removeHyperlink.style.display = 'none';
        (removeHyperlink.nextSibling as HTMLElement).style.display = 'none';
        mergeCells.style.display = 'none';
        autoFitTable.style.display = 'none';
        font.style.display = 'none';
        paragraph.style.display = 'none';
        (paragraph.nextSibling as HTMLElement).style.display = 'none';
        insertTable.style.display = 'none';
        deleteTable.style.display = 'none';
        tableProperties.style.display = 'none';
        updateField.style.display = 'none';
        editField.style.display = 'none';
        continueNumbering.style.display = 'none';
        restartAt.style.display = 'none';
        (restartAt.nextSibling as HTMLElement).style.display = 'none';

        let isSelectionEmpty: boolean = selection.isEmpty;
        classList(cut, isSelectionEmpty ? ['e-disabled'] : [], !isSelectionEmpty ? ['e-disabled'] : []);
        classList(copy, isSelectionEmpty ? ['e-disabled'] : [], !isSelectionEmpty ? ['e-disabled'] : []);
        // tslint:disable-next-line:max-line-length
        let isHideComment: boolean = this.documentHelper.owner.isReadOnlyMode || this.documentHelper.owner.enableHeaderAndFooter || !this.documentHelper.owner.enableComment;
        addComment.style.display = isHideComment ? 'none' : 'block';
        (addComment.previousSibling as HTMLElement).style.display = isHideComment ? 'none' : 'block';
        (addComment.nextSibling as HTMLElement).style.display = isHideComment ? 'none' : 'block';
        if (owner.isReadOnlyMode) {
            return true;
        }
        if (this.viewer && this.documentHelper.owner && this.documentHelper.owner.commentReviewPane &&
            this.documentHelper.owner.commentReviewPane.commentPane.isEditMode) {
            classList(addComment, ['e-disabled'], []);
        } else {
            classList(addComment, [], ['e-disabled']);
        }
        cut.style.display = 'block';
        paste.style.display = 'block';
        (paste.nextSibling as HTMLElement).style.display = 'block';
        classList(insertTable, ['e-blankicon'], []);
        classList(deleteTable, ['e-blankicon'], []);
        classList(updateField, ['e-blankicon'], []);
        classList(editField, ['e-blankicon'], []);
        classList(autoFitTable, ['e-blankicon'], []);
        let enablePaste: boolean = (owner.enableLocalPaste && !isNullOrUndefined(owner.editor.copiedData));
        classList(paste, enablePaste ? [] : ['e-disabled'], enablePaste ? ['e-disabled'] : []);
        if (selection.contextType === 'TableOfContents') {
            updateField.style.display = 'block';
            editField.style.display = 'block';
        } else {
            let start: TextPosition = selection.start;
            let end: TextPosition = selection.end;
            if (selection.contextType === 'List'
                && owner.editorModule.getListLevel(start.paragraph).listLevelPattern !== 'Bullet') {
                continueNumbering.style.display = 'block';
                restartAt.style.display = 'block';
                (restartAt.nextSibling as HTMLElement).style.display = 'block';
            }
            let isCellOrRowSelected: boolean = start.paragraph.isInsideTable && (!end.paragraph.isInsideTable
                || start.paragraph.associatedCell !== end.paragraph.associatedCell
                || selection.isCellSelected(start.paragraph.associatedCell, start, end));
            if (isCellOrRowSelected) {
                hyperlink.classList.add('e-disabled');
            } else {
                if (hyperlink.classList.contains('e-disabled')) {
                    hyperlink.classList.remove('e-disabled');
                }
            }
            let field: FieldElementBox = selection.getHyperlinkField();
            if (field instanceof FieldElementBox && !selection.isImageField()) {
                openHyperlink.style.display = 'block';
                copyHyperlink.style.display = 'block';
                if (owner.hyperlinkDialogModule) {
                    editHyperlink.style.display = 'block';
                }
                removeHyperlink.style.display = 'block';
                (removeHyperlink.nextSibling as HTMLElement).style.display = 'block';
                isDialogHidden = true;
            } else {
                if (owner.hyperlinkDialogModule) {
                    hyperlink.style.display = 'block';
                    (font.previousSibling as HTMLElement).style.display = 'block';
                    isDialogHidden = true;
                }
            }
        }
        if (this.documentHelper.owner.selection.start.paragraph.isInsideTable
            && this.documentHelper.owner.selection.end.paragraph.isInsideTable) {
            (paragraph.nextSibling as HTMLElement).style.display = 'block';
            if (owner.tablePropertiesDialogModule) {
                tableProperties.style.display = 'block';
            }
            insertTable.style.display = 'block';
            deleteTable.style.display = 'block';
            if (this.documentHelper.owner.editor.canMergeCells()) {
                mergeCells.style.display = 'block';
            }
            autoFitTable.style.display = this.documentHelper.selection.isTableSelected() ? 'block' : 'none';
        } else {
            if (this.documentHelper.owner.fontDialogModule) {
                font.style.display = 'block';
            }
            if (this.documentHelper.owner.paragraphDialogModule) {
                paragraph.style.display = 'block';
            } else if (!isDialogHidden && !this.documentHelper.owner.fontDialogModule && !isHideComment) {
                (addComment.nextSibling as HTMLElement).style.display = 'none';
            }
        }
        if (selection.contextType === 'Image') {
            font.style.display = 'none';
            paragraph.style.display = 'none';
            (removeHyperlink.nextSibling as HTMLElement).style.display = 'none';
        }
        return true;
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public destroy(): void {
        if (this.contextMenuInstance) {
            this.contextMenuInstance.destroy();
        }
        if (this.contextMenu && this.contextMenu.parentElement) {
            this.contextMenu.parentElement.removeChild(this.contextMenu);
            this.contextMenu.innerHTML = '';
        }
        this.contextMenu = undefined;
        this.contextMenuInstance = undefined;
        this.menuItems = [];
        this.customMenuItems = [];
        this.ids = [];
    }
}