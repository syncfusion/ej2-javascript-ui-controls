/**
 * Pagerdropdown spec 
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { Pager } from '../../src/pager/pager';
import '../../node_modules/es6-promise/dist/es6-promise';
import { PagerDropDown } from '../../src/pager/pager-dropdown';
import  {profile , inMB, getMemoryProfile} from './common.spec';

Pager.Inject(PagerDropDown);

describe('Pagerdropdown module', () => {

    describe('pagesizes true testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager({
                totalRecordsCount: 103, currentPage: 8, pageCount: 5, pageSizes: true, created: created
            });
            pagerObj.appendTo('#Pager');
        });

        it('pagesize set Default value as 12', () => {
            expect(pagerObj.pageSize).toEqual(12);
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
            pagerObj = elem = null;
        });

    });
    describe('pagesizes false testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager({
                totalRecordsCount: 103, currentPage: 8, pageCount: 5, pageSizes: false, created: created
            });
            pagerObj.appendTo('#Pager');
        });

        it('pagesizes false test', () => {
            expect(pagerObj.element.querySelectorAll('.e-pagesizes').length).toBe(0);
        });
        it('pageSizes enable testing', () => {
            pagerObj.pageSizes = true;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-pagesizes').length).toBe(1);
        });
        it('pageSizes enable with number[] testing', () => {
            pagerObj.pageSizes = [5, 12, 20, 30];
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-pagesizes').length).toBe(1);
        });
        it('pageSizes disable testing', () => {
            pagerObj.pageSizes = false;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-pagesizes').length).toBe(0);
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
            pagerObj = elem = null;
        });

    });
    describe('pagesizes as number[] input testing', () => {
        let pagerObj: Pager;
        let dropDownChanged: () => void;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager({
                totalRecordsCount: 103, currentPage: 8, pageCount: 5, pageSizes: [10, 30, 40, 50], created: created,
                dropDownChanged: dropDownChanged
            });
            pagerObj.appendTo('#Pager');
        });

        it('pagesize value changed to array of first index', () => {
            expect(pagerObj.pageSize).toEqual(12);
        });
        it('pagesize value changed to array of selected value', (done: Function) => {
            dropDownChanged = (args?: any): void => {
                expect(pagerObj.pageSize).toEqual(30);
                done();
            };
            pagerObj.dropDownChanged = dropDownChanged;
            (<any>pagerObj.pagerdropdownModule).dropDownListObject.value = 30;
        });

        it('set dropvalue', () => {
            (<any>pagerObj.pagerdropdownModule).dropDownListObject = null;
            (<any>pagerObj.pagerdropdownModule).setDropDownValue('value', 5);
            expect((<any>pagerObj.pagerdropdownModule).convertValue(['5'])[0]).toBe('5');
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
            pagerObj.destroy();
            elem.remove();
            pagerObj = elem = null;
        });
    });
});