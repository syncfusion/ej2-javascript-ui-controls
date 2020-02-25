/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { data1, data17, data18, data19, data20, data21, data22, searchpng, searchhellopng, doubleClickRead } from '../data';
import { BeforeSendEventArgs } from '../../../src';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control Large icons view', () => {
    describe('with breadcrumb bar testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: any;
        let ele: HTMLElement;
        let check: boolean = false;
        let originalTimeout: any;
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                searchSettings: { allowSearchOnTyping: false },
                beforeSend: (args: BeforeSendEventArgs) => {
                    if (check) {
                        let obj: any = JSON.parse((<any>args.ajaxSettings).data);
                        expect(obj.data[0].name === 'FileContent').toBe(true);
                    }
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
            setTimeout(function () {
                done();
            }, 500);
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
        });
        afterEach((): void => {
            check = false;
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('Breadcrumb navigation data empty testing', (done: Function) => {
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead)
            });
            setTimeout(function () {
                check = true;
                (<HTMLElement>document.getElementsByClassName('e-addressbar-ul')[0].firstElementChild.firstElementChild).click();
                done();
            }, 500);
        });
       it('Search file empty testing', (done: Function) => {
           let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
           let treeLi: any = treeObj.element.querySelectorAll('li');
           let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
           mouseEventArgs.target = largeLi[0];
           tapEvent.tapCount = 1;
           feObj.largeiconsviewModule.clickObj.tap(tapEvent);
           expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
           expect(feObj.selectedItems.length).toBe(1);
           expect(treeLi.length).toEqual(5);
           expect(largeLi.length).toEqual(5);
           let searchEle: any = feObj.element.querySelector("#file_search");
           let searchObj: any = searchEle.ej2_instances[0];
           searchEle.value = '.png';
           searchObj.value = '.png';
           let eventArgs: any = { value: '.png', container: searchEle };
           searchObj.change(eventArgs);
           this.request = jasmine.Ajax.requests.mostRecent();
           this.request.respondWith({
               status: 200,
               responseText: JSON.stringify(searchpng)
           });
           setTimeout(function () {
               let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
               expect(largeLi.length).toEqual(2);
               searchEle.value = 'hello.png';
               searchObj.value = 'hello.png';
               eventArgs = { value: 'hello.png', container: searchEle };
               searchObj.change(eventArgs);
               this.request = jasmine.Ajax.requests.mostRecent();
               this.request.respondWith({
                   status: 200,
                   responseText: JSON.stringify(searchhellopng)
               });
               setTimeout(function () {
                   let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                   expect(largeLi.length).toEqual(0);
                   done();
               }, 500);
           }, 500);
       });
        it('Search file with selection testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
            mouseEventArgs.target = largeLi[0];
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(feObj.selectedItems.length).toBe(1);
            expect(treeLi.length).toEqual(5);
            expect(largeLi.length).toEqual(5);
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
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(3);
                expect(feObj.selectedItems.length ===0).toBe(true);
                searchEle.value = '';
                searchObj.value = '';
                eventArgs = { value: '', container: searchEle };
                searchObj.change(eventArgs);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                setTimeout(function () {
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                    expect(treeLi.length).toEqual(5);
                    expect(largeLi.length).toEqual(5);
                    done();
                }, 500);
            }, 500);
        });
        it('Search file testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(largeLi.length).toEqual(5);
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
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(3);
                searchEle.value = '';
                searchObj.value = '';
                eventArgs = { value: '', container: searchEle };
                searchObj.change(eventArgs);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                setTimeout(function () {
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                    expect(treeLi.length).toEqual(5);
                    expect(largeLi.length).toEqual(5);
                    done();
                }, 500);
            }, 500);
        });
        it('Search file and layout change testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(largeLi.length).toEqual(5);
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
            setTimeout(function () {
                let gridObj: any = (document.getElementById("file") as any).ej2_instances[0];
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(3);
                mouseEventArgs.target = largeLi[0];
                tapEvent.tapCount = 1;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                gridObj.view = "Details";
                gridObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data18)
                });
                setTimeout(function () {
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                    expect(treeLi.length).toEqual(5);
                    expect(gridLi.length).toEqual(3);
                    expect(gridLi[0].firstElementChild.classList.contains('e-active')).toBe(true);
                    done();
                }, 500);
            }, 500);
        });
        it('Search folder navigation', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(largeLi.length).toEqual(5);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            expect(searchEle.placeholder).toBe("Search FileContent");
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.change(eventArgs);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data18)
            });
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(3);
                mouseEventArgs.target = largeLi[0];
                tapEvent.tapCount = 2;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data17)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data19)
                });
                setTimeout(function () {
                    expect(searchEle.placeholder).toBe("Search docs");
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree_0_0");
                    expect(treeLi.length).toEqual(6);
                    expect(largeLi.length).toEqual(1);
                    done();
                }, 500);
            }, 500);
        });
        it('Search folder rename operation', (done: Function) => {
            let ele: any = document.getElementById(feObj.element.id + '_contextmenu');
            let menuObj: any = ele.ej2_instances[0];
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(largeLi.length).toEqual(5);
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
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(3);
                expect(largeLi[0].querySelector(".e-list-text").textContent).toBe('docs');
                mouseEventArgs.target = largeLi[0];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[0].dispatchEvent(evt);
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
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify(data21)
                        });
                        setTimeout(function () {
                            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                            let treeLi: any = treeObj.element.querySelectorAll('li');
                            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                            expect(treeLi.length).toEqual(5);
                            expect(largeLi.length).toEqual(3);
                            expect(largeLi[0].querySelector(".e-list-text").textContent).toBe('docs1');
                            done();
                        }, 500);
                    }, 100);
                }, 100);
            }, 500);
        });
        it('Search folder get info operation', (done: Function) => {
            let ele: any = document.getElementById(feObj.element.id + '_contextmenu');
            let menuObj: any = ele.ej2_instances[0];
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(largeLi.length).toEqual(5);
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
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(3);
                mouseEventArgs.target = largeLi[0];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[0].dispatchEvent(evt);
                setTimeout(function () {
                    menuObj.element.querySelector('.e-fe-details').click();
                    done();
                }, 100);
            }, 500);
        });
        it('Search folder delete operation', (done: Function) => {
            let ele: any = document.getElementById(feObj.element.id + '_contextmenu');
            let menuObj: any = ele.ej2_instances[0];
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(largeLi.length).toEqual(5);
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
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(3);
                expect(largeLi[0].querySelector(".e-list-text").textContent).toBe('docs');
                mouseEventArgs.target = largeLi[0];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[0].dispatchEvent(evt);
                setTimeout(function () {
                    menuObj.element.querySelector('.e-fe-delete').click();
                    (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(data22)
                    });
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(data1)
                    });
                    setTimeout(function () {
                        let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                        let treeLi: any = treeObj.element.querySelectorAll('li');
                        let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                        expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                        expect(treeLi.length).toEqual(5);
                        expect(largeLi.length).toEqual(5);
                        done();
                    }, 500);
                }, 100);
            }, 500);
        });
        it('Search folder download operation', (done: Function) => {
            let ele: any = document.getElementById(feObj.element.id + '_contextmenu');
            let menuObj: any = ele.ej2_instances[0];
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(largeLi.length).toEqual(5);
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
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(3);
                mouseEventArgs.target = largeLi[2];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[2].dispatchEvent(evt);
                this.request = jasmine.Ajax.requests.mostRecent();
                setTimeout(function () {
                    //menuObj.element.querySelector('.e-fe-download').click();
                    done();
                }, 100);
            }, 500);
        });
        it('allowSearchOnTyping testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(largeLi.length).toEqual(5);
            feObj.searchSettings.allowSearchOnTyping = false;
            feObj.dataBind();
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
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(3);
                searchEle.value = '';
                searchObj.value = '';
                eventArgs = { value: '', container: searchEle };
                searchObj.change(eventArgs);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                setTimeout(function () {
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                    expect(treeLi.length).toEqual(5);
                    expect(largeLi.length).toEqual(5);
                    done();
                }, 500);
            }, 500);
        });
        it('allowSearchOnTyping true testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(largeLi.length).toEqual(5);
            feObj.searchSettings.allowSearchOnTyping = true;
            feObj.dataBind();
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'd';
            searchObj.value = 'd';
            let eventArgs: any = { value: 'd', container: searchEle };
            searchObj.input(eventArgs);
            searchEle = feObj.element.querySelector("#file_search");
            searchObj = searchEle.ej2_instances[0];
            searchEle.value = 'do';
            searchObj.value = 'do';
            eventArgs = { value: 'do', container: searchEle };
            searchObj.input(eventArgs);
            searchEle = feObj.element.querySelector("#file_search");
            searchObj = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            eventArgs = { value: 'doc', container: searchEle };
            searchObj.input(eventArgs);
            setTimeout(function () {
                this.request = jasmine.Ajax.requests.filter('/FileOperations');
                expect(this.request.length).toEqual(2);
                this.request[this.request.length - 1].respondWith({
                    status: 200,
                    responseText: JSON.stringify(data18)
                });
                setTimeout(function () {
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                    expect(treeLi.length).toEqual(5);
                    expect(largeLi.length).toEqual(3);
                    done();
                }, 500);
            }, 400);
        });
    });
});
