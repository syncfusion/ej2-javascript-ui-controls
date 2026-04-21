import { DocumentEditorContainer } from '../../document-editor-container';
import { L10n } from '@syncfusion/ej2-base';
import { RibbonTabModel } from '@syncfusion/ej2-ribbon';
import { MenuItemModel } from '@syncfusion/ej2-navigations';
import { HomeTab } from './../home-tab/home-tab';
import { InsertTab } from './../insert-tab/insert-tab';
import { ViewTab } from './../view-tab/view-tab';
import { TableLayoutTab } from './../table-layout-tab/table-tab';
import { HeaderFooterTab } from './../header-footer-tab/header-footer-tab';
import { PictureFormatTab } from './../picture-format-tab/picture-format-tab';
import { ReferenceTab } from './../reference-tab/reference-tab';
import { LayoutTab } from './../layout-tab/layout-tab';
import { ReviewTab } from './../review-tab/review-tab';
import { TableDesignTab } from './../table-design-tab/table-design-tab';
import { FileMenu } from './../file-menu/file-menu';
import { DeveloperTab } from '../developer-tab/developer-tab';

/**
 * Manages all ribbon tabs
 * @private
 */
export class RibbonTabManager {
    /**
     * @private
     */
    private container: DocumentEditorContainer;
    /**
     * @private
     */
    private localObj: L10n;
    /**
     * @private
     */
    public fileMenu: FileMenu;
    /**
     * @private
     */
    public homeTab: HomeTab;
    /**
     * @private
     */
    public insertTab: InsertTab;
    /**
     * @private
     */
    public viewTab: ViewTab;
    /**
     * @private
     */
    public tableLayoutTab: TableLayoutTab;
    /**
     * @private
     */
    public headerFooterTab: HeaderFooterTab;
    /**
     * @private
     */
    public pictureFormatTab: PictureFormatTab;
    /**
     * @private
     */
    public referenceTab: ReferenceTab;
    /**
     * @private
     */
    public layoutTab: LayoutTab;
    /**
     * @private
     */
    public reviewTab: ReviewTab;
    /**
     * @private
     */
    public tableDesignTab: TableDesignTab;
    /**
     * @private
     */
    public developerTab: DeveloperTab;

    /**
     * Constructor for RibbonTabManager
     * @param {DocumentEditorContainer} container - Document editor container
     * @param {L10n} localObj - Localization object
     */
    constructor(container: DocumentEditorContainer, localObj: L10n) {
        this.container = container;
        this.localObj = localObj;
        this.initializeTabs();
    }

    /**
     * Initialize all tab instances
     * @returns {void}
     * @private
     */
    private initializeTabs(): void {
        this.fileMenu = new FileMenu(this.container);
        this.homeTab = new HomeTab(this.container);
        this.insertTab = new InsertTab(this.container);
        this.viewTab = new ViewTab(this.container);
        this.tableLayoutTab = new TableLayoutTab(this.container);
        this.headerFooterTab = new HeaderFooterTab(this.container);
        this.pictureFormatTab = new PictureFormatTab(this.container);
        this.referenceTab = new ReferenceTab(this.container);
        this.layoutTab = new LayoutTab(this.container);
        this.reviewTab = new ReviewTab(this.container);
        this.tableDesignTab = new TableDesignTab(this.container);
        // In the constructor or initialization method
        this.developerTab = new DeveloperTab(this.container);
    }

    /**
     * Get all ribbon tabs
     * @returns {RibbonTabModel[]} Array of ribbon tab models
     * @private
     */
    public getRibbonTabs(): RibbonTabModel[] {
        return [
            this.homeTab.getHomeTab(),
            this.insertTab.getInsertTab(),
            this.layoutTab.getLayoutTab(),
            this.reviewTab.getReviewTab(),
            this.viewTab.getViewTab(),
            this.referenceTab.getReferenceTab(),
            this.developerTab.getDeveloperTab()
        ];
    }

