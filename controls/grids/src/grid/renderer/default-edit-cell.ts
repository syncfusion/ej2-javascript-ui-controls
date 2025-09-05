import { isNullOrUndefined, extend, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { IEditCell, EJ2Intance } from '../base/interface';
import { Column } from '../models/column';
import { isEditable, createEditElement, parentsUntil, isCellHaveWidth } from '../base/util';
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
            type: 'text', value: !isNullOrUndefined(args.value) ? args.value : ''
        };
        const inputElement: Element = createEditElement(this.parent, args.column, 'e-field e-input e-defaultcell', attr);
        if (args.column.textAlign) {
            (inputElement as HTMLElement).style.textAlign = args.column.textAlign;
        }
        return inputElement;
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
        let mappingUid: string;
        const col: Column = args.column;
        const isInline: boolean = this.parent.editSettings.mode !== 'Dialog';
        const props: Object = {
            element: args.element as HTMLInputElement, floatLabelType: this.parent.editSettings.mode !== 'Dialog' ? 'Never' : 'Always',
            enableRtl: this.parent.enableRtl,
            enabled: isEditable(args.column, args.requestType, args.element) &&
                isCellHaveWidth(parentsUntil(args.element, 'e-rowcell'), this.parent),
            placeholder: isInline ? '' : args.column.headerText,
            cssClass: this.parent.cssClass ? this.parent.cssClass : ''
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!isNullOrUndefined(col.edit) && !isNullOrUndefined(col.edit.params) && (col.edit.params as any).multiline) {
            const cellValue: string = ((col.valueAccessor as Function)(col.field, args.rowData, col)) as string;
            props['value'] = cellValue;
            mappingUid = (props as { element: HTMLInputElement }).element.getAttribute('data-mappinguid');
            (props as { element: HTMLInputElement }).element.removeAttribute('data-mappinguid');
            (props as { element: HTMLInputElement }).element.setAttribute('e-mappinguid', mappingUid);
        }
        this.obj = new TextBox(extend(props, col.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
        if (!isNullOrUndefined(mappingUid)) {
            this.obj.element.removeAttribute('e-mappinguid');
            this.obj.element.setAttribute('data-mappinguid', mappingUid);
        }
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
            this.obj.element.remove();
        }
    }
}
