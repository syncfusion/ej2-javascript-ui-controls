import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget, SfdtExport } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, EditorHistory, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition } from '../../src/index';
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

describe('Insert bookmark inside header', () => {
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
    it('insert bookmark inside header', () => {
console.log('insert bookmark inside header');
        editor.enableHeaderAndFooter = true;
        editor.selection.enableHeadersFootersRegion(editor.documentHelper.pages[0].headerWidget, editor.documentHelper.pages[0]);
        editor.editor.insertText('Hello');
        editor.selection.selectAll();
        editor.editor.insertBookmark('sample');
        expect(editor.documentHelper.bookmarks.keys.length).toBe(1);
    });
    it('navigate bookmark in header', () => {
console.log('navigate bookmark in header');
        editor.selection.closeHeaderFooter();
        editor.selection.navigateBookmark('sample');
        expect(editor.selection.isEmpty).toBe(false);
    });
    it('export the document and open same in documenteditor', () => {
console.log('export the document and open same in documenteditor');
        let sfdtString = editor.sfdtExportModule.serialize();
        editor.open(sfdtString);
        editor.selection.navigateBookmark('sample');
        expect(editor.selection.isEmpty).toBe(false);
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
        expect(editor.documentHelper.bookmarks.keys.length).toBe(0);
    });
    it('undo after on backspace before splitted paragraph', () => {
console.log('undo after on backspace before splitted paragraph');
        editor.editorHistory.undo();
        expect(editor.documentHelper.bookmarks.keys.length).toBe(1);
    });
    it('redo after on backspace before splitted paragraph', () => {
console.log('redo after on backspace before splitted paragraph');
        editor.editorHistory.redo();
        expect(editor.documentHelper.bookmarks.keys.length).toBe(0);
    });
});

