import { LayoutViewer, EditRangeStartElementBox, DocumentHelper } from '../viewer';
import { createElement, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { AddUserDialog } from './add-user-dialog';
import { EnforceProtectionDialog, UnProtectDocumentDialog } from './enforce-protection-dialog';
import { ProtectionType } from '../../base/types';
import { Base64 } from '../editor/editor-helper';
import { ListView } from '@syncfusion/ej2-lists';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Key } from 'selenium-webdriver';
/**
 * @private
 * @param {any} args - Specifies the args
 * @returns {void}
 */
export class RestrictEditing {
    private documentHelper: DocumentHelper;
    public restrictPane: HTMLElement;
    private addUser: HTMLButtonElement;
    private enforceProtection: HTMLButtonElement;
    private allowFormat: CheckBox;
    private allowPrint: CheckBox;
    private allowCopy: CheckBox;
    /**
     * @private
     */
    public addUserDialog: AddUserDialog;
    public enforceProtectionDialog: EnforceProtectionDialog;
    public stopProtection: HTMLButtonElement;
    public addRemove: boolean = true;
    private protectionTypeDrop: DropDownList;
    private userWholeDiv: HTMLElement;
    /**
     * @private
     */
    public unProtectDialog: UnProtectDocumentDialog;
    public stopProtectionDiv: HTMLElement;
    public contentDiv1: HTMLElement;
    public contentDiv2: HTMLElement;
    public restrictPaneWholeDiv: HTMLElement;
    private closeButton: HTMLButtonElement;
    public protectionType: ProtectionType = 'ReadOnly';
    private localObj: L10n;
    public currentHashValue: string;
    public currentSaltValue: string;
    public previousProtectionType: string = 'Read only';
    public isShowRestrictPane: boolean = false;
    public base64: Base64;
    public addedUser: ListView;
    public stopReadOnlyOptions: HTMLElement;
    public isAddUser: boolean = false;
    public usersCollection: string[] = ['Everyone'];
    public highlightCheckBox: CheckBox;
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
        this.addUserDialog = new AddUserDialog(documentHelper);
        this.enforceProtectionDialog = new EnforceProtectionDialog(documentHelper, this);
        this.unProtectDialog = new UnProtectDocumentDialog(documentHelper, this);
        this.base64 = new Base64();
    }
    public get viewer(): LayoutViewer {
        return this.documentHelper.owner.viewer;
    }
    public showHideRestrictPane(isShow: boolean): void {
        if (!this.restrictPane) {
            this.localObj = new L10n('documenteditor', this.viewer.owner.defaultLocale);
            this.localObj.setLocale(this.viewer.owner.locale);
            this.initPane(this.localObj, this.documentHelper.owner.enableRtl);
        }
        if (isShow) {
            this.restrictPane.style.display = 'block';
            this.isShowRestrictPane = true;
            this.documentHelper.selection.isHighlightEditRegion = true;
            this.wireEvents();
            this.documentHelper.updateViewerSize();
            this.loadPaneValue();
            this.addUserCollection();
        } else {
            this.closePane();
            this.documentHelper.updateFocus();
        }
        this.documentHelper.owner.triggerResize();
    }
    private initPane(localValue: L10n, isRtl?: boolean): void {
        this.restrictPane = createElement('div', { className: 'e-de-restrict-pane'});
        if (isRtl) {
            this.restrictPane.classList.add('e-rtl');
        }
        const headerWholeDiv: HTMLElement = createElement('div', { className: 'e-de-rp-whole-header' });
        const headerDiv1: HTMLElement = createElement('div', {
            innerHTML: localValue.getConstant('Restrict Editing'), className: 'e-de-rp-header'
        });
        this.closeButton = createElement('button', {
            className: 'e-de-rp-close-icon e-de-close-icon e-btn e-flat e-icon-btn',
            attrs: { type: 'button' }
        }) as HTMLButtonElement;
        this.closeButton.setAttribute('aria-label', this.localObj.getConstant('Close'));
        headerWholeDiv.appendChild(this.closeButton);
        headerWholeDiv.appendChild(headerDiv1);
        const closeSpan: HTMLSpanElement = createElement('span', { className: 'e-de-op-close-icon e-de-close-icon e-btn-icon e-icons' });
        this.closeButton.appendChild(closeSpan);
        this.restrictPane.appendChild(headerWholeDiv);
        this.initRestrictEditingPane(localValue);
        this.documentHelper.optionsPaneContainer.setAttribute('style', 'display:inline-flex;');
        this.documentHelper.optionsPaneContainer.insertBefore(this.restrictPane, this.documentHelper.viewerContainer);
    }
    /* eslint-disable  */
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
        }) as HTMLInputElement;
        formatWholeDiv.appendChild(allowFormatting);
        this.allowFormat = this.createCheckBox(localObj.getConstant('Allow formatting'), allowFormatting);
        this.restrictPaneWholeDiv.appendChild(formatWholeDiv);
        // Editing restrictions
        let editRestrictWholeDiv: HTMLElement = createElement('div', { className: 'e-de-rp-sub-div' });
        // let editRestrict: HTMLElement = createElement('div', {
        //     innerHTML: localObj.getConstant('Editing restrictions'),
        //     className: 'e-de-rp-format'
        // });
        // editRestrictWholeDiv.appendChild(editRestrict);
        let readOnly: HTMLInputElement = createElement('input', {
            attrs: { type: 'checkbox' },
        }) as HTMLInputElement;
        let protectionTypeInput: HTMLInputElement = createElement('input', {
            className: 'e-prop-font-style'
        }) as HTMLInputElement;
        editRestrictWholeDiv.appendChild(protectionTypeInput);
        let protectionTypeValue: {[Key:string]: Object}[] =
        [
            {Value: 'Read only', Name: localObj.getConstant('Read only')},
            {Value: 'Filling in forms', Name: localObj.getConstant('Filling in forms')},
            {Value: 'Comments', Name: localObj.getConstant('Comments')},
            {Value: 'Tracked changes', Name: localObj.getConstant('Tracked changes') }
        ]
        this.protectionTypeDrop = new DropDownList({
            dataSource: protectionTypeValue,
            cssClass: 'e-de-prop-dropdown',
            floatLabelType:'Always',
            placeholder: localObj.getConstant('Editing restrictions'),
            fields: {text:'Name', value: 'Value'},
            enableRtl: this.documentHelper.owner.enableRtl
        });
        this.protectionTypeDrop.value = 'Read only';
        this.protectionTypeDrop.appendTo(protectionTypeInput);
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
        this.userWholeDiv = createElement('div', { className: 'e-de-rp-sub-div' });
        let userDiv: HTMLElement = createElement('div', {
            innerHTML: localObj.getConstant('Exceptions Optional'),
            className: 'e-de-rp-format'
        });
        this.userWholeDiv.appendChild(userDiv);
        let subContentDiv: HTMLElement = createElement('div', {
            innerHTML: localObj.getConstant('Select Part Of Document And User'),
            className: 'e-de-rp-sub-content-div'
        });
        this.userWholeDiv.appendChild(subContentDiv);
        let emptyuserDiv: HTMLElement = createElement('div', { className: 'e-de-rp-user' });
        this.userWholeDiv.appendChild(emptyuserDiv);
        this.addedUser = new ListView({
            cssClass: 'e-de-user-listView',
            dataSource: [{ text: 'Everyone' }],
            showCheckBox: true,
            select: this.selectHandler.bind(this),
            enableRtl: this.documentHelper.owner.enableRtl
        });

        this.addedUser.appendTo(emptyuserDiv);
        this.addUser = createElement('button', {
            className: 'e-btn e-primary e-flat e-de-rp-mu-btn',
            innerHTML: localObj.getConstant('More users') + '...',
            //styles: 'margin-top: 3px',
            attrs: { type: 'button' }
        }) as HTMLButtonElement;
        this.addUser.setAttribute('aria-label',localObj.getConstant('More users'));
        this.userWholeDiv.appendChild(this.addUser);

        this.restrictPaneWholeDiv.appendChild(this.userWholeDiv);
        let lastDiv: HTMLElement = createElement('div', { className: 'e-de-rp-enforce' });
        this.restrictPaneWholeDiv.appendChild(lastDiv);
        this.enforceProtection = createElement('button', {
            innerHTML: localObj.getConstant('Enforcing Protection'),
            className: 'e-btn e-de-rp-btn-enforce',
            attrs: { type: 'button' }
        }) as HTMLButtonElement;
        this.enforceProtection.setAttribute('aria-label', localObj.getConstant('Enforcing Protection'));
        lastDiv.appendChild(this.enforceProtection);
        this.restrictPane.appendChild(this.restrictPaneWholeDiv);
        this.stopProtectionDiv = createElement('div', { styles: 'display:none' });
        let headerDiv: HTMLElement = createElement('div', { innerHTML: localObj.getConstant('Your permissions'), className: 'e-de-rp-stop-div1' });
        this.stopProtectionDiv.appendChild(headerDiv);
        let contentWholeDiv = createElement('div',{className: 'e-de-rp-stop-div2'});
        this.stopProtectionDiv.appendChild(contentWholeDiv);
        let content1: string = localObj.getConstant('Protected Document');
        this.contentDiv1 = createElement('div', { innerHTML: content1 });
        contentWholeDiv.appendChild(this.contentDiv1);
        let content2: string = localObj.getConstant('ReadOnlyProtection');
        this.contentDiv2 = createElement('div', { innerHTML: content2 });
        contentWholeDiv.appendChild(this.contentDiv2);
        this.stopReadOnlyOptions = createElement('div');
        this.stopProtectionDiv.appendChild(this.stopReadOnlyOptions);
        let navigateNext: HTMLElement = createElement('div', { className: 'e-de-rp-enforce-nav' });
        let navigateNextButton: HTMLElement = createElement('button', {
            innerHTML: localObj.getConstant('Find Next Region I Can Edit'), className: 'e-btn e-de-rp-nav-btn',
            attrs: { type: 'button' }
        });
        navigateNext.appendChild(navigateNextButton);
        navigateNextButton.addEventListener('click', this.navigateNextRegion.bind(this));
        this.stopReadOnlyOptions.appendChild(navigateNext);

        let showAllRegion: HTMLElement = createElement('div', { className: 'e-de-rp-enforce-nav' });
        let showAllRegionButton: HTMLElement = createElement('button', {
            innerHTML: localObj.getConstant('Show All Regions I Can Edit'), className: 'e-btn e-de-rp-nav-btn',
            attrs: { type: 'button' }
        });
        showAllRegion.appendChild(showAllRegionButton);
        showAllRegionButton.addEventListener('click', this.showAllRegion);
        this.stopReadOnlyOptions.appendChild(showAllRegion);

        let highlightRegion: HTMLElement = createElement('div', { className: 'e-de-rp-nav-lbl e-de-rp-more-less' });
        let highlightRegionInput: HTMLInputElement = <HTMLInputElement>createElement('input', { attrs: { type: 'checkbox' }, className: 'e-btn e-de-rp-nav-btn' });
        highlightRegion.appendChild(highlightRegionInput);
        this.stopReadOnlyOptions.appendChild(highlightRegion);
        this.highlightCheckBox = new CheckBox({ label: localObj.getConstant('Highlight the regions I can edit') ,change: this.changeHighlightOptions.bind(this),enableRtl:this.documentHelper.owner.enableRtl }, highlightRegionInput,);
        let lastButtonDiv: HTMLElement = createElement('div', { className: 'e-de-rp-enforce' });
        this.stopProtection = createElement('button', {
            innerHTML: localObj.getConstant('Stop Protection'),
            className: 'e-btn e-de-rp-btn-stop-enforce',
            attrs: { type: 'button' }
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
        switch (this.documentHelper.protectionType) {
            case 'ReadOnly':
                this.stopReadOnlyOptions.style.display = 'block';
                break;
            case 'CommentsOnly':
                this.stopReadOnlyOptions.style.display = 'block';
                break;
            default:
                this.stopReadOnlyOptions.style.display = 'none';
                break;
        }
        this.documentHelper.owner.showHideRulers();
        this.documentHelper.owner.triggerResize();
    }
    /**
     * @returns {void}
     */
    private closePane = (): void => {
        this.isShowRestrictPane = false;
        this.restrictPane.style.display = 'none';
        this.documentHelper.owner.showHideRulers();
        this.documentHelper.owner.triggerResize();
    }
    private wireEvents(): void {
        this.addUser.addEventListener('click', this.addUserDialog.show);
        this.enforceProtection.addEventListener('click', this.protectDocument.bind(this));
        this.stopProtection.addEventListener('click', this.stopProtectionTriggered.bind(this));
        this.closeButton.addEventListener('click', this.closePane);
        this.allowFormat.addEventListener('change', this.enableFormatting.bind(this));
        this.protectionTypeDrop.addEventListener('change', this.protectionTypeDropChanges.bind(this));
        this.highlightCheckBox.addEventListener('change', this.highlightClicked.bind(this));
    }
    private changeHighlightOptions (): void {
        this.documentHelper.owner.documentEditorSettings.highlightEditableRanges = this.highlightCheckBox.checked;
        setTimeout((): void => {
            this.documentHelper.owner.focusIn();
        }, 10);
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private enableFormatting(args: any): void {
        this.documentHelper.restrictFormatting = !args.checked;
    }
    private stopProtectionTriggered(args: any): void {
        if ((isNullOrUndefined(this.documentHelper.saltValue) || this.documentHelper.saltValue === '')
            && (isNullOrUndefined(this.documentHelper.hashValue) || this.documentHelper.hashValue === '')) {
            this.documentHelper.owner.editorModule.unProtectDocument();
            return;
        }
        this.unProtectDialog.show();
    }
    private protectionTypeDropChanges(args: any): void {
        switch (args.value) {
            case 'Read only':
                this.protectionType = 'ReadOnly';
                this.userWholeDiv.style.display = 'block';
                //this.enforceProtection.style.marginLeft = '0px';
                this.contentDiv1.innerHTML = this.localObj.getConstant('Protected Document');
                this.contentDiv2.innerHTML = this.localObj.getConstant('ReadOnlyProtection');
                //this.contentDiv2.style.display = 'block';     
                this.previousProtectionType = args.previousItemData.Value;  
                break;
            case 'Filling in forms':
                this.protectionType = 'FormFieldsOnly';
                this.userWholeDiv.style.display = 'none';
                //this.enforceProtection.style.marginLeft = '8px';
                this.contentDiv1.innerHTML = this.localObj.getConstant('Protected Document');
                this.contentDiv2.innerHTML = this.localObj.getConstant('FormFieldsOnly');
                //this.contentDiv2.style.display = 'block';
                this.previousProtectionType = args.previousItemData.Value;
                this.showRemovedIgnoreDialog();
                break;
            case 'Comments':
                this.protectionType = 'CommentsOnly';
                this.userWholeDiv.style.display = 'block';
                //this.enforceProtection.style.marginLeft = '0px';
                this.contentDiv1.innerHTML = this.localObj.getConstant('Protected Document');
                this.contentDiv2.innerHTML = this.localObj.getConstant('CommentsOnly');
                //this.contentDiv2.style.display = 'none';
                this.previousProtectionType = args.previousItemData.Value;
                break;
            case 'Tracked changes':
                this.protectionType = 'RevisionsOnly';
                this.userWholeDiv.style.display = 'none';
                this.contentDiv1.innerHTML = this.localObj.getConstant('Protected Document');
                this.contentDiv2.innerHTML = this.localObj.getConstant('TrackChangesOnly');
                this.previousProtectionType = args.previousItemData.Value;
                this.showRemovedIgnoreDialog();
                break;
            default:
                this.protectionType = 'NoProtection';
                this.addedUser.uncheckAllItems();
                this.viewer.owner.editorModule.removeAllEditRestrictions();
                break;
        }
    }
    private showRemovedIgnoreDialog(): void {
        if (this.documentHelper.selection && this.documentHelper.editRanges.length > 0) {
            this.documentHelper.dialog.height = ' Auto';
            this.documentHelper.dialog.width = ' 600px';
            this.documentHelper.dialog.header = this.localObj.getConstant('Information');
            this.documentHelper.dialog.content = this.localObj.getConstant('RemovedIgnoreExceptions') + '<br>' + '<br>' + this.localObj.getConstant('RemovedIgnore');
            this.documentHelper.dialog.buttons = [{
                click: this.onYesButtonClick,
                buttonModel: { content: this.localObj.getConstant('Yes') }
            },
            {
                click: this.onCancelButtonClick,
                buttonModel: { content: this.localObj.getConstant('Cancel') }
            },
            {
                click: this.onNoButtonClick,
                buttonModel: { content: this.localObj.getConstant('No') }
            }];
            this.documentHelper.dialog.dataBind();
            this.documentHelper.dialog.show();
        }
    }
    private onYesButtonClick = (): void => {
        this.viewer.owner.editorModule.removeAllEditRestrictions();
        this.documentHelper.dialog.hide();
    }
    private onCancelButtonClick = (args: any): void => {
        this.protectionTypeDrop.value = this.previousProtectionType;
        this.documentHelper.dialog.hide();
    };
    private onNoButtonClick = (): void => {
        this.documentHelper.dialog.hide();
    };
    private selectHandler(args: any): void {
        if (args.isChecked) {
            this.viewer.owner.editorModule.insertEditRangeElement(args.text);
            args.event.target.classList.add('e-check');
        } else {
            this.viewer.owner.editorModule.removeUserRestrictions(args.text);
        }
    }
    public highlightClicked(args: any): void {
        this.documentHelper.selection.isHighlightEditRegion = args.checked;
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
    private protectDocument(): void {
        this.enforceProtectionDialog.show();
    }
    public createCheckBox(label: string, element: HTMLInputElement): CheckBox {
        let checkBox: CheckBox = new CheckBox({ label: label, enableRtl: this.documentHelper.owner.enableRtl });
        checkBox.appendTo(element);
        return checkBox;
    }
    public loadPaneValue(): void {
        // if (!this.isAddUser) {
        //     this.protectionType = this.documentHelper.protectionType;
        // }
        this.allowFormat.checked = !this.documentHelper.restrictFormatting;
        switch (this.documentHelper.protectionType) {
            case 'ReadOnly':
                this.protectionTypeDrop.value = 'Read only';
                break;
            case 'FormFieldsOnly':
                this.protectionTypeDrop.value = 'Filling in forms';
                break;
            case 'CommentsOnly':
                this.protectionTypeDrop.value = 'Comments';
                break;
            case 'RevisionsOnly':
                this.protectionTypeDrop.value = 'Tracked changes';
                break;
        }
        this.highlightCheckBox.checked = this.documentHelper.owner.documentEditorSettings.highlightEditableRanges;
        this.addedUser.enablePersistence = true;
        this.addedUser.dataSource = this.usersCollection.slice();
        this.addedUser.dataBind();
        this.showStopProtectionPane(this.documentHelper.isDocumentProtected);
    }
    public navigateNextRegion(): void {
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
        this.addedUser.dataSource = this.documentHelper.userCollection.slice();
        this.addedUser.dataBind();
    }
    /**
     * @returns {void}
     */
    public showAllRegion = (): void => {
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
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.addUserDialog) {
            this.addUserDialog.destroy();
        }
        this.addUserDialog = undefined;
        if (this.enforceProtectionDialog) {
            this.enforceProtectionDialog.destroy();
        }
        this.enforceProtectionDialog = undefined;
        if (this.unProtectDialog) {
            this.unProtectDialog.destroy();
        }
        this.unProtectDialog = undefined;
        if (this.base64) {
            this.base64.destroy();
        }
        this.base64 = undefined;
        if (this.addedUser) {
            this.addedUser.destroy();
            this.addedUser = undefined;
        }
        if (this.allowFormat) {
            this.allowFormat.destroy();
            this.allowFormat = undefined;
        }
        if (this.protectionTypeDrop) {
            this.protectionTypeDrop.destroy();
            this.protectionTypeDrop = undefined;
        }
        if (this.highlightCheckBox) {
            this.highlightCheckBox.destroy();
            this.highlightCheckBox = undefined;
        }
        if (this.addUser) {
            this.addUser.innerHTML = '';
            this.addUser.remove();
            this.addUser = undefined;
        }
        if (this.restrictPane) {
            this.restrictPane.innerHTML = '';
            this.restrictPane.remove();
            this.restrictPane = undefined;
        }
        if (this.enforceProtection) {
            this.enforceProtection.innerHTML = '';
            this.enforceProtection.remove();
            this.enforceProtection = undefined;
        }
        if (this.stopProtection) {
            this.stopProtection.innerHTML = '';
            this.stopProtection.remove();
            this.stopProtection = undefined;
        }
        if (this.stopProtectionDiv) {
            this.stopProtectionDiv.innerHTML = '';
            this.stopProtectionDiv.remove();
            this.stopProtectionDiv = undefined;
        }
        if (this.stopReadOnlyOptions) {
            this.stopReadOnlyOptions.innerHTML = '';
            this.stopReadOnlyOptions.remove();
            this.stopReadOnlyOptions = undefined;
        }
        if (this.contentDiv1) {
            this.contentDiv1.innerHTML = '';
            this.contentDiv1.remove();
            this.contentDiv1 = undefined;
        }
        if (this.contentDiv2) {
            this.contentDiv2.innerHTML = '';
            this.contentDiv2.remove();
            this.contentDiv2 = undefined;
        }
        if (this.closeButton) {
            this.closeButton.innerHTML = '';
            this.closeButton.remove();
            this.closeButton = undefined;
        }
        if (this.userWholeDiv) {
            this.userWholeDiv.innerHTML = '';
            this.userWholeDiv.remove();
            this.userWholeDiv = undefined;
        }
        if (this.restrictPaneWholeDiv) {
            this.restrictPaneWholeDiv.innerHTML = '';
            this.restrictPaneWholeDiv.remove();
            this.restrictPaneWholeDiv = undefined;
        }
        this.usersCollection = [];
        this.usersCollection = undefined;
        this.previousProtectionType = undefined;
        this.currentHashValue = undefined;
        this.currentSaltValue = undefined;
        this.documentHelper = undefined;
    }
}