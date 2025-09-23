import { DocumentEditorContainer } from '../document-editor-container';
import { L10n, ModuleDeclaration } from '@syncfusion/ej2-base';
import { Ribbon as EJ2Ribbon, RibbonTabModel, RibbonGroupModel, RibbonItemModel, RibbonFileMenu, RibbonColorPicker, RibbonGallery, RibbonContextualTab, RibbonKeyTip, BackStageMenuModel, RibbonBackstage, RibbonContextualTabSettingsModel, RibbonCollectionModel } from '@syncfusion/ej2-ribbon';
import { Dictionary, FileMenuItemType } from '../../document-editor/base/index';
import { DocumentEditor } from '../../document-editor/document-editor';
import { RibbonTabManager } from './ribbon-base/ribbon-tab-manager';
import { RibbonContextualTabManager } from './ribbon-base/ribbon-contextual-tab-manager';
import { RibbonStateManager } from './ribbon-base/ribbon-state-manager';
import { RibbonEventManager } from './ribbon-base/ribbon-event-manager';
import { MenuItemModel } from '@syncfusion/ej2-navigations';
import { RibbonTabType } from '../../document-editor/base/ribbon-types';
import { RibbonGroupInfo, RibbonItemInfo } from '../helper/ribbon-interfaces';
import { IToolbarHandler } from '../helper/toolbar-handler';
import { RibbonHelper } from '../helper/ribbon-helper';

/**
 * Ribbon class for DocumentEditorContainer
 */
