/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import {NavigationPane} from '../../../src/file-manager/layout/navigation-pane';
import {DetailsView} from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement, Browser, Instance } from '@syncfusion/ej2-base';
import { toolbarItems, toolbarItems1, data1, data2, data3, data4, data5, data10, data11, data12 } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control single selection LargeIcons view', () => {
    describe('mobile testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: any;
        let ele: HTMLElement;
        let originalTimeout: any;
        let iosPhoneUa: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3';
        let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
            Browser.userAgent = iosPhoneUa;
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'LargeIcons',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data12)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            mouseEventArgs = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                originalEvent: { target: null }
            };
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                done();
            }, 500);
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            Browser.userAgent = Chromebrowser;
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('mouse click on file', (done: Function) => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[4].classList.contains('e-active')).toBe(false);
            expect(li[4].classList.contains('e-focus')).toBe(false);
            expect(li[4].querySelector('.e-frame')).toBe(null);
            mouseEventArgs.target = li[4];
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            setTimeout(function () {
                let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(nli[4].classList.contains('e-active')).toBe(true);
                expect(nli[4].classList.contains('e-focus')).toBe(true);
                expect(nli[4].querySelector('.e-frame')).toBe(null);
                done();
            }, 500);
        });
        it('mouse click on folder', (done: Function) => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li.length).toBe(9);
            mouseEventArgs.target = li[0];
            expect(li[0].textContent).toBe('New folder');
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            setTimeout(function () {
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                setTimeout(function () {
                    let li1: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    expect(li1.length).toBe(5);
                    mouseEventArgs.target = li1[0];
                    expect(li1[0].textContent).toBe('Documents');
                    feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                    setTimeout(function () {
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify(data3)
                        });
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                        setTimeout(function () {
                            let li3: any = document.getElementById('file_largeicons').querySelectorAll('li');
                            expect(li3.length).toBe(0);
                            done();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });
        it('mouse click on wrapper', (done: Function) => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            let ul: any = document.getElementById('file_largeicons').querySelectorAll('ul');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame')).toBe(null);
            mouseEventArgs.target = ul[0];
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            setTimeout(function () {
                let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(nli[0].classList.contains('e-active')).toBe(false);
                expect(nli[0].classList.contains('e-focus')).toBe(false);
                expect(nli[0].querySelector('.e-frame')).toBe(null);
                mouseEventArgs.target = li[0];
                feObj.largeiconsviewModule.clickObj.tapHold(tapEvent);
                let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(neli[0].classList.contains('e-active')).toBe(true);
                expect(neli[0].classList.contains('e-focus')).toBe(true);
                expect(neli[0].querySelector('.e-frame')).toBe(null);
                mouseEventArgs.target = ul[0];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                setTimeout(function () {
                    let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    expect(newli[0].classList.contains('e-active')).toBe(false);
                    expect(newli[0].classList.contains('e-focus')).toBe(true);
                    expect(newli[0].querySelector('.e-frame')).toBe(null);
                    done();
                }, 500);
            }, 500);
        });
        it('mouse double click on wrapper', (done: Function) => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            let ul: any = document.getElementById('file_largeicons').querySelectorAll('ul');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame')).toBe(null);
            mouseEventArgs.target = ul[0];
            tapEvent.tapCount = 2;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            setTimeout(function () {
                let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(nli[0].classList.contains('e-active')).toBe(false);
                expect(nli[0].classList.contains('e-focus')).toBe(false);
                expect(nli[0].querySelector('.e-frame')).toBe(null);
                mouseEventArgs.target = li[0];
                tapEvent.tapCount = 1;
                feObj.largeiconsviewModule.clickObj.tapHold(tapEvent);
                let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(neli[0].classList.contains('e-active')).toBe(true);
                expect(neli[0].classList.contains('e-focus')).toBe(true);
                expect(neli[0].querySelector('.e-frame')).toBe(null);
                mouseEventArgs.target = ul[0];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                setTimeout(function () {
                    tapEvent.tapCount = 2;
                    feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                    setTimeout(function () {
                        let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
                        expect(newli[0].classList.contains('e-active')).toBe(false);
                        expect(newli[0].classList.contains('e-focus')).toBe(true);
                        expect(newli[0].querySelector('.e-frame')).toBe(null);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
        it('tabHold with multiselection', (done: Function) => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[8].classList.contains('e-active')).toBe(false);
            expect(li[8].classList.contains('e-focus')).toBe(false);
            expect(li[8].querySelector('.e-frame')).toBe(null);
            expect(li[8].textContent).toBe('Sugar cookie.png');
            expect(feObj.element.classList.contains('e-fe-m-select')).toBe(false);
            mouseEventArgs.target = li[8];
            feObj.largeiconsviewModule.clickObj.tapHold(tapEvent);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[8].classList.contains('e-active')).toBe(true);
            expect(nli[8].classList.contains('e-focus')).toBe(true);
            expect(nli[8].querySelector('.e-frame')).toBe(null);
            expect(nli[6].textContent).toBe('Doughnut.png');
            expect(feObj.element.classList.contains('e-fe-m-select')).toBe(false);
            mouseEventArgs.target = nli[6];
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            setTimeout(function () {
                let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(newli[6].classList.contains('e-active')).toBe(true);
                expect(newli[6].classList.contains('e-focus')).toBe(true);
                expect(newli[6].querySelector('.e-frame')).toBe(null);
                expect(newli[8].classList.contains('e-active')).toBe(false);
                expect(newli[8].classList.contains('e-focus')).toBe(false);
                expect(newli[8].querySelector('.e-frame')).toBe(null);
                expect(feObj.element.classList.contains('e-fe-m-select')).toBe(false);
                mouseEventArgs.target = newli[6];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                setTimeout(function () {
                    let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    expect(newli1[6].classList.contains('e-active')).toBe(true);
                    expect(newli1[6].classList.contains('e-focus')).toBe(true);
                    expect(newli1[6].querySelector('.e-frame')).toBe(null);
                    expect(newli1[8].classList.contains('e-active')).toBe(false);
                    expect(newli1[8].classList.contains('e-focus')).toBe(false);
                    expect(newli1[8].querySelector('.e-frame')).toBe(null);
                    expect(feObj.element.classList.contains('e-fe-m-select')).toBe(false);
                    let ul: any = document.getElementById('file_largeicons').querySelectorAll('ul');
                    mouseEventArgs.target = ul[0];
                    feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                    setTimeout(function () {
                        let newli2: any = document.getElementById('file_largeicons').querySelectorAll('li');
                        expect(newli2[8].classList.contains('e-active')).toBe(false);
                        expect(newli2[8].classList.contains('e-focus')).toBe(false);
                        expect(newli2[8].querySelector('.e-frame')).toBe(null);
                        expect(newli2[6].classList.contains('e-active')).toBe(false);
                        expect(newli2[6].classList.contains('e-focus')).toBe(true);
                        expect(newli2[6].querySelector('.e-frame')).toBe(null);
                        expect(newli2[2].classList.contains('e-active')).toBe(false);
                        expect(newli2[2].classList.contains('e-focus')).toBe(false);
                        expect(newli2[2].querySelector('.e-frame')).toBe(null);
                        expect(feObj.element.classList.contains('e-fe-m-select')).toBe(false);
                        let li1: any = document.getElementById('file_largeicons').querySelectorAll('li');
                        expect(li1[4].classList.contains('e-active')).toBe(false);
                        expect(li1[4].classList.contains('e-focus')).toBe(false);
                        expect(li1[4].querySelector('.e-frame')).toBe(null);
                        mouseEventArgs.target = li[4];
                        feObj.largeiconsviewModule.clickObj.tapHold(tapEvent);
                        let nli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
                        expect(nli1[4].classList.contains('e-active')).toBe(true);
                        expect(nli1[4].classList.contains('e-focus')).toBe(true);
                        expect(nli1[4].querySelector('.e-frame')).toBe(null);
                        expect(feObj.element.classList.contains('e-fe-m-select')).toBe(false);
                        mouseEventArgs.target = nli1[4];
                        feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                        setTimeout(function () {
                            let nli2: any = document.getElementById('file_largeicons').querySelectorAll('li');
                            expect(nli2[4].classList.contains('e-active')).toBe(true);
                            expect(nli2[4].classList.contains('e-focus')).toBe(true);
                            expect(nli2[4].querySelector('.e-frame')).toBe(null);
                            expect(feObj.element.classList.contains('e-fe-m-select')).toBe(false);
                            done();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });
        it('mouse click on toolbar selectall button', () => {
            let item: any = document.getElementById('file_toolbar').querySelector('.e-fe-select');
            expect(item).toBe(null);
        });
        it('mouse click on toolbar clear all button', () => {
            let item: any = document.getElementById('file_toolbar').querySelector('.e-fe-clear');
            expect(item).not.toBe(null);
        });
    });
});