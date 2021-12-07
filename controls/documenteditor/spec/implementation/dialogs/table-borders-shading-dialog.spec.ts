import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import {
    TablePropertiesDialog, BordersAndShadingDialog
} from '../../../src/document-editor/implementation/dialogs/index';
import { TestHelper } from '../../test-helper.spec';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
/**
 * Table borders and shading dialog spec
 */
describe('borders dialog setting check box validation', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, BordersAndShadingDialog);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableBordersAndShadingDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.bordersAndShadingDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Handle none div check box testing', () => {
console.log('Handle none div check box testing');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        dialog.show();
        let event: any = {
            target: (dialog as any).noneDivTransparent,
            preventDefault: function () { },
            ctrlKey: false, shiftKey: false, which: 0
        };
        (dialog as any).handleSettingCheckBoxAction(event);
        dialog.closeDialog();
    });
    it('Handle box div check box testing', () => {
console.log('Handle box div check box testing');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        dialog.show();
        let event: any = {
            target: (dialog as any).boxDivTransparent,
            preventDefault: function () { },
            ctrlKey: false, shiftKey: false, which: 0
        };
        (dialog as any).handleSettingCheckBoxAction(event);
        dialog.destroy();
    });
});

describe('Borders dialog setting checkbox validation', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, BordersAndShadingDialog);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableBordersAndShadingDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.bordersAndShadingDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 750);
    });
    it('Handle all div check box testing', () => {
console.log('Handle all div check box testing');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        dialog.show();
        let event: any = {
            target: (dialog as any).allDivTransparent,
            preventDefault: function () { },
            ctrlKey: false, shiftKey: false, which: 0
        };
        (dialog as any).handleSettingCheckBoxAction(event);
        dialog.closeDialog();
    });
    it('Handle custom div check box testing', () => {
console.log('Handle custom div check box testing');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        dialog.show();
        let event: any = {
            target: (dialog as any).customDivTransparent,
            preventDefault: function () { },
            ctrlKey: false, shiftKey: false, which: 0
        };
        (dialog as any).handleSettingCheckBoxAction(event);
        dialog.closeDialog();
    });
});

describe('Borders dialog preview checkbox validation', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, BordersAndShadingDialog);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableBordersAndShadingDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.bordersAndShadingDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Top Top preview div check box testing', () => {
console.log('Top Top preview div check box testing');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        dialog.show();
        let event: any = {
            target: (dialog as any).previewDivTopTopTransParent,
            preventDefault: function () { },
            ctrlKey: false, shiftKey: false, which: 0
        };
        (dialog as any).handlePreviewCheckBoxAction(event);
        dialog.closeDialog();
    });
    it('Top center div check box testing', () => {
console.log('Top center div check box testing');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        dialog.show();
        let event: any = {
            target: (dialog as any).previewDivTopCenterTransParent,
            preventDefault: function () { },
            ctrlKey: false, shiftKey: false, which: 0
        };
        (dialog as any).handlePreviewCheckBoxAction(event);
        dialog.closeDialog();
    });
    it('Top bottom div check box testing', () => {
console.log('Top bottom div check box testing');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        dialog.show();
        let event: any = {
            target: (dialog as any).previewDivTopBottomTransParent,
            preventDefault: function () { },
            ctrlKey: false, shiftKey: false, which: 0
        };
        (dialog as any).handlePreviewCheckBoxAction(event);
        dialog.closeDialog();
    });
});

