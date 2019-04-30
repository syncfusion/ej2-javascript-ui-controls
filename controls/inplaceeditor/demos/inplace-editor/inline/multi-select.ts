/**
 * MultiSelect Sample
 */
import { InPlaceEditor } from '../../../src/inplace-editor/base/inplace-editor';
import { MultiSelect } from './../../../src/inplace-editor/modules/multi-select';

InPlaceEditor.Inject(MultiSelect);

let serviceUrl: string = 'https://ej2services.syncfusion.com/development/web-services/api/Editor/UpdateData';

let sportsData: string[] = ['Badminton', 'Basketball', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Tennis'];

let editObj: InPlaceEditor = new InPlaceEditor({
    mode: 'Inline',
    type: 'MultiSelect',
    value: ['Badminton', 'Basketball'],
    primaryKey: '1',
    url: serviceUrl,
    adaptor: 'UrlAdaptor',
    name: 'Game',
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        Game: { required: true }
    },
    model: {
        dataSource: sportsData,
        placeholder: 'Select a game'
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
    let container: HTMLElement = <HTMLElement>document.querySelector('.sample-container');
    container.style.background = ((e.target.value.indexOf('dark') > 0 || e.target.value.indexOf('contrast') > 0) ? 'black' : 'initial');
    document.getElementsByTagName('link')[0].href = '../theme-files/' + e.target.value + '.css';
});

document.getElementById('mode').addEventListener('change', (e: any) => {
    editObj.mode = e.target.value;
    editObj.dataBind();
});

document.getElementById('editOn').addEventListener('change', (e: any) => {
    editObj.editableOn = e.target.value;
    editObj.dataBind();
});

document.getElementById('blurAction').addEventListener('change', (e: any) => {
    editObj.actionOnBlur = e.target.value;
    editObj.dataBind();
});

document.getElementById('rtl').addEventListener('change', (e: any) => {
    editObj.enableRtl = e.target.checked;
    editObj.dataBind();
});

document.getElementById('persist').addEventListener('change', (e: any) => {
    editObj.enablePersistence = e.target.checked;
    editObj.dataBind();
});

document.getElementById('disabled').addEventListener('change', (e: any) => {
    editObj.disabled = e.target.checked;
    editObj.dataBind();
});

document.getElementById('showButtons').addEventListener('change', (e: any) => {
    editObj.showButtons = e.target.checked;
    editObj.dataBind();
});

document.getElementById('openEditor').addEventListener('change', (e: any) => {
    editObj.enableEditMode = e.target.checked;
    editObj.dataBind();
});

document.getElementById('enterSubmit').addEventListener('change', (e: any) => {
    editObj.submitOnEnter = e.target.checked;
    editObj.dataBind();
});