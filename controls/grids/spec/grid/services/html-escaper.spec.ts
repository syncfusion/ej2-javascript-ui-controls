/**
 * Service Locator spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Column } from '../../../src/grid/models/column';
import { ICellFormatter } from '../../../src/grid/base/interface';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

class ExtHtmlEscapeService implements ICellFormatter {

    public escapeRegex: RegExp = /[&<>"']/g;

    public entitySet: { [x: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&#34;',
        '\'': '&#39;'
    };

    public getValue(column: Column, data: Object): string {
        let value: string = ((column.valueAccessor as Function)(column.field, data, column)) as string;
        if (value === null || value === undefined) {
            return value;
        }

        return value.replace(this.escapeRegex, (c: string) => {
            return this.entitySet[c];
        });
    }

    public static extEscape(input: string, coluns: Column[]): string {
        return input;
    }
}

describe('Html escaper module', () => {

    describe('Default and extended', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid({
                columns: [
                    {
                        field: 'data.a', headerText: '<i>A</i>', headerTextAlign: 'Center',
                        disableHtmlEncode: true, textAlign: 'Right', customAttributes: {
                            class: 'hi',
                            style: { color: 'green', 'background-color': 'wheat' },
                            'data-id': 'grid-cell'
                        }
                    },
                    { field: 'c', headerText: 'C', displayAsCheckBox: true, type: 'boolean' },
                    { field: 'b', headerText: 'Cc', disableHtmlEncode: false, formatter: ExtHtmlEscapeService }
                ],
                dataSource: [{ data: { a: '<i>VINET</i>' }, b: '<i>TOMSP</i>', c: true, d: new Date() },
                { data: { a: 2 }, b: null, c: false, d: new Date() }], allowPaging: false
            }, done);
        });

        it('content testing', () => {
            expect(gridObj.getContent().querySelectorAll('.e-rowcell')[2].innerHTML).toBe('&lt;i&gt;TOMSP&lt;/i&gt;');
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
            destroy(gridObj);
        });

    });
});