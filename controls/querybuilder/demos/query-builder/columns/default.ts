/**
 * CheckBox Default Sample
 */
import { QueryBuilder , RuleModel, ColumnsModel, Validation} from './../../../src/query-builder/index';
import { getComponent } from '@syncfusion/ej2-base';
import { orderData } from '../data-source';
import { DropDownList, MultiSelect, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
MultiSelect.Inject(CheckBoxSelection);
let elem: HTMLElement;
let dropDownObj: DropDownList;
let multiSelectObj: MultiSelect;
let inOperators: string [] = ['in', 'notin'];
let filter: ColumnsModel [] = [
    { field: 'EmployeeID', label: 'EmployeeID', type: 'number', template: {
        create: () => {
            elem = document.createElement('input');
            elem.setAttribute('type', 'text');
            return elem;
        },
        destroy: (args: {elementId: string}) => {
            let multiSelect: MultiSelect = (getComponent(document.getElementById(args.elementId), 'multiselect') as MultiSelect);
            if (multiSelect) {
                multiSelect.destroy();
            }
            let textBox: NumericTextBox = (getComponent(document.getElementById(args.elementId), 'numerictextbox') as NumericTextBox);
            if (textBox) {
                textBox.destroy();
            }
        },
        write: (args: {elements: Element, values: string[] | string | number,  operator: string }) => {
            if (inOperators.indexOf(args.operator) > -1) {
            multiSelectObj = new MultiSelect({
                dataSource: [1, 2, 3, 4, 5],
                value: args.values as string [],
                mode: 'CheckBox',
                change: (e: any) => {
                    qbObj.notifyChange(e.value, e.element);
                }
            });
            multiSelectObj.appendTo('#' + args.elements.id);
        } else {
            let inputobj: NumericTextBox = new NumericTextBox({
                placeholder: 'Value',
                value: args.values as number,
                change: (e: any) => {
                    qbObj.notifyChange(e.value, inputobj.element);
                }
            });
            inputobj.appendTo('#' + args.elements.id);
            inputobj.value = args.values as number;
            inputobj.dataBind()
        }
    }
    }},
    { field: 'CustomerID', label: 'CustomerID', type: 'string', template: {
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
                    qbObj.notifyChange(e.itemData.value, e.element);
                }
            });
            dropDownObj.appendTo('#' + args.elements.id);
        }
    }},
    { field: 'OrderID', label: 'OrderID', type: 'number', validation: {isRequired : true} as Validation},
    { field: 'in_stock', label: 'In_stock', type: 'boolean'},
    { field: 'price', label: 'Price', type: 'number'},
    { field: 'Date', label: 'Date', type: 'date'}
];

let importRules: RuleModel = {
    'condition': 'and',
    'rules': [{
            'label': 'EmployeeID',
            'field': 'EmployeeID',
            'type': 'number',
            'operator': 'in',
            'value': [4, 5]
        },
        {
            'condition': 'or',
            'rules': [{
                    'label': 'Price',
                    'field': 'price',
                    'type': 'number',
                    'operator': 'equal',
                    'value': 1
                },
                {
                    'label': 'CustomerID',
                    'field': 'CustomerID',
                    'type': 'string',
                    'operator': 'in',
                    'value': ['BERGS']
                },
                {
                    'condition': 'and',
                    'rules': [{
                            'label': 'In_stock',
                            'field': 'in_stock',
                            'type': 'boolean',
                            'operator': 'equal',
                            'value': ['Yes']
                        },
                        {
                            'label': 'OrderID',
                            'field': 'OrderID',
                            'type': 'number',
                            'operator': 'equal',
                            'value': [10]
                        }]
                }]
        }]
    };
let qbObj: QueryBuilder = new QueryBuilder({ columns: filter, dataSource: orderData, sortDirection: 'Ascending', maxGroupCount: 5, rule: importRules });
    qbObj.appendTo('#querybuilder');