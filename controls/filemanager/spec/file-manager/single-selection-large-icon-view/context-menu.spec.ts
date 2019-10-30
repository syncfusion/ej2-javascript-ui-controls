/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement, Browser, EventHandler, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { toolbarItems, toolbarItems1, data1, data2, data3, data4, data5, data6, data7, data8, data9, data12, data14, UploadData, data15, accessData1, accessDetails1, accessData2 } from '../data';
import { MenuOpenEventArgs } from '../../../src';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control single selection LargeIcons view', () => {
    describe('context menu testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: any;
        let ele: HTMLElement;
        let originalTimeout: any;
        let type: string = "";
        let count: number = 0;
        function menuopened(eventArgs: MenuOpenEventArgs) {
            count++;
            type = eventArgs.menuType;
        }
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
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
                showThumbnail: false
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
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                done();
            }, 500);
        });
        afterEach((): void => {
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
        // it('mouse click on refresh button', (done: Function) => {
        //     let ele: any = document.getElementById(feObj.element.id + '_contextmenu');
        //     let menuObj: any = ele.ej2_instances[0];
        //     let lgli: any = document.getElementById('file_largeicons').querySelectorAll('li');
        //     mouseEventArgs.target = lgli[1];
        //     feObj.largeiconsviewModule.clickObj.tap(tapEvent);
        //     mouseEventArgs.ctrlKey = true;
        //     mouseEventArgs.target = lgli[2];
        //     feObj.largeiconsviewModule.clickObj.tap(tapEvent);
        //     document.getElementById('file_tree').querySelectorAll('li')[1].remove();
        //     lgli[0].remove();
        //     document.getElementsByClassName('e-addressbar-ul')[0].querySelector('li').remove();
        //     let li: any = document.getElementById('file_tree').querySelectorAll('li');
        //     let tr: any = document.getElementById('file_largeicons').querySelectorAll('li');
        //     let ar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
        //     expect(li.length).toEqual(4);
        //     expect(tr.length).toEqual(4);
        //     expect(ar.length).toEqual(0);
        //     expect(tr[0].classList.contains('e-active')).toBe(false);
        //     expect(tr[0].querySelector('.e-frame')).toBe(null);
        //     expect(tr[1].classList.contains('e-active')).toBe(true);
        //     expect(tr[1].querySelector('.e-frame')).toBe(null);
        //     let largeWrap: Element = feObj.largeiconsviewModule.element.children[0];
        //     let evt = document.createEvent('MouseEvents');
        //     evt.initEvent('contextmenu', true, true);
        //     largeWrap.dispatchEvent(evt);
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
        //             let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
        //             let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
        //             expect(nli.length).toEqual(5);
        //             expect(ntr.length).toEqual(5);
        //             expect(nar.length).toEqual(1);
        //             expect(ntr[1].classList.contains('e-active')).toBe(false);
        //             expect(ntr[1].querySelector('.e-frame')).toBe(null);
        //             expect(ntr[2].classList.contains('e-active')).toBe(true);
        //             expect(ntr[2].querySelector('.e-frame')).toBe(null);
        //             done();
        //         }, 500);
        //     }, 100);
        // });
        it('folder context menu - menuType', () => {
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            var li = document.getElementById('file_largeicons').querySelectorAll('li');
            mouseEventArgs.target = li[0];
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            var evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            li[0].dispatchEvent(evt);
            expect(count).toBe(1);
            expect(type).toBe("folder");
        });
        it('file context menu - menuType', (done: Function) => {
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            document.getElementById('file_tb_refresh').click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let li_file: any = document.getElementById('file_largeicons').querySelectorAll('li');
                mouseEventArgs.target = li_file[4];
                tapEvent.tapCount = 1;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                li_file[4].dispatchEvent(evt);
                expect(count).toBe(1);
                expect(type).toBe("file");
                done();
            }, 500);
        });
        it('treeView - contextmenu menuType', () => {
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            var li = document.getElementById('file_tree').querySelectorAll('li');
            mouseEventArgs.target = li[0];
            var evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            li[0].dispatchEvent(evt);
            expect(count).toBe(1);
            expect(type).toBe('folder');
        })
        it('layout - contextmenu menuType', () => {
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            var layout = document.querySelector('#file_largeicons');
            mouseEventArgs.target = layout;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            var evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            layout.dispatchEvent(evt);
            expect(count).toBe(1);
            expect(type).toBe('layout');
        })
        it("Contextmenu - custom menu items in folder", () => {
            feObj.contextMenuSettings = {
                file: ['Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details', "Openinnewwindow", "OpeninVS", "|", "Giveaccessto"],
                folder: ['Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details', "Custom1", "Custom2", "Custom3"],
                layout: ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll', "Custom1", "Custom2", "Custom3"]
            };
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            var Li = document.querySelectorAll("#file_largeicons .e-large-icon")[2];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            var evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            var menuItems = document.querySelectorAll("#file_contextmenu .e-menu-item").length;
            expect(menuItems).toBe(10);
            expect(count).toBe(1);
            expect(type).toBe('folder');
        });
        it("Contextmenu - custom menu items in file", (done: Function) => {
            feObj.contextMenuSettings = {
                file: ['Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details', "Openinnewwindow", "OpeninVS", "|", "Giveaccessto"],
                folder: ['Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details', "Custom1", "Custom2", "Custom3"],
                layout: ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll', "Custom1", "Custom2", "Custom3"]
            };
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            document.getElementById('file_tb_refresh').click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let li_file: any = document.getElementById('file_largeicons').querySelectorAll('li');
                mouseEventArgs.target = li_file[4];
                tapEvent.tapCount = 1;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                li_file[4].dispatchEvent(evt);
                var menuItems = document.querySelectorAll("#file_contextmenu .e-menu-item").length;
                expect(menuItems).toBe(11);
                expect(count).toBe(1);
                expect(type).toBe("file");
                done();
            }, 500);
        });
        it("Contextmenu - custom menu items in layout", () => {
            feObj.contextMenuSettings = {
                file: ['Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details', "Openinnewwindow", "OpeninVS", "|", "Giveaccessto"],
                folder: ['Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details', "Custom1", "Custom2", "Custom3"],
                layout: ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll', "Custom1", "Custom2", "Custom3"]
            };
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            var layout = document.querySelector('#file_largeicons');
            mouseEventArgs.target = layout;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            var evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            layout.dispatchEvent(evt);
            var menuItems = document.querySelectorAll("#file_contextmenu .e-menu-item").length;
            expect(menuItems).toBe(13);
            expect(count).toBe(1);
            expect(type).toBe("layout");
        });
    });
    describe('access control context menu testing', () => {
        let feObj: any;
        let ele: HTMLElement;
        let originalTimeout: any;
        let mouseEventArgs: any, tapEvent: any;
        beforeEach((): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
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
        it('mouse click on new folder button', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                document.getElementById('file_largeicons').dispatchEvent(evt);
                document.getElementById('file_cm_newfolder').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                let treeLi1: any = treeObj.element.querySelectorAll('li');
                let largeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi1.length).toEqual(5);
                expect(largeLi1.length).toEqual(9);
                let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi1.length).toEqual(2);
                expect(aLargeLi1.length).toEqual(4);
                expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi1[1].classList.contains('e-fe-hidden')).toBe(true);
                done();
            }, 500);
        });
        it('mouse click on upload button', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                document.getElementById('file_largeicons').dispatchEvent(evt);
                document.getElementById('file_cm_upload').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                let treeLi1: any = treeObj.element.querySelectorAll('li');
                let largeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi1.length).toEqual(5);
                expect(largeLi1.length).toEqual(9);
                let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi1.length).toEqual(2);
                expect(aLargeLi1.length).toEqual(4);
                expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi1[1].classList.contains('e-fe-hidden')).toBe(true);
                done();
            }, 500);
        });
        it('mouse click on refresh button', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                document.getElementById('file_largeicons').dispatchEvent(evt);
                document.getElementById('file_cm_refresh').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessData1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let treeLi1: any = treeObj.element.querySelectorAll('li');
                    let largeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                    expect(treeLi1.length).toEqual(5);
                    expect(largeLi1.length).toEqual(9);
                    let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                    let aLargeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                    expect(aTreeLi1.length).toEqual(2);
                    expect(aLargeLi1.length).toEqual(4);
                    expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                    expect(largeLi1[1].classList.contains('e-fe-hidden')).toBe(true);
                    done();
                }, 500);
            }, 500);
        });
        it('mouse click on rename button', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[1];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[1].dispatchEvent(evt);
                document.getElementById('file_cm_rename').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                done();
            }, 500);
        });
        it('mouse click on delete button', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[1];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[1].dispatchEvent(evt);
                document.getElementById('file_cm_delete').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                let treeLi1: any = treeObj.element.querySelectorAll('li');
                let largeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi1.length).toEqual(5);
                expect(largeLi1.length).toEqual(9);
                let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi1.length).toEqual(2);
                expect(aLargeLi1.length).toEqual(4);
                expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi1[1].classList.contains('e-fe-hidden')).toBe(true);
                done();
            }, 500);
        });
        it('mouse click on download button', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[1];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[1].dispatchEvent(evt);
                document.getElementById('file_cm_download').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                done();
            }, 500);
        });
        it('mouse click on details button', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[1];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                largeLi[1].dispatchEvent(evt);
                document.getElementById('file_cm_details').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessDetails1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                view: 'LargeIcons',
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[0];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                mouseEventArgs.target = largeLi[1];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[1].dispatchEvent(evt);
                document.getElementById('file_cm_delete').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                let treeLi1: any = treeObj.element.querySelectorAll('li');
                let largeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi1.length).toEqual(5);
                expect(largeLi1.length).toEqual(9);
                let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi1.length).toEqual(2);
                expect(aLargeLi1.length).toEqual(4);
                expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi1[1].classList.contains('e-fe-hidden')).toBe(true);
                done();
            }, 500);
        });
        it('mouse click on download button with two items selected', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[0];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                mouseEventArgs.target = largeLi[1];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[1].dispatchEvent(evt);
                document.getElementById('file_cm_download').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                done();
            }, 500);
        });
        it('mouse click on details button with two items selected', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[0];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                mouseEventArgs.target = largeLi[1];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[1].dispatchEvent(evt);
                document.getElementById('file_cm_details').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessDetails1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                view: 'LargeIcons',
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[1];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[1].dispatchEvent(evt);
                document.getElementById('file_cm_open').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                dialogObj.element.querySelector('.e-primary').click();
                mouseEventArgs.target = largeLi[7];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt1 = document.createEvent('MouseEvents');
                evt1.initEvent('contextmenu', true, true);
                largeLi[7].dispatchEvent(evt1);
                document.getElementById('file_cm_open').click();
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                done();
            }, 500);
        });
        it('mouse click on open button with access folder/files', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[0];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[0].dispatchEvent(evt);
                document.getElementById('file_cm_open').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessData2)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let treeLi1: any = treeObj.element.querySelectorAll('li');
                    let largeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                    expect(treeLi1.length).toEqual(7);
                    expect(largeLi1.length).toEqual(12);
                    let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                    let aLargeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                    expect(aTreeLi1.length).toEqual(2);
                    expect(aLargeLi1.length).toEqual(5);
                    expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(false);
                    expect(largeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                    let evt1 = document.createEvent('MouseEvents');
                    evt1.initEvent('contextmenu', true, true);
                    largeLi1[2].dispatchEvent(evt1);
                    document.getElementById('file_cm_open').click();
                    let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                    expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                    dialogObj.element.querySelector('.e-primary').click();
                    mouseEventArgs.target = largeLi1[7];
                    feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                    let evt2 = document.createEvent('MouseEvents');
                    evt2.initEvent('contextmenu', true, true);
                    largeLi1[7].dispatchEvent(evt2);
                    document.getElementById('file_cm_open').click();
                    let dialogObj1: any = (document.getElementById("file_img_dialog") as any).ej2_instances[0];
                    expect(dialogObj1.element.querySelector('.e-dlg-header').innerHTML).toEqual("4.jpg");
                    done();
                }, 500);
            }, 500);
        });
    });
});
