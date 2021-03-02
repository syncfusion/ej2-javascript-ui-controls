import { isNullOrUndefined, removeClass, addClass } from '@syncfusion/ej2-base';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';
import { ISort, IFilter, IAxisSet, IMembers, PivotEngine, IField } from '../../base/engine';
import { MaskChangeEventArgs } from '@syncfusion/ej2-inputs';
import { TreeView } from '@syncfusion/ej2-navigations';
import { OlapEngine, IOlapField } from '../../base/olap/engine';
import { PivotUtil } from '../../base/util';
import { FilterType } from '../../base/types';

/**
 * `EventBase` for active fields action.
 */
/** @hidden */
export class EventBase {
    public parent: PivotCommon;

    /**
     * Constructor for the dialog action.
     * @param {PivotCommon} parent - parent.
     * @hidden
     */
    constructor(parent?: PivotCommon) { /* eslint-disable-line */
        this.parent = parent;
    }

    /**
     * Updates sorting order for the selected field.
     * @function updateSorting
     * @param  {Event} args - Contains clicked element information to update dataSource.
     * @returns {void}
     * @hidden
     */
    public updateSorting(args: Event): void {
        if (!((args.target as HTMLElement).classList.contains(cls.FILTER_COMMON_CLASS)) &&
            !((args.target as HTMLElement).classList.contains(cls.REMOVE_CLASS))) {
            if (this.parent.filterDialog.dialogPopUp) {
                this.parent.filterDialog.dialogPopUp.close();
            }
            let target: HTMLElement = args.target as HTMLElement;
            let fieldName: string;
            let checkisDescending: HTMLElement[];
            let isDescending: boolean;
            if (target.id) {
                fieldName = target.id;
                checkisDescending = [].slice.call(target.querySelectorAll('.' + cls.SORT_DESCEND_CLASS)) as HTMLElement[];
            } else {
                fieldName = target.parentElement.id;
                checkisDescending = [].slice.call(target.parentElement.querySelectorAll('.' + cls.SORT_DESCEND_CLASS)) as HTMLElement[];
            }
            if (checkisDescending.length === 0) {
                isDescending = false;
            } else {
                isDescending = true;
            }
            //isDescending = (target.querySelectorAll(cls.SORT_DESCEND_CLASS));
            let sortObj: ISort = PivotUtil.getFieldByName(fieldName, this.parent.dataSourceSettings.sortSettings) as ISort;
            if (!isNullOrUndefined(sortObj)) {
                for (let i: number = 0; i < this.parent.dataSourceSettings.sortSettings.length; i++) {
                    if (this.parent.dataSourceSettings.sortSettings[i].name === fieldName) {
                        this.parent.dataSourceSettings.sortSettings.splice(i, 1);
                        break;
                    }
                }
                let newSortObj: ISort = { name: fieldName, order: isDescending ? 'Ascending' : 'Descending' };
                // let newSortObj: ISort = { name: fieldName, order: isNone ? 'Ascending' : isDescending ? 'None' : 'Descending' };
                this.parent.dataSourceSettings.sortSettings.push(newSortObj);
            } else {
                let newSortObj: ISort = { name: fieldName, order: isDescending ? 'Ascending' : 'Descending' };
                //let newSortObj: ISort = { name: fieldName, order: isNone ? 'Ascending' : isDescending ? 'None' : 'Descending'  };
                this.parent.dataSourceSettings.sortSettings.push(newSortObj);
            }
            /* eslint-disable */
            this.parent.control.lastSortInfo =
                this.parent.dataSourceSettings.sortSettings[this.parent.dataSourceSettings.sortSettings.length - 1];
            isDescending ? removeClass([target], cls.SORT_DESCEND_CLASS) : addClass([target], cls.SORT_DESCEND_CLASS);
            /* eslint-enable */
            // if (isDescending) {
            //     removeClass([target], cls.SORT_DESCEND_CLASS);
            //     addClass([target], cls.SORTING);
            // } else if (!isDescending && !isNone) {
            //     addClass([target], cls.SORT_DESCEND_CLASS);
            // } else if (isNone) {
            //     removeClass([target], cls.SORTING);
            // } else if (!isNone) {
            //     removeClass([target], cls.SORT_DESCEND_CLASS);
            //     removeClass([target], cls.SORTING);
            //    //addClass([target], cls.SORT_CLASS);
            // }
        }
    }

