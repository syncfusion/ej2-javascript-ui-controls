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
        const div: HTMLElement = createElement('div', { className: (this.container.enableSpellCheck) ? 'e-de-ctnr-pg-no' : 'e-de-ctnr-pg-no-spellout', styles: styles });
        this.statusBarDiv.appendChild(div);
        const label: HTMLElement = createElement('label');
        label.textContent = this.localObj.getConstant('Page') + ' ';
        div.appendChild(label);
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
        this.editablePageNumber.setAttribute('title', this.localObj.getConstant('Current Page Number'));
        const label1: HTMLElement = createElement('label', { styles: 'width:16px' });
        label1.textContent = ' ' + this.localObj.getConstant('of') + ' ';
        div.appendChild(label1);
        this.pageCount = createElement('label');
        div.appendChild(this.pageCount);
        this.updatePageCount();
        if (this.documentEditor.enableSpellCheck) {
            const verticalLine: HTMLElement = createElement('div', { className: 'e-de-statusbar-separator' });
            this.statusBarDiv.appendChild(verticalLine);
            const spellCheckBtn: HTMLButtonElement = this.addSpellCheckElement();
            this.spellCheckButton.appendTo(spellCheckBtn);
        }
        this.pageButton = this.createButtonTemplate((this.container.enableSpellCheck) ? 'e-de-statusbar-pageweb e-btn-pageweb-spellcheck' : 'e-de-statusbar-pageweb', 'e-de-printlayout e-icons', this.localObj.getConstant('Print layout'), this.statusBarDiv, this.pageButton, (this.documentEditor.layoutType === 'Pages') ? true : false);
        this.webButton = this.createButtonTemplate('e-de-statusbar-pageweb', 'e-de-weblayout e-icons', this.localObj.getConstant('Web layout'), this.statusBarDiv, this.webButton, (this.documentEditor.layoutType === 'Continuous') ? true : false);
        this.pageButton.addEventListener('click', (): void => {
            this.documentEditor.layoutType = 'Pages';
            this.addRemoveClass(this.pageButton, this.webButton);
        });
        this.webButton.addEventListener('click', (): void => {
            this.documentEditor.layoutType = 'Continuous';
            this.addRemoveClass(this.webButton, this.pageButton);
        });
        const zoomBtn: HTMLButtonElement = createElement('button', {
            className: 'e-de-statusbar-zoom', attrs: { type: 'button' }
        }) as HTMLButtonElement;
        this.statusBarDiv.appendChild(zoomBtn);
        zoomBtn.setAttribute('title', 'Zoom level. Click or tap to open the Zoom options.');
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
        this.zoom.appendTo(zoomBtn);
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
                    this.currentLanguage = this.documentEditor.spellChecker.languageID;
                }
                if (isNullOrUndefined(this.allowSuggestion)) {
                    this.allowSuggestion = this.documentEditor.spellChecker.allowSpellCheckAndSuggestion;
                }
                const span: HTMLElement = args.element.children[0] as HTMLElement;
                if (args.item.text === this.localObj.getConstant('Spell Check') && this.documentEditor.enableSpellCheck &&
                    this.documentEditor.spellChecker.enableSpellCheck) {
                    span.style.marginRight = '10px';
                    span.setAttribute('class', 'e-de-selected-spellcheck-item');
                } else if (args.item.text === this.localObj.getConstant('Underline errors') && this.documentEditor.enableSpellCheck &&
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
    private setSpellCheckValue(text: string): void {
        this.spellCheckButton.content = this.localObj.getConstant('Spelling');
        if (text.match(this.localObj.getConstant('Spell Check'))) {
            this.documentEditor.spellChecker.enableSpellCheck = (this.documentEditor.spellChecker.enableSpellCheck) ? false : true;
            setTimeout(() => {
                if (this.documentEditor.enableSpellCheck && this.documentEditor.spellChecker.enableSpellCheck) {
                    this.documentEditor.documentHelper.triggerElementsOnLoading = true;
                    this.documentEditor.documentHelper.triggerSpellCheck = true;
                }
            }, 50);
            this.documentEditor.documentHelper.triggerSpellCheck = false;
            this.documentEditor.documentHelper.triggerElementsOnLoading = false;
        } else if (text.match(this.localObj.getConstant('Underline errors'))) {
            if (this.documentEditor.enableSpellCheck && this.documentEditor.spellChecker.enableSpellCheck) {
                this.documentEditor.spellChecker.removeUnderline = (this.documentEditor.spellChecker.removeUnderline) ? false : true;
            }
        }
    }
    private setZoomValue(text: string): void {
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
        if (this.documentEditor.selection
            && this.documentEditor.selection.startPage >= args.startPage && this.documentEditor.selection.startPage <= args.endPage) {
            this.startPage = this.documentEditor.selection.startPage;
        } else {
            this.startPage = args.startPage;
        }
        this.updatePageNumber();
        this.updatePageCount();
    }
    private wireEvents(): void {
        this.pageNumberInput.addEventListener('keydown', (e: KeyboardEventArgs) => {
            if (e.which === 13) {
                e.preventDefault();
                const pageNumber: number = parseInt(this.pageNumberInput.value, 10);
                if (pageNumber > this.editorPageCount) {
                    this.updatePageNumber();
                } else {
                    if (this.documentEditor.selection) {
                        this.documentEditor.selection.goToPage(parseInt(this.pageNumberInput.value, 10));
                    } else {
                        this.documentEditor.scrollToPage(parseInt(this.pageNumberInput.value, 10));
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
            if (this.pageNumberInput.value === '' || parseInt(this.pageNumberInput.value, 10) > this.editorPageCount) {
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
     * @returns {void}
     */
    public toggleWebLayout(): void {
        this.addRemoveClass(this.pageButton, this.webButton);
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
        appendDiv.setAttribute('title', toolTipText);
        return appendDiv;
    }
    /**
     * @private
     * @returns {void}
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
