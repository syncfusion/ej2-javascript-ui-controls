import { createElement, L10n, isNullOrUndefined, EventHandler, classList } from '@syncfusion/ej2-base';
import { Toolbar as EJ2Toolbar, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Button } from '@syncfusion/ej2-buttons';
import { DocumentEditorContainer } from '../document-editor-container';
import { DropDownButton, DropDownButtonModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { DocumentEditor } from '../../document-editor/document-editor';
import { showSpinner, hideSpinner } from '@syncfusion/ej2-popups';

const TOOLBAR_ID: string = '_toolbar';
const NEW_ID: string = '_new';
const OPEN_ID: string = '_open';
const UNDO_ID: string = '_undo';
const REDO_ID: string = '_redo';
const INSERT_IMAGE_ID: string = '_image';
const INSERT_IMAGE_LOCAL_ID: string = '_image_local';
const INSERT_IMAGE_ONLINE_ID: string = '_image_url';
const INSERT_TABLE_ID: string = '_table';
const INSERT_LINK_ID: string = '_link';
const BOOKMARK_ID: string = '_bookmark';
const TABLE_OF_CONTENT_ID: string = '_toc';
const HEADER_ID: string = '_header';
const FOOTER_ID: string = '_footer';
const PAGE_SET_UP_ID: string = '_page_setup';
const PAGE_NUMBER_ID: string = '_page_number';
const BREAK_ID: string = '_break';
const FIND_ID: string = '_find';
const CLIPBOARD_ID: string = '_use_local_clipboard';
const RESTRICT_EDITING_ID: string = '_restrict_edit';
const PAGE_BREAK: string = '_page_break';
const SECTION_BREAK: string = '_section_break';

/**
 * Toolbar Module
 */
export class Toolbar {
    /**
     * @private
     */
    public toolbar: EJ2Toolbar;
    /**
     * @private
     */
    public container: DocumentEditorContainer;
    /**
     * @private
     */
    public filePicker: HTMLInputElement;
    /**
     * @private
     */
    public imagePicker: HTMLInputElement;
    /**
     * @private
     */
    public propertiesPaneButton: Button;
    /**
     * @private
     */
    get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }
    /**
     * @private
     */
    constructor(container: DocumentEditorContainer) {
        this.container = container;
    }
    private getModuleName(): string {
        return 'toolbar';
    }
    /**
     * @private
     */
    public initToolBar(): void {
        this.render();
        this.wireEvent();
    }
    // tslint:disable-next-line:max-func-body-length
    private render(): void {
        if (isNullOrUndefined(this.container)) {
            return;
        }
        let toolbarContainer: HTMLElement = this.container.toolbarContainer;
        let toolbarWrapper: HTMLElement = createElement('div', { className: 'e-de-tlbr-wrapper' });
        let toolbarTarget: HTMLElement = createElement('div', { className: 'e-de-toolbar', styles: 'height:100%' });
        this.initToolbarItems();
        toolbarWrapper.appendChild(toolbarTarget);
        toolbarContainer.appendChild(toolbarWrapper);

        // Show hide pane button initialization 
        let propertiesPaneDiv: HTMLElement = createElement('div', { className: 'e-de-ctnr-properties-pane-btn' });
        let buttonElement: HTMLButtonElement = createElement('button', { attrs: { type: 'button' } }) as HTMLButtonElement;
        propertiesPaneDiv.appendChild(buttonElement);
        let cssClassName: string = 'e-tbar-btn e-tbtn-txt e-control e-btn e-de-showhide-btn';
        if (this.container.enableRtl) {
            cssClassName += '-rtl';
        }
        this.propertiesPaneButton = new Button({
            cssClass: cssClassName,
            iconCss: 'e-icons e-de-ctnr-showhide'
        });
        this.propertiesPaneButton.appendTo(buttonElement);
        EventHandler.add(buttonElement, 'click', this.showHidePropertiesPane, this);
        toolbarContainer.appendChild(propertiesPaneDiv);
        this.toolbar.appendTo(toolbarTarget);
        let locale: L10n = this.container.localObj;
        let id: string = this.container.element.id + TOOLBAR_ID;
        let imageButton: HTMLElement = toolbarTarget.getElementsByClassName('e-de-image-splitbutton')[0].firstChild as HTMLElement;
        let items: DropDownButtonModel = {
            items: [
                {
                    text: locale.getConstant('Upload from computer'), iconCss: 'e-icons e-de-ctnr-upload',
                    id: id + INSERT_IMAGE_LOCAL_ID
                }],
            //,{ text: locale.getConstant('By URL'), iconCss: 'e-icons e-de-ctnr-link', id: id + INSERT_IMAGE_ONLINE_ID }],
            cssClass: 'e-de-toolbar-btn-first e-caret-hide',
            iconCss: 'e-icons e-de-ctnr-image',
            select: this.onDropDownButtonSelect.bind(this),
        };
        let insertImage: DropDownButton = new DropDownButton(items, imageButton as HTMLButtonElement);

        let breakButton: HTMLElement = toolbarTarget.getElementsByClassName('e-de-break-splitbutton')[0].firstChild as HTMLElement;
        items = {
            items: [
                { text: locale.getConstant('Page Break'), iconCss: 'e-icons e-de-ctnr-page-break', id: id + PAGE_BREAK },
                { text: locale.getConstant('Section Break'), iconCss: 'e-icons e-de-ctnr-section-break', id: id + SECTION_BREAK }],
            cssClass: 'e-caret-hide',
            iconCss: 'e-icons e-de-ctnr-break',
            select: this.onDropDownButtonSelect.bind(this),
        };
        let inserBreak: DropDownButton = new DropDownButton(items, breakButton as HTMLButtonElement);

        this.filePicker = createElement('input', {
            attrs: { type: 'file', accept: '.doc,.docx,.rtf,.txt,.htm,.html,.sfdt' }, className: 'e-de-ctnr-file-picker'
        }) as HTMLInputElement;

        this.imagePicker = createElement('input', {
            attrs: { type: 'file', accept: '.jpg,.jpeg,.png,.bmp' }, className: 'e-de-ctnr-file-picker'
        }) as HTMLInputElement;
        this.toggleButton(id + CLIPBOARD_ID, this.container.enableLocalPaste);
        this.toggleButton(id + RESTRICT_EDITING_ID, this.container.restrictEditing);
    }
    private showHidePropertiesPane(): void {
        if (this.container.previousContext === 'TableOfContents' && this.container.showPropertiesPaneInternal) {
            this.documentEditor.focusIn();
            return;
        } else if (this.container.tocProperties.element.style.display === 'block' && this.container.showPropertiesPaneInternal) {
            this.enableDisablePropertyPaneButton(true);
            this.container.showPropertiesPaneOnSelection();
            return;
        }
        if (this.container.previousContext.indexOf('Header') >= 0
            || this.container.previousContext.indexOf('Footer') >= 0) {
            this.container.showHeaderProperties = !this.container.showHeaderProperties;
        } else {
            this.container.showPropertiesPaneInternal = !this.container.showPropertiesPaneInternal;
        }
        this.enableDisablePropertyPaneButton(this.container.showPropertiesPaneInternal);
        this.container.showPropertiesPaneOnSelection();
        this.documentEditor.focusIn();
    }
    private onWrapText(text: string): string {
        let content: string = '';
        let index: number = text.lastIndexOf(' ');
        content = text.slice(0, index);
        text.slice(index);
        content += '<div class="e-de-text-wrap">' + text.slice(index) + '</div>';
        return content;
    }
    private wireEvent(): void {
        this.propertiesPaneButton.on('click', this.togglePropertiesPane.bind(this));
        EventHandler.add(this.filePicker, 'change', this.onFileChange, this);
        EventHandler.add(this.imagePicker, 'change', this.onImageChange, this);
    }
    // tslint:disable-next-line:max-func-body-length
    private initToolbarItems(): void {
        let id: string = this.container.element.id + TOOLBAR_ID;
        let locale: L10n = this.container.localObj;
        this.toolbar = new EJ2Toolbar({
            enableRtl: this.container.enableRtl,
            clicked: this.clickHandler.bind(this),
            items: [
                {
                    prefixIcon: 'e-de-ctnr-new', tooltipText: locale.getConstant('Create a new document.'),
                    id: id + NEW_ID, text: locale.getConstant('New'), cssClass: 'e-de-toolbar-btn-start'
                },
                {
                    prefixIcon: 'e-de-ctnr-open', tooltipText: locale.getConstant('Open a document.'), id: id + OPEN_ID,
                    text: locale.getConstant('Open'), cssClass: 'e-de-toolbar-btn-last'
                },
                {
                    type: 'Separator', cssClass: 'e-de-separator'
                },
                {
                    prefixIcon: 'e-de-ctnr-undo', tooltipText: locale.getConstant('Undo the last operation (Ctrl+Z).'),
                    id: id + UNDO_ID, text: locale.getConstant('Undo'), cssClass: 'e-de-toolbar-btn-first'
                },
                {
                    prefixIcon: 'e-de-ctnr-redo', tooltipText: locale.getConstant('Redo the last operation (Ctrl+Y).'),
                    id: id + REDO_ID, text: locale.getConstant('Redo'), cssClass: 'e-de-toolbar-btn-last'
                },
                {
                    type: 'Separator', cssClass: 'e-de-separator'
                },
                {
                    tooltipText: locale.getConstant('Insert inline picture from a file.'), id: id + INSERT_IMAGE_ID,
                    text: locale.getConstant('Image'), cssClass: 'e-de-toolbar-btn-first e-de-image-splitbutton e-de-image-focus'
                },
                {
                    prefixIcon: 'e-de-ctnr-table', tooltipText: locale.getConstant('Insert a table into the document'),
                    id: id + INSERT_TABLE_ID, text: locale.getConstant('Table'), cssClass: 'e-de-toolbar-btn-middle'
                },
                {
                    prefixIcon: 'e-de-ctnr-link',
                    tooltipText: locale.getConstant('Create a link in your document for quick access to webpages and files (Ctrl+K).'),
                    id: id + INSERT_LINK_ID, text: locale.getConstant('Link'), cssClass: 'e-de-toolbar-btn-middle'
                },
                {
                    prefixIcon: 'e-de-ctnr-bookmark',
                    tooltipText: locale.getConstant('Insert a bookmark in a specific place in this document.'),
                    id: id + BOOKMARK_ID, text: locale.getConstant('Bookmark'), cssClass: 'e-de-toolbar-btn-middle'
                },
                {
                    prefixIcon: 'e-de-ctnr-tableofcontent',
                    tooltipText: locale.getConstant('Provide an overview of your document by adding a table of contents.'),
                    id: id + TABLE_OF_CONTENT_ID, text: this.onWrapText(locale.getConstant('Table of Contents')),
                    cssClass: 'e-de-toolbar-btn-last'
                },
                {
                    type: 'Separator', cssClass: 'e-de-separator'
                },
                {
                    prefixIcon: 'e-de-ctnr-header', tooltipText: locale.getConstant('Add or edit the header.'),
                    id: id + HEADER_ID, text: locale.getConstant('Header'), cssClass: 'e-de-toolbar-btn-first'
                },
                {
                    prefixIcon: 'e-de-ctnr-footer', tooltipText: locale.getConstant('Add or edit the footer.'),
                    id: id + FOOTER_ID, text: locale.getConstant('Footer'), cssClass: 'e-de-toolbar-btn-middle'
                },
                {
                    prefixIcon: 'e-de-ctnr-pagesetup', tooltipText: locale.getConstant('Open the page setup dialog.'),
                    id: id + PAGE_SET_UP_ID, text: this.onWrapText(locale.getConstant('Page Setup')),
                    cssClass: 'e-de-toolbar-btn-middle'
                },
                {

                    prefixIcon: 'e-de-ctnr-pagenumber', tooltipText: locale.getConstant('Add page numbers.'),
                    id: id + PAGE_NUMBER_ID, text: this.onWrapText(locale.getConstant('Page Number')),
                    cssClass: 'e-de-toolbar-btn-middle'
                },
                {
                    tooltipText: locale.getConstant('Break'), text: locale.getConstant('Break'), id: BREAK_ID,
                    cssClass: 'e-de-toolbar-btn-last e-de-break-splitbutton'
                },
                {
                    type: 'Separator', cssClass: 'e-de-separator'
                },
                {
                    prefixIcon: 'e-de-ctnr-find', tooltipText: locale.getConstant('Find text in the document (Ctrl+F).'),
                    id: id + FIND_ID, text: locale.getConstant('Find'), cssClass: 'e-de-toolbar-btn'
                },
                {
                    type: 'Separator', cssClass: 'e-de-separator'
                },
                {
                    prefixIcon: 'e-de-ctnr-paste',
                    tooltipText: locale.getConstant('Toggle between the internal clipboard and system clipboard'),
                    id: id + CLIPBOARD_ID, text: this.onWrapText(locale.getConstant('Local Clipboard')),
                    cssClass: 'e-de-toolbar-btn-first'
                },
                {
                    prefixIcon: 'e-de-ctnr-lock', tooltipText: locale.getConstant('Restrict editing.'), id: id + RESTRICT_EDITING_ID,
                    text: this.onWrapText(locale.getConstant('Restrict Editing')), cssClass: 'e-de-toolbar-btn-end'
                }
            ]
        });
    }
    private clickHandler(args: ClickEventArgs): void {
        let id: string = this.container.element.id + TOOLBAR_ID;
        switch (args.item.id) {
            case id + NEW_ID:
                this.container.documentEditor.openBlank();
                break;
            case id + OPEN_ID:
                this.filePicker.value = '';
                this.filePicker.click();
                break;
            case id + UNDO_ID:
                this.container.documentEditor.editorHistory.undo();
                break;
            case id + REDO_ID:
                this.container.documentEditor.editorHistory.redo();
                break;
            case id + INSERT_TABLE_ID:
                this.container.documentEditor.showDialog('Table');
                break;
            case id + INSERT_LINK_ID:
                this.container.documentEditor.showDialog('Hyperlink');
                break;
            case id + BOOKMARK_ID:
                this.container.documentEditor.showDialog('Bookmark');
                break;
            case id + HEADER_ID:
                this.container.documentEditor.selection.goToHeader();
                break;
            case id + TABLE_OF_CONTENT_ID:
                this.onToc();
                break;
            case id + FOOTER_ID:
                this.container.documentEditor.selection.goToFooter();
                break;
            case id + PAGE_SET_UP_ID:
                this.container.documentEditor.showDialog('PageSetup');
                break;
            case id + PAGE_NUMBER_ID:
                this.container.documentEditor.editor.insertPageNumber();
                break;
            case id + FIND_ID:
                this.container.documentEditor.showOptionsPane();
                break;
            case id + CLIPBOARD_ID:
                this.toggleLocalPaste(args.item.id);
                break;
            case id + RESTRICT_EDITING_ID:
                this.toggleEditing(args.item.id);
                break;
        }
        if (args.item.id !== id + FIND_ID && args.item.id !== id + INSERT_IMAGE_ID) {
            this.container.documentEditor.focusIn();
        }
    }
    private toggleLocalPaste(id: string): void {
        this.container.enableLocalPaste = !this.container.enableLocalPaste;
        this.toggleButton(id, this.container.enableLocalPaste);
    }
    private toggleEditing(id: string): void {
        this.container.restrictEditing = !this.container.restrictEditing;
        this.container.showPropertiesPane = !this.container.restrictEditing;
        this.toggleButton(id, this.container.restrictEditing);
    }
    private toggleButton(id: string, toggle: boolean): void {
        let element: HTMLElement = document.getElementById(id);
        if (toggle) {
            classList(element, ['e-btn-toggle'], []);
        } else {
            classList(element, [], ['e-btn-toggle']);
        }
    }
    private togglePropertiesPane(): void {
        this.container.showPropertiesPane = !this.container.showPropertiesPane;
    }
    private onDropDownButtonSelect(args: MenuEventArgs): void {
        let parentId: string = this.container.element.id + TOOLBAR_ID;
        let id: string = args.item.id;
        if (id === parentId + PAGE_BREAK) {
            this.container.documentEditor.editorModule.insertPageBreak();
        } else if (id === parentId + SECTION_BREAK) {
            this.container.documentEditor.editorModule.insertSectionBreak();
        } else if (id === parentId + INSERT_IMAGE_LOCAL_ID) {
            this.imagePicker.value = '';
            this.imagePicker.click();
        } else if (id === parentId + INSERT_IMAGE_ONLINE_ID) {
            // Need to implement image dialog;
        }
        setTimeout((): void => { this.documentEditor.focusIn(); }, 30);
    }
    private onFileChange(): void {
        let file: File = this.filePicker.files[0];
        if (file) {
            if (file.name.substr(file.name.lastIndexOf('.')) === '.sfdt') {
                let fileReader: FileReader = new FileReader();
                fileReader.onload = (): void => {
                    this.container.documentEditor.open(fileReader.result as string);
                };
                fileReader.readAsText(file);
            } else {
                this.convertToSfdt(file);
            }
            this.container.documentEditor.documentName = file.name.substr(0, file.name.lastIndexOf('.'));
        }
    }
    private convertToSfdt(file: File): void {
        let httpRequest: XMLHttpRequest = new XMLHttpRequest();
        httpRequest.open('POST', this.container.serviceUrl, true);
        httpRequest.onreadystatechange = (): void => {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200 || httpRequest.status === 304) {
                    this.container.documentEditor.open(httpRequest.responseText);
                } else {
                    alert('Failed to load the file');
                }
                hideSpinner(this.container.containerTarget);
            }
        };
        let formData: FormData = new FormData();
        formData.append('files', file);
        httpRequest.send(formData);
        showSpinner(this.container.containerTarget);
    }
    private onImageChange(): void {
        let file: File = this.imagePicker.files[0];
        let fileReader: FileReader = new FileReader();
        fileReader.onload = (): void => {
            this.insertImage(fileReader.result as string);
        };
        fileReader.readAsDataURL(file);
    }
    private insertImage(data: string): void {
        let image: HTMLImageElement = document.createElement('img');
        let container: DocumentEditorContainer = this.container;
        image.addEventListener('load', function (): void {
            container.documentEditor.editor.insertImage(data, this.width, this.height);
        });
        image.src = data;
    }
    /**
     * @private
     */
    public enableDisableToolBarItem(enable: boolean): void {
        let id: string = this.container.element.id + TOOLBAR_ID;
        for (let item of this.toolbar.items) {
            let itemId: string = item.id;
            if (itemId !== id + NEW_ID && itemId !== id + OPEN_ID && itemId !== id + FIND_ID &&
                itemId !== id + CLIPBOARD_ID && itemId !== id + RESTRICT_EDITING_ID && item.type !== 'Separator') {
                let element: HTMLElement = document.getElementById(item.id);
                this.toolbar.enableItems(element.parentElement, enable);
            }
        }
        classList(this.propertiesPaneButton.element.parentElement, !enable ? ['e-de-overlay'] : [], !enable ? [] : ['e-de-overlay']);
    }
    /**
     * @private
     */
    public enableDisableUndoRedo(): void {
        let id: string = this.container.element.id + TOOLBAR_ID;
        // tslint:disable-next-line:max-line-length
        this.toolbar.enableItems(document.getElementById(id + UNDO_ID).parentElement, this.container.documentEditor.editorHistory.canUndo());
        this.toolbar.enableItems(document.getElementById(id + REDO_ID).parentElement, this.container.documentEditor.editorHistory.canRedo());
    }
    private onToc(): void {
        if (this.container.previousContext === 'TableOfContents' && this.container.showPropertiesPaneInternal) {
            this.documentEditor.focusIn();
            return;
        }
        if (this.container.headerFooterProperties.element.style.display === 'block') {
            this.documentEditor.selection.closeHeaderFooter();
        }
        this.enableDisablePropertyPaneButton(false);
        this.container.showPropertiesPaneInternal = true;
        this.container.showProperties('toc');
    }
    /**
     * @private
     */
    public enableDisablePropertyPaneButton(isShow: boolean): void {
        if (isShow) {
            classList(this.propertiesPaneButton.element.firstChild as HTMLElement, ['e-pane-enabled'], ['e-pane-disabled']);
        } else {
            classList(this.propertiesPaneButton.element.firstChild as HTMLElement, ['e-pane-disabled'], ['e-pane-enabled']);
        }
    }

    /**
     * @private
     */
    public destroy(): void {
        if (this.toolbar) {
            let toolbarElement: HTMLElement = this.toolbar.element;
            this.toolbar.destroy();
            this.toolbar = undefined;
            toolbarElement.parentElement.removeChild(toolbarElement);
        }
        this.container = undefined;
    }
}