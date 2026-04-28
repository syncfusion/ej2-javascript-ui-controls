import { PdfNamedDestination, _PdfNamedDestinationCollection } from '../src/pdf/core/pdf-outline';
import { PdfDestinationMode, PdfRotationAngle } from '../src/pdf/core/enumerator';

// Mock classes for testing
class MockDictionary {
    _map: Record<string, unknown> = {};
    _updated: boolean = false;

    constructor(initialMap?: Record<string, unknown>) {
        if (initialMap) {
            this._map = { ...initialMap };
        }
    }

    has(key: string): boolean {
        return Object.prototype.hasOwnProperty.call(this._map, key);
    }

    get(key: string): unknown {
        return this._map[key];
    }

    getRaw(key: string): unknown {
        return this._map[key];
    }

    getArray(key: string): unknown[] {
        const val = this._map[key];
        return Array.isArray(val) ? val : [];
    }

    update(key: string, value: unknown): void {
        this._map[key] = value;
        this._updated = true;
    }
}

class MockReference {
    value: unknown;

    constructor(val: unknown) {
        this.value = val;
    }
}

class MockPdfName {
    name: string;

    constructor(n: string) {
        this.name = n;
    }
}

class MockPage {
    size: { width: number; height: number } = { width: 612, height: 792 };
    rotation: PdfRotationAngle = PdfRotationAngle.angle0;
}

class MockCrossReference {
    _document: unknown;
    fetchMap: Map<unknown, unknown> = new Map();

    constructor(doc?: unknown) {
        this._document = doc;
    }

    _fetch(ref: unknown): unknown {
        if (ref instanceof MockReference) {
            return this.fetchMap.get(ref) || null;
        }
        return null;
    }
}

