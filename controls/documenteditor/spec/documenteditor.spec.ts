import { DocumentEditor } from '../src/document-editor/document-editor';
import {
    Margin, Page, TableWidget, ImageElementBox, TableRowWidget, TextFormField, CheckBoxFormField, DropDownFormField, FieldElementBox,
    TableCellWidget, BodyWidget, ParagraphWidget, LineWidget, DocumentHelper, TextFormFieldInfo, CheckBoxFormFieldInfo, DropDownFormFieldInfo, FormFieldData
} from '../src/index';
import { createElement, Browser } from '@syncfusion/ej2-base';
import { Layout } from '../src/document-editor/implementation/viewer/layout';
import { DocumentEditorModel } from '../src/document-editor/document-editor-model';
import '../node_modules/es6-promise/dist/es6-promise';
import { TestHelper } from './test-helper.spec';
import { LayoutViewer, PageLayoutViewer } from '../src/index';
import { ListDialog } from '../src/document-editor/implementation/dialogs/list-dialog';
import { Editor } from '../src/index';
import { Selection } from '../src/index';
import {
    TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, CellOptionsDialog
} from '../src/document-editor/implementation/dialogs/index';
import { EditorHistory } from '../src/document-editor/implementation/editor-history/index';
import { profile, inMB, getMemoryProfile } from './common.spec';
import { XmlHttpRequestHandler } from '../src/document-editor/base/ajax-helper';
import { Regular } from '../src/document-editor/implementation/text-helper/regular';

/**
 * Document Editor spec
 */
