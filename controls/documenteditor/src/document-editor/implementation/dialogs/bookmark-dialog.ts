import { ListView, SelectEventArgs } from '@syncfusion/ej2-lists';
import { Button } from '@syncfusion/ej2-buttons';
import { createElement, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DocumentHelper } from '../viewer';
import { SanitizeHtmlHelper } from '@syncfusion/ej2-base';

/**
 * The Bookmark dialog is used to add, navigate or delete bookmarks.
 */
export class BookmarkDialog {
    /**
     * @private
     */
    public documentHelper: DocumentHelper;
    private target: HTMLElement;
    private listviewInstance: ListView;
    private textBoxInput: HTMLElement;
    private addButton: Button;
    private deleteButton: Button;
    private gotoButton: Button;

    private dlgFields: HTMLElement;
    private commonDiv: HTMLElement;
    private searchDiv: HTMLElement;
    private textBoxDiv: HTMLElement
    private listviewDiv: HTMLElement;
    private buttonDiv: HTMLElement;
    private addbuttonDiv: HTMLElement;
    private deleteButtonDiv: HTMLElement;
    private addButtonElement: HTMLElement;
    private deleteButtonElement: HTMLElement;
    private gotoButtonDiv: HTMLElement;
    private gotoButtonElement: HTMLElement;


