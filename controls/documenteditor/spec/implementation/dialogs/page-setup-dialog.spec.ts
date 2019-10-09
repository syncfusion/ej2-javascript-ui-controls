import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { PageSetupDialog } from '../../../src/document-editor/implementation/dialogs/page-setup-dialog';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { SelectionSectionFormat } from '../../../src/index';
/**
 * Layout dialog spec
 */
describe('PageSetup Dialog Test Case Validation - 1', function () {
    let editor: DocumentEditor;
    let dialog: PageSetupDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(PageSetupDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        editor.enablePageSetupDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.pageSetupDialogModule
        dialog.show()
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Load PageSetup Dialog testing', function () {
        dialog.loadPageSetupDialog();
    });
    it('On OK Button testing', function () {
        dialog.applyPageSetupProperties();
    });
    it('On Cancel Button testing', function () {
        dialog.closePageSetupDialog();
        dialog.onCancelButtonClick();
    });
});

describe('PageSetup Dialog Test Case Validation - 2', function () {
    let selectionSectionFormat: SelectionSectionFormat;
    let editor: DocumentEditor;
    let dialog: PageSetupDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(PageSetupDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor:true, enableEditorHistory: true, enableSelection: true, isReadOnly: false });
        editor.enablePageSetupDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.pageSetupDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        selectionSectionFormat = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Load sectionFormat test case', function () {
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        selectionSectionFormat.topMargin = 70;
        selectionSectionFormat.bottomMargin = 100;
        selectionSectionFormat.leftMargin = 100;
        selectionSectionFormat.rightMargin = 100;
        dialog.loadPageSetupDialog();
    });
    it('Apply portrait to the document', () => {
        editor.editorModule.onPortrait();
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(612);
        expect(selectionSectionFormat.pageHeight).toEqual(792);
    });

    it('Apply paper size to letter', () => {
        editor.editorModule.onPaperSize('letter')
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(611.9);
        expect(selectionSectionFormat.pageHeight).toEqual(791.9);
    });
    it('Apply paper size to tabloid', () => {
        editor.editorModule.onPaperSize('tabloid')
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(791.9);
        expect(selectionSectionFormat.pageHeight).toEqual(1223.9);
    });
    it('Apply paper size to legal', () => {
        editor.editorModule.onPaperSize('legal')
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(611.9);
        expect(selectionSectionFormat.pageHeight).toEqual(1007.9);
    });
    it('Apply paper size to statement', () => {
        editor.editorModule.onPaperSize('statement')
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(396);
        expect(selectionSectionFormat.pageHeight).toEqual(611.9);
    });

    it('Apply paper size to executive', () => {
        editor.editorModule.onPaperSize('executive')
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(521.9);
        expect(selectionSectionFormat.pageHeight).toEqual(755.9);
    });
    it('Apply paper size to a3', () => {
        editor.editorModule.onPaperSize('a3')
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(841.8);
        expect(selectionSectionFormat.pageHeight).toEqual(1190.4);
    });
    it('Apply paper size to a4', () => {
        editor.editorModule.onPaperSize('a4')
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(595.2);
        expect(selectionSectionFormat.pageHeight).toEqual(841.8);
    });
    it('Apply paper size to a5', () => {
        editor.editorModule.onPaperSize('a5')
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(419.5);
        expect(selectionSectionFormat.pageHeight).toEqual(595.2);
    });
    it('Apply paper size to b4', () => {
        editor.editorModule.onPaperSize('b4')
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(728.4);
        expect(selectionSectionFormat.pageHeight).toEqual(1031.7);
    });
    it('Apply paper size to b5', () => {
        editor.editorModule.onPaperSize('b5')
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(515.8);
        expect(selectionSectionFormat.pageHeight).toEqual(728.4);
    });
    it('Apply margin value to lastCustomSetting', () => {
        editor.editorModule.changeMarginValue('lastCustomSetting');
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.topMargin).toEqual(72);
        expect(selectionSectionFormat.bottomMargin).toEqual(72);
        expect(selectionSectionFormat.leftMargin).toEqual(72);
        expect(selectionSectionFormat.rightMargin).toEqual(72);
    });
    it('Apply margin value to normal', () => {
        editor.editorModule.changeMarginValue('normal');
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.topMargin).toEqual(72);
        expect(selectionSectionFormat.bottomMargin).toEqual(72);
        expect(selectionSectionFormat.leftMargin).toEqual(72);
        expect(selectionSectionFormat.rightMargin).toEqual(72);
    });
    it('Apply margin value to narrow', () => {
        editor.editorModule.changeMarginValue('narrow');
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.topMargin).toEqual(36);
        expect(selectionSectionFormat.bottomMargin).toEqual(36);
        expect(selectionSectionFormat.leftMargin).toEqual(36);
        expect(selectionSectionFormat.rightMargin).toEqual(36);
    });
    it('Apply margin value to moderate', () => {
        editor.editorModule.changeMarginValue('moderate');
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.topMargin).toEqual(72);
        expect(selectionSectionFormat.bottomMargin).toEqual(72);
        expect(selectionSectionFormat.leftMargin).toEqual(54);
        expect(selectionSectionFormat.rightMargin).toEqual(54);
    });
    it('Apply margin value to wide', () => {
        editor.editorModule.changeMarginValue('wide');
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.topMargin).toEqual(72);
        expect(selectionSectionFormat.bottomMargin).toEqual(72);
        expect(selectionSectionFormat.leftMargin).toEqual(144);
        expect(selectionSectionFormat.rightMargin).toEqual(144);
    });
    it('Apply margin value to mirrored', () => {
        editor.editorModule.changeMarginValue('mirrored');
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.topMargin).toEqual(72);
        expect(selectionSectionFormat.bottomMargin).toEqual(72);
        expect(selectionSectionFormat.leftMargin).toEqual(90);
        expect(selectionSectionFormat.rightMargin).toEqual(72);
    });
    it('Apply margin value to office2003Default', () => {
        editor.editorModule.changeMarginValue('office2003Default');
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.topMargin).toEqual(72);
        expect(selectionSectionFormat.bottomMargin).toEqual(72);
        expect(selectionSectionFormat.leftMargin).toEqual(90);
        expect(selectionSectionFormat.rightMargin).toEqual(90);
    });
});

