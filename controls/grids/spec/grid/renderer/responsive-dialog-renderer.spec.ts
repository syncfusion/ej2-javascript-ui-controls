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
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { createGrid, destroy, getKeyUpObj } from '../base/specutil.spec';
import { ResponsiveDialogAction } from '../../../src/grid/base/enum';
import { AdaptiveDialogEventArgs, NotifyArgs } from '../../../src/grid/base/interface';

Grid.Inject(Aggregate, Edit, Toolbar, Page, Filter, Sort);

describe('Adaptive renderer', () => {
    describe('Ensure adaptive dialogs', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
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
            expect(document.querySelector('.e-toolbar-item[title=Print]').classList.contains('e-hidden')).toBeFalsy();
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
                this.skip(); //Skips test (in Chai)
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
                if (args.requestType === 'filterafteropen') {
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

    describe('Ensure onproperty change', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
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
                this.skip(); //Skips test (in Chai)
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
            expect(document.querySelector('.e-responsivecoldiv[data-e-mappingname="CustomerID"]')).toBeNull();
            expect(document.querySelector('.e-responsivecoldiv[data-e-mappingname="ShipCountry"]')).toBeNull();
            (document.querySelector('.e-dlg-closeicon-btn') as HTMLElement).click();
        });

        it('Ensure custom filter dialog columns', () => {
            gridObj.showAdaptiveFilterDialog();
            expect(document.querySelector('.e-responsivecoldiv[data-e-mappingname="CustomerID"]')).toBeNull();
            expect(document.querySelector('.e-responsivecoldiv[data-e-mappingname="EmployeeID"]')).toBeNull();
            (document.querySelector('.e-dlg-closeicon-btn') as HTMLElement).click();
        });

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
                this.skip(); //Skips test (in Chai)
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

        it('Ensure custom filter dialog ', (done: Function) => {
            let actionComplete = (args?: any): void => {
                if (args.requestType === 'filterchoicerequest') {
                    expect((document.querySelector('.e-resfilterdiv').querySelector('.e-dlg-custom-header') as HTMLElement).innerText).toBe(args.filterModel.options.column.headerText);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            let customDlgCnt: HTMLElement = document.querySelector('.e-customfilterdiv > .e-dlg-content');
            (customDlgCnt.querySelector('.e-res-header-text') as HTMLElement).click();
        });


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
                this.skip(); //Skips test (in Chai)
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
                this.skip(); //Skips test (in Chai)
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

    describe('Ensure onproperty change', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
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
});
