/**
 * CheckBox Default Sample
 */
import { QueryBuilder , RuleModel, ColumnsModel} from './../../../src/query-builder/index';
import { getComponent} from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { DropDownList, MultiSelect, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
import { Slider, SliderTickEventArgs } from '@syncfusion/ej2-inputs';
MultiSelect.Inject(CheckBoxSelection);
let elem: HTMLElement;
let dropDownObj: DropDownList;
let multiSelectObj: MultiSelect;
let filter: ColumnsModel [] = [
    { field: 'EmployeeID', label: 'EmployeeID', type: 'number', template: {
        create: () => {
            elem = document.createElement('input');
            elem.setAttribute('type', 'text');
            return elem;
        },
        destroy: (args: {elementId: string}) => {
            (getComponent(document.getElementById(args.elementId), 'multiselect') as MultiSelect).destroy();
        },
        write: (args: {elements: Element, values: string[]}) => {
            multiSelectObj = new MultiSelect({
                dataSource: [1, 2, 3, 4, 5],
                value: args.values,
                mode: 'Box',
                change: (e: any) => {
                    queryBldrObj.notifyChange(e.value, e.element);
                }
            });
            multiSelectObj.appendTo('#' + args.elements.id);
        }
    }},
    { field: 'CustomerID', label: 'CustomerID', type: 'number', template: {
        create: () => {
            elem = document.createElement('input');
            elem.setAttribute('type', 'text');
            return elem;
        },
        destroy: (args: {elementId: string}) => {
            (getComponent(document.getElementById(args.elementId), 'dropdownlist') as DropDownList).destroy();
        },
        write: (args: {elements: Element, values: string}) => {
            let ds: string [] = ['ALFKI', 'BERGS', 'BLONP', 'OTTIK'];
            dropDownObj = new DropDownList({
                dataSource: ds,
                value: args.values ? args.values[0] : ds[0],
                change: (e: any) => {
                    queryBldrObj.notifyChange(e.itemData.value, e.element);
                }
            });
            dropDownObj.appendTo('#' + args.elements.id);
        }
    }},
    { field: 'OrderID', label: 'OrderID', type: 'number'},
    { field: 'In_stock', label: 'In_stock', type: 'boolean'},
    { field: 'Date', label: 'Date', type: 'date'},
    { field: 'Price', label: 'Price', type: 'number',  operators: [{key: 'equal', value: 'equal'},
     {key: 'greaterthan', value: 'greaterthan'}, {key: 'lessthan', value: 'lessthan'}], template: {
        create: () => {
            elem = document.createElement('div');
            elem.setAttribute('class', 'ticks_slider');
            return elem;
        },
        destroy: (args: {elementId: string}) => {
            (getComponent(document.getElementById(args.elementId), 'slider') as Slider).destroy();
        },
        write: (args: {elements: Element, values: string}) => {
            let ticksSlider: Slider = new Slider({
                min: 0, max: 100,
                value: 10,
                step: 20,
                type: 'MinRange',
                ticks: { placement: 'Before', largeStep:  20, smallStep:  10 },
                change: (e: any) => {
                    queryBldrObj.notifyChange(e.value, args.elements);
                },
            renderingTicks: (args: SliderTickEventArgs) => {
                if (args.tickElement.classList.contains('e-large')) {
                    args.tickElement.classList.add('e-custom');
            }
        }
    });
            ticksSlider.appendTo('#' + args.elements.id);

        }
    }}
];

let importRules: RuleModel = {
    'condition': 'and',
    'rules': [{
        'label': 'CustomerID',
        'field': 'CustomerID',
        'type': 'number',
        'operator': 'Not Equal',
        'value': ['BERGS']
    },
    {
        'condition': 'or',
        'rules': [{
            'label': 'In_stock',
                'field': 'In_stock',
                'type': 'string',
                'operator': 'Equal',
                'value': ['Yes']
        },
        {
            'label': 'OrderID',
            'field': 'OrderID',
            'type': 'number',
            'operator': 'Equal',
            'value': [10]
        },
        {
        'condition': 'and',
            'rules': [{
                'label': 'Price',
                'field': 'Price',
                'type': 'number',
                'operator': 'Equal',
                'value': ['10']
            }]
        }]
    }]
    };
let queryBldrObj: QueryBuilder = new QueryBuilder({ columns: filter, height: 'auto', width: '800px' , rule: importRules });
queryBldrObj.appendTo('#querybuilder');

let buttonElem: Element;

//getrules
buttonElem = queryBldrObj.createElement('Button',{ attrs: {type: 'button', class: 'e-control e-btn e-primary', id: 'getrules'}});
buttonElem.textContent = 'GetRules';
document.getElementById('property').appendChild(buttonElem);
document.getElementById('getrules').onclick = (): void => {
    //queryBldrObj.reset();
    let content: HTMLElement = document.getElementById('content');
	content.innerText = JSON.stringify({condition: queryBldrObj.rule.condition, rules: queryBldrObj.rule.rules}, null, 2);
    dialogObj.show();
};

let dialogObj: Dialog = new Dialog({
    width: '750px',
    header: 'Rules',
    target: document.getElementById('target'),
    isModal: true,
    animationSettings: { effect: 'None' },
    buttons: [{
        click: dlgButtonClick,
        buttonModel: { content: 'OK', isPrimary: true }
    }],
});
dialogObj.appendTo('#modalDialog');
dialogObj.hide();
function dlgButtonClick(): void {
    dialogObj.hide();
}