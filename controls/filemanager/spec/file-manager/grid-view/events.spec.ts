/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { BeforeSendEventArgs, FileLoadEventArgs, ToolbarCreateEventArgs, UploadListCreateArgs, MenuOpenEventArgs, MenuClickEventArgs, ToolbarClickEventArgs } from '../../../src/file-manager/base/interface';
import { createElement, Browser } from '@syncfusion/ej2-base';
import { toolbarItems, toolbarItems1, toolbarItems2, data1, data2, data3 } from '../data';

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
});