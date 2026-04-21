import { RibbonTabModel } from '@syncfusion/ej2-ribbon';
import { DocumentEditorContainer } from '../../document-editor-container';
import { DocumentEditor } from '../../../document-editor/document-editor';
import { L10n } from '@syncfusion/ej2-base';
import { PageSetupGroup } from './index';
import { LayoutParagraphGroup } from './layout-paragraph-group';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';

export const LAYOUT_TAB_ID: string = '_layout_tab';

/**
 * Represents the Layout Tab in the Ribbon
 * @private
 */
export class LayoutTab {
    // Constants for UI element IDs


    private container: DocumentEditorContainer;
    private localObj: L10n;

    // Group instances
    private pageSetupGroup: PageSetupGroup;
    public layoutParagraphGroup: LayoutParagraphGroup;

    /**
     * Constructor for the LayoutTab
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.localObj = this.container.localObj;

        // Initialize group instances
        this.pageSetupGroup = new PageSetupGroup(container);
        this.layoutParagraphGroup = new LayoutParagraphGroup(container);
    }

    /**
     * Creates the Layout tab for the ribbon
     * @returns {RibbonTabModel} - Ribbon tab model for Layout tab
     * @private
     */
    public getLayoutTab(): RibbonTabModel {
        return {
            id: this.container.element.id + RIBBON_ID + LAYOUT_TAB_ID,
            keyTip: 'P',
            header: this.localObj.getConstant('Layout'),
            groups: [
                this.pageSetupGroup.getGroupModel(),
                // this.paragraphGroup.getGroupModel(),
                this.layoutParagraphGroup.getGroupModel()
            ]
        };
    }

    /**
     * Updates UI based on the current selection
     * @returns {void}
     * @private
     */
    public updateControlState(): void {
        this.layoutParagraphGroup.updateSelection();
        this.pageSetupGroup.updateSelection();
    }

    /**
     * Initializes event handlers
     * @returns {void}
     * @private
     */
    public wireEvents(): void {
        // Wire events in group classes if needed
        if (this.pageSetupGroup.wireEvents) {
            this.pageSetupGroup.wireEvents();
        }
    }

    /**
     * Disposes event handlers and resources
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Dispose events and resources in group classes
        if (this.pageSetupGroup.destroy) {
            this.pageSetupGroup.destroy();
        }
        if (this.layoutParagraphGroup.destroy) {
            this.layoutParagraphGroup.destroy();
        }

        this.pageSetupGroup = undefined;
        this.layoutParagraphGroup = undefined;
    }
}
