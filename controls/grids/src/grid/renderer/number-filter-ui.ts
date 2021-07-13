import { IGrid, EJ2Intance, IFilterMUI, IFilterCreate } from '../base/interface';
import { Column } from '../models/column';
import { FilterSettings } from '../base/grid';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { ServiceLocator } from '../services/service-locator';
import { Filter } from '../actions/filter';
import { extend, isUndefined, KeyboardEventArgs  } from '@syncfusion/ej2-base';
import * as events from '../base/constant';

/**
 * `numberfilterui` render number column.
 *
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
        if (this.parent) {
            this.parent.on(events.filterMenuClose, this.destroy, this);
            this.parent.on(events.destroy, this.destroy, this);
        }
    }

    private keyEventHandler(args: KeyboardEventArgs): void {
        if (args.keyCode === 13 || args.keyCode === 9) {
            const evt: Event = document.createEvent('HTMLEvents');
            evt.initEvent('change', false, true);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any).dispatchEvent(evt);
        }
    }

    public create(args: IFilterCreate): void {
        this.instance = this.parent.createElement('input', { className: 'e-flmenu-input', id: 'numberui-' + args.column.uid });
        args.target.appendChild(this.instance);
        this.numericTxtObj = new NumericTextBox(extend(
            {
                format: typeof (args.column.format) === 'string' || isUndefined(args.column.format) ? args.column.format :
                    args.column.format.format,
                locale: this.parent.locale,
                cssClass: 'e-popup-flmenu',
                placeholder: args.localizeText.getConstant('EnterValue'),
                enableRtl: this.parent.enableRtl
            },
            args.column.filter.params
        ));
        this.numericTxtObj.appendTo(this.instance);
    }

    public write(args: { column: Column, target: Element, parent: IGrid, filteredValue: number | string | Date | boolean }): void {
        const numberuiObj: NumericTextBox = (<EJ2Intance>document.querySelector('#numberui-' + args.column.uid)).ej2_instances[0];
        numberuiObj.element.addEventListener('keydown', this.keyEventHandler);
        numberuiObj.value = args.filteredValue as number;
    }

    public read(element: Element, column: Column, filterOptr: string, filterObj: Filter): void {
        const numberuiObj: NumericTextBox = (<EJ2Intance>document.querySelector('#numberui-' + column.uid)).ej2_instances[0];
        const filterValue: number = numberuiObj.value;
        filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', true);
    }

    private destroy(): void {
        if (!this.numericTxtObj || this.numericTxtObj.isDestroyed) { return; }
        this.numericTxtObj.destroy();
        this.parent.off(events.filterMenuClose, this.destroy);
        this.parent.off(events.destroy, this.destroy);
    }
}
