import { DocumentEditorContainer } from '../../document-editor-container';
import { Ribbon } from '../ribbon';
import { ContextType } from '../../../document-editor/base/index';
import { TABLE_DESIGN_TAB_ID } from './../table-design-tab/table-design-tab';
import { TABLE_LAYOUT_TAB_ID } from './../table-layout-tab/table-tab';
import { HEADER_FOOTER_TAB_ID } from './../header-footer-tab/header-footer-tab';
import { Ribbon as EJ2Ribbon, RibbonContextualTabSettingsModel } from '@syncfusion/ej2-ribbon';
import { RIBBON_ID } from './ribbon-constants';
import { PICTURE_FORMAT_TAB_ID } from '../picture-format-tab/picture-format-tab';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * Manages contextual tabs in the ribbon
 * @private
 */
export class RibbonContextualTabManager {
    /**
     * @private
     */
    private container: DocumentEditorContainer;

    private ribbonDocumentEditor: Ribbon;
    /**
     * Flag to track if the current operation is content change
     * @private
     */
    private isContentChange: boolean = false;

    /**
     * Constructor for RibbonContextualTabManager
     * @param {DocumentEditorContainer} container - Document editor container
     */
    constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.ribbonDocumentEditor = this.container.ribbon;
    }
    /**
     * Set content change flag
     * @param {boolean} value - Flag value
     * @returns {void}
     * @private
     */
    public setContentChangeFlag(value: boolean): void {
        this.isContentChange = value;
    }

    /**
     * Get contextual tabs configuration
     * @returns {any[]} Array of contextual tab configurations
     * @private
     */
    public getContextualTabs(): RibbonContextualTabSettingsModel[] {
        return [
            {
                tabs: [
                    this.ribbonDocumentEditor.tabManager.tableDesignTab.getTableDesignTab(),
                    this.ribbonDocumentEditor.tabManager.tableLayoutTab.getTableLayoutTab()
                ],
                visible: false
            },
            {
                tabs: [this.ribbonDocumentEditor.tabManager.headerFooterTab.getHeaderFooterTab()],
                visible: false
            },
            {
                tabs: [this.ribbonDocumentEditor.tabManager.pictureFormatTab.getPictureFormatTab()],
                visible: false
            }
        ];
    }

    /**
     * Update contextual tabs visibility based on selection
     * @param {Ribbon} ribbon - Ribbon instance
     * @returns {void}
     * @private
     */
    public updateContextualTabs(ribbon: EJ2Ribbon): void {
        if (!this.container.documentEditor || !this.container.documentEditor.selection ||
            (!isNullOrUndefined(this.container.documentEditor.selection) &&
            this.container.documentEditor.selection.contextType === 'Text' && this.ribbonDocumentEditor.previousContext === 'Text')) {
            return;
        }

        const currentContext: ContextType = this.container.documentEditor.selection.contextType;

        this.updateTableContextualTabs(ribbon, currentContext);
        this.updateHeaderFooterContextualTab(ribbon, currentContext);
        this.updatePictureFormatContextualTab(ribbon, currentContext);
    }

    private updateTableContextualTabs(ribbon: EJ2Ribbon, currentContext: ContextType): void {
        const isTableVisible: boolean = currentContext.indexOf('Table') >= 0 && currentContext !== 'TableOfContents';
        const tableDesignId: string = this.container.element.id + RIBBON_ID + TABLE_DESIGN_TAB_ID;
        const tableLayoutId: string = this.container.element.id + RIBBON_ID + TABLE_LAYOUT_TAB_ID;

        if (isTableVisible) {
            let isTabPresent: boolean = false;

            // Check if the tab is already present in contextual tabs
            for (const contextualTab of ribbon.contextualTabs) {
                for (const tab of contextualTab.tabs) {
                    if ((tab.id === tableDesignId || tab.id === tableLayoutId) && contextualTab.visible) {
                        isTabPresent = true;
                        break;
                    }
                }
                if (isTabPresent) {
                    break;
                }
            }

            if (!isTabPresent) {
                ribbon.showTab(tableDesignId, true);
                ribbon.showTab(tableLayoutId, true);
                // Only select the tab if this is a content change (insert table)
                if (this.isContentChange) {
                    ribbon.selectTab(tableDesignId);
                    this.isContentChange = false;
                }
            }

            if (this.ribbonDocumentEditor.tabManager.tableDesignTab) {
                this.ribbonDocumentEditor.tabManager.tableDesignTab.onSelectionChange();
            }

            if (this.ribbonDocumentEditor.tabManager.tableLayoutTab) {
                this.ribbonDocumentEditor.tabManager.tableLayoutTab.onTableLayoutChange();
            }
        } else {
            ribbon.hideTab(tableDesignId, true);
            ribbon.hideTab(tableLayoutId, true);
        }
    }

    /**
     * hide the contextual tab
     * @param {EJ2Ribbon} ribbon - ribbon instance
     * @returns {void}
     * @private
     */
    public hideContextualTab(ribbon: EJ2Ribbon): void {
        if (this.container.documentEditor.selection &&
            this.container.documentEditor.selection.contextType === this.ribbonDocumentEditor.previousContext) {
            return;
        }
        const ribbonId: string = this.container.element.id + RIBBON_ID;
        ribbon.hideTab(ribbonId + TABLE_DESIGN_TAB_ID, true);
        ribbon.hideTab(ribbonId + TABLE_LAYOUT_TAB_ID, true);
        ribbon.hideTab(ribbonId + HEADER_FOOTER_TAB_ID, true);
        ribbon.hideTab(ribbonId + PICTURE_FORMAT_TAB_ID, true);
        // ribbon.selectTab(ribbonId + HOME_TAB_ID);
    }

    private updateHeaderFooterContextualTab(ribbon: EJ2Ribbon, currentContext: ContextType): void {
        const isInHeaderFooter: boolean = currentContext.indexOf('Header') >= 0 || currentContext.indexOf('Footer') >= 0;
        const headerFooterTabId: string = this.container.element.id + RIBBON_ID + HEADER_FOOTER_TAB_ID;

        if (isInHeaderFooter) {
            let isTabPresent: boolean = false;

            // Check if the tab is already present in contextual tabs
            for (const contextualTab of ribbon.contextualTabs) {
                for (const tab of contextualTab.tabs) {
                    if (tab.id === headerFooterTabId && contextualTab.visible) {
                        isTabPresent = true;
                        break;
                    }
                }
                if (isTabPresent) {
                    break;
                }
            }

            if (!isTabPresent) {
                ribbon.showTab(headerFooterTabId, true);
                ribbon.selectTab(headerFooterTabId);
            }
        } else {
            ribbon.hideTab(headerFooterTabId, true);
        }
    }

    private updatePictureFormatContextualTab(ribbon: EJ2Ribbon, currentContext: ContextType): void {
        const isImageSelected: boolean = currentContext.indexOf('Image') >= 0;
        const pictureFormatTab: string = this.container.element.id + RIBBON_ID + PICTURE_FORMAT_TAB_ID;

        if (isImageSelected) {
            let isTabPresent: boolean = false;

            // Check if the tab is already present in contextual tabs
            for (const contextualTab of ribbon.contextualTabs) {
                for (const tab of contextualTab.tabs) {
                    if (tab.id === pictureFormatTab && contextualTab.visible) {
                        isTabPresent = true;
                        break;
                    }
                }
                if (isTabPresent) {
                    break;
                }
            }

            if (!isTabPresent) {
                ribbon.showTab(pictureFormatTab, true);
                // Only select the tab if this is a content change (insert picture)
                if (this.isContentChange) {
                    ribbon.selectTab(pictureFormatTab);
                    this.isContentChange = false;
                }
                this.ribbonDocumentEditor.tabManager.pictureFormatTab.updateImageProperties();
            }
        } else {
            ribbon.hideTab(pictureFormatTab, true);
        }
    }
}
