/**
 * Standard Excel paper-size ids for {@link PageSetup.paperSize}.
 *
 * Values match Excel / BIFF / SpreadsheetML `pageSetup@paperSize`
 * (unsignedInt; default 1 = Letter).
 *
 * Citations:
 * - docs/api/API-RULES.md R3.5
 * - transitional sml.xsd `CT_PageSetup@paperSize`
 * - ECMA-376-1 §18.3.1.63
 */

/**
 * Provides the standard paper sizes, such as Letter, A4, and Legal, for
 * printing a worksheet. Assign one of these constants to a sheet's
 * page-setup `paperSize` — for example `PaperSize.A4` or `PaperSize.Letter`.
 *
 * Use these constants — never raw numbers at call sites.
 */
export const PaperSize: any = {
    /** US Letter — 8.5 × 11 in */
    Letter: 1,
    /** US Letter Small — 8.5 × 11 in with smaller printable area */
    LetterSmall: 2,
    /** US Tabloid — 11 × 17 in */
    Tabloid: 3,
    /** US Ledger — 17 × 11 in */
    Ledger: 4,
    /** US Legal — 8.5 × 14 in */
    Legal: 5,
    /** US Statement — 5.5 × 8.5 in */
    Statement: 6,
    /** US Executive — 7.25 × 10.5 in */
    Executive: 7,
    /** A3 — 297 × 420 mm */
    A3: 8,
    /** A4 — 210 × 297 mm */
    A4: 9,
    /** A4 Small — 210 × 297 mm with smaller printable area */
    A4Small: 10,
    /** A5 — 148 × 210 mm */
    A5: 11,
    /** B4 (JIS) — 257 × 364 mm */
    B4: 12,
    /** B5 (JIS) — 182 × 257 mm */
    B5: 13,
    /** Folio — 8.5 × 13 in */
    Folio: 14,
    /** Quarto — 215 × 275 mm */
    Quarto: 15,
    /** 10 × 14 in */
    Size10x14: 16,
    /** 11 × 17 in */
    Size11x17: 17,
    /** Note — 8.5 × 11 in */
    Note: 18,
    /** Envelope #9 — 3.875 × 8.875 in */
    Envelope9: 19,
    /** Envelope #10 — 4.125 × 9.5 in */
    Envelope10: 20,
    /** Envelope #11 — 4.5 × 10.375 in */
    Envelope11: 21,
    /** Envelope #12 — 4.75 × 11 in */
    Envelope12: 22,
    /** Envelope #14 — 5 × 11.5 in */
    Envelope14: 23,
    /** C paper — 17 × 22 in */
    C: 24,
    /** D paper — 22 × 34 in */
    D: 25,
    /** E paper — 34 × 44 in */
    E: 26,
    /** Envelope DL — 110 × 220 mm */
    EnvelopeDL: 27,
    /** Envelope C5 — 162 × 229 mm */
    EnvelopeC5: 28,
    /** Envelope C3 — 324 × 458 mm */
    EnvelopeC3: 29,
    /** Envelope C4 — 229 × 324 mm */
    EnvelopeC4: 30,
    /** Envelope C6 — 114 × 162 mm */
    EnvelopeC6: 31,
    /** Envelope C65 — 114 × 229 mm */
    EnvelopeC65: 32,
    /** Envelope B4 — 250 × 353 mm */
    EnvelopeB4: 33,
    /** Envelope B5 — 176 × 250 mm */
    EnvelopeB5: 34,
    /** Envelope B6 — 176 × 125 mm */
    EnvelopeB6: 35,
    /** Envelope Italy — 110 × 230 mm */
    EnvelopeItaly: 36,
    /** Envelope Monarch — 3.875 × 7.5 in */
    EnvelopeMonarch: 37,
    /** Envelope 6¾ — 3.625 × 6.5 in */
    Envelope634: 38,
    /** US Standard Fanfold — 14.875 × 11 in */
    UsStandardFanfold: 39,
    /** German Standard Fanfold — 8.5 × 12 in */
    GermanStandardFanfold: 40,
    /** German Legal Fanfold — 8.5 × 13 in */
    GermanLegalFanfold: 41,
    /** ISO B4 — 250 × 353 mm */
    IsoB4: 42,
    /** Japanese Postcard — 100 × 148 mm */
    JapanesePostcard: 43,
    /** 9 × 11 in */
    Size9x11: 44,
    /** 10 × 11 in */
    Size10x11: 45,
    /** 15 × 11 in */
    Size15x11: 46,
    /** Envelope Invite — 220 × 220 mm */
    EnvelopeInvite: 47,
    /** Letter Extra — 9.5 × 12 in */
    LetterExtra: 50,
    /** Legal Extra — 9.5 × 15 in */
    LegalExtra: 51,
    /** Tabloid Extra — 11.69 × 18 in */
    TabloidExtra: 52,
    /** A4 Extra — 236 × 322 mm */
    A4Extra: 53,
    /** Letter Transverse — 8.5 × 11 in, printed sideways */
    LetterTransverse: 54,
    /** A4 Transverse — 210 × 297 mm, printed sideways */
    A4Transverse: 55,
    /** Letter Extra Transverse — 9.5 × 12 in, printed sideways */
    LetterExtraTransverse: 56,
    /** Super A — 227 × 305 mm */
    SuperA: 57,
    /** Super B — 305 × 483 mm */
    SuperB: 58,
    /** Letter Plus — 8.5 × 12.69 in */
    LetterPlus: 59,
    /** A4 Plus — 210 × 330 mm */
    A4Plus: 60,
    /** A5 Transverse — 148 × 210 mm, printed sideways */
    A5Transverse: 61,
    /** B5 (JIS) Transverse — 182 × 257 mm, printed sideways */
    B5Transverse: 62,
    /** A3 Extra — 322 × 445 mm */
    A3Extra: 63,
    /** A5 Extra — 174 × 235 mm */
    A5Extra: 64,
    /** ISO B5 Extra — 201 × 276 mm */
    IsoB5Extra: 65,
    /** A2 — 420 × 594 mm */
    A2: 66,
    /** A3 Transverse — 297 × 420 mm, printed sideways */
    A3Transverse: 67,
    /** A3 Extra Transverse — 322 × 445 mm, printed sideways */
    A3ExtraTransverse: 68
};

/**
 * Represents one of the valid {@link PaperSize} identifiers as a plain
 * number.
 */
export type PaperSizeId = (typeof PaperSize)[keyof typeof PaperSize];
