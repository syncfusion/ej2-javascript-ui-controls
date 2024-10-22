/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { BeforeSendEventArgs } from '../../../src';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control large icons view', () => {
    let flatData1: any = [
        {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T18:16:38.4384894+05:30",
            filterPath: "",
            hasChild: true,
            id: '0',
            isFile: false,
            name: "Files",
            parentId: null,
            size: 0,
            type: "",
        }, {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            filterId:"0/",
            hasChild: true,
            id: '1',
            isFile: false,
            name: "Documents",
            parentId: '0',
            size: 0,
            type: "",
        }, {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\Documents\\",
            filterId:"0/1/",
            hasChild: false,
            id: '7',
            isFile: false,
            name: "NewFolder",
            parentId: '1',
            size: 0,
            type: "",
        }, {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            filterId:"0/",
            hasChild: false,
            id: '2',
            isFile: false,
            name: "Downloads",
            parentId: '0',
            size: 0,
            type: "",
        },
        {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            filterId:"0/",
            hasChild: false,
            id: '3',
            isFile: false,
            name: "Base",
            parentId: '0',
            size: 0,
            type: "",
        },
        {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            filterId:"0/",
            hasChild: false,
            id: '4',
            isFile: true,
            name: "newfile.txt",
            parentId: '0',
            size: 0,
            type: ".txt",
        },
        {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            filterId:"0/",
            hasChild: false,
            id: '5',
            isFile: true,
            name: "textDocument.doc",
            parentId: '0',
            size: 0,
            type: ".doc",
            showHiddenItems: false
        },
        {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            filterId:"0/",
            hasChild: false,
            id: '6',
            isFile: true,
            name: "Adam.png",
            parentId: '0',
            size: 0,
            type: ".png",
            imgUrl: "https://ej2.syncfusion.com/demos/src/treeview/images/employees/7.png"
        }
    ];
    describe('with breadcrumb bar testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: FileManager;
        let ele: HTMLElement;
        let check: boolean = false;
        let dblclickevent: MouseEvent;
        let originalTimeout: any;
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                fileSystemData: flatData1,
                showThumbnail: false,
                searchSettings: { allowSearchOnTyping: false },
                beforeSend: (args: BeforeSendEventArgs) => {
                    if (check) {
                        let obj: any = JSON.parse((<any>args.ajaxSettings).data);
                        expect(obj.data[0].name === 'Files').toBe(true);
                    }
                }
            });
            feObj.appendTo('#file');
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
            dblclickevent = new MouseEvent('dblclick', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
        });
        afterEach((): void => {
            check = false;
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('breadCrumb navigation data testing', (done: Function) => {
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            setTimeout(function () {
                check = true;
                (<HTMLElement>document.getElementsByClassName('e-addressbar-ul')[0].firstElementChild.firstElementChild).click();
                done();
            }, 500);
        });
        it('Search sort testing (navigate)', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(4);
            expect(largeLi.length).toEqual(6);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = '.png';
            searchObj.value = '.png';
            let eventArgs: any = { value: '.png', container: searchEle };
            searchObj.change(eventArgs);
            setTimeout(function () {
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(largeLi.length).toEqual(1);
                let li: any = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li");
                mouseEventArgs.target = li[3].querySelector('.e-fullrow');
                (<any>feObj.navigationpaneModule.treeObj).touchClickObj.tap(tapEvent);
                setTimeout(function () {
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    expect(largeLi.length).toEqual(0);
                    done();
                }, 500);
            }, 500);
        });
        it('Search sort testing (layout change && clear search)', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(4);
            expect(largeLi.length).toEqual(6);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = '.png';
            searchObj.value = '.png';
            let eventArgs: any = { value: '.png', container: searchEle };
            searchObj.change(eventArgs);
            setTimeout(function () {
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(largeLi.length).toEqual(1);
                feObj.view = "Details";
                feObj.dataBind();
                setTimeout(function () {
                    let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                    expect(treeLi.length).toEqual(4);
                    expect(gridLi.length).toEqual(1);
                    searchEle.value = '';
                    searchObj.value = '';
                    let eventArgs: any = { value: '', container: searchEle };
                    searchObj.change(eventArgs);
                    setTimeout(function () {
                        let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                        let treeLi: any = treeObj.element.querySelectorAll('li');
                        let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                        expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                        expect(treeLi.length).toEqual(4);
                        expect(gridLi.length).toEqual(6);
                        expect(feObj.sortBy).toBe('name');
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
        it('Search (empty) testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(4);
            expect(largeLi.length).toEqual(6);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = '.png';
            searchObj.value = '.png';
            let eventArgs: any = { value: '.png', container: searchEle };
            searchObj.change(eventArgs);
            setTimeout(function () {
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(largeLi.length).toEqual(1);
                searchEle.value = 'hello.png';
                searchObj.value = 'hello.png';
                eventArgs = { value: 'hello.png', container: searchEle };
                searchObj.change(eventArgs);
                setTimeout(function () {
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    expect(largeLi.length).toEqual(0);
                    done();
                }, 500);
            }, 500);
        });
        it('Search (empty) refresh testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(4);
            expect(largeLi.length).toEqual(6);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'hello.png';
            searchObj.value = 'hello.png';
            let eventArgs: any = { value: 'hello.png', container: searchEle };
            searchObj.change(eventArgs);
            setTimeout(function () {
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(largeLi.length).toEqual(0);
                let items: any = document.getElementsByClassName('e-fe-refresh');
                items[0].click();
                setTimeout(function () {
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    expect(largeLi.length).toEqual(6);
                    done();
                }, 500);
            }, 500);
        });
        it('Search setting setmodel testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(4);
            expect(largeLi.length).toEqual(6);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.change(eventArgs);
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(4);
                expect(largeLi.length).toEqual(2);
                feObj.searchSettings.allowSearchOnTyping = true;
                feObj.dataBind();
                feObj.searchSettings.allowSearchOnTyping = false;
                feObj.dataBind();
                feObj.searchSettings.filterType = 'endsWith';
                feObj.dataBind();
                setTimeout(function () {
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                    expect(treeLi.length).toEqual(4);
                    expect(largeLi.length).toEqual(1);
                    feObj.searchSettings.filterType = 'startsWith';
                    feObj.dataBind();
                    setTimeout(function () {
                        let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                        let treeLi: any = treeObj.element.querySelectorAll('li');
                        let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                        expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                        expect(treeLi.length).toEqual(4);
                        expect(largeLi.length).toEqual(0);
                        feObj.searchSettings.ignoreCase = false;
                        feObj.dataBind();
                        setTimeout(function () {
                            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                            let treeLi: any = treeObj.element.querySelectorAll('li');
                            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                            expect(treeLi.length).toEqual(4);
                            expect(largeLi.length).toEqual(1);
                            done();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });

        it('Search file refresh testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(4);
            expect(largeLi.length).toEqual(6);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.change(eventArgs);
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(4);
                expect(largeLi.length).toEqual(2);
                let items: any = document.getElementsByClassName('e-fe-refresh');
                items[0].click();
                setTimeout(function () {
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                    expect(treeLi.length).toEqual(4);
                    expect(largeLi.length).toEqual(6);
                    done();
                }, 500);
            }, 500);
        });
        it('Search file testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(4);
            expect(largeLi.length).toEqual(6);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.change(eventArgs);
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(4);
                expect(largeLi.length).toEqual(2);
                searchEle.value = '';
                searchObj.value = '';
                eventArgs = { value: '', container: searchEle };
                searchObj.change(eventArgs);
                setTimeout(function () {
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                    expect(treeLi.length).toEqual(4);
                    expect(largeLi.length).toEqual(6);
                    done();
                }, 500);
            }, 500);
        });

        it('Search file and layout change testing', function (done) {
            var treeObj = (document.getElementById("file_tree") as any).ej2_instances[0];
            var treeLi = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(4);
            expect(largeLi.length).toEqual(6);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            var eventArgs = { value: 'doc', container: searchEle };
            searchObj.change(eventArgs);
            setTimeout(function () {
                let largeObj: any = (document.getElementById("file") as any).ej2_instances[0];
                var treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(4);
                expect(largeLi.length).toEqual(2);
                mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[0];
                tapEvent.tapCount = 1;
                (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
                largeObj.view = "Details";
                largeObj.dataBind();
                setTimeout(function () {
                    let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                    expect(treeLi.length).toEqual(4);
                    expect(gridLi.length).toEqual(2);
                    done();
                }, 500);
            }, 500);
        });

        it('Search folder navigation', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(4);
            expect(largeLi.length).toEqual(6);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            expect(searchEle.placeholder).toBe("Search Files");
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.change(eventArgs);
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(4);
                expect(largeLi.length).toEqual(2);
                mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[0];
                tapEvent.tapCount = 2;
                (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
                setTimeout(function () {
                    expect(searchEle.placeholder).toBe("Search Documents");
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree_0");
                    expect(treeLi.length).toEqual(5);
                    expect(largeLi.length).toEqual(1);
                    done();
                }, 500);
            }, 500);
        });

        it('Search folder nested navigation', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(4);
            expect(largeLi.length).toEqual(6);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            expect(searchEle.placeholder).toBe("Search Files");
            searchEle.value = 'new';
            searchObj.value = 'new';
            let eventArgs: any = { value: 'new', container: searchEle };
            searchObj.change(eventArgs);
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(4);
                expect(largeLi.length).toEqual(2);
                mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[0];
                tapEvent.tapCount = 2;
                (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
                setTimeout(function () {
                    expect(searchEle.placeholder).toBe("Search New folder");
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree_0_0");
                    expect(treeLi.length).toEqual(5);
                    expect(largeLi.length).toEqual(0);
                    done();
                }, 500);
            }, 500);
        });

        it('Search folder navigation in root directory', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(4);
            expect(largeLi.length).toEqual(6);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            expect(searchEle.placeholder).toBe("Search Files");
            searchEle.value = 'Documents';
            searchObj.value = 'Documents';
            let eventArgs: any = { value: 'Documents', container: searchEle };
            searchObj.change(eventArgs);
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(4);
                expect(largeLi.length).toEqual(1);
                mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[0];
                tapEvent.tapCount = 2;
                (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
                setTimeout(function () {
                    expect(searchEle.placeholder).toBe("Search Documents");
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree_0");
                    expect(treeLi.length).toEqual(5);
                    expect(largeLi.length).toEqual(1);
                    done();
                }, 500);
            }, 500);
        });
        it('Search folder get info operation', (done: Function) => {
            let ele: any = document.getElementById(feObj.element.id + '_contextmenu');
            let menuObj: any = ele.ej2_instances[0];
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(4);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.change(eventArgs);
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(4);
                expect(largeLi.length).toEqual(2);
                mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[0];
                tapEvent.tapCount = 1;
                (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[0].dispatchEvent(evt);
                setTimeout(function () {
                    menuObj.element.querySelector('.e-fe-details').click();
                    done();
                }, 100);
            }, 500);
        });
        it('Search folder rename operation', (done: Function) => {
            let ele: any = document.getElementById(feObj.element.id + '_contextmenu');
            let menuObj: any = ele.ej2_instances[0];
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(4);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.change(eventArgs);
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(4);
                expect(largeLi.length).toEqual(2);
                expect(largeLi[0].querySelector(".e-list-text").textContent).toBe('Documents');
                mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[0];
                tapEvent.tapCount = 1;
                (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[0].dispatchEvent(evt);
                setTimeout(function () {
                    menuObj.element.querySelector('.e-fe-rename').click();
                    setTimeout(function () {
                        let inputValue: any = document.getElementById('file_dialog').querySelector('#rename');
                        expect((inputValue as any).value).toEqual("Documents");
                        inputValue.value = 'docs1';
                        (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                        setTimeout(function () {
                            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                            let treeLi: any = treeObj.element.querySelectorAll('li');
                            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                            expect(treeLi.length).toEqual(4);
                            expect(largeLi.length).toEqual(6);
                            expect(largeLi[1].querySelector(".e-list-text").textContent).toBe('docs1');
                            done();
                        }, 500);
                    }, 100);
                }, 100);
            }, 500);
        });
        it('Search folder download operation', (done: Function) => {
            let ele: any = document.getElementById(feObj.element.id + '_contextmenu');
            let menuObj: any = ele.ej2_instances[0];
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(4);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.change(eventArgs);
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(4);
                expect(largeLi.length).toEqual(2);
                mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[0];
                tapEvent.tapCount = 1;
                (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[0].dispatchEvent(evt);
                this.request = jasmine.Ajax.requests.mostRecent();
                setTimeout(function () {
                    done();
                }, 100);
            }, 500);
        });
        it('allowSearchOnTyping false testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(4);
            feObj.searchSettings.allowSearchOnTyping = false;
            feObj.dataBind();
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.change(eventArgs);
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(4);
                expect(largeLi.length).toEqual(2);
                searchEle.value = '';
                searchObj.value = '';
                eventArgs = { value: '', container: searchEle };
                searchObj.change(eventArgs);
                setTimeout(function () {
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                    expect(treeLi.length).toEqual(4);
                    done();
                }, 500);
            }, 500);
        });
        it('allowSearchOnTyping true testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(4);
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
                setTimeout(function () {
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                    expect(treeLi.length).toEqual(4);
                    expect(largeLi.length).toEqual(2);
                    done();
                }, 500);
            }, 400);
        });
        it('Search folder delete operation', (done: Function) => {
            let ele: any = document.getElementById(feObj.element.id + '_contextmenu');
            let menuObj: any = ele.ej2_instances[0];
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(4);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.change(eventArgs);
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(4);
                expect(largeLi.length).toEqual(2);
                expect(largeLi[0].querySelector(".e-list-text").textContent).toBe('docs1');
                mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[0];
                tapEvent.tapCount = 1;
                (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[0].dispatchEvent(evt);
                setTimeout(function () {
                    menuObj.element.querySelector('.e-fe-delete').click();
                    setTimeout(function () {
                        (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                        setTimeout(function () {
                            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                            let treeLi: any = treeObj.element.querySelectorAll('li');
                            let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('li');
                            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                            expect(treeLi.length).toEqual(3);
                            done();
                        }, 500);
                    }, 100);
                }, 100);
            }, 500);
        });
        it('Search file testing with filter type as startsWith', (done) => {
            feObj.searchSettings.filterType = 'startsWith';
            feObj.dataBind();
            let searchObj: any = feObj.element.querySelector("#file_search");
            setTimeout(function () {
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
            setTimeout(function () {
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
            setTimeout(function () {
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
            setTimeout(function () {
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
            setTimeout(function () {
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
            setTimeout(function () {
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
                setTimeout(function () {
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
            setTimeout(function () {
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
