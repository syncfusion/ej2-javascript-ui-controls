import { LayoutViewer, DocumentHelper } from '../viewer';
import { L10n, createElement } from '@syncfusion/ej2-base';
import { RestrictEditing } from './restrict-editing-pane';
import { DialogUtility } from '@syncfusion/ej2-popups';
/**
 * @private 
 */
export class EnforceProtectionDialog {
    private documentHelper: DocumentHelper;
    private target: HTMLElement;
    private passwordTextBox: HTMLInputElement;
    private confirmPasswordTextBox: HTMLInputElement;
    private localeValue: L10n;
    private owner: RestrictEditing;
    /**
     * @private
     */
    public password: string;
    constructor(documentHelper: DocumentHelper, owner: RestrictEditing) {
        this.documentHelper = documentHelper;
        this.owner = owner;
    }
    get viewer(): LayoutViewer {
        return this.owner.viewer;
    }
    /**
     * @private
     */
    public initDialog(localValue: L10n, isRtl?: boolean): void {
        let instance: EnforceProtectionDialog = this;
        let id: string = this.viewer.owner.containerId + '_enforce_protection';
        this.target = createElement('div', { id: id, className: 'e-de-enforce' });

        let container: HTMLElement = createElement('div');
        // tslint:disable-next-line:max-line-length
        let newPassWord: HTMLElement = createElement('div', { className: 'e-de-enforce-dlg-title', innerHTML: localValue.getConstant('Enter new password') });
        // tslint:disable-next-line:max-line-length
        this.passwordTextBox = createElement('input', { attrs: { type: 'password', autofocus: 'true' }, id: this.viewer.owner.containerId + '_display_text', className: 'e-input e-de-enforce-dlg-input' }) as HTMLInputElement;
        // this.passwordTextBox.addEventListener('keyup', instance.onKeyUpOnDisplayBox);
        container.appendChild(newPassWord);
        container.appendChild(this.passwordTextBox);
        // tslint:disable-next-line:max-line-length
        let confirmPassword: HTMLElement = createElement('div', { className: 'e-de-enforce-dlg-title', innerHTML: localValue.getConstant('Reenter new password to confirm') }) as HTMLDivElement;
        // tslint:disable-next-line:max-line-length
        this.confirmPasswordTextBox = createElement('input', { attrs: { type: 'password' }, id: this.viewer.owner.containerId + '_url_text', className: 'e-input e-de-enforce-dlg-input' }) as HTMLInputElement;
        container.appendChild(confirmPassword);
        container.appendChild(this.confirmPasswordTextBox);
        this.target.appendChild(container);
    }
    /**
     * @private
     */
    public show = (): void => {
        this.localeValue = new L10n('documenteditor', this.viewer.owner.defaultLocale);
        this.localeValue.setLocale(this.viewer.owner.locale);
        if (!this.target) {
            this.initDialog(this.localeValue, this.viewer.owner.enableRtl);
        }
        this.documentHelper.dialog.header = this.localeValue.getConstant('Start Enforcing Protection');
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.buttons = [{
            click: this.okButtonClick,
            buttonModel: { content: this.localeValue.getConstant('Ok'), cssClass: 'e-flat', isPrimary: true }
        },
        {
            click: this.hideDialog,
            buttonModel: { content: this.localeValue.getConstant('Cancel'), cssClass: 'e-flat' }
        }];
        this.passwordTextBox.value = '';
        this.confirmPasswordTextBox.value = '';
        this.documentHelper.dialog.show();
    }
    public hideDialog = (): void => {
        this.passwordTextBox.value = '';
        this.confirmPasswordTextBox.value = '';
        this.documentHelper.dialog.hide();
    }

    /**
     * @private
     */
    public okButtonClick = (): void => {
        if (this.passwordTextBox.value !== this.confirmPasswordTextBox.value) {
            /* tslint:disable */
            DialogUtility.alert(this.localeValue.getConstant('Password Mismatch'));
            /* tslint:enable */
        } else {
            this.password = this.passwordTextBox.value;
            this.viewer.owner.editor.addProtection(this.password);
        }
    }

}
/**
 * @private 
 */
export class UnProtectDocumentDialog {
    private documentHelper: DocumentHelper;
    private target: HTMLElement;
    private passwordTextBox: HTMLInputElement;
    private owner: RestrictEditing;

    private localObj: L10n;
    private currentHashValue: string;
    private currentSaltValue: string;
    get viewer(): LayoutViewer {
        return this.owner.viewer;
    }
    constructor(documentHelper: DocumentHelper, owner: RestrictEditing) {
        this.documentHelper = documentHelper;
        this.owner = owner;
    }

    /**
     * @private
     */
    public initDialog(localValue: L10n, isRtl?: boolean): void {
        let instance: UnProtectDocumentDialog = this;
        let id: string = this.viewer.owner.containerId + '_enforce_protection';
        this.target = createElement('div', { id: id, className: 'e-de-enforce' });

        let container: HTMLElement = createElement('div');
        let newPassWord: HTMLElement = createElement('div', {
            className: 'e-de-unprotect-dlg-title',
            innerHTML: localValue.getConstant('Password')
        });
        this.passwordTextBox = createElement('input', {
            attrs: { type: 'password' },
            id: this.viewer.owner.containerId + '_display_text', className: 'e-input e-de-enforce-dlg-input'
        }) as HTMLInputElement;
        // this.passwordTextBox.addEventListener('keyup', instance.onKeyUpOnDisplayBox);
        container.appendChild(newPassWord);
        container.appendChild(this.passwordTextBox);
        this.target.appendChild(container);
    }
    /**
     * @private
     */
    public show = (): void => {
        this.localObj = new L10n('documenteditor', this.viewer.owner.defaultLocale);
        this.localObj.setLocale(this.viewer.owner.locale);
        if (!this.target) {
            this.initDialog(this.localObj, this.viewer.owner.enableRtl);
        }
        this.documentHelper.dialog.header = 'Unprotect Document';
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.buttons = [{
            click: this.okButtonClick,
            buttonModel: { content: this.localObj.getConstant('Ok'), cssClass: 'e-flat', isPrimary: true }
        },
        {
            click: this.hideDialog,
            buttonModel: { content: this.localObj.getConstant('Cancel'), cssClass: 'e-flat' }
        }];
        this.documentHelper.dialog.dataBind();
        this.passwordTextBox.value = '';
        this.documentHelper.dialog.show();
    }
    /**
     * @private
     */
    /* tslint:disable:no-any */
    public okButtonClick = (): void => {
        let password: string = this.passwordTextBox.value;
        if (password === '') {
            return;
        }
        this.viewer.owner.editor.stopProtection(password);
    }
    /**
     * @private
     */
    public hideDialog = (): void => {
        this.passwordTextBox.value = '';
        this.documentHelper.dialog.hide();
    }
    /* tslint:enable:no-any */
}    