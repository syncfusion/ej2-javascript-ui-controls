/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement, Browser } from '@syncfusion/ej2-base';
import { data1, data17, data18, data19, data20, data21 } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control Grid view', () => {
    describe('ie11 browser testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: any;
        let ele: HTMLElement;
        let originalTimeout: any;
        let ie11UA: string = "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; Tablet PC 2.0; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko";
        let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
            Browser.userAgent = ie11UA;
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                searchSettings: { allowSearchOnTyping: false },
                showThumbnail: false,
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
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
            expect(li[4].getAttribute('aria-selected')).toEqual(null);
            expect(li[4].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            feObj.detailsviewModule.gridObj.selectRows([4]);
            let nli: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(nli[4].getAttribute('aria-selected')).toEqual('true');
            expect(nli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('mouse double click on file', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(li[4].getAttribute('aria-selected')).toEqual(null);
            expect(li[4].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            let args = { rowData: { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png" }, rowIndex: 4 };
            feObj.detailsviewModule.gridObj.recordDoubleClick(args);
            let nli: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(nli[4].getAttribute('aria-selected')).toEqual('true');
            expect(nli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('Search file testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(5);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.change(eventArgs);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data18)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(3);
                searchEle.value = '';
                searchObj.value = '';
                eventArgs = { value: '', container: searchEle };
                searchObj.change(eventArgs);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                    expect(treeLi.length).toEqual(5);
                    expect(gridLi.length).toEqual(5);
                    done();
                }, 500);
            }, 500);
        });
        it('Search folder navigation', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(5);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.change(eventArgs);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data18)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(3);
                let args = { rowData: { "name": "docs", "size": 0, "dateModified": "2019-03-14T09:27:45.346Z", "dateCreated": "2019-03-13T07:28:06.117Z", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Documents\\", "_fm_iconClass": "e-fe-folder" }, rowIndex: 0 };
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
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree_0_0");
                    expect(treeLi.length).toEqual(6);
                    expect(gridLi.length).toEqual(1);
                    done();
                }, 500);
            }, 500);
        });
        it('Search folder rename operation', (done: Function) => {
            let ele: any = document.getElementById(feObj.element.id + '_contextmenu');
            let menuObj: any = ele.ej2_instances[0];
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(5);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.change(eventArgs);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data18)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(3);
                expect(gridLi[0].querySelector(".e-fe-text").textContent).toBe('docs');
                feObj.detailsviewModule.gridObj.selectRows([0]);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                gridLi[0].dispatchEvent(evt);
                setTimeout(function () {
                    menuObj.element.querySelector('.e-fe-rename').click();
                    setTimeout(function () {
                        let inputValue: any = document.getElementById('file_dialog').querySelector('#rename');
                        expect((inputValue as any).value).toEqual("docs");
                        inputValue.value = 'docs1';
                        (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify(data20)
                        });
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify(data21)
                        });
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function () {
                            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                            let treeLi: any = treeObj.element.querySelectorAll('li');
                            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                            expect(treeLi.length).toEqual(5);
                            expect(gridLi.length).toEqual(3);
                            expect(gridLi[0].querySelector(".e-fe-text").textContent).toBe('docs1');
                            done();
                        }, 500);
                    }, 100);
                }, 100);
            }, 500);
        });
    });
    describe('edge browser testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: any;
        let ele: HTMLElement;
        let originalTimeout: any;
        let edgeUA: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763";
        let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
            Browser.userAgent = edgeUA;
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'Details',
                searchSettings: { allowSearchOnTyping: false },
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
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
            expect(li[4].getAttribute('aria-selected')).toEqual(null);
            expect(li[4].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            feObj.detailsviewModule.gridObj.selectRows([4]);
            let nli: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(nli[4].getAttribute('aria-selected')).toEqual('true');
            expect(nli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('mouse double click on file', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(li[4].getAttribute('aria-selected')).toEqual(null);
            expect(li[4].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            let args = { rowData: { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png" }, rowIndex: 4 };
            feObj.detailsviewModule.gridObj.recordDoubleClick(args);
            let nli: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(nli[4].getAttribute('aria-selected')).toEqual('true');
            expect(nli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('Search file testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(5);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.change(eventArgs);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data18)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(3);
                searchEle.value = '';
                searchObj.value = '';
                eventArgs = { value: '', container: searchEle };
                searchObj.change(eventArgs);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                    expect(treeLi.length).toEqual(5);
                    expect(gridLi.length).toEqual(5);
                    done();
                }, 500);
            }, 500);
        });
        it('Search folder navigation', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(5);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.change(eventArgs);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data18)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(3);
                let args = { rowData: { "name": "docs", "size": 0, "dateModified": "2019-03-14T09:27:45.346Z", "dateCreated": "2019-03-13T07:28:06.117Z", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Documents\\", "_fm_iconClass": "e-fe-folder" }, rowIndex: 0 };
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
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree_0_0");
                    expect(treeLi.length).toEqual(6);
                    expect(gridLi.length).toEqual(1);
                    done();
                }, 500);
            }, 500);
        });
        it('Search folder rename operation', (done: Function) => {
            let ele: any = document.getElementById(feObj.element.id + '_contextmenu');
            let menuObj: any = ele.ej2_instances[0];
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(5);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.change(eventArgs);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data18)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(3);
                expect(gridLi[0].querySelector(".e-fe-text").textContent).toBe('docs');
                feObj.detailsviewModule.gridObj.selectRows([0]);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                gridLi[0].dispatchEvent(evt);
                setTimeout(function () {
                    menuObj.element.querySelector('.e-fe-rename').click();
                    setTimeout(function () {
                        let inputValue: any = document.getElementById('file_dialog').querySelector('#rename');
                        expect((inputValue as any).value).toEqual("docs");
                        inputValue.value = 'docs1';
                        (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify(data20)
                        });
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify(data21)
                        });
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function () {
                            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                            let treeLi: any = treeObj.element.querySelectorAll('li');
                            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                            expect(treeLi.length).toEqual(5);
                            expect(gridLi.length).toEqual(3);
                            expect(gridLi[0].querySelector(".e-fe-text").textContent).toBe('docs1');
                            done();
                        }, 500);
                    }, 100);
                }, 100);
            }, 500);
        });
    });
});