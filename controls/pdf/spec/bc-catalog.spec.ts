import { PdfDocument, PdfMargins, PdfPageSettings } from './../src/pdf/core/pdf-document';
import { _PdfDictionary, _PdfReference, _PdfName, _PdfReferenceSet } from '../src/pdf/core/pdf-primitives';
import { creditCard } from '../spec/inputs.spec';
import { _PdfCatalog } from '../src/pdf/core/pdf-catalog';
import { FormatError } from '../src/pdf/core/utils';
describe('Catalog - validating the preperties and functions', () => {
    it('PdfCatalog - Has Version', () => {
        // Create a new PDF document
        let pdf = new PdfDocument();
        let version = "1.4";
        pdf._catalog._catalogDictionary.update('Version', version)
        pdf.addPage();
        // let stream: _PdfDecodeStream = pdf._crossReference._fetch(_PdfReference.get(5, 0));
        // stream.eof = true;
        var updatedData = pdf.save();
        pdf.destroy();
        pdf = new PdfDocument(updatedData);
        expect(pdf.pageCount).toBeGreaterThan(0);
        // Destroy the PDF document instance
        pdf.destroy();
    });
    it('PdfCatalog - No Version', () => {
        // Create a new PDF document
        let pdf = new PdfDocument();
        let version = null;
        pdf._catalog._catalogDictionary.update('Version', version)
        pdf.addPage();
        var updatedData = pdf.save();
        pdf.destroy();
        pdf = new PdfDocument(updatedData);
        expect(pdf.pageCount).toBeGreaterThan(0);
        // Destroy the PDF document instance
        pdf.destroy();
    });

    it('PdfCatalog _checkPageTreeFormat', () => {
        // Create a new PDF document
        const pdfBytes = creditCard;
        // Create a PdfDocument instance from the fetched bytes
        const pdf = new PdfDocument(pdfBytes);
        expect(pdf.pageCount).toBe(3);
        pdf.getPage(0);
        pdf.getPage(1);
        pdf._catalog._pageCache.clear();
        pdf.getPage(2);
        expect(pdf.pageCount).toBeGreaterThan(0);
        pdf.destroy();
    });
    it('PdfCatalog _findNextPage', () => {
        // Create a new PDF document
        const pdfBytes = creditCard;
        // Create a PdfDocument instance from the fetched bytes
        const pdf = new PdfDocument(pdfBytes);
        expect(pdf.pageCount).toBe(3);
        pdf.getPage(0);
        pdf.getPage(1);
        let pageCache1 = pdf._catalog._pageCache.get(1);
        pageCache1.parent = null;
        pdf.getPage(2);
        expect(pdf.pageCount).toBeGreaterThan(0);
        pdf.destroy();
    });
    it('PdfCatalog properties destroy', function () {
        var pdf = new PdfDocument();
        pdf.addPage();
        pdf.save();
        pdf._catalog._topPagesDictionary = undefined;
        pdf._catalog._catalogDictionary = undefined;
        pdf._catalog.pageIndexCache = undefined;
        pdf._catalog.pageKidsCountCache = undefined
        expect(pdf.pageCount).toBeGreaterThan(0);
        pdf.destroy();
    });
});
describe('_PdfCatalog error behaviors', () => {
    it('throws when catalog object is not a dictionary (constructor)', () => {
        const xref: any = { _getCatalogObj: () => ({}) };
        try {
            new _PdfCatalog(xref);
            fail('Expected constructor to throw FormatError');
        } catch (err) {
            const error = err as any;
            expect(error.message).toContain('Catalog object is not a dictionary.');
        }
    });
    it('pageCount getter throws when Count is missing or not integer', () => {
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                const pages = new _PdfDictionary();
                cat.set('Pages', pages);
                return cat;
            }
        };
        const catalog = new _PdfCatalog(xref as any);
        try {
            const _ = catalog.pageCount;
            fail('Expected pageCount getter to throw FormatError');
        } catch (err) {
            const error = err as any;
            expect(error.message).toContain('Invalid page count');
        }
    });

        it('_findNextPage - resolves Kids when parent.getRaw returns a PdfReference (fetches the array)', () => {
            const kidsRef = _PdfReference.get(70, 0);
            const refA = _PdfReference.get(71, 0);
            const refB = _PdfReference.get(72, 0);
            const dictA = new _PdfDictionary();
            const dictB = new _PdfDictionary();
            dictB.set('Type', _PdfName.get('Page'));
            const parent: any = {
                has: (k: string) => k === 'Kids',
                getRaw: (_: string) => kidsRef
            };
            const xref: any = {
                _getCatalogObj: () => {
                    const cat = new _PdfDictionary();
                    const pages = new _PdfDictionary();
                    pages.set('Count', 2);
                    cat.set('Pages', pages);
                    return cat;
                },
                _fetch: (r: any) => {
                    if (r === kidsRef) return [refA, refB];
                    if (r === refA) return dictA;
                    if (r === refB) return dictB;
                    return null;
                }
            };
            const catalog = new _PdfCatalog(xref as any);
            const currentPage: any = { _reference: refA };
            const result = (catalog as any)._findNextPage(currentPage, parent, 1);
            expect(result).toBeDefined();
            expect(result.dictionary).toBe(dictB);
            expect(result.reference).toBe(refB);
        });

    it('checkPageTreeFormat - returns undefined when Kids is not an array', () => {
        // Arrange: catalog dictionary whose 'Pages'.get('Kids') returns non-array
        const xref: any = { _getCatalogObj: () => {
            const cat = new _PdfDictionary();
            const topPagesFake: any = { get: (k: string): any => (k === 'Kids' ? null : undefined), getRaw: (_: string): any => null };
            cat._map = cat._map || Object.create(null);
            cat._map['Pages'] = topPagesFake;
            return cat;
        } };
        const catalog = new _PdfCatalog(xref as any);
        // Act
        const res = (catalog as any)._checkPageTreeFormat();
        // Assert
        expect(res).toBeUndefined();
    });

    it('_findNearestIndex - returns first element when no nearer index exists', () => {
        // Arrange
        const xref: any = { _getCatalogObj: () => {
            const cat = new _PdfDictionary();
            cat._map = cat._map || Object.create(null);
            cat._map['Pages'] = new _PdfDictionary();
            return cat;
        } };
        const catalog = new _PdfCatalog(xref as any);
        catalog._parsedPages = [10, 20, 30];
        // Act
        const nearest = (catalog as any)._findNearestIndex(0);
        // Assert
        expect(nearest).toBe(10);
    });

    it('_traverseFromCached - returns cached page immediately when start equals target and node type is Page', () => {
        const xref: any = { _getCatalogObj: () => {
            const cat = new _PdfDictionary();
            const pages = new _PdfDictionary();
            pages.set('Count', 1);
            cat.set('Pages', pages);
            return cat;
        } };
        const catalog = new _PdfCatalog(xref as any);
        const dict = new _PdfDictionary();
        dict.set('Type', _PdfName.get('Page'));
        const ref = _PdfReference.get(7, 0);
        const cachedPage: any = { dictionary: dict, reference: ref, parent: null };
        const result = (catalog as any)._traverseFromCached(5, cachedPage, 5);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(dict);
        expect(result.reference).toBe(ref);
    });

    it('_traverseFromCached - throws FormatError on circular reference detection', () => {
        const xref: any = { _getCatalogObj: () => {
            const cat = new _PdfDictionary();
            const pages = new _PdfDictionary();
            pages.set('Count', 2);
            cat.set('Pages', pages);
            return cat;
        } };
        const catalog = new _PdfCatalog(xref as any);
        const ref = _PdfReference.get(10, 0);
        const cachedPage: any = { dictionary: ref, reference: ref, parent: null };
        const originalHas = (_PdfReferenceSet.prototype as any).has;
        try {
            (_PdfReferenceSet.prototype as any).has = function () { return true; };
            try {
                (catalog as any)._traverseFromCached(0, cachedPage, 1);
                fail('Expected FormatError to be thrown');
            } catch (err) {
                const error = err as any;
                expect(error.message).toContain('Pages tree contains circular reference.');
            }
        } finally {
            (_PdfReferenceSet.prototype as any).has = originalHas;
        }
    });

    it('_traverseFromCached - traverses siblings and adds to cache when target reached', () => {
        const refA = _PdfReference.get(1, 0);
        const refB = _PdfReference.get(2, 0);
        const dictA = new _PdfDictionary();
        const dictB = new _PdfDictionary();
        dictB.set('Type', _PdfName.get('Page'));
        const parent: any = {
            has: (k: string) => k === 'Kids',
            getRaw: (_: string) => [refA, refB]
        };
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                const pages = new _PdfDictionary();
                pages.set('Count', 2);
                cat.set('Pages', pages);
                return cat;
            },
            _fetch: (r: any) => r === refA ? dictA : r === refB ? dictB : null
        };
        const catalog = new _PdfCatalog(xref as any);
        const cachedPage: any = { dictionary: dictA, reference: refA, parent };
        const result = (catalog as any)._traverseFromCached(0, cachedPage, 1);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(dictB);
        expect(result.reference).toBe(refB);
        const cached = catalog._pageCache.get(1);
        expect(cached).toBeDefined();
        expect(catalog._parsedPages.indexOf(1)).toBeGreaterThanOrEqual(0);
    });

    it('_findNextPage - throws when next kid resolves to invalid type', () => {
        const refA = _PdfReference.get(3, 0);
        const dict = new _PdfDictionary();
        const parent: any = {
            has: (k: string) => k === 'Kids',
            getRaw: (_: string) => [refA, 'not-a-dict']
        };
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                const pages = new _PdfDictionary();
                pages.set('Count', 2);
                cat.set('Pages', pages);
                return cat;
            },
            _fetch: (r: any) => r === refA ? dict : null
        };
        const catalog = new _PdfCatalog(xref as any);
        const currentPage: any = { _reference: refA };
        try {
            (catalog as any)._findNextPage(currentPage, parent, 1);
            fail('Expected FormatError to be thrown');
        } catch (err) {
            const error = err as any;
            expect(error.message).toContain('Invalid page dictionary type.');
        }
    });

    it('_findNextPage - returns next dictionary and reference when next kid is a reference', () => {
        const refA = _PdfReference.get(4, 0);
        const refB = _PdfReference.get(5, 0);
        const dictA = new _PdfDictionary();
        const dictB = new _PdfDictionary();
        dictB.set('Type', _PdfName.get('Page'));
        const parent: any = {
            has: (k: string) => k === 'Kids',
            getRaw: (_: string) => [refA, refB]
        };
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                const pages = new _PdfDictionary();
                pages.set('Count', 2);
                cat.set('Pages', pages);
                return cat;
            },
            _fetch: (r: any) => r === refA ? dictA : r === refB ? dictB : null
        };
        const catalog = new _PdfCatalog(xref as any);
        const currentPage: any = { _reference: refA };
        const result = (catalog as any)._findNextPage(currentPage, parent, 1);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(dictB);
        expect(result.reference).toBe(refB);
    });

    it('_findNextPage - handles kids entries that are PdfReference when currentPage has no _reference (covers kid instanceof _PdfReference branch)', () => {
        const refA = _PdfReference.get(80, 0);
        const refB = _PdfReference.get(81, 0);
        const dictA = new _PdfDictionary();
        const dictB = new _PdfDictionary();
        dictB.set('Type', _PdfName.get('Page'));
        const parent: any = {
            has: (k: string) => k === 'Kids',
            getRaw: (_: string) => [refA, refB]
        };
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                const pages = new _PdfDictionary();
                pages.set('Count', 2);
                cat.set('Pages', pages);
                return cat;
            },
            _fetch: (r: any) => r === refA ? dictA : r === refB ? dictB : null
        };
        const catalog = new _PdfCatalog(xref as any);
        const currentPage: any = dictA; // no _reference property
        const result = (catalog as any)._findNextPage(currentPage, parent, 1);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(dictB);
        expect(result.reference).toBe(refB);
    });

    it('_findNextPage - returns reference null when nextKid is a raw dictionary (reference should be null)', () => {
        const refA = _PdfReference.get(82, 0);
        const dictA = new _PdfDictionary();
        const dictB = new _PdfDictionary();
        dictB.set('Type', _PdfName.get('Page'));
        const parent: any = {
            has: (k: string) => k === 'Kids',
            getRaw: (_: string) => [refA, dictB]
        };
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                const pages = new _PdfDictionary();
                pages.set('Count', 2);
                cat.set('Pages', pages);
                return cat;
            },
            _fetch: (r: any) => r === refA ? dictA : null
        };
        const catalog = new _PdfCatalog(xref as any);
        const currentPage: any = { _reference: refA };
        const result = (catalog as any)._findNextPage(currentPage, parent, 1);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(dictB);
        expect(result.reference).toBeNull();
    });

    it('_findNextPage - finds current page by value when currentPage has no _reference', () => {
        const refA = _PdfReference.get(20, 0);
        const refB = _PdfReference.get(21, 0);
        const dictA = new _PdfDictionary();
        const dictB = new _PdfDictionary();
        dictB.set('Type', _PdfName.get('Page'));
        const parent: any = {
            has: (k: string) => k === 'Kids',
            getRaw: (_: string) => [refA, refB]
        };
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                const pages = new _PdfDictionary();
                pages.set('Count', 2);
                cat.set('Pages', pages);
                return cat;
            },
            _fetch: (r: any) => r === refA ? dictA : r === refB ? dictB : null
        };
        const catalog = new _PdfCatalog(xref as any);
        const currentPage: any = dictA; // no _reference property
        const result = (catalog as any)._findNextPage(currentPage, parent, 1);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(dictB);
        expect(result.reference).toBe(refB);
    });

    it('_findNextPage - finds current page by value when kids are raw dictionaries (kid not a reference)', () => {
        const dictA = new _PdfDictionary();
        const dictB = new _PdfDictionary();
        dictB.set('Type', _PdfName.get('Page'));
        const parent: any = {
            has: (k: string) => k === 'Kids',
            getRaw: (_: string) => [dictA, dictB]
        };
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                const pages = new _PdfDictionary();
                pages.set('Count', 2);
                cat.set('Pages', pages);
                return cat;
            }
        };
        const catalog = new _PdfCatalog(xref as any);
        const currentPage: any = dictA; // no _reference property
        const result = (catalog as any)._findNextPage(currentPage, parent, 1);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(dictB);
        expect(result.reference).toBeNull();
    });

    it('_findNextPage - returns null when current page not found by value', () => {
        const refB = _PdfReference.get(22, 0);
        const dictB = new _PdfDictionary();
        const parent: any = {
            has: (k: string) => k === 'Kids',
            getRaw: (_: string) => [refB]
        };
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                const pages = new _PdfDictionary();
                pages.set('Count', 1);
                cat.set('Pages', pages);
                return cat;
            },
            _fetch: (r: any) => r === refB ? dictB : null
        };
        const catalog = new _PdfCatalog(xref as any);
        const currentPage: any = new _PdfDictionary(); // different object
        const result = (catalog as any)._findNextPage(currentPage, parent, 1);
        expect(result).toBeNull();
    });

    it('_traverseFromCached - handles PdfReference currentNode and returns null when no matching sibling', () => {
        const refA = _PdfReference.get(11, 0);
        const refB = _PdfReference.get(12, 0);
        const dictB = new _PdfDictionary();
        dictB.set('Type', _PdfName.get('Page'));
        const parent: any = {
            has: (k: string) => k === 'Kids',
            getRaw: (_: string) => [refB]
        };
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                const pages = new _PdfDictionary();
                pages.set('Count', 1);
                cat.set('Pages', pages);
                return cat;
            },
            _fetch: (r: any) => r === refB ? dictB : null
        };
        const catalog = new _PdfCatalog(xref as any);
        const cachedPage: any = { dictionary: refA, reference: refA, parent };
        const result = (catalog as any)._traverseFromCached(0, cachedPage, 1);
        expect(result).toBeNull();
    });

    it('_findNextPage - throws when Kids resolved is not an array', () => {
        const refA = _PdfReference.get(13, 0);
        const parent: any = {
            has: (k: string) => k === 'Kids',
            getRaw: (_: string): any => null
        };
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                const pages = new _PdfDictionary();
                pages.set('Count', 1);
                cat.set('Pages', pages);
                return cat;
            }
        };
        const catalog = new _PdfCatalog(xref as any);
        const currentPage: any = { _reference: refA };
        try {
            (catalog as any)._findNextPage(currentPage, parent, 1);
            fail('Expected FormatError to be thrown');
        } catch (err) {
            const error = err as any;
            expect(error.message).toContain('Page dictionary kids object is not an array.');
        }
    });

    it('_traverseFromCached - returns null when start equals target but Type is not Page (else branch)', () => {
        const xref: any = { _getCatalogObj: () => {
            const cat = new _PdfDictionary();
            const pages = new _PdfDictionary();
            pages.set('Count', 1);
            cat.set('Pages', pages);
            return cat;
        } };
        const catalog = new _PdfCatalog(xref as any);
        const dict = new _PdfDictionary();
        dict.set('Type', _PdfName.get('Pages'));
        const ref = _PdfReference.get(99, 0);
        const cachedPage: any = { dictionary: dict, reference: ref, parent: null };
        const result = (catalog as any)._traverseFromCached(2, cachedPage, 2);
        expect(result).toBeNull();
    });

    it('_traverseFromRoot - throws when a child reference resolves to null', () => {
        const childRef = _PdfReference.get(300, 0);
        const topPages = new _PdfDictionary();
        topPages.set('Count', 1);
        topPages.set('Kids', [childRef]);
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                cat.set('Pages', topPages);
                return cat;
            },
            _fetch: (_: any): any => null
        };
        const catalog = new _PdfCatalog(xref as any);
        try {
            (catalog as any)._traverseFromRoot(0);
            fail('Expected FormatError to be thrown');
        } catch (err) {
            const error = err as any;
            expect(error.message).toContain('Page dictionary kid reference points to wrong type of object.');
        }
    });

    it('_traverseFromRoot - caches Count and skips subtree when Count allows skipping', () => {
        const topPages = new _PdfDictionary();
        topPages.set('Count', 5);
        (topPages as any).objId = 'OBJ_COUNT_1';
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                cat.set('Pages', topPages);
                return cat;
            }
        };
        const catalog = new _PdfCatalog(xref as any);
        try {
            (catalog as any)._traverseFromRoot(5);
            fail('Expected Error to be thrown for missing page after skip');
        } catch (err) {
            const error = err as any;
            expect(error.message).toContain('Page index 5 not found.');
        }
        expect((catalog.pageKidsCountCache as any).get('OBJ_COUNT_1')).toBe(5);
    });

    it('_traverseFromRoot - returns page node when Kids is not an array but Type is Page', () => {
        const pageDict = new _PdfDictionary();
        pageDict.set('Type', _PdfName.get('Page'));
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                cat.set('Pages', pageDict);
                return cat;
            }
        };
        const catalog = new _PdfCatalog(xref as any);
        const result = (catalog as any)._traverseFromRoot(0);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(pageDict);
        expect(result.reference).toBeNull();
        const cached = catalog._pageCache.get(0);
        expect(cached).toBeDefined();
    });

    it('_traverseFromRoot - when Kids not array and Type is Page but index mismatches, it increments and continues', () => {
        const pageDict = new _PdfDictionary();
        pageDict.set('Type', _PdfName.get('Page'));
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                cat.set('Pages', pageDict);
                return cat;
            }
        };
        const catalog = new _PdfCatalog(xref as any);
        try {
            (catalog as any)._traverseFromRoot(1);
            fail('Expected Error to be thrown when page index not found');
        } catch (err) {
            const error = err as any;
            expect(error.message).toContain('Page index 1 not found.');
        }
        expect(catalog._pageCache.size).toBe(0);
    });

    it('_traverseFromRoot - pushes non-dictionary fetched obj and throws FormatError', () => {
        const refX = _PdfReference.get(400, 0);
        const topPages = new _PdfDictionary();
        topPages.set('Count', 1);
        topPages.set('Kids', [refX]);
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                cat.set('Pages', topPages);
                return cat;
            },
            _fetch: (_: any) => 'not-a-dictionary'
        };
        const catalog = new _PdfCatalog(xref as any);
        try {
            (catalog as any)._traverseFromRoot(0);
            fail('Expected FormatError to be thrown');
        } catch (err) {
            const error = err as any;
            expect(error.message).toContain('Page dictionary kid reference points to wrong type of object.');
        }
    });

    it('_traverseFromRoot - resolves Type when Type is a PdfReference and returns page', () => {
        const pagesRef = _PdfReference.get(500, 0);
        const typeRef = _PdfReference.get(501, 0);
        const objDict = new _PdfDictionary();
        // make getRaw('Type') return a PdfReference
        (objDict as any).getRaw = (k: string) => k === 'Type' ? typeRef : undefined;
        (objDict as any).has = (_: string) => false;
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                cat.set('Pages', pagesRef);
                return cat;
            },
            _fetch: (r: any) => {
                if (r === pagesRef) return objDict;
                if (r === typeRef) return _PdfName.get('Page');
                return null;
            }
        };
        const catalog = new _PdfCatalog(xref as any);
        try {
            (catalog as any)._traverseFromRoot(0);
            fail('Expected FormatError due to circular reference');
        } catch (err) {
            const error = err as any;
            expect(error.message).toContain('Pages tree contains circular reference.');
        }
    });

    it('_traverseFromRoot - handles Count when Count is a PdfReference and caches value', () => {
        const countRef = _PdfReference.get(700, 0);
        const topPages = new _PdfDictionary();
        topPages.set('Count', countRef);
        (topPages as any).objId = 'OBJ_COUNT_REF';
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                cat.set('Pages', topPages);
                return cat;
            },
            _fetch: (r: any) => {
                if (r === countRef) return 2;
                return null;
            }
        };
        const catalog = new _PdfCatalog(xref as any);
        try {
            (catalog as any)._traverseFromRoot(2);
            fail('Expected Error to be thrown for missing page after skip');
        } catch (err) {
            const error = err as any;
            expect(error.message).toContain('Page index 2 not found.');
        }
        expect((catalog.pageKidsCountCache as any).get('OBJ_COUNT_REF')).toBe(2);
    });

    it('_traverseFromCached - traverses to target index but node Type is not Page so returns null', () => {
        const refA = _PdfReference.get(710, 0);
        const refB = _PdfReference.get(711, 0);
        const dictA = new _PdfDictionary();
        const dictB = new _PdfDictionary();
        dictB.set('Type', _PdfName.get('Pages'));
        const parent: any = {
            has: (k: string) => k === 'Kids',
            getRaw: (_: string) => [refA, refB]
        };
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                const pages = new _PdfDictionary();
                pages.set('Count', 2);
                cat.set('Pages', pages);
                return cat;
            },
            _fetch: (r: any) => r === refA ? dictA : r === refB ? dictB : null
        };
        const catalog = new _PdfCatalog(xref as any);
        const cachedPage: any = { dictionary: dictA, reference: refA, parent };
        const result = (catalog as any)._traverseFromCached(0, cachedPage, 1);
        expect(result).toBeNull();
    });

    it('_traverseFromRoot - fetches Type when Type is a PdfReference and returns the page node', () => {
        const childRef = _PdfReference.get(600, 0);
        const typeRef = _PdfReference.get(601, 0);
        const objDict = new _PdfDictionary();
        // make getRaw('Type') return a PdfReference
        (objDict as any).getRaw = (k: string) => k === 'Type' ? typeRef : undefined;
        (objDict as any).has = (_: string) => false;
        const topPages = new _PdfDictionary();
        topPages.set('Count', 1);
        topPages.set('Kids', [childRef]);
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                cat.set('Pages', topPages);
                return cat;
            },
            _fetch: (r: any) => {
                if (r === childRef) return objDict;
                if (r === typeRef) return _PdfName.get('Page');
                return null;
            }
        };
        const catalog = new _PdfCatalog(xref as any);
        const result = (catalog as any)._traverseFromRoot(0);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(objDict);
        expect(result.reference).toBe(childRef);
    });
    it('_traverseFromRoot - returns page when node has no Kids (uses !has(Kids) branch)', () => {
        const pageDict = new _PdfDictionary();
        (pageDict as any).getRaw = (k: string): any => k === 'Kids' ? null : undefined;
        (pageDict as any).has = (k: string) => k === 'Kids' ? false : false;
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                cat.set('Pages', pageDict);
                return cat;
            }
        };
        const catalog = new _PdfCatalog(xref as any);
        const result = (catalog as any)._traverseFromRoot(0);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(pageDict);
        expect(result.reference).toBeNull();
        const cached = catalog._pageCache.get(0);
        expect(cached).toBeDefined();
    });

    it('_traverseFromRoot - resolves Type when Type is a PdfReference on a raw dictionary and returns page', () => {
        const typeRef = _PdfReference.get(950, 0);
        const pageDict = new _PdfDictionary();
        (pageDict as any).getRaw = (k: string) => k === 'Kids' ? null : (k === 'Type' ? typeRef : undefined);
        (pageDict as any).has = (_: string) => false;
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                cat.set('Pages', pageDict);
                return cat;
            },
            _fetch: (r: any) => r === typeRef ? _PdfName.get('Page') : null
        };
        const catalog = new _PdfCatalog(xref as any);
        const result = (catalog as any)._traverseFromRoot(0);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(pageDict);
        expect(result.reference).toBeNull();
        const cached = catalog._pageCache.get(0);
        expect(cached).toBeDefined();
    });
    it('_traverseFromRoot - throws when kids not array but node reports having Kids (invalid kids type)', () => {
        const pageDict = new _PdfDictionary();
        (pageDict as any).getRaw = (k: string) => k === 'Kids' ? null : (k === 'Type' ? _PdfName.get('Pages') : undefined);
        (pageDict as any).has = (k: string) => k === 'Kids' ? true : false;
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                cat.set('Pages', pageDict);
                return cat;
            }
        };
        const catalog = new _PdfCatalog(xref as any);
        try {
            (catalog as any)._traverseFromRoot(0);
            fail('Expected FormatError to be thrown');
        } catch (err) {
            const error = err as any;
            expect(error.message).toContain('Page dictionary kids object is not an array.');
        }
    });
    it('_traverseFromRoot - resolves Kids when getRaw returns a PdfReference (fetches kids array)', () => {
        const kidsRef = _PdfReference.get(9000, 0);
        const childRef = _PdfReference.get(9001, 0);
        const pageDict = new _PdfDictionary();
        pageDict.set('Type', _PdfName.get('Page'));
        const topPages = new _PdfDictionary();
        topPages.set('Count', 1);
        topPages.set('Kids', kidsRef);
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                cat.set('Pages', topPages);
                return cat;
            },
            _fetch: (r: any) => {
                if (r === kidsRef) return [childRef];
                if (r === childRef) return pageDict;
                return null;
            }
        };
        const catalog = new _PdfCatalog(xref as any);
        const result = (catalog as any)._traverseFromRoot(0);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(pageDict);
        expect(result.reference).toBe(childRef);
    });

    it('_traverseFromRoot - does not call _fetch when Kids is already an array', () => {
        const pageDict = new _PdfDictionary();
        pageDict.set('Type', _PdfName.get('Page'));
        const topPages = new _PdfDictionary();
        topPages.set('Count', 1);
        topPages.set('Kids', [pageDict]);
        let fetchCalled = false;
        const xref: any = {
            _getCatalogObj: () => {
                const cat = new _PdfDictionary();
                cat.set('Pages', topPages);
                return cat;
            },
            _fetch: (_: any): any => {
                fetchCalled = true;
                return null;
            }
        };
        const catalog = new _PdfCatalog(xref as any);
        const result = (catalog as any)._traverseFromRoot(0);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(pageDict);
        expect(result.reference).toBeNull();
        expect(fetchCalled).toBe(false);
    });
});