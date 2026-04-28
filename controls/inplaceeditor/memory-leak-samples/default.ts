/**
 * Default Sample
 */
 import { InPlaceEditor, RenderMode, AdaptorType, EditableType, ActionBlur } from '../src/inplace-editor/base/inplace-editor';
 import { AutoComplete } from '../src/inplace-editor/modules/auto-complete';
 import { ColorPicker } from '../src/inplace-editor/modules/color-picker';
 import { ComboBox } from '../src/inplace-editor/modules/combo-box';
 import { DateRangePicker } from '../src/inplace-editor/modules/date-range-picker';
 import { MultiSelect } from '../src/inplace-editor/modules/multi-select';
 import { Rte } from '../src/inplace-editor/modules/rte';
 import { Slider } from '../src/inplace-editor/modules/slider';
 import { TimePicker } from '../src/inplace-editor/modules/time-picker';
 
 InPlaceEditor.Inject(AutoComplete, ColorPicker, ComboBox, DateRangePicker, MultiSelect, Rte, Slider, TimePicker);
 
 let modeType: RenderMode = 'Inline';
 let adaptorType: AdaptorType = 'UrlAdaptor';
 let serviceUrl: string = 'https://ej2services.syncfusion.com/production/web-services/api/Editor/UpdateData';
 let sportsData: string[] = ['Badminton', 'Basketball', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Tennis'];
 
 let atcObj: InPlaceEditor;
 let comboBoxObj: InPlaceEditor;
 let dropDownObj: InPlaceEditor;
 let multiSelectObj: InPlaceEditor;
 let dateObj: InPlaceEditor;
 let dateRangeObj: InPlaceEditor;

 document.getElementById('render').addEventListener('click', renderInPlaceEditor);
 document.getElementById('destroy').addEventListener('click', destroyInPlaceEditor);
 function renderInPlaceEditor(): void {
    atcObj = new InPlaceEditor({
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
        }
    });
    atcObj.appendTo('#autoComplete');
    
    comboBoxObj = new InPlaceEditor({
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
        }
    });
    comboBoxObj.appendTo('#comboBox');
    
    dropDownObj = new InPlaceEditor({
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
        }
    });
    dropDownObj.appendTo('#dropDownList');
    
    multiSelectObj = new InPlaceEditor({
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
        }
    });
    multiSelectObj.appendTo('#multiSelect');
    
    dateObj = new InPlaceEditor({
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
        }
    });
    dateObj.appendTo('#datePicker');
    
    dateRangeObj = new InPlaceEditor({
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
        }
    });
    dateRangeObj.appendTo('#dateRangePickerEle');
}

 
function destroyInPlaceEditor(): void {
    if (atcObj) {
        atcObj.destroy();
        atcObj = null;
    }
    if (comboBoxObj) {
        comboBoxObj.destroy();
        comboBoxObj = null;
    }
    if (dropDownObj) {
        dropDownObj.destroy();
        dropDownObj = null;
    }
    if (multiSelectObj) {
        multiSelectObj.destroy();
        multiSelectObj = null;
    }
    if (dateObj) {
        dateObj.destroy();
        dateObj = null;
    }
    if (dateRangeObj) {
        dateRangeObj.destroy();
        dateRangeObj = null;
    }
}