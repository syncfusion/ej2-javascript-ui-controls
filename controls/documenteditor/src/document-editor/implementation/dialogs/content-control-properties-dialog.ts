import { ListView } from '@syncfusion/ej2-lists';
import { Button, ChangeEventArgs, CheckBox, RadioButton } from '@syncfusion/ej2-buttons';
import { createElement, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ContentControl, ContentControlListItems, ElementBox, TabStopListInfo, TextElementBox } from '../viewer/page';
import { SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { ColorPicker, ColorPickerEventArgs, NumericTextBox, TextBox } from '@syncfusion/ej2-inputs';
import { ElementInfo, HelperMethods, PositionInfo } from '../editor/editor-helper';
import { TabJustification, TabLeader } from '../../base/types';
import { WTabStop } from '../format/paragraph-format';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { SelectionCharacterFormat } from '../selection';
import { TextPosition } from '../selection/selection-helper';
import { WCharacterFormat } from '../format';
import { DocumentHelper } from '../viewer';
import { ListBox } from '@syncfusion/ej2-dropdowns';
import { ListViewModel } from './list-view-model';

export class ContentControlPropertiesDialog {
    /**
     * @private
     */
    public documentHelper: DocumentHelper;
    private localeValue: L10n;
    private target: HTMLElement;
    private titleText: HTMLInputElement;
    private tagText: HTMLInputElement;
    private fontColorDiv: HTMLElement;
    private removeCheckBox: CheckBox;
    private contentEditedCheckBox: CheckBox;
    private contentDeletedCheckBox: CheckBox;
    private multilineCheckBox: CheckBox;
    private colorPicker: ColorPicker = undefined;
    private fontColor: string = undefined;
    private dropDownPropertiesDiv: HTMLElement;
    private plainTextPropertiesDiv: HTMLElement;
    private currentContentControl: ContentControl;
    private listviewInstance: ListView;
    private textBoxInput: HTMLInputElement;
    private valueBoxInput: HTMLInputElement;
    private addButton: Button;
    private deleteButton: Button;
    private convertedItems: { [key: string]: Object }[];
    private currentSelectedItem: string;

    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }

    /**
     * @private
     */
    public characterFormat: WCharacterFormat = undefined;

    private getModuleName(): string {
        return 'ContentControlPropertiesDialog';
    }
    private createInputElement(type: string, id: string, className: string): HTMLInputElement {
        const element: HTMLInputElement = createElement('input', {
            attrs: { type: type },
            id: id,
            className: className
        }) as HTMLInputElement;
        return element;
    }
    public initContentControlPropertiesDialog(localeValue: L10n, enableRtl: boolean): void {
        this.target = createElement('div', { className: 'e-de-hyperlink' });
        const container: HTMLElement = createElement('div');
        const generalDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        const genLabel: HTMLElement = createElement('div', { className: 'e-de-para-dlg-heading', innerHTML: localeValue.getConstant('General') });
        generalDiv.appendChild(genLabel);
        const displayText: HTMLElement = createElement('div', { className: 'e-de-dlg-container' });
        this.titleText = createElement('input', { className: 'e-input' }) as HTMLInputElement;
        displayText.appendChild(this.titleText);
        generalDiv.appendChild(displayText);
        this.tagText = createElement('input', { className: 'e-input' }) as HTMLInputElement;
        generalDiv.appendChild(this.tagText);

        const colorDiv: HTMLElement = createElement('div', { className: 'e-de-container-row' });
        colorDiv.style.paddingTop = '10px';
        this.fontColorDiv = createElement('div', { className: 'e-de-font-dlg-display' });
        const fontColorLabel: HTMLElement = createElement('label', {
            className: 'e-de-font-dlg-header-font-color e-de-font-color-margin',
            innerHTML: localeValue.getConstant('Color')
        });
        // if (isRtl) {
        //     fontColorLabel.classList.add('e-de-rtl');
        // }
        this.fontColorDiv.appendChild(fontColorLabel);
        const fontColorElement: HTMLElement = this.createInputElement('color', this.target.id + '_ColorDiv', 'e-de-font-dlg-color');
        this.fontColorDiv.appendChild(fontColorElement);
        colorDiv.appendChild(this.fontColorDiv);
        generalDiv.appendChild(colorDiv);
        const { columns, createPopupOnClick, cssClass, disabled, enablePersistence, inline, mode, modeSwitcher, noColor, presetColors,
            showButtons } = this.documentHelper.owner.documentEditorSettings.colorPickerSettings;
        this.colorPicker = new ColorPicker({
            change: this.fontColorUpdate, value: '#000000', locale: this.documentHelper.owner.locale, enableOpacity: false, mode: mode, modeSwitcher: modeSwitcher, showButtons: showButtons, columns: columns, createPopupOnClick: createPopupOnClick, cssClass: cssClass, disabled: disabled, enablePersistence: enablePersistence, inline: inline, noColor: noColor, presetColors: presetColors
        });
        this.colorPicker.appendTo(fontColorElement);
        const style: HTMLElement = createElement('div', { styles: 'display:block' });
        generalDiv.appendChild(style);

        const remove: HTMLElement = createElement('div', { styles: 'display:block' });
        generalDiv.appendChild(remove);
        const removeContent: HTMLInputElement = createElement('input', {
            attrs: { type: 'checkbox' }
        }) as HTMLInputElement;
        remove.appendChild(removeContent);

        this.removeCheckBox = new CheckBox({
            label: localeValue.getConstant('Remove content control when contents are edited'),
            cssClass: 'e-de-para-dlg-cs-check-box'
        });
        this.removeCheckBox.appendTo(removeContent);
        removeContent.setAttribute('aria-label', localeValue.getConstant('Remove content control when contents are edited'));
        container.appendChild(generalDiv);

        const lockedDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        lockedDiv.style.paddingTop = '10px';
        const lockedLabel: HTMLElement = createElement('div', { className: 'e-de-para-dlg-heading', innerHTML: localeValue.getConstant('Locking') });
        lockedDiv.appendChild(lockedLabel);
        const contentDelete: HTMLElement = createElement('div', { styles: 'display:block' });
        lockedDiv.appendChild(contentDelete);
        const contentDeleted: HTMLInputElement = createElement('input', {
            attrs: { type: 'checkbox' }
        }) as HTMLInputElement;
        contentDelete.appendChild(contentDeleted);
        this.contentDeletedCheckBox = new CheckBox({
            label: localeValue.getConstant('Content control cannot be deleted'),
            cssClass: 'e-de-para-dlg-cs-check-box',
            change: (args: ChangeEventArgs): void => {
                if (args.checked) {
                    this.removeCheckBox.disabled = true;
                    this.removeCheckBox.dataBind();
                } else {
                    this.removeCheckBox.disabled = false;
                    this.removeCheckBox.dataBind();
                }
            }
        });
        this.contentDeletedCheckBox.appendTo(contentDeleted);
        contentDeleted.setAttribute('aria-label', localeValue.getConstant('Content control cannot be deleted'));
        const contentEdit: HTMLElement = createElement('div', { styles: 'display:block' });
        lockedDiv.appendChild(contentEdit);
        const contentEdited: HTMLInputElement = createElement('input', {
            attrs: { type: 'checkbox' }
        }) as HTMLInputElement;
        contentEdit.appendChild(contentEdited);
        this.contentEditedCheckBox = new CheckBox({
            label: localeValue.getConstant('Contents cannot be edited'),
            cssClass: 'e-de-para-dlg-cs-check-box'
        });
        this.contentEditedCheckBox.appendTo(contentEdited);
        contentEdited.setAttribute('aria-label', localeValue.getConstant('Contents cannot be edited'));
        container.appendChild(lockedDiv);
        this.plainTextPropertiesDiv = createElement('div') as HTMLDivElement;
        this.plainTextPropertiesDiv.style.marginTop = '10px';
        this.plainTextPropertiesDiv.style.display = 'none';
        const plainTextLabel: HTMLElement = createElement('div', { className: 'e-de-para-dlg-heading', innerHTML: localeValue.getConstant('Plain Text properties') });
        this.plainTextPropertiesDiv.appendChild(plainTextLabel);

        const multiline: HTMLInputElement = createElement('input', {
            attrs: { type: 'checkbox' }
        }) as HTMLInputElement;
        this.plainTextPropertiesDiv.appendChild(multiline);

        this.multilineCheckBox = new CheckBox({
            label: localeValue.getConstant('Allow carriage returns'),
            //enableRtl: isRtl,
            cssClass: 'e-de-para-dlg-cs-check-box'
        });
        this.multilineCheckBox.appendTo(multiline);
        multiline.setAttribute('aria-label', localeValue.getConstant('Allow carriage returns'));
        container.appendChild(this.plainTextPropertiesDiv);
        this.dropDownPropertiesDiv = createElement('div') as HTMLDivElement;
        this.dropDownPropertiesDiv.style.marginTop = '10px';
        this.dropDownPropertiesDiv.style.display = 'none';
        const lockedcontentLabel: HTMLElement = createElement('div', { className: 'e-de-para-dlg-heading', innerHTML: localeValue.getConstant('Drop_Down List properties') });
        this.dropDownPropertiesDiv.appendChild(lockedcontentLabel);
        const commonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-common' });
        this.dropDownPropertiesDiv.appendChild(commonDiv);
        const searchDiv: HTMLElement = createElement('div', { className: 'e-bookmark-list' });
        commonDiv.appendChild(searchDiv);
        const textBoxDiv: HTMLElement = createElement('div', { className: 'e-bookmark-textboxdiv' });
        searchDiv.appendChild(textBoxDiv);
        this.textBoxInput = createElement('input', { className: 'e-input e-bookmark-textbox-input', id: 'bookmark_text_box' }) as HTMLInputElement;
        this.textBoxInput.setAttribute('type', 'text');
        this.textBoxInput.addEventListener('keyup', this.onKeyUpOnTextBox);
        this.textBoxInput.setAttribute('aria-label', localeValue.getConstant('Display Text'));

        textBoxDiv.appendChild(this.textBoxInput);

        const valueBoxDiv: HTMLElement = createElement('div', { className: 'e-bookmark-textboxdiv' });
        searchDiv.appendChild(valueBoxDiv);
        this.valueBoxInput = createElement('input', { className: 'e-input e-bookmark-textbox-input', id: 'bookmark_text_box' }) as HTMLInputElement;
        this.valueBoxInput.setAttribute('type', 'text');
        this.valueBoxInput.addEventListener('keyup', this.onKeyUpOnTextBox);
        this.valueBoxInput.setAttribute('aria-label', localeValue.getConstant('Value'));

        valueBoxDiv.appendChild(this.valueBoxInput);

        const listviewDiv: HTMLElement = createElement('div', { className: 'e-bookmark-listViewDiv', id: 'bookmark_listview', attrs: { tabindex: '-1', role: 'listbox' } });
        searchDiv.appendChild(listviewDiv);

        this.listviewInstance = new ListView({
            cssClass: 'e-bookmark-listview',
            select: this.selectHandler,
            fields: { text: 'value' }

        });
        this.listviewInstance.appendTo(listviewDiv);
        const buttonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-button' });
        commonDiv.appendChild(buttonDiv);
        const addbuttonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-addbutton' });
        buttonDiv.appendChild(addbuttonDiv);
        const addButtonElement: HTMLElement = createElement('button', {
            innerHTML: 'Add', id: 'add',
            attrs: { type: 'button' }
        });
        addButtonElement.setAttribute('aria-label', localeValue.getConstant('Add'));
        addbuttonDiv.appendChild(addButtonElement);
        this.addButton = new Button({ cssClass: 'e-button-custom' });
        this.addButton.disabled = true;
        this.addButton.appendTo(addButtonElement);
        //addButtonElement.addEventListener('click', this.setButtonClick);
        addButtonElement.addEventListener('click', this.setButtonClick.bind(this));
        const deleteButtonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-deletebutton' });
        buttonDiv.appendChild(deleteButtonDiv);
        const deleteButtonElement: HTMLElement = createElement('button', {
            innerHTML: 'Delete', id: 'delete',
            attrs: { type: 'button' }
        });
        deleteButtonElement.setAttribute('aria-label', 'Delete');
        deleteButtonDiv.appendChild(deleteButtonElement);
        this.deleteButton = new Button({ cssClass: 'e-button-custom' });
        this.deleteButton.appendTo(deleteButtonElement);
        deleteButtonElement.addEventListener('click', this.clearButtonClick);

        container.appendChild(this.dropDownPropertiesDiv);
        this.target.appendChild(container);

        new TextBox({ placeholder: localeValue.getConstant('Title'), floatLabelType: 'Always' }, this.titleText);
        new TextBox({ placeholder: localeValue.getConstant('Tag'), floatLabelType: 'Always' }, this.tagText);
        new TextBox({ placeholder: localeValue.getConstant('Display Text'), floatLabelType: 'Always' }, this.textBoxInput);
        new TextBox({ placeholder: localeValue.getConstant('Value'), floatLabelType: 'Always' }, this.valueBoxInput);

    }
    /**
     * @private
     * @returns {void}
     */
    public show(): void {
        const localValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localValue.setLocale(this.documentHelper.owner.locale);
        this.localeValue = localValue;
        if (!this.target) {
            this.initContentControlPropertiesDialog(localValue, false);
        }
        if (this.documentHelper.selection.caret.style.display !== 'none') {
            this.documentHelper.selection.caret.style.display = 'none';
        }
        if (this.dropDownPropertiesDiv.style.display !== 'none' || this.plainTextPropertiesDiv.style.display !== 'none') {
            this.dropDownPropertiesDiv.style.display = 'none';
            this.plainTextPropertiesDiv.style.display = 'none';
        }
        this.documentHelper.dialog.header = localValue.getConstant('Content Control Properties');
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.beforeOpen = this.loadPropertiesdialog;
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.buttons = [
            {
                click: this.applyProperties,
                buttonModel: { content: this.localeValue.getConstant('Ok'), cssClass: 'e-flat e-para-okay', isPrimary: true }
            },
            {
                click: this.closePropertiesDialog,
                buttonModel: { content: this.localeValue.getConstant('Cancel'), cssClass: 'e-flat e-para-cancel' }
            }];
        this.documentHelper.dialog.close = this.documentHelper.updateFocus;
        this.documentHelper.dialog.dataBind();
        this.documentHelper.dialog.show();
    }
    /* eslint-disable  */
    private clearButtonClick = (args: any) => {
        (this.textBoxInput as HTMLInputElement).value = '';
        (this.valueBoxInput as HTMLInputElement).value = '';
        for (let i: number = 0; i < this.convertedItems.length; i++) {
            if (this.convertedItems[parseInt(i.toString(), 10)].value === this.currentSelectedItem) {
                this.currentContentControl.contentControlProperties.contentControlListItems.splice(i, 1);
                this.convertedItems.splice(i, 1);
            }
        }
        this.listviewInstance.dataSource = this.convertedItems.slice();
        this.listviewInstance.dataBind();
    }
    /* eslint-disable  */
    private setButtonClick = (args: any) => {
        if (!isNullOrUndefined((this.textBoxInput as HTMLInputElement).value) ||
            !isNullOrUndefined((this.valueBoxInput as HTMLInputElement).value)) {
            const newItem: ContentControlListItems = new ContentControlListItems();
            newItem.displayText = (this.textBoxInput as HTMLInputElement).value ? (this.textBoxInput as HTMLInputElement).value : '';
            newItem.value = (this.valueBoxInput as HTMLInputElement).value ? (this.valueBoxInput as HTMLInputElement).value : '';
            this.currentContentControl.contentControlProperties.contentControlListItems.push(newItem);
            const convertedItem: { [key: string]: Object } = {
                displayText: newItem.displayText,
                value: newItem.value
            };
            this.convertedItems.push(convertedItem);
            this.listviewInstance.addItem([convertedItem]);
        }
        this.textBoxInput.value = '';
        this.valueBoxInput.value = '';
    }
    /**
     * @private
     * @returns {void}
     */
    public onKeyUpOnTextBox = (): void => {
        this.enableOrDisableButton();
    }

    private enableOrDisableButton(): void {
        if (!isNullOrUndefined(this.addButton)) {
            this.addButton.disabled = this.textBoxInput.value === '' || this.valueBoxInput.value === '';
        }
    }
    private loadPropertiesdialog = (): void => {
        this.currentContentControl = this.documentHelper.owner.editor.getContentControl();
        if (!isNullOrUndefined(this.currentContentControl)) {
            this.contentEditedCheckBox.checked = this.currentContentControl.contentControlProperties.lockContents;
            this.contentDeletedCheckBox.checked = this.currentContentControl.contentControlProperties.lockContentControl;
            this.removeCheckBox.checked = this.currentContentControl.contentControlProperties.isTemporary;
            this.multilineCheckBox.checked = this.currentContentControl.contentControlProperties.multiline;
            this.colorPicker.value = this.currentContentControl.contentControlProperties.color;
            if (this.removeCheckBox.checked) {
                this.contentEditedCheckBox.checked = false;
            }
            this.titleText.value = this.currentContentControl.contentControlProperties.title ? this.currentContentControl.contentControlProperties.title : '';
            this.tagText.value = this.currentContentControl.contentControlProperties.tag ? this.currentContentControl.contentControlProperties.tag : '';
            this.fontColor = this.currentContentControl.contentControlProperties.color;
            if (this.currentContentControl.contentControlProperties.type === 'Text') {
                this.plainTextPropertiesDiv.style.display = 'block';
            } else {
                this.plainTextPropertiesDiv.style.display = 'none';
            }
            if (this.currentContentControl.contentControlProperties.type === 'ComboBox' || this.currentContentControl.contentControlProperties.type === 'DropDownList') {
                this.dropDownPropertiesDiv.style.display = 'block';
            }
            else {
                this.dropDownPropertiesDiv.style.display = 'none';
            }
            if (!isNullOrUndefined(this.currentContentControl.contentControlProperties.contentControlListItems !== undefined)) {
                this.convertedItems = this.currentContentControl.contentControlProperties.contentControlListItems.map(item => {
                    const convertedItem: { [key: string]: Object } = {};
                    for (const prop in item) {
                        convertedItem[`${prop}`] = item[`${prop}`];
                    }
                    return convertedItem;
                });
                this.listviewInstance.dataSource = this.convertedItems;
                this.listviewInstance.dataBind();
            }
        }

        this.documentHelper.updateFocus();

    }
    private applyProperties = (): void => {
        if (!isNullOrUndefined(this.fontColor)) {
            this.currentContentControl.contentControlProperties.color = this.fontColor;
        }
        let contentControlImage: ElementBox = this.documentHelper.owner.getImageContentControl();
        if ((contentControlImage instanceof ContentControl && contentControlImage.contentControlProperties.type == 'Picture')) {
            contentControlImage.contentControlProperties.lockContents = this.contentEditedCheckBox.checked;
            contentControlImage.contentControlProperties.lockContentControl = this.contentDeletedCheckBox.checked;
            contentControlImage.contentControlProperties.isTemporary = this.removeCheckBox.checked;
            if (this.removeCheckBox.checked) {
                contentControlImage.contentControlProperties.lockContents = false;
            }
            contentControlImage.contentControlProperties.title = this.titleText.value !== undefined ? this.titleText.value : '';
            contentControlImage.contentControlProperties.tag = this.tagText.value !== undefined ? this.tagText.value : '';
            contentControlImage.contentControlProperties.multiline = this.multilineCheckBox.checked;
        }
        if (!isNullOrUndefined(this.currentContentControl)) {
            this.currentContentControl.contentControlProperties.lockContents = this.contentEditedCheckBox.checked;
            this.currentContentControl.contentControlProperties.lockContentControl = this.contentDeletedCheckBox.checked;
            this.currentContentControl.contentControlProperties.isTemporary = this.removeCheckBox.checked;
            if (this.removeCheckBox.checked) {
                this.currentContentControl.contentControlProperties.lockContents = false;
            }
            this.currentContentControl.contentControlProperties.title = this.titleText.value !== undefined ? this.titleText.value : '';
            this.currentContentControl.contentControlProperties.tag = this.tagText.value !== undefined ? this.tagText.value : '';
            this.currentContentControl.contentControlProperties.multiline = this.multilineCheckBox.checked;
        }
        this.unWireEventsAndBindings();
        this.documentHelper.dialog.hide();
        this.documentHelper.viewer.updateScrollBars();
        this.documentHelper.updateFocus();
    };
    private closePropertiesDialog = (): void => {
        this.documentHelper.dialog.hide();
        this.unWireEventsAndBindings();
        this.documentHelper.updateFocus();
    };
    private fontColorUpdate = (args: ColorPickerEventArgs): void => {
        if (!isNullOrUndefined(args.currentValue)) {
            this.fontColor = args.currentValue.hex;
        }
    };
    /**
     * @private
     * @param args args value.
     * @returns {void}
     */
    /* eslint-disable  */
    private selectHandler = (args: any): void => {
        this.currentSelectedItem = args.text;
    }
    private unWireEventsAndBindings(): void {
        this.fontColor = undefined;
        this.currentContentControl = undefined;
        this.currentSelectedItem = undefined;
        this.convertedItems = [];
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.contentDeletedCheckBox) {
            this.contentDeletedCheckBox.destroy();
            this.contentDeletedCheckBox = undefined;
        }
        if (this.contentEditedCheckBox) {
            this.contentEditedCheckBox.destroy();
            this.contentEditedCheckBox = undefined;
        }
        if (this.removeCheckBox) {
            this.removeCheckBox.destroy();
            this.removeCheckBox = undefined;
        }
        if (this.multilineCheckBox) {
            this.multilineCheckBox.destroy();
            this.multilineCheckBox = undefined;
        }
        if (this.listviewInstance) {
            this.listviewInstance.destroy();
            this.listviewInstance = undefined;
        }
        if (this.textBoxInput) {
            this.textBoxInput.remove();
            this.textBoxInput = undefined;
        }
        if (this.valueBoxInput) {
            this.valueBoxInput.remove();
            this.valueBoxInput = undefined;
        }
        if (this.titleText) {
            this.titleText.remove();
            this.titleText = undefined;
        }
        if (this.tagText) {
            this.tagText.remove();
            this.tagText = undefined;
        }
        if (this.colorPicker) {
            this.colorPicker.destroy();
        }
        this.colorPicker = undefined;

        this.documentHelper = undefined;
        if (!isNullOrUndefined(this.target)) {
            if (this.target.parentElement) {
                this.target.parentElement.removeChild(this.target);
            }
            for (let i: number = 0; i < this.target.childNodes.length; i++) {
                this.target.removeChild(this.target.childNodes[parseInt(i.toString(), 10)]);
                i--;
            }
            this.target = undefined;
        }
    }
}
