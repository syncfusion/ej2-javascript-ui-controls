import { Ribbon, RibbonGroupModel, RibbonItemModel } from '@syncfusion/ej2-ribbon';
import { RibbonGroupBase } from '../ribbon-interfaces';
import { RibbonConstants } from '../ribbon-constants';
import { RibbonHelper } from '../../helper/ribbon-helper';

/**
 * Views group implementation for View tab
 * @private
 */
export class ViewsGroup extends RibbonGroupBase {
    /**
     * Get the Ribbon items for Document Views group
     * @returns {RibbonGroupModel} The ribbon group model
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            header: this.localObj.getConstant(RibbonConstants.VIEWS_GROUP_HEADER),
            groupIconCss: RibbonConstants.VIEW_GROUP_ICON_CSS,
            orientation: 'Row',
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant(RibbonConstants.VIEWS_GROUP_HEADER),
            collections: [
                {
                    items: [
                        {
                            type: 'Button',
                            keyTip: 'F',
                            buttonSettings: {
                                content: this.localObj.getConstant('Read Only'),
                                iconCss: 'e-icons e-de-ctnr-reading-view',
                                clicked: this.readOnlyHandler.bind(this)
                            },
                            id: this.ribbonId + RibbonConstants.READ_ONLY_BUTTON_ID,
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('Toggle document to read only mode')
                            }
                        },
                        {
                            type: 'Button',
                            keyTip: 'P',
                            buttonSettings: {
                                content: this.localObj.getConstant('Print Layout'),
                                iconCss: RibbonConstants.PRINT_LAYOUT_ICON_CSS,
                                clicked: this.printLayoutHandler.bind(this)
                            },
                            id: this.ribbonId + RibbonConstants.PRINT_LAYOUT_BUTTON_ID,
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('Print layout')
                            }
                        },
                        {
                            type: 'Button',
                            keyTip: 'L1',
                            buttonSettings: {
                                content: this.localObj.getConstant('Web Layout'),
                                iconCss: RibbonConstants.WEB_LAYOUT_ICON_CSS,
                                clicked: this.webLayoutHandler.bind(this)
                            },
                            id: this.ribbonId + RibbonConstants.WEB_LAYOUT_BUTTON_ID,
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('Web layout')
                            }
                        }]
                }
            ]
        };
    }

    /**
     * Handler for print layout button click
     * @returns {void}
     */
    private printLayoutHandler(): void {
        this.documentEditor.layoutType = 'Pages';
        this.toggleLayoutButton();
    }

    /**
     * Handler for web layout button click
     * @returns {void}
     */
    private webLayoutHandler(): void {
        this.documentEditor.layoutType = 'Continuous';
        this.toggleLayoutButton();
    }

    /**
     * Handler for read only button click
     * @returns {void}
     */
    private readOnlyHandler(): void {
        this.container.restrictEditing = !this.container.restrictEditing;
        this.toggleReadOnlyButton();
    }

    /**
     * Update selection to reflect current state
     * @returns {void}
     */
    public updateSelection(): void {
        this.toggleLayoutButton();
        this.toggleReadOnlyButton();
    }

    private toggleReadOnlyButton(): void {
        const ribbon: Ribbon = this.container.ribbon.ribbon;
        RibbonHelper.updateToggleButtonState(ribbon, this.ribbonId + RibbonConstants.READ_ONLY_BUTTON_ID, this.container.restrictEditing);
    }
    private toggleLayoutButton(): void {
        const ribbonObj: Ribbon = this.container.ribbon.ribbon;
        const isPageLayout: boolean = this.documentEditor.layoutType === 'Pages';
        RibbonHelper.updateToggleButtonState(ribbonObj, this.ribbonId + RibbonConstants.PRINT_LAYOUT_BUTTON_ID, isPageLayout);
        RibbonHelper.updateToggleButtonState(ribbonObj, this.ribbonId + RibbonConstants.WEB_LAYOUT_BUTTON_ID, !isPageLayout);

    }
}
