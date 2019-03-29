import { EventHandler, closest, isNullOrUndefined, KeyboardEvents, KeyboardEventArgs, createElement } from '@syncfusion/ej2-base';
import { getValue, addClass, removeClass, remove } from '@syncfusion/ej2-base';
import { TextBox, ChangedEventArgs } from '@syncfusion/ej2-inputs';
import { IFileManager, ITreeView, NotifyArgs, ReadArgs } from '../base/interface';
import { DropDownButton, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { Search, read } from '../common/operations';
import { getLocaleText } from '../common/utility';
import * as events from '../base/constant';
import * as CLS from '../base/classes';

/**
 * BreadCrumbBar module
 */
export class BreadCrumbBar {

    /* Internal variables */
    private parent: IFileManager;
    public addressPath: string = '';
    public addressBarLink: string = '';
    private treeView: ITreeView;
    public searchObj: TextBox;
    private subMenuObj: DropDownButton;
    private keyboardModule: KeyboardEvents;
    private keyConfigs: { [key: string]: string };
    /**
     * constructor for addressbar module
     * @hidden
     */
    constructor(parent?: IFileManager) {
        this.parent = parent;
        this.treeView = this.parent.navigationpaneModule;
        this.keyConfigs = {
            enter: 'enter'
        };
        this.render();
    }
    private onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            return;
        }
        for (let prop of Object.keys(e.newProp)) {
            switch (prop) {
                case 'searchSettings':
                    if (!isNullOrUndefined(e.newProp.searchSettings.allowSearchOnTyping)) {
                        this.searchEventBind(e.newProp.searchSettings.allowSearchOnTyping);
                    }
                    break;
            }
        }
    }
    private render(): void {
        this.addEventListener();
    }
    public onPathChange(): void {
        let rootName: string = getValue('name', getValue('/', this.parent.feParent));
        if (!this.addressBarLink) {
            this.addressPath = rootName + this.parent.path;
        } else {
            this.addressPath = this.addressBarLink;
        }
        let addressPath: string = this.addressPath;
        let newPath: string = addressPath.substring(addressPath.indexOf('/'), addressPath.length);
        this.parent.setProperties({ path: newPath }, true);
        let arrayOfAddressBar: string[] = [];
        arrayOfAddressBar = addressPath.split('/');
        let addressbarUL: HTMLElement = null;
        addressbarUL = this.parent.createElement('ul');
        addressbarUL.setAttribute('class', 'e-addressbar-ul');
        let addressbarLI: HTMLElement = null;
        let countOfAddressBarPath: number = arrayOfAddressBar.length - 1;
        if (arrayOfAddressBar.length > 1) {
            let id: string = '';
            for (let i: number = 0; i < countOfAddressBarPath; i++) {
                let addressATag: HTMLElement = null;
                addressbarLI = this.parent.createElement('li');
                for (let j: number = 0; j <= i; j++) {
                    id = id + arrayOfAddressBar[j] + '/';
                }
                addressbarLI.setAttribute('data-utext', id);
                addressbarLI.classList.add('e-address-list-item');
                if (i !== 0) {
                    let icon: HTMLElement = createElement('span', { className: CLS.ICONS });
                    addressbarLI.appendChild(icon);
                }
                if (countOfAddressBarPath - i !== 1) {
                    addressATag = createElement('a', { className: CLS.LIST_TEXT });
                    addressbarLI.setAttribute('tabindex', '0');
                } else {
                    addressATag = createElement('span', { className: CLS.LIST_TEXT });
                }
                id = '';
                addressATag.innerText = arrayOfAddressBar[i];
                addressbarLI.appendChild(addressATag);
                addressbarUL.appendChild(addressbarLI);
            }
            let ulElement: Element = this.parent.breadCrumbBarNavigation.querySelector('.e-addressbar-ul');
            if (!isNullOrUndefined(ulElement)) {
                if (!isNullOrUndefined(this.subMenuObj)) {
                    this.subMenuObj.destroy();
                }
                ulElement.remove();
            }
            let searchWrap: Element = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap');
            if (!searchWrap) {
                this.parent.breadCrumbBarNavigation.insertBefore(addressbarUL, searchWrap);
            } else {
                this.parent.breadCrumbBarNavigation.appendChild(addressbarUL);
            }
            this.updateBreadCrumbBar(addressbarUL);
        }
        this.addressBarLink = '';
    }
    /* istanbul ignore next */
    private updateBreadCrumbBar(addresBarUL: HTMLElement): void {
        let liElements: NodeListOf<Element> = addresBarUL.querySelectorAll('li');
        let ulElement: Element = this.parent.breadCrumbBarNavigation.querySelector('.e-addressbar-ul');
        let style: CSSStyleDeclaration = window.getComputedStyle(ulElement, null);
        let pRight: number = parseFloat(style.getPropertyValue('padding-right'));
        let pLeft: number = parseFloat(style.getPropertyValue('padding-left'));
        let breadCrumbBarWidth: number = (<HTMLElement>ulElement).offsetWidth - pRight - pLeft;
        let addressbarUL: HTMLElement = this.parent.createElement('ul', { className: 'e-addressbar-ul' });
        let liElementsWidth: number = 0;
        let liElementsWidths: number[] = [];
        for (let i: number = 0; i < liElements.length; i++) {
            let width: number = liElements[i].clientWidth;
            liElementsWidths.push(width);
            liElementsWidth = liElementsWidth + width;
        }
        if (!isNullOrUndefined(ulElement)) {
            remove(ulElement);
        }
        let searchContainer: HTMLElement = this.parent.createElement('div');
        searchContainer.setAttribute('class', 'e-search-wrap');
        let id: string = this.parent.element.id + CLS.SEARCH_ID;
        let searchInput: HTMLElement = createElement('input', { id: id, attrs: { autocomplete: 'off' } });
        searchContainer.appendChild(searchInput);
        let searchEle: Element = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap .e-input');
        if (isNullOrUndefined(searchEle)) {
            this.parent.breadCrumbBarNavigation.appendChild(searchContainer);
            let span: Element = createElement('span', { className: 'e-icons e-fe-search' });
            EventHandler.add(span, 'click', this.onShowInput, this);
            searchInput.parentElement.insertBefore(span, searchInput);
            this.searchObj = new TextBox({
                value: '',
                showClearButton: true,
                placeholder: getLocaleText(this.parent, 'Search'),
                focus: this.onFocus.bind(this),
                blur: this.onBlur.bind(this),
            });
            this.searchObj.appendTo('#' + this.parent.element.id + CLS.SEARCH_ID);
            this.searchEventBind(this.parent.searchSettings.allowSearchOnTyping);
            let search: Element = this.searchObj.element.nextElementSibling;
            EventHandler.add(search, 'mousedown', this.searchChangeHandler.bind(this), this);
            EventHandler.add(this.searchObj.element, 'keyup', this.onKeyUp.bind(this), this);
        }
        let searchWrap: HTMLElement = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap');
        breadCrumbBarWidth = breadCrumbBarWidth - searchWrap.offsetWidth;
        if (liElementsWidth > breadCrumbBarWidth) {
            let i: number = liElements.length;
            while (i--) {
                let diff: number = breadCrumbBarWidth - liElementsWidths[i];
                if (diff > 40) {
                    addressbarUL.insertBefore(liElements[i], addressbarUL.querySelector('li'));
                    breadCrumbBarWidth = diff;
                } else {
                    let items: Object[] = [];
                    for (let j: number = 0; j <= i; j++) {
                        let liElement: Element = liElements[j];
                        items.push({
                            text: (<HTMLElement>liElement).innerText,
                            utext: liElement.getAttribute('data-utext')
                        });
                    }
                    let subMenuLi: HTMLElement = this.parent.createElement('li', { className: 'e-breadcrumb-menu' });
                    let attributes: Object = { className: 'e-breadcrumb-submenu' };
                    let subMenuSpan: HTMLElement = this.parent.createElement('button', attributes);
                    subMenuLi.appendChild(subMenuSpan);
                    addressbarUL.insertBefore(subMenuLi, addressbarUL.querySelector('li'));
                    this.subMenuObj = new DropDownButton({
                        items: items,
                        cssClass: 'e-caret-hide e-submenu',
                        iconCss: CLS.ICON_BREADCRUMB,
                        iconPosition: 'Top',
                        beforeItemRender: this.addSubMenuAttributes.bind(this),
                        select: this.subMenuSelectOperations.bind(this)
                    });
                    this.subMenuObj.appendTo(subMenuSpan);
                    break;
                }
            }
            this.parent.breadCrumbBarNavigation.insertBefore(addressbarUL, searchWrap);
        } else {
            this.parent.breadCrumbBarNavigation.insertBefore(addresBarUL, searchWrap);
        }
    }
    /* istanbul ignore next */
    private onFocus(): void {
        let wrap: Element = closest(this.searchObj.element, '.e-search-wrap');
        wrap.classList.add('e-focus');
    }
    /* istanbul ignore next */
    private onKeyUp(): void {
        this.parent.notify(events.pathColumn, { args: this.parent });
    }
    /* istanbul ignore next */
    private onBlur(): void {
        let wrap: Element = closest(this.searchObj.element, '.e-search-wrap');
        wrap.classList.remove('e-focus');
    }
    /* istanbul ignore next */
    private subMenuSelectOperations(event: MenuEventArgs): void {
        let args: Object = { target: event.element };
        this.addressPathClickHandler(<Event>args);
    }
    /* istanbul ignore next */
    private addSubMenuAttributes(args: MenuEventArgs): void {
        args.element.setAttribute('data-utext', getValue('utext', args.item));
        let anchor: HTMLElement = this.parent.createElement('a', { className: 'e-list-text' });
        args.element.appendChild(anchor);
    }
    private searchEventBind(allow: boolean): void {
        if (allow) {
            this.searchObj.input = this.searchChangeHandler.bind(this);
            this.searchObj.change = null;
        } else {
            this.searchObj.change = this.searchChangeHandler.bind(this);
            this.searchObj.input = null;
        }
    }
    private searchChangeHandler(args?: ChangedEventArgs): void {
        if (!isNullOrUndefined(args.value)) {
            let searchWord: string;
            if (args.value.length === 0) {
                this.parent.notify(events.pathColumn, { args: this.parent });
            }
            if (this.parent.searchSettings.filterType === 'startWith') {
                searchWord = '*' + args.value;
            } else if (this.parent.searchSettings.filterType === 'endsWith') {
                searchWord = args.value + '*';
            } else {
                searchWord = '*' + args.value + '*';
            }
            if (this.searchObj.element.value.length > 0) {
                let caseSensitive: boolean = this.parent.searchSettings.ignoreCase;
                let hiddenItems: boolean = this.parent.showHiddenItems;
                Search(this.parent, events.search, this.parent.path, searchWord, hiddenItems, !caseSensitive);
            } else {
                read(this.parent, events.pathChanged, this.parent.path);
            }
        }
    }
    private addressPathClickHandler(e: Event): void {
        let li: HTMLElement = (<HTMLElement>e.target);
        if (li.nodeName === 'LI' || li.nodeName === 'A') {
            let node: Element = li.nodeName === 'LI' ? li.children[0] : li;
            if (!isNullOrUndefined(node)) {
                let currentPath: string = this.updatePath((<HTMLElement>node));
                this.liClick(currentPath);
                let treeNodeId: string = this.parent.pathId[this.parent.pathId.length - 1];
                this.parent.notify(events.updateTreeSelection, { module: 'treeview', selectedNode: treeNodeId });
            }
        }
    }
    /* istanbul ignore next */
    private onShowInput(): void {
        if (this.parent.isMobile) {
            if (this.parent.element.classList.contains(CLS.FILTER)) {
                removeClass([this.parent.element], CLS.FILTER);
            } else {
                addClass([this.parent.element], CLS.FILTER);
                this.searchObj.element.focus();
            }
        }
    }

    private updatePath(list: HTMLElement): string {
        let li: Element = closest(list, 'li');
        let liElementId: string = li.getAttribute('data-utext');
        this.addressBarLink = liElementId;
        let link: string[] = this.addressBarLink.split('/');
        let ids: string[] = this.parent.pathId;
        this.parent.pathId = [];
        for (let i: number = 0, len: number = link.length - 1; i < len; i++) {
            this.parent.pathId.push(ids[i]);
        }
        let path: string = this.addressBarLink.substr(this.addressBarLink.indexOf('/'), this.addressBarLink.length);
        return path;
    }

    private onUpdatePath(): void {
        this.onPathChange();
        this.removeSearchValue();
    }

    private onCreateEnd(args: ReadArgs): void {
        let path: string = this.addressPath.substring(this.addressPath.indexOf('/'), this.addressPath.length);
        if (path !== this.parent.path) {
            this.onPathChange();
        }
    }

    /* istanbul ignore next */
    private onDeleteEnd(): void {
        let path: string = this.addressPath.substring(this.addressPath.indexOf('/'), this.addressPath.length);
        if (path !== this.parent.path) {
            this.onUpdatePath();
        }
    }

    /* istanbul ignore next */
    private removeSearchValue(): void {
        if (this.searchObj.value !== '' || this.searchObj.element.value !== '') {
            this.searchObj.value = '';
            this.searchObj.element.value = '';
            this.searchObj.dataBind();
        }
    }

    private onResize(): void {
        this.onPathChange();
    }

    private liClick(currentPath: string): void {
        read(this.parent, events.pathChanged, currentPath);
    }
    private addEventListener(): void {
        this.keyboardModule = new KeyboardEvents(
            this.parent.breadCrumbBarNavigation,
            {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown',
            }
        );
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        EventHandler.add(this.parent.breadCrumbBarNavigation, 'click', this.addressPathClickHandler, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.pathChanged, this.onUpdatePath, this);
        this.parent.on(events.finalizeEnd, this.onUpdatePath, this);
        this.parent.on(events.refreshEnd, this.onUpdatePath, this);
        this.parent.on(events.openEnd, this.onUpdatePath, this);
        this.parent.on(events.createEnd, this.onCreateEnd, this);
        this.parent.on(events.renameEnd, this.onUpdatePath, this);
        this.parent.on(events.deleteEnd, this.onDeleteEnd, this);
        this.parent.on(events.splitterResize, this.onResize, this);
        this.parent.on(events.resizeEnd, this.onResize, this);
        this.parent.on(events.searchTextChange, this.onSearchTextChange, this);
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        switch (e.action) {
            case 'enter':
                e.preventDefault();
                this.addressPathClickHandler(e);
                break;
        }
    }
    private removeEventListener(): void {
        this.keyboardModule.destroy();
        this.parent.off(events.pathChanged, this.onUpdatePath);
        this.parent.off(events.finalizeEnd, this.onUpdatePath);
        this.parent.off(events.refreshEnd, this.onUpdatePath);
        this.parent.off(events.openEnd, this.onUpdatePath);
        this.parent.off(events.createEnd, this.onCreateEnd);
        this.parent.off(events.renameEnd, this.onUpdatePath);
        this.parent.off(events.deleteEnd, this.onDeleteEnd);
        this.parent.off(events.splitterResize, this.onResize);
        this.parent.off(events.resizeEnd, this.onResize);
        this.parent.off(events.searchTextChange, this.onSearchTextChange);
    }

    /**
     * For internal use only - Get the module name.
     *  @private
     */
    private getModuleName(): string {
        return 'breadcrumbbar';
    }

    /**
     * Destroys the PopUpMenu module.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
        if (!isNullOrUndefined(this.subMenuObj)) {
            this.subMenuObj.destroy();
        }
        if (!isNullOrUndefined(this.searchObj)) {
            this.searchObj.destroy();
        }
    }

    private onSearchTextChange(args: ReadArgs): void {
        this.searchObj.element.placeholder = getLocaleText(this.parent, 'Search') + ' ' + args.cwd.name;
    }
}
