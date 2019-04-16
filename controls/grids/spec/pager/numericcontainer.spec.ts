/**
 * Numericcontainer spec 
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { Pager } from '../../src/pager/pager';
import { ExternalMessage } from '../../src/pager/external-message';
import '../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from './common.spec';

Pager.Inject(ExternalMessage);

describe('Numericcontainer module testing', () => {

    describe('numericcontainer initial property testing', () => {
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
                totalRecordsCount: 103, currentPage: 8, pageCount: 5, pageSize: 5, enablePagerMessage: false,
                enableExternalMessage: true, externalMessage: '', created: created
            });
            pagerObj.appendTo('#Pager');
        });

        it('current page testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toBe('8');
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
            pagerObj = elem = null;
        });

    });

    describe('numericcontainer method and actions testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });
        let first: Element;
        let last: Element;
        let prev: Element;
        let next: Element;
        let NP: Element;
        let PP: Element;

        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager(
                {
                    totalRecordsCount: 100, currentPage: 6, pageCount: 5, pageSize: 5,
                    enablePagerMessage: true, enableExternalMessage: true, externalMessage: 'externalMessage',
                    enableRtl: true, enableQueryString: true, customText: 'sheet',
                    created: created
                });
            pagerObj.appendTo('#Pager');
        });

        it('Navigate page testing', () => {
            (pagerObj.element.querySelectorAll('.e-numericcontainer')[0].childNodes[1] as HTMLElement).click();
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toBe('7');
        });

        it('click event call', () => {
            let spyFn: EmitType<Object> = jasmine.createSpy('click');
            pagerObj.click = spyFn;
            pagerObj.goToPage(3);
            expect(spyFn).toHaveBeenCalled();
        });

        it('Navigate unavailable page testing', () => {
            pagerObj.goToPage(23);
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toBe('3');
        });

        it('Goto page testing', () => {
            pagerObj.goToPage(13);
            first = pagerObj.element.querySelectorAll('.e-first')[0];
            prev = pagerObj.element.querySelectorAll('.e-prev')[0];
            PP = pagerObj.element.querySelectorAll('.e-pp')[0];
            NP = pagerObj.element.querySelectorAll('.e-np')[0];
            next = pagerObj.element.querySelectorAll('.e-next')[0];
            last = pagerObj.element.querySelectorAll('.e-last')[0];
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toBe('13');
            expect(first.classList.contains('e-firstpagedisabled')).toBeFalsy();
            expect(first.classList.contains('e-disable')).toBeFalsy();
            expect(first.classList.contains('e-firstpage')).toBeTruthy();

            expect(prev.classList.contains('e-prevpagedisabled')).toBeFalsy();
            expect(prev.classList.contains('e-disable')).toBeFalsy();
            expect(prev.classList.contains('e-prevpage')).toBeTruthy();

            expect(PP.classList.contains('e-nextprevitemdisabled')).toBeFalsy();
            expect(PP.classList.contains('e-disable')).toBeFalsy();
            expect(PP.classList.contains('e-numericitem')).toBeTruthy();

            expect(NP.classList.contains('e-nextprevitemdisabled')).toBeFalsy();
            expect(NP.classList.contains('e-disable')).toBeFalsy();
            expect(NP.classList.contains('e-numericitem')).toBeTruthy();

            expect(next.classList.contains('e-nextpagedisabled')).toBeFalsy();
            expect(next.classList.contains('e-disable')).toBeFalsy();
            expect(next.classList.contains('e-nextpage')).toBeTruthy();

            expect(last.classList.contains('e-lastpagedisabled')).toBeFalsy();
            expect(last.classList.contains('e-disable')).toBeFalsy();
            expect(last.classList.contains('e-lastpage')).toBeTruthy();
        });

        it('Prev page testing', () => {
            (prev as HTMLElement).click();
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toBe('12');

            expect(first.classList.contains('e-firstpagedisabled')).toBeFalsy();
            expect(first.classList.contains('e-disable')).toBeFalsy();
            expect(first.classList.contains('e-firstpage')).toBeTruthy();

            expect(prev.classList.contains('e-prevpagedisabled')).toBeFalsy();
            expect(prev.classList.contains('e-disable')).toBeFalsy();
            expect(prev.classList.contains('e-prevpage')).toBeTruthy();

            expect(PP.classList.contains('e-nextprevitemdisabled')).toBeFalsy();
            expect(PP.classList.contains('e-disable')).toBeFalsy();
            expect(PP.classList.contains('e-numericitem')).toBeTruthy();

            expect(NP.classList.contains('e-nextprevitemdisabled')).toBeFalsy();
            expect(NP.classList.contains('e-disable')).toBeFalsy();
            expect(NP.classList.contains('e-numericitem')).toBeTruthy();

            expect(next.classList.contains('e-nextpagedisabled')).toBeFalsy();
            expect(next.classList.contains('e-disable')).toBeFalsy();
            expect(next.classList.contains('e-nextpage')).toBeTruthy();

            expect(last.classList.contains('e-lastpagedisabled')).toBeFalsy();
            expect(last.classList.contains('e-disable')).toBeFalsy();
            expect(last.classList.contains('e-lastpage')).toBeTruthy();
        });

        it('First page testing', () => {
            (first as HTMLElement).click();
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toBe('1');

            expect(first.classList.contains('e-firstpagedisabled')).toBeTruthy();
            expect(first.classList.contains('e-disable')).toBeTruthy();
            expect(first.classList.contains('e-firstpage')).toBeFalsy();

            expect(prev.classList.contains('e-prevpagedisabled')).toBeTruthy();
            expect(prev.classList.contains('e-disable')).toBeTruthy();
            expect(prev.classList.contains('e-prevpage')).toBeFalsy();

            expect(PP.classList.contains('e-nextprevitemdisabled')).toBeTruthy();
            expect(PP.classList.contains('e-disable')).toBeTruthy();
            expect(PP.classList.contains('e-numericitem')).toBeFalsy();

            expect(NP.classList.contains('e-nextprevitemdisabled')).toBeFalsy();
            expect(NP.classList.contains('e-disable')).toBeFalsy();
            expect(NP.classList.contains('e-numericitem')).toBeTruthy();

            expect(next.classList.contains('e-nextpagedisabled')).toBeFalsy();
            expect(next.classList.contains('e-disable')).toBeFalsy();
            expect(next.classList.contains('e-nextpage')).toBeTruthy();

            expect(last.classList.contains('e-lastpagedisabled')).toBeFalsy();
            expect(last.classList.contains('e-disable')).toBeFalsy();
            expect(last.classList.contains('e-lastpage')).toBeTruthy();
            (first as HTMLElement).click();
        });

        it('Next page testing', () => {
            pagerObj.goToPage(13);
            (next as HTMLElement).click();
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toBe('14');

            expect(first.classList.contains('e-firstpagedisabled')).toBeFalsy();
            expect(first.classList.contains('e-disable')).toBeFalsy();
            expect(first.classList.contains('e-firstpage')).toBeTruthy();

            expect(prev.classList.contains('e-prevpagedisabled')).toBeFalsy();
            expect(prev.classList.contains('e-disable')).toBeFalsy();
            expect(prev.classList.contains('e-prevpage')).toBeTruthy();

            expect(PP.classList.contains('e-nextprevitemdisabled')).toBeFalsy();
            expect(PP.classList.contains('e-disable')).toBeFalsy();
            expect(PP.classList.contains('e-numericitem')).toBeTruthy();

            expect(NP.classList.contains('e-nextprevitemdisabled')).toBeFalsy();
            expect(NP.classList.contains('e-disable')).toBeFalsy();
            expect(NP.classList.contains('e-numericitem')).toBeTruthy();

            expect(next.classList.contains('e-nextpagedisabled')).toBeFalsy();
            expect(next.classList.contains('e-disable')).toBeFalsy();
            expect(next.classList.contains('e-nextpage')).toBeTruthy();

            expect(last.classList.contains('e-lastpagedisabled')).toBeFalsy();
            expect(last.classList.contains('e-disable')).toBeFalsy();
            expect(last.classList.contains('e-lastpage')).toBeTruthy();
        });

        it('Last page testing', () => {
            (last as HTMLElement).click();
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toBe('20');

            expect(first.classList.contains('e-firstpagedisabled')).toBeFalsy();
            expect(first.classList.contains('e-disable')).toBeFalsy();
            expect(first.classList.contains('e-firstpage')).toBeTruthy();

            expect(prev.classList.contains('e-prevpagedisabled')).toBeFalsy();
            expect(prev.classList.contains('e-disable')).toBeFalsy();
            expect(prev.classList.contains('e-prevpage')).toBeTruthy();

            expect(PP.classList.contains('e-nextprevitemdisabled')).toBeFalsy();
            expect(PP.classList.contains('e-disable')).toBeFalsy();
            expect(PP.classList.contains('e-numericitem')).toBeTruthy();

            expect(NP.classList.contains('e-nextprevitemdisabled')).toBeTruthy();
            expect(NP.classList.contains('e-disable')).toBeTruthy();
            expect(NP.classList.contains('e-numericitem')).toBeFalsy();

            expect(next.classList.contains('e-nextpagedisabled')).toBeTruthy();
            expect(next.classList.contains('e-disable')).toBeTruthy();
            expect(next.classList.contains('e-nextpage')).toBeFalsy();

            expect(last.classList.contains('e-lastpagedisabled')).toBeTruthy();
            expect(last.classList.contains('e-disable')).toBeTruthy();
            expect(last.classList.contains('e-lastpage')).toBeFalsy();
        });

        it('Prev page set testing', () => {
            pagerObj.goToPage(13);
            (PP as HTMLElement).click();
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toBe('6');

            expect(first.classList.contains('e-firstpagedisabled')).toBeFalsy();
            expect(first.classList.contains('e-disable')).toBeFalsy();
            expect(first.classList.contains('e-firstpage')).toBeTruthy();

            expect(prev.classList.contains('e-prevpagedisabled')).toBeFalsy();
            expect(prev.classList.contains('e-disable')).toBeFalsy();
            expect(prev.classList.contains('e-prevpage')).toBeTruthy();

            expect(PP.classList.contains('e-nextprevitemdisabled')).toBeFalsy();
            expect(PP.classList.contains('e-disable')).toBeFalsy();
            expect(PP.classList.contains('e-numericitem')).toBeTruthy();

            expect(NP.classList.contains('e-nextprevitemdisabled')).toBeFalsy();
            expect(NP.classList.contains('e-disable')).toBeFalsy();
            expect(NP.classList.contains('e-numericitem')).toBeTruthy();

            expect(next.classList.contains('e-nextpagedisabled')).toBeFalsy();
            expect(next.classList.contains('e-disable')).toBeFalsy();
            expect(next.classList.contains('e-nextpage')).toBeTruthy();

            expect(last.classList.contains('e-lastpagedisabled')).toBeFalsy();
            expect(last.classList.contains('e-disable')).toBeFalsy();
            expect(last.classList.contains('e-lastpage')).toBeTruthy();
        });

        it('Prev page set testing', () => {
            pagerObj.goToPage(13);
            (NP as HTMLElement).click();
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toBe('16');

            expect(first.classList.contains('e-firstpagedisabled')).toBeFalsy();
            expect(first.classList.contains('e-disable')).toBeFalsy();
            expect(first.classList.contains('e-firstpage')).toBeTruthy();

            expect(prev.classList.contains('e-prevpagedisabled')).toBeFalsy();
            expect(prev.classList.contains('e-disable')).toBeFalsy();
            expect(prev.classList.contains('e-prevpage')).toBeTruthy();

            expect(PP.classList.contains('e-nextprevitemdisabled')).toBeFalsy();
            expect(PP.classList.contains('e-disable')).toBeFalsy();
            expect(PP.classList.contains('e-numericitem')).toBeTruthy();

            expect(NP.classList.contains('e-nextprevitemdisabled')).toBeTruthy();
            expect(NP.classList.contains('e-disable')).toBeTruthy();
            expect(NP.classList.contains('e-numericitem')).toBeFalsy();

            expect(next.classList.contains('e-nextpagedisabled')).toBeFalsy();
            expect(next.classList.contains('e-disable')).toBeFalsy();
            expect(next.classList.contains('e-nextpage')).toBeTruthy();

            expect(last.classList.contains('e-lastpagedisabled')).toBeFalsy();
            expect(last.classList.contains('e-disable')).toBeFalsy();
            expect(last.classList.contains('e-lastpage')).toBeTruthy();
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
            pagerObj = elem = first = last = prev = next = NP = PP = null;
        });

    });

    describe('numericcontainer method testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager({
                totalRecordsCount: 5, currentPage: 1, pageCount: 5, pageSize: 5, enablePagerMessage: false,
                enableExternalMessage: true, externalMessage: '', created: created
            });
            pagerObj.appendTo('#Pager');
        });

        it('current page testing', () => {
            pagerObj.currentPage = 2;
            pagerObj.dataBind();
            pagerObj.refresh();
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toBe('1');
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
            pagerObj = elem = null;
        });

    });

    describe('numericcontainer method testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager({
                totalRecordsCount: 15, currentPage: 3, pageCount: 5, pageSize: 5, enablePagerMessage: false,
                enableExternalMessage: true, externalMessage: '', created: created
            });
            pagerObj.appendTo('#Pager');
        });

        it('current page testing', () => {
            pagerObj.currentPage = 5;
            pagerObj.dataBind();
            pagerObj.refresh();
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toBe('3');
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