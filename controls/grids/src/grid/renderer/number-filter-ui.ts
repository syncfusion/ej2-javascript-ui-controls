import { IGrid, EJ2Intance, IFilterMUI, IFilterCreate } from '../base/interface';
import { Column } from '../models/column';
import { FilterSettings } from '../base/grid';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { ServiceLocator } from '../services/service-locator';
import { Filter } from '../actions/filter';

/**
 * `numberfilterui` render number column.
 * @hidden
 */

export class NumberFilterUI implements IFilterMUI {

    private parent: IGrid;
    protected serviceLocator: ServiceLocator;
    private instance: HTMLElement;
    private value: string;
    private numericTxtObj: NumericTextBox;
    private filterSettings: FilterSettings;
    private filter: Filter;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, filterSettings?: FilterSettings) {
        this.filterSettings = filterSettings;
        this.parent = parent;
        this.serviceLocator = serviceLocator;
    }
    public create(args: IFilterCreate): void {
        this.instance = this.parent.createElement('input', { className: 'e-flmenu-input', id: 'numberui-' + args.column.uid });
        args.target.appendChild(this.instance);
        this.numericTxtObj = new NumericTextBox({
            format: args.column.format as string,
            locale: this.parent.locale,
            cssClass: 'e-popup-flmenu',
            placeholder: args.localizeText.getConstant('EnterValue'),
            enableRtl: this.parent.enableRtl,
        });
        this.numericTxtObj.appendTo(this.instance);
    }

    public write(args: { column: Column, target: Element, parent: IGrid, filteredValue: number | string | Date | boolean }): void {
        let numberuiObj: NumericTextBox = (<EJ2Intance>document.querySelector('#numberui-' + args.column.uid)).ej2_instances[0];
        numberuiObj.value = args.filteredValue as number;
    }

    public read(element: Element, column: Column, filterOptr: string, filterObj: Filter): void {
        let numberuiObj: NumericTextBox = (<EJ2Intance>document.querySelector('#numberui-' + column.uid)).ej2_instances[0];
        let filterValue: number = numberuiObj.value;
        filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', true);
    }
}