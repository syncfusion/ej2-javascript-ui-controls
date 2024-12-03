import { IGrid, IFilterMUI, EJ2Intance } from '../base/interface';
import { Column } from '../models/column';
import { FilterSettings } from '../base/grid';
import { L10n } from '@syncfusion/ej2-base';
import { eventPromise, getZIndexCalcualtion } from '../base/util';
import { ServiceLocator } from '../services/service-locator';
import { Query, DataManager, DataUtil, Deferred } from '@syncfusion/ej2-data';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Filter } from '../actions/filter';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { FlMenuOptrUI } from './filter-menu-operator';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import * as events from '../base/constant';
import * as literals from '../base/string-literals';
import { FilterStateObj } from '../common/filter-interface';
import { PredicateModel } from '../base/grid-model';

/**
 * `boolfilterui` render boolean column.
 *
 * @hidden
 */

export class BooleanFilterUI implements IFilterMUI {

    private parent: IGrid;
    protected serviceLocator: ServiceLocator;
    private elem: HTMLElement;
    private value: string;
    private filterSettings: FilterSettings;
    private dropInstance: DropDownList;
    private dialogObj: Dialog;
    private ddOpen: Function;
    private ddComplete: Function;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, filterSettings?: FilterSettings) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.filterSettings = filterSettings;
        if (this.parent) {
            this.parent.on(events.filterMenuClose, this.destroy, this);
            this.parent.on(events.destroy, this.destroy, this);
        }
    }
    public create(args: {
        column: Column, target: HTMLElement,
        getOptrInstance: FlMenuOptrUI, localizeText: L10n, dialogObj: Dialog
    }): void {
        const isForeignColumn: boolean = args.column.isForeignColumn();
        const dataSource: Object = isForeignColumn ? args.column.dataSource : this.parent.dataSource;
        const fields: string = isForeignColumn ? args.column.foreignKeyValue : args.column.field;
        this.elem = this.parent.createElement('input', { className: 'e-flmenu-input', id: 'bool-ui-' + args.column.uid });
        args.target.appendChild(this.elem);
        this.dialogObj = args.dialogObj;
        this.dropInstance = new DropDownList(extend(
            {
                dataSource: dataSource instanceof DataManager ?
                    dataSource : new DataManager(dataSource),
                query: new Query().select(fields),
                fields: { text: fields, value: fields },
                placeholder: args.localizeText.getConstant('SelectValue'),
                cssClass: this.parent.cssClass ? 'e-popup-flmenu' + ' ' + this.parent.cssClass : 'e-popup-flmenu',
                locale: this.parent.locale,
                enableRtl: this.parent.enableRtl
            },
            args.column.filter.params
        ));
        this.ddOpen = this.openPopup.bind(this);
        this.ddComplete = this.actionComplete(fields);
        this.dropInstance.addEventListener(literals['open'], this.ddOpen);
        this.dropInstance.addEventListener(events.actionComplete, this.ddComplete);
        if (dataSource && 'result' in dataSource) {
            const query: Query = this.parent.getQuery ? this.parent.getQuery().clone() : new Query();
            const defObj: FilterStateObj = eventPromise({ requestType: 'booleanfilterrequest' }, query);
            this.parent.trigger(events.dataStateChange, defObj.state);
            const def: Deferred = defObj.deffered;
            def.promise.then((e: Object[]) => {
                this.dropInstance.dataSource = new DataManager(e);
                this.dropInstance.dataBind();
                const columns: PredicateModel[] = this.parent.filterSettings.columns;
                for (const column of columns) {
                    if (args.column.uid === column.uid) {
                        this.dropInstance.value = column.value;
                    }
                }
            });
        }
        this.dropInstance.appendTo(this.elem);
    }

    public write(args: { column: Column, target: Element, parent: IGrid, filteredValue: number | string | Date | boolean }): void {
        const drpuiObj: DropDownList = (<EJ2Intance>document.querySelector('#bool-ui-' + args.column.uid)).ej2_instances[0];
        if (!isNullOrUndefined(args.filteredValue) ) {
            drpuiObj.value = args.filteredValue as string;
        }
    }

    public read(element: Element, column: Column, filterOptr: string, filterObj: Filter): void {
        const drpuiObj: DropDownList = (<EJ2Intance>document.querySelector('#bool-ui-' + column.uid)).ej2_instances[0];
        const filterValue: string | number | Date | boolean = (drpuiObj.value) as string | number | Date | boolean;
        filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', false);
    }

    private openPopup(args: { popup: Popup }): void {
        getZIndexCalcualtion(args, this.dialogObj);
    }

    private actionComplete(fields: string): Function {
        return (e: { result: string[] }) => {
            e.result = DataUtil.distinct(e.result, fields, true) as string[];
        };
    }

    private destroy(): void {
        if (!this.dropInstance || this.dropInstance.isDestroyed) { return; }
        this.dropInstance.removeEventListener(literals['open'], this.ddOpen);
        this.dropInstance.removeEventListener(events.actionComplete, this.ddComplete);
        this.dropInstance.destroy();
        this.parent.off(events.filterMenuClose, this.destroy);
        this.parent.off(events.destroy, this.destroy);
    }
}
