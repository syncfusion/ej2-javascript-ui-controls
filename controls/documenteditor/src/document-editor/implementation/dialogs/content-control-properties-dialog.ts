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

    private container: HTMLElement;
    private generalDiv: HTMLDivElement;
    private genLabel: HTMLElement;
    private displayText: HTMLElement;
    private colorDiv: HTMLElement;
    private fontColorLabel: HTMLElement;
    private fontColorElement: HTMLElement;
    private style: HTMLElement;
    private remove: HTMLElement;
    private removeContent: HTMLInputElement;
    private lockedDiv: HTMLDivElement;
    private lockedLabel: HTMLElement;
    private contentDelete: HTMLElement;
    private contentDeleted: HTMLInputElement;
    private contentEdit: HTMLElement;
    private contentEdited: HTMLInputElement;
    private plainTextLabel: HTMLElement;
    private multiline: HTMLInputElement;
    private lockedcontentLabel: HTMLElement;
    private commonDiv: HTMLElement;
    private searchDiv: HTMLElement;
    private textBoxDiv: HTMLElement;
    private valueBoxDiv: HTMLElement;
    private listviewDiv: HTMLElement;
    private buttonDiv: HTMLElement;
    private addbuttonDiv: HTMLElement;
    private addButtonElement: HTMLElement;
    private deleteButtonDiv: HTMLElement;
    private deleteButtonElement: HTMLElement;

    private keyUpOnTextBoxClickHandler: EventListenerOrEventListenerObject = this.onKeyUpOnTextBoxClicked.bind(this);
    private setButtonClickHandler: EventListenerOrEventListenerObject = this.onSetButtonClick.bind(this);
    private clearButtonClickHandler: EventListenerOrEventListenerObject = this.onClearButtonClick.bind(this);

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
        this.target = createElement('div', { className: 'e-de-cont-cntr' });
        this.container = createElement('div');
        this.generalDiv = createElement('div') as HTMLDivElement;
        this.genLabel = createElement('div', { className: 'e-de-para-dlg-heading', innerHTML: localeValue.getConstant('General') });
        this.generalDiv.appendChild(this.genLabel);
        this.displayText = createElement('div', { className: 'e-de-dlg-container' });
        this.titleText = createElement('input', { className: 'e-input' }) as HTMLInputElement;
        this.displayText.appendChild(this.titleText);
        this.generalDiv.appendChild(this.displayText);
        this.tagText = createElement('input', { className: 'e-input' }) as HTMLInputElement;
        this.generalDiv.appendChild(this.tagText);

        this.colorDiv = createElement('div', { className: 'e-de-container-row' });
        this.colorDiv.style.paddingTop = '10px';
        this.fontColorDiv = createElement('div', { className: 'e-de-font-dlg-display' });
        this.fontColorLabel = createElement('label', {
            className: 'e-de-font-dlg-header-font-color e-de-font-color-margin',
            innerHTML: localeValue.getConstant('Color')
        });
        // if (isRtl) {
        //     fontColorLabel.classList.add('e-de-rtl');
        // }
        this.fontColorDiv.appendChild(this.fontColorLabel);
        this.fontColorElement = this.createInputElement('color', this.target.id + '_ColorDiv', 'e-de-font-dlg-color');
        this.fontColorDiv.appendChild(this.fontColorElement);
        this.colorDiv.appendChild(this.fontColorDiv);
        this.generalDiv.appendChild(this.colorDiv);
        const { columns, createPopupOnClick, cssClass, disabled, enablePersistence, inline, mode, modeSwitcher, noColor, presetColors,
            showButtons } = this.documentHelper.owner.documentEditorSettings.colorPickerSettings;
        this.colorPicker = new ColorPicker({
            change: this.fontColorUpdate, value: '#000000', locale: this.documentHelper.owner.locale, enableOpacity: false, mode: mode, modeSwitcher: modeSwitcher, showButtons: showButtons, columns: columns, createPopupOnClick: createPopupOnClick, cssClass: cssClass, disabled: disabled, enablePersistence: enablePersistence, inline: inline, noColor: noColor, presetColors: presetColors
        });
        this.colorPicker.appendTo(this.fontColorElement);
        this.style = createElement('div', { styles: 'display:block' });
        this.generalDiv.appendChild(this.style);

        this.remove = createElement('div', { styles: 'display:block' });
        this.generalDiv.appendChild(this.remove);
        this.removeContent = createElement('input', {
            attrs: { type: 'checkbox' }
        }) as HTMLInputElement;
        this.remove.appendChild(this.removeContent);

        this.removeCheckBox = new CheckBox({
            label: localeValue.getConstant('Remove content control when contents are edited'),
            cssClass: 'e-de-para-dlg-cs-check-box'
        });
        this.removeCheckBox.appendTo(this.removeContent);
        this.removeContent.setAttribute('aria-label', localeValue.getConstant('Remove content control when contents are edited'));
        this.container.appendChild(this.generalDiv);

        this.lockedDiv = createElement('div') as HTMLDivElement;
        this.lockedDiv.style.paddingTop = '10px';
        this.lockedLabel = createElement('div', { className: 'e-de-para-dlg-heading', innerHTML: localeValue.getConstant('Locking') });
        this.lockedDiv.appendChild(this.lockedLabel);
        this.contentDelete = createElement('div', { styles: 'display:block' });
        this.lockedDiv.appendChild(this.contentDelete);
        this.contentDeleted = createElement('input', {
            attrs: { type: 'checkbox' }
        }) as HTMLInputElement;
        this.contentDelete.appendChild(this.contentDeleted);
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
        this.contentDeletedCheckBox.appendTo(this.contentDeleted);
        this.contentDeleted.setAttribute('aria-label', localeValue.getConstant('Content control cannot be deleted'));
        this.contentEdit = createElement('div', { styles: 'display:block' });
        this.lockedDiv.appendChild(this.contentEdit);
        this.contentEdited = createElement('input', {
            attrs: { type: 'checkbox' }
        }) as HTMLInputElement;
        this.contentEdit.appendChild(this.contentEdited);
        this.contentEditedCheckBox = new CheckBox({
            label: localeValue.getConstant('Contents cannot be edited'),
            cssClass: 'e-de-para-dlg-cs-check-box'
        });
        this.contentEditedCheckBox.appendTo(this.contentEdited);
        this.contentEdited.setAttribute('aria-label', localeValue.getConstant('Contents cannot be edited'));
        this.container.appendChild(this.lockedDiv);
        this.plainTextPropertiesDiv = createElement('div') as HTMLDivElement;
        this.plainTextPropertiesDiv.style.marginTop = '10px';
        this.plainTextPropertiesDiv.style.display = 'none';
        this.plainTextLabel = createElement('div', { className: 'e-de-para-dlg-heading', innerHTML: localeValue.getConstant('Plain Text properties') });
        this.plainTextPropertiesDiv.appendChild(this.plainTextLabel);

        this.multiline = createElement('input', {
            attrs: { type: 'checkbox' }
        }) as HTMLInputElement;
        this.plainTextPropertiesDiv.appendChild(this.multiline);

        this.multilineCheckBox = new CheckBox({
            label: localeValue.getConstant('Allow carriage returns'),
            //enableRtl: isRtl,
            cssClass: 'e-de-para-dlg-cs-check-box'
        });
        this.multilineCheckBox.appendTo(this.multiline);
        this.multiline.setAttribute('aria-label', localeValue.getConstant('Allow carriage returns'));
        this.container.appendChild(this.plainTextPropertiesDiv);
        this.dropDownPropertiesDiv = createElement('div') as HTMLDivElement;
        this.dropDownPropertiesDiv.style.marginTop = '10px';
        this.dropDownPropertiesDiv.style.display = 'none';
        this.lockedcontentLabel = createElement('div', { className: 'e-de-para-dlg-heading', innerHTML: localeValue.getConstant('Drop_Down List properties') });
        this.dropDownPropertiesDiv.appendChild(this.lockedcontentLabel);
        this.commonDiv = createElement('div', { className: 'e-bookmark-common' });
        this.dropDownPropertiesDiv.appendChild(this.commonDiv);
        this.searchDiv = createElement('div', { className: 'e-bookmark-list' });
        this.commonDiv.appendChild(this.searchDiv);
        this.textBoxDiv = createElement('div', { className: 'e-bookmark-textboxdiv' });
        this.searchDiv.appendChild(this.textBoxDiv);
        this.textBoxInput = createElement('input', { className: 'e-input e-bookmark-textbox-input', id: 'bookmark_text_box' }) as HTMLInputElement;
        this.textBoxInput.setAttribute('type', 'text');
        this.textBoxInput.addEventListener('keyup', this.keyUpOnTextBoxClickHandler);
        this.textBoxInput.setAttribute('aria-label', localeValue.getConstant('Display Text'));

        this.textBoxDiv.appendChild(this.textBoxInput);

        this.valueBoxDiv = createElement('div', { className: 'e-bookmark-textboxdiv' });
        this.searchDiv.appendChild(this.valueBoxDiv);
        this.valueBoxInput = createElement('input', { className: 'e-input e-bookmark-textbox-input', id: 'bookmark_text_box' }) as HTMLInputElement;
        this.valueBoxInput.setAttribute('type', 'text');
        this.valueBoxInput.addEventListener('keyup', this.keyUpOnTextBoxClickHandler);
        this.valueBoxInput.setAttribute('aria-label', localeValue.getConstant('Value'));

        this.valueBoxDiv.appendChild(this.valueBoxInput);

        this.listviewDiv = createElement('div', { className: 'e-bookmark-listViewDiv', id: 'bookmark_listview', attrs: { tabindex: '-1', role: 'listbox' } });
        this.searchDiv.appendChild(this.listviewDiv);

        this.listviewInstance = new ListView({
            cssClass: 'e-bookmark-listview',
            select: this.selectHandler,
            fields: { text: 'value' }

        });
        this.listviewInstance.appendTo(this.listviewDiv);
        this.buttonDiv = createElement('div', { className: 'e-bookmark-button' });
        this.commonDiv.appendChild(this.buttonDiv);
        this.addbuttonDiv = createElement('div', { className: 'e-bookmark-addbutton' });
        this.buttonDiv.appendChild(this.addbuttonDiv);
        this.addButtonElement = createElement('button', {
            innerHTML: 'Add', id: 'add',
            attrs: { type: 'button' }
        });
        this.addButtonElement.setAttribute('aria-label', localeValue.getConstant('Add'));
        this.addbuttonDiv.appendChild(this.addButtonElement);
        this.addButton = new Button({ cssClass: 'e-button-custom' });
        this.addButton.disabled = true;
        this.addButton.appendTo(this.addButtonElement);
        //addButtonElement.addEventListener('click', this.setButtonClick);
        this.addButtonElement.addEventListener('click', this.setButtonClickHandler);
        this.deleteButtonDiv = createElement('div', { className: 'e-bookmark-deletebutton' });
        this.buttonDiv.appendChild(this.deleteButtonDiv);
        this.deleteButtonElement = createElement('button', {
            innerHTML: 'Delete', id: 'delete',
            attrs: { type: 'button' }
        });
        this.deleteButtonElement.setAttribute('aria-label', 'Delete');
        this.deleteButtonDiv.appendChild(this.deleteButtonElement);
        this.deleteButton = new Button({ cssClass: 'e-button-custom' });
        this.deleteButton.appendTo(this.deleteButtonElement);
        this.deleteButtonElement.addEventListener('click', this.clearButtonClickHandler);

        this.container.appendChild(this.dropDownPropertiesDiv);
        this.target.appendChild(this.container);

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
    private onClearButtonClick(args: any): void {
        this.clearButtonClick(args);
    }
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
    private onSetButtonClick(args: any): void {
        this.setButtonClick(args);
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
    private onKeyUpOnTextBoxClicked(): void {
        this.onKeyUpOnTextBox();
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
        this.currentContentControl = this.documentHelper.owner.selection.currentContentControl;
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
        let start: TextPosition = this.documentHelper.selection.start.clone();
        let end: TextPosition = this.documentHelper.selection.end.clone();
        let offset: number = this.currentContentControl.line.getOffset(this.currentContentControl, 1);
        this.documentHelper.selection.start.setPositionParagraph(this.currentContentControl.line, offset);
        this.documentHelper.selection.end.setPositionParagraph(this.currentContentControl.line, offset + 1);
        this.documentHelper.owner.editorModule.initHistory('UpdateContentControl');
        const properties: any = this.documentHelper.owner.editor.getContentControlPropObject(this.currentContentControl.contentControlProperties);
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
        if (this.documentHelper.owner.editorHistoryModule) {
            if (this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo) {
                this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo.modifiedProperties.push(properties);
                const format: any = this.documentHelper.owner.editor.getContentControlPropObject(this.currentContentControl.contentControlProperties);
                this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo.format = JSON.stringify(format);
            }
            this.documentHelper.owner.editorHistoryModule.updateHistory();
        }
        this.documentHelper.selection.selectRange(start, end);
        this.unWireEventsAndBindings();
        this.documentHelper.dialog.hide();
        this.documentHelper.viewer.updateScrollBars();
        this.documentHelper.updateFocus();
        this.documentHelper.owner.editorModule.fireContentChange();
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
        this.removeEvents();
        this.removeElements();
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
    private removeEvents(): void {
        if (this.addButtonElement) {
            this.addButtonElement.removeEventListener('click', this.setButtonClickHandler);
        }
        if (this.deleteButtonElement) {
            this.deleteButtonElement.removeEventListener('click', this.clearButtonClickHandler);
        }
        if (this.textBoxInput) {
            this.textBoxInput.removeEventListener('keyup', this.keyUpOnTextBoxClickHandler);
        }
        if (this.valueBoxInput) {
            this.valueBoxInput.removeEventListener('keyup', this.keyUpOnTextBoxClickHandler);
        }
    }
    private removeElements(): void {
        if (this.generalDiv){
            this.generalDiv.remove();
            this.generalDiv = undefined;
        }
        if (this.genLabel){
            this.genLabel.remove();
            this.genLabel = undefined;
        }
        if (this.displayText){
            this.displayText.remove();
            this.displayText = undefined;
        }
        if (this.colorDiv){
            this.colorDiv.remove();
            this.colorDiv = undefined;
        }
        if (this.fontColorDiv){
            this.fontColorDiv.remove();
            this.fontColorDiv = undefined;
        }
        if (this.fontColorLabel){
            this.fontColorLabel.remove();
            this.fontColorLabel = undefined;
        }
        if (this.fontColorElement){
            this.fontColorElement.remove();
            this.fontColorElement = undefined;
        }
        if (this.style){
            this.style.remove();
            this.style = undefined;
        }
        if (this.remove){
            this.remove.remove();
            this.remove = undefined;
        }
        if (this.removeContent){
            this.removeContent.remove();
            this.removeContent = undefined;
        }
        if (this.lockedDiv){
            this.lockedDiv.remove();
            this.lockedDiv = undefined;
        }
        if (this.lockedLabel){
            this.lockedLabel.remove();
            this.lockedLabel = undefined;
        }
        if (this.contentDelete){
            this.contentDelete.remove();
            this.contentDelete = undefined;
        }
        if (this.contentDeleted){
            this.contentDeleted.remove();
            this.contentDeleted = undefined;
        }
        if (this.contentEdit){
            this.contentEdit.remove();
            this.contentEdit = undefined;
        }
        if (this.contentEdited){
            this.contentEdited.remove();
            this.contentEdited = undefined;
        }
        if (this.plainTextLabel){
            this.plainTextLabel.remove();
            this.plainTextLabel = undefined;
        }
        if (this.multiline){
            this.multiline.remove();
            this.multiline = undefined;
        }
        if (this.lockedcontentLabel){
            this.lockedcontentLabel.remove();
            this.lockedcontentLabel = undefined;
        }
        if (this.commonDiv){
            this.commonDiv.remove();
            this.commonDiv = undefined;
        }
        if (this.searchDiv){
            this.searchDiv.remove();
            this.searchDiv = undefined;
        }
        if (this.textBoxDiv){
            this.textBoxDiv.remove();
            this.textBoxDiv = undefined;
        }
        if (this.valueBoxDiv){
            this.valueBoxDiv.remove();
            this.valueBoxDiv = undefined;
        }
        if (this.listviewDiv){
            this.listviewDiv.remove();
            this.listviewDiv = undefined;
        }
        if (this.buttonDiv){
            this.buttonDiv.remove();
            this.buttonDiv = undefined;
        }
        if (this.addbuttonDiv){
            this.addbuttonDiv.remove();
            this.addbuttonDiv = undefined;
        }
        if (this.addButtonElement){
            this.addButtonElement.remove();
            this.addButtonElement = undefined;
        }
        if (this.deleteButtonDiv){
            this.deleteButtonDiv.remove();
            this.deleteButtonDiv = undefined;
        }
        if (this.deleteButtonElement){
            this.deleteButtonElement.remove();
            this.deleteButtonElement = undefined;
        }
    }
}
