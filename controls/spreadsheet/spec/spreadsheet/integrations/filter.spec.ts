import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { Spreadsheet } from "../../../src";

describe('Filter ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply Filter', (done: Function) => {
            helper.invoke('applyFilter', [[{ field: 'E', predicate: 'or', operator: 'equal', value: '10' }], 'A1:H1']);
            expect(helper.invoke('getCell', [0, 0]).children[0].classList).toContain('e-filter-btn');
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 4]).children[0].children[0].classList).toContain('e-filtered');
                done();
            });
        });

        it('Clear Filter', (done: Function) => {
            helper.invoke('clearFilter', ['E']);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 4]).children[0].children[0].classList).not.toContain('e-filtered');
                done();
            });
        });

        it('Remove Filter', (done: Function) => {
            helper.invoke('applyFilter', [null, 'A1:A1']);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 1]).children[0]).toBeUndefined();
                done();
            });
        });
    });

    describe('UI Interaction ->', () => {

    });

    describe('CR-Issues ->', () => {
        describe('I289560, FB22087 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.cellFormat({ backgroundColor: '#e56590', color: '#fff', fontWeight: 'bold', textAlign: 'center' }, 'A1:F1');
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Facing issues on spreadsheet - Filter applied after the specified range using applyFilter method', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.applyFilter(null, 'A1:F11');
                expect(!!helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).toBeTruthy();
                expect(!!helper.invoke('getCell', [0, 1]).querySelector('.e-filter-iconbtn')).toBeTruthy();
                expect(!!helper.invoke('getCell', [0, 5]).querySelector('.e-filter-iconbtn')).toBeTruthy();
                expect(!!helper.invoke('getCell', [0, 6]).querySelector('.e-filter-iconbtn')).toBeFalsy();
                done();
            });

            it('Filter icon disappears after refresh', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.applyFilter([{ field: 'H', predicate: 'or', operator: 'contains', value: '10' }]);
                setTimeout(() => {
                    spreadsheet.refresh();
                    setTimeout(() => {
                        setTimeout(() => {
                            expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                            expect(helper.invoke('getCell', [0, 7]).querySelector('.e-filtered')).not.toBeNull();
                            expect(helper.invoke('getCell', [1, 7]).textContent).toBe('10');
                            done();
                        });
                    });
                });
            });
        });
    });
});