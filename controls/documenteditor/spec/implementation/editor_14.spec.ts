import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget, SfdtExport, ContentControl } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, EditorHistory, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition, DocumentEditorContainer, Toolbar } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';

describe('Empty selection check whether selection is in field', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('selection is in text', () => {
console.log('selection is in text');
        editor.editor.insertText('Hello World');
        editor.selection.handleHomeKey();
        editor.selection.handleRightKey();
        expect(editor.selection.isInField).toBe(false);
    });
    it('select Field validation in text', () => {
console.log('select Field validation in text');
        editor.selection.selectField();
        expect(editor.selection.isEmpty).toBe(true);
    });
    it('selection is in field', () => {
console.log('selection is in field');
        editor.openBlank();
        let text: string = 'Lead#Email';
        editor.editor.insertField('MERGEFIELD ' + text + ' \\* MERGEFORMAT');
        editor.selection.handleHomeKey();
        editor.selection.handleRightKey();
        expect(editor.selection.isInField).toBe(true);
    });
    it('select Field validation in field', () => {
console.log('select Field validation in field');
        editor.selection.selectField();
        expect(editor.selection.isEmpty).toBe(false);
    });
    it('Delete after select field', () => {
console.log('Delete after select field');
        editor.editor.delete();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
    });

    it('Undo after select and delete field', () => {
console.log('Undo after select and delete field');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(false);
    });
    it('redo after select and delete field', () => {
console.log('redo after select and delete field');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
    });
});


describe('Non-selection check whether selection is in field', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('selection is in field', () => {
console.log('selection is in field');
        let text: string = 'Lead#Email';
        editor.editor.insertField('MERGEFIELD ' + text + ' \\* MERGEFORMAT');
        editor.selection.handleHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        expect(editor.selection.isInField).toBe(true);
    });
    it('select Field validation in field', () => {
console.log('select Field validation in field');
        editor.selection.selectField();
        expect(editor.selection.isEmpty).toBe(false);
    });
    it('Delete after select field', () => {
console.log('Delete after select field');
        editor.editor.delete();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
    });

    it('Undo after select and delete field', () => {
console.log('Undo after select and delete field');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(false);
    });
    it('redo after select and delete field', () => {
console.log('redo after select and delete field');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
    });
});



describe('Insert bookmark validaiton for splitted paragraph', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableEditorHistory: true, enableSfdtExport: true });

        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('insert bookmark', () => {
console.log('insert bookmark');
        editor.selection.sectionFormat.pageWidth = 300;
        editor.selection.sectionFormat.pageHeight = 100;
        editor.editor.insertText('ert reteterterteterterterte te treteterter t ');
        editor.selection.selectAll();
        editor.editor.insertBookmark('sample');
        expect(editor.documentHelper.bookmarks.keys.length).toBe(1);
    });
    it('undo after insert bookmark splitted paragraph', () => {
console.log('undo after insert bookmark splitted paragraph');
        editor.editorHistory.undo();
        expect(editor.documentHelper.bookmarks.keys.length).toBe(0);
    });
    it('redo after insert bookmark splitted paragraph', () => {
console.log('redo after insert bookmark splitted paragraph');
        editor.editorHistory.redo();
        expect(editor.documentHelper.bookmarks.keys.length).toBe(1);
    });
    it('navigation for bookmark splitted paragraph', () => {
console.log('navigation for bookmark splitted paragraph');
        editor.selection.navigateBookmark('sample');
        expect(editor.selection.isEmpty).toBe(false);
    });
});


describe('Bookmark remove validation for two paragraph', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableEditorHistory: true, enableSfdtExport: true });

        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('insert bookmark', () => {
console.log('insert bookmark');
        editor.editor.onEnter()
        editor.selection.selectAll();
        editor.editor.insertBookmark('sample');
        expect(editor.documentHelper.bookmarks.keys.length).toBe(1);
    });
    it('on backspace before splitted paragraph', () => {
console.log('on backspace before splitted paragraph');
        editor.selection.handleDownKey();
        editor.editor.onBackSpace();
        editor.editor.onBackSpace();
        expect(editor.documentHelper.bookmarks.keys.length).toBe(1);
    });
    it('undo after on backspace before splitted paragraph', () => {
console.log('undo after on backspace before splitted paragraph');
        editor.editorHistory.undo();
        expect(editor.documentHelper.bookmarks.keys.length).toBe(1);
    });
    it('redo after on backspace before splitted paragraph', () => {
console.log('redo after on backspace before splitted paragraph');
        editor.editorHistory.redo();
        expect(editor.documentHelper.bookmarks.keys.length).toBe(1);
    });
    it('backspace in start bookmark element box', () => {
        console.log('backspace in start bookmark element box');
        editor.openBlank();
        editor.editor.insertText('Syncfusion');
        editor.selection.select('0;0;2', '0;0;6');
        editor.editor.insertBookmark('company');
        editor.selection.select('0;0;3', '0;0;3');
        editor.editor.onBackSpace();
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('S')
        expect(editor.documentHelper.bookmarks.keys.length).toBe(1);
    });
});

