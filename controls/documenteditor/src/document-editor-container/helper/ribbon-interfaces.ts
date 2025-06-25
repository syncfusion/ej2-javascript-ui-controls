import { RibbonTabType } from '../../document-editor/base/ribbon-types';

/**
 * @private
 */
export interface ElementsMap {
    [key: string]: HTMLElement;
}

/**
 * @private
 */
export interface ListStyle { style: string; char: string; font: string }

/**
 * @private
 */
export interface StyleInfo {
    StyleName: string;
    [key: string]: any;
}

/**
 * @private
 */
export interface HighlightColorInfo { id: string, text: string, backgroundColor: string }

/**
 * Ribbon group information.
 */
export interface RibbonGroupInfo {
    /**
     * The tab ID or type where the group is located.
     */
    tabId: string | RibbonTabType;

    /**
     * The index of the group within the tab.
     */
    index: number;
}


/**
 * Ribbon item information.
 */
export interface RibbonItemInfo {
    /**
     * The tab ID or type where the item is located.
     */
    tabId: string | RibbonTabType;

    /**
     * The index of the group within the tab.
     */
    groupIndex: number;

    /**
     * The indexes of the item within the group.
     */
    itemIndexes: number[];
}
