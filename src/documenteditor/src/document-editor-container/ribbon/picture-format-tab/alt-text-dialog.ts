import { L10n, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TextArea } from '@syncfusion/ej2-inputs';
import { DocumentEditorContainer } from '../../document-editor-container';
import { DocumentHelper } from '../../../document-editor/implementation';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';
/**
 * Dialog class to manage alternative text input for images.
 * @returns {AltTextDialog} - Returns the AltTextDialog instance.
 * @private
 */
export class AltTextDialog {
    private container: DocumentEditorContainer;
    private localObj: L10n;
    private target: HTMLElement;
    private altTextArea: TextArea;
    private textAreaElement: HTMLTextAreaElement;

    // Constants for UI elements
    private readonly ALT_TEXT_INPUT_ID: string = '_de-alt-text-input';

    /**
     * Constructor for AltTextDialog class
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
    }

    private initDialog(localValue: L10n): void {
        const id: string = this.container.element.id + RIBBON_ID + '_alt_text_dialog';
        this.target = createElement('div', { id: id, className: 'e-de-alt-text' });

        const container: HTMLElement = createElement('div');
        const label: HTMLElement = createElement('div', {
            className: 'e-de-alt-text-dlg-title',
            innerHTML: localValue.getConstant('Alternative Text')
        });

        // Create textarea element instead of input
        this.textAreaElement = createElement('textarea', {
            id: this.container.element.id + RIBBON_ID + this.ALT_TEXT_INPUT_ID,
            className: 'e-input e-de-alt-text-dlg-textarea'
        }) as HTMLTextAreaElement;

        container.appendChild(label);
        container.appendChild(this.textAreaElement);
        this.target.appendChild(container);

        // Initialize TextArea with placeholder
        this.altTextArea = new TextArea({
            // placeholder: localValue.getConstant('Enter alt text for this image'),
            // floatLabelType: 'Always',
            rows: 5,
            cssClass: 'e-de-alt-text-area'
        });

        this.altTextArea.appendTo(this.textAreaElement);
    }

    /**
     * Show the Alt Text Dialog
     * @returns {void}
     */
    public show = (): void => {
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);

        if (!this.target) {
            this.initDialog(this.localObj);
        }

        // Get the document helper's dialog from the container
        const documentHelper: DocumentHelper = (this.container.documentEditor).documentHelper;

        documentHelper.dialog.header = this.localObj.getConstant('Alt Text');
        documentHelper.dialog.height = 'auto';
        documentHelper.dialog.width = 'auto'; // Wider dialog for textarea
        documentHelper.dialog.content = this.target;
        documentHelper.dialog.buttons = [{
            click: this.applyAltText,
            buttonModel: { content: this.localObj.getConstant('Apply'), cssClass: 'e-flat', isPrimary: true }
        },
        {
            click: this.hideDialog,
            buttonModel: { content: this.localObj.getConstant('Cancel'), cssClass: 'e-flat' }
        }];

        // Set current alt text value
        const currentAltText: string = this.getCurrentAltText();
        this.altTextArea.value = currentAltText;

        documentHelper.dialog.dataBind();
        documentHelper.dialog.show();
    };

    private applyAltText = (): void => {
        const altText: string = this.altTextArea.value;

        // Apply alt text to the selected image
        this.container.documentEditor.selection.imageFormat.applyImageAlternativeText(altText);

        // Hide dialog
        this.hideDialog();
    };

    private hideDialog = (): void => {
        const documentHelper: DocumentHelper = (this.container.documentEditor).documentHelper;
        this.altTextArea.value = '';
        documentHelper.dialog.hide();
        this.container.documentEditor.focusIn();
    };

    private getCurrentAltText(): string {
        if (this.container.documentEditor &&
            this.container.documentEditor.selection &&
            this.container.documentEditor.selection.imageFormat) {
            return this.container.documentEditor.selection.imageFormat.alternateText;
        }
        return '';
    }

    /**
     * Clean up resources when destroyed
     * @returns {void}
     */
    public destroy(): void {
        if (this.altTextArea) {
            this.altTextArea.destroy();
            this.altTextArea = undefined;
        }
        this.container = undefined;
        this.target = undefined;
        this.textAreaElement = undefined;
    }
}
