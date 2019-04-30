/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import {NavigationPane} from '../../../src/file-manager/layout/navigation-pane';
import {DetailsView} from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement, Browser, Instance } from '@syncfusion/ej2-base';
import { toolbarItems, toolbarItems1, data1, data2, data3, data4, data5, data10, data11, data12, data17, data18, data19 } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control single selection Grid view', () => {
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
                view: 'Details',
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
        it('mouse click on file', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(li[4].getAttribute('aria-selected')).toBe(null);
            //expect(li[4].querySelector('.e-frame')).toBe(null);
            feObj.detailsviewModule.gridObj.selectRow(4);
            let nli: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            //expect(nli[4].getAttribute('aria-selected')).toBe('true');
            //expect(nli[4].querySelector('.e-frame')).toBe(null);
        });
        it('tapHold with multiselection', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(li[4].getAttribute('aria-selected')).toBe(null);
            //expect(li[4].querySelector('.e-frame')).toBe(null);
            expect(feObj.element.classList.contains('e-fe-m-select')).toBe(false);
            mouseEventArgs.target = li[4];
            feObj.detailsviewModule.clickObj.tapHold(tapEvent);
            let nli1: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            //expect(nli1[4].getAttribute('aria-selected')).toBe('true');
            //expect(nli1[4].querySelector('.e-frame')).toBe(null);
            expect(feObj.element.classList.contains('e-fe-m-select')).toBe(false);
            nli1[4].querySelector('.e-templatecell').click();
            let nli2: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            //expect(nli2[4].getAttribute('aria-selected')).toBe('true');
            //expect(nli2[4].querySelector('.e-frame')).toBe(null);
            expect(feObj.element.classList.contains('e-fe-m-select')).toBe(false);
        });
        it('mouse click on toolbar selectall button', () => {
            let item: any = document.getElementById('file_toolbar').querySelector('.e-fe-select');
            expect(item).toBe(null);
        });
        it('mouse click on toolbar clear all button', () => {
            let item: any = document.getElementById('file_toolbar').querySelector('.e-fe-clear');
            expect(item).not.toBe(null);
        });
        it('Search file testing', (done: Function) => {
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(gridLi.length).toEqual(9);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.input(eventArgs);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data18)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(gridLi.length).toEqual(3);
                searchEle.value = '';
                searchObj.value = '';
                eventArgs = { value: '', container: searchEle };
                searchObj.input(eventArgs);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    expect(gridLi.length).toEqual(5);
                    done();
                }, 500);
            }, 500);
        });
        it('Search folder navigation', (done: Function) => {
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(gridLi.length).toEqual(9);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.input(eventArgs);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data18)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(gridLi.length).toEqual(3);
                let args = { rowData: { "name": "docs", "size": 0, "dateModified": "2019-03-14T09:27:45.346Z", "dateCreated": "2019-03-13T07:28:06.117Z", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Documents\\docs", "iconClass": "e-fe-folder" }, rowIndex: 0 };
                feObj.detailsviewModule.gridObj.recordDoubleClick(args);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data17)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data19)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    expect(gridLi.length).toEqual(1);
                    done();
                }, 500);
            }, 500);
        });
    });
});