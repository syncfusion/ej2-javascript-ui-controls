import { PdfListMarkerAlignment, PdfLayoutType, PdfNumberStyle, PdfTextAlignment, PdfUnorderedListStyle } from '../enumerator';
import { PdfFont, PdfFontFamily, PdfStandardFont, PdfStringFormat, _PdfStringLayoutResult, _PdfStringLayouter } from '../fonts';
import { PdfBrush, PdfGraphics, PdfPen } from '../graphics/pdf-graphics';
import { PdfTemplate } from '../graphics/pdf-template';
import { PdfLayoutResult, PdfLayoutFormat, _PdfLayoutParameters, _PageLayoutResult } from '../graphics';
import { PdfPage } from '../pdf-page';
import { PdfListItem, PdfListItemCollection } from './pdf-list-item';
import { PdfDocument } from '../pdf-document';
import { _convertNumber } from './../utils';

/**
 * Represents base class for lists.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Assign the array of string items
 * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
 * // Initialize a new brush
 * let brush: PdfBrush =  new PdfBrush([0, 255, 255])
 * // Add an item to item collection by passing the string array
 * let items: PdfListItemCollection = new PdfListItemCollection(products);
 * // Create a new instance of ordered list
 * let list: PdfList = new PdfOrderedList(items);
 * // Draw the ordered list with specified items
 * list.draw(page, 0, 20, 500, 700);
 * // Get the brush associated with the ordered list
 * let listBrush: PdfBrush = list.brush;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export abstract class PdfList {
    _brush: PdfBrush;
    _pen: PdfPen;
    _font: PdfFont;
    _stringFormat: PdfStringFormat;
    _textIndent: number = 5;
    _indent: number = 10;
    _alignment: PdfListMarkerAlignment = PdfListMarkerAlignment.left;
    _delimiter: string = '.';
    _suffix: string = '.';
    _enableHierarchy: boolean = false;
    _graphics: PdfGraphics;
    _bounds: number[];
    _itemCollection: PdfListItemCollection;
    _currentIndex: number = 0;
    _size: number[] = [0, 0];
    _unicodeFont: PdfStandardFont;
    _defaultFont: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 8);
    /**
     * Gets the `PdfBrush` object associated with the list.
     *
     * @returns {PdfBrush} The `PdfBrush` object to specify fill text rendering mode.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Initialize a new brush
     * let brush: PdfBrush =  new PdfBrush([0, 255, 255]);
     * // Add an item to item collection by passing the string array
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a new instance of ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Draw the ordered list with specified items
     * list.draw(page, 0, 20, 500, 700);
     * // Get the brush associated with the ordered list
     * let listBrush: PdfBrush = list.brush;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get brush(): PdfBrush {
        return this._brush;
    }
    /**
     * Sets the `PdfBrush` object associated with the list.
     *
     * @param {PdfBrush} value The `PdfBrush` object to specify fill text rendering mode.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add an item to item collection by passing the string array
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a new Ordered list and set the brush
     * let list: PdfOrderedList = new PdfOrderedList(items, {brush: new PdfBrush([255, 0, 0])});
     * // Set fill color to the list
     * list.brush = brush;
     * // Draw the ordered list with specified items
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set brush(value: PdfBrush) {
        this._brush = value;
    }
    /**
     * Gets the `PdfPen` object associated with the list.
     *
     * @returns {PdfPen} The `PdfPen` object to specify stroke properties for text rendering.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Create an instance of item collection and add the list item
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // create a new ordered list and draw the list
     * let list: PdfOrderedList = new PdfOrderedList(items, {pen: new PdfPen([0, 255, 255], 1)});
     * list.draw(page, 0, 20, 500, 700);
     * // Retrieve the pen associated with the ordered list
     * let itemPen: PdfPen = list.pen;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get pen(): PdfPen {
        return this._pen;
    }
    /**
     * Sets the `PdfPen` object associated with the list.
     *
     * @param {PdfPen} value The `PdfPen` object to specify fill text rendering mode.
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Create an instance of item collection and add the list item
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a new pen
     * let pen: PdfPen =  new PdfPen([0, 255, 255], 1);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Set the pen for the ordered list
     * list.pen = pen;
     * // Draw the list associated with items
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set pen(value: PdfPen) {
        this._pen = value;
    }
    /**
     * Gets the font of the list item.
     *
     * @returns {PdfFont} The font used for the list items.
     * ```typescript
     * // Load the existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add an item to list item collection by passing the string array
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Draw the items on the page
     * list.draw(page, 0, 20, 500, 700);
     * /// Retrieve the font used for the list items
     * let itemPen: PdfFont = list.font;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    get font(): PdfFont {
        return this._font;
    }
    /**
     * Sets the `PdfFont` object associated with the list.
     *
     * @param {PdfFont} value The `PdfPen` object to to set for the list items.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Create an instance of item collection and add the list item
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a new font for list
     * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.timesRoman, 12);
     * // Create a new ordered list with items and font
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * list.font = font;
     * // Draw the items on the page
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set font(value: PdfFont) {
        this._font = value;
    }
    /**
     * Gets the text layout format associated with the list item.
     *
     * @returns {PdfStringFormat} The `PdfStringFormat` object that specifies the text layout information.
     * ```typescript
     * // Load the existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add an items to  listitem collection by passing the string array
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a new ordered list with items
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Draw the items on the page
     * list.draw(page, 0, 20, 500, 700);
     * // Getting the text layout format used by the list items
     * let itemFormat: PdfStringFormat = list.stringFormat;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    get stringFormat(): PdfStringFormat {
        return this._stringFormat;
    }
    /**
     * Sets the text layout format of the list item.
     *
     * @param {PdfStringFormat} value The `PdfStringFormat` object that specifies the text layout information.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Create an instance of item collection and add the list item
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a new  format with alignment settings for list
     * let itemFormat: PdfStringFormat =  new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Add an item to list item collection by passing the string array
     * let items: PdfListItemCollection = new PdfListItemCollection(items);
     * // Create a ordered list with the item collection
     * let list: PdfOrderedList = new PdfOrderedList();
     * // Set the text layout format for the list
     * list.stringFormat = itemFormat;
     * // Draw the items on the page with the updated format
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    set stringFormat(value: PdfStringFormat) {
        this._stringFormat = value;
    }
    /**
     * Gets the indent of the list.
     *
     * @returns {number} The indent value of the list.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add an item to list item collection by passing the string array
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a of ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Draw the list on the page associated with items
     * list.draw(page, 0, 20, 500, 700);
     * // Get the current indent value used by the list
     * let itemIndent: number = list.indent;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    get indent(): number {
        return this._indent;
    }
    /**
     * Sets the indent of the list.
     *
     * @param {number} value The indent value to set for the list.
     * ```typescript
     * //Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add an items to list item collection by passing the string array
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a of ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Set the indent value for the list
     * list.indent = 40;
     * // Draw the items on the page with the specified indent
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    set indent(value: number) {
        this._indent = value;
    }
    /**
     * Gets the text indent of the list.
     *
     * @returns {number} The text indent of the list.
     * ```typescript
     * // Load the existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add an items to list item collection by passing the string array
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create an new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Draw the list on the page associated with items
     * list.draw(page, 0, 20, 500, 700);
     * // Get the current text indent value of the list
     * let textIndent: number = list.textIndent;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    get textIndent(): number {
        return this._textIndent;
    }
    /**
     * Sets the text indent of the list.
     *
     * @param {number} value The text indent value to set for the list.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add an item to list item collection by passing the string array
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Set the text indent value for the list
     * list.textIndent = 40;
     * // Draw the items on the page with the updated text indent
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    set textIndent(value: number) {
        this._textIndent = value;
    }
    /**
     * Gets the delimiter string used to separate items in the list.
     *
     * @returns {string} The delimiter string used in the list.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Create an instance of PdfListItemCollection by passing the string array
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Draw the list on the page associated with items
     * list.draw(page, 0, 20, 500, 700);
     * // Get the delimiter used in the list
     * let delimiter: string = list.delimiter;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    get delimiter(): string {
        return this._delimiter;
    }
    /**
     * Sets the delimiter string used to separate items in the list.
     *
     * @param {string} value The delimiter string to be set.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add an item to list item collection by passing the string array
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Set the delimiter for the list
     * list.delimiter = ')';
     * // Draw the list on the page associated with items
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    set delimiter(value: string) {
        this._delimiter = value;
    }
    get suffix(): string {
        return this._suffix;
    }
    set suffix(value: string) {
        this._suffix = value;
    }
    /**
     * Gets a value indicating whether hierarchical structure is enabled for the list.
     *
     * @returns {boolean} `true` if hierarchical structure is enabled; otherwise, `false`.
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add an item to list item collection by passing the string array
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Draw the items associated with the items
     * list.draw(page, 0, 20, 500, 700);
     * // Get the hierarchical structure status
     * let enableHierarchy: boolean = list.enableHierarchy;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    get enableHierarchy(): boolean {
        return this._enableHierarchy;
    }
    /**
     * Sets a value indicating whether hierarchical structure is enabled for the list.
     *
     * @param {boolean} value The boolean flag to enable or disable hierarchical structure.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add an item to list item collection by passing the string array
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Set the hierarchical structure status
     * list.enableHierarchy = true;
     * / Draw the list on the page associated with items
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    set enableHierarchy(value: boolean) {
        this._enableHierarchy = value;
    }
    /**
     * Gets the text alignment of the list.
     *
     * @returns {PdfTextAlignment} The text alignment.
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add an item to list item collection by passing the string array
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Draw the list on the page associated with items
     * list.draw(page, 0, 20, 500, 700);
     * // Get the alignment of the list
     * let listAlignment: PdfTextAlignment = list.alignment;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    get alignment(): PdfListMarkerAlignment {
        return this._alignment;
    }
    /**
     * Sets the text alignment of the list.
     *
     * @param {PdfTextAlignment} value The text alignment to set for the list.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add an items to list item collection by passing the string array
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Set the alignment for the list
     * list.alignment = PdfTextAlignment.left;
     * // Draw the items on the page
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    set alignment(value: PdfListMarkerAlignment) {
        this._alignment = value;
    }
    /**
     * Gets the item collection of the list.
     *
     * @returns {PdfListItemCollection} The list item collection.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add an items to list item collection by passing the string array
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Get the item collection
     * let collection: PdfListItemCollection = list.items;
     * // Draw the list on the page associated with item collection
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    get items(): PdfListItemCollection {
        return this._itemCollection;
    }
    /**
     * Sets the item collection of the list.
     *
     * @param {PdfListItemCollection} value The list item collection.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList();
     * // Sets the item collection
     * list.items = new PdfListItemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
     * // Draw the list on the page associated with item collection
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    set items(value: PdfListItemCollection) {
        this._itemCollection = value;
    }
    get _markerRightToLeft(): boolean {
        return this._alignment === PdfListMarkerAlignment.right;
    }
    /**
     * Draws the content on the specified `PdfPage` at the given coordinates.
     *
     * @param {PdfPage} page The PDF page on which to draw the content.
     * @param {number} x The x-coordinate where the list will be drawn.
     * @param {number} y The y-coordinate where the list will be drawn.
     * @returns {PdfLayoutResult} A layout result object indicating the outcome of the drawing operation.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create a new item collection
     * let items: PdfListItemCollection = new PdfListItemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Draw the list on the page associated with item collection
     * list.draw(page, 0, 20);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    draw(page: PdfPage, x: number, y: number): PdfLayoutResult
    /**
     * Draws the `PdfList` at the specified coordinates on the `PdfGraphics` context.
     *
     * @param {PdfGraphics} graphics The graphics context on which to draw the list.
     * @param {number} x The x-coordinate where the list will be drawn.
     * @param {number} y The y-coordinate where the list will be drawn.
     * @returns Nothing.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create a new item collection
     * let items: PdfListItemCollection = new PdfListItemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Draw the list on the graphics of the page
     * list.draw(page.graphics, 0, 20);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    draw(graphics: PdfGraphics, x: number, y: number): void
    /**
     * Draws the content on the specified `PdfPage` at the given coordinates with the specified layout format.
     *
     * @param {PdfPage} page The PDF page on which to draw the content.
     * @param {number} x The x-coordinate where the list will be drawn.
     * @param {number} y The y-coordinate where the list will be drawn.
     * @param {PdfLayoutFormat} format The layout format options for drawing.
     * @returns {PdfLayoutResult} A layout result object indicating the outcome of the drawing operation.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create a new item collection
     * let items: PdfListItemCollection = new PdfListItemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Create an instance for PDF layout format
     * let layout: PdfLayoutFormat = new PdfLayoutFormat();
     * // Set the layout format
     * layout.break = PdfLayoutBreakType.fitPage;
     * layout.layout = pdfLayoutType.paginate;
     * // Draw the list on the page associated with item collection
     * list.draw(page, 0, 20, layout);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    draw(page: PdfPage, x: number, y: number, format: PdfLayoutFormat): PdfLayoutResult
    /**
     * Draws the content on the specified `PdfPage` within the specified bounds.
     *
     * @param {PdfPage} page The PDF page on which to draw the content.
     * @param {number} x The x-coordinate where the list will be drawn.
     * @param {number} y The y-coordinate where the list will be drawn.
     * @param {number} width The width of the area to draw within.
     * @param {number} height The height of the area to draw within.
     * @returns {PdfLayoutResult} A layout result object indicating the outcome of the drawing operation.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create a new item collection
     * let items: PdfListItemCollection = new PdfListItemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Draw the list on the page associated with item collection
     * list.draw(page, 0, 20, 400, 100);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    draw(page: PdfPage, x: number, y: number, width: number, height: number): PdfLayoutResult
    /**
     * Draws the content on the specified `PdfPage` at the given bounds with the specified layout format.
     *
     * @param {PdfPage} page The PDF page on which to draw the content.
     * @param {number} x The x-coordinate where the list will be drawn.
     * @param {number} y The y-coordinate where the list will be drawn.
     * @param {number} width The width of the area to draw within.
     * @param {number} height The height of the area to draw within.
     * @param {PdfLayoutFormat} format The layout format options for drawing.
     * @returns {PdfLayoutResult} A layout result object indicating the outcome of the drawing operation.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create a new item collection
     * let items: PdfListItemCollection = new PdfListItemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Create an instance for PDF layout format
     * let layout: PdfLayoutFormat = new PdfLayoutFormat();
     * // Set the layout format
     * layout.break = PdfLayoutBreakType.fitPage;
     * layout.layout = pdfLayoutType.paginate;
     * // Draw the list on the page associated with item collection
     * list.draw(page, 0, 20, 400, 100, format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    draw(page: PdfPage, x: number, y: number, width: number, height: number, format: PdfLayoutFormat): PdfLayoutResult
    draw(arg1: PdfPage | PdfGraphics,
         arg2: number,
         arg3: number,
         arg4 ?: number | PdfLayoutFormat,
         arg5 ?: number,
         arg6 ?: PdfLayoutFormat): PdfLayoutResult | void {
        if (arg1 instanceof PdfPage) {
            if (arg1._isNew) {
                return this._drawInternal(arg1, arg2, arg3, arg4, arg5, arg6);
            } else {
                (new _PdfListLayouter(this)).layout(arg1.graphics, [arg2, arg3, 0, 0]);
            }
        } else {
            (new _PdfListLayouter(this)).layout(arg1, [arg2, arg3, 0, 0]);
        }
    }
    _drawInternal(arg1: PdfPage,
                  arg2: number,
                  arg3: number,
                  arg4 ?: number | PdfLayoutFormat,
                  arg5 ?: number,
                  arg6 ?: PdfLayoutFormat): PdfLayoutResult {
        const parameter: _PdfLayoutParameters = new _PdfLayoutParameters();
        parameter._page = arg1;
        if (arg4 === null || typeof arg4 === 'undefined') {
            parameter._bounds = [arg2, arg3, 0, 0];
            parameter._format = new PdfLayoutFormat();
        } else if (typeof arg4 === 'number') {
            parameter._bounds = [arg2, arg3, arg4, arg5];
            if (arg6) {
                parameter._format = arg6;
            } else {
                parameter._format = new PdfLayoutFormat();
            }
        } else if (arg4 instanceof PdfLayoutFormat) {
            parameter._bounds = [arg2, arg3, 0, 0];
            parameter._format = arg4;
        }
        return this._layout(parameter);
    }
    _layout(parameter: _PdfLayoutParameters): PdfLayoutResult {
        return (new _PdfListLayouter(this)).layoutInternal(parameter);
    }
}
/**
 * Represents an ordered list in a PDF document.
 * ```typescript
 * // Load an existing document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Define an array of strings representing items to be added
 * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
 * // Add the items to list item collection by passing the array of products
 * let items: PdfListItemCollection = new PdfListItemCollection(products);
 * // Create an instance of ordered list
 * let list: PdfOrderedList = new PdfOrderedList(items);
 * // Draw the ordered list on the page
 * list.draw(page, 0, 20, layout);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ````
 */
