import { DocumentEditorContainer } from '../../document-editor-container';
import { Ribbon, RibbonTabModel, RibbonGroupModel, RibbonCollectionModel, RibbonItemModel } from '@syncfusion/ej2-ribbon';
import { RIBBON_ID } from './ribbon-constants';
import { DocumentEditor } from '../../../document-editor/document-editor';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Manages ribbon state
 * @private
 */
export class RibbonStateManager {
    /**
     * @private
     */
    private container: DocumentEditorContainer;

    /**
     * Constructor for RibbonStateManager
     * @param {DocumentEditorContainer} container - Document editor container
     */
    constructor(container: DocumentEditorContainer) {
        this.container = container;
    }

    /**
     * Update ribbon state based on current selection
     * @param {Ribbon} ribbon - Ribbon instance
     * @returns {void}
     * @public
     */
    public updateRibbonState(ribbon: Ribbon): void {
        if (!ribbon) {
            return;
        }

        const isProtectedDocument: boolean = this.container.documentEditor.documentHelper.protectionType !== 'NoProtection';
        const isSelectionInProtectedRegion: boolean = this.container.documentEditor.editorModule.restrictEditing;

        if (isProtectedDocument) {
            this.enableDisableRibbonItem(ribbon, !isSelectionInProtectedRegion);
        } else {
            this.enableDisableRibbonItem(ribbon, !isProtectedDocument);
        }
    }

    /**
     * Enable or disable ribbon items based on protection state
     * @param {Ribbon} ribbon - Ribbon instance
     * @param {boolean} enable - Whether to enable or disable items
     * @returns {void}
     * @private
     */
    public enableDisableRibbonItem(ribbon: Ribbon, enable: boolean): void {
        if (!ribbon.tabs || !ribbon.tabs.length) {
            return;
        }

        if (enable) {
            // Enable all tabs and groups
            for (const tab of ribbon.tabs) {
                ribbon.enableTab(tab.id);
                for (const group of tab.groups) {
                    ribbon.enableGroup(group.id);
                }
            }
            this.container.ribbon.toggleTrackChanges();
            return;
        }

        // When disabling (enable === false)
        for (const tab of ribbon.tabs) {
            const tabId: string = tab.id;
            const isViewTab: boolean = tabId.indexOf('view') !== -1;
            const isHomeTab: boolean = tabId.indexOf('home') !== -1;
            const isReviewTab: boolean = tabId.indexOf('review') !== -1;

            if (isReviewTab) {
                ribbon.enableTab(tabId);
                this.handleReviewTabProtection(ribbon, tab);
            } else if (isViewTab) {
                ribbon.enableTab(tabId);
                ribbon.disableGroup(this.container.element.id + RIBBON_ID + '_showGroup');
            } else if (isHomeTab) {
                ribbon.enableTab(tabId);
                this.handleHomeTabProtection(ribbon, tab);
            } else {
                for (const group of tab.groups) {
                    ribbon.disableGroup(group.id);
                }
            }
        }
    }

    /**
     * Handle home tab protection
     * @param {Ribbon} ribbon - Ribbon instance
     * @param {RibbonTabModel} tab - Tab object
     * @returns {void}
     * @private
     */
    private handleHomeTabProtection(ribbon: Ribbon, tab: RibbonTabModel): void {
        const homeGroups: RibbonGroupModel[] = tab.groups;
        for (const group of homeGroups) {
            const isFindGroup: boolean = group.id.indexOf('find') !== -1;

            if (isFindGroup) {
                ribbon.enableGroup(group.id);
                this.enableOnlyFindItems(ribbon, group);
            } else {
                ribbon.disableGroup(group.id);
            }
        }
    }

    /**
     * Enable only find-related items
     * @param {Ribbon} ribbon - Ribbon instance
     * @param {RibbonGroupModel} group - Group object
     * @returns {void}
     * @private
     */
    private enableOnlyFindItems(ribbon: Ribbon, group: RibbonGroupModel): void {
        for (const collection of group.collections || []) {
            for (const item of collection.items || []) {
                const itemId: string = item.id;
                if (itemId && itemId.indexOf('find') !== -1) {
                    ribbon.enableItem(itemId);
                } else {
                    ribbon.disableItem(itemId);
                }
            }
        }
    }

    /**
     * Handle review tab protection
     * @param {Ribbon} ribbon - Ribbon instance
     * @param {RibbonTabModel} tab - Tab object
     * @returns {void}
     * @private
     */
    private handleReviewTabProtection(ribbon: Ribbon, tab: RibbonTabModel): void {
        const reviewGroups: RibbonGroupModel[] = tab.groups;
        for (const group of reviewGroups) {
            const isRestrictedGroup: boolean =
                group.id.indexOf('comments') !== -1 ||
                group.id.indexOf('tracking') !== -1;

            if (group.id.indexOf('comments') !== -1) {
                const documentEditor: DocumentEditor = this.container.documentEditor;
                let enable: boolean = false;
                if (!isNullOrUndefined(documentEditor) && (documentEditor.isReadOnly ||
                    documentEditor.documentHelper.isDocumentProtected)) {
                    enable = documentEditor.documentHelper.isCommentOnlyMode || !documentEditor.isReadOnlyMode;
                }
                this.container.ribbon.enableDisableInsertComment(enable);
            } else if (isRestrictedGroup) {
                ribbon.disableGroup(group.id);
            } else {
                ribbon.enableGroup(group.id);
            }
        }
    }

}
