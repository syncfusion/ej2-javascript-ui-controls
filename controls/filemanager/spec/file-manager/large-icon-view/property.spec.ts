/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import {NavigationPane} from '../../../src/file-manager/layout/navigation-pane';
import {DetailsView} from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import {  BeforePopupOpenCloseEventArgs } from '../../../src/file-manager/base/interface';
import { toolbarItems1, data1, data16, idData1, idData2, idData3, descendingData, ascendingData, noSorting, doubleClickRead2, multiCopySuccess1, multiItemCopyRead3, multiCopySuccess2, data2, uploadData1, getMultipleDetails, multiItemCopyRead2, singleSelectionDetails } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control LargeIcons view', () => {
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
                view: 'LargeIcons',
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
                view: 'LargeIcons',
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
                view: 'LargeIcons',
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
                view: 'LargeIcons',
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
                view: 'LargeIcons',
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
                view: 'LargeIcons',
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
                view: 'LargeIcons',
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
                view: 'LargeIcons',
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
                view: 'LargeIcons',
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
                view: 'LargeIcons',
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
                view: 'LargeIcons',
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
                view: 'LargeIcons',
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
                view: 'LargeIcons',
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
                view: 'LargeIcons',
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
                view: 'LargeIcons',
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
        it('for showThumbnail', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
            setTimeout(function () {
                let img: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_largeicons').querySelectorAll('.e-list-img');
                expect(img.length).toBe(1);
                feObj.destroy();
                feObj = new FileManager({
                    view: 'LargeIcons',
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
                setTimeout(function () {
                    let img1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_largeicons').querySelectorAll('.e-list-img');
                    expect(img1.length).toBe(1);
                    feObj.destroy();
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
                    setTimeout(function () {
                        let img2: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_largeicons').querySelectorAll('.e-list-img');
                        expect(img2.length).toBe(0);
                        feObj.destroy();
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
                        setTimeout(function () {
                            let img3: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_largeicons').querySelectorAll('.e-list-img');
                            expect(img3.length).toBe(0);
                            done();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });
        it('for enableRtl true test case ', () => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
            expect(feObj.contextmenuModule.contextMenu.element.parentElement.classList.contains('e-rtl')).toEqual(true);
            feObj.destroy();
            expect(feObj.element.classList.contains('e-rtl')).toEqual(false);            
        });
        it('for enableRtl false test case ', () => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
            expect(feObj.contextmenuModule.contextMenu.element.parentElement.classList.contains('e-rtl')).toEqual(false);
            feObj.destroy();
            expect(feObj.element.classList.contains('e-rtl')).toEqual(false);            
        });
        it('for path', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data16)
            });
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree_1");
                expect(treeLi.length).toEqual(6);
                expect(largeLi.length).toEqual(1);
                done();
            }, 500);
        });
        it('for path with id', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                let addressLi: any = document.getElementById('file_breadcrumbbar').querySelectorAll('.e-address-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree_3_0");
                expect(treeLi.length).toEqual(9);
                expect(largeLi.length).toEqual(6);
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
                view: 'LargeIcons',
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
                let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(li[0].getAttribute('aria-selected')).toEqual('true');
                expect(li[4].getAttribute('aria-selected')).toEqual('true');
                done();
            }, 400);
        });
        it('for selectedItems with id', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
                let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(li[0].getAttribute('aria-selected')).toEqual('true');
                expect(li[4].getAttribute('aria-selected')).toEqual('true');
                done();
            }, 400);
        });

        it('for sorting - Default value', (done) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
                let items: any = document.getElementById('file_tb_sortby');
                items.click();
                expect(document.getElementById('file_ddl_ascending').children[0].classList.contains('e-fe-tick')).toBe(true);
                items.click();
                expect(document.getElementById('file_largeicons').querySelectorAll('.e-list-text').length).toEqual(3);
                expect(document.getElementById('file_largeicons').querySelectorAll('.e-list-text')[0].textContent).toBe('Apple');
                expect(document.getElementById('file_largeicons').querySelectorAll('.e-list-text')[1].textContent).toBe('Music');
                done();
            }, 400);
        });

        it('for sorting - Descending value', (done) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
                let items: any = document.getElementById('file_tb_sortby');
                items.click();
                expect(document.getElementById('file_ddl_descending').children[0].classList.contains('e-fe-tick')).toBe(true);
                items.click();
                expect(document.getElementById('file_largeicons').querySelectorAll('.e-list-text').length).toEqual(3);
                expect(document.getElementById('file_largeicons').querySelectorAll('.e-list-text')[0].textContent).toBe('Videos');
                expect(document.getElementById('file_largeicons').querySelectorAll('.e-list-text')[2].textContent).toBe('Apple');
                done();
            },400);
        });
        it('for sorting - None value', (done) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
                let items: any = document.getElementById('file_tb_sortby');
                items.click();
                expect(document.getElementById('file_ddl_none').children[0].classList.contains('e-fe-tick')).toBe(true);
                items.click();
                expect(document.getElementById('file_largeicons').querySelectorAll('.e-list-text').length).toEqual(3);
                expect(document.getElementById('file_largeicons').querySelectorAll('.e-list-text')[0].textContent).toBe('Music');
                expect(document.getElementById('file_largeicons').querySelectorAll('.e-list-text')[1].textContent).toBe('Videos');
                done();
            },400);
        });
    });
    describe('popupTarget property testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: FileManager;
        let ele: HTMLElement;
        let target: any;
        let j:number=0;
        let name: string = null;
        let dblclickevent: any;
        let originalTimeout: any;
        beforeEach((done) => {
           j= 0; name = null;
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'LargeIcons',
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
                rootAliasName: "My Drive"
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
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
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
            feObj.beforePopupOpen = (args: BeforePopupOpenCloseEventArgs) => { args.cancel = true; j++; target = args.popupModule.target }
            let item: any = document.getElementById('file_tb_newfolder');
            item.click();
            expect(target).toBe('BODY');
            expect(target).not.toBe('#' + feObj.element.id);
            expect(j).toBe(1);
        });

        it('for create folder', () => {
            name = 'Create Folder';
            let item: any = document.getElementById('file_tb_newfolder');
            item.click();
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
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
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[0].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[1].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(document.getElementById('file_largeicons').querySelectorAll('li')[4].classList.contains('e-blur')).toBe(true);
            expect(document.getElementById('file_largeicons').querySelectorAll('li')[0].classList.contains('e-blur')).toBe(true);
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickRead2)
            });
            setTimeout(function () {
                expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(5);
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
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(6);
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
                        expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(7);
                        expect(j).toBe(1);
                        expect(target).toBe('BODY');
                        expect(target).not.toBe('#' + feObj.element.id);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });

        it('for upload and for Upload retry', (done) => {
            name = 'Upload';
            expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(5);
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
            setTimeout(function () {
                (<HTMLElement>document.querySelector('.e-dlg-closeicon-btn')).click();
                expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(6);
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
                        expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(6);
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
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[1].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let items: any = document.getElementById('file_tb_details');
            items.click();
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
                expect(j).toBe(1);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                done();
            }, 500);
        });

        it('for Extension', () => {
            name = 'Rename'
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let items: any = document.getElementsByClassName('e-fe-rename');
            items[0].click();
            let ntr: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-text');
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
                feObj.selectedItems = ['Food'];
                name = 'Rename';
                item = document.getElementById('file_tb_rename');
                item.click();
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(j).toBe(3);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                feObj.selectedItems = ['Food'];
                name = 'Delete';
                item = document.getElementById('file_tb_delete');
                item.click();
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(j).toBe(4);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                feObj.selectedItems =[];
                name = 'Rename'
                let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4].querySelector('.e-frame.e-icons');
                mouseEventArgs.target = Li;
                tapEvent.tapCount = 1;
                (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
                let items: any = document.getElementsByClassName('e-fe-rename');
                items[0].click();
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-text');
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