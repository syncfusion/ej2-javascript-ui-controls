import { DocumentEditor } from '../../../../src/index';

import { createElement, Browser } from '@syncfusion/ej2-base';
import 'node_modules/es6-promise/dist/es6-promise';
import { TestHelper } from '../../../test-helper.spec';


describe('On Property change in Document editor_1', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({isReadOnly:false});
        editor.enableAllModules();
        //DocumentEditor.Inject(Regular);
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
    // it('Switch layout type', () => {
    //     console.log('Layout type switching');
    //     editor.layoutType = 'Continuous';
    //     expect(editor.layoutType).toBe('Continuous');
    //     // editor.layoutType = 'Pages';
    //     // expect(editor.layoutType).toBe('Pages');
    // });
    it('page gap', () => {
        console.log('Page gap switching');
        editor.pageGap = 20;
        expect(editor.pageGap).toBe(20);
    });
    it('page outline', () => {
        console.log('Page outline switching');
        editor.pageOutline = '#ffffff';
        expect(editor.pageOutline).toBe('#ffffff');
    });
    it('update the height and width', () => {
        console.log('Height and width update');
        editor.height = '500px';
        editor.width = '500px';
        expect(editor.height).toBe('500px');
        expect(editor.width).toBe('500px');
    });
    it('check auto focus' , () => {
        console.log('Auto focus check');
        editor.enableAutoFocus = true;
        expect(editor.enableAutoFocus).toBe(true);
    });
    it('check zIndex' , () => {
        console.log('zIndex check');
        editor.zIndex = 1000;
        expect(editor.zIndex).toBe(1000);
    });

});


describe('On Property change document editor settings in Document editor_2', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
        editor.enableAllModules();
        //DocumentEditor.Inject(Regular);
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
    it('enable optimized text measuring', () => {
        console.log('Enable optimized text measuring');
        editor.documentEditorSettings.enableOptimizedTextMeasuring = false;
        expect(editor.documentEditorSettings.enableOptimizedTextMeasuring).toBe(false);

        editor.documentEditorSettings.enableOptimizedTextMeasuring = true;
        expect(editor.documentEditorSettings.enableOptimizedTextMeasuring).toBe(true);
    });
    it('show ruler', () => {
        console.log('Show ruler');
        editor.documentEditorSettings.showRuler =true;
        expect(editor.documentEditorSettings.showRuler).toBe(true);
        editor.documentEditorSettings.showRuler =false;
        expect(editor.documentEditorSettings.showRuler).toBe(false);
    });
    it('show hidden marks', () => {
        console.log('Show hidden marks');
        editor.documentEditorSettings.showHiddenMarks =true;
        expect(editor.documentEditorSettings.showHiddenMarks).toBe(true);
        editor.documentEditorSettings.showHiddenMarks =false;
        expect(editor.documentEditorSettings.showHiddenMarks).toBe(false);
    });
    it('show bookmarks', () => {
        console.log('Show bookmarks');
        editor.editor.insertBookmark('bookmark');
        editor.documentEditorSettings.showBookmarks =true;
        expect(editor.documentEditorSettings.showBookmarks).toBe(true);
        editor.documentEditorSettings.showBookmarks =false;
        expect(editor.documentEditorSettings.showBookmarks).toBe(false);
    });
    it('show comments', () => {
        console.log('Show comments');
        editor.enableComment =false;
        editor.editor.insertComment('comment');
        expect(editor.documentHelper.comments.length).toBe(0);
        editor.enableComment =true;
        editor.editor.insertComment('comment');
        expect(editor.documentHelper.comments.length).toBe(0);
    });
});

describe('code coverage documenteditor properties_1 ', () => {
    let documenteditor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        documenteditor = new DocumentEditor({isReadOnly:false})
        documenteditor.enableAllModules();
        documenteditor.appendTo("#container");
    });
    afterAll((done) => {
        documenteditor.destroy();
        document.body.removeChild(document.getElementById('container'));
        documenteditor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('AutoResizeSettings default value', () => {
        console.log('AutoResizeSettings default value');
        documenteditor.documentEditorSettings.autoResizeSettings = {
            interval: 2000,
            iterationCount: 5
        };
        expect(documenteditor.documentEditorSettings.autoResizeSettings.interval).toBe(2000);
        expect(documenteditor.documentEditorSettings.autoResizeSettings.iterationCount).toBe(5);
    });
    it('should have selection enabled by default', () => {
        console.log('should have selection enabled by default');
        documenteditor.editor.insertText("Software");
        documenteditor.selection.selectAll();
        expect(documenteditor.enableSelection).toBe(true);
        expect(documenteditor.selection.text).toContain("Software");

    });

    it('should be able to disable selection', () => {
        console.log('should be able to disable selection');
        documenteditor.enableSelection = false;
        documenteditor.editor.insertText("Software");
        documenteditor.selection.selectAll();
        expect(documenteditor.enableSelection).toBe(false);
        expect(documenteditor.selection.text).not.toBe("Software");
    });
    it('should have editor enabled by default', () => {
        console.log('should have editor enabled by default');
        expect(documenteditor.enableEditor).toBe(true);
    });

    it('should be able to disable the editor', () => {
        console.log('should be able to disable the editor');
        documenteditor.enableEditor = false;
        documenteditor.editor.insertText('Test');
        documenteditor.selection.selectAll()
        expect(documenteditor.enableEditor).toBe(false);
        expect(documenteditor.selection.text).not.toBe('Test');
    });

    // it('should have editor history enabled by default', () => {
    //     console.log('should have editor history enabled by default');
    //     // Expect that the editor history is enabled by default
    //     expect(documenteditor.enableEditorHistory).toBe(true);
    // });

    it('should be able to disable editor history', () => {
        console.log('should be able to disable editor history');
        documenteditor.enableEditorHistory = false;
        expect(documenteditor.enableEditorHistory).toBe(false);
    });
});


describe('Get and print API in Document editor ', () => {
    let documenteditor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        documenteditor = new DocumentEditor({isReadOnly:false})
        documenteditor.enableAllModules();
        documenteditor.appendTo("#container");
    });
    afterAll((done) => {
        documenteditor.destroy();
        document.body.removeChild(document.getElementById('container'));
        documenteditor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Get Comments API', function () {
        console.log('Get Comments API');
        documenteditor.editor.insertText("Adventure Works Cycles, the fictitious company on which the Adventure Works sample ");
        documenteditor.selection.selectAll();
        documenteditor.editor.insertComment('Test');
        expect(() => { documenteditor.getComments() }).not.toThrowError();
    });
    it('Get Styles API', function () {
        console.log('Get Styles API');
        expect(documenteditor.getStyleNames('Paragraph').length).toBeGreaterThan(0);
        expect(documenteditor.getStyles('Paragraph').length).toBeGreaterThan(0);
    });
    it('Print APi pages', function () {
        console.log('Print API - pages');
        expect(() => { documenteditor.print() }).not.toThrowError();
    });
    it('Print APi continous', function () {
        console.log('Print API - continous');
        documenteditor.layoutType = 'Continuous';
        expect(() => { documenteditor.print() }).not.toThrowError();
    });


});