import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel, RibbonItemModel } from '@syncfusion/ej2-ribbon';
import { DocumentEditor } from '../../../document-editor';
import { DropDownButton, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { L10n } from '@syncfusion/ej2-base';

/**
 * Constants for control group identification
 */
export const CONTROL_GROUP: string = '_control_group';
export const CONTENT_CONTROL_ID: string = '_content_control';
export const RICHTEXT_CONTENT_CONTROL_ID: string = '_richtext_content_control';
export const PLAINTEXT_CONTENT_CONTROL_ID: string = '_plaintext_content_control';
export const COMBOBOX_CONTENT_CONTROL_ID: string = '_combobox_content_control';
export const DROPDOWNDOWN_CONTENT_CONTROL_ID: string = '_dropdown_content_control';
export const DATEPICKER_CONTENT_CONTROL_ID: string = '_datepicker_content_control';
export const CHECKBOX_CONTENT_CONTROL_ID: string = '_checkbox_content_control';
export const PICTURE_CONTENT_CONTROL_ID: string = '_picture_content_control';

/**
 * ControlGroup module
 * @private
 */
export class ControlGroup {
    private container: DocumentEditorContainer;
    private ribbonId: string;
    private contentControlDropDown: DropDownButton;

    /**
     * Constructor for ControlGroup class
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    public constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.ribbonId = this.container.element.id + '_ribbon';
    }

    /**
     * Get the DocumentEditor instance
     * @returns {DocumentEditor} The DocumentEditor instance
     */
    private get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }

    /**
     * Get the Control group model
     * @returns {RibbonGroupModel} The Control group model
     */
    public getGroupModel(): RibbonGroupModel {
        const locale: L10n = this.container.localObj;
        const id: string = this.ribbonId + CONTROL_GROUP;

        return {
            id: id,
            header: locale.getConstant('Controls'),
            orientation: 'Row',
            cssClass: 'e-controls-group',
            enableGroupOverflow: true,
            overflowHeader: locale.getConstant('Controls'),
            collections: [
                {
                    items: [
                        this.getContentControlDropDownModel()
                    ]
                }
            ]
        };
    }

    /**
     * Get the Content Control dropdown model
     * @returns {RibbonItemModel} The Content Control dropdown model
     */
    private getContentControlDropDownModel(): RibbonItemModel {
        const locale: L10n = this.container.localObj;
        const id: string = this.ribbonId + CONTROL_GROUP;

        return {
            type: 'DropDown',
            id: id + CONTENT_CONTROL_ID,
            dropDownSettings: {
                iconCss: 'e-icons e-de-ctnr-content-control',
                content: locale.getConstant('Content Control'),
                items: [
                    {
                        text: locale.getConstant('Rich Text Content Control'),
                        iconCss: 'e-icons e-de-ctnr-change-case',
                        id: id + RICHTEXT_CONTENT_CONTROL_ID
                    },
                    {
                        text: locale.getConstant('Plain Text Content Control'),
                        iconCss: 'e-icons e-de-ctnr-change-case',
                        id: id + PLAINTEXT_CONTENT_CONTROL_ID
                    },
                    {
                        text: locale.getConstant('Picture Content Control'),
                        iconCss: 'e-icons e-de-ctnr-image',
                        id: id + PICTURE_CONTENT_CONTROL_ID
                    },
                    {
                        text: locale.getConstant('Combo Box Content Control'),
                        iconCss: 'e-icons e-de-combo-box',
                        id: id + COMBOBOX_CONTENT_CONTROL_ID
                    },
                    {
                        text: locale.getConstant('Drop-Down List Content Control'),
                        iconCss: 'e-icons e-de-dropdown-list',
                        id: id + DROPDOWNDOWN_CONTENT_CONTROL_ID
                    },
                    {
                        text: locale.getConstant('Date Picker Content Control'),
                        iconCss: 'e-icons e-timeline-today',
                        id: id + DATEPICKER_CONTENT_CONTROL_ID
                    },
                    {
                        text: locale.getConstant('Check Box Content Control'),
                        iconCss: 'e-icons e-check-box',
                        id: id + CHECKBOX_CONTENT_CONTROL_ID
                    }
                ],
                select: this.onContentControlDropDownSelect.bind(this)
            },
            ribbonTooltipSettings: {
                content: locale.getConstant('Insert content controls')
            }

        };
    }

    /**
     * Handle content control dropdown selection
     * @param {MenuEventArgs} args - Menu event arguments
     * @returns {void}
     */
    private onContentControlDropDownSelect(args: MenuEventArgs): void {
        const id: string = this.ribbonId + CONTROL_GROUP;

        if (args.item.id === id + RICHTEXT_CONTENT_CONTROL_ID) {
            this.documentEditor.editor.insertContentControl('RichText');
        } else if (args.item.id === id + PLAINTEXT_CONTENT_CONTROL_ID) {
            this.documentEditor.editor.insertContentControl('Text');
        } else if (args.item.id === id + PICTURE_CONTENT_CONTROL_ID) {
            this.documentEditor.showDialog('PictureContentControl');
        } else if (args.item.id === id + COMBOBOX_CONTENT_CONTROL_ID) {
            this.documentEditor.editor.insertContentControl('ComboBox');
        } else if (args.item.id === id + DROPDOWNDOWN_CONTENT_CONTROL_ID) {
            this.documentEditor.editor.insertContentControl('DropDownList');
        } else if (args.item.id === id + DATEPICKER_CONTENT_CONTROL_ID) {
            this.documentEditor.editor.insertContentControl('Date');
        } else if (args.item.id === id + CHECKBOX_CONTENT_CONTROL_ID) {
            this.documentEditor.editor.insertContentControl('CheckBox');
        }

        setTimeout((): void => {
            this.documentEditor.focusIn();
        }, 30);
    }

    /**
     * Update UI based on current selection
     * @returns {void}
     * @private
     */
    public updateSelection(): void {
        // Update UI state based on current selection
        const isReadOnly: boolean = this.documentEditor.isReadOnly;
        const isDocumentProtected: boolean = this.documentEditor.documentHelper.isDocumentProtected;
        const isHeaderFooter: boolean = this.documentEditor.enableHeaderAndFooter;
        const isPlainContentControl: boolean = this.documentEditor.selectionModule.isPlainContentControl();

        // Disable content controls in read-only mode, protected document, or header/footer
        const enableContentControls: boolean = !isReadOnly && !isDocumentProtected && !isHeaderFooter && !isPlainContentControl;

        // Implementation to enable/disable content control dropdown
        const contentControlElement: HTMLElement = document.getElementById(this.ribbonId + CONTROL_GROUP + CONTENT_CONTROL_ID);
        if (contentControlElement) {
            contentControlElement.classList.toggle('e-disabled', !enableContentControls);
        }
    }

    /**
     * Destroy the ControlGroup instance
     * @returns {void}
     */
    public destroy(): void {
        // Destroy UI components
        if (this.contentControlDropDown) {
            this.contentControlDropDown.destroy();
            this.contentControlDropDown = undefined;
        }

        // Clear all references
        this.container = undefined;
        this.ribbonId = undefined;
    }
}
