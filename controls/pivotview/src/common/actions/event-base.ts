import { isNullOrUndefined, removeClass, addClass } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';
import { ISort, IFilter, IAxisSet, IFormatSettings, IFieldOptions } from '../../base/engine';
import { MaskChangeEventArgs } from '@syncfusion/ej2-inputs';
import { TreeView } from '@syncfusion/ej2-navigations';

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
        if (this.parent.filterDialog.dialogPopUp) {
            this.parent.filterDialog.dialogPopUp.close();
        }
        let target: HTMLElement = args.target as HTMLElement;
        let fieldName: string = target.parentElement.id;
        let isDescending: boolean = target.classList.contains(cls.SORT_DESCEND_CLASS);
        let sortObj: ISort = this.getSortItemByName(fieldName);
        if (!isNullOrUndefined(sortObj)) {
            for (let i: number = 0; i < this.parent.dataSource.sortSettings.length; i++) {
                if (this.parent.dataSource.sortSettings[i].name === fieldName) {
                    this.parent.dataSource.sortSettings.splice(i, 1);
                    break;
                }
            }
            let newSortObj: ISort = { name: fieldName, order: isDescending ? 'Ascending' : 'Descending' };
            this.parent.dataSource.sortSettings.push(newSortObj);
        } else {
            let newSortObj: ISort = { name: fieldName, order: isDescending ? 'Ascending' : 'Descending' };
            this.parent.dataSource.sortSettings.push(newSortObj);
        }
        this.parent.control.lastSortInfo = this.parent.dataSource.sortSettings[this.parent.dataSource.sortSettings.length - 1];
        isDescending ? removeClass([target], cls.SORT_DESCEND_CLASS) : addClass([target], cls.SORT_DESCEND_CLASS);
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
        let treeData: { [key: string]: Object }[] =
            this.getTreeData(isInclude, this.parent.engineModule.fieldList[fieldName].dateMember, filterItems, fieldName);
        if (this.parent.filterDialog.dialogPopUp) {
            this.parent.filterDialog.dialogPopUp.close();
        }
        let popupTarget: HTMLElement;
        popupTarget = this.parent.moduleName !== 'pivotfieldlist' ?
            popupTarget = this.parent.element : popupTarget = document.getElementById(this.parent.parentID + '_Wrapper');
        this.parent.filterDialog.createFilterDialog(treeData, fieldName, fieldCaption, popupTarget);
    }

    /**
     * Gets sort object for the given field name from the dataSource.
     * @method getSortItemByName
     * @param  {string} fieldName - Gets sort settings for the given field name.
     * @return {Sort}
     * @hidden
     */
    public getSortItemByName(fieldName: string): ISort {
        let sortObjects: ISort[] = this.parent.dataSource.sortSettings;
        return new DataManager({ json: sortObjects }).executeLocal(new Query().where('name', 'equal', fieldName))[0] as ISort;
    }

    /**
     * Gets filter object for the given field name from the dataSource.
     * @method getFilterItemByName
     * @param  {string} fieldName - Gets filter settings for the given field name.
     * @return {Sort}
     * @hidden
     */
    public getFilterItemByName(fieldName: string): IFilter {
        let filterObjects: IFilter[] = this.parent.dataSource.filterSettings;
        return new DataManager({ json: filterObjects }).executeLocal(new Query().where('name', 'equal', fieldName))[0] as IFilter;
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
        let formatObjects: IFormatSettings[] = this.parent.dataSource.formatSettings;
        return new DataManager({ json: formatObjects }).executeLocal(new Query().where('name', 'equal', fieldName))[0] as IFormatSettings;
    }

    /**
     * show tree nodes using search text.
     * @hidden
     */
    public searchTreeNodes(args: MaskChangeEventArgs, treeObj: TreeView, isFieldCollection: boolean): void {
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
            treeObj.disableNodes(nonSearchList);
        } else {
            let searchList: { [key: string]: Object }[] = [];
            this.parent.searchTreeItems = [];
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
            this.parent.editorLabelElement.parentElement.style.display = this.parent.isDataOverflow ? 'inline-block' : 'none';
            treeObj.fields = { dataSource: searchList, id: 'id', text: 'name', isChecked: 'checkedStatus' };
            treeObj.dataBind();
        }
    }
    private getTreeData(isInclude: boolean, members: IAxisSet[], filterItems: string[], fieldName: string): { [key: string]: Object }[] {
        this.parent.currentTreeItems = [];
        this.parent.searchTreeItems = [];
        this.parent.currentTreeItemsPos = {};
        this.parent.savedTreeFilterPos = {};
        this.parent.isDateField = this.parent.engineModule.formatFields[fieldName] &&
            ((['date', 'dateTime', 'time']).indexOf(this.parent.engineModule.formatFields[fieldName].type) > -1);
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
                checkedStatus: isInclude ? false : true
            };
            if (filterObj[memberName] !== undefined) {
                obj.checkedStatus = isInclude ? true : false;
            }
            if (memberCount <= this.parent.control.maxNodeLimitInMemberEditor) {
                list.push(obj);
            }
            if (!obj.checkedStatus) {
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
}