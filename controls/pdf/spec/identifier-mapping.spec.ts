import { _ConstructionType, _RealEncodingBase, _RealEncodingScale, _RealValueType, _TagClassType, _UniversalType } from "../src/pdf/core/security/digital-signature/asn1/enumerator";
import { _PdfObjectIdentifier } from "../src/pdf/core/security/digital-signature/asn1/identifier-mapping";
import { _isGraphicCharacter, _isPrintableCharacter, _validateDate, _validateTime } from "../src/pdf/core/security/digital-signature/asn1/syntax-verifier";

describe('1041541 - Identifier Mapping', () => {
    it('1041541 - should allow an oid with exactly two nodes', () => {
        const oid = new _PdfObjectIdentifier();
        expect(() => {
            oid._fromParts([1, 2]);
        }).not.toThrow();
    });
    it('1041541 - should decode first node 2 correctly', () => {
        const oid = new _PdfObjectIdentifier()._fromBytesUnsafe(new Uint8Array([80]));
        expect(oid._getNodes()).toEqual([2, 0]);
    });
    it('1041541 - should decode second node correctly for values above 119', () => {
        const oid = new _PdfObjectIdentifier()._fromBytesUnsafe(
            new Uint8Array([120])
        );
        expect(oid._getNodes()).toEqual([2, 40]);
    });
    it('1041541 - should decode encoded value 80 as oid 2.0', () => {
        const oid = new _PdfObjectIdentifier()._fromBytesUnsafe(
            new Uint8Array([80])
        );
        expect(oid._getNodes()).toEqual([2, 0]);
    });
    it('1041541 - should decode oid 2.40 correctly', () => {
        const oid = new _PdfObjectIdentifier()._fromBytesUnsafe(
            new Uint8Array([120])
        );
        expect(oid.toString()).toBe('2.40');
    });
    it('1041541 - should decode first node 2 correctly when first encoded component is 80', () => {
        const oid = new _PdfObjectIdentifier()._fromBytesUnsafe(
            new Uint8Array([80])
        );
        expect(oid._getNodes()).toEqual([2, 0]);
    });
    it('1041541 - should decode oid node when combined value exceeds 79', () => {
        const oid = new _PdfObjectIdentifier()._fromBytesUnsafe(
            new Uint8Array([81])
        );
        expect(oid._getNodes()).toEqual([2, 1]);
    });
    it('1041541 - should throw when a new oid node starts with padding byte', () => {
        const oid = new _PdfObjectIdentifier();
        expect(() => {
            oid._fromBytes(new Uint8Array([42, 0x81, 0x01, 0x80, 0x01]));
        }).toThrowError();
    });
    it('1041541 - should encode multiple small relative oid arcs', () => {
        const oid = new _PdfObjectIdentifier();
        const result = oid._encodeRelativeObjectIdentifier([1, 2, 127]);
        expect(Array.from(result)).toEqual([1, 2, 127]);
        expect(
            Array.from(
                oid._encodeRelativeObjectIdentifier([1, 2, 127])
            )
        ).toEqual([1, 2, 127]);
    });
    it('1041541 - should return a new empty array for an empty relative oid', () => {
        const oid = new _PdfObjectIdentifier();
        const result = oid._decodeRelativeObjectIdentifier(new Uint8Array([]));
        expect(result.length).toBe(0);
    });
    it('1041541 - should decode a valid multi-byte relative oid node containing 0x80 continuation byte', () => {
        const oid = new _PdfObjectIdentifier();
        expect(
            oid._decodeRelativeObjectIdentifier(
                new Uint8Array([0x81, 0x80, 0x01])
            )
        ).toEqual([16385]);
    });
    it('1041541 - should accept numeric prefix when creating oid', () => {
        const oid = new _PdfObjectIdentifier();
        expect(() => {
            oid._fromParts([2], 1);
        }).not.toThrow();
    });
    it('1041541 - should prepend numeric prefix to oid nodes', () => {
        const oid = new _PdfObjectIdentifier();
        const result = oid._fromParts([2], 1);
        expect(result.toString()).toBe('1.2');
    });
    it('1041541 - should throw if numeric prefix creates an invalid first node', () => {
        const oid = new _PdfObjectIdentifier();
        expect(() => {
            oid._fromParts([0], 3);
        }).toThrow();
    });
    it('1041541 - should throw when first oid node is negative', () => {
        const oid = new _PdfObjectIdentifier();
        expect(() => {
            oid._fromParts([-1, 2]);
        }).toThrow();
    });
    it('1041541 - should allow first oid node to be 0', () => {
        const oid = new _PdfObjectIdentifier();
        expect(() => {
            oid._fromParts([0, 0]);
        }).not.toThrow();
    });
    it('1041541 - should allow second node greater than 39 when first node is 2', () => {
        const oid = new _PdfObjectIdentifier();
        expect(() => {
            oid._fromParts([2, 40]);
        }).not.toThrow();
    });
    it('1041541 - should allow second node equal to 39 when first node is 1', () => {
        const oid = new _PdfObjectIdentifier();
        expect(() => {
            oid._fromParts([1, 39]);
        }).not.toThrow();
    });
    it('1041541 - should report correct error message for invalid second node', () => {
        const oid = new _PdfObjectIdentifier();
        expect(() => {
            oid._fromParts([1, 40]);
        }).toThrowError();
    });
    it('1041541 - should allow valid multi-byte oid nodes containing 0x80 continuation bytes', () => {
        const oid = new _PdfObjectIdentifier();
        expect(() => {
            oid._fromBytes(new Uint8Array([42, 0x81, 0x80, 0x01]));
        }).not.toThrow();
    });
    it('1041541 - should reject padding after a continuation byte', () => {
        const oid = new _PdfObjectIdentifier();
        expect(() => {
            oid._fromBytes(
                new Uint8Array([42, 0x81, 0x01, 0x80, 0x01])
            );
        }).toThrowError();
    });
    it('1041541 - should reject a new node beginning with 0x80 padding byte', () => {
        const oid = new _PdfObjectIdentifier();
        expect(() => {
            oid._fromBytes(
                new Uint8Array([42, 0x80, 0x01])
            );
        }).toThrowError();
    });
    it('1041541 - should reject padding after completing a multi-byte node', () => {
        const oid = new _PdfObjectIdentifier();
        expect(() => {
            oid._fromBytes(
                new Uint8Array([42, 0x81, 0x01, 0x80, 0x01])
            );
        }).toThrowError();
    });
    it('1041541 - should encode a large relative oid arc', () => {
        const oid = new _PdfObjectIdentifier();
        const result = oid._encodeRelativeObjectIdentifier([128]);
        expect(Array.from(result)).toEqual([0x81, 0x00]);
    });
    it('1041541 - should encode a single small relative oid arc', () => {
        const oid = new _PdfObjectIdentifier();
        const result = oid._encodeRelativeObjectIdentifier([1]);
        expect(Array.from(result)).toEqual([1]);
    });
    it('1041541 - should encode arc 128 as base 128 form', () => {
        const oid = new _PdfObjectIdentifier();
        const result = oid._encodeRelativeObjectIdentifier([128]);
        expect(Array.from(result)).toEqual([0x81, 0x00]);
    });
    it('1041541 - should encode arc 16385 as base 128 form', () => {
        const oid = new _PdfObjectIdentifier();
        const result = oid._encodeRelativeObjectIdentifier([16385]);
        expect(Array.from(result)).toEqual([0x81, 0x80, 0x01]);
    });
    it('1041541 - should return an empty array for an empty relative oid', () => {
        const oid = new _PdfObjectIdentifier();
        expect(
            oid._decodeRelativeObjectIdentifier(new Uint8Array([]))
        ).toEqual([]);
    });
    it('1041541 - should throw the expected error message for invalid second node', () => {
        const oid = new _PdfObjectIdentifier();
        try {
            oid._fromParts([1, 40]);
            fail('Expected an error to be thrown.');
        } catch (e) {
            const message = (e as Error).message;
            expect(
                message === 'Invalid oid: When Node #1 is 0 or 1, Node #2 must be 0–39. Received: 1,40.' ||
                message === 'Invalid oid: When Node #1 is 0 or 1, Node #2 must be 0-39. Received: 1,40.'
            ).toBe(true);
        }
    });
    it('1041541 - should end the validation error message with a period', () => {
        const oid = new _PdfObjectIdentifier();
        try {
            oid._fromParts([1, 40]);
            fail('Expected error to be thrown');
        } catch (e) {
            expect((e as Error).message).toBe(
                'Invalid oid: When Node #1 is 0 or 1, Node #2 must be 0–39. Received: 1,40.'
            );
        }
    });
    it('1041541 - should throw padding error after completing a multi-byte node', () => {
        const oid = new _PdfObjectIdentifier();
        try {
            oid._fromBytes(
                new Uint8Array([42, 0x81, 0x01, 0x80, 0x01])
            );
            fail('Expected an error to be thrown.');
        } catch (e) {
            const message = (e as Error).message;
            expect(
                message === 'Padding is not allowed in object identifier nodes' ||
                message === 'Padding is not allowed in object identifier nodes.'
            ).toBe(true);
        }
    });
    it('1041541 - should decode a valid oid containing 0x80 continuation byte', () => {
        const oid = new _PdfObjectIdentifier()._fromBytes(
            new Uint8Array([42, 0x81, 0x80, 0x01])
        );
        expect(oid._getNodes()).toEqual([1, 2, 16385]);
    });
    it('1041541 - should preserve multi-byte node value 16385', () => {
        const oid = new _PdfObjectIdentifier()._fromBytes(
            new Uint8Array([42, 0x81, 0x80, 0x01])
        );
        expect(oid.toString()).toBe('1.2.16385');
    });
    it('1041541 - should encode arc 127 as a single byte', () => {
        const oid = new _PdfObjectIdentifier();
        expect(
            Array.from(oid._encodeRelativeObjectIdentifier([127]))
        ).toEqual([127]);
    });
});
describe('1041536 - Enumerator', () => {
    it('1041536 - should expose the universal enum name', () => {
        expect(_TagClassType[0]).toBe('universal');
    });
    it('1041536 - should expose the abstractSyntaxPrivate enum name', () => {
        expect(_TagClassType[3]).toBe('abstractSyntaxPrivate');
    });
    it('1041536 - should expose the nullValue enum name', () => {
        expect(_TagClassType[5]).toBe('nullValue');
    });
    it('1041536 - should map enum names to values correctly', () => {
        expect(_TagClassType.universal).toBe(0);
        expect(_TagClassType.application).toBe(1);
        expect(_TagClassType.context).toBe(2);
        expect(_TagClassType.abstractSyntaxPrivate).toBe(3);
        expect(_TagClassType.nullValue).toBe(5);
    });
    it('1041536 - should map primitive to numeric value 0', () => {
        expect(_ConstructionType.primitive).toBe(0);
    });
    it('1041536 - should map constructed correctly', () => {
        expect(_ConstructionType.constructed).toBe(1);
        expect(_ConstructionType[1]).toBe('constructed');
    });
    it('1041536 - should map numeric value 0 to primitive', () => {
        expect(_ConstructionType[0]).toBe('primitive');
    });
    it('1041536 - should map minusZero to 67', () => {
        expect(_RealValueType.minusZero).toBe(67);
    });
    it('1041536 - should map 67 to minusZero', () => {
        expect(_RealValueType[67]).toBe('minusZero');
    });
    it('1041536 - should map 0 to base2', () => {
        expect(_RealEncodingBase[0]).toBe('base2');
    });
    it('1041536 - should map 16 to base8', () => {
        expect(_RealEncodingBase[16]).toBe('base8');
    });
    it('1041536 - should map base2 to 0', () => {
        expect(_RealEncodingBase.base2).toBe(0);
    });
    it('1041536 - should map base8 to 16', () => {
        expect(_RealEncodingBase.base8).toBe(16);
    });
    it('1041536 - should map scale0 correctly', () => {
        expect(_RealEncodingScale.scale0).toBe(0);
        expect(_RealEncodingScale[0]).toBe('scale0');
    });
    it('1041536 - should map scale1 correctly', () => {
        expect(_RealEncodingScale.scale1).toBe(4);
        expect(_RealEncodingScale[4]).toBe('scale1');
    });
    it('1041536 - should map scale2 correctly', () => {
        expect(_RealEncodingScale.scale2).toBe(8);
        expect(_RealEncodingScale[8]).toBe('scale2');
    });
    it('1041536 - should map scale3 correctly', () => {
        expect(_RealEncodingScale.scale3).toBe(12);
        expect(_RealEncodingScale[12]).toBe('scale3');
    });
    it('1041536 - should map endOfContent correctly', () => {
        expect(_UniversalType.endOfContent).toBe(0);
        expect(_UniversalType[0]).toBe('endOfContent');
    });
    it('1041536 - should map bitString correctly', () => {
        expect(_UniversalType.bitString).toBe(3);
        expect(_UniversalType[3]).toBe('bitString');
    });
    it('1041536 - should map octetString correctly', () => {
        expect(_UniversalType.octetString).toBe(4);
        expect(_UniversalType[4]).toBe('octetString');
    });
    it('1041536 - should map objectIdentifier correctly', () => {
        expect(_UniversalType.objectIdentifier).toBe(6);
        expect(_UniversalType[6]).toBe('objectIdentifier');
    });
    it('1041536 - should map external correctly', () => {
        expect(_UniversalType.external).toBe(8);
        expect(_UniversalType[8]).toBe('external');
    });
    it('1041536 - should map realNumber correctly', () => {
        expect(_UniversalType.realNumber).toBe(9);
        expect(_UniversalType[9]).toBe('realNumber');
    });
    it('1041536 - should map enumerated correctly', () => {
        expect(_UniversalType.enumerated).toBe(10);
        expect(_UniversalType[10]).toBe('enumerated');
    });
    it('1041536 - should map embeddedDataValue correctly', () => {
        expect(_UniversalType.embeddedDataValue).toBe(11);
        expect(_UniversalType[11]).toBe('embeddedDataValue');
    });
    it('1041536 - should map utf8String correctly', () => {
        expect(_UniversalType.utf8String).toBe(12);
        expect(_UniversalType[12]).toBe('utf8String');
    });
    it('1041536 - should map relativeObjectIdentifier correctly', () => {
        expect(_UniversalType.relativeObjectIdentifier).toBe(13);
        expect(_UniversalType[13]).toBe('relativeObjectIdentifier');
    });
    it('1041536 - should map reservedBit15 correctly', () => {
        expect(_UniversalType.reservedBit15).toBe(15);
        expect(_UniversalType[15]).toBe('reservedBit15');
    });
    it('1041536 - should map sequence correctly', () => {
        expect(_UniversalType.sequence).toBe(16);
        expect(_UniversalType[16]).toBe('sequence');
    });
    it('1041536 - should map reservedBit15 to value 15', () => {
        expect(_UniversalType.reservedBit15).toBe(15);
    });
    it('1041536 - should map value 15 to reservedBit15', () => {
        expect(_UniversalType[15]).toBe('reservedBit15');
    });
    it('1041536 - should map abstractSyntaxSet correctly', () => {
        expect(_UniversalType.abstractSyntaxSet).toBe(17);
        expect(_UniversalType[17]).toBe('abstractSyntaxSet');
    });
    it('1041536 - should map videoTextInformationSystem correctly', () => {
        expect(_UniversalType.videoTextInformationSystem).toBe(21);
        expect(_UniversalType[21]).toBe('videoTextInformationSystem');
    });
    it('1041536 - should map internationalAlphabetString correctly', () => {
        expect(_UniversalType.internationalAlphabetString).toBe(22);
        expect(_UniversalType[22]).toBe('internationalAlphabetString');
    });
    it('1041536 - should map graphicString correctly', () => {
        expect(_UniversalType.graphicString).toBe(25);
        expect(_UniversalType[25]).toBe('graphicString');
    });
    it('1041536 - should map visibleString correctly', () => {
        expect(_UniversalType.visibleString).toBe(26);
        expect(_UniversalType[26]).toBe('visibleString');
    });
    it('1041536 - should map generalString correctly', () => {
        expect(_UniversalType.generalString).toBe(27);
        expect(_UniversalType[27]).toBe('generalString');
    });
    it('1041536 - should map characterString correctly', () => {
        expect(_UniversalType.characterString).toBe(29);
        expect(_UniversalType[29]).toBe('characterString');
    });
    it('1041536 - should map timeOfDay correctly', () => {
        expect(_UniversalType.timeOfDay).toBe(32);
        expect(_UniversalType[32]).toBe('timeOfDay');
    });
    it('1041536 - should map dateTime correctly', () => {
        expect(_UniversalType.dateTime).toBe(33);
        expect(_UniversalType[33]).toBe('dateTime');
    });
    it('1041536 - should map duration correctly', () => {
        expect(_UniversalType.duration).toBe(34);
        expect(_UniversalType[34]).toBe('duration');
    });
    it('1041536 - should map objectIdResourceIdentifier correctly', () => {
        expect(_UniversalType.objectIdResourceIdentifier).toBe(35);
        expect(_UniversalType[35]).toBe('objectIdResourceIdentifier');
    });
    it('1041536 - should map numeric value 1 to application', () => {
        expect(_TagClassType[1]).toBe('application');
    });
    it('1041536 - should map numeric value 2 to context', () => {
        expect(_TagClassType[2]).toBe('context');
    });
    it('1041536 - should map plusInfinity correctly', () => {
        expect(_RealValueType.plusInfinity).toBe(64);
        expect(_RealValueType[64]).toBe('plusInfinity');
    });
    it('1041536 - should map minusInfinity correctly', () => {
        expect(_RealValueType.minusInfinity).toBe(65);
        expect(_RealValueType[65]).toBe('minusInfinity');
    });
    it('1041536 - should map notANumber correctly', () => {
        expect(_RealValueType.notANumber).toBe(66);
        expect(_RealValueType[66]).toBe('notANumber');
    });
    it('1041536 - should map minusZero correctly', () => {
        expect(_RealValueType.minusZero).toBe(67);
        expect(_RealValueType[67]).toBe('minusZero');
    });
    it('1041536 - should map base16 correctly', () => {
        expect(_RealEncodingBase.base16).toBe(32);
        expect(_RealEncodingBase[32]).toBe('base16');
    });
    it('1041536 - should map abstractSyntaxBoolean correctly', () => {
        expect(_UniversalType.abstractSyntaxBoolean).toBe(1);
        expect(_UniversalType[1]).toBe('abstractSyntaxBoolean');
    });
    it('1041536 - should map integer correctly', () => {
        expect(_UniversalType.integer).toBe(2);
        expect(_UniversalType[2]).toBe('integer');
    });
    it('1041536 - should map nullValue correctly', () => {
        expect(_UniversalType.nullValue).toBe(5);
        expect(_UniversalType[5]).toBe('nullValue');
    });
    it('1041536 - should map objectDescriptor correctly', () => {
        expect(_UniversalType.objectDescriptor).toBe(7);
        expect(_UniversalType[7]).toBe('objectDescriptor');
    });
    it('1041536 - should map numericString correctly', () => {
        expect(_UniversalType.numericString).toBe(18);
        expect(_UniversalType[18]).toBe('numericString');
    });
    it('1041536 - should map printableString correctly', () => {
        expect(_UniversalType.printableString).toBe(19);
        expect(_UniversalType[19]).toBe('printableString');
    });
    it('1041536 - should map universalTime correctly', () => {
        expect(_UniversalType.universalTime).toBe(23);
        expect(_UniversalType[23]).toBe('universalTime');
    });
    it('1041536 - should map generalizedTime correctly', () => {
        expect(_UniversalType.generalizedTime).toBe(24);
        expect(_UniversalType[24]).toBe('generalizedTime');
    });
    it('1041536 - should map universalString correctly', () => {
        expect(_UniversalType.universalString).toBe(28);
        expect(_UniversalType[28]).toBe('universalString');
    });
    it('1041536 - should map bmpString correctly', () => {
        expect(_UniversalType.bmpString).toBe(30);
        expect(_UniversalType[30]).toBe('bmpString');
    });
    it('1041536 - should map date correctly', () => {
        expect(_UniversalType.date).toBe(31);
        expect(_UniversalType[31]).toBe('date');
    });
    it('1041536 - should map relativeResourceIdentifier correctly', () => {
        expect(_UniversalType.relativeResourceIdentifier).toBe(36);
        expect(_UniversalType[36]).toBe('relativeResourceIdentifier');
    });
    it('1041536 - should map time to value 14', () => {
        expect(_UniversalType.time).toBe(14);
        expect(_UniversalType[14]).toBe('time');
    });
    it('1041536 - should map teleprinterTextExchange correctly', () => {
        expect(_UniversalType.teleprinterTextExchange).toBe(20);
        expect(_UniversalType[20]).toBe('teleprinterTextExchange');
    });
});
describe('1041546 - Syntax verifier', () => {
    it('1041546 - should validate printable character boundary conditions', () => {
        expect(_isPrintableCharacter(0x39)).toBe(true);  // '9'
        expect(_isPrintableCharacter(0x5A)).toBe(true);  // 'Z'
        expect(_isPrintableCharacter(0x7A)).toBe(true);  // 'z'
        expect(_isPrintableCharacter(0x5B)).toBe(false); // '['
        expect(_isPrintableCharacter(0x7B)).toBe(false); // '{'
    });
    it('1041546 - should throw when month is not an integer', () => {
        expect(() => {
            _validateDate('Date', 2024, 1.5, 1);
        }).toThrowError();
    });
    it('1041546 - should throw when year is not an integer', () => {
        expect(() => {
            _validateDate('Date', 2024.5, 1, 1);
        }).toThrowError();
    });
    it('1041546 - should report invalid month when month is not an integer', () => {
        try {
            _validateDate('Date', 2024, 1.5, 1);
            fail('Expected error');
        } catch (e) {
            expect((e as Error).message).toBe('Invalid month in Date');
        }
    });
    it('1041546 - should throw when date is not an integer', () => {
        expect(() => {
            _validateDate('Date', 2024, 1, 1.5);
        }).toThrowError();
    });
    it('1041546 - should allow February 29 in leap year 2024', () => {
        expect(() => {
            _validateDate('Date', 2024, 1, 29);
        }).not.toThrow();
    });
    it('1041546 - should reject February 29 in non leap year 1900', () => {
        expect(() => {
            _validateDate('Date', 1900, 1, 29);
        }).toThrowError();
    });
    it('1041546 - should allow February 28 in a non-leap year', () => {
        expect(() => {
            _validateDate('Date', 2023, 1, 28);
        }).not.toThrow();
    });
    it('1041546 - should allow maximum valid time values', () => {
        expect(() => {
            _validateTime('Time', 23, 59, 59);
        }).not.toThrow();
    });
    it('1041546 - should allow minimum valid time values', () => {
        expect(() => {
            _validateTime('Time', 0, 0, 0);
        }).not.toThrow();
    });
    it('1041546 - should allow minimum valid month', () => {
        expect(() => {
            _validateDate('Date', 2024, 0, 1);
        }).not.toThrow();
    });
    it('1041546 - should accept graphic character at upper boundary', () => {
        expect(_isGraphicCharacter(0x7E)).toBe(true);
    });
    it('1041546 - should reject graphic character above upper boundary', () => {
        expect(_isGraphicCharacter(0x7F)).toBe(false);
    });
    it('1041546 - should identify printable digit 9', () => {
        expect(_isPrintableCharacter(0x39)).toBe(true);
    });
});