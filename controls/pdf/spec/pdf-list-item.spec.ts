import {
    PdfListItem,
    PdfListItemCollection
} from '../src/pdf/core/list/pdf-list-item';
import {
    PdfFont,
    PdfFontFamily,
    PdfStandardFont
} from '../src/pdf/core/fonts/pdf-standard-font';
import { PdfStringFormat } from
    '../src/pdf/core/fonts/pdf-string-format';
import {
    PdfBrush,
    PdfPen
} from '../src/pdf/core/graphics/pdf-graphics';
import {
    PdfOrderedList
} from '../src/pdf/core/list/pdf-list';
describe('PdfListItem constructor', () => {
    it('throws the exact error when text is undefined', () => {
        // Arrange
        const undefinedText: string =
            undefined as unknown as string;
        // Act
        const createItem: () => PdfListItem =
            (): PdfListItem => {
                return new PdfListItem(undefinedText);
            };
        // Assert
        expect(createItem).toThrowError(
            Error,
            'Text cannot be null or undenfied.'
        );
    });
    it('throws the exact error when text is null', () => {
        // Arrange
        const nullText: string =
            null as unknown as string;
        // Act
        const createItem: () => PdfListItem =
            (): PdfListItem => {
                return new PdfListItem(nullText);
            };
        // Assert
        expect(createItem).toThrowError(
            Error,
            'Text cannot be null or undenfied.'
        );
    });
    it('stores the supplied text exactly', () => {
        // Arrange
        const expectedText: string = 'PDF';
        // Act
        const item: PdfListItem =
            new PdfListItem(expectedText);
        // Assert
        expect(item.text).toBe(expectedText);
        expect(item._text).toBe(expectedText);
    });
    it('leaves optional values undefined when settings are omitted', () => {
        // Arrange
        const text: string = 'PDF';
        // Act
        const item: PdfListItem =
            new PdfListItem(text);
        // Assert
        expect(item.font).toBeUndefined();
        expect(item.stringFormat).toBeUndefined();
        expect(item.pen).toBeUndefined();
        expect(item.brush).toBeUndefined();
    });
    it('assigns the supplied font setting', () => {
        // Arrange
        const expectedFont: PdfFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                12
            );
        // Act
        const item: PdfListItem =
            new PdfListItem('PDF', {
                font: expectedFont
            });
        // Assert
        expect(item.font).toBe(expectedFont);
        expect(item._font).toBe(expectedFont);
    });
    it('does not assign font when the font setting is omitted', () => {
        // Arrange
        const expectedFormat: PdfStringFormat =
            new PdfStringFormat();
        // Act
        const item: PdfListItem =
            new PdfListItem('PDF', {
                format: expectedFormat
            });
        // Assert
        expect(item.font).toBeUndefined();
        expect(item._font).toBeUndefined();
        expect(item.stringFormat).toBe(expectedFormat);
    });
    it('assigns the supplied string format setting', () => {
        // Arrange
        const expectedFormat: PdfStringFormat =
            new PdfStringFormat();
        // Act
        const item: PdfListItem =
            new PdfListItem('PDF', {
                format: expectedFormat
            });
        // Assert
        expect(item.stringFormat).toBe(expectedFormat);
        expect(item._stringFormat).toBe(expectedFormat);
    });
    it('does not assign string format when the setting is omitted', () => {
        // Arrange
        const expectedFont: PdfFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                12
            );
        // Act
        const item: PdfListItem =
            new PdfListItem('PDF', {
                font: expectedFont
            });
        // Assert
        expect(item.stringFormat).toBeUndefined();
        expect(item._stringFormat).toBeUndefined();
        expect(item.font).toBe(expectedFont);
    });
    it('assigns the supplied pen setting', () => {
        // Arrange
        const expectedPen: PdfPen =
            new PdfPen(
                { r: 10, g: 20, b: 30 },
                2
            );
        // Act
        const item: PdfListItem =
            new PdfListItem('PDF', {
                pen: expectedPen
            });
        // Assert
        expect(item.pen).toBe(expectedPen);
        expect(item._pen).toBe(expectedPen);
    });
    it('does not assign pen when the pen setting is omitted', () => {
        // Arrange
        const expectedFormat: PdfStringFormat =
            new PdfStringFormat();
        // Act
        const item: PdfListItem =
            new PdfListItem('PDF', {
                format: expectedFormat
            });
        // Assert
        expect(item.pen).toBeUndefined();
        expect(item._pen).toBeUndefined();
        expect(item.stringFormat).toBe(expectedFormat);
    });
    it('assigns the supplied brush setting', () => {
        // Arrange
        const expectedBrush: PdfBrush =
            new PdfBrush({
                r: 40,
                g: 50,
                b: 60
            });
        // Act
        const item: PdfListItem =
            new PdfListItem('PDF', {
                brush: expectedBrush
            });
        // Assert
        expect(item.brush).toBe(expectedBrush);
        expect(item._brush).toBe(expectedBrush);
    });
    it('does not assign brush when the brush setting is omitted', () => {
        // Arrange
        const expectedFormat: PdfStringFormat =
            new PdfStringFormat();
        // Act
        const item: PdfListItem =
            new PdfListItem('PDF', {
                format: expectedFormat
            });
        // Assert
        expect(item.brush).toBeUndefined();
        expect(item._brush).toBeUndefined();
        expect(item.stringFormat).toBe(expectedFormat);
    });
    it('assigns every supplied constructor setting', () => {
        // Arrange
        const expectedFont: PdfFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                14
            );
        const expectedFormat: PdfStringFormat =
            new PdfStringFormat();
        const expectedPen: PdfPen =
            new PdfPen(
                { r: 20, g: 40, b: 60 },
                1
            );
        const expectedBrush: PdfBrush =
            new PdfBrush({
                r: 80,
                g: 100,
                b: 120
            });
        // Act
        const item: PdfListItem =
            new PdfListItem('PDF', {
                font: expectedFont,
                format: expectedFormat,
                pen: expectedPen,
                brush: expectedBrush
            });
        // Assert
        expect(item.font).toBe(expectedFont);
        expect(item._font).toBe(expectedFont);
        expect(item.stringFormat).toBe(expectedFormat);
        expect(item._stringFormat).toBe(expectedFormat);
        expect(item.pen).toBe(expectedPen);
        expect(item._pen).toBe(expectedPen);
        expect(item.brush).toBe(expectedBrush);
        expect(item._brush).toBe(expectedBrush);
    });
    it('does not assign optional settings when empty settings are supplied', () => {
        // Arrange
        const text: string = 'PDF';
        // Act
        const item: PdfListItem =
            new PdfListItem(text, {});
        // Assert
        expect(item.text).toBe(text);
        expect(item.font).toBeUndefined();
        expect(item.stringFormat).toBeUndefined();
        expect(item.pen).toBeUndefined();
        expect(item.brush).toBeUndefined();
    });
});
describe('PdfListItem properties', () => {
    it('assigns and returns brush', () => {
        // Arrange
        const item: PdfListItem =
            new PdfListItem('PDF');
        const expectedBrush: PdfBrush =
            new PdfBrush({
                r: 10,
                g: 30,
                b: 50
            });
        // Act
        item.brush = expectedBrush;
        const actualBrush: PdfBrush = item.brush;
        // Assert
        expect(actualBrush).toBe(expectedBrush);
        expect(item._brush).toBe(expectedBrush);
    });
    it('assigns and returns pen', () => {
        // Arrange
        const item: PdfListItem =
            new PdfListItem('PDF');
        const expectedPen: PdfPen =
            new PdfPen(
                { r: 15, g: 25, b: 35 },
                2
            );
        // Act
        item.pen = expectedPen;
        const actualPen: PdfPen = item.pen;
        // Assert
        expect(actualPen).toBe(expectedPen);
        expect(item._pen).toBe(expectedPen);
    });
    it('assigns and returns font', () => {
        // Arrange
        const item: PdfListItem =
            new PdfListItem('PDF');
        const expectedFont: PdfFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                16
            );
        // Act
        item.font = expectedFont;
        const actualFont: PdfFont = item.font;
        // Assert
        expect(actualFont).toBe(expectedFont);
        expect(item._font).toBe(expectedFont);
    });
    it('assigns and returns string format', () => {
        // Arrange
        const item: PdfListItem =
            new PdfListItem('PDF');
        const expectedFormat: PdfStringFormat =
            new PdfStringFormat();
        // Act
        item.stringFormat = expectedFormat;
        const actualFormat: PdfStringFormat =
            item.stringFormat;
        // Assert
        expect(actualFormat).toBe(expectedFormat);
        expect(item._stringFormat).toBe(expectedFormat);
    });
    it('assigns and returns text', () => {
        // Arrange
        const item: PdfListItem =
            new PdfListItem('Initial');
        const expectedText: string = 'Updated';
        // Act
        item.text = expectedText;
        const actualText: string = item.text;
        // Assert
        expect(actualText).toBe(expectedText);
        expect(item._text).toBe(expectedText);
    });
    it('assigns and returns empty text', () => {
        // Arrange
        const item: PdfListItem =
            new PdfListItem('Initial');
        // Act
        item.text = '';
        const actualText: string = item.text;
        // Assert
        expect(actualText).toBe('');
        expect(item._text).toBe('');
    });
    it('assigns and returns zero text indent', () => {
        // Arrange
        const item: PdfListItem =
            new PdfListItem('PDF');
        // Act
        item.textIndent = 0;
        const actualIndent: number =
            item.textIndent;
        // Assert
        expect(actualIndent).toBe(0);
        expect(item._textIndent).toBe(0);
    });
    it('assigns and returns positive text indent', () => {
        // Arrange
        const item: PdfListItem =
            new PdfListItem('PDF');
        const expectedIndent: number = 40;
        // Act
        item.textIndent = expectedIndent;
        const actualIndent: number =
            item.textIndent;
        // Assert
        expect(actualIndent).toBe(expectedIndent);
        expect(item._textIndent).toBe(expectedIndent);
    });
    it('assigns and returns negative text indent', () => {
        // Arrange
        const item: PdfListItem =
            new PdfListItem('PDF');
        const expectedIndent: number = -10;
        // Act
        item.textIndent = expectedIndent;
        const actualIndent: number =
            item.textIndent;
        // Assert
        expect(actualIndent).toBe(expectedIndent);
        expect(item._textIndent).toBe(expectedIndent);
    });
    it('assigns and returns sub list', () => {
        // Arrange
        const item: PdfListItem =
            new PdfListItem('PDF');
        const subListItems: PdfListItemCollection =
            new PdfListItemCollection([
                'Sub item'
            ]);
        const expectedSubList: PdfOrderedList =
            new PdfOrderedList(subListItems);
        // Act
        item.subList = expectedSubList;
        const actualSubList: PdfOrderedList =
            item.subList as PdfOrderedList;
        // Assert
        expect(actualSubList).toBe(expectedSubList);
        expect(item._subList).toBe(expectedSubList);
        expect(actualSubList.items.count).toBe(1);
    });
});
describe('constructor and count', () => {
    it('initializes an empty collection', () => {
        // Arrange and Act
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        // Assert
        expect(collection._listItems).toBeDefined();
        expect(collection._listItems.length).toBe(0);
        expect(collection.count).toBe(0);
    });
    it('creates list items from every supplied string', () => {
        // Arrange
        const sourceItems: string[] = [
            'Excel',
            'PowerPoint',
            'Word'
        ];
        // Act
        const collection: PdfListItemCollection =
            new PdfListItemCollection(sourceItems);
        // Assert
        expect(collection.count).toBe(3);
        expect(collection._listItems.length).toBe(3);
        expect(collection.at(0).text).toBe('Excel');
        expect(collection.at(1).text).toBe(
            'PowerPoint'
        );
        expect(collection.at(2).text).toBe('Word');
    });
    it('initializes an empty collection for an empty string array', () => {
        // Arrange
        const sourceItems: string[] = [];
        // Act
        const collection: PdfListItemCollection =
            new PdfListItemCollection(sourceItems);
        // Assert
        expect(collection._listItems).toBeDefined();
        expect(collection._listItems.length).toBe(0);
        expect(collection.count).toBe(0);
    });
    it('returns the current count after adding an item', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        const item: PdfListItem =
            new PdfListItem('PDF');
        // Act
        collection.add(item);
        const actualCount: number =
            collection.count;
        // Assert
        expect(actualCount).toBe(1);
        expect(collection._listItems.length).toBe(1);
        expect(collection._listItems[0]).toBe(item);
    });
});
describe('add', () => {
    it('adds the exact supplied item', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        const expectedItem: PdfListItem =
            new PdfListItem('PDF');
        // Act
        collection.add(expectedItem);
        // Assert
        expect(collection.count).toBe(1);
        expect(collection.at(0)).toBe(expectedItem);
        expect(collection._listItems[0]).toBe(
            expectedItem
        );
    });
    it('adds the item and assigns the supplied indent', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        const expectedItem: PdfListItem =
            new PdfListItem('PDF');
        const expectedIndent: number = 40;
        // Act
        collection.add(
            expectedItem,
            expectedIndent
        );
        // Assert
        expect(collection.count).toBe(1);
        expect(collection.at(0)).toBe(expectedItem);
        expect(
            collection.at(0).textIndent
        ).toBe(expectedIndent);
        expect(expectedItem.textIndent).toBe(
            expectedIndent
        );
    });
    it('does not replace the existing indent when zero is supplied', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        const expectedItem: PdfListItem =
            new PdfListItem('PDF');
        expectedItem.textIndent = 25;
        // Act
        collection.add(expectedItem, 0);
        // Assert
        expect(collection.count).toBe(1);
        expect(collection.at(0)).toBe(expectedItem);
        expect(
            collection.at(0).textIndent
        ).toBe(25);
    });
    it('does not replace the existing indent when indent is omitted', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        const expectedItem: PdfListItem =
            new PdfListItem('PDF');
        expectedItem.textIndent = 20;
        // Act
        collection.add(expectedItem);
        // Assert
        expect(collection.count).toBe(1);
        expect(collection.at(0)).toBe(expectedItem);
        expect(
            collection.at(0).textIndent
        ).toBe(20);
    });
    it('throws the exact error when item is null', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        const nullItem: PdfListItem =
            null as unknown as PdfListItem;
        // Act
        const addItem: () => void = (): void => {
            collection.add(nullItem);
        };
        // Assert
        expect(addItem).toThrowError(
            Error,
            'item should not be null'
        );
        expect(collection.count).toBe(0);
        expect(collection._listItems.length).toBe(0);
    });
    it('throws the exact error when item is undefined', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        const undefinedItem: PdfListItem =
            undefined as unknown as PdfListItem;
        // Act
        const addItem: () => void = (): void => {
            collection.add(undefinedItem);
        };
        // Assert
        expect(addItem).toThrowError(
            Error,
            'item should not be null'
        );
        expect(collection.count).toBe(0);
        expect(collection._listItems.length).toBe(0);
    });
});
describe('at', () => {
    it('returns the item at the specified index', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection([
                'PDF',
                'Word'
            ]);
        // Act
        const actualItem: PdfListItem =
            collection.at(1);
        // Assert
        expect(actualItem).toBe(
            collection._listItems[1]
        );
        expect(actualItem.text).toBe('Word');
    });
    it('returns the first item at index zero', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection([
                'PDF',
                'Word'
            ]);
        // Act
        const actualItem: PdfListItem =
            collection.at(0);
        // Assert
        expect(actualItem).toBe(
            collection._listItems[0]
        );
        expect(actualItem.text).toBe('PDF');
    });
    it('throws the exact error when index is null', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['PDF']);
        const nullIndex: number =
            null as unknown as number;
        // Act
        const getItem: () => PdfListItem =
            (): PdfListItem => {
                return collection.at(nullIndex);
            };
        // Assert
        expect(getItem).toThrowError(
            Error,
            'index should not be null'
        );
    });
});
describe('remove', () => {
    it('throws the exact error when item is null', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['PDF']);
        const nullItem: PdfListItem =
            null as unknown as PdfListItem;
        // Act
        const removeItem: () => void = (): void => {
            collection.remove(nullItem);
        };
        // Assert
        expect(removeItem).toThrowError(
            Error,
            'item should not be null'
        );
        expect(collection.count).toBe(1);
        expect(collection.at(0).text).toBe('PDF');
    });
    it('throws the exact error when item is undefined', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['PDF']);
        const undefinedItem: PdfListItem =
            undefined as unknown as PdfListItem;
        // Act
        const removeItem: () => void = (): void => {
            collection.remove(undefinedItem);
        };
        // Assert
        expect(removeItem).toThrowError(
            Error,
            'item should not be null'
        );
        expect(collection.count).toBe(1);
        expect(collection.at(0).text).toBe('PDF');
    });
    it('removes the first item and preserves remaining order', () => {
        // Arrange
        const firstItem: PdfListItem =
            new PdfListItem('PDF');
        const secondItem: PdfListItem =
            new PdfListItem('Word');
        const thirdItem: PdfListItem =
            new PdfListItem('Excel');
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        collection.add(firstItem);
        collection.add(secondItem);
        collection.add(thirdItem);
        // Act
        collection.remove(firstItem);
        // Assert
        expect(collection.count).toBe(2);
        expect(collection.at(0)).toBe(secondItem);
        expect(collection.at(1)).toBe(thirdItem);
        expect(collection.indexOf(firstItem)).toBe(-1);
    });
    it('removes an item from the middle of the collection', () => {
        // Arrange
        const firstItem: PdfListItem =
            new PdfListItem('PDF');
        const middleItem: PdfListItem =
            new PdfListItem('Word');
        const lastItem: PdfListItem =
            new PdfListItem('Excel');
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        collection.add(firstItem);
        collection.add(middleItem);
        collection.add(lastItem);
        // Act
        collection.remove(middleItem);
        // Assert
        expect(collection.count).toBe(2);
        expect(collection.at(0)).toBe(firstItem);
        expect(collection.at(1)).toBe(lastItem);
        expect(collection.indexOf(middleItem)).toBe(-1);
    });
    it('removes the last item in the collection', () => {
        // Arrange
        const firstItem: PdfListItem =
            new PdfListItem('PDF');
        const lastItem: PdfListItem =
            new PdfListItem('Word');
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        collection.add(firstItem);
        collection.add(lastItem);
        // Act
        collection.remove(lastItem);
        // Assert
        expect(collection.count).toBe(1);
        expect(collection.at(0)).toBe(firstItem);
        expect(collection.indexOf(lastItem)).toBe(-1);
    });
    it('removes the only item in the collection', () => {
        // Arrange
        const expectedItem: PdfListItem =
            new PdfListItem('PDF');
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        collection.add(expectedItem);
        // Act
        collection.remove(expectedItem);
        // Assert
        expect(collection.count).toBe(0);
        expect(collection._listItems.length).toBe(0);
        expect(collection.indexOf(expectedItem)).toBe(-1);
    });
    it('throws the exact error when item is not in the collection', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['PDF']);
        const missingItem: PdfListItem =
            new PdfListItem('Missing');
        // Act
        const removeItem: () => void = (): void => {
            collection.remove(missingItem);
        };
        // Assert
        expect(removeItem).toThrowError(
            Error,
            'item collection does not contain the given content'
        );
        expect(collection.count).toBe(1);
        expect(collection.at(0).text).toBe('PDF');
    });
});
describe('removeAt', () => {
    it('removes the first item at index zero', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection([
                'PDF',
                'Word'
            ]);
        // Act
        collection.removeAt(0);
        // Assert
        expect(collection.count).toBe(1);
        expect(collection.at(0).text).toBe('Word');
    });
    it('removes an item from the middle index', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection([
                'PDF',
                'Word',
                'Excel'
            ]);
        // Act
        collection.removeAt(1);
        // Assert
        expect(collection.count).toBe(2);
        expect(collection.at(0).text).toBe('PDF');
        expect(collection.at(1).text).toBe('Excel');
    });
    it('removes the last valid item', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection([
                'PDF',
                'Word'
            ]);
        // Act
        collection.removeAt(
            collection.count - 1
        );
        // Assert
        expect(collection.count).toBe(1);
        expect(collection.at(0).text).toBe('PDF');
    });
    it('throws the exact error for a negative index', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['PDF']);
        // Act
        const removeItem: () => void = (): void => {
            collection.removeAt(-1);
        };
        // Assert
        expect(removeItem).toThrowError(
            Error,
            'The index should be less than items count or equal to 0'
        );
        expect(collection.count).toBe(1);
    });
    it('throws when index equals the collection count', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['PDF']);
        const invalidIndex: number =
            collection.count;
        // Act
        const removeItem: () => void = (): void => {
            collection.removeAt(invalidIndex);
        };
        // Assert
        expect(removeItem).toThrowError(
            Error,
            'The index should be less than items count or equal to 0'
        );
        expect(collection.count).toBe(1);
    });
    it('throws when index is greater than the collection count', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['PDF']);
        const invalidIndex: number =
            collection.count + 1;
        // Act
        const removeItem: () => void = (): void => {
            collection.removeAt(invalidIndex);
        };
        // Assert
        expect(removeItem).toThrowError(
            Error,
            'The index should be less than items count or equal to 0'
        );
        expect(collection.count).toBe(1);
    });
    it('throws when removing index zero from an empty collection', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        // Act
        const removeItem: () => void = (): void => {
            collection.removeAt(0);
        };
        // Assert
        expect(removeItem).toThrowError(
            Error,
            'The index should be less than items count or equal to 0'
        );
        expect(collection.count).toBe(0);
    });
});
describe('clear', () => {
    it('removes every item from the collection', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection([
                'PDF',
                'Word',
                'Excel'
            ]);
        // Act
        collection.clear();
        // Assert
        expect(collection.count).toBe(0);
        expect(collection._listItems.length).toBe(0);
    });
    it('keeps an empty collection empty', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        // Act
        collection.clear();
        // Assert
        expect(collection.count).toBe(0);
        expect(collection._listItems.length).toBe(0);
    });
});
describe('insert', () => {
    it('inserts an item at index zero', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['Word']);
        const expectedItem: PdfListItem =
            new PdfListItem('PDF');
        // Act
        collection.insert(
            0,
            expectedItem,
            20
        );
        // Assert
        expect(collection.count).toBe(2);
        expect(collection.at(0)).toBe(expectedItem);
        expect(
            collection.at(0).textIndent
        ).toBe(20);
        expect(collection.at(1).text).toBe('Word');
    });
    it('inserts an item in the middle of the collection', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection([
                'PDF',
                'Excel'
            ]);
        const expectedItem: PdfListItem =
            new PdfListItem('Word');
        // Act
        collection.insert(
            1,
            expectedItem,
            25
        );
        // Assert
        expect(collection.count).toBe(3);
        expect(collection.at(0).text).toBe('PDF');
        expect(collection.at(1)).toBe(expectedItem);
        expect(collection.at(1).text).toBe('Word');
        expect(collection.at(1).textIndent).toBe(25);
        expect(collection.at(2).text).toBe('Excel');
    });
    it('inserts an item at the collection-count boundary', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['PDF']);
        const expectedItem: PdfListItem =
            new PdfListItem('Word');
        const insertionIndex: number =
            collection.count;
        // Act
        collection.insert(
            insertionIndex,
            expectedItem,
            30
        );
        // Assert
        expect(collection.count).toBe(2);
        expect(collection.at(0).text).toBe('PDF');
        expect(collection.at(1)).toBe(expectedItem);
        expect(
            collection.at(1).textIndent
        ).toBe(30);
    });
    it('inserts an item into an empty collection at index zero', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        const expectedItem: PdfListItem =
            new PdfListItem('PDF');
        // Act
        collection.insert(
            0,
            expectedItem,
            15
        );
        // Assert
        expect(collection.count).toBe(1);
        expect(collection.at(0)).toBe(expectedItem);
        expect(collection.at(0).textIndent).toBe(15);
    });
    it('throws the exact error for a negative index', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['PDF']);
        const expectedItem: PdfListItem =
            new PdfListItem('Word');
        // Act
        const insertItem: () => void = (): void => {
            collection.insert(
                -1,
                expectedItem,
                10
            );
        };
        // Assert
        expect(insertItem).toThrowError(
            Error,
            'Index should be within the range of items count (inclusive).'
        );
        expect(collection.count).toBe(1);
        expect(collection.at(0).text).toBe('PDF');
    });
    it('throws when index is greater than the collection count', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['PDF']);
        const expectedItem: PdfListItem =
            new PdfListItem('Word');
        const invalidIndex: number =
            collection.count + 1;
        // Act
        const insertItem: () => void = (): void => {
            collection.insert(
                invalidIndex,
                expectedItem,
                10
            );
        };
        // Assert
        expect(insertItem).toThrowError(
            Error,
            'Index should be within the range of items count (inclusive).'
        );
        expect(collection.count).toBe(1);
        expect(collection.at(0).text).toBe('PDF');
    });
    it('throws the exact error when item is null', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['PDF']);
        const nullItem: PdfListItem =
            null as unknown as PdfListItem;
        // Act
        const insertItem: () => void = (): void => {
            collection.insert(
                0,
                nullItem,
                10
            );
        };
        // Assert
        expect(insertItem).toThrowError(
            Error,
            'Item cannot be null.'
        );
        expect(collection.count).toBe(1);
        expect(collection.at(0).text).toBe('PDF');
    });
    it('throws the exact error when item is undefined', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['PDF']);
        const undefinedItem: PdfListItem =
            undefined as unknown as PdfListItem;
        // Act
        const insertItem: () => void = (): void => {
            collection.insert(
                0,
                undefinedItem,
                10
            );
        };
        // Assert
        expect(insertItem).toThrowError(
            Error,
            'Item cannot be null.'
        );
        expect(collection.count).toBe(1);
        expect(collection.at(0).text).toBe('PDF');
    });
    it('preserves existing indent when itemIndent is zero', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['PDF']);
        const expectedItem: PdfListItem =
            new PdfListItem('Word');
        expectedItem.textIndent = 35;
        // Act
        collection.insert(
            0,
            expectedItem,
            0
        );
        // Assert
        expect(collection.count).toBe(2);
        expect(collection.at(0)).toBe(expectedItem);
        expect(
            collection.at(0).textIndent
        ).toBe(35);
        expect(collection.at(1).text).toBe('PDF');
    });
    it('updates item indent when itemIndent is non-zero', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['PDF']);
        const expectedItem: PdfListItem =
            new PdfListItem('Word');
        expectedItem.textIndent = 5;
        // Act
        collection.insert(
            1,
            expectedItem,
            45
        );
        // Assert
        expect(collection.count).toBe(2);
        expect(collection.at(1)).toBe(expectedItem);
        expect(
            collection.at(1).textIndent
        ).toBe(45);
    });
});
describe('indexOf', () => {
    it('returns the exact index of the first item', () => {
        // Arrange
        const expectedItem: PdfListItem =
            new PdfListItem('PDF');
        const secondItem: PdfListItem =
            new PdfListItem('Word');
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        collection.add(expectedItem);
        collection.add(secondItem);
        // Act
        const actualIndex: number =
            collection.indexOf(expectedItem);
        // Assert
        expect(actualIndex).toBe(0);
        expect(collection.at(actualIndex)).toBe(
            expectedItem
        );
    });
    it('returns the exact index of an existing middle item', () => {
        // Arrange
        const firstItem: PdfListItem =
            new PdfListItem('PDF');
        const expectedItem: PdfListItem =
            new PdfListItem('Word');
        const lastItem: PdfListItem =
            new PdfListItem('Excel');
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        collection.add(firstItem);
        collection.add(expectedItem);
        collection.add(lastItem);
        // Act
        const actualIndex: number =
            collection.indexOf(expectedItem);
        // Assert
        expect(actualIndex).toBe(1);
        expect(collection.at(actualIndex)).toBe(
            expectedItem
        );
    });
    it('returns the exact index of the last item', () => {
        // Arrange
        const firstItem: PdfListItem =
            new PdfListItem('PDF');
        const expectedItem: PdfListItem =
            new PdfListItem('Word');
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        collection.add(firstItem);
        collection.add(expectedItem);
        // Act
        const actualIndex: number =
            collection.indexOf(expectedItem);
        // Assert
        expect(actualIndex).toBe(1);
        expect(collection.at(actualIndex)).toBe(
            expectedItem
        );
    });
    it('returns minus one when the item is not present', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['PDF']);
        const missingItem: PdfListItem =
            new PdfListItem('Missing');
        // Act
        const actualIndex: number =
            collection.indexOf(missingItem);
        // Assert
        expect(actualIndex).toBe(-1);
        expect(collection.count).toBe(1);
        expect(collection.at(0).text).toBe('PDF');
    });
    it('throws the exact error when item is null', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['PDF']);
        const nullItem: PdfListItem =
            null as unknown as PdfListItem;
        // Act
        const findItem: () => number =
            (): number => {
                return collection.indexOf(nullItem);
            };
        // Assert
        expect(findItem).toThrowError(
            Error,
            'Item should be defined.'
        );
    });
    it('throws the exact error when item is undefined', () => {
        // Arrange
        const collection: PdfListItemCollection =
            new PdfListItemCollection(['PDF']);
        const undefinedItem: PdfListItem =
            undefined as unknown as PdfListItem;
        // Act
        const findItem: () => number =
            (): number => {
                return collection.indexOf(
                    undefinedItem
                );
            };
        // Assert
        expect(findItem).toThrowError(
            Error,
            'Item should be defined.'
        );
    });
});
describe('PdfListItem constructor survived mutants', () => {
    it('kills true mutant for settings font condition', () => {
        // Arrange
        const conditionFont: PdfFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            10
        );
        const assignedFont: PdfFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            20
        );
        let fontAccessCount: number = 0;
        const settings: {
            font?: PdfFont;
            format?: PdfStringFormat;
            brush?: PdfBrush;
            pen?: PdfPen;
        } = {
            get font(): PdfFont {
                fontAccessCount++;
                if (fontAccessCount === 1) {
                    return conditionFont;
                }
                return assignedFont;
            }
        };
        // Act
        const item: PdfListItem = new PdfListItem(
            'PDF',
            settings
        );
        // Assert
        expect(fontAccessCount).toBe(2);
        expect(item.font).toBe(assignedFont);
        expect(item._font).toBe(assignedFont);
        expect(item.font).not.toBe(conditionFont);
    });
    it('kills true mutant for settings format condition', () => {
        // Arrange
        const conditionFormat: PdfStringFormat =
            new PdfStringFormat();
        const assignedFormat: PdfStringFormat =
            new PdfStringFormat();
        let formatAccessCount: number = 0;
        const settings: {
            font?: PdfFont;
            format?: PdfStringFormat;
            brush?: PdfBrush;
            pen?: PdfPen;
        } = {
            get format(): PdfStringFormat {
                formatAccessCount++;
                if (formatAccessCount === 1) {
                    return conditionFormat;
                }
                return assignedFormat;
            }
        };
        // Act
        const item: PdfListItem = new PdfListItem(
            'PDF',
            settings
        );
        // Assert
        expect(formatAccessCount).toBe(2);
        expect(item.stringFormat).toBe(assignedFormat);
        expect(item._stringFormat).toBe(assignedFormat);
        expect(item.stringFormat).not.toBe(conditionFormat);
    });
    it('kills true mutant for settings pen condition', () => {
        // Arrange
        const conditionPen: PdfPen = new PdfPen(
            { r: 10, g: 20, b: 30 },
            1
        );
        const assignedPen: PdfPen = new PdfPen(
            { r: 40, g: 50, b: 60 },
            2
        );
        let penAccessCount: number = 0;
        const settings: {
            font?: PdfFont;
            format?: PdfStringFormat;
            brush?: PdfBrush;
            pen?: PdfPen;
        } = {
            get pen(): PdfPen {
                penAccessCount++;
                if (penAccessCount === 1) {
                    return conditionPen;
                }
                return assignedPen;
            }
        };
        // Act
        const item: PdfListItem = new PdfListItem(
            'PDF',
            settings
        );
        // Assert
        expect(penAccessCount).toBe(2);
        expect(item.pen).toBe(assignedPen);
        expect(item._pen).toBe(assignedPen);
        expect(item.pen).not.toBe(conditionPen);
    });
    it('kills true mutant for settings brush condition', () => {
        // Arrange
        const conditionBrush: PdfBrush = new PdfBrush({
            r: 10,
            g: 20,
            b: 30
        });
        const assignedBrush: PdfBrush = new PdfBrush({
            r: 40,
            g: 50,
            b: 60
        });
        let brushAccessCount: number = 0;
        const settings: {
            font?: PdfFont;
            format?: PdfStringFormat;
            brush?: PdfBrush;
            pen?: PdfPen;
        } = {
            get brush(): PdfBrush {
                brushAccessCount++;
                if (brushAccessCount === 1) {
                    return conditionBrush;
                }
                return assignedBrush;
            }
        };
        // Act
        const item: PdfListItem = new PdfListItem(
            'PDF',
            settings
        );
        // Assert
        expect(brushAccessCount).toBe(2);
        expect(item.brush).toBe(assignedBrush);
        expect(item._brush).toBe(assignedBrush);
        expect(item.brush).not.toBe(conditionBrush);
    });
});
describe('PdfListItemCollection constructor survived mutant', () => {
    it('kills true mutant for list items initialization condition', () => {
        // Arrange
        const inheritedItem: PdfListItem =
            new PdfListItem('Inherited item');
        const inheritedItems: PdfListItem[] = [
            inheritedItem
        ];
        const collectionPrototype: PdfListItemCollection =
            PdfListItemCollection.prototype;
        const originalDescriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                collectionPrototype,
                '_listItems'
            );
        let constructorItems: PdfListItem[] =
            inheritedItems;
        Object.defineProperty(
            collectionPrototype,
            '_listItems',
            {
                configurable: true,
                get: function (): PdfListItem[] {
                    return constructorItems;
                },
                set: function (
                    value: PdfListItem[]
                ): void {
                    if (typeof value !== 'undefined') {
                        constructorItems = value;
                    }
                }
            }
        );
        // Act
        const collection: PdfListItemCollection =
            new PdfListItemCollection();
        const actualItems: PdfListItem[] =
            constructorItems;
        if (typeof originalDescriptor !== 'undefined') {
            Object.defineProperty(
                collectionPrototype,
                '_listItems',
                originalDescriptor
            );
        } else {
            delete collectionPrototype._listItems;
        }
        collection._listItems = actualItems;
        // Assert
        expect(collection._listItems).toBe(
            inheritedItems
        );
        expect(collection._listItems.length).toBe(1);
        expect(collection.count).toBe(1);
        expect(collection.at(0)).toBe(inheritedItem);
        expect(collection.at(0).text).toBe(
            'Inherited item'
        );
    });
});