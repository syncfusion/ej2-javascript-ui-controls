import { builtinTableStyleMember } from './builtin-table-style-ids';

/**
 * Public built-in table style names.
 *
 * Contains the built-in table styles supported by the PowerPoint library.
 * Gallery members map to the corresponding table style identifiers defined in
 * builtin-table-style-ids.ts.
 *
 * @public
 */
export enum BuiltInTableStyle {
    custom = 'custom',
    darkStyle1 = 'darkStyle1',
    darkStyle1Accent1 = 'darkStyle1Accent1',
    darkStyle1Accent2 = 'darkStyle1Accent2',
    darkStyle1Accent3 = 'darkStyle1Accent3',
    darkStyle1Accent4 = 'darkStyle1Accent4',
    darkStyle1Accent5 = 'darkStyle1Accent5',
    darkStyle1Accent6 = 'darkStyle1Accent6',
    darkStyle2 = 'darkStyle2',
    darkStyle2Accent1Accent2 = 'darkStyle2Accent1Accent2',
    darkStyle2Accent3Accent4 = 'darkStyle2Accent3Accent4',
    darkStyle2Accent5Accent6 = 'darkStyle2Accent5Accent6',
    lightStyle1 = 'lightStyle1',
    lightStyle1Accent1 = 'lightStyle1Accent1',
    lightStyle1Accent2 = 'lightStyle1Accent2',
    lightStyle1Accent3 = 'lightStyle1Accent3',
    lightStyle1Accent4 = 'lightStyle1Accent4',
    lightStyle1Accent5 = 'lightStyle1Accent5',
    lightStyle1Accent6 = 'lightStyle1Accent6',
    lightStyle2 = 'lightStyle2',
    lightStyle2Accent1 = 'lightStyle2Accent1',
    lightStyle2Accent2 = 'lightStyle2Accent2',
    lightStyle2Accent3 = 'lightStyle2Accent3',
    lightStyle2Accent4 = 'lightStyle2Accent4',
    lightStyle2Accent5 = 'lightStyle2Accent5',
    lightStyle2Accent6 = 'lightStyle2Accent6',
    lightStyle3 = 'lightStyle3',
    lightStyle3Accent1 = 'lightStyle3Accent1',
    lightStyle3Accent2 = 'lightStyle3Accent2',
    lightStyle3Accent3 = 'lightStyle3Accent3',
    lightStyle3Accent4 = 'lightStyle3Accent4',
    lightStyle3Accent5 = 'lightStyle3Accent5',
    lightStyle3Accent6 = 'lightStyle3Accent6',
    mediumStyle1 = 'mediumStyle1',
    mediumStyle1Accent1 = 'mediumStyle1Accent1',
    mediumStyle1Accent2 = 'mediumStyle1Accent2',
    mediumStyle1Accent3 = 'mediumStyle1Accent3',
    mediumStyle1Accent4 = 'mediumStyle1Accent4',
    mediumStyle1Accent5 = 'mediumStyle1Accent5',
    mediumStyle1Accent6 = 'mediumStyle1Accent6',
    mediumStyle2 = 'mediumStyle2',
    mediumStyle2Accent1 = 'mediumStyle2Accent1',
    mediumStyle2Accent2 = 'mediumStyle2Accent2',
    mediumStyle2Accent3 = 'mediumStyle2Accent3',
    mediumStyle2Accent4 = 'mediumStyle2Accent4',
    mediumStyle2Accent5 = 'mediumStyle2Accent5',
    mediumStyle2Accent6 = 'mediumStyle2Accent6',
    mediumStyle3 = 'mediumStyle3',
    mediumStyle3Accent1 = 'mediumStyle3Accent1',
    mediumStyle3Accent2 = 'mediumStyle3Accent2',
    mediumStyle3Accent3 = 'mediumStyle3Accent3',
    mediumStyle3Accent4 = 'mediumStyle3Accent4',
    mediumStyle3Accent5 = 'mediumStyle3Accent5',
    mediumStyle3Accent6 = 'mediumStyle3Accent6',
    mediumStyle4 = 'mediumStyle4',
    mediumStyle4Accent1 = 'mediumStyle4Accent1',
    mediumStyle4Accent2 = 'mediumStyle4Accent2',
    mediumStyle4Accent3 = 'mediumStyle4Accent3',
    mediumStyle4Accent4 = 'mediumStyle4Accent4',
    mediumStyle4Accent5 = 'mediumStyle4Accent5',
    mediumStyle4Accent6 = 'mediumStyle4Accent6',
    none = 'none',
    noStyleNoGrid = 'noStyleNoGrid',
    noStyleTableGrid = 'noStyleTableGrid',
    themedStyle1Accent1 = 'themedStyle1Accent1',
    themedStyle1Accent2 = 'themedStyle1Accent2',
    themedStyle1Accent3 = 'themedStyle1Accent3',
    themedStyle1Accent4 = 'themedStyle1Accent4',
    themedStyle1Accent5 = 'themedStyle1Accent5',
    themedStyle1Accent6 = 'themedStyle1Accent6',
    themedStyle2Accent1 = 'themedStyle2Accent1',
    themedStyle2Accent2 = 'themedStyle2Accent2',
    themedStyle2Accent3 = 'themedStyle2Accent3',
    themedStyle2Accent4 = 'themedStyle2Accent4',
    themedStyle2Accent5 = 'themedStyle2Accent5',
    themedStyle2Accent6 = 'themedStyle2Accent6',
}

