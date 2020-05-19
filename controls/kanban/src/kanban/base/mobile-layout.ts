import { createElement, EventHandler, addClass, removeClass, setStyleAttribute } from '@syncfusion/ej2-base';
import { TreeView, NodeClickEventArgs } from '@syncfusion/ej2-navigations';
import { Popup, PopupModel } from '@syncfusion/ej2-popups';
import { Kanban } from './kanban';
import * as events from './constant';
import * as cls from './css-constant';

/**
 * Kanban mobile layout rendering module
 */
export class MobileLayout {
    public parent: Kanban;
    public popupOverlay: HTMLElement;
    public treeViewObj: TreeView;
    public treePopup: Popup;
    /**
     * Constructor for mobile layout module
     */
    constructor(parent: Kanban) {
        this.parent = parent;
    }

    public renderSwimlaneHeader(): void {
        let toolbarWrapper: HTMLElement;
        if (this.parent.isBlazorRender()) {
            toolbarWrapper = this.parent.element.querySelector('.' + cls.SWIMLANE_HEADER_CLASS);
        } else {
            toolbarWrapper = createElement('div', { className: cls.SWIMLANE_HEADER_CLASS });
            toolbarWrapper.innerHTML = '<div class="' + cls.SWIMLANE_HEADER_TOOLBAR_CLASS + '"><div class="' + cls.TOOLBAR_MENU_CLASS +
                '"><div class="e-icons ' + cls.TOOLBAR_MENU_ICON_CLASS + '"></div></div><div class="' + cls.TOOLBAR_LEVEL_TITLE_CLASS +
                '"><div class="' + cls.TOOLBAR_SWIMLANE_NAME_CLASS + '"></div></div></div>';
            this.parent.element.appendChild(toolbarWrapper);
        }
        EventHandler.add(toolbarWrapper.querySelector('.' + cls.TOOLBAR_MENU_ICON_CLASS), 'click', this.menuClick, this);
    }

    public renderSwimlaneTree(): void {
        let treeWrapper: HTMLElement;
        let height: number = (this.parent.element.querySelector('.' + cls.SWIMLANE_HEADER_CLASS) as HTMLElement).offsetHeight;
        let treeHeight: number = window.innerHeight - height;
        if (!this.parent.isBlazorRender()) {
            this.popupOverlay = createElement('div', { className: cls.SWIMLANE_OVERLAY_CLASS, styles: 'height: ' + treeHeight + 'px;' });
            let wrapper: HTMLElement = createElement('div', { className: cls.SWIMLANE_CONTENT_CLASS, styles: 'top:' + height + 'px;' });
            treeWrapper = createElement('div', {
                className: cls.SWIMLANE_RESOURCE_CLASS + ' e-popup-close',
                styles: 'height: ' + treeHeight + 'px;'
            });
            wrapper.appendChild(treeWrapper);
            wrapper.appendChild(this.popupOverlay);
            this.parent.element.appendChild(wrapper);
            let swimlaneTree: HTMLElement = createElement('div', { className: cls.SWIMLANE_TREE_CLASS });
            treeWrapper.appendChild(swimlaneTree);
            this.treeViewObj = new TreeView({
                cssClass: this.parent.cssClass,
                enableRtl: this.parent.enableRtl,
                fields: {
                    dataSource: this.parent.layoutModule.kanbanRows as [],
                    id: 'keyField',
                    text: 'textField'
                },
                nodeTemplate: this.parent.swimlaneSettings.template,
                nodeClicked: this.treeSwimlaneClick.bind(this)
            });
            this.treeViewObj.appendTo(swimlaneTree);
        } else {
            this.popupOverlay = this.parent.element.querySelector('.' + cls.SWIMLANE_CONTENT_CLASS + ' .' + cls.SWIMLANE_OVERLAY_CLASS);
            setStyleAttribute(this.parent.element.querySelector('.' + cls.SWIMLANE_OVERLAY_CLASS), { 'height': treeHeight + 'px' });
            setStyleAttribute(this.parent.element.querySelector('.' + cls.SWIMLANE_CONTENT_CLASS), { 'top': height + 'px' });
            treeWrapper = this.parent.element.querySelector('.' + cls.SWIMLANE_RESOURCE_CLASS);
            setStyleAttribute(treeWrapper, { 'height': treeHeight + 'px' });
        }
        let popupObj: PopupModel = {
            targetType: 'relative',
            actionOnScroll: 'none',
            enableRtl: this.parent.enableRtl,
            zIndex: 10,
            hideAnimation: { name: 'SlideLeftOut', duration: 500 },
            showAnimation: { name: 'SlideLeftIn', duration: 500 },
            viewPortElement: this.parent.element.querySelector('.' + cls.CONTENT_CLASS)
        };
        if (!this.parent.isBlazorRender()) {
            popupObj.content = this.treeViewObj.element;
        }
        this.treePopup = new Popup(treeWrapper, popupObj);
    }

    private menuClick(event: Event): void {
        if (this.parent.element.querySelector('.' + cls.SWIMLANE_RESOURCE_CLASS).classList.contains('e-popup-open')) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], 'e-enable');
        } else {
            if (!this.parent.isBlazorRender()) {
                let treeNodes: Element[] = [].slice.call(this.treeViewObj.element.querySelectorAll('.e-list-item'));
                removeClass(treeNodes, 'e-active');
                addClass([treeNodes[this.parent.layoutModule.swimlaneIndex]], 'e-active');
            }
            this.treePopup.show();
            addClass([this.popupOverlay], 'e-enable');
        }
    }

    private treeSwimlaneClick(args: NodeClickEventArgs): void {
        this.treePopup.hide();
        let treeNodes: HTMLLIElement[] = [].slice.call(this.treeViewObj.element.querySelectorAll('.e-list-item'));
        this.parent.layoutModule.swimlaneIndex = treeNodes.indexOf(args.node);
        this.parent.layoutModule.scrollLeft = 0;
        this.parent.notify(events.dataReady, { processedData: this.parent.kanbanData });
        args.event.preventDefault();
    }

    /**
     * @hidden
     */
    public hidePopup(): void {
        this.treePopup.hide();
        removeClass([this.popupOverlay], 'e-enable');
    }

    public getWidth(): number {
        return (window.innerWidth * 80) / 100;
    }
}
