import { RibbonGroupModel } from '@syncfusion/ej2-ribbon';
import { RibbonGroupBase } from '../ribbon-interfaces';
import { RibbonConstants } from '../ribbon-constants';

/**
 * Zoom group implementation for View tab
 * @private
 */
export class ZoomGroup extends RibbonGroupBase {
    /**
     * Get the Ribbon items for Zoom group
     * @returns {RibbonGroupModel} The ribbon group model
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            header: this.localObj.getConstant(RibbonConstants.ZOOM_GROUP_HEADER),
            groupIconCss: RibbonConstants.ZOOM_GROUP_ICON_CSS,
            orientation: 'Column',
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant(RibbonConstants.ZOOM_GROUP_HEADER),
            collections: [
                {
                    items: [
                        {
                            type: 'Button',
                            keyTip: 'W',
                            buttonSettings: {
                                content: this.localObj.getConstant('Zoom In'),
                                iconCss: 'e-icons e-de-ctnr-zoom-in',
                                clicked: this.zoomInHandler.bind(this)
                            },
                            id: this.ribbonId + RibbonConstants.ZOOM_IN_BUTTON_ID,
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('Zoom In')
                            }
                        },
                        {
                            type: 'Button',
                            keyTip: 'E',
                            buttonSettings: {
                                content: this.localObj.getConstant('Zoom Out'),
                                iconCss: 'e-icons e-de-ctnr-zoom-out',
                                clicked: this.zoomOutHandler.bind(this)
                            },
                            id: this.ribbonId + RibbonConstants.ZOOM_OUT_BUTTON_ID,
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('Zoom Out')
                            }
                        }]
                }, {
                    items: [
                        {
                            type: 'Button',
                            keyTip: '1',
                            buttonSettings: {
                                content: this.localObj.getConstant('100%'),
                                iconCss: 'e-icons e-de-ctnr-fit-100',
                                clicked: this.hundredpercentHandler.bind(this)
                            },
                            id: this.ribbonId + RibbonConstants.HUNDRED_PERCENT_BUTTON_ID,
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('100%')
                            }
                        },
                        {
                            type: 'Button',
                            keyTip: '2',
                            buttonSettings: {
                                content: this.localObj.getConstant('One Page'),
                                iconCss: 'e-icons e-icons e-de-ctnr-columns',
                                clicked: this.fitOnePageHandler.bind(this)
                            },
                            id: this.ribbonId + RibbonConstants.ONE_PAGE_BUTTON_ID,
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('One Page')
                                // content: this.localObj.getConstant('Zoom to display an entire page in the window')
                            }
                        },
                        {
                            type: 'Button',
                            keyTip: 'I',
                            buttonSettings: {
                                content: this.localObj.getConstant('Page Width'),
                                iconCss: 'e-icons e-de-ctnr-page-width',
                                clicked: this.pageWidthHandler.bind(this)
                            },
                            id: this.ribbonId + RibbonConstants.PAGE_WIDTH_BUTTON_ID,
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('Page Width')
                            }
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Handler for zoom in button click
     * @returns {void}
     */
    private zoomInHandler(): void {
        this.documentEditor.zoomFactor += 0.1;
    }

    /**
     * Handler for zoom out button click
     * @returns {void}
     */
    private zoomOutHandler(): void {
        if (this.documentEditor.zoomFactor > 0.1) {
            this.documentEditor.zoomFactor -= 0.1;
        }
    }

    /**
     * Handler for full page button click
     * @returns {void}
     */
    private fitOnePageHandler(): void {
        this.documentEditor.fitPage('FitOnePage');
    }

    /**
     * Handler for 100% button click
     * @returns {void}
     */
    private hundredpercentHandler(): void {
        this.documentEditor.zoomFactor = 1;
    }

    /**
     * Handler for page width button click
     * @returns {void}
     */
    private pageWidthHandler(): void {
        this.documentEditor.fitPage('FitPageWidth');
    }

    /**
     * Updates the enabled state of zoom buttons based on current zoom factor
     * @returns {void}
     */
    public updateZoomButtonState(): void {
        const ribbon: any = this.container.ribbon.ribbon;
        if (ribbon) {
            const zoomInButtonId: string = this.ribbonId + RibbonConstants.ZOOM_IN_BUTTON_ID;
            const zoomOutButtonId: string = this.ribbonId + RibbonConstants.ZOOM_OUT_BUTTON_ID;

            if (this.documentEditor.zoomFactor >= 5) {
                ribbon.disableItem(zoomInButtonId);
            } else {
                ribbon.enableItem(zoomInButtonId);
            }

            if (this.documentEditor.zoomFactor <= 0.10) {
                ribbon.disableItem(zoomOutButtonId);
            } else {
                ribbon.enableItem(zoomOutButtonId);
            }
        }
    }
}
