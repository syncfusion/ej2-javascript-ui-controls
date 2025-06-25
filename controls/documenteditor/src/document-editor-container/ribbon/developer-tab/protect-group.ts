import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel, RibbonItemModel } from '@syncfusion/ej2-ribbon';
import { DocumentEditor } from '../../../document-editor';
import { classList } from '@syncfusion/ej2-base';

/**
 * Constants for protect group identification
 */
export const PROTECT_GROUP: string = '_developer_protect_group';
export const RESTRICT_EDITING_ID: string = '_restrict_edit';

/**
 * ProtectGroup module
 */
export class ProtectGroup {
    private container: DocumentEditorContainer;
    private ribbonId: string;

    /**
     * Constructor for ProtectGroup class
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    public constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.ribbonId = this.container.element.id + '_ribbon';
    }

    /**
     * Get the DocumentEditor instance
     * @returns {DocumentEditor} The document editor instance
     */
    private get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }

    /**
     * Get the Protect group model
     * @returns {RibbonGroupModel} The ribbon group model
     */
    public getGroupModel(): RibbonGroupModel {
        const locale: any = this.container.localObj;
        const id: string = this.ribbonId + PROTECT_GROUP;

        return {
            id: id,
            header: locale.getConstant('Protect'),
            orientation: 'Row',
            enableGroupOverflow: true,
            overflowHeader: locale.getConstant('Protect'),
            collections: [
                {
                    items: [
                        this.getRestrictEditingButtonModel()
                    ]
                }
            ]
        };
    }

    /**
     * Get the Restrict Editing button model
     * @returns {RibbonItemModel} The ribbon item model
     */
    private getRestrictEditingButtonModel(): RibbonItemModel {
        const locale: any = this.container.localObj;
        const id: string = this.ribbonId + PROTECT_GROUP;

        return {
            type: 'Button',
            id: id + RESTRICT_EDITING_ID,
            buttonSettings: {
                iconCss: 'e-icons e-de-ctnr-lock',
                content: locale.getConstant('Restrict Editing'),
                clicked: this.onRestrictEditingClick.bind(this)
            },
            ribbonTooltipSettings: {
                content: locale.getConstant('Restrict editing')
            }
        };
    }

    /**
     * Handle restrict editing button click
     * @returns {void}
     */
    private onRestrictEditingClick(): void {
        this.documentEditor.documentHelper.restrictEditingPane.showHideRestrictPane(true);

        setTimeout((): void => {
            this.documentEditor.focusIn();
        }, 30);
    }

    /**
     * Update UI based on current selection
     * @returns {void}
     */
    public updateSelection(): void {
        // Update UI state based on current selection
        const isReadOnly: boolean = this.documentEditor.isReadOnly;
        const isDocumentProtected: boolean = this.documentEditor.documentHelper.isDocumentProtected;

        // Enable/disable restrict editing button based on document state
        const enableRestrictEditing: boolean = !isReadOnly;

        // Implementation to enable/disable restrict editing button
        const restrictEditingElement: HTMLElement = document.getElementById(this.ribbonId + PROTECT_GROUP + RESTRICT_EDITING_ID);
        if (restrictEditingElement) {
            restrictEditingElement.classList.toggle('e-disabled', !enableRestrictEditing);

            // Update button state if document is protected
            this.toggleButton(restrictEditingElement, this.container.restrictEditing);
        }
    }

    /**
     * Toggle button state
     * @param {HTMLElement} element - The HTML element to toggle
     * @param {boolean} toggle - The toggle state
     * @returns {void}
     */
    private toggleButton(element: HTMLElement, toggle: boolean): void {
        if (toggle) {
            classList(element, ['e-btn-toggle'], []);
            element.setAttribute('aria-pressed', 'true');
        } else {
            classList(element, [], ['e-btn-toggle']);
            element.setAttribute('aria-pressed', 'false');
        }
    }


    /**
     * Destroy the ProtectGroup instance
     * @returns {void}
     */
    public destroy(): void {
        // Clear all references
        this.container = undefined;
        this.ribbonId = undefined;
    }
}