describe('DocumentEditor', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Document Editor API Testing', () => {
        let editor: DocumentEditor;

        beforeAll(() => {
            let ele: HTMLElement = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            editor = new DocumentEditor({});
            DocumentEditor.Inject(Regular);
            (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
            (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
            (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
            (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
            editor.appendTo("#container");
        });
        afterAll((done) => {
            editor.destroy();
            //destroy validation   
            editor.destroy();
            editor = undefined;
            document.body.removeChild(document.getElementById('container'));
            document.body.innerHTML = '';
            setTimeout(function () {
                done();
            }, 1000);
        })
        it('Get module name in Document Editor', () => {
console.log('Get module name in Document Editor');
            expect(editor.getModuleName()).toBe("DocumentEditor");
            expect(editor.getPersistData()).toBe("documenteditor");
        });
        it('document title testing', () => {
console.log('document title testing');
            expect(editor.documentName).toEqual('');
        });
        it('Layout Enabled property testing', () => {
console.log('Layout Enabled property testing');
            editor.isLayoutEnabled = true;
            expect(editor.isLayoutEnabled).toBe(true);
        });
        it('Shift Enabled property testing', () => {
console.log('Shift Enabled property testing');
            editor.isShiftingEnabled = true;
            expect(editor.isShiftingEnabled).toBe(true);
        });
        it('page background color', () => {
console.log('page background color');
            editor.documentHelper.backgroundColor = '#000000';
            expect(editor.documentHelper.backgroundColor).not.toEqual('#FFFFFF');
        });
    });
    describe('HTML DOM Testing', () => {
        let editor: DocumentEditor;
        let pagecontainer: Element;
        beforeAll((): void => {
            let ele: HTMLElement = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            editor = new DocumentEditor({});
            DocumentEditor.Inject(Regular);
            (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
            (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
            (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
            (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
            editor.appendTo("#container");
        });
        afterAll((done) => {
            editor.destroy();
            document.body.removeChild(document.getElementById('container'));
            editor = undefined;
            document.body.innerHTML = '';
            setTimeout(function () {
                done();
            }, 1000);
        });
        it('container className testing', () => {
console.log('container className testing');
            expect(editor.element.classList.contains("e-documenteditor")).toEqual(true);
        });
        it('Editable div container test', () => {
console.log('Editable div container test');
            expect(editor.documentHelper.editableDiv.parentElement).toBe(editor.documentHelper.iframe.contentDocument.body);
        });
        it('viewerContainer element testing', () => {
console.log('viewerContainer element testing');
            let container = document.querySelector("#container");
            let viewerContainer = document.querySelector("#container_viewerContainer");
            expect(container.contains(viewerContainer)).toEqual(true);
        });
        it('pageContainer element testing', () => {
console.log('pageContainer element testing');
            let viewerContainer = document.querySelector("#container_viewerContainer");
            let pageContainer = document.querySelector("#container_pageContainer");
            expect(viewerContainer.contains(pageContainer)).toEqual(true);
        });
        it('canvas rendering testing', () => {
console.log('canvas rendering testing');
            pagecontainer = document.querySelector("#container_pageContainer");
            let canvas = document.getElementsByTagName('canvas')[0];
            expect(pagecontainer.contains(canvas)).toEqual(true);
        });
        it('element testing', () => {
console.log('element testing');
            expect(document.getElementById("container").id).toEqual(editor.element.id);
        });
        it('element testing after removing container', () => {
console.log('element testing after removing container');
            if (editor.element !== undefined && editor.element !== null) {
                let element: HTMLElement = editor.element;
                editor.element.parentNode.removeChild(element);
            }
            if (document.getElementById("conatiner") === undefined || document.getElementById("conatiner") === null) {
                expect(editor.element.id).not.toBe(undefined);
            }
        });
    });
    describe('Physical Dom Api Testing', () => {
        it('initialize the BodyWidget class', () => {
console.log('initialize the BodyWidget class');
            let bodyWidget: BodyWidget = new BodyWidget();
            expect('').toBe('');
        });
        it('margin testing', () => {
console.log('margin testing');
            let margin = new Margin(10, 10, 10, 10);
            expect(margin.bottom).toBe(10);
            expect(margin.top).toBe(10);
            expect(margin.right).toBe(10);
            expect(margin.left).toBe(10);
        });
        it('margin class api testing', () => {
console.log('margin class api testing');
            let margin = new Margin(10, 10, 10, 10);
            margin.bottom = 20;
            margin.top = 20;
            margin.left = 20;
            margin.right = 20;
            expect(margin.bottom).toBe(20);
            expect(margin.top).toBe(20);
            expect(margin.right).toBe(20);
            expect(margin.left).toBe(20);
        });
    });

    describe('Disposing method validation', () => {
        it('page destroy validation', () => {
console.log('page destroy validation');
            let page: Page = new Page(undefined);
            page.bodyWidgets = undefined;
            expect(() => { page.destroy() }).not.toThrowError();
        });
        it('image element box validation', () => {
console.log('image element box validation');
            let image: ImageElementBox = new ImageElementBox(undefined);
            expect(() => { image.line }).not.toThrowError();
        });
        it('Table Row widget validation', () => {
console.log('Table Row widget validation');
            let row: TableRowWidget = new TableRowWidget();
            row.childWidgets = undefined;
            expect(() => { row.destroy(); }).not.toThrowError();
        });
        it('Paragraph widget validation', () => {
console.log('Paragraph widget validation');
            let row: ParagraphWidget = new ParagraphWidget();
            row.childWidgets = undefined;
            expect(() => { row.destroy(); }).not.toThrowError();
        });
        it('Line widget validation', () => {
console.log('Line widget validation');
            let line: LineWidget = new LineWidget(undefined);
            line.children = undefined;
            expect(() => { line.destroy(); }).not.toThrowError();
        });
        it('Table cell widget validation', () => {
console.log('Table cell widget validation');
            let cell: TableCellWidget = new TableCellWidget();
            cell.childWidgets = undefined;
            expect(() => { cell.destroy(); }).not.toThrowError();
        });
        it('BodyWidget validation', () => {
console.log('BodyWidget validation');
            let body: BodyWidget = new BodyWidget();
            body.page = undefined;
            body.childWidgets = undefined;
            expect(() => { body.destroy(); }).not.toThrowError();
        });
        it('Table widget validation', () => {
console.log('Table widget validation');
            let table: TableWidget = new TableWidget();
            table.childWidgets = undefined;
            expect(() => { table.destroy(); }).not.toThrowError();
        });
    });
    describe('Localization public API for dialogs validation', () => {
        let editor: DocumentEditor;
        beforeAll((): void => {
            let ele: HTMLElement = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            editor = new DocumentEditor({});
            DocumentEditor.Inject(Regular);
            (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
            (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
            (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
            (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
            editor.appendTo("#container");
        });
        afterAll((done) => {
            editor.destroy();
            document.body.removeChild(document.getElementById('container'));
            editor = undefined;
            document.body.innerHTML = '';
            setTimeout(function () {
                done();
            }, 1000);
        });
        it('Localization en-US testing', () => {
console.log('Localization en-US testing');
            let oldProp: DocumentEditorModel = { locale: '' };
            let newProp: DocumentEditorModel = { locale: 'en-US' };
            editor.locale = 'en-US';
            editor.onPropertyChanged(newProp, oldProp);
            expect(editor.locale).toBe('en-US');
        });
        it('Localization empty string testing', () => {
console.log('Localization empty string testing');
            let oldProp: DocumentEditorModel = { locale: 'en-US' };
            let newProp: DocumentEditorModel = { locale: '' };
            editor.locale = '';
            editor.onPropertyChanged(newProp, oldProp);
            expect(editor.locale).toBe('');
        });
        it('page gap API validation', () => {
console.log('page gap API validation');
            editor.pageGap = 0;
            expect((editor.viewer as PageLayoutViewer).pageGap).toBe(0);
        });
    });
    describe('List Dialog testing', () => {
        let editor: DocumentEditor = undefined;
        let documentHelper: DocumentHelper;
        beforeAll(() => {
            let ele: HTMLElement = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            DocumentEditor.Inject(Editor, Selection, ListDialog);
            editor = new DocumentEditor({ enableSelection: true, enableEditor: true, isReadOnly: false, enableListDialog: true });
            (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
            (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
            (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
            (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
            editor.appendTo('#container');
        });
        afterAll((done) => {
            document.body.removeChild(document.getElementById('container'));
            editor.destroy();
            editor = undefined;
            documentHelper = undefined;
            document.body.innerHTML = '';
            setTimeout(function () {
                done();
            }, 1000);
        });

        it('Show ListDialog dialog testing', () => {
console.log('Show ListDialog dialog testing');
            editor.showListDialog();
            expect((editor.listDialogModule as any).target).not.toBeNull();
            expect((editor.listDialogModule as any).target).not.toBeUndefined();
        });
    });
    describe('Table Dialog testing-1', () => {
        let editor: DocumentEditor = undefined;
        let documentHelper: DocumentHelper;
        let tablePropertiesDialog: TablePropertiesDialog;
        let borderAndShadingDialog: BordersAndShadingDialog;
        beforeAll(() => {
            let ele: HTMLElement = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog, BordersAndShadingDialog, EditorHistory, TableOptionsDialog, CellOptionsDialog);
            editor = new DocumentEditor({ enableSelection: true, enableEditor: true, isReadOnly: false, enableTablePropertiesDialog: true, enableBordersAndShadingDialog: true, enableEditorHistory: true, enableTableOptionsDialog: true });
            (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
            (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
            (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
            (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
            editor.appendTo('#container');
            tablePropertiesDialog = editor.tablePropertiesDialogModule;
            borderAndShadingDialog = editor.bordersAndShadingDialogModule;
        });
        afterAll((done) => {
            document.body.removeChild(document.getElementById('container'));
            editor.destroy();
            documentHelper = editor.documentHelper;
            tablePropertiesDialog.destroy();
            borderAndShadingDialog.destroy();
            editor = undefined;
            documentHelper = undefined;
            document.body.innerHTML = '';
            setTimeout(function () {
                done();
            }, 1000);
        });

        it('table dialog-preferred width using point testing', () => {
console.log('table dialog-preferred width using point testing');
            editor.open(getJson());
            editor.showTablePropertiesDialog();
            expect((editor.tablePropertiesDialogModule as any).preferCheckBox.checked).toBe(false);
            (editor.tablePropertiesDialogModule as any).preferCheckBox.checked = true;
            expect((editor.tablePropertiesDialogModule as any).preferCheckBox.checked).toBe(true);
            (editor.tablePropertiesDialogModule as any).preferCheckBox.dataBind();
            expect((document.getElementById('container_TablePropertiesDialog_TablePropertiesContentDialogTabpreferred_Width') as any).value).toBe('0.00');
            (document.getElementById('container_TablePropertiesDialog_TablePropertiesContentDialogTabpreferred_Width') as any).value = 10;
            editor.tablePropertiesDialogModule.applyTableProperties();
        });
        it('table dialog-preferred width using pixel testing', () => {
console.log('table dialog-preferred width using pixel testing');
            editor.open(getJson());
            editor.showTablePropertiesDialog();
            (editor.tablePropertiesDialogModule as any).preferCheckBox.checked = true;
            expect((editor.tablePropertiesDialogModule as any).preferCheckBox.checked).toBe(true);
            (editor.tablePropertiesDialogModule as any).preferCheckBox.dataBind();
            expect((editor.tablePropertiesDialogModule as any).tableWidthType.index).toBe(0);
            (editor.tablePropertiesDialogModule as any).tableWidthType.index = 1;
            expect((editor.tablePropertiesDialogModule as any).tableWidthType.index).toBe(1);
            (document.getElementById('container_TablePropertiesDialog_TablePropertiesContentDialogTabpreferred_Width') as any).value = '10%';
            editor.tablePropertiesDialogModule.applyTableProperties();
        });
        it('table dialog- indent from left testing', () => {
console.log('table dialog- indent from left testing');
            editor.open(getJson());
            editor.showTablePropertiesDialog();
            let tableProperties: any = editor.tablePropertiesDialogModule;
            expect(tableProperties.leftIndentBox.value).toBe(0);
            tableProperties.leftIndentBox.value = 25;
            expect(tableProperties.leftIndentBox.value).toBe(25);
            tableProperties.applyTableProperties();
        });
    });
    describe('Table Dialog testing-2', () => {
        let editor: DocumentEditor = undefined;
        let documentHelper: DocumentHelper;
        let tablePropertiesDialog: TablePropertiesDialog;
        let borderAndShadingDialog: BordersAndShadingDialog;
        beforeAll((done) => {
            let ele: HTMLElement = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog, BordersAndShadingDialog, EditorHistory, TableOptionsDialog, CellOptionsDialog);
            editor = new DocumentEditor({ enableSelection: true, enableEditor: true, isReadOnly: false, enableTablePropertiesDialog: true, enableBordersAndShadingDialog: true, enableEditorHistory: true, enableTableOptionsDialog: true });
            (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
            (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
            (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
            (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
            editor.appendTo('#container');
            tablePropertiesDialog = editor.tablePropertiesDialogModule;
            borderAndShadingDialog = editor.bordersAndShadingDialogModule;
            setTimeout(function () {
                done();
            }, 100);
        });
        afterAll((done) => {
            document.body.removeChild(document.getElementById('container'));
            editor.destroy();
            tablePropertiesDialog.destroy();
            borderAndShadingDialog.destroy();
            editor = undefined;
            documentHelper = undefined;
            document.body.innerHTML = '';
            setTimeout(function () {
                done();
            }, 1000);
        });
        it('table dialog-table left alignment testing', () => {
console.log('table dialog-table left alignment testing');
            editor.open(getJson());
            editor.showTablePropertiesDialog();
            document.getElementById('container_TablePropertiesDialog_TablePropertiesContentDialogTab_left_alignment').click();
            expect(document.getElementById('container_TablePropertiesDialog_TablePropertiesContentDialogTab_left_alignment').classList.contains('e-de-table-alignment-active')).toBe(true);
            editor.tablePropertiesDialogModule.applyTableProperties();
        });
        it('table dialog-table center alignment testing', () => {
console.log('table dialog-table center alignment testing');
            editor.open(getJson());
            editor.showTablePropertiesDialog();
            document.getElementById('container_TablePropertiesDialog_TablePropertiesContentDialogTab_center_alignment').click();
            expect(document.getElementById('container_TablePropertiesDialog_TablePropertiesContentDialogTab_center_alignment').classList.contains('e-de-table-alignment-active')).toBe(true);
            editor.tablePropertiesDialogModule.applyTableProperties();
        });
        it('table dialog-table right alignment testing', () => {
console.log('table dialog-table right alignment testing');
            editor.open(getJson());
            editor.showTablePropertiesDialog();
            document.getElementById('container_TablePropertiesDialog_TablePropertiesContentDialogTab_right_alignment').click();
            expect(document.getElementById('container_TablePropertiesDialog_TablePropertiesContentDialogTab_right_alignment').classList.contains('e-de-table-alignment-active')).toBe(true);
            editor.tablePropertiesDialogModule.applyTableProperties();
        });
    });
    describe('Table Dialog testing-3', () => {
        let editor: DocumentEditor = undefined;
        let documentHelper: DocumentHelper;
        let tablePropertiesDialog: TablePropertiesDialog;
        let borderAndShadingDialog: BordersAndShadingDialog;
        beforeAll((done) => {
            let ele: HTMLElement = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog, BordersAndShadingDialog, EditorHistory, TableOptionsDialog, CellOptionsDialog);
            editor = new DocumentEditor({ enableSelection: true, enableEditor: true, isReadOnly: false, enableTablePropertiesDialog: true, enableBordersAndShadingDialog: true, enableEditorHistory: true, enableTableOptionsDialog: true });
            (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
            (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
            (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
            (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
            editor.appendTo('#container');
            tablePropertiesDialog = editor.tablePropertiesDialogModule;
            borderAndShadingDialog = editor.bordersAndShadingDialogModule;
            setTimeout(function () {
                done();
            }, 100);
        });
        afterAll((done) => {
            document.body.removeChild(document.getElementById('container'));
            editor.destroy();
            tablePropertiesDialog.destroy();
            borderAndShadingDialog.destroy();
            editor = undefined;
            documentHelper = undefined;
            document.body.innerHTML = '';
            setTimeout(function () {
                done();
            }, 1000);
        });
        // it('open borders and shaing dialog and applying border style none', () => {
        //     editor.open(getJson());
        //     editor.showTablePropertiesDialog();
        //     editor.tablePropertiesDialogModule.bordersAndShadingButton.click();
        //     expect((editor.bordersAndShadingDialogModule as any).borderStyle.index).toBe(1);
        //     expect((editor.bordersAndShadingDialogModule as any).borderStyle.value).toBe('Single');
        //     (editor.bordersAndShadingDialogModule as any).borderStyle.index = 0;
        //     (editor.bordersAndShadingDialogModule as any).borderStyle.dataBind();
        //     expect((editor.bordersAndShadingDialogModule as any).borderStyle.value).toBe('None');
        //     (document.getElementsByClassName('e-table-border-shading-okay')[0] as any).click();
        //     (document.getElementsByClassName('e-table-ppty-okay')[0] as any).click();
        // });
        it('setting border style as none testing', () => {
console.log('setting border style as none testing');
            editor.open(getJson());
            editor.showTablePropertiesDialog();
            (editor.tablePropertiesDialogModule as any).bordersAndShadingButton.click();
            (document.getElementsByClassName('e-de-table-border-none')[0] as any).click();
            expect((document.getElementsByClassName('e-de-table-border-none')[0]).children[0].classList.contains('e-de-table-border-inside-setting-click')).toBe(true);
        });
        it('setting border style as box testing', () => {
console.log('setting border style as box testing');
            editor.open(getJson());
            editor.showTablePropertiesDialog();
            (editor.tablePropertiesDialogModule as any).bordersAndShadingButton.click();
            (document.getElementsByClassName('e-de-table-border-box')[0] as any).click();
            expect((document.getElementsByClassName('e-de-table-border-box')[0]).children[0].classList.contains('e-de-table-border-inside-setting-click')).toBe(true);
        });
        it('setting border style as all testing', () => {
console.log('setting border style as all testing');
            editor.open(getJson());
            editor.showTablePropertiesDialog();
            (editor.tablePropertiesDialogModule as any).bordersAndShadingButton.click();
            (document.getElementsByClassName('e-de-table-border-all')[0] as any).click();
            expect((document.getElementsByClassName('e-de-table-border-all')[0]).children[0].classList.contains('e-de-table-border-inside-setting-click')).toBe(true);
        });
    });
    describe('Table Dialog testing-4', () => {
        let editor: DocumentEditor = undefined;
        let documentHelper: DocumentHelper;
        let tablePropertiesDialog: TablePropertiesDialog;
        let borderAndShadingDialog: BordersAndShadingDialog;
        beforeAll((done) => {
            let ele: HTMLElement = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog, BordersAndShadingDialog, EditorHistory, TableOptionsDialog, CellOptionsDialog);
            editor = new DocumentEditor({ enableSelection: true, enableEditor: true, isReadOnly: false, enableTablePropertiesDialog: true, enableBordersAndShadingDialog: true, enableEditorHistory: true, enableTableOptionsDialog: true });
            (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
            (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
            (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
            (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
            editor.appendTo('#container');
            tablePropertiesDialog = editor.tablePropertiesDialogModule;
            borderAndShadingDialog = editor.bordersAndShadingDialogModule;
            setTimeout(function () {
                done();
            }, 100);
        });
        afterAll((done) => {
            document.body.removeChild(document.getElementById('container'));
            editor.destroy();
            tablePropertiesDialog.destroy();
            borderAndShadingDialog.destroy();
            editor = undefined;
            documentHelper = undefined;
            document.body.innerHTML = '';
            setTimeout(function () {
                done();
            }, 1000);
        });
        // it('border-width testing', () => {
        //     editor.open(getJson());
        //     editor.showTablePropertiesDialog();
        //     editor.tablePropertiesDialogModule.bordersAndShadingButton.click();
        //     expect((editor.bordersAndShadingDialogModule as any).borderWidth.value).toBe(0.5);
        //     (editor.bordersAndShadingDialogModule as any).borderWidth.value = 6;
        //     expect((editor.bordersAndShadingDialogModule as any).borderWidth.value).toBe(6);
        //     (document.getElementsByClassName('e-table-border-shading-okay')[0] as any).click();
        //     (document.getElementsByClassName('e-table-ppty-okay')[0] as any).click();
        // });
        it('Show table options dialog testing', () => {
console.log('Show table options dialog testing');
            editor.open(getJson());
            editor.showTablePropertiesDialog();
            editor.showTableOptionsDialog();
            editor.tableOptionsDialogModule.applyTableCellProperties();
            editor.tablePropertiesDialogModule.applyTableProperties();
        });
    });
    describe('Prevent keyboard shortcut event', () => {
        let editor: DocumentEditor;
        let documentHelper: DocumentHelper;
        beforeAll((): void => {
            let ele: HTMLElement = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            DocumentEditor.Inject(Editor, Selection);
            editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
            editor.acceptTab = true;
            (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
            (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
            (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
            (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
            editor.appendTo('#container');
        });
        afterAll((done): void => {
            documentHelper.destroy();
            documentHelper = undefined;
            editor.destroy();
            document.body.removeChild(document.getElementById('container'));
            editor = undefined;
            document.body.innerHTML = '';
            setTimeout(function () {
                done();
            }, 1000);
        });
        it('Prevent bold operation', () => {
console.log('Prevent bold operation');
            editor.editor.insertText('Syncfusion');
            editor.selection.selectAll();
            editor.keyDown = (args) => {
                if (args.event.ctrlKey === true && args.event.keyCode === 66) {
                    args.isHandled = true;
                }
            }
            let event = { keyCode: 66, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
            editor.documentHelper.onKeyDownInternal(event as any);
            expect(editor.selection.characterFormat.bold).toBe(false);
        });
    });
    function getJson() {
        let json: any = {
            "sections": [
                {
                    "blocks": [
                        {
                            "rows": [
                                {
                                    "rowFormat": {
                                        "allowBreakAcrossPages": true,
                                        "isHeader": false,
                                        "height": 0,
                                        "heightType": "AtLeast",
                                        "borders": {
                                            "left": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "right": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "top": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "bottom": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "vertical": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "horizontal": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalDown": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalUp": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            }
                                        }
                                    },
                                    "gridBeforeWidth": 0,
                                    "gridAfterWidth": 0,
                                    "gridBefore": 0,
                                    "gridAfter": 0,
                                    "cells": [
                                        {
                                            "blocks": [
                                                {
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "cellWidth": 233.75,
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {
                                                    "left": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "right": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "top": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "bottom": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "vertical": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "horizontal": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalDown": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalUp": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    }
                                                }
                                            },
                                            "columnIndex": 0
                                        },
                                        {
                                            "blocks": [
                                                {
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "cellWidth": 233.75,
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {
                                                    "left": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "right": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "top": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "bottom": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "vertical": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "horizontal": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalDown": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalUp": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    }
                                                }
                                            },
                                            "columnIndex": 0
                                        }
                                    ]
                                },
                                {
                                    "rowFormat": {
                                        "allowBreakAcrossPages": true,
                                        "isHeader": false,
                                        "height": 0,
                                        "heightType": "AtLeast",
                                        "borders": {
                                            "left": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "right": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "top": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "bottom": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "vertical": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "horizontal": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalDown": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalUp": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            }
                                        }
                                    },
                                    "gridBeforeWidth": 0,
                                    "gridAfterWidth": 0,
                                    "gridBefore": 0,
                                    "gridAfter": 0,
                                    "cells": [
                                        {
                                            "blocks": [
                                                {
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "cellWidth": 233.75,
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {
                                                    "left": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "right": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "top": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "bottom": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "vertical": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "horizontal": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalDown": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalUp": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    }
                                                }
                                            },
                                            "columnIndex": 0
                                        },
                                        {
                                            "blocks": [
                                                {
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "cellWidth": 233.75,
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {
                                                    "left": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "right": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "top": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "bottom": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "vertical": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "horizontal": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalDown": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalUp": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    }
                                                }
                                            },
                                            "columnIndex": 0
                                        }
                                    ]
                                },
                                {
                                    "rowFormat": {
                                        "allowBreakAcrossPages": true,
                                        "isHeader": false,
                                        "height": 0,
                                        "heightType": "AtLeast",
                                        "borders": {
                                            "left": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "right": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "top": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "bottom": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "vertical": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "horizontal": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalDown": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalUp": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            }
                                        }
                                    },
                                    "gridBeforeWidth": 0,
                                    "gridAfterWidth": 0,
                                    "gridBefore": 0,
                                    "gridAfter": 0,
                                    "cells": [
                                        {
                                            "blocks": [
                                                {
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "cellWidth": 233.75,
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {
                                                    "left": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "right": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "top": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "bottom": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "vertical": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "horizontal": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalDown": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalUp": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    }
                                                }
                                            },
                                            "columnIndex": 0
                                        },
                                        {
                                            "blocks": [
                                                {
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": []
                                                }
                                            ],
                                            "cellFormat": {
                                                "cellWidth": 233.75,
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "borders": {
                                                    "left": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "right": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "top": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "bottom": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "vertical": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "horizontal": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalDown": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalUp": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0,
                                                        "hasNoneStyle": false
                                                    }
                                                }
                                            },
                                            "columnIndex": 0
                                        }
                                    ]
                                }
                            ],
                            "title": null,
                            "description": null,
                            "tableFormat": {
                                "allowAutoFit": true,
                                "leftIndent": 0,
                                "tableAlignment": "Left",
                                "preferredWidthType": "Auto",
                                "borders": {
                                    "left": {
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "right": {
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "top": {
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "bottom": {
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "vertical": {
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "horizontal": {
                                        "lineStyle": "Single",
                                        "lineWidth": 0.5,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "diagonalDown": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "diagonalUp": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    }
                                }
                            }
                        },
                        {
                            "paragraphFormat": {
                                "styleName": "Normal"
                            },
                            "inlines": [
                                {
                                    "name": "_GoBack",
                                    "bookMarkType": 0
                                },
                                {
                                    "name": "_GoBack",
                                    "bookMarkType": 1
                                }
                            ]
                        }
                    ],
                    "headersFooters": {},
                    "sectionFormat": {
                        "headerDistance": 36,
                        "footerDistance": 36,
                        "pageWidth": 612,
                        "pageHeight": 792,
                        "leftMargin": 72,
                        "rightMargin": 72,
                        "topMargin": 72,
                        "bottomMargin": 72,
                        "differentFirstPage": false,
                        "differentOddAndEvenPages": false
                    }
                }
            ],
            "characterFormat": {
                "fontSize": 11,
                "fontFamily": "Calibri"
            },
            "paragraphFormat": {
                "afterSpacing": 8,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple"
            },
            "background": {
                "color": "#FFFFFFFF"
            },
            "styles": [
                {
                    "type": "Paragraph",
                    "name": "Normal",
                    "next": "Normal"
                },
                {
                    "type": "Character",
                    "name": "Default Paragraph Font"
                },
                {
                    "type": "Paragraph",
                    "name": "Header",
                    "basedOn": "Normal",
                    "link": "Header Char",
                    "paragraphFormat": {
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "tabs": [
                            {
                                "tabJustification": "Centered",
                                "position": 234
                            },
                            {
                                "tabJustification": "Right",
                                "position": 468
                            }
                        ]
                    }
                },
                {
                    "type": "Character",
                    "name": "Header Char",
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "type": "Paragraph",
                    "name": "Footer",
                    "basedOn": "Normal",
                    "link": "Footer Char",
                    "paragraphFormat": {
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "tabs": [
                            {
                                "tabJustification": "Centered",
                                "position": 234
                            },
                            {
                                "tabJustification": "Right",
                                "position": 468
                            }
                        ]
                    }
                },
                {
                    "type": "Character",
                    "name": "Footer Char",
                    "basedOn": "Default Paragraph Font"
                }
            ]
        };
        return JSON.stringify(json);
    }

    describe('Component created and destroy event validation', () => {
        let documentEditor = new DocumentEditor();
        DocumentEditor.Inject(Regular);
        it('Created event validation', () => {
console.log('Created event validation');
            let createSpy = jasmine.createSpy('created');
            let ele: HTMLElement = createElement('div', { id: 'container' });
            document.body.appendChild(ele);

            documentEditor.created = createSpy;

            documentEditor.appendTo(ele);
            expect(createSpy).toHaveBeenCalled();
        });
        it('Destroy vaalidation', () => {
console.log('Destroy vaalidation');
            let destroy = jasmine.createSpy('destroy');
            documentEditor.destroyed = destroy;
            documentEditor.destroy();
            expect(destroy).toHaveBeenCalled();
        });
    });

    it('memory leak', () => {
console.log('memory leak');
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});

describe("Initilize document editor", function () {
    let editor: DocumentEditor;
    let currentAgent = '';
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
        DocumentEditor.Inject(Regular);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        currentAgent = Browser.userAgent;
        let iPhoneUa: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) ' +
            'AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
        Browser.userAgent = iPhoneUa;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        Browser.userAgent = currentAgent;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 500);
    });

    it('In Device testing', function () {
console.log('In Device testing');
        expect(() => { editor.appendTo("#container"); }).not.toThrowError();
    });
});


describe('Enable comment checking in docmenteitor', () => {
    let editor: DocumentEditor;
    let pagecontainer: Element;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false, enableComment: true });
        editor.enableAllModules();
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo("#container");
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Insert comment', () => {
console.log('Insert comment');
        editor.editor.insertComment();
        expect(editor.showComments).toBe(true);
        editor.enableComment = false;
    });
    it('set enable comment as false', () => {
console.log('set enable comment as false');
        editor.enableComment = false;
        expect(editor.showComments).toBe(false);
    });
    it('insert comment after enable comment as false', () => {
console.log('insert comment after enable comment as false');
        editor.openBlank();
        editor.editor.insertComment();
        expect(editor.documentHelper.comments.length).toBe(0);
    })

});
let sfdt: any = {"sections":[{"sectionFormat":{"pageWidth":595.2999877929688,"pageHeight":841.9000244140625,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":35.400001525878906,"footerDistance":35.400001525878906,"bidi":false},"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"DATED "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::427a2325-bcc8-4c8e-a6de-f9ace3fe17c2::agreement.date"},{"characterFormat":{"bold":true,"bidi":false},"text":"agreement.date"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::427a2325-bcc8-4c8e-a6de-f9ace3fe17c2::agreement.date"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"------------"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"SHARE SALE AND PURCHASE AGREEMENT"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"B"},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"etween"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"DATA::a7ad6bd8-fe89-41d7-90d6-68ee61e0da12::seller.nameComputed"},{"characterFormat":{"bold":true,"bidi":false},"text":"seller.nameComputed"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::a7ad6bd8-fe89-41d7-90d6-68ee61e0da12::seller.nameComputed"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"a"},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"nd"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"DATA::367cf4e3-1988-4eda-8cee-87675ee29715::buyer.nameComputed"},{"characterFormat":{"bold":true,"bidi":false},"text":"buyer.nameComputed"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::367cf4e3-1988-4eda-8cee-87675ee29715::buyer.nameComputed"}]}],"headersFooters":{"footer":{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]}}},{"sectionFormat":{"pageWidth":595.2999877929688,"pageHeight":841.9000244140625,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":35.400001525878906,"footerDistance":35.400001525878906,"bidi":false},"blocks":[{"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"This "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"is "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"dated "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::b7e2a9b8-c5b9-45f4-a019-5747a8e52d1f::agreement.date"},{"characterFormat":{"bidi":false},"text":"agreement.date"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::b7e2a9b8-c5b9-45f4-a019-5747a8e52d1f::agreement.date"}]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Parties"},{"characterFormat":{},"bookmarkType":0,"name":"COND::f02c30fc-c564-4082-ad06-649a47202197"}]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":3,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"DATA::262b6a9b-b9b0-4fa9-ae58-5236a437720f::seller.firstName"},{"characterFormat":{"bold":true,"bidi":false},"text":"seller.firstName"},{"characterFormat":{},"bookmarkType":0,"name":"DATA::ceef2879-2b6d-43f5-b1e9-ca4348d2700a::seller.companyName"},{"characterFormat":{},"bookmarkType":0,"name":"COND::89c3d6a7-9bcf-40e2-b6c4-1a45b9073860"},{"characterFormat":{},"bookmarkType":1,"name":"COND::1c0032c5-64a9-4a83-8a55-eb2d9345bb37"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::262b6a9b-b9b0-4fa9-ae58-5236a437720f::seller.firstName"},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::536d8887-694b-4a12-80d6-f966bc7c8729::seller.lastName"},{"characterFormat":{"bold":true,"bidi":false},"text":"seller.lastName"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::536d8887-694b-4a12-80d6-f966bc7c8729::seller.lastName"},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":"of "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::0b9c49bf-5c80-488c-95c9-fd881a78cbe3::seller.individualAddress"},{"characterFormat":{"bidi":false},"text":"seller.individualAddress"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::0b9c49bf-5c80-488c-95c9-fd881a78cbe3::seller.individualAddress"},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{},"bookmarkType":0,"name":"COND::73ef6dcf-d3da-476e-ac3c-41bdbd5d47d6"},{"characterFormat":{},"bookmarkType":1,"name":"COND::f02c30fc-c564-4082-ad06-649a47202197"},{"characterFormat":{},"bookmarkType":0,"name":"DATA::7429b3c2-f202-48a7-9987-7e7944d6ffa6::seller.companyName"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::7429b3c2-f202-48a7-9987-7e7944d6ffa6::seller.companyName"},{"characterFormat":{},"bookmarkType":0,"name":"DATA::c482a248-886c-47b7-9563-6572058406d5::seller.companyName"},{"characterFormat":{"bold":true,"bidi":false},"text":"seller.companyName"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::c482a248-886c-47b7-9563-6572058406d5::seller.companyName"},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":11},"text":"incorporated "},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":11},"text":"registered"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"in "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::b25e002c-6c64-4d9c-9c95-1c28f2cb40a4::seller.companyEstablishmentCountry"},{"characterFormat":{"bidi":false},"text":"seller.companyEstablishmentCountry"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::b25e002c-6c64-4d9c-9c95-1c28f2cb40a4::seller.companyEstablishmentCountry"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"with "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"company "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"number "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::4c659253-0778-41b2-92a2-9efd51f131ea::seller.companyRegistrationNumber"},{"characterFormat":{"bidi":false},"text":"seller.companyRegistrationNumber"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::4c659253-0778-41b2-92a2-9efd51f131ea::seller.companyRegistrationNumber"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"whose "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"registered "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"office "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"is "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"a"},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":11},"text":"t "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::55b3ea9f-c84e-4c0a-be7d-6fcfeb0bd7a7::seller.companyRegisteredAddress"},{"characterFormat":{"bidi":false},"text":"seller.companyRegisteredAddress"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::55b3ea9f-c84e-4c0a-be7d-6fcfeb0bd7a7::seller.companyRegisteredAddress"},{"characterFormat":{},"bookmarkType":1,"name":"COND::73ef6dcf-d3da-476e-ac3c-41bdbd5d47d6"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"("},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"“"},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Seller"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"”"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":")"}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":3,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"COND::b901865b-8b98-4942-a1cc-53746c86d997"},{"characterFormat":{},"bookmarkType":0,"name":"DATA::ad094b20-669f-4980-bcc7-030ddd5082e0::buyer.firstName"},{"characterFormat":{"bold":true,"bidi":false},"text":"buyer.firstName"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::ad094b20-669f-4980-bcc7-030ddd5082e0::buyer.firstName"},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":11},"text":" "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::058f8ed0-c477-45be-b8c2-901ac7395b46::buyer.lastName"},{"characterFormat":{"bold":true,"bidi":false},"text":"buyer.lastName"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::058f8ed0-c477-45be-b8c2-901ac7395b46::buyer.lastName"},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":11},"text":"o"},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":11},"text":"f"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::b49fa167-8df9-43f8-a243-5ffa6ffa4fe0::buyer.individualAddress"},{"characterFormat":{"bidi":false},"text":"buyer.individualAddress"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::b49fa167-8df9-43f8-a243-5ffa6ffa4fe0::buyer.individualAddress"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{},"bookmarkType":1,"name":"COND::b901865b-8b98-4942-a1cc-53746c86d997"},{"characterFormat":{},"bookmarkType":0,"name":"COND::7418d5ce-d43f-4208-aeab-cd505c76c66e"},{"characterFormat":{},"bookmarkType":0,"name":"DATA::235beec5-9048-4005-977d-cd366cefc4d4::buyer.companyName"},{"characterFormat":{"bold":true,"bidi":false},"text":"buyer.companyName"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::235beec5-9048-4005-977d-cd366cefc4d4::buyer.companyName"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"incorporated "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"registered "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"in "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::611472c0-8bd3-43a8-99ec-0260978893b8::buyer.companyEstablishmentCountry"},{"characterFormat":{"bidi":false},"text":"buyer.companyEstablishmentCountry"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::611472c0-8bd3-43a8-99ec-0260978893b8::buyer.companyEstablishmentCountry"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"with "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"company "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"number "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::ddc3ae1c-dc6a-4cc4-b5df-73928a55b232::buyer.companyRegistrationNumber"},{"characterFormat":{"bidi":false},"text":"buyer.companyRegistrationNumber"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::ddc3ae1c-dc6a-4cc4-b5df-73928a55b232::buyer.companyRegistrationNumber"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"whose "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"registered "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"office "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"is "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"at "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::6794fe62-e043-48d3-87e7-9a8c11b40aa8::buyer.companyRegisteredAddress"},{"characterFormat":{"bidi":false},"text":"buyer.companyRegisteredAddress"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::6794fe62-e043-48d3-87e7-9a8c11b40aa8::buyer.companyRegisteredAddress"},{"characterFormat":{},"bookmarkType":1,"name":"COND::7418d5ce-d43f-4208-aeab-cd505c76c66e"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"("},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"“"},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Buyer"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"”"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":")"}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"BACKGROUND"}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"The "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Seller "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"has "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreed "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"sell "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Buyer "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"has "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreed "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"buy "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Shares, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"subject "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"terms "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement."}]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Agreed "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"terms"}]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Interpretation"}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"The "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"following "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"definitions "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"rules "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"interpretation "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"apply "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement."}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Definitions:"}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Business "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Day:"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" a "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"day, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"other "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"than "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"a "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Saturday, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Sunday "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"public "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"holiday "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"in "},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":11},"text":"Sydney"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":", "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"when "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"banks "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"in "},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":11},"text":"Sydney"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"are "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"open "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"for "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"business."}]},{"paragraphFormat":{"leftIndent":36,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Company: "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::130d467a-4e96-4a34-a327-5f3114297069::shares.companyName"},{"characterFormat":{"fontFamily":"arial","fontColor":"#000000FF","bidi":false},"text":"shares.companyName"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::130d467a-4e96-4a34-a327-5f3114297069::shares.companyName"},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"arial","fontColor":"#000000FF","boldBidi":false,"italicBidi":false,"fontFamilyBidi":"arial"},"text":" "},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"arial","fontColor":"#000000FF","boldBidi":false,"italicBidi":false,"fontFamilyBidi":"arial"},"text":"incorporated"},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"arial","fontColor":"#000000FF","boldBidi":false,"italicBidi":false,"fontFamilyBidi":"arial"},"text":" "},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"arial","fontColor":"#000000FF","boldBidi":false,"italicBidi":false,"fontFamilyBidi":"arial"},"text":"and"},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"arial","fontColor":"#000000FF","boldBidi":false,"italicBidi":false,"fontFamilyBidi":"arial"},"text":" "},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"arial","fontColor":"#000000FF","boldBidi":false,"italicBidi":false,"fontFamilyBidi":"arial"},"text":"registered"},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"arial","fontColor":"#000000FF","boldBidi":false,"italicBidi":false,"fontFamilyBidi":"arial"},"text":" "},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"arial","fontColor":"#000000FF","boldBidi":false,"italicBidi":false,"fontFamilyBidi":"arial"},"text":"in"},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"arial","fontColor":"#000000FF","boldBidi":false,"italicBidi":false,"fontFamilyBidi":"arial"},"text":" "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::8724c877-78fc-4972-8109-2f36667f27cd::shares.companyEstablishmentCountry"},{"characterFormat":{"fontFamily":"arial","fontColor":"#000000FF","bidi":false},"text":"shares.companyEstablishmentCountry"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::8724c877-78fc-4972-8109-2f36667f27cd::shares.companyEstablishmentCountry"},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"arial","fontColor":"#000000FF","boldBidi":false,"italicBidi":false,"fontFamilyBidi":"arial"},"text":" "},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"arial","fontColor":"#000000FF","boldBidi":false,"italicBidi":false,"fontFamilyBidi":"arial"},"text":"with"},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"arial","fontColor":"#000000FF","boldBidi":false,"italicBidi":false,"fontFamilyBidi":"arial"},"text":" "},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"arial","fontColor":"#000000FF","boldBidi":false,"italicBidi":false,"fontFamilyBidi":"arial"},"text":"company"},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"arial","fontColor":"#000000FF","bidi":false,"boldBidi":false,"italicBidi":false,"fontFamilyBidi":"arial"},"text":" "},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"arial","fontColor":"#000000FF","bidi":false,"boldBidi":false,"italicBidi":false,"fontFamilyBidi":"arial"},"text":"number "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::d819cfe1-57b4-4bea-b940-e142d1d878a8::shares.companyRegistrationNumber"},{"characterFormat":{"fontFamily":"arial","fontColor":"#000000FF","bidi":false},"text":"shares.companyRegistrationNumber"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::d819cfe1-57b4-4bea-b940-e142d1d878a8::shares.companyRegistrationNumber"},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"arial","fontColor":"#000000FF","bidi":false,"boldBidi":false,"italicBidi":false,"fontFamilyBidi":"arial"},"text":"."}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Encumbrance:"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"interest "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"equity "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"person "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"(including "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"right "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"acquire, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"option "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"right "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"pre-emption) "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"mortgage, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"charge, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"pledge, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"lien, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"assignment, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"hypothecation, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"security "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"interest, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"title "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"retention "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"other "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"security "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"arrangement."}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Shares:"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::188bdf30-34a5-4edd-86a3-5b53f3bfa593::shares.sellerHeldNumberSpell"},{"characterFormat":{"bidi":false},"text":"shares.sellerHeldNumberSpell"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::188bdf30-34a5-4edd-86a3-5b53f3bfa593::shares.sellerHeldNumberSpell"},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":11},"text":"("},{"characterFormat":{},"bookmarkType":0,"name":"DATA::f82274b1-fbc7-4597-83c6-e1ec703ee2cc::shares.sellerHeldNumber"},{"characterFormat":{"bidi":false},"text":"shares.sellerHeldNumber"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::f82274b1-fbc7-4597-83c6-e1ec703ee2cc::shares.sellerHeldNumber"},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":11},"text":")"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::36807780-8cbb-4c1a-a9f6-9f1046ffdda7::shares.sellerClass"},{"characterFormat":{"bidi":false},"text":"shares.sellerClass"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::36807780-8cbb-4c1a-a9f6-9f1046ffdda7::shares.sellerClass"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"shares "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"bidi":false},"text":"shares.valueComputed"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::cd63e6d5-3d82-420a-ab30-84b018ea4cc5::shares.valueComputed"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"each "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"capital "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Company "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"held "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"by "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Seller. "}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Clause "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"headings "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"not "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"affect "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"interpretation "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement."}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Unless "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"context "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"otherwise "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"requires, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"words "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"singular "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"include "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"plural "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"plural "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"include "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"singular."}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"A "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"person"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" includes "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"a "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"natural "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"person, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"corporate "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"unincorporated "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"body "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"(whether "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"not "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"having "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"separate "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"legal "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"personality)."}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"A "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"reference "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"a "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"party"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"include "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"that "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"party's "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"personal "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"representatives, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"successors "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"permitted "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"assigns."}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"A "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"reference "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"writing"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" or "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"written"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" includes "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"fax"},{"characterFormat":{},"bookmarkType":0,"name":"COND::47dffb68-6ba7-4728-bdff-93ec34e5c872"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"email"},{"characterFormat":{},"bookmarkType":1,"name":"COND::47dffb68-6ba7-4728-bdff-93ec34e5c872"},{"characterFormat":{},"bookmarkType":0,"name":"COND::b8649e54-4584-48a9-88ef-44f4d221ebc8"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"but "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"not "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"email"},{"characterFormat":{},"bookmarkType":1,"name":"COND::b8649e54-4584-48a9-88ef-44f4d221ebc8"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"."}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"References "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"clauses "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"are "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"clauses "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement."}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"A "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"reference "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"a "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"statute "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"statutory "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"provision "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"is "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"a "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"reference "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"it "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"as "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"amended, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"extended "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"re-enacted "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"from "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"time "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"time."}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Sale "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"purchase "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"shares"}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"The "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Seller "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agrees "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"sell "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Shares "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"with "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"full "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"title "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"guarantee "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"free "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"from "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"all "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Encumbrances "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"for "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"a "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"total "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"consideration "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::cf1e98be-a3d0-4910-bc6d-b296bbd29bd3::shares.saleAgreedComputed"},{"characterFormat":{"bidi":false},"text":"shares.saleAgreedComputed"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::cf1e98be-a3d0-4910-bc6d-b296bbd29bd3::shares.saleAgreedComputed"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Buyer "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agrees "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"purchase "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Shares "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"pay "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"such "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"consideration "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Seller."}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Completion "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"sale "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"purchase "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Shares "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"take "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"place "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"on "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::39a702c2-c96e-4bc7-90c7-7fe37c0fa3c8::shares.completionDate"},{"characterFormat":{"bidi":false},"text":"shares.completionDate"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::39a702c2-c96e-4bc7-90c7-7fe37c0fa3c8::shares.completionDate"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"when "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Seller "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"deliver "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"share "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"certificate(s) "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"other "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"evidence "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"title "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Shares "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Buyer "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Buyer "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"satisfy "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"its "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"obligation "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"pay "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"consideration "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"due "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"respect "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Shares "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"by "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"payment "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"sum "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::4abe0170-f809-43cd-90fd-df569634fd3b::shares.saleAgreedComputed"},{"characterFormat":{"bidi":false},"text":"shares.saleAgreedComputed"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::4abe0170-f809-43cd-90fd-df569634fd3b::shares.saleAgreedComputed"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Seller "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"by "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"way "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"electronic "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"transfer "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"immediately "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"available "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"funds "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Seller's "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"account "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"at"},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":11},"text":":"}]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":0,"textAlignment":"Left","styleName":"List Paragraph","listFormat":{"listId":-1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"DATA::919ee745-3cb9-4859-9a42-f7c1722132fa::seller.bankDetails"},{"characterFormat":{"bidi":false},"text":"seller.bankDetails"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::919ee745-3cb9-4859-9a42-f7c1722132fa::seller.bankDetails"}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Warranties"}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"The "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Seller "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"warrants "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Buyer "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"that "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"it "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"is "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"sole "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"legal "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"beneficial "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"owner "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Shares "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"is "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"entitled "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"transfer "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"legal "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"beneficial "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"title "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Shares "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Buyer "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"free "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"from "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"all "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Encumbrances, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"without "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"consent "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"other "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"person."}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Each "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"party "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"warrants "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"other, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"that:"}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"leftIndent":63,"firstLineIndent":-27,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":2}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"it "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"has "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"taken "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"all "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"necessary "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"actions "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"has "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"all "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"requisite "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"power "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"authority "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"enter "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"into "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"perform "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"that "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"constitutes "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"(or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"constitute "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"when "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"executed) "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"valid, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"legal "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"binding "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"obligations "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"on "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"that "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"party "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"accordance "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"with "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"its "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"terms; "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and"}]},{"paragraphFormat":{"leftIndent":63,"firstLineIndent":-27,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"leftIndent":63,"firstLineIndent":-27,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":2}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"execution "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"delivery "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"documents "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"referred "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"it, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"compliance "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"with "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"their "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"respective "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"terms "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"not "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"breach "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"constitute "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"a "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"default:"}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"leftIndent":90,"firstLineIndent":-27,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":3}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"under "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"its "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"articles "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"association, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"other "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"instrument "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"which "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"it "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"is "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"a "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"party "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"by "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"which "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"it "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"is "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"bound; "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or"}]},{"paragraphFormat":{"leftIndent":90,"firstLineIndent":-27,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"leftIndent":90,"firstLineIndent":-27,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":3}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"order, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"judgment, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"decree "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"other "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"restriction "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"applicable "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"it."}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Further "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"assurance"}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"At "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"its "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"own "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"expense, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Seller "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"promptly "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"execute "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"deliver "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"such "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"documents "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"perform "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"such "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"acts "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"as "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Buyer "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"may "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"reasonably "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"require "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"from "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"time "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"time "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"for "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"purpose "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"giving "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"full "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"effect "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement. "}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Assignment"}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Neither "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"party "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"assign, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"transfer, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"mortgage, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"charge, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"subcontract, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"delegate, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"declare "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"a "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"trust "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"over "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"deal "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"other "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"manner "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"with "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"its "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"rights "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"obligations "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"under "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement."}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Entire "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"agreement"}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"This "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"constitutes "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"entire "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"between "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"parties "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"supersedes "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"extinguishes "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"all "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"previous "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreements, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"promises, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"assurances, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"warranties, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"representations "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"understandings "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"between "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"them, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"whether "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"written "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"oral, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"relating "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"its "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"subject "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"matter."}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Each "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"party "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agrees "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"that "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"it "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"have "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"no "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"remedies "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"respect "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"statement, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"representation, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"assurance "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"warranty "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"(whether "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"made "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"innocently "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"negligently) "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"that "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"is "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"not "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"set "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"out "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement. "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Each "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"party "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agrees "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"that "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"it "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"have "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"no "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"claim "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"for "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"innocent "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"negligent"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"misrepresentation "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"negligent "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"misstatement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"based "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"on "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"statement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement."}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Costs "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"stamp "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"duty"}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Each "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"party "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"pay "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"its "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"own "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"costs "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"incurred "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"connection "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"with "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"negotiation, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"preparation "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"execution "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement. "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"All "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"stamp "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"duty "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"(including "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"fines, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"penalties "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"interest) "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"that "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"may "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"be "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"payable "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"on "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"connection "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"with "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"instrument "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"executed "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"under "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"agreement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"be "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"borne "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"by "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Buyer."}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Variation "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"waiver"}]},{"paragraphFormat":{"firstLineIndent":-36,"styleName":"Untitled subclause 1","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"a304574"},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"No "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"variation "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"agreement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"be "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"effective "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"unless "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"it "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"is "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"writing "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"signed "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"by "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"parties "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"(or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"their "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"authorised "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"representatives)."},{"characterFormat":{},"bookmarkType":1,"name":"a304574"}]},{"paragraphFormat":{"firstLineIndent":-36,"styleName":"Untitled subclause 1","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"a905319"},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"A "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"waiver "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"right "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"remedy "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"under "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"agreement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"by "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"law "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"is "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"only "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"effective "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"if "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"given "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"writing "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"not "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"be "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"deemed "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"a "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"waiver "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"subsequent "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"right "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"remedy. "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"A "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"failure "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"delay "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"by "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"a "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"party "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"exercise "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"right "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"remedy "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"provided "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"under "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"agreement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"by "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"law "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"not "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"constitute "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"a "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"waiver "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"that "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"other "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"right "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"remedy, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"nor "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"it "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"prevent "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"restrict "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"further "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"exercise "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"that "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"other "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"right "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"remedy. "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"No "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"single "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"partial "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"exercise "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"right "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"remedy "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"prevent "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"restrict "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"further "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"exercise "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"that "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"other "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"right "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"remedy."},{"characterFormat":{},"bookmarkType":1,"name":"a905319"}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Notices"}]},{"paragraphFormat":{"firstLineIndent":-36,"styleName":"Untitled subclause 1","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"a520663"},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"Any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"notice "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"other "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"communication "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"given "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"a "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"party "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"under "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"connection "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"with "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"agreement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"be "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"writing "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"be:"},{"characterFormat":{},"bookmarkType":1,"name":"a520663"}]},{"paragraphFormat":{"leftIndent":63,"firstLineIndent":-27,"styleName":"Untitled subclause 2","listFormat":{"listId":1,"listLevelNumber":2}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"a343839"},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"delivered "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"by "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"hand "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"by "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"pre-paid "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"first-class "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"post "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"other "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"next "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"working "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"day "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"delivery "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"service "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"at "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"address "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"specified "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"for "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"it "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"clause "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"REF a154825 \\h \\n \\* MERGEFORMAT "},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"9.3"},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"fieldType":1},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"; "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{},"bookmarkType":1,"name":"a343839"}]},{"paragraphFormat":{"leftIndent":63,"firstLineIndent":-27,"styleName":"Untitled subclause 2","listFormat":{"listId":1,"listLevelNumber":2}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"a739048"},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"sent "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"by "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"email "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"address "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"specified "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"for "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"it "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"clause "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"REF a154825 \\h \\n \\* MERGEFORMAT "},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"9.3"},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"fieldType":1},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"."},{"characterFormat":{},"bookmarkType":1,"name":"a739048"}]},{"paragraphFormat":{"firstLineIndent":-36,"styleName":"Untitled subclause 1","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"a659520"},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"Any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"notice "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"communication "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"be "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"deemed "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"have "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"been "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"received:"},{"characterFormat":{},"bookmarkType":1,"name":"a659520"}]},{"paragraphFormat":{"leftIndent":63,"firstLineIndent":-27,"styleName":"Untitled subclause 2","listFormat":{"listId":1,"listLevelNumber":2}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"a553420"},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"if "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"delivered "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"by "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"hand, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"on "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"signature "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"a "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"delivery "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"receipt;"},{"characterFormat":{},"bookmarkType":1,"name":"a553420"}]},{"paragraphFormat":{"leftIndent":63,"firstLineIndent":-27,"styleName":"Untitled subclause 2","listFormat":{"listId":1,"listLevelNumber":2}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"a375883"},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"if "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"sent "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"by "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"pre-paid "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"first-class "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"post "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"other "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"next "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"working "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"day "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"delivery "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"service, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"at "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"9.00 "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"am "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"on "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"Business "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"Day "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"after "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"posting; "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or"},{"characterFormat":{},"bookmarkType":1,"name":"a375883"}]},{"paragraphFormat":{"leftIndent":63,"firstLineIndent":-27,"styleName":"Untitled subclause 2","listFormat":{"listId":1,"listLevelNumber":2}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"a642916"},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"if "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"sent "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"by "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"email, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"at "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"time "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"transmission "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"if "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"time "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"falls "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"outside "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"business "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"hours "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"place "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"receipt, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"when "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"business "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"hours "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"resume. "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"In "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"clause "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"9.2(c), "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"business "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"hours "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"means "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"9.00 "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"am "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"5.00 "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"pm "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"Monday "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"Friday "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"on "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"a "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"day "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"that "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"is "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"not "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"a "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"public "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"holiday "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"place "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"receipt."},{"characterFormat":{},"bookmarkType":1,"name":"a642916"}]},{"paragraphFormat":{"firstLineIndent":-36,"styleName":"Untitled subclause 1","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"a154825"},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"The "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"addresses "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"email "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"addresses "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"for "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"service "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"notices "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"are:"},{"characterFormat":{},"bookmarkType":1,"name":"a154825"}]},{"paragraphFormat":{"leftIndent":63,"firstLineIndent":-27,"styleName":"Untitled subclause 2","listFormat":{"listId":1,"listLevelNumber":2}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"Seller"}]},{"paragraphFormat":{"leftIndent":90,"firstLineIndent":-27,"styleName":"Untitled subclause 3","listFormat":{"listId":1,"listLevelNumber":3},"tabs":[{"position":0,"deletePosition":113.05,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"address: "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::818dc322-e0d2-48db-878c-ef2d4bfb9141::notices.sellerContactAddress"},{"characterFormat":{"bidi":false},"text":"notices.sellerContactAddress"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::818dc322-e0d2-48db-878c-ef2d4bfb9141::notices.sellerContactAddress"}]},{"paragraphFormat":{"leftIndent":90,"firstLineIndent":-27,"styleName":"Untitled subclause 3","listFormat":{"listId":1,"listLevelNumber":3},"tabs":[{"position":0,"deletePosition":113.05,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"for "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"attention "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of: "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::fc111fef-0838-4cd6-9de6-199878902854::notice.sellerAttention"},{"characterFormat":{"bidi":false},"text":"notice.sellerAttention"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::fc111fef-0838-4cd6-9de6-199878902854::notice.sellerAttention"}]},{"paragraphFormat":{"leftIndent":90,"firstLineIndent":-27,"styleName":"Untitled subclause 3","listFormat":{"listId":1,"listLevelNumber":3},"tabs":[{"position":0,"deletePosition":113.05,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"email "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"addres"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::e0ae6cfb-35bd-4421-a494-f78aaf5cb8fc::seller.email"},{"characterFormat":{"bidi":false},"text":"s: "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::c7acf86f-944e-4e40-a930-e0708106771c::seller.email"},{"characterFormat":{"bidi":false},"text":"seller.email"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::c7acf86f-944e-4e40-a930-e0708106771c::seller.email"}]},{"paragraphFormat":{"leftIndent":63,"firstLineIndent":-27,"styleName":"Untitled subclause 2","listFormat":{"listId":1,"listLevelNumber":2}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"Buyer"}]},{"paragraphFormat":{"leftIndent":90,"firstLineIndent":-27,"styleName":"Untitled subclause 3","listFormat":{"listId":1,"listLevelNumber":3},"tabs":[{"position":0,"deletePosition":113.05,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"address: "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::2b8280d8-b066-4fc2-a91d-d91fcec9f699::notices.buyerContactAddress"},{"characterFormat":{"bidi":false},"text":"notices.buyerContactAddress"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::2b8280d8-b066-4fc2-a91d-d91fcec9f699::notices.buyerContactAddress"}]},{"paragraphFormat":{"leftIndent":90,"firstLineIndent":-27,"styleName":"Untitled subclause 3","listFormat":{"listId":1,"listLevelNumber":3},"tabs":[{"position":0,"deletePosition":113.05,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"for "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"attention "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of: "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::fee97fec-c69b-4d31-a517-6b61f636de36::notice.buyerAttention"},{"characterFormat":{"bidi":false},"text":"notice.buyerAttention"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::fee97fec-c69b-4d31-a517-6b61f636de36::notice.buyerAttention"}]},{"paragraphFormat":{"leftIndent":90,"firstLineIndent":-27,"styleName":"Untitled subclause 3","listFormat":{"listId":1,"listLevelNumber":3},"tabs":[{"position":0,"deletePosition":113.05,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"email "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"addr"},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":12},"text":"ess: "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::7aed72dd-6dfa-4873-9426-9928e57f7562::buyer.email"},{"characterFormat":{"bidi":false},"text":"buyer.email"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::7aed72dd-6dfa-4873-9426-9928e57f7562::buyer.email"}]},{"paragraphFormat":{"firstLineIndent":-36,"styleName":"Untitled subclause 1","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"This "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"clause "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"does "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"not "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"apply "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"to "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"t"},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":12},"text":"h"},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"e "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"service "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"proceedings "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"other "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"documents "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"legal "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"action "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or,  "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"where "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"applicable, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"arbitration "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"other "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"method "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"dispute "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"resolution."}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Counterparts"}]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":0,"styleName":"Title Clause","listFormat":{"listId":-1,"listLevelNumber":0}},"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"a810511"},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"This "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"agreement "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"may "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"be "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"executed "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"in "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"any "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"number "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"counterparts, "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"each "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"which "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"when "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"executed "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"and "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"delivered "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"shall "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"constitute "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"a "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"duplicate "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"original, "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"but "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"all "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"the "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"counterparts "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"shall "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"together "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"constitute "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"the "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"one "},{"characterFormat":{"bold":false,"fontSize":11,"boldBidi":true,"fontSizeBidi":12},"text":"agreement."},{"characterFormat":{},"bookmarkType":1,"name":"a810511"}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","styleName":"List Paragraph","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"Governing "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"law "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":"jurisdiction"}]},{"paragraphFormat":{"firstLineIndent":-36,"styleName":"Untitled subclause 1","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"a1012635"},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"This "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"agreement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"any "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"dispute "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"claim "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"(including "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"non-contractual "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"disputes "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"claims) "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"arising "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"out "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"connection "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"with "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"it "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"its "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"subject "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"matter "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"formation "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"shall "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"be "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"governed "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"by "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"construed "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"accordance "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"with "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"law "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":12},"text":"Australia"},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"."},{"characterFormat":{},"bookmarkType":1,"name":"a1012635"}]},{"paragraphFormat":{"firstLineIndent":-36,"styleName":"Untitled subclause 1","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"a279669"},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"Each "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"party "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"irre"},{"characterFormat":{"fontSize":"11","fontSizeBidi":12},"text":"vocably "},{"characterFormat":{"fontSize":"11","fontSizeBidi":12},"text":"agrees "},{"characterFormat":{"fontSize":"11","fontSizeBidi":12},"text":"that "},{"characterFormat":{"fontSize":"11","fontSizeBidi":12},"text":"the "},{"characterFormat":{"fontSize":"11","fontSizeBidi":12},"text":"courts "},{"characterFormat":{"fontSize":"11","fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":"11","bidi":false,"fontSizeBidi":12},"text":"Australia"},{"characterFormat":{"fontSize":"11","fontSizeBidi":12},"text":" "},{"characterFormat":{"fontSize":"11","fontSizeBidi":12},"text":"shall "},{"characterFormat":{"fontSize":"11","fontSizeBidi":12},"text":"have "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"exclusive "},{"characterFormat":{"fontSize":"11","fontSizeBidi":12},"text":"jurisdiction "},{"characterFormat":{"fontSize":"11","fontSizeBidi":12},"text":"to "},{"characterFormat":{"fontSize":"11","fontSizeBidi":12},"text":"settle "},{"characterFormat":{"fontSize":"11","fontSizeBidi":12},"text":"any "},{"characterFormat":{"fontSize":"11","fontSizeBidi":12},"text":"dis"},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"pute "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"claim "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"(including "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"non-contractual "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"disputes "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"claims) "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"arising "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"out "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"in "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"connection "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"with "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"this "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"agreement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"its "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"subject "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"matter "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"or "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"formation."},{"characterFormat":{},"bookmarkType":1,"name":"a279669"}]},{"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"styleName":"Untitled subclause 1","listFormat":{"listId":-1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"styleName":"Untitled subclause 1","listFormat":{"listId":-1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{},"text":"\f"}]},{"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"styleName":"Untitled subclause 1","listFormat":{"listId":-1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"This "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"agreement "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"has "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"been "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"entered "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"into "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"on "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"date "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"stated "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"at "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"beginning "},{"characterFormat":{"fontSize":11,"fontSizeBidi":12},"text":"of "},{"characterFormat":{"fontSize":11,"bidi":false,"fontSizeBidi":12},"text":"it."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"DATA::48db31f3-006b-42d4-8939-d7cee9d058c8::sellerIndividualSignature"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::48db31f3-006b-42d4-8939-d7cee9d058c8::sellerIndividualSignature"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"                       asd"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"Signature : __________________"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"Name       : asd"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"Date         : asd"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":451.29998779296875,"cellWidth":180,"columnSpan":1,"rowSpan":1},"columnIndex":0}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0}}],"grid":[180],"tableFormat":{"borders":{"top":{"lineStyle":"Single","lineWidth":0.5},"left":{"lineStyle":"Single","lineWidth":0.5},"right":{"lineStyle":"Single","lineWidth":0.5},"bottom":{"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{},"diagonalUp":{},"horizontal":{"lineStyle":"Single","lineWidth":0.5},"vertical":{"lineStyle":"Single","lineWidth":0.5}},"shading":{},"topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidth":180,"preferredWidthType":"Point"},"columnCount":1},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"For and on behalf of "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::3c908b71-3f12-4e3c-84f0-a7c0770df4ca::seller.companyName"},{"characterFormat":{"bidi":false},"text":"seller.companyName"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::3c908b71-3f12-4e3c-84f0-a7c0770df4ca::seller.companyName"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"DATA::cdcf0602-800b-4ef2-86be-c388468fbd49::sellerCompanySignature"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::cdcf0602-800b-4ef2-86be-c388468fbd49::sellerCompanySignature"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"                     asd"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"Signature : ________________"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"Name       : ads"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"Role         : as"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"Date         : asd"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":451.29998779296875,"cellWidth":180,"columnSpan":1,"rowSpan":1},"columnIndex":0}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0}}],"grid":[180],"tableFormat":{"borders":{"top":{"lineStyle":"Single","lineWidth":0.5},"left":{"lineStyle":"Single","lineWidth":0.5},"right":{"lineStyle":"Single","lineWidth":0.5},"bottom":{"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{},"diagonalUp":{},"horizontal":{"lineStyle":"Single","lineWidth":0.5},"vertical":{"lineStyle":"Single","lineWidth":0.5}},"shading":{},"topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidth":180,"preferredWidthType":"Point"},"columnCount":1},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{"bidi":false},"text":" "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::a0bd3a38-d71f-4103-98b8-6a095c253aa2::buyerIndividualSignature"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::a0bd3a38-d71f-4103-98b8-6a095c253aa2::buyerIndividualSignature"},{"characterFormat":{"bidi":false},"text":"asd"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"Signature : _________________"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"Name       : ads"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"Date         : asd"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":451.29998779296875,"cellWidth":180,"columnSpan":1,"rowSpan":1},"columnIndex":0}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0}}],"grid":[180],"tableFormat":{"borders":{"top":{"lineStyle":"Single","lineWidth":0.5},"left":{"lineStyle":"Single","lineWidth":0.5},"right":{"lineStyle":"Single","lineWidth":0.5},"bottom":{"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{},"diagonalUp":{},"horizontal":{"lineStyle":"Single","lineWidth":0.5},"vertical":{"lineStyle":"Single","lineWidth":0.5}},"shading":{},"topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidth":180,"preferredWidthType":"Point"},"columnCount":1},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"For and on behalf of "},{"characterFormat":{},"bookmarkType":0,"name":"DATA::dc375d57-b387-45f0-b728-9b14e4b1a5ec::buyer.companyName"},{"characterFormat":{"bidi":false},"text":"buyer.companyName"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::dc375d57-b387-45f0-b728-9b14e4b1a5ec::buyer.companyName"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"DATA::3e5bfbe5-971e-495e-aca1-04845237c956::buyerCompanySignature"},{"characterFormat":{},"bookmarkType":1,"name":"DATA::3e5bfbe5-971e-495e-aca1-04845237c956::buyerCompanySignature"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"                             asfd"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"Signature : "},{"characterFormat":{"bidi":false},"text":"__________________"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"Name       : asd"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"Role         : asd"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"Date         : asd"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":451.29998779296875,"cellWidth":180,"columnSpan":1,"rowSpan":1},"columnIndex":0}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0}}],"grid":[180],"tableFormat":{"borders":{"top":{"lineStyle":"Single","lineWidth":0.5},"left":{"lineStyle":"Single","lineWidth":0.5},"right":{"lineStyle":"Single","lineWidth":0.5},"bottom":{"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{},"diagonalUp":{},"horizontal":{"lineStyle":"Single","lineWidth":0.5},"vertical":{"lineStyle":"Single","lineWidth":0.5}},"shading":{},"topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidth":180,"preferredWidthType":"Point"},"columnCount":1},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"headersFooters":{"footer":{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{},"text":" PAGE   \\* MERGEFORMAT "},{"characterFormat":{},"fieldType":2},{"characterFormat":{},"text":"6"},{"characterFormat":{},"fieldType":1}]},{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Arial","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"leftIndent":36,"listFormat":{},"contextualSpacing":true},"characterFormat":{},"basedOn":"Normal","next":"List Paragraph"},{"name":"Header","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":225.64999389648438,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":451.29998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Header Char"},{"name":"Header Char","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":225.64999389648438,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":451.29998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Footer Char","next":"Normal"},{"name":"Footer Char","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Title Clause","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":12,"afterSpacing":12,"lineSpacing":15,"lineSpacingType":"AtLeast","outlineLevel":"Level1","listFormat":{"listId":4}},"characterFormat":{"bold":true},"basedOn":"Normal","next":"Normal"},{"name":"Untitled subclause 1","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":14,"afterSpacing":6,"lineSpacing":15,"lineSpacingType":"AtLeast","outlineLevel":"Level2","listFormat":{"listId":4,"listLevelNumber":1}},"characterFormat":{},"basedOn":"Normal","next":"Normal"},{"name":"Untitled subclause 2","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","afterSpacing":6,"lineSpacing":15,"lineSpacingType":"AtLeast","outlineLevel":"Level3","listFormat":{"listId":4,"listLevelNumber":2}},"characterFormat":{},"basedOn":"Normal","next":"Normal"},{"name":"Untitled subclause 3","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","afterSpacing":6,"lineSpacing":15,"lineSpacingType":"AtLeast","outlineLevel":"Level4","listFormat":{"listId":4,"listLevelNumber":3},"tabs":[{"position":113.05000305175781,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","next":"Normal"},{"name":"Untitled subclause 4","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","afterSpacing":6,"lineSpacing":15,"lineSpacingType":"AtLeast","outlineLevel":"Level5","listFormat":{"listId":4,"listLevelNumber":4}},"characterFormat":{},"basedOn":"Normal"},{"name":"Abstract","type":"Paragraph","paragraphFormat":{"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":12,"fontColor":"#000000FF","fontSizeBidi":12},"link":"Abstract Char"},{"name":"Abstract Char","type":"Character","characterFormat":{"fontSize":12,"fontColor":"#000000FF","fontSizeBidi":12},"basedOn":"Default Paragraph Font"},{"name":"Testimonium","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","afterSpacing":6,"lineSpacing":15,"lineSpacingType":"AtLeast","listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[{"abstractListId":1,"levelOverrides":[],"listId":1},{"abstractListId":3,"levelOverrides":[],"listId":3},{"abstractListId":0,"levelOverrides":[{"levelNumber":0,"startAt":1},{"levelNumber":1,"startAt":1},{"levelNumber":2,"startAt":1},{"levelNumber":3,"startAt":1},{"levelNumber":4,"startAt":1},{"levelNumber":5,"startAt":1},{"levelNumber":6,"startAt":1},{"levelNumber":7,"startAt":1},{"levelNumber":8,"startAt":1}],"listId":4}],"abstractLists":[{"abstractListId":0,"levels":[{"characterFormat":{"fontColor":"#000000FF"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{"fontColor":"#000000FF"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2","restartLevel":1,"startAt":1},{"characterFormat":{"fontColor":"#000000FF"},"paragraphFormat":{"leftIndent":77.75,"firstLineIndent":-28.049999237060547,"listFormat":{},"tabs":[{"position":77.75,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"(%3)","restartLevel":2,"startAt":1},{"characterFormat":{"fontSize":10,"fontColor":"#000000FF"},"paragraphFormat":{"leftIndent":113.75,"firstLineIndent":-28.799999237060547,"listFormat":{},"tabs":[{"position":120.94999694824219,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"(%4)","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":144,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"UpLetter","numberFormat":"(%5)","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"(%6)","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":126,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":162,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]},{"abstractListId":1,"levels":[{"characterFormat":{"bold":true,"boldBidi":true},"paragraphFormat":{"leftIndent":18,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":54,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"(%3)","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"(%4)","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":90,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"(%5)","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"(%6)","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":126,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":162,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]},{"abstractListId":3,"levels":[{"characterFormat":{},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"(%1)","restartLevel":0,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]}],"comments":[]};
describe('Form field API validation', () => {
    let documentEditor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        documentEditor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (documentEditor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (documentEditor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (documentEditor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (documentEditor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        documentEditor.appendTo("#container");
    });
    afterAll((done) => {
        documentEditor.destroy();
        document.body.removeChild(document.getElementById('container'));
        documentEditor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('get form field names', () => {
console.log('get form field names');
        documentEditor.editor.insertFormField('Text');
        documentEditor.editor.insertFormField('CheckBox');
        documentEditor.editor.insertFormField('DropDown');
        (documentEditor.documentHelper.formFields[0].formFieldData as TextFormField).name = 'Text1';
        documentEditor.editor.updateFormField(documentEditor.documentHelper.formFields[0], 'TEXT', true);
        (documentEditor.documentHelper.formFields[1].formFieldData as CheckBoxFormField).name = 'Checkbox1';
        (documentEditor.documentHelper.formFields[2].formFieldData as DropDownFormField).name = 'Dropdown1';
        documentEditor.getFormFieldNames();
        expect((documentEditor.documentHelper.formFields[0].formFieldData as TextFormField).name).toBe('Text1');
        expect((documentEditor.documentHelper.formFields[1].formFieldData as CheckBoxFormField).name).toBe('Checkbox1');
        expect((documentEditor.documentHelper.formFields[2].formFieldData as DropDownFormField).name).toBe('Dropdown1');
    })
    it('get form fields', () => {
console.log('get form fields');
        (documentEditor.documentHelper.formFields[0].formFieldData as TextFormField).name = 'Text1';
        (documentEditor.documentHelper.formFields[1].formFieldData as CheckBoxFormField).name = 'Checkbox1';
        (documentEditor.documentHelper.formFields[2].formFieldData as DropDownFormField).name = 'Dropdown1';
        (documentEditor.documentHelper.formFields[2].formFieldData as DropDownFormField).selectedIndex = 0;
        documentEditor.getFormFieldInfo('Dropdown1');
        expect((documentEditor.documentHelper.formFields[2].formFieldData as DropDownFormField).name).toBe('Dropdown1');
        expect((documentEditor.documentHelper.formFields[2].formFieldData as DropDownFormField).selectedIndex).toBe(0);
    })
    it('set form fields', () => {
console.log('set form fields');
        (documentEditor.documentHelper.formFields[0].formFieldData as TextFormField).name = 'Text1';
        (documentEditor.documentHelper.formFields[0].formFieldData as TextFormField).defaultValue = 'check';
        (documentEditor.documentHelper.formFields[0].formFieldData as TextFormField).format = 'Uppercase';
        (documentEditor.documentHelper.formFields[0].formFieldData as TextFormField).enabled = true;
        (documentEditor.documentHelper.formFields[1].formFieldData as CheckBoxFormField).name = 'Checkbox1';
        (documentEditor.documentHelper.formFields[2].formFieldData as DropDownFormField).name = 'Dropdown1';
        let textInfo: TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo = documentEditor.getFormFieldInfo('Text1');
        documentEditor.setFormFieldInfo('Text1', textInfo);
        expect((documentEditor.documentHelper.formFields[2].formFieldData as TextFormField).defaultValue).toBe('check');
        expect((documentEditor.documentHelper.formFields[2].formFieldData as TextFormField).format).toBe('Uppercase');
        expect((documentEditor.documentHelper.formFields[2].formFieldData as TextFormField).enabled).toBe(true);
    })
    it('reset form fields', () => {
console.log('reset form fields');
        (documentEditor.documentHelper.formFields[2].formFieldData as TextFormField).name = 'Text1';
        (documentEditor.documentHelper.formFields[2].formFieldData as TextFormField).defaultValue = '';
        (documentEditor.documentHelper.formFields[0].formFieldData as CheckBoxFormField).name = 'Checkbox1';
        (documentEditor.documentHelper.formFields[0].formFieldData as CheckBoxFormField).checked = false;
        (documentEditor.documentHelper.formFields[1].formFieldData as DropDownFormField).name = 'Dropdown1';
        (documentEditor.documentHelper.formFields[1].formFieldData as DropDownFormField).selectedIndex = 0;
        (documentEditor.documentHelper.formFields[1].formFieldData as DropDownFormField).dropdownItems = ['one', 'two', 'three'];
        documentEditor.resetFormFields();
        expect((documentEditor.documentHelper.formFields[2].formFieldData as TextFormField).defaultValue).toBe('');
        expect((documentEditor.documentHelper.formFields[0].formFieldData as CheckBoxFormField).checked).toBe(false);
        expect((documentEditor.documentHelper.formFields[1].formFieldData as DropDownFormField).selectedIndex).toBe(0);
    })
    it('export form fields', () => {
console.log('export form fields');
        let formData: FormFieldData[] = documentEditor.exportFormData();
        let text: string = (documentEditor.documentHelper.formFields[2].formFieldData as TextFormField).defaultValue;
        expect(formData[2].value).toBe(text);
        let checked: boolean = (documentEditor.documentHelper.formFields[0].formFieldData as CheckBoxFormField).checked;
        expect(formData[0].value).toBe(checked);
        let index: number = (documentEditor.documentHelper.formFields[1].formFieldData as DropDownFormField).selectedIndex;
        expect(formData[1].value).toBe(index);
    })
    it('import form fields', () => {
console.log('import form fields');
        let formData: FormFieldData[] = documentEditor.exportFormData();
        let formfield: FieldElementBox[] = documentEditor.documentHelper.formFields;
        documentEditor.editor.updateFormField(formfield[2], 'result', true);
        documentEditor.importFormData(formData);
        let text: string = formData[2].value as string;
        expect((documentEditor.documentHelper.formFields[2].formFieldData as TextFormField).defaultValue).toBe(text);
        let checked: boolean = formData[0].value as boolean;
        expect((documentEditor.documentHelper.formFields[0].formFieldData as CheckBoxFormField).checked).toBe(checked);
        let index: number = formData[1].value as number;
        expect((documentEditor.documentHelper.formFields[1].formFieldData as DropDownFormField).selectedIndex).toBe(index);
    })
    it('set checkbox form fields', () => {
console.log('set checkbox form fields');
        (documentEditor.documentHelper.formFields[0].formFieldData as CheckBoxFormField).size = 11;
        (documentEditor.documentHelper.formFields[0].formFieldData as CheckBoxFormField).sizeType = 'Auto';
        let checkboxInfo: TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo = documentEditor.getFormFieldInfo('Checkbox1');
        documentEditor.setFormFieldInfo('Checkbox1', checkboxInfo);
        expect((documentEditor.documentHelper.formFields[2].formFieldData as CheckBoxFormField).size).toBe(11);
        expect((documentEditor.documentHelper.formFields[2].formFieldData as CheckBoxFormField).sizeType).toBe('Auto');
    })
    it('set dropdown form fields', () => {
console.log('set dropdown form fields');
        let dropdownInfo: TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo = documentEditor.getFormFieldInfo('Dropdown1');
        documentEditor.setFormFieldInfo('Dropdown1', dropdownInfo);
        expect((documentEditor.documentHelper.formFields[2].formFieldData as DropDownFormField).selectedIndex).toBe(0);
    })
    it('prevent content change trigger', () => {
console.log('prevent content change trigger');
        documentEditor.openBlank();
        documentEditor.layoutType = 'Continuous';
        expect(() => { documentEditor.editor.layoutWholeDocument() }).not.toThrowError();
    })
    it('Bookmark reference validation', () => {
console.log('Bookmark reference validation');
        expect(() => { documentEditor.open(JSON.stringify(sfdt)) }).not.toThrowError();
        documentEditor.documentHelper.selection.handleHomeKey();
        documentEditor.documentHelper.selection.selectCurrentWord();
        expect(() => { documentEditor.documentHelper.selection.bookmarks }).not.toThrowError();
    });
    it('Restrict editing pane public api validation', () => {
console.log('Restrict editing pane public api validation');
        documentEditor.openBlank();
        expect(() => { documentEditor.showRestrictEditingPane() }).not.toThrowError();
    });
    it('Restrict editing trackchanges pane validation', () => {
console.log('Restrict editing trackchanges pane validation');
        documentEditor.openBlank();
        documentEditor.enableTrackChanges = true;
        documentEditor.isReadOnly = true;
        expect(documentEditor.showRevisions).toBe(false);
        documentEditor.isReadOnly =  false;
        documentEditor.documentHelper.isDocumentProtected = true;
        expect(documentEditor.showRevisions).toBe(false);
    });
});
