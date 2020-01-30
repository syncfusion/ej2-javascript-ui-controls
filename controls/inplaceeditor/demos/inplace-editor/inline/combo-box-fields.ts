/**
 * ComboBox Fields Sample
 */
import { L10n } from '@syncfusion/ej2-base';
import { InPlaceEditor } from '../../../src/inplace-editor/base/inplace-editor';
import { ComboBox } from './../../../src/inplace-editor/modules/combo-box';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';

InPlaceEditor.Inject(ComboBox);

L10n.load({
    'fr-BE': {
        'inplace-editor': {
            'loadingText': 'chargement'
        }
    }
});

let serviceUrl: string = 'https://ej2services.syncfusion.com/development/web-services/api/Editor/UpdateData';

let stringData1: string[] = ['Badminton', 'Basketball', 'Cricket', 'Football', 'Golf'];
let stringData2: { [key: string]: Object }[] = [
    { Id: 'game1', Game: 'Badminton' },
    { Id: 'game2', Game: 'Basketball' },
    { Id: 'game3', Game: 'Cricket' },
    { Id: 'game4', Game: 'Football' },
];
let stringData3: { [key: string]: Object }[] = [
    { Country: { Name: 'Australia' }, Code: { Id: 'AU' } },
    { Country: { Name: 'Bermuda' }, Code: { Id: 'BM' } },
    { Country: { Name: 'Canada' }, Code: { Id: 'CA' } },
    { Country: { Name: 'Cameroon' }, Code: { Id: 'CM' } },
    { Country: { Name: 'Denmark' }, Code: { Id: 'DK' } }
];

let numberData1: number[] = [11, 12, 13, 14, 15];
let numberData2: { [key: string]: Object }[] = [
    { Id: 1, Game: 12345 },
    { Id: 2, Game: 23456 },
    { Id: 3, Game: 34567 },
    { Id: 4, Game: 45678 },
];
let numberData3: { [key: string]: Object }[] = [
    { Country: { Population: 11000 }, Code: { Id: 11 } },
    { Country: { Population: 12000 }, Code: { Id: 12 } },
    { Country: { Population: 13000 }, Code: { Id: 13 } },
    { Country: { Population: 14000 }, Code: { Id: 14 } },
    { Country: { Population: 15000 }, Code: { Id: 15 } }
];

let editObj1: InPlaceEditor = new InPlaceEditor({
    mode: 'Inline',
    type: 'ComboBox',
    primaryKey: '1',
    url: serviceUrl,
    adaptor: 'UrlAdaptor',
    name: 'Game',
    value: 'Badminton',
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        Game: { required: true }
    },
    model: {
        dataSource: stringData1
    }
});
editObj1.appendTo('#element1');

let editObj2: InPlaceEditor = new InPlaceEditor({
    mode: 'Inline',
    type: 'ComboBox',
    primaryKey: '1',
    name: 'Game',
    value: 'game3',
    url: serviceUrl,
    adaptor: 'UrlAdaptor',
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        Game: { required: true }
    },
    model: {
        dataSource: stringData2,
        //map the appropriate columns to fields property
        fields: { text: 'Game', value: 'Id' },
    }
});
editObj2.appendTo('#element2');

let editObj3: InPlaceEditor = new InPlaceEditor({
    mode: 'Inline',
    type: 'ComboBox',
    primaryKey: '1',
    name: 'Game',
    url: serviceUrl,
    adaptor: 'UrlAdaptor',
    value: 'DK',
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        Game: { required: true }
    },
    model: {
        // bind the sports Data to datasource property
        dataSource: stringData3,
        // maps the appropriate column to fields property
        fields: { value: 'Code.Id', text: 'Country.Name' },
    }
});
editObj3.appendTo('#element3');

let editObj4: InPlaceEditor = new InPlaceEditor({
    mode: 'Inline',
    type: 'ComboBox',
    primaryKey: '1',
    url: serviceUrl,
    adaptor: 'UrlAdaptor',
    name: 'Game',
    value: 'ALFKI',
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        Game: { required: true }
    },
    model: {
        //bind the DataManager instance to dataSource property
        dataSource: new DataManager({
            url: 'https://services.odata.org/V4/Northwind/Northwind.svc/',
            adaptor: new ODataV4Adaptor,
            crossDomain: true
        }),
        //bind the Query instance to query property
        query: new Query().from('Customers').select(['ContactName', 'CustomerID']).take(6),
        //map the appropriate columns to fields property
        fields: { value: 'CustomerID', text: 'ContactName' }
    }
});
editObj4.appendTo('#element4');

