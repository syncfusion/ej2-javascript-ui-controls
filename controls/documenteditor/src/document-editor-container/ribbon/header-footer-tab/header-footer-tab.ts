import { L10n } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonTabModel } from '@syncfusion/ej2-ribbon';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';
import { PageNumbersGroup } from './page-numbers-group';
import { OptionsGroup } from './options-group';
import { CloseGroup } from './close-group';

export const HEADER_FOOTER_TAB_ID: string = '_header_footer_tab';

/**
 * HeaderFooterTab module for document editor ribbon
 * @private
 */
export class HeaderFooterTab {
    private container: DocumentEditorContainer;
    private localObj: L10n;
    private commonID: string;

    // Group instances
    private pageNumbersGroup: PageNumbersGroup;
    private optionsGroup: OptionsGroup;
    private closeGroup: CloseGroup;

    /**
     * Constructor for HeaderFooterTab
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    public constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.localObj = this.container.localObj;
        this.commonID = this.container.element.id + RIBBON_ID;

        // Initialize group instances
        this.pageNumbersGroup = new PageNumbersGroup(container);
        this.optionsGroup = new OptionsGroup(container);
        this.closeGroup = new CloseGroup(container);
    }

    /**
     * Gets the HeaderFooter tab model for ribbon
     * @returns {RibbonTabModel} The header footer tab model
     */
    public getHeaderFooterTab(): RibbonTabModel {
        return {
            id: this.commonID + HEADER_FOOTER_TAB_ID,
            header: this.localObj.getConstant('Header & Footer'),
            keyTip: 'JH',
            groups: [
                this.pageNumbersGroup.getGroupModel(),
                this.optionsGroup.getGroupModel(),
                this.closeGroup.getGroupModel()
            ]
        };
    }

    /**
     * Updates the checkbox states based on current document settings
     * @returns {void}
     */
    public updateCheckboxStates(): void {
        this.optionsGroup.updateSelection();
    }

    /**
     * Clean up resources
     * @returns {void}
     */
    public destroy(): void {
        // Clean up group resources
        if (this.pageNumbersGroup.destroy) {
            this.pageNumbersGroup.destroy();
        }
        if (this.optionsGroup.destroy) {
            this.optionsGroup.destroy();
        }
        if (this.closeGroup.destroy) {
            this.closeGroup.destroy();
        }

        // Clear references
        this.pageNumbersGroup = undefined;
        this.optionsGroup = undefined;
        this.closeGroup = undefined;
    }
}
