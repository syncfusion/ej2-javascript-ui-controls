import { Browser, EventHandler, L10n, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ContentControl, DocumentHelper } from '../viewer';
import { DocumentEditorContainer } from '../../../document-editor-container';

/**
 *  To show the dialog is used to insert image on picture Content Control.
 */
export class PicContentControlDialog {
    /**
     * @private
     */
    public container: DocumentEditorContainer;
    /**
     * @private
     */
    public imagePicker: HTMLInputElement;
    private parentDiv: HTMLElement;
    /**
     * @private
     */
    public documentHelper: DocumentHelper;

    private image: HTMLImageElement;
    private localeValue: L10n;
    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }

    private getModuleName(): string {
        return 'PicContentControlDialog';
    }
    /**
     * @private
     * @returns {void}
     */
    public show(): void {
        const localValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localValue.setLocale(this.documentHelper.owner.locale);
        this.localeValue = localValue;
        this.documentHelper.dialog2.header = localValue.getConstant('Insert Pictures');
        this.documentHelper.dialog2.showCloseIcon = true;
        this.documentHelper.dialog2.allowDragging = true;
        this.documentHelper.dialog2.position = { X: 'center', Y: 'center' };
        this.documentHelper.dialog2.width = 'auto';
        this.documentHelper.dialog2.beforeOpen = this.documentHelper.updateFocus;
        this.documentHelper.dialog2.buttons = [{
            click: this.onInsertPicClick,
            buttonModel: { content: localValue.getConstant('Upload from computer'), iconCss: 'e-icons e-de-ctnr-upload', iconPosition: 'Left' }
        }];
        this.documentHelper.dialog2.dataBind();
        this.documentHelper.dialog2.show();
    }
    /**
     * @private
     * @returns {void}
     */
    public onCancelButtonClick = (): void => {
        this.documentHelper.dialog2.hide();
        this.documentHelper.updateFocus();
    };
    /**
     * @private
     * @returns {void}
     */
    public onInsertPicClick = (): void => {
        this.documentHelper.dialog2.hide();
        this.imagePicker = createElement('input', {
            attrs: { type: 'file', accept: '.jpg,.jpeg,.png,.bmp,.svg' }, className: 'e-de-ctnr-file-picker'
        }) as HTMLInputElement;
        if (Browser.isIE) {
            document.body.appendChild(this.imagePicker);
        }
        this.imagePicker.value = '';
        this.imagePicker.click();
        EventHandler.add(this.imagePicker, 'change', this.onImageChange, this);

    };
    private onImageChange(): void {
        const file: File = this.imagePicker.files[0];
        const fileReader: FileReader = new FileReader();
        fileReader.onload = (): void => {
            this.insertImage(fileReader.result as string);
        };
        fileReader.readAsDataURL(file);
    }
    private insertImage(data: string): void {
        this.image = document.createElement('img');
        const documentHelper: DocumentHelper = this.documentHelper;
        const container: DocumentEditorContainer = this.container;
        this.image.addEventListener('load', function (): void {
            documentHelper.owner.editorModule.insertImageInternal(data, true, this.width, this.height, this.alt);
            //to upload an image newly = false, this condition applies and to replace the new image = true , this condition not applies
            if (!documentHelper.owner.selection.isImageSelected) {
                documentHelper.owner.selection.handleShiftLeftKey();
                documentHelper.owner.editor.insertContentControl('Picture');
            }
        });
        this.image.src = data;
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.documentHelper = undefined;
        if (this.imagePicker){
            this.imagePicker.remove();
            this.imagePicker = undefined;
        }
        if (this.image){
            this.image.remove();
            this.image = undefined;
        }
    }

}
