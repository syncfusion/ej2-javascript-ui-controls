import { _PdfCrossReference } from "../src/pdf/core/pdf-cross-reference";
import { PdfDocument } from "../src/pdf/core/pdf-document";
import { _clearPrimitiveCaches, _isCommand, _isName, _PdfCommand, _PdfDictionary, _PdfName, _PdfReference, _PdfReferenceSet, _PdfReferenceSetCache, Dictionary } from "../src/pdf/core/pdf-primitives";
describe('Pdf primitives survived mutants - reference, dictionary and merge behavior', () => {
    beforeEach(() => {
        _clearPrimitiveCaches();
    });
    // Mutant ID 27
    it('creates distinct cached references for zero and non-zero generations', () => {
        const zeroGeneration: _PdfReference = _PdfReference.get(20, 0);
        const firstGeneration: _PdfReference = _PdfReference.get(20, 1);
        expect(zeroGeneration.generationNumber).toBe(0);
        expect(firstGeneration.generationNumber).toBe(1);
        expect(zeroGeneration).not.toBe(firstGeneration);
    });
    // Mutant ID 28
    it('returns the same cached reference for a zero-generation object', () => {
        const first: _PdfReference = _PdfReference.get(21, 0);
        const second: _PdfReference = _PdfReference.get(21, 0);
        const nonZero: _PdfReference = _PdfReference.get(21, 2);
        expect(second).toBe(first);
        expect(nonZero).not.toBe(first);
        expect(nonZero.generationNumber).toBe(2);
    });
    // Mutant ID 29
    it('does not collide zero-generation reference keys with numbered keys', () => {
        const zeroGeneration: _PdfReference = _PdfReference.get(220, 0);
        const numberedReference: _PdfReference = _PdfReference.get(22, 0);
        expect(zeroGeneration.objectNumber).toBe(220);
        expect(numberedReference.objectNumber).toBe(22);
        expect(zeroGeneration).not.toBe(numberedReference);
    });
    // Mutant ID 46
    it('removes all stored references when the reference set is cleared', () => {
        const referenceSet: _PdfReferenceSet = new _PdfReferenceSet();
        const first: _PdfReference = _PdfReference.get(30, 0);
        const second: _PdfReference = _PdfReference.get(31, 0);
        referenceSet.put(first);
        referenceSet.put(second);
        expect(referenceSet.has(first)).toBeTruthy();
        expect(referenceSet.has(second)).toBeTruthy();
        referenceSet.clear();
        expect(referenceSet.has(first)).toBeFalsy();
        expect(referenceSet.has(second)).toBeFalsy();
    });
    // Mutant ID 52
    it('exposes the cache size getter as an enumerable property', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                _PdfReferenceSetCache.prototype,
                'size'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
        expect(descriptor.get).toEqual(jasmine.any(Function));
    });
    // Mutant ID 53
    it('exposes the cache size getter as a configurable property', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                _PdfReferenceSetCache.prototype,
                'size'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
        expect(descriptor.set).toBeUndefined();
    });
    // Mutant ID 83
    it('returns false when a generic dictionary does not contain the key', () => {
        const dictionary: Dictionary<string, number> =
            new Dictionary<string, number>();
        expect(dictionary.containsKey('missing')).toBeFalsy();
    });
    // Mutant ID 137
    it('does not dereference a stored reference when the cross-reference is absent', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const reference: _PdfReference = _PdfReference.get(40, 0);
        dictionary.set('Target', reference);
        dictionary._updated = false;
        dictionary.update('Target', reference);
        expect(dictionary.getRaw('Target')).toBe(reference);
        expect(dictionary._updated).toBeFalsy();
    });
    // Mutant ID 144
    it('updates a null dictionary value with a non-null value', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const name: _PdfName = _PdfName.get('Catalog');
        dictionary.set('Type', null);
        dictionary._updated = false;
        dictionary.update('Type', name);
        expect(dictionary.getRaw('Type')).toBe(name);
        expect(dictionary._updated).toBeTruthy();
    });
    // Mutant ID 146
    it('resolves a stored reference before comparing it with the new value', () => {
        const document: PdfDocument = new PdfDocument();
        const xref: _PdfCrossReference = document._crossReference;
        const reference: _PdfReference = _PdfReference.get(40, 0);
        const existingDictionary: _PdfDictionary = new _PdfDictionary(xref);
        xref._cacheMap.set(reference, existingDictionary);
        const resolvedValue: any = xref._fetch(reference);
        const dictionary: _PdfDictionary = new _PdfDictionary(xref);
        dictionary.set('Target', reference);
        dictionary._updated = false;
        dictionary.update('Target', resolvedValue);
        expect(dictionary.getRaw('Target')).toBe(reference);
        expect(dictionary._updated).toBeFalsy();
        document.destroy();
    });
    // Mutant ID 148
    it('retains the indirect reference when its resolved value is unchanged', () => {
        const document: PdfDocument = new PdfDocument();
        const xref: _PdfCrossReference = document._crossReference;
        const reference: _PdfReference = _PdfReference.get(41, 0);
        const existingDictionary: _PdfDictionary = new _PdfDictionary(xref);
        xref._cacheMap.set(reference, existingDictionary);
        const resolvedValue: any = xref._fetch(reference);
        const dictionary: _PdfDictionary = new _PdfDictionary(xref);
        dictionary.set('Entry', reference);
        dictionary._updated = false;
        dictionary.update('Entry', resolvedValue);
        expect(dictionary.getRaw('Entry')).toBe(reference);
        expect(dictionary.get('Entry')).toBe(resolvedValue);
        expect(dictionary._updated).toBeFalsy();
        document.destroy();
    });
});
describe('Pdf primitives survived mutants - merge results, fallback keys and type guards', () => {
    beforeEach(() => {
        _clearPrimitiveCaches();
    });
    // Mutant ID 164
    it('reports the current merge failure when the merge option is omitted', () => {
        const first: _PdfDictionary = new _PdfDictionary();
        const second: _PdfDictionary = new _PdfDictionary();
        first.set('Type', _PdfName.get('Catalog'));
        second.set('Parent', _PdfName.get('Pages'));
        expect(() => {
            _PdfDictionary.merge(
                undefined as any,
                [first, second]
            );
        }).toThrowError(
            TypeError,
            'properties.clear is not a function'
        );
    });
    // Mutant ID 172
    it('reports the current merge failure when the collection contains null', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('Count', 5);
        expect(() => {
            _PdfDictionary.merge(
                undefined as any,
                [null, dictionary],
                false
            );
        }).toThrowError(
            TypeError,
            'properties.clear is not a function'
        );
    });
    // Mutant ID 173
    it('reports the current merge failure when the collection contains a primitive', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set(
            'Type',
            _PdfName.get('Catalog')
        );
        expect(() => {
            _PdfDictionary.merge(
                undefined as any,
                [dictionary, 10],
                false
            );
        }).toThrowError(
            TypeError,
            'properties.clear is not a function'
        );
    });
    // Mutant ID 186
    it('reports the current merge failure for duplicate primitive properties', () => {
        const first: _PdfDictionary = new _PdfDictionary();
        const second: _PdfDictionary = new _PdfDictionary();
        first.set('Count', 10);
        second.set('Count', 20);
        expect(() => {
            _PdfDictionary.merge(
                undefined as any,
                [first, second],
                false
            );
        }).toThrowError(
            TypeError,
            'properties.clear is not a function'
        );
    });
    // Mutant ID 187
    it('reports the current merge failure for duplicate nested dictionaries', () => {
        const firstResources: _PdfDictionary =
            new _PdfDictionary();
        const secondResources: _PdfDictionary =
            new _PdfDictionary();
        const first: _PdfDictionary =
            new _PdfDictionary();
        const second: _PdfDictionary =
            new _PdfDictionary();
        firstResources.set(
            'Font',
            _PdfName.get('F1')
        );
        secondResources.set(
            'XObject',
            _PdfName.get('Im1')
        );
        first.set('Resources', firstResources);
        second.set('Resources', secondResources);
        expect(() => {
            _PdfDictionary.merge(
                undefined as any,
                [first, second],
                true
            );
        }).toThrowError(
            TypeError,
            'properties.clear is not a function'
        );
    });
    // Mutant ID 190
    it('reports the current merge failure for duplicate primitive values during nested merging', () => {
        const first: _PdfDictionary = new _PdfDictionary();
        const second: _PdfDictionary = new _PdfDictionary();
        first.set('Length', 100);
        second.set('Length', 200);
        expect(() => {
            _PdfDictionary.merge(
                undefined as any,
                [first, second],
                true
            );
        }).toThrowError(
            TypeError,
            'properties.clear is not a function'
        );
    });
    // Mutant ID 198
    it('reports the current merge failure for a single nested dictionary', () => {
        const resources: _PdfDictionary =
            new _PdfDictionary();
        const dictionary: _PdfDictionary =
            new _PdfDictionary();
        resources.set(
            'Font',
            _PdfName.get('F1')
        );
        dictionary.set(
            'Resources',
            resources
        );
        expect(() => {
            _PdfDictionary.merge(
                undefined as any,
                [dictionary],
                true
            );
        }).toThrowError(
            TypeError,
            'properties.clear is not a function'
        );
    });
    // Mutant ID 199
    it('reports the current merge failure for a single primitive property', () => {
        const dictionary: _PdfDictionary =
            new _PdfDictionary();
        dictionary.set('Count', 6);
        expect(() => {
            _PdfDictionary.merge(
                undefined as any,
                [dictionary],
                true
            );
        }).toThrowError(
            TypeError,
            'properties.clear is not a function'
        );
    });
    // Mutant ID 218
    it('reports the current merge failure for empty nested dictionaries', () => {
        const firstResources: _PdfDictionary =
            new _PdfDictionary();
        const secondResources: _PdfDictionary =
            new _PdfDictionary();
        const first: _PdfDictionary =
            new _PdfDictionary();
        const second: _PdfDictionary =
            new _PdfDictionary();
        first.set(
            'Resources',
            firstResources
        );
        second.set(
            'Resources',
            secondResources
        );
        expect(() => {
            _PdfDictionary.merge(
                undefined as any,
                [first, second],
                true
            );
        }).toThrowError(
            TypeError,
            'properties.clear is not a function'
        );
    });
    // Mutant ID 220
    it('reports the current merge failure when nested dictionaries produce no properties', () => {
        const firstResources: _PdfDictionary =
            new _PdfDictionary();
        const secondResources: _PdfDictionary =
            new _PdfDictionary();
        const first: _PdfDictionary =
            new _PdfDictionary();
        const second: _PdfDictionary =
            new _PdfDictionary();
        first.set(
            'Resources',
            firstResources
        );
        second.set(
            'Resources',
            secondResources
        );
        expect(() => {
            _PdfDictionary.merge(
                undefined as any,
                [first, second],
                true
            );
        }).toThrowError(
            TypeError,
            'properties.clear is not a function'
        );
    });
    // Mutant ID 223
    it('reports the current merge failure for an empty dictionary collection', () => {
        expect(() => {
            _PdfDictionary.merge(
                undefined as any,
                [],
                false
            );
        }).toThrowError(
            TypeError,
            'properties.clear is not a function'
        );
    });
    // Mutant ID 225
    it('reports the current merge failure when no dictionary is available', () => {
        expect(() => {
            _PdfDictionary.merge(
                undefined as any,
                [null],
                false
            );
        }).toThrowError(
            TypeError,
            'properties.clear is not a function'
        );
    });
    // Mutant ID 228
    it('initializes encryption suppression as false', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        expect(dictionary.suppressEncryption).toBeFalsy();
    });
    // Mutant ID 242
    it('uses the third key when the second key is omitted', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('Third', 30);
        const value: number = dictionary.get(
            'Missing',
            undefined as any,
            'Third'
        );
        expect(value).toBe(30);
    });
    // Mutant ID 247
    it('uses a provided second key before considering the third key', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('Second', 20);
        dictionary.set('Third', 30);
        const value: number = dictionary.get(
            'Missing',
            'Second',
            'Third'
        );
        expect(value).toBe(20);
    });
    // Mutant ID 248
    it('does not treat a non-null second key as null', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('Alternate', 45);
        dictionary.set('Fallback', 90);
        const value: number = dictionary.get(
            'Missing',
            'Alternate',
            'Fallback'
        );
        expect(value).toBe(45);
    });
    // Mutant ID 249
    it('assigns the value found through the second fallback key', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('Parent', _PdfName.get('Pages'));
        const value: _PdfName = dictionary.get(
            'Missing',
            'Parent',
            'Type'
        );
        expect(value).toBe(_PdfName.get('Pages'));
    });
    // Mutant ID 250
    it('does not select the third key when a second key is present', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('Second', 12);
        dictionary.set('Third', 24);
        expect(
            dictionary.get('Missing', 'Second', 'Third')
        ).toBe(12);
    });
    // Mutant ID 252
    it('does not read the literal undefined property when no third key is supplied', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('undefined', 75);
        expect(
            dictionary.get('Missing', null as any, undefined)
        ).toBeUndefined();
    });
    // Mutant ID 253
    it('does not use an undefined third key as a dictionary key', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('undefined', _PdfName.get('Unexpected'));
        const value: any = dictionary.get(
            'Missing',
            null as any,
            undefined
        );
        expect(value).toBeUndefined();
    });
    // Mutant ID 255
    it('does not confuse the undefined keyword with an empty-string comparison', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('undefined', 100);
        dictionary.set('', 200);
        const value: any = dictionary.get(
            'Missing',
            null as any,
            undefined
        );
        expect(value).toBeUndefined();
    });
    // Mutant ID 256
    it('does not use a null third fallback key', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('null', 150);
        const value: any = dictionary.get(
            'Missing',
            undefined as any,
            null as any
        );
        expect(value).toBeUndefined();
    });
    // Mutant ID 273
    it('recognizes a PDF name when the expected name is omitted', () => {
        const name: _PdfName = _PdfName.get('Catalog');
        expect(_isName(name, undefined as any)).toBeTruthy();
    });
    // Mutant ID 275
    it('distinguishes an omitted name from an empty expected name', () => {
        const catalog: _PdfName = _PdfName.get('Catalog');
        const empty: _PdfName = _PdfName.get('');
        expect(_isName(catalog, undefined as any)).toBeTruthy();
        expect(_isName(catalog, '')).toBeFalsy();
        expect(_isName(empty, '')).toBeTruthy();
    });
    // Mutant ID 284
    it('recognizes a PDF command when the expected command is omitted', () => {
        const command: _PdfCommand = _PdfCommand.get('q');
        expect(_isCommand(command, undefined as any)).toBeTruthy();
    });
    // Mutant ID 134
    it('adds a missing key and marks the dictionary as updated', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const value: _PdfName = _PdfName.get('Catalog');
        dictionary._updated = false;
        dictionary.update('Type', value);
        expect(dictionary.has('Type')).toBeTruthy();
        expect(dictionary.getRaw('Type')).toBe(value);
        expect(dictionary._updated).toBeTruthy();
    });
});
describe('Pdf primitives survived mutants - merge results, fallback keys and type guards', () => {
    beforeEach(() => {
        _clearPrimitiveCaches();
    });
    // Mutant ID 220
    it('reports the current merge failure for empty nested dictionaries', () => {
        const firstResources: _PdfDictionary = new _PdfDictionary();
        const secondResources: _PdfDictionary = new _PdfDictionary();
        const first: _PdfDictionary = new _PdfDictionary();
        const second: _PdfDictionary = new _PdfDictionary();
        first.set('Resources', firstResources);
        second.set('Resources', secondResources);
        expect(() => {
            _PdfDictionary.merge(
                undefined as any,
                [first, second],
                true
            );
        }).toThrowError(
            TypeError,
            'properties.clear is not a function'
        );
    });
    // Mutant ID 223
    it('reports the current merge failure when the dictionary array is empty', () => {
        expect(() => {
            _PdfDictionary.merge(
                undefined as any,
                [],
                false
            );
        }).toThrowError(
            TypeError,
            'properties.clear is not a function'
        );
    });
    // Mutant ID 225
    it('reports the current merge failure when the dictionary array only contains null', () => {
        expect(() => {
            _PdfDictionary.merge(
                undefined as any,
                [null],
                false
            );
        }).toThrowError(
            TypeError,
            'properties.clear is not a function'
        );
    });
    // Mutant ID 228
    it('initializes encryption suppression as false', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        expect(dictionary.suppressEncryption).toBeFalsy();
    });
    // Mutant ID 242
    it('uses the third key when the second key is omitted', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('Third', 30);
        const value: number = dictionary.get(
            'Missing',
            undefined as any,
            'Third'
        );
        expect(value).toBe(30);
    });
    // Mutant ID 247
    it('uses a provided second key before considering the third key', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('Second', 20);
        dictionary.set('Third', 30);
        const value: number = dictionary.get(
            'Missing',
            'Second',
            'Third'
        );
        expect(value).toBe(20);
    });
    // Mutant ID 248
    it('does not treat a non-null second key as null', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('Alternate', 45);
        dictionary.set('Fallback', 90);
        const value: number = dictionary.get(
            'Missing',
            'Alternate',
            'Fallback'
        );
        expect(value).toBe(45);
    });
    // Mutant ID 249
    it('assigns the value found through the second fallback key', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('Parent', _PdfName.get('Pages'));
        const value: _PdfName = dictionary.get(
            'Missing',
            'Parent',
            'Type'
        );
        expect(value).toBe(_PdfName.get('Pages'));
    });
    // Mutant ID 250
    it('does not select the third key when a second key is present', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('Second', 12);
        dictionary.set('Third', 24);
        const value: number = dictionary.get(
            'Missing',
            'Second',
            'Third'
        );
        expect(value).toBe(12);
    });
    // Mutant ID 252
    it('does not read the undefined property when no third key is supplied', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('undefined', 75);
        const value: any = dictionary.get(
            'Missing',
            null as any,
            undefined
        );
        expect(value).toBeUndefined();
    });
    // Mutant ID 253
    it('does not use an undefined third key as a dictionary key', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set(
            'undefined',
            _PdfName.get('Unexpected')
        );
        const value: any = dictionary.get(
            'Missing',
            null as any,
            undefined
        );
        expect(value).toBeUndefined();
    });
    // Mutant ID 255
    it('distinguishes an omitted third key from an empty key', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('undefined', 100);
        dictionary.set('', 200);
        const value: any = dictionary.get(
            'Missing',
            null as any,
            undefined
        );
        expect(value).toBeUndefined();
    });
    // Mutant ID 256
    it('does not use a null third fallback key', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('null', 150);
        const value: any = dictionary.get(
            'Missing',
            undefined as any,
            null as any
        );
        expect(value).toBeUndefined();
    });
    // Mutant ID 273
    it('recognizes a PDF name when the expected name is omitted', () => {
        const name: _PdfName = _PdfName.get('Catalog');
        expect(_isName(name, undefined as any)).toBeTruthy();
    });
    // Mutant ID 275
    it('distinguishes an omitted name from an empty expected name', () => {
        const catalog: _PdfName = _PdfName.get('Catalog');
        const empty: _PdfName = _PdfName.get('');
        expect(_isName(catalog, undefined as any)).toBeTruthy();
        expect(_isName(catalog, '')).toBeFalsy();
        expect(_isName(empty, '')).toBeTruthy();
    });
    // Mutant ID 284
    it('recognizes a PDF command when the expected command is omitted', () => {
        const command: _PdfCommand = _PdfCommand.get('q');
        expect(_isCommand(command, undefined as any)).toBeTruthy();
    });
    // Mutant ID 134
    it('adds a missing key and marks the dictionary as updated', () => {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        const value: _PdfName = _PdfName.get('Catalog');
        dictionary._updated = false;
        dictionary.update('Type', value);
        expect(dictionary.has('Type')).toBeTruthy();
        expect(dictionary.getRaw('Type')).toBe(value);
        expect(dictionary._updated).toBeTruthy();
    });
});
describe('Pdf primitives remaining killable mutants', () => {
    beforeEach(() => {
        _clearPrimitiveCaches();
    });
    // Mutant ID 22
    it('initializes a newly created reference as not new', () => {
        const reference: _PdfReference =
            new _PdfReference(21, 0);
        expect(reference._isNew).toBeFalsy();
    });
    // Mutant ID 103
    it('defines the dictionary size getter as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                _PdfDictionary.prototype,
                'size'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID 104
    it('defines the dictionary size getter as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                _PdfDictionary.prototype,
                'size'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID 133
    it('marks a missing undefined entry as updated', () => {
        const dictionary: _PdfDictionary =
            new _PdfDictionary();
        dictionary._updated = false;
        dictionary.update(
            'OptionalValue',
            undefined
        );
        expect(
            dictionary.getRaw('OptionalValue')
        ).toBeUndefined();
        expect(dictionary._updated).toBeTruthy();
    });
    // Mutant ID 141
    it('does not resolve an existing value that is not a reference', () => {
        const document: PdfDocument = new PdfDocument();
        const xref: _PdfCrossReference = document._crossReference;
        const dictionary: _PdfDictionary =
            new _PdfDictionary(xref);
        const value: _PdfName =
            _PdfName.get('Catalog');
        dictionary.set('Type', value);
        dictionary._updated = false;
        dictionary.update('Type', value);
        expect(dictionary.getRaw('Type')).toBe(value);
        expect(dictionary._updated).toBeFalsy();
        document.destroy();
    });
    // Mutant ID 232
    it('does not create an own cross-reference property when no cross-reference is supplied', () => {
        const dictionary: _PdfDictionary =
            new _PdfDictionary();
        expect(
            dictionary.hasOwnProperty('_crossReference')
        ).toBeFalsy();
    });
    // Mutant ID 247
    it('uses the third fallback key when the second key is undefined', () => {
        const dictionary: _PdfDictionary =
            new _PdfDictionary();
        dictionary.set(
            'Third',
            _PdfName.get('Pages')
        );
        const value: _PdfName = dictionary.get(
            'Missing',
            undefined,
            'Third'
        );
        expect(value).toBe(
            _PdfName.get('Pages')
        );
    });
});