describe('PageSetup Dialog Test Case Validation - 3', function () {
    let selectionSectionFormat: SelectionSectionFormat;
    let editor: DocumentEditor;
    let dialog: PageSetupDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(PageSetupDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enablePageSetupDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.pageSetupDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        selectionSectionFormat = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply landscape to the document', () => {
        editor.editorModule.onLandscape();
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(792);
        expect(selectionSectionFormat.pageHeight).toEqual(612);
    });
    it('Apply paper size to letter', () => {
        editor.editorModule.onPaperSize('letter');
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(791.9);
        expect(selectionSectionFormat.pageHeight).toEqual(611.9);
    });
    it('Apply paper size to tabloid', () => {
        editor.editorModule.onPaperSize('tabloid');
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(1223.9);
        expect(selectionSectionFormat.pageHeight).toEqual(791.9);
    });
    it('Apply paper size to legal', () => {
        editor.editorModule.onPaperSize('legal');
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(1007.9);
        expect(selectionSectionFormat.pageHeight).toEqual(611.9);
    });
    it('Apply paper size to statement', () => {
        editor.editorModule.onPaperSize('statement');
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(611.9);
        expect(selectionSectionFormat.pageHeight).toEqual(396);
    });

    it('Apply paper size to executive', () => {
        editor.editorModule.onPaperSize('executive');
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(755.9);
        expect(selectionSectionFormat.pageHeight).toEqual(521.9);
    });
    it('Apply paper size to a3', () => {
        editor.editorModule.onPaperSize('a3');
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(1190.4);
        expect(selectionSectionFormat.pageHeight).toEqual(841.8);
    });
    it('Apply paper size to a4', () => {
        editor.editorModule.onPaperSize('a4');
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(841.8);
        expect(selectionSectionFormat.pageHeight).toEqual(595.2);
    });
    it('Apply paper size to a5', () => {
        editor.editorModule.onPaperSize('a5');
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(595.2);
        expect(selectionSectionFormat.pageHeight).toEqual(419.5);
    });
    it('Apply paper size to b4', () => {
        editor.editorModule.onPaperSize('b4');
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(1031.7);
        expect(selectionSectionFormat.pageHeight).toEqual(728.4);
    });
    it('Apply paper size to b5', () => {
        editor.editorModule.onPaperSize('b5');
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(728.4);
        expect(selectionSectionFormat.pageHeight).toEqual(515.8);
    });
});
describe('PageSetup Dialog Test Case Validation - 4', function () {
    let selectionSectionFormat: SelectionSectionFormat;
    let editor: DocumentEditor;
    let dialog: PageSetupDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(PageSetupDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enablePageSetupDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.pageSetupDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        selectionSectionFormat = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply custom margins to the document', () => {
        editor.showPageSetupDialog();
    });
    it('Apply portrait to the document', () => {
        editor.editorModule.onLandscape();
        editor.editorModule.onPortrait();
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(612);
        expect(selectionSectionFormat.pageHeight).toEqual(792);
    });
});
describe('PageSetup Dialog Test Case Validation - 5', function () {
    let selectionSectionFormat: SelectionSectionFormat;
    let editor: DocumentEditor;
    let dialog: PageSetupDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(PageSetupDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enablePageSetupDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.pageSetupDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        selectionSectionFormat = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply custom margins to the document', () => {
        editor.showPageSetupDialog();
    });
    it('Apply paper size to letter', () => {
        let event: any;
        event = { value: 'letter' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(612);
        expect(height.value).toEqual(792);
    });
    it('Apply paper size to tabloid', () => {
        let event: any;
        event = { value: 'tabloid' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(792);
        expect(height.value).toEqual(1224);
    });
    it('Apply paper size to legal', () => {
        let event: any;
        event = { value: 'legal' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(612);
        expect(height.value).toEqual(1008);
    });
    it('Apply paper size to statement', () => {
        let event: any;
        event = { value: 'statement' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(392);
        expect(height.value).toEqual(612);
    });

    it('Apply paper size to executive', () => {
        let event: any;
        event = { value: 'executive' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(522);
        expect(height.value).toEqual(756);
    });
    it('Apply paper size to a3', () => {
        let event: any;
        event = { value: 'a3' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(841.9);
        expect(height.value).toEqual(1190.55);
    });
    it('Apply paper size to a4', () => {
        let event: any;
        event = { value: 'a4' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(595.3);
        expect(height.value).toEqual(841.9);
    });
    it('Apply paper size to a5', () => {
        let event: any;
        event = { value: 'a5' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(419.55);
        expect(height.value).toEqual(595.3);
    });
    it('Apply paper size to b4', () => {
        let event: any;
        event = { value: 'b4' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(728.5);
        expect(height.value).toEqual(1031.8);
    });
    it('Apply paper size to b5', () => {
        let event: any;
        event = { value: 'b5' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(515.9);
        expect(height.value).toEqual(728.5);
    });
});
describe('PageSetup Dialog Test Case Validation - 6', function () {
    let selectionSectionFormat: SelectionSectionFormat;
    let editor: DocumentEditor;
    let dialog: PageSetupDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(PageSetupDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enablePageSetupDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.pageSetupDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        selectionSectionFormat = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply custom margins to the document', () => {
        editor.showPageSetupDialog();
    });
    it('Apply landscape to the document', () => {
        editor.editorModule.onLandscape();
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(792);
        expect(selectionSectionFormat.pageHeight).toEqual(612);
    });
    it('Apply paper size to letter', () => {
        let event: any;
        event = { value: 'letter' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(792);
        expect(height.value).toEqual(612);
    });
    it('Apply paper size to tabloid', () => {
        let event: any;
        event = { value: 'tabloid' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(1224);
        expect(height.value).toEqual(792);
    });
    it('Apply paper size to legal', () => {
        let event: any;
        event = { value: 'legal' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(1008);
        expect(height.value).toEqual(612);
    });
    it('Apply paper size to statement', () => {
        let event: any;
        event = { value: 'statement' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(612);
        expect(height.value).toEqual(392);
    });

    it('Apply paper size to executive', () => {
        let event: any;
        event = { value: 'executive' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(756);
        expect(height.value).toEqual(522);
    });
    it('Apply paper size to a3', () => {
        let event: any;
        event = { value: 'a3' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(1190.55);
        expect(height.value).toEqual(841.9);
    });
    it('Apply paper size to a4', () => {
        let event: any;
        event = { value: 'a4' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(841.9);
        expect(height.value).toEqual(595.3);
    });
    it('Apply paper size to a5', () => {
        let event: any;
        event = { value: 'a5' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(595.3);
        expect(height.value).toEqual(419.55);
    });
    it('Apply paper size to b4', () => {
        let event: any;
        event = { value: 'b4' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(1031.8);
        expect(height.value).toEqual(728.5);
    });
    it('Apply paper size to b5', () => {
        let event: any;
        event = { value: 'b5' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(728.5);
        expect(height.value).toEqual(515.9);
    });
});
describe('PageSetup Dialog Test Case Validation - 7', function () {
    let selectionSectionFormat: SelectionSectionFormat;
    let editor: DocumentEditor;
    let dialog: PageSetupDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(PageSetupDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enablePageSetupDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.pageSetupDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        selectionSectionFormat = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply format', () => {
        editor.openBlank();
        editor.editorModule.onLandscape();
        editor.editorModule.onPaperSize('statement');
        expect(editor.selection.sectionFormat.pageWidth).toBe(611.9);
        expect(editor.selection.sectionFormat.pageHeight).toBe(396);
        editor.editorHistory.undo();
        expect(editor.selection.sectionFormat.pageWidth).toBe(792);
        expect(editor.selection.sectionFormat.pageHeight).toBe(612);
        editor.editorHistory.redo();
        expect(editor.selection.sectionFormat.pageWidth).toBe(611.9);
        expect(editor.selection.sectionFormat.pageHeight).toBe(396);
    });
});
describe('PageSetup Dialog Test Case Validation - 8', function () {
    let selectionSectionFormat: SelectionSectionFormat;
    let editor: DocumentEditor;
    let dialog: PageSetupDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(PageSetupDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enablePageSetupDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.pageSetupDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        selectionSectionFormat = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply orientation and paper size to the document', () => {
        (dialog as any).landscape.checked = true;
        let event: any = { preventDefault: function () { }, value: 'statement' };
        dialog.changeByPaperSize(event);
        dialog.applyPageSetupProperties();
        selectionSectionFormat = editor.viewer.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(612);
        expect(selectionSectionFormat.pageHeight).toEqual(392);
    });
    it('create new document and check orientation', () => {
        editor.openBlank();
        dialog.loadPageSetupDialog();
        expect((dialog as any).portrait.checked).toBeTruthy();
    });
});