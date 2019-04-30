/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import {NavigationPane} from '../../../src/file-manager/layout/navigation-pane';
import {DetailsView} from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement, Browser } from '@syncfusion/ej2-base';
import { toolbarItems, toolbarItems1, data1, data2, data3, data11, data15, data16 } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control Grid view', () => {
    describe('property testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        beforeEach(() => {
            jasmine.Ajax.install();
            feObj = undefined;
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
                view: 'Details',
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
            feObj.destroy();
            expect(feObj.element.classList.contains('custom')).toEqual(false);
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                cssClass: null
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
        });
            expect(feObj.element.classList.contains('null')).toEqual(false);
        });
        it('for height', () => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                height: '500px'
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.element.style.height).toEqual('500px');
            feObj.destroy();
            expect(feObj.element.style.height).toEqual('');
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                height: 400
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.element.style.height).toEqual('400px');
            feObj.destroy();
            expect(feObj.element.style.height).toEqual('');
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                height: '100%'
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.element.style.height).toEqual('100%');
            feObj.destroy();
            expect(feObj.element.style.height).toEqual('');
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                height: 'auto'
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.element.style.height).toEqual('auto');
            feObj.destroy();
            expect(feObj.element.style.height).toEqual('');
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                height: null
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.element.style.height).toEqual('');
        });
        it('for toolbarSettings', () => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                toolbarSettings: { visible: false }
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(false);
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            feObj.destroy();
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                toolbarSettings: { items: toolbarItems1 }
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(true);
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(toolbarItems1.length);
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(13);
            // method testing
            feObj.disableToolbarItems(["NewFolder1"]);
            expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(1);
            expect(feObj.element.querySelectorAll(".e-toolbar-item")[0].classList.contains('e-overlay')).toEqual(true);
            feObj.enableToolbarItems(["NewFolder1"]);
            expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(0);
            expect(feObj.element.querySelectorAll(".e-toolbar-item")[0].classList.contains('e-overlay')).toEqual(false);
        });
        it('for width', () => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                width: '500px'
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.element.style.width).toEqual('500px');
            expect((feObj.element.querySelector('.e-toolbar') as HTMLElement).offsetWidth).toBeLessThanOrEqual(feObj.element.offsetWidth);
            feObj.destroy();
            expect(feObj.element.style.width).toEqual('');
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                width: 400
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.element.style.width).toEqual('400px');
            feObj.destroy();
            expect(feObj.element.style.width).toEqual('');
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                width: '100%'
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.element.style.width).toEqual('100%');
            feObj.destroy();
            expect(feObj.element.style.width).toEqual('');
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                width: 'auto'
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.element.style.width).toEqual('auto');
            feObj.destroy();
            expect(feObj.element.style.width).toEqual('');
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                width: null
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.element.style.width).toEqual('');
        });
        it('for enableRtl', () => {
            feObj = new FileManager({
                view: 'Details',
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
            expect(feObj.element.classList.contains('e-rtl')).toEqual(true);
            expect(feObj.element.querySelector('.e-treeview').classList.contains('e-rtl')).toEqual(true);
            expect(feObj.element.querySelector('.e-toolbar').classList.contains('e-rtl')).toEqual(true);
            expect(feObj.element.querySelector('.e-grid').classList.contains('e-rtl')).toEqual(true);
            expect(feObj.contextmenuModule.contextMenu.element.parentElement.classList.contains('e-rtl')).toEqual(true);
            feObj.destroy();
            expect(feObj.element.classList.contains('e-rtl')).toEqual(false);            
        });
        it('for enableRtl', () => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                enableRtl: false
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.element.classList.contains('e-rtl')).toEqual(false);
            expect(feObj.element.querySelector('.e-treeview').classList.contains('e-rtl')).toEqual(false);
            expect(feObj.element.querySelector('.e-toolbar').classList.contains('e-rtl')).toEqual(false);
            expect(feObj.element.querySelector('.e-grid').classList.contains('e-rtl')).toEqual(false);
            expect(feObj.contextmenuModule.contextMenu.element.parentElement.classList.contains('e-rtl')).toEqual(false);
            feObj.destroy();
            expect(feObj.element.classList.contains('e-rtl')).toEqual(false);            
        });
        it('for showFileExtension', () => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showFileExtension: false
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(data1.files[0].name.substr(0,data1.files[0].name.lastIndexOf('.'))).toEqual('1');
            expect(data11.files[0].name.substr(0, data11.files[0].name.lastIndexOf('.'))).toEqual('image');
            expect(data11.files[4].name.substr(0, data11.files[4].name.lastIndexOf('.'))).toEqual('video');
            feObj.showFileExtension = true;
            feObj.dataBind();
            expect(data1.files[0].name).toEqual('1.png');
            expect(data11.files[4].name).toEqual('video.mp4');
            expect(data11.files[1].name).toEqual('music.mp3');
        });
        it('for showHiddenItems', () => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showHiddenItems: false,
                path: '/Food/'
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(data15.files.length).toEqual(3);
            expect(data15.files[0].name.substr(0,data15.files[0].name.lastIndexOf('.'))).toEqual('Bread');
            feObj.showHiddenItems = true;
            feObj.dataBind();
            expect(data11.files.length).toEqual(5);
        });
        it('for path', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                path: '/Employees/'
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
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree_1");
                expect(treeLi.length).toEqual(6);
                expect(gridLi.length).toEqual(1);
                done();
            }, 500);
        });
    });
});