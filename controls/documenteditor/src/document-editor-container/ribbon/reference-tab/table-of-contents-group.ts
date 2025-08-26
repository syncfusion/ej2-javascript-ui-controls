import { RibbonGroupModel, ItemOrientation, RibbonItemModel } from '@syncfusion/ej2-ribbon';
import { DocumentEditor } from '../../../document-editor/document-editor';
import { RibbonGroupBase } from '../ribbon-interfaces';
import { DocumentEditorContainer } from '../../document-editor-container';

/**
 * Table of Contents group implementation for Reference tab
 * @private
 */
export class TableOfContentsGroup extends RibbonGroupBase {
    // Constants for IDs
    private readonly TOC_BUTTON_ID: string = '_toc';
    private readonly UPDATE_TOC_BUTTON_ID: string = '_update_toc';

    /**
     * Constructor for TableOfContentsGroup
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        super(container);
    }

    /**
     * Get the Ribbon items for Table of Contents group
     * @returns {RibbonGroupModel} - Ribbon group model for Table of Contents group
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            header: this.localObj.getConstant('Table of Contents'),
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Table of Contents'),
            orientation: ItemOrientation.Row,
            collections: [
                {
                    items: [
                        {
                            type: 'Button',
                            keyTip: 'T',
                            buttonSettings: {
                                content: this.localObj.getConstant('Table of Contents'),
                                iconCss: 'e-icons e-de-ctnr-tableofcontent',
                                clicked: this.insertTableOfContents.bind(this)
                            },
                            id: this.ribbonId + this.TOC_BUTTON_ID,
                            ribbonTooltipSettings: {
                                title: this.localObj.getConstant('Table of Contents'),
                                content: 'Insert a table of contents'
                            }
                        },
                        {
                            type: 'Button',
                            keyTip: 'U',
                            disabled: true,
                            buttonSettings: {
                                content: this.localObj.getConstant('Update Table'),
                                iconCss: 'e-icons e-de-ctnr-table-update',
                                clicked: this.updateTocHandler.bind(this)
                            },
                            id: this.ribbonId + this.UPDATE_TOC_BUTTON_ID,
                            ribbonTooltipSettings: {
                                title: this.localObj.getConstant('Update Table'),
                                content: 'Update the table of contents'
                            }
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Insert Table of Contents
     * @returns {void}
     */
    private insertTableOfContents(): void {
        this.documentEditor.editorModule.insertTableOfContents();
    }


    /**
     * Update Table of Contents handler
     * @returns {void}
     */
    private updateTocHandler(): void {
        const isReadOnly: boolean = this.documentEditor.isReadOnlyMode;
        if (this.documentEditor.selection.isReferenceField() && (!isReadOnly ||
            (isReadOnly && this.documentEditor.documentHelper.protectionType === 'FormFieldsOnly'))) {
            this.documentEditor.selection.updateRefField();
        } else if (!isReadOnly) {
            this.documentEditor.editorModule.updateToc();
        }
    }

    /**
     * Update UI based on selection state
     * @returns {void}
     * @private
     */
    public updateSelection(): void {


        const isInTocField: boolean = this.documentEditor.selection.contextType === 'TableOfContents';
        if (isInTocField) {
            this.container.ribbon.ribbon.enableItem(this.ribbonId + this.UPDATE_TOC_BUTTON_ID);
        } else {
            this.container.ribbon.ribbon.disableItem(this.ribbonId + this.UPDATE_TOC_BUTTON_ID);
        }

    }
}
