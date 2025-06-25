import { RibbonGroupModel } from '@syncfusion/ej2-ribbon';
import { RibbonGroupBase } from '../ribbon-interfaces';

/**
 * Links group implementation for Insert tab
 * @private
 */
export class LinksGroup extends RibbonGroupBase {
    /**
     * Get the Ribbon items for Links group
     * @returns {RibbonGroupModel} - Links group model
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            header: this.localObj.getConstant('Links'),
            groupIconCss: 'e-icons e-de-ctnr-link',
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Links'),
            collections: [{
                items: [{
                    type: 'Button',
                    keyTip: 'I',
                    buttonSettings: {
                        content: this.localObj.getConstant('Link'),
                        iconCss: 'e-icons e-de-ctnr-link',
                        isToggle: false,
                        clicked: this.insertLinkHandler.bind(this)
                    },
                    id: this.ribbonId + '_link',
                    ribbonTooltipSettings: {
                        content: this.localObj.getConstant('Create Hyperlink')
                    }
                }]
            }]
        };
    }

    private insertLinkHandler(): void {
        this.container.documentEditor.showDialog('Hyperlink');
    }
}
