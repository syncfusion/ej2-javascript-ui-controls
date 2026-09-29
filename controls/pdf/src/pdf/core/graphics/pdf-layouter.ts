import { PdfLayoutType, PdfLayoutBreakType } from '../enumerator';
import { PdfPage } from '../pdf-page';
import { PdfGraphics } from './pdf-graphics';
import { Rectangle } from './../pdf-type';
/**
 * Represent the layout format class for pagination
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Create an instance of list item collection by passing the string array
 * let items: PdfListItemCollection = new PdfListItemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
 * // Create a new PDF ordered list
 * let list: PdfOrderedList = new PdfOrderedList(items);
 * // Create an instance for PDF layout format
 * let layout: PdfLayoutFormat = new PdfLayoutFormat();
 * // Set the layout format
 * layout.break = PdfLayoutBreakType.fitPage;
 * layout.layout = pdfLayoutType.paginate;
 * // Draw the items using specified bounds and layout format
 * list.draw(page, {x: 0, y: 20}, layout);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfLayoutFormat {
    /**
     * Indicates whether a custom paginate bounds rectangle has been explicitly set.
     *
     * @private
     */
    _boundSet: boolean = false;
    /**
     * Rectangle that defines the custom bounds used when paginating content.
     *
     * @private
     */
    _paginateBounds: Rectangle;
    /**
     * Determines how content is laid out (e.g., paginate, one-page).
     *
     * @private
     */
    _layout: PdfLayoutType;
    /**
     * Specifies how content should break when exceeding page bounds.
     *
     * @private
     */
    _break: PdfLayoutBreakType;
    /**
     * Number of columns to use when paginating content. Default is 1 (single column).
     *
     * @private
     */
    _columns: number;
    /**
     * Gutter (gap) between columns in user units. Default is 0.
     *
     * @private
     */
    _columnGutter: number;
    /**
     * Initializes a new instance of the `PdfLayoutFormat` class.
     *
     * @param {PdfLayoutFormat}  format Format for pagination.
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page of document
     * let page: PdfPage = document.getPage(0);
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
     * // Create an instance of ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Create an instance for layout format for drawing
     * let layout: PdfLayoutFormat = new PdfLayoutFormat();
     * // Set the layout format
     * layout.break = PdfLayoutBreakType.fitPage;
     * layout.layout = pdfLayoutType.paginate;
     * // Draw the items using specified bounds and layout format
     * list.draw(page, {x: 0, y: 20}, layout);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor(format?: PdfLayoutFormat) {
        if (format) {
            this.break = format.break;
            this.layout = format.layout;
            this.paginateBounds = format.paginateBounds;
            this._boundSet = format._boundSet;
        } else {
            this.layout = PdfLayoutType.paginate;
            this.break = PdfLayoutBreakType.fitPage;
        }
    }
    /**
     * Gets the layout type of the page.
     *
     * @returns {PdfLayoutType} The layout type of the page.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
     * // Create a ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Create a layout format for drawing
     * let pageLayout: PdfLayoutFormat = new PdfLayoutFormat();
     * // Draw the items on the page with specified bounds and layout format
     * list.draw(page, {x: 0, y: 20, width: 500, height: 700}, pageLayout);
     * // Retrieve the layout type applied to the page layout format
     * let layoutType: PdfLayoutType = pageLayout.layout;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get layout(): PdfLayoutType {
        return this._layout;
    }
    /**
     * Sets the layout type of the page.
     *
     * @param {PdfLayoutType} value the  layout type of the page.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Initialize an array of string items
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Create a layout format for drawing
     * let pageLayout: PdfLayoutFormat = new PdfLayoutFormat();
     * // Set the layout type to paginate for the page layout format
     * pageLayout.layout = PdfLayoutType.paginate;
     * // Draw the items on the page with specified bounds and layout format
     * list.draw(page, {x: 0, y: 20, width: 500, height: 700}, pageLayout);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set layout(value: PdfLayoutType) {
        this._layout = value;
    }
    /**
     * Gets the layout break type of the page.
     *
     * @returns {PdfLayoutBreakType} The layout break type of the page.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Define an array of products
     * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(products);
     * // Create an instance of ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Create an layout format for drawing
     * let pageLayout: PdfLayoutFormat = new PdfLayoutFormat();
     * // Draw the items on the page
     * list.draw(page, {x: 0, y: 20, width: 500, height: 700}, pageLayout);
     * // Get the layout break type of the list
     * let layoutType: PdfLayoutBreakType = pageLayout.break;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get break(): PdfLayoutBreakType {
        return this._break;
    }
    /**
     * Sets the layout break type for the page.
     *
     * @param {PdfLayoutBreakType} value The layout break type to set for the page.
     * ```typescript
     * //Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
     * // Create a ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Create an layout format for drawing
     * let pageLayout: PdfLayoutFormat = new PdfLayoutFormat();
     * // Set the layout break type for the page
     * pageLayout.break = PdfLayoutBreakType.fitPage;
     * // Draw the items on the page
     * list.draw(page, {x: 0, y: 20, width: 500, height: 700}, pageLayout);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set break(value: PdfLayoutBreakType) {
        this._break = value;
    }
    /**
     * Gets the paginate bounds of the page.
     *
     * @returns {Rectangle} The paginate bounds.
     * ```typescript
     * // Load the existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
     * // Create an ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Create an layout format for drawing
     * let pageLayout: PdfLayoutFormat = new PdfLayoutFormat();
     * // Draw the items on the page
     * list.draw(page, {x: 0, y: 20, width: 500, height: 700}, pageLayout);
     * // Get the paginate bounds
     * let layoutType: Rectangle = pageLayout.paginateBounds;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get paginateBounds(): Rectangle {
        return this._paginateBounds;
    }
    /**
     * Sets the paginate bounds for the page.
     *
     * @param {Rectangle} value The paginate bounds to set for the page.
     * ```typescript
     * // Load the existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
     * // Create a ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Create an layout format for page layout settings
     * let pageLayout: PdfLayoutFormat = new PdfLayoutFormat();
     * // Set the paginate bounds for the page
     * pageLayout.paginateBounds = {x: 0, y: 0, width: 500, height: 700};
     * // Draw the items on the page
     * list.draw(page, {x: 0, y: 20, width: 500, height: 700}, pageLayout);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set paginateBounds(value: Rectangle) {
        this._paginateBounds = value;
        this._boundSet = true;
    }
    /**
     * Gets whether to use paginate bounds for pagination.
     *
     * @returns {boolean} Whether pagination bounds are used.
     * ```typescript
     * // Load the existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
     * // Create an instance of ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Create an layout format for drawing
     * let pageLayout: PdfLayoutFormat = new PdfLayoutFormat();
     * // Draw the items on the page
     * list.draw(page, {x: 0, y: 20, width: 500, height: 700}, pageLayout);
     * // Get whether paginate bounds are used
     * let usePaginate:  boolean = pageLayout.usePaginateBounds;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get usePaginateBounds(): boolean {
        return this._boundSet;
    }
    /**
     * Gets the number of columns used for pagination.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Create a layout format with multi-column support
     * let layout: PdfLayoutFormat = new PdfLayoutFormat();
     * layout.layout = PdfLayoutType.paginate;
     * layout.break = PdfLayoutBreakType.fitPage;
     * layout.columns = 2;
     * // Get the number of columns
     * let columns: number = layout.columns;
     * // Create a text element
     * let element: PdfTextElement = {
     *     text: 'Hello world drawn using layout format with multiple columns support in PDF.',
     *     font: document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular),
     *     brush: new PdfBrush({ r: 0, g: 0, b: 0 }),
     *     layoutFormat: layout
     * };
     * // Draw the text element using a specific point
     * const result = page.drawTextElement(element, { x: 50, y: 100 });
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {number} The number of columns.
     */
    get columns(): number {
        return this._columns;
    }
    /**
     * Sets the number of columns used for pagination.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Create a layout format with multi-column support
     * let layout: PdfLayoutFormat = new PdfLayoutFormat();
     * layout.layout = PdfLayoutType.paginate;
     * layout.break = PdfLayoutBreakType.fitPage;
     * layout.columns = 2;
     * // Create a text element
     * let element: PdfTextElement = {
     *     text: 'Hello world drawn using layout format with multiple columns support in PDF.',
     *     font: document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular),
     *     brush: new PdfBrush({ r: 0, g: 0, b: 0 }),
     *     layoutFormat: layout
     * };
     * // Draw the text element using a specific point
     * const result = page.drawTextElement(element, { x: 50, y: 100 });
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {number} value The number of columns to set.
     */
    set columns(value: number) {
        this._columns = value;
    }
    /**
     * Gets the gutter (spacing) between columns.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Create a layout format with multi-column support
     * let layout: PdfLayoutFormat = new PdfLayoutFormat();
     * layout.layout = PdfLayoutType.paginate;
     * layout.break = PdfLayoutBreakType.fitPage;
     * layout.columns = 2;
     * layout.columnGutter = 15;
     * // Get the column gutter
     * let gutter: number = layout.columnGutter;
     * // Create a text element
     * let element: PdfTextElement = {
     *     text: 'Hello world drawn using layout format with multiple columns support in PDF.',
     *     font: document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular),
     *     brush: new PdfBrush({ r: 0, g: 0, b: 0 }),
     *     layoutFormat: layout
     * };
     * // Draw the text element using a specific point
     * const result = page.drawTextElement(element, { x: 50, y: 100 });
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {number} The gutter (spacing) between columns.
     */
    get columnGutter(): number {
        return this._columnGutter;
    }
    /**
     * Sets the gutter (spacing) between columns.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Create a layout format with multi-column support
     * let layout: PdfLayoutFormat = new PdfLayoutFormat();
     * layout.layout = PdfLayoutType.paginate;
     * layout.break = PdfLayoutBreakType.fitPage;
     * layout.columns = 2;
     * layout.columnGutter = 15;
     * // Create a text element
     * let element: PdfTextElement = {
     *     text: 'Hello world drawn using layout format with multiple columns support in PDF.',
     *     font: document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular),
     *     brush: new PdfBrush({ r: 0, g: 0, b: 0 }),
     *     layoutFormat: layout
     * };
     * // Draw the text element using a specific point
     * const result = page.drawTextElement(element, { x: 50, y: 100 });
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {number} value The gutter (spacing) between columns.
     */
    set columnGutter(value: number) {
        this._columnGutter = value;
    }
}
/**
 * Represents a class for layout result in PDF generation.
 * ```typescript
 * // Load an existing document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Add the items to list item collection by passing the array of products
 * let items: PdfListItemCollection = new PdfListItemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
 * // Create a new ordered list
 * let list: PdfOrderedList = new PdfOrderedList(items);
 * // Draw the list and access the layout result
 * let result: PdfLayoutResult = list.draw(page, {x: 20, y: 20, width: 500, height: 300});
 * // Create a new unordered list
 * let list: PdfUnorderedList = new PdfUnorderedList(items);
 * // Draw the list and access the layout result
 * result = list.draw(result.page, {x: result.bounds.x, y: result.bounds.y + result.bounds.height + 10, width: 500, height: 300});
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfLayoutResult {
    _page: PdfPage;
    _bounds: Rectangle;
    _lastLineBounds: Rectangle;
    _remainingText: string;
    _hasRenderedContent: boolean = false;
    /**
     * Initializes a new instance of the `PdfLayoutResult` class.
     * Remarks: Internal constructor used to create a new instance of a PDF layout result.
     *
     * @private
     * @param {PdfPage} page The page where the content finished drawing.
     * @param {Rectangle} bounds The bounds within which the content has been drawn.
     * @param {Rectangle} [lastLineBounds] Optional bounds describing the final line rendered.
     * @param {string} [remainingText] Optional remaining text that was not laid out.
     *
     * ```typescript
     * // Load an existing document
     * const document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * const page: PdfPage = document.getPage(0);
     * // Represents the text that could not be rendered within the specified layout bounds and can be continued in a subsequent layout or page.
     * const bounds: Rectangle = { x: 20, y: 20, width: 500, height: 300 };
     * const lastLine: Rectangle = { x: 20, y: 300, width: 500, height: 14 };
     * const remaining = 'text that did not fit on the provided bounds';
     * // Create a PdfLayoutResult with optional last line bounds and remaining text
     * const result: PdfLayoutResult = new PdfLayoutResult(page, bounds, lastLine, remaining);
     * // Create a new unordered list
     * let list: PdfUnorderedList = new PdfUnorderedList(items);
     * // Draw the list and access the layout result
     * result = list.draw(result.page, {x: result.bounds.x, y: result.bounds.y + result.bounds.height + 10, width: 500, height: 300});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor(page: PdfPage, bounds: Rectangle, lastLineBounds?: Rectangle, remainingText?: string) {
        this._page = page;
        this._bounds = bounds;
        this._lastLineBounds = lastLineBounds ? lastLineBounds : bounds;
        if (remainingText !== 'undefined' && remainingText !== null) {
            this._remainingText = remainingText;
        }
    }
    /**
     * Gets the page associated with the layout result.
     *
     * @returns {PdfPage} value of the layout result.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Draw the list and access the layout result
     * let result: PdfLayoutResult = list.draw(page, {x: 20, y: 20, width: 500, height: 300});
     * // Create a new unordered list
     * let list: PdfUnorderedList = new PdfUnorderedList(items);
     * // Draw the list and access the layout result
     * result = list.draw(result.page, {x: result.bounds.x, y: result.bounds.y + result.bounds.height + 10, width: 500, height: 300});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get Page(): PdfPage {
        return this._page;
    }
    /**
     * Gets the bounds associated with the layout result.
     *
     * @returns {Rectangle} The bounds of the layout result.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Add the items to list item collection by passing the array of products
     * let items: PdfListItemCollection = new PdfListItemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
     * // Create a new ordered list
     * let list: PdfOrderedList = new PdfOrderedList(items);
     * // Draw the list and access the layout result
     * let result: PdfLayoutResult = list.draw(page, {x: 20, y: 20, width: 500, height: 300});
     * // Create a new unordered list
     * let list: PdfUnorderedList = new PdfUnorderedList(items);
     * // Draw the list and access the layout result
     * result = list.draw(result.page, {x: result.bounds.x, y: result.bounds.y + result.bounds.height + 10, width: 500, height: 300});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get bounds(): Rectangle {
        return this._bounds;
    }
    /**
     * Gets the remaining text that was not rendered during the layout process.
     *
     * @returns {string} The remaining text that was not rendered during layout.
     * ```typescript
     * // Load an existing document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create a layout format to control how text flows across pages
     * let format: PdfLayoutFormat = new PdfLayoutFormat();
     * // Set layout break behavior to fit the content within the current page
     * format.break = PdfLayoutBreakType.fitPage;
     * // Restrict the layout to render within a single page only
     * format.layout = PdfLayoutType.onePage
     * // Create a text element with specified content, font, and layout format
     * let textElement: PdfTextElement = { text: textContent, font: new PdfStandardFont(PdfFontFamily.helvetica, 12), layoutFormat : format};
     * // Draw the text element on the page within the given bounds
     * let result: PdfLayoutResult = page.drawTextElement(textElement, {x: 10,y: 10,width: 200,height: 50});
     * // Gets the remaining text that was not rendered.
     * const text: string = result.remainingText;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get remainingText(): string {
        return this._remainingText;
    }
}
/**
 * Represents the result of a paginated layout operation, including the page on
 * which the content was drawn and the final bounds where the layout ended.
 *
 * @private
 */
export class _PageLayoutResult {
    broken: boolean;
    y: number;
    itemText: string;
    markerText: string;
    markerWrote: boolean = false;
    markerWidth: number = 0;
    markerX: number = 0;
}
/**
 * Internal structure containing all parameters required to execute a paginated
 * layout operation, including the target page, bounds, graphics context, and
 * layout formatting rules.
 *
 * @private
 */
export class _PdfLayoutParameters {
    /**
     * Page to draw the content on.
     *
     * @private
     */
    _page: PdfPage;
    /**
     * Bounds array used internally for layout: [x, y, width, height].
     *
     * @private
     */
    _bounds: number[];
    /**
     * Layout options controlling pagination and break behavior.
     *
     * @private
     */
    _format: PdfLayoutFormat;
    /**
     * Graphics context used for rendering.
     *
     * @private
     */
    _graphics: PdfGraphics;
}

