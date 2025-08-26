/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { data1, dataDelete, folderRename, rename, singleSelectionDetails, dataSortbySize, data5, dataContextMenu, data11, accessData1, accessDetails1, accessDetails2, accessData2, data18, accessSearchData } from '../data';
import { MenuOpenEventArgs, MenuClickEventArgs } from '../../../src';
import { ContextMenu } from '@syncfusion/ej2-navigations';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);


describe('FileManager control Grid view', () => {
    describe('context menu testing', () => {
        let i: number = 0;
        let feObj: FileManager;
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
                fileOpen: () => { i++ },
                showThumbnail: false
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
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                done();
            }, 500);
        });
        afterEach((): void => {
            i = 0;
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('setmodel context menu testing', () => {
            feObj.contextMenuSettings.visible = false;
            feObj.dataBind();
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            expect(el !== null).toBe(true);
            expect(isNullOrUndefined((feObj as FileManager).contextmenuModule)).toBe(true);
            feObj.contextMenuSettings.visible = true;
            feObj.dataBind();
            el = document.getElementById(feObj.element.id + '_contextmenu');
            expect(el !== null).toBe(true);
            expect(isNullOrUndefined((feObj as FileManager).contextmenuModule)).toBe(false);
        });
        it('folder context menu open process testing', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
            expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
            sourceElement.element.querySelectorAll('li')[0].click();
            expect(i === 0).toBe(false);
        });
        it('file context menu open process testing', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([4]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(4).getElementsByTagName('td')[2];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
            expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
            sourceElement.element.querySelectorAll('li')[0].click();
            expect(i === 1).toBe(true);
            expect(feObj.viewerObj.visible).toBe(true);
            feObj.viewerObj.hide();
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
            sourceElement.element.querySelectorAll('li')[0].click();
            expect(i === 2).toBe(true);
            expect(feObj.viewerObj.visible).toBe(true);
        });

        it('Opening context menu in empty space area related test case', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let gridEle: any = feObj.detailsviewModule.element.querySelector(".e-gridcontent .e-content");
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            gridEle.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Sort by');
            expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
        });

        it('non-image file context menu open process testing', (done) => {
            let li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(0).getElementsByTagName('td')[2];
            let obj = (feObj.detailsviewModule.gridObj as any);
            (obj as any).dblClickHandler({ target: li });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data11)
            });
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                feObj.detailsviewModule.gridObj.selectRows([1]);
                let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
                expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
                sourceElement.element.querySelectorAll('li')[0].click();
                expect(i > 1).toBe(true);
                done();
            }, 500);
        });

        it('folder context menu in tree view open item testing', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let Li: Element = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[2];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
            expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
        });
        it('folder context menu upload process testing', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            sourceElement.element.querySelectorAll('li')[1].click();
        });
        it('folder context menu Delete item testing', () => {
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            // sourceElement.element.querySelectorAll('li')[7].click();
        });
        it('folder context menu Rename item testing', () => {
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            // sourceElement.element.querySelectorAll('li')[8].click();
        });
        it('folder context menu New folder item testing', () => {
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            // sourceElement.element.querySelectorAll('li')[10].click();
        });
        it('folder context menu details item testing', () => {
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            // sourceElement.element.querySelectorAll('li')[12].click();
        });
        it('file context menu details item testing', () => {
            feObj.detailsviewModule.gridObj.selectRows([0]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(0).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            //sourceElement.element.querySelectorAll('li')[0].click();
        });
        it('folder context in tree view menu details item testing', () => {
            let Li: Element = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            // sourceElement.element.querySelectorAll('li')[4].click();
        });
        it('layout context in tree view menu details item testing', () => {
            let Li: Element = feObj.detailsviewModule.gridObj.element;
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            // sourceElement.element.querySelectorAll('li')[0].click();
        });
        it('layout context in tree view menu details item testing', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let Li: Element = feObj.navigationpaneModule.treeObj.element;
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li').length).toEqual(0);
        });
        it('layout context in Select All item testing', () => {
            let Li: Element = feObj.detailsviewModule.gridObj.element;
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            // sourceElement.element.querySelectorAll('li')[10].click();
        });
        it('mouse click on refresh item', (done) => {
            let ele: any = document.getElementById(feObj.element.id + '_contextmenu');
            let menuObj: any = ele.ej2_instances[0];
            feObj.detailsviewModule.gridObj.selectRows([1, 2]);
            document.getElementById('file_tree').querySelectorAll('li')[1].remove();
            document.getElementById('file_grid').querySelectorAll('.e-row')[0].remove();
            document.getElementsByClassName('e-addressbar-ul')[0].querySelector('li').remove();
            let li: any = document.getElementById('file_tree').querySelectorAll('li');
            let tr: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            let ar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(li.length).toEqual(4);
            expect(tr.length).toEqual(4);
            expect(ar.length).toEqual(0);
            expect(tr[0].getAttribute('aria-selected')).toEqual('true');
            expect(tr[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(tr[1].getAttribute('aria-selected')).toEqual('true');
            expect(tr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            let grid: Element = (<any>feObj.detailsviewModule.gridObj.contentModule).contentPanel.children[0];
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            grid.dispatchEvent(evt);
            setTimeout(function () {
                menuObj.element.querySelector('.e-fe-refresh').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                setTimeout(function () {
                    let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(5);
                    expect(ntr.length).toEqual(5);
                    expect(nar.length).toEqual(1);
                    expect(ntr[1].getAttribute('aria-selected')).toEqual('true');
                    expect(ntr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
                    expect(ntr[2].getAttribute('aria-selected')).toEqual('true');
                    expect(ntr[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
                    done();
                }, 500);
            }, 100);
        });
        it('for enableMenuItems', (done) => {
            feObj.detailsviewModule.gridObj.selectRows([0]);
            const li: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');
            const el: any = document.getElementById(feObj.element.id + '_contextmenu');
            const sourceElement: ContextMenu = el.ej2_instances[0];
            feObj.menuOpen = (args: MenuOpenEventArgs) => {
                feObj.enableMenuItems(['Paste']);
            };
            const evt: MouseEvent = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            li[0].dispatchEvent(evt);
            setTimeout(function () {
                expect(sourceElement.element.querySelectorAll('li')[4].classList.contains('e-disabled')).toBe(false);
                done();
            }, 500);
        });
    });
    describe('for Grid View', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: any;
        let ele: HTMLElement;
        let originalTimeout: any;
        let type: string = "";
        let count: number = 0;
        function menuopened(eventArgs: MenuOpenEventArgs) {
            count++;
            type = eventArgs.menuType;
        }
        function addCustomItems(args: MenuOpenEventArgs) {
            let item: number = (<FileManager>feObj).getMenuItemIndex('Custom1');
            if ((item !== -1) && (args.items[item].items.length === 0)) {
                args.items[item].items = [{
                    text: 'Google',
                    iconCss: "e-fe-tick e-icons",
                    id: 'item1'
                },
                {
                    text: 'Gmail',
                    id: 'item2'
                }];
            }
            if (args.isSubMenu) {
                (<FileManager>feObj).disableMenuItems(['item2']);
            }
            menuopened(args);
        }
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
                responseText: JSON.stringify(dataContextMenu)
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
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let CMenu: ContextMenu = el.ej2_instances[0];
                CMenu.animationSettings = { duration: 0, effect: "None" };
                done();
            }, 500);
        });
        afterEach((): void => {
            count = 0;
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('Grid view context menu open process testing', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([0]);
            let li = feObj.detailsviewModule.gridObj.getRowByIndex(0).getElementsByTagName('td')[2];
            expect(li.querySelector('.e-fe-text').textContent).toBe('New folder');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            sourceElement.element.querySelectorAll('li')[0].click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                let li1: any = document.getElementById('file_grid_content_table').querySelectorAll('tr');
                expect(li1.length).toBe(5);
                done();
            }, 500);
        });
        it('Treeview context menu open process testing', () => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[1];
            mouseEventArgs.target = li.querySelector('.e-fullrow');
            tapEvent.tapCount = 1;
            treeObj.touchClickObj.tap(tapEvent);
            expect(li.textContent).toBe('New folder');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.querySelector('.e-fullrow').dispatchEvent(evt);
            sourceElement.element.querySelectorAll('li')[0].click();
            expect(feObj.activeModule).toEqual("navigationpane");
            expect(li.querySelector(".e-icons")).toBe(null);
        });
        it('Treeview context menu details option testing', () => {
            let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[1];
            mouseEventArgs.target = li.querySelector('.e-fullrow');
            tapEvent.tapCount = 1;
            treeObj.touchClickObj.tap(tapEvent);
            expect(li.textContent).toBe('New folder');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.querySelector('.e-fullrow').dispatchEvent(evt);
            sourceElement.element.querySelector('#file_cm_details').click();
            expect(ntr[0].textContent).toBe("New folder");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(singleSelectionDetails)
            });
            expect(document.getElementById('file_dialog_title').textContent).toBe('Documents');
            expect(document.querySelectorAll('.e-fe-value').length).toBe(4);
            expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder');
            expect((<any>document.querySelectorAll('.e-fe-value')[2]).textContent).toBe('/Documents');
            expect((<any>document.querySelectorAll('.e-fe-value')[3]).textContent).toBe('October 16, 2018 19:43:17');
        });
        it('Treeview context menu upload process when select grid view item', () => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([0]);
            let li = feObj.detailsviewModule.gridObj.getRowByIndex(0).getElementsByTagName('td')[2];
            expect(li.querySelector('.e-fe-text').textContent).toBe('New folder');
            let li1: any = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[1];
            mouseEventArgs.target = li1.querySelector('.e-fullrow');
            tapEvent.tapCount = 1;
            treeObj.touchClickObj.tap(tapEvent);
            expect(li1.textContent).toBe('New folder');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li1.querySelector('.e-fullrow').dispatchEvent(evt);
            sourceElement.element.querySelectorAll('li')[1].click();
            let fileObj: File = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" })
            let eventArgs: any = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            let uploadObj: any = document.querySelector('#' + feObj.element.id + '_upload');
            uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
            expect(uploadObj.ej2_instances[0].fileList.length).toEqual(1);
        });


        it('Toolbar context menu open process testing', () => {
            let toolbarObj: any = (document.getElementById("file_toolbar") as any).ej2_instances[0];
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            toolbarObj.element.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li').length).toBe(0);
        });

        it('folder context menu with open', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
            expect(li.length).toBe(5);
            feObj.detailsviewModule.gridObj.selectRows([0]);
            expect(li[0].textContent).toBe('New folder');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li[0].dispatchEvent(evt);
            sourceElement.element.querySelectorAll('li')[0].click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                let li1: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
                expect(li1.length).toBe(5);
                expect(document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li')[1].textContent).toBe("New folder");
                let li2: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                expect((li2[0] as Element).classList.contains('e-active')).toBe(false);
                expect((li2[1] as Element).classList.contains('e-active')).toBe(true);
                expect((li2[1] as HTMLElement).innerText.trim()).toBe('New folder');
                done();
            }, 500);
        });

        it('folder context menu with delete', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');
            expect(li.length).toEqual(5);
            expect(ntr.length).toEqual(5);
            feObj.detailsviewModule.gridObj.selectRows([0]);
            expect(ntr[0].textContent).toBe('New folder');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            ntr[0].dispatchEvent(evt);
            sourceElement.element.querySelector('#file_cm_delete').click();
            (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(dataDelete)
            });
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
                expect(nli.length).toEqual(4);
                expect(ntr.length).toEqual(4);
                done();
            }, 500);
        });
        it('folder context menu with rename', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
            expect(li.length).toEqual(5);
            expect(ntr.length).toEqual(5);
            feObj.detailsviewModule.gridObj.selectRows([0]);
            expect(ntr[0].textContent).toBe('New folder');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            ntr[0].dispatchEvent(evt);
            sourceElement.element.querySelector('#file_cm_rename').click();
            expect(ntr[0].textContent).toBe("New folder");
            (<HTMLInputElement>document.getElementById('rename')).value = "My Folder";
            (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
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
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(5);
                expect(ntr.length).toEqual(5);
                expect(nar.length).toEqual(1);
                expect(ntr[2].textContent).toBe("My Folder");
                expect(nli[1].textContent).toBe("My Folder");
                done();
            }, 500);
        });
        it('folder context menu with details', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
            expect(li.length).toEqual(5);
            expect(ntr.length).toEqual(5);
            feObj.detailsviewModule.gridObj.selectRows([0]);
            expect(ntr[0].textContent).toBe('New folder');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            ntr[0].dispatchEvent(evt);
            sourceElement.element.querySelector('#file_cm_details').click();
            expect(ntr[0].textContent).toBe("New folder");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(singleSelectionDetails)
            });
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(5);
                expect(ntr.length).toEqual(5);
                expect(nar.length).toEqual(1);
                expect(document.getElementById('file_dialog_title').textContent).toBe('Documents')
                expect(document.querySelectorAll('.e-fe-value').length).toBe(4)
                expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder')
                // expect((<any>document.querySelectorAll('.e-fe-value')[1]).textContent).toBe('0')
                expect((<any>document.querySelectorAll('.e-fe-value')[2]).textContent).toBe('/Documents')
                expect((<any>document.querySelectorAll('.e-fe-value')[3]).textContent).toBe('October 16, 2018 19:43:17')
                done();
            }, 500);
        });
        it('layout context menu with details', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');
            feObj.detailsviewModule.element.click();
            feObj.detailsviewModule.gridObj.selectRows([0]);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li[0].dispatchEvent(evt);
            sourceElement.element.querySelector('#file_cm_details').click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(singleSelectionDetails)
            });
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(5);
                expect(ntr.length).toEqual(5);
                expect(nar.length).toEqual(1);
                expect(document.getElementById('file_dialog_title').textContent).toBe('Documents')
                expect(document.querySelectorAll('.e-fe-value').length).toBe(4)
                expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder')
                // expect((<any>document.querySelectorAll('.e-fe-value')[1]).textContent).toBe('0')
                expect((<any>document.querySelectorAll('.e-fe-value')[2]).textContent).toBe('/Documents')
                expect((<any>document.querySelectorAll('.e-fe-value')[3]).textContent).toBe('October 16, 2018 19:43:17')
                done();
            }, 500);
        });
        it('layout context menu with new folder', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.querySelector('#file_grid .e-content');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            let nli: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
            let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(nli.length).toEqual(5);
            expect(ntr.length).toEqual(5);
            expect(nar.length).toEqual(1);
            sourceElement.element.querySelector('#file_cm_newfolder').click();
            let items: any = document.getElementsByClassName('e-fe-newfolder');
            items[0].click();
            (<HTMLInputElement>document.getElementById('newname')).value = "New Folder";
            (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data5)
            });
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(6);
                expect(ntr.length).toEqual(6);
                expect(nar.length).toEqual(1);
                done();
            }, 500);
        });
        it('layout context menu with refresh', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.querySelector('#file_grid .e-content');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            let nli: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
            let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(nli.length).toEqual(5);
            expect(ntr.length).toEqual(5);
            expect(nar.length).toEqual(1);
            sourceElement.element.querySelector('#file_cm_refresh').click();
            let lgli: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
            feObj.detailsviewModule.gridObj.selectRows([1, 2]);
            document.getElementById('file_tree').querySelectorAll('li')[1].remove();
            lgli[0].remove();
            document.getElementsByClassName('e-addressbar-ul')[0].querySelector('li').remove();
            li = document.getElementById('file_tree').querySelectorAll('li');
            let tr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
            let ar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(li.length).toEqual(4);
            expect(tr.length).toEqual(4);
            expect(ar.length).toEqual(0);
            setTimeout(function () {
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                setTimeout(function () {
                    let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(5);
                    expect(ntr.length).toEqual(5);
                    expect(nar.length).toEqual(1);
                    done();
                }, 500);
            }, 100);
        });
        it('layout context menu with selectAll', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.querySelector('#file_grid .e-content');
            feObj.detailsviewModule.gridObj.selectRows([0, 1, 2]);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            let nli: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
            let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(nli.length).toEqual(5);
            expect(ntr.length).toEqual(5);
            expect(nar.length).toEqual(1);
            sourceElement.element.querySelector('#file_cm_selectall').click();
            nli = document.getElementById('file_tree').querySelectorAll('li');
            ntr = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
            nar = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(nli.length).toEqual(5);
            expect(ntr.length).toEqual(5);
            expect(nar.length).toEqual(1);
            expect(ntr[0].classList.contains('e-active')).toBe(true);
            expect(ntr[1].classList.contains('e-active')).toBe(true);
            expect(ntr[2].classList.contains('e-active')).toBe(true);
            expect(feObj.selectedItems.length).toBe(5);
        });

        it('layout context menu with view', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.querySelector('#file_grid .e-content');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            let nli: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
            let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(nli.length).toEqual(5);
            expect(ntr.length).toEqual(5);
            expect(nar.length).toEqual(1);
            sourceElement.element.querySelector('#file_cm_view').click();
            mouseEventArgs.target = sourceElement.element.querySelectorAll('li')[1];
            mouseEventArgs.type = 'mouseover';
            feObj.contextmenuModule.contextMenu.moverHandler(mouseEventArgs);
            expect(document.getElementById('file_grid').offsetWidth != 0).toEqual(true);
            expect(document.getElementById('file_grid').offsetWidth != 0).toEqual(true);
            expect(document.getElementById('file_largeicons').offsetHeight == 0).toEqual(true);
            expect(document.getElementById('file_largeicons').offsetHeight == 0).toEqual(true);
            (<any>document.querySelector('#file_cm_largeiconsview')).click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                expect(document.getElementById('file_grid').offsetWidth == 0).toEqual(true);
                expect(document.getElementById('file_grid').offsetWidth == 0).toEqual(true);
                expect(document.getElementById('file_largeicons').offsetHeight != 0).toEqual(true);
                expect(document.getElementById('file_largeicons').offsetHeight != 0).toEqual(true);
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(5);
                expect(ntr.length).toEqual(5);
                expect(nar.length).toEqual(1);
                done();
            }, 500);
        });
        it('layout context menu with sortby', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.querySelector('#file_grid .e-content');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            let nli: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
            let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(nli.length).toEqual(5);
            expect(ntr.length).toEqual(5);
            expect(nar.length).toEqual(1);
            sourceElement.element.querySelector('#file_cm_sortby').click();
            mouseEventArgs.target = sourceElement.element.querySelectorAll('li')[0];
            mouseEventArgs.type = 'mouseover';
            feObj.contextmenuModule.contextMenu.moverHandler(mouseEventArgs);
            (<any>document.querySelector('#file_cm_size')).click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(dataSortbySize)
            });
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(5);
                expect(ntr.length).toEqual(5);
                expect(nar.length).toEqual(1);
                expect(ntr[0].textContent).toBe("New folder");
                expect(ntr[1].textContent).toBe("test1");
                done();
            }, 500);
        });
        it('folder context menu - menuType', () => {
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(count).toBe(1);
            expect(type).toBe('folder');
        })
        it('folder context menu based on target - menuType', () => {
            let itemCount: number = 0;
            feObj.menuOpen = (args: MenuOpenEventArgs) => {
                menuopened(args);
                itemCount = args.items.length;
                if ((<any>args.fileDetails[0]).name === 'test1') {
                    args.items.splice((<FileManager>feObj).getMenuItemIndex('Delete'), 1);
                }
            };
            feObj.dataBind();
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(count).toBe(1);
            expect(document.getElementById(feObj.element.id + '_contextmenu').querySelectorAll('li').length).toBe(itemCount-1);
            expect(type).toBe('folder');
        })
        it('file context menu - menuType', () => {
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            feObj.detailsviewModule.gridObj.selectRows([4]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(4).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(count).toBe(1);
            expect(type).toBe('file');
        })
        it("Contextmenu - custom menu items in folder", () => {
            feObj.contextMenuSettings = {
                file: ['Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details', "Openinnewwindow", "OpeninVS", "|", "Giveaccessto"],
                folder: ['Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details', "Custom1", "Custom2", "Custom3"],
                layout: ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll', "Custom1", "Custom2", "Custom3"]
            };
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            let menuItems = document.querySelectorAll("#file_contextmenu .e-menu-item").length;
            expect(menuItems).toBe(10);
            expect(type).toBe('folder');
        });
        it("Contextmenu - custom menu items in file", () => {
            feObj.contextMenuSettings = {
                file: ['Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details', "Openinnewwindow", "OpeninVS", "|", "Giveaccessto"],
                folder: ['Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details', "Custom1", "Custom2", "Custom3"],
                layout: ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll', "Custom1", "Custom2", "Custom3"]
            };
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            feObj.detailsviewModule.gridObj.selectRows([4]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(4).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            let menuItems = document.querySelectorAll("#file_contextmenu .e-menu-item").length;
            expect(menuItems).toBe(11);
            expect(count).toBe(1);
            expect(type).toBe('file')
        });
        it('treeView - contextmenu menuType', () => {
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            let li: Element = document.getElementById('file_tree').querySelectorAll('li')[2];
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            expect(count).toBe(1);
            expect(type).toBe('folder');
        })
        it('layout - contextmenu menuType', () => {
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            let li: any = document.querySelector('#file_grid .e-content');
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            expect(count).toBe(1);
            expect(type).toBe('layout');
        });
        it("Contextmenu - custom menu items in layout", () => {
            feObj.contextMenuSettings = {
                file: ['Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details', "Openinnewwindow", "OpeninVS", "|", "Giveaccessto"],
                folder: ['Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details', "Custom1", "Custom2", "Custom3"],
                layout: ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll', "Custom1", "Custom2", "Custom3"]
            };
            feObj.menuOpen = menuopened;
            feObj.dataBind();
            let Li: Element = document.querySelector("#file_grid .e-content");
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            let menuItems = document.querySelectorAll("#file_contextmenu .e-menu-item").length;
            expect(menuItems).toBe(13);
            expect(count).toBe(1);
            expect(type).toBe('layout');
        });
        it("layout Contextmenu - custom menu items - testing submenu", () => {
            let click: boolean = false;
            feObj.menuOpen = addCustomItems;
            feObj.menuClick = function () { click = true; }
            feObj.contextMenuSettings = {
                file: ['Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details', "Openinnewwindow", "OpeninVS", "|", "Giveaccessto"],
                folder: ['Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details', "Custom1", "Custom2", "Custom3"],
                layout: ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll', "Custom1", "Custom2", "Custom3"]
            };
            feObj.dataBind();
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let sourceElement: any = el.ej2_instances[0];
            let Li: Element = document.querySelector("#file_grid .e-content");
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(count).toBe(1);
            let menuItems = document.querySelectorAll("#file_contextmenu .e-menu-item").length;
            expect(menuItems).toBe(13);
            let menuItem: HTMLElement = <HTMLElement>document.querySelectorAll("#file_contextmenu .e-menu-item")[10];
            mouseEventArgs.target = menuItem;
            mouseEventArgs.type = 'mouseover';
            sourceElement.moverHandler(mouseEventArgs);
            expect(document.getElementById('item2').classList.contains('e-disabled')).toBe(true);
            document.getElementById('item1').click();
            expect(click).toBe(true);
            expect(count).toBe(2);
            expect(type).toBe('layout');
        });
        it("file Contextmenu - custom menu items - testing submenu", () => {
            let click: boolean = false;
            feObj.menuOpen = addCustomItems;
            feObj.menuClick = function () { click = true; }
            feObj.contextMenuSettings = {
                file: ["Custom1", 'Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details', "Openinnewwindow", "OpeninVS", "|", "Giveaccessto"],
                folder: ["Custom1", 'Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details', "Custom4", "Custom2", "Custom3"],
                layout: ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll', "Custom1", "Custom2", "Custom3"]
            };
            feObj.dataBind();
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let sourceElement: any = el.ej2_instances[0];
            feObj.detailsviewModule.gridObj.selectRows([4]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(4).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(count).toBe(1);
            let menuItems = document.querySelectorAll("#file_contextmenu .e-menu-item").length;
            expect(menuItems).toBe(12);
            let menuItem: HTMLElement = <HTMLElement>document.querySelectorAll("#file_contextmenu .e-menu-item")[0];
            mouseEventArgs.target = menuItem;
            mouseEventArgs.type = 'mouseover';
            sourceElement.moverHandler(mouseEventArgs);
            document.getElementById('item1').click();
            expect(click).toBe(true);
            expect(count).toBe(2);
            expect(type).toBe('file');
        });
        it("folder Contextmenu - custom menu items - testing submenu", () => {
            let click: boolean = false;
            feObj.menuOpen = addCustomItems;
            feObj.menuClick = function () { click = true; }
            feObj.contextMenuSettings = {
                file: ["Custom1", 'Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details', "Openinnewwindow", "OpeninVS", "|", "Giveaccessto"],
                folder: ["Custom1", 'Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details', "Custom4", "Custom2", "Custom3"],
                layout: ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll', "Custom1", "Custom2", "Custom3"]
            };
            feObj.dataBind();
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let sourceElement: any = el.ej2_instances[0];
            feObj.detailsviewModule.gridObj.selectRows([2]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(2).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(count).toBe(1);
            let menuItems = document.querySelectorAll("#file_contextmenu .e-menu-item").length;
            expect(menuItems).toBe(11);
            let menuItem: HTMLElement = <HTMLElement>document.querySelectorAll("#file_contextmenu .e-menu-item")[0];
            mouseEventArgs.target = menuItem;
            mouseEventArgs.type = 'mouseover';
            sourceElement.moverHandler(mouseEventArgs);
            document.getElementById('item1').click();
            expect(click).toBe(true);
            expect(count).toBe(2);
            expect(type).toBe('folder');
        });
    });
});
describe('access control context menu testing', () => {
    let feObj: FileManager;
    let ele: HTMLElement;
    let originalTimeout: any;
    beforeEach((): void => {
        jasmine.Ajax.install();
        feObj = undefined;
        ele = createElement('div', { id: 'file' });
        document.body.appendChild(ele);
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    });
    afterEach((): void => {
        jasmine.Ajax.uninstall();
        if (feObj) feObj.destroy();
        ele.remove();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('Search context menu testing', (done: Function) => {
        let i: number = 0;
        feObj = new FileManager({
            view: 'Details',
            fileOpen: () => { i++ },
            ajaxSettings: {
                url: '/FileAccessOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            },
            showThumbnail: false
        });
        feObj.appendTo('#file');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify(accessData1)
        });
        setTimeout(function () {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(9);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'doc';
            searchObj.value = 'doc';
            let eventArgs: any = { value: 'doc', container: searchEle };
            searchObj.input(eventArgs);
            setTimeout(function () {
                this.request = jasmine.Ajax.requests.filter('/FileAccessOperations');
                this.request[this.request.length - 1].respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessSearchData)
                });
                setTimeout(function () {
                    gridLi = document.getElementById('file_grid').querySelectorAll('.e-row');
                    expect(gridLi.length).toEqual(3);
                    feObj.menuClick = (args: MenuClickEventArgs) => {
                        i++;
                        expect((<any>args.fileDetails[0]).name === 'EJ2 File Manager.docx').toBe(true);
                    }
                    let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                    feObj.detailsviewModule.gridObj.selectRows([2]);
                    let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(2).getElementsByTagName('td')[2];
                    let sourceElement: any = el.ej2_instances[0];
                    let evt = document.createEvent('MouseEvents')
                    evt.initEvent('contextmenu', true, true);
                    Li.dispatchEvent(evt);
                    expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
                    expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
                    sourceElement.element.querySelectorAll('li')[0].click();
                    expect(i === 2).toBe(true);
                    done();
                }, 500);
            }, 400);
        }, 500);
    });
    it('mouse click on new folder button', (done: Function) => {
        feObj = new FileManager({
            view: 'Details',
            ajaxSettings: {
                url: '/FileAccessOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            },
            showThumbnail: false
        });
        feObj.appendTo('#file');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify(accessData1)
        });
        setTimeout(function () {
            let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
            menuObj.animationSettings = { effect: 'None' };
            menuObj.dataBind();
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(9);
            let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
            let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
            expect(aTreeLi.length).toEqual(2);
            expect(aGridLi.length).toEqual(4);
            expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
            expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            document.getElementById('file_grid').querySelector('.e-content').dispatchEvent(evt);
            document.getElementById('file_cm_newfolder').click();
            let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
            expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
            let treeLi1: any = treeObj.element.querySelectorAll('li');
            let gridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeLi1.length).toEqual(5);
            expect(gridLi1.length).toEqual(9);
            let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
            let aGridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
            expect(aTreeLi1.length).toEqual(2);
            expect(aGridLi1.length).toEqual(4);
            expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
            expect(gridLi1[1].classList.contains('e-fe-hidden')).toBe(true);
            done();
        }, 500);
    });
    it('mouse click on upload button', (done: Function) => {
        feObj = new FileManager({
            view: 'Details',
            ajaxSettings: {
                url: '/FileAccessOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            },
            showThumbnail: false
        });
        feObj.appendTo('#file');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify(accessData1)
        });
        setTimeout(function () {
            let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
            menuObj.animationSettings = { effect: 'None' };
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(9);
            let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
            let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
            expect(aTreeLi.length).toEqual(2);
            expect(aGridLi.length).toEqual(4);
            expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
            expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            document.getElementById('file_grid').querySelector('.e-content').dispatchEvent(evt);
            document.getElementById('file_cm_upload').click();
            let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
            expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
            let treeLi1: any = treeObj.element.querySelectorAll('li');
            let gridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeLi1.length).toEqual(5);
            expect(gridLi1.length).toEqual(9);
            let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
            let aGridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
            expect(aTreeLi1.length).toEqual(2);
            expect(aGridLi1.length).toEqual(4);
            expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
            expect(gridLi1[1].classList.contains('e-fe-hidden')).toBe(true);
            done();
        }, 500);
    });
    it('mouse click on refresh button', (done: Function) => {
        feObj = new FileManager({
            view: 'Details',
            ajaxSettings: {
                url: '/FileAccessOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            },
            showThumbnail: false
        });
        feObj.appendTo('#file');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify(accessData1)
        });
        setTimeout(function () {
            let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
            menuObj.animationSettings = { effect: 'None' };
            menuObj.dataBind();
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(9);
            let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
            let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
            expect(aTreeLi.length).toEqual(2);
            expect(aGridLi.length).toEqual(4);
            expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
            expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            document.getElementById('file_grid').querySelector('.e-content').dispatchEvent(evt);
            document.getElementById('file_cm_refresh').click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            setTimeout(function () {
                let treeLi1: any = treeObj.element.querySelectorAll('li');
                let gridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi1.length).toEqual(5);
                expect(gridLi1.length).toEqual(9);
                let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi1.length).toEqual(2);
                expect(aGridLi1.length).toEqual(4);
                expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi1[1].classList.contains('e-fe-hidden')).toBe(true);
                done();
            }, 500);
        }, 500);
    });
    it('mouse click on rename button', (done: Function) => {
        feObj = new FileManager({
            view: 'Details',
            ajaxSettings: {
                url: '/FileAccessOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            },
            showThumbnail: false
        });
        feObj.appendTo('#file');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify(accessData1)
        });
        setTimeout(function () {
            let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
            menuObj.animationSettings = { effect: 'None' };
            menuObj.dataBind();
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(9);
            let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
            let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
            expect(aTreeLi.length).toEqual(2);
            expect(aGridLi.length).toEqual(4);
            expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
            expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            select('.e-fe-grid-name', gridLi[1]).dispatchEvent(evt);
            document.getElementById('file_cm_rename').click();
            let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
            expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
            done();
        }, 500);
    });
    it('mouse click on delete button', (done: Function) => {
        feObj = new FileManager({
            view: 'Details',
            ajaxSettings: {
                url: '/FileAccessOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            },
            showThumbnail: false
        });
        feObj.appendTo('#file');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify(accessData1)
        });
        setTimeout(function () {
            let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
            menuObj.animationSettings = { effect: 'None' };
            menuObj.dataBind();
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(9);
            let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
            let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
            expect(aTreeLi.length).toEqual(2);
            expect(aGridLi.length).toEqual(4);
            expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
            expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            gridLi[1].dispatchEvent(evt);
            document.getElementById('file_cm_delete').click();
            let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
            expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
            let treeLi1: any = treeObj.element.querySelectorAll('li');
            let gridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeLi1.length).toEqual(5);
            expect(gridLi1.length).toEqual(9);
            let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
            let aGridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
            expect(aTreeLi1.length).toEqual(2);
            expect(aGridLi1.length).toEqual(4);
            expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
            expect(gridLi1[1].classList.contains('e-fe-hidden')).toBe(true);
            done();
        }, 500);
    });
    it('mouse click on download button', (done: Function) => {
        feObj = new FileManager({
            view: 'Details',
            ajaxSettings: {
                url: '/FileAccessOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            },
            showThumbnail: false
        });
        feObj.appendTo('#file');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify(accessData1)
        });
        setTimeout(function () {
            let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
            menuObj.animationSettings = { effect: 'None' };
            menuObj.dataBind();
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(9);
            let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
            let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
            expect(aTreeLi.length).toEqual(2);
            expect(aGridLi.length).toEqual(4);
            expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
            expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            gridLi[1].dispatchEvent(evt);
            document.getElementById('file_cm_download').click();
            let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
            expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
            done();
        }, 500);
    });
    it('mouse click on details button', (done: Function) => {
        feObj = new FileManager({
            view: 'Details',
            ajaxSettings: {
                url: '/FileAccessOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            },
            showThumbnail: false
        });
        feObj.appendTo('#file');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify(accessData1)
        });
        setTimeout(function () {
            let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
            menuObj.animationSettings = { effect: 'None' };
            menuObj.dataBind();
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(9);
            let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
            let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
            expect(aTreeLi.length).toEqual(2);
            expect(aGridLi.length).toEqual(4);
            expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
            expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            gridLi[1].dispatchEvent(evt);
            document.getElementById('file_cm_details').click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessDetails1)
            });
            setTimeout(function () {
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Downloads");
                expect(dialogObj.element.querySelectorAll('td')[8].innerHTML).toEqual("Permission");
                done();
            }, 500);
        }, 500);
    });
    it('mouse click on delete button with two items selected', (done: Function) => {
        feObj = new FileManager({
            view: 'Details',
            ajaxSettings: {
                url: '/FileAccessOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            },
            showThumbnail: false
        });
        feObj.appendTo('#file');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify(accessData1)
        });
        setTimeout(function () {
            let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
            menuObj.animationSettings = { effect: 'None' };
            menuObj.dataBind();
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(9);
            let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
            let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
            expect(aTreeLi.length).toEqual(2);
            expect(aGridLi.length).toEqual(4);
            expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
            expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
            feObj.detailsviewModule.gridObj.selectRows([1, 2]);
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            gridLi[2].dispatchEvent(evt);
            document.getElementById('file_cm_delete').click();
            let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
            expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
            let treeLi1: any = treeObj.element.querySelectorAll('li');
            let gridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeLi1.length).toEqual(5);
            expect(gridLi1.length).toEqual(9);
            let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
            let aGridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
            expect(aTreeLi1.length).toEqual(2);
            expect(aGridLi1.length).toEqual(4);
            expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
            expect(gridLi1[1].classList.contains('e-fe-hidden')).toBe(true);
            done();
        }, 500);
    });
    it('mouse click on download button with two items selected', (done: Function) => {
        feObj = new FileManager({
            view: 'Details',
            ajaxSettings: {
                url: '/FileAccessOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            },
            showThumbnail: false
        });
        feObj.appendTo('#file');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify(accessData1)
        });
        setTimeout(function () {
            let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
            menuObj.animationSettings = { effect: 'None' };
            menuObj.dataBind();
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(9);
            let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
            let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
            expect(aTreeLi.length).toEqual(2);
            expect(aGridLi.length).toEqual(4);
            expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
            expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
            feObj.detailsviewModule.gridObj.selectRows([1, 2]);
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            gridLi[2].dispatchEvent(evt);
            document.getElementById('file_cm_download').click();
            let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
            expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
            done();
        }, 500);
    });
    it('mouse click on details button with two items selected', (done: Function) => {
        feObj = new FileManager({
            view: 'Details',
            ajaxSettings: {
                url: '/FileAccessOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            },
            showThumbnail: false
        });
        feObj.appendTo('#file');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify(accessData1)
        });
        setTimeout(function () {
            let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
            menuObj.animationSettings = { effect: 'None' };
            menuObj.dataBind();
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(9);
            let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
            let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
            expect(aTreeLi.length).toEqual(2);
            expect(aGridLi.length).toEqual(4);
            expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
            expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
            feObj.detailsviewModule.gridObj.selectRows([1, 2]);
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            gridLi[2].dispatchEvent(evt);
            document.getElementById('file_cm_details').click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessDetails2)
            });
            setTimeout(function () {
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Downloads, Music.png");
                done();
            }, 500);
        }, 500);
    });
    it('mouse click on open button with non access folder/files', (done: Function) => {
        feObj = new FileManager({
            view: 'Details',
            ajaxSettings: {
                url: '/FileAccessOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            },
            showThumbnail: false
        });
        feObj.appendTo('#file');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify(accessData1)
        });
        setTimeout(function () {
            let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
            menuObj.animationSettings = { effect: 'None' };
            menuObj.dataBind();
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(9);
            let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
            let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
            expect(aTreeLi.length).toEqual(2);
            expect(aGridLi.length).toEqual(4);
            expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
            expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            gridLi[1].dispatchEvent(evt);
            document.getElementById('file_cm_open').click();
            let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
            expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
            dialogObj.element.querySelector('.e-primary').click();
            feObj.detailsviewModule.gridObj.selectRows([7]);
            let evt1 = document.createEvent('MouseEvents');
            evt1.initEvent('contextmenu', true, true);
            gridLi[7].dispatchEvent(evt1);
            document.getElementById('file_cm_open').click();
            expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
            done();
        }, 500);
    });
    it('mouse click on open button with access folder/files', (done: Function) => {
        feObj = new FileManager({
            view: 'Details',
            ajaxSettings: {
                url: '/FileAccessOperations',
                uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
            },
            showThumbnail: false
        });
        feObj.appendTo('#file');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify(accessData1)
        });
        setTimeout(function () {
            let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
            menuObj.animationSettings = { effect: 'None' };
            menuObj.dataBind();
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeLi.length).toEqual(5);
            expect(gridLi.length).toEqual(9);
            let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
            let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
            expect(aTreeLi.length).toEqual(2);
            expect(aGridLi.length).toEqual(4);
            expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
            expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
            feObj.detailsviewModule.gridObj.selectRows([0]);
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            gridLi[0].dispatchEvent(evt);
            document.getElementById('file_cm_open').click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData2)
            });
            setTimeout(function () {
                let treeLi1: any = treeObj.element.querySelectorAll('li');
                let gridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi1.length).toEqual(7);
                expect(gridLi1.length).toEqual(12);
                let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi1.length).toEqual(2);
                expect(aGridLi1.length).toEqual(5);
                expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(false);
                expect(gridLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                let evt1 = document.createEvent('MouseEvents');
                evt1.initEvent('contextmenu', true, true);
                gridLi1[2].dispatchEvent(evt1);
                document.getElementById('file_cm_open').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                dialogObj.element.querySelector('.e-primary').click();
                feObj.detailsviewModule.gridObj.selectRows([7]);
                let evt2 = document.createEvent('MouseEvents');
                evt2.initEvent('contextmenu', true, true);
                gridLi1[7].dispatchEvent(evt2);
                document.getElementById('file_cm_open').click();
                let dialogObj1: any = (document.getElementById("file_img_dialog") as any).ej2_instances[0];
                expect(dialogObj1.element.querySelector('.e-dlg-header').innerHTML).toEqual("4.jpg");
                done();
            }, 500);
        }, 500);
    });
});
