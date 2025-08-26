import { RibbonGroupModel } from '@syncfusion/ej2-ribbon';
import { RibbonGroupBase } from '../ribbon-interfaces';

export const HEADER_ID: string = '_header';
export const FOOTER_ID: string = '_footer';
export const PAGE_NUMBER_ID: string = '_page_number';

/**
 * Header & Footer group implementation for Insert tab
 * @private
 */
export class HeaderFooterGroup extends RibbonGroupBase {
    /**
     * Get the Ribbon items for Header & Footer group
     * @returns {RibbonGroupModel} - Ribbon items for Header & Footer group
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            header: this.localObj.getConstant('Header & Footer'),
            groupIconCss: 'e-icons e-de-ctnr-header',
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Header & Footer'),
            collections: [{
                items: [
                    {
                        type: 'Button',
                        keyTip: 'H',
                        buttonSettings: {
                            content: this.localObj.getConstant('Header'),
                            iconCss: 'e-icons e-de-ctnr-header',
                            isToggle: false,
                            clicked: this.headerHandler.bind(this)
                        },
                        id: this.ribbonId + HEADER_ID,
                        ribbonTooltipSettings: {
                            // title: this.localObj.getConstant('Header'),
                            content: this.localObj.getConstant('Add or edit the header')
                        }
                    },
                    {
                        type: 'Button',
                        keyTip: 'F',
                        buttonSettings: {
                            content: this.localObj.getConstant('Footer'),
                            iconCss: 'e-icons e-de-ctnr-footer',
                            isToggle: false,
                            clicked: this.footerHandler.bind(this)
                        },
                        id: this.ribbonId + FOOTER_ID,
                        ribbonTooltipSettings: {
                            // title: this.localObj.getConstant('Footer'),
                            content: this.localObj.getConstant('Add or edit the footer')
                        }
                    },
                    {
                        type: 'Button',
                        keyTip: 'NU',
                        buttonSettings: {
                            content: this.localObj.getConstant('Page Number'),
                            iconCss: 'e-icons e-de-ctnr-pagenumber',
                            isToggle: false,
                            clicked: this.pageNumberHandler.bind(this)
                        },
                        id: this.ribbonId + PAGE_NUMBER_ID,
                        ribbonTooltipSettings: {
                            // title: this.localObj.getConstant('Page Number'),
                            content: this.localObj.getConstant('Add page numbers')
                        }
                    }
                ]
            }]
        };
    }


    private headerHandler(): void {
        this.container.documentEditor.selection.goToHeader();
        this.container.statusBar.toggleWebLayout();
    }

    private footerHandler(): void {
        this.container.documentEditor.selection.goToFooter();
        this.container.statusBar.toggleWebLayout();
    }

    private pageNumberHandler(): void {
        this.container.documentEditor.editorModule.insertPageNumber();
    }
}
