/**
 * Date and time field formats (`a:fld` `datetime` display text).
 *
 * @remarks
 * `CT_TextField` (`dml-main.xsd`) stores `@type="datetime…"` and a cached `a:t`.
 * PowerPoint's Header and Footer dialog writes one of the thirteen locale
 * patterns below (plus `None` for a fixed string with no field). The tokens are
 * the patterns Office writes for `en-US`; they are not invented element names.
 *
 * Citation: Transitional `dml-main.xsd` `CT_TextField` (`id` required, `type`
 * optional, `t` optional); ECMA-376-1 §21.1.2.2.1 `a:fld`.
 */
/**
 * Header and Footer date/time format, matching the PowerPoint dialog order.
 *
 * @public
 */
export enum DateTimeFormatType {
    /** Fixed text — no `datetime` field. */
    None = 0,
    /** `datetime1` — dddd, MMMM dd, yyyy. */
    DateTimeddddMMMMddyyyy = 1,
    /** `datetime3` — d MMMM yyyy. */
    DateTimedMMMMyyyy = 2,
    /** `datetime3` — d-MMM-yy. */
    DateTimedMMMyy = 3,
    /** `datetime4` — H:mm. */
    DateTimeHmm = 4,
    /** `datetime5` — h:mm AM/PM. */
    DateTimehmmAMPM = 5,
    /** `datetime6` — H:mm:ss. */
    DateTimeHmmss = 6,
    /** `datetime7` — h:mm:ss AM/PM. */
    DateTimehmmssAMPM = 7,
    /** `datetime8` — M/d/yyyy. */
    DateTimeMdyy = 8,
    /** `datetime9` — M/d/yy h:mm AM/PM. */
    DateTimeMMddyyhmmAMPM = 9,
    /** `datetime10` — M/d/yy h:mm:ss AM/PM. */
    DateTimeMMddyyhmmssAMPM = 10,
    /** `datetime4` — MMMM d, yyyy. */
    DateTimeMMMMdyyyy = 11,
    /** `datetime12` — MMMM yy. */
    DateTimeMMMMyy = 12,
    /** `datetime13` — MMM-yy. */
    DateTimeMMMyy = 13
}

/**
 * `a:fld/@type` token for a dialog format, or `undefined` for {@link DateTimeFormatType.None}.
 *
 * @param format - Dialog format.
 * @returns Field type token (`datetime1` … `datetime13`).
 */
/**
 * Office `a:fld/@type` tokens, aligned to {@link DateTimeFormatType} 1–13.
 *
 * The numeric tokens are not the dialog order. `[MS-OI29500]` §2.1.1385
 * defines `datetime1` as M/d/yyyy and `datetime13` as h:mm:ss AM/PM.
 * `datetimeFigureOut` is equivalent to `datetime1` and is what the built-in
 * master writes; reading it maps back to `DateTimeMdyy`.
 */
const DATE_TIME_FIELD_TOKENS: ReadonlyArray<string> = [
    'datetime2',
    'datetime3',
    'datetime5',
    'datetime10',
    'datetime12',
    'datetime11',
    'datetime13',
    'datetime1',
    'datetime8',
    'datetime9',
    'datetime4',
    'datetime6',
    'datetime7'
];

export function dateTimeFieldType(format: DateTimeFormatType): string | undefined {
    if (format === DateTimeFormatType.None) {
        return undefined;
    }
    return DATE_TIME_FIELD_TOKENS[format - 1];
}

/**
 * Reads a dialog format from an authored `a:fld/@type` token.
 *
 * @param fieldType - Authored type (`datetime1` … `datetime13`), or `undefined`.
 * @returns Matching format, or `undefined` when the token is not a known dialog format.
 */
export function dateTimeFormatFromFieldType(fieldType: string | undefined): DateTimeFormatType | undefined {
    if (fieldType === undefined) {
        return undefined;
    }
    if (fieldType === 'datetimeFigureOut') {
        return DateTimeFormatType.DateTimeMdyy;
    }
    const index: number = DATE_TIME_FIELD_TOKENS.indexOf(fieldType);
    if (index < 0) {
        return undefined;
    }
    return (index + 1) as DateTimeFormatType;
}