let editObj5: InPlaceEditor = new InPlaceEditor({
    mode: 'Inline',
    type: 'ComboBox',
    primaryKey: '1',
    url: serviceUrl,
    adaptor: 'UrlAdaptor',
    name: 'Game',
    value: 12,
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        Game: { required: true }
    },
    model: {
        dataSource: numberData1
    }
});
editObj5.appendTo('#element5');

let editObj6: InPlaceEditor = new InPlaceEditor({
    mode: 'Inline',
    type: 'ComboBox',
    primaryKey: '1',
    name: 'Game',
    value: 2,
    url: serviceUrl,
    adaptor: 'UrlAdaptor',
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        Game: { required: true }
    },
    model: {
        dataSource: numberData2,
        //map the appropriate columns to fields property
        fields: { text: 'Game', value: 'Id' },
    }
});
editObj6.appendTo('#element6');

let editObj7: InPlaceEditor = new InPlaceEditor({
    mode: 'Inline',
    type: 'ComboBox',
    primaryKey: '1',
    name: 'Game',
    url: serviceUrl,
    adaptor: 'UrlAdaptor',
    value: 12,
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        Game: { required: true }
    },
    model: {
        // bind the sports Data to datasource property
        dataSource: numberData3,
        // maps the appropriate column to fields property
        fields: { value: 'Code.Id', text: 'Country.Population' },
    }
});
editObj7.appendTo('#element7');

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

function dataBind(): void {
    editObj1.dataBind();
    editObj2.dataBind();
    editObj3.dataBind();
    editObj4.dataBind();
    editObj5.dataBind();
    editObj6.dataBind();
    editObj7.dataBind();
}

document.getElementById('mode').addEventListener('change', (e: any) => {
    editObj1.mode = editObj2.mode = editObj3.mode = editObj4.mode = editObj5.mode = editObj6.mode = editObj7.mode = e.target.value;
    dataBind();
});

document.getElementById('editOn').addEventListener('change', (e: any) => {
    editObj1.editableOn = editObj2.editableOn = editObj3.editableOn = editObj4.editableOn = editObj5.editableOn = editObj6.editableOn = editObj7.editableOn = e.target.value;
    dataBind();
});

document.getElementById('blurAction').addEventListener('change', (e: any) => {
    editObj1.actionOnBlur = editObj2.actionOnBlur = editObj3.actionOnBlur = editObj4.actionOnBlur = editObj5.actionOnBlur = editObj6.actionOnBlur = editObj7.actionOnBlur = e.target.value;
    dataBind();
});

document.getElementById('rtl').addEventListener('change', (e: any) => {
    editObj1.enableRtl = editObj2.enableRtl = editObj3.enableRtl = editObj4.enableRtl = editObj5.enableRtl = editObj6.enableRtl = editObj7.enableRtl = e.target.checked;
    dataBind();
});

document.getElementById('persist').addEventListener('change', (e: any) => {
    editObj1.enablePersistence = editObj2.enablePersistence = editObj3.enablePersistence = editObj4.enablePersistence = editObj5.enablePersistence = editObj6.enablePersistence = editObj7.enablePersistence = e.target.checked;
    dataBind();
});

document.getElementById('disabled').addEventListener('change', (e: any) => {
    editObj1.disabled = editObj2.disabled = editObj3.disabled = editObj4.disabled = editObj5.disabled = editObj6.disabled = editObj7.disabled = e.target.checked;
    dataBind();
});

document.getElementById('showButtons').addEventListener('change', (e: any) => {
    editObj1.showButtons = editObj2.showButtons = editObj3.showButtons = editObj4.showButtons = editObj5.showButtons = editObj6.showButtons = editObj7.showButtons = e.target.checked;
    dataBind();
});

document.getElementById('openEditor').addEventListener('change', (e: any) => {
    editObj1.enableEditMode = editObj2.enableEditMode = editObj3.enableEditMode = editObj4.enableEditMode = editObj5.enableEditMode = editObj6.enableEditMode = editObj7.enableEditMode = e.target.checked;
    dataBind();
});

document.getElementById('enterSubmit').addEventListener('change', (e: any) => {
    editObj1.submitOnEnter = editObj2.submitOnEnter = editObj3.submitOnEnter = editObj4.submitOnEnter = editObj5.submitOnEnter = editObj6.submitOnEnter = editObj7.submitOnEnter = e.target.checked;
    dataBind();
});