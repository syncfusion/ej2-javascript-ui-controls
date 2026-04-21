/**
 * Arabic shaping engine that converts base Arabic code points into their
 * contextual presentation forms (isolated/initial/medial/final), handles
 * marks (shadda/hamza/madda/tanween), and common ligatures.
 *
 * @private
 */
export class _ArabicShapeRenderer {
    /**
     * Arabic presentation forms for letters in isolated, initial, medial, and final shapes.
     *
     * @private
     */
    _arabicCharTable: string[][] = [['\u0621', '\uFE80'], ['\u0622', '\uFE81', '\uFE82'], ['\u0623', '\uFE83', '\uFE84'],
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
    /**
     * Arabic letter Alef.
     *
     * @private
     */
    _alef: string = '\u0627';
    /**
     * Arabic letter Alef with Hamza above.
     *
     * @private
     */
    _alefHamza: string = '\u0623';
    /**
     * Arabic letter Alef with Hamza below.
     *
     * @private
     */
    _alefHamzaBelow: string = '\u0625';
    /**
     * Arabic letter Alef with Madda above.
     *
     * @private
     */
    _alefMadda: string = '\u0622';
    /**
     * Arabic letter Lam.
     *
     * @private
     */
    _lam: string = '\u0644';
    /**
     * Arabic letter Lam.
     *
     * @private
     */
    _hamza: string = '\u0621';
    /**
     * Zero Width Joiner character used in shaping.
     *
     * @private
     */
    _zeroWidthJoiner: string = '\u200D';
    /**
     * Arabic combining Hamza above mark.
     *
     * @private
     */
    _hamzaAbove: string = '\u0654';
    /**
     * Arabic combining Hamza below mark.
     *
     * @private
     */
    _hamzaBelow: string = '\u0655';
    /**
     * Arabic letter Waw with Hamza above.
     *
     * @private
     */
    _wawHamza: string = '\u0624';
    /**
     * Arabic letter Yeh with Hamza above.
     *
     * @private
     */
    _yehHamza: string = '\u0626';
    /**
     * Arabic letter waw.
     *
     * @private
     */
    _waw: string = '\u0648';
    /**
     * Arabic letter Alef Maqsura Yeh without dots.
     *
     * @private
     */
    _alefsura: string = '\u0649';
    /**
     * Arabic letter Yeh.
     *
     * @private
     */
    _yeh: string = '\u064A';
    /**
     * Farsi Yeh character.
     *
     * @private
     */
    _farsiYeh: string = '\u06CC';
    /**
     * Arabic Shadda combining mark.
     *
     * @private
     */
    _shadda: string = '\u0651';
    /**
     * Arabic Madda combining mark.
     *
     * @private
     */
    _madda: string = '\u0653';
    /**
     * Ligature LAM-ALEF with small alef above (isolated/final).
     *
     * @private
     */
    _lwa: string = '\uFEFB';
    /**
     * Ligature LAM with WAW and Hamza above (isolated).
     *
     * @private
     */
    _lwawh: string = '\uFEF7';
    /**
     * Ligature LAM with WAW and Hamza below (isolated).
     *
     * @private
     */
    _lwawhb: string = '\uFEF9';
    /**
     * Ligature LAM-ALEF with Madda above (isolated).
     *
     * @private
     */
    _lwawm: string = '\uFEF5';
    /**
     * Urdu Heh with Yeh above (ligature part).
     *
     * @private
     */
    _bwhb: string = '\u06D3';
    /**
     * Arabic Fathatan diacritic.
     *
     * @private
     */
    _fathatan: string = '\u064B';
    /**
     * Arabic superscript alef.
     *
     * @private
     */
    _superalef: string = '\u0670';
    /**
     * Bitmask flag used to mark vowel/diacritic characters.
     *
     * @private
     */
    _vowel: number = 0x1;
    /**
     * Map of base Arabic characters to their contextual shape forms.
     *
     * @private
     */
    _arabicMapTable: Map<string, string[]>  = new Map<string, string[]>();
    /**
     * Creates an instance of the 'ArabicShapeRenderer' class.
     *
     * @private
     */
    constructor() {
        this._arabicCharTable.forEach((charTableEntry: any) => { // eslint-disable-line
            this._arabicMapTable.set(charTableEntry[0], charTableEntry);
        });
    }
    /**
     * Resolves the contextual presentation form for a given base Arabic character
     * by index 0 = isolated, 1 = final, 2 = initial, 3 = medial based on table layout.
     * Returns the input unchanged when outside the shaping range or when presentation
     * form is not applicable.
     *
     * @private
     * @param {string} input The base character to shape.
     * @param {number} index The contextual form index offset (added to table base).
     * @returns {string} The presentation form for the specified index, or the input if not applicable.
     */
    _getCharacterShape(input: string, index: number): string {
        if ((input >= this._hamza) && (input <= this._bwhb)) {
            let value: string[] = [];
            if (this._arabicMapTable.get(input)) {
                value = this._arabicMapTable.get(input);
                return value[index + 1];
            }
        } else if (input >= this._lwawm && input <= this._lwa) {
            return (input) as string;
        }
        return input;
    }
    /**
     * Shapes a mixed text string by detecting Arabic spans,
     * running shaping on those spans, and concatenating with untouched non Arabic text.
     *
     * @private
     * @param {string} text The input text (may contain mixed scripts).
     * @returns {string} The shaped text with Arabic spans converted to presentation forms.
     */
    _shape(text: string): string {
        let builder: string = '';
        let value: string = '';
        for (let i: number = 0; i < text.length; i++) {
            const c: string = text[<number>i];
            if (c >= '؀'  && c <= 'ۿ') {
                value = value + c;
            } else {
                if (value.length > 0) {
                    const shapeText: string = this._doShape(value.toString(), 0);
                    builder = builder + shapeText;
                    value = '';
                }
                builder = builder + c;
            }
        }
        if (value.length > 0) {
            const shapeText: string = this._doShape(value.toString(), 0);
            builder = builder + shapeText;
        }
        return builder.toString();
    }
    /**
     * Performs contextual shaping over a pure Arabic span: applies joining logic,
     * marks (shadda/hamza/madda/tanween), and ligatures, producing
     * properly ordered presentation forms.
     *
     * @private
     * @param {string} input The Arabic substring to shape.
     * @param {number} level Bitfield flags affecting shaping (e.g., `_vowel`).
     * @returns {string} The shaped Arabic substring.
     */
    _doShape(input: string, level: number): string {
        let str: string = '';
        let ligature: number = 0;
        let len: number = 0;
        let i: number = 0;
        let next: string = '';
        let previous: _ArabicShape = new _ArabicShape();
        let present: _ArabicShape = new _ArabicShape();
        while (i < input.length) {
            next = input[i++];
            ligature = this._ligature(next, present);
            if (ligature === 0) {
                const shapeCount: number = this._getShapeCount(next);
                len = (shapeCount === 1) ? 0 : 2;
                if (previous._shapes > 2) {
                    len += 1;
                }
                len = len % (present._shapes);
                present._shapeValue = this._getCharacterShape(present._shapeValue, len);
                str = this._append(str, previous, level);
                previous = present;
                present = new _ArabicShape();
                present._shapeValue = next;
                present._shapes = shapeCount;
                present._shapeLigature++;
            }
        }
        len = (previous._shapes > 2) ? 1 : 0;
        len = len % (present._shapes);
        present._shapeValue = this._getCharacterShape(present._shapeValue, len);
        str = this._append(str, previous, level);
        str = this._append(str, present, level);
        return str.toString();
    }
    /**
     * Appends a shaped unit to the output builder in this order:
     * 1) base presentation form, 2) optional diacritic type, 3) optional vowel,
     * conditioned by the supplied `level` flags.
     *
     * @private
     * @param {string} builder The current output string.
     * @param {_ArabicShape} shape The shaped unit (base + marks) to append.
     * @param {number} level Bitfield flags controlling which components to emit.
     * @returns {string} The updated output string.
     */
    _append(builder: string, shape: _ArabicShape, level: number): string {
        if (shape._shapeValue !== '') {
            builder = builder + shape._shapeValue;
            shape._shapeLigature -= 1;
            if (shape._shapeType !== '') {
                if ((level & this._vowel) === 0) {
                    builder = builder + shape._shapeType;
                    shape._shapeLigature -= 1;
                } else {
                    shape._shapeLigature -= 1;
                }
            }
            if (shape._shapeVowel !== '') {
                if ((level & this._vowel) === 0) {
                    builder = builder + shape._shapeVowel;
                    shape._shapeLigature -= 1;
                } else {
                    shape._shapeLigature -= 1;
                }
            }
        }
        return builder;
    }
    /**
     * Processes combining marks and ligatures for the current shape context:
     * - Combines shadda/hamza/madda/tanween into the current shape as type/vowel.
     * - Folds lam+alef variants to precomposed lam alef presentation forms.
     *
     * Returns:
     * 0 → no ligation/mark applied,
     * 1 → a mark consumed,
     * 2 → mark caused a base replacement,
     * 3 → lam alef ligature formed.
     *
     * @private
     * @param {string} value The next code point to attempt combining/ligation with.
     * @param {_ArabicShape} shape The current shape context.
     * @returns {number} The action code describing the change.
     */
    _ligature(value: string, shape: _ArabicShape): number {
        if (shape._shapeValue !== '') {
            let result: number = 0;
            if ((value >= this._fathatan && value <= this._hamzaBelow) || value === this._superalef) {
                result = 1;
                if ((shape._shapeVowel !== '') && (value !== this._shadda)) {
                    result = 2;
                }
                if (value === this._shadda) {
                    if (shape._shapeType === '') {
                        shape._shapeType = this._shadda;
                    } else {
                        return 0;
                    }
                } else if (value === this._hamzaBelow) {
                    if (shape._shapeValue === this._alef) {
                        shape._shapeValue = this._alefHamzaBelow;
                        result = 2;
                    } else if (shape._shapeValue === this._lwa) {
                        shape._shapeValue = this._lwawhb;
                        result = 2;
                    } else {
                        shape._shapeType = this._hamzaBelow;
                    }
                } else if (value === this._hamzaAbove) {
                    if (shape._shapeValue === this._alef) {
                        shape._shapeValue = this._alefHamza;
                        result = 2;
                    } else if (shape._shapeValue === this._lwa) {
                        shape._shapeValue = this._lwawh;
                        result = 2;
                    } else if (shape._shapeValue === this._waw) {
                        shape._shapeValue = this._wawHamza;
                        result = 2;
                    } else if (shape._shapeValue === this._yeh || shape._shapeValue === this._alefsura ||
                               shape._shapeValue === this._farsiYeh) {
                        shape._shapeValue = this._yehHamza;
                        result = 2;
                    } else {
                        shape._shapeType = this._hamzaAbove;
                    }
                } else if (value === this._madda) {
                    if (shape._shapeValue === this._alef) {
                        shape._shapeValue = this._alefMadda;
                        result = 2;
                    }
                } else {
                    shape._shapeVowel = value;
                }
                if (result === 1) {
                    shape._shapeLigature++;
                }
                return result;
            }
            if (shape._shapeVowel !== '') {
                return 0;
            }
            if (shape._shapeValue === this._lam) {
                if (value === this._alef) {
                    shape._shapeValue = this._lwa;
                    shape._shapes = 2;
                    result = 3;
                } else if (value === this._alefHamza) {
                    shape._shapeValue = this._lwawh;
                    shape._shapes = 2;
                    result = 3;
                } else if (value === this._alefHamzaBelow) {
                    shape._shapeValue = this._lwawhb;
                    shape._shapes = 2;
                    result = 3;
                } else if (value === this._alefMadda) {
                    shape._shapeValue = this._lwawm;
                    shape._shapes = 2;
                    result = 3;
                }
            }
            return result;
        } else {
            return 0;
        }
    }
    /**
     * Returns the number of contextual presentation forms available for a character:
     * typically 1 (non joining), 2 (right joining/final/isolate), or 4 (dual joining),
     * and 4 for Zero Width Joiner logic. Defaults to 1 for non Arabic or marks.
     *
     * @private
     * @param {string} shape The character to evaluate.
     * @returns {number} The number of available contextual forms (1, 2, or 4).
     */
    _getShapeCount(shape: string): number {
        if ((shape >= this._hamza) && (shape <= this._bwhb) && !((shape >= this._fathatan && shape <= this._hamzaBelow)
                    || shape === this._superalef)) {
            let c: string[] = [];
            if (this._arabicMapTable.get(shape)) {
                c = this._arabicMapTable.get(shape);
                return c.length - 1;
            }
        } else if (shape === this._zeroWidthJoiner) {
            return 4;
        }
        return 1;
    }
}
/**
 * Mutable shaping state for a single Arabic unit, tracking the selected
 * presentation form, optional diacritic marks, ligature count,
 * and how many contextual forms the character supports.
 *
 * @private
 */
export class _ArabicShape {
    /**
     * Holds the shaped character value for the current position.
     *
     * @private
     */
    _shapeValue: string = '';
    /**
     * Describes the shaping type (isolated, initial, medial, final).
     *
     * @private
     */
    _shapeType: string = '';
    /**
     * Stores any vowel or combining marks applied during shaping.
     *
     * @private
     */
    _shapeVowel: string = '';
    /**
     * Indicates the ligature code or kind if applied.
     *
     * @private
     */
    _shapeLigature: number = 0;
    /**
     * Number of glyphs produced by shaping the current code point.
     *
     * @private
     */
    _shapes: number = 1;
}

