import { L10n, createElement, remove } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../document-editor-container';
import { BorderType, DocumentEditor } from '../../../document-editor/index';
import { RibbonGroupModel, RibbonItemType, RibbonItemModel, RibbonItemSize } from '@syncfusion/ej2-ribbon';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';
import { ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import {
    BORDERS_SHADING_GROUP_ID,
    BORDERS_DROPDOWN_ID,
    BORDER_COLOR_PICKER_ID,
    BORDER_WIDTH_DROPDOWN_ID
} from './constants';
import { BordersHelper } from '../../helper/borders-helper';
import { SelectEventArgs } from '@syncfusion/ej2-dropdowns';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';

/**
 * BordersGroup class provides the borders and shading options for table design
 * @private
 */
export class BordersGroup {
    private container: DocumentEditorContainer;
    private localObj: L10n;
    private commonID: string;
    private borderColor: string = '#000000';
    private borderWidth: string = '1px';
    private templateContainer: HTMLElement;
    private borderDropdown: DropDownButton;
    private widthOptions: HTMLElement;

    /**
     * Constructor for the BordersGroup class
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.localObj = this.container.localObj;
        this.commonID = this.container.element.id + RIBBON_ID;

        // Create a hidden container for templates
        this.templateContainer = createElement('div', {
            styles: 'position: absolute; visibility: hidden; height: 0; width: 0; overflow: hidden;'
        });
        document.body.appendChild(this.templateContainer);
    }

    /**
     * Gets the Borders group configuration
     * @returns {RibbonGroupModel} RibbonGroupModel for the Borders group
     */
    public getBordersGroup(): RibbonGroupModel {
        return {
            id: this.commonID + BORDERS_SHADING_GROUP_ID,
            header: this.localObj.getConstant('Borders'),
            showLauncherIcon: true,
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Borders'),
            collections: [
                {
                    items: [
                        this.getBordersDropdown()
                    ]
                },
                {
                    items: [
                        this.getBorderColorPicker(),
                        this.getBorderWidthDropdown()
                    ]
                }
            ]
        };
    }

    /**
     * Gets the Borders dropdown configuration
     * @returns {RibbonItemModel} RibbonItemModel for the Borders dropdown
     */
    private getBordersDropdown(): RibbonItemModel {
        return {
            type: RibbonItemType.DropDown,
            id: this.commonID + BORDERS_DROPDOWN_ID,
            keyTip: 'B',
            dropDownSettings: {
                content: this.localObj.getConstant('Borders'),
                iconCss: 'e-icons e-de-ctnr-allborders',
                items: BordersHelper.getBorderDropdownItems(this.localObj, this.commonID),
                select: (args: SelectEventArgs) => {
                    this.applyBorder((args.item as any).text);
                }
            },
            ribbonTooltipSettings: {
                content: this.localObj.getConstant('Table Borders')
            }
        };
    }

    /**
     * Gets the Border Color Picker configuration
     * @returns {RibbonItemModel} RibbonItemModel for the Border Color Picker
     */
    private getBorderColorPicker(): RibbonItemModel {
        return {
            type: RibbonItemType.ColorPicker,
            keyTip: 'C',
            id: this.commonID + BORDER_COLOR_PICKER_ID,
            allowedSizes: RibbonItemSize.Medium,
            colorPickerSettings: {
                value: this.borderColor,
                cssClass: 'e-de-ribbon-border-color-picker e-de-prop-font-button  ',
                change: (args: ColorPickerEventArgs) => {
                    this.borderColor = args.currentValue.hex;
                },
                noColor: true,
                showButtons: false
            },
            ribbonTooltipSettings: {
                content: this.localObj.getConstant('Border Color')
            }
        };
    }

    /**
     * Gets the Border Width Dropdown configuration
     * @returns {RibbonItemModel} RibbonItemModel for the Border Width Dropdown
     */
    private getBorderWidthDropdown(): RibbonItemModel {
        // Create a hidden container to hold the dropdown items
        const divElement: HTMLElement = createElement('div', { id: this.commonID + '_borderSizeTarget', styles: 'display:none' });
        this.templateContainer.appendChild(divElement);

        // Create a ul element to hold the list items
        const ulTag: HTMLElement = createElement('ul', {
            styles: 'display: block; outline: 0px; width: 126px; height: auto;',
            id: this.commonID + '_borderSizeListMenu'
        });
        divElement.appendChild(ulTag);

        // Create dropdown items for different border sizes
        this.createBorderSizeItems(ulTag);

        return {
            type: RibbonItemType.DropDown,
            id: this.commonID + BORDER_WIDTH_DROPDOWN_ID,
            keyTip: 'Y',
            cssClass: 'e-de-ribbon-border-size-button',
            allowedSizes: RibbonItemSize.Medium,
            dropDownSettings: {
                content: this.borderWidth,
                iconCss: 'e-de-ctnr-strokesize e-icons',
                cssClass: 'e-de-prop-bordersize e-de-ribbon-border-size-button',
                target: divElement,
                beforeOpen: () => {
                    divElement.style.display = 'block';
                    // Update border color for all size samples
                    const borderWidthElements: HTMLCollectionOf<Element> = this.widthOptions.getElementsByClassName('e-de-border-width');
                    for (let i: number = 0; i < borderWidthElements.length; i++) {
                        /* eslint-disable */
                        const element: HTMLElement = borderWidthElements[i] as HTMLElement;
                        element.style.borderBottomColor = this.borderColor;
                    }
                },
                beforeClose: () => {
                    divElement.style.display = 'none';
                }
            },
            ribbonTooltipSettings: {
                content: this.localObj.getConstant('Border Width')
            }
        };
    }

    /**
     * Creates the border size dropdown items
     * @param {HTMLElement} ulTag - The ul element to append the items to
     * @returns {void}
     */
    private createBorderSizeItems(ulTag: HTMLElement): void {
        // Add 'No Border' option
        const noBorderOption: HTMLElement = BordersHelper.createBorderWidthOption(ulTag, this.localObj.getConstant('No Border'), this.localObj);
        noBorderOption.addEventListener('click', () => {
            this.container.ribbon.ribbon.getItem(this.commonID + BORDER_WIDTH_DROPDOWN_ID).dropDownSettings.content = this.localObj.getConstant('No Border');
            this.onBorderWidthChange('No Border');
        });

        // Get border widths
        const borderWidths: string[] = BordersHelper.getBorderWidthItems(this.localObj).slice(1); // Skip 'No Border'

        // Add border width options
        borderWidths.forEach((width: string) => {
            this.widthOptions = BordersHelper.createBorderWidthOption(ulTag, width, this.localObj);
            this.widthOptions.addEventListener('click', () => {
                this.container.ribbon.ribbon.getItem(this.commonID + BORDER_WIDTH_DROPDOWN_ID).dropDownSettings.content = width;
                this.onBorderWidthChange(width.replace(this.localObj.getConstant('px'), 'px'));
            });
        });
    }

    /**
     * Handles border width change
     * @param {string} width - The selected border width
     * @returns {void}
     */
    private onBorderWidthChange(width: string): void {
        this.borderWidth = width;
        // Get border dropdown
        const borderDropdownItem: RibbonItemModel = this.container.ribbon.ribbon.getItem(this.commonID + BORDER_WIDTH_DROPDOWN_ID);
        if (borderDropdownItem && borderDropdownItem.dropDownSettings) {
            borderDropdownItem.dropDownSettings.content = width;
            // Force refresh the ribbon item
            this.container.ribbon.ribbon.updateItem(borderDropdownItem);
        }

    }

    /**
     * Applies the border based on the selected option
     * @param {string} borderId - The ID of the selected border option
     * @returns {void}
     */
    private applyBorder(borderId: string): void {
        const borderType: BorderType = BordersHelper.getBorderType(borderId, this.localObj);
        BordersHelper.applyBorder(this.container.documentEditor, borderType, this.borderColor, this.borderWidth);
    }

    /**
     * Clean up resources when destroyed
     * @returns {void}
     */
    public destroy(): void {
        remove(this.widthOptions);
        this.widthOptions = undefined;
        if (this.templateContainer && this.templateContainer.parentNode) {
            this.templateContainer.parentNode.removeChild(this.templateContainer);
        }
        this.templateContainer = undefined;
    }
}
