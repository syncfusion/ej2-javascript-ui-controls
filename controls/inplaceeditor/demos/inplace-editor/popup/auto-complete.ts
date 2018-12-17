/**
 * Default Sample
 */
import { InPlaceEditor } from '../../../src/inplace-editor/base/inplace-editor';
import { AutoComplete } from './../../../src/inplace-editor/modules/auto-complete';

InPlaceEditor.Inject(AutoComplete);

let sportsData: string[] = ['Badminton', 'Basketball', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Tennis'];

let editObj: InPlaceEditor = new InPlaceEditor({
    mode: 'Popup',
    type: 'AutoComplete',
    value: 'Badminton',
    name: 'Game',
    validationRules: {
        mail: { required: true }
    },
    model: {
        dataSource: sportsData,
        placeholder: "Find a game"
    },
    url: 'http://localhost:25255/api/Batch'
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
