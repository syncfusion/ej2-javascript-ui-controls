import { DocumentEditor } from '../src/document-editor/document-editor';
import {
    Margin, Page, TableWidget, ImageElementBox, TableRowWidget, TextFormField, CheckBoxFormField, DropDownFormField, FieldElementBox,
    TableCellWidget, BodyWidget, ParagraphWidget, LineWidget, ElementBox, TextElementBox, XmlHttpRequestHandler, DocumentHelper, TextFormFieldInfo, CheckBoxFormFieldInfo, DropDownFormFieldInfo
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
            setTimeout(function () {
                done();
            }, 1000);
        })
        it('Get module name in Document Editor', () => {
            expect(editor.getModuleName()).toBe("DocumentEditor");
            expect(editor.getPersistData()).toBe("documenteditor");
        });
        it('document title testing', () => {
            expect(editor.documentName).toEqual('');
        });
        it('Layout Enabled property testing', () => {
            editor.isLayoutEnabled = true;
            expect(editor.isLayoutEnabled).toBe(true);
        });
        it('Shift Enabled property testing', () => {
            editor.isShiftingEnabled = true;
            expect(editor.isShiftingEnabled).toBe(true);
        });
        it('page background color', () => {
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
            setTimeout(function () {
                done();
            }, 1000);
        });
        it('container className testing', () => {
            expect(editor.element.classList.contains("e-documenteditor")).toEqual(true);
        });
        it('Editable div container test', () => {
            expect(editor.documentHelper.editableDiv.parentElement).toBe(editor.documentHelper.iframe.contentDocument.body);
        });
        it('viewerContainer element testing', () => {
            let container = document.querySelector("#container");
            let viewerContainer = document.querySelector("#container_viewerContainer");
            expect(container.contains(viewerContainer)).toEqual(true);
        });
        it('pageContainer element testing', () => {
            let viewerContainer = document.querySelector("#container_viewerContainer");
            let pageContainer = document.querySelector("#container_pageContainer");
            expect(viewerContainer.contains(pageContainer)).toEqual(true);
        });
        it('canvas rendering testing', () => {
            pagecontainer = document.querySelector("#container_pageContainer");
            let canvas = document.getElementsByTagName('canvas')[0];
            expect(pagecontainer.contains(canvas)).toEqual(true);
        });
        it('element testing', () => {
            expect(document.getElementById("container").id).toEqual(editor.element.id);
        });
        it('element testing after removing container', () => {
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
            let bodyWidget: BodyWidget = new BodyWidget();
            expect('').toBe('');
        });
        it('margin testing', () => {
            let margin = new Margin(10, 10, 10, 10);
            expect(margin.bottom).toBe(10);
            expect(margin.top).toBe(10);
            expect(margin.right).toBe(10);
            expect(margin.left).toBe(10);
        });
        it('margin class api testing', () => {
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
            let page: Page = new Page(undefined);
            page.bodyWidgets = undefined;
            expect(() => { page.destroy() }).not.toThrowError();
        });
        it('image element box validation', () => {
            let image: ImageElementBox = new ImageElementBox(undefined);
            expect(() => { image.line }).not.toThrowError();
        });
        it('Table Row widget validation', () => {
            let row: TableRowWidget = new TableRowWidget();
            row.childWidgets = undefined;
            expect(() => { row.destroy(); }).not.toThrowError();
        });
        it('Paragraph widget validation', () => {
            let row: ParagraphWidget = new ParagraphWidget();
            row.childWidgets = undefined;
            expect(() => { row.destroy(); }).not.toThrowError();
        });
        it('Line widget validation', () => {
            let line: LineWidget = new LineWidget(undefined);
            line.children = undefined;
            expect(() => { line.destroy(); }).not.toThrowError();
        });
        it('Table cell widget validation', () => {
            let cell: TableCellWidget = new TableCellWidget();
            cell.childWidgets = undefined;
            expect(() => { cell.destroy(); }).not.toThrowError();
        });
        it('BodyWidget validation', () => {
            let body: BodyWidget = new BodyWidget();
            body.page = undefined;
            body.childWidgets = undefined;
            expect(() => { body.destroy(); }).not.toThrowError();
        });
        it('Table widget validation', () => {
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
            setTimeout(function () {
                done();
            }, 1000);
        });
        it('Localization en-US testing', () => {
            let oldProp: DocumentEditorModel = { locale: '' };
            let newProp: DocumentEditorModel = { locale: 'en-US' };
            editor.locale = 'en-US';
            editor.onPropertyChanged(newProp, oldProp);
            expect(editor.locale).toBe('en-US');
        });
        it('Localization empty string testing', () => {
            let oldProp: DocumentEditorModel = { locale: 'en-US' };
            let newProp: DocumentEditorModel = { locale: '' };
            editor.locale = '';
            editor.onPropertyChanged(newProp, oldProp);
            expect(editor.locale).toBe('');
        });
        it('page gap API validation', () => {
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
            setTimeout(function () {
                done();
            }, 1000);
        });

        it('Show ListDialog dialog testing', () => {
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
            setTimeout(function () {
                done();
            }, 1000);
        });

        it('table dialog-preferred width using point testing', () => {
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
            setTimeout(function () {
                done();
            }, 1000);
        });
        it('table dialog-table left alignment testing', () => {
            editor.open(getJson());
            editor.showTablePropertiesDialog();
            document.getElementById('container_TablePropertiesDialog_TablePropertiesContentDialogTab_left_alignment').click();
            expect(document.getElementById('container_TablePropertiesDialog_TablePropertiesContentDialogTab_left_alignment').classList.contains('e-de-table-alignment-active')).toBe(true);
            editor.tablePropertiesDialogModule.applyTableProperties();
        });
        it('table dialog-table center alignment testing', () => {
            editor.open(getJson());
            editor.showTablePropertiesDialog();
            document.getElementById('container_TablePropertiesDialog_TablePropertiesContentDialogTab_center_alignment').click();
            expect(document.getElementById('container_TablePropertiesDialog_TablePropertiesContentDialogTab_center_alignment').classList.contains('e-de-table-alignment-active')).toBe(true);
            editor.tablePropertiesDialogModule.applyTableProperties();
        });
        it('table dialog-table right alignment testing', () => {
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
            editor.open(getJson());
            editor.showTablePropertiesDialog();
            (editor.tablePropertiesDialogModule as any).bordersAndShadingButton.click();
            (document.getElementsByClassName('e-de-table-border-none')[0] as any).click();
            expect((document.getElementsByClassName('e-de-table-border-none')[0]).children[0].classList.contains('e-de-table-border-inside-setting-click')).toBe(true);
        });
        it('setting border style as box testing', () => {
            editor.open(getJson());
            editor.showTablePropertiesDialog();
            (editor.tablePropertiesDialogModule as any).bordersAndShadingButton.click();
            (document.getElementsByClassName('e-de-table-border-box')[0] as any).click();
            expect((document.getElementsByClassName('e-de-table-border-box')[0]).children[0].classList.contains('e-de-table-border-inside-setting-click')).toBe(true);
        });
        it('setting border style as all testing', () => {
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
            setTimeout(function () {
                done();
            }, 1000);
        });
        it('Prevent bold operation', () => {
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
        it('Created event validation', () => {
            let createSpy = jasmine.createSpy('created');
            let ele: HTMLElement = createElement('div', { id: 'container' });
            document.body.appendChild(ele);

            documentEditor.created = createSpy;

            documentEditor.appendTo(ele);
            expect(createSpy).toHaveBeenCalled();
        });
        it('Destroy vaalidation', () => {
            let destroy = jasmine.createSpy('destroy');
            documentEditor.destroyed = destroy;
            documentEditor.destroy();
            expect(destroy).toHaveBeenCalled();
        });
    });

    it('memory leak', () => {
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
        setTimeout(function () {
            done();
        }, 500);
    });

    it('In Device testing', function () {
        expect(() => { editor.appendTo("#container"); }).not.toThrowError();
    });
});

