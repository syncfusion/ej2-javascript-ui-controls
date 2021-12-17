import { DocumentEditor } from '../../src/document-editor/document-editor';
import { PageLayoutViewer, SfdtExport, DocumentHelper, FontDialog } from '../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { TextPosition } from '../../src/index';
import { ContextMenu } from '../../src/document-editor/implementation/context-menu';
import { Editor } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { Selection } from '../../src/index';
import { ParagraphDialog } from '../../src/document-editor/implementation/dialogs/paragraph-dialog';
import { TablePropertiesDialog } from '../../src/document-editor/implementation/dialogs/table-properties-dialog';
import { ImageResizer } from '../../src/index';
import { MenuItemModel } from '@syncfusion/ej2-navigations';
/**
 * Context Menu Spec
 */
describe('Context Menu Testing - 1', () => {
    let editor: DocumentEditor;
    let menu: ContextMenu;
    let imageResizer: ImageResizer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ContextMenu, Editor, EditorHistory, Selection, ImageResizer);
        editor = new DocumentEditor({
            enableContextMenu: true, enableEditor: true, enableImageResizer: true,
            enableSelection: true, isReadOnly: false
        });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        menu = editor.contextMenuModule;
        imageResizer = editor.imageResizerModule;
    });
    afterAll((done) => {
        editor.destroy();
        menu.destroy();
        editor = undefined;
        menu = undefined;
        imageResizer.destroy();
        imageResizer = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    // it('Context menu validation', () => {
    //     let event: Event = document.createEvent('MouseEvent');
    //     event.initEvent('contextmenu', true, true);
    //     editor.documentHelper.viewerContainer.dispatchEvent(event);
    //     expect((menu as any).contextMenu.style.display).not.toBe('none');
    //     let mouseEvent: Event = document.createEvent('MouseEvent');
    //     mouseEvent.initEvent('mousedown', true, true);
    //     document.dispatchEvent(mouseEvent);
    //     expect(menu.contextMenuInstance.element.style.display).toBe('none');
    // });
    it('Context Menu Opening Texting without selection', () => {
console.log('Context Menu Opening Texting without selection');
        editor.editorModule.insertText('Syncfusion Software');
        let event: MouseEvent = document.createEvent('MouseEvent');
        event.initEvent('contextmenu', true, true);
        editor.documentHelper.viewerContainer.dispatchEvent(event);
        for (let i: number = 0; i < (menu.contextMenuInstance.items as MenuItemModel[]).length; i++) {
            if ((menu.contextMenuInstance.items as MenuItemModel[])[i].text === 'Cut' ||
                (menu.contextMenuInstance.items as MenuItemModel[])[i].text === 'Copy') {
                let element = document.getElementById((menu.contextMenuInstance.items as MenuItemModel[])[i].id);
                expect(element.classList.contains('e-disabled')).toBe(true);
            }
        }
        imageResizer.isImageResizing = true;
        editor.documentHelper.viewerContainer.dispatchEvent(event);
        imageResizer.isImageResizing = false;
    });
    it('Context Menu Opening Texting with selection', () => {
console.log('Context Menu Opening Texting with selection');
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.selectAll();
        let event: MouseEvent = document.createEvent('MouseEvent');
        event.initEvent('contextmenu', true, true);
        editor.documentHelper.viewerContainer.dispatchEvent(event);
        for (let i: number = 0; i < (menu.contextMenuInstance.items as MenuItemModel[]).length; i++) {
            if ((menu.contextMenuInstance.items as MenuItemModel[])[i].text === 'Cut' ||
                (menu.contextMenuInstance.items as MenuItemModel[])[i].text === 'Copy') {
                let element = document.getElementById((menu.contextMenuInstance.items as MenuItemModel[])[i].id);
                expect(element.classList.contains('e-disabled')).toBe(false);
            }
        }
    });
});
describe('Context Menu Testing - 2', () => {
    let editor: DocumentEditor;
    let menu: ContextMenu;
    let paraDialog: ParagraphDialog;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ContextMenu, Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableContextMenu: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        menu = editor.contextMenuModule;
        paraDialog = editor.paragraphDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        menu.destroy();
        editor = undefined;
        menu = undefined;
        paraDialog.destroy();
        paraDialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Open Context Menu in read only mode', () => {
console.log('Open Context Menu in read only mode');
        editor.editorModule.insertText('Syncfusion Software');
        editor.isReadOnly = true;
        let event: MouseEvent = document.createEvent('MouseEvent');
        event.initEvent('contextmenu', true, true);
        editor.documentHelper.viewerContainer.dispatchEvent(event);
        for (let i: number = 0; i < (menu.contextMenuInstance.items as MenuItemModel[]).length; i++) {
            if ((menu.contextMenuInstance.items as MenuItemModel[])[i].text === 'Cut') {
                let element = document.getElementById((menu.contextMenuInstance.items as MenuItemModel[])[i].id);
                expect(element.style.display).toBe('none');
            }
            if ((menu.contextMenuInstance.items as MenuItemModel[])[i].text === 'Copy') {
                let element = document.getElementById((menu.contextMenuInstance.items as MenuItemModel[])[i].id);
                expect(element.style.display).toBe('');
                break;
            }
        }
        editor.isReadOnly = false;
    });
    it('open content Menu inside table', () => {
console.log('open content Menu inside table');
        editor.editor.insertTable(2, 2);
        let event: MouseEvent = document.createEvent('MouseEvent');
        event.initEvent('contextmenu', true, true);
        editor.documentHelper.viewerContainer.dispatchEvent(event);
        for (let i: number = 0; i < (menu.contextMenuInstance.items as MenuItemModel[]).length; i++) {
            let text: string = (menu.contextMenuInstance.items as MenuItemModel[])[i].text;
            if (text === 'Table Properties' || text === 'Insert' || text === 'Delete') {
                let element = document.getElementById((menu.contextMenuInstance.items as MenuItemModel[])[i].id);
                expect(element.classList.contains('e-disabled')).toBe(false);
            }
        }
    });
    it('Open context menu in hyperlink', () => {
console.log('Open context menu in hyperlink');
        editor.editorModule.insertHyperlinkInternal('https://syncfusion.com', 'Syncfusion Software', true);
        editor.selection.movePreviousPosition();
        let event: MouseEvent = document.createEvent('MouseEvent');
        event.initEvent('contextmenu', true, true);
        editor.isReadOnly = true;
        editor.documentHelper.viewerContainer.dispatchEvent(event);
        editor.isReadOnly = false;
        menu.contextMenuInstance.close();
        editor.documentHelper.viewerContainer.dispatchEvent(event);
        for (let i: number = 0; i < (menu.contextMenuInstance.items as MenuItemModel[]).length; i++) {
            let text: string = (menu.contextMenuInstance.items as MenuItemModel[])[i].text;
            if (text === 'Hyperlink') {
                let element = document.getElementById((menu.contextMenuInstance.items as MenuItemModel[])[i].id);
                expect(element.style.display).toBe('none');
            }
        }
    });
});
describe('Context Menu Testing - 3 ', () => {
    let editor: DocumentEditor;
    let menu: ContextMenu;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ContextMenu, Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableContextMenu: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        menu = editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        menu.destroy();
        editor = undefined;
        menu = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('open context menu for with merge Cell option', () => {
console.log('open context menu for with merge Cell option');
        editor.editor.insertTable(2, 2);
        editor.selection.handleShiftDownKey();
        let event: MouseEvent = document.createEvent('MouseEvent');
        event.initEvent('contextmenu', true, true);
        editor.documentHelper.viewerContainer.dispatchEvent(event);
        for (let i: number = 0; i < (menu.contextMenuInstance.items as MenuItemModel[]).length; i++) {
            let text: string = (menu.contextMenuInstance.items as MenuItemModel[])[i].text;
            if (text === 'Merge Cells') {
                let element = document.getElementById((menu.contextMenuInstance.items as MenuItemModel[])[i].id);
                expect(element.style.display).not.toBe('none');
                element.click();
            }
        }
    });
    it('add custom context menu', () => {
console.log('add custom context menu');
        let menuItems: MenuItemModel[] = [
            {
                text: 'search',
                id: '_search'
            }
        ];
        menu.enableCustomContextMenu = true;
        editor.contextMenu.addCustomMenu(menuItems, true, true);
        let event: MouseEvent = document.createEvent('MouseEvent');
        event.initEvent('contextmenu', true, true);
        editor.documentHelper.viewerContainer.dispatchEvent(event);
        for (let i: number = 0; i < (menu.contextMenuInstance.items as MenuItemModel[]).length; i++) {
            let text: string = (menu.contextMenuInstance.items as MenuItemModel[])[i].text;
            if (text === 'search') {
                let element = document.getElementById((menu.contextMenuInstance.items as MenuItemModel[])[i].id);
                expect(element.style.display).not.toBe('none');
                element.click();
            }
        }
        menu.handleContextMenuItem('container_search');
    });
});
describe('handle Context menu item validation-1 for editing', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let menu: ContextMenu;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, ContextMenu, Editor, EditorHistory, Selection, TablePropertiesDialog, ImageResizer);
        editor = new DocumentEditor({ enableContextMenu: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true, enableParagraphDialog: true, enableHyperlinkDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        menu = editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        menu.destroy();
        editor = undefined;
        menu = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('cut,copy and paste', () => {
console.log('cut,copy and paste');
        editor.editorModule.insertText('Adventure Works cycles');
        let event: any = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        menu.handleContextMenuItem('container_contextmenu_cut');
        editor.editorHistory.undo();
        menu.handleContextMenuItem('container_contextmenu_copy');
        editor.enableLocalPaste = true;
        menu.handleContextMenuItem('container_contextmenu_paste');
    });
    it('insert and delete row', () => {
console.log('insert and delete row');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        menu.handleContextMenuItem('container_contextmenu_insert_above');
        editor.editorHistory.undo();
        menu.handleContextMenuItem('container_contextmenu_insert_below');
        editor.enableLocalPaste = true;
        menu.handleContextMenuItem('container_contextmenu_delete_row');
    });
    it('insert and delete column', () => {
console.log('insert and delete column');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        menu.handleContextMenuItem('container_contextmenu_insert_left');
        editor.editorHistory.undo();
        menu.handleContextMenuItem('container_contextmenu_insert_right');
        menu.handleContextMenuItem('container_contextmenu_delete_column');
    });
    it('table dialog open using context menu testing', () => {
console.log('table dialog open using context menu testing');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        menu.handleContextMenuItem('container_contextmenu_table_dialog');
    });
    it('paragraph dialog and hyperlink dilaog open using context menu', () => {
console.log('paragraph dialog and hyperlink dilaog open using context menu');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion software');
        let event: MouseEvent = document.createEvent('MouseEvent');
        event.initEvent('contextmenu', true, true);
        editor.documentHelper.viewerContainer.dispatchEvent(event);
    });
    it('paragraph and hyperlink dialog open using contextmenu validation', () => {
console.log('paragraph and hyperlink dialog open using contextmenu validation');
        editor.openBlank();
        editor.enableParagraphDialog = false;
        editor.enableHyperlinkDialog = false;
        menu.handleContextMenuItem('container_contextmenu_paragraph_dialog');
        menu.handleContextMenuItem('container_contextmenu_edit_hyperlink');
        menu.handleContextMenuItem('container_contextmenu_remove_hyperlink');
        editor.isReadOnly = true;
        menu.handleContextMenuItem('container_contextmenu_paste');
        editor.isReadOnly = false;
    });

});
describe('handle Context menu item validation-2 for editing', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let menu: ContextMenu;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ContextMenu, Editor, EditorHistory, Selection, SfdtExport);
        editor = new DocumentEditor({ enableContextMenu: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        menu = editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        menu.destroy();
        editor = undefined;
        menu = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('insert and delete Table', () => {
console.log('insert and delete Table');
        editor.openBlank()
        editor.editor.insertTable(2, 2);
        menu.handleContextMenuItem('container_contextmenu_complete_table_delete');
        editor.editorHistory.undo();
    });
    it('open and copy hyperlink', () => {
console.log('open and copy hyperlink');
        editor.openBlank()
        editor.editorModule.insertText('www.google.com');
        editor.editorModule.onEnter();
        editor.selection.handleUpKey();
        editor.selection.handleRightKey();
        menu.handleContextMenuItem('container_contextmenu_copy_hyperlink');
        // expect(editor.editorModule.copiedData).not.toBeUndefined();
        menu.handleContextMenuItem('container_contextmenu_open_hyperlink');
        menu.handleContextMenuItem('container_contextmenu_remove_hyperlink');
        // To prevent browser context menu opening
        let value: boolean = (menu as any).disableBrowserContextmenu();
        expect(value).toBe(false);
    });
});

