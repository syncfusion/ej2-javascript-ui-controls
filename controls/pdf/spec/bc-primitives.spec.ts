import { _PdfName, _PdfCommand, _PdfReference, _PdfReferenceSet, _PdfReferenceSetCache, _clearPrimitiveCaches, Dictionary, _PdfDictionary, _PdfNull, _isName, _isCommand } from '../src/pdf/core/pdf-primitives';

describe('PdfPrimitives: _PdfReference.get key formation and caching', () => {

    beforeEach(() => {
        _clearPrimitiveCaches();
    });

    it('returns the same instance and correct toString when generationNumber === 0', () => {
        // Arrange
        const firstRef = _PdfReference.get(10, 0);
        // Act
        const secondRef = _PdfReference.get(10, 0);
        // Assert
        expect(firstRef).toBeDefined();
        expect(secondRef).toBeDefined();
        expect(firstRef).toBe(secondRef);
        expect(firstRef.toString()).toBe('10 0');
    });

    it('returns the same instance and correct toString when generationNumber > 0', () => {
        // Arrange
        const firstRef = _PdfReference.get(5, 2);
        // Act
        const secondRef = _PdfReference.get(5, 2);
        // Assert
        expect(firstRef).toBeDefined();
        expect(secondRef).toBeDefined();
        expect(firstRef).toBe(secondRef);
        expect(firstRef.toString()).toBe('5 2');
    });

    it('PdfReferenceSet - parent copied on construction and has/put/remove behavior', () => {
        // Arrange
        const parentSet = new _PdfReferenceSet();
        const ref = _PdfReference.get(2, 0);
        parentSet.put(ref);
        // Act
        const childSet = new _PdfReferenceSet(parentSet);
        // Assert
        expect(parentSet.has(ref)).toBeTruthy();
        expect(childSet.has(ref)).toBeTruthy();
        // Act - remove from child and ensure parent still has it (they are independent copies)
        childSet.remove(ref);
        // Assert
        expect(childSet.has(ref)).toBeFalsy();
        expect(parentSet.has(ref)).toBeTruthy();
    });

    it('PdfReferenceSetCache - put/get/has/size/set by id/clear branches', () => {
        // Arrange
        const cache = new _PdfReferenceSetCache();
        const ref = _PdfReference.get(7, 0);
        // Act
        cache.put(ref, 'first');
        // Assert
        expect(cache.size).toBe(1);
        expect(cache.get(ref)).toBe('first');
        expect(cache.has(ref)).toBeTruthy();
        // Act - set by string id
        cache.set(ref.toString(), 'second');
        // Assert - get via ref returns updated value
        expect(cache.get(ref)).toBe('second');
        // Act - clear
        cache.clear();
        // Assert
        expect(cache.size).toBe(0);
        expect(cache.has(ref)).toBeFalsy();
    });

    it('Dictionary.containsKey - absent and present cases plus keys and _size', () => {
        // Arrange
        const dict = new Dictionary<string, number>();
        // Assert absent
        expect(dict.containsKey('missing')).toBeFalsy();
        // Act - add value
        dict.setValue('a', 1);
        // Assert present and other behaviors
        expect(dict.containsKey('a')).toBeTruthy();
        expect(dict.getValue('a')).toBe(1);
        expect(dict.keys()).toEqual(jasmine.arrayContaining(['a']));
        expect(dict._size()).toBe(1);
    });

    it('PdfDictionary.get and getArray resolve _PdfReference via crossReference._fetch', () => {
        // Arrange
        const dict = new _PdfDictionary(null);
        const ref = _PdfReference.get(3, 0);
        const fakeXref = { _fetch: jasmine.createSpy('_fetch').and.callFake((r: any) => 'resolved:' + r.toString()) } as any;
        dict.assignXref(fakeXref);
        dict.set('refKey', ref);
        dict.set('arrKey', [ref, 'plain']);
        // Act
        const resolved = dict.get('refKey');
        const arr = dict.getArray('arrKey');
        // Assert
        expect(fakeXref._fetch).toHaveBeenCalledWith(ref);
        expect(resolved).toBe('resolved:' + ref.toString());
        expect(Array.isArray(arr)).toBeTruthy();
        expect(arr[0]).toBe('resolved:' + ref.toString());
        expect(arr[1]).toBe('plain');
        // Also assert getArray returns non-array raw values unchanged when not an array
        dict.set('plainKey', 'value');
        expect(dict.getArray('plainKey')).toBe('value');
    });

    it('PdfDictionary.getRaw returns raw _PdfReference and does not call _fetch', () => {
        // Arrange
        const dict = new _PdfDictionary(null);
        const ref = _PdfReference.get(11, 0);
        const fakeXref = { _fetch: jasmine.createSpy('_fetch') } as any;
        dict.assignXref(fakeXref);
        dict.set('Parent', ref);
        // Act
        const raw = dict.getRaw('Parent');
        // Assert - getRaw returns the raw reference and does not call _fetch
        expect(raw).toBe(ref);
        expect(fakeXref._fetch).not.toHaveBeenCalled();
        // Act - calling get should call _fetch and return resolved
        fakeXref._fetch.and.callFake((r: any) => 'resolved:' + r.toString());
        const resolved = dict.get('Parent');
        // Assert
        expect(fakeXref._fetch).toHaveBeenCalledWith(ref);
        expect(resolved).toBe('resolved:' + ref.toString());
    });

    it('PdfDictionary.getRawValues returns underlying values property when present', () => {
        // Arrange
        const dict = new _PdfDictionary(null);
        // By default the underlying map has no `values` property, so expect undefined
        expect(dict.getRawValues()).toBeUndefined();
        // Act - set a values property on the internal map and verify it is returned
        const sampleValues = ['one', 'two'];
        dict._map.values = sampleValues;
        // Assert
        expect(dict.getRawValues()).toBe(sampleValues);
    });
    it('_PdfDictionary.merge throws when input contains non-_PdfDictionary entries', () => {
        // Arrange
        const dict = new _PdfDictionary(null);
        // Act & Assert - passing non-dictionary should still lead to internal failure (TypeError)
        expect(() => {
            _PdfDictionary.merge(null, [null, {} as any]);
        }).toThrow();
    });

    it('_PdfDictionary.merge throws when dictionaries use array-backed _map', () => {
        // Arrange
        const d1 = new _PdfDictionary(null);
        const d2 = new _PdfDictionary(null);
        // Make _map an array of [key, value] tuples to exercise the internal loop
        d1._map = [['A', 1]] as any;
        d2._map = [['B', 2]] as any;
        // Act & Assert
        expect(() => {
            _PdfDictionary.merge(null, [d1, d2]);
        }).toThrow();
    });

    it('_PdfDictionary.merge throws with mergeSubDictionary true for sub-dictionary merging', () => {
        // Arrange
        const parent1 = new _PdfDictionary(null);
        const sub1 = new _PdfDictionary(null);
        sub1._map = [['x', 1]] as any;
        parent1._map = [['shared', sub1]] as any;
        const parent2 = new _PdfDictionary(null);
        const sub2 = new _PdfDictionary(null);
        sub2._map = [['y', 2]] as any;
        parent2._map = [['shared', sub2]] as any;
        // Act & Assert
        expect(() => {
            _PdfDictionary.merge(null, [parent1, parent2], true);
        }).toThrow();
    });

    it('PdfDictionary.getEmpty throws when calling set', () => {
        // Arrange

        const empty = _PdfDictionary.getEmpty(null);
        // Act & Assert
        expect(() => {
            empty.set('k', 'v');
        }).toThrowError('Should not call set on the empty dictionary.');
    });

    it('PdfDictionary defaults and _get key3 fallback plus forEach', () => {
        // defaults set by _initialize
        const d = new _PdfDictionary(null);
        expect(d._isFont).toBeFalsy();
        expect(d._isProcessed).toBeFalsy();
        expect(d._isSignature).toBeFalsy();
        expect(d.isCatalog).toBeFalsy();
        expect(d._isNew).toBeFalsy();
        // _get fallback to key3 when key2 is undefined
        d.set('c', 'val-c');
        expect(d.get('a', undefined, 'c')).toBe('val-c');
        // forEach iterates raw entries
        d.set('one', 1);
        d.set('two', 2);
        const seen: any[] = [];
        d.forEach((k: string, v: any) => { seen.push([k, v]); });
        expect(seen.length).toBeGreaterThanOrEqual(2);
        const keys = seen.map((x: any) => x[0]);
        expect(keys).toEqual(jasmine.arrayContaining(['c', 'one', 'two']));
    });

    it('_PdfName/_PdfCommand caching, _isName/_isCommand and _PdfNull behaviors plus _clearPrimitiveCaches', () => {
        // PdfName caching
        const nameA = _PdfName.get('Font');
        const nameB = _PdfName.get('Font');
        expect(nameA).toBe(nameB);
        expect(_isName(nameA, 'Font')).toBeTruthy();
        expect(_isName(nameA, 'XObject')).toBeFalsy();
        expect(_isName('Font' as any, 'Font')).toBeFalsy();
        // PdfCommand caching and guard
        const cmdA = _PdfCommand.get('BT');
        const cmdB = _PdfCommand.get('BT');
        expect(cmdA).toBe(cmdB);
        expect(_isCommand(cmdA, 'BT')).toBeTruthy();
        expect(_isCommand('BT' as any, 'BT')).toBeFalsy();
        // PdfNull default and custom
        const n1 = new _PdfNull();
        expect(Array.isArray(n1.value)).toBeTruthy();
        expect((n1.value as any).length).toBe(0);
        const n2 = new _PdfNull('custom');
        expect((n2 as any).value).toBe('custom');
        // Clearing primitive caches should create new instances afterwards
        const ref1 = _PdfReference.get(9, 0);
        const nameBeforeClear = _PdfName.get('Resources');
        const cmdBeforeClear = _PdfCommand.get('Tf');
        _clearPrimitiveCaches();
        const ref2 = _PdfReference.get(9, 0);
        const nameAfterClear = _PdfName.get('Resources');
        const cmdAfterClear = _PdfCommand.get('Tf');
        expect(ref2).not.toBe(ref1);
        expect(nameAfterClear).not.toBe(nameBeforeClear);
        expect(cmdAfterClear).not.toBe(cmdBeforeClear);
    });

    it('_PdfDictionary.merge - assigns primitive when single value present (values.length === 1 branch)', () => {
        // Arrange - monkeypatch Object.create to provide a properties array with get/set/clear
        const origCreate: any = Object.create;
        (Object as any).create = function (proto: any) {
            if (proto === null) {
                const arr: any = [];
                arr._map = origCreate(null);
                arr.get = function (k: any) { return arr._map[k]; };
                arr.set = function (k: any, v: any) {
                    if (typeof arr._map[k] === 'undefined') {
                        arr._map[k] = v;
                        arr.push([k, v]);
                    }
                    else {
                        arr._map[k] = v;
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i][0] === k) { arr[i][1] = v; break; }
                        }
                    }
                };
                arr.clear = function () { arr._map = origCreate(null); arr.length = 0; while (arr.length) { arr.pop(); } };
                return arr;
            }
            return origCreate(proto);
        } as any;
        try {
            // single dictionary with a primitive value
            const d1 = new _PdfDictionary(null);
            d1._map = [['K', 'primitive'] as any];
            // Act
            const merged = _PdfDictionary.merge(null, [d1], false);
            // Assert - should assign the primitive value under key 'K'
            expect(merged.getRaw('K')).toBe('primitive');
        }
        finally {
            (Object as any).create = origCreate;
        }
    });

    it('_PdfDictionary.merge - merges sub-dictionaries when mergeSubDictionary=true (sub-dictionary branch)', () => {
        // Arrange - provide compatible properties array implementation again
        const origCreate: any = Object.create;
        (Object as any).create = function (proto: any) {
            if (proto === null) {
                const arr: any = [];
                arr._map = origCreate(null);
                arr.get = function (k: any) { return arr._map[k]; };
                arr.set = function (k: any, v: any) {
                    if (typeof arr._map[k] === 'undefined') {
                        arr._map[k] = v;
                        arr.push([k, v]);
                    }
                    else {
                        arr._map[k] = v;
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i][0] === k) { arr[i][1] = v; break; }
                        }
                    }
                };
                arr.clear = function () { arr._map = origCreate(null); arr.length = 0; while (arr.length) { arr.pop(); } };
                return arr;
            }
            return origCreate(proto);
        } as any;
        try {
            const sub1 = new _PdfDictionary(null);
            sub1._map = [['a', 1] as any];
            const sub2 = new _PdfDictionary(null);
            sub2._map = [['b', 2] as any];
            const p1 = new _PdfDictionary(null);
            p1._map = [['shared', sub1] as any];
            const p2 = new _PdfDictionary(null);
            p2._map = [['shared', sub2] as any];
            // Act
            const merged = _PdfDictionary.merge(null, [p1, p2], true);
            // Assert - merged should contain a sub-dictionary under 'shared' combining 'a' and 'b'
            const shared = merged.getRaw('shared');
            expect(shared instanceof _PdfDictionary).toBeTruthy();
            expect(shared.get('a')).toBe(1);
            expect(shared.get('b')).toBe(2);
        }
        finally {
            (Object as any).create = origCreate;
        }
    });

    it('_PdfDictionary.merge - returns empty dictionary when no merged keys (returns getEmpty)', () => {
        // Arrange - monkeypatch Object.create similarly
        const origCreate: any = Object.create;
        (Object as any).create = function (proto: any) {
            if (proto === null) {
                const arr: any = [];
                arr._map = origCreate(null);
                arr.get = function (k: any) { return arr._map[k]; };
                arr.set = function (k: any, v: any) { if (typeof arr._map[k] === 'undefined') { arr._map[k] = v; arr.push([k, v]); } else { arr._map[k] = v; for (let i = 0; i < arr.length; i++) { if (arr[i][0] === k) { arr[i][1] = v; break; } } } };
                arr.clear = function () { arr._map = origCreate(null); arr.length = 0; while (arr.length) { arr.pop(); } };
                return arr;
            }
            return origCreate(proto);
        } as any;
        try {
            const e1 = new _PdfDictionary(null);
            e1._map = [] as any;
            const e2 = new _PdfDictionary(null);
            e2._map = [] as any;
            // Act
            const merged = _PdfDictionary.merge(null, [e1, e2], false);
            // Assert - no keys should be present in the merged result for empty inputs
            expect(merged.getRaw('x')).toBeUndefined();
        }
        finally {
            (Object as any).create = origCreate;
        }
    });

    it('_PdfDictionary.merge - continue branch when mergeSubDictionary=false (else-if continue)', () => {
        const origCreate: any = Object.create;
        (Object as any).create = function (proto: any) {
            if (proto === null) {
                const arr: any = [];
                arr._map = origCreate(null);
                arr.get = function (k: any) { return arr._map[k]; };
                arr.set = function (k: any, v: any) {
                    if (typeof arr._map[k] === 'undefined') {
                        arr._map[k] = v;
                        arr.push([k, v]);
                    }
                    else {
                        arr._map[k] = v;
                        for (let i = 0; i < arr.length; i++) { if (arr[i][0] === k) { arr[i][1] = v; break; } }
                    }
                };
                arr.clear = function () { arr._map = origCreate(null); arr.length = 0; while (arr.length) { arr.pop(); } };
                return arr;
            }
            return origCreate(proto);
        } as any;
        try {
            const p1 = new _PdfDictionary(null);
            p1._map = [['shared', 'first'] as any];
            const p2 = new _PdfDictionary(null);
            p2._map = [['shared', 'second'] as any];
            const merged = _PdfDictionary.merge(null, [p1, p2], false);
            expect(merged.getRaw('shared')).toBe('first');
        }
        finally {
            (Object as any).create = origCreate;
        }
    });

    it('_PdfDictionary.merge - avoids overwriting existing subDict keys (subDict key already defined)', () => {
        const origCreate: any = Object.create;
        (Object as any).create = function (proto: any) {
            if (proto === null) {
                const arr: any = [];
                arr._map = origCreate(null);
                arr.get = function (k: any) { return arr._map[k]; };
                arr.set = function (k: any, v: any) {
                    if (typeof arr._map[k] === 'undefined') {
                        arr._map[k] = v;
                        arr.push([k, v]);
                    }
                    else {
                        arr._map[k] = v;
                        for (let i = 0; i < arr.length; i++) { if (arr[i][0] === k) { arr[i][1] = v; break; } }
                    }
                };
                arr.clear = function () { arr._map = origCreate(null); arr.length = 0; while (arr.length) { arr.pop(); } };
                return arr;
            }
            return origCreate(proto);
        } as any;
        try {
            const sub1 = new _PdfDictionary(null);
            sub1._map = [['a', 1] as any];
            const sub2 = new _PdfDictionary(null);
            sub2._map = [['a', 2] as any];
            const p1 = new _PdfDictionary(null);
            p1._map = [['shared', sub1] as any];
            const p2 = new _PdfDictionary(null);
            p2._map = [['shared', sub2] as any];
            const merged = _PdfDictionary.merge(null, [p1, p2], true);
            const shared = merged.getRaw('shared') as _PdfDictionary;
            expect(shared instanceof _PdfDictionary).toBeTruthy();
            expect(shared.get('a')).toBe(1);
        }
        finally {
            (Object as any).create = origCreate;
        }
    });
});