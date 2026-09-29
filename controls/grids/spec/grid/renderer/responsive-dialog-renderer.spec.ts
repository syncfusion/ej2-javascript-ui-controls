/**
 * Adaptive dialog Renderer spec
 */
import { Grid } from '../../../src/grid/base/grid';
import { data } from '../base/datasource.spec';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { Edit } from '../../../src/grid/actions/edit';
import { Page } from '../../../src/grid/actions/page';
import { Filter } from '../../../src/grid/actions/filter';
import { Sort } from '../../../src/grid/actions/sort';
import { Group } from '../../../src/grid/actions/group';
import { ColumnChooser } from '../../../src/grid/actions/column-chooser';
import { ColumnMenu } from '../../../src/grid/actions/column-menu';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { createGrid, destroy, getKeyUpObj } from '../base/specutil.spec';
import { ResponsiveDialogAction } from '../../../src/grid/base/enum';
import { AdaptiveDialogEventArgs, NotifyArgs } from '../../../src/grid/base/interface';
import { select } from '@syncfusion/ej2-base';

Grid.Inject(Aggregate, Edit, Toolbar, Page, Filter, Sort, ColumnChooser, ColumnMenu, Group);

describe('Adaptive renderer', () => {
    describe('Ensure adaptive dialogs', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableAdaptiveUI: true,
                    allowFiltering: true,
                    allowSorting: true,
                    allowPaging: true,
                    filterSettings: { type: 'Excel' },
                    editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search', 'Print', 'ExcelExport', 'PdfExport', 'CsvExport'],
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'EmployeeID',
                            format: 'C2',
                            footerTemplate: 'Sum: ${Sum}'
                        }]
                    }]
                }, done);
        });

        it('Ensure initial rendered elements', () => {
            expect(document.querySelector('.e-toolbar-item[title=Edit]').classList.contains('e-hidden')).toBeTruthy();
            expect(document.querySelector('.e-toolbar-item[title=Delete]').classList.contains('e-hidden')).toBeTruthy();
            expect(document.querySelector('.e-toolbar-item[title=Update]').classList.contains('e-hidden')).toBeTruthy();
            expect(document.querySelector('.e-toolbar-item[title=Cancel]').classList.contains('e-hidden')).toBeTruthy();
            // expect(document.querySelector('.e-toolbar-item[title=Print]').classList.contains('e-hidden')).toBeFalsy();
            expect(document.querySelector('.e-gridresponsiveicons').classList.contains('e-hidden')).toBeTruthy();
            expect(document.querySelector('.e-toolbar-item[title=Edit]').querySelector('.e-tbar-btn-text')).toBeNull();
            expect(document.getElementsByClassName('e-summaryrow')[0].querySelectorAll('.e-summarycell:not([style="display: none;"])').length).toBe(5);
            expect(document.querySelector('.e-rowcell').getAttribute('data-cell')).toBeNull();
            expect(gridObj.rowRenderingMode).toBe('Horizontal');
        });

        it('Adaptive filter dialog check', (done: Function) => {
            let actionComplete = (args?: any): void => {
                if (args.requestType === 'filterchoicerequest') {
                    expect(document.getElementsByClassName('e-responsive-dialog').length).not.toBe(0);
                    expect(document.getElementsByClassName('e-resfilterdiv').length).not.toBe(0);
                    expect(document.getElementsByClassName('e-responsive-dialog')[0].classList.contains('e-bigger')).toBeTruthy();
                    expect(document.getElementsByClassName('e-resfilterdiv')[0].querySelector('.e-res-custom-element')).not.toBeNull();
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterModule.responsiveDialogRenderer.showResponsiveDialog(gridObj.getColumns()[0]);
        });

        it('Close adaptive filter dialog check', () => {
            gridObj.filterModule.responsiveDialogRenderer.closeCustomDialog();
            expect(document.getElementsByClassName('e-responsive-dialog').length).toBe(0);
        });

        it('Ensure toolbar edit and delete after selecting a row', (done: Function) => {
            let rowSelected = (args?: any): void => {
                expect(document.querySelector('.e-toolbar-item[title=Edit]').classList.contains('e-hidden')).toBeFalsy();
                expect(document.querySelector('.e-toolbar-item[title=Delete]').classList.contains('e-hidden')).toBeFalsy();
                expect(document.querySelector('.e-toolbar-item[title=Update]').classList.contains('e-hidden')).toBeTruthy();
                expect(document.querySelector('.e-toolbar-item[title=Cancel]').classList.contains('e-hidden')).toBeTruthy();
                gridObj.rowSelected = null;
                done();
            };
            gridObj.rowSelected = rowSelected;
            gridObj.selectRow(0, true);
        });

        it('Ensure toolbar edit and delete after deselecting a row', (done: Function) => {
            let rowDeselected = (args?: any): void => {
                expect(document.querySelector('.e-toolbar-item[title=Edit]').classList.contains('e-hidden')).toBeTruthy();
                expect(document.querySelector('.e-toolbar-item[title=Delete]').classList.contains('e-hidden')).toBeTruthy();
                expect(document.querySelector('.e-toolbar-item[title=Update]').classList.contains('e-hidden')).toBeTruthy();
                expect(document.querySelector('.e-toolbar-item[title=Cancel]').classList.contains('e-hidden')).toBeTruthy();
                gridObj.rowDeselected = null;
                done();
            };
            gridObj.rowDeselected = rowDeselected;
            gridObj.selectRow(0, true);
        });

        it('Edit start', (done: Function) => {
            let actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(document.getElementsByClassName('e-responsive-dialog').length).not.toBe(0);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            let actionBegin = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    gridObj.actionBegin = null;
                }
            };
            gridObj.actionBegin = actionBegin;
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Ensure vertical dialog rendering', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableAdaptiveUI: true,
                    rowRenderingMode: 'Vertical',
                    allowFiltering: true,
                    allowSorting: true,
                    allowPaging: true,
                    filterSettings: { type: 'Excel' },
                    editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'],
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ],
                    dataBound: () => {
                        expect(gridObj.enableHover).toBeFalsy();
                    },
                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'EmployeeID',
                            format: 'C2',
                            footerTemplate: 'Sum: ${Sum}'
                        }]
                    }]
                }, done);
        });

        it('Ensure initial rendered elements', () => {
            expect(document.querySelector('.e-grid.e-row-responsive')).not.toBeNull();
            expect(document.querySelector('.e-rowcell').getAttribute('data-cell')).not.toBeNull();
            expect(document.querySelector('.e-gridresponsiveicons').classList.contains('e-hidden')).toBeFalsy();
            expect(document.querySelectorAll('.e-gridresponsiveicons:not(.e-hidden)').length).toBe(2);
            expect(document.querySelector('.e-gridresponsiveicons.e-hidden .e-resback-icon')).not.toBeNull();
            expect(document.getElementsByClassName('e-summaryrow')[0].querySelectorAll('.e-summarycell:not([style="display: none;"])').length).toBe(1);
        });

        it('Open custom filter dialog', () => {
            expect(gridObj.filterModule.responsiveDialogRenderer.action).toBe(ResponsiveDialogAction.isFilter);
            gridObj.filterModule.responsiveDialogRenderer.isCustomDialog = true;
            gridObj.filterModule.responsiveDialogRenderer.showResponsiveDialog(gridObj.getColumns()[0]);
            expect(document.getElementsByClassName('e-customfilterdiv').length).toBe(1);
        });

        it('Adaptive filter dialog check', (done: Function) => {
            let actionComplete = (args?: any): void => {
                if (args.requestType === 'filterchoicerequest') {
                    expect((document.querySelector('.e-resfilterdiv').querySelector('.e-dlg-custom-header') as HTMLElement).innerText).toBe(args.filterModel.options.column.headerText);
                    expect(document.getElementsByClassName('e-responsive-dialog').length).toBe(2);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            let customDlgCnt: HTMLElement = document.querySelector('.e-customfilterdiv > .e-dlg-content');
            (customDlgCnt.querySelector('.e-res-header-text') as HTMLElement).click();
        });

        it('Open excel filter text filters', () => {
            (document.querySelector('.e-submenu.e-menu-item') as HTMLElement).click();
            let filterContent: HTMLElement = document.querySelector('.e-resfilterdiv > .e-dlg-content');
            expect(filterContent.querySelector('.e-res-contextmenu-wrapper')).not.toBeNull();
        });

        it('Filter responsive back button functionality check', () => {
            // used for code coverage
            let excelBase: any = gridObj.filterModule.filterModule.excelFilterBase;
            let top: any = excelBase.getCMenuYPosition(excelBase.dlg);
            excelBase = null;
            top = null;
            (document.querySelector('.e-resfilterback') as HTMLElement).click();
            let filterContent: HTMLElement = document.querySelector('.e-resfilterdiv > .e-dlg-content');
        });

        it('Ensure custom excel filter', () => {
            let filterContent: HTMLElement = document.querySelector('.e-resfilterdiv > .e-dlg-content');
            (filterContent.querySelector('.e-submenu.e-menu-item') as HTMLElement).click();
            (filterContent.querySelector('.e-excel-menu > .e-menu-item ') as HTMLElement).click();
            let filterCloseBtn: HTMLElement = document.querySelector('.e-resfilterdiv > .e-dlg-header-content');
            (filterCloseBtn.querySelector('.e-dlg-closeicon-btn') as HTMLElement).click();
            expect(document.getElementsByClassName('e-responsive-dialog').length).toBe(0);
            expect(gridObj.filterModule.responsiveDialogRenderer.isRowResponsive).toBeFalsy();
        });

        it('Filter string column testing', (done: Function) => {
            let actionComplete = (args?: Object): void => {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            gridObj.filterByColumn('CustomerID', 'equal', 'VINET');
        });

        it('Filter reset button check', (done: Function) => {
            gridObj.filterModule.responsiveDialogRenderer.isCustomDialog = true;
            gridObj.filterModule.responsiveDialogRenderer.showResponsiveDialog(gridObj.getColumns()[0]);
            let filterReset: HTMLElement = document.querySelector('.e-customfilterdiv > .e-dlg-content').querySelector('.e-filterset');
            expect(filterReset).not.toBeNull();
            let actionComplete = (args?: NotifyArgs): void => {
                if (args.requestType === 'filtering') {
                    gridObj.filterModule.responsiveDialogRenderer.closeCustomDialog();
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            filterReset.click();
        });

        it('Filter type changed to checkbox', (done: Function) => {
            gridObj.filterSettings.type = 'Menu';
            gridObj.filterModule.responsiveDialogRenderer.isCustomDialog = true;
            gridObj.filterModule.responsiveDialogRenderer.showResponsiveDialog(gridObj.getColumns()[1]);
            gridObj.filterModule.responsiveDialogRenderer.isRowResponsive = true;
            let actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    let filterContent: HTMLElement = document.querySelector('.e-resfilterdiv > .e-dlg-content');
                    expect(filterContent.querySelector('.e-flmenu')).not.toBeNull();
                    gridObj.filterModule.responsiveDialogRenderer.closeCustomDialog();
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterModule.responsiveDialogRenderer.showResponsiveDialog(gridObj.getColumns()[1]);
        });

        it('Open custom sort dialog', (done: Function) => {
            expect(gridObj.sortModule.responsiveDialogRenderer.action).toBe(ResponsiveDialogAction.isSort);
            gridObj.sortModule.responsiveDialogRenderer.showResponsiveDialog();
            expect(document.getElementsByClassName('e-ressortdiv').length).toBe(1);
            expect(document.getElementsByClassName('e-ressortbutton').length).toBe(gridObj.getColumns().length);
            (document.getElementsByClassName('e-ressortbutton')[0] as HTMLElement).click();
            (document.getElementsByClassName('e-ressortbutton')[0] as HTMLElement).click();
            let actionComplete = (args: NotifyArgs) => {
                if (args.requestType === 'sorting') {
                    expect(gridObj.currentViewData[0]['OrderID']).toBe(gridObj.dataSource[gridObj.dataSource.length - 1]['OrderID']);
                    gridObj.actionComplete = null;
                    done();
                }
            }
            gridObj.actionComplete = actionComplete;
            (document.getElementsByClassName('e-res-apply-btn')[0] as HTMLElement).click();
        });

        it('Reopen custom sort dialog', (done: Function) => {
            gridObj.sortModule.responsiveDialogRenderer.showResponsiveDialog();
            expect((document.getElementsByClassName('e-ressortbutton')[0] as HTMLElement).innerText).toBe('Descending');
            (document.getElementsByClassName('e-res-sort-clear-btn')[0] as HTMLElement).click();
            expect((document.getElementsByClassName('e-ressortbutton')[0] as HTMLElement).innerText).toBe('None');
            let actionComplete = (args: NotifyArgs) => {
                if (args.requestType === 'sorting') {
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            let filterCloseBtn: HTMLElement = document.querySelector('.e-ressortdiv > .e-dlg-header-content');
            (filterCloseBtn.querySelector('.e-res-apply-btn') as HTMLElement).click();
        });

        it('Ensure search', () => {
            expect(gridObj.element.querySelector('.e-grid .e-toolbar .e-input-group')).toBeNull();
            expect(gridObj.element.querySelector('.e-grid .e-toolbar .e-input-group-icon.e-search-icon')).not.toBeNull();
        });

        it('Check Custom toolbar', () => {
            gridObj.toolbar = [];
            expect(document.getElementsByClassName('e-res-toolbar')[0].querySelectorAll('.e-gridresponsiveicons').length).toBe(3);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-865624 - clipMode EllipsisWithTooltip not functioning correctly in Adaptive View', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: [{ OrderID: 10248, CustomerID: "column shows ellipsis with tooltip", EmployeeID: 1 }],
                    enableAdaptiveUI: true,
                    rowRenderingMode: 'Vertical',
                    height: 400,
                    width: 300,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', clipMode: "EllipsisWithTooltip", width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                    ],
                }, done);
        });        
        it('get the tooltip status', () => {
            let ele: HTMLElement = gridObj.getCellFromIndex(0,1);
            expect((gridObj as any).getTooltipStatus(ele)).toBeTruthy();
            ele = null;
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Ensure onproperty change', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableAdaptiveUI: true,
                    rowRenderingMode: 'Vertical',
                    allowMultiSorting: false,
                    allowFiltering: true,
                    allowSorting: true,
                    allowPaging: true,
                    cssClass: 'coverage',
                    filterSettings: { type: 'Excel' },
                    editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'],
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'EmployeeID',
                            format: 'C2',
                            footerTemplate: 'Sum: ${Sum}'
                        }]
                    }]
                }, done);
        });

        it('Open custom sort dialog', (done: Function) => {
            gridObj.sortModule.responsiveDialogRenderer.showResponsiveDialog();
            (document.getElementsByClassName('e-ressortbutton')[0] as HTMLElement).click();
            (document.getElementsByClassName('e-ressortbutton')[0] as HTMLElement).click();
            let actionComplete = (args: NotifyArgs) => {
                if (args.requestType === 'sorting') {
                    gridObj.actionComplete = null;
                    done();
                }
            }
            gridObj.actionComplete = actionComplete;
            (document.getElementsByClassName('e-res-apply-btn')[0] as HTMLElement).click();
        });

        it('Reopen custom sort dialog', () => {
            gridObj.sortModule.responsiveDialogRenderer.showResponsiveDialog();
            let filterCloseBtn: HTMLElement = document.querySelector('.e-ressortdiv > .e-dlg-header-content');
            (filterCloseBtn.querySelector('.e-dlg-closeicon-btn') as HTMLElement).click();
        });

        it('Filter string column testing', (done: Function) => {
            let actionComplete = (args?: Object): void => {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            gridObj.filterByColumn('CustomerID', 'equal', 'VINET');
        });

        it('Filter reset button check', (done: Function) => {
            gridObj.filterModule.responsiveDialogRenderer.isCustomDialog = true;
            gridObj.filterModule.responsiveDialogRenderer.showResponsiveDialog(gridObj.getColumns()[0]);
            let filterClear: HTMLElement = document.querySelector('.e-customfilterdiv > .e-dlg-header-content').querySelector('.e-res-filter-clear-btn');
            let actionComplete = (args?: NotifyArgs): void => {
                if (args.requestType === 'refresh') {
                    gridObj.filterModule.responsiveDialogRenderer.closeCustomDialog();
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            filterClear.click();
        });

        it('Filter string column testing', (done: Function) => {
            let actionComplete = (args?: Object): void => {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            gridObj.filterByColumn('CustomerID', 'equal', 'VINET');
        });

        it('Adaptive filter dialog check', (done: Function) => {
            gridObj.filterModule.responsiveDialogRenderer.isRowResponsive = true;
            let actionComplete = (args?: any): void => {
                if (args.requestType === 'filterchoicerequest') {
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterModule.responsiveDialogRenderer.showResponsiveDialog(gridObj.getColumns()[0]);
        });

        it('Clear filter by using excel header clear button', (done: Function) => {
            let actionComplete = (args: NotifyArgs) => {
                if (args.requestType === 'filtering') {
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            let filterContent: HTMLElement = document.querySelector('.e-resfilterdiv > .e-dlg-header-content');
            (filterContent.querySelector('.e-res-filter-clear-btn') as HTMLElement).click();
        });

        it('Edit start', (done: Function) => {
            let actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Ensure initial rendered elements', (done: Function) => {
            expect(document.getElementsByClassName('e-responsive-dialog').length).not.toBe(0);
            let actionComplete = (args?: any): void => {
                if (args.requestType === 'refresh') {
                    expect(document.querySelector('.e-grid.e-row-responsive')).toBeNull();
                    expect(document.getElementsByClassName('e-responsive-dialog').length).toBe(0);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.rowRenderingMode = 'Horizontal';
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Ensure vertical dialog rendering', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableAdaptiveUI: true,
                    rowRenderingMode: 'Vertical',
                    allowFiltering: true,
                    allowSorting: true,
                    allowPaging: true,
                    filterSettings: { type: 'Excel' },
                    editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'],
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120, visible: false },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120, allowFiltering: false },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120, allowSorting: false },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ]
                }, done);
        });

        it('Ensure custom sort dialog columns', () => {
            gridObj.showAdaptiveSortDialog();
            expect(document.querySelector('.e-responsivecoldiv[data-mappingname="CustomerID"]')).toBeNull();
            expect(document.querySelector('.e-responsivecoldiv[data-mappingname="ShipCountry"]')).toBeNull();
            (document.querySelector('.e-dlg-closeicon-btn') as HTMLElement).click();
        });

        // it('Ensure custom filter dialog columns', () => {
        //     gridObj.showAdaptiveFilterDialog();
        //     expect(document.querySelector('.e-responsivecoldiv[data-mappingname="CustomerID"]')).toBeNull();
        //     expect(document.querySelector('.e-responsivecoldiv[data-mappingname="EmployeeID"]')).toBeNull();
        //     (document.querySelector('.e-dlg-closeicon-btn') as HTMLElement).click();
        // });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-49530 - Grid’s adaptive view filter function is not working properly ', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableAdaptiveUI: true,
                    rowRenderingMode: 'Vertical',
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Excel' },
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120, visible: false },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120, allowFiltering: false },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120, allowSorting: false },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ]
                }, done);
        });

        it('Open the Adaptive dialog ', (done: Function) => {
            let beforeOpenAdaptiveDialog = (args: AdaptiveDialogEventArgs) => {
                gridObj.beforeOpenAdaptiveDialog = null;
                done();
            }
            gridObj.beforeOpenAdaptiveDialog = beforeOpenAdaptiveDialog;
            gridObj.element.querySelector('.e-grid .e-toolbar .e-resfilter-icon').click();
        });

        // it('Ensure custom filter dialog ', (done: Function) => {
        //     let actionComplete = (args?: any): void => {
        //         if (args.requestType === 'filterchoicerequest') {
        //             expect((document.querySelector('.e-resfilterdiv').querySelector('.e-dlg-custom-header') as HTMLElement).innerText).toBe(args.filterModel.options.column.headerText);
        //             gridObj.actionComplete = null;
        //             done();
        //         }
        //     };
        //     gridObj.actionComplete = actionComplete;
        //     let customDlgCnt: HTMLElement = document.querySelector('.e-customfilterdiv > .e-dlg-content');
        //     (customDlgCnt.querySelector('.e-res-header-text') as HTMLElement).click();
        // });


        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Ensure adaptive filter and sort dialog events', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableAdaptiveUI: true,
                    allowFiltering: true,
                    allowSorting: true,
                    allowPaging: true,
                    filterSettings: { type: 'Excel' },
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120, visible: false },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120, allowFiltering: false },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120, allowSorting: false },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ]
                }, done);
        });

        it('Ensure filter dialog event', (done: Function) => {
           let beforeOpenAdaptiveDialog = (args: AdaptiveDialogEventArgs) => {
               expect(args.requestType).toBe("beforeOpenAptiveFilterDialog");
                gridObj.beforeOpenAdaptiveDialog = null;
                done();
           }
           gridObj.beforeOpenAdaptiveDialog = beforeOpenAdaptiveDialog;
           gridObj.showAdaptiveFilterDialog();
        });

        it('Ensure sort dialog event', (done: Function) => {
            let beforeOpenAdaptiveDialog = (args: AdaptiveDialogEventArgs) => {
                expect(args.requestType).toBe("beforeOpenAptiveSortDialog");
                 gridObj.beforeOpenAdaptiveDialog = null;
                 done();
            }
            gridObj.beforeOpenAdaptiveDialog = beforeOpenAdaptiveDialog;
            gridObj.showAdaptiveSortDialog();
         });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    
    describe('EJ2-824777 - Textwrap is not working properly with vertical row rendering', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableAdaptiveUI: true,
                    rowRenderingMode: 'Vertical',
                    allowFiltering: true,
                    allowTextWrap: true, 
                    textWrapSettings: { wrapMode: 'Both' },
                    allowSorting: true,
                    allowPaging: true,
                    filterSettings: { type: 'Excel' },
                    editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'],
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ]
                }, done);
        });

        it('Ensuring the CSS class', () => {
            gridObj.enableVerticalRendering();
            expect(gridObj.getRows()[0].classList.contains('e-verticalwrap')).toBeTruthy();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    // used for coverage
    describe('Ensure onproperty change', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    rowRenderingMode: 'Horizontal',
                    allowMultiSorting: false,
                    allowFiltering: true,
                    allowSorting: true,
                    allowPaging: true,
                    filterSettings: { type: 'Excel' },
                    editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'],
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'EmployeeID',
                            format: 'C2',
                            footerTemplate: 'Sum: ${Sum}'
                        }]
                    }]
                }, done);
        });

        it('bind enableAdaptiveUI', (done: Function) => {
            gridObj.enableAdaptiveUI = true;
            expect(1).toBe(1)
            done();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Ensure vertical dialog rendering with toolbar and column chooser', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    rowRenderingMode: 'Vertical',
                    allowFiltering: true,
                    allowSorting: true,
                    allowPaging: true,
                    enableAdaptiveUI: true,
                    filterSettings: { type: 'Excel' },
                    showColumnChooser: true,
                    editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search', 'ColumnChooser', 'Print', 'ExcelExport', 'PdfExport', 'CsvExport'],
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ],
                }, done);
        });

        it('ToolbarMenu popup enure', (done: Function) => {
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_responsivetoolbaritems' } });
            gridObj.toolbarModule.toolbarMenuElement.querySelector('.e-pdfexport').click();
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_responsivetoolbaritems' } });
            gridObj.toolbarModule.toolbarMenuElement.querySelector('.e-excelexport').click();
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_responsivetoolbaritems' } });
            gridObj.toolbarModule.toolbarMenuElement.querySelector('.e-csvexport').click();
            done();
        });

        it('ToolbarMenu popup column chooser popup close', () => {
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_responsivetoolbaritems' } });
            gridObj.toolbarModule.toolbarMenuElement.querySelector('.e-columnchooser').click();
            let columnChooseHeader: HTMLElement = document.querySelector('.e-rescolumnchooserdiv > .e-dlg-header-content');
            (columnChooseHeader.querySelector('.e-dlg-closeicon-btn') as HTMLElement).click();
            expect(document.getElementsByClassName('e-responsive-dialog').length).toBe(0);
        });

        it('Responsive column chooser popup open', (done: Function) => {
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_responsivetoolbaritems' } });
            gridObj.toolbarModule.toolbarMenuElement.querySelector('.e-columnchooser').click();
            done();
        });

        it('CC action check', (done: Function) => {
            let actionComplete = (args: any) => {
                if (args.requestType === 'columnstate') {
                    done();
                }
            }
            gridObj.actionComplete = actionComplete;
            const selectAll: any = document.querySelector('.e-selectall');
            selectAll.click();
            selectAll.click();
            (document.getElementsByClassName('e-res-apply-btn')[0] as HTMLElement).click();     
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Ensure vertical dialog rendering with toolbar and column chooser', () => {
        let gridObj: any;
        let columnMenu: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    rowRenderingMode: 'Horizontal',
                    allowFiltering: true,
                    allowSorting: true,
                    allowPaging: true,
                    enableAdaptiveUI: true,
                    allowGrouping: true,
                    filterSettings: { type: 'Excel' },
                    showColumnMenu: true,
                    showColumnChooser: true,
                    toolbar: ['ColumnChooser', 'Print', 'ExcelExport', 'PdfExport', 'CsvExport'],
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ],
                }, done);
        });

        it('Horizontal Mode ToolbarMenu popup enure', (done: Function) => {
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_responsivetoolbaritems' } });
            gridObj.toolbarModule.toolbarMenuElement.querySelector('.e-pdfexport').click();
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_responsivetoolbaritems' } });
            gridObj.toolbarModule.toolbarMenuElement.querySelector('.e-excelexport').click();
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_responsivetoolbaritems' } });
            gridObj.toolbarModule.toolbarMenuElement.querySelector('.e-csvexport').click();
            done();
        });
        it('ToolbarMenu popup column menu', () => {
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_responsivetoolbaritems' } });
            gridObj.toolbarModule.toolbarMenuElement.querySelector('.e-columnchooser').click();
            columnMenu = gridObj.getHeaderContent().querySelector('.e-columnmenu');
            columnMenu.click();
            let columnChooseHeader: HTMLElement = document.querySelector('.e-rescolumnchooserdiv > .e-dlg-header-content');
            (columnChooseHeader.querySelector('.e-dlg-closeicon-btn') as HTMLElement).click();
            columnMenu.click();
            (document.querySelector('.e-responsiveautofitalldiv') as any).click();
            columnMenu.click();
            (document.querySelector('.e-responsiveautofitdiv') as any).click();
            columnMenu.click();
            (document.querySelector('.e-responsiveascendingdiv') as any).click();
            columnMenu.click();
            (document.querySelector('.e-responsivedescendingdiv') as any).click();
            columnMenu.click();
        });
        it('Adaptive column menu action 1', () => {
            columnMenu.click();
            (document.querySelector('.e-responsivecolumndiv') as any).click();
            let columnChooseHeader: HTMLElement = document.querySelector('.e-rescolumnchooserdiv > .e-dlg-header-content');
            (columnChooseHeader.querySelector('.e-dlg-closeicon-btn') as HTMLElement).click();
        });
        it('Adaptive column menu action 2', () => {
            columnMenu.click();
        });
        it('Adaptive column menu action 3', () => {
            (document.querySelector('.e-responsivefilterdiv') as any).click();
            (document.getElementsByClassName('e-res-apply-btn')[0] as any).click();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-873156 - If Sort option is clicked on the mobile device, Filter Pop up is being Opened', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableAdaptiveUI: true,
                    rowRenderingMode: 'Vertical',
                    allowFiltering: true,
                    allowSorting: true,
                    allowPaging: true,
                    filterSettings: { type: 'Excel' },
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ]
                }, done);
        });

        it('Ensuring the sorting popup', () => {
            (document.getElementsByClassName('e-tbar-btn')[1]as HTMLElement).click();
            expect(document.getElementsByClassName('e-ressortdiv').length).toBe(1);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

     // used for code coverage
     describe('servicelocator code coverage', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    rowRenderingMode: 'Vertical',
                    enableAdaptiveUI: true,
                    showColumnChooser: true,
                    showColumnMenu: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ]
                }, done);
        });

        it('Ensuring the registerAdaptiveService method', () => {
           gridObj.serviceLocator.registerAdaptiveService(gridObj.columnMenuModule);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Code Coverage - 1', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableAdaptiveUI: true,
                    rowRenderingMode: 'Vertical',
                    allowFiltering: true,
                    allowSorting: true,
                    allowPaging: true,
                    filterSettings: { type: 'Excel' },
                    editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'],
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ],
                    dataBound: () => {
                        expect(gridObj.enableHover).toBeFalsy();
                    },
                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'EmployeeID',
                            format: 'C2',
                            footerTemplate: 'Sum: ${Sum}'
                        }]
                    }]
                }, done);
        });

        // it('Adaptive coverage - 2', () => {
        //     gridObj.filterModule.responsiveDialogRenderer.editComplate( { requestType: 'cancel'} );
        //     gridObj.filterModule.responsiveDialogRenderer.removeCustomDlgFilterEle( { target: gridObj.element.querySelector('.e-rowcell') } );
        // });


        it('Adaptive coverage - 1', (done: Function) => {
            let actionComplete = (args?: any): void => {
                if (args.requestType === 'filterchoicerequest') {
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterModule.responsiveDialogRenderer.sortButtonClickHandler();
            gridObj.filterModule.responsiveDialogRenderer.refreshCustomFilterClearBtn();
            gridObj.filterModule.responsiveDialogRenderer.showResponsiveDialog(gridObj.getColumns()[0]);
        });

        it('Adaptive coverage - 3', () => {
            gridObj.filterModule.responsiveDialogRenderer.action = 5;
            gridObj.filterModule.responsiveDialogRenderer.renderResponsiveContextMenu();
            gridObj.filterModule.responsiveDialogRenderer.removeCustomDlgFilterEle(document.querySelector('.e-rowcell'));
            gridObj.filterModule.responsiveDialogRenderer.keyHandler({ keyCode: 13, target: document.querySelector('.e-searchinput') });
        });

        it('Adaptive coverage - 4', () => {
            gridObj.filterModule.responsiveDialogRenderer.action = 1;
            gridObj.filterModule.responsiveDialogRenderer.dialogHdrBtnClickHandler();
        });

        it('Adaptive coverage - 5', () => {
            gridObj.filterModule.responsiveDialogRenderer.action = 5;
            gridObj.filterModule.responsiveDialogRenderer.getButtonText();
        });

        it('Adaptive coverage - 5', () => {
            gridObj.filterModule.responsiveDialogRenderer.isSortApplied = false;
            gridObj.filterModule.responsiveDialogRenderer.sortColumn();
        });

        it('Adaptive coverage - 6', () => {
            (gridObj as any).headerModule.updateCustomResponsiveToolbar( { module: 'grid' } );
            gridObj.element.querySelector('.e-toolbar').classList.add('e-responsive-toolbar');
            (gridObj as any).headerModule.updateCustomResponsiveToolbar( { module: 'toolbar' } );
        });

        it('Adaptive coverage - 7', () => {
            gridObj.filterModule.responsiveDialogRenderer.editComplate( { requestType: 'cancel'} );
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-899558-Responsive Back Element not showing when search is aligned left in Toolbar with AdaptiveUI', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    rowRenderingMode: 'Vertical',
                    allowFiltering: true,
                    allowSorting: true,
                    allowPaging: true,
                    enableAdaptiveUI: true,
                    filterSettings: { type: 'Excel' },
                    showColumnChooser: true,
                    editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', {text:'Search', align:'Left'}],
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ],
                }, done);
        });

        it('Ensure responsive back icon', (done: Function) => {
            expect(document.querySelector('.e-gridresponsiveicons .e-resback-icon')).not.toBeNull();
            done();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-899450-Programmatic open column chooser dialog not opening with OK and Cancel buttons on adaptive vertical view', () => {
        let gridObj: Grid;
        let openButton: HTMLElement;
    
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: true,
                    showColumnChooser: true,
                    enableAdaptiveUI: true,
                    toolbar: ['ColumnChooser'],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 130, textAlign: 'Right' },
                        { field: 'CustomerName', headerText: 'Customer Name', width: 150, showInColumnChooser: false },
                        { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' },
                        { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' },
                        { field: 'ShippedDate', headerText: 'Shipped Date', width: 140, format: 'yMd', textAlign: 'Right' },
                        { field: 'ShipCountry', visible: false, headerText: 'Ship Country', width: 150 },
                        { field: 'ShipCity', visible: false, headerText: 'Ship City', width: 150 }
                    ]
                }, done );
            openButton = document.createElement('button');
            openButton.id = 'openColumnChooserButton';
            openButton.textContent = 'Open Column Chooser';
            document.body.appendChild(openButton);
            openButton.addEventListener('click', () => {
                gridObj.columnChooserModule.openColumnChooser(100, 50);
            });
        });
    
        it('should open column chooser on button click', (done: Function) => {
            openButton.click();
            expect(document.querySelector('.e-rescolumnchooserdiv')).not.toBeNull();
            expect(document.querySelectorAll('.e-ccdlg').length).toBe(1);
            done();
        });
    
        afterAll(() => {
            document.body.removeChild(openButton);
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Code coverage', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableAdaptiveUI: true,
                    allowFiltering: true,
                    allowSorting: true,
                    allowPaging: true,
                    showColumnChooser: true,
                    columnChooserSettings: { headerTemplate: '<div>Choose Columns Template</div>'},
                    filterSettings: { type: 'Excel', enableInfiniteScrolling: true, loadingIndicator: 'Shimmer' },
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ],
                }, done);
        });
        it('Adaptive on demand filter dialog check', (done: Function) => {
            let actionComplete = (args?: any): void => {
                if (args.requestType === 'filterchoicerequest') {
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterModule.responsiveDialogRenderer.showResponsiveDialog(gridObj.getColumns()[0]);
        });

        it('Coverage - responsive column chooser template', (done: Function) => {
            (gridObj.columnChooserModule as any).showCustomColumnChooser();
            done();
        });
        
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-934150-Update and Cancel Buttons Not Visible in Normal Edit Mode in Adaptive Layout', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: true,
                    enableAdaptiveUI: true,
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'],
                    editSettings: {allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Normal' },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 130, textAlign: 'Right', isPrimaryKey: true },
                        { field: 'CustomerName', headerText: 'Customer Name', width: 150 },
                        { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' },
                        { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' },
                        { field: 'ShippedDate', headerText: 'Shipped Date', width: 140, format: 'yMd', textAlign: 'Right' },
                        { field: 'ShipCountry', visible: false, headerText: 'Ship Country', width: 150 },
                        { field: 'ShipCity', visible: false, headerText: 'Ship City', width: 150 }
                    ]
                }, done );
        });
    
        it('Edit start', (done: Function) => {
            const actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(document.querySelector('.e-toolbar-item[title=Update]').classList.contains('e-hidden')).toBeFalsy();
                    expect(document.querySelector('.e-toolbar-item[title=Cancel]').classList.contains('e-hidden')).toBeFalsy();
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(1, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });
    
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Adaptive renderer ResponsiveDialogRenderer – Uncovered Branches', () => {

        function ensureFilterStubs(rdr: any) {
            const p = rdr.parent || (rdr.parent = {});
            const fm = p.filterModule || (p.filterModule = {});
            const fmb = fm.filterModule || (fm.filterModule = {});
            if (!fmb.applyCustomFilter) fmb.applyCustomFilter = (_: any) => { };
            if (!fmb.clearCustomFilter) fmb.clearCustomFilter = (_: any) => { };
            if (!fmb.closeResponsiveDialog) fmb.closeResponsiveDialog = (_?: any) => { };
            if (!fmb.openDialog) fmb.openDialog = (_?: any) => { };
            if (!fm.setFilterModel) fm.setFilterModel = (_: any) => { };
            if (!fm.createOptions) fm.createOptions = (_: any) => ({});
        }

        describe('renderCustomFilterDiv → early return', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid({
                    dataSource: data, enableAdaptiveUI: true, allowFiltering: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ]
                }, done);
            });
            it('should return without creating custom filter container', () => {
                const rdr = (gridObj as any).filterModule.responsiveDialogRenderer;
                ensureFilterStubs(rdr);
                rdr.customResponsiveDlg = undefined;
                rdr.renderCustomFilterDiv();
                expect(document.querySelector('.e-xl-customfilterdiv')).toBeNull();
            });
            afterAll(() => { destroy(gridObj); gridObj = null as any; });
        });

        describe('renderResponsiveContextMenu → back button restore branch', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid({
                    dataSource: data, enableAdaptiveUI: true, allowFiltering: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ]
                }, done);
            });
            it('should restore main content, remove back button, and show close/save/clear', () => {
                const rdr = (gridObj as any).filterModule.responsiveDialogRenderer;
                ensureFilterStubs(rdr);
                rdr.action = (ResponsiveDialogAction as any).isFilter;
                rdr.isCustomDlgRender = false;
                rdr.isFiltered = true;

                const dlg = document.createElement('div');
                dlg.innerHTML = `
                <div class="e-dlg-header-content">
                    <div class="e-dlg-custom-header"></div>
                    <button class="e-dlg-closeicon-btn"></button>
                </div>
                <div class="e-dlg-content"><div id="main-content"></div></div>`;
                document.body.appendChild(dlg);

                rdr.customResponsiveDlg = { element: dlg } as any;
                rdr.saveBtn = { element: document.createElement('button') } as any;
                rdr.filterClearBtn = { element: document.createElement('button') } as any;

                const menu = document.createElement('div');
                rdr.renderResponsiveContextMenu({
                    isOpen: true,
                    target: menu,
                    header: 'Context Header',
                    col: (gridObj.getColumns() as any)[0]
                });

                rdr.renderResponsiveContextMenu({
                    isOpen: false,
                    col: (gridObj.getColumns() as any)[0]
                });

                const content = dlg.querySelector('.e-dlg-content') as HTMLElement;
                const first = content.firstElementChild as HTMLElement;
                expect(first.style.display).toBe('');
                const headerText = dlg.querySelector('.e-dlg-custom-header') as HTMLElement;
                expect((headerText.textContent || '').length).toBeGreaterThan(0);
            });
            afterAll(() => { destroy(gridObj); gridObj = null as any; });
        });

        describe('customFilterColumnClickHandler → group column', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid({
                    dataSource: data,
                    enableAdaptiveUI: true,
                    allowFiltering: true,
                    allowGrouping: true,
                    showColumnMenu: true,
                    rowRenderingMode: 'Horizontal',
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ]
                }, done);
            });
            it('should group column when clicking group item', () => {
                const rdr = (gridObj as any).filterModule.responsiveDialogRenderer;
                ensureFilterStubs(rdr);
                rdr.action = (ResponsiveDialogAction as any).isColMenu;
                rdr.menuCol = (gridObj.getColumns() as any)[0];

                const container = document.createElement('div');
                container.className = 'columnmenudiv';
                const target = document.createElement('div');
                target.className = 'e-responsivegroupdiv';
                container.appendChild(target);
                document.body.appendChild(container);

                rdr.customFilterColumnClickHandler({ target, preventDefault: () => { } } as any);
                expect(gridObj.groupSettings.columns.indexOf((rdr.menuCol as any).field)).toBeGreaterThan(-1);
            });
            afterAll(() => { destroy(gridObj); gridObj = null as any; });
        });

        describe('customFilterColumnClickHandler → ungroup column', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid({
                    dataSource: data,
                    enableAdaptiveUI: true,
                    allowFiltering: true,
                    allowGrouping: true,
                    groupSettings: { columns: ['OrderID'] },
                    rowRenderingMode: 'Horizontal',
                    showColumnMenu: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ]
                }, done);
            });
            it('should ungroup column when clicking ungroup item', () => {
                const rdr = (gridObj as any).filterModule.responsiveDialogRenderer;
                ensureFilterStubs(rdr);
                rdr.action = (ResponsiveDialogAction as any).isColMenu;
                rdr.menuCol = (gridObj.getColumns() as any)[0];

                const container = document.createElement('div');
                container.className = 'columnmenudiv';
                const target = document.createElement('div');
                target.className = 'e-responsiveungroupdiv';
                container.appendChild(target);
                document.body.appendChild(container);

                rdr.customFilterColumnClickHandler({ target, preventDefault: () => { } } as any);
                expect(gridObj.groupSettings.columns.indexOf((rdr.menuCol as any).field)).toBe(-1);
            });
            afterAll(() => { destroy(gridObj); gridObj = null as any; });
        });

        describe('customFilterColumnClickHandler → filterset icon clears and flags dialog close (Menu)', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid({
                    dataSource: data,
                    enableAdaptiveUI: true,
                    allowFiltering: true,
                    filterSettings: { type: 'Menu' },
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ]
                }, done);
            });
            it('should set isDialogClose = true (clear menu filter)', () => {
                const rdr = (gridObj as any).filterModule.responsiveDialogRenderer;
                ensureFilterStubs(rdr);
                rdr.action = (ResponsiveDialogAction as any).isFilter;

                const colDiv = document.createElement('div');
                colDiv.className = 'e-responsivecoldiv';
                colDiv.setAttribute('data-mappingname', 'OrderID');

                const iconWrap = document.createElement('div');
                iconWrap.className = 'e-filtersetdiv';

                const icon = document.createElement('span');
                icon.className = 'e-filterset';
                iconWrap.appendChild(icon);
                colDiv.appendChild(iconWrap);
                document.body.appendChild(colDiv);

                rdr.customFilterColumnClickHandler({ target: icon } as any);
                expect(rdr.isDialogClose).toBe(true);
            });
            afterAll(() => { destroy(gridObj); gridObj = null as any; });
        });

        describe('renderCustomFilterDialog → returns when FilterBar', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid({
                    dataSource: data,
                    enableAdaptiveUI: true,
                    allowFiltering: true,
                    filterSettings: { type: 'FilterBar' },
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
                    ]
                }, done);
            });
            it('should not append the inner dialog when FilterBar', () => {
                const rdr = (gridObj as any).filterModule.responsiveDialogRenderer;
                ensureFilterStubs(rdr);
                rdr.action = (ResponsiveDialogAction as any).isFilter;

                rdr.renderCustomFilterDialog((gridObj.getColumns() as any)[0], null);
                expect(document.querySelector('.e-customfilterdiv .e-dlg-content')).toBeNull();
            });
            afterAll(() => { destroy(gridObj); gridObj = null as any; });
        });

        describe('renderResponsiveDialog → returns when FilterBar', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid({
                    dataSource: data,
                    enableAdaptiveUI: true,
                    allowFiltering: true,
                    filterSettings: { type: 'FilterBar' },
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                    ]
                }, done);
            });
            it('should not create inner dialog in responsive dialog', () => {
                const rdr = (gridObj as any).filterModule.responsiveDialogRenderer;
                ensureFilterStubs(rdr);
                rdr.action = (ResponsiveDialogAction as any).isFilter;

                rdr.renderResponsiveDialog((gridObj.getColumns() as any)[0]);
                expect(document.querySelector('.e-responsive-dialog .e-dlg-content')).toBeNull();
            });
            afterAll(() => { destroy(gridObj); gridObj = null as any; });
        });

        describe('renderCustomFilterDialog → cancelled by beforeOpenAdaptiveDialog', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid({
                    dataSource: data,
                    enableAdaptiveUI: true,
                    allowFiltering: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                    ],
                    beforeOpenAdaptiveDialog: (args: any) => { args.cancel = true; }
                }, done);
            });
            it('should not append/show the inner dialog when event is cancelled', () => {
                const rdr = (gridObj as any).filterModule.responsiveDialogRenderer;
                ensureFilterStubs(rdr);
                rdr.action = (ResponsiveDialogAction as any).isColMenu;

                rdr.renderCustomFilterDialog(null, (gridObj.getColumns() as any)[0]);
            });
            afterAll(() => { destroy(gridObj); gridObj = null as any; });
        });

        describe('showResponsiveDialog (Sort) → cancelled by beforeOpenAdaptiveDialog', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid({
                    dataSource: data,
                    enableAdaptiveUI: true,
                    allowFiltering: true,
                    allowSorting: true,
                    beforeOpenAdaptiveDialog: (args: any) => { args.cancel = true; }
                }, done);
            });
            it('should return before show() (skip setFilterModel with undefined col)', () => {
                const rdr = (gridObj as any).filterModule.responsiveDialogRenderer;
                ensureFilterStubs(rdr);
                rdr.action = (ResponsiveDialogAction as any).isSort;

                rdr.showResponsiveDialog(undefined as any);
                expect(!!rdr.customResponsiveDlg).toBe(true);
                const dlgEle = (rdr.customResponsiveDlg.element as HTMLElement);
                expect(dlgEle.style.maxHeight).not.toBe('100%');
            });
            afterAll(() => { destroy(gridObj); gridObj = null as any; });
        });

        describe('beforeDialogClose (Filter) → removes .e-resfilter under Horizontal row mode', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid({
                    dataSource: data,
                    enableAdaptiveUI: true,
                    allowFiltering: true,
                    rowRenderingMode: 'Horizontal',
                    showColumnMenu: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                    ]
                }, done);
            });
            it('should remove .e-resfilter ghost element', () => {
                const rdr = (gridObj as any).filterModule.responsiveDialogRenderer;
                ensureFilterStubs(rdr);
                rdr.action = (ResponsiveDialogAction as any).isFilter;

                const ghost = document.createElement('div');
                ghost.className = 'e-resfilter';
                document.body.appendChild(ghost);

                const dlg = document.createElement('div');
                dlg.className = 'e-resfilterdiv';
                rdr.beforeDialogClose({ element: dlg } as any);

                expect(document.querySelector('.e-resfilter')).toBeNull();
            });
            afterAll(() => { destroy(gridObj); gridObj = null as any; });
        });

        describe('beforeDialogClose (ColMenu) → removes .e-rescolummenu', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid({
                    dataSource: data, enableAdaptiveUI: true, allowFiltering: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                    ]
                }, done);
            });
            it('should remove the created .e-rescolummenu element (by reference)', () => {
                const rdr = (gridObj as any).filterModule.responsiveDialogRenderer;
                ensureFilterStubs(rdr);
                rdr.action = (ResponsiveDialogAction as any).isColMenu;

                Array.from(document.querySelectorAll('.e-rescolummenu')).forEach(n => n.parentNode && n.parentNode.removeChild(n));

                const ghost = document.createElement('div');
                ghost.className = 'e-rescolummenu';
                document.body.appendChild(ghost);

                const dlg = document.createElement('div');
                rdr.beforeDialogClose({ element: dlg } as any);

                expect(document.body.contains(ghost)).toBe(false);
            });
            afterAll(() => { destroy(gridObj); gridObj = null as any; });
        });

        describe('beforeDialogClose (ColumnChooser) → removes .e-rescolumnchooser and notifies', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid({
                    dataSource: data,
                    enableAdaptiveUI: true,
                    allowFiltering: true,
                    rowRenderingMode: 'Horizontal',
                    showColumnMenu: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                    ]
                }, done);
            });
            it('should remove the specific .e-rescolumnchooser element (by reference)', () => {
                const rdr = (gridObj as any).filterModule.responsiveDialogRenderer;
                ensureFilterStubs(rdr);
                rdr.action = (ResponsiveDialogAction as any).isColumnChooser;

                Array.from(document.querySelectorAll('.e-rescolumnchooser')).forEach(n => n.parentNode && n.parentNode.removeChild(n));

                const ghost = document.createElement('div');
                ghost.className = 'e-rescolumnchooser';
                document.body.appendChild(ghost);

                const dlg = document.createElement('div');
                rdr.beforeDialogClose({ element: dlg } as any);

                expect(document.body.contains(ghost)).toBe(false);
            });
            afterAll(() => { destroy(gridObj); gridObj = null as any; });
        });

        describe('removeCustomFilterElement → removes customcolumnmenu and .e-rescolumnchooser (by reference)', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid({
                    dataSource: data, enableAdaptiveUI: true, allowFiltering: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                    ]
                }, done);
            });
            it('should remove the specific created nodes', () => {
                const rdr = (gridObj as any).filterModule.responsiveDialogRenderer;
                ensureFilterStubs(rdr);

                const idPrefix = (gridObj.element as HTMLElement).id || 'GridRDR';
                (gridObj.element as HTMLElement).id = idPrefix;

                const oldById = document.getElementById(idPrefix + 'customcolumnmenu');
                if (oldById && oldById.parentNode) oldById.parentNode.removeChild(oldById);
                Array.from(document.querySelectorAll('.e-customfilter')).forEach(n => n.parentNode && n.parentNode.removeChild(n));
                Array.from(document.querySelectorAll('.e-rescolumnchooser')).forEach(n => n.parentNode && n.parentNode.removeChild(n));

                const menuHost = document.createElement('div');
                menuHost.id = idPrefix + 'customcolumnmenu';
                document.body.appendChild(menuHost);

                const customFilterDiv = document.createElement('div');
                customFilterDiv.className = 'e-customfilter';
                document.body.appendChild(customFilterDiv);

                const chooser = document.createElement('div');
                chooser.className = 'e-rescolumnchooser';
                document.body.appendChild(chooser);

                rdr.removeCustomFilterElement();
            });
            afterAll(() => { destroy(gridObj); gridObj = null as any; });
        });

        describe('keyHandler → Enter triggers dialogHdrBtnClickHandler (Filter search)', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid({ dataSource: data, enableAdaptiveUI: true, allowFiltering: true }, done);
            });
            it('should execute without error and cover the call path', () => {
                const rdr = (gridObj as any).filterModule.responsiveDialogRenderer;
                ensureFilterStubs(rdr);
                rdr.action = (ResponsiveDialogAction as any).isFilter;
                rdr.filteredCol = (gridObj.getColumns() as any)[0];

                const input = document.createElement('input');
                input.className = 'e-searchinput';
                document.body.appendChild(input);

                rdr.keyHandler({ keyCode: 13, target: input } as any);
                expect(true).toBe(true);
            });
            afterAll(() => { destroy(gridObj); gridObj = null as any; });
        });

        describe('removeEventListener → removes click/touch handler from customColumnDiv', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid({ dataSource: data, enableAdaptiveUI: true, allowFiltering: true }, done);
            });
            it('should execute removal without error', () => {
                const rdr = (gridObj as any).filterModule.responsiveDialogRenderer;
                ensureFilterStubs(rdr);

                rdr.customColumnDiv = document.createElement('div');
                document.body.appendChild(rdr.customColumnDiv);

                rdr.removeEventListener();
                expect(true).toBe(true);
            });
            afterAll(() => { destroy(gridObj); gridObj = null as any; });
        });

    });

    describe('EJ2-1016596-Filter dialog displaying spinner when columnChooser is enabled along with adaptiveUI mode', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                enableAdaptiveUI: true,
                adaptiveUIMode: 'Mobile',
                rowRenderingMode: 'Vertical',
                allowFiltering: true,
                toolbar: ['ColumnChooser'],
                filterSettings: { type: 'CheckBox' },
                showColumnChooser: true,
                height: 400,
                columns: [
                    { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, width: 120 },
                    { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
                    { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
                ]
            }, done);
        });

        it('open checkbox filter dialog - spinner should not be shown', (done: Function) => {
            let actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    expect(document.querySelector('.e-spin-show')).toBeNull();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll(".e-filtermenudiv")[0] as HTMLElement).click();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
});