    /**
     * Updates sorting order for the selected field.
     * @function updateFiltering
     * @param {Event} args - Contains clicked element information to update dataSource.
     * @returns {void}
     * @hidden
     */
    public updateFiltering(args: Event): void {
        let target: HTMLElement = args.target as HTMLElement;
        let fieldName: string = target.parentElement.id;
        let fieldCaption: string = target.parentElement.textContent;
        let isInclude: boolean = false;
        let filterItems: string[] = [];
        let treeData: { [key: string]: Object }[] = []; /* eslint-disable-line */
        if (this.parent.dataSourceSettings.allowMemberFilter) {
            if (this.parent.dataType === 'olap') {
                treeData = this.getOlapData(fieldName, isInclude);
            } else {
                let members: IAxisSet[] =
                    PivotUtil.getClonedData(this.parent.engineModule.fieldList[fieldName].dateMember as []) as IAxisSet[];
                /* eslint-disable  */
                members =
                    this.parent.engineModule.fieldList[fieldName].sort === 'Ascending' ?
                        (members.sort((a, b) => (a.actualText > b.actualText) ? 1 :
                            ((b.actualText > a.actualText) ? -1 : 0))) :
                        this.parent.engineModule.fieldList[fieldName].sort === 'Descending' ?
                            (members.sort((a, b) => (a.actualText < b.actualText) ? 1 :
                                ((b.actualText < a.actualText) ? -1 : 0))) :
                            members;
                /* eslint-enable  */
                let filterObj: IFilter = PivotUtil.getFilterItemByName(fieldName, this.parent.dataSourceSettings.filterSettings);
                if (!isNullOrUndefined(filterObj)) {
                    isInclude = this.isValidFilterItemsAvail(fieldName, filterObj) && filterObj.type === 'Include' ? true : false;
                    filterItems = filterObj.items ? filterObj.items : [];
                }
                treeData =
                    this.getTreeData(isInclude, members, filterItems, fieldName);
            }
        }
        if (this.parent.filterDialog.dialogPopUp) {
            this.parent.filterDialog.dialogPopUp.close();
        }
        let popupTarget: HTMLElement = this.parent.control.filterTargetID;
        if (isNullOrUndefined(popupTarget)) {
            popupTarget = this.parent.moduleName !== 'pivotfieldlist' ?
                this.parent.element : document.getElementById(this.parent.parentID + '_Wrapper');
        }
        this.parent.filterDialog.createFilterDialog(treeData, fieldName, fieldCaption, popupTarget);
    }
    /**
     * Returns boolean by checing the valid filter members from the selected filter settings.
     * @function isValidFilterItemsAvail
     * @param {string} fieldName - Gets filter members for the given field name.
     * @param {IFilter} filterObj - filterObj.
     * @returns {boolean} - boolean.
     * @hidden
     */
    public isValidFilterItemsAvail(fieldName: string, filterObj: IFilter): boolean {
        let isItemAvail: boolean = false;
        let filterTypes: FilterType[] = ['Include', 'Exclude'];
        if (filterObj && filterTypes.indexOf(filterObj.type) >= 0) {
            let engineModule: PivotEngine = this.parent.engineModule as PivotEngine;
            let field: IField = engineModule.fieldList[fieldName];
            let members: IMembers = (engineModule.formatFields[fieldName] &&
                (['date', 'dateTime', 'time'].indexOf(engineModule.formatFields[fieldName].type) > -1)) ?
                field.formattedMembers : field.members;
            for (let item of filterObj.items) {
                if (members[item]) {
                    isItemAvail = true;
                    break;
                }
            }
        }
        return isItemAvail;
    }
    /* eslint-disable */
    private getOlapData(fieldName: string, isInclude: boolean): { [key: string]: Object }[] {
        let treeData: { [key: string]: Object }[] = [];
        let filterItems: string[] = [];
        this.parent.filterDialog.isSearchEnabled = false;
        let updatedTreeData: { [key: string]: Object }[] = [];
        /* eslint-enable */
        let engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
        let filterObj: IFilter = PivotUtil.getFilterItemByName(fieldName, this.parent.dataSourceSettings.filterSettings);
        if (engineModule.fieldList[fieldName].filterMembers.length === 0) {
            if (!this.parent.control.loadOnDemandInMemberEditor) {
                engineModule.getMembers(this.parent.dataSourceSettings, fieldName, true);
            } else if (filterObj && filterObj.levelCount > 1 && engineModule.fieldList[fieldName].levels.length > 1) {
                engineModule.getFilterMembers(this.parent.dataSourceSettings, fieldName, filterObj.levelCount);
            } else {
                engineModule.fieldList[fieldName].levelCount = 1;
                engineModule.getMembers(this.parent.dataSourceSettings, fieldName);
            }
        } else {
            engineModule.fieldList[fieldName].currrentMembers = {};
            engineModule.fieldList[fieldName].searchMembers = [];
        }
        let isHierarchy: boolean = engineModule.fieldList[fieldName].isHierarchy;
        /* eslint-disable */
        treeData = engineModule.fieldList[fieldName].filterMembers as { [key: string]: Object }[];
        /* eslint-enable */
        if (!isNullOrUndefined(filterObj)) {
            isInclude = filterObj.type ? filterObj.type === 'Include' ? true : false : true;
            filterItems = filterObj.items ? filterObj.items : [];
        }
        let filterItemObj: { [key: string]: string } = {};
        let dummyfilterItems: { [key: string]: string } = {};
        let memberObject: IMembers = engineModule.fieldList[fieldName].members;
        for (let item of filterItems) {
            filterItemObj[item] = item;
            dummyfilterItems[item] = item;
            if (memberObject[item]) {
                dummyfilterItems = this.getParentNode(fieldName, item, dummyfilterItems);
            }
        }
        treeData = this.getFilteredTreeNodes(fieldName, treeData as IOlapField[], dummyfilterItems, updatedTreeData, isHierarchy);
        treeData = this.getOlapTreeData(isInclude, PivotUtil.getClonedData(treeData), filterItemObj, fieldName, isHierarchy);
        treeData = this.sortOlapFilterData(treeData, engineModule.fieldList[fieldName].sort);
        return treeData;
    }

