import { _RtlCharacters } from "../src/pdf/core/graphics/rightToLeft/bidirectional";
describe('bidirectional survived mutation coverage', () => {
    it('initializes bidi character types through the final range', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        // Act
        const firstType: number = rtlCharacters._rtlCharacterTypes[0];
        const latinType: number = rtlCharacters._rtlCharacterTypes[65];
        const hebrewType: number = rtlCharacters._rtlCharacterTypes[1488];
        const arabicType: number = rtlCharacters._rtlCharacterTypes[1569];
        const finalType: number = rtlCharacters._rtlCharacterTypes[65535];
        // Assert
        expect(firstType).toBe(rtlCharacters.BN);
        expect(latinType).toBe(rtlCharacters.L);
        expect(hebrewType).toBe(rtlCharacters.R);
        expect(arabicType).toBe(rtlCharacters.AL);
        expect(finalType).toBe(rtlCharacters.L);
    });
    it('advances through every compact character type triplet', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        const expectedTripletCount: number = rtlCharacters._charTypes.length / 3;
        let populatedTripletCount: number = 0;
        // Act
        for (let index: number = 0; index < rtlCharacters._charTypes.length; index += 3) {
            const start: number = rtlCharacters._charTypes[index];
            const expectedType: number = rtlCharacters._charTypes[index + 2];
            if (rtlCharacters._rtlCharacterTypes[start] === expectedType) {
                populatedTripletCount++;
            }
        }
        // Assert
        expect(rtlCharacters._charTypes.length % 3).toBe(0);
        expect(populatedTripletCount).toBe(expectedTripletCount);
    });
    it('returns a new visual level array instead of the internal levels array', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        // Act
        const visualLevels: number[] = rtlCharacters._getVisualOrder('abc', false);
        visualLevels[0] = 99;
        // Assert
        expect(visualLevels).not.toBe(rtlCharacters._levels);
        expect(visualLevels).toEqual([99, 0, 0]);
        expect(rtlCharacters._levels).toEqual([0, 0, 0]);
    });
    it('creates an empty character code result and maps every source character', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        const inputText: string = 'A\u05D0\u0627';
        // Act
        const characterCodes: number[] = rtlCharacters._getCharacterCode(inputText);
        // Assert
        expect(characterCodes.length).toBe(3);
        expect(characterCodes).toEqual([
            rtlCharacters.L,
            rtlCharacters.R,
            rtlCharacters.AL
        ]);
    });
    it('sets every level to the selected paragraph level', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._length = 4;
        rtlCharacters._textOrder = rtlCharacters.lre;
        rtlCharacters._levels = [9, 8, 7, 6];
        // Act
        rtlCharacters._setLevels();
        // Assert
        expect(rtlCharacters._levels).toEqual([1, 1, 1, 1]);
        expect(rtlCharacters._levels.length).toBe(4);
    });
    it('keeps an empty level collection empty', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._length = 0;
        rtlCharacters._textOrder = rtlCharacters.L;
        rtlCharacters._levels = [];
        // Act
        rtlCharacters._setLevels();
        // Assert
        expect(rtlCharacters._levels).toEqual([]);
        expect(rtlCharacters._levels.length).toBe(0);
    });
});
describe('Bidirectional lines 422 to 577 survived mutant coverage', () => {
    it('initializes bidi character types through the final range', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        // Act
        const firstType: number = rtlCharacters._rtlCharacterTypes[0];
        const latinType: number = rtlCharacters._rtlCharacterTypes[65];
        const hebrewType: number = rtlCharacters._rtlCharacterTypes[1488];
        const arabicType: number = rtlCharacters._rtlCharacterTypes[1569];
        const finalType: number = rtlCharacters._rtlCharacterTypes[65535];
        // Assert
        expect(firstType).toBe(rtlCharacters.BN);
        expect(latinType).toBe(rtlCharacters.L);
        expect(hebrewType).toBe(rtlCharacters.R);
        expect(arabicType).toBe(rtlCharacters.AL);
        expect(finalType).toBe(rtlCharacters.L);
    });
    it('populates the complete BMP character type table from every range triplet', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        let matchedRangeCount: number = 0;
        const expectedRangeCount: number = rtlCharacters._charTypes.length / 3;
        // Act
        for (let index: number = 0; index < rtlCharacters._charTypes.length; index += 3) {
            const start: number = rtlCharacters._charTypes[index];
            const end: number = rtlCharacters._charTypes[index + 1];
            const characterType: number = rtlCharacters._charTypes[index + 2];
            if (rtlCharacters._rtlCharacterTypes[start] === characterType &&
                rtlCharacters._rtlCharacterTypes[end] === characterType) {
                matchedRangeCount++;
            }
        }
        // Assert
        expect(rtlCharacters._charTypes.length % 3).toBe(0);
        expect(matchedRangeCount).toBe(expectedRangeCount);
        expect(rtlCharacters._rtlCharacterTypes[1488]).toBe(rtlCharacters.R);
        expect(rtlCharacters._rtlCharacterTypes[1569]).toBe(rtlCharacters.AL);
        expect(rtlCharacters._rtlCharacterTypes[8234]).toBe(rtlCharacters.lre);
        expect(rtlCharacters._rtlCharacterTypes[8238]).toBe(rtlCharacters.rlo);
    });
    it('returns a shallow copy of resolved visual levels', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        // Act
        const visualLevels: number[] = rtlCharacters._getVisualOrder('ABC', false);
        visualLevels[0] = 9;
        // Assert
        expect(visualLevels).not.toBe(rtlCharacters._levels);
        expect(visualLevels).toEqual([9, 0, 0]);
        expect(rtlCharacters._levels).toEqual([0, 0, 0]);
        expect(rtlCharacters._textOrder).toBe(rtlCharacters.L);
    });
    it('maps every input character into a newly initialized character code array', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        const inputText: string = 'Aאا';
        // Act
        const characterCodes: number[] = rtlCharacters._getCharacterCode(inputText);
        // Assert
        expect(characterCodes).toEqual([
            rtlCharacters.L,
            rtlCharacters.R,
            rtlCharacters.AL
        ]);
        expect(characterCodes.length).toBe(inputText.length);
        expect(characterCodes[0]).not.toBe('Stryker was here' as unknown as number);
    });
    it('sets the exact default level for each character in an LTR paragraph', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._length = 4;
        rtlCharacters._textOrder = rtlCharacters.L;
        rtlCharacters._levels = [7, 7, 7, 7];
        // Act
        rtlCharacters._setLevels();
        // Assert
        expect(rtlCharacters._levels).toEqual([0, 0, 0, 0]);
        expect(rtlCharacters._levels.length).toBe(4);
        expect(rtlCharacters._levels[3]).toBe(rtlCharacters.L);
    });
    it('sets the exact default level for each character in an RTL paragraph', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._length = 3;
        rtlCharacters._textOrder = rtlCharacters.lre;
        rtlCharacters._levels = [0, 0, 0];
        // Act
        rtlCharacters._setLevels();
        // Assert
        expect(rtlCharacters._levels).toEqual([1, 1, 1]);
        expect(rtlCharacters._levels.length).toBe(3);
        expect(rtlCharacters._levels[2]).toBe(rtlCharacters.lre);
    });
    it('keeps zero-length level processing empty without adding a boundary entry', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._length = 0;
        rtlCharacters._textOrder = rtlCharacters.L;
        rtlCharacters._levels = [];
        // Act
        rtlCharacters._setLevels();
        // Assert
        expect(rtlCharacters._levels).toEqual([]);
        expect(rtlCharacters._levels.length).toBe(0);
        expect(rtlCharacters._levels[0]).toBeUndefined();
    });
});
describe('Bidirectional lines 578 to 634 survived mutant coverage', () => {
    it('sets every default level for the complete requested length', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._length = 4;
        rtlCharacters._textOrder = rtlCharacters.lre;
        rtlCharacters._levels = [9, 8, 7, 6];
        // Act
        rtlCharacters._setDefaultLevels();
        // Assert
        expect(rtlCharacters._levels).toEqual([1, 1, 1, 1]);
        expect(rtlCharacters._levels.length).toBe(4);
        expect(rtlCharacters._levels[3]).toBe(rtlCharacters.lre);
        expect(rtlCharacters._levels[4]).toBeUndefined();
    });
    it('sets exact levels through setLevels for a nonempty RTL sequence', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._length = 3;
        rtlCharacters._textOrder = rtlCharacters.lre;
        rtlCharacters._levels = [8, 8, 8];
        // Act
        rtlCharacters._setLevels();
        // Assert
        expect(rtlCharacters._levels).toEqual([1, 1, 1]);
        expect(rtlCharacters._levels.length).toBe(3);
        expect(rtlCharacters._levels[0]).toBe(rtlCharacters.lre);
        expect(rtlCharacters._levels[2]).toBe(rtlCharacters.lre);
        expect(rtlCharacters._levels[3]).toBeUndefined();
    });
    it('increments R by one and other non-L types by two at an even level', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.R, rtlCharacters.EN, rtlCharacters.L];
        rtlCharacters._levels = [0, 0, 0];
        // Act
        rtlCharacters._updateLevels(0, 0, 3);
        // Assert
        expect(rtlCharacters._levels).toEqual([1, 2, 0]);
        expect(rtlCharacters._levels[0]).toBe(1);
        expect(rtlCharacters._levels[1]).toBe(2);
        expect(rtlCharacters._levels[2]).toBe(0);
    });
    it('does not increment L at an even level', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.L];
        rtlCharacters._levels = [4];
        // Act
        rtlCharacters._updateLevels(0, 4, 1);
        // Assert
        expect(rtlCharacters._levels).toEqual([4]);
        expect(rtlCharacters._levels[0]).toBe(4);
    });
    it('increments every non-R type by one at an odd level', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.R, rtlCharacters.L, rtlCharacters.EN];
        rtlCharacters._levels = [1, 1, 1];
        // Act
        rtlCharacters._updateLevels(0, 1, 3);
        // Assert
        expect(rtlCharacters._levels).toEqual([1, 2, 2]);
        expect(rtlCharacters._levels[0]).toBe(1);
        expect(rtlCharacters._levels[1]).toBe(2);
        expect(rtlCharacters._levels[2]).toBe(2);
    });
    it('updates only the requested subsection of levels', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.EN, rtlCharacters.R, rtlCharacters.EN, rtlCharacters.L];
        rtlCharacters._levels = [6, 0, 0, 6];
        // Act
        rtlCharacters._updateLevels(1, 0, 3);
        // Assert
        expect(rtlCharacters._levels).toEqual([6, 1, 2, 6]);
        expect(rtlCharacters._levels[0]).toBe(6);
        expect(rtlCharacters._levels[3]).toBe(6);
    });
});
describe('Bidirectional lines 635 to 733 all survived mutant coverage', () => {
    it('restores embedded controls and copies compacted entries in reverse order', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._type = [rtlCharacters.L, rtlCharacters.lre, rtlCharacters.R, rtlCharacters.BN];
        rtlCharacters._result = [rtlCharacters.L, rtlCharacters.R];
        rtlCharacters._levels = [0, 1];
        // Act
        rtlCharacters._checkEmbeddedCharacters(2);
        // Assert
        expect(rtlCharacters._result).toEqual([
            rtlCharacters.L, rtlCharacters.lre, rtlCharacters.R, rtlCharacters.BN
        ]);
        expect(rtlCharacters._levels).toEqual([0, 0, 1, 1]);
    });
    it('restores every embedding control type and carries the previous level', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._type = [
            rtlCharacters.L, rtlCharacters.lre, rtlCharacters.rle,
            rtlCharacters.lro, rtlCharacters.rlo, rtlCharacters.pdf, rtlCharacters.BN
        ];
        rtlCharacters._result = [rtlCharacters.L];
        rtlCharacters._levels = [2];
        // Act
        rtlCharacters._checkEmbeddedCharacters(1);
        // Assert
        expect(rtlCharacters._result).toEqual([
            rtlCharacters.L, rtlCharacters.lre, rtlCharacters.rle,
            rtlCharacters.lro, rtlCharacters.rlo, rtlCharacters.pdf, rtlCharacters.BN
        ]);
        expect(rtlCharacters._levels).toEqual([2, 2, 2, 2, 2, 2, 2]);
    });
    it('copies a leading embedded control sentinel without changing later compact data', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._type = [rtlCharacters.lre, rtlCharacters.L];
        rtlCharacters._result = [rtlCharacters.L];
        rtlCharacters._levels = [0];
        // Act
        rtlCharacters._checkEmbeddedCharacters(1);
        // Assert
        expect(rtlCharacters._result).toEqual([rtlCharacters.lre, rtlCharacters.L]);
        expect(rtlCharacters._levels.length).toBe(2);
        expect(rtlCharacters._levels[1]).toBe(0);
    });
    it('inherits NSM from the preceding strong type and preserves new strong types', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.nsm, rtlCharacters.R, rtlCharacters.nsm];
        rtlCharacters._levels = [0, 0, 0];
        // Act
        rtlCharacters._check(0, 3, 0, rtlCharacters.L, rtlCharacters.L);
        // Assert
        expect(rtlCharacters._result).toEqual([
            rtlCharacters.L, rtlCharacters.R, rtlCharacters.R
        ]);
    });
    it('converts EN to AN when the preceding strong type is AL', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.AL, rtlCharacters.EN];
        rtlCharacters._levels = [0, 0];
        // Act
        rtlCharacters._checkEuropeanDigits(0, 2, 0, rtlCharacters.L, rtlCharacters.L);
        // Assert
        expect(rtlCharacters._result).toEqual([rtlCharacters.R, rtlCharacters.AN]);
    });
    it('keeps EN when the preceding strong type is L', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.L, rtlCharacters.EN];
        rtlCharacters._levels = [0, 0];
        // Act
        rtlCharacters._checkEuropeanDigits(0, 2, 0, rtlCharacters.L, rtlCharacters.L);
        // Assert
        expect(rtlCharacters._result).toEqual([rtlCharacters.L, rtlCharacters.L]);
    });
    it('converts every AL entry in the selected range to R', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.L, rtlCharacters.AL, rtlCharacters.AL, rtlCharacters.L];
        rtlCharacters._levels = [0, 0, 0, 0];
        // Act
        rtlCharacters._checkArabicCharacters(1, 3, 0, rtlCharacters.L, rtlCharacters.L);
        // Assert
        expect(rtlCharacters._result).toEqual([
            rtlCharacters.L, rtlCharacters.R, rtlCharacters.R, rtlCharacters.L
        ]);
    });
    it('resolves ES between EN values to EN', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.EN, rtlCharacters.ES, rtlCharacters.EN];
        rtlCharacters._levels = [0, 0, 0];
        // Act
        rtlCharacters._checkEuropeanNumberSeparator(0, 3, 0, rtlCharacters.R, rtlCharacters.R);
        // Assert
        expect(rtlCharacters._result).toEqual([
            rtlCharacters.EN, rtlCharacters.EN, rtlCharacters.EN
        ]);
    });
    it('resolves CS between AN values to AN', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.AN, rtlCharacters.CS, rtlCharacters.AN];
        rtlCharacters._levels = [1, 1, 1];
        // Act
        rtlCharacters._checkEuropeanNumberSeparator(0, 3, 1, rtlCharacters.R, rtlCharacters.R);
        // Assert
        expect(rtlCharacters._result).toEqual([
            rtlCharacters.AN, rtlCharacters.AN, rtlCharacters.AN
        ]);
    });
    it('does not resolve ES when only one adjacent value is EN', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.EN, rtlCharacters.ES, rtlCharacters.R];
        rtlCharacters._levels = [0, 0, 0];
        // Act
        rtlCharacters._checkEuropeanNumberSeparator(0, 3, 0, rtlCharacters.R, rtlCharacters.R);
        // Assert
        expect(rtlCharacters._result).toEqual([
            rtlCharacters.EN, rtlCharacters.R, rtlCharacters.R
        ]);
    });
    it('does not resolve CS to AN when only one adjacent value is AN', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.AN, rtlCharacters.CS, rtlCharacters.R];
        rtlCharacters._levels = [1, 1, 1];
        // Act
        rtlCharacters._checkEuropeanNumberSeparator(0, 3, 1, rtlCharacters.R, rtlCharacters.R);
        // Assert
        expect(rtlCharacters._result).toEqual([
            rtlCharacters.AN, rtlCharacters.R, rtlCharacters.R
        ]);
    });
    it('normalizes a complete ET range using the start and end types', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.ET, rtlCharacters.ET];
        rtlCharacters._levels = [0, 0];
        // Act
        rtlCharacters._checkEuropeanNumberTerminator(0, 2, 0, rtlCharacters.L, rtlCharacters.R);
        // Assert
        expect(rtlCharacters._result).toEqual([rtlCharacters.L, rtlCharacters.L]);
    });
    it('normalizes an internal ET range after EN', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.EN, rtlCharacters.ET, rtlCharacters.ET, rtlCharacters.R];
        rtlCharacters._levels = [0, 0, 0, 0];
        // Act
        rtlCharacters._checkEuropeanNumberTerminator(0, 4, 0, rtlCharacters.R, rtlCharacters.R);
        // Assert
        expect(rtlCharacters._result).toEqual([
            rtlCharacters.EN, rtlCharacters.R, rtlCharacters.R, rtlCharacters.R
        ]);
    });
    it('consumes a complete matching valid set and returns the exclusive length', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.ET, rtlCharacters.ET, rtlCharacters.ET];
        const validTypes: number[] = [rtlCharacters.ET];
        // Act
        const result: number = rtlCharacters._getLength(0, 3, validTypes);
        // Assert
        expect(result).toBe(3);
    });
    it('stops getLength at the first type outside the valid set', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.ET, rtlCharacters.ET, rtlCharacters.R];
        const validTypes: number[] = [rtlCharacters.ET];
        // Act
        const result: number = rtlCharacters._getLength(0, 3, validTypes);
        // Assert
        expect(result).toBe(2);
    });
});
describe('Bidirectional lines 733 to 815 all survived mutant coverage', () => {
    it('converts EN to L when a preceding L exists in the run', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.R, rtlCharacters.L, rtlCharacters.EN];
        // Act
        rtlCharacters._checkOtherCharacters(0, 3, 0, rtlCharacters.R, rtlCharacters.R);
        // Assert
        expect(rtlCharacters._result).toEqual([
            rtlCharacters.R, rtlCharacters.L, rtlCharacters.L
        ]);
    });
    it('keeps EN when the nearest preceding strong type is R', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.L, rtlCharacters.R, rtlCharacters.EN];
        // Act
        rtlCharacters._checkOtherCharacters(0, 3, 0, rtlCharacters.L, rtlCharacters.L);
        // Assert
        expect(rtlCharacters._result).toEqual([
            rtlCharacters.L, rtlCharacters.R, rtlCharacters.EN
        ]);
    });
    it('uses L startType for EN at the beginning of the run', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.EN];
        // Act
        rtlCharacters._checkOtherCharacters(0, 1, 0, rtlCharacters.L, rtlCharacters.L);
        // Assert
        expect(rtlCharacters._result).toEqual([rtlCharacters.L]);
    });
    it('uses R startType to preserve EN at the beginning of the run', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.EN];
        // Act
        rtlCharacters._checkOtherCharacters(0, 1, 0, rtlCharacters.R, rtlCharacters.R);
        // Assert
        expect(rtlCharacters._result).toEqual([rtlCharacters.EN]);
    });
    it('processes every EN through the exclusive end boundary', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.L, rtlCharacters.EN, rtlCharacters.EN];
        // Act
        rtlCharacters._checkOtherCharacters(0, 3, 0, rtlCharacters.L, rtlCharacters.L);
        // Assert
        expect(rtlCharacters._result).toEqual([
            rtlCharacters.L, rtlCharacters.L, rtlCharacters.L
        ]);
        expect(rtlCharacters._result.length).toBe(3);
    });
    it('returns the full length when every result type is valid', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.WS, rtlCharacters.ON, rtlCharacters.B, rtlCharacters.S];
        const validTypes: number[] = [
            rtlCharacters.B, rtlCharacters.S, rtlCharacters.WS, rtlCharacters.ON
        ];
        // Act
        const result: number = rtlCharacters._getLength(0, 4, validTypes);
        // Assert
        expect(result).toBe(4);
    });
    it('returns the first index whose result type is not valid', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.WS, rtlCharacters.ON, rtlCharacters.L, rtlCharacters.S];
        const validTypes: number[] = [
            rtlCharacters.B, rtlCharacters.S, rtlCharacters.WS, rtlCharacters.ON
        ];
        // Act
        const result: number = rtlCharacters._getLength(0, 4, validTypes);
        // Assert
        expect(result).toBe(2);
    });
    it('checks every validSet entry before returning the consumed length', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.ON, rtlCharacters.S, rtlCharacters.R];
        const validTypes: number[] = [rtlCharacters.B, rtlCharacters.S, rtlCharacters.WS, rtlCharacters.ON];
        // Act
        const result: number = rtlCharacters._getLength(0, 3, validTypes);
        // Assert
        expect(result).toBe(2);
    });
    it('resolves all supported neutral types between matching L types to L', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [
            rtlCharacters.L, rtlCharacters.WS, rtlCharacters.ON,
            rtlCharacters.B, rtlCharacters.S, rtlCharacters.L
        ];
        // Act
        rtlCharacters._checkCharacters(1, 5, 0, rtlCharacters.L, rtlCharacters.L);
        // Assert
        expect(rtlCharacters._result).toEqual([
            rtlCharacters.L, rtlCharacters.L, rtlCharacters.L,
            rtlCharacters.L, rtlCharacters.L, rtlCharacters.L
        ]);
    });
    it('resolves a neutral run from matching start and end types', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.WS, rtlCharacters.ON];
        // Act
        rtlCharacters._checkCharacters(0, 2, 0, rtlCharacters.R, rtlCharacters.R);
        // Assert
        expect(rtlCharacters._result).toEqual([rtlCharacters.R, rtlCharacters.R]);
    });
    it('uses L for different surrounding types at an even level', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.WS];
        // Act
        rtlCharacters._checkCharacters(0, 1, 0, rtlCharacters.L, rtlCharacters.R);
        // Assert
        expect(rtlCharacters._result).toEqual([rtlCharacters.L]);
    });
    it('uses R for different surrounding types at an odd level', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.ON];
        // Act
        rtlCharacters._checkCharacters(0, 1, 1, rtlCharacters.L, rtlCharacters.R);
        // Assert
        expect(rtlCharacters._result).toEqual([rtlCharacters.R]);
    });
    it('normalizes preceding AN to R before resolving a neutral run', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [
            rtlCharacters.AN,
            rtlCharacters.WS,
            rtlCharacters.R
        ];

        // Act
        rtlCharacters._checkCharacters(
            0,
            3,
            0,
            rtlCharacters.L,
            rtlCharacters.L
        );

        // Assert
        expect(rtlCharacters._result).toEqual([
            rtlCharacters.AN,
            rtlCharacters.R,
            rtlCharacters.R
        ]);
    });

    it('normalizes preceding EN to R before resolving a neutral run', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [
            rtlCharacters.EN,
            rtlCharacters.ON,
            rtlCharacters.R
        ];

        // Act
        rtlCharacters._checkCharacters(
            0,
            3,
            0,
            rtlCharacters.L,
            rtlCharacters.L
        );

        // Assert
        expect(rtlCharacters._result).toEqual([
            rtlCharacters.EN,
            rtlCharacters.R,
            rtlCharacters.R
        ]);
    });

    it('normalizes a succeeding AN to R before resolving a neutral run', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [
            rtlCharacters.R,
            rtlCharacters.S,
            rtlCharacters.AN
        ];

        // Act
        rtlCharacters._checkCharacters(
            0,
            3,
            0,
            rtlCharacters.L,
            rtlCharacters.L
        );

        // Assert
        expect(rtlCharacters._result).toEqual([
            rtlCharacters.R,
            rtlCharacters.R,
            rtlCharacters.AN
        ]);
    });
    it('leaves nonneutral characters unchanged', () => {
        // Arrange
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        rtlCharacters._result = [rtlCharacters.L, rtlCharacters.R, rtlCharacters.EN];
        // Act
        rtlCharacters._checkCharacters(0, 3, 0, rtlCharacters.L, rtlCharacters.R);
        // Assert
        expect(rtlCharacters._result).toEqual([
            rtlCharacters.L, rtlCharacters.R, rtlCharacters.EN
        ]);
    });
});
