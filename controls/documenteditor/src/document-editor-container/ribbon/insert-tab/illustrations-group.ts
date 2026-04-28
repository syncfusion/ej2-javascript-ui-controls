import { RibbonGroupModel } from '@syncfusion/ej2-ribbon';
import { RibbonGroupBase } from '../ribbon-interfaces';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { createElement, Browser, EventHandler } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../document-editor-container';

export const IMAGE_LOCAL_ID: string = '_image_local';
/**
 * Illustrations group implementation for Insert tab
 * @private
 */
export class IllustrationsGroup extends RibbonGroupBase {
    private imagePicker: HTMLInputElement;

    /**
     * Constructor for IllustrationsGroup
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        super(container);

        // Create image picker for file upload
        this.imagePicker = createElement('input', {
            attrs: { type: 'file', accept: '.jpg,.jpeg,.png,.bmp,.svg' },
            className: 'e-de-ctnr-file-picker'
        }) as HTMLInputElement;

        if (Browser.isIE) {
            document.body.appendChild(this.imagePicker);
        }

        // Add event handler for image selection
        EventHandler.add(this.imagePicker, 'change', this.onImageChange, this);
    }

    /**
     * Get the Ribbon items for Illustrations group
     * @returns {RibbonGroupModel} - Ribbon group model for Illustrations group
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            header: this.localObj.getConstant('Illustrations'),
            groupIconCss: 'e-icons e-de-ctnr-image',
            keyTip: 'P',
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Illustrations'),
            collections: [{
                items: [{
                    type: 'DropDown',
                    keyTip: 'U',
                    dropDownSettings: {
                        content: this.localObj.getConstant('Image'),
                        iconCss: 'e-icons e-de-ctnr-image',

                        items: [
                            {
                                text: this.localObj.getConstant('Upload from computer'),
                                id: this.ribbonId + IMAGE_LOCAL_ID,
                                iconCss: 'e-icons e-de-ctnr-upload'
                            }
                        ],
                        select: this.onImageDropDownSelect.bind(this)
                    },
                    id: this.ribbonId + '_image',
                    ribbonTooltipSettings: {
                        content: this.localObj.getConstant('Insert inline picture from a file')
                    }
                }]
            }]
        };
    }


    private onImageDropDownSelect(args: MenuEventArgs): void {
        const id: string = args.item.id;
        if (id === this.ribbonId + IMAGE_LOCAL_ID) {
            this.imageClickHandler();
        }
    }


    private imageClickHandler(): void {
        this.imagePicker.value = '';
        this.imagePicker.click();
    }


    private onImageChange(): void {
        const file: Blob = this.imagePicker.files[0];
        if (!file) {
            return;
        }

        const fileReader: FileReader = new FileReader();
        fileReader.onload = () => {
            this.insertImage(fileReader.result as string);
        };
        fileReader.readAsDataURL(file);
    }

    private insertImage(data: string): void {
        const image: HTMLImageElement = document.createElement('img');
        const container: DocumentEditorContainer = this.container;
        image.addEventListener('load', function (): void {
            container.documentEditor.editorModule.insertImageInternal(data, true, this.width, this.height, this.alt);
        });
        image.src = data;
    }

    /**
     * Clean up resources
     * @returns {void}
     */
    public destroy(): void {
        // Remove event listeners
        if (this.imagePicker) {
            EventHandler.remove(this.imagePicker, 'change', this.onImageChange);

            // Clean up DOM elements
            if (this.imagePicker.parentElement) {
                this.imagePicker.parentElement.removeChild(this.imagePicker);
            }

            this.imagePicker = undefined;
        }

        // Clear all references
        this.container = undefined;
        this.localObj = undefined;
    }
}
