import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { BookmarkElementBox, ContentControlInfo, Editor } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { LayoutViewer, PageLayoutViewer } from '../../src/index';
import { Selection } from '../../src/index';
import { WListLevel } from '../../src/document-editor/implementation/list/list-level';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { LineWidget, FieldElementBox, BodyWidget, ParagraphWidget, HeaderFooters, TextElementBox, TableCellWidget, TableWidget, TableRowWidget, Widget } from '../../src/index';
import { WSectionFormat } from '../../src/document-editor/implementation/format/section-format';
import { WParagraphFormat } from '../../src/document-editor/implementation/format/paragraph-format';
import { WCharacterFormat } from '../../src/document-editor/implementation/format/character-format';
import { HyperlinkDialog } from '../../src/document-editor/implementation/dialogs/hyperlink-dialog';
import { JsonAdaptor } from '@syncfusion/ej2-data';
import { BookmarkDialog } from '../../src/document-editor/implementation/dialogs/bookmark-dialog';

/**
 * Editor Spec
 */

describe('insert hyperlink validation', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('In backward selection edit hyperlink validation', () => {
console.log('In backward selection edit hyperlink validation');
        editor.openBlank();
        editor.editorModule.insertText('sample');
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.editorModule.insertHyperlinkInternal('www.google.com', editor.selection.text, false);
        editor.selection.handleLeftKey();
        expect(editor.selection.getHyperlinkField()).not.toBeUndefined();
        let fieldBegin = editor.selection.getHyperlinkField();
        expect(editor.selection.getFieldCode(fieldBegin)).toBe('HYPERLINK "www.google.com"');
    });
});

describe('Edit hyperlink validation', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableHyperlinkDialog: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, HyperlinkDialog);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('In backward selection insert hyperlink validation in Multiple paragraph', () => {
console.log('In backward selection insert hyperlink validation in Multiple paragraph');
        editor.openBlank();
        editor.editorModule.insertText('sample');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('sample');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('sample');
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleShiftUpKey();
        editor.selection.handleShiftUpKey();
        editor.editorModule.insertHyperlinkInternal('s', editor.selection.text, false);
        editor.selection.handleLeftKey();
        expect(editor.selection.getHyperlinkField()).not.toBeUndefined();
        let fieldBegin = editor.selection.getHyperlinkField();
        expect(editor.selection.getFieldCode(fieldBegin)).toBe('HYPERLINK "s"');
    });
    it('In backward selection edit hyperlink validation in Multiple paragraph', () => {
console.log('In backward selection edit hyperlink validation in Multiple paragraph');
        editor.hyperlinkDialogModule.show();
        (editor.hyperlinkDialogModule as any).urlTextBox.value = 'ss';
        editor.hyperlinkDialogModule.onInsertButtonClick();
        editor.selection.handleUpKey();
        expect(editor.selection.getHyperlinkField()).not.toBeUndefined();
        let fieldBegin = editor.selection.getHyperlinkField();
        expect(editor.selection.getFieldCode(fieldBegin)).toBe('HYPERLINK "ss"');
    });
    // it('undo edit hyperlink in multiple paragraph', () => {
    //     editor.editorHistory.undo();
    //     expect(editor.selection.getHyperlinkField()).not.toBeUndefined();
    //     let fieldBegin = editor.selection.getHyperlinkField();
    //     expect(editor.selection.getFieldCode(fieldBegin)).toBe('s');
    // });
    // it('redo edit hyperlink in multiple paragraph', () => {
    //     editor.editorHistory.undo();
    //     expect(editor.selection.getHyperlinkField()).not.toBeUndefined();
    //     let fieldBegin = editor.selection.getHyperlinkField();
    //     expect(editor.selection.getFieldCode(fieldBegin)).toBe('ss');
    // });
});


