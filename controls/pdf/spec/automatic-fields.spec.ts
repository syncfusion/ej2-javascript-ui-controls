import { PdfDocument } from "../src/pdf/core/pdf-document";
import { PdfCreationDateField } from "../src/pdf/core/graphics/automatic-fields/creation-date-field";
import { PdfCompositeField } from "../src/pdf/core/graphics/automatic-fields/composite-field";
import { PdfAutomaticField } from "../src/pdf/core/graphics/automatic-fields/automatic-field";
import { PdfDateTimeField } from "../src/pdf/core/graphics/automatic-fields/date-time-field";
import { PdfFontFamily, PdfStandardFont } from "../src/pdf/core/fonts/pdf-standard-font";
import { PdfPage } from "../src/pdf/core/pdf-page";
import { PdfBrush, PdfGraphics } from "../src/pdf/core/graphics/pdf-graphics";
import { PdfDestinationPageNumberField } from "../src/pdf/core/graphics/automatic-fields/destination-page-number-field";
import { PdfStringFormat } from "../src/pdf/core/fonts/pdf-string-format";
describe('Creation-date-field file mutation testing', ()=>{
    it('Constructor with properties but no dateFormat - should use default format', ()=> {
        const date: PdfCreationDateField = new PdfCreationDateField({});
        expect(date._formatString).toEqual('yyyy/MM/dd HH:mm:ss');
    });
    it('Constructor with dateFormat property - should override default format', ()=> {
        const customFormat: string = 'yyyy-MM-dd';
        const date: PdfCreationDateField = new PdfCreationDateField({ dateFormat: customFormat });
        expect(date._formatString).toEqual(customFormat);
    });
    it('dateFormatString getter should return the current format string', () => {
        const date: PdfCreationDateField = new PdfCreationDateField();
        expect(date.dateFormatString).toEqual('yyyy/MM/dd HH:mm:ss');
    });
    it('dateFormatString setter should update the format string', () => {
        const date: PdfCreationDateField = new PdfCreationDateField();
        date.dateFormatString = 'yyyy-MM-dd';
        expect(date.dateFormatString).toEqual('yyyy-MM-dd');
        expect(date._formatString).toEqual('yyyy-MM-dd');
    });
    it('should use document creation date instead of fallback ISO date', () => {
        const document: PdfDocument = new PdfDocument();
        const date: Date = new Date(2024, 0, 15, 10, 20, 30);
        document.setDocumentInformation({ creationDate: date });
        const page: any = document.addPage();
        const field: any = new PdfCreationDateField();
        const value: string = field._getValue(page.graphics);
        expect(value).toEqual('2024/01/15 10:20:30');
        document.destroy();
    });
    it('should verify doc existence check - null doc should use fallback', () => {
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const field: any = new PdfCreationDateField();
        // Simulate null document to test the if (doc) guard
        const originalGetPageFromGraphics = field._getPageFromGraphics;
        field._getPageFromGraphics = () => {
            const mockPage: any = {};
            mockPage._crossReference = { _document: null };
            return mockPage;
        };
        const value: string = field._getValue(page.graphics);
        expect(value).toMatch(/^\d{4}-\d{2}-\d{2}T/);
        document.destroy();
    });
    it('should verify info existence check - null info should use fallback', () => {
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const field: any = new PdfCreationDateField();
        // Simulate null document info to test the if (info) guard
        document.getDocumentInformation = () => null;
        const value: string = field._getValue(page.graphics);
        // Should fallback to ISO date when info is null
        expect(value).toMatch(/^\d{4}-\d{2}-\d{2}T/);
        document.destroy();
    });

    it('should verify padding is applied with zero-padded single-digit values', () => {
        const document: PdfDocument = new PdfDocument();
        // Use a date with single-digit month, day, hour, minute, second
        const date: Date = new Date(2024, 0, 1, 1, 1, 1);
        document.setDocumentInformation({ creationDate: date });
        const page: any = document.addPage();
        const field: any = new PdfCreationDateField();
        const value: string = field._getValue(page.graphics);
        // All single digits should be zero-padded
        expect(value).toEqual('2024/01/01 01:01:01');
        expect(value).not.toContain(' 1/');
        expect(value).not.toContain('/1 ');
        expect(value).not.toContain(':1');
        document.destroy();
    });

    it('should verify format string replacements are correct', () => {
        const document: PdfDocument = new PdfDocument();
        const date: Date = new Date(2024, 3, 15, 14, 30, 45);
        document.setDocumentInformation({ creationDate: date });
        const page: any = document.addPage();
        const field: any = new PdfCreationDateField({ dateFormat: 'yyyy-MM-dd HH:mm:ss' });
        const value: string = field._getValue(page.graphics);
        // Verify each component was replaced correctly
        expect(value).toEqual('2024-04-15 14:30:45');
        expect(value).toContain('2024');
        expect(value).toContain('04');
        expect(value).toContain('15');
        expect(value).toContain('14');
        expect(value).toContain('30');
        expect(value).toContain('45');
        document.destroy();
    });
    it('should format the date correctly', () => {
        const field: any = new PdfCreationDateField();
        const date = new Date(2024, 0, 5, 9, 7, 3);
        const result = field._formatDate(date, 'yyyy-MM-dd HH:mm:ss');
        expect(result).toBe('2024-01-05 09:07:03');
    });
    it('should verify all format string tokens are replaced', () => {
        const document: PdfDocument = new PdfDocument();
        const date: Date = new Date(2024, 11, 25, 23, 59, 59);
        document.setDocumentInformation({ creationDate: date });
        const page: any = document.addPage();
        const field: any = new PdfCreationDateField({ dateFormat: 'yyyy MM dd HH mm ss' });
        const value: string = field._getValue(page.graphics);
        // Verify the complete replacement without any unreplaced tokens
        expect(value).toEqual('2024 12 25 23 59 59');
        // Ensure format tokens are replaced and not present in output
        expect(value).not.toContain('yyyy');
        expect(value).not.toContain('MM');
        expect(value).not.toContain('dd');
        expect(value).not.toContain('HH');
        expect(value).not.toContain('mm');
        expect(value).not.toContain('ss');
        document.destroy();
    });

    it('should verify padding character is zero and not empty', () => {
        const document: PdfDocument = new PdfDocument();
        // Use edge case with month = 9, day = 8, hour = 7, minute = 6, second = 5
        const date: Date = new Date(2024, 8, 8, 7, 6, 5);
        document.setDocumentInformation({ creationDate: date });
        const page: any = document.addPage();
        const field: any = new PdfCreationDateField();
        const value: string = field._getValue(page.graphics);
        expect(value).toEqual('2024/09/08 07:06:05');
        // Verify zero-padding is present (not empty padding)
        expect(value[5]).toEqual('0');
        expect(value[11]).toEqual('0');
        expect(value[14]).toEqual('0');
        expect(value[17]).toEqual('0');
        document.destroy();
    });
});
describe('Composite-field file mutation testing', () => {
    it('constructor level mutation testing',  ()=> {
        const field = new PdfCompositeField({});
        expect(field._pattern).toEqual('');
        expect(field._automaticFields).toEqual([]);
    });
    it('automaticFields property level mutation testing', ()=> {
        const field = new PdfCompositeField();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        // Initialize brush.
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        const dateField: PdfAutomaticField = new PdfDateTimeField({ font: font, brush: brush });
        const fields: PdfAutomaticField[] = [dateField , dateField];
        field.automaticFields = fields;
        field.pattern = 'yyyy';
        expect(field.pattern).toEqual('yyyy');
        expect(field.automaticFields).toBe(fields);
        field._pattern = 'dd';
        expect(field._pattern).toEqual('dd');
        expect(field.pattern).toEqual('dd');
        field._automaticFields = fields;
        expect(field._automaticFields).toEqual(fields)
    });
    it('should use document creation date instead of fallback ISO date', () => {
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const field: any = new PdfCompositeField();
        const value: string = field._getValue(page.graphics);
        expect(value).toEqual('');
        document.destroy();
    });

    it('should verify loop iterates through all automatic fields - catches false condition mutation', () => {
        const document: PdfDocument = new PdfDocument();
        const date1: Date = new Date(2024, 0, 15, 10, 20, 30);
        const date2: Date = new Date(2024, 0, 16, 11, 21, 31);
        document.setDocumentInformation({ creationDate: date1 });
        const page: any = document.addPage();
        const field1: any = new PdfCreationDateField({ dateFormat: 'yyyy/MM/dd' });
        const field2: any = new PdfCreationDateField({ dateFormat: 'yyyy/MM/dd' });
        
        const composite: any = new PdfCompositeField({
            pattern: 'Date1: {0}, Date2: {1}',
            automaticFields: [field1, field2]
        });
        const value: string = composite._getValue(page.graphics);
        // Both fields must be processed, if loop condition was "false", only pattern would be returned
        expect(value).toContain('2024/01/15');
        expect(value).toContain('Date1:');
        expect(value).toContain('Date2:');
        expect(value).not.toEqual('Date1: {0}, Date2: {1}');
        expect(value).toEqual('Date1: 2024/01/15, Date2: 2024/01/15')
        document.destroy();
    });

    it('should verify correct loop bounds - catches i < length mutation to i <= length', () => {
        const document: PdfDocument = new PdfDocument();
        document.setDocumentInformation({ creationDate: new Date(2024, 0, 15) });
        const page: any = document.addPage();
        const field1: any = new PdfCreationDateField({ dateFormat: 'yyyy' });
        const field2: any = new PdfCreationDateField({ dateFormat: 'MM' });
        const field3: any = new PdfCreationDateField({ dateFormat: 'dd' });
        const composite: any = new PdfCompositeField({
            pattern: '{0}-{1}-{2}',
            automaticFields: [field1, field2, field3]
        });
        const value: string = composite._getValue(page.graphics);
        expect(value).toEqual('2024-01-15');
        // Verify no undefined is appended (which would happen with i <= length mutation)
        expect(value).not.toContain('undefined');
        expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        document.destroy();
    });

    it('should verify replacement occurs for all fields - catches wrong comparison operators', () => {
        const document: PdfDocument = new PdfDocument();
        document.setDocumentInformation({ creationDate: new Date(2024, 0, 15) });
        const page: any = document.addPage();
        const field1: any = new PdfCreationDateField({ dateFormat: 'First' });
        const field2: any = new PdfCreationDateField({ dateFormat: 'Second' });
        const field3: any = new PdfCreationDateField({ dateFormat: 'Third' });
        const field4: any = new PdfCreationDateField({ dateFormat: 'Fourth' });
        const composite: any = new PdfCompositeField({
            pattern: 'Fields: {0}, {1}, {2}, {3}',
            automaticFields: [field1, field2, field3, field4]
        });
        const value: string = composite._getValue(page.graphics);
        expect(value).toEqual('Fields: First, Second, Third, Fourth');
        expect(value).not.toContain('{0}');
        expect(value).not.toContain('{1}');
        expect(value).not.toContain('{2}');
        expect(value).not.toContain('{3}');
        document.destroy();
    });

    it('should verify pattern replacements use correct format - catches missing braces', () => {
        const document: PdfDocument = new PdfDocument();
        document.setDocumentInformation({ creationDate: new Date(2024, 0, 15) });
        const page: any = document.addPage();
        const field0: any = new PdfCreationDateField({ dateFormat: 'Value0' });
        const field1: any = new PdfCreationDateField({ dateFormat: 'Value1' });
        const field2: any = new PdfCreationDateField({ dateFormat: 'Value2' });
        const composite: any = new PdfCompositeField({
            pattern: 'A[{0}] B[{1}] C[{2}]',
            automaticFields: [field0, field1, field2]
        });
        const value: string = composite._getValue(page.graphics);
        expect(value).toEqual('A[Value0] B[Value1] C[Value2]');
        // Verify the exact format with braces
        expect(value).toContain('[Value0]');
        expect(value).toContain('[Value1]');
        expect(value).toContain('[Value2]');
        expect(value).not.toContain('0}');
        expect(value).not.toContain('{1');
        expect(value).not.toContain('2}');
        document.destroy();
    });

    it('should verify pattern with zero-padded indices', () => {
        const document: PdfDocument = new PdfDocument();
        document.setDocumentInformation({ creationDate: new Date(2024, 0, 15) });
        const page: any = document.addPage();
        const fields: PdfAutomaticField[] = [];
        for (let idx = 0; idx < 10; idx++) {
            fields.push(new PdfCreationDateField({ dateFormat: `Field${idx}` }));
        }
        let pattern = 'Pattern: ';
        for (let idx = 0; idx < 10; idx++) {
            if (idx > 0) pattern += ' | ';
            pattern += `{${idx}}`;
        }
        const composite: any = new PdfCompositeField({
            pattern: pattern,
            automaticFields: fields
        });
        const value: string = composite._getValue(page.graphics);
        for (let idx = 0; idx < 10; idx++) {
            expect(value).toContain(`Field${idx}`);
            expect(value).not.toContain(`{${idx}}`);
        }
        document.destroy();
    });

    it('should verify empty automaticFields array results in pattern only', () => {
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const composite: any = new PdfCompositeField({
            pattern: 'No fields here: {0} {1}',
            automaticFields: []
        });
        const value: string = composite._getValue(page.graphics);
        expect(value).toEqual('No fields here: {0} {1}');
        document.destroy();
    });

    it('should verify single field replacement at specific index', () => {
        const document: PdfDocument = new PdfDocument();
        document.setDocumentInformation({ creationDate: new Date(2024, 5, 15) });
        const page: any = document.addPage();
        
        const field: any = new PdfCreationDateField({ dateFormat: 'JUN' });
        const composite: any = new PdfCompositeField({
            pattern: 'Month is: {0}',
            automaticFields: [field]
        });
        
        const value: string = composite._getValue(page.graphics);
        expect(value).toEqual('Month is: JUN');
        expect(value).not.toContain('{0}');
        document.destroy();
    });
    it('should verify loop index increments correctly - catches mutation to i >= length', () => {
        const document: PdfDocument = new PdfDocument();
        document.setDocumentInformation({ creationDate: new Date(2024, 0, 15) });
        const page: any = document.addPage();
        
        const fields: PdfAutomaticField[] = [
            new PdfCreationDateField({ dateFormat: 'A' }),
            new PdfCreationDateField({ dateFormat: 'B' }),
            new PdfCreationDateField({ dateFormat: 'C' })
        ];
        
        const composite: any = new PdfCompositeField({
            pattern: '[{0}][{1}][{2}]',
            automaticFields: fields
        });
        
        const value: string = composite._getValue(page.graphics);
        expect(value).toEqual('[A][B][C]');
        const aCount = (value.match(/A/g) || []).length;
        const bCount = (value.match(/B/g) || []).length;
        const cCount = (value.match(/C/g) || []).length;
        expect(aCount).toBe(1);
        expect(bCount).toBe(1);
        expect(cCount).toBe(1);
        document.destroy();
    });
});
describe('Date-time field and Destination-page-number file mutation testing', () => {
    it('page setter should update the internal page reference', () => {
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const field: any = new PdfDestinationPageNumberField();
        field.page = page;
        expect(field.page).toBe(page);
        expect(field._page).toBe(page);
        document.destroy();
    });
    it('Constructor level mutation testing', () => {
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const field: PdfDateTimeField = new PdfDateTimeField({font: font });
        expect(field._font).toBe(font);
        expect(field._formatString).toEqual('yyyy/MM/dd');
    });
    it('_format level mutation testing', () => {
        const field: any = new PdfDateTimeField();
        const date: Date = new Date(2024, 0, 15, 10, 20, 30);
        const year = field._formatDate(date, 'yyyy');
        expect(year).toEqual('2024');
        const month = field._formatDate(date, 'MM');
        expect(month).toEqual('01');
        const date2: Date = new Date(2024, 0, 4, 10, 20, 30);
        const date1 = field._formatDate(date2, 'dd');
        expect(date1).toEqual('04');
    });
    it('page setter should update the internal page reference', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const page2 = document.addPage();
        const field = new PdfDestinationPageNumberField();
        field.page = page2;
        let value = field._getValue(page2.graphics);
        expect(value).toEqual('2');
        expect(field.page).toBe(page2);
        expect(field._page).toBe(page2);
        field._page = undefined;
        value = field._getValue(page.graphics);
        expect(value).toEqual('1');
        document.destroy();
    });
    it('should return 1 when page is not set', () => {
        const field = new PdfDestinationPageNumberField();
        field._page = undefined;
        expect(field._getValue(undefined)).toEqual('1');
        field._page = null;
        expect(field._getValue(undefined)).toEqual('1');
    });
});
describe('Automatic fields file mutation testing', () => {
    it('_initializeBase and _performDraw method mutation testing', () => {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        const stringFormat =  new PdfStringFormat();
        const field = new PdfDestinationPageNumberField();
        field._initializeBase(font, brush, stringFormat);
        expect(field._font).toEqual(font);
        expect(field._brush).toEqual(brush);
        expect(field._stringFormat).toEqual(stringFormat);
        field._initializeBase(null, null, null);
        expect(field._font).toEqual(font);
        expect(field._brush).toEqual(brush);
        expect(field._stringFormat).toEqual(stringFormat);
        field._initializeBase(undefined, undefined, undefined);
        expect(field._font).toEqual(font);
        expect(field._brush).toEqual(brush);
        expect(field._stringFormat).toEqual(stringFormat);
        // _performDraw
        field._bounds = { x: 0, y: 0, width: 0, height: 0};
        field._performDraw(page.graphics, {x: 10, y: 10});
        expect(field._size).toEqual({width: 6.672,height: 13.872});
        document.destroy();
    });
    it('_obtainSize method mutation testing', ()=> {
        const document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const field = new PdfDestinationPageNumberField();
        const size = field._obtainSize();
        expect(size.width).toBe(0);
        expect(size.height).toBe(0);
        field._bounds = {x: 0, y: 0, width: undefined, height: undefined};
        field._size = {width: 100, height: 100};
        const size2 = field._obtainSize();
        expect(size2).toEqual({width: 100 , height: 100});
        document.destroy();
    });
    it('_obtainSize should return zero values when bounds and size are not defined', () => {
        const field = new PdfDestinationPageNumberField();
        expect(field._obtainSize()).toEqual({width: 0,height: 0});
    });
    it('_obtainSize should prioritize bounds.height over size.height', () => {
        const field = new PdfDestinationPageNumberField();
        field._bounds = { x: 0, y: 0, width: undefined, height: 75 };
        field._size = { width: 100, height: 100 };
        const size = field._obtainSize();
        expect(size.height).toBe(75);
    });
    it('_obtainSize should use bounds values when available', () => {
        const field = new PdfDestinationPageNumberField();
        field._bounds = {x: 0,y: 0,width: 50,height: 75};
        field._size = {width: 100,height: 100};
        const size = field._obtainSize();
        expect(size).toEqual({width: 50,height: 75});
    });
    it('_obtainSize should fallback to size when bounds width and height are undefined', () => {
        const field = new PdfDestinationPageNumberField();
        field._bounds = {x: 0,y: 0,width: undefined,height: undefined};
        field._size = {width: 100,height: 100};
        const size = field._obtainSize();
        expect(size).toEqual({width: 100,height: 100});
    });
    it('should return zero width and height when bounds and size dimensions are undefined', () => {
        const field = new PdfDestinationPageNumberField();
        field._bounds = {x: 0,y: 0,width: undefined,height: undefined};
        field._size = { width: undefined, height: undefined};
        const size = field._obtainSize();
        expect(size).toEqual({width: 0,height: 0});
    });
    it('should draw the field value on graphics', () => {
        const document: PdfDocument = new PdfDocument();
        const page =  document.addPage();
        const field = new PdfDestinationPageNumberField();
        field._bounds = {x: 10, y: 20, width: 100, height: 100};
        spyOn(field, '_getValue').and.returnValue('Test Value');
        spyOn(field, '_obtainFont').and.returnValue({});
        spyOn(field, '_obtainBrush').and.returnValue({});
        spyOn(field, '_obtainSize').and.returnValue({ width: 100, height: 50});
        const graphics = page.graphics;
        spyOn(graphics, 'drawString');
        field._drawInternal(graphics);
        expect(graphics.drawString).toHaveBeenCalledTimes(1);
        expect(field._getValue).toHaveBeenCalled();
        expect(field._obtainFont).toHaveBeenCalled();
        expect(field._obtainBrush).toHaveBeenCalled();
        expect(field._obtainSize).toHaveBeenCalled();
        const args = (graphics.drawString as jasmine.Spy).calls.argsFor(0);
        expect(args[2]).toEqual({x: 10,y: 20,width: 100,height: 50});
    });
    it('_obtain brush method mutation testing', ()=> {
        const document: PdfDocument = new PdfDocument();
        const page =  document.addPage();
        const field = new PdfDestinationPageNumberField();
        const common: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        const brush: PdfBrush = new PdfBrush({ r: 100, g: 0, b: 0 });
        const brush1 = field._obtainBrush();
        expect(brush1).toEqual(common);
        field._brush = brush;
        expect(field._brush).toEqual(brush);
    });
    it('_obtainBrush should return assigned brush when _brush exists', () => {
        const field = new PdfDestinationPageNumberField();
        const customBrush = new PdfBrush({r: 100,g: 0,b: 0});
        field._brush = customBrush;
        const result = field._obtainBrush();
        expect(result).toBe(customBrush);
    });
    it('_obtainFont method mutation testing', ()=> {
        const document: PdfDocument = new PdfDocument();
        const page =  document.addPage();
        const field = new PdfDestinationPageNumberField();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        field._font = font;
        const font1 = field._obtainFont();
        expect(font).toEqual(font1 as PdfStandardFont);
    });
});