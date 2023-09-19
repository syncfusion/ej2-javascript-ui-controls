import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { BodyWidget, LineWidget, ListTextElementBox, ParagraphWidget, Selection, WParagraphFormat, WUniqueFormat} from '../../../src/index';
import { Editor } from '../../../src/index';
import { WListLevel } from '../../../src/document-editor/implementation/list/list-level';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { SfdtExport } from "../../../src/document-editor/implementation/writer/sfdt-export";
describe('WListLevel Validation Testing', () => {
    it('List Level  Testing', () => {
console.log('List Level  Testing');
        let list: WListLevel = new WListLevel(undefined);
        list.followCharacter = 'Tab';
        list.listLevelPattern = 'Arabic';
        list.followCharacter;
        list.listLevelPattern;
        expect('').toBe('');
    });
});

describe('Increase indent and Decrease Indent in list paragraph', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    let paragraph : ParagraphWidget;
    it('Select all list paragraphs and add indent',() => {
        console.log('Select all list paragraphs and add indent');
        container.editor.insertText('Item 1');
        container.editor.onEnter();
        container.editor.insertText('Item 2');
        container.editor.onEnter();
        container.editor.insertText('Item 3');
        container.selection.selectAll();
        container.editor.applyNumbering('%1.', 'Arabic');
        container.editor.increaseIndent();
        container.editor.increaseIndent();
        container.selection.moveToDocumentStart();
        paragraph  = container.selection.start.paragraph as ParagraphWidget;
        expect(paragraph.paragraphFormat.leftIndent).toBe(108);
        expect(paragraph.paragraphFormat.listFormat.listLevel.listLevelPattern).toBe('Arabic');
        expect(paragraph.paragraphFormat.listFormat.listLevelNumber).toBe(0);
    });
    it('Decrease indent at the first List paragraph',()=>{
        console.log('Decrease indent at the first List paragraph');
        container.editor.decreaseIndent();
        paragraph = container.selection.start.paragraph as ParagraphWidget;
        expect(paragraph.paragraphFormat.leftIndent).toBe(72);
        expect(paragraph.paragraphFormat.listFormat.listLevel.listLevelPattern).toBe('Arabic');
        expect(paragraph.paragraphFormat.listFormat.listLevelNumber).toBe(0);
    });
    it('Adding empty paragraph inbetween the list and increase the indent',()=>{
        console.log('Adding empty paragraph inbetween the list and increase the indent');
        container.selection.moveToParagraphEnd();
        container.editor.onEnter();
        container.editor.handleBackKey();
        container.selection.moveToPreviousParagraph();
        container.editor.increaseIndent();
        container.selection.moveToNextParagraph();
        expect(container.selection.start.paragraph.paragraphFormat.leftIndent).toBe(0);
        expect(container.selection.start.paragraph.paragraphFormat.listFormat.listId).toBe(-1);
    });
    it('Increase indent at the second list Paragraph',() =>{
        console.log('Increase indent at the second list Paragraph');
        container.selection.moveToNextParagraph();
        container.editor.increaseIndent();
        expect(container.selection.start.paragraph.paragraphFormat.leftIndent).toBe(96);
        expect(container.selection.start.paragraph.paragraphFormat.listFormat.listLevel.listLevelPattern).toBe('LowLetter');
        expect(container.selection.start.paragraph.paragraphFormat.listFormat.listLevelNumber).toBe(1);
    });
});

