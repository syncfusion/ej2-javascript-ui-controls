/**
 * Spreadsheet default sample
 */
import { Spreadsheet, SheetModel, Selection, KeyboardNavigation, KeyboardShortcut } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';

Spreadsheet.Inject(Selection, KeyboardNavigation, KeyboardShortcut);

enableRipple(true);

let sheet: SheetModel[] = [
    {
        rows: [
            {
                cells: [
                    { value: 'Order ID' },
                    { value: 'Customer ID' },
                    { value: 'Employee ID' },
                    { value: 'Ship Name' },
                    { value: 'Ship City' },
                    { value: 'Ship Address' }
                ]
            },
            {
                cells: [
                    { value: '10248' },
                    { value: 'VINET' },
                    { value: '5' },
                    { value: 'Vins et alcools Chevalier' },
                    { value: 'Reims' },
                    { value: '59 rue de lAbbaye' }
                ]
            },
            {
                cells: [
                    { value: '10249' },
                    { value: 'TOMSP' },
                    { value: '6' },
                    { value: 'Toms Spezialitäten' },
                    { value: 'Münster' },
                    { value: 'Luisenstr. 48' }
                ]
            },
            {
                cells: [
                    { value: '10250' },
                    { value: 'HANAR' },
                    { value: '4' },
                    { value: 'Hanari Carnes' },
                    { value: 'Rio de Janeiro' },
                    { value: 'Rua do Paço, 67' }
                ]
            },
            {
                cells: [
                    { value: '10251' },
                    { value: 'VICTE' },
                    { value: '3' },
                    { value: 'Victuailles en stock' },
                    { value: 'Lyon' },
                    { value: '2, rue du Commerce' }
                ]
            },
            {
                cells: [
                    { value: '10252' },
                    { value: 'SUPRD' },
                    { value: '4' },
                    { value: 'Suprêmes délices' },
                    { value: 'Charleroi' },
                    { value: 'Boulevard Tirou, 255' }
                ]
            },
            {
                cells: [
                    { value: '10253' },
                    { value: 'HANAR' },
                    { value: '3' },
                    { value: 'Hanari Carnes' },
                    { value: 'Rio de Janeiro' },
                    { value: 'Rua do Paço, 67' }
                ]
            },
            {
                cells: [
                    { value: '10254' },
                    { value: 'CHOPS' },
                    { value: '5' },
                    { value: 'Chop-suey Chinese' },
                    { value: 'Bern' },
                    { value: 'Hauptstr. 31' }
                ]
            },
            {
                cells: [
                    { value: '10255' },
                    { value: 'RICSU' },
                    { value: '9' },
                    { value: 'Richter Supermarkt' },
                    { value: 'Genève' },
                    { value: 'Starenweg 5' }
                ]
            },
            {
                cells: [
                    { value: '10256' },
                    { value: 'WELLI' },
                    { value: '3' },
                    { value: 'Wellington Importadora' },
                    { value: 'Resende' },
                    { value: 'Rua do Mercado, 12' }
                ]
            },
            {
                cells: [
                    { value: '10257' },
                    { value: 'HILAA' },
                    { value: '4' },
                    { value: 'HILARION-Abastos' },
                    { value: 'San Cristóbal' },
                    { value: 'Carrera 22 con Ave' }
                ]
            }
        ],
        columns: [
            { width: 80 }, { width: 80 }, { width: 82 },
            { width: 160 }, { width: 110 }, { width: 130 }
        ]
    }
];

let spreadsheet: Spreadsheet = new Spreadsheet({ sheets: sheet, height: 'auto' });

spreadsheet.appendTo('#spreadsheet');
