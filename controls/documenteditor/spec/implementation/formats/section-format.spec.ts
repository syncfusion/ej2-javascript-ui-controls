import { WTableHolder, Selection } from '../../../src/index';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { createElement } from '@syncfusion/ej2-base';
import { WSectionFormat } from '../../../src/document-editor/implementation/format/section-format';
import { TestHelper } from '../../test-helper.spec';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { SfdtExport } from "../../../src/document-editor/implementation/writer/sfdt-export";
import { BodyWidget} from '../../../src/index';
describe('TableHolder Validation Testing', () => {
    afterEach(() => {
        WSectionFormat.clear();
    });
    it('TableHolder destroy  Testing', () => {
console.log('TableHolder destroy  Testing');
        let holder: WTableHolder = new WTableHolder();
        holder.destroy();
        holder.destroy();
        expect('').toBe('')
    });
    it('Section Format Copy Format Undefined Testing', () => {
console.log('Section Format Copy Format Undefined Testing');
        let sectionFormat: WSectionFormat = new WSectionFormat();
        let sectionFormat1: WSectionFormat = new WSectionFormat();
        sectionFormat.copyFormat(sectionFormat1);
        expect('').toBe('')
    });
    it('Section Format Copy Format Undefined Testing', () => {
console.log('Section Format Copy Format Undefined Testing');
        let sectionFormat: WSectionFormat = new WSectionFormat();
        sectionFormat.copyFormat(undefined);
        expect('').toBe('')
    });
    it('Section Format Copy Format Testing', () => {
console.log('Section Format Copy Format Testing');
        let sectionFormat: WSectionFormat = new WSectionFormat();
        let sectionFormat1: WSectionFormat = new WSectionFormat();
        sectionFormat1.footerDistance = 50;
        sectionFormat1.headerDistance = 50;
        sectionFormat1.differentFirstPage = true;
        sectionFormat.copyFormat(sectionFormat1);
        expect(sectionFormat.differentFirstPage).toBe(true);
    });
    it('Section Format Copy Format Testing', () => {
console.log('Section Format Copy Format Testing');
        let sectionFormat: WSectionFormat = new WSectionFormat();
        let sectionFormat1: WSectionFormat = new WSectionFormat();
        sectionFormat1.footerDistance = undefined;
        sectionFormat.copyFormat(sectionFormat1);
        expect(sectionFormat.footerDistance).toBe(36);
    });
    it('Section Format destroy Testing', () => {
console.log('Section Format destroy Testing');
        let sectionFormat: WSectionFormat = new WSectionFormat();
        sectionFormat.destroy();
        expect('').toBe('')
    });
    it('Section Format Clone Format Testing', () => {
console.log('Section Format Clone Format Testing');
        let sectionFormat: WSectionFormat = new WSectionFormat();
        sectionFormat.cloneFormat();
        expect(sectionFormat.footerDistance).toBe(36);
    });
});

describe('Default section Format API Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        let defaultSectionFormat: object = {
            headerDistance: 25,
            footerDistance: 25,
            pageWidth: 500,
            pageHeight: 500,
            topMargin: 20,
            bottomMargin: 20,
            leftMargin: 20,
            rightMargin: 20,
        }
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.setDefaultSectionFormat(defaultSectionFormat);
        editor.appendTo('#container');
    });
    afterAll(() => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
    });
    it('check page width of the page', () => {
console.log('check page width of the page');
        expect(editor.selection.sectionFormat.pageWidth).toBe(500);
    });
    it('check page height of the page', () => {
console.log('check page height of the page');
        expect(editor.selection.sectionFormat.pageHeight).toBe(500);
    });
    it('check header distance', () => {
console.log('check header distance');
        expect(editor.selection.sectionFormat.headerDistance).toBe(25);
    });
    it('check footer distance', () => {
console.log('check footer distance');
        expect(editor.selection.sectionFormat.footerDistance).toBe(25);
    });
    it('check top margin', () => {
console.log('check top margin');
        expect(editor.selection.sectionFormat.topMargin).toBe(20);
    });
    it('check bottom margin', () => {
console.log('check bottom margin');
        expect(editor.selection.sectionFormat.bottomMargin).toBe(20);
    });
    it('check left margin', () => {
console.log('check left margin');
        expect(editor.selection.sectionFormat.leftMargin).toBe(20);
    });
    it('check right margin', () => {
console.log('check right margin');
        expect(editor.selection.sectionFormat.rightMargin).toBe(20);
    });
    it('Footer distance validation', () => {
console.log('Footer distance validation');
        editor.openBlank();
        editor.selection.goToFooter();
        editor.editor.insertPageNumber();
        expect(() => { editor.selection.sectionFormat.footerDistance = 34; }).not.toThrowError();
    });
});

