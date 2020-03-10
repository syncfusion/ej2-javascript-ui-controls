import { LayoutViewer, EditRangeStartElementBox, DocumentHelper } from '../viewer';
import { createElement, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { AddUserDialog } from './add-user-dialog';
import { EnforceProtectionDialog, UnProtectDocumentDialog } from './enforce-protection-dialog';
import { ProtectionType } from '../../base/types';
import { Base64 } from '../editor/editor-helper';
import { ListView } from '@syncfusion/ej2-lists';

/**
 * @private
 */
export class RestrictEditing {
    private documentHelper: DocumentHelper;
    public restrictPane: HTMLElement;
    public allowFormatting: CheckBox;
    private addUser: HTMLButtonElement;
    private enforceProtection: HTMLButtonElement;
    private readonly: CheckBox;
    private allowFormat: CheckBox;
    private allowPrint: CheckBox;
    private allowCopy: CheckBox;
    private addUserDialog: AddUserDialog;
    public enforceProtectionDialog: EnforceProtectionDialog;
    public stopProtection: HTMLButtonElement;
    public addRemove: boolean = true;
    /**
     * @private
     */
    public unProtectDialog: UnProtectDocumentDialog;
    public stopProtectionDiv: HTMLElement;
    public restrictPaneWholeDiv: HTMLElement;
    private closeButton: HTMLButtonElement;
    public protectionType: ProtectionType = 'NoProtection';
    public restrictFormatting: boolean = false;
    private localObj: L10n;

    public currentHashValue: string;
    public currentSaltValue: string;
    public isShowRestrictPane: boolean = false;
    public base64: Base64;
    public addedUser: ListView;
    public stopReadOnlyOptions: HTMLElement;
    public isAddUser: boolean = false;

    public usersCollection: string[] = ['Everyone'];
    public highlightCheckBox: CheckBox;

    constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
        this.addUserDialog = new AddUserDialog(documentHelper, this);
        this.enforceProtectionDialog = new EnforceProtectionDialog(documentHelper, this);
        this.unProtectDialog = new UnProtectDocumentDialog(documentHelper, this);
        this.base64 = new Base64();
    }
    get viewer(): LayoutViewer {
        return this.documentHelper.owner.viewer;
    }
    public showHideRestrictPane(isShow: boolean): void {
        if (isShow) {
            this.localObj = new L10n('documenteditor', this.viewer.owner.defaultLocale);
            this.localObj.setLocale(this.viewer.owner.locale);
            if (!this.restrictPane) {
                this.initPane(this.localObj, true);
            }
            this.restrictPane.style.display = 'block';
            this.isShowRestrictPane = true;
            this.documentHelper.selection.isHighlightEditRegion = true;
            this.wireEvents();
            this.documentHelper.updateViewerSize();
            this.loadPaneValue();
        } else {
            this.closePane();
            this.documentHelper.updateFocus();
        }
    }

    private initPane(localValue: L10n, initial: boolean): void {
        this.restrictPane = createElement('div', { className: 'e-de-restrict-pane', styles: 'display:none' });
        let headerWholeDiv: HTMLElement = createElement('div', { className: 'e-de-rp-whole-header' });
        let headerDiv1: HTMLElement = createElement('div', {
            styles: 'width:75%',
            innerHTML: localValue.getConstant('Restrict Editing'), className: 'e-de-rp-header'
        });
        this.closeButton = createElement('button', {
            className: 'e-de-rp-close-icon e-de-close-icon e-btn e-flat e-icon-btn', id: 'close',
            attrs: { type: 'button' }
        }) as HTMLButtonElement;
        headerWholeDiv.appendChild(this.closeButton);
        headerWholeDiv.appendChild(headerDiv1);
        let closeSpan: HTMLSpanElement = createElement('span', { className: 'e-de-op-close-icon e-de-close-icon e-btn-icon e-icons' });
        this.closeButton.appendChild(closeSpan);
        this.restrictPane.appendChild(headerWholeDiv);
        this.initRestrictEditingPane(localValue);
        this.documentHelper.optionsPaneContainer.setAttribute('style', 'display:inline-flex;');
        this.documentHelper.optionsPaneContainer.insertBefore(this.restrictPane, this.documentHelper.viewerContainer);
    }
    // tslint:disable:max-func-body-length
    public initRestrictEditingPane(localObj: L10n): void {
        this.restrictPaneWholeDiv = createElement('div');
        let formatWholeDiv: HTMLElement = createElement('div', { className: 'e-de-rp-sub-div' });
        let formatDiv: HTMLElement = createElement('div', {
            innerHTML: localObj.getConstant('Formatting restrictions'),
            className: 'e-de-rp-format'
        });
        formatWholeDiv.appendChild(formatDiv);
        let allowFormatting: HTMLInputElement = createElement('input', {
            attrs: { type: 'checkbox' },
            id: this.viewer.owner.containerId + '_allowFormat',
        }) as HTMLInputElement;
        formatWholeDiv.appendChild(allowFormatting);
        this.allowFormat = this.createCheckBox(localObj.getConstant('Allow formatting'), allowFormatting);
        this.restrictPaneWholeDiv.appendChild(formatWholeDiv);
        // Editing restrictions
        let editRestrictWholeDiv: HTMLElement = createElement('div', { className: 'e-de-rp-sub-div' });
        let editRestrict: HTMLElement = createElement('div', {
            innerHTML: localObj.getConstant('Editing restrictions'),
            className: 'e-de-rp-format'
        });
        editRestrictWholeDiv.appendChild(editRestrict);
        let readOnly: HTMLInputElement = createElement('input', {
            attrs: { type: 'checkbox' },
            id: this.viewer.owner.containerId + '_readOnly'
        }) as HTMLInputElement;
        editRestrictWholeDiv.appendChild(readOnly);
        this.readonly = this.createCheckBox('Read only', readOnly);
        // let allowPrint: HTMLInputElement = createElement('input', {
        //     attrs: { type: 'checkbox' },
        //     id: this.viewer.owner.containerId + '_allowPrint'
        // }) as HTMLInputElement;
        // editRestrictWholeDiv.appendChild(allowPrint);
        // this.allowPrint = this.createCheckBox('Allow Printing', allowPrint);
        // let allowCopy: HTMLInputElement = createElement('input', {
        //     attrs: { type: 'checkbox' },
        //     id: this.viewer.owner.containerId + '_allowCopy'
        // }) as HTMLInputElement;
        // editRestrictWholeDiv.appendChild(allowCopy);
        // this.allowCopy = this.createCheckBox('Allow Copy', allowCopy);
        this.restrictPaneWholeDiv.appendChild(editRestrictWholeDiv);
        // User Permissions
        let userWholeDiv: HTMLElement = createElement('div', { className: 'e-de-rp-sub-div' });
        let userDiv: HTMLElement = createElement('div', {
            innerHTML: localObj.getConstant('Exceptions Optional'),
            className: 'e-de-rp-format'
        });
        userWholeDiv.appendChild(userDiv);
        let subContentDiv: HTMLElement = createElement('div', {
            innerHTML: localObj.getConstant('Select Part Of Document And User'),
            styles: 'margin-bottom:8px;'
        });
        userWholeDiv.appendChild(subContentDiv);
        let emptyuserDiv: HTMLElement = createElement('div', { className: 'e-de-rp-user' });
        userWholeDiv.appendChild(emptyuserDiv);
        this.addedUser = new ListView({
            cssClass: 'e-de-user-listView',
            dataSource: [{ text: 'Everyone' }],
            showCheckBox: true,
            select: this.selectHandler
        });

        this.addedUser.appendTo(emptyuserDiv);
        this.addUser = createElement('button', {
            id: this.viewer.owner.containerId + '_addUser',
            className: 'e-btn e-primary e-flat',
            innerHTML: localObj.getConstant('More users') + '...',
            styles: 'margin-top: 3px'
        }) as HTMLButtonElement;
        userWholeDiv.appendChild(this.addUser);

        this.restrictPaneWholeDiv.appendChild(userWholeDiv);
        let lastDiv: HTMLElement = createElement('div', { className: 'e-de-rp-enforce' });
        this.restrictPaneWholeDiv.appendChild(lastDiv);
        this.enforceProtection = createElement('button', {
            id: this.viewer.owner.containerId + '_addUser',
            innerHTML: localObj.getConstant('Enforcing Protection'),
            className: 'e-btn e-de-rp-btn-enforce'
        }) as HTMLButtonElement;
        lastDiv.appendChild(this.enforceProtection);
        this.restrictPane.appendChild(this.restrictPaneWholeDiv);
        this.stopProtectionDiv = createElement('div', { styles: 'display:none' });
        // tslint:disable-next-line:max-line-length
        let headerDiv: HTMLElement = createElement('div', { innerHTML: localObj.getConstant('Your permissions'), className: 'e-de-rp-stop-div1' });
        this.stopProtectionDiv.appendChild(headerDiv);
        // tslint:disable-next-line:max-line-length
        let content: string = localObj.getConstant('Protected Document');
        let contentDiv1: HTMLElement = createElement('div', { innerHTML: content, className: 'e-de-rp-stop-div2' });
        this.stopProtectionDiv.appendChild(contentDiv1);
        // tslint:disable-next-line:max-line-length
        let contentDiv2: HTMLElement = createElement('div', { innerHTML: localObj.getConstant('You may format text only with certain styles'), className: 'e-de-rp-stop-div3' });
        this.stopProtectionDiv.appendChild(contentDiv2);
        this.stopReadOnlyOptions = createElement('div');
        this.stopProtectionDiv.appendChild(this.stopReadOnlyOptions);
        let navigateNext: HTMLElement = createElement('div', { className: 'e-de-rp-enforce-nav' });
        // tslint:disable-next-line:max-line-length
        let navigateNextButton: HTMLElement = createElement('button', { innerHTML: localObj.getConstant('Find Next Region I Can Edit'), className: 'e-btn e-de-rp-nav-btn' });
        navigateNext.appendChild(navigateNextButton);
        navigateNextButton.addEventListener('click', this.navigateNextRegion);
        this.stopReadOnlyOptions.appendChild(navigateNext);

        let showAllRegion: HTMLElement = createElement('div', { className: 'e-de-rp-enforce-nav' });
        // tslint:disable-next-line:max-line-length
        let showAllRegionButton: HTMLElement = createElement('button', { innerHTML: localObj.getConstant('Show All Regions I Can Edit'), className: 'e-btn e-de-rp-nav-btn' });
        showAllRegion.appendChild(showAllRegionButton);
        showAllRegionButton.addEventListener('click', this.showAllRegion);
        this.stopReadOnlyOptions.appendChild(showAllRegion);

        let highlightRegion: HTMLElement = createElement('div', { className: 'e-de-rp-enforce-nav e-de-rp-nav-lbl' });
        // tslint:disable-next-line:max-line-length
        let highlightRegionInput: HTMLInputElement = <HTMLInputElement>createElement('input', { attrs: { type: 'checkbox' }, className: 'e-btn e-de-rp-nav-btn' });
        highlightRegion.appendChild(highlightRegionInput);
        this.stopReadOnlyOptions.appendChild(highlightRegion);

        this.highlightCheckBox = new CheckBox({ label: localObj.getConstant('Highlight the regions I can edit') }, highlightRegionInput);
        let lastButtonDiv: HTMLElement = createElement('div', { className: 'e-de-rp-enforce' });
        this.stopProtection = createElement('button', {
            innerHTML: localObj.getConstant('Stop Protection'),
            className: 'e-btn e-de-rp-btn-stop-enforce'
        }) as HTMLButtonElement;
        lastButtonDiv.appendChild(this.stopProtection);
        this.stopProtectionDiv.appendChild(lastButtonDiv);
        this.restrictPane.appendChild(this.stopProtectionDiv);
    }
    public showStopProtectionPane(show: boolean): void {
        if (show) {
            this.stopProtectionDiv.style.display = 'block';
            this.restrictPaneWholeDiv.style.display = 'none';
        } else {
            this.stopProtectionDiv.style.display = 'none';
            this.restrictPaneWholeDiv.style.display = 'block';
        }
        if (this.documentHelper.protectionType === 'ReadOnly') {
            this.stopReadOnlyOptions.style.display = 'block';
        } else {
            this.stopReadOnlyOptions.style.display = 'none';
        }
    }
    private closePane = (): void => {
        this.restrictPane.style.display = 'none';
        this.documentHelper.updateViewerSize();
    }
    private wireEvents(): void {
        this.addUser.addEventListener('click', this.addUserDialog.show);
        this.enforceProtection.addEventListener('click', this.protectDocument);
        this.stopProtection.addEventListener('click', this.stopProtectionTriggered);
        this.closeButton.addEventListener('click', this.closePane);
        this.allowFormat.addEventListener('change', this.enableFormatting);
        this.readonly.addEventListener('change', this.readOnlyChanges);
        this.highlightCheckBox.addEventListener('change', this.highlightClicked);
    }
    /* tslint:disable:no-any */
    private enableFormatting = (args: any): void => {
        this.restrictFormatting = !args.checked;
    }
    private stopProtectionTriggered = (args: any): void => {
        if ((isNullOrUndefined(this.documentHelper.saltValue) || this.documentHelper.saltValue === '')
            && (isNullOrUndefined(this.documentHelper.hashValue) || this.documentHelper.hashValue === '')) {
            this.documentHelper.owner.editor.unProtectDocument();
            return;
        }
        this.unProtectDialog.show();
    }
    private readOnlyChanges = (args: any): void => {
        if (args.checked) {
            this.protectionType = 'ReadOnly';
        } else {
            this.protectionType = 'NoProtection';
            this.addedUser.uncheckAllItems();
            this.viewer.owner.editor.removeAllEditRestrictions();
        }
    }
    private selectHandler = (args: any): void => {
        if (args.isChecked) {
            this.viewer.owner.editor.insertEditRangeElement(args.text);
            args.event.target.classList.add('e-check');
        } else {
            this.viewer.owner.editor.removeUserRestrictions(args.text);
        }
    }
    public highlightClicked = (args: any) => {
        this.documentHelper.selection.isHighlightEditRegion = args.checked;
    }
    /* tslint:enable:no-any */
    private protectDocument = (): void => {
        this.enforceProtectionDialog.show();
    }
    public createCheckBox(label: string, element: HTMLInputElement): CheckBox {
        let checkBox: CheckBox = new CheckBox({ label: label });
        checkBox.appendTo(element);
        return checkBox;

    }

    public loadPaneValue(): void {
        if (!this.isAddUser) {
            this.protectionType = this.documentHelper.protectionType;
        }
        this.allowFormat.checked = !this.documentHelper.restrictFormatting;
        this.readonly.checked = this.documentHelper.protectionType === 'ReadOnly' || this.protectionType !== 'NoProtection';
        this.highlightCheckBox.checked = true;
        this.addedUser.enablePersistence = true;
        this.addedUser.dataSource = this.documentHelper.userCollection;
        this.addedUser.refresh();
        this.showStopProtectionPane(this.documentHelper.isDocumentProtected);
    }

    public navigateNextRegion = () => {
        this.documentHelper.selection.navigateToNextEditingRegion();
    }
    public addUserCollection(): void {
        if (this.documentHelper.selection && this.documentHelper.selection.editRangeCollection.length > 0) {
            for (let i: number = 0; i < this.documentHelper.selection.editRangeCollection.length; i++) {
                let editStart: EditRangeStartElementBox = this.documentHelper.selection.editRangeCollection[i];
                if (editStart.user !== '' && this.usersCollection.indexOf(editStart.user) === -1) {
                    this.usersCollection.push(editStart.user);
                }
                if (editStart.group !== '' && this.usersCollection.indexOf(editStart.group) === -1) {
                    this.usersCollection.push(editStart.group);
                }
            }
        }
        this.addedUser.dataSource = this.usersCollection;
        this.addedUser.refresh();
    }
    public showAllRegion = () => {
        this.documentHelper.selection.showAllEditingRegion();
    }
    public updateUserInformation(): void {
        this.addedUser.uncheckAllItems();
        if (this.documentHelper.selection.checkSelectionIsAtEditRegion) {
            let editRange: EditRangeStartElementBox = this.documentHelper.selection.getEditRangeStartElement();
            if (editRange) {
                let index: number = (this.addedUser.dataSource as string[]).indexOf(editRange.user);
                if (index > -1) {
                    let listElement: HTMLLIElement = this.addedUser.element.querySelectorAll('li')[index];
                    listElement.querySelector('.e-icons').classList.add('e-check');
                }
                index = (this.addedUser.dataSource as string[]).indexOf(editRange.group);
                if (index > -1) {
                    let listElement: HTMLLIElement = this.addedUser.element.querySelectorAll('li')[index];
                    listElement.querySelector('.e-icons').classList.add('e-check');
                }
            }
        }
    }
}