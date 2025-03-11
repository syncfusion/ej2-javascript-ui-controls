/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';


import { data1, doubleClickRead, fileCopySuccess, fileCopyRead, folderRead, folderCopy, folderCopySuccess, folderCopyRead, searchpng, data1pasteIN, data1pasteIN2, data1pasteIN3, data1pasteIN4, folderDragSuccess1, folderDragRead, folderDragSuccess2, data18 } from '../data';
import { createElement, closest, isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import { FileDragEventArgs } from '../../../src';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);
describe('FileManager control Details view', () => {
    describe('Cut Copy Paste testing', () => {
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
        let mouseEventArgs: any, tapEvent: any, keyboardEventArgs: any;
        let feObj: FileManager;
        let ele: HTMLElement;
        let dblclickevent: MouseEvent;
        let originalTimeout: any;
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData2,
                contextMenuSettings: {
                    file: ['Cut', 'Copy', '|', 'Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details'],
                    folder: ['Cut', 'Copy', 'Paste', '|', 'Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details'],
                    layout: ['Paste', '|', 'SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll']
                },
                toolbarSettings: {
                    items: ['Cut', 'Copy', 'Paste', 'NewFolder', 'Upload', 'Delete', 'Download', 'Rename', 'SortBy', 'Refresh', 'Selection', 'View', 'Details'],
                },
                searchSettings: { allowSearchOnTyping: false },
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
            keyboardEventArgs = {
                preventDefault: (): void => { },
                action: null,
                target: null,
                stopImmediatePropagation: (): void => { },
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
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('folder context menu testing', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Cut');
            expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(false);
            expect(sourceElement.element.querySelectorAll('li')[1].innerText).toBe('Copy');
            expect((<Element>sourceElement.element.querySelectorAll('li')[1]).classList.contains('e-disabled')).toBe(false);
            expect(sourceElement.element.querySelectorAll('li')[2].innerText).toBe('Paste');
            expect((<Element>sourceElement.element.querySelectorAll('li')[2]).classList.contains('e-disabled')).toBe(true);
        });
        it('folder context menu testing (multiple item copy)', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([0, 2]);
            (<HTMLElement>document.getElementsByClassName('e-fe-copy')[0]).click();
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Cut');
            expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(false);
            expect(sourceElement.element.querySelectorAll('li')[1].innerText).toBe('Copy');
            expect((<Element>sourceElement.element.querySelectorAll('li')[1]).classList.contains('e-disabled')).toBe(false);
            expect(sourceElement.element.querySelectorAll('li')[2].innerText).toBe('Paste');
            expect((<Element>sourceElement.element.querySelectorAll('li')[2]).classList.contains('e-disabled')).toBe(false);
        });
        it('File context menu testing', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([4]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(4).getElementsByTagName('td')[2];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Cut');
            expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(false);
            expect(sourceElement.element.querySelectorAll('li')[1].innerText).toBe('Copy');
            expect((<Element>sourceElement.element.querySelectorAll('li')[1]).classList.contains('e-disabled')).toBe(false);
        });
        it('Layout context menu testing', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([4]);
            let Li: Element = (<any>feObj.detailsviewModule.gridObj.contentModule).contentPanel.firstElementChild;
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Paste');
            expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(true);
        });
        it('Treeview (Root Folder) context menu testing', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[0];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.querySelector('.e-fullrow').dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Cut');
            expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(true);
            expect(sourceElement.element.querySelectorAll('li')[1].innerText).toBe('Copy');
            expect((<Element>sourceElement.element.querySelectorAll('li')[1]).classList.contains('e-disabled')).toBe(true);
            expect(sourceElement.element.querySelectorAll('li')[2].innerText).toBe('Paste');
            expect((<Element>sourceElement.element.querySelectorAll('li')[2]).classList.contains('e-disabled')).toBe(true);
        });
        it('Treeview (Sub-Folder) context menu testing', () => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[1];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.querySelector('.e-fullrow').dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Cut');
            expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(false);
            expect(sourceElement.element.querySelectorAll('li')[1].innerText).toBe('Copy');
            expect((<Element>sourceElement.element.querySelectorAll('li')[1]).classList.contains('e-disabled')).toBe(false);
            expect(sourceElement.element.querySelectorAll('li')[2].innerText).toBe('Paste');
            expect((<Element>sourceElement.element.querySelectorAll('li')[2]).classList.contains('e-disabled')).toBe(true);
        });
        it('Toolbar testing', () => {
            expect(closest(document.getElementsByClassName('e-fe-cut')[0], 'div').classList.contains('e-hidden')).toBe(true);
            expect(closest(document.getElementsByClassName('e-fe-copy')[0], 'div').classList.contains('e-hidden')).toBe(true);
            expect(closest(document.getElementsByClassName('e-fe-paste')[0], 'div').classList.contains('e-hidden')).toBe(true);
            feObj.detailsviewModule.gridObj.selectRows([1]);
            expect(closest(document.getElementsByClassName('e-fe-cut')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-copy')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-paste')[0], 'div').classList.contains('e-hidden')).toBe(true);
        });

        it('Toolbar file copy paste testing', (done) => {
            feObj.detailsviewModule.gridObj.selectRows([4]);
            (<HTMLElement>document.getElementsByClassName('e-fe-copy')[0]).click();
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            feObj.detailsviewModule.gridObj.selectRows([2]);
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[2].firstElementChild.dispatchEvent(dblclickevent);
            setTimeout(function () {
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(1);
                    done();
                }, 500);
            }, 500);
        });

        it('Toolbar file copy paste layout change testing', (done) => {
            feObj.detailsviewModule.gridObj.selectRows([4]);
            (<HTMLElement>document.getElementsByClassName('e-fe-copy')[0]).click();
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            feObj.detailsviewModule.gridObj.selectRows([2]);
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[2].firstElementChild.dispatchEvent(dblclickevent);
            setTimeout(function () {
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(1);
                    expect(feObj.detailsviewModule.gridObj.getSelectedRows().length).toBe(0);
                    (<HTMLElement>document.getElementById('file_tb_view')).click();
                    (<HTMLElement>document.getElementById('file_ddl_large')).click();
                    setTimeout(function () {
                        expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(1);
                        expect(document.getElementById('file_largeicons').querySelectorAll('li.e-active').length).toBe(0);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });

        it('Toolbar file cut paste testing', (done) => {
            feObj.detailsviewModule.gridObj.selectRows([4]);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[4].classList.contains('e-blur')).toBe(true);
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[0].firstElementChild.dispatchEvent(dblclickevent);
            setTimeout(function () {
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(2);
                    done();
                }, 500);
            }, 500);
        });

        it('Toolbar file cut paste(same folder) testing', () => {
            feObj.detailsviewModule.gridObj.selectRows([4]);
            expect(closest(document.getElementsByClassName('e-fe-cut')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-copy')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-paste')[0], 'div').classList.contains('e-hidden')).toBe(true);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(closest(document.getElementsByClassName('e-fe-cut')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-copy')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-paste')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[4].classList.contains('e-blur')).toBe(true);
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
            expect(closest(document.getElementsByClassName('e-fe-cut')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-copy')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-paste')[0], 'div').classList.contains('e-hidden')).toBe(true);
        });

        it('Toolbar file cut layout change testing', (done) => {
            feObj.detailsviewModule.gridObj.selectRows([4]);
            expect(closest(document.getElementsByClassName('e-fe-cut')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-copy')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-paste')[0], 'div').classList.contains('e-hidden')).toBe(true);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(closest(document.getElementsByClassName('e-fe-cut')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-copy')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-paste')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[4].classList.contains('e-blur')).toBe(true);
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            (<HTMLElement>document.getElementById('file_tb_view')).click();
            (<HTMLElement>document.getElementById('file_ddl_large')).click();
            setTimeout(function () {
                expect(document.getElementById('file_largeicons').querySelectorAll('li')[4].classList.contains('e-blur')).toBe(true);
                expect(closest(document.getElementsByClassName('e-fe-cut')[0], 'div').classList.contains('e-hidden')).toBe(false);
                expect(closest(document.getElementsByClassName('e-fe-copy')[0], 'div').classList.contains('e-hidden')).toBe(false);
                expect(closest(document.getElementsByClassName('e-fe-paste')[0], 'div').classList.contains('e-hidden')).toBe(false);
                done();
            }, 500);
        });

        it('Toolbar file cut path change testing', (done) => {
            feObj.detailsviewModule.gridObj.selectRows([4]);
            expect(closest(document.getElementsByClassName('e-fe-cut')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-copy')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-paste')[0], 'div').classList.contains('e-hidden')).toBe(true);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(closest(document.getElementsByClassName('e-fe-cut')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-copy')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(closest(document.getElementsByClassName('e-fe-paste')[0], 'div').classList.contains('e-hidden')).toBe(false);
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[4].classList.contains('e-blur')).toBe(true);
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[2].firstElementChild.dispatchEvent(dblclickevent);
            setTimeout(function () {
                expect(closest(document.getElementsByClassName('e-fe-cut')[0], 'div').classList.contains('e-hidden')).toBe(true);
                expect(closest(document.getElementsByClassName('e-fe-copy')[0], 'div').classList.contains('e-hidden')).toBe(true);
                expect(closest(document.getElementsByClassName('e-fe-paste')[0], 'div').classList.contains('e-hidden')).toBe(false);
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-fullrow');
                treeObj.touchClickObj.tap(tapEvent);
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[4].classList.contains('e-blur')).toBe(false);
                    expect(closest(document.getElementsByClassName('e-fe-cut')[0], 'div').classList.contains('e-hidden')).toBe(true);
                    expect(closest(document.getElementsByClassName('e-fe-copy')[0], 'div').classList.contains('e-hidden')).toBe(true);
                    expect(closest(document.getElementsByClassName('e-fe-paste')[0], 'div').classList.contains('e-hidden')).toBe(false);
                    done();
                }, 500);
            }, 500);
        });

        it('Keyboard file cut paste testing', (done) => {
            feObj.detailsviewModule.gridObj.selectRows([4]);
            keyboardEventArgs.action = 'ctrlX';
            (<any>feObj.detailsviewModule).keyupHandler(keyboardEventArgs);
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[4].classList.contains('e-blur')).toBe(true);
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[2].firstElementChild.dispatchEvent(dblclickevent);
            setTimeout(function () {
                keyboardEventArgs.action = 'ctrlV';
                (<any>feObj.detailsviewModule).keyupHandler(keyboardEventArgs);
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(2);
                    done();
                }, 500);
            }, 500);
        });

        it('Keyboard file copy paste testing', (done) => {
            keyboardEventArgs.action = 'ctrlC';
            (<any>feObj.detailsviewModule).keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.gridObj.selectRows([3]);
            keyboardEventArgs.action = 'ctrlC';
            (<any>feObj.detailsviewModule).keyupHandler(keyboardEventArgs);
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[3].classList.contains('e-blur')).toBe(false);
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[2].firstElementChild.dispatchEvent(dblclickevent);
            setTimeout(function () {
                keyboardEventArgs.action = 'ctrlV';
                (<any>feObj.detailsviewModule).keyupHandler(keyboardEventArgs);
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(3);
                    done();
                }, 500);
            }, 500);
        });

        it('Context menu file copy paste testing', (done) => {
            expect(feObj.selectedItems.length).toBe(0);
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([3]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(3).getElementsByTagName('td')[2];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(feObj.selectedItems.length).toBe(1);
            expect(sourceElement.element.querySelectorAll('li')[1].innerText).toBe('Copy');
            expect((<Element>sourceElement.element.querySelectorAll('li')[1]).classList.contains('e-disabled')).toBe(false);
            sourceElement.element.querySelectorAll('li')[1].click();
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[2].firstElementChild.dispatchEvent(dblclickevent);
            setTimeout(function () {
                expect(feObj.selectedItems.length).toBe(0);
                let Li: Element = (<any>feObj.detailsviewModule.gridObj.contentModule).contentPanel.firstElementChild;
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                expect(feObj.selectedItems.length).toBe(0);
                expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Paste');
                expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(false);
                sourceElement.element.querySelectorAll('li')[0].click();
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(3);
                    done();
                }, 500);
            }, 500);
        });

        it('Context menu file cut paste testing', (done) => {
            expect(feObj.selectedItems.length).toBe(0);
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([3]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(3).getElementsByTagName('td')[2];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(feObj.selectedItems.length).toBe(1);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Cut');
            expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(false);
            sourceElement.element.querySelectorAll('li')[0].click();
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[2].firstElementChild.dispatchEvent(dblclickevent);
            setTimeout(function () {
                expect(feObj.selectedItems.length).toBe(0);
                let Li: Element = (<any>feObj.detailsviewModule.gridObj.contentModule).contentPanel.firstElementChild;
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                expect(feObj.selectedItems.length).toBe(0);
                expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Paste');
                expect((<Element>sourceElement.element.querySelectorAll('li')[0]).classList.contains('e-disabled')).toBe(false);
                sourceElement.element.querySelectorAll('li')[0].click();
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(3);
                    done();
                }, 500);
            }, 500);
        });

        it('Toolbar folder copy paste testing', (done) => {
            feObj.detailsviewModule.gridObj.selectRows([0]);
            (<HTMLElement>document.getElementsByClassName('e-fe-copy')[0]).click();
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            feObj.detailsviewModule.gridObj.selectRows([2]);
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let sourceElement: any = el.ej2_instances[0];
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(2).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[4].innerText).toBe('Open');
            sourceElement.element.querySelectorAll('li')[4].click();
            setTimeout(function () {
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(4);
                    done();
                }, 500);
            }, 500);
        });

        it('Toolbar folder cut paste testing', (done) => {
            feObj.detailsviewModule.gridObj.selectRows([0]);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            feObj.detailsviewModule.gridObj.selectRows([2]);
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let sourceElement: any = el.ej2_instances[0];
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(2).getElementsByTagName('td')[2];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[4].innerText).toBe('Open');
            sourceElement.element.querySelectorAll('li')[4].click();
            setTimeout(function () {
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(4);
                    done();
                }, 500);
            }, 500);
        });

        it('TreeView cut paste testing', (done) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
            expect(li.length).toEqual(4);
            mouseEventArgs.target = li[1].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                li[1].querySelector('.e-fullrow').dispatchEvent(evt);
                expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Cut');
                sourceElement.element.querySelectorAll('li')[0].click();
                expect(feObj.selectedNodes.length).toBe(1);
                expect(feObj.actionRecords.length).toBe(1);
                mouseEventArgs.target = li[3].querySelector('.e-fullrow');
                (<any>feObj.navigationpaneModule.treeObj).touchClickObj.tap(tapEvent);
                setTimeout(function () {
                    li[3].querySelector('.e-fullrow').dispatchEvent(evt);
                    expect(sourceElement.element.querySelectorAll('li')[2].innerText).toBe('Paste');
                    sourceElement.element.querySelectorAll('li')[2].click();
                    setTimeout(function () {
                        expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(3);
                        expect(document.getElementById('file_tree').querySelectorAll('li')[1].innerText).toBe('Downloads');
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });

        it('TreeView copy paste testing', (done) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
            expect(li.length).toEqual(3);
            mouseEventArgs.target = li[1].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                li[1].querySelector('.e-fullrow').dispatchEvent(evt);
                expect(sourceElement.element.querySelectorAll('li')[1].innerText).toBe('Copy');
                sourceElement.element.querySelectorAll('li')[1].click();
                expect(feObj.selectedNodes.length).toBe(1);
                expect(feObj.actionRecords.length).toBe(1);
                mouseEventArgs.target = li[2].querySelector('.e-fullrow');
                (<any>feObj.navigationpaneModule.treeObj).touchClickObj.tap(tapEvent);
                setTimeout(function () {
                    li[2].querySelector('.e-fullrow').dispatchEvent(evt);
                    expect(sourceElement.element.querySelectorAll('li')[2].innerText).toBe('Paste');
                    sourceElement.element.querySelectorAll('li')[2].click();
                    setTimeout(function () {
                        expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(4);
                        expect(document.getElementById('file_tree').querySelectorAll('li')[1].textContent).toBe('Downloads')
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
        it('TreeView copy paste(keyboard) testing', (done: Function) => {
            var treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
            mouseEventArgs.target = li[1].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            keyboardEventArgs.action = 'ctrlC';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[1];
            (feObj.navigationpaneModule as any).keyDown(keyboardEventArgs);
            mouseEventArgs.target = li[2].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            setTimeout(function () {
                keyboardEventArgs.action = 'ctrlV';
                keyboardEventArgs.ctrlKey = true;
                keyboardEventArgs.target = li[2];
                (feObj.navigationpaneModule as any).keyDown(keyboardEventArgs);
                setTimeout(function () {
                    let activeLi: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                    expect((<HTMLElement>activeLi[2]).innerText).toBe("Base");
                    done();
                }, 500);
            }, 500);
        });
        it('TreeView cut paste(keyboard) testing', (done: Function) => {
            var treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
            mouseEventArgs.target = li[1].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            keyboardEventArgs.action = 'ctrlX';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[1];
            (feObj.navigationpaneModule as any).keyDown(keyboardEventArgs);
            expect(li[1].classList.contains('e-blur')).toBe(true);
            mouseEventArgs.target = li[2].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            setTimeout(function () {
                keyboardEventArgs.action = 'ctrlV';
                keyboardEventArgs.ctrlKey = true;
                keyboardEventArgs.target = li[2];
                (feObj.navigationpaneModule as any).keyDown(keyboardEventArgs);
                setTimeout(function () {
                    let activeLi: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                    expect((<HTMLElement>activeLi[2]).innerText).toBe("Base");
                    done();
                }, 500);
            }, 500);
        });

        it('Multiple Item copy paste testing', (done) => {
            feObj.detailsviewModule.gridObj.selectRows([0, 2]);
            (<HTMLElement>document.getElementsByClassName('e-fe-copy')[0]).click();
            expect(feObj.selectedNodes.length).toBe(2);
            expect(feObj.actionRecords.length).toBe(2);
            feObj.detailsviewModule.gridObj.selectRows([1]);
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[1].firstElementChild.dispatchEvent(dblclickevent);
            setTimeout(function () {
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(4);
                    done();
                }, 500);
            }, 500);
        });

        it('Multiple Item cut paste testing', (done) => {
            feObj.detailsviewModule.gridObj.selectRows([0, 2]);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[0].classList.contains('e-blur')).toBe(true);
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[2].classList.contains('e-blur')).toBe(true);
            expect(feObj.selectedNodes.length).toBe(2);
            expect(feObj.actionRecords.length).toBe(2);
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[1].firstElementChild.dispatchEvent(dblclickevent);
            setTimeout(function () {
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(4);
                    done();
                }, 500);
            }, 500);
        });

        it('Multiple Item copy paste(with duplicate) testing', (done) => {
            feObj.detailsviewModule.gridObj.selectRows([0, 2]);
            (<HTMLElement>document.getElementsByClassName('e-fe-copy')[0]).click();
            expect(feObj.selectedNodes.length).toBe(2);
            expect(feObj.actionRecords.length).toBe(2);
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[1].firstElementChild.dispatchEvent(dblclickevent);
            setTimeout(function () {
                expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(4);
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(4);
                    expect(document.getElementById('file_extn_dialog').querySelectorAll('button').length).toBe(3);
                    document.getElementById('file_extn_dialog').querySelectorAll('button')[1].click();
                    document.getElementById('file_extn_dialog').querySelectorAll('button')[2].click();
                    setTimeout(function () {
                        expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(5);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
        
        it('Multiple Item cut paste(with duplicate) testing', (done) => {
            feObj.detailsviewModule.gridObj.selectRows([0, 2]);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[0].classList.contains('e-blur')).toBe(true);
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[2].classList.contains('e-blur')).toBe(true);
            expect(feObj.selectedNodes.length).toBe(2);
            expect(feObj.actionRecords.length).toBe(2);
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[1].firstElementChild.dispatchEvent(dblclickevent);
            setTimeout(function () {
                expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(5);
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(5);
                    done();
                }, 500);
            }, 500);
        });

        it('cut paste(missing error) testing', (done) => {
            feObj.detailsviewModule.gridObj.selectRows([0, 2]);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[1].firstElementChild.dispatchEvent(dblclickevent);
            setTimeout(function () {
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                setTimeout(function () {
                    expect(document.getElementById('file_extn_dialog').querySelector("#file_extn_dialog_title").textContent).toBe('File/Folder exists')
                    document.getElementById('file_extn_dialog').querySelectorAll('button')[1].click();
                    done();
                }, 500);
            }, 500);
        });

        it('cut paste(missing error with duplicate) testing', (done) => {
            feObj.detailsviewModule.gridObj.selectRows([0, 2]);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[1].firstElementChild.dispatchEvent(dblclickevent);
            setTimeout(function () {
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                setTimeout(function () {
                    expect(document.getElementById('file_extn_dialog').querySelector("#file_extn_dialog_title").textContent).toBe('File/Folder exists')
                    document.getElementById('file_extn_dialog').querySelectorAll('button')[1].click();
                    done();
                }, 500);
            }, 500);
        });
        it('Search cut copy testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let treeLi: any = treeObj.element.querySelectorAll('li');
            let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
            expect(treeLi.length).toEqual(3);
            expect(gridLi.length).toEqual(3);
            let searchEle: any = feObj.element.querySelector("#file_search");
            let searchObj: any = searchEle.ej2_instances[0];
            searchEle.value = 'png';
            searchObj.value = 'png';
            let eventArgs: any = { value: 'png', container: searchEle };
            searchObj.change(eventArgs);
            setTimeout(function () {
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(gridLi.length).toEqual(4);
                feObj.detailsviewModule.gridObj.selectRows([1]);
                (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
                mouseEventArgs.target = treeLi[2].querySelector('.e-fullrow');
                (<any>feObj.navigationpaneModule.treeObj).touchClickObj.tap(tapEvent);
                setTimeout(function () {
                    (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                    setTimeout(function () {
                        expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(5);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });

        it('Context menu file cut paste in selected folder testing', (done) => {
            expect(feObj.selectedItems.length).toBe(0);
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(3);
            feObj.detailsviewModule.gridObj.selectRows([2]);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            expect(feObj.selectedItems.length).toBe(1);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(feObj.selectedNodes.length).toBe(1);
            expect(feObj.actionRecords.length).toBe(1);
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            Li.dispatchEvent(evt);
            expect(feObj.selectedItems.length).toBe(1);
            expect(sourceElement.element.querySelectorAll('li')[2].innerText).toBe('Paste');
            sourceElement.element.querySelectorAll('li')[2].click();
            setTimeout(function () {
                expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(2);
                done();
            }, 500);
        });

        it('Toolbar file cut paste testing with rename files', (done) => {
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[1].firstElementChild.dispatchEvent(dblclickevent);
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([3]);
                (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
                (<HTMLElement>document.getElementsByClassName('e-address-list-item')[0].firstElementChild).click();
                setTimeout(function () {
                    feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[0].firstElementChild.dispatchEvent(dblclickevent);
                    setTimeout(function () {
                        (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                        setTimeout(function () {
                            (<HTMLElement>document.querySelector('.e-fe-popup.e-btn.e-primary')).click();
                            setTimeout(function () {
                                expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(6);
                                done();
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });

        it('Toolbar file details with rootAliasName', (done) => {
            feObj.rootAliasName = 'My Drive';
            feObj.dataBind();
            setTimeout(function () {
                (<HTMLElement>document.querySelector('#file_tb_details')).click();
                ((<HTMLElement>document.querySelectorAll('#file_dialog_dialog-content tr')[2].firstChild).nextElementSibling as any).innerText = 'My Drive';
                done();
            }, 500);
        });

        it('Toolbar folder create', (done) => {
            expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(2);
            feObj.createFolder();
            (<any>document.querySelector('.e-fe-popup .e-input')).value = "New folder";
            (<HTMLElement>document.querySelector('.e-fe-popup.e-btn.e-primary')).click();
            setTimeout(function () {
                expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(3);
                done();
            }, 500);
        });

        it('Toolbar file copy paste testing with access details', (done) => {
            const permission: object = {
                'copy': false,
                'download': false,
                'write': false,
                'writeContents': false,
                'read': true,
                'upload': false,
                'message': ''
            };
            feObj.fileSystemData.filter((file: any) => file.name === 'Downloads')[0].permission = permission;
            feObj.refresh();
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([1]);
                (<HTMLElement>document.getElementsByClassName('e-fe-copy')[0]).click();
                expect(feObj.selectedNodes.length).toBe(1);
                expect(feObj.actionRecords.length).toBe(1);
                feObj.detailsviewModule.gridObj.selectRows([0]);
                feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[0].firstElementChild.dispatchEvent(dblclickevent);
                setTimeout(function () {
                    (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                    setTimeout(function () {
                        expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(6);
                        feObj.closeDialog();
                        feObj.path = '/';
                        feObj.refresh();
                        setTimeout(function () {
                            feObj.detailsviewModule.gridObj.selectRows([0]);
                            (<HTMLElement>document.getElementsByClassName('e-fe-copy')[0]).click();
                            expect(feObj.selectedNodes.length).toBe(1);
                            expect(feObj.actionRecords.length).toBe(1);
                            feObj.detailsviewModule.gridObj.selectRows([1]);
                            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[1].firstElementChild.dispatchEvent(dblclickevent);
                            setTimeout(function () {
                                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                                setTimeout(function () {
                                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(4);
                                    done();
                                }, 500);
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });
        it('TreeView right click copy and layout paste testing', (done) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
            mouseEventArgs.originalEvent.target = li[2].querySelector('.e-fullrow');
            mouseEventArgs.originalEvent.which = 3;
            treeObj.clickHandler(mouseEventArgs);
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                li[2].querySelector('.e-fullrow').dispatchEvent(evt);
                expect(sourceElement.element.querySelectorAll('li')[1].innerText).toBe('Copy');
                sourceElement.element.querySelectorAll('li')[1].click();
                expect(feObj.selectedNodes.length).toBe(1);
                expect(feObj.actionRecords.length).toBe(1);
                setTimeout(function () {
                    let Layout: Element = (<any>feObj.detailsviewModule.gridObj.contentModule).contentPanel.firstElementChild;
                    Layout.dispatchEvent(evt);
                    expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Paste');
                    sourceElement.element.querySelectorAll('li')[0].click();
                    setTimeout(function () {
                        expect(document.getElementById('file_extn_dialog').querySelector("#file_extn_dialog_title").textContent).toBe('File/Folder exists')
                        document.getElementById('file_extn_dialog').querySelectorAll('button')[1].click();
                        setTimeout(function () {
                            expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(4);
                            done();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });
    });
});