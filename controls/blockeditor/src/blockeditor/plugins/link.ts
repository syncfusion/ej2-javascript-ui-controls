import { Dialog } from '@syncfusion/ej2-popups';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { BlockEditor, ExecCommandOptions, LinkData } from '../base/index';
import { BlockModel, ContentModel, LinkContentProps } from '../models/index';
import { NodeSelection } from './index';
import { denormalizeUrl, getBlockContentElement, getBlockModelById, getClosestContentElementInDocument, getContentModelById, normalizeUrl } from '../utils/index';
import { createFormattingElement, findClosestParent } from '../utils/dom';
import { events } from '../base/constant';
import { detach } from '@syncfusion/ej2-base';
import * as constants from '../base/constant';

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
        this.editor.on(events.editorClick, this.handleEditorClick, this);
        this.editor.on(events.documentClick, this.handleDocumentClick, this);
        this.editor.on(events.formattingPerformed, this.formattingPerformed, this);
        this.editor.on(events.localeChanged, this.updateLinkPopupLocale, this);
        this.editor.on(events.rtlChanged, this.applyRtlSettings, this);
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.off(events.editorClick, this.handleEditorClick);
        this.editor.off(events.documentClick, this.handleDocumentClick);
        this.editor.off(events.formattingPerformed, this.formattingPerformed);
        this.editor.off(events.localeChanged, this.updateLinkPopupLocale);
        this.editor.off(events.rtlChanged, this.applyRtlSettings);
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
        const props: LinkContentProps = content.props as LinkContentProps;
        props.url = this.editor.enableAutoHttps ? normalizeUrl(props.url) : props.url;
        const linkData: LinkData = {
            url: props.url,
            openInNewWindow: props.openInNewWindow,
            text: content.content
        };
        const formattedElement: HTMLElement = createFormattingElement(content, linkData);
        contentElement.appendChild(formattedElement);
    }

    private createLinkPopup(): void {
        this.popupElement = this.createPopupElement();
        this.linkPopup = this.initializeDialog();

        this.updateTargetAndActionForPopup();
        this.renderCheckBox();
        this.bindPopupEvents();
    }

    private createPopupElement(): HTMLElement {
        const element: HTMLElement = document.createElement('div');
        element.className = 'e-blockeditor-link-dialog';
        document.body.appendChild(element);
        return element;
    }

    private initializeDialog(): Dialog {
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
        return new Dialog({
            header: headerTemplate,
            footerTemplate,
            content: contentTemplate,
            showCloseIcon: true,
            closeOnEscape: true,
            locale: this.editor.locale,
            width: '300px',
            height: 'auto',
            visible: false
        }, this.popupElement);
    }

    private updateTargetAndActionForPopup(): void {
        // es-lint-disable @typescript-eslint/no-explicit-any
        if ((this.linkPopup as any).popupObj) {
            (this.linkPopup as any).popupObj.relateTo = this.editor.element;
            (this.linkPopup as any).popupObj.actionOnScroll = 'hide';
            (this.linkPopup as any).popupObj.dataBind();
        }
        // es-lint-enable @typescript-eslint/no-explicit-any
    }

    private renderCheckBox(): void {
        this.linkCheckBoxObj = new CheckBox({ label: this.editor.l10n.getConstant('linkOpenInNewWindow'), checked: true });
        this.linkCheckBoxObj.appendTo('#openInNewWindow');
    }

    private bindPopupEvents(): void {
        const insertButton: HTMLElement = this.popupElement.querySelector('.e-insert-link-btn');
        const removeButton: HTMLElement = this.popupElement.querySelector('.e-remove-link-btn');
        const cancelButton: HTMLElement = this.popupElement.querySelector('.e-cancel-link-btn');
        insertButton.addEventListener('click', this.handleLinkInsertDeletion.bind(this));
        removeButton.addEventListener('click', this.handleLinkInsertDeletion.bind(this, true));
        cancelButton.addEventListener('click', () => this.hideLinkPopup());
        this.popupElement.addEventListener('keydown', (e: KeyboardEvent) => {
            const target: HTMLElement = e.target as HTMLElement;
            if (e.key === 'Enter') {
                e.preventDefault();
                if (target.classList.contains('e-insert-link-btn')) {
                    this.handleLinkInsertDeletion(e);
                } else if (target.classList.contains('e-remove-link-btn')) {
                    this.handleLinkInsertDeletion(e, true);
                } else if (target.classList.contains('e-cancel-link-btn')) {
                    this.hideLinkPopup();
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.hideLinkPopup();
            }
        });
    }

    private updateLinkPopupLocale(): void {
        if (!this.linkPopup || !this.popupElement) { return; }
        this.linkPopup.locale = this.editor.locale;
        this.linkPopup.dataBind();

        this.updatePopupElementLocale('.e-be-link-header', 'insertLink');
        this.updatePopupElementLocale('.e-insert-link-btn', 'linkInsert');
        this.updatePopupElementLocale('.e-remove-link-btn', 'linkRemove');
        this.updatePopupElementLocale('.e-cancel-link-btn', 'linkCancel');
        this.updatePopupElementLocale('label[for="linkText"]', 'linkText');
        this.updatePopupElementLocale('#linkText', 'linkText', 'linkTextPlaceholder');
        this.updatePopupElementLocale('label[for="linkUrl"]', 'linkUrl');
        this.updatePopupElementLocale('#linkUrl', 'linkUrl', 'linkUrlPlaceholder');
        this.updatePopupElementLocale('label[for="linkTitle"]', 'linkTitle');
        this.updatePopupElementLocale('#linkTitle', 'linkTitle', 'linkTitlePlaceholder');

        if (this.linkCheckBoxObj) {
            this.linkCheckBoxObj.label = this.editor.l10n.getConstant('linkOpenInNewWindow');
            this.linkCheckBoxObj.dataBind();
        }
    }

    private updatePopupElementLocale(selector: string, textKey: string, placeholderKey?: string): void {
        const element: HTMLElement = this.popupElement.querySelector(selector);
        if (element) {
            element.textContent = this.editor.l10n.getConstant(textKey);
            if (placeholderKey && element instanceof HTMLInputElement) {
                element.placeholder = this.editor.l10n.getConstant(placeholderKey);
            }
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

    /**
     * Shows the link popup dialog at cursor position
     *
     * @param {KeyboardEvent} e - Keyboard event that triggered the popup
     * @returns {void}
     * @hidden
     */
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
            if (this.selectionManager.getStoredRange()) {
                this.editor.popupRenderer.adjustPopupPositionRelativeToTarget(this.selectionManager.getStoredRange(), this.linkPopup);
            }
            this.populateInputFields();
        }, 10);
    }

    private populateInputFields(): void {
        const urlInput: HTMLInputElement = document.getElementById('linkUrl') as HTMLInputElement;
        const textInput: HTMLInputElement = document.getElementById('linkText') as HTMLInputElement;
        const titleInput: HTMLInputElement = document.getElementById('linkTitle') as HTMLInputElement;

        if (!this.selectionManager.isCollapsed()) {
            textInput.value = this.selectionManager.getSelectedText();
        }

        const linkInfo: LinkData | null = this.getLinkFromSelection();
        if (linkInfo) {
            textInput.value = linkInfo.text;
            urlInput.value = linkInfo.url;
            titleInput.value = linkInfo.title;
            this.linkCheckBoxObj.checked = linkInfo.openInNewWindow;
        }
    }

    /**
     * Hides the link popup dialog and restores selection
     *
     * @returns {void}
     * @hidden
     */
    public hideLinkPopup(): void {
        const linkPopup: HTMLElement = document.querySelector('.e-blockeditor-link-dialog');
        if (linkPopup && linkPopup.classList.contains('e-popup-close')) { return; }

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
            this.editor.formattingAction.execCommand({ subCommand: 'Link', value: { shouldRemoveLink: true } });
            return;
        }

        const textInput: HTMLInputElement = document.getElementById('linkText') as HTMLInputElement;
        const urlInput: HTMLInputElement = document.getElementById('linkUrl') as HTMLInputElement;
        const titleInput: HTMLInputElement = document.getElementById('linkTitle') as HTMLInputElement;

        const url: string = this.editor.enableAutoHttps ? normalizeUrl(urlInput.value) : urlInput.value;
        if (!url) {
            urlInput.focus();
            return;
        }

        this.editor.formattingAction.execCommand({
            subCommand: 'Link',
            value: { text: textInput.value, url, title: titleInput.value, openInNewWindow: this.linkCheckBoxObj.checked }
        });
    }

    private handleLinkClick(link: HTMLAnchorElement): void {
        const url: string = link.getAttribute('href');
        if (url) {
            window.open(url, link.getAttribute('target') || '_self');
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

    /**
     * Automatically adds/removes https protocol from URLs based on settings
     *
     * @returns {void}
     * @hidden
     */
    public handleAutoHttps(): void {
        const linkElements: NodeListOf<HTMLAnchorElement> = this.editor.element.querySelectorAll('a');
        for (const linkElement of Array.from(linkElements)) {
            const blockElement: HTMLElement = findClosestParent(linkElement, '.' + constants.BLOCK_CLS);
            const contentElement: HTMLElement = getClosestContentElementInDocument(linkElement);
            const blockModel: BlockModel = getBlockModelById(blockElement.id, this.editor.getEditorBlocks());
            const contentModel: ContentModel = getContentModelById(contentElement.id, blockModel.content);

            const url: string = linkElement.getAttribute('href');
            const normalizedUrl: string = normalizeUrl(url);
            const deNormalizedUrl: string = denormalizeUrl(url);
            linkElement.setAttribute('href', this.editor.enableAutoHttps ? normalizedUrl : deNormalizedUrl);

            (contentModel.props as LinkContentProps).url = this.editor.enableAutoHttps ? normalizedUrl : deNormalizedUrl;
        }
    }

    /**
     * Destroys the link module and cleans up resources
     *
     * @returns {void}
     */
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
