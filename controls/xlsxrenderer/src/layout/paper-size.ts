import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { UnitConverter } from '../common/index';

/**
 * Represents printable paper dimensions in typographic points.
 */
export interface PaperDimensions {
    /** Paper width in points. */
    width: number;
    /** Paper height in points. */
    height: number;
}

/**
 * Converts inches to points rounded to two decimal places.
 *
 * @param {number} widthInches Width in inches.
 * @param {number} heightInches Height in inches.
 * @returns {PaperDimensions} Dimension object in points.
 */
function inSize(widthInches: number, heightInches: number): PaperDimensions {
    return {
        width: Math.round(UnitConverter.inchesToPoints(widthInches) * 100) / 100,
        height: Math.round(UnitConverter.inchesToPoints(heightInches) * 100) / 100
    };
}

/**
 * Converts millimeters to points rounded to two decimal places.
 *
 * @param {number} widthMillimeters Width in millimeters.
 * @param {number} heightMillimeters Height in millimeters.
 * @returns {PaperDimensions} Dimension object in points.
 */
function mmSize(widthMillimeters: number, heightMillimeters: number): PaperDimensions {
    return {
        width: Math.round(((widthMillimeters * 72) / 25.4) * 100) / 100,
        height: Math.round(((heightMillimeters * 72) / 25.4) * 100) / 100
    };
}

const PAPER_SIZE_ENTRIES: Record<string, PaperDimensions> = {
    a2: inSize(16.54, 23.39),
    a2paper: inSize(16.54, 23.39),
    a3: inSize(11.69, 16.54),
    papera3: inSize(11.69, 16.54),
    a3extrapaper: inSize(12.68, 17.52),
    a3extratransversepaper: inSize(12.68, 17.52),
    a3transversepaper: inSize(11.69, 16.54),
    a4: inSize(8.27, 11.69),
    papera4: inSize(8.27, 11.69),
    papera4small: inSize(8.27, 11.69),
    a4small: inSize(8.27, 11.69),
    a4extrapaper: inSize(9.27, 12.69),
    a4pluspaper: inSize(8.27, 12.99),
    a4transversepaper: inSize(8.27, 11.69),
    a5: inSize(5.83, 8.27),
    papera5: inSize(5.83, 8.27),
    a5extrapaper: inSize(6.85, 9.25),
    a5extrappaper: inSize(6.85, 9.25),
    a5transversepaper: inSize(5.83, 8.27),
    inviteenvelope: inSize(8.66, 8.66),
    isob4: mmSize(250, 353),
    isob5extrapaper: inSize(7.91, 10.87),
    japanesedoublepostcard: inSize(7.87, 5.83),
    jisb5transversepaper: inSize(7.17, 10.12),
    legalextrapaper9275by15: inSize(9.275, 15),
    letterextratransversepaper: inSize(9.275, 12),
    letterextrapaper: inSize(9.275, 12),
    letterextrapaper9275by12: inSize(9.275, 12),
    letterpluspaper: inSize(8.5, 12.69),
    lettertransversepaper: inSize(8.275, 11),
    paper10x14: inSize(10, 14),
    paper11x17: inSize(11, 17),
    b4: inSize(9.84, 13.9),
    paperb4: inSize(9.84, 13.9),
    b5: mmSize(176, 250),
    paperb5: mmSize(176, 250),
    papercsheet: inSize(17, 22),
    paperlettersmall: inSize(8.5, 11),
    papernote: inSize(8.5, 11),
    letter: inSize(8.5, 11),
    paperletter: inSize(8.5, 11),
    paperdsheet: inSize(22, 34),
    paperesheet: inSize(34, 44),
    paperenvelope9: inSize(3.87, 8.87),
    paperenvelope10: inSize(4.12, 9.5),
    paperenvelope11: inSize(4.5, 10.37),
    paperenvelope12: inSize(4.75, 11),
    paperenvelope14: inSize(5, 11.5),
    paperquarto: inSize(8.47, 10.83),
    quarto: inSize(8.47, 10.83),
    paperfolio: inSize(8.5, 13),
    folio: inSize(8.5, 13),
    legal: inSize(8.5, 14),
    paperlegal: inSize(8.5, 14),
    paperledger: inSize(17, 11),
    ledger: inSize(17, 11),
    papertabloid: inSize(11, 17),
    tabloid: inSize(11, 17),
    tabloidextrapaper: inSize(11.69, 18),
    paperstatement: inSize(5.5, 8.5),
    statement: inSize(5.5, 8.5),
    paperexecutive: inSize(7.25, 10.5),
    executive: inSize(7.25, 10.5),
    paperenvelopedl: inSize(4.33, 8.66),
    paperenvelopec5: inSize(6.38, 9.02),
    paperenvelopec3: inSize(12.76, 18.03),
    paperenvelopec4: inSize(9.02, 12.76),
    paperenvelopec6: inSize(4.49, 6.38),
    paperenvelopec65: inSize(4.49, 9.02),
    paperenvelopeb4: inSize(9.84, 13.9),
    paperenvelopeb5: inSize(6.93, 9.84),
    paperenvelopeb6: inSize(6.93, 4.92),
    paperenvelopeitaly: inSize(4.33, 9.06),
    paperenvelopemonarch: inSize(3.87, 7.5),
    paperenvelopepersonal: inSize(3.85, 6.5),
    paperfanfoldlegalgerman: inSize(8.5, 13),
    paperfanfoldstdgerman: inSize(8.5, 12),
    paperfanfoldus: inSize(14.87, 11),
    standardpaper10by11: inSize(10, 11),
    standardpaper15by11: inSize(15, 11),
    standardpaper9by11: inSize(9, 11),
    superasuperaa4paper: inSize(8.94, 14.02),
    superbsuperba3paper: inSize(12.01, 19.17),
    '1': inSize(8.5, 11),
    '2': inSize(8.5, 11),
    '3': inSize(11, 17),
    '4': inSize(17, 11),
    '5': inSize(8.5, 14),
    '6': inSize(5.5, 8.5),
    '7': inSize(7.25, 10.5),
    '8': inSize(11.69, 16.54),
    '9': inSize(8.27, 11.69),
    '10': inSize(8.27, 11.69),
    '11': inSize(5.83, 8.27),
    '12': inSize(9.84, 13.9),
    '13': mmSize(176, 250),
    '14': inSize(8.5, 13),
    '15': inSize(8.47, 10.83),
    '16': inSize(10, 14),
    '17': inSize(11, 17),
    '18': inSize(8.5, 11),
    '19': inSize(3.87, 8.87),
    '20': inSize(4.12, 9.5),
    '21': inSize(4.5, 10.37),
    '22': inSize(4.75, 11),
    '23': inSize(5, 11.5),
    '24': inSize(17, 22),
    '25': inSize(22, 34),
    '26': inSize(34, 44),
    '27': inSize(4.33, 8.66),
    '28': inSize(6.38, 9.02),
    '29': inSize(12.76, 18.03),
    '30': inSize(9.02, 12.76),
    '31': inSize(4.49, 6.38),
    '32': inSize(4.49, 9.02),
    '33': inSize(9.84, 13.9),
    '34': inSize(6.93, 9.84),
    '35': inSize(6.93, 4.92),
    '36': inSize(4.33, 9.06),
    '37': inSize(3.87, 7.5),
    '38': inSize(3.85, 6.5),
    '39': inSize(14.87, 11),
    '40': inSize(8.5, 12),
    '41': inSize(8.5, 13)
};

