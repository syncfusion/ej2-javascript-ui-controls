import { RibbonGroupBase } from '../ribbon-interfaces';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel } from '@syncfusion/ej2-ribbon';

/**
 * Represents the Page Numbers Group in Header & Footer tab
 * @private
 */
export class PageNumbersGroup extends RibbonGroupBase {
    /**
     * Constructor for the PageNumbersGroup
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        super(container);
    }

    /**
     * Gets the ribbon group model for Page Numbers
     * @returns {RibbonGroupModel} The ribbon group model
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            header: this.localObj.getConstant('Page Numbers'),
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Page Numbers'),
            collections: [
                {
                    items: [
                        {
                            type: 'Button',
                            keyTip: 'NU',
                            buttonSettings: {
                                content: this.localObj.getConstant('Page Number'),
                                iconCss: 'e-icons e-de-ctnr-pagenumber',
                                clicked: this.pageNumberHandler.bind(this)
                            },
                            id: this.ribbonId + '_page_number',
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('Add page numbers')
                            }
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Handler for page number button click - inserts current page number at cursor position
     * @returns {void}
     */
    private pageNumberHandler(): void {
        this.documentEditor.editorModule.insertPageNumber();
    }
}
