import { DocumentEditor, ContextType, TableOfContentsSettings } from '../../document-editor/index';
import { createElement, L10n, classList } from '@syncfusion/ej2-base';
import { Button, CheckBox } from '@syncfusion/ej2-buttons';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Toolbar } from '../tool-bar';
import { DocumentEditorContainer } from '../document-editor-container';

/**
 * TOC Properties pane
 *
 * @private
 */
export class TocProperties {
    private container: DocumentEditorContainer;
    public element: HTMLElement;
    private elementId: string;
    private showPageNumber: CheckBox;
    private rightalignPageNumber: CheckBox;
    private hyperlink: CheckBox;
    private borderBtn: Button;
    private updateBtn: Button;
    private cancelBtn: Button;
    private borderLevelStyle: DropDownList;
    private prevContext: ContextType;
    public localObj: L10n;
    private isRtl: boolean;

    //HTML Elements
    public headerDiv: HTMLElement;
    private closeButton: HTMLElement;
    private template1Div: HTMLElement;
    private title: HTMLElement;
    private templateContent1: HTMLElement;
    private templateContent2: HTMLElement;
    private templateContent3: HTMLElement;
    private optionsDiv: HTMLElement;
    private label: HTMLElement;
    private contentStyleElement: HTMLElement;
    private checkboxElement: HTMLElement;
    private showPageNumberDiv: HTMLElement;
    private showpagenumberCheckboxElement: HTMLElement;
    private rightAlignDiv: HTMLElement;
    private rightalignpagenumberCheckboxElement: HTMLElement;
    private hyperlinkDiv: HTMLElement;
    private hyperlinkCheckboxElement: HTMLElement;
    private footerElement: HTMLElement;
    private updatebuttoncontentStyleElement: HTMLElement;
    private cancelbuttoncontentStyleElement: HTMLElement;
    private dropDownLabel: HTMLElement;

    //Events Hook Constants
    private onCloseClickHook: EventListenerOrEventListenerObject = this.onCloseClick.bind(this);
    private onInsertToClickHook: EventListenerOrEventListenerObject = this.onInsertToc.bind(this);