const BUILT_IN_TABLE_STYLE_VALUES: { [key: string]: true } = {
    custom: true, darkStyle1: true, darkStyle1Accent1: true, darkStyle1Accent2: true,
    darkStyle1Accent3: true, darkStyle1Accent4: true, darkStyle1Accent5: true, darkStyle1Accent6: true,
    darkStyle2: true, darkStyle2Accent1Accent2: true, darkStyle2Accent3Accent4: true, darkStyle2Accent5Accent6: true,
    lightStyle1: true, lightStyle1Accent1: true, lightStyle1Accent2: true, lightStyle1Accent3: true,
    lightStyle1Accent4: true, lightStyle1Accent5: true, lightStyle1Accent6: true,
    lightStyle2: true, lightStyle2Accent1: true, lightStyle2Accent2: true, lightStyle2Accent3: true,
    lightStyle2Accent4: true, lightStyle2Accent5: true, lightStyle2Accent6: true,
    lightStyle3: true, lightStyle3Accent1: true, lightStyle3Accent2: true, lightStyle3Accent3: true,
    lightStyle3Accent4: true, lightStyle3Accent5: true, lightStyle3Accent6: true,
    mediumStyle1: true, mediumStyle1Accent1: true, mediumStyle1Accent2: true, mediumStyle1Accent3: true,
    mediumStyle1Accent4: true, mediumStyle1Accent5: true, mediumStyle1Accent6: true,
    mediumStyle2: true, mediumStyle2Accent1: true, mediumStyle2Accent2: true, mediumStyle2Accent3: true,
    mediumStyle2Accent4: true, mediumStyle2Accent5: true, mediumStyle2Accent6: true,
    mediumStyle3: true, mediumStyle3Accent1: true, mediumStyle3Accent2: true, mediumStyle3Accent3: true,
    mediumStyle3Accent4: true, mediumStyle3Accent5: true, mediumStyle3Accent6: true,
    mediumStyle4: true, mediumStyle4Accent1: true, mediumStyle4Accent2: true, mediumStyle4Accent3: true,
    mediumStyle4Accent4: true, mediumStyle4Accent5: true, mediumStyle4Accent6: true,
    none: true, noStyleNoGrid: true, noStyleTableGrid: true,
    themedStyle1Accent1: true, themedStyle1Accent2: true, themedStyle1Accent3: true,
    themedStyle1Accent4: true, themedStyle1Accent5: true, themedStyle1Accent6: true,
    themedStyle2Accent1: true, themedStyle2Accent2: true, themedStyle2Accent3: true,
    themedStyle2Accent4: true, themedStyle2Accent5: true, themedStyle2Accent6: true,
};