describe('Apply table auto fit types', () => {
    let editor: DocumentEditor;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ContextMenu, Editor, EditorHistory, Selection, SfdtExport);
        editor = new DocumentEditor({ enableContextMenu: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Apply auto fit type fit to contents', () => {
console.log('Apply auto fit type fit to contents');
        editor.editorModule.insertTable(2, 2);
        editor.selection.selectTable();
        editor.contextMenu.handleContextMenuItem('container_contextmenu_auto_fit_contents');
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.tableFormat.allowAutoFit).toBe(true);
    });
    it('Apply auto fit type fit to window', () => {
console.log('Apply auto fit type fit to window');
        editor.contextMenu.handleContextMenuItem('container_contextmenu_auto_fit_window');
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.tableFormat.preferredWidthType).toBe('Percent');
    });
    it('Apply auto fit type fit to contents', () => {
console.log('Apply auto fit type fit to contents');
        editor.contextMenu.handleContextMenuItem('container_contextmenu_fixed_column_width');
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.tableFormat.allowAutoFit).toBe(false);
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.tableFormat.preferredWidthType).toBe('Auto');
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.preferredWidthType).toBe('Point');
    });
});

describe('Context Menu element show validation', () => {
    let editor: DocumentEditor;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ContextMenu, Editor, EditorHistory, Selection, SfdtExport, FontDialog, ParagraphDialog);
        editor = new DocumentEditor({ enableContextMenu: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableComment: true, enableFontDialog: true, enableParagraphDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Show context menu with hyperlink dialog as false', () => {
console.log('Show context menu with hyperlink dialog as false');
        (editor.contextMenu as any).showHideElements(editor.selection);
        expect(document.getElementById(editor.element.id + '_contextmenu_hyperlink').style.display).toBe('none');
        expect((document.getElementById(editor.element.id + '_contextmenu_font_dialog').previousSibling as HTMLElement).style.display).toBe('none');
    });
});
describe('Context menu notes options', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let menu: ContextMenu;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ContextMenu, Editor, EditorHistory, Selection, SfdtExport);
        editor = new DocumentEditor({ enableContextMenu: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        menu = editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        menu.destroy();
        editor = undefined;
        menu = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Validating notes options', () => {
        console.log('Validating notes options');
        editor.openBlank()
        editor.editor.insertEndnote();
        menu.handleContextMenuItem('container_contextmenu_note_options');
    });
});
describe('Rtl context menu validation', () => {
    let editor: DocumentEditor;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ContextMenu, Editor, EditorHistory, Selection, SfdtExport);
        editor = new DocumentEditor({ enableContextMenu: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableRtl: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Rtl context menu validation', () => {
        editor.editor.insertText('سشةحمث');
        editor.selection.selectAll();
        editor.contextMenu.handleContextMenuItem('container_contextmenu_copy');
        expect(editor.selection.isEmpty).toBe(false);
    });
});