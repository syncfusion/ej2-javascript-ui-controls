import { createElement, isNullOrUndefined, L10n, setCulture } from '@syncfusion/ej2-base';
import { HyperlinkTextInfo } from '../editor/editor-helper';
import { LayoutViewer } from '../index';
import { FieldElementBox } from '../viewer/page';
import { WCharacterFormat } from '../index';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { CheckBox } from '@syncfusion/ej2-buttons';

/**
 * The Hyperlink dialog is used to insert or edit hyperlink at selection.
 */
/* tslint:disable:max-line-length */
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
    public owner: LayoutViewer;
    private bookmarks: string[] = [];
    private localObj: L10n;
    /**
     * @private
     */
    constructor(viewer: LayoutViewer) {
        this.owner = viewer;
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'HyperlinkDialog';
    }
    /**
     * @private
     */
    public initHyperlinkDialog(localValue: L10n): void {
        let instance: HyperlinkDialog = this;
        let id: string = this.owner.owner.containerId + '_insert_hyperlink';
        this.target = createElement('div', { id: id, className: 'e-de-hyperlink' });

        let container: HTMLElement = createElement('div');
        let displayText: HTMLElement = createElement('div', { className: 'e-de-hyperlink-dlg-title', innerHTML: localValue.getConstant('Text to display') });
        this.displayTextBox = createElement('input', { id: this.owner.owner.containerId + '_display_text', className: 'e-input e-de-hyperlink-dlg-input' }) as HTMLInputElement;
        this.displayTextBox.addEventListener('keyup', instance.onKeyUpOnDisplayBox);
        container.appendChild(displayText);
        container.appendChild(this.displayTextBox);

        this.addressText = createElement('div', { className: 'e-de-hyperlink-dlg-title', innerHTML: localValue.getConstant('Address') }) as HTMLDivElement;
        this.urlTextBox = createElement('input', { id: this.owner.owner.containerId + '_url_text', className: 'e-input e-de-hyperlink-dlg-input', attrs: { autofocus: 'true' } }) as HTMLInputElement;
        this.urlTextBox.addEventListener('input', instance.onKeyUpOnUrlBox);
        this.urlTextBox.addEventListener('keyup', instance.onKeyUpOnUrlBox);
        container.appendChild(this.addressText);
        container.appendChild(this.urlTextBox);

        this.bookmarkDiv = createElement('div', { styles: 'display:none;' }) as HTMLDivElement;
        let bookmarkText: HTMLElement = createElement('div', { className: 'e-de-hyperlink-dlg-title', innerHTML: localValue.getConstant('Bookmark') });
        let bookmarkTextElement: HTMLElement = createElement('div', { className: 'e-de-hyperlink-dlg-bookmark' });
        // tslint:disable-next-line:max-line-length
        let bookmarkValue: HTMLInputElement = createElement('input', { id: 'e-de-hyperlink-dlg-bookmark-value' }) as HTMLInputElement;
        bookmarkTextElement.appendChild(bookmarkValue);
        // tslint:disable-next-line:max-line-length
        this.bookmarkDropdown = new DropDownList({ dataSource: [], change: this.onBookmarkchange, popupHeight: '230px', width: '230px', noRecordsTemplate: localValue.getConstant('No bookmarks found') });
        this.bookmarkDropdown.appendTo(bookmarkValue);
        this.bookmarkDiv.appendChild(bookmarkText);
        this.bookmarkDiv.appendChild(bookmarkTextElement);
        container.appendChild(this.bookmarkDiv);
        // tslint:disable-next-line:max-line-length
        let bookmarkCheckDiv: HTMLDivElement = createElement('div', { className: 'e-de-hyperlink-bookmark-check e-de-hyperlink-dlg-title' }) as HTMLDivElement;
        let bookmarkCheck: HTMLInputElement = createElement('input', { attrs: { type: 'checkbox' }, id: this.target.id + '_bookmark', className: this.target.id + '_bookmarkcheck' }) as HTMLInputElement;
        bookmarkCheckDiv.appendChild(bookmarkCheck);
        this.bookmarkCheckbox = new CheckBox({ label: localValue.getConstant('Use bookmarks'), change: this.onUseBookmarkChange });
        this.bookmarkCheckbox.appendTo(bookmarkCheck);
        container.appendChild(bookmarkCheckDiv);
        this.target.appendChild(container);
    }
    /**
     * @private
     */
    public show(): void {
        this.localObj = new L10n('documenteditor', this.owner.owner.defaultLocale);
        this.localObj.setLocale(this.owner.owner.locale);
        setCulture(this.owner.owner.locale);
        if (!this.target) {
            this.initHyperlinkDialog(this.localObj);
        }
        this.owner.dialog.header = this.localObj.getConstant('Insert Hyperlink');
        this.owner.dialog.height = 'auto';
        this.owner.dialog.width = 'auto';
        this.owner.dialog.content = this.target;
        this.owner.dialog.buttons = [{
            click: this.onInsertButtonClick,
            buttonModel: { content: this.localObj.getConstant('Ok'), cssClass: 'e-flat e-hyper-insert', isPrimary: true }
        },
        {
            click: this.onCancelButtonClick,
            buttonModel: { content: this.localObj.getConstant('Cancel'), cssClass: 'e-flat e-hyper-cancel' }
        }];
        this.owner.dialog.dataBind();
        this.owner.dialog.beforeOpen = this.loadHyperlinkDialog;
        this.owner.dialog.close = this.closeHyperlinkDialog;
        this.owner.dialog.show();
    }
    /**
     * @private
     */
    public hide(): void {
        this.closeHyperlinkDialog();
    }
    /**
     * @private
     */
    public onKeyUpOnUrlBox = (event: KeyboardEvent): void => {
        if (event.keyCode === 13) {
            if (this.displayTextBox.value !== '' && this.urlTextBox.value !== '') {
                this.onInsertHyperlink();
            }
            return;
        }
        let selectedText: string = this.owner.selection.text;
        let urlValue: string = this.urlTextBox.value;
        if (urlValue.substring(0, 4).toLowerCase() === 'www.') {
            this.urlTextBox.value = 'http://' + urlValue;
        }
        if (this.displayText === '') {
            this.displayTextBox.value = urlValue;
        }
        this.enableOrDisableInsertButton();
    }
    /**
     * @private
     */
    public onKeyUpOnDisplayBox = (): void => {
        this.displayText = this.displayTextBox.value;
        this.enableOrDisableInsertButton();
    }
    private enableOrDisableInsertButton(): void {
        if (!isNullOrUndefined(this.insertButton)) {
            // tslint:disable-next-line:max-line-length
            this.insertButton.disabled = (this.urlTextBox.value === '' || this.displayTextBox.value === '');
        }
    }
    /**
     * @private
     */
    public onInsertButtonClick = (): void => {
        this.onInsertHyperlink();
    }
    /**
     * @private
     */
    public onCancelButtonClick = (): void => {
        this.owner.dialog.hide();
        this.clearValue();
    }
    /**
     * @private
     */
    public loadHyperlinkDialog = (): void => {
        this.owner.updateFocus();
        this.bookmarks = [];
        for (let i: number = 0; i < this.owner.bookmarks.keys.length; i++) {
            let bookmark: string = this.owner.bookmarks.keys[i];
            if (bookmark.indexOf('_') !== 0) {
                this.bookmarks.push(bookmark);
            }
        }
        let fieldBegin: FieldElementBox = this.owner.selection.getHyperlinkField();
        if (!isNullOrUndefined(fieldBegin)) {
            if (!isNullOrUndefined(fieldBegin.fieldSeparator)) {
                let format: WCharacterFormat = undefined;
                // tslint:disable-next-line:max-line-length
                let fieldObj: HyperlinkTextInfo = this.owner.selection.getHyperlinkDisplayText(fieldBegin.fieldSeparator.line.paragraph, fieldBegin.fieldSeparator, fieldBegin.fieldEnd, false, format);
                this.displayText = fieldObj.displayText;
                this.displayTextBox.disabled = fieldObj.isNestedField;
            }
            this.displayTextBox.value = this.displayText;
            let link: string = this.owner.selection.getLinkText(fieldBegin);
            this.urlTextBox.value = this.navigationUrl = link;
            this.owner.dialog.header = this.localObj.getConstant('Edit Hyperlink');
        } else {
            this.displayText = this.owner.selection.getText(true);
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
        this.bookmarkDropdown.dataSource = this.owner.bookmarks.keys;
        this.insertButton = document.getElementsByClassName('e-hyper-insert')[0] as HTMLButtonElement;
        this.enableOrDisableInsertButton();
        this.urlTextBox.focus();
        if (this.owner.selection.caret.style.display !== 'none') {
            this.owner.selection.caret.style.display = 'none';
        }
    }
    /**
     * @private
     */
    public closeHyperlinkDialog = (): void => {
        this.clearValue();
        this.owner.updateFocus();
    }
    /**
     * @private
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
            this.owner.dialog.hide();
            return;
        }
        if (displayText === '' && address !== '') {
            displayText = address;
        } else {
            displayText = this.displayTextBox.value;
        }

        if (!isNullOrUndefined(this.navigationUrl)) {
            this.owner.owner.editorModule.editHyperlink(this.owner.selection, address, displayText, isBookmark);
        } else {
            let remove: boolean = this.owner.selection.text !== displayText && !this.displayTextBox.disabled;
            this.owner.owner.editorModule.insertHyperlink(address, displayText, remove, isBookmark);
        }
        this.owner.dialog.hide();
        this.navigationUrl = undefined;
    }
    /* tslint:disable:no-any */
    private onUseBookmarkChange = (args: any): void => {
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
    }
    private onBookmarkchange = (args: any): void => {
        if (this.bookmarkDropdown.value !== '') {
            this.insertButton.disabled = false;
        }
    }
    /* tslint:enable:no-any */
    /**
     * @private
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
        this.owner = undefined;
        if (!isNullOrUndefined(this.target)) {
            if (this.target.parentElement) {
                this.target.parentElement.removeChild(this.target);
            }
            this.target.innerHTML = '';
            this.target = undefined;
        }
    }
}
