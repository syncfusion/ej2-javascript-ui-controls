import {
    extend, isNullOrUndefined, createElement, EventHandler, addClass, append, removeClass, remove, closest, classList, isBlazor
} from '@syncfusion/ej2-base';
import { DataManager, Query, DataUtil } from '@syncfusion/ej2-data';
import { TreeView, NodeClickEventArgs } from '@syncfusion/ej2-navigations';
import { Popup } from '@syncfusion/ej2-popups';
import { Data } from '../actions/data';
import { Schedule } from '../base/schedule';
import { ReturnType } from '../base/type';
import { TdData, ResourceDetails, NotifyEventArgs, ActionEventArgs, RenderCellEventArgs } from '../base/interface';
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

    constructor(parent: Schedule) {
        this.parent = parent;
    }

    public renderResourceHeaderIndent(tr: Element): void {
        let resColTd: Element = createElement('td', { className: cls.RESOURCE_LEFT_TD_CLASS });
        let resColDiv: Element = createElement('div', { className: cls.RESOURCE_TEXT_CLASS });
        resColTd.appendChild(resColDiv);
        let args: RenderCellEventArgs = { elementType: 'emptyCells', element: resColTd };
        this.parent.trigger(events.renderCell, args);
        tr.appendChild(resColTd);
    }

    public hideResourceRows(tBody: Element): void {
        if (this.resourceCollection.length <= 1 || this.parent.virtualScrollModule) {
            return;
        }
        let trCount: number = this.lastResourceLevel.length;
        for (let i: number = 0; i < trCount; i++) {
            let resData: { [key: string]: Object } = this.lastResourceLevel[i].resourceData;
            let res: ResourcesModel = this.lastResourceLevel[i].resource;
            if (resData.ClassName === cls.RESOURCE_PARENT_CLASS && !resData[res.expandedField] &&
                !isNullOrUndefined(resData[res.expandedField])) {
                let trCollection: HTMLElement[] = [].slice.call(tBody.children);
                let slicedCollection: HTMLElement[] = trCollection.slice(i + 1, i + (parseInt(resData.Count as string, 0) + 1));
                addClass(slicedCollection, cls.HIDDEN_CLASS);
            }
        }
    }

    public createResourceColumn(): Element {
        let resColl: ResourcesModel[] = this.resourceCollection;
        let resDiv: Element = createElement('div', { className: cls.RESOURCE_COLUMN_WRAP_CLASS });
        let tbl: Element = this.parent.activeView.createTableLayout(cls.RESOURCE_COLUMN_TABLE_CLASS);
        if (!this.parent.uiStateValues.isGroupAdaptive && this.parent.rowAutoHeight && this.parent.activeView.isTimelineView()
            && this.parent.activeViewOptions.group.resources.length > 0) {
            addClass([tbl], cls.AUTO_HEIGHT);
        }
        if (this.parent.eventSettings.ignoreWhitespace) {
            addClass([tbl], cls.IGNORE_WHITESPACE);
        }
        let tBody: Element = tbl.querySelector('tbody');
        let resData: TdData[] = this.generateTreeData(true) as TdData[];
        this.countCalculation(resColl.slice(0, -2), resColl.slice(0, -1));
        this.renderedResources = this.lastResourceLevel;
        if (this.parent.virtualScrollModule) {
            let resourceCount: number = this.parent.virtualScrollModule.getRenderedCount();
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
        let resColl: ResourcesModel[] = this.resourceCollection;
        this.generateTreeData(true) as TdData[];
        this.countCalculation(resColl.slice(0, -2), resColl.slice(0, -1));
        this.renderedResources = this.lastResourceLevel;
    }

    public setExpandedResources(): void {
        let resources: TdData[] = [];
        for (let i: number = 0; i < this.lastResourceLevel.length; i++) {
            let resource: { [key: string]: Object } = this.lastResourceLevel[i].resourceData;
            let count: number = resource.Count as number;
            resources.push(this.lastResourceLevel[i]);
            let isExpanded: boolean = resource[this.lastResourceLevel[i].resource.expandedField] as boolean;
            if (!isNullOrUndefined(isExpanded) && !isExpanded && count > 0) {
                i = i + count;
            }
        }
        this.expandedResources = resources;
    }

    public getContentRows(resData: TdData[]): Element[] {
        let resRows: Element[] = [];
        let left: string;
        let rIndex: number;
        let resColl: ResourcesModel[] = this.resourceCollection;
        let tr: Element = createElement('tr');
        let td: Element = createElement('td');
        for (let i: number = 0; i < resData.length; i++) {
            let ntd: Element = td.cloneNode() as Element;
            rIndex = util.findIndexInData(<{ [key: string]: Object }[]>resColl, 'name', resData[i].resource.name);
            if (rIndex === resColl.length - 1) {
                extend(resData[i].resourceData, { ClassName: cls.RESOURCE_CHILD_CLASS });
                this.renderedResources[i].className = [cls.RESOURCE_CHILD_CLASS];
            } else {
                extend(resData[i].resourceData, { ClassName: cls.RESOURCE_PARENT_CLASS });
                this.renderedResources[i].className = [cls.RESOURCE_PARENT_CLASS];
            }
            left = (rIndex * this.leftPixel) + 'px';
            if (resData[i].resourceData.ClassName as string === cls.RESOURCE_PARENT_CLASS
                && !isNullOrUndefined(resData[i].resourceData.Count) && (resData[i].resourceData.Count > 0)) {
                let iconClass: string;
                if (resData[i].resourceData[resColl[rIndex].expandedField] ||
                    isNullOrUndefined(resData[i].resourceData[resColl[rIndex].expandedField])) {
                    iconClass = cls.RESOURCE_COLLAPSE_CLASS;
                } else {
                    iconClass = cls.RESOURCE_EXPAND_CLASS;
                }
                let iconDiv: HTMLElement = createElement('div');
                addClass([iconDiv], [cls.RESOURCE_TREE_ICON_CLASS, iconClass]);
                this.setMargin(iconDiv, left);
                ntd.appendChild(iconDiv);
                if (this.resourceCollection.length > 1) {
                    EventHandler.add(iconDiv, 'click', this.onTreeIconClick, this);
                }
            }
            this.parent.activeView.setResourceHeaderContent(ntd, resData[i], cls.RESOURCE_TEXT_CLASS);
            ntd.setAttribute('data-group-index', resData[i].groupIndex.toString());
            if (!this.parent.activeViewOptions.resourceHeaderTemplate) {
                this.setMargin(ntd.querySelector('.' + cls.RESOURCE_TEXT_CLASS) as HTMLElement, left);
            }
            let classCollection: string[] = [cls.RESOURCE_CELLS_CLASS, resData[i].resourceData.ClassName as string];
            addClass([ntd], classCollection);
            let args: RenderCellEventArgs = { elementType: 'resourceHeader', element: ntd, groupIndex: resData[i].groupIndex };
            this.parent.trigger(events.renderCell, args);
            let ntr: Element = tr.cloneNode() as Element;
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
        let collection: { [key: string]: Object }[];
        for (let y: number = 0; y < parentCollection.length; y++) {
            let data: { [key: string]: Object }[] = parentCollection[parentCollection.length - (y + 1)]
                .dataSource as { [key: string]: Object }[];
            for (let x: number = 0; x < data.length; x++) {
                let totalCount: number = 0;
                if (this.parent.activeViewOptions.group.byGroupID) {
                    collection = new DataManager(wholeCollection[wholeCollection.length - 1].dataSource)
                        .executeLocal(new Query().where(wholeCollection[wholeCollection.length - 1].groupIDField, 'equal', data[x]
                        [parentCollection[parentCollection.length - (y + 1)].idField] as string)) as { [key: string]: Object }[];
                } else {
                    collection = wholeCollection[wholeCollection.length - 1].dataSource as { [key: string]: Object }[];
                }
                for (let z: number = 0; z < collection.length; z++) {
                    totalCount = totalCount + parseInt(collection[z].Count as string, 0);
                }
                totalCount = totalCount + parseInt(data[x].Count as string, 0);
                extend(data[x], { Count: totalCount });
            }
            wholeCollection = wholeCollection.slice(0, -1);
        }
    }

    public onTreeIconClick(e: Event): void {
        if (this.parent.eventTooltip) {
            this.parent.eventTooltip.close();
        }
        let target: Element = <HTMLElement>e.target;
        let hide: boolean;
        let trElement: HTMLTableRowElement = closest(target as Element, '.' + cls.RESOURCE_PARENT_CLASS)
            .parentElement as HTMLTableRowElement;
        let index: number = parseInt(trElement.children[0].getAttribute('data-group-index'), 10);
        let args: ActionEventArgs = {
            cancel: false, event: e, groupIndex: index,
            requestType: !target.classList.contains(cls.RESOURCE_COLLAPSE_CLASS) ? 'resourceExpand' : 'resourceCollapse',
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
                let eventElements: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS));
                eventElements.forEach((node: HTMLElement) => remove(node));
                if (this.parent.virtualScrollModule) {
                    this.updateVirtualContent(index, hide);
                } else {
                    this.updateContent(index, hide);
                }
                let data: NotifyEventArgs = { cssProperties: this.parent.getCssProperties(), module: 'scroll' };
                this.parent.notify(events.scrollUiUpdate, data);
                args = {
                    cancel: false, event: e, groupIndex: index,
                    requestType: target.classList.contains(cls.RESOURCE_COLLAPSE_CLASS) ? 'resourceExpanded' : 'resourceCollapsed',
                };
                this.parent.notify(events.dataReady, {});
                this.parent.trigger(events.actionComplete, args);
            }
        });
    }

    public updateContent(index: number, hide: boolean): void {
        let rowCollection: HTMLTableRowElement[] = [];
        let workCellCollection: HTMLTableRowElement[] = [];
        let headerRowCollection: HTMLTableRowElement[] = [];
        let pNode: boolean;
        let clickedRes: { [key: string]: Object } = this.lastResourceLevel[index].resourceData as { [key: string]: Object };
        let resRows: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.RESOURCE_COLUMN_WRAP_CLASS + ' ' + 'tr'));
        let contentRows: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_WRAP_CLASS + ' ' + 'tbody tr'));
        let eventRows: Element[] = [].slice.call(this.parent.element.querySelectorAll
            ('.' + cls.CONTENT_WRAP_CLASS + ' .' + cls.APPOINTMENT_CONTAINER_CLASS));
        for (let j: number = 0; j < clickedRes.Count; j++) {
            rowCollection.push(resRows[index + j + 1] as HTMLTableRowElement);
            workCellCollection.push(contentRows[index + j + 1] as HTMLTableRowElement);
            headerRowCollection.push(eventRows[index + j + 1] as HTMLTableRowElement);
        }
        let clonedCollection: TdData[] = this.lastResourceLevel;
        for (let i: number = 0; i < rowCollection.length; i++) {
            let expanded: boolean = true;
            pNode = rowCollection[i].children[0].classList.contains(cls.RESOURCE_PARENT_CLASS);
            clonedCollection[index].resourceData[clonedCollection[index].resource.expandedField] = !hide;
            if (hide) {
                if (pNode) {
                    let trElem: Element = rowCollection[i].querySelector('.' + cls.RESOURCE_TREE_ICON_CLASS);
                    if (trElem) {
                        classList(trElem, [cls.RESOURCE_EXPAND_CLASS], [cls.RESOURCE_COLLAPSE_CLASS]);
                    }
                }
                if (!rowCollection[i].classList.contains(cls.HIDDEN_CLASS)) {
                    addClass([rowCollection[i], workCellCollection[i], headerRowCollection[i]], cls.HIDDEN_CLASS);
                }
            } else {
                if (pNode) {
                    let rowIndex: number = rowCollection[i].rowIndex;
                    if (!clonedCollection[rowIndex].resourceData[clonedCollection[rowIndex].resource.expandedField]
                        && !isNullOrUndefined(clonedCollection[rowIndex].resourceData[clonedCollection
                        [rowIndex].resource.expandedField])) {
                        rowCollection.splice(i + 1, (parseInt(clonedCollection[rowIndex].resourceData.Count as string, 0)));
                        workCellCollection.splice(i + 1, (parseInt(clonedCollection[rowIndex].resourceData.Count as string, 0)));
                        headerRowCollection.splice(i + 1, (parseInt(clonedCollection[rowIndex].resourceData.Count as string, 0)));
                        expanded = false;
                    }
                    if (expanded) {
                        let trElem: Element = rowCollection[i].querySelector('.' + cls.RESOURCE_TREE_ICON_CLASS);
                        if (trElem) {
                            classList(trElem, [cls.RESOURCE_COLLAPSE_CLASS], [cls.RESOURCE_EXPAND_CLASS]);
                        }
                    }
                }
                if (rowCollection[i].classList.contains(cls.HIDDEN_CLASS)) {
                    removeClass([rowCollection[i], workCellCollection[i], headerRowCollection[i]], cls.HIDDEN_CLASS);
                }
            }
        }
    }

    public updateVirtualContent(index: number, expand: boolean): void {
        this.lastResourceLevel[index].resourceData[this.lastResourceLevel[index].resource.expandedField] = !expand;
        this.setExpandedResources();
        let resourceCount: number = this.parent.virtualScrollModule.getRenderedCount();
        let startIndex: number = this.expandedResources.indexOf(this.renderedResources[0]);
        this.renderedResources = this.expandedResources.slice(startIndex, startIndex + resourceCount);
        if (this.renderedResources.length < resourceCount) {
            let sIndex: number = this.expandedResources.length - resourceCount;
            sIndex = (sIndex > 0) ? sIndex : 0;
            this.renderedResources = this.expandedResources.slice(sIndex, this.expandedResources.length);
        }
        let virtualTrack: HTMLElement = this.parent.element.querySelector('.' + cls.VIRTUAL_TRACK_CLASS);
        this.parent.virtualScrollModule.updateVirtualTrackHeight(virtualTrack);
        let resTable: HTMLElement =
            this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS + ' ' + 'table') as HTMLElement;
        let contentTable: HTMLElement =
            this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' ' + 'table') as HTMLElement;
        let eventTable: HTMLElement = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS) as HTMLElement;
        this.parent.virtualScrollModule.updateContent(resTable, contentTable, eventTable, this.renderedResources);
        let timeIndicator: HTMLElement = this.parent.element.querySelector('.' + cls.CURRENT_TIMELINE_CLASS) as HTMLElement;
        if (!isNullOrUndefined(timeIndicator)) {
            timeIndicator.style.height =
                (this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement).offsetHeight + 'px';
        }
    }

    public renderResourceHeader(): void {
        let resourceWrapper: HTMLElement = createElement('div', { className: cls.RESOURCE_TOOLBAR_CONTAINER });
        resourceWrapper.innerHTML = '<div class="' + cls.RESOURCE_HEADER_TOOLBAR + '"><div class="' + cls.RESOURCE_MENU + '">' +
            '<div class="e-icons ' + cls.RESOURCE_MENU_ICON + '"></div></div><div class="' + cls.RESOURCE_LEVEL_TITLE + '"></div></div>';
        if (this.parent.currentView === 'MonthAgenda') {
            let target: Element = this.parent.activeView.getPanel().querySelector('.' + cls.CONTENT_WRAP_CLASS);
            target.insertBefore(resourceWrapper, target.querySelector('.' + cls.WRAPPER_CONTAINER_CLASS));
        } else {
            this.parent.element.insertBefore(resourceWrapper, this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS));
        }
        this.renderResourceHeaderText();
        EventHandler.add(resourceWrapper.querySelector('.' + cls.RESOURCE_MENU_ICON), 'click', this.menuClick, this);
    }

    public renderResourceTree(): void {
        this.popupOverlay = createElement('div', { className: cls.RESOURCE_TREE_POPUP_OVERLAY });
        let treeWrapper: HTMLElement = createElement('div', { className: cls.RESOURCE_TREE_POPUP + ' e-popup-close' });
        if (this.parent.currentView === 'MonthAgenda') {
            let target: Element = this.parent.activeView.getPanel().querySelector('.' + cls.WRAPPER_CONTAINER_CLASS);
            target.insertBefore(treeWrapper, target.children[0]);
            target.appendChild(this.popupOverlay);
        } else {
            this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS).appendChild(treeWrapper);
            this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS).appendChild(this.popupOverlay);
        }
        let resourceTree: HTMLElement = createElement('div', { className: cls.RESOURCE_TREE });
        treeWrapper.appendChild(resourceTree);
        this.treeViewObj = new TreeView({
            cssClass: this.parent.cssClass,
            enableRtl: this.parent.enableRtl,
            fields: {
                dataSource: [].slice.call(this.generateTreeData()) as { [key: string]: Object }[],
                id: 'resourceId',
                text: 'resourceName',
                child: 'resourceChild'
            },
            nodeTemplate: this.parent.resourceHeaderTemplate,
            nodeClicked: this.resourceClick.bind(this)
        });
        this.treeViewObj.appendTo(resourceTree);
        this.treeViewObj.expandAll();
        this.treePopup = new Popup(treeWrapper, {
            targetType: 'relative',
            actionOnScroll: 'none',
            content: this.treeViewObj.element,
            enableRtl: this.parent.enableRtl,
            hideAnimation: { name: 'SlideLeftOut', duration: 500 },
            showAnimation: { name: 'SlideLeftIn', duration: 500 },
            viewPortElement: this.parent.element.querySelector('.' + (this.parent.currentView === 'MonthAgenda' ?
                cls.WRAPPER_CONTAINER_CLASS : cls.TABLE_CONTAINER_CLASS)) as HTMLElement
        });
        this.parent.on(events.documentClick, this.documentClick, this);
    }

    private generateTreeData(isTimeLine?: boolean): ResourceDetails[] | TdData[] {
        let treeCollection: ResourceDetails[] = [];
        let resTreeColl: TdData[] = [];
        let groupIndex: number = 0;
        this.resourceTreeLevel.forEach((resTree: TreeSlotData, index: number) => {
            let treeHandler: Function = (treeLevel: TreeSlotData, index: number, levelId: string): ResourceDetails => {
                let resource: ResourcesModel = this.resourceCollection[index];
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
                for (let tree of treeLevel.child) {
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
                treeCollection.push(treeHandler(resTree, 0, (index + 1).toString()));
            } else {
                treeHandler(resTree, 0, (index + 1).toString());
            }
        });
        if (isTimeLine) {
            this.lastResourceLevel = resTreeColl;
            return resTreeColl;
        } else {
            return treeCollection;
        }
    }

    private renderResourceHeaderText(): void {
        let resource: TdData = this.lastResourceLevel[this.parent.uiStateValues.groupIndex];
        let headerCollection: HTMLElement[] = [];
        resource.groupOrder.forEach((level: string, index: number) => {
            let resourceLevel: ResourcesModel = this.resourceCollection[index];
            let resourceText: Object[] = (<Object[]>resourceLevel.dataSource).filter((resData: { [key: string]: Object }) =>
                resData[resourceLevel.idField] === level);
            let resourceName: HTMLElement = createElement('div', {
                className: cls.RESOURCE_NAME,
                innerHTML: (<{ [key: string]: Object }>resourceText[0])[resourceLevel.textField] as string
            });
            headerCollection.push(resourceName);
            let levelIcon: HTMLElement = createElement('div', { className: 'e-icons e-icon-next' });
            headerCollection.push(levelIcon);
        });
        headerCollection.pop();
        let target: HTMLElement = (this.parent.currentView === 'MonthAgenda') ? this.parent.activeView.getPanel() : this.parent.element;
        let headerWrapper: Element = target.querySelector('.' + cls.RESOURCE_LEVEL_TITLE);
        util.removeChildren(headerWrapper);
        headerCollection.forEach((element: Element) => headerWrapper.appendChild(element));
        if (this.lastResourceLevel.length === 1) {
            addClass([this.parent.element.querySelector('.' + cls.RESOURCE_MENU)], cls.DISABLE_CLASS);
        }
    }

    private menuClick(event: Event): void {
        if (this.parent.element.querySelector('.' + cls.RESOURCE_TREE_POPUP).classList.contains(cls.POPUP_OPEN)) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], cls.ENABLE_CLASS);
        } else {
            let treeNodes: HTMLElement[] = [].slice.call(this.treeViewObj.element.querySelectorAll('.e-list-item:not(.e-has-child)'));
            removeClass(treeNodes, 'e-active');
            addClass([treeNodes[this.parent.uiStateValues.groupIndex]], 'e-active');
            this.treePopup.show();
            addClass([this.popupOverlay], cls.ENABLE_CLASS);
        }
    }

    private resourceClick(event: NodeClickEventArgs): void {
        if (!event.node.classList.contains('e-has-child')) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], cls.ENABLE_CLASS);
            let treeNodes: HTMLLIElement[] = [].slice.call(this.treeViewObj.element.querySelectorAll('.e-list-item:not(.e-has-child)'));
            this.parent.uiStateValues.groupIndex = treeNodes.indexOf(event.node);
            if (this.parent.isServerRenderer()) {
                // tslint:disable-next-line:no-any
                (this.parent as any).interopAdaptor.invokeMethodAsync('OnResourceClick', this.parent.uiStateValues.groupIndex).then(() => {
                    if (this.parent.isDestroyed) { return; }
                    this.renderResourceHeaderText();
                    this.parent.activeView.serverRenderLayout();
                    let processed: Object[] = this.parent.eventBase.processData(this.parent.eventsData as { [key: string]: Object }[]);
                    this.parent.notify(events.dataReady, { processedData: processed });
                }).catch((e: ReturnType) => this.dataManagerFailure(e));
            } else {
                this.parent.renderModule.render(this.parent.currentView, false);
                let processed: Object[] = this.parent.eventBase.processData(this.parent.eventsData as { [key: string]: Object }[]);
                this.parent.notify(events.dataReady, { processedData: processed });
            }
        }
        event.event.preventDefault();
    }

    private documentClick(args: { event: Event }): void {
        if (closest(args.event.target as Element, '.' + cls.RESOURCE_TREE_POPUP)) {
            return;
        }
        let treeWrapper: Element = this.parent.element.querySelector('.' + cls.RESOURCE_TREE_POPUP);
        if (treeWrapper && treeWrapper.classList.contains(cls.POPUP_OPEN)) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], cls.ENABLE_CLASS);
        }
    }

    public bindResourcesData(isSetModel: boolean): void {
        this.parent.showSpinner();
        if (isBlazor()) {
            // the resourceCollection will be updated in layoutReady method
            // tslint:disable-next-line:no-any
            // (this.parent as any).interopAdaptor.invokeMethodAsync('BindResourcesData').then((result: string) => {
            //     if (this.parent.isDestroyed) { return; }
            //     this.parent.resourceCollection = DataUtil.parse.parseJson(result);
            //     this.refreshLayout(isSetModel);
            // }).catch((e: ReturnType) => this.dataManagerFailure(e));
            return;
        }
        let promises: Promise<Object>[] = [];
        for (let i: number = 0; i < this.parent.resources.length; i++) {
            let dataModule: Data = new Data(this.parent.resources[i].dataSource, this.parent.resources[i].query);
            promises.push(dataModule.getData(dataModule.generateQuery()));
        }
        Promise.all(promises).then((e: ReturnType[]) => this.dataManagerSuccess(e, isSetModel))
            .catch((e: ReturnType) => this.dataManagerFailure(e));
    }

    private dataManagerSuccess(e: ReturnType[], isSetModel: boolean): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.resourceCollection = [];
        for (let i: number = 0, length: number = e.length; i < length; i++) {
            let resource: ResourcesModel = this.parent.resources[i];
            let resourceObj: ResourcesModel = this.getResourceModel(resource, e[i].result);
            this.parent.resourceCollection.push(resourceObj);
        }
        this.refreshLayout(isSetModel);
    }

    private getResourceModel(resource: ResourcesModel, resourceData?: Object[]): ResourcesModel {
        let resourceObj: ResourcesModel = {
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
        this.parent.uiStateValues.groupIndex = 0;
        this.parent.renderElements(isSetModel);
    }

    public setResourceCollection(): void {
        let requiredResources: ResourcesModel[] = [];
        this.resourceCollection = [];
        this.colorIndex = null;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            for (let resource of this.parent.activeViewOptions.group.resources) {
                let index: number = util.findIndexInData(<{ [key: string]: Object }[]>this.parent.resourceCollection, 'name', resource);
                if (index >= 0) {
                    requiredResources.push(this.parent.resourceCollection[index]);
                }
            }
        } else if (this.parent.resourceCollection.length > 0) {
            requiredResources = this.parent.resourceCollection;
        }
        let index: number = 0;
        for (let resource of requiredResources) {
            let resources: ResourcesModel = this.getResourceModel(resource);
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
        let resources: ResourcesModel[] = this.resourceCollection;
        let resTreeGroup: TdData[][][] = [];
        let lastColumnDates: TdData[] = [];
        let group: Function = (resources: ResourcesModel[], index: number, prevResource?: ResourcesModel, prevResourceData?: Object,
            prevOrder?: string[]): TdData[] => {
            let resTree: TdData[] = [];
            let resource: ResourcesModel = resources[0];
            if (resource) {
                let data: Object[];
                if (prevResourceData && this.parent.activeViewOptions.group.byGroupID) {
                    let id: string = (prevResourceData as { [key: string]: Object })[prevResource.idField] as string;
                    data = (resource.dataSource as Object[]).filter((e: { [key: string]: Object }) => e[resource.groupIDField] === id);
                } else {
                    data = resource.dataSource as Object[];
                }
                for (let i: number = 0; i < data.length; i++) {
                    let groupOrder: string[] = [];
                    if (prevOrder && prevOrder.length > 0) {
                        groupOrder = groupOrder.concat(prevOrder);
                    }
                    groupOrder.push((data[i] as { [key: string]: Object })[resource.idField] as string);
                    let items: TdData[] = group(resources.slice(1), index + 1, resource, data[i], groupOrder);
                    // Here validate child item empty top level resource only
                    if (index === 0 && items.length === 0 && this.resourceCollection.length > 1) {
                        continue;
                    }
                    let dateCol: TdData[] = [];
                    let renderDates: Date[] = this.parent.activeView.renderDates;
                    let resWorkDays: number[];
                    if (!this.parent.activeViewOptions.group.byDate && index + 1 === this.resourceCollection.length) {
                        let workDays: number[] = (data[i] as { [key: string]: Object })[resource.workDaysField] as number[];
                        let resStartHour: string = (data[i] as { [key: string]: Object })[resource.startHourField] as string;
                        let resEndHour: string = (data[i] as { [key: string]: Object })[resource.endHourField] as string;
                        if (workDays && workDays.length > 0) {
                            renderDates = this.parent.activeView.getRenderDates(workDays);
                            resWorkDays = workDays;
                            dateCol = this.parent.activeView.getDateSlots(renderDates, workDays);
                        } else {
                            resWorkDays = this.parent.activeViewOptions.workDays;
                            dateCol = innerDates;
                        }
                        let dateSlots: TdData[] = this.generateCustomHours(dateCol, resStartHour, resEndHour, groupOrder);
                        lastColumnDates = lastColumnDates.concat(dateSlots);
                    }
                    let resCssClass: string = (data[i] as { [key: string]: Object })[resource.cssClassField] as string;
                    let slotData: TreeSlotData = {
                        type: 'resourceHeader', className: ['e-resource-cells'],
                        resourceLevelIndex: index, groupOrder: groupOrder,
                        resource: resource, resourceData: data[i] as { [key: string]: Object },
                        colSpan: this.parent.activeViewOptions.group.byDate ? 1 : dateCol.length,
                        renderDates: renderDates, workDays: resWorkDays, cssClass: resCssClass,
                        child: items
                    };
                    resTree.push(slotData);
                }
                if (!resTreeGroup[index]) {
                    resTreeGroup[index] = [];
                }
                resTreeGroup[index].push(resTree);
                return resTree;
            }
            return [];
        };
        this.resourceTreeLevel = group(resources, 0);
        return (isTimeLine) ? [] : this.generateHeaderLevels(resTreeGroup, lastColumnDates, innerDates);
    }

    public generateCustomHours(renderDates: TdData[], startHour: string, endHour: string, groupOrder?: string[]): TdData[] {
        let dateSlots: TdData[] = <TdData[]>extend([], renderDates, null, true);
        for (let dateSlot of dateSlots) {
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
        let headerLevels: TdData[][] = [];
        for (let i: number = resTreeGroup.length - 1; i >= 0; i--) {
            let temp: number = 0;
            for (let currentLevelChilds of resTreeGroup[i]) {
                for (let currentLevelChild of currentLevelChilds) {
                    if (resTreeGroup[i + 1]) {
                        let nextLevelChilds: TdData[] = resTreeGroup[i + 1][temp];
                        let colSpan: number = 0;
                        for (let nextLevelChild of nextLevelChilds) {
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
            for (let lastLevelResource of this.lastResourceLevel) {
                for (let i: number = 0; i < lastLevelResource.colSpan; i++) {
                    lastColumnDates[index].groupIndex = lastLevelResource.groupIndex;
                    index++;
                }
            }
            headerLevels.push(lastColumnDates);
            return headerLevels;
        }
        let dateHeaderLevels: TdData[][] = [];
        let levels: TdData[][] = <TdData[][]>extend([], headerLevels, null, true);
        let dateColSpan: number = 0;
        for (let firstRowTd of levels[0]) {
            dateColSpan += firstRowTd.colSpan;
        }
        let datesColumn: TdData[] = [];
        for (let headerDate of headerDates) {
            headerDate.colSpan = dateColSpan;
            datesColumn.push(headerDate);
            let resGroup: TdData[][] = <TdData[][]>extend([], levels, null, true);
            for (let k: number = 0, length: number = resGroup.length; k < length; k++) {
                if (k === resGroup.length - 1) {
                    for (let resTd of resGroup[k]) {
                        resTd.date = headerDate.date;
                        resTd.workDays = headerDate.workDays;
                        resTd.startHour = this.parent.getStartEndTime((resTd.resourceData[resTd.resource.startHourField] as string)) ||
                            headerDate.startHour;
                        resTd.endHour = this.parent.getStartEndTime((resTd.resourceData[resTd.resource.endHourField] as string)) ||
                            headerDate.endHour;
                    }
                }
                if (!dateHeaderLevels[k]) {
                    dateHeaderLevels[k] = [];
                }
                dateHeaderLevels[k] = dateHeaderLevels[k].concat(resGroup[k]);
            }
        }
        dateHeaderLevels.unshift(datesColumn);
        return dateHeaderLevels;
    }

    public setResourceValues(eventObj: { [key: string]: Object }, groupIndex?: number): void {
        let setValues: Function = (index: number, field: string, value: Object) => {
            if (this.resourceCollection[index].allowMultiple && this.parent.activeViewOptions.group.allowGroupEdit) {
                eventObj[field] = [value];
            } else {
                eventObj[field] = value;
            }
        };
        if (groupIndex === void 0) {
            groupIndex = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex :
                this.parent.activeCellsData.groupIndex;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0 && !isNullOrUndefined(groupIndex)) {
            let groupOrder: number[] | string[] = this.lastResourceLevel[groupIndex].groupOrder;
            for (let index: number = 0; index < this.resourceCollection.length; index++) {
                setValues(index, this.resourceCollection[index].field, groupOrder[index]);
            }
        } else if (this.parent.resourceCollection.length > 0) {
            for (let index: number = 0; index < this.resourceCollection.length; index++) {
                let data: { [key: string]: Object } = (this.resourceCollection[index] as
                    { [key: string]: Object[] }).dataSource[0] as { [key: string]: Object };
                if (data) { setValues(index, this.resourceCollection[index].field, data[this.resourceCollection[index].idField]); }
            }
        }
    }

    public getResourceColor(eventObj: { [key: string]: Object }, groupOrder?: string[]): string {
        let colorFieldIndex: number = (!isNullOrUndefined(groupOrder) &&
            this.colorIndex > groupOrder.length - 1) ? groupOrder.length - 1 : this.colorIndex;
        let resource: ResourcesModel = this.resourceCollection[colorFieldIndex];
        if (isNullOrUndefined(groupOrder) && this.parent.activeViewOptions.group.allowGroupEdit && resource.allowMultiple) {
            return undefined;
        }
        let id: string = isNullOrUndefined(groupOrder) ? <string>eventObj[resource.field] : <string>groupOrder[colorFieldIndex];
        let data: Object[] = this.filterData(resource.dataSource as Object[], resource.idField, id);
        if (data.length > 0) {
            return (data[0] as { [key: string]: Object })[resource.colorField] as string;
        }
        return undefined;
    }

    public getCssClass(eventObj: { [key: string]: Object }): string {
        let resource: ResourcesModel = this.resourceCollection.slice(-1)[0];
        if (this.parent.activeViewOptions.group.allowGroupEdit && resource.allowMultiple) {
            return undefined;
        }
        let data: Object[] = this.filterData(resource.dataSource as Object[], resource.idField, eventObj[resource.field] as string);
        if (data.length > 0) {
            return (data[0] as { [key: string]: Object })[resource.cssClassField] as string;
        }
        return undefined;
    }

    private filterData(dataSource: Object[], field: string, value: string): Object[] {
        return dataSource.filter((data: { [key: string]: Object }) => data[field] === value);
    }

    private dataManagerFailure(e: { result: Object[] }): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.trigger(events.actionFailure, { error: e }, () => this.parent.hideSpinner());
    }

    public getResourceData(eventObj: { [key: string]: Object }, index: number, groupEditIndex: number[]): void {
        if (this.parent.activeViewOptions.group.allowGroupEdit) {
            let resourceObj: { [key: string]: Object } = {};
            for (let groupIndex of groupEditIndex) {
                let resourceLevel: Object[] = this.lastResourceLevel[groupIndex].groupOrder as Object[];
                for (let level: number = 0, length: number = resourceLevel.length; level < length; level++) {
                    let fieldName: string = this.resourceCollection[level as number].field;
                    if (isNullOrUndefined(resourceObj[fieldName])) {
                        resourceObj[fieldName] = [];
                    }
                    (<Object[]>resourceObj[fieldName]).push(resourceLevel[level]);
                }
            }
            eventObj = extend(eventObj, resourceObj) as { [key: string]: Object };
        } else {
            for (let level: number = 0, length: number = this.resourceCollection.length; level < length; level++) {
                eventObj[this.resourceCollection[level].field] = this.lastResourceLevel[index].groupOrder[level];
            }
        }
    }

    public addResource(resources: Object | Object[], name: string, index: number): void {
        let resourceCollection: Object[] = (resources instanceof Array) ? resources : [resources];
        for (let resource of this.parent.resourceCollection) {
            if (resource.name === name) {
                resourceCollection.forEach((addObj: Object, i: number) =>
                    new DataManager({ json: resource.dataSource as Object[] }).insert(addObj, null, null, index + i));
                break;
            }
        }
        this.refreshLayout(true);
    }

    public removeResource(resourceId: string | string[] | number | number[], name: string): void {
        let resourceCollection: (string | number)[] = (resourceId instanceof Array) ? resourceId : [resourceId];
        for (let resource of this.parent.resourceCollection) {
            if (resource.name === name) {
                resourceCollection.forEach((removeObj: string | number) =>
                    new DataManager({ json: resource.dataSource as Object[] }).remove(resource.idField, removeObj));
                break;
            }
        }
        this.refreshLayout(true);
    }

    private getIndexFromResourceId(id: string | number, name: string, resourceData?: ResourcesModel): number {
        let resource: { [key: string]: Object } = (resourceData.dataSource as Object[]).filter((e: { [key: string]: Object }) =>
            e[resourceData.idField] === id)[0] as { [key: string]: Object };
        return (this.lastResourceLevel.map((e: TdData) => e.resourceData).indexOf(resource));
    }

    public resourceExpand(id: string | number, name: string, hide: boolean): void {
        let resource: ResourcesModel = this.parent.resourceCollection.filter((e: ResourcesModel) => {
            if (e.name === name) {
                return e;
            }
            return null;
        })[0];
        let index: number = 0;
        let resourceData: { [key: string]: Object } = (resource.dataSource as Object[]).filter((e: { [key: string]: Object }) =>
            e[resource.idField] === id)[0] as { [key: string]: Object };
        if (!this.parent.activeViewOptions.group.byGroupID) {
            index = this.getIndexFromResourceId(id, name, resource);
        } else {
            index = this.lastResourceLevel.map((e: TdData) => e.resourceData).indexOf(resourceData);
        }
        let target: HTMLElement =
            this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS + ' ' + `[data-group-index="${index}"]` +
                ' ' + '.' + cls.RESOURCE_TREE_ICON_CLASS) as HTMLElement;
        if (resourceData.ClassName === cls.RESOURCE_PARENT_CLASS && target) {
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
        let levelName: string = name || this.parent.resourceCollection.slice(-1)[0].name;
        let levelIndex: number = this.parent.resourceCollection.length - 1;
        let resource: ResourcesModel = this.parent.resourceCollection.filter((e: ResourcesModel, index: number) => {
            if (e.name === levelName) {
                levelIndex = index;
                return e;
            }
            return null;
        })[0];
        let scrollElement: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        let index: number = 0;
        if (this.parent.activeView.isTimelineView()) {
            if (!this.parent.activeViewOptions.group.byGroupID) {
                index = this.getIndexFromResourceId(id, levelName, resource);
            } else {
                let resourceData: { [key: string]: Object } = (resource.dataSource as Object[]).filter((e: { [key: string]: Object }) =>
                    e[resource.idField] === id)[0] as { [key: string]: Object };
                index = this.lastResourceLevel.map((e: TdData) => e.resourceData).indexOf(resourceData);
            }
            if (this.parent.virtualScrollModule) {
                let virtual: HTMLElement = this.parent.element.querySelector('.' + cls.VIRTUAL_TRACK_CLASS) as HTMLElement;
                let averageRowHeight: number = Math.round(virtual.offsetHeight / this.expandedResources.length);
                let isRendered: Object[] = (this.renderedResources as Object[]).filter((e: { [key: string]: Object }) =>
                    e.groupIndex === index);
                if (((((Math.round((this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement).offsetHeight / 60)
                    - this.parent.virtualScrollModule.bufferCount) < index))
                    && this.renderedResources[this.renderedResources.length - 1].groupIndex > index) && (isRendered.length === 0)) {
                    scrollElement.scrollTop =
                        (index * averageRowHeight) + ((this.parent.virtualScrollModule.bufferCount - 1) * averageRowHeight);
                } else {
                    scrollElement.scrollTop = (index * averageRowHeight);
                }
            } else {
                let td: HTMLElement =
                    this.parent.element.querySelector(`.${cls.WORK_CELLS_CLASS}[data-group-index="${index}"]`) as HTMLElement;
                if (td && !td.parentElement.classList.contains(cls.HIDDEN_CLASS)) {
                    scrollElement.scrollTop = td.offsetTop;
                }
            }
        } else {
            if (!this.parent.activeViewOptions.group.byGroupID) {
                index = this.getIndexFromResourceId(id, levelName, resource);
            } else {
                index = (resource.dataSource as Object[]).map((e: { [key: string]: Object }) => e[resource.idField]).indexOf(id);
            }
            let offsetTarget: Element = this.parent.element.querySelector(`.${cls.HEADER_ROW_CLASS}:nth-child(${levelIndex + 1})`);
            let offset: number[] = [].slice.call(offsetTarget.children).map((node: HTMLElement) => node.offsetLeft);
            scrollElement.scrollLeft = offset[index];
        }
    }

    public destroy(): void {
        this.parent.off(events.documentClick, this.documentClick);
        if (this.treeViewObj) {
            this.treeViewObj.destroy();
            this.treeViewObj = null;
        }
        if (this.treePopup) {
            this.treePopup.destroy();
            this.treePopup = null;
            remove(this.parent.element.querySelector('.' + cls.RESOURCE_TREE_POPUP));
            remove(this.parent.element.querySelector('.' + cls.RESOURCE_TREE_POPUP_OVERLAY));
        }
        let resToolBarEle: Element = this.parent.element.querySelector('.' + cls.RESOURCE_TOOLBAR_CONTAINER);
        if (resToolBarEle) {
            remove(resToolBarEle);
        }
    }
}