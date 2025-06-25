import { RibbonGroupBase } from '../ribbon-interfaces';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel, RibbonItemType } from '@syncfusion/ej2-ribbon';
import { HeaderFooterType } from '../../../document-editor/base';
import { HeaderFooterWidget } from '../../../document-editor/implementation';

// Constants for UI element IDs
export const OPTIONS_GROUP_ID: string = '_options_group';
export const LINK_PREVIOUS_BUTTON_ID: string = '_link_previous_button';
export const DIFFERENT_FIRST_BUTTON_ID: string = '_different_first_button';
export const DIFFERENT_ODD_EVEN_BUTTON_ID: string = '_different_odd_even_button';

/**
 * Represents the Options Group in Header & Footer tab
 * @private
 */
export class OptionsGroup extends RibbonGroupBase {
    /**
     * Constructor for the OptionsGroup
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        super(container);
    }

    /**
     * Gets the ribbon group model for Options
     * @returns {RibbonGroupModel} The ribbon group model
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            id: this.ribbonId + OPTIONS_GROUP_ID,
            header: this.localObj.getConstant('Options'),
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Options'),
            collections: [
                {
                    items: [
                        {
                            type: RibbonItemType.CheckBox,
                            id: this.ribbonId + DIFFERENT_FIRST_BUTTON_ID,
                            keyTip: 'TF',
                            checkBoxSettings: {
                                label: this.localObj.getConstant('Different First Page'),
                                checked: false,
                                change: (args: { checked: boolean }) => {
                                    if (!this.documentEditor.isReadOnly) {
                                        const selection: any = this.documentEditor.selectionModule;
                                        if (selection) {
                                            selection.sectionFormat.differentFirstPage = args.checked;
                                            setTimeout((): void => {
                                                this.documentEditor.focusIn();
                                            }, 10);
                                        }
                                    }
                                }
                            },
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('Different header and footer for first page')
                            }
                        },
                        {
                            type: RibbonItemType.CheckBox,
                            id: this.ribbonId + DIFFERENT_ODD_EVEN_BUTTON_ID,
                            keyTip: 'TE',
                            checkBoxSettings: {
                                label: this.localObj.getConstant('Different Odd And Even Pages'),
                                checked: false,
                                change: (args: { checked: boolean }) => {
                                    if (!this.documentEditor.isReadOnly) {
                                        const selection: any = this.documentEditor.selectionModule;
                                        if (selection) {
                                            selection.sectionFormat.differentOddAndEvenPages = args.checked;
                                            setTimeout((): void => {
                                                this.documentEditor.focusIn();
                                            }, 10);
                                        }
                                    }
                                }
                            },
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('Different header and footer for odd and even pages')
                            }
                        },
                        {
                            type: RibbonItemType.CheckBox,
                            id: this.ribbonId + LINK_PREVIOUS_BUTTON_ID,
                            keyTip: 'TL',
                            checkBoxSettings: {
                                label: this.localObj.getConstant('Link to Previous'),
                                checked: false,
                                change: (args: { checked: boolean }) => {
                                    if (!this.documentEditor.isReadOnly) {
                                        const selection: any = this.documentEditor.selectionModule;
                                        if (selection) {
                                            const headerFooterType: HeaderFooterType = this.getCurrentHeaderFooterType();
                                            if (headerFooterType) {
                                                this.setLinkToPreviousValue(headerFooterType, args.checked);
                                            }
                                        }
                                    }
                                }
                            },
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('Link to the previous sections header and footer')
                            }
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Gets the current header/footer type
     * @returns {HeaderFooterType} The current header/footer type
     */
    private getCurrentHeaderFooterType(): HeaderFooterType {
        const selection: any = this.documentEditor.selectionModule;
        if (selection && selection.start && selection.start.paragraph &&
            selection.start.paragraph.containerWidget) {
            return (selection.start.paragraph.containerWidget as HeaderFooterWidget).headerFooterType;
        }

        return null;
    }