describe('Borders dialog preview divs checkbox validation', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = new BordersAndShadingDialog(editor.documentHelper);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('bottom right preview div check box testing 1', () => {
console.log('bottom right preview div check box testing 1');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        dialog.show();
        document.body.appendChild((dialog as any).target);
        let event: any = {
            target: (dialog as any).previewDivBottomRightTransparent,
            preventDefault: function () { },
            ctrlKey: false, shiftKey: false, which: 0
        };
        (dialog as any).handlePreviewCheckBoxAction(event);
        dialog.destroy();
    });
    it('bottom center div check box testing', () => {
console.log('bottom center div check box testing');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        dialog.show();
        document.body.appendChild((dialog as any).target);
        let event: any = {
            target: (dialog as any).previewDivBottomcenterTransparent,
            preventDefault: function () { },
            ctrlKey: false, shiftKey: false, which: 0
        };
        (dialog as any).handlePreviewCheckBoxAction(event);
        dialog.destroy();
    });
    it('bottom left div check box testing', () => {
console.log('bottom left div check box testing');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        dialog.show();
        document.body.appendChild((dialog as any).target);
        let event: any = {
            target: (dialog as any).previewDivBottomLeftTransparent,
            preventDefault: function () { },
            ctrlKey: false, shiftKey: false, which: 0
        };
        (dialog as any).handlePreviewCheckBoxAction(event);
        dialog.destroy();
    });
});

describe('Borders dialog preview div checkbox validation', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, BordersAndShadingDialog);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableBordersAndShadingDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = new BordersAndShadingDialog(editor.documentHelper);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('diagonal right preview div check box testing 2', () => {
console.log('diagonal right preview div check box testing 2');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        dialog.show();
        document.body.appendChild((dialog as any).target);
        let event: any = {
            target: (dialog as any).previewDivDiagonalRightTransparent,
            preventDefault: function () { },
            ctrlKey: false, shiftKey: false, which: 0
        };
        (dialog as any).handlePreviewCheckBoxAction(event);
        dialog.destroy();
    });
    it('diagonal left div check box testing', () => {
console.log('diagonal left div check box testing');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        dialog.show();
        document.body.appendChild((dialog as any).target);
        let event: any = {
            target: (dialog as any).previewDivLeftDiagonalTransParent,
            preventDefault: function () { },
            ctrlKey: false, shiftKey: false, which: 0
        };
        (dialog as any).handlePreviewCheckBoxAction(event);
        dialog.destroy();
    });
    it('Remove events', () => {
console.log('Remove events');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        let tableOptions: BordersAndShadingDialog = editor.bordersAndShadingDialogModule;
        tableOptions.show();
        // tableOptions.removeEvents();
    });
});

describe('Change table cell drop down preview div checkbox validation', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = new BordersAndShadingDialog(editor.documentHelper);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 750);
    });
    it('diagonal right preview div check box testing 3', () => {
console.log('diagonal right preview div check box testing 3');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        dialog.show();
        document.body.appendChild((dialog as any).target);
        let ulElement: DropDownList = (dialog as any).ulelementShading;
        ulElement.index = 1;
    });
    it('diagonal left div check box testing', () => {
console.log('diagonal left div check box testing');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        dialog.show();
        document.body.appendChild((dialog as any).target);
        let ulElement: DropDownList = (dialog as any).ulelementShading;
        ulElement.index = 0;
    });
});
//TODO
// describe('Change table cell drop down preview div checkbox validation', () => {
//     let editor: DocumentEditor;
//     let dialog: BordersAndShadingDialog;
//     beforeAll((): void => {
//         editor = undefined;
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         DocumentEditor.Inject(Editor, Selection, EditorHistory, BordersAndShadingDialog);
//         editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableBordersAndShadingDialog: true });
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//         dialog = editor.bordersAndShadingDialogModule;
//     });
//     afterAll((done) => {
//         editor.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         editor = undefined;
//         dialog.destroy();
//         dialog = undefined;
//         document.body.innerHTML = '';
//         setTimeout(() => {
//             done();
//         }, 750);
//     });
//     it('diagonal right preview div check box testing', (done) => {
//         editor.openBlank();
//         editor.editor.insertTable(3, 3);
//         dialog.show();
//         setTimeout(() => {
//             editor.selection.tableFormat.table.tableFormat.borders.top = undefined;
//             (dialog as any).loadBordersShadingsPropertiesDialog();
//             dialog.closeDialog();
//             done();
//         }, 10);
//     });
//     it('diagonal right preview div check box testing', (done) => {
//         editor.openBlank();
//         editor.editor.insertTable(3, 3);
//         dialog.show();
//         (dialog as any).customDiv.classList.add('e-de-table-border-inside-setting-click')
//         setTimeout(() => {
//             editor.selection.tableFormat.table.tableFormat = undefined;
//             (dialog as any).loadBordersShadingsPropertiesDialog();
//             dialog.destroy();
//             done();
//         });
//     });
// });