describe('To Check the default Page Number Format', () => {
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
    let file : any = '{"sections":[{"blocks":[{"inlines":[{"text":"Arabic"}]},{"inlines":[]},{"inlines":[]}],"headersFooters":{"header":{"blocks":[{"blocks":[{"paragraphFormat":{"styleName":"Header"},"inlines":[{"hasFieldEnd":true,"fieldType":0},{"text":" PAGE   \\\\* MERGEFORMAT "},{"fieldType":2},{"text":"2"},{"fieldType":1}]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"dateCalendarType":"Gregorian","isChecked":false}},{"paragraphFormat":{"styleName":"Header"},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"styleName":"Footer"},"inlines":[{"hasFieldEnd":true,"fieldType":0},{"text":" PAGE   \\\\* MERGEFORMAT "},{"fieldType":2},{"text":"1"},{"fieldType":1}]}]}},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0,"endnoteNumberFormat":"LowerCaseRoman","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart","columns":{"column":[{"width":468.0,"space":36.0}],"numberOfColumns":1,"equalWidth":true}}},{"blocks":[{"inlines":[{"text":"UpperRoman"}]},{"inlines":[]},{"inlines":[]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0,"endnoteNumberFormat":"LowerCaseRoman","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart","pageNumberStyle":"RomanUpper","columns":{"column":[{"width":468.0,"space":36.0}],"numberOfColumns":1,"equalWidth":true}}},{"blocks":[{"inlines":[{"text":"LowerRoman"}]},{"inlines":[]},{"inlines":[]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0,"endnoteNumberFormat":"LowerCaseRoman","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart","pageNumberStyle":"RomanLower","columns":{"column":[{"width":468.0,"space":36.0}],"numberOfColumns":1,"equalWidth":true}}},{"blocks":[{"inlines":[{"text":"UpperLetter"}]},{"inlines":[]},{"inlines":[]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0,"endnoteNumberFormat":"LowerCaseRoman","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart","pageNumberStyle":"LetterUpper","columns":{"column":[{"width":468.0,"space":36.0}],"numberOfColumns":1,"equalWidth":true}}},{"blocks":[{"inlines":[{"text":"LowerLetter"}]},{"inlines":[]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0,"endnoteNumberFormat":"LowerCaseRoman","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart","pageNumberStyle":"LetterLower","columns":{"column":[{"width":468.0,"space":36.0}],"numberOfColumns":1,"equalWidth":true}}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Character","name":"Default Paragraph Font"},{"type":"Paragraph","name":"Header","basedOn":"Normal","next":"Header","link":"Header Char","paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","tabs":[{"tabJustification":"Center","position":234.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Header Char","basedOn":"Default Paragraph Font"},{"type":"Paragraph","name":"Footer","basedOn":"Normal","next":"Footer","link":"Footer Char","paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","tabs":[{"tabJustification":"Center","position":234.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Footer Char","basedOn":"Default Paragraph Font"}],"defaultTabWidth":36.0,"formatting":false,"trackChanges":false,"protectionType":"NoProtection","enforcement":false,"dontUseHTMLParagraphAutoSpacing":false,"alignTablesRowByRow":false,"formFieldShading":true,"footnotes":{"separator":[{"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"},"inlines":[{"text":"\\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"},"inlines":[{"text":"\\u0004"}]}],"continuationNotice":[{"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"},"inlines":[{"text":"\\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"},"inlines":[{"text":"\\u0004"}]}],"continuationNotice":[{"inlines":[]}]},"compatibilityMode":"Word2013"}'
    it('Checking the PageNumberStyle property value',() =>{
        console.log('Checking the PageNumberStyle property value');
        container.openBlank();
        container.open(file);
        container.selection.selectAll();
        container.editor.decreaseIndent();
        let bodyWidget_1: BodyWidget = container.editor.documentHelper.pages[0].bodyWidgets[0] as BodyWidget;
        expect(bodyWidget_1.sectionFormat.pageNumberStyle).toBe("Arabic");
        let bodyWidget_2: BodyWidget = container.editor.documentHelper.pages[1].bodyWidgets[0] as BodyWidget;
        expect(bodyWidget_2.sectionFormat.pageNumberStyle).toBe("RomanUpper");
        let bodyWidget_3: BodyWidget = container.editor.documentHelper.pages[2].bodyWidgets[0] as BodyWidget;
        expect(bodyWidget_3.sectionFormat.pageNumberStyle).toBe("RomanLower");
        let bodyWidget_4: BodyWidget = container.editor.documentHelper.pages[3].bodyWidgets[0] as BodyWidget;
        expect(bodyWidget_4.sectionFormat.pageNumberStyle).toBe("LetterUpper");
        let bodyWidget_5: BodyWidget = container.editor.documentHelper.pages[4].bodyWidgets[0] as BodyWidget;
        expect(bodyWidget_5.sectionFormat.pageNumberStyle).toBe("LetterLower");
    });
});