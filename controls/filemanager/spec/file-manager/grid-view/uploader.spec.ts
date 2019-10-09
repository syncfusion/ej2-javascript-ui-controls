/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { data1, uploadData1, UploadData, uploadData2, uploadData3 } from '../data';
import { Uploader } from '@syncfusion/ej2-inputs';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);
describe('FileManager control Details view', () => {
    describe('Uploader testing', () => {
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
                responseText: JSON.stringify(data1)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 8000;
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
                done();
            }, 500);
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('upload process testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(5);
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
                (<HTMLElement>document.querySelector('.e-dlg-closeicon-btn')).click();
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(6);
                    done();
                }, 500);
            }, 500);
        });
        it('upload process(multiple files) testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(5);
                let fileObj: File[] = [];
                fileObj[0] = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" });
                fileObj[1] = new File(["Nice Demo"], "demo.txt", { lastModified: 0, type: "overide/mimetype" });
                let eventArgs: any = { type: 'click', target: { files: fileObj }, preventDefault: (): void => { } };
                let uploadObj: any = document.querySelector('#' + feObj.element.id + '_upload');
                uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                this.request = jasmine.Ajax.requests.filter('/Upload');
                this.request[this.request.length - 2].respondWith({
                    status: 200,
                    responseText: JSON.stringify('')
                });
                this.request[this.request.length - 1].respondWith({
                    status: 200,
                    responseText: JSON.stringify('')
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(UploadData)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                (<HTMLElement>document.querySelector('.e-dlg-closeicon-btn')).click();
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(7);
                    done();
                }, 500);
            }, 500);
        });
        it('upload process(multiple files) testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(5);
                let fileObj: File[] = [];
                fileObj[0] = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" });
                fileObj[1] = new File(["Nice Demo"], "demo.txt", { lastModified: 0, type: "overide/mimetype" });
                let eventArgs: any = { type: 'click', target: { files: fileObj }, preventDefault: (): void => { } };
                let uploadObj: Uploader = (<any>document.querySelector('#' + feObj.element.id + '_upload')).ej2_instances[0];
                (<any>uploadObj).onSelectFiles(eventArgs);
                this.request = jasmine.Ajax.requests.filter('/Upload');
                this.request[this.request.length - 2].respondWith({
                    status: 403,
                    statusText: "File already exists",
                });
                this.request[this.request.length - 1].respondWith({
                    status: 403,
                    statusText: "File already exists",
                });
                (<HTMLElement>feObj.uploadDialogObj.element.querySelector('.e-file-remove-btn')).click();
                (<HTMLElement>feObj.uploadDialogObj.element.querySelector('.e-file-remove-btn')).click();
                expect((<FileManager>feObj).uploadDialogObj.visible).toBe(false);
                expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(5);
                done();
            }, 500);
        });
        it('upload process with duplicate item error message testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(5);
            setTimeout(function () {
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
                    expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(6);
                    uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 400,
                        statusText: "File already exists",
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                    setTimeout(function () {
                        expect(document.querySelector('.e-file-status').textContent).toBe('File already exists');
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
        it('upload process with duplicate item replace testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(5);
            setTimeout(function () {
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
                    expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(6);
                    uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 400,
                        statusText: "File already exists",
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                    setTimeout(function () {
                        expect(document.querySelector('.e-file-status').textContent).toBe('File already exists');
                        expect(feObj.extDialogObj.btnObj[1].element.textContent).toBe('Replace');
                        feObj.extDialogObj.btnObj[1].element.click()
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
                            expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(6);
                            done();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });

        it('multiple upload process with duplicate item rename testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(5);
            setTimeout(function () {
                let fileObj: File[] = [];
                fileObj[0] = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" });
                fileObj[1] = new File(["Nice Demo"], "demo.txt", { lastModified: 0, type: "overide/mimetype" });
                let eventArgs: any = { type: 'click', target: { files: fileObj }, preventDefault: (): void => { } };
                let uploadObj: any = document.querySelector('#' + feObj.element.id + '_upload');
                uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                this.request = jasmine.Ajax.requests.filter('/Upload');
                this.request[this.request.length - 2].respondWith({
                    status: 200,
                    responseText: JSON.stringify('')
                });
                this.request[this.request.length - 1].respondWith({
                    status: 200,
                    responseText: JSON.stringify('')
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(UploadData)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                setTimeout(function () {
                    (<HTMLElement>document.querySelector('.e-dlg-closeicon-btn')).click();
                    expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(7);
                    uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                    this.request = jasmine.Ajax.requests.filter('/Upload');
                    this.request[this.request.length - 2].respondWith({
                        status: 400,
                        statusText: "File already exists"
                    });
                    this.request[this.request.length - 1].respondWith({
                        status: 400,
                        statusText: "File already exists"
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                    setTimeout(function () {
                        expect(document.querySelector('.e-file-status').textContent).toBe('File already exists');
                        expect(feObj.extDialogObj.btnObj[1].element.textContent).toBe('Replace');
                        feObj.extDialogObj.element.querySelector('.e-checkbox').click();
                        feObj.extDialogObj.btnObj[1].element.click()
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request = jasmine.Ajax.requests.filter('/Upload');
                        this.request[this.request.length - 2].respondWith({
                            status: 200,
                            responseText: JSON.stringify('')
                        });
                        this.request[this.request.length - 1].respondWith({
                            status: 200,
                            responseText: JSON.stringify('')
                        });
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify(UploadData)
                        });
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                        setTimeout(function () {
                            expect(feObj.isRetryOpened).toBe(false);
                            (<HTMLElement>document.querySelector('.e-dlg-closeicon-btn')).click();
                            expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(7);
                            done();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });
        it('upload process with duplicate item rename testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(5);
            setTimeout(function () {
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
                    expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(6);
                    uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 400,
                        statusText: "File already exists",
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                    setTimeout(function () {
                        expect(document.querySelector('.e-file-status').textContent).toBe('File already exists');
                        expect(feObj.extDialogObj.btnObj[0].element.textContent).toBe('Keep both');
                        feObj.extDialogObj.btnObj[0].element.click()
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify('')
                        });
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify(uploadData2)
                        });
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                        setTimeout(function () {
                            (<HTMLElement>document.querySelector('.e-dlg-closeicon-btn')).click();
                            expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(7);
                            done();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });
        it('multiple upload process with duplicate item rename testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(5);
            setTimeout(function () {
                let fileObj: File[] = [];
                fileObj[0] = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" });
                fileObj[1] = new File(["Nice Demo"], "demo.txt", { lastModified: 0, type: "overide/mimetype" });
                let eventArgs: any = { type: 'click', target: { files: fileObj }, preventDefault: (): void => { } };
                let uploadObj: any = document.querySelector('#' + feObj.element.id + '_upload');
                uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                this.request = jasmine.Ajax.requests.filter('/Upload');
                this.request[this.request.length - 2].respondWith({
                    status: 200,
                    responseText: JSON.stringify('')
                });
                this.request[this.request.length - 1].respondWith({
                    status: 200,
                    responseText: JSON.stringify('')
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(UploadData)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                setTimeout(function () {
                    (<HTMLElement>document.querySelector('.e-dlg-closeicon-btn')).click();
                    expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(7);
                    uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                    this.request = jasmine.Ajax.requests.filter('/Upload');
                    this.request[this.request.length - 2].respondWith({
                        status: 400,
                        statusText: "File already exists"
                    });
                    this.request[this.request.length - 1].respondWith({
                        status: 400,
                        statusText: "File already exists"
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                    setTimeout(function () {
                        expect(document.querySelector('.e-file-status').textContent).toBe('File already exists');
                        expect(feObj.extDialogObj.btnObj[0].element.textContent).toBe('Keep both');
                        feObj.extDialogObj.element.querySelector('.e-checkbox').click();
                        feObj.extDialogObj.btnObj[0].element.click()
                        this.request = jasmine.Ajax.requests.filter('/Upload');
                        this.request[this.request.length - 2].respondWith({
                            status: 200,
                            responseText: JSON.stringify('')
                        });
                        this.request[this.request.length - 1].respondWith({
                            status: 200,
                            responseText: JSON.stringify('')
                        });
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify(uploadData3)
                        });
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                        setTimeout(function () {
                            expect(feObj.isRetryOpened).toBe(false);
                            (<HTMLElement>document.querySelector('.e-dlg-closeicon-btn')).click();
                            expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(9);
                            done();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });
        it('mutiple upload process with duplicate item skip(unchecked) testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(5);
            setTimeout(function () {
                let fileObj: File[] = [];
                fileObj[0] = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" });
                fileObj[1] = new File(["Nice Demo"], "demo.txt", { lastModified: 0, type: "overide/mimetype" });
                let eventArgs: any = { type: 'click', target: { files: fileObj }, preventDefault: (): void => { } };
                let uploadObj: any = document.querySelector('#' + feObj.element.id + '_upload');
                uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                this.request = jasmine.Ajax.requests.filter('/Upload');
                this.request[this.request.length - 2].respondWith({
                    status: 200,
                    responseText: JSON.stringify('')
                });
                this.request[this.request.length - 1].respondWith({
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
                    expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(6);
                    uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                    this.request = jasmine.Ajax.requests.filter('/Upload');
                    this.request[this.request.length - 2].respondWith({
                        status: 400,
                        statusText: "File already exists"
                    });
                    this.request[this.request.length - 1].respondWith({
                        status: 400,
                        statusText: "File already exists"
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                    setTimeout(function () {
                        expect(document.querySelector('.e-file-status').textContent).toBe('File already exists');
                        expect(feObj.retryFiles.length).toBe(2);
                        feObj.extDialogObj.btnObj[2].element.click();
                        expect(feObj.isRetryOpened).toBe(true);
                        expect(feObj.retryFiles.length).toBe(1);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
        it('mutiple upload process with duplicate item skip(checked) testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(5);
            setTimeout(function () {
                let fileObj: File[] = [];
                fileObj[0] = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" });
                fileObj[1] = new File(["Nice Demo"], "demo.txt", { lastModified: 0, type: "overide/mimetype" });
                let eventArgs: any = { type: 'click', target: { files: fileObj }, preventDefault: (): void => { } };
                let uploadObj: any = document.querySelector('#' + feObj.element.id + '_upload');
                uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                this.request = jasmine.Ajax.requests.filter('/Upload');
                this.request[this.request.length - 2].respondWith({
                    status: 200,
                    responseText: JSON.stringify('')
                });
                this.request[this.request.length - 1].respondWith({
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
                    expect(feObj.detailsviewModule.gridObj.contentModule.rows.length).toBe(6);
                    uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                    this.request = jasmine.Ajax.requests.filter('/Upload');
                    this.request[this.request.length - 2].respondWith({
                        status: 400,
                        statusText: "File already exists"
                    });
                    this.request[this.request.length - 1].respondWith({
                        status: 400,
                        statusText: "File already exists"
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                    setTimeout(function () {
                        expect(document.querySelector('.e-file-status').textContent).toBe('File already exists');
                        expect(feObj.retryFiles.length).toBe(2);
                        feObj.extDialogObj.element.querySelector('.e-checkbox').click();
                        feObj.extDialogObj.btnObj[2].element.click();
                        expect(feObj.isRetryOpened).toBe(false);
                        expect(feObj.retryFiles.length).toBe(0);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
        it('upload process with allowedextensions testing', (done) => {
            feObj.uploadSettings.allowedExtensions = '.png';
            feObj.dataBind();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let fileObj: File = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" })
                let eventArgs: any = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
                let uploadObj: any = document.querySelector('#' + feObj.element.id + '_upload');
                uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                expect(document.querySelector('.e-file-status').textContent).toBe('File type is not allowed');
                done();
            }, 500);
        });
    });

    describe('Uploader testing', () => {
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
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                uploadSettings: { allowedExtensions: '.png' },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 8000;
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
                done();
            }, 500);
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('upload process with allowedextensions(initial) testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let fileObj: File = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" })
                let eventArgs: any = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
                let uploadObj: any = document.querySelector('#' + feObj.element.id + '_upload');
                uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                expect(document.querySelector('.e-file-status').textContent).toBe('File type is not allowed');
                done();
            }, 500);
        });
    });
});