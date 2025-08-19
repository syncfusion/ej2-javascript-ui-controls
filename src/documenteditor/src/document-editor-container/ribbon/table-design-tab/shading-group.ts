import { L10n } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel, RibbonItemType, RibbonItemModel, RibbonItemSize } from '@syncfusion/ej2-ribbon';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';
import {
    SHADING_GROUP_ID,
    SHADING_COLOR_PICKER_ID
} from './constants';
import { ColorPicker, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
export const SHADING_BUTTON_ID: string = '_SHADING_BUTTON';

/**
 * ShadingGroup class provides the shading options for table design
 * @private
 */
export class ShadingGroup {
    private container: DocumentEditorContainer;
    private localObj: L10n;
    private commonID: string;
    private colorPickerId: string;
    private shadingButtonId: string;
    private currentShadingColor: string = '#ffffff';
    private colorPickerElement: HTMLElement;
    private colorPicker: ColorPicker;

    /**
     * Constructor for the ShadingGroup class
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.localObj = this.container.localObj;
        this.commonID = this.container.element.id + RIBBON_ID;
        this.colorPickerId = this.commonID + SHADING_COLOR_PICKER_ID;
        this.shadingButtonId = this.commonID + SHADING_BUTTON_ID;

        // Create color picker element once
        this.createColorPickerElement();
    }

    /**
     * Create the Shading group configuration
     * @returns {void}
     */
    private createColorPickerElement(): void {
        // Create a hidden div for the color picker
        this.colorPickerElement = document.createElement('div');
        this.colorPickerElement.id = this.commonID + '_cellShadingColorPickerContainer';
        this.colorPickerElement.style.display = 'none';

        // Create the input element for the color picker
        const colorPickerInput: HTMLInputElement = document.createElement('input');
        colorPickerInput.id = this.commonID + '_cellShadingColorPicker';
        colorPickerInput.type = 'color';

        this.colorPickerElement.appendChild(colorPickerInput);
        document.body.appendChild(this.colorPickerElement);

        // Initialize the color picker with inline mode
        this.colorPicker = new ColorPicker({
            inline: true,
            value: this.currentShadingColor,
            change: (args: ColorPickerEventArgs) => {
                this.currentShadingColor = args.currentValue.hex;
                this.applyShadingColor(this.currentShadingColor);
            },
            open: () => {
                // Focus back to document editor after color picker is closed
                this.container.documentEditor.focusIn();
            }, beforeClose: () => {
                // Handle any cleanup before closing
                return true; // Return true to allow closing
            },

            cssClass: 'e-cell-shading-picker'
        }, '#' + this.commonID + '_cellShadingColorPicker');
    }

    /**
     * Gets the Shading group configuration
     * @returns {RibbonGroupModel} - The Shading group configuration
     * @private
     */
    public getShadingGroup(): RibbonGroupModel {
        return {
            id: this.commonID + SHADING_GROUP_ID,
            header: this.localObj.getConstant('Cell'),
            orientation: 'Row',
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Cell'),
            collections: [
                {
                    items: [
                        this.getShadingSplitButton()
                    ]
                }
            ]
        };
    }

    /**
     * Gets the Shading Split Button configuration with color picker dropdown
     * @returns {RibbonItemModel} - The Shading Split Button configuration
     * @private
     */
    private getShadingSplitButton(): RibbonItemModel {
        return {
            type: RibbonItemType.SplitButton,
            id: this.shadingButtonId,
            allowedSizes: RibbonItemSize.Large,
            splitButtonSettings: {
                iconCss: 'e-icons e-de-ctnr-paint-bucket',
                content: this.localObj.getConstant('Shading'),
                target: '.e-cell-shading-picker',
                // select: (args: MenuEventArgs) => {
                //     if (args.item && args.item.id === this.colorPickerId) {
                //         this.showColorPicker();
                //     }
                // },
                click: () => {
                    // Apply the current color on direct button click
                    this.applyShadingColor(this.currentShadingColor);
                },
                beforeOpen: () => {
                    // Ensure current selection properties are reflected
                    // this.showColorPicker();
                }
            },
            ribbonTooltipSettings: {
                content: this.localObj.getConstant('Fill color')
            }
        };
    }

    /**
     * Shows the color picker dialog
     * @returns {void}
     * @private
     */
    public showColorPicker(): void {
        // Get the input element

        // Update the color picker value
        this.colorPicker.value = this.currentShadingColor;

    }

    /**
     * Applies the shading color to the selected table or cells
     * @param {string} color - The color to apply as shading
     * @returns {void}
     */
    private applyShadingColor(color: string): void {
        if (this.container.documentEditor.selection) {
            this.container.documentEditor.selection.cellFormat.background = color;
            this.currentShadingColor = color;
        }
        const colorPopupElement: HTMLElement = document.getElementById(this.container.element.id + RIBBON_ID + '_SHADING_BUTTON_dropdownbtn-popup');
        if (colorPopupElement) {
            colorPopupElement.style.display = 'none';
        }
    }
    /**
     * Updates the shading color to reflect the current selection
     * @returns {void}
     * @private
     */
    public updateShadingColor(): void {
        if (this.container.documentEditor.selection) {
            // Update shading color if a cell is selected
            if (this.container.documentEditor.selection.contextType === 'TableText' ||
                this.container.documentEditor.selection.contextType === 'TableImage') {
                const currentBackground: string = this.container.documentEditor.selection.cellFormat.background;

                if (currentBackground) {
                    this.currentShadingColor = currentBackground;
                }
            }
        }
    }

    /**
     * Clean up resources when destroyed
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Destroy the ColorPicker component first
        if (this.colorPicker) {
            this.colorPicker.destroy();
            this.colorPicker = undefined;
        }

        // Clean up the color picker element
        if (this.colorPickerElement && this.colorPickerElement.parentNode) {
            this.colorPickerElement.parentNode.removeChild(this.colorPickerElement);
            this.colorPickerElement = undefined;
        }

        this.container = undefined;
        this.localObj = undefined;
    }
}