describe('Resolve script error issue while delete content after search text', () => {
    let container: DocumentEditorContainer = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        let defaultDocument = {
            sfdt: "UEsDBAoAAAAIAPtxEFlxY5+TGAQAAD47AAAEAAAAc2ZkdO1ba2/bNhT9KwLXDytgBLZlSbG+dSmMASu6Ah2wD0UQUDJpEaMeJZk5buD/Xr78kh9VUkdWUBoBDiWK4uG9R/dSFPMIykqQnHxDn/FUgFiwe9QDHKUg/vIIJFYMxI+gmoM4HAx7oMpAHI1lgeayIJFZFBYTi9kUxH7YA9jiFFcg7ksskSkkxIDsCXxE809whkAPoAKDWDbHCmU1IytEGgkuQDyQiAxWs4LLG7xjMCGpbF+kJeW6Bn2da6SJSHVTU/Pldik71aOrsBpaMmVcoZC0HmUdFQbZzGBijzMD/ytQl5HCEjMooBkO1wAN8ESexZByZVO4KVuKlAtzmSiUEUqWQ+r9/i9K3gLVAbZdpYbnujVZlzD/Jm8k74TlJeAGUpIwIttiZdTf+vo3mcgTSbJpRLbKGKuD7ZYY1o4LjGpnaidSrhy61LykVV8LW0FlAbz548PfN3/dgWXvPMw3bVocBIcUsgUjHJ1tHO2RvyP87hXSXqBXrplXaPM3YHmrWLvAff7A7QzrMuKLZMT2mDMoM6BYVC4LtpgFIaOLXzWVuEjnUohLIfsP15+I0tKbl4xOr7x/MsI9+Qe99ygvPYEehOfmcU4rViu4ZFITXJBi5lX3rCrVS6wLzS40u8fNze7d7N7N7t1CkUslLpW4Tyfu04n7dOI+nbiM6AL3z2rBcy/YHZwVbRtj3wxtd3MrG5qa2+c44t7612jDSCQz23BkE2V706jmBZhueeiJDpHUzxrc8CmB14Rc0vWWJkv/P9Xrqjwv1uV5utpjtbE85paRwNQUpmJudk3ZrUvI7obKJFkgh84t4tz0XxmYZiI3TDA2BNMyr6wrFiKxLJUdgH5SJvoHtCwWOpLtiMPe/OesWtdX8bDpQqm50AvGcKoWAAfn6vSHrlR72bZ9edWPxoMwDIN+FA3741G069zBflwy0g93pe99ILNMrCPRcBKMxmE9vGwu2tX01vkDp822ta0nd9tu3k0GGfiBcVcXCSONS47iPcLwngrvE2RwxmCVeZOyEGvKR6p3qC/r4xu2Jp6naWd4TDt+J7QzbKKd4XHt+B3Tzoqy31E5+MfkMDxpyMHEj0L/5eXgN5GDf1wOrY+ioRxGHZXDaF8OZDVF6EB0GDWRw+iQHC40ioZyCDoqh+BAdLi8CoImKggOBoUuOj/sqPPDJzm/rYwQNnF++ETnXy4RRB11fvS8RNCWCqImKoiemwguJ4frjsrh+tg0sX8VnDSlr38vL4jrJoK4Pj5RvMA4Gkpi3FFJjE9FiE5pY9xEG+PTwaLDIkHsPAo5vJi4v2S2Y2dtUstiRWpSluLypCyLFanauv4ZqKlHJjAMA/uRwf6/KoT7y6o7b6UHCe8wVAvdVC9+yx6owTQ3yOzhg0GSz7ju5DtQSwECFAAKAAAACAD7cRBZcWOfkxgEAAA+OwAABAAAAAAAAAAAAAAAAAAAAAAAc2ZkdFBLBQYAAAAAAQABADIAAAA6BAAAAAA=",
        };
        container = new DocumentEditorContainer({
            height: "590px", documentEditorSettings: { showRuler: true },
        });
        DocumentEditorContainer.Inject(Toolbar);
        container.appendTo('#container');
        container.documentEditor.open(JSON.stringify(defaultDocument));
    });
    afterAll((done) => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Delete the selected content after search text', () => {
        console.log('Delete the selected content after search text');
        var name = 'raiseType';
        var value = 'yearly';
        const placeholderPattern = `$BLOCK_${name}_is_${value}$`;
        container.documentEditor.search.findAll(placeholderPattern);
        const searchResults = container.documentEditor.search.searchResults;
        const offsets = searchResults.getTextSearchResultsOffset();
        const firstOccurrence = offsets[0];
        const secondOccurrence = offsets[1];
        container.documentEditor.selection.select(firstOccurrence.startOffset, secondOccurrence.endOffset);
        expect(() => { container.documentEditor.editor.delete(); }).not.toThrowError();
    });

});

