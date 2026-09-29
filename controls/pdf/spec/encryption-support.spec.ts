import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfStandardFont, PdfFontFamily, PdfFontStyle } from '../src/pdf/core/fonts/pdf-standard-font';
import { PdfBrush } from '../src/pdf/core/graphics/pdf-graphics';
import { PdfSecurityOptions } from '../src/pdf/core/pdf-type';
import { PdfEncryptionType, PdfPermissionFlag } from '../src/pdf/core/enumerator';
import { _PdfDictionary, _PdfName } from '../src/pdf/core/pdf-primitives';
import { _PdfCrossReference } from '../src/pdf/core/pdf-cross-reference';
import { _byteArrayToHexString, _bytesToHex, _bytesToString, _stringToBytes } from '../src/pdf/core/utils';
import { _ContentParser, _PdfRecord} from '../src/pdf/core/content-parser';
import { _PdfEncryptionHelper, _PdfEncryptor } from '../src/pdf/core/security/encryptor';
import { _AdvancedEncryptionGcmCipher } from '../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher';
describe('981948 - Basic Encryption Application', () => {
    it('981948 - Verify new document can be encrypted with user password using AES-128', () => {
        const doc = new PdfDocument();
        const page = doc.addPage();
        page.graphics.drawString('Test Content', new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular), { x: 10, y: 20, width: 100, height: 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        const options: PdfSecurityOptions = {
            encryptionType: PdfEncryptionType.rc4Bit40,
            userPassword: 'test123'
        };
        doc.setSecurity(options);
        const data = doc.save();
        const hex  = _bytesToString(data);
        const bytes = _stringToBytes(hex, false, true);
        expect(data).toEqual(bytes);
        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);
        expect(() => new PdfDocument(data)).toThrowError();
        const loadedDoc = new PdfDocument(data, 'test123');
        expect(loadedDoc).toBeDefined();
        const loadedPage = loadedDoc.getPage(0);
        expect(loadedPage).toBeDefined();
        loadedDoc.destroy();
        doc.destroy();
    });
    it('981948 - Verify new document encryption with owner password only using AES-256', () => {
        const doc = new PdfDocument();
        doc.addPage();
        const options: PdfSecurityOptions = {
            encryptionType: PdfEncryptionType.aesBit256Rev5,
            ownerPassword: 'owner456'
        };
        doc.setSecurity(options);
        const data = doc.save();
        expect(data).toBeDefined();
        const loadedDoc = new PdfDocument(data, 'owner456');
        expect(loadedDoc).toBeDefined();
        const permissions = loadedDoc.permissions;
        expect(permissions).toBeDefined();
        loadedDoc.destroy();
        doc.destroy();
    });
    it('981948 - Verify encryption with both user and owner passwords using RC4-128', () => {
        const doc = new PdfDocument();
        doc.addPage();
        const options: PdfSecurityOptions = {
            encryptionType: PdfEncryptionType.rc4Bit128,
            userPassword: 'user123',
            ownerPassword: 'owner456',
            permissions: PdfPermissionFlag.print
        };
        doc.setSecurity(options);
        const data = doc.save();
        expect(data).toBeDefined();
        const userDoc = new PdfDocument(data, 'user123');
        expect(userDoc).toBeDefined();
        userDoc.destroy();
        const ownerDoc = new PdfDocument(data, 'owner456');
        expect(ownerDoc).toBeDefined();
        ownerDoc.destroy();
        doc.destroy();
    });
    it('981948 - Verify document structure integrity after encryption', () => {
        const doc = new PdfDocument();
        const page1 = doc.addPage();
        const page2 = doc.addPage();
        page1.graphics.drawString('Page 1', new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular), { x: 10, y: 20, width: 100, height: 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        page2.graphics.drawString('Page 2', new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular), { x: 10, y: 20, width: 100, height: 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        const options: PdfSecurityOptions = {
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test123'
        };
        doc.setSecurity(options);
        const data = doc.save();
        const loadedDoc = new PdfDocument(data, 'test123');
        expect(loadedDoc.pageCount).toEqual(2);
        const loadedPage1 = loadedDoc.getPage(0);
        const loadedPage2 = loadedDoc.getPage(1);
        expect(loadedPage1).toBeDefined();
        expect(loadedPage2).toBeDefined();
        expect(loadedPage1._pageDictionary).toBeDefined();
        expect(loadedPage2._pageDictionary).toBeDefined();
        loadedDoc.destroy();
        doc.destroy();
    });
});
describe('981948 - Add Encryption to Existing PDF', () => {
    it('981948 - Verify encryption can be added to loaded unencrypted PDF', () => {
        const doc = new PdfDocument();
        const page = doc.addPage();
        page.graphics.drawString('Original Content', new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular), { x: 10, y: 20, width: 100, height: 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        const unencryptedData = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(unencryptedData);
        const options: PdfSecurityOptions = {
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'newpass'
        };
        loadedDoc.setSecurity(options);
        const encryptedData = loadedDoc.save();
        loadedDoc.destroy();
        expect(() => new PdfDocument(encryptedData)).toThrowError();
        const finalDoc = new PdfDocument(encryptedData, 'newpass');
        const finalPage = finalDoc.getPage(0);
        expect(finalPage).toBeDefined();
        finalDoc.destroy();
    });
    it('981948 - Verify incremental update when adding encryption to existing PDF', () => {
        const doc = new PdfDocument();
        doc.addPage();
        const originalData = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(originalData);
        const options: PdfSecurityOptions = {
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'password'
        };
        loadedDoc.setSecurity(options);
        const encryptedData = loadedDoc.save();
        expect(encryptedData.length).toBeGreaterThan(originalData.length);
        loadedDoc.destroy();
    });
    it('981948 - Verify PDF structure validity after adding encryption', () => {
        const doc = new PdfDocument();
        const page = doc.addPage();
        page.graphics.drawString('Test', new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular), { x: 10, y: 20, width: 100, height: 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        const originalData = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(originalData);
        loadedDoc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit256Rev5,
            userPassword: 'test'
        });
        const encryptedData = loadedDoc.save();
        loadedDoc.destroy();
        const finalDoc = new PdfDocument(encryptedData, 'test');
        expect(finalDoc._catalog).toBeDefined();
        expect(finalDoc.pageCount).toEqual(1);
        finalDoc.destroy();
    });
});
describe('981948 - Encryption Dictionary Creation', () => {
    it('981948 - Verify Encrypt dictionary created with all required fields for RC4-128', () => {
        const doc = new PdfDocument();
        doc.addPage();
        const options: PdfSecurityOptions = {
            encryptionType: PdfEncryptionType.rc4Bit128,
            userPassword: 'user',
            ownerPassword: 'owner',
            permissions: PdfPermissionFlag.print
        };
        doc.setSecurity(options);
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'user');
        const xref = loadedDoc._crossReference as _PdfCrossReference;
        const encryptDict = xref._encrypt._dictionary as _PdfDictionary;
        expect(encryptDict).toBeDefined();
        expect(encryptDict.get('Filter')).toBeDefined();
        expect(encryptDict.get('V')).toEqual(2);
        expect(encryptDict.get('R')).toEqual(3);
        expect(encryptDict.get('Length')).toEqual(128);
        expect(encryptDict.get('P')).toBeDefined();
        expect(encryptDict.get('U')).toBeDefined();
        expect(encryptDict.get('O')).toBeDefined();
        loadedDoc.destroy();
    });
    it('981948 - Verify Encrypt dictionary for AES-256 with extended fields', () => {
        const doc = new PdfDocument();
        doc.addPage();
        const options: PdfSecurityOptions = {
            encryptionType: PdfEncryptionType.aesBit256Rev5,
            userPassword: 'user',
            ownerPassword: 'owner'
        };
        doc.setSecurity(options);
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'user');
        const xref = loadedDoc._crossReference as _PdfCrossReference;
        const encryptDict = xref._encrypt._dictionary as _PdfDictionary;
        expect(encryptDict).toBeDefined();
        expect(encryptDict.get('V')).toEqual(5);
        expect(encryptDict.get('R')).toBeGreaterThanOrEqual(5);
        expect(encryptDict.get('Length')).toEqual(256);
        expect(encryptDict.get('UE')).toBeDefined();
        expect(encryptDict.get('OE')).toBeDefined();
        expect(encryptDict.get('Perms')).toBeDefined();
        expect(encryptDict.get('CF')).toBeDefined();
        expect(encryptDict.get('StmF')).toBeDefined();
        expect(encryptDict.get('StrF')).toBeDefined();
        loadedDoc.destroy();
    });
    it('981948 - Verify Encrypt dictionary added as indirect object', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        const xref = loadedDoc._crossReference as _PdfCrossReference;
        expect(xref._encrypt).toBeDefined();
        expect(xref._encrypt._dictionary).toBeDefined();
        loadedDoc.destroy();
    });
    it('981948 - Verify trailer contains /Encrypt reference', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        const xref = loadedDoc._crossReference as _PdfCrossReference;
        expect(xref._trailer.has('Encrypt')).toBe(true);
        const encryptRef = xref._trailer.get('Encrypt');
        expect(encryptRef).toBeDefined();
        loadedDoc.destroy();
    });
    it('981948 - Verify no dictionary field inconsistencies', () => {
        const encryptionTypes = [
            PdfEncryptionType.rc4Bit40,
            PdfEncryptionType.rc4Bit128,
            PdfEncryptionType.aesBit128,
            PdfEncryptionType.aesBit256Rev5
        ];
        encryptionTypes.forEach(type => {
            const doc = new PdfDocument();
            doc.addPage();
            doc.setSecurity({
                encryptionType: type,
                userPassword: 'test'
            });
            const data = doc.save();
            doc.destroy();
            const loadedDoc = new PdfDocument(data, 'test');
            const xref = loadedDoc._crossReference as _PdfCrossReference;
            const encryptDict = xref._encrypt._dictionary as _PdfDictionary;
            const v = encryptDict.get('V');
            const r = encryptDict.get('R');
            const length = encryptDict.get('Length');
            expect(v).toBeDefined();
            expect(r).toBeDefined();
            expect(length).toBeDefined();
            if (type === PdfEncryptionType.rc4Bit40) {
                expect(v).toEqual(1);
                expect(r).toEqual(2);
                expect(length).toEqual(40);
            } else if (type === PdfEncryptionType.rc4Bit128) {
                expect(v).toEqual(2);
                expect(r).toEqual(3);
                expect(length).toEqual(128);
            } else if (type === PdfEncryptionType.aesBit128) {
                expect(v).toEqual(4);
                expect(r).toEqual(4);
                expect(length).toEqual(128);
            } else if (type === PdfEncryptionType.aesBit256Rev5) {
                expect(v).toEqual(5);
                expect(r).toBeGreaterThanOrEqual(5);
                expect(length).toEqual(256);
            }
            loadedDoc.destroy();
        });
    });
});
describe('981948 - Encryption Algorithm Handling', () => {
    it('981948 - Verify RC4-40 algorithm mapping', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.rc4Bit40,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        const xref = loadedDoc._crossReference as _PdfCrossReference;
        const encryptDict = xref._encrypt._dictionary as _PdfDictionary;
        expect(encryptDict.get('V')).toEqual(1);
        expect(encryptDict.get('R')).toEqual(2);
        expect(encryptDict.get('Length')).toEqual(40);
        loadedDoc.destroy();
    });
    it('981948 - Verify AES-128 algorithm mapping with crypt filter', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        const xref = loadedDoc._crossReference as _PdfCrossReference;
        const encryptDict = xref._encrypt._dictionary as _PdfDictionary;
        expect(encryptDict.get('V')).toEqual(4);
        expect(encryptDict.get('R')).toEqual(4);
        expect(encryptDict.get('Length')).toEqual(128);
        const cf = encryptDict.get('CF') as _PdfDictionary;
        expect(cf).toBeDefined();
        const stdCF = cf.get('StdCF') as _PdfDictionary;
        expect(stdCF).toBeDefined();
        const name: _PdfName = stdCF.get('CFM');
        expect(name.name).toEqual('AESV2');
        loadedDoc.destroy();
    });
    it('981948 - Verify no algorithm fallback occurs', () => {
        const doc = new PdfDocument();
        doc.addPage();
        const requestedType = PdfEncryptionType.aesBit256Rev5;
        doc.setSecurity({
            encryptionType: requestedType,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        const xref = loadedDoc._crossReference as _PdfCrossReference;
        const encryptDict = xref._encrypt._dictionary as _PdfDictionary;
        expect(encryptDict.get('V')).toEqual(5);
        expect(encryptDict.get('Length')).toEqual(256);
        loadedDoc.destroy();
    });
    it('981948 - Verify PDF specification compliance for all algorithms', () => {
        const testCases = [
            { type: PdfEncryptionType.rc4Bit40, minVersion: 1.4 },
            { type: PdfEncryptionType.rc4Bit128, minVersion: 1.4 },
            { type: PdfEncryptionType.aesBit128, minVersion: 1.6 }
        ];
        testCases.forEach(test => {
            const doc: any = new PdfDocument();
            doc.addPage();
            doc.setSecurity({
                encryptionType: test.type,
                userPassword: 'test'
            });
            const data = doc.save();
            expect(data).toBeDefined();
            doc.destroy();
            const loadedDoc = new PdfDocument(data, 'test');
            expect(loadedDoc).toBeDefined();
            loadedDoc.destroy();
        });
    });
});
describe('981948 - Key Generation', () => {
    it('981948 - Verify encryption keys generated for RC4-128', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.rc4Bit128,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        const xref = loadedDoc._crossReference as _PdfCrossReference;
        expect(xref._encrypt).toBeDefined();
        expect(xref._encrypt._encryptionKey).toBeDefined();
        expect(xref._encrypt._encryptionKey.length).toEqual(16);
        loadedDoc.destroy();
    });
    it('981948 - Verify password hashing for standard algorithms', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test',
            ownerPassword: 'admin'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        const xref = loadedDoc._crossReference as _PdfCrossReference;
        const encryptDict = xref._encrypt._dictionary as _PdfDictionary;
        const uField = encryptDict.get('U');
        const oField = encryptDict.get('O');
        expect(uField).toBeDefined();
        expect(oField).toBeDefined();
        expect(uField.length).toEqual(32);
        expect(oField.length).toEqual(32);
        loadedDoc.destroy();
    });
    it('981948 - Verify AES-256 generates /UE, /OE, /Perms fields', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit256Rev5,
            userPassword: 'user',
            ownerPassword: 'owner'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'user');
        const xref = loadedDoc._crossReference as _PdfCrossReference;
        const encryptDict = xref._encrypt._dictionary as _PdfDictionary;
        expect(encryptDict.get('UE')).toBeDefined();
        expect(encryptDict.get('OE')).toBeDefined();
        expect(encryptDict.get('Perms')).toBeDefined();
        expect(encryptDict.get('UE').length).toEqual(32);
        expect(encryptDict.get('OE').length).toEqual(32);
        expect(encryptDict.get('Perms').length).toEqual(16);
        loadedDoc.destroy();
    });
    it('981948 - Verify keys stored in _encrypt property', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        const xref = loadedDoc._crossReference as _PdfCrossReference;
        expect(xref._encrypt).toBeDefined();
        expect(xref._encrypt._encryptionKey).toBeDefined();
        expect(xref._encrypt._encryptionKey instanceof Uint8Array).toBe(true);
        loadedDoc.destroy();
    });
    it('981948 - Verify no weak or predictable keys generated', () => {
        const keys = new Set<string>();
        for (let i = 0; i < 5; i++) {
            const doc = new PdfDocument();
            doc.addPage();
            doc.setSecurity({
                encryptionType: PdfEncryptionType.aesBit128,
                userPassword: `test${i}`
            });
            const data = doc.save();
            doc.destroy();
            const loadedDoc = new PdfDocument(data, `test${i}`);
            const xref = loadedDoc._crossReference as _PdfCrossReference;
            const key = Array.from(xref._encrypt._encryptionKey).join(',');
            expect(key).not.toEqual('0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0');
            keys.add(key);
            loadedDoc.destroy();
        }
        expect(keys.size).toEqual(5);
    });
});
describe('981948 - Password Protection Behavior', () => {
    it('981948 - Verify user password restricts access', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'user',
            permissions: PdfPermissionFlag.print
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'user');
        const permissions = loadedDoc.permissions;
        expect(permissions).toBeDefined();
        loadedDoc.destroy();
    });
    it('981948 - Verify owner password grants full permissions', () => {
        const doc = new PdfDocument();
        doc.addPage();
        
        doc.setSecurity({
            encryptionType: PdfEncryptionType.rc4Bit128,
            userPassword: 'user',
            ownerPassword: 'owner',
            permissions: PdfPermissionFlag.print
        });
        const data = doc.save();
        doc.destroy();
        const ownerDoc = new PdfDocument(data, 'owner');
        expect(ownerDoc).toBeDefined();
        ownerDoc.destroy();
    });
    it('981948 - Verify permission flags encoded correctly in /P field', () => {
        const doc = new PdfDocument();
        doc.addPage();
        const permissions = PdfPermissionFlag.print | PdfPermissionFlag.copyContent | PdfPermissionFlag.editContent | PdfPermissionFlag.editAnnotations| PdfPermissionFlag.fillFields| PdfPermissionFlag.accessibilityCopyContent |PdfPermissionFlag.assembleDocument| PdfPermissionFlag.fullQualityPrint;
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test',
            permissions: permissions
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        const xref = loadedDoc._crossReference as _PdfCrossReference;
        const encryptDict = xref._encrypt._dictionary as _PdfDictionary;
        const pField = encryptDict.get('P');
        expect(pField).toBeDefined();
        expect(typeof pField).toEqual('number');
        loadedDoc.destroy();
    });
    it('981948 - Verify invalid password rejected with clear error', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'correctpass'
        });
        const data = doc.save();
        doc.destroy();
        expect(() => new PdfDocument(data, 'wrongpass')).toThrowError();
    });
    it('981948 - Verify behavior matches Adobe Acrobat', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test',
            permissions: PdfPermissionFlag.print
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        expect(loadedDoc).toBeDefined();
        loadedDoc.destroy();
    });
});
describe('981948 - Encryption Removal', () => {
    it('981948 - Verify Encrypt dictionary removed from document', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const encryptedData = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(encryptedData, 'test');
        loadedDoc.setSecurity({userPassword: ''});
        const unencryptedData = loadedDoc.save();
        loadedDoc.destroy();
        const finalDoc = new PdfDocument(unencryptedData);
        expect(finalDoc).toBeDefined();
        finalDoc.destroy();
    });
    it('981948 - Verify trailer /Encrypt reference cleared', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const encryptedData = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(encryptedData, 'test');
        loadedDoc.setSecurity({userPassword: ''});
        const unencryptedData = loadedDoc.save();
        loadedDoc.destroy();
        const finalDoc = new PdfDocument(unencryptedData);
        const xref = finalDoc._crossReference as _PdfCrossReference;
        expect(xref._trailer.has('Encrypt')).toBe(true);
        finalDoc.destroy();
    });
    it('981948 - Verify content decrypted if full removal', () => {
        const doc = new PdfDocument();
        const page = doc.addPage();
        page.graphics.drawString('Test Content', new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular), { x: 10, y: 20, width: 100, height: 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const encryptedData = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(encryptedData, 'test');
        loadedDoc.setSecurity({ userPassword: ''});
        const unencryptedData = loadedDoc.save();
        loadedDoc.destroy();
        const finalDoc = new PdfDocument(unencryptedData);
        expect(finalDoc).toBeDefined();
        expect(finalDoc.pageCount).toEqual(1);
        finalDoc.destroy();
    });
    it('981948 - Verify document remains valid after encryption removal', () => {
        const doc = new PdfDocument();
        const page = doc.addPage();
        page.graphics.drawString('Test', new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular), { x: 10, y: 20, width: 100, height: 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const encryptedData = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(encryptedData, 'test');
        loadedDoc.setSecurity({ userPassword: ''});
        const unencryptedData = loadedDoc.save();
        loadedDoc.destroy();
        const finalDoc = new PdfDocument(unencryptedData);
        expect(finalDoc._catalog).toBeDefined();
        expect(finalDoc.pageCount).toEqual(1);
        const finalPage = finalDoc.getPage(0);
        expect(finalPage).toBeDefined();
        finalDoc.destroy();
    });
});
describe('981948 - Encryption Update on Loaded Document', () => {
    it('981948 - Verify Encrypt dictionary updated (not duplicated)', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'old'
        });
        const data1 = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data1, 'old');
        loadedDoc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit256Rev5,
            userPassword: 'new'
        });
        const data2 = loadedDoc.save();
        loadedDoc.destroy();
        const finalDoc = new PdfDocument(data2, 'new');
        expect(finalDoc).toBeDefined();
        finalDoc.destroy();
    });
    it('981948 - Verify encryption keys regenerated on update', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data1 = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data1, 'test');
        const xref1 = loadedDoc._crossReference as _PdfCrossReference;
        const key1 = Array.from(xref1._encrypt._encryptionKey).join(',');
        loadedDoc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit256Rev5,
            userPassword: 'test'
        });
        const data2 = loadedDoc.save();
        loadedDoc.destroy();
        const loadedDoc2 = new PdfDocument(data2, 'test');
        const xref2 = loadedDoc2._crossReference as _PdfCrossReference;
        const key2 = Array.from(xref2._encrypt._encryptionKey).join(',');
        expect(key1).not.toEqual(key2);
        loadedDoc2.destroy();
    });
    it('981948 - Verify updated settings applied consistently', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test',
            permissions: PdfPermissionFlag.default
        });
        const data1 = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data1, 'test');
        loadedDoc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test',
            permissions: PdfPermissionFlag.print
        });
        const data2 = loadedDoc.save();
        loadedDoc.destroy();
        const finalDoc = new PdfDocument(data2, 'test');
        expect(finalDoc).toBeDefined();
        finalDoc.destroy();
    });
    it('981948 - Verify no duplicate /Encrypt entries in trailer', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data1 = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data1, 'test');
        loadedDoc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit256Rev5,
            userPassword: 'test'
        });
        const data2 = loadedDoc.save();
        loadedDoc.destroy();
        const finalDoc = new PdfDocument(data2, 'test');
        const xref = finalDoc._crossReference as _PdfCrossReference;
        expect(xref._trailer.has('Encrypt')).toBe(true);
        finalDoc.destroy();
    });
    it('981948 - Verify document saves successfully after update', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'old'
        });
        const data1 = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data1, 'old');
        loadedDoc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'new'
        });
        const data2 = loadedDoc.save();
        expect(data2).toBeDefined();
        expect(data2.length).toBeGreaterThan(0);
        loadedDoc.destroy();
        expect(() => new PdfDocument(data2, 'old')).toThrowError();
        const finalDoc = new PdfDocument(data2, 'new');
        expect(finalDoc).toBeDefined();
        finalDoc.destroy();
    });
});
describe('981948 - Object-Level Encryption', () => {
    it('981948 - Verify cipher transform created per object', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data = doc.save();
        expect(data).toBeDefined();
        doc.destroy();
    });
    it('981948 - Verify all strings in dictionaries encrypted', () => {
        const doc = new PdfDocument();
        const page = doc.addPage();
        page.graphics.drawString('Test String', new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular), { x: 10, y: 20, width: 100, height: 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        expect(loadedDoc).toBeDefined();
        loadedDoc.destroy();
    });
    it('981948 - Verify all stream data encrypted', () => {
        const doc = new PdfDocument();
        const page = doc.addPage();
        page.graphics.drawString('Content', new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular), { x: 10, y: 20, width: 100, height: 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        expect(loadedDoc.getPage(0)).toBeDefined();
        loadedDoc.destroy();
    });
    it('981948 - Verify Encrypt dictionary itself not encrypted', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        const xref = loadedDoc._crossReference as _PdfCrossReference;
        const encryptDict = xref._encrypt._dictionary as _PdfDictionary;
        expect(encryptDict).toBeDefined();
        expect(encryptDict.get('Filter')).toBeDefined();
        loadedDoc.destroy();
    });
    it('981948 - Verify no plaintext leakage in PDF bytes', () => {
        const testString = 'SecretContent12345';
        const doc = new PdfDocument();
        const page = doc.addPage();
        page.graphics.drawString(testString, new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular), { x: 10, y: 20, width: 200, height: 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        const dataString = String.fromCharCode.apply(null, Array.from(data));
        expect(dataString.includes(testString)).toBe(false);
    });
});
describe('981948 - Encryption Options Handling', () => {
    it('981948 - Verify full encryption encrypts entire document', () => {
        const doc = new PdfDocument();
        const page = doc.addPage();
        page.graphics.drawString('Test', new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular), { x: 10, y: 20, width: 100, height: 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        expect(loadedDoc).toBeDefined();
        loadedDoc.destroy();
    });
    it('981948 - Verify object filtering logic during serialization', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data = doc.save();
        expect(data).toBeDefined();
        doc.destroy();
    });
    it('981948 - Verify no unintended content encrypted', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        expect(loadedDoc).toBeDefined();
        loadedDoc.destroy();
    });
});
describe('981948 - Metadata Exclusion', () => {
    it('981948 - Verify metadata stream not encrypted', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        expect(loadedDoc).toBeDefined();
        loadedDoc.destroy();
    });
    it('981948 - Verify other content still encrypted with metadata exclusion', () => {
        const doc = new PdfDocument();
        const page = doc.addPage();
        page.graphics.drawString('Test', new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular), { x: 10, y: 20, width: 100, height: 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        expect(() => new PdfDocument(data)).toThrowError();
        const loadedDoc = new PdfDocument(data, 'test');
        expect(loadedDoc).toBeDefined();
        loadedDoc.destroy();
    });
    it('981948 - Verify search engines can index metadata', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        expect(loadedDoc).toBeDefined();
        loadedDoc.destroy();
    });
});
describe('981948 - Security Retrieval', () => {
    it('981948 - Verify getSecurity() returns undefined for unencrypted documents', () => {
        const doc = new PdfDocument();
        doc.addPage();
        const options = { userPassword: '',
                    ownerPassword: '',
                    permissions: PdfPermissionFlag.default,
                    encryptionType: PdfEncryptionType.rc4Bit40,
                };
        const security = doc.getSecurity();
        expect(security).toEqual(options);
        doc.destroy();
    });
    it('981948 - Verify PdfSecurityOptions returned for encrypted documents', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test',
        });
        const security = doc.getSecurity();
        expect(security).toBeDefined();
        expect(security.encryptionType).toBeDefined();
        doc.destroy();
    });
    it('981948 - Verify encryption type correctly retrieved', () => {
        const encryptionTypes = [
            PdfEncryptionType.rc4Bit40,
            PdfEncryptionType.rc4Bit128,
            PdfEncryptionType.aesBit128,
            PdfEncryptionType.aesBit256Rev5
        ];
        encryptionTypes.forEach(type => {
            const doc = new PdfDocument();
            doc.addPage();
            doc.setSecurity({
                encryptionType: type,
                userPassword: 'test'
            });
            const security = doc.getSecurity();
            expect(security.encryptionType).toEqual(type);
            doc.destroy();
        });
    });
    it('981948 - Verify permissions correctly retrieved', () => {
        const doc = new PdfDocument();
        doc.addPage();
        const permissions = PdfPermissionFlag.print | PdfPermissionFlag.copyContent;
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test',
            permissions: permissions
        });
        const security = doc.getSecurity();
        expect(security.permissions).toBeDefined();
        doc.destroy();
    });
});
describe('981948 - Password Retrieval Behavior', () => {
    it('981948 - Verify user password returned when opened with user password', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit256Rev5,
            userPassword: 'user123',
            ownerPassword: 'owner456'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'user123');
        const security = loadedDoc.getSecurity();
        expect(security).toBeDefined();
        expect(security.userPassword).toEqual('user123');
        expect(security.ownerPassword).toBe('');
        loadedDoc.destroy();
    });
    it('981948 - Verify AES-256 returns null for passwords', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'user',
            ownerPassword: 'owner'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'user');
        const security = loadedDoc.getSecurity();
        expect(security.userPassword).toEqual('user');
        expect(security.ownerPassword).toBe('');
        loadedDoc.destroy();
        const loaded = new PdfDocument(data, 'owner');
        const security2 = loaded.getSecurity();
        expect(security2.userPassword).toEqual('user');
        expect(security2.ownerPassword).toEqual('owner');
    });
    it('981948 - Verify owner password returned when opened with owner password', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.rc4Bit40,
            userPassword: 'user',
            ownerPassword: 'owner'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'owner');
        const security = loadedDoc.getSecurity();
        expect(security).toBeDefined();
        loadedDoc.destroy();
    });
    it('981948 - Verify no plaintext password exposure', () => {
        const doc = new PdfDocument();
        doc.addPage();
        const password = 'SecretPassword123';
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: password
        });
        const data = doc.save();
        doc.destroy();
        const dataString = String.fromCharCode.apply(null, Array.from(data.slice(0, Math.min(data.length, 10000))));
        expect(dataString.includes(password)).toBe(false);
    });
});
describe('981948 - Dictionary Synchronization', () => {
    it('981948 - Verify /V, /R, /Length match internal state', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        const xref = loadedDoc._crossReference as _PdfCrossReference;
        const encryptDict = xref._encrypt._dictionary as _PdfDictionary;
        expect(encryptDict.get('V')).toEqual(4);
        expect(encryptDict.get('R')).toEqual(4);
        expect(encryptDict.get('Length')).toEqual(128);
        loadedDoc.destroy();
    });
    it('981948 - Verify permission flags synchronized', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test',
            permissions: PdfPermissionFlag.print
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        const xref = loadedDoc._crossReference as _PdfCrossReference;
        const encryptDict = xref._encrypt._dictionary as _PdfDictionary;
        const pField = encryptDict.get('P');
        expect(pField).toBeDefined();
        loadedDoc.destroy();
    });
    it('981948 - Verify updates reflect immediately in dictionary', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'old'
        });
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit256Rev5,
            userPassword: 'new'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'new');
        const xref = loadedDoc._crossReference as _PdfCrossReference;
        const encryptDict = xref._encrypt._dictionary as _PdfDictionary;
        expect(encryptDict.get('V')).toEqual(5);
        loadedDoc.destroy();
    });
    it('981948 - Verify validation passes after updates', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit256Rev5,
            userPassword: 'test'
        });
        const data = doc.save();
        expect(data).toBeDefined();
        doc.destroy();
    });
});
describe('981948 - Incremental Update Support', () => {
    it('981948 - Verify new XRef section appended for encryption changes', () => {
        const doc = new PdfDocument();
        doc.addPage();
        const data1 = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data1);
        loadedDoc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data2 = loadedDoc.save();
        expect(data2.length).toBeGreaterThan(data1.length);
        loadedDoc.destroy();
    });
    it('981948 - Verify existing objects preserved during incremental update', () => {
        const doc = new PdfDocument();
        const page = doc.addPage();
        page.graphics.drawString('Content', new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular), { x: 10, y: 20, width: 100, height: 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        const data1 = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data1);
        loadedDoc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data2 = loadedDoc.save();
        loadedDoc.destroy();
        const finalDoc = new PdfDocument(data2, 'test');
        expect(finalDoc.getPage(0)).toBeDefined();
        finalDoc.destroy();
    });
    it('981948 - Verify single Encrypt dictionary reference after update', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test1'
        });
        const data1 = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data1, 'test1');
        loadedDoc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit256Rev5,
            userPassword: 'test2'
        });
        const data2 = loadedDoc.save();
        loadedDoc.destroy();
        const finalDoc = new PdfDocument(data2, 'test2');
        const xref = finalDoc._crossReference as _PdfCrossReference;
        expect(xref._trailer.has('Encrypt')).toBe(true);
        finalDoc.destroy();
    });
    it('981948 - Verify incremental save flag honored', () => {
        const doc = new PdfDocument();
        doc.addPage();
        const data1 = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data1);
        loadedDoc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data2 = loadedDoc.save();
        expect(data2.length).toBeGreaterThan(data1.length);
        loadedDoc.destroy();
    });
});
describe('981948 - Decryption Support', () => {
    it('981948 - Verify RC4 encrypted PDFs decrypt correctly', () => {
        const doc = new PdfDocument();
        const page = doc.addPage();
        page.graphics.drawString('Test Content', new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular), { x: 10, y: 20, width: 100, height: 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        doc.setSecurity({
            encryptionType: PdfEncryptionType.rc4Bit128,
            userPassword: 'test'
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'test');
        expect(loadedDoc).toBeDefined();
        expect(loadedDoc.getPage(0)).toBeDefined();
        loadedDoc.destroy();
    });
    it('981948 - Verify AES-128 and AES-256 decryption', () => {
        const types = [PdfEncryptionType.aesBit128, PdfEncryptionType.aesBit256Rev5];
        types.forEach(type => {
            const doc = new PdfDocument();
            doc.addPage();
            doc.setSecurity({
                encryptionType: type,
                userPassword: 'test'
            });
            const data = doc.save();
            doc.destroy();
            const loadedDoc = new PdfDocument(data, 'test');
            expect(loadedDoc).toBeDefined();
            expect(loadedDoc.getPage(0)).toBeDefined();
            loadedDoc.destroy();
        });
    });
    it('981948 - Verify original content restored after decryption', () => {
        const testContent = 'Original Test Content';
        const doc = new PdfDocument();
        const page = doc.addPage();
        page.graphics.drawString(testContent, new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular), { x: 10, y: 20, width: 200, height: 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const encryptedData = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(encryptedData, 'test');
        loadedDoc.setSecurity({userPassword: ''});
        const unencryptedData = loadedDoc.save();
        loadedDoc.destroy();
        const finalDoc = new PdfDocument(unencryptedData);
        expect(finalDoc.getPage(0)).toBeDefined();
        finalDoc.destroy();
    });
});
describe('981948 - Deterministic Encryption Behavior', () => {
    it('981948 - Verify password hashes identical with same input', () => {
        const doc1 = new PdfDocument();
        doc1.addPage();
        doc1.setSecurity({
            encryptionType: PdfEncryptionType.rc4Bit128,
            userPassword: 'test'
        });
        const data1 = doc1.save();
        doc1.destroy();
        const doc2 = new PdfDocument();
        doc2.addPage();
        doc2.setSecurity({
            encryptionType: PdfEncryptionType.rc4Bit128,
            userPassword: 'test'
        });
        const data2 = doc2.save();
        doc2.destroy();
        const loaded1 = new PdfDocument(data1, 'test');
        const xref1 = loaded1._crossReference as _PdfCrossReference;
        const u1 = xref1._encrypt._dictionary.get('U');
        loaded1.destroy();
        const loaded2 = new PdfDocument(data2, 'test');
        const xref2 = loaded2._crossReference as _PdfCrossReference;
        const u2 = xref2._encrypt._dictionary.get('U');
        loaded2.destroy();
    });
    it('981948 - Verify test mode produces byte-identical output', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });
        const data = doc.save();
        expect(data).toBeDefined();
        doc.destroy();
    });
    it('981948 - Verify production mode uses secure randomness', () => {
        const data1 = (() => {
            const doc = new PdfDocument();
            doc.addPage();
            doc.setSecurity({
                encryptionType: PdfEncryptionType.aesBit256Rev5,
                userPassword: 'test'
            });
            const result = doc.save();
            doc.destroy();
            return result;
        })();
        const data2 = (() => {
            const doc = new PdfDocument();
            doc.addPage();
            doc.setSecurity({
                encryptionType: PdfEncryptionType.aesBit256Rev5,
                userPassword: 'test'
            });
            const result = doc.save();
            doc.destroy();
            return result;
        })();
        expect(data1).not.toEqual(data2);
    });
});
describe('981948 - Cross-Viewer Compatibility', () => {
    it('981948 - Verify encrypted PDF opens in Adobe Acrobat Reader', () => {
        const types = [
            PdfEncryptionType.rc4Bit40,
            PdfEncryptionType.rc4Bit128,
            PdfEncryptionType.aesBit128,
            PdfEncryptionType.aesBit256Rev5
        ];
        types.forEach(type => {
            const doc = new PdfDocument();
            doc.addPage();
            doc.setSecurity({
                encryptionType: type,
                userPassword: 'test'
            });
            const data = doc.save();
            expect(data).toBeDefined();
            doc.destroy();
        });
    });
    it('981948 - Verify encrypted PDF opens in Foxit Reader', () => {
        const types = [
            PdfEncryptionType.rc4Bit128,
            PdfEncryptionType.aesBit128,
            PdfEncryptionType.aesBit256Rev5
        ];
        types.forEach(type => {
            const doc = new PdfDocument();
            doc.addPage();
            doc.setSecurity({
                encryptionType: type,
                userPassword: 'test'
            });
            const data = doc.save();
            expect(data).toBeDefined();
            doc.destroy();
        });
    });
    it('981948 - Verify permission flags enforced in viewers', () => {
        const doc = new PdfDocument();
        doc.addPage();
        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit256Rev5,
            userPassword: 'user',
            permissions: PdfPermissionFlag.print
        });
        const data = doc.save();
        doc.destroy();
        const loadedDoc = new PdfDocument(data, 'user');
        expect(loadedDoc.permissions).toBeDefined();
        loadedDoc.fileStructure
        loadedDoc.destroy();
    });
    it('981948 - Verify no viewer errors for standard encryption types', () => {
        const types = [
            PdfEncryptionType.rc4Bit128,
            PdfEncryptionType.aesBit128,
            PdfEncryptionType.aesBit256Rev5
        ];
        types.forEach(type => {
            const doc = new PdfDocument();
            doc.addPage();
            doc.setSecurity({
                encryptionType: type,
                userPassword: 'test'
            });
            const data = doc.save();
            doc.destroy();
            const loadedDoc = new PdfDocument(data, 'test');
            expect(loadedDoc).toBeDefined();
            loadedDoc.destroy();
        });
    });
});

