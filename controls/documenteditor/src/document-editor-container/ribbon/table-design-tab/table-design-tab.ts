import { L10n } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonTabModel, Ribbon } from '@syncfusion/ej2-ribbon';
import { BordersGroup } from './borders-group';
import { ShadingGroup } from './shading-group';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';

export const TABLE_DESIGN_TAB_ID: string = '_table_design_tab';
/**
 * TableDesignTab class provides a ribbon tab for table design options
 * @private
 */
export class TableDesignTab {
    private container: DocumentEditorContainer;
    private localObj: L10n;
    private bordersGroup: BordersGroup;
    public shadingGroup: ShadingGroup;

    /**
     * Constructor for the TableDesignTab class
     * @param {DocumentEditorContainer}  container - DocumentEditorContainer instance
     */
    public constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.localObj = this.container.localObj;
        this.bordersGroup = new BordersGroup(container);
        this.shadingGroup = new ShadingGroup(container);
    }

    /**
     * Gets the Table Design tab configuration
     * @returns {RibbonTabModel} - RibbonTabModel for the Table Design tab
     * @private
     */
    public getTableDesignTab(): RibbonTabModel {
        return {
            id: this.container.element.id + RIBBON_ID + TABLE_DESIGN_TAB_ID,
            keyTip: 'JT',
            header: this.localObj.getConstant('Table Design'),
            groups: [
                this.bordersGroup.getBordersGroup(),
                this.shadingGroup.getShadingGroup()
            ]
        };
    }

    /**
     * Updates the state of table design controls based on the current selection
     * @returns {void}
     * @private
     */
    public onSelectionChange(): void {
        if (this.container.documentEditor.selection) {
            // Update shading color
            this.shadingGroup.updateShadingColor();
        }
    }

    /**
     * Clean up resources when destroyed
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (this.bordersGroup) {
            this.bordersGroup.destroy();
            this.bordersGroup = undefined;
        }

        if (this.shadingGroup) {
            this.shadingGroup.destroy();
            this.shadingGroup = undefined;
        }
    }
}
