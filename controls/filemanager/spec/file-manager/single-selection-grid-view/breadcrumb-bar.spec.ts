/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { data1, data17, data18, data19, data20, data21, data22 } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control single selection Grid view', () => {
    describe('with breadcrumb bar testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: FileManager;
        let ele: HTMLElement;
        let originalTimeout: any;
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
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
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(3);
                let args = { rowData: { "name": "docs", "size": 0, "dateModified": "2019-03-14T09:27:45.346Z", "dateCreated": "2019-03-13T07:28:06.117Z", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Documents\\", "_fm_iconsClass": "e-fe-folder" }, rowIndex: 0 };
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
                    expect(searchEle.placeholder).toBe("Search docs");
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
        it('Search folder download operation', (done: Function) => {
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
                feObj.detailsviewModule.gridObj.selectRows([2]);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                gridLi[2].dispatchEvent(evt);
                this.request = jasmine.Ajax.requests.mostRecent();
                setTimeout(function () {
                    //menuObj.element.querySelector('.e-fe-download').click();
                    done();
                }, 100);
            }, 500);
        });
        it('allowSearchOnTyping true testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(5);
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
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                    expect(treeLi.length).toEqual(5);
                    expect(gridLi.length).toEqual(3);
                    done();
                }, 500);
            }, 400);
        });
        it('allowSearchOnTyping testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(5);
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
        it('Search field with value test case', (done) => {
            let searchObj: any = feObj.element.querySelector("#file_search");
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
            setTimeout(function () {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
                searchObj.ej2_instances[0].value = 'doc';
                searchObj.ej2_instances[0].element.value = 'doc';
                let eventArgs: any = { value: 'doc', container: searchObj };
                searchObj.ej2_instances[0].change(eventArgs);
                searchObj.ej2_instances[0].value = '';
                searchObj.ej2_instances[0].element.value = '';
                eventArgs = { value: '', container: searchObj };
                searchObj.ej2_instances[0].change(eventArgs);
                done();
            }.bind(searchObj), 500);
        });
        it('Search file testing with change event', (done) => {
            let searchObj: any = feObj.element.querySelector("#file_search");
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
            setTimeout(function () {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
                feObj.searchSettings.allowSearchOnTyping = false;
                feObj.dataBind();
                searchObj.ej2_instances[0].value = 'doc';
                let eventArgs: any = { value: 'doc', container: searchObj };
                searchObj.ej2_instances[0].change(eventArgs)
                searchObj.ej2_instances[0].value = '';
                eventArgs = { value: '', container: searchObj };
                searchObj.ej2_instances[0].change(eventArgs);
                done();
            }.bind(searchObj), 500);
        });
        it('Search file testing with filter type as startsWith', (done) => {
            feObj.searchSettings.filterType = 'startsWith';
            feObj.dataBind();
            let searchObj: any = feObj.element.querySelector("#file_search");
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
            setTimeout(function () {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
                feObj.searchSettings.allowSearchOnTyping = true;
                feObj.dataBind();
                searchObj.ej2_instances[0].value = 'doc';
                let eventArgs: any = { value: 'doc', container: searchObj };
                searchObj.ej2_instances[0].input(eventArgs);
                searchObj.ej2_instances[0].value = '';
                eventArgs = { value: '', container: searchObj };
                searchObj.ej2_instances[0].input(eventArgs);
                done();
            }.bind(searchObj), 500);
        });
        it('Search file testing with filter type as endsWith', (done) => {
            feObj.searchSettings.filterType = 'endsWith';
            feObj.dataBind();
            let searchObj: any = feObj.element.querySelector("#file_search");
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
            setTimeout(function () {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
                feObj.searchSettings.allowSearchOnTyping = true;
                feObj.dataBind();
                searchObj.ej2_instances[0].value = 'doc';
                let eventArgs: any = { value: 'doc', container: searchObj };
                searchObj.ej2_instances[0].input(eventArgs);
                searchObj.ej2_instances[0].value = '';
                eventArgs = { value: '', container: searchObj };
                searchObj.ej2_instances[0].input(eventArgs);
                done();
            }.bind(searchObj), 500);
        });
        it('Search file testing with filter type as startsWith', (done) => {
            feObj.searchSettings.filterType = 'startsWith';
            feObj.dataBind();
            let searchObj: any = feObj.element.querySelector("#file_search");
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
            setTimeout(function () {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
                feObj.searchSettings.allowSearchOnTyping = false;
                feObj.dataBind();
                searchObj.ej2_instances[0].value = 'doc';
                let eventArgs: any = { value: 'doc', container: searchObj };
                searchObj.ej2_instances[0].change(eventArgs);
                searchObj.ej2_instances[0].value = '';
                eventArgs = { value: '', container: searchObj };
                searchObj.ej2_instances[0].change(eventArgs);
                done();
            }.bind(searchObj), 500);
        });
        it('Search file testing with filter type as endsWith', (done) => {
            feObj.searchSettings.filterType = 'endsWith';
            feObj.dataBind();
            let searchObj: any = feObj.element.querySelector("#file_search");
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
            setTimeout(function () {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
                feObj.searchSettings.allowSearchOnTyping = false;
                feObj.dataBind();
                searchObj.ej2_instances[0].value = 'doc';
                let eventArgs: any = { value: 'doc', container: searchObj };
                searchObj.ej2_instances[0].change(eventArgs);
                searchObj.ej2_instances[0].value = '';
                eventArgs = { value: '', container: searchObj };
                searchObj.ej2_instances[0].change(eventArgs);
                done();
            }.bind(searchObj), 500);
        });
        it('enter multiple charcters in search textbox ', (done) => {
            feObj.searchSettings.filterType = 'startsWith';
            feObj.dataBind();
            let searchObj: any = feObj.element.querySelector("#file_search");
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
            setTimeout(function () {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
                feObj.searchSettings.allowSearchOnTyping = true;
                feObj.dataBind();
                searchObj.ej2_instances[0].value = 'doc';
                let event: any = { value: 'doc', container: searchObj };
                searchObj.ej2_instances[0].input(event);
                searchObj.ej2_instances[0].value = '';
                event = { value: '', container: searchObj };
                searchObj.ej2_instances[0].input(event);
                searchObj.ej2_instances[0].value = 'tes';
                event = { value: '', container: searchObj };
                searchObj.ej2_instances[0].input(event);
                done();
            }.bind(searchObj), 500);
        });
        it('clear search value when navigate the path', (done) => {
            feObj.searchSettings.filterType = 'startsWith';
            feObj.dataBind();
            let searchObj: any = feObj.element.querySelector("#file_search");
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
            setTimeout(function () {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
                feObj.searchSettings.allowSearchOnTyping = true;
                feObj.dataBind();
                searchObj.ej2_instances[0].value = 'doc';
                let event: any = { value: 'doc', container: searchObj };
                searchObj.ej2_instances[0].input(event);
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let li: any = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[1];
                mouseEventArgs.target = li.querySelector('.e-fullrow');
                tapEvent.tapCount = 1;
                treeObj.touchClickObj.tap(tapEvent);
                feObj.searchSettings.filterType = 'startsWith';
                feObj.dataBind();
                let searchObj1: any = feObj.element.querySelector("#file_search");
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
                setTimeout(function () {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
                    feObj.searchSettings.allowSearchOnTyping = true;
                    feObj.dataBind();
                    searchObj1.ej2_instances[0].value = '';
                    event = { value: '', container: searchObj };
                    searchObj1.ej2_instances[0].input(event);
                    expect(searchObj1.ej2_instances[0].value).toBe('');
                    done();
                }.bind(searchObj1), 500);
            }.bind(searchObj), 500);
        });
        it('Search file testing with clear icon', (done) => {
            feObj.searchSettings.filterType = 'startsWith';
            feObj.dataBind();
            let searchObj: any = feObj.element.querySelector("#file_search");
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
            setTimeout(function () {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
                feObj.searchSettings.allowSearchOnTyping = true;
                feObj.dataBind();
                searchObj.focus();
                searchObj.ej2_instances[0].value = 'doc';
                let event: any = { value: 'doc', container: searchObj };
                searchObj.ej2_instances[0].input(event);
                setTimeout(function () {
                    expect(searchObj.ej2_instances[0].value).toBe('doc');
                    var clear = searchObj.nextElementSibling;
                    clear.click();
                    setTimeout(function () {
                        var searchObj1: HTMLInputElement = <HTMLInputElement>feObj.breadCrumbBarNavigation.querySelector("#file_search");
                        expect(searchObj1.value).toBe("");
                        done();
                    }, 500);
                }, 500);
            }.bind(searchObj), 500);
        });
    });
});