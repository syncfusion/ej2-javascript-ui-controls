import { RibbonGroupBase, IRibbonGroup } from '../ribbon-interfaces';
import { Ribbon, RibbonGroupModel, RibbonItemSize, RibbonSplitButtonSettingsModel } from '@syncfusion/ej2-ribbon';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';
import { createElement, getInstance, isNullOrUndefined } from '@syncfusion/ej2-base';
import { HighlightColor, SelectionCharacterFormat } from '../../../document-editor';
import { FontHelper } from '../../helper/font-helper';
import { ElementsMap, HighlightColorInfo } from '../../helper/ribbon-interfaces';
import { ComboBox } from '@syncfusion/ej2-dropdowns';

// Font group constants
export const FONT_GROUP_ID: string = '_font_group';
export const FONT_FAMILY_ID: string = '_font_family';
export const FONT_SIZE_ID: string = '_font_size';
export const BOLD_ID: string = '_bold';
export const ITALIC_ID: string = '_italic';
export const UNDERLINE_ID: string = '_underline';
export const STRIKETHROUGH_ID: string = '_strikethrough';
export const SUPERSCRIPT_ID: string = '_superscript';
export const SUBSCRIPT_ID: string = '_subscript';
export const FONT_COLOR_ID: string = '_font_color';
export const HIGHLIGHT_COLOR_ID: string = '_highlight_color';
export const CLEAR_FORMAT_ID: string = '_clear_format';
export const GROW_FONT_ID: string = '_grow_format';
export const SHRINK_FONT_ID: string = '_shrink_format';
export const CHANGE_CASE_ID: string = '_change_case';

/**
 * FontGroup class for handling font formatting operations in Document Editor ribbon
 * @private
 */
export class FontGroup extends RibbonGroupBase implements IRibbonGroup {
    private appliedHighlightColor: string = 'rgb(255, 255, 0)';
    private highlightColorHandlers: Array<{ element: HTMLElement, handler: EventListener }> = [];

