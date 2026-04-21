import { RibbonGroupBase } from '../ribbon-interfaces';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel, RibbonItemType, ItemOrientation } from '@syncfusion/ej2-ribbon';

// Constants for UI element IDs
export const CLOSE_GROUP_ID: string = '_close_group';
export const CLOSE_BUTTON_ID: string = '_close_button';

/**
 * Represents the Close Group in Header & Footer tab
 * @private
 */
export class CloseGroup extends RibbonGroupBase {
    /**
     * Constructor for the CloseGroup
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        super(container);
    }

    /**
     * Gets the ribbon group model for Close
     * @returns {RibbonGroupModel} The ribbon group model
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            id: this.ribbonId + CLOSE_GROUP_ID,
            header: this.localObj.getConstant('Close'),
            orientation: ItemOrientation.Row,
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Close'),
            collections: [
                {
                    items: [
                        {
                            type: RibbonItemType.Button,
                            id: this.ribbonId + CLOSE_BUTTON_ID,
                            keyTip: 'C',
                            buttonSettings: {
                                content: this.localObj.getConstant('Close'),
                                iconCss: 'e-icons e-de-ctnr-close',
                                clicked: () => this.closeHeaderFooter()
                            },
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('Close header and footer view')
                            }
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Closes the header and footer editor
     * @returns {void}
     */
    private closeHeaderFooter(): void {
        this.documentEditor.selection.closeHeaderFooter();
    }
}
