import { RibbonGroupModel, ItemOrientation, RibbonItemModel, Ribbon } from '@syncfusion/ej2-ribbon';
import { RibbonGroupBase } from '../ribbon-interfaces';
import { DocumentEditorContainer } from '../../document-editor-container';

// Constants for IDs
export const INSERT_FOOTNOTE_BUTTON_ID: string = '_insert_footnote';
export const INSERT_ENDNOTE_BUTTON_ID: string = '_insert_endnote';

/**
 * Footnotes group implementation for Reference tab
 * @private
 */
export class FootnotesGroup extends RibbonGroupBase {


    /**
     * Constructor for FootnotesGroup
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        super(container);
    }

    /**
     * Get the Ribbon items for Footnotes group
     * @returns {RibbonGroupModel} - Ribbon group model
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            header: this.localObj.getConstant('Footnotes'),
            orientation: ItemOrientation.Row,
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Footnotes'),
            collections: [
                {
                    items: [
                        {
                            type: 'Button',
                            keyTip: 'RF',
                            buttonSettings: {
                                content: this.localObj.getConstant('Insert Footnote'),
                                iconCss: 'e-icons e-de-footnote',
                                clicked: this.insertFootnoteHandler.bind(this)
                            },
                            id: this.ribbonId + INSERT_FOOTNOTE_BUTTON_ID,
                            ribbonTooltipSettings: {
                                // title: this.localObj.getConstant('Insert Footnote'),
                                content: this.localObj.getConstant('Footnote Tooltip')
                            }
                        },
                        {
                            type: 'Button',
                            keyTip: 'RE',
                            buttonSettings: {
                                content: this.localObj.getConstant('Insert Endnote'),
                                iconCss: 'e-icons e-de-endnote',
                                clicked: this.insertEndnoteHandler.bind(this)
                            },
                            id: this.ribbonId + INSERT_ENDNOTE_BUTTON_ID,
                            ribbonTooltipSettings: {
                                // title: this.localObj.getConstant('Insert Endnote'),
                                content: this.localObj.getConstant('Endnote Tooltip')
                            }
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Insert Footnote handler
     * @returns {void}
     */
    private insertFootnoteHandler(): void {
        this.documentEditor.editorModule.insertFootnote();
    }

    /**
     * Insert Endnote handler
     * @returns {void}
     */
    private insertEndnoteHandler(): void {
        this.documentEditor.editorModule.insertEndnote();
    }

    /**
     * Update UI based on selection state
     * @returns {void}
     * @private
     */
    public updateSelection(): void {
        const footnoteButton: RibbonItemModel = this.container.ribbon.ribbon.getItem(this.ribbonId + INSERT_FOOTNOTE_BUTTON_ID);
        const endnoteButton: RibbonItemModel = this.container.ribbon.ribbon.getItem(this.ribbonId + INSERT_ENDNOTE_BUTTON_ID);

        if (footnoteButton && endnoteButton) {
            const isPlainContentControl: boolean = this.documentEditor.selectionModule.isPlainContentControl();
            const disableButtons: boolean = this.documentEditor.selectionModule.isinFootnote ||
                this.documentEditor.selectionModule.isinEndnote ||
                this.documentEditor.enableHeaderAndFooter ||
                isPlainContentControl;
            const ribbon: Ribbon = this.container.ribbon.ribbon;
            if (disableButtons) {
                ribbon.disableItem(this.ribbonId + INSERT_FOOTNOTE_BUTTON_ID);
                ribbon.disableItem(this.ribbonId + INSERT_ENDNOTE_BUTTON_ID);
            } else {

                ribbon.enableItem(this.ribbonId + INSERT_FOOTNOTE_BUTTON_ID);
                ribbon.enableItem(this.ribbonId + INSERT_ENDNOTE_BUTTON_ID);
            }

        }
    }
}
