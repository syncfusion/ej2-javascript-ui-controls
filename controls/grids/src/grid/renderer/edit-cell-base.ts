import { IGrid, IEditCell, EJ2Intance } from '../base/interface';
import { AutoComplete, DropDownList, ComboBox, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { CheckBox, Switch } from '@syncfusion/ej2-buttons';
import { DatePicker, TimePicker } from '@syncfusion/ej2-calendars';
import { TextBox, MaskedTextBox }  from '@syncfusion/ej2-inputs';
import { createEditElement } from '../base/util';
import { Column } from '../models/column';

/**
 * `DropDownEditCell` is used to handle dropdown cell type editing.
 *
 * @hidden
 */
export class EditCellBase implements IEditCell {

    protected parent: IGrid;
    protected obj: AutoComplete | CheckBox | ComboBox | DatePicker | TextBox |
    DropDownList | MaskedTextBox | MultiSelect | TimePicker | Switch;
    protected removeEventHandler: Function;

    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public create(args: { column: Column, value: string, type?: string, requestType?: string }): Element {
        return createEditElement(this.parent, args.column, 'e-field', { type: 'text' });
    }

    public read(element: Element): string | boolean | Date{
        return (<EJ2Intance>element).ej2_instances[0].value;
    }

    public destroy(): void {
        if (this.obj && !this.obj.isDestroyed) {
            if (this.removeEventHandler) {
                this.removeEventHandler();
            }
            this.obj.destroy();
            this.obj.element.remove();
        }
    }
}
