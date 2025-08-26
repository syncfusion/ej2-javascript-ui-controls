import { L10n } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonTabModel } from '@syncfusion/ej2-ribbon';
import { TableOfContentsGroup } from './table-of-contents-group';
import { FootnotesGroup } from './footnotes-group';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';

export const REFERENCES_TAB_ID: string = '_reference_tab';
/**
 * Reference tab implementation
 * @private
 */
export class ReferenceTab {
    private container: DocumentEditorContainer;
    private localObj: L10n;
    private tableOfContentsGroup: TableOfContentsGroup;
    private footnotesGroup: FootnotesGroup;

    /**
     * Constructor for ReferenceTab class
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);

        // Initialize group components
        this.tableOfContentsGroup = new TableOfContentsGroup(this.container);
        this.footnotesGroup = new FootnotesGroup(this.container);
    }

    /**
     * Get the Reference tab configuration
     * @returns {RibbonTabModel} - Reference tab configuration
     * @private
     */
    public getReferenceTab(): RibbonTabModel {
        return {
            id: this.container.element.id + RIBBON_ID + REFERENCES_TAB_ID,
            keyTip: 'S',
            header: this.localObj.getConstant('References'),
            groups: [
                this.tableOfContentsGroup.getGroupModel(),
                this.footnotesGroup.getGroupModel()
            ]
        };
    }

    /**
     * Update UI based on selection state
     * @returns {void}
     * @private
     */
    public updateSelectionState(): void {
        // Delegate to individual group components
        this.tableOfContentsGroup.updateSelection();
        this.footnotesGroup.updateSelection();
    }

    /**
     * Clean up resources
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (this.tableOfContentsGroup) {
            this.tableOfContentsGroup.destroy();
        }

        if (this.footnotesGroup) {
            this.footnotesGroup.destroy();
        }

        this.tableOfContentsGroup = null;
        this.footnotesGroup = null;
    }
}