    /* eslint-disable-next-line */
    /**
     * Gets sorted filter members for the selected field.
     * @function sortOlapFilterData
     * @param {{ [key: string]: Object }[]} treeData - Gets filter members for the given field name.
     * @param {string} order - order.
     * @returns {{ [key: string]: Object }[]} - return.
     * @hidden
     */
    public sortOlapFilterData(treeData: { [key: string]: Object }[], order: string): { [key: string]: Object }[] {  /* eslint-disable-line */
        if (treeData.length > 0) {
            treeData = order === 'Ascending' ?
                (treeData.sort((a: IOlapField, b: IOlapField) => (a.caption > b.caption) ? 1 :
                    ((b.caption > a.caption) ? -1 : 0))) : order === 'Descending' ?
                    (treeData.sort((a: IOlapField, b: IOlapField) => (a.caption < b.caption) ? 1 :
                        ((b.caption < a.caption) ? -1 : 0))) : treeData;
        }
        return treeData;
    }

    private getParentIDs(treeObj: TreeView, id: string, parent: string[]): string[] {
        /* eslint-disable */
        let data: { [key: string]: Object }[] = treeObj.fields.dataSource as { [key: string]: Object }[];
        /* eslint-enable */
        let pid: string;
        for (let li of data) {
            if (li.id === id) {
                pid = li.pid as string;
                break;
            }
        }
        if (pid) {
            parent.push(pid);
            this.getParentIDs(treeObj, pid, parent);
        }
        return parent;
    }
    private getChildIDs(treeObj: TreeView, id: string, children: string[]): string[] {
        /* eslint-disable */
        let data: { [key: string]: Object }[] = treeObj.fields.dataSource as { [key: string]: Object }[];
        /* eslint-enable */
        let cID: string;
        for (let li of data) {
            if (li.pid === id) {
                cID = li.id as string;
                break;
            }
        }
        if (cID) {
            children.push(cID);
            this.getParentIDs(treeObj, cID, children);
        }
        return children;
    }
    /**
     * show tree nodes using search text.
     * @hidden
     */
    /* eslint-disable  */
    public searchTreeNodes(args: MaskChangeEventArgs, treeObj: TreeView, isFieldCollection: boolean, isHierarchy?: boolean): void {
        if (isFieldCollection) {
            let searchList: HTMLElement[] = [];
            let nonSearchList: HTMLElement[] = [];
            let list: HTMLElement[] = [].slice.call(treeObj.element.querySelectorAll('li')) as HTMLElement[];
            for (let element of list) {
                if ((element.querySelector('.e-list-text').textContent.toLowerCase()).indexOf(args.value.toLowerCase()) > -1) {
                    searchList.push(element);
                } else {
                    nonSearchList.push(element);
                }
            }
            treeObj.enableNodes(searchList);
            removeClass(searchList, cls.ICON_DISABLE);
            treeObj.disableNodes(nonSearchList);
            addClass(nonSearchList, cls.ICON_DISABLE);
            if (searchList.length > 0 && nonSearchList.length > 0) {
                for (let currentNode of searchList) {
                    let id: string = currentNode.getAttribute('data-uid');
                    let parentIDs: string[] = this.getParentIDs(treeObj, id, []);
                    let childIDs: string[] = this.getChildIDs(treeObj, id, []);
                    let pNodes: HTMLElement[] = [];
                    if (parentIDs.length > 0) {
                        for (let li of nonSearchList) {
                            if (PivotUtil.inArray(li.getAttribute('data-uid'), parentIDs) !== -1) {
                                pNodes.push(li);
                            }
                        }
                    }
                    if (childIDs.length > 0) {
                        for (let li of nonSearchList) {
                            if (PivotUtil.inArray(li.getAttribute('data-uid'), childIDs) !== -1) {
                                pNodes.push(li);
                            }
                        }
                    }
                    treeObj.enableNodes(pNodes);
                    removeClass(pNodes, cls.ICON_DISABLE);
                }
            }
            if ([].slice.call(treeObj.element.querySelectorAll('li.' + cls.ICON_DISABLE)).length === 0) {
                treeObj.collapseAll();
            } else {
                treeObj.expandAll(undefined, undefined, true);
            }
        } else {
            this.parent.searchTreeItems = [];
            if (this.parent.dataType === 'olap' && !isHierarchy) {
                this.updateOlapSearchTree(args, treeObj, isHierarchy);
            } else {
                let searchList: { [key: string]: Object }[] = [];
                let memberCount: number = 0;
                memberCount = 1;
                for (let item of this.parent.currentTreeItems) {
                    if ((item.name as string).toLowerCase().indexOf(args.value.toLowerCase()) > -1) {
                        this.parent.searchTreeItems.push(item);
                        if (memberCount <= this.parent.control.maxNodeLimitInMemberEditor) {
                            searchList.push(item);
                        }
                        memberCount++;
                    }
                }
                memberCount--;
                if (memberCount > this.parent.control.maxNodeLimitInMemberEditor) {
                    this.parent.editorLabelElement.innerText = (memberCount - this.parent.control.maxNodeLimitInMemberEditor) +
                        this.parent.control.localeObj.getConstant('editorDataLimitMsg');
                    this.parent.filterDialog.dialogPopUp.height = (this.parent.filterDialog.allowExcelLikeFilter ? '440px' : '400px');
                    this.parent.isDataOverflow = true;
                } else {
                    this.parent.editorLabelElement.innerText = '';
                    this.parent.filterDialog.dialogPopUp.height = (this.parent.filterDialog.allowExcelLikeFilter ? '400px' : '350px');
                    this.parent.isDataOverflow = false;
                }
                this.parent.isDataOverflow = (memberCount > this.parent.control.maxNodeLimitInMemberEditor);
                this.parent.editorLabelElement.parentElement.style.display = this.parent.isDataOverflow ? 'block' : 'none';
                treeObj.fields = { dataSource: searchList, id: 'id', text: 'name', isChecked: 'isSelected', parentID: 'pid' };
                treeObj.dataBind();
            }
        }
    }
    private updateOlapSearchTree(args: MaskChangeEventArgs, treeObj: TreeView, isHierarchy?: boolean): void {
        let treeData: { [key: string]: Object }[] = [];
        let filterDialog: HTMLElement = this.parent.filterDialog.dialogPopUp.element;
        let fieldName: string = filterDialog.getAttribute('data-fieldname');
        if (args.value.toLowerCase() === '') {
            this.parent.filterDialog.isSearchEnabled = false;
            (this.parent.engineModule.fieldList[fieldName] as IOlapField).searchMembers = [];
            // (this.parent.engineModule.fieldList[fieldName] as IOlapField).currrentMembers = {};
            let updatedTreeData: { [key: string]: Object }[] = [];
            let filterItemObj: { [key: string]: string } = {};
            let dummyfilterItems: { [key: string]: string } = {};
            let memberObject: IMembers = this.parent.engineModule.fieldList[fieldName].members;
            let members: string[] = Object.keys(memberObject);
            let filterItems: string[] = [];
            for (let item of members) {
                if (memberObject[item].isSelected) {
                    if (!(memberObject[item].parent && memberObject[memberObject[item].parent].isSelected)) {
                        filterItems.push(item);
                    }
                }
            }
            for (let item of filterItems) {
                filterItemObj[item] = item;
                dummyfilterItems[item] = item;
                if (memberObject[item]) {
                    dummyfilterItems = this.getParentNode(fieldName, item, dummyfilterItems);
                }
            }
            let searchData: IOlapField[] = (this.parent.engineModule.fieldList[fieldName] as IOlapField).filterMembers;
            treeData = this.getFilteredTreeNodes(fieldName, searchData, dummyfilterItems, updatedTreeData, isHierarchy);
            treeData = this.getOlapTreeData(true, PivotUtil.getClonedData(treeData), filterItemObj, fieldName, isHierarchy, true);
        } else {
            this.parent.filterDialog.isSearchEnabled = true;
            let searchData: IOlapField[] = (this.parent.engineModule.fieldList[fieldName] as IOlapField).searchMembers;
            treeData = PivotUtil.getClonedData(searchData as { [key: string]: Object }[]);
            treeData = this.getOlapSearchTreeData(true, treeData, fieldName);
        }
        treeObj.fields = { dataSource: treeData, id: 'id', text: 'name', isChecked: 'isSelected', parentID: 'pid' };
        treeObj.dataBind();
    }
    private getTreeData(isInclude: boolean, members: IAxisSet[], filterItems: string[], fieldName: string): { [key: string]: Object }[] {
        this.parent.currentTreeItems = [];
        this.parent.searchTreeItems = [];
        this.parent.currentTreeItemsPos = {};
        this.parent.savedTreeFilterPos = {};
        let engineModule: PivotEngine = this.parent.engineModule as PivotEngine;
        this.parent.isDateField = engineModule.formatFields[fieldName] &&
            ((['date', 'dateTime', 'time']).indexOf(engineModule.formatFields[fieldName].type) > -1);
        let list: { [key: string]: Object }[] = [];
        let memberCount: number = 1;
        let filterObj: { [key: string]: string } = {};
        for (let item of filterItems) {
            filterObj[item] = item;
        }
        for (let member of members) {
            let memberName: string = this.parent.isDateField ? member.formattedText : member.actualText.toString();
            /* eslint-disable */
            let obj: { [key: string]: Object } = {
                id: member.actualText.toString(),
                actualText: member.actualText,
                name: memberName,
                isSelected: isInclude ? false : true
            };
            /* eslint-enable */
            if (filterObj[memberName] !== undefined) {
                obj.isSelected = isInclude ? true : false;
            }
            if (memberCount <= this.parent.control.maxNodeLimitInMemberEditor) {
                list.push(obj);
            }
            if (!obj.isSelected) {
                this.parent.savedTreeFilterPos[memberCount - 1] = memberName;
            }
            this.parent.currentTreeItems.push(obj);
            this.parent.searchTreeItems.push(obj);
            this.parent.currentTreeItemsPos[member.actualText] = { index: memberCount - 1, isSelected: obj.isSelected as boolean };
            memberCount++;
        }
        this.parent.isDataOverflow = ((memberCount - 1) > this.parent.control.maxNodeLimitInMemberEditor);
        return list;
    }
    /* eslint-disable */
    private getOlapTreeData(isInclude: boolean, members: { [key: string]: Object }[], filterObj: { [key: string]: string }, fieldName: string, isHierarchy: boolean, isSearchRender?: boolean): { [key: string]: Object }[] {
        let engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
        let fieldList: IOlapField = engineModule.fieldList[fieldName];
        this.parent.currentTreeItems = [];
        this.parent.searchTreeItems = [];
        this.parent.currentTreeItemsPos = {};
        let list: { [key: string]: Object }[] = [];
        let memberCount: number = 1;
        for (let member of members) {
            let obj: { [key: string]: Object } = member;
            /* eslint-enable */
            let memberName: string = member.id.toString();
            if (!isSearchRender) {
                obj.isSelected = isInclude ? false : true;
            }
            if (filterObj[memberName] !== undefined) {
                obj.isSelected = isInclude ? true : false;
            }
            if (!isSearchRender && member.hasChildren) {
                this.updateChildNodeStates(fieldList.filterMembers, fieldName, member.id as string, obj.isSelected as boolean);
            }
            fieldList.members[memberName].isSelected = obj.isSelected as boolean;
            if (fieldList.currrentMembers && fieldList.currrentMembers[memberName]) {
                fieldList.currrentMembers[memberName].isSelected = obj.isSelected as boolean;
            }
            if (memberCount <= this.parent.control.maxNodeLimitInMemberEditor && isHierarchy) {
                list.push(obj);
            }
            this.parent.currentTreeItems.push(obj);
            this.parent.searchTreeItems.push(obj);
            this.parent.currentTreeItemsPos[memberName] = { index: memberCount - 1, isSelected: obj.isSelected as boolean };
            memberCount++;
        }
        this.parent.isDataOverflow = isHierarchy ? ((memberCount - 1) > this.parent.control.maxNodeLimitInMemberEditor) : false;
        return isHierarchy ? list : members;
    }
    /* eslint-disable */
    private getOlapSearchTreeData(isInclude: boolean, members: { [key: string]: Object }[], fieldName: string): { [key: string]: Object }[] {
        /* eslint-enable */
        let cMembers: IMembers = (this.parent.engineModule as OlapEngine).fieldList[fieldName].members;
        for (let member of members) {
            let memberName: string = member.id.toString();
            if (cMembers[memberName]) {
                member.isSelected = cMembers[memberName].isSelected;
            }
            this.parent.searchTreeItems.push(member);
        }
        return members;
    }
    public updateChildNodeStates(members: IOlapField[], fieldName: string, node: string, state: boolean): void {
        let cMembers: IMembers = (this.parent.engineModule as OlapEngine).fieldList[fieldName].members;
        let sMembers: IMembers = (this.parent.engineModule as OlapEngine).fieldList[fieldName].currrentMembers;
        for (let member of members) {
            if (member.pid && member.pid.toString() === node) {
                cMembers[member.id].isSelected = state;
                if (sMembers && sMembers[member.id]) {
                    sMembers[member.id].isSelected = state;
                }
                if (member.hasChildren) {
                    this.updateChildNodeStates(members, fieldName, member.id, state);
                }
            }
        }
    }

