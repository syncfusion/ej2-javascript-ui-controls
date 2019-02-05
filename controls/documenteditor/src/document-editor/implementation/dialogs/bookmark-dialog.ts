import { ListView } from '@syncfusion/ej2-lists';
import { Button } from '@syncfusion/ej2-buttons';
import { LayoutViewer } from '../index';
import { createElement, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * The Bookmark dialog is used to add, navigate or delete bookmarks.
 */
export class BookmarkDialog {
    /**
     * @private
     */
    public owner: LayoutViewer;
    private target: HTMLElement;
    private listviewInstance: ListView;
    private textBoxInput: HTMLElement;
    private addButton: Button;
    private deleteButton: Button;
    private gotoButton: Button;
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
        return 'BookmarkDialog';
    }
    /**
     * @private
     */
    public initBookmarkDialog(localValue: L10n, bookmarks: string[], isRtl?: boolean): void {
        let instance: BookmarkDialog = this;
        let id: string = this.owner.owner.containerId + '_insert_bookmark';
        this.target = createElement('div', { id: id, className: 'e-de-bookmark' });
        let headerValue: string = localValue.getConstant('Bookmark name') + ':';
        let dlgFields: HTMLElement = createElement('div', { innerHTML: headerValue, className: 'e-bookmark-dlgfields' });
        this.target.appendChild(dlgFields);

        let commonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-common' });
        this.target.appendChild(commonDiv);

        let searchDiv: HTMLElement = createElement('div', { className: 'e-bookmark-list' });
        commonDiv.appendChild(searchDiv);
        if (isRtl) {
            searchDiv.classList.add('e-de-rtl');
        }

        let textBoxDiv: HTMLElement = createElement('div', { className: 'e-bookmark-textboxdiv' });
        searchDiv.appendChild(textBoxDiv);

        // tslint:disable-next-line:max-line-length
        this.textBoxInput = createElement('input', { className: 'e-input e-bookmark-textbox-input', id: 'bookmark_text_box', attrs: { autofocus: 'true' } }) as HTMLInputElement;
        this.textBoxInput.setAttribute('type', 'text');
        textBoxDiv.appendChild(this.textBoxInput);

        let listviewDiv: HTMLElement = createElement('div', { className: 'e-bookmark-listViewDiv', id: 'bookmark_listview' });
        searchDiv.appendChild(listviewDiv);
        let arts: string[] = this.owner.bookmarks.keys;

        this.listviewInstance = new ListView({
            dataSource: bookmarks,
            cssClass: 'e-bookmark-listview',
        });
        let hasNoBookmark: boolean =  (bookmarks === undefined || bookmarks.length === 0);

        this.listviewInstance.appendTo(listviewDiv);
        this.listviewInstance.addEventListener('select', this.selectHandler);

        let buttonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-button' });
        commonDiv.appendChild(buttonDiv);

        let addbuttonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-addbutton' });
        buttonDiv.appendChild(addbuttonDiv);
        let addButtonElement: HTMLElement = createElement('button', { innerHTML: localValue.getConstant('Add'), id: 'add' });
        addbuttonDiv.appendChild(addButtonElement);
        this.addButton = new Button({ cssClass: 'e-button-custom' });
        this.addButton.disabled = true;
        this.addButton.appendTo(addButtonElement);
        this.textBoxInput.addEventListener('input', this.onKeyUpOnTextBox);
        this.textBoxInput.addEventListener('keyup', this.onKeyUpOnTextBox);
        addButtonElement.addEventListener('click', this.addBookmark);

        let deleteButtonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-deletebutton' });
        buttonDiv.appendChild(deleteButtonDiv);
        let deleteButtonElement: HTMLElement = createElement('button', { innerHTML: localValue.getConstant('Delete'), id: 'delete' });
        deleteButtonDiv.appendChild(deleteButtonElement);
        this.deleteButton = new Button({ cssClass: 'e-button-custom' });
        this.deleteButton.disabled = hasNoBookmark;
        this.deleteButton.appendTo(deleteButtonElement);
        deleteButtonElement.addEventListener('click', this.deleteBookmark);


        let gotoButtonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-gotobutton' });
        buttonDiv.appendChild(gotoButtonDiv);
        let gotoButtonElement: HTMLElement = createElement('button', { innerHTML: localValue.getConstant('Go To'), id: 'goto' });
        gotoButtonDiv.appendChild(gotoButtonElement);
        this.gotoButton = new Button({ cssClass: 'e-button-custom' });
        this.gotoButton.disabled = hasNoBookmark;
        this.gotoButton.appendTo(gotoButtonElement);
        gotoButtonElement.addEventListener('click', this.gotoBookmark);
    }
    /**
     * @private
     */
    public show(): void {
        let bookmarks: string[] = this.owner.getBookmarks();
        let localObj: L10n = new L10n('documenteditor', this.owner.owner.defaultLocale);
        localObj.setLocale(this.owner.owner.locale);
        // if (!this.target) {
        this.initBookmarkDialog(localObj, bookmarks, this.owner.owner.enableRtl);
        //}
        this.owner.dialog.header = localObj.getConstant('Bookmark');
        this.owner.dialog.height = 'auto';
        this.owner.dialog.width = 'auto';
        this.owner.dialog.content = this.target;
        this.owner.dialog.beforeOpen = this.owner.updateFocus;
        this.owner.dialog.close = this.owner.updateFocus;
        this.owner.dialog.buttons = [{
            click: this.removeObjects.bind(this),
            buttonModel: { content: localObj.getConstant('Cancel'), cssClass: 'e-flat e-hyper-insert', isPrimary: true }
        }];
        this.owner.dialog.dataBind();
        let hasNoBookmark: boolean =  (bookmarks === undefined || bookmarks.length === 0);
        if (!hasNoBookmark) {
            /* tslint:disable:no-any */
            let firstItem: any = bookmarks[0];
            this.listviewInstance.selectItem(firstItem);
        }
        this.owner.dialog.show();
    }
    /**
     * @private
     */
    public onKeyUpOnTextBox = (event: KeyboardEvent): void => {
        this.enableOrDisableButton();
    }
    private enableOrDisableButton(): void {
        if (!isNullOrUndefined(this.addButton)) {
            // tslint:disable-next-line:max-line-length
            this.addButton.disabled = ((this.textBoxInput as HTMLInputElement).value === '');
        }
    }
    private addBookmark = (): void => {
        this.owner.owner.editorModule.insertBookmark((this.textBoxInput as HTMLInputElement).value);
        this.owner.dialog.hide();
    }
    /* tslint:disable:no-any */
    private selectHandler = (args: any): void => {
        this.focusTextBox(args.text);
    }
    /* tslint:disable:no-any */
    private focusTextBox(text: string): void {
        (this.textBoxInput as HTMLInputElement).value = text;
        /* tslint:disable:no-any */
        let value: any = document.getElementById('bookmark_text_box');
        value.setSelectionRange(0, (text as string).length);
        value.focus();
        this.enableOrDisableButton();
    }
    private removeObjects(): void {
        this.owner.dialog.hide();
    }

    private gotoBookmark = (): void => {
        this.owner.selection.selectBookmark((this.textBoxInput as HTMLInputElement).value);
    }

    private deleteBookmark = (): void => {
        this.owner.owner.editorModule.deleteBookmark((this.textBoxInput as HTMLInputElement).value);
        this.show();
    }
    /**
     * @private
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

