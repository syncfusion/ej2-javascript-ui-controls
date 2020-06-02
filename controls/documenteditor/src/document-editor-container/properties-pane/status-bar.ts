import { DocumentEditor, ViewChangeEventArgs } from '../../document-editor/index';
import { createElement, KeyboardEventArgs, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownButton, ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { DocumentEditorContainer } from '../document-editor-container';
import { Button } from '@syncfusion/ej2-buttons';
/**
 * Represents document editor status bar.
 * @private
 */
export class StatusBar {
    private container: DocumentEditorContainer;
    private statusBarDiv: HTMLElement;
    private pageCount: HTMLElement;
    private zoom: DropDownButton;
    private pageNumberInput: HTMLInputElement;
    private editablePageNumber: HTMLElement;
    public startPage: number = 1;
    public localObj: L10n;
    private spellCheckButton: DropDownButton;
    private currentLanguage: number;
    private allowSuggestion: boolean;
    private pageButton: HTMLButtonElement;
    private webButton: HTMLButtonElement;

    get documentEditor(): DocumentEditor {
        return this.container ? this.container.documentEditor : undefined;
    }
    get editorPageCount(): number {
        return this.documentEditor ? this.documentEditor.pageCount : 1;
    }
    constructor(parentElement: HTMLElement, docEditor: DocumentEditorContainer) {
        this.statusBarDiv = parentElement;
        this.container = docEditor;
        this.initializeStatusBar();
        this.wireEvents();
    }
    private initializeStatusBar = (): void => {
        let isRtl: boolean = this.container.enableRtl;
        this.documentEditor.enableSpellCheck = (this.container.enableSpellCheck) ? true : false;
        // tslint:disable-next-line:max-line-length
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        // tslint:disable-next-line:max-line-length
        let styles: string = isRtl ? 'padding-right:16px' : 'padding-left:16px';
        // tslint:disable-next-line:max-line-length
        let div: HTMLElement = createElement('div', { className: (this.container.enableSpellCheck) ? 'e-de-ctnr-pg-no' : 'e-de-ctnr-pg-no-spellout', styles: styles });
        this.statusBarDiv.appendChild(div);
        let label: HTMLElement = createElement('label');
        label.textContent = this.localObj.getConstant('Page') + ' ';
        div.appendChild(label);
        // tslint:disable-next-line:max-line-length
        this.pageNumberInput = createElement('input', { styles: 'text-transform:capitalize;white-space:pre;overflow:hidden;user-select:none;cursor:text', attrs: { type: 'text' }, className: 'e-de-pagenumber-input' }) as HTMLInputElement;
        this.editablePageNumber = createElement('div', { styles: 'display: inline-flex', className: 'e-input e-de-pagenumber-text' });
        this.editablePageNumber.appendChild(this.pageNumberInput);
        if (isRtl) {
            label.style.marginLeft = '6px';
            this.editablePageNumber.style.marginLeft = '6px';
        } else {
            label.style.marginRight = '6px';
            this.editablePageNumber.style.marginRight = '6px';
        }
        this.updatePageNumber();
        div.appendChild(this.editablePageNumber);
        // tslint:disable-next-line:max-line-length
        this.editablePageNumber.setAttribute('title', this.localObj.getConstant('Current Page Number'));
        let label1: HTMLElement = createElement('label', { styles: 'width:16px' });
        label1.textContent = ' ' + this.localObj.getConstant('of') + ' ';
        div.appendChild(label1);
        this.pageCount = createElement('label');
        div.appendChild(this.pageCount);
        this.updatePageCount();
        if (this.documentEditor.enableSpellCheck) {
            let verticalLine: HTMLElement = createElement('div', { className: 'e-de-statusbar-separator' });
            this.statusBarDiv.appendChild(verticalLine);
            let spellCheckBtn: HTMLButtonElement = this.addSpellCheckElement();
            this.spellCheckButton.appendTo(spellCheckBtn);
        }
        // tslint:disable-next-line:max-line-length   
        this.pageButton = this.createButtonTemplate((this.container.enableSpellCheck) ? 'e-de-statusbar-pageweb e-btn-pageweb-spellcheck' : 'e-de-statusbar-pageweb', 'e-de-printlayout e-icons', this.localObj.getConstant('Print layout'), this.statusBarDiv, this.pageButton, (this.documentEditor.layoutType === 'Pages') ? true : false);
        // tslint:disable-next-line:max-line-length   
        this.webButton = this.createButtonTemplate('e-de-statusbar-pageweb', 'e-de-weblayout e-icons', this.localObj.getConstant('Web layout'), this.statusBarDiv, this.webButton, (this.documentEditor.layoutType === 'Continuous') ? true : false);
        this.pageButton.addEventListener('click', (): void => {
            this.documentEditor.layoutType = 'Pages';
            this.addRemoveClass(this.pageButton, this.webButton);
        });
        this.webButton.addEventListener('click', (): void => {
            this.documentEditor.layoutType = 'Continuous';
            this.addRemoveClass(this.webButton, this.pageButton);
        });
        let zoomBtn: HTMLButtonElement = createElement('button', {
            // tslint:disable-next-line:max-line-length
            className: 'e-de-statusbar-zoom', attrs: { type: 'button' }
        }) as HTMLButtonElement;
        this.statusBarDiv.appendChild(zoomBtn);
        zoomBtn.setAttribute('title', 'Zoom level. Click or tap to open the Zoom options.');
        let items: ItemModel[] = [
            {
                text: '200%',
            },
            {
                text: '175%',
            },
            {
                text: '150%',
            },
            {
                text: '125%',
            },
            {
                text: '100%',
            },
            {
                text: '75%',
            },
            {
                text: '50%',
            },
            {
                text: '25%',
            },
            {
                separator: true
            },
            {
                text: this.localObj.getConstant('Fit one page')
            },
            {
                text: this.localObj.getConstant('Fit page width'),
            },
        ];
        // tslint:disable-next-line:max-line-length
        this.zoom = new DropDownButton({ content: '100%', items: items, enableRtl: this.container.enableRtl, select: this.onZoom });
        this.zoom.isStringTemplate = true;
        this.zoom.appendTo(zoomBtn);
    }
    private addSpellCheckElement(): HTMLButtonElement {
        let spellCheckBtn: HTMLButtonElement = createElement('button', {
            className: 'e-de-statusbar-spellcheck'
        }) as HTMLButtonElement;
        this.statusBarDiv.appendChild(spellCheckBtn);
        spellCheckBtn.setAttribute('title', 'Spell Checker options');
        let spellCheckItems: ItemModel[] = [
            {
                text: 'Spell Check',
            },
            {
                text: 'Underline errors',
            },
        ];
        // tslint:disable-next-line:max-line-length
        this.spellCheckButton = new DropDownButton({
            content: 'Spelling', items: spellCheckItems, enableRtl: this.container.enableRtl, select: this.onSpellCheck,
            beforeItemRender: (args: MenuEventArgs) => {
                args.element.innerHTML = '<span></span>' + args.item.text;
                if (isNullOrUndefined(this.currentLanguage)) {
                    this.currentLanguage = this.documentEditor.spellChecker.languageID;
                }
                if (isNullOrUndefined(this.allowSuggestion)) {
                    this.allowSuggestion = this.documentEditor.spellChecker.allowSpellCheckAndSuggestion;
                }
                let span: HTMLElement = args.element.children[0] as HTMLElement;
                if (args.item.text === 'Spell Check' && this.documentEditor.enableSpellCheck &&
                    this.documentEditor.spellChecker.enableSpellCheck) {
                    span.style.marginRight = '10px';
                    span.setAttribute('class', 'e-de-selected-spellcheck-item');
                    // tslint:disable-next-line:max-line-length
                } else if (args.item.text === 'Underline errors' && this.documentEditor.enableSpellCheck &&
                    this.documentEditor.spellChecker.enableSpellCheck && !this.documentEditor.spellChecker.removeUnderline) {
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
    private onZoom = (args: MenuEventArgs) => {
        this.setZoomValue(args.item.text);
        this.updateZoomContent();
    }
    private onSpellCheck = (args: MenuEventArgs) => {
        this.setSpellCheckValue(args.item.text, args.element);
    }
    public updateZoomContent = (): void => {
        this.zoom.content = Math.round(this.documentEditor.zoomFactor * 100) + '%';
    }
    private setSpellCheckValue = (text: string, element: HTMLElement): void => {
        this.spellCheckButton.content = 'Spelling';
        if (text.match(this.localObj.getConstant('Spell Check'))) {
            this.documentEditor.spellChecker.enableSpellCheck = (this.documentEditor.spellChecker.enableSpellCheck) ? false : true;
            setTimeout(() => {
                if (this.documentEditor.enableSpellCheck && this.documentEditor.spellChecker.enableSpellCheck) {
                    this.documentEditor.documentHelper.triggerElementsOnLoading = true;
                    this.documentEditor.documentHelper.triggerSpellCheck = true;
                }
                this.documentEditor.editor.reLayout(this.documentEditor.documentHelper.selection);
                /* tslint:disable */
            }, 50);
            /* tslint:enable */
            this.documentEditor.documentHelper.triggerSpellCheck = false;
            this.documentEditor.documentHelper.triggerElementsOnLoading = false;
            // tslint:disable-next-line:max-line-length
        } else if (text.match(this.localObj.getConstant('Underline errors'))) {
            if (this.documentEditor.enableSpellCheck && this.documentEditor.spellChecker.enableSpellCheck) {
                // tslint:disable-next-line:max-line-length
                this.documentEditor.spellChecker.removeUnderline = (this.documentEditor.spellChecker.removeUnderline) ? false : true;
                this.documentEditor.editor.reLayout(this.documentEditor.documentHelper.selection);
            }
        }
    }
    private setZoomValue = (text: string): void => {
        if (text.match(this.localObj.getConstant('Fit one page'))) {
            this.documentEditor.fitPage('FitOnePage');
        } else if (text.match(this.localObj.getConstant('Fit page width'))) {
            this.documentEditor.fitPage('FitPageWidth');
        } else {
            this.documentEditor.zoomFactor = parseInt(text, 0) / 100;
        }
    }
    /**
     * Updates page count.
     */
    public updatePageCount = (): void => {
        this.pageCount.textContent = this.editorPageCount.toString();
    }
    /**
     * Updates page number.
     */
    public updatePageNumber = (): void => {
        this.pageNumberInput.value = this.startPage.toString();
        this.updatePageNumberWidth();
    }
    public updatePageNumberOnViewChange = (args: ViewChangeEventArgs): void => {
        if (this.documentEditor.selection
            && this.documentEditor.selection.startPage >= args.startPage && this.documentEditor.selection.startPage <= args.endPage) {
            this.startPage = this.documentEditor.selection.startPage;
        } else {
            this.startPage = args.startPage;
        }
        this.updatePageNumber();
        this.updatePageCount();
    }
    private wireEvents = (): void => {
        this.pageNumberInput.addEventListener('keydown', (e: KeyboardEventArgs) => {
            if (e.which === 13) {
                e.preventDefault();
                let pageNumber: number = parseInt(this.pageNumberInput.value, 0);
                if (pageNumber > this.editorPageCount) {
                    this.updatePageNumber();
                } else {
                    if (this.documentEditor.selection) {
                        this.documentEditor.selection.goToPage(parseInt(this.pageNumberInput.value, 0));
                    } else {
                        this.documentEditor.scrollToPage(parseInt(this.pageNumberInput.value, 0));
                    }
                }
                this.pageNumberInput.contentEditable = 'false';
                if (this.pageNumberInput.value === '') {
                    this.updatePageNumber();
                }
            }
            if (e.which > 64) {
                e.preventDefault();
            }
        });
        this.pageNumberInput.addEventListener('keyup', () => {
            this.updatePageNumberWidth();
        });
        this.pageNumberInput.addEventListener('blur', (): void => {
            if (this.pageNumberInput.value === '' || parseInt(this.pageNumberInput.value, 0) > this.editorPageCount) {
                this.updatePageNumber();
            }
            this.pageNumberInput.contentEditable = 'false';
        });
        this.pageNumberInput.addEventListener('focus', (): void => {
            this.pageNumberInput.select();
        });
    }
    private updatePageNumberWidth(): void {
        if (this.pageNumberInput) {
            this.pageNumberInput.style.width = this.pageNumberInput.value.length >= 3 ? '30px' : '22px';
        }
    }
    /**
     * @private
     */
    public toggleWebLayout(): void {
        this.addRemoveClass(this.pageButton, this.webButton);
    }
    private addRemoveClass = (addToElement: HTMLElement, removeFromElement: HTMLElement): void => {
        addToElement.classList.add('e-btn-toggle');
        if (removeFromElement.classList.contains('e-btn-toggle')) {
            removeFromElement.classList.remove('e-btn-toggle');
        }
    }
    // tslint:disable-next-line:max-line-length
    private createButtonTemplate(className: string, iconcss: string, toolTipText: string, div: HTMLElement, appendDiv: HTMLButtonElement, toggle: boolean): HTMLButtonElement {
        appendDiv = createElement('Button', { className: className, attrs: { type: 'button' } }) as HTMLButtonElement;
        div.appendChild(appendDiv);
        let btn: Button = new Button({
            cssClass: className, iconCss: iconcss, enableRtl: this.container.enableRtl
        });
        if (toggle === true) {
            appendDiv.classList.add('e-btn-toggle');
        }
        btn.appendTo(appendDiv);
        appendDiv.setAttribute('title', toolTipText);
        return appendDiv;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.container = undefined;
        if (this.zoom) {
            this.zoom.destroy();
            this.zoom = undefined;
        }
        if (this.spellCheckButton) {
            this.spellCheckButton.destroy();
            this.spellCheckButton = undefined;
        }
        if (this.pageButton) {
            this.pageButton = undefined;
        }
        if (this.webButton) {
            this.webButton = undefined;
        }
    }
}