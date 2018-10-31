import { isNullOrUndefined, removeClass, addClass } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';
import { ISort, IFilter, IAxisSet, IFormatSettings } from '../../base/engine';
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
            sortObj = (<{ [key: string]: Object }>sortObj).properties ?
                (<{ [key: string]: Object }>sortObj).properties : sortObj;
            sortObj.order = isDescending ? 'Ascending' : 'Descending';
        } else {
            let newSortObj: ISort = { name: fieldName, order: isDescending ? 'Ascending' : 'Descending' };
            this.parent.dataSource.sortSettings.push(newSortObj);
        }
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
        this.parent.engineModule.fieldList[fieldName].dateMember = new DataManager(this.parent.engineModule.
            fieldList[fieldName].dateMember as JSON[]).executeLocal(new Query().
                sortBy('actualText', this.parent.engineModule.fieldList[fieldName].sort.toLowerCase()));
        let filterObj: IFilter = this.getFilterItemByName(fieldName);
        if (!isNullOrUndefined(filterObj)) {
            isInclude = filterObj.type === 'Include' ? true : false;
            filterItems = filterObj.items;
        }
        let treeData: { [key: string]: Object }[] =
            this.getTreeData(isInclude, this.parent.engineModule.fieldList[fieldName].dateMember, filterItems);
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
    public searchTreeNodes(args: MaskChangeEventArgs, treeObj: TreeView): void {
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
    }
    private getTreeData(isInclude: boolean, members: IAxisSet[], filterItems: string[]): { [key: string]: Object }[] {
        let list: { [key: string]: Object }[] = [];
        for (let member of members) {
            let obj: { [key: string]: Object } = {
                id: member.formattedText,
                name: member.formattedText,
                checkedStatus: isInclude ? false : true
            };
            if (filterItems && filterItems.indexOf(member.formattedText) >= 0) {
                obj.checkedStatus = isInclude ? true : false;
            }
            list.push(obj);
        }
        return list;
    }
}