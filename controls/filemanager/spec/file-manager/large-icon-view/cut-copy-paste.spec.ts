/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';


import { data1, doubleClickRead, fileCopySuccess, fileCopyRead, folderCopy, folderRead, folderCopySuccess, folderCopyRead, data23, multiItemCopyRead, multiCopySuccess1, multiCopySuccess, doubleClickRead2, multiItemCopyRead1, multiCopySuccess2, multiItemCopyRead2, multiCopySuccess3, multiItemCopyRead3, data1pasteIN, data1pasteIN2, data1pasteIN3, data1pasteIN4, folderDragSuccess1, folderDragRead, data18 } from '../data';
import { createElement, closest, isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control LargeIcons view', () => {
    describe('Cut Copy Paste testing', () => {
        let mouseEventArgs: any, tapEvent: any, keyboardEventArgs: any;
        let feObj: FileManager;
        let ele: HTMLElement;
        let originalTimeout: any;
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                contextMenuSettings: {
                    file: ['Cut', 'Copy', '|', 'Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details'],
                    folder: ['Cut', 'Copy', 'Paste', '|', 'Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details'],
                    layout: ['Paste', '|', 'SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll']
                },
                toolbarSettings: {
                    items: ['Cut', 'Copy', 'Paste', 'NewFolder', 'Upload', 'Delete', 'Download', 'Rename', 'SortBy', 'Refresh', 'Selection', 'View', 'Details'],
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
            keyboardEventArgs = {
                preventDefault: (): void => { },
                action: null,
                target: null,
                stopImmediatePropagation: (): void => { },
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
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('folder context menu testing', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[1];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Cut');
            expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(false);
            expect(sourceElement.element.querySelectorAll('li')[1].innerText).toBe('Copy');
            expect((<Element>sourceElement.element.querySelectorAll('li')[1]).classList.contains('e-disabled')).toBe(false);
            expect(sourceElement.element.querySelectorAll('li')[2].innerText).toBe('Paste');
            expect((<Element>sourceElement.element.querySelectorAll('li')[2]).classList.contains('e-disabled')).toBe(true);
        });
        it('folder context menu(mouse hover) testing', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[0];
            (<any>feObj.largeiconsviewModule).onMouseOver(mouseEventArgs);
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[1];
            mouseEventArgs.target = Li;
            (<any>feObj.largeiconsviewModule).onMouseOver(mouseEventArgs);
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickHandler(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Cut');
            expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(false);
            expect(sourceElement.element.querySelectorAll('li')[1].innerText).toBe('Copy');
            expect((<Element>sourceElement.element.querySelectorAll('li')[1]).classList.contains('e-disabled')).toBe(false);
            expect(sourceElement.element.querySelectorAll('li')[2].innerText).toBe('Paste');
            expect((<Element>sourceElement.element.querySelectorAll('li')[2]).classList.contains('e-disabled')).toBe(true);
        });
        it('folder context menu testing (multiple item copy)', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[2].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[0].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            (<HTMLElement>document.getElementsByClassName('e-fe-copy')[0]).click();
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[1];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Cut');
            expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(false);
            expect(sourceElement.element.querySelectorAll('li')[1].innerText).toBe('Copy');
            expect((<Element>sourceElement.element.querySelectorAll('li')[1]).classList.contains('e-disabled')).toBe(false);
            expect(sourceElement.element.querySelectorAll('li')[2].innerText).toBe('Paste');
            expect((<Element>sourceElement.element.querySelectorAll('li')[2]).classList.contains('e-disabled')).toBe(false);
        });
        it('File context menu testing', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Cut');
            expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(false);
            expect(sourceElement.element.querySelectorAll('li')[1].innerText).toBe('Copy');
            expect((<Element>sourceElement.element.querySelectorAll('li')[1]).classList.contains('e-disabled')).toBe(false);
        });
        it('Layout context menu testing', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let Li: any = document.getElementById('file_largeicons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Paste');
            expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(true);
        });
        it('Treeview (Root Folder) context menu testing', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[0];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.querySelector('.e-fullrow').dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Cut');
            expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(true);
            expect(sourceElement.element.querySelectorAll('li')[1].innerText).toBe('Copy');
            expect((<Element>sourceElement.element.querySelectorAll('li')[1]).classList.contains('e-disabled')).toBe(true);
            expect(sourceElement.element.querySelectorAll('li')[2].innerText).toBe('Paste');
            expect((<Element>sourceElement.element.querySelectorAll('li')[2]).classList.contains('e-disabled')).toBe(true);
        });
        it('Treeview (Sub-Folder) context menu testing', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[1];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.querySelector('.e-fullrow').dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Cut');
            expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(false);
            expect(sourceElement.element.querySelectorAll('li')[1].innerText).toBe('Copy');
            expect((<Element>sourceElement.element.querySelectorAll('li')[1]).classList.contains('e-disabled')).toBe(false);
            expect(sourceElement.element.querySelectorAll('li')[2].innerText).toBe('Paste');
            expect((<Element>sourceElement.element.querySelectorAll('li')[2]).classList.contains('e-disabled')).toBe(true);
        });
        it('Toolbar testing', () => {
            expect(closest(document.getElementsByClassName('e-fe-cut')[0], 'div').classList.contains('e-hidden')).toBe(true);
            expect(closest(document.getElementsByClassName('e-fe-copy')[0], 'div').classList.contains('e-hidden')).toBe(true);
            expect(closest(document.getElementsByClassName('e-fe-paste')[0], 'div').classList.contains('e-hidden')).toBe(true);
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            expect(closest(document.getElementsByClassName('e-fe-cut')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-copy')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-paste')[0], 'div').classList.contains('e-hidden')).toBe(true);
        });
        it('Toolbar file copy paste testing', (done) => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            (<HTMLElement>document.getElementsByClassName('e-fe-copy')[0]).click();
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead)
            });
            setTimeout(function () {
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(fileCopySuccess)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(fileCopyRead)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(4);
                    done();
                }, 500);
            }, 500);
        });
        it('Toolbar file copy paste testing', (done) => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            (<HTMLElement>document.getElementsByClassName('e-fe-copy')[0]).click();
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead)
            });
            setTimeout(function () {
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(fileCopySuccess)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(fileCopyRead)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(4);
                    expect(document.getElementById('file_largeicons').querySelectorAll('li.e-active').length).toBe(1);
                    (<HTMLElement>document.getElementById('file_tb_view')).click();
                    (<HTMLElement>document.getElementById('file_ddl_details')).click();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(fileCopyRead)
                    });
                    setTimeout(function () {
                        expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(4);
                        expect(feObj.detailsviewModule.gridObj.getSelectedRows().length).toBe(1);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
        it('Toolbar file cut paste testing', (done) => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(document.getElementById('file_largeicons').querySelectorAll('li')[4].classList.contains('e-blur')).toBe(true);
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead)
            });
            setTimeout(function () {
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(fileCopySuccess)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(fileCopyRead)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(4);
                    done();
                }, 500);
            }, 500);
        });

        it('Toolbar file cut layout change testing', (done) => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            expect(closest(document.getElementsByClassName('e-fe-cut')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-copy')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-paste')[0], 'div').classList.contains('e-hidden')).toBe(true);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(closest(document.getElementsByClassName('e-fe-cut')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-copy')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-paste')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(document.getElementById('file_largeicons').querySelectorAll('li')[4].classList.contains('e-blur')).toBe(true);
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            (<HTMLElement>document.getElementById('file_tb_view')).click();
            (<HTMLElement>document.getElementById('file_ddl_details')).click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[4].classList.contains('e-blur')).toBe(true);
                expect(closest(document.getElementsByClassName('e-fe-cut')[0], 'div').classList.contains('e-hidden')).toBe(false);
                expect(closest(document.getElementsByClassName('e-fe-copy')[0], 'div').classList.contains('e-hidden')).toBe(false);
                expect(closest(document.getElementsByClassName('e-fe-paste')[0], 'div').classList.contains('e-hidden')).toBe(false);
                done();
            }, 500);
        });
        it('Keyboard file cut paste testing', (done) => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            keyboardEventArgs.action = 'ctrlX';
            (<any>feObj.largeiconsviewModule).keyActionHandler(keyboardEventArgs);
            expect(document.getElementById('file_largeicons').querySelectorAll('li')[4].classList.contains('e-blur')).toBe(true);
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead)
            });
            setTimeout(function () {
                keyboardEventArgs.action = 'ctrlV';
                (<any>feObj.largeiconsviewModule).keyActionHandler(keyboardEventArgs);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(fileCopySuccess)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(fileCopyRead)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(4);
                    done();
                }, 500);
            }, 500);
        });
        it('Keyboard file cut paste (sub folder - multiple folder) testing', (done) => {
            keyboardEventArgs.action = 'ctrlA';
            (<any>feObj.largeiconsviewModule).keyActionHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'ctrlX';
            (<any>feObj.largeiconsviewModule).keyActionHandler(keyboardEventArgs);
            expect(feObj.selectedNodes.length).toBe(5);
            expect(feObj.actionRecords.length).toBe(5);
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead)
            });
            setTimeout(function () {
                keyboardEventArgs.action = 'ctrlV';
                (<any>feObj.largeiconsviewModule).keyActionHandler(keyboardEventArgs);
                expect(document.getElementById('file_dialog').classList.contains('e-popup-open')).toBe(true);
                expect(document.getElementById('file_dialog').querySelectorAll('.e-fe-errorcontent').length).toBe(1);
                expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(3);
                expect((<HTMLElement>document.querySelector('.e-fe-errorcontent')).innerText).toBe("The destination folder is the subfolder of the source folder.");
                done();
            }, 500);
        });
        it('Keyboard file cut array maintenance testing', () => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            keyboardEventArgs.action = 'esc';
            expect(document.getElementById('file_largeicons').querySelectorAll('li')[4].classList.contains('e-active')).toBe(true);
            (<any>feObj.largeiconsviewModule).keyActionHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'ctrlX';
            (<any>feObj.largeiconsviewModule).keyActionHandler(keyboardEventArgs);
            expect(document.getElementById('file_largeicons').querySelectorAll('li')[4].classList.contains('e-blur')).toBe(true);
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            keyboardEventArgs.action = 'esc';
            (<any>feObj.largeiconsviewModule).keyActionHandler(keyboardEventArgs);
            expect(document.getElementById('file_largeicons').querySelectorAll('li')[4].classList.contains('e-blur')).toBe(false);
            expect(feObj.selectedNodes.length).toBe(0);
            expect(feObj.actionRecords.length).toBe(0);
        });
        it('Keyboard file copy paste testing', (done) => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            keyboardEventArgs.action = 'ctrlC';
            (<any>feObj.largeiconsviewModule).keyActionHandler(keyboardEventArgs);
            expect(document.getElementById('file_largeicons').querySelectorAll('li')[4].classList.contains('e-blur')).toBe(false);
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead)
            });
            setTimeout(function () {
                keyboardEventArgs.action = 'ctrlV';
                (<any>feObj.largeiconsviewModule).keyActionHandler(keyboardEventArgs);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(fileCopySuccess)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(fileCopyRead)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(4);
                    done();
                }, 500);
            }, 500);
        });
        it('Context menu file cut paste testing testing', (done) => {
            expect(feObj.selectedItems.length).toBe(0);
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(feObj.selectedItems.length).toBe(1);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Cut');
            expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(false);
            sourceElement.element.querySelectorAll('li')[0].click();
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead)
            });
            setTimeout(function () {
                expect(feObj.selectedItems.length).toBe(0);
                let Li: Element = document.getElementById('file_largeicons');
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                expect(feObj.selectedItems.length).toBe(0);
                expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Paste');
                expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(false);
                sourceElement.element.querySelectorAll('li')[0].click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(fileCopySuccess)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(fileCopyRead)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(4);
                    done();
                }, 500);
            }, 500);
        });
        it('Context menu file copy paste testing testing', (done) => {
            expect(feObj.selectedItems.length).toBe(0);
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(feObj.selectedItems.length).toBe(1);
            expect(sourceElement.element.querySelectorAll('li')[1].innerText).toBe('Copy');
            expect((<Element>sourceElement.element.querySelectorAll('li')[1]).classList.contains('e-disabled')).toBe(false);
            sourceElement.element.querySelectorAll('li')[1].click();
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead)
            });
            setTimeout(function () {
                expect(feObj.selectedItems.length).toBe(0);
                let Li: Element = document.getElementById('file_largeicons');
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                expect(feObj.selectedItems.length).toBe(0);
                expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Paste');
                expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(false);
                sourceElement.element.querySelectorAll('li')[0].click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(fileCopySuccess)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(fileCopyRead)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(4);
                    done();
                }, 500);
            }, 500);
        });
        it('Toolbar folder copy paste testing', (done) => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[0];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            (<HTMLElement>document.getElementsByClassName('e-fe-copy')[0]).click();
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[4].innerText).toBe('Open');
            sourceElement.element.querySelectorAll('li')[4].click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead)
            });
            setTimeout(function () {
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
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
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(4);
                    done();
                }, 500);
            }, 500);
        });
        it('Toolbar folder cut paste testing', (done) => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[0];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[4].innerText).toBe('Open');
            sourceElement.element.querySelectorAll('li')[4].click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead)
            });
            setTimeout(function () {
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
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
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(4);
                    done();
                }, 500);
            }, 500);
        });
        it('TreeView cut paste testing', (done) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
            expect(li.length).toEqual(5);
            mouseEventArgs.target = li[1].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data23)
            });
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                li[1].querySelector('.e-fullrow').dispatchEvent(evt);
                expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Cut');
                sourceElement.element.querySelectorAll('li')[0].click();
                expect(feObj.selectedNodes.length).toBe(1);
                expect(feObj.actionRecords.length).toBe(1);
                mouseEventArgs.target = li[3].querySelector('.e-fullrow');
                (<any>feObj.navigationpaneModule.treeObj).touchClickObj.tap(tapEvent);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(doubleClickRead)
                });
                setTimeout(function () {
                    li[3].querySelector('.e-fullrow').dispatchEvent(evt);
                    expect(sourceElement.element.querySelectorAll('li')[2].innerText).toBe('Paste');
                    sourceElement.element.querySelectorAll('li')[2].click();
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
                    setTimeout(function () {
                        expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(4);
                        expect(document.getElementById('file_tree').querySelectorAll('li')[1].textContent).toBe('Employees')
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
        it('TreeView copy paste testing', (done) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
            expect(li.length).toEqual(5);
            mouseEventArgs.target = li[1].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data23)
            });
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                li[1].querySelector('.e-fullrow').dispatchEvent(evt);
                expect(sourceElement.element.querySelectorAll('li')[1].innerText).toBe('Copy');
                sourceElement.element.querySelectorAll('li')[1].click();
                expect(feObj.selectedNodes.length).toBe(1);
                expect(feObj.actionRecords.length).toBe(1);
                mouseEventArgs.target = li[3].querySelector('.e-fullrow');
                (<any>feObj.navigationpaneModule.treeObj).touchClickObj.tap(tapEvent);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(doubleClickRead)
                });
                setTimeout(function () {
                    li[3].querySelector('.e-fullrow').dispatchEvent(evt);
                    expect(sourceElement.element.querySelectorAll('li')[2].innerText).toBe('Paste');
                    sourceElement.element.querySelectorAll('li')[2].click();
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
                    setTimeout(function () {
                        expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(4);
                        expect(document.getElementById('file_tree').querySelectorAll('li')[1].textContent).toBe('Documents')
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
        it('Multiple Item copy paste testing', (done) => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[0].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            (<HTMLElement>document.getElementsByClassName('e-fe-copy')[0]).click();
            expect(feObj.selectedNodes.length).toBe(2);
            expect(feObj.actionRecords.length).toBe(2);
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead)
            });
            setTimeout(function () {
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(multiCopySuccess)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(multiItemCopyRead)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(5);
                    done();
                }, 500);
            }, 500);
        });

        it('Multiple Item cut paste testing', (done) => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[0].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(document.getElementById('file_largeicons').querySelectorAll('li')[4].classList.contains('e-blur')).toBe(true);
            expect(document.getElementById('file_largeicons').querySelectorAll('li')[0].classList.contains('e-blur')).toBe(true);
            expect(feObj.selectedNodes.length).toBe(2);
            expect(feObj.actionRecords.length).toBe(2);
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead)
            });
            setTimeout(function () {
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(multiCopySuccess)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(multiItemCopyRead)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(5);
                    done();
                }, 500);
            }, 500);
        });

        it('Multiple Item cut paste(with duplicate) testing', (done) => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[0].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[1].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(document.getElementById('file_largeicons').querySelectorAll('li')[4].classList.contains('e-blur')).toBe(true);
            expect(document.getElementById('file_largeicons').querySelectorAll('li')[0].classList.contains('e-blur')).toBe(true);
            expect(feObj.selectedNodes.length).toBe(3);
            expect(feObj.actionRecords.length).toBe(3);
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead2)
            });
            setTimeout(function () {
                expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(5);
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(multiCopySuccess1)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(multiItemCopyRead3)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(6);
                    expect(document.getElementById('file_extn_dialog').querySelectorAll('button').length).toBe(3);
                    document.getElementById('file_extn_dialog').querySelectorAll('button')[2].click();
                    document.getElementById('file_extn_dialog').querySelectorAll('button')[1].click();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(multiCopySuccess2)
                    });
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(multiItemCopyRead2)
                    });
                    setTimeout(function () {
                        expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(7);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });

        it('Multiple Item copy paste(with duplicate) testing', (done) => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[0].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[1].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            (<HTMLElement>document.getElementsByClassName('e-fe-copy')[0]).click();
            expect(document.getElementById('file_largeicons').querySelectorAll('li')[4].classList.contains('e-blur')).toBe(false);
            expect(document.getElementById('file_largeicons').querySelectorAll('li')[0].classList.contains('e-blur')).toBe(false);
            expect(feObj.selectedNodes.length).toBe(3);
            expect(feObj.actionRecords.length).toBe(3);
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead2)
            });
            setTimeout(function () {
                expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(5);
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(multiCopySuccess1)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(multiItemCopyRead3)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(6);
                    expect(document.getElementById('file_extn_dialog').querySelectorAll('button').length).toBe(3);
                    document.getElementById('file_extn_dialog').querySelectorAll('button')[1].click();
                    document.getElementById('file_extn_dialog').querySelectorAll('button')[2].click();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(multiCopySuccess3)
                    });
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(multiItemCopyRead1)
                    });
                    setTimeout(function () {
                        expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(7);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });

        it('Context menu file cut paste in selected folder testing', (done) => {
            expect(feObj.selectedItems.length).toBe(0);
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(5);
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            expect(feObj.selectedItems.length).toBe(1);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[1];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li.dispatchEvent(evt);
            expect(feObj.selectedItems.length).toBe(1);
            expect(sourceElement.element.querySelectorAll('li')[2].innerText).toBe('Paste');
            expect((<Element>sourceElement.element.querySelectorAll('li')[2]).classList.contains('e-disabled')).toBe(false);
            sourceElement.element.querySelectorAll('li')[2].click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(fileCopySuccess)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1pasteIN)
            });
            setTimeout(function () {
                expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(4);
                done();
            }, 500);
        });
    });

    describe('Drag and Drop testing', () => {
        function copyObject(source: any, destiation: any): Object {
            for (let prop in source) {
                destiation[prop] = source[prop];
            }
            return destiation;
        }
        function getEventObject(eventType: string, eventName: string, currentTarget?: Element, target?: Element, x?: number, y?: number, offset?: number): Object {
            let tempEvent: any = document.createEvent(eventType);
            tempEvent.initEvent(eventName, true, true);
            let returnObject: any = copyObject(tempEvent, {});
            returnObject.preventDefault = () => { return true; };

            if (!isNullOrUndefined(x)) {
                returnObject.pageX = x;
                returnObject.clientX = x;
            }
            if (!isNullOrUndefined(y)) {
                returnObject.pageY = y;
                returnObject.clientY = y;
            }
            if (!isNullOrUndefined(currentTarget)) {
                returnObject.currentTarget = currentTarget;
            }
            if (!isNullOrUndefined(target)) {
                returnObject.target = returnObject.srcElement = returnObject.toElement = target;
                if (!isNullOrUndefined(offset)) {
                    returnObject.offsetY = offset;
                } else {
                    returnObject.offsetY = 7;
                }
            }

            return returnObject;
        }
        function setMouseCordinates(eventarg: any, x: number, y: number): Object {
            eventarg.pageX = x;
            eventarg.pageY = y;
            eventarg.clientX = x;
            eventarg.clientY = y;
            eventarg.offsetY = 7;
            return eventarg;
        }

        let mouseEventArgs: any, tapEvent: any;
        let feObj: FileManager;
        let ele: HTMLElement;
        let originalTimeout: any;
        let drag: number = 0;
        let start: number = 0;
        let stop: number = 0;
        let drop: number = 0;
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            drag = start = stop = drop = 0;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                allowDragAndDrop: true,
                showThumbnail: false,
                fileDragStop: function () {
                    stop++;
                },
                fileDragStart: function () {
                    start++;
                },
                fileDragging: function () {
                    drag++;
                },
                fileDropped: function () {
                    drop++;
                }
            });
            feObj.appendTo('#file');
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
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('drag and drop same folder tree', () => {
            let treeObj = feObj.navigationpaneModule.treeObj;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
            let rect: any = li[1].querySelector('.e-fullrow').getClientRects();
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', li[1].querySelector('.e-fullrow'), li[1].querySelector('.e-fullrow'), rect[0].x + 4, rect[0].y + 4);
            EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', li[1].querySelector('.e-fullrow'), li[1].querySelector('.e-fullrow'), rect[0].x + 10, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(document.querySelector('.e-fullrow') === null).toBe(false);
            expect(li[1].classList.contains('e-blur')).toBe(true);
            rect = li[2].querySelector('.e-fullrow').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-fullrow');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[3].querySelector('.e-fullrow').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-fullrow');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[2].querySelector('.e-fullrow').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-fullrow');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[1].querySelector('.e-fullrow').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-fullrow');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', li[1].querySelector('.e-fullrow'), li[1].querySelector('.e-fullrow'), rect[0].x + 5, rect[0].y + 5);
            mouseup.type = 'mouseup'; mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            expect(start).toBe(1);
            expect(stop).toBe(1);
            expect(drop).toBe(0);
            expect(drag > 1).toBe(true);
            expect((<HTMLElement>document.querySelector('.e-fe-errorcontent')).innerText).toBe("The destination folder is the subfolder of the source folder.");
        });

        it('drag and drop same folder largeicon', () => {
            let li: any = feObj.largeiconsviewModule.element.querySelectorAll('li');
            let rect: any = li[1].querySelector('.e-text-content').getClientRects();
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', li[1].querySelector('.e-text-content'), li[1].querySelector('.e-text-content'), rect[0].x + 4, rect[0].y + 4);
            EventHandler.trigger(feObj.largeiconsviewModule.listElements, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', li[1].querySelector('.e-text-content'), li[1].querySelector('.e-text-content'), rect[0].x + 10, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(document.querySelector('.e-fe-clone') === null).toBe(false);
            expect(li[1].classList.contains('e-blur')).toBe(true);
            rect = li[2].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[3].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[2].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[1].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', li[1].querySelector('.e-text-content'), li[1].querySelector('.e-text-content'), rect[0].x + 5, rect[0].y + 5);
            mouseup.type = 'mouseup'; mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            expect(start).toBe(1);
            expect(stop).toBe(1);
            expect(drop).toBe(0);
            expect(drag > 1).toBe(true);
            expect((<HTMLElement>document.querySelector('.e-fe-errorcontent')).innerText).toBe("The destination folder is the subfolder of the source folder.");
        });
        it('Quick drag on treeview nodes', () => {
            let treeObj = feObj.navigationpaneModule.treeObj;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
            let rect: any = li[1].querySelector('.e-fullrow').getClientRects();
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', li[1].querySelector('.e-fullrow'), li[1].querySelector('.e-fullrow'), rect[0].x + 4, rect[0].y + 4);
            EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', li[1].querySelector('.e-fullrow'), li[1].querySelector('.e-fullrow'), rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(document.querySelector('.e-fullrow') === null).toBe(false);
            expect(li[1].classList.contains('e-blur')).toBe(false);
            rect = li[2].querySelector('.e-fullrow').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-fullrow');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[3].querySelector('.e-fullrow').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-fullrow');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[2].querySelector('.e-fullrow').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-fullrow');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[1].querySelector('.e-fullrow').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-fullrow');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', li[1].querySelector('.e-fullrow'), li[1].querySelector('.e-fullrow'), rect[0].x + 5, rect[0].y + 5);
            mouseup.type = 'mouseup'; mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            expect(start).toBe(1);
            expect(stop).toBe(1);
            expect(drop).toBe(0);
        });
        it('drag and drop different folder tree', (done) => {
            let treeObj = feObj.navigationpaneModule.treeObj;
            expect(treeObj.element.querySelector('[title="Documents"]').classList.contains('e-level-2')).toBe(true);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
            let rect: any = li[1].querySelector('.e-fullrow').getClientRects();
            expect(feObj.largeiconsviewModule.element.querySelectorAll('li').length).toBe(5);
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', li[1].querySelector('.e-fullrow'), li[1].querySelector('.e-fullrow'), rect[0].x + 4, rect[0].y + 4);
            EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', li[1].querySelector('.e-fullrow'), li[1].querySelector('.e-fullrow'), rect[0].x + 10, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(document.querySelector('.e-fullrow') === null).toBe(false);
            expect(li[1].classList.contains('e-blur')).toBe(true);
            rect = li[2].querySelector('.e-fullrow').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-fullrow');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[2].querySelector('.e-fullrow').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-fullrow');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[3].querySelector('.e-fullrow').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-fullrow');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', li[3].querySelector('.e-fullrow'), li[3].querySelector('.e-fullrow'), rect[0].x + 5, rect[0].y + 5);
            mouseup.type = 'mouseup'; mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            expect(start).toBe(1);
            expect(stop).toBe(1);
            expect(drag > 1).toBe(true);
            expect(drop).toBe(0);
            this.request = jasmine.Ajax.requests.filter('/FileOperations');
            this.request[this.request.length - 1].respondWith({
                status: 200,
                responseText: JSON.stringify(folderCopySuccess)
            });
            this.request = jasmine.Ajax.requests.filter('/FileOperations');
            this.request[this.request.length - 1].respondWith({
                status: 200,
                responseText: JSON.stringify(data1pasteIN2)
            });
            setTimeout(function () {
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                expect(li.length).toBe(4);
                expect(treeObj.element.querySelector('[title="Documents"]')).toBe(null);
                expect(drop).toBe(1);
                expect(feObj.largeiconsviewModule.element.querySelectorAll('li').length).toBe(4);
                done();
            }, 100);
        });

        it('drag and drop different folder largeicon', (done) => {
            feObj.allowDragAndDrop = false;
            feObj.dataBind();
            feObj.allowDragAndDrop = true;
            feObj.dataBind();
            let li: any = feObj.largeiconsviewModule.element.querySelectorAll('li');
            let rect: any = li[4].querySelector('.e-text-content').getClientRects();
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', li[4].querySelector('.e-text-content'), li[4].querySelector('.e-text-content'), rect[0].x + 4, rect[0].y + 4);
            EventHandler.trigger(feObj.largeiconsviewModule.listElements, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', li[4].querySelector('.e-text-content'), li[4].querySelector('.e-text-content'), rect[0].x + 10, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(document.querySelector('.e-fe-clone') === null).toBe(false);
            expect(li[4].classList.contains('e-blur')).toBe(true);
            rect = li[3].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[2].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', li[2].querySelector('.e-text-content'), li[2].querySelector('.e-text-content'), rect[0].x + 5, rect[0].y + 5);
            mouseup.type = 'mouseup'; mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            expect(start).toBe(1);
            expect(stop).toBe(1);
            expect(drop).toBe(0);
            expect(drag > 1).toBe(true);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(fileCopySuccess)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1pasteIN)
            });
            setTimeout(function () {
                expect(drop).toBe(1);
                expect(feObj.largeiconsviewModule.element.querySelectorAll('li').length).toBe(4);
                done();
            }, 100);
        });

        it('drag and drop largeicon to tree', (done) => {
            let li: any = feObj.largeiconsviewModule.element.querySelectorAll('li');
            let rect: any = li[4].querySelector('.e-text-content').getClientRects();
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', li[4].querySelector('.e-text-content'), li[4].querySelector('.e-text-content'), rect[0].x + 4, rect[0].y + 4);
            EventHandler.trigger(feObj.largeiconsviewModule.listElements, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', li[4].querySelector('.e-text-content'), li[4].querySelector('.e-text-content'), rect[0].x + 10, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(document.querySelector('.e-fe-clone') === null).toBe(false);
            expect(li[4].classList.contains('e-blur')).toBe(true);
            rect = li[3].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[2].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[1].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let treeObj = feObj.navigationpaneModule.treeObj;
            li = treeObj.element.querySelectorAll('li');
            rect = li[2].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-fullrow');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[3].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-fullrow');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', li[3].querySelector('.e-fullrow'), li[3].querySelector('.e-fullrow'), rect[0].x + 5, rect[0].y + 5);
            mouseup.type = 'mouseup'; mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            expect(start).toBe(1);
            expect(stop).toBe(1);
            expect(drop).toBe(0);
            expect(drag > 1).toBe(true);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(fileCopySuccess)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1pasteIN)
            });
            setTimeout(function () {
                expect(drop).toBe(1);
                expect(feObj.largeiconsviewModule.element.querySelectorAll('li').length).toBe(4);
                done();
            }, 100);
        });

        it('drag and drop largeicon to undroppable area', () => {
            let li: any = feObj.largeiconsviewModule.element.querySelectorAll('li');
            let rect: any = li[4].querySelector('.e-text-content').getClientRects();
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', li[4].querySelector('.e-text-content'), li[4].querySelector('.e-text-content'), rect[0].x + 4, rect[0].y + 4);
            EventHandler.trigger(feObj.largeiconsviewModule.listElements, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', li[4].querySelector('.e-text-content'), li[4].querySelector('.e-text-content'), rect[0].x + 10, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(document.querySelector('.e-fe-clone') === null).toBe(false);
            expect(li[4].classList.contains('e-blur')).toBe(true);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', feObj.toolbarModule.toolbarObj.element, feObj.toolbarModule.toolbarObj.element, rect[0].x + 5, rect[0].y + 5);
            mouseup.type = 'mouseup'; mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            expect(start).toBe(1);
            expect(stop).toBe(1);
            expect(drop).toBe(0);
            start = stop = drop = 0;
            li = feObj.largeiconsviewModule.element.querySelectorAll('li');
            rect = li[4].querySelector('.e-text-content').getClientRects();
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            mousedown = getEventObject('MouseEvents', 'mousedown', li[4].querySelector('.e-text-content'), li[4].querySelector('.e-text-content'), rect[0].x + 4, rect[0].y + 4);
            EventHandler.trigger(feObj.largeiconsviewModule.listElements, 'mousedown', mousedown);
            mousemove = getEventObject('MouseEvents', 'mousemove', li[4].querySelector('.e-text-content'), li[4].querySelector('.e-text-content'), rect[0].x + 10, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(document.querySelector('.e-fe-clone') === null).toBe(false);
            expect(li[4].classList.contains('e-blur')).toBe(true);
            let mouseup1: any = getEventObject('MouseEvents', 'mouseup', feObj.navigationpaneModule.treeObj.element, feObj.navigationpaneModule.treeObj.element, rect[0].x + 5, rect[0].y + 5);
            mouseup.type = 'mouseup'; mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup1);
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            expect(start).toBe(1);
            expect(stop).toBe(1);
            expect(drop).toBe(0);
        });

        it('drag and drop tree to largeicon', (done) => {
            let treeObj = feObj.navigationpaneModule.treeObj;
            expect(treeObj.element.querySelector('[title="Documents"]').classList.contains('e-level-2')).toBe(true);
            let li: any = treeObj.element.querySelectorAll('li');
            let rect: any = li[1].querySelector('.e-fullrow').getClientRects();
            expect(feObj.largeiconsviewModule.element.querySelectorAll('li').length).toBe(5);
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', li[1].querySelector('.e-fullrow'), li[1].querySelector('.e-fullrow'), rect[0].x + 4, rect[0].y + 4);
            EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', li[1].querySelector('.e-fullrow'), li[1].querySelector('.e-fullrow'), rect[0].x + 10, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(document.querySelector('.e-fullrow') === null).toBe(false);
            expect(li[1].classList.contains('e-blur')).toBe(true);
            rect = li[2].querySelector('.e-fullrow').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-fullrow');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[3].querySelector('.e-fullrow').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-fullrow');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            li = feObj.largeiconsviewModule.element.querySelectorAll('li');;
            rect = li[1].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[2].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', li[2].querySelector('.e-text-content'), li[2].querySelector('.e-text-content'), rect[0].x + 5, rect[0].y + 5);
            mouseup.type = 'mouseup'; mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            expect(start).toBe(1);
            expect(stop).toBe(1);
            expect(drag > 1).toBe(true);
            expect(drop).toBe(0);
            this.request = jasmine.Ajax.requests.filter('/FileOperations');
            this.request[this.request.length - 1].respondWith({
                status: 200,
                responseText: JSON.stringify(folderCopySuccess)
            });
            this.request = jasmine.Ajax.requests.filter('/FileOperations');
            this.request[this.request.length - 1].respondWith({
                status: 200,
                responseText: JSON.stringify(data1pasteIN2)
            });
            setTimeout(function () {
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                expect(li.length).toBe(4);
                expect(treeObj.element.querySelector('[title="Documents"]')).toBe(null);
                expect(drop).toBe(1);
                expect(feObj.largeiconsviewModule.element.querySelectorAll('li').length).toBe(4);
                done();
            }, 100);
        });

        it('drag and drop different tree location to largeicon folder ', (done) => {
            let treeObj = feObj.navigationpaneModule.treeObj;
            let li: any = treeObj.element.querySelectorAll('li');
            expect(li.length).toBe(5);
            expect(feObj.largeiconsviewModule.element.querySelectorAll('li').length).toBe(5);
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead2)
            });
            setTimeout(function () {
                expect(treeObj.element.querySelector('[title="Documents"]').classList.contains('e-level-2')).toBe(true);
                li = treeObj.element.querySelectorAll('li');
                expect(li.length).toBe(6);
                expect(document.querySelector('.e-fe-clone')).toBe(null);
                let rect: any = li[1].querySelector('.e-fullrow').getClientRects();
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', li[1].querySelector('.e-fullrow'), li[1].querySelector('.e-fullrow'), rect[0].x + 4, rect[0].y + 4);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', li[1].querySelector('.e-fullrow'), li[1].querySelector('.e-fullrow'), rect[0].x + 10, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-fullrow') === null).toBe(false);
                expect(li[1].classList.contains('e-blur')).toBe(true);
                rect = li[2].querySelector('.e-fullrow').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-fullrow');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                rect = li[1].querySelector('.e-fullrow').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-fullrow');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                li = feObj.largeiconsviewModule.element.querySelectorAll('li');;
                rect = li[1].querySelector('.e-text-content').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                rect = li[0].querySelector('.e-text-content').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[0].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', li[0].querySelector('.e-text-content'), li[0].querySelector('.e-text-content'), rect[0].x + 5, rect[0].y + 5);
                mouseup.type = 'mouseup'; mouseup.currentTarget = document;
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(document.querySelector('.e-fe-clone')).toBe(null);
                expect(start).toBe(1);
                expect(stop).toBe(1);
                expect(drag > 1).toBe(true);
                expect(drop).toBe(0);
                this.request = jasmine.Ajax.requests.filter('/FileOperations');
                this.request[this.request.length - 1].respondWith({
                    status: 200,
                    responseText: JSON.stringify(folderDragSuccess1)
                });
                this.request = jasmine.Ajax.requests.filter('/FileOperations');
                this.request[this.request.length - 1].respondWith({
                    status: 200,
                    responseText: JSON.stringify(folderDragRead)
                });
                setTimeout(function () {
                    expect(treeObj.element.querySelector('[title="Documents"]').classList.contains('e-level-4')).toBe(true);
                    expect(drop).toBe(1);
                    li = treeObj.element.querySelectorAll('li');
                    expect(li.length).toBe(6);
                    done();
                }, 500);
            }, 100);
        });

        it('drag and drop same tree location to largeicon folder ', (done) => {
            let treeObj = feObj.navigationpaneModule.treeObj;
            let li: any = treeObj.element.querySelectorAll('li');
            expect(li.length).toBe(5);
            expect(feObj.largeiconsviewModule.element.querySelectorAll('li').length).toBe(5);
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead2)
            });
            setTimeout(function () {
                expect(treeObj.element.querySelector('[title="Documents"]').classList.contains('e-level-2')).toBe(true);
                li = treeObj.element.querySelectorAll('li');
                expect(li.length).toBe(6);
                expect(document.querySelector('.e-fe-clone')).toBe(null);
                let rect: any = li[3].querySelector('.e-fullrow').getClientRects();
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', li[3].querySelector('.e-fullrow'), li[3].querySelector('.e-fullrow'), rect[0].x + 4, rect[0].y + 4);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', li[3].querySelector('.e-fullrow'), li[3].querySelector('.e-fullrow'), rect[0].x + 10, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-fullrow') === null).toBe(false);
                expect(li[3].classList.contains('e-blur')).toBe(true);
                rect = li[2].querySelector('.e-fullrow').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-fullrow');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                rect = li[3].querySelector('.e-fullrow').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-fullrow');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                li = feObj.largeiconsviewModule.element.querySelectorAll('li');;
                rect = li[3].querySelector('.e-text-content').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                rect = li[0].querySelector('.e-text-content').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[0].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', li[0].querySelector('.e-text-content'), li[0].querySelector('.e-text-content'), rect[0].x + 5, rect[0].y + 5);
                mouseup.type = 'mouseup'; mouseup.currentTarget = document;
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(document.querySelector('.e-fe-clone')).toBe(null);
                expect(start).toBe(1);
                expect(stop).toBe(1);
                expect(drag > 1).toBe(true);
                expect(drop).toBe(0);
                expect((<HTMLElement>document.querySelector('.e-fe-errorcontent')).innerText).toBe("The destination folder is the subfolder of the source folder.");
                done();
            }, 500);
        });
        it('drag and drop searched grid file to same tree location ', function (done) {
            feObj.searchSettings = { allowSearchOnTyping: false };
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
                let li: any = feObj.largeiconsviewModule.element.querySelectorAll('li');
                let rect: any = li[2].querySelector('.e-text-content').getClientRects();
                expect(document.querySelector('.e-fe-clone')).toBe(null);
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', li[2].querySelector('.e-text-content'), li[2].querySelector('.e-text-content'), rect[0].x + 4, rect[0].y + 4);
                EventHandler.trigger(feObj.largeiconsviewModule.listElements, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', li[2].querySelector('.e-text-content'), li[2].querySelector('.e-text-content'), rect[0].x + 10, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-fe-clone') === null).toBe(false);
                expect(li[2].classList.contains('e-blur')).toBe(true);
                rect = li[2].querySelector('.e-text-content').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                rect = li[2].querySelector('.e-text-content').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                rect = li[2].querySelector('.e-text-content').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let treeObj = feObj.navigationpaneModule.treeObj;
                li = treeObj.element.querySelectorAll('li');
                rect = li[1].querySelector('.e-text-content').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-fullrow');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                rect = li[1].querySelector('.e-text-content').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-fullrow');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', li[1].querySelector('.e-fullrow'), li[1].querySelector('.e-fullrow'), rect[0].x + 5, rect[0].y + 5);
                mouseup.type = 'mouseup'; mouseup.currentTarget = document;
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(document.querySelector('.e-fe-clone')).toBe(null);
                expect(start).toBe(1);
                expect(stop).toBe(1);
                expect(drop).toBe(0);
                expect(drag > 1).toBe(true);
                expect((<HTMLElement>document.querySelector('.e-fe-errorcontent')).innerText).toBe("The destination folder is the same as the source folder.");
                done();
            }, 500);
        });

        it('drag and drop searched grid folder to same tree location ', function (done) {
            feObj.searchSettings = { allowSearchOnTyping: false };
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
                let li: any = feObj.largeiconsviewModule.element.querySelectorAll('li');
                let rect: any = li[1].querySelector('.e-text-content').getClientRects();
                expect(document.querySelector('.e-fe-clone')).toBe(null);
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', li[1].querySelector('.e-text-content'), li[1].querySelector('.e-text-content'), rect[0].x + 4, rect[0].y + 4);
                EventHandler.trigger(feObj.largeiconsviewModule.listElements, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', li[1].querySelector('.e-text-content'), li[1].querySelector('.e-text-content'), rect[0].x + 10, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-fe-clone') === null).toBe(false);
                expect(li[1].classList.contains('e-blur')).toBe(true);
                rect = li[1].querySelector('.e-text-content').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                rect = li[1].querySelector('.e-text-content').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                rect = li[1].querySelector('.e-text-content').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let treeObj = feObj.navigationpaneModule.treeObj;
                li = treeObj.element.querySelectorAll('li');
                rect = li[1].querySelector('.e-text-content').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-fullrow');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                rect = li[1].querySelector('.e-text-content').getClientRects();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-fullrow');
                mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', li[1].querySelector('.e-fullrow'), li[1].querySelector('.e-fullrow'), rect[0].x + 5, rect[0].y + 5);
                mouseup.type = 'mouseup'; mouseup.currentTarget = document;
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(document.querySelector('.e-fe-clone')).toBe(null);
                expect(start).toBe(1);
                expect(stop).toBe(1);
                expect(drop).toBe(0);
                expect(drag > 1).toBe(true);
                expect((<HTMLElement>document.querySelector('.e-fe-errorcontent')).innerText).toBe("The destination folder is the subfolder of the source folder.");
                done();
            }, 500);
        });

        // it('drag and drop between different tree location ', (done) => {
        //     let treeObj = feObj.navigationpaneModule.treeObj;
        //     let li: any = treeObj.element.querySelectorAll('li');
        //     expect(li.length).toBe(5);
        //     expect(feObj.largeiconsviewModule.element.querySelectorAll('li').length).toBe(5);
        //     mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
        //     tapEvent.tapCount = 2;
        //     (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
        //     this.request = jasmine.Ajax.requests.mostRecent();
        //     this.request.respondWith({
        //         status: 200,
        //         responseText: JSON.stringify(doubleClickRead2)
        //     });
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(function () {
        //         li = treeObj.element.querySelectorAll('li');
        //         expect(li.length).toBe(6);
        //         expect(document.querySelector('.e-fe-clone')).toBe(null);
        //         let rect: any = li[1].querySelector('.e-fullrow').getClientRects();
        //         let mousedown: any = getEventObject('MouseEvents', 'mousedown', li[1].querySelector('.e-fullrow'), li[1].querySelector('.e-fullrow'), rect[0].x + 4, rect[0].y + 4);
        //         EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
        //         let mousemove: any = getEventObject('MouseEvents', 'mousemove', li[1].querySelector('.e-fullrow'), li[1].querySelector('.e-fullrow'), rect[0].x + 5, rect[0].y + 5);
        //         EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //         expect(document.querySelector('.e-fullrow') === null).toBe(false);
        //         expect(li[1].classList.contains('e-blur')).toBe(true);
        //         rect = li[2].querySelector('.e-fullrow').getClientRects();
        //         mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-fullrow');
        //         mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
        //         EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //         rect = li[3].querySelector('.e-fullrow').getClientRects();
        //         mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-fullrow');
        //         mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
        //         EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //         setTimeout(function () {
        //             rect = li[4].querySelector('.e-fullrow').getClientRects();
        //             mousemove.srcElement = mousemove.target = mousemove.toElement = li[4].querySelector('.e-fullrow');
        //             mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
        //             EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //             let mouseup: any = getEventObject('MouseEvents', 'mouseup', li[4].querySelector('.e-fullrow'), li[4].querySelector('.e-fullrow'), rect[0].x + 5, rect[0].y + 5);
        //             mouseup.type = 'mouseup'; mouseup.currentTarget = document;
        //             EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        //             expect(document.querySelector('.e-fe-clone')).toBe(null);
        //             expect(start).toBe(1);
        //             expect(stop).toBe(1);
        //             expect(drag > 1).toBe(true);
        //             expect(drop).toBe(0);
        //             this.request = jasmine.Ajax.requests.mostRecent();
        //             this.request.respondWith({
        //                 status: 200,
        //                 responseText: JSON.stringify(folderDragSuccess)
        //             });
        //             expect(drop).toBe(1);
        //             li = treeObj.element.querySelectorAll('li');
        //             expect(li.length).toBe(5);
        //             done();
        //         }, 1300);
        //     }, 100);
        // });

        it('Multiple Item drag and drop testing', (done) => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[0].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let li: any = feObj.largeiconsviewModule.element.querySelectorAll('li');
            let rect: any = li[4].querySelector('.e-text-content').getClientRects();
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', li[4].querySelector('.e-text-content'), li[4].querySelector('.e-text-content'), rect[0].x + 4, rect[0].y + 4);
            EventHandler.trigger(feObj.largeiconsviewModule.listElements, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', li[4].querySelector('.e-text-content'), li[4].querySelector('.e-text-content'), rect[0].x + 10, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(document.querySelector('.e-fe-clone') === null).toBe(false);
            expect(li[4].classList.contains('e-blur')).toBe(true);
            rect = li[3].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[2].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[1].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[2].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', li[2].querySelector('.e-text-content'), li[2].querySelector('.e-text-content'), rect[0].x + 5, rect[0].y + 5);
            mouseup.type = 'mouseup'; mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            expect(start).toBe(1);
            expect(stop).toBe(1);
            expect(drop).toBe(0);
            expect(drag > 1).toBe(true);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(multiCopySuccess)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1pasteIN3)
            });
            setTimeout(function () {
                expect(drop).toBe(1);
                expect(feObj.largeiconsviewModule.element.querySelectorAll('li').length).toBe(3);
                done();
            }, 100);
        });

        it('Multiple Item drag and drop with duplicate items(1) testing', (done) => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[0].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[1].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let li: any = feObj.largeiconsviewModule.element.querySelectorAll('li');
            let rect: any = li[4].querySelector('.e-text-content').getClientRects();
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', li[4].querySelector('.e-text-content'), li[4].querySelector('.e-text-content'), rect[0].x + 4, rect[0].y + 4);
            EventHandler.trigger(feObj.largeiconsviewModule.listElements, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', li[4].querySelector('.e-text-content'), li[4].querySelector('.e-text-content'), rect[0].x + 10, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(document.querySelector('.e-fe-clone') === null).toBe(false);
            expect(li[4].classList.contains('e-blur')).toBe(true);
            rect = li[3].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[2].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[1].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[2].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', li[2].querySelector('.e-text-content'), li[2].querySelector('.e-text-content'), rect[0].x + 5, rect[0].y + 5);
            mouseup.type = 'mouseup'; mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            expect(start).toBe(1);
            expect(stop).toBe(1);
            expect(drop).toBe(0);
            expect(drag > 1).toBe(true);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(multiCopySuccess1)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1pasteIN2)
            });
            setTimeout(function () {
                expect(drop).toBe(0);
                expect(feObj.largeiconsviewModule.element.querySelectorAll('li').length).toBe(4);
                expect(document.getElementById('file_extn_dialog').querySelectorAll('button').length).toBe(3);
                document.getElementById('file_extn_dialog').querySelectorAll('button')[2].click();
                document.getElementById('file_extn_dialog').querySelectorAll('button')[1].click();
                this.request = jasmine.Ajax.requests.mostRecent();
                expect(drop).toBe(0);
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(multiCopySuccess2)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1pasteIN4)
                });
                setTimeout(function () {
                    expect(drop).toBe(1);
                    expect(feObj.largeiconsviewModule.element.querySelectorAll('li').length).toBe(3);
                    done();
                }, 100);
            }, 100);
        });

        it('Multiple Item drag and drop with duplicate items(2) testing', (done) => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[0].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[1].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let li: any = feObj.largeiconsviewModule.element.querySelectorAll('li');
            let rect: any = li[4].querySelector('.e-text-content').getClientRects();
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', li[4].querySelector('.e-text-content'), li[4].querySelector('.e-text-content'), rect[0].x + 4, rect[0].y + 4);
            EventHandler.trigger(feObj.largeiconsviewModule.listElements, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', li[4].querySelector('.e-text-content'), li[4].querySelector('.e-text-content'), rect[0].x + 10, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(document.querySelector('.e-fe-clone') === null).toBe(false);
            expect(li[4].classList.contains('e-blur')).toBe(true);
            rect = li[3].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[2].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[1].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[2].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', li[2].querySelector('.e-text-content'), li[2].querySelector('.e-text-content'), rect[0].x + 5, rect[0].y + 5);
            mouseup.type = 'mouseup'; mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            expect(start).toBe(1);
            expect(stop).toBe(1);
            expect(drop).toBe(0);
            expect(drag > 1).toBe(true);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(multiCopySuccess1)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1pasteIN2)
            });
            setTimeout(function () {
                expect(drop).toBe(0);
                expect(feObj.largeiconsviewModule.element.querySelectorAll('li').length).toBe(4);
                expect(document.getElementById('file_extn_dialog').querySelectorAll('button').length).toBe(3);
                document.getElementById('file_extn_dialog').querySelectorAll('button')[1].click();
                document.getElementById('file_extn_dialog').querySelectorAll('button')[2].click();
                expect(drop).toBe(0);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(multiCopySuccess3)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1pasteIN3)
                });
                setTimeout(function () {
                    expect(drop).toBe(1);
                    expect(feObj.largeiconsviewModule.element.querySelectorAll('li').length).toBe(3);
                    done();
                }, 100);
            }, 100);
        });

        it('Multiple Item drag and drop with duplicate items(3) testing', (done) => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[0].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[1].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let li: any = feObj.largeiconsviewModule.element.querySelectorAll('li');
            let rect: any = li[4].querySelector('.e-text-content').getClientRects();
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', li[4].querySelector('.e-text-content'), li[4].querySelector('.e-text-content'), rect[0].x + 4, rect[0].y + 4);
            EventHandler.trigger(feObj.largeiconsviewModule.listElements, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', li[4].querySelector('.e-text-content'), li[4].querySelector('.e-text-content'), rect[0].x + 10, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(document.querySelector('.e-fe-clone') === null).toBe(false);
            expect(li[4].classList.contains('e-blur')).toBe(true);
            rect = li[3].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[2].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[1].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            rect = li[2].querySelector('.e-text-content').getClientRects();
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
            mousemove = setMouseCordinates(mousemove, rect[0].x + 5, rect[0].y + 5);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', li[2].querySelector('.e-text-content'), li[2].querySelector('.e-text-content'), rect[0].x + 5, rect[0].y + 5);
            mouseup.type = 'mouseup'; mouseup.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(document.querySelector('.e-fe-clone')).toBe(null);
            expect(start).toBe(1);
            expect(stop).toBe(1);
            expect(drop).toBe(0);
            expect(drag > 1).toBe(true);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(multiCopySuccess1)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1pasteIN2)
            });
            setTimeout(function () {
                expect(drop).toBe(0);
                expect(feObj.largeiconsviewModule.element.querySelectorAll('li').length).toBe(4);
                expect(document.getElementById('file_extn_dialog').querySelectorAll('button').length).toBe(3);
                document.getElementById('file_extn_dialog').querySelectorAll('button')[0].click();
                expect(drop).toBe(1);
                expect(feObj.largeiconsviewModule.element.querySelectorAll('li').length).toBe(4);
                done();
            }, 100);
        });

        it('Folder copy paste using context menu', (done) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[0];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            sourceElement.element.querySelectorAll('li')[3].click();
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            sourceElement.element.querySelectorAll('li')[0].click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(folderCopyRead)
            });
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[0];
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            setTimeout(function () {
                let Li: Element = document.getElementById('file_largeicons').querySelectorAll('li')[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                sourceElement.element.querySelectorAll('li')[4].click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(folderCopy)
                });
                sourceElement.element.querySelectorAll('li')[0].click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(folderRead)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(1);
                    done();
                }, 500);
            }, 500);
        });

        it('Folder copy paste using toolbar', (done) => {
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[0];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            (<HTMLElement>document.getElementsByClassName('e-fe-copy')[0]).click();
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            sourceElement.element.querySelectorAll('li')[0].click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(folderCopyRead)
            });
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[0];
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            setTimeout(function () {
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(folderCopy)
                });
                sourceElement.element.querySelectorAll('li')[0].click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(folderRead)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(1);
                    done();
                }, 500);
            }, 500);
        });
    });
});