import { RibbonGroupModel } from '@syncfusion/ej2-ribbon';
import { RibbonGroupBase } from '../ribbon-interfaces';

export const TABLE_ID: string = '_table';

/**
 * Tables group implementation for Insert tab
 * @private
 */
export class TablesGroup extends RibbonGroupBase {
    /**
     * Get the Ribbon items for Tables group
     * @returns {RibbonGroupModel} - The ribbon items for Tables group
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            header: this.localObj.getConstant('Table'),
            groupIconCss: 'e-icons e-de-ctnr-table',
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Table'),
            collections: [{
                items: [{
                    type: 'Button',
                    keyTip: 'T',
                    buttonSettings: {
                        content: this.localObj.getConstant('Table'),
                        iconCss: 'e-icons e-de-ctnr-table',
                        isToggle: false,
                        clicked: this.insertTableHandler.bind(this)
                    },
                    id: this.ribbonId + TABLE_ID,
                    ribbonTooltipSettings: {
                        content: this.localObj.getConstant('Insert a table into the document')
                    }
                }]
            }]
        };
    }

    private insertTableHandler(): void {
        this.container.documentEditor.showDialog('Table');
    }
    /**
     * Update selection to reflect current state
     * @returns {void}
     * @private
     */
    public updateSelection(): void {
        const isPlainContentControl: boolean = this.documentEditor.selectionModule.isPlainContentControl();
        if (isPlainContentControl) {
            this.container.ribbon.ribbon.disableItem(this.ribbonId + TABLE_ID);
        } else {
            this.container.ribbon.ribbon.enableItem(this.ribbonId + TABLE_ID);
        }
    }
}
