import { RibbonTabType } from '../../document-editor/base/ribbon-types';
import { RibbonTabModel, RibbonGroupModel, RibbonItemModel, Ribbon } from '@syncfusion/ej2-ribbon';
import { RibbonGroupInfo, RibbonItemInfo } from './ribbon-interfaces';
import { RIBBON_ID } from '../ribbon/ribbon-base/ribbon-constants';
import { HOME_TAB_ID } from '../ribbon/home-tab/home-tab';
import { INSERT_TAB_ID } from '../ribbon/insert-tab/insert-tab';
import { VIEW_TAB_ID } from '../ribbon/view-tab/view-tab';
import { HEADER_FOOTER_TAB_ID } from '../ribbon/header-footer-tab/header-footer-tab';
import { LAYOUT_TAB_ID } from '../ribbon/layout-tab/layout-tab';
import { TABLE_DESIGN_TAB_ID } from '../ribbon/table-design-tab/table-design-tab';
import { TABLE_LAYOUT_TAB_ID } from '../ribbon/table-layout-tab/table-tab';
import { PICTURE_FORMAT_TAB_ID } from '../ribbon/picture-format-tab/picture-format-tab';
import { REVIEW_TAB_ID } from '../ribbon/review-tab/review-tab';
import { REFERENCES_TAB_ID } from '../ribbon/reference-tab/reference-tab';
import { DEVELOPER_TAB_ID } from '../ribbon/developer-tab/developer-tab';
import { DocumentEditorContainer } from '../document-editor-container';

/**
 * Helper class for Ribbon operations
 * @private
 */

export class RibbonHelper {
    /**
     * Gets the ribbon tab ID from the RibbonTabType.
     * @param {string | RibbonTabType} tabType - The ribbon tab type.
     * @param {string} containerId - The container element ID.
     * @returns {string} The tab ID.
     */
    public static getTabId(tabType: string | RibbonTabType, containerId: string): string {
        if (typeof tabType === 'string' && tabType.indexOf(RIBBON_ID) >= 0) {
            return tabType;
        }
        return RibbonHelper.getDefaultTabId(tabType as RibbonTabType, containerId);
    }

    /**
     * Gets the default tab ID for predefined tab types.
     * @param {RibbonTabType} tabType - The ribbon tab type.
     * @param {string} containerId - The container element ID.
     * @returns {string} The default tab ID.
     */
    public static getDefaultTabId(tabType: RibbonTabType, containerId: string): string {
        const defaultId: string = containerId + RIBBON_ID;
        switch (tabType) {
        case 'Home':
            return defaultId + HOME_TAB_ID;
        case 'Insert':
            return defaultId + INSERT_TAB_ID;
        case 'View':
            return defaultId + VIEW_TAB_ID;
        case 'Review':
            return defaultId + REVIEW_TAB_ID;
        case 'Layout':
            return defaultId + LAYOUT_TAB_ID;
        case 'References':
            return defaultId + REFERENCES_TAB_ID;
        case 'HeaderFooter':
            return defaultId + HEADER_FOOTER_TAB_ID;
        case 'Developer':
            return defaultId + DEVELOPER_TAB_ID;
        case 'TableDesign':
            return defaultId + TABLE_DESIGN_TAB_ID;
        case 'TableLayout':
            return defaultId + TABLE_LAYOUT_TAB_ID;
        case 'PictureFormat':
            return defaultId + PICTURE_FORMAT_TAB_ID;
        default:
            return tabType as string;
        }
    }

    /**
     * Gets the group ID from string or RibbonGroupInfo.
     * @param {string | RibbonGroupInfo} groupId - The group identifier or info.
     * @param {RibbonTabModel[]} tabs - The ribbon tabs.
     * @param {string} containerId - The container element ID.
     * @returns {string} The group ID.
     */
    public static getGroupId(groupId: string | RibbonGroupInfo, tabs: RibbonTabModel[], containerId: string): string {
        if (typeof groupId === 'string') {
            return groupId;
        }

        const group: RibbonGroupModel = RibbonHelper.findGroup(groupId, tabs, containerId);
        return group ? group.id : '';
    }

    /**
     * Gets the group model from a tab based on group information.
     * @param {RibbonGroupInfo} groupInfo - The group information.
     * @param {RibbonTabModel[]} tabs - The ribbon tabs.
     * @param {string} containerId - The container element ID.
     * @returns {RibbonGroupModel} The group model, or undefined if not found.
     */
    public static findGroup(groupInfo: RibbonGroupInfo, tabs: RibbonTabModel[], containerId: string): RibbonGroupModel {
        const tabId: string = RibbonHelper.getTabId(groupInfo.tabId, containerId);
        const tab: RibbonTabModel = RibbonHelper.findTab(tabs, tabId);

        if (tab && tab.groups && tab.groups.length > groupInfo.index) {
            return tab.groups[groupInfo.index];
        }

        return undefined;
    }

