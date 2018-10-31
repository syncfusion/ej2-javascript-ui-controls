/**
 * Grid dialog edit spec document
 */
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Page } from '../../../src/grid/actions/page';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Selection } from '../../../src/grid/actions/selection';
import { dialogEditComplexData } from '../base/datasource.spec';
import { createGrid, destroy } from '../base/specutil.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Input } from '@syncfusion/ej2-inputs';
import { Column } from '../../../src';
import { TemplateEditCell } from '../../../src/grid/renderer/template-edit-cell';
import { extend } from '@syncfusion/ej2-base';

Grid.Inject(Filter, Page, Selection, Group, Edit, Sort, Reorder, Toolbar);

describe('Dialog Template Editing module', () => {

    let dataSource: Function = (): Object[] => {
        return dialogEditComplexData.map((d: any) => {
            d.CustomerID = {CustomerID: d.CustomerID};
            return d;
        });
    };
    // tslint:disable-next-line:no-multiline-string
    let template: string = `<div id='formId' >
                <table cellspacing="10" style="margin: auto">
                        <colgroup>
                            <col width="20%">
                            <col width="30%">
                            <col width="20%">
                            <col width="30%">
                        </colgroup>
                    <tr>
                        <td style="text-align: right;">Order ID
                        </td>
                        <td style="text-align: left">
                            <input id="OrderID" name="OrderID" value="\${OrderID}" style="text-align: right; height: 28px" />
                        </td>
                        <td style="text-align: right;">Customer ID
                        </td>
                        <td style="text-align: left">
                            <input id="CustomerID" name="CustomerID_CustomerID" value="\${CustomerID.CustomerID}" style="height: 28px" />
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right;">Freight
                        </td>
                        <td style="text-align: left">
                            <input type="text" id="Freight" name="Freight" value="\${Freight}" />
                        </td>
                        <td style="text-align: right;">Ship Country
                        </td>
                        <td style="text-align: left">
                            <select id="ShipCountry" name="ShipCountry" value="\${ShipCountry}">
                                <option value="Argentina">Argentina</option>
                                <option value="Austria">Austria</option>
                                <option value="Belgium">Belgium</option>
                                <option value="Brazil">Brazil</option>
                                <option value="Canada">Canada</option>
                                <option value="Denmark">Denmark</option>
                                <option value="Finland">Finland</option>
                                <option value="France">France</option>
                                <option value="Germany">Germany</option>
                                <option value="Ireland">Ireland</option>
                                <option value="Italy">Italy</option>
                                <option value="Mexico">Mexico</option>
                                <option value="Norway">Norway</option>
                                <option value="Poland">Poland</option>
                                <option value="Portugal">Portugal</option>
                                <option value="Spain">Spain</option>
                                <option value="Sweden">Sweden</option>
                                <option value="Switzerland">Switzerland</option>
                                <option value="UK">UK</option>
                                <option value="USA">USA</option>
                                <option value="Venezuela">Venezuela</option>
                            </select>
                        </td>
                    </tr>                      
                    <tr>
                        <td style="text-align: right;">Ship City
                        </td>
                        <td style="text-align: left">
                            <input id="ShipCity" name="ShipCity" value="\${ShipCity}" style="height: 28px" />
                        </td>
                        <td style="text-align: right;">Ship Name
                        </td>
                        <td style="text-align: left">
                            <input id="ShipName" name="ShipName" value="\${ShipName}"  style="height: 28px" />
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right;">Ship Address
                        </td>
                        <td style="text-align: left">
                            <textarea id="ShipAddress" name="ShipAddress" value="\${ShipAddress}" >\${ShipAddress}</textarea>
                        </td>
                        <td style="text-align: right;">Verified
                        </td>
                        <td style="text-align: left">
                            <input type='checkbox' id="Verified" name="Verified" value="\${Verified}" />
                        </td>
                    </tr>
                </table>
            </div>`;
    describe('Dialog Template editing render => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true,
                        mode: 'Dialog', showConfirmDialog: false, showDeleteConfirmDialog: false, template: template },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID.CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' , edit: {write: (args: any) => {Input.createInput({element: args.element})}}},
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' },
                        { headerText: 'Employee ID', template:"<div>${EmployeeID}</div>" }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it ('Render check', () => {
            expect(gridObj.editSettings.template).not.toBe(null);
        });

        it ('Compiler Fn', () => {
            expect((<any>gridObj).editTemplateFn).not.toBe(undefined);
        });

        it ('column edit object check', () => {
            expect((<Column>gridObj.columns[0]).edit instanceof TemplateEditCell).toBeTruthy();
        });

        it ('Edit Check', (done: Function) => {
            gridObj.selectRow(8);
            gridObj.actionBegin = (args: any) => {
                expect(args.form).toBeUndefined();
                expect(args.dialog).toBeUndefined();
                expect(args.rowData).not.toBeNull();
                expect(args.requestType).toBe('beginEdit');
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.form).not.toBeUndefined();
                expect(args.dialog).not.toBeUndefined();
                expect(args.form.elements.length).toBe(8);
                [].slice.call(args.form.elements).forEach((element: any) => {
                    expect(element.value).not.toBeNull();
                });
                // Complex data Check.
                expect(args.form.elements['CustomerID_CustomerID']).not.toBeNull();
                expect((<Column>gridObj.columns[4]).edit.write).toHaveBeenCalled();
                done();
            };
            spyOn((<Column>gridObj.columns[4]).edit, 'write');
            gridObj.startEdit();
        });

        it ('Save Check =>',  (done: Function) => {
            gridObj.actionBegin = (args: any) => {
                expect(args.requestType).toBe('save');
                expect(JSON.stringify(args.rowData)).toBe(JSON.stringify(gridObj.getSelectedRecords()[0]));
                expect(args.form.elements['CustomerID_CustomerID'].value).toBe('WELLI');
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.requestType).toBe('save');
                expect(JSON.stringify(args.rowData)).toBe(JSON.stringify(gridObj.getSelectedRecords()[0]));
                expect(args.dialog.isDestroyed).toBeTruthy();
                expect((<Column>gridObj.columns[4]).edit.read).toHaveBeenCalled();
                expect((<Column>gridObj.columns[4]).edit.destroy).toHaveBeenCalled();
                done();
            };
            spyOn((<Column>gridObj.columns[4]).edit, 'read');
            spyOn((<Column>gridObj.columns[4]).edit, 'destroy');
            gridObj.endEdit();
        });

        it ('Edit Check data change', (done: Function) => {
            gridObj.selectRow(4);
            gridObj.actionBegin = (args: any) => {
                expect(args.requestType).toBe('beginEdit');
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.dialog).not.toBeUndefined();
                expect(args.form.elements['CustomerID_CustomerID']).not.toBeNull();
                args.form.elements['CustomerID_CustomerID'].value = 'UPDATED';
                args.form.elements['Verified'].checked = true;
                let data: Object = extend({}, {}, args.rowData, true);
                gridObj.editModule.getCurrentEditedData(args.form, data);
                expect(data['CustomerID']['CustomerID']).toBe('UPDATED');
                expect(data['Verified']).toBe(true);
                done();
            };
            gridObj.startEdit();
        });

        it ('Cancel Check =>',  (done: Function) => {
            gridObj.actionBegin = (args: any) => {
                expect(args.requestType).toBe('cancel');
                expect(JSON.stringify(args.rowData)).toBe(JSON.stringify(gridObj.getSelectedRecords()[0]));
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.requestType).toBe('cancel');
                expect(gridObj.dataSource[4]['CustomerID']['CustomerID']).toBe('SUPRD');
                expect(args.dialog.isDestroyed).toBeTruthy();
                done();
            };
            gridObj.closeEdit();
        });

        it('Add Check =>', (done: Function) => {
            gridObj.actionBegin = (args: any) => {
                expect(args.requestType).toBe('add');
                expect(args.data['OrderID']).toBeUndefined();
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.form).not.toBeUndefined();
                expect(args.dialog).not.toBeUndefined();
                expect(args.form.elements.length).toBe(8);
                [].slice.call(args.form.elements).forEach((element: any) => {
                    expect(element.value).not.toBeNull();
                });
                expect((<Column>gridObj.columns[4]).edit.write).toHaveBeenCalled();
                expect(args.rowData['CustomerID']['CustomerID']).toBeUndefined();
                done();
            };
            spyOn((<Column>gridObj.columns[4]).edit, 'write');
            gridObj.addRecord();
        });

        it ('new Record save check => ', (done: Function) => {
            let length: number = (<any>gridObj.dataSource).length;
            gridObj.actionBegin = (args: any) => {
                expect(args.rowData['OrderID']).toBeUndefined();
                expect(args.requestType).toBe('save');
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.data['OrderID']).toBe(10333);
                expect((<any>gridObj.dataSource).length).toBe(length + 1);
                expect(args.dialog.isDestroyed).toBeTruthy();
                expect((<Column>gridObj.columns[4]).edit.read).toHaveBeenCalled();
                expect((<Column>gridObj.columns[4]).edit.destroy).toHaveBeenCalled();
                done();
            };
            spyOn((<Column>gridObj.columns[4]).edit, 'read');
            spyOn((<Column>gridObj.columns[4]).edit, 'destroy');
            (<HTMLInputElement>gridObj.element.querySelector('#' + 'OrderID')).value = '10333';
            gridObj.endEdit();
        });

        afterAll((done: Function) => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            setTimeout( () => { done(); }, 1000);
        });
    });
});

