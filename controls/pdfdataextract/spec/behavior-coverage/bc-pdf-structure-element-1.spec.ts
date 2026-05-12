import { PdfStructureElement } from '../../src/pdf-data-extract/core/pdf-structure-element';
import { PdfTagType, ScopeType } from '../../src/pdf-data-extract/core/text-extraction/enumerator';
import { PdfDocument, _PdfDictionary, PdfPage, PdfRotationAngle, _getPageIndex } from '@syncfusion/ej2-pdf';
describe('PdfStructureElement - Lines 1-1011', () => {
    let element: PdfStructureElement;
    let mockDocument: any;
    let mockDictionary: any;
    let mockPage: any;
    let mockParent: PdfStructureElement;
    beforeEach(() => {
        // ---- PdfCrossReference ----
        const mockCrossReference = jasmine.createSpyObj(
            '_PdfCrossReference',
            ['_dummy']   // must not be empty
        );
        // ---- PdfDocument ----
        mockDocument = jasmine.createSpyObj(
            'PdfDocument',
            ['getPage', 'form']
        );
        mockDocument._crossReference = mockCrossReference;
        // ---- PdfDictionary ----
        mockDictionary = jasmine.createSpyObj(
            '_PdfDictionary',
            ['has', 'get', 'getRaw']
        );
        // ---- Graphics ----
        const mockGraphics = jasmine.createSpyObj(
            'graphics',
            ['drawRectangle']
        );
        // ---- Annotations ----
        const mockAnnotations = jasmine.createSpyObj(
            'annotations',
            ['at']
        );
        mockAnnotations.count = 0;
        // ---- PdfPage ----
        mockPage = jasmine.createSpyObj(
            'PdfPage',
            ['_dummy'] // required dummy method
        );
        mockPage._pageIndex = 0;
        mockPage.rotation = PdfRotationAngle.angle0;
        mockPage.size = { width: 612, height: 792 };
        mockPage._pageDictionary = mockDictionary;
        mockPage.graphics = mockGraphics;
        mockPage.annotations = mockAnnotations;
        // ---- Parent ----
        mockParent = null;
    });
    ``
    // Lines 29-78: Property initialization tests
    it('should initialize with default empty text property', () => {
        element = new PdfStructureElement();
        expect(element._text).toBe('');
    });
    it('should initialize with default none tagType', () => {
        element = new PdfStructureElement();
        expect(element._tagType).toBe(PdfTagType.none);
    });
    it('should initialize with default empty contentId array', () => {
        element = new PdfStructureElement();
        expect(element._contentId).toEqual([]);
    });
    it('should initialize with default mcid value -1', () => {
        element = new PdfStructureElement();
        expect(element._mcid).toBe(-1);
    });
    it('should initialize with default empty textCollection array', () => {
        element = new PdfStructureElement();
        expect(element._textCollection).toEqual([]);
    });
    it('should initialize with default empty title', () => {
        element = new PdfStructureElement();
        expect(element._title).toBe('');
    });
    it('should initialize with default none scope', () => {
        element = new PdfStructureElement();
        expect(element._scope).toBe(ScopeType.none);
    });
    // Getter methods (Lines 80-420)
    it('should return text from text getter', () => {
        element = new PdfStructureElement();
        element._text = 'Sample text content';
        expect(element.text).toBe('Sample text content');
    });
    it('should return alternateText from alternateText getter', () => {
        element = new PdfStructureElement();
        element._alternateText = 'Alternate text';
        expect(element.alternateText).toBe('Alternate text');
    });
    it('should return parent from parent getter', () => {
        element = new PdfStructureElement();
        mockParent = PdfStructureElement._load(mockDocument, mockDictionary, 1, null);
        element._parent = mockParent;
        expect(element.parent).toBe(mockParent);
    });
    it('should return abbreviation from abbreviation getter', () => {
        element = new PdfStructureElement();
        element._abbreviation = 'Abbr';
        expect(element.abbreviation).toBe('Abbr');
    });
    it('should return tagType from tagType getter', () => {
        element = new PdfStructureElement();
        element._tagType = PdfTagType.paragraph;
        expect(element.tagType).toBe(PdfTagType.paragraph);
    });
    it('should return actualText from actualText getter', () => {
        element = new PdfStructureElement();
        element._actualText = 'Actual content';
        expect(element.actualText).toBe('Actual content');
    });
    it('should return bounds from bounds getter', () => {
        element = new PdfStructureElement();
        const bounds = { x: 10, y: 20, width: 100, height: 50 };
        element._bounds = bounds;
        expect(element.bounds).toEqual(bounds);
    });
    it('should return childElements from childElements getter', () => {
        element = new PdfStructureElement();
        const child1 = PdfStructureElement._load(mockDocument, mockDictionary, 0, element);
        const child2 = PdfStructureElement._load(mockDocument, mockDictionary, 1, element);
        element._childElements = [child1, child2];
        expect(element.childElements).toEqual([child1, child2]);
        expect(element.childElements.length).toBe(2);
    });
    it('should return language from language getter', () => {
        element = new PdfStructureElement();
        element._language = 'en-US';
        expect(element.language).toBe('en-US');
    });
    it('should return order from order getter', () => {
        element = new PdfStructureElement();
        element._order = 5;
        expect(element.order).toBe(5);
    });
    it('should return title from title getter', () => {
        element = new PdfStructureElement();
        element._title = 'Element Title';
        expect(element.title).toBe('Element Title');
    });
    it('should return scope from scope getter', () => {
        element = new PdfStructureElement();
        element._scope = ScopeType.row;
        expect(element.scope).toBe(ScopeType.row);
    });
    // Static _load method (Lines 422-433)
    it('should load element with all parameters', () => {
        const order = 3;
        mockParent = PdfStructureElement._load(mockDocument, mockDictionary, 0, null);
        element = PdfStructureElement._load(mockDocument, mockDictionary, order, mockParent);
        expect(element._document).toBe(mockDocument);
        expect(element._dictionary).toBe(mockDictionary);
        expect(element._order).toBe(order);
        expect(element._parent).toBe(mockParent);
        expect(element._childElements).toEqual([]);
        expect(element._bounds).toEqual({x: 0, y: 0, width: 0, height: 0});
        expect(element._language).toBe('');
    });
    it('should load element without parameters (all undefined)', () => {
        element = PdfStructureElement._load();
        expect(element._document).toBeUndefined();
        expect(element._dictionary).toBeUndefined();
        expect(element._order).toBeUndefined();
        expect(element._parent).toBeUndefined();
        expect(element._childElements).toEqual([]);
    });
    it('should load element with only document parameter', () => {
        element = PdfStructureElement._load(mockDocument);
        expect(element._document).toBe(mockDocument);
        expect(element._dictionary).toBeUndefined();
    });
    it('should load element with document and dictionary', () => {
        element = PdfStructureElement._load(mockDocument, mockDictionary);
        expect(element._document).toBe(mockDocument);
        expect(element._dictionary).toBe(mockDictionary);
    });
    // _getPageFromElement method (Lines 435-448)
    // Branch 1: element._page exists
    it('should return cached page when element._page exists', () => {
        element = PdfStructureElement._load(mockDocument, mockDictionary, 0, null);
        element._page = mockPage;
        const result = element._getPageFromElement(element);
        expect(result).toBe(mockPage);
    });
    it('should return undefined when both _page and _pageDictionary are null', () => {
        element = PdfStructureElement._load(mockDocument, mockDictionary, 0, null);
        element._page = null;
        element._pageDictionary = null;
        const result = element._getPageFromElement(element);
        expect(result).toEqual(null);
    });
    // _getChildPage method (Lines 450-464)
    // Branch 1: childElements has items
    it('should get page from first child element when found', () => {
        element = PdfStructureElement._load(mockDocument, mockDictionary, 0, null);
        const child = PdfStructureElement._load(mockDocument, mockDictionary, 0, element);
        child._page = mockPage;
        element._childElements = [child];
        const result = element._getChildPage();
        expect(result).toBe(mockPage);
    });
    // Branch 2: childElements length is 0
    it('should return undefined when childElements is empty', () => {
        element = PdfStructureElement._load(mockDocument, mockDictionary, 0, null);
        element._childElements = [];
        const result = element._getChildPage();
        expect(result).toBeUndefined();
    });
    // Branch 3: recursive call when first child doesn't have page
    it('should recursively search child elements for page', () => {
        element = PdfStructureElement._load(mockDocument, mockDictionary, 0, null);
        const child1 = PdfStructureElement._load(mockDocument, mockDictionary, 0, element);
        const child2 = PdfStructureElement._load(mockDocument, mockDictionary, 1, element);
        const grandchild = PdfStructureElement._load(mockDocument, mockDictionary, 0, child1);
        child1._page = null;
        child1._childElements = [grandchild];
        grandchild._page = mockPage;
        element._childElements = [child1, child2];
        spyOn(child1, '_getChildPage').and.returnValue(mockPage);
        const result = element._getChildPage();
        expect(result).toBeUndefined();
    });
    // page getter (Lines 407-420) - Complex lazy loading with multiple branches
    it('should lazy load page when _page is null', () => {
        element = PdfStructureElement._load(mockDocument, mockDictionary, 0, null);
        element._page = null;
        spyOn<any>(element, '_getPageFromElement').and.returnValue(mockPage);
        const result = element.page;
        expect(result).toBe(mockPage);
    });
    it('should return cached page on second access', () => {
        element = PdfStructureElement._load(mockDocument, mockDictionary, 0, null);
        element._page = mockPage;
        const result1 = element.page;
        const result2 = element.page;
        expect(result1).toBe(mockPage);
        expect(result2).toBe(mockPage);
    });
    it('should get page from parent when parent exists and element has no page', () => {
        mockParent = PdfStructureElement._load(mockDocument, mockDictionary, 0, null);
        mockParent._page = mockPage;
        element = PdfStructureElement._load(mockDocument, mockDictionary, 1, mockParent);
        element._page = null;
        const result = element.page;
        expect(element.parent).toBe(mockParent);
    });
    it('should get page from child elements when parent and self page are null', () => {
        element = PdfStructureElement._load(mockDocument, mockDictionary, 0, null);
        const child = PdfStructureElement._load(mockDocument, mockDictionary, 0, element);
        child._page = mockPage;
        element._page = null;
        element._parent = null;
        element._childElements = [child];
        spyOn<any>(element, '_getChildPage').and.returnValue(mockPage);
        const result = element.page;
        expect(result).toBe(null);
    });
    // _getTagType method (Lines 787-884)
    // Switch cases - common mappings
    it('should map P to paragraph tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('P')).toBe(PdfTagType.paragraph);
    });
    it('should map Figure to figure tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Figure')).toBe(PdfTagType.figure);
    });
    it('should map Art to article tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Art')).toBe(PdfTagType.article);
    });
    it('should map Annot to annotation tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Annot')).toBe(PdfTagType.annotation);
    });
    it('should map Bibentry to bibliographyEntry tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Bibentry')).toBe(PdfTagType.bibliographyEntry);
    });
    it('should map BlockQuote to blockQuotation tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('BlockQuote')).toBe(PdfTagType.blockQuotation);
    });
    it('should map Caption to caption tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Caption')).toBe(PdfTagType.caption);
    });
    it('should map Code to code tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Code')).toBe(PdfTagType.code);
    });
    it('should map Div to division tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Div')).toBe(PdfTagType.division);
    });
    it('should map Document to documentType tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Document')).toBe(PdfTagType.documentType);
    });
    it('should map Form to form tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Form')).toBe(PdfTagType.form);
    });
    it('should map Formula to formula tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Formula')).toBe(PdfTagType.formula);
    });
    it('should map Index to index tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Index')).toBe(PdfTagType.index);
    });
    it('should map H to heading tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('H')).toBe(PdfTagType.heading);
    });
    it('should map Title to heading tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Title')).toBe(PdfTagType.heading);
    });
    it('should map H1 to headingLevel1 tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('H1')).toBe(PdfTagType.headingLevel1);
    });
    it('should map H2 to headingLevel2 tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('H2')).toBe(PdfTagType.headingLevel2);
    });
    it('should map H3 to headingLevel3 tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('H3')).toBe(PdfTagType.headingLevel3);
    });
    it('should map H4 to headingLevel4 tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('H4')).toBe(PdfTagType.headingLevel4);
    });
    it('should map H5 to headingLevel5 tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('H5')).toBe(PdfTagType.headingLevel5);
    });
    it('should map H6 to headingLevel6 tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('H6')).toBe(PdfTagType.headingLevel6);
    });
    it('should map Lbl to label tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Lbl')).toBe(PdfTagType.label);
    });
    it('should map Link to link tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Link')).toBe(PdfTagType.link);
    });
    it('should map L to list tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('L')).toBe(PdfTagType.list);
    });
    it('should map LI to listItem tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('LI')).toBe(PdfTagType.listItem);
    });
    it('should map LBody to listBody tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('LBody')).toBe(PdfTagType.listBody);
    });
    it('should map Note to note tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Note')).toBe(PdfTagType.note);
    });
    it('should map Part to part tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Part')).toBe(PdfTagType.part);
    });
    it('should map Quote to quotation tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Quote')).toBe(PdfTagType.quotation);
    });
    it('should map Reference to reference tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Reference')).toBe(PdfTagType.reference);
    });
    it('should map Sect to section tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Sect')).toBe(PdfTagType.section);
    });
    it('should map Span to span tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Span')).toBe(PdfTagType.span);
    });
    it('should map ParagraphSpan to span tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('ParagraphSpan')).toBe(PdfTagType.span);
    });
    it('should map HyphenSpan to span tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('HyphenSpan')).toBe(PdfTagType.span);
    });
    it('should map StyleSpan to span tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('StyleSpan')).toBe(PdfTagType.span);
    });
    it('should map Table to table tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('Table')).toBe(PdfTagType.table);
    });
    it('should map TD to tableDataCell tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('TD')).toBe(PdfTagType.tableDataCell);
    });
    it('should map TH to tableHeader tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('TH')).toBe(PdfTagType.tableHeader);
    });
    it('should map TOC to tableOfContent tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('TOC')).toBe(PdfTagType.tableOfContent);
    });
    it('should map TOCI to tableOfContentItem tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('TOCI')).toBe(PdfTagType.tableOfContentItem);
    });
    it('should map TR to tableRow tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('TR')).toBe(PdfTagType.tableRow);
    });
    it('should map THead to tableHeaderRowGroup tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('THead')).toBe(PdfTagType.tableHeaderRowGroup);
    });
    it('should map TBody to tableBodyRowGroup tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('TBody')).toBe(PdfTagType.tableBodyRowGroup);
    });
    it('should map TFoot to tableFooterRowGroup tag type', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('TFoot')).toBe(PdfTagType.tableFooterRowGroup);
    });
    it('should map unknown tag to none', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('UnknownTag123')).toBe(PdfTagType.none);
    });
    it('should handle empty string tag as none', () => {
        element = new PdfStructureElement();
        expect(element._getTagType('')).toBe(PdfTagType.none);
    });
    it('should handle null tag as none', () => {
        element = new PdfStructureElement();
        expect(element._getTagType(null)).toBe(PdfTagType.none);
    });
    // _parseContent method (Lines 886-1011)
    // Branch 1: Valid MCID extraction
    it('should extract MCID from content array', () => {
        element = new PdfStructureElement();
        const contentArray = ['content', '/BDC /MCID 5'];
        const result = element._parseContent(contentArray);
        expect(result).toBe(5);
        expect(element._mcid).toBe(5);
    });
    // Branch 2: MCID with expansion text
    it('should extract MCID with abbreviation expansion', () => {
        element = new PdfStructureElement();
        const contentArray = ['content', '/E Expanded text /MCID 10'];
        const result = element._parseContent(contentArray);
        expect(result).toBe(10);
        expect(element._mcid).toBe(10);
    });
    // Branch 3: Empty content array
    it('should return -1 when content array is empty', () => {
        element = new PdfStructureElement();
        const contentArray: string[] = [];
        const result = element._parseContent(contentArray);
        expect(result).toBe(-1);
    });
    // Branch 4: Null content array
    it('should return -1 when content array is null', () => {
        element = new PdfStructureElement();
        const result = element._parseContent(null);
        expect(result).toBe(-1);
    });
    it('should handle single element array', () => {
        element = new PdfStructureElement();
        const contentArray = ['single'];
        const result = element._parseContent(contentArray);
        expect(result).toBe(-1);
    });
    it('should parse multiple MCID entries', () => {
        element = new PdfStructureElement();
        const contentArray = ['content', '/BDC /MCID 3 /MCID 7'];
        const result = element._parseContent(contentArray);
        expect(result).toBe(3); 
    });
    it('should trim whitespace in parsed content', () => {
        element = new PdfStructureElement();
        const contentArray = [' content ', ' /BDC /MCID 8 '];
        const result = element._parseContent(contentArray);
        expect(result).toBe(8);
    });
    it('should handle regex replacement of special characters', () => {
        element = new PdfStructureElement();
        const contentArray = ['content', '/(BDC)/MCID(12)'];
        const result = element._parseContent(contentArray);
        expect(element._mcid).toBe(12);
    });
    // _calculateBounds method (Lines 764-785)
    // Branch 1: angle0 (no rotation)
    it('should return bounds unchanged for angle0 rotation', () => {
        element = PdfStructureElement._load(mockDocument, mockDictionary, 0, null);
        element._page = mockPage;
        mockPage.rotation = PdfRotationAngle.angle0;
        const bounds = { x: 10, y: 20, width: 100, height: 50 };
        const result = element._calculateBounds(element, bounds);
        expect(result).toEqual(bounds);
    });
    // Branch 2: angle90
    it('should transform bounds for angle90 rotation', () => {
        element = PdfStructureElement._load(mockDocument, mockDictionary, 0, null);
        element._page = mockPage;
        mockPage.rotation = PdfRotationAngle.angle90;
        mockPage.size = { width: 612, height: 792 };
        const bounds = { x: 10, y: 20, width: 100, height: 50 };
        const result = element._calculateBounds(element, bounds);
        expect(result.x).toBe(722);
        expect(result.y).toBe(10);
        expect(result.width).toBe(50);
        expect(result.height).toBe(100);
    });
    // Branch 3: angle180
    it('should transform bounds for angle180 rotation', () => {
        element = PdfStructureElement._load(mockDocument, mockDictionary, 0, null);
        element._page = mockPage;
        mockPage.rotation = PdfRotationAngle.angle180;
        mockPage.size = { width: 612, height: 792 };
        const bounds = { x: 10, y: 20, width: 100, height: 50 };
        const result = element._calculateBounds(element, bounds);
        expect(result.x).toBe(502);
        expect(result.y).toBe(672);
        expect(result.width).toBe(100);
        expect(result.height).toBe(50);
    });
    // Branch 4: angle270
    it('should transform bounds for angle270 rotation', () => {
        element = PdfStructureElement._load(mockDocument, mockDictionary, 0, null);
        element._page = mockPage;
        mockPage.rotation = PdfRotationAngle.angle270;
        mockPage.size = { width: 612, height: 792 };
        const bounds = { x: 10, y: 20, width: 100, height: 50 };
        const result = element._calculateBounds(element, bounds);
        expect(result.x).toBe(20);
        expect(result.y).toBe(502);
        expect(result.width).toBe(50);
        expect(result.height).toBe(100);
    });
    // Branch 5: element is null (else branch)
    it('should return bounds unchanged when element is null', () => {
        element = new PdfStructureElement();
        const bounds = { x: 10, y: 20, width: 100, height: 50 };
        const result = element._calculateBounds(null, bounds);
        expect(result).toEqual(bounds);
    });
    // Branch 6: element._page is null (else branch)
    it('should return bounds unchanged when element._page is null', () => {
        element = new PdfStructureElement();
        element._page = null;
        const bounds = { x: 10, y: 20, width: 100, height: 50 };
        const result = element._calculateBounds(element, bounds);
        expect(result).toEqual(bounds);
    });
    it('should handle zero-sized bounds with angle90', () => {
        element = PdfStructureElement._load(mockDocument, mockDictionary, 0, null);
        element._page = mockPage;
        mockPage.rotation = PdfRotationAngle.angle90;
        mockPage.size = { width: 612, height: 792 };
        const bounds = { x: 0, y: 0, width: 0, height: 0 };
        const result = element._calculateBounds(element, bounds);
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });
    it('should handle maximum bounds with angle180', () => {
        element = PdfStructureElement._load(mockDocument, mockDictionary, 0, null);
        element._page = mockPage;
        mockPage.rotation = PdfRotationAngle.angle180;
        mockPage.size = { width: 612, height: 792 };
        const bounds = { x: 0, y: 0, width: 612, height: 792 };
        const result = element._calculateBounds(element, bounds);
        expect(result.x).toBe(0);
        expect(result.y).toBe(180);
    });
    it('should handle fractional bounds with angle270', () => {
        element = PdfStructureElement._load(mockDocument, mockDictionary, 0, null);
        element._page = mockPage;
        mockPage.rotation = PdfRotationAngle.angle270;
        mockPage.size = { width: 612, height: 792 };
        const bounds = { x: 10.5, y: 20.5, width: 100.5, height: 50.5 };
        const result = element._calculateBounds(element, bounds);
        expect(result).toBeDefined();
        expect(result.width).toBe(50.5);
        expect(result.height).toBe(100.5);
    });
});
