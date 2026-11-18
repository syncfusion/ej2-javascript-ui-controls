import { RibbonGroupModel } from '@syncfusion/ej2-ribbon';
import { RibbonGroupBase } from '../ribbon-interfaces';

export const TEXT_BOX_ID: string = '_text_box';

/**
 * Text Box group implementation for Insert tab.
 *
 * @private
 */
export class TextBoxGroup extends RibbonGroupBase {
    /**
     * Gets the ribbon group for inserting a text box.
     *
     * @returns {RibbonGroupModel} - Text Box group model.
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            header: this.localObj.getConstant('Text Box'),
            groupIconCss: 'e-icons e-text-annotation',
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Text Box'),
            collections: [{
                items: [{
                    type: 'Button',
                    keyTip: 'X',
                    buttonSettings: {
                        content: this.localObj.getConstant('Text Box'),
                        iconCss: 'e-icons e-text-annotation',
                        isToggle: false,
                        clicked: this.insertTextBoxHandler.bind(this)
                    },
                    id: this.ribbonId + TEXT_BOX_ID,
                    ribbonTooltipSettings: {
                        content: this.localObj.getConstant('Insert a text box into the document')
                    }
                }]
            }]
        };
    }

    private insertTextBoxHandler(): void {
        this.documentEditor.showDialog('TextBox');
    }
}