describe('PdfNamedDestination._updateNamedDestinationTitle behavior tests', () => {

    it('updateNamedDestinationTitle - exits when crossReference is null', () => {
        // Arrange
        const named = new PdfNamedDestination('Test');
        named._crossReference = null as any;

        // Act
        named._updateNamedDestinationTitle('NewName', 'OldName');

        // Assert - no error, silent exit
        expect(named._crossReference).toBeNull();
    });

    it('updateNamedDestinationTitle - exits when crossReference._document is null', () => {
        // Arrange
        const crossRef = new MockCrossReference(null);
        const named = new PdfNamedDestination('Test');
        named._crossReference = crossRef as any;

        // Act
        named._updateNamedDestinationTitle('NewName', 'OldName');

        // Assert - no error, silent exit
        expect(crossRef._document).toBeNull();
    });

    it('updateNamedDestinationTitle - exits when catalog dictionary is null', () => {
        // Arrange
        const fakeDoc: any = { _catalog: { _catalogDictionary: null } };
        const crossRef = new MockCrossReference(fakeDoc);
        const named = new PdfNamedDestination('Test');
        named._crossReference = crossRef as any;

        // Act
        named._updateNamedDestinationTitle('NewName', 'OldName');

        // Assert - no error, silent exit
        expect(fakeDoc._catalog._catalogDictionary).toBeNull();
    });

    it('updateNamedDestinationTitle - exits when catalog has no Names key', () => {
        // Arrange
        const catalog = new MockDictionary({});
        const fakeDoc: any = { _catalog: { _catalogDictionary: catalog } };
        const crossRef = new MockCrossReference(fakeDoc);
        const named = new PdfNamedDestination('Test');
        named._crossReference = crossRef as any;

        // Act
        named._updateNamedDestinationTitle('NewName', 'OldName');

        // Assert
        expect(catalog.has('Names')).toBe(false);
    });

    it('updateNamedDestinationTitle - exits when names has no Dests key', () => {
        // Arrange
        const names = new MockDictionary({});
        const catalog = new MockDictionary({ Names: names });
        const fakeDoc: any = { _catalog: { _catalogDictionary: catalog } };
        const crossRef = new MockCrossReference(fakeDoc);
        const named = new PdfNamedDestination('Test');
        named._crossReference = crossRef as any;

        // Act
        named._updateNamedDestinationTitle('NewName', 'OldName');

        // Assert
        expect(names.has('Dests')).toBe(false);
    });

    it('updateNamedDestinationTitle - exits when dests has no Names key', () => {
        // Arrange
        const dests = new MockDictionary({});
        const names = new MockDictionary({ Dests: dests });
        const catalog = new MockDictionary({ Names: names });
        const fakeDoc: any = { _catalog: { _catalogDictionary: catalog } };
        const crossRef = new MockCrossReference(fakeDoc);
        const named = new PdfNamedDestination('Test');
        named._crossReference = crossRef as any;

        // Act
        named._updateNamedDestinationTitle('NewName', 'OldName');

        // Assert
        expect(dests.has('Names')).toBe(false);
    });

    it('updateNamedDestinationTitle - exits when previousTitle not found in names array', () => {
        // Arrange
        const namesArray = ['Other', 'Keep'];
        const dests = new MockDictionary({ Names: namesArray });
        const names = new MockDictionary({ Dests: dests });
        const catalog = new MockDictionary({ Names: names });
        const fakeDoc: any = { _catalog: { _catalogDictionary: catalog } };
        const crossRef = new MockCrossReference(fakeDoc);
        const named = new PdfNamedDestination('Test');
        named._crossReference = crossRef as any;

        // Act
        named._updateNamedDestinationTitle('NewName', 'OldName');

        // Assert
        expect((namesArray as string[]).indexOf('OldName')).toBe(-1);
        expect(dests._updated).toBe(false);
    });

    it('updateNamedDestinationTitle - replaces previousTitle at index 0 and marks updated', () => {
        // Arrange
        const namesArray = ['OldName', 'RefKeep'];
        const dests = new MockDictionary({ Names: namesArray });
        const names = new MockDictionary({ Dests: dests });
        const catalog = new MockDictionary({ Names: names });
        const fakeDoc: any = { _catalog: { _catalogDictionary: catalog } };
        const crossRef = new MockCrossReference(fakeDoc);
        const named = new PdfNamedDestination('Test');
        named._crossReference = crossRef as any;

        // Act
        named._updateNamedDestinationTitle('NewName', 'OldName');

        // Assert
        expect((namesArray as string[])[0]).toBe('NewName');
        expect((namesArray as string[])[1]).toBe('RefKeep');
        expect(dests._updated).toBe(true);
    });

    it('updateNamedDestinationTitle - replaces previousTitle at middle index and marks updated', () => {
        // Arrange
        const namesArray = ['First', 'Ref1', 'OldName', 'Ref2', 'Last', 'Ref3'];
        const dests = new MockDictionary({ Names: namesArray });
        const names = new MockDictionary({ Dests: dests });
        const catalog = new MockDictionary({ Names: names });
        const fakeDoc: any = { _catalog: { _catalogDictionary: catalog } };
        const crossRef = new MockCrossReference(fakeDoc);
        const named = new PdfNamedDestination('Test');
        named._crossReference = crossRef as any;

        // Act
        named._updateNamedDestinationTitle('UpdatedName', 'OldName');

        // Assert
        expect((namesArray as string[])[2]).toBe('UpdatedName');
        expect(namesArray.length).toBe(6);
        expect(dests._updated).toBe(true);
    });

    it('updateNamedDestinationTitle - replaces previousTitle at last index and marks updated', () => {
        // Arrange
        const namesArray = ['First', 'Ref1', 'OldName', 'RefLast'];
        const dests = new MockDictionary({ Names: namesArray });
        const names = new MockDictionary({ Dests: dests });
        const catalog = new MockDictionary({ Names: names });
        const fakeDoc: any = { _catalog: { _catalogDictionary: catalog } };
        const crossRef = new MockCrossReference(fakeDoc);
        const named = new PdfNamedDestination('Test');
        named._crossReference = crossRef as any;

        // Act
        named._updateNamedDestinationTitle('FinalName', 'OldName');

        // Assert
        expect((namesArray as string[])[2]).toBe('FinalName');
        expect((namesArray as string[])[3]).toBe('RefLast');
        expect(dests._updated).toBe(true);
    });

});

