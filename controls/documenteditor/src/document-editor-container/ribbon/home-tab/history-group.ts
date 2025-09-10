import { RibbonGroupBase, IRibbonGroup } from '../ribbon-interfaces';
import { Ribbon, RibbonGroupModel, RibbonItemSize } from '@syncfusion/ej2-ribbon';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';

// History group constants
export const HISTORY_GROUP_ID: string = '_history_group';
export const UNDO_ID: string = '_undo';
export const REDO_ID: string = '_redo';

/**
 * HistoryGroup class for handling history operations in Document Editor ribbon
 * @private
 */
export class HistoryGroup extends RibbonGroupBase implements IRibbonGroup {
    /**
     * Get the Ribbon group model for History
     * @returns {RibbonGroupModel} - The Ribbon group model for History
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        const id: string = this.ribbonId;

        return {
            id: id + HISTORY_GROUP_ID,
            cssClass: 'e-history-group',
            header: this.localObj.getConstant('Undo'),
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Undo'),
            groupIconCss: 'e-icons e-de-ctnr-undo',
            collections: [
                {
                    id: id + '_history-collection',
                    items: [
                        {
                            type: 'Button',
                            keyTip: 'ZZ',
                            buttonSettings: {
                                content: this.localObj.getConstant('Undo'),
                                iconCss: 'e-icons e-de-ctnr-undo',
                                clicked: () => {
                                    if (!this.documentEditor.isReadOnly && this.documentEditor.editorHistory) {
                                        this.documentEditor.editorHistory.undo();
                                    }
                                }
                            },
                            id: id + UNDO_ID,
                            ribbonTooltipSettings: { content: this.localObj.getConstant('Undo Tooltip') }
                        },
                        {
                            type: 'Button',
                            keyTip: 'O',
                            buttonSettings: {
                                content: this.localObj.getConstant('Redo'),
                                iconCss: 'e-icons e-de-ctnr-redo',
                                clicked: () => {
                                    if (!this.documentEditor.isReadOnly && this.documentEditor.editorHistory) {
                                        this.documentEditor.editorHistory.redo();
                                    }
                                }
                            },
                            id: id + REDO_ID,
                            ribbonTooltipSettings: { content: this.localObj.getConstant('Redo Tooltip') }
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Update undo/redo buttons based on history state
     * @returns {void}
     * @private
     */
    public updateContentChanged(): void {
        // Get the ribbon from container
        const ribbon: Ribbon = this.container.ribbonModule.ribbon;
        if (!ribbon) {
            return;
        }

        const id: string = this.ribbonId;

        // For undo button
        if (this.container.documentEditor.editorHistory.canUndo()) {
            ribbon.enableItem(id + UNDO_ID);
        } else {
            ribbon.disableItem(id + UNDO_ID);
        }

        // For redo button
        if (this.container.documentEditor.editorHistory.canRedo()) {
            ribbon.enableItem(id + REDO_ID);
        } else {
            ribbon.disableItem(id + REDO_ID);
        }
    }
}
