import { L10n } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonTabModel } from '@syncfusion/ej2-ribbon';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';
import { TableOperationsGroup } from './table-operations-group';
import { CellPropertiesGroup } from './cell-properties-group';
import { CellAlignGroup } from './cell-align-group';
import { TablePropertiesGroup } from './table-properties-group';


export const TABLE_LAYOUT_TAB_ID: string = '_table_layout_tab';

/**
 * Represents the Table Layout Tab in the Ribbon
 * @private
 */
export class TableLayoutTab {
    private container: DocumentEditorContainer;
    private localObj: L10n;

    // Group instances
    private tableOperationsGroup: TableOperationsGroup;
    private cellPropertiesGroup: CellPropertiesGroup;
    private cellAlignGroup: CellAlignGroup;
    private tablePropertiesGroup: TablePropertiesGroup;

    /**
     * Constructor for the TableLayoutTab
     *
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    public constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.localObj = this.container.localObj;

        // Initialize group instances
        this.tableOperationsGroup = new TableOperationsGroup(container);
        this.cellPropertiesGroup = new CellPropertiesGroup(container);
        this.cellAlignGroup = new CellAlignGroup(container);
        this.tablePropertiesGroup = new TablePropertiesGroup(container);
    }

    /**
     * Gets the Table Layout Tab model
     *
     * @returns {RibbonTabModel} The ribbon tab model
     */
    public getTableLayoutTab(): RibbonTabModel {
        return {
            id: this.container.element.id + RIBBON_ID + TABLE_LAYOUT_TAB_ID,
            keyTip: 'JL',
            header: this.localObj.getConstant('Table Layout'),
            groups: [
                this.tablePropertiesGroup.getGroupModel(),
                this.tableOperationsGroup.getGroupModel(),
                this.cellPropertiesGroup.getGroupModel(),
                this.cellAlignGroup.getGroupModel()
            ]
        };
    }

    /**
     * Updates UI based on table layout changes
     *
     * @returns {void}
     */
    public onTableLayoutChange(): void {
        // this.tablePropertiesGroup.updateSelection();
        this.cellPropertiesGroup.updateSelection();
        this.cellAlignGroup.updateSelection();
    }

    /**
     * Disposes event handlers
     *
     * @returns {void}
     */
    public destroy(): void {
        // Dispose events in group classes
        if (this.tablePropertiesGroup.destroy) {
            this.tablePropertiesGroup.destroy();
            this.tablePropertiesGroup = undefined;
        }
        if (this.tableOperationsGroup.destroy) {
            this.tableOperationsGroup.destroy();
            this.tableOperationsGroup = undefined;
        }
        if (this.cellPropertiesGroup.destroy) {
            this.cellPropertiesGroup.destroy();
            this.cellPropertiesGroup = undefined;
        }
        if (this.cellAlignGroup.destroy) {
            this.cellAlignGroup.destroy();
            this.cellAlignGroup = undefined;
        }
    }
}
