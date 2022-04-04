/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { data1, idData1, filterData, data4, data5, data6a } from '../data';
import { idData1Rename, data1Delete, rename, folderRename, idData1Delete, idData1Rename1, data17, idData4 } from '../data';
import { ColumnModel } from '@syncfusion/ej2-grids';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control Grid view', () => {
    describe('methods testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        let originalTimeout: any;
        beforeEach(() => {
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            });
            feObj.appendTo(ele);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        });
        afterEach(() => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('for getModuleName', () => {
            expect(feObj.getModuleName()).toBe('filemanager');
        });
        it('for getPersistData', () => {
            expect(feObj.getPersistData()).toBe('{"view":"Details","path":"/","selectedItems":[]}');
        });
        it('for disableToolbarItems', () => {
            feObj.disableToolbarItems(['NewFolder']);
            expect(feObj.element.querySelectorAll(".e-toolbar-item")[0].classList.contains('e-overlay')).toEqual(true);
            feObj.disableToolbarItems(["Upload", "Details"]);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(3);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item")[1].classList.contains('e-overlay')).toEqual(true);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item")[13].classList.contains('e-overlay')).toEqual(true);
            feObj.disableToolbarItems(null);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(3);
            feObj.disableToolbarItems(["Paste1"]);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(3);
            feObj.disableToolbarItems(["Paste2"]);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(3);
        });
        it('for enableToolbarItems', () => {
            feObj.disableToolbarItems(["Upload", "Details", "NewFolder"]);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(3);
            feObj.enableToolbarItems(null);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(3);
            feObj.enableToolbarItems(["Paste1"]);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(3);
            feObj.enableToolbarItems(["Paste2"]);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(3);
            feObj.enableToolbarItems(['NewFolder']);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(2);
            expect(feObj.element.querySelectorAll(".e-toolbar-item")[0].classList.contains('e-overlay')).toEqual(false);
            feObj.enableToolbarItems(["Upload", "Details"]);
            expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(0);
            expect(feObj.element.querySelectorAll(".e-toolbar-item")[1].classList.contains('e-overlay')).toEqual(false);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item")[13].classList.contains('e-overlay')).toEqual(false);
        });
        it('for refreshFiles', (done: Function) => {
            setTimeout(function () {
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                expect(li.length).toEqual(5);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                feObj.refreshFiles();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                setTimeout(function () {
                    let nli: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                    expect(nli.length).toEqual(5);
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                    done();
                }, 500);
            }, 500);
        });
        it('for destroy', () => {
            feObj.destroy();
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            expect(feObj.element.className).toBe('');
            expect(feObj.element.childElementCount).toBe(0);
        });
        it('for selectAll', (done) => {
            setTimeout(function () {
                let i: number = 0;
                let action: string = 'select';
                feObj.fileSelect = (args) =>{
                    i++;
                    expect(args.action).toEqual(action);
                    expect(args.isInteracted).toEqual(false);
                }
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                expect(feObj.selectedItems.length).toEqual(0);
                feObj.selectAll();
                expect(document.getElementById('file_grid').querySelectorAll('.e-fe-grid-name.e-active').length).toEqual(5);
                expect(feObj.selectedItems.length).toEqual(5);
                action = 'unselect';
                feObj.clearSelection();
                expect(feObj.selectedItems.length).toEqual(0);
                expect(document.getElementById('file_grid').querySelectorAll('.e-fe-grid-name.e-active').length).toEqual(0);
                expect(i).toEqual(2);
                done();
            }, 500);
        });
    });
    describe('methods testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement, fmEle: HTMLElement;
        let originalTimeout: any;
        beforeEach(() => {
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file_wrap1', styles: "display: none" });
            document.body.appendChild(ele);
            fmEle = createElement('div', { id: 'file1' });
            ele.appendChild(fmEle);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        });
        afterEach(() => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            fmEle.remove();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('for refreshLayout', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
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
            setTimeout(function () {
                (document.getElementById('file_wrap1') as any).style = "display: block";
                expect((<any>document.getElementById("file1").getElementsByClassName('e-layout')[0]).style.height).toBe('0px');
                expect((<any>document.getElementById("file1").getElementsByClassName('e-content')[0]).style.height).toBe('0px');
                feObj.refreshLayout();
                expect((<any>document.getElementById("file1").getElementsByClassName('e-layout')[0]).style.height).not.toBe('0px');
                expect((<any>document.getElementById("file1").getElementsByClassName('e-content')[0]).style.height).not.toBe('0px');
                done();
            }, 400);
        });
    });
    describe('methods testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        let originalTimeout: any;
        beforeEach(() => {
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file1' });
            document.body.appendChild(ele);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        });
        afterEach(() => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('for getSelectedFiles', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
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
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([0, 4]);
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
                view: 'Details',
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
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([0, 4]);
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
                view: 'Details',
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
            setTimeout(function () {
                feObj.deleteFiles();
                feObj.detailsviewModule.gridObj.selectRows([0, 4]);
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["Documents", "1.png"]));
                feObj.deleteFiles();
                let dialogObj: any = (document.getElementById("file1_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Delete Multiple Items");
                (document.getElementById('file1_dialog').querySelectorAll('.e-btn')[2] as HTMLElement).click();
                feObj.deleteFiles([]);
                feObj.deleteFiles(["Documents", "2.png", "1.png"]);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1Delete)
                });
                setTimeout(function () {
                    let nli: any = document.getElementById('file1_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file1_grid').querySelectorAll('.e-row');
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
                view: 'Details',
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
            setTimeout(function () {
                feObj.deleteFiles();
                feObj.detailsviewModule.gridObj.selectRows([0, 4]);
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["6171", "6175"]));
                feObj.deleteFiles();
                let dialogObj: any = (document.getElementById("file1_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Delete Multiple Items");
                (document.getElementById('file1_dialog').querySelectorAll('.e-btn')[2] as HTMLElement).click();
                feObj.deleteFiles([]);
                feObj.deleteFiles(["6171", "2.png"]);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(idData1)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(idData1Delete)
                });
                setTimeout(function () {
                    let nli: any = document.getElementById('file1_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file1_grid').querySelectorAll('.e-row');
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
                view: 'Details',
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
            setTimeout(function () {
                feObj.renameFile();
                feObj.detailsviewModule.gridObj.selectRows([0]);
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
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(rename)
                });
                setTimeout(function () {
                    let nli: any = document.getElementById('file1_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file1_grid').querySelectorAll('.e-row');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(5);
                    expect(ntr.length).toEqual(5);
                    expect(nar.length).toEqual(1);
                    expect(nli[1].textContent).toBe("My Folder");
                    expect(ntr[2].querySelector('.e-fe-grid-name').textContent).toBe("My Folder");
                    done();
                }, 500);
            }, 400);
        });
        it('for renameFile with id base', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
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
            setTimeout(function () {
                feObj.renameFile();
                feObj.detailsviewModule.gridObj.selectRows([0]);
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
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(idData1Rename)
                });
                setTimeout(function () {
                    let nli: any = document.getElementById('file1_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file1_grid').querySelectorAll('.e-row');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(6);
                    expect(ntr.length).toEqual(5);
                    expect(nar.length).toEqual(1);
                    expect(nli[1].textContent).toBe("My Folder");
                    expect(ntr[2].querySelector('.e-fe-grid-name').textContent).toBe("My Folder");
                    done();
                }, 500);
            }, 400);
        });
        it('for openFile', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
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
            setTimeout(function () {
                feObj.openFile(null);
                feObj.openFile("Document");
                feObj.openFile("Documents");
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data17)
                });
                setTimeout(function () {
                    let nli: any = document.getElementById('file1_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file1_grid').querySelectorAll('.e-row');
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
                view: 'Details',
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
            setTimeout(function () {
                feObj.openFile(null);
                feObj.openFile("617");
                feObj.openFile("6171");
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(idData4)
                });
                setTimeout(function () {
                    let nli: any = document.getElementById('file1_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file1_grid').querySelectorAll('.e-row');
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
                view: 'Details',
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
            setTimeout(function () {
                feObj.downloadFiles();
                feObj.downloadFiles(['12']);
                done();
            }, 400);
        });
        it('for downloadFiles with id base', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
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
                view: 'Details',
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
        it('for filterFiles', (done: Function) => {
            expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(5);
            feObj.filterFiles();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(filterData)
            });
            setTimeout(function () {
                expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(4);
                let len: number = feObj.detailsviewModule.gridObj.columns.length;
                let columnData: ColumnModel[] = JSON.parse(JSON.stringify(feObj.detailsviewModule.gridObj.columns));
                expect(columnData[len - 1].field).toBe('filterPath');
                (<HTMLElement>document.getElementById('file_tb_view')).click();
                (<HTMLElement>document.getElementById('file_ddl_large')).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(filterData)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(4);
                    done();
                }, 400);
            }, 400);
        });
        it('for Create Folder with string', (done: Function) => {
            expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(5);
            feObj.createFolder('New Folder');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data4)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data5)
            });
            setTimeout(function () {
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');
                expect(ntr.length).toEqual(6);
                expect(ntr[4].textContent).toBe('New folder');
                feObj.createFolder('New Folder');
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data6a)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_dialog').classList.contains('e-popup-open')).toBe(true);
                    expect(document.getElementById('file_dialog_title').textContent).toBe('Error');
                    expect(document.getElementById('file_dialog_dialog-content').textContent).toBe(`A file or folder with the name 'New Folder' already exists.`);
                    done();
                }, 400);
            }, 400);
        });
        it('for Create Folder without string', (done: Function) => {
            expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(5);
            feObj.createFolder();
            setTimeout(function () {
                expect(document.getElementById('file_dialog').classList.contains('e-popup-open')).toBe(true);
                expect(document.getElementById('file_dialog_title').textContent).toBe('Folder');
                done();
            }, 100);
        });
        // it('for Create Folder with string with error', (done: Function) => {
        //     expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(5);
        //     feObj.createFolder('New/');
        //     setTimeout(function () {
        //         // expect(document.getElementById('file_dialog').classList.contains('e-popup-open')).toBe(true);
        //         // expect(document.getElementById('file_dialog_title').textContent).toBe('Error');
        //         done();
        //     }, 100);
        // });
        it('for Upload', (done: Function) => {
            expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(5);
            feObj.uploadFiles();
            setTimeout(function () {
                done();
            }, 100);
        });
    });
});