    /**
     * Checks if the current header/footer is linked to previous
     * @returns {boolean} Whether the current header/footer is linked to previous
     */
    private isLinkToPreviousChecked(): boolean {
        const selection: any = this.documentEditor.selectionModule;
        if (!selection) {
            return false;
        }

        const headerFooterType: HeaderFooterType = this.getCurrentHeaderFooterType();
        if (!headerFooterType) {
            return false;
        }

        switch (headerFooterType) {
        case 'OddHeader':
            return selection.sectionFormat.oddPageHeader.linkToPrevious;
        case 'OddFooter':
            return selection.sectionFormat.oddPageFooter.linkToPrevious;
        case 'EvenHeader':
            return selection.sectionFormat.evenPageHeader.linkToPrevious;
        case 'EvenFooter':
            return selection.sectionFormat.evenPageFooter.linkToPrevious;
        case 'FirstPageHeader':
            return selection.sectionFormat.firstPageHeader.linkToPrevious;
        case 'FirstPageFooter':
            return selection.sectionFormat.firstPageFooter.linkToPrevious;
        default:
            return false;
        }
    }

    /**
     * Sets the link to previous value for the current header/footer
     * @param {string} headerFooterType - The header/footer type
     * @param {boolean} value - The value to set
     * @returns {void}
     */
    private setLinkToPreviousValue(headerFooterType: string, value: boolean): void {
        const selection: any = this.documentEditor.selectionModule;
        if (!selection) {
            return;
        }

        switch (headerFooterType) {
        case 'OddHeader':
            selection.sectionFormat.oddPageHeader.linkToPrevious = value;
            break;
        case 'OddFooter':
            selection.sectionFormat.oddPageFooter.linkToPrevious = value;
            break;
        case 'EvenHeader':
            selection.sectionFormat.evenPageHeader.linkToPrevious = value;
            break;
        case 'EvenFooter':
            selection.sectionFormat.evenPageFooter.linkToPrevious = value;
            break;
        case 'FirstPageHeader':
            selection.sectionFormat.firstPageHeader.linkToPrevious = value;
            break;
        case 'FirstPageFooter':
            selection.sectionFormat.firstPageFooter.linkToPrevious = value;
            break;
        }

        setTimeout((): void => {
            this.documentEditor.focusIn();
        }, 10);
    }

    /**
     * Updates the checkbox states based on current document state
     * @returns {void}
     */
    public updateSelection(): void {
        const ribbon: any = this.container.ribbon.ribbon;
        // Get checkbox elements
        const linkToPreviousCheckbox: any = ribbon.getItem(this.ribbonId + LINK_PREVIOUS_BUTTON_ID);
        const differentFirstCheckbox: any = ribbon.getItem(this.ribbonId + DIFFERENT_FIRST_BUTTON_ID);
        const differentOddEvenCheckbox: any = ribbon.getItem(this.ribbonId + DIFFERENT_ODD_EVEN_BUTTON_ID);

        const selection: any = this.documentEditor.selectionModule;

        if (selection) {
            // Update Different First Page checkbox
            if (differentFirstCheckbox) {
                differentFirstCheckbox.checkBoxSettings.checked = selection.sectionFormat.differentFirstPage;
                ribbon.updateItem(differentFirstCheckbox);
            }

            // Update Different Odd & Even Pages checkbox
            if (differentOddEvenCheckbox) {
                differentOddEvenCheckbox.checkBoxSettings.checked = selection.sectionFormat.differentOddAndEvenPages;
                ribbon.updateItem(differentOddEvenCheckbox);
            }

            // Update Link to Previous checkbox
            if (linkToPreviousCheckbox) {
                // Disable if this is the first section
                const isFirstSection: boolean = selection.start.paragraph.bodyWidget.sectionIndex === 0;
                if (isFirstSection) {
                    ribbon.disableItem(this.ribbonId + LINK_PREVIOUS_BUTTON_ID);
                } else {
                    ribbon.enableItem(this.ribbonId + LINK_PREVIOUS_BUTTON_ID);
                }

                if (!isFirstSection) {
                    const headerFooterType: HeaderFooterType = this.getCurrentHeaderFooterType();
                    if (headerFooterType) {
                        linkToPreviousCheckbox.checkBoxSettings.checked = this.isLinkToPreviousChecked();
                    }
                }
                ribbon.updateItem(linkToPreviousCheckbox);
            }
        }
    }
}