describe('Inline Template Editing module', () => {

    let dataSource: Function = (): Object[] => {
        return dialogEditComplexData.map((d: any) => {
            return d;
        });
    };
    // tslint:disable-next-line:no-multiline-string
    let template: string = `<div id='formId' >
                <table cellspacing="10" style="margin: auto">
                        <colgroup>
                            <col width="20%">
                            <col width="30%">
                            <col width="20%">
                            <col width="30%">
                        </colgroup>
                    <tr>
                        <td style="text-align: right;">Order ID
                        </td>
                        <td style="text-align: left">
                            <input id="OrderID" name="OrderID" value="\${OrderID}" style="text-align: right; height: 28px" />
                        </td>
                        <td style="text-align: right;">Customer ID
                        </td>
                        <td style="text-align: left">
                            <input id="CustomerID" name="CustomerID_CustomerID" value="\${CustomerID.CustomerID}" style="height: 28px" />
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right;">Freight
                        </td>
                        <td style="text-align: left">
                            <input type="text" id="Freight" name="Freight" value="\${Freight}" />
                        </td>
                        <td style="text-align: right;">Ship Country
                        </td>
                        <td style="text-align: left">
                            <select id="ShipCountry" name="ShipCountry" value="\${ShipCountry}">
                                <option value="Argentina">Argentina</option>
                                <option value="Austria">Austria</option>
                                <option value="Belgium">Belgium</option>
                                <option value="Brazil">Brazil</option>
                                <option value="Canada">Canada</option>
                                <option value="Denmark">Denmark</option>
                                <option value="Finland">Finland</option>
                                <option value="France">France</option>
                                <option value="Germany">Germany</option>
                                <option value="Ireland">Ireland</option>
                                <option value="Italy">Italy</option>
                                <option value="Mexico">Mexico</option>
                                <option value="Norway">Norway</option>
                                <option value="Poland">Poland</option>
                                <option value="Portugal">Portugal</option>
                                <option value="Spain">Spain</option>
                                <option value="Sweden">Sweden</option>
                                <option value="Switzerland">Switzerland</option>
                                <option value="UK">UK</option>
                                <option value="USA">USA</option>
                                <option value="Venezuela">Venezuela</option>
                            </select>
                        </td>
                    </tr>                      
                    <tr>
                        <td style="text-align: right;">Ship City
                        </td>
                        <td style="text-align: left">
                            <input id="ShipCity" name="ShipCity" value="\${ShipCity}" style="height: 28px" />
                        </td>
                        <td style="text-align: right;">Ship Name
                        </td>
                        <td style="text-align: left">
                            <input id="ShipName" name="ShipName" value="\${ShipName}"  style="height: 28px" />
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right;">Ship Address
                        </td>
                        <td style="text-align: left">
                            <textarea id="ShipAddress" name="ShipAddress" value="\${ShipAddress}" >\${ShipAddress}</textarea>
                        </td>
                        <td style="text-align: right;">Verified
                        </td>
                        <td style="text-align: left">
                            <input type='checkbox' id="Verified" name="Verified" value="\${Verified}" />
                        </td>
                    </tr>
                </table>
            </div>`;
    describe('Inline Template editing render => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true,
                        showConfirmDialog: false, showDeleteConfirmDialog: false, template: template },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID.CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' , edit: {write: (args: any) => {Input.createInput({element: args.element})}}},
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it ('Render check', () => {
            expect(gridObj.editSettings.template).not.toBe(null);
        });

        it ('Compiler Fn', () => {
            expect((<any>gridObj).editTemplateFn).not.toBe(undefined);
        });

        it ('column edit object check', () => {
            expect((<Column>gridObj.columns[0]).edit instanceof TemplateEditCell).toBeTruthy();
        });

        it ('Edit Check', (done: Function) => {
            gridObj.selectRow(8);
            gridObj.actionBegin = (args: any) => {
                expect(args.form).toBeUndefined();
                expect(args.rowData).not.toBeNull();
                expect(args.requestType).toBe('beginEdit');
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.form).not.toBeUndefined();
                expect(args.form.elements.length).toBe(8);
                [].slice.call(args.form.elements).forEach((element: any) => {
                    expect(element.value).not.toBeNull();
                });
                // Complex data Check.
                expect(args.form.elements['CustomerID_CustomerID']).not.toBeNull();
                expect((<Column>gridObj.columns[4]).edit.write).toHaveBeenCalled();
                done();
            };
            spyOn((<Column>gridObj.columns[4]).edit, 'write');
            gridObj.startEdit();
        });

        it ('Save Check =>',  (done: Function) => {
            gridObj.actionBegin = (args: any) => {
                expect(args.requestType).toBe('save');
                expect(JSON.stringify(args.rowData)).toBe(JSON.stringify(args.data));
                expect(args.form.elements['CustomerID_CustomerID'].value).toBe('WELLI');
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.requestType).toBe('save');
                expect(JSON.stringify(args.rowData)).toBe(JSON.stringify(args.data));
                expect((<Column>gridObj.columns[4]).edit.read).toHaveBeenCalled();
                expect((<Column>gridObj.columns[4]).edit.destroy).toHaveBeenCalled();
                done();
            };
            spyOn((<Column>gridObj.columns[4]).edit, 'read');
            spyOn((<Column>gridObj.columns[4]).edit, 'destroy');
            gridObj.endEdit();
        });

        it ('Edit Check data change', (done: Function) => {
            gridObj.selectRow(4);
            gridObj.actionBegin = (args: any) => {
                expect(args.requestType).toBe('beginEdit');
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.form.elements['CustomerID_CustomerID']).not.toBeNull();
                args.form.elements['CustomerID_CustomerID'].value = 'UPDATED';
                args.form.elements['Verified'].checked = true;
                let data: Object = extend({}, {}, args.rowData, true);
                gridObj.editModule.getCurrentEditedData(args.form, data);
                expect(data['CustomerID']['CustomerID']).toBe('UPDATED');
                expect(data['Verified']).toBe(true);
                done();
            };
            gridObj.startEdit();
        });

        it ('Cancel Check =>',  (done: Function) => {
            gridObj.actionBegin = (args: any) => {
                expect(args.requestType).toBe('cancel');
                expect(JSON.stringify(args.rowData)).toBe(JSON.stringify(args.data));
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.requestType).toBe('cancel');
                expect(gridObj.dataSource[4]['CustomerID']['CustomerID']).toBe('SUPRD');
                done();
            };
            gridObj.closeEdit();
        });

        it('Add Check =>', (done: Function) => {
            gridObj.actionBegin = (args: any) => {
                expect(args.requestType).toBe('add');
                expect(args.data['OrderID']).toBeUndefined();
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.form).not.toBeUndefined();
                expect(args.form.elements.length).toBe(8);
                [].slice.call(args.form.elements).forEach((element: any) => {
                    expect(element.value).not.toBeNull();
                });
                expect((<Column>gridObj.columns[4]).edit.write).toHaveBeenCalled();
                expect(args.rowData['CustomerID']['CustomerID']).toBeUndefined();
                done();
            };
            spyOn((<Column>gridObj.columns[4]).edit, 'write');
            gridObj.addRecord();
        });

        it ('new Record save check => ', (done: Function) => {
            let length: number = (<any>gridObj.dataSource).length;
            gridObj.actionBegin = (args: any) => {
                expect(args.rowData['OrderID']).toBeUndefined();
                expect(args.requestType).toBe('save');
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.data['OrderID']).toBe(10333);
                expect((<any>gridObj.dataSource).length).toBe(length + 1);
                expect((<Column>gridObj.columns[4]).edit.read).toHaveBeenCalled();
                expect((<Column>gridObj.columns[4]).edit.destroy).toHaveBeenCalled();
                done();
            };
            spyOn((<Column>gridObj.columns[4]).edit, 'read');
            spyOn((<Column>gridObj.columns[4]).edit, 'destroy');
            (<HTMLInputElement>gridObj.element.querySelector('#' + 'OrderID')).value = '10333';
            gridObj.endEdit();
        });

        afterAll((done: Function) => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            setTimeout( () => { done(); }, 1000);
        });
    });
});

