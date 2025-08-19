import { RibbonGroupBase } from '../ribbon-interfaces';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel } from '@syncfusion/ej2-ribbon';

export const CELL_ALIGN_GROUP_ID: string = '_cell_align_group';
export const ALIGN_TOP_BUTTON_ID: string = '_align_top_button';
export const ALIGN_CENTER_BUTTON_ID: string = '_align_center_button';
export const ALIGN_BOTTOM_BUTTON_ID: string = '_align_bottom_button';

/**
 * Represents the Cell Align Group in Table Layout tab
 * @private
 */
export class CellAlignGroup extends RibbonGroupBase {

    /**
     * Constructor for the CellAlignGroup
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        super(container);
    }

    /**
     * Gets the ribbon group model for Cell Align
     * @returns {RibbonGroupModel} - Ribbon group model
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            id: this.ribbonId + CELL_ALIGN_GROUP_ID,
            header: this.localObj.getConstant('Align Text'),
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Align Text'),
            collections: [
                {
                    items: [
                        {
                            type: 'Button',
                            keyTip: 'AT',
                            id: this.ribbonId + ALIGN_TOP_BUTTON_ID,
                            buttonSettings: {
                                iconCss: 'e-icons e-de-ctnr-aligntop',
                                cssClass: 'e-flat e-de-icon-btn',
                                isToggle: true,
                                clicked: () => this.applyAlignTop()
                            },
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('Align top')
                            }
                        },
                        {
                            type: 'Button',
                            keyTip: 'AL',
                            id: this.ribbonId + ALIGN_CENTER_BUTTON_ID,
                            buttonSettings: {
                                iconCss: 'e-icons e-de-ctnr-aligncenter-table',
                                cssClass: 'e-flat e-de-icon-btn',
                                isToggle: true,
                                clicked: () => this.applyAlignCenterHorizontal()
                            },
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('Align center')
                            }
                        },
                        {
                            type: 'Button',
                            keyTip: 'AB',
                            id: this.ribbonId + ALIGN_BOTTOM_BUTTON_ID,
                            buttonSettings: {
                                iconCss: 'e-icons e-de-ctnr-alignbottom',
                                cssClass: 'e-flat e-de-icon-btn',
                                isToggle: true,
                                clicked: () => this.applyAlignBottom()
                            },
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('Align bottom')
                            }
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Applies top alignment to the selected cells
     * @returns {void}
     */
    private applyAlignTop(): void {
        this.documentEditor.selectionModule.cellFormat.verticalAlignment = 'Top';
    }

    /**
     * Applies center alignment to the selected cells
     * @returns {void}
     */
    private applyAlignCenterHorizontal(): void {
        this.documentEditor.selectionModule.cellFormat.verticalAlignment = 'Center';
    }

    /**
     * Applies bottom alignment to the selected cells
     * @returns {void}
     */
    private applyAlignBottom(): void {
        this.documentEditor.selectionModule.cellFormat.verticalAlignment = 'Bottom';
    }
}
