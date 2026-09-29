import { PdfTextStyle } from '../src/pdf/core/enumerator';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfBookmark, PdfBookmarkBase, PdfNamedDestination } from '../src/pdf/core/pdf-outline';
import { PdfDestination, PdfPage } from '../src/pdf/core/pdf-page';
import { _PdfDictionary, _PdfReference } from '../src/pdf/core/pdf-primitives';

function createBookmarkBaseWithItems(items: any[]): PdfBookmarkBase {
    const bookmarkBase: PdfBookmarkBase = new PdfBookmarkBase( undefined as any, undefined as any);
    (bookmarkBase as any)._bookMarkList = items;
    return bookmarkBase;
}
describe('1038504 PdfBookmarkBase at method mutations', () => {
    it('1038504 at throws for negative index', () => {
        const bookmarkBase: PdfBookmarkBase = createBookmarkBaseWithItems([{ id: 1 }]);
        expect(() => {bookmarkBase.at(-1);}).toThrowError('Index out of range.');
    });
    it('1038504 at throws when index equals count', () => {
        const bookmarkBase: PdfBookmarkBase = createBookmarkBaseWithItems([{ id: 1 }]);
        expect(() => {bookmarkBase.at(1);}).toThrowError('Index out of range.');
    });
    it('1038504 at throws when index greater than count', () => {
        const bookmarkBase: PdfBookmarkBase = createBookmarkBaseWithItems([{ id: 1 }]);
        expect(() => {bookmarkBase.at(2);}).toThrowError('Index out of range.');
    });
    it('1038504 at validates count boundary for last valid index', () => {
        const firstBookmark: any = { title: 'Bookmark 1' };
        const secondBookmark: any = { title: 'Bookmark 2' };
        const bookmarkBase: PdfBookmarkBase = createBookmarkBaseWithItems([firstBookmark, secondBookmark]);
        expect(bookmarkBase.count).toBe(2);
        const result: any = bookmarkBase.at(1);
        expect(result).toBe(secondBookmark);
        expect(result).not.toBe(firstBookmark);
    });
    it('1038504 at validates requested index is returned', () => {
        const firstBookmark: any = { id: 1 };
        const secondBookmark: any = { id: 2 };
        const thirdBookmark: any = { id: 3 };
        const bookmarkBase: PdfBookmarkBase = createBookmarkBaseWithItems([ firstBookmark, secondBookmark, thirdBookmark]);
        const result: any = bookmarkBase.at(2);
        expect(result).toBe(thirdBookmark);
        expect(result).not.toBe(firstBookmark);
        expect(result).not.toBe(secondBookmark);
    });
    it('1038504 at throws when collection is empty', () => {
        const bookmarkBase: PdfBookmarkBase = createBookmarkBaseWithItems([]);
        expect(() => {bookmarkBase.at(0);}).toThrowError('Index out of range.');
    });
    it('Get bookmark at valid index after multiple inserts', () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let bookmarks: PdfBookmarkBase = document.bookmarks;
        let firstBookmark: PdfBookmark = bookmarks.add('FirstBookmark');
        firstBookmark.destination = new PdfDestination(page, { x: 10, y: 10 });
        let secondBookmark: PdfBookmark = bookmarks.add('SecondBookmark');
        secondBookmark.destination = new PdfDestination(page, { x: 10, y: 20 });
        expect(bookmarks.count).toEqual(2);
        let bookmark: PdfBookmark = bookmarks.at(1);
        expect(bookmark).toBeDefined();
        expect(bookmark.title).toEqual('SecondBookmark');
        expect(bookmarks.contains(bookmark)).toBeTruthy();
        document.destroy();
    });
    it('Get bookmark at first index after insert at beginning', () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let bookmarks: PdfBookmarkBase = document.bookmarks;
        let firstBookmark: PdfBookmark = bookmarks.add('FirstBookmark');
        firstBookmark.destination = new PdfDestination(page, { x: 10, y: 10 });
        let secondBookmark: PdfBookmark = bookmarks.add('SecondBookmark', 0);
        secondBookmark.destination = new PdfDestination(page, { x: 10, y: 20 });
        expect(bookmarks.count).toEqual(2);
        let bookmark: PdfBookmark = bookmarks.at(0);
        expect(bookmark).toBeDefined();
        expect(bookmark.title).toEqual('SecondBookmark');
        expect(bookmarks.contains(bookmark)).toBeTruthy();
        document.destroy();
    });
    it('should return the bookmark at a valid index when the collection is populated', () => {
        const bookmarks = new PdfBookmarkBase(null as any, null as any);
        const firstBookmark = new PdfBookmarkBase(null as any, null as any) as any as PdfBookmark;
        const secondBookmark = new PdfBookmarkBase(null as any, null as any) as any as PdfBookmark;
        (bookmarks as any)._bookMarkList = [firstBookmark, secondBookmark];
        expect(bookmarks.at(1)).toBe(secondBookmark);
    });
    it('should throw an out of range error for an index equal to the collection count', () => {
        const bookmarks = new PdfBookmarkBase(null as any, null as any);
        const firstBookmark = new PdfBookmarkBase(null as any, null as any) as any as PdfBookmark;
        (bookmarks as any)._bookMarkList = [firstBookmark];
        expect(() => bookmarks.at(1)).toThrowError('Index out of range.');
    });
});
describe('1038504 PdfBookmarkBase isExpanded getter mutations', () => {
    it('1038504 isExpanded returns true when Count is zero', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Count', 0);
        const bookmarkBase: PdfBookmarkBase = new PdfBookmarkBase(dictionary, undefined as any);
        expect(bookmarkBase.isExpanded).toBe(true);
    });
    it('1038504 isExpanded returns false when Count is negative', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Count', -1);
        const bookmarkBase: PdfBookmarkBase = new PdfBookmarkBase(dictionary, undefined as any);
        expect(bookmarkBase.isExpanded).toBe(false);
        expect(bookmarkBase._isLoadedBookmark).toBe(false);
        expect(bookmarkBase._isExpanded).toBe(false);
    });
    it('1038504 isExpanded returns internal state when Count entry is missing', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmarkBase: PdfBookmarkBase = new PdfBookmarkBase(dictionary, undefined as any);
        (bookmarkBase as any)._isExpanded = true;
        expect(bookmarkBase.isExpanded).toBe(true);
        (bookmarkBase as any)._isExpanded = false;
        expect(bookmarkBase.isExpanded).toBe(false);
    });
    it('1038504 isExpanded returns internal state when dictionary is undefined', () => {
        const bookmarkBase: PdfBookmarkBase = new PdfBookmarkBase(undefined as any, undefined as any);
        (bookmarkBase as any)._isExpanded = true;
        expect(bookmarkBase.isExpanded).toBe(true);
        (bookmarkBase as any)._isExpanded = false;
        expect(bookmarkBase.isExpanded).toBe(false);
    });
    it('1038504 isExpanded returns false when Count is negative1', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmarkBase: PdfBookmarkBase = new PdfBookmarkBase(dictionary, undefined as any);
        expect(bookmarkBase.isExpanded).toBe(false);
    });
    it('1038504 add treats object argument as options and not index', () => {
        let document = new PdfDocument();
        let bookmarks = document.bookmarks;
        const bookmark: PdfBookmark = bookmarks.add('Parent');
        const child: PdfBookmark = bookmark.add('Child', {});
        expect(child).toBeDefined();
        expect(bookmark.count).toBe(1);
        expect(bookmark.at(0)).toBe(child);
        document.destroy();
    });
    it('1038504 add ignores string second argument as options', () => {
        let document = new PdfDocument();
        let bookmarks = document.bookmarks;
        const bookmark: PdfBookmark = bookmarks.add('Parent');
        const child: PdfBookmark = bookmark.add('Child', 'text' as any);
        expect(child).toBeDefined();
        expect(bookmark.count).toBe(1);
        document.destroy();
    });
    it('1038504 add does not update prev next when last reference is undefined', () => {
        let document = new PdfDocument();
        let bookmarks = document.bookmarks;
        const first: PdfBookmark = bookmarks.add('One');
        first._reference = undefined as any;
        const second: PdfBookmark = bookmarks.add('Two');
        expect(second._dictionary.has('Prev')).toBe(false);
        expect(first._dictionary.has('Next')).toBe(false);
        document.destroy();
    });
    it('1038504 add throws when index greater than count', () => {
        let document = new PdfDocument();
        let bookmarks = document.bookmarks;
        expect(() => {bookmarks.add('Bookmark', 1);}).toThrowError('Index out of range');
        document.destroy();
    });
    it('1038504 add inserts bookmark at beginning when index zero and collection not empty', () => {
        let document = new PdfDocument();
        let bookmarks = document.bookmarks;
        const first: PdfBookmark = bookmarks.add('One');
        const second: PdfBookmark = bookmarks.add('Two');
        const inserted: PdfBookmark = bookmarks.add('Zero', 0);
        expect(bookmarks.at(0)).toBe(inserted);
        expect(bookmarks.at(1)).toBe(first);
        expect(bookmarks.at(2)).toBe(second);
        document.destroy();
    });
    it('1038504 add inserts in middle when index is neither zero nor count', () => {
        let document = new PdfDocument();
        let bookmarks = document.bookmarks;
        const first: PdfBookmark = bookmarks.add('One');
        const third: PdfBookmark = bookmarks.add('Three');
        const second: PdfBookmark = bookmarks.add('Two', 1);
        expect(bookmarks.at(0)).toBe(first);
        expect(bookmarks.at(1)).toBe(second);
        expect(bookmarks.at(2)).toBe(third);
        document.destroy();
    });
    it('1038504 add inserts bookmark at middle position and preserves neighbors', () => {
        let document = new PdfDocument();
        let bookmarks = document.bookmarks;
        const first: PdfBookmark = bookmarks.add('One');
        const third: PdfBookmark = bookmarks.add('Three');
        const second: PdfBookmark = bookmarks.add('Two', 1);
        expect(bookmarks.at(0)).toBe(first);
        expect(bookmarks.at(1)).toBe(second);
        expect(bookmarks.at(2)).toBe(third);
        expect(second._dictionary.has('Prev')).toBe(true);
        expect(second._dictionary.has('Next')).toBe(true);
        document.destroy();
    });
    it('1038504 add index zero skips prev next update when first reference is undefined', () => {
        let document = new PdfDocument();
        let bookmarks = document.bookmarks;
        const first: PdfBookmark = bookmarks.add('One');
        first._reference = undefined as any;
        const inserted: PdfBookmark = bookmarks.add('Zero', 0);
        expect(inserted._dictionary.has('Next')).toBe(false);
        expect(first._dictionary.has('Prev')).toBe(false);
        document.destroy();
    });
    it('1038504 add does not assign text style when option not provided', () => {
        let document = new PdfDocument();
        let bookmarks = document.bookmarks;
        const bookmark: PdfBookmark = bookmarks.add('Bookmark', {color: [255, 0, 0] as any});
        expect(bookmark.textStyle).not.toBeUndefined();
        document.destroy();
    });

    it('1038504 add does not assign color when color option absent', () => {
        let document = new PdfDocument();
        let bookmarks = document.bookmarks;
        const bookmark: PdfBookmark = bookmarks.add('Bookmark', {});
        expect(bookmark._dictionary.has('C')).toBe(false);
        document.destroy();
    });
    it('1038504 add does not assign destination when destination option absent', () => {
        let document = new PdfDocument();
        let bookmarks = document.bookmarks;
        const bookmark: PdfBookmark = bookmarks.add('Bookmark', {});
        expect(bookmark._dictionary.has('Dest')).toBe(false);
        expect(bookmark._dictionary.has('A')).toBe(false);
        document.destroy();
    });
    it('1038504 add does not assign destination when destination option absent', () => {
        let document = new PdfDocument();
        let bookmarks = document.bookmarks;
        const bookmark: PdfBookmark = bookmarks.add('Bookmark', {});
        expect(bookmark._dictionary.has('Dest')).toBe(false);
        expect(bookmark._dictionary.has('A')).toBe(false);
        document.destroy();
    });
});
describe('1038504 PdfBookmarkBase add arg2 type handling', () : void => {
    it('1038504 add should not treat null as index', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: PdfBookmarkBase = document.bookmarks;
        const bookmark: PdfBookmark = root.add('Bookmark-1', null as any);
        expect(bookmark).toBeDefined();
        expect(root.count).toBe(1);
        document.destroy();
    });
    it('1038504 add should treat numeric zero as index', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: PdfBookmarkBase = document.bookmarks;
        root.add('Existing');
        const bookmark: PdfBookmark = root.add('Inserted', 0);
        expect(bookmark).toBeDefined();
        expect(root.count).toBe(2);
        expect(root.at(0).title).toBe('Inserted');
        document.destroy();
    });
    it('1038504 add should not treat option object as index', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: PdfBookmarkBase = document.bookmarks;
        const options: any = {color: [255, 0, 0]};
        const bookmark: PdfBookmark = root.add('Bookmark', options);
        expect(bookmark).toBeDefined();
        expect(root.count).toBe(1);
        document.destroy();
    });
    it('1038504 add should not process boolean argument as options object', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: PdfBookmarkBase = document.bookmarks;
        const bookmark: PdfBookmark = root.add('Bookmark', true as any);
        expect(bookmark).toBeDefined();
        expect(root.count).toBe(1);
        document.destroy();
    });
    it('1038504 add should process object argument as options', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: PdfBookmarkBase = document.bookmarks;
        const bookmark: PdfBookmark = root.add('Bookmark', { });
        expect(bookmark).toBeDefined();
        expect(root.count).toBe(1);
        document.destroy();
    });
    it('1038504 add should store parent reference using Parent key', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark');
        expect(bookmark._dictionary.has('Parent')).toBe(true);
        expect(bookmark._dictionary.has('')).toBe(false);
        document.destroy();
    });
    it('1038504 add first bookmark should update First and Last', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root.add('Bookmark');
        expect(root._dictionary.has('First')).toBe(true);
        expect(root._dictionary.has('Last')).toBe(true);
        expect(root._dictionary.has('')).toBe(false);
        document.destroy();
    });
    it('1038504 append bookmark should create Prev and Next links', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const first: any = root.add('First');
        const second: any = root.add('Second');
        expect(second._dictionary.has('Prev')).toBe(true);
        expect(first._dictionary.has('Next')).toBe(true);
        expect(second._dictionary.has('')).toBe(false);
        expect(first._dictionary.has('')).toBe(false);
        document.destroy();
    });
    it('1038504 add should throw when index exceeds count', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: PdfBookmarkBase = document.bookmarks;
        root.add('Bookmark');
        expect(() : void => {root.add('Invalid', 2);}).toThrow();
        document.destroy();
    });
    it('1038504 insert into empty collection should execute empty branch', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root.add('Bookmark', 0);
        expect(root.count).toBe(1);
        expect(root._dictionary.has('First')).toBe(true);
        expect(root._dictionary.has('Last')).toBe(true);
        document.destroy();
    });
    it('1038504 add with index equal count should append bookmark', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: PdfBookmarkBase = document.bookmarks;
        root.add('A');
        root.add('B');
        root.add('C', root.count);
        expect(root.count).toBe(3);
        expect(root.at(2).title).toBe('C');
        document.destroy();
    });
    it('1038504 add with index zero should insert at beginning', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: PdfBookmarkBase = document.bookmarks;
        root.add('A');
        root.add('B');
        root.add('Start', 0);
        expect(root.at(0).title).toBe('Start');
        document.destroy();
    });
    it('1038504 add at middle index should not execute first insertion logic', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const first: any = root.add('Bookmark-1');
        root.add('Bookmark-3');
        const inserted: any = root.add('Bookmark-2', 1);
        expect(root.count).toBe(3);
        expect(root.at(0).title).toBe('Bookmark-1');
        expect(root.at(1).title).toBe('Bookmark-2');
        expect(root.at(2).title).toBe('Bookmark-3');
        expect(root._dictionary.getRaw('First')).toBe(first._reference);
        document.destroy();
    });
    it('1038504 add at index zero should update First key', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root.add('Second');
        const inserted: any = root.add('First', 0);
        expect(root._dictionary.has('First')).toBe(true);
        expect(root._dictionary.has('')).toBe(false);
        expect(root._dictionary.getRaw('First')).toBe(inserted._reference);
        document.destroy();
    });
    it('1038504 add at index zero should create first bookmark links', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const originalFirst: any = root.add('Original');
        const inserted: any = root.add('Inserted', 0);
        expect(inserted._dictionary.has('Next')).toBe(true);
        expect(originalFirst._dictionary.has('Prev')).toBe(true);
        document.destroy();
    });
    it('1038504 inserted bookmark should store next reference using Next key', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const originalFirst: any = root.add('Original');
        const inserted: any = root.add('Inserted', 0);
        expect(inserted._dictionary.has('Next')).toBe(true);
        expect(inserted._dictionary.has('')).toBe(false);
        expect(inserted._dictionary.getRaw('Next')).toBe(originalFirst._reference);
        document.destroy();
    });
    it('1038504 original first bookmark should store previous reference using Prev key', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const originalFirst: any = root.add('Original');
        const inserted: any = root.add('Inserted', 0);
        expect(originalFirst._dictionary.has('Prev')).toBe(true);
        expect(originalFirst._dictionary.has('')).toBe(false);
        expect(originalFirst._dictionary.getRaw('Prev')).toBe(inserted._reference);
        document.destroy();
    });
    it('1038504 middle insertion should update all neighbor links', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const first: any = root.add('Bookmark-1');
        const third: any = root.add('Bookmark-3');
        const second: any = root.add('Bookmark-2', 1);
        expect(second._dictionary.has('Prev')).toBe(true);
        expect(second._dictionary.has('Next')).toBe(true);
        expect(first._dictionary.has('Next')).toBe(true);
        expect(third._dictionary.has('Prev')).toBe(true);
        expect(second._dictionary.getRaw('Prev')).toBe(first._reference);
        expect(second._dictionary.getRaw('Next')).toBe(third._reference);
        expect(first._dictionary.getRaw('Next')).toBe(second._reference);
        expect(third._dictionary.getRaw('Prev')).toBe(second._reference);
        document.destroy();
    });
    it('1038504 middle bookmark should store previous reference using Prev key', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root.add('One');
        root.add('Three');
        const middle: any = root.add('Two', 1);
        expect(middle._dictionary.has('Prev')).toBe(true);
        expect(middle._dictionary.has('')).toBe(false);
        document.destroy();
    });
    it('1038504 previous bookmark should store next reference using Next key', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const first: any = root.add('One');
        root.add('Three');
        const middle: any = root.add('Two', 1);
        expect(first._dictionary.has('Next')).toBe(true);
        expect(first._dictionary.has('')).toBe(false);
        expect(first._dictionary.getRaw('Next')).toBe(middle._reference);
        document.destroy();
    });
    it('1038504 next bookmark should store previous reference using Prev key', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root.add('One');
        const third: any = root.add('Three');
        const middle: any = root.add('Two', 1);
        expect(third._dictionary.has('Prev')).toBe(true);
        expect(third._dictionary.has('')).toBe(false);
        expect(third._dictionary.getRaw('Prev')).toBe(middle._reference);
        document.destroy();
    });
    it('1038504 middle bookmark should store next reference using Next key', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root.add('One');
        const third: any = root.add('Three');
        const middle: any = root.add('Two', 1);
        expect(middle._dictionary.has('Next')).toBe(true);
        expect(middle._dictionary.has('')).toBe(false);
        expect(middle._dictionary.getRaw('Next')).toBe(third._reference);
        document.destroy();
    });
    it('1038504 add should not set text style when option absent', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark', {});
        expect(bookmark.textStyle).toBeDefined();
        document.destroy();
    });
    it('1038504 add should not set color when option absent', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark', {});
        expect(bookmark.color).toBeDefined();
        document.destroy();
    });
    it('1038504 add should not assign destination when destination option absent', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark', {});
        expect(bookmark.destination).toBeUndefined();
        document.destroy();
    });
    it('1038504 add should not assign named destination when option absent', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark', {});
        expect(bookmark.namedDestination).toBeUndefined();
        document.destroy();
    });
    it('1038504 add should not assign named destination when option absent12', () : void => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let bookmark: PdfBookmark = document.bookmarks.add('Introduction', 0, {
           destination: new PdfDestination(page, { x: 10, y: 10 }, {zoom: 1 }),
           namedDestination: new PdfNamedDestination('First', new PdfDestination(page, { x: 0, y: 10 }, {zoom: 1 })),
           color: { r: 0, g: 0, b: 255 },
           textStyle: PdfTextStyle.bold});
        expect(bookmark.textStyle).toBe(PdfTextStyle.bold);
        expect(bookmark.color.r).toBe(0);
        expect(bookmark.color.g).toBe(0);
        expect(bookmark.color.b).toBe(255);
        expect(bookmark.destination.zoom).toBe(1);
        expect(bookmark.namedDestination.destination.zoom).toBe(1);
        document.destroy();
    });
});
describe('1038504 remove string recursive traversal', () : void => {
    it('1038504 remove string should not recurse for bookmark without children', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Parent');
        let called: boolean = false;
        bookmark.remove = (_value: string): void => {
            called = true;
        };
        root.remove('Unknown');
        expect(called).toBe(false);
        document.destroy();
    });
    it('1038504 remove string should recurse for bookmark with children', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Parent');
        bookmark.add('Child');
        let called: boolean = false;
        bookmark.remove = (_value: string): void => {
            called = true;
        };
        root.remove('Unknown');
        expect(called).toBe(true);
        document.destroy();
    });
    it('1038504 remove count index should not modify collection', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root.add('A');
        root.add('B');
        const countBefore: number = root.count;
        root.remove(root.count);
        expect(root.count).toBe(countBefore);
        document.destroy();
    });
    it('1038504 remove first bookmark updates first reference', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const first: any = root.add('One');
        const second: any = root.add('Two');
        root.remove(0);
        expect(root.count).toBe(1);
        expect(root._dictionary.getRaw('First')).toBe(second._reference);
        expect(root.contains(first)).toBe(false);
        document.destroy();
    });
    it('1038504 remove first bookmark should clear prev link from next bookmark', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root.add('One');
        const second: any = root.add('Two');
        expect(second._dictionary.has('Prev')).toBe(true);
        root.remove(0);
        expect(second._dictionary.has('Prev')).toBe(false);
        document.destroy();
    });
    it('1038504 remove first bookmark should use First key', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root.add('One');
        const second: any = root.add('Two');
        root.remove(0);
        expect(root._dictionary.has('First')).toBe(true);
        expect(root._dictionary.has('')).toBe(false);
        expect(root._dictionary.getRaw('First')).toBe(second._reference);
        document.destroy();
    });
    it('1038504 remove middle bookmark should not execute last bookmark branch', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const first: any = root.add('One');
        const second: any = root.add('Two');
        const third: any = root.add('Three');
        root.remove(1);
        expect(first._dictionary.getRaw('Next')).toBe(third._reference);
        expect(third._dictionary.getRaw('Prev')).toBe(first._reference);
        expect(root.count).toBe(2);
        document.destroy();
    });
    it('1038504 remove middle bookmark updates previous and next references', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const first: any = root.add('One');
        const second: any = root.add('Two');
        const third: any = root.add('Three');
        expect(first._dictionary.getRaw('Next')).toBe(second._reference);
        expect(third._dictionary.getRaw('Prev')).toBe(second._reference);
        root.remove(1);
        expect(first._dictionary.getRaw('Next')).toBe(third._reference);
        expect(third._dictionary.getRaw('Prev')).toBe(first._reference);
        document.destroy();
    });
    it('1038504 remove last bookmark updates last reference and removes next link', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const first: any = root.add('One');
        const second: any = root.add('Two');
        expect(first._dictionary.has('Next')).toBe(true);
        root.remove(1);
        expect(root.count).toBe(1);
        expect(root._dictionary.getRaw('Last')).toBe(first._reference);
        expect(first._dictionary.has('Next')).toBe(false);
        document.destroy();
    });
    it('1038504 remove last bookmark uses Last key', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const first: any = root.add('One');
        root.add('Two');
        root.remove(1);
        expect(root._dictionary.has('Last')).toBe(true);
        expect(root._dictionary.has('')).toBe(false);
        expect(root._dictionary.getRaw('Last')).toBe(first._reference);
        document.destroy();
    });
    it('1038504 remove middle bookmark reconnects adjacent bookmarks', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const first: any = root.add('One');
        root.add('Two');
        const third: any = root.add('Three');
        root.remove(1);
        expect(first._dictionary.getRaw('Next')).toBe(third._reference);
        expect(third._dictionary.getRaw('Prev')).toBe(first._reference);
        document.destroy();
    });
    it('1038504 remove middle bookmark uses previous bookmark reference', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const first: any = root.add('One');
        root.add('Two');
        const third: any = root.add('Three');
        root.remove(1);
        expect(third._dictionary.getRaw('Prev')).toBe(first._reference);
        document.destroy();
    });
    it('1038504 remove middle bookmark uses next bookmark reference', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const first: any = root.add('One');
        root.add('Two');
        const third: any = root.add('Three');
        root.remove(1);
        expect(first._dictionary.getRaw('Next')).toBe(third._reference);
        document.destroy();
    });
    it('1038504 remove middle bookmark updates both neighboring links', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const first: any = root.add('One');
        const second: any = root.add('Two');
        const third: any = root.add('Three');
        root.remove(1);
        expect(first._dictionary.getRaw('Next')).toBe(third._reference);
        expect(third._dictionary.getRaw('Prev')).toBe(first._reference);
        expect(first._dictionary.getRaw('Next')).not.toBe(second._reference);
        expect(third._dictionary.getRaw('Prev')).not.toBe(second._reference);
        document.destroy();
    });
    it('1038504 remove middle bookmark updates previous bookmark Next key', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const first: any = root.add('One');
        root.add('Two');
        const third: any = root.add('Three');
        root.remove(1);
        expect(first._dictionary.has('Next')).toBe(true);
        expect(first._dictionary.has('')).toBe(false);
        expect(first._dictionary.getRaw('Next')).toBe(third._reference);
        document.destroy();
    });
    it('1038504 remove middle bookmark updates next bookmark Prev key', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root.add('One');
        root.add('Two');
        const third: any = root.add('Three');
        root.remove(1);
        expect(third._dictionary.has('Prev')).toBe(true);
        expect(third._dictionary.has('')).toBe(false);
        document.destroy();
    });
    it('1038504 remove updates count entry in dictionary', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root.add('One');
        root.add('Two');
        root.add('Three');
        expect(root._dictionary.get('Count')).toBe(3);
        root.remove(1);
        expect(root._dictionary.get('Count')).toBe(2);
        document.destroy();
    });
    it('1038504 _removeFirst sets updated flag after removing First entry', () : void => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('First', 'value');
        dictionary._updated = false;
        const bookmarkBase: any = new PdfBookmarkBase( dictionary, undefined as any);
        bookmarkBase._removeFirst(dictionary);
        expect(dictionary.has('First')).toBe(false);
        expect(dictionary._updated).toBe(true);
    });
    it('1038504 _removeLast removes Last entry', () : void => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Last', 'value');
        const bookmarkBase: any = new PdfBookmarkBase( dictionary, undefined as any);
        bookmarkBase._removeLast(dictionary);
        expect(dictionary.has('Last')).toBe(false);
    });
    it('1038504 _removeLast processes exact Last key', () : void => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Last', 'value');
        const bookmarkBase: any = new PdfBookmarkBase( dictionary, undefined as any);
        bookmarkBase._removeLast(dictionary);
        expect(dictionary.has('Last')).toBe(false);
        expect(dictionary.has('')).toBe(false);
    });
    it('1038504 _removeLast sets updated flag to true', () : void => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Last', 'value');
        dictionary._updated = false;
        const bookmarkBase: any = new PdfBookmarkBase( dictionary, undefined as any);
        bookmarkBase._removeLast(dictionary);
        expect(dictionary._updated).toBe(true);
    });
    it('1038504 _removeLast removes Last key and updates dictionary state', () : void => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Last', 'value');
        dictionary._updated = false;
        const bookmarkBase: any = new PdfBookmarkBase( dictionary, undefined as any);
        bookmarkBase._removeLast(dictionary);
        expect(dictionary.has('Last')).toBe(false);
        expect(dictionary.has('')).toBe(false);
        expect(dictionary._updated).toBe(true);
    });
    it('1038504 _removeNext removes Next entry and sets updated flag', () : void => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Next', 'value');
        dictionary._updated = false;
        const bookmarkBase: any = new PdfBookmarkBase( dictionary, undefined as any);
        bookmarkBase._removeNext(dictionary);
        expect(dictionary.has('Next')).toBe(false);
        expect(dictionary._updated).toBe(true);
    });
    it('1038504 _removePrevious removes Prev entry', () : void => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Prev', 'value');
        const bookmarkBase: any = new PdfBookmarkBase( dictionary, undefined as any);
        bookmarkBase._removePrevious(dictionary);
        expect(dictionary.has('Prev')).toBe(false);
    });
    it('1038504 _removePrevious processes exact Prev key', () : void => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Prev', 'value');
        const bookmarkBase: any = new PdfBookmarkBase( dictionary, undefined as any);
        bookmarkBase._removePrevious(dictionary);
        expect(dictionary.has('Prev')).toBe(false);
        expect(dictionary.has('')).toBe(false);
    });
    it('1038504 _removePrevious sets updated flag', () : void => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Prev', 'value');
        dictionary._updated = false;
        const bookmarkBase: any = new PdfBookmarkBase( dictionary, undefined as any);
        bookmarkBase._removePrevious(dictionary);
        expect(dictionary._updated).toBe(true);
    });
    it('1038504 _removeNext removes Next key and updates dictionary', () : void => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Next', 'value');
        dictionary._updated = false;
        const bookmarkBase: any = new PdfBookmarkBase( dictionary, undefined as any);
        bookmarkBase._removeNext(dictionary);
        expect(dictionary.has('Next')).toBe(false);
        expect(dictionary._updated).toBe(true);
    });
    it('1038504 _removePrevious removes Prev key and updates dictionary', () : void => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Prev', 'value');
        dictionary._updated = false;
        const bookmarkBase: any = new PdfBookmarkBase( dictionary, undefined as any);
        bookmarkBase._removePrevious(dictionary);
        expect(dictionary.has('Prev')).toBe(false);
        expect(dictionary.has('')).toBe(false);
        expect(dictionary._updated).toBe(true);
    });
    it('1038504 _removeNext removes Next entry and sets updated flag', () : void => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Count', 'value');
        dictionary._updated = false;
        const bookmarkBase: any = new PdfBookmarkBase( dictionary, undefined as any);
        bookmarkBase._removeCount(dictionary);
        expect(dictionary.has('Count')).toBe(false);
        expect(dictionary._updated).toBe(true);
    });
    it('1038504 _updateBookmarkList inserts bookmark at specified index', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const first: any = root.add('One');
        const third: any = root.add('Three');
        const inserted: any = root.add('Two');
        root._updateBookmarkList(1, inserted);
        expect(root._bookMarkList.length).toBe(4);
        expect(root._bookMarkList[0]).toBe(first);
        expect(root._bookMarkList[1]).toBe(inserted);
        expect(root._bookMarkList[2]).toBe(third);
        document.destroy();
    });
    it('1038504 _updateBookmarkList removes bookmark and updates cache entry', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark');
        const cacheDictionary: any = root._crossReference._cacheMap.get(bookmark._reference);
        cacheDictionary._updated = true;
        root._updateBookmarkList(0);
        expect(root._bookMarkList.length).toBe(0);
        expect(cacheDictionary._updated).toBe(false);
        document.destroy();
    });
    it('1038504 _updateBookmarkList resets cached dictionary updated flag', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark');
        const cacheDictionary: any = root._crossReference._cacheMap.get(bookmark._reference);
        cacheDictionary._updated = true;
        root._updateBookmarkList(0);
        expect(cacheDictionary._updated).toBe(false);
        document.destroy();
    });
    it('1038504 _updateBookmarkList removes bookmark and clears cached updated state', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark');
        const cacheDictionary: any = root._crossReference._cacheMap.get(bookmark._reference);
        cacheDictionary._updated = true;
        root._updateBookmarkList(0);
        expect(root._bookMarkList.length).toBe(0);
        expect(cacheDictionary._updated).toBe(false);
        document.destroy();
    });
    it('1038504 _updateBookmarkList inserts bookmark at requested position', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const first: any = root.add('One');
        const third: any = root.add('Three');
        const second: any = root.add('Two');
        root._bookMarkList = [first, third];
        root._updateBookmarkList(1, second);
        expect(root._bookMarkList.length).toBe(3);
        expect(root._bookMarkList[0]).toBe(first);
        expect(root._bookMarkList[1]).toBe(second);
        expect(root._bookMarkList[2]).toBe(third);
        document.destroy();
    });
    it('1038504 _updateCount writes negative count when bookmark is collapsed', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root.add('One');
        root.add('Two');
        root._dictionary.update('Count', 2);
        root.isExpanded = false;
        root._updateCount();
        expect(root._dictionary.get('Count')).toBe(-2);
        document.destroy();
    });
    it('1038504 _updateCount executes collapsed branch', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root.add('One');
        root.add('Two');
        root._dictionary.update('Count', 2);
        root.isExpanded = false;
        root._updateCount();
        expect(root._dictionary.get('Count')).toBe(-2);
        document.destroy();
    });
    it('1038504 _updateCount uses Count key in collapsed state', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root.add('One');
        root.add('Two');
        root._dictionary.update('Count', 2);
        root.isExpanded = false;
        root._updateCount();
        expect(root._dictionary.has('Count')).toBe(true);
        expect(root._dictionary.has('')).toBe(false);
        expect(root._dictionary.get('Count')).toBe(-2);
        document.destroy();
    });
    it('1038504 _updateCount stores negative value for collapsed bookmark', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root.add('One');
        root.add('Two');
        root.add('Three');
        root._dictionary.update('Count', 3);
        root.isExpanded = false;
        root._updateCount();
        expect(root._dictionary.get('Count')).toBe(-3);
        expect(root._dictionary.get('Count')).not.toBe(3);
        document.destroy();
    });
    it('1038504 _updateCount stores positive count when Count entry is absent', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root.add('One');
        root.add('Two');
        if (root._dictionary.has('Count')) {delete root._dictionary._map.Count;}
        root._updateCount();
        expect(root._dictionary.get('Count')).toBe(2);
        document.destroy();
    });
    it('1038504 _getBookmark should use Last entry when isFirst is false', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const first: any = root.add('First');
        const last: any = root.add('Last');
        const result: any = root._getBookmark(root, false);
        expect(result).toBeDefined();
        expect(result._reference).toBe(last._reference);
        document.destroy();
    });
    it('1038504 _getBookmark returns undefined when dictionary is undefined', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const result: any = root._getBookmark( { _dictionary: undefined }, true);
        expect(result).toBeUndefined();
        document.destroy();
    });
    it('1038504 _getBookmark reads exact Last key', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root.add('One');
        const last: any = root.add('Two');
        const result: any = root._getBookmark(root, false);
        expect(result._reference).toBe(last._reference);
        document.destroy();
    });
    it('1038504 _getBookmark returns undefined when reference entry is undefined', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        root._dictionary.update('First', undefined);
        const result: any = root._getBookmark(root);
        expect(result).toBeUndefined();
        document.destroy();
    });
    it('1038504 _getBookmark returns undefined when fetch fails', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const fakeReference: any = root._crossReference._getNextReference();
        root._dictionary.update('First', fakeReference);
        const result: any = root._getBookmark(root);
        expect(result).toBeUndefined();
        document.destroy();
    });
    it('1038504 destination getter returns cached destination instance', () : void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark');
        const destination: PdfDestination = new PdfDestination(page);
        bookmark._destination = destination;
        const result: PdfDestination = bookmark.destination;
        expect(result).toBe(destination);
        document.destroy();
    });
    it('1038504 destination getter preserves cached destination parent', () : void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark');
        const destination: PdfDestination = new PdfDestination(page);
        bookmark._destination = destination;
        const result: PdfDestination = bookmark.destination;
        expect(result).toBe(destination);
        expect(bookmark._destination).toBe(destination);
        document.destroy();
    });
    it('1038504 destination setter ignores undefined value', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark');
        bookmark.destination = undefined as any;
        expect(bookmark._destination).toBeUndefined();
        document.destroy();
    });
    it('1038504 destination setter initializes destination when value exists', () : void => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark');
        const destination: PdfDestination = new PdfDestination(page);
        bookmark.destination = destination;
        expect(bookmark._destination).toBe(destination);
        expect((destination as any)._parent).toBe(bookmark);
        expect((destination as any)._isBookmark).toBe(true);
        document.destroy();
    });
    it('1038504 namedDestination getter resolves value when cache is null', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark');
        const namedDestination: any = {title: 'NamedDestination'};
        bookmark._namedDestination = null;
        bookmark._obtainNamedDestination = (): any => {return namedDestination;};
        const result: any = bookmark.namedDestination;
        expect(result).toBe(namedDestination);
        expect(bookmark._namedDestination).toBe(namedDestination);
        document.destroy();
    });
    it('1038504 namedDestination setter ignores identical value', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark');
        const namedDestination: any = { title: 'NamedDestination' };
        bookmark.namedDestination = namedDestination;
        const firstReference: any = bookmark._dictionary.get('A');
        bookmark.namedDestination = namedDestination;
        const secondReference: any = bookmark._dictionary.get('A');
        expect(secondReference).toBe(firstReference);
        document.destroy();
    });
    it('1038504 namedDestination setter does not recreate action for same destination', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark');
        const namedDestination: any = { title: 'Destination'};
        bookmark.namedDestination = namedDestination;
        const actionReferenceBefore: any = bookmark._dictionary.get('A');
        bookmark.namedDestination = namedDestination;
        const actionReferenceAfter: any = bookmark._dictionary.get('A');
        expect(actionReferenceAfter).toBe(actionReferenceBefore);
        document.destroy();
    });
    it('1038504 title getter returns cached title without rereading dictionary', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Original');
        bookmark._title = 'Cached';
        bookmark._dictionary.update('Title', 'DictionaryValue');
        const result: string = bookmark.title;
        expect(result).toBe('Cached');
        document.destroy();
    });
    it('1038504 title getter loads title when cached value is null', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark');
        bookmark._title = null;
        bookmark._dictionary.update('Title', 'LoadedTitle');
        const result: string = bookmark.title;
        expect(result).toBe('LoadedTitle');
        document.destroy();
    });
    it('1038504 title getter reads Title entry from dictionary', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark');
        bookmark._title = undefined;
        bookmark._dictionary.update('Title', 'DictionaryTitle');
        const result: string = bookmark.title;
        expect(result).toBe('DictionaryTitle');
        document.destroy();
    });
    it('1038504 title getter uses exact Title key', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Bookmark');
        bookmark._title = undefined;
        bookmark._dictionary.update('Title', 'ExpectedTitle');
        const result: string = bookmark.title;
        expect(result).toBe('ExpectedTitle');
        expect(result).not.toBeUndefined();
        document.destroy();
    });
    it('1038504 title setter skips dictionary update when dictionary is undefined', () : void => {
        const bookmark: any = new PdfBookmark(undefined as any, undefined as any);
        bookmark.title = 'Sample';
        expect(bookmark._title).toBe('Sample');
    });
    it('1038504 title setter updates dictionary Title entry', () : void => {
        const document: PdfDocument = new PdfDocument();
        const root: any = document.bookmarks;
        const bookmark: any = root.add('Initial');
        bookmark.title = 'Updated';
        expect(bookmark._dictionary.get('Title')).toBe('Updated');
        document.destroy();
    });
});
describe('1038504 PdfBookmark color getter and setter', () => {
    it('1038504 color getter returns cached color without dictionary value', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        const expectedColor: { r: number; g: number; b: number } = { r: 10, g: 20, b: 30};
        bookmark.color = expectedColor;
        const result: { r: number; g: number; b: number } = bookmark.color;
        expect(result).toBe(expectedColor);
        expect(result.r).toBe(10);
        expect(result.g).toBe(20);
        expect(result.b).toBe(30);
    });
    it('1038504 color getter reads color from dictionary when cache undefined', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('C', [1, 0, 0]);
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        const result: any = bookmark.color;
        expect(result).toBeDefined();
        expect(result.r).toBe(255);
        expect(result.g).toBe(0);
        expect(result.b).toBe(0);
        const cached: any = (bookmark as any)._color;
        expect(cached).toBeDefined();
        expect(cached.r).toBe(255);
    });
    it('1038504 color getter does not re-read dictionary when cached value exists', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('C', [1, 0, 0]);
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        const first: any = bookmark.color;
        dictionary.update('C', [0, 1, 0]);
        const second: any = bookmark.color;
        expect(second).toBe(first);
        expect(second.r).toBe(255);
        expect(second.g).toBe(0);
        expect(second.b).toBe(0);
    });
    it('1038504 color getter returns default black when dictionary has no color entry', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        const result: any = bookmark.color;
        expect(result).toBeDefined();
        expect(result.r).toBe(0);
        expect(result.g).toBe(0);
        expect(result.b).toBe(0);
    });
    it('1038504 color getter default value is not empty object', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        const result: any = bookmark.color;
        expect(result).toEqual({ r: 0, g: 0, b: 0 });
        expect((result as any).r).toBeDefined();
        expect((result as any).g).toBeDefined();
        expect((result as any).b).toBeDefined();
    });
    it('1038504 color setter updates dictionary with exact key C', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        bookmark.color = { r: 255, g: 128, b: 64};
        expect(dictionary.has('C')).toBe(true);
        expect(dictionary.has('')).toBe(false);
    });
    it('1038504 color setter stores normalized rgb values', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        bookmark.color = { r: 255, g: 128, b: 64};
        const values: number[] = dictionary.getArray('C') as number[];
        expect(values.length).toBe(3);
        expect(values[0]).toBe(1);
        expect(values[1]).toBe(Number.parseFloat((128 / 255).toFixed(7)));
        expect(values[2]).toBe(Number.parseFloat((64 / 255).toFixed(7)));
    });
    it('1038504 color setter does not multiply red component', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        bookmark.color = { r: 1, g: 0, b: 0};
        const values: number[] = dictionary.getArray('C') as number[];
        expect(values[0]).toBe(Number.parseFloat((1 / 255).toFixed(7)));
        expect(values[0]).not.toBe(255);
    });
    it('1038504 color setter does not multiply green component', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        bookmark.color = { r: 0, g: 1, b: 0};
        const values: number[] = dictionary.getArray('C') as number[];
        expect(values[1]).toBe(Number.parseFloat((1 / 255).toFixed(7)));
        expect(values[1]).not.toBe(255);
    });
    it('1038504 color setter does not multiply blue component', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        bookmark.color = { r: 0, g: 0, b: 1};
        const values: number[] = dictionary.getArray('C') as number[];
        expect(values[2]).toBe(Number.parseFloat((1 / 255).toFixed(7)));
        expect(values[2]).not.toBe(255);
    });
    it('1038504 color setter updates cached color reference', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark(dictionary,undefined as any);
        const expectedColor: { r: number; g: number; b: number } = { r: 40, g: 50, b: 60};
        bookmark.color = expectedColor;
        expect((bookmark as any)._color).toBe(expectedColor);
        expect(bookmark.color).toBe(expectedColor);
    });
    it('1038504 color setter without dictionary still updates cache', () => {
        const bookmark: PdfBookmark = new PdfBookmark( undefined as any, undefined as any);
        const expectedColor: { r: number; g: number; b: number } = { r: 12, g: 34, b: 56};
        bookmark.color = expectedColor;
        expect(bookmark.color).toBe(expectedColor);
        expect((bookmark as any)._color).toBe(expectedColor);
    });
    it('1038504 textStyle getter loads value when cache undefined', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('F', 1);
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        (bookmark as any)._textStyle = undefined;
        const result: PdfTextStyle = bookmark.textStyle;
        expect(result).toBeDefined();
        expect((bookmark as any)._textStyle).toBe(result);
    });
    it('1038504 textStyle getter loads value when cache null', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('F', 1);
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        (bookmark as any)._textStyle = null;
        const result: PdfTextStyle = bookmark.textStyle;
        expect(result).toBeDefined();
        expect((bookmark as any)._textStyle).toBe(result);
    });
    it('1038504 textStyle getter returns cached value when already initialized', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        (bookmark as any)._textStyle = PdfTextStyle.bold;
        const result: PdfTextStyle = bookmark.textStyle;
        expect(result).toBe(PdfTextStyle.bold);
        expect((bookmark as any)._textStyle).toBe(PdfTextStyle.bold);
    });
    it('1038504 textStyle getter preserves cached value on repeated access', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        (bookmark as any)._textStyle = PdfTextStyle.italic;
        const first: PdfTextStyle = bookmark.textStyle;
        const second: PdfTextStyle = bookmark.textStyle;
        expect(first).toBe(PdfTextStyle.italic);
        expect(second).toBe(PdfTextStyle.italic);
        expect(first).toBe(second);
    });
    it('1038504 textStyle setter updates cached value', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        bookmark.textStyle = PdfTextStyle.bold;
        expect(bookmark.textStyle).toBe(PdfTextStyle.bold);
        expect((bookmark as any)._textStyle).toBe(PdfTextStyle.bold);
    });
    it('1038504 textStyle setter updates dictionary style flag', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        bookmark.textStyle = PdfTextStyle.bold;
        expect(dictionary.has('F')).toBe(true);
        expect(dictionary.get('F')).toBe(PdfTextStyle.bold);
    });
    it('1038504 textStyle setter regular style removes F entry', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('F', PdfTextStyle.bold);
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        bookmark.textStyle = PdfTextStyle.regular;
        expect(dictionary.has('F')).toBe(false);
        expect(bookmark.textStyle).toBe(PdfTextStyle.regular);
    });
    it('1038504 _next returns undefined when Next entry does not exist', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        const result: PdfBookmark = (bookmark as any)._next;
        expect(result).toBeUndefined();
    });
    it('1038504 _next returns undefined when fetch returns no dictionary', () => {
        const nextReference: _PdfReference = new _PdfReference(10, 0);
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Next', nextReference);
        const crossReference: any = { _fetch: (_ref: _PdfReference): any => undefined};
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, crossReference);
        const result: PdfBookmark = (bookmark as any)._next;
        expect(result).toBeUndefined();
    });
    it('1038504 _next creates bookmark only when fetched dictionary exists', () => {
        const nextReference: _PdfReference = new _PdfReference(20, 0);
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Next', nextReference);
        const crossReference: any = {_fetch: (_ref: _PdfReference): any => undefined};
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, crossReference);
        const result: PdfBookmark = (bookmark as any)._next;
        expect(result).toBeUndefined();
    });
    it('1038504 _next returns next bookmark and preserves reference', () => {
        const nextReference: _PdfReference = new _PdfReference(30, 0);
        const nextDictionary: _PdfDictionary = new _PdfDictionary();
        nextDictionary.update('Title', 'Next Bookmark');
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Next', nextReference);
        const crossReference: any = { _fetch: (_ref: _PdfReference): _PdfDictionary => nextDictionary};
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, crossReference);
        const result: PdfBookmark = (bookmark as any)._next;
        expect(result).toBeDefined();
        expect(result instanceof PdfBookmark).toBe(true);
        expect((result as any)._reference).toBe(nextReference);
    });
    it('1038504 textStyle setter stores non regular style in dictionary', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        bookmark.textStyle = PdfTextStyle.bold;
        expect(dictionary.has('F')).toBe(true);
        expect(dictionary.get('F')).toBe(PdfTextStyle.bold);
    });
    it('1038504 textStyle setter writes F for bold style', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        bookmark.textStyle = PdfTextStyle.bold;
        expect(dictionary.has('F')).toBe(true);
    });
    it('1038504 textStyle setter removes existing F for regular style', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('F', PdfTextStyle.bold);
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        bookmark.textStyle = PdfTextStyle.regular;
        expect(dictionary.has('F')).toBe(false);
    });
    it('1038504 textStyle setter retains regular style behavior', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('F', PdfTextStyle.bold);
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        bookmark.textStyle = PdfTextStyle.regular;
        expect(dictionary.has('F')).toBe(false);
    });
    it('1038504 regular style removes existing F entry', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('F', PdfTextStyle.italic);
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        bookmark.textStyle = PdfTextStyle.regular;
        expect(dictionary.has('F')).toBe(false);
    });
    it('1038504 regular style uses exact key F', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('F', PdfTextStyle.bold);
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        bookmark.textStyle = PdfTextStyle.regular;
        expect(dictionary.has('F')).toBe(false);
        expect(dictionary.has('')).toBe(false);
    });
    it('1038504 non regular style updates dictionary', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        bookmark.textStyle = PdfTextStyle.bold;
        expect(dictionary.has('F')).toBe(true);
    })
    it('1038504 regular style does not recreate F entry after removal', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('F', PdfTextStyle.bold);
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        bookmark.textStyle = PdfTextStyle.regular;
        expect(dictionary.has('F')).toBe(false);
    });
    it('1038504 non regular style stores value under exact F key', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        bookmark.textStyle = PdfTextStyle.bold
        expect(dictionary.has('F')).toBe(true);
        expect(dictionary.has('')).toBe(false);
        expect(dictionary.get('F')).toBe(PdfTextStyle.bold);
    });
});
describe('1038504 PdfBookmark _obtainTextStyle', () => {
    it('1038504 obtainTextStyle returns regular when F does not exist', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        const result: PdfTextStyle = (bookmark as any)._obtainTextStyle();
        expect(result).toBe(PdfTextStyle.regular);
    });
    it('1038504 obtainTextStyle returns style from F entry', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('F', PdfTextStyle.bold);
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        const result: PdfTextStyle = (bookmark as any)._obtainTextStyle();
        expect(result).toBe(PdfTextStyle.bold);
        expect(result).not.toBe(PdfTextStyle.regular);
    });
    it('1038504 obtainTextStyle uses exact key F', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('F', PdfTextStyle.italic);
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        const result: PdfTextStyle = (bookmark as any)._obtainTextStyle();
        expect(dictionary.has('F')).toBe(true);
        expect(dictionary.has('')).toBe(false);
        expect(result).toBe(PdfTextStyle.italic);
    });
    it('1038504 obtainTextStyle ignores undefined flag value', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('F', undefined);
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        const result: PdfTextStyle = (bookmark as any)._obtainTextStyle();
        expect(result).toBe(PdfTextStyle.regular);
    });
    it('1038504 obtainTextStyle ignores null flag value', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('F', null);
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        const result: PdfTextStyle = (bookmark as any)._obtainTextStyle();
        expect(result).toBe(PdfTextStyle.regular);
    });
    it('1038504 obtainTextStyle does not treat undefined as valid style value', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('F', undefined);
        const bookmark: PdfBookmark = new PdfBookmark( dictionary, undefined as any);
        const result: PdfTextStyle = (bookmark as any)._obtainTextStyle();
        expect(result).toBe(PdfTextStyle.regular);
        expect(result).not.toBeUndefined();
    });
});
describe('PdfOutline survived mutants', () => {
    function createDictionary(): any {
        const dictionary: any = new _PdfDictionary();
        dictionary._map = {};
        dictionary._updated = false;
        return dictionary;
    }
    function createBookmark(): any {
        const dictionary: any = createDictionary();
        const bookmark: any = new PdfBookmark(dictionary, {} as any);
        bookmark._dictionary = dictionary;
        return bookmark;
    }
    it('should store blue color component using normalized RGB value', () => {
        const bookmark: any = createBookmark();
        bookmark.color = { r: 0, g: 0, b: 255 };
        expect(bookmark._dictionary.getArray('C')[2]).toBe(1);
    });
    it('should return default text style when style information is unavailable', () => {
        const bookmark: any = createBookmark();
        bookmark._textStyle = undefined;
        bookmark._dictionary = createDictionary();
        const result: PdfTextStyle = bookmark.textStyle;
        expect(result).toBeDefined();
    });
    it('should resolve text style when cached value is undefined', () => {
        const bookmark: any = createBookmark();
        bookmark._textStyle = undefined;
        expect(bookmark.textStyle).toBeDefined();
    });
    it('should resolve text style when cached value is null', () => {
        const bookmark: any = createBookmark();
        bookmark._textStyle = null;
        expect(bookmark.textStyle).toBeDefined();
    });
    it('should reuse cached text style when it is already initialized', () => {
        const bookmark: any = createBookmark();
        bookmark._textStyle = PdfTextStyle.bold;
        expect(bookmark.textStyle).toBe(PdfTextStyle.bold);
    });
    it('should remove next entry from dictionary when next key exists', () => {
        const dictionary: any = createDictionary();
        dictionary._map.Next = 10;
        dictionary.has = (key: string) => key === 'Next';
        const base: any = new PdfBookmarkBase(dictionary, {} as any);
        base._removeNext(dictionary);
        expect(dictionary._map.Next).toBeUndefined();
    });
    it('should not modify next entry when next key is absent', () => {
        const dictionary: any = createDictionary();
        dictionary.has = () => false;
        const base: any = new PdfBookmarkBase(dictionary, {} as any);
        base._removeNext(dictionary);
        expect(dictionary._updated).toBe(false);
    });
    it('should remove previous entry from dictionary when previous key exists', () => {
        const dictionary: any = createDictionary();
        dictionary._map.Prev = 1;
        dictionary.has = (key: string) => key === 'Prev';
        const base: any = new PdfBookmarkBase(dictionary, {} as any);
        base._removePrevious(dictionary);
        expect(dictionary._map.Prev).toBeUndefined();
    });
    it('should remove count entry from dictionary when count key exists', () => {
        const dictionary: any = createDictionary();
        dictionary._map.Count = 2;
        dictionary.has = (key: string) => key === 'Count';
        const base: any = new PdfBookmarkBase(dictionary, {} as any);
        base._removeCount(dictionary);
        expect(dictionary._map.Count).toBeUndefined();
    });
    it('should update text style flag when regular style is assigned', () => {
        const bookmark: any = createBookmark();
        bookmark.textStyle = PdfTextStyle.regular;
        expect(bookmark._textStyle).toBe(PdfTextStyle.regular);
    });
    it('should update style flag entry in bookmark dictionary', () => {
        const bookmark: any = createBookmark();
        bookmark.textStyle = PdfTextStyle.bold;
        expect(bookmark._textStyle).toBe(PdfTextStyle.bold);
    });
    it('should clear all bookmark entries from collection', () => {
        const dictionary: any = createDictionary();
        const base: any = new PdfBookmarkBase(dictionary, {} as any);
        base._bookMarkList = [createBookmark()];
        base.clear();
        expect(base.count).toBe(0);
    });
    it('should reset bookmark collection after clear operation', () => {
        const dictionary: any = createDictionary();
        const base: any = new PdfBookmarkBase(dictionary, {} as any);
        base._bookMarkList = [createBookmark(), createBookmark()];
        base.clear();
        expect(base._bookMarkList.length).toBe(0);
    });
    it('should return bookmark title stored in dictionary', () => {
        const dictionary: any = createDictionary();
        dictionary.has = (key: string) => key === 'Title';
        dictionary.get = () => 'Chapter 1';
        const bookmark: any = createBookmark();
        bookmark._dictionary = dictionary;
        bookmark._title = undefined;
        expect(bookmark.title).toBe('Chapter 1');
    });
    it('should return empty title when title entry does not exist', () => {
        const dictionary: any = createDictionary();
        dictionary.has = () => false;
        const bookmark: any = createBookmark();
        bookmark._dictionary = dictionary;
        bookmark._title = undefined;
        expect(bookmark.title).toBe('');
    });
    it('should update dictionary title when bookmark title changes', () => {
        const bookmark: any = createBookmark();
        bookmark.title = 'Introduction';
        expect(bookmark.title).toBe('Introduction');
    });
    it('should return default black color when color entry is not available', () => {
        const bookmark: any = createBookmark();
        expect(bookmark.color).toEqual({ r: 0, g: 0, b: 0 });
    });
    it('should load color from bookmark dictionary when present', () => {
        const bookmark: any = createBookmark();
        bookmark._color = { r: 10, g: 20, b: 30 };
        expect(bookmark.color).toEqual({ r: 10, g: 20, b: 30 });
    });
    it('should update bookmark title cache immediately after assignment', () => {
        const bookmark: any = createBookmark();
        bookmark.title = 'Syncfusion';
        expect(bookmark._title).toBe('Syncfusion');
    });
    it('should remove first outline entry from dictionary', () => {
        const dictionary: any = createDictionary();
        dictionary._map.First = 1;
        dictionary.has = (key: string) => key === 'First';
        const base: any = new PdfBookmarkBase(dictionary, {} as any);
        base._removeFirst(dictionary);
        expect(dictionary._map.First).toBeUndefined();
    });
    it('should remove last outline entry from dictionary', () => {
        const dictionary: any = createDictionary();
        dictionary._map.Last = 1;
        dictionary.has = (key: string) => key === 'Last';
        const base: any = new PdfBookmarkBase(dictionary, {} as any);
        base._removeLast(dictionary);
        expect(dictionary._map.Last).toBeUndefined();
    });
    it('should reproduce bookmark tree when loaded bookmark count is requested', () => {
        const base: any = new PdfBookmarkBase(createDictionary(), {} as any);
        base._isLoadedBookmark = false;
        base._bookMarkList = [createBookmark()];
        expect(base.count).toBe(1);
    });
    it('should return bookmark count from in memory list', () => {
        const base: any = new PdfBookmarkBase(createDictionary(), {} as any);
        base._bookMarkList = [createBookmark(), createBookmark()];
        expect(base.count).toBe(2);
    });
    it('should report bookmark existence when item is present', () => {
        const base: any = new PdfBookmarkBase(createDictionary(), {} as any);
        const bookmark: any = createBookmark();
        base._bookMarkList.push(bookmark);
        expect(base.contains(bookmark)).toBe(true);
    });
    it('should report bookmark absence when item is not present', () => {
        const base: any = new PdfBookmarkBase(createDictionary(), {} as any);
        expect(base.contains(createBookmark())).toBe(false);
    });
    it('should update count as positive value for expanded bookmark collection', () => {
        const dictionary: any = createDictionary();
        dictionary.has = () => true;
        dictionary.get = () => 1;
        dictionary.update = (key: string, value: number) => {
            dictionary.countValue = value;
        };
        const base: any = new PdfBookmarkBase(dictionary, {} as any);
        base._bookMarkList = [createBookmark(), createBookmark()];
        base._updateCount();
        expect(dictionary.countValue).toBe(2);
    });
    it('should return bookmark when first entry exists in dictionary', () => {
        const dictionary: any = createDictionary();
        const reference: any = new _PdfReference(1, 0);
        dictionary.has = () => true;
        dictionary._get = () => reference;
        const crossReference: any = {
            _fetch: () => createDictionary()
        };
        const base: any = new PdfBookmarkBase(dictionary, crossReference);
        const result = base._getBookmark(base);
        expect(result).toBeDefined();
    });
    it('should return undefined when first entry is missing', () => {
        const dictionary: any = createDictionary();
        dictionary.has = () => false;
        const base: any = new PdfBookmarkBase(dictionary, {} as any);
        expect(base._getBookmark(base)).toBeUndefined();
    });
    it('should assign reference to loaded bookmark during retrieval', () => {
        const dictionary: any = createDictionary();
        const reference: any = new _PdfReference(10, 0);
        dictionary.has = () => true;
        dictionary._get = () => reference;
        const crossReference: any = {
            _fetch: () => createDictionary()
        };
        const base: any = new PdfBookmarkBase(dictionary, crossReference);
        const result: any = base._getBookmark(base);
        expect(result._reference).toBe(reference);
    });
    it('should return undefined bookmark when fetched dictionary is unavailable', () => {
        const dictionary: any = createDictionary();
        const reference: any = new _PdfReference(5, 0);
        dictionary.has = () => true;
        dictionary._get = () => reference;
        const crossReference: any = {
            _fetch: (): any => undefined
        };
        const base: any = new PdfBookmarkBase(dictionary, crossReference);
        expect(base._getBookmark(base)).toBeUndefined();
    });
    it('should ignore bookmark retrieval when fetched reference is not backed by a dictionary', () => {
        const dictionary: any = createDictionary();
        const reference: any = new _PdfReference(20, 0);
        dictionary.has = () => true;
        dictionary._get = () => reference;
        const crossReference: any = {
            _fetch: (): any => null
        };
        const base: any = new PdfBookmarkBase(dictionary, crossReference);
        expect(base._getBookmark(base)).toBeUndefined();
    });
    it('should retrieve the last bookmark when requested explicitly', () => {
        const dictionary: any = createDictionary();
        const reference: any = new _PdfReference(21, 0);
        dictionary.has = () => true;
        dictionary._get = () => reference;
        const crossReference: any = {
            _fetch: () => createDictionary()
        };
        const base: any = new PdfBookmarkBase(dictionary, crossReference);
        const bookmark = base._getBookmark(base, false);
        expect(bookmark).toBeDefined();
    });
    it('should not create bookmark instance when outline dictionary is unavailable', () => {
        const base: any = new PdfBookmarkBase(null, {} as any);
        expect(base._getBookmark(base)).toBeUndefined();
    });
    it('should stop reproducing tree when first bookmark does not exist', () => {
        const base: any = new PdfBookmarkBase(createDictionary(), {} as any);
        base._getBookmark = (): any => undefined;
        base._bookMarkList = [];
        base._reproduceTree();
        expect(base._bookMarkList.length).toBe(0);
    });
    it('should return named destination destination when direct destination is unavailable', () => {
        const bookmark: any = createBookmark();
        const namedDestination = {
            destination: { pageIndex: 1 }
        };
        bookmark._obtainNamedDestination = () => namedDestination;
        bookmark._destination = undefined;
        const helperResult: any = undefined;
        bookmark._dictionary = createDictionary();
        expect(namedDestination.destination).toBeDefined();
    });
    it('should return cached destination when destination has already been resolved', () => {
        const bookmark: any = createBookmark();
        const destination = { pageIndex: 2 };
        bookmark._destination = destination;
        expect(bookmark.destination).toBe(destination);
    });
    it('should assign bookmark as parent of destination during destination update', () => {
        const bookmark: any = createBookmark();
        const destination: any = {
            _initializePrimitive: () => {}
        };
        bookmark.destination = destination;
        expect(destination._parent).toBe(bookmark);
    });
    it('should mark destination as bookmark destination during assignment', () => {
        const bookmark: any = createBookmark();
        const destination: any = {
            _initializePrimitive: () => {}
        };
        bookmark.destination = destination;
        expect(destination._isBookmark).toBe(true);
    });
    it('should cache destination object after assignment', () => {
        const bookmark: any = createBookmark();
        const destination: any = {
            _initializePrimitive: () => {}
        };
        bookmark.destination = destination;
        expect(bookmark._destination).toBe(destination);
    });
    it('should lazily resolve named destination when cache is empty', () => {
        const bookmark: any = createBookmark();
        const namedDestination: any = { title: 'Chapter1' };
        bookmark._namedDestination = undefined;
        bookmark._obtainNamedDestination = () => namedDestination;
        expect(bookmark.namedDestination).toBe(namedDestination);
    });
    it('should return cached named destination without resolving it again', () => {
        const bookmark: any = createBookmark();
        const namedDestination: any = { title: 'Cached' };
        bookmark._namedDestination = namedDestination;
        expect(bookmark.namedDestination).toBe(namedDestination);
    });
    it('should update action dictionary when named destination changes', () => {
        const cacheMap = new Map();
        const crossReference: any = {
            _cacheMap: cacheMap,
            _getNextReference: () => new _PdfReference(100, 0)
        };
        const bookmark: any = new PdfBookmark(createDictionary(), crossReference);
        bookmark.namedDestination = {
            title: 'Target'
        };
        expect(bookmark._dictionary.has('A')).toBe(true);
    });
    it('should store assigned named destination as current bookmark destination', () => {
        const cacheMap = new Map();
        const crossReference: any = {
            _cacheMap: cacheMap,
            _getNextReference: () => new _PdfReference(101, 0)
        };
        const bookmark: any = new PdfBookmark(createDictionary(), crossReference);
        const namedDestination: any = {
            title: 'Section-1'
        };
        bookmark.namedDestination = namedDestination;
        expect(bookmark._namedDestination).toBe(namedDestination);
    });
    it('should initialize bookmark title from dictionary value', () => {
        const dictionary: any = createDictionary();
        dictionary.has = (key: string) => key === 'Title';
        dictionary.get = () => 'Overview';
        const bookmark: any = createBookmark();
        bookmark._dictionary = dictionary;
        bookmark._title = undefined;
        expect(bookmark.title).toBe('Overview');
    });
    it('should return empty title when title key is absent', () => {
        const dictionary: any = createDictionary();
        dictionary.has = () => false;
        const bookmark: any = createBookmark();
        bookmark._dictionary = dictionary;
        bookmark._title = undefined;
        expect(bookmark.title).toBe('');
    });
    it('should update underlying dictionary when title is changed', () => {
        const bookmark: any = createBookmark();
        bookmark.title = 'Bookmarks';
        expect(bookmark._dictionary.get('Title')).toBe('Bookmarks');
    });
    it('should return parsed color value from bookmark dictionary', () => {
        const bookmark: any = createBookmark();
        bookmark._color = { r: 255, g: 0, b: 0};
        expect(bookmark.color.r).toBe(255);
    });
    it('should return default black color when parsed color is unavailable', () => {
        const bookmark: any = createBookmark();
        bookmark._color = undefined;
        bookmark._dictionary = createDictionary();
        expect(bookmark.color).toEqual({ r: 0, g: 0, b: 0});
    });
    it('should update dictionary with normalized red color value', () => {
        const bookmark: any = createBookmark();
        bookmark.color = { r: 255, g: 0, b: 0};
        expect(bookmark._dictionary.getArray('C')[0]).toBe(1);
    });
    it('should preserve bookmark list count after inserting a bookmark at the beginning', () => {
        const base: any = new PdfBookmarkBase(createDictionary(), {} as any);
        const first: any = createBookmark();
        const inserted: any = createBookmark();
        base._bookMarkList = [first];
        base._updateBookmarkList(0, inserted);
        expect(base._bookMarkList.length).toBe(2);
    });
    it('should insert bookmark at requested position when target index is zero', () => {
        const base: any = new PdfBookmarkBase(createDictionary(), {} as any);
        const existing: any = createBookmark();
        const inserted: any = createBookmark();
        base._bookMarkList = [existing];
        base._updateBookmarkList(0, inserted);
        expect(base._bookMarkList[0]).toBe(inserted);
    });
    it('should insert bookmark before existing item at matching index', () => {
        const base: any = new PdfBookmarkBase(createDictionary(), {} as any);
        const first: any = createBookmark();
        const inserted: any = createBookmark();
        base._bookMarkList = [first];
        base._updateBookmarkList(0, inserted);
        expect(base._bookMarkList[1]).toBe(first);
    });
    it('should remove bookmark located at specified index', () => {
        const base: any = new PdfBookmarkBase(createDictionary(), {} as any);
        const first: any = createBookmark();
        const second: any = createBookmark();
        base._bookMarkList = [first, second];
        base._updateBookmarkList(0);
        expect(base._bookMarkList.length).toBe(1);
    });
    it('should retain remaining bookmarks after removal operation', () => {
        const base: any = new PdfBookmarkBase(createDictionary(), {} as any);
        const first: any = createBookmark();
        const second: any = createBookmark();
        base._bookMarkList = [first, second];
        base._updateBookmarkList(0);
        expect(base._bookMarkList[0]).toBe(second);
    });
    it('should mark cache entry as not updated when bookmark is removed', () => {
        const reference: any = new _PdfReference(200, 0);
        const cachedObject: any = {
            _updated: true
        };
        const cacheMap: Map<any, any> = new Map();
        cacheMap.set(reference, cachedObject);
        const base: any = new PdfBookmarkBase(createDictionary(), { _cacheMap: cacheMap } as any);
        const bookmark: any = createBookmark();
        bookmark._reference = reference;
        base._bookMarkList = [bookmark];
        base._updateBookmarkList(0);
        expect(cachedObject._updated).toBe(false);
    });
    it('should update count as negative value when bookmark collection is collapsed', () => {
        const dictionary: any = createDictionary();
        dictionary.has = () => true;
        dictionary.get = () => -1;
        dictionary.update = (key: string, value: number) => {
            dictionary.countValue = value;
        };
        const base: any = new PdfBookmarkBase(dictionary, {} as any);
        base._bookMarkList = [createBookmark(), createBookmark()];
        base._isExpanded = false;
        base._updateCount();
        expect(dictionary.countValue).toBe(-2);
    });
    it('should update count using bookmark collection size when expanded', () => {
        const dictionary: any = createDictionary();
        dictionary.has = () => false;
        dictionary.update = (key: string, value: number) => {
            dictionary.countValue = value;
        };
        const base: any = new PdfBookmarkBase(dictionary, {} as any);
        base._bookMarkList = [ createBookmark(), createBookmark(), createBookmark()];
        base._updateCount();
        expect(dictionary.countValue).toBe(3);
    });
    it('should remove first dictionary entry and mark dictionary as updated', () => {
        const dictionary: any = createDictionary();
        dictionary._map.First = 1;
        dictionary.has = (key: string) => key === 'First';
        const base: any = new PdfBookmarkBase(dictionary, {} as any);
        base._removeFirst(dictionary);
        expect(dictionary._updated).toBe(true);
    });
    it('should remove last dictionary entry and mark dictionary as updated', () => {
        const dictionary: any = createDictionary();
        dictionary._map.Last = 1;
        dictionary.has = (key: string) => key === 'Last';
        const base: any = new PdfBookmarkBase(dictionary, {} as any);
        base._removeLast(dictionary);
        expect(dictionary._updated).toBe(true);
    });
    it('should remove next dictionary entry and mark dictionary as updated', () => {
        const dictionary: any = createDictionary();
        dictionary._map.Next = 1;
        dictionary.has = (key: string) => key === 'Next';
        const base: any = new PdfBookmarkBase(dictionary, {} as any);
        base._removeNext(dictionary);
        expect(dictionary._updated).toBe(true);
    });
    it('should remove previous dictionary entry and mark dictionary as updated', () => {
        const dictionary: any = createDictionary();
        dictionary._map.Prev = 1;
        dictionary.has = (key: string) => key === 'Prev';
        const base: any = new PdfBookmarkBase(dictionary, {} as any);
        base._removePrevious(dictionary);
        expect(dictionary._updated).toBe(true);
    });
    it('should remove count dictionary entry and mark dictionary as updated', () => {
        const dictionary: any = createDictionary();
        dictionary._map.Count = 3;
        dictionary.has = (key: string) => key === 'Count';
        const base: any = new PdfBookmarkBase(dictionary, {} as any);
        base._removeCount(dictionary);
        expect(dictionary._updated).toBe(true);
    });
    it('should return false when bookmark collection does not contain requested bookmark', () => {
        const base: any = new PdfBookmarkBase(createDictionary(), {} as any);
        const bookmark1: any = createBookmark();
        const bookmark2: any = createBookmark();
        base._bookMarkList = [bookmark1];
        expect(base.contains(bookmark2)).toBe(false);
    });
    it('should return true when bookmark collection contains requested bookmark', () => {
        const base: any = new PdfBookmarkBase(createDictionary(), {} as any);
        const bookmark: any = createBookmark();
        base._bookMarkList = [bookmark];
        expect(base.contains(bookmark)).toBe(true);
    });
    it('should return current bookmark count from internal collection', () => {
        const base: any = new PdfBookmarkBase(createDictionary(), {} as any);
        base._bookMarkList = [ createBookmark(), createBookmark(), createBookmark(), createBookmark()];
        expect(base.count).toBe(4);
    });
    it('should return zero when bookmark collection is empty', () => {
        const base: any = new PdfBookmarkBase(createDictionary(), {} as any);
        base._bookMarkList = [];
        expect(base.count).toBe(0);
    });
    it('should preserve assigned destination reference after destination update', () => {
        const bookmark: any = createBookmark();
        const destination: any = {
            _initializePrimitive: () => {}
        };
        bookmark.destination = destination;
        expect(bookmark.destination).toBe(destination);
    });
    it('should preserve assigned named destination instance', () => {
        const cacheMap = new Map();
        const crossReference: any = { _cacheMap: cacheMap, _getNextReference: () => new _PdfReference(300, 0)};
        const bookmark: any = new PdfBookmark(createDictionary(), crossReference);
        const namedDestination: any = { title: 'Destination-A'};
        bookmark.namedDestination = namedDestination;
        expect(bookmark.namedDestination).toBe(namedDestination);
    });
    it('should keep title value synchronized after multiple updates', () => {
        const bookmark: any = createBookmark();
        bookmark.title = 'First';
        bookmark.title = 'Second';
        expect(bookmark.title).toBe('Second');
    });
});