const inputSfdt: any = {"sections":[{"blocks":[{"characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033},"inlines":[{"text":"This is protected line","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}},{"text":" 1","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}}]},{"characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033},"inlines":[]},{"characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033},"inlines":[{"text":"This is protected line","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}},{"text":" 2","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}}]},{"characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033},"inlines":[]},{"characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033},"inlines":[{"text":"This is protected line","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}},{"text":" 3","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}}]},{"characterFormat":{"localeId":1033},"inlines":[]},{"characterFormat":{"localeId":1033},"inlines":[{"editRangeId":"1701400219","group":"everyone"},{"text":"This is normal line","characterFormat":{"localeId":1033}},{"text":" 1","characterFormat":{"localeId":1033}}]},{"characterFormat":{"localeId":1033},"inlines":[]},{"characterFormat":{"localeId":1033},"inlines":[{"text":"This is normal line","characterFormat":{"localeId":1033}},{"text":" 2","characterFormat":{"localeId":1033}}]},{"characterFormat":{"localeId":1033},"inlines":[]},{"characterFormat":{"localeId":1033},"inlines":[{"text":"This is normal line","characterFormat":{"localeId":1033}},{"text":" 3","characterFormat":{"localeId":1033}},{"editRangeId":"1701400219","editableRangeStart":{"editRangeId":"1701400219","group":"everyone"}}]},{"characterFormat":{"localeId":1033},"inlines":[]},{"characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033},"inlines":[{"text":"This is protected line","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}},{"text":" 1","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}}]},{"characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033},"inlines":[]},{"characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033},"inlines":[{"text":"This is protected line","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}},{"text":" 2","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}}]},{"characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033},"inlines":[]},{"characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033},"inlines":[{"text":"This is protected line","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}},{"text":" 3","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}}]},{"characterFormat":{"localeId":1033},"inlines":[]},{"characterFormat":{"localeId":1033},"inlines":[{"editRangeId":"390348567","group":"everyone"},{"text":"This is normal line 1","characterFormat":{"localeId":1033}}]},{"characterFormat":{"localeId":1033},"inlines":[]},{"characterFormat":{"localeId":1033},"inlines":[{"text":"This is normal line 2","characterFormat":{"localeId":1033}}]},{"characterFormat":{"localeId":1033},"inlines":[]},{"characterFormat":{"localeId":1033},"inlines":[{"text":"This is normal line 3","characterFormat":{"localeId":1033}},{"editRangeId":"390348567","editableRangeStart":{"editRangeId":"390348567","group":"everyone"}}]},{"characterFormat":{"localeId":1033},"inlines":[]},{"characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033},"inlines":[{"text":"This is protected line","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}},{"text":" 1","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}}]},{"characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033},"inlines":[]},{"characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033},"inlines":[{"text":"This is protected line","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}},{"text":" 2","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}}]},{"characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033},"inlines":[]},{"characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033},"inlines":[{"text":"This is protected line","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}},{"text":" 3","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0,"localeId":1033}}]},{"characterFormat":{"localeId":1033},"inlines":[]},{"characterFormat":{"localeId":1033},"inlines":[{"name":"_GoBack","bookmarkType":0},{"editRangeId":"959541420","group":"everyone"},{"text":"This is normal line 1","characterFormat":{"localeId":1033}}]},{"characterFormat":{"localeId":1033},"inlines":[]},{"characterFormat":{"localeId":1033},"inlines":[{"text":"This is normal line 2","characterFormat":{"localeId":1033}}]},{"characterFormat":{"localeId":1033},"inlines":[]},{"characterFormat":{"localeId":1033},"inlines":[{"text":"This is normal line 3","characterFormat":{"localeId":1033}},{"name":"_GoBack","bookmarkType":1,"properties":{"isAfterParagraphMark":"true"}},{"editRangeId":"959541420","editableRangeStart":{"editRangeId":"959541420","group":"everyone"}}]},{"characterFormat":{"localeId":1033},"inlines":[]},{"characterFormat":{"localeId":1033},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"textAlignment":"Right","styleName":"Header"},"inlines":[]}]},"footer":{"blocks":[{"characterFormat":{"bold":true,"fontSize":8.0,"fontFamily":"Arial","fontSizeBidi":8.0,"fontFamilyBidi":"Arial","fontFamilyAscii":"Arial","fontFamilyNonFarEast":"Arial"},"paragraphFormat":{"styleName":"Footer","tabs":[{"tabJustification":"Right","position":535.5499877929688,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]}]}},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":595.4500122070312,"pageHeight":841.7000122070312,"leftMargin":35.29999923706055,"rightMargin":35.29999923706055,"topMargin":36.0,"bottomMargin":94.30000305175781,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0,"endnoteNumberFormat":"LowerCaseRoman","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart","pageNumberStyle":"Arabic","breakCode":"NewPage"}}],"fontSubstitutionTable":{"PMingLiU":"新細明體","SimSun":"宋体"},"characterFormat":{"fontFamily":"Times New Roman","fontFamilyBidi":"Times New Roman","fontFamilyAscii":"Times New Roman","fontFamilyFarEast":"新細明體","fontFamilyNonFarEast":"Times New Roman","localeId":1033,"localeIdEastAsia":1033,"localeIdBidi":1025},"lists":[{"listId":4,"abstractListId":4}],"abstractLists":[{"abstractListId":4,"levels":[{"startAt":1,"restartLevel":0,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%1.","characterFormat":{"fontSize":12.0,"fontFamily":"Arial","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","fontFamilyAscii":"Arial","fontFamilyNonFarEast":"Arial"},"paragraphFormat":{"leftIndent":21.600000381469727,"firstLineIndent":-21.600000381469727}},{"startAt":1,"restartLevel":1,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%1.%2","characterFormat":{"fontSize":11.0,"fontFamily":"Arial","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","fontFamilyAscii":"Arial","fontFamilyNonFarEast":"Arial"},"paragraphFormat":{"leftIndent":28.799999237060547,"firstLineIndent":-28.799999237060547}},{"startAt":1,"restartLevel":2,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%1.%2.%3","paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-36.0}},{"startAt":1,"restartLevel":3,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%1.%2.%3.%4","paragraphFormat":{"leftIndent":43.20000076293945,"firstLineIndent":-43.20000076293945}},{"startAt":1,"restartLevel":4,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%1.%2.%3.%4.%5","paragraphFormat":{"leftIndent":95.4000015258789,"firstLineIndent":-50.400001525878906}},{"startAt":1,"restartLevel":5,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%1.%2.%3.%4.%5.%6","paragraphFormat":{"leftIndent":57.599998474121094,"firstLineIndent":-57.599998474121094}},{"startAt":1,"restartLevel":6,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%1.%2.%3.%4.%5.%6.%7","paragraphFormat":{"leftIndent":64.80000305175781,"firstLineIndent":-64.80000305175781}},{"startAt":1,"restartLevel":7,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%1.%2.%3.%4.%5.%6.%7.%8","paragraphFormat":{"leftIndent":72.0,"firstLineIndent":-72.0}},{"startAt":1,"restartLevel":8,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%1.%2.%3.%4.%5.%6.%7.%8.%9","paragraphFormat":{"leftIndent":79.19999694824219,"firstLineIndent":-79.19999694824219}}]}],"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"localeId":2057}},{"type":"Paragraph","name":"Heading 1","basedOn":"Normal","next":"Normal","characterFormat":{"bold":true,"fontSize":14.0},"paragraphFormat":{"outlineLevel":"Level1","listFormat":{"listId":4},"keepWithNext":true}},{"type":"Paragraph","name":"Heading 2","basedOn":"Normal","next":"Normal","link":"Heading 2 Char","characterFormat":{"fontSize":12.0},"paragraphFormat":{"outlineLevel":"Level2","listFormat":{"listLevelNumber":1,"listId":4},"keepWithNext":true}},{"type":"Paragraph","name":"Heading 3","basedOn":"Normal","next":"Normal","link":"Heading 3 Char","characterFormat":{"bold":true,"fontSize":12.0},"paragraphFormat":{"outlineLevel":"Level3","textAlignment":"Center","listFormat":{"listLevelNumber":2,"listId":4},"keepWithNext":true}},{"type":"Paragraph","name":"Heading 4","basedOn":"Normal","next":"Normal","characterFormat":{"bold":true,"fontSize":12.0},"paragraphFormat":{"outlineLevel":"Level4","listFormat":{"listLevelNumber":3,"listId":4},"keepWithNext":true}},{"type":"Paragraph","name":"Heading 5","basedOn":"Normal","next":"Normal","characterFormat":{"fontSize":50.0},"paragraphFormat":{"outlineLevel":"Level5","listFormat":{"listLevelNumber":4,"listId":4},"keepWithNext":true}},{"type":"Paragraph","name":"Heading 6","basedOn":"Normal","next":"Normal","characterFormat":{"fontSize":50.0},"paragraphFormat":{"outlineLevel":"Level6","listFormat":{"listLevelNumber":5,"listId":4},"keepWithNext":true}},{"type":"Paragraph","name":"Heading 7","basedOn":"Normal","next":"Normal","characterFormat":{"bold":true,"fontSize":12.0},"paragraphFormat":{"outlineLevel":"Level7","listFormat":{"listLevelNumber":6,"listId":4},"keepWithNext":true}},{"type":"Paragraph","name":"Heading 8","basedOn":"Normal","next":"Normal","characterFormat":{"bold":true},"paragraphFormat":{"outlineLevel":"Level8","textAlignment":"Center","listFormat":{"listLevelNumber":7,"listId":4},"keepWithNext":true}},{"type":"Paragraph","name":"Heading 9","basedOn":"Normal","next":"Normal","characterFormat":{"bold":true},"paragraphFormat":{"outlineLevel":"Level9","listFormat":{"listLevelNumber":8,"listId":4},"keepWithNext":true}},{"type":"Character","name":"Default Paragraph Font"},{"type":"Character","name":"Page Number","basedOn":"Default Paragraph Font"},{"type":"Paragraph","name":"annotation text","basedOn":"Normal","next":"annotation text","link":"Comment Text Char","characterFormat":{"fontSize":12.0}},{"type":"Paragraph","name":"Header","basedOn":"Normal","next":"Header","link":"Header Char","characterFormat":{"fontSize":12.0},"paragraphFormat":{"tabs":[{"tabJustification":"Center","position":207.64999389648438,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":415.29998779296875,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"CT Body","basedOn":"Normal","next":"CT Body","characterFormat":{"fontSize":12.0},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":56.70000076293945,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"Body Text 3","basedOn":"Normal","next":"Body Text 3","characterFormat":{"bold":true,"fontSize":12.0}},{"type":"Character","name":"Hyperlink","basedOn":"Default Paragraph Font","characterFormat":{"underline":"Single","fontColor":"#0000FFFF"}},{"type":"Paragraph","name":"Body Text Indent 2","basedOn":"Normal","next":"Body Text Indent 2","link":"Body Text Indent 2 Char","characterFormat":{"fontSize":12.0},"paragraphFormat":{"leftIndent":35.25,"firstLineIndent":-35.25}},{"type":"Paragraph","name":"Body Text Indent","basedOn":"Normal","next":"Body Text Indent","link":"Body Text Indent Char","characterFormat":{"fontSize":12.0},"paragraphFormat":{"leftIndent":35.45000076293945,"firstLineIndent":-35.45000076293945}},{"type":"Paragraph","name":"Footer","basedOn":"Normal","next":"Footer","link":"Footer Char","characterFormat":{"fontSize":12.0},"paragraphFormat":{"tabs":[{"tabJustification":"Center","position":207.64999389648438,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":415.29998779296875,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"FollowedHyperlink","basedOn":"Default Paragraph Font","characterFormat":{"underline":"Single","fontColor":"#800080FF"}},{"type":"Paragraph","name":"Body Text","basedOn":"Normal","next":"Body Text","characterFormat":{"fontColor":"#0000FFFF"}},{"type":"Paragraph","name":"Body Text 2","basedOn":"Normal","next":"Body Text 2","characterFormat":{"italic":true,"fontSize":12.0},"paragraphFormat":{"outlineLevel":"Level1","textAlignment":"Justify"}},{"type":"Paragraph","name":"NL Date","basedOn":"Normal","next":"NL Date","characterFormat":{"fontFamily":"Arial","fontFamilyAscii":"Arial","fontFamilyNonFarEast":"Arial","localeId":1033},"paragraphFormat":{"tabs":[{"tabJustification":"Right","position":540.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"TOC 2","basedOn":"Normal","next":"Normal","characterFormat":{"fontFamilyFarEast":"宋体","localeIdEastAsia":2052},"paragraphFormat":{"tabs":[{"tabJustification":"Right","position":415.6499938964844,"tabLeader":"Dot","deletePosition":0.0}],"keepLinesTogether":true}},{"type":"Paragraph","name":"Balloon Text","basedOn":"Normal","next":"Balloon Text","characterFormat":{"fontSize":8.0,"fontFamily":"Tahoma","fontSizeBidi":8.0,"fontFamilyBidi":"Tahoma","fontFamilyAscii":"Tahoma","fontFamilyNonFarEast":"Tahoma"}},{"type":"Paragraph","name":"Default","next":"Default","characterFormat":{"fontSize":12.0,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","fontFamilyAscii":"Arial","fontFamilyNonFarEast":"Arial"},"paragraphFormat":{"textAlignment":"Justify"}},{"type":"Character","name":"Heading 2 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"localeId":2057,"localeIdEastAsia":1033}},{"type":"Character","name":"Comment Text Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"localeId":2057}},{"type":"Character","name":"Heading 3 Char","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"fontSize":12.0,"localeId":2057,"localeIdEastAsia":1033}},{"type":"Character","name":"Body Text Indent Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"localeId":2057}},{"type":"Character","name":"Header Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"localeId":2057,"localeIdEastAsia":1033}},{"type":"Paragraph","name":"List Paragraph","basedOn":"Normal","next":"List Paragraph","characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyAscii":"Calibri","fontFamilyFarEast":"Calibri","fontFamilyNonFarEast":"Calibri","localeId":1033},"paragraphFormat":{"leftIndent":36.0,"afterSpacing":10.0,"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple","contextualSpacing":true}},{"type":"Paragraph","name":"Plain Text","basedOn":"Normal","next":"Plain Text","link":"Plain Text Char","characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":10.5,"fontFamilyAscii":"Calibri","fontFamilyFarEast":"Calibri","fontFamilyNonFarEast":"Calibri"}},{"type":"Character","name":"Plain Text Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":10.5,"fontFamilyAscii":"Calibri","fontFamilyFarEast":"Calibri","fontFamilyNonFarEast":"Calibri"}},{"type":"Character","name":"Footer Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"localeId":2057,"localeIdEastAsia":1033}},{"type":"Character","name":"Unresolved Mention","basedOn":"Default Paragraph Font","characterFormat":{"fontColor":"#808080FF"}},{"type":"Character","name":"annotation reference","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":8.0,"fontSizeBidi":8.0}},{"type":"Character","name":"Body Text Indent 2 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"localeId":2057,"localeIdEastAsia":1033}},{"type":"Paragraph","name":"annotation subject","basedOn":"annotation text","next":"annotation text","link":"Comment Subject Char","characterFormat":{"bold":true,"fontSize":10.0,"boldBidi":true}},{"type":"Character","name":"Comment Subject Char","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"fontSize":12.0,"boldBidi":true,"localeId":2057,"localeIdEastAsia":1033}}],"defaultTabWidth":36.0,"formatting":false,"trackChanges":false,"protectionType":"ReadOnly","enforcement":true,"hashValue":"b8ucyyUfSPS2gkZkmF2yQlBj0B9TmPukujTRCXA5b5IWlHtEXotCXwnnTCXmYnnd0X5l0JqGXJ1OdrUHRhw36g==","saltValue":"7i183w3sHufVrfP1HVnE1w==","cryptProviderType":"rsaAES","cryptAlgorithmClass":"hash","cryptAlgorithmType":"typeAny","cryptAlgorithmSid":"14","cryptSpinCount":"100000","dontUseHTMLParagraphAutoSpacing":false,"alignTablesRowByRow":false,"formFieldShading":true,"footnotes":{"separator":[{"inlines":[{"text":"\u0003"}]}],"continuationSeparator":[{"inlines":[{"text":"\u0004"}]}],"continuationNotice":[{"inlines":[]}]},"endnotes":{"separator":[{"inlines":[{"text":"\u0003"}]}],"continuationSeparator":[{"inlines":[{"text":"\u0004"}]}],"continuationNotice":[{"inlines":[]}]},"compatibilityMode":"Word2013","allowSpaceOfSameStyleInTable":false,"themeFontLanguages":{"localeId":1033},"themes":{"fontScheme":{"fontSchemeName":"Office","majorFontScheme":{"fontSchemeList":[{"name":"latin","typeface":"Calibri Light","panose":"020F0302020204030204"},{"name":"ea","panose":"020F0302020204030204"},{"name":"cs","panose":"020F0302020204030204"}],"fontTypeface":{"Jpan":"游ゴシック Light","Hang":"맑은 고딕","Hans":"等线 Light","Hant":"新細明體","Arab":"Times New Roman","Hebr":"Times New Roman","Thai":"Angsana New","Ethi":"Nyala","Beng":"Vrinda","Gujr":"Shruti","Khmr":"MoolBoran","Knda":"Tunga","Guru":"Raavi","Cans":"Euphemia","Cher":"Plantagenet Cherokee","Yiii":"Microsoft Yi Baiti","Tibt":"Microsoft Himalaya","Thaa":"MV Boli","Deva":"Mangal","Telu":"Gautami","Taml":"Latha","Syrc":"Estrangelo Edessa","Orya":"Kalinga","Mlym":"Kartika","Laoo":"DokChampa","Sinh":"Iskoola Pota","Mong":"Mongolian Baiti","Viet":"Times New Roman","Uigh":"Microsoft Uighur","Geor":"Sylfaen"}},"minorFontScheme":{"fontSchemeList":[{"name":"latin","typeface":"Calibri","panose":"020F0502020204030204"},{"name":"ea","panose":"020F0502020204030204"},{"name":"cs","panose":"020F0502020204030204"}],"fontTypeface":{"Jpan":"游明朝","Hang":"맑은 고딕","Hans":"等线","Hant":"新細明體","Arab":"Arial","Hebr":"Arial","Thai":"Cordia New","Ethi":"Nyala","Beng":"Vrinda","Gujr":"Shruti","Khmr":"DaunPenh","Knda":"Tunga","Guru":"Raavi","Cans":"Euphemia","Cher":"Plantagenet Cherokee","Yiii":"Microsoft Yi Baiti","Tibt":"Microsoft Himalaya","Thaa":"MV Boli","Deva":"Mangal","Telu":"Gautami","Taml":"Latha","Syrc":"Estrangelo Edessa","Orya":"Kalinga","Mlym":"Kartika","Laoo":"DokChampa","Sinh":"Iskoola Pota","Mong":"Mongolian Baiti","Viet":"Arial","Uigh":"Microsoft Uighur","Geor":"Sylfaen"}}}}};

describe('Validate the script error issue while opening protected document multiple times', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false, enableSelection: true, enableComment: true });
        editor.acceptTab = true;
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
    it('Script error while opening blank document after loading protected document', () => {
        editor.open(JSON.stringify(inputSfdt));
        expect(() => { editor.openBlank() }).not.toThrowError();
    });
});
