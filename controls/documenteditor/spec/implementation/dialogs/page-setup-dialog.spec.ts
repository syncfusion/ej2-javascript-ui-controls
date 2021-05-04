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
        expect(selectionSectionFormat.pageWidth).toEqual(611.9);
        expect(selectionSectionFormat.pageHeight).toEqual(791.9);
    });
    it('Apply paper size to tabloid', () => {
console.log('Apply paper size to tabloid');
        editor.editorModule.onPaperSize('tabloid')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(791.9);
        expect(selectionSectionFormat.pageHeight).toEqual(1223.9);
    });
    it('Apply paper size to legal', () => {
console.log('Apply paper size to legal');
        editor.editorModule.onPaperSize('legal')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(611.9);
        expect(selectionSectionFormat.pageHeight).toEqual(1007.9);
    });
    it('Apply paper size to statement', () => {
console.log('Apply paper size to statement');
        editor.editorModule.onPaperSize('statement')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(396);
        expect(selectionSectionFormat.pageHeight).toEqual(611.9);
    });

    it('Apply paper size to executive', () => {
console.log('Apply paper size to executive');
        editor.editorModule.onPaperSize('executive')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(521.9);
        expect(selectionSectionFormat.pageHeight).toEqual(755.9);
    });
    it('Apply paper size to a3', () => {
console.log('Apply paper size to a3');
        editor.editorModule.onPaperSize('a3')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(841.8);
        expect(selectionSectionFormat.pageHeight).toEqual(1190.4);
    });
    it('Apply paper size to a4', () => {
console.log('Apply paper size to a4');
        editor.editorModule.onPaperSize('a4')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(595.2);
        expect(selectionSectionFormat.pageHeight).toEqual(841.8);
    });
    it('Apply paper size to a5', () => {
console.log('Apply paper size to a5');
        editor.editorModule.onPaperSize('a5')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(419.5);
        expect(selectionSectionFormat.pageHeight).toEqual(595.2);
    });
    it('Apply paper size to b4', () => {
console.log('Apply paper size to b4');
        editor.editorModule.onPaperSize('b4')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(728.4);
        expect(selectionSectionFormat.pageHeight).toEqual(1031.7);
    });
    it('Apply paper size to b5', () => {
console.log('Apply paper size to b5');
        editor.editorModule.onPaperSize('b5')
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(515.8);
        expect(selectionSectionFormat.pageHeight).toEqual(728.4);
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
        expect(selectionSectionFormat.pageWidth).toEqual(791.9);
        expect(selectionSectionFormat.pageHeight).toEqual(611.9);
    });
    it('Apply paper size to tabloid', () => {
console.log('Apply paper size to tabloid');
        editor.editorModule.onPaperSize('tabloid');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(1223.9);
        expect(selectionSectionFormat.pageHeight).toEqual(791.9);
    });
    it('Apply paper size to legal', () => {
console.log('Apply paper size to legal');
        editor.editorModule.onPaperSize('legal');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(1007.9);
        expect(selectionSectionFormat.pageHeight).toEqual(611.9);
    });
    it('Apply paper size to statement', () => {
console.log('Apply paper size to statement');
        editor.editorModule.onPaperSize('statement');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(611.9);
        expect(selectionSectionFormat.pageHeight).toEqual(396);
    });

    it('Apply paper size to executive', () => {
console.log('Apply paper size to executive');
        editor.editorModule.onPaperSize('executive');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(755.9);
        expect(selectionSectionFormat.pageHeight).toEqual(521.9);
    });
    it('Apply paper size to a3', () => {
console.log('Apply paper size to a3');
        editor.editorModule.onPaperSize('a3');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(1190.4);
        expect(selectionSectionFormat.pageHeight).toEqual(841.8);
    });
    it('Apply paper size to a4', () => {
console.log('Apply paper size to a4');
        editor.editorModule.onPaperSize('a4');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(841.8);
        expect(selectionSectionFormat.pageHeight).toEqual(595.2);
    });
    it('Apply paper size to a5', () => {
console.log('Apply paper size to a5');
        editor.editorModule.onPaperSize('a5');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(595.2);
        expect(selectionSectionFormat.pageHeight).toEqual(419.5);
    });
    it('Apply paper size to b4', () => {
console.log('Apply paper size to b4');
        editor.editorModule.onPaperSize('b4');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
        expect(selectionSectionFormat.pageWidth).toEqual(1031.7);
        expect(selectionSectionFormat.pageHeight).toEqual(728.4);
    });
    it('Apply paper size to b5', () => {
console.log('Apply paper size to b5');
        editor.editorModule.onPaperSize('b5');
        selectionSectionFormat = editor.documentHelper.selection.sectionFormat;
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
let landscape: any = {"sections":[{"sectionFormat":{"pageWidth":841.9000244140625,"pageHeight":595.2999877929688,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontColor":"empty"},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{"fontColor":"empty"}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[]};
describe('PageSetup Dialog Test Case Validation - 9', function () {
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
    it('Legal page size', () => {
console.log('Legal page size');
        editor.documentHelper.selection.sectionFormat.pageWidth=612;
        editor.documentHelper.selection.sectionFormat.pageHeight=1008;
        (dialog as any).portrait.checked = true;
        
        dialog.loadPageSetupDialog();
        
        expect((dialog as any).paperSize.value).toBe('legal');
        dialog.closePageSetupDialog();
    });
    it('tabloid page size', () => {
console.log('tabloid page size');
        editor.documentHelper.selection.sectionFormat.pageWidth=792;
        editor.documentHelper.selection.sectionFormat.pageHeight=1224;
        (dialog as any).portrait.checked = true;
        
        dialog.loadPageSetupDialog();
        
        expect((dialog as any).paperSize.value).toBe('tabloid');
        dialog.closePageSetupDialog();
    });
    it('a3 page size', () => {
console.log('a3 page size');
        editor.documentHelper.selection.sectionFormat.pageWidth=841.9;
        editor.documentHelper.selection.sectionFormat.pageHeight=1190.55;
        (dialog as any).portrait.checked = true;
        
        dialog.loadPageSetupDialog();
        
        expect((dialog as any).paperSize.value).toBe('a3');
        dialog.closePageSetupDialog();
    });
    it('a4 page size', () => {
console.log('a4 page size');
        editor.documentHelper.selection.sectionFormat.pageWidth=595.2999877929688;
        editor.documentHelper.selection.sectionFormat.pageHeight=841.9000244140625;
        (dialog as any).portrait.checked = true;
        
        dialog.loadPageSetupDialog();
        
        expect((dialog as any).paperSize.value).toBe('a4');
        dialog.closePageSetupDialog();
    });
    it('Custom size height and width validation', () => {
console.log('Custom size height and width validation');
        editor.openBlank();
        var defaultSectionFormat = { pageWidth: 200, pageHeight: 200 }            
        editor.setDefaultSectionFormat(defaultSectionFormat);    
        editor.openBlank();
        dialog.loadPageSetupDialog();        
        expect((dialog as any).widthBox.value).toBe(200);
        expect((dialog as any).heightBox.value).toBe(200);
        dialog.closePageSetupDialog();
    });
    it('landscape page setup validation', () => {
console.log('landscape page setup validation');
        editor.open(landscape);
        let event: any;
        event = { value: 'letter' };
        dialog.loadPageSetupDialog();
        dialog.changeByPaperSize(event);      
        expect((dialog as any).landscape.checked).toBe(true);
        expect((dialog as any).portrait.checked).toBe(false);
        dialog.closePageSetupDialog();
    });
});
