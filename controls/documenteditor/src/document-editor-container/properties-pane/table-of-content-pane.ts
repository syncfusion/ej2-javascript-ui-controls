import { DocumentEditor, ContextType, TableOfContentsSettings } from '../../document-editor/index';
import { createElement, L10n, classList } from '@syncfusion/ej2-base';
import { Button, CheckBox } from '@syncfusion/ej2-buttons';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Toolbar } from '../tool-bar';
import { DocumentEditorContainer } from '../document-editor-container';

/**
 * TOC Properties pane
 * @private
 */
export class TocProperties {
    private container: DocumentEditorContainer;
    public element: HTMLElement;
    private elementId: string;
    private template1Div: HTMLElement;
    private showPageNumber: CheckBox;
    private rightalignPageNumber: CheckBox;
    private hyperlink: CheckBox;
    private borderBtn: Button;
    private updateBtn: Button;
    private cancelBtn: Button;
    private borderLevelStyle: DropDownList;
    public headerDiv: HTMLElement;
    private closeButton: HTMLElement;
    private prevContext: ContextType;
    public localObj: L10n;
    private isRtl: boolean;
    /**
     * @private
     */
    get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }
    /**
     * @private
     */
    get toolbar(): Toolbar {
        return this.container.toolbarModule;
    }
    constructor(container: DocumentEditorContainer, isRtl?: boolean) {
        this.container = container;
        this.elementId = this.documentEditor.element.id;
        this.isRtl = isRtl;
        this.initializeTocPane();
    }

    private initializeTocPane = (): void => {
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        // tslint:disable-next-line:max-line-length
        this.element = createElement('div', { id: this.elementId + '_tocProperties', className: 'e-de-prop-pane' });
        let container: HTMLElement = createElement('div', { className: 'e-de-cntr-pane-padding e-de-prop-separator-line' });
        this.tocHeaderDiv(container);
        this.initTemplates(container);
        container = createElement('div', { className: 'e-de-cntr-pane-padding' });
        this.tocOptionsDiv(container);
        this.contentStylesDropdown(container);
        this.checkboxContent(container);
        this.buttonDiv(container);
        this.wireEvents();
        this.updateTocProperties();
        this.container.propertiesPaneContainer.appendChild(this.element);
    }
    private updateTocProperties = (): void => {
        this.rightalignPageNumber.checked = true;
        this.showPageNumber.checked = true;
        this.hyperlink.checked = true;
    }
    private wireEvents = (): void => {
        this.cancelBtn.element.addEventListener('click', (): void => { this.onClose(); });
        this.updateBtn.element.addEventListener('click', this.onInsertToc);
        this.closeButton.addEventListener('click', (): void => { this.onClose(); });
    }
    private onClose = (): void => {
        if (this.toolbar.showPropertiesPane
            && this.toolbar.previousContext !== 'TableOfContents') {
            this.toolbar.showPropertiesPaneOnSelection();
        } else {
            this.toolbar.showPropertiesPane = false;
            this.showTocPane(false);
            this.toolbar.enableDisablePropertyPaneButton(false);
            this.container.showPropertiesPane = false;
        }
    }
    private tocHeaderDiv = (container: HTMLElement): void => {
        let closeButtonFloat: string;
        let headerDivMargin: string;
        let closeButtonMargin: string;
        if (!this.isRtl) {
            closeButtonFloat = 'float:right;';
            headerDivMargin = 'margin-left:5.5px;';
            closeButtonMargin = 'margin-right:7px;';
        } else {
            closeButtonFloat = 'float:left;';
            headerDivMargin = 'margin-right:5.5px;';
            closeButtonMargin = 'margin-left:7px;';
        }
        let headerDiv: HTMLElement = createElement('div', {
            id: this.elementId + 'toc_id',
            styles: 'display: block;margin-top:8px;margin-bottom: 2px;' + headerDivMargin
        });
        container.appendChild(headerDiv);
        this.element.appendChild(container);
        let title: HTMLElement = createElement('label', {
            className: 'e-de-ctnr-prop-label'
        });
        title.textContent = this.localObj.getConstant('Table of Contents');
        headerDiv.appendChild(title);
        this.closeButton = createElement('span', {
            className: 'e-de-ctnr-close e-icons',
            styles: 'cursor: pointer;display:inline-block;color: #4A4A4A;' + closeButtonFloat + closeButtonMargin
        });
        headerDiv.appendChild(this.closeButton);
    }
    private initTemplates = (container: HTMLElement): void => {
        this.template1(container);
        // tslint:disable-next-line:max-line-length
        // let div: HTMLElement = createElement('div', { styles: 'display:block;border-top: 1px solid #E0E0E0;' }); this.element.appendChild(div);
    }

    private template1 = (container: HTMLElement): void => {
        this.template1Div = createElement('div', {
            className: 'e-de-toc-template1'
        });
        if (this.isRtl) {
            this.template1Div.classList.add('e-de-rtl');
        }
        container.appendChild(this.template1Div);
        let templateContent1: HTMLElement = createElement('div', {
            className: 'e-de-toc-template1-content1'
        });
        templateContent1.textContent = this.localObj.getConstant('HEADING - - - - 1');
        this.template1Div.appendChild(templateContent1);
        let templateContent2: HTMLElement = createElement('div', {
            className: 'e-de-toc-template1-content2'
        });
        templateContent2.textContent = this.localObj.getConstant('HEADING - - - - 2');
        this.template1Div.appendChild(templateContent2);
        let templateContent3: HTMLElement = createElement('div', {
            className: 'e-de-toc-template1-content3'
        });
        templateContent3.textContent = this.localObj.getConstant('HEADING - - - - 3');
        this.template1Div.appendChild(templateContent3);
    }

    private tocOptionsDiv = (container: HTMLElement): void => {
        let optionsDiv: HTMLElement = createElement('div');
        container.appendChild(optionsDiv);
        this.element.appendChild(container);
        if (this.isRtl) {
            optionsDiv.classList.add('e-de-rtl');
        }
        let label: HTMLElement = createElement('label', { className: 'e-de-ctnr-prop-label' });
        label.textContent = this.localObj.getConstant('Options');
        optionsDiv.appendChild(label);
    }
    /* tslint:disable */
    private createDropdownOption(ulTag: HTMLElement, text: string): any {
        let liTag: HTMLElement = createElement('li', {
            styles: 'display:block',
            className: 'e-de-floating-menuitem e-de-floating-menuitem-md de-list-items  de-list-item-size'
        });
        ulTag.appendChild(liTag);
        let innerHTML: any;
        if (text === 'None') {
            innerHTML = '<div>' + text + '</div>';
        } else if (text === '1.5px') {
            // tslint:disable-next-line:max-line-length
            innerHTML = '<div>' + text + '<span class="e-de-list-line" style="margin-left:10px;border-bottom-width:' + text + '"></span></div>';
        } else {
            // tslint:disable-next-line:max-line-length
            innerHTML = '<div>' + text + '<span class="e-de-list-line" style="margin-left:20px;border-bottom-width:' + text + '"></span></div>';
        }
        let liInnerDiv: HTMLElement = createElement('div', {
            className: 'e-de-list-header-presetmenu',
            innerHTML: innerHTML
        });
        liTag.appendChild(liInnerDiv);
        return liTag;
    }
    // tslint:disable-next-line:max-line-length
    public createDropDownButton(id: string, parentDiv: HTMLElement, iconCss: string, content: string[], selectedIndex: number): DropDownList {
        let buttonElement: HTMLButtonElement = createElement('input', { id: id }) as HTMLButtonElement;
        parentDiv.appendChild(buttonElement);
        // tslint:disable-next-line:max-line-length  
        let dropDownBtn: DropDownList = new DropDownList({ index: selectedIndex, dataSource: content, popupHeight: '150px', cssClass: 'e-de-prop-font-button' }, buttonElement);
        return dropDownBtn;
    }
    /* tslint:disable */
    private contentStylesDropdown = (container: HTMLElement): void => {
        let contentStyleElementMargin: string;
        if (!this.isRtl) {
            contentStyleElementMargin = 'margin-left:5.5px;';
        } else {
            contentStyleElementMargin = 'margin-right:5.5px;';
        }
        let contentStyleElement: HTMLElement = createElement('div', { id: 'contentstyle_div' });
        // tslint:disable-next-line:max-line-length
        contentStyleElement.setAttribute('title', this.localObj.getConstant('Number of heading or outline levels to be shown in table of contents.'));
        container.appendChild(contentStyleElement);
        // let items: ItemModel[] = [{ text: '___________', id: 'solid' }];

        // this.borderStyle = this.createDropDownButton(
        //     this.elementId + '_borderStyleDiv',
        //     'width:120px;height:28px;margin-top:8px', contentStyleElement, 'e-de-icon-stroke-size', 'Solid', items
        // );
        let labelMargin: string;
        if (!this.isRtl) {
            labelMargin = 'margin-right:8px;';
        } else {
            labelMargin = 'margin-left:8px';
        }
        let label: HTMLElement = createElement('label', { className: 'e-de-prop-sub-label', styles: 'display:block' });
        label.textContent = this.localObj.getConstant('Levels');
        contentStyleElement.appendChild(label);
        container.appendChild(contentStyleElement);
        let dataSource: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        this.borderLevelStyle = this.createDropDownButton(
            this.elementId + '_borderLevelDiv',
            contentStyleElement, '', dataSource, 2
        );
        this.borderLevelStyle.change = (args: any): void => {
            this.borderLevelStyle.value = args.item.value;
        };
        container.appendChild(contentStyleElement);
    }

    private checkboxContent = (container: HTMLElement): void => {
        let checkboxElementMargin: string;
        if (!this.isRtl) {
            checkboxElementMargin = 'margin-left:5.5px;';
        } else {
            checkboxElementMargin = 'margin-right:5.5px;';
        }
        // tslint:disable-next-line:max-line-length
        let checkboxElement: HTMLElement = createElement('div', { id: 'toc_checkboxDiv', styles: 'margin-bottom:20px;' });
        container.appendChild(checkboxElement);
        let showPageNumberDiv: HTMLElement = createElement('div', { className: 'e-de-toc-checkbox1' });
        showPageNumberDiv.setAttribute('title', this.localObj.getConstant('Show page numbers in table of contents.'));
        checkboxElement.appendChild(showPageNumberDiv);
        // tslint:disable-next-line:max-line-length
        let showpagenumberCheckboxElement: HTMLElement = createElement('input', { id: 'showpagenumber', styles: 'width:12px;height:12px;margin-bottom:8px', className: 'e-de-prop-sub-label' });
        showPageNumberDiv.appendChild(showpagenumberCheckboxElement);
        this.showPageNumber = new CheckBox({
            label: this.localObj.getConstant('Show page numbers'),
            enableRtl: this.isRtl
        });
        this.showPageNumber.appendTo(showpagenumberCheckboxElement);
        let rightAlignDiv: HTMLElement = createElement('div', { className: 'e-de-toc-checkbox2' });
        rightAlignDiv.setAttribute('title', this.localObj.getConstant('Right align page numbers in table of contents.'));
        checkboxElement.appendChild(rightAlignDiv);
        // tslint:disable-next-line:max-line-length
        let rightalignpagenumberCheckboxElement: HTMLElement = createElement('input', { id: 'rightalignpagenumber', styles: 'width:12px;height:12px', className: 'e-de-prop-sub-label' });
        rightAlignDiv.appendChild(rightalignpagenumberCheckboxElement);
        this.rightalignPageNumber = new CheckBox({
            label: this.localObj.getConstant('Right align page numbers'),
            enableRtl: this.isRtl
        });
        this.rightalignPageNumber.appendTo(rightalignpagenumberCheckboxElement);
        let hyperlinkDiv: HTMLElement = createElement('div', { className: 'e-de-toc-checkbox3' });
        hyperlinkDiv.setAttribute('title', this.localObj.getConstant('Use hyperlinks instead of page numbers.'));
        checkboxElement.appendChild(hyperlinkDiv);
        // tslint:disable-next-line:max-line-length
        let hyperlinkCheckboxElement: HTMLElement = createElement('input', { id: 'hyperlinkdiv', styles: 'width:12px;height:12px', className: 'e-de-prop-sub-label' });
        hyperlinkDiv.appendChild(hyperlinkCheckboxElement);
        this.hyperlink = new CheckBox({
            label: this.localObj.getConstant('Use hyperlinks'),
            enableRtl: this.isRtl
        });
        this.hyperlink.appendTo(hyperlinkCheckboxElement);
    }

    private buttonDiv = (container: HTMLElement): void => {
        let footerElementFloat: string;
        if (!this.isRtl) {
            footerElementFloat = 'float:right';
        } else {
            footerElementFloat = 'float:left';
        }
        let footerElement: HTMLElement = createElement('div', { id: 'footerDiv', styles: footerElementFloat });
        container.appendChild(footerElement);
        let updatebuttoncontentStyleElement: HTMLElement = createElement('button', { id: 'footerupdatebuttonDiv' });
        footerElement.appendChild(updatebuttoncontentStyleElement);
        this.updateBtn = new Button({
            content: this.localObj.getConstant('Update'), cssClass: 'btn-update', isPrimary: true
        });
        this.updateBtn.appendTo(updatebuttoncontentStyleElement);

        let cancelbuttoncontentStyleElement: HTMLElement = createElement('button', { id: 'footercancelbuttonDiv' });
        footerElement.appendChild(cancelbuttoncontentStyleElement);
        this.cancelBtn = new Button({
            content: this.localObj.getConstant('Cancel'), cssClass: this.isRtl ? 'e-de-btn-cancel-rtl' : 'e-de-btn-cancel'
        });
        this.cancelBtn.appendTo(cancelbuttoncontentStyleElement);
    }

    public showTocPane = (isShow: boolean, previousContextType?: ContextType): void => {
        if (!isShow && this.element.style.display === 'none' || (isShow && this.element.style.display === 'block')) {
            return;
        }
        this.element.style.display = isShow ? 'block' : 'none';
        // tslint:disable-next-line:max-line-length
        this.updateBtn.content = this.documentEditor.selection.contextType === 'TableOfContents' ? this.localObj.getConstant('Update') : this.localObj.getConstant('Insert');
        this.prevContext = this.documentEditor.selection.contextType;
        this.documentEditor.resize();
        if (isShow) {
            this.updateBtn.element.focus();
        }
    }

    private onInsertToc = (): void => {
        // tslint:disable-next-line:max-line-length
        let tocSettings: TableOfContentsSettings = {
            startLevel: 1,
            endLevel: parseInt(this.borderLevelStyle.value as string, 0),
            includeHyperlink: this.hyperlink.checked,
            includePageNumber: this.showPageNumber.checked,
            rightAlign: this.rightalignPageNumber.checked
        };
        this.documentEditor.editor.insertTableOfContents(tocSettings);
    }
    public destroy(): void {
        this.container = undefined;
        if (this.showPageNumber) {
            this.showPageNumber.destroy();
            this.showPageNumber = undefined;
        }
        if (this.rightalignPageNumber) {
            this.rightalignPageNumber.destroy();
            this.rightalignPageNumber = undefined;
        }
        if (this.borderBtn) {
            this.borderBtn.destroy();
            this.borderBtn = undefined;
        }
        if (this.borderLevelStyle) {
            this.borderLevelStyle.destroy();
            this.borderLevelStyle = undefined;
        }
    }
}