/**
 * Default Sample
 */
import { CheckBox, ChangeEventArgs as ChangeArgs } from '@syncfusion/ej2-buttons';
import { InPlaceEditor, RenderMode, AdaptorType, EditableType, ActionBlur } from '../../../src/inplace-editor/base/inplace-editor';
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
let adaptorType: AdaptorType = 'UrlAdaptor';
let serviceUrl: string = 'https://ej2services.syncfusion.com/production/web-services/api/Editor/UpdateData';

let modeData: string[] = ['Inline', 'Popup'];
let darkThemes: string[] = ['material-dark', 'fabric-dark', 'bootstrap-dark', 'highcontrast'];
let sportsData: string[] = ['Badminton', 'Basketball', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Tennis'];

new CheckBox({ label: 'Enable RTL', checked: false, change: onRtlChange }, '#rtl');
new CheckBox({ label: 'Enable Persistence', checked: false, change: onPersistChange }, '#persist');
new CheckBox({ label: 'Disable Editor', checked: false, change: onDisabledChange }, '#disabled');
new CheckBox({ label: 'ShowButtons', checked: true, change: onShowButtonsChange }, '#showButtons');
new CheckBox({ label: 'EnableEditMode', checked: false, change: onEditorOpenChange }, '#openEditor');
new CheckBox({ label: 'SubmitOnEnter', checked: true, change: onSubmitOnEnterChange }, '#enterSubmit');

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
    name: 'Game',
    primaryKey: '1',
    url: serviceUrl,
    adaptor: adaptorType,
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        Game: { required: true }
    },
    model: {
        dataSource: sportsData,
        placeholder: 'Select a game'
    },
    change(e: any): void {
        console.log('AutoComplete:');
        console.table(e);
    }
});
atcObj.appendTo('#autoComplete');

let comboBoxObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'ComboBox',
    value: 'Basketball',
    primaryKey: '1',
    url: serviceUrl,
    adaptor: adaptorType,
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
    },
    change(e: any): void {
        console.log('ComboBox:');
        console.table(e);
    }
});
comboBoxObj.appendTo('#comboBox');

let dropDownObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'DropDownList',
    value: 'Cricket',
    primaryKey: '1',
    url: serviceUrl,
    adaptor: adaptorType,
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
    },
    change(e: any): void {
        console.log('DropDownList:');
        console.table(e);
    }
});
dropDownObj.appendTo('#dropDownList');

let multiSelectObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'MultiSelect',
    value: ['Badminton', 'Basketball'],
    primaryKey: '1',
    url: serviceUrl,
    adaptor: adaptorType,
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
    },
    change(e: any): void {
        console.log('MultiSelect:');
        console.table(e);
    }
});
multiSelectObj.appendTo('#multiSelect');

let dateObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'Date',
    value: new Date(),
    primaryKey: '1',
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'Date',
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        Date: { required: true }
    },
    change(e: any): void {
        console.log('Date:');
        console.table(e);
    }
});
dateObj.appendTo('#datePicker');

let dateRangeObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'DateRange',
    value: [new Date('11/12/2018'), new Date('11/15/2018')],
    primaryKey: '1',
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'Date',
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        Date: { required: true }
    },
    change(e: any): void {
        console.log('DateRange:');
        console.table(e);
    }
});
dateRangeObj.appendTo('#dateRangePickerEle');

let dateTimeObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'DateTime',
    value: new Date(),
    primaryKey: '1',
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'Date',
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        Date: { required: true }
    },
    change(e: any): void {
        console.log('DateTime:');
        console.table(e);
    }
});
dateTimeObj.appendTo('#dateTimePicker');

let timeObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'Time',
    value: new Date(),
    primaryKey: '1',
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'Time',
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        Time: { required: true }
    },
    change(e: any): void {
        console.log('Time:');
        console.table(e);
    }
});
timeObj.appendTo('#timePicker');

let colorObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'Color',
    primaryKey: '1',
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'Color',
    value: '#eaeaea',
    popupSettings: {
        title: 'Edit'
    },
    change(e: any): void {
        console.log('Color:');
        console.table(e);
    }
});
colorObj.appendTo('#colorPicker');

let maskedObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'Mask',
    value: '12345',
    primaryKey: '1',
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'Masked',
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        Masked: { required: true }
    },
    model: {
        mask: '#####'
    },
    change(e: any): void {
        console.log('Masked:');
        console.table(e);
    }
});
maskedObj.appendTo('#maskedTextBox');

let numericObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'Numeric',
    value: '0.5',
    primaryKey: '1',
    url: serviceUrl,
    adaptor: adaptorType,
    popupSettings: {
        title: 'Edit'
    },
    name: 'Numeric',
    validationRules: {
        Numeric: { required: true }
    },
    model: {
        format: 'p2',
        min: 0,
        max: 1,
        step: 0.01,
        placeholder: 'Percentage format'
    },
    change(e: any): void {
        console.log('Numeric:');
        console.table(e);
    }
});
numericObj.appendTo('#numericTextBox');

let textBoxObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'Text',
    value: 'Sample Text',
    primaryKey: '1',
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'TextBox',
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        TextBox: { required: true }
    },
    change(e: any): void {
        console.log('TextBox:');
        console.table(e);
    }
});
textBoxObj.appendTo('#textBox');

let sliderObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'Slider',
    value: 30,
    primaryKey: '1',
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'Slide',
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        Slide: { required: true }
    },
    model: {
        min: 0,
        max: 100
    },
    change(e: any): void {
        console.log('Slider:');
        console.table(e);
    }
});
sliderObj.appendTo('#slider');

let rteObj: InPlaceEditor = new InPlaceEditor({
    mode: modeType,
    type: 'RTE',
    value: 'RichTextEditor',
    primaryKey: '1',
    url: serviceUrl,
    adaptor: adaptorType,
    name: 'TextEditor',
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        TextEditor: { required: true }
    },
    change(e: any): void {
        console.log('RTE:');
        console.table(e);
    }
});
rteObj.appendTo('#rte');

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
    let container: HTMLElement = <HTMLElement>document.querySelector('.sample-container');
    container.style.background = ((e.target.value.indexOf('dark') > 0 || e.target.value.indexOf('contrast') > 0) ? 'black' : 'initial');
    document.getElementsByTagName('link')[0].href = '../theme-files/' + e.target.value + '.css';
});

function onChange(e: ChangeEventArgs): void {
    modeType = e.value as RenderMode;
    textBoxObj.mode = atcObj.mode = comboBoxObj.mode = dropDownObj.mode = multiSelectObj.mode = modeType;
    dateObj.mode = dateRangeObj.mode = dateTimeObj.mode = timeObj.mode = colorObj.mode = modeType;
    maskedObj.mode = numericObj.mode = sliderObj.mode = rteObj.mode = modeType;
    triggerBind();
}

document.getElementById('editOn').addEventListener('change', (e: any) => {
    let editOn: EditableType = e.target.value as EditableType;
    textBoxObj.editableOn = atcObj.editableOn = comboBoxObj.editableOn = dropDownObj.editableOn = multiSelectObj.editableOn = editOn;
    dateObj.editableOn = dateRangeObj.editableOn = dateTimeObj.editableOn = timeObj.editableOn = colorObj.editableOn = editOn;
    maskedObj.editableOn = numericObj.editableOn = sliderObj.editableOn = rteObj.editableOn = editOn;
    triggerBind();
});

document.getElementById('blurAction').addEventListener('change', (e: any) => {
    let value: ActionBlur = e.target.value as ActionBlur;
    textBoxObj.actionOnBlur = atcObj.actionOnBlur = comboBoxObj.actionOnBlur = dropDownObj.actionOnBlur = value;
    multiSelectObj.actionOnBlur = dateObj.actionOnBlur = dateRangeObj.actionOnBlur = dateTimeObj.actionOnBlur = value;
    timeObj.actionOnBlur = colorObj.actionOnBlur = maskedObj.actionOnBlur = numericObj.actionOnBlur = sliderObj.actionOnBlur = value;
    rteObj.actionOnBlur = value;
    triggerBind();
});

