import { isNullOrUndefined, removeClass, addClass, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';
import { ISort, IFilter, IAxisSet, IMembers, PivotEngine, IField } from '../../base/engine';
import { MaskChangeEventArgs } from '@syncfusion/ej2-inputs';
import { TreeView } from '@syncfusion/ej2-navigations';
import { OlapEngine, IOlapField } from '../../base/olap/engine';
import { PivotUtil } from '../../base/util';
import { FilterType, Sorting } from '../../base/types';
import { HeadersSortEventArgs } from '../base/interface';
import * as events from '../base/constant';

/**
 * `EventBase` for active fields action.
 */
/** @hidden */
export class EventBase {
    /** @hidden */
    public parent: PivotCommon;
    /** @hidden */
    public searchListItem: HTMLElement[] = [];
    /**
     * Constructor for the dialog action.
     *
     * @param {PivotCommon} parent - It represent the parent.
     * @hidden
     */
    constructor(parent?: PivotCommon) {
        this.parent = parent;
    }

    /**
     * Updates sorting order for the selected field.
     *
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
            const target: HTMLElement = args.target as HTMLElement;
            let fieldName: string;
            let checkisDescending: HTMLElement[];
            let isDescending: boolean;
            if (target.id) {
                fieldName = target.getAttribute('data-uid');
                checkisDescending = [].slice.call(target.querySelectorAll('.' + cls.SORT_DESCEND_CLASS)) as HTMLElement[];
            } else {
                fieldName = target.parentElement.getAttribute('data-uid');
                checkisDescending = [].slice.call(target.parentElement.querySelectorAll('.' + cls.SORT_DESCEND_CLASS)) as HTMLElement[];
            }
            if (checkisDescending.length === 0) {
                isDescending = false;
            } else {
                isDescending = true;
            }
            //isDescending = (target.querySelectorAll(cls.SORT_DESCEND_CLASS));
            const sortObj: ISort = PivotUtil.getFieldByName(fieldName, this.parent.dataSourceSettings.sortSettings) as ISort;
            const addMembersOrder: string[] | number[] =
                this.parent.engineModule && this.parent.engineModule.fieldList[fieldName as string] &&
                    this.parent.engineModule.fieldList[fieldName as string].membersOrder ?
                    [...this.parent.engineModule.fieldList[fieldName as string].membersOrder] as string[] | number[] : [];
            if (!isNullOrUndefined(sortObj)) {
                for (let i: number = 0; i < this.parent.dataSourceSettings.sortSettings.length; i++) {
                    if (this.parent.dataSourceSettings.sortSettings[i as number].name === fieldName) {
                        this.parent.dataSourceSettings.sortSettings.splice(i, 1);
                        break;
                    }
                }
                const newSortObj: ISort = { name: fieldName, order: isDescending ? 'Ascending' : 'Descending', membersOrder: sortObj ? sortObj.membersOrder : addMembersOrder };
                // let newSortObj: ISort = { name: fieldName, order: isNone ? 'Ascending' : isDescending ? 'None' : 'Descending' };
                this.parent.dataSourceSettings.sortSettings.push(newSortObj);
            } else {
                const newSortObj: ISort = { name: fieldName, order: isDescending ? 'Ascending' : 'Descending', membersOrder: sortObj ? sortObj.membersOrder : addMembersOrder };
                //let newSortObj: ISort = { name: fieldName, order: isNone ? 'Ascending' : isDescending ? 'None' : 'Descending'  };
                this.parent.dataSourceSettings.sortSettings.push(newSortObj);
            }
            this.parent.control.lastSortInfo =
                this.parent.dataSourceSettings.sortSettings[this.parent.dataSourceSettings.sortSettings.length - 1];
            if (isDescending) {
                removeClass([target], cls.SORT_DESCEND_CLASS);
            } else {
                addClass([target], cls.SORT_DESCEND_CLASS);
            }
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
     *
     * @function updateFiltering
     * @param {Event} args - Contains clicked element information to update dataSource.
     * @returns {void}
     * @hidden
     */
    public updateFiltering(args: Event): void {
        const target: HTMLElement = args.target as HTMLElement;
        const fieldName: string = target.parentElement.getAttribute('data-uid');
        const fieldCaption: string = target.parentElement.textContent;
        let isInclude: boolean = false;
        let filterItems: string[] = [];
        let treeData: { [key: string]: Object }[] = [];
        if (this.parent.dataSourceSettings.allowMemberFilter) {
            if (this.parent.dataType === 'olap') {
                treeData = this.getOlapData(fieldName, isInclude);
            } else {
                const fieldInfo: IField = this.parent.engineModule.fieldList[fieldName as string];
                let members: IAxisSet[] =
                    PivotUtil.getClonedData(fieldInfo.dateMember as []) as IAxisSet[];
                this.parent.isDateField = PivotUtil.isDateField(fieldName as string, this.parent.engineModule as PivotEngine);
                const membersInfo: string[] | number[] = fieldInfo && fieldInfo.membersOrder ?
                    [...fieldInfo.membersOrder] as string[] | number[] : [];
                let outOfRange: IAxisSet;
                if (members[0].actualText === 'Out of Range') {
                    outOfRange = members[0];
                    members.splice(0, 1);
                }
                else if (members[members.length - 1].actualText === 'Out of Range') {
                    outOfRange = members[members.length - 1];
                    members.splice(members.length - 1, 1);
                }
                const sortDetails: HeadersSortEventArgs = {
                    fieldName: fieldName,
                    sortOrder: fieldInfo.sort as Sorting,
                    members: membersInfo && membersInfo.length > 0 ? membersInfo : Object.keys(members),
                    IsOrderChanged: false
                };
                let isHeaderSortByDefault: boolean = false;
                const sortType: string | boolean = fieldInfo && fieldInfo.isAlphanumeric ? true : undefined;
                if (membersInfo && membersInfo.length > 0) {
                    members = PivotUtil.applyCustomSort(sortDetails, members, sortType);
                }
                else {
                    members = PivotUtil.applyHeadersSort(members, sortDetails.sortOrder, sortType);
                    isHeaderSortByDefault = true;
                }
                const filterObj: IFilter = PivotUtil.getFilterItemByName(fieldName, this.parent.dataSourceSettings.filterSettings);
                if (!isNullOrUndefined(filterObj)) {
                    isInclude = this.isValidFilterItemsAvail(fieldName, filterObj) && filterObj.type === 'Include' ? true : false;
                    filterItems = filterObj.items ? filterObj.items : [];
                }
                if (outOfRange) {
                    if (sortDetails.sortOrder === 'Ascending') {
                        if (members[members.length - 1].actualText === 'Grand Total') {
                            members.splice(members.length - 1, 0, outOfRange);
                        }
                        else {
                            members.splice(members.length, 0, outOfRange);
                        }
                    }
                    else {
                        if (members[0].actualText === 'Grand Total') {
                            members.splice(1, 0, outOfRange);
                        }
                        else {
                            members.splice(0, 0, outOfRange);
                        }
                    }
                }
                if (isHeaderSortByDefault) {
                    const copyOrder: string[] | number[] = [];
                    for (let m: number = 0, n: number = 0; m < members.length; m++) {
                        if (members[m as number].actualText !== 'Grand Total') {
                            copyOrder[n++] = members[m as number].actualText;
                        }
                    }
                    sortDetails.members = copyOrder as string[];
                }
                this.parent.control.trigger(events.onHeadersSort, sortDetails);
                if (sortDetails.IsOrderChanged) {
                    members = PivotUtil.applyCustomSort(sortDetails, members, sortType, true);
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
                this.parent.element : document.getElementById(this.parent.parentID + '_Container');
        }
        this.parent.filterDialog.createFilterDialog(treeData, fieldName, fieldCaption, popupTarget);
    }
    /**
     * Returns boolean by checing the valid filter members from the selected filter settings.
     *
     * @function isValidFilterItemsAvail
     * @param {string} fieldName - Gets filter members for the given field name.
     * @param {IFilter} filterObj - filterObj.
     * @returns {boolean} - boolean.
     * @hidden
     */
    public isValidFilterItemsAvail(fieldName: string, filterObj: IFilter): boolean {
        let isItemAvail: boolean = false;
        const filterTypes: FilterType[] = ['Include', 'Exclude'];
        if (filterObj && filterTypes.indexOf(filterObj.type) >= 0) {
            if (filterObj.type === 'Include' && filterObj.items.length === 0) {
                isItemAvail = true;
            } else {
                const engineModule: PivotEngine = this.parent.engineModule as PivotEngine;
                const field: IField = engineModule.fieldList[fieldName as string];
                const members: IMembers = this.parent.dataType === 'olap' ? field.members :
                    PivotUtil.getFormattedMembers(field.members, fieldName, engineModule);
                for (const item of filterObj.items) {
                    if (members[item as string]) {
                        isItemAvail = true;
                        break;
                    }
                }
            }
        }
        return isItemAvail;
    }
    private getOlapData(fieldName: string, isInclude: boolean): { [key: string]: object }[] {
        let treeData: { [key: string]: Object }[] = [];
        let filterItems: string[] = [];
        this.parent.filterDialog.isSearchEnabled = false;
        const updatedTreeData: { [key: string]: Object }[] = [];
        const engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
        const filterObj: IFilter = PivotUtil.getFilterItemByName(fieldName, this.parent.dataSourceSettings.filterSettings);
        if (engineModule.fieldList[fieldName as string].filterMembers.length === 0) {
            if (!this.parent.control.loadOnDemandInMemberEditor) {
                engineModule.getMembers(this.parent.dataSourceSettings, fieldName, true);
            } else if (filterObj && filterObj.levelCount > 1 && engineModule.fieldList[fieldName as string].levels.length > 1) {
                engineModule.getFilterMembers(this.parent.dataSourceSettings, fieldName, filterObj.levelCount);
            } else {
                engineModule.fieldList[fieldName as string].levelCount = 1;
                engineModule.getMembers(this.parent.dataSourceSettings, fieldName);
            }
        } else {
            engineModule.fieldList[fieldName as string].currrentMembers = {};
            engineModule.fieldList[fieldName as string].searchMembers = [];
        }
        const isHierarchy: boolean = engineModule.fieldList[fieldName as string].isHierarchy;
        treeData = engineModule.fieldList[fieldName as string].filterMembers as { [key: string]: object }[];
        if (!isNullOrUndefined(filterObj)) {
            isInclude = filterObj.type ? filterObj.type === 'Include' ? true : false : true;
            filterItems = filterObj.items ? filterObj.items : [];
        }
        const filterItemObj: { [key: string]: string } = {};
        let dummyfilterItems: { [key: string]: string } = {};
        const memberObject: IMembers = engineModule.fieldList[fieldName as string].members;
        for (const item of filterItems) {
            filterItemObj[item as string] = item;
            dummyfilterItems[item as string] = item;
            if (memberObject[item as string]) {
                dummyfilterItems = this.getParentNode(fieldName, item, dummyfilterItems);
            }
        }
        treeData = this.getFilteredTreeNodes(fieldName, treeData as IOlapField[], dummyfilterItems, updatedTreeData);
        treeData = this.getOlapTreeData(isInclude, PivotUtil.getClonedData(treeData), filterItemObj, fieldName, isHierarchy);
        treeData = this.sortOlapFilterData(treeData, engineModule.fieldList[fieldName as string].sort);
        return treeData;
    }

    /**
     * Gets sorted filter members for the selected field.
     *
     * @function sortOlapFilterData
     * @param {any} treeData - Gets filter members for the given field name.
     * @param {string} order - It contains the value of order.
     * @returns {any} - It returns the sort Olap Filter Data.
     * @hidden
     */
    public sortOlapFilterData(treeData: { [key: string]: Object }[], order: string): { [key: string]: Object }[] {
        if (treeData.length > 0) {
            let isHeaderSortByDefault: boolean = false;
            const members: string[] = [];
            for (let i: number = 0; i < treeData.length; i++) {
                members.push(treeData[i as number].caption as string);
            } // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fieldName: string = treeData[0].caption !== 'Grand Total' || treeData[0].caption === undefined ? (treeData[0].htmlAttributes as any)['data-fieldName'] : (treeData[1].htmlAttributes as any)['data-fieldName'];
            const engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
            const fieldInfo: IField = engineModule.fieldList[fieldName as string];
            const membersInfo: string[] = fieldInfo && fieldInfo.membersOrder ? [...fieldInfo.membersOrder] as string[] : [];
            const sortDetails: HeadersSortEventArgs = {
                fieldName: fieldName,
                sortOrder: order as Sorting,
                members: membersInfo && membersInfo.length > 0 ? membersInfo : members,
                IsOrderChanged: false
            };
            if (membersInfo && membersInfo.length > 0) {
                this.applyFilterCustomSort(treeData, sortDetails);
            }
            else {
                treeData = order === 'Ascending' ?
                    (treeData.sort((a: IOlapField, b: IOlapField) => (a.caption > b.caption) ? 1 :
                        ((b.caption > a.caption) ? -1 : 0))) : order === 'Descending' ?
                        (treeData.sort((a: IOlapField, b: IOlapField) => (a.caption < b.caption) ? 1 :
                            ((b.caption < a.caption) ? -1 : 0))) : treeData;
                isHeaderSortByDefault = true;
            }
            if (isHeaderSortByDefault) {
                const copyOrder: string[] = [];
                for (let m: number = 0, n: number = 0; m < treeData.length; m++) {
                    if (treeData[m as number].caption !== 'Grand Total') {
                        copyOrder[n++] = treeData[m as number].caption as string;
                    }
                }
                sortDetails.members = copyOrder as string[];
            }
            this.parent.control.trigger(events.onHeadersSort, sortDetails);
            if (sortDetails.IsOrderChanged) {
                this.applyFilterCustomSort(treeData, sortDetails, true);
            }
        }
        return treeData;
    }

    private applyFilterCustomSort(
        headers: { [key: string]: Object }[], sortDetails: HeadersSortEventArgs, hasMembersOrder?: boolean): { [key: string]: Object }[] {
        let order: string[] | number[] = [];
        const updatedMembers: string[] = [];
        let grandTotal: { [key: string]: Object };
        if (sortDetails.IsOrderChanged) {
            order = sortDetails.members;
        }
        else {
            order = (sortDetails.sortOrder === 'Ascending' || sortDetails.sortOrder === 'None' || sortDetails.sortOrder === undefined) ? [].concat(sortDetails.members) : [].concat(sortDetails.members).reverse();
        }
        if (headers[0].caption === 'Grand Total') {
            grandTotal = headers[0];
            headers.shift();
        }
        for (let i: number = 0, j: number = 0; i < headers.length; i++) {
            const sortText: string = headers[i as number].caption as string;
            if (order[j as number] === sortText) {
                headers.splice(j++, 0, headers[i as number]);
                headers.splice(++i, 1);
                if (j < order.length) {
                    i = -1;
                }
                else {
                    if (!hasMembersOrder) {
                        updatedMembers.splice(--j, 0, sortText);
                    }
                    break;
                }
            }
            if (i >= 0 && !hasMembersOrder) {
                updatedMembers[i as number] = headers[i as number].caption as string;
            }
        }
        if (!hasMembersOrder) {
            for (let i: number = updatedMembers.length; i < headers.length; i++) {
                updatedMembers[i as number] = headers[i as number].caption as string;
            }
            if (updatedMembers[updatedMembers.length - 1] === 'Grand Total') {
                updatedMembers.pop();
            }
            sortDetails.members = updatedMembers;
        }
        if (grandTotal) {
            headers.splice(0, 0, grandTotal);
        }
        return headers;
    }

    /**
     * It used to get the parentIds
     *
     * @param {TreeView} treeObj - Specifies the treeview instance.
     * @param {string} id - Specifies the current node id.
     * @param {string[]} parent - Specifies the collection of parent element.
     * @returns {string[]} - Returns parentIds.
     * @hidden
     */
    public getParentIDs(treeObj: TreeView, id: string, parent: string[]): string[] {
        const data: { [key: string]: Object }[] = treeObj.fields.dataSource as { [key: string]: Object }[];
        let pid: string;
        for (const li of data) {
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

    /**
     * It used to get the childIds
     *
     * @param {TreeView} treeObj - Specifies the treeview instance.
     * @param {string} id - Specifies the current node id.
     * @param {string[]} children - Specifies the collection of clid elements.
     * @returns {string[]} - Return childIds.
     * @hidden
     */
    public getChildIDs(treeObj: TreeView, id: string, children: string[]): string[] {
        const data: { [key: string]: Object }[] = treeObj.fields.dataSource as { [key: string]: Object }[];
        let cID: string;
        for (const li of data) {
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
     *
     * @param {MaskChangeEventArgs} args -  It cotains the args data.
     * @param {TreeView} treeObj -  It cotains the treeObj data.
     * @param {boolean} isFieldCollection -  It cotains the isFieldCollection data.
     * @param {boolean} isHierarchy -  It cotains the isHierarchy data.
     * @returns {void}
     * @hidden
     */
    public searchTreeNodes(args: MaskChangeEventArgs, treeObj: TreeView, isFieldCollection: boolean, isHierarchy?: boolean): void {
        if (isFieldCollection) {
            const searchList: HTMLElement[] = [];
            const nonSearchList: HTMLElement[] = [];
            const list: HTMLElement[] = [].slice.call(treeObj.element.querySelectorAll('li')) as HTMLElement[];
            for (const element of list) {
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
                for (const currentNode of searchList) {
                    const id: string = currentNode.getAttribute('data-uid');
                    const parentIDs: string[] = this.getParentIDs(treeObj, id, []);
                    const childIDs: string[] = this.getChildIDs(treeObj, id, []);
                    const pNodes: HTMLElement[] = [];
                    if (parentIDs.length > 0) {
                        for (const li of nonSearchList) {
                            if (PivotUtil.inArray(li.getAttribute('data-uid'), parentIDs) !== -1) {
                                pNodes.push(li);
                            }
                        }
                    }
                    if (childIDs.length > 0) {
                        for (const li of nonSearchList) {
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
            this.searchListItem = searchList;
        } else {
            this.parent.searchTreeItems = [];
            if (this.parent.dataType === 'olap' && !isHierarchy) {
                this.updateOlapSearchTree(args, treeObj, isHierarchy);
            } else {
                const searchList: { [key: string]: Object }[] = [];
                let memberCount: number = 0;
                memberCount = 1;
                for (const item of this.parent.currentTreeItems) {
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
        const filterDialog: HTMLElement = this.parent.filterDialog.dialogPopUp.element;
        const fieldName: string = filterDialog.getAttribute('data-fieldname');
        if (args.value.toLowerCase() === '') {
            this.parent.filterDialog.isSearchEnabled = false;
            (this.parent.engineModule.fieldList[fieldName as string] as IOlapField).searchMembers = [];
            // (this.parent.engineModule.fieldList[fieldName as string] as IOlapField).currrentMembers = {};
            const updatedTreeData: { [key: string]: Object }[] = [];
            const filterItemObj: { [key: string]: string } = {};
            let dummyfilterItems: { [key: string]: string } = {};
            const memberObject: IMembers = this.parent.engineModule.fieldList[fieldName as string].members;
            const members: string[] = Object.keys(memberObject);
            const filterItems: string[] = [];
            for (const item of members) {
                if (memberObject[item as string].isSelected) {
                    if (!(memberObject[item as string].parent && memberObject[memberObject[item as string].parent].isSelected)) {
                        filterItems.push(item);
                    }
                }
            }
            for (const item of filterItems) {
                filterItemObj[item as string] = item;
                dummyfilterItems[item as string] = item;
                if (memberObject[item as string]) {
                    dummyfilterItems = this.getParentNode(fieldName, item, dummyfilterItems);
                }
            }
            const searchData: IOlapField[] = (this.parent.engineModule.fieldList[fieldName as string] as IOlapField).filterMembers;
            treeData = this.getFilteredTreeNodes(fieldName, searchData, dummyfilterItems, updatedTreeData);
            treeData = this.getOlapTreeData(true, PivotUtil.getClonedData(treeData), filterItemObj, fieldName, isHierarchy, true);
        } else {
            this.parent.filterDialog.isSearchEnabled = true;
            const searchData: IOlapField[] = (this.parent.engineModule.fieldList[fieldName as string] as IOlapField).searchMembers;
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
        const engineModule: PivotEngine = this.parent.engineModule as PivotEngine;
        const list: { [key: string]: Object }[] = [];
        let memberCount: number = 1;
        const filterObj: { [key: string]: string } = {};
        for (const item of filterItems) {
            filterObj[item as string] = item;
        }
        const modifiedFieldName: string = fieldName.replace(/[^a-zA-Z0-9 ]/g, '_');
        for (const member of members) {
            let memberName: string = member.actualText.toString();
            memberName = this.parent.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(memberName) : memberName;
            const actualText: string | number = this.parent.enableHtmlSanitizer ?
                SanitizeHtmlHelper.sanitize(member.actualText as string) : member.actualText;
            const nodeAttr: { [key: string]: string } = { 'data-fieldName': fieldName, 'data-memberId': actualText.toString() };
            const obj: { [key: string]: Object } = {
                id: modifiedFieldName + '_' + memberCount,
                htmlAttributes: nodeAttr,
                actualText: actualText,
                name: this.parent.isDateField ? member.formattedText :
                    engineModule.getFormattedValue(actualText, fieldName).formattedText,
                isSelected: isInclude ? false : true
            };
            if (filterObj[this.parent.isDateField ? member.formattedText as string : memberName as string] !== undefined) {
                obj.isSelected = isInclude ? true : false;
            }
            if (memberCount <= this.parent.control.maxNodeLimitInMemberEditor) {
                list.push(obj);
            }
            if (!obj.isSelected) {
                this.parent.savedTreeFilterPos[memberCount - 1] = this.parent.isDateField ? member.formattedText : memberName;
            }
            this.parent.currentTreeItems.push(obj);
            this.parent.searchTreeItems.push(obj);
            this.parent.currentTreeItemsPos[actualText as number] = { index: memberCount - 1, isSelected: obj.isSelected as boolean };
            memberCount++;
        }
        this.parent.isDataOverflow = ((memberCount - 1) > this.parent.control.maxNodeLimitInMemberEditor);
        return list;
    }
    private getOlapTreeData(
        isInclude: boolean, members: { [key: string]: Object }[], filterObj: { [key: string]: string },
        fieldName: string, isHierarchy: boolean, isSearchRender?: boolean): { [key: string]: Object }[] {
        const engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
        const fieldList: IOlapField = engineModule.fieldList[fieldName as string];
        this.parent.currentTreeItems = [];
        this.parent.searchTreeItems = [];
        this.parent.currentTreeItemsPos = {};
        const list: { [key: string]: Object }[] = [];
        let memberCount: number = 1;
        for (const member of members) {
            const obj: { [key: string]: Object } = member;
            const memberName: string = member.id.toString();
            if (!isSearchRender) {
                obj.isSelected = isInclude ? false : true;
            }
            if (filterObj[memberName as string] !== undefined) {
                obj.isSelected = isInclude ? true : false;
            }
            if (!isSearchRender && member.hasChildren) {
                this.updateChildNodeStates(fieldList.filterMembers, fieldName, member.id as string, obj.isSelected as boolean);
            }
            fieldList.members[memberName as string].isSelected = obj.isSelected as boolean;
            if (fieldList.currrentMembers && fieldList.currrentMembers[memberName as string]) {
                fieldList.currrentMembers[memberName as string].isSelected = obj.isSelected as boolean;
            }
            if (memberCount <= this.parent.control.maxNodeLimitInMemberEditor && isHierarchy) {
                list.push(obj);
            }
            this.parent.currentTreeItems.push(obj);
            this.parent.searchTreeItems.push(obj);
            this.parent.currentTreeItemsPos[memberName as string] = { index: memberCount - 1, isSelected: obj.isSelected as boolean };
            memberCount++;
        }
        this.parent.isDataOverflow = isHierarchy ? ((memberCount - 1) > this.parent.control.maxNodeLimitInMemberEditor) : false;
        return isHierarchy ? list : members;
    }
    private getOlapSearchTreeData(
        isInclude: boolean, members: { [key: string]: Object }[],
        fieldName: string): { [key: string]: Object }[] {
        const cMembers: IMembers = (this.parent.engineModule as OlapEngine).fieldList[fieldName as string].members;
        for (const member of members) {
            const memberName: string = member.id.toString();
            if (cMembers[memberName as string]) {
                member.isSelected = cMembers[memberName as string].isSelected;
            }
            this.parent.searchTreeItems.push(member);
        }
        return members;
    }

    /**
     * @param {IOlapField[]} members - members.
     * @param {string} fieldName - fieldName.
     * @param {string} node - node.
     * @param {boolean} state - state.
     * @returns {void}
     * @hidden
     */
    public updateChildNodeStates(members: IOlapField[], fieldName: string, node: string, state: boolean): void {
        const cMembers: IMembers = (this.parent.engineModule as OlapEngine).fieldList[fieldName as string].members;
        const sMembers: IMembers = (this.parent.engineModule as OlapEngine).fieldList[fieldName as string].currrentMembers;
        for (const member of members) {
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
    /** @hidden */
    public getParentNode(fieldName: string, item: string, filterObj: { [key: string]: string }): { [key: string]: string } {
        const members: IMembers = this.parent.engineModule.fieldList[fieldName as string].members;
        if (members[item as string].parent && item !== members[item as string].parent) {
            const parentItem: string = members[item as string].parent;
            filterObj[parentItem as string] = parentItem;
            this.getParentNode(fieldName, parentItem, filterObj);
        }
        return filterObj;
    }
    private getFilteredTreeNodes(
        fieldName: string, members: IOlapField[], filterObj: { [key: string]: string },
        treeData: { [key: string]: Object }[]): { [key: string]: Object }[] {
        const parentNodes: string[] = [];
        const memberObject: IMembers = this.parent.engineModule.fieldList[fieldName as string].members;
        const selectedNodes: string[] = filterObj ? Object.keys(filterObj) : [];
        for (const node of selectedNodes) {
            const parent: string = memberObject[node as string] ? memberObject[node as string].parent : undefined;
            if (parent !== undefined && PivotUtil.inArray(parent, parentNodes) === -1) {
                parentNodes.push(parent);
            }
        }
        for (const member of members) {
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
