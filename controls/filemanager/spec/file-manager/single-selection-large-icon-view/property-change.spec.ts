/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import {NavigationPane} from '../../../src/file-manager/layout/navigation-pane';
import {DetailsView} from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { toolbarItems, toolbarItems1, data1, data16, data17, idData1, idData2, idData4 } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control single selection LargeIcons view', () => {
    describe('property change testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        beforeEach(() => {
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
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                cssClass: 'custom'
            });
            feObj.appendTo('#file');
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
        it('for toolbarSettings view height testing', () => {
            feObj = new FileManager({
                view: 'LargeIcons',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                height:'400px',
                showThumbnail: false,
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(document.getElementById('file_largeicons').style.height).toEqual('321px');
            expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(true);
            feObj.toolbarSettings = { visible: false };
            feObj.dataBind();
            expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(false);
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            expect(document.getElementById('file_largeicons').style.height).toEqual('364px');
            feObj.toolbarSettings = { visible: true };
            feObj.dataBind();
            expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(true);
            expect(document.getElementById('file_largeicons').style.height).toEqual('321px');
        });
        it('for toolbarSettings', () => {
            feObj = new FileManager({
                view: 'LargeIcons',
                allowMultiSelection: false,
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
            expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(true);
            // expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(toolbarItems.length);
            feObj.toolbarSettings = { visible: false };
            feObj.dataBind();
            expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(false);
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            feObj.toolbarSettings = { visible: true };
            feObj.dataBind();
            expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(true);
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
                allowMultiSelection: false,
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
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
            });
            feObj.appendTo('#file');
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
        it('for navigationPaneSettings', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                navigationPaneSettings: { visible: false }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(document.getElementById('file_tree').offsetWidth).toEqual(0);
                feObj.navigationPaneSettings = { visible: true };
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(document.getElementById('file_tree').offsetWidth).not.toEqual(0);
                    feObj.navigationPaneSettings = { visible: false };
                    feObj.dataBind();
                    expect(document.getElementById('file_tree').offsetWidth).toEqual(0);
                    feObj.destroy();
                    done();
                }, 500);
            }, 500);
        });
        it('for path', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                path: '/Employees/'
            });
            feObj.appendTo('#file');
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
        it('for path with id', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                path: '1/6174/'
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(idData1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(idData2)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                let addressLi: any = document.getElementById('file_breadcrumbbar').querySelectorAll('.e-address-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree_3");
                expect(treeLi.length).toEqual(9);
                expect(largeLi.length).toEqual(3);
                expect(addressLi.length).toEqual(2);
                expect(feObj.path).toBe('1/6174/');
                expect(addressLi[1].getAttribute('data-utext')).toBe('1/6174/');
                expect(addressLi[1].innerText).toBe('Pictures');
                expect((document.getElementById('file_search') as any).placeholder).toBe('Search Pictures');
                feObj.path = '1/6171';
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(idData1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(idData4)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let treeLi: any = treeObj.element.querySelectorAll('li');
                    let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                    let addressLi: any = document.getElementById('file_breadcrumbbar').querySelectorAll('.e-address-list-item');
                    expect(treeObj.selectedNodes[0]).toEqual("fe_tree_0");
                    expect(treeLi.length).toEqual(6);
                    expect(largeLi.length).toEqual(3);
                    expect(addressLi.length).toEqual(2);
                    expect(feObj.path).toBe('1/6171/');
                    expect(addressLi[1].getAttribute('data-utext')).toBe('1/6171/');
                    expect(addressLi[1].innerText).toBe('Documents');
                    expect((document.getElementById('file_search') as any).placeholder).toBe('Search Documents');
                    done();
                }, 500);
            }, 500);
        });
        it('for selectedItems', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                selectedItems: ["Documents", "1.png"]
            });
            feObj.appendTo("#file");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.selectedItems = ["Employees", "Nature"];
                feObj.dataBind();
                expect(feObj.selectedItems).not.toEqual(jasmine.arrayContaining(["Documents", "1.png"]));
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["Nature"]));
                let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(li[1].getAttribute('aria-selected')).not.toEqual('true');
                expect(li[3].getAttribute('aria-selected')).toEqual('true');
                expect(li[0].getAttribute('aria-selected')).not.toEqual('true');
                expect(li[4].getAttribute('aria-selected')).not.toEqual('true');
                done();
            }, 400);
        });
        it('for selectedItems with id', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                selectedItems: ["6171", "6175"]
            });
            feObj.appendTo("#file");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(idData1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.selectedItems = ["6172", "6174"];
                feObj.dataBind();
                expect(feObj.selectedItems).not.toEqual(jasmine.arrayContaining(["6171", "6175"]));
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["6174"]));
                let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(li[1].getAttribute('aria-selected')).not.toEqual('true');
                expect(li[3].getAttribute('aria-selected')).toEqual('true');
                expect(li[0].getAttribute('aria-selected')).not.toEqual('true');
                expect(li[4].getAttribute('aria-selected')).not.toEqual('true');
                done();
            }, 400);
        });
        it('for ajaxSettings', function (done) {
            feObj = new FileManager({
                view: 'LargeIcons',
                allowMultiSelection: false,
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
        it('for ajaxSettings before ajax success', function (done: Function) {
            feObj = new FileManager({
                view: 'LargeIcons',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                }
            });
            feObj.appendTo('#file');
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
        });
    });
});