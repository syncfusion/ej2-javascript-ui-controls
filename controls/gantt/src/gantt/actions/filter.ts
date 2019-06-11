import { TreeGrid, Filter as TreeGridFilter, FilterSettingsModel as TreeFilterSettingsModel  } from '@syncfusion/ej2-treegrid';
import { FilterEventArgs, filterAfterOpen, GroupEventArgs, getFilterMenuPostion, ColumnMenuOpenEventArgs } from '@syncfusion/ej2-grids';
import { getActualProperties } from '@syncfusion/ej2-grids';
import { Gantt } from '../base/gantt';
import { FilterSettingsModel } from '../models/models';
import { getValue, isNullOrUndefined, remove } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { NumericTextBox } from '@syncfusion/ej2-inputs';

/** 
 * The Filter module is used to handle filter action.
 */
export class Filter {
    public parent: Gantt;
    private filterMenuElement: HTMLElement;
    constructor(gantt: Gantt) {
        this.parent = gantt;
        TreeGrid.Inject(TreeGridFilter);
        this.parent.treeGrid.allowFiltering = this.parent.allowFiltering ||
            (this.parent.toolbar.indexOf('Search') !== -1 ? true : false);
        this.parent.treeGrid.filterSettings = getActualProperties(this.parent.filterSettings) as TreeFilterSettingsModel;
        this.addEventListener();
    }

    private getModuleName(): string {
        return 'filter';
    }

    private updateModel(): void {
        this.parent.filterSettings = this.parent.treeGrid.filterSettings as FilterSettingsModel;
    }
    private addEventListener(): void {
        this.parent.on('updateModel', this.updateModel, this);
        this.parent.on('actionBegin', this.actionBegin, this);
        this.parent.on('actionComplete', this.actionComplete, this);
        this.parent.on('columnMenuOpen', this.columnMenuOpen, this);
    }
    /**
     * Remove filter menu while opening column chooser menu
     * @param args 
     */
    private columnMenuOpen(args: ColumnMenuOpenEventArgs): void {
        if (this.filterMenuElement && this.parent.element.contains(this.filterMenuElement)) {
            remove(this.filterMenuElement);
        }
        this.filterMenuElement = null;
    }
    private actionBegin(args: FilterEventArgs): void {
        // ...
    }
    private actionComplete(args: GroupEventArgs): void {
        if (args.requestType === filterAfterOpen) {
            this.filterMenuElement = getValue('filterModel.dlgObj.element', args);
            this.updateFilterMenuPosition(this.filterMenuElement, args);
            // To set default values as 'contains' in filter dialog
            let taskID: string = this.parent.taskFields.id;
            let predecessor: string = this.parent.taskFields.dependency;
            let resource: string = this.parent.taskFields.resourceInfo;
            let filterObj: object = this.parent.treeGrid.grid.filterModule;
            let filterValues: object = getValue('values', filterObj);
            if ((args.columnName === predecessor && isNullOrUndefined(getValue(predecessor, filterValues)))
                || (args.columnName === resource && isNullOrUndefined(getValue(resource, filterValues)))) {
                let element: HTMLElement = this.filterMenuElement.querySelector('.e-dropdownlist');
                let instanceObj: DropDownList = getValue('ej2_instances[0]', element);
                instanceObj.index = 2;
                instanceObj.dataBind();
            } else if (args.columnName === taskID && isNullOrUndefined(getValue(taskID, filterValues))) {
                let element: HTMLElement = this.filterMenuElement.querySelector('.e-numerictextbox');
                let instanceObj: NumericTextBox = getValue('ej2_instances[0]', element);
                if (!isNullOrUndefined(instanceObj) && isNullOrUndefined(this.parent.columnByField[args.columnName].format)) {
                    instanceObj.format = 'n';
                }
            }
        }
    }
    private setPosition(li: Element, ul: HTMLElement): void {
        let gridPos: ClientRect = this.parent.element.getBoundingClientRect();
        let liPos: ClientRect = li.getBoundingClientRect();
        let left: number = liPos.left - gridPos.left;
        let top: number = liPos.top - gridPos.top;
        if (gridPos.height < top) {
            top = top - ul.offsetHeight + liPos.height;
        } else if (gridPos.height < top + ul.offsetHeight) {
            top = gridPos.height - ul.offsetHeight;
        }
        if (window.innerHeight < ul.offsetHeight + top + gridPos.top) {
            top = window.innerHeight - ul.offsetHeight - gridPos.top;
        }
        left += (this.parent.enableRtl ? - ul.offsetWidth : liPos.width);
        if (gridPos.width <= left + ul.offsetWidth) {
            left -= liPos.width + ul.offsetWidth;
        } else if (left < 0) {
            left += ul.offsetWidth + liPos.width;
        }
        ul.style.top = top + 7 + 'px';
        ul.style.left = left + 7 + 'px';
    }

    private updateFilterMenuPosition(element: HTMLElement, args: GroupEventArgs): void {
        this.parent.element.appendChild(element);
        let targetElement: HTMLElement;
        if (this.parent.showColumnMenu) {
            targetElement = document.querySelector('#treeGrid' + this.parent.controlId + '_gridcontrol_colmenu_Filter');
            this.setPosition(targetElement, getValue('filterModel.dlgObj.element', args));
        } else {
            targetElement = this.parent.treeGrid.grid.getColumnHeaderByField(args.columnName).querySelector('.e-filtermenudiv');
            getFilterMenuPostion(targetElement, getValue('filterModel.dlgObj', args), this.parent.treeGrid.grid);
        }
    }
    private removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('updateModel', this.updateModel);
        this.parent.off('actionBegin', this.actionBegin);
        this.parent.off('actionComplete', this.actionComplete);
        this.parent.off('columnMenuOpen', this.columnMenuOpen);
    }
    /**
     * To destroy module
     */
    public destroy(): void {
        this.removeEventListener();
    }
}