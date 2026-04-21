/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement, Browser, EventHandler, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { toolbarItems, toolbarItems1, data1, data2, data3, data4, data5, data6, data7, data8, data9, data12, data14, UploadData, accessData1, accessDetails1, accessData2 } from '../data';
import { extend } from '@syncfusion/ej2-grids';
import { MenuOpenEventArgs, FileOpenEventArgs } from '../../../src';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control single selection Grid view', () => {
    describe('context menu testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: FileManager;
        let ele: HTMLElement;
        let i: number = 0;
        let originalTimeout: any;
        let type: string = "";
        let count: number = 0;
        function menuopened(eventArgs: MenuOpenEventArgs) {
            count++;
            type = eventArgs.menuType;
        }
        function addCustomItems(args: MenuOpenEventArgs) {
            for (var item = 0; item < args.items.length; item++) {
                if ((args.items[item].text == "Custom1") && (args.items[item].items.length === 0)) {
                    args.items[item].items = [{
                        text: 'Google',
                        iconCss: "e-fe-tick e-icons"
                    },
                    {
                        text: 'Gmail',
                    }];
                }
            }
            menuopened(args);
        }
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
                showThumbnail: false,
                fileOpen: (args: FileOpenEventArgs) => { i++ },
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
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
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
            i = 0;
            count = 0;
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
         });
         it('setmodel context menu testing', () => {
             feObj.contextMenuSettings.visible = false;
             feObj.dataBind();
             let el: any = document.getElementById(feObj.element.id + '_contextmenu');
             expect(el !== null).toBe(true);
             expect(isNullOrUndefined((feObj as FileManager).contextmenuModule)).toBe(true);
             feObj.contextMenuSettings.visible = true;
             feObj.dataBind();
             el = document.getElementById(feObj.element.id + '_contextmenu');
             expect(el !== null).toBe(true);
             expect(isNullOrUndefined((feObj as FileManager).contextmenuModule)).toBe(false);
         });
        // it('mouse click on refresh item', (done: Function) => {
        //     let ele: any = document.getElementById(feObj.element.id + '_contextmenu');
        //     let menuObj: any = ele.ej2_instances[0];
        //     feObj.detailsviewModule.gridObj.selectRows([1, 2]);
        //     document.getElementById('file_tree').querySelectorAll('li')[1].remove();
        //     document.getElementById('file_grid').querySelectorAll('.e-row')[0].remove();
        //     document.getElementsByClassName('e-addressbar-ul')[0].querySelector('li').remove();
        //     let li: any = document.getElementById('file_tree').querySelectorAll('li');
        //     let tr: any = document.getElementById('file_grid').querySelectorAll('.e-row');
        //     let ar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
        //     expect(li.length).toEqual(4);
        //     expect(tr.length).toEqual(4);
        //     expect(ar.length).toEqual(0);
        //     expect(tr[0].getAttribute('aria-selected')).toBe(null);
        //     expect(tr[0].querySelector('.e-frame')).toBe(null);
        //     expect(tr[1].getAttribute('aria-selected')).toEqual('true');
        //     expect(tr[1].querySelector('.e-frame')).toBe(null);
        //     let grid: Element =(<any> feObj.detailsviewModule.gridObj.contentModule).contentPanel.children[0];
        //     let evt = document.createEvent('MouseEvents');
        //     evt.initEvent('contextmenu', true, true);
        //     grid.dispatchEvent(evt);
        //     setTimeout(function () {
        //         menuObj.element.querySelector('.e-fe-refresh').click();
        //         this.request = jasmine.Ajax.requests.mostRecent();
        //         this.request.respondWith({
        //             status: 200,
        //             responseText: JSON.stringify(data1)
        //         });
        //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //         setTimeout(function () {
        //             let nli: any = document.getElementById('file_tree').querySelectorAll('li');
        //             let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-row');
        //             let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
        //             expect(nli.length).toEqual(5);
        //             expect(ntr.length).toEqual(5);
        //             expect(nar.length).toEqual(1);
        //             expect(ntr[1].getAttribute('aria-selected')).toBe(null);
        //             expect(ntr[1].querySelector('.e-frame')).toBe(null);
        //             expect(ntr[2].getAttribute('aria-selected')).toEqual('true');
        //             expect(ntr[2].querySelector('.e-frame')).toBe(null);
        //             done();
        //         }, 500);
        //     }, 100);
        // });
        it('folder context menu - menuType', () => {
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(count).toBe(1);
            expect(type).toBe('folder');
        })
        it('file context menu - menuType', () => {
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            feObj.detailsviewModule.gridObj.selectRows([4]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(4).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(count).toBe(1);
            expect(type).toBe('file');
        })
        it("Contextmenu - custom menu items in folder", () => {
            feObj.contextMenuSettings = {
                file: ['Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details', "Openinnewwindow", "OpeninVS", "|", "Giveaccessto"],
                folder: ['Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details', "Custom1", "Custom2", "Custom3"],
                layout: ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll', "Custom1", "Custom2", "Custom3"]
            };
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            let menuItems = document.querySelectorAll("#file_contextmenu .e-menu-item").length;
            expect(menuItems).toBe(10);
            expect(count).toBe(1);
            expect(type).toBe('folder');
        });
        it("Contextmenu - custom menu items in file", () => {
            feObj.contextMenuSettings = {
                file: ['Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details', "Openinnewwindow", "OpeninVS", "|", "Giveaccessto"],
                folder: ['Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details', "Custom1", "Custom2", "Custom3"],
                layout: ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll', "Custom1", "Custom2", "Custom3"]
            };
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            feObj.detailsviewModule.gridObj.selectRows([4]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(4).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            let menuItems = document.querySelectorAll("#file_contextmenu .e-menu-item").length;
            expect(menuItems).toBe(11);
            expect(count).toBe(1);
            expect(type).toBe('file');
        });
        it('treeView - contextmenu menuType', () => {
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            let li: Element = document.getElementById('file_tree').querySelectorAll('li')[2];
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            expect(count).toBe(1);
            expect(type).toBe('folder');
        })
        it('layout - contextmenu menuType', () => {
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            let li: any = document.querySelector('#file_grid .e-content');
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            expect(count).toBe(1);
            expect(type).toBe('layout');
        });
        it("Contextmenu - custom menu items in layout", () => {
            feObj.contextMenuSettings = {
                file: ['Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details', "Openinnewwindow", "OpeninVS", "|", "Giveaccessto"],
                folder: ['Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details', "Custom1", "Custom2", "Custom3"],
                layout: ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll', "Custom1", "Custom2", "Custom3"]
            };
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            let Li: Element = document.querySelector("#file_grid .e-content");
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            let menuItems = document.querySelectorAll("#file_contextmenu .e-menu-item").length;
            expect(menuItems).toBe(13);
            expect(count).toBe(1);
            expect(type).toBe('layout');
        });
    });
    describe('access control context menu testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        let originalTimeout: any;
        beforeEach((): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('mouse click on new folder button', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aGridLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                document.getElementById('file_grid').querySelector('.e-content').dispatchEvent(evt);
                document.getElementById('file_cm_newfolder').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                let treeLi1: any = treeObj.element.querySelectorAll('li');
                let gridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi1.length).toEqual(5);
                expect(gridLi1.length).toEqual(9);
                let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi1.length).toEqual(2);
                expect(aGridLi1.length).toEqual(4);
                expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi1[1].classList.contains('e-fe-hidden')).toBe(true);
                done();
            }, 500);
        });
        it('mouse click on upload button', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aGridLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                document.getElementById('file_grid').querySelector('.e-content').dispatchEvent(evt);
                let uploadMenuItem: HTMLElement = document.getElementById('file_cm_upload');
                if (uploadMenuItem) {
                    let hoverEvent = new MouseEvent('mouseover', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    uploadMenuItem.dispatchEvent(hoverEvent);
                    setTimeout(function () {
                        let folderSubMenu: HTMLElement = document.querySelector('#file_cm_fileupload');
                        if (folderSubMenu) {
                            folderSubMenu.click();
                        }
                        let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                        expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                        let treeLi1: any = treeObj.element.querySelectorAll('li');
                        let gridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                        expect(treeLi1.length).toEqual(5);
                        expect(gridLi1.length).toEqual(9);
                        let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                        let aGridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                        expect(aTreeLi1.length).toEqual(2);
                        expect(aGridLi1.length).toEqual(4);
                        expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                        expect(gridLi1[1].classList.contains('e-fe-hidden')).toBe(true);
                        done();
                    }, 500);
                }
            }, 500);
        });
        it('mouse click on refresh button', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aGridLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                document.getElementById('file_grid').querySelector('.e-content').dispatchEvent(evt);
                document.getElementById('file_cm_refresh').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessData1)
                });
                setTimeout(function () {
                    let treeLi1: any = treeObj.element.querySelectorAll('li');
                    let gridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    expect(treeLi1.length).toEqual(5);
                    expect(gridLi1.length).toEqual(9);
                    let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                    let aGridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                    expect(aTreeLi1.length).toEqual(2);
                    expect(aGridLi1.length).toEqual(4);
                    expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                    expect(gridLi1[1].classList.contains('e-fe-hidden')).toBe(true);
                    done();
                }, 500);
            }, 500);
        });
        it('mouse click on rename button', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aGridLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
                feObj.detailsviewModule.gridObj.selectRows([1]);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                select('.e-fe-grid-name',gridLi[1]).dispatchEvent(evt);
                document.getElementById('file_cm_rename').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                done();
            }, 500);
        });
        it('mouse click on delete button', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aGridLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
                feObj.detailsviewModule.gridObj.selectRows([1]);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                gridLi[1].dispatchEvent(evt);
                document.getElementById('file_cm_delete').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                let treeLi1: any = treeObj.element.querySelectorAll('li');
                let gridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi1.length).toEqual(5);
                expect(gridLi1.length).toEqual(9);
                let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi1.length).toEqual(2);
                expect(aGridLi1.length).toEqual(4);
                expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi1[1].classList.contains('e-fe-hidden')).toBe(true);
                done();
            }, 500);
        });
        it('mouse click on download button', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aGridLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
                feObj.detailsviewModule.gridObj.selectRows([1]);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                gridLi[1].dispatchEvent(evt);
                document.getElementById('file_cm_download').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                done();
            }, 500);
        });
        it('mouse click on details button', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aGridLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
                feObj.detailsviewModule.gridObj.selectRows([1]);
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                gridLi[1].dispatchEvent(evt);
                document.getElementById('file_cm_details').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessDetails1)
                });
                setTimeout(function () {
                    let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                    expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Downloads");
                    expect(dialogObj.element.querySelectorAll('td')[8].innerHTML).toEqual("Permission");
                    done();
                }, 500);
            }, 500);
        });
        it('mouse click on delete button with two items selected', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aGridLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
                feObj.detailsviewModule.gridObj.selectRows([0, 1]);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                gridLi[1].dispatchEvent(evt);
                document.getElementById('file_cm_delete').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                let treeLi1: any = treeObj.element.querySelectorAll('li');
                let gridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi1.length).toEqual(5);
                expect(gridLi1.length).toEqual(9);
                let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi1.length).toEqual(2);
                expect(aGridLi1.length).toEqual(4);
                expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi1[1].classList.contains('e-fe-hidden')).toBe(true);
                done();
            }, 500);
        });
        it('mouse click on download button with two items selected', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aGridLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
                feObj.detailsviewModule.gridObj.selectRows([0, 1]);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                gridLi[1].dispatchEvent(evt);
                document.getElementById('file_cm_download').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                done();
            }, 500);
        });
        it('mouse click on details button with two items selected', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aGridLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
                feObj.detailsviewModule.gridObj.selectRows([0, 1]);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                gridLi[1].dispatchEvent(evt);
                document.getElementById('file_cm_details').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessDetails1)
                });
                setTimeout(function () {
                    let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                    expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Downloads");
                    expect(dialogObj.element.querySelectorAll('td')[8].innerHTML).toEqual("Permission");
                    done();
                }, 500);
            }, 500);
        });
        it('mouse click on open button with non access folder/files', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aGridLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
                feObj.detailsviewModule.gridObj.selectRows([1]);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                gridLi[1].dispatchEvent(evt);
                document.getElementById('file_cm_open').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                dialogObj.element.querySelector('.e-primary').click();
                feObj.detailsviewModule.gridObj.selectRows([7]);
                let evt1 = document.createEvent('MouseEvents');
                evt1.initEvent('contextmenu', true, true);
                gridLi[7].dispatchEvent(evt1);
                document.getElementById('file_cm_open').click();
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                done();
            }, 500);
        });
        it('mouse click on open button with access folder/files', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aGridLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
                feObj.detailsviewModule.gridObj.selectRows([0]);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                gridLi[0].dispatchEvent(evt);
                document.getElementById('file_cm_open').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessData2)
                });
                setTimeout(function () {
                    let treeLi1: any = treeObj.element.querySelectorAll('li');
                    let gridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    expect(treeLi1.length).toEqual(7);
                    expect(gridLi1.length).toEqual(12);
                    let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                    let aGridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                    expect(aTreeLi1.length).toEqual(2);
                    expect(aGridLi1.length).toEqual(5);
                    expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(false);
                    expect(gridLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                    let evt1 = document.createEvent('MouseEvents');
                    evt1.initEvent('contextmenu', true, true);
                    gridLi1[2].dispatchEvent(evt1);
                    document.getElementById('file_cm_open').click();
                    let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                    expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                    dialogObj.element.querySelector('.e-primary').click();
                    feObj.detailsviewModule.gridObj.selectRows([7]);
                    let evt2 = document.createEvent('MouseEvents');
                    evt2.initEvent('contextmenu', true, true);
                    gridLi1[7].dispatchEvent(evt2);
                    document.getElementById('file_cm_open').click();
                    let dialogObj1: any = (document.getElementById("file_img_dialog") as any).ej2_instances[0];
                    expect(dialogObj1.element.querySelector('.e-dlg-header').innerHTML).toEqual("4.jpg");
                    done();
                }, 500);
            }, 500);
        });
    });
});
