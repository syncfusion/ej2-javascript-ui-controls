/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { extend, isNullOrUndefined, createElement, EventHandler, addClass, append, removeClass, remove, closest, classList } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { TreeView, NodeClickEventArgs } from '@syncfusion/ej2-navigations';
import { Popup } from '@syncfusion/ej2-popups';
import { Data } from '../actions/data';
import { Schedule } from '../base/schedule';
import { ReturnType } from '../base/type';
import { TdData, ResourceDetails, NotifyEventArgs, ActionEventArgs, RenderCellEventArgs, CallbackFunction } from '../base/interface';
import { ResourcesModel } from '../models/resources-model';
import * as cls from '../base/css-constant';
import * as events from '../base/constant';
import * as util from '../base/util';

/**
 * Resource and group related common functionalities
 */

interface TreeSlotData extends TdData {
    child: TdData[];
}

export class ResourceBase {
    private parent: Schedule;
    public resourceCollection: ResourcesModel[] = [];
    public lastResourceLevel: TdData[];
    public renderedResources: TdData[];
    public expandedResources: TdData[];
    private colorIndex: number;
    private resourceTreeLevel: TdData[];
    private treeViewObj: TreeView;
    private treePopup: Popup;
    private popupOverlay: HTMLElement;
    private leftPixel: number = 25;
    public resourceDateTree: TdData[][] = [];

    constructor(parent: Schedule) {
        this.parent = parent;
    }

    public renderResourceHeaderIndent(tr: Element): void {
        const resColTd: Element = createElement('td', { className: cls.RESOURCE_LEFT_TD_CLASS });
        const resColDiv: Element = createElement('div', { className: cls.RESOURCE_TEXT_CLASS });
        if (this.parent.activeViewOptions.headerIndentTemplate) {
            const data: TdData = { className: [resColTd.className], type: 'emptyCells' };
            this.parent.renderHeaderIndentTemplate(data, resColTd);
        } else {
            resColTd.appendChild(resColDiv);
        }
        const args: RenderCellEventArgs = { elementType: 'emptyCells', element: resColTd };
        this.parent.trigger(events.renderCell, args);
        tr.appendChild(resColTd);
    }

    public hideResourceRows(tBody: Element): void {
        if (this.resourceCollection.length <= 1 || this.parent.virtualScrollModule) {
            return;
        }
        const trCount: number = this.lastResourceLevel.length;
        for (let i: number = 0; i < trCount; i++) {
            const resData: Record<string, any> = this.lastResourceLevel[parseInt(i.toString(), 10)].resourceData;
            const res: ResourcesModel = this.lastResourceLevel[parseInt(i.toString(), 10)].resource;
            if (resData.ClassName === cls.RESOURCE_PARENT_CLASS && !resData[res.expandedField] &&
                !isNullOrUndefined(resData[res.expandedField])) {
                const trCollection: HTMLElement[] = [].slice.call(tBody.children);
                const slicedCollection: HTMLElement[] = trCollection.slice(i + 1, i + (parseInt(resData.Count as string, 10) + 1));
                addClass(slicedCollection, cls.HIDDEN_CLASS);
            }
        }
    }

    public createResourceColumn(): Element {
        const resColl: ResourcesModel[] = this.resourceCollection;
        const resDiv: Element = createElement('div', { className: cls.RESOURCE_COLUMN_WRAP_CLASS });
        const tbl: Element = this.parent.activeView.createTableLayout(cls.RESOURCE_COLUMN_TABLE_CLASS);
        if (!this.parent.uiStateValues.isGroupAdaptive && this.parent.rowAutoHeight && this.parent.activeView.isTimelineView()
            && this.parent.activeViewOptions.group.resources.length > 0) {
            addClass([tbl], cls.AUTO_HEIGHT);
        }
        const tBody: Element = tbl.querySelector('tbody');
        let resData: TdData[] = this.generateTreeData(true) as TdData[];
        this.countCalculation(resColl.slice(0, -2), resColl.slice(0, -1));
        this.renderedResources = this.lastResourceLevel;
        if (this.parent.virtualScrollModule) {
            const resourceCount: number = this.parent.virtualScrollModule.getRenderedCount();
            this.setExpandedResources();
            resData = this.expandedResources.slice(0, resourceCount);
            this.renderedResources = resData;
        }
        append(this.getContentRows(resData), tBody);
        this.hideResourceRows(tBody);
        tbl.appendChild(tBody);
        resDiv.appendChild(tbl);
        return resDiv;
    }

    public setRenderedResources(): void {
        const resColl: ResourcesModel[] = this.resourceCollection;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const temp: TdData[] = this.generateTreeData(true) as TdData[];
        this.countCalculation(resColl.slice(0, -2), resColl.slice(0, -1));
        this.renderedResources = this.lastResourceLevel;
    }

    public setExpandedResources(): void {
        const resources: TdData[] = [];
        for (let i: number = 0; i < this.lastResourceLevel.length; i++) {
            const resource: Record<string, any> = this.lastResourceLevel[parseInt(i.toString(), 10)].resourceData;
            const count: number = resource.Count as number;
            resources.push(this.lastResourceLevel[parseInt(i.toString(), 10)]);
            const isExpanded: boolean = resource[this.lastResourceLevel[parseInt(i.toString(), 10)].resource.expandedField] as boolean;
            if (!isNullOrUndefined(isExpanded) && !isExpanded && count > 0) {
                i = i + count;
            }
        }
        this.expandedResources = resources;
    }

