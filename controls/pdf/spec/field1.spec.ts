import { PdfCertificationFlag } from "../src/pdf/core/enumerator";
import { PdfSignatureField } from "../src/pdf/core/form/field";
import { _PdfCrossReference, _PdfObjectInformation } from "../src/pdf/core/pdf-cross-reference";
import { PdfDocument } from "../src/pdf/core/pdf-document";
import { PdfPage } from "../src/pdf/core/pdf-page";
import { _PdfDictionary, _PdfName, _PdfReference } from "../src/pdf/core/pdf-primitives";
function makeIncrementEntry(
    revisionId: number,
    physicalOffset: number,
    free: boolean = false
): _PdfObjectInformation {
    const entry: any = {
        revisionId: revisionId,
        offset: physicalOffset,
        free: free,
        gen: 0
    };
    return entry as _PdfObjectInformation;
}
interface IncrementUpdateHarness {
    document: PdfDocument;
    page: PdfPage;
    field: PdfSignatureField;
    crossReference: _PdfCrossReference;
    catalog: _PdfDictionary;
    trailer: _PdfDictionary;
}
function makeIncrementUpdateHarness(): IncrementUpdateHarness {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const field: PdfSignatureField = new PdfSignatureField(
        page,
        'signature1',
        { x: 20, y: 20, width: 120, height: 40 }
    );
    document.form.add(field);
    const crossReference: _PdfCrossReference = field._crossReference;
    const catalog: _PdfDictionary = new _PdfDictionary(crossReference);
    const trailer: _PdfDictionary = new _PdfDictionary(crossReference);
    trailer.update('Prev', 10);
    crossReference._root = catalog;
    crossReference._trailer = trailer;
    crossReference._entriesHistory = [];
    field._signature = {
        _ranges: [0, 100, 200, 100],
        _certify: false,
        _documentPermissions: PdfCertificationFlag.forbidChanges,
        _isLocked: false
    } as any;
    return {
        document,
        page,
        field,
        crossReference,
        catalog,
        trailer
    };
}
describe('PdfSignatureField _checkIncrementUpdate mutation coverage', () => {
    it('returns false when cross reference is unavailable', () => {
        // Arrange
        const field: PdfSignatureField = new PdfSignatureField();
        field._crossReference = undefined;
        // Act
        const result: boolean = field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
    });
    it('returns false when trailer does not contain Prev', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        harness.crossReference._trailer = new _PdfDictionary(harness.crossReference);
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        expect(harness.crossReference._trailer.has('Prev')).toBeFalsy();
    });
    it('returns true when signature byte ranges contain a non-finite value', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        harness.field._signature = {
            _ranges: [0, 100, Number.NaN, 100],
            _certify: false,
            _documentPermissions: PdfCertificationFlag.forbidChanges,
            _isLocked: false
        } as any;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeTruthy();
    });
    it('reads ByteRange from the field signature dictionary', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const signatureDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        signatureDictionary.update('ByteRange', [0, 100, 200, 100]);
        harness.field._signature = undefined;
        harness.field._dictionary.update('V', signatureDictionary);
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        expect(signatureDictionary.getArray('ByteRange')).toEqual(
            [0, 100, 200, 100]
        );
    });
    it('uses the AcroForm key and detects removed signed fields', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const acroFormReference: _PdfReference = _PdfReference.get(20, 0);
        const signedFieldReference: _PdfReference = _PdfReference.get(21, 0);
        const signedAcroForm: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        const currentAcroForm: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        signedAcroForm.update('Fields', [signedFieldReference]);
        currentAcroForm.update('Fields', []);
        harness.catalog.update('AcroForm', acroFormReference);
        const originalFetchReferenceInRevision:
            (reference: _PdfReference, revisionId: number) => any =
            harness.crossReference._fetchReferenceInRevision;
        const originalFetch:
            (reference: _PdfReference) => any =
            harness.crossReference._fetch;
        harness.crossReference._fetchReferenceInRevision =
            (reference: _PdfReference, _revisionId: number): any => {
                if (reference.objectNumber === acroFormReference.objectNumber) {
                    return signedAcroForm;
                }
                return undefined;
            };
        harness.crossReference._fetch =
            (reference: _PdfReference): any => {
                if (reference.objectNumber === acroFormReference.objectNumber) {
                    return currentAcroForm;
                }
                return undefined;
            };
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._fetchReferenceInRevision =
            originalFetchReferenceInRevision;
        harness.crossReference._fetch = originalFetch;
        // Assert
        expect(result).toBeTruthy();
        expect(harness.catalog.has('AcroForm')).toBeTruthy();
        expect(
            harness.catalog.getRaw('AcroForm') instanceof _PdfReference
        ).toBeTruthy();
        expect(
            (harness.catalog.getRaw('AcroForm') as _PdfReference).objectNumber
        ).toBe(20);
    });
    it('returns false when the signed AcroForm is unavailable', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const acroFormReference: _PdfReference = _PdfReference.get(30, 0);
        const currentAcroForm: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        currentAcroForm.update('Fields', []);
        harness.catalog.update('AcroForm', acroFormReference);
        const originalFetchReferenceInRevision:
            (reference: _PdfReference, revisionId: number) => any =
            harness.crossReference._fetchReferenceInRevision;
        const originalFetch:
            (reference: _PdfReference) => any =
            harness.crossReference._fetch;
        harness.crossReference._fetchReferenceInRevision =
            (_reference: _PdfReference, _revisionId: number): any => undefined;
        harness.crossReference._fetch =
            (_reference: _PdfReference): any => currentAcroForm;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._fetchReferenceInRevision =
            originalFetchReferenceInRevision;
        harness.crossReference._fetch = originalFetch;
        // Assert
        expect(result).toBeFalsy();
    });
    it('returns false when the current AcroForm is unavailable', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const acroFormReference: _PdfReference = _PdfReference.get(40, 0);
        const signedAcroForm: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        signedAcroForm.update('Fields', []);
        harness.catalog.update('AcroForm', acroFormReference);
        const originalFetchReferenceInRevision:
            (reference: _PdfReference, revisionId: number) => any =
            harness.crossReference._fetchReferenceInRevision;
        const originalFetch:
            (reference: _PdfReference) => any =
            harness.crossReference._fetch;
        harness.crossReference._fetchReferenceInRevision =
            (_reference: _PdfReference, _revisionId: number): any =>
                signedAcroForm;
        harness.crossReference._fetch =
            (_reference: _PdfReference): any => undefined;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._fetchReferenceInRevision =
            originalFetchReferenceInRevision;
        harness.crossReference._fetch = originalFetch;
        // Assert
        expect(result).toBeFalsy();
    });
    it('does not report a change when AcroForm field counts are equal', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const acroFormReference: _PdfReference = _PdfReference.get(50, 0);
        const fieldReference: _PdfReference = _PdfReference.get(51, 0);
        const signedAcroForm: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        const currentAcroForm: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        signedAcroForm.update('Fields', [fieldReference]);
        currentAcroForm.update('Fields', [fieldReference]);
        harness.catalog.update('AcroForm', acroFormReference);
        const originalFetchReferenceInRevision:
            (reference: _PdfReference, revisionId: number) => any =
            harness.crossReference._fetchReferenceInRevision;
        const originalFetch:
            (reference: _PdfReference) => any =
            harness.crossReference._fetch;
        harness.crossReference._fetchReferenceInRevision =
            (_reference: _PdfReference, _revisionId: number): any =>
                signedAcroForm;
        harness.crossReference._fetch =
            (_reference: _PdfReference): any => currentAcroForm;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._fetchReferenceInRevision =
            originalFetchReferenceInRevision;
        harness.crossReference._fetch = originalFetch;
        // Assert
        expect(result).toBeFalsy();
        expect(
            currentAcroForm.getRaw('Fields').length
        ).toBe(
            signedAcroForm.getRaw('Fields').length
        );
    });
    it('reads an indirect Info dictionary from the trailer', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const infoReference: _PdfReference = _PdfReference.get(60, 0);
        const signedInfoDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        let fetchedReferenceNumber: number = 0;
        let readDictionary: _PdfDictionary;
        harness.trailer.update('Info', infoReference);
        const originalFetchReferenceInRevision:
            (reference: _PdfReference, revisionId: number) => any =
            harness.crossReference._fetchReferenceInRevision;
        const originalReadAllSubRefs:
            (
                value: any,
                revisionId: number,
                xref: _PdfCrossReference,
                skippedObjects: Set<number>
            ) => void = harness.field._readAllSubRefs;
        harness.crossReference._fetchReferenceInRevision =
            (reference: _PdfReference, _revisionId: number): any => {
                fetchedReferenceNumber = reference.objectNumber;
                return signedInfoDictionary;
            };
        harness.field._readAllSubRefs =
            (
                value: any,
                _revisionId: number,
                _xref: _PdfCrossReference,
                _skippedObjects: Set<number>
            ): void => {
                readDictionary = value as _PdfDictionary;
            };
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._fetchReferenceInRevision =
            originalFetchReferenceInRevision;
        harness.field._readAllSubRefs = originalReadAllSubRefs;
        // Assert
        expect(result).toBeFalsy();
        expect(harness.trailer.has('Info')).toBeTruthy();
        expect(fetchedReferenceNumber).toBe(60);
        expect(readDictionary).toBe(signedInfoDictionary);
    });
    it('reads a direct Info dictionary from the trailer', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const infoDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        let readDictionary: _PdfDictionary;
        harness.trailer.update('Info', infoDictionary);
        const originalReadAllSubRefs:
            (
                value: any,
                revisionId: number,
                xref: _PdfCrossReference,
                skippedObjects: Set<number>
            ) => void = harness.field._readAllSubRefs;
        harness.field._readAllSubRefs =
            (
                value: any,
                _revisionId: number,
                _xref: _PdfCrossReference,
                _skippedObjects: Set<number>
            ): void => {
                readDictionary = value as _PdfDictionary;
            };
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.field._readAllSubRefs = originalReadAllSubRefs;
        // Assert
        expect(result).toBeFalsy();
        expect(readDictionary).toBe(infoDictionary);
    });
    it('returns false when object histories are unavailable', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        harness.crossReference._entriesHistory = undefined;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
    });
    it('skips an empty object history', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        harness.crossReference._entriesHistory = [undefined, []];
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
    });
    it('skips free entries while locating the newest object entry', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const freeEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150, true);
        harness.crossReference._entriesHistory = [
            undefined,
            [freeEntry]
        ];
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        expect(freeEntry.free).toBeTruthy();
    });
    it('returns true when the newest entry physical offset is not finite', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        harness.crossReference._entriesHistory = [
            undefined,
            [newestEntry]
        ];
        const originalGetPhysicalOffsetForEntry:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => Number.NaN;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalGetPhysicalOffsetForEntry;
        // Assert
        expect(result).toBeTruthy();
    });
    it('returns true for an outside update when certification forbids changes', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        harness.field._signature = {
            _ranges: [0, 100, 200, 100],
            _certify: true,
            _documentPermissions: PdfCertificationFlag.forbidChanges,
            _isLocked: false
        } as any;
        harness.crossReference._entriesHistory = [
            undefined,
            [newestEntry]
        ];
        const originalGetPhysicalOffsetForEntry:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => 150;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalGetPhysicalOffsetForEntry;
        // Assert
        expect(result).toBeTruthy();
    });
    it('continues when an outside non-dictionary update is an LTV object', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        const ltvDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        ltvDictionary.update('OCSPs', []);
        harness.crossReference._entriesHistory = [
            undefined,
            [newestEntry]
        ];
        const originalGetPhysicalOffsetForEntry:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictAtEntry:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                xref: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        const originalFetchAtEntry:
            (
                reference: _PdfReference,
                entry: _PdfObjectInformation,
                suppressEncryption: boolean
            ) => any = harness.crossReference._fetchAtEntry;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => 150;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                _entry: _PdfObjectInformation,
                _xref: _PdfCrossReference
            ): _PdfDictionary => undefined;
        harness.crossReference._fetchAtEntry =
            (
                _reference: _PdfReference,
                _entry: _PdfObjectInformation,
                _suppressEncryption: boolean
            ): any => ltvDictionary;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalGetPhysicalOffsetForEntry;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        harness.crossReference._fetchAtEntry = originalFetchAtEntry;
        // Assert
        expect(result).toBeFalsy();
    });
    it('returns true when an outside new object has no dictionary', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        harness.crossReference._entriesHistory = [
            undefined,
            [newestEntry]
        ];
        const originalGetPhysicalOffsetForEntry:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictAtEntry:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                xref: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        const originalFetchAtEntry:
            (
                reference: _PdfReference,
                entry: _PdfObjectInformation,
                suppressEncryption: boolean
            ) => any = harness.crossReference._fetchAtEntry;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => 150;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                _entry: _PdfObjectInformation,
                _xref: _PdfCrossReference
            ): _PdfDictionary => undefined;
        harness.crossReference._fetchAtEntry =
            (
                _reference: _PdfReference,
                _entry: _PdfObjectInformation,
                _suppressEncryption: boolean
            ): any => 'changed object';
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalGetPhysicalOffsetForEntry;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        harness.crossReference._fetchAtEntry = originalFetchAtEntry;
        // Assert
        expect(result).toBeTruthy();
    });
    it('continues when the changed dictionary type is Catalog', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        const catalogDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        catalogDictionary.update('Type', _PdfName.get('Catalog'));
        harness.crossReference._entriesHistory = [
            undefined,
            [newestEntry]
        ];
        const originalGetPhysicalOffsetForEntry:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictAtEntry:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                xref: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => 150;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                _entry: _PdfObjectInformation,
                _xref: _PdfCrossReference
            ): _PdfDictionary => catalogDictionary;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalGetPhysicalOffsetForEntry;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        // Assert
        expect(result).toBeFalsy();
        expect(catalogDictionary.has('Type')).toBeTruthy();
        expect((catalogDictionary.get('Type') as _PdfName).name).toBe('Catalog');
    });
    it('returns true when lock rules reject a Fields dictionary', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        const fieldsDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        fieldsDictionary.update('Fields', []);
        harness.crossReference._entriesHistory = [
            undefined,
            [newestEntry]
        ];
        const originalGetPhysicalOffsetForEntry:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictAtEntry:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                xref: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        const originalEvaluateLockRules:
            (
                dictionary: _PdfDictionary,
                revisionId: number,
                xref: _PdfCrossReference
            ) => boolean = harness.field._evaluateLockRules;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => 150;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                _entry: _PdfObjectInformation,
                _xref: _PdfCrossReference
            ): _PdfDictionary => fieldsDictionary;
        harness.field._evaluateLockRules =
            (
                _dictionary: _PdfDictionary,
                _revisionId: number,
                _xref: _PdfCrossReference
            ): boolean => true;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalGetPhysicalOffsetForEntry;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        harness.field._evaluateLockRules = originalEvaluateLockRules;
        // Assert
        expect(result).toBeTruthy();
    });
    it('continues when lock rules allow a Fields dictionary', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        const fieldsDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        fieldsDictionary.update('Fields', []);
        harness.crossReference._entriesHistory = [
            undefined,
            [newestEntry]
        ];
        const originalGetPhysicalOffsetForEntry:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictAtEntry:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                xref: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        const originalEvaluateLockRules:
            (
                dictionary: _PdfDictionary,
                revisionId: number,
                xref: _PdfCrossReference
            ) => boolean = harness.field._evaluateLockRules;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => 150;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                _entry: _PdfObjectInformation,
                _xref: _PdfCrossReference
            ): _PdfDictionary => fieldsDictionary;
        harness.field._evaluateLockRules =
            (
                _dictionary: _PdfDictionary,
                _revisionId: number,
                _xref: _PdfCrossReference
            ): boolean => false;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalGetPhysicalOffsetForEntry;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        harness.field._evaluateLockRules = originalEvaluateLockRules;
        // Assert
        expect(result).toBeFalsy();
    });
    it('returns true when lock rules reject a modified signed object', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        const signedEntry: _PdfObjectInformation =
            makeIncrementEntry(1, 50);
        const oldDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        const newDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        oldDictionary.update('Value', 'old');
        newDictionary.update('Value', 'new');
        harness.crossReference._entriesHistory = [
            undefined,
            [newestEntry, signedEntry]
        ];
        const originalGetPhysicalOffsetForEntry:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictAtEntry:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                xref: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        const originalEvaluateLockRules:
            (
                dictionary: _PdfDictionary,
                revisionId: number,
                xref: _PdfCrossReference
            ) => boolean = harness.field._evaluateLockRules;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.offset;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                entry: _PdfObjectInformation,
                _xref: _PdfCrossReference
            ): _PdfDictionary => {
                return entry.revisionId === 2
                    ? newDictionary
                    : oldDictionary;
            };
        harness.field._evaluateLockRules =
            (
                _dictionary: _PdfDictionary,
                _revisionId: number,
                _xref: _PdfCrossReference
            ): boolean => true;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalGetPhysicalOffsetForEntry;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        harness.field._evaluateLockRules = originalEvaluateLockRules;
        // Assert
        expect(result).toBeTruthy();
    });
    it('continues when lock rules allow a modified signed object', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        const signedEntry: _PdfObjectInformation =
            makeIncrementEntry(1, 50);
        const oldDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        const newDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        oldDictionary.update('Value', 'old');
        newDictionary.update('Value', 'new');
        harness.crossReference._entriesHistory = [
            undefined,
            [newestEntry, signedEntry]
        ];
        const originalGetPhysicalOffsetForEntry:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictAtEntry:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                xref: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        const originalEvaluateLockRules:
            (
                dictionary: _PdfDictionary,
                revisionId: number,
                xref: _PdfCrossReference
            ) => boolean = harness.field._evaluateLockRules;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.offset;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                entry: _PdfObjectInformation,
                _xref: _PdfCrossReference
            ): _PdfDictionary => {
                return entry.revisionId === 2
                    ? newDictionary
                    : oldDictionary;
            };
        harness.field._evaluateLockRules =
            (
                _dictionary: _PdfDictionary,
                _revisionId: number,
                _xref: _PdfCrossReference
            ): boolean => false;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalGetPhysicalOffsetForEntry;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        harness.field._evaluateLockRules = originalEvaluateLockRules;
        // Assert
        expect(result).toBeFalsy();
    });
    it('allows a changed Widget annotation when the signature is locked', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        const signedEntry: _PdfObjectInformation =
            makeIncrementEntry(1, 50);
        const oldDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        const newDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        oldDictionary.update('Type', _PdfName.get('Annot'));
        oldDictionary.update('Subtype', _PdfName.get('Widget'));
        newDictionary.update('Type', _PdfName.get('Annot'));
        newDictionary.update('Subtype', _PdfName.get('Widget'));
        harness.field._signature = {
            _ranges: [0, 100, 200, 100],
            _certify: false,
            _documentPermissions: PdfCertificationFlag.forbidChanges,
            _isLocked: true
        } as any;
        harness.crossReference._entriesHistory = [
            undefined,
            [newestEntry, signedEntry]
        ];
        const originalGetPhysicalOffsetForEntry:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictAtEntry:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                xref: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        const originalEvaluateLockRules:
            (
                dictionary: _PdfDictionary,
                revisionId: number,
                xref: _PdfCrossReference
            ) => boolean = harness.field._evaluateLockRules;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.offset;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                entry: _PdfObjectInformation,
                _xref: _PdfCrossReference
            ): _PdfDictionary => {
                return entry.revisionId === 2
                    ? newDictionary
                    : oldDictionary;
            };
        harness.field._evaluateLockRules =
            (
                _dictionary: _PdfDictionary,
                _revisionId: number,
                _xref: _PdfCrossReference
            ): boolean => undefined;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalGetPhysicalOffsetForEntry;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        harness.field._evaluateLockRules = originalEvaluateLockRules;
        // Assert
        expect(result).toBeFalsy();
        expect((harness.field._signature as any)._isLocked).toBeTruthy();
    });
});
describe('PdfSignatureField _checkIncrementUpdate lines 6384 to 6500', () => {
    it('returns false when lock rules explicitly allow the Fields update', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            crossReference: _PdfCrossReference;
            catalog: _PdfDictionary;
            trailer: _PdfDictionary;
        } = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        const fieldsDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        fieldsDictionary.update('Fields', []);
        harness.crossReference._entriesHistory = [
            undefined,
            [newestEntry]
        ];
        const originalGetPhysicalOffsetForEntry:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictAtEntry:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                crossReference: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        const originalEvaluateLockRules:
            (
                dictionary: _PdfDictionary,
                revisionId: number,
                crossReference: _PdfCrossReference
            ) => boolean = harness.field._evaluateLockRules;
        let evaluatedDictionary: _PdfDictionary;
        let evaluatedRevision: number = -1;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.offset;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                _entry: _PdfObjectInformation,
                _crossReference: _PdfCrossReference
            ): _PdfDictionary => {
                return fieldsDictionary;
            };
        harness.field._evaluateLockRules =
            (
                dictionary: _PdfDictionary,
                revisionId: number,
                _crossReference: _PdfCrossReference
            ): boolean => {
                evaluatedDictionary = dictionary;
                evaluatedRevision = revisionId;
                return false;
            };
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalGetPhysicalOffsetForEntry;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        harness.field._evaluateLockRules = originalEvaluateLockRules;
        // Assert
        expect(result).toBeFalsy();
        expect(evaluatedDictionary).toBe(fieldsDictionary);
        expect(evaluatedRevision).toBe(2);
    });
    it('checks a certified top-level AcroForm and returns true for illegal field changes', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            crossReference: _PdfCrossReference;
            catalog: _PdfDictionary;
            trailer: _PdfDictionary;
        } = makeIncrementUpdateHarness();
        const acroFormReference: _PdfReference =
            _PdfReference.get(1, 0);
        const newestEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        const signedEntry: _PdfObjectInformation =
            makeIncrementEntry(1, 50);
        const oldAcroForm: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        const newAcroForm: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        const existingFieldReference: _PdfReference =
            _PdfReference.get(4, 0);
        oldAcroForm.update('Fields', [existingFieldReference]);
        newAcroForm.update('Fields', [existingFieldReference]);
        harness.catalog.update('AcroForm', acroFormReference);
        harness.field._signature = {
            _ranges: [0, 100, 200, 100],
            _certify: true,
            _documentPermissions: PdfCertificationFlag.allowFormFill,
            _isLocked: false
        } as any;
        harness.crossReference._entriesHistory = [
            undefined,
            [newestEntry, signedEntry]
        ];
        const originalGetPhysicalOffsetForEntry:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchReferenceInRevision:
            (
                reference: _PdfReference,
                revisionId: number
            ) => any = harness.crossReference._fetchReferenceInRevision;
        const originalFetch:
            (reference: _PdfReference) => any =
            harness.crossReference._fetch;
        const originalFetchDictAtEntry:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                crossReference: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        const originalEvaluateLockRules:
            (
                dictionary: _PdfDictionary,
                revisionId: number,
                crossReference: _PdfCrossReference
            ) => boolean = harness.field._evaluateLockRules;
        const originalReadFormReferences:
            (
                oldDictionary: _PdfDictionary,
                newDictionary: _PdfDictionary,
                oldRevision: number,
                newRevision: number
            ) => boolean = harness.crossReference._readFormReferences;
        let comparedOldAcroForm: _PdfDictionary;
        let comparedNewAcroForm: _PdfDictionary;
        let oldRevision: number = -1;
        let newRevision: number = -1;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.offset;
        harness.crossReference._fetchReferenceInRevision =
            (
                reference: _PdfReference,
                _revisionId: number
            ): any => {
                if (reference.objectNumber ===
                    acroFormReference.objectNumber) {
                    return oldAcroForm;
                }
                return undefined;
            };
        harness.crossReference._fetch =
            (reference: _PdfReference): any => {
                if (reference.objectNumber ===
                    acroFormReference.objectNumber) {
                    return newAcroForm;
                }
                return undefined;
            };
        harness.field._fetchDictAtEntry =
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                _crossReference: _PdfCrossReference
            ): _PdfDictionary => {
                if (objectNumber === acroFormReference.objectNumber &&
                    entry.revisionId === 2) {
                    return newAcroForm;
                }
                if (objectNumber === acroFormReference.objectNumber &&
                    entry.revisionId === 1) {
                    return oldAcroForm;
                }
                return undefined;
            };
        harness.field._evaluateLockRules =
            (
                _dictionary: _PdfDictionary,
                _revisionId: number,
                _crossReference: _PdfCrossReference
            ): boolean => {
                return undefined;
            };
        harness.crossReference._readFormReferences =
            (
                oldDictionary: _PdfDictionary,
                newDictionary: _PdfDictionary,
                signedRevision: number,
                currentRevision: number
            ): boolean => {
                comparedOldAcroForm = oldDictionary;
                comparedNewAcroForm = newDictionary;
                oldRevision = signedRevision;
                newRevision = currentRevision;
                return true;
            };
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalGetPhysicalOffsetForEntry;
        harness.crossReference._fetchReferenceInRevision =
            originalFetchReferenceInRevision;
        harness.crossReference._fetch = originalFetch;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        harness.field._evaluateLockRules = originalEvaluateLockRules;
        harness.crossReference._readFormReferences =
            originalReadFormReferences;
        // Assert
        expect(result).toBeTruthy();
        expect(comparedOldAcroForm).toBe(oldAcroForm);
        expect(comparedNewAcroForm).toBe(newAcroForm);
        expect(oldRevision).toBe(1);
        expect(newRevision).toBe(2);
        expect(
            harness.catalog.getRaw('AcroForm') instanceof _PdfReference
        ).toBeTruthy();
        expect(
            (harness.catalog.getRaw('AcroForm') as _PdfReference).objectNumber
        ).toBe(1);
    });
    it('returns true for a newly added Page without annotations', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            crossReference: _PdfCrossReference;
            catalog: _PdfDictionary;
            trailer: _PdfDictionary;
        } = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        const pageDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        pageDictionary.update('Type', _PdfName.get('Page'));
        harness.crossReference._entriesHistory = [
            undefined,
            [newestEntry]
        ];
        const originalGetPhysicalOffsetForEntry:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictAtEntry:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                crossReference: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        const originalIsSigOrTimestampDict:
            (dictionary: _PdfDictionary) => boolean =
            harness.field._isSigOrTimestampDict;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.offset;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                _entry: _PdfObjectInformation,
                _crossReference: _PdfCrossReference
            ): _PdfDictionary => {
                return pageDictionary;
            };
        harness.field._isSigOrTimestampDict =
            (_dictionary: _PdfDictionary): boolean => {
                return false;
            };
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalGetPhysicalOffsetForEntry;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        harness.field._isSigOrTimestampDict =
            originalIsSigOrTimestampDict;
        // Assert
        expect(result).toBeTruthy();
        expect(pageDictionary.has('Type')).toBeTruthy();
        expect((pageDictionary.get('Type') as _PdfName).name).toBe('Page');
        expect(pageDictionary.has('Annots')).toBeFalsy();
    });
    it('continues for a newly added Page containing only Widget annotations', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            crossReference: _PdfCrossReference;
            catalog: _PdfDictionary;
            trailer: _PdfDictionary;
        } = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        const pageDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        const widgetDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        widgetDictionary.update('Subtype', _PdfName.get('Widget'));
        pageDictionary.update('Type', _PdfName.get('Page'));
        pageDictionary.update('Annots', [widgetDictionary]);
        harness.crossReference._entriesHistory = [
            undefined,
            [newestEntry]
        ];
        const originalGetPhysicalOffsetForEntry:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictAtEntry:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                crossReference: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        const originalIsSigOrTimestampDict:
            (dictionary: _PdfDictionary) => boolean =
            harness.field._isSigOrTimestampDict;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.offset;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                _entry: _PdfObjectInformation,
                _crossReference: _PdfCrossReference
            ): _PdfDictionary => {
                return pageDictionary;
            };
        harness.field._isSigOrTimestampDict =
            (_dictionary: _PdfDictionary): boolean => {
                return false;
            };
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalGetPhysicalOffsetForEntry;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        harness.field._isSigOrTimestampDict =
            originalIsSigOrTimestampDict;
        // Assert
        expect(result).toBeFalsy();
        expect(pageDictionary.getRaw('Annots').length).toBe(1);
        expect(
            (widgetDictionary.get('Subtype') as _PdfName).name
        ).toBe('Widget');
    });
    it('returns true for a newly added Pages dictionary without page children', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            crossReference: _PdfCrossReference;
            catalog: _PdfDictionary;
            trailer: _PdfDictionary;
        } = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        const pagesDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        pagesDictionary.update('Type', _PdfName.get('Pages'));
        harness.crossReference._entriesHistory = [
            undefined,
            [newestEntry]
        ];
        const originalGetPhysicalOffsetForEntry:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictAtEntry:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                crossReference: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        const originalIsSigOrTimestampDict:
            (dictionary: _PdfDictionary) => boolean =
            harness.field._isSigOrTimestampDict;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.offset;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                _entry: _PdfObjectInformation,
                _crossReference: _PdfCrossReference
            ): _PdfDictionary => {
                return pagesDictionary;
            };
        harness.field._isSigOrTimestampDict =
            (_dictionary: _PdfDictionary): boolean => {
                return false;
            };
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalGetPhysicalOffsetForEntry;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        harness.field._isSigOrTimestampDict =
            originalIsSigOrTimestampDict;
        // Assert
        expect(result).toBeTruthy();
        expect((pagesDictionary.get('Type') as _PdfName).name).toBe('Pages');
        expect(pagesDictionary.has('Kids')).toBeFalsy();
    });
    it('continues for a newly added Pages dictionary containing Page and Pages children', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            crossReference: _PdfCrossReference;
            catalog: _PdfDictionary;
            trailer: _PdfDictionary;
        } = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        const pagesDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        const pageChildDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        const pagesChildDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        pageChildDictionary.update('Type', _PdfName.get('Page'));
        pagesChildDictionary.update('Type', _PdfName.get('Pages'));
        pagesDictionary.update('Type', _PdfName.get('Pages'));
        pagesDictionary.update(
            'Kids',
            [pageChildDictionary, pagesChildDictionary]
        );
        harness.crossReference._entriesHistory = [
            undefined,
            [newestEntry]
        ];
        const originalGetPhysicalOffsetForEntry:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictAtEntry:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                crossReference: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        const originalIsSigOrTimestampDict:
            (dictionary: _PdfDictionary) => boolean =
            harness.field._isSigOrTimestampDict;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.offset;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                _entry: _PdfObjectInformation,
                _crossReference: _PdfCrossReference
            ): _PdfDictionary => {
                return pagesDictionary;
            };
        harness.field._isSigOrTimestampDict =
            (_dictionary: _PdfDictionary): boolean => {
                return false;
            };
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalGetPhysicalOffsetForEntry;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        harness.field._isSigOrTimestampDict =
            originalIsSigOrTimestampDict;
        // Assert
        expect(result).toBeFalsy();
        expect(pagesDictionary.getRaw('Kids').length).toBe(2);
        expect(
            (pageChildDictionary.get('Type') as _PdfName).name
        ).toBe('Page');
        expect(
            (pagesChildDictionary.get('Type') as _PdfName).name
        ).toBe('Pages');
    });
    it('continues for ObjStm and XRef dictionary types', () => {
        // Arrange
        const objectStreamHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            crossReference: _PdfCrossReference;
            catalog: _PdfDictionary;
            trailer: _PdfDictionary;
        } = makeIncrementUpdateHarness();
        const crossReferenceHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            crossReference: _PdfCrossReference;
            catalog: _PdfDictionary;
            trailer: _PdfDictionary;
        } = makeIncrementUpdateHarness();
        const objectStreamEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        const crossReferenceEntry: _PdfObjectInformation =
            makeIncrementEntry(2, 150);
        const objectStreamDictionary: _PdfDictionary =
            new _PdfDictionary(objectStreamHarness.crossReference);
        const crossReferenceDictionary: _PdfDictionary =
            new _PdfDictionary(crossReferenceHarness.crossReference);
        objectStreamDictionary.update('Type', _PdfName.get('ObjStm'));
        crossReferenceDictionary.update('Type', _PdfName.get('XRef'));
        objectStreamHarness.crossReference._entriesHistory = [
            undefined,
            [objectStreamEntry]
        ];
        crossReferenceHarness.crossReference._entriesHistory = [
            undefined,
            [crossReferenceEntry]
        ];
        const originalObjectStreamGetPhysicalOffset:
            (entry: _PdfObjectInformation) => number =
            objectStreamHarness.crossReference._getPhysicalOffsetForEntry;
        const originalObjectStreamFetchDict:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                crossReference: _PdfCrossReference
            ) => _PdfDictionary =
            objectStreamHarness.field._fetchDictAtEntry;
        const originalObjectStreamSignatureCheck:
            (dictionary: _PdfDictionary) => boolean =
            objectStreamHarness.field._isSigOrTimestampDict;
        const originalCrossReferenceGetPhysicalOffset:
            (entry: _PdfObjectInformation) => number =
            crossReferenceHarness.crossReference._getPhysicalOffsetForEntry;
        const originalCrossReferenceFetchDict:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                crossReference: _PdfCrossReference
            ) => _PdfDictionary =
            crossReferenceHarness.field._fetchDictAtEntry;
        const originalCrossReferenceSignatureCheck:
            (dictionary: _PdfDictionary) => boolean =
            crossReferenceHarness.field._isSigOrTimestampDict;
        objectStreamHarness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.offset;
        objectStreamHarness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                _entry: _PdfObjectInformation,
                _crossReference: _PdfCrossReference
            ): _PdfDictionary => objectStreamDictionary;
        objectStreamHarness.field._isSigOrTimestampDict =
            (_dictionary: _PdfDictionary): boolean => false;
        crossReferenceHarness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.offset;
        crossReferenceHarness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                _entry: _PdfObjectInformation,
                _crossReference: _PdfCrossReference
            ): _PdfDictionary => crossReferenceDictionary;
        crossReferenceHarness.field._isSigOrTimestampDict =
            (_dictionary: _PdfDictionary): boolean => false;
        // Act
        const objectStreamResult: boolean =
            objectStreamHarness.field._checkIncrementUpdate();
        const crossReferenceResult: boolean =
            crossReferenceHarness.field._checkIncrementUpdate();
        objectStreamHarness.crossReference._getPhysicalOffsetForEntry =
            originalObjectStreamGetPhysicalOffset;
        objectStreamHarness.field._fetchDictAtEntry =
            originalObjectStreamFetchDict;
        objectStreamHarness.field._isSigOrTimestampDict =
            originalObjectStreamSignatureCheck;
        crossReferenceHarness.crossReference._getPhysicalOffsetForEntry =
            originalCrossReferenceGetPhysicalOffset;
        crossReferenceHarness.field._fetchDictAtEntry =
            originalCrossReferenceFetchDict;
        crossReferenceHarness.field._isSigOrTimestampDict =
            originalCrossReferenceSignatureCheck;
        // Assert
        expect(objectStreamResult).toBeFalsy();
        expect(crossReferenceResult).toBeFalsy();
        expect(
            (objectStreamDictionary.get('Type') as _PdfName).name
        ).toBe('ObjStm');
        expect(
            (crossReferenceDictionary.get('Type') as _PdfName).name
        ).toBe('XRef');
    });
});
describe('PdfSignatureField _checkIncrementUpdate lines 6384 to 6500 fixed tests', () => {
    function makeIncrementUpdateHarness(): {
        document: PdfDocument;
        page: PdfPage;
        field: PdfSignatureField;
        crossReference: _PdfCrossReference;
        catalog: _PdfDictionary;
        trailer: _PdfDictionary;
    } {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page, 'signature1', { x: 20, y: 20, width: 120, height: 40 }
        );
        document.form.add(field);
        const crossReference: _PdfCrossReference = field._crossReference;
        const catalog: _PdfDictionary = new _PdfDictionary(crossReference);
        const trailer: _PdfDictionary = new _PdfDictionary(crossReference);
        trailer.update('Prev', 10);
        crossReference._root = catalog;
        crossReference._trailer = trailer;
        crossReference._entriesHistory = [];
        field._signature = {
            _ranges: [0, 100, 200, 100],
            _certify: false,
            _documentPermissions: PdfCertificationFlag.forbidChanges,
            _isLocked: false
        } as any;
        return { document, page, field, crossReference, catalog, trailer };
    }
    function makeIncrementEntry(
        revisionId: number,
        offset: number,
        generation: number = 0
    ): _PdfObjectInformation {
        return {
            revisionId: revisionId,
            offset: offset,
            gen: generation,
            free: false
        } as _PdfObjectInformation;
    }
    it('does not treat a non AcroForm object as the top-level AcroForm', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            crossReference: _PdfCrossReference;
            catalog: _PdfDictionary;
            trailer: _PdfDictionary;
        } = makeIncrementUpdateHarness();
        const acroFormReference: _PdfReference = _PdfReference.get(2, 0);
        const newestEntry: _PdfObjectInformation = makeIncrementEntry(2, 150);
        const signedEntry: _PdfObjectInformation = makeIncrementEntry(1, 50);
        const signedAcroForm: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        const currentAcroForm: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        const oldDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        const newDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        signedAcroForm.update('Fields', []);
        currentAcroForm.update('Fields', []);
        oldDictionary.update('Type', _PdfName.get('Custom'));
        oldDictionary.update('Value', 'old');
        newDictionary.update('Type', _PdfName.get('Custom'));
        newDictionary.update('Value', 'new');
        harness.catalog.update('AcroForm', acroFormReference);
        harness.field._signature = {
            _ranges: [0, 100, 200, 100],
            _certify: true,
            _documentPermissions: PdfCertificationFlag.allowFormFill,
            _isLocked: false
        } as any;
        harness.crossReference._entriesHistory = [undefined, [newestEntry, signedEntry]];
        const originalGetPhysicalOffsetForEntry: (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchReferenceInRevision: (reference: _PdfReference, revisionId: number) => any =
            harness.crossReference._fetchReferenceInRevision;
        const originalFetch: (reference: _PdfReference) => any = harness.crossReference._fetch;
        const originalFetchDictAtEntry: (
            objectNumber: number,
            entry: _PdfObjectInformation,
            crossReference: _PdfCrossReference
        ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        const originalEvaluateLockRules: (
            dictionary: _PdfDictionary,
            revisionId: number,
            crossReference: _PdfCrossReference
        ) => boolean = harness.field._evaluateLockRules;
        const originalCompareObjects: (
            oldDictionary: _PdfDictionary,
            newDictionary: _PdfDictionary,
            skippedObjects: Set<number>,
            objectNumber: number,
            hasPermission: boolean,
            permission: PdfCertificationFlag,
            oldRevision: number,
            newRevision: number
        ) => boolean = harness.crossReference._compareObjects;
        let comparedOldDictionary: _PdfDictionary;
        let comparedNewDictionary: _PdfDictionary;
        let comparedObjectNumber: number = 0;
        let comparedOldRevision: number = 0;
        let comparedNewRevision: number = 0;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.revisionId === 2 ? 150 : 50;
        harness.crossReference._fetchReferenceInRevision =
            (reference: _PdfReference, _revisionId: number): any => {
                return reference.objectNumber === acroFormReference.objectNumber ? signedAcroForm : undefined;
            };
        harness.crossReference._fetch = (reference: _PdfReference): any => {
            return reference.objectNumber === acroFormReference.objectNumber ? currentAcroForm : undefined;
        };
        harness.field._fetchDictAtEntry = (
            objectNumber: number,
            entry: _PdfObjectInformation,
            _crossReference: _PdfCrossReference
        ): _PdfDictionary => {
            if (objectNumber === 1 && entry.revisionId === 2) {
                return newDictionary;
            }
            if (objectNumber === 1 && entry.revisionId === 1) {
                return oldDictionary;
            }
            return undefined;
        };
        harness.field._evaluateLockRules = (
            _dictionary: _PdfDictionary,
            _revisionId: number,
            _crossReference: _PdfCrossReference
        ): boolean => undefined;
        harness.crossReference._compareObjects = (
            existingDictionary: _PdfDictionary,
            updatedDictionary: _PdfDictionary,
            _skippedObjects: Set<number>,
            objectNumber: number,
            _hasPermission: boolean,
            _permission: PdfCertificationFlag,
            oldRevision: number,
            newRevision: number
        ): boolean => {
            comparedOldDictionary = existingDictionary;
            comparedNewDictionary = updatedDictionary;
            comparedObjectNumber = objectNumber;
            comparedOldRevision = oldRevision;
            comparedNewRevision = newRevision;
            return true;
        };
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry = originalGetPhysicalOffsetForEntry;
        harness.crossReference._fetchReferenceInRevision = originalFetchReferenceInRevision;
        harness.crossReference._fetch = originalFetch;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        harness.field._evaluateLockRules = originalEvaluateLockRules;
        harness.crossReference._compareObjects = originalCompareObjects;
        // Assert
        expect(result).toBeTruthy();
        expect(comparedObjectNumber).toBe(1);
        expect(acroFormReference.objectNumber).toBe(2);
        expect(comparedObjectNumber).not.toBe(acroFormReference.objectNumber);
        expect(comparedOldDictionary).toBe(oldDictionary);
        expect(comparedNewDictionary).toBe(newDictionary);
        expect(comparedOldRevision).toBe(1);
        expect(comparedNewRevision).toBe(2);
    });
    it('collects a later signature object and skips its changed object history', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            crossReference: _PdfCrossReference;
            catalog: _PdfDictionary;
            trailer: _PdfDictionary;
        } = makeIncrementUpdateHarness();
        const firstNewestEntry: _PdfObjectInformation = makeIncrementEntry(2, 150, 3);
        const secondNewestEntry: _PdfObjectInformation = makeIncrementEntry(2, 160);
        const signatureDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        const changedDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        signatureDictionary.update('Type', _PdfName.get('Sig'));
        changedDictionary.update('Type', _PdfName.get('Page'));
        harness.crossReference._entriesHistory = [
            undefined,
            [firstNewestEntry],
            [secondNewestEntry]
        ];
        const originalGetPhysicalOffsetForEntry: (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictAtEntry: (
            objectNumber: number,
            entry: _PdfObjectInformation,
            crossReference: _PdfCrossReference
        ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        const originalIsSigOrTimestampDict: (dictionary: _PdfDictionary) => boolean =
            harness.field._isSigOrTimestampDict;
        const originalCollectLaterSignatureObjects: (
            reference: _PdfReference,
            crossReference: _PdfCrossReference,
            objectNumbers: Set<number>
        ) => void = harness.field._collectLaterSignatureObjects;
        let collectedObjectNumber: number = 0;
        let collectedGeneration: number = -1;
        let secondObjectFetchCount: number = 0;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => 150;
        harness.field._fetchDictAtEntry = (
            objectNumber: number,
            _entry: _PdfObjectInformation,
            _crossReference: _PdfCrossReference
        ): _PdfDictionary => {
            if (objectNumber === 1) {
                return signatureDictionary;
            }
            secondObjectFetchCount++;
            return changedDictionary;
        };
        harness.field._isSigOrTimestampDict = (dictionary: _PdfDictionary): boolean => {
            return dictionary === signatureDictionary;
        };
        harness.field._collectLaterSignatureObjects = (
            reference: _PdfReference,
            _crossReference: _PdfCrossReference,
            objectNumbers: Set<number>
        ): void => {
            collectedObjectNumber = reference.objectNumber;
            collectedGeneration = reference.generationNumber;
            objectNumbers.add(2);
        };
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry = originalGetPhysicalOffsetForEntry;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        harness.field._isSigOrTimestampDict = originalIsSigOrTimestampDict;
        harness.field._collectLaterSignatureObjects = originalCollectLaterSignatureObjects;
        // Assert
        expect(result).toBeFalsy();
        expect(collectedObjectNumber).toBe(1);
        expect(collectedGeneration).toBe(3);
        expect(secondObjectFetchCount).toBe(0);
    });
});
// Append this block after the existing file-level helpers.
// Uses the existing IncrementUpdateHarness, makeIncrementUpdateHarness,
// and makeIncrementEntry helpers from field1.spec.ts.
describe('PdfSignatureField _checkIncrementUpdate lines 6500 to 6754 mutation coverage', () => {
    it('returns true when the signed object dictionary is unavailable', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation = makeIncrementEntry(2, 150);
        const signedEntry: _PdfObjectInformation = makeIncrementEntry(1, 50);
        const newDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        newDictionary.update('Value', 'new');
        harness.crossReference._entriesHistory = [undefined, [newestEntry, signedEntry]];
        const originalGetPhysicalOffsetForEntry: (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictAtEntry: (
            objectNumber: number,
            entry: _PdfObjectInformation,
            crossReference: _PdfCrossReference
        ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.revisionId === 2 ? 150 : 50;
        harness.field._fetchDictAtEntry = (
            _objectNumber: number,
            entry: _PdfObjectInformation,
            _crossReference: _PdfCrossReference
        ): _PdfDictionary => entry.revisionId === 2 ? newDictionary : undefined;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry = originalGetPhysicalOffsetForEntry;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        // Assert
        expect(result).toBeTruthy();
    });
    it('continues when the modified signed object is a signature dictionary', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation = makeIncrementEntry(2, 150);
        const signedEntry: _PdfObjectInformation = makeIncrementEntry(1, 50);
        const oldDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        const signatureDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        signatureDictionary.update('Type', _PdfName.get('Sig'));
        harness.crossReference._entriesHistory = [undefined, [newestEntry, signedEntry]];
        const originalGetPhysicalOffsetForEntry: (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictAtEntry: (objectNumber: number, entry: _PdfObjectInformation,
            crossReference: _PdfCrossReference) => _PdfDictionary = harness.field._fetchDictAtEntry;
        const originalIsSigOrTimestampDict: (dictionary: _PdfDictionary) => boolean =
            harness.field._isSigOrTimestampDict;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.revisionId === 2 ? 150 : 50;
        harness.field._fetchDictAtEntry = (_objectNumber: number, entry: _PdfObjectInformation,
            _crossReference: _PdfCrossReference): _PdfDictionary => {
            return entry.revisionId === 2 ? signatureDictionary : oldDictionary;
        };
        harness.field._isSigOrTimestampDict = (dictionary: _PdfDictionary): boolean => {
            return dictionary === signatureDictionary;
        };
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry = originalGetPhysicalOffsetForEntry;
        harness.field._fetchDictAtEntry = originalFetchDictAtEntry;
        harness.field._isSigOrTimestampDict = originalIsSigOrTimestampDict;
        // Assert
        expect(result).toBeFalsy();
        expect((signatureDictionary.get('Type') as _PdfName).name).toBe('Sig');
    });
    it('returns the page verification result for a modified Page dictionary', () => {
        // Arrange
        const rejectedHarness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const allowedHarness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const rejectedNewest: _PdfObjectInformation = makeIncrementEntry(2, 150);
        const rejectedSigned: _PdfObjectInformation = makeIncrementEntry(1, 50);
        const allowedNewest: _PdfObjectInformation = makeIncrementEntry(2, 150);
        const allowedSigned: _PdfObjectInformation = makeIncrementEntry(1, 50);
        const rejectedOld: _PdfDictionary = new _PdfDictionary(rejectedHarness.crossReference);
        const rejectedNew: _PdfDictionary = new _PdfDictionary(rejectedHarness.crossReference);
        const allowedOld: _PdfDictionary = new _PdfDictionary(allowedHarness.crossReference);
        const allowedNew: _PdfDictionary = new _PdfDictionary(allowedHarness.crossReference);
        rejectedNew.update('Type', _PdfName.get('Page'));
        allowedNew.update('Type', _PdfName.get('Page'));
        rejectedHarness.crossReference._entriesHistory = [undefined, [rejectedNewest, rejectedSigned]];
        allowedHarness.crossReference._entriesHistory = [undefined, [allowedNewest, allowedSigned]];
        const rejectedOriginalOffset: (entry: _PdfObjectInformation) => number =
            rejectedHarness.crossReference._getPhysicalOffsetForEntry;
        const allowedOriginalOffset: (entry: _PdfObjectInformation) => number =
            allowedHarness.crossReference._getPhysicalOffsetForEntry;
        const rejectedOriginalFetch: (objectNumber: number, entry: _PdfObjectInformation,
            crossReference: _PdfCrossReference) => _PdfDictionary = rejectedHarness.field._fetchDictAtEntry;
        const allowedOriginalFetch: (objectNumber: number, entry: _PdfObjectInformation,
            crossReference: _PdfCrossReference) => _PdfDictionary = allowedHarness.field._fetchDictAtEntry;
        const rejectedOriginalLock: (dictionary: _PdfDictionary, revisionId: number,
            crossReference: _PdfCrossReference) => boolean = rejectedHarness.field._evaluateLockRules;
        const allowedOriginalLock: (dictionary: _PdfDictionary, revisionId: number,
            crossReference: _PdfCrossReference) => boolean = allowedHarness.field._evaluateLockRules;
        const rejectedOriginalVerify: (oldDictionary: _PdfDictionary, newDictionary: _PdfDictionary,
            hasPermission: boolean, permission: PdfCertificationFlag) => boolean =
            rejectedHarness.crossReference._verifyPageIsModify;
        const allowedOriginalVerify: (oldDictionary: _PdfDictionary, newDictionary: _PdfDictionary,
            hasPermission: boolean, permission: PdfCertificationFlag) => boolean =
            allowedHarness.crossReference._verifyPageIsModify;
        rejectedHarness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.revisionId === 2 ? 150 : 50;
        allowedHarness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.revisionId === 2 ? 150 : 50;
        rejectedHarness.field._fetchDictAtEntry = (_objectNumber: number, entry: _PdfObjectInformation,
            _crossReference: _PdfCrossReference): _PdfDictionary => entry.revisionId === 2 ? rejectedNew : rejectedOld;
        allowedHarness.field._fetchDictAtEntry = (_objectNumber: number, entry: _PdfObjectInformation,
            _crossReference: _PdfCrossReference): _PdfDictionary => entry.revisionId === 2 ? allowedNew : allowedOld;
        rejectedHarness.field._evaluateLockRules = (_dictionary: _PdfDictionary, _revisionId: number,
            _crossReference: _PdfCrossReference): boolean => undefined;
        allowedHarness.field._evaluateLockRules = (_dictionary: _PdfDictionary, _revisionId: number,
            _crossReference: _PdfCrossReference): boolean => undefined;
        rejectedHarness.crossReference._verifyPageIsModify = (_oldDictionary: _PdfDictionary,
            _newDictionary: _PdfDictionary, _hasPermission: boolean,
            _permission: PdfCertificationFlag): boolean => true;
        allowedHarness.crossReference._verifyPageIsModify = (_oldDictionary: _PdfDictionary,
            _newDictionary: _PdfDictionary, _hasPermission: boolean,
            _permission: PdfCertificationFlag): boolean => false;
        // Act
        const rejectedResult: boolean = rejectedHarness.field._checkIncrementUpdate();
        const allowedResult: boolean = allowedHarness.field._checkIncrementUpdate();
        rejectedHarness.crossReference._getPhysicalOffsetForEntry = rejectedOriginalOffset;
        allowedHarness.crossReference._getPhysicalOffsetForEntry = allowedOriginalOffset;
        rejectedHarness.field._fetchDictAtEntry = rejectedOriginalFetch;
        allowedHarness.field._fetchDictAtEntry = allowedOriginalFetch;
        rejectedHarness.field._evaluateLockRules = rejectedOriginalLock;
        allowedHarness.field._evaluateLockRules = allowedOriginalLock;
        rejectedHarness.crossReference._verifyPageIsModify = rejectedOriginalVerify;
        allowedHarness.crossReference._verifyPageIsModify = allowedOriginalVerify;
        // Assert
        expect(rejectedResult).toBeTruthy();
        expect(allowedResult).toBeFalsy();
    });
    it('continues for a Widget annotation when form filling is permitted', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation = makeIncrementEntry(2, 150);
        const signedEntry: _PdfObjectInformation = makeIncrementEntry(1, 50);
        const oldDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        const widgetDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        widgetDictionary.update('Type', _PdfName.get('Annot'));
        widgetDictionary.update('Subtype', _PdfName.get('Widget'));
        harness.field._signature = {
            _ranges: [0, 100, 200, 100],
            _certify: true,
            _documentPermissions: PdfCertificationFlag.allowFormFill,
            _isLocked: false
        } as any;
        harness.crossReference._entriesHistory = [undefined, [newestEntry, signedEntry]];
        const originalOffset: (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetch: (objectNumber: number, entry: _PdfObjectInformation,
            crossReference: _PdfCrossReference) => _PdfDictionary = harness.field._fetchDictAtEntry;
        const originalLock: (dictionary: _PdfDictionary, revisionId: number,
            crossReference: _PdfCrossReference) => boolean = harness.field._evaluateLockRules;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.revisionId === 2 ? 150 : 50;
        harness.field._fetchDictAtEntry = (_objectNumber: number, entry: _PdfObjectInformation,
            _crossReference: _PdfCrossReference): _PdfDictionary => entry.revisionId === 2 ? widgetDictionary : oldDictionary;
        harness.field._evaluateLockRules = (_dictionary: _PdfDictionary, _revisionId: number,
            _crossReference: _PdfCrossReference): boolean => undefined;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry = originalOffset;
        harness.field._fetchDictAtEntry = originalFetch;
        harness.field._evaluateLockRules = originalLock;
        // Assert
        expect(result).toBeFalsy();
        expect((widgetDictionary.get('Type') as _PdfName).name).toBe('Annot');
        expect((widgetDictionary.get('Subtype') as _PdfName).name).toBe('Widget');
    });
    it('uses _checkSubType output for a non Widget annotation', () => {
        // Arrange
        const acceptedHarness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const rejectedHarness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const acceptedNewest: _PdfObjectInformation = makeIncrementEntry(2, 150);
        const acceptedSigned: _PdfObjectInformation = makeIncrementEntry(1, 50);
        const rejectedNewest: _PdfObjectInformation = makeIncrementEntry(2, 150);
        const rejectedSigned: _PdfObjectInformation = makeIncrementEntry(1, 50);
        const acceptedOld: _PdfDictionary = new _PdfDictionary(acceptedHarness.crossReference);
        const acceptedNew: _PdfDictionary = new _PdfDictionary(acceptedHarness.crossReference);
        const rejectedOld: _PdfDictionary = new _PdfDictionary(rejectedHarness.crossReference);
        const rejectedNew: _PdfDictionary = new _PdfDictionary(rejectedHarness.crossReference);
        acceptedNew.update('Type', _PdfName.get('Annot'));
        acceptedNew.update('Subtype', _PdfName.get('Text'));
        rejectedNew.update('Type', _PdfName.get('Annot'));
        rejectedNew.update('Subtype', _PdfName.get('Text'));
        acceptedHarness.crossReference._entriesHistory = [undefined, [acceptedNewest, acceptedSigned]];
        rejectedHarness.crossReference._entriesHistory = [undefined, [rejectedNewest, rejectedSigned]];
        const acceptedOriginalOffset: any = acceptedHarness.crossReference._getPhysicalOffsetForEntry;
        const rejectedOriginalOffset: any = rejectedHarness.crossReference._getPhysicalOffsetForEntry;
        const acceptedOriginalFetch: any = acceptedHarness.field._fetchDictAtEntry;
        const rejectedOriginalFetch: any = rejectedHarness.field._fetchDictAtEntry;
        const acceptedOriginalLock: any = acceptedHarness.field._evaluateLockRules;
        const rejectedOriginalLock: any = rejectedHarness.field._evaluateLockRules;
        const acceptedOriginalCheck: any = acceptedHarness.crossReference._checkSubType;
        const rejectedOriginalCheck: any = rejectedHarness.crossReference._checkSubType;
        acceptedHarness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.revisionId === 2 ? 150 : 50;
        rejectedHarness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.revisionId === 2 ? 150 : 50;
        acceptedHarness.field._fetchDictAtEntry = (_objectNumber: number, entry: _PdfObjectInformation,
            _crossReference: _PdfCrossReference): _PdfDictionary => entry.revisionId === 2 ? acceptedNew : acceptedOld;
        rejectedHarness.field._fetchDictAtEntry = (_objectNumber: number, entry: _PdfObjectInformation,
            _crossReference: _PdfCrossReference): _PdfDictionary => entry.revisionId === 2 ? rejectedNew : rejectedOld;
        acceptedHarness.field._evaluateLockRules = (): boolean => undefined;
        rejectedHarness.field._evaluateLockRules = (): boolean => undefined;
        acceptedHarness.crossReference._checkSubType = (): boolean => true;
        rejectedHarness.crossReference._checkSubType = (): boolean => false;
        // Act
        const acceptedResult: boolean = acceptedHarness.field._checkIncrementUpdate();
        const rejectedResult: boolean = rejectedHarness.field._checkIncrementUpdate();
        acceptedHarness.crossReference._getPhysicalOffsetForEntry = acceptedOriginalOffset;
        rejectedHarness.crossReference._getPhysicalOffsetForEntry = rejectedOriginalOffset;
        acceptedHarness.field._fetchDictAtEntry = acceptedOriginalFetch;
        rejectedHarness.field._fetchDictAtEntry = rejectedOriginalFetch;
        acceptedHarness.field._evaluateLockRules = acceptedOriginalLock;
        rejectedHarness.field._evaluateLockRules = rejectedOriginalLock;
        acceptedHarness.crossReference._checkSubType = acceptedOriginalCheck;
        rejectedHarness.crossReference._checkSubType = rejectedOriginalCheck;
        // Assert
        expect(acceptedResult).toBeFalsy();
        expect(rejectedResult).toBeTruthy();
    });
    it('returns true when a signed Fields array loses an existing field', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation = makeIncrementEntry(2, 150);
        const signedEntry: _PdfObjectInformation = makeIncrementEntry(1, 50);
        const oldDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        const newDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        const fieldReference: _PdfReference = _PdfReference.get(10, 0);
        oldDictionary.update('Fields', [fieldReference]);
        newDictionary.update('Fields', []);
        harness.crossReference._entriesHistory = [undefined, [newestEntry, signedEntry]];
        const originalOffset: any = harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetch: any = harness.field._fetchDictAtEntry;
        const originalLock: any = harness.field._evaluateLockRules;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.revisionId === 2 ? 150 : 50;
        harness.field._fetchDictAtEntry = (_objectNumber: number, entry: _PdfObjectInformation,
            _crossReference: _PdfCrossReference): _PdfDictionary => entry.revisionId === 2 ? newDictionary : oldDictionary;
        harness.field._evaluateLockRules = (): boolean => undefined;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry = originalOffset;
        harness.field._fetchDictAtEntry = originalFetch;
        harness.field._evaluateLockRules = originalLock;
        // Assert
        expect(result).toBeTruthy();
        expect(newDictionary.getRaw('Fields').length).toBe(0);
        expect(oldDictionary.getRaw('Fields').length).toBe(1);
    });
    it('returns true when an added Fields item is not an indirect reference', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation = makeIncrementEntry(2, 150);
        const signedEntry: _PdfObjectInformation = makeIncrementEntry(1, 50);
        const oldDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        const newDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        oldDictionary.update('Fields', []);
        newDictionary.update('Fields', ['direct field']);
        harness.crossReference._entriesHistory = [undefined, [newestEntry, signedEntry]];
        const originalOffset: any = harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetch: any = harness.field._fetchDictAtEntry;
        const originalLock: any = harness.field._evaluateLockRules;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.revisionId === 2 ? 150 : 50;
        harness.field._fetchDictAtEntry = (_objectNumber: number, entry: _PdfObjectInformation,
            _crossReference: _PdfCrossReference): _PdfDictionary => entry.revisionId === 2 ? newDictionary : oldDictionary;
        harness.field._evaluateLockRules = (): boolean => undefined;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry = originalOffset;
        harness.field._fetchDictAtEntry = originalFetch;
        harness.field._evaluateLockRules = originalLock;
        // Assert
        expect(result).toBeTruthy();
        expect(newDictionary.getRaw('Fields')[0]).toBe('direct field');
    });
    it('returns true when an added field reference cannot resolve to a dictionary', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation = makeIncrementEntry(2, 150);
        const signedEntry: _PdfObjectInformation = makeIncrementEntry(1, 50);
        const addedFieldReference: _PdfReference = _PdfReference.get(11, 0);
        const oldDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        const newDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        oldDictionary.update('Fields', []);
        newDictionary.update('Fields', [addedFieldReference]);
        harness.crossReference._entriesHistory = [undefined, [newestEntry, signedEntry]];
        const originalOffset: any = harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictionary: any = harness.field._fetchDictAtEntry;
        const originalLock: any = harness.field._evaluateLockRules;
        const originalFetchRevision: any = harness.crossReference._fetchReferenceInRevision;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.revisionId === 2 ? 150 : 50;
        harness.field._fetchDictAtEntry = (_objectNumber: number, entry: _PdfObjectInformation,
            _crossReference: _PdfCrossReference): _PdfDictionary => entry.revisionId === 2 ? newDictionary : oldDictionary;
        harness.field._evaluateLockRules = (): boolean => undefined;
        harness.crossReference._fetchReferenceInRevision = (): any => 'not a dictionary';
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry = originalOffset;
        harness.field._fetchDictAtEntry = originalFetchDictionary;
        harness.field._evaluateLockRules = originalLock;
        harness.crossReference._fetchReferenceInRevision = originalFetchRevision;
        // Assert
        expect(result).toBeTruthy();
        expect(addedFieldReference.objectNumber).toBe(11);
    });
    it('continues when the only added field is a signature field', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation = makeIncrementEntry(2, 150);
        const signedEntry: _PdfObjectInformation = makeIncrementEntry(1, 50);
        const addedFieldReference: _PdfReference = _PdfReference.get(12, 0);
        const oldDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        const newDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        const signatureFieldDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        oldDictionary.update('Fields', []);
        newDictionary.update('Fields', [addedFieldReference]);
        signatureFieldDictionary.update('FT', _PdfName.get('Sig'));
        harness.crossReference._entriesHistory = [undefined, [newestEntry, signedEntry]];
        const originalOffset: any = harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictionary: any = harness.field._fetchDictAtEntry;
        const originalLock: any = harness.field._evaluateLockRules;
        const originalFetchRevision: any = harness.crossReference._fetchReferenceInRevision;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.revisionId === 2 ? 150 : 50;
        harness.field._fetchDictAtEntry = (_objectNumber: number, entry: _PdfObjectInformation,
            _crossReference: _PdfCrossReference): _PdfDictionary => entry.revisionId === 2 ? newDictionary : oldDictionary;
        harness.field._evaluateLockRules = (): boolean => undefined;
        harness.crossReference._fetchReferenceInRevision = (): any => signatureFieldDictionary;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry = originalOffset;
        harness.field._fetchDictAtEntry = originalFetchDictionary;
        harness.field._evaluateLockRules = originalLock;
        harness.crossReference._fetchReferenceInRevision = originalFetchRevision;
        // Assert
        expect(result).toBeFalsy();
        expect((signatureFieldDictionary.get('FT') as _PdfName).name).toBe('Sig');
    });
    it('returns true when an added field is not a signature field', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation = makeIncrementEntry(2, 150);
        const signedEntry: _PdfObjectInformation = makeIncrementEntry(1, 50);
        const addedFieldReference: _PdfReference = _PdfReference.get(13, 0);
        const oldDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        const newDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        const textFieldDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        oldDictionary.update('Fields', []);
        newDictionary.update('Fields', [addedFieldReference]);
        textFieldDictionary.update('FT', _PdfName.get('Tx'));
        harness.crossReference._entriesHistory = [undefined, [newestEntry, signedEntry]];
        const originalOffset: any = harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictionary: any = harness.field._fetchDictAtEntry;
        const originalLock: any = harness.field._evaluateLockRules;
        const originalFetchRevision: any = harness.crossReference._fetchReferenceInRevision;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.revisionId === 2 ? 150 : 50;
        harness.field._fetchDictAtEntry = (_objectNumber: number, entry: _PdfObjectInformation,
            _crossReference: _PdfCrossReference): _PdfDictionary => entry.revisionId === 2 ? newDictionary : oldDictionary;
        harness.field._evaluateLockRules = (): boolean => undefined;
        harness.crossReference._fetchReferenceInRevision = (): any => textFieldDictionary;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry = originalOffset;
        harness.field._fetchDictAtEntry = originalFetchDictionary;
        harness.field._evaluateLockRules = originalLock;
        harness.crossReference._fetchReferenceInRevision = originalFetchRevision;
        // Assert
        expect(result).toBeTruthy();
        expect((textFieldDictionary.get('FT') as _PdfName).name).toBe('Tx');
    });
    it('continues for a no Type and no Subtype change when form filling is permitted', () => {
        // Arrange
        const harness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const newestEntry: _PdfObjectInformation = makeIncrementEntry(2, 150);
        const signedEntry: _PdfObjectInformation = makeIncrementEntry(1, 50);
        const oldDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        const newDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
        oldDictionary.update('Value', 'old');
        newDictionary.update('Value', 'new');
        harness.field._signature = {
            _ranges: [0, 100, 200, 100],
            _certify: true,
            _documentPermissions: PdfCertificationFlag.allowFormFill,
            _isLocked: false
        } as any;
        harness.crossReference._entriesHistory = [undefined, [newestEntry, signedEntry]];
        const originalOffset: any = harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetch: any = harness.field._fetchDictAtEntry;
        const originalLock: any = harness.field._evaluateLockRules;
        harness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.revisionId === 2 ? 150 : 50;
        harness.field._fetchDictAtEntry = (_objectNumber: number, entry: _PdfObjectInformation,
            _crossReference: _PdfCrossReference): _PdfDictionary => entry.revisionId === 2 ? newDictionary : oldDictionary;
        harness.field._evaluateLockRules = (): boolean => undefined;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        harness.crossReference._getPhysicalOffsetForEntry = originalOffset;
        harness.field._fetchDictAtEntry = originalFetch;
        harness.field._evaluateLockRules = originalLock;
        // Assert
        expect(result).toBeFalsy();
        expect(newDictionary.has('Type')).toBeFalsy();
        expect(newDictionary.has('Subtype')).toBeFalsy();
    });
    it('returns the changed object result when no allowed exception applies', () => {
        // Arrange
        const changedHarness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const unchangedHarness: IncrementUpdateHarness = makeIncrementUpdateHarness();
        const changedNewest: _PdfObjectInformation = makeIncrementEntry(2, 150);
        const changedSigned: _PdfObjectInformation = makeIncrementEntry(1, 50);
        const unchangedNewest: _PdfObjectInformation = makeIncrementEntry(2, 150);
        const unchangedSigned: _PdfObjectInformation = makeIncrementEntry(1, 50);
        const changedOld: _PdfDictionary = new _PdfDictionary(changedHarness.crossReference);
        const changedNew: _PdfDictionary = new _PdfDictionary(changedHarness.crossReference);
        const unchangedOld: _PdfDictionary = new _PdfDictionary(unchangedHarness.crossReference);
        const unchangedNew: _PdfDictionary = new _PdfDictionary(unchangedHarness.crossReference);
        changedOld.update('Type', _PdfName.get('Custom'));
        changedNew.update('Type', _PdfName.get('Custom'));
        unchangedOld.update('Type', _PdfName.get('Custom'));
        unchangedNew.update('Type', _PdfName.get('Custom'));
        changedHarness.crossReference._entriesHistory = [undefined, [changedNewest, changedSigned]];
        unchangedHarness.crossReference._entriesHistory = [undefined, [unchangedNewest, unchangedSigned]];
        const changedOriginalOffset: any = changedHarness.crossReference._getPhysicalOffsetForEntry;
        const unchangedOriginalOffset: any = unchangedHarness.crossReference._getPhysicalOffsetForEntry;
        const changedOriginalFetch: any = changedHarness.field._fetchDictAtEntry;
        const unchangedOriginalFetch: any = unchangedHarness.field._fetchDictAtEntry;
        const changedOriginalLock: any = changedHarness.field._evaluateLockRules;
        const unchangedOriginalLock: any = unchangedHarness.field._evaluateLockRules;
        const changedOriginalCompare: any = changedHarness.crossReference._compareObjects;
        const unchangedOriginalCompare: any = unchangedHarness.crossReference._compareObjects;
        changedHarness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.revisionId === 2 ? 150 : 50;
        unchangedHarness.crossReference._getPhysicalOffsetForEntry =
            (entry: _PdfObjectInformation): number => entry.revisionId === 2 ? 150 : 50;
        changedHarness.field._fetchDictAtEntry = (_objectNumber: number, entry: _PdfObjectInformation,
            _crossReference: _PdfCrossReference): _PdfDictionary => entry.revisionId === 2 ? changedNew : changedOld;
        unchangedHarness.field._fetchDictAtEntry = (_objectNumber: number, entry: _PdfObjectInformation,
            _crossReference: _PdfCrossReference): _PdfDictionary => entry.revisionId === 2 ? unchangedNew : unchangedOld;
        changedHarness.field._evaluateLockRules = (): boolean => undefined;
        unchangedHarness.field._evaluateLockRules = (): boolean => undefined;
        changedHarness.crossReference._compareObjects = (): boolean => true;
        unchangedHarness.crossReference._compareObjects = (): boolean => false;
        // Act
        const changedResult: boolean = changedHarness.field._checkIncrementUpdate();
        const unchangedResult: boolean = unchangedHarness.field._checkIncrementUpdate();
        changedHarness.crossReference._getPhysicalOffsetForEntry = changedOriginalOffset;
        unchangedHarness.crossReference._getPhysicalOffsetForEntry = unchangedOriginalOffset;
        changedHarness.field._fetchDictAtEntry = changedOriginalFetch;
        unchangedHarness.field._fetchDictAtEntry = unchangedOriginalFetch;
        changedHarness.field._evaluateLockRules = changedOriginalLock;
        unchangedHarness.field._evaluateLockRules = unchangedOriginalLock;
        changedHarness.crossReference._compareObjects = changedOriginalCompare;
        unchangedHarness.crossReference._compareObjects = unchangedOriginalCompare;
        // Assert
        expect(changedResult).toBeTruthy();
        expect(unchangedResult).toBeFalsy();
    });
});
interface SignatureHelperHarness {
    document: PdfDocument;
    page: PdfPage;
    field: PdfSignatureField;
    crossReference: _PdfCrossReference;
}
function makeSignatureHelperHarness(): SignatureHelperHarness {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const field: PdfSignatureField = new PdfSignatureField(
        page, 'signature1', { x: 20, y: 20, width: 120, height: 40 }
    );
    document.form.add(field);
    return { document, page, field, crossReference: field._crossReference };
}
function makeSignatureObjectEntry(
    revisionId: number,
    physicalOffset: number,
    free: boolean = false,
    generation: number = 0
): _PdfObjectInformation {
    const entry: any = {
        revisionId: revisionId,
        offset: physicalOffset,
        free: free,
        gen: generation
    };
    return entry as _PdfObjectInformation;
}
describe('PdfSignatureField helper methods lines 6755 to 6932 mutation coverage', () => {
    describe('_isInByteRange', () => {
        it('returns false for a non-finite position', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            // Act
            const result: boolean = harness.field._isInByteRange(Number.NaN, 0, 10, 20, 10);
            // Assert
            expect(result).toBeFalsy();
        });
        it('includes both boundaries of the first byte range', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            // Act
            const startResult: boolean = harness.field._isInByteRange(10, 10, 5, 30, 5);
            const endResult: boolean = harness.field._isInByteRange(15, 10, 5, 30, 5);
            const beforeResult: boolean = harness.field._isInByteRange(9, 10, 5, 30, 5);
            const afterResult: boolean = harness.field._isInByteRange(16, 10, 5, 30, 5);
            // Assert
            expect(startResult).toBeTruthy();
            expect(endResult).toBeTruthy();
            expect(beforeResult).toBeFalsy();
            expect(afterResult).toBeFalsy();
        });
        it('includes both boundaries of the second byte range', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            // Act
            const startResult: boolean = harness.field._isInByteRange(30, 10, 5, 30, 5);
            const endResult: boolean = harness.field._isInByteRange(35, 10, 5, 30, 5);
            const outsideResult: boolean = harness.field._isInByteRange(29, 10, 5, 30, 5);
            // Assert
            expect(startResult).toBeTruthy();
            expect(endResult).toBeTruthy();
            expect(outsideResult).toBeFalsy();
        });
    });
    describe('_addTopRefIfAny', () => {
        it('adds only an indirect reference object number', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const reference: _PdfReference = _PdfReference.get(14, 0);
            const skippedObjects: Set<number> = new Set<number>();
            // Act
            harness.field._addTopRefIfAny(reference, skippedObjects);
            harness.field._addTopRefIfAny(new _PdfDictionary(harness.crossReference), skippedObjects);
            // Assert
            expect(skippedObjects.size).toBe(1);
            expect(skippedObjects.has(14)).toBeTruthy();
        });
    });
    describe('_readAllSubRefs', () => {
        it('returns without fetching for undefined input and depth above fifty', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const reference: _PdfReference = _PdfReference.get(20, 0);
            const skippedObjects: Set<number> = new Set<number>();
            const originalFetch: (reference: _PdfReference, revisionId: number) => any =
                harness.crossReference._fetchReferenceInRevision;
            let fetchCount: number = 0;
            harness.crossReference._fetchReferenceInRevision = (
                _reference: _PdfReference,
                _revisionId: number
            ): any => {
                fetchCount++;
                return undefined;
            };
            // Act
            harness.field._readAllSubRefs(undefined, 1, harness.crossReference, skippedObjects);
            harness.field._readAllSubRefs(reference, 1, harness.crossReference, skippedObjects, 51);
            harness.crossReference._fetchReferenceInRevision = originalFetch;
            // Assert
            expect(fetchCount).toBe(0);
            expect(skippedObjects.size).toBe(0);
        });
        it('processes a reference at depth fifty but not depth fifty one', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const depthFiftyReference: _PdfReference = _PdfReference.get(21, 0);
            const depthFiftyOneReference: _PdfReference = _PdfReference.get(22, 0);
            const skippedObjects: Set<number> = new Set<number>();
            const originalFetch: (reference: _PdfReference, revisionId: number) => any =
                harness.crossReference._fetchReferenceInRevision;
            let fetchedObjectNumber: number = 0;
            harness.crossReference._fetchReferenceInRevision = (
                reference: _PdfReference,
                _revisionId: number
            ): any => {
                fetchedObjectNumber = reference.objectNumber;
                return undefined;
            };
            // Act
            harness.field._readAllSubRefs(
                depthFiftyReference, 1, harness.crossReference, skippedObjects, 50
            );
            harness.field._readAllSubRefs(
                depthFiftyOneReference, 1, harness.crossReference, skippedObjects, 51
            );
            harness.crossReference._fetchReferenceInRevision = originalFetch;
            // Assert
            expect(fetchedObjectNumber).toBe(21);
            expect(skippedObjects.has(21)).toBeTruthy();
            expect(skippedObjects.has(22)).toBeFalsy();
        });
        it('adds and fetches a reference once and skips an already visited reference', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const reference: _PdfReference = _PdfReference.get(23, 0);
            const skippedObjects: Set<number> = new Set<number>();
            const fetchedDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const originalFetch: (reference: _PdfReference, revisionId: number) => any =
                harness.crossReference._fetchReferenceInRevision;
            let fetchCount: number = 0;
            harness.crossReference._fetchReferenceInRevision = (
                _reference: _PdfReference,
                _revisionId: number
            ): any => {
                fetchCount++;
                return fetchedDictionary;
            };
            // Act
            harness.field._readAllSubRefs(reference, 2, harness.crossReference, skippedObjects);
            harness.field._readAllSubRefs(reference, 2, harness.crossReference, skippedObjects);
            harness.crossReference._fetchReferenceInRevision = originalFetch;
            // Assert
            expect(fetchCount).toBe(1);
            expect(skippedObjects.size).toBe(1);
            expect(skippedObjects.has(23)).toBeTruthy();
        });
        it('reads dictionary values except P and Parent', () => {
            // Arrange
            const harness: SignatureHelperHarness =
                makeSignatureHelperHarness();
            const skippedObjects: Set<number> =
                new Set<number>();
            const pageReference: _PdfReference =
                _PdfReference.get(24, 0);
            const parentReference: _PdfReference =
                _PdfReference.get(25, 0);
            const childReference: _PdfReference =
                _PdfReference.get(26, 0);
            const dictionary: _PdfDictionary =
                new _PdfDictionary(harness.crossReference);
            const originalForEach:
                (callback: (key: string, value: any) => void) => void =
                dictionary.forEach;
            const originalGet:
                (key: string) => any =
                dictionary.get;
            const originalGetRaw:
                (key: string) => any =
                dictionary.getRaw;
            const originalFetchReferenceInRevision:
                (
                    reference: _PdfReference,
                    revisionId: number
                ) => any =
                harness.crossReference._fetchReferenceInRevision;
            let fetchCount: number = 0;
            let fetchedObjectNumber: number = 0;
            let fetchedRevisionId: number = 0;
            dictionary.forEach =
                (
                    callback: (key: string, value: any) => void
                ): void => {
                    callback('P', pageReference);
                    callback('Parent', parentReference);
                    callback('Child', childReference);
                };
            dictionary.get =
                (key: string): any => {
                    if (key === 'P') {
                        return pageReference;
                    }
                    if (key === 'Parent') {
                        return parentReference;
                    }
                    if (key === 'Child') {
                        return childReference;
                    }
                    return undefined;
                };
            dictionary.getRaw =
                (key: string): any => {
                    if (key === 'P') {
                        return pageReference;
                    }
                    if (key === 'Parent') {
                        return parentReference;
                    }
                    if (key === 'Child') {
                        return childReference;
                    }
                    return undefined;
                };
            harness.crossReference._fetchReferenceInRevision =
                (
                    reference: _PdfReference,
                    revisionId: number
                ): any => {
                    fetchCount++;
                    fetchedObjectNumber = reference.objectNumber;
                    fetchedRevisionId = revisionId;
                    return undefined;
                };
            // Act
            harness.field._readAllSubRefs(
                dictionary,
                3,
                harness.crossReference,
                skippedObjects
            );
            dictionary.forEach =
                originalForEach;
            dictionary.get =
                originalGet;
            dictionary.getRaw =
                originalGetRaw;
            harness.crossReference._fetchReferenceInRevision =
                originalFetchReferenceInRevision;
            // Assert
            expect(fetchCount).toBe(1);
            expect(fetchedObjectNumber).toBe(26);
            expect(fetchedRevisionId).toBe(3);
            expect(skippedObjects.size).toBe(1);
            expect(skippedObjects.has(24)).toBeFalsy();
            expect(skippedObjects.has(25)).toBeFalsy();
            expect(skippedObjects.has(26)).toBeTruthy();
        });
        it('reads every reference in an array', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const skippedObjects: Set<number> = new Set<number>();
            const firstReference: _PdfReference = _PdfReference.get(27, 0);
            const secondReference: _PdfReference = _PdfReference.get(28, 0);
            const originalFetch: (reference: _PdfReference, revisionId: number) => any =
                harness.crossReference._fetchReferenceInRevision;
            const fetchedNumbers: number[] = [];
            harness.crossReference._fetchReferenceInRevision = (
                reference: _PdfReference,
                _revisionId: number
            ): any => {
                fetchedNumbers.push(reference.objectNumber);
                return undefined;
            };
            // Act
            harness.field._readAllSubRefs(
                [firstReference, secondReference], 4, harness.crossReference, skippedObjects
            );
            harness.crossReference._fetchReferenceInRevision = originalFetch;
            // Assert
            expect(fetchedNumbers.length).toBe(2);
            expect(fetchedNumbers[0]).toBe(27);
            expect(fetchedNumbers[1]).toBe(28);
        });
    });
    describe('_collectLaterSignatureObjects', () => {
        it('returns for undefined input and depth above fifty', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const reference: _PdfReference = _PdfReference.get(30, 0);
            const laterObjects: Set<number> = new Set<number>();
            const originalFetch: (reference: _PdfReference) => any = harness.crossReference._fetch;
            let fetchCount: number = 0;
            harness.crossReference._fetch = (_reference: _PdfReference): any => {
                fetchCount++;
                return undefined;
            };
            // Act
            harness.field._collectLaterSignatureObjects(
                undefined, harness.crossReference, laterObjects
            );
            harness.field._collectLaterSignatureObjects(
                reference, harness.crossReference, laterObjects, 51
            );
            harness.crossReference._fetch = originalFetch;
            // Assert
            expect(fetchCount).toBe(0);
            expect(laterObjects.size).toBe(0);
        });
        it('processes a reference at depth fifty', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const reference: _PdfReference = _PdfReference.get(31, 0);
            const laterObjects: Set<number> = new Set<number>();
            const originalFetch: (reference: _PdfReference) => any = harness.crossReference._fetch;
            let fetchCount: number = 0;
            harness.crossReference._fetch = (_reference: _PdfReference): any => {
                fetchCount++;
                return undefined;
            };
            // Act
            harness.field._collectLaterSignatureObjects(
                reference, harness.crossReference, laterObjects, 50
            );
            harness.crossReference._fetch = originalFetch;
            // Assert
            expect(fetchCount).toBe(1);
            expect(laterObjects.has(31)).toBeTruthy();
        });
        it('adds an unvisited reference and traverses the fetched dictionary', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const rootReference: _PdfReference = _PdfReference.get(32, 0);
            const childReference: _PdfReference = _PdfReference.get(33, 0);
            const fetchedDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            fetchedDictionary.update('Child', childReference);
            const laterObjects: Set<number> = new Set<number>();
            const originalFetch: (reference: _PdfReference) => any = harness.crossReference._fetch;
            harness.crossReference._fetch = (reference: _PdfReference): any => {
                return reference.objectNumber === 32 ? fetchedDictionary : undefined;
            };
            // Act
            harness.field._collectLaterSignatureObjects(
                rootReference, harness.crossReference, laterObjects
            );
            harness.crossReference._fetch = originalFetch;
            // Assert
            expect(laterObjects.has(32)).toBeTruthy();
            expect(laterObjects.has(33)).toBeTruthy();
            expect(laterObjects.size).toBe(2);
        });
        it('fetches an already visited reference and traverses a fetched value', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const rootReference: _PdfReference = _PdfReference.get(34, 0);
            const childReference: _PdfReference = _PdfReference.get(35, 0);
            const fetchedDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            fetchedDictionary.update('Child', childReference);
            const laterObjects: Set<number> = new Set<number>();
            laterObjects.add(34);
            const originalFetch: (reference: _PdfReference) => any = harness.crossReference._fetch;
            harness.crossReference._fetch = (reference: _PdfReference): any => {
                return reference.objectNumber === 34 ? fetchedDictionary : undefined;
            };
            // Act
            harness.field._collectLaterSignatureObjects(
                rootReference, harness.crossReference, laterObjects
            );
            harness.crossReference._fetch = originalFetch;
            // Assert
            expect(laterObjects.has(34)).toBeTruthy();
            expect(laterObjects.has(35)).toBeTruthy();
        });
        it('does not recurse when an already visited reference fetches no value', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const reference: _PdfReference = _PdfReference.get(36, 0);
            const laterObjects: Set<number> = new Set<number>();
            laterObjects.add(36);
            const originalFetch: (reference: _PdfReference) => any = harness.crossReference._fetch;
            let fetchCount: number = 0;
            harness.crossReference._fetch = (_reference: _PdfReference): any => {
                fetchCount++;
                return undefined;
            };
            // Act
            harness.field._collectLaterSignatureObjects(
                reference, harness.crossReference, laterObjects
            );
            harness.crossReference._fetch = originalFetch;
            // Assert
            expect(fetchCount).toBe(1);
            expect(laterObjects.size).toBe(1);
        });
        it('reads raw dictionary values except P and Parent', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const dictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            dictionary.update('P', _PdfReference.get(37, 0));
            dictionary.update('Parent', _PdfReference.get(38, 0));
            dictionary.update('Child', _PdfReference.get(39, 0));
            const laterObjects: Set<number> = new Set<number>();
            const originalFetch: (reference: _PdfReference) => any = harness.crossReference._fetch;
            harness.crossReference._fetch = (_reference: _PdfReference): any => undefined;
            // Act
            harness.field._collectLaterSignatureObjects(
                dictionary, harness.crossReference, laterObjects
            );
            harness.crossReference._fetch = originalFetch;
            // Assert
            expect(laterObjects.has(37)).toBeFalsy();
            expect(laterObjects.has(38)).toBeFalsy();
            expect(laterObjects.has(39)).toBeTruthy();
        });
        it('reads every reference in an array', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const laterObjects: Set<number> = new Set<number>();
            const originalFetch: (reference: _PdfReference) => any = harness.crossReference._fetch;
            harness.crossReference._fetch = (_reference: _PdfReference): any => undefined;
            // Act
            harness.field._collectLaterSignatureObjects(
                [_PdfReference.get(40, 0), _PdfReference.get(41, 0)],
                harness.crossReference,
                laterObjects
            );
            harness.crossReference._fetch = originalFetch;
            // Assert
            expect(laterObjects.size).toBe(2);
            expect(laterObjects.has(40)).toBeTruthy();
            expect(laterObjects.has(41)).toBeTruthy();
        });
    });
    describe('_fetchDictAtEntry', () => {
        it('returns undefined for an unavailable or free entry', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const freeEntry: _PdfObjectInformation = makeSignatureObjectEntry(1, 20, true);
            // Act
            const unavailableResult: _PdfDictionary = harness.field._fetchDictAtEntry(
                42, undefined, harness.crossReference
            );
            const freeResult: _PdfDictionary = harness.field._fetchDictAtEntry(
                42, freeEntry, harness.crossReference
            );
            // Assert
            expect(unavailableResult).toBeUndefined();
            expect(freeResult).toBeUndefined();
        });
        it('uses the entry generation and returns the fetched dictionary', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const entry: _PdfObjectInformation = makeSignatureObjectEntry(2, 150, false, 4);
            const dictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const originalFetch: (
                reference: _PdfReference,
                entry: _PdfObjectInformation,
                suppressEncryption: boolean
            ) => any = harness.crossReference._fetchAtEntry;
            let objectNumber: number = 0;
            let generationNumber: number = 0;
            let suppressEncryption: boolean = true;
            harness.crossReference._fetchAtEntry = (
                reference: _PdfReference,
                _entry: _PdfObjectInformation,
                suppress: boolean
            ): any => {
                objectNumber = reference.objectNumber;
                generationNumber = reference.generationNumber;
                suppressEncryption = suppress;
                return dictionary;
            };
            // Act
            const result: _PdfDictionary = harness.field._fetchDictAtEntry(
                43, entry, harness.crossReference
            );
            harness.crossReference._fetchAtEntry = originalFetch;
            // Assert
            expect(result).toBe(dictionary);
            expect(objectNumber).toBe(43);
            expect(generationNumber).toBe(4);
            expect(suppressEncryption).toBeFalsy();
        });
    });
    describe('_isSigOrTimestampDict', () => {
        it('recognizes every supported signature dictionary name', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const typeSignature: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const subtypeSignature: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const fieldSignature: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const documentTimestamp: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const timestamp: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            typeSignature.update('Type', _PdfName.get('Sig'));
            subtypeSignature.update('Subtype', _PdfName.get('Sig'));
            fieldSignature.update('FT', _PdfName.get('Sig'));
            documentTimestamp.update('Type', _PdfName.get('DocTimeStamp'));
            timestamp.update('Type', _PdfName.get('Timestamp'));
            // Act
            const typeResult: boolean = harness.field._isSigOrTimestampDict(typeSignature);
            const subtypeResult: boolean = harness.field._isSigOrTimestampDict(subtypeSignature);
            const fieldResult: boolean = harness.field._isSigOrTimestampDict(fieldSignature);
            const documentTimestampResult: boolean = harness.field._isSigOrTimestampDict(documentTimestamp);
            const timestampResult: boolean = harness.field._isSigOrTimestampDict(timestamp);
            // Assert
            expect(typeResult).toBeTruthy();
            expect(subtypeResult).toBeTruthy();
            expect(fieldResult).toBeTruthy();
            expect(documentTimestampResult).toBeTruthy();
            expect(timestampResult).toBeTruthy();
        });
        it('rejects missing names strings and unrelated names', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const emptyDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const stringDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const unrelatedDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            stringDictionary.update('Type', 'Sig');
            unrelatedDictionary.update('Type', _PdfName.get('Catalog'));
            // Act
            const emptyResult: boolean = harness.field._isSigOrTimestampDict(emptyDictionary);
            const stringResult: boolean = harness.field._isSigOrTimestampDict(stringDictionary);
            const unrelatedResult: boolean = harness.field._isSigOrTimestampDict(unrelatedDictionary);
            // Assert
            expect(emptyResult).toBeFalsy();
            expect(stringResult).toBeFalsy();
            expect(unrelatedResult).toBeFalsy();
        });
    });
    describe('_derefInRevision and _nameValue', () => {
        it('dereferences a reference and preserves a direct value', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const reference: _PdfReference = _PdfReference.get(44, 0);
            const dictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const originalFetch: (reference: _PdfReference, revisionId: number) => any =
                harness.crossReference._fetchReferenceInRevision;
            let revisionId: number = 0;
            harness.crossReference._fetchReferenceInRevision = (
                _reference: _PdfReference,
                revision: number
            ): any => {
                revisionId = revision;
                return dictionary;
            };
            // Act
            const indirectResult: any = harness.field._derefInRevision(
                reference, 7, harness.crossReference
            );
            const directResult: any = harness.field._derefInRevision(
                dictionary, 7, harness.crossReference
            );
            harness.crossReference._fetchReferenceInRevision = originalFetch;
            // Assert
            expect(indirectResult).toBe(dictionary);
            expect(directResult).toBe(dictionary);
            expect(revisionId).toBe(7);
        });
        it('returns name string and undefined values exactly', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            // Act
            const nameResult: string = harness.field._nameValue(_PdfName.get('Include'));
            const stringResult: string = harness.field._nameValue('All');
            const undefinedResult: string = harness.field._nameValue(5);
            // Assert
            expect(nameResult).toBe('Include');
            expect(stringResult).toBe('All');
            expect(undefinedResult).toBeUndefined();
        });
    });
    describe('_evaluateLockRules', () => {
        it('returns null when no Lock or signature reference rules exist', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const dictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            // Act
            const result: boolean = harness.field._evaluateLockRules(
                dictionary, 1, harness.crossReference
            );
            // Assert
            expect(result).toBeNull();
        });
        it('returns true for Include when the Lock Fields array is unavailable', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const dictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const valueDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const referenceDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const transformDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            transformDictionary.update('Action', _PdfName.get('Include'));
            referenceDictionary.update('TransformParams', transformDictionary);
            valueDictionary.update('Reference', [referenceDictionary]);
            dictionary.update('V', valueDictionary);
            // Act
            const result: boolean = harness.field._evaluateLockRules(
                dictionary, 2, harness.crossReference
            );
            // Assert
            expect(result).toBeTruthy();
        });
        it('returns false for Include when the Lock Fields array contains a field', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const dictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const lockDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const valueDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const referenceDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const transformDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            lockDictionary.update('Fields', ['signature1']);
            transformDictionary.update('Action', 'Include');
            referenceDictionary.update('TransformParams', transformDictionary);
            valueDictionary.update('Reference', [referenceDictionary]);
            dictionary.update('Lock', lockDictionary);
            dictionary.update('V', valueDictionary);
            // Act
            const result: boolean = harness.field._evaluateLockRules(
                dictionary, 3, harness.crossReference
            );
            // Assert
            expect(result).toBeFalsy();
        });
        it('returns false for the All action', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const dictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const valueDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const referenceDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const transformDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            transformDictionary.update('Action', _PdfName.get('All'));
            referenceDictionary.update('TransformParams', transformDictionary);
            valueDictionary.update('Reference', [referenceDictionary]);
            dictionary.update('V', valueDictionary);
            // Act
            const result: boolean = harness.field._evaluateLockRules(
                dictionary, 4, harness.crossReference
            );
            // Assert
            expect(result).toBeFalsy();
        });
        it('skips invalid reference and transform parameter entries', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const dictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const valueDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const missingTransform: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const missingActionReference: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const missingActionTransform: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            missingActionReference.update('TransformParams', missingActionTransform);
            valueDictionary.update(
                'Reference',
                ['invalid reference', missingTransform, missingActionReference]
            );
            dictionary.update('V', valueDictionary);
            // Act
            const result: boolean = harness.field._evaluateLockRules(
                dictionary, 5, harness.crossReference
            );
            // Assert
            expect(result).toBeNull();
        });
        it('dereferences Lock Fields V Reference TransformParams and Action values', () => {
            // Arrange
            const harness: SignatureHelperHarness = makeSignatureHelperHarness();
            const dictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const lockReference: _PdfReference = _PdfReference.get(50, 0);
            const fieldsReference: _PdfReference = _PdfReference.get(51, 0);
            const valueReference: _PdfReference = _PdfReference.get(52, 0);
            const referencesReference: _PdfReference = _PdfReference.get(53, 0);
            const referenceDictionaryReference: _PdfReference = _PdfReference.get(54, 0);
            const transformReference: _PdfReference = _PdfReference.get(55, 0);
            const actionReference: _PdfReference = _PdfReference.get(56, 0);
            const lockDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const valueDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const referenceDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            const transformDictionary: _PdfDictionary = new _PdfDictionary(harness.crossReference);
            lockDictionary.update('Fields', fieldsReference);
            valueDictionary.update('Reference', referencesReference);
            referenceDictionary.update('TransformParams', transformReference);
            transformDictionary.update('Action', actionReference);
            dictionary.update('Lock', lockReference);
            dictionary.update('V', valueReference);
            const originalFetch: (reference: _PdfReference, revisionId: number) => any =
                harness.crossReference._fetchReferenceInRevision;
            harness.crossReference._fetchReferenceInRevision = (
                reference: _PdfReference,
                _revisionId: number
            ): any => {
                switch (reference.objectNumber) {
                    case 50: return lockDictionary;
                    case 51: return ['signature1'];
                    case 52: return valueDictionary;
                    case 53: return [referenceDictionaryReference];
                    case 54: return referenceDictionary;
                    case 55: return transformDictionary;
                    case 56: return _PdfName.get('Include');
                    default: return undefined;
                }
            };
            // Act
            const result: boolean = harness.field._evaluateLockRules(
                dictionary, 6, harness.crossReference
            );
            harness.crossReference._fetchReferenceInRevision = originalFetch;
            // Assert
            expect(result).toBeFalsy();
        });
    });
});
import { RevocationStatus, RevocationType } from '../src/pdf/core/enumerator';
import { _PdfUniqueEncodingElement } from '../src/pdf/core/security/digital-signature/asn1/unique-encoding-element';
interface SignatureValidationHarness {
    document: PdfDocument;
    page: PdfPage;
    field: PdfSignatureField;
}
function makeSignatureValidationHarness(): SignatureValidationHarness {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const field: PdfSignatureField = new PdfSignatureField(
        page,
        'signature1',
        { x: 20, y: 20, width: 120, height: 40 }
    );
    document.form.add(field);
    return { document, page, field };
}
function makeTimeElement(tagNumber: number, value: string | Uint8Array): any {
    return {
        _getTagNumber: (): number => tagNumber,
        _getValue: (): string | Uint8Array => value
    };
}
describe('PdfSignatureField helper methods lines 6933 to 7042 mutation coverage', () => {
    describe('_isLtvObject', () => {
        it('returns true for an array', () => {
            // Arrange
            const harness: SignatureValidationHarness = makeSignatureValidationHarness();
            // Act
            const result: boolean = (harness.field as any)._isLtvObject([]);
            // Assert
            expect(result).toBeTruthy();
        });
        it('returns true for a dictionary containing only LTV keys', () => {
            // Arrange
            const harness: SignatureValidationHarness = makeSignatureValidationHarness();
            const dictionary: _PdfDictionary = new _PdfDictionary();
            dictionary.set('OCSPs', []);
            dictionary.set('CRLs', []);
            dictionary.set('VRI', new _PdfDictionary());
            // Act
            const result: boolean = (harness.field as any)._isLtvObject(dictionary);
            // Assert
            expect(result).toBeTruthy();
        });
        it('returns false for a dictionary containing a non LTV key', () => {
            // Arrange
            const harness: SignatureValidationHarness = makeSignatureValidationHarness();
            const dictionary: _PdfDictionary = new _PdfDictionary();
            dictionary.set('OCSPs', []);
            dictionary.set('Custom', true);
            // Act
            const result: boolean = (harness.field as any)._isLtvObject(dictionary);
            // Assert
            expect(result).toBeFalsy();
        });
        it('returns false for a non LTV scalar value', () => {
            // Arrange
            const harness: SignatureValidationHarness = makeSignatureValidationHarness();
            // Act
            const result: boolean = (harness.field as any)._isLtvObject('value');
            // Assert
            expect(result).toBeFalsy();
        });
    });
    describe('_validateRevocationCore', () => {
        it('returns the default result when revocation validation is none', () => {
            // Arrange
            const harness: SignatureValidationHarness = makeSignatureValidationHarness();
            // Act
            const result: any = (harness.field as any)._validateRevocationCore(
                RevocationType.none
            );
            // Assert
            expect(result.isRevokedCRL).toBeFalsy();
            expect(result.ocspRevocationStatus).toBe(RevocationStatus.none);
        });
        it('returns the default result when certificates are unavailable', () => {
            // Arrange
            const harness: SignatureValidationHarness = makeSignatureValidationHarness();
            (harness.field as any)._cmsSigner = undefined;
            // Act
            const result: any = (harness.field as any)._validateRevocationCore(
                RevocationType.ocsp
            );
            // Assert
            expect(result.isRevokedCRL).toBeFalsy();
            expect(result.ocspRevocationStatus).toBe(RevocationStatus.none);
        });
        it('returns the default result when the certificate collection is empty', () => {
            // Arrange
            const harness: SignatureValidationHarness = makeSignatureValidationHarness();
            (harness.field as any)._cmsSigner = { _certificates: [] } as any;
            // Act
            const result: any = (harness.field as any)._validateRevocationCore(
                RevocationType.crl
            );
            // Assert
            expect(result.isRevokedCRL).toBeFalsy();
            expect(result.ocspRevocationStatus).toBe(RevocationStatus.none);
        });
        it('uses supplied OCSP data when DSS OCSP data is unavailable', () => {
            // Arrange
            const harness: SignatureValidationHarness = makeSignatureValidationHarness();
            const suppliedOcsp: Uint8Array = new Uint8Array([1, 2, 3]);
            const expectedStatus: RevocationStatus = RevocationStatus.good;
            (harness.field as any)._cmsSigner = { _certificates: [{}] } as any;
            (harness.field as any)._signature = {
                _validateLtvOcsp: (data: Uint8Array): RevocationStatus => {
                    expect(data).toBe(suppliedOcsp);
                    return expectedStatus;
                }
            } as any;
            const originalExtractOcsp: () => Uint8Array = (harness.field as any)._extractOcspFromDss;
            (harness.field as any)._extractOcspFromDss = (): Uint8Array => undefined;
            // Act
            const result: any = (harness.field as any)._validateRevocationCore(
                RevocationType.ocsp,
                suppliedOcsp
            );
            (harness.field as any)._extractOcspFromDss = originalExtractOcsp;
            // Assert
            expect(result.ocspRevocationStatus).toBe(expectedStatus);
            expect(result.isRevokedCRL).toBeFalsy();
        });
        it('prefers DSS OCSP data over supplied OCSP data', () => {
            // Arrange
            const harness: SignatureValidationHarness = makeSignatureValidationHarness();
            const dssOcsp: Uint8Array = new Uint8Array([4, 5]);
            const suppliedOcsp: Uint8Array = new Uint8Array([6, 7]);
            let validatedData: Uint8Array;
            (harness.field as any)._cmsSigner = { _certificates: [{}] } as any;
            (harness.field as any)._signature = {
                _validateLtvOcsp: (data: Uint8Array): RevocationStatus => {
                    validatedData = data;
                    return RevocationStatus.good;
                }
            } as any;
            const originalExtractOcsp: () => Uint8Array = (harness.field as any)._extractOcspFromDss;
            (harness.field as any)._extractOcspFromDss = (): Uint8Array => dssOcsp;
            // Act
            const result: any = (harness.field as any)._validateRevocationCore(
                RevocationType.ocsp,
                suppliedOcsp
            );
            (harness.field as any)._extractOcspFromDss = originalExtractOcsp;
            // Assert
            expect(validatedData).toBe(dssOcsp);
            expect(validatedData).not.toBe(suppliedOcsp);
            expect(result.ocspRevocationStatus).toBe(RevocationStatus.good);
        });
        it('does not validate OCSP when no OCSP data exists', () => {
            // Arrange
            const harness: SignatureValidationHarness = makeSignatureValidationHarness();
            let validationCount: number = 0;
            (harness.field as any)._cmsSigner = { _certificates: [{}] } as any;
            (harness.field as any)._signature = {
                _validateLtvOcsp: (_data: Uint8Array): RevocationStatus => {
                    validationCount++;
                    return RevocationStatus.good;
                }
            } as any;
            const originalExtractOcsp: () => Uint8Array = (harness.field as any)._extractOcspFromDss;
            (harness.field as any)._extractOcspFromDss = (): Uint8Array => undefined;
            // Act
            const result: any = (harness.field as any)._validateRevocationCore(
                RevocationType.ocsp,
                new Uint8Array(0)
            );
            (harness.field as any)._extractOcspFromDss = originalExtractOcsp;
            // Assert
            expect(validationCount).toBe(0);
            expect(result.ocspRevocationStatus).toBe(RevocationStatus.none);
        });
        it('uses supplied CRL data and the first signer certificate', () => {
            // Arrange
            const harness: SignatureValidationHarness = makeSignatureValidationHarness();
            const signerCertificate: any = { subject: 'signer' };
            const suppliedCrl: Uint8Array = new Uint8Array([8, 9]);
            let validatedData: Uint8Array;
            let validatedCertificate: any;
            (harness.field as any)._cmsSigner = {
                _certificates: [signerCertificate, { subject: 'other' }]
            } as any;
            const originalExtractCrl: () => Uint8Array = (harness.field as any)._extractCrlFromDss;
            const originalValidateCrl: (data: Uint8Array, certificate: any) => boolean =
                (harness.field as any)._validateLtvCrl;
            (harness.field as any)._extractCrlFromDss = (): Uint8Array => undefined;
            (harness.field as any)._validateLtvCrl = (
                data: Uint8Array,
                certificate: any
            ): boolean => {
                validatedData = data;
                validatedCertificate = certificate;
                return true;
            };
            // Act
            const result: any = (harness.field as any)._validateRevocationCore(
                RevocationType.crl,
                undefined,
                suppliedCrl
            );
            (harness.field as any)._extractCrlFromDss = originalExtractCrl;
            (harness.field as any)._validateLtvCrl = originalValidateCrl;
            // Assert
            expect(result.isRevokedCRL).toBeTruthy();
            expect(validatedData).toBe(suppliedCrl);
            expect(validatedCertificate).toBe(signerCertificate);
        });
        it('does not validate CRL when no CRL data exists', () => {
            // Arrange
            const harness: SignatureValidationHarness = makeSignatureValidationHarness();
            let validationCount: number = 0;
            (harness.field as any)._cmsSigner = { _certificates: [{}] } as any;
            const originalExtractCrl: () => Uint8Array = (harness.field as any)._extractCrlFromDss;
            const originalValidateCrl: (data: Uint8Array, certificate: any) => boolean =
                (harness.field as any)._validateLtvCrl;
            (harness.field as any)._extractCrlFromDss = (): Uint8Array => undefined;
            (harness.field as any)._validateLtvCrl = (
                _data: Uint8Array,
                _certificate: any
            ): boolean => {
                validationCount++;
                return true;
            };
            // Act
            const result: any = (harness.field as any)._validateRevocationCore(
                RevocationType.crl,
                undefined,
                new Uint8Array(0)
            );
            (harness.field as any)._extractCrlFromDss = originalExtractCrl;
            (harness.field as any)._validateLtvCrl = originalValidateCrl;
            // Assert
            expect(validationCount).toBe(0);
            expect(result.isRevokedCRL).toBeFalsy();
        });
        it('validates both OCSP and CRL for ocspAndCrl', () => {
            // Arrange
            const harness: SignatureValidationHarness = makeSignatureValidationHarness();
            const ocspData: Uint8Array = new Uint8Array([10]);
            const crlData: Uint8Array = new Uint8Array([11]);
            let ocspCount: number = 0;
            let crlCount: number = 0;
            (harness.field as any)._cmsSigner = { _certificates: [{}] } as any;
            (harness.field as any)._signature = {
                _validateLtvOcsp: (_data: Uint8Array): RevocationStatus => {
                    ocspCount++;
                    return RevocationStatus.good;
                }
            } as any;
            const originalExtractOcsp: () => Uint8Array = (harness.field as any)._extractOcspFromDss;
            const originalExtractCrl: () => Uint8Array = (harness.field as any)._extractCrlFromDss;
            const originalValidateCrl: (data: Uint8Array, certificate: any) => boolean =
                (harness.field as any)._validateLtvCrl;
            (harness.field as any)._extractOcspFromDss = (): Uint8Array => ocspData;
            (harness.field as any)._extractCrlFromDss = (): Uint8Array => crlData;
            (harness.field as any)._validateLtvCrl = (): boolean => {
                crlCount++;
                return true;
            };
            // Act
            const result: any = (harness.field as any)._validateRevocationCore(
                RevocationType.ocspAndCrl
            );
            (harness.field as any)._extractOcspFromDss = originalExtractOcsp;
            (harness.field as any)._extractCrlFromDss = originalExtractCrl;
            (harness.field as any)._validateLtvCrl = originalValidateCrl;
            // Assert
            expect(ocspCount).toBe(1);
            expect(crlCount).toBe(1);
            expect(result.ocspRevocationStatus).toBe(RevocationStatus.good);
            expect(result.isRevokedCRL).toBeTruthy();
        });
    });
    describe('_extractCrlTimes', () => {
        const encodingElementPrototype: any = _PdfUniqueEncodingElement.prototype;
        it('returns null when the TBS certificate list is absent', () => {
            // Arrange
            const harness: SignatureValidationHarness = makeSignatureValidationHarness();
            const originalFromBytes: (bytes: Uint8Array) => number =
                encodingElementPrototype._fromBytes;
            const originalGetComponents: () => any[] =
                encodingElementPrototype._getComponents;
            encodingElementPrototype._fromBytes = (
                _bytes: Uint8Array
            ): number => 0;
            encodingElementPrototype._getComponents = (): any[] => [];
            // Act
            const result: any = (harness.field as any)._extractCrlTimes(new Uint8Array([1]));
            encodingElementPrototype._fromBytes = originalFromBytes;
            encodingElementPrototype._getComponents = originalGetComponents;
            // Assert
            expect(result).toBeNull();
        });
        it('parses generalized time strings and ignores invalid children', () => {
            // Arrange
            const harness: SignatureValidationHarness = makeSignatureValidationHarness();
            const thisUpdateElement: any = makeTimeElement(24, '20260812010203Z');
            const nextUpdateElement: any = makeTimeElement(24, '20260813040506.5Z');
            const invalidElement: any = makeTimeElement(22, '20260814070809Z');
            const tbsCertificateList: any = {
                _getComponents: (): any[] => [undefined, invalidElement, thisUpdateElement, nextUpdateElement]
            };
            const originalFromBytes: (bytes: Uint8Array) => number =
                encodingElementPrototype._fromBytes;
            const originalGetComponents: () => any[] =
                encodingElementPrototype._getComponents;
            encodingElementPrototype._fromBytes = (
                _bytes: Uint8Array
            ): number => 0;
            encodingElementPrototype._getComponents = (): any[] => [tbsCertificateList];
            // Act
            const result: any = (harness.field as any)._extractCrlTimes(new Uint8Array([2]));
            encodingElementPrototype._fromBytes = originalFromBytes;
            encodingElementPrototype._getComponents = originalGetComponents;
            // Assert
            expect(result.thisUpdate.getUTCFullYear()).toBe(2026);
            expect(result.thisUpdate.getUTCMonth()).toBe(7);
            expect(result.thisUpdate.getUTCDate()).toBe(12);
            expect(result.thisUpdate.getUTCHours()).toBe(1);
            expect(result.thisUpdate.getUTCMinutes()).toBe(2);
            expect(result.thisUpdate.getUTCSeconds()).toBe(3);
            expect(result.nextUpdate.getUTCDate()).toBe(13);
            expect(result.nextUpdate.getUTCHours()).toBe(4);
            expect(result.nextUpdate.getUTCMinutes()).toBe(5);
            expect(result.nextUpdate.getUTCSeconds()).toBe(6);
        });
        it('parses generalized time bytes without dropping characters', () => {
            // Arrange
            const harness: SignatureValidationHarness = makeSignatureValidationHarness();
            const bytes: Uint8Array = new Uint8Array([
                50, 48, 50, 54, 48, 56, 49, 50, 48, 49, 48, 50, 48, 51, 90
            ]);
            const timeElement: any = makeTimeElement(24, bytes);
            const tbsCertificateList: any = {
                _getComponents: (): any[] => [timeElement]
            };
            const originalFromBytes: (value: Uint8Array) => number =
                encodingElementPrototype._fromBytes;
            const originalGetComponents: () => any[] =
                encodingElementPrototype._getComponents;
            encodingElementPrototype._fromBytes = (
                _value: Uint8Array
            ): number => 0;
            encodingElementPrototype._getComponents = (): any[] => [tbsCertificateList];
            // Act
            const result: any = (harness.field as any)._extractCrlTimes(new Uint8Array([3]));
            encodingElementPrototype._fromBytes = originalFromBytes;
            encodingElementPrototype._getComponents = originalGetComponents;
            // Assert
            expect(result.thisUpdate.getUTCFullYear()).toBe(2026);
            expect(result.thisUpdate.getUTCMonth()).toBe(7);
            expect(result.thisUpdate.getUTCDate()).toBe(12);
            expect(result.thisUpdate.getUTCHours()).toBe(1);
            expect(result.thisUpdate.getUTCMinutes()).toBe(2);
            expect(result.thisUpdate.getUTCSeconds()).toBe(3);
            expect(result.nextUpdate).toBeUndefined();
        });
        it('parses UTC times on both sides of the fifty year boundary', () => {
            // Arrange
            const firstHarness: SignatureValidationHarness = makeSignatureValidationHarness();
            const secondHarness: SignatureValidationHarness = makeSignatureValidationHarness();
            const yearFortyNine: any = makeTimeElement(23, '491231235959Z');
            const yearFifty: any = makeTimeElement(23, '500101000000Z');
            const firstTbs: any = { _getComponents: (): any[] => [yearFortyNine] };
            const secondTbs: any = { _getComponents: (): any[] => [yearFifty] };
            const originalFromBytes: (bytes: Uint8Array) => number =
                encodingElementPrototype._fromBytes;
            const originalGetComponents: () => any[] =
                encodingElementPrototype._getComponents;
            let componentCallCount: number = 0;
            encodingElementPrototype._fromBytes = (
                _bytes: Uint8Array
            ): number => 0;
            encodingElementPrototype._getComponents = (): any[] => {
                componentCallCount++;
                return componentCallCount === 1 ? [firstTbs] : [secondTbs];
            };
            // Act
            const firstResult: any = (firstHarness.field as any)._extractCrlTimes(new Uint8Array([4]));
            const secondResult: any = (secondHarness.field as any)._extractCrlTimes(new Uint8Array([5]));
            encodingElementPrototype._fromBytes = originalFromBytes;
            encodingElementPrototype._getComponents = originalGetComponents;
            // Assert
            expect(firstResult.thisUpdate.getUTCFullYear()).toBe(2049);
            expect(firstResult.thisUpdate.getUTCMonth()).toBe(11);
            expect(firstResult.thisUpdate.getUTCDate()).toBe(31);
            expect(secondResult.thisUpdate.getUTCFullYear()).toBe(1950);
            expect(secondResult.thisUpdate.getUTCMonth()).toBe(0);
            expect(secondResult.thisUpdate.getUTCDate()).toBe(1);
        });
        it('returns undefined dates for unsupported tags and empty date values', () => {
            // Arrange
            const harness: SignatureValidationHarness = makeSignatureValidationHarness();
            const unsupportedElement: any = makeTimeElement(22, '20260812010203Z');
            const emptyElement: any = makeTimeElement(24, '   ');
            const tbsCertificateList: any = {
                _getComponents: (): any[] => [unsupportedElement, emptyElement]
            };
            const originalFromBytes: (bytes: Uint8Array) => number =
                encodingElementPrototype._fromBytes;
            const originalGetComponents: () => any[] =
                encodingElementPrototype._getComponents;
            encodingElementPrototype._fromBytes = (
                _bytes: Uint8Array
            ): number => 0;
            encodingElementPrototype._getComponents = (): any[] => [tbsCertificateList];
            // Act
            const result: any = (harness.field as any)._extractCrlTimes(new Uint8Array([6]));
            encodingElementPrototype._fromBytes = originalFromBytes;
            encodingElementPrototype._getComponents = originalGetComponents;
            // Assert
            expect(result.thisUpdate).toBeUndefined();
            expect(result.nextUpdate).toBeUndefined();
        });
    });
});
interface SignatureDssHarness {
    document: PdfDocument;
    page: PdfPage;
    field: PdfSignatureField;
    fieldInternal: any;
}
function makeSignatureDssHarness(): SignatureDssHarness {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const field: PdfSignatureField = new PdfSignatureField(
        page,
        'signature1',
        { x: 20, y: 20, width: 120, height: 40 }
    );
    document.form.add(field);
    return { document, page, field, fieldInternal: field as any };
}
function makeByteStream(bytes: Uint8Array): { getBytes: () => Uint8Array } {
    return {
        getBytes: (): Uint8Array => bytes
    };
}
describe('PdfSignatureField helper methods lines 7043 to 7193 mutation coverage', () => {
    describe('_getFirstArrayElement', () => {
        it('returns null for an unavailable collection', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            // Act
            const result: any = harness.fieldInternal._getFirstArrayElement(undefined);
            // Assert
            expect(result).toBeNull();
        });
        it('returns the first value from a get based collection', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            const firstValue: string = 'first';
            let requestedIndex: number = -1;
            const collection: { get: (index: number) => string } = {
                get: (index: number): string => {
                    requestedIndex = index;
                    return firstValue;
                }
            };
            // Act
            const result: string = harness.fieldInternal._getFirstArrayElement(collection);
            // Assert
            expect(result).toBe(firstValue);
            expect(requestedIndex).toBe(0);
        });
        it('returns the first array value and rejects an empty array', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            // Act
            const populatedResult: string = harness.fieldInternal._getFirstArrayElement(['first', 'second']);
            const emptyResult: any = harness.fieldInternal._getFirstArrayElement([]);
            // Assert
            expect(populatedResult).toBe('first');
            expect(emptyResult).toBeNull();
        });
    });
    describe('_getArrayLength', () => {
        it('returns zero for an unavailable collection', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            // Act
            const result: number = harness.fieldInternal._getArrayLength(undefined);
            // Assert
            expect(result).toBe(0);
        });
        it('returns the size method result before the length property', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            let sizeCallCount: number = 0;
            const collection: { size: () => number; length: number } = {
                size: (): number => {
                    sizeCallCount++;
                    return 3;
                },
                length: 7
            };
            // Act
            const result: number = harness.fieldInternal._getArrayLength(collection);
            // Assert
            expect(result).toBe(3);
            expect(sizeCallCount).toBe(1);
        });
        it('returns a numeric length and otherwise returns zero', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            // Act
            const arrayResult: number = harness.fieldInternal._getArrayLength([1, 2]);
            const unsupportedResult: number = harness.fieldInternal._getArrayLength({ value: 1 });
            // Assert
            expect(arrayResult).toBe(2);
            expect(unsupportedResult).toBe(0);
        });
    });
    describe('_extractOcspFromDss', () => {
        it('returns direct OCSP stream bytes from DSS', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            const expectedBytes: Uint8Array = new Uint8Array([1, 2, 3]);
            const dssDictionary: _PdfDictionary = new _PdfDictionary();
            dssDictionary.set('OCSPs', [makeByteStream(expectedBytes)]);
            const originalGetDssDictionary: () => _PdfDictionary = harness.fieldInternal._getDssDictionary;
            const originalGetVriDictionary: () => _PdfDictionary = harness.fieldInternal._getVriDictionary;
            harness.fieldInternal._getDssDictionary = (): _PdfDictionary => dssDictionary;
            harness.fieldInternal._getVriDictionary = (): _PdfDictionary => undefined;
            // Act
            const result: Uint8Array = harness.fieldInternal._extractOcspFromDss();
            harness.fieldInternal._getDssDictionary = originalGetDssDictionary;
            harness.fieldInternal._getVriDictionary = originalGetVriDictionary;
            // Assert
            expect(result).toBe(expectedBytes);
        });
        it('fetches an indirect OCSP stream from DSS', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            const expectedBytes: Uint8Array = new Uint8Array([4, 5]);
            const stream: { getBytes: () => Uint8Array } = makeByteStream(expectedBytes);
            const reference: _PdfReference = _PdfReference.get(10, 0);
            const dssDictionary: _PdfDictionary = new _PdfDictionary();
            dssDictionary.set('OCSPs', [reference]);
            const originalGetDssDictionary: () => _PdfDictionary = harness.fieldInternal._getDssDictionary;
            const originalGetVriDictionary: () => _PdfDictionary = harness.fieldInternal._getVriDictionary;
            const originalFetch: (reference: _PdfReference) => any = harness.field._crossReference._fetch;
            let fetchedObjectNumber: number = 0;
            harness.fieldInternal._getDssDictionary = (): _PdfDictionary => dssDictionary;
            harness.fieldInternal._getVriDictionary = (): _PdfDictionary => undefined;
            harness.field._crossReference._fetch = (value: _PdfReference): any => {
                fetchedObjectNumber = value.objectNumber;
                return stream;
            };
            // Act
            const result: Uint8Array = harness.fieldInternal._extractOcspFromDss();
            harness.fieldInternal._getDssDictionary = originalGetDssDictionary;
            harness.fieldInternal._getVriDictionary = originalGetVriDictionary;
            harness.field._crossReference._fetch = originalFetch;
            // Assert
            expect(result).toBe(expectedBytes);
            expect(fetchedObjectNumber).toBe(10);
        });
        it('returns OCSP bytes from a valid VRI entry and skips invalid entries', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            const expectedBytes: Uint8Array = new Uint8Array([6, 7]);
            const validEntry: _PdfDictionary = new _PdfDictionary();
            validEntry.set('OCSP', [makeByteStream(expectedBytes)]);
            const vriDictionary: any = new _PdfDictionary();
            vriDictionary._map = {
                invalid: 'value',
                missing: new _PdfDictionary(),
                valid: validEntry
            };
            const originalGetDssDictionary: () => _PdfDictionary = harness.fieldInternal._getDssDictionary;
            const originalGetVriDictionary: () => _PdfDictionary = harness.fieldInternal._getVriDictionary;
            harness.fieldInternal._getDssDictionary = (): _PdfDictionary => undefined;
            harness.fieldInternal._getVriDictionary = (): _PdfDictionary => vriDictionary;
            // Act
            const result: Uint8Array = harness.fieldInternal._extractOcspFromDss();
            harness.fieldInternal._getDssDictionary = originalGetDssDictionary;
            harness.fieldInternal._getVriDictionary = originalGetVriDictionary;
            // Assert
            expect(result).toBe(expectedBytes);
        });
        it('returns null when no readable OCSP stream exists', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            const dssDictionary: _PdfDictionary = new _PdfDictionary();
            dssDictionary.set('OCSPs', [{}]);
            const originalGetDssDictionary: () => _PdfDictionary = harness.fieldInternal._getDssDictionary;
            const originalGetVriDictionary: () => _PdfDictionary = harness.fieldInternal._getVriDictionary;
            harness.fieldInternal._getDssDictionary = (): _PdfDictionary => dssDictionary;
            harness.fieldInternal._getVriDictionary = (): _PdfDictionary => undefined;
            // Act
            const result: Uint8Array = harness.fieldInternal._extractOcspFromDss();
            harness.fieldInternal._getDssDictionary = originalGetDssDictionary;
            harness.fieldInternal._getVriDictionary = originalGetVriDictionary;
            // Assert
            expect(result).toBeNull();
        });
    });
    describe('_resolvePdfObject', () => {
        it('returns null for an unavailable object', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            // Act
            const result: any = harness.fieldInternal._resolvePdfObject(undefined);
            // Assert
            expect(result).toBeNull();
        });
        it('fetches an indirect object and preserves a direct object', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            const reference: _PdfReference = _PdfReference.get(11, 0);
            const fetchedObject: _PdfDictionary = new _PdfDictionary();
            const directObject: _PdfDictionary = new _PdfDictionary();
            const originalFetch: (reference: _PdfReference) => any = harness.field._crossReference._fetch;
            let fetchedObjectNumber: number = 0;
            harness.field._crossReference._fetch = (value: _PdfReference): any => {
                fetchedObjectNumber = value.objectNumber;
                return fetchedObject;
            };
            // Act
            const indirectResult: any = harness.fieldInternal._resolvePdfObject(reference);
            const directResult: any = harness.fieldInternal._resolvePdfObject(directObject);
            harness.field._crossReference._fetch = originalFetch;
            // Assert
            expect(indirectResult).toBe(fetchedObject);
            expect(directResult).toBe(directObject);
            expect(fetchedObjectNumber).toBe(11);
        });
    });
    describe('_extractCrlFromDss', () => {
        it('returns direct CRL stream bytes from DSS', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            const expectedBytes: Uint8Array = new Uint8Array([8, 9]);
            const dssDictionary: _PdfDictionary = new _PdfDictionary();
            dssDictionary.set('CRLs', [makeByteStream(expectedBytes)]);
            const originalGetDssDictionary: () => _PdfDictionary = harness.fieldInternal._getDssDictionary;
            const originalGetVriDictionary: () => _PdfDictionary = harness.fieldInternal._getVriDictionary;
            harness.fieldInternal._getDssDictionary = (): _PdfDictionary => dssDictionary;
            harness.fieldInternal._getVriDictionary = (): _PdfDictionary => undefined;
            // Act
            const result: Uint8Array = harness.fieldInternal._extractCrlFromDss();
            harness.fieldInternal._getDssDictionary = originalGetDssDictionary;
            harness.fieldInternal._getVriDictionary = originalGetVriDictionary;
            // Assert
            expect(result).toBe(expectedBytes);
        });
        it('returns CRL bytes from a valid VRI entry and skips invalid entries', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            const expectedBytes: Uint8Array = new Uint8Array([10, 11]);
            const validEntry: _PdfDictionary = new _PdfDictionary();
            validEntry.set('CRL', [makeByteStream(expectedBytes)]);
            const vriDictionary: any = new _PdfDictionary();
            vriDictionary._map = {
                invalid: 'value',
                missing: new _PdfDictionary(),
                valid: validEntry
            };
            const originalGetDssDictionary: () => _PdfDictionary = harness.fieldInternal._getDssDictionary;
            const originalGetVriDictionary: () => _PdfDictionary = harness.fieldInternal._getVriDictionary;
            harness.fieldInternal._getDssDictionary = (): _PdfDictionary => undefined;
            harness.fieldInternal._getVriDictionary = (): _PdfDictionary => vriDictionary;
            // Act
            const result: Uint8Array = harness.fieldInternal._extractCrlFromDss();
            harness.fieldInternal._getDssDictionary = originalGetDssDictionary;
            harness.fieldInternal._getVriDictionary = originalGetVriDictionary;
            // Assert
            expect(result).toBe(expectedBytes);
        });
        it('returns null when no readable CRL stream exists', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            const dssDictionary: _PdfDictionary = new _PdfDictionary();
            dssDictionary.set('CRLs', [{}]);
            const originalGetDssDictionary: () => _PdfDictionary = harness.fieldInternal._getDssDictionary;
            const originalGetVriDictionary: () => _PdfDictionary = harness.fieldInternal._getVriDictionary;
            harness.fieldInternal._getDssDictionary = (): _PdfDictionary => dssDictionary;
            harness.fieldInternal._getVriDictionary = (): _PdfDictionary => undefined;
            // Act
            const result: Uint8Array = harness.fieldInternal._extractCrlFromDss();
            harness.fieldInternal._getDssDictionary = originalGetDssDictionary;
            harness.fieldInternal._getVriDictionary = originalGetVriDictionary;
            // Assert
            expect(result).toBeNull();
        });
    });
    describe('timestamp helpers', () => {
        it('returns true only for the ETSI RFC3161 subfilter', () => {
            // Arrange
            const validHarness: SignatureDssHarness = makeSignatureDssHarness();
            const invalidHarness: SignatureDssHarness = makeSignatureDssHarness();
            const validDictionary: _PdfDictionary = new _PdfDictionary();
            const invalidDictionary: _PdfDictionary = new _PdfDictionary();
            validDictionary.set('SubFilter', _PdfName.get('ETSI.RFC3161'));
            invalidDictionary.set('SubFilter', _PdfName.get('adbe.pkcs7.detached'));
            validHarness.fieldInternal._signature = {
                _signatureDictionary: { _dictionary: validDictionary }
            };
            invalidHarness.fieldInternal._signature = {
                _signatureDictionary: { _dictionary: invalidDictionary }
            };
            // Act
            const validResult: boolean = validHarness.fieldInternal._isDocumentTimestamp();
            const invalidResult: boolean = invalidHarness.fieldInternal._isDocumentTimestamp();
            // Assert
            expect(validResult).toBeTruthy();
            expect(invalidResult).toBeFalsy();
        });
        it('returns a timestamp token only when both timestamp properties exist', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            const tokenBytes: Uint8Array = new Uint8Array([12]);
            // Act
            harness.fieldInternal._cmsSigner = undefined;
            const unavailableResult: Uint8Array = harness.fieldInternal._extractTimestampToken();
            harness.fieldInternal._cmsSigner = {
                _hasTimeStamp: true,
                _timeStampTokenBytes: undefined
            };
            const incompleteResult: Uint8Array = harness.fieldInternal._extractTimestampToken();
            harness.fieldInternal._cmsSigner = {
                _hasTimeStamp: true,
                _timeStampTokenBytes: tokenBytes
            };
            const result: Uint8Array = harness.fieldInternal._extractTimestampToken();
            // Assert
            expect(unavailableResult).toBeNull();
            expect(incompleteResult).toBeNull();
            expect(result).toBe(tokenBytes);
        });
        it('returns genTime and rejects missing timestamp information', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            const generationTime: Date = new Date(Date.UTC(2026, 7, 12));
            // Act
            const result: Date = harness.fieldInternal._extractTimestampTime({
                genTime: generationTime
            });
            // Assert
            expect(result).toBe(generationTime);
            expect((): void => {
                harness.fieldInternal._extractTimestampTime(undefined);
            }).toThrowError('TSTInfo does not contain genTime');
            expect((): void => {
                harness.fieldInternal._extractTimestampTime({});
            }).toThrowError('TSTInfo does not contain genTime');
        });
        it('selects valid timestamp time then signed date then current time', () => {
            // Arrange
            const harness: SignatureDssHarness = makeSignatureDssHarness();
            const timestampDate: Date = new Date(Date.UTC(2026, 7, 12));
            const signedDate: Date = new Date(Date.UTC(2025, 6, 11));
            const invalidTimestampDate: Date = new Date(0);
            const beforeFallback: number = Date.now();
            // Act
            const timestampResult: Date = harness.fieldInternal._determineValidationTime(
                { isValid: true, timestampTime: timestampDate },
                signedDate
            );
            const signedResult: Date = harness.fieldInternal._determineValidationTime(
                { isValid: false, timestampTime: timestampDate },
                signedDate
            );
            const invalidTimeResult: Date = harness.fieldInternal._determineValidationTime(
                { isValid: true, timestampTime: invalidTimestampDate },
                signedDate
            );
            const fallbackResult: Date = harness.fieldInternal._determineValidationTime(
                undefined,
                undefined
            );
            const afterFallback: number = Date.now();
            // Assert
            expect(timestampResult.getTime()).toBe(timestampDate.getTime());
            expect(signedResult.getTime()).toBe(signedDate.getTime());
            expect(invalidTimeResult.getTime()).toBe(signedDate.getTime());
        });
    });
});
import { _PdfRsaPublicKeyParam } from '../src/pdf/core/security/digital-signature/signature/ron-cipher';
interface SignatureLtvHarness {
    document: PdfDocument;
    page: PdfPage;
    field: PdfSignatureField;
    fieldInternal: any;
}
function makeSignatureLtvHarness(): SignatureLtvHarness {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const field: PdfSignatureField = new PdfSignatureField(
        page,
        'signature1',
        { x: 20, y: 20, width: 120, height: 40 }
    );
    document.form.add(field);
    return { document, page, field, fieldInternal: field as any };
}
function makeLtvInformation(): any {
    return {
        isOcspEmbedded: false,
        isCrlEmbedded: false,
        isLtvEmbedded: false
    };
}
describe('PdfSignatureField helper methods lines 7193 to 7322 mutation coverage', () => {
    describe('_detectLtvData', () => {
        it('does not update LTV information when DSS is unavailable', () => {
            // Arrange
            const harness: SignatureLtvHarness = makeSignatureLtvHarness();
            const ltvInformation: any = makeLtvInformation();
            const originalGetDssDictionary: () => _PdfDictionary =
                harness.fieldInternal._getDssDictionary;
            harness.fieldInternal._getDssDictionary = (): _PdfDictionary => undefined;
            // Act
            harness.fieldInternal._detectLtvData(ltvInformation);
            harness.fieldInternal._getDssDictionary = originalGetDssDictionary;
            // Assert
            expect(ltvInformation.isOcspEmbedded).toBeFalsy();
            expect(ltvInformation.isCrlEmbedded).toBeFalsy();
            expect(ltvInformation.isLtvEmbedded).toBeFalsy();
        });
        it('detects non-empty OCSP and CRL arrays in DSS', () => {
            // Arrange
            const harness: SignatureLtvHarness = makeSignatureLtvHarness();
            const ltvInformation: any = makeLtvInformation();
            const dssDictionary: _PdfDictionary = new _PdfDictionary();
            dssDictionary.set('OCSPs', [{}]);
            dssDictionary.set('CRLs', [{}]);
            const originalGetDssDictionary: () => _PdfDictionary =
                harness.fieldInternal._getDssDictionary;
            harness.fieldInternal._getDssDictionary = (): _PdfDictionary => dssDictionary;
            // Act
            harness.fieldInternal._detectLtvData(ltvInformation);
            harness.fieldInternal._getDssDictionary = originalGetDssDictionary;
            // Assert
            expect(ltvInformation.isOcspEmbedded).toBeTruthy();
            expect(ltvInformation.isCrlEmbedded).toBeTruthy();
            expect(ltvInformation.isLtvEmbedded).toBeTruthy();
        });
        it('uses collection size and rejects empty collections', () => {
            // Arrange
            const harness: SignatureLtvHarness = makeSignatureLtvHarness();
            const ltvInformation: any = makeLtvInformation();
            const dssDictionary: _PdfDictionary = new _PdfDictionary();
            const ocspCollection: { size: () => number } = {
                size: (): number => 1
            };
            const crlCollection: { size: () => number } = {
                size: (): number => 0
            };
            dssDictionary.set('OCSPs', ocspCollection);
            dssDictionary.set('CRLs', crlCollection);
            const originalGetDssDictionary: () => _PdfDictionary =
                harness.fieldInternal._getDssDictionary;
            harness.fieldInternal._getDssDictionary = (): _PdfDictionary => dssDictionary;
            // Act
            harness.fieldInternal._detectLtvData(ltvInformation);
            harness.fieldInternal._getDssDictionary = originalGetDssDictionary;
            // Assert
            expect(ltvInformation.isOcspEmbedded).toBeTruthy();
            expect(ltvInformation.isCrlEmbedded).toBeFalsy();
            expect(ltvInformation.isLtvEmbedded).toBeTruthy();
        });
        it('detects OCSP and CRL arrays from valid VRI entries', () => {
            // Arrange
            const harness: SignatureLtvHarness = makeSignatureLtvHarness();
            const ltvInformation: any = makeLtvInformation();
            const dssDictionary: _PdfDictionary = new _PdfDictionary();
            const ocspEntry: _PdfDictionary = new _PdfDictionary();
            const crlEntry: _PdfDictionary = new _PdfDictionary();
            const emptyEntry: _PdfDictionary = new _PdfDictionary();
            const vriDictionary: any = new _PdfDictionary();
            dssDictionary.set('VRI', vriDictionary);
            ocspEntry.set('OCSP', [{}]);
            crlEntry.set('CRL', [{}]);
            emptyEntry.set('OCSP', []);
            vriDictionary._map = {
                invalid: 'value',
                empty: emptyEntry,
                ocsp: ocspEntry,
                crl: crlEntry
            };
            const originalGetDssDictionary: () => _PdfDictionary =
                harness.fieldInternal._getDssDictionary;
            const originalGetVriDictionary: () => _PdfDictionary =
                harness.fieldInternal._getVriDictionary;
            harness.fieldInternal._getDssDictionary = (): _PdfDictionary => dssDictionary;
            harness.fieldInternal._getVriDictionary = (): _PdfDictionary => vriDictionary;
            // Act
            harness.fieldInternal._detectLtvData(ltvInformation);
            harness.fieldInternal._getDssDictionary = originalGetDssDictionary;
            harness.fieldInternal._getVriDictionary = originalGetVriDictionary;
            // Assert
            expect(ltvInformation.isOcspEmbedded).toBeTruthy();
            expect(ltvInformation.isCrlEmbedded).toBeTruthy();
            expect(ltvInformation.isLtvEmbedded).toBeTruthy();
        });
        it('keeps all LTV flags false for empty DSS and VRI data', () => {
            // Arrange
            const harness: SignatureLtvHarness = makeSignatureLtvHarness();
            const ltvInformation: any = makeLtvInformation();
            const dssDictionary: _PdfDictionary = new _PdfDictionary();
            const vriDictionary: any = new _PdfDictionary();
            dssDictionary.set('OCSPs', []);
            dssDictionary.set('CRLs', []);
            dssDictionary.set('VRI', vriDictionary);
            vriDictionary._map = {};
            const originalGetDssDictionary: () => _PdfDictionary =
                harness.fieldInternal._getDssDictionary;
            const originalGetVriDictionary: () => _PdfDictionary =
                harness.fieldInternal._getVriDictionary;
            harness.fieldInternal._getDssDictionary = (): _PdfDictionary => dssDictionary;
            harness.fieldInternal._getVriDictionary = (): _PdfDictionary => vriDictionary;
            // Act
            harness.fieldInternal._detectLtvData(ltvInformation);
            harness.fieldInternal._getDssDictionary = originalGetDssDictionary;
            harness.fieldInternal._getVriDictionary = originalGetVriDictionary;
            // Assert
            expect(ltvInformation.isOcspEmbedded).toBeFalsy();
            expect(ltvInformation.isCrlEmbedded).toBeFalsy();
            expect(ltvInformation.isLtvEmbedded).toBeFalsy();
        });
    });
    describe('_getDssDictionary', () => {
        it('returns null when no cross reference is available', () => {
            // Arrange
            const field: PdfSignatureField = new PdfSignatureField();
            const fieldInternal: any = field as any;
            fieldInternal._crossReference = undefined;
            fieldInternal._page = undefined;
            // Act
            const result: _PdfDictionary = fieldInternal._getDssDictionary();
            // Assert
            expect(result).toBeNull();
        });
        it('uses the page cross reference when the field cross reference is unavailable', () => {
            // Arrange
            const harness: SignatureLtvHarness = makeSignatureLtvHarness();
            const dssDictionary: _PdfDictionary = new _PdfDictionary();
            const catalog: _PdfDictionary = new _PdfDictionary();
            catalog.set('DSS', dssDictionary);
            harness.fieldInternal._crossReference = undefined;
            harness.page._crossReference._root = catalog;
            // Act
            const result: _PdfDictionary = harness.fieldInternal._getDssDictionary();
            // Assert
            expect(result).toBe(dssDictionary);
        });
        it('returns null when catalog or DSS is unavailable', () => {
            // Arrange
            const firstHarness: SignatureLtvHarness = makeSignatureLtvHarness();
            const secondHarness: SignatureLtvHarness = makeSignatureLtvHarness();
            const catalogWithoutDss: _PdfDictionary = new _PdfDictionary();
            firstHarness.field._crossReference._root = undefined;
            secondHarness.field._crossReference._root = catalogWithoutDss;
            // Act
            const missingCatalogResult: _PdfDictionary =
                firstHarness.fieldInternal._getDssDictionary();
            const missingDssResult: _PdfDictionary =
                secondHarness.fieldInternal._getDssDictionary();
            // Assert
            expect(missingCatalogResult).toBeNull();
            expect(missingDssResult).toBeNull();
        });
        it('returns only a direct DSS dictionary', () => {
            // Arrange
            const validHarness: SignatureLtvHarness = makeSignatureLtvHarness();
            const invalidHarness: SignatureLtvHarness = makeSignatureLtvHarness();
            const validCatalog: _PdfDictionary = new _PdfDictionary();
            const invalidCatalog: _PdfDictionary = new _PdfDictionary();
            const dssDictionary: _PdfDictionary = new _PdfDictionary();
            validCatalog.set('DSS', dssDictionary);
            invalidCatalog.set('DSS', 'invalid');
            validHarness.field._crossReference._root = validCatalog;
            invalidHarness.field._crossReference._root = invalidCatalog;
            // Act
            const validResult: _PdfDictionary = validHarness.fieldInternal._getDssDictionary();
            const invalidResult: _PdfDictionary = invalidHarness.fieldInternal._getDssDictionary();
            // Assert
            expect(validResult).toBe(dssDictionary);
            expect(invalidResult).toBeNull();
        });
    });
    describe('_getVriDictionary', () => {
        it('returns null when DSS or VRI is unavailable', () => {
            // Arrange
            const missingDssHarness: SignatureLtvHarness = makeSignatureLtvHarness();
            const missingVriHarness: SignatureLtvHarness = makeSignatureLtvHarness();
            const dssDictionary: _PdfDictionary = new _PdfDictionary();
            const missingDssOriginal: () => _PdfDictionary =
                missingDssHarness.fieldInternal._getDssDictionary;
            const missingVriOriginal: () => _PdfDictionary =
                missingVriHarness.fieldInternal._getDssDictionary;
            missingDssHarness.fieldInternal._getDssDictionary = (): _PdfDictionary => undefined;
            missingVriHarness.fieldInternal._getDssDictionary = (): _PdfDictionary => dssDictionary;
            // Act
            const missingDssResult: _PdfDictionary =
                missingDssHarness.fieldInternal._getVriDictionary();
            const missingVriResult: _PdfDictionary =
                missingVriHarness.fieldInternal._getVriDictionary();
            missingDssHarness.fieldInternal._getDssDictionary = missingDssOriginal;
            missingVriHarness.fieldInternal._getDssDictionary = missingVriOriginal;
            // Assert
            expect(missingDssResult).toBeNull();
            expect(missingVriResult).toBeNull();
        });
        it('returns only a direct VRI dictionary', () => {
            // Arrange
            const validHarness: SignatureLtvHarness = makeSignatureLtvHarness();
            const invalidHarness: SignatureLtvHarness = makeSignatureLtvHarness();
            const validDss: _PdfDictionary = new _PdfDictionary();
            const invalidDss: _PdfDictionary = new _PdfDictionary();
            const vriDictionary: _PdfDictionary = new _PdfDictionary();
            validDss.set('VRI', vriDictionary);
            invalidDss.set('VRI', 'invalid');
            const validOriginal: () => _PdfDictionary = validHarness.fieldInternal._getDssDictionary;
            const invalidOriginal: () => _PdfDictionary = invalidHarness.fieldInternal._getDssDictionary;
            validHarness.fieldInternal._getDssDictionary = (): _PdfDictionary => validDss;
            invalidHarness.fieldInternal._getDssDictionary = (): _PdfDictionary => invalidDss;
            // Act
            const validResult: _PdfDictionary = validHarness.fieldInternal._getVriDictionary();
            const invalidResult: _PdfDictionary = invalidHarness.fieldInternal._getVriDictionary();
            validHarness.fieldInternal._getDssDictionary = validOriginal;
            invalidHarness.fieldInternal._getDssDictionary = invalidOriginal;
            // Assert
            expect(validResult).toBe(vriDictionary);
            expect(invalidResult).toBeNull();
        });
    });
    describe('_validateLtvCrl', () => {
        it('passes CRL bytes and certificate serial number to the CMS signer', () => {
            // Arrange
            const harness: SignatureLtvHarness = makeSignatureLtvHarness();
            const crlBytes: Uint8Array = new Uint8Array([1, 2]);
            const certificate: any = {
                _structure: {
                    _toBeSignedCertificate: {
                        _serialNumber: {
                            toString: (): string => '12345'
                        }
                    }
                }
            };
            let checkedBytes: Uint8Array;
            let checkedSerialNumber: string = '';
            harness.fieldInternal._cmsSigner = {
                _checkCertificateSerialInCrl: (
                    bytes: Uint8Array,
                    serialNumber: string
                ): boolean => {
                    checkedBytes = bytes;
                    checkedSerialNumber = serialNumber;
                    return true;
                }
            };
            // Act
            const result: boolean = harness.fieldInternal._validateLtvCrl(
                crlBytes,
                certificate
            );
            // Assert
            expect(result).toBeTruthy();
            expect(checkedBytes).toBe(crlBytes);
            expect(checkedSerialNumber).toBe('12345');
        });
    });
    describe('_toICipherParam', () => {
        it('returns an existing cipher parameter unchanged', () => {
            // Arrange
            const harness: SignatureLtvHarness = makeSignatureLtvHarness();
            const cipherParameter: any = {
                _getHashCode: (): number => 10,
                _equals: (_value: any): boolean => true
            };
            // Act
            const result: any = harness.fieldInternal._toICipherParam(cipherParameter);
            // Assert
            expect(result).toBe(cipherParameter);
            expect(result._getHashCode()).toBe(10);
            expect(result._equals(cipherParameter)).toBeTruthy();
        });
        it('rejects missing modulus and missing exponent separately', () => {
            // Arrange
            const harness: SignatureLtvHarness = makeSignatureLtvHarness();
            const missingModulus: any = {
                _exponent: new Uint8Array([1]),
                _isPrivate: false
            };
            const missingExponent: any = {
                _modulus: new Uint8Array([2]),
                _isPrivate: false
            };
            // Act / Assert
            expect((): void => {
                harness.fieldInternal._toICipherParam(missingModulus);
            }).toThrowError(
                'Invalid RSA public key parameter: missing modulus/exponent.'
            );
            expect((): void => {
                harness.fieldInternal._toICipherParam(missingExponent);
            }).toThrowError(
                'Invalid RSA public key parameter: missing modulus/exponent.'
            );
        });
        it('creates a public RSA cipher parameter with verification enabled', () => {
            // Arrange
            const harness: SignatureLtvHarness = makeSignatureLtvHarness();
            const modulus: Uint8Array = new Uint8Array([3, 4]);
            const exponent: Uint8Array = new Uint8Array([1, 0, 1]);
            const publicKey: any = {
                _modulus: modulus,
                _exponent: exponent,
                _isPrivate: false
            };
            // Act
            const result: _PdfRsaPublicKeyParam =
                harness.fieldInternal._toICipherParam(publicKey);
            // Assert
            expect(result instanceof _PdfRsaPublicKeyParam).toBeTruthy();
            expect((result as any)._isPrivate).toBeFalsy();
            expect((result as any)._enableCertificationVerification).toBeTruthy();
        });
        it('preserves the private RSA cipher parameter state', () => {
            // Arrange
            const harness: SignatureLtvHarness = makeSignatureLtvHarness();
            const privateKey: any = {
                _modulus: new Uint8Array([5, 6]),
                _exponent: new Uint8Array([1, 0, 1]),
                _isPrivate: true
            };
            // Act
            const result: _PdfRsaPublicKeyParam =
                harness.fieldInternal._toICipherParam(privateKey);
            // Assert
            expect(result instanceof _PdfRsaPublicKeyParam).toBeTruthy();
            expect((result as any)._enableCertificationVerification).not.toBeTruthy();
        });
    });
});
