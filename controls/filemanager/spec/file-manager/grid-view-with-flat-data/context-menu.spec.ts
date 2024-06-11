/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { MenuOpenEventArgs, MenuClickEventArgs } from '../../../src';
import { ContextMenu } from '@syncfusion/ej2-navigations';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);


describe('FileManager control Grid view', () => {
    let flatData2: any = [
        {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T18:16:38.4384894+05:30",
            filterPath: "",
            hasChild: true,
            id: '0',
            isFile: false,
            name: "Files",
            parentId: null,
            size: 0,
            type: "",
        }, {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            hasChild: true,
            id: '1',
            isFile: false,
            name: "Documents",
            parentId: '0',
            size: 0,
            type: "",
        }, {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\Documents\\",
            hasChild: false,
            id: '7',
            isFile: false,
            name: "NewFolder",
            parentId: '1',
            size: 0,
            type: "",
        }, {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            hasChild: false,
            id: '2',
            isFile: false,
            name: "Downloads",
            parentId: '0',
            size: 0,
            type: "",
        },
        {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            hasChild: false,
            id: '3',
            isFile: false,
            name: "Base",
            parentId: '0',
            size: 0,
            type: "",
        },
        {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\Base\\",
            hasChild: false,
            id: '8',
            isFile: true,
            name: "textFile.txt",
            parentId: '3',
            size: 0,
            type: ".txt",
        },
        {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            hasChild: false,
            id: '4',
            isFile: true,
            name: "newfile.txt",
            parentId: '0',
            size: 0,
            type: ".txt",
        },
        {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            hasChild: false,
            id: '5',
            isFile: true,
            name: "textDocument.doc",
            parentId: '0',
            size: 0,
            type: ".doc",
            showHiddenItems: false
        },
        {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            hasChild: false,
            id: '6',
            isFile: true,
            name: "Adam.png",
            parentId: '0',
            size: 0,
            type: ".png",
            imgUrl: "https://ej2.syncfusion.com/demos/src/treeview/images/employees/7.png"
        }
    ];
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
                fileSystemData: flatData2,
                fileOpen: () => { i++ },
                showThumbnail: false
            });
            feObj.appendTo('#file');
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
            feObj.detailsviewModule.gridObj.selectRows([0]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(3).getElementsByTagName('td')[2];
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
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                feObj.detailsviewModule.gridObj.selectRows([1]);
                let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(0).getElementsByTagName('td')[2];
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
            expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(true);
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
        });
        it('folder context menu Rename item testing', () => {
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
        });
        it('folder context menu New folder item testing', () => {
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
        });
        it('folder context menu details item testing', () => {
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
        });
        it('file context menu details item testing', () => {
            feObj.detailsviewModule.gridObj.selectRows([0]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(0).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
        });
        it('folder context in tree view menu details item testing', () => {
            let Li: Element = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
        });
        it('layout context in tree view menu details item testing', () => {
            let Li: Element = feObj.detailsviewModule.gridObj.element;
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
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
            expect(li.length).toEqual(3);
            expect(tr.length).toEqual(5);
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
                setTimeout(function () {
                    let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(4);
                    expect(ntr.length).toEqual(6);
                    expect(nar.length).toEqual(1);
                    expect(ntr[1].getAttribute('aria-selected')).toEqual('true');
                    expect(ntr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
                    expect(ntr[2].getAttribute('aria-selected')).toEqual('true');
                    expect(ntr[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
                    done();
                }, 500);
            }, 100);
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
                fileSystemData: flatData2,
                showThumbnail: false
            });
            feObj.appendTo('#file');
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
            expect(li.querySelector('.e-fe-text').textContent).toBe('Base');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            sourceElement.element.querySelectorAll('li')[0].click();
            setTimeout(function () {
                let li1: any = document.getElementById('file_grid_content_table').querySelectorAll('tr');
                expect(li1.length).toBe(1);
                done();
            }, 500);
        });
        it('Treeview context menu open process testing', () => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[2];
            mouseEventArgs.target = li.querySelector('.e-fullrow');
            tapEvent.tapCount = 1;
            treeObj.touchClickObj.tap(tapEvent);
            expect(li.textContent).toBe('Downloads');
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
            let li: any = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[2];
            mouseEventArgs.target = li.querySelector('.e-fullrow');
            tapEvent.tapCount = 1;
            treeObj.touchClickObj.tap(tapEvent);
            expect(li.textContent).toBe('Downloads');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.querySelector('.e-fullrow').dispatchEvent(evt);
            sourceElement.element.querySelector('#file_cm_details').click();
            expect(ntr[2].textContent).toBe("Downloads");
            expect(document.getElementById('file_dialog_title').textContent).toBe('Downloads');
            expect(document.querySelectorAll('.e-fe-value').length).toBe(4);
            expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder');
            expect((<any>document.querySelectorAll('.e-fe-value')[2]).textContent).toBe('Files/Downloads');
        });
        it('Treeview context menu upload process when select grid view item', () => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([0]);
            let li = feObj.detailsviewModule.gridObj.getRowByIndex(0).getElementsByTagName('td')[2];
            expect(li.querySelector('.e-fe-text').textContent).toBe('Base');
            let li1: any = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[3];
            mouseEventArgs.target = li1.querySelector('.e-fullrow');
            tapEvent.tapCount = 1;
            treeObj.touchClickObj.tap(tapEvent);
            expect(li1.textContent).toBe('Base');
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
            expect(li.length).toBe(6);
            feObj.detailsviewModule.gridObj.selectRows([1]);
            expect(li[1].textContent).toBe('Documents');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li[1].dispatchEvent(evt);
            sourceElement.element.querySelectorAll('li')[0].click();
            setTimeout(function () {
                let li1: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');
                expect(li1.length).toBe(1);
                expect(document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li')[1].textContent).toBe("Documents");
                let li2: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                expect((li2[0] as Element).classList.contains('e-active')).toBe(false);
                expect((li2[1] as Element).classList.contains('e-active')).toBe(true);
                expect((li2[1] as HTMLElement).innerText.trim()).toBe('Documents');
                done();
            }, 500);
        });

        it('folder context menu with delete', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');
            expect(li.length).toEqual(4);
            expect(ntr.length).toEqual(6);
            feObj.detailsviewModule.gridObj.selectRows([0]);
            expect(ntr[0].textContent).toBe('Base');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            ntr[0].dispatchEvent(evt);
            sourceElement.element.querySelector('#file_cm_delete').click();
            (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
                expect(nli.length).toEqual(3);
                expect(ntr.length).toEqual(5);
                done();
            }, 500);
        });
        it('folder context menu with rename', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
            expect(li.length).toEqual(3);
            expect(ntr.length).toEqual(5);
            feObj.detailsviewModule.gridObj.selectRows([0]);
            expect(ntr[0].textContent).toBe('Documents');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            ntr[0].dispatchEvent(evt);
            sourceElement.element.querySelector('#file_cm_rename').click();
            expect(ntr[0].textContent).toBe("Documents");
            (<HTMLInputElement>document.getElementById('rename')).value = "My Folder";
            (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(3);
                expect(ntr.length).toEqual(5);
                expect(nar.length).toEqual(1);
                expect(ntr[1].textContent).toBe("My Folder");
                expect(nli[1].textContent).toBe("My Folder");
                done();
            }, 500);
        });
        it('folder context menu with details', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
            expect(li.length).toEqual(3);
            expect(ntr.length).toEqual(5);
            feObj.detailsviewModule.gridObj.selectRows([0]);
            expect(ntr[0].textContent).toBe('Downloads');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            ntr[0].dispatchEvent(evt);
            sourceElement.element.querySelector('#file_cm_details').click();
            expect(ntr[0].textContent).toBe("Downloads");
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(3);
                expect(ntr.length).toEqual(5);
                expect(nar.length).toEqual(1);
                expect(document.getElementById('file_dialog_title').textContent).toBe('Downloads')
                expect(document.querySelectorAll('.e-fe-value').length).toBe(4)
                expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder')
                expect((<any>document.querySelectorAll('.e-fe-value')[2]).textContent).toBe('Files/Downloads')
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
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(3);
                expect(ntr.length).toEqual(5);
                expect(nar.length).toEqual(1);
                expect(document.getElementById('file_dialog_title').textContent).toBe('Downloads')
                expect(document.querySelectorAll('.e-fe-value').length).toBe(4)
                expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder')
                expect((<any>document.querySelectorAll('.e-fe-value')[2]).textContent).toBe('Files/Downloads')
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
            expect(nli.length).toEqual(3);
            expect(ntr.length).toEqual(5);
            expect(nar.length).toEqual(1);
            sourceElement.element.querySelector('#file_cm_newfolder').click();
            let items: any = document.getElementsByClassName('e-fe-newfolder');
            items[0].click();
            (<HTMLInputElement>document.getElementById('newname')).value = "New Folder";
            (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(4);
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
            expect(nli.length).toEqual(4);
            expect(ntr.length).toEqual(6);
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
            expect(li.length).toEqual(3);
            expect(tr.length).toEqual(5);
            expect(ar.length).toEqual(0);
            setTimeout(function () {
                setTimeout(function () {
                    let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(3);
                    expect(ntr.length).toEqual(6);
                    expect(nar.length).toEqual(0);
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
            expect(nli.length).toEqual(4);
            expect(ntr.length).toEqual(6);
            expect(nar.length).toEqual(1);
            sourceElement.element.querySelector('#file_cm_selectall').click();
            nli = document.getElementById('file_tree').querySelectorAll('li');
            ntr = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
            nar = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(nli.length).toEqual(4);
            expect(ntr.length).toEqual(6);
            expect(nar.length).toEqual(1);
            expect(ntr[0].classList.contains('e-active')).toBe(true);
            expect(ntr[1].classList.contains('e-active')).toBe(true);
            expect(ntr[2].classList.contains('e-active')).toBe(true);
            expect(feObj.selectedItems.length).toBe(6);
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
            expect(nli.length).toEqual(4);
            expect(ntr.length).toEqual(6);
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
            setTimeout(function () {
                expect(document.getElementById('file_grid').offsetWidth == 0).toEqual(true);
                expect(document.getElementById('file_grid').offsetWidth == 0).toEqual(true);
                expect(document.getElementById('file_largeicons').offsetHeight != 0).toEqual(true);
                expect(document.getElementById('file_largeicons').offsetHeight != 0).toEqual(true);
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(4);
                expect(ntr.length).toEqual(6);
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
            expect(nli.length).toEqual(4);
            expect(ntr.length).toEqual(6);
            expect(nar.length).toEqual(1);
            sourceElement.element.querySelector('#file_cm_sortby').click();
            mouseEventArgs.target = sourceElement.element.querySelectorAll('li')[0];
            mouseEventArgs.type = 'mouseover';
            feObj.contextmenuModule.contextMenu.moverHandler(mouseEventArgs);
            (<any>document.querySelector('#file_cm_size')).click();
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-fe-grid-name');;
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(4);
                expect(ntr.length).toEqual(6);
                expect(nar.length).toEqual(1);
                expect(ntr[0].textContent).toBe("Downloads");
                expect(ntr[1].textContent).toBe("My Folder");
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
            expect(document.getElementById(feObj.element.id + '_contextmenu').querySelectorAll('li').length).toBe(itemCount);
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
                fileSystemData: flatData2,
                showThumbnail: false
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(4);
                expect(gridLi.length).toEqual(6);
                let searchEle: any = feObj.element.querySelector("#file_search");
                let searchObj: any = searchEle.ej2_instances[0];
                searchEle.value = 'doc';
                searchObj.value = 'doc';
                let eventArgs: any = { value: 'doc', container: searchEle };
                searchObj.input(eventArgs);
                setTimeout(function () {
                    setTimeout(function () {
                        gridLi = document.getElementById('file_grid').querySelectorAll('.e-row');
                        expect(gridLi.length).toEqual(1);
                        feObj.menuClick = (args: MenuClickEventArgs) => {
                            i++;
                            expect((<any>args.fileDetails[0]).name === 'textDocument.doc').toBe(true);
                        }
                        let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                        feObj.detailsviewModule.gridObj.selectRows([0]);
                        let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(0).getElementsByTagName('td')[2];
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
    });
});
