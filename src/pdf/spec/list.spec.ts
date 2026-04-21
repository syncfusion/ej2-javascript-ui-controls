import { _PdfContentStream, _PdfStream } from "../src/pdf/core/base-stream";
import { _ContentParser, _PdfRecord } from "../src/pdf/core/content-parser";
import { PdfLayoutBreakType, PdfLayoutType, PdfListMarkerAlignment, PdfNumberStyle, PdfRotationAngle, PdfTextAlignment, PdfUnorderedListStyle } from "../src/pdf/core/enumerator";
import { PdfCjkFontFamily, PdfCjkStandardFont, PdfFontFamily, PdfFontStyle, PdfStandardFont } from "../src/pdf/core/fonts/pdf-standard-font";
import { PdfStringFormat, PdfVerticalAlignment } from "../src/pdf/core/fonts/pdf-string-format";
import { PdfBrush, PdfPen } from "../src/pdf/core/graphics/pdf-graphics";
import { PdfLayoutFormat, PdfLayoutResult } from "../src/pdf/core/graphics/pdf-layouter";
import { PdfList, PdfOrderedList, PdfUnorderedList } from "../src/pdf/core/list/pdf-list";
import { PdfListItem, PdfListItemCollection } from "../src/pdf/core/list/pdf-list-item";
import { PdfDocument, PdfPageSettings } from "../src/pdf/core/pdf-document";
import { PdfPage } from "../src/pdf/core/pdf-page";
import { PdfCrossReferenceType } from "../src/pdf/core/enumerator";
import { _PdfDictionary } from "../src/pdf/core/pdf-primitives";
import { crossReferenceTable } from "./inputs.spec";
describe('PdfDocument Creation List Test', () => {
    it('911760 list pagination rotation issue', () => {
        let document = new PdfDocument();
        let setting: PdfPageSettings = new PdfPageSettings();
        setting.rotation = PdfRotationAngle.angle180;
        let page = document.addPage(setting);
        let list: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT']));
        list.draw(page, { x: 50, y: page.size.height - 100 });
        let update = document.save();
        document = new PdfDocument(update);
        expect(document.pageCount).toEqual(2);
        expect(document.getPage(0).rotation).toEqual(PdfRotationAngle.angle180);
        expect(document.getPage(1).rotation).toEqual(PdfRotationAngle.angle180);
        page = document.getPage(0);
        let appearance = page._pageDictionary.getArray('Contents') as any[];
        expect(appearance).not.toBeUndefined();
        let stream: _PdfContentStream = appearance[2] as _PdfContentStream;
        let parser: _ContentParser = new _ContentParser(stream.getBytes());
        let result = parser._readContent();
        expect(result[0]._operands).toEqual([]);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands).toEqual([]);
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands).toEqual([]);
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands).toEqual([]);
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
        expect(result[7]._operator).toEqual('BT');
        expect(result[7]._operands).toEqual([]);
        expect(result[8]._operator).toEqual('CS');
        expect(result[8]._operands).toEqual(['/DeviceRGB']);
        expect(result[9]._operator).toEqual('cs');
        expect(result[9]._operands).toEqual(['/DeviceRGB']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[11]._operator).toEqual('Tf');
        expect(result[12]._operator).toEqual('Tr');
        expect(result[12]._operands).toEqual(['0']);
        expect(result[13]._operator).toEqual('Tc');
        expect(result[13]._operands).toEqual(['0.000']);
        expect(result[14]._operator).toEqual('Tw');
        expect(result[14]._operands).toEqual(['0.000']);
        expect(result[15]._operator).toEqual('Tz');
        expect(result[15]._operands).toEqual(['100.000']);
        expect(result[16]._operator).toEqual('Tm');
        expect(result[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '76.12', '-749.45']);
        expect(result[17]._operator).toEqual("'");
        expect(result[17]._operands).toEqual(['(PDF)']);
        expect(result[18]._operator).toEqual('ET');
        expect(result[18]._operands).toEqual([]);
        expect(result[19]._operator).toEqual('BT');
        expect(result[19]._operands).toEqual([]);
        expect(result[20]._operator).toEqual('rg');
        expect(result[20]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[21]._operator).toEqual('Tf');
        expect(result[22]._operator).toEqual('Tm');
        expect(result[22]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-749.45']);
        expect(result[23]._operator).toEqual('Td');
        expect(result[23]._operands).toEqual(['4.448', '0.000']);
        expect(result[24]._operator).toEqual("'");
        expect(result[24]._operands).toEqual(['(1.)']);
        expect(result[25]._operator).toEqual('ET');
        expect(result[25]._operands).toEqual([]);
        expect(result[26]._operator).toEqual('BT');
        expect(result[26]._operands).toEqual([]);
        expect(result[27]._operator).toEqual('rg');
        expect(result[27]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[28]._operator).toEqual('Tf');
        expect(result[29]._operator).toEqual('Tm');
        expect(result[29]._operands).toEqual(['1.00', '.00', '.00', '1.00', '76.12', '-758.70']);
        expect(result[30]._operator).toEqual("'");
        expect(result[30]._operands).toEqual(['(XlsIO)']);
        expect(result[31]._operator).toEqual('ET');
        expect(result[31]._operands).toEqual([]);
        expect(result[32]._operator).toEqual('BT');
        expect(result[32]._operands).toEqual([]);
        expect(result[33]._operator).toEqual('rg');
        expect(result[33]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[34]._operator).toEqual('Tf');
        expect(result[35]._operator).toEqual('Tm');
        expect(result[35]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-758.70']);
        expect(result[36]._operator).toEqual('Td');
        expect(result[36]._operands).toEqual(['4.448', '0.000']);
        expect(result[37]._operator).toEqual("'");
        expect(result[37]._operands).toEqual(['(2.)']);
        expect(result[38]._operator).toEqual('ET');
        expect(result[38]._operands).toEqual([]);
        document.destroy();
    });
    it('911762 - list drawing using CJK font', () => {
        let document = new PdfDocument();
        let page = document.addPage();
        let list: PdfList = new PdfOrderedList(new PdfListItemCollection(['这是中文文本', 'これは日本語のテキストです']));
        list.font = new PdfCjkStandardFont(PdfCjkFontFamily.heiseiMinchoW3, 12);
        list.draw(page, { x: 50, y: 50 });
        let update = document.save();
        document = new PdfDocument(update);
        page = document.getPage(0);
        let appearance = page._pageDictionary.getArray('Contents') as any[];
        expect(appearance).not.toBeUndefined();
        let stream: _PdfContentStream = appearance[2] as _PdfContentStream;
        let parser: _ContentParser = new _ContentParser(stream.getBytes());
        let result = parser._readContent();
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands).toEqual([]);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands).toEqual([]);
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands).toEqual([]);
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands).toEqual([]);
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
        expect(result[7]._operator).toEqual('BT');
        expect(result[7]._operands).toEqual([]);
        expect(result[8]._operator).toEqual('CS');
        expect(result[8]._operands).toEqual(['/DeviceRGB']);
        expect(result[9]._operator).toEqual('cs');
        expect(result[9]._operands).toEqual(['/DeviceRGB']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[11]._operator).toEqual('Tf');
        expect(result[12]._operator).toEqual('Tr');
        expect(result[12]._operands).toEqual(['0']);
        expect(result[13]._operator).toEqual('Tc');
        expect(result[13]._operands).toEqual(['0.000']);
        expect(result[14]._operator).toEqual('Tw');
        expect(result[14]._operands).toEqual(['0.000']);
        expect(result[15]._operator).toEqual('Tz');
        expect(result[15]._operands).toEqual(['100.000']);
        expect(result[16]._operator).toEqual('Tm');
        expect(result[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '77.00', '-60.28']);
        expect(result[17]._operator).toEqual("'");
        expect(result[17]._operands).toEqual(['(Ùf/N-eeg,)']);
        expect(result[18]._operator).toEqual('ET');
        expect(result[18]._operands).toEqual([]);
        expect(result[19]._operator).toEqual('BT');
        expect(result[19]._operands).toEqual([]);
        expect(result[20]._operator).toEqual('rg');
        expect(result[20]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[21]._operator).toEqual('Tf');
        expect(result[22]._operator).toEqual('Tm');
        expect(result[22]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-60.28']);
        expect(result[23]._operator).toEqual("'");
        expect(result[24]._operator).toEqual('ET');
        expect(result[24]._operands).toEqual([]);
        expect(result[25]._operator).toEqual('BT');
        expect(result[25]._operands).toEqual([]);
        expect(result[26]._operator).toEqual('rg');
        expect(result[26]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[27]._operator).toEqual('Tf');
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '77.00', '-72.28']);
        expect(result[29]._operator).toEqual("'");
        expect(result[29]._operands).toEqual(['(0S00oeåg,0n0Æ0­0¹0È0g0Y)']);
        expect(result[30]._operator).toEqual('ET');
        expect(result[30]._operands).toEqual([]);
        expect(result[31]._operator).toEqual('BT');
        expect(result[31]._operands).toEqual([]);
        expect(result[32]._operator).toEqual('rg');
        expect(result[32]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[33]._operator).toEqual('Tf');
        expect(result[34]._operator).toEqual('Tm');
        expect(result[34]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-72.28']);
        expect(result[35]._operator).toEqual("'");
        expect(result[36]._operator).toEqual('ET');
        expect(result[36]._operands).toEqual([]);
        document.destroy();
    });
    it('962415 - list drawing with string format', () => {
        let document = new PdfDocument();
        let page = document.addPage();
        let items = new PdfListItemCollection(['Items 1', 'Items 2', 'Items 3', 'Items 4']);
        let listCombination1 = new PdfOrderedList(items);
        listCombination1.style = PdfNumberStyle.numeric;
        listCombination1.startNumber = 5;
        listCombination1.stringFormat = new PdfStringFormat(PdfTextAlignment.center);
        listCombination1.draw(page, { x: 50, y: 50 });
        let update = document.save();
        document = new PdfDocument(update);
        page = document.getPage(0);
        let appearance = page._pageDictionary.getArray('Contents') as any[];
        expect(appearance).not.toBeUndefined();
        let stream: _PdfContentStream = appearance[2] as _PdfContentStream;
        let parser: _ContentParser = new _ContentParser(stream.getBytes());
        let result = parser._readContent();
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands).toEqual([]);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands).toEqual([]);
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands).toEqual([]);
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands).toEqual([]);
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
        expect(result[7]._operator).toEqual('BT');
        expect(result[7]._operands).toEqual([]);
        expect(result[8]._operator).toEqual('CS');
        expect(result[8]._operands).toEqual(['/DeviceRGB']);
        expect(result[9]._operator).toEqual('cs');
        expect(result[9]._operands).toEqual(['/DeviceRGB']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[11]._operator).toEqual('Tf');
        expect(result[12]._operator).toEqual('Tr');
        expect(result[12]._operands).toEqual(['0']);
        expect(result[13]._operator).toEqual('Tc');
        expect(result[13]._operands).toEqual(['0.000']);
        expect(result[14]._operator).toEqual('Tw');
        expect(result[14]._operands).toEqual(['0.000']);
        expect(result[15]._operator).toEqual('Tz');
        expect(result[15]._operands).toEqual(['100.000']);
        expect(result[16]._operator).toEqual('Tm');
        expect(result[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '76.12', '-57.45']);
        expect(result[17]._operator).toEqual('Td');
        expect(result[17]._operands).toEqual(['206.324', '0.000']);
        expect(result[18]._operator).toEqual("'");
        expect(result[18]._operands).toEqual(['(Items 1)']);
        expect(result[19]._operator).toEqual('ET');
        expect(result[19]._operands).toEqual([]);
        expect(result[20]._operator).toEqual('BT');
        expect(result[20]._operands).toEqual([]);
        expect(result[21]._operator).toEqual('rg');
        expect(result[21]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[22]._operator).toEqual('Tf');
        expect(result[23]._operator).toEqual('Tm');
        expect(result[23]._operands).toEqual(['1.00', '.00', '.00', '1.00', '266.32', '-57.45']);
        expect(result[24]._operator).toEqual('Td');
        expect(result[24]._operands).toEqual(['2.224', '0.000']);
        expect(result[25]._operator).toEqual("'");
        expect(result[25]._operands).toEqual(['(5.)']);
        expect(result[26]._operator).toEqual('ET');
        expect(result[26]._operands).toEqual([]);
        expect(result[27]._operator).toEqual('BT');
        expect(result[27]._operands).toEqual([]);
        expect(result[28]._operator).toEqual('rg');
        expect(result[28]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[29]._operator).toEqual('Tf');
        expect(result[30]._operator).toEqual('Tm');
        expect(result[30]._operands).toEqual(['1.00', '.00', '.00', '1.00', '76.12', '-66.70']);
        expect(result[31]._operator).toEqual('Td');
        expect(result[31]._operands).toEqual(['206.324', '0.000']);
        expect(result[32]._operator).toEqual("'");
        expect(result[32]._operands).toEqual(['(Items 2)']);
        expect(result[33]._operator).toEqual('ET');
        expect(result[33]._operands).toEqual([]);
        expect(result[34]._operator).toEqual('BT');
        expect(result[34]._operands).toEqual([]);
        expect(result[35]._operator).toEqual('rg');
        expect(result[35]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[36]._operator).toEqual('Tf');
        expect(result[37]._operator).toEqual('Tm');
        expect(result[37]._operands).toEqual(['1.00', '.00', '.00', '1.00', '266.32', '-66.70']);
        expect(result[38]._operator).toEqual('Td');
        expect(result[38]._operands).toEqual(['2.224', '0.000']);
        expect(result[39]._operator).toEqual("'");
        expect(result[39]._operands).toEqual(['(6.)']);
        expect(result[40]._operator).toEqual('ET');
        expect(result[40]._operands).toEqual([]);
        expect(result[41]._operator).toEqual('BT');
        expect(result[41]._operands).toEqual([]);
        expect(result[42]._operator).toEqual('rg');
        expect(result[42]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[43]._operator).toEqual('Tf');
        expect(result[44]._operator).toEqual('Tm');
        expect(result[44]._operands).toEqual(['1.00', '.00', '.00', '1.00', '76.12', '-75.94']);
        expect(result[45]._operator).toEqual('Td');
        expect(result[45]._operands).toEqual(['206.324', '0.000']);
        expect(result[46]._operator).toEqual("'");
        expect(result[46]._operands).toEqual(['(Items 3)']);
        expect(result[47]._operator).toEqual('ET');
        expect(result[47]._operands).toEqual([]);
        expect(result[48]._operator).toEqual('BT');
        expect(result[48]._operands).toEqual([]);
        expect(result[49]._operator).toEqual('rg');
        expect(result[49]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[50]._operator).toEqual('Tf');
        expect(result[51]._operator).toEqual('Tm');
        expect(result[51]._operands).toEqual(['1.00', '.00', '.00', '1.00', '266.32', '-75.94']);
        expect(result[52]._operator).toEqual('Td');
        expect(result[52]._operands).toEqual(['2.224', '0.000']);
        expect(result[53]._operator).toEqual("'");
        expect(result[53]._operands).toEqual(['(7.)']);
        expect(result[54]._operator).toEqual('ET');
        expect(result[54]._operands).toEqual([]);
        expect(result[55]._operator).toEqual('BT');
        expect(result[55]._operands).toEqual([]);
        expect(result[56]._operator).toEqual('rg');
        expect(result[56]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[57]._operator).toEqual('Tf');
        expect(result[58]._operator).toEqual('Tm');
        expect(result[58]._operands).toEqual(['1.00', '.00', '.00', '1.00', '76.12', '-85.19']);
        expect(result[59]._operator).toEqual('Td');
        expect(result[59]._operands).toEqual(['206.324', '0.000']);
        expect(result[60]._operator).toEqual("'");
        expect(result[60]._operands).toEqual(['(Items 4)']);
        expect(result[61]._operator).toEqual('ET');
        expect(result[61]._operands).toEqual([]);
        expect(result[62]._operator).toEqual('BT');
        expect(result[62]._operands).toEqual([]);
        expect(result[63]._operator).toEqual('rg');
        expect(result[63]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[64]._operator).toEqual('Tf');
        expect(result[65]._operator).toEqual('Tm');
        expect(result[65]._operands).toEqual(['1.00', '.00', '.00', '1.00', '266.32', '-85.19']);
        expect(result[66]._operator).toEqual('Td');
        expect(result[66]._operands).toEqual(['2.224', '0.000']);
        expect(result[67]._operator).toEqual("'");
        expect(result[67]._operands).toEqual(['(8.)']);
        expect(result[68]._operator).toEqual('ET');
        expect(result[68]._operands).toEqual([]);
        document.destroy();
    });
    it('list drawing with insert method', () => {
    let document = new PdfDocument();
    let setting: PdfPageSettings = new PdfPageSettings();
    setting.rotation = PdfRotationAngle.angle180;
    let page = document.addPage(setting);
    let list: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT']));
    let item: PdfListItem = new PdfListItem('PDF');
    list.items.insert(1, item, 40);
    list.draw(page, { x: 50, y: page.size.height - 100 });
    let update = document.save();
    document = new PdfDocument(update);
    expect(document.pageCount).toEqual(2);
    expect(document.getPage(0).rotation).toEqual(PdfRotationAngle.angle180);
    expect(document.getPage(1).rotation).toEqual(PdfRotationAngle.angle180);
    page = document.getPage(0);
    let appearance = page._pageDictionary.getArray('Contents') as any[];
    expect(appearance).not.toBeUndefined();
    let stream: _PdfContentStream = appearance[2] as _PdfContentStream;
    let parser: _ContentParser = new _ContentParser(stream.getBytes());
    let result = parser._readContent();
    expect(result[0]._operator).toEqual('q');
    expect(result[0]._operands).toEqual([]);
    expect(result[1]._operator).toEqual('cm');
    expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
    expect(result[2]._operator).toEqual('re');
    expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
    expect(result[3]._operator).toEqual('h');
    expect(result[3]._operands).toEqual([]);
    expect(result[4]._operator).toEqual('W');
    expect(result[4]._operands).toEqual([]);
    expect(result[5]._operator).toEqual('n');
    expect(result[5]._operands).toEqual([]);
    expect(result[6]._operator).toEqual('cm');
    expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
    expect(result[7]._operator).toEqual('BT');
    expect(result[7]._operands).toEqual([]);
    expect(result[8]._operator).toEqual('CS');
    expect(result[8]._operands).toEqual(['/DeviceRGB']);
    expect(result[9]._operator).toEqual('cs');
    expect(result[9]._operands).toEqual(['/DeviceRGB']);
    expect(result[10]._operator).toEqual('rg');
    expect(result[10]._operands).toEqual(['0.000', '0.000', '0.000']);
    expect(result[11]._operator).toEqual('Tf');
    expect(result[12]._operator).toEqual('Tr');
    expect(result[12]._operands).toEqual(['0']);
    expect(result[13]._operator).toEqual('Tc');
    expect(result[13]._operands).toEqual(['0.000']);
    expect(result[14]._operator).toEqual('Tw');
    expect(result[14]._operands).toEqual(['0.000']);
    expect(result[15]._operator).toEqual('Tz');
    expect(result[15]._operands).toEqual(['100.000']);
    expect(result[16]._operator).toEqual('Tm');
    expect(result[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '76.12', '-749.45']);
    expect(result[17]._operator).toEqual("'");
    expect(result[17]._operands).toEqual(['(PDF)']);
    expect(result[18]._operator).toEqual('ET');
    expect(result[18]._operands).toEqual([]);
    expect(result[19]._operator).toEqual('BT');
    expect(result[19]._operands).toEqual([]);
    expect(result[20]._operator).toEqual('rg');
    expect(result[20]._operands).toEqual(['0.000', '0.000', '0.000']);
    expect(result[21]._operator).toEqual('Tf');
    expect(result[22]._operator).toEqual('Tm');
    expect(result[22]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-749.45']);
    expect(result[23]._operator).toEqual('Td');
    expect(result[23]._operands).toEqual(['4.448', '0.000']);
    expect(result[24]._operator).toEqual("'");
    expect(result[24]._operands).toEqual(['(1.)']);
    expect(result[25]._operator).toEqual('ET');
    expect(result[25]._operands).toEqual([]);
    expect(result[26]._operator).toEqual('BT');
    expect(result[26]._operands).toEqual([]);
    expect(result[27]._operator).toEqual('rg');
    expect(result[27]._operands).toEqual(['0.000', '0.000', '0.000']);
    expect(result[28]._operator).toEqual('Tf');
    expect(result[29]._operator).toEqual('Tm');
    expect(result[29]._operands).toEqual(['1.00', '.00', '.00', '1.00', '111.12', '-758.70']);
    expect(result[30]._operator).toEqual("'");
    expect(result[30]._operands).toEqual(['(PDF)']);
    expect(result[31]._operator).toEqual('ET');
    expect(result[31]._operands).toEqual([]);
    expect(result[32]._operator).toEqual('BT');
    expect(result[32]._operands).toEqual([]);
    expect(result[33]._operator).toEqual('rg');
    expect(result[33]._operands).toEqual(['0.000', '0.000', '0.000']);
    expect(result[34]._operator).toEqual('Tf');
    expect(result[35]._operator).toEqual('Tm');
    expect(result[35]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-758.70']);
    expect(result[36]._operator).toEqual('Td');
    expect(result[36]._operands).toEqual(['4.448', '0.000']);
    expect(result[37]._operator).toEqual("'");
    expect(result[37]._operands).toEqual(['(2.)']);
    expect(result[38]._operator).toEqual('ET');
    expect(result[38]._operands).toEqual([]);
    document.destroy();
});
});
describe('911761 - basic testing', () => {
    it('911761 - list drawing in rotated page', () => {
        let document: PdfDocument = new PdfDocument();
        const rotations = [
            PdfRotationAngle.angle0,
            PdfRotationAngle.angle90,
            PdfRotationAngle.angle180,
            PdfRotationAngle.angle270
        ];
        for (const rotation of rotations) {
            let setting: PdfPageSettings = new PdfPageSettings();
            setting.rotation = rotation;
            let page: PdfPage = document.addPage(setting);
            let redPen = new PdfPen({ r: 255, g: 0, b: 0 }, 1);
            let greenPen = new PdfPen({ r: 0, g: 255, b: 0 }, 1);
            let bluePen = new PdfPen({ r: 0, g: 0, b: 255 }, 1);
            let items: PdfListItemCollection = new PdfListItemCollection(['Items 1', 'Items 2', 'Items 3', 'Items 4']);
            let list6: PdfList = new PdfOrderedList(items, { pen: redPen });
            list6.textIndent = 2;
            expect(list6.textIndent).toEqual(2);
            list6.draw(page, { x: 50, y: 50 });
            let list7: PdfList = new PdfUnorderedList(items, { pen: greenPen });
            list7.textIndent = 2;
            expect(list7.textIndent).toEqual(2);
            list7.draw(page, { x: 150, y: 50 });
            let list33: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { pen: bluePen });
            let subList1: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF.Base', 'PDF.Portable', 'Flutter', 'EJ2']));
            expect(list33.items.at(0).subList).toBeUndefined();
            list33.items.at(0).subList = subList1;
            expect(list33.items.at(0).subList.items.count).toEqual(4);
            list33.draw(page, { x: 50, y: 100 });
            let list36: PdfOrderedList = new PdfOrderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']));
            list36.style = PdfNumberStyle.upperLatin;
            list36.draw(page, { x: 50, y: 200 });
            let mainList: PdfOrderedList = new PdfOrderedList(new PdfListItemCollection(['Main Item 1', 'Main Item 2', 'Main Item 3', 'Main Item 4']), { pen: redPen });
            mainList.textIndent = 2;
            expect(mainList.textIndent).toEqual(2);
            let subList: PdfUnorderedList = new PdfUnorderedList(new PdfListItemCollection(['Sub Item 1', 'Sub Item 2', 'Sub Item 3', 'Sub Item 4']), { pen: greenPen });
            expect(mainList.items.at(0).subList).toBeUndefined();
            mainList.items.at(0).subList = subList;
            expect(mainList.items.at(0).subList.items.count).toEqual(4);
            let subSubList: PdfUnorderedList = new PdfUnorderedList(new PdfListItemCollection(['Sub-sub Item 1', 'Sub-sub Item 2']), { pen: bluePen });
            expect(subList.items.at(0).subList).toBeUndefined();
            subList.items.at(0).subList = subSubList;
            expect(subList.items.at(0).subList.items.count).toEqual(2);
            mainList.draw(page, { x: 50, y: 400 });
            let list: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT']));
            list.draw(page, { x: 50, y: page.size.height - 100 });
            let list1: PdfList = new PdfOrderedList(new PdfListItemCollection(['A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.']));
            let result: PdfLayoutResult = list1.draw(page, { x: 180, y: page.size.height - 100 });
            let list2: PdfList = new PdfUnorderedList(new PdfListItemCollection(['A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.']));
            result = list2.draw(result.Page, { x: 180, y: result.Page.size.height - 100 });
            let list3: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT']));
            list3.draw(result.Page, { x: 50, y: result.Page.size.height - 100 });
        }
        let update = document.save();
        document = new PdfDocument(update);
        let page = document.getPage(0);
        expect(document.pageCount).toEqual(16)
        expect(page.rotation).toEqual(0);
        let appearance = page._pageDictionary.getArray('Contents') as any[];
        expect(appearance).not.toBeUndefined();
        let stream: _PdfStream = appearance[2] as _PdfStream;
        let parser: _ContentParser = new _ContentParser(stream.getBytes());
        let result = parser._readContent();
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands).toEqual([]);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands).toEqual([]);
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands).toEqual([]);
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands).toEqual([]);
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
        expect(result[7]._operator).toEqual('BT');
        expect(result[7]._operands).toEqual([]);
        expect(result[8]._operator).toEqual('CS');
        expect(result[8]._operands).toEqual(['/DeviceRGB']);
        expect(result[9]._operator).toEqual('cs');
        expect(result[9]._operands).toEqual(['/DeviceRGB']);
        expect(result[10]._operator).toEqual('d');
        expect(result[10]._operands).toEqual(['[]', '0']);
        expect(result[11]._operator).toEqual('w');
        expect(result[11]._operands).toEqual(['1.000']);
        expect(result[12]._operator).toEqual('j');
        expect(result[12]._operands).toEqual(['0']);
        expect(result[13]._operator).toEqual('J');
        expect(result[13]._operands).toEqual(['0']);
        expect(result[14]._operator).toEqual('RG');
        expect(result[14]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[15]._operator).toEqual('rg');
        expect(result[15]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[16]._operator).toEqual('Tf');
        expect(result[17]._operator).toEqual('Tr');
        expect(result[17]._operands).toEqual(['2']);
        expect(result[18]._operator).toEqual('Tc');
        expect(result[18]._operands).toEqual(['0.000']);
        expect(result[19]._operator).toEqual('Tw');
        expect(result[19]._operands).toEqual(['0.000']);
        expect(result[20]._operator).toEqual('Tz');
        expect(result[20]._operands).toEqual(['100.000']);
        expect(result[21]._operator).toEqual('Tm');
        expect(result[21]._operands).toEqual(['1.00', '.00', '.00', '1.00', '68.67', '-57.45']);
        expect(result[22]._operator).toEqual("'");
        expect(result[22]._operands).toEqual(['(Items 1)']);
        expect(result[23]._operator).toEqual('ET');
        expect(result[23]._operands).toEqual([]);
        expect(result[24]._operator).toEqual('BT');
        expect(result[24]._operands).toEqual([]);
        expect(result[25]._operator).toEqual('d');
        expect(result[25]._operands).toEqual(['[]', '0']);
        expect(result[26]._operator).toEqual('w');
        expect(result[26]._operands).toEqual(['1.000']);
        expect(result[27]._operator).toEqual('j');
        expect(result[27]._operands).toEqual(['0']);
        expect(result[28]._operator).toEqual('J');
        expect(result[28]._operands).toEqual(['0']);
        expect(result[29]._operator).toEqual('RG');
        expect(result[29]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[30]._operator).toEqual('rg');
        expect(result[30]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[31]._operator).toEqual('Tf');
        expect(result[32]._operator).toEqual('Tm');
        expect(result[32]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-57.45']);
        expect(result[33]._operator).toEqual("'");
        expect(result[33]._operands).toEqual(['(1.)']);
        expect(result[34]._operator).toEqual('ET');
        expect(result[34]._operands).toEqual([]);
        expect(result[35]._operator).toEqual('BT');
        expect(result[35]._operands).toEqual([]);
        expect(result[36]._operator).toEqual('d');
        expect(result[36]._operands).toEqual(['[]', '0']);
        expect(result[37]._operator).toEqual('w');
        expect(result[37]._operands).toEqual(['1.000']);
        expect(result[38]._operator).toEqual('j');
        expect(result[38]._operands).toEqual(['0']);
        expect(result[39]._operator).toEqual('J');
        expect(result[39]._operands).toEqual(['0']);
        expect(result[40]._operator).toEqual('RG');
        expect(result[40]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[41]._operator).toEqual('rg');
        expect(result[41]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[42]._operator).toEqual('Tf');
        expect(result[43]._operator).toEqual('Tm');
        expect(result[43]._operands).toEqual(['1.00', '.00', '.00', '1.00', '68.67', '-66.70']);
        expect(result[44]._operator).toEqual("'");
        expect(result[44]._operands).toEqual(['(Items 2)']);
        expect(result[45]._operator).toEqual('ET');
        expect(result[45]._operands).toEqual([]);
        expect(result[46]._operator).toEqual('BT');
        expect(result[46]._operands).toEqual([]);
        expect(result[47]._operator).toEqual('d');
        expect(result[47]._operands).toEqual(['[]', '0']);
        expect(result[48]._operator).toEqual('w');
        expect(result[48]._operands).toEqual(['1.000']);
        expect(result[49]._operator).toEqual('j');
        expect(result[49]._operands).toEqual(['0']);
        expect(result[50]._operator).toEqual('J');
        expect(result[50]._operands).toEqual(['0']);
        expect(result[51]._operator).toEqual('RG');
        expect(result[51]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[52]._operator).toEqual('rg');
        expect(result[52]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[53]._operator).toEqual('Tf');
        expect(result[54]._operator).toEqual('Tm');
        expect(result[54]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-66.70']);
        expect(result[55]._operator).toEqual("'");
        expect(result[55]._operands).toEqual(['(2.)']);
        expect(result[56]._operator).toEqual('ET');
        expect(result[56]._operands).toEqual([]);
        expect(result[57]._operator).toEqual('BT');
        expect(result[57]._operands).toEqual([]);
        expect(result[58]._operator).toEqual('d');
        expect(result[58]._operands).toEqual(['[]', '0']);
        expect(result[59]._operator).toEqual('w');
        expect(result[59]._operands).toEqual(['1.000']);
        expect(result[60]._operator).toEqual('j');
        expect(result[60]._operands).toEqual(['0']);
        expect(result[61]._operator).toEqual('J');
        expect(result[61]._operands).toEqual(['0']);
        expect(result[62]._operator).toEqual('RG');
        expect(result[62]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[63]._operator).toEqual('rg');
        expect(result[63]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[64]._operator).toEqual('Tf');
        expect(result[65]._operator).toEqual('Tm');
        expect(result[65]._operands).toEqual(['1.00', '.00', '.00', '1.00', '68.67', '-75.94']);
        expect(result[66]._operator).toEqual("'");
        expect(result[66]._operands).toEqual(['(Items 3)']);
        expect(result[67]._operator).toEqual('ET');
        expect(result[67]._operands).toEqual([]);
        expect(result[68]._operator).toEqual('BT');
        expect(result[68]._operands).toEqual([]);
        expect(result[69]._operator).toEqual('d');
        expect(result[69]._operands).toEqual(['[]', '0']);
        expect(result[70]._operator).toEqual('w');
        expect(result[70]._operands).toEqual(['1.000']);
        expect(result[71]._operator).toEqual('j');
        expect(result[71]._operands).toEqual(['0']);
        expect(result[72]._operator).toEqual('J');
        expect(result[72]._operands).toEqual(['0']);
        expect(result[73]._operator).toEqual('RG');
        expect(result[73]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[74]._operator).toEqual('rg');
        expect(result[74]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[75]._operator).toEqual('Tf');
        expect(result[76]._operator).toEqual('Tm');
        expect(result[76]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-75.94']);
        expect(result[77]._operator).toEqual("'");
        expect(result[77]._operands).toEqual(['(3.)']);
        expect(result[78]._operator).toEqual('ET');
        expect(result[78]._operands).toEqual([]);
        expect(result[79]._operator).toEqual('BT');
        expect(result[79]._operands).toEqual([]);
        expect(result[80]._operator).toEqual('d');
        expect(result[80]._operands).toEqual(['[]', '0']);
        expect(result[81]._operator).toEqual('w');
        expect(result[81]._operands).toEqual(['1.000']);
        expect(result[82]._operator).toEqual('j');
        expect(result[82]._operands).toEqual(['0']);
        expect(result[83]._operator).toEqual('J');
        expect(result[83]._operands).toEqual(['0']);
        expect(result[84]._operator).toEqual('RG');
        expect(result[84]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[85]._operator).toEqual('rg');
        expect(result[85]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[86]._operator).toEqual('Tf');
        expect(result[87]._operator).toEqual('Tm');
        expect(result[87]._operands).toEqual(['1.00', '.00', '.00', '1.00', '68.67', '-85.19']);
        expect(result[88]._operator).toEqual("'");
        expect(result[88]._operands).toEqual(['(Items 4)']);
        expect(result[89]._operator).toEqual('ET');
        expect(result[89]._operands).toEqual([]);
        expect(result[90]._operator).toEqual('BT');
        expect(result[90]._operands).toEqual([]);
        expect(result[91]._operator).toEqual('d');
        expect(result[91]._operands).toEqual(['[]', '0']);
        expect(result[92]._operator).toEqual('w');
        expect(result[92]._operands).toEqual(['1.000']);
        expect(result[93]._operator).toEqual('j');
        expect(result[93]._operands).toEqual(['0']);
        expect(result[94]._operator).toEqual('J');
        expect(result[94]._operands).toEqual(['0']);
        expect(result[95]._operator).toEqual('RG');
        expect(result[95]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[96]._operator).toEqual('rg');
        expect(result[96]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[97]._operator).toEqual('Tf');
        expect(result[98]._operator).toEqual('Tm');
        expect(result[98]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-85.19']);
        expect(result[99]._operator).toEqual("'");
        expect(result[99]._operands).toEqual(['(4.)']);
        expect(result[100]._operator).toEqual('ET');
        expect(result[100]._operands).toEqual([]);
        expect(result[101]._operator).toEqual('BT');
        expect(result[101]._operands).toEqual([]);
        expect(result[102]._operator).toEqual('d');
        expect(result[102]._operands).toEqual(['[]', '0']);
        expect(result[103]._operator).toEqual('w');
        expect(result[103]._operands).toEqual(['1.000']);
        expect(result[104]._operator).toEqual('j');
        expect(result[104]._operands).toEqual(['0']);
        expect(result[105]._operator).toEqual('J');
        expect(result[105]._operands).toEqual(['0']);
        expect(result[106]._operator).toEqual('RG');
        expect(result[106]._operands).toEqual(['0.000', '1.000', '0.000']);
        expect(result[107]._operator).toEqual('rg');
        expect(result[107]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[108]._operator).toEqual('Tf');
        expect(result[109]._operator).toEqual('Tm');
        expect(result[109]._operands).toEqual(['1.00', '.00', '.00', '1.00', '170.33', '-57.45']);
        expect(result[110]._operator).toEqual("'");
        expect(result[110]._operands).toEqual(['(Items 1)']);
        expect(result[111]._operator).toEqual('ET');
        expect(result[111]._operands).toEqual([]);
        expect(result[112]._operator).toEqual('q');
        expect(result[112]._operands).toEqual([]);
        expect(result[113]._operator).toEqual('cm');
        expect(result[113]._operands).toEqual(['1.00', '.00', '.00', '1.00', '160.00', '-59.70']);
        expect(result[114]._operator).toEqual('Do');
        expect(result[115]._operator).toEqual('Q');
        expect(result[115]._operands).toEqual([]);
        expect(result[116]._operator).toEqual('BT');
        expect(result[116]._operands).toEqual([]);
        expect(result[117]._operator).toEqual('d');
        expect(result[117]._operands).toEqual(['[]', '0']);
        expect(result[118]._operator).toEqual('w');
        expect(result[118]._operands).toEqual(['1.000']);
        expect(result[119]._operator).toEqual('j');
        expect(result[119]._operands).toEqual(['0']);
        expect(result[120]._operator).toEqual('J');
        expect(result[120]._operands).toEqual(['0']);
        expect(result[121]._operator).toEqual('RG');
        expect(result[121]._operands).toEqual(['0.000', '1.000', '0.000']);
        expect(result[122]._operator).toEqual('rg');
        expect(result[122]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[123]._operator).toEqual('Tf');
        expect(result[124]._operator).toEqual('Tm');
        expect(result[124]._operands).toEqual(['1.00', '.00', '.00', '1.00', '170.33', '-67.15']);
        expect(result[125]._operator).toEqual("'");
        expect(result[125]._operands).toEqual(['(Items 2)']);
        expect(result[126]._operator).toEqual('ET');
        expect(result[126]._operands).toEqual([]);
        expect(result[127]._operator).toEqual('q');
        expect(result[127]._operands).toEqual([]);
        expect(result[128]._operator).toEqual('cm');
        expect(result[128]._operands).toEqual(['1.00', '.00', '.00', '1.00', '160.00', '-69.41']);
        expect(result[129]._operator).toEqual('Do');
        expect(result[130]._operator).toEqual('Q');
        expect(result[130]._operands).toEqual([]);
        expect(result[131]._operator).toEqual('BT');
        expect(result[131]._operands).toEqual([]);
        expect(result[132]._operator).toEqual('d');
        expect(result[132]._operands).toEqual(['[]', '0']);
        expect(result[133]._operator).toEqual('w');
        expect(result[133]._operands).toEqual(['1.000']);
        expect(result[134]._operator).toEqual('j');
        expect(result[134]._operands).toEqual(['0']);
        expect(result[135]._operator).toEqual('J');
        expect(result[135]._operands).toEqual(['0']);
        expect(result[136]._operator).toEqual('RG');
        expect(result[136]._operands).toEqual(['0.000', '1.000', '0.000']);
        expect(result[137]._operator).toEqual('rg');
        expect(result[137]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[138]._operator).toEqual('Tf');
        expect(result[139]._operator).toEqual('Tm');
        expect(result[139]._operands).toEqual(['1.00', '.00', '.00', '1.00', '170.33', '-76.86']);
        expect(result[140]._operator).toEqual("'");
        expect(result[140]._operands).toEqual(['(Items 3)']);
        expect(result[141]._operator).toEqual('ET');
        expect(result[141]._operands).toEqual([]);
        expect(result[142]._operator).toEqual('q');
        expect(result[142]._operands).toEqual([]);
        expect(result[143]._operator).toEqual('cm');
        expect(result[143]._operands).toEqual(['1.00', '.00', '.00', '1.00', '160.00', '-79.11']);
        expect(result[144]._operator).toEqual('Do');
        expect(result[145]._operator).toEqual('Q');
        expect(result[145]._operands).toEqual([]);
        expect(result[146]._operator).toEqual('BT');
        expect(result[146]._operands).toEqual([]);
        expect(result[147]._operator).toEqual('d');
        expect(result[147]._operands).toEqual(['[]', '0']);
        expect(result[148]._operator).toEqual('w');
        expect(result[148]._operands).toEqual(['1.000']);
        expect(result[149]._operator).toEqual('j');
        expect(result[149]._operands).toEqual(['0']);
        expect(result[150]._operator).toEqual('J');
        expect(result[150]._operands).toEqual(['0']);
        expect(result[151]._operator).toEqual('RG');
        expect(result[151]._operands).toEqual(['0.000', '1.000', '0.000']);
        expect(result[152]._operator).toEqual('rg');
        expect(result[152]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[153]._operator).toEqual('Tf');
        expect(result[154]._operator).toEqual('Tm');
        expect(result[154]._operands).toEqual(['1.00', '.00', '.00', '1.00', '170.33', '-86.56']);
        expect(result[155]._operator).toEqual("'");
        expect(result[155]._operands).toEqual(['(Items 4)']);
        expect(result[156]._operator).toEqual('ET');
        expect(result[156]._operands).toEqual([]);
        expect(result[157]._operator).toEqual('q');
        expect(result[157]._operands).toEqual([]);
        expect(result[158]._operator).toEqual('cm');
        expect(result[158]._operands).toEqual(['1.00', '.00', '.00', '1.00', '160.00', '-88.82']);
        expect(result[159]._operator).toEqual('Do');
        expect(result[160]._operator).toEqual('Q');
        expect(result[160]._operands).toEqual([]);
        expect(result[161]._operator).toEqual('BT');
        expect(result[161]._operands).toEqual([]);
        expect(result[162]._operator).toEqual('d');
        expect(result[162]._operands).toEqual(['[]', '0']);
        expect(result[163]._operator).toEqual('w');
        expect(result[163]._operands).toEqual(['1.000']);
        expect(result[164]._operator).toEqual('j');
        expect(result[164]._operands).toEqual(['0']);
        expect(result[165]._operator).toEqual('J');
        expect(result[165]._operands).toEqual(['0']);
        expect(result[166]._operator).toEqual('RG');
        expect(result[166]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[167]._operator).toEqual('rg');
        expect(result[167]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[168]._operator).toEqual('Tf');
        expect(result[169]._operator).toEqual('Tm');
        expect(result[169]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.67', '-107.45']);
        expect(result[170]._operator).toEqual("'");
        expect(result[170]._operands).toEqual(['(PDF)']);
        expect(result[171]._operator).toEqual('ET');
        expect(result[171]._operands).toEqual([]);
        expect(result[172]._operator).toEqual('BT');
        expect(result[172]._operands).toEqual([]);
        expect(result[173]._operator).toEqual('d');
        expect(result[173]._operands).toEqual(['[]', '0']);
        expect(result[174]._operator).toEqual('w');
        expect(result[174]._operands).toEqual(['1.000']);
        expect(result[175]._operator).toEqual('j');
        expect(result[175]._operands).toEqual(['0']);
        expect(result[176]._operator).toEqual('J');
        expect(result[176]._operands).toEqual(['0']);
        expect(result[177]._operator).toEqual('RG');
        expect(result[177]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[178]._operator).toEqual('rg');
        expect(result[178]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[179]._operator).toEqual('Tf');
        expect(result[180]._operator).toEqual('Tm');
        expect(result[180]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-107.45']);
        expect(result[181]._operator).toEqual("'");
        expect(result[181]._operands).toEqual(['(1.)']);
        expect(result[182]._operator).toEqual('ET');
        expect(result[182]._operands).toEqual([]);
        expect(result[183]._operator).toEqual('BT');
        expect(result[183]._operands).toEqual([]);
        expect(result[184]._operator).toEqual('d');
        expect(result[184]._operands).toEqual(['[]', '0']);
        expect(result[185]._operator).toEqual('w');
        expect(result[185]._operands).toEqual(['1.000']);
        expect(result[186]._operator).toEqual('j');
        expect(result[186]._operands).toEqual(['0']);
        expect(result[187]._operator).toEqual('J');
        expect(result[187]._operands).toEqual(['0']);
        expect(result[188]._operator).toEqual('RG');
        expect(result[188]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[189]._operator).toEqual('rg');
        expect(result[189]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[190]._operator).toEqual('Tf');
        expect(result[191]._operator).toEqual('Tm');
        expect(result[191]._operands).toEqual(['1.00', '.00', '.00', '1.00', '81.67', '-116.70']);
        expect(result[192]._operator).toEqual("'");
        expect(result[192]._operands).toEqual(['(PDF.Base)']);
        expect(result[193]._operator).toEqual('ET');
        expect(result[193]._operands).toEqual([]);
        expect(result[194]._operator).toEqual('BT');
        expect(result[194]._operands).toEqual([]);
        expect(result[195]._operator).toEqual('d');
        expect(result[195]._operands).toEqual(['[]', '0']);
        expect(result[196]._operator).toEqual('w');
        expect(result[196]._operands).toEqual(['1.000']);
        expect(result[197]._operator).toEqual('j');
        expect(result[197]._operands).toEqual(['0']);
        expect(result[198]._operator).toEqual('J');
        expect(result[198]._operands).toEqual(['0']);
        expect(result[199]._operator).toEqual('RG');
        expect(result[199]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[200]._operator).toEqual('rg');
        expect(result[200]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[201]._operator).toEqual('Tf');
        expect(result[202]._operator).toEqual('Tm');
        expect(result[202]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-116.70']);
        expect(result[203]._operator).toEqual("'");
        expect(result[203]._operands).toEqual(['(1.)']);
        expect(result[204]._operator).toEqual('ET');
        expect(result[204]._operands).toEqual([]);
        expect(result[205]._operator).toEqual('BT');
        expect(result[205]._operands).toEqual([]);
        expect(result[206]._operator).toEqual('d');
        expect(result[206]._operands).toEqual(['[]', '0']);
        expect(result[207]._operator).toEqual('w');
        expect(result[207]._operands).toEqual(['1.000']);
        expect(result[208]._operator).toEqual('j');
        expect(result[208]._operands).toEqual(['0']);
        expect(result[209]._operator).toEqual('J');
        expect(result[209]._operands).toEqual(['0']);
        expect(result[210]._operator).toEqual('RG');
        expect(result[210]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[211]._operator).toEqual('rg');
        expect(result[211]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[212]._operator).toEqual('Tf');
        expect(result[213]._operator).toEqual('Tm');
        expect(result[213]._operands).toEqual(['1.00', '.00', '.00', '1.00', '81.67', '-125.94']);
        expect(result[214]._operator).toEqual("'");
        expect(result[214]._operands).toEqual(['(PDF.Portable)']);
        expect(result[215]._operator).toEqual('ET');
        expect(result[215]._operands).toEqual([]);
        expect(result[216]._operator).toEqual('BT');
        expect(result[216]._operands).toEqual([]);
        expect(result[217]._operator).toEqual('d');
        expect(result[217]._operands).toEqual(['[]', '0']);
        expect(result[218]._operator).toEqual('w');
        expect(result[218]._operands).toEqual(['1.000']);
        expect(result[219]._operator).toEqual('j');
        expect(result[219]._operands).toEqual(['0']);
        expect(result[220]._operator).toEqual('J');
        expect(result[220]._operands).toEqual(['0']);
        expect(result[221]._operator).toEqual('RG');
        expect(result[221]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[222]._operator).toEqual('rg');
        expect(result[222]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[223]._operator).toEqual('Tf');
        expect(result[224]._operator).toEqual('Tm');
        expect(result[224]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-125.94']);
        expect(result[225]._operator).toEqual("'");
        expect(result[225]._operands).toEqual(['(2.)']);
        expect(result[226]._operator).toEqual('ET');
        expect(result[226]._operands).toEqual([]);
        expect(result[227]._operator).toEqual('BT');
        expect(result[227]._operands).toEqual([]);
        expect(result[228]._operator).toEqual('d');
        expect(result[228]._operands).toEqual(['[]', '0']);
        expect(result[229]._operator).toEqual('w');
        expect(result[229]._operands).toEqual(['1.000']);
        expect(result[230]._operator).toEqual('j');
        expect(result[230]._operands).toEqual(['0']);
        expect(result[231]._operator).toEqual('J');
        expect(result[231]._operands).toEqual(['0']);
        expect(result[232]._operator).toEqual('RG');
        expect(result[232]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[233]._operator).toEqual('rg');
        expect(result[233]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[234]._operator).toEqual('Tf');
        expect(result[235]._operator).toEqual('Tm');
        expect(result[235]._operands).toEqual(['1.00', '.00', '.00', '1.00', '81.67', '-135.19']);
        expect(result[236]._operator).toEqual("'");
        expect(result[236]._operands).toEqual(['(Flutter)']);
        expect(result[237]._operator).toEqual('ET');
        expect(result[237]._operands).toEqual([]);
        expect(result[238]._operator).toEqual('BT');
        expect(result[238]._operands).toEqual([]);
        expect(result[239]._operator).toEqual('d');
        expect(result[239]._operands).toEqual(['[]', '0']);
        expect(result[240]._operator).toEqual('w');
        expect(result[240]._operands).toEqual(['1.000']);
        expect(result[241]._operator).toEqual('j');
        expect(result[241]._operands).toEqual(['0']);
        expect(result[242]._operator).toEqual('J');
        expect(result[242]._operands).toEqual(['0']);
        expect(result[243]._operator).toEqual('RG');
        expect(result[243]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[244]._operator).toEqual('rg');
        expect(result[244]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[245]._operator).toEqual('Tf');
        expect(result[246]._operator).toEqual('Tm');
        expect(result[246]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-135.19']);
        expect(result[247]._operator).toEqual("'");
        expect(result[247]._operands).toEqual(['(3.)']);
        expect(result[248]._operator).toEqual('ET');
        expect(result[248]._operands).toEqual([]);
        expect(result[249]._operator).toEqual('BT');
        expect(result[249]._operands).toEqual([]);
        expect(result[250]._operator).toEqual('d');
        expect(result[250]._operands).toEqual(['[]', '0']);
        expect(result[251]._operator).toEqual('w');
        expect(result[251]._operands).toEqual(['1.000']);
        expect(result[252]._operator).toEqual('j');
        expect(result[252]._operands).toEqual(['0']);
        expect(result[253]._operator).toEqual('J');
        expect(result[253]._operands).toEqual(['0']);
        expect(result[254]._operator).toEqual('RG');
        expect(result[254]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[255]._operator).toEqual('rg');
        expect(result[255]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[256]._operator).toEqual('Tf');
        expect(result[257]._operator).toEqual('Tm');
        expect(result[257]._operands).toEqual(['1.00', '.00', '.00', '1.00', '81.67', '-144.44']);
        expect(result[258]._operator).toEqual("'");
        expect(result[258]._operands).toEqual(['(EJ2)']);
        expect(result[259]._operator).toEqual('ET');
        expect(result[259]._operands).toEqual([]);
        expect(result[260]._operator).toEqual('BT');
        expect(result[260]._operands).toEqual([]);
        expect(result[261]._operator).toEqual('d');
        expect(result[261]._operands).toEqual(['[]', '0']);
        expect(result[262]._operator).toEqual('w');
        expect(result[262]._operands).toEqual(['1.000']);
        expect(result[263]._operator).toEqual('j');
        expect(result[263]._operands).toEqual(['0']);
        expect(result[264]._operator).toEqual('J');
        expect(result[264]._operands).toEqual(['0']);
        expect(result[265]._operator).toEqual('RG');
        expect(result[265]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[266]._operator).toEqual('rg');
        expect(result[266]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[267]._operator).toEqual('Tf');
        expect(result[268]._operator).toEqual('Tm');
        expect(result[268]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-144.44']);
        expect(result[269]._operator).toEqual("'");
        expect(result[269]._operands).toEqual(['(4.)']);
        expect(result[270]._operator).toEqual('ET');
        expect(result[270]._operands).toEqual([]);
        expect(result[271]._operator).toEqual('BT');
        expect(result[271]._operands).toEqual([]);
        expect(result[272]._operator).toEqual('d');
        expect(result[272]._operands).toEqual(['[]', '0']);
        expect(result[273]._operator).toEqual('w');
        expect(result[273]._operands).toEqual(['1.000']);
        expect(result[274]._operator).toEqual('j');
        expect(result[274]._operands).toEqual(['0']);
        expect(result[275]._operator).toEqual('J');
        expect(result[275]._operands).toEqual(['0']);
        expect(result[276]._operator).toEqual('RG');
        expect(result[276]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[277]._operator).toEqual('rg');
        expect(result[277]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[278]._operator).toEqual('Tf');
        expect(result[279]._operator).toEqual('Tm');
        expect(result[279]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.67', '-153.69']);
        expect(result[280]._operator).toEqual("'");
        expect(result[280]._operands).toEqual(['(XlsIO)']);
        expect(result[281]._operator).toEqual('ET');
        expect(result[281]._operands).toEqual([]);
        expect(result[282]._operator).toEqual('BT');
        expect(result[282]._operands).toEqual([]);
        expect(result[283]._operator).toEqual('d');
        expect(result[283]._operands).toEqual(['[]', '0']);
        expect(result[284]._operator).toEqual('w');
        expect(result[284]._operands).toEqual(['1.000']);
        expect(result[285]._operator).toEqual('j');
        expect(result[285]._operands).toEqual(['0']);
        expect(result[286]._operator).toEqual('J');
        expect(result[286]._operands).toEqual(['0']);
        expect(result[287]._operator).toEqual('RG');
        expect(result[287]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[288]._operator).toEqual('rg');
        expect(result[288]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[289]._operator).toEqual('Tf');
        expect(result[290]._operator).toEqual('Tm');
        expect(result[290]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-153.69']);
        expect(result[291]._operator).toEqual("'");
        expect(result[291]._operands).toEqual(['(2.)']);
        expect(result[292]._operator).toEqual('ET');
        expect(result[292]._operands).toEqual([]);
        expect(result[293]._operator).toEqual('BT');
        expect(result[293]._operands).toEqual([]);
        expect(result[294]._operator).toEqual('d');
        expect(result[294]._operands).toEqual(['[]', '0']);
        expect(result[295]._operator).toEqual('w');
        expect(result[295]._operands).toEqual(['1.000']);
        expect(result[296]._operator).toEqual('j');
        expect(result[296]._operands).toEqual(['0']);
        expect(result[297]._operator).toEqual('J');
        expect(result[297]._operands).toEqual(['0']);
        expect(result[298]._operator).toEqual('RG');
        expect(result[298]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[299]._operator).toEqual('rg');
        expect(result[299]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[300]._operator).toEqual('Tf');
        expect(result[301]._operator).toEqual('Tm');
        expect(result[301]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.67', '-162.94']);
        expect(result[302]._operator).toEqual("'");
        expect(result[302]._operands).toEqual(['(DocIO)']);
        expect(result[303]._operator).toEqual('ET');
        expect(result[303]._operands).toEqual([]);
        expect(result[304]._operator).toEqual('BT');
        expect(result[304]._operands).toEqual([]);
        expect(result[305]._operator).toEqual('d');
        expect(result[305]._operands).toEqual(['[]', '0']);
        expect(result[306]._operator).toEqual('w');
        expect(result[306]._operands).toEqual(['1.000']);
        expect(result[307]._operator).toEqual('j');
        expect(result[307]._operands).toEqual(['0']);
        expect(result[308]._operator).toEqual('J');
        expect(result[308]._operands).toEqual(['0']);
        expect(result[309]._operator).toEqual('RG');
        expect(result[309]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[310]._operator).toEqual('rg');
        expect(result[310]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[311]._operator).toEqual('Tf');
        expect(result[312]._operator).toEqual('Tm');
        expect(result[312]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-162.94']);
        expect(result[313]._operator).toEqual("'");
        expect(result[313]._operands).toEqual(['(3.)']);
        expect(result[314]._operator).toEqual('ET');
        expect(result[314]._operands).toEqual([]);
        expect(result[315]._operator).toEqual('BT');
        expect(result[315]._operands).toEqual([]);
        expect(result[316]._operator).toEqual('d');
        expect(result[316]._operands).toEqual(['[]', '0']);
        expect(result[317]._operator).toEqual('w');
        expect(result[317]._operands).toEqual(['1.000']);
        expect(result[318]._operator).toEqual('j');
        expect(result[318]._operands).toEqual(['0']);
        expect(result[319]._operator).toEqual('J');
        expect(result[319]._operands).toEqual(['0']);
        expect(result[320]._operator).toEqual('RG');
        expect(result[320]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[321]._operator).toEqual('rg');
        expect(result[321]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[322]._operator).toEqual('Tf');
        expect(result[323]._operator).toEqual('Tm');
        expect(result[323]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.67', '-172.18']);
        expect(result[324]._operator).toEqual("'");
        expect(result[324]._operands).toEqual(['(PPT)']);
        expect(result[325]._operator).toEqual('ET');
        expect(result[325]._operands).toEqual([]);
        expect(result[326]._operator).toEqual('BT');
        expect(result[326]._operands).toEqual([]);
        expect(result[327]._operator).toEqual('d');
        expect(result[327]._operands).toEqual(['[]', '0']);
        expect(result[328]._operator).toEqual('w');
        expect(result[328]._operands).toEqual(['1.000']);
        expect(result[329]._operator).toEqual('j');
        expect(result[329]._operands).toEqual(['0']);
        expect(result[330]._operator).toEqual('J');
        expect(result[330]._operands).toEqual(['0']);
        expect(result[331]._operator).toEqual('RG');
        expect(result[331]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[332]._operator).toEqual('rg');
        expect(result[332]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[333]._operator).toEqual('Tf');
        expect(result[334]._operator).toEqual('Tm');
        expect(result[334]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-172.18']);
        expect(result[335]._operator).toEqual("'");
        expect(result[335]._operands).toEqual(['(4.)']);
        expect(result[336]._operator).toEqual('ET');
        expect(result[336]._operands).toEqual([]);
        expect(result[337]._operator).toEqual('BT');
        expect(result[337]._operands).toEqual([]);
        expect(result[338]._operator).toEqual('rg');
        expect(result[338]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[339]._operator).toEqual('Tf');
        expect(result[340]._operator).toEqual('Tr');
        expect(result[340]._operands).toEqual(['0']);
        expect(result[341]._operator).toEqual('Tm');
        expect(result[341]._operands).toEqual(['1.00', '.00', '.00', '1.00', '73.00', '-207.45']);
        expect(result[342]._operator).toEqual("'");
        expect(result[342]._operands).toEqual(['(PDF)']);
        expect(result[343]._operator).toEqual('ET');
        expect(result[343]._operands).toEqual([]);
        expect(result[344]._operator).toEqual('BT');
        expect(result[344]._operands).toEqual([]);
        expect(result[345]._operator).toEqual('rg');
        expect(result[345]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[346]._operator).toEqual('Tf');
        expect(result[347]._operator).toEqual('Tm');
        expect(result[347]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-207.45']);
        expect(result[348]._operator).toEqual('Td');
        expect(result[348]._operands).toEqual(['0.440', '0.000']);
        expect(result[349]._operator).toEqual("'");
        expect(result[349]._operands).toEqual(['(A.)']);
        expect(result[350]._operator).toEqual('ET');
        expect(result[350]._operands).toEqual([]);
        expect(result[351]._operator).toEqual('BT');
        expect(result[351]._operands).toEqual([]);
        expect(result[352]._operator).toEqual('rg');
        expect(result[352]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[353]._operator).toEqual('Tf');
        expect(result[354]._operator).toEqual('Tm');
        expect(result[354]._operands).toEqual(['1.00', '.00', '.00', '1.00', '73.00', '-216.70']);
        expect(result[355]._operator).toEqual("'");
        expect(result[355]._operands).toEqual(['(XlsIO)']);
        expect(result[356]._operator).toEqual('ET');
        expect(result[356]._operands).toEqual([]);
        expect(result[357]._operator).toEqual('BT');
        expect(result[357]._operands).toEqual([]);
        expect(result[358]._operator).toEqual('rg');
        expect(result[358]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[359]._operator).toEqual('Tf');
        expect(result[360]._operator).toEqual('Tm');
        expect(result[360]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-216.70']);
        expect(result[361]._operator).toEqual('Td');
        expect(result[361]._operands).toEqual(['0.440', '0.000']);
        expect(result[362]._operator).toEqual("'");
        expect(result[362]._operands).toEqual(['(B.)']);
        expect(result[363]._operator).toEqual('ET');
        expect(result[363]._operands).toEqual([]);
        expect(result[364]._operator).toEqual('BT');
        expect(result[364]._operands).toEqual([]);
        expect(result[365]._operator).toEqual('rg');
        expect(result[365]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[366]._operator).toEqual('Tf');
        expect(result[367]._operator).toEqual('Tm');
        expect(result[367]._operands).toEqual(['1.00', '.00', '.00', '1.00', '73.00', '-225.94']);
        expect(result[368]._operator).toEqual("'");
        expect(result[368]._operands).toEqual(['(DocIO)']);
        expect(result[369]._operator).toEqual('ET');
        expect(result[369]._operands).toEqual([]);
        expect(result[370]._operator).toEqual('BT');
        expect(result[370]._operands).toEqual([]);
        expect(result[371]._operator).toEqual('rg');
        expect(result[371]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[372]._operator).toEqual('Tf');
        expect(result[373]._operator).toEqual('Tm');
        expect(result[373]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-225.94']);
        expect(result[374]._operator).toEqual("'");
        expect(result[374]._operands).toEqual(['(C.)']);
        expect(result[375]._operator).toEqual('ET');
        expect(result[375]._operands).toEqual([]);
        expect(result[376]._operator).toEqual('BT');
        expect(result[376]._operands).toEqual([]);
        expect(result[377]._operator).toEqual('rg');
        expect(result[377]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[378]._operator).toEqual('Tf');
        expect(result[379]._operator).toEqual('Tm');
        expect(result[379]._operands).toEqual(['1.00', '.00', '.00', '1.00', '73.00', '-235.19']);
        expect(result[380]._operator).toEqual("'");
        expect(result[380]._operands).toEqual(['(PPT)']);
        expect(result[381]._operator).toEqual('ET');
        expect(result[381]._operands).toEqual([]);
        expect(result[382]._operator).toEqual('BT');
        expect(result[382]._operands).toEqual([]);
        expect(result[383]._operator).toEqual('rg');
        expect(result[383]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[384]._operator).toEqual('Tf');
        expect(result[385]._operator).toEqual('Tm');
        expect(result[385]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-235.19']);
        expect(result[386]._operator).toEqual("'");
        expect(result[386]._operands).toEqual(['(D.)']);
        expect(result[387]._operator).toEqual('ET');
        expect(result[387]._operands).toEqual([]);
        expect(result[388]._operator).toEqual('BT');
        expect(result[388]._operands).toEqual([]);
        expect(result[389]._operator).toEqual('d');
        expect(result[389]._operands).toEqual(['[]', '0']);
        expect(result[390]._operator).toEqual('w');
        expect(result[390]._operands).toEqual(['1.000']);
        expect(result[391]._operator).toEqual('j');
        expect(result[391]._operands).toEqual(['0']);
        expect(result[392]._operator).toEqual('J');
        expect(result[392]._operands).toEqual(['0']);
        expect(result[393]._operator).toEqual('RG');
        expect(result[393]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[394]._operator).toEqual('rg');
        expect(result[394]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[395]._operator).toEqual('Tf');
        expect(result[396]._operator).toEqual('Tr');
        expect(result[396]._operands).toEqual(['2']);
        expect(result[397]._operator).toEqual('Tm');
        expect(result[397]._operands).toEqual(['1.00', '.00', '.00', '1.00', '68.67', '-407.45']);
        expect(result[398]._operator).toEqual("'");
        expect(result[398]._operands).toEqual(['(Main Item 1)']);
        expect(result[399]._operator).toEqual('ET');
        expect(result[399]._operands).toEqual([]);
        expect(result[400]._operator).toEqual('BT');
        expect(result[400]._operands).toEqual([]);
        expect(result[401]._operator).toEqual('d');
        expect(result[401]._operands).toEqual(['[]', '0']);
        expect(result[402]._operator).toEqual('w');
        expect(result[402]._operands).toEqual(['1.000']);
        expect(result[403]._operator).toEqual('j');
        expect(result[403]._operands).toEqual(['0']);
        expect(result[404]._operator).toEqual('J');
        expect(result[404]._operands).toEqual(['0']);
        expect(result[405]._operator).toEqual('RG');
        expect(result[405]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[406]._operator).toEqual('rg');
        expect(result[406]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[407]._operator).toEqual('Tf');
        expect(result[408]._operator).toEqual('Tm');
        expect(result[408]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-407.45']);
        expect(result[409]._operator).toEqual("'");
        expect(result[409]._operands).toEqual(['(1.)']);
        expect(result[410]._operator).toEqual('ET');
        expect(result[410]._operands).toEqual([]);
        expect(result[411]._operator).toEqual('BT');
        expect(result[411]._operands).toEqual([]);
        expect(result[412]._operator).toEqual('d');
        expect(result[412]._operands).toEqual(['[]', '0']);
        expect(result[413]._operator).toEqual('w');
        expect(result[413]._operands).toEqual(['1.000']);
        expect(result[414]._operator).toEqual('j');
        expect(result[414]._operands).toEqual(['0']);
        expect(result[415]._operator).toEqual('J');
        expect(result[415]._operands).toEqual(['0']);
        expect(result[416]._operator).toEqual('RG');
        expect(result[416]._operands).toEqual(['0.000', '1.000', '0.000']);
        expect(result[417]._operator).toEqual('rg');
        expect(result[417]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[418]._operator).toEqual('Tf');
        expect(result[419]._operator).toEqual('Tm');
        expect(result[419]._operands).toEqual(['1.00', '.00', '.00', '1.00', '83.33', '-416.70']);
        expect(result[420]._operator).toEqual("'");
        expect(result[420]._operands).toEqual(['(Sub Item 1)']);
        expect(result[421]._operator).toEqual('ET');
        expect(result[421]._operands).toEqual([]);
        expect(result[422]._operator).toEqual('q');
        expect(result[422]._operands).toEqual([]);
        expect(result[423]._operator).toEqual('cm');
        expect(result[423]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-418.95']);
        expect(result[424]._operator).toEqual('Do');
        expect(result[425]._operator).toEqual('Q');
        expect(result[425]._operands).toEqual([]);
        expect(result[426]._operator).toEqual('BT');
        expect(result[426]._operands).toEqual([]);
        expect(result[427]._operator).toEqual('d');
        expect(result[427]._operands).toEqual(['[]', '0']);
        expect(result[428]._operator).toEqual('w');
        expect(result[428]._operands).toEqual(['1.000']);
        expect(result[429]._operator).toEqual('j');
        expect(result[429]._operands).toEqual(['0']);
        expect(result[430]._operator).toEqual('J');
        expect(result[430]._operands).toEqual(['0']);
        expect(result[431]._operator).toEqual('RG');
        expect(result[431]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[432]._operator).toEqual('rg');
        expect(result[432]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[433]._operator).toEqual('Tf');
        expect(result[434]._operator).toEqual('Tm');
        expect(result[434]._operands).toEqual(['1.00', '.00', '.00', '1.00', '93.33', '-426.40']);
        expect(result[435]._operator).toEqual("'");
        expect(result[435]._operands).toEqual(['(Sub-sub Item 1)']);
        expect(result[436]._operator).toEqual('ET');
        expect(result[436]._operands).toEqual([]);
        expect(result[437]._operator).toEqual('q');
        expect(result[437]._operands).toEqual([]);
        expect(result[438]._operator).toEqual('cm');
        expect(result[438]._operands).toEqual(['1.00', '.00', '.00', '1.00', '80.00', '-428.66']);
        expect(result[439]._operator).toEqual('Do');
        expect(result[440]._operator).toEqual('Q');
        expect(result[440]._operands).toEqual([]);
        expect(result[441]._operator).toEqual('BT');
        expect(result[441]._operands).toEqual([]);
        expect(result[442]._operator).toEqual('d');
        expect(result[442]._operands).toEqual(['[]', '0']);
        expect(result[443]._operator).toEqual('w');
        expect(result[443]._operands).toEqual(['1.000']);
        expect(result[444]._operator).toEqual('j');
        expect(result[444]._operands).toEqual(['0']);
        expect(result[445]._operator).toEqual('J');
        expect(result[445]._operands).toEqual(['0']);
        expect(result[446]._operator).toEqual('RG');
        expect(result[446]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[447]._operator).toEqual('rg');
        expect(result[447]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[448]._operator).toEqual('Tf');
        expect(result[449]._operator).toEqual('Tm');
        expect(result[449]._operands).toEqual(['1.00', '.00', '.00', '1.00', '93.33', '-436.10']);
        expect(result[450]._operator).toEqual("'");
        expect(result[450]._operands).toEqual(['(Sub-sub Item 2)']);
        expect(result[451]._operator).toEqual('ET');
        expect(result[451]._operands).toEqual([]);
        expect(result[452]._operator).toEqual('q');
        expect(result[452]._operands).toEqual([]);
        expect(result[453]._operator).toEqual('cm');
        expect(result[453]._operands).toEqual(['1.00', '.00', '.00', '1.00', '80.00', '-438.36']);
        expect(result[454]._operator).toEqual('Do');
        expect(result[455]._operator).toEqual('Q');
        expect(result[455]._operands).toEqual([]);
        expect(result[456]._operator).toEqual('BT');
        expect(result[456]._operands).toEqual([]);
        expect(result[457]._operator).toEqual('d');
        expect(result[457]._operands).toEqual(['[]', '0']);
        expect(result[458]._operator).toEqual('w');
        expect(result[458]._operands).toEqual(['1.000']);
        expect(result[459]._operator).toEqual('j');
        expect(result[459]._operands).toEqual(['0']);
        expect(result[460]._operator).toEqual('J');
        expect(result[460]._operands).toEqual(['0']);
        expect(result[461]._operator).toEqual('RG');
        expect(result[461]._operands).toEqual(['0.000', '1.000', '0.000']);
        expect(result[462]._operator).toEqual('rg');
        expect(result[462]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[463]._operator).toEqual('Tf');
        expect(result[464]._operator).toEqual('Tm');
        expect(result[464]._operands).toEqual(['1.00', '.00', '.00', '1.00', '83.33', '-445.81']);
        expect(result[465]._operator).toEqual("'");
        expect(result[465]._operands).toEqual(['(Sub Item 2)']);
        expect(result[466]._operator).toEqual('ET');
        expect(result[466]._operands).toEqual([]);
        expect(result[467]._operator).toEqual('q');
        expect(result[467]._operands).toEqual([]);
        expect(result[468]._operator).toEqual('cm');
        expect(result[468]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-448.06']);
        expect(result[469]._operator).toEqual('Do');
        expect(result[470]._operator).toEqual('Q');
        expect(result[470]._operands).toEqual([]);
        expect(result[471]._operator).toEqual('BT');
        expect(result[471]._operands).toEqual([]);
        expect(result[472]._operator).toEqual('d');
        expect(result[472]._operands).toEqual(['[]', '0']);
        expect(result[473]._operator).toEqual('w');
        expect(result[473]._operands).toEqual(['1.000']);
        expect(result[474]._operator).toEqual('j');
        expect(result[474]._operands).toEqual(['0']);
        expect(result[475]._operator).toEqual('J');
        expect(result[475]._operands).toEqual(['0']);
        expect(result[476]._operator).toEqual('RG');
        expect(result[476]._operands).toEqual(['0.000', '1.000', '0.000']);
        expect(result[477]._operator).toEqual('rg');
        expect(result[477]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[478]._operator).toEqual('Tf');
        expect(result[479]._operator).toEqual('Tm');
        expect(result[479]._operands).toEqual(['1.00', '.00', '.00', '1.00', '83.33', '-455.51']);
        expect(result[480]._operator).toEqual("'");
        expect(result[480]._operands).toEqual(['(Sub Item 3)']);
        expect(result[481]._operator).toEqual('ET');
        expect(result[481]._operands).toEqual([]);
        expect(result[482]._operator).toEqual('q');
        expect(result[482]._operands).toEqual([]);
        expect(result[483]._operator).toEqual('cm');
        expect(result[483]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-457.77']);
        expect(result[484]._operator).toEqual('Do');
        expect(result[485]._operator).toEqual('Q');
        expect(result[485]._operands).toEqual([]);
        expect(result[486]._operator).toEqual('BT');
        expect(result[486]._operands).toEqual([]);
        expect(result[487]._operator).toEqual('d');
        expect(result[487]._operands).toEqual(['[]', '0']);
        expect(result[488]._operator).toEqual('w');
        expect(result[488]._operands).toEqual(['1.000']);
        expect(result[489]._operator).toEqual('j');
        expect(result[489]._operands).toEqual(['0']);
        expect(result[490]._operator).toEqual('J');
        expect(result[490]._operands).toEqual(['0']);
        expect(result[491]._operator).toEqual('RG');
        expect(result[491]._operands).toEqual(['0.000', '1.000', '0.000']);
        expect(result[492]._operator).toEqual('rg');
        expect(result[492]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[493]._operator).toEqual('Tf');
        expect(result[494]._operator).toEqual('Tm');
        expect(result[494]._operands).toEqual(['1.00', '.00', '.00', '1.00', '83.33', '-465.22']);
        expect(result[495]._operator).toEqual("'");
        expect(result[495]._operands).toEqual(['(Sub Item 4)']);
        expect(result[496]._operator).toEqual('ET');
        expect(result[496]._operands).toEqual([]);
        expect(result[497]._operator).toEqual('q');
        expect(result[497]._operands).toEqual([]);
        expect(result[498]._operator).toEqual('cm');
        expect(result[498]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-467.47']);
        expect(result[499]._operator).toEqual('Do');
        expect(result[500]._operator).toEqual('Q');
        expect(result[500]._operands).toEqual([]);
        expect(result[501]._operator).toEqual('BT');
        expect(result[501]._operands).toEqual([]);
        expect(result[502]._operator).toEqual('d');
        expect(result[502]._operands).toEqual(['[]', '0']);
        expect(result[503]._operator).toEqual('w');
        expect(result[503]._operands).toEqual(['1.000']);
        expect(result[504]._operator).toEqual('j');
        expect(result[504]._operands).toEqual(['0']);
        expect(result[505]._operator).toEqual('J');
        expect(result[505]._operands).toEqual(['0']);
        expect(result[506]._operator).toEqual('RG');
        expect(result[506]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[507]._operator).toEqual('rg');
        expect(result[507]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[508]._operator).toEqual('Tf');
        expect(result[509]._operator).toEqual('Tm');
        expect(result[509]._operands).toEqual(['1.00', '.00', '.00', '1.00', '68.67', '-474.92']);
        expect(result[510]._operator).toEqual("'");
        expect(result[510]._operands).toEqual(['(Main Item 2)']);
        expect(result[511]._operator).toEqual('ET');
        expect(result[511]._operands).toEqual([]);
        expect(result[512]._operator).toEqual('BT');
        expect(result[512]._operands).toEqual([]);
        expect(result[513]._operator).toEqual('d');
        expect(result[513]._operands).toEqual(['[]', '0']);
        expect(result[514]._operator).toEqual('w');
        expect(result[514]._operands).toEqual(['1.000']);
        expect(result[515]._operator).toEqual('j');
        expect(result[515]._operands).toEqual(['0']);
        expect(result[516]._operator).toEqual('J');
        expect(result[516]._operands).toEqual(['0']);
        expect(result[517]._operator).toEqual('RG');
        expect(result[517]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[518]._operator).toEqual('rg');
        expect(result[518]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[519]._operator).toEqual('Tf');
        expect(result[520]._operator).toEqual('Tm');
        expect(result[520]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-474.92']);
        expect(result[521]._operator).toEqual("'");
        expect(result[521]._operands).toEqual(['(2.)']);
        expect(result[522]._operator).toEqual('ET');
        expect(result[522]._operands).toEqual([]);
        expect(result[523]._operator).toEqual('BT');
        expect(result[523]._operands).toEqual([]);
        expect(result[524]._operator).toEqual('d');
        expect(result[524]._operands).toEqual(['[]', '0']);
        expect(result[525]._operator).toEqual('w');
        expect(result[525]._operands).toEqual(['1.000']);
        expect(result[526]._operator).toEqual('j');
        expect(result[526]._operands).toEqual(['0']);
        expect(result[527]._operator).toEqual('J');
        expect(result[527]._operands).toEqual(['0']);
        expect(result[528]._operator).toEqual('RG');
        expect(result[528]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[529]._operator).toEqual('rg');
        expect(result[529]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[530]._operator).toEqual('Tf');
        expect(result[531]._operator).toEqual('Tm');
        expect(result[531]._operands).toEqual(['1.00', '.00', '.00', '1.00', '68.67', '-484.17']);
        expect(result[532]._operator).toEqual("'");
        expect(result[532]._operands).toEqual(['(Main Item 3)']);
        expect(result[533]._operator).toEqual('ET');
        expect(result[533]._operands).toEqual([]);
        expect(result[534]._operator).toEqual('BT');
        expect(result[534]._operands).toEqual([]);
        expect(result[535]._operator).toEqual('d');
        expect(result[535]._operands).toEqual(['[]', '0']);
        expect(result[536]._operator).toEqual('w');
        expect(result[536]._operands).toEqual(['1.000']);
        expect(result[537]._operator).toEqual('j');
        expect(result[537]._operands).toEqual(['0']);
        expect(result[538]._operator).toEqual('J');
        expect(result[538]._operands).toEqual(['0']);
        expect(result[539]._operator).toEqual('RG');
        expect(result[539]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[540]._operator).toEqual('rg');
        expect(result[540]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[541]._operator).toEqual('Tf');
        expect(result[542]._operator).toEqual('Tm');
        expect(result[542]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-484.17']);
        expect(result[543]._operator).toEqual("'");
        expect(result[543]._operands).toEqual(['(3.)']);
        expect(result[544]._operator).toEqual('ET');
        expect(result[544]._operands).toEqual([]);
        expect(result[545]._operator).toEqual('BT');
        expect(result[545]._operands).toEqual([]);
        expect(result[546]._operator).toEqual('d');
        expect(result[546]._operands).toEqual(['[]', '0']);
        expect(result[547]._operator).toEqual('w');
        expect(result[547]._operands).toEqual(['1.000']);
        expect(result[548]._operator).toEqual('j');
        expect(result[548]._operands).toEqual(['0']);
        expect(result[549]._operator).toEqual('J');
        expect(result[549]._operands).toEqual(['0']);
        expect(result[550]._operator).toEqual('RG');
        expect(result[550]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[551]._operator).toEqual('rg');
        expect(result[551]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[552]._operator).toEqual('Tf');
        expect(result[553]._operator).toEqual('Tm');
        expect(result[553]._operands).toEqual(['1.00', '.00', '.00', '1.00', '68.67', '-493.42']);
        expect(result[554]._operator).toEqual("'");
        expect(result[554]._operands).toEqual(['(Main Item 4)']);
        expect(result[555]._operator).toEqual('ET');
        expect(result[555]._operands).toEqual([]);
        expect(result[556]._operator).toEqual('BT');
        expect(result[556]._operands).toEqual([]);
        expect(result[557]._operator).toEqual('d');
        expect(result[557]._operands).toEqual(['[]', '0']);
        expect(result[558]._operator).toEqual('w');
        expect(result[558]._operands).toEqual(['1.000']);
        expect(result[559]._operator).toEqual('j');
        expect(result[559]._operands).toEqual(['0']);
        expect(result[560]._operator).toEqual('J');
        expect(result[560]._operands).toEqual(['0']);
        expect(result[561]._operator).toEqual('RG');
        expect(result[561]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[562]._operator).toEqual('rg');
        expect(result[562]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[563]._operator).toEqual('Tf');
        expect(result[564]._operator).toEqual('Tm');
        expect(result[564]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-493.42']);
        expect(result[565]._operator).toEqual("'");
        expect(result[565]._operands).toEqual(['(4.)']);
        expect(result[566]._operator).toEqual('ET');
        expect(result[566]._operands).toEqual([]);
        expect(result[567]._operator).toEqual('BT');
        expect(result[567]._operands).toEqual([]);
        expect(result[568]._operator).toEqual('rg');
        expect(result[568]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[569]._operator).toEqual('Tf');
        expect(result[570]._operator).toEqual('Tr');
        expect(result[570]._operands).toEqual(['0']);
        expect(result[571]._operator).toEqual('Tm');
        expect(result[571]._operands).toEqual(['1.00', '.00', '.00', '1.00', '76.12', '-749.45']);
        expect(result[572]._operator).toEqual("'");
        expect(result[572]._operands).toEqual(['(PDF)']);
        expect(result[573]._operator).toEqual('ET');
        expect(result[573]._operands).toEqual([]);
        expect(result[574]._operator).toEqual('BT');
        expect(result[574]._operands).toEqual([]);
        expect(result[575]._operator).toEqual('rg');
        expect(result[575]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[576]._operator).toEqual('Tf');
        expect(result[577]._operator).toEqual('Tm');
        expect(result[577]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-749.45']);
        expect(result[578]._operator).toEqual('Td');
        expect(result[578]._operands).toEqual(['4.448', '0.000']);
        expect(result[579]._operator).toEqual("'");
        expect(result[579]._operands).toEqual(['(1.)']);
        expect(result[580]._operator).toEqual('ET');
        expect(result[580]._operands).toEqual([]);
        expect(result[581]._operator).toEqual('BT');
        expect(result[581]._operands).toEqual([]);
        expect(result[582]._operator).toEqual('rg');
        expect(result[582]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[583]._operator).toEqual('Tf');
        expect(result[584]._operator).toEqual('Tm');
        expect(result[584]._operands).toEqual(['1.00', '.00', '.00', '1.00', '76.12', '-758.70']);
        expect(result[585]._operator).toEqual("'");
        expect(result[585]._operands).toEqual(['(XlsIO)']);
        expect(result[586]._operator).toEqual('ET');
        expect(result[586]._operands).toEqual([]);
        expect(result[587]._operator).toEqual('BT');
        expect(result[587]._operands).toEqual([]);
        expect(result[588]._operator).toEqual('rg');
        expect(result[588]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[589]._operator).toEqual('Tf');
        expect(result[590]._operator).toEqual('Tm');
        expect(result[590]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-758.70']);
        expect(result[591]._operator).toEqual('Td');
        expect(result[591]._operands).toEqual(['4.448', '0.000']);
        expect(result[592]._operator).toEqual("'");
        expect(result[592]._operands).toEqual(['(2.)']);
        expect(result[593]._operator).toEqual('ET');
        expect(result[593]._operands).toEqual([]);
        expect(result[594]._operator).toEqual('BT');
        expect(result[594]._operands).toEqual([]);
        expect(result[595]._operator).toEqual('rg');
        expect(result[595]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[596]._operator).toEqual('Tf');
        expect(result[597]._operator).toEqual('Tm');
        expect(result[597]._operands).toEqual(['1.00', '.00', '.00', '1.00', '201.67', '-749.45']);
        expect(result[598]._operator).toEqual("'");
        expect(result[598]._operands).toEqual(['(A paragraph is a series of sentences that are organized and coherent, and are all)']);
        expect(result[599]._operator).toEqual('Tm');
        expect(result[599]._operands).toEqual(['1.00', '.00', '.00', '1.00', '201.67', '-758.70']);
        expect(result[600]._operator).toEqual("'");
        expect(result[600]._operands).toEqual(['(related to a single topic. Almost every piece of writing you do that is longer than a few)']);
        expect(result[601]._operator).toEqual('ET');
        expect(result[601]._operands).toEqual([]);
        expect(result[602]._operator).toEqual('BT');
        expect(result[602]._operands).toEqual([]);
        expect(result[603]._operator).toEqual('rg');
        expect(result[603]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[604]._operator).toEqual('Tf');
        expect(result[605]._operator).toEqual('Tm');
        expect(result[605]._operands).toEqual(['1.00', '.00', '.00', '1.00', '190.00', '-749.45']);
        expect(result[606]._operator).toEqual("'");
        expect(result[606]._operands).toEqual(['(1.)']);
        expect(result[607]._operator).toEqual('ET');
        expect(result[607]._operands).toEqual([]);
        document.destroy();
    });
    it('911761 - list drawing with combination proeprties', () => {
        let document = new PdfDocument();
        let page = document.addPage();
        let items = new PdfListItemCollection(['Items 1', 'Items 2', 'Items 3', 'Items 4']);
        let listCombination1 = new PdfOrderedList(items);
        listCombination1.style = PdfNumberStyle.numeric;
        listCombination1.startNumber = 5;
        listCombination1.stringFormat = new PdfStringFormat(PdfTextAlignment.center);
        listCombination1.draw(page, { x: 50, y: 50 });
        expect(listCombination1.style).toEqual(PdfNumberStyle.numeric);
        expect(listCombination1.startNumber).toEqual(5);
        expect(listCombination1.stringFormat.alignment).toEqual(PdfTextAlignment.center);
        let listCombination2 = new PdfOrderedList(items);
        listCombination2.indent = 20;
        listCombination2.textIndent = 10;
        listCombination2.font = new PdfStandardFont(PdfFontFamily.helvetica, 10);
        listCombination2.draw(page, { x: 50, y: 150 });
        expect(listCombination2.indent).toEqual(20);
        expect(listCombination2.textIndent).toEqual(10);
        expect(listCombination2.font.size).toEqual(10);
        let listCombination3 = new PdfOrderedList(items);
        listCombination3.style = PdfNumberStyle.lowerLatin;
        listCombination3.brush = new PdfBrush({ r: 255, g: 0, b: 0 });
        listCombination3.pen = new PdfPen({ r: 0, g: 0, b: 255 }, 0.5);
        listCombination3.alignment = PdfListMarkerAlignment.left;
        listCombination3.draw(page, { x: 50, y: 250 });
        expect(listCombination3.style).toEqual(PdfNumberStyle.lowerLatin);
        expect(listCombination3.brush._color).toEqual({ r: 255, g: 0, b: 0 });
        expect(listCombination3.pen._color).toEqual({ r: 0, g: 0, b: 255 });
        expect(listCombination3.pen._width).toEqual(0.5);
        expect(listCombination3.alignment).toEqual(PdfListMarkerAlignment.left);
        let listCombination4 = new PdfOrderedList(items);
        listCombination4.style = PdfNumberStyle.upperRoman;
        listCombination4.delimiter = '-';
        listCombination4.suffix = ')';
        listCombination4.draw(page, { x: 50, y: 350 });
        expect(listCombination4.style).toEqual(PdfNumberStyle.upperRoman);
        expect(listCombination4.delimiter).toEqual('-');
        expect(listCombination4.suffix).toEqual(')');
        let doubleDelimiterList = new PdfOrderedList(items);
        doubleDelimiterList.style = PdfNumberStyle.numeric;
        doubleDelimiterList.delimiter = ':';
        doubleDelimiterList.suffix = '::';
        doubleDelimiterList.font = new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.italic);
        doubleDelimiterList.draw(page, { x: 50, y: 450 });
        expect(doubleDelimiterList.style).toEqual(PdfNumberStyle.numeric);
        expect(doubleDelimiterList.delimiter).toEqual(':');
        expect(doubleDelimiterList.suffix).toEqual('::');
        expect(doubleDelimiterList.font.style).toEqual(PdfFontStyle.italic);
        let centeredAlphaList = new PdfOrderedList(items);
        centeredAlphaList.style = PdfNumberStyle.upperLatin;
        centeredAlphaList.stringFormat = new PdfStringFormat(PdfTextAlignment.center);
        centeredAlphaList.pen = new PdfPen({ r: 0, g: 0, b: 0 }, 2);
        centeredAlphaList.draw(page, { x: 50, y: 550 });
        expect(centeredAlphaList.style).toEqual(PdfNumberStyle.upperLatin);
        expect(centeredAlphaList.stringFormat.alignment).toEqual(PdfTextAlignment.center);
        expect(centeredAlphaList.pen._color).toEqual({ r: 0, g: 0, b: 0 });
        expect(centeredAlphaList.pen._width).toEqual(2);
        let unorderedListCombination1 = new PdfUnorderedList(items);
        unorderedListCombination1.style = PdfUnorderedListStyle.disk;
        unorderedListCombination1.pen = new PdfPen({ r: 0, g: 0, b: 255 }, 0.5);
        unorderedListCombination1.brush = new PdfBrush({ r: 255, g: 0, b: 0 });
        unorderedListCombination1.draw(page, { x: 150, y: 50 });
        expect(unorderedListCombination1.style).toEqual(PdfUnorderedListStyle.disk);
        expect(unorderedListCombination1.pen._color).toEqual({ r: 0, g: 0, b: 255 });
        expect(unorderedListCombination1.brush._color).toEqual({ r: 255, g: 0, b: 0 });
        let unorderedListCombination2 = new PdfUnorderedList(items);
        unorderedListCombination2.font = new PdfStandardFont(PdfFontFamily.timesRoman, 11);
        unorderedListCombination2.indent = 20;
        unorderedListCombination2.alignment = PdfListMarkerAlignment.right;
        unorderedListCombination2.draw(page, { x: 150, y: 150 });
        expect(unorderedListCombination2.font.size).toEqual(11);
        expect(unorderedListCombination2.indent).toEqual(20);
        expect(unorderedListCombination2.alignment).toEqual(PdfListMarkerAlignment.right);
        let unorderedListCombination3 = new PdfUnorderedList(items);
        unorderedListCombination3.textIndent = 10;
        unorderedListCombination3.stringFormat = new PdfStringFormat(PdfTextAlignment.justify);
        unorderedListCombination3.style = PdfUnorderedListStyle.square;
        unorderedListCombination3.draw(page, { x: 150, y: 250 });
        expect(unorderedListCombination3.textIndent).toEqual(10);
        expect(unorderedListCombination3.stringFormat.alignment).toEqual(PdfTextAlignment.justify);
        expect(unorderedListCombination3.style).toEqual(PdfUnorderedListStyle.square);
        let update = document.save();
        document = new PdfDocument(update);
        page = document.getPage(0);
        expect(document.pageCount).toEqual(1)
        expect(page.rotation).toEqual(0);
        let appearance = page._pageDictionary.getArray('Contents') as any[];
        expect(appearance).not.toBeUndefined();
        let stream: _PdfStream = appearance[2] as _PdfStream;
        let parser: _ContentParser = new _ContentParser(stream.getBytes());
        let result = parser._readContent();
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands).toEqual([]);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands).toEqual([]);
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands).toEqual([]);
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands).toEqual([]);
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
        expect(result[7]._operator).toEqual('BT');
        expect(result[7]._operands).toEqual([]);
        expect(result[8]._operator).toEqual('CS');
        expect(result[8]._operands).toEqual(['/DeviceRGB']);
        expect(result[9]._operator).toEqual('cs');
        expect(result[9]._operands).toEqual(['/DeviceRGB']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[11]._operator).toEqual('Tf');
        expect(result[12]._operator).toEqual('Tr');
        expect(result[12]._operands).toEqual(['0']);
        expect(result[13]._operator).toEqual('Tc');
        expect(result[13]._operands).toEqual(['0.000']);
        expect(result[14]._operator).toEqual('Tw');
        expect(result[14]._operands).toEqual(['0.000']);
        expect(result[15]._operator).toEqual('Tz');
        expect(result[15]._operands).toEqual(['100.000']);
        expect(result[16]._operator).toEqual('Tm');
        expect(result[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '76.12', '-57.45']);
        expect(result[17]._operator).toEqual('Td');
        expect(result[17]._operands).toEqual(['206.324', '0.000']);
        expect(result[18]._operator).toEqual("'");
        expect(result[18]._operands).toEqual(['(Items 1)']);
        expect(result[19]._operator).toEqual('ET');
        expect(result[19]._operands).toEqual([]);
        expect(result[20]._operator).toEqual('BT');
        expect(result[20]._operands).toEqual([]);
        expect(result[21]._operator).toEqual('rg');
        expect(result[21]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[22]._operator).toEqual('Tf');
        expect(result[23]._operator).toEqual('Tm');
        expect(result[23]._operands).toEqual(['1.00', '.00', '.00', '1.00', '266.32', '-57.45']);
        expect(result[24]._operator).toEqual('Td');
        expect(result[24]._operands).toEqual(['2.224', '0.000']);
        expect(result[25]._operator).toEqual("'");
        expect(result[25]._operands).toEqual(['(5.)']);
        expect(result[26]._operator).toEqual('ET');
        expect(result[26]._operands).toEqual([]);
        expect(result[27]._operator).toEqual('BT');
        expect(result[27]._operands).toEqual([]);
        expect(result[28]._operator).toEqual('rg');
        expect(result[28]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[29]._operator).toEqual('Tf');
        expect(result[30]._operator).toEqual('Tm');
        expect(result[30]._operands).toEqual(['1.00', '.00', '.00', '1.00', '76.12', '-66.70']);
        expect(result[31]._operator).toEqual('Td');
        expect(result[31]._operands).toEqual(['206.324', '0.000']);
        expect(result[32]._operator).toEqual("'");
        expect(result[32]._operands).toEqual(['(Items 2)']);
        expect(result[33]._operator).toEqual('ET');
        expect(result[33]._operands).toEqual([]);
        expect(result[34]._operator).toEqual('BT');
        expect(result[34]._operands).toEqual([]);
        expect(result[35]._operator).toEqual('rg');
        expect(result[35]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[36]._operator).toEqual('Tf');
        expect(result[37]._operator).toEqual('Tm');
        expect(result[37]._operands).toEqual(['1.00', '.00', '.00', '1.00', '266.32', '-66.70']);
        expect(result[38]._operator).toEqual('Td');
        expect(result[38]._operands).toEqual(['2.224', '0.000']);
        expect(result[39]._operator).toEqual("'");
        expect(result[39]._operands).toEqual(['(6.)']);
        expect(result[40]._operator).toEqual('ET');
        expect(result[40]._operands).toEqual([]);
        expect(result[41]._operator).toEqual('BT');
        expect(result[41]._operands).toEqual([]);
        expect(result[42]._operator).toEqual('rg');
        expect(result[42]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[43]._operator).toEqual('Tf');
        expect(result[44]._operator).toEqual('Tm');
        expect(result[44]._operands).toEqual(['1.00', '.00', '.00', '1.00', '76.12', '-75.94']);
        expect(result[45]._operator).toEqual('Td');
        expect(result[45]._operands).toEqual(['206.324', '0.000']);
        expect(result[46]._operator).toEqual("'");
        expect(result[46]._operands).toEqual(['(Items 3)']);
        expect(result[47]._operator).toEqual('ET');
        expect(result[47]._operands).toEqual([]);
        expect(result[48]._operator).toEqual('BT');
        expect(result[48]._operands).toEqual([]);
        expect(result[49]._operator).toEqual('rg');
        expect(result[49]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[50]._operator).toEqual('Tf');
        expect(result[51]._operator).toEqual('Tm');
        expect(result[51]._operands).toEqual(['1.00', '.00', '.00', '1.00', '266.32', '-75.94']);
        expect(result[52]._operator).toEqual('Td');
        expect(result[52]._operands).toEqual(['2.224', '0.000']);
        expect(result[53]._operator).toEqual("'");
        expect(result[53]._operands).toEqual(['(7.)']);
        expect(result[54]._operator).toEqual('ET');
        expect(result[54]._operands).toEqual([]);
        expect(result[55]._operator).toEqual('BT');
        expect(result[55]._operands).toEqual([]);
        expect(result[56]._operator).toEqual('rg');
        expect(result[56]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[57]._operator).toEqual('Tf');
        expect(result[58]._operator).toEqual('Tm');
        expect(result[58]._operands).toEqual(['1.00', '.00', '.00', '1.00', '76.12', '-85.19']);
        expect(result[59]._operator).toEqual('Td');
        expect(result[59]._operands).toEqual(['206.324', '0.000']);
        expect(result[60]._operator).toEqual("'");
        expect(result[60]._operands).toEqual(['(Items 4)']);
        expect(result[61]._operator).toEqual('ET');
        expect(result[61]._operands).toEqual([]);
        expect(result[62]._operator).toEqual('BT');
        expect(result[62]._operands).toEqual([]);
        expect(result[63]._operator).toEqual('rg');
        expect(result[63]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[64]._operator).toEqual('Tf');
        expect(result[65]._operator).toEqual('Tm');
        expect(result[65]._operands).toEqual(['1.00', '.00', '.00', '1.00', '266.32', '-85.19']);
        expect(result[66]._operator).toEqual('Td');
        expect(result[66]._operands).toEqual(['2.224', '0.000']);
        expect(result[67]._operator).toEqual("'");
        expect(result[67]._operands).toEqual(['(8.)']);
        expect(result[68]._operator).toEqual('ET');
        expect(result[68]._operands).toEqual([]);
        expect(result[69]._operator).toEqual('BT');
        expect(result[69]._operands).toEqual([]);
        expect(result[70]._operator).toEqual('rg');
        expect(result[70]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[71]._operator).toEqual('Tf');
        expect(result[72]._operator).toEqual('Tm');
        expect(result[72]._operands).toEqual(['1.00', '.00', '.00', '1.00', '88.34', '-159.31']);
        expect(result[73]._operator).toEqual("'");
        expect(result[73]._operands).toEqual(['(Items 1)']);
        expect(result[74]._operator).toEqual('ET');
        expect(result[74]._operands).toEqual([]);
        expect(result[75]._operator).toEqual('BT');
        expect(result[75]._operands).toEqual([]);
        expect(result[76]._operator).toEqual('rg');
        expect(result[76]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[77]._operator).toEqual('Tf');
        expect(result[78]._operator).toEqual('Tm');
        expect(result[78]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-159.31']);
        expect(result[79]._operator).toEqual("'");
        expect(result[79]._operands).toEqual(['(1.)']);
        expect(result[80]._operator).toEqual('ET');
        expect(result[80]._operands).toEqual([]);
        expect(result[81]._operator).toEqual('BT');
        expect(result[81]._operands).toEqual([]);
        expect(result[82]._operator).toEqual('rg');
        expect(result[82]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[83]._operator).toEqual('Tf');
        expect(result[84]._operator).toEqual('Tm');
        expect(result[84]._operands).toEqual(['1.00', '.00', '.00', '1.00', '88.34', '-170.87']);
        expect(result[85]._operator).toEqual("'");
        expect(result[85]._operands).toEqual(['(Items 2)']);
        expect(result[86]._operator).toEqual('ET');
        expect(result[86]._operands).toEqual([]);
        expect(result[87]._operator).toEqual('BT');
        expect(result[87]._operands).toEqual([]);
        expect(result[88]._operator).toEqual('rg');
        expect(result[88]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[89]._operator).toEqual('Tf');
        expect(result[90]._operator).toEqual('Tm');
        expect(result[90]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-170.87']);
        expect(result[91]._operator).toEqual("'");
        expect(result[91]._operands).toEqual(['(2.)']);
        expect(result[92]._operator).toEqual('ET');
        expect(result[92]._operands).toEqual([]);
        expect(result[93]._operator).toEqual('BT');
        expect(result[93]._operands).toEqual([]);
        expect(result[94]._operator).toEqual('rg');
        expect(result[94]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[95]._operator).toEqual('Tf');
        expect(result[96]._operator).toEqual('Tm');
        expect(result[96]._operands).toEqual(['1.00', '.00', '.00', '1.00', '88.34', '-182.43']);
        expect(result[97]._operator).toEqual("'");
        expect(result[97]._operands).toEqual(['(Items 3)']);
        expect(result[98]._operator).toEqual('ET');
        expect(result[98]._operands).toEqual([]);
        expect(result[99]._operator).toEqual('BT');
        expect(result[99]._operands).toEqual([]);
        expect(result[100]._operator).toEqual('rg');
        expect(result[100]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[101]._operator).toEqual('Tf');
        expect(result[102]._operator).toEqual('Tm');
        expect(result[102]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-182.43']);
        expect(result[103]._operator).toEqual("'");
        expect(result[103]._operands).toEqual(['(3.)']);
        expect(result[104]._operator).toEqual('ET');
        expect(result[104]._operands).toEqual([]);
        expect(result[105]._operator).toEqual('BT');
        expect(result[105]._operands).toEqual([]);
        expect(result[106]._operator).toEqual('rg');
        expect(result[106]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[107]._operator).toEqual('Tf');
        expect(result[108]._operator).toEqual('Tm');
        expect(result[108]._operands).toEqual(['1.00', '.00', '.00', '1.00', '88.34', '-193.99']);
        expect(result[109]._operator).toEqual("'");
        expect(result[109]._operands).toEqual(['(Items 4)']);
        expect(result[110]._operator).toEqual('ET');
        expect(result[110]._operands).toEqual([]);
        expect(result[111]._operator).toEqual('BT');
        expect(result[111]._operands).toEqual([]);
        expect(result[112]._operator).toEqual('rg');
        expect(result[112]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[113]._operator).toEqual('Tf');
        expect(result[114]._operator).toEqual('Tm');
        expect(result[114]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-193.99']);
        expect(result[115]._operator).toEqual("'");
        expect(result[115]._operands).toEqual(['(4.)']);
        expect(result[116]._operator).toEqual('ET');
        expect(result[116]._operands).toEqual([]);
        expect(result[117]._operator).toEqual('BT');
        expect(result[117]._operands).toEqual([]);
        expect(result[118]._operator).toEqual('d');
        expect(result[118]._operands).toEqual(['[]', '0']);
        expect(result[119]._operator).toEqual('w');
        expect(result[119]._operands).toEqual(['0.500']);
        expect(result[120]._operator).toEqual('j');
        expect(result[120]._operands).toEqual(['0']);
        expect(result[121]._operator).toEqual('J');
        expect(result[121]._operands).toEqual(['0']);
        expect(result[122]._operator).toEqual('RG');
        expect(result[122]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[123]._operator).toEqual('rg');
        expect(result[123]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[124]._operator).toEqual('Tf');
        expect(result[125]._operator).toEqual('Tr');
        expect(result[125]._operands).toEqual(['2']);
        expect(result[126]._operator).toEqual('Tm');
        expect(result[126]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.67', '-257.45']);
        expect(result[127]._operator).toEqual("'");
        expect(result[127]._operands).toEqual(['(Items 1)']);
        expect(result[128]._operator).toEqual('ET');
        expect(result[128]._operands).toEqual([]);
        expect(result[129]._operator).toEqual('BT');
        expect(result[129]._operands).toEqual([]);
        expect(result[130]._operator).toEqual('d');
        expect(result[130]._operands).toEqual(['[]', '0']);
        expect(result[131]._operator).toEqual('w');
        expect(result[131]._operands).toEqual(['0.500']);
        expect(result[132]._operator).toEqual('j');
        expect(result[132]._operands).toEqual(['0']);
        expect(result[133]._operator).toEqual('J');
        expect(result[133]._operands).toEqual(['0']);
        expect(result[134]._operator).toEqual('RG');
        expect(result[134]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[135]._operator).toEqual('rg');
        expect(result[135]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[136]._operator).toEqual('Tf');
        expect(result[137]._operator).toEqual('Tm');
        expect(result[137]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-257.45']);
        expect(result[138]._operator).toEqual("'");
        expect(result[138]._operands).toEqual(['(a.)']);
        expect(result[139]._operator).toEqual('ET');
        expect(result[139]._operands).toEqual([]);
        expect(result[140]._operator).toEqual('BT');
        expect(result[140]._operands).toEqual([]);
        expect(result[141]._operator).toEqual('d');
        expect(result[141]._operands).toEqual(['[]', '0']);
        expect(result[142]._operator).toEqual('w');
        expect(result[142]._operands).toEqual(['0.500']);
        expect(result[143]._operator).toEqual('j');
        expect(result[143]._operands).toEqual(['0']);
        expect(result[144]._operator).toEqual('J');
        expect(result[144]._operands).toEqual(['0']);
        expect(result[145]._operator).toEqual('RG');
        expect(result[145]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[146]._operator).toEqual('rg');
        expect(result[146]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[147]._operator).toEqual('Tf');
        expect(result[148]._operator).toEqual('Tm');
        expect(result[148]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.67', '-266.70']);
        expect(result[149]._operator).toEqual("'");
        expect(result[149]._operands).toEqual(['(Items 2)']);
        expect(result[150]._operator).toEqual('ET');
        expect(result[150]._operands).toEqual([]);
        expect(result[151]._operator).toEqual('BT');
        expect(result[151]._operands).toEqual([]);
        expect(result[152]._operator).toEqual('d');
        expect(result[152]._operands).toEqual(['[]', '0']);
        expect(result[153]._operator).toEqual('w');
        expect(result[153]._operands).toEqual(['0.500']);
        expect(result[154]._operator).toEqual('j');
        expect(result[154]._operands).toEqual(['0']);
        expect(result[155]._operator).toEqual('J');
        expect(result[155]._operands).toEqual(['0']);
        expect(result[156]._operator).toEqual('RG');
        expect(result[156]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[157]._operator).toEqual('rg');
        expect(result[157]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[158]._operator).toEqual('Tf');
        expect(result[159]._operator).toEqual('Tm');
        expect(result[159]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-266.70']);
        expect(result[160]._operator).toEqual("'");
        expect(result[160]._operands).toEqual(['(b.)']);
        expect(result[161]._operator).toEqual('ET');
        expect(result[161]._operands).toEqual([]);
        expect(result[162]._operator).toEqual('BT');
        expect(result[162]._operands).toEqual([]);
        expect(result[163]._operator).toEqual('d');
        expect(result[163]._operands).toEqual(['[]', '0']);
        expect(result[164]._operator).toEqual('w');
        expect(result[164]._operands).toEqual(['0.500']);
        expect(result[165]._operator).toEqual('j');
        expect(result[165]._operands).toEqual(['0']);
        expect(result[166]._operator).toEqual('J');
        expect(result[166]._operands).toEqual(['0']);
        expect(result[167]._operator).toEqual('RG');
        expect(result[167]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[168]._operator).toEqual('rg');
        expect(result[168]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[169]._operator).toEqual('Tf');
        expect(result[170]._operator).toEqual('Tm');
        expect(result[170]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.67', '-275.94']);
        expect(result[171]._operator).toEqual("'");
        expect(result[171]._operands).toEqual(['(Items 3)']);
        expect(result[172]._operator).toEqual('ET');
        expect(result[172]._operands).toEqual([]);
        expect(result[173]._operator).toEqual('BT');
        expect(result[173]._operands).toEqual([]);
        expect(result[174]._operator).toEqual('d');
        expect(result[174]._operands).toEqual(['[]', '0']);
        expect(result[175]._operator).toEqual('w');
        expect(result[175]._operands).toEqual(['0.500']);
        expect(result[176]._operator).toEqual('j');
        expect(result[176]._operands).toEqual(['0']);
        expect(result[177]._operator).toEqual('J');
        expect(result[177]._operands).toEqual(['0']);
        expect(result[178]._operator).toEqual('RG');
        expect(result[178]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[179]._operator).toEqual('rg');
        expect(result[179]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[180]._operator).toEqual('Tf');
        expect(result[181]._operator).toEqual('Tm');
        expect(result[181]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-275.94']);
        expect(result[182]._operator).toEqual('Td');
        expect(result[182]._operands).toEqual(['0.448', '0.000']);
        expect(result[183]._operator).toEqual("'");
        expect(result[183]._operands).toEqual(['(c.)']);
        expect(result[184]._operator).toEqual('ET');
        expect(result[184]._operands).toEqual([]);
        expect(result[185]._operator).toEqual('BT');
        expect(result[185]._operands).toEqual([]);
        expect(result[186]._operator).toEqual('d');
        expect(result[186]._operands).toEqual(['[]', '0']);
        expect(result[187]._operator).toEqual('w');
        expect(result[187]._operands).toEqual(['0.500']);
        expect(result[188]._operator).toEqual('j');
        expect(result[188]._operands).toEqual(['0']);
        expect(result[189]._operator).toEqual('J');
        expect(result[189]._operands).toEqual(['0']);
        expect(result[190]._operator).toEqual('RG');
        expect(result[190]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[191]._operator).toEqual('rg');
        expect(result[191]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[192]._operator).toEqual('Tf');
        expect(result[193]._operator).toEqual('Tm');
        expect(result[193]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.67', '-285.19']);
        expect(result[194]._operator).toEqual("'");
        expect(result[194]._operands).toEqual(['(Items 4)']);
        expect(result[195]._operator).toEqual('ET');
        expect(result[195]._operands).toEqual([]);
        expect(result[196]._operator).toEqual('BT');
        expect(result[196]._operands).toEqual([]);
        expect(result[197]._operator).toEqual('d');
        expect(result[197]._operands).toEqual(['[]', '0']);
        expect(result[198]._operator).toEqual('w');
        expect(result[198]._operands).toEqual(['0.500']);
        expect(result[199]._operator).toEqual('j');
        expect(result[199]._operands).toEqual(['0']);
        expect(result[200]._operator).toEqual('J');
        expect(result[200]._operands).toEqual(['0']);
        expect(result[201]._operator).toEqual('RG');
        expect(result[201]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[202]._operator).toEqual('rg');
        expect(result[202]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[203]._operator).toEqual('Tf');
        expect(result[204]._operator).toEqual('Tm');
        expect(result[204]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-285.19']);
        expect(result[205]._operator).toEqual("'");
        expect(result[205]._operands).toEqual(['(d.)']);
        expect(result[206]._operator).toEqual('ET');
        expect(result[206]._operands).toEqual([]);
        expect(result[207]._operator).toEqual('BT');
        expect(result[207]._operands).toEqual([]);
        expect(result[208]._operator).toEqual('rg');
        expect(result[208]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[209]._operator).toEqual('Tf');
        expect(result[210]._operator).toEqual('Tr');
        expect(result[210]._operands).toEqual(['0']);
        expect(result[211]._operator).toEqual('Tm');
        expect(result[211]._operands).toEqual(['1.00', '.00', '.00', '1.00', '75.22', '-357.45']);
        expect(result[212]._operator).toEqual("'");
        expect(result[212]._operands).toEqual(['(Items 1)']);
        expect(result[213]._operator).toEqual('ET');
        expect(result[213]._operands).toEqual([]);
        expect(result[214]._operator).toEqual('BT');
        expect(result[214]._operands).toEqual([]);
        expect(result[215]._operator).toEqual('rg');
        expect(result[215]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[216]._operator).toEqual('Tf');
        expect(result[217]._operator).toEqual('Tm');
        expect(result[217]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-357.45']);
        expect(result[218]._operator).toEqual('Td');
        expect(result[218]._operands).toEqual(['5.336', '0.000']);
        expect(result[219]._operator).toEqual("'");
        expect(result[219]._operands).toEqual(['(I\\))']);
        expect(result[220]._operator).toEqual('ET');
        expect(result[220]._operands).toEqual([]);
        expect(result[221]._operator).toEqual('BT');
        expect(result[221]._operands).toEqual([]);
        expect(result[222]._operator).toEqual('rg');
        expect(result[222]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[223]._operator).toEqual('Tf');
        expect(result[224]._operator).toEqual('Tm');
        expect(result[224]._operands).toEqual(['1.00', '.00', '.00', '1.00', '75.22', '-366.70']);
        expect(result[225]._operator).toEqual("'");
        expect(result[225]._operands).toEqual(['(Items 2)']);
        expect(result[226]._operator).toEqual('ET');
        expect(result[226]._operands).toEqual([]);
        expect(result[227]._operator).toEqual('BT');
        expect(result[227]._operands).toEqual([]);
        expect(result[228]._operator).toEqual('rg');
        expect(result[228]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[229]._operator).toEqual('Tf');
        expect(result[230]._operator).toEqual('Tm');
        expect(result[230]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-366.70']);
        expect(result[231]._operator).toEqual('Td');
        expect(result[231]._operands).toEqual(['3.112', '0.000']);
        expect(result[232]._operator).toEqual("'");
        expect(result[232]._operands).toEqual(['(II\\))']);
        expect(result[233]._operator).toEqual('ET');
        expect(result[233]._operands).toEqual([]);
        expect(result[234]._operator).toEqual('BT');
        expect(result[234]._operands).toEqual([]);
        expect(result[235]._operator).toEqual('rg');
        expect(result[235]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[236]._operator).toEqual('Tf');
        expect(result[237]._operator).toEqual('Tm');
        expect(result[237]._operands).toEqual(['1.00', '.00', '.00', '1.00', '75.22', '-375.94']);
        expect(result[238]._operator).toEqual("'");
        expect(result[238]._operands).toEqual(['(Items 3)']);
        expect(result[239]._operator).toEqual('ET');
        expect(result[239]._operands).toEqual([]);
        expect(result[240]._operator).toEqual('BT');
        expect(result[240]._operands).toEqual([]);
        expect(result[241]._operator).toEqual('rg');
        expect(result[241]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[242]._operator).toEqual('Tf');
        expect(result[243]._operator).toEqual('Tm');
        expect(result[243]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-375.94']);
        expect(result[244]._operator).toEqual('Td');
        expect(result[244]._operands).toEqual(['0.888', '0.000']);
        expect(result[245]._operator).toEqual("'");
        expect(result[245]._operands).toEqual(['(III\\))']);
        expect(result[246]._operator).toEqual('ET');
        expect(result[246]._operands).toEqual([]);
        expect(result[247]._operator).toEqual('BT');
        expect(result[247]._operands).toEqual([]);
        expect(result[248]._operator).toEqual('rg');
        expect(result[248]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[249]._operator).toEqual('Tf');
        expect(result[250]._operator).toEqual('Tm');
        expect(result[250]._operands).toEqual(['1.00', '.00', '.00', '1.00', '75.22', '-385.19']);
        expect(result[251]._operator).toEqual("'");
        expect(result[251]._operands).toEqual(['(Items 4)']);
        expect(result[252]._operator).toEqual('ET');
        expect(result[252]._operands).toEqual([]);
        expect(result[253]._operator).toEqual('BT');
        expect(result[253]._operands).toEqual([]);
        expect(result[254]._operator).toEqual('rg');
        expect(result[254]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[255]._operator).toEqual('Tf');
        expect(result[256]._operator).toEqual('Tm');
        expect(result[256]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-385.19']);
        expect(result[257]._operator).toEqual("'");
        expect(result[257]._operands).toEqual(['(IV\\))']);
        expect(result[258]._operator).toEqual('ET');
        expect(result[258]._operands).toEqual([]);
        expect(result[259]._operator).toEqual('BT');
        expect(result[259]._operands).toEqual([]);
        expect(result[260]._operator).toEqual('rg');
        expect(result[260]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[261]._operator).toEqual('Tf');
        expect(result[262]._operator).toEqual('Tm');
        expect(result[262]._operands).toEqual(['1.00', '.00', '.00', '1.00', '78.34', '-461.17']);
        expect(result[263]._operator).toEqual("'");
        expect(result[263]._operands).toEqual(['(Items 1)']);
        expect(result[264]._operator).toEqual('ET');
        expect(result[264]._operands).toEqual([]);
        expect(result[265]._operator).toEqual('BT');
        expect(result[265]._operands).toEqual([]);
        expect(result[266]._operator).toEqual('rg');
        expect(result[266]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[267]._operator).toEqual('Tf');
        expect(result[268]._operator).toEqual('Tm');
        expect(result[268]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-461.17']);
        expect(result[269]._operator).toEqual("'");
        expect(result[269]._operands).toEqual(['(1::)']);
        expect(result[270]._operator).toEqual('ET');
        expect(result[270]._operands).toEqual([]);
        expect(result[271]._operator).toEqual('BT');
        expect(result[271]._operands).toEqual([]);
        expect(result[272]._operator).toEqual('rg');
        expect(result[272]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[273]._operator).toEqual('Tf');
        expect(result[274]._operator).toEqual('Tm');
        expect(result[274]._operands).toEqual(['1.00', '.00', '.00', '1.00', '78.34', '-475.04']);
        expect(result[275]._operator).toEqual("'");
        expect(result[275]._operands).toEqual(['(Items 2)']);
        expect(result[276]._operator).toEqual('ET');
        expect(result[276]._operands).toEqual([]);
        expect(result[277]._operator).toEqual('BT');
        expect(result[277]._operands).toEqual([]);
        expect(result[278]._operator).toEqual('rg');
        expect(result[278]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[279]._operator).toEqual('Tf');
        expect(result[280]._operator).toEqual('Tm');
        expect(result[280]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-475.04']);
        expect(result[281]._operator).toEqual("'");
        expect(result[281]._operands).toEqual(['(2::)']);
        expect(result[282]._operator).toEqual('ET');
        expect(result[282]._operands).toEqual([]);
        expect(result[283]._operator).toEqual('BT');
        expect(result[283]._operands).toEqual([]);
        expect(result[284]._operator).toEqual('rg');
        expect(result[284]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[285]._operator).toEqual('Tf');
        expect(result[286]._operator).toEqual('Tm');
        expect(result[286]._operands).toEqual(['1.00', '.00', '.00', '1.00', '78.34', '-488.92']);
        expect(result[287]._operator).toEqual("'");
        expect(result[287]._operands).toEqual(['(Items 3)']);
        expect(result[288]._operator).toEqual('ET');
        expect(result[288]._operands).toEqual([]);
        expect(result[289]._operator).toEqual('BT');
        expect(result[289]._operands).toEqual([]);
        expect(result[290]._operator).toEqual('rg');
        expect(result[290]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[291]._operator).toEqual('Tf');
        expect(result[292]._operator).toEqual('Tm');
        expect(result[292]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-488.92']);
        expect(result[293]._operator).toEqual("'");
        expect(result[293]._operands).toEqual(['(3::)']);
        expect(result[294]._operator).toEqual('ET');
        expect(result[294]._operands).toEqual([]);
        expect(result[295]._operator).toEqual('BT');
        expect(result[295]._operands).toEqual([]);
        expect(result[296]._operator).toEqual('rg');
        expect(result[296]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[297]._operator).toEqual('Tf');
        expect(result[298]._operator).toEqual('Tm');
        expect(result[298]._operands).toEqual(['1.00', '.00', '.00', '1.00', '78.34', '-502.79']);
        expect(result[299]._operator).toEqual("'");
        expect(result[299]._operands).toEqual(['(Items 4)']);
        expect(result[300]._operator).toEqual('ET');
        expect(result[300]._operands).toEqual([]);
        expect(result[301]._operator).toEqual('BT');
        expect(result[301]._operands).toEqual([]);
        expect(result[302]._operator).toEqual('rg');
        expect(result[302]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[303]._operator).toEqual('Tf');
        expect(result[304]._operator).toEqual('Tm');
        expect(result[304]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-502.79']);
        expect(result[305]._operator).toEqual("'");
        expect(result[305]._operands).toEqual(['(4::)']);
        expect(result[306]._operator).toEqual('ET');
        expect(result[306]._operands).toEqual([]);
        expect(result[307]._operator).toEqual('BT');
        expect(result[307]._operands).toEqual([]);
        expect(result[308]._operator).toEqual('d');
        expect(result[308]._operands).toEqual(['[]', '0']);
        expect(result[309]._operator).toEqual('w');
        expect(result[309]._operands).toEqual(['2.000']);
        expect(result[310]._operator).toEqual('j');
        expect(result[310]._operands).toEqual(['0']);
        expect(result[311]._operator).toEqual('J');
        expect(result[311]._operands).toEqual(['0']);
        expect(result[312]._operator).toEqual('RG');
        expect(result[312]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[313]._operator).toEqual('rg');
        expect(result[313]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[314]._operator).toEqual('Tf');
        expect(result[315]._operator).toEqual('Tr');
        expect(result[315]._operands).toEqual(['2']);
        expect(result[316]._operator).toEqual('Tm');
        expect(result[316]._operands).toEqual(['1.00', '.00', '.00', '1.00', '73.00', '-557.45']);
        expect(result[317]._operator).toEqual('Td');
        expect(result[317]._operands).toEqual(['207.884', '0.000']);
        expect(result[318]._operator).toEqual("'");
        expect(result[318]._operands).toEqual(['(Items 1)']);
        expect(result[319]._operator).toEqual('ET');
        expect(result[319]._operands).toEqual([]);
        expect(result[320]._operator).toEqual('BT');
        expect(result[320]._operands).toEqual([]);
        expect(result[321]._operator).toEqual('d');
        expect(result[321]._operands).toEqual(['[]', '0']);
        expect(result[322]._operator).toEqual('w');
        expect(result[322]._operands).toEqual(['2.000']);
        expect(result[323]._operator).toEqual('j');
        expect(result[323]._operands).toEqual(['0']);
        expect(result[324]._operator).toEqual('J');
        expect(result[324]._operands).toEqual(['0']);
        expect(result[325]._operator).toEqual('RG');
        expect(result[325]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[326]._operator).toEqual('rg');
        expect(result[326]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[327]._operator).toEqual('Tf');
        expect(result[328]._operator).toEqual('Tm');
        expect(result[328]._operands).toEqual(['1.00', '.00', '.00', '1.00', '267.88', '-557.45']);
        expect(result[329]._operator).toEqual('Td');
        expect(result[329]._operands).toEqual(['0.220', '0.000']);
        expect(result[330]._operator).toEqual("'");
        expect(result[330]._operands).toEqual(['(A.)']);
        expect(result[331]._operator).toEqual('ET');
        expect(result[331]._operands).toEqual([]);
        expect(result[332]._operator).toEqual('BT');
        expect(result[332]._operands).toEqual([]);
        expect(result[333]._operator).toEqual('d');
        expect(result[333]._operands).toEqual(['[]', '0']);
        expect(result[334]._operator).toEqual('w');
        expect(result[334]._operands).toEqual(['2.000']);
        expect(result[335]._operator).toEqual('j');
        expect(result[335]._operands).toEqual(['0']);
        expect(result[336]._operator).toEqual('J');
        expect(result[336]._operands).toEqual(['0']);
        expect(result[337]._operator).toEqual('RG');
        expect(result[337]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[338]._operator).toEqual('rg');
        expect(result[338]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[339]._operator).toEqual('Tf');
        expect(result[340]._operator).toEqual('Tm');
        expect(result[340]._operands).toEqual(['1.00', '.00', '.00', '1.00', '73.00', '-566.70']);
        expect(result[341]._operator).toEqual('Td');
        expect(result[341]._operands).toEqual(['207.884', '0.000']);
        expect(result[342]._operator).toEqual("'");
        expect(result[342]._operands).toEqual(['(Items 2)']);
        expect(result[343]._operator).toEqual('ET');
        expect(result[343]._operands).toEqual([]);
        expect(result[344]._operator).toEqual('BT');
        expect(result[344]._operands).toEqual([]);
        expect(result[345]._operator).toEqual('d');
        expect(result[345]._operands).toEqual(['[]', '0']);
        expect(result[346]._operator).toEqual('w');
        expect(result[346]._operands).toEqual(['2.000']);
        expect(result[347]._operator).toEqual('j');
        expect(result[347]._operands).toEqual(['0']);
        expect(result[348]._operator).toEqual('J');
        expect(result[348]._operands).toEqual(['0']);
        expect(result[349]._operator).toEqual('RG');
        expect(result[349]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[350]._operator).toEqual('rg');
        expect(result[350]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[351]._operator).toEqual('Tf');
        expect(result[352]._operator).toEqual('Tm');
        expect(result[352]._operands).toEqual(['1.00', '.00', '.00', '1.00', '267.88', '-566.70']);
        expect(result[353]._operator).toEqual('Td');
        expect(result[353]._operands).toEqual(['0.220', '0.000']);
        expect(result[354]._operator).toEqual("'");
        expect(result[354]._operands).toEqual(['(B.)']);
        expect(result[355]._operator).toEqual('ET');
        expect(result[355]._operands).toEqual([]);
        expect(result[356]._operator).toEqual('BT');
        expect(result[356]._operands).toEqual([]);
        expect(result[357]._operator).toEqual('d');
        expect(result[357]._operands).toEqual(['[]', '0']);
        expect(result[358]._operator).toEqual('w');
        expect(result[358]._operands).toEqual(['2.000']);
        expect(result[359]._operator).toEqual('j');
        expect(result[359]._operands).toEqual(['0']);
        expect(result[360]._operator).toEqual('J');
        expect(result[360]._operands).toEqual(['0']);
        expect(result[361]._operator).toEqual('RG');
        expect(result[361]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[362]._operator).toEqual('rg');
        expect(result[362]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[363]._operator).toEqual('Tf');
        expect(result[364]._operator).toEqual('Tm');
        expect(result[364]._operands).toEqual(['1.00', '.00', '.00', '1.00', '73.00', '-575.94']);
        expect(result[365]._operator).toEqual('Td');
        expect(result[365]._operands).toEqual(['207.884', '0.000']);
        expect(result[366]._operator).toEqual("'");
        expect(result[366]._operands).toEqual(['(Items 3)']);
        expect(result[367]._operator).toEqual('ET');
        expect(result[367]._operands).toEqual([]);
        expect(result[368]._operator).toEqual('BT');
        expect(result[368]._operands).toEqual([]);
        expect(result[369]._operator).toEqual('d');
        expect(result[369]._operands).toEqual(['[]', '0']);
        expect(result[370]._operator).toEqual('w');
        expect(result[370]._operands).toEqual(['2.000']);
        expect(result[371]._operator).toEqual('j');
        expect(result[371]._operands).toEqual(['0']);
        expect(result[372]._operator).toEqual('J');
        expect(result[372]._operands).toEqual(['0']);
        expect(result[373]._operator).toEqual('RG');
        expect(result[373]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[374]._operator).toEqual('rg');
        expect(result[374]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[375]._operator).toEqual('Tf');
        expect(result[376]._operator).toEqual('Tm');
        expect(result[376]._operands).toEqual(['1.00', '.00', '.00', '1.00', '267.88', '-575.94']);
        expect(result[377]._operator).toEqual("'");
        expect(result[377]._operands).toEqual(['(C.)']);
        expect(result[378]._operator).toEqual('ET');
        expect(result[378]._operands).toEqual([]);
        expect(result[379]._operator).toEqual('BT');
        expect(result[379]._operands).toEqual([]);
        expect(result[380]._operator).toEqual('d');
        expect(result[380]._operands).toEqual(['[]', '0']);
        expect(result[381]._operator).toEqual('w');
        expect(result[381]._operands).toEqual(['2.000']);
        expect(result[382]._operator).toEqual('j');
        expect(result[382]._operands).toEqual(['0']);
        expect(result[383]._operator).toEqual('J');
        expect(result[383]._operands).toEqual(['0']);
        expect(result[384]._operator).toEqual('RG');
        expect(result[384]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[385]._operator).toEqual('rg');
        expect(result[385]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[386]._operator).toEqual('Tf');
        expect(result[387]._operator).toEqual('Tm');
        expect(result[387]._operands).toEqual(['1.00', '.00', '.00', '1.00', '73.00', '-585.19']);
        expect(result[388]._operator).toEqual('Td');
        expect(result[388]._operands).toEqual(['207.884', '0.000']);
        expect(result[389]._operator).toEqual("'");
        expect(result[389]._operands).toEqual(['(Items 4)']);
        expect(result[390]._operator).toEqual('ET');
        expect(result[390]._operands).toEqual([]);
        expect(result[391]._operator).toEqual('BT');
        expect(result[391]._operands).toEqual([]);
        expect(result[392]._operator).toEqual('d');
        expect(result[392]._operands).toEqual(['[]', '0']);
        expect(result[393]._operator).toEqual('w');
        expect(result[393]._operands).toEqual(['2.000']);
        expect(result[394]._operator).toEqual('j');
        expect(result[394]._operands).toEqual(['0']);
        expect(result[395]._operator).toEqual('J');
        expect(result[395]._operands).toEqual(['0']);
        expect(result[396]._operator).toEqual('RG');
        expect(result[396]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[397]._operator).toEqual('rg');
        expect(result[397]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[398]._operator).toEqual('Tf');
        expect(result[399]._operator).toEqual('Tm');
        expect(result[399]._operands).toEqual(['1.00', '.00', '.00', '1.00', '267.88', '-585.19']);
        expect(result[400]._operator).toEqual("'");
        expect(result[400]._operands).toEqual(['(D.)']);
        expect(result[401]._operator).toEqual('ET');
        expect(result[401]._operands).toEqual([]);
        expect(result[402]._operator).toEqual('BT');
        expect(result[402]._operands).toEqual([]);
        expect(result[403]._operator).toEqual('d');
        expect(result[403]._operands).toEqual(['[]', '0']);
        expect(result[404]._operator).toEqual('w');
        expect(result[404]._operands).toEqual(['0.500']);
        expect(result[405]._operator).toEqual('j');
        expect(result[405]._operands).toEqual(['0']);
        expect(result[406]._operator).toEqual('J');
        expect(result[406]._operands).toEqual(['0']);
        expect(result[407]._operator).toEqual('RG');
        expect(result[407]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[408]._operator).toEqual('rg');
        expect(result[408]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[409]._operator).toEqual('Tf');
        expect(result[410]._operator).toEqual('Tm');
        expect(result[410]._operands).toEqual(['1.00', '.00', '.00', '1.00', '172.33', '-57.45']);
        expect(result[411]._operator).toEqual("'");
        expect(result[411]._operands).toEqual(['(Items 1)']);
        expect(result[412]._operator).toEqual('ET');
        expect(result[412]._operands).toEqual([]);
        expect(result[413]._operator).toEqual('q');
        expect(result[413]._operands).toEqual([]);
        expect(result[414]._operator).toEqual('cm');
        expect(result[414]._operands).toEqual(['1.00', '.00', '.00', '1.00', '160.00', '-58.70']);
        expect(result[415]._operator).toEqual('Do');
        expect(result[416]._operator).toEqual('Q');
        expect(result[416]._operands).toEqual([]);
        expect(result[417]._operator).toEqual('BT');
        expect(result[417]._operands).toEqual([]);
        expect(result[418]._operator).toEqual('d');
        expect(result[418]._operands).toEqual(['[]', '0']);
        expect(result[419]._operator).toEqual('w');
        expect(result[419]._operands).toEqual(['0.500']);
        expect(result[420]._operator).toEqual('j');
        expect(result[420]._operands).toEqual(['0']);
        expect(result[421]._operator).toEqual('J');
        expect(result[421]._operands).toEqual(['0']);
        expect(result[422]._operator).toEqual('RG');
        expect(result[422]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[423]._operator).toEqual('rg');
        expect(result[423]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[424]._operator).toEqual('Tf');
        expect(result[425]._operator).toEqual('Tm');
        expect(result[425]._operands).toEqual(['1.00', '.00', '.00', '1.00', '172.33', '-66.70']);
        expect(result[426]._operator).toEqual("'");
        expect(result[426]._operands).toEqual(['(Items 2)']);
        expect(result[427]._operator).toEqual('ET');
        expect(result[427]._operands).toEqual([]);
        expect(result[428]._operator).toEqual('q');
        expect(result[428]._operands).toEqual([]);
        expect(result[429]._operator).toEqual('cm');
        expect(result[429]._operands).toEqual(['1.00', '.00', '.00', '1.00', '160.00', '-67.95']);
        expect(result[430]._operator).toEqual('Do');
        expect(result[431]._operator).toEqual('Q');
        expect(result[431]._operands).toEqual([]);
        expect(result[432]._operator).toEqual('BT');
        expect(result[432]._operands).toEqual([]);
        expect(result[433]._operator).toEqual('d');
        expect(result[433]._operands).toEqual(['[]', '0']);
        expect(result[434]._operator).toEqual('w');
        expect(result[434]._operands).toEqual(['0.500']);
        expect(result[435]._operator).toEqual('j');
        expect(result[435]._operands).toEqual(['0']);
        expect(result[436]._operator).toEqual('J');
        expect(result[436]._operands).toEqual(['0']);
        expect(result[437]._operator).toEqual('RG');
        expect(result[437]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[438]._operator).toEqual('rg');
        expect(result[438]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[439]._operator).toEqual('Tf');
        expect(result[440]._operator).toEqual('Tm');
        expect(result[440]._operands).toEqual(['1.00', '.00', '.00', '1.00', '172.33', '-75.94']);
        expect(result[441]._operator).toEqual("'");
        expect(result[441]._operands).toEqual(['(Items 3)']);
        expect(result[442]._operator).toEqual('ET');
        expect(result[442]._operands).toEqual([]);
        expect(result[443]._operator).toEqual('q');
        expect(result[443]._operands).toEqual([]);
        expect(result[444]._operator).toEqual('cm');
        expect(result[444]._operands).toEqual(['1.00', '.00', '.00', '1.00', '160.00', '-77.20']);
        expect(result[445]._operator).toEqual('Do');
        expect(result[446]._operator).toEqual('Q');
        expect(result[446]._operands).toEqual([]);
        expect(result[447]._operator).toEqual('BT');
        expect(result[447]._operands).toEqual([]);
        expect(result[448]._operator).toEqual('d');
        expect(result[448]._operands).toEqual(['[]', '0']);
        expect(result[449]._operator).toEqual('w');
        expect(result[449]._operands).toEqual(['0.500']);
        expect(result[450]._operator).toEqual('j');
        expect(result[450]._operands).toEqual(['0']);
        expect(result[451]._operator).toEqual('J');
        expect(result[451]._operands).toEqual(['0']);
        expect(result[452]._operator).toEqual('RG');
        expect(result[452]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[453]._operator).toEqual('rg');
        expect(result[453]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[454]._operator).toEqual('Tf');
        expect(result[455]._operator).toEqual('Tm');
        expect(result[455]._operands).toEqual(['1.00', '.00', '.00', '1.00', '172.33', '-85.19']);
        expect(result[456]._operator).toEqual("'");
        expect(result[456]._operands).toEqual(['(Items 4)']);
        expect(result[457]._operator).toEqual('ET');
        expect(result[457]._operands).toEqual([]);
        expect(result[458]._operator).toEqual('q');
        expect(result[458]._operands).toEqual([]);
        expect(result[459]._operator).toEqual('cm');
        expect(result[459]._operands).toEqual(['1.00', '.00', '.00', '1.00', '160.00', '-86.45']);
        expect(result[460]._operator).toEqual('Do');
        expect(result[461]._operator).toEqual('Q');
        expect(result[461]._operands).toEqual([]);
        expect(result[462]._operator).toEqual('BT');
        expect(result[462]._operands).toEqual([]);
        expect(result[463]._operator).toEqual('rg');
        expect(result[463]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[464]._operator).toEqual('Tf');
        expect(result[465]._operator).toEqual('Tr');
        expect(result[465]._operands).toEqual(['0']);
        expect(result[466]._operator).toEqual('Tm');
        expect(result[466]._operands).toEqual(['1.00', '.00', '.00', '1.00', '170.00', '-159.88']);
        expect(result[467]._operator).toEqual("'");
        expect(result[467]._operands).toEqual(['(Items 1)']);
        expect(result[468]._operator).toEqual('ET');
        expect(result[468]._operands).toEqual([]);
        expect(result[469]._operator).toEqual('q');
        expect(result[469]._operands).toEqual([]);
        expect(result[470]._operator).toEqual('cm');
        expect(result[470]._operands).toEqual(['1.00', '.00', '.00', '1.00', '207.69', '-311.00']);
        expect(result[471]._operator).toEqual('Do');
        expect(result[472]._operator).toEqual('Q');
        expect(result[472]._operands).toEqual([]);
        expect(result[473]._operator).toEqual('BT');
        expect(result[473]._operands).toEqual([]);
        expect(result[474]._operator).toEqual('rg');
        expect(result[474]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[475]._operator).toEqual('Tf');
        expect(result[476]._operator).toEqual('Tm');
        expect(result[476]._operands).toEqual(['1.00', '.00', '.00', '1.00', '170.00', '-172.15']);
        expect(result[477]._operator).toEqual("'");
        expect(result[477]._operands).toEqual(['(Items 2)']);
        expect(result[478]._operator).toEqual('ET');
        expect(result[478]._operands).toEqual([]);
        expect(result[479]._operator).toEqual('q');
        expect(result[479]._operands).toEqual([]);
        expect(result[480]._operator).toEqual('cm');
        expect(result[480]._operands).toEqual(['1.00', '.00', '.00', '1.00', '207.69', '-335.55']);
        expect(result[481]._operator).toEqual('Do');
        expect(result[482]._operator).toEqual('Q');
        expect(result[482]._operands).toEqual([]);
        expect(result[483]._operator).toEqual('BT');
        expect(result[483]._operands).toEqual([]);
        expect(result[484]._operator).toEqual('rg');
        expect(result[484]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[485]._operator).toEqual('Tf');
        expect(result[486]._operator).toEqual('Tm');
        expect(result[486]._operands).toEqual(['1.00', '.00', '.00', '1.00', '170.00', '-184.43']);
        expect(result[487]._operator).toEqual("'");
        expect(result[487]._operands).toEqual(['(Items 3)']);
        expect(result[488]._operator).toEqual('ET');
        expect(result[488]._operands).toEqual([]);
        expect(result[489]._operator).toEqual('q');
        expect(result[489]._operands).toEqual([]);
        expect(result[490]._operator).toEqual('cm');
        expect(result[490]._operands).toEqual(['1.00', '.00', '.00', '1.00', '207.69', '-360.10']);
        expect(result[491]._operator).toEqual('Do');
        expect(result[492]._operator).toEqual('Q');
        expect(result[492]._operands).toEqual([]);
        expect(result[493]._operator).toEqual('BT');
        expect(result[493]._operands).toEqual([]);
        expect(result[494]._operator).toEqual('rg');
        expect(result[494]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[495]._operator).toEqual('Tf');
        expect(result[496]._operator).toEqual('Tm');
        expect(result[496]._operands).toEqual(['1.00', '.00', '.00', '1.00', '170.00', '-196.71']);
        expect(result[497]._operator).toEqual("'");
        expect(result[497]._operands).toEqual(['(Items 4)']);
        expect(result[498]._operator).toEqual('ET');
        expect(result[498]._operands).toEqual([]);
        expect(result[499]._operator).toEqual('q');
        expect(result[499]._operands).toEqual([]);
        expect(result[500]._operator).toEqual('cm');
        expect(result[500]._operands).toEqual(['1.00', '.00', '.00', '1.00', '207.69', '-384.66']);
        expect(result[501]._operator).toEqual('Do');
        expect(result[502]._operator).toEqual('Q');
        expect(result[502]._operands).toEqual([]);
        expect(result[503]._operator).toEqual('BT');
        expect(result[503]._operands).toEqual([]);
        expect(result[504]._operator).toEqual('rg');
        expect(result[504]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[505]._operator).toEqual('Tf');
        expect(result[506]._operator).toEqual('Tm');
        expect(result[506]._operands).toEqual(['1.00', '.00', '.00', '1.00', '176.09', '-257.45']);
        expect(result[507]._operator).toEqual('Tw');
        expect(result[507]._operands).toEqual(['0.000']);
        expect(result[508]._operator).toEqual("'");
        expect(result[508]._operands).toEqual(['(Items 1)']);
        expect(result[509]._operator).toEqual('ET');
        expect(result[509]._operands).toEqual([]);
        expect(result[510]._operator).toEqual('q');
        expect(result[510]._operands).toEqual([]);
        expect(result[511]._operator).toEqual('cm');
        expect(result[511]._operands).toEqual(['1.00', '.00', '.00', '1.00', '160.00', '-508.00']);
        expect(result[512]._operator).toEqual('Do');
        expect(result[513]._operator).toEqual('Q');
        expect(result[513]._operands).toEqual([]);
        expect(result[514]._operator).toEqual('BT');
        expect(result[514]._operands).toEqual([]);
        expect(result[515]._operator).toEqual('rg');
        expect(result[515]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[516]._operator).toEqual('Tf');
        expect(result[517]._operator).toEqual('Tm');
        expect(result[517]._operands).toEqual(['1.00', '.00', '.00', '1.00', '176.09', '-266.70']);
        expect(result[518]._operator).toEqual('Tw');
        expect(result[518]._operands).toEqual(['0.000']);
        expect(result[519]._operator).toEqual("'");
        expect(result[519]._operands).toEqual(['(Items 2)']);
        expect(result[520]._operator).toEqual('ET');
        expect(result[520]._operands).toEqual([]);
        expect(result[521]._operator).toEqual('q');
        expect(result[521]._operands).toEqual([]);
        expect(result[522]._operator).toEqual('cm');
        expect(result[522]._operands).toEqual(['1.00', '.00', '.00', '1.00', '160.00', '-526.50']);
        expect(result[523]._operator).toEqual('Do');
        expect(result[524]._operator).toEqual('Q');
        expect(result[524]._operands).toEqual([]);
        expect(result[525]._operator).toEqual('BT');
        expect(result[525]._operands).toEqual([]);
        expect(result[526]._operator).toEqual('rg');
        expect(result[526]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[527]._operator).toEqual('Tf');
        expect(result[528]._operator).toEqual('Tm');
        expect(result[528]._operands).toEqual(['1.00', '.00', '.00', '1.00', '176.09', '-275.94']);
        expect(result[529]._operator).toEqual('Tw');
        expect(result[529]._operands).toEqual(['0.000']);
        expect(result[530]._operator).toEqual("'");
        expect(result[530]._operands).toEqual(['(Items 3)']);
        expect(result[531]._operator).toEqual('ET');
        expect(result[531]._operands).toEqual([]);
        expect(result[532]._operator).toEqual('q');
        expect(result[532]._operands).toEqual([]);
        expect(result[533]._operator).toEqual('cm');
        expect(result[533]._operands).toEqual(['1.00', '.00', '.00', '1.00', '160.00', '-544.99']);
        expect(result[534]._operator).toEqual('Do');
        expect(result[535]._operator).toEqual('Q');
        expect(result[535]._operands).toEqual([]);
        expect(result[536]._operator).toEqual('BT');
        expect(result[536]._operands).toEqual([]);
        expect(result[537]._operator).toEqual('rg');
        expect(result[537]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[538]._operator).toEqual('Tf');
        expect(result[539]._operator).toEqual('Tm');
        expect(result[539]._operands).toEqual(['1.00', '.00', '.00', '1.00', '176.09', '-285.19']);
        expect(result[540]._operator).toEqual('Tw');
        expect(result[540]._operands).toEqual(['0.000']);
        expect(result[541]._operands).toEqual(['(Items 4)']);
        expect(result[542]._operator).toEqual('ET');
        expect(result[542]._operands).toEqual([]);
        expect(result[543]._operator).toEqual('q');
        expect(result[543]._operands).toEqual([]);
        expect(result[544]._operator).toEqual('cm');
        expect(result[544]._operands).toEqual(['1.00', '.00', '.00', '1.00', '160.00', '-563.49']);
        expect(result[545]._operator).toEqual('Do');
        expect(result[546]._operator).toEqual('Q');
        expect(result[546]._operands).toEqual([]);
        document.destroy();
    });
});
describe('985200 Font Embedding', () => {
    it('985200 - 1', () => {
        let doc = new PdfDocument();
        let page = doc.addPage();
        let pen: any;
        const embedded = doc.embedFont(PdfFontFamily.timesRoman, 12, PdfFontStyle.regular);
        page.graphics.drawString('timesRoman with regular', embedded, { x: 10, y: 10, width: 300, height: 24 }, pen);
        const embedded1 = doc.embedFont(PdfFontFamily.timesRoman, 14, PdfFontStyle.bold);
        page.graphics.drawString('timesRoman with bold', embedded1, { x: 10, y: 50, width: 300, height: 24 }, pen);
        const embedded2 = doc.embedFont(PdfFontFamily.timesRoman, 15, PdfFontStyle.italic);
        page.graphics.drawString('timesRoman with bold', embedded2, { x: 10, y: 100, width: 300, height: 24 }, pen);
        const embedded3 = doc.embedFont(PdfCjkFontFamily.hanyangSystemsGothicMedium, 12, PdfFontStyle.regular, true);
        page.graphics.drawString('Cjkfont with regular', embedded3, { x: 100, y: 10, width: 300, height: 24 }, pen);
        const embedded4 = doc.embedFont(PdfCjkFontFamily.hanyangSystemsGothicMedium, 14, PdfFontStyle.bold, true);
        page.graphics.drawString('Cjkfont with bold', embedded4, { x: 100, y: 50, width: 300, height: 24 }, pen);
        const embedded5 = doc.embedFont(PdfCjkFontFamily.hanyangSystemsGothicMedium, 15, PdfFontStyle.italic, true);
        page.graphics.drawString('Cjkfont with bold', embedded5, { x: 100, y: 100, width: 300, height: 24 }, pen);
        const output = doc.save();
        expect(output.length).toBeGreaterThan(0);
        doc = new PdfDocument(output);
        page = doc.getPage(0);
        let resources: _PdfDictionary = page._pageDictionary.get('Resources') as _PdfDictionary;
        let fontEntry: _PdfDictionary = resources.get('Font');
        expect(fontEntry.size).toEqual(6);
        let appearance = page._pageDictionary.getArray('Contents') as any[];
        expect(appearance).not.toBeUndefined();
        let stream: _PdfContentStream = appearance[2] as _PdfContentStream;
        let parser: _ContentParser = new _ContentParser(stream.getBytes());
        let result = parser._readContent();
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands).toEqual([]);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands).toEqual([]);
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands).toEqual([]);
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands).toEqual([]);
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
        expect(result[7]._operator).toEqual('BT');
        expect(result[7]._operands).toEqual([]);
        expect(result[8]._operator).toEqual('Tf');
        expect(result[9]._operator).toEqual('Tr');
        expect(result[9]._operands).toEqual(['0']);
        expect(result[10]._operator).toEqual('Tc');
        expect(result[10]._operands).toEqual(['0.000']);
        expect(result[11]._operator).toEqual('Tw');
        expect(result[11]._operands).toEqual(['0.000']);
        expect(result[12]._operator).toEqual('Tz');
        expect(result[12]._operands).toEqual(['100.000']);
        expect(result[13]._operator).toEqual('Tm');
        expect(result[13]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-20.78']);
        expect(result[14]._operator).toEqual("'");
        expect(result[14]._operands).toEqual(['(timesRoman with regular)']);
        expect(result[15]._operator).toEqual('ET');
        expect(result[15]._operands).toEqual([]);
        expect(result[16]._operator).toEqual('BT');
        expect(result[16]._operands).toEqual([]);
        expect(result[17]._operator).toEqual('Tf');
        expect(result[18]._operator).toEqual('Tm');
        expect(result[18]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-63.09']);
        expect(result[19]._operator).toEqual("'");
        expect(result[19]._operands).toEqual(['(timesRoman with bold)']);
        expect(result[20]._operator).toEqual('ET');
        expect(result[20]._operands).toEqual([]);
        expect(result[21]._operator).toEqual('BT');
        expect(result[21]._operands).toEqual([]);
        expect(result[22]._operator).toEqual('Tf');
        expect(result[23]._operator).toEqual('Tm');
        expect(result[23]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-113.25']);
        expect(result[24]._operator).toEqual("'");
        expect(result[24]._operands).toEqual(['(timesRoman with bold)']);
        expect(result[25]._operator).toEqual('ET');
        expect(result[25]._operands).toEqual([]);
        expect(result[26]._operator).toEqual('BT');
        expect(result[26]._operands).toEqual([]);
        expect(result[27]._operator).toEqual('Tf');
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '100.00', '-20.56']);
        expect(result[29]._operator).toEqual("'");
        expect(result[29]._operands).toEqual(['(\u0000C\u0000j\u0000k\u0000f\u0000o\u0000n\u0000t\u0000 \u0000w\u0000i\u0000t\u0000h\u0000 \u0000r\u0000e\u0000g\u0000u\u0000l\u0000a\u0000r)']);
        expect(result[30]._operator).toEqual('ET');
        expect(result[30]._operands).toEqual([]);
        expect(result[31]._operator).toEqual('BT');
        expect(result[31]._operands).toEqual([]);
        expect(result[32]._operator).toEqual('Tf');
        expect(result[33]._operator).toEqual('Tm');
        expect(result[33]._operands).toEqual(['1.00', '.00', '.00', '1.00', '100.00', '-62.32']);
        expect(result[34]._operator).toEqual("'");
        expect(result[34]._operands).toEqual(['(\u0000C\u0000j\u0000k\u0000f\u0000o\u0000n\u0000t\u0000 \u0000w\u0000i\u0000t\u0000h\u0000 \u0000b\u0000o\u0000l\u0000d)']);
        expect(result[35]._operator).toEqual('ET');
        expect(result[35]._operands).toEqual([]);
        expect(result[36]._operator).toEqual('BT');
        expect(result[36]._operands).toEqual([]);
        expect(result[37]._operator).toEqual('Tf');
        expect(result[38]._operator).toEqual('Tm');
        expect(result[38]._operands).toEqual(['1.00', '.00', '.00', '1.00', '100.00', '-113.20']);
        expect(result[39]._operator).toEqual("'");
        expect(result[39]._operands).toEqual(['(\u0000C\u0000j\u0000k\u0000f\u0000o\u0000n\u0000t\u0000 \u0000w\u0000i\u0000t\u0000h\u0000 \u0000b\u0000o\u0000l\u0000d)']);
        expect(result[40]._operator).toEqual('ET');
        expect(result[40]._operands).toEqual([]);
        doc.destroy();
    });
    it('985200 - 2', () => {
        let doc = new PdfDocument();
        let page = doc.addPage();
        let pen: any;
        let embedded = doc.embedFont(PdfFontFamily.symbol, 11, PdfFontStyle.regular);
        page.graphics.drawString('String with font size 11', embedded, { x: 10, y: 10, width: 300, height: 200 }, new PdfPen({ r: 255, g: 0, b: 255 }, 1), new PdfBrush({ r: 255, g: 0, b: 255 }));
        embedded = doc.embedFont(PdfFontFamily.symbol, 13, PdfFontStyle.regular);
        page.graphics.drawString('String with font size 13', embedded, { x: 10, y: 30, width: 300, height: 200 }, new PdfPen({ r: 255, g: 0, b: 255 }, 1), new PdfBrush({ r: 255, g: 0, b: 255 }));
        embedded = doc.embedFont(PdfFontFamily.symbol, 14, PdfFontStyle.regular);
        page.graphics.drawString('String with font size 14', embedded, { x: 10, y: 60, width: 300, height: 200 }, pen);
        embedded = doc.embedFont(PdfFontFamily.symbol, 15, PdfFontStyle.regular);
        page.graphics.drawString('String with font size 15', embedded, { x: 10, y: 90, width: 300, height: 200 }, pen);
        const output = doc.save() as Uint8Array;
        expect(output.length).toBeGreaterThan(0);
        doc = new PdfDocument(output);
        page = doc.getPage(0);
        let resources: _PdfDictionary = page._pageDictionary.get('Resources') as _PdfDictionary;
        let fontEntry: any = resources.get('Font');
        expect(fontEntry.size).toEqual(1);
        let appearance = page._pageDictionary.getArray('Contents') as any[];
        expect(appearance).not.toBeUndefined();
        let stream: _PdfContentStream = appearance[2] as _PdfContentStream;
        let parser: _ContentParser = new _ContentParser(stream.getBytes());
        let result = parser._readContent();
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands).toEqual([]);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands).toEqual([]);
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands).toEqual([]);
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands).toEqual([]);
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
        expect(result[7]._operator).toEqual('BT');
        expect(result[7]._operands).toEqual([]);
        expect(result[8]._operator).toEqual('CS');
        expect(result[8]._operands).toEqual(['/DeviceRGB']);
        expect(result[9]._operator).toEqual('cs');
        expect(result[9]._operands).toEqual(['/DeviceRGB']);
        expect(result[10]._operator).toEqual('d');
        expect(result[10]._operands).toEqual(['[]', '0']);
        expect(result[11]._operator).toEqual('w');
        expect(result[11]._operands).toEqual(['1.000']);
        expect(result[12]._operator).toEqual('j');
        expect(result[12]._operands).toEqual(['0']);
        expect(result[13]._operator).toEqual('J');
        expect(result[13]._operands).toEqual(['0']);
        expect(result[14]._operator).toEqual('RG');
        expect(result[14]._operands).toEqual(['1.000', '0.000', '1.000']);
        expect(result[15]._operator).toEqual('rg');
        expect(result[15]._operands).toEqual(['1.000', '0.000', '1.000']);
        expect(result[16]._operator).toEqual('Tf');
        expect(result[17]._operator).toEqual('Tr');
        expect(result[17]._operands).toEqual(['2']);
        expect(result[18]._operator).toEqual('Tc');
        expect(result[18]._operands).toEqual(['0.000']);
        expect(result[19]._operator).toEqual('Tw');
        expect(result[19]._operands).toEqual(['0.000']);
        expect(result[20]._operator).toEqual('Tz');
        expect(result[20]._operands).toEqual(['100.000']);
        expect(result[21]._operator).toEqual('Tm');
        expect(result[21]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-21.11']);
        expect(result[22]._operator).toEqual("'");
        expect(result[22]._operands).toEqual(['(String with font size 11)']);
        expect(result[23]._operator).toEqual('ET');
        expect(result[23]._operands).toEqual([]);
        expect(result[24]._operator).toEqual('BT');
        expect(result[24]._operands).toEqual([]);
        expect(result[25]._operator).toEqual('d');
        expect(result[25]._operands).toEqual(['[]', '0']);
        expect(result[26]._operator).toEqual('w');
        expect(result[26]._operands).toEqual(['1.000']);
        expect(result[27]._operator).toEqual('j');
        expect(result[27]._operands).toEqual(['0']);
        expect(result[28]._operator).toEqual('J');
        expect(result[28]._operands).toEqual(['0']);
        expect(result[29]._operator).toEqual('RG');
        expect(result[29]._operands).toEqual(['1.000', '0.000', '1.000']);
        expect(result[30]._operator).toEqual('rg');
        expect(result[30]._operands).toEqual(['1.000', '0.000', '1.000']);
        expect(result[31]._operator).toEqual('Tf');
        expect(result[32]._operator).toEqual('Tm');
        expect(result[32]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-43.13']);
        expect(result[33]._operator).toEqual("'");
        expect(result[33]._operands).toEqual(['(String with font size 13)']);
        expect(result[34]._operator).toEqual('ET');
        expect(result[34]._operands).toEqual([]);
        expect(result[35]._operator).toEqual('BT');
        expect(result[35]._operands).toEqual([]);
        expect(result[36]._operator).toEqual('Tf');
        expect(result[37]._operator).toEqual('Tr');
        expect(result[37]._operands).toEqual(['0']);
        expect(result[38]._operator).toEqual('Tm');
        expect(result[38]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-74.14']);
        expect(result[39]._operator).toEqual("'");
        expect(result[39]._operands).toEqual(['(String with font size 14)']);
        expect(result[40]._operator).toEqual('ET');
        expect(result[40]._operands).toEqual([]);
        expect(result[41]._operator).toEqual('BT');
        expect(result[41]._operands).toEqual([]);
        expect(result[42]._operator).toEqual('Tf');
        expect(result[43]._operator).toEqual('Tm');
        expect(result[43]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-105.15']);
        expect(result[44]._operator).toEqual("'");
        expect(result[44]._operands).toEqual(['(String with font size 15)']);
        expect(result[45]._operator).toEqual('ET');
        expect(result[45]._operands).toEqual([]);
        doc.destroy();
    });
    it('985200 - 3', () => {
        let doc = new PdfDocument();
        let page = doc.addPage();
        let pen: any;
        let embedded = doc.embedFont(PdfCjkFontFamily.heiseiMinchoW3, 18, PdfFontStyle.regular, true);
        page.graphics.drawString('こんにちは世界', embedded, { x: 10, y: 10, width: 400, height: 100 }, pen);
        embedded = doc.embedFont(PdfCjkFontFamily.heiseiMinchoW3, 20, PdfFontStyle.regular, true);
        page.graphics.drawString('こんにちは世界', embedded, { x: 10, y: 30, width: 400, height: 100 }, pen);
        embedded = doc.embedFont(PdfCjkFontFamily.heiseiMinchoW3, 22, PdfFontStyle.regular, true);
        page.graphics.drawString('こんにちは世界', embedded, { x: 10, y: 60, width: 400, height: 100 }, pen);
        const output = doc.save() as Uint8Array;
        expect(output.length).toBeGreaterThan(0);
        doc = new PdfDocument(output);
        page = doc.getPage(0);
        let resources: _PdfDictionary = page._pageDictionary.get('Resources') as _PdfDictionary;
        let fontEntry: any = resources.get('Font');
        expect(fontEntry.size).toEqual(1);
        let appearance = page._pageDictionary.getArray('Contents') as any[];
        expect(appearance).not.toBeUndefined();
        let stream: _PdfContentStream = appearance[2] as _PdfContentStream;
        let parser: _ContentParser = new _ContentParser(stream.getBytes());
        let result = parser._readContent();
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands).toEqual([]);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands).toEqual([]);
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands).toEqual([]);
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands).toEqual([]);
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
        expect(result[7]._operator).toEqual('BT');
        expect(result[7]._operands).toEqual([]);
        expect(result[8]._operator).toEqual('Tf');
        expect(result[9]._operator).toEqual('Tr');
        expect(result[9]._operands).toEqual(['0']);
        expect(result[10]._operator).toEqual('Tc');
        expect(result[10]._operands).toEqual(['0.000']);
        expect(result[11]._operator).toEqual('Tw');
        expect(result[11]._operands).toEqual(['0.000']);
        expect(result[12]._operator).toEqual('Tz');
        expect(result[12]._operands).toEqual(['100.000']);
        expect(result[13]._operator).toEqual('Tm');
        expect(result[13]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-25.43']);
        expect(result[14]._operator).toEqual("'");
        expect(result[14]._operands).toEqual(['(0S00k0a0oNuL)']);
        expect(result[15]._operator).toEqual('ET');
        expect(result[15]._operands).toEqual([]);
        expect(result[16]._operator).toEqual('BT');
        expect(result[16]._operands).toEqual([]);
        expect(result[17]._operator).toEqual('Tf');
        expect(result[18]._operator).toEqual('Tm');
        expect(result[18]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-47.14']);
        expect(result[19]._operator).toEqual("'");
        expect(result[19]._operands).toEqual(['(0S00k0a0oNuL)']);
        expect(result[20]._operator).toEqual('ET');
        expect(result[20]._operands).toEqual([]);
        expect(result[21]._operator).toEqual('BT');
        expect(result[21]._operands).toEqual([]);
        expect(result[22]._operator).toEqual('Tf');
        expect(result[23]._operator).toEqual('Tm');
        expect(result[23]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-78.85']);
        expect(result[24]._operator).toEqual("'");
        expect(result[24]._operands).toEqual(['(0S00k0a0oNuL)']);
        expect(result[25]._operator).toEqual('ET');
        expect(result[25]._operands).toEqual([]);
        doc.destroy();
    });
    it('985200 - 22', () => {
        const doc = new PdfDocument();
        doc.embedFont(PdfCjkFontFamily.heiseiKakuGothicW5, 16, PdfFontStyle.regular, true);
        doc.embedFont(PdfCjkFontFamily.heiseiKakuGothicW5, 17, PdfFontStyle.regular, true);
        doc.embedFont(PdfCjkFontFamily.heiseiKakuGothicW5, 18, PdfFontStyle.regular, true);
        doc.embedFont(PdfCjkFontFamily.heiseiKakuGothicW5, 19, PdfFontStyle.regular, true);
        expect(doc._fontCollection.size).toEqual(1);
        doc.destroy();
    });
    it('985200 - 26', () => {
        const doc = new PdfDocument();
        doc.embedFont(PdfFontFamily.timesRoman, 16, PdfFontStyle.regular);
        doc.embedFont(PdfFontFamily.timesRoman, 17, PdfFontStyle.regular);
        doc.embedFont(PdfFontFamily.timesRoman, 18, PdfFontStyle.regular);
        doc.embedFont(PdfFontFamily.timesRoman, 19, PdfFontStyle.regular);
        expect(doc._fontCollection.size).toEqual(1);
        doc.destroy();
    });
    it('985200 - 16', () => {
        const doc = new PdfDocument();
        doc.embedFont(PdfCjkFontFamily.heiseiKakuGothicW5, 16, PdfFontStyle.italic, true);
        doc.embedFont(PdfCjkFontFamily.heiseiKakuGothicW5, 16, PdfFontStyle.bold, true);
        doc.embedFont(PdfCjkFontFamily.heiseiKakuGothicW5, 16, PdfFontStyle.regular, true);
        expect(doc._fontCollection.size).toEqual(3);
        doc.destroy();
    });
    it('985200 - 17', () => {
        const doc = new PdfDocument();
        doc.embedFont(PdfFontFamily.timesRoman, 16, PdfFontStyle.regular);
        doc.embedFont(PdfFontFamily.timesRoman, 16, PdfFontStyle.italic);
        doc.embedFont(PdfFontFamily.timesRoman, 16, PdfFontStyle.bold);
        expect(doc._fontCollection.size).toEqual(3);
        doc.destroy();
    });
    it('985200 - 18', () => {
        const doc = new PdfDocument();
        let embedded = doc.embedFont(PdfFontFamily.timesRoman, 16, PdfFontStyle.regular);
        embedded = doc.embedFont(PdfFontFamily.timesRoman, 15, PdfFontStyle.italic);
        embedded = doc.embedFont(PdfFontFamily.timesRoman, 14, PdfFontStyle.bold);
        expect((doc as any)._fontCollection.size).toEqual(3);
        doc.destroy();
    });
    it('985200 - 19', () => {
        let document = new PdfDocument();
        let page13: PdfPage = document.addPage();
        let list39: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT']));
        list39.font = document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular);
        list39.draw(page13, { x: 50, y: page13.size.height - 100 });
        let list40: PdfList = new PdfOrderedList(new PdfListItemCollection(['A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.']), { suffix: '_' });
        list40.font = document.embedFont(PdfFontFamily.helvetica, 13, PdfFontStyle.regular);
        let result: any = list40.draw(page13, { x: 180, y: page13.size.height - 100 });
        let list41: PdfList = new PdfOrderedList(new PdfListItemCollection(['A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.']), { suffix: '_' });
        list41.font = document.embedFont(PdfFontFamily.helvetica, 15, PdfFontStyle.regular);
        result = list41.draw(result.Page, { x: 50, y: result.Page.size.height - 100 });
        let list42: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT']));
        list42.font = document.embedFont(PdfFontFamily.helvetica, 17, PdfFontStyle.regular);
        list42.draw(result.Page.graphics, { x: 50, y: result.Page.size.height - 100 });
        let list43: PdfList = new PdfOrderedList(new PdfListItemCollection(['A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.']), { suffix: '_' });
        list43.font = document.embedFont(PdfFontFamily.helvetica, 19, PdfFontStyle.regular);
        list43.draw(result.Page.graphics, { x: 180, y: result.Page.size.height - 100 });
        let data = document.save();
        expect(data.length > 0).toBeTruthy();
        document.destroy();
        document = new PdfDocument(data);
        page13 = document.getPage(0) as PdfPage;
        let appearance = page13._pageDictionary.getArray('Contents') as any[];
        expect(appearance).not.toBeUndefined();
        let stream: _PdfContentStream = appearance[2] as _PdfContentStream;
        let parser: _ContentParser = new _ContentParser(stream.getBytes());
        result = parser._readContent();
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands).toEqual([]);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands).toEqual([]);
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands).toEqual([]);
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands).toEqual([]);
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
        expect(result[7]._operator).toEqual('BT');
        expect(result[7]._operands).toEqual([]);
        expect(result[8]._operator).toEqual('CS');
        expect(result[8]._operands).toEqual(['/DeviceRGB']);
        expect(result[9]._operator).toEqual('cs');
        expect(result[9]._operands).toEqual(['/DeviceRGB']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[11]._operator).toEqual('Tf');
        expect(result[12]._operator).toEqual('Tr');
        expect(result[12]._operands).toEqual(['0']);
        expect(result[13]._operator).toEqual('Tc');
        expect(result[13]._operands).toEqual(['0.000']);
        expect(result[14]._operator).toEqual('Tw');
        expect(result[14]._operands).toEqual(['0.000']);
        expect(result[15]._operator).toEqual('Tz');
        expect(result[15]._operands).toEqual(['100.000']);
        expect(result[16]._operator).toEqual('Tm');
        expect(result[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '81.68', '-753.17']);
        expect(result[17]._operator).toEqual("'");
        expect(result[17]._operands).toEqual(['(PDF)']);
        expect(result[18]._operator).toEqual('ET');
        expect(result[18]._operands).toEqual([]);
        expect(result[19]._operator).toEqual('BT');
        expect(result[19]._operands).toEqual([]);
        expect(result[20]._operator).toEqual('rg');
        expect(result[20]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[21]._operator).toEqual('Tf');
        expect(result[22]._operator).toEqual('Tm');
        expect(result[22]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-753.17']);
        expect(result[23]._operator).toEqual('Td');
        expect(result[23]._operands).toEqual(['6.672', '0.000']);
        expect(result[24]._operator).toEqual("'");
        expect(result[24]._operands).toEqual(['(1.)']);
        expect(result[25]._operator).toEqual('ET');
        expect(result[25]._operands).toEqual([]);
        expect(result[26]._operator).toEqual('BT');
        expect(result[26]._operands).toEqual([]);
        expect(result[27]._operator).toEqual('rg');
        expect(result[27]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[28]._operator).toEqual('Tf');
        expect(result[29]._operator).toEqual('Tm');
        expect(result[29]._operands).toEqual(['1.00', '.00', '.00', '1.00', '209.46', '-754.10']);
        expect(result[30]._operator).toEqual("'");
        expect(result[30]._operands).toEqual(['(A paragraph is a series of sentences that are)']);
        expect(result[31]._operator).toEqual('ET');
        expect(result[31]._operands).toEqual([]);
        expect(result[32]._operator).toEqual('BT');
        expect(result[32]._operands).toEqual([]);
        expect(result[33]._operator).toEqual('rg');
        expect(result[33]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[34]._operator).toEqual('Tf');
        expect(result[35]._operator).toEqual('Tm');
        expect(result[35]._operands).toEqual(['1.00', '.00', '.00', '1.00', '190.00', '-754.10']);
        expect(result[36]._operator).toEqual("'");
        expect(result[36]._operands).toEqual(['(1_)']);
        expect(result[37]._operator).toEqual('ET');
        expect(result[37]._operands).toEqual([]);
        document.destroy();
    });
    it('985200 - 20', () => {
        let document = new PdfDocument();
        let page13: PdfPage = document.addPage();
        let list39: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT']));
        list39.font = document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular);
        list39.draw(page13, { x: 50, y: page13.size.height - 100 });
        let list40: PdfList = new PdfOrderedList(new PdfListItemCollection(['A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.']), { suffix: '_' });
        list40.font = document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.bold);
        let result: any = list40.draw(page13, { x: 180, y: page13.size.height - 100 });
        let list41: PdfList = new PdfOrderedList(new PdfListItemCollection(['A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.']), { suffix: '_' });
        list41.font = document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.italic);
        result = list41.draw(result.Page, { x: 50, y: result.Page.size.height - 100 });
        let list42: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT']));
        list42.font = document.embedFont(PdfFontFamily.helvetica, 14, PdfFontStyle.bold);
        list42.draw(result.Page.graphics, { x: 50, y: result.Page.size.height - 100 });
        let list43: PdfList = new PdfOrderedList(new PdfListItemCollection(['A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.']), { suffix: '_' });
        list43.font = document.embedFont(PdfFontFamily.helvetica, 14, PdfFontStyle.italic);
        list43.draw(result.Page.graphics, { x: 180, y: result.Page.size.height - 100 });
        let data = document.save();
        expect(data.length > 0).toBeTruthy();
        document.destroy();
        document = new PdfDocument(data);
        page13 = document.getPage(0) as PdfPage;
        let appearance = page13._pageDictionary.getArray('Contents') as any[];
        expect(appearance).not.toBeUndefined();
        let stream: _PdfContentStream = appearance[2] as _PdfContentStream;
        let parser: _ContentParser = new _ContentParser(stream.getBytes());
        result = parser._readContent();
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands).toEqual([]);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands).toEqual([]);
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands).toEqual([]);
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands).toEqual([]);
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
        expect(result[7]._operator).toEqual('BT');
        expect(result[7]._operands).toEqual([]);
        expect(result[8]._operator).toEqual('CS');
        expect(result[8]._operands).toEqual(['/DeviceRGB']);
        expect(result[9]._operator).toEqual('cs');
        expect(result[9]._operands).toEqual(['/DeviceRGB']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[11]._operator).toEqual('Tf');
        expect(result[12]._operator).toEqual('Tr');
        expect(result[12]._operands).toEqual(['0']);
        expect(result[13]._operator).toEqual('Tc');
        expect(result[13]._operands).toEqual(['0.000']);
        expect(result[14]._operator).toEqual('Tw');
        expect(result[14]._operands).toEqual(['0.000']);
        expect(result[15]._operator).toEqual('Tz');
        expect(result[15]._operands).toEqual(['100.000']);
        expect(result[16]._operator).toEqual('Tm');
        expect(result[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '81.68', '-753.17']);
        expect(result[17]._operator).toEqual("'");
        expect(result[17]._operands).toEqual(['(PDF)']);
        expect(result[18]._operator).toEqual('ET');
        expect(result[18]._operands).toEqual([]);
        expect(result[19]._operator).toEqual('BT');
        expect(result[19]._operands).toEqual([]);
        expect(result[20]._operator).toEqual('rg');
        expect(result[20]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[21]._operator).toEqual('Tf');
        expect(result[22]._operator).toEqual('Tm');
        expect(result[22]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-753.17']);
        expect(result[23]._operator).toEqual('Td');
        expect(result[23]._operands).toEqual(['6.672', '0.000']);
        expect(result[24]._operator).toEqual("'");
        expect(result[24]._operands).toEqual(['(1.)']);
        expect(result[25]._operator).toEqual('ET');
        expect(result[25]._operands).toEqual([]);
        expect(result[26]._operator).toEqual('BT');
        expect(result[26]._operands).toEqual([]);
        expect(result[27]._operator).toEqual('rg');
        expect(result[27]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[28]._operator).toEqual('Tf');
        expect(result[29]._operator).toEqual('Tm');
        expect(result[29]._operands).toEqual(['1.00', '.00', '.00', '1.00', '208.34', '-753.54']);
        expect(result[30]._operator).toEqual("'");
        expect(result[30]._operands).toEqual(['(A paragraph is a series of sentences that are)']);
        expect(result[31]._operator).toEqual('ET');
        expect(result[31]._operands).toEqual([]);
        expect(result[32]._operator).toEqual('BT');
        expect(result[32]._operands).toEqual([]);
        expect(result[33]._operator).toEqual('rg');
        expect(result[33]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[34]._operator).toEqual('Tf');
        expect(result[35]._operator).toEqual('Tm');
        expect(result[35]._operands).toEqual(['1.00', '.00', '.00', '1.00', '190.00', '-753.54']);
        expect(result[36]._operator).toEqual("'");
        expect(result[36]._operands).toEqual(['(1_)']);
        expect(result[37]._operator).toEqual('ET');
        expect(result[37]._operands).toEqual([]);
        document.destroy();
    });
    it('901804 - List code coverage - 1', () => {
        let document: PdfDocument = new PdfDocument(crossReferenceTable);
        // Sublist enable hierarchy
        let page1: PdfPage = document.getPage(0);
        let list1: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { style: PdfUnorderedListStyle.asterisk });
        expect(list1.items.count).toEqual(4);
        list1.font = new PdfStandardFont(PdfFontFamily.timesRoman, 15);
        let subList1: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF.Base', 'PDF.Portable', 'Flutter', 'EJ2']));
        subList1.font = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        expect(list1.items.at(0).subList).toBeUndefined();
        list1.items.at(0).subList = subList1;
        expect(subList1.items.count).toEqual(4);
        let subSublist: PdfOrderedList = new PdfOrderedList(new PdfListItemCollection(['PDF.Base', 'PDF.Portable', 'Flutter', 'EJ2']));
        subSublist.enableHierarchy = true;
        expect(subSublist.enableHierarchy).toBeDefined();
        subList1.items.at(3).subList = subSublist;
        expect(subSublist.items.count).toEqual(4);
        list1.draw(page1, { x: 50, y: 50 });

        // Draw the list with layout format
        let page2: PdfPage = document.addPage();
        let list2: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { textIndent: 10 });
        expect(list2.items.at(2).subList).toBeUndefined();
        let subList2: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF.Base', 'PDF.Portable', 'Flutter', 'EJ2']));
        subList2.textIndent = 10;
        expect(subList2.textIndent).toEqual(10);
        subList2.indent = 50;
        expect(subList2.indent).toEqual(50);
        list2.items.at(2).subList = subList2;
        expect(list2.items.at(2).subList.items.count).toEqual(4);
        let format: PdfLayoutFormat = new PdfLayoutFormat();
        format.layout = PdfLayoutType.onePage;
        format.break = PdfLayoutBreakType.fitElement;
        let result: PdfLayoutResult = list2.draw(page2, { x: 0, y: 0 }, format);

        //Draw Ordered list by assigning start number
        let list3: PdfOrderedList = new PdfOrderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { style: PdfNumberStyle.numeric });
        expect(list3.startNumber).toEqual(1);
        list3.startNumber = 5;
        expect(list3.startNumber).toEqual(5);
        format.layout = PdfLayoutType.paginate;
        list3.draw(page2, { x: 100, y: result.Page.size.height - 100 }, format);
        expect(list3.style).toEqual(PdfNumberStyle.numeric);
        document.save();

        //Draw the list with dimensions and format
        let page3: PdfPage = document.getPage(2);
        let list4: PdfList = new PdfUnorderedList(new PdfListItemCollection(['A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.']), { style: PdfUnorderedListStyle.asterisk });
        expect(list4.items.count).toEqual(4);
        let items: PdfListItemCollection = new PdfListItemCollection(['Word', 'Excel', 'Power Point', 'Windows']);
        let Sublist: PdfOrderedList = new PdfOrderedList(items);
        list4.items.at(1).subList = Sublist;
        format._boundSet = false;
        expect(format.paginateBounds).toBeUndefined();
        list4.draw(page3, { x: 50, y: 50 }, format);
        let data = document.save();
        expect(data.length > 0).toBeTruthy();
        document.destroy();
        document = new PdfDocument(data);
        let page = document.getPage(0) as PdfPage;
        let contents: any = page._pageDictionary.getArray('Contents');
        let stream: _PdfContentStream = contents[5];
        let parser: _ContentParser = new _ContentParser(stream.getBytes());
        let results: _PdfRecord[] = parser._readContent();
        expect(results[0]._operator).toEqual('q');
        expect(results[0]._operands).toEqual([]);

        expect(results[1]._operator).toEqual('cm');
        expect(results[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);

        expect(results[2]._operator).toEqual('BT');
        expect(results[2]._operands).toEqual([]);

        expect(results[3]._operator).toEqual('CS');
        expect(results[3]._operands).toEqual(['/DeviceRGB']);

        expect(results[4]._operator).toEqual('cs');
        expect(results[4]._operands).toEqual(['/DeviceRGB']);

        expect(results[5]._operator).toEqual('rg');
        expect(results[5]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[6]._operator).toEqual('Tf');

        expect(results[7]._operator).toEqual('Tr');
        expect(results[7]._operands).toEqual(['0']);

        expect(results[8]._operator).toEqual('Tc');
        expect(results[8]._operands).toEqual(['0.000']);

        expect(results[9]._operator).toEqual('Tw');
        expect(results[9]._operands).toEqual(['0.000']);

        expect(results[10]._operator).toEqual('Tz');
        expect(results[10]._operands).toEqual(['100.000']);

        expect(results[11]._operator).toEqual('Tm');
        expect(results[11]._operands).toEqual(['1.00', '.00', '.00', '1.00', '75.23', '-63.47']);

        expect(results[12]._operator).toEqual("'");
        expect(results[12]._operands).toEqual(['(PDF)']);

        expect(results[13]._operator).toEqual('ET');
        expect(results[13]._operands).toEqual([]);

        expect(results[14]._operator).toEqual('q');
        expect(results[14]._operands).toEqual([]);

        expect(results[15]._operator).toEqual('cm');
        expect(results[15]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-115.00']);

        expect(results[16]._operator).toEqual('Do');

        expect(results[17]._operator).toEqual('Q');
        expect(results[17]._operands).toEqual([]);

        expect(results[18]._operator).toEqual('BT');
        expect(results[18]._operands).toEqual([]);

        expect(results[19]._operator).toEqual('rg');
        expect(results[19]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[20]._operator).toEqual('Tf');

        expect(results[21]._operator).toEqual('Tm');
        expect(results[21]._operands).toEqual(['1.00', '.00', '.00', '1.00', '85.01', '-77.91']);

        expect(results[22]._operator).toEqual("'");
        expect(results[22]._operands).toEqual(['(PDF.Base)']);

        expect(results[23]._operator).toEqual('ET');
        expect(results[23]._operands).toEqual([]);

        expect(results[24]._operator).toEqual('BT');
        expect(results[24]._operands).toEqual([]);

        expect(results[25]._operator).toEqual('rg');
        expect(results[25]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[26]._operator).toEqual('Tf');

        expect(results[27]._operator).toEqual('Tm');
        expect(results[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-77.91']);

        expect(results[28]._operator).toEqual("'");
        expect(results[28]._operands).toEqual(['(1.)']);

        expect(results[29]._operator).toEqual('ET');
        expect(results[29]._operands).toEqual([]);

        expect(results[30]._operator).toEqual('BT');
        expect(results[30]._operands).toEqual([]);

        expect(results[31]._operator).toEqual('rg');
        expect(results[31]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[32]._operator).toEqual('Tf');

        expect(results[33]._operator).toEqual('Tm');
        expect(results[33]._operands).toEqual(['1.00', '.00', '.00', '1.00', '85.01', '-91.78']);

        expect(results[34]._operator).toEqual("'");
        expect(results[34]._operands).toEqual(['(PDF.Portable)']);

        expect(results[35]._operator).toEqual('ET');
        expect(results[35]._operands).toEqual([]);

        expect(results[36]._operator).toEqual('BT');
        expect(results[36]._operands).toEqual([]);

        expect(results[37]._operator).toEqual('rg');
        expect(results[37]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[38]._operator).toEqual('Tf');

        expect(results[39]._operator).toEqual('Tm');
        expect(results[39]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-91.78']);

        expect(results[40]._operator).toEqual("'");
        expect(results[40]._operands).toEqual(['(2.)']);

        expect(results[41]._operator).toEqual('ET');
        expect(results[41]._operands).toEqual([]);

        expect(results[42]._operator).toEqual('BT');
        expect(results[42]._operands).toEqual([]);

        expect(results[43]._operator).toEqual('rg');
        expect(results[43]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[44]._operator).toEqual('Tf');

        expect(results[45]._operator).toEqual('Tm');
        expect(results[45]._operands).toEqual(['1.00', '.00', '.00', '1.00', '85.01', '-105.66']);

        expect(results[46]._operator).toEqual("'");
        expect(results[46]._operands).toEqual(['(Flutter)']);

        expect(results[47]._operator).toEqual('ET');
        expect(results[47]._operands).toEqual([]);

        expect(results[48]._operator).toEqual('BT');
        expect(results[48]._operands).toEqual([]);

        expect(results[49]._operator).toEqual('rg');
        expect(results[49]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[50]._operator).toEqual('Tf');

        expect(results[51]._operator).toEqual('Tm');
        expect(results[51]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-105.66']);

        expect(results[52]._operator).toEqual("'");
        expect(results[52]._operands).toEqual(['(3.)']);

        expect(results[53]._operator).toEqual('ET');
        expect(results[53]._operands).toEqual([]);

        expect(results[54]._operator).toEqual('BT');
        expect(results[54]._operands).toEqual([]);

        expect(results[55]._operator).toEqual('rg');
        expect(results[55]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[56]._operator).toEqual('Tf');

        expect(results[57]._operator).toEqual('Tm');
        expect(results[57]._operands).toEqual(['1.00', '.00', '.00', '1.00', '85.01', '-119.53']);

        expect(results[58]._operator).toEqual("'");
        expect(results[58]._operands).toEqual(['(EJ2)']);

        expect(results[59]._operator).toEqual('ET');
        expect(results[59]._operands).toEqual([]);

        expect(results[60]._operator).toEqual('BT');
        expect(results[60]._operands).toEqual([]);

        expect(results[61]._operator).toEqual('rg');
        expect(results[61]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[62]._operator).toEqual('Tf');

        expect(results[63]._operator).toEqual('Tm');
        expect(results[63]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-119.53']);

        expect(results[64]._operator).toEqual("'");
        expect(results[64]._operands).toEqual(['(4.)']);

        expect(results[65]._operator).toEqual('ET');
        expect(results[65]._operands).toEqual([]);

        expect(results[66]._operator).toEqual('BT');
        expect(results[66]._operands).toEqual([]);

        expect(results[67]._operator).toEqual('rg');
        expect(results[67]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[68]._operator).toEqual('Tf');

        expect(results[69]._operator).toEqual('Tm');
        expect(results[69]._operands).toEqual(['1.00', '.00', '.00', '1.00', '95.01', '-133.40']);

        expect(results[70]._operator).toEqual("'");
        expect(results[70]._operands).toEqual(['(PDF.Base)']);

        expect(results[71]._operator).toEqual('ET');
        expect(results[71]._operands).toEqual([]);

        expect(results[72]._operator).toEqual('BT');
        expect(results[72]._operands).toEqual([]);

        expect(results[73]._operator).toEqual('rg');
        expect(results[73]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[74]._operator).toEqual('Tf');

        expect(results[75]._operator).toEqual('Tm');
        expect(results[75]._operands).toEqual(['1.00', '.00', '.00', '1.00', '80.00', '-133.40']);

        expect(results[76]._operator).toEqual("'");
        expect(results[76]._operands).toEqual(['(1.)']);

        expect(results[77]._operator).toEqual('ET');
        expect(results[77]._operands).toEqual([]);

        expect(results[78]._operator).toEqual('BT');
        expect(results[78]._operands).toEqual([]);

        expect(results[79]._operator).toEqual('rg');
        expect(results[79]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[80]._operator).toEqual('Tf');

        expect(results[81]._operator).toEqual('Tm');
        expect(results[81]._operands).toEqual(['1.00', '.00', '.00', '1.00', '95.01', '-147.27']);

        expect(results[82]._operator).toEqual("'");
        expect(results[82]._operands).toEqual(['(PDF.Portable)']);

        expect(results[83]._operator).toEqual('ET');
        expect(results[83]._operands).toEqual([]);

        expect(results[84]._operator).toEqual('BT');
        expect(results[84]._operands).toEqual([]);

        expect(results[85]._operator).toEqual('rg');
        expect(results[85]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[86]._operator).toEqual('Tf');

        expect(results[87]._operator).toEqual('Tm');
        expect(results[87]._operands).toEqual(['1.00', '.00', '.00', '1.00', '80.00', '-147.27']);

        expect(results[88]._operator).toEqual("'");
        expect(results[88]._operands).toEqual(['(2.)']);

        expect(results[89]._operator).toEqual('ET');
        expect(results[89]._operands).toEqual([]);

        expect(results[90]._operator).toEqual('BT');
        expect(results[90]._operands).toEqual([]);

        expect(results[91]._operator).toEqual('rg');
        expect(results[91]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[92]._operator).toEqual('Tf');

        expect(results[93]._operator).toEqual('Tm');
        expect(results[93]._operands).toEqual(['1.00', '.00', '.00', '1.00', '95.01', '-161.14']);

        expect(results[94]._operator).toEqual("'");
        expect(results[94]._operands).toEqual(['(Flutter)']);

        expect(results[95]._operator).toEqual('ET');
        expect(results[95]._operands).toEqual([]);

        expect(results[96]._operator).toEqual('BT');
        expect(results[96]._operands).toEqual([]);

        expect(results[97]._operator).toEqual('rg');
        expect(results[97]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[98]._operator).toEqual('Tf');

        expect(results[99]._operator).toEqual('Tm');
        expect(results[99]._operands).toEqual(['1.00', '.00', '.00', '1.00', '80.00', '-161.14']);

        expect(results[100]._operator).toEqual("'");
        expect(results[100]._operands).toEqual(['(3.)']);

        expect(results[101]._operator).toEqual('ET');
        expect(results[101]._operands).toEqual([]);

        expect(results[102]._operator).toEqual('BT');
        expect(results[102]._operands).toEqual([]);

        expect(results[103]._operator).toEqual('rg');
        expect(results[103]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[104]._operator).toEqual('Tf');

        expect(results[105]._operator).toEqual('Tm');
        expect(results[105]._operands).toEqual(['1.00', '.00', '.00', '1.00', '95.01', '-175.02']);

        expect(results[106]._operator).toEqual("'");
        expect(results[106]._operands).toEqual(['(EJ2)']);

        expect(results[107]._operator).toEqual('ET');
        expect(results[107]._operands).toEqual([]);

        expect(results[108]._operator).toEqual('BT');
        expect(results[108]._operands).toEqual([]);

        expect(results[109]._operator).toEqual('rg');
        expect(results[109]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[110]._operator).toEqual('Tf');

        expect(results[111]._operator).toEqual('Tm');
        expect(results[111]._operands).toEqual(['1.00', '.00', '.00', '1.00', '80.00', '-175.02']);

        expect(results[112]._operator).toEqual("'");
        expect(results[112]._operands).toEqual(['(4.)']);

        expect(results[113]._operator).toEqual('ET');
        expect(results[113]._operands).toEqual([]);

        expect(results[114]._operator).toEqual('BT');
        expect(results[114]._operands).toEqual([]);

        expect(results[115]._operator).toEqual('rg');
        expect(results[115]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[116]._operator).toEqual('Tf');

        expect(results[117]._operator).toEqual('Tm');
        expect(results[117]._operands).toEqual(['1.00', '.00', '.00', '1.00', '75.23', '-191.19']);

        expect(results[118]._operator).toEqual("'");
        expect(results[118]._operands).toEqual(['(XlsIO)']);

        expect(results[119]._operator).toEqual('ET');
        expect(results[119]._operands).toEqual([]);

        expect(results[120]._operator).toEqual('q');
        expect(results[120]._operands).toEqual([]);

        expect(results[121]._operator).toEqual('cm');
        expect(results[121]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-370.43']);

        expect(results[122]._operator).toEqual('Do');

        expect(results[123]._operator).toEqual('Q');
        expect(results[123]._operands).toEqual([]);

        expect(results[124]._operator).toEqual('BT');
        expect(results[124]._operands).toEqual([]);

        expect(results[125]._operator).toEqual('rg');
        expect(results[125]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[126]._operator).toEqual('Tf');

        expect(results[127]._operator).toEqual('Tm');
        expect(results[127]._operands).toEqual(['1.00', '.00', '.00', '1.00', '75.23', '-207.93']);

        expect(results[128]._operator).toEqual("'");
        expect(results[128]._operands).toEqual(['(DocIO)']);

        expect(results[129]._operator).toEqual('ET');
        expect(results[129]._operands).toEqual([]);

        expect(results[130]._operator).toEqual('q');
        expect(results[130]._operands).toEqual([]);

        expect(results[131]._operator).toEqual('cm');
        expect(results[131]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-403.91']);

        expect(results[132]._operator).toEqual('Do');

        expect(results[133]._operator).toEqual('Q');
        expect(results[133]._operands).toEqual([]);

        expect(results[134]._operator).toEqual('BT');
        expect(results[134]._operands).toEqual([]);

        expect(results[135]._operator).toEqual('rg');
        expect(results[135]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[136]._operator).toEqual('Tf');

        expect(results[137]._operator).toEqual('Tm');
        expect(results[137]._operands).toEqual(['1.00', '.00', '.00', '1.00', '75.23', '-224.67']);

        expect(results[138]._operator).toEqual("'");
        expect(results[138]._operands).toEqual(['(PPT)']);

        expect(results[139]._operator).toEqual('ET');
        expect(results[139]._operands).toEqual([]);

        expect(results[140]._operator).toEqual('q');
        expect(results[140]._operands).toEqual([]);

        expect(results[141]._operator).toEqual('cm');
        expect(results[141]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-437.39']);

        expect(results[142]._operator).toEqual('Do');

        expect(results[143]._operator).toEqual('Q');
        expect(results[143]._operands).toEqual([]);
        page = document.getPage(1) as PdfPage;
        contents = page._pageDictionary.getArray('Contents');
        stream = contents[2];
        parser = new _ContentParser(stream.getBytes());
        results = parser._readContent();
        expect(results[0]._operator).toEqual('q');
        expect(results[0]._operands).toEqual([]);

        expect(results[1]._operator).toEqual('cm');
        expect(results[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);

        expect(results[2]._operator).toEqual('re');
        expect(results[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);

        expect(results[3]._operator).toEqual('h');
        expect(results[3]._operands).toEqual([]);

        expect(results[4]._operator).toEqual('W');
        expect(results[4]._operands).toEqual([]);

        expect(results[5]._operator).toEqual('n');
        expect(results[5]._operands).toEqual([]);

        expect(results[6]._operator).toEqual('cm');
        expect(results[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);

        expect(results[7]._operator).toEqual('BT');
        expect(results[7]._operands).toEqual([]);

        expect(results[8]._operator).toEqual('CS');
        expect(results[8]._operands).toEqual(['/DeviceRGB']);

        expect(results[9]._operator).toEqual('cs');
        expect(results[9]._operands).toEqual(['/DeviceRGB']);

        expect(results[10]._operator).toEqual('rg');
        expect(results[10]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[11]._operator).toEqual('Tf');

        expect(results[12]._operator).toEqual('Tr');
        expect(results[12]._operands).toEqual(['0']);

        expect(results[13]._operator).toEqual('Tc');
        expect(results[13]._operands).toEqual(['0.000']);

        expect(results[14]._operator).toEqual('Tw');
        expect(results[14]._operands).toEqual(['0.000']);

        expect(results[15]._operator).toEqual('Tz');
        expect(results[15]._operands).toEqual(['100.000']);

        expect(results[16]._operator).toEqual('Tm');
        expect(results[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '26.67', '-7.45']);

        expect(results[17]._operator).toEqual("'");
        expect(results[17]._operands).toEqual(['(PDF)']);

        expect(results[18]._operator).toEqual('ET');
        expect(results[18]._operands).toEqual([]);

        expect(results[19]._operator).toEqual('BT');
        expect(results[19]._operands).toEqual([]);

        expect(results[20]._operator).toEqual('rg');
        expect(results[20]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[21]._operator).toEqual('Tf');

        expect(results[22]._operator).toEqual('Tm');
        expect(results[22]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-7.45']);

        expect(results[23]._operator).toEqual("'");
        expect(results[23]._operands).toEqual(['(1.)']);

        expect(results[24]._operator).toEqual('ET');
        expect(results[24]._operands).toEqual([]);

        expect(results[25]._operator).toEqual('BT');
        expect(results[25]._operands).toEqual([]);

        expect(results[26]._operator).toEqual('rg');
        expect(results[26]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[27]._operator).toEqual('Tf');

        expect(results[28]._operator).toEqual('Tm');
        expect(results[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '26.67', '-16.70']);

        expect(results[29]._operator).toEqual("'");
        expect(results[29]._operands).toEqual(['(XlsIO)']);

        expect(results[30]._operator).toEqual('ET');
        expect(results[30]._operands).toEqual([]);

        expect(results[31]._operator).toEqual('BT');
        expect(results[31]._operands).toEqual([]);

        expect(results[32]._operator).toEqual('rg');
        expect(results[32]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[33]._operator).toEqual('Tf');

        expect(results[34]._operator).toEqual('Tm');
        expect(results[34]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-16.70']);

        expect(results[35]._operator).toEqual("'");
        expect(results[35]._operands).toEqual(['(2.)']);

        expect(results[36]._operator).toEqual('ET');
        expect(results[36]._operands).toEqual([]);

        expect(results[37]._operator).toEqual('BT');
        expect(results[37]._operands).toEqual([]);

        expect(results[38]._operator).toEqual('rg');
        expect(results[38]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[39]._operator).toEqual('Tf');

        expect(results[40]._operator).toEqual('Tm');
        expect(results[40]._operands).toEqual(['1.00', '.00', '.00', '1.00', '26.67', '-25.94']);

        expect(results[41]._operator).toEqual("'");
        expect(results[41]._operands).toEqual(['(DocIO)']);

        expect(results[42]._operator).toEqual('ET');
        expect(results[42]._operands).toEqual([]);

        expect(results[43]._operator).toEqual('BT');
        expect(results[43]._operands).toEqual([]);

        expect(results[44]._operator).toEqual('rg');
        expect(results[44]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[45]._operator).toEqual('Tf');

        expect(results[46]._operator).toEqual('Tm');
        expect(results[46]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-25.94']);

        expect(results[47]._operator).toEqual("'");
        expect(results[47]._operands).toEqual(['(3.)']);

        expect(results[48]._operator).toEqual('ET');
        expect(results[48]._operands).toEqual([]);

        expect(results[49]._operator).toEqual('BT');
        expect(results[49]._operands).toEqual([]);

        expect(results[50]._operator).toEqual('rg');
        expect(results[50]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[51]._operator).toEqual('Tf');

        expect(results[52]._operator).toEqual('Tm');
        expect(results[52]._operands).toEqual(['1.00', '.00', '.00', '1.00', '76.67', '-35.19']);

        expect(results[53]._operator).toEqual("'");
        expect(results[53]._operands).toEqual(['(PDF.Base)']);

        expect(results[54]._operator).toEqual('ET');
        expect(results[54]._operands).toEqual([]);

        expect(results[55]._operator).toEqual('BT');
        expect(results[55]._operands).toEqual([]);

        expect(results[56]._operator).toEqual('rg');
        expect(results[56]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[57]._operator).toEqual('Tf');

        expect(results[58]._operator).toEqual('Tm');
        expect(results[58]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-35.19']);

        expect(results[59]._operator).toEqual("'");
        expect(results[59]._operands).toEqual(['(1.)']);

        expect(results[60]._operator).toEqual('ET');
        expect(results[60]._operands).toEqual([]);

        expect(results[61]._operator).toEqual('BT');
        expect(results[61]._operands).toEqual([]);

        expect(results[62]._operator).toEqual('rg');
        expect(results[62]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[63]._operator).toEqual('Tf');

        expect(results[64]._operator).toEqual('Tm');
        expect(results[64]._operands).toEqual(['1.00', '.00', '.00', '1.00', '76.67', '-44.44']);

        expect(results[65]._operator).toEqual("'");
        expect(results[65]._operands).toEqual(['(PDF.Portable)']);

        expect(results[66]._operator).toEqual('ET');
        expect(results[66]._operands).toEqual([]);

        expect(results[67]._operator).toEqual('BT');
        expect(results[67]._operands).toEqual([]);

        expect(results[68]._operator).toEqual('rg');
        expect(results[68]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[69]._operator).toEqual('Tf');

        expect(results[70]._operator).toEqual('Tm');
        expect(results[70]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-44.44']);

        expect(results[71]._operator).toEqual("'");
        expect(results[71]._operands).toEqual(['(2.)']);

        expect(results[72]._operator).toEqual('ET');
        expect(results[72]._operands).toEqual([]);

        expect(results[73]._operator).toEqual('BT');
        expect(results[73]._operands).toEqual([]);

        expect(results[74]._operator).toEqual('rg');
        expect(results[74]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[75]._operator).toEqual('Tf');

        expect(results[76]._operator).toEqual('Tm');
        expect(results[76]._operands).toEqual(['1.00', '.00', '.00', '1.00', '76.67', '-53.69']);

        expect(results[77]._operator).toEqual("'");
        expect(results[77]._operands).toEqual(['(Flutter)']);

        expect(results[78]._operator).toEqual('ET');
        expect(results[78]._operands).toEqual([]);

        expect(results[79]._operator).toEqual('BT');
        expect(results[79]._operands).toEqual([]);

        expect(results[80]._operator).toEqual('rg');
        expect(results[80]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[81]._operator).toEqual('Tf');

        expect(results[82]._operator).toEqual('Tm');
        expect(results[82]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-53.69']);

        expect(results[83]._operator).toEqual("'");
        expect(results[83]._operands).toEqual(['(3.)']);

        expect(results[84]._operator).toEqual('ET');
        expect(results[84]._operands).toEqual([]);

        expect(results[85]._operator).toEqual('BT');
        expect(results[85]._operands).toEqual([]);

        expect(results[86]._operator).toEqual('rg');
        expect(results[86]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[87]._operator).toEqual('Tf');

        expect(results[88]._operator).toEqual('Tm');
        expect(results[88]._operands).toEqual(['1.00', '.00', '.00', '1.00', '76.67', '-62.94']);

        expect(results[89]._operator).toEqual("'");
        expect(results[89]._operands).toEqual(['(EJ2)']);

        expect(results[90]._operator).toEqual('ET');
        expect(results[90]._operands).toEqual([]);

        expect(results[91]._operator).toEqual('BT');
        expect(results[91]._operands).toEqual([]);

        expect(results[92]._operator).toEqual('rg');
        expect(results[92]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[93]._operator).toEqual('Tf');

        expect(results[94]._operator).toEqual('Tm');
        expect(results[94]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-62.94']);

        expect(results[95]._operator).toEqual("'");
        expect(results[95]._operands).toEqual(['(4.)']);

        expect(results[96]._operator).toEqual('ET');
        expect(results[96]._operands).toEqual([]);

        expect(results[97]._operator).toEqual('BT');
        expect(results[97]._operands).toEqual([]);

        expect(results[98]._operator).toEqual('rg');
        expect(results[98]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[99]._operator).toEqual('Tf');

        expect(results[100]._operator).toEqual('Tm');
        expect(results[100]._operands).toEqual(['1.00', '.00', '.00', '1.00', '26.67', '-72.18']);

        expect(results[101]._operator).toEqual("'");
        expect(results[101]._operands).toEqual(['(PPT)']);

        expect(results[102]._operator).toEqual('ET');
        expect(results[102]._operands).toEqual([]);

        expect(results[103]._operator).toEqual('BT');
        expect(results[103]._operands).toEqual([]);

        expect(results[104]._operator).toEqual('rg');
        expect(results[104]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[105]._operator).toEqual('Tf');

        expect(results[106]._operator).toEqual('Tm');
        expect(results[106]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-72.18']);

        expect(results[107]._operator).toEqual("'");
        expect(results[107]._operands).toEqual(['(4.)']);

        expect(results[108]._operator).toEqual('ET');
        expect(results[108]._operands).toEqual([]);

        expect(results[109]._operator).toEqual('BT');
        expect(results[109]._operands).toEqual([]);

        expect(results[110]._operator).toEqual('rg');
        expect(results[110]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[111]._operator).toEqual('Tf');

        expect(results[112]._operator).toEqual('Tm');
        expect(results[112]._operands).toEqual(['1.00', '.00', '.00', '1.00', '126.12', '-749.45']);

        expect(results[113]._operator).toEqual("'");
        expect(results[113]._operands).toEqual(['(PDF)']);

        expect(results[114]._operator).toEqual('ET');
        expect(results[114]._operands).toEqual([]);

        expect(results[115]._operator).toEqual('BT');
        expect(results[115]._operands).toEqual([]);

        expect(results[116]._operator).toEqual('rg');
        expect(results[116]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[117]._operator).toEqual('Tf');

        expect(results[118]._operator).toEqual('Tm');
        expect(results[118]._operands).toEqual(['1.00', '.00', '.00', '1.00', '110.00', '-749.45']);

        expect(results[119]._operator).toEqual('Td');
        expect(results[119]._operands).toEqual(['4.448', '0.000']);

        expect(results[120]._operator).toEqual("'");
        expect(results[120]._operands).toEqual(['(5.)']);

        expect(results[121]._operator).toEqual('ET');
        expect(results[121]._operands).toEqual([]);

        expect(results[122]._operator).toEqual('BT');
        expect(results[122]._operands).toEqual([]);

        expect(results[123]._operator).toEqual('rg');
        expect(results[123]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[124]._operator).toEqual('Tf');

        expect(results[125]._operator).toEqual('Tm');
        expect(results[125]._operands).toEqual(['1.00', '.00', '.00', '1.00', '126.12', '-758.70']);

        expect(results[126]._operator).toEqual("'");
        expect(results[126]._operands).toEqual(['(XlsIO)']);

        expect(results[127]._operator).toEqual('ET');
        expect(results[127]._operands).toEqual([]);

        expect(results[128]._operator).toEqual('BT');
        expect(results[128]._operands).toEqual([]);

        expect(results[129]._operator).toEqual('rg');
        expect(results[129]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[130]._operator).toEqual('Tf');

        expect(results[131]._operator).toEqual('Tm');
        expect(results[131]._operands).toEqual(['1.00', '.00', '.00', '1.00', '110.00', '-758.70']);

        expect(results[132]._operator).toEqual('Td');
        expect(results[132]._operands).toEqual(['4.448', '0.000']);

        expect(results[133]._operator).toEqual("'");
        expect(results[133]._operands).toEqual(['(6.)']);

        expect(results[134]._operator).toEqual('ET');
        expect(results[134]._operands).toEqual([]);
        document.destroy();
    });
    it('901804 - List code coverage - 2', () => {
        let document: PdfDocument = new PdfDocument(crossReferenceTable);
        let page1: PdfPage = document.getPage(0);

        //Adding each item with different font and indent in list
        let collection1: PdfListItemCollection = new PdfListItemCollection();
        let item1: PdfListItem = new PdfListItem('Word', { font: new PdfStandardFont(PdfFontFamily.courier, 12) });
        expect(item1.font).toBeDefined();
        collection1.add(item1, 100);
        let item2: PdfListItem = new PdfListItem('Power point', { font: new PdfStandardFont(PdfFontFamily.symbol, 10), brush: new PdfBrush({ r: 0, g: 255, b: 0 }) });
        expect(item2.font).toBeDefined();
        collection1.add(item2, 50);
        let item3: PdfListItem = new PdfListItem('Excel', { font: new PdfStandardFont(PdfFontFamily.helvetica, 12), format: new PdfStringFormat(PdfTextAlignment.right), pen: new PdfPen({ r: 255, g: 0, b: 255 }, 1) });
        expect(item3.font).toBeDefined();
        collection1.add(item3, 100);
        let item4: PdfListItem = new PdfListItem('Windows');
        expect(item4.font).toBeUndefined();
        item4.font = new PdfStandardFont(PdfFontFamily.timesRoman, 10);
        expect(item4.font).toBeDefined();
        collection1.add(item4, 50);
        let item5: PdfListItem = new PdfListItem('Windows');
        item5.stringFormat = new PdfStringFormat(PdfTextAlignment.center);
        collection1.add(item5, 100);
        let list: PdfUnorderedList = new PdfUnorderedList(collection1, { style: PdfUnorderedListStyle.square });
        expect(list.items.count).toEqual(5);

        //Adding each item with textindent in sublist
        let collection2: PdfListItemCollection = new PdfListItemCollection();
        let item6: PdfListItem = new PdfListItem('A paragraph is a series of sentences that are organized and coherent');
        item6.textIndent = 50;
        expect(item6.textIndent).toEqual(50);
        collection2.add(item6);
        let item7: PdfListItem = new PdfListItem('Power point');
        collection2.add(item7);
        let item8: PdfListItem = new PdfListItem('A paragraph is a series of sentences that are organized and coherent');
        collection2.add(item8);
        let item9: PdfListItem = new PdfListItem('Windows');
        item9.textIndent = 50;
        expect(item9.textIndent).toEqual(50);
        collection2.add(item9);
        let item10: PdfListItem = new PdfListItem('A paragraph is a series of sentences that are organized and coherent');
        item10.text = 'PDF';
        collection2.add(item10);
        let item11: PdfListItem = new PdfListItem('WinForms');
        let sublist: PdfOrderedList = new PdfOrderedList(collection2);
        expect(sublist.items.count).toEqual(5);
        sublist.stringFormat = new PdfStringFormat(PdfTextAlignment.right);
        sublist.textIndent = 30;

        //Exception handled while remove the item that was not added
        try {
            sublist.items.remove(item11);
        } catch (e) {
            expect(e.message).toEqual('item collection does not contain the given content');
        }

        //Remove the particular item from the list and inserting them in another index
        sublist.items.removeAt(0);
        expect(sublist.items.count).toEqual(4);
        try {
            sublist.items.insert(-1, item6, 30);
        } catch (e) {
            expect(e.message).toEqual('Index should be within the range of items count (inclusive).');
        }
        list.items.at(3).subList = sublist;
        list.draw(page1, { x: 50, y: 50, width: 500, height: 700 });
        expect(sublist.items.count).toEqual(4);

        // Clear the list item and sublist items
        list.items.clear();
        expect(list.items.count).toEqual(0);
        sublist.items.clear();
        expect(sublist.items.count).toEqual(0);
        let data = document.save();
        expect(data.length > 0).toBeTruthy();
        //write('890687_list_2.pdf', data);
        document.destroy();
        document = new PdfDocument(data);
        let page = document.getPage(0) as PdfPage;
        let contents: any = page._pageDictionary.getArray('Contents');
        let stream: _PdfContentStream = contents[5];
        let parser: _ContentParser = new _ContentParser(stream.getBytes());
        let results: _PdfRecord[] = parser._readContent();
        expect(results[0]._operator).toEqual('q');
        expect(results[0]._operands).toEqual([]);

        expect(results[1]._operator).toEqual('cm');
        expect(results[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);

        expect(results[2]._operator).toEqual('BT');
        expect(results[2]._operands).toEqual([]);

        expect(results[3]._operator).toEqual('CS');
        expect(results[3]._operands).toEqual(['/DeviceRGB']);

        expect(results[4]._operator).toEqual('cs');
        expect(results[4]._operands).toEqual(['/DeviceRGB']);

        expect(results[5]._operator).toEqual('rg');
        expect(results[5]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[6]._operator).toEqual('Tf');

        expect(results[7]._operator).toEqual('Tr');
        expect(results[7]._operands).toEqual(['0']);

        expect(results[8]._operator).toEqual('Tc');
        expect(results[8]._operands).toEqual(['0.000']);

        expect(results[9]._operator).toEqual('Tw');
        expect(results[9]._operands).toEqual(['0.000']);

        expect(results[10]._operator).toEqual('Tz');
        expect(results[10]._operands).toEqual(['100.000']);

        expect(results[11]._operator).toEqual('Tm');
        expect(results[11]._operands).toEqual(['1.00', '.00', '.00', '1.00', '169.13', '-59.66']);

        expect(results[12]._operator).toEqual("'");
        expect(results[12]._operands).toEqual(['(Word)']);

        expect(results[13]._operator).toEqual('ET');
        expect(results[13]._operands).toEqual([]);

        expect(results[14]._operator).toEqual('q');
        expect(results[14]._operands).toEqual([]);

        expect(results[15]._operator).toEqual('cm');
        expect(results[15]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-112.00']);

        expect(results[16]._operator).toEqual('Do');

        expect(results[17]._operator).toEqual('Q');
        expect(results[17]._operands).toEqual([]);

        expect(results[18]._operator).toEqual('BT');
        expect(results[18]._operands).toEqual([]);

        expect(results[19]._operator).toEqual('rg');
        expect(results[19]._operands).toEqual(['0.000', '1.000', '0.000']);

        expect(results[20]._operator).toEqual('Tf');

        expect(results[21]._operator).toEqual('Tm');
        expect(results[21]._operands).toEqual(['1.00', '.00', '.00', '1.00', '119.13', '-72.76']);

        expect(results[22]._operator).toEqual("'");
        expect(results[22]._operands).toEqual(['(Power point)']);

        expect(results[23]._operator).toEqual('ET');
        expect(results[23]._operands).toEqual([]);

        expect(results[24]._operator).toEqual('q');
        expect(results[24]._operands).toEqual([]);

        expect(results[25]._operator).toEqual('cm');
        expect(results[25]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-137.32']);

        expect(results[26]._operator).toEqual('Do');

        expect(results[27]._operator).toEqual('Q');
        expect(results[27]._operands).toEqual([]);

        expect(results[28]._operator).toEqual('BT');
        expect(results[28]._operands).toEqual([]);

        expect(results[29]._operator).toEqual('d');
        expect(results[29]._operands).toEqual(['[]', '0']);

        expect(results[30]._operator).toEqual('w');
        expect(results[30]._operands).toEqual(['1.000']);

        expect(results[31]._operator).toEqual('j');
        expect(results[31]._operands).toEqual(['0']);

        expect(results[32]._operator).toEqual('J');
        expect(results[32]._operands).toEqual(['0']);

        expect(results[33]._operator).toEqual('RG');
        expect(results[33]._operands).toEqual(['1.000', '0.000', '1.000']);

        expect(results[34]._operator).toEqual('rg');
        expect(results[34]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[35]._operator).toEqual('Tf');

        expect(results[36]._operator).toEqual('Tr');
        expect(results[36]._operands).toEqual(['2']);

        expect(results[37]._operator).toEqual('Tm');
        expect(results[37]._operands).toEqual(['1.00', '.00', '.00', '1.00', '169.13', '-86.86']);

        expect(results[38]._operator).toEqual("'");
        expect(results[38]._operands).toEqual(['(Excel)']);

        expect(results[39]._operator).toEqual('ET');
        expect(results[39]._operands).toEqual([]);

        expect(results[40]._operator).toEqual('q');
        expect(results[40]._operands).toEqual([]);

        expect(results[41]._operator).toEqual('cm');
        expect(results[41]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-163.38']);

        expect(results[42]._operator).toEqual('Do');

        expect(results[43]._operator).toEqual('Q');
        expect(results[43]._operands).toEqual([]);

        expect(results[44]._operator).toEqual('BT');
        expect(results[44]._operands).toEqual([]);

        expect(results[45]._operator).toEqual('rg');
        expect(results[45]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[46]._operator).toEqual('Tf');

        expect(results[47]._operator).toEqual('Tr');
        expect(results[47]._operands).toEqual(['0']);

        expect(results[48]._operator).toEqual('Tm');
        expect(results[48]._operands).toEqual(['1.00', '.00', '.00', '1.00', '119.13', '-98.54']);

        expect(results[49]._operator).toEqual("'");
        expect(results[49]._operands).toEqual(['(Windows)']);

        expect(results[50]._operator).toEqual('ET');
        expect(results[50]._operands).toEqual([]);

        expect(results[51]._operator).toEqual('q');
        expect(results[51]._operands).toEqual([]);

        expect(results[52]._operator).toEqual('cm');
        expect(results[52]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-191.12']);

        expect(results[53]._operator).toEqual('Do');

        expect(results[54]._operator).toEqual('Q');
        expect(results[54]._operands).toEqual([]);

        expect(results[55]._operator).toEqual('BT');
        expect(results[55]._operands).toEqual([]);

        expect(results[56]._operator).toEqual('rg');
        expect(results[56]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[57]._operator).toEqual('Tf');

        expect(results[58]._operator).toEqual('Tm');
        expect(results[58]._operands).toEqual(['1.00', '.00', '.00', '1.00', '106.67', '-108.57']);

        expect(results[59]._operator).toEqual("'");
        expect(results[59]._operands).toEqual(['(Power point)']);

        expect(results[60]._operator).toEqual('ET');
        expect(results[60]._operands).toEqual([]);

        expect(results[61]._operator).toEqual('BT');
        expect(results[61]._operands).toEqual([]);

        expect(results[62]._operator).toEqual('rg');
        expect(results[62]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[63]._operator).toEqual('Tf');

        expect(results[64]._operator).toEqual('Tm');
        expect(results[64]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-108.57']);

        expect(results[65]._operator).toEqual("'");
        expect(results[65]._operands).toEqual(['(1.)']);

        expect(results[66]._operator).toEqual('ET');
        expect(results[66]._operands).toEqual([]);

        expect(results[67]._operator).toEqual('BT');
        expect(results[67]._operands).toEqual([]);

        expect(results[68]._operator).toEqual('rg');
        expect(results[68]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[69]._operator).toEqual('Tf');

        expect(results[70]._operator).toEqual('Tm');
        expect(results[70]._operands).toEqual(['1.00', '.00', '.00', '1.00', '106.67', '-117.81']);

        expect(results[71]._operator).toEqual("'");
        expect(results[71]._operands).toEqual(['(A paragraph is a series of sentences that are organized and coherent)']);

        expect(results[72]._operator).toEqual('ET');
        expect(results[72]._operands).toEqual([]);

        expect(results[73]._operator).toEqual('BT');
        expect(results[73]._operands).toEqual([]);

        expect(results[74]._operator).toEqual('rg');
        expect(results[74]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[75]._operator).toEqual('Tf');

        expect(results[76]._operator).toEqual('Tm');
        expect(results[76]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-117.81']);

        expect(results[77]._operator).toEqual("'");
        expect(results[77]._operands).toEqual(['(2.)']);

        expect(results[78]._operator).toEqual('ET');
        expect(results[78]._operands).toEqual([]);

        expect(results[79]._operator).toEqual('BT');
        expect(results[79]._operands).toEqual([]);

        expect(results[80]._operator).toEqual('rg');
        expect(results[80]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[81]._operator).toEqual('Tf');

        expect(results[82]._operator).toEqual('Tm');
        expect(results[82]._operands).toEqual(['1.00', '.00', '.00', '1.00', '126.67', '-127.06']);

        expect(results[83]._operator).toEqual("'");
        expect(results[83]._operands).toEqual(['(Windows)']);

        expect(results[84]._operator).toEqual('ET');
        expect(results[84]._operands).toEqual([]);

        expect(results[85]._operator).toEqual('BT');
        expect(results[85]._operands).toEqual([]);

        expect(results[86]._operator).toEqual('rg');
        expect(results[86]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[87]._operator).toEqual('Tf');

        expect(results[88]._operator).toEqual('Tm');
        expect(results[88]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-127.06']);

        expect(results[89]._operator).toEqual("'");
        expect(results[89]._operands).toEqual(['(3.)']);

        expect(results[90]._operator).toEqual('ET');
        expect(results[90]._operands).toEqual([]);

        expect(results[91]._operator).toEqual('BT');
        expect(results[91]._operands).toEqual([]);

        expect(results[92]._operator).toEqual('rg');
        expect(results[92]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[93]._operator).toEqual('Tf');

        expect(results[94]._operator).toEqual('Tm');
        expect(results[94]._operands).toEqual(['1.00', '.00', '.00', '1.00', '106.67', '-136.31']);

        expect(results[95]._operator).toEqual("'");
        expect(results[95]._operands).toEqual(['(PDF)']);

        expect(results[96]._operator).toEqual('ET');
        expect(results[96]._operands).toEqual([]);

        expect(results[97]._operator).toEqual('BT');
        expect(results[97]._operands).toEqual([]);

        expect(results[98]._operator).toEqual('rg');
        expect(results[98]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[99]._operator).toEqual('Tf');

        expect(results[100]._operator).toEqual('Tm');
        expect(results[100]._operands).toEqual(['1.00', '.00', '.00', '1.00', '70.00', '-136.31']);

        expect(results[101]._operator).toEqual("'");
        expect(results[101]._operands).toEqual(['(4.)']);

        expect(results[102]._operator).toEqual('ET');
        expect(results[102]._operands).toEqual([]);

        expect(results[103]._operator).toEqual('BT');
        expect(results[103]._operands).toEqual([]);

        expect(results[104]._operator).toEqual('rg');
        expect(results[104]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[105]._operator).toEqual('Tf');

        expect(results[106]._operator).toEqual('Tm');
        expect(results[106]._operands).toEqual(['1.00', '.00', '.00', '1.00', '169.13', '-145.56']);

        expect(results[107]._operator).toEqual("'");
        expect(results[107]._operands).toEqual(['(Windows)']);

        expect(results[108]._operator).toEqual('ET');
        expect(results[108]._operands).toEqual([]);

        expect(results[109]._operator).toEqual('q');
        expect(results[109]._operands).toEqual([]);

        expect(results[110]._operator).toEqual('cm');
        expect(results[110]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-288.22']);

        expect(results[111]._operator).toEqual('Do');

        expect(results[112]._operator).toEqual('Q');
        expect(results[112]._operands).toEqual([]);

        document.destroy();
    });
    it('Unordered list - empty constructor', () => {
        let document: PdfDocument = new PdfDocument(crossReferenceTable);
        // Default properties
        let page: PdfPage = document.getPage(0);
        let list1: PdfUnorderedList = new PdfUnorderedList();
        expect(list1.items).toBeDefined();
        expect(list1.items.count).toEqual(0);
        list1.items = new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']);
        expect(list1.items.count).toEqual(4);
        expect(list1.textIndent).toEqual(5);
        expect(list1.indent).toEqual(10);
        expect(list1.alignment).toEqual(PdfListMarkerAlignment.left);
        expect(list1.brush).toBeUndefined();
        expect(list1.pen).toBeUndefined();
        expect(list1.font).toBeUndefined();
        expect(list1.delimiter).toEqual('.');
        expect(list1.suffix).toEqual('.');
        expect(list1.stringFormat).toBeUndefined();
        expect(list1.style).toEqual(PdfUnorderedListStyle.disk);
        let item: PdfListItem = list1.items.at(0);
        expect(item.brush).toBeUndefined();
        expect(item.pen).toBeUndefined();
        expect(item.font).toBeUndefined();
        expect(item.stringFormat).toBeUndefined();
        expect(item.subList).toBeUndefined();
        expect(item.text).toEqual('PDF');
        expect(item.textIndent).toEqual(0);
        list1.draw(page, { x: 50, y: 50 });
        let list2: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']));
        expect(list2.items.count).toEqual(4);
        expect(list2.textIndent).toEqual(5);
        expect(list2.indent).toEqual(10);
        expect(list2.alignment).toEqual(PdfListMarkerAlignment.left);
        expect(list2.brush).toBeUndefined();
        expect(list2.pen).toBeUndefined();
        expect(list2.font).toBeUndefined();
        expect(list2.delimiter).toEqual('.');
        expect(list2.suffix).toEqual('.');
        expect(list2.stringFormat).toBeUndefined();
        item = list2.items.at(0);
        expect(item.brush).toBeUndefined();
        expect(item.pen).toBeUndefined();
        expect(item.font).toBeUndefined();
        expect(item.stringFormat).toBeUndefined();
        expect(item.subList).toBeUndefined();
        expect(item.text).toEqual('PDF');
        expect(item.textIndent).toEqual(0);
        list2.draw(page, { x: 200, y: 50, width: 150, height: 100 });

        // Text indent property check
        let page2: PdfPage = document.addPage();
        let list3: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']));
        list3.textIndent = 2;
        expect(list3.textIndent).toEqual(2);
        list3.draw(page2, { x: 50, y: 50 });
        let list4: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { textIndent: 10 });
        expect(list4.textIndent).toEqual(10);
        list4.draw(page2, { x: 200, y: 50 });
        let list5: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { textIndent: 10 });
        expect(list5.textIndent).toEqual(10);
        list5.textIndent = 3;
        expect(list5.textIndent).toEqual(3);
        list5.draw(page2, { x: 350, y: 50 });

        // String format property check
        let page3: PdfPage = document.addPage();
        let list6: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']));
        list6.stringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.top);
        expect(list6.stringFormat.alignment).toEqual(PdfTextAlignment.right);
        expect(list6.stringFormat.lineAlignment).toEqual(PdfVerticalAlignment.top);
        list6.draw(page3, { x: 50, y: 50, width: 150, height: 100 });
        let list7: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { format: list6.stringFormat = new PdfStringFormat(PdfTextAlignment.left, PdfVerticalAlignment.top) });
        expect(list6.stringFormat.alignment).toEqual(PdfTextAlignment.left);
        expect(list6.stringFormat.lineAlignment).toEqual(PdfVerticalAlignment.top);
        list7.draw(page3, { x: 220, y: 50, width: 150, height: 50 });
        let list8: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { format: list6.stringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.top) });
        expect(list6.stringFormat.alignment).toEqual(PdfTextAlignment.right);
        expect(list6.stringFormat.lineAlignment).toEqual(PdfVerticalAlignment.top);
        list8.stringFormat = new PdfStringFormat(PdfTextAlignment.left, PdfVerticalAlignment.top);
        expect(list8.stringFormat.alignment).toEqual(PdfTextAlignment.left);
        expect(list8.stringFormat.lineAlignment).toEqual(PdfVerticalAlignment.top);
        list8.draw(page3, { x: 390, y: 50, width: 150, height: 100 });

        // Indent property check
        let page4: PdfPage = document.addPage();
        let list9: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']));
        list9.indent = 2;
        expect(list9.indent).toEqual(2);
        list9.draw(page4, { x: 50, y: 50 });
        let list10: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { indent: 5 });
        expect(list10.indent).toEqual(5);
        list10.draw(page4, { x: 200, y: 50 });
        let list11: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { indent: 5 });
        expect(list11.indent).toEqual(5);
        list11.indent = 3;
        expect(list11.indent).toEqual(3);
        list11.draw(page4, { x: 350, y: 50 });

        // Alignment property check
        let page5: PdfPage = document.addPage();
        let list12: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']));
        list12.alignment = PdfListMarkerAlignment.right;
        expect(list12.alignment).toEqual(1);
        list12.draw(page5, { x: 50, y: 50, width: 150, height: 100 });
        let list13: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { alignment: 1 });
        expect(list13.alignment).toEqual(1);
        list13.draw(page5, { x: 200, y: 50, width: 150, height: 100 });
        let list14: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { alignment: 1 });
        expect(list14.alignment).toEqual(1);
        list14.alignment = 0;
        expect(list14.alignment).toEqual(0);
        list14.draw(page5, { x: 350, y: 50, width: 150, height: 100 });

        // Brush property check
        let page6: PdfPage = document.addPage();
        let list15: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']));
        list15.brush = new PdfBrush({ r: 255, g: 0, b: 0 });
        expect(list15.brush._color).toEqual({ r: 255, g: 0, b: 0 });
        list15.draw(page6, { x: 50, y: 50, width: 150, height: 100 });
        let list16: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { brush: new PdfBrush({ r: 255, g: 0, b: 0 }) });
        expect(list16.brush._color).toEqual({ r: 255, g: 0, b: 0 });
        list16.draw(page6, { x: 200, y: 50, width: 150, height: 100 });
        let list17: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { brush: new PdfBrush({ r: 255, g: 0, b: 0 }) });
        expect(list17.brush._color).toEqual({ r: 255, g: 0, b: 0 });
        list17.brush = new PdfBrush({ r: 0, g: 255, b: 0 });
        expect(list17.brush._color).toEqual({ r: 0, g: 255, b: 0 });
        list17.draw(page6, { x: 350, y: 50, width: 150, height: 100 });

        // Pen property check
        let page7: PdfPage = document.addPage();
        let list18: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']));
        list18.pen = new PdfPen({ r: 255, g: 0, b: 0 }, 1);
        expect(list18.pen._color).toEqual({ r: 255, g: 0, b: 0 });
        list18.draw(page7, { x: 50, y: 50, width: 150, height: 100 });
        let list19: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { pen: new PdfPen({ r: 255, g: 0, b: 0 }, 1) });
        expect(list19.pen._color).toEqual({ r: 255, g: 0, b: 0 });
        list19.draw(page7, { x: 200, y: 50, width: 150, height: 100 });
        let list20: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { pen: new PdfPen({ r: 255, g: 0, b: 0 }, 1) });
        expect(list20.pen._color).toEqual({ r: 255, g: 0, b: 0 });
        list20.pen = new PdfPen({ r: 0, g: 255, b: 0 }, 1);
        expect(list20.pen._color).toEqual({ r: 0, g: 255, b: 0 });
        list20.draw(page7, { x: 350, y: 50, width: 150, height: 100 });

        // Font property check
        let page8: PdfPage = document.addPage();
        let list21: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']));
        list21.font = new PdfStandardFont(PdfFontFamily.courier, 10);
        expect((list21.font as PdfStandardFont).fontFamily).toEqual(1);
        expect((list21.font as PdfStandardFont).size).toEqual(10);
        list21.draw(page8, { x: 50, y: 50, width: 150, height: 100 });
        let list22: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { font: new PdfStandardFont(PdfFontFamily.courier, 10) });
        expect((list22.font as PdfStandardFont).fontFamily).toEqual(1);
        expect(list22.font.size).toEqual(10);
        list22.draw(page8, { x: 200, y: 50, width: 150, height: 100 });
        let list23: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { font: new PdfStandardFont(PdfFontFamily.courier, 10) });
        expect((list23.font as PdfStandardFont).fontFamily).toEqual(1);
        expect(list23.font.size).toEqual(10);
        list23.font = new PdfStandardFont(PdfFontFamily.timesRoman, 9);
        expect((list23.font as PdfStandardFont).fontFamily).toEqual(2);
        expect(list23.font.size).toEqual(9);
        list23.draw(page8, { x: 350, y: 50, width: 150, height: 100 });

        // Delimiter property check
        let page9: PdfPage = document.addPage();
        let list24: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']));
        list24.delimiter = '_';
        expect(list24.delimiter).toEqual('_');
        list24.draw(page9, { x: 50, y: 50, width: 150, height: 100 });
        let list25: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { delimiter: '_' });
        expect(list25.delimiter).toEqual('_');
        list25.draw(page9, { x: 200, y: 50, width: 150, height: 100 });
        let list26: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { delimiter: '_' });
        expect(list26.delimiter).toEqual('_');
        list26.delimiter = '-';
        expect(list26.delimiter).toEqual('-');
        list26.draw(page9, { x: 350, y: 50, width: 150, height: 100 });

        // Suffix property check
        let page10: PdfPage = document.addPage();
        let list27: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']));
        list27.suffix = '_';
        expect(list27.suffix).toEqual('_');
        list27.draw(page10, { x: 50, y: 50, width: 150, height: 100 });
        let list28: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { suffix: '_' });
        expect(list28.suffix).toEqual('_');
        list28.draw(page10, { x: 200, y: 50, width: 150, height: 100 });
        let list29: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { suffix: '_' });
        expect(list29.suffix).toEqual('_');
        list29.suffix = '-';
        expect(list29.suffix).toEqual('-');
        list29.draw(page10, { x: 350, y: 50, width: 150, height: 100 });

        // Add and remove list item check
        let page11: PdfPage = document.addPage();
        let list30: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO']));
        expect(list30.items.count).toEqual(3);
        expect(list30.items.at(0).text).toEqual('PDF');
        expect(list30.items.at(1).text).toEqual('XlsIO');
        expect(list30.items.at(2).text).toEqual('DocIO');
        list30.items.add(new PdfListItem('PPT'));
        expect(list30.items.count).toEqual(4);
        expect(list30.items.at(0).text).toEqual('PDF');
        expect(list30.items.at(1).text).toEqual('XlsIO');
        expect(list30.items.at(2).text).toEqual('DocIO');
        expect(list30.items.at(3).text).toEqual('PPT');
        list30.draw(page11, { x: 50, y: 50, width: 150, height: 100 });
        let list31: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO']));
        expect(list31.items.count).toEqual(3);
        item = list31.items.at(0);
        expect(item.text).toEqual('PDF');
        expect(item.brush).toBeUndefined();
        expect(item.font).toBeUndefined();
        expect(item.pen).toBeUndefined();
        expect(item.stringFormat).toBeUndefined();
        expect(item.subList).toBeUndefined();
        expect(item.textIndent).toEqual(0);
        item.brush = new PdfBrush({ r: 255, g: 0, b: 0 });
        item.pen = new PdfPen({ r: 0, g: 255, b: 0 }, 1);
        item.font = new PdfStandardFont(2, 10);
        item.stringFormat = new PdfStringFormat(1, 1);
        item.textIndent = 5;
        expect(item.brush._color).toEqual({ r: 255, g: 0, b: 0 });
        expect(item.pen._color).toEqual({ r: 0, g: 255, b: 0 });
        expect(item.font.size).toEqual(10);
        expect(item.stringFormat.alignment).toEqual(1);
        expect(item.textIndent).toEqual(5);
        expect(list31.items.at(1).text).toEqual('XlsIO');
        expect(list31.items.at(2).text).toEqual('DocIO');
        list31.items.add(new PdfListItem('PPT', { brush: new PdfBrush({ r: 255, g: 0, b: 0 }) }));
        expect(list31.items.count).toEqual(4);
        expect(list31.items.at(0).text).toEqual('PDF');
        expect(list31.items.at(1).text).toEqual('XlsIO');
        expect(list31.items.at(2).text).toEqual('DocIO');
        expect(list31.items.at(3).text).toEqual('PPT');
        expect(list31.items.at(3).brush._color).toEqual({ r: 255, g: 0, b: 0 });
        list31.draw(page11, { x: 200, y: 50, width: 150, height: 100 });
        let list32: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']));
        expect(list32.items.count).toEqual(4);
        expect(list32.items.at(0).text).toEqual('PDF');
        expect(list32.items.at(1).text).toEqual('XlsIO');
        expect(list32.items.at(2).text).toEqual('DocIO');
        expect(list32.items.at(3).text).toEqual('PPT');
        list32.items.remove(list32.items.at(1));
        list32.items.removeAt(2);
        expect(list32.items.at(0).text).toEqual('PDF');
        expect(list32.items.at(1).text).toEqual('DocIO');
        list32.draw(page11, { x: 350, y: 50, width: 150, height: 100 });

        // Sublist drawing text
        let page12: PdfPage = document.addPage();
        let list33: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']));
        let subList1: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF.Base', 'PDF.Portable', 'Flutter', 'EJ2']));
        expect(list33.items.at(0).subList).toBeUndefined();
        list33.items.at(0).subList = subList1;
        expect(list33.items.at(0).subList.items.count).toEqual(4);
        list33.draw(page12, { x: 50, y: 50 });
        let list34: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { textIndent: 10 });
        expect(list34.items.at(2).subList).toBeUndefined();
        let subList2: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF.Base', 'PDF.Portable', 'Flutter', 'EJ2']));
        subList2.textIndent = 10;
        list34.items.at(2).subList = subList2;
        expect(list34.items.at(2).subList.items.count).toEqual(4);
        list34.draw(page12, { x: 200, y: 50 });
        let list35: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { textIndent: 10 });
        expect(list35.items.at(3).subList).toBeUndefined();
        let subList3: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF.Base', 'PDF.Portable', 'Flutter', 'EJ2']));
        subList3.brush = new PdfBrush({ r: 255, g: 0, b: 0 });
        subList3.indent = 5;
        list35.items.at(3).subList = subList3;
        expect(list35.items.at(3).subList.items.count).toEqual(4);
        list35.draw(page12, { x: 350, y: 50 });
        let list36: PdfUnorderedList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']));
        list36.style = PdfUnorderedListStyle.circle;
        let subList4: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF.Base', 'PDF.Portable', 'Flutter', 'EJ2']));
        expect(list36.items.at(0).subList).toBeUndefined();
        list36.items.at(0).subList = subList4;
        expect(list36.items.at(0).subList.items.count).toEqual(4);
        list36.draw(page12, { x: 50, y: 150 });
        let list37: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { textIndent: 10 });
        expect(list37.items.at(2).subList).toBeUndefined();
        let subList5: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF.Base', 'PDF.Portable', 'Flutter', 'EJ2']));
        subList5.textIndent = 10;
        list37.items.at(2).subList = subList5;
        expect(list37.items.at(2).subList.items.count).toEqual(4);
        list37.draw(page12, { x: 200, y: 150 });
        let list38: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT']), { textIndent: 10 });
        expect(list38.items.at(3).subList).toBeUndefined();
        let subList6: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF.Base', 'PDF.Portable', 'Flutter', 'EJ2']));
        subList6.brush = new PdfBrush({ r: 255, g: 0, b: 0 });
        subList6.indent = 5;
        list38.items.at(3).subList = subList6;
        expect(list38.items.at(3).subList.items.count).toEqual(4);
        list38.draw(page12, { x: 350, y: 150 });

        // Pagination check
        let page13: PdfPage = document.addPage();
        let list39: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT']));
        list39.draw(page13, { x: 50, y: page13.size.height - 100 });
        let list40: PdfList = new PdfUnorderedList(new PdfListItemCollection(['A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.']), { suffix: '_' });
        let result: PdfLayoutResult = list40.draw(page13, { x: 180, y: page13.size.height - 100 });
        let list41: PdfList = new PdfUnorderedList(new PdfListItemCollection(['A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.']), { suffix: '_' });
        result = list41.draw(result.Page, { x: 50, y: result.Page.size.height - 100 });
        let list42: PdfList = new PdfUnorderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT']));
        list42.draw(result.Page.graphics, { x: 50, y: result.Page.size.height - 100 });
        let list43: PdfList = new PdfUnorderedList(new PdfListItemCollection(['A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.', 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.']), { suffix: '_' });
        list43.draw(result.Page.graphics, { x: 180, y: result.Page.size.height - 100 });
        let data = document.save();
        expect(data.length > 0).toBeTruthy();
        document.destroy();
        document = new PdfDocument(data);
        page = document.getPage(0) as PdfPage;
        let contents: any = page._pageDictionary.getArray('Contents');
        let stream: _PdfContentStream = contents[5];
        let parser: _ContentParser = new _ContentParser(stream.getBytes());
        let results: _PdfRecord[] = parser._readContent();
        expect(results[0]._operator).toEqual('q');
        expect(results[0]._operands).toEqual([]);

        expect(results[1]._operator).toEqual('cm');
        expect(results[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);

        expect(results[2]._operator).toEqual('BT');
        expect(results[2]._operands).toEqual([]);

        expect(results[3]._operator).toEqual('CS');
        expect(results[3]._operands).toEqual(['/DeviceRGB']);

        expect(results[4]._operator).toEqual('cs');
        expect(results[4]._operands).toEqual(['/DeviceRGB']);

        expect(results[5]._operator).toEqual('rg');
        expect(results[5]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[6]._operator).toEqual('Tf');

        expect(results[7]._operator).toEqual('Tr');
        expect(results[7]._operands).toEqual(['0']);

        expect(results[8]._operator).toEqual('Tc');
        expect(results[8]._operands).toEqual(['0.000']);

        expect(results[9]._operator).toEqual('Tw');
        expect(results[9]._operands).toEqual(['0.000']);

        expect(results[10]._operator).toEqual('Tz');
        expect(results[10]._operands).toEqual(['100.000']);

        expect(results[11]._operator).toEqual('Tm');
        expect(results[11]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-57.45']);

        expect(results[12]._operator).toEqual("'");
        expect(results[12]._operands).toEqual(['(PDF)']);

        expect(results[13]._operator).toEqual('ET');
        expect(results[13]._operands).toEqual([]);

        expect(results[14]._operator).toEqual('q');
        expect(results[14]._operands).toEqual([]);

        expect(results[15]._operator).toEqual('cm');
        expect(results[15]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-108.00']);

        expect(results[16]._operator).toEqual('Do');

        expect(results[17]._operator).toEqual('Q');
        expect(results[17]._operands).toEqual([]);

        expect(results[18]._operator).toEqual('BT');
        expect(results[18]._operands).toEqual([]);

        expect(results[19]._operator).toEqual('rg');
        expect(results[19]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[20]._operator).toEqual('Tf');

        expect(results[21]._operator).toEqual('Tm');
        expect(results[21]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-66.70']);

        expect(results[22]._operator).toEqual("'");
        expect(results[22]._operands).toEqual(['(XlsIO)']);

        expect(results[23]._operator).toEqual('ET');
        expect(results[23]._operands).toEqual([]);

        expect(results[24]._operator).toEqual('q');
        expect(results[24]._operands).toEqual([]);

        expect(results[25]._operator).toEqual('cm');
        expect(results[25]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-126.50']);

        expect(results[26]._operator).toEqual('Do');

        expect(results[27]._operator).toEqual('Q');
        expect(results[27]._operands).toEqual([]);

        expect(results[28]._operator).toEqual('BT');
        expect(results[28]._operands).toEqual([]);

        expect(results[29]._operator).toEqual('rg');
        expect(results[29]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[30]._operator).toEqual('Tf');

        expect(results[31]._operator).toEqual('Tm');
        expect(results[31]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-75.94']);

        expect(results[32]._operator).toEqual("'");
        expect(results[32]._operands).toEqual(['(DocIO)']);

        expect(results[33]._operator).toEqual('ET');
        expect(results[33]._operands).toEqual([]);

        expect(results[34]._operator).toEqual('q');
        expect(results[34]._operands).toEqual([]);

        expect(results[35]._operator).toEqual('cm');
        expect(results[35]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-144.99']);

        expect(results[36]._operator).toEqual('Do');

        expect(results[37]._operator).toEqual('Q');
        expect(results[37]._operands).toEqual([]);

        expect(results[38]._operator).toEqual('BT');
        expect(results[38]._operands).toEqual([]);

        expect(results[39]._operator).toEqual('rg');
        expect(results[39]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[40]._operator).toEqual('Tf');

        expect(results[41]._operator).toEqual('Tm');
        expect(results[41]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-85.19']);

        expect(results[42]._operator).toEqual("'");
        expect(results[42]._operands).toEqual(['(PPT)']);

        expect(results[43]._operator).toEqual('ET');
        expect(results[43]._operands).toEqual([]);

        expect(results[44]._operator).toEqual('q');
        expect(results[44]._operands).toEqual([]);

        expect(results[45]._operator).toEqual('cm');
        expect(results[45]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-163.49']);

        expect(results[46]._operator).toEqual('Do');

        expect(results[47]._operator).toEqual('Q');
        expect(results[47]._operands).toEqual([]);

        expect(results[48]._operator).toEqual('BT');
        expect(results[48]._operands).toEqual([]);

        expect(results[49]._operator).toEqual('rg');
        expect(results[49]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[50]._operator).toEqual('Tf');

        expect(results[51]._operator).toEqual('Tm');
        expect(results[51]._operands).toEqual(['1.00', '.00', '.00', '1.00', '221.33', '-57.45']);

        expect(results[52]._operator).toEqual("'");
        expect(results[52]._operands).toEqual(['(PDF)']);

        expect(results[53]._operator).toEqual('ET');
        expect(results[53]._operands).toEqual([]);

        expect(results[54]._operator).toEqual('q');
        expect(results[54]._operands).toEqual([]);

        expect(results[55]._operator).toEqual('cm');
        expect(results[55]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-108.00']);

        expect(results[56]._operator).toEqual('Do');

        expect(results[57]._operator).toEqual('Q');
        expect(results[57]._operands).toEqual([]);

        expect(results[58]._operator).toEqual('BT');
        expect(results[58]._operands).toEqual([]);

        expect(results[59]._operator).toEqual('rg');
        expect(results[59]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[60]._operator).toEqual('Tf');

        expect(results[61]._operator).toEqual('Tm');
        expect(results[61]._operands).toEqual(['1.00', '.00', '.00', '1.00', '221.33', '-66.70']);

        expect(results[62]._operator).toEqual("'");
        expect(results[62]._operands).toEqual(['(XlsIO)']);

        expect(results[63]._operator).toEqual('ET');
        expect(results[63]._operands).toEqual([]);

        expect(results[64]._operator).toEqual('q');
        expect(results[64]._operands).toEqual([]);

        expect(results[65]._operator).toEqual('cm');
        expect(results[65]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-126.50']);

        expect(results[66]._operator).toEqual('Do');

        expect(results[67]._operator).toEqual('Q');
        expect(results[67]._operands).toEqual([]);

        expect(results[68]._operator).toEqual('BT');
        expect(results[68]._operands).toEqual([]);

        expect(results[69]._operator).toEqual('rg');
        expect(results[69]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[70]._operator).toEqual('Tf');

        expect(results[71]._operator).toEqual('Tm');
        expect(results[71]._operands).toEqual(['1.00', '.00', '.00', '1.00', '221.33', '-75.94']);

        expect(results[72]._operator).toEqual("'");
        expect(results[72]._operands).toEqual(['(DocIO)']);

        expect(results[73]._operator).toEqual('ET');
        expect(results[73]._operands).toEqual([]);

        expect(results[74]._operator).toEqual('q');
        expect(results[74]._operands).toEqual([]);

        expect(results[75]._operator).toEqual('cm');
        expect(results[75]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-144.99']);

        expect(results[76]._operator).toEqual('Do');

        expect(results[77]._operator).toEqual('Q');
        expect(results[77]._operands).toEqual([]);

        expect(results[78]._operator).toEqual('BT');
        expect(results[78]._operands).toEqual([]);

        expect(results[79]._operator).toEqual('rg');
        expect(results[79]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[80]._operator).toEqual('Tf');

        expect(results[81]._operator).toEqual('Tm');
        expect(results[81]._operands).toEqual(['1.00', '.00', '.00', '1.00', '221.33', '-85.19']);

        expect(results[82]._operator).toEqual("'");
        expect(results[82]._operands).toEqual(['(PPT)']);

        expect(results[83]._operator).toEqual('ET');
        expect(results[83]._operands).toEqual([]);

        expect(results[84]._operator).toEqual('q');
        expect(results[84]._operands).toEqual([]);

        expect(results[85]._operator).toEqual('cm');
        expect(results[85]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-163.49']);

        expect(results[86]._operator).toEqual('Do');

        expect(results[87]._operator).toEqual('Q');
        expect(results[87]._operands).toEqual([]);
        page = document.getPage(1) as PdfPage;
        contents = page._pageDictionary.getArray('Contents');
        stream = contents[2];
        parser = new _ContentParser(stream.getBytes());
        results = parser._readContent();
        expect(results[0]._operator).toEqual('q');
        expect(results[0]._operands).toEqual([]);

        expect(results[1]._operator).toEqual('cm');
        expect(results[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);

        expect(results[2]._operator).toEqual('re');
        expect(results[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);

        expect(results[3]._operator).toEqual('h');
        expect(results[3]._operands).toEqual([]);

        expect(results[4]._operator).toEqual('W');
        expect(results[4]._operands).toEqual([]);

        expect(results[5]._operator).toEqual('n');
        expect(results[5]._operands).toEqual([]);

        expect(results[6]._operator).toEqual('cm');
        expect(results[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);

        expect(results[7]._operator).toEqual('BT');
        expect(results[7]._operands).toEqual([]);

        expect(results[8]._operator).toEqual('CS');
        expect(results[8]._operands).toEqual(['/DeviceRGB']);

        expect(results[9]._operator).toEqual('cs');
        expect(results[9]._operands).toEqual(['/DeviceRGB']);

        expect(results[10]._operator).toEqual('rg');
        expect(results[10]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[11]._operator).toEqual('Tf');

        expect(results[12]._operator).toEqual('Tr');
        expect(results[12]._operands).toEqual(['0']);

        expect(results[13]._operator).toEqual('Tc');
        expect(results[13]._operands).toEqual(['0.000']);

        expect(results[14]._operator).toEqual('Tw');
        expect(results[14]._operands).toEqual(['0.000']);

        expect(results[15]._operator).toEqual('Tz');
        expect(results[15]._operands).toEqual(['100.000']);

        expect(results[16]._operator).toEqual('Tm');
        expect(results[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '68.33', '-57.45']);

        expect(results[17]._operator).toEqual("'");
        expect(results[17]._operands).toEqual(['(PDF)']);

        expect(results[18]._operator).toEqual('ET');
        expect(results[18]._operands).toEqual([]);

        expect(results[19]._operator).toEqual('q');
        expect(results[19]._operands).toEqual([]);

        expect(results[20]._operator).toEqual('cm');
        expect(results[20]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-108.00']);

        expect(results[21]._operator).toEqual('Do');

        expect(results[22]._operator).toEqual('Q');
        expect(results[22]._operands).toEqual([]);

        expect(results[23]._operator).toEqual('BT');
        expect(results[23]._operands).toEqual([]);

        expect(results[24]._operator).toEqual('rg');
        expect(results[24]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[25]._operator).toEqual('Tf');

        expect(results[26]._operator).toEqual('Tm');
        expect(results[26]._operands).toEqual(['1.00', '.00', '.00', '1.00', '68.33', '-66.70']);

        expect(results[27]._operator).toEqual("'");
        expect(results[27]._operands).toEqual(['(XlsIO)']);

        expect(results[28]._operator).toEqual('ET');
        expect(results[28]._operands).toEqual([]);

        expect(results[29]._operator).toEqual('q');
        expect(results[29]._operands).toEqual([]);

        expect(results[30]._operator).toEqual('cm');
        expect(results[30]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-126.50']);

        expect(results[31]._operator).toEqual('Do');

        expect(results[32]._operator).toEqual('Q');
        expect(results[32]._operands).toEqual([]);

        expect(results[33]._operator).toEqual('BT');
        expect(results[33]._operands).toEqual([]);

        expect(results[34]._operator).toEqual('rg');
        expect(results[34]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[35]._operator).toEqual('Tf');

        expect(results[36]._operator).toEqual('Tm');
        expect(results[36]._operands).toEqual(['1.00', '.00', '.00', '1.00', '68.33', '-75.94']);

        expect(results[37]._operator).toEqual("'");
        expect(results[37]._operands).toEqual(['(DocIO)']);

        expect(results[38]._operator).toEqual('ET');
        expect(results[38]._operands).toEqual([]);

        expect(results[39]._operator).toEqual('q');
        expect(results[39]._operands).toEqual([]);

        expect(results[40]._operator).toEqual('cm');
        expect(results[40]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-144.99']);

        expect(results[41]._operator).toEqual('Do');

        expect(results[42]._operator).toEqual('Q');
        expect(results[42]._operands).toEqual([]);

        expect(results[43]._operator).toEqual('BT');
        expect(results[43]._operands).toEqual([]);

        expect(results[44]._operator).toEqual('rg');
        expect(results[44]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[45]._operator).toEqual('Tf');

        expect(results[46]._operator).toEqual('Tm');
        expect(results[46]._operands).toEqual(['1.00', '.00', '.00', '1.00', '68.33', '-85.19']);

        expect(results[47]._operator).toEqual("'");
        expect(results[47]._operands).toEqual(['(PPT)']);

        expect(results[48]._operator).toEqual('ET');
        expect(results[48]._operands).toEqual([]);

        expect(results[49]._operator).toEqual('q');
        expect(results[49]._operands).toEqual([]);

        expect(results[50]._operator).toEqual('cm');
        expect(results[50]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-163.49']);

        expect(results[51]._operator).toEqual('Do');

        expect(results[52]._operator).toEqual('Q');
        expect(results[52]._operands).toEqual([]);

        expect(results[53]._operator).toEqual('BT');
        expect(results[53]._operands).toEqual([]);

        expect(results[54]._operator).toEqual('rg');
        expect(results[54]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[55]._operator).toEqual('Tf');

        expect(results[56]._operator).toEqual('Tm');
        expect(results[56]._operands).toEqual(['1.00', '.00', '.00', '1.00', '226.33', '-57.45']);

        expect(results[57]._operator).toEqual("'");
        expect(results[57]._operands).toEqual(['(PDF)']);

        expect(results[58]._operator).toEqual('ET');
        expect(results[58]._operands).toEqual([]);

        expect(results[59]._operator).toEqual('q');
        expect(results[59]._operands).toEqual([]);

        expect(results[60]._operator).toEqual('cm');
        expect(results[60]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-108.00']);

        expect(results[61]._operator).toEqual('Do');

        expect(results[62]._operator).toEqual('Q');
        expect(results[62]._operands).toEqual([]);

        expect(results[63]._operator).toEqual('BT');
        expect(results[63]._operands).toEqual([]);

        expect(results[64]._operator).toEqual('rg');
        expect(results[64]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[65]._operator).toEqual('Tf');

        expect(results[66]._operator).toEqual('Tm');
        expect(results[66]._operands).toEqual(['1.00', '.00', '.00', '1.00', '226.33', '-66.70']);

        expect(results[67]._operator).toEqual("'");
        expect(results[67]._operands).toEqual(['(XlsIO)']);

        expect(results[68]._operator).toEqual('ET');
        expect(results[68]._operands).toEqual([]);

        expect(results[69]._operator).toEqual('q');
        expect(results[69]._operands).toEqual([]);

        expect(results[70]._operator).toEqual('cm');
        expect(results[70]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-126.50']);

        expect(results[71]._operator).toEqual('Do');

        expect(results[72]._operator).toEqual('Q');
        expect(results[72]._operands).toEqual([]);

        expect(results[73]._operator).toEqual('BT');
        expect(results[73]._operands).toEqual([]);

        expect(results[74]._operator).toEqual('rg');
        expect(results[74]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[75]._operator).toEqual('Tf');

        expect(results[76]._operator).toEqual('Tm');
        expect(results[76]._operands).toEqual(['1.00', '.00', '.00', '1.00', '226.33', '-75.94']);

        expect(results[77]._operator).toEqual("'");
        expect(results[77]._operands).toEqual(['(DocIO)']);

        expect(results[78]._operator).toEqual('ET');
        expect(results[78]._operands).toEqual([]);

        expect(results[79]._operator).toEqual('q');
        expect(results[79]._operands).toEqual([]);

        expect(results[80]._operator).toEqual('cm');
        expect(results[80]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-144.99']);

        expect(results[81]._operator).toEqual('Do');

        expect(results[82]._operator).toEqual('Q');
        expect(results[82]._operands).toEqual([]);

        expect(results[83]._operator).toEqual('BT');
        expect(results[83]._operands).toEqual([]);

        expect(results[84]._operator).toEqual('rg');
        expect(results[84]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[85]._operator).toEqual('Tf');

        expect(results[86]._operator).toEqual('Tm');
        expect(results[86]._operands).toEqual(['1.00', '.00', '.00', '1.00', '226.33', '-85.19']);

        expect(results[87]._operator).toEqual("'");
        expect(results[87]._operands).toEqual(['(PPT)']);

        expect(results[88]._operator).toEqual('ET');
        expect(results[88]._operands).toEqual([]);

        expect(results[89]._operator).toEqual('q');
        expect(results[89]._operands).toEqual([]);

        expect(results[90]._operator).toEqual('cm');
        expect(results[90]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-163.49']);

        expect(results[91]._operator).toEqual('Do');

        expect(results[92]._operator).toEqual('Q');
        expect(results[92]._operands).toEqual([]);

        expect(results[93]._operator).toEqual('BT');
        expect(results[93]._operands).toEqual([]);

        expect(results[94]._operator).toEqual('rg');
        expect(results[94]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[95]._operator).toEqual('Tf');

        expect(results[96]._operator).toEqual('Tm');
        expect(results[96]._operands).toEqual(['1.00', '.00', '.00', '1.00', '369.33', '-57.45']);

        expect(results[97]._operator).toEqual("'");
        expect(results[97]._operands).toEqual(['(PDF)']);

        expect(results[98]._operator).toEqual('ET');
        expect(results[98]._operands).toEqual([]);

        expect(results[99]._operator).toEqual('q');
        expect(results[99]._operands).toEqual([]);

        expect(results[100]._operator).toEqual('cm');
        expect(results[100]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-108.00']);

        expect(results[101]._operator).toEqual('Do');

        expect(results[102]._operator).toEqual('Q');
        expect(results[102]._operands).toEqual([]);

        expect(results[103]._operator).toEqual('BT');
        expect(results[103]._operands).toEqual([]);

        expect(results[104]._operator).toEqual('rg');
        expect(results[104]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[105]._operator).toEqual('Tf');

        expect(results[106]._operator).toEqual('Tm');
        expect(results[106]._operands).toEqual(['1.00', '.00', '.00', '1.00', '369.33', '-66.70']);

        expect(results[107]._operator).toEqual("'");
        expect(results[107]._operands).toEqual(['(XlsIO)']);

        expect(results[108]._operator).toEqual('ET');
        expect(results[108]._operands).toEqual([]);

        expect(results[109]._operator).toEqual('q');
        expect(results[109]._operands).toEqual([]);

        expect(results[110]._operator).toEqual('cm');
        expect(results[110]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-126.50']);

        expect(results[111]._operator).toEqual('Do');

        expect(results[112]._operator).toEqual('Q');
        expect(results[112]._operands).toEqual([]);

        expect(results[113]._operator).toEqual('BT');
        expect(results[113]._operands).toEqual([]);

        expect(results[114]._operator).toEqual('rg');
        expect(results[114]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[115]._operator).toEqual('Tf');

        expect(results[116]._operator).toEqual('Tm');
        expect(results[116]._operands).toEqual(['1.00', '.00', '.00', '1.00', '369.33', '-75.94']);

        expect(results[117]._operator).toEqual("'");
        expect(results[117]._operands).toEqual(['(DocIO)']);

        expect(results[118]._operator).toEqual('ET');
        expect(results[118]._operands).toEqual([]);

        expect(results[119]._operator).toEqual('q');
        expect(results[119]._operands).toEqual([]);

        expect(results[120]._operator).toEqual('cm');
        expect(results[120]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-144.99']);

        expect(results[121]._operator).toEqual('Do');

        expect(results[122]._operator).toEqual('Q');
        expect(results[122]._operands).toEqual([]);

        expect(results[123]._operator).toEqual('BT');
        expect(results[123]._operands).toEqual([]);

        expect(results[124]._operator).toEqual('rg');
        expect(results[124]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[125]._operator).toEqual('Tf');

        expect(results[126]._operator).toEqual('Tm');
        expect(results[126]._operands).toEqual(['1.00', '.00', '.00', '1.00', '369.33', '-85.19']);

        expect(results[127]._operator).toEqual("'");
        expect(results[127]._operands).toEqual(['(PPT)']);

        expect(results[128]._operator).toEqual('ET');
        expect(results[128]._operands).toEqual([]);

        expect(results[129]._operator).toEqual('q');
        expect(results[129]._operands).toEqual([]);

        expect(results[130]._operator).toEqual('cm');
        expect(results[130]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-163.49']);

        expect(results[131]._operator).toEqual('Do');

        expect(results[132]._operator).toEqual('Q');
        expect(results[132]._operands).toEqual([]);
        page = document.getPage(2) as PdfPage;
        contents = page._pageDictionary.getArray('Contents');
        stream = contents[2];
        parser = new _ContentParser(stream.getBytes());
        results = parser._readContent();
        expect(results[0]._operator).toEqual('q');
        expect(results[0]._operands).toEqual([]);

        expect(results[1]._operator).toEqual('cm');
        expect(results[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);

        expect(results[2]._operator).toEqual('re');
        expect(results[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);

        expect(results[3]._operator).toEqual('h');
        expect(results[3]._operands).toEqual([]);

        expect(results[4]._operator).toEqual('W');
        expect(results[4]._operands).toEqual([]);

        expect(results[5]._operator).toEqual('n');
        expect(results[5]._operands).toEqual([]);

        expect(results[6]._operator).toEqual('cm');
        expect(results[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);

        expect(results[7]._operator).toEqual('BT');
        expect(results[7]._operands).toEqual([]);

        expect(results[8]._operator).toEqual('CS');
        expect(results[8]._operands).toEqual(['/DeviceRGB']);

        expect(results[9]._operator).toEqual('cs');
        expect(results[9]._operands).toEqual(['/DeviceRGB']);

        expect(results[10]._operator).toEqual('rg');
        expect(results[10]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[11]._operator).toEqual('Tf');

        expect(results[12]._operator).toEqual('Tr');
        expect(results[12]._operands).toEqual(['0']);

        expect(results[13]._operator).toEqual('Tc');
        expect(results[13]._operands).toEqual(['0.000']);

        expect(results[14]._operator).toEqual('Tw');
        expect(results[14]._operands).toEqual(['0.000']);

        expect(results[15]._operator).toEqual('Tz');
        expect(results[15]._operands).toEqual(['100.000']);

        expect(results[16]._operator).toEqual('Tm');
        expect(results[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-57.45']);

        expect(results[17]._operator).toEqual('Td');
        expect(results[17]._operands).toEqual(['112.672', '0.000']);

        expect(results[18]._operator).toEqual("'");
        expect(results[18]._operands).toEqual(['(PDF)']);

        expect(results[19]._operator).toEqual('ET');
        expect(results[19]._operands).toEqual([]);

        expect(results[20]._operator).toEqual('q');
        expect(results[20]._operands).toEqual([]);

        expect(results[21]._operator).toEqual('cm');
        expect(results[21]._operands).toEqual(['1.00', '.00', '.00', '1.00', '172.67', '-108.00']);

        expect(results[22]._operator).toEqual('Do');

        expect(results[23]._operator).toEqual('Q');
        expect(results[23]._operands).toEqual([]);

        expect(results[24]._operator).toEqual('BT');
        expect(results[24]._operands).toEqual([]);

        expect(results[25]._operator).toEqual('rg');
        expect(results[25]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[26]._operator).toEqual('Tf');

        expect(results[27]._operator).toEqual('Tm');
        expect(results[27]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-66.70']);

        expect(results[28]._operator).toEqual('Td');
        expect(results[28]._operands).toEqual(['109.112', '0.000']);

        expect(results[29]._operator).toEqual("'");
        expect(results[29]._operands).toEqual(['(XlsIO)']);

        expect(results[30]._operator).toEqual('ET');
        expect(results[30]._operands).toEqual([]);

        expect(results[31]._operator).toEqual('q');
        expect(results[31]._operands).toEqual([]);

        expect(results[32]._operator).toEqual('cm');
        expect(results[32]._operands).toEqual(['1.00', '.00', '.00', '1.00', '169.11', '-126.50']);

        expect(results[33]._operator).toEqual('Do');

        expect(results[34]._operator).toEqual('Q');
        expect(results[34]._operands).toEqual([]);

        expect(results[35]._operator).toEqual('BT');
        expect(results[35]._operands).toEqual([]);

        expect(results[36]._operator).toEqual('rg');
        expect(results[36]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[37]._operator).toEqual('Tf');

        expect(results[38]._operator).toEqual('Tm');
        expect(results[38]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-75.94']);

        expect(results[39]._operator).toEqual('Td');
        expect(results[39]._operands).toEqual(['106.000', '0.000']);

        expect(results[40]._operator).toEqual("'");
        expect(results[40]._operands).toEqual(['(DocIO)']);

        expect(results[41]._operator).toEqual('ET');
        expect(results[41]._operands).toEqual([]);

        expect(results[42]._operator).toEqual('q');
        expect(results[42]._operands).toEqual([]);

        expect(results[43]._operator).toEqual('cm');
        expect(results[43]._operands).toEqual(['1.00', '.00', '.00', '1.00', '166.00', '-144.99']);

        expect(results[44]._operator).toEqual('Do');

        expect(results[45]._operator).toEqual('Q');
        expect(results[45]._operands).toEqual([]);

        expect(results[46]._operator).toEqual('BT');
        expect(results[46]._operands).toEqual([]);

        expect(results[47]._operator).toEqual('rg');
        expect(results[47]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[48]._operator).toEqual('Tf');

        expect(results[49]._operator).toEqual('Tm');
        expect(results[49]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-85.19']);

        expect(results[50]._operator).toEqual('Td');
        expect(results[50]._operands).toEqual(['113.112', '0.000']);

        expect(results[51]._operator).toEqual("'");
        expect(results[51]._operands).toEqual(['(PPT)']);

        expect(results[52]._operator).toEqual('ET');
        expect(results[52]._operands).toEqual([]);

        expect(results[53]._operator).toEqual('q');
        expect(results[53]._operands).toEqual([]);

        expect(results[54]._operator).toEqual('cm');
        expect(results[54]._operands).toEqual(['1.00', '.00', '.00', '1.00', '173.11', '-163.49']);

        expect(results[55]._operator).toEqual('Do');

        expect(results[56]._operator).toEqual('Q');
        expect(results[56]._operands).toEqual([]);

        expect(results[57]._operator).toEqual('BT');
        expect(results[57]._operands).toEqual([]);

        expect(results[58]._operator).toEqual('rg');
        expect(results[58]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[59]._operator).toEqual('Tf');

        expect(results[60]._operator).toEqual('Tm');
        expect(results[60]._operands).toEqual(['1.00', '.00', '.00', '1.00', '241.33', '-57.45']);

        expect(results[61]._operator).toEqual("'");
        expect(results[61]._operands).toEqual(['(PDF)']);

        expect(results[62]._operator).toEqual('ET');
        expect(results[62]._operands).toEqual([]);

        expect(results[63]._operator).toEqual('q');
        expect(results[63]._operands).toEqual([]);

        expect(results[64]._operator).toEqual('cm');
        expect(results[64]._operands).toEqual(['1.00', '.00', '.00', '1.00', '230.00', '-108.00']);

        expect(results[65]._operator).toEqual('Do');

        expect(results[66]._operator).toEqual('Q');
        expect(results[66]._operands).toEqual([]);

        expect(results[67]._operator).toEqual('BT');
        expect(results[67]._operands).toEqual([]);

        expect(results[68]._operator).toEqual('rg');
        expect(results[68]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[69]._operator).toEqual('Tf');

        expect(results[70]._operator).toEqual('Tm');
        expect(results[70]._operands).toEqual(['1.00', '.00', '.00', '1.00', '241.33', '-66.70']);

        expect(results[71]._operator).toEqual("'");
        expect(results[71]._operands).toEqual(['(XlsIO)']);

        expect(results[72]._operator).toEqual('ET');
        expect(results[72]._operands).toEqual([]);

        expect(results[73]._operator).toEqual('q');
        expect(results[73]._operands).toEqual([]);

        expect(results[74]._operator).toEqual('cm');
        expect(results[74]._operands).toEqual(['1.00', '.00', '.00', '1.00', '230.00', '-126.50']);

        expect(results[75]._operator).toEqual('Do');

        expect(results[76]._operator).toEqual('Q');
        expect(results[76]._operands).toEqual([]);

        expect(results[77]._operator).toEqual('BT');
        expect(results[77]._operands).toEqual([]);

        expect(results[78]._operator).toEqual('rg');
        expect(results[78]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[79]._operator).toEqual('Tf');

        expect(results[80]._operator).toEqual('Tm');
        expect(results[80]._operands).toEqual(['1.00', '.00', '.00', '1.00', '241.33', '-75.94']);

        expect(results[81]._operator).toEqual("'");
        expect(results[81]._operands).toEqual(['(DocIO)']);

        expect(results[82]._operator).toEqual('ET');
        expect(results[82]._operands).toEqual([]);

        expect(results[83]._operator).toEqual('q');
        expect(results[83]._operands).toEqual([]);

        expect(results[84]._operator).toEqual('cm');
        expect(results[84]._operands).toEqual(['1.00', '.00', '.00', '1.00', '230.00', '-144.99']);

        expect(results[85]._operator).toEqual('Do');

        expect(results[86]._operator).toEqual('Q');
        expect(results[86]._operands).toEqual([]);

        expect(results[87]._operator).toEqual('BT');
        expect(results[87]._operands).toEqual([]);

        expect(results[88]._operator).toEqual('rg');
        expect(results[88]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[89]._operator).toEqual('Tf');

        expect(results[90]._operator).toEqual('Tm');
        expect(results[90]._operands).toEqual(['1.00', '.00', '.00', '1.00', '241.33', '-85.19']);

        expect(results[91]._operator).toEqual("'");
        expect(results[91]._operands).toEqual(['(PPT)']);

        expect(results[92]._operator).toEqual('ET');
        expect(results[92]._operands).toEqual([]);

        expect(results[93]._operator).toEqual('q');
        expect(results[93]._operands).toEqual([]);

        expect(results[94]._operator).toEqual('cm');
        expect(results[94]._operands).toEqual(['1.00', '.00', '.00', '1.00', '230.00', '-163.49']);

        expect(results[95]._operator).toEqual('Do');

        expect(results[96]._operator).toEqual('Q');
        expect(results[96]._operands).toEqual([]);

        expect(results[97]._operator).toEqual('BT');
        expect(results[97]._operands).toEqual([]);

        expect(results[98]._operator).toEqual('rg');
        expect(results[98]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[99]._operator).toEqual('Tf');

        expect(results[100]._operator).toEqual('Tm');
        expect(results[100]._operands).toEqual(['1.00', '.00', '.00', '1.00', '411.33', '-57.45']);

        expect(results[101]._operator).toEqual("'");
        expect(results[101]._operands).toEqual(['(PDF)']);

        expect(results[102]._operator).toEqual('ET');
        expect(results[102]._operands).toEqual([]);

        expect(results[103]._operator).toEqual('q');
        expect(results[103]._operands).toEqual([]);

        expect(results[104]._operator).toEqual('cm');
        expect(results[104]._operands).toEqual(['1.00', '.00', '.00', '1.00', '400.00', '-108.00']);

        expect(results[105]._operator).toEqual('Do');

        expect(results[106]._operator).toEqual('Q');
        expect(results[106]._operands).toEqual([]);

        expect(results[107]._operator).toEqual('BT');
        expect(results[107]._operands).toEqual([]);

        expect(results[108]._operator).toEqual('rg');
        expect(results[108]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[109]._operator).toEqual('Tf');

        expect(results[110]._operator).toEqual('Tm');
        expect(results[110]._operands).toEqual(['1.00', '.00', '.00', '1.00', '411.33', '-66.70']);

        expect(results[111]._operator).toEqual("'");
        expect(results[111]._operands).toEqual(['(XlsIO)']);

        expect(results[112]._operator).toEqual('ET');
        expect(results[112]._operands).toEqual([]);

        expect(results[113]._operator).toEqual('q');
        expect(results[113]._operands).toEqual([]);

        expect(results[114]._operator).toEqual('cm');
        expect(results[114]._operands).toEqual(['1.00', '.00', '.00', '1.00', '400.00', '-126.50']);

        expect(results[115]._operator).toEqual('Do');

        expect(results[116]._operator).toEqual('Q');
        expect(results[116]._operands).toEqual([]);

        expect(results[117]._operator).toEqual('BT');
        expect(results[117]._operands).toEqual([]);

        expect(results[118]._operator).toEqual('rg');
        expect(results[118]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[119]._operator).toEqual('Tf');

        expect(results[120]._operator).toEqual('Tm');
        expect(results[120]._operands).toEqual(['1.00', '.00', '.00', '1.00', '411.33', '-75.94']);

        expect(results[121]._operator).toEqual("'");
        expect(results[121]._operands).toEqual(['(DocIO)']);

        expect(results[122]._operator).toEqual('ET');
        expect(results[122]._operands).toEqual([]);

        expect(results[123]._operator).toEqual('q');
        expect(results[123]._operands).toEqual([]);

        expect(results[124]._operator).toEqual('cm');
        expect(results[124]._operands).toEqual(['1.00', '.00', '.00', '1.00', '400.00', '-144.99']);

        expect(results[125]._operator).toEqual('Do');

        expect(results[126]._operator).toEqual('Q');
        expect(results[126]._operands).toEqual([]);

        expect(results[127]._operator).toEqual('BT');
        expect(results[127]._operands).toEqual([]);

        expect(results[128]._operator).toEqual('rg');
        expect(results[128]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[129]._operator).toEqual('Tf');

        expect(results[130]._operator).toEqual('Tm');
        expect(results[130]._operands).toEqual(['1.00', '.00', '.00', '1.00', '411.33', '-85.19']);

        expect(results[131]._operator).toEqual("'");
        expect(results[131]._operands).toEqual(['(PPT)']);

        expect(results[132]._operator).toEqual('ET');
        expect(results[132]._operands).toEqual([]);

        expect(results[133]._operator).toEqual('q');
        expect(results[133]._operands).toEqual([]);

        expect(results[134]._operator).toEqual('cm');
        expect(results[134]._operands).toEqual(['1.00', '.00', '.00', '1.00', '400.00', '-163.49']);

        expect(results[135]._operator).toEqual('Do');

        expect(results[136]._operator).toEqual('Q');
        expect(results[136]._operands).toEqual([]);
        page = document.getPage(3) as PdfPage;
        contents = page._pageDictionary.getArray('Contents');
        stream = contents[2];
        parser = new _ContentParser(stream.getBytes());
        results = parser._readContent();
        expect(results[0]._operator).toEqual('q');
        expect(results[0]._operands).toEqual([]);

        expect(results[1]._operator).toEqual('cm');
        expect(results[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);

        expect(results[2]._operator).toEqual('re');
        expect(results[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);

        expect(results[3]._operator).toEqual('h');
        expect(results[3]._operands).toEqual([]);

        expect(results[4]._operator).toEqual('W');
        expect(results[4]._operands).toEqual([]);

        expect(results[5]._operator).toEqual('n');
        expect(results[5]._operands).toEqual([]);

        expect(results[6]._operator).toEqual('cm');
        expect(results[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);

        expect(results[7]._operator).toEqual('BT');
        expect(results[7]._operands).toEqual([]);

        expect(results[8]._operator).toEqual('CS');
        expect(results[8]._operands).toEqual(['/DeviceRGB']);

        expect(results[9]._operator).toEqual('cs');
        expect(results[9]._operands).toEqual(['/DeviceRGB']);

        expect(results[10]._operator).toEqual('rg');
        expect(results[10]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[11]._operator).toEqual('Tf');

        expect(results[12]._operator).toEqual('Tr');
        expect(results[12]._operands).toEqual(['0']);

        expect(results[13]._operator).toEqual('Tc');
        expect(results[13]._operands).toEqual(['0.000']);

        expect(results[14]._operator).toEqual('Tw');
        expect(results[14]._operands).toEqual(['0.000']);

        expect(results[15]._operator).toEqual('Tz');
        expect(results[15]._operands).toEqual(['100.000']);

        expect(results[16]._operator).toEqual('Tm');
        expect(results[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '63.33', '-57.45']);

        expect(results[17]._operator).toEqual("'");
        expect(results[17]._operands).toEqual(['(PDF)']);

        expect(results[18]._operator).toEqual('ET');
        expect(results[18]._operands).toEqual([]);

        expect(results[19]._operator).toEqual('q');
        expect(results[19]._operands).toEqual([]);

        expect(results[20]._operator).toEqual('cm');
        expect(results[20]._operands).toEqual(['1.00', '.00', '.00', '1.00', '52.00', '-108.00']);

        expect(results[21]._operator).toEqual('Do');

        expect(results[22]._operator).toEqual('Q');
        expect(results[22]._operands).toEqual([]);

        expect(results[23]._operator).toEqual('BT');
        expect(results[23]._operands).toEqual([]);

        expect(results[24]._operator).toEqual('rg');
        expect(results[24]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[25]._operator).toEqual('Tf');

        expect(results[26]._operator).toEqual('Tm');
        expect(results[26]._operands).toEqual(['1.00', '.00', '.00', '1.00', '63.33', '-66.70']);

        expect(results[27]._operator).toEqual("'");
        expect(results[27]._operands).toEqual(['(XlsIO)']);

        expect(results[28]._operator).toEqual('ET');
        expect(results[28]._operands).toEqual([]);

        expect(results[29]._operator).toEqual('q');
        expect(results[29]._operands).toEqual([]);

        expect(results[30]._operator).toEqual('cm');
        expect(results[30]._operands).toEqual(['1.00', '.00', '.00', '1.00', '52.00', '-126.50']);

        expect(results[31]._operator).toEqual('Do');

        expect(results[32]._operator).toEqual('Q');
        expect(results[32]._operands).toEqual([]);

        expect(results[33]._operator).toEqual('BT');
        expect(results[33]._operands).toEqual([]);

        expect(results[34]._operator).toEqual('rg');
        expect(results[34]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[35]._operator).toEqual('Tf');

        expect(results[36]._operator).toEqual('Tm');
        expect(results[36]._operands).toEqual(['1.00', '.00', '.00', '1.00', '63.33', '-75.94']);

        expect(results[37]._operator).toEqual("'");
        expect(results[37]._operands).toEqual(['(DocIO)']);

        expect(results[38]._operator).toEqual('ET');
        expect(results[38]._operands).toEqual([]);

        expect(results[39]._operator).toEqual('q');
        expect(results[39]._operands).toEqual([]);

        expect(results[40]._operator).toEqual('cm');
        expect(results[40]._operands).toEqual(['1.00', '.00', '.00', '1.00', '52.00', '-144.99']);

        expect(results[41]._operator).toEqual('Do');

        expect(results[42]._operator).toEqual('Q');
        expect(results[42]._operands).toEqual([]);

        expect(results[43]._operator).toEqual('BT');
        expect(results[43]._operands).toEqual([]);

        expect(results[44]._operator).toEqual('rg');
        expect(results[44]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[45]._operator).toEqual('Tf');

        expect(results[46]._operator).toEqual('Tm');
        expect(results[46]._operands).toEqual(['1.00', '.00', '.00', '1.00', '63.33', '-85.19']);

        expect(results[47]._operator).toEqual("'");
        expect(results[47]._operands).toEqual(['(PPT)']);

        expect(results[48]._operator).toEqual('ET');
        expect(results[48]._operands).toEqual([]);

        expect(results[49]._operator).toEqual('q');
        expect(results[49]._operands).toEqual([]);

        expect(results[50]._operator).toEqual('cm');
        expect(results[50]._operands).toEqual(['1.00', '.00', '.00', '1.00', '52.00', '-163.49']);

        expect(results[51]._operator).toEqual('Do');

        expect(results[52]._operator).toEqual('Q');
        expect(results[52]._operands).toEqual([]);

        expect(results[53]._operator).toEqual('BT');
        expect(results[53]._operands).toEqual([]);

        expect(results[54]._operator).toEqual('rg');
        expect(results[54]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[55]._operator).toEqual('Tf');

        expect(results[56]._operator).toEqual('Tm');
        expect(results[56]._operands).toEqual(['1.00', '.00', '.00', '1.00', '216.33', '-57.45']);

        expect(results[57]._operator).toEqual("'");
        expect(results[57]._operands).toEqual(['(PDF)']);

        expect(results[58]._operator).toEqual('ET');
        expect(results[58]._operands).toEqual([]);

        expect(results[59]._operator).toEqual('q');
        expect(results[59]._operands).toEqual([]);

        expect(results[60]._operator).toEqual('cm');
        expect(results[60]._operands).toEqual(['1.00', '.00', '.00', '1.00', '205.00', '-108.00']);

        expect(results[61]._operator).toEqual('Do');

        expect(results[62]._operator).toEqual('Q');
        expect(results[62]._operands).toEqual([]);

        expect(results[63]._operator).toEqual('BT');
        expect(results[63]._operands).toEqual([]);

        expect(results[64]._operator).toEqual('rg');
        expect(results[64]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[65]._operator).toEqual('Tf');

        expect(results[66]._operator).toEqual('Tm');
        expect(results[66]._operands).toEqual(['1.00', '.00', '.00', '1.00', '216.33', '-66.70']);

        expect(results[67]._operator).toEqual("'");
        expect(results[67]._operands).toEqual(['(XlsIO)']);

        expect(results[68]._operator).toEqual('ET');
        expect(results[68]._operands).toEqual([]);

        expect(results[69]._operator).toEqual('q');
        expect(results[69]._operands).toEqual([]);

        expect(results[70]._operator).toEqual('cm');
        expect(results[70]._operands).toEqual(['1.00', '.00', '.00', '1.00', '205.00', '-126.50']);

        expect(results[71]._operator).toEqual('Do');

        expect(results[72]._operator).toEqual('Q');
        expect(results[72]._operands).toEqual([]);

        expect(results[73]._operator).toEqual('BT');
        expect(results[73]._operands).toEqual([]);

        expect(results[74]._operator).toEqual('rg');
        expect(results[74]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[75]._operator).toEqual('Tf');

        expect(results[76]._operator).toEqual('Tm');
        expect(results[76]._operands).toEqual(['1.00', '.00', '.00', '1.00', '216.33', '-75.94']);

        expect(results[77]._operator).toEqual("'");
        expect(results[77]._operands).toEqual(['(DocIO)']);

        expect(results[78]._operator).toEqual('ET');
        expect(results[78]._operands).toEqual([]);

        expect(results[79]._operator).toEqual('q');
        expect(results[79]._operands).toEqual([]);

        expect(results[80]._operator).toEqual('cm');
        expect(results[80]._operands).toEqual(['1.00', '.00', '.00', '1.00', '205.00', '-144.99']);

        expect(results[81]._operator).toEqual('Do');

        expect(results[82]._operator).toEqual('Q');
        expect(results[82]._operands).toEqual([]);

        expect(results[83]._operator).toEqual('BT');
        expect(results[83]._operands).toEqual([]);

        expect(results[84]._operator).toEqual('rg');
        expect(results[84]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[85]._operator).toEqual('Tf');

        expect(results[86]._operator).toEqual('Tm');
        expect(results[86]._operands).toEqual(['1.00', '.00', '.00', '1.00', '216.33', '-85.19']);

        expect(results[87]._operator).toEqual("'");
        expect(results[87]._operands).toEqual(['(PPT)']);

        expect(results[88]._operator).toEqual('ET');
        expect(results[88]._operands).toEqual([]);

        expect(results[89]._operator).toEqual('q');
        expect(results[89]._operands).toEqual([]);

        expect(results[90]._operator).toEqual('cm');
        expect(results[90]._operands).toEqual(['1.00', '.00', '.00', '1.00', '205.00', '-163.49']);

        expect(results[91]._operator).toEqual('Do');

        expect(results[92]._operator).toEqual('Q');
        expect(results[92]._operands).toEqual([]);

        expect(results[93]._operator).toEqual('BT');
        expect(results[93]._operands).toEqual([]);

        expect(results[94]._operator).toEqual('rg');
        expect(results[94]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[95]._operator).toEqual('Tf');

        expect(results[96]._operator).toEqual('Tm');
        expect(results[96]._operands).toEqual(['1.00', '.00', '.00', '1.00', '364.33', '-57.45']);

        expect(results[97]._operator).toEqual("'");
        expect(results[97]._operands).toEqual(['(PDF)']);

        expect(results[98]._operator).toEqual('ET');
        expect(results[98]._operands).toEqual([]);

        expect(results[99]._operator).toEqual('q');
        expect(results[99]._operands).toEqual([]);

        expect(results[100]._operator).toEqual('cm');
        expect(results[100]._operands).toEqual(['1.00', '.00', '.00', '1.00', '353.00', '-108.00']);

        expect(results[101]._operator).toEqual('Do');

        expect(results[102]._operator).toEqual('Q');
        expect(results[102]._operands).toEqual([]);

        expect(results[103]._operator).toEqual('BT');
        expect(results[103]._operands).toEqual([]);

        expect(results[104]._operator).toEqual('rg');
        expect(results[104]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[105]._operator).toEqual('Tf');

        expect(results[106]._operator).toEqual('Tm');
        expect(results[106]._operands).toEqual(['1.00', '.00', '.00', '1.00', '364.33', '-66.70']);

        expect(results[107]._operator).toEqual("'");
        expect(results[107]._operands).toEqual(['(XlsIO)']);

        expect(results[108]._operator).toEqual('ET');
        expect(results[108]._operands).toEqual([]);

        expect(results[109]._operator).toEqual('q');
        expect(results[109]._operands).toEqual([]);

        expect(results[110]._operator).toEqual('cm');
        expect(results[110]._operands).toEqual(['1.00', '.00', '.00', '1.00', '353.00', '-126.50']);

        expect(results[111]._operator).toEqual('Do');

        expect(results[112]._operator).toEqual('Q');
        expect(results[112]._operands).toEqual([]);

        expect(results[113]._operator).toEqual('BT');
        expect(results[113]._operands).toEqual([]);

        expect(results[114]._operator).toEqual('rg');
        expect(results[114]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[115]._operator).toEqual('Tf');

        expect(results[116]._operator).toEqual('Tm');
        expect(results[116]._operands).toEqual(['1.00', '.00', '.00', '1.00', '364.33', '-75.94']);

        expect(results[117]._operator).toEqual("'");
        expect(results[117]._operands).toEqual(['(DocIO)']);

        expect(results[118]._operator).toEqual('ET');
        expect(results[118]._operands).toEqual([]);

        expect(results[119]._operator).toEqual('q');
        expect(results[119]._operands).toEqual([]);

        expect(results[120]._operator).toEqual('cm');
        expect(results[120]._operands).toEqual(['1.00', '.00', '.00', '1.00', '353.00', '-144.99']);

        expect(results[121]._operator).toEqual('Do');

        expect(results[122]._operator).toEqual('Q');
        expect(results[122]._operands).toEqual([]);

        expect(results[123]._operator).toEqual('BT');
        expect(results[123]._operands).toEqual([]);

        expect(results[124]._operator).toEqual('rg');
        expect(results[124]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[125]._operator).toEqual('Tf');

        expect(results[126]._operator).toEqual('Tm');
        expect(results[126]._operands).toEqual(['1.00', '.00', '.00', '1.00', '364.33', '-85.19']);

        expect(results[127]._operator).toEqual("'");
        expect(results[127]._operands).toEqual(['(PPT)']);

        expect(results[128]._operator).toEqual('ET');
        expect(results[128]._operands).toEqual([]);

        expect(results[129]._operator).toEqual('q');
        expect(results[129]._operands).toEqual([]);

        expect(results[130]._operator).toEqual('cm');
        expect(results[130]._operands).toEqual(['1.00', '.00', '.00', '1.00', '353.00', '-163.49']);

        expect(results[131]._operator).toEqual('Do');

        expect(results[132]._operator).toEqual('Q');
        expect(results[132]._operands).toEqual([]);
        page = document.getPage(4) as PdfPage;
        contents = page._pageDictionary.getArray('Contents');
        stream = contents[2];
        parser = new _ContentParser(stream.getBytes());
        results = parser._readContent();
        expect(results[0]._operator).toEqual('q');
        expect(results[0]._operands).toEqual([]);

        expect(results[1]._operator).toEqual('cm');
        expect(results[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);

        expect(results[2]._operator).toEqual('re');
        expect(results[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);

        expect(results[3]._operator).toEqual('h');
        expect(results[3]._operands).toEqual([]);

        expect(results[4]._operator).toEqual('W');
        expect(results[4]._operands).toEqual([]);

        expect(results[5]._operator).toEqual('n');
        expect(results[5]._operands).toEqual([]);

        expect(results[6]._operator).toEqual('cm');
        expect(results[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);

        expect(results[7]._operator).toEqual('BT');
        expect(results[7]._operands).toEqual([]);

        expect(results[8]._operator).toEqual('CS');
        expect(results[8]._operands).toEqual(['/DeviceRGB']);

        expect(results[9]._operator).toEqual('cs');
        expect(results[9]._operands).toEqual(['/DeviceRGB']);

        expect(results[10]._operator).toEqual('rg');
        expect(results[10]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[11]._operator).toEqual('Tf');

        expect(results[12]._operator).toEqual('Tr');
        expect(results[12]._operands).toEqual(['0']);

        expect(results[13]._operator).toEqual('Tc');
        expect(results[13]._operands).toEqual(['0.000']);

        expect(results[14]._operator).toEqual('Tw');
        expect(results[14]._operands).toEqual(['0.000']);

        expect(results[15]._operator).toEqual('Tz');
        expect(results[15]._operands).toEqual(['100.000']);

        expect(results[16]._operator).toEqual('Tm');
        expect(results[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-57.45']);

        expect(results[17]._operator).toEqual("'");
        expect(results[17]._operands).toEqual(['(PDF)']);

        expect(results[18]._operator).toEqual('ET');
        expect(results[18]._operands).toEqual([]);

        expect(results[19]._operator).toEqual('q');
        expect(results[19]._operands).toEqual([]);

        expect(results[20]._operator).toEqual('cm');
        expect(results[20]._operands).toEqual(['1.00', '.00', '.00', '1.00', '81.00', '-108.00']);

        expect(results[21]._operator).toEqual('Do');

        expect(results[22]._operator).toEqual('Q');
        expect(results[22]._operands).toEqual([]);

        expect(results[23]._operator).toEqual('BT');
        expect(results[23]._operands).toEqual([]);

        expect(results[24]._operator).toEqual('rg');
        expect(results[24]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[25]._operator).toEqual('Tf');

        expect(results[26]._operator).toEqual('Tm');
        expect(results[26]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-66.70']);

        expect(results[27]._operator).toEqual("'");
        expect(results[27]._operands).toEqual(['(XlsIO)']);

        expect(results[28]._operator).toEqual('ET');
        expect(results[28]._operands).toEqual([]);

        expect(results[29]._operator).toEqual('q');
        expect(results[29]._operands).toEqual([]);

        expect(results[30]._operator).toEqual('cm');
        expect(results[30]._operands).toEqual(['1.00', '.00', '.00', '1.00', '84.56', '-126.50']);

        expect(results[31]._operator).toEqual('Do');

        expect(results[32]._operator).toEqual('Q');
        expect(results[32]._operands).toEqual([]);

        expect(results[33]._operator).toEqual('BT');
        expect(results[33]._operands).toEqual([]);

        expect(results[34]._operator).toEqual('rg');
        expect(results[34]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[35]._operator).toEqual('Tf');

        expect(results[36]._operator).toEqual('Tm');
        expect(results[36]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-75.94']);

        expect(results[37]._operator).toEqual("'");
        expect(results[37]._operands).toEqual(['(DocIO)']);

        expect(results[38]._operator).toEqual('ET');
        expect(results[38]._operands).toEqual([]);

        expect(results[39]._operator).toEqual('q');
        expect(results[39]._operands).toEqual([]);

        expect(results[40]._operator).toEqual('cm');
        expect(results[40]._operands).toEqual(['1.00', '.00', '.00', '1.00', '87.67', '-144.99']);

        expect(results[41]._operator).toEqual('Do');

        expect(results[42]._operator).toEqual('Q');
        expect(results[42]._operands).toEqual([]);

        expect(results[43]._operator).toEqual('BT');
        expect(results[43]._operands).toEqual([]);

        expect(results[44]._operator).toEqual('rg');
        expect(results[44]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[45]._operator).toEqual('Tf');

        expect(results[46]._operator).toEqual('Tm');
        expect(results[46]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-85.19']);

        expect(results[47]._operator).toEqual("'");
        expect(results[47]._operands).toEqual(['(PPT)']);

        expect(results[48]._operator).toEqual('ET');
        expect(results[48]._operands).toEqual([]);

        expect(results[49]._operator).toEqual('q');
        expect(results[49]._operands).toEqual([]);

        expect(results[50]._operator).toEqual('cm');
        expect(results[50]._operands).toEqual(['1.00', '.00', '.00', '1.00', '80.56', '-163.49']);

        expect(results[51]._operator).toEqual('Do');

        expect(results[52]._operator).toEqual('Q');
        expect(results[52]._operands).toEqual([]);

        expect(results[53]._operator).toEqual('BT');
        expect(results[53]._operands).toEqual([]);

        expect(results[54]._operator).toEqual('rg');
        expect(results[54]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[55]._operator).toEqual('Tf');

        expect(results[56]._operator).toEqual('Tm');
        expect(results[56]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-57.45']);

        expect(results[57]._operator).toEqual("'");
        expect(results[57]._operands).toEqual(['(PDF)']);

        expect(results[58]._operator).toEqual('ET');
        expect(results[58]._operands).toEqual([]);

        expect(results[59]._operator).toEqual('q');
        expect(results[59]._operands).toEqual([]);

        expect(results[60]._operator).toEqual('cm');
        expect(results[60]._operands).toEqual(['1.00', '.00', '.00', '1.00', '231.00', '-108.00']);

        expect(results[61]._operator).toEqual('Do');

        expect(results[62]._operator).toEqual('Q');
        expect(results[62]._operands).toEqual([]);

        expect(results[63]._operator).toEqual('BT');
        expect(results[63]._operands).toEqual([]);

        expect(results[64]._operator).toEqual('rg');
        expect(results[64]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[65]._operator).toEqual('Tf');

        expect(results[66]._operator).toEqual('Tm');
        expect(results[66]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-66.70']);

        expect(results[67]._operator).toEqual("'");
        expect(results[67]._operands).toEqual(['(XlsIO)']);

        expect(results[68]._operator).toEqual('ET');
        expect(results[68]._operands).toEqual([]);

        expect(results[69]._operator).toEqual('q');
        expect(results[69]._operands).toEqual([]);

        expect(results[70]._operator).toEqual('cm');
        expect(results[70]._operands).toEqual(['1.00', '.00', '.00', '1.00', '234.56', '-126.50']);

        expect(results[71]._operator).toEqual('Do');

        expect(results[72]._operator).toEqual('Q');
        expect(results[72]._operands).toEqual([]);

        expect(results[73]._operator).toEqual('BT');
        expect(results[73]._operands).toEqual([]);

        expect(results[74]._operator).toEqual('rg');
        expect(results[74]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[75]._operator).toEqual('Tf');

        expect(results[76]._operator).toEqual('Tm');
        expect(results[76]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-75.94']);

        expect(results[77]._operator).toEqual("'");
        expect(results[77]._operands).toEqual(['(DocIO)']);

        expect(results[78]._operator).toEqual('ET');
        expect(results[78]._operands).toEqual([]);

        expect(results[79]._operator).toEqual('q');
        expect(results[79]._operands).toEqual([]);

        expect(results[80]._operator).toEqual('cm');
        expect(results[80]._operands).toEqual(['1.00', '.00', '.00', '1.00', '237.67', '-144.99']);

        expect(results[81]._operator).toEqual('Do');

        expect(results[82]._operator).toEqual('Q');
        expect(results[82]._operands).toEqual([]);

        expect(results[83]._operator).toEqual('BT');
        expect(results[83]._operands).toEqual([]);

        expect(results[84]._operator).toEqual('rg');
        expect(results[84]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[85]._operator).toEqual('Tf');

        expect(results[86]._operator).toEqual('Tm');
        expect(results[86]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-85.19']);

        expect(results[87]._operator).toEqual("'");
        expect(results[87]._operands).toEqual(['(PPT)']);

        expect(results[88]._operator).toEqual('ET');
        expect(results[88]._operands).toEqual([]);

        expect(results[89]._operator).toEqual('q');
        expect(results[89]._operands).toEqual([]);

        expect(results[90]._operator).toEqual('cm');
        expect(results[90]._operands).toEqual(['1.00', '.00', '.00', '1.00', '230.56', '-163.49']);

        expect(results[91]._operator).toEqual('Do');

        expect(results[92]._operator).toEqual('Q');
        expect(results[92]._operands).toEqual([]);

        expect(results[93]._operator).toEqual('BT');
        expect(results[93]._operands).toEqual([]);

        expect(results[94]._operator).toEqual('rg');
        expect(results[94]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[95]._operator).toEqual('Tf');

        expect(results[96]._operator).toEqual('Tm');
        expect(results[96]._operands).toEqual(['1.00', '.00', '.00', '1.00', '371.33', '-57.45']);

        expect(results[97]._operator).toEqual("'");
        expect(results[97]._operands).toEqual(['(PDF)']);

        expect(results[98]._operator).toEqual('ET');
        expect(results[98]._operands).toEqual([]);

        expect(results[99]._operator).toEqual('q');
        expect(results[99]._operands).toEqual([]);

        expect(results[100]._operator).toEqual('cm');
        expect(results[100]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-108.00']);

        expect(results[101]._operator).toEqual('Do');

        expect(results[102]._operator).toEqual('Q');
        expect(results[102]._operands).toEqual([]);

        expect(results[103]._operator).toEqual('BT');
        expect(results[103]._operands).toEqual([]);

        expect(results[104]._operator).toEqual('rg');
        expect(results[104]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[105]._operator).toEqual('Tf');

        expect(results[106]._operator).toEqual('Tm');
        expect(results[106]._operands).toEqual(['1.00', '.00', '.00', '1.00', '371.33', '-66.70']);

        expect(results[107]._operator).toEqual("'");
        expect(results[107]._operands).toEqual(['(XlsIO)']);

        expect(results[108]._operator).toEqual('ET');
        expect(results[108]._operands).toEqual([]);

        expect(results[109]._operator).toEqual('q');
        expect(results[109]._operands).toEqual([]);

        expect(results[110]._operator).toEqual('cm');
        expect(results[110]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-126.50']);

        expect(results[111]._operator).toEqual('Do');

        expect(results[112]._operator).toEqual('Q');
        expect(results[112]._operands).toEqual([]);

        expect(results[113]._operator).toEqual('BT');
        expect(results[113]._operands).toEqual([]);

        expect(results[114]._operator).toEqual('rg');
        expect(results[114]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[115]._operator).toEqual('Tf');

        expect(results[116]._operator).toEqual('Tm');
        expect(results[116]._operands).toEqual(['1.00', '.00', '.00', '1.00', '371.33', '-75.94']);

        expect(results[117]._operator).toEqual("'");
        expect(results[117]._operands).toEqual(['(DocIO)']);

        expect(results[118]._operator).toEqual('ET');
        expect(results[118]._operands).toEqual([]);

        expect(results[119]._operator).toEqual('q');
        expect(results[119]._operands).toEqual([]);

        expect(results[120]._operator).toEqual('cm');
        expect(results[120]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-144.99']);

        expect(results[121]._operator).toEqual('Do');

        expect(results[122]._operator).toEqual('Q');
        expect(results[122]._operands).toEqual([]);

        expect(results[123]._operator).toEqual('BT');
        expect(results[123]._operands).toEqual([]);

        expect(results[124]._operator).toEqual('rg');
        expect(results[124]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[125]._operator).toEqual('Tf');

        expect(results[126]._operator).toEqual('Tm');
        expect(results[126]._operands).toEqual(['1.00', '.00', '.00', '1.00', '371.33', '-85.19']);

        expect(results[127]._operator).toEqual("'");
        expect(results[127]._operands).toEqual(['(PPT)']);

        expect(results[128]._operator).toEqual('ET');
        expect(results[128]._operands).toEqual([]);

        expect(results[129]._operator).toEqual('q');
        expect(results[129]._operands).toEqual([]);

        expect(results[130]._operator).toEqual('cm');
        expect(results[130]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-163.49']);

        expect(results[131]._operator).toEqual('Do');

        expect(results[132]._operator).toEqual('Q');
        expect(results[132]._operands).toEqual([]);
        page = document.getPage(5) as PdfPage;
        contents = page._pageDictionary.getArray('Contents');
        stream = contents[2];
        parser = new _ContentParser(stream.getBytes());
        results = parser._readContent();
        expect(results[0]._operator).toEqual('q');
        expect(results[0]._operands).toEqual([]);

        expect(results[1]._operator).toEqual('cm');
        expect(results[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);

        expect(results[2]._operator).toEqual('re');
        expect(results[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);

        expect(results[3]._operator).toEqual('h');
        expect(results[3]._operands).toEqual([]);

        expect(results[4]._operator).toEqual('W');
        expect(results[4]._operands).toEqual([]);

        expect(results[5]._operator).toEqual('n');
        expect(results[5]._operands).toEqual([]);

        expect(results[6]._operator).toEqual('cm');
        expect(results[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);

        expect(results[7]._operator).toEqual('BT');
        expect(results[7]._operands).toEqual([]);

        expect(results[8]._operator).toEqual('CS');
        expect(results[8]._operands).toEqual(['/DeviceRGB']);

        expect(results[9]._operator).toEqual('cs');
        expect(results[9]._operands).toEqual(['/DeviceRGB']);

        expect(results[10]._operator).toEqual('rg');
        expect(results[10]._operands).toEqual(['1.000', '0.000', '0.000']);

        expect(results[11]._operator).toEqual('Tf');

        expect(results[12]._operator).toEqual('Tr');
        expect(results[12]._operands).toEqual(['0']);

        expect(results[13]._operator).toEqual('Tc');
        expect(results[13]._operands).toEqual(['0.000']);

        expect(results[14]._operator).toEqual('Tw');
        expect(results[14]._operands).toEqual(['0.000']);

        expect(results[15]._operator).toEqual('Tz');
        expect(results[15]._operands).toEqual(['100.000']);

        expect(results[16]._operator).toEqual('Tm');
        expect(results[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-57.45']);

        expect(results[17]._operator).toEqual("'");
        expect(results[17]._operands).toEqual(['(PDF)']);

        expect(results[18]._operator).toEqual('ET');
        expect(results[18]._operands).toEqual([]);

        expect(results[19]._operator).toEqual('q');
        expect(results[19]._operands).toEqual([]);

        expect(results[20]._operator).toEqual('cm');
        expect(results[20]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-108.00']);

        expect(results[21]._operator).toEqual('Do');

        expect(results[22]._operator).toEqual('Q');
        expect(results[22]._operands).toEqual([]);

        expect(results[23]._operator).toEqual('BT');
        expect(results[23]._operands).toEqual([]);

        expect(results[24]._operator).toEqual('rg');
        expect(results[24]._operands).toEqual(['1.000', '0.000', '0.000']);

        expect(results[25]._operator).toEqual('Tf');

        expect(results[26]._operator).toEqual('Tm');
        expect(results[26]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-66.70']);

        expect(results[27]._operator).toEqual("'");
        expect(results[27]._operands).toEqual(['(XlsIO)']);

        expect(results[28]._operator).toEqual('ET');
        expect(results[28]._operands).toEqual([]);

        expect(results[29]._operator).toEqual('q');
        expect(results[29]._operands).toEqual([]);

        expect(results[30]._operator).toEqual('cm');
        expect(results[30]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-126.50']);

        expect(results[31]._operator).toEqual('Do');

        expect(results[32]._operator).toEqual('Q');
        expect(results[32]._operands).toEqual([]);

        expect(results[33]._operator).toEqual('BT');
        expect(results[33]._operands).toEqual([]);

        expect(results[34]._operator).toEqual('rg');
        expect(results[34]._operands).toEqual(['1.000', '0.000', '0.000']);

        expect(results[35]._operator).toEqual('Tf');

        expect(results[36]._operator).toEqual('Tm');
        expect(results[36]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-75.94']);

        expect(results[37]._operator).toEqual("'");
        expect(results[37]._operands).toEqual(['(DocIO)']);

        expect(results[38]._operator).toEqual('ET');
        expect(results[38]._operands).toEqual([]);

        expect(results[39]._operator).toEqual('q');
        expect(results[39]._operands).toEqual([]);

        expect(results[40]._operator).toEqual('cm');
        expect(results[40]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-144.99']);

        expect(results[41]._operator).toEqual('Do');

        expect(results[42]._operator).toEqual('Q');
        expect(results[42]._operands).toEqual([]);

        expect(results[43]._operator).toEqual('BT');
        expect(results[43]._operands).toEqual([]);

        expect(results[44]._operator).toEqual('rg');
        expect(results[44]._operands).toEqual(['1.000', '0.000', '0.000']);

        expect(results[45]._operator).toEqual('Tf');

        expect(results[46]._operator).toEqual('Tm');
        expect(results[46]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-85.19']);

        expect(results[47]._operator).toEqual("'");
        expect(results[47]._operands).toEqual(['(PPT)']);

        expect(results[48]._operator).toEqual('ET');
        expect(results[48]._operands).toEqual([]);

        expect(results[49]._operator).toEqual('q');
        expect(results[49]._operands).toEqual([]);

        expect(results[50]._operator).toEqual('cm');
        expect(results[50]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-163.49']);

        expect(results[51]._operator).toEqual('Do');

        expect(results[52]._operator).toEqual('Q');
        expect(results[52]._operands).toEqual([]);

        expect(results[53]._operator).toEqual('BT');
        expect(results[53]._operands).toEqual([]);

        expect(results[54]._operator).toEqual('rg');
        expect(results[54]._operands).toEqual(['1.000', '0.000', '0.000']);

        expect(results[55]._operator).toEqual('Tf');

        expect(results[56]._operator).toEqual('Tm');
        expect(results[56]._operands).toEqual(['1.00', '.00', '.00', '1.00', '221.33', '-57.45']);

        expect(results[57]._operator).toEqual("'");
        expect(results[57]._operands).toEqual(['(PDF)']);

        expect(results[58]._operator).toEqual('ET');
        expect(results[58]._operands).toEqual([]);

        expect(results[59]._operator).toEqual('q');
        expect(results[59]._operands).toEqual([]);

        expect(results[60]._operator).toEqual('cm');
        expect(results[60]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-108.00']);

        expect(results[61]._operator).toEqual('Do');

        expect(results[62]._operator).toEqual('Q');
        expect(results[62]._operands).toEqual([]);

        expect(results[63]._operator).toEqual('BT');
        expect(results[63]._operands).toEqual([]);

        expect(results[64]._operator).toEqual('rg');
        expect(results[64]._operands).toEqual(['1.000', '0.000', '0.000']);

        expect(results[65]._operator).toEqual('Tf');

        expect(results[66]._operator).toEqual('Tm');
        expect(results[66]._operands).toEqual(['1.00', '.00', '.00', '1.00', '221.33', '-66.70']);

        expect(results[67]._operator).toEqual("'");
        expect(results[67]._operands).toEqual(['(XlsIO)']);

        expect(results[68]._operator).toEqual('ET');
        expect(results[68]._operands).toEqual([]);

        expect(results[69]._operator).toEqual('q');
        expect(results[69]._operands).toEqual([]);

        expect(results[70]._operator).toEqual('cm');
        expect(results[70]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-126.50']);

        expect(results[71]._operator).toEqual('Do');

        expect(results[72]._operator).toEqual('Q');
        expect(results[72]._operands).toEqual([]);

        expect(results[73]._operator).toEqual('BT');
        expect(results[73]._operands).toEqual([]);

        expect(results[74]._operator).toEqual('rg');
        expect(results[74]._operands).toEqual(['1.000', '0.000', '0.000']);

        expect(results[75]._operator).toEqual('Tf');

        expect(results[76]._operator).toEqual('Tm');
        expect(results[76]._operands).toEqual(['1.00', '.00', '.00', '1.00', '221.33', '-75.94']);

        expect(results[77]._operator).toEqual("'");
        expect(results[77]._operands).toEqual(['(DocIO)']);

        expect(results[78]._operator).toEqual('ET');
        expect(results[78]._operands).toEqual([]);

        expect(results[79]._operator).toEqual('q');
        expect(results[79]._operands).toEqual([]);

        expect(results[80]._operator).toEqual('cm');
        expect(results[80]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-144.99']);

        expect(results[81]._operator).toEqual('Do');

        expect(results[82]._operator).toEqual('Q');
        expect(results[82]._operands).toEqual([]);

        expect(results[83]._operator).toEqual('BT');
        expect(results[83]._operands).toEqual([]);

        expect(results[84]._operator).toEqual('rg');
        expect(results[84]._operands).toEqual(['1.000', '0.000', '0.000']);

        expect(results[85]._operator).toEqual('Tf');

        expect(results[86]._operator).toEqual('Tm');
        expect(results[86]._operands).toEqual(['1.00', '.00', '.00', '1.00', '221.33', '-85.19']);

        expect(results[87]._operator).toEqual("'");
        expect(results[87]._operands).toEqual(['(PPT)']);

        expect(results[88]._operator).toEqual('ET');
        expect(results[88]._operands).toEqual([]);

        expect(results[89]._operator).toEqual('q');
        expect(results[89]._operands).toEqual([]);

        expect(results[90]._operator).toEqual('cm');
        expect(results[90]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-163.49']);

        expect(results[91]._operator).toEqual('Do');

        expect(results[92]._operator).toEqual('Q');
        expect(results[92]._operands).toEqual([]);

        expect(results[93]._operator).toEqual('BT');
        expect(results[93]._operands).toEqual([]);

        expect(results[94]._operator).toEqual('rg');
        expect(results[94]._operands).toEqual(['0.000', '1.000', '0.000']);

        expect(results[95]._operator).toEqual('Tf');

        expect(results[96]._operator).toEqual('Tm');
        expect(results[96]._operands).toEqual(['1.00', '.00', '.00', '1.00', '371.33', '-57.45']);

        expect(results[97]._operator).toEqual("'");
        expect(results[97]._operands).toEqual(['(PDF)']);

        expect(results[98]._operator).toEqual('ET');
        expect(results[98]._operands).toEqual([]);

        expect(results[99]._operator).toEqual('q');
        expect(results[99]._operands).toEqual([]);

        expect(results[100]._operator).toEqual('cm');
        expect(results[100]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-108.00']);

        expect(results[101]._operator).toEqual('Do');

        expect(results[102]._operator).toEqual('Q');
        expect(results[102]._operands).toEqual([]);

        expect(results[103]._operator).toEqual('BT');
        expect(results[103]._operands).toEqual([]);

        expect(results[104]._operator).toEqual('rg');
        expect(results[104]._operands).toEqual(['0.000', '1.000', '0.000']);

        expect(results[105]._operator).toEqual('Tf');

        expect(results[106]._operator).toEqual('Tm');
        expect(results[106]._operands).toEqual(['1.00', '.00', '.00', '1.00', '371.33', '-66.70']);

        expect(results[107]._operator).toEqual("'");
        expect(results[107]._operands).toEqual(['(XlsIO)']);

        expect(results[108]._operator).toEqual('ET');
        expect(results[108]._operands).toEqual([]);

        expect(results[109]._operator).toEqual('q');
        expect(results[109]._operands).toEqual([]);

        expect(results[110]._operator).toEqual('cm');
        expect(results[110]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-126.50']);

        expect(results[111]._operator).toEqual('Do');

        expect(results[112]._operator).toEqual('Q');
        expect(results[112]._operands).toEqual([]);

        expect(results[113]._operator).toEqual('BT');
        expect(results[113]._operands).toEqual([]);

        expect(results[114]._operator).toEqual('rg');
        expect(results[114]._operands).toEqual(['0.000', '1.000', '0.000']);

        expect(results[115]._operator).toEqual('Tf');

        expect(results[116]._operator).toEqual('Tm');
        expect(results[116]._operands).toEqual(['1.00', '.00', '.00', '1.00', '371.33', '-75.94']);

        expect(results[117]._operator).toEqual("'");
        expect(results[117]._operands).toEqual(['(DocIO)']);

        expect(results[118]._operator).toEqual('ET');
        expect(results[118]._operands).toEqual([]);

        expect(results[119]._operator).toEqual('q');
        expect(results[119]._operands).toEqual([]);

        expect(results[120]._operator).toEqual('cm');
        expect(results[120]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-144.99']);

        expect(results[121]._operator).toEqual('Do');

        expect(results[122]._operator).toEqual('Q');
        expect(results[122]._operands).toEqual([]);

        expect(results[123]._operator).toEqual('BT');
        expect(results[123]._operands).toEqual([]);

        expect(results[124]._operator).toEqual('rg');
        expect(results[124]._operands).toEqual(['0.000', '1.000', '0.000']);

        expect(results[125]._operator).toEqual('Tf');

        expect(results[126]._operator).toEqual('Tm');
        expect(results[126]._operands).toEqual(['1.00', '.00', '.00', '1.00', '371.33', '-85.19']);

        expect(results[127]._operator).toEqual("'");
        expect(results[127]._operands).toEqual(['(PPT)']);

        expect(results[128]._operator).toEqual('ET');
        expect(results[128]._operands).toEqual([]);

        expect(results[129]._operator).toEqual('q');
        expect(results[129]._operands).toEqual([]);

        expect(results[130]._operator).toEqual('cm');
        expect(results[130]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-163.49']);

        expect(results[131]._operator).toEqual('Do');

        expect(results[132]._operator).toEqual('Q');
        expect(results[132]._operands).toEqual([]);
        page = document.getPage(6) as PdfPage;
        contents = page._pageDictionary.getArray('Contents');
        stream = contents[2];
        parser = new _ContentParser(stream.getBytes());
        results = parser._readContent();
        expect(results[0]._operator).toEqual('q');
        expect(results[0]._operands).toEqual([]);

        expect(results[1]._operator).toEqual('cm');
        expect(results[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);

        expect(results[2]._operator).toEqual('re');
        expect(results[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);

        expect(results[3]._operator).toEqual('h');
        expect(results[3]._operands).toEqual([]);

        expect(results[4]._operator).toEqual('W');
        expect(results[4]._operands).toEqual([]);

        expect(results[5]._operator).toEqual('n');
        expect(results[5]._operands).toEqual([]);

        expect(results[6]._operator).toEqual('cm');
        expect(results[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);

        expect(results[7]._operator).toEqual('BT');
        expect(results[7]._operands).toEqual([]);

        expect(results[8]._operator).toEqual('CS');
        expect(results[8]._operands).toEqual(['/DeviceRGB']);

        expect(results[9]._operator).toEqual('cs');
        expect(results[9]._operands).toEqual(['/DeviceRGB']);

        expect(results[10]._operator).toEqual('d');
        expect(results[10]._operands).toEqual(['[]', '0']);

        expect(results[11]._operator).toEqual('w');
        expect(results[11]._operands).toEqual(['1.000']);

        expect(results[12]._operator).toEqual('j');
        expect(results[12]._operands).toEqual(['0']);

        expect(results[13]._operator).toEqual('J');
        expect(results[13]._operands).toEqual(['0']);

        expect(results[14]._operator).toEqual('RG');
        expect(results[14]._operands).toEqual(['1.000', '0.000', '0.000']);

        expect(results[15]._operator).toEqual('rg');
        expect(results[15]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[16]._operator).toEqual('Tf');

        expect(results[17]._operator).toEqual('Tr');
        expect(results[17]._operands).toEqual(['2']);

        expect(results[18]._operator).toEqual('Tc');
        expect(results[18]._operands).toEqual(['0.000']);

        expect(results[19]._operator).toEqual('Tw');
        expect(results[19]._operands).toEqual(['0.000']);

        expect(results[20]._operator).toEqual('Tz');
        expect(results[20]._operands).toEqual(['100.000']);

        expect(results[21]._operator).toEqual('Tm');
        expect(results[21]._operands).toEqual(['1.00', '.00', '.00', '1.00', '73.33', '-57.45']);

        expect(results[22]._operator).toEqual("'");
        expect(results[22]._operands).toEqual(['(PDF)']);

        expect(results[23]._operator).toEqual('ET');
        expect(results[23]._operands).toEqual([]);

        expect(results[24]._operator).toEqual('q');
        expect(results[24]._operands).toEqual([]);

        expect(results[25]._operator).toEqual('cm');
        expect(results[25]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-59.70']);

        expect(results[26]._operator).toEqual('Do');

        expect(results[27]._operator).toEqual('Q');
        expect(results[27]._operands).toEqual([]);

        expect(results[28]._operator).toEqual('BT');
        expect(results[28]._operands).toEqual([]);

        expect(results[29]._operator).toEqual('d');
        expect(results[29]._operands).toEqual(['[]', '0']);

        expect(results[30]._operator).toEqual('w');
        expect(results[30]._operands).toEqual(['1.000']);

        expect(results[31]._operator).toEqual('j');
        expect(results[31]._operands).toEqual(['0']);

        expect(results[32]._operator).toEqual('J');
        expect(results[32]._operands).toEqual(['0']);

        expect(results[33]._operator).toEqual('RG');
        expect(results[33]._operands).toEqual(['1.000', '0.000', '0.000']);

        expect(results[34]._operator).toEqual('rg');
        expect(results[34]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[35]._operator).toEqual('Tf');

        expect(results[36]._operator).toEqual('Tm');
        expect(results[36]._operands).toEqual(['1.00', '.00', '.00', '1.00', '73.33', '-67.15']);

        expect(results[37]._operator).toEqual("'");
        expect(results[37]._operands).toEqual(['(XlsIO)']);

        expect(results[38]._operator).toEqual('ET');
        expect(results[38]._operands).toEqual([]);

        expect(results[39]._operator).toEqual('q');
        expect(results[39]._operands).toEqual([]);

        expect(results[40]._operator).toEqual('cm');
        expect(results[40]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-69.41']);

        expect(results[41]._operator).toEqual('Do');

        expect(results[42]._operator).toEqual('Q');
        expect(results[42]._operands).toEqual([]);

        expect(results[43]._operator).toEqual('BT');
        expect(results[43]._operands).toEqual([]);

        expect(results[44]._operator).toEqual('d');
        expect(results[44]._operands).toEqual(['[]', '0']);

        expect(results[45]._operator).toEqual('w');
        expect(results[45]._operands).toEqual(['1.000']);

        expect(results[46]._operator).toEqual('j');
        expect(results[46]._operands).toEqual(['0']);

        expect(results[47]._operator).toEqual('J');
        expect(results[47]._operands).toEqual(['0']);

        expect(results[48]._operator).toEqual('RG');
        expect(results[48]._operands).toEqual(['1.000', '0.000', '0.000']);

        expect(results[49]._operator).toEqual('rg');
        expect(results[49]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[50]._operator).toEqual('Tf');

        expect(results[51]._operator).toEqual('Tm');
        expect(results[51]._operands).toEqual(['1.00', '.00', '.00', '1.00', '73.33', '-76.86']);

        expect(results[52]._operator).toEqual("'");
        expect(results[52]._operands).toEqual(['(DocIO)']);

        expect(results[53]._operator).toEqual('ET');
        expect(results[53]._operands).toEqual([]);

        expect(results[54]._operator).toEqual('q');
        expect(results[54]._operands).toEqual([]);

        expect(results[55]._operator).toEqual('cm');
        expect(results[55]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-79.11']);

        expect(results[56]._operator).toEqual('Do');

        expect(results[57]._operator).toEqual('Q');
        expect(results[57]._operands).toEqual([]);

        expect(results[58]._operator).toEqual('BT');
        expect(results[58]._operands).toEqual([]);

        expect(results[59]._operator).toEqual('d');
        expect(results[59]._operands).toEqual(['[]', '0']);

        expect(results[60]._operator).toEqual('w');
        expect(results[60]._operands).toEqual(['1.000']);

        expect(results[61]._operator).toEqual('j');
        expect(results[61]._operands).toEqual(['0']);

        expect(results[62]._operator).toEqual('J');
        expect(results[62]._operands).toEqual(['0']);

        expect(results[63]._operator).toEqual('RG');
        expect(results[63]._operands).toEqual(['1.000', '0.000', '0.000']);

        expect(results[64]._operator).toEqual('rg');
        expect(results[64]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[65]._operator).toEqual('Tf');

        expect(results[66]._operator).toEqual('Tm');
        expect(results[66]._operands).toEqual(['1.00', '.00', '.00', '1.00', '73.33', '-86.56']);

        expect(results[67]._operator).toEqual("'");
        expect(results[67]._operands).toEqual(['(PPT)']);

        expect(results[68]._operator).toEqual('ET');
        expect(results[68]._operands).toEqual([]);

        expect(results[69]._operator).toEqual('q');
        expect(results[69]._operands).toEqual([]);

        expect(results[70]._operator).toEqual('cm');
        expect(results[70]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-88.82']);

        expect(results[71]._operator).toEqual('Do');

        expect(results[72]._operator).toEqual('Q');
        expect(results[72]._operands).toEqual([]);

        expect(results[73]._operator).toEqual('BT');
        expect(results[73]._operands).toEqual([]);

        expect(results[74]._operator).toEqual('d');
        expect(results[74]._operands).toEqual(['[]', '0']);

        expect(results[75]._operator).toEqual('w');
        expect(results[75]._operands).toEqual(['1.000']);

        expect(results[76]._operator).toEqual('j');
        expect(results[76]._operands).toEqual(['0']);

        expect(results[77]._operator).toEqual('J');
        expect(results[77]._operands).toEqual(['0']);

        expect(results[78]._operator).toEqual('RG');
        expect(results[78]._operands).toEqual(['1.000', '0.000', '0.000']);

        expect(results[79]._operator).toEqual('rg');
        expect(results[79]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[80]._operator).toEqual('Tf');

        expect(results[81]._operator).toEqual('Tm');
        expect(results[81]._operands).toEqual(['1.00', '.00', '.00', '1.00', '223.33', '-57.45']);

        expect(results[82]._operator).toEqual("'");
        expect(results[82]._operands).toEqual(['(PDF)']);

        expect(results[83]._operator).toEqual('ET');
        expect(results[83]._operands).toEqual([]);

        expect(results[84]._operator).toEqual('q');
        expect(results[84]._operands).toEqual([]);

        expect(results[85]._operator).toEqual('cm');
        expect(results[85]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-59.70']);

        expect(results[86]._operator).toEqual('Do');

        expect(results[87]._operator).toEqual('Q');
        expect(results[87]._operands).toEqual([]);

        expect(results[88]._operator).toEqual('BT');
        expect(results[88]._operands).toEqual([]);

        expect(results[89]._operator).toEqual('d');
        expect(results[89]._operands).toEqual(['[]', '0']);

        expect(results[90]._operator).toEqual('w');
        expect(results[90]._operands).toEqual(['1.000']);

        expect(results[91]._operator).toEqual('j');
        expect(results[91]._operands).toEqual(['0']);

        expect(results[92]._operator).toEqual('J');
        expect(results[92]._operands).toEqual(['0']);

        expect(results[93]._operator).toEqual('RG');
        expect(results[93]._operands).toEqual(['1.000', '0.000', '0.000']);

        expect(results[94]._operator).toEqual('rg');
        expect(results[94]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[95]._operator).toEqual('Tf');

        expect(results[96]._operator).toEqual('Tm');
        expect(results[96]._operands).toEqual(['1.00', '.00', '.00', '1.00', '223.33', '-67.15']);

        expect(results[97]._operator).toEqual("'");
        expect(results[97]._operands).toEqual(['(XlsIO)']);

        expect(results[98]._operator).toEqual('ET');
        expect(results[98]._operands).toEqual([]);

        expect(results[99]._operator).toEqual('q');
        expect(results[99]._operands).toEqual([]);

        expect(results[100]._operator).toEqual('cm');
        expect(results[100]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-69.41']);

        expect(results[101]._operator).toEqual('Do');

        expect(results[102]._operator).toEqual('Q');
        expect(results[102]._operands).toEqual([]);

        expect(results[103]._operator).toEqual('BT');
        expect(results[103]._operands).toEqual([]);

        expect(results[104]._operator).toEqual('d');
        expect(results[104]._operands).toEqual(['[]', '0']);

        expect(results[105]._operator).toEqual('w');
        expect(results[105]._operands).toEqual(['1.000']);

        expect(results[106]._operator).toEqual('j');
        expect(results[106]._operands).toEqual(['0']);

        expect(results[107]._operator).toEqual('J');
        expect(results[107]._operands).toEqual(['0']);

        expect(results[108]._operator).toEqual('RG');
        expect(results[108]._operands).toEqual(['1.000', '0.000', '0.000']);

        expect(results[109]._operator).toEqual('rg');
        expect(results[109]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[110]._operator).toEqual('Tf');

        expect(results[111]._operator).toEqual('Tm');
        expect(results[111]._operands).toEqual(['1.00', '.00', '.00', '1.00', '223.33', '-76.86']);

        expect(results[112]._operator).toEqual("'");
        expect(results[112]._operands).toEqual(['(DocIO)']);

        expect(results[113]._operator).toEqual('ET');
        expect(results[113]._operands).toEqual([]);

        expect(results[114]._operator).toEqual('q');
        expect(results[114]._operands).toEqual([]);

        expect(results[115]._operator).toEqual('cm');
        expect(results[115]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-79.11']);

        expect(results[116]._operator).toEqual('Do');

        expect(results[117]._operator).toEqual('Q');
        expect(results[117]._operands).toEqual([]);

        expect(results[118]._operator).toEqual('BT');
        expect(results[118]._operands).toEqual([]);

        expect(results[119]._operator).toEqual('d');
        expect(results[119]._operands).toEqual(['[]', '0']);

        expect(results[120]._operator).toEqual('w');
        expect(results[120]._operands).toEqual(['1.000']);

        expect(results[121]._operator).toEqual('j');
        expect(results[121]._operands).toEqual(['0']);

        expect(results[122]._operator).toEqual('J');
        expect(results[122]._operands).toEqual(['0']);

        expect(results[123]._operator).toEqual('RG');
        expect(results[123]._operands).toEqual(['1.000', '0.000', '0.000']);

        expect(results[124]._operator).toEqual('rg');
        expect(results[124]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[125]._operator).toEqual('Tf');

        expect(results[126]._operator).toEqual('Tm');
        expect(results[126]._operands).toEqual(['1.00', '.00', '.00', '1.00', '223.33', '-86.56']);

        expect(results[127]._operator).toEqual("'");
        expect(results[127]._operands).toEqual(['(PPT)']);

        expect(results[128]._operator).toEqual('ET');
        expect(results[128]._operands).toEqual([]);

        expect(results[129]._operator).toEqual('q');
        expect(results[129]._operands).toEqual([]);

        expect(results[130]._operator).toEqual('cm');
        expect(results[130]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-88.82']);

        expect(results[131]._operator).toEqual('Do');

        expect(results[132]._operator).toEqual('Q');
        expect(results[132]._operands).toEqual([]);

        expect(results[133]._operator).toEqual('BT');
        expect(results[133]._operands).toEqual([]);

        expect(results[134]._operator).toEqual('d');
        expect(results[134]._operands).toEqual(['[]', '0']);

        expect(results[135]._operator).toEqual('w');
        expect(results[135]._operands).toEqual(['1.000']);

        expect(results[136]._operator).toEqual('j');
        expect(results[136]._operands).toEqual(['0']);

        expect(results[137]._operator).toEqual('J');
        expect(results[137]._operands).toEqual(['0']);

        expect(results[138]._operator).toEqual('RG');
        expect(results[138]._operands).toEqual(['0.000', '1.000', '0.000']);

        expect(results[139]._operator).toEqual('rg');
        expect(results[139]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[140]._operator).toEqual('Tf');

        expect(results[141]._operator).toEqual('Tm');
        expect(results[141]._operands).toEqual(['1.00', '.00', '.00', '1.00', '373.33', '-57.45']);

        expect(results[142]._operator).toEqual("'");
        expect(results[142]._operands).toEqual(['(PDF)']);

        expect(results[143]._operator).toEqual('ET');
        expect(results[143]._operands).toEqual([]);

        expect(results[144]._operator).toEqual('q');
        expect(results[144]._operands).toEqual([]);

        expect(results[145]._operator).toEqual('cm');
        expect(results[145]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-59.70']);

        expect(results[146]._operator).toEqual('Do');

        expect(results[147]._operator).toEqual('Q');
        expect(results[147]._operands).toEqual([]);

        expect(results[148]._operator).toEqual('BT');
        expect(results[148]._operands).toEqual([]);

        expect(results[149]._operator).toEqual('d');
        expect(results[149]._operands).toEqual(['[]', '0']);

        expect(results[150]._operator).toEqual('w');
        expect(results[150]._operands).toEqual(['1.000']);

        expect(results[151]._operator).toEqual('j');
        expect(results[151]._operands).toEqual(['0']);

        expect(results[152]._operator).toEqual('J');
        expect(results[152]._operands).toEqual(['0']);

        expect(results[153]._operator).toEqual('RG');
        expect(results[153]._operands).toEqual(['0.000', '1.000', '0.000']);

        expect(results[154]._operator).toEqual('rg');
        expect(results[154]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[155]._operator).toEqual('Tf');

        expect(results[156]._operator).toEqual('Tm');
        expect(results[156]._operands).toEqual(['1.00', '.00', '.00', '1.00', '373.33', '-67.15']);

        expect(results[157]._operator).toEqual("'");
        expect(results[157]._operands).toEqual(['(XlsIO)']);

        expect(results[158]._operator).toEqual('ET');
        expect(results[158]._operands).toEqual([]);

        expect(results[159]._operator).toEqual('q');
        expect(results[159]._operands).toEqual([]);

        expect(results[160]._operator).toEqual('cm');
        expect(results[160]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-69.41']);

        expect(results[161]._operator).toEqual('Do');

        expect(results[162]._operator).toEqual('Q');
        expect(results[162]._operands).toEqual([]);

        expect(results[163]._operator).toEqual('BT');
        expect(results[163]._operands).toEqual([]);

        expect(results[164]._operator).toEqual('d');
        expect(results[164]._operands).toEqual(['[]', '0']);

        expect(results[165]._operator).toEqual('w');
        expect(results[165]._operands).toEqual(['1.000']);

        expect(results[166]._operator).toEqual('j');
        expect(results[166]._operands).toEqual(['0']);

        expect(results[167]._operator).toEqual('J');
        expect(results[167]._operands).toEqual(['0']);

        expect(results[168]._operator).toEqual('RG');
        expect(results[168]._operands).toEqual(['0.000', '1.000', '0.000']);

        expect(results[169]._operator).toEqual('rg');
        expect(results[169]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[170]._operator).toEqual('Tf');

        expect(results[171]._operator).toEqual('Tm');
        expect(results[171]._operands).toEqual(['1.00', '.00', '.00', '1.00', '373.33', '-76.86']);

        expect(results[172]._operator).toEqual("'");
        expect(results[172]._operands).toEqual(['(DocIO)']);

        expect(results[173]._operator).toEqual('ET');
        expect(results[173]._operands).toEqual([]);

        expect(results[174]._operator).toEqual('q');
        expect(results[174]._operands).toEqual([]);

        expect(results[175]._operator).toEqual('cm');
        expect(results[175]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-79.11']);

        expect(results[176]._operator).toEqual('Do');

        expect(results[177]._operator).toEqual('Q');
        expect(results[177]._operands).toEqual([]);

        expect(results[178]._operator).toEqual('BT');
        expect(results[178]._operands).toEqual([]);

        expect(results[179]._operator).toEqual('d');
        expect(results[179]._operands).toEqual(['[]', '0']);

        expect(results[180]._operator).toEqual('w');
        expect(results[180]._operands).toEqual(['1.000']);

        expect(results[181]._operator).toEqual('j');
        expect(results[181]._operands).toEqual(['0']);

        expect(results[182]._operator).toEqual('J');
        expect(results[182]._operands).toEqual(['0']);

        expect(results[183]._operator).toEqual('RG');
        expect(results[183]._operands).toEqual(['0.000', '1.000', '0.000']);

        expect(results[184]._operator).toEqual('rg');
        expect(results[184]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[185]._operator).toEqual('Tf');

        expect(results[186]._operator).toEqual('Tm');
        expect(results[186]._operands).toEqual(['1.00', '.00', '.00', '1.00', '373.33', '-86.56']);

        expect(results[187]._operator).toEqual("'");
        expect(results[187]._operands).toEqual(['(PPT)']);

        expect(results[188]._operator).toEqual('ET');
        expect(results[188]._operands).toEqual([]);

        expect(results[189]._operator).toEqual('q');
        expect(results[189]._operands).toEqual([]);

        expect(results[190]._operator).toEqual('cm');
        expect(results[190]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-88.82']);

        expect(results[191]._operator).toEqual('Do');

        expect(results[192]._operator).toEqual('Q');
        expect(results[192]._operands).toEqual([]);
        page = document.getPage(7) as PdfPage;
        contents = page._pageDictionary.getArray('Contents');
        stream = contents[2];
        parser = new _ContentParser(stream.getBytes());
        results = parser._readContent();
        expect(results[0]._operator).toEqual('q');
        expect(results[0]._operands).toEqual([]);

        expect(results[1]._operator).toEqual('cm');
        expect(results[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);

        expect(results[2]._operator).toEqual('re');
        expect(results[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);

        expect(results[3]._operator).toEqual('h');
        expect(results[3]._operands).toEqual([]);

        expect(results[4]._operator).toEqual('W');
        expect(results[4]._operands).toEqual([]);

        expect(results[5]._operator).toEqual('n');
        expect(results[5]._operands).toEqual([]);

        expect(results[6]._operator).toEqual('cm');
        expect(results[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);

        expect(results[7]._operator).toEqual('BT');
        expect(results[7]._operands).toEqual([]);

        expect(results[8]._operator).toEqual('CS');
        expect(results[8]._operands).toEqual(['/DeviceRGB']);

        expect(results[9]._operator).toEqual('cs');
        expect(results[9]._operands).toEqual(['/DeviceRGB']);

        expect(results[10]._operator).toEqual('rg');
        expect(results[10]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[11]._operator).toEqual('Tf');

        expect(results[12]._operator).toEqual('Tr');
        expect(results[12]._operands).toEqual(['0']);

        expect(results[13]._operator).toEqual('Tc');
        expect(results[13]._operands).toEqual(['0.000']);

        expect(results[14]._operator).toEqual('Tw');
        expect(results[14]._operands).toEqual(['0.000']);

        expect(results[15]._operator).toEqual('Tz');
        expect(results[15]._operands).toEqual(['100.000']);

        expect(results[16]._operator).toEqual('Tm');
        expect(results[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '72.91', '-58.05']);

        expect(results[17]._operator).toEqual("'");
        expect(results[17]._operands).toEqual(['(PDF)']);

        expect(results[18]._operator).toEqual('ET');
        expect(results[18]._operands).toEqual([]);

        expect(results[19]._operator).toEqual('q');
        expect(results[19]._operands).toEqual([]);

        expect(results[20]._operator).toEqual('cm');
        expect(results[20]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-110.00']);

        expect(results[21]._operator).toEqual('Do');

        expect(results[22]._operator).toEqual('Q');
        expect(results[22]._operands).toEqual([]);

        expect(results[23]._operator).toEqual('BT');
        expect(results[23]._operands).toEqual([]);

        expect(results[24]._operator).toEqual('rg');
        expect(results[24]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[25]._operator).toEqual('Tf');

        expect(results[26]._operator).toEqual('Tm');
        expect(results[26]._operands).toEqual(['1.00', '.00', '.00', '1.00', '72.91', '-68.60']);

        expect(results[27]._operator).toEqual("'");
        expect(results[27]._operands).toEqual(['(XlsIO)']);

        expect(results[28]._operator).toEqual('ET');
        expect(results[28]._operands).toEqual([]);

        expect(results[29]._operator).toEqual('q');
        expect(results[29]._operands).toEqual([]);

        expect(results[30]._operator).toEqual('cm');
        expect(results[30]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-131.10']);

        expect(results[31]._operator).toEqual('Do');

        expect(results[32]._operator).toEqual('Q');
        expect(results[32]._operands).toEqual([]);

        expect(results[33]._operator).toEqual('BT');
        expect(results[33]._operands).toEqual([]);

        expect(results[34]._operator).toEqual('rg');
        expect(results[34]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[35]._operator).toEqual('Tf');

        expect(results[36]._operator).toEqual('Tm');
        expect(results[36]._operands).toEqual(['1.00', '.00', '.00', '1.00', '72.91', '-79.15']);

        expect(results[37]._operator).toEqual("'");
        expect(results[37]._operands).toEqual(['(DocIO)']);

        expect(results[38]._operator).toEqual('ET');
        expect(results[38]._operands).toEqual([]);

        expect(results[39]._operator).toEqual('q');
        expect(results[39]._operands).toEqual([]);

        expect(results[40]._operator).toEqual('cm');
        expect(results[40]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-152.20']);

        expect(results[41]._operator).toEqual('Do');

        expect(results[42]._operator).toEqual('Q');
        expect(results[42]._operands).toEqual([]);

        expect(results[43]._operator).toEqual('BT');
        expect(results[43]._operands).toEqual([]);

        expect(results[44]._operator).toEqual('rg');
        expect(results[44]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[45]._operator).toEqual('Tf');

        expect(results[46]._operator).toEqual('Tm');
        expect(results[46]._operands).toEqual(['1.00', '.00', '.00', '1.00', '72.91', '-89.70']);

        expect(results[47]._operator).toEqual("'");
        expect(results[47]._operands).toEqual(['(PPT)']);

        expect(results[48]._operator).toEqual('ET');
        expect(results[48]._operands).toEqual([]);

        expect(results[49]._operator).toEqual('q');
        expect(results[49]._operands).toEqual([]);

        expect(results[50]._operator).toEqual('cm');
        expect(results[50]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-173.30']);

        expect(results[51]._operator).toEqual('Do');

        expect(results[52]._operator).toEqual('Q');
        expect(results[52]._operands).toEqual([]);

        expect(results[53]._operator).toEqual('BT');
        expect(results[53]._operands).toEqual([]);

        expect(results[54]._operator).toEqual('rg');
        expect(results[54]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[55]._operator).toEqual('Tf');

        expect(results[56]._operator).toEqual('Tm');
        expect(results[56]._operands).toEqual(['1.00', '.00', '.00', '1.00', '222.91', '-58.05']);

        expect(results[57]._operator).toEqual("'");
        expect(results[57]._operands).toEqual(['(PDF)']);

        expect(results[58]._operator).toEqual('ET');
        expect(results[58]._operands).toEqual([]);

        expect(results[59]._operator).toEqual('q');
        expect(results[59]._operands).toEqual([]);

        expect(results[60]._operator).toEqual('cm');
        expect(results[60]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-110.00']);

        expect(results[61]._operator).toEqual('Do');

        expect(results[62]._operator).toEqual('Q');
        expect(results[62]._operands).toEqual([]);

        expect(results[63]._operator).toEqual('BT');
        expect(results[63]._operands).toEqual([]);

        expect(results[64]._operator).toEqual('rg');
        expect(results[64]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[65]._operator).toEqual('Tf');

        expect(results[66]._operator).toEqual('Tm');
        expect(results[66]._operands).toEqual(['1.00', '.00', '.00', '1.00', '222.91', '-68.60']);

        expect(results[67]._operator).toEqual("'");
        expect(results[67]._operands).toEqual(['(XlsIO)']);

        expect(results[68]._operator).toEqual('ET');
        expect(results[68]._operands).toEqual([]);

        expect(results[69]._operator).toEqual('q');
        expect(results[69]._operands).toEqual([]);

        expect(results[70]._operator).toEqual('cm');
        expect(results[70]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-131.10']);

        expect(results[71]._operator).toEqual('Do');

        expect(results[72]._operator).toEqual('Q');
        expect(results[72]._operands).toEqual([]);

        expect(results[73]._operator).toEqual('BT');
        expect(results[73]._operands).toEqual([]);

        expect(results[74]._operator).toEqual('rg');
        expect(results[74]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[75]._operator).toEqual('Tf');

        expect(results[76]._operator).toEqual('Tm');
        expect(results[76]._operands).toEqual(['1.00', '.00', '.00', '1.00', '222.91', '-79.15']);

        expect(results[77]._operator).toEqual("'");
        expect(results[77]._operands).toEqual(['(DocIO)']);

        expect(results[78]._operator).toEqual('ET');
        expect(results[78]._operands).toEqual([]);

        expect(results[79]._operator).toEqual('q');
        expect(results[79]._operands).toEqual([]);

        expect(results[80]._operator).toEqual('cm');
        expect(results[80]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-152.20']);

        expect(results[81]._operator).toEqual('Do');

        expect(results[82]._operator).toEqual('Q');
        expect(results[82]._operands).toEqual([]);

        expect(results[83]._operator).toEqual('BT');
        expect(results[83]._operands).toEqual([]);

        expect(results[84]._operator).toEqual('rg');
        expect(results[84]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[85]._operator).toEqual('Tf');

        expect(results[86]._operator).toEqual('Tm');
        expect(results[86]._operands).toEqual(['1.00', '.00', '.00', '1.00', '222.91', '-89.70']);

        expect(results[87]._operator).toEqual("'");
        expect(results[87]._operands).toEqual(['(PPT)']);

        expect(results[88]._operator).toEqual('ET');
        expect(results[88]._operands).toEqual([]);

        expect(results[89]._operator).toEqual('q');
        expect(results[89]._operands).toEqual([]);

        expect(results[90]._operator).toEqual('cm');
        expect(results[90]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-173.30']);

        expect(results[91]._operator).toEqual('Do');

        expect(results[92]._operator).toEqual('Q');
        expect(results[92]._operands).toEqual([]);

        expect(results[93]._operator).toEqual('BT');
        expect(results[93]._operands).toEqual([]);

        expect(results[94]._operator).toEqual('rg');
        expect(results[94]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[95]._operator).toEqual('Tf');

        expect(results[96]._operator).toEqual('Tm');
        expect(results[96]._operands).toEqual(['1.00', '.00', '.00', '1.00', '372.12', '-58.08']);

        expect(results[97]._operator).toEqual("'");
        expect(results[97]._operands).toEqual(['(PDF)']);

        expect(results[98]._operator).toEqual('ET');
        expect(results[98]._operands).toEqual([]);

        expect(results[99]._operator).toEqual('q');
        expect(results[99]._operands).toEqual([]);

        expect(results[100]._operator).toEqual('cm');
        expect(results[100]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-109.00']);

        expect(results[101]._operator).toEqual('Do');

        expect(results[102]._operator).toEqual('Q');
        expect(results[102]._operands).toEqual([]);

        expect(results[103]._operator).toEqual('BT');
        expect(results[103]._operands).toEqual([]);

        expect(results[104]._operator).toEqual('rg');
        expect(results[104]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[105]._operator).toEqual('Tf');

        expect(results[106]._operator).toEqual('Tm');
        expect(results[106]._operands).toEqual(['1.00', '.00', '.00', '1.00', '372.12', '-68.13']);

        expect(results[107]._operator).toEqual("'");
        expect(results[107]._operands).toEqual(['(XlsIO)']);

        expect(results[108]._operator).toEqual('ET');
        expect(results[108]._operands).toEqual([]);

        expect(results[109]._operator).toEqual('q');
        expect(results[109]._operands).toEqual([]);

        expect(results[110]._operator).toEqual('cm');
        expect(results[110]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-129.09']);

        expect(results[111]._operator).toEqual('Do');

        expect(results[112]._operator).toEqual('Q');
        expect(results[112]._operands).toEqual([]);

        expect(results[113]._operator).toEqual('BT');
        expect(results[113]._operands).toEqual([]);

        expect(results[114]._operator).toEqual('rg');
        expect(results[114]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[115]._operator).toEqual('Tf');

        expect(results[116]._operator).toEqual('Tm');
        expect(results[116]._operands).toEqual(['1.00', '.00', '.00', '1.00', '372.12', '-78.17']);

        expect(results[117]._operator).toEqual("'");
        expect(results[117]._operands).toEqual(['(DocIO)']);

        expect(results[118]._operator).toEqual('ET');
        expect(results[118]._operands).toEqual([]);

        expect(results[119]._operator).toEqual('q');
        expect(results[119]._operands).toEqual([]);

        expect(results[120]._operator).toEqual('cm');
        expect(results[120]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-149.18']);

        expect(results[121]._operator).toEqual('Do');

        expect(results[122]._operator).toEqual('Q');
        expect(results[122]._operands).toEqual([]);

        expect(results[123]._operator).toEqual('BT');
        expect(results[123]._operands).toEqual([]);

        expect(results[124]._operator).toEqual('rg');
        expect(results[124]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[125]._operator).toEqual('Tf');

        expect(results[126]._operator).toEqual('Tm');
        expect(results[126]._operands).toEqual(['1.00', '.00', '.00', '1.00', '372.12', '-88.21']);

        expect(results[127]._operator).toEqual("'");
        expect(results[127]._operands).toEqual(['(PPT)']);

        expect(results[128]._operator).toEqual('ET');
        expect(results[128]._operands).toEqual([]);

        expect(results[129]._operator).toEqual('q');
        expect(results[129]._operands).toEqual([]);

        expect(results[130]._operator).toEqual('cm');
        expect(results[130]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-169.26']);

        expect(results[131]._operator).toEqual('Do');

        expect(results[132]._operator).toEqual('Q');
        expect(results[132]._operands).toEqual([]);

        page = document.getPage(8) as PdfPage;
        contents = page._pageDictionary.getArray('Contents');
        stream = contents[2];
        parser = new _ContentParser(stream.getBytes());
        results = parser._readContent();
        expect(results[0]._operator).toEqual('q');
        expect(results[0]._operands).toEqual([]);

        expect(results[1]._operator).toEqual('cm');
        expect(results[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);

        expect(results[2]._operator).toEqual('re');
        expect(results[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);

        expect(results[3]._operator).toEqual('h');
        expect(results[3]._operands).toEqual([]);

        expect(results[4]._operator).toEqual('W');
        expect(results[4]._operands).toEqual([]);

        expect(results[5]._operator).toEqual('n');
        expect(results[5]._operands).toEqual([]);

        expect(results[6]._operator).toEqual('cm');
        expect(results[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);

        expect(results[7]._operator).toEqual('BT');
        expect(results[7]._operands).toEqual([]);

        expect(results[8]._operator).toEqual('CS');
        expect(results[8]._operands).toEqual(['/DeviceRGB']);

        expect(results[9]._operator).toEqual('cs');
        expect(results[9]._operands).toEqual(['/DeviceRGB']);

        expect(results[10]._operator).toEqual('rg');
        expect(results[10]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[11]._operator).toEqual('Tf');

        expect(results[12]._operator).toEqual('Tr');
        expect(results[12]._operands).toEqual(['0']);

        expect(results[13]._operator).toEqual('Tc');
        expect(results[13]._operands).toEqual(['0.000']);

        expect(results[14]._operator).toEqual('Tw');
        expect(results[14]._operands).toEqual(['0.000']);

        expect(results[15]._operator).toEqual('Tz');
        expect(results[15]._operands).toEqual(['100.000']);

        expect(results[16]._operator).toEqual('Tm');
        expect(results[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-57.45']);

        expect(results[17]._operator).toEqual("'");
        expect(results[17]._operands).toEqual(['(PDF)']);

        expect(results[18]._operator).toEqual('ET');
        expect(results[18]._operands).toEqual([]);

        expect(results[19]._operator).toEqual('q');
        expect(results[19]._operands).toEqual([]);

        expect(results[20]._operator).toEqual('cm');
        expect(results[20]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-108.00']);

        expect(results[21]._operator).toEqual('Do');

        expect(results[22]._operator).toEqual('Q');
        expect(results[22]._operands).toEqual([]);

        expect(results[23]._operator).toEqual('BT');
        expect(results[23]._operands).toEqual([]);

        expect(results[24]._operator).toEqual('rg');
        expect(results[24]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[25]._operator).toEqual('Tf');

        expect(results[26]._operator).toEqual('Tm');
        expect(results[26]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-66.70']);

        expect(results[27]._operator).toEqual("'");
        expect(results[27]._operands).toEqual(['(XlsIO)']);

        expect(results[28]._operator).toEqual('ET');
        expect(results[28]._operands).toEqual([]);

        expect(results[29]._operator).toEqual('q');
        expect(results[29]._operands).toEqual([]);

        expect(results[30]._operator).toEqual('cm');
        expect(results[30]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-126.50']);

        expect(results[31]._operator).toEqual('Do');

        expect(results[32]._operator).toEqual('Q');
        expect(results[32]._operands).toEqual([]);

        expect(results[33]._operator).toEqual('BT');
        expect(results[33]._operands).toEqual([]);

        expect(results[34]._operator).toEqual('rg');
        expect(results[34]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[35]._operator).toEqual('Tf');

        expect(results[36]._operator).toEqual('Tm');
        expect(results[36]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-75.94']);

        expect(results[37]._operator).toEqual("'");
        expect(results[37]._operands).toEqual(['(DocIO)']);

        expect(results[38]._operator).toEqual('ET');
        expect(results[38]._operands).toEqual([]);

        expect(results[39]._operator).toEqual('q');
        expect(results[39]._operands).toEqual([]);

        expect(results[40]._operator).toEqual('cm');
        expect(results[40]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-144.99']);

        expect(results[41]._operator).toEqual('Do');

        expect(results[42]._operator).toEqual('Q');
        expect(results[42]._operands).toEqual([]);

        expect(results[43]._operator).toEqual('BT');
        expect(results[43]._operands).toEqual([]);

        expect(results[44]._operator).toEqual('rg');
        expect(results[44]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[45]._operator).toEqual('Tf');

        expect(results[46]._operator).toEqual('Tm');
        expect(results[46]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-85.19']);

        expect(results[47]._operator).toEqual("'");
        expect(results[47]._operands).toEqual(['(PPT)']);

        expect(results[48]._operator).toEqual('ET');
        expect(results[48]._operands).toEqual([]);

        expect(results[49]._operator).toEqual('q');
        expect(results[49]._operands).toEqual([]);

        expect(results[50]._operator).toEqual('cm');
        expect(results[50]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-163.49']);

        expect(results[51]._operator).toEqual('Do');

        expect(results[52]._operator).toEqual('Q');
        expect(results[52]._operands).toEqual([]);

        expect(results[53]._operator).toEqual('BT');
        expect(results[53]._operands).toEqual([]);

        expect(results[54]._operator).toEqual('rg');
        expect(results[54]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[55]._operator).toEqual('Tf');

        expect(results[56]._operator).toEqual('Tm');
        expect(results[56]._operands).toEqual(['1.00', '.00', '.00', '1.00', '221.33', '-57.45']);

        expect(results[57]._operator).toEqual("'");
        expect(results[57]._operands).toEqual(['(PDF)']);

        expect(results[58]._operator).toEqual('ET');
        expect(results[58]._operands).toEqual([]);

        expect(results[59]._operator).toEqual('q');
        expect(results[59]._operands).toEqual([]);

        expect(results[60]._operator).toEqual('cm');
        expect(results[60]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-108.00']);

        expect(results[61]._operator).toEqual('Do');

        expect(results[62]._operator).toEqual('Q');
        expect(results[62]._operands).toEqual([]);

        expect(results[63]._operator).toEqual('BT');
        expect(results[63]._operands).toEqual([]);

        expect(results[64]._operator).toEqual('rg');
        expect(results[64]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[65]._operator).toEqual('Tf');

        expect(results[66]._operator).toEqual('Tm');
        expect(results[66]._operands).toEqual(['1.00', '.00', '.00', '1.00', '221.33', '-66.70']);

        expect(results[67]._operator).toEqual("'");
        expect(results[67]._operands).toEqual(['(XlsIO)']);

        expect(results[68]._operator).toEqual('ET');
        expect(results[68]._operands).toEqual([]);

        expect(results[69]._operator).toEqual('q');
        expect(results[69]._operands).toEqual([]);

        expect(results[70]._operator).toEqual('cm');
        expect(results[70]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-126.50']);

        expect(results[71]._operator).toEqual('Do');

        expect(results[72]._operator).toEqual('Q');
        expect(results[72]._operands).toEqual([]);

        expect(results[73]._operator).toEqual('BT');
        expect(results[73]._operands).toEqual([]);

        expect(results[74]._operator).toEqual('rg');
        expect(results[74]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[75]._operator).toEqual('Tf');

        expect(results[76]._operator).toEqual('Tm');
        expect(results[76]._operands).toEqual(['1.00', '.00', '.00', '1.00', '221.33', '-75.94']);

        expect(results[77]._operator).toEqual("'");
        expect(results[77]._operands).toEqual(['(DocIO)']);

        expect(results[78]._operator).toEqual('ET');
        expect(results[78]._operands).toEqual([]);

        expect(results[79]._operator).toEqual('q');
        expect(results[79]._operands).toEqual([]);

        expect(results[80]._operator).toEqual('cm');
        expect(results[80]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-144.99']);

        expect(results[81]._operator).toEqual('Do');

        expect(results[82]._operator).toEqual('Q');
        expect(results[82]._operands).toEqual([]);

        expect(results[83]._operator).toEqual('BT');
        expect(results[83]._operands).toEqual([]);

        expect(results[84]._operator).toEqual('rg');
        expect(results[84]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[85]._operator).toEqual('Tf');

        expect(results[86]._operator).toEqual('Tm');
        expect(results[86]._operands).toEqual(['1.00', '.00', '.00', '1.00', '221.33', '-85.19']);

        expect(results[87]._operator).toEqual("'");
        expect(results[87]._operands).toEqual(['(PPT)']);

        expect(results[88]._operator).toEqual('ET');
        expect(results[88]._operands).toEqual([]);

        expect(results[89]._operator).toEqual('q');
        expect(results[89]._operands).toEqual([]);

        expect(results[90]._operator).toEqual('cm');
        expect(results[90]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-163.49']);

        expect(results[91]._operator).toEqual('Do');

        expect(results[92]._operator).toEqual('Q');
        expect(results[92]._operands).toEqual([]);

        expect(results[93]._operator).toEqual('BT');
        expect(results[93]._operands).toEqual([]);

        expect(results[94]._operator).toEqual('rg');
        expect(results[94]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[95]._operator).toEqual('Tf');

        expect(results[96]._operator).toEqual('Tm');
        expect(results[96]._operands).toEqual(['1.00', '.00', '.00', '1.00', '371.33', '-57.45']);

        expect(results[97]._operator).toEqual("'");
        expect(results[97]._operands).toEqual(['(PDF)']);

        expect(results[98]._operator).toEqual('ET');
        expect(results[98]._operands).toEqual([]);

        expect(results[99]._operator).toEqual('q');
        expect(results[99]._operands).toEqual([]);

        expect(results[100]._operator).toEqual('cm');
        expect(results[100]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-108.00']);

        expect(results[101]._operator).toEqual('Do');

        expect(results[102]._operator).toEqual('Q');
        expect(results[102]._operands).toEqual([]);

        expect(results[103]._operator).toEqual('BT');
        expect(results[103]._operands).toEqual([]);

        expect(results[104]._operator).toEqual('rg');
        expect(results[104]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[105]._operator).toEqual('Tf');

        expect(results[106]._operator).toEqual('Tm');
        expect(results[106]._operands).toEqual(['1.00', '.00', '.00', '1.00', '371.33', '-66.70']);

        expect(results[107]._operator).toEqual("'");
        expect(results[107]._operands).toEqual(['(XlsIO)']);

        expect(results[108]._operator).toEqual('ET');
        expect(results[108]._operands).toEqual([]);

        expect(results[109]._operator).toEqual('q');
        expect(results[109]._operands).toEqual([]);

        expect(results[110]._operator).toEqual('cm');
        expect(results[110]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-126.50']);

        expect(results[111]._operator).toEqual('Do');

        expect(results[112]._operator).toEqual('Q');
        expect(results[112]._operands).toEqual([]);

        expect(results[113]._operator).toEqual('BT');
        expect(results[113]._operands).toEqual([]);

        expect(results[114]._operator).toEqual('rg');
        expect(results[114]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[115]._operator).toEqual('Tf');

        expect(results[116]._operator).toEqual('Tm');
        expect(results[116]._operands).toEqual(['1.00', '.00', '.00', '1.00', '371.33', '-75.94']);

        expect(results[117]._operator).toEqual("'");
        expect(results[117]._operands).toEqual(['(DocIO)']);

        expect(results[118]._operator).toEqual('ET');
        expect(results[118]._operands).toEqual([]);

        expect(results[119]._operator).toEqual('q');
        expect(results[119]._operands).toEqual([]);

        expect(results[120]._operator).toEqual('cm');
        expect(results[120]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-144.99']);

        expect(results[121]._operator).toEqual('Do');

        expect(results[122]._operator).toEqual('Q');
        expect(results[122]._operands).toEqual([]);

        expect(results[123]._operator).toEqual('BT');
        expect(results[123]._operands).toEqual([]);

        expect(results[124]._operator).toEqual('rg');
        expect(results[124]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[125]._operator).toEqual('Tf');

        expect(results[126]._operator).toEqual('Tm');
        expect(results[126]._operands).toEqual(['1.00', '.00', '.00', '1.00', '371.33', '-85.19']);

        expect(results[127]._operator).toEqual("'");
        expect(results[127]._operands).toEqual(['(PPT)']);

        expect(results[128]._operator).toEqual('ET');
        expect(results[128]._operands).toEqual([]);

        expect(results[129]._operator).toEqual('q');
        expect(results[129]._operands).toEqual([]);

        expect(results[130]._operator).toEqual('cm');
        expect(results[130]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-163.49']);

        expect(results[131]._operator).toEqual('Do');

        expect(results[132]._operator).toEqual('Q');
        expect(results[132]._operands).toEqual([]);

        page = document.getPage(9) as PdfPage;
        contents = page._pageDictionary.getArray('Contents');
        stream = contents[2];
        parser = new _ContentParser(stream.getBytes());
        results = parser._readContent();
        expect(results[0]._operator).toEqual('q');
        expect(results[0]._operands).toEqual([]);

        expect(results[1]._operator).toEqual('cm');
        expect(results[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);

        expect(results[2]._operator).toEqual('re');
        expect(results[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);

        expect(results[3]._operator).toEqual('h');
        expect(results[3]._operands).toEqual([]);

        expect(results[4]._operator).toEqual('W');
        expect(results[4]._operands).toEqual([]);

        expect(results[5]._operator).toEqual('n');
        expect(results[5]._operands).toEqual([]);

        expect(results[6]._operator).toEqual('cm');
        expect(results[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);

        expect(results[7]._operator).toEqual('BT');
        expect(results[7]._operands).toEqual([]);

        expect(results[8]._operator).toEqual('CS');
        expect(results[8]._operands).toEqual(['/DeviceRGB']);

        expect(results[9]._operator).toEqual('cs');
        expect(results[9]._operands).toEqual(['/DeviceRGB']);

        expect(results[10]._operator).toEqual('rg');
        expect(results[10]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[11]._operator).toEqual('Tf');

        expect(results[12]._operator).toEqual('Tr');
        expect(results[12]._operands).toEqual(['0']);

        expect(results[13]._operator).toEqual('Tc');
        expect(results[13]._operands).toEqual(['0.000']);

        expect(results[14]._operator).toEqual('Tw');
        expect(results[14]._operands).toEqual(['0.000']);

        expect(results[15]._operator).toEqual('Tz');
        expect(results[15]._operands).toEqual(['100.000']);

        expect(results[16]._operator).toEqual('Tm');
        expect(results[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-57.45']);

        expect(results[17]._operator).toEqual("'");
        expect(results[17]._operands).toEqual(['(PDF)']);

        expect(results[18]._operator).toEqual('ET');
        expect(results[18]._operands).toEqual([]);

        expect(results[19]._operator).toEqual('q');
        expect(results[19]._operands).toEqual([]);

        expect(results[20]._operator).toEqual('cm');
        expect(results[20]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-108.00']);

        expect(results[21]._operator).toEqual('Do');

        expect(results[22]._operator).toEqual('Q');
        expect(results[22]._operands).toEqual([]);

        expect(results[23]._operator).toEqual('BT');
        expect(results[23]._operands).toEqual([]);

        expect(results[24]._operator).toEqual('rg');
        expect(results[24]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[25]._operator).toEqual('Tf');

        expect(results[26]._operator).toEqual('Tm');
        expect(results[26]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-66.70']);

        expect(results[27]._operator).toEqual("'");
        expect(results[27]._operands).toEqual(['(XlsIO)']);

        expect(results[28]._operator).toEqual('ET');
        expect(results[28]._operands).toEqual([]);

        expect(results[29]._operator).toEqual('q');
        expect(results[29]._operands).toEqual([]);

        expect(results[30]._operator).toEqual('cm');
        expect(results[30]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-126.50']);

        expect(results[31]._operator).toEqual('Do');

        expect(results[32]._operator).toEqual('Q');
        expect(results[32]._operands).toEqual([]);

        expect(results[33]._operator).toEqual('BT');
        expect(results[33]._operands).toEqual([]);

        expect(results[34]._operator).toEqual('rg');
        expect(results[34]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[35]._operator).toEqual('Tf');

        expect(results[36]._operator).toEqual('Tm');
        expect(results[36]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-75.94']);

        expect(results[37]._operator).toEqual("'");
        expect(results[37]._operands).toEqual(['(DocIO)']);

        expect(results[38]._operator).toEqual('ET');
        expect(results[38]._operands).toEqual([]);

        expect(results[39]._operator).toEqual('q');
        expect(results[39]._operands).toEqual([]);

        expect(results[40]._operator).toEqual('cm');
        expect(results[40]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-144.99']);

        expect(results[41]._operator).toEqual('Do');

        expect(results[42]._operator).toEqual('Q');
        expect(results[42]._operands).toEqual([]);

        expect(results[43]._operator).toEqual('BT');
        expect(results[43]._operands).toEqual([]);

        expect(results[44]._operator).toEqual('rg');
        expect(results[44]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[45]._operator).toEqual('Tf');

        expect(results[46]._operator).toEqual('Tm');
        expect(results[46]._operands).toEqual(['1.00', '.00', '.00', '1.00', '71.33', '-85.19']);

        expect(results[47]._operator).toEqual("'");
        expect(results[47]._operands).toEqual(['(PPT)']);

        expect(results[48]._operator).toEqual('ET');
        expect(results[48]._operands).toEqual([]);

        expect(results[49]._operator).toEqual('q');
        expect(results[49]._operands).toEqual([]);

        expect(results[50]._operator).toEqual('cm');
        expect(results[50]._operands).toEqual(['1.00', '.00', '.00', '1.00', '60.00', '-163.49']);

        expect(results[51]._operator).toEqual('Do');

        expect(results[52]._operator).toEqual('Q');
        expect(results[52]._operands).toEqual([]);

        expect(results[53]._operator).toEqual('BT');
        expect(results[53]._operands).toEqual([]);

        expect(results[54]._operator).toEqual('rg');
        expect(results[54]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[55]._operator).toEqual('Tf');

        expect(results[56]._operator).toEqual('Tm');
        expect(results[56]._operands).toEqual(['1.00', '.00', '.00', '1.00', '221.33', '-57.45']);

        expect(results[57]._operator).toEqual("'");
        expect(results[57]._operands).toEqual(['(PDF)']);

        expect(results[58]._operator).toEqual('ET');
        expect(results[58]._operands).toEqual([]);

        expect(results[59]._operator).toEqual('q');
        expect(results[59]._operands).toEqual([]);

        expect(results[60]._operator).toEqual('cm');
        expect(results[60]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-108.00']);

        expect(results[61]._operator).toEqual('Do');

        expect(results[62]._operator).toEqual('Q');
        expect(results[62]._operands).toEqual([]);

        expect(results[63]._operator).toEqual('BT');
        expect(results[63]._operands).toEqual([]);

        expect(results[64]._operator).toEqual('rg');
        expect(results[64]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[65]._operator).toEqual('Tf');

        expect(results[66]._operator).toEqual('Tm');
        expect(results[66]._operands).toEqual(['1.00', '.00', '.00', '1.00', '221.33', '-66.70']);

        expect(results[67]._operator).toEqual("'");
        expect(results[67]._operands).toEqual(['(XlsIO)']);

        expect(results[68]._operator).toEqual('ET');
        expect(results[68]._operands).toEqual([]);

        expect(results[69]._operator).toEqual('q');
        expect(results[69]._operands).toEqual([]);

        expect(results[70]._operator).toEqual('cm');
        expect(results[70]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-126.50']);

        expect(results[71]._operator).toEqual('Do');

        expect(results[72]._operator).toEqual('Q');
        expect(results[72]._operands).toEqual([]);

        expect(results[73]._operator).toEqual('BT');
        expect(results[73]._operands).toEqual([]);

        expect(results[74]._operator).toEqual('rg');
        expect(results[74]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[75]._operator).toEqual('Tf');

        expect(results[76]._operator).toEqual('Tm');
        expect(results[76]._operands).toEqual(['1.00', '.00', '.00', '1.00', '221.33', '-75.94']);

        expect(results[77]._operator).toEqual("'");
        expect(results[77]._operands).toEqual(['(DocIO)']);

        expect(results[78]._operator).toEqual('ET');
        expect(results[78]._operands).toEqual([]);

        expect(results[79]._operator).toEqual('q');
        expect(results[79]._operands).toEqual([]);

        expect(results[80]._operator).toEqual('cm');
        expect(results[80]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-144.99']);

        expect(results[81]._operator).toEqual('Do');

        expect(results[82]._operator).toEqual('Q');
        expect(results[82]._operands).toEqual([]);

        expect(results[83]._operator).toEqual('BT');
        expect(results[83]._operands).toEqual([]);

        expect(results[84]._operator).toEqual('rg');
        expect(results[84]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[85]._operator).toEqual('Tf');

        expect(results[86]._operator).toEqual('Tm');
        expect(results[86]._operands).toEqual(['1.00', '.00', '.00', '1.00', '221.33', '-85.19']);

        expect(results[87]._operator).toEqual("'");
        expect(results[87]._operands).toEqual(['(PPT)']);

        expect(results[88]._operator).toEqual('ET');
        expect(results[88]._operands).toEqual([]);

        expect(results[89]._operator).toEqual('q');
        expect(results[89]._operands).toEqual([]);

        expect(results[90]._operator).toEqual('cm');
        expect(results[90]._operands).toEqual(['1.00', '.00', '.00', '1.00', '210.00', '-163.49']);

        expect(results[91]._operator).toEqual('Do');

        expect(results[92]._operator).toEqual('Q');
        expect(results[92]._operands).toEqual([]);

        expect(results[93]._operator).toEqual('BT');
        expect(results[93]._operands).toEqual([]);

        expect(results[94]._operator).toEqual('rg');
        expect(results[94]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[95]._operator).toEqual('Tf');

        expect(results[96]._operator).toEqual('Tm');
        expect(results[96]._operands).toEqual(['1.00', '.00', '.00', '1.00', '371.33', '-57.45']);

        expect(results[97]._operator).toEqual("'");
        expect(results[97]._operands).toEqual(['(PDF)']);

        expect(results[98]._operator).toEqual('ET');
        expect(results[98]._operands).toEqual([]);

        expect(results[99]._operator).toEqual('q');
        expect(results[99]._operands).toEqual([]);

        expect(results[100]._operator).toEqual('cm');
        expect(results[100]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-108.00']);

        expect(results[101]._operator).toEqual('Do');

        expect(results[102]._operator).toEqual('Q');
        expect(results[102]._operands).toEqual([]);

        expect(results[103]._operator).toEqual('BT');
        expect(results[103]._operands).toEqual([]);

        expect(results[104]._operator).toEqual('rg');
        expect(results[104]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[105]._operator).toEqual('Tf');

        expect(results[106]._operator).toEqual('Tm');
        expect(results[106]._operands).toEqual(['1.00', '.00', '.00', '1.00', '371.33', '-66.70']);

        expect(results[107]._operator).toEqual("'");
        expect(results[107]._operands).toEqual(['(XlsIO)']);

        expect(results[108]._operator).toEqual('ET');
        expect(results[108]._operands).toEqual([]);

        expect(results[109]._operator).toEqual('q');
        expect(results[109]._operands).toEqual([]);

        expect(results[110]._operator).toEqual('cm');
        expect(results[110]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-126.50']);

        expect(results[111]._operator).toEqual('Do');

        expect(results[112]._operator).toEqual('Q');
        expect(results[112]._operands).toEqual([]);

        expect(results[113]._operator).toEqual('BT');
        expect(results[113]._operands).toEqual([]);

        expect(results[114]._operator).toEqual('rg');
        expect(results[114]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[115]._operator).toEqual('Tf');

        expect(results[116]._operator).toEqual('Tm');
        expect(results[116]._operands).toEqual(['1.00', '.00', '.00', '1.00', '371.33', '-75.94']);

        expect(results[117]._operator).toEqual("'");
        expect(results[117]._operands).toEqual(['(DocIO)']);

        expect(results[118]._operator).toEqual('ET');
        expect(results[118]._operands).toEqual([]);

        expect(results[119]._operator).toEqual('q');
        expect(results[119]._operands).toEqual([]);

        expect(results[120]._operator).toEqual('cm');
        expect(results[120]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-144.99']);

        expect(results[121]._operator).toEqual('Do');

        expect(results[122]._operator).toEqual('Q');
        expect(results[122]._operands).toEqual([]);

        expect(results[123]._operator).toEqual('BT');
        expect(results[123]._operands).toEqual([]);

        expect(results[124]._operator).toEqual('rg');
        expect(results[124]._operands).toEqual(['0.000', '0.000', '0.000']);

        expect(results[125]._operator).toEqual('Tf');

        expect(results[126]._operator).toEqual('Tm');
        expect(results[126]._operands).toEqual(['1.00', '.00', '.00', '1.00', '371.33', '-85.19']);

        expect(results[127]._operator).toEqual("'");
        expect(results[127]._operands).toEqual(['(PPT)']);

        expect(results[128]._operator).toEqual('ET');
        expect(results[128]._operands).toEqual([]);

        expect(results[129]._operator).toEqual('q');
        expect(results[129]._operands).toEqual([]);

        expect(results[130]._operator).toEqual('cm');
        expect(results[130]._operands).toEqual(['1.00', '.00', '.00', '1.00', '360.00', '-163.49']);

        expect(results[131]._operator).toEqual('Do');

        expect(results[132]._operator).toEqual('Q');
        expect(results[132]._operands).toEqual([]);

        document.destroy();
    });
    it('985200 - 31', () => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage();
        const embedded4 = document.embedFont(PdfCjkFontFamily.hanyangSystemsGothicMedium, 14, PdfFontStyle.bold, true);
        let pen: any;
        page.graphics.drawString('Cjkfont with bold', embedded4, { x: 100, y: 50, width: 300, height: 24 }, pen);
        let update = document.save();
        document = new PdfDocument(update);
        expect(document.fileStructure.crossReferenceType).toEqual(PdfCrossReferenceType.table);
        page = document.getPage(0);
        let resources = page._pageDictionary.get('Resources') as _PdfDictionary;
        let font: any = resources.get('Font');
        font.forEach((key: string, value: any) => {
            let entry: any = font.get(key);
            expect(entry.get('DescendantFonts')).toBeDefined();
            let descend: _PdfDictionary[] = entry.get('DescendantFonts');
            let FontDescriptor: _PdfDictionary = descend[0];
            let descriptor: _PdfDictionary = FontDescriptor.get('FontDescriptor');
            expect(descriptor).toBeDefined();
            expect(descriptor.get('FontName').name).toEqual("HYGoThic-Medium,Bold")
        });
        expect(font.size).toEqual(1);
        document.destroy();
    });
});
describe(' - Erros check', () => {
    it('Empty item adding error', () => {
        try {
            let document = new PdfDocument();
            let setting: PdfPageSettings = new PdfPageSettings();
            setting.rotation = PdfRotationAngle.angle180;
            let page = document.addPage(setting);
            let list: PdfOrderedList = new PdfOrderedList();
            let item: any;
            list.items.add(item);
            list.draw(page, { x: 50, y: page.size.height - 100 });
            let update = document.save();
            document.destroy();
        } catch (error) { }
    });
    it('Empty item removing error', () => {
        try {
            let document = new PdfDocument();
            let setting: PdfPageSettings = new PdfPageSettings();
            setting.rotation = PdfRotationAngle.angle180;
            let page = document.addPage(setting);
            let list: PdfOrderedList = new PdfOrderedList();
            let item: any;
            list.items.remove(item);
            list.draw(page, { x: 50, y: page.size.height - 100 });
            let update = document.save();
            document.destroy();
        } catch (error) { }
    });
    it('Empty item removing with index error', () => {
        try {
            let document = new PdfDocument();
            let setting: PdfPageSettings = new PdfPageSettings();
            setting.rotation = PdfRotationAngle.angle180;
            let page = document.addPage(setting);
            let list: PdfOrderedList = new PdfOrderedList();
            let index: any;
            list.items.removeAt(index);
            list.draw(page, { x: 50, y: page.size.height - 100 });
            let update = document.save();
            document.destroy();
        } catch (error) { }
    });
    it('Empty index value error', () => {
        try {
            let document = new PdfDocument();
            let setting: PdfPageSettings = new PdfPageSettings();
            setting.rotation = PdfRotationAngle.angle180;
            let page = document.addPage(setting);
            let list: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT']));
            let index: any;
            list.items.at(index);
            list.draw(page, { x: 50, y: page.size.height - 100 });
            let update = document.save();
            document.destroy();
        } catch (error) { }
    });
    it('Empty item value error in insert', () => {
        try {
            let document = new PdfDocument();
            let setting: PdfPageSettings = new PdfPageSettings();
            setting.rotation = PdfRotationAngle.angle180;
            let page = document.addPage(setting);
            let list: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT']));
            let item;
            list.items.insert(0, item, 40);
            list.draw(page, { x: 50, y: page.size.height - 100 });
            let update = document.save();
            document.destroy();
        } catch (error) { }
    });
    it('Empty item value error in indexOf', () => {
        try {
            let document = new PdfDocument();
            let setting: PdfPageSettings = new PdfPageSettings();
            setting.rotation = PdfRotationAngle.angle180;
            let page = document.addPage(setting);
            let list: PdfList = new PdfOrderedList(new PdfListItemCollection(['PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT', 'PDF', 'XlsIO', 'DocIO', 'PPT']));
            let item: any;
            list.items.indexOf(item);
            list.draw(page, { x: 50, y: page.size.height - 100 });
            let update = document.save();
            document.destroy();
        } catch (error) { }
    });

});