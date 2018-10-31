import { ContextMenu as Menu, ContextMenuModel, MenuItemModel, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { LayoutViewer } from './viewer';
import { isNullOrUndefined, L10n, setCulture, classList } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../document-editor';
import { Selection } from './index';
import { TextPosition } from './selection/selection-helper';
import { FieldElementBox } from './viewer/page';

const CONTEXTMENU_COPY: string = '_contextmenu_copy';
const CONTEXTMENU_CUT: string = '_contextmenu_cut';
const CONTEXTMENU_PASTE: string = '_contextmenu_paste';
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
const CONTEXTMENU_CONTINUE_NUMBERING: string = '_contextmenu_continue_numbering';
const CONTEXTMENU_RESTART_AT: string = '_contextmenu_restart_at';
/**
 * Context Menu class
 */
export class ContextMenu {
    private viewer: LayoutViewer;
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
    constructor(viewer: LayoutViewer) {
        this.viewer = viewer;
        let locale: L10n = new L10n('documenteditor', this.viewer.owner.defaultLocale);
        locale.setLocale(this.viewer.owner.locale);
        setCulture(this.viewer.owner.locale);
        this.initContextMenu(locale);
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
    public initContextMenu(localValue: L10n): void {
        let id: string = this.viewer.owner.element.id;
        this.contextMenu = document.createElement('div');
        this.contextMenu.id = this.viewer.owner.containerId + 'e-de-contextmenu';
        document.body.appendChild(this.contextMenu);
        let ul: HTMLUListElement = document.createElement('ul');
        ul.style.width = 'auto';
        ul.id = this.viewer.owner.containerId + 'e-de-contextmenu-list';
        ul.style.listStyle = 'none';
        ul.style.margin = '0px';
        ul.style.padding = '0px';
        ul.style.maxHeight = 'auto';
        ul.oncontextmenu = this.disableBrowserContextmenu;
        this.contextMenu.appendChild(ul);
        let menuItems: MenuItemModel[] = [
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
                iconCss: 'e-icons e-de-icon-table-merge-cells'
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
            target: '#' + this.viewer.owner.containerId + 'e-de-contextmenu',
            items: menuItems,
            select: (args: MenuEventArgs) => {
                let item: string = args.element.id;
                this.handleContextMenuItem(item);
            },
        };
        this.contextMenuInstance = new Menu(menuOptions, '#' + this.viewer.owner.containerId + 'e-de-contextmenu-list');
        this.contextMenuInstance.beforeOpen = () => {
            if (this.viewer && this.viewer.selection) {
                classList(this.viewer.selection.caret, [], ['e-de-cursor-animation']);
                this.viewer.selection.showCaret();
            }
        };
        this.contextMenuInstance.onClose = () => {
            if (this.viewer && this.viewer.selection) {
                classList(this.viewer.selection.caret, ['e-de-cursor-animation'], []);
                this.viewer.updateFocus();
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
        let id: string = this.viewer.owner.element.id;
        switch (item) {
            case id + CONTEXTMENU_COPY:
                this.viewer.selection.copy();
                break;
            case id + CONTEXTMENU_CUT:
                this.viewer.owner.editor.cut();
                break;
            case id + CONTEXTMENU_PASTE:
                if (!this.viewer.owner.isReadOnlyMode) {
                    this.viewer.owner.editorModule.pasteInternal(undefined);
                }
                break;
            case id + CONTEXTMENU_UPDATE_FIELD:
                if (!this.viewer.owner.isReadOnlyMode) {
                    this.viewer.owner.editorModule.updateToc();
                }
                break;
            case id + CONTEXTMENU_EDIT_FIELD:
                if (!this.viewer.owner.isReadOnlyMode) {
                    this.viewer.owner.tableOfContentsDialogModule.show();
                }
                break;
            case id + CONTEXTMENU_FONT_DIALOG:
                if (this.viewer.owner.fontDialogModule) {
                    this.viewer.owner.fontDialogModule.showFontDialog();
                }
                break;
            case id + CONTEXTMENU_OPEN_HYPERLINK:
                this.viewer.selection.navigateHyperlink();
                break;
            case id + CONTEXTMENU_COPY_HYPERLINK:
                this.viewer.selection.copyHyperlink();
                break;
            case id + CONTEXTMENU_EDIT_HYPERLINK:
            case id + CONTEXTMENU_HYPERLINK:
                if (this.viewer.owner.hyperlinkDialogModule) {
                    this.viewer.owner.hyperlinkDialogModule.show();
                }
                break;
            case id + CONTEXTMENU_REMOVE_HYPERLINK:
                this.viewer.owner.editor.removeHyperlink();
                break;
            case id + CONTEXTMENU_PARAGRAPH:
                if (this.viewer.owner.paragraphDialogModule) {
                    this.viewer.owner.paragraphDialogModule.show();
                }
                break;
            case id + CONTEXTMENU_TABLE:
                this.viewer.owner.tablePropertiesDialogModule.show();
                break;
            case id + CONTEXTMENU_MERGE_CELL:
                this.viewer.owner.editor.mergeCells();
                break;
            case id + CONTEXTMENU_INSERT_ABOVE:
                this.viewer.owner.editor.insertRow(true);
                break;
            case id + CONTEXTMENU_INSERT_BELOW:
                this.viewer.owner.editor.insertRow(false);
                break;
            case id + CONTEXTMENU_INSERT_LEFT:
                this.viewer.owner.editor.insertColumn(true);
                break;
            case id + CONTEXTMENU_INSERT_RIGHT:
                this.viewer.owner.editor.insertColumn(false);
                break;
            case id + CONTEXTMENU_COMPLETE_DELETE_TABLE:
                this.viewer.owner.editor.deleteTable();
                break;
            case id + CONTEXTMENU_DELETE_ROW:
                this.viewer.owner.editor.deleteRow();
                break;
            case id + CONTEXTMENU_DELETE_COLUMN:
                this.viewer.owner.editor.deleteColumn();
                break;
            case id + CONTEXTMENU_CONTINUE_NUMBERING:
                this.viewer.owner.editorModule.applyContinueNumbering(this.viewer.selection);
                break;
            case id + CONTEXTMENU_RESTART_AT:
                this.viewer.owner.editorModule.applyRestartNumbering(this.viewer.selection);
                break;
        }
    }
    /**
     * Handles on context menu key pressed.
     * @param  {PointerEvent} event
     * @private
     */
    public onContextMenuInternal = (event: PointerEvent): void => {
        if (this.showHideElements(this.viewer.selection)) {
            this.contextMenuInstance.open(event.y, event.x);
            event.preventDefault();
        }
    }
    private showHideElements(selection: Selection): boolean {
        let owner: DocumentEditor = this.viewer.owner;
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

        cut.style.display = 'none';
        paste.style.display = 'none';
        (paste.nextSibling as HTMLElement).style.display = 'none';
        hyperlink.style.display = 'none';
        openHyperlink.style.display = 'none';
        copyHyperlink.style.display = 'none';
        editHyperlink.style.display = 'none';
        removeHyperlink.style.display = 'none';
        (removeHyperlink.nextSibling as HTMLElement).style.display = 'none';
        mergeCells.style.display = 'none';
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

        if (isNullOrUndefined(selection)) {
            return false;
        }
        selection.hideToolTip();
        if (selection.isEmpty) {
            cut.classList.add('e-disabled');
            copy.classList.add('e-disabled');
        } else {
            cut.classList.remove('e-disabled');
            copy.classList.remove('e-disabled');
        }
        if (owner.isReadOnlyMode) {
            return true;
        }
        cut.style.display = 'block';
        paste.style.display = 'block';
        (paste.nextSibling as HTMLElement).style.display = 'block';
        insertTable.classList.add('e-blankicon');
        deleteTable.classList.add('e-blankicon');
        updateField.classList.add('e-blankicon');
        editField.classList.add('e-blankicon');
        if (owner.enableLocalPaste && !isNullOrUndefined(owner.editor.copiedData)) {
            paste.classList.remove('e-disabled');
        } else {
            paste.classList.add('e-disabled');
        }
        if (selection.contextType === 'TableOfContents') {
            updateField.style.display = 'block';
            editField.style.display = 'block';
            (restartAt.nextSibling as HTMLElement).style.display = 'block';
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
            } else {
                if (owner.hyperlinkDialogModule) {
                    hyperlink.style.display = 'block';
                }
            }
        }
        if (this.viewer.owner.selection.start.paragraph.isInsideTable
            && this.viewer.owner.selection.end.paragraph.isInsideTable) {
            (paragraph.nextSibling as HTMLElement).style.display = 'block';
            if (owner.tablePropertiesDialogModule) {
                tableProperties.style.display = 'block';
            }
            insertTable.style.display = 'block';
            deleteTable.style.display = 'block';
            if (this.viewer.owner.editor.canMergeCells()) {
                mergeCells.style.display = 'block';
            }
        } else {
            if (this.viewer.owner.fontDialogModule) {
                font.style.display = 'block';
                (font.previousSibling as HTMLElement).style.display = 'block';
            }
            if (this.viewer.owner.paragraphDialogModule) {
                paragraph.style.display = 'block';
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
        if (this.contextMenu) {
            if (this.contextMenu.parentElement) {
                this.contextMenu.parentElement.removeChild(this.contextMenu);
            }
            this.contextMenu.innerHTML = '';
        }
        this.contextMenu = undefined;
        this.contextMenuInstance = undefined;
    }
}