describe('Get Line Style Validation of Border testing', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = new BordersAndShadingDialog(editor.documentHelper);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Single,Dot,DashSmallGap line style testing', () => {
console.log('Single,Dot,DashSmallGap line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('Single');
        expect(lineStyle).toBe(1);
    });
    it('Single,Dot,DashSmallGap line style testing', () => {
console.log('Single,Dot,DashSmallGap line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('Dot');
        expect(lineStyle).toBe(2);
    });
    it('Single,Dot,DashSmallGap line style testing', () => {
console.log('Single,Dot,DashSmallGap line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('DashSmallGap');
        expect(lineStyle).toBe(3);
    });
    it('DashLargeGap,DashDot,DashDotDot line style testing', () => {
console.log('DashLargeGap,DashDot,DashDotDot line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('DashLargeGap');
        expect(lineStyle).toBe(4);
    });
    it('DashLargeGap,DashDot,DashDotDot line style testing', () => {
console.log('DashLargeGap,DashDot,DashDotDot line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('DashDot');
        expect(lineStyle).toBe(5);
    });
    it('DashLargeGap,DashDot,DashDotDot line style testing', () => {
console.log('DashLargeGap,DashDot,DashDotDot line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('DashDotDot');
        expect(lineStyle).toBe(6);
    });
    it('Double, Triple, ThinThickSmallGap line style testing', () => {
console.log('Double, Triple, ThinThickSmallGap line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('Double');
        expect(lineStyle).toBe(7);
    });
    it('Double, Triple, ThinThickSmallGap line style testing', () => {
console.log('Double, Triple, ThinThickSmallGap line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('Triple');
        expect(lineStyle).toBe(8);
    });
    it('Double, Triple, ThinThickSmallGap line style testing', () => {
console.log('Double, Triple, ThinThickSmallGap line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('ThinThickSmallGap');
        expect(lineStyle).toBe(9);
    });
});

describe('Check Line Style Validation of Border testing', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = new BordersAndShadingDialog(editor.documentHelper);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('ThickThinSmallGap,ThinThickThinSmallGap,ThinThickMediumGap line style testing', () => {
console.log('ThickThinSmallGap,ThinThickThinSmallGap,ThinThickMediumGap line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('ThickThinSmallGap');
        expect(lineStyle).toBe(10);
    });
    it('ThickThinSmallGap,ThinThickThinSmallGap,ThinThickMediumGap line style testing', () => {
console.log('ThickThinSmallGap,ThinThickThinSmallGap,ThinThickMediumGap line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('ThinThickThinSmallGap');
        expect(lineStyle).toBe(11);
    });
    it('ThickThinSmallGap,ThinThickThinSmallGap,ThinThickMediumGap line style testing', () => {
console.log('ThickThinSmallGap,ThinThickThinSmallGap,ThinThickMediumGap line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('ThinThickMediumGap');
        expect(lineStyle).toBe(12);
    });
    it('ThickThinMediumGap,ThinThickThinMediumGap,ThinThickLargeGap line style testing', () => {
console.log('ThickThinMediumGap,ThinThickThinMediumGap,ThinThickLargeGap line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('ThickThinMediumGap');
        expect(lineStyle).toBe(13);
    });
    it('ThickThinMediumGap,ThinThickThinMediumGap,ThinThickLargeGap line style testing', () => {
console.log('ThickThinMediumGap,ThinThickThinMediumGap,ThinThickLargeGap line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('ThinThickThinMediumGap');
        expect(lineStyle).toBe(14);
    });
    it('ThickThinMediumGap,ThinThickThinMediumGap,ThinThickLargeGap line style testing', () => {
console.log('ThickThinMediumGap,ThinThickThinMediumGap,ThinThickLargeGap line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('ThinThickLargeGap');
        expect(lineStyle).toBe(15);
    });
    it('ThickThinLargeGap,ThinThickThinLargeGap,SingleWavy line style testing', () => {
console.log('ThickThinLargeGap,ThinThickThinLargeGap,SingleWavy line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('ThickThinLargeGap');
        expect(lineStyle).toBe(16);
    });
    it('ThickThinLargeGap,ThinThickThinLargeGap,SingleWavy line style testing', () => {
console.log('ThickThinLargeGap,ThinThickThinLargeGap,SingleWavy line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('ThinThickThinLargeGap');
        expect(lineStyle).toBe(17);
    });
    it('ThickThinLargeGap,ThinThickThinLargeGap,SingleWavy line style testing', () => {
console.log('ThickThinLargeGap,ThinThickThinLargeGap,SingleWavy line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('SingleWavy');
        expect(lineStyle).toBe(18);
    });
});

describe('Check Linestyle of Border testing', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = new BordersAndShadingDialog(editor.documentHelper);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('DoubleWavy,DashDotStroked,Emboss3D line style testing', () => {
console.log('DoubleWavy,DashDotStroked,Emboss3D line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('DoubleWavy');
        expect(lineStyle).toBe(19);
    });
    it('DoubleWavy,DashDotStroked,Emboss3D line style testing', () => {
console.log('DoubleWavy,DashDotStroked,Emboss3D line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('DashDotStroked');
        expect(lineStyle).toBe(20);
    });
    it('DoubleWavy,DashDotStroked,Emboss3D line style testing', () => {
console.log('DoubleWavy,DashDotStroked,Emboss3D line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('Emboss3D');
        expect(lineStyle).toBe(21);
    });
    it('Engrave3D,Outset,Inset line style testing', () => {
console.log('Engrave3D,Outset,Inset line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('Engrave3D');
        expect(lineStyle).toBe(22);
    });
    it('Engrave3D,Outset,Inset line style testing', () => {
console.log('Engrave3D,Outset,Inset line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('Outset');
        expect(lineStyle).toBe(23);
    });
    it('Engrave3D,Outset,Inset line style testing', () => {
console.log('Engrave3D,Outset,Inset line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('Inset');
        expect(lineStyle).toBe(24);
    });
    it('Thick,None line style testing', () => {
console.log('Thick,None line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('Thick');
        expect(lineStyle).toBe(25);
    });
    it('Thick,None line style testing', () => {
console.log('Thick,None line style testing');
        let lineStyle: number = (dialog as any).getLineStyle(undefined);
        expect(lineStyle).toBe(0);
    });
});

describe('Check Linestyle of Border testing', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = new BordersAndShadingDialog(editor.documentHelper);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('DoubleWavy,DashDotStroked,Emboss3D line style testing', () => {
console.log('DoubleWavy,DashDotStroked,Emboss3D line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('DoubleWavy');
        expect(lineStyle).toBe(19);
    });
    it('DoubleWavy,DashDotStroked,Emboss3D line style testing', () => {
console.log('DoubleWavy,DashDotStroked,Emboss3D line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('DashDotStroked');
        expect(lineStyle).toBe(20);
    });
    it('DoubleWavy,DashDotStroked,Emboss3D line style testing', () => {
console.log('DoubleWavy,DashDotStroked,Emboss3D line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('Emboss3D');
        expect(lineStyle).toBe(21);
    });
    it('Engrave3D,Outset,Inset line style testing', () => {
console.log('Engrave3D,Outset,Inset line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('Engrave3D');
        expect(lineStyle).toBe(22);
    });
    it('Engrave3D,Outset,Inset line style testing', () => {
console.log('Engrave3D,Outset,Inset line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('Outset');
        expect(lineStyle).toBe(23);
    });
    it('Engrave3D,Outset,Inset line style testing', () => {
console.log('Engrave3D,Outset,Inset line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('Inset');
        expect(lineStyle).toBe(24);
    });
    it('Thick,None line style testing', () => {
console.log('Thick,None line style testing');
        let lineStyle: number = (dialog as any).getLineStyle('Thick');
        expect(lineStyle).toBe(25);
    });
    it('Thick,None line style testing', () => {
console.log('Thick,None line style testing');
        let lineStyle: number = (dialog as any).getLineStyle(undefined);
        expect(lineStyle).toBe(0);
    });
});

describe('Apply borders and shadings dialog values testing', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    let tablePropertiesDialog: TablePropertiesDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, TablePropertiesDialog, BordersAndShadingDialog);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true, enableBordersAndShadingDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.bordersAndShadingDialogModule;
        tablePropertiesDialog = editor.tablePropertiesDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        tablePropertiesDialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Apply table properties style testing', () => {
console.log('Apply table properties style testing');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        tablePropertiesDialog.show();
        dialog.show();
        (dialog as any).ulelementShading.selectedIndex = 1;
        (dialog as any).borderWidth.value = 2.66;
        (dialog as any).applyBordersShadingsProperties();
    });
    it('Apply cell properties line style testing', () => {
console.log('Apply cell properties line style testing');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        tablePropertiesDialog.show();
        dialog.show();
        (dialog as any).ulelementShading.selectedIndex = 1;
        (dialog as any).borderWidth.value = 2.66;
        (dialog as any).applyBordersShadingsProperties();
    });
    it('Apply none div transparent properties line style testing', () => {
console.log('Apply none div transparent properties line style testing');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        tablePropertiesDialog.show();
        dialog.show();
        let event: any = {
            target: (dialog as any).noneDivTransparent,
            preventDefault: function () { },
            ctrlKey: false, shiftKey: false, which: 0
        };
        document.body.appendChild((dialog as any).target);
        (dialog as any).handleSettingCheckBoxAction(event);
        (dialog as any).ulelementShading.selectedIndex = 1;
        (dialog as any).borderWidth.value = 2.66;
        (dialog as any).applyBordersShadingsProperties();
    });
});

describe('Apply borders&shadings dialog values testing', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    let tablePropertiesDialog: TablePropertiesDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, TablePropertiesDialog, BordersAndShadingDialog);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true, enableBordersAndShadingDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.bordersAndShadingDialogModule;
        tablePropertiesDialog = editor.tablePropertiesDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        tablePropertiesDialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Apply table properties style testing', () => {
console.log('Apply table properties style testing');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        tablePropertiesDialog.show();
        dialog.show();
        let event: any = {
            target: (dialog as any).noneDiv,
            preventDefault: function () { },
            ctrlKey: false, shiftKey: false, which: 0
        };
        document.body.appendChild((dialog as any).target);
        (dialog as any).handleSettingCheckBoxAction(event);
        (dialog as any).noneDiv.classList.remove('e-de-table-border-inside-setting-click');
        (dialog as any).previewDivDiagonalRight.classList.add('e-de-table-border-inside-preview-click');
        (dialog as any).previewDivLeftDiagonal.classList.add('e-de-table-border-inside-preview-click');
        (dialog as any).ulelementShading.selectedIndex = 1;
        (dialog as any).borderWidth.value = 2.66;
        (dialog as any).applyBordersShadingsProperties();
    });
});

describe('Apply borders&shadings checkbox values testing', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    let tablePropertiesDialog: TablePropertiesDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, TablePropertiesDialog, BordersAndShadingDialog);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true, enableBordersAndShadingDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.bordersAndShadingDialogModule;
        tablePropertiesDialog = editor.tablePropertiesDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        tablePropertiesDialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Apply Table Cell Preview Boxes index 0 testing', () => {
console.log('Apply Table Cell Preview Boxes index 0 testing');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        tablePropertiesDialog.show();
        dialog.show();
        (dialog as any).ulelementShading.index = 0;
        (dialog as any).applyTableCellPreviewBoxes();
        expect((dialog as any).previewDivBottomcenterContainer.style.display).toBe('none');
    });
    it('Apply Table Cell Preview Boxes index 0 testing', () => {
console.log('Apply Table Cell Preview Boxes index 0 testing');
        expect((dialog as any).previewDivTopCenterContainer.style.display).toBe('none');
    });
    it('Apply Table Cell Preview Boxes index 0 testing', () => {
console.log('Apply Table Cell Preview Boxes index 0 testing');
        expect((dialog as any).previewVerticalDiv.style.display).toBe('none');
    });
    it('Apply Table Cell Preview Boxes index 0 testing', () => {
console.log('Apply Table Cell Preview Boxes index 0 testing');
        expect((dialog as any).previewHorizontalDiv.style.display).toBe('none');
    });
});

describe('Apply borders&shadings checkbox values testing - 1', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    let tablePropertiesDialog: TablePropertiesDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, TablePropertiesDialog, BordersAndShadingDialog);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true, enableBordersAndShadingDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.bordersAndShadingDialogModule;
        tablePropertiesDialog = editor.tablePropertiesDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        tablePropertiesDialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Apply Table Cell Preview Boxes index 1 testing', () => {
console.log('Apply Table Cell Preview Boxes index 1 testing');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        tablePropertiesDialog.show();
        dialog.show();
        (dialog as any).ulelementShading.index = 1;
        (dialog as any).applyTableCellPreviewBoxes();
        expect((dialog as any).previewDivBottomcenterContainer.style.display).toBe('');
    });
    it('Apply Table Cell Preview Boxes index 1 testing', () => {
console.log('Apply Table Cell Preview Boxes index 1 testing');
        expect((dialog as any).previewDivTopCenterContainer.style.display).toBe('');
    });
    it('Apply Table Cell Preview Boxes index 1 testing', () => {
console.log('Apply Table Cell Preview Boxes index 1 testing');
        expect((dialog as any).previewVerticalDiv.style.display).toBe('');
    });
    it('Apply Table Cell Preview Boxes index 1 testing', () => {
console.log('Apply Table Cell Preview Boxes index 1 testing');
        expect((dialog as any).previewHorizontalDiv.style.display).toBe('');
    });
});


describe('Border and shading dialog applying testing to table testing with history validation', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    let tablePropertiesDialog: TablePropertiesDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, TablePropertiesDialog, BordersAndShadingDialog);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableTablePropertiesDialog: true, enableBordersAndShadingDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.bordersAndShadingDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        tablePropertiesDialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Apply table properties style testing', () => {
console.log('Apply table properties style testing');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        dialog.show();
        (dialog as any).ulelementShading.selectedIndex = 1;
        (dialog as any).borderWidth.value = 2.66;
        (dialog as any).shadingColorPicker.value = '#000080';
        (dialog as any).applyBordersShadingsProperties();
        expect(editor.selection.tableFormat.table.tableFormat.shading.backgroundColor).toBe('#000080');
    });
    it('Apply table properties style testing', () => {
console.log('Apply table properties style testing');
        editor.editorHistory.undo();
        expect(editor.selection.tableFormat.table.tableFormat.shading.backgroundColor).toBe('empty');
    });
    it('Apply table properties style testing', () => {
console.log('Apply table properties style testing');
        editor.editorHistory.redo();
        expect(editor.selection.tableFormat.table.tableFormat.shading.backgroundColor).toBe('#000080');
    });
});
describe('Border and shading dialog applying testing to table testing with history validation - 1', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    let tablePropertiesDialog: TablePropertiesDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, TablePropertiesDialog, BordersAndShadingDialog);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableTablePropertiesDialog: true, enableBordersAndShadingDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.bordersAndShadingDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        tablePropertiesDialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Apply cell properties line style testing', () => {
console.log('Apply cell properties line style testing');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        dialog.show();
        (dialog as any).ulelementShading.index = 0;
        (dialog as any).borderWidth.value = 2.66;
        (dialog as any).shadingColorPicker.value = '#000080';
        (dialog as any).applyBordersShadingsProperties();
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.shading.backgroundColor).toBe('#000080');
    });
    it('Apply cell properties line style testing', () => {
console.log('Apply cell properties line style testing');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.shading.backgroundColor).toBe('empty');
    });
    it('Apply cell properties line style testing', () => {
console.log('Apply cell properties line style testing');
        editor.editorHistory.redo();
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.shading.backgroundColor).toBe('#000080');
    });
});

