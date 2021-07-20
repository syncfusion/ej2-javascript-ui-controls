import { DocumentHelper } from '../viewer';
import { L10n, createElement } from '@syncfusion/ej2-base';
import { ListView } from '@syncfusion/ej2-lists';
import { Button } from '@syncfusion/ej2-buttons';
import { DialogUtility } from '@syncfusion/ej2-popups';
/**
 * @private
 */
export class AddUserDialog {
    private documentHelper: DocumentHelper;
    private target: HTMLElement;
    private textBoxInput: HTMLInputElement;
    private userList: ListView;
    private addButton: Button;
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }

    public initUserDialog(localValue: L10n, isRtl?: boolean): void {
        const id: string = this.documentHelper.owner.containerId + '_addUser';
        this.target = createElement('div', { id: id, className: 'e-de-user-dlg' });
        const headerValue: string = localValue.getConstant('Enter User');
        const dlgFields: HTMLElement = createElement('div', { innerHTML: headerValue, className: 'e-bookmark-dlgfields' });
        this.target.appendChild(dlgFields);

        const commonDiv: HTMLElement = createElement('div', { className: 'e-de-user-dlg-common' });
        this.target.appendChild(commonDiv);

        const adduserDiv: HTMLElement = createElement('div', { className: 'e-de-user-dlg-list', styles: 'display:inline-flex' });
        commonDiv.appendChild(adduserDiv);
        if (isRtl) {
            adduserDiv.classList.add('e-de-rtl');
        }

        const textBoxDiv: HTMLElement = createElement('div', { className: 'e-de-user-dlg-textboxdiv' });
        adduserDiv.appendChild(textBoxDiv);
        this.textBoxInput = createElement('input', { className: 'e-input e-de-user-dlg-textbox-input', id: 'bookmark_text_box', attrs: { autofocus: 'true' } }) as HTMLInputElement;
        this.textBoxInput.setAttribute('type', 'text');
        textBoxDiv.appendChild(this.textBoxInput);
        this.textBoxInput.addEventListener('keyup', this.onKeyUpOnDisplayBox);

        const addButtonElement: HTMLElement = createElement('button', {
            innerHTML: localValue.getConstant('Add'), id: 'add',
            attrs: { type: 'button' }
        });
        adduserDiv.appendChild(addButtonElement);
        addButtonElement.addEventListener('click', this.addButtonClick);
        this.addButton = new Button({ cssClass: 'e-de-user-add-btn' });
        this.addButton.disabled = true;
        this.addButton.appendTo(addButtonElement);
        this.addButton.addEventListener('click', this.addButtonClick);
        const userCollectionDiv: HTMLElement = createElement('div');
        commonDiv.appendChild(userCollectionDiv);
        const userDiv: HTMLElement = createElement('div', { innerHTML: localValue.getConstant('Users'), className: 'e-de-user-dlg-user' });
        userCollectionDiv.appendChild(userDiv);
        const listviewDiv: HTMLElement = createElement('div', { id: 'user_listView' });
        userCollectionDiv.appendChild(listviewDiv);

        this.userList = new ListView({
            cssClass: 'e-de-user-listview'
        });

        this.userList.appendTo(listviewDiv);


    }
    /**
     * @private
     * @returns {void}
     */
    public show = (): void => {
        const localObj: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localObj.setLocale(this.documentHelper.owner.locale);
        if (!this.target) {
            this.initUserDialog(localObj, this.documentHelper.owner.enableRtl);
        }
        this.documentHelper.dialog.header = localObj.getConstant('Add Users');
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.beforeOpen = this.loadUserDetails;
        this.documentHelper.dialog.close = this.documentHelper.updateFocus;
        this.documentHelper.dialog.buttons = [
            {
                click: this.okButtonClick,
                buttonModel: {
                    content: localObj.getConstant('Ok'), cssClass: 'e-flat', isPrimary: true
                }
            },
            {
                click: this.hideDialog,
                buttonModel: { content: localObj.getConstant('Cancel'), cssClass: 'e-flat' }
            }, {
                click: this.deleteButtonClick,
                buttonModel: { content: localObj.getConstant('Delete'), cssClass: 'e-flat e-user-delete' }
            }];
        this.documentHelper.dialog.dataBind();
        this.documentHelper.dialog.show();
    };

    /**
     * @private
     * @returns {void}
     */
    public loadUserDetails = (): void => {
        this.userList.dataSource = this.documentHelper.userCollection.slice();
        this.userList.dataBind();
        this.documentHelper.restrictEditingPane.addedUser.dataSource = this.documentHelper.userCollection.slice();
        this.documentHelper.restrictEditingPane.addedUser.dataBind();
    };
    /**
     * @private
     * @returns {void}
     */
    public okButtonClick = (): void => {
        this.documentHelper.restrictEditingPane.isAddUser = true;
        this.documentHelper.restrictEditingPane.showStopProtectionPane(false);
        this.documentHelper.restrictEditingPane.addUserCollection();
        this.documentHelper.restrictEditingPane.isAddUser = false;
        this.documentHelper.dialog.hide();
    };

    /**
     * @private
     * @returns {void}
     */
    public hideDialog = (): void => {
        this.textBoxInput.value = '';
        this.documentHelper.dialog.hide();
    };

    /**
     * @private
     * @returns {void}
     */
    public onKeyUpOnDisplayBox = (): void => {
        this.addButton.disabled = this.textBoxInput.value === '';
    };
    /**
     * @returns {void}
     */
    public addButtonClick = (): void => {
        if (this.validateUserName(this.textBoxInput.value)) {
            if (this.documentHelper.userCollection.indexOf(this.textBoxInput.value) === -1) {
                this.documentHelper.userCollection.push(this.textBoxInput.value);
            }
            this.userList.dataSource = this.documentHelper.userCollection.slice();
            this.userList.dataBind();
            this.textBoxInput.value = '';
        } else {
            DialogUtility.alert('Invalid user name');
        }
    };

    public validateUserName(value: string): boolean {
        if (value.indexOf('@') === -1) {
            return false;
        } else {
            const parts: string[] = value.split('@');
            const domain: string = parts[1];
            if (domain.indexOf('.') === -1) {
                return false;
            } else {
                const domainParts: string[] = domain.split('.');
                const ext: string = domainParts[1];
                if (domainParts.length > 2) {
                    return false;
                }
                if (ext.length > 4 || ext.length < 2) {
                    return false;
                }
            }

        }

        return true;

    }

    /**
     * @returns {void}
     */
    public deleteButtonClick = (): void => {
        const index: number = this.documentHelper.userCollection.indexOf(this.userList.getSelectedItems().text as string);
        if (index > -1) {
            this.documentHelper.userCollection.splice(index, 1);
            this.userList.dataSource = this.documentHelper.userCollection.slice();
            this.userList.dataBind();
        }
    };
}
