import { createElement, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { CheckBox, Button } from '@syncfusion/ej2-buttons';
import { DocumentEditor } from '../../document-editor';
import { DocumentHelper } from '../viewer';
import { FieldElementBox, ElementBox, DropDownFormField } from '../viewer/page';
import { ListView } from '@syncfusion/ej2-lists';

/**
 * Form field drop-down dialog is used to modify the value in drop-down form field.
 */
export class DropDownFormFieldDialog {
    private target: HTMLElement;
    private owner: DocumentEditor;
    private drpDownItemsInput: HTMLInputElement;
    private listviewInstance: ListView;
    private addButton: Button;
    private editButton: Button;
    private removeButton: Button;
    private tooltipInput: HTMLInputElement;
    private bookmarkInput: HTMLInputElement;
    private dropDownEnable: CheckBox;
    private moveUpButton: Button;
    private moveDownButton: Button;
    private currentSelectedItem: string;
    private dropDownInstance: DropDownFormField;
    private fieldBegin: FieldElementBox;
    private dropDownItems: string[];

    public constructor(owner: DocumentEditor) {
        this.owner = owner;
    }

    private get documentHelper(): DocumentHelper {
        return this.owner.documentHelper;
    }

    private getModuleName(): string {
        return 'DropDownFormFieldDialog';
    }
    /* eslint-disable  */
    /**
     * @private
     * @param {L10n} localValue - Specifies the locale value
     * @param {boolean} isRtl - Specifies the is rtl
     * @returns {void}
     */
    private initTextDialog(localValue: L10n, isRtl?: boolean): void {
        this.target = createElement('div');
        let dialogDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        let firstDiv: HTMLElement = createElement('div', { className: 'e-de-drp-dwn-frst-div' });
        let drpDownItemsLabel: HTMLElement = createElement('div', {
            className: 'e-de-ff-dlg-heading-small',
            innerHTML: localValue.getConstant('Drop-down items')
        });
        this.drpDownItemsInput = createElement('input', {
            className: 'e-input e-bookmark-textbox-input',
            id: 'fielditems_text_box'
        }) as HTMLInputElement;
        this.drpDownItemsInput.addEventListener('keyup', this.onKeyUpOnTextBox);
        let secondDiv: HTMLElement = createElement('div', { className: 'e-de-ff-drpdwn-dlg-scndiv' });
        let itemsDrpItemsLabel: HTMLElement = createElement('div', {
            className: 'e-de-ff-dlg-drpdwn-heading',
            innerHTML: localValue.getConstant('Items in drop-down list')
        });
        let listviewDiv: HTMLElement = createElement('div', {
            className: 'e-bookmark-listViewDiv e-de-ff-drpdwn-listview',
            attrs: { style: 'height:100%' }
        });
        this.listviewInstance = new ListView({
            cssClass: 'e-bookmark-listview',
            select: this.selectHandler
        });
        let buttonDiv: HTMLElement = createElement('div');
        let addButtonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-addbutton' });
        let addButtonEle: HTMLElement = createElement('button', {
            innerHTML: localValue.getConstant('ADD'),
            attrs: { type: 'button', style: 'height:36px;width:100%' }
        });
        this.addButton = new Button({ cssClass: 'e-button-custom' });
        this.addButton.disabled = true;
        addButtonEle.addEventListener('click', this.addItemtoList.bind(this));
        let editButtonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-addbutton' });
        editButtonDiv.style.display = 'none';
        let editButtonEle: HTMLElement = createElement('button', {
            innerHTML: 'EDIT',
            attrs: { type: 'button', style: 'height:36px;width:100%' }
        });
        this.editButton = new Button({ cssClass: 'e-button-custom' });
        let removeButtonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-addbutton' });
        let removeButtonEle: HTMLElement = createElement('button', {
            innerHTML: localValue.getConstant('REMOVE'),
            attrs: { type: 'button', style: 'height:36px;width:100%' }
        });
        this.removeButton = new Button({ cssClass: 'e-button-custom' });
        removeButtonEle.addEventListener('click', this.removeItemFromList.bind(this));
        let moveBtnDiv: HTMLElement = createElement('div', { attrs: { style: 'display:inline-flex' } });
        let moveUpButtonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-addbutton' });
        let moveUpButtonEle: HTMLElement = createElement('button', {
            attrs: { type: 'button', style: 'height:36px;width:36px' },
            className: 'e-de-ff-drpdwn-mvup'
        });
        this.moveUpButton = new Button({ cssClass: 'e-button-custom', iconCss: 'e-de-arrow-up' });
        moveUpButtonEle.addEventListener('click', this.moveUpItem.bind(this));
        let moveDownButtonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-addbutton' });
        let moveDownButtonEle: HTMLElement = createElement('button', {
            attrs: { type: 'button', style: 'height:36px;width:36px' },
            className: 'e-de-ff-drpdwn-mvdn'
        });
        this.moveDownButton = new Button({ cssClass: 'e-button-custom', iconCss: 'e-de-arrow-down' });
        moveDownButtonEle.addEventListener('click', this.moveDownItem.bind(this));
        let fileSettingsLabel: HTMLElement = createElement('div', {
            className: 'e-de-ff-dlg-heading',
            innerHTML: localValue.getConstant('Field settings')
        });
        let thirdDiv: HTMLElement = createElement('div', { className: 'e-de-div-seperate-dlg' });
        let toolTipDiv: HTMLElement = createElement('div', { className: 'e-de-ff-dlg-lft-hlf' });
        let bookmarkDiv: HTMLElement = createElement('div', { className: 'e-de-ff-dlg-rght-hlf' });
        let toolTipLabel: HTMLElement = createElement('div', {
            className: 'e-de-ff-dlg-heading-small',
            innerHTML: localValue.getConstant('Tooltip')
        });
        this.tooltipInput = createElement('input', { className: 'e-input e-bookmark-textbox-input' }) as HTMLInputElement;
        let bookmarkLabel: HTMLElement = createElement('div', {
            className: 'e-de-ff-dlg-heading-small',
            innerHTML: localValue.getConstant('Name')
        });
        this.bookmarkInput = createElement('input', { className: 'e-input e-bookmark-textbox-input' }) as HTMLInputElement;
        let dropDownEnableDiv: HTMLElement = createElement('div');
        let dropDownEnableEle: HTMLInputElement = createElement('input', { attrs: { type: 'checkbox' } }) as HTMLInputElement;
        this.dropDownEnable = new CheckBox({
            cssClass: 'e-de-ff-dlg-check',
            label: localValue.getConstant('Dropdown enabled'),
            enableRtl: isRtl
        });
        if (isRtl) {
            listviewDiv.classList.add('e-de-rtl');
            moveUpButtonEle.classList.add('e-de-rtl');
            toolTipDiv.classList.add('e-de-rtl');
            bookmarkDiv.classList.add('e-de-rtl');
        }

        this.target.appendChild(dialogDiv);
        dialogDiv.appendChild(firstDiv);
        firstDiv.appendChild(drpDownItemsLabel);
        firstDiv.appendChild(this.drpDownItemsInput);
        dialogDiv.appendChild(itemsDrpItemsLabel);

        dialogDiv.appendChild(secondDiv);
        secondDiv.appendChild(listviewDiv);
        this.listviewInstance.appendTo(listviewDiv);

        secondDiv.appendChild(buttonDiv);

        buttonDiv.appendChild(addButtonDiv);
        addButtonDiv.appendChild(addButtonEle);
        this.addButton.appendTo(addButtonEle);

        buttonDiv.appendChild(editButtonDiv);
        editButtonDiv.appendChild(editButtonEle);
        this.editButton.appendTo(editButtonEle);

        buttonDiv.appendChild(removeButtonDiv);
        removeButtonDiv.appendChild(removeButtonEle);
        this.removeButton.appendTo(removeButtonEle);

        buttonDiv.appendChild(moveBtnDiv);

        moveBtnDiv.appendChild(moveUpButtonDiv);
        moveUpButtonDiv.appendChild(moveUpButtonEle);
        this.moveUpButton.appendTo(moveUpButtonEle);

        moveBtnDiv.appendChild(moveDownButtonDiv);
        moveDownButtonDiv.appendChild(moveDownButtonEle);
        this.moveDownButton.appendTo(moveDownButtonEle);

        dialogDiv.appendChild(fileSettingsLabel);
        dialogDiv.appendChild(thirdDiv);
        thirdDiv.appendChild(toolTipDiv);
        toolTipDiv.appendChild(toolTipLabel);
        toolTipDiv.appendChild(this.tooltipInput);
        thirdDiv.appendChild(bookmarkDiv);
        bookmarkDiv.appendChild(bookmarkLabel);
        bookmarkDiv.appendChild(this.bookmarkInput);

        dialogDiv.appendChild(dropDownEnableDiv);
        dropDownEnableDiv.appendChild(dropDownEnableEle);
        this.dropDownEnable.appendTo(dropDownEnableEle);

    }
    /**
     * @private
     * @returns {void}
     */
    public show(): void {
        let localObj: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localObj.setLocale(this.documentHelper.owner.locale);
        if (isNullOrUndefined(this.target)) {
            this.initTextDialog(localObj, this.documentHelper.owner.enableRtl);
        }
        this.loadDropDownDialog();
        this.documentHelper.dialog.header = localObj.getConstant('Drop Down Form Field');
        this.documentHelper.dialog.position = { X: 'center', Y: 'center' };
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = '448px';
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.buttons = [{
            click: this.insertDropDownField,
            buttonModel: { content: localObj.getConstant('Ok'), cssClass: 'e-flat e-table-cell-margin-okay', isPrimary: true }
        },
        {
            click: this.onCancelButtonClick,
            buttonModel: { content: localObj.getConstant('Cancel'), cssClass: 'e-flat e-table-cell-margin-cancel' }
        }];
        this.documentHelper.dialog.show();
    }

    /**
     * @private
     * @returns {void}
     */
    public loadDropDownDialog(): void {
        let inline: ElementBox = this.owner.selection.getCurrentFormField();
        if (inline instanceof FieldElementBox) {
            this.fieldBegin = inline;
            this.dropDownInstance = inline.formFieldData as DropDownFormField;
            if (this.dropDownInstance.dropdownItems.length > 0) {
                let index: number = this.dropDownInstance.selectedIndex;
                this.currentSelectedItem = this.dropDownInstance.dropdownItems[index];
            }
            if (this.dropDownInstance.enabled) {
                this.dropDownEnable.checked = true;
            } else {
                this.dropDownEnable.disabled = false;
            }
            if (this.dropDownInstance.helpText !== '') {
                (this.tooltipInput as HTMLInputElement).value = this.dropDownInstance.helpText;
            } else {
                (this.tooltipInput as HTMLInputElement).value = '';
            }
            if (this.dropDownInstance.name !== '') {
                (this.bookmarkInput as HTMLInputElement).value = this.dropDownInstance.name;
            } else {
                (this.bookmarkInput as HTMLInputElement).value = '';
            }
            this.dropDownItems = this.dropDownInstance.dropdownItems.slice();
            this.updateList();
        }
    }

    // sets updated list to dialog & refresh the List
    private updateList(): void {
        this.listviewInstance.dataSource = this.dropDownItems.slice();
        this.listviewInstance.dataBind();
        if (this.currentSelectedItem) {
            let toSelectItem: any = this.currentSelectedItem;
            this.listviewInstance.selectItem(toSelectItem);
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public addItemtoList = (): void => {
        this.dropDownItems.push((this.drpDownItemsInput as HTMLInputElement).value);
        this.currentSelectedItem = (this.drpDownItemsInput as HTMLInputElement).value;
        (this.drpDownItemsInput as HTMLInputElement).value = '';
        this.enableOrDisableButton();
        this.updateList();
    }

    /**
     * @private
     * @returns {void}
     */
    public removeItemFromList = (): void => {
        for (let i: number = 0; i < this.dropDownItems.length; i++) {
            if (this.dropDownItems[i] === this.currentSelectedItem) {
                this.dropDownItems.splice(i, 1);
            }
        }
        this.updateList();
    }

    /**
     * @private
     * @returns {void}
     */
    private selectHandler = (args: any): void => {
        this.currentSelectedItem = args.text;
    }


    /**
     * @private
     * @returns {void}
     */
    public moveUpItem = (): void => {
        let index: number = this.getSelectedIndex();
        this.moveUp(index, (index - 1));
        this.updateList();
    }


    /**
     * @private
     * @returns {void}
     */
    public moveDownItem = (): void => {
        let index: number = this.getSelectedIndex();
        this.moveDown(index, (index + 1));
        this.updateList();
    }

    private getSelectedIndex(): number {
        for (let i: number = 0; i < this.dropDownItems.length; i++) {
            if (this.dropDownItems[i] === this.currentSelectedItem) {
                return i;
            }
        }
        return 0;
    }

    private moveUp(fromIndex: number, toIndex: number): void {
        let tempData: string[] = [];
        if (fromIndex === 0) {
            for (let i: number = 0; i < this.dropDownItems.length; i++) {
                if (i < (this.dropDownItems.length - 1)) {
                    tempData[i] = this.dropDownItems[i + 1];
                } else {
                    tempData[i] = this.dropDownItems[0];
                }
            }
            this.dropDownItems = tempData;
        } else {
            let temp: string = this.dropDownItems[fromIndex];
            this.dropDownItems[fromIndex] = this.dropDownItems[toIndex];
            this.dropDownItems[toIndex] = temp;
        }
    }

    private moveDown(fromIndex: number, toIndex: number): void {
        let tempData: string[] = [];
        if (fromIndex === (this.dropDownItems.length - 1)) {
            for (let i: number = 0; i < this.dropDownItems.length; i++) {
                if (i !== 0) {
                    tempData[i] = this.dropDownItems[i - 1];
                } else {
                    tempData[i] = this.dropDownItems[(this.dropDownItems.length - 1)];
                }
            }
            this.dropDownItems = tempData;
        } else {
            let temp: string = this.dropDownItems[fromIndex];
            this.dropDownItems[fromIndex] = this.dropDownItems[toIndex];
            this.dropDownItems[toIndex] = temp;
        }
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
            this.addButton.disabled = ((this.drpDownItemsInput as HTMLInputElement).value === '');
        }
    }


    /**
     * @private
     * @returns {void}
     */
    public onCancelButtonClick = (): void => {
        this.documentHelper.dialog.hide();
    }


    /**
     * @private
     * @returns {void}
     */
    public insertDropDownField = (): void => {
        let dropDownField: DropDownFormField = new DropDownFormField();
        dropDownField.dropdownItems = this.dropDownItems;
        dropDownField.selectedIndex = 0;
        dropDownField.name = this.bookmarkInput.value;
        dropDownField.helpText = this.tooltipInput.value;
        dropDownField.enabled = this.dropDownEnable.checked;
        this.owner.editor.editFormField('DropDown', dropDownField);
        this.closeDropDownField();
    }

    /**
     * @private
     * @returns {void}
     */
    private closeDropDownField = (): void => {
        this.documentHelper.dialog.hide();
        this.documentHelper.dialog.element.style.pointerEvents = '';
    }

    /**
     * @private
     * @returns {void}
     */
    private destroy(): void {
        let dropDownDialogTarget: HTMLElement = this.target;
        if (dropDownDialogTarget) {
            if (dropDownDialogTarget.parentElement) {
                dropDownDialogTarget.parentElement.removeChild(dropDownDialogTarget);
            }
            this.target = undefined;
        }
        this.owner = undefined;
        this.drpDownItemsInput = undefined;
        if (this.listviewInstance) {
            this.listviewInstance.destroy();
            this.listviewInstance = undefined;
        }
        if (this.addButton) {
            this.addButton.destroy();
            this.addButton = undefined;
        }
        if (this.editButton) {
            this.editButton.destroy();
            this.editButton = undefined;
        }
        if (this.removeButton) {
            this.removeButton.destroy();
            this.removeButton = undefined;
        }
        if (this.moveUpButton) {
            this.moveUpButton.destroy();
            this.moveUpButton = undefined;
        }
        if (this.moveDownButton) {
            this.moveDownButton.destroy();
            this.moveDownButton = undefined;
        }
        this.tooltipInput = undefined;
        this.bookmarkInput = undefined;
        if (this.dropDownEnable) {
            this.dropDownEnable.destroy();
            this.dropDownEnable = undefined;
        }
        this.dropDownInstance = undefined;
    }
}