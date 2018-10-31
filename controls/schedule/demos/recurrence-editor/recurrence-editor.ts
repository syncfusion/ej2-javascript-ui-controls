/**
 * DropDownList Default Sample
 */
import { RecurrenceEditor, RecurrenceEditorChangeEventArgs } from '../../src/recurrence-editor/recurrence-editor';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';

let element: HTMLInputElement = <HTMLInputElement>document.querySelector('#output');
let recObject: RecurrenceEditor = new RecurrenceEditor({
    change: (data: RecurrenceEditorChangeEventArgs) => {
        element.value = data.value;
    }
});
recObject.appendTo('#editor');
let datas: { [key: string]: Object }[] = [
    { rule: '', type: 'NONE' },
    { rule: 'FREQ=DAILY;INTERVAL=1', type: 'DAILY-NEVER' },
    { rule: 'FREQ=DAILY;INTERVAL=2;UNTIL=20410606T000000Z', type: 'DAILY-UNTIL' },
    { rule: 'FREQ=DAILY;INTERVAL=2;COUNT=2', type: 'DAILY-count' },
    { rule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1;UNTIL=20410729T000000Z', type: 'WEEKLY-UNTIL' },
    { rule: 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=2;INTERVAL=1;UNTIL=20410729T000000Z', type: 'MONTHLY-UNTIL' },
    { rule: 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=2;INTERVAL=1', type: 'MONTHLY-NEVER' },
    { rule: 'FREQ=YEARLY;BYDAY=MO;BYSETPOS=-1;INTERVAL=1;COUNT=5', type: 'YEARLY-COUNT' }];
let listObj: DropDownList = new DropDownList({
    index: 2,
    popupHeight: '200px',
    dataSource: datas,
    change: (e: ChangeEventArgs) => {
        recObject.setRecurrenceRule(<string>e.value);
        element.value = recObject.getRecurrenceRule();
    },
    fields: { text: 'type', value: 'rule' }
});
listObj.appendTo('#data-set');