function onRtlChange(e: ChangeArgs): void {
    textBoxObj.enableRtl = atcObj.enableRtl = comboBoxObj.enableRtl = dropDownObj.enableRtl = multiSelectObj.enableRtl = e.checked;
    dateObj.enableRtl = dateRangeObj.enableRtl = dateTimeObj.enableRtl = timeObj.enableRtl = colorObj.enableRtl = e.checked;
    maskedObj.enableRtl = numericObj.enableRtl = sliderObj.enableRtl = rteObj.enableRtl = e.checked;
    triggerBind();
}

function onPersistChange(e: ChangeArgs): void {
    textBoxObj.enablePersistence = atcObj.enablePersistence = comboBoxObj.enablePersistence = dropDownObj.enablePersistence = e.checked;
    multiSelectObj.enablePersistence = dateObj.enablePersistence = dateRangeObj.enablePersistence = e.checked;
    dateTimeObj.enablePersistence = timeObj.enablePersistence = colorObj.enablePersistence = e.checked;
    maskedObj.enablePersistence = numericObj.enablePersistence = sliderObj.enablePersistence = rteObj.enablePersistence = e.checked;
    triggerBind();
}

function onDisabledChange(e: ChangeArgs): void {
    textBoxObj.disabled = atcObj.disabled = comboBoxObj.disabled = dropDownObj.disabled = multiSelectObj.disabled = e.checked;
    dateObj.disabled = dateRangeObj.disabled = dateTimeObj.disabled = timeObj.disabled = colorObj.disabled = e.checked;
    maskedObj.disabled = numericObj.disabled = sliderObj.disabled = rteObj.disabled = e.checked;
    triggerBind();
}

function onShowButtonsChange(e: ChangeArgs): void {
    textBoxObj.showButtons = atcObj.showButtons = comboBoxObj.showButtons = dropDownObj.showButtons = e.checked;
    multiSelectObj.showButtons = dateObj.showButtons = dateRangeObj.showButtons = dateTimeObj.showButtons = e.checked;
    timeObj.showButtons = colorObj.showButtons = maskedObj.showButtons = numericObj.showButtons = e.checked;
    sliderObj.showButtons = rteObj.showButtons = e.checked;
    triggerBind();
}

function onEditorOpenChange(e: ChangeArgs): void {
    textBoxObj.enableEditMode = atcObj.enableEditMode = comboBoxObj.enableEditMode = dropDownObj.enableEditMode = e.checked;
    multiSelectObj.enableEditMode = dateObj.enableEditMode = dateRangeObj.enableEditMode = dateTimeObj.enableEditMode = e.checked;
    timeObj.enableEditMode = colorObj.enableEditMode = maskedObj.enableEditMode = numericObj.enableEditMode = e.checked;
    sliderObj.enableEditMode = rteObj.enableEditMode = e.checked;
    triggerBind();
}

function onSubmitOnEnterChange(e: ChangeArgs): void {
    textBoxObj.submitOnEnter = atcObj.submitOnEnter = comboBoxObj.submitOnEnter = dropDownObj.submitOnEnter = e.checked;
    multiSelectObj.submitOnEnter = dateObj.submitOnEnter = dateRangeObj.submitOnEnter = dateTimeObj.submitOnEnter = e.checked;
    timeObj.submitOnEnter = colorObj.submitOnEnter = maskedObj.submitOnEnter = numericObj.submitOnEnter = e.checked;
    sliderObj.submitOnEnter = rteObj.submitOnEnter = e.checked;
    triggerBind();
}

function triggerBind(): void {
    textBoxObj.dataBind();
    atcObj.dataBind();
    comboBoxObj.dataBind();
    dropDownObj.dataBind();
    multiSelectObj.dataBind();
    dateObj.dataBind();
    dateRangeObj.dataBind();
    dateTimeObj.dataBind();
    timeObj.dataBind();
    colorObj.dataBind();
    maskedObj.dataBind();
    numericObj.dataBind();
    sliderObj.dataBind();
    rteObj.dataBind();
}