describe('Remove Hyperlink valdiation', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableHyperlinkDialog: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, HyperlinkDialog);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Hyerplink using enter', () => {
console.log('Hyerplink using enter');
        editor.openBlank();
        editor.editorModule.insertText('www.google.com');
        editor.editorModule.onEnter();
        editor.selection.handleUpKey();
        editor.selection.handleRightKey();
        expect(editor.selection.getHyperlinkField()).not.toBeUndefined();
        let fieldBegin = editor.selection.getHyperlinkField();
        expect(editor.selection.getFieldCode(fieldBegin)).not.toBeUndefined();
    });
    it('remove Hyperlink validation', () => {
console.log('remove Hyperlink validation');
        editor.editor.removeHyperlink();
        expect((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children.length).toBe(1);
    });
//     it('undo after remove Hyperlink validation', () => {
// console.log('undo after remove Hyperlink validation');
//         editor.editorHistory.undo();
//         expect((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children.length).toBe(5);
//     });
    it('redo after remove Hyperlink validation', () => {
console.log('redo after remove Hyperlink validation');
        editor.editorHistory.redo();
        expect((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children.length).toBe(1);
    });
    it('Multiple undo and redo after remove Hyperlink validation', () => {
console.log('Multiple undo and redo after remove Hyperlink validation');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children.length).toBe(1);
    });   
});
describe('XML insert content Control API validation', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('xml Content Control API in Plain Text', () => {
        console.log('xml Content Control API in Plain Text');
        editor.openBlank();
        let info: ContentControlInfo = {
            title: "simple",
            tag: "sample",
            value: "hello",
            canDelete: false,
            canEdit: false,
            type: 'Text',
            xmlString: "<employeeList><one><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></one><two></two><three><name>Andrew</name><hireDate>2000-05-01</hireDate><title>Teacher</title></three></employeeList>",
            xmlPath: "employeeList/three/name"
        };
        editor.editor.insertContentControl(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Text');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employeeList[1]/three[1]/name[1]');
    });
    it('xml Content Control API in Rich Text', () => {
        console.log('xml Content Control API in Rich Text');
        editor.openBlank();
        let info: ContentControlInfo = {
            title: "simple",
            tag: "sample",
            value: "hello",
            canDelete: false,
            canEdit: false,
            type: 'RichText',
            xmlString: "<employeeList><one><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></one><two></two><three><name>Andrew</name><hireDate>2000-05-01</hireDate><title>Teacher</title></three></employeeList>",
            xmlPath: "employeeList/three/name"
        };
        editor.editor.insertContentControl(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('RichText');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employeeList[1]/three[1]/name[1]');
    });
    it('xml Content Control API in Combo Box', () => {
        console.log('xml Content Control API in Combo Box');
        editor.openBlank();
        let info: ContentControlInfo = {
            title: "simple",
            tag: "sample",
            value: "hello",
            canDelete: false,
            canEdit: false,
            type: 'ComboBox',
            xmlString: "<employeeList><one><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></one><two></two><three><name>Andrew</name><hireDate>2000-05-01</hireDate><title>Teacher</title></three></employeeList>",
            xmlPath: "employeeList/three/name"
        };
        editor.editor.insertContentControl(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('ComboBox');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employeeList[1]/three[1]/name[1]');
    });

    it('xml Content Control API in DropDownList', () => {
        console.log('xml Content Control API in DropDownList');
        editor.openBlank();
        let info: ContentControlInfo = {
            title: "simple",
            tag: "sample",
            value: "hello",
            canDelete: false,
            canEdit: false,
            type: 'DropDownList',
            xmlString: "<employeeList><one><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></one><two></two><three><name>Andrew</name><hireDate>2000-05-01</hireDate><title>Teacher</title></three></employeeList>",
            xmlPath: "employeeList/three/name"
        };
        editor.editor.insertContentControl(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('DropDownList');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employeeList[1]/three[1]/name[1]');
    });
    it('xml Content Control API in Check Box', () => {
        console.log('xml Content Control API in Check Box');
        editor.openBlank();
        let info: ContentControlInfo = {
            title: "simple",
            tag: "sample",
            value: "hello",
            canDelete: false,
            canEdit: false,
            type: 'CheckBox',
            xmlString: "<employeeList><one><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></one><two></two><three><name>Andrew</name><hireDate>2000-05-01</hireDate><title>Teacher</title></three></employeeList>",
            xmlPath: "employeeList/three/name"
        };
        editor.editor.insertContentControl(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('CheckBox');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employeeList[1]/three[1]/name[1]');
    });
    it('xml Content Control API in date picker ', () => {
        console.log('xml Content Control API in date picker ');
        editor.openBlank();
        let info: ContentControlInfo = {
            title: "simple",
            tag: "sample",
            value: "hello",
            canDelete: false,
            canEdit: false,
            type: 'Date',
            xmlString: "<employeeList><one><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></one><two></two><three><name>Andrew</name><hireDate>2000-05-01</hireDate><title>Teacher</title></three></employeeList>",
            xmlPath: "employeeList/three/name"
        };
        editor.editor.insertContentControl(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Date');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employeeList[1]/three[1]/name[1]');
    });
    it('xml Content Control API in Picture ', () => {
        console.log('xml Content Control API in Picture ');
        editor.openBlank();
        let info: ContentControlInfo = {
            title: "simple",
            tag: "sample",
            value: "hello",
            canDelete: false,
            canEdit: false,
            type: 'Picture',
            xmlString: "<employeeList><one><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></one><two></two><three><name>Andrew</name><hireDate>2000-05-01</hireDate><title>Teacher</title></three></employeeList>",
            xmlPath: "employeeList/three/name"
        };
        editor.editor.insertContentControl(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Picture');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employeeList[1]/three[1]/name[1]');
    });
    it('xml Content Control API in Plain Text with xmlns', () => {
        console.log('xml Content Control API in Plain Text with xmlns');
        editor.openBlank();
        let info: ContentControlInfo = {
            title: "simple",
            tag: "sample",
            value: "hello",
            canDelete: false,
            canEdit: false,
            type: 'Text',
            xmlString: '<employees xmlns="http://schemas.microsoft.com/vsto/samples"><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></employees>',
            xmlPath: "employees/title"
        };
        editor.editor.insertContentControl(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Text');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employees[1]/title[1]');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.prefixMapping).toBe('http://schemas.microsoft.com/vsto/samples');
    });
    it('xml Content Control API in Rich Text with xmlns', () => {
        console.log('xml Content Control API in Rich Text with xmlns');
        editor.openBlank();
        let info: ContentControlInfo = {
            title: "simple",
            tag: "sample",
            value: "hello",
            canDelete: false,
            canEdit: false,
            type: 'RichText',
            xmlString: '<employees xmlns="http://schemas.microsoft.com/vsto/samples"><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></employees>',
            xmlPath: "employees/title"
        };
        editor.editor.insertContentControl(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('RichText');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employees[1]/title[1]');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.prefixMapping).toBe('http://schemas.microsoft.com/vsto/samples');
    });
    it('xml Content Control API in Combo Box with xmlns', () => {
        console.log('xml Content Control API in Combo Box with xmlns');
        editor.openBlank();
        let info: ContentControlInfo = {
            title: "simple",
            tag: "sample",
            value: "hello",
            canDelete: false,
            canEdit: false,
            type: 'ComboBox',
            xmlString: '<employees xmlns="http://schemas.microsoft.com/vsto/samples"><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></employees>',
            xmlPath: "employees/title"
        };
        editor.editor.insertContentControl(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('ComboBox');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employees[1]/title[1]');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.prefixMapping).toBe('http://schemas.microsoft.com/vsto/samples');
    });
    it('xml Content Control API in DropDownList with xmlns', () => {
        console.log('xml Content Control API in DropDownList with xmlns');
        editor.openBlank();
        let info: ContentControlInfo = {
            title: "simple",
            tag: "sample",
            value: "hello",
            canDelete: false,
            canEdit: false,
            type: 'DropDownList',
            xmlString: '<employees xmlns="http://schemas.microsoft.com/vsto/samples"><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></employees>',
            xmlPath: "employees/title"
        };
        editor.editor.insertContentControl(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('DropDownList');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employees[1]/title[1]');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.prefixMapping).toBe('http://schemas.microsoft.com/vsto/samples');
    });
    it('xml Content Control API in Check Box with xmlns', () => {
        console.log('xml Content Control API in Check Box with xmlns');
        editor.openBlank();
        let info: ContentControlInfo = {
            title: "simple",
            tag: "sample",
            value: "hello",
            canDelete: false,
            canEdit: false,
            type: 'CheckBox',
            xmlString: '<employees xmlns="http://schemas.microsoft.com/vsto/samples"><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></employees>',
            xmlPath: "employees/title"
        };
        editor.editor.insertContentControl(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('CheckBox');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employees[1]/title[1]');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.prefixMapping).toBe('http://schemas.microsoft.com/vsto/samples');
    });
    it('xml Content Control API in date picker with xmlns', () => {
        console.log('xml Content Control API in date picker with xmlns');
        editor.openBlank();
        let info: ContentControlInfo = {
            title: "simple",
            tag: "sample",
            value: "hello",
            canDelete: false,
            canEdit: false,
            type: 'Date',
            xmlString: '<employees xmlns="http://schemas.microsoft.com/vsto/samples"><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></employees>',
            xmlPath: "employees/title"
        };
        editor.editor.insertContentControl(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Date');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employees[1]/title[1]');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.prefixMapping).toBe('http://schemas.microsoft.com/vsto/samples');
    });
    it('xml Content Control API in Picture with xmlns', () => {
        console.log('xml Content Control API in Picture with xmlns');
        editor.openBlank();
        let info: ContentControlInfo = {
            title: "simple",
            tag: "sample",
            value: "hello",
            canDelete: false,
            canEdit: false,
            type: 'Picture',
            xmlString: '<employees xmlns="http://schemas.microsoft.com/vsto/samples"><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></employees>',
            xmlPath: "employees/title"
        };
        editor.editor.insertContentControl(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Picture');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employees[1]/title[1]');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.prefixMapping).toBe('http://schemas.microsoft.com/vsto/samples');
    });
});
describe('XML set content Control API validation', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Set xml Content Control API in Plain Text', () => {
        console.log('Set xml Content Control API in Plain Text');
        editor.openBlank();
        editor.editor.insertContentControl('Text', "Hellocc");
        let info = editor.selection.getContentControlInfo();
        info.xmlString = "<employeeList><one><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></one><two></two><three><name>Andrew</name><hireDate>2000-05-01</hireDate><title>Teacher</title></three></employeeList>";
        info.xmlPath = "employeeList/three/name";
        editor.editor.setContentControlInfo(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Text');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employeeList[1]/three[1]/name[1]');
    });
    it('Set xml Content Control API in Rich Text', () => {
        console.log('Set xml Content Control API in Rich Text');
        editor.openBlank();
        editor.editor.insertContentControl('RichText', "Hellocc");
        let info = editor.selection.getContentControlInfo();
        info.xmlString = "<employeeList><one><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></one><two></two><three><name>Andrew</name><hireDate>2000-05-01</hireDate><title>Teacher</title></three></employeeList>";
        info.xmlPath = "employeeList/three/name";
        editor.editor.setContentControlInfo(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('RichText');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employeeList[1]/three[1]/name[1]');
    });
    it('Set xml Content Control API in Combo Box', () => {
        console.log('Set xml Content Control API in Combo Box');
        editor.openBlank();
        editor.editor.insertContentControl('ComboBox', "Hellocc");
        let info = editor.selection.getContentControlInfo();
        info.xmlString = "<employeeList><one><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></one><two></two><three><name>Andrew</name><hireDate>2000-05-01</hireDate><title>Teacher</title></three></employeeList>";
        info.xmlPath = "employeeList/three/name";
        editor.editor.setContentControlInfo(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('ComboBox');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employeeList[1]/three[1]/name[1]');
    });

    it('Set xml Content Control API in DropDownList', () => {
        console.log('Set xml Content Control API in DropDownList');
        editor.openBlank();
        editor.editor.insertContentControl('DropDownList', "Hellocc");
        let info = editor.selection.getContentControlInfo();
        info.xmlString = "<employeeList><one><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></one><two></two><three><name>Andrew</name><hireDate>2000-05-01</hireDate><title>Teacher</title></three></employeeList>";
        info.xmlPath = "employeeList/three/name";
        editor.editor.setContentControlInfo(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('DropDownList');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employeeList[1]/three[1]/name[1]');
    });
    it('Set xml Content Control API in Check Box', () => {
        console.log('Set xml Content Control API in Check Box');
        editor.openBlank();
        editor.editor.insertContentControl('CheckBox', "Hellocc");
        let info = editor.selection.getContentControlInfo();
        info.xmlString = "<employeeList><one><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></one><two></two><three><name>Andrew</name><hireDate>2000-05-01</hireDate><title>Teacher</title></three></employeeList>";
        info.xmlPath = "employeeList/three/name";
        editor.editor.setContentControlInfo(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('CheckBox');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employeeList[1]/three[1]/name[1]');
    });
    it('Set xml Content Control API in date picker ', () => {
        console.log('Set xml Content Control API in date picker ');
        editor.openBlank();
        editor.editor.insertContentControl('Date', "Hellocc");
        let info = editor.selection.getContentControlInfo();
        info.xmlString = "<employeeList><one><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></one><two></two><three><name>Andrew</name><hireDate>2000-05-01</hireDate><title>Teacher</title></three></employeeList>";
        info.xmlPath = "employeeList/three/name";
        editor.editor.setContentControlInfo(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Date');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employeeList[1]/three[1]/name[1]');
    });
    it('Set xml Content Control API in Picture ', () => {
        console.log('Set xml Content Control API in Picture ');
        editor.openBlank();
        editor.editor.insertContentControl('Picture', "Hellocc");
        let info = editor.selection.getContentControlInfo();
        info.xmlString = "<employeeList><one><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></one><two></two><three><name>Andrew</name><hireDate>2000-05-01</hireDate><title>Teacher</title></three></employeeList>";
        info.xmlPath = "employeeList/three/name";
        editor.editor.setContentControlInfo(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Picture');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employeeList[1]/three[1]/name[1]');
    });
    it('Set xml Content Control API in Plain Text with xmlns', () => {
        console.log('Set xml Content Control API in Plain Text with xmlns');
        editor.openBlank();
        editor.editor.insertContentControl('Text', "Hellocc");
        let info = editor.selection.getContentControlInfo();
        info.xmlString = '<employees xmlns="http://schemas.microsoft.com/vsto/samples"><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></employees>';
        info.xmlPath = "employees/title";
        editor.editor.setContentControlInfo(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Text');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employees[1]/title[1]');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.prefixMapping).toBe('http://schemas.microsoft.com/vsto/samples');
    });
    it('Set xml Content Control API in Rich Text with xmlns', () => {
        console.log('Set xml Content Control API in Rich Text with xmlns');
        editor.openBlank();
        editor.editor.insertContentControl('RichText', "Hellocc");
        let info = editor.selection.getContentControlInfo();
        info.xmlString = '<employees xmlns="http://schemas.microsoft.com/vsto/samples"><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></employees>';
        info.xmlPath = "employees/title";
        editor.editor.setContentControlInfo(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('RichText');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employees[1]/title[1]');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.prefixMapping).toBe('http://schemas.microsoft.com/vsto/samples');
    });
    it('Set xml Content Control API in Combo Box with xmlns', () => {
        console.log('Set xml Content Control API in Combo Box with xmlns');
        editor.openBlank();
        editor.editor.insertContentControl('ComboBox', "Hellocc");
        let info = editor.selection.getContentControlInfo();
        info.xmlString = '<employees xmlns="http://schemas.microsoft.com/vsto/samples"><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></employees>';
        info.xmlPath = "employees/title";
        editor.editor.setContentControlInfo(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('ComboBox');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employees[1]/title[1]');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.prefixMapping).toBe('http://schemas.microsoft.com/vsto/samples');
    });
    it('Set xml Content Control API in DropDownList with xmlns', () => {
        console.log('Set xml Content Control API in DropDownList with xmlns');
        editor.openBlank();
        editor.editor.insertContentControl('DropDownList', "Hellocc");
        let info = editor.selection.getContentControlInfo();
        info.xmlString = '<employees xmlns="http://schemas.microsoft.com/vsto/samples"><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></employees>';
        info.xmlPath = "employees/title";
        editor.editor.setContentControlInfo(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('DropDownList');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employees[1]/title[1]');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.prefixMapping).toBe('http://schemas.microsoft.com/vsto/samples');
    });
    it('Set xml Content Control API in Check Box with xmlns', () => {
        console.log('Set xml Content Control API in Check Box with xmlns');
        editor.openBlank();
        editor.editor.insertContentControl('CheckBox', "Hellocc");
        let info = editor.selection.getContentControlInfo();
        info.xmlString = '<employees xmlns="http://schemas.microsoft.com/vsto/samples"><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></employees>';
        info.xmlPath = "employees/title";
        editor.editor.setContentControlInfo(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('CheckBox');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employees[1]/title[1]');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.prefixMapping).toBe('http://schemas.microsoft.com/vsto/samples');
    });
    it('Set xml Content Control API in date picker with xmlns', () => {
        console.log('Set xml Content Control API in date picker with xmlns');
        editor.openBlank();
        editor.editor.insertContentControl('Date', "Hellocc");
        let info = editor.selection.getContentControlInfo();
        info.xmlString = '<employees xmlns="http://schemas.microsoft.com/vsto/samples"><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></employees>';
        info.xmlPath = "employees/title";
        editor.editor.setContentControlInfo(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Date');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employees[1]/title[1]');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.prefixMapping).toBe('http://schemas.microsoft.com/vsto/samples');
    });
    it('Set xml Content Control API in Picture with xmlns', () => {
        console.log('Set xml Content Control API in Picture with xmlns');
        editor.openBlank();
        editor.editor.insertContentControl('Picture', "Hellocc");
        let info = editor.selection.getContentControlInfo();
        info.xmlString = '<employees xmlns="http://schemas.microsoft.com/vsto/samples"><name>Karina Leal</name><hireDate>1999-04-01</hireDate><title>Manager</title></employees>';
        info.xmlPath = "employees/title";
        editor.editor.setContentControlInfo(info);
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Picture');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.isMapped).toBe(true);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.xPath).toBe('/employees[1]/title[1]');
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.xmlMapping.prefixMapping).toBe('http://schemas.microsoft.com/vsto/samples');
    });
    it('validate setContentControlInfo sets all cc properties',()=>{
        editor.editor.insertContentControl('RichText','OriginalText');
        let oldInfo = editor.selection.getContentControlInfo();
        if (oldInfo)
        {
            oldInfo.title = 'new title';
            oldInfo.tag = 'new tag';
            oldInfo.value = 'updated text';
            oldInfo.canEdit = false;
            oldInfo.canDelete = true;
            editor.editor.setContentControlInfo(oldInfo);
        }
        let updatedInfo = editor.selection.getContentControlInfo();
        if (updatedInfo)
        {
            expect(oldInfo.title === updatedInfo.title).toBe(true);
            expect(oldInfo.tag === updatedInfo.tag).toBe(true);
            expect(oldInfo.value === updatedInfo.value).toBe(true);
            expect(oldInfo.canEdit === updatedInfo.canEdit).toBe(true);
            expect(oldInfo.canDelete === updatedInfo.canDelete).toBe(true);
        }
    })
});
describe('XML content Control Pane validation', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Parse xml string Validation', () => {
        console.log('Parse xml string Validation');
        let parsedXml = editor.editor.parseXml(" <post><school>first</school><college>second</college><office>third</office></post>");
        expect(parsedXml.school).toBe("first");
    });
    it('Xml array Validation', () => {
        console.log('Xml array Validation');
        let parsedXml = editor.editor.parseXml(" <post><school>first</school><college>second</college><office>third</office></post>");
        let xmlArray = editor.editor.objectToArray(parsedXml);
        expect(xmlArray.length).toBe(3);
        expect(xmlArray[0].index).toBe('1');
        expect(xmlArray[1].data).toBe('second');
    });
    it('Prefix Mapping Validation', () => {
        console.log('Prefix Mapping Validation');
        editor.editor.getPrefixMapping("<post><school>first</school><college>second</college><office>third</office></post>");
        let PrefixMapping: string = editor.prefixMappings;
        expect(PrefixMapping).toBe(null);
    });
    it('Prefix Mapping for xmlns Validation', () => {
        console.log('Prefix Mapping for xmlns Validation');
        editor.editor.getPrefixMapping('<employees xmlns="http://schemas.microsoft.com/vsto/samples">\r\n<name>Karina Leal</name>\r\n<hireDate>1999-04-01</hireDate>\r\n<title>Manager</title>\r\n</employees>');
        let PrefixMapping: string = editor.prefixMappings;
        expect(PrefixMapping).toBe('http://schemas.microsoft.com/vsto/samples');
    });
    it('Set Xml Data Validation', () => {
        console.log('Set Xml Data Validation');
        let parsedXml = editor.editor.parseXml("<post><school>first</school><college>second</college><office>third</office></post>");
        let xmlArray = editor.editor.objectToArray(parsedXml);
        editor.editor.setXmlData(parsedXml, xmlArray);
        expect(editor.editor.xmlData.length).toBe(4);
        expect(editor.editor.xmlData[0].displayText).toBe('post');
        expect(editor.editor.xmlData[0].hasChild).toBe(true);
        expect(editor.editor.xmlData[0].expanded).toBe(true);
        expect(editor.editor.xmlData[1].displayText).toBe('school');
        expect(editor.editor.xmlData[1].displayValue).toBe('first');
        expect(editor.editor.xmlData[1].pid).toBe('1');
        expect(editor.editor.xmlData[1].hasChild).toBe(false);
        expect(editor.editor.xmlData[1].expanded).toBe(false);
    });
});
describe('footnote undo redo validation', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('footnote undo redo changes', () => {
        console.log('footnote undo redo changes');
        let text: string = '{"sfdt":"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"}';
        editor.open(text);
        for (let i = 0; i < 7; i++) {
            editor.selection.moveToNextLine();
        }
        editor.selection.moveToLineEnd();
        editor.editor.insertFootnote();
        editor.editor.insertText("hi");
        editor.editorHistory.undo();
        editor.editorHistory.undo();
        editor.editorHistory.undo();
        editor.editorHistory.redo();
        editor.editorHistory.redo();
        expect(() => { editor.editorHistory.redo(); }).not.toThrowError();
    });
});



// let sfdt = '{"sfdt":"UEsDBBQAAAAIAHZnLFnW5jeKgAYAAOYYAAAEAAAAc2ZkdOxYzW7bRhB+FYK9Ggb1b+lm+TeJ7RixEjRofViJS3JlcldYLuMohoAgOfVSoEBa9NAAvfVQFA3QAA166cMYcNCmD9GZXZEiFdFWXQMNitiWuJyZnZ35Zjgz9JktRopF7Ak98lxld5RM6Iod04Hd+ezM7utvpr9VOLI7tht7+GdPVs5sj8OGyoo98OzOmR0rDvwt7nKhqHWPelRSPqAgOVUzWiDWo48VSuSP+DxxHKdqX6kXTTA7LHu23gTrtInwB5/YmPq+HEr5rufDd4kEMEv3ws4nQz8s4Q9lqU7p+aUW+UPXK+H53rCM43rDcg9KWaW+XaruEs4lphcc9peFeDl1RST+8Z5lld2EQ+Xg8WshzqNy66PynY8k9YfwkUNflm2XZdnWh/QowwV410LmWpmzbH7MbbrJdJs7yJ4cT46hdELldODiYdU6Gkd9ka8SMfh6jLdY8P53C3A/wJo90R1kJLF8B67dqTVXARLAa7oandqdZqWql4HdabX1MoygmzgOLiUsW2u4UrBqNFdb0BIcp9WstmvtegM6CspWG6t1JFca1cZaa629AqkEIMMuV1Cz6INhqG8E0cDTYnOlHMysgkl4RT5Lr9TI+TyGaK1L0mcD6ER9CKp9ILqSkhNoPOCnF0PvO7M3Kfc/ZQRj/fanL97+9jsIpzRrj/mByjjT20na17z4CfhQ0cgAwd4gIetLBgqAg3anPFzbEeNCdpmr+R5JKbvrPDYkj6a0LRKr9ZgRTeYzeirLIA4Vp1bDFXKrTgOgYK4+06k2wELTqglgoIMQwgKMabUrzWaz4bRaVaddbyEd3HOwwfsojyB9sj39QUdjNTZ9XYOKIB0IGZEQjOCPZ3f68chEdilxGfetCuJetgXOzotaGwGRdhFZk3Papup2o95ugk0zbJt5bMkwh60BDEkZkBkifQRCJytio1MVHm+cgU5OubmGOBOZ2UQT0KVN6pEkVNYhkcSXZBRY2wJmp6lQNQ+N1SP9kBa9ndKK4ppm7UiIZh6n4v6cUNGiw5AMaCBCl0ozgxkdJYZmwGo0IQfgByNcDNwei3M7F0bvPREDa8h4WhoGiPCcYgwzlQsVZqw0HcCfaS7MctjJ5XCatFBZzFSqhhpSKBfVWl1XnNCUECwgq5DcRgRqDhDqzbUFIsdz4S7acQmuRTe3BQy4i93MWGF289+7WbTjajdz6BQe2mUS78af6CL0hdeRRQGYEwjnSIvqjw5HapyG+IpYzcG7SP/SUL13+GLds7eppXT3iX44of256jRr69E00czgM1KzDovJE6jIpBFREgYCHSP0G5uvfr3LvRuWIrPgBbE2nbcG11VQTxXw7CUX7kGSfqB2DURkhhpoq6pvQFUeXM+WaekqiEx6QJj0BfPgrucxHXx4OjAqyAj1scgNiYLCDFtn08l0iNFVwnaqzrZTg2/8resVGL9iNlOyjBSgdJkUDlp6zro90jPWxZs3589enz/79fz58/NnP2fW7BJ4herY73746q+XT60/f/n+3YuvDTmen780FT26+ObV29evLr798o8fXwAVZz3smCyisXVAT617IoIzQZz25UJGLyBYa9a5HxNOkAXELRUg8WBMQgSgC7Mg3D6QjLt4v5MMUdlRIBOFxelOEOH9vhBhV0it9g5KwnkJ980OmcDtPUIe4YYN49JWMgpopGe8jQA6g+7oXBGfcorVgkpxQjGwDxlDe/bZQIpYeMp6yKwuYfrwHuurAm+XQckjY2KcQyv2H1hdEaLwJn2kCYC0Los9GqJdOyRRJNLaCD7o9h5RASo4Gkus1FuxArd8Ggpry6VxjKy7Eo7o2HcgpYyP++E40gSp2AkS9ogQWI7ECRS+aKT1MQ6vCvat+ASwItahUHqn0PjiBcyEmTv17QGjamHU7kMWFJxGQoLFdYcKHZtx6BGoAZgSESbdumTa427iI5R7lIbkFDo8te7fQrIYiYLC2wEEfZeiFbeJBg0vnMZZ+4AxCLE7or6YKtkfmzwYEx6RbCQ7AF8RQ3jwIg1cODjB5GLYmojZeTcGVk7mMCCICF5iA9xY8pJAAAt6fhmLlrEgUeet6BEYOvMg9AjUCmo4SYGDwdDcRLPxnx+Z+dCm8F1lqVKULxyNpYpQY6ki1FiiCEHVuPju5ZKF56qSk+bXtNCkt9PysiGky/5dddkkCT+k8Ph8LC43WlzSSH0sKR90SZlMJn8DAAD//wMAUEsBAi0AFAAAAAgAdmcsWdbmN4qABgAA5hgAAAQAAAAAAAAAAAAgAAAAAAAAAHNmZHRQSwUGAAAAAAEAAQAyAAAAogYAAAAA"}'
// describe('Add endnote when existing endnote is split into multiple pages', () => {
//     let editor: DocumentEditor;
//     let event: any;
//     beforeAll((): void => {
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableHyperlinkDialog: true });
//         DocumentEditor.Inject(Editor, Selection, EditorHistory, HyperlinkDialog);
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//     });
//     afterAll((done): void => {
//         editor.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         editor = undefined;
//         setTimeout(function () {
//             document.body.innerHTML = '';
//             done();
//         }, 1000);
//     });
//     it('Add second endnote', () => {
//         console.log('Add second endnote');
//         editor.open(sfdt);
//         editor.selectionModule.select('0;23;0', '0;23;0');
//         editor.editorModule.insertEndnote()
//         expect(editor.documentHelper.pages[0].endnoteWidget.bodyWidgets.length).toBe(1);
//         expect(editor.documentHelper.pages[1].endnoteWidget.bodyWidgets.length).toBe(2);
//     });
// });

