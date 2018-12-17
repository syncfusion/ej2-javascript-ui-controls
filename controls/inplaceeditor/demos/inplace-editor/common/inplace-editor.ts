/**
 * Default Sample
 */
import { InPlaceEditor, RenderMode, AdaptorType } from '../../../src/inplace-editor/base/inplace-editor';
import { AutoComplete } from './../../../src/inplace-editor/modules/auto-complete';
import { ColorPicker } from './../../../src/inplace-editor/modules/color-picker';
import { ComboBox } from './../../../src/inplace-editor/modules/combo-box';
import { DateRangePicker } from './../../../src/inplace-editor/modules/date-range-picker';
import { MultiSelect } from './../../../src/inplace-editor/modules/multi-select';
import { Rte } from './../../../src/inplace-editor/modules/rte';
import { Slider } from './../../../src/inplace-editor/modules/slider';
import { TimePicker } from './../../../src/inplace-editor/modules/time-picker';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';

InPlaceEditor.Inject(AutoComplete, ColorPicker, ComboBox, DateRangePicker, MultiSelect, Rte, Slider, TimePicker);

let modeType: RenderMode = 'Inline';
let serviceUrl: string = 'http://localhost:25255/api/WebApi';
let adaptorType: AdaptorType = 'UrlAdaptor';

let darkThemes: string[] = ['material-dark', 'fabric-dark', 'bootstrap-dark', 'highcontrast'];
let modeData: string[] = ['Inline', 'Popup'];
let sportsData: string[] = ['Badminton', 'Basketball', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Tennis'];

let modeObj: DropDownList = new DropDownList({
    dataSource: modeData,
    placeholder: 'Inline',
    change: onChange
});
modeObj.appendTo('#mode');

let atcObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'AutoComplete',
    value: 'Badminton',
    primaryKey: '1',
    url: serviceUrl,
    adaptor: adaptorType,
    popupSettings: {
        title: 'Edit'
    },
    name: 'Game',
    validationRules : {
        Game: { required: true }
    },
    model: {
        dataSource: sportsData,
        placeholder: 'Select a game'
    }
});
atcObj.appendTo('#autoComplete');

let comboBoxObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'ComboBox',
    value: 'Basketball',
    popupSettings: {
        title: 'Edit'
    },
    primaryKey: '1',
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'Game',
    validationRules : {
        Game: { required: true }
    },
    model: {
        dataSource: sportsData,
        placeholder: 'Select a game'
    }
});
comboBoxObj.appendTo('#comboBox');

let dropDownObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'DropDownList',
    value: 'Cricket',
    primaryKey: '1',
    popupSettings: {
        title: 'Edit'
    },
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'Game',
    validationRules : {
        Game: { required: true }
    },
    model: {
        dataSource: sportsData,
        placeholder: 'Select a game'
    }
});
dropDownObj.appendTo('#dropDownList');

let multiSelectObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'MultiSelect',
    value: ['Badminton', 'Basketball'],
    primaryKey: '1',
    popupSettings: {
        title: 'Edit'
    },
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'Game',
    validationRules : {
        Game: { required: true }
    },
    model: {
        dataSource: sportsData,
        placeholder: 'Select a game'
    }
});
multiSelectObj.appendTo('#multiSelect');

let dateObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'Date',
    value: new Date(),
    primaryKey: '1',
    popupSettings: {
        title: 'Edit'
    },
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'Date',
    validationRules : {
        Date: { required: true }
    }
});
dateObj.appendTo('#datePicker');

let dateRangeObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'DateRange',
    value: [new Date('11/12/2018'), new Date('11/15/2018')],
    primaryKey: '1',
    popupSettings: {
        title: 'Edit'
    },
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'Date',
    validationRules : {
        Date: { required: true }
    }
});
dateRangeObj.appendTo('#dateRangePickerEle');

let dateTimeObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'DateTime',
    value: new Date(),
    primaryKey: '1',
    popupSettings: {
        title: 'Edit'
    },
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'Date',
    validationRules : {
        Date: { required: true }
    }
});
dateTimeObj.appendTo('#dateTimePicker');

let timeObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'Time',
    value: new Date(),
    primaryKey: '1',
    popupSettings: {
        title: 'Edit'
    },
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'Time',
    validationRules : {
        Time: { required: true }
    },
});
timeObj.appendTo('#timePicker');

let colorObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'Color',
    popupSettings: {
        title: 'Edit'
    },
    value: '#eaeaea'
});
colorObj.appendTo('#colorPicker');

let maskedObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'Mask',
    value: '12345',
    primaryKey: '1',
    popupSettings: {
        title: 'Edit'
    },
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'Masked',
    validationRules : {
        Masked: { required: true }
    },
    model: {
        mask: '#####'
    }
});
maskedObj.appendTo('#maskedTextBox');

let numericObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'Numeric',
    value: '0.5',
    primaryKey: '1',
    popupSettings: {
        title: 'Edit'
    },
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'Numeric',
    validationRules : {
        Numeric: { required: true }
    },
    model: {
        format: 'p2',
        min: 0,
        max: 1,
        step: 0.01,
        placeholder: 'Percentage format'
    }
});
numericObj.appendTo('#numericTextBox');

let textBoxObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'Text',
    value: 'Sample Text',
    primaryKey: '1',
    popupSettings: {
        title: 'Edit'
    },
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'TextBox',
    validationRules : {
        TextBox: { required: true }
    }
});
textBoxObj.appendTo('#textBox');

let sliderObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'Slider',
    value: 30,
    primaryKey: '1',
    popupSettings: {
        title: 'Edit'
    },
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'Slide',
    validationRules : {
        Slide: { required: true }
    },
    model: {
        min: 0,
        max: 100
    }
});
sliderObj.appendTo('#slider');

let rteObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'RTE',
    value: 'RichTextEditor',
    primaryKey: '1',
    url: serviceUrl,
    popupSettings: {
        title: 'Edit'
    },
    adaptor: adaptorType,
    name: 'TextEditor',
    validationRules : {
        TextEditor: { required: true }
    }
});
rteObj.appendTo('#rte');

function onChange(e: ChangeEventArgs): void {
    modeType = e.value as RenderMode;
    textBoxObj.mode = modeType;
    textBoxObj.dataBind();
    atcObj.mode = modeType;
    atcObj.dataBind();
    comboBoxObj.mode = modeType;
    comboBoxObj.dataBind();
    dropDownObj.mode = modeType;
    dropDownObj.dataBind();
    multiSelectObj.mode = modeType;
    multiSelectObj.dataBind();
    dateObj.mode = modeType;
    dateObj.dataBind();
    dateRangeObj.mode = modeType;
    dateRangeObj.dataBind();
    dateTimeObj.mode = modeType;
    dateTimeObj.dataBind();
    timeObj.mode = modeType;
    timeObj.dataBind();
    colorObj.mode = modeType;
    colorObj.dataBind();
    maskedObj.mode = modeType;
    maskedObj.dataBind();
    numericObj.mode = modeType;
    numericObj.dataBind();
    sliderObj.mode = modeType;
    sliderObj.dataBind();
    rteObj.mode = modeType;
    rteObj.dataBind();
}

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
    if (Array.prototype.indexOf.call(darkThemes, e.target.value) > -1) {
        document.body.style.background = '#000';
    } else {
        document.body.style.background = '#fff';
    }
    document.getElementsByTagName('link')[0].href = '../theme-files/' + e.target.value + '.css';
});