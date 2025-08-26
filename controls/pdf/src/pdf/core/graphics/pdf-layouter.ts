import { PdfLayoutType, PdfLayoutBreakType } from '../enumerator';
import { PdfPage } from '../pdf-page';
import { PdfGraphics } from './pdf-graphics';
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
 * list.draw(page, 0, 20, layout);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ````
 */
export class PdfLayoutFormat {
    _boundSet: boolean = false;
    _paginateBounds: number[] = [];
    _layout: PdfLayoutType;
    _break: PdfLayoutBreakType;
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
     * list.draw(page, 0, 20, layout);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    constructor(format?: PdfLayoutFormat) {
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
     * list.draw(page, 0, 20, 500, 700, pageLayout);
     * // Retrieve the layout type applied to the page layout format
     * let layoutType: PdfLayoutType = pageLayout.layout;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
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
     * list.draw(page, 0, 20, 500, 700, pageLayout);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
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
     * list.draw(page, 0, 20, 500, 700, pageLayout);
     * // Get the layout break type of the list
     * let layoutType: PdfLayoutBreakType = pageLayout.break;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
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
     * list.draw(page, 0, 20, 500, 700, pageLayout);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    set break(value: PdfLayoutBreakType) {
        this._break = value;
    }
    /**
     * Gets the paginate bounds of the page.
     *
     * @returns {number[]} Array containing the paginate bounds.
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
     * list.draw(page, 0, 20, 500, 700, pageLayout);
     * // Get the paginate bounds
     * let layoutType: paginateBounds = pageLayout.paginateBounds;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    get paginateBounds(): number[] {
        return this._paginateBounds;
    }
    /**
     * Sets the paginate bounds for the page.
     *
     * @param {number[]} value Array representing the paginate bounds to set for the page.
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
     * pageLayout.paginateBounds = [0, 0, 500, 700];
     * // Draw the items on the page
     * list.draw(page, 0, 20, 500, 700, pageLayout);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    set paginateBounds(value: number[]) {
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
     * list.draw(page, 0, 20, 500, 700, pageLayout);
     * // Get whether paginate bounds are used
     * let usePaginate:  boolean = pageLayout.usePaginateBounds;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ````
     */
    get usePaginateBounds(): boolean {
        return this._boundSet;
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
 * let result: PdfLayoutResult = list.draw(result.page, result.bounds[0], result.bounds[1], result.bounds[2], result.bounds[3]);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfLayoutResult {
    _page: PdfPage;
    _bounds: number[];
    /**
     * Initializes a new instance of the `PdfLayoutResult` class.
     * Remarks: Internal constructor used to create a new instance of a PDF layout result.
     *
     * @param {PdfPage} page The page where the circle annotation is to be placed.
     * @param {number[]} bounds The bounds within which the list has been drawn.
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
     * let result: PdfLayoutResult = list.draw(result.page, result.bounds[0], result.bounds[1], result.bounds[2], result.bounds[3]);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(page: PdfPage, bounds: number[]) {
        this._page = page;
        this._bounds = bounds;
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
     * let result: PdfLayoutResult = list.draw(result.page, result.bounds[0], result.bounds[1], result.bounds[2], result.bounds[3]);
     * // Access the page from the layout result
     * let resultPage: PdfPage = result.page;
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
     * @returns {number[]} The bounds of the layout result.
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
     * let result: PdfLayoutResult = list.draw(result.page, result.bounds[0], result.bounds[1], result.bounds[2], result.bounds[3]);
     * // Access the bounds associated with layout result
     * let bounds: number[] = result.bounds;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get bounds(): number[] {
        return this._bounds;
    }
}
export class _PageLayoutResult {
    broken: boolean;
    y: number;
    itemText: string;
    markerText: string;
    markerWrote: boolean = false;
    markerWidth: number = 0;
    markerX: number = 0;
}
export class _PdfLayoutParameters {
    _page: PdfPage;
    _bounds: number[];
    _format: PdfLayoutFormat;
    _graphics: PdfGraphics;
}
