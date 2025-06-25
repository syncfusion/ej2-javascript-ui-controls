import { RibbonGroupBase } from '../ribbon-interfaces';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel, RibbonItemModel, Ribbon } from '@syncfusion/ej2-ribbon';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';

export const CELL_PROPERTIES_GROUP_ID: string = '_cell_properties_group';
export const MERGE_CELLS_BUTTON_ID: string = '_merge_cells_button';

/**
 * Represents the Cell Properties Group in Table Layout tab
 */
export class CellPropertiesGroup extends RibbonGroupBase {
    private commonID: string;

    /**
     * Constructor for the CellPropertiesGroup
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        super(container);
        this.commonID = this.container.element.id + RIBBON_ID;
    }

    /**
     * Gets the ribbon group model for Cell Properties
     * @returns {RibbonGroupModel} - Ribbon group model
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            id: this.commonID + CELL_PROPERTIES_GROUP_ID,
            header: this.localObj.getConstant('Cell Properties'),
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Cell Properties'),
            collections: [
                {
                    items: [
                        this.getMergeCellsButton()
                        // Additional cell property buttons can be added here
                    ]
                }
            ]
        };
    }

    /**
     * Gets the Merge Cells button model
     * @returns {RibbonItemModel} - Ribbon item model for Merge Cells button
     */
    private getMergeCellsButton(): RibbonItemModel {
        return {
            type: 'Button',
            id: this.commonID + MERGE_CELLS_BUTTON_ID,
            disabled: true,
            keyTip: 'M',
            buttonSettings: {
                content: this.localObj.getConstant('Merge cells'),
                iconCss: 'e-icons e-de-ctnr-mergecell',
                clicked: () => this.mergeSelectedCells()
            },
            ribbonTooltipSettings: {
                content: this.localObj.getConstant('Merge cells')
            }
        };
    }

    /**
     * Merges the selected cells
     * @returns { void }
     */
    private mergeSelectedCells(): void {
        this.documentEditor.editorModule.mergeCells();
    }

    /**
     * Checks if cells can be merged
     * @returns {boolean} - True if cells can be merged, false otherwise
     */
    private canMergeCells(): boolean {
        return this.documentEditor.editorModule.canMergeCells();
    }

    /**
     * Updates the merge cells button state based on selection
     * @returns {void}
     */
    public updateSelection(): void {
        this.updateMergeCellsButtonState();
    }

    /**
     * Updates the merge cells button enabled/disabled state
     * @returns {void}
     */
    private updateMergeCellsButtonState(): void {
        const id: string = this.commonID + MERGE_CELLS_BUTTON_ID;
        const ribbon: Ribbon = this.container.ribbon.ribbon;
        if (this.canMergeCells()) {
            ribbon.enableItem(id);
        } else {
            ribbon.disableItem(id);
        }
    }
}