    /* eslint-disable-next-line */
    /**
     * get the parent node of particular filter members.
     * @hidden
     */
    public getParentNode(fieldName: string, item: string, filterObj: { [key: string]: string }): { [key: string]: string } {
        let members: IMembers = this.parent.engineModule.fieldList[fieldName].members;
        if (members[item].parent && item !== members[item].parent) {
            let parentItem: string = members[item].parent;
            filterObj[parentItem] = parentItem;
            this.getParentNode(fieldName, parentItem, filterObj);
        }
        return filterObj;
    }
    /* eslint-disable */
    private getFilteredTreeNodes(fieldName: string, members: IOlapField[], filterObj: { [key: string]: string }, treeData: { [key: string]: Object }[], isHierarchy: boolean): { [key: string]: Object }[] {
        /* eslint-enable */
        let parentNodes: string[] = [];
        let memberObject: IMembers = this.parent.engineModule.fieldList[fieldName].members;
        let selectedNodes: string[] = filterObj ? Object.keys(filterObj) : [];
        for (let node of selectedNodes) {
            let parent: string = memberObject[node].parent;
            if (parent !== undefined && PivotUtil.inArray(parent, parentNodes) === -1) {
                parentNodes.push(parent);
            }
        }
        for (let member of members) {
            /* eslint-disable */
            if (isNullOrUndefined(member.pid) || PivotUtil.inArray(member.pid, parentNodes) !== -1) {
                treeData.push(member as { [key: string]: Object });
                /* eslint-enable */
                if (isNullOrUndefined(member.pid) && PivotUtil.inArray(member.id, parentNodes) !== -1) {
                    memberObject[member.id].isNodeExpand = true;
                } else if (!isNullOrUndefined(member.pid) && PivotUtil.inArray(member.pid, parentNodes) !== -1) {
                    memberObject[member.id].isNodeExpand = false;
                    memberObject[member.pid].isNodeExpand = true;
                } else {
                    memberObject[member.id].isNodeExpand = false;
                }
            } else {
                memberObject[member.id].isNodeExpand = false;
            }
        }
        return treeData;
    }
}
