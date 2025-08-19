import { createElement, KeyboardEventArgs, L10n, classList } from '@syncfusion/ej2-base';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { TextBox } from '@syncfusion/ej2-inputs';
import { DocumentEditorContainer } from '../document-editor-container';
import { DocumentEditor } from '../../document-editor/document-editor';
import { SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * Image Property pane
 *
 * @private
 */
export class ImageProperties {

    //EJ2 Components
    private widthNumericBox: NumericTextBox;
    private heightNumericBox: NumericTextBox;
    private aspectRatioBtn: CheckBox;

    //HTML Elements
    private imageDiv: HTMLElement;
    private label: HTMLElement;
    private alabel: HTMLElement;
    private outerDiv: HTMLElement;
    private aspectRatio: HTMLInputElement;
    private aspectRatioDiv: HTMLElement;
    private textArea: HTMLElement;
    public element: HTMLElement;
    private widthElement: HTMLElement;
    private heightElement: HTMLElement;
    private textareaObj: TextBox;
    private altDiv: HTMLElement;

    //Private Variables
    private container: DocumentEditorContainer;
    private elementId: string;
    private isMaintainAspectRatio: boolean;
    private isWidthApply: boolean = false;
    private isHeightApply: boolean = false;
    private isRtl: boolean;

    //Event Hook Constants
    private onAspectRatioBtnClickHook: EventListenerOrEventListenerObject = this.onAspectRatioBtnClick.bind(this);
    private widthBlurHook: EventListenerOrEventListenerObject = this.widthBlur.bind(this);
    private heightBlurHook: EventListenerOrEventListenerObject = this.heightBlur.bind(this);
    private onImageWidthHook: EventListenerOrEventListenerObject = this.onImageWidth.bind(this);
    private onImageHeightHook: EventListenerOrEventListenerObject = this.onImageHeight.bind(this);
    private widthNumericBlurHook: EventListenerOrEventListenerObject = this.widthNumericBlur.bind(this);
    private heightNumericBlurHook: EventListenerOrEventListenerObject = this.heightNumericBlur.bind(this);
    private altTextAreaBlurHook: EventListenerOrEventListenerObject = this.altTextAreaBlur.bind(this);

    private get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }

    public constructor(container: DocumentEditorContainer, isRtl?: boolean) {
        this.container = container;
        this.elementId = this.documentEditor.element.id;
        this.isMaintainAspectRatio = false;
        this.isRtl = isRtl;
        this.initializeImageProperties();
    }
    /**
     * @private
     * @param {boolean} enable - enable/disable image properties pane.
     * @returns {void}
     */
    public enableDisableElements(enable: boolean): void {
        if (enable) {
            classList(this.element, [], ['e-de-overlay']);
        } else {
            classList(this.element, ['e-de-overlay'], []);
        }
    }
    private initializeImageProperties(): void {
        this.element = createElement('div', { id: this.elementId + '_imageProperties', className: 'e-de-prop-pane' });
        this.element.style.display = 'none';
        this.container.propertiesPaneContainer.appendChild(this.element);
        this.initImageProp();
        this.initImageAltProp();
        this.wireEvents();
    }

    private initImageProp(): void {
        const localObj: L10n = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        this.imageDiv = createElement('div', { id: this.elementId + '_imageDiv', className: 'e-de-cntr-pane-padding e-de-prop-separator-line'});
        this.element.appendChild(this.imageDiv);
        this.label = createElement('label', { className: 'e-de-ctnr-prop-label' });
        this.label.textContent = localObj.getConstant('Image');
        this.imageDiv.appendChild(this.label);
        this.outerDiv = createElement('div');
        this.imageDiv.appendChild(this.outerDiv);
        this.widthElement = this.createImagePropertiesDiv('_widthDiv', this.outerDiv, '_widthInput', localObj.getConstant('W'), localObj.getConstant('Width'));
        this.widthNumericBox = new NumericTextBox({ min: 0, max: 23500, cssClass: 'e-de-image-property', showSpinButton: false, format: 'n0', decimals: 2 });
        this.widthNumericBox.appendTo(this.widthElement);
        this.heightElement = this.createImagePropertiesDiv('_heightDiv', this.outerDiv, '_heightInput', localObj.getConstant('H'), localObj.getConstant('Height'));
        this.heightNumericBox = new NumericTextBox({ min: 0, max: 23500, cssClass: 'e-de-image-property', showSpinButton: false, format: 'n0', decimals: 2 });
        this.heightNumericBox.appendTo(this.heightElement);
        this.aspectRatioDiv = createElement('div', { id: this.elementId + '_aspectRatioDiv' });
        this.aspectRatioDiv.setAttribute('title', localObj.getConstant('Aspect ratio'));
        this.outerDiv.appendChild(this.aspectRatioDiv);
        this.aspectRatio = createElement('input', { id: this.elementId + '_aspectRatio', className: 'e-de-ctnr-prop-label' }) as HTMLInputElement;
        this.aspectRatioDiv.appendChild(this.aspectRatio);
        this.aspectRatioBtn = new CheckBox({ label: localObj.getConstant('Aspect ratio'), enableRtl: this.isRtl }, this.aspectRatio);
    }
    private initImageAltProp(): void {
        const localObj: L10n = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        this.altDiv = createElement('div', { id: this.elementId + '_altDiv', className: 'e-de-cntr-pane-padding e-de-prop-separator-line' });
        this.element.appendChild(this.altDiv);
        this.alabel = createElement('label', { className: 'e-de-ctnr-prop-label' });
        this.alabel.textContent = localObj.getConstant('Alternate Text');
        this.altDiv.appendChild(this.alabel);
        this.textArea = createElement('textarea', { id: this.elementId + '_textarea', className: 'e-de-ctnr-prop-label '});
        this.altDiv.appendChild(this.textArea);
        this.textareaObj = new TextBox({
            floatLabelType: 'Never'
        });
        this.textareaObj.appendTo(this.textArea);
    }
    /* eslint-disable-next-line max-len */
    private createImagePropertiesDiv(id: string, outerDiv: HTMLElement, inputId: string, spanContent: string, tooltip: string): HTMLElement {
        const divElement: HTMLElement = createElement('div', { id: this.elementId + id, styles: 'position: relative;width: 100%;', className: 'e-de-ctnr-segment' });
        divElement.setAttribute('title', tooltip);
        outerDiv.appendChild(divElement);
        const inputElement: HTMLElement = createElement('input', { id: this.elementId + inputId, className: 'e-textbox', styles: 'width:100%;' });
        divElement.appendChild(inputElement);
        const spanElement: HTMLElement = createElement('span', { className: 'e-de-img-prty-span' });
        spanElement.textContent = spanContent;
        divElement.appendChild(spanElement);
        return inputElement;
    }
    public wireEvents(): void {
        this.aspectRatioBtn.element.addEventListener('change', this.onAspectRatioBtnClickHook);
        this.widthNumericBox.element.addEventListener('click', this.widthBlurHook);
        this.heightNumericBox.element.addEventListener('click', this.heightBlurHook);
        this.widthNumericBox.element.addEventListener('keydown', this.onImageWidthHook);
        this.heightNumericBox.element.addEventListener('keydown', this.onImageHeightHook);
        this.widthNumericBox.element.addEventListener('blur', this.widthNumericBlurHook);
        this.heightNumericBox.element.addEventListener('blur', this.heightNumericBlurHook);
        this.textArea.addEventListener('blur', this.altTextAreaBlurHook);
    }
    private altTextAreaBlur(): void {
        if (this.documentEditor.selectionModule.imageFormat.alternateText !== (this.textArea as HTMLInputElement).value) {
            this.applyImageAlternativeText();
        }
    }
    private heightNumericBlur(): void {
        this.applyImageHeight(); this.isHeightApply = false;
    }
    private widthNumericBlur(): void {
        this.applyImageWidth(); this.isWidthApply = false;
    }
    private widthBlur(): void {
        this.isWidthApply = true;
    }
    private heightBlur(): void {
        this.isHeightApply = true;
    }
    private applyImageAlternativeText(): void{
        const altText: string = SanitizeHtmlHelper.sanitize((this.textArea as HTMLInputElement).value);
        if (!isNullOrUndefined(altText))
        {
            this.documentEditor.selectionModule.imageFormat.applyImageAlternativeText(altText);
        }
    }
    private onImageWidth(e: KeyboardEventArgs): void {
        if (e.keyCode === 13) {
            setTimeout((): void => {
                this.applyImageWidth(); this.isWidthApply = false;
            }, 30);
        }
    }
    private onImageHeight(e: KeyboardEventArgs): void {
        if (e.keyCode === 13) {
            setTimeout((): void => {
                this.applyImageHeight(); this.isHeightApply = false;
            }, 30);
        }
    }
    private applyImageWidth(): void {
        if (!this.isMaintainAspectRatio) {
            let width: number = this.widthNumericBox.value;
            let height: number = this.heightNumericBox.value;
            if (width > this.widthNumericBox.max) {
                width = this.widthNumericBox.max;
            }
            if (height > this.heightNumericBox.max) {
                height = this.heightNumericBox.max;
            }
            if (!(width === null || height === null)) {
                this.documentEditor.selectionModule.imageFormat.resize(width, height);
            }
        } else if (this.isMaintainAspectRatio) {
            let width: number = this.widthNumericBox.value;
            if (width > this.widthNumericBox.max) {
                width = this.widthNumericBox.max;
            }
            const ratio: number = width / this.documentEditor.selectionModule.imageFormat.width;
            const height: number = this.heightNumericBox.value * ratio;
            this.heightNumericBox.value = height;
            if (!(width === null || height === null)) {
                this.documentEditor.selectionModule.imageFormat.resize(width, height);
            }
        }
    }
    private applyImageHeight(): void {
        if (!this.isMaintainAspectRatio) {
            const width: number = this.widthNumericBox.value;
            const height: number = this.heightNumericBox.value;
            if (!(width === null || height === null)) {
                this.documentEditor.selectionModule.imageFormat.resize(width, height);
            }
        } else if (this.isMaintainAspectRatio) {
            const height: number = this.heightNumericBox.value;
            const ratio: number = height / this.documentEditor.selectionModule.imageFormat.height;
            const width: number = this.widthNumericBox.value * ratio;
            this.widthNumericBox.value = width;
            if (!(width === null || height === null)) {
                this.documentEditor.selectionModule.imageFormat.resize(width, height);
            }
        }
    }
    private onAspectRatioBtnClick(): void {
        if (this.isMaintainAspectRatio) {
            this.isMaintainAspectRatio = false;
        } else {
            this.isMaintainAspectRatio = true;
        }
    }
    public showImageProperties(isShow: boolean): void {
        if (this.element.style.display === 'block') {
            this.updateImageProperties();
        }
        if (!isShow && this.element.style.display === 'none' || (isShow && this.element.style.display === 'block')) {
            return;
        }
        this.element.style.display = isShow ? 'block' : 'none';
        this.documentEditor.resize();
    }
    public updateImageProperties(): void {
        this.widthNumericBox.value = this.documentEditor.selectionModule.imageFormat.width;
        this.heightNumericBox.value = this.documentEditor.selectionModule.imageFormat.height;
        if (isNullOrUndefined(this.documentEditor.selectionModule.imageFormat.alternateText))
        {
            (this.textArea as HTMLInputElement).value = '';
        }
        else
        {
            (this.textArea as HTMLInputElement).value = this.documentEditor.selectionModule.imageFormat.alternateText;
        }
    }
    public destroy(): void {
        this.unWireEvents();
        this.removeHTMLDom();

        if (this.widthNumericBox) {
            this.widthNumericBox.destroy();
        }
        this.widthNumericBox = undefined;
        if (this.heightNumericBox) {
            this.heightNumericBox.destroy();
        }
        this.heightNumericBox = undefined;
        if (this.aspectRatioBtn) {
            this.aspectRatioBtn.destroy();
        }
        this.aspectRatioBtn = undefined;
        if (this.textareaObj) {
            this.textareaObj.destroy();
            this.textArea.remove();
            this.textArea = undefined;
        }
        if (this.element) {
            this.element.innerHTML = '';
            this.element = undefined;
        }
        this.container = undefined;
    }
    private removeHTMLDom(): void {
        this.outerDiv.remove();
        this.label.remove();
        this.imageDiv.remove();
        this.aspectRatioDiv.remove();
        this.aspectRatio.remove();
        this.alabel.remove();
        this.textArea.remove();
        this.altDiv.remove();
        this.element.remove();
    }
    private unWireEvents(): void {
        this.aspectRatioBtn.element.removeEventListener('change', this.onAspectRatioBtnClickHook);
        this.widthNumericBox.element.removeEventListener('click', this.widthBlurHook);
        this.heightNumericBox.element.removeEventListener('click', this.heightBlurHook);
        this.widthNumericBox.element.removeEventListener('keydown', this.onImageWidthHook);
        this.heightNumericBox.element.removeEventListener('keydown', this.onImageHeightHook);
        this.widthNumericBox.element.removeEventListener('blur', this.widthNumericBlurHook);
        this.heightNumericBox.element.removeEventListener('blur', this.heightNumericBlurHook);
        this.textArea.removeEventListener('blur', this.altTextAreaBlurHook);

        this.onAspectRatioBtnClickHook = undefined;
        this.widthBlurHook = undefined;
        this.heightBlurHook = undefined;
        this.onImageWidthHook = undefined;
        this.onImageHeightHook = undefined;
        this.widthNumericBlurHook = undefined;
        this.heightNumericBlurHook = undefined;
        this.altTextAreaBlurHook = undefined;
    }
}
