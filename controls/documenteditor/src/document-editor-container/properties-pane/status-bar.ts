import { DocumentEditor, ViewChangeEventArgs } from '../../document-editor/index';
import { createElement, KeyboardEventArgs, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownButton, ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { DocumentEditorContainer } from '../document-editor-container';
import { Button } from '@syncfusion/ej2-buttons';
/**
 * Represents document editor status bar.
 *
 * @private
 */
export class StatusBar {
    //EJ2 Components
    private zoom: DropDownButton;
    private spellCheckButton: DropDownButton;
    private pageBtn : Button;
    private webBtn: Button;
    //HTML Elements
    private pageNumDiv: HTMLElement;
    private statusBarDiv: HTMLElement;
    private pageCount: HTMLElement;
    private pageLabel: HTMLElement;
    private pageNumberInput: HTMLInputElement;
    private editablePageNumber: HTMLElement;
    /**
     * @private
     */
    public loadingDiv: HTMLElement;
    private ofLabel: HTMLElement;
    private zoomBtn: HTMLButtonElement;
    private pageButton: HTMLButtonElement;
    private webButton: HTMLButtonElement;
    private verticalLine: HTMLElement;
    private spellCheckBtn: HTMLButtonElement;

    //Private Variables
    private container: DocumentEditorContainer;
    public startPage: number = 1;
    public localObj: L10n;
    private currentLanguage: number;
    private allowSuggestion: boolean;
    //Event Handler
    private onPageLayoutClickHandler: EventListenerOrEventListenerObject = this.onPageLayoutClick.bind(this);
    private onWebLayoutClickHandler: EventListenerOrEventListenerObject = this.onWebLayoutClick.bind(this);
    private onPageNumberKeyDownHandler: EventListenerOrEventListenerObject = this.onPageNumberKeyDown.bind(this);
    private onPageNumberKeyUpHandler: EventListenerOrEventListenerObject = this.onPageNumberKeyUp.bind(this);
    private onPageNumberBlurHandler: EventListenerOrEventListenerObject = this.onPageNumberBlur.bind(this);
    private onPageNumberFocusHandler: EventListenerOrEventListenerObject = this.onPageNumberFocus.bind(this);
    //Event Handler Methods
    private onPageLayoutClick(): void {
        if (this.documentEditor.documentHelper.isDocumentLoadAsynchronously) {
            return;
        }
        this.documentEditor.layoutType = 'Pages';
        this.addRemoveClass(this.pageButton, this.webButton);
        this.documentEditor.focusIn();
    }
    private onWebLayoutClick(): void {
        if (this.documentEditor.documentHelper.isDocumentLoadAsynchronously) {
            return;
        }
        this.documentEditor.layoutType = 'Continuous';
        this.addRemoveClass(this.webButton, this.pageButton);
        this.documentEditor.focusIn();
    }
    private onPageNumberKeyDown(e: KeyboardEventArgs): void {
        if (e.which === 13) {
            e.preventDefault();
            const pageNumber: number = parseInt(this.pageNumberInput.value, 10);
            if (pageNumber > this.editorPageCount) {
                this.updatePageNumber();
            } else {
                if (this.documentEditor.selectionModule) {
                    this.documentEditor.selectionModule.goToPage(parseInt(this.pageNumberInput.value, 10));
                    this.documentEditor.focusIn();
                } else {
                    this.documentEditor.scrollToPage(parseInt(this.pageNumberInput.value, 10));
                }
            }
            this.pageNumberInput.contentEditable = 'false';
            if (this.pageNumberInput.value === '') {
                this.updatePageNumber();
            }
        }
        if (e.shiftKey || (e.which > 64 && !(95 < e.which && e.which < 106))) {
            e.preventDefault();
        }
    }
    private onPageNumberKeyUp(): void {
        this.updatePageNumberWidth();
    }
    private onPageNumberBlur(): void {
        if (this.pageNumberInput.value === '' || parseInt(this.pageNumberInput.value, 10) > this.editorPageCount) {
            this.updatePageNumber();
        }
        this.pageNumberInput.contentEditable = 'false';
    }
    private onPageNumberFocus(): void {
        this.pageNumberInput.select();
    }
    //Public Methods

    //Properties
    private get documentEditor(): DocumentEditor {
        return this.container ? this.container.documentEditor : undefined;
    }
    private get editorPageCount(): number {
        return this.documentEditor ? this.documentEditor.pageCount : 1;
    }
    public constructor(parentElement: HTMLElement, docEditor: DocumentEditorContainer) {
        this.statusBarDiv = parentElement;
        this.container = docEditor;
        this.initializeStatusBar();
        this.wireEvents();
    }
    private initializeStatusBar(): void {
        const isRtl: boolean = this.container.enableRtl;
        this.documentEditor.enableSpellCheck = (this.container.enableSpellCheck) ? true : false;
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        const styles: string = isRtl ? 'padding-right:16px' : 'padding-left:16px';
        this.pageNumDiv = createElement('div', { className: (this.container.enableSpellCheck) ? 'e-de-ctnr-pg-no' : 'e-de-ctnr-pg-no-spellout', styles: styles });
        this.statusBarDiv.appendChild(this.pageNumDiv);
        this.pageLabel = createElement('span');
        this.pageLabel.textContent = this.localObj.getConstant('Page') + ' ';
        this.pageNumDiv.appendChild(this.pageLabel);
        this.pageNumberInput = createElement('input', { styles: 'text-transform:capitalize;white-space:pre;overflow:hidden;user-select:none;cursor:text', attrs: { type: 'text', 'aria-label' : this.localObj.getConstant('Current Page Number') }, className: 'e-de-pagenumber-input' }) as HTMLInputElement;
        this.editablePageNumber = createElement('div', { styles: 'display: inline-flex', className: 'e-input e-de-pagenumber-text' });
        this.editablePageNumber.appendChild(this.pageNumberInput);
        let pageNumberOfLabelStyle: string = '';
        if (isRtl) {
            this.pageLabel.style.marginLeft = '6px';
            this.editablePageNumber.style.marginLeft = '6px';
            pageNumberOfLabelStyle = 'padding-left:5px';
        } else {
            this.pageLabel.style.marginRight = '6px';
            this.editablePageNumber.style.marginRight = '6px';
            pageNumberOfLabelStyle = 'padding-right:5px';
        }
        this.updatePageNumber();
        this.pageNumDiv.appendChild(this.editablePageNumber);
        this.editablePageNumber.setAttribute('title', this.localObj.getConstant('Current Page Number'));
        this.ofLabel = createElement('span', { styles: pageNumberOfLabelStyle });
        this.ofLabel.textContent = ' ' + this.localObj.getConstant('of') + ' ';
        this.pageNumDiv.appendChild(this.ofLabel);
        this.pageCount = createElement('span');
        this.pageNumDiv.appendChild(this.pageCount);
        this.updatePageCount();
        const paddingStyle: string = isRtl ? 'padding-right:10px;' : 'padding-left:10px;';
        this.loadingDiv = createElement('div', {
            styles: `display: none; ${paddingStyle}`
        });
        this.loadingDiv.innerHTML = 'Loading<span id="dots"></span>';
        const style: HTMLStyleElement = document.createElement('style');
        style.textContent = `
#dots::after {
    content: '';
    animation: dots 1.5s steps(4, end) infinite;
  }

  @keyframes dots {
    0%   { content: ''; }
    25%  { content: '.'; }
    50%  { content: '..'; }
    75%  { content: '...'; }
    100% { content: ''; }
  }
`;
        document.head.appendChild(style);
        this.pageNumDiv.appendChild(this.loadingDiv);
        if (this.documentEditor.enableSpellCheck) {
            this.verticalLine = createElement('div', { className: 'e-de-statusbar-separator' });
            this.statusBarDiv.appendChild(this.verticalLine);
            this.spellCheckBtn = this.addSpellCheckElement();
            this.spellCheckButton.appendTo(this.spellCheckBtn);
        }
        this.pageButton = this.createButtonTemplate((this.container.enableSpellCheck) ? 'e-de-statusbar-pageweb e-btn-pageweb-spellcheck' : 'e-de-statusbar-pageweb', 'e-de-printlayout e-icons', 'Print layout', this.statusBarDiv, this.pageButton, (this.documentEditor.layoutType === 'Pages') ? true : false);
        this.webButton = this.createButtonTemplate('e-de-statusbar-pageweb', 'e-de-weblayout e-icons', 'Web layout', this.statusBarDiv, this.webButton, (this.documentEditor.layoutType === 'Continuous') ? true : false);
        this.pageButton.addEventListener('click', this.onPageLayoutClickHandler);
        this.webButton.addEventListener('click', this.onWebLayoutClickHandler);
        this.zoomBtn = createElement('button', {
            className: 'e-de-statusbar-zoom', attrs: { type: 'button' }
        }) as HTMLButtonElement;
        this.statusBarDiv.appendChild(this.zoomBtn);
        this.zoomBtn.setAttribute('title', this.localObj.getConstant('ZoomLevelTooltip'));
        const items: ItemModel[] = [
            {
                text: '200%'
            },
            {
                text: '175%'
            },
            {
                text: '150%'
            },
            {
                text: '125%'
            },
            {
                text: '100%'
            },
            {
                text: '75%'
            },
            {
                text: '50%'
            },
            {
                text: '25%'
            },
            {
                separator: true
            },
            {
                text: this.localObj.getConstant('Fit one page')
            },
            {
                text: this.localObj.getConstant('Fit page width')
            }
        ];
        this.zoom = new DropDownButton({ content: '100%', items: items, enableRtl: this.container.enableRtl, select: this.onZoom.bind(this) });
        this.zoom.isStringTemplate = true;
        //Selecting the current text in the dropdown
        this.zoom.beforeOpen = () => {
            // Used settimeout because drop down will not be rendered.
            setTimeout(() => this.highlightSelectedItem(this.zoom.content), 0);
        };
        this.zoom.appendTo(this.zoomBtn);
    }
    private addSpellCheckElement(): HTMLButtonElement {
        const spellCheckBtn: HTMLButtonElement = createElement('button', {
            className: 'e-de-statusbar-spellcheck'
        }) as HTMLButtonElement;
        this.statusBarDiv.appendChild(spellCheckBtn);
        spellCheckBtn.setAttribute('title', 'Spell Checker options');
        const spellCheckItems: ItemModel[] = [
            {
                text: this.localObj.getConstant('Spell Check')
            },
            {
                text: this.localObj.getConstant('Underline errors')
            }
        ];
        this.spellCheckButton = new DropDownButton({
            content: this.localObj.getConstant('Spelling'), items: spellCheckItems, enableRtl: this.container.enableRtl, select: this.onSpellCheck.bind(this),
            beforeItemRender: (args: MenuEventArgs) => {
                args.element.innerHTML = '<span></span>' + args.item.text;
                if (isNullOrUndefined(this.currentLanguage)) {
                    this.currentLanguage = this.documentEditor.spellCheckerModule.languageID;
                }
                if (isNullOrUndefined(this.allowSuggestion)) {
                    this.allowSuggestion = this.documentEditor.spellCheckerModule.allowSpellCheckAndSuggestion;
                }
                const span: HTMLElement = args.element.children[0] as HTMLElement;
                if (args.item.text === this.localObj.getConstant('Spell Check') && this.documentEditor.enableSpellCheck &&
                    this.documentEditor.spellCheckerModule.enableSpellCheck) {
                    span.style.marginRight = '10px';
                    span.setAttribute('class', 'e-de-selected-spellcheck-item');
                } else if (args.item.text === this.localObj.getConstant('Underline errors') && this.documentEditor.enableSpellCheck &&
                    this.documentEditor.spellCheckerModule.enableSpellCheck && !this.documentEditor.spellCheckerModule.removeUnderline) {
                    span.style.marginRight = '10px';
                    span.setAttribute('class', 'e-de-selected-underline-item');
                } else {
                    span.style.marginRight = '25px';
                    (args.element.children[0] as HTMLElement).classList.remove('e-de-selected-spellcheck-item');
                    (args.element.children[0] as HTMLElement).classList.remove('e-de-selected-underline-item');
                }
            }
        });

        return spellCheckBtn;
    }
    private onZoom(args: MenuEventArgs): void {
        this.setZoomValue(args.item.text);
        this.updateZoomContent();
    }
    private onSpellCheck(args: MenuEventArgs): void {
        this.setSpellCheckValue(args.item.text);
    }
    public updateZoomContent(): void {
        this.zoom.content = Math.round(this.documentEditor.zoomFactor * 100) + '%';
    }
    private highlightSelectedItem(text: string): void {
        const listItems: NodeListOf<Element> = document.querySelectorAll('.e-dropdown-popup .e-item');
        listItems.forEach((item: Element) => {
            const isMatch: boolean = !isNullOrUndefined(item.textContent) ? item.textContent.trim() === text : false;
            item.classList.toggle('e-active', isMatch);
        });
    }
    private setSpellCheckValue(text: string): void {
        this.spellCheckButton.content = this.localObj.getConstant('Spelling');
        if (text.match(this.localObj.getConstant('Spell Check'))) {
            this.documentEditor.documentHelper.triggerElementsOnLoading = true;
            this.documentEditor.spellCheckerModule.enableSpellCheck =
            (this.documentEditor.spellCheckerModule.enableSpellCheck) ? false : true;
            this.documentEditor.documentHelper.triggerSpellCheck = false;
            this.documentEditor.documentHelper.triggerElementsOnLoading = false;
        } else if (text.match(this.localObj.getConstant('Underline errors'))) {
            if (this.documentEditor.enableSpellCheck && this.documentEditor.spellCheckerModule.enableSpellCheck) {
                this.documentEditor.spellCheckerModule.removeUnderline =
                (this.documentEditor.spellCheckerModule.removeUnderline) ? false : true;
            }
        }
    }
    private setZoomValue(text: string): void {
        this.documentEditor.isUpdateFocus = true;
        if (text.match(this.localObj.getConstant('Fit one page'))) {
            this.documentEditor.fitPage('FitOnePage');
        } else if (text.match(this.localObj.getConstant('Fit page width'))) {
            this.documentEditor.fitPage('FitPageWidth');
        } else {
            this.documentEditor.zoomFactor = parseInt(text, 10) / 100;
        }
    }
    /**
     * Updates page count.
     *
     * @returns {void}
     */
    public updatePageCount(): void {
        this.pageCount.textContent = this.editorPageCount.toString();
    }
    /**
     * Updates page number.
     *
     * @returns {void}
     */
    public updatePageNumber(): void {
        this.pageNumberInput.value = this.startPage.toString();
        this.updatePageNumberWidth();
    }
    public updatePageNumberOnViewChange(args: ViewChangeEventArgs): void {
        if (this.documentEditor.selectionModule
            && this.documentEditor.selectionModule.endPage >= args.startPage
            && this.documentEditor.selectionModule.endPage <= args.endPage) {
            this.startPage = this.documentEditor.selectionModule.endPage;
        } else {
            this.startPage = args.startPage;
        }
        this.updatePageNumber();
        this.updatePageCount();
    }
    private wireEvents(): void {
        this.pageNumberInput.addEventListener('keydown', this.onPageNumberKeyDownHandler);
        this.pageNumberInput.addEventListener('keyup', this.onPageNumberKeyUpHandler);
        this.pageNumberInput.addEventListener('blur', this.onPageNumberBlurHandler);
        this.pageNumberInput.addEventListener('focus', this.onPageNumberFocusHandler);
    }
    private unWireEvents(): void {
        this.pageButton.removeEventListener('click', this.onPageLayoutClickHandler);
        this.webButton.removeEventListener('click', this.onWebLayoutClickHandler);
        this.pageNumberInput.removeEventListener('keydown', this.onPageNumberKeyDownHandler);
        this.pageNumberInput.removeEventListener('keyup', this.onPageNumberKeyUpHandler);
        this.pageNumberInput.removeEventListener('blur', this.onPageNumberBlurHandler);
        this.pageNumberInput.removeEventListener('focus', this.onPageNumberFocusHandler);
    }
    private updatePageNumberWidth(): void {
        if (this.pageNumberInput) {
            this.pageNumberInput.style.width = this.pageNumberInput.value.length >= 3 ? '30px' : '22px';
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public toggleWebLayout(): void {
        this.addRemoveClass(this.pageButton, this.webButton);
    }
    /**
     * @private
     * @returns {void}
     */
    public togglePageLayout(): void {
        this.addRemoveClass(this.webButton, this.pageButton);
    }

    private addRemoveClass(addToElement: HTMLElement, removeFromElement: HTMLElement): void {
        addToElement.classList.add('e-btn-toggle');
        if (removeFromElement.classList.contains('e-btn-toggle')) {
            removeFromElement.classList.remove('e-btn-toggle');
        }
    }
    /* eslint-disable-next-line max-len */
    private createButtonTemplate(className: string, iconcss: string, toolTipText: string, div: HTMLElement, appendDiv: HTMLButtonElement, toggle: boolean): HTMLButtonElement {
        appendDiv = createElement('Button', { className: className, attrs: { type: 'button' } }) as HTMLButtonElement;
        div.appendChild(appendDiv);
        const btn: Button = new Button({
            cssClass: className, iconCss: iconcss, enableRtl: this.container.enableRtl
        });
        if (toggle === true) {
            appendDiv.classList.add('e-btn-toggle');
        }
        btn.appendTo(appendDiv);
        appendDiv.setAttribute('title', this.localObj.getConstant(toolTipText));
        if (toolTipText === 'Web layout') {
            this.webBtn = btn;
        } else {
            this.pageBtn = btn;
        }
        return appendDiv;
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.unWireEvents();
        this.removeHTMLDom();
        this.dependentComponentsDestroy();
        this.pageButton = undefined;
        this.webButton = undefined;
        this.pageNumberInput = undefined;
        this.statusBarDiv = undefined;
        this.pageCount = undefined;
        this.editablePageNumber = undefined;
        this.localObj = undefined;
        this.container = undefined;
    }
    private dependentComponentsDestroy(): void{
        if (this.zoom) {
            this.zoom.destroy();
            this.zoom = undefined;
        }
        if (this.spellCheckButton) {
            this.spellCheckButton.destroy();
            this.spellCheckButton = undefined;
        }
        if (this.pageBtn) {
            this.pageBtn.destroy();
            this.pageBtn = undefined;
        }
        if (this.webBtn) {
            this.webBtn.destroy();
            this.webBtn = undefined;
        }
    }
    private removeHTMLDom(): void {
        this.pageNumDiv.remove();
        this.statusBarDiv.remove();
        this.pageCount.remove();
        this.pageLabel.remove();
        this.pageNumberInput.remove();
        this.editablePageNumber.remove();
        this.ofLabel.remove();
        this.zoomBtn.remove();
        this.pageButton.remove();
        this.webButton.remove();
        if (!isNullOrUndefined(this.verticalLine)) {
            this.verticalLine.remove();
        }
        if (!isNullOrUndefined(this.spellCheckBtn)) {
            this.spellCheckBtn.remove();
        }
    }
}