describe('Content control delete', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableEditorHistory: true, enableSfdtExport: true });

        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Select the whole paragraph and delete', () => {
        console.log('Select the whole paragraph and delete');
        editor.editorModule.insertText('Syncfusion');
        editor.selectionModule.selectAll();
        editor.editorModule.insertContentControl('RichText');
        editor.selectionModule.selectAll();
        editor.editorModule.onBackSpace();
        expect(editor.selection.start.currentWidget.children[0] instanceof ContentControl).toBe(true);
        expect(editor.selection.start.currentWidget.children[1] instanceof ContentControl).toBe(true);

    });
    it('Start is inside content control and End is outside content control', () => {
        console.log('Start is inside content control and End is outside content control');
        editor.openBlank();
        editor.editorModule.insertText('Hello world');
        editor.selectionModule.select('0;0;0', '0;0;5');
        editor.editorModule.insertContentControl('Text');
        editor.selectionModule.select('0;0;3', '0;0;8');
        editor.editorModule.onBackSpace();
        expect(editor.selection.start.currentWidget.children[0] instanceof ContentControl).toBe(true);
        expect((editor.selection.start.currentWidget.children[1] as TextElementBox).text).toBe('He');
        expect(editor.selection.start.currentWidget.children[2] instanceof ContentControl).toBe(true);
        expect(editor.selection.start.currentWidget.children[3] instanceof TextElementBox).toBe(true);
    });
    it('Start is outside content control and End is inside content control', () => {
        console.log('Start is outside content control and End is inside content control');
        editor.openBlank();
        editor.editorModule.insertText('Hello world');
        editor.selectionModule.select('0;0;6', '0;0;11');
        editor.editorModule.insertContentControl('RichText');
        editor.selectionModule.select('0;0;3', '0;0;9');
        editor.editorModule.onBackSpace();
        expect(editor.selection.start.currentWidget.children[0] instanceof TextElementBox).toBe(true);
        expect(editor.selection.start.currentWidget.children[1] instanceof ContentControl).toBe(true);
        expect((editor.selection.start.currentWidget.children[2] as TextElementBox).text).toBe('rld');
        expect(editor.selection.start.currentWidget.children[3] instanceof ContentControl).toBe(true);
    });
    it('Select the whole paragraph and insert text', () => {
        console.log('Select the whole paragraph and insert text');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion');
        editor.selectionModule.selectAll();
        editor.editorModule.insertContentControl('Text');
        editor.selectionModule.selectAll();
        editor.editorModule.insertText('Syncfusion');
        expect(editor.selection.start.currentWidget.children[0] instanceof ContentControl).toBe(true);
        expect((editor.selection.start.currentWidget.children[1] as TextElementBox).text).toBe('Syncfusion');
        expect(editor.selection.start.currentWidget.children[2] instanceof ContentControl).toBe(true);
    });
});

describe('single delete in content control', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableEditorHistory: true, enableSfdtExport: true });

        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Backspace at the end of the content control', () => {
        console.log('Backspace at the end of the content control');
        editor.editorModule.insertText('Syncfusion');
        editor.selectionModule.selectAll();
        editor.editorModule.insertContentControl('RichText');
        editor.selectionModule.select('0;0;12', '0;0;12');
        editor.editorModule.onBackSpace();
        expect(editor.selection.start.offset).toBe(1);
        expect(editor.selection.end.offset).toBe(11);
    });
    it('Backspace at the end of the content control but cannot be edited', () => {
        console.log('Backspace at the end of the content control but cannot be edited');
        editor.openBlank();
        editor.editorModule.insertContentControl({type: 'RichText', title: 'Text', canEdit: false, tag: 'Text', canDelete: true, value: 'Syncfusion'});
        editor.selectionModule.select('0;0;12', '0;0;12');
        editor.editorModule.onBackSpace();
        expect(editor.selection.start.offset).toBe(0);
        expect(editor.selection.end.offset).toBe(12);
    });
    it('Delete at the start of the content control', () => {
        console.log('Delete at the start of the content control');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion');
        editor.selectionModule.selectAll();
        editor.editorModule.insertContentControl('RichText');
        editor.selectionModule.select('0;0;0', '0;0;0');
        editor.editorModule.delete();
        expect(editor.selection.start.offset).toBe(1);
        expect(editor.selection.end.offset).toBe(11);
    });
    it('Delete at the start of the content control but cannot be edited', () => {
        console.log('Delete at the start of the content control but cannot be edited');
        editor.openBlank();
        editor.editorModule.insertContentControl({type: 'RichText', title: 'Text', canEdit: false, tag: 'Text', canDelete: true, value: 'Syncfusion'});
        editor.selectionModule.select('0;0;0', '0;0;0');
        editor.editorModule.delete();
        expect(editor.selection.start.offset).toBe(0);
        expect(editor.selection.end.offset).toBe(12);
    });
});
