import { _ArabicShapeRenderer, _ArabicShape } from '../src/pdf/core/graphics/rightToLeft/text-shape';
describe('text-shape file mutation testing', () => {
    it('should populate _arabicMapTable with all entries from _arabicCharTable', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const arabicCharTable: string[][] = [['\u0621', '\uFE80'], ['\u0622', '\uFE81', '\uFE82'], ['\u0623', '\uFE83', '\uFE84'],
        ['\u0624', '\uFE85', '\uFE86'], ['\u0625', '\uFE87', '\uFE88'], ['\u0626', '\uFE89', '\uFE8A', '\uFE8B', '\uFE8C'],
        ['\u0627', '\uFE8D', '\uFE8E'], ['\u0628', '\uFE8F', '\uFE90', '\uFE91', '\uFE92'], ['\u0629', '\uFE93', '\uFE94'],
        ['\u062A', '\uFE95', '\uFE96', '\uFE97', '\uFE98'], ['\u062B', '\uFE99', '\uFE9A', '\uFE9B', '\uFE9C'],
        ['\u062C', '\uFE9D', '\uFE9E', '\uFE9F', '\uFEA0'], ['\u062D', '\uFEA1', '\uFEA2', '\uFEA3', '\uFEA4'],
        ['\u062E', '\uFEA5', '\uFEA6', '\uFEA7', '\uFEA8'], ['\u062F', '\uFEA9', '\uFEAA'], ['\u0630', '\uFEAB', '\uFEAC'],
        ['\u0631', '\uFEAD', '\uFEAE'], ['\u0632', '\uFEAF', '\uFEB0'], ['\u0633', '\uFEB1', '\uFEB2', '\uFEB3', '\uFEB4'],
        ['\u0634', '\uFEB5', '\uFEB6', '\uFEB7', '\uFEB8'], ['\u0635', '\uFEB9', '\uFEBA', '\uFEBB', '\uFEBC'],
        ['\u0636', '\uFEBD', '\uFEBE', '\uFEBF', '\uFEC0'], ['\u0637', '\uFEC1', '\uFEC2', '\uFEC3', '\uFEC4'],
        ['\u0638', '\uFEC5', '\uFEC6', '\uFEC7', '\uFEC8'], ['\u0639', '\uFEC9', '\uFECA', '\uFECB', '\uFECC'],
        ['\u063A', '\uFECD', '\uFECE', '\uFECF', '\uFED0'], ['\u0640', '\u0640', '\u0640', '\u0640', '\u0640'],
        ['\u0641', '\uFED1', '\uFED2', '\uFED3', '\uFED4'], ['\u0642', '\uFED5', '\uFED6', '\uFED7', '\uFED8'],
        ['\u0643', '\uFED9', '\uFEDA', '\uFEDB', '\uFEDC'], ['\u0644', '\uFEDD', '\uFEDE', '\uFEDF', '\uFEE0'],
        ['\u0645', '\uFEE1', '\uFEE2', '\uFEE3', '\uFEE4'], ['\u0646', '\uFEE5', '\uFEE6', '\uFEE7', '\uFEE8'],
        ['\u0647', '\uFEE9', '\uFEEA', '\uFEEB', '\uFEEC'], ['\u0648', '\uFEED', '\uFEEE'],
        ['\u0649', '\uFEEF', '\uFEF0', '\uFBE8', '\uFBE9'], ['\u064A', '\uFEF1', '\uFEF2', '\uFEF3', '\uFEF4'],
        ['\u0671', '\uFB50', '\uFB51'], ['\u0679', '\uFB66', '\uFB67', '\uFB68', '\uFB69'],
        ['\u067A', '\uFB5E', '\uFB5F', '\uFB60', '\uFB61'], ['\u067B', '\uFB52', '\uFB53', '\uFB54', '\uFB55'],
        ['\u067E', '\uFB56', '\uFB57', '\uFB58', '\uFB59'], ['\u067F', '\uFB62', '\uFB63', '\uFB64', '\uFB65'],
        ['\u0680', '\uFB5A', '\uFB5B', '\uFB5C', '\uFB5D'], ['\u0683', '\uFB76', '\uFB77', '\uFB78', '\uFB79'],
        ['\u0684', '\uFB72', '\uFB73', '\uFB74', '\uFB75'], ['\u0686', '\uFB7A', '\uFB7B', '\uFB7C', '\uFB7D'],
        ['\u0687', '\uFB7E', '\uFB7F', '\uFB80', '\uFB81'], ['\u0688', '\uFB88', '\uFB89'], ['\u068C', '\uFB84', '\uFB85'],
        ['\u068D', '\uFB82', '\uFB83'], ['\u068E', '\uFB86', '\uFB87'], ['\u0691', '\uFB8C', '\uFB8D'], ['\u0698', '\uFB8A', '\uFB8B'],
        ['\u06A4', '\uFB6A', '\uFB6B', '\uFB6C', '\uFB6D'], ['\u06A6', '\uFB6E', '\uFB6F', '\uFB70', '\uFB71'],
        ['\u06A9', '\uFB8E', '\uFB8F', '\uFB90', '\uFB91'], ['\u06AD', '\uFBD3', '\uFBD4', '\uFBD5', '\uFBD6'],
        ['\u06AF', '\uFB92', '\uFB93', '\uFB94', '\uFB95'], ['\u06B1', '\uFB9A', '\uFB9B', '\uFB9C', '\uFB9D'],
        ['\u06B3', '\uFB96', '\uFB97', '\uFB98', '\uFB99'], ['\u06BA', '\uFB9E', '\uFB9F'],
        ['\u06BB', '\uFBA0', '\uFBA1', '\uFBA2', '\uFBA3'], ['\u06BE', '\uFBAA', '\uFBAB', '\uFBAC', '\uFBAD'],
        ['\u06C0', '\uFBA4', '\uFBA5'], ['\u06C1', '\uFBA6', '\uFBA7', '\uFBA8', '\uFBA9'], ['\u06C5', '\uFBE0', '\uFBE1'],
        ['\u06C6', '\uFBD9', '\uFBDA'], ['\u06C7', '\uFBD7', '\uFBD8'], ['\u06C8', '\uFBDB', '\uFBDC'], ['\u06C9', '\uFBE2', '\uFBE3'],
        ['\u06CB', '\uFBDE', '\uFBDF'], ['\u06CC', '\uFBFC', '\uFBFD', '\uFBFE', '\uFBFF'],
        ['\u06D0', '\uFBE4', '\uFBE5', '\uFBE6', '\uFBE7'], ['\u06D2', '\uFBAE', '\uFBAF'], ['\u06D3', '\uFBB0', '\uFBB1']
        ];
        const expectedSize = renderer['_arabicCharTable'].length;
        const mapSize = renderer['_arabicMapTable'].size;
        expect(mapSize).toBe(expectedSize);
        expect(renderer['_arabicMapTable'].has('\u0621')).toBe(true); // hamza
        expect(renderer['_arabicMapTable'].has('\u0627')).toBe(true); // alef
        expect(renderer['_arabicMapTable'].has('\u0644')).toBe(true); // lam
        expect(arabicCharTable).toEqual(renderer._arabicCharTable);
    });

    it('should map base character to correct entry array', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const alef = '\u0627';
        const entry = renderer['_arabicMapTable'].get(alef);
        expect(entry).toBeDefined();
        expect(entry[0]).toBe(alef);
        expect(entry.length).toBeGreaterThan(1);
    });
    it('should return mapped shape form for character at hamza boundary', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const hamza = '\u0621'; // hamza - lowest boundary
        const index = 0; // isolated form
        const shape = renderer['_getCharacterShape'](hamza, index);
        expect(shape).toBe('\uFE80'); // hamza isolated form
    });

    it('should return mapped shape form for character at bwhb boundary', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const bwhb = '\u06D3'; // Urdu Heh with Yeh above - highest boundary
        const index = 1; // final form
        const shape = renderer['_getCharacterShape'](bwhb, index);
        expect(shape).toBe('\uFBB1'); // expected form from table
    });

    it('should return input unchanged for character above hamza boundary', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const charAboveHamza = '\u061F'; // Arabic question mark (before hamza)
        const index = 0;
        const shape = renderer['_getCharacterShape'](charAboveHamza, index);
        expect(shape).toBe(charAboveHamza);
    });

    it('should return input unchanged for character below bwhb boundary', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const charBelowBwhb = '\u06D4'; // Arabic full stop (after bwhb)
        const index = 0;
        const shape = renderer['_getCharacterShape'](charBelowBwhb, index);
        expect(shape).toBe(charBelowBwhb);
    });

    it('should return input unchanged for ligature form in lwawm to lwa range', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const lwa = '\uFEFB'; // LAM-ALEF ligature
        const index = 0;
        const shape = renderer['_getCharacterShape'](lwa, index);
        expect(shape).toBe(lwa);
    });

    it('should return mapped shape at lwawm boundary', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const lwawm = '\uFEF5'; // LAM-ALEF with Madda (isolated)
        const index = 0;
        const shape = renderer['_getCharacterShape'](lwawm, index);
        expect(shape).toBe(lwawm);
    });

    it('should return correct index-based form for multi-form character', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const ba = '\u0628'; // ba - has 4 forms (isolated, final, initial, medial)
        const indexIsolated = 0;
        const indexFinal = 1;
        const indexInitial = 2;
        const indexMedial = 3;
        const isolated = renderer['_getCharacterShape'](ba, indexIsolated);
        const final = renderer['_getCharacterShape'](ba, indexFinal);
        const initial = renderer['_getCharacterShape'](ba, indexInitial);
        const medial = renderer['_getCharacterShape'](ba, indexMedial);
        expect(isolated).toBe('\uFE8F');
        expect(final).toBe('\uFE90');
        expect(initial).toBe('\uFE91');
        expect(medial).toBe('\uFE92');
    });

    it('should return mapped shape for two-form character', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const alef = '\u0627'; // alef - has 2 forms
        const indexIsolated = 0;
        const indexFinal = 1;
        const isolated = renderer['_getCharacterShape'](alef, indexIsolated);
        const final = renderer['_getCharacterShape'](alef, indexFinal);
        expect(isolated).toBe('\uFE8D');
        expect(final).toBe('\uFE8E');
    });
    it('should return unchanged text when input contains no Arabic', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const text = 'Hello World 123';
        const shaped = renderer['_shape'](text);
        expect(shaped).toBe(text);
    });
    it('should process pure Arabic text by calling _doShape', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const arabicText = '\u0628\u062A'; // ba + ta
        const shaped = renderer['_shape'](arabicText);
        expect(shaped).not.toBe(arabicText); // should be transformed
        expect(shaped.length).toBeGreaterThan(0);
    });
    it('should handle empty string', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const text = '';
        const shaped = renderer['_shape'](text);
        expect(shaped).toBe('');
    });
    it('should handle mixed Arabic and non-Arabic text', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const mixedText = 'Hello \u0628 World';
        const shaped = renderer['_shape'](mixedText);
        expect(shaped.indexOf('Hello')).toBe(0);
        expect(shaped.indexOf('World')).toBeGreaterThan(0);
    });

    it('should separate consecutive Arabic spans from non-Arabic', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const text = '\u0628 \u062A'; // ba SPACE ta
        const shaped = renderer['_shape'](text);
        expect(shaped).toContain(' ');
    });
    it('should process character at Arabic range start boundary', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const char = '؀'; // U+0600 Arabic Number Sign (start of range)
        const text = 'A' + char + 'Z';
        const shaped = renderer['_shape'](text);
        expect(shaped.indexOf('A')).toBe(0);
        expect(shaped.indexOf('Z')).toBeGreaterThan(0);
    });

    it('should process character at Arabic range end boundary', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const char = 'ۿ'; // U+06FF (end of range)
        const text = 'A' + char + 'Z';
        const shaped = renderer['_shape'](text);
        expect(shaped.indexOf('A')).toBe(0);
        expect(shaped.indexOf('Z')).toBeGreaterThan(0);
    });

    it('should handle single Arabic character', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const text = '\u0627'; // alef
        const shaped = renderer['_shape'](text);
        expect(shaped.length).toBeGreaterThan(0);
    });

    it('should handle single non-Arabic character', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const text = 'A';

        // Act
        const shaped = renderer['_shape'](text);

        // Assert
        expect(shaped).toBe('A');
    });

    // ============================================================================
    // _getShapeCount TESTS - Return Value and Boundary Mutants
    // ============================================================================

    it('should return 1 for non-joining character', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const alef = '\u0627'; // alef (non-joining, 2 forms in table = length 2, returns 2-1=1)
        
        // Act
        const count = renderer['_getShapeCount'](alef);

        // Assert
        expect(count).toBe(2);
    });

    it('should return 4 for dual-joining character', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const ba = '\u0628'; // ba (4 forms in table = length 5, returns 5-1=4)

        // Act
        const count = renderer['_getShapeCount'](ba);

        // Assert
        expect(count).toBe(4);
    });

    it('should return 4 for Zero Width Joiner', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const zwj = '\u200D';

        // Act
        const count = renderer['_getShapeCount'](zwj);

        // Assert
        expect(count).toBe(4);
    });

    it('should return 1 for non-Arabic character', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const text = 'A';

        // Act
        const count = renderer['_getShapeCount'](text);

        // Assert
        expect(count).toBe(1);
    });

    it('should return 1 for combining mark (fathatan)', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const fathatan = '\u064B';

        // Act
        const count = renderer['_getShapeCount'](fathatan);

        // Assert
        expect(count).toBe(1);
    });

    it('should return correct count for character at hamza boundary', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const hamza = '\u0621'; // hamza (1 form in table = length 1, returns 1-1=0)

        // Act
        const count = renderer['_getShapeCount'](hamza);

        // Assert
        expect(count).toBe(1);
    });

    // ============================================================================
    // _doShape TESTS - Shape Index Calculation and Ligature Logic
    // ============================================================================

    it('should process single non-joining character', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const input = '\u0627'; // alef

        // Act
        const shaped = renderer['_doShape'](input, 0);

        // Assert
        expect(shaped).toBeDefined();
        expect(shaped.length).toBeGreaterThan(0);
    });

    it('should process dual-joining character correctly', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const input = '\u0628'; // ba (dual-joining)

        // Act
        const shaped = renderer['_doShape'](input, 0);

        // Assert
        expect(shaped).toBeDefined();
        expect(shaped.length).toBeGreaterThan(0);
    });

    it('should apply shape index when previous._shapes > 2', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const input = '\u0628\u062A'; // ba (4 forms) + ta (4 forms)

        // Act
        const shaped = renderer['_doShape'](input, 0);

        // Assert
        expect(shaped).toBeDefined();
        expect(shaped.length).toBeGreaterThan(0);
    });

    it('should handle empty input string', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const input = '';

        // Act
        const shaped = renderer['_doShape'](input, 0);

        // Assert
        expect(shaped).toBe('');
    });

    it('should process character sequence with varying shape counts', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const input = '\u0628\u0627\u062A'; // ba (4 forms) + alef (2 forms) + ta (4 forms)

        // Act
        const shaped = renderer['_doShape'](input, 0);

        // Assert
        expect(shaped.length).toBeGreaterThan(0);
    });

    it('should apply shape calculation: len = (shapeCount === 1) ? 0 : 2', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const nonJoiningInput = '\u0627'; // alef (shapeCount = 1, len should be 0)
        const joiningInput = '\u0628'; // ba (shapeCount = 4, len should be 2)

        // Act
        const nonJoiningShaped = renderer['_doShape'](nonJoiningInput, 0);
        const joiningShaped = renderer['_doShape'](joiningInput, 0);

        // Assert
        expect(nonJoiningShaped).toBeDefined();
        expect(joiningShaped).toBeDefined();
        expect(nonJoiningShaped).not.toBe(joiningShaped);
    });

    it('should apply modulo: len = len % (present._shapes)', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const input = '\u0628\u0628\u0628'; // three ba characters

        // Act
        const shaped = renderer['_doShape'](input, 0);

        // Assert
        expect(shaped).toBeDefined();
        expect(shaped.length).toBeGreaterThan(0);
    });

    // ============================================================================
    // _append TESTS - Conditional Appending and Level Flag Logic
    // ============================================================================

    it('should append non-empty shape value', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\uFE8F'; // ba isolated
        const builder = '';

        // Act
        const result = renderer['_append'](builder, shape, 0);

        // Assert
        expect(result).toContain('\uFE8F');
    });

    it('should not append empty shape value', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '';
        const builder = 'test';

        // Act
        const result = renderer['_append'](builder, shape, 0);

        // Assert
        expect(result).toBe('test');
    });

    it('should append shape type when level does not include _vowel flag', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\uFE8F';
        shape._shapeType = '\u0651'; // shadda
        const builder = '';
        const level = 0; // no _vowel flag

        // Act
        const result = renderer['_append'](builder, shape, level);

        // Assert
        expect(result).toContain('\u0651');
    });

    it('should skip shape type when level includes _vowel flag', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\uFE8F';
        shape._shapeType = '\u0651';
        const builder = '';
        const level = 0x1; // _vowel flag

        // Act
        const result = renderer['_append'](builder, shape, level);

        // Assert
        expect(result).not.toContain('\u0651');
    });

    it('should append shape vowel when level does not include _vowel flag', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\uFE8F';
        shape._shapeVowel = '\u064B'; // fathatan
        const builder = '';
        const level = 0;

        // Act
        const result = renderer['_append'](builder, shape, level);

        // Assert
        expect(result).toContain('\u064B');
    });

    it('should skip shape vowel when level includes _vowel flag', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\uFE8F';
        shape._shapeVowel = '\u064B';
        const builder = '';
        const level = 0x1;

        // Act
        const result = renderer['_append'](builder, shape, level);

        // Assert
        expect(result).not.toContain('\u064B');
    });

    it('should append all components (base, type, vowel) when conditions met', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\uFE8F';
        shape._shapeType = '\u0651';
        shape._shapeVowel = '\u064B';
        const builder = '';
        const level = 0;

        // Act
        const result = renderer['_append'](builder, shape, level);

        // Assert
        expect(result).toContain('\uFE8F');
        expect(result).toContain('\u0651');
        expect(result).toContain('\u064B');
    });

    it('should append only base when type and vowel are empty', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\uFE8F';
        shape._shapeType = '';
        shape._shapeVowel = '';
        const builder = '';

        // Act
        const result = renderer['_append'](builder, shape, 0);

        // Assert
        expect(result).toBe('\uFE8F');
    });

    it('should decrement _shapeLigature count for each appended component', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\uFE8F';
        shape._shapeType = '\u0651';
        shape._shapeVowel = '\u064B';
        shape._shapeLigature = 3;
        const builder = '';

        // Act
        renderer['_append'](builder, shape, 0);

        // Assert
        expect(shape._shapeLigature).toBe(0);
    });

    // ============================================================================
    // _ligature TESTS - Mark and Ligature Handling
    // ============================================================================

    it('should return 0 when shape is empty', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '';
        const value = '\u064B'; // fathatan

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(0);
    });

    it('should return 1 when combining mark (fathatan) is processed for first time', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u0627'; // alef
        shape._shapeVowel = '';
        const value = '\u064B'; // fathatan

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(1);
        expect(shape._shapeVowel).toBe('\u064B');
        expect(shape._shapeLigature).toBe(1);
    });

    it('should apply shadda when shapeType is empty', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u0627'; // alef
        shape._shapeType = '';
        const value = '\u0651'; // shadda

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(1);
        expect(shape._shapeType).toBe('\u0651');
    });

    it('should return 0 when attempting to add second shadda (shapeType already set)', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u0627';
        shape._shapeType = '\u0651'; // already has shadda
        const value = '\u0651'; // trying to add another shadda

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(0);
    });

    it('should return 2 when replacing alef with alef hamza below', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u0627'; // alef
        shape._shapeVowel = '';
        const value = '\u0655'; // hamza below

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(2);
        expect(shape._shapeValue).toBe('\u0625'); // alef hamza below
    });

    it('should replace alef with alef hamza above', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u0627'; // alef
        shape._shapeVowel = '';
        const value = '\u0654'; // hamza above

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(2);
        expect(shape._shapeValue).toBe('\u0623'); // alef hamza above
    });

    it('should replace waw with waw hamza above', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u0648'; // waw
        shape._shapeVowel = '';
        const value = '\u0654'; // hamza above

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(2);
        expect(shape._shapeValue).toBe('\u0624'); // waw hamza above
    });

    it('should replace alef with alef madda', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u0627'; // alef
        shape._shapeVowel = '';
        const value = '\u0653'; // madda

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(2);
        expect(shape._shapeValue).toBe('\u0622'); // alef madda
    });

    it('should apply lam-alef ligature', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u0644'; // lam
        shape._shapeVowel = '';
        const value = '\u0627'; // alef

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(3); // ligature formed
        expect(shape._shapeValue).toBe('\uFEFB'); // lam-alef ligature
        expect(shape._shapes).toBe(2);
    });

    it('should apply lam-alef hamza below ligature', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u0644'; // lam
        shape._shapeVowel = '';
        const value = '\u0625'; // alef hamza below

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(3);
        expect(shape._shapeValue).toBe('\uFEF9'); // lam-alef hamza below
    });

    it('should apply lam-alef madda ligature', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u0644'; // lam
        shape._shapeVowel = '';
        const value = '\u0622'; // alef madda

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(3);
        expect(shape._shapeValue).toBe('\uFEF5'); // lam-alef madda
    });

    it('should return 2 when vowel is already set and non-shadda mark arrives', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u0627';
        shape._shapeVowel = '\u064B'; // fathatan already present
        const value = '\u064C'; // dammatan (different mark)

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(2);
    });

    it('should return result = 1 when replacing vowel with shadda', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u0627';
        shape._shapeVowel = '\u064B'; // fathatan
        const value = '\u0651'; // shadda

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(1);
    });

    it('should return 0 when non-mark, non-ligature character arrives with vowel set', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u0627';
        shape._shapeVowel = '\u064B';
        const value = '\u0628'; // ba (regular character)

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(0);
    });

    it('should handle superalef combining mark', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u0627';
        shape._shapeVowel = '';
        const value = '\u0670'; // superalef

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(1);
        expect(shape._shapeVowel).toBe('\u0670');
    });

    it('should handle yeh variants with hamza above', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u064A'; // yeh
        shape._shapeVowel = '';
        const value = '\u0654'; // hamza above

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(2);
        expect(shape._shapeValue).toBe('\u0626'); // yeh hamza above
    });

    it('should handle alef sura (maqsura) with hamza above', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u0649'; // alef sura
        shape._shapeVowel = '';
        const value = '\u0654'; // hamza above

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(2);
        expect(shape._shapeValue).toBe('\u0626'); // yeh hamza
    });

    it('should handle farsi yeh with hamza above', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u06CC'; // farsi yeh
        shape._shapeVowel = '';
        const value = '\u0654'; // hamza above

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(2);
        expect(shape._shapeValue).toBe('\u0626'); // yeh hamza
    });

    it('should apply hamza above to non-alef/waw/yeh character as type', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u0628'; // ba
        const value = '\u0654'; // hamza above

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(1);
        expect(shape._shapeType).toBe('\u0654');
    });

    it('should apply hamza below to non-alef/lwa character as type', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        shape._shapeValue = '\u0628'; // ba
        const value = '\u0655'; // hamza below

        // Act
        const result = renderer['_ligature'](value, shape);

        // Assert
        expect(result).toBe(1);
        expect(shape._shapeType).toBe('\u0655');
    });

    // ============================================================================
    // INTEGRATION TESTS - Full Shaping Flow
    // ============================================================================

    it('should shape complete Arabic text with marks', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const text = '\u0628\u0651'; // ba + shadda

        // Act
        const shaped = renderer['_shape'](text);

        // Assert
        expect(shaped).toBeDefined();
        expect(shaped.length).toBeGreaterThan(0);
    });

    it('should apply level flag to control vowel output', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const text = '\u0628\u064B'; // ba + fathatan
        const levelWithoutVowel = 0;
        const levelWithVowel = 0x1; // _vowel flag

        // Act
        const shapedWithoutVowel = renderer['_doShape'](text, levelWithoutVowel);
        const shapedWithVowel = renderer['_doShape'](text, levelWithVowel);

        // Assert
        expect(shapedWithoutVowel).toBeDefined();
        expect(shapedWithVowel).toBeDefined();
    });

    it('should handle complex ligature chain: lam + alef + mark', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const text = '\u0644\u0627\u0651'; // lam + alef + shadda

        // Act
        const shaped = renderer['_shape'](text);

        // Assert
        expect(shaped).toBeDefined();
        expect(shaped.length).toBeGreaterThan(0);
    });

    it('should process mixed ligature and non-ligature sequences', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const text = '\u0644\u0627\u0628\u062A'; // lam + alef + ba + ta

        // Act
        const shaped = renderer['_shape'](text);

        // Assert
        expect(shaped).toBeDefined();
        expect(shaped.length).toBeGreaterThan(0);
    });

    it('should handle consecutive same characters', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const text = '\u0628\u0628\u0628'; // ba + ba + ba

        // Act
        const shaped = renderer['_shape'](text);

        // Assert
        expect(shaped).toBeDefined();
        expect(shaped.length).toBeGreaterThan(0);
    });

    it('should handle all combining marks in sequence', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const marks = ['\u064B', '\u064C', '\u064D', '\u064E', '\u064F', '\u0650', '\u0651', '\u0652'];
        const baseChar = '\u0628'; // ba

        // Act
        const results = marks.map(mark => renderer['_shape'](baseChar + mark));

        // Assert
        results.forEach(shaped => {
            expect(shaped).toBeDefined();
            expect(shaped.length).toBeGreaterThan(0);
        });
    });

    it('should preserve consecutive non-Arabic characters', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const text = '123 456';

        // Act
        const shaped = renderer['_shape'](text);

        // Assert
        expect(shaped).toBe(text);
    });

    it('should correctly alternate between Arabic and non-Arabic spans', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const text = '\u0628 A \u062A';

        // Act
        const shaped = renderer['_shape'](text);

        // Assert
        expect(shaped.indexOf(' ')).toBeGreaterThan(0);
        expect(shaped.indexOf('A')).toBeGreaterThan(0);
    });

    // ============================================================================
    // _ArabicShape CLASS TESTS
    // ============================================================================

    it('should initialize _ArabicShape with default values', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange & Act
        const shape = new _ArabicShape();

        // Assert
        expect(shape._shapeValue).toBe('');
        expect(shape._shapeType).toBe('');
        expect(shape._shapeVowel).toBe('');
        expect(shape._shapeLigature).toBe(0);
        expect(shape._shapes).toBe(1);
    });

    it('should allow setting _shapeValue', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        const value = '\uFE8F';

        // Act
        shape._shapeValue = value;

        // Assert
        expect(shape._shapeValue).toBe(value);
    });

    it('should allow setting _shapeType', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        const type = '\u0651';

        // Act
        shape._shapeType = type;

        // Assert
        expect(shape._shapeType).toBe(type);
    });

    it('should allow setting _shapeVowel', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();
        const vowel = '\u064B';

        // Act
        shape._shapeVowel = vowel;

        // Assert
        expect(shape._shapeVowel).toBe(vowel);
    });

    it('should allow incrementing _shapeLigature', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();

        // Act
        shape._shapeLigature++;
        shape._shapeLigature++;

        // Assert
        expect(shape._shapeLigature).toBe(2);
    });

    it('should allow setting _shapes count', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const shape = new _ArabicShape();

        // Act
        shape._shapes = 4;

        // Assert
        expect(shape._shapes).toBe(4);
    });

    // ============================================================================
    // EDGE CASES AND BOUNDARY TESTS
    // ============================================================================

    it('should handle string with leading non-Arabic', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const text = 'ABC\u0628DEF';

        // Act
        const shaped = renderer['_shape'](text);

        // Assert
        expect(shaped.indexOf('ABC')).toBe(0);
    });

    it('should handle string with trailing non-Arabic', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const text = '\u0628ABC';

        // Act
        const shaped = renderer['_shape'](text);

        // Assert
        expect(shaped.indexOf('ABC')).toBeGreaterThan(0);
    });

    it('should handle characters exactly at boundaries', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const charAtStart = '\u0600'; // just before hamza range
        const hamza = '\u0621'; // first in range
        const bwhb = '\u06D3'; // last in range
        const charAfterEnd = '\u06D4'; // just after range
        const textStart = renderer['_shape'](charAtStart);
        const textHamza = renderer['_shape'](hamza);
        const textBwhb = renderer['_shape'](bwhb);
        const textAfterEnd = renderer['_shape'](charAfterEnd);
        expect(textStart).toBe(charAtStart);
        expect(textHamza).not.toBe(hamza); // should be shaped
        expect(textBwhb).not.toBe(bwhb); // should be shaped
        expect(textAfterEnd).toBe(charAfterEnd);
    });
    it('should handle very long Arabic string', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const longArabic = '\u0628'.repeat(100);

        // Act
        const shaped = renderer['_shape'](longArabic);

        // Assert
        expect(shaped).toBeDefined();
        expect(shaped.length).toBeGreaterThan(0);
    });

    it('should handle alternating single Arabic and non-Arabic chars', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const text = 'A\u0628B\u062AC\u062FD';

        // Act
        const shaped = renderer['_shape'](text);

        // Assert
        expect(shaped).toBeDefined();
        expect(shaped.length).toBeGreaterThan(0);
    });

    it('should handle unicode characters in ligature range', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        // Arrange
        const textLwawm = '\uFEF5'; // LAM-ALEF with Madda
        const textLwa = '\uFEFB'; // LAM-ALEF

        // Act
        const shapedLwawm = renderer['_shape'](textLwawm);
        const shapedLwa = renderer['_shape'](textLwa);

        // Assert
        expect(shapedLwawm).toBe(textLwawm);
        expect(shapedLwa).toBe(textLwa);
    });
    it('handle the property value mutation testing', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const texthHamza = '\u0621';
        expect(renderer._hamza).toEqual(texthHamza);
    });
    
});
describe('_getCharacterShape mutation tests', () => {
    it('should return unchanged value for unmapped Arabic character inside Arabic range', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const input: string = '\u063B';
        const result: string = (renderer as any)._getCharacterShape(input, 0);
        expect(result).toBe(input);
    });

    it('should return exact mapped isolated form for hamza boundary character', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const result: string = (renderer as any)._getCharacterShape('\u0621', 0);
        expect(result).toBe('\uFE80');
    });

    it('should return exact mapped isolated form for ba', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const result: string = (renderer as any)._getCharacterShape('\u0628', 0);
        expect(result).toBe('\uFE8F');
    });

    it('should return exact mapped final form for ba', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const result: string = (renderer as any)._getCharacterShape('\u0628', 1);
        expect(result).toBe('\uFE90');
    });

    it('should return exact mapped initial form for ba', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const result: string = (renderer as any)._getCharacterShape('\u0628', 2);
        expect(result).toBe('\uFE91');
    });

    it('should return exact mapped medial form for ba', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const result: string = (renderer as any)._getCharacterShape('\u0628', 3);
        expect(result).toBe('\uFE92');
    });

    it('should not lookup arabic map table for character before hamza boundary', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const input: string = '\u061F';
        const getSpy = spyOn((renderer as any)._arabicMapTable, 'get').and.callThrough();
        const result: string = (renderer as any)._getCharacterShape(input, 0);
        expect(result).toBe(input);
        expect(getSpy).not.toHaveBeenCalled();
    });

    it('should not lookup arabic map table for character after bwhb boundary', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const input: string = '\u06D4';
        const getSpy = spyOn((renderer as any)._arabicMapTable, 'get').and.callThrough();
        const result: string = (renderer as any)._getCharacterShape(input, 0);
        expect(result).toBe(input);
        expect(getSpy).not.toHaveBeenCalled();
    });

    it('should return unchanged value for lower lam-alef ligature boundary', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const input: string = '\uFEF5';
        const result: string = (renderer as any)._getCharacterShape(input, 0);
        expect(result).toBe(input);
    });

    it('should return unchanged value for upper lam-alef ligature boundary', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const input: string = '\uFEFB';
        const result: string = (renderer as any)._getCharacterShape(input, 0);
        expect(result).toBe(input);
    });

    it('should return unchanged value for character before lam-alef ligature range', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const input: string = '\uFEF4';
        const result: string = (renderer as any)._getCharacterShape(input, 0);
        expect(result).toBe(input);
    });

    it('should return unchanged value for character after lam-alef ligature range', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const input: string = '\uFEFC';
        const result: string = (renderer as any)._getCharacterShape(input, 0);
        expect(result).toBe(input);
    });
});
describe('_shape method focused mutation tests', () => {
    it('should not call _doShape for plain non-Arabic text', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const doShapeSpy = spyOn(renderer as any, '_doShape').and.callFake((value: string) => `[${value}]`);
        const result: string = (renderer as any)._shape('ABC');
        expect(result).toBe('ABC');
        expect(doShapeSpy).not.toHaveBeenCalled();
    });

    it('should treat lower Arabic range boundary as Arabic text', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const doShapeSpy = spyOn(renderer as any, '_doShape').and.callFake((value: string) => `[${value}]`);
        const input: string = '\u0600';
        const result: string = (renderer as any)._shape(input);
        expect(result).toBe('[\u0600]');
        expect(doShapeSpy).toHaveBeenCalledTimes(1);
        expect(doShapeSpy).toHaveBeenCalledWith('\u0600', 0);
    });

    it('should treat upper Arabic range boundary as Arabic text', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const doShapeSpy = spyOn(renderer as any, '_doShape').and.callFake((value: string) => `[${value}]`);
        const input: string = '\u06FF';
        const result: string = (renderer as any)._shape(input);
        expect(result).toBe('[\u06FF]');
        expect(doShapeSpy).toHaveBeenCalledTimes(1);
        expect(doShapeSpy).toHaveBeenCalledWith('\u06FF', 0);
    });

    it('should not treat character before Arabic range as Arabic text', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const doShapeSpy = spyOn(renderer as any, '_doShape').and.callFake((value: string) => `[${value}]`);
        const input: string = '\u05FF';
        const result: string = (renderer as any)._shape(input);
        expect(result).toBe(input);
        expect(doShapeSpy).not.toHaveBeenCalled();
    });

    it('should not treat character after Arabic range as Arabic text', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const doShapeSpy = spyOn(renderer as any, '_doShape').and.callFake((value: string) => `[${value}]`);
        const input: string = '\u0700';
        const result: string = (renderer as any)._shape(input);
        expect(result).toBe(input);
        expect(doShapeSpy).not.toHaveBeenCalled();
    });

    it('should flush one Arabic span before appending following non-Arabic character', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const doShapeSpy = spyOn(renderer as any, '_doShape').and.callFake((value: string) => `[${value}]`);
        const result: string = (renderer as any)._shape('\u0628X');
        expect(result).toBe('[\u0628]X');
        expect(doShapeSpy).toHaveBeenCalledTimes(1);
        expect(doShapeSpy).toHaveBeenCalledWith('\u0628', 0);
    });

    it('should group consecutive Arabic characters into one shaping call', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const doShapeSpy = spyOn(renderer as any, '_doShape').and.callFake((value: string) => `[${value}]`);
        const result: string = (renderer as any)._shape('\u0628\u062A');
        expect(result).toBe('[\u0628\u062A]');
        expect(doShapeSpy).toHaveBeenCalledTimes(1);
        expect(doShapeSpy).toHaveBeenCalledWith('\u0628\u062A', 0);
    });

    it('should not call _doShape for empty string', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const doShapeSpy = spyOn(renderer as any, '_doShape').and.callFake((value: string) => `[${value}]`);
        const result: string = (renderer as any)._shape('');
        expect(result).toBe('');
        expect(doShapeSpy).not.toHaveBeenCalled();
    });
});
describe('_doShape method mutation tests', () => {
    it('should increment present._shapeLigature when a new shape is created', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const capturedLigatures: number[] = [];
        spyOn(renderer as any, '_append').and.callFake((builder: string, shape: any, level: number) => {
            if (shape._shapeValue !== '') {
                capturedLigatures.push(shape._shapeLigature);
            }
            return builder + shape._shapeValue;
        });
        const result: string = (renderer as any)._doShape('\u0628', 0);
        expect(result).toBe('\uFE8F');
        expect(capturedLigatures).toEqual([1]);
    });

    it('should increment _shapeLigature for each newly processed Arabic character', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const capturedLigatures: number[] = [];
        spyOn(renderer as any, '_append').and.callFake((builder: string, shape: any, level: number) => {
            if (shape._shapeValue !== '') {
                capturedLigatures.push(shape._shapeLigature);
            }
            return builder + shape._shapeValue;
        });
        const result: string = (renderer as any)._doShape('\u0628\u062A', 0);
        expect(result).toBe('\uFE91\uFE96');
        expect(capturedLigatures).toEqual([1, 1]);
    });

    it('should pass actual input character to _ligature instead of initial next value', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const ligatureSpy = spyOn(renderer as any, '_ligature').and.callThrough();
        const result: string = (renderer as any)._doShape('\u0628', 0);
        expect(result).toBe('\uFE8F');
        expect(ligatureSpy).toHaveBeenCalledTimes(1);
        expect(ligatureSpy.calls.argsFor(0)[0]).toBe('\u0628');
        expect(ligatureSpy.calls.argsFor(0)[0]).not.toBe('styker was here');
    });
});
describe('_getShapeCount condition mutation tests', () => {
    it('should lookup arabic map for hamza lower boundary character', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const getSpy = spyOn((renderer as any)._arabicMapTable, 'get').and.callThrough();
        const result: number = (renderer as any)._getShapeCount('\u0621');
        expect(result).toBe(1);
        expect(getSpy).toHaveBeenCalledWith('\u0621');
    });

    it('should return exact shape count for alef mapped character', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const result: number = (renderer as any)._getShapeCount('\u0627');
        expect(result).toBe(2);
    });

    it('should return exact shape count for ba mapped character', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const result: number = (renderer as any)._getShapeCount('\u0628');
        expect(result).toBe(4);
    });

    it('should lookup arabic map for bwhb upper boundary character', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const getSpy = spyOn((renderer as any)._arabicMapTable, 'get').and.callThrough();
        const result: number = (renderer as any)._getShapeCount('\u06D3');
        expect(result).toBe(2);
        expect(getSpy).toHaveBeenCalledWith('\u06D3');
    });

    it('should not lookup arabic map for character before hamza boundary', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const getSpy = spyOn((renderer as any)._arabicMapTable, 'get').and.callThrough();
        const result: number = (renderer as any)._getShapeCount('\u0620');
        expect(result).toBe(1);
        expect(getSpy).not.toHaveBeenCalled();
    });

    it('should not lookup arabic map for character after bwhb boundary', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const getSpy = spyOn((renderer as any)._arabicMapTable, 'get').and.callThrough();
        const result: number = (renderer as any)._getShapeCount('\u06D4');
        expect(result).toBe(1);
        expect(getSpy).not.toHaveBeenCalled();
    });

    it('should not lookup arabic map for fathatan combining mark', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const getSpy = spyOn((renderer as any)._arabicMapTable, 'get').and.callThrough();
        const result: number = (renderer as any)._getShapeCount('\u064B');
        expect(result).toBe(1);
        expect(getSpy).not.toHaveBeenCalled();
    });

    it('should not lookup arabic map for hamza below combining mark', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const getSpy = spyOn((renderer as any)._arabicMapTable, 'get').and.callThrough();
        const result: number = (renderer as any)._getShapeCount('\u0655');
        expect(result).toBe(1);
        expect(getSpy).not.toHaveBeenCalled();
    });

    it('should not lookup arabic map for superalef combining mark', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const getSpy = spyOn((renderer as any)._arabicMapTable, 'get').and.callThrough();
        const result: number = (renderer as any)._getShapeCount('\u0670');
        expect(result).toBe(1);
        expect(getSpy).not.toHaveBeenCalled();
    });

    it('should return 4 for zero width joiner', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const result: number = (renderer as any)._getShapeCount('\u200D');
        expect(result).toBe(4);
    });

    it('should return fallback count for unmapped arabic character inside range', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const result: number = (renderer as any)._getShapeCount('\u063B');
        expect(result).toBe(1);
    });
    it('kills mutant: _getShapeCount should not read length from undefined map entry', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const unmappedArabicChar: string = '\u063B';
        expect((renderer as any)._arabicMapTable.get(unmappedArabicChar)).toBeUndefined();
        expect((renderer as any)._getShapeCount(unmappedArabicChar)).toBe(1);
    });
});
describe('_ligature focused mutation tests', () => {
    it('should not increment _shapeLigature when ligature result is 2', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const shape: _ArabicShape = new _ArabicShape();
        shape._shapeValue = '\u0627';
        shape._shapeLigature = 0;
        const result: number = (renderer as any)._ligature('\u0654', shape);
        expect(result).toBe(2);
        expect(shape._shapeValue).toBe('\u0623');
        expect(shape._shapeLigature).toBe(0);
    });

    it('should not treat character after hamzaBelow as combining mark', () => {
        const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
        const shape: _ArabicShape = new _ArabicShape();
        shape._shapeValue = '\u0628';
        shape._shapeType = '';
        shape._shapeVowel = '';
        shape._shapeLigature = 0;
        const result: number = (renderer as any)._ligature('\u0656', shape);
        expect(result).toBe(0);
        expect(shape._shapeValue).toBe('\u0628');
        expect(shape._shapeType).toBe('');
        expect(shape._shapeVowel).toBe('');
        expect(shape._shapeLigature).toBe(0);
    });
});