/**
 * Pager spec 
 */

import { L10n, EmitType } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { Pager } from '../../src/pager/pager';
import { ExternalMessage } from '../../src/pager/external-message';
import '../../node_modules/es6-promise/dist/es6-promise';

Pager.Inject(ExternalMessage);

describe('Pager base module', () => {

    describe('Pager properties testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            L10n.load({
                'de-DE': {
                    'pager': {
                        'currentPageInfo': '{0} van {1} pagina',
                        'totalItemsInfo': '( {0} items)',
                        'firstPageTooltip': 'Ga naar de eerste pagina',
                        'lastPageTooltip': 'Ga naar de laatste pagina',
                        'nextPageTooltip': 'Ga naar de volgende pagina',
                        'previousPageTooltip': 'Ga naar de vorige pagina',
                        'nextPagerTooltip': 'Ga naar de volgende pager',
                        'previousPagerTooltip': 'Ga naar vorige pager'
                    }
                }
            });
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager(
                {
                    totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5, locale: 'de-DE',
                    enablePagerMessage: true, enableExternalMessage: true, externalMessage: 'externalMessage',
                    enableRtl: true, enableQueryString: true, customText: 'sheet',
                    created: created
                });

            pagerObj.appendTo('#Pager');
        });

        it('current page testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toBe('8');
        });

        it('page count testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-numericcontainer')[0].childNodes.length).toBe(5);
        });

        it('enable pager message element testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-parentmsgbar').length).toBe(1);
        });

        it('enable pager message testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-parentmsgbar')[0].textContent).toBe('8 van 20 pagina ( 100 items)');
        });

        it('enable pager external message element testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg').length).toBe(1);
        });

        it('enable pager external message testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg')[0].textContent).toBe('externalMessage');
        });

        it('class testing', () => {
            expect(pagerObj.element.classList.contains('e-pager')).toBeTruthy();
        });

        it('rtl testing', () => {
            expect(pagerObj.element.classList.contains('e-rtl')).toBeTruthy();
        });

        it('custom text testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-active')[0].textContent).toBe('sheet8');
        });

        it('current page value testing', () => {
            expect(pagerObj.currentPage).toBe(8);
        });

        it('totalRecordsCount value testing', () => {
            expect(pagerObj.totalRecordsCount).toBe(100);
        });

        it('pageCount value testing', () => {
            expect(pagerObj.pageCount).toBe(5);
        });

        it('pageSize value testing', () => {
            expect(pagerObj.pageSize).toBe(5);
        });

        it('enableExternalMessage value testing', () => {
            expect(pagerObj.enableExternalMessage).toBeTruthy();
        });

        it('enablePagerMessage value testing', () => {
            expect(pagerObj.enablePagerMessage).toBeTruthy();
        });

        it('externalMessage value testing', () => {
            expect(pagerObj.externalMessage).toBe('externalMessage');
        });

        it('enableRtl value testing', () => {
            expect(pagerObj.enableRtl).toBeTruthy();
        });

        it('enableQueryString value testing', () => {
            expect(pagerObj.enableQueryString).toBeTruthy();
        });

        it('locale value testing', () => {
            expect(pagerObj.locale).toBe('de-DE');
        });

        it('querystring testing', () => {
            pagerObj.goToPage(10);
            expect(window.location.href.indexOf('?page=10')).toBeGreaterThan(-1);
        });

        it('pager button visibility testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-disable').length).toBe(0);
        });

        it('pager aria-attribute testing', () => {
            let pagerElement: Element = pagerObj.element;
            expect(pagerElement.querySelector('.e-mfirst').hasAttribute('tabindex')).toBeTruthy();
            expect(pagerElement.querySelector('.e-mprev').hasAttribute('tabindex')).toBeTruthy();
            let pagerContainer: Element = pagerObj.element.querySelector('.e-pagercontainer');
            let numericContainer: Element = pagerObj.element.querySelector('.e-numericcontainer');
            expect(pagerContainer.querySelector('.e-first').hasAttribute('tabindex')).toBeTruthy();
            expect(pagerContainer.querySelector('.e-prev').hasAttribute('tabindex')).toBeTruthy();
            for (let i: number; i < numericContainer.children.length; i++) {
                expect(numericContainer.children[i].hasAttribute('aria-label')).toBeTruthy();
                expect(numericContainer.children[i].hasAttribute('tabindex')).toBeTruthy();
            }
            expect(pagerElement.querySelector('.e-mnext').hasAttribute('tabindex')).toBeTruthy();
            expect(pagerElement.querySelector('.e-mlast').hasAttribute('aria-label')).toBeTruthy();
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
        });

    });

    describe('Empty pager control testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager({ created: created });
            pagerObj.appendTo('#Pager');
        });

        it('pager message testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-parentmsgbar')[0].textContent).toBe('0 of 0 pages (0 items)');
        });

        it('disabled element testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-disable').length).toBe(10);
        });

        it('numericcontainer element testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-numericcontainer')[0].childNodes.length).toBe(10);
        });

        it('pager message element testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-parentmsgbar').length).toBe(1);
        });

        it('pager external message element testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg').length).toBe(0);
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
        });

    });

    describe('Method testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            pagerObj = new Pager(
                {
                    totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5,
                });
            pagerObj.appendTo('#Pager');
            setTimeout(() => { done(); }, 1000);
        });

        it('getLocalizedLabel testing', () => {
            expect(pagerObj.getLocalizedLabel('firstPageTooltip')).toBe('Go to first page');
        });

        afterAll(() => {
            pagerObj.getPersistData();
            pagerObj.destroy();
            elem.remove();
        });

    });

    describe('pager onproperty changed', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });
        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager(
                {
                    totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5,
                    enablePagerMessage: true, enableExternalMessage: true, externalMessage: 'externalMessage',
                    enableRtl: true, enableQueryString: true, customText: 'sheet',
                    created: created
                });
            pagerObj.appendTo('#Pager');
        });

        it('totalRecordsCount testing', () => {
            pagerObj.totalRecordsCount = 200;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-parentmsgbar')[0].textContent).toBe('8 of 40 pages (200 items)');
        });

        it('pageSize testing', () => {
            pagerObj.pageSize = 6;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-parentmsgbar')[0].textContent).toBe('8 of 34 pages (200 items)');
        });

        it('pageCount testing', () => {
            pagerObj.pageCount = 6;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-numericcontainer')[0].childNodes.length).toBe(6);
        });

        it('currentPage testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toBe('8');
            pagerObj.currentPage = 13;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toBe('13');
        });

        it('currentPage invalid value testing', () => {
            pagerObj.currentPage = -1;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toBe('13');
            pagerObj.currentPage = 13;
            pagerObj.dataBind();
        });

        it('enablePagerMessage false testing', () => {
            pagerObj.enablePagerMessage = false;
            pagerObj.dataBind();
            expect((pagerObj.element.querySelectorAll('.e-parentmsgbar')[0] as HTMLElement).style.display).toBe('');
        });

        it('enablePagerMessage true testing', () => {
            pagerObj.enablePagerMessage = true;
            pagerObj.dataBind();
            expect((pagerObj.element.querySelectorAll('.e-parentmsgbar')[0] as HTMLElement).style.display).not.toBe('none');
        });

        it('enableExternalMessage false testing', () => {
            pagerObj.enableExternalMessage = false;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg').length).toBe(0);
        });

        it('enableExternalMessage true testing', () => {
            pagerObj.enableExternalMessage = true;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg').length).toBe(1);
        });

        it('enable pager external message testing', () => {
            pagerObj.externalMessage = 'modified';
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg')[0].textContent).toBe('modified');
        });

        it('rtl false testing', () => {
            pagerObj.enableRtl = false;
            pagerObj.dataBind();
            expect(pagerObj.element.classList.contains('e-rtl')).toBeFalsy();
        });

        it('rtl true testing', () => {
            pagerObj.enableRtl = true;
            pagerObj.dataBind();
            expect(pagerObj.element.classList.contains('e-rtl')).toBeTruthy();
        });

        it('custom text testing', () => {
            pagerObj.customText = 'spreadsheet';
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-active')[0].textContent).toBe('spreadsheet13');
        });

        it('querystring testing', () => {
            pagerObj.enableQueryString = false;
            pagerObj.dataBind();
            pagerObj.goToPage(14);
            expect(window.location.href.indexOf('?page=14')).not.toBeGreaterThan(-1);
            pagerObj.enableQueryString = true;
            pagerObj.dataBind();
            pagerObj.goToPage(15);
            expect(window.location.href.indexOf('?page=15')).toBeGreaterThan(-1);
        });

        it('locale testing', () => {
            pagerObj.locale = 'de-DE';
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-parentmsgbar')[0].textContent).toBe('15 van 34 pagina ( 200 items)');
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
        });

    });

    describe('pager template refresh', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager({
                template: '', totalRecordsCount: 100, created: created
            });
            pagerObj.appendTo('#Pager');
        });
        it('pager template refresh testing', () => {
            pagerObj.template = '<span class ="e-pagenomsg">${currentPage} of ${totalPages} pages</span>';
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-pagenomsg')[0].textContent).toBe('1 of 9 pages');
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
        });

    });
    describe('pager template render', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });
        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager({
                template: '<span class ="e-pagenomsg">${currentPage} of ${totalPages} pages</span>', totalRecordsCount: 100, created: created
            });
            pagerObj.appendTo('#Pager');
        });
        it('pager template render testing', () => {
            pagerObj.totalRecordsCount = 200;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-pagenomsg')[0].textContent).toBe('1 of 17 pages');
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
        });

    });
    describe('pager template create', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });
        let element: HTMLElement = createElement('div', { id: 'pagertemplate' });
        element.innerHTML = '<span class ="e-pagenomsg">${currentPage} of ${totalPages} pages</span>'
        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            elem.appendChild(element)
            pagerObj = new Pager({
                template: '#pagertemplate', totalRecordsCount: 100, created: created
            });
            pagerObj.appendTo('#Pager');
        });
        it('pager template create testing', () => {
            pagerObj.totalRecordsCount = 200;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-pagenomsg')[0].textContent).toBe('1 of 17 pages');
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
        });

    });
});
