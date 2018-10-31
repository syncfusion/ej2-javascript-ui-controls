import { ListView } from '@syncfusion/ej2-lists';
import { Button } from '@syncfusion/ej2-buttons';
import { LayoutViewer } from '../index';
import { createElement, remove, L10n, setCulture } from '@syncfusion/ej2-base';

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
    public initBookmarkDialog(localValue: L10n, bookmarks: string[]): void {
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

        let textBoxDiv: HTMLElement = createElement('div', { className: 'e-bookmark-textboxdiv' });
        searchDiv.appendChild(textBoxDiv);

        // tslint:disable-next-line:max-line-length
        this.textBoxInput = createElement('input', { className: 'e-input e-bookmark-textbox-input', id: 'bookmark_text_box' }) as HTMLInputElement;
        this.textBoxInput.setAttribute('type', 'text');
        textBoxDiv.appendChild(this.textBoxInput);

        let listviewDiv: HTMLElement = createElement('div', { className: 'e-bookmark-listViewDiv', id: 'bookmark_listview' });
        searchDiv.appendChild(listviewDiv);
        let arts: string[] = this.owner.bookmarks.keys;

        this.listviewInstance = new ListView({
            dataSource: bookmarks,
            cssClass: 'e-bookmark-listview',
        });

        this.listviewInstance.appendTo(listviewDiv);
        this.listviewInstance.addEventListener('select', this.selectHandler);

        let buttonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-button' });
        commonDiv.appendChild(buttonDiv);

        let addbuttonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-addbutton' });
        buttonDiv.appendChild(addbuttonDiv);
        let addButtonElement: HTMLElement = createElement('button', { innerHTML: 'Add', id: 'add' });
        addbuttonDiv.appendChild(addButtonElement);
        let addbutton: Button = new Button({ cssClass: 'e-button-custom' });
        addbutton.appendTo(addButtonElement);
        addButtonElement.addEventListener('click', this.addBookmark);

        let deleteButtonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-deletebutton' });
        buttonDiv.appendChild(deleteButtonDiv);
        let deleteButtonElement: HTMLElement = createElement('button', { innerHTML: 'Delete', id: 'delete' });
        deleteButtonDiv.appendChild(deleteButtonElement);
        let deletebutton: Button = new Button({ cssClass: 'e-button-custom' });
        deletebutton.appendTo(deleteButtonElement);
        deleteButtonElement.addEventListener('click', this.deleteBookmark);


        let gotoButtonDiv: HTMLElement = createElement('div', { className: 'e-bookmark-gotobutton' });
        buttonDiv.appendChild(gotoButtonDiv);
        let gotoButtonElement: HTMLElement = createElement('button', { innerHTML: 'Go To', id: 'goto' });
        gotoButtonDiv.appendChild(gotoButtonElement);
        let gotobutton: Button = new Button({ cssClass: 'e-button-custom' });
        gotobutton.appendTo(gotoButtonElement);
        gotoButtonElement.addEventListener('click', this.gotoBookmark);
    }
    /**
     * @private
     */
    public show(): void {
        let bookmarks: string[] = this.owner.getBookmarks();
        let localObj: L10n = new L10n('documenteditor', this.owner.owner.defaultLocale);
        localObj.setLocale(this.owner.owner.locale);
        setCulture(this.owner.owner.locale);
        // if (!this.target) {
        this.initBookmarkDialog(localObj, bookmarks);
        //}
        this.owner.dialog.header = 'Bookmark';
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
        this.owner.dialog.show();
    }
    private addBookmark = (): void => {
        this.owner.owner.editorModule.insertBookmark((this.textBoxInput as HTMLInputElement).value);
        this.owner.dialog.hide();
    }
    /* tslint:disable:no-any */
    private selectHandler = (args: any): void => {
        (this.textBoxInput as HTMLInputElement).value = args.text;
        /* tslint:disable:no-any */
        let value: any = document.getElementById('bookmark_text_box');
        value.setSelectionRange(0, (args.text as string).length);
        value.focus();
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