    public getContentRows(resData: TdData[], isVirtualScroll?: boolean): Element[] {
        const resRows: Element[] = [];
        let left: string;
        let rIndex: number;
        const resColl: ResourcesModel[] = this.resourceCollection;
        const tr: Element = createElement('tr');
        const td: Element = createElement('td', { attrs: { tabindex: isVirtualScroll ? '-1' : '0' } });
        const existingGroupIndices: number[] = this.parent.activeView.getGroupIndices();
        for (let i: number = 0; i < resData.length; i++) {
            if (existingGroupIndices.length > 0 && existingGroupIndices.indexOf(resData[parseInt(i.toString(), 10)].groupIndex) > -1) {
                continue;
            }
            const ntd: Element = td.cloneNode() as Element;
            rIndex = util.findIndexInData(<Record<string, any>[]>resColl, 'name', resData[parseInt(i.toString(), 10)].resource.name);
            if (rIndex === resColl.length - 1) {
                extend(resData[parseInt(i.toString(), 10)].resourceData, { ClassName: cls.RESOURCE_CHILD_CLASS });
                this.renderedResources[parseInt(i.toString(), 10)].className = [cls.RESOURCE_CHILD_CLASS];
            } else {
                extend(resData[parseInt(i.toString(), 10)].resourceData, { ClassName: cls.RESOURCE_PARENT_CLASS });
                this.renderedResources[parseInt(i.toString(), 10)].className = [cls.RESOURCE_PARENT_CLASS];
            }
            left = (rIndex * this.leftPixel) + 'px';
            if (resData[parseInt(i.toString(), 10)].resourceData.ClassName as string === cls.RESOURCE_PARENT_CLASS
                && !isNullOrUndefined(resData[parseInt(i.toString(), 10)].resourceData.Count) && (resData[parseInt(i.toString(), 10)].resourceData.Count > 0)) {
                let iconClass: string;
                if (resData[parseInt(i.toString(), 10)].resourceData[resColl[parseInt(rIndex.toString(), 10)].expandedField] ||
                    isNullOrUndefined(resData[parseInt(i.toString(), 10)].resourceData[resColl[parseInt(rIndex.toString(), 10)].expandedField])) {
                    iconClass = cls.RESOURCE_COLLAPSE_CLASS;
                } else {
                    iconClass = cls.RESOURCE_EXPAND_CLASS;
                }
                const iconDiv: HTMLElement = createElement('div');
                addClass([iconDiv], [cls.RESOURCE_TREE_ICON_CLASS, iconClass]);
                this.setMargin(iconDiv, left);
                ntd.appendChild(iconDiv);
                if (this.resourceCollection.length > 1) {
                    EventHandler.add(iconDiv, 'click', this.onTreeIconClick, this);
                }
            }
            this.parent.activeView.setResourceHeaderContent(ntd, resData[parseInt(i.toString(), 10)], cls.RESOURCE_TEXT_CLASS);
            ntd.setAttribute('data-group-index', resData[parseInt(i.toString(), 10)].groupIndex.toString());
            ntd.setAttribute('aria-label', (resData[parseInt(i.toString(), 10)].resourceData[resData[parseInt(i.toString(), 10)].resource.textField] as string) + ' resource');
            if (!this.parent.activeViewOptions.resourceHeaderTemplate) {
                this.setMargin(ntd.querySelector('.' + cls.RESOURCE_TEXT_CLASS) as HTMLElement, left);
            }
            const classCollection: string[] = [cls.RESOURCE_CELLS_CLASS, resData[parseInt(i.toString(), 10)].resourceData.ClassName as string];
            addClass([ntd], classCollection);
            const args: RenderCellEventArgs = { elementType: 'resourceHeader', element: ntd, groupIndex: resData[parseInt(i.toString(), 10)].groupIndex };
            this.parent.trigger(events.renderCell, args);
            const ntr: Element = tr.cloneNode() as Element;
            ntr.appendChild(ntd);
            resRows.push(ntr);
        }
        return resRows;
    }

    private setMargin(element: HTMLElement, value: string): void {
        if (!this.parent.enableRtl) {
            element.style.marginLeft = value;
        } else {
            element.style.marginRight = value;
        }
    }

    private countCalculation(parentCollection: ResourcesModel[], wholeCollection: ResourcesModel[]): void {
        let collection: Record<string, any>[];
        for (let y: number = 0; y < parentCollection.length; y++) {
            const data: Record<string, any>[] = parentCollection[parentCollection.length - (y + 1)].dataSource as Record<string, any>[];
            for (let x: number = 0; x < data.length; x++) {
                let totalCount: number = 0;
                if (this.parent.activeViewOptions.group.byGroupID) {
                    const query: Query =
                        new Query().where(wholeCollection[wholeCollection.length - 1].groupIDField, 'equal',
                                          data[parseInt(x.toString(), 10)][parentCollection[parentCollection.length - (y + 1)].idField] as string);
                    collection = new DataManager(wholeCollection[wholeCollection.length - 1].dataSource).executeLocal(query) as Record<string, any>[];
                } else {
                    collection = wholeCollection[wholeCollection.length - 1].dataSource as Record<string, any>[];
                }
                for (let z: number = 0; z < collection.length; z++) {
                    totalCount = totalCount + parseInt(collection[parseInt(z.toString(), 10)].Count as string, 10);
                }
                totalCount = totalCount + parseInt(data[parseInt(x.toString(), 10)].Count as string, 10);
                extend(data[parseInt(x.toString(), 10)], { Count: totalCount });
            }
            wholeCollection = wholeCollection.slice(0, -1);
        }
    }