    private get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }

    private get toolbar(): Toolbar {
        return this.container.toolbarModule;
    }
    public constructor(container: DocumentEditorContainer, isRtl?: boolean) {
        this.container = container;
        this.elementId = this.documentEditor.element.id;
        this.isRtl = isRtl;
        this.initializeTocPane();
    }
    /**
     * @private
     * @param {boolean} enable - enable/disable table of content pane.
     * @returns {void}
     */
    public enableDisableElements(enable: boolean): void {
        if (enable) {
            classList(this.element, [], ['e-de-overlay']);
        } else {
            classList(this.element, ['e-de-overlay'], []);
        }
    }
    private initializeTocPane(): void {
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
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
    private updateTocProperties(): void {
        this.rightalignPageNumber.checked = true;
        this.showPageNumber.checked = true;
        this.hyperlink.checked = true;
    }
    private wireEvents(): void {
        this.cancelBtn.element.addEventListener('click', this.onCloseClickHook);
        this.updateBtn.element.addEventListener('click', this.onInsertToClickHook);
        this.closeButton.addEventListener('click', this.onCloseClickHook);
    }

    private onCloseClick(): void {
        this.onClose();
    }

    private onClose(): void {
        if (this.container.showPropertiesPane
            && this.container.previousContext !== 'TableOfContents') {
            this.container.showPropertiesPaneOnSelection();
        } else {
            this.showTocPane(false);
            if (this.toolbar) {
                this.toolbar.enableDisablePropertyPaneButton(false);
            }
            this.container.showPropertiesPane = false;
        }
    }
    private tocHeaderDiv(container: HTMLElement): void {
        let closeButtonFloat: string;
        //let headerDivMargin: string;
        let closeButtonMargin: string;
        if (!this.isRtl) {
            closeButtonFloat = 'float:right;';
            //headerDivMargin = 'margin-left:5.5px;';
            closeButtonMargin = 'margin-right:7px;';
        } else {
            closeButtonFloat = 'float:left;';
            //headerDivMargin = 'margin-right:5.5px;';
            closeButtonMargin = 'margin-left:7px;';
        }

        this.headerDiv = createElement('div', {
            id: this.elementId + 'toc_id',
            styles: 'display: block;'
        });
        container.appendChild(this.headerDiv);
        this.element.appendChild(container);
        this.title = createElement('label', {
            className: 'e-de-ctnr-prop-label'
        });
        this.title.textContent = this.localObj.getConstant('Table of Contents');
        this.headerDiv.appendChild(this.title);
        this.closeButton = createElement('span', {
            className: 'e-de-ctnr-close e-icons',
            styles: 'cursor: pointer;display:inline-block;color: #4A4A4A;' + closeButtonFloat + closeButtonMargin
        });
        this.headerDiv.appendChild(this.closeButton);
    }
    private initTemplates(container: HTMLElement): void {
        this.template1(container);
        // let div: HTMLElement = createElement('div', { styles: 'display:block;border-top: 1px solid #E0E0E0;' }); this.element.appendChild(div);
    }

    private template1(container: HTMLElement): void {
        this.template1Div = createElement('div', {
            className: 'e-de-toc-template1'
        });
        if (this.isRtl) {
            this.template1Div.classList.add('e-de-rtl');
        }
        container.appendChild(this.template1Div);
        this.templateContent1 = createElement('div', {
            className: 'e-de-toc-template1-content1'
        });
        this.templateContent1.textContent = this.localObj.getConstant('HEADING - - - - 1');
        this.template1Div.appendChild(this.templateContent1);
        this.templateContent2 = createElement('div', {
            className: 'e-de-toc-template1-content2'
        });
        this.templateContent2.textContent = this.localObj.getConstant('HEADING - - - - 2');
        this.template1Div.appendChild(this.templateContent2);
        this.templateContent3 = createElement('div', {
            className: 'e-de-toc-template1-content3'
        });
        this.templateContent3.textContent = this.localObj.getConstant('HEADING - - - - 3');
        this.template1Div.appendChild(this.templateContent3);
    }

    private tocOptionsDiv(container: HTMLElement): void {
        this.optionsDiv = createElement('div');
        container.appendChild(this.optionsDiv);
        this.element.appendChild(container);
        if (this.isRtl) {
            this.optionsDiv.classList.add('e-de-rtl');
        }
        this.label = createElement('label', { className: 'e-de-ctnr-prop-label' });
        this.label.textContent = this.localObj.getConstant('Options');
        this.optionsDiv.appendChild(this.label);
    }

    /* eslint-disable-next-line max-len */
    public createDropDownButton(id: string, parentDiv: HTMLElement, iconCss: string, content: string[], selectedIndex: number): DropDownList {
        const buttonElement: HTMLButtonElement = createElement('input', { id: id }) as HTMLButtonElement;
        parentDiv.appendChild(buttonElement);
        const dropDownBtn: DropDownList = new DropDownList({ index: selectedIndex, dataSource: content, popupHeight: '150px', cssClass: 'e-de-prop-font-button', placeholder: this.localObj.getConstant('Levels')}, buttonElement);
        return dropDownBtn;
    }
    /* eslint-disable */
    private contentStylesDropdown(container: HTMLElement): void {
        let contentStyleElementMargin: string;
        if (!this.isRtl) {
            contentStyleElementMargin = 'margin-left:5.5px;';
        } else {
            contentStyleElementMargin = 'margin-right:5.5px;';
        }
        this.contentStyleElement = createElement('div', { id: 'contentstyle_div' });
        this.contentStyleElement.setAttribute('title', this.localObj.getConstant('Number of heading or outline levels to be shown in table of contents'));
        container.appendChild(this.contentStyleElement);
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
        this.dropDownLabel= createElement('label', { className: 'e-de-prop-sub-label', styles: 'display:block' });
        this.dropDownLabel.textContent = this.localObj.getConstant('Levels');
        this.contentStyleElement.appendChild(this.dropDownLabel);
        container.appendChild(this.contentStyleElement);
        let dataSource: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        this.borderLevelStyle = this.createDropDownButton(
            this.elementId + '_borderLevelDiv',
            this.contentStyleElement, '', dataSource, 2
        );
        this.borderLevelStyle.change = (args: any): void => {
            this.borderLevelStyle.value = args.item.value;
        };
        container.appendChild(this.contentStyleElement);
    }

    private checkboxContent(container: HTMLElement): void {
        let checkboxElementMargin: string;
        if (!this.isRtl) {
            checkboxElementMargin = 'margin-left:5.5px;';
        } else {
            checkboxElementMargin = 'margin-right:5.5px;';
        }
        this.checkboxElement = createElement('div', { id: 'toc_checkboxDiv', styles: 'margin-bottom:36px;' });
        container.appendChild(this.checkboxElement);
        this.showPageNumberDiv = createElement('div', { className: 'e-de-toc-checkbox1' });
        this.showPageNumberDiv.setAttribute('title', this.localObj.getConstant('Show page numbers in table of contents'));
        this.checkboxElement.appendChild(this.showPageNumberDiv);
        this.showpagenumberCheckboxElement = createElement('input', { id: 'showpagenumber', styles: 'width:12px;height:12px;margin-bottom:8px', className: 'e-de-prop-sub-label' });
        this.showPageNumberDiv.appendChild(this.showpagenumberCheckboxElement);
        this.showPageNumber = new CheckBox({
            label: this.localObj.getConstant('Show page numbers'),
            enableRtl: this.isRtl
        });
        this.showPageNumber.appendTo(this.showpagenumberCheckboxElement);
        this.rightAlignDiv= createElement('div', { className: 'e-de-toc-checkbox2' });
        this.rightAlignDiv.setAttribute('title', this.localObj.getConstant('Right align page numbers in table of contents'));
        this.checkboxElement.appendChild(this.rightAlignDiv);
        this.rightalignpagenumberCheckboxElement= createElement('input', { id: 'rightalignpagenumber', styles: 'width:12px;height:12px', className: 'e-de-prop-sub-label' });
        this.rightAlignDiv.appendChild(this.rightalignpagenumberCheckboxElement);
        this.rightalignPageNumber = new CheckBox({
            label: this.localObj.getConstant('Right align page numbers'),
            enableRtl: this.isRtl
        });
        this.rightalignPageNumber.appendTo(this.rightalignpagenumberCheckboxElement);
        this.hyperlinkDiv= createElement('div', { className: 'e-de-toc-checkbox3' });
        this.hyperlinkDiv.setAttribute('title', this.localObj.getConstant('Use hyperlinks instead of page numbers'));
        this.checkboxElement.appendChild(this.hyperlinkDiv);
        this.hyperlinkCheckboxElement = createElement('input', { id: 'hyperlinkdiv', styles: 'width:12px;height:12px', className: 'e-de-prop-sub-label' });
        this.hyperlinkDiv.appendChild(this.hyperlinkCheckboxElement);
        this.hyperlink = new CheckBox({
            label: this.localObj.getConstant('Use hyperlinks'),
            enableRtl: this.isRtl
        });
        this.hyperlink.appendTo(this.hyperlinkCheckboxElement);
    }

    private buttonDiv(container: HTMLElement): void {
        let footerElementFloat: string;
        if (!this.isRtl) {
            footerElementFloat = 'float:right';
        } else {
            footerElementFloat = 'float:left';
        }
        this.footerElement = createElement('div', { id: 'footerDiv', styles: footerElementFloat });
        container.appendChild(this.footerElement);
        this.updatebuttoncontentStyleElement= createElement('button', {
            id: 'footerupdatebuttonDiv',
            attrs: { type: 'button' }
        });
        this.footerElement.appendChild(this.updatebuttoncontentStyleElement);
        this.updateBtn = new Button({
            content: this.localObj.getConstant('Update'), cssClass: 'btn-update', isPrimary: true
        });
        this.updateBtn.appendTo(this.updatebuttoncontentStyleElement);

        this.cancelbuttoncontentStyleElement = createElement('button', {
            id: 'footercancelbuttonDiv',
            attrs: { type: 'button' }
        });
        this.footerElement.appendChild(this.cancelbuttoncontentStyleElement);
        this.cancelBtn = new Button({
            content: this.localObj.getConstant('Cancel'), cssClass: this.isRtl ? 'e-de-btn-cancel-rtl' : 'e-de-btn-cancel'
        });
        this.cancelbuttoncontentStyleElement.setAttribute('aria-label', this.cancelBtn.content);
        this.cancelBtn.appendTo(this.cancelbuttoncontentStyleElement);

    }

    private enableDisableInsertButton(enable: boolean): void {
        if(this.prevContext === 'Text') {
            this.updateBtn.disabled = enable;
        } else {
            this.updateBtn.disabled = false;
        }
    }

    public showTocPane(isShow: boolean, previousContextType?: ContextType): void {
        if (!isShow && this.element.style.display === 'none' || (isShow && this.element.style.display === 'block')) {
            if(this.updateBtn) {
                this.enableDisableInsertButton(false);
            }
            return;
        }
        this.element.style.display = isShow ? 'block' : 'none';
        this.updateBtn.content = this.documentEditor.selectionModule.contextType === 'TableOfContents' ? this.localObj.getConstant('Update') : this.localObj.getConstant('Insert');
        this.updateBtn.element.setAttribute('aria-label', this.updateBtn.content);
        this.prevContext = this.documentEditor.selectionModule.contextType;
        this.enableDisableInsertButton(this.documentEditor.selectionModule.isPlainContentControl());
        this.documentEditor.resize();
        if (isShow) {
            this.updateBtn.element.focus();
        }
    }

    private onInsertToc(): void {
        let tocSettings: TableOfContentsSettings = {
            startLevel: 1,
            endLevel: parseInt(this.borderLevelStyle.value as string, 0),
            includeHyperlink: this.hyperlink.checked,
            includeOutlineLevels: true,
            includePageNumber: this.showPageNumber.checked,
            rightAlign: this.rightalignPageNumber.checked
        };
        if (tocSettings.rightAlign) {
            tocSettings.tabLeader = 'Dot';
        }
        this.documentEditor.editorModule.insertTableOfContents(tocSettings);
        this.documentEditor.focusIn();
    }

    public destroy(): void {
        this.container = undefined;
        this.removeHTMLDOM();
        this.unWireEvents();
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
        if (this.hyperlink) {
            this.hyperlink.destroy();
        }
        this.hyperlink = undefined;
        if (this.updateBtn) {
            this.updateBtn.destroy();
        }
        this.updateBtn = undefined;
        if (this.cancelBtn) {
            this.cancelBtn.destroy();
        }
        this.cancelBtn = undefined;
        this.localObj = undefined;
        this.isRtl = undefined;
        if (this.element) {
            this.element.innerHTML = '';
            this.element = undefined;
        }
    }

    private unWireEvents(): void {
        this.cancelBtn.element.removeEventListener('click', this.onCloseClickHook);
        this.updateBtn.element.removeEventListener('click', this.onInsertToClickHook);
        this.closeButton.removeEventListener('click', this.onCloseClickHook);

        this.onCloseClickHook = undefined;
        this.onInsertToClickHook = undefined;
    }

    private removeHTMLDOM(): void {
        this.template1Div.remove();
        this.headerDiv.remove();
        this.closeButton.remove();
        this.title.remove();
        this.templateContent1.remove();
        this.templateContent2.remove();
        this.templateContent3.remove();
        this.optionsDiv.remove();
        this.label.remove();
        this.contentStyleElement.remove();
        this.checkboxElement.remove();
        this.showPageNumberDiv.remove();
        this.showpagenumberCheckboxElement.remove();
        this.rightAlignDiv.remove();
        this.rightalignpagenumberCheckboxElement.remove();
        this.hyperlinkDiv.remove();
        this.hyperlinkCheckboxElement.remove();
        this.footerElement.remove();
        this.updatebuttoncontentStyleElement.remove();
        this.cancelbuttoncontentStyleElement.remove();
    }
}