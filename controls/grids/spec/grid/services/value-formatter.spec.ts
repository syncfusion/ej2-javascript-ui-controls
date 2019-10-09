/**
 * Value formatter specs
 */
import { EmitType } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { GridModel } from '../../../src/grid/base/grid-model';
import { IValueFormatter } from '../../../src/grid/base/interface';
import { Column } from '../../../src/grid/models/column';
import { L10n, Internationalization } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

L10n.load({
    'de-DE': {
        'grid': {
            EmptyRecord: 'Geen records om te laten zien',
            True: 'true'
        }
    },
    'gu-IN': {
        'grid': {
            EmptyRecord: 'Geen records om te laten zien',
            True: 'true'
        }
    }
});

describe('ValueFormatter Service', () => {

    let createGrid: Function = (options: GridModel, done: Function): Grid => {
        let grid: Grid;
        let dataBound: EmitType<Object> = () => { done(); };
        data.splice(data.length, 1, { Verfied: null });
        grid = new Grid(extend({}, {
            dataSource: data,
            dataBound: dataBound
        }, options));
        document.body.appendChild(createElement('div', { id: 'Grid' }));
        grid.appendTo('#Grid');
        return grid;
    };

    let destroy: EmitType<Object> = (grid: Grid) => {
        if (grid) {
            grid.destroy();
            remove(grid.element);
        }
    };

    describe('Format check - default locale', () => {
        let rows: HTMLTableRowElement;
        let grid: Grid;
        beforeAll((done) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            this.grid = createGrid({
                columns: [
                    {
                        field: 'OrderID', headerText: '<i>Order ID</i>', headerTextAlign: 'Right',
                        disbleHtmlEncode: false, textAlign: 'Right'
                    },
                    { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                    { field: 'Freight', format: 'C1' },
                    { field: 'OrderDate', format: 'yMd' },
                    { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                ], allowPaging: false, allowSelection: false,
            }, done);
        });
        it('Number format check', () => {
            rows = ((this.grid.getContentTable() as any).tBodies[0]).rows[0] as HTMLTableRowElement;
            expect(rows.cells[2].innerHTML).toBe('$32.4');
        });
        it('Date format check', () => {
            rows = ((this.grid.getContentTable() as any).tBodies[0]).rows[0] as HTMLTableRowElement;
            let intl: Internationalization = new Internationalization();
            expect(rows.cells[3].innerHTML).toBe(intl.formatDate(new Date(8364186e5), { type: 'date', skeleton: 'yMd' }));
        });
        afterAll(() => {
            destroy(this.grid);
        });
    });

    // describe('Format check - changed locale', () => {
    //     let rows: HTMLTableRowElement;
    //     let grid: Grid;
    //     beforeAll((done) => {
    //         this.grid = createGrid({
    //             columns: [
    //                 {
    //                     field: 'OrderID', headerText: '<i>Order ID</i>', headerTextAlign: 'Right',
    //                     disbleHtmlEncode: false, textAlign: 'Right'
    //                 },
    //                 { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
    //                 { field: 'Freight', format: 'C1' },
    //                 { field: 'OrderDate', format: 'dd/MM/yyyy' },
    //                 { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
    //             ], allowPaging: false, allowSelection: false,
    //             locale: 'de-DE'
    //         }, done);
    //     });
    //     it('Number format check', () => {
    //         rows = (this.grid.getContentTable() as any).tBodies[0].rows[0];
    //         expect(rows.cells[2].innerHTML).toBe('32,4 €');
    //     });
    //     it('Date format check', () => {
    //         rows = (this.grid.getContentTable() as any).tBodies[0].rows[0];
    //         let culture: Culture = new Culture('de-DE');
    //         expect(rows.cells[3].innerHTML).toBe(culture.format(new Date(8364186e5), 'dd/MM/yyyy'));
    //     });
    //     afterAll(() => {
    //         destroy(this.grid);
    //     });
    // });


    // describe('change locale - dynamically', () => {
    //     let rows: HTMLTableRowElement;
    //     let grid: Grid;
    //     beforeAll((done: Function) => {
    //         let setModel: Function = () => {
    //             this.grid.locale = 'gu-IN';
    //             this.grid.dataBind();
    //             setTimeout(done, 500);
    //         };
    //         this.grid = createGrid({
    //             columns: [
    //                 {
    //                     field: 'OrderID', headerText: '<i>Order ID</i>', headerTextAlign: 'Right',
    //                     disbleHtmlEncode: false, textAlign: 'Right'
    //                 },
    //                 { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
    //                 { field: 'Freight', format: 'C1' },
    //                 { field: 'OrderDate', format: 'dd/MM/yyyy' },
    //                 { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
    //             ], allowPaging: false, allowSelection: false,
    //             locale: 'de-DE'
    //         }, setModel);

    //     });
    //     it('Number format check', () => {
    //         rows = (this.grid.getContentTable() as any).tBodies[0].rows[0];
    //         expect(rows.cells[2].innerHTML).toBe('₹ 32.4');
    //     });
    //     it('Date format check', () => {
    //         rows = (this.grid.getContentTable() as any).tBodies[0].rows[0];
    //         let culture: Culture = new Culture('gu-IN');
    //         expect(rows.cells[3].innerHTML).toBe(culture.format(new Date(8364186e5), 'dd/MM/yyyy'));
    //     });
    //     afterAll(() => {
    //         destroy(this.grid);
    //     });
    // });

    describe('fromView method check', () => {
        let rows: HTMLTableRowElement;
        let grid: Grid;
        beforeAll((done) => {

            grid = createGrid({
                columns: [
                    {
                        field: 'OrderID', headerText: '<i>Order ID</i>', headerTextAlign: 'Right',
                        disbleHtmlEncode: false, textAlign: 'Right'
                    },
                    { field: 'OrderDate', format: 'yMd' },
                    { field: 'Freight', format: { format: 'C1' } },
                ], allowPaging: false, allowSelection: false,
            }, done);
        });

        it('check number format', () => {
            let fmtr: IValueFormatter = grid.serviceLocator.getService<IValueFormatter>('valueFormatter');
            expect(fmtr.fromView('$32.0', (grid.getColumns() as Column[])[2].getParser(), 'number')).toBe(32);
        });

        it('check format with no target type', () => {
            let fmtr: IValueFormatter = grid.serviceLocator.getService<IValueFormatter>('valueFormatter');
            expect(fmtr.fromView('$32.0', (grid.getColumns() as Column[])[1].getParser(), 'custom')).toBe('$32.0');
            //for coverage
            fmtr.setCulture('en-US');
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
            destroy(grid);
        });
    });
});