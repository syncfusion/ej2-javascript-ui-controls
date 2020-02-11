import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, TextPosition, SfdtExport, HtmlExport, HelperMethods } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';

describe('Page Break Character Document Copy Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection);
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
        setTimeout(function () {
            done();
        }, 500);
    });

    it('Test Page Break Character Document Html Export', () => {
        let object: any = {};
        expect(editor.selection.htmlWriter.serializeSpan('\f', object)).toBe('<br style = "page-break-after:always;"/>');
    });
});
describe('Merge Field Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, isReadOnly: false, enableSfdtExport: true });
        DocumentEditor.Inject(Editor, Selection, SfdtExport);
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
        setTimeout(function () {
            done();
        }, 500);
    });

    it('Test Merge Field Copy', () => {
        editor.editor.insertField('MERGEFIELD ' + 'Field' + ' \\* MERGEFORMAT');
        editor.selection.selectAll();
        let startPosition: TextPosition = editor.selection.start;
        let endPosition: TextPosition = editor.selection.end;
        let documentContent: any = editor.sfdtExportModule.write(startPosition.currentWidget, startPosition.offset, endPosition.currentWidget, endPosition.offset, true);
        editor.editorModule.copiedData = JSON.stringify(documentContent);
        let html: string = editor.selection.htmlWriter.writeHtml(documentContent);
        expect(html.indexOf('<a')).toBe(-1);
    });
});

describe('Copy table validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, isReadOnly: false, enableSfdtExport: true });
        DocumentEditor.Inject(Editor, Selection, SfdtExport);
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
        setTimeout(function () {
            done();
        }, 500);
    });

    it('Cell width validation', () => {
        editor.editor.insertTable();
        editor.selection.selectTable();
        let startPosition: TextPosition = editor.selection.start;
        let endPosition: TextPosition = editor.selection.end;
        let documentContent: any = editor.sfdtExportModule.write(startPosition.currentWidget, startPosition.offset, endPosition.currentWidget, endPosition.offset, true);
        editor.editorModule.copiedData = JSON.stringify(documentContent);
        let html: string = editor.selection.htmlWriter.writeHtml(documentContent);
        let cellWidth: number = editor.selection.cellFormat.preferredWidth;
        expect(html.indexOf(cellWidth.toString())).toBe(-1);
    });
});
describe('Paragraph format copy validation', () => {
    it('Line Spacing validation', () => {
        let paragraphFormat: any = {"firstLineIndent":36,"lineSpacing":1.14723483284,"styleName":"Normal","listFormat":{},"inlineFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":36,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1.147324838434,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"BodyText","listFormat":{},"bidi":false,"contextualSpacing":false}};
        let lineHeight: string[] = HtmlExport.prototype.serializeParagraphFormat(paragraphFormat,false).split('line-height:');
        expect(lineHeight[1]).toBe('1.1');
    });
});
describe('Get color Validation', () => {
    let colorcode: string = '#2F5496ff';
    it('color code validaton', () => {
        let color: string = HelperMethods.getColor(colorcode);
        expect(color.length).toBe(7);
    });
});
describe('Background color validation', () => {
    let cell: any = {"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":undefined,"inlineFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"BodyText","listFormat":{},"bidi":false,"contextualSpacing":false}},"characterFormat":{"inlineFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"}},"inlines":[]}],"cellFormat":{"borders":{"top":{"color":"#ee1e1e","lineStyle":"Single","lineWidth":1},"left":{"color":"#ee1e1e","lineStyle":"Single","lineWidth":1},"right":{"color":"#ee1e1e","lineStyle":"Single","lineWidth":1},"bottom":{"color":"#ee1e1e","lineStyle":"Single","lineWidth":1},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{"backgroundColor":"#59efd6ff","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":234,"cellWidth":234,"columnSpan":1,"rowSpan":1},"columnIndex":0};
    let table: any = {"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{},"inlineFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"BodyText","listFormat":{},"bidi":false,"contextualSpacing":false}},"characterFormat":{"inlineFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"}},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{"backgroundColor":"#5af8a4ff","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":234,"cellWidth":234,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{},"inlineFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"BodyText","listFormat":{},"bidi":false,"contextualSpacing":false}},"characterFormat":{"inlineFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"}},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{"backgroundColor":"#5af8a4ff","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":234,"cellWidth":234,"columnSpan":1,"rowSpan":1},"columnIndex":1}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{},"inlineFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"BodyText","listFormat":{},"bidi":false,"contextualSpacing":false}},"characterFormat":{"inlineFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"}},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{"backgroundColor":"#5af8a4ff","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":234,"cellWidth":234,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{},"inlineFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"BodyText","listFormat":{},"bidi":false,"contextualSpacing":false}},"characterFormat":{"inlineFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"}},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{"backgroundColor":"#5af8a4ff","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":234,"cellWidth":234,"columnSpan":1,"rowSpan":1},"columnIndex":1}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0}}],"grid":[234,234],"tableFormat":{"borders":{"top":{"lineStyle":"Single","lineWidth":0.5},"left":{"lineStyle":"Single","lineWidth":0.5},"right":{"lineStyle":"Single","lineWidth":0.5},"bottom":{"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{},"diagonalUp":{},"horizontal":{"lineStyle":"Single","lineWidth":0.5},"vertical":{"lineStyle":"Single","lineWidth":0.5}},"shading":{"backgroundColor":"#5af8a4ff","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto"},"columnCount":2};
    it('cell, table background color validation', () => {
        expect(colorCode(HtmlExport.prototype.serializeCell(cell))).toBe(7);
        expect(colorCode(HtmlExport.prototype.createTableStartTag(table))).toBe(7);
    });
});
function colorCode(color : string): number {
let colorcode: string[] = color.split('bgcolor="');
let code: string[] = colorcode[1].split('"');
return code[0].length;
}
describe('Heading style validation', () => {
    it('Default style validation', () => {
        expect(HtmlExport.prototype.getStyleName('Heading 1')).toBe('h1');
        expect(HtmlExport.prototype.getStyleName('Normal')).toBe('p');
    });
});
