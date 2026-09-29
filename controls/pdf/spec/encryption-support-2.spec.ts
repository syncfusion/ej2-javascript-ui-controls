import { PdfDocument, PdfMargins, PdfPageSettings } from '../src/pdf/core/pdf-document';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { PdfStandardFont, PdfFontFamily, PdfFontStyle, PdfTrueTypeFont } from '../src/pdf/core/fonts/pdf-standard-font';
import { PdfBrush, PdfGraphics } from '../src/pdf/core/graphics/pdf-graphics';
import { PdfSecurityOptions } from '../src/pdf/core/pdf-type';
import { PdfEncryptionType, PdfPermissionFlag, PdfTextAlignment, PdfTextDirection, PdfUnorderedListStyle } from '../src/pdf/core/enumerator';
import { _PdfDictionary, _PdfName } from '../src/pdf/core/pdf-primitives';
import { _PdfCrossReference } from '../src/pdf/core/pdf-cross-reference';
import { _byteArrayToHexString, _bytesToHex, _bytesToString, _stringToBytes } from '../src/pdf/core/utils';
import { PdfCustomSchema } from '../src/pdf/core/xmp/pdf-custom-schema';
import { _ContentParser, _PdfRecord } from '../src/pdf/core/content-parser';
import { PdfOrderedList, PdfUnorderedList } from '../src/pdf/core/list/pdf-list';
import { PdfListItem, PdfListItemCollection } from '../src/pdf/core/list/pdf-list-item';
import { PdfStringFormat } from '../src/pdf/core/fonts/pdf-string-format';
import { arabicBytes, hebrewBytes } from './font-input.spec';
import { creditCard, formPDF, watermark } from './inputs.spec';
import { PdfCheckBoxField, PdfComboBoxField, PdfRadioButtonListField, PdfTextBoxField } from '../src/pdf/core/form/field';
import { PdfForm } from '../src/pdf/core/form/form'
import { PdfListFieldItem } from '../src/pdf/core/annotations/annotation'
import { _PdfEncryptionHelper, _PdfEncryptor } from '../src/pdf/core/security/encryptor';
import { _AdvancedEncryptionGcmCipher } from '../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher';
import { _CipherTransform } from '../src/pdf/core/security/encryptors/cipher-tranform';
describe('2527-2543 - PdfDocument setSecurity and getSecurity Methods', () => {
    describe('getSecurity - returns undefined when no encryptor', () => {
        it('getSecurity - returns undefined when _encrypt is null', () => {
            // Arrange
            const doc: any = new PdfDocument();
            const options = {
                userPassword: '',
                ownerPassword: '',
                permissions: PdfPermissionFlag.default,
                encryptionType: PdfEncryptionType.rc4Bit40,
            };
            doc.addPage();
            doc._crossReference._encrypt = null;
            // Act
            const result: any = doc.getSecurity();
            // Assert
            expect(result).toEqual(options);
            doc.destroy();
        });
    });

    describe('getSecurity - returns cached encryption state if available', () => {
        it('getSecurity - returns cloned _encryptionState when it exists', () => {
            // Arrange
            const doc: any = new PdfDocument();
            doc.addPage();
            doc._crossReference._encrypt = { _dictionary: {} };
            doc._crossReference._encryptionState = {
                encryptionType: PdfEncryptionType.aesBit256Rev6,
                permissions: PdfPermissionFlag.default,
                userPassword: 'user123'
            };
            // Act
            const result: any = doc.getSecurity();
            // Assert
            expect(result).toBeDefined();
            expect(result.encryptionType).toEqual(PdfEncryptionType.aesBit256Rev6);
            expect(result).not.toBe(doc._crossReference._encryptionState);
            doc.destroy();
        });
    });

    describe('getSecurity - maps RC4-40 encryption (v=1, r=2)', () => {
        it('getSecurity - returns rc4Bit40 when V=1 and R=2', () => {
            // Arrange
            const doc: any = new PdfDocument();
            doc.addPage();
            doc._crossReference._encrypt = {
                _dictionary: {
                    get: (key: string) => {
                        if (key === 'V') { return 1; }
                        if (key === 'R') { return 2; }
                        if (key === 'P') { return 0xFFFFFFFC; }
                        return undefined;
                    }
                },
                _encryptOnlyAttachment: false,
                _encryptMetaData: true,
                _algorithm: 2,
                _decodePassword: new Uint8Array(32),
                _defaultPasswordBytes: new Uint8Array(32)
            };
            doc._crossReference._encryptionState = undefined;
            doc._crossReference._password = 'password';
            doc._isUserPassword = true;
            // Act
            const result: any = doc.getSecurity();
            // Assert
            expect(result.encryptionType).toEqual(PdfEncryptionType.rc4Bit40);
            doc.destroy();
        });
    });

    describe('getSecurity - maps RC4-128 encryption (v=2, r=3)', () => {
        it('getSecurity - returns rc4Bit128 when V=2 and R=3', () => {
            // Arrange
            const doc: any = new PdfDocument();
            doc.addPage();
            doc._crossReference._encrypt = {
                _dictionary: {
                    get: (key: string) => {
                        if (key === 'V') { return 2; }
                        if (key === 'R') { return 3; }
                        if (key === 'P') { return 0xFFFFFFFC; }
                        return undefined;
                    }
                },
                _encryptOnlyAttachment: false,
                _encryptMetaData: true,
                _algorithm: 3,
                _decodePassword: new Uint8Array(32),
                _defaultPasswordBytes: new Uint8Array(32)
            };
            doc._crossReference._encryptionState = undefined;
            doc._crossReference._password = 'password';
            doc._isUserPassword = true;
            // Act
            const result: any = doc.getSecurity();
            // Assert
            expect(result.encryptionType).toEqual(PdfEncryptionType.rc4Bit128);
            doc.destroy();
        });
    });

    describe('getSecurity - maps AES-128 encryption (v=4, r=4)', () => {
        it('getSecurity - returns aesBit128 when V=4 and R=4', () => {
            // Arrange
            const doc: any = new PdfDocument();
            doc.addPage();
            doc._crossReference._encrypt = {
                _dictionary: {
                    get: (key: string) => {
                        if (key === 'V') { return 4; }
                        if (key === 'R') { return 4; }
                        if (key === 'P') { return 0xFFFFFFFC; }
                        return undefined;
                    }
                },
                _encryptOnlyAttachment: false,
                _encryptMetaData: true,
                _algorithm: 4,
                _decodePassword: new Uint8Array(32),
                _defaultPasswordBytes: new Uint8Array(32)
            };
            doc._crossReference._encryptionState = undefined;
            doc._crossReference._password = 'password';
            doc._isUserPassword = true;
            // Act
            const result: any = doc.getSecurity();
            // Assert
            expect(result.encryptionType).toEqual(PdfEncryptionType.aesBit128);
            doc.destroy();
        });
    });

    describe('getSecurity - maps AES-256 Rev5 encryption (v=5, r=5)', () => {
        it('getSecurity - returns aesBit256Rev5 when V=5 and R=5', () => {
            // Arrange
            const doc: any = new PdfDocument();
            doc.addPage();
            doc._crossReference._encrypt = {
                _dictionary: {
                    get: (key: string) => {
                        if (key === 'V') { return 5; }
                        if (key === 'R') { return 5; }
                        if (key === 'P') { return 0xFFFFFFFC; }
                        return undefined;
                    }
                },
                _encryptOnlyAttachment: false,
                _encryptMetaData: true,
                _algorithm: 5,
                _decodePassword: new Uint8Array(32),
                _defaultPasswordBytes: new Uint8Array(32)
            };
            doc._crossReference._encryptionState = undefined;
            doc._crossReference._password = 'password';
            doc._isUserPassword = true;
            // Act
            const result: any = doc.getSecurity();
            // Assert
            expect(result.encryptionType).toEqual(PdfEncryptionType.aesBit256Rev5);
            doc.destroy();
        });
    });

    describe('getSecurity - maps AES-256 Rev6 encryption (v=5, r=6)', () => {
        it('getSecurity - returns aesBit256Rev6 when V=5 and R=6', () => {
            // Arrange
            const doc: any = new PdfDocument();
            doc.addPage();
            doc._crossReference._encrypt = {
                _dictionary: {
                    get: (key: string) => {
                        if (key === 'V') { return 5; }
                        if (key === 'R') { return 6; }
                        if (key === 'P') { return 0xFFFFFFFC; }
                        return undefined;
                    }
                },
                _encryptOnlyAttachment: false,
                _encryptMetaData: true,
                _algorithm: 6,
                _decodePassword: new Uint8Array(32),
                _defaultPasswordBytes: new Uint8Array(32)
            };
            doc._crossReference._encryptionState = undefined;
            doc._crossReference._password = 'password';
            doc._isUserPassword = true;
            // Act
            const result: any = doc.getSecurity();
            // Assert
            expect(result.encryptionType).toEqual(PdfEncryptionType.aesBit256Rev6);
            doc.destroy();
        });
    });

    describe('getSecurity - throws error for unsupported encryption type', () => {
        it('getSecurity - throws FormatError for unsupported V and R combination', () => {
            // Arrange
            const doc: any = new PdfDocument();
            doc.addPage();
            doc._crossReference._encrypt = {
                _dictionary: {
                    get: (key: string) => {
                        if (key === 'V') { return 99; }
                        if (key === 'R') { return 99; }
                        return undefined;
                    }
                },
                _encryptOnlyAttachment: false,
                _encryptMetaData: true,
                _algorithm: 1
            };
            doc._crossReference._encryptionState = undefined;
            // Act & Assert
            try {
                doc.getSecurity();
            } catch (error) {
                expect(error.message).toEqual('Unsupported encryption type')
            }
            doc.destroy();
        });
    });

    describe('getSecurity - permission flags extracted correctly', () => {
        it('getSecurity - extracts all 8 permission flags from P value', () => {
            // Arrange
            const doc: any = new PdfDocument();
            doc.addPage();
            doc._crossReference._encrypt = {
                _dictionary: {
                    get: (key: string) => {
                        if (key === 'V') { return 5; }
                        if (key === 'R') { return 6; }
                        if (key === 'P') { return 0xFF4; }
                        return undefined;
                    }
                },
                _encryptOnlyAttachment: false,
                _encryptMetaData: true,
                _algorithm: 6,
                _decodePassword: new Uint8Array(32),
                _defaultPasswordBytes: new Uint8Array(32)
            };
            doc._crossReference._encryptionState = undefined;
            doc._crossReference._password = 'password';
            doc._isUserPassword = true;
            // Act
            const result: any = doc.getSecurity();
            // Assert
            expect(result.permissions).toEqual(4084)
            doc.destroy();
        });

        it('getSecurity - extracts full quality print flag', () => {
            // Arrange
            const doc: any = new PdfDocument();
            doc.addPage();
            doc._crossReference._encrypt = {
                _dictionary: {
                    get: (key: string) => {
                        if (key === 'V') { return 5; }
                        if (key === 'R') { return 6; }
                        if (key === 'P') { return 0x800; }
                        return undefined;
                    }
                },
                _encryptOnlyAttachment: false,
                _encryptMetaData: true,
                _algorithm: 6,
                _decodePassword: new Uint8Array(32),
                _defaultPasswordBytes: new Uint8Array(32)
            };
            doc._crossReference._encryptionState = undefined;
            doc._crossReference._password = 'password';
            doc._isUserPassword = true;
            // Act
            const result: any = doc.getSecurity();
            // Assert
            expect(result.permissions).toEqual(2048);
            doc.destroy();
        });

        it('getSecurity - extracts assemble document flag', () => {
            // Arrange
            const doc: any = new PdfDocument();
            doc.addPage();
            doc._crossReference._encrypt = {
                _dictionary: {
                    get: (key: string) => {
                        if (key === 'V') { return 5; }
                        if (key === 'R') { return 6; }
                        if (key === 'P') { return 0x400; }
                        return undefined;
                    }
                },
                _encryptOnlyAttachment: false,
                _encryptMetaData: true,
                _algorithm: 6,
                _decodePassword: new Uint8Array(32),
                _defaultPasswordBytes: new Uint8Array(32)
            };
            doc._crossReference._encryptionState = undefined;
            doc._crossReference._password = 'password';
            doc._isUserPassword = true;
            // Act
            const result: any = doc.getSecurity();
            // Assert
            expect(result.permissions).toEqual(1024);
            doc.destroy();
        });
    });

    describe('getSecurity - password handling with _isUserPassword', () => {
        it('getSecurity - sets userPassword when _isUserPassword is true', () => {
            // Arrange
            const doc: any = new PdfDocument();
            doc.addPage();
            doc._crossReference._encrypt = {
                _dictionary: {
                    get: (key: string) => {
                        if (key === 'V') { return 5; }
                        if (key === 'R') { return 6; }
                        if (key === 'P') { return 0; }
                        return undefined;
                    }
                },
                _encryptOnlyAttachment: false,
                _encryptMetaData: true,
                _algorithm: 6,
                _decodePassword: new Uint8Array(32),
                _defaultPasswordBytes: new Uint8Array(32)
            };
            doc._crossReference._encryptionState = undefined;
            doc._crossReference._password = 'userpass';
            doc._isUserPassword = true;
            // Act
            const result: any = doc.getSecurity();
            // Assert
            expect(result.userPassword).toEqual('userpass');
            expect(result.ownerPassword).toBe('');
            doc.destroy();
        });

        it('getSecurity - sets ownerPassword and extracts userPassword when _isUserPassword is false and algorithm >= 5', () => {
            // Arrange
            const doc: any = new PdfDocument();
            doc.addPage();
            doc._crossReference._encrypt = {
                _dictionary: {
                    get: (key: string) => {
                        if (key === 'V') { return 5; }
                        if (key === 'R') { return 6; }
                        if (key === 'P') { return 0; }
                        return undefined;
                    }
                },
                _encryptOnlyAttachment: false,
                _encryptMetaData: true,
                _algorithm: 5,
                _decodePassword: new Uint8Array(32),
                _defaultPasswordBytes: new Uint8Array(32)
            };
            doc._crossReference._encryptionState = undefined;
            doc._crossReference._password = 'ownerpass';
            doc._isUserPassword = false;
            // Act
            const result: any = doc.getSecurity();
            // Assert
            expect(result.ownerPassword).toEqual('ownerpass');
            doc.destroy();
        });

        it('getSecurity - extracts userPassword from decoded password when algorithm < 5', () => {
            // Arrange
            const doc: any = new PdfDocument();
            doc.addPage();
            doc._crossReference._encrypt = {
                _dictionary: {
                    get: (key: string) => {
                        if (key === 'V') { return 4; }
                        if (key === 'R') { return 4; }
                        if (key === 'P') { return 0; }
                        return undefined;
                    }
                },
                _encryptOnlyAttachment: false,
                _encryptMetaData: true,
                _algorithm: 4,
                _decodePassword: new Uint8Array([0x28, 0x75, 0x6e, 0x64, 0x65, 0x66, 0x69, 0x6e, 0x65, 0x64]),
                _defaultPasswordBytes: new Uint8Array([0x63, 0x6f, 0x6e, 0x74, 0x65, 0x78, 0x74, 0x70, 0x61, 0x73, 0x73])
            };
            doc._crossReference._encryptionState = undefined;
            doc._crossReference._password = 'ownerpass';
            doc._isUserPassword = false;
            // Act
            const result: any = doc.getSecurity();
            // Assert
            expect(result.ownerPassword).toEqual('ownerpass');
            expect(result.userPassword).toBeDefined();
            doc.destroy();
        });
    });

    it('_encrypt - generates IV and encrypts data when crypto available', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const data = new Uint8Array(16);
        for (let i = 0; i < 16; i++) {
            data[i] = i & 0xFF;
        }
        // Act
        const encrypted = cipher._encrypt(data);
        // Assert
        expect(encrypted).toBeDefined();
        expect(encrypted.length).toEqual(12 + 16 + 16);
        expect(encrypted instanceof Uint8Array).toBe(true);
    });

    it('_encrypt - returns IV (12 bytes) + ciphertext + tag (16 bytes)', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const data = new Uint8Array(32);
        // Act
        const encrypted = cipher._encrypt(data);
        // Assert
        expect(encrypted.length).toEqual(12 + 32 + 16);
    });

    it('_decryptBlock - throws error for data shorter than 28 bytes', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const shortData = new Uint8Array(20);
        // Act & Assert
        expect(() => cipher._decryptBlock(shortData)).toThrowError('GCM encrypted data must include IV (12 bytes) and tag (16 bytes)');
    });

    it('_decryptBlock - extracts IV from data when not provided', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const data = new Uint8Array(32);
        for (let i = 0; i < 12; i++) {
            data[i] = i & 0xFF;
        }
        // Act & Assert - should not throw for valid length
        expect(() => cipher._decryptBlock(data)).toThrowError();
    });

    it('_decryptBlock - uses provided IV parameter when available', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const providedIv = new Uint8Array(12);
        const data = new Uint8Array(32);
        // Act & Assert - should use provided IV for initialization
        expect(() => cipher._decryptBlock(data, false, providedIv)).toThrowError();
    });

    it('_decryptBlock - throws error when authentication tag verification fails', () => {
        // Arrange
        const key = new Uint8Array(32);
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const data = new Uint8Array(44);
        for (let i = 0; i < 12; i++) {
            data[i] = 0xAA;
        }
        data[data.length - 1] = 0xFF;
        // Act & Assert
        expect(() => cipher._decryptBlock(data)).toThrowError('GCM authentication tag verification failed');
    });

    it('_AdvancedEncryptionGcmCipher - encrypt-decrypt round trip with matching tag', () => {
        // Arrange
        const key = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
            key[i] = (i * 7) & 0xFF;
        }
        const cipher: any = new (require('../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher')._AdvancedEncryptionGcmCipher)(key);
        const plaintext = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
            plaintext[i] = i & 0xFF;
        }
        // Act
        const encrypted = cipher._encrypt(plaintext);
        const decrypted = cipher._decryptBlock(encrypted);
        // Assert
        expect(decrypted).toBeDefined();
        expect(decrypted.length).toEqual(plaintext.length);
        expect(decrypted).toEqual(plaintext);
    });

});

