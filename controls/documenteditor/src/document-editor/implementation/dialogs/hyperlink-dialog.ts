import { createElement, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { HyperlinkTextInfo } from '../editor/editor-helper';
import { FieldElementBox } from '../viewer/page';
import { WCharacterFormat } from '../index';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { CheckBox, ChangeEventArgs as CheckBoxChangeArgs } from '@syncfusion/ej2-buttons';
import { DocumentHelper } from '../viewer';

/**
 * The Hyperlink dialog is used to insert or edit hyperlink at selection.
 */
/* eslint-disable max-len */
export class HyperlinkDialog {
    private displayText: string = '';
    private navigationUrl: string = undefined;
    private displayTextBox: HTMLInputElement;
    private addressText: HTMLDivElement;
    private urlTextBox: HTMLInputElement;
    private insertButton: HTMLButtonElement;
    private bookmarkDropdown: DropDownList = undefined;
    private bookmarkCheckbox: CheckBox = undefined;
    private bookmarkDiv: HTMLDivElement;
    private target: HTMLElement;
    /**
     * @private
     */
    public documentHelper: DocumentHelper;
    private bookmarks: string[] = [];
    private localObj: L10n;

    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }

    private getModuleName(): string {
        return 'HyperlinkDialog';
    }
    /**
     * @private
     * @param {L10n} localValue - Specifies the locale value
     * @param {boolean} isRtl - Specifies the is rtl
     * @returns {void}
     */
    public initHyperlinkDialog(localValue: L10n, isRtl?: boolean): void {
        const id: string = this.documentHelper.owner.containerId + '_insert_hyperlink';
        this.target = createElement('div', { id: id, className: 'e-de-hyperlink' });

        const container: HTMLElement = createElement('div');
        const displayText: HTMLElement = createElement('div', { className: 'e-de-hyperlink-dlg-title', innerHTML: localValue.getConstant('Text to display') });
        this.displayTextBox = createElement('input', { id: this.documentHelper.owner.containerId + '_display_text', className: 'e-input e-de-hyperlink-dlg-input' }) as HTMLInputElement;
        this.displayTextBox.addEventListener('keyup', this.onKeyUpOnDisplayBox);
        container.appendChild(displayText);
        container.appendChild(this.displayTextBox);

        this.addressText = createElement('div', { className: 'e-de-hyperlink-dlg-title', innerHTML: localValue.getConstant('Address') }) as HTMLDivElement;
        this.urlTextBox = createElement('input', { id: this.documentHelper.owner.containerId + '_url_text', className: 'e-input e-de-hyperlink-dlg-input', attrs: { autofocus: 'true' } }) as HTMLInputElement;
        this.urlTextBox.addEventListener('input', this.onKeyUpOnUrlBox);
        this.urlTextBox.addEventListener('keyup', this.onKeyUpOnUrlBox);
        container.appendChild(this.addressText);
        container.appendChild(this.urlTextBox);

        this.bookmarkDiv = createElement('div', { styles: 'display:none;' }) as HTMLDivElement;
        const bookmarkText: HTMLElement = createElement('div', { className: 'e-de-hyperlink-dlg-title', innerHTML: localValue.getConstant('Bookmark') });
        const bookmarkTextElement: HTMLElement = createElement('div', { className: 'e-de-hyperlink-dlg-bookmark' });

        const bookmarkValue: HTMLInputElement = createElement('input', { id: 'e-de-hyperlink-dlg-bookmark-value' }) as HTMLInputElement;
        bookmarkTextElement.appendChild(bookmarkValue);

        this.bookmarkDropdown = new DropDownList({ dataSource: [], change: this.onBookmarkchange, popupHeight: '230px', width: '230px', noRecordsTemplate: localValue.getConstant('No bookmarks found') });
        this.bookmarkDropdown.appendTo(bookmarkValue);
        this.bookmarkDiv.appendChild(bookmarkText);
        this.bookmarkDiv.appendChild(bookmarkTextElement);
        container.appendChild(this.bookmarkDiv);

        const bookmarkCheckDiv: HTMLDivElement = createElement('div', { className: 'e-de-hyperlink-bookmark-check e-de-hyperlink-dlg-title' }) as HTMLDivElement;
        const bookmarkCheck: HTMLInputElement = createElement('input', { attrs: { type: 'checkbox' }, id: this.target.id + '_bookmark', className: this.target.id + '_bookmarkcheck' }) as HTMLInputElement;
        bookmarkCheckDiv.appendChild(bookmarkCheck);
        this.bookmarkCheckbox = new CheckBox({
            label: localValue.getConstant('Use bookmarks'),
            enableRtl: isRtl, change: this.onUseBookmarkChange
        });
        this.bookmarkCheckbox.appendTo(bookmarkCheck);
        container.appendChild(bookmarkCheckDiv);
        this.target.appendChild(container);
    }
    /**
     * @private
     * @returns {void}
     */
    public show(): void {
        this.localObj = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        this.localObj.setLocale(this.documentHelper.owner.locale);
        if (!this.target) {
            this.initHyperlinkDialog(this.localObj, this.documentHelper.owner.enableRtl);
        }
        this.documentHelper.dialog.header = this.localObj.getConstant('Insert Hyperlink');
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.buttons = [{
            click: this.onInsertButtonClick,
            buttonModel: { content: this.localObj.getConstant('Ok'), cssClass: 'e-flat e-hyper-insert', isPrimary: true }
        },
        {
            click: this.onCancelButtonClick,
            buttonModel: { content: this.localObj.getConstant('Cancel'), cssClass: 'e-flat e-hyper-cancel' }
        }];
        this.documentHelper.dialog.dataBind();
        this.documentHelper.dialog.beforeOpen = this.loadHyperlinkDialog;
        this.documentHelper.dialog.close = this.closeHyperlinkDialog;
        this.documentHelper.dialog.show();
    }
    /**
     * @private
     * @returns {void}
     */
    public hide(): void {
        this.closeHyperlinkDialog();
    }
    /**
     * @private
     * @param {KeyboardEvent} event - Specifies the event args.
     * @returns {void}
     */
    public onKeyUpOnUrlBox = (event: KeyboardEvent): void => {
        if (event.keyCode === 13) {
            if (this.displayTextBox.value !== '' && this.urlTextBox.value !== '') {
                this.onInsertHyperlink();
            }
            return;
        }
        //const selectedText: string = this.documentHelper.selection.text;
        const urlValue: string = this.urlTextBox.value;
        if (urlValue.substring(0, 4).toLowerCase() === 'www.') {
            this.urlTextBox.value = 'http://' + urlValue;
        }
        if (this.displayText === '') {
            this.displayTextBox.value = urlValue;
        }
        this.enableOrDisableInsertButton();
    };
    /**
     * @private
     * @returns {void}
     */
    public onKeyUpOnDisplayBox = (): void => {
        this.displayText = this.displayTextBox.value;
        this.enableOrDisableInsertButton();
    };
    private enableOrDisableInsertButton(): void {
        if (!isNullOrUndefined(this.insertButton)) {

            this.insertButton.disabled = (this.urlTextBox.value === '' || this.displayTextBox.value === '');
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public onInsertButtonClick = (): void => {
        this.onInsertHyperlink();
    };
    /**
     * @private
     * @returns {void}
     */
    public onCancelButtonClick = (): void => {
        this.documentHelper.dialog.hide();
        this.clearValue();
        this.documentHelper.updateFocus();
    };
    /**
     * @private
     * @returns {void}
     */
    public loadHyperlinkDialog = (): void => {
        this.documentHelper.updateFocus();
        this.bookmarks = [];
        for (let i: number = 0; i < this.documentHelper.bookmarks.keys.length; i++) {
            const bookmark: string = this.documentHelper.bookmarks.keys[i];
            if (bookmark.indexOf('_') !== 0) {
                this.bookmarks.push(bookmark);
            }
        }
        const fieldBegin: FieldElementBox = this.documentHelper.selection.getHyperlinkField();
        if (!isNullOrUndefined(fieldBegin)) {
            if (!isNullOrUndefined(fieldBegin.fieldSeparator)) {
                const format: WCharacterFormat = undefined;

                const fieldObj: HyperlinkTextInfo = this.documentHelper.selection.getHyperlinkDisplayText(fieldBegin.fieldSeparator.line.paragraph, fieldBegin.fieldSeparator, fieldBegin.fieldEnd, false, format);
                this.displayText = fieldObj.displayText;
                this.displayTextBox.disabled = fieldObj.isNestedField;
            }
            this.displayTextBox.value = this.displayText;
            const link: string = this.documentHelper.selection.getLinkText(fieldBegin);
            this.urlTextBox.value = this.navigationUrl = link;
            this.documentHelper.dialog.header = this.localObj.getConstant('Edit Hyperlink');
        } else {
            this.displayText = this.documentHelper.selection.getText(true);
            if (this.displayText !== '') {
                if (this.displayText.indexOf(String.fromCharCode(65532)) !== -1 ||
                    this.displayText.indexOf('\r') !== -1 && (this.displayText.lastIndexOf('\r') !== -1 &&
                        this.displayText.slice(0, -1).indexOf('\r') !== -1)) {
                    this.displayTextBox.value = '<<Selection in document>>';
                    this.displayTextBox.disabled = true;
                } else {
                    this.displayTextBox.value = this.displayText;
                }
            }
        }
        this.bookmarkDiv.style.display = 'none';
        this.addressText.style.display = 'block';
        this.urlTextBox.style.display = 'block';
        this.bookmarkCheckbox.checked = false;
        this.bookmarkDropdown.dataSource = this.documentHelper.bookmarks.keys;
        this.insertButton = document.getElementsByClassName('e-hyper-insert')[0] as HTMLButtonElement;
        this.enableOrDisableInsertButton();
        this.urlTextBox.focus();
        if (this.documentHelper.selection.caret.style.display !== 'none') {
            this.documentHelper.selection.caret.style.display = 'none';
        }
    };
    /**
     * @private
     * @returns {void}
     */
    public closeHyperlinkDialog = (): void => {
        this.clearValue();
        this.documentHelper.updateFocus();
    };
    /**
     * @private
     * @returns {void}
     */
    public onInsertHyperlink(): void {
        let displayText: string = this.displayTextBox.value.trim();
        let address: string = this.urlTextBox.value.trim();
        let isBookmark: boolean = false;
        if (!isNullOrUndefined(this.bookmarkDropdown.value) && this.bookmarkDropdown.value !== '') {
            address = this.bookmarkDropdown.value as string;
            isBookmark = true;
        }
        if (address === '') {
            this.documentHelper.hideDialog();
            return;
        }
        if (displayText === '' && address !== '') {
            displayText = address;
        } else {
            displayText = this.displayTextBox.value;
        }

        if (!isNullOrUndefined(this.navigationUrl)) {
            this.documentHelper.owner.editorModule.editHyperlink(this.documentHelper.selection, address, displayText, isBookmark);
        } else {
            const remove: boolean = (this.documentHelper.selection.text !== displayText ||
                this.documentHelper.selection.text.indexOf('\r') === -1) && !this.displayTextBox.disabled;
            this.documentHelper.owner.editorModule.insertHyperlinkInternal(address, displayText, remove, isBookmark);
        }
        this.documentHelper.hideDialog();
        this.navigationUrl = undefined;
    }
    /**
     * @private
     * @param {CheckBoxChangeArgs} args - Specifies the event args.
     * @returns {void}
     */
    private onUseBookmarkChange = (args: CheckBoxChangeArgs): void => {
        if (args.checked) {
            this.bookmarkDiv.style.display = 'block';
            this.bookmarkDropdown.dataSource = this.bookmarks;
            this.addressText.style.display = 'none';
            this.urlTextBox.style.display = 'none';
        } else {
            this.bookmarkDiv.style.display = 'none';
            this.addressText.style.display = 'block';
            this.urlTextBox.style.display = 'block';
        }
    };
    /**
     * @private
     * @returns {void}
     */
    private onBookmarkchange = (): void => {
        if (this.bookmarkDropdown.value !== '') {
            this.insertButton.disabled = false;
        }
    };
    /**
     * @private
     * @returns {void}
     */
    public clearValue(): void {
        this.displayTextBox.value = '';
        this.urlTextBox.value = '';
        this.displayText = '';
        this.displayTextBox.disabled = false;
        this.bookmarks = [];
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.displayTextBox) {
            this.displayTextBox.innerHTML = '';
            this.displayTextBox = undefined;
        }
        if (this.urlTextBox) {
            this.urlTextBox.parentElement.removeChild(this.urlTextBox);
            this.urlTextBox = undefined;
        }
        this.documentHelper = undefined;
        if (!isNullOrUndefined(this.target)) {
            if (this.target.parentElement) {
                this.target.parentElement.removeChild(this.target);
            }
            this.target.innerHTML = '';
            this.target = undefined;
        }
    }
}
