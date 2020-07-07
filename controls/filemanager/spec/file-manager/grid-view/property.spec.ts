/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import {  BeforePopupOpenCloseEventArgs } from '../../../src/file-manager/base/interface';
import { toolbarItems1, data1, data2, doubleClickRead2, data16, idData1, idData2, idData3, uploadData1, searchpng, ascendingData, descendingData, noSorting, multiCopySuccess1, multiItemCopyRead2, multiItemCopyRead3, multiCopySuccess2, singleSelectionDetails, getMultipleDetails } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control Grid view', () => {
    describe('property testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        let originalTimeout: any;
        beforeEach(() => {
            jasmine.Ajax.install();
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
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
        it('for cssClass', () => {
            feObj = new FileManager({
                view: 'Details',
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
            });
            feObj.appendTo('#file');
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
            });
            feObj.appendTo('#file');
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
            });
            feObj.appendTo('#file');
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
            });
            feObj.appendTo('#file');
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
            });
            feObj.appendTo('#file');
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
            });
            feObj.appendTo('#file');
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
            });
            feObj.appendTo('#file');
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
            });
            feObj.appendTo('#file');
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
            });
            feObj.appendTo('#file');
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
            });
            feObj.appendTo('#file');
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
            });
            feObj.appendTo('#file');
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
            });
            feObj.appendTo('#file');
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
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect(feObj.element.style.width).toEqual('');
        });
        it('for rootAliasName', () => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                rootAliasName:"My Drive"
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            expect((<HTMLElement>document.querySelector("#file_tree  .e-text-content .e-list-text")).innerText).toEqual('My Drive');          
            feObj.destroy();
         
        });
        it('for enableRtl', () => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                enableRtl: true
            });
            feObj.appendTo('#file');
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
            });
            feObj.appendTo('#file');
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
        it('for showFileExtension', (done) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showFileExtension: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[4].children[2].textContent).toBe('1');
                feObj.showFileExtension = true;
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row')[4].children[2].textContent).toBe('1.png')
                    done();
                }, 500);
            }, 500);
        });
        it('for showFileExtension and custom template columns', (done) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                detailsViewSettings: {
                    columns: [
                        {field: 'size', headerText: 'File Size',minWidth: 50},
                        {field: 'name',template: '<div class="e-fe-text">${name}</div>', headerText: 'File Name', minWidth: 120}
                    ]
                },
                showFileExtension: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[4].children[3].textContent).toBe('1');
                feObj.showFileExtension = true;
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row')[4].children[3].textContent).toBe('1.png')
                    done();
                }, 500);
            }, 500);
        });
        it('for showFileExtension and custom columns', (done) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                detailsViewSettings: {
                    columns: [
                        {field: 'size', headerText: 'File Size',minWidth: 50},
                        {field: 'name', headerText: 'File Name', minWidth: 120}
                    ]
                },
                showFileExtension: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[4].children[3].textContent).toBe('1.png');
                feObj.showFileExtension = true;
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row')[4].children[3].textContent).toBe('1.png')
                    done();
                }, 500);
            }, 500);
        });
        it('for showHiddenItems', (done) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showHiddenItems: true
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(uploadData1)
            });
            setTimeout(function () {
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                feObj.showHiddenItems = false;
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                    done();
                }, 500);
            }, 500);
        });
        it('for path', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                path: '/Employees'
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data16)
            });
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
        it('for path with id', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                path: '1/6174/6176'
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(idData1)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(idData2)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(idData3)
            });
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                let addressLi: any = document.getElementById('file_breadcrumbbar').querySelectorAll('.e-address-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree_3_0");
                expect(treeLi.length).toEqual(9);
                expect(gridLi.length).toEqual(6);
                expect(addressLi.length).toEqual(3);
                expect(feObj.path).toBe('1/6174/6176/');
                expect(addressLi[0].getAttribute('data-utext')).toBe('1/');
                expect(addressLi[0].innerText).toBe('Files');
                expect((document.getElementById('file_search') as any).placeholder).toBe('Search Employees');
                done();
            }, 500);
        });
        it('for selectedItems', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
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
            setTimeout(function () {
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["Documents", "1.png"]));
                let li: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(li[0].getAttribute('aria-selected')).toEqual('true');
                expect(li[4].getAttribute('aria-selected')).toEqual('true');
                done();
            }, 400);
        });
        it('for selectedItems with id', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
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
            setTimeout(function () {
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["6171", "6175"]));
                let li: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(li[0].getAttribute('aria-selected')).toEqual('true');
                expect(li[4].getAttribute('aria-selected')).toEqual('true');
                done();
            }, 400);
        });
        it('for detailsViewSettings', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                detailsViewSettings: {
                    columns: [
                        {
                            field: 'name', headerText: 'Name', minWidth: 120, width: 'auto',
                            template: '<span class="e-fe-text">${name}</span>', customAttributes: { class: 'e-fe-grid-name' }
                        },
                        {
                            field: '_fm_modified', headerText: 'DateModified',
                            format: { type: 'date', format: 'MMMM dd, yyyy HH:mm' },
                            minWidth: 120, width: '190'
                        },
                        {
                            field: 'isFile', headerText: 'Is File', minWidth: 90, width: '110', headerTextAlign: "Center", allowResizing: false, allowSorting: false
                        },
                        {
                            field: 'size', headerText: 'Size', minWidth: 90, width: '110', template: '<span class="e-fe-size">${size}</span>'
                        }
                    ]
                }
            });
            feObj.appendTo("#file");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(5);
                expect(document.getElementById('file_grid').querySelectorAll('.e-headercell').length).toEqual(6);
                done();
            }, 400);
        });
        it('for detailsviewsettings name column width', (done) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                width: '700px',
                navigationPaneSettings:{visible:false},
                detailsViewSettings: {
                    columns: [
                        {field: 'name', headerText: 'File Name', minWidth: 120, customAttributes: { class: 'e-fe-grid-name' },template: '${name}'},
                        {field: 'size', headerText: 'File Size',minWidth: 50, template: '${size}'}
                    ]
                },
                searchSettings: { allowSearchOnTyping: false }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                expect(feObj.element.style.width).toEqual('700px');
                expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toBeGreaterThan(150);
                feObj.detailsViewSettings={
                    columns: [
                        { field: 'name', headerText: 'File Name', minWidth: 120, width: 150, customAttributes: { class: 'e-fe-grid-name' }, template: '${name}' },
                        { field: 'size', headerText: 'File Size', minWidth: 50, template: '${size}' }
                    ]
                };
                feObj.dataBind();
                expect(feObj.element.style.width).toEqual('700px');
                expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toEqual(150);
                (feObj as any).resizeHandler();
                expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toEqual(150);
                let searchEle: any = feObj.element.querySelector("#file_search");
                let searchObj: any = searchEle.ej2_instances[0];
                searchEle.value = '.png';
                searchObj.value = '.png';
                let eventArgs: any = { value: '.png', container: searchEle };
                searchObj.change(eventArgs);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(searchpng)
                });
                setTimeout(function () {
                    expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toEqual(150);
                    (feObj as any).resizeHandler();
                    expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toEqual(150);
                    feObj.detailsViewSettings={
                        columns: [
                            { field: 'name', headerText: 'File Name', minWidth: 120, customAttributes: { class: 'e-fe-grid-name' }, template: '${name}' },
                            { field: 'size', headerText: 'File Size', minWidth: 50, template: '${size}' }
                        ]
                    };
                    feObj.dataBind();
                    expect(feObj.element.style.width).toEqual('700px');
                    expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toBeGreaterThan(150);
                    done();
                }, 400);
            }, 400);
        });
        
        it('for detailsviewsettings name column width initial', (done) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                width: '700px',
                navigationPaneSettings:{visible:false},
                detailsViewSettings: {
                    columns: [
                        { field: 'name', headerText: 'File Name', minWidth: 120, width: 150, customAttributes: { class: 'e-fe-grid-name' }, template: '${name}' },
                        { field: 'size', headerText: 'File Size', minWidth: 50, template: '${size}' }
                    ]
                },
                searchSettings: { allowSearchOnTyping: false }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                expect(feObj.element.style.width).toEqual('700px');
                expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toEqual(150);
                (feObj as any).resizeHandler();
                expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toEqual(150);
                let searchEle: any = feObj.element.querySelector("#file_search");
                let searchObj: any = searchEle.ej2_instances[0];
                searchEle.value = '.png';
                searchObj.value = '.png';
                let eventArgs: any = { value: '.png', container: searchEle };
                searchObj.change(eventArgs);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(searchpng)
                });
                setTimeout(function () {
                    expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toEqual(150);
                    (feObj as any).resizeHandler();
                    expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toEqual(150);
                    done();
                }, 400);
            }, 400);
        });

        it('for sorting - Default value', (done) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                sortOrder: 'Ascending'
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(ascendingData)
            });
            setTimeout(function () {
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(3);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[0].children[2].textContent).toBe('Apple');
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[1].children[2].textContent).toBe('Music');
                done();
            }, 400);
        });

        it('for sorting - Descending value', (done) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                sortOrder: 'Descending'
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(descendingData)
            });
            setTimeout(function () {
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(3);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[0].children[2].textContent).toBe('Videos');
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[2].children[2].textContent).toBe('Apple');
                done();
            }, 400);
        });
        it('for sorting - None value', (done) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                sortOrder: 'None'
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(noSorting)
            });
            setTimeout(function () {
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(3);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[0].children[2].textContent).toBe('Music');
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[1].children[2].textContent).toBe('Videos');
                done();
            }, 400);
        });
       
    });
    describe('popupTarget property testing', () => {
        let mouseEventArgs: any;
        let feObj: FileManager;
        let ele: HTMLElement;
        let j: number = 0;
        let target: any;
        let name: string = null;
        let dblclickevent: any;
        let originalTimeout: any;
        beforeEach((done) => {
            j =0; name = null;
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
                popupTarget: 'BODY',
                beforePopupOpen: (args: BeforePopupOpenCloseEventArgs) => {
                    expect(args.popupName).toBe(name);
                    target = args.popupModule.target;
                    j++;
                },
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        it('for BeforeOpen cancel testing', () => {
            name = 'Create Folder';
            feObj.beforePopupOpen = (args: BeforePopupOpenCloseEventArgs) => { args.cancel = true; j++; target = args.popupModule.target;  }
            let item: any = document.getElementById('file_tb_newfolder');
            item.click();
            expect(j).toBe(1);
            expect(target).toBe('BODY');
            expect(target).not.toBe('#' + feObj.element.id);
        });

        it('for create folder', () => {
            name = 'Create Folder';
            let item: any = document.getElementById('file_tb_newfolder');
            item.click();
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            expect(j).toBe(1);
            expect(target).toBe('BODY');
            expect(target).not.toBe('#' + feObj.element.id);
        });

        it('for Rename', () => {
            feObj.selectedItems = ['Food']
            name = 'Rename';
            let item: any = document.getElementById('file_tb_rename');
            item.click();
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            expect(j).toBe(1);
            expect(target).toBe('BODY');
            expect(target).not.toBe('#' + feObj.element.id);
        });

        it('for Delete', () => {
            feObj.selectedItems = ['Food']
            name = 'Delete';
            let item: any = document.getElementById('file_tb_delete');
            item.click();
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            expect(j).toBe(1);
            expect(target).toBe('BODY');
            expect(target).not.toBe('#' + feObj.element.id);
        });

        it('for Duplicate Items testing', (done) => {
            name = 'Duplicate Items';
            feObj.detailsviewModule.gridObj.selectRows([0, 4, 1]);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[0].classList.contains('e-blur')).toBe(true);
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[4].classList.contains('e-blur')).toBe(true);
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[1].classList.contains('e-blur')).toBe(true);
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[2].firstElementChild.dispatchEvent(dblclickevent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead2)
            });
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
                    setTimeout(function () {
                        expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(7);
                        expect(j).toBe(1);
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
            expect(target).toBe('BODY');
            expect(target).not.toBe('#' + feObj.element.id);
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
                    setTimeout(function () {
                        name = 'Upload';
                        (<HTMLElement>document.querySelector('.e-dlg-closeicon-btn')).click();
                        expect((<any>feObj.detailsviewModule.gridObj.contentModule).rows.length).toBe(6);
                        expect(j).toBe(3);
                        expect(target).toBe('BODY');
                        expect(target).not.toBe('#' + feObj.element.id);
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
            expect(target).toBe('BODY');
            expect(target).not.toBe('#' + feObj.element.id);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(singleSelectionDetails)
            });
            setTimeout(function () {
                expect(document.getElementById('file_dialog_title').textContent).toBe('Documents');
                expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder');
                let item: any = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                expect(j).toBe(1);
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
            setTimeout(function () {
                expect(document.getElementById('file_dialog_title').textContent).toBe('Documents, Employees');
                expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder');
                let item: any = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(j).toBe(1);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                done();
            }, 500);
        });

        it('for image', (done: Function) => {
            name = 'Image Preview';
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([4]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(4).getElementsByTagName('td')[2];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            sourceElement.element.querySelectorAll('li')[0].click();
            expect(feObj.viewerObj.visible).toBe(true);
            feObj.viewerObj.hide();
            expect(j).toBe(1);
            expect(target).toBe('BODY');
            expect(target).not.toBe('#' + feObj.element.id);
            done();
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
            expect(j).toBe(2);
            expect(target).toBe('BODY');
            expect(target).not.toBe('#' + feObj.element.id);
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
            setTimeout(function () {
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(j).toBe(1);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                done();
            }, 500);
        });

        it('for continous multiple dialogs', (done) => {
            name = 'Error';
            let item: any = document.getElementById('file_tb_refresh');
            item.click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data2)
            });
            setTimeout(function () {
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(j).toBe(1);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                name = 'Create Folder';
                item = document.getElementById('file_tb_newfolder');
                item.click();
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(j).toBe(2);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                feObj.selectedItems = ['Food']
                name = 'Rename';
                item = document.getElementById('file_tb_rename');
                item.click();
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(j).toBe(3);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                feObj.selectedItems = ['Food']
                name = 'Delete';
                item = document.getElementById('file_tb_delete');
                item.click();
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(j).toBe(4);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
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
                item = document.getElementById('file_extn_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                name = 'Rename'
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(j).toBe(6);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                done();
            }, 500);
        });
    });
});