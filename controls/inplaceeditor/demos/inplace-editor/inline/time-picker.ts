/**
 * Default Sample
 */
import { InPlaceEditor } from '../../../src/inplace-editor/base/inplace-editor';
import { TimePicker } from './../../../src/inplace-editor/modules/time-picker';

InPlaceEditor.Inject(TimePicker);

let editObj: InPlaceEditor = new InPlaceEditor({
    mode: 'Inline',
    type: 'Time',
    model: {
        min: new Date('3/8/2017 9:00 AM'),
        max: new Date('3/8/2017 11:30 AM'),
        value: new Date('3/8/2017 11:00 AM')
    }
});
editObj.appendTo('#element');

document.getElementById('renderMode').addEventListener('change', (e: any) => {
    switch (e.target.value) {
        case "1":
            document.body.classList.remove('e-bigger');
            break;
        case "2":
            document.body.classList.add('e-bigger');
            break;
    }
});

document.getElementById('themes').addEventListener('change', (e: any) => {
    document.getElementsByTagName('link')[0].href = '../theme-files/' + e.target.value + '.css';
});