    /**
     * Get file menu items
     * @returns {MenuItemModel[]} Array of menu item models
     * @private
     */
    public getFileMenuItems(): MenuItemModel[] {
        return this.fileMenu.getFileMenuItems();
    }

    /**
     * Update style gallery in home tab
     * @returns {void}
     * @private
     */
    public updateStyleGallery(): void {
        this.homeTab.updateStyleGallery();
    }


    /**
     * Update all tabs based on current selection
     * @returns {void}
     * @private
     */
    public updateAllTabs(): void {
        const tab: RibbonTabModel = this.container.ribbon.ribbon.tabs[this.container.ribbon.ribbon.selectedTab];
        const selectedTab: any = this.getTabByHeader(tab.header);

        switch (selectedTab) {
        case this.homeTab:
            this.homeTab.updateSelection();
            break;
        case this.insertTab:
            this.insertTab.updateControlState();
            break;
        case this.viewTab:
            this.viewTab.onSelectionChange();
            break;
        case this.layoutTab:
            this.layoutTab.updateControlState();
            break;
        case this.headerFooterTab:
            this.headerFooterTab.updateCheckboxStates();
            break;
        case this.pictureFormatTab:
            this.pictureFormatTab.updateImageProperties();
            break;
        case this.reviewTab:
            this.reviewTab.updateReviewTabOnSelectionChange();
            break;
        case this.referenceTab:
            this.referenceTab.updateSelectionState();
            break;
        case this.developerTab:
            this.developerTab.updateDeveloperTabOnSelectionChange();
            break;
        }
    }

    /**
     * Get tab instance by header
     * @param {string} header - Tab header text
     * @returns {any} Tab instance
     * @private
     */
    public getTabByHeader(header: string): any {
        switch (header) {
        case this.localObj.getConstant('Home'):
            return this.homeTab;
        case this.localObj.getConstant('Insert'):
            return this.insertTab;
        case this.localObj.getConstant('View'):
            return this.viewTab;
        case this.localObj.getConstant('Table Layout'):
            return this.tableLayoutTab;
        case this.localObj.getConstant('Header & Footer'):
            return this.headerFooterTab;
        case this.localObj.getConstant('Picture Format'):
            return this.pictureFormatTab;
        case this.localObj.getConstant('References'):
            return this.referenceTab;
        case this.localObj.getConstant('Layout'):
            return this.layoutTab;
        case this.localObj.getConstant('Review'):
            return this.reviewTab;
        case this.localObj.getConstant('Table Design'):
            return this.tableDesignTab;
        case this.localObj.getConstant('Developer'):
            return this.developerTab;
        default:
            return null;
        }
    }

    /**
     * Destroy all tab instances
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Properly destroy each tab by calling its destroy method
        if (this.fileMenu) {
            this.fileMenu.destroy();
            this.fileMenu = null;
        }

        if (this.homeTab) {
            this.homeTab.destroy();
            this.homeTab = null;
        }

        if (this.insertTab) {
            this.insertTab.destroy();
            this.insertTab = null;
        }

        if (this.viewTab) {
            this.viewTab.destroy();
            this.viewTab = null;
        }

        if (this.tableLayoutTab) {
            this.tableLayoutTab.destroy();
            this.tableLayoutTab = null;
        }

        if (this.headerFooterTab) {
            this.headerFooterTab.destroy();
            this.headerFooterTab = null;
        }

        if (this.pictureFormatTab) {
            this.pictureFormatTab.destroy();
            this.pictureFormatTab = null;
        }

        if (this.referenceTab) {
            this.referenceTab.destroy();
            this.referenceTab = null;
        }

        if (this.layoutTab) {
            this.layoutTab.destroy();
            this.layoutTab = null;
        }

        if (this.reviewTab) {
            this.reviewTab.destroy();
            this.reviewTab = null;
        }

        if (this.tableDesignTab) {
            this.tableDesignTab.destroy();
            this.tableDesignTab = null;
        }

        if (this.developerTab) {
            this.developerTab.destroy();
            this.developerTab = null;
        }

        // Clear container and localization references
        this.container = null;
        this.localObj = null;
    }
}
