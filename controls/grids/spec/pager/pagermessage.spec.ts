/**
 * Pagermessage spec 
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { Pager } from '../../src/pager/pager';
import '../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from './common.spec';

describe('Pagermessage module', () => {

    describe('Pager message disable testing', () => {
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
                totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5, enablePagerMessage: false, created: created
            });
            pagerObj.appendTo('#Pager');
        });

        it('pager message element testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-parentmsgbar').length).toBe(0);
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
            pagerObj = elem = null;
        });

    });

    describe('Pager message method testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager({
                totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5, created: created
            });
            pagerObj.appendTo('#Pager');
        });

        it('pagerMessage hide testing', () => {
            pagerObj.pagerMessageModule.hideMessage();
            expect((pagerObj.element.querySelector('.e-pagenomsg') as HTMLElement).style.display).toBe('none');
            expect((pagerObj.element.querySelector('.e-pagecountmsg') as HTMLElement).style.display).toBe('none');
        });

        it('pagerMessage show testing', () => {
            pagerObj.pagerMessageModule.showMessage();
            expect((pagerObj.element.querySelector('.e-pagenomsg') as HTMLElement).style.display).not.toBe('none');
            expect((pagerObj.element.querySelector('.e-pagecountmsg') as HTMLElement).style.display).not.toBe('none');
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
            pagerObj = elem = null;
        });

    });

    describe('Pager message disable testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager({
                totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5, enablePagerMessage: false, created: created
            });
            pagerObj.appendTo('#Pager');
        });

        it('pagerMessage element testing', () => {
            pagerObj.pagerMessageModule.hideMessage(); // for coverage
            expect(pagerObj.element.querySelectorAll('.e-pagenomsg').length).toBe(0);
            expect(pagerObj.element.querySelectorAll('.e-pagecountmsg').length).toBe(0);
        });

        it('pagerMessage enable testing', () => {
            pagerObj.enablePagerMessage = true;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-pagenomsg').length).toBe(1);
            expect(pagerObj.element.querySelectorAll('.e-pagecountmsg').length).toBe(1);
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