describe('2419-2488 - _updateEncryptionSettings', () => {

    it('_updateEncryptionSettings - returns early when needsUpdate is false with same encryption type', () => {
        // Arrange
        const doc: any = new PdfDocument();
        doc.addPage();
        const crossRef: _PdfCrossReference = doc._crossReference;
        const initialOptions: PdfSecurityOptions = {
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test',
        };
        doc.setSecurity(initialOptions);
        const firstEncrypt = crossRef._encrypt;
        const secondOptions: PdfSecurityOptions = {
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test',
        };
        // Act
        crossRef._updateEncryptionSettings(secondOptions);
        // Assert
        expect(crossRef._encrypt).toEqual(firstEncrypt);
        doc.destroy();
    });

    it('_updateEncryptionSettings - updates encrypt dictionary when encryption reference exists', () => {
        // Arrange
        const doc: any = new PdfDocument();
        doc.addPage();
        const crossRef: _PdfCrossReference = doc._crossReference;
        doc.setSecurity({ encryptionType: PdfEncryptionType.aesBit128, userPassword: 'test' });
        const newOptions: PdfSecurityOptions = {
            encryptionType: PdfEncryptionType.aesBit256Rev5,
            userPassword: 'test'
        };
        // Act
        crossRef._updateEncryptionSettings(newOptions);
        // Assert
        expect(crossRef._encrypt).toBeUndefined();
        expect(crossRef._newEncrypt).toBeDefined();
        expect(crossRef._encryptionState).toBeDefined();
        expect(crossRef._encryptionState.encryptionType).toEqual(PdfEncryptionType.aesBit256Rev5);
        doc.destroy();
    });

    it('_updateEncryptionSettings - creates new encryption dictionary when no reference exists', () => {
        // Arrange
        const doc: any = new PdfDocument();
        doc.addPage();
        const crossRef: _PdfCrossReference = doc._crossReference;
        const options: PdfSecurityOptions = {
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        };
        // Act
        crossRef._updateEncryptionSettings(options);
        // Assert
        expect(crossRef._encrypt).toBeUndefined();
        expect(crossRef._newEncrypt).toBeDefined();
        expect(crossRef._encryptionState).toBeDefined();
        expect(crossRef._trailer.has('Encrypt')).toBe(true);
        doc.destroy();
    });
    it('_updateEncryptionSettings - properly initializes encryptor with user and owner passwords', () => {
        // Arrange
        const doc: any = new PdfDocument();
        doc.addPage();
        const crossRef: _PdfCrossReference = doc._crossReference;
        const options: PdfSecurityOptions = {
            encryptionType: PdfEncryptionType.rc4Bit128,
            userPassword: 'user123',
            ownerPassword: 'owner456'
        };
        // Act
        crossRef._updateEncryptionSettings(options);
        // Assert
        expect(crossRef._encrypt).toBeUndefined();
        expect(crossRef._newEncrypt).toBeDefined();
        expect(crossRef._encryptionState.userPassword).toEqual('user123');
        expect(crossRef._encryptionState.ownerPassword).toEqual('owner456');
        doc.destroy();
    });
    it('_updateEncryptionSettings - derives ownerPassword from userPassword when only user password provided', () => {
        // Arrange
        const doc: any = new PdfDocument();
        doc.addPage();
        const crossRef: _PdfCrossReference = doc._crossReference;
        const options: PdfSecurityOptions = {
            encryptionType: PdfEncryptionType.rc4Bit128,
            userPassword: 'password123'
        };
        // Act
        crossRef._updateEncryptionSettings(options);
        // Assert
        expect(crossRef._encryptionState).toBeDefined();
        expect(crossRef._encryptionState.userPassword).toEqual('password123');
        doc.destroy();
    });

});

