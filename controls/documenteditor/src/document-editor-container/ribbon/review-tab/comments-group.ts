import { RibbonGroupBase } from '../ribbon-interfaces';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel, Ribbon, RibbonItemModel } from '@syncfusion/ej2-ribbon';
import { MenuEventArgs, ItemModel } from '@syncfusion/ej2-splitbuttons';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { L10n } from '@syncfusion/ej2-base';
import { ContextType } from '../../../document-editor/base';

// Constants for UI element IDs
export const COMMENTS_GROUP: string = '_comments_group';
export const NEW_COMMENT_ID: string = '_new_comment';
export const PREVIOUS_COMMENT_ID: string = '_previous_comment';
export const NEXT_COMMENT_ID: string = '_next_comment';
export const DELETE_COMMENT_ID: string = '_delete_comment';
export const DELETE_ALL_COMMENTS_ID: string = '_delete_all_comments';
export const SHOW_COMMENTS_ID: string = '_show_comments';

/**
 * Represents the Comments Group in Review tab
 * @private
 */
export class CommentsGroup extends RibbonGroupBase {
    private showComments: boolean = true;

    /**
     * Constructor for the CommentsGroup
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        super(container);
    }

    /**
     * Gets the ribbon group model for Comments
     * @returns {RibbonGroupModel} - Ribbon group model for Comments
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        const locale: L10n = this.localObj;
        return {
            id: this.ribbonId + COMMENTS_GROUP,
            header: locale.getConstant('Comments'),
            enableGroupOverflow: true,
            overflowHeader: locale.getConstant('Comments'),
            collections: [{
                items: [
                    {
                        id: this.ribbonId + NEW_COMMENT_ID,
                        type: 'Button',
                        keyTip: 'C',
                        buttonSettings: {
                            content: locale.getConstant('New Comment'),
                            iconCss: 'e-icons e-de-cnt-cmt-add',
                            isToggle: false,
                            clicked: this.newCommentHandler.bind(this)
                        },
                        ribbonTooltipSettings: {
                            content: locale.getConstant('Insert a comment at the cursor position')
                        }
                    }]
            }, {
                items: [
                    {
                        id: this.ribbonId + PREVIOUS_COMMENT_ID,
                        type: 'Button',
                        keyTip: 'V',
                        buttonSettings: {
                            content: locale.getConstant('Previous'),
                            iconCss: 'e-icons e-de-ctnr-previous-comment',
                            isToggle: false,
                            clicked: this.previousCommentHandler.bind(this)
                        },
                        ribbonTooltipSettings: {
                            content: locale.getConstant('Go to the previous comment')
                        }
                    },
                    {
                        id: this.ribbonId + NEXT_COMMENT_ID,
                        type: 'Button',
                        keyTip: 'N',
                        buttonSettings: {
                            content: locale.getConstant('Next'),
                            iconCss: 'e-icons e-de-ctnr-next-comment',
                            isToggle: false,
                            clicked: this.nextCommentHandler.bind(this)
                        },
                        ribbonTooltipSettings: {
                            content: locale.getConstant('Go to the next comment')
                        }
                    }]
            }, {
                items: [
                    {
                        id: this.ribbonId + SHOW_COMMENTS_ID,
                        type: 'Button',
                        keyTip: 'K',
                        buttonSettings: {
                            content: locale.getConstant('Show Comments'),
                            iconCss: 'e-comment-show e-icons',
                            isToggle: true,
                            clicked: this.showCommentsHandler.bind(this)
                        },
                        ribbonTooltipSettings: {
                            content: locale.getConstant('Show or hide comments')
                        }
                    },
                    {
                        id: this.ribbonId + DELETE_COMMENT_ID,
                        type: 'DropDown',
                        keyTip: 'D',
                        dropDownSettings: {
                            content: locale.getConstant('Delete'),
                            items: [
                                {
                                    id: this.ribbonId + DELETE_COMMENT_ID + '_delete',
                                    text: locale.getConstant('Delete'),
                                    iconCss: 'e-icons e-de-ctnr-close-comment'
                                },
                                {
                                    id: this.ribbonId + DELETE_ALL_COMMENTS_ID,
                                    text: locale.getConstant('Delete All'),
                                    iconCss: 'e-icons e-de-ctnr-delete-all-comments'
                                }
                            ],
                            iconCss: 'e-icons e-de-ctnr-close-comment',
                            select: this.deleteCommentDropdownHandler.bind(this)
                        },
                        ribbonTooltipSettings: {
                            content: locale.getConstant('Delete comments')
                        }
                    }
                ]
            }]
        };
    }

    private newCommentHandler(): void {
        this.container.documentEditor.editorModule.isUserInsert = true;
        this.container.documentEditor.editorModule.insertComment('');
        this.container.documentEditor.editorModule.isUserInsert = false;
    }


    private previousCommentHandler(): void {
        this.documentEditor.selection.navigatePreviousComment();
    }


    private nextCommentHandler(): void {
        this.documentEditor.selection.navigateNextComment();
    }

    private deleteCommentDropdownHandler(args: MenuEventArgs): void {
        const item: ItemModel = args.item as ItemModel;
        if (item && item.id) {
            if (item.id === this.ribbonId + DELETE_ALL_COMMENTS_ID) {
                this.documentEditor.editor.deleteAllComments();
            } else if (item.id === this.ribbonId + DELETE_COMMENT_ID + '_delete') {
                this.documentEditor.editor.deleteComment();
            }
        }
    }

    private showCommentsHandler(): void {
        this.showComments = !this.showComments;
        this.documentEditor.showComments = this.showComments;
        // Update toggle state
        const showCommentsElement: HTMLElement = document.getElementById(this.ribbonId + SHOW_COMMENTS_ID);
        if (showCommentsElement) {
            showCommentsElement.classList.toggle('e-active', this.showComments);
        }
    }

    /**
     * Update comment controls based on selection
     * @returns {void}
     * @private
     */
    public updateSelection(): void {
        const hasComments: boolean = this.documentEditor.documentHelper.comments.length > 0;
        const isCommentSelected: boolean = this.documentEditor.documentHelper.currentSelectedComment !== undefined;
        const ribbon: Ribbon = this.container.ribbon.ribbon;
        const currentContext: ContextType = this.documentEditor.selection.contextType;
        const isInHeaderFooter: boolean = currentContext.indexOf('Header') >= 0
                                        || currentContext.indexOf('Footer') >= 0;
        if (isInHeaderFooter
            || this.container.documentEditor.selection.isinEndnote
            || this.container.documentEditor.selection.isinFootnote
            || this.container.documentEditor.commentReviewPane.commentPane.isEditMode
            || !this.container.enableComment) {
            ribbon.disableGroup(this.ribbonId + COMMENTS_GROUP);
        } else if (!this.container.restrictEditing) {
            ribbon.enableGroup(this.ribbonId + COMMENTS_GROUP);
        }

        if (hasComments && this.container.enableComment) {
            ribbon.enableItem(this.ribbonId + PREVIOUS_COMMENT_ID);
            ribbon.enableItem(this.ribbonId + NEXT_COMMENT_ID);
            ribbon.enableItem(this.ribbonId + DELETE_COMMENT_ID);
            ribbon.enableItem(this.ribbonId + SHOW_COMMENTS_ID);
            // Update the enabled state of the Delete option in the dropdown
            this.updateDeleteMenuItemState(ribbon.getItem(this.ribbonId + DELETE_COMMENT_ID), isCommentSelected);
        } else {
            ribbon.disableItem(this.ribbonId + PREVIOUS_COMMENT_ID);
            ribbon.disableItem(this.ribbonId + NEXT_COMMENT_ID);
            ribbon.disableItem(this.ribbonId + DELETE_COMMENT_ID);
            ribbon.disableItem(this.ribbonId + SHOW_COMMENTS_ID);
        }
    }

    private updateDeleteMenuItemState(dropDownItem: RibbonItemModel, isCommentSelected: boolean): void {

        if (dropDownItem) {
            if (!isCommentSelected) {
                dropDownItem.dropDownSettings.items[0].disabled = true;
            } else {
                dropDownItem.dropDownSettings.items[0].disabled = false;
            }
        }
    }
    /**
     * @param {boolean} enable - Enable the comment
     * @returns {void}
     * @private
     */
    public enableDisableCommentGroup(enable: boolean): void {
        const ribbon: Ribbon = this.container.ribbon.ribbon;
        if (enable) {
            ribbon.enableGroup(this.ribbonId + COMMENTS_GROUP);
        } else {
            ribbon.disableGroup(this.ribbonId + COMMENTS_GROUP);
        }
    }
}
