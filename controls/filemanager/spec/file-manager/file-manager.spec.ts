/**
 * FileManager spec document
 */
import { FileManager } from '../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../src/file-manager/layout/details-view';
import { Toolbar } from '../../src/file-manager/actions/toolbar';
import { createElement, Browser, Instance, isNullOrUndefined } from '@syncfusion/ej2-base';
import { toolbarItems, toolbarItems1, data1, data2, data3, data10, data11, stringData, accessData1 } from './data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control', () => {
    describe('DOM element', () => {

        let feObj: FileManager;
        let ele: HTMLElement;

        beforeEach((): void => {
            jasmine.Ajax.install();
            let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
            Browser.userAgent = Chromebrowser;
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
        });
        it('with base class testing', (done: Function) => {
            feObj = new FileManager({
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
            setTimeout(function () {
                expect(document.getElementById('file').classList.contains('e-control')).toEqual(true);
                expect(document.getElementById('file').classList.contains('e-filemanager')).toEqual(true);
                expect(document.getElementById('file_tree').classList.contains('e-treeview')).toEqual(true);
                expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(true);
                done();
            }, 500);
        });
    });
    describe('Default value', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                ajaxSettings: {
                    url: '/FileOperations',
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                done();
            }, 500);
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
        });
        it('of properties testing', () => {
            expect(feObj.cssClass).toEqual('');
            expect(feObj.element.classList.contains('custom')).toEqual(false);
            expect(feObj.height).toEqual('400px');
            expect(feObj.element.style.height).toEqual('400px');
            expect(feObj.width).toEqual('100%');
            expect(feObj.element.style.width).toEqual('100%');
            expect(feObj.toolbarSettings.visible).toEqual(true);
            expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(true);
            // expect(feObj.toolbarSettings.items).toEqual(toolbarItems);
            // expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(toolbarItems.length);
            // expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(14);
            expect(feObj.showThumbnail).toEqual(true);
        });
    });
    describe('Tileview layout', () => {
        let feObj: FileManager;
        let mouseEventArgs: any, tapEvent: any;
        let ele: HTMLElement;
        let originalTimeout: any;
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
            feObj = undefined;
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
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                },
                showThumbnail: false,
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data10)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                done();
            }, 500);
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('Using public api', () => {
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li.length).toBe(5);
            expect(li[0].textContent).toBe('Documents');
            expect(li[4].textContent).toBe('1.png');
        });
        it('Selecting new folder', (done: Function) => {
            var treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
            mouseEventArgs.target = li[1].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data11)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_largeicons').querySelectorAll('li');
                expect(li.length).toBe(5);
                expect(li[1].textContent).toBe('music.mp3');
                done();
            }, 500);
        });
    });
    describe('Grid layout', () => {
        let feObj: FileManager;
        let mouseEventArgs: any, tapEvent: any;
        let ele: HTMLElement;
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
            feObj = undefined;
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
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data10)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                done();
            }, 500);
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
        });
        it('Selecting file', (done: Function) => {
            var treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
            mouseEventArgs.target = li[1].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data11)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
            setTimeout(function () {
                let li1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_grid').querySelectorAll('.e-row');
                var gridObj: any = (document.getElementById("file_grid") as any).ej2_instances[0];
                gridObj.selectRow(0);
                setTimeout(function () {
                    let activeEle: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_grid').querySelectorAll('.e-active');
                    expect(activeEle.length).toBe(5);
                    done();
                }, 500);
            }, 500);
        });
        it('TreeView expand node', (done: Function) => {
            var treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
            mouseEventArgs.target = li[1].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            done();
        });
    });
    describe('Window', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                done();
            }, 500);
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
        });
        it('resize testing', () => {
            (feObj as any).resizeHandler();
            expect(document.getElementById('file_tree').classList.contains('e-treeview')).toEqual(true);
        });
    });
    describe('Splitter layout and BreadCrumBar Modules testing', () => {
        let feObj: any;
        let mouseEventArgs: any, tapEvent: any;
        let ele: HTMLElement;
        beforeEach((): void => {
            jasmine.Ajax.install();
            feObj = undefined;
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
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data10)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
        });
        it('Splitter Module testing', () => {
            expect(feObj.element.querySelector('.e-layout').classList.contains('e-splitter')).toEqual(true);
            expect(feObj.element.querySelector('.e-treeview').classList.contains('e-pane')).toEqual(true);
            expect(feObj.element.querySelector('#file_content').classList.contains('e-pane')).toEqual(true);
            expect(feObj.splitterObj.paneSettings.length).toEqual(2);
            expect(feObj.element.querySelector('.e-splitter .e-split-bar .e-resize-handler').style.display).toEqual('');
            expect(feObj.splitterObj.paneSettings[0].size).toEqual("25%");
            expect(feObj.splitterObj.paneSettings[1].size).toEqual("75%");
        });
        it('BreadCrumBar Module testing', (done: Function) => {
            expect(isNullOrUndefined(feObj.element.querySelector('.e-splitter .e-pane .e-address'))).toEqual(false);
            expect(isNullOrUndefined(feObj.element.querySelector('.e-splitter .e-pane .e-address li'))).toEqual(false);
            let litext: string = feObj.element.querySelector('.e-splitter .e-pane .e-address li').innerText;
            let liId: string = feObj.element.querySelector('.e-splitter .e-pane .e-address li').getAttribute("data-utext");
            expect(litext === liId.split("/")[0]).toEqual(true);
            var treeObj: any = (feObj.element.querySelector('.e-treeview') as any).ej2_instances[0];
            let li: Element[] = treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[1].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data10)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let treeNodeId: string = li[1].getAttribute("data-uid");
                let addressBarLi: any = feObj.element.querySelectorAll('.e-splitter .e-pane .e-address li');
                expect('FileContent/Documents/' === addressBarLi[1].getAttribute("data-utext")).toEqual(true);
                done();
            }, 500);
        });
        it('BreadCrumBar Click Operations testing', (done: Function) => {
            let addressBarLi: any = feObj.element.querySelectorAll('.e-splitter .e-pane .e-address li');
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
            var treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            mouseEventArgs.target = li[1].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data10)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                var addressBarLi = feObj.element.querySelectorAll('.e-splitter .e-pane .e-address li');
                addressBarLi[0].querySelector('a').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data10)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let addressBarLi: any = feObj.element.querySelectorAll('.e-splitter .e-pane .e-address li');
                    expect(treeObj.selectedNodes[0] === 'fe_tree').toEqual(true);
                    addressBarLi[0].click();
                    setTimeout(function () {
                        let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                        expect(treeObj.selectedNodes[0] === 'fe_tree').toEqual(true);
                        addressBarLi[0].parentElement.click();
                        setTimeout(function () {
                            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                            expect(treeObj.selectedNodes[0] === 'fe_tree').toEqual(true);
                            done();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });

        it('enter key pressed', function (done) {
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([0]);
                feObj.detailsviewModule.gridObj.dataBind();
                mouseEventArgs.target = document.querySelector('.e-address-list-item');
                mouseEventArgs.action = 'enter';
                feObj.breadcrumbbarModule.keyActionHandler(mouseEventArgs);
                setTimeout(function () {
                    let inputValue: any = document.getElementById('file_dialog').querySelector('#rename');
                    expect(document.querySelector('.e-address').textContent).toEqual("FileContent");
                    done();
                }, 500);
            }, 500);
        });
    });
    describe('Ajax response ', () => {

        let feObj: FileManager;
        let ele: HTMLElement;

        beforeEach((): void => {
            jasmine.Ajax.install();
            let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
            Browser.userAgent = Chromebrowser;
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
        });
        it('with JSON string type test case ', (done: Function) => {
            feObj = new FileManager({
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
                responseText: (stringData)
            });
            setTimeout(function () {
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: (stringData)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_largeicons').querySelectorAll('li');
                    let treeObj: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                    expect(document.getElementById('file').classList.contains('e-control')).toEqual(true);
                    expect(document.getElementById('file').classList.contains('e-filemanager')).toEqual(true);
                    expect(document.getElementById('file_tree').classList.contains('e-treeview')).toEqual(true);
                    expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(true);
                    expect(JSON.parse(stringData).files.length).toBe(li.length);
                    expect(JSON.parse(stringData).files.length).toBe(treeObj.length);
                    done();
                }, 500);
            }, 500);
        });
    });
    describe('Access control Large icons view', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        let originalTimeout: any;
        beforeEach((): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('initial testing', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-locked');
                let aLargeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-locked');
                expect(aTreeLi1.length).toEqual(4);
                expect(aLargeLi1.length).toEqual(6);
                expect(treeLi[2].classList.contains('e-fe-locked')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-locked')).toBe(true);
                done();
            }, 500);
        });
    });
    describe('Access control details view', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        let originalTimeout: any;
        beforeEach((): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('initial testing', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
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
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aGridLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
                let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-locked');
                let aGridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-locked');
                expect(aTreeLi1.length).toEqual(4);
                expect(aGridLi1.length).toEqual(6);
                expect(treeLi[2].classList.contains('e-fe-locked')).toBe(true);
                expect(gridLi[1].classList.contains('e-fe-locked')).toBe(true);
                done();
            }, 500);
        });
    });
    describe('Worst case testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement, demo: HTMLElement;
        let originalTimeout: any;
        beforeEach((): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            demo = createElement('div', { id: 'demo', className: 'e-active' });
            document.body.appendChild(demo);
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            demo.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('page having active class', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            feObj.dataBind();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(5);
                done();
            }, 500);
        });
    });
});