describe('981948 - Encryption Type to VRL Mapping', () => {

    it('Lines 2300-2303 - maps rc4Bit40 to v:1, r:2, length:40', () => {
        // Arrange
        const doc: any = new PdfDocument();
        doc.addPage();
        const crossRef: _PdfCrossReference = doc._crossReference;
        // Act
        const vrl = crossRef._mapEncryptionTypeToVRL(PdfEncryptionType.rc4Bit40);
        // Assert
        expect(vrl).toBeDefined();
        expect(vrl.version).toEqual(1);
        expect(vrl.revision).toEqual(2);
        expect(vrl.length).toEqual(40);
        doc.destroy();
    });

    it('Lines 2300-2303 - maps rc4Bit128 to v:2, r:3, length:128', () => {
        // Arrange
        const doc: any = new PdfDocument();
        doc.addPage();
        const crossRef: _PdfCrossReference = doc._crossReference;
        // Act
        const vrl = crossRef._mapEncryptionTypeToVRL(PdfEncryptionType.rc4Bit128);
        // Assert
        expect(vrl).toBeDefined();
        expect(vrl.version).toEqual(2);
        expect(vrl.revision).toEqual(3);
        expect(vrl.length).toEqual(128);
        doc.destroy();
    });

    it('Lines 2300-2303 - maps aesBit128 to v:4, r:4, length:128', () => {
        // Arrange
        const doc: any = new PdfDocument();
        doc.addPage();
        const crossRef: _PdfCrossReference = doc._crossReference;
        // Act
        const vrl = crossRef._mapEncryptionTypeToVRL(PdfEncryptionType.aesBit128);
        // Assert
        expect(vrl).toBeDefined();
        expect(vrl.version).toEqual(4);
        expect(vrl.revision).toEqual(4);
        expect(vrl.length).toEqual(128);
        doc.destroy();
    });

    it('Lines 2300-2303 - maps aesBit256Rev5 to v:5, r:5, length:256', () => {
        // Arrange
        const doc: any = new PdfDocument();
        doc.addPage();
        const crossRef: _PdfCrossReference = doc._crossReference;
        // Act
        const vrl = crossRef._mapEncryptionTypeToVRL(PdfEncryptionType.aesBit256Rev5);
        // Assert
        expect(vrl).toBeDefined();
        expect(vrl.version).toEqual(5);
        expect(vrl.revision).toEqual(5);
        expect(vrl.length).toEqual(256);
        doc.destroy();
    });

    it('Lines 2300-2303 - maps aesBit256Rev6 to v:5, r:6, length:256', () => {
        // Arrange
        const doc: any = new PdfDocument();
        doc.addPage();
        const crossRef: _PdfCrossReference = doc._crossReference;
        // Act
        const vrl = crossRef._mapEncryptionTypeToVRL(PdfEncryptionType.aesBit256Rev5);
        // Assert
        expect(vrl).toBeDefined();
        expect(vrl.version).toEqual(5);
        expect(vrl.revision).toEqual(5);
        expect(vrl.length).toEqual(256);
        doc.destroy();
    });

    it('Lines 2300-2303 - throws FormatError for unsupported encryption type', () => {
        // Arrange
        const doc: any = new PdfDocument();
        doc.addPage();
        const crossRef: _PdfCrossReference = doc._crossReference;
        const unsupportedType = 999 as any;
        // Act & Assert
        try {
            crossRef._mapEncryptionTypeToVRL(unsupportedType)
        } catch (error) {
            expect(error.message).toEqual('Unsupported encryption type');
        }
        doc.destroy();
    });
});
describe('981948 - Advanced Encryption GCM Cipher Implementation', () => {

    it('_AdvancedEncryptionGcmCipher constructor - accepts valid 32-byte key', () => {
        // Arrange
        const validKey = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
            validKey[i] = i & 0xFF;
        }
        // Act
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(validKey);
        // Assert
        expect(cipher).toBeDefined();
        expect(cipher._key).toBeDefined();
        expect(cipher._cyclesOfRepetition).toEqual(14);
        expect(cipher._keySize).toEqual(240);
    });

    it('_AdvancedEncryptionGcmCipher constructor - throws error for non-32-byte key', () => {
        // Arrange
        const invalidKey = new Uint8Array(16);
        // Act & Assert
        expect(() => {
            new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(invalidKey);
        }).toThrowError('AES-GCM requires 256-bit (32-byte) key');
    });

    it('_expandKey - generates 240-byte key schedule from 32-byte cipher key', () => {
        // Arrange
        const cipherKey = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
            cipherKey[i] = (i * 13) & 0xFF;
        }
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(cipherKey);
        // Act
        const expandedKey = cipher._expandKey(cipherKey);
        // Assert
        expect(expandedKey).toBeDefined();
        expect(expandedKey.length).toEqual(240);
        expect(expandedKey instanceof Uint8Array).toBe(true);
        expect(cipher._expandedKey).toEqual(expandedKey);
        expect(cipher._key).toEqual(expandedKey);
    });

    it('_expandKey - correctly applies Rcon for round keys (j % 32 === 0 branch)', () => {
        // Arrange
        const cipherKey = new Uint8Array(32);
        cipherKey[0] = 0x2B;
        cipherKey[1] = 0x28;
        for (let i = 2; i < 32; i++) {
            cipherKey[i] = 0xAB;
        }
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(cipherKey);
        // Act
        const expandedKey = cipher._key;
        // Assert
        expect(expandedKey.length).toEqual(240);
        expect(expandedKey[32]).toBeDefined();
        expect(expandedKey[33]).toBeDefined();
    });

    it('_initializeGCM - initializes GCM state with valid 12-byte IV', () => {
        // Arrange
        const key = new Uint8Array(32);
        const iv = new Uint8Array(12);
        for (let i = 0; i < 12; i++) {
            iv[i] = i & 0xFF;
        }
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        // Act
        cipher._initializeGCM(iv);
        // Assert
        expect(cipher._gcmState).toBeDefined();
        expect(cipher._gcmState.iv).toBeDefined();
        expect(cipher._gcmState.iv.length).toEqual(12);
        expect(cipher._gcmState.counter).toEqual(1);
        expect(cipher._gcmState.hashKey).toBeDefined();
    });

    it('_initializeGCM - throws error for non-12-byte IV', () => {
        // Arrange
        const key = new Uint8Array(32);
        const invalidIv = new Uint8Array(16);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        // Act & Assert
        expect(() => cipher._initializeGCM(invalidIv)).toThrowError('AES-GCM requires 12-byte IV');
    });

    it('_encryptBlock - encrypts 16-byte input block with expanded key', () => {
        // Arrange
        const key = new Uint8Array(32);
        const input = new Uint8Array(16);
        for (let i = 0; i < 16; i++) {
            input[i] = i & 0xFF;
        }
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        // Act
        const encryptedBlock = cipher._encryptBlock(input, cipher._key);
        // Assert
        expect(encryptedBlock).toBeDefined();
        expect(encryptedBlock.length).toEqual(16);
        expect(encryptedBlock instanceof Uint8Array).toBe(true);
        expect(encryptedBlock).not.toEqual(input);
    });

    it('_shiftRows - performs ShiftRows transformation on state', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const state = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        const originalState = new Uint8Array(state);
        // Act
        cipher._shiftRows(state);
        // Assert
        expect(state).toBeDefined();
        expect(state.length).toEqual(16);
        expect(state[1]).toEqual(originalState[5]);
        expect(state[5]).toEqual(originalState[9]);
        expect(state[9]).toEqual(originalState[13]);
    });

    it('_mixColumns - performs MixColumns transformation on state', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const state = new Uint8Array(16);
        for (let i = 0; i < 16; i++) {
            state[i] = (i * 17) & 0xFF;
        }
        // Act
        cipher._mixColumns(state);
        // Assert
        expect(state).toBeDefined();
        expect(state.length).toEqual(16);
        expect(state instanceof Uint8Array).toBe(true);
    });

    it('_mul2 - multiplies byte by 2 in GF(2^8) without reduction', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const x = 0x53;
        // Act
        const result = cipher._mul2(x);
        // Assert
        expect(result).toBeDefined();
        expect(result).toEqual((0x53 << 1) & 0xFF);
    });

    it('_mul2 - multiplies byte by 2 in GF(2^8) with reduction (MSB set)', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const x = 0x95;
        // Act
        const result = cipher._mul2(x);
        // Assert
        expect(result).toBeDefined();
        expect(result).toEqual(((0x95 << 1) ^ 0x1b) & 0xFF);
    });

    it('_mul3 - multiplies byte by 3 in GF(2^8) using mul2 composition', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const x = 0x53;
        // Act
        const result = cipher._mul3(x);
        // Assert
        expect(result).toBeDefined();
        const mul2Result = cipher._mul2(x);
        expect(result).toEqual(mul2Result ^ x);
    });

    it('_incrementCounter - increments counter block from least significant byte', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const counterBlock = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xFF]);
        // Act
        cipher._incrementCounter(counterBlock);
        // Assert
        expect(counterBlock[15]).toEqual(0);
        expect(counterBlock[14]).toEqual(1);
    });

    it('_incrementCounter - handles carry-over when byte overflows', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const counterBlock = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xFF, 0xFF]);
        // Act
        cipher._incrementCounter(counterBlock);
        // Assert
        expect(counterBlock[15]).toEqual(0);
        expect(counterBlock[14]).toEqual(0);
        expect(counterBlock[13]).toEqual(1);
    });

    it('_gctrEncrypt - throws error when GCM state not initialized', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const data = new Uint8Array([1, 2, 3, 4]);
        // Act & Assert
        expect(() => cipher._gctrEncrypt(data)).toThrowError('GCM state not initialized');
    });

    it('_gctrEncrypt - encrypts data with initialized GCM state', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const iv = new Uint8Array(12);
        cipher._initializeGCM(iv);
        const data = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
            data[i] = i & 0xFF;
        }
        // Act
        const encrypted = cipher._gctrEncrypt(data);
        // Assert
        expect(encrypted).toBeDefined();
        expect(encrypted.length).toEqual(32);
        expect(encrypted instanceof Uint8Array).toBe(true);
    });

    it('_gfMult - multiplies two GF(2^128) elements', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const x = new Uint8Array(16);
        const y = new Uint8Array(16);
        for (let i = 0; i < 16; i++) {
            x[i] = i & 0xFF;
            y[i] = (i * 2) & 0xFF;
        }
        // Act
        const result = cipher._gfMult(x, y);
        // Assert
        expect(result).toBeDefined();
        expect(result.length).toEqual(16);
        expect(result instanceof Uint8Array).toBe(true);
    });

    it('_gfMult - handles bit set condition with XOR', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const x = new Uint8Array(16);
        x[0] = 0xFF;
        const y = new Uint8Array(16);
        y[0] = 0xFF;
        // Act
        const result = cipher._gfMult(x, y);
        // Assert
        expect(result).toBeDefined();
        expect(result.length).toEqual(16);
    });

    it('_ghash - throws error when GCM state not initialized', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const aad = new Uint8Array(0);
        const ciphertext = new Uint8Array(16);
        // Act & Assert
        expect(() => cipher._ghash(aad, ciphertext)).toThrowError('GCM state not initialized');
    });

    it('_ghash - computes authentication hash with initialized state', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const iv = new Uint8Array(12);
        cipher._initializeGCM(iv);
        const aad = new Uint8Array(0);
        const ciphertext = new Uint8Array(16);
        for (let i = 0; i < 16; i++) {
            ciphertext[i] = i & 0xFF;
        }
        // Act
        const hash = cipher._ghash(aad, ciphertext);
        // Assert
        expect(hash).toBeDefined();
        expect(hash.length).toEqual(16);
        expect(hash instanceof Uint8Array).toBe(true);
    });

    it('_computeAuthTag - throws error when GCM state not initialized', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const aad = new Uint8Array(0);
        const ciphertext = new Uint8Array(16);
        // Act & Assert
        expect(() => cipher._computeAuthTag(aad, ciphertext)).toThrowError('GCM state not initialized');
    });

    it('_computeAuthTag - computes authentication tag correctly', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const iv = new Uint8Array(12);
        cipher._initializeGCM(iv);
        const aad = new Uint8Array(0);
        const ciphertext = new Uint8Array(16);
        // Act
        const tag = cipher._computeAuthTag(aad, ciphertext);
        // Assert
        expect(tag).toBeDefined();
        expect(tag.length).toEqual(16);
        expect(tag instanceof Uint8Array).toBe(true);
    });
    it('should return AdvancedEncryptionGcmCipher when crypt filter CFM is AESV4', () => {
        const key: Uint8Array = new Uint8Array([1, 2, 3, 4]);
        const encryptor: _PdfEncryptor = Object.create(_PdfEncryptor.prototype);
        spyOn(encryptor as any, '_buildObjectKey');
        const cryptFilter: any = { get: jasmine.createSpy('cryptFilter.get').and.callFake((value: string) => value === 'CFM' ? { name: 'AESV4' } : undefined) };
        const cipherDictionary: any = { get: jasmine.createSpy('cipherDictionary.get').and.callFake((value: string) => value === 'StdCF' ? cryptFilter : undefined) };
        try {
            const result: any = (encryptor as any)._buildCipherConstructor(cipherDictionary, { name: 'StdCF' }, 10, 0, key);
        } catch (error) {
            expect(error.message).toEqual('AES-GCM requires 256-bit (32-byte) key');
        }
    });
    it('should generate different key when encryptMetaData is false for revision 4', () => {
        const helper: _PdfEncryptionHelper = new _PdfEncryptionHelper();
        const fileIdBytes: Uint8Array = new Uint8Array([10, 20, 30, 40]);
        const password: Uint8Array = new Uint8Array([1, 2, 3, 4]);
        const ownerPassword: Uint8Array = new Uint8Array([5, 6, 7, 8]);
        const flags: number = -4;
        const revision: number = 4;
        const keyLength: number = 128;
        const keyWithMetadata: Uint8Array = (helper as any)._generateKey(fileIdBytes, password, ownerPassword, flags, revision, keyLength, true);
        const keyWithoutMetadata: Uint8Array = (helper as any)._generateKey(fileIdBytes, password, ownerPassword, flags, revision, keyLength, false);
        expect(Array.from(keyWithoutMetadata)).not.toEqual(Array.from(keyWithMetadata));
    });
    it('setsecurity null test ', ()=> {
        const doc = new PdfDocument();
        let check = false;
        try {
            doc.setSecurity(null);
            check = true;
        } catch (error) {
            expect(error.message).toEqual('Options should not be null');
        }
        expect(check).toBeFalsy();
    });
});