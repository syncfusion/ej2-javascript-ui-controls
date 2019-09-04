/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { BeforeSendEventArgs, FileLoadEventArgs, ToolbarCreateEventArgs, UploadListCreateArgs, MenuOpenEventArgs, MenuClickEventArgs, ToolbarClickEventArgs, PopupOpenCloseEventArgs, BeforePopupOpenCloseEventArgs } from '../../../src/file-manager/base/interface';
import { createElement, Browser } from '@syncfusion/ej2-base';
import { toolbarItems, toolbarItems1, toolbarItems2, data1, data2, data3, multiCopySuccess1, doubleClickRead2, multiItemCopyRead3, multiCopySuccess2, multiItemCopyRead2, uploadData1, getMultipleDetails, singleSelectionDetails } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control Grid view', () => {
    describe('events testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: any;
        let ele: HTMLElement;
        let i: number = 0;
        function clickFn(): void {
            i++;
        }
        beforeEach(() => {
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = undefined;
            i = 0;
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
        it('for menuOpen', (done) => {
            let i: number = 0;
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                menuOpen: (args: MenuOpenEventArgs) => {
                    i++;
                    expect(args.fileDetails.length).toBe(1);
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([1, 2, 3]);
                let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let sourceElement: any = el.ej2_instances[0];
                sourceElement.animationSettings = { duration: 0, effect: "None" };
                sourceElement.dataBind();
                Li.dispatchEvent(evt);
                expect(i).toEqual(1);
                done();
            }, 500);
        });
        it('for menuClick', (done) => {
            let i: number = 0;
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                menuClick: (args: MenuClickEventArgs) => {
                    i++;
                    expect(args.fileDetails.length).toBe(3);
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([1, 2, 3]);
                let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let sourceElement: any = el.ej2_instances[0];
                sourceElement.animationSettings = { duration: 0, effect: "None" };
                sourceElement.dataBind();
                Li.dispatchEvent(evt);
                sourceElement.element.querySelector('#file_cm_delete').click();
                expect(i).toEqual(1);
                done();
            }, 500);
        });
        it('for ToolbarClick', (done) => {
            let i: number = 0;
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                toolbarClick: (args: ToolbarClickEventArgs) => {
                    i++;
                    expect(args.fileDetails.length).toBe(3);
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([1, 2, 3]);
                feObj.element.querySelector('#file_tb_delete').click();
                expect(i).toEqual(1);
                done();
            }, 500);
        });
        it('for beforeSend', () => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                beforeSend: clickFn
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(i).toEqual(1);
        });
        it('for beforeSend with cancel', () => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                beforeSend: (args: BeforeSendEventArgs) => { args.cancel = true; },
                success: clickFn,
                failure: clickFn
            });
            feObj.appendTo('#file');
            expect(i).toEqual(0);
        });
        it('for beforeSend with custom onSuccess function', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                beforeSend: (args: BeforeSendEventArgs) => {
                    (args.ajaxSettings as any).onSuccess = function () {
                        clickFn();
                    };
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(i).toEqual(1);
                done();
            }, 500);
        });
        it('for beforeSend with custom failure function', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                beforeSend: (args: BeforeSendEventArgs) => {
                    (args.ajaxSettings as any).onFailure = function () {
                        clickFn();
                    };
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 404,
                responseText: "Not Found"
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(i).toEqual(1);
                done();
            }, 500);
        });
        it('for success', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                success: clickFn
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(i).toEqual(1);
                done();
            }, 500);
        });
        it('for error', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                failure: clickFn
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data2)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(i).toEqual(1);
                done();
            }, 500);
        });
        it('for fileLoad', (done: Function) => {
            let grid: number = 0;
            let tree: number = 0;
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                fileLoad: (args: FileLoadEventArgs) => {
                    if (args.module === "DetailsView") { grid++; }
                    if (args.module === "NavigationPane") { tree++; }
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(grid).toEqual(5);
                expect(tree).toEqual(5);
                done();
            }, 500);
        });
        it('for toolbarCreate', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                toolbarCreate: clickFn
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                expect(i).toEqual(1);
                feObj.toolbarCreate=(args:ToolbarCreateEventArgs)=>{
                    clickFn();
                    let ind:number= (<FileManager>feObj).getToolbarItemIndex('Custom tool');
                    if(ind!==-1){
                        args.items[ind].cssClass='e-custom';
                    }
                }
                feObj.toolbarSettings.items = toolbarItems2;
                feObj.dataBind();
                expect(i).toEqual(2);
                expect((<FileManager>feObj).toolbarModule.toolbarObj.element.querySelectorAll('.e-custom').length).toBe(1);
                done();
            }, 500);
        });
        it('for toolbarClick', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                toolbarSettings: {
                    visible: true,
                    items: toolbarItems2
                },
                toolbarClick: clickFn
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let items: any = document.getElementsByClassName('e-toolbar-item');
                items[11].click();
                expect(i).toEqual(1);
                items[9].click();
                expect(i).toEqual(2);
                done();
            }, 500);
        });
        it('for uploadListCreate', () => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                uploadListCreate: (args: UploadListCreateArgs) => {
                    let ele: HTMLElement = createElement('span', { className: 'e-fm-upload-icon' });
                    args.element.insertBefore(ele, args.element.firstElementChild);
                    clickFn();
                },
                uploadSettings: { allowedExtensions: '.png' }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            let fileObj: File = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" })
            let eventArgs: any = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            let uploadObj: any = document.querySelector('#' + feObj.element.id + '_upload');
            uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
            expect(document.querySelector('.e-file-status').textContent).toBe('File type is not allowed');
            expect(i).toEqual(1);
            expect(feObj.uploadDialogObj.element.querySelectorAll('.e-fm-upload-icon').length).toBe(1);
        });
        it('for beforeSend while uploading', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                beforeSend: clickFn
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let fileObj: File = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" })
                let eventArgs: any = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
                let uploadObj: any = document.querySelector('#' + feObj.element.id + '_upload');
                uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                expect(i).toEqual(2);
                done();
            }, 500);
        });
    });

    describe('events testing popup event', () => {
        let mouseEventArgs: any;
        let feObj: FileManager;
        let ele: HTMLElement;
        let i: number = 0, j: number = 0, k: number = 0;
        let name: string = null;
        let dblclickevent: any;
        beforeEach((done) => {
            i = j = k = 0; name = null;
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
                popupOpen: (args: PopupOpenCloseEventArgs) => {
                    expect(args.popupName).toBe(name);
                    i++;
                },
                popupClose: (args: PopupOpenCloseEventArgs) => {
                    expect(args.popupName).toBe(name);
                    i++;
                },
                beforePopupOpen: (args: BeforePopupOpenCloseEventArgs) => {
                    expect(args.popupName).toBe(name);
                    j++;
                },
                beforePopupClose: (args: BeforePopupOpenCloseEventArgs) => {
                    expect(args.popupName).toBe(name);
                    k++;
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
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
            dblclickevent = new MouseEvent('dblclick', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                done();
            }, 500);
        });
        afterEach(() => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
        });

        it('for BeforeOpen cancel testing', () => {
            name = 'Create Folder';
            feObj.beforePopupOpen = (args: BeforePopupOpenCloseEventArgs) => { args.cancel = true; j++; }
            let item: any = document.getElementById('file_tb_newfolder');
            item.click();
            expect(i).toBe(0);
            expect(j).toBe(1);
        });

        it('for BeforeClose cancel testing', () => {
            name = 'Create Folder';
            feObj.beforePopupClose = (args: BeforePopupOpenCloseEventArgs) => { args.cancel = true;k++; }
            let item: any = document.getElementById('file_tb_newfolder');
            item.click();
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            expect(document.getElementById('file_dialog').classList.contains('e-popup-open')).toBe(true);
            expect(i).toBe(1);
            expect(j).toBe(1);
            expect(k).toBe(1);
        });

        it('for create folder', () => {
            name = 'Create Folder';
            let item: any = document.getElementById('file_tb_newfolder');
            item.click();
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            expect(i).toBe(2);
            expect(j).toBe(1);
            expect(k).toBe(1);
        });

        it('for Rename', () => {
            feObj.selectedItems = ['Food']
            name = 'Rename';
            let item: any = document.getElementById('file_tb_rename');
            item.click();
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            expect(i).toBe(2);
            expect(j).toBe(1);
            expect(k).toBe(1);
        });

        it('for Delete', () => {
            feObj.selectedItems = ['Food']
            name = 'Delete';
            let item: any = document.getElementById('file_tb_delete');
            item.click();
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            expect(i).toBe(2);
            expect(j).toBe(1);
            expect(k).toBe(1);
        });

        it('for Duplicate Items testing', (done) => {
            name = 'Duplicate Items';
            feObj.detailsviewModule.gridObj.selectRows([0, 4, 1]);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[0].classList.contains('e-blur')).toBe(true);
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[4].classList.contains('e-blur')).toBe(true);
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[1].classList.contains('e-blur')).toBe(true);
            expect(feObj.selectedNodes.length).toBe(3);
            expect(feObj.actionRecords.length).toBe(3);
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[2].firstElementChild.dispatchEvent(dblclickevent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead2)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(5);
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
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(6);
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
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                    setTimeout(function () {
                        expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(7);
                        expect(i).toBe(2);
                        expect(j).toBe(1);
                        expect(k).toBe(1);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });

        it('for upload and for Upload retry', (done) => {
            name = 'Upload';
            expect((<any>feObj.detailsviewModule.gridObj.contentModule).rows.length).toBe(5);
            let fileObj: File = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" })
            let eventArgs: any = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            let uploadObj: any = document.querySelector('#' + feObj.element.id + '_upload');
            uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify('')
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(uploadData1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                (<HTMLElement>document.querySelector('.e-dlg-closeicon-btn')).click();
                expect((<any>feObj.detailsviewModule.gridObj.contentModule).rows.length).toBe(6);
                uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                name = 'Retry Upload';
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 400,
                    statusText: "File already exists",
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                setTimeout(function () {
                    expect(document.querySelector('.e-file-status').textContent).toBe('File already exists');
                    expect((<any>feObj.extDialogObj).btnObj[1].element.textContent).toBe('Replace');
                    (<any>feObj.extDialogObj).btnObj[1].element.click()
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify('')
                    });
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(uploadData1)
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                    setTimeout(function () {
                        name = 'Upload';
                        (<HTMLElement>document.querySelector('.e-dlg-closeicon-btn')).click();
                        expect((<any>feObj.detailsviewModule.gridObj.contentModule).rows.length).toBe(6);
                        expect(i).toBe(6);
                        expect(j).toBe(3);
                        expect(k).toBe(3);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });

        it('for details', (done: Function) => {
            name = 'File Details';
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let items: any = document.getElementById('file_tb_details');
            items.click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(singleSelectionDetails)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(document.getElementById('file_dialog_title').textContent).toBe('Documents');
                expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder');
                let item: any = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(i).toBe(2);
                expect(j).toBe(1);
                expect(k).toBe(1);
                done();
            }, 500);
        });

        it('for Multiple details', (done: Function) => {
            name = 'File Details';
            feObj.detailsviewModule.gridObj.selectRows([1, 2]);
            let items: any = document.getElementById('file_tb_details');
            items.click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(getMultipleDetails)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(document.getElementById('file_dialog_title').textContent).toBe('Documents, Employees');
                expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder');
                let item: any = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(i).toBe(2);
                expect(j).toBe(1);
                expect(k).toBe(1);
                done();
            }, 500);
        });

        it('for image', () => {
            name = 'Image Preview';
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([4]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(4).getElementsByTagName('td')[2];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
            expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
            sourceElement.element.querySelectorAll('li')[0].click();
            expect(i === 1).toBe(true);
            expect(feObj.viewerObj.visible).toBe(true);
            feObj.viewerObj.hide();
            expect(i === 2).toBe(true);
            expect(j).toBe(1);
            expect(k).toBe(1);
        });

        it('for Extension', () => {
            name = 'Rename'
            feObj.detailsviewModule.gridObj.selectRows([4]);
            let items: any = document.getElementsByClassName('e-fe-rename');
            items[0].click();
            let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-rowcell.e-fe-grid-name');
            expect(ntr.length).toEqual(5);
            expect(ntr[4].textContent).toBe("1.png");
            (<HTMLInputElement>document.getElementById('rename')).value = "1.pnga";
            name = 'Extension Change';
            (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
            let item: any = document.getElementById('file_extn_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            name = 'Rename'
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            expect(i).toBe(4);
            expect(j).toBe(2);
            expect(k).toBe(2);
        });

        it('for Error', (done) => {
            name = 'Error';
            let item: any = document.getElementById('file_tb_refresh');
            item.click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data2)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(i).toEqual(1);
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(i).toBe(2);
                expect(j).toBe(1);
                expect(k).toBe(1);
                done();
            }, 500);
        });
    });
});