export class PdfOrderedList extends PdfList {
    _style: PdfNumberStyle;
    _startNumber: number = 1;
    /**
     * Initialize a new `PdfOrderedlist` instance with item collection.
     *
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Define an array of strings representing items to be added
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Initialize the instance of ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Set the item collection
     * list.items = items;
     * // Draw the ordered list on the page
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor()
    /**
     * Initialize a new `PdfOrderedlist` instance with item collection.
     *
     * @param {PdfListItemCollection} items The collection of items to be
     * included in the ordered list.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Define an array of strings representing items to be added
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Initialize the instance of ordered list and pass the item collection
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Draw the ordered list on the page
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(items: PdfListItemCollection)
    /**
     * Creates a new `PdfOrderedList` instance with the specified array of string
     * items and optional settings for font, format, pen, brush, intent, style, and
     * delimiter.
     *
     * @param {PdfListItemCollection} items An array of strings representing the
     * items in the ordered list.
     * @param {object} settings Optional settings for the list item.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Create a new font for list
     * let itemFont: PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
     * // Create a new brush for list
     * let itemBrush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new format for list
     * let itemFormat: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.center);
     * // Create a new pen for list
     * let itemPen: PdfPen = new PdfPen([0, 255, 0], 1);
     * // Initialize a PdfNumberStyle for items
     * let itemStyle: PdfNumberStyle = PdfNumberStyle.numeric.
     * // Initialize a delimiter for the items
     * let itemDelimiter: string = ')';
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Initialize the instance of ordered list and pass the item collection
     * and optional settings
     * let list: PdfOrderedList = new PdfOrderedList(items, {
     *     font: itemFont,
     *     format: itemFormat,
     *     pen: itemPen,
     *     brush: itemBrush,
     *     indent: 30,
     *     textIndent: 50,
     *     style: itemStyle,
     *     delimiter: itemDelimiter
     * });
     * // Draw the ordered list on the page
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(items: PdfListItemCollection,
        settings: {font?: PdfFont,
            format?: PdfStringFormat,
            pen?: PdfPen,
            brush?: PdfBrush,
            indent?: number,
            textIndent?: number,
            style?: PdfNumberStyle,
            delimiter?: string,
            suffix?: string,
            alignment?: PdfListMarkerAlignment})
    constructor(items?: PdfListItemCollection,
                settings?: {font?: PdfFont,
                    format?: PdfStringFormat,
                    pen?: PdfPen,
                    brush?: PdfBrush,
                    indent?: number,
                    textIndent?: number,
                    style?: PdfNumberStyle,
                    delimiter?: string,
                    suffix?: string,
                    alignment?: PdfListMarkerAlignment}) {
        super();
        if (items) {
            this._itemCollection = items;
        } else {
            this._itemCollection = new PdfListItemCollection();
        }
        if (settings) {
            if (settings.font) {
                this._font = settings.font;
            }
            if (settings.format) {
                this._stringFormat = settings.format;
            }
            if (settings.pen) {
                this._pen = settings.pen;
            }
            if (settings.brush) {
                this._brush = settings.brush;
            }
            if (settings.style) {
                this._style = settings.style;
            } else {
                this._style = PdfNumberStyle.numeric;
            }
            if (settings.indent) {
                this._indent = settings.indent;
            }
            if (settings.textIndent) {
                this._textIndent = settings.textIndent;
            }
            if (settings.alignment) {
                this._alignment = settings.alignment;
            }
            if (settings.delimiter) {
                this._delimiter = settings.delimiter;
            }
            if (settings.suffix) {
                this._suffix = settings.suffix;
            }
        } else {
            this._style = PdfNumberStyle.numeric;
        }
    }
    /**
     * Gets the numbering style used for the ordered list.
     *
     * @returns {PdfNumberStyle} The numbering style used for the ordered list.
     *  ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Initialize the instance of ordered list and pass the item collection
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Get the numbering style used for the ordered list
     * let style: PdfNumberStyle = list.style;
     * // Draw the ordered list on the page
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get style(): PdfNumberStyle {
        return this._style;
    }
    /**
     * Sets the numbering style used for the ordered list.
     *
     * @param {PdfNumberStyle} value The numbering style used for the ordered list.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     *  // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Initialize the instance of ordered list and pass the item collection
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Define a style for the list
     * let style: PdfNumberStyle = PdfNumberStyle.lowerLatin;
     * // Set the numbering style for the list items
     * list.style = style;
     * // Draw the ordered list on the page
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set style(value: PdfNumberStyle) {
        this._style = value;
    }
    /**
     * Gets the starting number used for the ordered list.
     *
     * @returns {number} The starting number of the ordered list.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Initialize the instance of ordered list and pass the item collection
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Get the starting number used for the ordered list
     * let startnumber: number = list.startNumber;
     * // Draw the ordered list on the page
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get startNumber(): number {
        return this._startNumber;
    }
    /**
     * Sets the starting number to be used for the ordered list.
     *
     * @param {number} value The starting number to set.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Assign the array of string items
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Initialize the instance of ordered list and pass the item collection
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Set the starting number for the ordered list
     * list.startNumber = 5;
     * // Draw the ordered list on the page
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set startNumber(value: number) {
        if (value <= 0) {
            throw new Error('Start number should be greater than 0.');
        }
        this._startNumber = value;
    }
    _getNumber(): string {
        return _convertNumber(this._startNumber + this._currentIndex, this._style);
    }
}
/**
 * Represents the Unordered lists.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Define the items in the unordered list
 * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
 * // Create an instance of PdfListItemCollection by passing the string array
 * let items: PdfListItemCollection = new PdfListItemCollection(products);
 * // Create an instance of PdfUnorderedList
 * let list: PdfUnorderedList = new PdfUnorderedList();
 * // Draw the unordered list on the page
 * list.draw(page, 0, 20, layout);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ````
 */
export class PdfUnorderedList extends PdfList {
    _style: PdfUnorderedListStyle;
    constructor()
    /** Initialize a new `PdfUnorderedList` instance with item collection.
     *
     * @param {PdfListItemCollection} items that are added in the item collection.
     * ```typescript
     * // Load the existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Define the items in the unordered list
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create a unordered list
     * let list: PdfUnorderedList = new PdfUnorderedList(items);
     * // Draw the unordered list on the page
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(items: PdfListItemCollection)
    /**
     * Initialize a new `PdfUnorderedList` instance with the specified array of string items and optional settings
     * for font, format, pen, brush, intent, style, and delimiter.
     *
     * @param {PdfListItemCollection} items An array of strings representing the items in the Unordered list.
     * @param {object} settings Optional settings for the list item.
     * ```typescript
     * // Load the existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Define the items in the unordered list
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Create a new font for list
     * let itemFont: PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
     * // Create a new brush for list
     * let itemBrush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new format for list
     * let itemFormat: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.center);
     * // Create a new pen for list
     * let itemPen: PdfPen = new PdfPen([0, 255, 0],1);
     * // Initialise a PdfUnorderedListStyle
     * let itemStyle: PdfNumberStyle = PdfUnorderedListStyle.square.
     * // Initialize a delimiter for the items
     * let itemDelimiter: string = ')';
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Initialize the instance of the unordered list and pass the list item collection and settings
     * let list: PdfUnorderedList = new PdfUnorderedList(items, {
     *     font: itemFont,
     *     format: itemFormat,
     *     pen: itemPen,
     *     brush: itemBrush,
     *     indent: 30,
     *     textIndent: 50,
     *     style: itemStyle,
     *     delimiter: itemDelimiter
     * });
     * // Draw the unordered list on the page
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(items?: PdfListItemCollection,
        settings?: {font?: PdfFont,
            format?: PdfStringFormat,
            pen?: PdfPen,
            brush?: PdfBrush,
            indent?: number,
            textIndent?: number,
            style?: PdfUnorderedListStyle,
            delimiter?: string,
            suffix?: string,
            alignment?: PdfListMarkerAlignment})
    constructor(items?: PdfListItemCollection,
                settings?: {font?: PdfFont,
                    format?: PdfStringFormat,
                    pen?: PdfPen,
                    brush?: PdfBrush,
                    indent?: number,
                    textIndent?: number,
                    style?: PdfUnorderedListStyle,
                    delimiter?: string,
                    suffix?: string,
                    alignment?: PdfListMarkerAlignment}) {
        super();
        if (items) {
            this._itemCollection = items;
        } else {
            this._itemCollection = new PdfListItemCollection();
        }
        if (settings) {
            if (settings.font) {
                this._font = settings.font;
            }
            if (settings.format) {
                this._stringFormat = settings.format;
            }
            if (settings.pen) {
                this._pen = settings.pen;
            }
            if (settings.brush) {
                this._brush = settings.brush;
            }
            if (settings.style) {
                this._style = settings.style;
            } else {
                this._style = PdfUnorderedListStyle.disk;
            }
            if (settings.indent) {
                this._indent = settings.indent;
            }
            if (settings.textIndent) {
                this._textIndent = settings.textIndent;
            }
            if (settings.alignment) {
                this._alignment = settings.alignment;
            }
            if (settings.delimiter) {
                this._delimiter = settings.delimiter;
            }
            if (settings.suffix) {
                this._suffix = settings.suffix;
            }
        } else {
            this._style = PdfUnorderedListStyle.disk;
        }
    }
    /**
     * Gets the style used for the unordered list.
     *
     * @returns {PdfUnorderedListStyle} The style used for the unordered list.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Define the items in the unordered list
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Initialize an instance of the unordered list and pass the list item collection
     * let list: PdfUnorderedList = new PdfUnorderedList(items);
     * // Get the style used for the unordered list
     * let style: PdfUnorderedListStyle = list.style;
     * // Draw the unordered list on the page
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get style(): PdfUnorderedListStyle {
        return this._style;
    }
    /**
     * Sets the style used for the unordered list.
     *
     * @param {PdfUnorderedListStyle} value The style to set for the unordered list.
     * ```typescript
     * // Load the existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Define the items in the unordered list
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Initialize an instance of the unordered list and pass the list item collection
     * let list: PdfUnorderedList = new PdfUnorderedList(items);
     * // Initialize a style for the unordered list
     * let style: PdfUnorderedListStyle = PdfUnorderedListStyle.circle;
     * // Set the style for the unordered list items
     * list.style = style;
     * // Draw the unordered list on the page
     * list.draw(page, 0, 20, 500, 700);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set style(value: PdfUnorderedListStyle) {
        this._style = value;
    }
    _getStyledText(): string {
        switch (this._style) {
        case PdfUnorderedListStyle.disk:
            return '\x6C';
        case PdfUnorderedListStyle.square:
            return '\x6E';
        case PdfUnorderedListStyle.asterisk:
            return '\x5D';
        case PdfUnorderedListStyle.circle:
            return '\x6D';
        default:
            return '';
        }
    }
    _draw(graphics: PdfGraphics, x: number, y: number, brush: PdfBrush, pen: PdfPen): void {
        const template: PdfTemplate = new PdfTemplate([0, 0, this._size[0], this._size[1]], graphics._crossReference);
        const bounds: number[] = [0, 0, 0, 0];
        if (pen) {
            bounds[0] = bounds[0] + pen._width;
            bounds[1] = bounds[1] + pen._width;
        }
        template.graphics.drawString(this._getStyledText(), this._unicodeFont, bounds, pen, brush);
        graphics.drawTemplate(template, {x: x, y: y, width: template.size[0], height: template.size[1]});
    }
}
export class _PdfListInfo {
    _index: number;
    _list: PdfList;
    _number: string;
    _brush: PdfBrush;
    _pen: PdfPen;
    _font: PdfFont;
    _format: PdfStringFormat;
    _markerWidth: number;
    constructor(list: PdfList, index?: number, number?: string) {
        this._list = list;
        this._index = index;
        this._number = number;
    }
}
export class _PdfListLayouter {
    _element: PdfList;
    _graphics: PdfGraphics;
    _currentFormat: PdfStringFormat;
    _currentPage: PdfPage;
    _bounds: number[];
    _curList: PdfList;
    _indent: number = 0;
    _currentBrush: PdfBrush;
    _currentPen: PdfPen;
    _currentFont: PdfFont;
    _information: _PdfListInfo[] = [];
    _markerMaxWidth: number = 0;
    _finish: boolean = false;
    _usePaginateBounds: boolean = true;
    _resultHeight: number = 0;
    _size: number[] = [0, 0];
    _index: number = 0;
    constructor(element: PdfList) {
        this._element = element;
    }
    layout(graphics: PdfGraphics, bounds: number[]): void {
        this._graphics = graphics;
        const parameter: _PdfLayoutParameters = new _PdfLayoutParameters();
        parameter._bounds = bounds;
        parameter._format = new PdfLayoutFormat();
        parameter._format.layout = PdfLayoutType.onePage;
        this.layoutInternal(parameter);
    }
    layoutInternal(parameter: _PdfLayoutParameters): PdfLayoutResult {
        this._currentPage = parameter._page;
        this._bounds = parameter._bounds.slice();
        if (this._currentPage) {
            if (parameter._bounds[2] === 0 && parameter._bounds[3] === 0) {
                const pageSize: number[] = this._currentPage.graphics.clientSize;
                this._bounds[2] = pageSize[0] - this._bounds[0];
                this._bounds[3] = pageSize[1] - this._bounds[1];
            }
            this._graphics = this._currentPage.graphics;
        }
        let pageResult: _PageLayoutResult = new _PageLayoutResult();
        pageResult.broken = false;
        pageResult.y = this._bounds[1];
        this._curList = this._element;
        this._indent = this._curList.indent;
        this._setCurrentParameters(this._curList);
        if (!this._curList.brush) {
            this._currentBrush = new PdfBrush([0, 0, 0]);
        }
        if (!this._curList.font) {
            this._currentFont = this._curList._defaultFont;
        }
        if (this._curList instanceof PdfOrderedList) {
            this._markerMaxWidth = this._getMarkerMaxWidth(this._curList as PdfOrderedList, this._information);
        }
        const useOnPage: boolean = parameter._format.layout === PdfLayoutType.onePage;
        while (!this._finish) {
            pageResult.y = this._bounds[1];
            pageResult = this._layoutOnPage(pageResult);
            if (useOnPage) {
                break;
            }
            if (this._currentPage && !this._finish) {
                this._currentPage = this._getNextPage(this._currentPage);
            }
            this._graphics = this._currentPage.graphics;
            if (parameter._bounds[2] === 0 && parameter._bounds[3] === 0) {
                const pageSize: number[] = this._currentPage.graphics.clientSize;
                this._bounds[2] = pageSize[0] - this._bounds[0];
                this._bounds[3] = pageSize[1] - this._bounds[1];
            }
            if (parameter._format && parameter._format.usePaginateBounds && this._usePaginateBounds) {
                this._bounds = parameter._format._paginateBounds;
            }
        }
        this._information = [];
        const finalBounds: number[] = [this._bounds[0], pageResult.y, this._bounds[2], this._resultHeight];
        const result: PdfLayoutResult = new PdfLayoutResult(this._currentPage, finalBounds);
        if (this._currentFormat) {
            this._currentFormat._isList = false;
        }
        return result;
    }
    private _layoutOnPage(pageResult: _PageLayoutResult): _PageLayoutResult {
        let height: number = 0;
        let resultantHeight: number = 0;
        let y: number = this._bounds[1];
        const x: number = this._bounds[0];
        this._size = [this._bounds[2] - this._indent, this._bounds[3]];
        while (true) { // eslint-disable-line
            for (; this._index < this._curList.items.count; ++this._index) {
                const item: PdfListItem = this._curList.items.at(this._index);
                const result: {pageResult: _PageLayoutResult, height: number, y: number} = this._drawItem(pageResult,
                                                                                                          x,
                                                                                                          this._curList,
                                                                                                          this._index,
                                                                                                          this._indent,
                                                                                                          this._information,
                                                                                                          item,
                                                                                                          height,
                                                                                                          y);
                pageResult = result.pageResult;
                height = result.height;
                y = result.y;
                resultantHeight += height;
                if (pageResult.broken) {
                    return pageResult;
                }
                pageResult.markerWrote = false;
                if (item.subList && item.subList.items.count > 0) {
                    if (this._curList instanceof PdfOrderedList) {
                        const oList: PdfOrderedList = this._curList;
                        oList._currentIndex = this._index;
                        const info: _PdfListInfo = new _PdfListInfo(this._curList, this._index, oList._getNumber());
                        info._brush = this._currentBrush;
                        info._font = this._currentFont;
                        info._format = this._currentFormat;
                        info._pen = this._currentPen;
                        info._markerWidth = this._markerMaxWidth;
                        this._information.push(info);
                    } else {
                        const info: _PdfListInfo = new _PdfListInfo(this._curList, this._index);
                        info._brush = this._currentBrush;
                        info._font = this._currentFont;
                        info._format = this._currentFormat;
                        info._pen = this._currentPen;
                        this._information.push(info);
                    }
                    this._curList = item.subList;
                    if (this._curList instanceof PdfOrderedList) {
                        this._markerMaxWidth = this._getMarkerMaxWidth(this._curList as PdfOrderedList, this._information);
                    }
                    this._index = -1;
                    this._indent += this._curList.indent;
                    this._size[0] = this._size[0] - this._curList.indent;
                    this._setCurrentParameters(item);
                    this._setCurrentParameters(this._curList);
                }
            }
            if (this._information.length === 0) {
                this._resultHeight = resultantHeight;
                this._finish = true;
                break;
            }
            const listInfo: _PdfListInfo = this._information.pop();
            this._index = listInfo._index + 1;
            this._indent -= this._curList.indent;
            this._size[0] = this._size[0] + this._curList.indent;
            this._markerMaxWidth = listInfo._markerWidth;
            this._currentBrush = listInfo._brush;
            this._currentPen = listInfo._pen;
            this._currentFont = listInfo._font;
            this._currentFormat = listInfo._format;
            this._curList = listInfo._list;
        }
        return pageResult;
    }
    private _drawItem(pageResult: _PageLayoutResult,
                      x: number,
                      curList: PdfList,
                      index: number,
                      indent: number,
                      info: _PdfListInfo[],
                      item: PdfListItem,
                      height: number,
                      y: number): {pageResult: _PageLayoutResult, height: number, y: number} {
        const layouter: _PdfStringLayouter = new _PdfStringLayouter();
        let result: _PdfStringLayoutResult;
        const textIndent: number = curList.textIndent;
        const posY: number = height + y;
        let posX: number = indent + x;
        let itemHeight: number = 0;
        let itemSize: number[] = this._size;
        let text: string = item.text;
        let markerText: string;
        let itemBrush: PdfBrush = this._currentBrush;
        let markerHeight: number = 0;
        if (item.brush) {
            itemBrush = item.brush;
        }
        let itemPen: PdfPen = this._currentPen;
        if (item.pen) {
            itemPen = item.pen;
        }
        let itemFont: PdfFont = this._currentFont;
        if (item.font) {
            itemFont = item.font;
        }
        let itemFormat: PdfStringFormat = this._currentFormat;
        if (item.stringFormat) {
            itemFormat = item.stringFormat;
        }
        if ((this._size[0] <= 0 || this._size[0] < itemFont.size) && this._currentPage) {
            throw new Error('There is not enough space to layout list.');
        }
        this._size[1] = this._size[1] - height;
        if (pageResult.broken) {
            text = pageResult.itemText;
            markerText = pageResult.markerText;
        }
        let canDrawMarker: boolean = true;
        const markerResult: _PdfStringLayoutResult = this._createMarkerResult(index, curList, info, item);
        if (markerResult) {
            if (curList instanceof PdfOrderedList) {
                posX += this._markerMaxWidth;
                pageResult.markerWidth = this._markerMaxWidth;
            } else {
                posX += markerResult._actualSize[0];
                pageResult.markerWidth = markerResult._actualSize[0];
            }
            markerHeight = markerResult._actualSize[1];
            if (this._currentPage) {
                canDrawMarker = (markerHeight < this._size[1]);
            }
            if (markerResult._empty) {
                canDrawMarker = false;
            }
        } else {
            posX += curList._size[0];
            pageResult.markerWidth = curList._size[0];
            markerHeight = curList._size[1];
            if (this._currentPage) {
                canDrawMarker = (markerHeight < this._size[1]);
            }
        }
        if (!markerText || markerText === '') {
            canDrawMarker = true;
        }
        if (text && canDrawMarker) {
            itemSize = this._size;
            itemSize[0] = itemSize[0] - pageResult.markerWidth;
            if (item.textIndent === 0) {
                itemSize[0] = itemSize[0] - textIndent;
            } else {
                itemSize[0] = itemSize[0] - item.textIndent;
            }
            if ((itemSize[0] <= 0 || itemSize[0] < itemFont.size) && this._currentPage) {
                throw new Error('Not enough space to layout the text. The marker is too long or there is not enough space to draw it.');
            }
            let itemX: number = posX;
            if (!curList._markerRightToLeft) {
                if (item.textIndent === 0) {
                    itemX += textIndent;
                } else {
                    itemX += item.textIndent;
                }
            } else {
                itemX -= pageResult.markerWidth;
                if (itemFormat && (itemFormat.alignment === PdfTextAlignment.right || itemFormat.alignment === PdfTextAlignment.center)) {
                    itemX -= indent;
                }
            }
            if (!this._currentPage && itemFormat) {
                itemFormat = Object.assign({}, itemFormat);
                itemFormat.alignment = PdfTextAlignment.left;
            }
            result = layouter._layout(text, itemFont, itemFormat, itemSize);
            const rect: number[] = [itemX, posY, itemSize[0], itemSize[1]];
            this._graphics._drawStringLayoutResult(result, itemFont, itemPen, itemBrush, rect, itemFormat);
            y = posY;
            itemHeight = result._actualSize[1];
        }
        height = (itemHeight < markerHeight) ? markerHeight : itemHeight;
        if ((result && result._remainder && result._remainder !== '') ||
            (markerResult && markerResult._remainder && markerResult._remainder !== '') ||
            !canDrawMarker) {
            y = 0;
            height = 0;
            if (result) {
                pageResult.itemText = result._remainder;
                if (result._remainder === item.text) {
                    canDrawMarker = false;
                }
            } else {
                if (canDrawMarker) {
                    pageResult.itemText = undefined;
                } else {
                    pageResult.itemText = item.text;
                }
            }
            if (markerResult) {
                pageResult.markerText = markerResult._remainder;
            } else {
                pageResult.markerText = undefined;
            }
            pageResult.broken = true;
            pageResult.y = 0;
            this._bounds[1] = 0;
        } else {
            pageResult.broken = false;
        }
        if (result) {
            pageResult.markerX = posX;
            if (itemFormat) {
                switch (itemFormat.alignment) {
                case PdfTextAlignment.right:
                    pageResult.markerX = posX + itemSize[0] - result._actualSize[0];
                    break;

                case PdfTextAlignment.center:
                    pageResult.markerX = posX + (itemSize[0] / 2) - (result._actualSize[0] / 2);
                    break;
                }
            }
            if (curList._markerRightToLeft) {
                pageResult.markerX += result._actualSize[0];
                if (item.textIndent === 0) {
                    pageResult.markerX += textIndent;
                } else {
                    pageResult.markerX += item.textIndent;
                }
                if (itemFormat && (itemFormat.alignment === PdfTextAlignment.right || itemFormat.alignment === PdfTextAlignment.center)) {
                    pageResult.markerX -= indent;
                }
            }
        }
        if (canDrawMarker && !pageResult.markerWrote) {
            pageResult.markerWrote = this._drawMarker(curList, item, markerResult, posY, pageResult.markerX);
            if (curList instanceof PdfOrderedList) {
                pageResult.markerWidth = markerResult._actualSize[0];
            } else {
                pageResult.markerWidth = curList._size[0];
            }
        }
        return {pageResult: pageResult, height: height, y: y};
    }
    private _createMarkerResult(index: number, curList: PdfList, info: _PdfListInfo[], item: PdfListItem): _PdfStringLayoutResult {
        if (curList instanceof PdfOrderedList) {
            return this._createOrderedMarkerResult(curList, item, index, info, false);
        } else {
            return this._createUnorderedMarkerResult(curList as PdfUnorderedList, item);
        }
    }
    private _drawMarker(curList: PdfList, item: PdfListItem, markerResult: _PdfStringLayoutResult, posY: number, posX: number): boolean {
        if (curList instanceof PdfOrderedList) {
            if (curList.font && markerResult) {
                if (curList.font.size > markerResult._actualSize[1]) {
                    posY += (curList.font.size / 2) - (markerResult._actualSize[1] / 2);
                    markerResult._actualSize[1] = markerResult._actualSize[1] + posY;
                }
                this._drawOrderedMarker(curList, markerResult, item, posX, posY);
            }
        } else {
            if (curList.font && markerResult) {
                if (curList.font.size > markerResult._actualSize[1]) {
                    posY += (curList.font.size / 2) - (markerResult._actualSize[1] / 2);
                    markerResult._actualSize[1] = markerResult._actualSize[1] + posY;
                }
            }
            this._drawUnorderedMarker(curList as PdfUnorderedList, markerResult, item, posX, posY);
        }
        return true;
    }
    private _drawUnorderedMarker(curList: PdfUnorderedList,
                                 markerResult: _PdfStringLayoutResult,
                                 item: PdfListItem,
                                 posX: number,
                                 posY: number): void {
        const markerFont: PdfFont = this._getMarkerFont(curList, item);
        const markerPen: PdfPen = this._getMarkerPen(curList, item);
        const markerBrush: PdfBrush = this._getMarkerBrush(curList, item);
        if (markerResult) {
            curList._size = markerResult._actualSize;
            curList._unicodeFont = new PdfStandardFont(PdfFontFamily.zapfDingbats, markerFont.size);
            curList._draw(this._graphics, posX - markerResult._actualSize[0], posY, markerBrush, markerPen);
        } else {
            curList._size = [markerFont.size, markerFont.size];
            curList._draw(this._graphics, posX - markerFont.size, posY, markerBrush, markerPen);
        }
    }
    private _drawOrderedMarker(curList: PdfOrderedList,
                               markerResult: _PdfStringLayoutResult,
                               item: PdfListItem,
                               posX: number,
                               posY: number): void {
        const markerFont: PdfFont = this._getMarkerFont(curList, item);
        const markerPen: PdfPen = this._getMarkerPen(curList, item);
        const markerBrush: PdfBrush = this._getMarkerBrush(curList, item);
        const rect: number[] = [posX - this._markerMaxWidth, posY, this._markerMaxWidth, markerResult._actualSize[1]];
        const markerFormat: PdfStringFormat = this._setMarkerStringFormat(curList, this._getMarkerFormat(curList, item));
        this._graphics._drawStringLayoutResult(markerResult, markerFont, markerPen, markerBrush, rect, markerFormat);
    }
    private _setCurrentParameters(element: PdfList | PdfListItem): void {
        if (element.brush) {
            this._currentBrush = element.brush;
        }
        if (element.pen) {
            this._currentPen = element.pen;
        }
        if (element.font) {
            this._currentFont = element.font;
        }
        if (element.stringFormat) {
            this._currentFormat = element.stringFormat;
            if (element instanceof PdfList) {
                this._currentFormat._isList = true;
            }
        }
    }
    private _getMarkerMaxWidth(list: PdfOrderedList, infromation: _PdfListInfo[]): number {
        let width: number = -1;
        for (let i: number = 0; i < list.items.count; i++) {
            const result: _PdfStringLayoutResult = this._createOrderedMarkerResult(list,
                                                                                   list.items.at(i),
                                                                                   i + list.startNumber,
                                                                                   infromation,
                                                                                   true);
            if (width < result._actualSize[0]) {
                width = result._actualSize[0];
            }
        }
        return width;
    }
    private _createUnorderedMarkerResult(list: PdfUnorderedList, item: PdfListItem): _PdfStringLayoutResult {
        const markerFont: PdfFont = this._getMarkerFont(list, item);
        const layouter: _PdfStringLayouter = new _PdfStringLayouter();
        const uFont: PdfStandardFont = new PdfStandardFont(PdfFontFamily.zapfDingbats, markerFont.size);
        const result: _PdfStringLayoutResult = layouter._layout(list._getStyledText(), uFont, null, this._size);
        list._size = result._actualSize;
        if (list.pen) {
            result._size = [result._actualSize[0] + 2 * list.pen._width, result._actualSize[1] + 2 * list.pen._width];
        }
        return result;
    }
    private _createOrderedMarkerResult(list: PdfOrderedList,
                                       item: PdfListItem,
                                       index: number,
                                       infromation: _PdfListInfo[],
                                       findMaxWidth: boolean): _PdfStringLayoutResult {
        list._currentIndex = index;
        let text: string = '';
        if (list.style !== PdfNumberStyle.none) {
            text = list._getNumber() + list.suffix;
        }
        if (list.enableHierarchy) {
            const collection: _PdfListInfo[] = infromation.slice();
            for (let i: number = 0; i < collection.length; i++) {
                const listInfo: _PdfListInfo = collection[Number.parseInt(i.toString(), 10)];
                const orderedList: PdfList = listInfo._list;
                if (!(orderedList && orderedList instanceof PdfOrderedList && orderedList.style !== PdfNumberStyle.none)) {
                    break;
                }
                text = listInfo._number + orderedList.delimiter + text;
                if (!orderedList.enableHierarchy) {
                    break;
                }
            }
        }
        const layouter: _PdfStringLayouter = new _PdfStringLayouter();
        const font: PdfFont = this._getMarkerFont(list, item);
        let format: PdfStringFormat = this._getMarkerFormat(list, item);
        const markerSize: number[] = [0, 0];
        if (!findMaxWidth) {
            markerSize[0] = this._markerMaxWidth;
            format = this._setMarkerStringFormat(list, format);
        }
        return layouter._layout(text, font, format, markerSize);
    }
    private _setMarkerStringFormat(list: PdfList, format: PdfStringFormat): PdfStringFormat {
        if (format) {
            format = Object.assign({}, format);
        } else {
            format = new PdfStringFormat();
        }
        if (!list.stringFormat) {
            format.alignment = PdfTextAlignment.right;
            if (list._markerRightToLeft) {
                format.alignment = PdfTextAlignment.left;
            }
        }
        if (!this._currentPage && format) {
            format = Object.assign({}, format);
            format.alignment = PdfTextAlignment.left;
        }
        return format;
    }
    private _getMarkerFont(list: PdfList, item: PdfListItem): PdfFont {
        let markerFont: PdfFont = list.font;
        if (!markerFont) {
            markerFont = item.font;
            if (!markerFont) {
                markerFont = this._currentFont;
            }
        }
        list.font = markerFont;
        return markerFont;
    }
    private _getMarkerFormat(list: PdfList, item: PdfListItem): PdfStringFormat {
        let markerFormat: PdfStringFormat = list.stringFormat;
        if (!markerFormat) {
            markerFormat = item.stringFormat;
            if (!markerFormat) {
                markerFormat = this._currentFormat;
            }
        }
        return markerFormat;
    }
    private _getMarkerPen(list: PdfList, item: PdfListItem): PdfPen {
        let markerPen: PdfPen = list.pen;
        if (!markerPen) {
            markerPen = item.pen;
            if (!markerPen) {
                markerPen = this._currentPen;
            }
        }
        return markerPen;
    }
    private _getMarkerBrush(list: PdfList, item: PdfListItem): PdfBrush {
        let markerBrush: PdfBrush = list.brush;
        if (!markerBrush) {
            markerBrush = item.brush;
            if (!markerBrush) {
                markerBrush = this._currentBrush;
            }
        }
        return markerBrush;
    }
    private _getNextPage(page: PdfPage): PdfPage {
        const document: PdfDocument = page._crossReference._document;
        if (page._pageIndex < document.pageCount - 1) {
            return document.getPage(page._pageIndex + 1);
        } else {
            return document.addPage();
        }
    }
}
