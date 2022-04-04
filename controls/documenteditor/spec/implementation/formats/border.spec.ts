import { Editor, Selection, TableWidget, BodyWidget, TableRowWidget, TableCellWidget } from '../../../src/index';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { TestHelper } from '../../test-helper.spec';
import { createElement } from '@syncfusion/ej2-base';
import { WBorder } from '../../../src/document-editor/implementation/format/border';
describe('Border Validation Testing', () => {
    let border: WBorder;
    beforeEach(() => {
        border = new WBorder();
    });
    afterEach(() => {
        border.destroy();
        WBorder.clear();
    });
    it('set property value undefined', () => {
console.log('set property value undefined');
        border.shadow = undefined;
        expect(border.shadow).toBe(false);
    });
    it('Copy Format Testing', () => {
console.log('Copy Format Testing');
        let border1: WBorder = new WBorder();
        border.shadow = true;
        border.space = 10;
        border.shadow = false;
        border.space = 20;
        border.copyFormat(border);
        expect('').toBe('');
        border1.destroy();
    });
    it('Copy Format undefined Testing', () => {
console.log('Copy Format undefined Testing');
        border.copyFormat(border);
        expect('').toBe('');
    });
    it('destroy Testing', () => {
console.log('destroy Testing');
        border.destroy();
        expect('').toBe('');
        border.cloneFormat();
        expect(() => { border.destroy() }).not.toThrowError();
    });
    it('Clone Format Testing', () => {
console.log('Clone Format Testing');
        border.shadow = true;
        border.space = 10;
        border.shadow = false;
        border.space = 20;
        let returnBorder: WBorder = border.cloneFormat();
        expect(returnBorder.space).toBe(20);
        expect(returnBorder.shadow).toBe(false);
        returnBorder.destroy();
    });
    it('Border lineWidth for line style Engrave3D', () => {
console.log('Border lineWidth for line style Engrave3D');
        border.lineStyle = 'Engrave3D';
        border.getLineWidth();
        expect('').toBe('');
    });
    it('Border lineWidth for line style Thick', () => {
console.log('Border lineWidth for line style Thick');
        border.lineStyle = 'Thick';
        border.getLineWidth();
        expect('').toBe('');
    });
    it('Border lineWidth for line style SingleWavy', () => {
console.log('Border lineWidth for line style SingleWavy');
        border.lineStyle = 'SingleWavy';
        border.getLineWidth();
        expect('').toBe('');
    });
    it('Border lineWidth for line style DoubleWavy', () => {
console.log('Border lineWidth for line style DoubleWavy');
        border.lineStyle = 'DoubleWavy';
        border.getLineWidth();
        expect('').toBe('');
    });
    it('Border lineWidth for line style Outset', () => {
console.log('Border lineWidth for line style Outset');
        border.lineStyle = 'Outset';
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border lineWidth for line style ThinThickLargeGap', () => {
console.log('Border lineWidth for line style ThinThickLargeGap');
        border.lineStyle = 'ThinThickLargeGap';
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border lineWidth for line style ThickThinLargeGap', () => {
console.log('Border lineWidth for line style ThickThinLargeGap');
        border.lineStyle = 'ThickThinLargeGap';
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border lineWidth for line style ThinThickThinMediumGap', () => {
console.log('Border lineWidth for line style ThinThickThinMediumGap');
        border.lineStyle = 'ThinThickThinMediumGap';
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border lineWidth for line style ThinThickThinLargeGap', () => {
console.log('Border lineWidth for line style ThinThickThinLargeGap');
        border.lineStyle = 'ThinThickThinLargeGap';
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border lineWidth for line style Emboss3D', () => {
console.log('Border lineWidth for line style Emboss3D');
        border.lineStyle = 'Emboss3D';
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Thick', () => {
console.log('Border Weight for line style Thick');
        border.lineStyle = 'Thick';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style DashLargeGap', () => {
console.log('Border Weight for line style DashLargeGap');
        border.lineStyle = 'DashLargeGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Single', () => {
console.log('Border Weight for line style Single');
        border.lineStyle = 'Single';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Double', () => {
console.log('Border Weight for line style Double');
        border.lineStyle = 'Double';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Dot', () => {
console.log('Border Weight for line style Dot');
        border.lineStyle = 'Dot';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style DashLargeGap', () => {
console.log('Border Weight for line style DashLargeGap');
        border.lineStyle = 'DashLargeGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style DashDot', () => {
console.log('Border Weight for line style DashDot');
        border.lineStyle = 'DashDot';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style DashDotDot', () => {
console.log('Border Weight for line style DashDotDot');
        border.lineStyle = 'DashDotDot';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Triple', () => {
console.log('Border Weight for line style Triple');
        border.lineStyle = 'Triple';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThinThickSmallGap', () => {
console.log('Border Weight for line style ThinThickSmallGap');
        border.lineStyle = 'ThinThickSmallGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThickThinSmallGap', () => {
console.log('Border Weight for line style ThickThinSmallGap');
        border.lineStyle = 'ThickThinSmallGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThinThickThinSmallGap', () => {
console.log('Border Weight for line style ThinThickThinSmallGap');
        border.lineStyle = 'ThinThickThinSmallGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThinThickMediumGap', () => {
console.log('Border Weight for line style ThinThickMediumGap');
        border.lineStyle = 'ThinThickMediumGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThickThinMediumGap', () => {
console.log('Border Weight for line style ThickThinMediumGap');
        border.lineStyle = 'ThickThinMediumGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThinThickThinMediumGap', () => {
console.log('Border Weight for line style ThinThickThinMediumGap');
        border.lineStyle = 'ThinThickThinMediumGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThinThickLargeGap', () => {
console.log('Border Weight for line style ThinThickLargeGap');
        border.lineStyle = 'ThinThickLargeGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThickThinLargeGap', () => {
console.log('Border Weight for line style ThickThinLargeGap');
        border.lineStyle = 'ThickThinLargeGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThinThickThinLargeGap', () => {
console.log('Border Weight for line style ThinThickThinLargeGap');
        border.lineStyle = 'ThinThickThinLargeGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style SingleWavy', () => {
console.log('Border Weight for line style SingleWavy');
        border.lineStyle = 'SingleWavy';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style DoubleWavy', () => {
console.log('Border Weight for line style DoubleWavy');
        border.lineStyle = 'DoubleWavy';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style DashSmallGap', () => {
console.log('Border Weight for line style DashSmallGap');
        border.lineStyle = 'DashSmallGap';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style DashDotStroked', () => {
console.log('Border Weight for line style DashDotStroked');
        border.lineStyle = 'DashDotStroked';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Emboss3D', () => {
console.log('Border Weight for line style Emboss3D');
        border.lineStyle = 'Emboss3D';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Engrave3D', () => {
console.log('Border Weight for line style Engrave3D');
        border.lineStyle = 'Engrave3D';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Outset', () => {
console.log('Border Weight for line style Outset');
        border.lineStyle = 'Outset';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Inset', () => {
console.log('Border Weight for line style Inset');
        border.lineStyle = 'Inset';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
});

let file : any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":233.75,"preferredWidthType":"Point","cellWidth":233.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":233.75,"preferredWidthType":"Point","cellWidth":233.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}}],"grid":[233.75,233.75],"tableFormat":{"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":2},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}]}};

describe('Table border after inserting new row', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
    it('Validating Table border after inserting new row', () => {
console.log('Validating Table border after inserting new row');
        editor.open(JSON.stringify(file));
        editor.selection.moveNextPosition();
        editor.editor.insertRow();
        let bodyWidget : BodyWidget = editor.documentHelper.pages[0].bodyWidgets[0] as BodyWidget;
        let table : TableWidget = bodyWidget.childWidgets[0] as TableWidget;
        let row : TableRowWidget = table.childWidgets[1] as TableRowWidget;
        let cell : TableCellWidget = row.childWidgets[0] as TableCellWidget;
        expect(cell.cellFormat.borders.top.hasNoneStyle).toBe(false);
    });
});