export class Ribbon implements IToolbarHandler {
    /**
     * @private
     */
    public container: DocumentEditorContainer;
    /**
     * @private
     */
    public ribbonElement: HTMLElement;
    /**
     * @private
     */
    public localObj: L10n;
    /**
     * @private
     */
    public ribbon: EJ2Ribbon;
    /**
     * @private
     */
    public tabManager: RibbonTabManager;
    /**
     * @private
     */
    public contextualTabManager: RibbonContextualTabManager;
    /**
     * @private
     */
    public stateManager: RibbonStateManager;
    /**
     * @private
     */
    public eventManager: RibbonEventManager;
    /**
     * @private
     */
    public numericTextBoxCollection: Dictionary<string, string> = new Dictionary<string, string>();
    /**
     * @private
     */
    backstageMenu: BackStageMenuModel;
    /**
     * @private
     */
    fileMenuItems: (FileMenuItemType | MenuItemModel)[];
    /**
     * @private
     */
    public previousContext: string = '';
    /**
     * Gets the document editor instance
     * @private
     * @returns {DocumentEditor} The document editor instance
     */
    private get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }

    /**
     * Constructor for the Ribbon class
     * @param {DocumentEditorContainer} container - Specifies the document editor container
     * @private
     */
    public constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
    }

    /**
     * Gets the module name
     * @returns {string} Module name
     * @private
     */
    private getModuleName(): string {
        return 'ribbon';
    }

    /**
     * Initializes the ribbon component
     * @returns {void}
     * @private
     */
    public initializeRibbon(): void {
        this.tabManager = new RibbonTabManager(this.container, this.localObj);
        this.contextualTabManager = new RibbonContextualTabManager(this.container);
        this.stateManager = new RibbonStateManager(this.container);
        this.eventManager = new RibbonEventManager(this, this.container);
        this.initializeInternal();
    }

    private initializeInternal(): void {
        if (!this.container.ribbonContainer) {
            return;
        }
        this.createRibbonElement();
        this.renderRibbon();
        if (this.tabManager.homeTab) {
            this.tabManager.homeTab.updateStyleGallery();
        }
    }

    private createRibbonElement(): void {
        this.ribbonElement = document.createElement('div');
        this.ribbonElement.id = 'document-editor-ribbon';
        this.ribbonElement.classList.add('e-de-ribbon');

        if (this.container.enableRtl) {
            this.ribbonElement.classList.add('e-rtl');
        }

        // Append ribbon to toolbar container
        this.container.ribbonContainer.appendChild(this.ribbonElement);
    }

    private renderRibbon(): void {
        const tabs: RibbonTabModel[] = this.tabManager.getRibbonTabs();
        const fileMenuItems: RibbonItemModel[] = this.tabManager.getFileMenuItems();
        const contextualTabs: RibbonContextualTabSettingsModel[] = this.contextualTabManager.getContextualTabs();

        EJ2Ribbon.Inject(RibbonFileMenu, RibbonColorPicker, RibbonGallery, RibbonContextualTab, RibbonKeyTip);
        this.ribbon = new EJ2Ribbon({
            tabs: tabs,
            selectedTab: 0,
            enableRtl: this.container.enableRtl,
            contextualTabs: contextualTabs,
            launcherIconClick: this.eventManager.onLauncherIconClicked.bind(this.eventManager),
            enableKeyTips: true,
            activeLayout: this.container.ribbonLayout,
            tabSelected: this.eventManager.onTabSelected.bind(this.eventManager),
            ribbonLayoutSwitched: this.eventManager.onRibbonLayoutChange.bind(this.eventManager)
        });

        // Check if backstage menu is configured
        if (this.backstageMenu) {
            EJ2Ribbon.Inject(RibbonBackstage);
            this.ribbon.backStageMenu = this.backstageMenu;
            this.ribbon.fileMenu = {
                visible: false
            };
        } else {
            // Use traditional file menu
            this.ribbon.fileMenu = {
                text: this.localObj.getConstant('File'),
                menuItems: fileMenuItems,
                keyTip: 'F',
                visible: true,
                select: this.eventManager.onFileMenuItemSelect.bind(this.eventManager)
            };
        }

        this.ribbon.appendTo(this.ribbonElement);
    }
    /**
     * Adds a new tab to the ribbon UI.
     * @param {RibbonTabModel} tab - The ribbon tab model to add.
     * @param {string | RibbonTabType} insertBefore - Specifies the existing tab ID or type before which the new tab will be inserted.
     * If not specified, the new tab will be inserted at the end of the ribbon.
     * @returns {void}
     * @public
     */
    public addTab(tab: RibbonTabModel, insertBefore?: string | RibbonTabType): void {
        if (insertBefore !== undefined) {
            this.ribbon.addTab(tab, RibbonHelper.getTabId(insertBefore, this.container.element.id));
        } else {
            this.ribbon.addTab(tab);
        }
    }

    /**
     * Adds a new item to an existing group in the ribbon.
     * @param {RibbonGroupInfo} groupId - The information about the group to add the item to.
     * @param {RibbonItemModel} item - The ribbon item model to add.
     * @param {string | number} insertBefore - Specifies the existing item ID or index before which the new item will be inserted.
     * If a string is provided, it's treated as an item ID. If a number is provided, it's treated as an item index.
     * If not specified, the new item will be inserted at the end of the group.
     * @returns {void}
     * @public
     */
    public addItem(groupId: RibbonGroupInfo, item: RibbonItemModel, insertBefore?: string | number): void {
        if (insertBefore !== undefined) {
            if (typeof insertBefore === 'string') {
                const collectionId: string = RibbonHelper.getCollectionIdFromItem(groupId, this.container, insertBefore);
                this.ribbon.addItem(collectionId, item, insertBefore);
            } else {
                const targetInfo: RibbonItemInfo = { tabId: groupId.tabId, groupIndex: groupId.index, itemIndexes: [insertBefore] };
                const itemIds: string[] = RibbonHelper.getItemIdsFromGroup(targetInfo, this.container) as string[];
                this.ribbon.addItem(RibbonHelper.getCollectionIdFromItem(groupId, this.container), item, itemIds[0]);
            }
        } else {
            this.ribbon.addItem(RibbonHelper.getCollectionIdFromItem(groupId, this.container), item);
        }
    }

    /**
     * Adds a new group to an existing tab in the ribbon.
     * @param {string | RibbonTabType} tabId - The ID or type of the tab to add the group to.
     * @param {RibbonGroupModel} group - The ribbon group model to add.
     * @param {number} insertBefore - Specifies the existing group index before which the new group will be inserted. If not specified, the new group will be inserted at the end.
     * @returns {void}
     * @public
     */
    public addGroup(tabId: string | RibbonTabType, group: RibbonGroupModel, insertBefore?: number): void {
        if (insertBefore !== undefined) {
            this.ribbon.addGroup(
                RibbonHelper.getTabId(tabId, this.container.element.id),
                group,
                RibbonHelper.getGroupId({ tabId: tabId, index: insertBefore }, this.ribbon.tabs, this.container.element.id)
            );
        } else {
            this.ribbon.addGroup(RibbonHelper.getTabId(tabId, this.container.element.id), group);
        }
    }
    /**
     * Shows or hides a specific tab in the ribbon.
     * @param {string | RibbonTabType} tabId - The ID or type of the tab to show or hide.
     * @param {boolean} show - Whether to show (true) or hide (false) the tab.
     * @returns {void}
     * @public
     */
    public showTab(tabId: string | RibbonTabType, show: boolean): void {
        // Convert RibbonTabType to tab ID
        const ribbonTabId: string = RibbonHelper.getTabId(tabId, this.container.element.id);
        if (ribbonTabId === '') {
            return;
        }
        if (show) {
            this.ribbon.showTab(ribbonTabId);
        } else {
            this.ribbon.hideTab(ribbonTabId);
        }
    }

    /**
     * Shows or hides a specific group in a tab.
     * @param {string | RibbonGroupInfo} groupId - The ID of the group or group info to show or hide.
     * @param {boolean} show - Whether to show (true) or hide (false) the group.
     * @returns {void}
     * @public
     */
    public showGroup(groupId: string | RibbonGroupInfo, show: boolean): void {
        const ribbonGroupId: string = RibbonHelper.getGroupId(groupId, this.ribbon.tabs, this.container.element.id);
        if (ribbonGroupId === '') {
            return;
        }
        if (show) {
            this.ribbon.showGroup(ribbonGroupId);
        } else {
            this.ribbon.hideGroup(ribbonGroupId);
        }
    }
    /**
     * Shows or hides specific items in the ribbon.
     * @param {string | RibbonItemInfo} itemId - The ID of the item or item information object to show or hide.
     * If a string is provided, it's treated as an item ID. If a RibbonItemInfo object is provided,
     * it will show/hide items based on the specified tab, group, and item indexes.
     * @param {boolean} show - Whether to show (true) or hide (false) the item(s).
     * @returns {void}
     * @public
     */
    public showItems(itemId: string | RibbonItemInfo, show: boolean): void {
        if (typeof itemId === 'string') {
            this.showItemInternal(itemId, show);
        } else {
            const itemIds: string[] = RibbonHelper.getItemIdsFromGroup(itemId, this.container) as string[];
            for (const id of itemIds) {
                this.showItemInternal(id, show);
            }
        }
    }
    private showItemInternal(itemId: string, show: boolean): void {
        if (show) {
            this.ribbon.showItem(itemId);
        } else {
            this.ribbon.hideItem(itemId);
        }
    }

    /**
     * Enables or disables specific items in the ribbon.
     * @param {string | RibbonItemInfo} itemId - The ID of the item or item information object to show or hide.
     * If a string is provided, it's treated as an item ID. If a RibbonItemInfo object is provided,
     * it will enable/disable items based on the specified tab, group, and item indexes.
     * @param {boolean} enable - Whether to enable (true) or disable (false) the items.
     * @returns {void}
     * @public
     */
    public enableItems(itemId: string | RibbonItemInfo, enable: boolean): void {
        if (typeof itemId === 'string') {
            this.enableItemInternal(itemId, enable);
        } else {
            const itemIds: string[] = RibbonHelper.getItemIdsFromGroup(itemId, this.container) as string[];
            for (const id of itemIds) {
                this.enableItemInternal(id, enable);
            }
        }
    }
    private enableItemInternal(itemId: string, enable: boolean): void {

        if (enable) {
            this.ribbon.enableItem(itemId);
        } else {
            this.ribbon.disableItem(itemId);
        }
    }
    /**
     * Update ribbon state based on current selection
     * @returns {void}
     * @private
     */
    public updateRibbonState(): void {
        if (!this.ribbon) {
            return;
        }
        this.stateManager.updateRibbonState(this.ribbon);

        this.updateContextualTab();
        this.tabManager.updateAllTabs();
    }

    /**
     * Updates the contextual tab based on the current selection context
     * @returns {void}
     * @private
     */
    public updateContextualTab(): void {
        const currentContext: string = this.documentEditor.selectionModule.contextType;
        const isInHeaderFooter: boolean = currentContext.indexOf('Header') >= 0
            || currentContext.indexOf('Footer') >= 0;
        if (isInHeaderFooter || currentContext.indexOf('Image') >= 0 || currentContext.indexOf('Table') >= 0 && currentContext.indexOf('TableOfContents') === -1) {
            this.contextualTabManager.updateContextualTabs(this.ribbon);
        } else {
            this.contextualTabManager.hideContextualTab(this.ribbon);
        }
        this.previousContext = currentContext;
    }

    /**
     * Updates the zoom button state when zoom factor changes
     * @returns {void}
     * @private
     */
    public onZoomFactorChange(): void {
        this.tabManager.viewTab.zoomGroup.updateZoomButtonState();
    }

    /**
     * Refresh the ribbon
     * @returns {void}
     * @private
     */
    public refresh(): void {
        if (this.ribbon) {
            this.ribbon.refresh();
            this.updateRibbonState();
        }
    }
    /**
     * @returns {void}
     * @private
     */
    public onContentChange(): void {
        this.onRibbonContentChange();
    }
    /**
     * @returns {void}
     * @private
     */
    public onDocumentChange(): void {
        this.onRibbonDocumentChange();
    }
    /**
     * @param {boolean} isToggle - toggle track changes.
     * @returns {void}
     * @private
     */
    public initialize(isToggle?: boolean): void {
        if (this.container.backstageMenu) {
            this.backstageMenu = this.container.backstageMenu;
        }
        this.initializeRibbon();
        if (isToggle) {
            this.container.destroyPane();
            this.updateRibbonState();
            if (this.tabManager && this.tabManager.homeTab) {
                this.tabManager.homeTab.updateContentChanged();
            }
        }
    }
    /**
     * @param {boolean} restrictEditing - Whether to restrict editing or not
     * @returns {void}
     * @private
     */
    public restrictEditingToggleHelper(restrictEditing: boolean): void {
        this.enableDisableRibbonItem(!restrictEditing);
    }
    private onRibbonContentChange(): void {
        // Handle content changes
        this.tabManager.homeTab.updateContentChanged();
        this.contextualTabManager.setContentChangeFlag(true);
        this.contextualTabManager.updateContextualTabs(this.ribbon);
        this.contextualTabManager.setContentChangeFlag(false);
    }

    /**
     * @param {boolean} enable - Emable/Disable insert comment toolbar item.
     * @returns {void}
     * @private
     */
    public enableDisableInsertComment(enable: boolean): void {
        if (this.tabManager.insertTab && this.tabManager.insertTab.commentsGroup) {
            this.tabManager.insertTab.commentsGroup.enableDisableComment(enable);
        }
        if (this.tabManager.reviewTab && this.tabManager.reviewTab.commentsGroup) {
            this.tabManager.reviewTab.commentsGroup.enableDisableCommentGroup(enable);
        }
    }

    private onRibbonDocumentChange(): void {
        this.tabManager.homeTab.updateContentChanged();
        this.tabManager.updateStyleGallery();
        this.contextualTabManager.setContentChangeFlag(false);
        this.contextualTabManager.updateContextualTabs(this.ribbon);
    }

    /**
     * Enable or disable ribbon items based on protection state
     * @param {boolean} enable - Whether to enable or disable items
     * @returns {void}
     * @private
     */
    public enableDisableRibbonItem(enable: boolean): void {
        this.stateManager.enableDisableRibbonItem(this.ribbon, enable);
    }
    /**
     * @returns {void}
     * @private
     */
    public toggleTrackChanges(): void {
        if (this.tabManager.reviewTab && this.tabManager.reviewTab.trackingGroup) {
            this.tabManager.reviewTab.trackingGroup.updateSelection();
        }
    }

    /**
     * Destroy the ribbon instance
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (this.tabManager) {
            this.tabManager.destroy();
            this.tabManager = null;
        }
        if (this.ribbon) {
            this.ribbon.destroy();
            this.ribbon = null;
        }

        if (this.ribbonElement && this.ribbonElement.parentNode) {
            this.ribbonElement.parentNode.removeChild(this.ribbonElement);
        }

        if (this.container.ribbonContainer) {
            this.container.containerTarget.removeChild(this.container.ribbonContainer);
            this.container.ribbonContainer = undefined;
        }

        this.ribbonElement = null;
    }
}
