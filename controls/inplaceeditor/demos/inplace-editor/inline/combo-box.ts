/**
 * Default Sample
 */
import { InPlaceEditor } from '../../../src/inplace-editor/base/inplace-editor';
import { ComboBox } from './../../../src/inplace-editor/modules/combo-box';

InPlaceEditor.Inject(ComboBox);

let sportsData: string[] = ['Badminton', 'Cricket', 'Football', 'Golf'];

let editObj: InPlaceEditor = new InPlaceEditor({
    mode: 'Inline',
    type: 'ComboBox',
    value: "Badminton",
    model: {
        dataSource: sportsData,
        placeholder: "Badminton"
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
