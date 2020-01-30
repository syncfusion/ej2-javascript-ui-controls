import { createElement, EventHandler, addClass, removeClass } from '@syncfusion/ej2-base';
import { TreeView, NodeClickEventArgs } from '@syncfusion/ej2-navigations';
import { Popup } from '@syncfusion/ej2-popups';
import { Kanban } from './kanban';
import * as events from './constant';
import * as cls from './css-constant';

/**
 * Kanban mobile layout rendering module
 */
export class MobileLayout {
    public parent: Kanban;
    private popupOverlay: HTMLElement;
    public treeViewObj: TreeView;
    public treePopup: Popup;
    /**
     * Constructor for mobile layout module
     */
    constructor(parent: Kanban) {
        this.parent = parent;
    }

    public renderSwimlaneHeader(): void {
        let toolbarWrapper: HTMLElement = createElement('div', { className: cls.SWIMLANE_HEADER });
        toolbarWrapper.innerHTML = '<div class="' + cls.SWIMLANE_HEADER_TOOLBAR + '"><div class="' + cls.TOOLBAR_MENU + '">' +
            '<div class="e-icons ' + cls.TOOLBAR_MENU_ICON + '"></div></div><div class="' + cls.TOOLBAR_LEVEL_TITLE + '">' +
            '<div class="' + cls.TOOLBAR_SWIMLANE_NAME + '"></div></div></div>';
        this.parent.element.appendChild(toolbarWrapper);
        EventHandler.add(toolbarWrapper.querySelector('.' + cls.TOOLBAR_MENU_ICON), 'click', this.menuClick, this);
    }

    public renderSwimlaneTree(): void {
        let height: number = (this.parent.element.querySelector('.' + cls.SWIMLANE_HEADER) as HTMLElement).offsetHeight;
        let treeHeight: number = window.innerHeight - height;
        this.popupOverlay = createElement('div', { className: cls.SWIMLANE_OVERLAY, styles: 'height: ' + treeHeight + 'px;' });
        let wrapper: HTMLElement = createElement('div', { className: cls.SWIMLANE_CONTENT, styles: 'top:' + height + 'px;' });
        let treeWrapper: HTMLElement = createElement('div', {
            className: cls.SWIMLANE_RESOURCE + ' e-popup-close',
            styles: 'height: ' + treeHeight + 'px;'
        });
        wrapper.appendChild(treeWrapper);
        wrapper.appendChild(this.popupOverlay);
        this.parent.element.appendChild(wrapper);
        let swimlaneTree: HTMLElement = createElement('div', { className: cls.SWIMLANE_TREE });
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
        this.treePopup = new Popup(treeWrapper, {
            targetType: 'relative',
            actionOnScroll: 'none',
            content: this.treeViewObj.element,
            enableRtl: this.parent.enableRtl,
            zIndex: 10,
            hideAnimation: { name: 'SlideLeftOut', duration: 500 },
            showAnimation: { name: 'SlideLeftIn', duration: 500 },
            viewPortElement: this.parent.element.querySelector('.' + cls.CONTENT_CLASS)
        });
    }

    private menuClick(event: Event): void {
        if (this.parent.element.querySelector('.' + cls.SWIMLANE_RESOURCE).classList.contains('e-popup-open')) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], 'e-enable');
        } else {
            let treeNodes: Element[] = [].slice.call(this.treeViewObj.element.querySelectorAll('.e-list-item'));
            removeClass(treeNodes, 'e-active');
            addClass([treeNodes[this.parent.layoutModule.swimlaneIndex]], 'e-active');
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

    public getWidth(): number {
        return (window.innerWidth * 80) / 100;
    }

}