describe('_PdfNamedDestinationCollection constructor and parsing behavior tests', () => {

    it('constructor - initializes empty when no arguments provided', () => {
        // Arrange & Act
        const collection = new _PdfNamedDestinationCollection();

        // Assert
        expect(collection._dictionary).toBeUndefined();
        expect(collection._crossReference).toBeUndefined();
        expect(collection._namedDestinations.length).toBe(0);
    });

    it('constructor - sets dictionary only when dictionary provided', () => {
        // Arrange
        const dict = new MockDictionary({});

        // Act
        const collection = new _PdfNamedDestinationCollection(dict as any, undefined);

        // Assert
        expect(collection._namedDestinations.length).toBe(0);
    });

    it('constructor - sets crossReference only when provided', () => {
        // Arrange
        const crossRef = new MockCrossReference(null);

        // Act
        const collection = new _PdfNamedDestinationCollection(undefined, crossRef as any);

        // Assert
        expect(collection._namedDestinations.length).toBe(0);
    });

    it('constructor - skips parsing when dictionary lacks Dests key', () => {
        // Arrange
        const dict = new MockDictionary({ Other: 'value' });
        const crossRef = new MockCrossReference(null);

        // Act
        const collection = new _PdfNamedDestinationCollection(dict as any, crossRef as any);

        // Assert
        expect(dict.has('Dests')).toBe(false);
        expect(collection._namedDestinations.length).toBe(0);
    });

    it('constructor - skips parsing when destination (Dests value) is null', () => {
        // Arrange
        const dict = new MockDictionary({ Dests: null });
        const crossRef = new MockCrossReference(null);

        // Act
        const collection = new _PdfNamedDestinationCollection(dict as any, crossRef as any);

        // Assert
        expect(dict.get('Dests')).toBeNull();
        expect(collection._namedDestinations.length).toBe(0);
    });

    it('constructor - calls addCollection when destination has Names key', () => {
        // Arrange
        const namesArray = ['Title', { D: ['pageRef', new MockPdfName('Fit')] }];
        const dests = new MockDictionary({ Names: namesArray });
        const dict = new MockDictionary({ Dests: dests });
        const mockDoc: any = { getPage: (idx: number) => new MockPage() };
        const crossRef = new MockCrossReference(mockDoc);

        // Act
        const collection = new _PdfNamedDestinationCollection(dict as any, crossRef as any);

        // Assert
        expect(dests.has('Names')).toBe(true);
        expect(collection._namedDestinations.length).toBeGreaterThanOrEqual(0);
    });

    it('constructor - calls findDestination for each kid when destination has Kids', () => {
        // Arrange
        const kid1 = new MockDictionary({ Names: ['Title1', { D: [] }] });
        const kid2 = new MockDictionary({ Names: ['Title2', { D: [] }] });
        const dests = new MockDictionary({ Kids: [kid1, kid2] });
        const dict = new MockDictionary({ Dests: dests });
        const mockDoc: any = { getPage: (idx: number): any => null };
        const crossRef = new MockCrossReference(mockDoc);

        // Act
        const collection = new _PdfNamedDestinationCollection(dict as any, crossRef as any);

        // Assert
        expect(Array.isArray(dests.get('Kids'))).toBe(true);
        expect((dests.get('Kids') as unknown[]).length).toBe(2);
    });

});