const DEFAULT_A4_SIZE: PaperDimensions = { width: 595.28, height: 841.89 };

/**
 * Resolves standard or custom paper dimensions in typographic points.
 *
 * @param {string | number} [paperSize] Standard paper size enum name (e.g. `'A4'`, `'Letter'`) or OpenXML numeric paper code.
 * @param {Object} [customPaperSize] Optional custom paper dimensions in inches.
 * @param {number} customPaperSize.width Custom width in inches.
 * @param {number} customPaperSize.height Custom height in inches.
 * @returns {PaperDimensions} The resolved paper dimensions in points (defaults to A4: 595.28 x 841.89 pt).
 */
export function getExcelSheetSize(
    paperSize?: string | number,
    customPaperSize?: { width: number; height: number }
): PaperDimensions {
    if (!isNullOrUndefined(customPaperSize) && customPaperSize.width > 0 && customPaperSize.height > 0) {
        return inSize(customPaperSize.width, customPaperSize.height);
    }
    if (isNullOrUndefined(paperSize) || paperSize === '') {
        return { width: DEFAULT_A4_SIZE.width, height: DEFAULT_A4_SIZE.height };
    }
    const normalized: string = String(paperSize).trim().toLowerCase();
    const paperKey: string = 'paper' + normalized;
    const entries: Record<string, PaperDimensions> = PAPER_SIZE_ENTRIES;
    const matched: PaperDimensions | undefined = entries[normalized as string] || entries[paperKey as string];
    return matched ? { width: matched.width, height: matched.height } : { width: DEFAULT_A4_SIZE.width, height: DEFAULT_A4_SIZE.height };
}
