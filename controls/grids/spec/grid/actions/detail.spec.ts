/**
 * Grid detail template spec document
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Sort } from '../../../src/grid/actions/sort';
import { Group } from '../../../src/grid/actions/group';
import { Selection } from '../../../src/grid/actions/selection';
import { Filter } from '../../../src/grid/actions/filter';
import { Page } from '../../../src/grid/actions/page';
import {RowDD } from "../../../src/grid/actions/row-reorder";
import { DetailRow } from '../../../src/grid/actions/detail-row';
import { filterData, employeeData, customerData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Edit } from '../../../src/grid/actions/edit';
import { createGrid, destroy } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { getParentIns } from '../../../src/grid/base/util';

Grid.Inject(Sort, Page, Filter, DetailRow, Group, Selection, Edit, RowDD, Toolbar, Aggregate);

describe('Detail template module', () => {

    function detail(e: any): void {
        let data: any = [];
        for (let i = 0; i < filterData.length; i++) {
            if (filterData[i]['EmployeeID'] === e.data.EmployeeID) {
                data.push(filterData[i]);
            }
        }
        let grid1: Grid = new Grid(
            {
                dataSource: filterData,
                selectionSettings: { type: 'Multiple', mode: 'Row' },
                allowSorting: true,
                allowPaging: true,
                pageSettings: { pageSize: 3 },
                allowGrouping: true,
                allowReordering: true,
                allowTextWrap: true,
                allowFiltering: true,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                    { field: 'Freight', width: 120, format: 'C', textAlign: 'Right' },
                    { field: 'ShipCity', headerText: 'Ship City', width: 150 }
                ],
            });
        grid1.appendTo((e.detailElement as Element).querySelector('#detailgrid') as HTMLElement);
    }

    describe('Render with invalid id testing', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowPaging: true,
                    detailTemplate: '#detailtemplate1',
                    detailDataBound: detail,
                    allowGrouping: true,
                    selectionSettings: { type: 'Multiple', mode: 'Row' },
                    allowFiltering: true,
                    allowSorting: true,
                    allowReordering: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120, format: 'C', textAlign: 'Right' },
                        { field: 'ShipCity', headerText: 'Ship City', width: 150 }
                    ]
                }, done);
        });

        it('Detail row render testing', () => {
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrowcollapse').length).toBe(12);
            expect(gridObj.getHeaderTable().querySelectorAll('.e-detailheadercell').length).toBe(1);
            expect(gridObj.getHeaderTable().querySelectorAll('.e-mastercell').length).toBe(1);
            expect(gridObj.getHeaderTable().querySelectorAll('.e-mastercell')[0].classList.contains('e-filterbarcell')).toBeTruthy();
        });

        it('Detail row expand testing', () => {
            (gridObj.getDataRows()[0].querySelector('.e-detailrowcollapse') as HTMLElement).click();
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(1);
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowexpand').length).toBe(1);
        });

        it('Detail collapse testing', () => {
            (gridObj.getDataRows()[0].querySelector('.e-detailrowexpand') as HTMLElement).click();
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowexpand').length).toBe(0);
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowcollapse').length).toBe(1);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Render testing', () => {
        let gridObj: Grid;
        let template: HTMLElement = createElement('script', { id: 'detailtemplate' });
        template.appendChild(createElement('div', { id: 'detailgrid' }));
        document.body.appendChild(template);
        let actionComplete: () => void;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData.map(data => data),
                    allowPaging: true,
                    detailTemplate: '#detailtemplate',
                    detailDataBound: detail,
                    allowGrouping: true,
                    editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    selectionSettings: { type: 'Multiple', mode: 'Row' },
                    allowFiltering: true,
                    allowSorting: true,
                    allowReordering: true,
                    actionComplete: actionComplete,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120, format: 'C', textAlign: 'Right' },
                        { field: 'ShipCity', headerText: 'Ship City', width: 150 }
                    ],
                }, done);
        });

        it('Detail row render testing', () => {
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrowcollapse').length).toBe(12);
            expect(gridObj.getHeaderTable().querySelectorAll('.e-detailheadercell').length).toBe(1);
            expect(gridObj.getHeaderTable().querySelectorAll('.e-mastercell').length).toBe(1);
            expect(gridObj.getHeaderTable().querySelectorAll('.e-mastercell')[0].classList.contains('e-filterbarcell')).toBeTruthy();
        });

        it('Detail row expand testing', () => {
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowcollapse')[0].getAttribute('aria-expanded')).toBe("false");
            (gridObj.getDataRows()[0].querySelector('.e-detailrowcollapse') as HTMLElement).click();
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[0] as HTMLElement).style.display).toBe('');
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowexpand').length).toBe(1);
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowcollapse').length).toBe(0);
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowexpand')[0].getAttribute('aria-expanded')).toBe("true");
        });

        it('Detail collapse testing', () => {
            (gridObj.getDataRows()[0].querySelector('.e-detailrowexpand') as HTMLElement).click();
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(1);
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowcollapse').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[0] as HTMLElement).style.display).toBe('none');
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowexpand').length).toBe(0);
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowcollapse')[0].getAttribute('aria-expanded')).toBe("false");
        });

        it('Expand method testing', () => {
            gridObj.detailRowModule.expand(gridObj.getDataRows()[1].querySelector('.e-detailrowcollapse'));
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(2);
            expect(gridObj.getDataRows()[1].querySelectorAll('.e-detailrowexpand').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[1] as HTMLElement).style.display).toBe('');

            gridObj.detailRowModule.expand(gridObj.getDataRows()[1].querySelector('.e-detailrowexpand'));
            expect(gridObj.getDataRows()[1].querySelectorAll('.e-detailrowexpand').length).toBe(1);
        });

        it('EJ2-7253- expand and collapse button is not working well after edit', () => {
            gridObj.detailRowModule.expand(gridObj.getDataRows()[1].querySelector('.e-detailrowcollapse'));
            expect(gridObj.getDataRows()[1].querySelectorAll('.e-detailrowexpand').length).toBe(1);
            gridObj.selectRow(1);
            gridObj.startEdit();
            gridObj.endEdit();
            expect(gridObj.getDataRows()[1].querySelectorAll('.e-detailrowexpand').length).toBeGreaterThan(0);
        });


        it('Collapse method testing', () => {
            gridObj.detailRowModule.collapse(gridObj.getDataRows()[1].querySelector('.e-detailrowexpand'));
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(2);
            expect(gridObj.getDataRows()[1].querySelectorAll('.e-detailrowcollapse').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[1] as HTMLElement).style.display).toBe('none');

            gridObj.detailRowModule.collapse(gridObj.getDataRows()[1].querySelector('.e-detailrowcollapse'));
            expect(gridObj.getDataRows()[1].querySelectorAll('.e-detailrowcollapse').length).toBe(1);
        });

        it('Alt Down shortcut testing', (done: Function) => {
            gridObj.element.focus();
            let args: any = { action: 'altDownArrow', preventDefault: () => { }, target: createElement('div') };
            let leftArgs: any = { action: 'rightArrow', preventDefault: () => { }, target: createElement('div') };
            gridObj.rowSelected = () => {
                gridObj.keyboardModule.keyAction(leftArgs);
                gridObj.keyboardModule.keyAction(args);
                expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(3);
                expect(gridObj.getDataRows()[2].querySelectorAll('.e-detailrowexpand').length).toBe(1);
                expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[2] as HTMLElement).style.display).toBe('');
                gridObj.keyboardModule.keyAction(args);
                expect(gridObj.getDataRows()[2].querySelectorAll('.e-detailrowexpand').length).toBe(1);
                gridObj.rowSelected = null;
                done();
            };
            gridObj.selectRow(2, true);
        });

        it('Alt Up shortcut testing', () => {
            let args: any = { action: 'altUpArrow', preventDefault: () => { }, target: createElement('div') };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(3);
            expect(gridObj.getDataRows()[2].querySelectorAll('.e-detailrowcollapse').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[2] as HTMLElement).style.display).toBe('none');

            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getDataRows()[2].querySelectorAll('.e-detailrowcollapse').length).toBe(1);
        });

        it('ctrlDownArrow shortcut testing', () => {
            let args: any = { action: 'ctrlDownArrow', preventDefault: () => { }, target: createElement('div') };
            gridObj.selectRow(3, true);
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(12);
            expect(gridObj.getDataRows()[3].querySelectorAll('.e-detailrowexpand').length).toBe(1);
            expect(gridObj.getDataRows()[4].querySelectorAll('.e-detailrowexpand').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[3] as HTMLElement).style.display).toBe('');
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[4] as HTMLElement).style.display).toBe('');
        });

        it('ctrlUpArrow shortcut testing', () => {
            let args: any = { action: 'ctrlUpArrow', preventDefault: () => { }, target: createElement('div') };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(12);
            expect(gridObj.getDataRows()[3].querySelectorAll('.e-detailrowcollapse').length).toBe(1);
            expect(gridObj.getDataRows()[4].querySelectorAll('.e-detailrowcollapse').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[3] as HTMLElement).style.display).toBe('none');
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[4] as HTMLElement).style.display).toBe('none');
        });

        it('Alt Down shortcut with selection disabled testing', () => {
            gridObj.allowSelection = false;
            gridObj.dataBind();
            let leftArgs: any = { action: 'rightArrow', preventDefault: () => { }, target: createElement('div') };
            gridObj.keyboardModule.keyAction(leftArgs);
            let args: any = { action: 'altDownArrow', preventDefault: () => { }, target: createElement('div') };
            gridObj.keyboardModule.keyAction(args);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[2] as HTMLElement).style.display).toBe('none');

            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getDataRows()[2].querySelectorAll('.e-detailrowexpand').length).toBe(0);
        });


        it('Single column group testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'grouping') {
                    let grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
                    let content = gridObj.getContent().querySelectorAll('tr');

                    expect(grpHIndent[0].querySelector('.e-headercelldiv').classList.contains('e-emptycell')).toBeTruthy();
                    expect(gridObj.getHeaderTable().querySelectorAll('.e-detailheadercell').length).toBe(1);
                    expect(content[1].querySelectorAll('.e-indentcell').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('OrderID');
        });

        it('Alt Down shortcut with grouping testing', (done: Function) => {
            gridObj.element.focus();
            gridObj.allowSelection = true;
            gridObj.dataBind();
            gridObj.rowSelected = () => {
                let args: any = { action: 'altDownArrow', preventDefault: () => { }, target: createElement('div') };
                let leftArgs: any = { action: 'rightArrow', preventDefault: () => { }, target: createElement('div') };
                gridObj.keyboardModule.keyAction(leftArgs);
                gridObj.keyboardModule.keyAction(args);
                expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[0] as HTMLElement).style.display).toBe('');
                done();
            };
            gridObj.selectRow(1, true);
        });

        it('Expand method with grouping testing', () => {
            gridObj.detailRowModule.expand(gridObj.getDataRows()[0].querySelector('.e-detailrowcollapse'));
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(2);
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowexpand').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[0] as HTMLElement).style.display).toBe('');
        });

        it('expandcollapse group rows method testing', () => {
            gridObj.groupModule.expandCollapseRows(gridObj.getContent().querySelectorAll('.e-recordplusexpand')[4]);
            //     expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(33);
        });

        it('toogleExpandcollapse with invalid element testing', () => {
            (gridObj.detailRowModule as any).toogleExpandcollapse(gridObj.getDataRows()[1].querySelector('.e-rowcell'));
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(2);
            expect(gridObj.getDataRows()[1].querySelectorAll('.e-detailrowexpand').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[1] as HTMLElement).style.display).toBe('');
        });


        afterAll(() => {
            remove(document.getElementById('detailtemplate'));
            destroy(gridObj);
            gridObj = template = actionComplete = null;
        });
    });

    describe('Hierarchy Render testing', () => {
        let gridObj: Grid;
        let actionComplete: () => void;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    allowPaging: true,
                    allowGrouping: true,
                    selectionSettings: { type: 'Multiple', mode: 'Row' },
                    allowFiltering: true,
                    allowSorting: true,
                    allowReordering: true,
                    actionComplete: actionComplete,
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                        { field: 'FirstName', headerText: 'First Name', textAlign: 'Left', width: 100 },
                        { field: 'Title', headerText: 'Title', textAlign: 'Left', width: 120 },
                        { field: 'City', headerText: 'City', textAlign: 'Left', width: 100 },
                        { field: 'Country', headerText: 'Country', textAlign: 'Left', width: 100 }
                    ],
                    childGrid: {
                        dataSource: filterData, queryString: 'EmployeeID',
                        allowPaging: true,
                        allowGrouping: true,
                        selectionSettings: { type: 'Multiple', mode: 'Row' },
                        pageSettings: { pageCount: 5, pageSize: 5 },
                        allowFiltering: true,
                        allowSorting: true,
                        groupSettings: { showGroupedColumn: false },
                        allowReordering: true,
                        allowTextWrap: true,
                        columns: [
                            { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 75 },
                            { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                            { field: 'ShipCity', headerText: 'Ship City', textAlign: 'Left', width: 100 },
                            { field: 'Freight', headerText: 'Freight', textAlign: 'Left', width: 120 },
                            { field: 'ShipName', headerText: 'Ship Name', textAlign: 'Left', width: 100 }
                        ],
                        childGrid: {
                            dataSource: customerData,
                            allowPaging: true,
                            allowGrouping: true,
                            selectionSettings: { type: 'Multiple', mode: 'Row' },
                            pageSettings: { pageCount: 5, pageSize: 5 },
                            allowFiltering: true,
                            allowSorting: true,
                            groupSettings: { showGroupedColumn: false },
                            allowReordering: true,
                            allowTextWrap: true,
                            queryString: 'CustomerID',
                            columns: [
                                { field: 'CustomerID', headerText: 'Customer ID', textAlign: 'Right', width: 75 },
                                { field: 'Phone', headerText: 'Phone', textAlign: 'Left', width: 100 },
                                { field: 'Address', headerText: 'Address', textAlign: 'Left', width: 120 },
                                { field: 'Country', headerText: 'Country', textAlign: 'Left', width: 100 }
                            ],
                        },
                    },
                }, done);
        });

        it('Hierarchy row render testing', () => {
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrowcollapse').length).toBe(9);
            expect(gridObj.getHeaderTable().querySelectorAll('.e-detailheadercell').length).toBe(1);
            expect(gridObj.getHeaderTable().querySelectorAll('.e-mastercell').length).toBe(1);
            expect(gridObj.getHeaderTable().querySelectorAll('.e-mastercell')[0].classList.contains('e-filterbarcell')).toBeTruthy();
        });

        it('Hierarchy row expand testing', () => {
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowcollapse')[0].getAttribute('aria-expanded')).toBe('false');
            (gridObj.getDataRows()[0].querySelector('.e-detailrowcollapse') as HTMLElement).click();
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(1);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow')[0].querySelectorAll('.e-grid').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[0] as HTMLElement).style.display).toBe('');
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowexpand').length).toBe(1);
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowcollapse').length).toBe(0);
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowexpand')[0].getAttribute('aria-expanded')).toBe('true');
        });

        it('Hierarchy collapse testing', () => {
            (gridObj.getDataRows()[0].querySelector('.e-detailrowexpand') as HTMLElement).click();
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(1);
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowcollapse').length).toBe(1);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow')[0].querySelectorAll('.e-grid').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[0] as HTMLElement).style.display).toBe('none');
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowexpand').length).toBe(0);
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowcollapse')[0].getAttribute('aria-expanded')).toBe('false');
        });

        it('Expand method testing', () => {
            gridObj.detailRowModule.expand(gridObj.getDataRows()[1].querySelector('.e-detailrowcollapse'));
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(2);
            expect(gridObj.getDataRows()[1].querySelectorAll('.e-detailrowexpand').length).toBe(1);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow')[1].querySelectorAll('.e-grid').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[1] as HTMLElement).style.display).toBe('');

            gridObj.detailRowModule.expand(gridObj.getDataRows()[1].querySelector('.e-detailrowexpand'));
            expect(gridObj.getDataRows()[1].querySelectorAll('.e-detailrowexpand').length).toBe(1);
        });

        it('Collapse method testing', () => {
            gridObj.detailRowModule.collapse(gridObj.getDataRows()[1].querySelector('.e-detailrowexpand'));
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(2);
            expect(gridObj.getDataRows()[1].querySelectorAll('.e-detailrowcollapse').length).toBe(1);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow')[1].querySelectorAll('.e-grid').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[1] as HTMLElement).style.display).toBe('none');

            gridObj.detailRowModule.collapse(gridObj.getDataRows()[1].querySelector('.e-detailrowcollapse'));
            expect(gridObj.getDataRows()[1].querySelectorAll('.e-detailrowcollapse').length).toBe(1);
        });

        it('Expand method with number args testing', () => {
            gridObj.detailRowModule.expand(1);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(2);
            expect(gridObj.getDataRows()[1].querySelectorAll('.e-detailrowexpand').length).toBe(1);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow')[1].querySelectorAll('.e-grid').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[1] as HTMLElement).style.display).toBe('');

            gridObj.detailRowModule.expand(gridObj.getDataRows()[1].querySelector('.e-detailrowexpand'));
            expect(gridObj.getDataRows()[1].querySelectorAll('.e-detailrowexpand').length).toBe(1);
        });

        it('Collapse method with number args testing', () => {
            gridObj.detailRowModule.collapse(1);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(2);
            expect(gridObj.getDataRows()[1].querySelectorAll('.e-detailrowcollapse').length).toBe(1);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow')[1].querySelectorAll('.e-grid').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[1] as HTMLElement).style.display).toBe('none');

            gridObj.detailRowModule.collapse(gridObj.getDataRows()[1].querySelector('.e-detailrowcollapse'));
            expect(gridObj.getDataRows()[1].querySelectorAll('.e-detailrowcollapse').length).toBe(1);
        });

        it('Alt Down shortcut testing', () => {
            let args: any = { action: 'altDownArrow', preventDefault: () => { }, target: createElement('div') };
            gridObj.selectRow(2, true);
            let leftArgs: any = { action: 'rightArrow', preventDefault: () => { }, target: createElement('div') };
            gridObj.keyboardModule.keyAction(leftArgs);
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(3);
            expect(gridObj.getDataRows()[2].querySelectorAll('.e-detailrowexpand').length).toBe(1);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow')[2].querySelectorAll('.e-grid').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[2] as HTMLElement).style.display).toBe('');

            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getDataRows()[2].querySelectorAll('.e-detailrowexpand').length).toBe(1);
        });

        it('Alt Up shortcut testing', () => {
            let args: any = { action: 'altUpArrow', preventDefault: () => { }, target: createElement('div') };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(3);
            expect(gridObj.getDataRows()[2].querySelectorAll('.e-detailrowcollapse').length).toBe(1);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow')[2].querySelectorAll('.e-grid').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[2] as HTMLElement).style.display).toBe('none');

            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getDataRows()[2].querySelectorAll('.e-detailrowcollapse').length).toBe(1);
        });

        it('ctrlDownArrow shortcut testing', () => {
            let args: any = { action: 'ctrlDownArrow', preventDefault: () => { }, target: createElement('div') };
            gridObj.selectRow(3, true);
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(9);
            expect(gridObj.getDataRows()[3].querySelectorAll('.e-detailrowexpand').length).toBe(1);
            expect(gridObj.getDataRows()[4].querySelectorAll('.e-detailrowexpand').length).toBe(1);
            expect(gridObj.getContentTable().querySelectorAll('.e-grid').length).toBe(9);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[3] as HTMLElement).style.display).toBe('');
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[4] as HTMLElement).style.display).toBe('');
        });

        it('ctrlUpArrow shortcut testing', () => {
            let args: any = { action: 'ctrlUpArrow', preventDefault: () => { }, target: createElement('div') };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(9);
            expect(gridObj.getDataRows()[3].querySelectorAll('.e-detailrowcollapse').length).toBe(1);
            expect(gridObj.getDataRows()[4].querySelectorAll('.e-detailrowcollapse').length).toBe(1);
            expect(gridObj.getContentTable().querySelectorAll('.e-grid').length).toBe(9);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[3] as HTMLElement).style.display).toBe('none');
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[4] as HTMLElement).style.display).toBe('none');
        });

        it('Alt Down shortcut with selection disabled testing', () => {
            gridObj.allowSelection = false;
            gridObj.dataBind();
            let leftArgs: any = { action: 'rightArrow', preventDefault: () => { }, target: createElement('div') };
            gridObj.keyboardModule.keyAction(leftArgs);
            let args: any = { action: 'altDownArrow', preventDefault: () => { }, target: createElement('div') };
            gridObj.keyboardModule.keyAction(args);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[2] as HTMLElement).style.display).toBe('none');

            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getDataRows()[2].querySelectorAll('.e-detailrowexpand').length).toBe(0);
        });


        it('Single column group testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'grouping') {
                    let grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
                    let content = gridObj.getContent().querySelectorAll('tr');

                    expect(grpHIndent[0].querySelector('.e-headercelldiv').classList.contains('e-emptycell')).toBeTruthy();
                    expect(gridObj.getHeaderTable().querySelectorAll('.e-detailheadercell').length).toBe(1);
                    expect(content[1].querySelectorAll('.e-indentcell').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('EmployeeID');
        });

        it('Alt Down shortcut with grouping testing', () => {
            gridObj.allowSelection = true;
            gridObj.dataBind();
            gridObj.selectRow(1, true);
            let leftArgs: any = { action: 'rightArrow', preventDefault: () => { }, target: createElement('div') };
            gridObj.keyboardModule.keyAction(leftArgs);
            let args: any = { action: 'altDownArrow', preventDefault: () => { }, target: createElement('div') };
            gridObj.keyboardModule.keyAction(args);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[0] as HTMLElement).style.display).toBe('');
        });

        it('Expand method with grouping testing', () => {
            gridObj.detailRowModule.expand(gridObj.getDataRows()[0].querySelector('.e-detailrowcollapse'));
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(2);
            expect(gridObj.getDataRows()[0].querySelectorAll('.e-detailrowexpand').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[0] as HTMLElement).style.display).toBe('');
        });

        it('expandcollapse group rows method testing', () => {
            gridObj.groupModule.expandCollapseRows(gridObj.getContent().querySelectorAll('.e-recordplusexpand')[4]);
            //expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(27);
        });

        it('toogleExpandcollapse with invalid element testing', () => {
            (gridObj.detailRowModule as any).toogleExpandcollapse(gridObj.getDataRows()[1].querySelector('.e-rowcell'));
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(2);
            expect(gridObj.getDataRows()[1].querySelectorAll('.e-detailrowexpand').length).toBe(1);
            expect((gridObj.getContentTable().querySelectorAll('.e-detailrow')[1] as HTMLElement).style.display).toBe('');
        });


        afterAll(() => {
            (gridObj.detailRowModule as any).destroy();
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('Keyboard operation', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });

        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => {
                gridObj.element.focus();
                gridObj.dataBound = null;
                done();
            };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    allowPaging: true,
                    detailTemplate: '#detailtemplate',
                    detailDataBound: detail,
                    allowGrouping: true,
                    selectionSettings: { type: 'Multiple', mode: 'Row' },
                    allowFiltering: true,
                    allowSorting: true,
                    allowReordering: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120, format: 'C', textAlign: 'Right' },
                        { field: 'ShipCity', headerText: 'Ship City', width: 150 }
                    ],
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });
        it('Detail expand testing', () => {
            let target: any = (gridObj.getDataRows()[0].querySelector('.e-detailrowcollapse') as HTMLElement);
            gridObj.keyboardModule.keyAction(<any>{ action: 'enter', target: target, preventDefault: () => { } });
            expect(target.classList.contains('e-detailrowexpand')).toBeTruthy();
        });
        it('memory leak', () => {     
            profile.sample();
            let average: any = inMB(profile.averageChange)
            //Check average change in memory samples to not be over 10MB
            expect(average).toBeLessThan(10);
            let memory: any = inMB(getMemoryProfile())
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });   

        afterAll(() => {
            elem.remove();
            gridObj = elem = null;
        });
    });
    describe('Action Complete event for expandAll and collapseAll=> ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    detailTemplate: '#detailtemplate',
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120, format: 'C', textAlign: 'Right' },
                        { field: 'ShipCity', headerText: 'Ship City', width: 150 }
                    ],
                    actionComplete: actionComplete
                }, done);
        });
        it('actionComplete event triggerred for expandAll action complete', () => {
            actionComplete = (args?: any): void => {
                expect(args.requestType).toBe('expandAllComplete');
            }
            gridObj.actionComplete = actionComplete;
            gridObj.detailRowModule.expandAll();
        });
        it('actionComplete event triggerred for collapseAll action complete', () => {
            actionComplete = (args?: any): void => {
                expect(args.requestType).toBe('collapseAllComplete');
            }
            gridObj.actionComplete = actionComplete;
            gridObj.detailRowModule.collapseAll();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });   
    
     describe('Hierarchy Render testing', () => {
        let gridObj: Grid;
        let actionComplete: () => void;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    allowPaging: true,
                    allowGrouping: true,
                    selectionSettings: { type: 'Multiple', mode: 'Row' },
                    allowFiltering: true,
                    allowSorting: true,
                    allowReordering: true,
                    actionComplete: actionComplete,
                    allowRowDragAndDrop: true,
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                        { field: 'FirstName', headerText: 'First Name', textAlign: 'Left', width: 100 },
                        { field: 'Title', headerText: 'Title', textAlign: 'Left', width: 120 },
                        { field: 'City', headerText: 'City', textAlign: 'Left', width: 100 },
                        { field: 'Country', headerText: 'Country', textAlign: 'Left', width: 100 }
                    ],
                    childGrid: {
                        dataSource: filterData, queryString: 'EmployeeID',
                        allowPaging: true,
                        allowGrouping: true,
                        allowRowDragAndDrop: true,
                        selectionSettings: { type: 'Multiple', mode: 'Row' },
                        pageSettings: { pageCount: 5, pageSize: 5 },
                        allowFiltering: true,
                        allowSorting: true,
                        groupSettings: { showGroupedColumn: false },
                        allowReordering: true,
                        allowTextWrap: true,
                        
                        columns: [
                            { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 75 },
                            { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                            { field: 'ShipCity', headerText: 'Ship City', textAlign: 'Left', width: 100 },
                            { field: 'Freight', headerText: 'Freight', textAlign: 'Left', width: 120 },
                            { field: 'ShipName', headerText: 'Ship Name', textAlign: 'Left', width: 100 }
                        ]
                    },
                }, done);
        });

        it('EJ2-895366 - Error throws when using dialogTemplate editing in the Child grid', (done: Function) => {
            // code coverage
            let detailDataBound: (e: any) => void = (e: any) => {
                e.childGrid.parentDetails.parentInstObj = gridObj;
                let parentIns = getParentIns(e.childGrid);
                parentIns = detailDataBound = gridObj.detailDataBound = null;
                done();
            };
            gridObj.detailDataBound = detailDataBound;
            gridObj.detailRowModule.expand(gridObj.getDataRows()[1].querySelector('.e-detailrowcollapse'));
        });
        
        it('Hierarchy row with expand-RowDD', () => {
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(1);
            expect(gridObj.getDataRows()[1].querySelectorAll('.e-detailrowexpand').length).toBe(1);
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow')[0].children[1].getAttribute('colspan')).toBe('6');
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });
 
    describe('indent cell width check for autogenerated cols', () => {
        let gridObj: Grid;
        let rowDataBound: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData.slice(0, 30),
                    allowFiltering: true,
                    filterSettings: { type: 'Excel' },
                    detailTemplate:'#detailTemp',
                }, done);
        });
        it('indent width checking:', () => {
            rowDataBound = (args: any) =>{
                expect(((gridObj.element.querySelectorAll('.e-detailrowcollapse')[0])as HTMLElement).offsetWidth).toBe(30);
                expect(((gridObj.element.querySelectorAll('.e-detailheadercell')[0])as HTMLElement).offsetWidth).toBe(30);
            }
            gridObj.rowDataBound = rowDataBound;
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = rowDataBound = null;
        });
    });
    
    describe('EJ2-48397 - getRowIndexByPrimaryKey thrown script error while render child grid', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowPaging: true,
                    detailTemplate: `<div>Hello</div>`,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right', isPrimaryKey: true },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120, format: 'C', textAlign: 'Right' },
                        { field: 'ShipCity', headerText: 'Ship City', width: 150 }
                    ]
                }, done);
        });
        it('Test script error', (done: Function) => {
            let detailDataBound = (e: any) => {
                gridObj.getRowIndexByPrimaryKey(10249);
                gridObj.detailDataBound = null;
                done();
            }
            gridObj.detailDataBound = detailDataBound;
            (gridObj.getDataRows()[0].querySelector('.e-detailrowcollapse') as HTMLElement).click();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-49020 - minWidth is not working', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowPaging: true,
                    detailTemplate: `<div>Hello</div>`,
                    width:600,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', minWidth: 100, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150, showInColumnChooser: false },
                        { field: 'OrderDate', headerText: 'Order Date', format: 'yMd', width: 150, textAlign: 'Right' },
                        { field: 'Freight', format: 'C2', minWidth: 120, textAlign: 'Right' },
                        { field: 'ShippedDate', headerText: 'Shipped Date', width: 150, format: 'yMd', textAlign: 'Right' },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 150 }
                    ]
                }, done);
        });
        it('Test script error', (done: Function) => {
            expect(gridObj.getHeaderTable().querySelectorAll('col')[1].style.width).toBe('100px');
            expect(gridObj.getHeaderTable().querySelectorAll('col')[4].style.width).toBe('120px');
            expect(gridObj.getContentTable().querySelectorAll('col')[1].style.width).toBe('100px');
            expect(gridObj.getContentTable().querySelectorAll('col')[4].style.width).toBe('120px');
            done();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    
    describe('EJ2-61821 - Destroying Grid with child Grid', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    aggregates: [{
                        columns: [{
                            type: 'Max',
                            field: 'HireDate',
                            format: { type: 'date', skeleton: 'medium' },
                            footerTemplate: '${Max}',
                        }],
                    }],
                    columns: [
                        {field: 'EmployeeID',headerText: 'Employee ID',textAlign: 'Right',width: 125},
                        { field: 'FirstName', headerText: 'Name', width: 125 },
                        { field: 'Title', headerText: 'Title', width: 180 },
                        { field: 'City', headerText: 'City', width: 110 },
                        {field: 'HireDate',headerText: 'Hire date',width: 130,format: 'yMd',type: 'datetime'},],
                    childGrid: {
                        dataSource: filterData, queryString: 'EmployeeID',
                        columns: [
                            { field: 'OrderID', headerText: 'Order ID', width: 120 },
                            { field: 'ShipCity', headerText: 'Ship City', width: 120 },
                            { field: 'Freight', headerText: 'Freight', width: 120, format: 'N2' },
                            { field: 'ShipName', headerText: 'Ship Name', width: 150 },
                        ],
                    aggregates: [{
                        columns: [{
                            type: 'Average',
                            field: 'Freight',
                            footerTemplate: 'Average: ${Average}',}
                        ]},
                        {
                            columns: [{type: 'Sum',
                            field: 'Freight',
                            footerTemplate: 'Sum: ${Sum}',}]
                        }],
                    },}, done);
                });
                it('Grid destroy testing', () => {
                gridObj.detailRowModule.expand(gridObj.getDataRows()[0].querySelector('.e-detailrowcollapse'));
                gridObj.destroy();
                expect(document.getElementsByClassName('e-grid')[0]).toBe(undefined);
            });
            afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('EJ2-867924 - Refresh row element without collapsing detail row', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData.slice(0,3),
                    allowPaging: true,
                    selectionSettings: { type: 'Multiple', mode: 'Row' },
                    height: 500,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: "Batch", showConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', isPrimaryKey: true, width: 75 },
                        { field: 'FirstName', headerText: 'First Name', textAlign: 'Left', width: 100 },
                        { field: 'Title', headerText: 'Title', textAlign: 'Left', width: 120 },
                    ],
                    childGrid: {
                        dataSource: [],
                        queryString: 'EmployeeID',
                        columns: [
                            { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 75 },
                            { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                            { field: 'ShipCity', headerText: 'Ship City', textAlign: 'Left', width: 100 },
                        ]
                    },
                }, done);
        });
        it('Expand row', () => {
            (gridObj.getDataRows()[0].querySelector('.e-detailrowcollapse') as HTMLElement).click();
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(1);
        });
        it('close edit', (done: Function) => {
            let cellSaved = (args?: any): void => {
                gridObj.closeEdit();
                expect(gridObj.getRowsObject()[2].index).toBe(1);
                gridObj.cellSaved = null;
                done();
            };
            gridObj.editCell(1, 'FirstName');
            gridObj.cellSaved = cellSaved;
            gridObj.saveCell();
        });

        afterAll(() => {
            (gridObj.detailRowModule as any).destroy();
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Code Coverage - Hierarchy Render testing', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData.slice(0,3),
                    allowPaging: true,
                    selectionSettings: { type: 'Multiple', mode: 'Row' },
                    allowFiltering: true,
                    height: 500,
                    allowSorting: true,
                    allowReordering: true,
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                        { field: 'FirstName', headerText: 'First Name', textAlign: 'Left', width: 100 },
                        { field: 'Title', headerText: 'Title', textAlign: 'Left', width: 120 },
                        { field: 'City', headerText: 'City', textAlign: 'Left', width: 100 },
                        { field: 'Country', headerText: 'Country', textAlign: 'Left', width: 100 }
                    ],
                    childGrid: {
                        dataSource: filterData, queryString: 'EmployeeID',
                        allowPaging: true,
                        allowGrouping: true,
                        selectionSettings: { type: 'Multiple', mode: 'Row' },
                        pageSettings: { pageCount: 5, pageSize: 5 },
                        allowFiltering: true,
                        allowSorting: true,
                        groupSettings: { showGroupedColumn: false },
                        allowReordering: true,
                        allowTextWrap: true,
                        columns: [
                            { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 75 },
                            { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                            { field: 'ShipCity', headerText: 'Ship City', textAlign: 'Left', width: 100 },
                            { field: 'Freight', headerText: 'Freight', textAlign: 'Left', width: 120 },
                            { field: 'ShipName', headerText: 'Ship Name', textAlign: 'Left', width: 100 }
                        ]
                    },
                }, done);
        });

        it('keypress testing', () => {
            (gridObj.getDataRows()[0].querySelector('.e-rowcell') as HTMLElement).click();
            let args: any = { action: 'enter' };
            (gridObj.detailRowModule as any).keyPressHandler(args);
        });
        it('Hierarchy row expand testing', () => {
            gridObj.childGrid.query = gridObj.query;
            (gridObj as any).isPrinting = true;
            (gridObj.getDataRows()[2].querySelector('.e-detailrowcollapse') as HTMLElement).click();
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(1);
        });

        it('Detail collapse testing', () => {
            (gridObj.getDataRows()[2].querySelector('.e-detailrowexpand') as HTMLElement).click();
            expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(1);
            (gridObj.detailRowModule as any).refreshColSpan();
        });


        afterAll(() => {
            (gridObj.detailRowModule as any).destroy();
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Code Coverage - Hierarchy Render testing', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData.slice(0,3),
                    allowPaging: true,
                    allowFiltering: true,
                    allowTextWrap: true,
                    height: 'auto',
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                        { field: 'FirstName', headerText: 'First Name', textAlign: 'Left', width: 100 },
                        { field: 'Title', headerText: 'Title', textAlign: 'Left', width: 120 },
                        { field: 'City', headerText: 'City', textAlign: 'Left', width: 100 },
                        { field: 'Country', headerText: 'Country', textAlign: 'Left', width: 100 }
                    ],
                    childGrid: {
                        dataSource: filterData,
                        queryString: 'EmployeeID',
                        allowPaging: true,
                        columns: [
                            { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 75 },
                            { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                            { field: 'ShipCity', headerText: 'Ship City', textAlign: 'Left', width: 100 },
                            { field: 'Freight', headerText: 'Freight', textAlign: 'Left', width: 120 },
                            { field: 'ShipName', headerText: 'Ship Name', textAlign: 'Left', width: 100 }
                        ]
                    },
                }, done);
        });


        it('row expand testing - 1', () => {
            (gridObj.getDataRows()[1].querySelector('.e-detailrowcollapse') as HTMLElement).click();
        });

        it('row expand empty cell testing ', () => {
            (gridObj.getDataRows()[0].querySelector('.e-rowcell') as HTMLElement).click();
        });

        it('row expand testing - 2', () => {
            (gridObj.getDataRows()[2].querySelector('.e-detailrowcollapse') as HTMLElement).click();
            gridObj.isDestroyed = true;
            gridObj.element.innerHTML = '';
            (gridObj.detailRowModule as any).destroy();
        });

        it('check the addEventListener Binding', () => {
            gridObj.isDestroyed = true;
            gridObj.detailRowModule.addEventListener();
            gridObj.isDestroyed = false;
        });

        afterAll(() => {
            (gridObj.detailRowModule as any).destroy();
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('On property change detail template', () => {
        let gridObj: Grid;
        let dataBound: (e: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData.slice(0, 5),
                    allowPaging: true,
                    width: 600,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', minWidth: 100, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150, showInColumnChooser: false },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 150 }
                    ]
                }, done);
        });
        it('Bind detail template', (done: Function) => {
            dataBound = function (e: any) {
                expect(gridObj.element.querySelector('.e-detailrowcollapse')).not.toBeNull();
                gridObj.dataBound = null;
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.detailTemplate = "<div>Hello</div>";
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = dataBound = null;
        });
    });

    describe('On property change child grid', () => {
        let gridObj: Grid;
        let dataBound: (e: any) => void;
        let columns: string[];

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData.slice(0, 2),
                    allowPaging: true,
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                        { field: 'FirstName', headerText: 'First Name', textAlign: 'Left', width: 100 },
                        { field: 'Title', headerText: 'Title', textAlign: 'Left', width: 120 },
                    ],
                }, done);
        });

        it('Bind child grid', (done) => {
            dataBound = function (e: any) {
                expect(gridObj.element.querySelector('.e-detailrowcollapse')).not.toBeNull();
                columns = gridObj.getColumnFieldNames();
                gridObj.dataBound = null;
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.childGrid = {
                dataSource: filterData,
                queryString: 'EmployeeID',
                allowPaging: true,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 75 },
                    { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                    { field: 'ShipCity', headerText: 'Ship City', textAlign: 'Left', width: 100 },
                ]
            };
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = columns = dataBound = null;
        });
    });


    describe('Code Coverage - Hierarchy Render testing', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData.slice(0, 3),
                    allowPaging: true,
                    allowFiltering: true,
                    height: 700,
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                        { field: 'FirstName', headerText: 'First Name', textAlign: 'Left', width: 100 },
                        { field: 'Title', headerText: 'Title', textAlign: 'Left', width: 120 },
                        { field: 'City', headerText: 'City', textAlign: 'Left', width: 100 },
                        { field: 'Country', headerText: 'Country', textAlign: 'Left', width: 100 }
                    ],
                    childGrid: {
                        dataSource: filterData.slice(0, 1),
                        queryString: 'EmployeeID',
                        columns: [
                            { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 75 },
                            { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                            { field: 'ShipCity', headerText: 'Ship City', textAlign: 'Left', width: 100 },
                            { field: 'Freight', headerText: 'Freight', textAlign: 'Left', width: 120 },
                            { field: 'ShipName', headerText: 'Ship Name', textAlign: 'Left', width: 100 }
                        ]
                    },
                }, done);
        });


        it('auxilaryclickHandler coverage', () => {
            (gridObj as any).detailRowModule.auxilaryclickHandler({ button: 1, preventDefault: () => { }, target: gridObj.element.querySelector('.e-icon-grightarrow')});
            (gridObj as any).detailRowModule.auxilaryclickHandler({ button: 1, preventDefault: () => { }, target: gridObj.element.querySelector('.e-rowcell')});
        });

        it('auxilaryclickHandler coverage', () => {
            (gridObj as any).detailRowModule.auxilaryclickHandler({ button: 1, preventDefault: () => { }, target: gridObj.element.querySelector('.e-rowcell')});
            (gridObj as any).isReact = true;
            (gridObj as any).detailRowModule.clickHandler({ button: 1, preventDefault: () => { }, target: gridObj.element.querySelector('.e-icon-grightarrow')});
        });

        afterAll(() => {
            (gridObj.detailRowModule as any).destroy();
            destroy(gridObj);
            gridObj = null;
        });
    });
});