describe('Indenting the list using Tab key', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    let paragraph : ParagraphWidget;
    it('Indenting at the first list paragraph using Tab key',() => {
        console.log('Indenting at the first list paragraph using Tab key');
        container.editor.insertText('Item 1');
        container.editor.onEnter();
        container.editor.insertText('Item 2');
        container.editor.onEnter();
        container.editor.insertText('Item 3');
        container.selection.selectAll();
        container.editor.applyNumbering('%1.', 'Arabic');
        container.selection.moveToDocumentStart();
        container.selection.handleTabKey(true,false);
        paragraph = container.selection.start.paragraph as ParagraphWidget;
        expect(paragraph.paragraphFormat.leftIndent).toBe(72);
        expect(paragraph.paragraphFormat.listFormat.listLevel.listLevelPattern).toBe('Arabic');
        expect(paragraph.paragraphFormat.listFormat.listLevelNumber).toBe(0);
    });
    it('Select lists except first list paragraph and handle indent using Tab key',() => {
        console.log('Select lists except first list paragraph and handle indent using Tab key');
        container.selection.handleTabKey(false,true);
        container.selection.select('0;1;0','0;2;7');
        container.selection.handleTabKey(true,false);
        expect(container.selection.start.paragraph.paragraphFormat.listFormat.listLevelNumber).toBe(1);
        expect(container.selection.start.paragraph.paragraphFormat.listFormat.listLevel.listLevelPattern).toBe('LowLetter');
        expect(container.selection.start.paragraph.paragraphFormat.leftIndent).toBe(96);
    });
    it('Select all list paragraphs and add indent using Tab key',() => {
        console.log('Select all list paragraphs and add indent using Tab key');
        container.selection.handleTabKey(false,true);
        container.selection.selectAll();
        container.selection.handleTabKey(true,false);
        paragraph = container.selection.start.paragraph as ParagraphWidget;
        expect(paragraph.paragraphFormat.leftIndent).toBe(72);
        expect(paragraph.paragraphFormat.listFormat.listLevel.listLevelPattern).toBe('Arabic');
        expect(paragraph.paragraphFormat.listFormat.listLevelNumber).toBe(0);
    });
    it('Adding empty paragraph inbetween the list and increase the indent',() => {
        console.log('Adding empty paragraph inbetween the list and increase the indent');
        container.selection.moveToDocumentStart();
        container.selection.moveToParagraphEnd();
        container.editor.onEnter();
        container.editor.handleBackKey();
        expect(container.selection.start.paragraph.paragraphFormat.leftIndent).toBe(0);
        expect(container.selection.start.paragraph.paragraphFormat.listFormat.listId).toBe(-1);
    });
    it('Increasing the indent for list paragraph after empty paragraph',()=>{
        container.selection.moveToNextParagraph();
        container.selection.handleTabKey(true,false);
        expect(container.selection.start.paragraph.paragraphFormat.leftIndent).toBe(132);
        expect(container.selection.start.paragraph.paragraphFormat.listFormat.listLevel.listLevelPattern).toBe('LowLetter');
        expect(container.selection.start.paragraph.paragraphFormat.listFormat.listLevelNumber).toBe(1);
    });
});

describe('To check the direct formatting value is cleared while applying list', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('To check the direct formatting of leftIndent value is cleared while applying list',() => {
        console.log('To check the direct formatting of leftIndent value is cleared while applying list');
        container.editor.insertText('Item 1');
        container.editor.applyNumbering('%1.', 'Arabic');
        let propertyType: number = WUniqueFormat.getPropertyType(container.selection.start.paragraph.paragraphFormat.uniqueParagraphFormat.uniqueFormatType, 'leftIndent');
        expect(container.selection.start.paragraph.paragraphFormat.uniqueParagraphFormat.propertiesHash.containsKey(propertyType)).toBe(false);
        expect(container.selection.start.paragraph.paragraphFormat.leftIndent).toBe(container.selection.start.paragraph.paragraphFormat.listFormat.listLevel.paragraphFormat.leftIndent);
    });
    it('To check the direct formatting of firstLineIndnet value is cleared while applying list',() => {
        console.log('To check the direct formatting of firstLineIndnet value is cleared while applying list');
        let propertyType: number = WUniqueFormat.getPropertyType(container.selection.start.paragraph.paragraphFormat.uniqueParagraphFormat.uniqueFormatType, 'firstLineIndent');
        expect(container.selection.start.paragraph.paragraphFormat.uniqueParagraphFormat.propertiesHash.containsKey(propertyType)).toBe(false);
        expect(container.selection.start.paragraph.paragraphFormat.firstLineIndent).toBe(container.selection.start.paragraph.paragraphFormat.listFormat.listLevel.paragraphFormat.firstLineIndent);
    });
    it('After undo action', () => {
        console.log('After undo action');
        container.editorHistory.undo();
        expect(container.selection.start.paragraph.paragraphFormat.firstLineIndent).toBe(0);
        expect(container.selection.start.paragraph.paragraphFormat.leftIndent).toBe(0);
    });
});