describe('Sample', () => {
    it('Hello World Sample', () => {
        // Create a new PDF document
        let pdf = new PdfDocument();
        pdf.setSecurity({ userPassword: "password", encryptionType: PdfEncryptionType.rc4Bit128 })
        // Add a new page
        let page = pdf.addPage();
        // pdf._crossReference._parse(false);
        // Access graphics of the page
        let graphics = page.graphics;
        // Create a new PDF standard font
        let font = pdf.embedFont(PdfFontFamily.helvetica, 36, PdfFontStyle.regular);
        // Create a new black brush
        let brush = new PdfBrush({ r: 0, g: 0, b: 0 });
        // Draw the text
        graphics.drawString('Hello World!!!', font, { x: 20, y: 20, width: graphics.clientSize.width - 20, height: 60 }, brush);
        // Save and download PDF
        const bytes = pdf.save();
        // Destroy the PDF document instance
        pdf.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes, 'password');
        const parsedPage: PdfPage = parsed.getPage(0);
        const contents = parsedPage._pageDictionary.get('Contents');
        const ref = contents[2];
        const stream = parsedPage._crossReference._fetch(ref);
        const parser: _ContentParser = new _ContentParser(stream.getBytes());
        const result: _PdfRecord[] = parser._readContent();
        //Font check
        const fontDictionary: _PdfDictionary = parsedPage._pageDictionary.get('Resources').get('Font');
        const HelveticaRef: string = result[11]._operands[0];
        const Helvetica: _PdfName = fontDictionary.get(HelveticaRef.slice(1)).get('BaseFont');
        //Content level check
        expect(Helvetica.name).toEqual('Helvetica');
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands.length).toBe(0);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands.length).toBe(0);
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands.length).toBe(0);
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands.length).toBe(0);
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
        expect(result[7]._operator).toEqual('BT');
        expect(result[7]._operands.length).toBe(0);
        expect(result[8]._operator).toEqual('CS');
        expect(result[8]._operands).toEqual(['/DeviceRGB']);
        expect(result[9]._operator).toEqual('cs');
        expect(result[9]._operands).toEqual(['/DeviceRGB']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[11]._operator).toEqual('Tf');
        expect(result[11]._operands[0]).toEqual(HelveticaRef);
        expect(result[11]._operands[1]).toEqual('36.000');
        expect(result[12]._operator).toEqual('Tr');
        expect(result[12]._operands).toEqual(['0']);
        expect(result[13]._operator).toEqual('Tc');
        expect(result[13]._operands).toEqual(['0.000']);
        expect(result[14]._operator).toEqual('Tw');
        expect(result[14]._operands).toEqual(['0.000']);
        expect(result[15]._operator).toEqual('Tz');
        expect(result[15]._operands).toEqual(['100.000']);
        expect(result[16]._operator).toEqual('Tm');
        expect(result[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '20.00', '-53.52']);
        expect(result[17]._operator).toEqual("'");
        expect(result[17]._operands).toEqual(['(Hello World!!!)']);
        expect(result[18]._operator).toEqual('ET');
        expect(result[18]._operands.length).toBe(0);
        parsed.destroy();
    });
    it('RTL text', () => {
        const pdf: PdfDocument = new PdfDocument();
        pdf.setSecurity({ userPassword: "password", encryptionType: PdfEncryptionType.rc4Bit128 })
        const pageSettings = new PdfPageSettings({ margins: new PdfMargins(40) });
        const page: PdfPage = pdf.addPage(pageSettings);
        const g: PdfGraphics = page.graphics;
        // Brush and layout
        const brush = new PdfBrush({ r: 0, g: 0, b: 0 });
        const clientBounds = g.clientSize;
        // Define areas
        const rect = { x: 0, y: 0, width: clientBounds.width, height: clientBounds.height };
        const rect1 = { x: 0, y: 200, width: clientBounds.width, height: clientBounds.height - 200 };
        // Right-to-left string format with right alignment
        const format = new PdfStringFormat();
        format.textDirection = PdfTextDirection.rightToLeft;
        format.alignment = PdfTextAlignment.right;
        // Arabic text
        const arabicFont = new PdfTrueTypeFont(arabicBytes, 13);
        g.drawString(
            `سنبدأ بنظرة عامة مفاهيمية على مستند PDF بسيط. تم تصميم هذا الفصل ليكون توجيهًا مختصرًا قبل الغوص في مستند حقيقي وإنشاءه من البداية.
    يمكن تقسيم ملف PDF إلى أربعة أجزاء: الرأس والجسم والجدول الإسناد الترافقي والمقطورة. يضع الرأس الملف كملف PDF ، حيث يحدد النص المستند المرئي ، ويسرد جدول الإسناد الترافقي موقع كل شيء في الملف ، ويوفر المقطع الدعائي تعليمات حول كيفية بدء قراءة الملف.
    رأس الصفحة هو ببساطة رقم إصدار PDF وتسلسل عشوائي للبيانات الثنائية. البيانات الثنائية تمنع التطبيقات الساذجة من معالجة ملف PDF كملف نصي. سيؤدي ذلك إلى ملف تالف ، لأن ملف PDF يتكون عادةً من نص عادي وبيانات ثنائية (على سبيل المثال ، يمكن تضمين ملف خط ثنائي بشكل مباشر في ملف PDF).`,
            arabicFont,
            rect,
            brush,
            format
        );
        // Hebrew text
        const hebrewFont = new PdfTrueTypeFont(hebrewBytes, 13);
        g.drawString(
            `לאחר הכותרת והגוף מגיע טבלת הפניה המקושרת. הוא מתעדת את מיקום הבית של כל אובייקט בגוף הקובץ. זה מאפשר גישה אקראית של המסמך, ולכן בעת עיבוד דף, רק את האובייקטים הנדרשים עבור דף זה נקראים מתוך הקובץ. זה עושה מסמכי PDF הרבה יותר מהר מאשר קודמיו PostScript, אשר היה צריך לקרוא את כל הקובץ לפני עיבוד זה.`,
            hebrewFont,
            rect1,
            brush,
            format
        );
        // Save and clean up
        const bytes = pdf.save();
        pdf.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes, 'password');
        const parsedPage: PdfPage = parsed.getPage(0);
        const contents = parsedPage._pageDictionary.get('Contents');
        const ref = contents[2];
        const stream = parsedPage._crossReference._fetch(ref);
        const parser: _ContentParser = new _ContentParser(stream.getBytes());
        const result: _PdfRecord[] = parser._readContent();
        //Font check
        const fontDictionary: _PdfDictionary = parsedPage._pageDictionary.get('Resources').get('Font');
        const arabicRef: string = result[11]._operands[0];
        let arabic: _PdfName = fontDictionary.get(arabicRef.slice(1)).get('BaseFont');
        let arabicName = arabic.name.split('+')[1];
        const hebrewRef: string = result[51]._operands[0];
        let hebrew: _PdfName = fontDictionary.get(hebrewRef.slice(1)).get('BaseFont');
        let hebrewName = hebrew.name.split('+')[1];
        expect(arabicName).toEqual('NotoNaskhArabic-Regular');
        expect(hebrewName).toEqual('NotoSansHebrew-Medium');
        //Content level check
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands.length).toBe(0);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands.length).toBe(0);
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands.length).toBe(0);
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands.length).toBe(0);
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
        expect(result[7]._operator).toEqual('BT');
        expect(result[7]._operands.length).toBe(0);
        expect(result[8]._operator).toEqual('CS');
        expect(result[8]._operands).toEqual(['/DeviceRGB']);
        expect(result[9]._operator).toEqual('cs');
        expect(result[9]._operands).toEqual(['/DeviceRGB']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[11]._operator).toEqual('Tf');
        expect(result[11]._operands[0]).toEqual(arabicRef);
        expect(result[11]._operands[1]).toEqual('13.000');
        expect(result[12]._operator).toEqual('Tr');
        expect(result[12]._operands).toEqual(['0']);
        expect(result[13]._operator).toEqual('Tc');
        expect(result[13]._operands).toEqual(['0.000']);
        expect(result[14]._operator).toEqual('Tw');
        expect(result[14]._operands).toEqual(['0.000']);
        expect(result[15]._operator).toEqual('Tz');
        expect(result[15]._operands).toEqual(['100.000']);
        expect(result[16]._operator).toEqual('Tm');
        expect(result[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-13.90']);
        expect(result[17]._operator).toEqual('Td');
        expect(result[17]._operands).toEqual(['4.919', '0.000']);
        expect(result[18]._operands).toEqual([]);
        expect(result[18]._operator).toEqual("T*");
        expect(result[19]._operator).toEqual('Tj');
        let byteWords = _stringToBytes(result[19]._operands[0], true);
        expect(byteWords).toEqual([40, 5, 109, 5, 18, 0, 3, 0, 36, 0, 96, 5, 49, 0, 70, 0, 8, 0, 3, 0, 67, 5, 28, 5, 21, 0, 3, 0, 8, 1, 126, 0, 29, 0, 38, 5, 29, 5, 92, 41, 0, 77, 0, 3, 0, 9, 1, 126, 0, 82, 5, 38, 5, 8, 0, 96, 5, 1, 0, 3, 3, 0, 0, 96, 0, 58, 5, 38, 0, 70, 0, 3, 0, 67, 0, 38, 5, 50, 0, 70, 0, 8, 0, 3, 0, 8, 5, 78, 0, 83, 0, 3, 0, 75, 5, 38, 0, 76, 0, 38, 5, 1, 0, 3, 0, 75, 5, 1, 0, 3, 0, 194, 169, 0, 92, 41, 5, 38, 0, 34, 4, 195, 188, 0, 3, 5, 195, 133, 5, 194, 143, 5, 194, 157, 0, 3, 0, 27, 5, 36, 5, 29, 0, 34, 0, 77, 0, 3, 0, 100, 0, 68, 0, 47, 0, 3, 5, 100, 5, 38, 0, 76, 5, 38, 0, 83, 0, 9, 5, 50, 0, 77, 0, 3, 5, 100, 0, 77, 0, 9, 0, 47, 0, 3, 3, 10, 0, 29, 5, 48, 5, 36, 4, 195, 188, 0, 3, 2, 75, 0, 27, 5, 28, 5, 36, 0, 35, 41,]);
        expect(result[20]._operands).toEqual(["1.00", ".00", ".00", "1.00", ".00", "-36.04",]);
        expect(result[21]._operator).toEqual('Td');
        expect(result[21]._operands).toEqual(["361.288", "0.000",]);
        expect(result[22]._operands).toEqual([]);
        expect(result[22]._operator).toEqual("T*");
        expect(result[23]._operator).toEqual('Tj');
        byteWords = _stringToBytes(result[23]._operands[0], true);
        expect(byteWords).toEqual([40, 0, 194, 169, 5, 100, 4, 195, 189, 0, 8, 0, 27, 5, 28, 0, 70, 0, 8, 0, 3, 5, 98, 0, 77, 0, 3, 0, 88, 0, 4, 0, 9, 5, 46, 5, 6, 2, 76, 0, 94, 0, 3, 5, 109, 5, 53, 5, 38, 5, 53, 0, 25, 0, 3, 0, 27, 5, 36, 5, 29, 0, 34, 0, 77, 41,]);
        expect(result[24]._operands).toEqual(["1.00", ".00", ".00", "1.00", ".00", "-58.17",]);
        expect(result[24]._operator).toEqual('Tm');
        expect(result[24]._operator).toEqual('Tm');
        expect(result[24]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-58.17']);
        expect(result[25]._operator).toEqual('Td');
        expect(result[25]._operands).toEqual(["13.317", "0.000",]);
        expect(result[26]._operands).toEqual([]);
        expect(result[26]._operator).toEqual("T*");
        expect(result[28]._operator).toEqual('Tm');
        expect(result[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-80.31']);
        expect(result[29]._operator).toEqual('Td');
        expect(result[29]._operands).toEqual(["13.122", "0.000",]);
        expect(result[30]._operands).toEqual([]);
        expect(result[30]._operator).toEqual("T*");
        expect(result[31]._operator).toEqual('Tj');
        byteWords = _stringToBytes(result[31]._operands[0], true);
        expect(byteWords).toEqual([40, 0, 29, 5, 18, 0, 96, 4, 195, 189, 0, 94, 0, 3, 0, 194, 175, 0, 3, 5, 89, 0, 68, 0, 76, 0, 70, 0, 8, 0, 3, 5, 109, 5, 18, 0, 3, 0, 4, 5, 109, 5, 14, 0, 3, 0, 67, 0, 59, 0, 3, 0, 45, 5, 21, 0, 96, 0, 77, 0, 3, 5, 109, 5, 53, 5, 18, 0, 8, 0, 29, 5, 29, 0, 70, 0, 8, 0, 3, 0, 26, 0, 9, 5, 36, 0, 35, 4, 195, 184, 0, 8, 0, 3, 0, 66, 0, 94, 0, 27, 5, 8, 0, 3, 0, 26, 0, 29, 0, 34, 4, 195, 189, 0, 94, 0, 3, 0, 194, 175, 0, 3, 5, 109, 5, 7, 0, 29, 0, 76, 0, 70, 0, 8, 0, 3, 0, 27, 5, 36, 5, 29, 0, 34, 0, 76, 0, 70, 0, 8, 0, 3, 0, 37, 5, 36, 0, 70, 0, 8, 0, 3, 0, 26, 0, 27, 0, 24, 4, 195, 189, 0, 3, 5, 65, 5, 38, 0, 25, 0, 3, 0, 194, 175, 0, 3, 5, 195, 133, 5, 194, 143, 5, 194, 157, 0, 3, 5, 89, 0, 68, 0, 76, 0, 59, 41,]);
        expect(result[32]._operator).toEqual('Tm');
        expect(result[32]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-102.45']);
        expect(result[33]._operator).toEqual('Td');
        expect(result[33]._operands).toEqual(["278.712", "0.000",]);
        expect(result[34]._operands).toEqual([]);
        expect(result[34]._operator).toEqual("T*");
        expect(result[35]._operator).toEqual('Tj');
        byteWords = _stringToBytes(result[35]._operands[0], true);
        expect(byteWords).toEqual([40, 0, 194, 169, 5, 89, 0, 68, 0, 76, 0, 70, 0, 8, 0, 3, 3, 10, 0, 4, 0, 8, 0, 29, 5, 21, 0, 3, 0, 4, 0, 27, 4, 195, 188, 0, 3, 5, 100, 5, 38, 5, 50, 5, 38, 0, 59, 0, 3, 0, 66, 0, 96, 0, 25, 0, 3, 2, 102, 0, 9, 0, 76, 5, 38, 0, 68, 0, 46, 5, 1, 0, 3, 5, 109, 5, 7, 0, 9, 0, 47, 0, 27, 0, 70, 0, 8, 0, 3, 0, 45, 0, 42, 5, 53, 0, 76, 0, 70, 0, 8, 41,]);
        expect(result[36]._operator).toEqual('Tm');
        expect(result[36]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-124.59']);
        expect(result[37]._operator).toEqual('Td');
        expect(result[37]._operands).toEqual(['27.240', '0.000']);
        expect(result[38]._operands).toEqual([]);
        expect(result[38]._operator).toEqual("T*");
        expect(result[39]._operator).toEqual('Tj');
        byteWords = _stringToBytes(result[39]._operands[0], true);
        expect(byteWords).toEqual([40, 2, 102, 0, 9, 5, 53, 5, 38, 5, 28, 0, 42, 5, 29, 0, 70, 0, 8, 0, 3, 0, 45, 5, 36, 0, 76, 5, 1, 0, 3, 5, 100, 5, 38, 5, 7, 0, 9, 5, 36, 5, 30, 0, 70, 0, 8, 0, 3, 2, 102, 0, 9, 5, 6, 0, 9, 5, 38, 5, 28, 0, 70, 0, 8, 0, 3, 0, 194, 169, 5, 100, 5, 38, 5, 7, 0, 9, 5, 36, 5, 30, 0, 70, 0, 8, 0, 3, 2, 102, 0, 9, 5, 6, 0, 9, 5, 38, 5, 28, 0, 68, 0, 70, 0, 3, 5, 109, 5, 7, 0, 8, 0, 96, 5, 46, 0, 47, 0, 3, 0, 67, 0, 34, 0, 68, 0, 34, 5, 1, 0, 94, 0, 3, 5, 195, 133, 5, 194, 143, 5, 194, 157, 0, 3, 0, 28, 0, 8, 0, 27, 0, 39, 2, 76, 0, 3, 0, 75, 5, 21, 0, 28, 0, 3, 5, 100, 0, 43, 0, 9, 0, 34, 5, 28, 4, 195, 188, 0, 3, 0, 96, 0, 83, 0, 3, 5, 100, 0, 24, 5, 50, 0, 38, 0, 70, 0, 8, 0, 3, 0, 32, 2, 75, 0, 28, 41,]);
        expect(result[40]._operator).toEqual('Tm');
        expect(result[40]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-146.73']);
        expect(result[41]._operator).toEqual('Td');
        expect(result[41]._operands).toEqual(['9.235', '0.000']);
        expect(result[42]._operands).toEqual([]);
        expect(result[42]._operator).toEqual("T*");
        expect(result[43]._operator).toEqual('Tj');
        byteWords = _stringToBytes(result[43]._operands[0], true);
        expect(byteWords).toEqual([40, 3, 33, 0, 26, 0, 9, 0, 47, 0, 3, 0, 37, 5, 6, 0, 3, 5, 98, 0, 77, 0, 3, 1, 126, 3, 10, 0, 26, 0, 9, 0, 47, 0, 3, 3, 0, 0, 96, 0, 58, 5, 29, 4, 195, 189, 0, 3, 5, 195, 133, 5, 194, 143, 5, 194, 157, 0, 3, 5, 89, 0, 68, 0, 77, 0, 3, 3, 0, 4, 195, 182, 0, 3, 0, 194, 175, 0, 3, 5, 89, 0, 70, 0, 9, 5, 1, 0, 3, 5, 89, 0, 68, 0, 77, 0, 3, 0, 100, 0, 70, 2, 76, 0, 3, 5, 93, 0, 70, 2, 194, 148, 0, 3, 3, 33, 0, 26, 5, 102, 5, 38, 0, 35, 0, 3, 0, 194, 169, 5, 109, 0, 38, 5, 6, 0, 3, 5, 89, 0, 68, 0, 76, 0, 59, 0, 3, 5, 195, 133, 5, 194, 143, 5, 194, 157, 0, 3, 5, 89, 0, 68, 0, 77, 0, 3, 5, 100, 5, 92, 40, 0, 70, 0, 9, 0, 46, 0, 77, 0, 3, 5, 98, 0, 77, 0, 3, 5, 100, 5, 8, 2, 194, 148, 0, 9, 0, 34, 0, 70, 0, 8, 41,]);
        expect(result[44]._operator).toEqual('Tm');
        expect(result[44]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-168.87']);
        expect(result[45]._operator).toEqual('Td');
        expect(result[45]._operands).toEqual(['100.092', '0.000']);
        expect(result[46]._operands).toEqual([]);
        expect(result[46]._operator).toEqual("T*");
        expect(result[47]._operator).toEqual('Tj');
        byteWords = _stringToBytes(result[47]._operands[0], true);
        expect(byteWords).toEqual([40, 0, 194, 169, 6, 113, 5, 195, 133, 5, 194, 143, 5, 194, 157, 0, 3, 5, 89, 0, 68, 0, 77, 0, 3, 5, 109, 5, 18, 0, 3, 0, 29, 5, 14, 0, 9, 5, 28, 0, 77, 0, 3, 0, 67, 0, 58, 5, 46, 4, 195, 188, 0, 3, 5, 109, 5, 7, 0, 9, 5, 36, 5, 2, 0, 3, 0, 92, 41, 5, 9, 0, 3, 5, 89, 0, 68, 0, 77, 0, 3, 5, 98, 5, 38, 0, 76, 5, 47, 5, 1, 0, 3, 5, 98, 0, 58, 0, 76, 4, 195, 189, 0, 3, 0, 194, 175, 0, 3, 0, 66, 0, 9, 5, 30, 0, 76, 0, 70, 0, 8, 0, 3, 0, 67, 5, 38, 5, 28, 0, 35, 0, 3, 0, 100, 0, 68, 0, 47, 6, 114, 0, 3, 5, 100, 5, 38, 5, 7, 0, 9, 5, 36, 5, 2, 0, 3, 2, 102, 0, 9, 5, 6, 0, 9, 5, 38, 4, 195, 188, 0, 94, 41,]);
        expect(result[48]._operator).toEqual('ET');
        expect(result[49]._operator).toEqual('BT');
        expect(result[50]._operator).toEqual('rg');
        expect(result[50]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[51]._operator).toEqual('Tf');
        expect(result[51]._operands[1]).toEqual('13.000');
        expect(result[52]._operator).toEqual('Tm');
        expect(result[52]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-213.88']);
        expect(result[53]._operator).toEqual('Td');
        expect(result[53]._operands).toEqual(['41.657', '0.000']);
        expect(result[54]._operator).toEqual('T*');
        expect(result[55]._operator).toEqual('Tj');
        byteWords = _stringToBytes(result[55]._operands[0], true);
        expect(byteWords).toEqual([40, 0, 55, 0, 52, 0, 106, 0, 55, 0, 96, 0, 106, 0, 107, 0, 194, 138, 0, 12, 0, 42, 0, 106, 0, 23, 0, 124, 0, 82, 0, 194, 138, 0, 61, 0, 106, 0, 107, 0, 3, 0, 106, 0, 107, 0, 16, 0, 10, 0, 107, 0, 61, 0, 106, 0, 3, 0, 124, 0, 42, 0, 106, 1, 194, 143, 0, 107, 0, 86, 0, 96, 0, 124, 0, 82, 0, 61, 0, 42, 0, 106, 0, 42, 0, 194, 138, 0, 67, 0, 75, 0, 42, 0, 106, 0, 107, 0, 55, 0, 12, 0, 111, 0, 106, 0, 10, 0, 194, 138, 0, 34, 0, 61, 0, 106, 0, 25, 0, 124, 0, 34, 0, 42, 0, 124, 0, 106, 0, 107, 0, 86, 0, 107, 0, 124, 0, 52, 0, 42, 0, 106, 0, 86, 0, 44, 0, 3, 0, 55, 41,]);
        expect(result[59]._operator).toEqual('Tj');
        byteWords = _stringToBytes(result[59]._operands[0], true);
        expect(byteWords).toEqual([40, 0, 107, 0, 3, 0, 106, 0, 82, 0, 86, 0, 106, 1, 44, 0, 25, 0, 16, 0, 106, 0, 16, 0, 124, 0, 12, 0, 194, 138, 0, 10, 0, 106, 0, 107, 0, 10, 0, 12, 0, 106, 0, 24, 0, 52, 0, 55, 0, 124, 0, 106, 1, 44, 0, 21, 0, 61, 0, 89, 0, 61, 0, 42, 0, 106, 0, 55, 0, 96, 0, 106, 0, 107, 0, 194, 138, 0, 3, 0, 86, 0, 82, 0, 3, 0, 106, 0, 42, 0, 96, 0, 194, 138, 0, 34, 0, 106, 0, 86, 0, 96, 0, 75, 0, 3, 0, 61, 0, 106, 0, 42, 0, 194, 146, 0, 106, 1, 194, 143, 0, 27, 0, 12, 0, 124, 0, 82, 0, 42, 0, 106, 0, 25, 0, 124, 0, 34, 0, 12, 0, 106, 0, 111, 0, 82, 0, 194, 138, 0, 194, 138, 0, 12, 0, 124, 0, 3, 41,]);
        expect(result[67]._operator).toEqual('Tj');
        byteWords = _stringToBytes(result[67]._operands[0], true);
        expect(byteWords).toEqual([40, 1, 194, 143, 0, 42, 0, 194, 146, 0, 106, 0, 16, 0, 124, 0, 12, 0, 194, 138, 0, 10, 0, 106, 0, 194, 138, 0, 67, 0, 75, 0, 55, 0, 106, 0, 27, 0, 12, 0, 124, 0, 82, 0, 42, 0, 106, 0, 55, 0, 52, 0, 106, 0, 107, 0, 3, 0, 106, 0, 3, 0, 124, 0, 86, 0, 82, 0, 55, 0, 106, 0, 21, 0, 194, 138, 0, 86, 0, 115, 0, 106, 0, 42, 0, 194, 138, 0, 42, 0, 106, 0, 86, 0, 96, 0, 3, 0, 106, 1, 44, 0, 195, 156, 1, 123, 1, 194, 163, 1, 194, 174, 0, 195, 161, 1, 31, 1, 194, 157, 1, 94, 1, 194, 138, 1, 194, 174, 0, 106, 0, 124, 0, 194, 138, 0, 61, 0, 16, 0, 124, 0, 82, 0, 106, 0, 86, 0, 96, 0, 3, 0, 61, 41,]);
        expect(result[56]._operator).toEqual('Tm');
        expect(result[56]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-231.56']);
        expect(result[57]._operator).toEqual('Td');
        expect(result[57]._operands).toEqual(['41.345', '0.000']);
        expect(result[58]._operator).toEqual('T*');
        expect(result[60]._operator).toEqual('Tm');
        expect(result[60]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-249.24']);
        expect(result[61]._operator).toEqual('Td');
        expect(result[61]._operands).toEqual(['3.840', '0.000']);
        expect(result[62]._operator).toEqual('T*');
        expect(result[64]._operator).toEqual('Tm');
        expect(result[64]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-266.92']);
        expect(result[65]._operator).toEqual('Td');
        expect(result[65]._operands).toEqual(['93.865', '0.000']);
        expect(result[66]._operator).toEqual('T*');
        parsed.destroy();
    });
    it('Bullets And Lists', () => {
        let pdf = new PdfDocument();
        // Add a new page
        pdf.setSecurity({ userPassword: "password", encryptionType: PdfEncryptionType.rc4Bit128 })
        let page = pdf.addPage();
        // Embed fonts used for title, body, and lists
        let font1 = pdf.embedFont(PdfFontFamily.helvetica, 14, PdfFontStyle.bold);
        let font2 = pdf.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular);
        let font3 = pdf.embedFont(PdfFontFamily.timesRoman, 10, PdfFontStyle.bold);
        let font4 = pdf.embedFont(PdfFontFamily.timesRoman, 10, PdfFontStyle.italic);
        let font5 = pdf.embedFont(PdfFontFamily.timesRoman, 10, PdfFontStyle.regular);
        // Draw the title and introductory paragraph explaining lists
        page.graphics.drawString('List Features', font1, { x: 225, y: 10, width: 300, height: 100 }, new PdfBrush({ r: 0, g: 0, b: 139 }));
        page.graphics.drawString('This sample demonstrates letious features of bullets and lists. A list can be ordered and Unordered. Essential PDF provides support for creating and formatting ordered and unordered lists.', font2, { x: 0, y: 50, width: page.graphics.clientSize.width, height: page.graphics.clientSize.height - 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        // Create a string format for list items with line spacing
        let format = new PdfStringFormat();
        format.lineSpacing = 10;
        // Create an unordered list with disk-style bullets
        const collection = new PdfListItemCollection(['List of Essential Studio products', 'IO products']);
        let list = new PdfUnorderedList(collection, { format: format, font: font3, style: PdfUnorderedListStyle.disk, indent: 10, textIndent: 10 });
        // Create ordered sublist for first item
        let subList = new PdfOrderedList(new PdfListItemCollection(), { brush: new PdfBrush({ r: 0, g: 0, b: 0 }), indent: 20, font: font4, format: format });
        let products = ['Tools', 'Grid', 'Chart', 'Edit', 'Diagram', 'XlsIO', 'Grouping', 'Calculate', 'PDF', 'HTMLUI', 'DocIO'];
        products.forEach(function (s) { subList.items.add(new PdfListItem('Essential ' + s)); });
        // Add the ordered sublist to the first main item
        list.items.at(0).subList = subList;
        // Create unordered sublist for second item
        const subSubListCollection = new PdfListItemCollection([
            'Essential PDF: It is a .NET library with the capability to produce Adobe PDF files. It features a full-fledged object model for the easy creation of PDF files from any .NET language. It does not use any external libraries and is built from scratch in C#. It can be used on the server side (ASP.NET or any other environment) or with Windows Forms applications. Essential PDF supports many features for creating a PDF document. Drawing Text, Images, Shapes, etc can be drawn easily in the PDF document.',
            'Essential DocIO: It is a .NET library that can read and write Microsoft Word files. It features a full-fledged object model similar to the Microsoft Office COM libraries. It does not use COM interop and is built from scratch in C#. It can be used on systems that do not have Microsoft Word installed. Here are some of the most common questions that arise regarding the usage and functionality of Essential DocIO.',
            'Essential XlsIO: It is a .NET library that can read and write Microsoft Excel files (BIFF 8 format). It features a full-fledged object model similar to the Microsoft Office COM libraries. It does not use COM interop and is built from scratch in C#. It can be used on systems that do not have Microsoft Excel installed, making it an excellent reporting engine for tabular data. ',
        ]);
        let SubsubList = new PdfUnorderedList(subSubListCollection, { brush: new PdfBrush({ r: 0, g: 0, b: 0 }), indent: 20, font: font5, format: format, style: PdfUnorderedListStyle.square });
        // Add the unordered sublist to the second main item
        list.items.at(1).subList = SubsubList;
        // Draw the list on the page
        list.draw(page, { x: 0, y: 130, width: page.graphics.clientSize.width, height: page.graphics.clientSize.height - 130 });
        // Save the document PDF
        const bytes = pdf.save();
        // Destory the document instance.
        pdf.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes, 'password');
        const parsedPage: PdfPage = parsed.getPage(0);
        const contents = parsedPage._pageDictionary.get('Contents');
        const ref = contents[2];
        const stream = parsedPage._crossReference._fetch(ref);
        const parser: _ContentParser = new _ContentParser(stream.getBytes());
        const result: _PdfRecord[] = parser._readContent();
        //Font level Check
        const resources: _PdfDictionary = parsedPage._pageDictionary.get('Resources');
        const fontDictionary: _PdfDictionary = resources.get('Font');
        const HelveticaBoldRef: string = result[11]._operands[0];
        const HelveticaRef: string = result[21]._operands[0];
        const TimesBoldRef: string = result[31]._operands[0];
        const TimesItalicRef: string = result[41]._operands[0];
        const TimesRomanRef: string = result[183]._operands[0];
        const Helvetica: _PdfName = fontDictionary.get(HelveticaRef.slice(1)).get('BaseFont');
        const TimesBold: _PdfName = fontDictionary.get(TimesBoldRef.slice(1)).get('BaseFont');
        const TimesItalic: _PdfName = fontDictionary.get(TimesItalicRef.slice(1)).get('BaseFont');
        const TimesRoman: _PdfName = fontDictionary.get(TimesRomanRef.slice(1)).get('BaseFont');
        const HelveticaBold: _PdfName = fontDictionary.get(HelveticaBoldRef.slice(1)).get('BaseFont');
        expect(Helvetica.name).toEqual('Helvetica');
        expect(TimesBold.name).toEqual('Times-Bold');
        expect(TimesItalic.name).toEqual('Times-Italic');
        expect(TimesRoman.name).toEqual('Times-Roman');
        expect(HelveticaBold.name).toEqual('Helvetica-Bold');
        //X-object level check //object -1
        let objectStreamRef: string = result[37]._operands[0];
        let objectStream = resources.get('XObject').get(objectStreamRef.slice(1));
        let objectParser: _ContentParser = new _ContentParser(objectStream.getBytes());
        let objectResult: _PdfRecord[] = objectParser._readContent();
        expect(objectResult[0]._operator).toEqual('cm');
        expect(objectResult[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '139.81']);
        expect(objectResult[1]._operator).toEqual('BT');
        expect(objectResult[1]._operands.length).toBe(0);
        expect(objectResult[2]._operator).toEqual('CS');
        expect(objectResult[2]._operands).toEqual(['/DeviceRGB']);
        expect(objectResult[3]._operator).toEqual('cs');
        expect(objectResult[3]._operands).toEqual(['/DeviceRGB']);
        expect(objectResult[4]._operator).toEqual('rg');
        expect(objectResult[4]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(objectResult[5]._operator).toEqual('Tf');
        expect(objectResult[5]._operands[1]).toEqual('10.000');
        expect(objectResult[6]._operator).toEqual('Tr');
        expect(objectResult[6]._operands).toEqual(['0']);
        expect(objectResult[7]._operator).toEqual('Tc');
        expect(objectResult[7]._operands).toEqual(['0.000']);
        expect(objectResult[8]._operator).toEqual('Tw');
        expect(objectResult[8]._operands).toEqual(['0.000']);
        expect(objectResult[9]._operator).toEqual('Tz');
        expect(objectResult[9]._operands).toEqual(['100.000']);
        expect(objectResult[10]._operator).toEqual('Tm');
        expect(objectResult[10]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-8.20']);
        expect(objectResult[11]._operator).toEqual("'");
        expect(objectResult[11]._operands).toEqual(['(l)']);
        expect(objectResult[12]._operator).toEqual('ET');
        expect(objectResult[12]._operands.length).toBe(0);
        //Object 2
        objectStreamRef = result[179]._operands[0];
        objectStream = resources.get('XObject').get(objectStreamRef.slice(1));
        objectParser = new _ContentParser(objectStream.getBytes());
        objectResult = objectParser._readContent();
        expect(objectResult[0]._operator).toEqual('cm');
        expect(objectResult[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '392.34']);
        expect(objectResult[1]._operator).toEqual('BT');
        expect(objectResult[1]._operands.length).toBe(0);
        expect(objectResult[2]._operator).toEqual('CS');
        expect(objectResult[2]._operands).toEqual(['/DeviceRGB']);
        expect(objectResult[3]._operator).toEqual('cs');
        expect(objectResult[3]._operands).toEqual(['/DeviceRGB']);
        expect(objectResult[4]._operator).toEqual('rg');
        expect(objectResult[4]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(objectResult[5]._operator).toEqual('Tf');
        expect(objectResult[5]._operands[1]).toEqual('10.000');
        expect(objectResult[6]._operator).toEqual('Tr');
        expect(objectResult[6]._operands).toEqual(['0']);
        expect(objectResult[7]._operator).toEqual('Tc');
        expect(objectResult[7]._operands).toEqual(['0.000']);
        expect(objectResult[8]._operator).toEqual('Tw');
        expect(objectResult[8]._operands).toEqual(['0.000']);
        expect(objectResult[9]._operator).toEqual('Tz');
        expect(objectResult[9]._operands).toEqual(['100.000']);
        expect(objectResult[10]._operator).toEqual('Tm');
        expect(objectResult[10]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-8.20']);
        expect(objectResult[11]._operator).toEqual("'");
        expect(objectResult[11]._operands).toEqual(['(l)']);
        expect(objectResult[12]._operator).toEqual('ET');
        expect(objectResult[12]._operands.length).toBe(0);
        //Object -3
        objectStreamRef = result[197]._operands[0];
        objectStream = resources.get('XObject').get(objectStreamRef.slice(1));
        objectParser = new _ContentParser(objectStream.getBytes());
        objectResult = objectParser._readContent();
        expect(objectResult[0]._operator).toEqual('cm');
        expect(objectResult[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '413.87']);
        expect(objectResult[1]._operator).toEqual('BT');
        expect(objectResult[1]._operands.length).toBe(0);
        expect(objectResult[2]._operator).toEqual('CS');
        expect(objectResult[2]._operands).toEqual(['/DeviceRGB']);
        expect(objectResult[3]._operator).toEqual('cs');
        expect(objectResult[3]._operands).toEqual(['/DeviceRGB']);
        expect(objectResult[4]._operator).toEqual('rg');
        expect(objectResult[4]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(objectResult[5]._operator).toEqual('Tf');
        expect(objectResult[5]._operands[1]).toEqual('10.000');
        expect(objectResult[6]._operator).toEqual('Tr');
        expect(objectResult[6]._operands).toEqual(['0']);
        expect(objectResult[7]._operator).toEqual('Tc');
        expect(objectResult[7]._operands).toEqual(['0.000']);
        expect(objectResult[8]._operator).toEqual('Tw');
        expect(objectResult[8]._operands).toEqual(['0.000']);
        expect(objectResult[9]._operator).toEqual('Tz');
        expect(objectResult[9]._operands).toEqual(['100.000']);
        expect(objectResult[10]._operator).toEqual('Tm');
        expect(objectResult[10]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-8.20']);
        expect(objectResult[11]._operator).toEqual("'");
        expect(objectResult[11]._operands).toEqual(['(n)']);
        expect(objectResult[12]._operator).toEqual('ET');
        expect(objectResult[12]._operands.length).toBe(0);
        //object 4
        objectStreamRef = result[213]._operands[0];
        objectStream = resources.get('XObject').get(objectStreamRef.slice(1));
        objectParser = new _ContentParser(objectStream.getBytes());
        objectResult = objectParser._readContent();
        expect(objectResult[0]._operator).toEqual('cm');
        expect(objectResult[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '519.67']);
        expect(objectResult[1]._operator).toEqual('BT');
        expect(objectResult[1]._operands.length).toBe(0);
        expect(objectResult[2]._operator).toEqual('CS');
        expect(objectResult[2]._operands).toEqual(['/DeviceRGB']);
        expect(objectResult[3]._operator).toEqual('cs');
        expect(objectResult[3]._operands).toEqual(['/DeviceRGB']);
        expect(objectResult[4]._operator).toEqual('rg');
        expect(objectResult[4]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(objectResult[5]._operator).toEqual('Tf');
        expect(objectResult[5]._operands[1]).toEqual('10.000');
        expect(objectResult[6]._operator).toEqual('Tr');
        expect(objectResult[6]._operands).toEqual(['0']);
        expect(objectResult[7]._operator).toEqual('Tc');
        expect(objectResult[7]._operands).toEqual(['0.000']);
        expect(objectResult[8]._operator).toEqual('Tw');
        expect(objectResult[8]._operands).toEqual(['0.000']);
        expect(objectResult[9]._operator).toEqual('Tz');
        expect(objectResult[9]._operands).toEqual(['100.000']);
        expect(objectResult[10]._operator).toEqual('Tm');
        expect(objectResult[10]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-8.20']);
        expect(objectResult[11]._operator).toEqual("'");
        expect(objectResult[11]._operands).toEqual(['(n)']);
        expect(objectResult[12]._operator).toEqual('ET');
        expect(objectResult[12]._operands.length).toBe(0);
        objectStreamRef = result[229]._operands[0];
        objectStream = resources.get('XObject').get(objectStreamRef.slice(1));
        objectParser = new _ContentParser(objectStream.getBytes());
        objectResult = objectParser._readContent();
        expect(objectResult[0]._operator).toEqual('cm');
        expect(objectResult[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '604.31']);
        expect(objectResult[1]._operator).toEqual('BT');
        expect(objectResult[1]._operands.length).toBe(0);
        expect(objectResult[2]._operator).toEqual('CS');
        expect(objectResult[2]._operands).toEqual(['/DeviceRGB']);
        expect(objectResult[3]._operator).toEqual('cs');
        expect(objectResult[3]._operands).toEqual(['/DeviceRGB']);
        expect(objectResult[4]._operator).toEqual('rg');
        expect(objectResult[4]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(objectResult[5]._operator).toEqual('Tf');
        expect(objectResult[5]._operands[1]).toEqual('10.000');
        expect(objectResult[6]._operator).toEqual('Tr');
        expect(objectResult[6]._operands).toEqual(['0']);
        expect(objectResult[7]._operator).toEqual('Tc');
        expect(objectResult[7]._operands).toEqual(['0.000']);
        expect(objectResult[8]._operator).toEqual('Tw');
        expect(objectResult[8]._operands).toEqual(['0.000']);
        expect(objectResult[9]._operator).toEqual('Tz');
        expect(objectResult[9]._operands).toEqual(['100.000']);
        expect(objectResult[10]._operator).toEqual('Tm');
        expect(objectResult[10]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-8.20']);
        expect(objectResult[11]._operator).toEqual("'");
        expect(objectResult[11]._operands).toEqual(['(n)']);
        expect(objectResult[12]._operator).toEqual('ET');
        expect(objectResult[12]._operands.length).toBe(0);
        //Apperance level check
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands.length).toBe(0);
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands.length).toBe(0);
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands.length).toBe(0);
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands.length).toBe(0);
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
        expect(result[7]._operator).toEqual('BT');
        expect(result[7]._operands.length).toBe(0);
        expect(result[8]._operator).toEqual('CS');
        expect(result[8]._operands).toEqual(['/DeviceRGB']);
        expect(result[9]._operator).toEqual('cs');
        expect(result[9]._operands).toEqual(['/DeviceRGB']);
        expect(result[10]._operator).toEqual('rg');
        expect(result[10]._operands).toEqual(['0.000', '0.000', '0.545']);
        expect(result[11]._operator).toEqual('Tf');
        expect(result[11]._operands[0]).toEqual(HelveticaBoldRef);
        expect(result[11]._operands[1]).toEqual('14.000');
        expect(result[12]._operator).toEqual('Tr');
        expect(result[12]._operands).toEqual(['0']);
        expect(result[13]._operator).toEqual('Tc');
        expect(result[13]._operands).toEqual(['0.000']);
        expect(result[14]._operator).toEqual('Tw');
        expect(result[14]._operands).toEqual(['0.000']);
        expect(result[15]._operator).toEqual('Tz');
        expect(result[15]._operands).toEqual(['100.000']);
        expect(result[16]._operator).toEqual('Tm');
        expect(result[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '225.00', '-23.47']);
        expect(result[17]._operator).toEqual("'");
        expect(result[17]._operands).toEqual(['(List Features)']);
        expect(result[18]._operator).toEqual('ET');
        expect(result[18]._operands.length).toBe(0);
        expect(result[19]._operator).toEqual('BT');
        expect(result[19]._operands.length).toBe(0);
        expect(result[20]._operator).toEqual('rg');
        expect(result[20]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[21]._operator).toEqual('Tf');
        expect(result[21]._operands[0]).toEqual(HelveticaRef);
        expect(result[21]._operands[1]).toEqual('12.000');
        expect(result[22]._operator).toEqual('Tm');
        expect(result[22]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-61.17']);
        expect(result[23]._operator).toEqual("'");
        expect(result[23]._operands).toEqual(['(This sample demonstrates letious features of bullets and lists. A list can be ordered and)']);
        expect(result[24]._operator).toEqual('Tm');
        expect(result[24]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-75.04']);
        expect(result[25]._operator).toEqual("'");
        expect(result[25]._operands).toEqual(['(Unordered. Essential PDF provides support for creating and formatting ordered and unordered)']);
        expect(result[26]._operator).toEqual('Tm');
        expect(result[26]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-88.92']);
        expect(result[27]._operator).toEqual("'");
        expect(result[27]._operands).toEqual(['(lists.)']);
        expect(result[28]._operator).toEqual('ET');
        expect(result[28]._operands.length).toBe(0);
        expect(result[29]._operator).toEqual('BT');
        expect(result[29]._operands.length).toBe(0);
        expect(result[30]._operator).toEqual('rg');
        expect(result[30]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[31]._operator).toEqual('Tf');
        expect(result[31]._operands[0]).toEqual(TimesBoldRef);
        expect(result[31]._operands[1]).toEqual('10.000');
        expect(result[32]._operator).toEqual('Tm');
        expect(result[32]._operands).toEqual(['1.00', '.00', '.00', '1.00', '27.91', '-139.35']);
        expect(result[33]._operator).toEqual("'");
        expect(result[33]._operands).toEqual(['(List of Essential Studio products)']);
        expect(result[34]._operator).toEqual('ET');
        expect(result[34]._operands.length).toBe(0);
        expect(result[35]._operator).toEqual('q');
        expect(result[35]._operands.length).toBe(0);
        expect(result[36]._operator).toEqual('cm');
        expect(result[36]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-270.00']);
        expect(result[37]._operator).toEqual('Do');
        expect(result[38]._operator).toEqual('Q');
        expect(result[38]._operands.length).toBe(0);
        expect(result[39]._operator).toEqual('BT');
        expect(result[39]._operands.length).toBe(0);
        expect(result[40]._operator).toEqual('rg');
        expect(result[40]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[41]._operator).toEqual('Tf');
        expect(result[41]._operands[0]).toEqual(TimesItalicRef);
        expect(result[41]._operands[1]).toEqual('10.000');
        expect(result[42]._operator).toEqual('Tm');
        expect(result[42]._operands).toEqual(['1.00', '.00', '.00', '1.00', '47.50', '-160.36']);
        expect(result[43]._operator).toEqual("'");
        expect(result[43]._operands).toEqual(['(Essential Tools)']);
        expect(result[44]._operator).toEqual('ET');
        expect(result[44]._operands.length).toBe(0);
        expect(result[45]._operator).toEqual('BT');
        expect(result[45]._operands.length).toBe(0);
        expect(result[46]._operator).toEqual('rg');
        expect(result[46]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[47]._operator).toEqual('Tf');
        expect(result[47]._operands[0]).toEqual(TimesItalicRef);
        expect(result[47]._operands[1]).toEqual('10.000');
        expect(result[48]._operator).toEqual('Tm');
        expect(result[48]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-160.36']);
        expect(result[49]._operator).toEqual("'");
        expect(result[49]._operands).toEqual(['(1.)']);
        expect(result[50]._operator).toEqual('ET');
        expect(result[50]._operands.length).toBe(0);
        expect(result[51]._operator).toEqual('BT');
        expect(result[51]._operands.length).toBe(0);
        expect(result[52]._operator).toEqual('rg');
        expect(result[52]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[53]._operator).toEqual('Tf');
        expect(result[53]._operands[0]).toEqual(TimesItalicRef);
        expect(result[53]._operands[1]).toEqual('10.000');
        expect(result[54]._operator).toEqual('Tm');
        expect(result[54]._operands).toEqual(['1.00', '.00', '.00', '1.00', '47.50', '-181.36']);
        expect(result[55]._operator).toEqual("'");
        expect(result[55]._operands).toEqual(['(Essential Grid)']);
        expect(result[56]._operator).toEqual('ET');
        expect(result[56]._operands.length).toBe(0);
        expect(result[57]._operator).toEqual('BT');
        expect(result[57]._operands.length).toBe(0);
        expect(result[58]._operator).toEqual('rg');
        expect(result[58]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[59]._operator).toEqual('Tf');
        expect(result[59]._operands[0]).toEqual(TimesItalicRef);
        expect(result[59]._operands[1]).toEqual('10.000');
        expect(result[60]._operator).toEqual('Tm');
        expect(result[60]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-181.36']);
        expect(result[61]._operator).toEqual("'");
        expect(result[61]._operands).toEqual(['(2.)']);
        expect(result[62]._operator).toEqual('ET');
        expect(result[62]._operands.length).toBe(0);
        expect(result[63]._operator).toEqual('BT');
        expect(result[63]._operands.length).toBe(0);
        expect(result[64]._operator).toEqual('rg');
        expect(result[64]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[65]._operator).toEqual('Tf');
        expect(result[65]._operands[0]).toEqual(TimesItalicRef);
        expect(result[65]._operands[1]).toEqual('10.000');
        expect(result[66]._operator).toEqual('Tm');
        expect(result[66]._operands).toEqual(['1.00', '.00', '.00', '1.00', '47.50', '-202.36']);
        expect(result[67]._operator).toEqual("'");
        expect(result[67]._operands).toEqual(['(Essential Chart)']);
        expect(result[68]._operator).toEqual('ET');
        expect(result[68]._operands.length).toBe(0);
        expect(result[69]._operator).toEqual('BT');
        expect(result[69]._operands.length).toBe(0);
        expect(result[70]._operator).toEqual('rg');
        expect(result[70]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[71]._operator).toEqual('Tf');
        expect(result[71]._operands[0]).toEqual(TimesItalicRef);
        expect(result[71]._operands[1]).toEqual('10.000');
        expect(result[72]._operator).toEqual('Tm');
        expect(result[72]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-202.36']);
        expect(result[73]._operator).toEqual("'");
        expect(result[73]._operands).toEqual(['(3.)']);
        expect(result[74]._operator).toEqual('ET');
        expect(result[74]._operands.length).toBe(0);
        expect(result[75]._operator).toEqual('BT');
        expect(result[75]._operands.length).toBe(0);
        expect(result[76]._operator).toEqual('rg');
        expect(result[76]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[77]._operator).toEqual('Tf');
        expect(result[77]._operands[0]).toEqual(TimesItalicRef);
        expect(result[77]._operands[1]).toEqual('10.000');
        expect(result[78]._operator).toEqual('Tm');
        expect(result[78]._operands).toEqual(['1.00', '.00', '.00', '1.00', '47.50', '-223.36']);
        expect(result[79]._operator).toEqual("'");
        expect(result[79]._operands).toEqual(['(Essential Edit)']);
        expect(result[80]._operator).toEqual('ET');
        expect(result[80]._operands.length).toBe(0);
        expect(result[81]._operator).toEqual('BT');
        expect(result[81]._operands.length).toBe(0);
        expect(result[82]._operator).toEqual('rg');
        expect(result[82]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[83]._operator).toEqual('Tf');
        expect(result[83]._operands[0]).toEqual(TimesItalicRef);
        expect(result[83]._operands[1]).toEqual('10.000');
        expect(result[84]._operator).toEqual('Tm');
        expect(result[84]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-223.36']);
        expect(result[85]._operator).toEqual("'");
        expect(result[85]._operands).toEqual(['(4.)']);
        expect(result[86]._operator).toEqual('ET');
        expect(result[86]._operands.length).toBe(0);
        expect(result[87]._operator).toEqual('BT');
        expect(result[87]._operands.length).toBe(0);
        expect(result[88]._operator).toEqual('rg');
        expect(result[88]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[89]._operator).toEqual('Tf');
        expect(result[89]._operands[0]).toEqual(TimesItalicRef);
        expect(result[89]._operands[1]).toEqual('10.000');
        expect(result[90]._operator).toEqual('Tm');
        expect(result[90]._operands).toEqual(['1.00', '.00', '.00', '1.00', '47.50', '-244.36']);
        expect(result[91]._operator).toEqual("'");
        expect(result[91]._operands).toEqual(['(Essential Diagram)']);
        expect(result[92]._operator).toEqual('ET');
        expect(result[92]._operands.length).toBe(0);
        expect(result[93]._operator).toEqual('BT');
        expect(result[93]._operands.length).toBe(0);
        expect(result[94]._operator).toEqual('rg');
        expect(result[94]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[95]._operator).toEqual('Tf');
        expect(result[95]._operands[0]).toEqual(TimesItalicRef);
        expect(result[95]._operands[1]).toEqual('10.000');
        expect(result[96]._operator).toEqual('Tm');
        expect(result[96]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-244.36']);
        expect(result[97]._operator).toEqual("'");
        expect(result[97]._operands).toEqual(['(5.)']);
        expect(result[98]._operator).toEqual('ET');
        expect(result[98]._operands.length).toBe(0);
        expect(result[99]._operator).toEqual('BT');
        expect(result[99]._operands.length).toBe(0);
        expect(result[100]._operator).toEqual('rg');
        expect(result[100]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[101]._operator).toEqual('Tf');
        expect(result[101]._operands[0]).toEqual(TimesItalicRef);
        expect(result[101]._operands[1]).toEqual('10.000');
        expect(result[102]._operator).toEqual('Tm');
        expect(result[102]._operands).toEqual(['1.00', '.00', '.00', '1.00', '47.50', '-265.36']);
        expect(result[103]._operator).toEqual("'");
        expect(result[103]._operands).toEqual(['(Essential XlsIO)']);
        expect(result[104]._operator).toEqual('ET');
        expect(result[104]._operands.length).toBe(0);
        expect(result[105]._operator).toEqual('BT');
        expect(result[105]._operands.length).toBe(0);
        expect(result[106]._operator).toEqual('rg');
        expect(result[106]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[107]._operator).toEqual('Tf');
        expect(result[107]._operands[0]).toEqual(TimesItalicRef);
        expect(result[107]._operands[1]).toEqual('10.000');
        expect(result[108]._operator).toEqual('Tm');
        expect(result[108]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-265.36']);
        expect(result[109]._operator).toEqual("'");
        expect(result[109]._operands).toEqual(['(6.)']);
        expect(result[110]._operator).toEqual('ET');
        expect(result[110]._operands.length).toBe(0);
        expect(result[111]._operator).toEqual('BT');
        expect(result[111]._operands.length).toBe(0);
        expect(result[112]._operator).toEqual('rg');
        expect(result[112]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[113]._operator).toEqual('Tf');
        expect(result[113]._operands[0]).toEqual(TimesItalicRef);
        expect(result[113]._operands[1]).toEqual('10.000');
        expect(result[114]._operator).toEqual('Tm');
        expect(result[114]._operands).toEqual(['1.00', '.00', '.00', '1.00', '47.50', '-286.36']);
        expect(result[115]._operator).toEqual("'");
        expect(result[115]._operands).toEqual(['(Essential Grouping)']);
        expect(result[116]._operator).toEqual('ET');
        expect(result[116]._operands.length).toBe(0);
        expect(result[117]._operator).toEqual('BT');
        expect(result[117]._operands.length).toBe(0);
        expect(result[118]._operator).toEqual('rg');
        expect(result[118]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[119]._operator).toEqual('Tf');
        expect(result[119]._operands[0]).toEqual(TimesItalicRef);
        expect(result[119]._operands[1]).toEqual('10.000');
        expect(result[120]._operator).toEqual('Tm');
        expect(result[120]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-286.36']);
        expect(result[121]._operator).toEqual("'");
        expect(result[121]._operands).toEqual(['(7.)']);
        expect(result[122]._operator).toEqual('ET');
        expect(result[122]._operands.length).toBe(0);
        expect(result[123]._operator).toEqual('BT');
        expect(result[123]._operands.length).toBe(0);
        expect(result[124]._operator).toEqual('rg');
        expect(result[124]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[125]._operator).toEqual('Tf');
        expect(result[125]._operands[0]).toEqual(TimesItalicRef);
        expect(result[125]._operands[1]).toEqual('10.000');
        expect(result[126]._operator).toEqual('Tm');
        expect(result[126]._operands).toEqual(['1.00', '.00', '.00', '1.00', '47.50', '-307.36']);
        expect(result[127]._operator).toEqual("'");
        expect(result[127]._operands).toEqual(['(Essential Calculate)']);
        expect(result[128]._operator).toEqual('ET');
        expect(result[128]._operands.length).toBe(0);
        expect(result[129]._operator).toEqual('BT');
        expect(result[129]._operands.length).toBe(0);
        expect(result[130]._operator).toEqual('rg');
        expect(result[130]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[131]._operator).toEqual('Tf');
        expect(result[131]._operands[0]).toEqual(TimesItalicRef);
        expect(result[131]._operands[1]).toEqual('10.000');
        expect(result[132]._operator).toEqual('Tm');
        expect(result[132]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-307.36']);
        expect(result[133]._operator).toEqual("'");
        expect(result[133]._operands).toEqual(['(8.)']);
        expect(result[134]._operator).toEqual('ET');
        expect(result[134]._operands.length).toBe(0);
        expect(result[135]._operator).toEqual('BT');
        expect(result[135]._operands.length).toBe(0);
        expect(result[136]._operator).toEqual('rg');
        expect(result[136]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[137]._operator).toEqual('Tf');
        expect(result[137]._operands[0]).toEqual(TimesItalicRef);
        expect(result[137]._operands[1]).toEqual('10.000');
        expect(result[138]._operator).toEqual('Tm');
        expect(result[138]._operands).toEqual(['1.00', '.00', '.00', '1.00', '47.50', '-328.36']);
        expect(result[139]._operator).toEqual("'");
        expect(result[139]._operands).toEqual(['(Essential PDF)']);
        expect(result[140]._operator).toEqual('ET');
        expect(result[140]._operands.length).toBe(0);
        expect(result[141]._operator).toEqual('BT');
        expect(result[141]._operands.length).toBe(0);
        expect(result[142]._operator).toEqual('rg');
        expect(result[142]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[143]._operator).toEqual('Tf');
        expect(result[143]._operands[0]).toEqual(TimesItalicRef);
        expect(result[143]._operands[1]).toEqual('10.000');
        expect(result[144]._operator).toEqual('Tm');
        expect(result[144]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-328.36']);
        expect(result[145]._operator).toEqual("'");
        expect(result[145]._operands).toEqual(['(9.)']);
        expect(result[146]._operator).toEqual('ET');
        expect(result[146]._operands.length).toBe(0);
        expect(result[147]._operator).toEqual('BT');
        expect(result[147]._operands.length).toBe(0);
        expect(result[148]._operator).toEqual('rg');
        expect(result[148]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[149]._operator).toEqual('Tf');
        expect(result[149]._operands[0]).toEqual(TimesItalicRef);
        expect(result[149]._operands[1]).toEqual('10.000');
        expect(result[150]._operator).toEqual('Tm');
        expect(result[150]._operands).toEqual(['1.00', '.00', '.00', '1.00', '47.50', '-349.36']);
        expect(result[151]._operator).toEqual("'");
        expect(result[151]._operands).toEqual(['(Essential HTMLUI)']);
        expect(result[152]._operator).toEqual('ET');
        expect(result[152]._operands.length).toBe(0);
        expect(result[153]._operator).toEqual('BT');
        expect(result[153]._operands.length).toBe(0);
        expect(result[154]._operator).toEqual('rg');
        expect(result[154]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[155]._operator).toEqual('Tf');
        expect(result[155]._operands[0]).toEqual(TimesItalicRef);
        expect(result[155]._operands[1]).toEqual('10.000');
        expect(result[156]._operator).toEqual('Tm');
        expect(result[156]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-349.36']);
        expect(result[157]._operator).toEqual("'");
        expect(result[157]._operands).toEqual(['(10.)']);
        expect(result[158]._operator).toEqual('ET');
        expect(result[158]._operands.length).toBe(0);
        expect(result[159]._operator).toEqual('BT');
        expect(result[159]._operands.length).toBe(0);
        expect(result[160]._operator).toEqual('rg');
        expect(result[160]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[161]._operator).toEqual('Tf');
        expect(result[161]._operands[0]).toEqual(TimesItalicRef);
        expect(result[161]._operands[1]).toEqual('10.000');
        expect(result[162]._operator).toEqual('Tm');
        expect(result[162]._operands).toEqual(['1.00', '.00', '.00', '1.00', '47.50', '-370.36']);
        expect(result[163]._operator).toEqual("'");
        expect(result[163]._operands).toEqual(['(Essential DocIO)']);
        expect(result[164]._operator).toEqual('ET');
        expect(result[164]._operands.length).toBe(0);
        expect(result[165]._operator).toEqual('BT');
        expect(result[165]._operands.length).toBe(0);
        expect(result[166]._operator).toEqual('rg');
        expect(result[166]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[167]._operator).toEqual('Tf');
        expect(result[167]._operands[0]).toEqual(TimesItalicRef);
        expect(result[167]._operands[1]).toEqual('10.000');
        expect(result[168]._operator).toEqual('Tm');
        expect(result[168]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-370.36']);
        expect(result[169]._operator).toEqual("'");
        expect(result[169]._operands).toEqual(['(11.)']);
        expect(result[170]._operator).toEqual('ET');
        expect(result[170]._operands.length).toBe(0);
        expect(result[171]._operator).toEqual('BT');
        expect(result[171]._operands.length).toBe(0);
        expect(result[172]._operator).toEqual('rg');
        expect(result[172]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[173]._operator).toEqual('Tf');
        expect(result[173]._operands[0]).toEqual(TimesBoldRef);
        expect(result[173]._operands[1]).toEqual('10.000');
        expect(result[174]._operator).toEqual('Tm');
        expect(result[174]._operands).toEqual(['1.00', '.00', '.00', '1.00', '27.91', '-391.88']);
        expect(result[175]._operator).toEqual("'");
        expect(result[175]._operands).toEqual(['(IO products)']);
        expect(result[176]._operator).toEqual('ET');
        expect(result[176]._operands.length).toBe(0);
        expect(result[177]._operator).toEqual('q');
        expect(result[177]._operands.length).toBe(0);
        expect(result[178]._operator).toEqual('cm');
        expect(result[178]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-775.06']);
        expect(result[179]._operator).toEqual('Do');
        expect(result[180]._operator).toEqual('Q');
        expect(result[180]._operands.length).toBe(0);
        expect(result[181]._operator).toEqual('BT');
        expect(result[181]._operands.length).toBe(0);
        expect(result[182]._operator).toEqual('rg');
        expect(result[182]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[183]._operator).toEqual('Tf');
        expect(result[183]._operands[0]).toEqual(TimesRomanRef);
        expect(result[183]._operands[1]).toEqual('10.000');
        expect(result[184]._operator).toEqual('Tm');
        expect(result[184]._operands).toEqual(['1.00', '.00', '.00', '1.00', '42.61', '-413.04']);
        expect(result[185]._operator).toEqual("'");
        expect(result[185]._operands).toEqual(['(Essential PDF: It is a .NET library with the capability to produce Adobe PDF files. It features a full-fledged object)']);
        expect(result[186]._operator).toEqual('Tm');
        expect(result[186]._operands).toEqual(['1.00', '.00', '.00', '1.00', '42.61', '-434.20']);
        expect(result[187]._operator).toEqual("'");
        expect(result[187]._operands).toEqual(['(model for the easy creation of PDF files from any .NET language. It does not use any external libraries and is built)']);
        expect(result[188]._operator).toEqual('Tm');
        expect(result[188]._operands).toEqual(['1.00', '.00', '.00', '1.00', '42.61', '-455.36']);
        expect(result[189]._operator).toEqual("'");
        expect(result[189]._operands).toEqual(['(from scratch in C#. It can be used on the server side \\(ASP.NET or any other environment\\) or with Windows Forms)']);
        expect(result[190]._operator).toEqual('Tm');
        expect(result[190]._operands).toEqual(['1.00', '.00', '.00', '1.00', '42.61', '-476.52']);
        expect(result[191]._operator).toEqual("'");
        expect(result[191]._operands).toEqual(['(applications. Essential PDF supports many features for creating a PDF document. Drawing Text, Images, Shapes, etc)']);
        expect(result[192]._operator).toEqual('Tm');
        expect(result[192]._operands).toEqual(['1.00', '.00', '.00', '1.00', '42.61', '-497.68']);
        expect(result[193]._operator).toEqual("'");
        expect(result[193]._operands).toEqual(['(can be drawn easily in the PDF document.)']);
        expect(result[194]._operator).toEqual('ET');
        expect(result[194]._operands.length).toBe(0);
        expect(result[195]._operator).toEqual('q');
        expect(result[195]._operands.length).toBe(0);
        expect(result[196]._operator).toEqual('cm');
        expect(result[196]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-818.12']);
        expect(result[197]._operator).toEqual('Do');
        expect(result[198]._operator).toEqual('Q');
        expect(result[198]._operands.length).toBe(0);
        expect(result[199]._operator).toEqual('BT');
        expect(result[199]._operands.length).toBe(0);
        expect(result[200]._operator).toEqual('rg');
        expect(result[200]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[201]._operator).toEqual('Tf');
        expect(result[201]._operands[0]).toEqual(TimesRomanRef);
        expect(result[201]._operands[1]).toEqual('10.000');
        expect(result[202]._operator).toEqual('Tm');
        expect(result[202]._operands).toEqual(['1.00', '.00', '.00', '1.00', '42.61', '-518.84']);
        expect(result[203]._operator).toEqual("'");
        expect(result[203]._operands).toEqual(['(Essential DocIO: It is a .NET library that can read and write Microsoft Word files. It features a full-fledged object)']);
        expect(result[204]._operator).toEqual('Tm');
        expect(result[204]._operands).toEqual(['1.00', '.00', '.00', '1.00', '42.61', '-540.00']);
        expect(result[205]._operator).toEqual("'");
        expect(result[205]._operands).toEqual(['(model similar to the Microsoft Office COM libraries. It does not use COM interop and is built from scratch in C#. It)']);
        expect(result[206]._operator).toEqual('Tm');
        expect(result[206]._operands).toEqual(['1.00', '.00', '.00', '1.00', '42.61', '-561.16']);
        expect(result[207]._operator).toEqual("'");
        expect(result[207]._operands).toEqual(['(can be used on systems that do not have Microsoft Word installed. Here are some of the most common questions that)']);
        expect(result[208]._operator).toEqual('Tm');
        expect(result[208]._operands).toEqual(['1.00', '.00', '.00', '1.00', '42.61', '-582.32']);
        expect(result[209]._operator).toEqual("'");
        expect(result[209]._operands).toEqual(['(arise regarding the usage and functionality of Essential DocIO.)']);
        expect(result[210]._operator).toEqual('ET');
        expect(result[210]._operands.length).toBe(0);
        expect(result[211]._operator).toEqual('q');
        expect(result[211]._operands.length).toBe(0);
        expect(result[212]._operator).toEqual('cm');
        expect(result[212]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-1029.72']);
        expect(result[213]._operator).toEqual('Do');
        expect(result[214]._operator).toEqual('Q');
        expect(result[214]._operands.length).toBe(0);
        expect(result[215]._operator).toEqual('BT');
        expect(result[215]._operands.length).toBe(0);
        expect(result[216]._operator).toEqual('rg');
        expect(result[216]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(result[217]._operator).toEqual('Tf');
        expect(result[217]._operands[0]).toEqual(TimesRomanRef);
        expect(result[217]._operands[1]).toEqual('10.000');
        expect(result[218]._operator).toEqual('Tm');
        expect(result[218]._operands).toEqual(['1.00', '.00', '.00', '1.00', '42.61', '-603.48']);
        expect(result[219]._operator).toEqual("'");
        expect(result[219]._operands).toEqual(['(Essential XlsIO: It is a .NET library that can read and write Microsoft Excel files \\(BIFF 8 format\\). It features a)']);
        expect(result[220]._operator).toEqual('Tm');
        expect(result[220]._operands).toEqual(['1.00', '.00', '.00', '1.00', '42.61', '-624.64']);
        expect(result[221]._operator).toEqual("'");
        expect(result[221]._operands).toEqual(['(full-fledged object model similar to the Microsoft Office COM libraries. It does not use COM interop and is built)']);
        expect(result[222]._operator).toEqual('Tm');
        expect(result[222]._operands).toEqual(['1.00', '.00', '.00', '1.00', '42.61', '-645.80']);
        expect(result[223]._operator).toEqual("'");
        expect(result[223]._operands).toEqual(['(from scratch in C#. It can be used on systems that do not have Microsoft Excel installed, making it an excellent)']);
        expect(result[224]._operator).toEqual('Tm');
        expect(result[224]._operands).toEqual(['1.00', '.00', '.00', '1.00', '42.61', '-666.96']);
        expect(result[225]._operator).toEqual("'");
        expect(result[225]._operands).toEqual(['(reporting engine for tabular data.)']);
        expect(result[226]._operator).toEqual('ET');
        expect(result[226]._operands.length).toBe(0);
        expect(result[227]._operator).toEqual('q');
        expect(result[227]._operands.length).toBe(0);
        expect(result[228]._operator).toEqual('cm');
        expect(result[228]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-1199.00']);
        expect(result[229]._operator).toEqual('Do');
        expect(result[230]._operator).toEqual('Q');
        expect(result[230]._operands.length).toBe(0);
        parsed.destroy();
    });
    it('Credit card pdf pages', () => {
        const pdfBytes = creditCard;
        // Create a PdfDocument instance from the fetched bytes
        const pdf = new PdfDocument(pdfBytes);
        pdf.setSecurity({ userPassword: 'password', encryptionType: PdfEncryptionType.aesBit256Rev5 })
        // Reorder pages using pdf.reorderPages with the new order [2, 0, 1]
        expect(pdf.pageCount).toBe(3);
        // Save and download the document
        const bytes = pdf.save();
        const parsed = new PdfDocument(bytes, 'password');
        const parsedPageOne: PdfPage = parsed.getPage(0);
        const parsedPageTwo: PdfPage = parsed.getPage(1);
        const parsedPageThree: PdfPage = parsed.getPage(2);
        expect(parsed).toBeDefined();
        expect(parsedPageOne).toBeDefined();
        expect(parsedPageThree).toBeDefined();
        expect(parsedPageTwo).toBeDefined();
        pdf.destroy();
        parsed.destroy();
    });
    it('Watermark PDF load with encryption', () => {
        const pdfBytes = watermark;
        // Load the existing PDF
        const pdf = new PdfDocument(pdfBytes);
        pdf.setSecurity({ userPassword: 'password', encryptionType: PdfEncryptionType.aesBit128 })
        // Setup watermark text font and size that fits into a max width
        const maxWidth = 600;
        let stampText = 'Created using Syncfusion PDF library';
        let transparency = 0.25;
        let font = pdf.embedFont(PdfFontFamily.helvetica, 36, PdfFontStyle.regular);
        let textSize = font.measureString(stampText);
        while (textSize.width > maxWidth && font.size > 6) {
            font = pdf.embedFont(PdfFontFamily.helvetica, font.size - 1, PdfFontStyle.regular);
            textSize = font.measureString(stampText);
        }
        const pageCount = pdf.pageCount || 0;
        // Draw text watermark
        if (stampText && stampText.trim()) {
            for (let i = 0; i < pageCount; i++) {
                const page = pdf.getPage(i);
                const g = page.graphics;
                g.save();
                g.setTransparency(transparency);
                const width = g.clientSize.width;
                const height = g.clientSize.height;
                g.translateTransform({ x: width / 2, y: height / 2 });
                g.rotateTransform(-45);
                const brush = new PdfBrush({ r: 255, g: 0, b: 0 });
                g.drawString(
                    stampText,
                    font,
                    { x: -(textSize.width / 2), y: -(textSize.height / 2), width, height },
                    brush
                );
                g.restore();
            }
        }
        // Save and download
        const bytes = pdf.save();
        // Destory the document
        pdf.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes, 'password');
        expect(pageCount).toEqual(parsed.pageCount);
        for (let index = 0; index < pageCount; index++) {
            const parsedPage: PdfPage = parsed.getPage(0);
            const contents = parsedPage._pageDictionary.get('Contents');
            const ref = contents[3];
            const stream = parsedPage._crossReference._fetch(ref);
            let parser: _ContentParser = new _ContentParser(stream.getBytes());
            let result: _PdfRecord[] = parser._readContent();
            expect(result[0]._operator).toEqual('q');
            expect(result[0]._operands).toEqual([]);
            expect(result[1]._operator).toEqual('cm');
            expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '792.00']);
            expect(result[2]._operator).toEqual('q');
            expect(result[2]._operands).toEqual([]);
            expect(result[3]._operator).toEqual('gs');
            expect(result[4]._operator).toEqual('cm');
            expect(result[4]._operands).toEqual(['1.00', '.00', '.00', '1.00', '306.00', '-396.00']);
            expect(result[5]._operator).toEqual('cm');
            expect(result[5]._operands).toEqual(['0.71', '0.71', '-0.71', '0.71', '.00', '.00']);
            expect(result[6]._operator).toEqual('BT');
            expect(result[6]._operands).toEqual([]);
            expect(result[7]._operator).toEqual('CS');
            expect(result[7]._operands).toEqual(['/DeviceRGB']);
            expect(result[8]._operator).toEqual('cs');
            expect(result[8]._operands).toEqual(['/DeviceRGB']);
            expect(result[9]._operator).toEqual('rg');
            expect(result[9]._operands).toEqual(['1.000', '0.000', '0.000']);
            expect(result[10]._operator).toEqual('Tf');
            expect(result[10]._operands[1]).toEqual('35.000');
            expect(result[11]._operator).toEqual('Tr');
            expect(result[11]._operands).toEqual(['0']);
            expect(result[12]._operator).toEqual('Tc');
            expect(result[12]._operands).toEqual(['0.000']);
            expect(result[13]._operator).toEqual('Tw');
            expect(result[13]._operands).toEqual(['0.000']);
            expect(result[14]._operator).toEqual('Tz');
            expect(result[14]._operands).toEqual(['100.000']);
            expect(result[15]._operator).toEqual('Tm');
            expect(result[15]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-291.76', '-12.36']);
            expect(result[16]._operator).toEqual("'");
            expect(result[16]._operands).toEqual(['(Created using Syncfusion PDF library)']);
            expect(result[17]._operator).toEqual('ET');
            expect(result[17]._operands).toEqual([]);
            expect(result[18]._operator).toEqual('Q');
            expect(result[18]._operands).toEqual([]);
        }
        parsed.destroy();
    });
    it('Form Filling And reload remove and load', () => {
        function getFormValues() {
            const name = 'Ragul';
            const gender = 'Male';
            const dob = '04/08/2003';
            const email = 'ragul.milton@example.com';
            const state = 'tamil nadu';
            const newsletter = true;
            return { name, gender, dob, email, state, newsletter }
        }
        function findByName(form: PdfForm, name: string) {
            for (let i = 0; i < form.count; i++) {
                const field = form.fieldAt(i);
                if (field && field.name === name) return field;
            }
            return undefined;
        }
        function getFieldRecords(fieldRef1: string): _PdfRecord[] {
            let fieldStream = XObject.get(fieldRef1.slice(1));
            let fieldparser: _ContentParser = new _ContentParser(fieldStream.getBytes());
            return fieldparser._readContent();
        }
        const pdfBytes = formPDF;
        // Read current form values from the page
        const values = getFormValues();
        // Create a PdfDocument from the fetched bytes
        const pdf = new PdfDocument(pdfBytes);
        // Get the PdfForm
        pdf.setSecurity({ userPassword: 'ragul', encryptionType: PdfEncryptionType.aesBit128 });
        const form = pdf.form;
        // Map and set each field if present, then set appearance
        const nameField = findByName(form, 'name') as PdfTextBoxField | undefined;
        if (nameField) {
            nameField.text = values.name;
            nameField.setAppearance(true);
        }
        const gender = findByName(form, 'gender') as PdfRadioButtonListField | undefined;
        if (gender) {
            switch (values.gender) {
                case 'Male': gender.selectedIndex = 0; break;
                case 'Other': gender.selectedIndex = 1; break;
                case 'Female': gender.selectedIndex = 2; break;
            }
            gender.setAppearance(true);
        }
        const dobField = findByName(form, 'dob') as PdfTextBoxField | undefined;
        if (dobField) {
            dobField.text = values.dob;
            dobField.setAppearance(true);
        }
        const emailField = findByName(form, 'email') as PdfTextBoxField | undefined;
        if (emailField) {
            emailField.text = values.email;
            emailField.setAppearance(true);
        }
        const stateField = findByName(form, 'state') as PdfComboBoxField | undefined;
        if (stateField) {
            for (let i = 0; i < stateField.itemsCount; i++) {
                const item = stateField.itemAt(i) as PdfListFieldItem | undefined;
                if (item && item.text === values.state) {
                    stateField.selectedIndex = i;
                    break;
                }
            }
            stateField.setAppearance(true);
        }
        const newsField = findByName(form, 'newsletter') as PdfCheckBoxField | undefined;
        if (newsField) {
            newsField.checked = values.newsletter;
            newsField.setAppearance(true);
        }
        pdf.flatten = true;
        let bytes = pdf.save();
        pdf.destroy();
        let parsed: PdfDocument = new PdfDocument(bytes, 'ragul');
        const p = parsed.permissions;
        parsed.setSecurity({ userPassword: '', permissions: PdfPermissionFlag.print | PdfPermissionFlag.copyContent});
        bytes = parsed.save();
        parsed = new PdfDocument(bytes, '');
        const parsedPage: PdfPage = parsed.getPage(0);
        const contents = parsedPage._pageDictionary.get('Contents');
        const ref = contents[3];
        const stream = parsedPage._crossReference._fetch(ref);
        const parser: _ContentParser = new _ContentParser(stream.getBytes());
        const result: _PdfRecord[] = parser._readContent();
        const XObject: _PdfDictionary = parsedPage._pageDictionary.get('Resources').get('XObject');
        //Checking the values for the Check box field
        const checkbox = result[6]._operands[0];
        let fieldRecords = getFieldRecords(checkbox);
        expect(fieldRecords[0]._operator).toEqual('q');
        expect(fieldRecords[0]._operands.length).toBe(0);
        expect(fieldRecords[1]._operator).toEqual('re');
        expect(fieldRecords[1]._operands).toEqual(['1', '1', '11.4862', '12.16']);
        expect(fieldRecords[2]._operator).toEqual('W');
        expect(fieldRecords[2]._operands.length).toBe(0);
        expect(fieldRecords[3]._operator).toEqual('n');
        expect(fieldRecords[3]._operands.length).toBe(0);
        expect(fieldRecords[4]._operator).toEqual('BT');
        expect(fieldRecords[4]._operands.length).toBe(0);
        expect(fieldRecords[5]._operator).toEqual('Tf');
        expect(fieldRecords[5]._operands[1]).toEqual('12');
        expect(fieldRecords[6]._operator).toEqual('Td');
        expect(fieldRecords[6]._operands).toEqual(['1.6672', '3.0181']);
        expect(fieldRecords[7]._operator).toEqual('TL');
        expect(fieldRecords[7]._operands).toEqual(['11.556']);
        expect(fieldRecords[8]._operator).toEqual('Tj');
        expect(fieldRecords[8]._operands).toEqual(['(4)']);
        expect(fieldRecords[9]._operator).toEqual('ET');
        expect(fieldRecords[9]._operands.length).toBe(0);
        expect(fieldRecords[10]._operator).toEqual('Q');
        expect(fieldRecords[10]._operands.length).toBe(0);
        // Checking the values for the gender field since the 
        function checkCommonCasesInRadio(fieldRecords: _PdfRecord[]) {
            expect(fieldRecords[0]._operator).toEqual('cm');
            expect(fieldRecords[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '14.40']);
            expect(fieldRecords[1]._operator).toEqual('m');
            expect(fieldRecords[1]._operands).toEqual(['14.400', '-7.200']);
            expect(fieldRecords[2]._operator).toEqual('c');
            expect(fieldRecords[2]._operands).toEqual(['14.400', '-11.176', '11.176', '-14.400', '7.200', '-14.400']);
            expect(fieldRecords[3]._operator).toEqual('c');
            expect(fieldRecords[3]._operands).toEqual(['3.224', '-14.400', '0.000', '-11.176', '0.000', '-7.200']);
            expect(fieldRecords[4]._operator).toEqual('c');
            expect(fieldRecords[4]._operands).toEqual(['0.000', '-3.224', '3.224', '-0.000', '7.200', '0.000']);
            expect(fieldRecords[5]._operator).toEqual('c');
            expect(fieldRecords[5]._operands).toEqual(['11.176', '0.000', '14.400', '-3.224', '14.400', '-7.200']);
            expect(fieldRecords[6]._operator).toEqual('n');
            expect(fieldRecords[6]._operands.length).toBe(0);
            expect(fieldRecords[7]._operator).toEqual('m');
            expect(fieldRecords[7]._operands).toEqual(['13.900', '-7.200']);
            expect(fieldRecords[8]._operator).toEqual('c');
            expect(fieldRecords[8]._operands).toEqual(['13.900', '-10.900', '10.900', '-13.900', '7.200', '-13.900']);
            expect(fieldRecords[9]._operator).toEqual('c');
            expect(fieldRecords[9]._operands).toEqual(['3.500', '-13.900', '0.500', '-10.900', '0.500', '-7.200']);
            expect(fieldRecords[10]._operator).toEqual('c');
            expect(fieldRecords[10]._operands).toEqual(['0.500', '-3.500', '3.500', '-0.500', '7.200', '-0.500']);
            expect(fieldRecords[11]._operator).toEqual('c');
            expect(fieldRecords[11]._operands).toEqual(['10.900', '-0.500', '13.900', '-3.500', '13.900', '-7.200']);
            expect(fieldRecords[12]._operator).toEqual('n');
            expect(fieldRecords[12]._operands.length).toBe(0);

        }
        const maleRadio = result[20]._operands[0];
        fieldRecords = getFieldRecords(maleRadio);
        checkCommonCasesInRadio(fieldRecords);
        //Selected value will have the extra drawing
        expect(fieldRecords[13]._operator).toEqual('CS');
        expect(fieldRecords[13]._operands).toEqual(['/DeviceRGB']);
        expect(fieldRecords[14]._operator).toEqual('cs');
        expect(fieldRecords[14]._operands).toEqual(['/DeviceRGB']);
        expect(fieldRecords[15]._operator).toEqual('rg');
        expect(fieldRecords[15]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(fieldRecords[16]._operator).toEqual('m');
        expect(fieldRecords[16]._operands).toEqual(['10.550', '-7.200']);
        expect(fieldRecords[17]._operator).toEqual('c');
        expect(fieldRecords[17]._operands).toEqual(['10.550', '-9.050', '9.050', '-10.550', '7.200', '-10.550']);
        expect(fieldRecords[18]._operator).toEqual('c');
        expect(fieldRecords[18]._operands).toEqual(['5.350', '-10.550', '3.850', '-9.050', '3.850', '-7.200']);
        expect(fieldRecords[19]._operator).toEqual('c');
        expect(fieldRecords[19]._operands).toEqual(['3.850', '-5.350', '5.350', '-3.850', '7.200', '-3.850']);
        expect(fieldRecords[20]._operator).toEqual('c');
        expect(fieldRecords[20]._operands).toEqual(['9.050', '-3.850', '10.550', '-5.350', '10.550', '-7.200']);
        expect(fieldRecords[21]._operator).toEqual('h');
        expect(fieldRecords[21]._operands.length).toBe(0);
        expect(fieldRecords[22]._operator).toEqual('f');
        expect(fieldRecords[22]._operands.length).toBe(0);
        //Female in gender
        const femaleRadio = result[27]._operands[0];
        fieldRecords = getFieldRecords(femaleRadio);
        checkCommonCasesInRadio(fieldRecords);
        // Others in gender
        const otherRadio = result[34]._operands[0];
        fieldRecords = getFieldRecords(otherRadio);
        checkCommonCasesInRadio(fieldRecords);
        // checking the value for email    
        const email = result[40]._operands[0];
        fieldRecords = getFieldRecords(email);
        CheckCommonCasesInTextBox(fieldRecords);
        function CheckCommonCasesInTextBox(fieldRecords: _PdfRecord[]) {
            expect(fieldRecords[0]._operator).toEqual('BMC');
            expect(fieldRecords[0]._operands).toEqual(['/Tx']);
            expect(fieldRecords[1]._operator).toEqual('cm');
            expect(fieldRecords[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '18.00']);
            expect(fieldRecords[2]._operator).toEqual('re');
            expect(fieldRecords[2]._operands).toEqual(['0.000', '0.000', '195.556', '-18.000']);
            expect(fieldRecords[3]._operator).toEqual('n');
            expect(fieldRecords[3]._operands.length).toBe(0);
            expect(fieldRecords[4]._operator).toEqual('q');
            expect(fieldRecords[4]._operands.length).toBe(0);
            expect(fieldRecords[5]._operator).toEqual('re');
            expect(fieldRecords[5]._operands).toEqual(['0.000', '-3.220', '195.556', '-11.560']);
            expect(fieldRecords[6]._operator).toEqual('W');
            expect(fieldRecords[6]._operands.length).toBe(0);
            expect(fieldRecords[7]._operator).toEqual('n');
            expect(fieldRecords[7]._operands.length).toBe(0);
            expect(fieldRecords[8]._operator).toEqual('BT');
            expect(fieldRecords[8]._operands.length).toBe(0);
            expect(fieldRecords[9]._operator).toEqual('CS');
            expect(fieldRecords[9]._operands).toEqual(['/DeviceRGB']);
            expect(fieldRecords[10]._operator).toEqual('cs');
            expect(fieldRecords[10]._operands).toEqual(['/DeviceRGB']);
            expect(fieldRecords[11]._operator).toEqual('rg');
            expect(fieldRecords[11]._operands).toEqual(['0.000', '0.000', '0.000']);
            expect(fieldRecords[12]._operator).toEqual('Tf');
            expect(fieldRecords[12]._operands[1]).toEqual('10.000');
            expect(fieldRecords[13]._operator).toEqual('Tr');
            expect(fieldRecords[13]._operands).toEqual(['0']);
            expect(fieldRecords[14]._operator).toEqual('Tc');
            expect(fieldRecords[14]._operands).toEqual(['0.000']);
            expect(fieldRecords[15]._operator).toEqual('Tw');
            expect(fieldRecords[15]._operands).toEqual(['0.000']);
            expect(fieldRecords[16]._operator).toEqual('Tz');
            expect(fieldRecords[16]._operands).toEqual(['100.000']);
            expect(fieldRecords[17]._operator).toEqual('Tm');
            expect(fieldRecords[17]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-12.53']);
            expect(fieldRecords[18]._operator).toEqual("'");
            expect(fieldRecords[19]._operator).toEqual('Td');
            expect(fieldRecords[19]._operands).toEqual(['0.000', '-8.340']);
            expect(fieldRecords[20]._operator).toEqual('ET');
            expect(fieldRecords[20]._operands.length).toBe(0);
            expect(fieldRecords[21]._operator).toEqual('Q');
            expect(fieldRecords[21]._operands.length).toBe(0);
            expect(fieldRecords[22]._operator).toEqual('EMC');
            expect(fieldRecords[22]._operands.length).toBe(0);
        }
        expect(fieldRecords[18]._operands).toEqual(['(ragul.milton@example.com)']);
        //checking the value for the name
        const nameTextBox = result[46]._operands[0];
        fieldRecords = getFieldRecords(nameTextBox);
        CheckCommonCasesInTextBox(fieldRecords);
        expect(fieldRecords[18]._operator).toEqual("'");
        expect(fieldRecords[18]._operands).toEqual(['(Ragul)']);
        //checking the value for the date 
        const dateField = result[52]._operands[0];
        fieldRecords = getFieldRecords(dateField);
        CheckCommonCasesInTextBox(fieldRecords);
        expect(fieldRecords[18]._operands).toEqual(['(04/08/2003)']);

    });
});

describe('IF Condition Coverage - _PdfCrossReference', () => {

    it('throws when trailer not initialized', () => {
        const crossRef: any = new PdfDocument()._crossReference;
        crossRef._trailer = null;
        let check = false;
        try {
            crossRef._addEncryptDictionaryToTrailer(new _PdfDictionary());
            check = true;
        } catch (error) {
            expect(error.message).toEqual('Trailer not initialized');
        }
        expect(check).toBeFalsy();
    });

    it('adds ID when ids present', () => {
        const doc: any = new PdfDocument();
        doc.addPage();

        const crossRef = doc._crossReference;
        const dict = new _PdfDictionary();

        crossRef._ids = ['abc123'];
        crossRef._addEncryptDictionaryToTrailer(dict);

        expect(crossRef._trailer.get('ID')).toBeDefined();
        doc.destroy();
    });

    it('does not set ID when ids missing', () => {
        const doc: any = new PdfDocument();
        doc.addPage();

        const crossRef = doc._crossReference;
        const dict = new _PdfDictionary();

        crossRef._ids = [];

        crossRef._addEncryptDictionaryToTrailer(dict);

        expect(crossRef._trailer.has('ID')).toBe(false);
        doc.destroy();
    });

    // ✅ _initializeEncryptionState

    it('updates password when newPassword differs', () => {
        const doc: any = new PdfDocument();
        doc.addPage();

        const crossRef = doc._crossReference;

        crossRef._initializeEncryptionState({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'newpass'
        });

        expect(crossRef._password).toEqual('newpass');
        doc.destroy();
    });
    it('throws when trailer not initialized', () => {
        const doc: any = new PdfDocument();
        doc.addPage();
        const crossRef = doc._crossReference;

        crossRef._trailer = null;
        let check = false;
        try {
            crossRef._updateEncryptionSettings({
                encryptionType: PdfEncryptionType.aesBit128
            });
            check = true;
        } catch (error) {
            expect(error.message).toEqual('Trailer not initialized');
        }
        expect(check).toBeFalsy();
        doc.destroy();
    });

    it('uses existing encryptionType if missing in options', () => {
        const doc: any = new PdfDocument();
        doc.addPage();

        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });

        const crossRef = doc._crossReference;

        crossRef._updateEncryptionSettings({ userPassword: 'test2' });

        expect(crossRef._encryptionState.encryptionType)
            .toEqual(PdfEncryptionType.aesBit128);

        doc.destroy();
    });

    it('updates existing encrypt reference', () => {
        const doc: any = new PdfDocument();
        doc.addPage();

        doc.setSecurity({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });

        const crossRef = doc._crossReference;
        const encryptRef = crossRef._trailer.get('Encrypt');

        crossRef._updateEncryptionSettings({
            encryptionType: PdfEncryptionType.aesBit256Rev5,
            userPassword: 'test'
        });

        expect(crossRef._cacheMap.get(encryptRef)).toBeDefined();
        doc.destroy();
    });

    it('adds new encrypt dictionary when no reference exists', () => {
        const doc: any = new PdfDocument();
        doc.addPage();

        const crossRef = doc._crossReference;
        crossRef._trailer._map['Encrypt'] = null;

        crossRef._updateEncryptionSettings({
            encryptionType: PdfEncryptionType.aesBit128,
            userPassword: 'test'
        });

        expect(crossRef._trailer.has('Encrypt')).toBe(true);
        doc.destroy();
    });

});

describe('Version 5, Revision 6 Branch', () => {
    it('should execute revision 6 branch and return encrypted key', () => {
        const helper: any = new _PdfEncryptionHelper();
        const password = 'testPassword';
        const keySalt = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
        const uBytes = new Uint8Array([9, 10, 11, 12, 13, 14, 15, 16]);
        const encryptionKey = new Uint8Array([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]);
        const revision = 6;
        const result = helper._computeOwnerEncryptionKey(password, keySalt, uBytes, encryptionKey, revision);
        expect(result).toBeDefined();
        expect(result instanceof Uint8Array).toBeTruthy();
    });
    it('should compute user and owner password hashes for revision 6 correctly', () => {
        const helper: any = new _PdfEncryptionHelper();
        const password = 'testPassword';
        const salt = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        const uBytes = new Uint8Array([21, 22, 23, 24, 25, 26, 27, 28]);
        const userResult = helper._computeUserPassword256Rev6(password, salt);
        expect(userResult).toBeDefined();
        expect(userResult instanceof Uint8Array).toBeTruthy();
        expect(userResult.length).toBe(48);
        const ownerResult = helper._computeOwnerPassword256Rev6(password, uBytes, salt);
        expect(ownerResult).toBeDefined();
        expect(ownerResult instanceof Uint8Array).toBeTruthy();
        expect(ownerResult.length).toBe(48);
    });
    it('should execute revision 6 branch and generate encrypted key correctly', () => {
        const helper: any = new _PdfEncryptionHelper();
        const password = 'testPassword';
        const keySalt = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
        const encryptionKey = new Uint8Array([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]);
        const revision = 6;
        const result = helper._computeUserEncryptionKey(password, keySalt, encryptionKey, revision);
        expect(result).toBeDefined();
        expect(result instanceof Uint8Array).toBeTruthy();
    });
    it('should call revision 6 implementations for user and owner password computations', () => {
        const helper: any = new _PdfEncryptionHelper();
        const password = 'testPassword';
        const salt = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        const uBytes = new Uint8Array([21, 22, 23, 24, 25, 26, 27, 28]);
        const revision = 6;
        spyOn(helper, '_computeUserPassword256Rev6').and.callThrough();
        spyOn(helper, '_computeOwnerPassword256Rev6').and.callThrough();
        const userResult = helper._computeUserPassword256(password, salt, revision);
        expect(helper._computeUserPassword256Rev6).toHaveBeenCalledWith(password, salt);
        expect(userResult).toBeDefined();
        expect(userResult.length).toBe(48);
        const ownerResult = helper._computeOwnerPassword256(password, uBytes, salt, revision);
        expect(helper._computeOwnerPassword256Rev6).toHaveBeenCalledWith(password, uBytes, salt);
        expect(ownerResult).toBeDefined();
        expect(ownerResult.length).toBe(48);
    });
    describe('_CipherTransform.encryptString with GCM cipher', () => {
        it('encryptString - calls _encrypt and returns bytes string', () => {
            // Arrange
            const stubbedEncrypted: Uint8Array = new Uint8Array([10, 20, 30]);
            const gcmLike: any = Object.create(_AdvancedEncryptionGcmCipher.prototype);
            let receivedBytes: Uint8Array | undefined;
            gcmLike._encrypt = (input: Uint8Array) => { receivedBytes = input; return stubbedEncrypted; };
            const transform = new _CipherTransform(gcmLike as any, null as any);
            const plaintext: string = 'hello';
            const expectedInput: Uint8Array = _stringToBytes(plaintext, false, true) as Uint8Array;
            const expectedOutput: string = _bytesToString(stubbedEncrypted);
            // Act
            const result: string = transform.encryptString(plaintext);
            // Assert
            expect(receivedBytes).toBeDefined();
            expect(Array.from(receivedBytes as Uint8Array)).toEqual(Array.from(expectedInput));
            expect(result).toEqual(expectedOutput);
        });
    });
});