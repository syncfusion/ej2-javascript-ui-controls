import { RibbonGroupModel } from '@syncfusion/ej2-ribbon';
import { RibbonGroupBase } from '../ribbon-interfaces';


/**
 * Table of Contents group implementation for Insert tab
 * @private
 */
export class TOCGroup extends RibbonGroupBase {
    /**
     * Get the Ribbon items for Table of Contents group
     * @returns {RibbonGroupModel} - Table of Contents group model
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            header: this.localObj.getConstant('Table of Contents'),
            groupIconCss: 'e-icons e-de-ctnr-tableofcontent',
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Table of Contents'),
            collections: [{
                items: [{
                    type: 'Button',
                    keyTip: 'A',
                    buttonSettings: {
                        content: this.localObj.getConstant('Table of Contents'),
                        iconCss: 'e-icons e-de-ctnr-tableofcontent',
                        isToggle: false,
                        clicked: this.insertTableOfContentsHandler.bind(this)
                    },
                    id: this.ribbonId + '_toc',
                    ribbonTooltipSettings: {
                        content: this.localObj.getConstant('Provide an overview of your document by adding a table of contents')
                    }
                }]
            }]
        };
    }

    private insertTableOfContentsHandler(): void {
        this.container.documentEditor.editorModule.insertTableOfContents();
    }
}
