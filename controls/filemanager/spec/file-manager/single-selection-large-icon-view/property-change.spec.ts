/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import {NavigationPane} from '../../../src/file-manager/layout/navigation-pane';
import {DetailsView} from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement, Browser } from '@syncfusion/ej2-base';
import { toolbarItems, toolbarItems1, data1, data16, data17 } from '../data';

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
                allowMultiSelection: false,
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
                allowMultiSelection: false,
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
        it('for path', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                allowMultiSelection: false,
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
    });
});