    /**
     * Get the Ribbon group model for Font formatting
     * @returns {RibbonGroupModel} - Ribbon group model for Font formatting
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        const id: string = this.ribbonId;

        return {
            id: id + FONT_GROUP_ID,
            cssClass: 'e-font-group',
            groupIconCss: 'e-icons e-de-ctnr-fontcolor',
            header: this.localObj.getConstant('Font'),
            isCollapsible: false,
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('More Font Options'),
            orientation: 'Row',
            showLauncherIcon: true,
            launcherIconKeyTip: 'FG',
            collections: [
                {
                    id: id + '_font-collection',
                    items: [
                        {
                            type: 'ComboBox',
                            keyTip: 'FF',
                            allowedSizes: RibbonItemSize.Small,
                            comboBoxSettings: {
                                dataSource: this.container.documentEditorSettings.fontFamilies,
                                label: this.localObj.getConstant('Font'),
                                width: '150px',
                                popupHeight: '250px',
                                popupWidth: '150px',
                                cssClass: 'e-de-prop-dropdown',
                                allowFiltering: true,
                                change: () => {
                                    this.changeFontFamily();
                                }
                            },
                            id: id + FONT_FAMILY_ID,
                            ribbonTooltipSettings: { content: this.localObj.getConstant('Font') }
                        },
                        {
                            type: 'ComboBox',
                            keyTip: 'FS',
                            allowedSizes: RibbonItemSize.Small,
                            comboBoxSettings: {
                                label: this.localObj.getConstant('Font Size'),
                                dataSource: ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72', '96'],
                                width: '65px',
                                cssClass: 'e-de-prop-dropdown',
                                showClearButton: false,
                                change: () => {
                                    this.changeFontSize();
                                }
                            },
                            id: id + FONT_SIZE_ID,
                            ribbonTooltipSettings: { content: this.localObj.getConstant('Font Size') }
                        }, {
                            type: 'Button',
                            keyTip: 'FG',
                            allowedSizes: RibbonItemSize.Small,
                            buttonSettings: {
                                content: this.localObj.getConstant('Grow Font Size'),
                                iconCss: 'e-icons e-de-ctnr-increase-fontsize',
                                clicked: () => {
                                    this.increaseFontSize();
                                }
                            },
                            id: id + GROW_FONT_ID,
                            ribbonTooltipSettings: { content: this.localObj.getConstant('Grow Font Size') }
                        },
                        {
                            type: 'Button',
                            keyTip: 'FK',
                            allowedSizes: RibbonItemSize.Small,
                            buttonSettings: {
                                content: this.localObj.getConstant('Shrink Font Size'),
                                iconCss: 'e-icons e-de-ctnr-decrease-fontsize',
                                clicked: () => {
                                    this.decreaseFontSize();
                                }
                            },
                            id: id + SHRINK_FONT_ID,
                            ribbonTooltipSettings: { content: this.localObj.getConstant('Shrink Font Size') }
                        }, {
                            type: 'DropDown',
                            keyTip: 'CC',
                            allowedSizes: RibbonItemSize.Small,
                            dropDownSettings: {
                                iconCss: 'e-icons e-de-ctnr-change-case',
                                content: this.localObj.getConstant('Change case Tooltip'),
                                items: FontHelper.getChangeCaseItems(this.localObj, id),
                                select: (args: any) => {
                                    this.changeCaseAction(args);
                                }
                            },
                            id: id + CHANGE_CASE_ID,
                            ribbonTooltipSettings: { content: this.localObj.getConstant('Change case Tooltip') }
                        }
                    ]
                }, {

                    items: [{
                        type: 'Button',
                        keyTip: '1',
                        allowedSizes: RibbonItemSize.Small,
                        buttonSettings: {
                            content: this.localObj.getConstant('Bold Tooltip'),
                            cssClass: 'e-de-icon-Bold',
                            iconCss: 'e-icons e-de-ctnr-bold',
                            isToggle: true,
                            clicked: () => {
                                this.boldAction();
                            }
                        },
                        id: id + BOLD_ID,
                        ribbonTooltipSettings: { content: this.localObj.getConstant('Bold Tooltip') }
                    },
                    {
                        type: 'Button',
                        keyTip: '2',
                        allowedSizes: RibbonItemSize.Small,
                        buttonSettings: {
                            content: this.localObj.getConstant('Italic Tooltip'),
                            cssClass: 'e-de-icon-Italic',
                            iconCss: 'e-icons e-de-ctnr-italic',
                            isToggle: true,
                            clicked: () => {
                                this.italicAction();
                            }
                        },
                        id: id + ITALIC_ID,
                        ribbonTooltipSettings: { content: this.localObj.getConstant('Italic Tooltip') }
                    },
                    {
                        type: 'Button',
                        keyTip: '3',
                        allowedSizes: RibbonItemSize.Small,
                        buttonSettings: {
                            content: this.localObj.getConstant('Underline Tooltip'),
                            cssClass: 'e-de-icon-Underline',
                            iconCss: 'e-icons e-de-ctnr-underline',
                            isToggle: true,
                            clicked: () => {
                                this.underlineAction();
                            }
                        },
                        id: id + UNDERLINE_ID,
                        ribbonTooltipSettings: { content: this.localObj.getConstant('Underline Tooltip') }
                    },
                    {
                        type: 'Button',
                        keyTip: '4',
                        allowedSizes: RibbonItemSize.Small,
                        buttonSettings: {
                            content: this.localObj.getConstant('Strikethrough'),
                            cssClass: 'e-de-icon-Strikethrough',
                            iconCss: 'e-icons e-de-ctnr-strikethrough',
                            isToggle: true,
                            clicked: () => {
                                this.strikethroughAction();
                            }
                        },
                        id: id + STRIKETHROUGH_ID,
                        ribbonTooltipSettings: { content: this.localObj.getConstant('Strikethrough') }
                    },
                    {
                        type: 'Button',
                        keyTip: '5',
                        allowedSizes: RibbonItemSize.Small,
                        buttonSettings: {
                            content: this.localObj.getConstant('Superscript Tooltip'),
                            cssClass: 'e-de-icon-Superscript',
                            iconCss: 'e-icons e-de-ctnr-superscript',
                            isToggle: true,
                            clicked: () => {
                                this.superscriptAction();
                            }
                        },
                        id: id + SUPERSCRIPT_ID,
                        ribbonTooltipSettings: { content: this.localObj.getConstant('Superscript Tooltip') }
                    },
                    {
                        type: 'Button',
                        keyTip: '6',
                        allowedSizes: RibbonItemSize.Small,
                        buttonSettings: {
                            content: this.localObj.getConstant('Subscript Tooltip'),
                            cssClass: 'e-de-icon-Subscript',
                            iconCss: 'e-icons e-de-ctnr-subscript',
                            isToggle: true,
                            clicked: () => {
                                this.subscriptAction();
                            }
                        },
                        id: id + SUBSCRIPT_ID,
                        ribbonTooltipSettings: { content: this.localObj.getConstant('Subscript Tooltip') }
                    },
                    {
                        type: 'ColorPicker',
                        keyTip: 'I',
                        allowedSizes: RibbonItemSize.Small,
                        colorPickerSettings: {
                            label: this.localObj.getConstant('Font color'),
                            htmlAttributes: { 'aria-label': this.localObj.getConstant('Font color') },
                            value: '#000000',
                            change: (args: any) => {
                                this.changeFontColor(args);
                            }
                        },
                        id: id + FONT_COLOR_ID,
                        ribbonTooltipSettings: { content: this.localObj.getConstant('Font color') }
                    },
                    {
                        type: 'SplitButton',
                        keyTip: 'FC',
                        allowedSizes: RibbonItemSize.Small,
                        splitButtonSettings: this.createHighlightColorSplitButton(),
                        id: id + HIGHLIGHT_COLOR_ID,
                        ribbonTooltipSettings: { content: this.localObj.getConstant('Text highlight color') }
                    },
                    {
                        type: 'Button',
                        keyTip: 'E',
                        allowedSizes: RibbonItemSize.Small,
                        buttonSettings: {
                            content: this.localObj.getConstant('Clear all formatting'),
                            iconCss: 'e-icons e-de-ctnr-clearall',
                            clicked: () => {
                                this.clearFormatAction();
                            }
                        },
                        id: id + CLEAR_FORMAT_ID,
                        ribbonTooltipSettings: { content: this.localObj.getConstant('Clear all formatting') }
                    }
                    ]
                }
            ]
        };
    }

    /**
     * Update font UI based on selection state
     * @returns {void}
     * @private
     */
    public updateSelection(): void {

        // Get the selection character format
        if (!this.documentEditor.selection) { return; }

        const characterFormat: SelectionCharacterFormat = this.documentEditor.selection.characterFormat;
        const id: string = this.ribbonId;
        // Update toggle buttons
        this.updateToggleButtonState(id + BOLD_ID, characterFormat.bold);
        this.updateToggleButtonState(id + ITALIC_ID, characterFormat.italic);
        this.updateToggleButtonState(id + UNDERLINE_ID, characterFormat.underline !== 'None');
        this.updateToggleButtonState(id + STRIKETHROUGH_ID, characterFormat.strikethrough !== 'None');
        this.updateToggleButtonState(id + SUPERSCRIPT_ID, characterFormat.baselineAlignment === 'Superscript');
        this.updateToggleButtonState(id + SUBSCRIPT_ID, characterFormat.baselineAlignment === 'Subscript');

        // Update font family dropdown
        if (characterFormat.fontFamily) {
            let fontFamily: string;
            if (!isNullOrUndefined(characterFormat.renderedFontFamily) &&
                !isNullOrUndefined(characterFormat.fontFamily)) {
                fontFamily = characterFormat.renderedFontFamily;
            } else {
                fontFamily = characterFormat.fontFamily;
            }

            const fontFamilyElement: HTMLElement = document.getElementById(id + FONT_FAMILY_ID);
            if (fontFamilyElement) {
                (fontFamilyElement as HTMLInputElement).value = fontFamily;
            }
        } else {
            const fontFamilyElement: HTMLElement = document.getElementById(id + FONT_FAMILY_ID);
            if (fontFamilyElement) {
                const fontFamilyInstance: any = getInstance(fontFamilyElement, ComboBox);
                (fontFamilyInstance as any).value = null;
                (fontFamilyElement as HTMLInputElement).value = null;
            }
        }

        // Update font size dropdown
        if (characterFormat.fontSize) {
            const fontSize: string = characterFormat.fontSize.toString();
            const fontSizeElement: HTMLElement = document.getElementById(id + FONT_SIZE_ID);
            if (fontSizeElement) {
                const fontSizeInstance: object = getInstance(fontSizeElement, ComboBox);
                (fontSizeInstance as any).value = fontSize;
            }
        }
        else {
            const fontSizeElement: HTMLElement = document.getElementById(id + FONT_SIZE_ID);
            if (fontSizeElement) {
                const fontSizeInstance: object = getInstance(fontSizeElement, ComboBox);
                (fontSizeInstance as any).value = null;
            }
        }

        // Update highlight color button
        if (characterFormat.highlightColor) {
            const highlightColor: HTMLElement = document.getElementById(id + HIGHLIGHT_COLOR_ID);
            if (highlightColor) {
                const highlightColorElement: HTMLElement = highlightColor.querySelector('.e-split-btn-icon');
                if (highlightColorElement) {
                    highlightColorElement.style.backgroundColor = this.getBackgroundColorFromHighlightColor(characterFormat.highlightColor);
                }
            }
        }


        // Update font color button
        if (characterFormat.fontColor) {
            let fontColor: string = characterFormat.fontColor;
            if (fontColor === 'empty' || fontColor === '#00000000') {
                fontColor = '#000000';
            }
            const fontColorElement: HTMLElement = document.getElementById(id + FONT_COLOR_ID);
            if (fontColorElement) {
                const fontColorInput: HTMLInputElement = fontColorElement.querySelector('input');
                if (fontColorInput) {
                    fontColorInput.value = fontColor;
                }
            }
        }
    }

