import { isNullOrUndefined, removeClass, addClass } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';
import { ISort, IFilter, IAxisSet, IFormatSettings, IFieldOptions, IMembers, PivotEngine } from '../../base/engine';
import { MaskChangeEventArgs } from '@syncfusion/ej2-inputs';
import { TreeView } from '@syncfusion/ej2-navigations';
import { OlapEngine, IOlapField } from '../../base/olap/engine';
import { PivotUtil } from '../../base/util';

/**
 * `EventBase` for active fields action.
 */
/** @hidden */
export class EventBase {
    public parent: PivotCommon;

    /**
     * Constructor for the dialog action.
     * @hidden
     */
    constructor(parent?: PivotCommon) {
        this.parent = parent;
    }

    /**
     * Updates sorting order for the selected field.
     * @method updateSorting
     * @param  {Event} args - Contains clicked element information to update dataSource.
     * @return {void}
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
            let sortObj: ISort = this.getSortItemByName(fieldName);
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
            this.parent.control.lastSortInfo =
                this.parent.dataSourceSettings.sortSettings[this.parent.dataSourceSettings.sortSettings.length - 1];
            isDescending ? removeClass([target], cls.SORT_DESCEND_CLASS) : addClass([target], cls.SORT_DESCEND_CLASS);
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
     * @method updateFiltering
     * @param  {Event} args - Contains clicked element information to update dataSource.
     * @return {void}
     * @hidden
     */
    public updateFiltering(args: Event): void {
        let target: HTMLElement = args.target as HTMLElement;
        let fieldName: string = target.parentElement.id;
        let fieldCaption: string = target.parentElement.textContent;
        let isInclude: boolean = false;
        let filterItems: string[] = [];
        let treeData: { [key: string]: Object }[] = [];
        if (this.parent.dataType === 'olap') {
            treeData = this.getOlapData(fieldName, isInclude);
        } else {
            /* tslint:disable:typedef */
            this.parent.engineModule.fieldList[fieldName].dateMember = this.parent.engineModule.fieldList[fieldName].sort === 'Ascending' ?
                (this.parent.engineModule.fieldList[fieldName].dateMember.sort((a, b) => (a.actualText > b.actualText) ? 1 :
                    ((b.actualText > a.actualText) ? -1 : 0))) :
                this.parent.engineModule.fieldList[fieldName].sort === 'Descending' ?
                    (this.parent.engineModule.fieldList[fieldName].dateMember.sort((a, b) => (a.actualText < b.actualText) ? 1 :
                        ((b.actualText < a.actualText) ? -1 : 0))) :
                    this.parent.engineModule.fieldList[fieldName].dateMember;
            /* tslint:enable:typedef */
            let filterObj: IFilter = this.getFilterItemByName(fieldName);
            if (!isNullOrUndefined(filterObj)) {
                isInclude = filterObj.type === 'Include' ? true : false;
                filterItems = filterObj.items ? filterObj.items : [];
            }
            treeData =
                this.getTreeData(isInclude, this.parent.engineModule.fieldList[fieldName].dateMember, filterItems, fieldName);
        }
        if (this.parent.filterDialog.dialogPopUp) {
            this.parent.filterDialog.dialogPopUp.close();
        }
        let popupTarget: HTMLElement;
        popupTarget = this.parent.moduleName !== 'pivotfieldlist' ?
            popupTarget = this.parent.element : popupTarget = document.getElementById(this.parent.parentID + '_Wrapper');
        this.parent.filterDialog.createFilterDialog(treeData, fieldName, fieldCaption, popupTarget);
    }

