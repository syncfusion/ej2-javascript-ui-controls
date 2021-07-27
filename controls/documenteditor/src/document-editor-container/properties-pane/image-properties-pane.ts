import { createElement, KeyboardEventArgs, L10n, classList } from '@syncfusion/ej2-base';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { DocumentEditorContainer } from '../document-editor-container';
import { DocumentEditor } from '../../document-editor/document-editor';
/**
 * Image Property pane
 *
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
        this.wireEvents();
    }

    private initImageProp(): void {
        const localObj: L10n = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        const imageDiv: HTMLElement = createElement('div', { id: this.elementId + '_imageDiv', className: 'e-de-cntr-pane-padding', styles: 'border:0px' });
        this.element.appendChild(imageDiv);
        const label: HTMLElement = createElement('label', { className: 'e-de-ctnr-prop-label' });
        label.textContent = localObj.getConstant('Image');
        imageDiv.appendChild(label);
        const outerDiv: HTMLElement = createElement('div');
        imageDiv.appendChild(outerDiv);
        this.widthElement = this.createImagePropertiesDiv('_widthDiv', outerDiv, '_widthInput', localObj.getConstant('W'), localObj.getConstant('Width'));
        this.widthNumericBox = new NumericTextBox({ min: 0, max: 23500, cssClass: 'e-de-image-property', showSpinButton: false, format: 'n0', decimals: 2 });
        this.widthNumericBox.appendTo(this.widthElement);
        this.heightElement = this.createImagePropertiesDiv('_heightDiv', outerDiv, '_heightInput', localObj.getConstant('H'), localObj.getConstant('Height'));
        this.heightNumericBox = new NumericTextBox({ min: 0, max: 23500, cssClass: 'e-de-image-property', showSpinButton: false, format: 'n0', decimals: 2 });
        this.heightNumericBox.appendTo(this.heightElement);
        const aspectRatioDiv: HTMLElement = createElement('div', { id: this.elementId + '_aspectRatioDiv' });
        aspectRatioDiv.setAttribute('title', localObj.getConstant('Aspect ratio'));
        outerDiv.appendChild(aspectRatioDiv);
        const aspectRatio: HTMLInputElement = createElement('input', { id: this.elementId + '_aspectRatio', className: 'e-de-ctnr-prop-label' }) as HTMLInputElement;
        aspectRatioDiv.appendChild(aspectRatio);
        this.aspectRatioBtn = new CheckBox({ label: localObj.getConstant('Aspect ratio'), enableRtl: this.isRtl }, aspectRatio);
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
        this.aspectRatioBtn.element.addEventListener('change', this.onAspectRatioBtnClick.bind(this));
        this.widthNumericBox.element.addEventListener('click', (): void => {
            this.isWidthApply = true;
        });
        this.heightNumericBox.element.addEventListener('click', (): void => {
            this.isHeightApply = true;
        });
        this.widthNumericBox.element.addEventListener('keydown', this.onImageWidth.bind(this));
        this.heightNumericBox.element.addEventListener('keydown', this.onImageHeight.bind(this));
        this.widthNumericBox.element.addEventListener('blur', (): void => {
            this.applyImageWidth(); this.isWidthApply = false;
        });
        this.heightNumericBox.element.addEventListener('blur', (): void => {
            this.applyImageHeight(); this.isHeightApply = false;
        });
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
                this.documentEditor.selection.imageFormat.resize(width, height);
            }
        } else if (this.isMaintainAspectRatio) {
            let width: number = this.widthNumericBox.value;
            if (width > this.widthNumericBox.max) {
                width = this.widthNumericBox.max;
            }
            const ratio: number = width / this.documentEditor.selection.imageFormat.width;
            const height: number = this.heightNumericBox.value * ratio;
            this.heightNumericBox.value = height;
            if (!(width === null || height === null)) {
                this.documentEditor.selection.imageFormat.resize(width, height);
            }
        }
    }
    private applyImageHeight(): void {
        if (!this.isMaintainAspectRatio) {
            const width: number = this.widthNumericBox.value;
            const height: number = this.heightNumericBox.value;
            if (!(width === null || height === null)) {
                this.documentEditor.selection.imageFormat.resize(width, height);
            }
        } else if (this.isMaintainAspectRatio) {
            const height: number = this.heightNumericBox.value;
            const ratio: number = height / this.documentEditor.selection.imageFormat.height;
            const width: number = this.widthNumericBox.value * ratio;
            this.widthNumericBox.value = width;
            if (!(width === null || height === null)) {
                this.documentEditor.selection.imageFormat.resize(width, height);
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
