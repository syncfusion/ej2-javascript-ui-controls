/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement, Browser } from '@syncfusion/ej2-base';
import { toolbarItems, toolbarItems1, data1, data16, data17,dataHidden } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control LargeIcons view', () => {
    describe('property change testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: any;
        let ele: HTMLElement;
        beforeEach(() => {
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
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
        });
        it('for cssClass', () => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                cssClass: 'custom'
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.element.classList.contains('custom')).toEqual(true);
            feObj.cssClass = '';
            feObj.dataBind();
            expect(feObj.element.classList.contains('custom')).toEqual(false);
            feObj.cssClass = 'custom';
            feObj.dataBind();
            expect(feObj.element.classList.contains('custom')).toEqual(true);
            feObj.cssClass = null;
            feObj.dataBind();
            expect(feObj.element.classList.contains('custom')).toEqual(false);
            expect(feObj.element.classList.contains('null')).toEqual(false);
            feObj.cssClass = 'custom';
            feObj.dataBind();
            expect(feObj.element.classList.contains('custom')).toEqual(true);
            expect(feObj.element.classList.contains('null')).toEqual(false);
            feObj.destroy();
            expect(feObj.element.classList.contains('custom')).toEqual(false);
        });
        it('for toolbarSettings', () => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(true);
            // expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(toolbarItems.length);
            feObj.toolbarSettings = { visible: false };
            feObj.dataBind();
            expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(false);
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            feObj.toolbarSettings = { visible: true };
            feObj.dataBind();
            // expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(true);
            // expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(toolbarItems.length);
            feObj.toolbarSettings = { items: toolbarItems1 };
            feObj.dataBind();
            expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(true);
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(toolbarItems1.length);
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(13);
            feObj.toolbarSettings = { items: toolbarItems };
            feObj.dataBind();
            expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(true);
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(toolbarItems.length);
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(14);
            feObj.destroy();
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
        });
        it('for width', () => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.element.style.width).toEqual('100%');
            feObj.width = '500px';
            feObj.dataBind();
            expect(feObj.element.style.width).toEqual('500px');
            expect((feObj.element.querySelector('.e-toolbar') as HTMLElement).offsetWidth).toBeLessThanOrEqual(feObj.element.offsetWidth);
            feObj.width = 400;
            feObj.dataBind();
            expect(feObj.element.style.width).toEqual('400px');
            feObj.width = '100%';
            feObj.dataBind();
            expect(feObj.element.style.width).toEqual('100%');
            feObj.width = 'auto';
            feObj.dataBind();
            expect(feObj.element.style.width).toEqual('auto');
            feObj.width = null;
            feObj.dataBind();
            expect(feObj.element.style.width).toEqual('');
            feObj.destroy();
            expect(feObj.element.style.width).toEqual('');
        });
        it('for showThumbnail', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let img: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_largeicons').querySelectorAll('.e-list-img');
                expect(img.length).toBe(1);
                feObj.showThumbnail = false;
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let img1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_largeicons').querySelectorAll('.e-list-img');
                    expect(img1.length).toBe(0);
                    feObj.showThumbnail = true;
                    feObj.dataBind();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(data1)
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        let img2: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_largeicons').querySelectorAll('.e-list-img');
                        expect(img2.length).toBe(1);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
        it('for navigationPaneSettings', () => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                navigationPaneSettings: { visible: false }
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(document.getElementById('file_tree').offsetWidth).toEqual(0);
            feObj.navigationPaneSettings = { visible: true };
            feObj.dataBind();
            expect(document.getElementById('file_tree').offsetWidth).not.toEqual(0);
            feObj.navigationPaneSettings = { visible: false };
            feObj.dataBind();
            expect(document.getElementById('file_tree').offsetWidth).toEqual(0);
            feObj.destroy();
        });
        it('for enableRTL', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                enableRtl: true
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.enableRtl = false;
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(feObj.element.classList.contains('e-rtl')).toEqual(false);
                    expect(feObj.element.querySelector('.e-treeview').classList.contains('e-rtl')).toEqual(false);
                    expect(feObj.element.querySelector('.e-toolbar').classList.contains('e-rtl')).toEqual(false);
                    expect(feObj.contextmenuModule.contextMenu.element.parentElement.classList.contains('e-rtl')).toEqual(false);
                    expect(feObj.element.querySelector('.e-splitter').classList.contains('e-rtl')).toEqual(false);
                    done();
                }, 500);
            }, 500);
        });

        it('for view', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.view = 'Details';
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(feObj.element.querySelector('.e-grid').classList.contains('e-grid')).toEqual(true);
                    expect(feObj.element.querySelector('.e-grid').offsetWidth !== 0).toEqual(true);
                    expect(feObj.element.querySelector('.e-large-icons').offsetWidth).toEqual(0);
                    expect(feObj.view).toEqual('Details');
                    feObj.view = 'LargeIcons';
                    feObj.dataBind();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(data1)
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(feObj.element.querySelector('.e-large-icons').classList.contains('e-large-icons')).toEqual(true);
                        expect(feObj.element.querySelector('.e-large-icons').offsetWidth !== 0).toEqual(true);
                        expect(feObj.element.querySelector('.e-grid').offsetWidth).toEqual(0);
                        expect(feObj.view).toEqual('LargeIcons');
                        done();
                    });
                }, 500);
            }, 500);
        });

        it('for allowMultiSelection', function (done) {
            let mouseEventArgs: any, tapEvent: any;
            let feObj: any;
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
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.allowMultiSelection = false;
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    mouseEventArgs.target = li[0];
                    mouseEventArgs.ctrlKey = true;
                    feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                    expect(feObj.selectedItems.length).toEqual(1);
                    expect(feObj.allowMultiSelection).toEqual(false);
                    feObj.allowMultiSelection = true;
                    feObj.dataBind();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(data1)
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        let li: any = document.getElementById('file_largeicons').querySelectorAll('.e-frame.e-icons');
                        mouseEventArgs.target = li[1];
                        feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                        mouseEventArgs.target = li[2];
                        feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                        expect(feObj.selectedItems.length).toEqual(3);
                        expect(feObj.allowMultiSelection).toEqual(true);
                        done();
                    });
                }, 500);
            }, 500);
        });
        it('for allowMultiSelection true test case', function (done) {
            let mouseEventArgs: any, tapEvent: any;
            let feObj: any;
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
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                setTimeout(function () {
                    feObj.allowMultiSelection = true;
                    feObj.dataBind();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(data1)
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        let li: any = document.getElementById('file_largeicons').querySelectorAll('.e-frame.e-icons');
                        mouseEventArgs.target = li[1];
                        feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                        mouseEventArgs.target = li[2];
                        feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                        expect(feObj.selectedItems.length).toEqual(2);
                        expect(feObj.allowMultiSelection).toEqual(true);
                        done();
                    });
                }, 500);
            }, 500);
        });
        it('for showThumbnail', function (done) {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(document.querySelector('.e-list-icon.e-fe-image')).toBe(null)
                feObj.showThumbnail = true;
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(document.querySelector('.e-list-icon.e-fe-image')).toBe(null)
                    expect(feObj.showThumbnail).toEqual(true);
                    feObj.showThumbnail = false;
                    feObj.dataBind();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(data1)
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(document.querySelector('.e-list-icon.e-fe-image').classList.contains('e-fe-image')).toBe(true)
                        expect(feObj.showThumbnail).toEqual(false);
                        done();
                    });
                }, 500);
            }, 500);
        });
        it('for showFileExtension', function (done) {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                }
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(document.querySelectorAll('.e-list-text')[10].textContent).toBe("1.png")
                feObj.showFileExtension = true;
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(feObj.showFileExtension).toEqual(true);
                    expect(document.querySelectorAll('.e-list-text')[10].textContent).toBe("1.png")
                    feObj.showFileExtension = false;
                    feObj.dataBind();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(data1)
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(feObj.showFileExtension).toEqual(false);
                        expect(document.querySelectorAll('.e-list-text')[10].textContent).toBe("1")
                        done();
                    });
                }, 500);
            }, 500);
        });
        it('for showHiddenItems', function (done) {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                }
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.showHiddenItems = true;
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(feObj.showHiddenItems).toEqual(true);
                    expect(data1.files.length).toBe(5);
                    feObj.showHiddenItems = false;
                    feObj.dataBind();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(dataHidden)
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(feObj.showHiddenItems).toEqual(false);
                        expect(dataHidden.files.length).toBe(6);
                        done();
                    });
                }, 500);
            }, 500);
        });
        it('for ajaxSettings', function (done) {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                }
            });
            feObj.appendTo('#file')
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 404,
                responseText: "Not Found"
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.ajaxSettings.url = "http://localhost/FileOperations";
                feObj.ajaxSettings.uploadUrl = "http://localhost/uploadUrl";
                feObj.ajaxSettings.getImageUrl = "http://localhost/getImageUrl";
                feObj.ajaxSettings.downloadUrl = "http://localhost/downloadUrl";
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                    expect(treeLi.length).toEqual(5);
                    expect(largeLi.length).toEqual(5);
                    expect(feObj.ajaxSettings.url).toBe('http://localhost/FileOperations');
                    expect(feObj.ajaxSettings.uploadUrl).toBe('http://localhost/uploadUrl');
                    expect(feObj.ajaxSettings.getImageUrl).toBe('http://localhost/getImageUrl');
                    expect(feObj.ajaxSettings.downloadUrl).toBe('http://localhost/downloadUrl');
                    done();
                }, 500);
            }, 500);
        });

        // it('for contextMenuSettings', function (done) {
        //     feObj = new FileManager({
        //         view: 'LargeIcons',
        //         ajaxSettings: {
        //             url: '/FileOperations',
        //             uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
        //         },
        //     });
        //     feObj.appendTo('#file')
        //     this.request = jasmine.Ajax.requests.mostRecent();
        //     this.request.respondWith({
        //         status: 200,
        //         responseText: JSON.stringify(data1)
        //     });
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(function () {
        //         feObj.contextMenuSettings = { file: ['file'], folder: ['folder'], layout: ['layout'], visible: true }
        //         feObj.dataBind();
        //         this.request = jasmine.Ajax.requests.mostRecent();
        //         this.request.respondWith({
        //             status: 200,
        //             responseText: JSON.stringify(data1)
        //         });
        //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //         let el: any = document.getElementById(feObj.element.id + '_contextmenu');
        //         let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
        //         expect(li.length).toBe(5);
        //         mouseEventArgs.target = li[0];
        //         tapEvent.tapCount = 1;
        //         feObj.largeiconsviewModule.clickObj.tap(tapEvent);
        //         expect(li[0].textContent).toBe('Documents');
        //         let sourceElement: any = el.ej2_instances[0];
        //         let evt = document.createEvent('MouseEvents')
        //         evt.initEvent('contextmenu', true, true);
        //         li[0].dispatchEvent(evt);
        //         setTimeout(function () {
        //             sourceElement.element.querySelectorAll('li')[0].click();
        //             expect(sourceElement.element.childElementCount).toBe(1)
        //             expect(sourceElement.element.children[0].textContent).toBe('folder')
        //             mouseEventArgs.target = li[4];
        //             tapEvent.tapCount = 1;
        //             feObj.largeiconsviewModule.clickObj.tap(tapEvent);
        //             evt.initEvent('contextmenu', true, true);
        //             li[4].dispatchEvent(evt);
        //             this.request = jasmine.Ajax.requests.mostRecent();
        //             this.request.respondWith({
        //                 status: 200,
        //                 responseText: JSON.stringify(data1)
        //             });
        //             jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
        //             setTimeout(function () {
        //                 // sourceElement.element.querySelectorAll('li')[4].click();
        //                 expect(sourceElement.element.childElementCount).toBe(1)
        //                 expect(sourceElement.element.children[0].textContent).toBe('file');
        //                 let largeIcons = document.getElementById('file_largeicons');
        //                 largeIcons.click();
        //                 mouseEventArgs.target = largeIcons;
        //                 tapEvent.tapCount = 1;
        //                 feObj.largeiconsviewModule.clickObj.tap(tapEvent);
        //                 evt.initEvent('contextmenu', true, true);
        //                 largeIcons.dispatchEvent(evt);
        //                 setTimeout(function () {
        //                     expect(sourceElement.element.children[0].textContent).toBe('layout')
        //                     done();
        //                 }, 500);

        //             }, 500);
        //         }, 500);
        //     }, 500);
        // });

        // it('for toolbarSettings', function (done) {
        //     feObj = new FileManager({
        //         view: 'LargeIcons',
        //         ajaxSettings: {
        //             url: '/FileOperations',
        //             uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
        //         },
        //     });
        //     feObj.appendTo('#file')
        //     this.request = jasmine.Ajax.requests.mostRecent();
        //     this.request.respondWith({
        //         status: 200,
        //         responseText: JSON.stringify(data1)
        //     });
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     feObj.toolbarSettings = { items: ['toolbar1', 'toolbar2'], visible: true };
        //     feObj.dataBind();
        //     this.request = jasmine.Ajax.requests.mostRecent();
        //     this.request.respondWith({
        //         status: 200,
        //         responseText: JSON.stringify(data1)
        //     });
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(function () {
        //         let el: any = document.getElementById(feObj.element.id + '_toolbar');
        //         expect(el.querySelectorAll('.e-toolbar-items .e-toolbar-item')[0].children[0].textContent).toBe('toolbar1')
        //         expect(el.querySelectorAll('.e-toolbar-items .e-toolbar-item')[1].children[0].textContent).toBe('toolbar2')
        //         expect(el.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toBe(2)
        //     }, 500);
        // });

        // it('for navigationPaneSettings', function (done) {
        //     feObj = new FileManager({
        //         view: 'LargeIcons',
        //         ajaxSettings: {
        //             url: '/FileOperations',
        //             uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
        //         },
        //     });
        //     feObj.appendTo('#file')
        //     this.request = jasmine.Ajax.requests.mostRecent();
        //     this.request.respondWith({
        //         status: 200,
        //         responseText: JSON.stringify(data1)
        //     });
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     feObj.navigationPaneSettings = { visible: false };
        //     feObj.dataBind();
        //     this.request = jasmine.Ajax.requests.mostRecent();
        //     this.request.respondWith({
        //         status: 200,
        //         responseText: JSON.stringify(data1)
        //     });
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(function () {
        //         let el: any = document.getElementById(feObj.element.id + '_tree');
        //         expect(el.offsetWidth === 0).toBe(true)
        //         // expect(el.offsetHeigth === 0).toBe(true)
        //         expect(feObj.navigationPaneSettings.visible).toBe(false);
        //     }, 500);
        // });

        // it('for selectedItems', function (done) {
        //     feObj = new FileManager({
        //         view: 'LargeIcons',
        //         ajaxSettings: {
        //             url: '/FileOperations',
        //             uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
        //         },
        //     });
        //     feObj.appendTo('#file')
        //     this.request = jasmine.Ajax.requests.mostRecent();
        //     this.request.respondWith({
        //         status: 200,
        //         responseText: JSON.stringify(data1)
        //     });
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     let li: any = document.getElementById('file_largeicons').querySelectorAll('.e-frame.e-icons');
        //     mouseEventArgs.target = li[1];
        //     feObj.largeiconsviewModule.clickObj.tap(tapEvent);
        //     mouseEventArgs.target = li[2];
        //     feObj.largeiconsviewModule.clickObj.tap(tapEvent);
        //     expect(feObj.selectedItems.length).toEqual(2);
        //     this.request = jasmine.Ajax.requests.mostRecent();
        //     this.request.respondWith({
        //         status: 200,
        //         responseText: JSON.stringify(data1)
        //     });
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(function () {
        //         // expect(feObj.selectedItems).toBe(["Employees", "Food"]);
        //         expect(feObj.selectedItems.length).toBe(2)
        //     }, 500);
        // });

        it('for path', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                path: 'Employees/'
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data16)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree_1");
                expect(treeLi.length).toEqual(6);
                expect(largeLi.length).toEqual(1);
                expect(feObj.path).toBe('/Employees/');
                feObj.path = '/Documents';
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data17)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree_0");
                    expect(treeLi.length).toEqual(6);
                    expect(largeLi.length).toEqual(1);
                    expect(feObj.path).toBe('/Documents/');
                    done();
                }, 500);
            }, 500);
        });

    });
});