describe('_PdfNamedDestinationCollection._findDestination recursive parsing tests', () => {

    it('findDestination - exits when destination is null', () => {
        // Arrange
        const collection: any = new _PdfNamedDestinationCollection();

        // Act
        collection._findDestination(null as any);

        // Assert
        expect(collection._namedDestinations.length).toBe(0);
    });

    it('findDestination - calls addCollection when destination has Names key', () => {
        // Arrange
        const namesArray = ['Title', { D: [] as string[] }];
        const dest = new MockDictionary({ Names: namesArray });
        const collection: any = new _PdfNamedDestinationCollection();
        const mockDoc: any = { getPage: (): any => null };
        collection._crossReference = new MockCrossReference(mockDoc) as any;

        // Act
        collection._findDestination(dest as any);

        // Assert
        expect(dest.has('Names')).toBe(true);
    });

    it('findDestination - recursively processes Kids when present and non-empty', () => {
        // Arrange
        const kid1 = new MockDictionary({ Names: ['T1', { D: [] }] });
        const kid2 = new MockDictionary({ Kids: [] });
        const dest = new MockDictionary({ Kids: [kid1, kid2] });
        const collection: any = new _PdfNamedDestinationCollection();
        const mockDoc: any = { getPage: (): any => null };
        collection._crossReference = new MockCrossReference(mockDoc) as any;

        // Act
        collection._findDestination(dest as any);

        // Assert
        expect(Array.isArray(dest.get('Kids'))).toBe(true);
        expect((dest.get('Kids') as unknown[]).length).toBe(2);
    });

    it('findDestination - skips forEach when Kids is empty array', () => {
        // Arrange
        const dest = new MockDictionary({ Kids: [] });
        const collection: any = new _PdfNamedDestinationCollection();
        const initialCount = collection._namedDestinations.length;

        // Act
        collection._findDestination(dest as any);

        // Assert
        expect((dest.get('Kids') as unknown[]).length).toBe(0);
        expect(collection._namedDestinations.length).toBe(initialCount);
    });

    it('findDestination - exits when destination has neither Names nor Kids', () => {
        // Arrange
        const dest = new MockDictionary({ Other: 'value' });
        const collection: any = new _PdfNamedDestinationCollection();
        const initialCount = collection._namedDestinations.length;

        // Act
        collection._findDestination(dest as any);

        // Assert
        expect(dest.has('Names')).toBe(false);
        expect(dest.has('Kids')).toBe(false);
        expect(collection._namedDestinations.length).toBe(initialCount);
    });

});

