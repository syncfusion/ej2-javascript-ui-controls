/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { data1, idData1, filterData, data1Delete, idData1Delete, folderRename, rename, idData1Rename1, idData1Rename, data17, idData4 } from '../data';
import { ColumnModel } from '@syncfusion/ej2-grids';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control LargeIcons view', () => {
    describe('methods testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement, fmEle: HTMLElement;
        beforeEach(() => {
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file_wrap2', styles: "display: none" });
            document.body.appendChild(ele);
            fmEle = createElement('div', { id: 'file2' });
            ele.appendChild(fmEle);
        });
        afterEach(() => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            fmEle.remove();
            ele.remove();
        });
        it('for refreshLayout', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            });
            feObj.appendTo("#file2");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                (document.getElementById('file_wrap2') as any).style = "display: block";
                expect((<any>document.getElementById("file2").getElementsByClassName('e-layout')[0]).style.height).toBe('0px');
                expect((<any>document.getElementById("file2").getElementsByClassName('e-large-icons')[0]).style.height).toBe('0px');
                feObj.refreshLayout();
                expect((<any>document.getElementById("file2").getElementsByClassName('e-layout')[0]).style.height).not.toBe('0px');
                expect((<any>document.getElementById("file2").getElementsByClassName('e-large-icons')[0]).style.height).not.toBe('0px');
                done();
            }, 400);
        });
    });
    describe('methods testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: any;
        let ele: HTMLElement;
        beforeEach(() => {
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file1' });
            document.body.appendChild(ele);
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
        afterEach(() => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
        });
        it('for getSelectedFiles', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            });
            feObj.appendTo("#file1");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let li: any = document.getElementById('file1_largeicons').querySelectorAll('li');
                mouseEventArgs.target = li[0];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                mouseEventArgs.target = li[4];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["Documents", "1.png"]));
                let data: any = feObj.getSelectedFiles();
                expect(data.length).toBe(2);
                expect(data[0]['name']).toBe('Documents');
                expect(data[1]['name']).toBe('1.png');
                done();
            }, 400);
        });
        it('for getSelectedFiles with id base', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            });
            feObj.appendTo("#file1");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(idData1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let li: any = document.getElementById('file1_largeicons').querySelectorAll('li');
                mouseEventArgs.target = li[0];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                mouseEventArgs.target = li[4];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["6171", "6175"]));
                let data: any = feObj.getSelectedFiles();
                expect(data.length).toBe(2);
                expect(data[0]['name']).toBe('Documents');
                expect(data[1]['name']).toBe('Videos');
                done();
            }, 400);
        });
        it('for deleteFiles', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            });
            feObj.appendTo("#file1");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.deleteFiles();
                let li: any = document.getElementById('file1_largeicons').querySelectorAll('li');
                mouseEventArgs.target = li[0];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                mouseEventArgs.target = li[4];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["Documents", "1.png"]));
                feObj.deleteFiles();
                let dialogObj: any = (document.getElementById("file1_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Delete Multiple Files");
                (document.getElementById('file1_dialog').querySelectorAll('.e-btn')[2] as HTMLElement).click();
                feObj.deleteFiles([]);
                feObj.deleteFiles(["Documents", "2.png", "1.png"]);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1Delete)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let nli: any = document.getElementById('file1_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file1_largeicons').querySelectorAll('li');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(4);
                    expect(ntr.length).toEqual(3);
                    expect(nar.length).toEqual(1);
                    done();
                }, 500);
            }, 400);
        });
        it('for deleteFiles with id base', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            });
            feObj.appendTo("#file1");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(idData1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.deleteFiles();
                let li: any = document.getElementById('file1_largeicons').querySelectorAll('li');
                mouseEventArgs.target = li[0];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                mouseEventArgs.target = li[4];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["6171", "6175"]));
                feObj.deleteFiles();
                let dialogObj: any = (document.getElementById("file1_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Delete Multiple Files");
                (document.getElementById('file1_dialog').querySelectorAll('.e-btn')[2] as HTMLElement).click();
                feObj.deleteFiles([]);
                feObj.deleteFiles(["6171", "2.png"]);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(idData1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(idData1Delete)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let nli: any = document.getElementById('file1_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file1_largeicons').querySelectorAll('li');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(5);
                    expect(ntr.length).toEqual(4);
                    expect(nar.length).toEqual(1);
                    done();
                }, 500);
            }, 400);
        });
        it('for renameFile', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            });
            feObj.appendTo("#file1");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.renameFile();
                let li: any = document.getElementById('file1_largeicons').querySelectorAll('li');
                mouseEventArgs.target = li[0];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["Documents"]));
                feObj.renameFile();
                let dialogObj: any = (document.getElementById("file1_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Rename");
                (document.getElementById('file1_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                feObj.renameFile("Document");
                feObj.renameFile("Documents");
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Rename");
                (document.getElementById('file1_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                feObj.renameFile("Documents", 'My Folder');
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(folderRename)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(rename)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let nli: any = document.getElementById('file1_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file1_largeicons').querySelectorAll('li');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(5);
                    expect(ntr.length).toEqual(5);
                    expect(nar.length).toEqual(1);
                    expect(nli[1].textContent).toBe("My Folder");
                    expect(ntr[2].textContent).toBe("My Folder");
                    done();
                }, 500);
            }, 400);
        });
        it('for renameFile with id base', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            });
            feObj.appendTo("#file1");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(idData1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.renameFile();
                let li: any = document.getElementById('file1_largeicons').querySelectorAll('li');
                mouseEventArgs.target = li[0];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["6171"]));
                feObj.renameFile();
                let dialogObj: any = (document.getElementById("file1_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Rename");
                (document.getElementById('file1_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                feObj.renameFile("617");
                feObj.renameFile("6171");
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Rename");
                (document.getElementById('file1_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                feObj.renameFile("6171", 'My Folder');
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(idData1Rename1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(idData1Rename)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let nli: any = document.getElementById('file1_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file1_largeicons').querySelectorAll('li');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(6);
                    expect(ntr.length).toEqual(5);
                    expect(nar.length).toEqual(1);
                    expect(nli[1].textContent).toBe("My Folder");
                    expect(ntr[2].textContent).toBe("My Folder");
                    done();
                }, 500);
            }, 400);
        });
        it('for openFile', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            });
            feObj.appendTo("#file1");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.openFile(null);
                feObj.openFile("Document");
                feObj.openFile("Documents");
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data17)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let nli: any = document.getElementById('file1_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file1_largeicons').querySelectorAll('li');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(6);
                    expect(ntr.length).toEqual(1);
                    expect(nar.length).toEqual(2);
                    expect(nli[1].classList.contains('e-active')).toBe(true);
                    done();
                }, 500);
            }, 400);
        });
        it('for openFile with id base', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            });
            feObj.appendTo("#file1");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(idData1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.openFile(null);
                feObj.openFile("617");
                feObj.openFile("6171");
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(idData4)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let nli: any = document.getElementById('file1_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file1_largeicons').querySelectorAll('li');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(6);
                    expect(ntr.length).toEqual(3);
                    expect(nar.length).toEqual(2);
                    expect(nli[1].classList.contains('e-active')).toBe(true);
                    done();
                }, 500);
            }, 400);
        });
        it('for downloadFiles', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            });
            feObj.appendTo("#file1");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.downloadFiles();
                feObj.downloadFiles(['12']);
                done();
            }, 400);
        });
        it('for downloadFiles with id base', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            });
            feObj.appendTo("#file1");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(idData1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.downloadFiles();
                feObj.downloadFiles(['12']);
                done();
            }, 400);
        });
    });
    describe('Custom method testing', () => {
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
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('for filterFiles', (done: Function) => {
            expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(5);
            feObj.filterFiles();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(filterData)
            });
            setTimeout(function () {
                expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(4);
                (<HTMLElement>document.getElementById('file_tb_view')).click();
                (<HTMLElement>document.getElementById('file_ddl_details')).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(filterData)
                }); jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(4);
                    let len: number = feObj.detailsviewModule.gridObj.columns.length;
                    let columnData: ColumnModel[] = JSON.parse(JSON.stringify(feObj.detailsviewModule.gridObj.columns));
                    expect(columnData[len - 1].field).toBe('filterPath');
                    done();
                }, 400);
            }, 400);
        });
    });
});