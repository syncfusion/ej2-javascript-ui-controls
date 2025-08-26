import { RibbonGroupBase } from '../ribbon-interfaces';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel, RibbonItemModel, RibbonItemType, ItemOrientation } from '@syncfusion/ej2-ribbon';
import { Editor, Selection } from '../../../document-editor/implementation';

export const TABLE_OPERATIONS_GROUP_ID: string = '_table_operations_group';
export const SELECT_DROPDOWN_ID: string = '_select_dropdown';
export const DELETE_DROPDOWN_ID: string = '_delete_dropdown';
export const INSERT_DROPDOWN_ID: string = '_insert_dropdown';

/**
 * Represents the Table Operations Group in Table Layout tab
 * @private
 */
export class TableOperationsGroup extends RibbonGroupBase {
    /**
     * Constructor for the TableOperationsGroup
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        super(container);
    }

    /**
     * Gets the ribbon group model for Table Operations
     * @returns {RibbonGroupModel} The ribbon group model
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            id: this.ribbonId + TABLE_OPERATIONS_GROUP_ID,
            header: this.localObj.getConstant('Rows & Columns'),
            orientation: ItemOrientation.Row,
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Rows & Columns'),
            collections: [
                {
                    items: [
                        this.getSelectDropDown(),
                        this.getDeleteDropDown(),
                        this.getInsertDropDown()
                    ]
                }
            ]
        };
    }

    /**
     * Gets the Select dropdown model
     * @returns {RibbonItemModel} The ribbon item model
     */
    private getSelectDropDown(): RibbonItemModel {
        return {
            type: RibbonItemType.DropDown,
            id: this.ribbonId + SELECT_DROPDOWN_ID,
            keyTip: 'K',
            dropDownSettings: {
                content: this.localObj.getConstant('Select'),
                iconCss: 'e-icons e-de-ctnr-mouse-pointer',
                items: [
                    { text: this.localObj.getConstant('Table'), id: this.ribbonId + '_select_table', iconCss: 'e-icons e-de-ctnr-table-2' },
                    { text: this.localObj.getConstant('Row'), id: this.ribbonId + '_select_row', iconCss: 'e-icons e-de-ctnr-freeze-row' },
                    { text: this.localObj.getConstant('Column'), id: this.ribbonId + '_select_column', iconCss: 'e-icons e-de-ctnr-freeze-column' },
                    { text: this.localObj.getConstant('Cell'), id: this.ribbonId + '_select_cell', iconCss: 'e-icons e-de-ctnr-table-cell' }
                ],
                select: (args: any) => {
                    this.handleTableSelection(args.item.text);
                }
            },
            ribbonTooltipSettings: {
                content: this.localObj.getConstant('Select the table')
            }
        };
    }

    /**
     * Gets the Delete dropdown model
     * @returns {RibbonItemModel} The ribbon item model
     */
    private getDeleteDropDown(): RibbonItemModel {
        return {
            type: RibbonItemType.DropDown,
            id: DELETE_DROPDOWN_ID,
            keyTip: 'H',
            dropDownSettings: {
                content: this.localObj.getConstant('Delete'),
                iconCss: 'e-icons e-de-ctnr-table-delete',
                items: [
                    { text: this.localObj.getConstant('Table'), id: this.ribbonId + '_delete_table', iconCss: 'e-icons e-de-ctnr-table-delete' },
                    { text: this.localObj.getConstant('Row'), id: this.ribbonId + '_delete_row', iconCss: 'e-icons e-de-ctnr-deleterows' },
                    { text: this.localObj.getConstant('Column'), id: this.ribbonId + '_delete_column', iconCss: 'e-icons e-de-ctnr-deletecolumns' }
                ],
                select: (args: any) => {
                    this.handleTableDeletion(args.item.text);
                }
            },
            ribbonTooltipSettings: {
                content: this.localObj.getConstant('Delete the table')
            }
        };
    }

    /**
     * Gets the Insert dropdown model
     * @returns {RibbonItemModel} The ribbon item model
     */
    private getInsertDropDown(): RibbonItemModel {
        return {
            type: RibbonItemType.DropDown,
            id: INSERT_DROPDOWN_ID,
            keyTip: 'N',
            dropDownSettings: {
                content: this.localObj.getConstant('Insert'),
                iconCss: 'e-icons e-de-ctnr-table',
                items: [
                    { text: this.localObj.getConstant('Row Above'), id: this.ribbonId + '_insert_row_above', iconCss: 'e-icons e-de-ctnr-insertabove' },
                    { text: this.localObj.getConstant('Row Below'), id: this.ribbonId + '_insert_row_below', iconCss: 'e-icons e-de-ctnr-insertbelow' },
                    { text: this.localObj.getConstant('Column Left'), id: this.ribbonId + '_insert_column_left', iconCss: 'e-icons e-de-ctnr-insertleft' },
                    { text: this.localObj.getConstant('Column Right'), id: this.ribbonId + '_insert_column_right', iconCss: 'e-icons e-de-ctnr-insertright' }
                ],
                select: (args: any) => {
                    this.handleTableInsertion(args.item.text);
                }
            },
            ribbonTooltipSettings: {
                content: this.localObj.getConstant('Insert rows and columns')
            }
        };
    }

    private handleTableSelection(action: string): void {
        const selection: Selection = this.documentEditor.selection;
        switch (action) {
        case this.localObj.getConstant('Table'):
            selection.selectTable();
            break;
        case this.localObj.getConstant('Row'):
            selection.selectRow();
            break;
        case this.localObj.getConstant('Column'):
            selection.selectColumn();
            break;
        case this.localObj.getConstant('Cell'):
            selection.selectCell();
            break;
        }
    }

    private handleTableDeletion(action: string): void {
        const editor: Editor = this.documentEditor.editorModule;
        switch (action) {
        case this.localObj.getConstant('Table'):
            editor.deleteTable();
            break;
        case this.localObj.getConstant('Row'):
            editor.deleteRow();
            break;
        case this.localObj.getConstant('Column'):
            editor.deleteColumn();
            break;
        }
    }

    private handleTableInsertion(action: string): void {
        const editor: Editor = this.documentEditor.editorModule;
        switch (action) {
        case this.localObj.getConstant('Row Above'):
            editor.insertRow(true);
            break;
        case this.localObj.getConstant('Row Below'):
            editor.insertRow(false);
            break;
        case this.localObj.getConstant('Column Left'):
            editor.insertColumn(true);
            break;
        case this.localObj.getConstant('Column Right'):
            editor.insertColumn(false);
            break;
        }
    }
}