describe('Border applying testing with none and box validation', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    let tablePropertiesDialog: TablePropertiesDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, TablePropertiesDialog, BordersAndShadingDialog);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableTablePropertiesDialog: true, enableBordersAndShadingDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.bordersAndShadingDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        tablePropertiesDialog = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Box div in borders div click validation', () => {
console.log('Box div in borders div click validation');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        dialog.show();
        (dialog as any).boxDiv.click();
        (dialog as any).applyBordersShadingsProperties();
    });
    it('Box div in borders div click validation', (done) => {
console.log('Box div in borders div click validation');
        dialog.show();
        setTimeout(() => {
            expect((dialog as any).boxDiv.classList.contains('e-de-table-border-inside-setting-click')).toBe(true);
            dialog.closeDialog();
            done();
        }, 50);
    });
    it('custom div in borders div click validation', () => {
console.log('custom div in borders div click validation');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        dialog.show();
        (dialog as any).boxDiv.click();
        (dialog as any).applyBordersShadingsProperties();
    });
    it('custom div in borders div click validation', (done) => {
console.log('custom div in borders div click validation');
        dialog.show();
        setTimeout(() => {
            expect((dialog as any).boxDiv.classList.contains('e-de-table-border-inside-setting-click')).toBe(true);
            dialog.closeDialog();
            done();
        }, 50);
    });
    it('None div in borders div click validation', () => {
console.log('None div in borders div click validation');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        dialog.show();
        (dialog as any).noneDiv.click();
        (dialog as any).applyBordersShadingsProperties();
    });
    it('None div in borders div click validation', (done) => {
console.log('None div in borders div click validation');
        editor.selection.tableFormat.table.tableFormat.borders.top.hasNoneStyle = true;
        editor.selection.tableFormat.table.tableFormat.borders.bottom.hasNoneStyle = true;
        editor.selection.tableFormat.table.tableFormat.borders.left.hasNoneStyle = true;
        editor.selection.tableFormat.table.tableFormat.borders.right.hasNoneStyle = true;
        editor.selection.tableFormat.table.tableFormat.borders.horizontal.hasNoneStyle = true;
        editor.selection.tableFormat.table.tableFormat.borders.vertical.hasNoneStyle = true;
        dialog.show();
        setTimeout(() => {
            expect((dialog as any).noneDiv.classList.contains('e-de-table-border-inside-setting-click')).toBe(true);
            dialog.closeDialog();
            done();
        }, 50);
    });
});

