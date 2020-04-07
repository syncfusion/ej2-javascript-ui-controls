import { SpreadsheetModel, Spreadsheet, BasicModule } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { CellModel, SortEventArgs, SortDescriptor, getCell } from '../../../src/index';

Spreadsheet.Inject(BasicModule);

/**
 *  Sorting spec
 */

describe('Spreadsheet sorting module ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;
    let instance: Spreadsheet;
    describe('UI interaction checking ->', () => {
        beforeAll((done: Function) => {
            model = {
                sheets: [
                    {
                        ranges: [{ dataSource: defaultData }]
                    }
                ]
            };
            helper.initializeSpreadsheet(model, done);
            instance = helper.getInstance();
        });

        afterAll(() => {
            helper.invoke('destroy');
        });

        it('sort ascending testing', (done: Function) => {
            helper.invoke('selectRange', ['D2:E5']);
            helper.setModel('activeCell', 'D2');
            helper.invoke('sort', null).then((args: SortEventArgs) => {
                helper.invoke('getData', [args.range]).then((values: Map<string, CellModel>) => {
                    expect(values.get('D2').value.toString()).toEqual('10');
                    expect(values.get('E2').value.toString()).toEqual('20');
                    expect(values.get('D3').value.toString()).toEqual('15');
                    expect(values.get('E3').value.toString()).toEqual('20');
                    expect(values.get('D4').value.toString()).toEqual('20');
                    expect(values.get('E4').value.toString()).toEqual('30');
                    expect(values.size).toEqual(8);
                    done();
                });
            });
        });

        // it('sort undo testing', (done: Function) => {
        //     helper.invoke('undo', null);
        //     expect(getCell(1, 3, instance.getActiveSheet()).value.toString()).toEqual('10');
        //     expect(getCell(1, 4, instance.getActiveSheet()).value.toString()).toEqual('20');
        //     expect(getCell(2, 3, instance.getActiveSheet()).value.toString()).toEqual('20');
        //     expect(getCell(2, 4, instance.getActiveSheet()).value.toString()).toEqual('30');
        //     expect(getCell(3, 3, instance.getActiveSheet()).value.toString()).toEqual('20');
        //     expect(getCell(3, 4, instance.getActiveSheet()).value.toString()).toEqual('15');
        //     done();
        // });

        it('sort redo testing', (done: Function) => {
            helper.invoke('redo', null);
            setTimeout(() => {
            expect(getCell(1, 3, instance.getActiveSheet()).value.toString()).toEqual('10');
            expect(getCell(1, 4, instance.getActiveSheet()).value.toString()).toEqual('20');
            expect(getCell(2, 3, instance.getActiveSheet()).value.toString()).toEqual('15');
            expect(getCell(2, 4, instance.getActiveSheet()).value.toString()).toEqual('20');
            expect(getCell(3, 3, instance.getActiveSheet()).value.toString()).toEqual('20');
            expect(getCell(3, 4, instance.getActiveSheet()).value.toString()).toEqual('30');
            done();
            },10);
        });

        it('sort descending testing', (done: Function) => {
            helper.invoke('selectRange', ['D2:E5']);
            helper.setModel('activeCell', 'D2');
            helper.invoke('sort', [{ sortDescriptors: { order: 'Descending' } }]).then((args: SortEventArgs) => {
                helper.invoke('getData', [args.range]).then((values: Map<string, CellModel>) => {
                    expect(values.get('D2').value.toString()).toEqual('20');
                    expect(values.get('E2').value.toString()).toEqual('30');
                    expect(values.get('D3').value.toString()).toEqual('20');
                    expect(values.get('E3').value.toString()).toEqual('15');
                    expect(values.get('D4').value.toString()).toEqual('15');
                    expect(values.get('E4').value.toString()).toEqual('20');
                    expect(values.size).toEqual(8);
                    done();
                });
            });
        });

        it('sort auto containsHeader testing', (done: Function) => {
            helper.invoke('selectRange', ['D1:E5']);
            helper.setModel('activeCell', 'D1');
            helper.invoke('sort', null).then((args: SortEventArgs) => {
                helper.invoke('getData', [args.range]).then((values: Map<string, CellModel>) => {
                    expect(values.get('D1')).toBeUndefined(); //Quantity - skipped
                    expect(values.get('E1')).toBeUndefined(); // Price - skipped
                    expect(values.get('D2').value.toString()).toEqual('10');
                    expect(values.get('E2').value.toString()).toEqual('20');
                    expect(values.get('D3').value.toString()).toEqual('15');
                    expect(values.get('E3').value.toString()).toEqual('20');
                    expect(values.get('D4').value.toString()).toEqual('20');
                    expect(values.get('E4').value.toString()).toEqual('30');
                    expect(values.size).toEqual(8);
                    done();
                });
            });
        });

        it('automatic sort range testing', (done: Function) => {
            helper.invoke('selectRange', ['A1:A1']); //no selection
            helper.invoke('sort', null).then((args: SortEventArgs) => {
                expect(args.range).toEqual('Sheet1!A2:H11'); //excluding header
                done();
            });
        });

        it('catch invalid sort range error testing', (done: Function) => {
            helper.invoke('selectRange', ['K2:M5']);
            helper.invoke('sort', null).catch((error: string) => {
                expect(error).toEqual('Select a cell or range inside the used range and try again.');
                done();
            });
        });

        it('custom sort testing', (done: Function) => {
            helper.invoke('selectRange', ['D1:E11']);
            //Price - ascending, Quantity - descending
            let sortDescriptors: SortDescriptor[] = [
                {
                    field: 'E',
                    order: 'Ascending'
                },
                {
                    field: 'D',
                    order: 'Descending'
                }
            ];
            helper.invoke('sort', [{ sortDescriptors: sortDescriptors }]).then((args: SortEventArgs) => {
                helper.invoke('getData', [args.range]).then((values: Map<string, CellModel>) => {
                    expect(values.get('E2').value.toString()).toEqual('10');
                    expect(values.get('E3').value.toString()).toEqual('10');
                    expect(values.get('E4').value.toString()).toEqual('10');
                    expect(values.get('E5').value.toString()).toEqual('10');
                    expect(values.get('D2').value.toString()).toEqual('50');
                    expect(values.get('D3').value.toString()).toEqual('31');
                    expect(values.get('D4').value.toString()).toEqual('30');
                    expect(values.get('D5').value.toString()).toEqual('20');
                    expect(values.size).toEqual(20);
                    done();
                });
            });
        });

        it('case sensitive sort testing', (done: Function) => {
            let td: HTMLTableCellElement = helper.invoke('getCell', [4, 0]);
            let cellValue: string = td.textContent;
            helper.invoke('updateCell', [{ value: cellValue.toLowerCase() }, 'A7']);
            helper.invoke('selectRange', ['A2:B7']);
            helper.setModel('activeCell', 'A2');
            helper.invoke('sort', [{ caseSensitive: true }]).then((args: SortEventArgs) => {
                helper.invoke('getData', [args.range]).then((values: Map<string, CellModel>) => {
                    expect(values.get('A5').value.toString()).toEqual(cellValue.toLowerCase());//lowercase first
                    expect(values.get('A6').value.toString()).toEqual(cellValue);//uppercase next
                    expect(values.size).toEqual(12);
                    done();
                });
            });
        });

    });
});