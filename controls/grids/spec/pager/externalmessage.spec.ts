/**
 * ExternalMessage spec 
 */

import { EmitType } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { Pager } from '../../src/pager/pager';
import { ExternalMessage } from '../../src/pager/external-message';
import '../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from './common.spec';

Pager.Inject(ExternalMessage);

describe('ExternalMessage module testing', () => {

    describe('ExternalMessage method testing', () => {
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
                totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5, enablePagerMessage: false,
                enableExternalMessage: true, externalMessage: '', created: created
            });
            pagerObj.appendTo('#Pager');
        });

        it('externalMessage hide testing', () => {
            pagerObj.externalMessageModule.hideMessage();
            expect((pagerObj.element.querySelectorAll('.e-pagerexternalmsg')[0] as HTMLElement).style.display).toBe('none');
        });

        it('externalMessage show testing', () => {
            pagerObj.externalMessageModule.showMessage();
            expect((pagerObj.element.querySelectorAll('.e-pagerexternalmsg')[0] as HTMLElement).style.display).not.toBe('none');
        });

        it('refresh externalMessage testing', () => {
            pagerObj.externalMessageModule.refresh();
            expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg')[0].textContent.length).toBe(0);
        });

        it('set externalMessage testing', () => {
            pagerObj.externalMessage = 'externalMessage';
            pagerObj.externalMessageModule.refresh();
            expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg')[0].textContent).toBe('externalMessage');
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
            pagerObj = elem = null;
        });

    });

    describe('ExternalMessage disable testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager({
                totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5, enablePagerMessage: false,
                enableExternalMessage: false, externalMessage: 'extmsg', created: created
            });
            pagerObj.appendTo('#Pager');
        });

        it('externalMessage element testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg').length).toBe(0);
        });

        it('externalMessage enable testing', () => {
            pagerObj.enableExternalMessage = true;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg').length).toBe(1);
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