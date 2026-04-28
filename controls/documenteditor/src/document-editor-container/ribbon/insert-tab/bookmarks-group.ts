import { RibbonGroupModel } from '@syncfusion/ej2-ribbon';
import { RibbonGroupBase } from '../ribbon-interfaces';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { DocumentEditor } from '../../../document-editor/document-editor';

export const INSERT_BOOKMARK_ID: string = '_insert_bookmark';
export const ALL_BOOKMARKS_ID: string = '_all_bookmarks';
export const SHOW_BOOKMARKS_ID: string = '_show_bookmarks';

/**
 * Bookmarks group implementation for Insert tab
 * @private
 */
export class BookmarksGroup extends RibbonGroupBase {
    /**
     * Get the Ribbon items for Bookmarks group
     * @returns {RibbonGroupModel} - Ribbon group model for Bookmarks group
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            header: this.localObj.getConstant('Bookmarks'),
            groupIconCss: 'e-icons e-de-ctnr-bookmark',
            keyTip: 'K',
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Bookmarks'),
            collections: [{
                items: [{
                    type: 'DropDown',
                    dropDownSettings: {
                        content: this.localObj.getConstant('Bookmark'),
                        iconCss: 'e-icons e-de-ctnr-bookmark',
                        items: [
                            {
                                text: this.localObj.getConstant('Insert Bookmark'),
                                id: this.ribbonId + INSERT_BOOKMARK_ID,
                                iconCss: 'e-icons e-de-ctnr-add-bookmark'
                            },
                            {
                                text: this.localObj.getConstant('All Bookmarks'),
                                id: this.ribbonId + ALL_BOOKMARKS_ID,
                                iconCss: 'e-icons e-de-ctnr-all-bookmarks'
                            }
                        ],
                        select: this.onBookmarkDropDownSelect.bind(this)
                    },
                    id: this.ribbonId + '_bookmark',
                    ribbonTooltipSettings: {
                        // title: this.localObj.getConstant('Bookmark'),
                        content: this.localObj.getConstant('Insert a bookmark in a specific place in this document')
                    }
                }]
            }]
        };
    }

    private onBookmarkDropDownSelect(args: MenuEventArgs): void {
        const id: string = args.item.id;
        if (id === this.ribbonId + INSERT_BOOKMARK_ID) {
            this.insertBookmarkHandler();
        } else if (id === this.ribbonId + ALL_BOOKMARKS_ID) {
            this.showAllBookmarksHandler();
        } else if (id === this.ribbonId + SHOW_BOOKMARKS_ID) {
            this.toggleBookmarkVisibilityHandler();
        }
    }

    private insertBookmarkHandler(): void {
        this.container.documentEditor.showDialog('Bookmark');
    }
    private showAllBookmarksHandler(): void {
        this.container.documentEditor.documentEditorSettings.showNavigationPane = true;
    }
    private toggleBookmarkVisibilityHandler(): void {
        const documentEditor: DocumentEditor = this.container.documentEditor;
        documentEditor.documentEditorSettings.showBookmarks = !documentEditor.documentEditorSettings.showBookmarks;
    }
}