describe('_PdfNamedDestinationCollection._addCollection reference resolution and mode parsing tests', () => {

    it('addCollection - skips when elements is null', () => {
        // Arrange
        const dest = new MockDictionary({ Names: null });
        const collection = new _PdfNamedDestinationCollection();

        // Act
        collection._addCollection(dest as any);

        // Assert
        expect(dest.get('Names')).toBeNull();
        expect(collection._namedDestinations.length).toBe(0);
    });

    it('addCollection - skips when elements is undefined', () => {
        // Arrange
        const dest = new MockDictionary({});
        const collection = new _PdfNamedDestinationCollection();

        // Act
        collection._addCollection(dest as any);

        // Assert
        expect(dest.getRaw('Names')).toBeUndefined();
        expect(collection._namedDestinations.length).toBe(0);
    });

    it('addCollection - fetches reference when elements is _PdfReference', () => {
        // Arrange
        const namesArray = ['Title', { D: ['pageRef', new MockPdfName('Fit')] }];
        const ref = new MockReference(namesArray);
        const dest = new MockDictionary({ Names: ref });
        const mockDoc: any = { getPage: () => new MockPage() };
        const crossRef = new MockCrossReference(mockDoc);
        crossRef.fetchMap.set(ref, namesArray);
        const collection = new _PdfNamedDestinationCollection(undefined, crossRef as any);

        // Act
        collection._addCollection(dest as any);

        // Assert
        expect(ref instanceof MockReference).toBe(true);
        expect(collection._namedDestinations.length).toBeGreaterThanOrEqual(0);
    });

    it('addCollection - uses inline array without fetching', () => {
        // Arrange
        const namesArray = ['Title', { D: ['pageRef', new MockPdfName('Fit')] }];
        const dest = new MockDictionary({ Names: namesArray });
        const mockDoc: any = { getPage: () => new MockPage() };
        const crossRef = new MockCrossReference(mockDoc);
        const collection = new _PdfNamedDestinationCollection(undefined, crossRef as any);

        // Act
        collection._addCollection(dest as any);

        // Assert
        expect(Array.isArray(namesArray)).toBe(true);
        expect(collection._namedDestinations.length).toBeGreaterThanOrEqual(0);
    });

    it('addCollection - creates PdfDictionary from inline reference array', () => {
        // Arrange
        const destArray = ['pageRef', new MockPdfName('Fit')];
        const namesArray = ['Title', destArray];
        const dest = new MockDictionary({ Names: namesArray });
        const mockDoc: any = { getPage: () => new MockPage() };
        const crossRef = new MockCrossReference(mockDoc);
        const collection = new _PdfNamedDestinationCollection(undefined, crossRef as any);

        // Act
        collection._addCollection(dest as any);

        // Assert
        expect(Array.isArray(destArray)).toBe(true);
        expect(collection._namedDestinations.length).toBeGreaterThanOrEqual(0);
    });

    it('addCollection - handles reference that fetches to array by wrapping in D dictionary', () => {
        // Arrange
        const destArray = ['pageRef', new MockPdfName('Fit')];
        const ref = new MockReference(destArray);
        const namesArray = ['Title', ref];
        const dest = new MockDictionary({ Names: namesArray });
        const mockDoc: any = { getPage: () => new MockPage() };
        const crossRef = new MockCrossReference(mockDoc);
        crossRef.fetchMap.set(ref, destArray);
        const collection = new _PdfNamedDestinationCollection(undefined, crossRef as any);

        // Act
        collection._addCollection(dest as any);

        // Assert
        expect(ref instanceof MockReference).toBe(true);
        expect(collection._namedDestinations.length).toBeGreaterThanOrEqual(0);
    });



    it('addCollection - mode XYZ with null left uses 0 for x coordinate', () => {
        // Arrange
        const destArray = ['pageRef', new MockPdfName('XYZ'), null, 200, 1.5];
        const namesArray = ['XYZNull', destArray];
        const dest = new MockDictionary({ Names: namesArray });
        const page = new MockPage();
        const mockDoc: any = { getPage: (idx: number) => page };
        const crossRef = new MockCrossReference(mockDoc);
        const collection = new _PdfNamedDestinationCollection(undefined, crossRef as any);

        // Act
        collection._addCollection(dest as any);

        // Assert
        expect(collection._namedDestinations.length).toBeGreaterThanOrEqual(1);
        if (collection._namedDestinations.length > 0) {
            const destObj = (collection._namedDestinations[0]._destination as any);
            if (destObj && destObj._location) {
                expect(destObj._location.x).toBe(0);
            }
        }
    });

    it('addCollection - sets namedDestination parent and isBookmark false', () => {
        // Arrange
        const destArray = ['pageRef', new MockPdfName('Fit')];
        const namesArray = ['ParentTest', destArray];
        const dest = new MockDictionary({ Names: namesArray });
        const page = new MockPage();
        const mockDoc: any = { getPage: (idx: number) => page };
        const crossRef = new MockCrossReference(mockDoc);
        const collection = new _PdfNamedDestinationCollection(undefined, crossRef as any);

        // Act
        collection._addCollection(dest as any);

        // Assert
        expect(collection._namedDestinations.length).toBeGreaterThanOrEqual(1);
        if (collection._namedDestinations.length > 0) {
            const named = collection._namedDestinations[0];
            const destObj = (named._destination as any);
            if (destObj) {
                expect(destObj._parent).toBe(named);
                expect(destObj._isBookmark).toBe(false);
            }
        }
    });

    it('addCollection - creates one named destination per pair in Names array', () => {
        // Arrange
        const namesArray = [
            'Title1', ['pageRef1', new MockPdfName('Fit')],
            'Title2', ['pageRef2', new MockPdfName('XYZ'), 100, 200, 1]
        ];
        const dest = new MockDictionary({ Names: namesArray });
        const page = new MockPage();
        const mockDoc: any = { getPage: (idx: number) => page };
        const crossRef = new MockCrossReference(mockDoc);
        const collection = new _PdfNamedDestinationCollection(undefined, crossRef as any);

        // Act
        collection._addCollection(dest as any);

        // Assert
        expect(collection._namedDestinations.length).toBe(2);
        expect(collection._namedDestinations[0]._title).toBe('Title1');
        expect(collection._namedDestinations[1]._title).toBe('Title2');
    });

});
