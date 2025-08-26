import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonTabModel, RibbonGroupModel } from '@syncfusion/ej2-ribbon';
import { PagesGroup } from './pages-group';
import { TablesGroup } from './tables-group';
import { IllustrationsGroup } from './illustrations-group';
import { LinksGroup } from './links-group';
import { TOCGroup } from './toc-group';
import { BookmarksGroup } from './bookmarks-group';
import { CommentsGroup } from './comments-group';
import { HeaderFooterGroup } from './header-footer-group';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';

export const INSERT_TAB_ID: string = '_insert_tab';
/**
 * InsertTab class - Implements the Insert tab in DocumentEditor Ribbon using individual group classes
 * @private
 */
export class InsertTab {
    private container: DocumentEditorContainer;
    private pagesGroup: PagesGroup;
    private tablesGroup: TablesGroup;
    private illustrationsGroup: IllustrationsGroup;
    private linksGroup: LinksGroup;
    private tocGroup: TOCGroup;
    private bookmarksGroup: BookmarksGroup;
    /**
     * @private
     */
    public commentsGroup: CommentsGroup;
    private headerFooterGroup: HeaderFooterGroup;

    /**
     * Constructor for InsertTab class
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        this.container = container;

        // Initialize all group classes
        this.pagesGroup = new PagesGroup(container);
        this.tablesGroup = new TablesGroup(container);
        this.illustrationsGroup = new IllustrationsGroup(container);
        this.linksGroup = new LinksGroup(container);
        this.tocGroup = new TOCGroup(container);
        this.bookmarksGroup = new BookmarksGroup(container);
        this.commentsGroup = new CommentsGroup(container);
        this.headerFooterGroup = new HeaderFooterGroup(container);
    }

    /**
     * Get the Insert tab configuration
     * @returns {RibbonTabModel} - Insert tab configuration
     * @private
     */
    public getInsertTab(): RibbonTabModel {
        const id: string = this.container.element.id + RIBBON_ID;
        return {
            id: id + INSERT_TAB_ID,
            header: this.container.localObj.getConstant('Insert'),
            keyTip: 'N',
            groups: [
                this.pagesGroup.getGroupModel(),
                this.tablesGroup.getGroupModel(),
                this.illustrationsGroup.getGroupModel(),
                this.linksGroup.getGroupModel(),
                this.tocGroup.getGroupModel(),
                this.bookmarksGroup.getGroupModel(),
                this.commentsGroup.getGroupModel(),
                this.headerFooterGroup.getGroupModel()
            ]
        };
    }

    /**
     * Update control states based on current selection
     * @returns {void}
     * @private
     */
    public updateControlState(): void {
        // Update selection state for groups that implement updateSelection
        this.pagesGroup.updateSelection();
        this.commentsGroup.updateSelection();
    }

    /**
     * Clean up resources when tab is destroyed
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // First destroy all group components that have their own destroy methods
        if (this.pagesGroup) {
            this.pagesGroup.destroy();
        }
        if (this.tablesGroup) {
            this.tablesGroup.destroy();
        }
        if (this.illustrationsGroup) {
            this.illustrationsGroup.destroy();
        }
        if (this.linksGroup) {
            this.linksGroup.destroy();
        }
        if (this.tocGroup) {
            this.tocGroup.destroy();
        }
        if (this.bookmarksGroup) {
            this.bookmarksGroup.destroy();
        }
        if (this.commentsGroup) {
            this.commentsGroup.destroy();
        }
        if (this.headerFooterGroup) {
            this.headerFooterGroup.destroy();
        }

        // Clear all references
        this.pagesGroup = undefined;
        this.tablesGroup = undefined;
        this.illustrationsGroup = undefined;
        this.linksGroup = undefined;
        this.tocGroup = undefined;
        this.bookmarksGroup = undefined;
        this.commentsGroup = undefined;
        this.headerFooterGroup = undefined;
        this.container = undefined;
    }
}