    private getOlapData(fieldName: string, isInclude: boolean): { [key: string]: Object }[] {
        let treeData: { [key: string]: Object }[] = [];
        let filterItems: string[] = [];
        this.parent.filterDialog.isSearchEnabled = false;
        let updatedTreeData: { [key: string]: Object }[] = [];
        let engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
        let filterObj: IFilter = this.getFilterItemByName(fieldName);
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
        treeData = engineModule.fieldList[fieldName].filterMembers as { [key: string]: Object }[];
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

    /**
     * Gets sorted filter members for the selected field.
     * @method sortFilterData
     * @param  {{ [key: string]: Object }[]} treeData - Gets filter members for the given field name.
     * @return {{ [key: string]: Object }[]}
     * @hidden
     */
    public sortOlapFilterData(treeData: { [key: string]: Object }[], order: string): { [key: string]: Object }[] {
        if (treeData.length > 0) {
            /* tslint:disable:typedef */
            treeData = order === 'Ascending' ?
                (treeData.sort((a: IOlapField, b: IOlapField) => (a.caption > b.caption) ? 1 :
                    ((b.caption > a.caption) ? -1 : 0))) : order === 'Descending' ?
                    (treeData.sort((a: IOlapField, b: IOlapField) => (a.caption < b.caption) ? 1 :
                        ((b.caption < a.caption) ? -1 : 0))) : treeData;
            /* tslint:enable:typedef */
        }
        return treeData;
    }

    /**
     * Gets sort object for the given field name from the dataSource.
     * @method getSortItemByName
     * @param  {string} fieldName - Gets sort settings for the given field name.
     * @return {ISort}
     * @hidden
     */
    public getSortItemByName(fieldName: string): ISort {
        let sortObjects: ISort[] = this.parent.dataSourceSettings.sortSettings;
        return new DataManager({ json: sortObjects }).executeLocal(new Query().where('name', 'equal', fieldName))[0] as ISort;
    }

    /**
     * Gets filter object for the given field name from the dataSource.
     * @method getFilterItemByName
     * @param  {string} fieldName - Gets filter settings for the given field name.
     * @return {IFilter}
     * @hidden
     */
    public getFilterItemByName(fieldName: string): IFilter {
        let filterObjects: IFilter[] = this.parent.dataSourceSettings.filterSettings;
        let filterItems: IFilter[] = new DataManager({ json: filterObjects }).executeLocal(new Query().where('name', 'equal', fieldName));
        if (filterItems && filterItems.length > 0) {
            return filterItems[filterItems.length - 1];
        }
        return undefined;
    }

    /**
     * Gets filter object for the given field name from the dataSource.
     * @method getFieldByName
     * @param  {string} fieldName - Gets filter settings for the given field name.
     * @return {Sort}
     * @hidden
     */
    public getFieldByName(fieldName: string, fields: IFieldOptions[]): IFieldOptions {
        return new DataManager({ json: fields }).executeLocal(new Query().where('name', 'equal', fieldName))[0] as IFieldOptions;
    }

    /**
     * Gets format object for the given field name from the dataSource.
     * @method getFilterItemByName
     * @param  {string} fieldName - Gets format settings for the given field name.
     * @return {IFormatSettings}
     * @hidden
     */
    public getFormatItemByName(fieldName: string): IFormatSettings {
        let formatObjects: IFormatSettings[] = this.parent.dataSourceSettings.formatSettings;
        return new DataManager({ json: formatObjects }).executeLocal(new Query().where('name', 'equal', fieldName))[0] as IFormatSettings;
    }

    private getParentIDs(treeObj: TreeView, id: string, parent: string[]): string[] {
        let data: { [key: string]: Object }[] = treeObj.fields.dataSource as { [key: string]: Object }[];
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
        let data: { [key: string]: Object }[] = treeObj.fields.dataSource as { [key: string]: Object }[];
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
    /* tslint:disable:max-func-body-length */
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
            let obj: { [key: string]: Object } = {
                id: member.actualText.toString(),
                name: memberName,
                isSelected: isInclude ? false : true
            };
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
            this.parent.currentTreeItemsPos[member.actualText] = memberCount - 1;
            memberCount++;
        }
        this.parent.isDataOverflow = ((memberCount - 1) > this.parent.control.maxNodeLimitInMemberEditor);
        return list;
    }
    /* tslint:disable-next-line:max-line-length */
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
            this.parent.currentTreeItemsPos[memberName] = memberCount - 1;
            memberCount++;
        }
        this.parent.isDataOverflow = isHierarchy ? ((memberCount - 1) > this.parent.control.maxNodeLimitInMemberEditor) : false;
        return isHierarchy ? list : members;
    }
    /* tslint:disable-next-line:max-line-length */
    private getOlapSearchTreeData(isInclude: boolean, members: { [key: string]: Object }[], fieldName: string): { [key: string]: Object }[] {
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
    /* tslint:disable-next-line:max-line-length */
    private getFilteredTreeNodes(fieldName: string, members: IOlapField[], filterObj: { [key: string]: string }, treeData: { [key: string]: Object }[], isHierarchy: boolean): { [key: string]: Object }[] {
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
            if (isNullOrUndefined(member.pid) || PivotUtil.inArray(member.pid, parentNodes) !== -1) {
                treeData.push(member as { [key: string]: Object });
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