describe('Edit Template Editing module', () => {

    let dataSource: Function = (): Object[] => {
        return dialogEditComplexData.map((d: any) => {
            return d;
        });
    };
    // tslint:disable-next-line:no-multiline-string
    let template: string = `<input id="CustomerID" class='e-field' name="CustomerID_CustomerID" value="\${CustomerID.CustomerID}" style="height: 28px" />`;
    let template1: string = `<input id="ShipName" class='e-field' name="ShipName" value="\${ShipName}"  style="height: 28px" />`;
    describe('Dialog Template editing render => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true,
                        showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID.CustomerID', type: 'string', editTemplate: template, validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' , edit: {write: (args: any) => {Input.createInput({element: args.element})}}},
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true, editTemplate: template1 },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it ('Render check', () => {
            expect((<Column>gridObj.columns[1]).editTemplate).not.toBe(null);
        });

        it ('Compiler Fn', () => {
            expect((<any>gridObj).columns[1].editTemplateFn).not.toBe(undefined);
        });

        it ('column edit object check', () => {
            expect((<Column>gridObj.columns[1]).edit instanceof TemplateEditCell).toBeTruthy();
        });

        it ('Edit Check', (done: Function) => {
            gridObj.selectRow(8);
            gridObj.actionBegin = (args: any) => {
                expect(args.form).toBeUndefined();
                expect(args.rowData).not.toBeNull();
                expect(args.requestType).toBe('beginEdit');
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.form).not.toBeUndefined();
                expect(args.form.elements.length).toBe(12);
                [].slice.call(args.form.elements).forEach((element: any) => {
                    expect(element.value).not.toBeNull();
                });
                // Complex data Check.
                expect(args.form.elements['CustomerID_CustomerID']).not.toBeNull();
                expect((<Column>gridObj.columns[4]).edit.write).toHaveBeenCalled();
                done();
            };
            spyOn((<Column>gridObj.columns[4]).edit, 'write');
            gridObj.startEdit();
        });

        it ('Save Check =>',  (done: Function) => {
            gridObj.actionBegin = (args: any) => {
                expect(args.requestType).toBe('save');
                expect(JSON.stringify(args.rowData)).toBe(JSON.stringify(args.data));
                expect(args.form.elements['CustomerID_CustomerID'].value).toBe('WELLI');
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.requestType).toBe('save');
                expect(JSON.stringify(args.rowData)).toBe(JSON.stringify(args.data));
                expect((<Column>gridObj.columns[4]).edit.read).toHaveBeenCalled();
                done();
            };
            spyOn((<Column>gridObj.columns[4]).edit, 'read');
            gridObj.endEdit();
        });

        it ('Edit Check data change', (done: Function) => {
            gridObj.selectRow(4);
            gridObj.actionBegin = (args: any) => {
                expect(args.requestType).toBe('beginEdit');
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.form.elements['CustomerID_CustomerID']).not.toBeNull();
                args.form.elements['CustomerID_CustomerID'].value = 'UPDATED';
                args.form.elements['Verified'].checked = true;
                let data: Object = extend({}, {}, args.rowData, true);
                gridObj.editModule.getCurrentEditedData(args.form, data);
                expect(data['CustomerID']['CustomerID']).toBe('UPDATED');
                expect(data['Verified']).toBe(true);
                done();
            };
            gridObj.startEdit();
        });

        it ('Cancel Check =>',  (done: Function) => {
            gridObj.actionBegin = (args: any) => {
                expect(args.requestType).toBe('cancel');
                expect(JSON.stringify(args.rowData)).toBe(JSON.stringify(args.data));
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.requestType).toBe('cancel');
                expect(gridObj.dataSource[4]['CustomerID']['CustomerID']).toBe('SUPRD');
                done();
            };
            gridObj.closeEdit();
        });

        it('Add Check =>', (done: Function) => {
            gridObj.actionBegin = (args: any) => {
                expect(args.requestType).toBe('add');
                expect(args.data['OrderID']).toBeUndefined();
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.form).not.toBeUndefined();
                expect(args.form.elements.length).toBe(12);
                [].slice.call(args.form.elements).forEach((element: any) => {
                    expect(element.value).not.toBeNull();
                });
                expect((<Column>gridObj.columns[4]).edit.write).toHaveBeenCalled();
                expect(args.rowData['CustomerID']['CustomerID']).toBeUndefined();
                done();
            };
            spyOn((<Column>gridObj.columns[4]).edit, 'write');
            gridObj.addRecord();
        });

        it ('new Record save check => ', (done: Function) => {
            let length: number = (<any>gridObj.dataSource).length;
            gridObj.actionBegin = (args: any) => {
                expect(args.rowData['OrderID']).toBeUndefined();
                expect(args.requestType).toBe('save');
            };
            gridObj.actionComplete = (args: any) => {
                expect(args.data['OrderID']).toBe(10333);
                expect((<any>gridObj.dataSource).length).toBe(length + 1);
                expect((<Column>gridObj.columns[4]).edit.read).toHaveBeenCalled();
                done();
            };
            spyOn((<Column>gridObj.columns[4]).edit, 'read');
            (<HTMLInputElement>gridObj.element.querySelector('[name=OrderID]')).value = '10333';
            (<HTMLInputElement>gridObj.element.querySelector('[name=CustomerID_CustomerID]')).value = 'hello';
            gridObj.endEdit();
        });

        afterAll((done: Function) => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            setTimeout( () => { done(); }, 1000);
        });
    });
});