    private updateToggleButtonState(buttonId: string, isActive: boolean): void {
        // Use Ribbon's getItem method for better performance
        const ribbonObj: Ribbon = this.container.ribbon.ribbon;
        if (ribbonObj) {
            const button: HTMLElement = document.getElementById(buttonId);
            if (button) {
                if (isActive) {
                    button.classList.add('e-active');
                    button.setAttribute('aria-pressed', 'true');
                }
                else {
                    button.classList.remove('e-active');
                    button.setAttribute('aria-pressed', 'false');
                }
            }
        }
    }

    private getHighlightColorItems(): HighlightColorInfo[] {
        return FontHelper.getHighlightColorItems(this.localObj, this.ribbonId);
    }

    private createHighlightColorSplitButton(): RibbonSplitButtonSettingsModel {
        let highlightIconCss: string = 'e-de-ctnr-highlight e-icons';
        if (this.isRtl) {
            highlightIconCss += ' e-de-flip';
        }

        const colorListDropDiv: HTMLElement = createElement('div', {
            id: this.ribbonId + '_color_list_div',
            styles: 'visibility: hidden'
        });

        // Create the HTML template for highlight color dropdown
        const highlightColorElement: HTMLElement = createElement('ul', {
            id: this.ribbonId + '_ribbon_highlight_color',
            styles: 'visibility: visible; display: grid; grid-template-columns: repeat(5,1fr); padding: 2px 2px;'
        });
        colorListDropDiv.appendChild(highlightColorElement);

        const highlightColors: HighlightColorInfo[] = this.getHighlightColorItems();

        highlightColors.forEach((color: HighlightColorInfo) => {
            const colorDiv: HTMLDivElement = createElement('li', { className: 'e-de-ctnr-hglt-btn' }) as HTMLDivElement;
            colorDiv.style.backgroundColor = color.backgroundColor;
            highlightColorElement.appendChild(colorDiv);
            // Create bound handler and store reference
            const handler: EventListener = this.onHighlightColorClick.bind(this, color.backgroundColor);
            colorDiv.addEventListener('click', handler);
            this.highlightColorHandlers.push({ element: colorDiv, handler });
        });

        const noColorDiv: HTMLElement = createElement('li');
        highlightColorElement.appendChild(noColorDiv);

        const noColorSpan: HTMLElement = createElement('span', { className: 'e-de-ctnr-hglt-no-color', styles: 'padding: 2px' });
        noColorSpan.textContent = this.localObj.getConstant('No color');
        noColorDiv.appendChild(noColorSpan);
        noColorDiv.addEventListener('click', this.onHighlightColorClick.bind(this, 'transparent'));

        // Create bound handler and store reference
        const noColorHandler: EventListener = this.onHighlightColorClick.bind(this, 'transparent');
        noColorDiv.addEventListener('click', noColorHandler);
        this.highlightColorHandlers.push({ element: noColorDiv, handler: noColorHandler });

        return {
            target: colorListDropDiv,
            iconCss: highlightIconCss,
            content: this.localObj.getConstant('Text highlight color'),
            // cssClass: this.splitButtonClass,
            htmlAttributes: { 'aria-label': this.localObj.getConstant('Text highlight color') },
            items: this.getHighlightColorItems().map((color: HighlightColorInfo) => ({ id: color.id, text: color.text })),
            select: (args: any) => {
                this.applyHighlightColor(args.item.backgroundColor);
            },
            beforeOpen: (): void => {
                colorListDropDiv.style.visibility = 'visible';
            },
            beforeClose: (): void => {
                colorListDropDiv.style.visibility = 'hidden';
            },
            click: () => {
                this.applyHighlightColor(this.appliedHighlightColor);
            }
        };
    }