describe('Undo and Redo validation for list', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Increasing indent in list paragraph and perform undo and redo action - 1',() => {
        console.log('Incresing indent in list paragraph and perform undo action - 1');
        container.editor.insertText('Item 1');
        container.editor.onEnter();
        container.editor.insertText('Item 2');
        container.editor.onEnter();
        container.editor.insertText('Item 3');
        container.selection.selectAll();
        container.editor.applyNumbering('%1.', 'Arabic');
        container.selection.moveToDocumentStart();
        let initialLeftIndent : number = container.selection.start.paragraph.paragraphFormat.leftIndent;
        let initialFirstLineIndent : number = container.selection.start.paragraph.paragraphFormat.firstLineIndent;
        for(let i = 0; i < 5; i++) {
            container.editor.increaseIndent();
        }
        let indentedLeftIndent : number = container.selection.start.paragraph.paragraphFormat.leftIndent;
        let indentedFirstLineIndent : number = container.selection.start.paragraph.paragraphFormat.firstLineIndent;
        for(let i = 0; i < 5; i++) {
            container.editorHistory.undo();
        }
        expect(container.selection.start.paragraph.paragraphFormat.leftIndent).toBe(initialLeftIndent);
        expect(container.selection.start.paragraph.paragraphFormat.firstLineIndent).toBe(initialFirstLineIndent);
        for(let i = 0; i < 5; i++) {
            container.editorHistory.redo();
        }
        expect(container.selection.start.paragraph.paragraphFormat.leftIndent).toBe(indentedLeftIndent);
        expect(container.selection.start.paragraph.paragraphFormat.firstLineIndent).toBe(indentedFirstLineIndent);
    });

    it('Increasing indent in list paragraph and perform undo and redo action - 2',() => {
        console.log('Incresing indent in list paragraph and perform undo and redo action - 2');
        container.openBlank();
        container.editor.insertText('Item 1');
        container.editor.onEnter();
        container.editor.insertText('Item 2');
        container.editor.onEnter();
        container.editor.insertText('Item 3');
        container.selection.selectAll();
        container.editor.applyNumbering('%1.', 'Arabic');
        container.selection.moveToDocumentStart();
        let initialLeftIndent : number = container.selection.start.paragraph.paragraphFormat.leftIndent;
        let initialFirstLineIndent : number = container.selection.start.paragraph.paragraphFormat.firstLineIndent;
        container.editor.increaseIndent();
        let indentedLeftIndent : number = container.selection.start.paragraph.paragraphFormat.leftIndent;
        let indentedFirstLineIndent : number = container.selection.start.paragraph.paragraphFormat.firstLineIndent;
         container.editorHistory.undo();
         expect(container.selection.start.paragraph.paragraphFormat.leftIndent).toBe(initialLeftIndent);
        expect(container.selection.start.paragraph.paragraphFormat.firstLineIndent).toBe(initialFirstLineIndent);
        container.editorHistory.redo();
        for(let i = 0; i < 5; i++) {
            container.editorHistory.undo();
            container.editorHistory.redo();
        }
        expect(container.selection.start.paragraph.paragraphFormat.leftIndent).toBe(indentedLeftIndent);
        expect(container.selection.start.paragraph.paragraphFormat.firstLineIndent).toBe(indentedFirstLineIndent);
    });
});
describe('Applying and removing the list and checking the indentation value', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Applying and removing the list and checking the indentation value for bulleted list',() => {
        console.log('Applying and removing the list and checking the indentation value for bulleted list');
        container.openBlank();
        container.editor.insertText('This is a bullet');
        container.editor.applyBullet('\uf0b7', 'Symbol');
        expect(container.selection.start.paragraph.paragraphFormat.leftIndent).toBe(36);
        container.editor.applyBullet('\uf0b7', 'Symbol');
        expect(container.selection.start.paragraph.paragraphFormat.leftIndent).toBe(0);
    });
    it('Applying and removing the list and checking the indentation value for numbered numbered list',() => {
        console.log('Applying and removing the list and checking the indentation value for numbered list');
        container.openBlank();
        container.openBlank();
        container.editor.insertText('This is a bullet');
        container.editor.applyNumbering('%1.', 'Arabic');
        expect(container.selection.start.paragraph.paragraphFormat.leftIndent).toBe(36);
        container.editor.applyNumbering('%1.', 'Arabic');
        expect(container.selection.start.paragraph.paragraphFormat.leftIndent).toBe(0);
    });
});

