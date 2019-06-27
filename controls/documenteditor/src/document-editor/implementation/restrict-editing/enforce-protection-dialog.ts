import { LayoutViewer } from '../viewer';
import { L10n, createElement } from '@syncfusion/ej2-base';
import { RestrictEditing } from './restrict-editing-pane';
import { DialogUtility } from '@syncfusion/ej2-popups';
import { XmlHttpRequestHandler } from '../../base/ajax-helper';
/**
 * @private 
 */
export class EnforceProtectionDialog {
    private viewer: LayoutViewer;
    private target: HTMLElement;
    private passwordTextBox: HTMLInputElement;
    private confirmPasswordTextBox: HTMLInputElement;
    private localeValue: L10n;
    private owner: RestrictEditing;
    /**
     * @private
     */
    public password: string;

    private enforceProtectionHandler: XmlHttpRequestHandler;

    constructor(viewer: LayoutViewer, owner: RestrictEditing) {
        this.viewer = viewer;
        this.owner = owner;
        this.enforceProtectionHandler = new XmlHttpRequestHandler();
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
        this.viewer.dialog.header = this.localeValue.getConstant('Start Enforcing Protection');
        this.viewer.dialog.height = 'auto';
        this.viewer.dialog.content = this.target;
        this.viewer.dialog.width = 'auto';
        this.viewer.dialog.buttons = [{
            click: this.okButtonClick,
            buttonModel: { content: this.localeValue.getConstant('Ok'), cssClass: 'e-flat', isPrimary: true }
        },
        {
            click: this.hideDialog,
            buttonModel: { content: this.localeValue.getConstant('Cancel'), cssClass: 'e-flat' }
        }];
        this.passwordTextBox.value = '';
        this.confirmPasswordTextBox.value = '';
        this.viewer.dialog.show();
    }
    public hideDialog = (): void => {
        this.passwordTextBox.value = '';
        this.confirmPasswordTextBox.value = '';
        this.viewer.dialog.hide();
    }

    /**
     * @private
     */
    public okButtonClick = (): void => {
        if (this.passwordTextBox.value !== this.confirmPasswordTextBox.value) {
            /* tslint:disable */
            DialogUtility.alert("The password don't match");
            /* tslint:enable */
        } else {
            this.password = this.passwordTextBox.value;
            let passwordBase64: string = this.owner.base64.encodeString(this.password);
            /* tslint:disable:no-any */
            let formObject: any = {
                passwordBase64: passwordBase64,
                saltBase64: '',
                spinCount: 100000
            };
            /* tslint:enable:no-any */
            let url: string = this.viewer.owner.serviceUrl + this.viewer.owner.serverActionSettings.restrictEditing;
            this.enforceProtectionHandler.url = url;
            this.enforceProtectionHandler.contentType = 'application/json;charset=UTF-8';
            this.enforceProtectionHandler.onSuccess = this.enforceProtection.bind(this);
            this.enforceProtectionHandler.onFailure = this.failureHandler.bind(this);
            this.enforceProtectionHandler.onError = this.failureHandler.bind(this);
            this.enforceProtectionHandler.send(formObject);
        }
    }
    /* tslint:disable:no-any */
    private failureHandler(result: any): void {
        if (result.name === 'onError') {
            DialogUtility.alert(this.localeValue.getConstant('Error in establishing connection with web server'));
        } else {
            console.error(result.statusText);
        }
    }
    private enforceProtection(result: any): void {
        let data: string[] = JSON.parse(result.data);
        this.viewer.saltValue = data[0];
        this.viewer.hashValue = data[1];
        this.protectDocument();
    }
    /* tslint:enable:no-any */
    private protectDocument(): void {
        this.viewer.owner.editor.protect(this.owner.protectionType);
        this.viewer.restrictFormatting = this.owner.restrictFormatting;
        this.viewer.restrictEditingPane.showStopProtectionPane(true);
        this.viewer.restrictEditingPane.loadPaneValue();
        this.viewer.dialog.hide();
    }
}
/**
 * @private 
 */