    /**
     * Finds a tab by ID in the tabs collection.
     * @param {RibbonTabModel[]} tabs - The tabs collection.
     * @param {string} tabId - The tab ID.
     * @returns {RibbonTabModel} The found tab, or undefined.
     */
    public static findTab(tabs: RibbonTabModel[], tabId: string): RibbonTabModel {
        for (let i: number = 0; i < tabs.length; i++) {
            if (tabs[parseInt(i.toString(), 10)].id === tabId) {
                return tabs[parseInt(i.toString(), 10)];
            }
        }
        return undefined;
    }

    /**
     * Gets the collection ID from a group based on group information.
     * @param {RibbonGroupInfo} groupInfo - The group information.
     * @param {RibbonTabModel[]} tabs - The ribbon tabs.
     * @param {string} containerId - The container element ID.
     * @returns {string} The collection ID, or empty string if not found.
     */
    public static getCollectionIdFromGroup(
        groupInfo: RibbonGroupInfo,
        tabs: RibbonTabModel[],
        containerId: string
    ): string {
        // Get the tab ID

        const group: RibbonGroupModel = RibbonHelper.findGroup(groupInfo, tabs, containerId);
        if (group && group.collections && group.collections.length > 0) {
            return group.collections[group.collections.length - 1].id;
        }

        return '';
    }

    public static getCollectionIdFromItem(groupInfo: RibbonGroupInfo,
                                          container: DocumentEditorContainer, itemId?: string
    ): string {
        const group: RibbonGroupModel = RibbonHelper.findGroup(groupInfo, container.ribbon.ribbon.tabs, container.element.id);
        if (!group) {
            return '';
        }
        if (itemId) {
            if (group && group.collections && group.collections.length > 0) {
                for (const collection of group.collections) {
                    for (const item of collection.items) {
                        if (item.id === itemId) {
                            return collection.id;
                        }
                    }
                }
            }
        }

        return group.collections[group.collections.length - 1].id;
    }

    /**
     * Gets the item IDs from a group based on item information.
     * @param {RibbonItemInfo} itemInfo - The item information.
     * @param {DocumentEditorContainer} container - The DocumentEditorContainer instance.
     * @returns {string[]} Array of item IDs.
     */
    public static getItemIdsFromGroup(
        itemInfo: RibbonItemInfo,
        container: DocumentEditorContainer
    ): string[] {
        const itemIds: string[] = [];
        const groupInfo: RibbonGroupInfo = { tabId: itemInfo.tabId, index: itemInfo.groupIndex };
        const group: RibbonGroupModel = RibbonHelper.findGroup(groupInfo, container.ribbon.ribbon.tabs, container.element.id);
        if (group && group.collections && itemInfo.itemIndexes && itemInfo.itemIndexes.length > 0) {
            let allItems: RibbonItemModel[] = [];

            // Flatten all items from collections
            for (const collection of group.collections) {
                if (collection.items) {
                    allItems = allItems.concat(collection.items);
                }
            }

            // Get items at specified indexes
            for (let i: number = 0; i < itemInfo.itemIndexes.length; i++) {
                const itemIndex: number = itemInfo.itemIndexes[parseInt(i.toString(), 10)];
                if (itemIndex >= 0 && itemIndex < allItems.length) {
                    itemIds.push(allItems[parseInt(itemIndex.toString(), 10)].id);
                }
            }
        }

        return itemIds;
    }
    /**
     * Updates the toggle state of a ribbon button
     * @param {Ribbon} ribbonObj - The ribbon object instance to update
     * @param {string} buttonId - The unique identifier of the button to toggle
     * @param {boolean} isActive - Boolean value indicating whether the button should be in active/pressed state
     * @returns {void}
     * @private
     */
    public static updateToggleButtonState(ribbonObj: Ribbon, buttonId: string, isActive: boolean): void {
        if (ribbonObj) {
            const button: HTMLElement = document.getElementById(buttonId);
            if (button) {
                if (isActive) {
                    button.classList.add('e-active');
                    button.setAttribute('aria-pressed', 'true');
                }
                else {
                    button.classList.remove('e-active');
                    button.setAttribute('aria-pressed', 'false');
                }
            }
        }
    }
}