    public onTreeIconClick(e: Event): void {
        if (this.parent.eventTooltip) {
            this.parent.eventTooltip.close();
        }
        const target: Element = <HTMLElement>e.target;
        let hide: boolean;
        const trElement: HTMLTableRowElement = closest(target as Element, '.' + cls.RESOURCE_PARENT_CLASS)
            .parentElement as HTMLTableRowElement;
        const index: number = parseInt(trElement.children[0].getAttribute('data-group-index'), 10);
        let args: ActionEventArgs = {
            cancel: false, event: e, groupIndex: index,
            requestType: !target.classList.contains(cls.RESOURCE_COLLAPSE_CLASS) ? 'resourceExpand' : 'resourceCollapse'
        };
        this.parent.trigger(events.actionBegin, args, (actionArgs: ActionEventArgs) => {
            if (!actionArgs.cancel) {
                if (target.classList.contains(cls.RESOURCE_COLLAPSE_CLASS)) {
                    classList(target, [cls.RESOURCE_EXPAND_CLASS], [cls.RESOURCE_COLLAPSE_CLASS]);
                    hide = true;
                } else {
                    classList(target, [cls.RESOURCE_COLLAPSE_CLASS], [cls.RESOURCE_EXPAND_CLASS]);
                    hide = false;
                }
                const eventElements: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS + ',.' + cls.MORE_INDICATOR_CLASS));
                for (const element of eventElements) {
                    remove(element);
                }
                if (this.parent.virtualScrollModule) {
                    this.updateVirtualContent(index, hide, e, target);
                } else {
                    this.updateContent(index, hide);
                }
                const data: NotifyEventArgs = { cssProperties: this.parent.getCssProperties(), module: 'scroll' };
                this.parent.notify(events.scrollUiUpdate, data);
                args = {
                    cancel: false, event: e, groupIndex: index,
                    requestType: target.classList.contains(cls.RESOURCE_COLLAPSE_CLASS) ? 'resourceExpanded' : 'resourceCollapsed'
                };
                this.parent.refreshEvents(false);
                this.parent.trigger(events.actionComplete, args);
            }
        });
    }

    public updateContent(index: number, hide: boolean): void {
        const rowCollection: HTMLTableRowElement[] = [];
        const workCellCollection: HTMLTableRowElement[] = [];
        const headerRowCollection: HTMLTableRowElement[] = [];
        let pNode: boolean;
        const clickedRes: Record<string, any> = this.lastResourceLevel[parseInt(index.toString(), 10)].resourceData as Record<string, any>;
        const resRows: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.RESOURCE_COLUMN_WRAP_CLASS + ' ' + 'tr'));
        const contentRows: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_WRAP_CLASS + ' ' + 'tbody tr'));
        const eventRows: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_WRAP_CLASS + ' .' + cls.APPOINTMENT_CONTAINER_CLASS));
        for (let j: number = 0; j < clickedRes.Count; j++) {
            rowCollection.push(resRows[index + j + 1] as HTMLTableRowElement);
            workCellCollection.push(contentRows[index + j + 1] as HTMLTableRowElement);
            headerRowCollection.push(eventRows[index + j + 1] as HTMLTableRowElement);
        }
        const clonedCollection: TdData[] = this.lastResourceLevel;
        for (let i: number = 0; i < rowCollection.length; i++) {
            let expanded: boolean = true;
            pNode = rowCollection[parseInt(i.toString(), 10)].children[0].classList.contains(cls.RESOURCE_PARENT_CLASS);
            clonedCollection[parseInt(index.toString(), 10)].resourceData[clonedCollection[parseInt(index.toString(), 10)].resource.expandedField] = !hide;
            if (hide) {
                if (pNode) {
                    const trElem: Element = rowCollection[parseInt(i.toString(), 10)].querySelector('.' + cls.RESOURCE_TREE_ICON_CLASS);
                    if (trElem) {
                        classList(trElem, [cls.RESOURCE_EXPAND_CLASS], [cls.RESOURCE_COLLAPSE_CLASS]);
                    }
                }
                if (!rowCollection[parseInt(i.toString(), 10)].classList.contains(cls.HIDDEN_CLASS)) {
                    addClass([rowCollection[parseInt(i.toString(), 10)], workCellCollection[parseInt(i.toString(), 10)], headerRowCollection[parseInt(i.toString(), 10)]], cls.HIDDEN_CLASS);
                }
            } else {
                if (pNode) {
                    const rowIndex: number = rowCollection[parseInt(i.toString(), 10)].rowIndex;
                    if (!clonedCollection[parseInt(rowIndex.toString(), 10)].resourceData[clonedCollection[parseInt(rowIndex.toString(), 10)].resource.expandedField]
                        && !isNullOrUndefined(clonedCollection[parseInt(rowIndex.toString(), 10)].resourceData[clonedCollection[parseInt(rowIndex.toString(), 10)].resource.expandedField])) {
                        rowCollection.splice(i + 1, (parseInt(clonedCollection[parseInt(rowIndex.toString(), 10)].resourceData.Count as string, 10)));
                        workCellCollection.splice(i + 1, (parseInt(clonedCollection[parseInt(rowIndex.toString(), 10)].resourceData.Count as string, 10)));
                        headerRowCollection.splice(i + 1, (parseInt(clonedCollection[parseInt(rowIndex.toString(), 10)].resourceData.Count as string, 10)));
                        expanded = false;
                    }
                    if (expanded) {
                        const trElem: Element = rowCollection[parseInt(i.toString(), 10)].querySelector('.' + cls.RESOURCE_TREE_ICON_CLASS);
                        if (trElem) {
                            classList(trElem, [cls.RESOURCE_COLLAPSE_CLASS], [cls.RESOURCE_EXPAND_CLASS]);
                        }
                    }
                }
                if (rowCollection[parseInt(i.toString(), 10)].classList.contains(cls.HIDDEN_CLASS)) {
                    removeClass([rowCollection[parseInt(i.toString(), 10)], workCellCollection[parseInt(i.toString(), 10)], headerRowCollection[parseInt(i.toString(), 10)]], cls.HIDDEN_CLASS);
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public updateVirtualContent(index: number, expand: boolean, e: Event, target: Element): void {
        this.lastResourceLevel[parseInt(index.toString(), 10)].resourceData[this.lastResourceLevel[parseInt(index.toString(), 10)].resource.expandedField] = !expand;
        this.setExpandedResources();
        const resourceCount: number = this.parent.virtualScrollModule.getRenderedCount();
        const startIndex: number = this.expandedResources.indexOf(this.renderedResources[0]);
        this.parent.virtualScrollModule.existingDataCollection = this.renderedResources;
        this.renderedResources = this.expandedResources.slice(startIndex, startIndex + resourceCount);
        if (this.renderedResources.length < resourceCount) {
            let sIndex: number = this.expandedResources.length - resourceCount;
            sIndex = (sIndex > 0) ? sIndex : 0;
            this.renderedResources = this.expandedResources.slice(sIndex, this.expandedResources.length);
        }
        const virtualTrack: HTMLElement = this.parent.element.querySelector('.' + cls.VIRTUAL_TRACK_CLASS);
        this.parent.virtualScrollModule.updateVirtualTrackHeight(virtualTrack);
        const resTable: HTMLElement =
            this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS + ' ' + 'table') as HTMLElement;
        const contentTable: HTMLElement =
            this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' ' + 'table') as HTMLElement;
        const eventTable: HTMLElement = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS) as HTMLElement;
        this.parent.virtualScrollModule.updateContent(resTable, contentTable, eventTable, this.renderedResources);
        const timeIndicator: HTMLElement = this.parent.element.querySelector('.' + cls.CURRENT_TIMELINE_CLASS) as HTMLElement;
        if (!isNullOrUndefined(timeIndicator)) {
            timeIndicator.style.height =
                (this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement).offsetHeight + 'px';
        }
    }

    public renderResourceHeader(): void {
        const resourceWrapper: HTMLElement = createElement('div', { className: cls.RESOURCE_TOOLBAR_CONTAINER });
        resourceWrapper.innerHTML = '<div class="' + cls.RESOURCE_HEADER_TOOLBAR + '"><div class="' + cls.RESOURCE_MENU + '">' +
            '<div class="e-icons ' + cls.RESOURCE_MENU_ICON + '"></div></div><div class="' + cls.RESOURCE_LEVEL_TITLE + '"></div></div>';
        if (this.parent.currentView === 'MonthAgenda') {
            const target: Element = this.parent.activeView.getPanel().querySelector('.' + cls.CONTENT_WRAP_CLASS);
            target.insertBefore(resourceWrapper, target.querySelector('.' + cls.WRAPPER_CONTAINER_CLASS));
        } else {
            this.parent.element.insertBefore(resourceWrapper, this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS));
        }
        this.renderResourceHeaderText();
        EventHandler.add(resourceWrapper.querySelector('.' + cls.RESOURCE_MENU_ICON), 'click', this.menuClick, this);
    }

    public renderResourceTree(): void {
        this.popupOverlay = createElement('div', { className: cls.RESOURCE_TREE_POPUP_OVERLAY });
        const treeWrapper: HTMLElement = createElement('div', { className: cls.RESOURCE_TREE_POPUP + ' e-popup-close' });
        if (this.parent.currentView === 'MonthAgenda') {
            const target: Element = this.parent.activeView.getPanel().querySelector('.' + cls.WRAPPER_CONTAINER_CLASS);
            target.insertBefore(treeWrapper, target.children[0]);
            target.appendChild(this.popupOverlay);
        } else {
            this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS).appendChild(treeWrapper);
            this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS).appendChild(this.popupOverlay);
        }
        const resourceTree: HTMLElement = createElement('div', { className: cls.RESOURCE_TREE });
        treeWrapper.appendChild(resourceTree);
        this.treeViewObj = new TreeView({
            cssClass: this.parent.cssClass,
            enableRtl: this.parent.enableRtl,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            fields: {
                dataSource: [].slice.call(this.generateTreeData()) as Record<string, any>[],
                id: 'resourceId',
                text: 'resourceName',
                child: 'resourceChild'
            },
            nodeTemplate: this.parent.resourceHeaderTemplate as any,
            nodeClicked: this.resourceClick.bind(this),
            created: this.resourceTreeCreated.bind(this)
        });
        this.treeViewObj.root = this.parent.root ? this.parent.root : this.parent;
        this.treeViewObj.appendTo(resourceTree);
        this.treeViewObj.expandAll();
        this.treePopup = new Popup(treeWrapper, {
            targetType: 'relative',
            actionOnScroll: 'none',
            content: this.treeViewObj.element,
            relateTo: this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS) as HTMLElement,
            enableRtl: this.parent.enableRtl,
            hideAnimation: { name: 'SlideLeftOut', duration: 500 },
            showAnimation: { name: 'SlideLeftIn', duration: 500 },
            viewPortElement: this.parent.element.querySelector('.' + (this.parent.currentView === 'MonthAgenda' ?
                cls.WRAPPER_CONTAINER_CLASS : cls.TABLE_CONTAINER_CLASS)) as HTMLElement
        });
        this.parent.on(events.documentClick, this.documentClick, this);
    }

    private resourceTreeCreated(): void {
        if (this.parent.activeViewOptions.resourceHeaderTemplate && (this as any).parent.portals && (this.treeViewObj as any).portals) {
            (this as any).parent.portals = (this as any).parent.portals.concat((this.treeViewObj as any).portals);
            this.parent.renderTemplates();
        }
    }

    private generateTreeData(isTimeLine?: boolean): ResourceDetails[] | TdData[] {
        const treeCollection: ResourceDetails[] = [];
        const resTreeColl: TdData[] = [];
        let groupIndex: number = 0;
        for (let i: number = 0, len: number = this.resourceTreeLevel.length; i < len; i++) {
            const treeHandler: CallbackFunction = (treeLevel: TreeSlotData, index: number, levelId: string): ResourceDetails => {
                const resource: ResourcesModel = this.resourceCollection[parseInt(index.toString(), 10)];
                let treeArgs: ResourceDetails;
                let resObj: TdData;
                if (!isTimeLine) {
                    treeArgs = {
                        resourceId: levelId,
                        resourceName: treeLevel.resourceData[resource.textField] as string,
                        resource: treeLevel.resource,
                        resourceData: treeLevel.resourceData
                    };
                } else {
                    resObj = {
                        type: 'resourceHeader', resource: treeLevel.resource,
                        resourceData: treeLevel.resourceData, groupIndex: groupIndex,
                        groupOrder: treeLevel.groupOrder
                    };
                    resTreeColl.push(resObj);
                    groupIndex++;
                }
                if (treeLevel.child.length > 0 && !isTimeLine) {
                    treeArgs.resourceChild = [];
                }
                let count: number = 1;
                for (const tree of treeLevel.child) {
                    if (!isTimeLine) {
                        treeArgs.resourceChild.push(treeHandler(tree, index + 1, levelId + '-' + count));
                    } else {
                        treeHandler(tree, index + 1, levelId + '-' + count);
                    }
                    count += 1;
                }
                if (isTimeLine) {
                    extend(resObj.resourceData, { Count: count - 1 });
                }
                return treeArgs;
            };
            if (!isTimeLine) {
                treeCollection.push(treeHandler(this.resourceTreeLevel[parseInt(i.toString(), 10)], 0, (i + 1).toString()));
            } else {
                treeHandler(this.resourceTreeLevel[parseInt(i.toString(), 10)], 0, (i + 1).toString());
            }
        }
        if (isTimeLine) {
            this.lastResourceLevel = resTreeColl;
            return resTreeColl;
        } else {
            return treeCollection;
        }
    }

    private renderResourceHeaderText(): void {
        const resource: TdData = this.lastResourceLevel[this.parent.uiStateValues.groupIndex];
        const headerCollection: HTMLElement[] = [];
        for (let i: number = 0, len: number = resource.groupOrder.length; i < len; i++) {
            const resourceLevel: ResourcesModel = this.resourceCollection[parseInt(i.toString(), 10)];
            const resourceText: Record<string, any>[] =
                (resourceLevel.dataSource as Record<string, any>[]).filter((resData: Record<string, any>) =>
                    resData[resourceLevel.idField] === resource.groupOrder[parseInt(i.toString(), 10)]);
            const resourceName: HTMLElement = createElement('div', { className: cls.RESOURCE_NAME });
            this.parent.sanitize((<Record<string, any>>resourceText[0])[resourceLevel.textField] as string, resourceName);
            headerCollection.push(resourceName);
            const levelIcon: HTMLElement = createElement('div', { className: 'e-icons e-icon-next' });
            headerCollection.push(levelIcon);
        }
        headerCollection.pop();
        const target: HTMLElement = (this.parent.currentView === 'MonthAgenda') ? this.parent.activeView.getPanel() : this.parent.element;
        const headerWrapper: Element = target.querySelector('.' + cls.RESOURCE_LEVEL_TITLE);
        util.removeChildren(headerWrapper);
        for (const header of headerCollection) {
            headerWrapper.appendChild(header);
        }
        if (this.lastResourceLevel.length === 1) {
            addClass([this.parent.element.querySelector('.' + cls.RESOURCE_MENU)], cls.DISABLE_CLASS);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private menuClick(event: Event): void {
        if (this.parent.element.querySelector('.' + cls.RESOURCE_TREE_POPUP).classList.contains(cls.POPUP_OPEN)) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], cls.ENABLE_CLASS);
        } else {
            const treeNodes: HTMLElement[] = [].slice.call(this.treeViewObj.element.querySelectorAll('.e-list-item:not(.e-has-child)'));
            removeClass(treeNodes, 'e-active');
            addClass([treeNodes[this.parent.uiStateValues.groupIndex]], 'e-active');
            this.treePopup.show();
            addClass([this.popupOverlay], cls.ENABLE_CLASS);
        }
    }

    public selectResourceByIndex(groupIndex: number): void {
        if (this.lastResourceLevel && groupIndex > -1 && groupIndex < this.lastResourceLevel.length) {
            this.triggerEvents(groupIndex);
        }
    }

    private resourceClick(event: NodeClickEventArgs): void {
        if (!event.node.classList.contains('e-has-child')) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], cls.ENABLE_CLASS);
            const treeNodes: HTMLLIElement[] = [].slice.call(this.treeViewObj.element.querySelectorAll('.e-list-item:not(.e-has-child)'));
            const groupIndex: number = treeNodes.indexOf(event.node);
            this.triggerEvents(groupIndex, event);
            event.event.preventDefault();
        }
    }

    private triggerEvents(groupIndex: number, event?: NodeClickEventArgs): void {
        let args: ActionEventArgs = { cancel: false, event: (event) ? event.event : null, groupIndex: groupIndex, requestType: 'resourceChange' };
        this.parent.trigger(events.actionBegin, args, (actionArgs: ActionEventArgs) => {
            if (!actionArgs.cancel) {
                this.parent.uiStateValues.groupIndex = actionArgs.groupIndex;
                this.parent.renderModule.render(this.parent.currentView);
                args = {
                    cancel: false, event: (event) ? event.event : null, groupIndex: this.parent.uiStateValues.groupIndex, requestType: 'resourceChanged'
                };
                this.parent.adaptiveGroupIndex = this.parent.uiStateValues.groupIndex;
                this.parent.trigger(events.actionComplete, args);
            }
        });
    }

    private documentClick(args: { event: Event }): void {
        if (closest(args.event.target as Element, '.' + cls.RESOURCE_TREE_POPUP)) {
            return;
        }
        const treeWrapper: Element = this.parent.element.querySelector('.' + cls.RESOURCE_TREE_POPUP);
        if (treeWrapper && treeWrapper.classList.contains(cls.POPUP_OPEN)) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], cls.ENABLE_CLASS);
        }
    }

    public bindResourcesData(isSetModel: boolean): void {
        this.parent.showSpinner();
        const promises: Promise<any>[] = [];
        for (const resource of this.parent.resources) {
            const dataModule: Data = new Data(this.parent, resource.dataSource, resource.query);
            promises.push(dataModule.getData(dataModule.generateQuery()));
        }
        Promise.all(promises).then((e: ReturnType[]) => this.dataManagerSuccess(e, isSetModel))
            .catch((e: ReturnType) => this.parent.crudModule.dataManagerFailure(e));
    }

    private dataManagerSuccess(e: ReturnType[], isSetModel: boolean): void {
        if (!this.parent || this.parent && this.parent.isDestroyed) { return; }
        this.parent.resourceCollection = [];
        for (let i: number = 0, length: number = e.length; i < length; i++) {
            const resource: ResourcesModel = this.parent.resources[parseInt(i.toString(), 10)];
            const resourceObj: ResourcesModel = this.getResourceModel(resource, e[parseInt(i.toString(), 10)].result);
            this.parent.resourceCollection.push(resourceObj);
        }
        this.refreshLayout(isSetModel);
    }

    private getResourceModel(resource: ResourcesModel, resourceData?: Record<string, any>[]): ResourcesModel {
        const resourceObj: ResourcesModel = {
            field: resource.field,
            title: resource.title,
            name: resource.name,
            allowMultiple: resource.allowMultiple,
            dataSource: resourceData || resource.dataSource,
            idField: resource.idField,
            textField: resource.textField,
            groupIDField: resource.groupIDField,
            colorField: resource.colorField,
            startHourField: resource.startHourField,
            endHourField: resource.endHourField,
            workDaysField: resource.workDaysField,
            expandedField: resource.expandedField,
            cssClassField: resource.cssClassField
        };
        return resourceObj;
    }

    public refreshLayout(isSetModel: boolean): void {
        if (isNullOrUndefined(this.parent.uiStateValues.groupIndex) || !(this.parent.enablePersistence)) {
            this.parent.uiStateValues.groupIndex = 0;
        }
        this.parent.renderElements(isSetModel);
    }

    public setResourceCollection(): void {
        let requiredResources: ResourcesModel[] = [];
        this.resourceCollection = [];
        this.colorIndex = null;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            for (const resource of this.parent.activeViewOptions.group.resources) {
                const index: number = util.findIndexInData(<Record<string, any>[]>this.parent.resourceCollection, 'name', resource);
                if (index >= 0) {
                    requiredResources.push(this.parent.resourceCollection[parseInt(index.toString(), 10)]);
                }
            }
        } else if (this.parent.resourceCollection.length > 0) {
            requiredResources = this.parent.resourceCollection;
        }
        let index: number = 0;
        for (const resource of requiredResources) {
            const resources: ResourcesModel = this.getResourceModel(resource);
            if (resource.name === this.parent.eventSettings.resourceColorField) {
                this.colorIndex = index;
            }
            index++;
            this.resourceCollection.push(resources);
        }
        if (isNullOrUndefined(this.colorIndex)) {
            this.colorIndex = this.resourceCollection.length - 1;
        }
    }

    public generateResourceLevels(innerDates: TdData[], isTimeLine?: boolean): TdData[][] {
        const resources: ResourcesModel[] = this.resourceCollection;
        const resTreeGroup: TdData[][][] = [];
        let lastColumnDates: TdData[] = [];
        const group: CallbackFunction = (resources: ResourcesModel[], index: number, prevResource?: ResourcesModel, prevResourceData?: Record<string, any>, prevOrder?: string[]): TdData[] => {
            const resTree: TdData[] = [];
            const resource: ResourcesModel = resources[0];
            if (resource) {
                let data: Record<string, any>[];
                if (prevResourceData && this.parent.activeViewOptions.group.byGroupID) {
                    const id: string = (prevResourceData as Record<string, any>)[prevResource.idField] as string;
                    data = (resource.dataSource as Record<string, any>[]).filter((e: Record<string, any>) =>
                        e[resource.groupIDField] === id);
                } else {
                    data = resource.dataSource as Record<string, any>[];
                }
                for (let i: number = 0; i < data.length; i++) {
                    let groupOrder: string[] = [];
                    if (prevOrder && prevOrder.length > 0) {
                        groupOrder = groupOrder.concat(prevOrder);
                    }
                    groupOrder.push((data[parseInt(i.toString(), 10)] as Record<string, any>)[resource.idField] as string);
                    const items: TdData[] = group(resources.slice(1), index + 1, resource, data[parseInt(i.toString(), 10)], groupOrder);
                    // Here validate child item empty top level resource only
                    if (index === 0 && items.length === 0 && this.resourceCollection.length > 1) {
                        continue;
                    }
                    let dateCol: TdData[] = [];
                    let renderDates: Date[] = this.parent.activeView.renderDates;
                    let resWorkDays: number[];
                    if (!this.parent.activeViewOptions.group.byDate && index + 1 === this.resourceCollection.length) {
                        const workDays: number[] = data[parseInt(i.toString(), 10)][resource.workDaysField] as number[];
                        const resStartHour: string = data[parseInt(i.toString(), 10)][resource.startHourField] as string;
                        const resEndHour: string = data[parseInt(i.toString(), 10)][resource.endHourField] as string;
                        if (workDays && workDays.length > 0) {
                            renderDates = this.parent.activeView.getRenderDates(workDays);
                            resWorkDays = workDays;
                            dateCol = this.parent.activeView.getDateSlots(renderDates, workDays);
                        } else {
                            resWorkDays = this.parent.activeViewOptions.workDays;
                            dateCol = innerDates;
                        }
                        const dateSlots: TdData[] = this.generateCustomHours(dateCol, resStartHour, resEndHour, groupOrder);
                        lastColumnDates = lastColumnDates.concat(dateSlots);
                    }
                    const resCssClass: string = data[parseInt(i.toString(), 10)][resource.cssClassField] as string;
                    const slotData: TreeSlotData = {
                        type: 'resourceHeader', className: ['e-resource-cells'],
                        resourceLevelIndex: index, groupOrder: groupOrder,
                        resource: resource, resourceData: data[parseInt(i.toString(), 10)],
                        colSpan: this.parent.activeViewOptions.group.byDate ? 1 : dateCol.length,
                        renderDates: renderDates, workDays: resWorkDays, cssClass: resCssClass,
                        child: items
                    };
                    resTree.push(slotData);
                }
                if (!resTreeGroup[parseInt(index.toString(), 10)]) {
                    resTreeGroup[parseInt(index.toString(), 10)] = [];
                }
                if (resTree.length > 0) {
                    resTreeGroup[parseInt(index.toString(), 10)].push(resTree);
                }
                return resTree;
            }
            return [];
        };
        this.resourceTreeLevel = group(resources, 0);
        return (isTimeLine) ? [] : this.generateHeaderLevels(resTreeGroup, lastColumnDates, innerDates);
    }

    public generateCustomHours(renderDates: TdData[], startHour: string, endHour: string, groupOrder?: string[]): TdData[] {
        const dateSlots: TdData[] = <TdData[]>extend([], renderDates, null, true);
        for (const dateSlot of dateSlots) {
            if (startHour) {
                dateSlot.startHour = this.parent.getStartEndTime(startHour);
            }
            if (endHour) {
                dateSlot.endHour = this.parent.getStartEndTime(endHour);
            }
            if (groupOrder) {
                dateSlot.groupOrder = groupOrder;
            }
        }
        return dateSlots;
    }

    private generateHeaderLevels(resTreeGroup: TdData[][][], lastColumnDates: TdData[], headerDates: TdData[]): TdData[][] {
        const headerLevels: TdData[][] = [];
        for (let i: number = resTreeGroup.length - 1; i >= 0; i--) {
            let temp: number = 0;
            for (const currentLevelChilds of resTreeGroup[parseInt(i.toString(), 10)]) {
                for (const currentLevelChild of currentLevelChilds) {
                    if (resTreeGroup[i + 1] && resTreeGroup[i + 1].length > 0) {
                        const nextLevelChilds: TdData[] = resTreeGroup[parseInt((i + 1).toString(), 10)][parseInt(temp.toString(), 10)];
                        if (!nextLevelChilds) { continue; }
                        let colSpan: number = 0;
                        for (const nextLevelChild of nextLevelChilds) {
                            if (!this.parent.activeViewOptions.group.byGroupID || (this.parent.activeViewOptions.group.byGroupID &&
                                nextLevelChild.resourceData[nextLevelChild.resource.groupIDField] ===
                                currentLevelChild.resourceData[currentLevelChild.resource.idField])) {
                                colSpan += nextLevelChild.colSpan;
                            }
                        }
                        currentLevelChild.colSpan = colSpan;
                    }
                    currentLevelChild.groupIndex = temp;
                    temp++;
                    headerLevels[currentLevelChild.resourceLevelIndex] = headerLevels[currentLevelChild.resourceLevelIndex] || [];
                    headerLevels[currentLevelChild.resourceLevelIndex].push(currentLevelChild);
                }
            }
        }
        this.lastResourceLevel = headerLevels.slice(-1)[0] || [];
        if (!this.parent.activeViewOptions.group.byDate) {
            let index: number = 0;
            for (const lastLevelResource of this.lastResourceLevel) {
                for (let i: number = 0; i < lastLevelResource.colSpan; i++) {
                    lastColumnDates[parseInt(index.toString(), 10)].groupIndex = lastLevelResource.groupIndex;
                    index++;
                }
            }
            headerLevels.push(lastColumnDates);
            return headerLevels;
        }
        const dateHeaderLevels: TdData[][] = [];
        const levels: TdData[][] = <TdData[][]>extend([], headerLevels, null, true);
        const datesColumn: TdData[] = [];
        if (this.parent.activeViewOptions.group.hideNonWorkingDays) {
            const renderDates: Date[][] = [];
            let dateIndex: number = 0;
            for (const headerDate of headerDates) {
                this.resourceDateTree[parseInt(dateIndex.toString(), 10)] = [];
                const currentDateLevels: TdData[][] = [];
                for (let j: number = 0; j < this.lastResourceLevel.length; j++) {
                    let workDays: number[] = this.lastResourceLevel[parseInt(j.toString(), 10)].resourceData[this.lastResourceLevel[parseInt(j.toString(), 10)].resource.workDaysField];
                    if (!workDays) {
                        workDays = this.parent.activeViewOptions.workDays;
                    }
                    if (workDays.indexOf(headerDate.date.getDay()) !== -1) {
                        const resTd: TdData = <TdData>extend({}, this.lastResourceLevel[parseInt(j.toString(), 10)], null, true);
                        resTd.date = headerDate.date;
                        this.lastResourceLevel[parseInt(j.toString(), 10)].workDays = workDays;
                        resTd.startHour = this.parent.getStartEndTime((resTd.resourceData[resTd.resource.startHourField] as string)) ||
                            headerDate.startHour;
                        resTd.endHour = this.parent.getStartEndTime((resTd.resourceData[resTd.resource.endHourField] as string)) ||
                            headerDate.endHour;
                        this.resourceDateTree[parseInt(dateIndex.toString(), 10)].push(resTd);
                        for (let k: number = 0; k < resTd.groupOrder.length; k++) {
                            if (!currentDateLevels[parseInt(k.toString(), 10)]) {
                                currentDateLevels[parseInt(k.toString(), 10)] = [];
                            }
                            if (k === resTd.groupOrder.length - 1) {
                                if (!renderDates[parseInt(j.toString(), 10)]) {
                                    renderDates[parseInt(j.toString(), 10)] = [];
                                }
                                const filterDates: Date[] = resTd.renderDates.filter((x: Date) => x.getDay() === headerDate.date.getDay());
                                renderDates[parseInt(j.toString(), 10)] = renderDates[parseInt(j.toString(), 10)].concat(filterDates);
                                currentDateLevels[parseInt(k.toString(), 10)].push(resTd);
                                continue;
                            }
                            const currentLevel: TdData[] = levels[parseInt(k.toString(), 10)];
                            const filteredResource: TdData[] = currentLevel.filter((data: TdData) =>
                                data.resourceData[data.resource.idField] === resTd.groupOrder[parseInt(k.toString(), 10)]);
                            if (filteredResource && filteredResource.length > 0) {
                                const existedResource: TdData[] = currentDateLevels[parseInt(k.toString(), 10)].filter((data: TdData) =>
                                    data.resourceData[data.resource.idField] === resTd.groupOrder[parseInt(k.toString(), 10)]);
                                if (existedResource && existedResource.length > 0) {
                                    existedResource[0].colSpan += 1;
                                }
                                else {
                                    const filteredTd: TdData = <TdData>extend({}, filteredResource[0], null, true);
                                    filteredTd.colSpan = 1;
                                    currentDateLevels[parseInt(k.toString(), 10)].push(filteredTd);
                                }
                            }
                        }
                    }
                }
                if (currentDateLevels.length > 0) {
                    for (let l: number = 0; l < levels.length; l++) {
                        if (!dateHeaderLevels[parseInt(l.toString(), 10)]) {
                            dateHeaderLevels[parseInt(l.toString(), 10)] = [];
                        }
                        dateHeaderLevels[parseInt(l.toString(), 10)] = dateHeaderLevels[parseInt(l.toString(), 10)].concat(currentDateLevels[parseInt(l.toString(), 10)]);
                    }
                    headerDate.colSpan = currentDateLevels[currentDateLevels.length - 1].length;
                    datesColumn.push(headerDate);
                }
                dateIndex++;
            }
            this.resourceDateTree = this.resourceDateTree.filter((data: TdData[]) => data.length > 0);
            this.lastResourceLevel.forEach((x: TdData, index: number) => {
                if (renderDates[parseInt(index.toString(), 10)]) {
                    x.renderDates = renderDates[parseInt(index.toString(), 10)].sort((a: Date, b: Date) => a.getTime() - b.getTime());
                }
            });
            dateHeaderLevels.unshift(datesColumn);
            return dateHeaderLevels;
        }
        let dateColSpan: number = 0;
        for (const firstRowTd of levels[0]) {
            dateColSpan += firstRowTd.colSpan;
        }
        for (const headerDate of headerDates) {
            headerDate.colSpan = dateColSpan;
            datesColumn.push(headerDate);
            const resGroup: TdData[][] = <TdData[][]>extend([], levels, null, true);
            for (let k: number = 0, length: number = resGroup.length; k < length; k++) {
                if (k === resGroup.length - 1) {
                    for (const resTd of resGroup[parseInt(k.toString(), 10)]) {
                        resTd.date = headerDate.date;
                        resTd.workDays = headerDate.workDays;
                        resTd.startHour = this.parent.getStartEndTime((resTd.resourceData[resTd.resource.startHourField] as string)) ||
                            headerDate.startHour;
                        resTd.endHour = this.parent.getStartEndTime((resTd.resourceData[resTd.resource.endHourField] as string)) ||
                            headerDate.endHour;
                    }
                }
                if (!dateHeaderLevels[parseInt(k.toString(), 10)]) {
                    dateHeaderLevels[parseInt(k.toString(), 10)] = [];
                }
                dateHeaderLevels[parseInt(k.toString(), 10)] = dateHeaderLevels[parseInt(k.toString(), 10)].concat(resGroup[parseInt(k.toString(), 10)]);
            }
        }
        dateHeaderLevels.unshift(datesColumn);
        return dateHeaderLevels;
    }

    public setResourceValues(eventObj: Record<string, any>, groupIndex?: number): void {
        const setValues: CallbackFunction = (index: number, field: string, value: Record<string, any>) => {
            if (this.resourceCollection[parseInt(index.toString(), 10)].allowMultiple && this.parent.activeViewOptions.group.allowGroupEdit) {
                eventObj[`${field}`] = [value];
            } else {
                eventObj[`${field}`] = value;
            }
        };
        if (groupIndex === void 0) {
            groupIndex = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex :
                this.parent.activeCellsData.groupIndex;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0 && !isNullOrUndefined(groupIndex)) {
            const groupOrder: number[] | string[] = this.lastResourceLevel[parseInt(groupIndex.toString(), 10)].groupOrder;
            for (let index: number = 0; index < this.resourceCollection.length; index++) {
                setValues(index, this.resourceCollection[parseInt(index.toString(), 10)].field, groupOrder[parseInt(index.toString(), 10)]);
            }
        } else if (this.parent.resourceCollection.length > 0) {
            for (let index: number = 0; index < this.resourceCollection.length; index++) {
                const data: Record<string, any> = (this.resourceCollection[parseInt(index.toString(), 10)] as Record<string, unknown[]>).dataSource[0] as Record<string, any>;
                if (data) { setValues(index, this.resourceCollection[parseInt(index.toString(), 10)].field, data[this.resourceCollection[parseInt(index.toString(), 10)].idField]); }
            }
        }
    }

    public getResourceColor(eventObj: Record<string, any>, groupOrder?: string[]): string {
        const colorFieldIndex: number = (!isNullOrUndefined(groupOrder) &&
            this.colorIndex > groupOrder.length - 1) ? groupOrder.length - 1 : this.colorIndex;
        const resource: ResourcesModel = this.resourceCollection[parseInt(colorFieldIndex.toString(), 10)];
        if (isNullOrUndefined(groupOrder) && this.parent.activeViewOptions.group.allowGroupEdit && resource.allowMultiple) {
            return undefined;
        }
        const id: string = isNullOrUndefined(groupOrder) ? <string>eventObj[resource.field] : <string>groupOrder[parseInt(colorFieldIndex.toString(), 10)];
        const data: Record<string, any>[] = this.filterData(resource.dataSource as Record<string, any>[], resource.idField, id);
        if (data.length > 0) {
            return data[0][resource.colorField] as string;
        }
        return undefined;
    }

    public getCssClass(eventObj: Record<string, any>): string {
        const resource: ResourcesModel = this.resourceCollection.slice(-1)[0];
        if (this.parent.activeViewOptions.group.allowGroupEdit && resource.allowMultiple) {
            return undefined;
        }
        const data: Record<string, any>[] = this.filterData(resource.dataSource as Record<string, any>[], resource.idField, eventObj[resource.field] as string);
        if (data.length > 0) {
            return data[0][resource.cssClassField] as string;
        }
        return undefined;
    }

    public getResourceRenderDates(): Date[] {
        // eslint-disable-next-line prefer-spread
        const resourceDates: Date[] = [].concat.apply([], this.lastResourceLevel.map((e: TdData) => e.renderDates));
        const time: number[] = resourceDates.map((dateObj: Date) => dateObj.getTime());
        const removeDuplicateDates: CallbackFunction = (dateColl: Date[]) => dateColl.filter((date: Date, index: number) =>
            time.indexOf(date.getTime()) === index);
        const renderDates: Date[] = removeDuplicateDates(resourceDates);
        renderDates.sort((a: Date, b: Date) => a.getTime() - b.getTime());
        return renderDates;
    }

    private filterData(dataSource: Record<string, any>[], field: string, value: string): Record<string, any>[] {
        return dataSource.filter((data: Record<string, any>) => data[`${field}`] === value);
    }

    public getResourceData(eventObj: Record<string, any>, index: number, groupEditIndex: number[]): void {
        if (this.parent.activeViewOptions.group.allowGroupEdit) {
            const resourceObj: Record<string, any> = {};
            for (const groupIndex of groupEditIndex) {
                const resourceLevel: Record<string, any>[] = this.lastResourceLevel[parseInt(groupIndex.toString(), 10)].groupOrder as unknown as Record<string, any>[];
                for (let level: number = 0, length: number = resourceLevel.length; level < length; level++) {
                    const fieldName: string = this.resourceCollection[parseInt((level as number).toString(), 10)].field;
                    if (isNullOrUndefined(resourceObj[`${fieldName}`])) {
                        resourceObj[`${fieldName}`] = [];
                    }
                    (<Record<string, any>[]>resourceObj[`${fieldName}`]).push(resourceLevel[parseInt(level.toString(), 10)]);
                }
            }
            eventObj = extend(eventObj, resourceObj) as Record<string, any>;
        } else {
            for (let level: number = 0, length: number = this.resourceCollection.length; level < length; level++) {
                if (this.lastResourceLevel[parseInt(index.toString(), 10)]) {
                    eventObj[this.resourceCollection[parseInt(level.toString(), 10)].field] = this.lastResourceLevel[parseInt(index.toString(), 10)].groupOrder[parseInt(level.toString(), 10)];
                }
            }
        }
    }

    public addResource(resources: Record<string, any> | Record<string, any>[], name: string, index: number): void {
        const resourceCollection: Record<string, any>[] = (resources instanceof Array) ? resources : [resources];
        for (const resource of this.parent.resourceCollection) {
            if (resource.name === name) {
                resourceCollection.forEach((addObj: Record<string, any>, i: number) =>
                    new DataManager({ json: resource.dataSource as Record<string, any>[] }).insert(addObj, null, null, index + i));
                break;
            }
        }
        this.refreshLayout(true);
    }

    public removeResource(resourceId: string | string[] | number | number[], name: string): void {
        const resourceCollection: (string | number)[] = (resourceId instanceof Array) ? resourceId : [resourceId];
        for (const resource of this.parent.resourceCollection) {
            if (resource.name === name) {
                resourceCollection.forEach((removeObj: string | number) =>
                    new DataManager({ json: resource.dataSource as Record<string, any>[] }).remove(resource.idField, removeObj));
                break;
            }
        }
        this.refreshLayout(true);
    }

    public getIndexFromResourceId(id: string | number, name?: string, resourceData?: ResourcesModel, event?: Record<string, any>, parentField?: string): number {
        name = name || this.parent.resourceCollection.slice(-1)[0].name;
        if (isNullOrUndefined(resourceData)) {
            resourceData = this.resourceCollection.filter((e: ResourcesModel) => e.name === name)[0];
            if (isNullOrUndefined(resourceData)) {
                return null;
            }
        }
        const resource: Record<string, any> = (resourceData.dataSource as Record<string, any>[]).filter((e: Record<string, any>) => {
            if (event && e[resourceData.idField] === id) {
                if (e[resourceData.groupIDField] === event[`${parentField}`]) {
                    return e[resourceData.idField] === id;
                }
                return null;
            } else {
                return e[resourceData.idField] === id;
            }
        })[0] as Record<string, any>;
        return (this.lastResourceLevel.map((e: TdData) => e.resourceData).indexOf(resource));
    }

    public resourceExpand(id: string | number, name: string, hide: boolean): void {
        const resource: ResourcesModel = this.parent.resourceCollection.filter((e: ResourcesModel) => {
            if (e.name === name) {
                return e;
            }
            return null;
        })[0];
        let index: number = 0;
        const resourceData: Record<string, any> = (resource.dataSource as Record<string, any>[]).filter((e: Record<string, any>) => e[resource.idField] === id)[0] as Record<string, any>;
        if (!this.parent.activeViewOptions.group.byGroupID) {
            index = this.getIndexFromResourceId(id, name, resource);
        } else {
            index = this.lastResourceLevel.map((e: TdData) => e.resourceData).indexOf(resourceData);
        }
        const target: HTMLElement =
            this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS + ' ' + `[data-group-index="${index}"]` +
                ' ' + '.' + cls.RESOURCE_TREE_ICON_CLASS) as HTMLElement;
        if (target) {
            if (target.classList.contains(cls.RESOURCE_EXPAND_CLASS) && !hide) {
                target.click();
            } else if (target.classList.contains(cls.RESOURCE_COLLAPSE_CLASS) && hide) {
                target.click();
            }
        }
    }
    public resourceScroll(id: string | number, name: string): void {
        if (this.parent.isAdaptive || ['Agenda', 'MonthAgenda'].indexOf(this.parent.currentView) > -1) {
            return;
        }
        const levelName: string = name || this.parent.resourceCollection.slice(-1)[0].name;
        let levelIndex: number = this.parent.resourceCollection.length - 1;
        const resource: ResourcesModel = this.parent.resourceCollection.filter((e: ResourcesModel, index: number) => {
            if (e.name === levelName) {
                levelIndex = index;
                return e;
            }
            return null;
        })[0];
        const scrollElement: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        let index: number = 0;
        if (this.parent.activeView.isTimelineView()) {
            if (!this.parent.activeViewOptions.group.byGroupID) {
                index = this.getIndexFromResourceId(id, levelName, resource);
            } else {
                const resourceData: Record<string, any> = (resource.dataSource as Record<string, any>[]).filter((e: Record<string, any>) =>
                    e[resource.idField] === id)[0] as Record<string, any>;
                index = this.lastResourceLevel.map((e: TdData) => e.resourceData).indexOf(resourceData);
            }
            if (this.parent.virtualScrollModule) {
                const virtual: HTMLElement = this.parent.element.querySelector('.' + cls.VIRTUAL_TRACK_CLASS) as HTMLElement;
                const averageRowHeight: number = Math.round(virtual.offsetHeight / this.expandedResources.length);
                if (this.parent.rowAutoHeight) {
                    scrollElement.scrollTop = 0;
                    this.parent.virtualScrollModule.virtualScrolling();
                }
                scrollElement.scrollTop = (index * averageRowHeight) - (((this.parent.virtualScrollModule.bufferCount - 1) * averageRowHeight));
                this.parent.virtualScrollModule.virtualScrolling();
                if (this.parent.rowAutoHeight) {
                    const td: HTMLElement =
                        this.parent.element.querySelector(`.${cls.WORK_CELLS_CLASS}[data-group-index="${index}"]`) as HTMLElement;
                    if (td && !td.parentElement.classList.contains(cls.HIDDEN_CLASS)) {
                        scrollElement.scrollTop =
                            (scrollElement.scrollTop < td.offsetTop) ? td.offsetTop : scrollElement.scrollTop + td.offsetTop;
                    }
                } else {
                    scrollElement.scrollTop = (index * averageRowHeight);
                }
            } else {
                const td: HTMLElement =
                    this.parent.element.querySelector(`.${cls.WORK_CELLS_CLASS}[data-group-index="${index}"]`) as HTMLElement;
                if (td && !td.parentElement.classList.contains(cls.HIDDEN_CLASS)) {
                    scrollElement.scrollTop = td.offsetTop;
                }
            }
        } else {
            if (!this.parent.activeViewOptions.group.byGroupID) {
                index = this.getIndexFromResourceId(id, levelName, resource);
            } else {
                if (levelName === this.parent.resourceCollection.slice(-1)[0].name) {
                    index = this.lastResourceLevel.map((e: TdData) => (e.resourceData as Record<string, any>)[resource.idField]).indexOf(id);
                } else {
                    index = (resource.dataSource as Record<string, any>[]).map((e: Record<string, any>) => e[resource.idField]).indexOf(id);
                }
            }
            const offsetTarget: Element = this.parent.currentView === 'Month' ? this.parent.element.querySelector(`.${cls.DATE_HEADER_WRAP_CLASS} tbody tr:nth-child(${levelIndex + 1})`)
                : this.parent.element.querySelector(`.${cls.HEADER_ROW_CLASS}:nth-child(${levelIndex + 1})`);
            const offset: number[] = [].slice.call(offsetTarget.children).map((node: HTMLElement) => node.offsetLeft);
            scrollElement.scrollLeft = offset[parseInt(index.toString(), 10)];
        }
    }

    public destroy(): void {
        this.parent.off(events.documentClick, this.documentClick);
        if (this.treeViewObj) {
            if ((this.treeViewObj as any).portals && (this.treeViewObj as any).portals.length > 0) {
                const treeViewTemplates: string[] = (this.treeViewObj as any).portals.map((x: any) => x.propName);
                if (treeViewTemplates.length > 0) {
                    this.parent.resetTemplates(treeViewTemplates);
                }
            }
            this.treeViewObj.destroy();
            this.treeViewObj = null;
        }
        if (this.treePopup) {
            this.treePopup.destroy();
            this.treePopup = null;
            remove(this.parent.element.querySelector('.' + cls.RESOURCE_TREE_POPUP));
            remove(this.parent.element.querySelector('.' + cls.RESOURCE_TREE_POPUP_OVERLAY));
        }
        const resToolBarEle: Element = this.parent.element.querySelector('.' + cls.RESOURCE_TOOLBAR_CONTAINER);
        if (resToolBarEle) {
            remove(resToolBarEle);
        }
    }

}