export function isBuiltInTableStyle(value: string): boolean {
    return styleFromMember(value) !== BuiltInTableStyle.custom || value === BuiltInTableStyle.custom;
}

function styleFromMember(member: string | undefined): BuiltInTableStyle {
    if (member === BuiltInTableStyle.custom) { return BuiltInTableStyle.custom; }
    if (member === BuiltInTableStyle.none) { return BuiltInTableStyle.none; }
    if (member === BuiltInTableStyle.noStyleNoGrid) { return BuiltInTableStyle.noStyleNoGrid; }
    if (member === BuiltInTableStyle.noStyleTableGrid) { return BuiltInTableStyle.noStyleTableGrid; }
    if (member === BuiltInTableStyle.themedStyle1Accent1) { return BuiltInTableStyle.themedStyle1Accent1; }
    if (member === BuiltInTableStyle.themedStyle1Accent2) { return BuiltInTableStyle.themedStyle1Accent2; }
    if (member === BuiltInTableStyle.themedStyle1Accent3) { return BuiltInTableStyle.themedStyle1Accent3; }
    if (member === BuiltInTableStyle.themedStyle1Accent4) { return BuiltInTableStyle.themedStyle1Accent4; }
    if (member === BuiltInTableStyle.themedStyle1Accent5) { return BuiltInTableStyle.themedStyle1Accent5; }
    if (member === BuiltInTableStyle.themedStyle1Accent6) { return BuiltInTableStyle.themedStyle1Accent6; }
    if (member === BuiltInTableStyle.themedStyle2Accent1) { return BuiltInTableStyle.themedStyle2Accent1; }
    if (member === BuiltInTableStyle.themedStyle2Accent2) { return BuiltInTableStyle.themedStyle2Accent2; }
    if (member === BuiltInTableStyle.themedStyle2Accent3) { return BuiltInTableStyle.themedStyle2Accent3; }
    if (member === BuiltInTableStyle.themedStyle2Accent4) { return BuiltInTableStyle.themedStyle2Accent4; }
    if (member === BuiltInTableStyle.themedStyle2Accent5) { return BuiltInTableStyle.themedStyle2Accent5; }
    if (member === BuiltInTableStyle.themedStyle2Accent6) { return BuiltInTableStyle.themedStyle2Accent6; }
    if (member === BuiltInTableStyle.lightStyle1) { return BuiltInTableStyle.lightStyle1; }
    if (member === BuiltInTableStyle.lightStyle1Accent1) { return BuiltInTableStyle.lightStyle1Accent1; }
    if (member === BuiltInTableStyle.lightStyle1Accent2) { return BuiltInTableStyle.lightStyle1Accent2; }
    if (member === BuiltInTableStyle.lightStyle1Accent3) { return BuiltInTableStyle.lightStyle1Accent3; }
    if (member === BuiltInTableStyle.lightStyle1Accent4) { return BuiltInTableStyle.lightStyle1Accent4; }
    if (member === BuiltInTableStyle.lightStyle1Accent5) { return BuiltInTableStyle.lightStyle1Accent5; }
    if (member === BuiltInTableStyle.lightStyle1Accent6) { return BuiltInTableStyle.lightStyle1Accent6; }
    if (member === BuiltInTableStyle.lightStyle2) { return BuiltInTableStyle.lightStyle2; }
    if (member === BuiltInTableStyle.lightStyle2Accent1) { return BuiltInTableStyle.lightStyle2Accent1; }
    if (member === BuiltInTableStyle.lightStyle2Accent2) { return BuiltInTableStyle.lightStyle2Accent2; }
    if (member === BuiltInTableStyle.lightStyle2Accent3) { return BuiltInTableStyle.lightStyle2Accent3; }
    if (member === BuiltInTableStyle.lightStyle2Accent4) { return BuiltInTableStyle.lightStyle2Accent4; }
    if (member === BuiltInTableStyle.lightStyle2Accent5) { return BuiltInTableStyle.lightStyle2Accent5; }
    if (member === BuiltInTableStyle.lightStyle2Accent6) { return BuiltInTableStyle.lightStyle2Accent6; }
    if (member === BuiltInTableStyle.lightStyle3) { return BuiltInTableStyle.lightStyle3; }
    if (member === BuiltInTableStyle.lightStyle3Accent1) { return BuiltInTableStyle.lightStyle3Accent1; }
    if (member === BuiltInTableStyle.lightStyle3Accent2) { return BuiltInTableStyle.lightStyle3Accent2; }
    if (member === BuiltInTableStyle.lightStyle3Accent3) { return BuiltInTableStyle.lightStyle3Accent3; }
    if (member === BuiltInTableStyle.lightStyle3Accent4) { return BuiltInTableStyle.lightStyle3Accent4; }
    if (member === BuiltInTableStyle.lightStyle3Accent5) { return BuiltInTableStyle.lightStyle3Accent5; }
    if (member === BuiltInTableStyle.lightStyle3Accent6) { return BuiltInTableStyle.lightStyle3Accent6; }
    if (member === BuiltInTableStyle.mediumStyle1) { return BuiltInTableStyle.mediumStyle1; }
    if (member === BuiltInTableStyle.mediumStyle1Accent1) { return BuiltInTableStyle.mediumStyle1Accent1; }
    if (member === BuiltInTableStyle.mediumStyle1Accent2) { return BuiltInTableStyle.mediumStyle1Accent2; }
    if (member === BuiltInTableStyle.mediumStyle1Accent3) { return BuiltInTableStyle.mediumStyle1Accent3; }
    if (member === BuiltInTableStyle.mediumStyle1Accent4) { return BuiltInTableStyle.mediumStyle1Accent4; }
    if (member === BuiltInTableStyle.mediumStyle1Accent5) { return BuiltInTableStyle.mediumStyle1Accent5; }
    if (member === BuiltInTableStyle.mediumStyle1Accent6) { return BuiltInTableStyle.mediumStyle1Accent6; }
    if (member === BuiltInTableStyle.mediumStyle2) { return BuiltInTableStyle.mediumStyle2; }
    if (member === BuiltInTableStyle.mediumStyle2Accent1) { return BuiltInTableStyle.mediumStyle2Accent1; }
    if (member === BuiltInTableStyle.mediumStyle2Accent2) { return BuiltInTableStyle.mediumStyle2Accent2; }
    if (member === BuiltInTableStyle.mediumStyle2Accent3) { return BuiltInTableStyle.mediumStyle2Accent3; }
    if (member === BuiltInTableStyle.mediumStyle2Accent4) { return BuiltInTableStyle.mediumStyle2Accent4; }
    if (member === BuiltInTableStyle.mediumStyle2Accent5) { return BuiltInTableStyle.mediumStyle2Accent5; }
    if (member === BuiltInTableStyle.mediumStyle2Accent6) { return BuiltInTableStyle.mediumStyle2Accent6; }
    if (member === BuiltInTableStyle.mediumStyle3) { return BuiltInTableStyle.mediumStyle3; }
    if (member === BuiltInTableStyle.mediumStyle3Accent1) { return BuiltInTableStyle.mediumStyle3Accent1; }
    if (member === BuiltInTableStyle.mediumStyle3Accent2) { return BuiltInTableStyle.mediumStyle3Accent2; }
    if (member === BuiltInTableStyle.mediumStyle3Accent3) { return BuiltInTableStyle.mediumStyle3Accent3; }
    if (member === BuiltInTableStyle.mediumStyle3Accent4) { return BuiltInTableStyle.mediumStyle3Accent4; }
    if (member === BuiltInTableStyle.mediumStyle3Accent5) { return BuiltInTableStyle.mediumStyle3Accent5; }
    if (member === BuiltInTableStyle.mediumStyle3Accent6) { return BuiltInTableStyle.mediumStyle3Accent6; }
    if (member === BuiltInTableStyle.mediumStyle4) { return BuiltInTableStyle.mediumStyle4; }
    if (member === BuiltInTableStyle.mediumStyle4Accent1) { return BuiltInTableStyle.mediumStyle4Accent1; }
    if (member === BuiltInTableStyle.mediumStyle4Accent2) { return BuiltInTableStyle.mediumStyle4Accent2; }
    if (member === BuiltInTableStyle.mediumStyle4Accent3) { return BuiltInTableStyle.mediumStyle4Accent3; }
    if (member === BuiltInTableStyle.mediumStyle4Accent4) { return BuiltInTableStyle.mediumStyle4Accent4; }
    if (member === BuiltInTableStyle.mediumStyle4Accent5) { return BuiltInTableStyle.mediumStyle4Accent5; }
    if (member === BuiltInTableStyle.mediumStyle4Accent6) { return BuiltInTableStyle.mediumStyle4Accent6; }
    if (member === BuiltInTableStyle.darkStyle1) { return BuiltInTableStyle.darkStyle1; }
    if (member === BuiltInTableStyle.darkStyle1Accent1) { return BuiltInTableStyle.darkStyle1Accent1; }
    if (member === BuiltInTableStyle.darkStyle1Accent2) { return BuiltInTableStyle.darkStyle1Accent2; }
    if (member === BuiltInTableStyle.darkStyle1Accent3) { return BuiltInTableStyle.darkStyle1Accent3; }
    if (member === BuiltInTableStyle.darkStyle1Accent4) { return BuiltInTableStyle.darkStyle1Accent4; }
    if (member === BuiltInTableStyle.darkStyle1Accent5) { return BuiltInTableStyle.darkStyle1Accent5; }
    if (member === BuiltInTableStyle.darkStyle1Accent6) { return BuiltInTableStyle.darkStyle1Accent6; }
    if (member === BuiltInTableStyle.darkStyle2) { return BuiltInTableStyle.darkStyle2; }
    if (member === BuiltInTableStyle.darkStyle2Accent1Accent2) { return BuiltInTableStyle.darkStyle2Accent1Accent2; }
    if (member === BuiltInTableStyle.darkStyle2Accent3Accent4) { return BuiltInTableStyle.darkStyle2Accent3Accent4; }
    if (member === BuiltInTableStyle.darkStyle2Accent5Accent6) { return BuiltInTableStyle.darkStyle2Accent5Accent6; }
    return BuiltInTableStyle.custom;
}

const GUID_RE = /^\{[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\}$/;

/**
 * Classifies `a:tableStyleId` text against the cited catalog.
 *
 * Empty, whitespace, non-`ST_Guid`, or an id with no cited row is `custom`.
 * Hex case is ignored. `none` is not produced here.
 *
 * @internal
 * @param text - Direct text of `a:tableStyleId`.
 * @returns The matching member, or `custom`.
 */
export function classifyBuiltInTableStyle(text: string): BuiltInTableStyle {
    const trimmed = text.trim();
    if (!GUID_RE.test(trimmed)) {
        return BuiltInTableStyle.custom;
    }
    const member: string | undefined = builtinTableStyleMember(trimmed);
    if (member === undefined || !isBuiltInTableStyle(member)) {
        return BuiltInTableStyle.custom;
    }
    return member as BuiltInTableStyle;
}
