import { RibbonGroupBase, IRibbonGroup } from '../ribbon-interfaces';
import { RibbonGroupModel, RibbonGalleryItemModel, RibbonItemModel } from '@syncfusion/ej2-ribbon';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';
import { StylesHelper } from '../../helper/styles-helper';
import { SanitizeHtmlHelper, isNullOrUndefined } from '@syncfusion/ej2-base';

// Styles group constants
export const STYLES_GROUP_ID: string = '_styles_group';

/**
 * StylesGroup class for handling style operations in Document Editor ribbon
 * @private
 */
export class StylesGroup extends RibbonGroupBase implements IRibbonGroup {
    /**
     * Get the Ribbon group model for Styles
     * @returns {RibbonGroupModel} - Ribbon group model
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        const id: string = this.ribbonId;

        return {
            id: id + STYLES_GROUP_ID,
            cssClass: 'e-styles-group',
            header: this.localObj.getConstant('Styles'),
            enableGroupOverflow: true,
            keyTip: 'L',
            overflowHeader: this.localObj.getConstant('Styles'),
            groupIconCss: 'e-icons e-de-ctnr-paste',
            orientation: 'Row',
            showLauncherIcon: true,
            launcherIconKeyTip: 'FY',
            collections: [
                {
                    id: this.ribbonId + '_style-gallery',

                    items: [
                        {
                            type: 'Gallery',
                            gallerySettings: {
                                groups: [
                                    {
                                        header: this.localObj.getConstant('Styles'),
                                        items: this.getStyleItems()
                                    }
                                ],
                                itemCount: 3,
                                select: (args: any) => {
                                    if (!this.documentEditor.isReadOnly && this.documentEditor.editorModule) {
                                        const styleName: string = this.documentEditor.stylesDialogModule.getStyleName(
                                            SanitizeHtmlHelper.sanitize(args.currentItem.content)
                                        );
                                        if (!isNullOrUndefined(this.documentEditor.documentHelper.styles.findByName(styleName))) {
                                            this.documentEditor.editorModule.applyStyle(styleName, true);
                                        }
                                    }
                                },
                                popupWidth: '150px',
                                popupHeight: '300px'
                            },
                            id: this.ribbonId + '_style-item-gallery',
                            ribbonTooltipSettings: { content: this.localObj.getConstant('Styles') }
                        }
                    ]
                }
            ]
        };
    }

    private getStyleItems(): RibbonGalleryItemModel[] {
        return StylesHelper.getStyleItems(this.documentEditor, this.localObj);
    }


    // Update the updateStyleGallery method
    public updateStyleGallery(): void {
        if (!this.container || !this.container.ribbon || !this.container.ribbon.ribbon) {
            return;
        }

        const galleryItem: RibbonItemModel = this.container.ribbon.ribbon.getItem(this.ribbonId + '_style-item-gallery');
        if (!galleryItem || !galleryItem.gallerySettings || !galleryItem.gallerySettings.groups) {
            return;
        }

        // Update gallery items using the helper
        galleryItem.gallerySettings.groups[0].items = StylesHelper.getStyleItems(this.documentEditor, this.localObj);

        // Set the selected item based on current selection
        const currentStyle: string = StylesHelper.getCurrentStyleName(this.documentEditor, this.localObj);
        galleryItem.gallerySettings.selectedItemIndex = StylesHelper.findStyleIndex(
            currentStyle,
            galleryItem.gallerySettings.groups[0].items
        );

        // Update the gallery
        this.container.ribbon.ribbon.updateItem(galleryItem);
    }
}
