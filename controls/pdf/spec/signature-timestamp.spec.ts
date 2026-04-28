
import { CryptographicStandard, DigestAlgorithm, PdfCertificationFlags } from '../src/pdf/core/enumerator';
import { PdfSignatureField } from '../src/pdf/core/form/field';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { _PdfDictionary } from '../src/pdf/core/pdf-primitives';
import { PdfSignature } from '../src/pdf/core/security/digital-signature/signature/pdf-signature';
import { PdfSignatureOptions } from '../src/pdf/core/security/digital-signature/signature/signature-properties';
import { _decode } from '../src/pdf/core/utils';
import { certchain_1, entrustcert, externalTimestamp, pdf, WF_55836 } from './certificate-input.spec';
import { annotations } from './inputs.spec';
import { timestamp_1, timestamp_2, timestamp_3, timestamp_4, timestamp_5 } from './timestamp-input.spec';
describe('987473 - timestamp', () => {
    async function externalSignatureCallback1(
        data: Uint8Array,
        options: {
            algorithm: DigestAlgorithm,
            cryptographicStandard: CryptographicStandard
        }
    ): Promise<{ signedData: Uint8Array; timestampData?: Uint8Array; }> {
        const signedData = _decode(externalTimestamp) as Uint8Array;
        let timestampData: Uint8Array | undefined = _decode(timestamp_1) as Uint8Array;
        return { signedData, timestampData };
    }
    async function timestampCallback1(request: Uint8Array): Promise<{ data: Uint8Array}> {
        // http://timestamp.digicert.com'
        const data = _decode(timestamp_1) as Uint8Array;
        return {data}
    }
    async function timestampCallback2(request: Uint8Array): Promise<{ data: Uint8Array }> {
        // 'http://time.certum.pl'
         const data = _decode(timestamp_2) as Uint8Array;
        return {data}
    }
    async function timestampCallback3(request: Uint8Array): Promise<{ data: Uint8Array }> {
        // 'http://timestamp.entrust.net/TSS/RFC3161sha2TS'
        const data = _decode(timestamp_3) as Uint8Array;
        return {data}
    }
    async function timestampCallback4(request: Uint8Array): Promise<{ data: Uint8Array }> {
        // '// http://zeitstempel.dfn.de/'
         const data = _decode(timestamp_4) as Uint8Array;
        return {data}
    }
    async function timestampCallback5(request: Uint8Array): Promise<{ data: Uint8Array }> {
        // 'https://freetsa.org/tsr'
         const data = _decode(timestamp_5) as Uint8Array;
        return {data}
    }
    it('987473 - 1', async () => {
        const certificateData = certchain_1;
        const password = 'moorthy';
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', { x: 50, y: 50, width: 150, height: 50 });
        let signature: PdfSignature = PdfSignature.create(
            certificateData, password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256,
            contactInfo: 'johndoe@owned.us',
            locationInfo: 'Honolulu Hawaii',
            reason: 'I am author of this document.',
            certify: false
        }, timestampCallback1, 
        );
        document.form.add(field);
        field.setSignature(signature);
        expect(signature._contactInfo).toEqual('johndoe@owned.us');
        expect(signature._locationInfo).toEqual('Honolulu Hawaii');
        expect(signature._reason).toEqual('I am author of this document.');
        const data = await document.saveAsync();
        const loaded = new PdfDocument(data as Uint8Array);
        const loadedField = loaded.form.fieldAt(0) as PdfSignatureField;
        let sign: PdfSignature = loadedField.getSignature();
        expect(sign._timeStampTokenBytes.length).toBeGreaterThan(0);
        let options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('johndoe@owned.us');
        expect(options.locationInfo).toEqual('Honolulu Hawaii');
        expect(options.reason).toEqual('I am author of this document.');
        expect(loaded.form.count).toEqual(1);
        expect(loadedField).toBeDefined();
        expect(loadedField._dictionary.get('V')).toBeTruthy();
        let fieldDictionary: _PdfDictionary = loadedField._dictionary.get('V');
        expect(fieldDictionary).toBeDefined();
        expect(fieldDictionary.get('ContactInfo')).toEqual('johndoe@owned.us');
        expect(fieldDictionary.get('Reason')).toEqual('I am author of this document.');
        expect(fieldDictionary.get('Location')).toEqual('Honolulu Hawaii');
        loaded.destroy();
        document.destroy();
    });
    it('987473 - 2', async () => {
        let doc: PdfDocument = new PdfDocument();
        const page = doc.addPage();
        const field: PdfSignatureField = new PdfSignatureField(page, 'Signaturelock', { x: 0, y: 0, width: 100, height: 30 });
        doc.form.add(field);
        const data = doc.save();
        doc.destroy();
        doc = new PdfDocument(data);
        const certificateData = pdf;
        const password = 'syncfusion';
        let sign: PdfSignature = PdfSignature.create(
            certificateData,
            password, {
            cryptographicStandard: CryptographicStandard.cades,
            digestAlgorithm: DigestAlgorithm.sha256,
            contactInfo: 'user@domain.com',
            locationInfo: 'Somewhere',
            reason: 'Approval',
        }, timestampCallback2);
        const loadedField = doc.form.fieldAt(0) as PdfSignatureField;
        loadedField.setSignature(sign);
        const out = await doc.saveAsync();
        const verifyDoc = new PdfDocument(out as Uint8Array);
        const verifyField = verifyDoc.form.fieldAt(0) as PdfSignatureField;
        expect(verifyField).toBeDefined();
        expect(verifyField._dictionary.get('V')).toBeTruthy();
        sign = verifyField.getSignature();
        expect(sign._timeStampTokenBytes.length).toBeGreaterThan(0);
        let options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('user@domain.com');
        expect(options.locationInfo).toEqual('Somewhere');
        expect(options.reason).toEqual('Approval');
        expect(verifyDoc.form.count).toEqual(1);
        expect(verifyField).toBeDefined();
        expect(verifyField._dictionary.get('V')).toBeTruthy();
        let fieldDictionary: _PdfDictionary = verifyField._dictionary.get('V');
        expect(fieldDictionary).toBeDefined();
        expect(fieldDictionary.get('ContactInfo')).toEqual('user@domain.com');
        expect(fieldDictionary.get('Reason')).toEqual('Approval');
        expect(fieldDictionary.get('Location')).toEqual('Somewhere');
        verifyDoc.destroy();
        doc.destroy();
    });
    it('987473 - 3', async () => {
        const certificateData = WF_55836;
        const password = 'syncfusion';
        const doc: PdfDocument = new PdfDocument();
        const page = doc.addPage();
        const field: PdfSignatureField = new PdfSignatureField(page, 'sigperm', { x: 10, y: 10, width: 120, height: 40 });
        let sign: PdfSignature = PdfSignature.create(
            certificateData,
            password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256,
            contactInfo: 'contact@domain',
            locationInfo: 'HQ',
            reason: 'Permissioned',
            documentPermissions: PdfCertificationFlags.forbidChanges
        }, timestampCallback2
        );
        doc.form.add(field);
        field.setSignature(sign);
        const out = await doc.saveAsync();
        const verifyDoc = new PdfDocument(out as Uint8Array);
        const verifyField = verifyDoc.form.fieldAt(0) as PdfSignatureField;
        expect((sign as any)._documentPermissions).toEqual(1);
        expect(verifyField).toBeDefined();
        expect(verifyField._dictionary.get('V')).toBeTruthy();
        sign = verifyField.getSignature(); 
        expect(sign._timeStampTokenBytes.length).toBeGreaterThan(0);
        let options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('contact@domain');
        expect(options.locationInfo).toEqual('HQ');
        expect(options.reason).toEqual('Permissioned');
        expect(options.documentPermissions).toEqual(PdfCertificationFlags.forbidChanges);
        expect(verifyDoc.form.count).toEqual(1);
        expect(verifyField).toBeDefined();
        expect(verifyField._dictionary.get('V')).toBeTruthy();
        let fieldDictionary: _PdfDictionary = verifyField._dictionary.get('V');
        expect(fieldDictionary).toBeDefined();
        expect(fieldDictionary.get('ContactInfo')).toEqual('contact@domain');
        expect(fieldDictionary.get('Reason')).toEqual('Permissioned');
        expect(fieldDictionary.get('Location')).toEqual('HQ');
        verifyDoc.destroy();
        doc.destroy();
    });
    it('987473 - 4', async () => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'sig1', { x: 50, y: 50, width: 150, height: 50 });
        let signature: PdfSignature = PdfSignature.create(
            null as any, null as any, {
            cryptographicStandard: CryptographicStandard.cades,
            digestAlgorithm: DigestAlgorithm.sha256,
            contactInfo: 'johndoe@owned.us',
            locationInfo: 'Honolulu Hawaii',
            reason: 'I am author of this document.',
            certify: false
        }, timestampCallback3
        );
        document.form.add(field);
        field.setSignature(signature);
        const data = await document.saveAsync();
        document = new PdfDocument(data as Uint8Array);
        field = document.form.fieldAt(0) as PdfSignatureField;
        signature = field.getSignature();
        expect(signature._isTimestampOnly).toBeTruthy();
        expect(signature._hasTimeStamp).toEqual(true);
        expect(signature._timeStampTokenBytes.length).toBeGreaterThan(0);
        let fieldDictionary: _PdfDictionary = field._dictionary.get('V');
        expect(fieldDictionary).toBeDefined();
        expect(fieldDictionary.get('Type').name).toEqual('DocTimeStamp');
        expect(fieldDictionary.get('SubFilter').name).toEqual('ETSI.RFC3161')
        expect(fieldDictionary.get('ContactInfo')).toEqual('johndoe@owned.us');
        expect(fieldDictionary.get('Reason')).toEqual('I am author of this document.');
        expect(fieldDictionary.get('Location')).toEqual('Honolulu Hawaii');
        document.destroy();
    });
    it('987473 - 5', async () => {
        const certificateData = entrustcert;
        const password = 'EthosTest';
        const doc: PdfDocument = new PdfDocument();
        const page = doc.addPage();
        const field: PdfSignatureField = new PdfSignatureField(page, 'sig_default_ts', { x: 40, y: 40, width: 120, height: 40 });
        let sign: PdfSignature = PdfSignature.create(
            certificateData,
            password, { cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha256 }, timestampCallback4);
        doc.form.add(field);
        field.setSignature(sign);
        const out = await doc.saveAsync();
        const verifyDoc = new PdfDocument(out as Uint8Array);
        const verifyField = verifyDoc.form.fieldAt(0) as PdfSignatureField;
        expect(verifyField._dictionary.get('V')).toBeTruthy();
        sign = verifyField.getSignature();
        expect(sign._timeStampTokenBytes.length).toBeGreaterThan(0);
        let options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.cryptographicStandard).toEqual(CryptographicStandard.cms);
        expect(options.digestAlgorithm).toEqual(DigestAlgorithm.sha256);
        let fieldDictionary: _PdfDictionary = verifyField._dictionary.get('V');
        expect(fieldDictionary).toBeDefined();
        expect(fieldDictionary.get('ContactInfo')).toBeUndefined();
        expect(fieldDictionary.get('Reason')).toBeUndefined;
        expect(fieldDictionary.get('Location')).toBeUndefined();
    });
    it('987473 - 6', async () => {
        let document: PdfDocument = new PdfDocument(annotations);
        let page: PdfPage = document.getPage(0);
        let field: PdfSignatureField = new PdfSignatureField(page, 'ext_sig_cms', { x: 50, y: 50, width: 100, height: 100 });
        let sign: PdfSignature = PdfSignature.create(
            null as any, null as any, {
            contactInfo: 'johndoe@owned.us',
            locationInfo: 'Honolulu, Hawaii',
            reason: 'I am author of this document.',
            signedName: 'Signature',
            digestAlgorithm: DigestAlgorithm.sha256,
            cryptographicStandard: CryptographicStandard.cms
        }, timestampCallback1);
        document.form.add(field);
        field.setSignature(sign);
        const data = await document.saveAsync();
        document = new PdfDocument(data as Uint8Array);
        page = document.getPage(0);
        expect(document.form.count).toEqual(1);
        field = document.form.fieldAt(0) as PdfSignatureField;
        sign = field.getSignature();
        expect(sign._isTimestampOnly).toBeTruthy();
        expect(sign._timeStampTokenBytes.length).toBeGreaterThan(0);
        let option: PdfSignatureOptions = sign.getSignatureOptions();
        expect(option.contactInfo).toEqual('johndoe@owned.us');
        expect(option.locationInfo).toEqual('Honolulu, Hawaii');
        expect(option.reason).toEqual('I am author of this document.');
        const verifyField = document.form.fieldAt(0) as PdfSignatureField;
        expect(verifyField).toBeDefined();
        expect(verifyField._dictionary.get('V')).toBeTruthy();
        let fieldDictionary = verifyField._dictionary.get('V');
        expect(fieldDictionary).toBeDefined();
        expect(fieldDictionary.get('Type').name).toEqual('DocTimeStamp');
        expect(fieldDictionary.get('SubFilter').name).toEqual('ETSI.RFC3161')
        expect(fieldDictionary.get('ContactInfo')).toEqual('johndoe@owned.us');
        expect(fieldDictionary.get('Reason')).toEqual('I am author of this document.');
        expect(fieldDictionary.get('Location')).toEqual('Honolulu, Hawaii');
        document.destroy();
    });
    it('987473 - 7', async () => {
        const certificateData = certchain_1;
        const password = 'moorthy';
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', { x: 50, y: 50, width: 150, height: 50 });
        let signature: PdfSignature = PdfSignature.create(
            certificateData, password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha1,
            contactInfo: 'johndoe@owned.us',
            locationInfo: 'Honolulu Hawaii',
            reason: 'I am author of this document.',
            certify: false
        }, timestampCallback4);
        document.form.add(field);
        field.setSignature(signature);
        expect(signature._contactInfo).toEqual('johndoe@owned.us');
        expect(signature._locationInfo).toEqual('Honolulu Hawaii');
        expect(signature._reason).toEqual('I am author of this document.');
        const data = await document.saveAsync();
        const loaded = new PdfDocument(data as Uint8Array);
        const loadedField = loaded.form.fieldAt(0) as PdfSignatureField;
        let sign: PdfSignature = loadedField.getSignature();
        expect(sign._timeStampTokenBytes.length).toBeGreaterThan(0);
        let options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('johndoe@owned.us');
        expect(options.locationInfo).toEqual('Honolulu Hawaii');
        expect(options.reason).toEqual('I am author of this document.');
        expect(loaded.form.count).toEqual(1);
        expect(loadedField).toBeDefined();
        expect(loadedField._dictionary.get('V')).toBeTruthy();
        let fieldDictionary: _PdfDictionary = loadedField._dictionary.get('V');
        expect(fieldDictionary).toBeDefined();
        expect(fieldDictionary.get('ContactInfo')).toEqual('johndoe@owned.us');
        expect(fieldDictionary.get('Reason')).toEqual('I am author of this document.');
        expect(fieldDictionary.get('Location')).toEqual('Honolulu Hawaii');
        loaded.destroy();
        document.destroy();
    });
    it('987473 - 8', async () => {
        const certificateData = certchain_1;
        const password = 'moorthy';
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', { x: 50, y: 50, width: 150, height: 50 });
        let signature: PdfSignature = PdfSignature.create(
            certificateData, password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha1,
            contactInfo: 'johndoe@owned.us',
            locationInfo: 'Honolulu Hawaii',
            reason: 'I am author of this document.',
            certify: false
        }, timestampCallback5);
        document.form.add(field);
        field.setSignature(signature);
        expect(signature._contactInfo).toEqual('johndoe@owned.us');
        expect(signature._locationInfo).toEqual('Honolulu Hawaii');
        expect(signature._reason).toEqual('I am author of this document.');
        const data = await document.saveAsync();
        const loaded = new PdfDocument(data as Uint8Array);
        const loadedField = loaded.form.fieldAt(0) as PdfSignatureField;
        let sign: PdfSignature = loadedField.getSignature();
        expect(sign._timeStampTokenBytes.length).toBeGreaterThan(0);
        let options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('johndoe@owned.us');
        expect(options.locationInfo).toEqual('Honolulu Hawaii');
        expect(options.reason).toEqual('I am author of this document.');
        expect(loaded.form.count).toEqual(1);
        expect(loadedField).toBeDefined();
        expect(loadedField._dictionary.get('V')).toBeTruthy();
        let fieldDictionary: _PdfDictionary = loadedField._dictionary.get('V');
        expect(fieldDictionary).toBeDefined();
        expect(fieldDictionary.get('ContactInfo')).toEqual('johndoe@owned.us');
        expect(fieldDictionary.get('Reason')).toEqual('I am author of this document.');
        expect(fieldDictionary.get('Location')).toEqual('Honolulu Hawaii');
        loaded.destroy();
        document.destroy();
    });
    it('987473 - 9', async () => {
        const certificateData = certchain_1;
        const password = 'moorthy';
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', { x: 50, y: 50, width: 150, height: 50 });
        let signature: PdfSignature = PdfSignature.create(
            certificateData, password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha384,
            contactInfo: 'johndoe@owned.us',
            locationInfo: 'Honolulu Hawaii',
            reason: 'I am author of this document.',
            certify: false
        }, timestampCallback1 );
        document.form.add(field);
        field.setSignature(signature);
        expect(signature._contactInfo).toEqual('johndoe@owned.us');
        expect(signature._locationInfo).toEqual('Honolulu Hawaii');
        expect(signature._reason).toEqual('I am author of this document.');
        const data = await document.saveAsync();
        const loaded = new PdfDocument(data as Uint8Array);
        const loadedField = loaded.form.fieldAt(0) as PdfSignatureField;
        let sign: PdfSignature = loadedField.getSignature();
        expect(sign._timeStampTokenBytes.length).toBeGreaterThan(0);
        let options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('johndoe@owned.us');
        expect(options.locationInfo).toEqual('Honolulu Hawaii');
        expect(options.reason).toEqual('I am author of this document.');
        expect(loaded.form.count).toEqual(1);
        expect(loadedField).toBeDefined();
        expect(loadedField._dictionary.get('V')).toBeTruthy();
        let fieldDictionary: _PdfDictionary = loadedField._dictionary.get('V');
        expect(fieldDictionary).toBeDefined();
        expect(fieldDictionary.get('ContactInfo')).toEqual('johndoe@owned.us');
        expect(fieldDictionary.get('Reason')).toEqual('I am author of this document.');
        expect(fieldDictionary.get('Location')).toEqual('Honolulu Hawaii');
        loaded.destroy();
        document.destroy();
    });
    it('987473 - 10', async () => {
        const certificateData = certchain_1;
        const password = 'moorthy';
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', { x: 50, y: 50, width: 150, height: 50 });
        let signature: PdfSignature = PdfSignature.create(
            certificateData, password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha512,
            contactInfo: 'johndoe@owned.us',
            locationInfo: 'Honolulu Hawaii',
            reason: 'I am author of this document.',
            certify: false
        }, timestampCallback1);
        document.form.add(field);
        field.setSignature(signature);
        expect(signature._contactInfo).toEqual('johndoe@owned.us');
        expect(signature._locationInfo).toEqual('Honolulu Hawaii');
        expect(signature._reason).toEqual('I am author of this document.');
        const data = await document.saveAsync();
        const loaded = new PdfDocument(data as Uint8Array);
        const loadedField = loaded.form.fieldAt(0) as PdfSignatureField;
        let sign: PdfSignature = loadedField.getSignature();
        expect(sign._timeStampTokenBytes.length).toBeGreaterThan(0);
        let options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('johndoe@owned.us');
        expect(options.locationInfo).toEqual('Honolulu Hawaii');
        expect(options.reason).toEqual('I am author of this document.');
        expect(loaded.form.count).toEqual(1);
        expect(loadedField).toBeDefined();
        expect(loadedField._dictionary.get('V')).toBeTruthy();
        let fieldDictionary: _PdfDictionary = loadedField._dictionary.get('V');
        expect(fieldDictionary).toBeDefined();
        expect(fieldDictionary.get('ContactInfo')).toEqual('johndoe@owned.us');
        expect(fieldDictionary.get('Reason')).toEqual('I am author of this document.');
        expect(fieldDictionary.get('Location')).toEqual('Honolulu Hawaii');
        loaded.destroy();
        document.destroy();
    });
    it('987473 - 11', async () => {
        const certificateData = certchain_1;
        const password = 'moorthy';
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', { x: 50, y: 50, width: 150, height: 50 });
        let signature: PdfSignature = PdfSignature.create(
            certificateData, password, {
            cryptographicStandard: CryptographicStandard.cades,
            digestAlgorithm: DigestAlgorithm.sha384,
            contactInfo: 'johndoe@owned.us',
            locationInfo: 'Honolulu Hawaii',
            reason: 'I am author of this document.',
            certify: false
        }, timestampCallback1
        );
        document.form.add(field);
        field.setSignature(signature);
        expect(signature._contactInfo).toEqual('johndoe@owned.us');
        expect(signature._locationInfo).toEqual('Honolulu Hawaii');
        expect(signature._reason).toEqual('I am author of this document.');
        const data = await document.saveAsync();
        const loaded = new PdfDocument(data as Uint8Array);
        const loadedField = loaded.form.fieldAt(0) as PdfSignatureField;
        let sign: PdfSignature = loadedField.getSignature();
        expect(sign._timeStampTokenBytes.length).toBeGreaterThan(0);
        let options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('johndoe@owned.us');
        expect(options.locationInfo).toEqual('Honolulu Hawaii');
        expect(options.reason).toEqual('I am author of this document.');
        expect(loaded.form.count).toEqual(1);
        expect(loadedField).toBeDefined();
        expect(loadedField._dictionary.get('V')).toBeTruthy();
        let fieldDictionary: _PdfDictionary = loadedField._dictionary.get('V');
        expect(fieldDictionary).toBeDefined();
        expect(fieldDictionary.get('ContactInfo')).toEqual('johndoe@owned.us');
        expect(fieldDictionary.get('Reason')).toEqual('I am author of this document.');
        expect(fieldDictionary.get('Location')).toEqual('Honolulu Hawaii');
        loaded.destroy();
        document.destroy();
    });
    it('987473 - 12', async () => {
        const certificateData = certchain_1;
        const password = 'moorthy';
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', { x: 50, y: 50, width: 150, height: 50 });
        let signature: PdfSignature = PdfSignature.create(
            certificateData, password, {
            cryptographicStandard: CryptographicStandard.cades,
            digestAlgorithm: DigestAlgorithm.sha512,
            contactInfo: 'johndoe@owned.us',
            locationInfo: 'Honolulu Hawaii',
            reason: 'I am author of this document.',
            certify: false
        }, timestampCallback1 );
        document.form.add(field);
        field.setSignature(signature);
        expect(signature._contactInfo).toEqual('johndoe@owned.us');
        expect(signature._locationInfo).toEqual('Honolulu Hawaii');
        expect(signature._reason).toEqual('I am author of this document.');
        const data = await document.saveAsync();
        const loaded = new PdfDocument(data as Uint8Array);
        const loadedField = loaded.form.fieldAt(0) as PdfSignatureField;
        let sign: PdfSignature = loadedField.getSignature();
        expect(sign._timeStampTokenBytes.length).toBeGreaterThan(0);
        let options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('johndoe@owned.us');
        expect(options.locationInfo).toEqual('Honolulu Hawaii');
        expect(options.reason).toEqual('I am author of this document.');
        expect(loaded.form.count).toEqual(1);
        expect(loadedField).toBeDefined();
        expect(loadedField._dictionary.get('V')).toBeTruthy();
        let fieldDictionary: _PdfDictionary = loadedField._dictionary.get('V');
        expect(fieldDictionary).toBeDefined();
        expect(fieldDictionary.get('ContactInfo')).toEqual('johndoe@owned.us');
        expect(fieldDictionary.get('Reason')).toEqual('I am author of this document.');
        expect(fieldDictionary.get('Location')).toEqual('Honolulu Hawaii');
        loaded.destroy();
        document.destroy();
    });
    it('987473 - 13', async () => {
        const certificateData = certchain_1;
        const password = 'moorthy';
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', { x: 50, y: 50, width: 150, height: 50 });
        let signature: PdfSignature = PdfSignature.create(
            certificateData, password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.ripemd160,
            contactInfo: 'johndoe@owned.us',
            locationInfo: 'Honolulu Hawaii',
            reason: 'I am author of this document.',
            certify: false
        }, timestampCallback1);
        document.form.add(field);
        field.setSignature(signature);
        expect(signature._contactInfo).toEqual('johndoe@owned.us');
        expect(signature._locationInfo).toEqual('Honolulu Hawaii');
        expect(signature._reason).toEqual('I am author of this document.');
        const data = await document.saveAsync();
        const loaded = new PdfDocument(data as Uint8Array);
        const loadedField = loaded.form.fieldAt(0) as PdfSignatureField;
        let sign: PdfSignature = loadedField.getSignature();
        expect(sign._timeStampTokenBytes.length).toBeGreaterThan(0);
        let options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('johndoe@owned.us');
        expect(options.locationInfo).toEqual('Honolulu Hawaii');
        expect(options.reason).toEqual('I am author of this document.');
        expect(loaded.form.count).toEqual(1);
        expect(loadedField).toBeDefined();
        expect(loadedField._dictionary.get('V')).toBeTruthy();
        let fieldDictionary: _PdfDictionary = loadedField._dictionary.get('V');
        expect(fieldDictionary).toBeDefined();
        expect(fieldDictionary.get('ContactInfo')).toEqual('johndoe@owned.us');
        expect(fieldDictionary.get('Reason')).toEqual('I am author of this document.');
        expect(fieldDictionary.get('Location')).toEqual('Honolulu Hawaii');
        loaded.destroy();
        document.destroy();
    });
    it('987473 - 14', async () => {
        const certificateData = certchain_1;
        const password = 'moorthy';
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', { x: 50, y: 50, width: 150, height: 50 });
        let signature: PdfSignature = PdfSignature.create(
            certificateData, password, {
            cryptographicStandard: CryptographicStandard.cades,
            digestAlgorithm: DigestAlgorithm.ripemd160,
            contactInfo: 'johndoe@owned.us',
            locationInfo: 'Honolulu Hawaii',
            reason: 'I am author of this document.',
            certify: false
        }, timestampCallback2);
        document.form.add(field);
        field.setSignature(signature);
        expect(signature._contactInfo).toEqual('johndoe@owned.us');
        expect(signature._locationInfo).toEqual('Honolulu Hawaii');
        expect(signature._reason).toEqual('I am author of this document.');
        const data = await document.saveAsync();
        const loaded = new PdfDocument(data as Uint8Array);
        const loadedField = loaded.form.fieldAt(0) as PdfSignatureField;
        let sign: PdfSignature = loadedField.getSignature();
        expect(sign._timeStampTokenBytes.length).toBeGreaterThan(0);
        let options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('johndoe@owned.us');
        expect(options.locationInfo).toEqual('Honolulu Hawaii');
        expect(options.reason).toEqual('I am author of this document.');
        expect(loaded.form.count).toEqual(1);
        expect(loadedField).toBeDefined();
        expect(loadedField._dictionary.get('V')).toBeTruthy();
        let fieldDictionary: _PdfDictionary = loadedField._dictionary.get('V');
        expect(fieldDictionary).toBeDefined();
        expect(fieldDictionary.get('ContactInfo')).toEqual('johndoe@owned.us');
        expect(fieldDictionary.get('Reason')).toEqual('I am author of this document.');
        expect(fieldDictionary.get('Location')).toEqual('Honolulu Hawaii');
        loaded.destroy();
        document.destroy();
    });
    it('987473 - 15', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const publicCert1: string = 'MIIE2DCCA8CgAwIBAgIDAII0MA0GCSqGSIb3DQEBCwUAMIGOMQswCQYDVQQGEwJJTjETMBEGA1UECAwKVGFtaWwgTmFkdTEQMA4GA1UEBwwHQ2hlbm5haTETMBEGA1UECgwKU3luY2Z1c2lvbjErMCkGA1UECwwiU2VjdXJlIERpZ2l0YWwgQ2VydGlmaWNhdGUgU2lnbmluZzEWMBQGA1UEAwwNU3luY2Z1c2lvbiBDQTAeFw0yNTA1MjgxODA1NTJaFw0yNjA1MjgxODA1NTJaMHYxCzAJBgNVBAYTAklOMRMwEQYDVQQIDApUYW1pbCBOYWR1MRAwDgYDVQQHDAdDaGVubmFpMRMwEQYDVQQKDApTeW5jZnVzaW9uMRMwEQYDVQQLDApTeW5jZnVzaW9uMRYwFAYDVQQDDA1TeW5jZnVzaW9uIENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2Mzdut5mpZnHaLrFZ7q94miFXnO+RNzpeR1TYNwAx2y3vfC1ya03D245bocGwYfsZSA+aQYVOtQ9CjAseR3EysR07z0u63ehEgfB98CGMYJAWNtc0Vv4mu6tQXwGNZ3mhFSWLDK/Tdryc/9g63l+vJlhwUA7NIvgiFMS75euF7IC61jjH7PvodI4Xna8SayAWkNPPFzssvR2jNRGqju/AnIpGkdSjC+ydim3+7UvmrDxr9Z3608UEt0hrCu59yO5FPgCJyZ3HzCFn0xC6nUbFos/oi4ez+862PFiwdwptuduonMrp1u0j2YxHlcxOB9s5S00l7/1XnL4ZVd2jQI6zwIDAQABo4IBVDCCAVAwCQYDVR0TBAIwADAdBgNVHQ4EFgQUY68qc4Wl2+F73eEkII7EXMY9E3AwHwYDVR0jBBgwFoAUqan2kQMYVhakxotNcj8GN6CxcKwwEQYJYIZIAYb4QgEBBAQDAgTwMAsGA1UdDwQEAwID+DA7BgNVHSUENDAyBggrBgEFBQcDAQYIKwYBBQUHAwIGCCsGAQUFBwMDBggrBgEFBQcDBAYIKwYBBQUHAwgwbwYIKwYBBQUHAQEEYzBhMC0GCCsGAQUFBzABhiFodHRwOi8vb2NzcC50aW55Y2VydC5vcmcvY2EtMTI3NTQwMAYIKwYBBQUHMAKGJGh0dHA6Ly9haWEudGlueWNlcnQub3JnL2NhLTEyNzU0LmNydDA1BgNVHR8ELjAsMCqgKKAmhiRodHRwOi8vY3JsLnRpbnljZXJ0Lm9yZy9jYS0xMjc1NC5jcmwwDQYJKoZIhvcNAQELBQADggEBABK40tOsyEaUMBw5pyqF5GtkIOQpTlFpKeu+S4A9WPAOzYjv5RbFtxE9Bx+lMr0RSP6f4EYx9mctSgYxTP297p+egSNoN2SFs7WaYyFE/zMBSMi6Jv9miOD1f18cR1g1skFF/tv5IAwb4YPowYL0hrGVwlFGl3VpgRWkYuWEsY16FGW+gYkcMefiTcOTEiANMs3Y4F4yV/PFt729D3jXlMzvm6A94J+q6DFhVq9p6vH58yK6gY/n/J1N3tHLPBiKkk0H0OKc2BaXQpiqajgarKrLqKr30SXA5TnR5AzI74RE/iiNDXubfYFMlFBYI3eoKgRXgYGqXI0Bn3+HZ4myrZQ=';
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const sign: PdfSignature = PdfSignature.create(
            externalSignatureCallback1,
            [publicCert1Bytes], {
            contactInfo: 'johndoe@owned.us',
            locationInfo: 'Honolulu, Hawaii',
            reason: 'I am author of this document.',
            signedName: 'Signature',
            digestAlgorithm: DigestAlgorithm.sha256,
            cryptographicStandard: CryptographicStandard.cms
        }
        );
        document.form.add(field);
        field.setSignature(sign);
        expect(sign._contactInfo).toEqual('johndoe@owned.us');
        expect(sign._locationInfo).toEqual('Honolulu, Hawaii');
        expect(sign._reason).toEqual('I am author of this document.');
        expect(sign._documentPermissions).toEqual(1);
        let data = await document.saveAsync();
        document = new PdfDocument(data as Uint8Array);
        page = document.getPage(0);
        expect(document.form.count).toEqual(1);
        field = document.form.fieldAt(0) as PdfSignatureField;
        expect(field).toBeDefined();
        expect(field._dictionary.get('V')).toBeTruthy();
        document.destroy();
    });
    it('987473 - 16', async () => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'sig1', { x: 50, y: 50, width: 150, height: 50 });
        let signature: PdfSignature = PdfSignature.create(
            {
                cryptographicStandard: CryptographicStandard.cades,
                digestAlgorithm: DigestAlgorithm.sha256,
                contactInfo: 'johndoe@owned.us',
                locationInfo: 'Honolulu Hawaii',
                reason: 'Document timestamp',
            }, timestampCallback3
        );
        document.form.add(field);
        field.setSignature(signature);
        const data = await document.saveAsync();
        document = new PdfDocument(data as Uint8Array);
        field = document.form.fieldAt(0) as PdfSignatureField;
        signature = field.getSignature();
        expect(signature._hasTimeStamp).toEqual(true);
        expect(signature._timeStampTokenBytes.length).toBeGreaterThan(0);
        expect(signature._isTimestampOnly).toEqual(true);
        let fieldDictionary: _PdfDictionary = field._dictionary.get('V');
        expect(fieldDictionary).toBeDefined();
        expect(fieldDictionary.get('Type').name).toEqual('DocTimeStamp');
        expect(fieldDictionary.get('SubFilter').name).toEqual('ETSI.RFC3161')
        expect(fieldDictionary.get('ContactInfo')).toEqual('johndoe@owned.us');
        expect(fieldDictionary.get('Reason')).toEqual('Document timestamp');
        expect(fieldDictionary.get('Location')).toEqual('Honolulu Hawaii');
        document.destroy();
    });
    it('987473 - 17', async () => {
        const certificateData = WF_55836;
        const password = 'syncfusion';
        const doc: PdfDocument = new PdfDocument();
        const page = doc.addPage();
        const field: PdfSignatureField = new PdfSignatureField(page, 'sigperm', { x: 10, y: 10, width: 120, height: 40 });
        let sign: PdfSignature = PdfSignature.create(
            certificateData,
            password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256,
            contactInfo: 'contact@domain',
            locationInfo: 'HQ',
            reason: 'lock',
             isLocked: true
        }, timestampCallback2
        );
        doc.form.add(field);
        field.setSignature(sign);
        const out = await doc.saveAsync();
        const verifyDoc = new PdfDocument(out as Uint8Array);
        const verifyField = verifyDoc.form.fieldAt(0) as PdfSignatureField;
        expect((sign as any)._documentPermissions).toEqual(1);
        expect(verifyField).toBeDefined();
        expect(verifyField._dictionary.get('V')).toBeTruthy();
        sign = verifyField.getSignature();
        expect(sign._timeStampTokenBytes.length).toBeGreaterThan(0);
        let options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('contact@domain');
        expect(options.locationInfo).toEqual('HQ');
        expect(options.reason).toEqual('lock');
        expect(verifyDoc.form.count).toEqual(1);
        expect(verifyField).toBeDefined();
        expect(verifyField._dictionary.get('V')).toBeTruthy();
        let fieldDictionary: _PdfDictionary = verifyField._dictionary.get('V');
        expect(fieldDictionary).toBeDefined();
        expect(fieldDictionary.get('ContactInfo')).toEqual('contact@domain');
        expect(fieldDictionary.get('Reason')).toEqual('lock');
        expect(fieldDictionary.get('Location')).toEqual('HQ');
        verifyDoc.destroy();
        doc.destroy();
    });
    it('987473 - 18', async () => {
        const certificateData = WF_55836;
        const password = 'syncfusion';
        const doc: PdfDocument = new PdfDocument();
        const page = doc.addPage();
        const field: PdfSignatureField = new PdfSignatureField(page, 'sigperm', { x: 10, y: 10, width: 120, height: 40 });
        let sign: PdfSignature = PdfSignature.create(
            certificateData,
            password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256,
            contactInfo: 'contact@domain',
            locationInfo: 'HQ',
            reason: 'Allow comments',
            documentPermissions: PdfCertificationFlags.allowComments,
            certify: true
        }, timestampCallback2
        );
        doc.form.add(field);
        field.setSignature(sign);
        const out1 = await doc.saveAsync();
        const verifyDoc1 = new PdfDocument(out1 as Uint8Array);
        const verifyField1 = verifyDoc1.form.fieldAt(0) as PdfSignatureField;
        expect((sign as any)._documentPermissions).toEqual(3);
        expect(verifyField1).toBeDefined();
        expect(verifyField1._dictionary.get('V')).toBeTruthy();
        const sig1 = verifyField1.getSignature();
        expect(sig1._timeStampTokenBytes.length).toBeGreaterThan(0);
        const options1: PdfSignatureOptions = sig1.getSignatureOptions();
        expect(options1.contactInfo).toEqual('contact@domain');
        expect(options1.locationInfo).toEqual('HQ');
        expect(options1.reason).toEqual('Allow comments');
        expect(options1.documentPermissions).toEqual(PdfCertificationFlags.allowComments);
        const page2 = verifyDoc1.addPage();
        const field2: PdfSignatureField = new PdfSignatureField(page2, 'sigperm2', { x: 20, y: 20, width: 120, height: 40 });
        let sign2: PdfSignature = PdfSignature.create(
            certificateData,
            password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256,
            contactInfo: 'second@domain',
            locationInfo: 'Branch',
            reason: 'Approval'
        }, timestampCallback2
        );
        verifyDoc1.form.add(field2);
        field2.setSignature(sign2);
        const out2 = await verifyDoc1.saveAsync();
        const verifyDoc2 = new PdfDocument(out2 as Uint8Array);
        expect(verifyDoc2.form.count).toBeGreaterThanOrEqual(2);
        const vField1 = verifyDoc2.form.fieldAt(0) as PdfSignatureField;
        const vField2 = verifyDoc2.form.fieldAt(1) as PdfSignatureField;
        expect(vField1._dictionary.get('V')).toBeTruthy();
        expect(vField2._dictionary.get('V')).toBeTruthy();
        const vSig1 = vField1.getSignature();
        const vSig2 = vField2.getSignature();
        expect(vSig1._timeStampTokenBytes.length).toBeGreaterThan(0);
        expect(vSig2._timeStampTokenBytes.length).toBeGreaterThan(0);
        const vOpt1 = vSig1.getSignatureOptions();
        const vOpt2 = vSig2.getSignatureOptions();
        expect(vOpt1.contactInfo).toEqual('contact@domain');
        expect(vOpt1.locationInfo).toEqual('HQ');
        expect(vOpt1.reason).toEqual('Allow comments');
        expect(vOpt1.documentPermissions).toEqual(PdfCertificationFlags.allowComments);
        expect(vOpt2.contactInfo).toEqual('second@domain');
        expect(vOpt2.locationInfo).toEqual('Branch');
        expect(vOpt2.reason).toEqual('Approval');
        verifyDoc2.destroy();
        verifyDoc1.destroy();
        doc.destroy();
    });
})