export class UnProtectDocumentDialog {
    private viewer: LayoutViewer;
    private target: HTMLElement;
    private passwordTextBox: HTMLInputElement;
    private owner: RestrictEditing;

    private localObj: L10n;
    private currentHashValue: string;
    private currentSaltValue: string;

    private unProtectDocumentHandler: XmlHttpRequestHandler;
    constructor(viewer: LayoutViewer, owner: RestrictEditing) {
        this.viewer = viewer;
        this.owner = owner;
        this.unProtectDocumentHandler = new XmlHttpRequestHandler;
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
        this.viewer.dialog.header = 'Unprotect Document';
        this.viewer.dialog.height = 'auto';
        this.viewer.dialog.width = 'auto';
        this.viewer.dialog.content = this.target;
        this.viewer.dialog.buttons = [{
            click: this.okButtonClick,
            buttonModel: { content: this.localObj.getConstant('Ok'), cssClass: 'e-flat', isPrimary: true }
        },
        {
            click: this.hideDialog,
            buttonModel: { content: this.localObj.getConstant('Cancel'), cssClass: 'e-flat' }
        }];
        this.viewer.dialog.dataBind();
        this.passwordTextBox.value = '';
        this.viewer.dialog.show();
    }
    /**
     * @private
     */
    /* tslint:disable:no-any */
    public okButtonClick = (): void => {
        if (this.passwordTextBox.value === '') {
            return;
        }
        let password: string = this.passwordTextBox.value;
        let passwordBase64: string = this.owner.base64.encodeString(password);
        let formObject: any = {
            passwordBase64: passwordBase64,
            saltBase64: this.viewer.saltValue,
            spinCount: 100000
        };
        this.unProtectDocumentHandler.url = this.viewer.owner.serviceUrl + this.viewer.owner.serverActionSettings.restrictEditing;
        this.unProtectDocumentHandler.contentType = 'application/json;charset=UTF-8';
        this.unProtectDocumentHandler.onSuccess = this.onUnProtectionSuccess.bind(this);
        this.unProtectDocumentHandler.onFailure = this.failureHandler.bind(this);
        this.unProtectDocumentHandler.onError = this.failureHandler.bind(this);
        this.unProtectDocumentHandler.send(formObject);
    }
    private onUnProtectionSuccess(result: any): void {
        let encodeString: string[] = JSON.parse(result.data);
        this.currentHashValue = encodeString[1];
        this.currentSaltValue = encodeString[0];
        this.validateHashValue();
    }
    private failureHandler(result: any): void {
        if (result.name === 'onError') {
            DialogUtility.alert(this.localObj.getConstant('Error in establishing connection with web server'));
        } else {
            console.error(result.statusText);
        }
    }
    /**
     * @private
     */
    public hideDialog = (): void => {
        this.passwordTextBox.value = '';
        this.viewer.dialog.hide();
    }
    /* tslint:enable:no-any */
    private validateHashValue(): void {
        let decodeUserHashValue: Uint8Array = this.owner.base64.decodeString(this.currentHashValue);
        let documentHashValue: string = this.viewer.hashValue;
        let defaultHashValue: Uint8Array = this.owner.base64.decodeString(documentHashValue);
        let stopProtection: boolean = true;
        if (decodeUserHashValue.length === defaultHashValue.length) {
            for (let i: number = 0; i < decodeUserHashValue.length; i++) {
                if (decodeUserHashValue[i] !== defaultHashValue[i]) {
                    stopProtection = false;
                    break;
                }
            }
        } else {
            stopProtection = false;
        }
        if (stopProtection) {
            this.viewer.restrictEditingPane.showStopProtectionPane(false);
            this.viewer.isDocumentProtected = false;
            this.viewer.restrictFormatting = false;
            this.viewer.selection.highlightEditRegion();
            this.viewer.dialog.hide();
        } else {
            DialogUtility.alert(this.localObj.getConstant('The password is incorrect'));
        }
    }
}    