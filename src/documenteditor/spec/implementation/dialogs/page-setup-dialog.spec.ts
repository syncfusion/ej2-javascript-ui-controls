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
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.pageSetupDialogModule
        dialog.show()
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Load PageSetup Dialog testing', function () {
console.log('Load PageSetup Dialog testing');
        dialog.loadPageSetupDialog();
    });
    it('On OK Button testing', function () {
console.log('On OK Button testing');
        dialog.applyPageSetupProperties();
    });
    it('On Cancel Button testing', function () {
console.log('On Cancel Button testing');
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
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Load sectionFormat test case', function () {
console.log('Load sectionFormat test case');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        selectionSectionFormat.topMargin = 70;
        selectionSectionFormat.bottomMargin = 100;
        selectionSectionFormat.leftMargin = 100;
        selectionSectionFormat.rightMargin = 100;
        dialog.loadPageSetupDialog();
    });
    it('Apply portrait to the document', () => {
console.log('Apply portrait to the document');
        editor.editorModule.onPortrait();
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(612);
        expect(selectionSectionFormat.pageHeight).toEqual(792);
    });

    it('Apply paper size to letter', () => {
console.log('Apply paper size to letter');
        editor.editorModule.onPaperSize('letter')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(612);
        expect(selectionSectionFormat.pageHeight).toEqual(792);
    });
    it('Apply paper size to tabloid', () => {
console.log('Apply paper size to tabloid');
        editor.editorModule.onPaperSize('tabloid')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(792);
        expect(selectionSectionFormat.pageHeight).toEqual(1224);
    });
    it('Apply paper size to legal', () => {
console.log('Apply paper size to legal');
        editor.editorModule.onPaperSize('legal')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(612);
        expect(selectionSectionFormat.pageHeight).toEqual(1008);
    });
    it('Apply paper size to statement', () => {
console.log('Apply paper size to statement');
        editor.editorModule.onPaperSize('statement')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(396);
        expect(selectionSectionFormat.pageHeight).toEqual(612);
    });

    it('Apply paper size to executive', () => {
console.log('Apply paper size to executive');
        editor.editorModule.onPaperSize('executive')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(522);
        expect(selectionSectionFormat.pageHeight).toEqual(756);
    });
    it('Apply paper size to a3', () => {
console.log('Apply paper size to a3');
        editor.editorModule.onPaperSize('a3')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(841.9);
        expect(selectionSectionFormat.pageHeight).toEqual(1190.55);
    });
    it('Apply paper size to a4', () => {
console.log('Apply paper size to a4');
        editor.editorModule.onPaperSize('a4')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(595.3);
        expect(selectionSectionFormat.pageHeight).toEqual(841.9);
    });
    it('Apply paper size to a5', () => {
console.log('Apply paper size to a5');
        editor.editorModule.onPaperSize('a5')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(419.55);
        expect(selectionSectionFormat.pageHeight).toEqual(595.3);
    });
    it('Apply paper size to b4', () => {
console.log('Apply paper size to b4');
        editor.editorModule.onPaperSize('b4')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(728.5);
        expect(selectionSectionFormat.pageHeight).toEqual(1031.8);
    });
    it('Apply paper size to b5', () => {
console.log('Apply paper size to b5');
        editor.editorModule.onPaperSize('b5')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(515.9);
        expect(selectionSectionFormat.pageHeight).toEqual(728.5);
    });
    it('Apply margin value to lastCustomSetting', () => {
console.log('Apply margin value to lastCustomSetting');
        editor.editorModule.changeMarginValue('lastCustomSetting');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.topMargin).toEqual(72);
        expect(selectionSectionFormat.bottomMargin).toEqual(72);
        expect(selectionSectionFormat.leftMargin).toEqual(72);
        expect(selectionSectionFormat.rightMargin).toEqual(72);
    });
    it('Apply margin value to normal', () => {
console.log('Apply margin value to normal');
        editor.editorModule.changeMarginValue('normal');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.topMargin).toEqual(72);
        expect(selectionSectionFormat.bottomMargin).toEqual(72);
        expect(selectionSectionFormat.leftMargin).toEqual(72);
        expect(selectionSectionFormat.rightMargin).toEqual(72);
    });
    it('Apply margin value to narrow', () => {
console.log('Apply margin value to narrow');
        editor.editorModule.changeMarginValue('narrow');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.topMargin).toEqual(36);
        expect(selectionSectionFormat.bottomMargin).toEqual(36);
        expect(selectionSectionFormat.leftMargin).toEqual(36);
        expect(selectionSectionFormat.rightMargin).toEqual(36);
    });
    it('Apply margin value to moderate', () => {
console.log('Apply margin value to moderate');
        editor.editorModule.changeMarginValue('moderate');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.topMargin).toEqual(72);
        expect(selectionSectionFormat.bottomMargin).toEqual(72);
        expect(selectionSectionFormat.leftMargin).toEqual(54);
        expect(selectionSectionFormat.rightMargin).toEqual(54);
    });
    it('Apply margin value to wide', () => {
console.log('Apply margin value to wide');
        editor.editorModule.changeMarginValue('wide');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.topMargin).toEqual(72);
        expect(selectionSectionFormat.bottomMargin).toEqual(72);
        expect(selectionSectionFormat.leftMargin).toEqual(144);
        expect(selectionSectionFormat.rightMargin).toEqual(144);
    });
    it('Apply margin value to mirrored', () => {
console.log('Apply margin value to mirrored');
        editor.editorModule.changeMarginValue('mirrored');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.topMargin).toEqual(72);
        expect(selectionSectionFormat.bottomMargin).toEqual(72);
        expect(selectionSectionFormat.leftMargin).toEqual(90);
        expect(selectionSectionFormat.rightMargin).toEqual(72);
    });
    it('Apply margin value to office2003Default', () => {
console.log('Apply margin value to office2003Default');
        editor.editorModule.changeMarginValue('office2003Default');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
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
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply landscape to the document', () => {
console.log('Apply landscape to the document');
        editor.editorModule.onLandscape();
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(792);
        expect(selectionSectionFormat.pageHeight).toEqual(612);
    });
    it('Apply paper size to letter', () => {
console.log('Apply paper size to letter');
        editor.editorModule.onPaperSize('letter');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(792);
        expect(selectionSectionFormat.pageHeight).toEqual(612);
    });
    it('Apply paper size to tabloid', () => {
console.log('Apply paper size to tabloid');
        editor.editorModule.onPaperSize('tabloid');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(1224);
        expect(selectionSectionFormat.pageHeight).toEqual(792);
    });
    it('Apply paper size to legal', () => {
console.log('Apply paper size to legal');
        editor.editorModule.onPaperSize('legal');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(1008);
        expect(selectionSectionFormat.pageHeight).toEqual(612);
    });
    it('Apply paper size to statement', () => {
console.log('Apply paper size to statement');
        editor.editorModule.onPaperSize('statement');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(612);
        expect(selectionSectionFormat.pageHeight).toEqual(396);
    });

    it('Apply paper size to executive', () => {
console.log('Apply paper size to executive');
        editor.editorModule.onPaperSize('executive');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(756);
        expect(selectionSectionFormat.pageHeight).toEqual(522);
    });
    it('Apply paper size to a3', () => {
console.log('Apply paper size to a3');
        editor.editorModule.onPaperSize('a3');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(1190.55);
        expect(selectionSectionFormat.pageHeight).toEqual(841.9);
    });
    it('Apply paper size to a4', () => {
console.log('Apply paper size to a4');
        editor.editorModule.onPaperSize('a4');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(841.9);
        expect(selectionSectionFormat.pageHeight).toEqual(595.3);
    });
    it('Apply paper size to a5', () => {
console.log('Apply paper size to a5');
        editor.editorModule.onPaperSize('a5');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(595.3);
        expect(selectionSectionFormat.pageHeight).toEqual(419.55);
    });
    it('Apply paper size to b4', () => {
console.log('Apply paper size to b4');
        editor.editorModule.onPaperSize('b4');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(1031.8);
        expect(selectionSectionFormat.pageHeight).toEqual(728.5);
    });
    it('Apply paper size to b5', () => {
console.log('Apply paper size to b5');
        editor.editorModule.onPaperSize('b5');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        // expect(selectionSectionFormat.pageWidth).toEqual(728.9);
        expect(selectionSectionFormat.pageHeight).toEqual(515.9);
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
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply custom margins to the document', () => {
console.log('Apply custom margins to the document');
        editor.showPageSetupDialog();
    });
    it('Apply portrait to the document', () => {
console.log('Apply portrait to the document');
        editor.editorModule.onLandscape();
        editor.editorModule.onPortrait();
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
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
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply custom margins to the document', () => {
console.log('Apply custom margins to the document');
        editor.showPageSetupDialog();
    });
    it('Apply paper size to letter', () => {
console.log('Apply paper size to letter');
        let event: any;
        event = { value: 'letter' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(612);
        expect(height.value).toEqual(792);
    });
    it('Apply paper size to tabloid', () => {
console.log('Apply paper size to tabloid');
        let event: any;
        event = { value: 'tabloid' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(792);
        expect(height.value).toEqual(1224);
    });
    it('Apply paper size to legal', () => {
console.log('Apply paper size to legal');
        let event: any;
        event = { value: 'legal' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(612);
        expect(height.value).toEqual(1008);
    });
    it('Apply paper size to statement', () => {
console.log('Apply paper size to statement');
        let event: any;
        event = { value: 'statement' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(392);
        expect(height.value).toEqual(612);
    });

    it('Apply paper size to executive', () => {
console.log('Apply paper size to executive');
        let event: any;
        event = { value: 'executive' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(522);
        expect(height.value).toEqual(756);
    });
    it('Apply paper size to a3', () => {
console.log('Apply paper size to a3');
        let event: any;
        event = { value: 'a3' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(841.9);
        expect(height.value).toEqual(1190.55);
    });
    it('Apply paper size to a4', () => {
console.log('Apply paper size to a4');
        let event: any;
        event = { value: 'a4' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(595.3);
        expect(height.value).toEqual(841.9);
    });
    it('Apply paper size to a5', () => {
console.log('Apply paper size to a5');
        let event: any;
        event = { value: 'a5' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(419.55);
        expect(height.value).toEqual(595.3);
    });
    it('Apply paper size to b4', () => {
console.log('Apply paper size to b4');
        let event: any;
        event = { value: 'b4' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(728.5);
        expect(height.value).toEqual(1031.8);
    });
    it('Apply paper size to b5', () => {
console.log('Apply paper size to b5');
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
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply custom margins to the document', () => {
console.log('Apply custom margins to the document');
        editor.showPageSetupDialog();
    });
    it('Apply landscape to the document', () => {
console.log('Apply landscape to the document');
        editor.editorModule.onLandscape();
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(792);
        expect(selectionSectionFormat.pageHeight).toEqual(612);
    });
    it('Apply paper size to letter', () => {
console.log('Apply paper size to letter');
        let event: any;
        event = { value: 'letter' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(792);
        expect(height.value).toEqual(612);
    });
    it('Apply paper size to tabloid', () => {
console.log('Apply paper size to tabloid');
        let event: any;
        event = { value: 'tabloid' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(1224);
        expect(height.value).toEqual(792);
    });
    it('Apply paper size to legal', () => {
console.log('Apply paper size to legal');
        let event: any;
        event = { value: 'legal' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(1008);
        expect(height.value).toEqual(612);
    });
    it('Apply paper size to statement', () => {
console.log('Apply paper size to statement');
        let event: any;
        event = { value: 'statement' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(612);
        expect(height.value).toEqual(392);
    });

    it('Apply paper size to executive', () => {
console.log('Apply paper size to executive');
        let event: any;
        event = { value: 'executive' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(756);
        expect(height.value).toEqual(522);
    });
    it('Apply paper size to a3', () => {
console.log('Apply paper size to a3');
        let event: any;
        event = { value: 'a3' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(1190.55);
        expect(height.value).toEqual(841.9);
    });
    it('Apply paper size to a4', () => {
console.log('Apply paper size to a4');
        let event: any;
        event = { value: 'a4' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(841.9);
        expect(height.value).toEqual(595.3);
    });
    it('Apply paper size to a5', () => {
console.log('Apply paper size to a5');
        let event: any;
        event = { value: 'a5' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(595.3);
        expect(height.value).toEqual(419.55);
    });
    it('Apply paper size to b4', () => {
console.log('Apply paper size to b4');
        let event: any;
        event = { value: 'b4' };
        dialog.changeByPaperSize(event);
        let width: any = (dialog as any).widthBox;
        let height: any = (dialog as any).heightBox;
        expect(width.value).toEqual(1031.8);
        expect(height.value).toEqual(728.5);
    });
    it('Apply paper size to b5', () => {
console.log('Apply paper size to b5');
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
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply format', () => {
console.log('Apply format');
        editor.openBlank();
        editor.editorModule.onLandscape();
        editor.editorModule.onPaperSize('statement');
        expect(editor.selection.sectionFormat.pageWidth).toBe(612);
        expect(editor.selection.sectionFormat.pageHeight).toBe(396);
        editor.editorHistory.undo();
        expect(editor.selection.sectionFormat.pageWidth).toBe(792);
        expect(editor.selection.sectionFormat.pageHeight).toBe(612);
        editor.editorHistory.redo();
        expect(editor.selection.sectionFormat.pageWidth).toBe(612);
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
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply orientation and paper size to the document', () => {
console.log('Apply orientation and paper size to the document');
        (dialog as any).landscape.checked = true;
        let event: any = { preventDefault: function () { }, value: 'statement' };
        dialog.changeByPaperSize(event);
        dialog.applyPageSetupProperties();
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(612);
        expect(selectionSectionFormat.pageHeight).toEqual(392);
    });
    it('create new document and check orientation', () => {
console.log('create new document and check orientation');
        editor.openBlank();
        dialog.loadPageSetupDialog();
        expect((dialog as any).portrait.checked).toBeTruthy();
    });
});
describe('PageSetup Dialog Test Case Validation - 10', function () {
    let selectionSectionFormat: SelectionSectionFormat;
    let editor: DocumentEditor;
    let dialog: PageSetupDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(PageSetupDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enablePageSetupDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('letter page size', () => {
        console.log('letter page size');
        (dialog as any).portrait.checked = true;
        editor.editorModule.onPaperSize('letter');
        dialog.loadPageSetupDialog();
        expect((dialog as any).paperSize.value).toBe('letter');
        dialog.closePageSetupDialog();
    });
    it('tabloid page size', () => {
        console.log('tabloid page size');
        (dialog as any).portrait.checked = true;
        editor.editorModule.onPaperSize('tabloid');
        dialog.loadPageSetupDialog();
        expect((dialog as any).paperSize.value).toBe('tabloid');
        dialog.closePageSetupDialog();
    });
    it('Legal page size', () => {
        console.log('Legal page size');
        (dialog as any).portrait.checked = true;
        editor.editorModule.onPaperSize('legal');
        dialog.loadPageSetupDialog();
        expect((dialog as any).paperSize.value).toBe('legal');
        dialog.closePageSetupDialog();
    });
    it('statement page size', () => {
        console.log('statement page size');
        (dialog as any).portrait.checked = true;
        editor.editorModule.onPaperSize('statement');
        dialog.loadPageSetupDialog();
        // expect((dialog as any).paperSize.value).toBe('statement');
        dialog.closePageSetupDialog();
    });
    it('executive page size', () => {
        console.log('executive page size');
        (dialog as any).portrait.checked = true;
        editor.editorModule.onPaperSize('executive');
        dialog.loadPageSetupDialog();
        expect((dialog as any).paperSize.value).toBe('executive');
        dialog.closePageSetupDialog();
    });
    it('a3 page size', () => {
        console.log('a3 page size');
        (dialog as any).portrait.checked = true;
        editor.editorModule.onPaperSize('a3');
        dialog.loadPageSetupDialog();
        expect((dialog as any).paperSize.value).toBe('a3');
        dialog.closePageSetupDialog();
    });
    it('a4 page size', () => {
        console.log('a4 page size');
        (dialog as any).portrait.checked = true;
        editor.editorModule.onPaperSize('a4');
        dialog.loadPageSetupDialog();
        expect((dialog as any).paperSize.value).toBe('a4');
        dialog.closePageSetupDialog();
    });
    it('a5 page size', () => {
        console.log('a5 page size');
        (dialog as any).portrait.checked = true;
        editor.editorModule.onPaperSize('a5');
        dialog.loadPageSetupDialog();
        expect((dialog as any).paperSize.value).toBe('a5');
        dialog.closePageSetupDialog();
    });
    it('b4 page size', () => {
        console.log('b4 page size');
        (dialog as any).portrait.checked = true;
        editor.editorModule.onPaperSize('b4');
        dialog.loadPageSetupDialog();
        expect((dialog as any).paperSize.value).toBe('b4');
        dialog.closePageSetupDialog();
    });
    it('b5 page size', () => {
        console.log('b5 page size');
        (dialog as any).portrait.checked = true;
        editor.editorModule.onPaperSize('b5');
        dialog.loadPageSetupDialog();
        expect((dialog as any).paperSize.value).toBe('b5');
        dialog.closePageSetupDialog();
    });
});
//https://syncfusion.atlassian.net/browse/EJ2-60490
