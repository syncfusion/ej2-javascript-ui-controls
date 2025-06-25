import { RibbonGroupBase, IRibbonGroup } from '../ribbon-interfaces';
import { RibbonGroupModel, ItemOrientation, Ribbon } from '@syncfusion/ej2-ribbon';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';

// Clipboard group constants
export const CLIPBOARD_GROUP_ID: string = '_clipboard_group';
export const CUT_ID: string = '_cut';
export const COPY_ID: string = '_copy';
export const PASTE_ID: string = '_paste';
export const LOCAL_CLIPBOARD_ID: string = '_local_clipboard';

/**
 * ClipboardGroup class for handling clipboard operations in Document Editor ribbon
 * @private
 */
export class ClipboardGroup extends RibbonGroupBase implements IRibbonGroup {
    /**
     * Get the Ribbon group model for Clipboard
     * @returns {RibbonGroupModel} - The ribbon group model for Clipboard
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        const id: string = this.ribbonId;

        return {
            id: id + CLIPBOARD_GROUP_ID,
            cssClass: 'e-clipboard-group',
            header: this.localObj.getConstant('Clipboard'),
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Clipboard'),
            // orientation: ItemOrientation.Row,
            groupIconCss: 'e-icons e-de-ctnr-paste',
            collections: [
                {
                    items: [
                        {
                            type: 'Button',
                            keyTip: 'X',
                            buttonSettings: {
                                content: this.localObj.getConstant('Cut'),
                                iconCss: 'e-icons e-de-ctnr-cut',
                                isToggle: false,
                                clicked: () => {
                                    if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
                                        this.documentEditor.editor.cut();
                                    }
                                }
                            },
                            id: id + CUT_ID,
                            ribbonTooltipSettings: { content: this.localObj.getConstant('Cut Tooltip') }
                        }, {
                            type: 'Button',
                            keyTip: 'C',
                            buttonSettings: {
                                content: this.localObj.getConstant('Copy'),
                                iconCss: 'e-icons e-de-ctnr-copy',
                                isToggle: false,
                                clicked: () => {
                                    if (this.documentEditor.selection) {
                                        this.documentEditor.selection.copy();
                                    }
                                }
                            },
                            id: id + COPY_ID,
                            ribbonTooltipSettings: { content: this.localObj.getConstant('Copy Tooltip') }

                        },
                        {
                            type: 'Button',
                            keyTip: 'V',
                            buttonSettings: {
                                content: this.localObj.getConstant('Local Clipboard'),
                                iconCss: 'e-icons e-de-ctnr-paste',
                                isToggle: true,
                                clicked: () => {
                                    this.container.enableLocalPaste = !this.container.enableLocalPaste;
                                }
                            },
                            id: id + LOCAL_CLIPBOARD_ID,
                            ribbonTooltipSettings: { content: this.localObj.getConstant('Toggle between the internal clipboard and system clipboard') }
                        }]
                }
            ]
        };
    }

    /**
     * Update clipboard buttons based on selection state
     * @returns {void}
     * @private
     */
    public updateSelection(): void {
        // Get the ribbon from container
        const ribbon: Ribbon = this.container.ribbonModule.ribbon;
        if (!ribbon) { return; }

        const id: string = this.ribbonId;
        const isSelectionEmpty: boolean = this.container.documentEditor.selection.isEmpty;

        // Update Cut and Copy buttons state based on selection
        if (isSelectionEmpty) {
            ribbon.disableItem(id + CUT_ID);
            ribbon.disableItem(id + COPY_ID);
        } else {
            ribbon.enableItem(id + CUT_ID);
            ribbon.enableItem(id + COPY_ID);
        }
    }
}
