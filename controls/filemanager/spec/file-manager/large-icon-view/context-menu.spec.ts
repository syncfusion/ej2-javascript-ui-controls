/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement, Browser, EventHandler, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { toolbarItems, toolbarItems1, data1, data2, folderRename, dataSortbySize, singleSelectionDetails, rename, data3, data4, data5, dataDelete, data6, data7, data8, data9, data12, data14, UploadData, data15, data11, accessData1, accessDetails1, accessDetails2, accessData2, data18, accessSearchData, data14Rename, folderCopySuccess, folderCopyRead } from '../data';
import { FileOpenEventArgs } from '../../../src/file-manager/base/interface';
import { MenuOpenEventArgs, MenuClickEventArgs } from '../../../src';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control LargeIcons view', () => {
    describe('Navigation pane right click testing', () =>{
        let i: number = 0;
        let mouseEventArgs: any, tapEvent: any;
        let feObj: any;
        let ele: HTMLElement;
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
                fileOpen: (args: FileOpenEventArgs) => { i++ },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
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
                menuObj.dataBind();
                done();
            }, 500);
        });
        afterEach((): void => {
            i = 0;
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('Navigation pane right clik folder navigation testing', (done: Function) => {            
            let li: any = document.getElementById('file_tree').querySelectorAll('li');
            mouseEventArgs.originalEvent.target = li[1].querySelector('.e-fullrow');
            mouseEventArgs.originalEvent.which = 3;
            feObj.navigationpaneModule.treeObj.clickHandler(mouseEventArgs);
            feObj.navigationpaneModule.treeObj.dataBind();
            setTimeout(() => {
                expect(feObj.path).toBe('/');
                done();
            }, 500);
        });
        it('Navigation pane right clik folder navigation cancel testing', (done: Function) => {
            let restrict: any = true;
            feObj.fileOpen = function(args: FileOpenEventArgs){
                args.cancel = restrict;
            }
            let li = document.getElementById('file_tree').querySelectorAll('li');
            mouseEventArgs.originalEvent.target = li[1].querySelector('.e-fullrow');
            mouseEventArgs.originalEvent.which = 3;
            feObj.navigationpaneModule.treeObj.clickHandler(mouseEventArgs);
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            li[1].dispatchEvent(evt);
            feObj.contextmenuModule.contextMenu.dataBind();
            feObj.navigationpaneModule.treeObj.dataBind();
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let sourceElement: any = el.ej2_instances[0];
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
            expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
            expect(feObj.path).toBe('/');
            restrict = false;
            sourceElement.element.querySelectorAll('li')[0].click();
            setTimeout(() => {
                expect(feObj.path).toBe('/Documents/');
                done();
            }, 500);
        });
        it('Navigation pane right clik folder copy and paste testing', (done: Function) => {
            let treeObj = feObj.navigationpaneModule.treeObj;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
            setTimeout(function () {
                li = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.originalEvent.target = li[1].querySelector('.e-fullrow');
                mouseEventArgs.originalEvent.which = 3;
                feObj.navigationpaneModule.treeObj.clickHandler(mouseEventArgs);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                li[1].dispatchEvent(evt);
                feObj.contextmenuModule.contextMenu.dataBind();
                feObj.navigationpaneModule.treeObj.dataBind();
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let sourceElement: any = el.ej2_instances[0];
                expect(feObj.path).toBe('/');
                sourceElement.element.querySelectorAll('li')[3].click();
                mouseEventArgs.originalEvent.target = li[3].querySelector('.e-fullrow');
                mouseEventArgs.originalEvent.which = 3;
                feObj.navigationpaneModule.treeObj.clickHandler(mouseEventArgs);
                evt.initEvent('contextmenu', true, true);
                li[3].dispatchEvent(evt);
                feObj.contextmenuModule.contextMenu.dataBind();
                feObj.navigationpaneModule.treeObj.dataBind();
                expect(feObj.path).toBe('/');
                sourceElement.element.querySelectorAll('li')[4].click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(folderCopySuccess)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(folderCopyRead)
                });
                setTimeout(() => {
                    expect(feObj.path).toBe('/Food/');
                    done();
                }, 500);
            }, 500);
        });
    })
    describe('context menu testing', () => {
        let i: number = 0;
        let mouseEventArgs: any, tapEvent: any;
        let feObj: any;
        let ele: HTMLElement;
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
                fileOpen: (args: FileOpenEventArgs) => { i++ },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
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
                menuObj.dataBind();
                done();
            }, 500);
        });
        afterEach((): void => {
            i = 0;
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        // it('folder context menu open process testing', (done: Function) => {
        //     let el: any = document.getElementById(feObj.element.id + '_contextmenu');
        //     let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
        //     expect(li.length).toBe(5);
        //     mouseEventArgs.target = li[0];
        //     tapEvent.tapCount = 1;
        //     feObj.largeiconsviewModule.clickObj.tap(tapEvent);
        //     expect(li[0].textContent).toBe('Documents');
        //     let sourceElement: any = el.ej2_instances[0];
        //     let evt = document.createEvent('MouseEvents')
        //     evt.initEvent('contextmenu', true, true);
        //     li[0].dispatchEvent(evt);
        //     setTimeout(function () {
        //         sourceElement.element.querySelectorAll('li')[0].click();
        //         this.request = jasmine.Ajax.requests.mostRecent();
        //         this.request.respondWith({
        //             status: 200,
        //             responseText: JSON.stringify(data1)
        //         });
        //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
        //         setTimeout(function () {
        //             let li1: any = document.getElementById('file_largeicons').querySelectorAll('li');
        //             expect(li1.length).toBe(5);
        //             let li2: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
        //             expect((li2[0] as Element).classList.contains('e-active')).toBe(false);
        //             expect((li2[1] as Element).classList.contains('e-active')).toBe(true);
        //             expect((li2[1] as HTMLElement).innerText.trim()).toBe('Documents');
        //             done();
        //         }, 500);
        //     }, 500);
        // });

        it('folder context menu open process testing with (right and left click testing) mouse double click', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li.length).toBe(5);
            mouseEventArgs.target = li[0];
            mouseEventArgs.which = 3;
            tapEvent.tapCount = 2;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            expect(li[0].textContent).toBe('Documents');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li[0].dispatchEvent(evt);
            sourceElement.element.querySelectorAll('li')[0].click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                let li1: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(li1.length).toBe(5);
                let li2: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                expect((li2[0] as Element).classList.contains('e-active')).toBe(false);
                expect((li2[1] as Element).classList.contains('e-active')).toBe(true);
                expect((li2[1] as HTMLElement).innerText.trim()).toBe('Documents');
                done();
            }, 500);
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
        //     expect(tr[0].classList.contains('e-active')).toBe(true);
        //     expect(tr[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        //     expect(tr[1].classList.contains('e-active')).toBe(true);
        //     expect(tr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        //     let largeWrap: Element = feObj.largeiconsviewModule.element.children[0];
        //     let evt = document.createEvent('MouseEvents');
        //     evt.initEvent('contextmenu', true, true);
        //     largeWrap.dispatchEvent(evt);
        //     setTimeout(function () {
        //         // menuObj.element.querySelector('.e-fe-refresh').click();
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
        //             expect(ntr[1].classList.contains('e-active')).toBe(true);
        //             expect(ntr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        //             expect(ntr[2].classList.contains('e-active')).toBe(true);
        //             expect(ntr[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        //             done();
        //         }, 500);
        //     }, 100);
        // });

        it('non-image file context menu open process testing', (done) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li.length).toBe(5);
            mouseEventArgs.target = li[0];
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            expect(li[0].textContent).toBe('Documents');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li[0].dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
            expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
            sourceElement.element.querySelectorAll('li')[0].click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data11)
            });
            setTimeout(function () {
                li = document.getElementById('file_largeicons').querySelectorAll('li');
                mouseEventArgs.target = li[1];
                tapEvent.tapCount = 1;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                expect(li[1].textContent).toBe('music.mp3');
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                li[1].dispatchEvent(evt);
                expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
                expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
                sourceElement.element.querySelectorAll('li')[0].click();
                expect(i > 1).toBe(true);
                done();
            }, 500);
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
        it('folder context menu in tree view open item testing', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let Li: Element = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[2];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
            expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
        });
    });
    describe('for LargeIcons View context menu', () => {
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
        function addCustomItems(args: MenuOpenEventArgs) {
            for (var item = 0; item < args.items.length; item++) {
                if ((args.items[item].text == "Custom1") && (args.items[item].items.length === 0)) {
                    args.items[item].items = [{
                        text: 'Google',
                        iconCss: "e-fe-tick e-icons",
                        id: 'item1'
                    },
                    {
                        text: 'Gmail',
                        id: 'item2'
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
                responseText: JSON.stringify(data14)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
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
                menuObj.dataBind();
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
        it('upload process testing', (done) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons');
            mouseEventArgs.target = li;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            sourceElement.element.querySelectorAll('#file_cm_upload')[0].click();
            let fileObj: File = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" })
            let eventArgs: any = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            let uploadObj: any = document.querySelector('#' + feObj.element.id + '_upload');
            uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(UploadData)
            });
            setTimeout(function () {
                let li1: any = document.getElementById('file_largeicons').querySelectorAll('li')[0];
                mouseEventArgs.target = li1.querySelector(".e-text-content");
                done();
            }, 500);
        });
        it('folder context menu with open', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li.length).toBe(3);
            mouseEventArgs.target = li[0];
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            expect(li[0].textContent).toBe('Documents');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li[0].dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
            expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
            sourceElement.element.querySelectorAll('li')[0].click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                let li1: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(li1.length).toBe(5);
                expect(document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li')[1].textContent).toBe("Documents");
                let li2: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                expect((li2[0] as Element).classList.contains('e-active')).toBe(false);
                expect((li2[1] as Element).classList.contains('e-active')).toBe(true);
                expect((li2[1] as HTMLElement).innerText.trim()).toBe('Documents');
                done();
            }, 500);
        });

        it('folder context menu with delete', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li.length).toEqual(4);
            expect(ntr.length).toEqual(3);
            mouseEventArgs.target = ntr[0];
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            expect(ntr[0].textContent).toBe('Documents');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            ntr[0].dispatchEvent(evt);
            sourceElement.element.querySelectorAll('#file_cm_delete')[0].click();
            (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(dataDelete)
            });
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(4);
                expect(ntr.length).toEqual(4);
                done();
            }, 500);
        });
        it('folder context menu with rename', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li.length).toEqual(4);
            expect(ntr.length).toEqual(3);
            mouseEventArgs.target = ntr[0];
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            expect(ntr[0].textContent).toBe('Documents');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            ntr[0].dispatchEvent(evt);
            sourceElement.element.querySelectorAll('#file_cm_rename')[0].click();
            expect(ntr[0].textContent).toBe("Documents");
            (<HTMLInputElement>document.getElementById('rename')).value = "My Folder";
            (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(folderRename)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data14Rename)
            });
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(4);
                expect(ntr.length).toEqual(3);
                expect(nar.length).toEqual(1);
                expect(ntr[2].textContent).toBe("My Folder");
                expect(nli[1].textContent).toBe("My Folder");
                done();
            }, 500);
        });
        it('folder context menu with details', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li.length).toEqual(4);
            expect(ntr.length).toEqual(3);
            mouseEventArgs.target = ntr[0];
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            expect(ntr[0].textContent).toBe('Documents');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            ntr[0].dispatchEvent(evt);
            sourceElement.element.querySelectorAll('#file_cm_details')[0].click();
            expect(ntr[0].textContent).toBe("Documents");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(singleSelectionDetails)
            });
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(4);
                expect(ntr.length).toEqual(3);
                expect(nar.length).toEqual(1);
                expect(document.getElementById('file_dialog_title').textContent).toBe('Documents')
                expect(document.querySelectorAll('.e-fe-value').length).toBe(4)
                expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder')
                // expect((<any>document.querySelectorAll('.e-fe-value')[1]).textContent).toBe('0')
                expect((<any>document.querySelectorAll('.e-fe-value')[2]).textContent).toBe('/Documents')
                expect((<any>document.querySelectorAll('.e-fe-value')[3]).textContent).toBe('October 16, 2018 19:43:17')
                done();
            }, 500);
        });

        it('file context menu open process testing', (done) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li.length).toBe(3);
            mouseEventArgs.target = li[2];
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            expect(li[2].textContent).toBe('Food');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li[2].dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
            expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
            sourceElement.element.querySelectorAll('li')[0].click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data15)
            });
            setTimeout(function () {
                li = document.getElementById('file_largeicons').querySelectorAll('li');
                mouseEventArgs.target = li[0];
                tapEvent.tapCount = 1;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                expect(li[0].textContent).toBe('Bread.png');
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                li[0].dispatchEvent(evt);
                expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
                expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
                sourceElement.element.querySelectorAll('li')[0].click();
                done();
            }, 500);
        });

        it('layout context menu with details', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons');
            mouseEventArgs.target = li;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            sourceElement.element.querySelectorAll('#file_cm_details')[0].click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(singleSelectionDetails)
            });
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(4);
                expect(ntr.length).toEqual(3);
                expect(nar.length).toEqual(1);
                expect(document.getElementById('file_dialog_title').textContent).toBe('Documents')
                expect(document.querySelectorAll('.e-fe-value').length).toBe(4)
                expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder')
                // expect((<any>document.querySelectorAll('.e-fe-value')[1]).textContent).toBe('0')
                expect((<any>document.querySelectorAll('.e-fe-value')[2]).textContent).toBe('/Documents')
                expect((<any>document.querySelectorAll('.e-fe-value')[3]).textContent).toBe('October 16, 2018 19:43:17')
                done();
            }, 500);
        });
        it('layout context menu with new folder', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons');
            mouseEventArgs.target = li;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            let nli: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
            let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(nli.length).toEqual(4);
            expect(ntr.length).toEqual(3);
            expect(nar.length).toEqual(1);
            sourceElement.element.querySelectorAll('#file_cm_newfolder')[0].click();
            let items: any = document.getElementsByClassName('e-fe-newfolder');
            items[0].click();
            (<HTMLInputElement>document.getElementById('newname')).value = "New Folder";
            (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data5)
            });
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(6);
                expect(ntr.length).toEqual(6);
                expect(nar.length).toEqual(1);
                expect(ntr[1].classList.contains('e-active')).toBe(false);
                expect(ntr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
                expect(ntr[2].classList.contains('e-active')).toBe(false);
                expect(ntr[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
                done();
            }, 500);
        });
        it('layout context menu with refresh', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons');
            mouseEventArgs.target = li;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            let nli: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
            let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(nli.length).toEqual(4);
            expect(ntr.length).toEqual(3);
            expect(nar.length).toEqual(1);
            sourceElement.element.querySelectorAll('#file_cm_refresh')[0].click();
            let lgli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            mouseEventArgs.target = lgli[1];
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = lgli[2];
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            document.getElementById('file_tree').querySelectorAll('li')[1].remove();
            lgli[0].remove();
            document.getElementsByClassName('e-addressbar-ul')[0].querySelector('li').remove();
            li = document.getElementById('file_tree').querySelectorAll('li');
            let tr: any = document.getElementById('file_largeicons').querySelectorAll('li');
            let ar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(li.length).toEqual(3);
            expect(tr.length).toEqual(2);
            expect(ar.length).toEqual(0);
            expect(tr[0].classList.contains('e-active')).toBe(true);
            expect(tr[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(tr[1].classList.contains('e-active')).toBe(true);
            expect(tr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            let largeWrap: Element = feObj.largeiconsviewModule.element.children[0];
            evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            largeWrap.dispatchEvent(evt); sourceElement.element.querySelectorAll('#file_cm_refresh')[0].click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(5);
                expect(ntr.length).toEqual(5);
                expect(nar.length).toEqual(1);
                expect(ntr[1].classList.contains('e-active')).toBe(true);
                expect(ntr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
                expect(ntr[2].classList.contains('e-active')).toBe(true);
                expect(ntr[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
                done();
            }, 500);
        });
        it('layout context menu with selectAll', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons');
            mouseEventArgs.target = li;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            let nli: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
            let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(nli.length).toEqual(4);
            expect(ntr.length).toEqual(3);
            expect(nar.length).toEqual(1);
            sourceElement.element.querySelectorAll('#file_cm_selectall')[0].click();
            nli = document.getElementById('file_tree').querySelectorAll('li');
            ntr = document.getElementById('file_largeicons').querySelectorAll('li');
            nar = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(nli.length).toEqual(4);
            expect(ntr.length).toEqual(3);
            expect(nar.length).toEqual(1);
            // expect(ntr[0].classList.contains('e-active')).toBe(true);
            // expect(ntr[1].classList.contains('e-active')).toBe(true);
            // expect(ntr[2].classList.contains('e-active')).toBe(true);
            // expect(feObj.selectedItems.length).toBe(3);
        });

        it('layout context menu with view', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons');
            mouseEventArgs.target = li;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            let nli: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
            let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(nli.length).toEqual(4);
            expect(ntr.length).toEqual(3);
            expect(nar.length).toEqual(1);
            sourceElement.element.querySelectorAll('#file_cm_view')[0].click();
            mouseEventArgs.target = sourceElement.element.querySelectorAll('li')[1];
            mouseEventArgs.type = 'mouseover';
            feObj.contextmenuModule.contextMenu.moverHandler(mouseEventArgs);
            // expect(document.getElementById('file_grid').offsetWidth == 0).toEqual(true);
            expect(document.getElementById('file_largeicons').offsetWidth != 0).toEqual(true);
            expect(document.getElementById('file_grid').offsetHeight == 0).toEqual(true);
            expect(document.getElementById('file_largeicons').offsetHeight != 0).toEqual(true);
            (<any>document.querySelector('#file_cm_detailsview')).click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                expect(document.getElementById('file_grid').offsetWidth != 0).toEqual(true);
                expect(document.getElementById('file_largeicons').offsetWidth == 0).toEqual(true);
                expect(document.getElementById('file_grid').offsetHeight != 0).toEqual(true);
                expect(document.getElementById('file_largeicons').offsetHeight == 0).toEqual(true);
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(4);
                expect(ntr.length).toEqual(3);
                expect(nar.length).toEqual(1);
                done();
            }, 500);
        });
        it('layout context menu with sortby', (done: Function) => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
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
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(dataSortbySize)
            });
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons');
            mouseEventArgs.target = li;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            let nli: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
            let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(nli.length).toEqual(5);
            // expect(ntr.length).toEqual(3);
            expect(nar.length).toEqual(1);
            sourceElement.element.querySelectorAll('li')[0].click();
            mouseEventArgs.target = sourceElement.element.querySelectorAll('li')[0];
            mouseEventArgs.type = 'mouseover';
            feObj.contextmenuModule.contextMenu.moverHandler(mouseEventArgs);
            (<any>document.querySelector('#file_cm_size')).click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(dataSortbySize)
            });
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(5);
                // expect(ntr.length).toEqual(3);
                expect(nar.length).toEqual(1);
                expect(ntr[0].textContent).toBe("Food");
                expect(ntr[1].textContent).toBe("Nature");
                expect(ntr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
                expect(ntr[2].classList.contains('e-active')).toBe(false);
                expect(ntr[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
                done();
            }, 500);
        });
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

        it("Contextmenu items trimmed testing", () => {
            feObj.contextMenuSettings = {
                file: [' Open ', '|', ' Delete '],
                folder: ['Open ', '|', ' Delete '],
                layout: [' SortBy ', ' View ', ' Refresh ']
            };
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            let Li: Element = document.querySelectorAll("#file_largeicons .e-large-icon")[1];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(isNullOrUndefined(document.getElementById('file_cm_open'))).toBe(false);
            expect(isNullOrUndefined(document.getElementById('file_cm_delete'))).toBe(false);
            let nLi: Element = document.querySelectorAll("#file_largeicons")[0];
            let evts = document.createEvent('MouseEvents')
            evts.initEvent('contextmenu', true, true);
            nLi.dispatchEvent(evts);
            expect(isNullOrUndefined(document.getElementById('file_cm_sortby'))).toBe(false);
            expect(isNullOrUndefined(document.getElementById('file_cm_view'))).toBe(false);
            expect(isNullOrUndefined(document.getElementById('file_cm_refresh'))).toBe(false);
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
        it("layout Contextmenu - custom menu items - testing submenu", () => {
            let click: boolean = false;
            feObj.menuOpen = addCustomItems;
            feObj.menuClick = function () { click = true; }
            feObj.contextMenuSettings = {
                file: ['Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details', "Openinnewwindow", "OpeninVS", "|", "Giveaccessto"],
                folder: ['Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details', "Custom1", "Custom2", "Custom3"],
                layout: ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll', "Custom1", "Custom2", "Custom3"]
            };
            feObj.dataBind();
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let sourceElement: any = el.ej2_instances[0];
            let Li: Element = document.querySelector('#file_largeicons');
            let evt = document.createEvent('MouseEvents')
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(count).toBe(1);
            let menuItems = document.querySelectorAll("#file_contextmenu .e-menu-item").length;
            expect(menuItems).toBe(13);
            let menuItem: HTMLElement = <HTMLElement>document.querySelectorAll("#file_contextmenu .e-menu-item")[10];
            mouseEventArgs.target = menuItem;
            mouseEventArgs.type = 'mouseover';
            sourceElement.moverHandler(mouseEventArgs);
            document.getElementById('item1').click();
            expect(click).toBe(true);
            expect(count).toBe(2);
            expect(type).toBe('layout');
        });
        it("file Contextmenu - custom menu items - testing submenu", (done) => {
            let click: boolean = false;
            feObj.menuOpen = addCustomItems;
            feObj.menuClick = function () { click = true; }
            feObj.contextMenuSettings = {
                file: ["Custom1", 'Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details', "Openinnewwindow", "OpeninVS", "|", "Giveaccessto"],
                folder: ["Custom1", 'Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details', "Custom4", "Custom2", "Custom3"],
                layout: ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll', "Custom1", "Custom2", "Custom3"]
            };
            feObj.dataBind();
            document.getElementById('file_tb_refresh').click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let sourceElement: any = el.ej2_instances[0];
                let Li: Element = document.getElementById('file_largeicons').querySelectorAll('li')[4];
                let evt = document.createEvent('MouseEvents');
                mouseEventArgs.target = Li;
                tapEvent.tapCount = 1;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                expect(count).toBe(1);
                let menuItems = document.querySelectorAll("#file_contextmenu .e-menu-item").length;
                expect(menuItems).toBe(12);
                let menuItem: HTMLElement = <HTMLElement>document.querySelectorAll("#file_contextmenu .e-menu-item")[0];
                mouseEventArgs.target = menuItem;
                mouseEventArgs.type = 'mouseover';
                sourceElement.moverHandler(mouseEventArgs);
                document.getElementById('item1').click();
                expect(click).toBe(true);
                expect(count).toBe(2);
                expect(type).toBe('file');
                done();
            }, 500);
        });
        it("folder Contextmenu - custom menu items - testing submenu", () => {
            let click: boolean = false;
            feObj.menuOpen = addCustomItems;
            feObj.menuClick = function () { click = true; }
            feObj.contextMenuSettings = {
                file: ["Custom1", 'Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details', "Openinnewwindow", "OpeninVS", "|", "Giveaccessto"],
                folder: ["Custom1", 'Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details', "Custom4", "Custom2", "Custom3"],
                layout: ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll', "Custom1", "Custom2", "Custom3"]
            };
            feObj.dataBind();
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let sourceElement: any = el.ej2_instances[0];
            let Li: Element = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            let evt = document.createEvent('MouseEvents');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(count).toBe(1);
            let menuItems = document.querySelectorAll("#file_contextmenu .e-menu-item").length;
            expect(menuItems).toBe(11);
            let menuItem: HTMLElement = <HTMLElement>document.querySelectorAll("#file_contextmenu .e-menu-item")[0];
            mouseEventArgs.target = menuItem;
            mouseEventArgs.type = 'mouseover';
            sourceElement.moverHandler(mouseEventArgs);
            document.getElementById('item1').click();
            expect(click).toBe(true);
            expect(count).toBe(2);
            expect(type).toBe('folder');
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
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

        it('Search context menu testing', (done: Function) => {
            let i: number = 0;
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                fileOpen: (args: FileOpenEventArgs) => { i++ },
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
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(li.length).toEqual(9);
                let searchEle: any = feObj.element.querySelector("#file_search");
                let searchObj: any = searchEle.ej2_instances[0];
                searchEle.value = 'doc';
                searchObj.value = 'doc';
                let eventArgs: any = { value: 'doc', container: searchEle };
                searchObj.input(eventArgs);
                setTimeout(function () {
                    this.request = jasmine.Ajax.requests.filter('/FileAccessOperations');
                    this.request[this.request.length - 1].respondWith({
                        status: 200,
                        responseText: JSON.stringify(accessSearchData)
                    });
                    setTimeout(function () {
                        li = document.getElementById('file_largeicons').querySelectorAll('li');
                        expect(li.length).toEqual(3);
                        feObj.menuClick = (args: MenuClickEventArgs) => {
                            i++;
                            expect((<any>args.fileDetails[0]).name === 'EJ2 File Manager.docx').toBe(true);
                        }
                        mouseEventArgs.target = li[2];
                        tapEvent.tapCount = 1;
                        feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                        let sourceElement: any = el.ej2_instances[0];
                        let evt = document.createEvent('MouseEvents')
                        evt.initEvent('contextmenu', true, true);
                        li[2].dispatchEvent(evt);
                        expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
                        expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
                        sourceElement.element.querySelectorAll('li')[0].click();
                        expect(i === 2).toBe(true);
                        done();
                    }, 500);
                }, 400);
            }, 500);
        });
        it('mouse click on new folder button', (done: Function) => {
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
                }
            }, 500);
        });
        it('mouse click on refresh button', (done: Function) => {
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
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                mouseEventArgs.target = largeLi[2];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[2].dispatchEvent(evt);
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
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                mouseEventArgs.target = largeLi[2];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[2].dispatchEvent(evt);
                document.getElementById('file_cm_download').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                done();
            }, 500);
        });
        it('mouse click on details button with two items selected', (done: Function) => {
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
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                mouseEventArgs.target = largeLi[2];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeLi[2].dispatchEvent(evt);
                document.getElementById('file_cm_details').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessDetails2)
                });
                setTimeout(function () {
                    let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                    expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Downloads, Music.png");
                    done();
                }, 500);
            }, 500);
        });
        it('mouse click on open button with non access folder/files', (done: Function) => {
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
