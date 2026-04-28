import { detach, getComponent } from '@syncfusion/ej2-base';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import { events } from '../../common/constant';
import { BlockEditor } from '../base/blockeditor';
import { IDialogRenderOptions } from '../../common/interface';
import * as constants from '../../common/constant';

/**
 * `LinkModule` module is used to handle hyperlinks in the block editor
 *
 * @hidden
 */
export class LinkModule {
    private editor: BlockEditor;
    private linkDialog: Dialog;
    private popupElement: HTMLElement;

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.initializeModule();
    }

    private initializeModule(): void {
        this.addEventListeners();
        this.createLinkPopup();
    }

    private addEventListeners(): void {
        this.editor.blockManager.observer.on('showLinkPopup', this.showLinkPopup, this);
        this.editor.blockManager.observer.on('hideLinkPopup', this.hideLinkPopup, this);
        this.editor.on(events.localeChanged, this.updateLinkPopupLocale, this);
        this.editor.on(events.rtlChanged, this.applyRtlSettings, this);
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.blockManager.observer.off('showLinkPopup', this.showLinkPopup);
        this.editor.blockManager.observer.off('hideLinkPopup', this.hideLinkPopup);
        this.editor.off(events.localeChanged, this.updateLinkPopupLocale);
        this.editor.off(events.rtlChanged, this.applyRtlSettings);
        this.editor.off(events.destroy, this.destroy);
    }

    private createLinkPopup(): void {
        this.popupElement = this.createPopupElement();
        this.linkDialog = this.initializeDialog();

        this.updateTargetAndActionForPopup();
        this.editor.blockManager.observer.notify('linkPopupCreated');
    }

    private createPopupElement(): HTMLElement {
        const element: HTMLElement = this.editor.createElement('div', {
            id: (this.editor.element.id + constants.LINKDIALOG_ID),
            className: constants.LINKDIALOG_CLS
        });
        this.editor.element.appendChild(element);
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
        </div>`;
        const headerTemplate: string = `<div class="e-be-link-header">${this.editor.l10n.getConstant('insertLink')}</div>`;
        const dialogOptions: IDialogRenderOptions = {
            element: this.popupElement,
            headerTemplate: headerTemplate,
            footerTemplate: footerTemplate,
            contentTemplate: contentTemplate,
            showCloseIcon: true,
            closeOnEscape: true,
            width: '300px',
            height: 'auto',
            visible: false
        };
        return this.editor.dialogRenderer.renderDialog(dialogOptions);
    }

    private updateTargetAndActionForPopup(): void {
        const popup: Popup = getComponent(this.linkDialog.element, 'popup');
        popup.relateTo = this.editor.element;
        popup.actionOnScroll = 'hide';
        popup.dataBind();
    }

    private updateLinkPopupLocale(): void {
        if (!this.linkDialog || !this.popupElement) { return; }
        this.linkDialog.locale = this.editor.locale;
        this.linkDialog.dataBind();

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

    private applyRtlSettings(): void {
        this.linkDialog.enableRtl = this.editor.enableRtl;
    }

    /**
     * Shows the link popup dialog at cursor position
     *
     * @param {{ x: string, y: string }} position - position(x and y) for displaying popup
     * @returns {void}
     * @hidden
     */
    public showLinkPopup(position: { x: string, y: string }): void {
        this.linkDialog.position = { X: position.x, Y: position.y };
        this.linkDialog.dataBind();
        this.linkDialog.show();

        this.editor.blockManager.observer.notify('linkPopupAfterOpen', this.linkDialog);
    }

    /**
     * Hides the link popup dialog and restores selection
     *
     * @returns {void}
     * @hidden
     */
    public hideLinkPopup(): void {
        this.linkDialog.hide();
    }

    /**
     * Destroys the link module and cleans up resources
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.linkDialog) {
            this.linkDialog.destroy();
            detach(this.popupElement);
        }
        this.removeEventListeners();
        this.linkDialog = null;
    }
}