describe('Header Ajax value checking', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('header value checking', () => {
        editor.headers = [{ "syncfusion": "true" }];
        var httpRequest = new XmlHttpRequestHandler();
        httpRequest.customHeaders = editor.headers;
        var formObject = {};
        expect(() => { httpRequest.send(formObject); }).not.toThrowError();
    })
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Insert comment', () => {
        editor.editor.insertComment();
        expect(editor.showComments).toBe(true);
        editor.enableComment = false;
    });
    it('set enable comment as false', () => {
        editor.enableComment = false;
        expect(editor.showComments).toBe(false);
    });
    it('insert comment after enable comment as false', () => {
        editor.openBlank();
        editor.editor.insertComment();
        expect(editor.documentHelper.comments.length).toBe(0);
    })

});
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('get form field names', () => {
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
        (documentEditor.documentHelper.formFields[0].formFieldData as TextFormField).name = 'Text1';
        (documentEditor.documentHelper.formFields[1].formFieldData as CheckBoxFormField).name = 'Checkbox1';
        (documentEditor.documentHelper.formFields[2].formFieldData as DropDownFormField).name = 'Dropdown1';
        (documentEditor.documentHelper.formFields[2].formFieldData as DropDownFormField).selectedIndex = 0;
        documentEditor.getFormFieldInfo('Dropdown1');
        expect((documentEditor.documentHelper.formFields[2].formFieldData as DropDownFormField).name).toBe('Dropdown1');
        expect((documentEditor.documentHelper.formFields[2].formFieldData as DropDownFormField).selectedIndex).toBe(0);
    })
    it('set form fields', () => {
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
        (documentEditor.documentHelper.formFields[2].formFieldData as TextFormField).name = 'Text1';
        (documentEditor.documentHelper.formFields[2].formFieldData as TextFormField).defaultValue = '';
        (documentEditor.documentHelper.formFields[0].formFieldData as CheckBoxFormField).name = 'Checkbox1';
        (documentEditor.documentHelper.formFields[0].formFieldData as CheckBoxFormField).checked = false;
        (documentEditor.documentHelper.formFields[1].formFieldData as DropDownFormField).name = 'Dropdown1';
        (documentEditor.documentHelper.formFields[1].formFieldData as DropDownFormField).selectedIndex = 0;
        (documentEditor.documentHelper.formFields[1].formFieldData as DropDownFormField).dropDownItems = ['one', 'two', 'three'];
        documentEditor.resetFormFields();
        expect((documentEditor.documentHelper.formFields[2].formFieldData as TextFormField).defaultValue).toBe('');
        expect((documentEditor.documentHelper.formFields[0].formFieldData as CheckBoxFormField).checked).toBe(false);
        expect((documentEditor.documentHelper.formFields[1].formFieldData as DropDownFormField).selectedIndex).toBe(0);
    })
    it('export form fields', () => {
        let formData: any = documentEditor.exportFormData();
        let text: string = (documentEditor.documentHelper.formFields[2].formFieldData as TextFormField).defaultValue;
        expect(formData[2][(documentEditor.documentHelper.formFields[2].formFieldData as TextFormField).name]).toBe(text);
        let checked: boolean = (documentEditor.documentHelper.formFields[0].formFieldData as CheckBoxFormField).checked;
        expect(formData[0][(documentEditor.documentHelper.formFields[0].formFieldData as CheckBoxFormField).name]).toBe(checked);
        let index: number = (documentEditor.documentHelper.formFields[1].formFieldData as DropDownFormField).selectedIndex;
        expect(formData[1][(documentEditor.documentHelper.formFields[1].formFieldData as DropDownFormField).name]).toBe(index);
    })
    it('import form fields', () => {
        let formData: any = documentEditor.exportFormData();
        let formfield: FieldElementBox[] = documentEditor.documentHelper.formFields;
        documentEditor.editor.updateFormField(formfield[2], 'result', true);
        documentEditor.importFormData(formData);
        let text: string = formData[2][(documentEditor.documentHelper.formFields[2].formFieldData as TextFormField).name];
        expect((documentEditor.documentHelper.formFields[2].formFieldData as TextFormField).defaultValue).toBe(text);
        let checked: boolean = formData[0][(documentEditor.documentHelper.formFields[0].formFieldData as CheckBoxFormField).name];
        expect((documentEditor.documentHelper.formFields[0].formFieldData as CheckBoxFormField).checked).toBe(checked);
        let index: number = formData[1][(documentEditor.documentHelper.formFields[1].formFieldData as DropDownFormField).name];
        expect((documentEditor.documentHelper.formFields[1].formFieldData as DropDownFormField).selectedIndex).toBe(index);
    })
    it('set checkbox form fields', () => {
        (documentEditor.documentHelper.formFields[0].formFieldData as CheckBoxFormField).size = 11;
        (documentEditor.documentHelper.formFields[0].formFieldData as CheckBoxFormField).sizeType = 'Auto';
        let checkboxInfo: TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo = documentEditor.getFormFieldInfo('Checkbox1');
        documentEditor.setFormFieldInfo('Checkbox1', checkboxInfo);
        expect((documentEditor.documentHelper.formFields[2].formFieldData as CheckBoxFormField).size).toBe(11);
        expect((documentEditor.documentHelper.formFields[2].formFieldData as CheckBoxFormField).sizeType).toBe('Auto');
    })
    it('set dropdown form fields', () => {
        let dropdownInfo: TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo = documentEditor.getFormFieldInfo('Dropdown1');
        documentEditor.setFormFieldInfo('Dropdown1', dropdownInfo);
        expect((documentEditor.documentHelper.formFields[2].formFieldData as DropDownFormField).selectedIndex).toBe(0);
    })
});