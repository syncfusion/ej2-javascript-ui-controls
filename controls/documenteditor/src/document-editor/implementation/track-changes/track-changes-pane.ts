import { createElement, L10n, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../document-editor';
import { Toolbar } from '@syncfusion/ej2-navigations';
import { Revision } from './track-changes';
import { CommentReviewPane } from '../comments';
import { Button } from '@syncfusion/ej2-buttons';
import { DropDownButtonModel, DropDownButton, MenuEventArgs, ItemModel, OpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { TextElementBox, ElementBox, ImageElementBox, FieldElementBox, TextFormField, DropDownFormField, CheckBoxFormField, ParagraphWidget } from '../viewer/page';
import { WRowFormat, WCharacterFormat } from '../index';
import { HelperMethods } from '../editor/editor-helper';
import { Dictionary } from '../../base/index';
/**
 * Track changes pane
 */
export class TrackChangesPane {
    /***
     * @private
     */
    public isChangesTabVisible: boolean;
    private owner: DocumentEditor;
    private trackChangeDiv: HTMLElement;
    private toolbarElement: HTMLElement;
    private noChangeDivElement: HTMLElement;
    /**
     * @private
     */
    public toolbar: Toolbar;
    public changesInfoDiv: HTMLElement;
    private locale: L10n;
    private commentReviewPane: CommentReviewPane;
    private userDropDownitems: ItemModel[];
    private userDropDownButton: DropDownButton;
    private viewTypeDropDownButton: DropDownButton;
    private userDropDown: DropDownButtonModel;
    private selectedUser: string;
    private selectedType: string;
    private users: string[] = [];
    private menuoptionEle: HTMLElement;
    private menuDropDownButton: DropDownButton;
    private enableButtons: boolean = true;
    private currentSelectedRevisionInternal: Revision;
    private viewTypeitems: ItemModel[] = [];
    public changes: Dictionary<Revision, ChangesSingleView>;
    public revisions: Revision[];
    private sortedRevisions: Revision[] = [];
    private noChangesVisibleInternal: boolean = true;
    public isTrackingPageBreak: boolean = false;

    public get setNoChangesVisibility(): boolean {
        return this.noChangesVisibleInternal;
    }

    public set setNoChangesVisibility(visible: boolean) {
        this.isChangesTabVisible = !visible;
        this.noChangeDivElement.style.display = visible ? 'block' : 'none';
        this.noChangesVisibleInternal = visible;
        this.enableDisableToolbarItem(!visible);
        this.commentReviewPane.reviewTab.hideTab(1, visible);
        this.owner.notify('reviewPane', {changes: !visible, comment: this.commentReviewPane.isCommentTabVisible});
    }


    public get currentSelectedRevision(): Revision {
        return this.currentSelectedRevisionInternal;
    }

    public set currentSelectedRevision(value: Revision) {
        let selectedElement: HTMLElement = select('.e-de-trckchanges-inner-select', this.changesInfoDiv);
        if (isNullOrUndefined(value)) {
            if (!isNullOrUndefined(selectedElement)) {
                selectedElement.classList.remove('e-de-trckchanges-inner-select');
            }
        } else if (value !== this.currentSelectedRevisionInternal || isNullOrUndefined(selectedElement)) {
            if (selectedElement) {
                selectedElement.classList.remove('e-de-trckchanges-inner-select');
            }
            if (this.changes.length > 0 && this.changes.containsKey(value)) {
                const currentChangeView: ChangesSingleView = this.changes.get(value);
                currentChangeView.singleInnerDiv.classList.add('e-de-trckchanges-inner-select');
            }
        }
        this.currentSelectedRevisionInternal = value;
        selectedElement = select('.e-de-trckchanges-inner-select', this.changesInfoDiv);
        if (!isNullOrUndefined(selectedElement)) {
            selectedElement.parentElement.scrollIntoView({ block: 'nearest' });
        }
    }


    public constructor(owner: DocumentEditor, commentReviewPane: CommentReviewPane) {
        this.owner = owner;
        this.commentReviewPane = commentReviewPane;
        this.locale = new L10n('documenteditor', this.owner.defaultLocale);
        this.locale.setLocale(this.owner.locale);
        this.selectedUser = this.locale.getConstant('All');
        this.selectedType = this.locale.getConstant('All');
        this.initTrackChangePane();
        this.commentReviewPane.reviewTab.items[1].content = this.trackChangeDiv;
    }

    private initTrackChangePane(): void {
        this.changes = new Dictionary<Revision, ChangesSingleView>();
        this.trackChangeDiv = createElement('div', { className: 'e-de-tc-pane' });
        this.trackChangeDiv.appendChild(this.initPaneHeader());
        this.changesInfoDiv = createElement('div', { id: 'e-de-tc-pane-revision', styles: 'overflow:auto' });
        this.trackChangeDiv.appendChild(this.changesInfoDiv);
        this.noChangeDivElement = createElement('div', { styles: 'display:none;', className: 'e-de-tc-no-chng' });
        this.noChangeDivElement.textContent = this.locale.getConstant('No changes');
        this.changesInfoDiv.appendChild(this.noChangeDivElement);
        this.updateTrackChanges();

    }

    private initPaneHeader(): HTMLElement {
        this.toolbarElement = createElement('div', { className: 'e-de-track-toolbar' });
        this.toolbar = new Toolbar({
            enableRtl: this.owner.enableRtl,
            items: [
                {
                    template: this.locale.getConstant('User') + ':', cssClass: 'e-de-track-toolbar-overlay', disabled: true
                },
                {
                    template: createElement('div', { id: 'e-de-user-list' })
                },
                {
                    type: 'Separator'
                },
                {
                    template: this.locale.getConstant('View') + ':', cssClass: 'e-de-track-toolbar-overlay', disabled: true
                },
                {
                    template: createElement('div', { id: 'e-de-revision-list' })
                },
                {
                    prefixIcon: 'e-de-nav-left-arrow e-de-tc-tbr', align: 'Right', cssClass: 'e-de-nvgte-left',
                    tooltipText: this.locale.getConstant('Previous Changes'), click: this.navigatePreviousChanges.bind(this)
                },
                {
                    prefixIcon: 'e-de-nav-right-arrow e-de-tc-tbr', align: 'Right', cssClass: 'e-de-nvgte-right',
                    tooltipText: this.locale.getConstant('Next Changes'), click: this.navigateNextChanges.bind(this)
                },
                {
                    template: createElement('div', { id: 'e-de-menu-option' }), align: 'Right', cssClass: 'e-de-tc-tbr',
                    tooltipText: this.locale.getConstant('More Options') + '...'
                }]
        });
        this.toolbar.appendTo(this.toolbarElement);
        const navigateLeftButton: HTMLElement = select('.e-de-nvgte-left', this.toolbarElement);
        (navigateLeftButton.firstChild as HTMLElement).classList.add('e-tc-nvgte');
        const navigateRightButton: HTMLElement = select('.e-de-nvgte-right', this.toolbarElement);
        (navigateRightButton.firstChild as HTMLElement).classList.add('e-tc-nvgte');

        //User list drop down button
        const userButtonEle: HTMLElement = select('#e-de-user-list', this.toolbarElement);
        this.userDropDownitems = [{ text: this.locale.getConstant('All') }];
        this.userDropDown = {
            items: this.userDropDownitems,
            cssClass: 'e-de-track-pane-drop-btn e-tc-btn-bg-clr',
            select: this.onUserSelect.bind(this),
            beforeOpen: this.onUserOpen.bind(this),
            beforeItemRender: (args: MenuEventArgs) => {
                this.beforeDropDownItemRender(args, this.selectedUser);
            }
        };
        this.userDropDownButton = new DropDownButton(this.userDropDown);
        this.userDropDownButton.appendTo(userButtonEle);
        this.userDropDownButton.content = this.getSpanView(this.userDropDown.items[0].text, 0);

        //Revision view type drop down button
        const viewTypeEle: HTMLElement = select('#e-de-revision-list', this.toolbarElement);
        this.viewTypeitems = [{ text: this.locale.getConstant('All') }, { text: this.locale.getConstant('Inserted') }, { text: this.locale.getConstant('Deleted') }];

        this.viewTypeDropDownButton = new DropDownButton({
            items: this.viewTypeitems,
            cssClass: 'e-de-track-pane-drop-btn e-tc-btn-bg-clr',
            select: this.onTypeSelect.bind(this),
            beforeItemRender: (args: MenuEventArgs) => {
                this.beforeDropDownItemRender(args, this.selectedType);
            }
        });
        this.viewTypeDropDownButton.content = this.getSpanView(this.viewTypeitems[0].text, 1);
        this.viewTypeDropDownButton.appendTo(viewTypeEle);

        //More menu option drop down button
        this.menuoptionEle = select('#e-de-menu-option', this.toolbarElement);
        const menuOptions: ItemModel[] = [{ text: this.locale.getConstant('Accept all') }, { text: this.locale.getConstant('Reject all') }];
        const menuDropDown: DropDownButtonModel = {
            items: menuOptions,
            select: this.onMenuSelect.bind(this),
            iconCss: 'e-de-menu-icon',
            cssClass: 'e-caret-hide e-tc-btn-bg-clr'
        };
        this.menuDropDownButton = new DropDownButton(menuDropDown);
        this.menuDropDownButton.appendTo(this.menuoptionEle);

        return this.toolbarElement;
    }

    private beforeDropDownItemRender(args: MenuEventArgs, content: string): void {
        args.element.innerHTML = '<span></span>' + args.item.text;
        const span: HTMLElement = args.element.children[0] as HTMLElement;
        if (args.item.text === content) {
            span.style.marginRight = '10px';
            span.style.alignSelf = 'center';
            span.setAttribute('class', 'e-de-selected-item e-icons');
        } else {
            (args.element.children[0] as HTMLElement).style.marginRight = '25px';
            (args.element.children[0] as HTMLElement).classList.remove('e-de-selected-item');
        }
    }

    private onUserOpen(arg: OpenCloseMenuEventArgs): void {
        const ele: HTMLElement = arg.element;
        ele.style.maxHeight = '200px';
        ele.style.overflowY = 'auto';
    }

    private enableDisableToolbarItem(enable: boolean): void {
        const elements: NodeListOf<Element> = this.toolbar.element.querySelectorAll('.e-de-tc-tbr');
        if (this.owner && this.owner.viewer) {
            this.toolbar.enableItems(elements[0].parentElement.parentElement, enable);
            this.toolbar.enableItems(elements[1].parentElement.parentElement, enable);
            this.toolbar.enableItems(elements[2] as HTMLElement, enable);
        }
    }

    private getSpanView(value: string, type: number): string {
        return (type === 0 ? '<span class="e-de-track-span-user">' : '<span class="e-de-track-span-view">') + value + '</span>';
    }

    private onMenuSelect(arg: MenuEventArgs): void {
        const selectedText: string = arg.item.text;
        if (selectedText.match(this.locale.getConstant('Accept all'))) {
            setTimeout(() => {
                this.owner.revisionsInternal.handleRevisionCollection(true, this.sortedRevisions);
            }, 0);
        } else if (selectedText.match(this.locale.getConstant('Reject all'))) {
            setTimeout(() => {
                this.owner.revisionsInternal.handleRevisionCollection(false, this.sortedRevisions);
                /* eslint-disable */
            }, 0);
        }
        this.updateUsers();
    }

    public onSelection(revision: Revision): void {
        this.currentSelectedRevision = revision;
    }

    private onUserSelect(arg: MenuEventArgs): void {
        let selectedText: string = arg.item.text;
        this.selectedUser = selectedText;
        this.userDropDownButton.content = this.getSpanView(selectedText, 0);
        this.sortCollectionToDisplay();
    }

    private onTypeSelect(arg: MenuEventArgs): void {
        let selectedText: string = arg.item.text;
        this.selectedType = selectedText;
        this.viewTypeDropDownButton.content = this.getSpanView(selectedText, 1);
        this.sortCollectionToDisplay();
    }

    private updateMenuOptions(): void {
        let revisionType: string;
        if (this.selectedType !== this.locale.getConstant('All')) {
            revisionType = this.selectedType === this.locale.getConstant('Inserted') ? this.locale.getConstant('Insertion')
                : this.locale.getConstant('Deletion');
        }
        if (this.selectedUser === this.locale.getConstant('All') && this.selectedType === this.locale.getConstant('All')) {
            this.menuDropDownButton.items[0].text = this.locale.getConstant('Accept all') + ' ' + this.locale.getConstant('Changes');
            this.menuDropDownButton.items[1].text = this.locale.getConstant('Reject all') + ' ' + this.locale.getConstant('Changes');
        } else if (this.selectedUser === this.locale.getConstant('All') && this.selectedType !== this.locale.getConstant('All')) {
            this.menuDropDownButton.items[0].text = this.locale.getConstant('Accept all') + ' ' + revisionType;
            this.menuDropDownButton.items[1].text = this.locale.getConstant('Reject all') + ' ' + revisionType;
        } else if (this.selectedUser !== this.locale.getConstant('All') && this.selectedType === this.locale.getConstant('All')) {
            this.menuDropDownButton.items[0].text = this.locale.getConstant('Accept all') + ' ' + this.locale.getConstant('Changes') +
                ' ' + this.locale.getConstant('By').toLowerCase() + ' ' + this.selectedUser;
            this.menuDropDownButton.items[1].text = this.locale.getConstant('Reject all') + ' ' + this.locale.getConstant('Changes') +
                ' ' + this.locale.getConstant('By').toLowerCase() + ' ' + this.selectedUser;
        } else {
            this.menuDropDownButton.items[0].text = this.locale.getConstant('Accept all') + ' ' + revisionType +
                ' ' + this.locale.getConstant('By').toLowerCase() + ' ' + this.selectedUser;
            this.menuDropDownButton.items[1].text = this.locale.getConstant('Reject all') + ' ' + revisionType +
                ' ' + this.locale.getConstant('By').toLowerCase() + ' ' + this.selectedUser;
        }
    }

    private sortCollectionToDisplay(): void {
        let isRevisionVisible: boolean = false;
        this.sortedRevisions = [];
        this.updateMenuOptions();
        for (let i: number = 0; i < this.changes.length; i++) {
            let changes: ChangesSingleView = this.changes.get(this.revisions[i]);
            let singleChangesDiv: HTMLElement = changes.outerSingleDiv;
            if (this.selectedUser === this.locale.getConstant('All') && this.selectedType === this.locale.getConstant('All')) {
                singleChangesDiv.style.display = 'block';
                isRevisionVisible = true;
            } else if (this.selectedUser === this.locale.getConstant('All') && this.selectedType !== this.locale.getConstant('All')) {
                if (changes.revisionType === this.selectedType) {
                    singleChangesDiv.style.display = 'block';
                    isRevisionVisible = true;
                } else {
                    singleChangesDiv.style.display = 'none';
                }
            } else if (this.selectedUser !== this.locale.getConstant('All') && this.selectedType === this.locale.getConstant('All')) {
                if (changes.user === this.selectedUser) {
                    singleChangesDiv.style.display = 'block';
                    isRevisionVisible = true;
                } else {
                    singleChangesDiv.style.display = 'none';
                }
            } else {
                if (changes.user === this.selectedUser && changes.revisionType === this.selectedType) {
                    singleChangesDiv.style.display = 'block';
                    isRevisionVisible = true;
                } else {
                    singleChangesDiv.style.display = 'none';
                }
            }
            if (singleChangesDiv.style.display === 'block') {
                this.sortedRevisions.push(this.revisions[i]);
            }
        }
        this.setNoChangesVisibility = !isRevisionVisible;
    }

    public enableDisableButton(enableButton: boolean): void {
        this.enableButtons = enableButton;
        this.updateTrackChanges();
    }

    public updateTrackChanges(show?: boolean): void {
        if (show || isNullOrUndefined(show)) {
            this.removeAllChanges();
            if (!this.enableButtons && !this.menuoptionEle.classList.contains('e-de-overlay')) {
                this.menuoptionEle.classList.add('e-de-overlay');
            } else if (this.menuoptionEle.classList.contains('e-de-overlay')) {
                this.menuoptionEle.classList.remove('e-de-overlay');
            }
            this.isChangesTabVisible = true;
            this.owner.notify('reviewPane', { comment: this.commentReviewPane.isCommentTabVisible, changes: this.isChangesTabVisible});
            for (let i: number = 0; i < this.owner.revisions.changes.length; i++) {
                let revision: Revision = this.owner.revisions.changes[i];
                this.addChanges(revision);
            }
            this.sortCollectionToDisplay();
            this.updateUsers();
            if (show) {
                this.currentSelectedRevision = this.currentSelectedRevisionInternal;
                this.updateHeight();
                this.owner.resize();
            }
        } else {
            this.currentSelectedRevision = undefined;
        }

    }

    public updateUsers(): void {
        if (this.users.length > 0) {
            this.userDropDownButton.removeItems(this.users);
            this.users = [];
        }
        for (let i: number = 0; i < this.revisions.length; i++) {
            if (this.users.indexOf(this.revisions[i].author) === -1) {
                this.users.push(this.revisions[i].author);
                this.userDropDownButton.items.push({ text: this.revisions[i].author });
            }
        }
    }

    public updateHeight(): void {
        let tabHeaderHeight: number = this.commentReviewPane.reviewTab.getRootElement().getElementsByClassName('e-tab-header')[0].getBoundingClientRect().height;
        this.changesInfoDiv.style.height = this.commentReviewPane.parentPaneElement.clientHeight - this.toolbarElement.clientHeight
            - tabHeaderHeight - 2 + 'px';
    }

    private removeAllChanges(): void {
        while (this.changesInfoDiv.childNodes.length > 1) {
            this.changesInfoDiv.removeChild(this.changesInfoDiv.lastChild);
        }
        this.revisions = [];
        this.changes.clear();
    }
    /**
     * @private
     */
    public clear(): void {
        this.removeAllChanges();
        this.selectedUser = this.locale.getConstant('All');
        this.userDropDownButton.content = this.getSpanView(this.selectedUser, 0);
        this.selectedType = this.locale.getConstant('All');
        this.viewTypeDropDownButton.content = this.getSpanView(this.selectedType, 1);
        this.currentSelectedRevision = undefined;
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.removeAllChanges();
        if (this.toolbar) {
            this.toolbar.destroy();
        }
        if (this.userDropDownButton) {
            this.userDropDownButton.destroy();
        }
        if (this.menuDropDownButton) {
            this.menuDropDownButton.destroy();
            this.menuDropDownButton = undefined;
        }

        if (this.viewTypeDropDownButton) {
            this.viewTypeDropDownButton.destroy();
        }
        if (this.menuDropDownButton) {
            this.menuDropDownButton.destroy();
            this.menuDropDownButton = undefined;
        }
        if (this.userDropDown) {
            this.userDropDown = undefined;
        }
        if (this.users.length > 0) {
            this.users = [];
        }
        if (this.trackChangeDiv) {
            this.trackChangeDiv = undefined;
        }

    }

    private addChanges(revision: Revision): void {
        let currentChangeView: ChangesSingleView = new ChangesSingleView(this.owner, this);
        this.changesInfoDiv.appendChild(currentChangeView.createSingleChangesDiv(revision));
        if (!this.enableButtons) {
            if (!(currentChangeView.acceptButtonElement.classList.contains('e-de-overlay'))) {
                currentChangeView.acceptButtonElement.classList.add('e-de-overlay');
                currentChangeView.rejectButtonElement.classList.add('e-de-overlay');
            }

        } else if (currentChangeView.acceptButtonElement.classList.contains('e-de-overlay')) {
            currentChangeView.acceptButtonElement.classList.remove('e-de-overlay');
            currentChangeView.rejectButtonElement.classList.remove('e-de-overlay');
        }
        this.revisions.push(revision);
        this.changes.add(revision, currentChangeView);
    }

    private navigatePreviousChanges(): void {
        this.owner.selection.navigatePreviousRevision();
    }

    private navigateNextChanges(): void {
        this.owner.selection.navigateNextRevision();
    }
}

export class ChangesSingleView {
    private trackChangesPane: TrackChangesPane;
    private locale: L10n;
    private owner: DocumentEditor;
    public outerSingleDiv: HTMLElement;
    public user: string;
    public revisionType: string;
    public revision: Revision;
    public singleInnerDiv: HTMLElement;
    public acceptButtonElement: HTMLButtonElement;
    public rejectButtonElement: HTMLButtonElement;


    public constructor(owner: DocumentEditor, trackChangesPane: TrackChangesPane) {
        this.owner = owner;
        this.locale = new L10n('documenteditor', this.owner.defaultLocale);
        this.locale.setLocale(this.owner.locale);
        this.trackChangesPane = trackChangesPane;
    }


    public createSingleChangesDiv(revision: Revision): HTMLElement {
        this.revision = revision;
        this.user = revision.author;
        this.outerSingleDiv = createElement('div', { className: 'e-de-tc-outer' });
        this.singleInnerDiv = createElement('div', { className: 'e-de-trckchanges-inner' });
        this.singleInnerDiv.addEventListener('click', this.selectRevision.bind(this));
        this.outerSingleDiv.appendChild(this.singleInnerDiv);
        let userNameTotalDiv: HTMLElement = createElement('div', { className: 'e-de-track-usernme-div' });
        let userNameLabel: HTMLElement = createElement('div', { innerHTML: revision.author, className: 'e-de-track-user-nme' });
        if (!isNullOrUndefined(revision.author)) {
            userNameTotalDiv.style.display = 'flex';
            this.owner.documentHelper.getAvatar(userNameTotalDiv, userNameLabel, undefined, revision);
        }

        let revisionTypeLabel: HTMLElement = createElement('div');
        if (revision.revisionType === 'Insertion') {
            this.revisionType = 'Inserted';
            revisionTypeLabel.innerHTML = this.locale.getConstant('Inserted').toUpperCase();
            revisionTypeLabel.classList.add('e-de-track-insert');
        } else if (revision.revisionType === 'Deletion') {
            this.revisionType = 'Deleted';
            revisionTypeLabel.innerHTML = this.locale.getConstant('Deleted').toUpperCase();
            revisionTypeLabel.classList.add('e-de-track-delete');
        } else if (revision.revisionType === 'MoveFrom') {
            this.revisionType = 'MoveFrom';
            revisionTypeLabel.innerHTML = this.locale.getConstant('Move From').toUpperCase();
            revisionTypeLabel.classList.add('e-de-track-delete');
            revisionTypeLabel.style.whiteSpace = 'nowrap';
        } else if (revision.revisionType === 'MoveTo') {
            this.revisionType = 'MoveTo';
            revisionTypeLabel.innerHTML = this.locale.getConstant('Move To').toUpperCase();
            revisionTypeLabel.classList.add('e-de-track-insert');
            revisionTypeLabel.style.whiteSpace = 'nowrap';
        }
        userNameTotalDiv.appendChild(revisionTypeLabel);
        this.singleInnerDiv.appendChild(userNameTotalDiv);
        let dateView: HTMLElement = createElement('div', {
            className: 'e-de-track-date',
            innerHTML: HelperMethods.getModifiedDate(revision.date)
        });
        this.singleInnerDiv.appendChild(dateView);

        let changesTextDiv: HTMLElement = createElement('div', {
            className: 'e-de-track-chngs-text'
        });
        this.layoutElementText(revision.range, changesTextDiv);
        this.singleInnerDiv.appendChild(changesTextDiv);

        let buttonTotalDiv: HTMLElement = createElement('div', {
            styles: 'display:inline-block;width:100%'
        });
        this.singleInnerDiv.appendChild(buttonTotalDiv);

        let buttonDiv: HTMLElement = createElement('div', {
            styles: 'float:left;'
        });
        this.acceptButtonElement = createElement('button', { className: 'e-de-track-accept-button' }) as HTMLButtonElement;
        let acceptButton: Button = new Button({ cssClass: 'e-outline', content: this.locale.getConstant('Accept') });
        buttonDiv.appendChild(this.acceptButtonElement);
        buttonTotalDiv.appendChild(buttonDiv);
        acceptButton.appendTo(this.acceptButtonElement);
        this.acceptButtonElement.addEventListener('click', this.acceptButtonClick.bind(this));

        buttonDiv = createElement('div', {
            styles: 'float:left;'
        });
        this.rejectButtonElement = createElement('button', { className: 'e-de-track-reject-button' }) as HTMLButtonElement;
        let rejectButton: Button = new Button({ cssClass: 'e-outline', content: this.locale.getConstant('Reject') });
        buttonDiv.appendChild(this.rejectButtonElement);
        buttonTotalDiv.appendChild(buttonDiv);
        rejectButton.appendTo(this.rejectButtonElement);
        this.rejectButtonElement.addEventListener('click', this.rejectButtonClick.bind(this));

        let changesCount: HTMLElement = createElement('div', { className: 'e-de-track-chngs-count', styles: 'float:right;' });
        let currentCount: number = this.owner.revisions.changes.indexOf(revision) + 1;
        let totalCount: number = this.owner.revisions.changes.length;
        changesCount.innerHTML = this.locale.getConstant('Changes') + ' ' + currentCount.toString() +
            ' ' + this.locale.getConstant('of') + ' ' + totalCount.toString();
        buttonTotalDiv.appendChild(changesCount);

        return this.outerSingleDiv;
    }

    private selectRevision(): void {
        this.owner.selection.selectRevision(this.revision);
        this.trackChangesPane.onSelection(this.revision);
    }

    private layoutElementText(range: object[], changesText: HTMLElement): void {
        changesText.style.width = '100%';
        let text: string = '';
        let toSkip: boolean = false;
        for (let i: number = 0; i < range.length; i++) {
            let element: ElementBox = range[i] as ElementBox;
            if (element instanceof FieldElementBox && element.fieldType === 1) {
                toSkip = false;
                continue;
            }
            if (toSkip) {
                continue;
            }
            if (element instanceof FieldElementBox && element.fieldType === 0) {
                toSkip = true;
            }

            if (element instanceof TextElementBox) {
                text += element.text;
            } else if (element instanceof FieldElementBox && element.fieldType === 0) {
                let fieldCode: string = this.owner.selection.getFieldCode(element);
                if (fieldCode.match('TOC ') || fieldCode.match('Toc')) {
                    text += '<Table of Content>';
                    changesText.appendChild(this.addSpan(text));
                    return;
                } else if (fieldCode.match('HYPERLINK ') || fieldCode.match('MERGEFIELD') || fieldCode.match('FORMTEXT') || fieldCode.match('PAGE ')) {
                    text += this.owner.editor.retrieveFieldResultantText(element.fieldEnd);
                } else if (element.formFieldData) {
                    let emptyChar: string = this.owner.documentHelper.textHelper.repeatChar(
                        this.owner.documentHelper.textHelper.getEnSpaceCharacter(), 5);
                    if (text !== '') {
                        changesText.appendChild(this.addSpan(text));
                        text = '';
                    }
                    if (element.formFieldData instanceof TextFormField) {
                        changesText.appendChild(this.addSpan(element.formFieldData.defaultValue === '' ? emptyChar : element.formFieldData.defaultValue, 'e-de-tc-field'));
                    } else if (element.formFieldData instanceof DropDownFormField) {
                        changesText.appendChild(this.addSpan(element.formFieldData.dropdownItems.length > 0 ? element.formFieldData.dropdownItems[0] : emptyChar, 'e-de-tc-field'));
                    } else {
                        changesText.appendChild(this.addSpan((element.formFieldData as CheckBoxFormField).checked ? String.fromCharCode(9745) : String.fromCharCode(9744), 'e-de-tc-field'));
                    }
                }
            } else if (element instanceof ImageElementBox) {
                if (text !== '') {
                    changesText.appendChild(this.addSpan(text));
                    text = '';
                }
                let imageEle: HTMLImageElement = createElement('img') as HTMLImageElement;
                imageEle.setAttribute('src', element.imageString);
                imageEle.classList.add('e-de-tc-shrink-img');
                changesText.appendChild(imageEle);
            } else if (element instanceof WRowFormat) {
                let tableEle: HTMLTableElement = createElement('table') as HTMLTableElement;
                tableEle.classList.add('e-de-track-chng-table');
                tableEle.insertRow();
                for (let i: number = 0; i < element.ownerBase.childWidgets.length; i++) {
                    tableEle.rows[0].insertCell();
                    tableEle.rows[0].cells[i].classList.add('e-de-tc-tble-cell');
                }
                changesText.appendChild(tableEle);
                return;
            } else if (element instanceof WCharacterFormat) {
                if (text !== '') {
                    changesText.appendChild(this.addSpan(text));
                    text = '';
                }
                let paraMark: string = '¶';
                if (element.ownerBase instanceof ParagraphWidget && (element.ownerBase as ParagraphWidget).isEndsWithPageBreak) {
                    paraMark = '............Page Break............' + paraMark;
                }
                changesText.appendChild(this.addSpan(paraMark, 'e-de-tc-pmark'));
                changesText.appendChild(createElement('br'));
            }
        }
        changesText.appendChild(this.addSpan(text));
    }

    private addSpan(text: string, cssClass?: string): HTMLSpanElement {
        let span: HTMLSpanElement = createElement('span') as HTMLSpanElement;
        span.textContent = text;
        if (cssClass) {
            span.classList.add(cssClass);
        }
        return span;
    }

    private acceptButtonClick(): void {
        this.trackChangesPane.changesInfoDiv.removeChild(this.outerSingleDiv);
        this.removeFromParentCollec();
        this.revision.accept();
    }

    private rejectButtonClick(): void {
        this.trackChangesPane.changesInfoDiv.removeChild(this.outerSingleDiv);
        this.removeFromParentCollec();
        this.revision.reject();
    }

    private removeFromParentCollec(): void {
        this.trackChangesPane.changes.remove(this.revision);
        this.trackChangesPane.revisions.splice(this.trackChangesPane.revisions.indexOf(this.revision), 1);
        if (this.trackChangesPane.changes.length === 0) {
            this.trackChangesPane.setNoChangesVisibility = true;
        }
        this.trackChangesPane.updateUsers();
    }
}