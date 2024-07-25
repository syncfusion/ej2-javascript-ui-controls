import { isNullOrUndefined, extend, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { IEditCell, EJ2Intance } from '../base/interface';
import { Column } from '../models/column';
import { isEditable, createEditElement } from '../base/util';
import { TextBox }  from '@syncfusion/ej2-inputs';
import { EditCellBase } from './edit-cell-base';

/**
 * `DefaultEditCell` is used to handle default cell type editing.
 *
 * @hidden
 */
export class DefaultEditCell extends EditCellBase implements IEditCell {

    public create(args: { column: Column, value: string, requestType: string }): Element {
        const attr: { [key: string]: string } = {
            type: 'text', value: !isNullOrUndefined(args.value) ? args.value : '', style: 'text-align:' + args.column.textAlign
        };
        return createEditElement(this.parent, args.column, 'e-field e-input e-defaultcell', attr);
    }

    public read(element: Element): string {
        if ((<HTMLInputElement>element).type === 'hidden' && !isNullOrUndefined((<EJ2Intance>element).ej2_instances[0]) &&
            !isNullOrUndefined((<EJ2Intance>element).ej2_instances[0].textarea)) {
            return (<EJ2Intance>element).ej2_instances[0].value;
        } else {
            return (<HTMLInputElement>element).value;
        }
    }

    public write(args: { rowData: Object, element: Element, column: Column, requestType: string }): void {
        const col: Column = args.column;
        const isInline: boolean = this.parent.editSettings.mode !== 'Dialog';
        this.obj = new TextBox(extend(
            {
                element: args.element as HTMLInputElement, floatLabelType: this.parent.editSettings.mode !== 'Dialog' ? 'Never' : 'Always',
                enableRtl: this.parent.enableRtl, enabled: isEditable(args.column, args.requestType, args.element),
                placeholder: isInline ? '' : args.column.headerText,
                cssClass: this.parent.cssClass ? this.parent.cssClass : ''
            },
            col.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
        if (this.parent.editSettings.mode === 'Batch') {
            this.obj.element.addEventListener('keydown', this.keyEventHandler);
        }
    }

    private keyEventHandler(args: KeyboardEventArgs): void {
        if (args.key === 'Enter' || args.key === 'Tab') {
            const evt: Event = new Event('change', {bubbles : false, cancelable: true});
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any).dispatchEvent(evt);
        }
    }

    public destroy(): void {
        if (this.obj && !this.obj.isDestroyed) {
            this.obj.element.removeEventListener('keydown', this.keyEventHandler);
            this.obj.destroy();
        }
    }
}
