import { createElement, KeyboardEventArgs, L10n, classList } from '@syncfusion/ej2-base';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { DocumentEditorContainer } from '../document-editor-container';
import { DocumentEditor } from '../../document-editor/document-editor';
/**
 * Image Property pane
 * @private
 */
export class ImageProperties {
    private container: DocumentEditorContainer;
    private elementId: string;
    public element: HTMLElement;
    private widthElement: HTMLElement;
    private heightElement: HTMLElement;
    private widthNumericBox: NumericTextBox;
    private heightNumericBox: NumericTextBox;
    private aspectRatioBtn: CheckBox;
    private isMaintainAspectRatio: boolean;
    private isWidthApply: boolean = false;
    private isHeightApply: boolean = false;
    private isRtl: boolean;

    get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }

    constructor(container: DocumentEditorContainer, isRtl?: boolean) {
        this.container = container;
        this.elementId = this.documentEditor.element.id;
        this.isMaintainAspectRatio = false;
        this.isRtl = isRtl;
        this.initializeImageProperties();
    }
    /**
     * @private
     */
    public enableDisableElements(enable: boolean): void {
        if (enable) {
            classList(this.element, [], ['e-de-overlay']);
        } else {
            classList(this.element, ['e-de-overlay'], []);
        }
    }
    private initializeImageProperties = (): void => {
        // tslint:disable-next-line:max-line-length
        this.element = createElement('div', { id: this.elementId + '_imageProperties', className: 'e-de-prop-pane' });
        this.element.style.display = 'none';
        this.container.propertiesPaneContainer.appendChild(this.element);
        this.initImageProp();
        this.wireEvents();
    }

    private initImageProp = (): void => {
        let localObj: L10n = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        // tslint:disable-next-line:max-line-length
        let imageDiv: HTMLElement = createElement('div', { id: this.elementId + '_imageDiv', className: 'e-de-cntr-pane-padding', styles: 'border:0px' });
        this.element.appendChild(imageDiv);
        let label: HTMLElement = createElement('label', { className: 'e-de-ctnr-prop-label' });
        label.textContent = localObj.getConstant('Image');
        imageDiv.appendChild(label);
        let outerDiv: HTMLElement = createElement('div');
        imageDiv.appendChild(outerDiv);
        // tslint:disable-next-line:max-line-length
        this.widthElement = this.createImagePropertiesDiv('_widthDiv', outerDiv, '_widthInput', localObj.getConstant('W'), localObj.getConstant('Width'));
        // tslint:disable-next-line:max-line-length
        this.widthNumericBox = new NumericTextBox({ min: 0, max: 23500, cssClass: 'e-de-image-property', showSpinButton: false, format: 'n0', decimals: 2 });
        this.widthNumericBox.appendTo(this.widthElement);
        // tslint:disable-next-line:max-line-length
        this.heightElement = this.createImagePropertiesDiv('_heightDiv', outerDiv, '_heightInput', localObj.getConstant('H'), localObj.getConstant('Height'));
        // tslint:disable-next-line:max-line-length
        this.heightNumericBox = new NumericTextBox({ min: 0, max: 23500, cssClass: 'e-de-image-property', showSpinButton: false, format: 'n0', decimals: 2 });
        this.heightNumericBox.appendTo(this.heightElement);
        // tslint:disable-next-line:max-line-length        
        let aspectRatioDiv: HTMLElement = createElement('div', { id: this.elementId + '_aspectRatioDiv' });
        aspectRatioDiv.setAttribute('title', localObj.getConstant('Aspect ratio'));
        outerDiv.appendChild(aspectRatioDiv);
        // tslint:disable-next-line:max-line-length
        let aspectRatio: HTMLInputElement = createElement('input', { id: this.elementId + '_aspectRatio', className: 'e-de-ctnr-prop-label' }) as HTMLInputElement;
        aspectRatioDiv.appendChild(aspectRatio);
        this.aspectRatioBtn = new CheckBox({ label: localObj.getConstant('Aspect ratio'), enableRtl: this.isRtl }, aspectRatio);
    }
    // tslint:disable-next-line:max-line-length
    private createImagePropertiesDiv = (id: string, outerDiv: HTMLElement, inputId: string, spanContent: string, tooltip: string): HTMLElement => {
        // tslint:disable-next-line:max-line-length
        let divElement: HTMLElement = createElement('div', { id: this.elementId + id, styles: 'position: relative;width: 100%;', className: 'e-de-ctnr-segment' });
        divElement.setAttribute('title', tooltip);
        outerDiv.appendChild(divElement);
        // tslint:disable-next-line:max-line-length
        let inputElement: HTMLElement = createElement('input', { id: this.elementId + inputId, className: 'e-textbox', styles: 'width:100%;' });
        divElement.appendChild(inputElement);
        let spanElement: HTMLElement = createElement('span', { className: 'e-de-img-prty-span' });
        spanElement.textContent = spanContent;
        divElement.appendChild(spanElement);
        return inputElement;
    }
    public wireEvents = (): void => {
        this.aspectRatioBtn.element.addEventListener('change', this.onAspectRatioBtnClick);
        this.widthNumericBox.element.addEventListener('click', (): void => { this.isWidthApply = true; });
        this.heightNumericBox.element.addEventListener('click', (): void => { this.isHeightApply = true; });
        this.widthNumericBox.element.addEventListener('keydown', this.onImageWidth);
        this.heightNumericBox.element.addEventListener('keydown', this.onImageHeight);
        this.widthNumericBox.element.addEventListener('blur', (): void => { this.applyImageWidth(); this.isWidthApply = false; });
        this.heightNumericBox.element.addEventListener('blur', (): void => { this.applyImageHeight(); this.isHeightApply = false; });
    }
    private onImageWidth = (e: KeyboardEventArgs): void => {
        if (e.keyCode === 13) {
            setTimeout((): void => { this.applyImageWidth(); this.isWidthApply = false; }, 30);
        }
    }
    private onImageHeight = (e: KeyboardEventArgs): void => {
        if (e.keyCode === 13) {
            setTimeout((): void => { this.applyImageHeight(); this.isHeightApply = false; }, 30);
        }
    }
    private applyImageWidth = (): void => {
        if (!this.isMaintainAspectRatio) {
            // tslint:disable-next-line:max-line-length
            let width: number = this.widthNumericBox.value;
            let height: number = this.heightNumericBox.value;
            if (width > this.widthNumericBox.max) {
                width = this.widthNumericBox.max;
            }
            if (height > this.heightNumericBox.max) {
                height = this.heightNumericBox.max;
            }
            if (!(width === null || height === null)) {
                this.documentEditor.selection.imageFormat.resize(width, height);
            }
        } else if (this.isMaintainAspectRatio) {
            // tslint:disable-next-line:max-line-length
            let width: number = this.widthNumericBox.value;
            if (width > this.widthNumericBox.max) {
                width = this.widthNumericBox.max;
            }
            let ratio: number = width / this.documentEditor.selection.imageFormat.width;
            let height: number = this.heightNumericBox.value * ratio;
            this.heightNumericBox.value = height;
            if (!(width === null || height === null)) {
                this.documentEditor.selection.imageFormat.resize(width, height);
            }
        }
    }
    private applyImageHeight = (): void => {
        if (!this.isMaintainAspectRatio) {
            // tslint:disable-next-line:max-line-length
            let width: number = this.widthNumericBox.value;
            let height: number = this.heightNumericBox.value;
            if (!(width === null || height === null)) {
                this.documentEditor.selection.imageFormat.resize(width, height);
            }
        } else if (this.isMaintainAspectRatio) {
            // tslint:disable-next-line:max-line-length
            let height: number = this.heightNumericBox.value;
            let ratio: number = height / this.documentEditor.selection.imageFormat.height;
            let width: number = this.widthNumericBox.value * ratio;
            this.widthNumericBox.value = width;
            if (!(width === null || height === null)) {
                this.documentEditor.selection.imageFormat.resize(width, height);
            }
        }
    }
    private onAspectRatioBtnClick = (): void => {
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
        this.widthNumericBox.value = this.documentEditor.selection.imageFormat.width;
        this.heightNumericBox.value = this.documentEditor.selection.imageFormat.height;
    }
    public destroy(): void {
        this.container = undefined;
        if (this.widthNumericBox) {
            this.widthNumericBox.destroy();
            this.widthNumericBox = undefined;
        }
        if (this.heightNumericBox) {
            this.heightNumericBox.destroy();
            this.heightNumericBox = undefined;
        }
    }
}