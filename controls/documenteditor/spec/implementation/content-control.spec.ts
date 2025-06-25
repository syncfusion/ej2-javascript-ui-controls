import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { ContentControlInfo, Editor, LineWidget, ParagraphWidget, SfdtExport, SfdtReader, TextElementBox} from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';

/**
 * Content control Spec
 */

describe('check apply content control', () => {
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
            
            done();
        }, 1000);
    });
    it('apply plain text content control', () => {
        console.log('apply plain text content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('Text');
                expect(editor.documentHelper.contentControlCollection.length).toBe(1);
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Text');
            });
    it('apply Rich text content control', () => {
        console.log('apply rich text content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('RichText');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('RichText');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.contentControlListItems.length).toBe(0);
            });
    it('apply combo box  content control', () => {
        console.log('apply combo box content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('ComboBox');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('ComboBox');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.contentControlListItems.length).toBe(1);
            });
    it('apply drop down list content control', () => {
        console.log('apply drop down list content control');
                editor.openBlank();
                editor.editorModule.insertContentControl('DropDownList');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('DropDownList');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.hasPlaceHolderText).toBe(true);
            });
    it('apply check box content control', () => {
        console.log('apply check box content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('CheckBox');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('CheckBox');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.isChecked).toBe(false);
            });
    it('apply date picker content control', () => {
        console.log('apply date picker content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('Date','5/12/24');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Date');
            });
    it('apply picture content control', () => {
        console.log('apply picture content control');
                editor.openBlank();
                editor.editorModule.insertContentControl('Picture');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Picture');
            });
    it('check remove content control', () => {
        console.log('check remove content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('Text');
                expect(editor.documentHelper.contentControlCollection.length).toBe(1);
                editor.selection.handleLeftKey();
                editor.editorModule.removeContentControl();
                expect(editor.documentHelper.contentControlCollection.length).toBe(0);
            });
    it('check remove content control', () => {
        console.log('check remove content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('CheckBox');
                editor.selection.handleLeftKey();
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.isChecked).toBe(false);
                editor.editorModule.toggleContentControlCheckBox(editor.documentHelper.contentControlCollection[0], !editor.documentHelper.contentControlCollection[0].contentControlProperties.isChecked);
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.isChecked).toBe(true);
            });
    it('validate text insertion after content control',()=>{
        console.log('insert text after content control');
        editor.openBlank();
        editor.editor.insertContentControl('RichText','Text inside CC');
        let count = editor.selection.start.currentWidget.children.length;
        editor.selection.select('0;0;17','0;0;17');
        editor.editor.insertText("Text after CC");
        expect(editor.selection.start.currentWidget.children.length > count).toBe(true);
    })
    });

describe('Validate getContentControinfo', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport); 
        editor.enableEditorHistory = true;
        editor.enableSfdtExport = true;
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
            
            done();
        }, 1000);
    });
    it('apply plain text content control', () => {
        console.log('apply plain text content control');
        editor.openBlank();
        editor.editorModule.insertText('Insering the plain text content control and using using getContentControlInfo method');
        editor.selection.selectAll();
        editor.editorModule.insertContentControl('Text');
        editor.selection.select('0;0;10', '0;0;10');
        let contentControlInfo: ContentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBe('Insering the plain text content control and using using getContentControlInfo method');
        expect(contentControlInfo.type).toBe('Text');
        contentControlInfo.value = contentControlInfo.value + ' added new text';
        editor.importContentControlData([contentControlInfo]);
        editor.selection.select('0;0;10', '0;0;10');
        contentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBe('Insering the plain text content control and using using getContentControlInfo method added new text');
    });
    it('apply combo box  content control', () => {
        console.log('apply combo box content control');
        editor.openBlank();
        editor.editorModule.insertText('sample');
        editor.selection.selectAll();
        editor.editorModule.insertContentControl('ComboBox');
        editor.selection.select('0;0;5', '0;0;5');
        let contentControlInfo: ContentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBe('sample');
        expect(contentControlInfo.type).toBe('ComboBox');
        contentControlInfo.value = 'new value';
        editor.importContentControlData([contentControlInfo]);
        editor.selection.select('0;0;5', '0;0;5');
        contentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBe('new value');
    });
    it('apply check box content control', () => {
        console.log('apply check box content control');
        editor.openBlank();
        editor.editorModule.insertContentControl('CheckBox');
        editor.selection.select('0;0;1', '0;0;1');
        let contentControlInfo: ContentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBe('false');
        expect(contentControlInfo.type).toBe('CheckBox');
        contentControlInfo.value = 'true';
        editor.importContentControlData([contentControlInfo]);
        editor.selection.select('0;0;1', '0;0;1');
        contentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBe('true');
    });
    it('apply date picker content control', () => {
        console.log('apply date picker content control');
        editor.openBlank();
        editor.editorModule.insertContentControl('Date','5/12/24');
        editor.selection.select('0;0;3', '0;0;3');
        let contentControlInfo: ContentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBe('5/12/24');
        expect(contentControlInfo.type).toBe('Date');
        contentControlInfo.value = '6/12/24';
        editor.importContentControlData([contentControlInfo]);
        editor.selection.select('0;0;3', '0;0;3');
        contentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBe('6/12/24');
    });
    it('apply rich text content control', () => {
        console.log('apply rich text content control');
        editor.openBlank();
        editor.editorModule.insertText('Insering the plain text content control and using getContentControlInfo method');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Insering the rich text content control and using getContentControlInfo method');
        editor.selection.selectAll();
        editor.editorModule.insertContentControl('RichText');
        editor.selection.select('0;0;10', '0;0;10');
        let contentControlInfo: ContentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBeDefined;
        expect(contentControlInfo.type).toBe('RichText');
        editor.importContentControlData([contentControlInfo]);
        expect(typeof JSON.parse(contentControlInfo.value)).toBe("object");
        let widgets = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets;
        expect(widgets.length).toBe(2);
        expect((((widgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as TextElementBox).text).toBe('Insering the plain text content control and using getContentControlInfo method');
        expect((((widgets[1] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('Insering the rich text content control and using getContentControlInfo method');
    });
});

describe('Nested content control check apply content control', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false });
        editor.enableAllModules();
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
            
            done();
        }, 1000);
    });

    it('Insert Rich text content control and add text content', () => {
        // Insert Rich text content control
        editor.editor.insertContentControl('RichText');
        
        // Enter add text one
        editor.editor.insertText('add text one');
        
        // Verify the content control was inserted and text was added
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('RichText');
    });

    it('Add second rich text content control', () => {
        
        editor.editor.onEnter();
        
        // Enter add test two
        editor.editor.insertText(' add test two');
         editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.selection.handleUpKey();
        editor.selection.handleUpKey();
        editor.editor.insertContentControl('RichText');
        
        // Enter add text one
        editor.editor.insertText('1');
       expect(editor.documentHelper.contentControlCollection.length).toBe(2);
    });


    it('Verify the export case with nested content control', () => {
        // Clear existing content
        let sfdtText = editor.serialize();
        editor.open(sfdtText);
        expect(editor.documentHelper.contentControlCollection.length).toBe(2);
    });
});