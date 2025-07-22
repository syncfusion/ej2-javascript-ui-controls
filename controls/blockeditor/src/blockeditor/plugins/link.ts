import { Dialog } from '@syncfusion/ej2-popups';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { BlockEditor, ExecCommandOptions, LinkData } from '../base/index';
import { BlockModel, ContentModel } from '../models/index';
import { NodeSelection } from './index';
import { denormalizeUrl, getBlockContentElement, getBlockModelById, getClosestContentElementInDocument, getContentModelById, getNormalizedKey, getSelectionRange, normalizeUrl } from '../utils/index';
import { createFormattingElement, findClosestParent } from '../utils/dom';
import { events } from '../base/constant';
import { detach } from '@syncfusion/ej2-base';

/**
 * `LinkModule` module is used to handle hyperlinks in the block editor
 *
 * @hidden
 */
export class LinkModule {
    private editor: BlockEditor;
    private linkPopup: Dialog;
    private linkCheckBoxObj: CheckBox;
    private selectionManager: NodeSelection;
    private popupElement: HTMLElement;

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.selectionManager = new NodeSelection(this.editor);
        this.initializeModule();
    }

    private initializeModule(): void {
        this.addEventListeners();
        this.createLinkPopup();
    }

    private addEventListeners(): void {
        this.editor.on('editorClick', this.handleEditorClick, this);
        this.editor.on('documentClick', this.handleDocumentClick, this);
        this.editor.on('formatting-performed', this.formattingPerformed, this);
        this.editor.on('locale-changed', this.updateLinkPopupLocale, this);
        this.editor.on('rtl-changed', this.applyRtlSettings, this);
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.off('editorClick', this.handleEditorClick);
        this.editor.off('documentClick', this.handleDocumentClick);
        this.editor.off('formatting-performed', this.formattingPerformed);
        this.editor.off('locale-changed', this.updateLinkPopupLocale);
        this.editor.on('rtl-changed', this.applyRtlSettings, this);
        this.editor.off(events.destroy, this.destroy);
    }

    /**
     * Renders an anchor element for the given content model
     *
     * @param {ContentModel} content - The content model containing link information
     * @param {HTMLElement} contentElement - The HTML element to append the anchor to
     * @returns {void}
     */
    renderAnchor(content: ContentModel, contentElement: HTMLElement): void {
        if (this.editor.enableAutoHttps) {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
            (this.editor as any).isProtectedOnChange = true;
            content.linkSettings.url = normalizeUrl(content.linkSettings.url);
            (this.editor as any).isProtectedOnChange = prevOnChange;
            /* eslint-enable @typescript-eslint/no-explicit-any */
        }
        const linkData: LinkData = {
            url: content.linkSettings.url,
            openInNewWindow: content.linkSettings.openInNewWindow,
            text: content.content
        };
        const formattedElement: HTMLElement = createFormattingElement(content, linkData);
        contentElement.appendChild(formattedElement);
    }

    private createLinkPopup(): void {
        this.popupElement = document.createElement('div');
        this.popupElement.className = 'e-blockeditor-link-dialog';
        document.body.appendChild(this.popupElement);
        const footerTemplate: string = `<div class='e-be-link-footer'>
            <button type='button' tabindex='0' class='e-btn e-flat e-primary e-insert-link-btn'>${this.editor.l10n.getConstant('linkInsert')}</button>
            <button type='button' tabindex='0' class='e-btn e-flat e-remove-link-btn'>${this.editor.l10n.getConstant('linkRemove')}</button>
            <button type='button' tabindex='0' class='e-btn e-flat e-cancel-link-btn'>${this.editor.l10n.getConstant('linkCancel')}</button>
        </div>`;
        const contentTemplate: string = `<div class='e-be-link-content'>
            <div class='e-link-form-row'>
                <label for='linkUrl'>${this.editor.l10n.getConstant('linkUrl')}</label>
                <input type='text' spellcheck=false id='linkUrl' class='e-input' placeholder='${this.editor.l10n.getConstant('linkUrlPlaceholder')}' required>
            </div>
            <div class='e-link-form-row'>
                <label for='linkText'>${this.editor.l10n.getConstant('linkText')}</label>
                <input type='text' spellcheck=false id='linkText' class='e-input' placeholder='${this.editor.l10n.getConstant('linkTextPlaceholder')}' required>
            </div>
            <div class='e-link-form-row'>
                <label for='linkTitle'>${this.editor.l10n.getConstant('linkTitle')}</label>
                <input type='text' spellcheck=false id='linkTitle' class='e-input' placeholder='${this.editor.l10n.getConstant('linkTitlePlaceholder')}'>
            </div>
            <div class='e-link-form-row'>
                <input type='checkbox' id='openInNewWindow'>
            </div>
        </div>`;
        const headerTemplate: string = `<div class="e-be-link-header">${this.editor.l10n.getConstant('insertLink')}</div>`;
        this.linkPopup = new Dialog({
            header: headerTemplate,
            footerTemplate: footerTemplate,
            content: contentTemplate,
            showCloseIcon: true,
            closeOnEscape: true,
            locale: this.editor.locale,
            width: '300px',
            height: 'auto',
            visible: false
        }, this.popupElement);
        // es-lint-disable @typescript-eslint/no-explicit-any
        if ((this.linkPopup as any).popupObj) {
            (this.linkPopup as any).popupObj.relateTo = this.editor.element;
            (this.linkPopup as any).popupObj.actionOnScroll = 'hide';
            (this.linkPopup as any).popupObj.dataBind();
        }
        // es-lint-enable @typescript-eslint/no-explicit-any
        this.linkCheckBoxObj = new CheckBox({ label: this.editor.l10n.getConstant('linkOpenInNewWindow'), checked: true });
        this.linkCheckBoxObj.appendTo('#openInNewWindow');
        const insertButton: HTMLElement = this.popupElement.querySelector('.e-insert-link-btn');
        const removeButton: HTMLElement = this.popupElement.querySelector('.e-remove-link-btn');
        const cancelButton: HTMLElement = this.popupElement.querySelector('.e-cancel-link-btn');
        insertButton.addEventListener('click', this.handleLinkInsertDeletion.bind(this));
        removeButton.addEventListener('click', this.handleLinkInsertDeletion.bind(this, true));
        cancelButton.addEventListener('click', () => this.hideLinkPopup());
        this.popupElement.addEventListener('keydown', (e: KeyboardEvent) => {
            const target: HTMLElement = e.target as HTMLElement;
            const isInsert: boolean = target.classList.contains('e-insert-link-btn');
            const isRemove: boolean = target.classList.contains('e-remove-link-btn');
            const isCancel: boolean = target.classList.contains('e-cancel-link-btn');
            if (e.key === 'Enter') {
                e.preventDefault();
                if (isInsert) {
                    this.handleLinkInsertDeletion(e);
                }
                else if (isRemove) {
                    this.handleLinkInsertDeletion(e, true);
                }
                else if (isCancel) {
                    this.hideLinkPopup();
                }
            }
            else if (e.key === 'Escape') {
                e.preventDefault();
                this.hideLinkPopup();
            }
        });
    }

    private updateLinkPopupLocale(): void {
        if (!this.linkPopup || !this.popupElement) { return; }
        // Update locale for the link popup
        this.linkPopup.locale = this.editor.locale;
        this.linkPopup.dataBind();
        const header: HTMLElement = this.popupElement.querySelector('.e-be-link-header');
        if (header) {
            header.textContent = this.editor.l10n.getConstant('insertLink');
        }

        (this.popupElement.querySelector('.e-insert-link-btn') as HTMLElement).textContent = this.editor.l10n.getConstant('linkInsert');
        (this.popupElement.querySelector('.e-remove-link-btn') as HTMLElement).textContent = this.editor.l10n.getConstant('linkRemove');
        (this.popupElement.querySelector('.e-cancel-link-btn') as HTMLElement).textContent = this.editor.l10n.getConstant('linkCancel');

        (this.popupElement.querySelector('label[for=\'linkText\']') as HTMLElement).textContent = this.editor.l10n.getConstant('linkText');
        (this.popupElement.querySelector('#linkText') as HTMLInputElement).placeholder = this.editor.l10n.getConstant('linkTextPlaceholder');

        (this.popupElement.querySelector('label[for=\'linkUrl\']') as HTMLElement).textContent = this.editor.l10n.getConstant('linkUrl');
        (this.popupElement.querySelector('#linkUrl') as HTMLInputElement).placeholder = this.editor.l10n.getConstant('linkUrlPlaceholder');

        (this.popupElement.querySelector('label[for=\'linkTitle\']') as HTMLElement).textContent = this.editor.l10n.getConstant('linkTitle');
        (this.popupElement.querySelector('#linkTitle') as HTMLInputElement).placeholder = this.editor.l10n.getConstant('linkTitlePlaceholder');

        if (this.linkCheckBoxObj) {
            this.linkCheckBoxObj.label = this.editor.l10n.getConstant('linkOpenInNewWindow');
            this.linkCheckBoxObj.dataBind();
        }
    }

    private formattingPerformed(e: ExecCommandOptions): void {
        if (e.subCommand === 'Link') {
            this.hideLinkPopup();
        }
    }

    private handleDocumentClick(e: MouseEvent): void {
        const target: HTMLElement = e.target as HTMLElement;
        if (!this.popupElement) { return; }
        if (this.popupElement.classList.contains('e-popup-open')
            && (!this.popupElement.contains(target))) {
            this.hideLinkPopup();
        }
    }

    private handleEditorClick(e: MouseEvent): void {
        const target: HTMLElement = e.target as HTMLElement;
        if (target.tagName === 'A' || target.closest('a')) {
            e.preventDefault();
            const linkElement: HTMLAnchorElement = target.tagName === 'A'
                ? target as HTMLAnchorElement
                : target.closest('a') as HTMLAnchorElement;
            this.handleLinkClick(linkElement);
        }
    }

    private applyRtlSettings(): void {
        if (this.linkPopup) {
            this.linkPopup.enableRtl = this.editor.enableRtl;
        }
        if (this.linkCheckBoxObj) {
            this.linkCheckBoxObj.enableRtl = this.editor.enableRtl;
        }
    }

    public showLinkPopup(e: KeyboardEvent): void {
        this.editor.inlineToolbarModule.hideInlineToolbar(e);
        const contentElement: HTMLElement = getBlockContentElement(this.editor.currentFocusedBlock);
        if (!contentElement) { return; }
        this.selectionManager.saveSelection(contentElement);

        const position: { x: number, y: number } = this.selectionManager.getSelectionPosition();
        this.linkPopup.position = { X: position.x, Y: position.y };
        this.linkPopup.dataBind();
        this.linkPopup.show();

        setTimeout(() => {
            //Collision calculation for popup
            const range: Range = this.selectionManager.getStoredRange();
            if (range) {
                this.editor.popupRenderer.adjustPopupPositionRelativeToTarget(range, this.linkPopup);
            }
            const urlInput: HTMLInputElement = document.getElementById('linkUrl') as HTMLInputElement;
            const textInput: HTMLInputElement = document.getElementById('linkText') as HTMLInputElement;
            const titleInput: HTMLInputElement = document.getElementById('linkTitle') as HTMLInputElement;

            if (!this.selectionManager.isCollapsed()) {
                textInput.value = this.selectionManager.getSelectedText();
            }

            const linkInfo: LinkData = this.getLinkFromSelection();
            if (linkInfo) {
                textInput.value = linkInfo.text;
                urlInput.value = linkInfo.url;
                titleInput.value = linkInfo.title;
                this.linkCheckBoxObj.checked = linkInfo.openInNewWindow;
            }
        }, 10);
    }

    public hideLinkPopup(): void {
        const linkPopup: HTMLElement = document.querySelector('.e-blockeditor-link-dialog');
        if (linkPopup.classList.contains('e-popup-close')) { return; }
        this.clearInputValues();
        this.linkPopup.hide();

        const contentElement: HTMLElement = getBlockContentElement(this.editor.currentFocusedBlock);
        if (contentElement) {
            this.selectionManager.restoreSelection(contentElement);
        }
    }

    private clearInputValues(): void {
        const textInput: HTMLInputElement = document.getElementById('linkText') as HTMLInputElement;
        const urlInput: HTMLInputElement = document.getElementById('linkUrl') as HTMLInputElement;
        const titleInput: HTMLInputElement = document.getElementById('linkTitle') as HTMLInputElement;
        textInput.value = '';
        urlInput.value = '';
        titleInput.value = '';
        this.linkCheckBoxObj.checked = true;
    }

    private handleLinkInsertDeletion(e: Event, isRemove?: boolean): void {
        const contentElement: HTMLElement = getBlockContentElement(this.editor.currentFocusedBlock);
        if (!contentElement) { return; }
        this.selectionManager.restoreSelection(contentElement);
        if (isRemove) {
            this.editor.formattingAction.execCommand(
                {
                    subCommand: 'Link',
                    value: { shouldRemoveLink: true }
                }
            );
            return;
        }
        const textInput: HTMLInputElement = document.getElementById('linkText') as HTMLInputElement;
        const urlInput: HTMLInputElement = document.getElementById('linkUrl') as HTMLInputElement;
        const titleInput: HTMLInputElement = document.getElementById('linkTitle') as HTMLInputElement;

        const text: string = textInput.value;
        let url: string = urlInput.value;
        const title: string = titleInput.value;
        const openInNewWindow: boolean = this.linkCheckBoxObj.checked;
        if (!url) {
            urlInput.focus();
            return;
        }

        if (this.editor.enableAutoHttps) {
            url = normalizeUrl(url);
        }

        const linkData: LinkData = { text, url, title, openInNewWindow };
        this.editor.formattingAction.execCommand(
            {
                subCommand: 'Link',
                value: linkData
            }
        );
    }

    private handleLinkClick(link: HTMLAnchorElement): void {
        const url: string = link.getAttribute('href');
        const target: string = link.getAttribute('target') || '_self';

        if (url) {
            window.open(url, target);
        }
    }

    private getLinkFromSelection(): LinkData | null {
        const linkElement: Node = this.selectionManager.getNodeFromSelection('a');

        if (linkElement) {
            const link: HTMLAnchorElement = linkElement as HTMLAnchorElement;
            return {
                text: link.textContent,
                url: link.getAttribute('href'),
                title: link.getAttribute('title'),
                openInNewWindow: link.getAttribute('target') === '_blank'
            };
        }

        return null;
    }

    public handleAutoHttps(): void {
        const linkElements: NodeListOf<HTMLAnchorElement> = this.editor.element.querySelectorAll('a');
        for (let i: number = 0; i < linkElements.length; i++) {
            const linkElement: HTMLAnchorElement = linkElements[parseInt(i.toString(), 10)];
            const blockElement: HTMLElement = findClosestParent(linkElement, '.e-block');
            const contentElement: HTMLElement = getClosestContentElementInDocument(linkElement);
            const blockModel: BlockModel = getBlockModelById(blockElement.id, this.editor.blocksInternal);
            const contentModel: ContentModel = getContentModelById(contentElement.id, blockModel.content);

            const url: string = linkElement.getAttribute('href');
            const normalizedUrl: string = normalizeUrl(url);
            const deNormalizedUrl: string = denormalizeUrl(url);
            linkElement.setAttribute('href', this.editor.enableAutoHttps ? normalizedUrl : deNormalizedUrl);

            contentModel.linkSettings.url = this.editor.enableAutoHttps ? normalizedUrl : deNormalizedUrl;
        }
    }

    public destroy(): void {
        if (this.linkPopup) {
            this.linkPopup.destroy();
            detach(this.popupElement);
        }
        if (this.linkCheckBoxObj) {
            this.linkCheckBoxObj.destroy();
        }
        this.selectionManager = null;
        this.linkPopup = null;
        this.linkCheckBoxObj = null;
        this.removeEventListeners();
    }
}
