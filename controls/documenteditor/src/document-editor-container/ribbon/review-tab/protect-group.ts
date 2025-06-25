import { RibbonGroupBase } from '../ribbon-interfaces';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel } from '@syncfusion/ej2-ribbon';
import { MenuEventArgs, ItemModel } from '@syncfusion/ej2-splitbuttons';
import { L10n } from '@syncfusion/ej2-base';

// Constants for UI element IDs
export const PROTECT_GROUP: string = '_protect_group';
export const PROTECT_DOCUMENT_ID: string = '_protect_document';
export const READ_ONLY_ID: string = '_read_only';
export const RESTRICT_EDITING_ID: string = '_restrict_editing';

/**
 * Represents the Protect Group in Review
 * @private
 */
export class ProtectGroup extends RibbonGroupBase {
    /**
     * Constructor for the ProtectGroup
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        super(container);
    }

    /**
     * Gets the ribbon group model for Protect
     * @returns {RibbonGroupModel} The ribbon group model
     */
    public getGroupModel(): RibbonGroupModel {
        const locale: L10n = this.localObj;

        // Create items for the protect document dropdown
        const protectItems: ItemModel[] = [
            {
                id: this.ribbonId + PROTECT_DOCUMENT_ID + '_readonly',
                text: locale.getConstant('Read Only'),
                iconCss: 'e-icons e-de-read-only'
            },
            {
                id: this.ribbonId + PROTECT_DOCUMENT_ID + '_restrict',
                text: locale.getConstant('Restrict Editing'),
                iconCss: 'e-icons e-de-restrict-edit'
            }
        ];

        return {
            id: this.ribbonId + PROTECT_GROUP,
            header: locale.getConstant('Protect'),
            orientation: 'Rows',
            keyTip: 'ZR',
            enableGroupOverflow: true,
            overflowHeader: locale.getConstant('Protect'),
            collections: [
                {
                    items: [
                        {
                            id: this.ribbonId + PROTECT_DOCUMENT_ID,
                            type: 'DropDown',
                            dropDownSettings: {
                                content: locale.getConstant('Protect Document'),
                                items: protectItems,
                                iconCss: 'e-icons e-de-ctnr-lock',
                                select: this.protectDocumentDropdownHandler.bind(this),
                                beforeItemRender: this.onBeforeRenderProtectDropdown.bind(this)
                            },
                            ribbonTooltipSettings: {
                                title: locale.getConstant('Protect Document'),
                                content: locale.getConstant('Control what types of changes can be made to the document')
                            }
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Handle selection in protect document dropdown
     * @param {MenuEventArgs} args - Menu event arguments
     * @returns {void}
     */
    private protectDocumentDropdownHandler(args: MenuEventArgs): void {
        const id: string = args.item.id;
        if (args.item && id) {
            if (id === this.ribbonId + PROTECT_DOCUMENT_ID + '_readonly') {
                // Toggle read-only mode
                this.container.restrictEditing = !this.container.restrictEditing;
                this.updateReadOnlyIcon(args.element);
            } else if (id === this.ribbonId + PROTECT_DOCUMENT_ID + '_restrict') {
                // Show restrict editing dialog
                this.documentEditor.documentHelper.restrictEditingPane.showHideRestrictPane(true);
            }
        }
    }

    /**
     * Handle rendering of protection dropdown items to show current state
     * @param {MenuEventArgs} args - Menu event arguments
     * @returns {void}
     */
    private onBeforeRenderProtectDropdown(args: MenuEventArgs): void {
        const selectedIcon: HTMLElement = args.element.getElementsByClassName('e-menu-icon')[0] as HTMLElement;
        if (!selectedIcon) {
            return;
        }

        if (args.item.id === this.ribbonId + PROTECT_DOCUMENT_ID + '_readonly') {
            this.toggleSelectedIcon(selectedIcon, this.documentEditor.isReadOnly);
        } else if (args.item.id === this.ribbonId + PROTECT_DOCUMENT_ID + '_restrict') {
            const restrictPane: HTMLElement = document.getElementsByClassName('e-de-restrict-pane')[0] as HTMLElement;
            if (restrictPane) {
                const isRestrictPaneVisible: boolean = !(restrictPane.style.display === 'none');
                this.toggleSelectedIcon(selectedIcon, isRestrictPaneVisible);
            }
        }
    }

    /**
     * Updates the read-only icon in the dropdown item
     * @param {HTMLElement} menuElement - The menu element
     * @returns {void}
     */
    private updateReadOnlyIcon(menuElement: HTMLElement): void {
        const selectedIcon: HTMLElement = menuElement.getElementsByClassName('e-menu-icon')[0] as HTMLElement;
        if (selectedIcon) {
            this.toggleSelectedIcon(selectedIcon, this.documentEditor.isReadOnly);
        }
    }

    /**
     * Toggles the selected icon state
     * @param {HTMLElement} icon - The icon element
     * @param {boolean} isSelected - Whether the item is selected
     * @returns {void}
     */
    private toggleSelectedIcon(icon: HTMLElement, isSelected: boolean): void {
        if (isSelected) {
            icon.classList.add('e-de-selected-item');
        } else {
            icon.classList.remove('e-de-selected-item');
        }
    }

    /**
     * Update UI based on document protection state
     * @returns {void}
     */
    public updateSelection(): void {
        // Update UI to reflect current document protection state if needed
        const isReadOnly: boolean = this.documentEditor.isReadOnly;

        // Update read-only button state if it exists in the UI
        const readOnlyElement: HTMLElement = document.getElementById(this.ribbonId + READ_ONLY_ID);
        if (readOnlyElement) {
            readOnlyElement.classList.toggle('e-active', isReadOnly);
        }
    }
}