    private onHighlightColorClick(color: string, event: any): void {
        this.applyHighlightColor(color);
        // Remove the 'e-color-selected' class from all children
        event.currentTarget.parentElement.querySelectorAll('.e-color-selected').forEach((child: HTMLElement) => {
            child.classList.remove('e-color-selected');
        });
        // Add the 'e-color-selected' class to the clicked element
        if (event.currentTarget.classList.length > 0) {
            event.currentTarget.classList.add('e-color-selected');
        }
    }

    private applyHighlightColor(color: string): void {
        this.appliedHighlightColor = FontHelper.applyHighlightColor(this.documentEditor, color);
    }

    private getBackgroundColorFromHighlightColor(highlightColor: HighlightColor): string {
        return FontHelper.getBackgroundColorFromHighlightColor(highlightColor);
    }

    private boldAction(): void {
        FontHelper.applyFontFormatting(this.documentEditor, 'bold');
    }

    private italicAction(): void {
        FontHelper.applyFontFormatting(this.documentEditor, 'italic');
    }

    private underlineAction(): void {
        FontHelper.applyFontFormatting(this.documentEditor, 'underline');
    }

    private strikethroughAction(): void {
        FontHelper.applyFontFormatting(this.documentEditor, 'strikethrough');
    }

    private superscriptAction(): void {
        FontHelper.applyFontFormatting(this.documentEditor, 'superscript');
    }