describe('Border applying testing with custom div validation', () => {
    let editor: DocumentEditor;
    let dialog: BordersAndShadingDialog;
    let tablePropertiesDialog: TablePropertiesDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, TablePropertiesDialog, BordersAndShadingDialog);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableTablePropertiesDialog: true, enableBordersAndShadingDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.bordersAndShadingDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        dialog.destroy();
        dialog = undefined;
        document.body.innerHTML = '';
        tablePropertiesDialog = undefined;
        setTimeout(function () {
            done();
        }, 750);
    });
    it('custom div in bottom  previw div validation borders div click validation', () => {
console.log('custom div in bottom  previw div validation borders div click validation');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        dialog.show();
        (dialog as any).customDiv.click();
        (dialog as any).previewDivBottomLeft.click();
        (dialog as any).previewDivBottomRight.click();
        (dialog as any).previewDivBottomcenter.click();
        (dialog as any).applyBordersShadingsProperties();
    });
    it('custom div in bottom  previw div validation borders div click validation', () => {
console.log('custom div in bottom  previw div validation borders div click validation');
        dialog.show();
        expect((dialog as any).customDiv.classList.contains('e-de-table-border-inside-setting-click')).toBe(true);
        dialog.closeDialog();
    });
    it('custom div in bottom  previw div validation borders div click validation', () => {
console.log('custom div in bottom  previw div validation borders div click validation');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        dialog.show();
        (dialog as any).customDiv.click();
        (dialog as any).previewDivTopCenter.click();
        (dialog as any).previewDivTopBottom.click();
        (dialog as any).previewDivTopTop.click();
        (dialog as any).applyBordersShadingsProperties();
    });
    it('custom div in bottom  previw div validation borders div click validation', () => {
console.log('custom div in bottom  previw div validation borders div click validation');
        dialog.show();
        expect((dialog as any).customDiv.classList.contains('e-de-table-border-inside-setting-click')).toBe(true);
        dialog.closeDialog();
    });
});