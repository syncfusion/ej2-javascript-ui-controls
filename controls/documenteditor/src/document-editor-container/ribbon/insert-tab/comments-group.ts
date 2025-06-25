import { Ribbon, RibbonGroupModel } from '@syncfusion/ej2-ribbon';
import { RibbonGroupBase } from '../ribbon-interfaces';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

export const COMMENT_ID: string = '_insert_comment';

/**
 * Comments group implementation for Insert tab
 * @private
 */
export class CommentsGroup extends RibbonGroupBase {
    /**
     * Get the Ribbon items for Comments group
     * @returns {RibbonGroupModel} - Returns the Ribbon items for Comments group
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            header: this.localObj.getConstant('Comments'),
            groupIconCss: 'e-icons e-de-cnt-cmt-add',
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Comments'),
            collections: [{
                items: [{
                    type: 'Button',
                    keyTip: 'C',
                    buttonSettings: {
                        content: this.localObj.getConstant('New Comment'),
                        iconCss: 'e-icons e-de-cnt-cmt-add',
                        isToggle: false,
                        clicked: this.newCommentHandler.bind(this)
                    },
                    id: this.ribbonId + COMMENT_ID,
                    ribbonTooltipSettings: {
                        content: this.localObj.getConstant('Add a comment about the current selection')
                    }
                }]
            }]
        };
    }

    private newCommentHandler(): void {
        this.container.documentEditor.editorModule.isUserInsert = true;
        this.container.documentEditor.editorModule.insertComment('');
        this.container.documentEditor.editorModule.isUserInsert = false;
    }

    /**
     * Update selection to reflect current state
     * @returns {void}
     * @private
     */
    public updateSelection(): void {
        const isHeaderFooter: boolean = this.documentEditor.selection.contextType.indexOf('Header') >= 0 ||
            this.documentEditor.selection.contextType.indexOf('Footer') >= 0;

        const shouldDisable: boolean = isHeaderFooter ||
            this.container.documentEditor.selection.isinFootnote ||
            this.container.documentEditor.selection.isinEndnote ||
            this.container.documentEditor.commentReviewPane.commentPane.isEditMode;

        this.enableDisableComment(!shouldDisable);
    }
    /**
     * @param {boolean} enable - Enable disable the comment
     * @returns {void}
     * @private
     */
    public enableDisableComment(enable: boolean): void {
        const ribbon: Ribbon = this.container.ribbon.ribbon;
        if (enable) {
            ribbon.enableItem(this.ribbonId + COMMENT_ID);
        } else {
            ribbon.disableItem(this.ribbonId + COMMENT_ID);
        }
    }
}