    private subscriptAction(): void {
        FontHelper.applyFontFormatting(this.documentEditor, 'subscript');
    }

    private changeCaseAction(args: any): void {
        FontHelper.applyChangeCase(this.documentEditor, this.localObj, args.item.text);
    }

    private changeFontFamily(): void {
        const fontFamily: string = (document.getElementById(this.ribbonId + FONT_FAMILY_ID) as HTMLInputElement).value;
        FontHelper.changeFontFamily(this.documentEditor, fontFamily);
    }

    private changeFontSize(): void {
        const fontSize: string = (document.getElementById(this.ribbonId + FONT_SIZE_ID) as HTMLInputElement).value;
        FontHelper.changeFontSize(this.documentEditor, fontSize);
    }

    private changeFontColor(args: any): void {
        FontHelper.changeFontColor(this.documentEditor, args.currentValue.hex);
    }

    private clearFormatAction(): void {
        FontHelper.applyFontFormatting(this.documentEditor, 'clearFormat');
    }

    private increaseFontSize(): void {
        FontHelper.increaseFontSize(this.documentEditor);
    }

    private decreaseFontSize(): void {
        FontHelper.decreaseFontSize(this.documentEditor);
    }

    public destroy(): void {
        // Remove highlight color event listeners
        this.highlightColorHandlers.forEach((item: any) => {
            if (item.element && item.handler) {
                item.element.removeEventListener('click', item.handler);
            }
        });

        this.highlightColorHandlers = [];

    }
}