    private listViewInstanceClickHandler: EventListener  = this.onListInstanceClicked.bind(this);
    private onKeyUpOnTextBoxClickHandler: EventListenerOrEventListenerObject = this.onKeyUpOnTextBoxClicked.bind(this);
    private addBookmarkClickHandler: EventListenerOrEventListenerObject = this.onAddBookmarkClicked.bind(this);
    private deleteBookmarkClickHandler: EventListenerOrEventListenerObject = this.onDeleteBookmarkClicked.bind(this);
    private gotoBookmarkClickHandler: EventListenerOrEventListenerObject = this.onGotoBookmarkClicked.bind(this);
    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }

    private getModuleName(): string {
        return 'BookmarkDialog';
    }
    /**
     * @private
     * @param {L10n} localValue - Specifies the locale.
     * @param {string[]} bookmarks - Specifies bookmark collection.
     * @param {boolean} isRtl - Specifies is rtl.
     * @returns {void}
     */
    public initBookmarkDialog(localValue: L10n, bookmarks: string[], isRtl?: boolean): void {
        const id: string = this.documentHelper.owner.containerId + '_insert_bookmark';
        this.target = createElement('div', { id: id, className: 'e-de-bookmark' });
        const headerValue: string = localValue.getConstant('Bookmark name') + ':';
        this.dlgFields = createElement('div', { innerHTML: headerValue, className: 'e-bookmark-dlgfields' });
        this.target.appendChild(this.dlgFields);

        this.commonDiv = createElement('div', { className: 'e-bookmark-common' });
        this.target.appendChild(this.commonDiv);

        this.searchDiv = createElement('div', { className: 'e-bookmark-list' });
        this.commonDiv.appendChild(this.searchDiv);
        if (isRtl) {
            this.searchDiv.classList.add('e-de-rtl');
        }

        this.textBoxDiv = createElement('div', { className: 'e-bookmark-textboxdiv' });
        this.searchDiv.appendChild(this.textBoxDiv);

        this.textBoxInput = createElement('input', { className: 'e-input e-bookmark-textbox-input', id: 'bookmark_text_box', attrs: { autofocus: 'true' } }) as HTMLInputElement;
        this.textBoxInput.setAttribute('type', 'text');
        this.textBoxInput.setAttribute('aria-label', localValue.getConstant('Bookmark name'));
        this.textBoxDiv.appendChild(this.textBoxInput);

        this.listviewDiv = createElement('div', { className: 'e-bookmark-listViewDiv', id: 'bookmark_listview', attrs: { tabindex: '-1', role: 'listbox' }});
        this.listviewDiv.setAttribute('aria-label', localValue.getConstant('BookMarkList'));
        this.searchDiv.appendChild(this.listviewDiv);
        // const arts: string[] = this.documentHelper.bookmarks.keys;

        this.listviewInstance = new ListView({
            dataSource: bookmarks,
            cssClass: 'e-bookmark-listview'
        });
        const hasNoBookmark: boolean = (bookmarks === undefined || bookmarks.length === 0);

        this.listviewInstance.appendTo(this.listviewDiv);
        this.listviewInstance.addEventListener('select', this.listViewInstanceClickHandler);

        this.buttonDiv = createElement('div', { className: 'e-bookmark-button' });
        this.commonDiv.appendChild(this.buttonDiv);

        this.addbuttonDiv = createElement('div', { className: 'e-bookmark-addbutton' });
        this.buttonDiv.appendChild(this.addbuttonDiv);
        this.addButtonElement = createElement('button', {
            innerHTML: localValue.getConstant('Add'), id: 'add',
            attrs: { type: 'button' }
        });
        this.addButtonElement.setAttribute('aria-label', localValue.getConstant('Add'));
        this.addbuttonDiv.appendChild(this.addButtonElement);
        this.addButton = new Button({ cssClass: 'e-button-custom' });
        this.addButton.disabled = true;
        this.addButton.appendTo(this.addButtonElement);
        this.textBoxInput.addEventListener('input', this.onKeyUpOnTextBoxClickHandler);
        this.textBoxInput.addEventListener('keyup', this.onKeyUpOnTextBoxClickHandler);
        this.addButtonElement.addEventListener('click', this.addBookmarkClickHandler);

        this.deleteButtonDiv = createElement('div', { className: 'e-bookmark-deletebutton' });
        this.buttonDiv.appendChild(this.deleteButtonDiv);
        this.deleteButtonElement = createElement('button', {
            innerHTML: localValue.getConstant('Delete'), id: 'delete',
            attrs: { type: 'button' }
        });
        this.deleteButtonElement.setAttribute('aria-label', localValue.getConstant('Delete'));
        this.deleteButtonDiv.appendChild(this.deleteButtonElement);
        this.deleteButton = new Button({ cssClass: 'e-button-custom' });
        this.deleteButton.disabled = hasNoBookmark;
        this.deleteButton.appendTo(this.deleteButtonElement);
        this.deleteButtonElement.addEventListener('click', this.deleteBookmarkClickHandler);


        this.gotoButtonDiv = createElement('div', { className: 'e-bookmark-gotobutton' });
        this.buttonDiv.appendChild(this.gotoButtonDiv);
        this.gotoButtonElement = createElement('button', {
            innerHTML: localValue.getConstant('Go To'), id: 'goto',
            attrs: { type: 'button' }
        });
        this.gotoButtonElement.setAttribute('aria-label', localValue.getConstant('Go To'));
        this.gotoButtonDiv.appendChild(this.gotoButtonElement);
        this.gotoButton = new Button({ cssClass: 'e-button-custom' });
        this.gotoButton.disabled = hasNoBookmark;
        this.gotoButton.appendTo(this.gotoButtonElement);
        this.gotoButtonElement.addEventListener('click', this.gotoBookmarkClickHandler);
    }
    private onListInstanceClicked(args: SelectEventArgs) : void {
        this.selectHandler(args);
    }
    private onKeyUpOnTextBoxClicked() : void {
        this.onKeyUpOnTextBox();
    }
    private onAddBookmarkClicked() : void {
        this.addBookmark();
    }
    private onDeleteBookmarkClicked() : void {
        this.deleteBookmark();
    }
    private onGotoBookmarkClicked() : void {
        this.gotoBookmark();
    }

    /**
     * @private
     * @returns {void}
     */
    public show(): void {
        const bookmarks: string[] = this.documentHelper.getBookmarks();
        const localObj: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localObj.setLocale(this.documentHelper.owner.locale);
        // if (!this.target) {
        this.initBookmarkDialog(localObj, bookmarks, this.documentHelper.owner.enableRtl);
        //}
        this.documentHelper.dialog.header = localObj.getConstant('Bookmark');
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.beforeOpen = this.documentHelper.updateFocus;
        this.documentHelper.dialog.close = this.documentHelper.updateFocus;
        this.documentHelper.dialog.buttons = [{
            click: this.removeObjects.bind(this),
            buttonModel: { content: localObj.getConstant('Cancel'), cssClass: 'e-flat e-hyper-insert', isPrimary: true }
        }];
        this.documentHelper.dialog.dataBind();
        const hasNoBookmark: boolean = (bookmarks === undefined || bookmarks.length === 0);
        if (!hasNoBookmark) {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const firstItem: any = bookmarks[0];
            this.listviewInstance.selectItem(firstItem);
        }
        this.documentHelper.dialog.show();
    }
    /**
     * @private
     * @returns {void}
     */
    public onKeyUpOnTextBox = (): void => {
        this.enableOrDisableButton();
    };
    private enableOrDisableButton(): void {
        // Regex pattern for valid characters (alphanumeric and underscore)
        const validRegex: RegExp = /^[_a-zA-Z0-9]+$/;
        const text: string = (this.textBoxInput as HTMLInputElement).value.trim();
        if (!isNullOrUndefined(this.addButton)) {
            this.addButton.disabled = !validRegex.test(text);
        }
    }
    /**
     * @private
     * @returns {void}
     */
    private addBookmark = (): void => {
        this.documentHelper.owner.editorModule.insertBookmark(SanitizeHtmlHelper.sanitize((this.textBoxInput as HTMLInputElement).value));
        this.documentHelper.hideDialog();
    };
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private selectHandler = (args: any): void => {
        this.focusTextBox(args.text);
    };
    private focusTextBox(text: string): void {
        (this.textBoxInput as HTMLInputElement).value = text;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const value: any = document.getElementById('bookmark_text_box');
        value.setSelectionRange(0, (text as string).length);
        value.focus();
        this.enableOrDisableButton();
    }
    private removeObjects(): void {
        this.documentHelper.hideDialog();
    }
    /**
     * @private
     * @returns {void}
     */
    private gotoBookmark = (): void => {
        this.documentHelper.selection.selectBookmark((this.textBoxInput as HTMLInputElement).value);
    };
    /**
     * @private
     * @returns {void}
     */
    private deleteBookmark = (): void => {
        this.documentHelper.owner.editorModule.deleteBookmark((this.textBoxInput as HTMLInputElement).value);
        this.show();
    };
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.removeEvents();
        this.removeElements();
        if (this.textBoxInput) {
            this.textBoxInput.remove();
            this.textBoxInput = undefined;
        }
        if (this.listviewInstance) {
            this.listviewInstance.destroy();
            this.listviewInstance = undefined;
        }
        this.documentHelper = undefined;
    }
    private removeElements(): void {
        if (this.dlgFields){
            this.dlgFields.remove();
            this.dlgFields = undefined;
        }
        if (this.commonDiv){
            this.commonDiv.remove();
            this.commonDiv = undefined;
        }
        if (this.target) {
            this.target.remove();
            this.target = undefined;
        }
        if (this.textBoxDiv) {
            this.textBoxDiv.remove();
            this.textBoxDiv = undefined;
        }
        if (this.searchDiv) {
            this.searchDiv.remove();
            this.searchDiv = undefined;
        }
        if (this.listviewDiv) {
            this.listviewDiv.remove();
            this.listviewDiv = undefined;
        }
        if (this.buttonDiv) {
            this.buttonDiv.remove();
            this.buttonDiv = undefined;
        }
        if (this.addbuttonDiv) {
            this.addbuttonDiv.remove();
            this.addbuttonDiv = undefined;
        }
        if (this.deleteButtonDiv) {
            this.deleteButtonDiv.remove();
            this.deleteButtonDiv = undefined;
        }
        if (this.gotoButtonDiv) {
            this.gotoButtonDiv.remove();
            this.gotoButtonDiv = undefined;
        }
        if (this.addButtonElement) {
            this.addButtonElement.remove();
            this.addButtonElement = undefined;
        }
        if (this.deleteButtonElement) {
            this.deleteButtonElement.remove();
            this.deleteButtonElement = undefined;
        }
        if (this.gotoButtonElement) {
            this.gotoButtonElement.remove();
            this.gotoButtonElement = undefined;
        }
        if (this.addButton) {
            this.addButton.destroy();
            this.addButton = undefined;
        }
        if (this.deleteButton) {
            this.deleteButton.destroy();
            this.deleteButton = undefined;
        }
        if (this.gotoButton) {
            this.gotoButton.destroy();
            this.gotoButton = undefined;
        }
    }
    private removeEvents(): void {
        if (this.listviewInstance) {
            this.listviewInstance.removeEventListener('select', this.listViewInstanceClickHandler);
        }
        if (this.textBoxInput) {
            this.textBoxInput.removeEventListener('input', this.onKeyUpOnTextBoxClickHandler);
            this.textBoxInput.removeEventListener('keyup', this.onKeyUpOnTextBoxClickHandler);
        }
        if (this.addButtonElement) {
            this.addButtonElement.removeEventListener('click', this.addBookmarkClickHandler);
        }
        if (this.deleteButtonElement) {
            this.deleteButtonElement.removeEventListener('click', this.deleteBookmarkClickHandler);
        }
        if (this.gotoButtonElement) {
            this.gotoButtonElement.removeEventListener('click', this.gotoBookmarkClickHandler);
        }
    }
}

