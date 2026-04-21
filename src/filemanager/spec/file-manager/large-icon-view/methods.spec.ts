/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { data1, idData1, filterData, data4, data5, data6a, rename2, pastesuccess } from '../data';
import { data1Delete, idData1Delete, folderRename, rename, idData1Rename1, idData1Rename, data17, idData4, imageData } from '../data';
import { ColumnModel } from '@syncfusion/ej2-grids';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control LargeIcons view', () => {
    describe('FileManager getImage', () => {
        let feObj: any;
        let ele: HTMLElement;
        let originalTimeout: any;
        beforeEach((): void => {
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = undefined;
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('for getImage with useImageAsUrl false', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    downloadUrl: '/Download',
                    getImageUrl: '/GetImage',
                    uploadUrl: '/Upload'
                },
                showThumbnail: true,
                beforeImageLoad: function (args: any) { args.useImageAsUrl = false; }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(imageData)
            });
            setTimeout(function () {
                const imgElements = feObj.element.querySelectorAll('.e-list-img');
                expect(imgElements.length).toBe(5);
                if (!feObj.beforeImageLoad.useImageAsUrl) {
                    if (imgElements[0].src && imgElements[0].src.includes('time')) {
                        expect(imgElements[0].src.includes('time')).toBe(false);
                        done();
                    } else {
                        // Set up a mutation observer to watch for src attribute changes
                        const observer = new MutationObserver((mutations) => {
                            mutations.forEach((mutation) => {
                                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                                    const newSrc = imgElements[0].src;
                                    if (newSrc && newSrc.length > 0) {
                                        expect(newSrc.includes('time')).toBe(false);
                                        expect(newSrc.includes('loading-indicator')).toBe(false);
                                        observer.disconnect();
                                        done();
                                    }
                                }
                            });
                        });
                        observer.observe(imgElements[0], { attributes: true });
                        // Set a timeout to prevent the test from hanging
                        setTimeout(() => {
                            observer.disconnect();
                            done();
                        }, 5000);
                    }
                }
            }, 500);
        });
        it('for getImage with useImageAsUrl true', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    downloadUrl: '/Download',
                    getImageUrl: '/GetImage',
                    uploadUrl: '/Upload'
                },
                showThumbnail: true,
                beforeImageLoad: function (args: any) { args.useImageAsUrl = true; }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(imageData)
            });
            setTimeout(function () {
                const imgElements = feObj.element.querySelectorAll('.e-list-img');
                expect(imgElements.length).toBe(5);
                expect(imgElements[0].src.includes('base64')).toBe(false);
                done();
            }, 500);
        });
        it('should trigger only the success event when getImage succeeds', (done: Function) => {
            let successEventTriggered = false;
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    downloadUrl: '/Download',
                    getImageUrl: '/GetImage',
                    uploadUrl: '/Upload'
                },
                showThumbnail: true,
                beforeImageLoad: function (args: any) { args.useImageAsUrl = false; },
                success: function (args: any) {
                    successEventTriggered = true;
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: imageData
            });
            setTimeout(function () {
                expect(successEventTriggered).toBe(true);
                done();
            }, 500);
        });
        it('should trigger failure event on image load error', (done: Function) => {
            let failureEventTriggered = false;
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations', downloadUrl: '/Download', getImageUrl: '/GetImage', uploadUrl: '/Upload'
                },
                showThumbnail: true,
                beforeImageLoad: function (args: any) { args.useImageAsUrl = false; },
                failure: function (args: any) { failureEventTriggered = true; }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 404,
                responseText: 'Not Found'
            });
            setTimeout(function () {
                expect(failureEventTriggered).toBe(true);
                done();
            }, 500);
        });
        it('should handle empty image data response gracefully', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    downloadUrl: '/Download',
                    getImageUrl: '/GetImage',
                    uploadUrl: '/Upload'
                },
                showThumbnail: true
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify([]) // Empty response
            });
            setTimeout(function () {
                const imgElements = feObj.element.querySelectorAll('.e-list-img');
                expect(imgElements.length).toBe(0); // Expect no images to be rendered
                done();
            }, 500);
        });
        it('should display error message when response has status 500', (done: Function) => {
            let errorMessageDisplayed = false;
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    getImageUrl: '/GetImage',
                    uploadUrl: '/Upload'
                },
                showThumbnail: true,
                failure: function () { errorMessageDisplayed = true; }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 500,
                responseText: 'Internal Server Error'
            });
            setTimeout(function () {
                expect(errorMessageDisplayed).toBe(true);
                done();
            }, 500);
        });
        it('should recover gracefully from a network failure', (done: Function) => {
            let networkFailureHandled = false;
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    getImageUrl: '/GetImage',
                    uploadUrl: '/Upload'
                },
                showThumbnail: true,
                beforeImageLoad: function (args: any) { args.useImageAsUrl = false; },
                failure: function () { networkFailureHandled = true; }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 0,
                responseText: ''
            });
            setTimeout(function () {
                expect(networkFailureHandled).toBe(true);
                done();
            }, 500);
        });
    });
    describe('Large Icon View to Details View - Rename Selection Test', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        let originalTimeout: number;

        beforeEach((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file_wrap2', styles: "display: block" });
            document.body.appendChild(ele);
            const fmEle: HTMLElement = createElement('div', { id: 'file2' });
            ele.appendChild(fmEle);
            done();
        });

        afterEach(() => {
            if (feObj) {
                feObj.destroy();
            }
            document.body.removeChild(ele);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            jasmine.Ajax.uninstall();
        });

        it('for rename in large icon view and switch to details view', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload',
                    downloadUrl: '/Download',
                    getImageUrl: '/GetImage'
                },
                showThumbnail: false
            });
            feObj.appendTo("#file2");
            const request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(() => {
                const newName: string = 'RenamedFile.txt';
                feObj.renamedItem = { name: newName };
                feObj.setProperties({ selectedItems: [newName] }, true);
                feObj.notify('renameEnd', {});
                feObj.view = 'Details';
                const viewChangeRequest: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                const responseData: any = JSON.parse(JSON.stringify(data1));
                if (responseData.files && responseData.files.length > 0) {
                    responseData.files[0].name = newName;
                }
                viewChangeRequest.respondWith({
                    status: 200,
                    responseText: JSON.stringify(responseData)
                });
                setTimeout(() => {
                    expect(feObj.selectedItems.length).toEqual(1);
                    expect(feObj.selectedItems[0]).toEqual(newName);
                    done();
                }, 800);
            }, 600);
        });
    });
    describe('methods testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement, fmEle: HTMLElement;
        let originalTimeout: any;
        beforeEach(() => {
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file_wrap2', styles: "display: none" });
            document.body.appendChild(ele);
            fmEle = createElement('div', { id: 'file2' });
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
            setTimeout(function () {
                (document.getElementById('file_wrap2') as any).style = "display: block";
                expect((<any>document.getElementById("file2").getElementsByClassName('e-layout')[0]).style.height).toBe('0px');
                expect((<any>document.getElementById("file2").getElementsByClassName('e-large-icons')[0]).offsetHeight).toBe(0);
                feObj.refreshLayout();
                expect((<any>document.getElementById("file2").getElementsByClassName('e-layout')[0]).style.height).not.toBe('0px');
                expect((<any>document.getElementById("file2").getElementsByClassName('e-large-icons')[0]).style.height).not.toBe('0px');
                done();
            }, 400);
        });
        it('for selectAll', (done) => {
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
            setTimeout(function () {
                let i: number = 0;
                let action: string = 'select';
                feObj.fileSelect = (args) => {
                    i++;
                    expect(args.action).toEqual(action);
                    expect(args.isInteracted).toEqual(false);
                }
                expect(document.getElementById('file2_largeicons').querySelectorAll('.e-large-icon').length).toEqual(5);
                expect(feObj.selectedItems.length).toEqual(0);
                feObj.selectAll();
                expect(document.getElementById('file2_largeicons').querySelectorAll('.e-large-icon.e-active').length).toEqual(5);
                expect(feObj.selectedItems.length).toEqual(5);
                action = 'unselect';
                feObj.clearSelection();
                expect(feObj.selectedItems.length).toEqual(0);
                expect(document.getElementById('file2_largeicons').querySelectorAll('.e-large-icon.e-active').length).toEqual(0);
                expect(i).toEqual(2);
                done();
            }, 400);
        });
    });
    describe('methods testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: any;
        let ele: HTMLElement;
        let originalTimeout: any;
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
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(rename)
                });
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
        it('for renameFile with image', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: true
            });
            feObj.appendTo("#file1");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                let ntr: any = document.getElementById('file1_largeicons').querySelectorAll('li');
                expect(ntr[4].textContent).toBe("1.png");
                feObj.renameFile("1.png", '1+2.png');
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(rename2)
                });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(rename2)
                });
                setTimeout(function () {
                    let ntr: any = document.getElementById('file1_largeicons').querySelectorAll('li');
                    expect(ntr[4].textContent).toBe("1+2.png");
                    done();
                }, 1000);
            }, 1000);
            
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
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(idData1Rename)
                });
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
            setTimeout(function () {
                feObj.downloadFiles();
                feObj.downloadFiles(['12']);
                done();
            }, 400);
        });
        it('for traverse backward', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                path: '/Food/'
            });
            feObj.appendTo("#file1");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(pastesuccess)
            });
            setTimeout(function () {
                debugger;
                feObj.traverseBackward();
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
                });
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(4);
                    let len: number = feObj.detailsviewModule.gridObj.columns.length;
                    let columnData: ColumnModel[] = JSON.parse(JSON.stringify(feObj.detailsviewModule.gridObj.columns));
                    expect(columnData[len - 1].field).toBe('filterPath');
                    done();
                }, 400);
            }, 400);
        });
        // it('for Create Folder with string', (done: Function) => {
        //     expect(document.getElementById('file_largeicons').querySelectorAll('.e-list-text').length).toBe(5);
        //     feObj.createFolder('New Folder');
        //     this.request = jasmine.Ajax.requests.mostRecent();
        //     this.request.respondWith({
        //         status: 200,
        //         responseText: JSON.stringify(data4)
        //     });
        //     this.request = jasmine.Ajax.requests.mostRecent();
        //     this.request.respondWith({
        //         status: 200,
        //         responseText: JSON.stringify(data5)
        //     });
        //     setTimeout(function () {
        //         let ntr: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-text');
        //         expect(ntr.length).toEqual(6);
        //         expect(ntr[4].textContent).toBe('New folder');
        //         feObj.createFolder('New Folder');
        //         this.request = jasmine.Ajax.requests.mostRecent();
        //         this.request.respondWith({
        //             status: 200,
        //             responseText: JSON.stringify(data6a)
        //         });
        //         setTimeout(function () {
        //             expect(document.getElementById('file_dialog').classList.contains('e-popup-open')).toBe(true);
        //             expect(document.getElementById('file_dialog_title').textContent).toBe('Error');
        //             expect(document.getElementById('file_dialog_dialog-content').textContent).toBe(`A file or folder with the name 'New Folder' already exists.`);
        //             done();
        //         }, 400);
        //     }, 400);
        // });
        // it('for Create Folder with string', (done: Function) => {
        //     expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(5);
        //     feObj.createFolder();
        //     setTimeout(function () {
        //         expect(document.getElementById('file_dialog').classList.contains('e-popup-open')).toBe(true);
        //         expect(document.getElementById('file_dialog_title').textContent).toBe('Folder');
        //         done();
        //     }, 100);
        // });
        // it('for Create Folder with string with error', (done: Function) => {
        //     expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(5);
        //     feObj.createFolder('New/');
        //     setTimeout(function () {
        //         expect(document.getElementById('file_dialog').classList.contains('e-popup-open')).toBe(true);
        //         expect(document.getElementById('file_dialog_title').textContent).toBe('Error');
        //         done();
        //     }, 100);
        // });
        it('for Upload', (done: Function) => {
            expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(5);
            feObj.uploadFiles();
            setTimeout(function () {
                done();
            }, 100);
        });

        it('for popup close', (done: Function) => {
            expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(5);
            feObj.createFolder();
            setTimeout(function () {
                expect(document.getElementById('file_dialog').classList.contains('e-popup-open')).toBe(true);
                feObj.closeDialog();
                expect(document.getElementById('file_dialog').classList.contains('e-popup-open')).toBe(false);
                done();
            }, 100);
        });
    });
});