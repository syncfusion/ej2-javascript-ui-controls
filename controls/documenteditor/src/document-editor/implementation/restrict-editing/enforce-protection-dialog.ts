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

    public constructor(documentHelper: DocumentHelper, owner: RestrictEditing) {
        this.documentHelper = documentHelper;
        this.owner = owner;
    }
    public get viewer(): LayoutViewer {
        return this.owner.viewer;
    }

    public initDialog(localValue: L10n): void {
        //const instance: EnforceProtectionDialog = this;
        const id: string = this.viewer.owner.containerId + '_enforce_protection';
        this.target = createElement('div', { id: id, className: 'e-de-enforce' });

        const container: HTMLElement = createElement('div');
        const newPassWord: HTMLElement = createElement('div', { className: 'e-de-enforce-dlg-title', innerHTML: localValue.getConstant('Enter new password') });
        this.passwordTextBox = createElement('input', { attrs: { type: 'password', autofocus: 'true' }, id: this.viewer.owner.containerId + '_display_text', className: 'e-input e-de-enforce-dlg-input' }) as HTMLInputElement;
        // this.passwordTextBox.addEventListener('keyup', instance.onKeyUpOnDisplayBox);
        container.appendChild(newPassWord);
        container.appendChild(this.passwordTextBox);
        const confirmPassword: HTMLElement = createElement('div', { className: 'e-de-enforce-dlg-title', innerHTML: localValue.getConstant('Reenter new password to confirm') }) as HTMLDivElement;
        this.confirmPasswordTextBox = createElement('input', { attrs: { type: 'password' }, id: this.viewer.owner.containerId + '_url_text', className: 'e-input e-de-enforce-dlg-input' }) as HTMLInputElement;
        container.appendChild(confirmPassword);
        container.appendChild(this.confirmPasswordTextBox);
        this.target.appendChild(container);
    }
    /**
     * @private
     * @returns {void}
     */
    public show = (): void => {
        this.localeValue = new L10n('documenteditor', this.viewer.owner.defaultLocale);
        this.localeValue.setLocale(this.viewer.owner.locale);
        if (!this.target) {
            this.initDialog(this.localeValue);
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
    };
    /**
     * @returns {void}
     */
    public hideDialog = (): void => {
        this.passwordTextBox.value = '';
        this.confirmPasswordTextBox.value = '';
        this.documentHelper.dialog.hide();
    };

    /**
     * @private
     * @returns {void}
     */
    public okButtonClick = (): void => {
        if (this.passwordTextBox.value !== this.confirmPasswordTextBox.value) {
            DialogUtility.alert(this.localeValue.getConstant('Password Mismatch'));
        } else {
            this.password = this.passwordTextBox.value;
            this.viewer.owner.editor.addProtection(this.password, this.owner.protectionType);
        }
    };

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
    public get viewer(): LayoutViewer {
        return this.owner.viewer;
    }
    public constructor(documentHelper: DocumentHelper, owner: RestrictEditing) {
        this.documentHelper = documentHelper;
        this.owner = owner;
    }

    public initDialog(localValue: L10n): void {
        //const instance: UnProtectDocumentDialog = this;
        const id: string = this.viewer.owner.containerId + '_enforce_protection';
        this.target = createElement('div', { id: id, className: 'e-de-enforce' });

        const container: HTMLElement = createElement('div');
        const newPassWord: HTMLElement = createElement('div', {
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
     * @returns {void}
     */
    public show = (): void => {
        this.localObj = new L10n('documenteditor', this.viewer.owner.defaultLocale);
        this.localObj.setLocale(this.viewer.owner.locale);
        if (!this.target) {
            this.initDialog(this.localObj);
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
    };
    /**
     * @private
     * @returns {void}
     */
    public okButtonClick = (): void => {
        const password: string = this.passwordTextBox.value;
        if (password === '') {
            return;
        }
        this.viewer.owner.editor.stopProtection(password);
    };
    /**
     * @private
     * @returns {void}
     */
    public hideDialog = (): void => {
        this.passwordTextBox.value = '';
        this.documentHelper.dialog.hide();
    };
    /* eslint-enable @typescript-eslint/no-explicit-any */
}
