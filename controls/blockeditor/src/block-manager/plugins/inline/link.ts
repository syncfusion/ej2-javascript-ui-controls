import { Dialog } from '@syncfusion/ej2-popups';
import { ExecCommandOptions, LinkData } from '../../../common/interface';
import { BlockModel, ContentModel, ILinkContentSettings } from '../../../models/index';
import { NodeSelection } from '../../../selection/selection';
import { denormalizeUrl, getBlockContentElement, getBlockModelById, getClosestContentElementInDocument, getContentModelById, normalizeUrl } from '../../../common/utils/index';
import { findClosestParent } from '../../../common/utils/dom';
import { events } from '../../../common/constant';
import * as constants from '../../../common/constant';
import { BlockManager } from '../../base/block-manager';

/**
 * `LinkModule` module is used to handle hyperlinks in the block editor
 *
 * @hidden
 */
export class LinkModule {
    private parent: BlockManager;
    private selectionManager: NodeSelection;
    private popupElement: HTMLElement;

    constructor(manager: BlockManager) {
        this.parent = manager;
        this.selectionManager = new NodeSelection(this.parent.blockContainer);
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.parent.observer.on('linkPopupCreated', this.handleLinkCreated, this);
        this.parent.observer.on(events.editorClick, this.handleEditorClick, this);
        this.parent.observer.on(events.documentClick, this.handleDocumentClick, this);
        this.parent.observer.on(events.formattingPerformed, this.formattingPerformed, this);
        this.parent.observer.on('linkPopupAfterOpen', this.handleLinkPopupAfterOpen, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.parent.observer.off(events.editorClick, this.handleEditorClick);
        this.parent.observer.off(events.documentClick, this.handleDocumentClick);
        this.parent.observer.off(events.formattingPerformed, this.formattingPerformed);
        this.parent.observer.off('linkPopupAfterOpen', this.handleLinkPopupAfterOpen);
        this.parent.observer.off(events.destroy, this.destroy);
    }

    private handleLinkCreated(): void {
        this.popupElement = document.querySelector('#' + this.parent.rootEditorElement.id + constants.LINKDIALOG_ID);
        if (this.popupElement) {
            this.bindPopupEvents();
        }
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

    /**
     * Shows the link popup dialog at cursor position
     *
     * @param {KeyboardEvent} e - Keyboard event that triggered the popup
     * @returns {void}
     * @hidden
     */
    public showLinkPopup(e: KeyboardEvent): void {
        this.parent.inlineToolbarModule.hideInlineToolbar(e);
        const contentElement: HTMLElement = getBlockContentElement(this.parent.currentFocusedBlock);
        const selectedBlocks: BlockModel[] = this.parent.editorMethods.getSelectedBlocks();
        if (!contentElement || (selectedBlocks && selectedBlocks.length > 1)) { return; }

        this.selectionManager.saveSelection();
        const positionY: string = this.getDialogPosition();
        this.parent.observer.notify('showLinkPopup', { x: 'center', y: positionY });
    }

    private getDialogPosition(): string {
        let distanceFromVisibleTop: number = this.parent.rootEditorElement.getBoundingClientRect().top;
        if (distanceFromVisibleTop < 0) {
            distanceFromVisibleTop = Math.abs(distanceFromVisibleTop) + this.parent.rootEditorElement.scrollTop;
            return distanceFromVisibleTop.toString();
        }
        else {
            return this.parent.rootEditorElement.scrollTop.toString();
        }
    }

    private handleLinkPopupAfterOpen(): void {
        setTimeout(() => {
            this.populateInputFields();
        }, 10);
    }

    private populateInputFields(): void {
        const linkDialog: HTMLElement = this.parent.rootEditorElement.querySelector('#' + this.parent.rootEditorElement.id + constants.LINKDIALOG_ID) as HTMLElement;
        const urlInput: HTMLInputElement = linkDialog.querySelector('#linkUrl') as HTMLInputElement;
        const textInput: HTMLInputElement = linkDialog.querySelector('#linkText') as HTMLInputElement;
        const titleInput: HTMLInputElement = linkDialog.querySelector('#linkTitle') as HTMLInputElement;

        if (this.selectionManager && !this.selectionManager.isCollapsed()) {
            textInput.value = this.selectionManager.getSelectedText();
        }

        const linkInfo: LinkData | null = this.getLinkFromSelection();
        if (linkInfo) {
            textInput.value = linkInfo.text;
            urlInput.value = linkInfo.url;
            titleInput.value = linkInfo.title;
        }
        // Ensure Remove button reflects the (programmatically set) URL value
        this.syncRemoveButtonByUrlField();
    }

    private syncRemoveButtonByUrlField(): void {
        const linkDialog: HTMLElement = this.parent.rootEditorElement.querySelector('#' + this.parent.rootEditorElement.id + constants.LINKDIALOG_ID) as HTMLElement;
        const urlInput: HTMLInputElement = linkDialog.querySelector('#linkUrl') as HTMLInputElement;
        const removeBtn: HTMLButtonElement = this.popupElement.querySelector('.e-remove-link-btn') as HTMLButtonElement;

        const hasText: boolean = urlInput.value.trim().length > 0;
        if (hasText) {
            removeBtn.removeAttribute('disabled');
        } else {
            removeBtn.setAttribute('disabled', '');
        }
    }

    /**
     * Hides the link popup dialog and restores selection
     *
     * @returns {void}
     * @hidden
     */
    public hideLinkPopup(): void {
        if (this.popupElement && this.popupElement.classList.contains('e-popup-close')) { return; }

        this.clearInputValues();
        this.parent.observer.notify('hideLinkPopup');

        const contentElement: HTMLElement = getBlockContentElement(this.parent.currentFocusedBlock);
        if (contentElement) {
            this.selectionManager.restoreSelection();
        }
    }

    private clearInputValues(): void {
        const linkDialog: HTMLElement = this.parent.rootEditorElement.querySelector('#' + this.parent.rootEditorElement.id + constants.LINKDIALOG_ID) as HTMLElement;
        const textInput: HTMLInputElement = linkDialog.querySelector('#linkText') as HTMLInputElement;
        const urlInput: HTMLInputElement = linkDialog.querySelector('#linkUrl') as HTMLInputElement;
        const titleInput: HTMLInputElement = linkDialog.querySelector('#linkTitle') as HTMLInputElement;
        textInput.value = '';
        urlInput.value = '';
        titleInput.value = '';
        this.syncRemoveButtonByUrlField();
    }

    private handleLinkInsertDeletion(e: Event, isRemove?: boolean): void {
        const contentElement: HTMLElement = getBlockContentElement(this.parent.currentFocusedBlock);
        const linkDialog: HTMLElement = this.parent.rootEditorElement.querySelector('#' + this.parent.rootEditorElement.id + constants.LINKDIALOG_ID) as HTMLElement;
        if (!contentElement) { return; }

        this.selectionManager.restoreSelection();
        if (isRemove) {
            this.parent.formattingAction.execCommand({ subCommand: 'Link', value: { shouldRemoveLink: true } });
            return;
        }

        const textInput: HTMLInputElement = linkDialog.querySelector('#linkText') as HTMLInputElement;
        const urlInput: HTMLInputElement = linkDialog.querySelector('#linkUrl') as HTMLInputElement;
        const titleInput: HTMLInputElement = linkDialog.querySelector('#linkTitle') as HTMLInputElement;

        const url: string = normalizeUrl(urlInput.value);
        if (!url) {
            urlInput.focus();
            return;
        }

        this.parent.formattingAction.execCommand({
            subCommand: 'Link',
            value: { text: textInput.value, url, title: titleInput.value }
        });
    }

    private handleLinkClick(link: HTMLAnchorElement): void {
        const url: string = link.getAttribute('href');
        if (url) {
            window.open(url, link.getAttribute('target') || '_self');
        }
    }

    private getLinkFromSelection(): LinkData | null {
        if (!this.selectionManager){ return null; }
        const linkElement: Node = this.selectionManager.getNodeFromSelection('a');

        if (linkElement) {
            const link: HTMLAnchorElement = linkElement as HTMLAnchorElement;
            return {
                text: link.textContent,
                url: link.getAttribute('href'),
                title: link.getAttribute('title')
            };
        }

        return null;
    }

    /**
     * Checks whether the slash command popup is opened or not.
     *
     * @returns {boolean} - Returns true if the slash command popup is opened, otherwise false.
     * @hidden
     */
    public isPopupOpen(): boolean {
        const linkDialogId: string = `${this.parent.rootEditorElement.id + constants.LINKDIALOG_ID}`;
        const linkPopup: HTMLElement = document.querySelector(`#${linkDialogId}.${constants.LINKDIALOG_CLS}`) as HTMLElement;
        return (linkPopup && linkPopup.classList.contains('e-popup-open'));
    }

    /**
     * Destroys the link module and cleans up resources
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListeners();
        this.selectionManager = null;
        this.popupElement = null;
    }
}
