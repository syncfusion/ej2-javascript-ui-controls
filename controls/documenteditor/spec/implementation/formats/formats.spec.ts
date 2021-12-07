import { WCharacterFormat } from '../../../src/document-editor/implementation/format/character-format';
import { WListFormat } from '../../../src/document-editor/implementation/format/list-format';
import { WParagraphFormat } from '../../../src/document-editor/implementation/format/paragraph-format';
import { WTableFormat } from '../../../src/document-editor/implementation/format/table-format';
import { WRowFormat } from '../../../src/document-editor/implementation/format/row-format';
import { WCellFormat } from '../../../src/document-editor/implementation/format/cell-format';
import { WBorder } from '../../../src/document-editor/implementation/format/border';
import { WBorders } from '../../../src/document-editor/implementation/format/borders';
import { WShading } from '../../../src/document-editor/implementation/format/shading';
import { WSectionFormat } from '../../../src/document-editor/implementation/format/section-format';
import { HeightType, LineStyle, TextureStyle } from '../../../src/document-editor/base/types';
import { WList } from '../../../src/document-editor/implementation/list/list';

describe('Text Format Testing', () => {
    it('constructor testing', () => {
console.log('constructor testing');
        let format: WCharacterFormat = new WCharacterFormat();
        expect('').toBe('');
        expect(format.bold).toBe(false);
        expect(format.italic).toBe(false);
        expect(format.fontSize).toBe(11);
        expect(format.underline).toBe('None');
        expect(format.strikethrough).toBe('None');
        expect(format.baselineAlignment).toBe('Normal');
        expect(format.highlightColor).toBe('NoColor');
        expect(format.fontColor).toBe('#00000000');
        expect(format.fontFamily).toBe('Calibri');
    });

});
describe('character format testing', () => {
    it('constructor testing', () => {
console.log('constructor testing');
        let format: WCharacterFormat = new WCharacterFormat(undefined);
        expect('').toBe('');
        expect(format.bold).toBe(false);
        expect(format.italic).toBe(false);
        expect(format.fontSize).toBe(11);
        expect(format.underline).toBe('None');
        expect(format.strikethrough).toBe('None');
        expect(format.baselineAlignment).toBe('Normal');
        expect(format.highlightColor).toBe('NoColor');
        expect(format.fontColor).toBe('#00000000');
        expect(format.fontFamily).toBe('Calibri');
    });
});
describe('Section format', () => {
    it('constructor testing', () => {
console.log('constructor testing');
        let sectionFormat: WSectionFormat = new WSectionFormat(undefined);
        expect('').toBe('');
    });
    it('Validate Section format', () => {
console.log('Validate Section format');
        let sectionFormat: WSectionFormat = new WSectionFormat(undefined);
        expect(sectionFormat.headerDistance).toBe(36);
        expect(sectionFormat.footerDistance).toBe(36);
        expect(sectionFormat.differentFirstPage).toBe(false);
        expect(sectionFormat.differentOddAndEvenPages).toBe(false);
        expect(sectionFormat.pageWidth).toBe(612);
        expect(sectionFormat.pageHeight).toBe(792);
        expect(sectionFormat.leftMargin).toBe(72);
        expect(sectionFormat.topMargin).toBe(72);
        expect(sectionFormat.bottomMargin).toBe(72);
        expect(sectionFormat.rightMargin).toBe(72);
    })
})
describe('ParaFormat Testing', () => {
    it('List Format Validation', () => {
console.log('List Format Validation');
        let listFormat: WListFormat = new WListFormat();
        // expect(listFormat.document).toBe(undefined);
        // expect(listFormat.list).toBe(undefined);
        let list: WList = new WList();
        let listFormat2: WListFormat = new WListFormat();
        // listFormat2.list = list;
        listFormat.copyFormat(listFormat2);
    })
});
describe('table Format Testing', () => {

    it('Paragraph Format Validation', () => {
console.log('Paragraph Format Validation');
        let paraFormat: WParagraphFormat = new WParagraphFormat(undefined);
        expect(paraFormat.firstLineIndent).toBe(0);
        expect(paraFormat.beforeSpacing).toBe(0);
        expect(paraFormat.afterSpacing).toBe(0);
        expect(paraFormat.lineSpacing).toBe(1);
        expect(paraFormat.lineSpacingType).toBe('Multiple');
        expect(paraFormat.textAlignment).toBe('Left');
        // expect(paraFormat.document).toBe(undefined);
    });
    it('Copy Paragraph Format', () => {
console.log('Copy Paragraph Format');
        let sourceFormat: WParagraphFormat = new WParagraphFormat(undefined);
        sourceFormat.afterSpacing = undefined;
        sourceFormat.beforeSpacing = undefined;
        sourceFormat.leftIndent = undefined;
        sourceFormat.rightIndent = undefined;
        sourceFormat.firstLineIndent = undefined;
        sourceFormat.lineSpacing = undefined;
        sourceFormat.lineSpacingType = undefined;
        sourceFormat.textAlignment = undefined;
        sourceFormat.listFormat = undefined;
        let paraFormat: WParagraphFormat = new WParagraphFormat(undefined);
        paraFormat.copyFormat(sourceFormat);
        paraFormat.copyFormat(undefined);
    });
    describe('Table Format Testing', () => {
        it('constructor testing', () => {
console.log('constructor testing');
            let tableFormat: WTableFormat = new WTableFormat(undefined);
            tableFormat.borders = undefined;
            tableFormat.leftIndent = 1;
            tableFormat.shading = undefined;
            expect('').toBe('');
            expect(tableFormat.preferredWidth).not.toBe(undefined);
            expect(tableFormat.preferredWidthType).not.toBe(undefined);
            expect(tableFormat.leftIndent).toBe(1);
            expect(tableFormat.shading).toBe(undefined);
            // expect(tableFormat.document).toBe(undefined);
        });
    });
    describe('Row Format Testing', () => {
        it('constructor testing', () => {
console.log('constructor testing');
            let rowFormat: WRowFormat = new WRowFormat(undefined);
            expect('').toBe('');
            rowFormat.heightType = 'AtLeast';
            // expect(rowFormat.height = 0).not.toThrowError();
            rowFormat.heightType = 'Exactly';
            // expect(rowFormat.height = 12).not.toThrowError();
            rowFormat.borders = new WBorders(undefined);
            // expect(rowFormat.document).toBe(undefined);
        });
        it('Row Format Testing', () => {
console.log('Row Format Testing');
            let rowFormat: WRowFormat = new WRowFormat(undefined);
            expect(rowFormat.allowBreakAcrossPages).toBe(true);
            expect(rowFormat.isHeader).toBe(false);
            expect(rowFormat.height).toBe(0);
        });
    });
    describe('Cell Format Testing', () => {
        it('constructor testing', () => {
console.log('constructor testing');
            let cell: WCellFormat = new WCellFormat(undefined);
            expect('').toBe('');
            expect(cell.preferredWidth).toBe(0);
            expect(cell.preferredWidthType).not.toBe(undefined);
            // expect(cell.document).toBe(undefined);
        });
        it('Cell Format Validation', () => {
console.log('Cell Format Validation');
            let cell: WCellFormat = new WCellFormat(undefined);
            expect(cell.cellWidth).toBe(0);
            expect(cell.columnSpan).toBe(1);
            expect(cell.rowSpan).toBe(1);
            expect(cell.verticalAlignment).toBe('Top');

        });
    });
    describe('Border Testing', () => {
        it('constructor testing', () => {
console.log('constructor testing');
            let borderObj: WBorder = new WBorder(undefined);
            borderObj.color = "#000000";
            borderObj.hasNoneStyle = true;
            // expect(borderObj.shadow).toThrowError();
            // expect(borderObj.space).toThrowError();
        });
        it('Border Class Validation', () => {
console.log('Border Class Validation');
            let border: WBorder = new WBorder(undefined);
            border.color;
            border.color = "#000000";
            expect(border.color).toBe('#000000');
            border.lineStyle = 'Dot'; border.lineWidth = 25;
            border.lineStyle, border.lineWidth;
            border.lineStyle = 'None';
            border.getLineWidth();
            border.hasNoneStyle
            expect(() => { border.shadow }).not.toThrowError();
            expect(() => { border.space }).not.toThrowError();
            expect(border.ownerBase).toBe(undefined);
        });
        it('Border Line Spacing validation', () => {
console.log('Border Line Spacing validation');
            let border: WBorder = new WBorder(undefined);
            border.lineStyle = 'Triple';
            border.getLineWidth();
            border.lineStyle = 'Double';
            border.getLineWidth();
            border.lineStyle = 'ThickThinSmallGap';
            border.getLineWidth();
            border.lineStyle = 'ThinThickSmallGap';
            border.getLineWidth();
            border.lineStyle = 'ThinThickThinSmallGap';
            border.getLineWidth();
            border.lineStyle = 'ThinThickMediumGap';
            border.getLineWidth();
            border.lineStyle = 'ThickThinMediumGap';
            border.getLineWidth();
            border.lineStyle = 'ThinThickThinSmallGap';
            border.getLineWidth();
            expect('').toBe('');
        })
    });
    describe('Shading Testing', () => {
        it('constructor testing', () => {
console.log('constructor testing');
            let shading: WShading = new WShading(undefined);
            shading.backgroundColor = '#000000';
            shading.foregroundColor = '#ffffff';
            shading.textureStyle = 'Texture12Pt5Percent';
            expect(shading.backgroundColor).not.toBe(undefined);
            expect(shading.foregroundColor).not.toBe(undefined);
            expect(shading.textureStyle).not.toBe(undefined);
            expect('').toBe('');
        });
    });
    describe(' WBorders Testing', () => {
        it('constructor testing', () => {
console.log('constructor testing');
            let bordersObj: WBorders = new WBorders(undefined);
            bordersObj.left = undefined;
            bordersObj.top = undefined;
            bordersObj.right = undefined;
            bordersObj.bottom = undefined;
            bordersObj.diagonalDown = undefined;
            bordersObj.diagonalUp = undefined;
            bordersObj.horizontal = undefined;
            bordersObj.vertical = undefined;
            expect('').toBe('');
            // expect(bordersObj.ownerRow).toBe(undefined);
        });
    });
});
