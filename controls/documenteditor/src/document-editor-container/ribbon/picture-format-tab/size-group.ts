import { L10n, createElement, EventHandler } from '@syncfusion/ej2-base';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel, RibbonItemSize, RibbonItemType } from '@syncfusion/ej2-ribbon';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';
import { SelectionImageFormat } from '../../../document-editor/implementation/selection/selection-format';

// Constants for UI element IDs
export const SIZE_GROUP: string = '_size_group';
export const WIDTH_BOX_ID: string = '_width_box';
export const HEIGHT_BOX_ID: string = '_height_box';
export const ASPECT_RATIO_ID: string = '_aspect_ratio';

/**
 * Size group implementation for Picture Format tab
 * @private
 */
export class SizeGroup {
    private container: DocumentEditorContainer;
    private localObj: L10n;
    private isMaintainAspectRatio: boolean = false;
    private widthNumericBox: NumericTextBox;
    private heightNumericBox: NumericTextBox;
    private aspectRatioBtn: CheckBox;
    private templateContainer: HTMLElement;
    public isInitialized: boolean = false;

    /**
     * Constructor for SizeGroup class
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        this.isInitialized = false;

        // Create a hidden container for templates
        this.templateContainer = createElement('div', {
            styles: 'position: absolute; visibility: hidden; height: 0; width: 0; overflow: hidden;'
        });
        document.body.appendChild(this.templateContainer);

        // Create template elements
        this.createWidthTemplate();
        this.createHeightTemplate();
    }

    /**
     * Get the Ribbon items for Size group
     * @returns {RibbonGroupModel} - Ribbon group model for Size group
     * @private
     */
    public getSizeGroup(): RibbonGroupModel {
        const id: string = this.container.element.id + '_pictureformat';
        return {
            header: this.localObj.getConstant('Size'),
            id: id + SIZE_GROUP,
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Size'),
            collections: [
                {
                    items: [
                        {
                            keyTip: 'W',
                            type: RibbonItemType.Template,
                            allowedSizes: RibbonItemSize.Small,
                            itemTemplate: '#' + this.container.element.id + RIBBON_ID + '_pictureformat_width',
                            ribbonTooltipSettings: {
                                title: this.localObj.getConstant('Width'),
                                content: this.localObj.getConstant('Adjust image width')
                            }
                        },
                        {
                            keyTip: 'H',
                            type: RibbonItemType.Template,
                            itemTemplate: '#' + this.container.element.id + RIBBON_ID + '_pictureformat_height',
                            ribbonTooltipSettings: {
                                title: this.localObj.getConstant('Height'),
                                content: this.localObj.getConstant('Adjust image height')
                            }
                        },
                        {
                            type: RibbonItemType.CheckBox,
                            keyTip: 'X',
                            checkBoxSettings: {
                                label: this.localObj.getConstant('Aspect ratio'),
                                checked: false,
                                change: this.onAspectRatioBtnClick.bind(this)
                            },
                            id: id + ASPECT_RATIO_ID,
                            ribbonTooltipSettings: {
                                title: this.localObj.getConstant('Aspect Ratio'),
                                content: this.localObj.getConstant('Maintain aspect ratio when resizing')
                            }
                        }
                    ]
                }
            ]
        };
    }

    private createWidthTemplate(): void {
        const script: HTMLScriptElement = document.createElement('script');
        script.id = this.container.element.id + RIBBON_ID + '_pictureformat_width';
        script.setAttribute('type', 'text/x-template');

        script.innerHTML = `
        <div class="e-de-ctnr-picture-ribbon-segment e-de-ctnr-picture-format-tab"
            title="${this.localObj.getConstant('Width')}">
            <div class="e-de-picture-label-container">
                <span class="e-de-ribbon-property-label">${this.localObj.getConstant('Width')}:</span>
            </div>
            <input id="${this.container.element.id + WIDTH_BOX_ID}" class="e-textbox" />
        </div>
    `;

        document.head.appendChild(script);

        // Register numeric textbox for initialization
        this.container.ribbon.numericTextBoxCollection.add(this.container.element.id + WIDTH_BOX_ID, 'pictureFormatTab');
    }


    private createHeightTemplate(): void {
        const script: HTMLScriptElement = document.createElement('script');
        script.id = this.container.element.id + RIBBON_ID + '_pictureformat_height';
        script.setAttribute('type', 'text/x-template');

        script.innerHTML = `
            <div class="e-de-ctnr-picture-ribbon-segment e-de-ctnr-picture-format-tab" 
                title="${this.localObj.getConstant('Height')}">
                <div class="e-de-picture-label-container">
                    <span class="e-de-ribbon-property-label">${this.localObj.getConstant('Height')}:</span>
                </div>
                <input id="${this.container.element.id + HEIGHT_BOX_ID}" class="e-textbox"/>
            </div>
        `;


        document.head.appendChild(script);

        // Register numeric textbox for initialization
        this.container.ribbon.numericTextBoxCollection.add(this.container.element.id + HEIGHT_BOX_ID, 'pictureFormatTab');
    }

    /**
     * Initializes the NumericTextBox instances
     * @returns {void}
     * @private
     */
    public initializeNumericTextBoxes(): void {
        if (this.isInitialized) {
            return;
        }
        this.isInitialized = true;
        this.initializeWidthNumericBox();
        this.initializeHeightNumericBox();
    }


