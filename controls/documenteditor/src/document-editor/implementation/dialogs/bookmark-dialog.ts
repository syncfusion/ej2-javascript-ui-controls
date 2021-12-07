import { ListView } from '@syncfusion/ej2-lists';
import { Button } from '@syncfusion/ej2-buttons';
import { createElement, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DocumentHelper } from '../viewer';

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
        const dlgFields: HTMLElement = createElement('div', { innerHTML: headerValue, className: 'e-bookmark-dlgfields' });
        this.target.appendChild(dlgFields);

        const commonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-common' });
        this.target.appendChild(commonDiv);

        const searchDiv: HTMLElement = createElement('div', { className: 'e-bookmark-list' });
        commonDiv.appendChild(searchDiv);
        if (isRtl) {
            searchDiv.classList.add('e-de-rtl');
        }

        const textBoxDiv: HTMLElement = createElement('div', { className: 'e-bookmark-textboxdiv' });
        searchDiv.appendChild(textBoxDiv);

        this.textBoxInput = createElement('input', { className: 'e-input e-bookmark-textbox-input', id: 'bookmark_text_box', attrs: { autofocus: 'true' } }) as HTMLInputElement;
        this.textBoxInput.setAttribute('type', 'text');
        textBoxDiv.appendChild(this.textBoxInput);

        const listviewDiv: HTMLElement = createElement('div', { className: 'e-bookmark-listViewDiv', id: 'bookmark_listview' });
        searchDiv.appendChild(listviewDiv);
        // const arts: string[] = this.documentHelper.bookmarks.keys;

        this.listviewInstance = new ListView({
            dataSource: bookmarks,
            cssClass: 'e-bookmark-listview'
        });
        const hasNoBookmark: boolean = (bookmarks === undefined || bookmarks.length === 0);

        this.listviewInstance.appendTo(listviewDiv);
        this.listviewInstance.addEventListener('select', this.selectHandler);

        const buttonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-button' });
        commonDiv.appendChild(buttonDiv);

        const addbuttonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-addbutton' });
        buttonDiv.appendChild(addbuttonDiv);
        const addButtonElement: HTMLElement = createElement('button', {
            innerHTML: localValue.getConstant('Add'), id: 'add',
            attrs: { type: 'button' }
        });
        addbuttonDiv.appendChild(addButtonElement);
        this.addButton = new Button({ cssClass: 'e-button-custom' });
        this.addButton.disabled = true;
        this.addButton.appendTo(addButtonElement);
        this.textBoxInput.addEventListener('input', this.onKeyUpOnTextBox);
        this.textBoxInput.addEventListener('keyup', this.onKeyUpOnTextBox);
        addButtonElement.addEventListener('click', this.addBookmark);

        const deleteButtonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-deletebutton' });
        buttonDiv.appendChild(deleteButtonDiv);
        const deleteButtonElement: HTMLElement = createElement('button', {
            innerHTML: localValue.getConstant('Delete'), id: 'delete',
            attrs: { type: 'button' }
        });
        deleteButtonDiv.appendChild(deleteButtonElement);
        this.deleteButton = new Button({ cssClass: 'e-button-custom' });
        this.deleteButton.disabled = hasNoBookmark;
        this.deleteButton.appendTo(deleteButtonElement);
        deleteButtonElement.addEventListener('click', this.deleteBookmark);


        const gotoButtonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-gotobutton' });
        buttonDiv.appendChild(gotoButtonDiv);
        const gotoButtonElement: HTMLElement = createElement('button', {
            innerHTML: localValue.getConstant('Go To'), id: 'goto',
            attrs: { type: 'button' }
        });
        gotoButtonDiv.appendChild(gotoButtonElement);
        this.gotoButton = new Button({ cssClass: 'e-button-custom' });
        this.gotoButton.disabled = hasNoBookmark;
        this.gotoButton.appendTo(gotoButtonElement);
        gotoButtonElement.addEventListener('click', this.gotoBookmark);
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
        if (!isNullOrUndefined(this.addButton)) {
            this.addButton.disabled = ((this.textBoxInput as HTMLInputElement).value === '');
        }
    }
    /**
     * @private
     * @returns {void}
     */
    private addBookmark = (): void => {
        this.documentHelper.owner.editorModule.insertBookmark((this.textBoxInput as HTMLInputElement).value);
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
        if (this.textBoxInput) {
            this.textBoxInput.remove();
            this.textBoxInput = undefined;
        }
        if (this.listviewInstance) {
            this.listviewInstance.destroy();
            this.listviewInstance = undefined;
        }
    }
}

