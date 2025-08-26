import { Ribbon, RibbonGroupModel } from '@syncfusion/ej2-ribbon';
import { RibbonGroupBase } from '../ribbon-interfaces';

export const PAGE_BREAK_ID: string = '_page_break';

/**
 * Pages group implementation for Insert tab
 * @private
 */
export class PagesGroup extends RibbonGroupBase {
    /**
     * Get the Ribbon items for Pages group
     * @returns {RibbonGroupModel} - Pages group model
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            header: this.localObj.getConstant('Pages'),
            groupIconCss: 'e-icons e-de-ctnr-page-break',
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Pages'),
            collections: [{
                items: [{
                    type: 'Button',
                    keyTip: 'B',
                    buttonSettings: {
                        content: this.localObj.getConstant('Page Break'),
                        iconCss: 'e-icons e-de-ctnr-page-break',
                        isToggle: false,
                        clicked: this.insertPageBreakHandler.bind(this)
                    },
                    id: this.ribbonId + PAGE_BREAK_ID,
                    ribbonTooltipSettings: {
                        // title: this.localObj.getConstant('Page Break'),
                        content: this.localObj.getConstant('Insert a page break at the current position')
                    }
                }]
            }]
        };
    }

    private insertPageBreakHandler(): void {
        this.documentEditor.editorModule.insertPageBreak();
    }

    /**
     * Update selection to reflect current state
     * @returns {void}
     * @private
     */
    public updateSelection(): void {
        const isHeaderFooter: boolean = this.documentEditor.selection.contextType.indexOf('Header') >= 0 ||
            this.documentEditor.selection.contextType.indexOf('Footer') >= 0;
        const isInTable: boolean = this.documentEditor.selection.contextType.indexOf('Table') >= 0;

        const ribbon: Ribbon = this.container.ribbon.ribbon;
        if (ribbon) {
            if (isInTable || isHeaderFooter || this.container.documentEditor.selection.isinFootnote
                || this.container.documentEditor.selection.isinEndnote) {
                ribbon.disableItem(this.ribbonId + PAGE_BREAK_ID);
            } else {
                ribbon.enableItem(this.ribbonId + PAGE_BREAK_ID);
            }
        }
    }
}
