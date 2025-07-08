import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel, RibbonItemModel } from '@syncfusion/ej2-ribbon';
import { DocumentEditor } from '../../../document-editor';
import { DropDownButton, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';

/**
 * Constants for form fields group identification
 */
export const FORM_FIELDS_GROUP: string = '_form_fields_group';
export const FORM_FIELDS_ID: string = '_form_fields';
export const TEXT_FORM: string = '_text_form';
export const CHECKBOX: string = '_checkbox';
export const DROPDOWN: string = '_dropdown';

/**
 * FormFieldsGroup module
 * @private
 */
export class FormFieldsGroup {
    private container: DocumentEditorContainer;
    private ribbonId: string;
    private formFieldDropDown: DropDownButton;

    /**
     * Constructor for FormFieldsGroup class
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
     * Get the FormFields group model
     * @returns {RibbonGroupModel} The FormFields group model
     */
    public getGroupModel(): RibbonGroupModel {
        const locale: any = this.container.localObj;
        const id: string = this.ribbonId + FORM_FIELDS_GROUP;

        return {
            id: id,
            header: locale.getConstant('Form Fields'),
            orientation: 'Row',
            cssClass: 'e-formfields-group',
            enableGroupOverflow: true,
            overflowHeader: locale.getConstant('Form Fields'),
            collections: [
                {
                    items: [
                        this.getFormFieldsDropDownModel()
                    ]
                }
            ]
        };
    }

    /**
     * Get the FormFields dropdown model
     * @returns {RibbonItemModel} The FormFields dropdown model
     */
    private getFormFieldsDropDownModel(): RibbonItemModel {
        const locale: any = this.container.localObj;
        const id: string = this.ribbonId;

        return {
            type: 'DropDown',
            id: id + FORM_FIELDS_ID,
            dropDownSettings: {
                iconCss: 'e-icons e-de-formfield',
                content: locale.getConstant('Form Fields'),
                items: [
                    {
                        text: locale.getConstant('Text Form'),
                        iconCss: 'e-icons e-de-textform',
                        id: id + TEXT_FORM
                    },
                    {
                        text: locale.getConstant('Check Box'),
                        iconCss: 'e-icons e-de-checkbox-form',
                        id: id + CHECKBOX
                    },
                    {
                        text: locale.getConstant('DropDown'),
                        iconCss: 'e-icons e-de-dropdownform',
                        id: id + DROPDOWN
                    }
                ],
                select: this.onFormFieldsDropDownSelect.bind(this)
            },
            ribbonTooltipSettings: {
                content: locale.getConstant('Insert form fields')
            }
        };
    }

    /**
     * Handle form fields dropdown selection
     * @param {MenuEventArgs} args - Menu event arguments
     * @returns {void}
     */
    private onFormFieldsDropDownSelect(args: MenuEventArgs): void {
        const id: string = this.ribbonId;

        if (args.item.id === id + TEXT_FORM) {
            this.documentEditor.editorModule.insertFormField('Text');
        } else if (args.item.id === id + CHECKBOX) {
            this.documentEditor.editorModule.insertFormField('CheckBox');
        } else if (args.item.id === id + DROPDOWN) {
            this.documentEditor.editorModule.insertFormField('DropDown');
        }

        setTimeout((): void => {
            this.documentEditor.focusIn();
        }, 30);
    }

    /**
     * Update UI based on current selection
     * @returns {void}
     */
    public updateSelection(): void {
        const isHeaderFooter: boolean = this.documentEditor.selection.contextType.indexOf('Header') >= 0 ||
            this.documentEditor.selection.contextType.indexOf('Footer') >= 0;

        const ribbon: any = this.container.ribbon.ribbon;
        if (ribbon) {
            if (isHeaderFooter) {
                ribbon.disableItem(this.ribbonId + FORM_FIELDS_ID);
            } else {
                ribbon.enableItem(this.ribbonId + FORM_FIELDS_ID);
            }
        }
    }


    /**
     * Destroy the FormFieldsGroup instance
     * @returns {void}
     */
    public destroy(): void {
        // Destroy UI components
        if (this.formFieldDropDown) {
            this.formFieldDropDown.destroy();
            this.formFieldDropDown = undefined;
        }

        // Clear all references
        this.container = undefined;
        this.ribbonId = undefined;
    }
}