    private initializeWidthNumericBox(): void {
        const element: HTMLElement = document.getElementById(this.container.element.id + WIDTH_BOX_ID);
        if (!element) {
            return;
        }

        this.widthNumericBox = new NumericTextBox({
            min: 0,
            max: 23500,
            value: 0,
            showSpinButton: false,
            format: 'n0',
            decimals: 2,
            width: '100px',
            change: this.onWidthChange.bind(this)
        });
        this.widthNumericBox.appendTo(element);

        element.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                setTimeout(() => {
                    this.applyImageWidth();
                }, 30);
            }
        });
        element.addEventListener('blur', this.applyImageWidth.bind(this));
    }


    private initializeHeightNumericBox(): void {
        const element: HTMLElement = document.getElementById(this.container.element.id + HEIGHT_BOX_ID);
        if (!element) {
            return;
        }

        this.heightNumericBox = new NumericTextBox({
            min: 0,
            max: 23500,
            value: 0,
            showSpinButton: false,
            format: 'n0',
            decimals: 2,
            width: '100px',
            change: this.onHeightChange.bind(this)
        });
        this.heightNumericBox.appendTo(element);

        element.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                setTimeout(() => {
                    this.applyImageHeight();
                }, 30);
            }
        });
        element.addEventListener('blur', this.applyImageHeight.bind(this));
    }

    private onWidthChange(): void {
        this.applyImageWidth();
    }


    private onHeightChange(): void {
        this.applyImageHeight();
    }


    private onAspectRatioBtnClick(args: any): void {
        this.isMaintainAspectRatio = args.checked;
    }

    /**
     * Updates the size property controls with current image properties
     * @returns {void}
     * @private
     */
    public updateSizeProperties(): void {
        const imageFormat: SelectionImageFormat = this.container.documentEditor.selectionModule.imageFormat;
        if (this.widthNumericBox && this.heightNumericBox) {
            this.widthNumericBox.value = imageFormat.width;
            this.heightNumericBox.value = imageFormat.height;
        }
    }

    /**
     * Applies the width value to the selected image
     * @returns {void}
     * @private
     */
    public applyImageWidth(): void {
        if (!this.widthNumericBox || !this.heightNumericBox) {
            return;
        }

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
                this.container.documentEditor.selectionModule.imageFormat.resize(width, height);
            }
        } else if (this.isMaintainAspectRatio) {
            let width: number = this.widthNumericBox.value;
            if (width > this.widthNumericBox.max) {
                width = this.widthNumericBox.max;
            }
            const imageFormat: SelectionImageFormat = this.container.documentEditor.selectionModule.imageFormat;
            const ratio: number = width / imageFormat.width;
            const height: number = this.heightNumericBox.value * ratio;
            this.heightNumericBox.value = height;
            if (!(width === null || height === null)) {
                imageFormat.resize(width, height);
            }
        }
    }


    private applyImageHeight(): void {
        if (!this.widthNumericBox || !this.heightNumericBox) {
            return;
        }

        if (!this.isMaintainAspectRatio) {
            const width: number = this.widthNumericBox.value;
            const height: number = this.heightNumericBox.value;
            if (!(width === null || height === null)) {
                this.container.documentEditor.selectionModule.imageFormat.resize(width, height);
            }
        } else if (this.isMaintainAspectRatio) {
            const height: number = this.heightNumericBox.value;
            const imageFormat: SelectionImageFormat = this.container.documentEditor.selectionModule.imageFormat;
            const ratio: number = height / imageFormat.height;
            const width: number = this.widthNumericBox.value * ratio;
            this.widthNumericBox.value = width;
            if (!(width === null || height === null)) {
                imageFormat.resize(width, height);
            }
        }
    }
    /**
     * Resets the initialization state to allow re-initialization after layout changes
     * @returns {void}
     * @private
     */
    public resetInitializationState(): void {
        this.isInitialized = false;

        // Clean up existing instances if they exist before re-initialization
        if (this.widthNumericBox) {
            this.widthNumericBox.destroy();
            this.widthNumericBox = undefined;
        }

        if (this.heightNumericBox) {
            this.heightNumericBox.destroy();
            this.heightNumericBox = undefined;
        }
    }
    /**
     * Clean up resources when destroyed
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.isInitialized = false;

        // Destroy UI components
        if (this.widthNumericBox) {
            // Remove event listeners from the input element
            const widthElement: HTMLElement = document.getElementById(this.container.element.id + WIDTH_BOX_ID);
            if (widthElement) {
                EventHandler.clearEvents(widthElement);
            }

            this.widthNumericBox.destroy();
            this.widthNumericBox = undefined;
        }

        if (this.heightNumericBox) {
            // Remove event listeners from the input element
            const heightElement: HTMLElement = document.getElementById(this.container.element.id + HEIGHT_BOX_ID);
            if (heightElement) {
                EventHandler.clearEvents(heightElement);
            }

            this.heightNumericBox.destroy();
            this.heightNumericBox = undefined;
        }

        if (this.aspectRatioBtn) {
            this.aspectRatioBtn.destroy();
            this.aspectRatioBtn = undefined;
        }

        // Remove template elements
        const elementsToRemove: HTMLElement[] = [
            document.getElementById(this.container.element.id + RIBBON_ID + '_pictureformat_width'),
            document.getElementById(this.container.element.id + RIBBON_ID + '_pictureformat_height')
        ];

        elementsToRemove.forEach((element: HTMLElement) => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });

        if (this.templateContainer && this.templateContainer.parentNode) {
            this.templateContainer.parentNode.removeChild(this.templateContainer);
            this.templateContainer = undefined;
        }

        // Clear all references
        this.container = undefined;
        this.localObj = undefined;
    }
}
