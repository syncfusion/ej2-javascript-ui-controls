/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import {NavigationPane} from '../../../src/file-manager/layout/navigation-pane';
import {DetailsView} from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { BeforeSendEventArgs, FileLoadEventArgs, ToolbarCreateEventArgs, UploadListCreateArgs, FileSelectionEventArgs } from '../../../src/file-manager/base/interface';
import { createElement, Browser } from '@syncfusion/ej2-base';
import { toolbarItems, toolbarItems1, toolbarItems2, data1, data2, data3, doubleClickRead, noExtension, noExtensionRename, noExtensionSuccess } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control single selection Grid view', () => {
    describe('events testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: any;
        let ele: HTMLElement;
        let i: number = 0;
        let originalTimeout: any;
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
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        });
        afterEach(() => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('for fileOpen', (done) => {
            let dblclickevent:any;
            let i: number = 0;
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                allowMultiSelection:false,
                showThumbnail: false,
                fileOpen: () => {
                    i++;
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            dblclickevent = new MouseEvent('dblclick', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([2]);
                feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[2].firstElementChild.dispatchEvent(dblclickevent);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(doubleClickRead)
                });
                setTimeout(function () {
                    expect(i).toBe(1);
                    feObj.element.getElementsByClassName('e-address-list-item')[0].click();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(data1)
                    });
                    setTimeout(function () {
                        expect(i).toBe(2);
                        let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                        mouseEventArgs.target = li[3].querySelector('.e-fullrow');
                        feObj.navigationpaneModule.treeObj.touchClickObj.tap(tapEvent);
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify(doubleClickRead)
                        });
                        setTimeout(function () {
                            expect(i).toBe(3);
                            done();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });
        it('for fileSelection', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                allowMultiSelection: false,
                showThumbnail: false,
                fileSelection: () => {
                    i++;
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                let obj = (feObj.detailsviewModule.gridObj as any);
                var rows = obj.getRows();
                feObj.allowMultiSelection = true;
                (rows[0].querySelector('.e-rowcell') as HTMLElement).click();
                expect(i).toEqual(1);
                mouseEventArgs.shiftKey = true;
                (rows[2].querySelector('.e-rowcell') as HTMLElement).click();
                expect(i).toEqual(3);
                done();
            }, 500);
        });
        it('for fileSelection with cancel', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                allowMultiSelection: false,
                showThumbnail: false,
                fileSelection: (args: FileSelectionEventArgs) => { i++; args.cancel = true },
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                let obj = (feObj.detailsviewModule.gridObj as any);
                var rows = obj.getRows();
                feObj.allowMultiSelection = true;
                (rows[0].querySelector('.e-rowcell') as HTMLElement).click();
                expect(i).toEqual(1);
                expect(rows[0].querySelector('.e-rowcell').classList.contains('e-check')).toBe(false);
                expect(rows[0].classList.contains('e-active')).toBe(false);
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
                allowMultiSelection: false,
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
                allowMultiSelection: false,
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
                allowMultiSelection: false,
                showThumbnail: false,
                beforeSend: (args: BeforeSendEventArgs) => {
                    (args.ajaxSettings as any).onSuccess = function() {
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
                allowMultiSelection: false,
                showThumbnail: false,
                beforeSend: (args: BeforeSendEventArgs) => { 
                    (args.ajaxSettings as any).onFailure = function() {
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
                allowMultiSelection: false,
                showThumbnail: false,
                success: clickFn
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
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
                allowMultiSelection: false,
                showThumbnail: false,
                failure: clickFn
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data2)
            });
            setTimeout(function () {
                expect(i).toEqual(1);
                done();
            }, 500);
        });
        it('for fileLoad', (done: Function) => {
            let grid:number=0;
            let tree:number=0;
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                allowMultiSelection: false,
                showThumbnail: false,
                fileLoad: (args: FileLoadEventArgs) => {
                    if(args.module==="DetailsView"){grid++;}
                    if(args.module==="NavigationPane"){tree++;}
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                expect(grid).toEqual(5);
                expect(tree).toEqual(5);
                done();
            }, 500);
        });
        it('for toolbarCreate', (done: Function) => {
            let j:number = 0;
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                allowMultiSelection: false,
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
                feObj.toolbarSettings.items = toolbarItems2;
                feObj.dataBind();
                expect(i).toEqual(2);
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
                allowMultiSelection: false,
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
            done();
            // setTimeout(function () {
            //     let items: any = document.getElementsByClassName('e-toolbar-item');
            //     items[11].click();
            //     expect(i).toEqual(1);
            //     items[9].click();
            //     expect(i).toEqual(2);
            //     done();
            // }, 500);
        });
        it('for uploadListCreate', () => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                allowMultiSelection:false,
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
        it('for beforePopupOpen with preventing file extension', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                allowMultiSelection: false,
                showThumbnail: false,
                showFileExtension: false,
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(noExtension)
            });
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([1]);
                let items: any = document.getElementsByClassName('e-fe-rename');
                items[0].click();
                expect((<HTMLInputElement>document.getElementById('rename')).value).toBe("1");
                (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[0]).click();
                feObj.detailsviewModule.gridObj.selectRows([2]);
                items[0].click();
                expect((<HTMLInputElement>document.getElementById('rename')).value).toBe("New");
                (<HTMLInputElement>document.getElementById('rename')).value = "New ";
                (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
                expect(document.getElementsByClassName("e-fe-error")[0].textContent).not.toEqual("");
                (<HTMLInputElement>document.getElementById('rename')).value = "New.";
                (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
                expect(document.getElementsByClassName("e-fe-error")[0].textContent).not.toEqual("");
                (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[0]).click();
                feObj.detailsviewModule.gridObj.selectRows([1]);
                items[0].click();
                expect((<HTMLInputElement>document.getElementById('rename')).value).toBe("1");
                (<HTMLInputElement>document.getElementById('rename')).value = "2";
                (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(noExtensionRename)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(noExtensionSuccess)
                });
                setTimeout(function () {
                    let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    expect(gridLi.length).toEqual(3);
                    expect(gridLi[1].querySelector('.e-fe-grid-name').innerText).toBe("2");
                    done();
                }, 500);
            }, 500);
        });
    });
});
