/**
 * ExternalMessage spec 
 */

import { EmitType } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { Pager } from '../../src/pager/pager';
import { ExternalMessage } from '../../src/pager/external-message';
import '../../node_modules/es6-promise/dist/es6-promise';

Pager.Inject(ExternalMessage);

describe('ExternalMessage module testing', () => {

    describe('ExternalMessage method testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
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

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
        });

    });

});