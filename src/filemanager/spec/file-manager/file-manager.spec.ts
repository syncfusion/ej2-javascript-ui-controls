/**
 * FileManager spec document
 */
import { FileManager } from '../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../src/file-manager/layout/details-view';
import { Toolbar } from '../../src/file-manager/actions/toolbar';
import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { data1, data10, data11, stringData, accessData1, idData1 } from './data';
import { FailureEventArgs } from '../../src';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control', () => {
    describe('DOM element class based rendering', () => {
        let feObj: FileManager;
        let ele: HTMLElement;

        beforeEach((): void => {
            jasmine.Ajax.install();
            let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
            Browser.userAgent = Chromebrowser;
            feObj = undefined;
            ele = createElement('div', { className: 'file-manager-control' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
        });
        it('id testing for rendering without id', (done: Function) => {
            feObj = new FileManager({
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false
            });
            feObj.appendTo(document.querySelector('.file-manager-control') as HTMLElement);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                expect(document.getElementsByClassName('file-manager-control')[0].id != null).toEqual(true);
                done();
            }, 500);
        });
    });
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
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
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
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
        let originalTimeout: any;
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
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('resize testing', () => {
            (feObj as any).resizeHandler();
            expect(document.getElementById('file_tree').classList.contains('e-treeview')).toEqual(true);
        });
    });
    describe('Window', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        let container: HTMLElement;
        let originalTimeout: any;
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            container = createElement('div', { id: 'container' });
            document.body.appendChild(container);
            container.style.height = '400px';
            ele = createElement('div', { id: 'file' });
            container.appendChild(ele);
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                },
                showThumbnail: false,
                height: '100%'
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
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            container.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('resize Height testing', () => {
            container.style.height = '500px';
            (feObj as any).resizeHandler();
            expect(document.getElementById('file').querySelector('.e-layout-content').clientHeight).toEqual(455);
            (feObj as any).splitterResize();
            expect(document.getElementById('file').querySelector('.e-layout-content').clientHeight).toEqual(455);
        });
        it('resize Height setModel testing', () => {
            feObj.view = 'LargeIcons';
            feObj.dataBind();
            feObj.height = '50%';
            feObj.dataBind();
            (feObj as any).resizeHandler();
            expect(document.getElementById('file').querySelector('.e-layout-content').clientHeight).toEqual(155);
            (feObj as any).splitterResize();
            expect(document.getElementById('file').querySelector('.e-layout-content').clientHeight).toEqual(155);
        });
    });
    describe('Splitter layout and BreadCrumBar Modules testing', () => {
        let feObj: any;
        let mouseEventArgs: any, tapEvent: any;
        let ele: HTMLElement;
        let originalTimeout: any;
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
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('Splitter Module testing', () => {
            expect(feObj.element.querySelector('.e-layout').classList.contains('e-splitter')).toEqual(true);
            expect(feObj.element.querySelector('.e-navigation').classList.contains('e-pane')).toEqual(true);
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
            expect(litext === "FileContent").toEqual(true);
            expect(liId === "/").toEqual(true);
            var treeObj: any = (feObj.element.querySelector('.e-treeview') as any).ej2_instances[0];
            let li: Element[] = treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[1].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data10)
            });
            setTimeout(function () {
                let treeNodeId: string = li[1].getAttribute("data-uid");
                let addressBarLi: any = feObj.element.querySelectorAll('.e-splitter .e-pane .e-address li');
                expect('/Documents/' === addressBarLi[1].getAttribute("data-utext")).toEqual(true);
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
            setTimeout(function () {
                var addressBarLi = feObj.element.querySelectorAll('.e-splitter .e-pane .e-address li');
                addressBarLi[0].querySelector('a').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data10)
                });
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
        let originalTimeout: any;
        beforeEach((): void => {
            jasmine.Ajax.install();
            let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
            Browser.userAgent = Chromebrowser;
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
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
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
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
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
    describe('Id based support for Large icons view', () => {
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
        it('initial testing', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
                responseText: JSON.stringify(idData1)
            });
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                let addressLi: any = document.getElementById('file_breadcrumbbar').querySelectorAll('.e-address-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(6);
                expect(largeLi.length).toEqual(5);
                expect(addressLi.length).toEqual(1);
                expect(feObj.path).toBe('/');
                expect(addressLi[0].getAttribute('data-utext')).toBe('/');
                expect(addressLi[0].innerText).toBe('Files');
                expect((document.getElementById('file_search') as any).placeholder).toBe('Search Files');
                done();
            }, 500);
        });
    });
    describe('Id based support for details view', () => {
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
        it('initial testing', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
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
                responseText: JSON.stringify(idData1)
            });
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                let addressLi: any = document.getElementById('file_breadcrumbbar').querySelectorAll('.e-address-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(6);
                expect(gridLi.length).toEqual(5);
                expect(addressLi.length).toEqual(1);
                expect(feObj.path).toBe('/');
                expect(addressLi[0].getAttribute('data-utext')).toBe('/');
                expect(addressLi[0].innerText).toBe('Files');
                expect((document.getElementById('file_search') as any).placeholder).toBe('Search Files');
                done();
            }, 500);
        });
    });
    describe('Search Settings', () => {
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
        it('Placeholder property testing', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                searchSettings: { placeholder: "Search Files"}
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(idData1)
            });
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                let addressLi: any = document.getElementById('file_breadcrumbbar').querySelectorAll('.e-address-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(6);
                expect(gridLi.length).toEqual(5);
                expect(addressLi.length).toEqual(1);
                expect(feObj.path).toBe('/');
                expect(addressLi[0].getAttribute('data-utext')).toBe('/');
                expect(addressLi[0].innerText).toBe('Files');
                expect((document.getElementById('file_search') as any).placeholder).toBe('Search Files');
                done();
            }, 500);
        });
        it('Placeholder property new data testing', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                searchSettings: { placeholder: "Search More Files"}
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(idData1)
            });
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                let addressLi: any = document.getElementById('file_breadcrumbbar').querySelectorAll('.e-address-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(6);
                expect(gridLi.length).toEqual(5);
                expect(addressLi.length).toEqual(1);
                expect(feObj.path).toBe('/');
                expect(addressLi[0].getAttribute('data-utext')).toBe('/');
                expect(addressLi[0].innerText).toBe('Files');
                expect((document.getElementById('file_search') as any).placeholder).toBe('Search More Files');
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
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
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
    describe('worst case response Testing', () => {
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
        it('Null response', (done: Function) => {
            let flag: boolean = false;
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                failure: (args: FailureEventArgs) => {
                    expect((<any>args.error).code).toEqual('406');
                    flag = false;
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: null
            });
            setTimeout(function () {
                expect(document.getElementById('file_dialog').classList.contains('e-popup-open')).toBe(true);
                expect(document.getElementById('file_dialog').querySelector('.e-dlg-header').textContent).toEqual("Error");
                done();
            }, 500);
        });
    });
    describe('Null or undefined value testing', () => {
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
        it("ajaxSettings", () => {
            feObj = new FileManager({ ajaxSettings: {
                url: null,
                uploadUrl: null, downloadUrl: null, getImageUrl: null
            } });
            feObj.appendTo('#file');
            expect(feObj.ajaxSettings.url).toBe(null);
            expect(feObj.ajaxSettings.uploadUrl).toBe(null);
            expect(feObj.ajaxSettings.downloadUrl).toBe(null);
            expect(feObj.ajaxSettings.getImageUrl).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ ajaxSettings: {
                url: undefined,
                uploadUrl: undefined, downloadUrl: undefined, getImageUrl: undefined
            } });
            feObj.appendTo('#file');
            expect(feObj.ajaxSettings.url).toBe(null);
            expect(feObj.ajaxSettings.uploadUrl).toBe(null);
            expect(feObj.ajaxSettings.downloadUrl).toBe(null);
            expect(feObj.ajaxSettings.getImageUrl).toBe(null);
            feObj.destroy();
        });
        it("allowDragAndDrop", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                allowDragAndDrop: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.allowDragAndDrop).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            },allowDragAndDrop: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.allowDragAndDrop).toBe(false);
            feObj.destroy();
        });
        it("allowMultiSelection", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                allowMultiSelection: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.allowMultiSelection).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            },allowMultiSelection: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.allowMultiSelection).toBe(true);
            feObj.destroy();
        });
        it("showItemCheckBoxes", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showItemCheckBoxes: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.showItemCheckBoxes).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, showItemCheckBoxes: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.showItemCheckBoxes).toBe(true);
            feObj.destroy();
        });
        it("contextMenuSettings", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                contextMenuSettings: {
                    visible: null
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.contextMenuSettings.visible).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, contextMenuSettings: {
                visible: undefined
            } });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.contextMenuSettings.visible).toBe(true);
            feObj.destroy();
        });
        it("cssClass", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                cssClass: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.cssClass).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, cssClass: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.cssClass).toBe('');
            feObj.destroy();
        });
        it("detailsViewSettings", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                detailsViewSettings: {
                    columns: null,
                    columnResizing: null,
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.detailsViewSettings.columnResizing).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, detailsViewSettings: {
                columns: undefined,
                columnResizing: undefined,
            } });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.detailsViewSettings.columnResizing).toBe(true);
            feObj.destroy();
        });
        it("enableHtmlSanitizer", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                enableHtmlSanitizer: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.enableHtmlSanitizer).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, enableHtmlSanitizer: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.enableHtmlSanitizer).toBe(true);
            feObj.destroy();
        });
        it("enablePersistence", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                enablePersistence: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.enablePersistence).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, enablePersistence: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.enablePersistence).toBe(false);
            feObj.destroy();
        });
        it("enableVirtualization", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                enableVirtualization: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.enableVirtualization).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, enableVirtualization: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.enableVirtualization).toBe(false);
            feObj.destroy();
        });

        it("enableRtl", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                enableRtl: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.enableRtl).toBe(false);
            feObj.destroy();
            feObj = new FileManager({ ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            },enableRtl: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.enableRtl).toBe(false);
            feObj.destroy();
        });
        it("height", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                height: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.height).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, height: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.height).toBe('400px');
            feObj.destroy();
        });
        // view
        it("view", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                view: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.view).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, view: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.view).toBe('LargeIcons');
            feObj.destroy();
        });
        it("navigationPaneSettings", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                navigationPaneSettings: {
                    visible: null
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.navigationPaneSettings.visible).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, navigationPaneSettings: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.navigationPaneSettings.visible).toBe(true);
            feObj.destroy();
        });
        it("path", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                path: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.path).toBe('/');
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, path: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.path).toBe('/');
            feObj.destroy();
        });
        it("popupTarget", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                popupTarget: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.popupTarget).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, popupTarget: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.popupTarget).toBe(null);
            feObj.destroy();
        });
        it("searchSettings", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                searchSettings: {
                    allowSearchOnTyping: null
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.searchSettings.allowSearchOnTyping).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, searchSettings: {
                allowSearchOnTyping: undefined
            } });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.searchSettings.allowSearchOnTyping).toBe(true);
            feObj.destroy();
        });
        it("selectedItems", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                selectedItems: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.selectedItems.length).toBe(0);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, selectedItems: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.selectedItems.length).toBe(0);
            feObj.destroy();
        });
        it("showFileExtension", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showFileExtension: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.showFileExtension).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, showFileExtension: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.showFileExtension).toBe(true);
            feObj.destroy();
        });
        it("rootAliasName", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                rootAliasName: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.rootAliasName).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, rootAliasName: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.rootAliasName).toBe(null);
            feObj.destroy();
        });
        it("showHiddenItems", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showHiddenItems: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.showHiddenItems).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, showHiddenItems: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.showHiddenItems).toBe(false);
            feObj.destroy();
        });
        it("showThumbnail", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.showThumbnail).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, showThumbnail: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.showThumbnail).toBe(true);
            feObj.destroy();
        });
        it("sortOrder", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                sortOrder: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.sortOrder).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, sortOrder: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.sortOrder).toBe('Ascending');
            feObj.destroy();
        });
        it("sortBy", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                sortBy: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.sortBy).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, sortBy: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.sortBy).toBe('name');
            feObj.destroy();
        });
        // sortComparer
        it("sortComparer", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                sortComparer: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.sortComparer).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, sortComparer: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.sortComparer).toBe(null);
            feObj.destroy();
        });
        it("toolbarSettings", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                toolbarSettings: {
                    visible: null
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.toolbarSettings.visible).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, toolbarSettings: {
                visible: undefined
            } });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.toolbarSettings.visible).toBe(true);
            feObj.destroy();
        });
        it("uploadSettings", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                uploadSettings: {
                    autoUpload: null
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.uploadSettings.autoUpload).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, uploadSettings: {
                autoUpload: undefined
            } });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.uploadSettings.autoUpload).toBe(true);
            feObj.destroy();
        });
        it("width", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                width: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.width).toBe(null);
            feObj.destroy();
            feObj = new FileManager({ ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, width: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.width).toBe('100%');
            feObj.destroy();
        });
        it("toolbarItems", () => {
            feObj = new FileManager({ 
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                toolbarItems: null
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.toolbarItems.length).toBe(0);
            feObj.destroy();
            feObj = new FileManager({ ajaxSettings: {
                url: '/FileOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            }, toolbarItems: undefined });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.toolbarItems.length).toBe(0);
            feObj.destroy();
        });
    });
});