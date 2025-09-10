import { RibbonGroupBase, IRibbonGroup } from '../ribbon-interfaces';
import { Ribbon, RibbonGroupModel, RibbonItemSize } from '@syncfusion/ej2-ribbon';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';

// Find and Replace group constants
export const FIND_GROUP_ID: string = '_find_group';
export const FIND_ID: string = '_find';
export const REPLACE_ID: string = '_replace';

/**
 * FindGroup class for handling find and replace operations in Document Editor ribbon
 * @private
 */
export class FindGroup extends RibbonGroupBase implements IRibbonGroup {
    /**
     * Get the Ribbon group model for Find
     * @returns {RibbonGroupModel} - Ribbon group model for Find
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        const id: string = this.ribbonId;

        return {
            id: id + FIND_GROUP_ID,
            cssClass: 'e-find-group',
            header: this.localObj.getConstant('Find'),
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Find'),
            groupIconCss: 'e-icons e-de-ctnr-find',
            collections: [
                {
                    id: id + '_find-collection',
                    items: [
                        {
                            type: 'Button',
                            keyTip: 'FD',
                            buttonSettings: {
                                content: this.localObj.getConstant('Find'),
                                iconCss: 'e-icons e-de-ctnr-find',
                                clicked: () => {
                                    if (this.documentEditor.searchModule) {
                                        this.documentEditor.showOptionsPane();
                                    }
                                }
                            },
                            id: id + FIND_ID,
                            ribbonTooltipSettings: { content: this.localObj.getConstant('Find Text') }
                        },
                        {
                            type: 'Button',
                            keyTip: 'R',
                            buttonSettings: {
                                content: this.localObj.getConstant('Replace'),
                                iconCss: 'e-icons e-de-ctnr-replace',
                                clicked: () => {
                                    if (!this.documentEditor.isReadOnly && this.documentEditor.optionsPaneModule) {
                                        this.documentEditor.optionsPaneModule.isReplace = true;
                                        this.documentEditor.documentEditorSettings.showNavigationPane = true;
                                    }
                                }
                            },
                            id: id + REPLACE_ID,
                            ribbonTooltipSettings: { content: this.localObj.getConstant('Replace Text') }
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Update find buttons based on document state
     * @returns {void}
     * @private
     */
    public updateSelection(): void {
        // Get the ribbon from container
        const ribbon: Ribbon = this.container.ribbonModule.ribbon;
        if (!ribbon) { return; }

        const id: string = this.ribbonId;

        // If we need to disable replace when the document is read-only:
        if (this.documentEditor.isReadOnly) {
            ribbon.disableItem(id + REPLACE_ID);
        } else {
            ribbon.enableItem(id + REPLACE_ID);
        }
    }
}
