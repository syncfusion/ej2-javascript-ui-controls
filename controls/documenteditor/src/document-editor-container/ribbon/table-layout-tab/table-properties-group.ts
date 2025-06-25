import { RibbonGroupBase } from '../ribbon-interfaces';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel, RibbonItemModel } from '@syncfusion/ej2-ribbon';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';

export const TABLE_PROPERTIES_GROUP_ID: string = '_table_properties_group';
export const TABLE_PROPERTIES_BUTTON_ID: string = '_table_properties_button';

/**
 * Represents the Table Properties Group in Table Layout tab
 * @private
 */
export class TablePropertiesGroup extends RibbonGroupBase {

    /**
     * Constructor for the TablePropertiesGroup
     *
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        super(container);
    }

    /**
     * Gets the ribbon group model for Table Properties
     *
     * @returns {RibbonGroupModel} The ribbon group model
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            id: this.ribbonId + TABLE_PROPERTIES_GROUP_ID,
            header: this.localObj.getConstant('Table'),
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Table'),
            collections: [
                {
                    items: [
                        this.getTablePropertiesButton()
                    ]
                }
            ]
        };
    }

    /**
     * Gets the Table Properties button model
     *
     * @returns {RibbonItemModel} The ribbon item model
     */
    private getTablePropertiesButton(): RibbonItemModel {
        return {
            type: 'Button',
            id: this.ribbonId + TABLE_PROPERTIES_BUTTON_ID,
            keyTip: 'TP',
            buttonSettings: {
                content: this.localObj.getConstant('Properties'),
                iconCss: 'e-icons e-de-ctnr-table',
                clicked: () => this.openTablePropertiesDialog()
            },
            ribbonTooltipSettings: {
                content: this.localObj.getConstant('Show the Table Properties dialog')
            }
        };
    }

    /**
     * Opens the table properties dialog
     *
     * @returns {void}
     */
    private openTablePropertiesDialog(): void {
        this.documentEditor.showDialog('TableProperties');
    }
}
