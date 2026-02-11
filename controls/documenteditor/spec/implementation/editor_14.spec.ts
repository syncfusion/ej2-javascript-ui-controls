import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget, SfdtExport, ContentControl } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, EditorHistory, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition, DocumentEditorContainer, Toolbar } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';

describe('Empty selection check whether selection is in field', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        
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
describe('Validate the verbalize selection', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        
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
        
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Validate the verbalize selection', () => {
        console.log('Validate the verbalize selection');
        editor.editorModule.insertText('Syncfusion');
        editor.selectionModule.selectAll();
        expect(() => { editor.verbalizeFromCursorLocation() }).not.toThrowError();
    });
});
describe('Nested table copy and paste validation', () => {
    let container: DocumentEditorContainer = undefined;
    beforeAll(() => {
        
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        container = new DocumentEditorContainer({
            height: "590px", documentEditorSettings: { showRuler: true },
        });
        DocumentEditorContainer.Inject(Toolbar);
        container.appendTo('#container');
    });
    afterAll((done) => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Nested table copy and paste validation', () => {
        console.log('Nested table copy and paste validation');
        var sfdtDoc = {"sfdt":"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"};
        container.documentEditor.open(JSON.stringify(sfdtDoc));
        container.enableLocalPaste = true;
        container.documentEditor.selection.select('0;0;5;0;0;0;0;0;0','0;0;6;0;0;1;0;0;5');
        container.documentEditor.selection.copy();
        container.documentEditor.selection.select('0;0;9;0;0;0','0;0;9;0;0;0');
        expect(() => {container.documentEditor.editor.paste();}).not.toThrowError();
    });
});