describe('Select and delete multiple paragraph', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Validate the bookmark is present', () => {
        console.log('Validate the bookmark is present');
        editor.editor.insertText('Text before the bookmarks');
        editor.editor.insertBookmark('bookmark1');
        editor.editor.insertText('Bookmark 1 - This is the text inside bookmark 1');
        editor.selection.moveToDocumentEnd();
        editor.editor.insertBookmark('bookmark2');
        editor.editor.insertText('Bookmark 2 - This is the text inside bookmark 2');
        editor.selection.moveToDocumentEnd();
        editor.editor.insertText('Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nEtiam urna ligula, malesuada eu dolor in, mattis rhoncus orci.\nInteger consequat, velit vitae tristique convallis, neque neque ultricies diam, sed tincidunt quam nibh in purus. \nQuisque vel mauris eros. Fusce tincidunt arcu non velit tempor molestie. \nMorbi posuere interdum lectus, sit amet cursus mauris condimentum vitae. Maecenas feugiat mattis sagittis. \nMauris ut facilisis magna. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. \nUt scelerisque malesuada feugiat. Sed eget gravida metus. In eleifend urna id arcu congue, quis lobortis risus finibus. Morbi pretium ligula in enim aliquam, et convallis sapien vestibulum.');
        editor.selection.select('0;0;40', '0;4;10');
        editor.editor.delete();
        expect(editor.documentHelper.bookmarks.length).toBe(1);
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] instanceof TextElementBox).toBe(true);
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] instanceof BookmarkElementBox).toBe(true);
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] instanceof TextElementBox).toBe(true);
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[3] instanceof BookmarkElementBox).toBe(true);
    });
});
