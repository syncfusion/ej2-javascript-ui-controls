import { PdfDataExtractor } from './pdf-data-extractor';
import { PdfTagType, ScopeType } from './text-extraction/enumerator';
import { _FontStructure } from './text-extraction/font-structure';
import { PdfDocument, _PdfDictionary, PdfPage, PdfRotationAngle, _getPageIndex, PdfPen, PdfAnnotation, PdfField, PdfTextBoxField, PdfComboBoxField, PdfListBoxField, PdfButtonField, PdfCheckBoxField, PdfRadioButtonListField, PdfSignatureField, PdfWidgetAnnotation, PdfListFieldItem, _toRectangle, Rectangle } from '@syncfusion/ej2-pdf';
import { _addFontResources, _getXObjectResources } from './utils';
import { _GraphicState } from './graphic-state';
import { TextLine } from './text-structure';
/**
 * Represents the structure element of the PDF document.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Initialize a new instance of the `PdfDataExtractor` class
 * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
 * // Access the structure element of the PDF document
 * let rootStructureElement: PdfStructureElement = extractor.getStructureElement();
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfStructureElement {
    _text: string = '';
    _dictionary: _PdfDictionary;
    _parent: PdfStructureElement;
    _order: number;
    _document: PdfDocument;
    _tagType: PdfTagType = PdfTagType.none;
    _contentId: number[] = [];
    _pageDictionary: _PdfDictionary;
    _abbreviation: string;
    _page: PdfPage;
    _childElements: PdfStructureElement[];
    _mcid: number = -1;
    _bounds: Rectangle;
    _abbreviationCollection: Map<number, string>;
    _textCollection: string[] = [];
    _actualText: string;
    _alternateText: string;
    _language: string;
    _title: string = '';
    _scope: ScopeType = ScopeType.none;
    /**
     * Gets the text of the tag (Read only).
     *
     * @returns {string} The extracted text from the structure element.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract structure elements from a particular page in the PDF document
     * let page: PdfPage = document.getPage(0);
     * let pageElements: PdfStructureElement[] = extractor.getStructureElements(page);
     * let element: PdfStructureElement = pageElements[0];
     * // Gets the extracted text of the structure element.
     * let text: string = element.text;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get text(): string {
        return this._text;
    }
    /**
     * Gets the alternate text of the tag (Read only).
     *
     * @returns {string} The alternate text from the structure element.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract structure elements from a particular page in the PDF document
     * let page: PdfPage = document.getPage(0);
     * let pageElements: PdfStructureElement[] = extractor.getStructureElements(page);
     * let element: PdfStructureElement = pageElements[0];
     * // Gets the alternate text of the structure element.
     * let altText: string = element.alternateText;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get alternateText(): string {
        return this._alternateText;
    }
    /**
     * Gets the parent element (Read only).
     *
     * @returns {PdfStructureElement}  The parent PdfStructureElement.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract structure elements from a particular page in the PDF document
     * let page: PdfPage = document.getPage(0);
     * let pageElements: PdfStructureElement[] = extractor.getStructureElements(page);
     * let element: PdfStructureElement = pageElements[0];
     * // Gets the parent of the structure element.
     * let parentElement: PdfStructureElement = element.parent;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get parent(): PdfStructureElement {
        return this._parent;
    }
    /**
     * Gets the abbreviation (Read only).
     *
     * @returns {string} Abbreviation
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract structure elements from a particular page in the PDF document
     * let page: PdfPage = document.getPage(0);
     * let pageElements: PdfStructureElement[] = extractor.getStructureElements(page);
     * let element: PdfStructureElement = pageElements[0];
     * // Gets the abbreviation of the structure element.
     * let abbreviation: string = element.abbreviation;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get abbreviation(): string {
        return this._abbreviation;
    }
    /**
     * Gets the tag type of the structure element (Read only).
     *
     * @returns {PdfTagType} The tag type of the structure element.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract structure elements from a particular page in the PDF document
     * let page: PdfPage = document.getPage(0);
     * let pageElements: PdfStructureElement[] = extractor.getStructureElements(page);
     * let element: PdfStructureElement = pageElements[0];
     * // Gets the tag type of the structure element.
     * let type: PdfTagType = element.tagType;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get tagType(): PdfTagType {
        return this._tagType;
    }
    /**
     * Gets the actual text of the structure element (Read only).
     *
     * @returns {string} The actual text associated with the structure element.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract structure elements from a particular page in the PDF document
     * let page: PdfPage = document.getPage(0);
     * let pageElements: PdfStructureElement[] = extractor.getStructureElements(page);
     * let element: PdfStructureElement = pageElements[0];
     * // Gets the actual text of the structure element.
     * let actualText: string = element.actualText;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get actualText(): string {
        return this._actualText;
    }
    /**
     * Gets the page associated with the structure element (Read only).
     *
     * @returns {PdfPage} The PdfPage where the structure element is located.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract structure elements from a particular page in the PDF document
     * let page: PdfPage = document.getPage(0);
     * let pageElements: PdfStructureElement[] = extractor.getStructureElements(page);
     * let element: PdfStructureElement = pageElements[0];
     * // Gets the page of the structure element.
     * let elementPage: PdfPage = element.page;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get page(): PdfPage {
        if (!(this._page)) {
            this._page = this._getPageFromElement(this);
        }
        const parent: PdfStructureElement = this.parent;
        if (!(this._page) && parent) {
            this._page = this._getPageFromElement(parent);
            if (!(this._page)) {
                this._page = this._getChildPage();
            }
        }
        return this._page;
    }
    /**
     * Gets the bounds of the structure element (Read only).
     *
     * @returns {Rectangle} The bounds of the structure element as an array in the format [x, y, width, height].
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract structure elements from a particular page in the PDF document
     * let page: PdfPage = document.getPage(0);
     * let pageElements: PdfStructureElement[] = extractor.getStructureElements(page);
     * let element: PdfStructureElement = pageElements[0];
     * // Gets the bounds of the structure element.
     * let elementBounds: Rectangle = element.bounds;
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
     * Gets the child elements of this structure element (Read only).
     *
     * @returns {PdfStructureElement[]} An array of child PdfStructureElement objects.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract structure elements from a particular page in the PDF document
     * let page: PdfPage = document.getPage(0);
     * let pageElements: PdfStructureElement[] = extractor.getStructureElements(page);
     * let element: PdfStructureElement = pageElements[0];
     * // Gets the child elements of the structure element.
     * let childElements: PdfStructureElement[] = element.childElements;
     * // Iterate through each child element
     * childElements.forEach((childElement: PdfStructureElement) => {
     *    // Do something with each child element
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get childElements(): PdfStructureElement[] {
        return this._childElements;
    }
    /**
     * Gets the language of the structure element (Read only).
     *
     * @returns {string} The language code of the structure element.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract structure elements from a particular page in the PDF document
     * let page: PdfPage = document.getPage(0);
     * let pageElements: PdfStructureElement[] = extractor.getStructureElements(page);
     * let element: PdfStructureElement = pageElements[0];
     * // Gets the language of the structure element.
     * let language: string = element.language;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get language(): string {
        return this._language;
    }
    /**
     * Gets the order of the structure element (Read only).
     *
     * @returns {number} The order index representing the position of the structure element.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract structure elements from a particular page in the PDF document
     * let page: PdfPage = document.getPage(0);
     * let pageElements: PdfStructureElement[] = extractor.getStructureElements(page);
     * let element: PdfStructureElement = pageElements[0];
     * // Gets the order of the structure element.
     * let elementOrder: number = element.order;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get order(): number {
        return this._order;
    }
    /**
     * Gets the title of the structure element (Read only).
     *
     * @returns {string} The title of the structure element.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract structure elements from a particular page in the PDF document
     * let page: PdfPage = document.getPage(0);
     * let pageElements: PdfStructureElement[] = extractor.getStructureElements(page);
     * let element: PdfStructureElement = pageElements[0];
     * // Gets the title of the structure element.
     * let elementTitle: string = element.title;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get title(): string {
        return this._title;
    }
    /**
     * Gets the scope type of the structure element (Read only).
     *
     * @returns {ScopeType} The scope type indicating the context or area covered by the structure element, such as row, column, or both.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract structure elements from a particular page in the PDF document
     * let page: PdfPage = document.getPage(0);
     * let pageElements: PdfStructureElement[] = extractor.getStructureElements(page);
     * let element: PdfStructureElement = pageElements[0];
     * // Gets the scope type of the structure element.
     * let scopeType: ScopeType = element.scope;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get scope(): ScopeType {
        return this._scope;
    }
    static _load(document?: PdfDocument, dictionary?: _PdfDictionary, order?: number, parent?: PdfStructureElement): PdfStructureElement {
        const element: PdfStructureElement = new PdfStructureElement();
        element._document = document;
        element._dictionary = dictionary;
        element._parent = parent;
        element._order = order;
        element._childElements = [];
        element._bounds = {x: 0, y: 0, width: 0, height: 0};
        element._language = '';
        return element;
    }
    _getPageFromElement(element: PdfStructureElement): PdfPage {
        if (element._page) {
            return element._page;
        }
        if (element._pageDictionary) {
            const document: PdfDocument = this._document;
            if (!(this._page) && document) {
                const pageIndex: number = _getPageIndex(document, element._pageDictionary);
                if (pageIndex !== -1) {
                    this._page = this._document.getPage(pageIndex);
                }
            }
        }
        return this._page;
    }
    _getChildPage(): PdfPage {
        let page: PdfPage;
        const elements: PdfStructureElement[] = this.childElements;
        if (elements.length > 0) {
            for (let i: number = 0; i < elements.length; i++) {
                const childElement: PdfStructureElement = elements[Number.parseInt(i.toString(), 10)];
                page = this._getPageFromElement(childElement);
                if (page) {
                    break;
                } else {
                    page = childElement._getChildPage();
                }
            }
        }
        return page;
    }
    _getTaggedContent(elements: PdfStructureElement[]): void {
        const textExtractor: PdfDataExtractor = new PdfDataExtractor(this._document);
        textExtractor._extractTaggedText = true;
        const pageTextLine: Map<number, TextLine[]> = new Map<number, TextLine[]>();
        for (let i: number = 0; i < elements.length; i++) {
            const element: PdfStructureElement = elements[Number.parseInt(i.toString(), 10)];
            const elementDictionary: _PdfDictionary = element._dictionary;
            const graphicState: _GraphicState = new _GraphicState();
            if (element) {
                let page: PdfPage;
                if (element) {
                    page = element.page;
                }
                let textLineCollection: TextLine[];
                if (page) {
                    textLineCollection = pageTextLine.get(page._pageIndex);
                }
                if (!textLineCollection && page) {
                    let fontCollection: Map<string, _FontStructure> = new Map<string, _FontStructure>();
                    let xObjectCollection: Map<string, any> = new Map<string, any>();  //eslint-disable-line
                    if (page._pageDictionary.has('Resources')) {
                        const pageResources: _PdfDictionary = page._pageDictionary.get('Resources');
                        fontCollection = _addFontResources(pageResources, this._document._crossReference);
                        xObjectCollection = _getXObjectResources(pageResources, this._document._crossReference);
                    }
                    textExtractor._renderText(page, fontCollection, xObjectCollection, graphicState);
                    textLineCollection = [...textExtractor._textLine];
                    pageTextLine.set(page._pageIndex, textLineCollection);
                }
                const textElements: Map<number, string[]> = textExtractor._mcidTextMap;
                let resultString: string = '';
                const tagBounds: {x: number, y: number, width: number, height: number} = { x: Infinity, y: Infinity, width: 0, height: 0 };
                element._contentId.forEach((contentId: number) => {
                    if (textElements.has(contentId)) {
                        const textArray: string[] = textElements.get(contentId);
                        textArray.forEach((textSegment: string) => {
                            const textLineIndex: number = textLineCollection.findIndex((line: TextLine) => {
                                return line.text.trim() === textSegment.trim();
                            });
                            if (textLineIndex !== -1) {
                                const textLine: TextLine = textLineCollection[Number.parseInt(textLineIndex.toString(), 10)];
                                resultString += textSegment;
                                const x: number = textLine.bounds.x;
                                const y: number = textLine.bounds.y;
                                const width: number = textLine.bounds.width;
                                const height: number = textLine.bounds.height;
                                const [lineX, lineY, lineWidth, lineHeight]: number[] = [x, y, width, height];
                                const currentBounds: {x: number, y: number, width: number, height: number} = {
                                    x: lineX,
                                    y: lineY,
                                    width: lineWidth,
                                    height: lineHeight
                                };
                                tagBounds.x = Math.min(tagBounds.x, currentBounds.x);
                                tagBounds.y = Math.min(tagBounds.y, currentBounds.y);
                                tagBounds.width = Math.max(tagBounds.width, currentBounds.x + currentBounds.width - tagBounds.x);
                                tagBounds.height = Math.max(tagBounds.height, currentBounds.y + currentBounds.height - tagBounds.y);
                                textLineCollection.splice(textLineIndex, 1);
                            }
                        });
                    }
                });
                if (resultString && element._tagType && element._tagType !== PdfTagType.figure) {
                    element._text = resultString;
                    element._bounds = {x: tagBounds.x, y: tagBounds.y, width: tagBounds.width, height: tagBounds.height};
                    page.graphics.drawRectangle(element._bounds, new PdfPen({r: 255, g: 0, b: 0}, 1));
                }
                if (!element._actualText && elementDictionary && elementDictionary.has('ActualText')) {
                    const actualText: string = elementDictionary.get('ActualText');
                    if (actualText) {
                        element._actualText = actualText;
                    }
                }
                if (!element._alternateText && elementDictionary && elementDictionary.has('Alt')) {
                    const altText: string = elementDictionary.get('Alt');
                    if (altText) {
                        element._alternateText = altText;
                    }
                }
                if (!element._language && elementDictionary && elementDictionary.has('Lang')) {
                    const language: string = elementDictionary.get('Lang');
                    if (language) {
                        element._language = language;
                    }
                }
                if (!element._title && elementDictionary && elementDictionary.has('T')) {
                    const title: string = elementDictionary.get('T');
                    if (title && typeof title === 'string') {
                        element._title = title.trim();
                    }
                }
                if (element.parent && (element.parent.tagType === PdfTagType.annotation ||
                    element.parent.tagType === PdfTagType.link || element.parent.tagType === PdfTagType.form)) {
                    if (elementDictionary && elementDictionary.has('Obj')) {
                        const obj: string = (elementDictionary.has('Obj') ? 'Obj' : 'obj');
                        const dict: _PdfDictionary = elementDictionary.get(obj) as  _PdfDictionary;
                        if (element.parent.tagType === PdfTagType.annotation ||  element.parent.tagType === PdfTagType.link) {
                            if (dict && element.page && element.page.annotations.count > 0) {
                                for (let i: number = 0; i < element.page.annotations.count; i++) {
                                    const annot: PdfAnnotation = element.page.annotations.at(Number.parseInt(i.toString(), 10));
                                    if (annot._dictionary === dict) {
                                        element._bounds = this._calculateBounds(element, annot.bounds);
                                    }
                                }
                            }
                        } else {
                            if (dict && this._document.form.count > 0) {
                                for (let i: number = 0; i < this._document.form.count; i++) {
                                    const field: PdfField = this._document.form.fieldAt(Number.parseInt(i.toString(), 10));
                                    if (field && field._dictionary === dict) {
                                        element._bounds = {x: field.bounds.x, y: field.bounds.y, width: field.bounds.width,
                                            height: field.bounds.height};
                                    } else if (field && field._kids && field._kids.length > 0) {
                                        if (field instanceof PdfTextBoxField) {
                                            const textBox: PdfTextBoxField = field as PdfTextBoxField;
                                            for (let j: number = 0; j < textBox.itemsCount; j++) {
                                                const textBoxitem: PdfWidgetAnnotation = textBox.itemAt(Number.parseInt(j.toString(), 10));
                                                if (textBoxitem && textBoxitem._dictionary === dict) {
                                                    const textBoxBounds: {x: number, y: number, width: number, height: number} =
                                                    textBox.itemAt(Number.parseInt(j.toString(), 10)).bounds;
                                                    element._bounds = {x: textBoxBounds.x, y: textBoxBounds.y,
                                                        width: textBoxBounds.width, height: textBoxBounds.height};
                                                }
                                            }
                                        } else if (field instanceof PdfComboBoxField) {
                                            const comboBox: PdfComboBoxField = field as PdfComboBoxField;
                                            if (comboBox && comboBox.itemsCount > 0) {
                                                for (let j: number = 0; j < comboBox.itemsCount; j++) {
                                                    const comboBoxitem: PdfListFieldItem =
                                                    comboBox.itemAt(Number.parseInt(j.toString(), 10));
                                                    if (comboBoxitem && comboBoxitem._dictionary === dict) {
                                                        const comboBoxBounds: {x: number, y: number, width: number, height: number} =
                                                        comboBox.itemAt(Number.parseInt(j.toString(), 10)).bounds;
                                                        element._bounds = {x: comboBoxBounds.x, y: comboBoxBounds.y,
                                                            width: comboBoxBounds.width, height: comboBoxBounds.height};
                                                    }
                                                }
                                            }
                                        } else if (field instanceof PdfListBoxField) {
                                            const listBox: PdfListBoxField = field as PdfListBoxField;
                                            if (listBox && listBox.itemsCount > 0) {
                                                for (let j: number = 0; j < listBox.itemsCount; j++) {
                                                    const listBoxItem: PdfListFieldItem = listBox.itemAt(Number.parseInt(j.toString(), 10));
                                                    if (listBoxItem && listBoxItem._dictionary === dict) {
                                                        const listBoxBounds: {x: number, y: number, width: number, height: number} =
                                                        listBox.itemAt(Number.parseInt(j.toString(), 10)).bounds;
                                                        element._bounds = {x: listBoxBounds.x, y: listBoxBounds.y,
                                                            width: listBoxBounds.width, height: listBoxBounds.height};
                                                    }
                                                }
                                            }
                                        } else if (field instanceof PdfButtonField) {
                                            const buttonField: PdfButtonField = field as PdfButtonField;
                                            for (let j: number = 0; j < buttonField.itemsCount; j++) {
                                                const buttonFieldItem: PdfWidgetAnnotation =
                                                buttonField.itemAt(Number.parseInt(j.toString(), 10));
                                                if (buttonFieldItem && buttonFieldItem._dictionary === dict) {
                                                    const buttonBounds: {x: number, y: number, width: number, height: number} =
                                                    buttonField.itemAt(Number.parseInt(j.toString(), 10)).bounds;
                                                    element._bounds = {x: buttonBounds.x, y: buttonBounds.y,
                                                        width: buttonBounds.width, height: buttonBounds.height};
                                                }
                                            }
                                        } else if (field instanceof PdfCheckBoxField) {
                                            const checkField: PdfCheckBoxField = field as PdfCheckBoxField;
                                            for (let j: number = 0; j < checkField.itemsCount; j++) {
                                                const checkFieldItem: PdfWidgetAnnotation =
                                                checkField.itemAt(Number.parseInt(j.toString(), 10));
                                                if (checkFieldItem && checkFieldItem._dictionary === dict) {
                                                    const checkBounds: {x: number, y: number, width: number, height: number} =
                                                    checkField.itemAt(Number.parseInt(j.toString(), 10)).bounds;
                                                    element._bounds = {x: checkBounds.x, y: checkBounds.y,
                                                        width: checkBounds.width, height: checkBounds.height};
                                                }
                                            }
                                        } else if (field instanceof PdfRadioButtonListField) {
                                            const radioField: PdfRadioButtonListField = field as PdfRadioButtonListField;
                                            for (let j: number = 0; j < radioField.itemsCount; j++) {
                                                const radioFieldItem: PdfWidgetAnnotation =
                                                radioField.itemAt(Number.parseInt(j.toString(), 10));
                                                if (radioFieldItem && radioFieldItem._dictionary === dict) {
                                                    const radioBounds: {x: number, y: number, width: number, height: number} =
                                                    radioField.itemAt(Number.parseInt(j.toString(), 10)).bounds;
                                                    element._bounds = {x: radioBounds.x, y: radioBounds.y, width: radioBounds.width,
                                                        height: radioBounds.height};
                                                }
                                            }
                                        } else if (field instanceof PdfSignatureField) {
                                            const signField: PdfSignatureField = field as PdfSignatureField;
                                            for (let j: number = 0; j < signField.itemsCount; j++) {
                                                const signFieldItem: PdfWidgetAnnotation =
                                                signField.itemAt(Number.parseInt(j.toString(), 10));
                                                if (signFieldItem && signFieldItem._dictionary === dict) {
                                                    const signBounds: {x: number, y: number, width: number, height: number} =
                                                    signField.itemAt(Number.parseInt(j.toString(), 10)).bounds;
                                                    element._bounds = {x: signBounds.x, y: signBounds.y, width: signBounds.width,
                                                        height: signBounds.height};
                                                }
                                            }
                                        }
                                    } else if (dict.has('Parent')) {
                                        const parentDictionary: _PdfDictionary = dict.get('Parent');
                                        if (parentDictionary && field._dictionary === parentDictionary) {
                                            element._bounds = {x: field.bounds.x, y: field.bounds.y, width: field.bounds.width,
                                                height: field.bounds.height};
                                        }
                                    }
                                    element._bounds = this._calculateBounds(element, element._bounds);
                                }
                            }
                        }
                    }
                } else if (element._tagType === PdfTagType.figure) {
                    let assignedBounds: boolean = false;
                    const bounds: Rectangle = textExtractor._getFigureBounds(element, element.page);
                    if (bounds) {
                        element._bounds = bounds;
                        assignedBounds = true;
                    }
                    if (!assignedBounds) {
                        element._bounds = {x: 0, y: 0, width: 0, height: 0};
                    }
                    if (elementDictionary && elementDictionary.has('A')) {
                        const dictionary: _PdfDictionary = elementDictionary.get('A');
                        if (dictionary && dictionary.has('BBox')) {
                            const bbox: number[] = dictionary.get('BBox');
                            if (bbox && bbox.length > 0 && element._bounds) {
                                const bboxArray: {x: number, y: number, width: number, height: number} = _toRectangle(bbox);
                                if (((element.page && element._page.rotation === PdfRotationAngle.angle0 ||
                                        element.page.rotation === PdfRotationAngle.angle180))
                                        || ((element.page.rotation === PdfRotationAngle.angle90 ||
                                        element.page.rotation === PdfRotationAngle.angle270))) {
                                    if (element.page.rotation === PdfRotationAngle.angle0) {
                                        element._bounds = {x: element._bounds.x, y: element._bounds.y - bboxArray.height,
                                            width: bboxArray.width, height: bboxArray.height};
                                    } else if (element.page.rotation === PdfRotationAngle.angle90) {
                                        element._bounds = {x: element._bounds.x, y: element._bounds.y,
                                            width: bboxArray.height, height: bboxArray.width};
                                    } else if  (element.page.rotation === PdfRotationAngle.angle180) {
                                        element._bounds = {x: element._bounds.x - bboxArray.width, y: element._bounds.y,
                                            width: bboxArray.width, height: bboxArray.height};
                                    } else if (element.page.rotation === PdfRotationAngle.angle270) {
                                        element._bounds = {x: element._bounds.x - bboxArray.height, y: element._bounds.y -
                                        bboxArray.width, width: bboxArray.height, height: bboxArray.width};
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    _calculateBounds(element: PdfStructureElement, bounds: Rectangle): Rectangle {
        if (element && element._page) {
            const rotation: PdfRotationAngle = element._page.rotation;
            if (rotation !== PdfRotationAngle.angle0) {
                if (rotation === PdfRotationAngle.angle90) {
                    bounds = {x: element.page.size.height - bounds.y - bounds.height, y: bounds.x,
                        width: bounds.height, height: bounds.width};
                } else if (rotation === PdfRotationAngle.angle180) {
                    bounds = {x: element.page.size.width - bounds.x - bounds.width,
                        y: element.page.size.height - bounds.y - bounds.width, width: bounds.width, height: bounds.height};
                } else if (rotation === PdfRotationAngle.angle270) {
                    bounds = {x: bounds.y, y: element.page.size.width - bounds.x - bounds.width,
                        width: bounds.height, height: bounds.width};
                }
            }
        }
        return bounds;
    }
    _getTagType(value: string): PdfTagType {
        let type: PdfTagType = PdfTagType.none;
        switch (value) {
        case 'P':
            type = PdfTagType.paragraph;
            break;
        case 'Figure':
            type = PdfTagType.figure;
            break;
        case 'Art':
            type = PdfTagType.article;
            break;
        case 'Annot':
            type = PdfTagType.annotation;
            break;
        case 'Bibentry':
            type = PdfTagType.bibliographyEntry;
            break;
        case 'BlockQuote':
            type = PdfTagType.blockQuotation;
            break;
        case 'Caption':
            type = PdfTagType.caption;
            break;
        case 'Code':
            type = PdfTagType.code;
            break;
        case 'Div':
            type = PdfTagType.division;
            break;
        case 'Document':
            type = PdfTagType.documentType;
            break;
        case 'Form':
            type = PdfTagType.form;
            break;
        case 'Formula':
            type = PdfTagType.formula;
            break;
        case 'Index':
            type = PdfTagType.index;
            break;
        case 'H':
        case 'Title':
            type = PdfTagType.heading;
            break;
        case 'H1':
            type = PdfTagType.headingLevel1;
            break;
        case 'H2':
            type = PdfTagType.headingLevel2;
            break;
        case 'H3':
            type = PdfTagType.headingLevel3;
            break;
        case 'H4':
            type = PdfTagType.headingLevel4;
            break;
        case 'H5':
            type = PdfTagType.headingLevel5;
            break;
        case 'H6':
            type = PdfTagType.headingLevel6;
            break;
        case 'Lbl':
            type = PdfTagType.label;
            break;
        case 'Link':
            type = PdfTagType.link;
            break;
        case 'L':
            type = PdfTagType.list;
            break;
        case 'LI':
            type = PdfTagType.listItem;
            break;
        case 'LBody':
            type = PdfTagType.listBody;
            break;
        case 'Note':
            type = PdfTagType.note;
            break;
        case 'Part':
            type = PdfTagType.part;
            break;
        case 'Quote':
            type = PdfTagType.quotation;
            break;
        case 'Reference':
            type = PdfTagType.reference;
            break;
        case 'Sect':
            type = PdfTagType.section;
            break;
        case 'Span':
        case 'ParagraphSpan':
        case 'HyphenSpan':
        case 'StyleSpan':
            type = PdfTagType.span;
            break;
        case 'Table':
            type = PdfTagType.table;
            break;
        case 'TD':
            type = PdfTagType.tableDataCell;
            break;
        case 'TH':
            type = PdfTagType.tableHeader;
            break;
        case 'TOC':
            type = PdfTagType.tableOfContent;
            break;
        case 'TOCI':
            type = PdfTagType.tableOfContentItem;
            break;
        case 'TR':
            type = PdfTagType.tableRow;
            break;
        case 'THead':
            type = PdfTagType.tableHeaderRowGroup;
            break;
        case 'TBody':
            type = PdfTagType.tableBodyRowGroup;
            break;
        case 'TFoot':
            type = PdfTagType.tableFooterRowGroup;
            break;
        }
        return type;
    }
    _parseContent(element: string[]): number {
        let abbreviation: string;
        if (element && element.length > 1) {
            const result: string = element[1].replace('/', '');
            const regexPattern: string = '[ \\(\\)><]';
            const regex: RegExp = new RegExp(regexPattern, 'g');
            const layerEntries: string[] = result.replace('/', '').split(regex);
            for (let i: number = 0; i < layerEntries.length; i++) {
                const entry: string = layerEntries[Number.parseInt(i.toString(), 10)];
                if (entry === 'E') {
                    const expansionParts: string[] = [];
                    let j: number = i + 1;
                    while (j < layerEntries.length && layerEntries[<number>j] !== 'MCID') {
                        const entry: string = layerEntries[<number>j];
                        if (typeof entry === 'string' && entry.trim().length > 0) {
                            expansionParts.push(entry);
                        }
                        j++;
                    }
                    abbreviation = expansionParts.join(' ');
                    i = j - 1;
                } else if (entry === 'MCID') {
                    this._mcid = parseInt(layerEntries[Number.parseInt(i.toString(), 10) + 1], 10);
                    if (abbreviation) {
                        if (!this._abbreviationCollection) {
                            this._abbreviationCollection = new Map();
                        }
                        this._abbreviationCollection.set(this._mcid, abbreviation);
                    }
                }
            }
        }
        return this._mcid;
    }
}
