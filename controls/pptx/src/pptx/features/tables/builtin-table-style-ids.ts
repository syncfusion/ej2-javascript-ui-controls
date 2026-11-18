/**
 * Built-in DrawingML table style ids.
 *
 * @remarks
 * ECMA-376 Part 1 names three gallery ids (see citation ids below). The other
 * gallery ids are copied from the Syncfusion Presentation preset dictionary
 * `AddPresetStyles` (human-supplied, 2026-09-22). That dictionary is the
 * citation for every row marked `CIT-SF-PRESET`. `none` and `custom` are API
 * classifications, not wire ids, and are omitted.
 *
 * The three ECMA examples agree with the same dictionary:
 * - CIT-ECMA-TBLSTYLELST: §20.1.4.2.27, Medium Style 2 - Accent 1 and
 *   Themed Style 1 - Accent 1.
 * - CIT-ECMA-NOSTYLE-GRID: §21.1.3.11, No Style, Table Grid.
 *
 * GUID form matches `ST_Guid` in
 * `specs/schemas/xsd/OfficeOpenXML-XMLSchema-Transitional/shared-commonSimpleTypes.xsd`
 * lines 59–63. Write form is braced uppercase.
 *
 * @internal
 */

export interface BuiltinTableStyleCatalogRow {
    member: string;
    dotNetName: string;
    guid: string;
    citationId: 'CIT-ECMA-TBLSTYLELST' | 'CIT-ECMA-NOSTYLE-GRID' | 'CIT-SF-PRESET';
}

function row(member: string, dotNetName: string, guid: string,
    citationId: BuiltinTableStyleCatalogRow['citationId']): BuiltinTableStyleCatalogRow {
    return Object.freeze({ member, dotNetName, guid, citationId });
}

/**
 * Cited built-in styles. Frozen. Not exported from the package index.
 *
 * @internal
 */
export const BUILTIN_TABLE_STYLE_CATALOG: BuiltinTableStyleCatalogRow[] = [
    row('noStyleNoGrid', 'NoStyleNoGrid', '{2D5ABB26-0587-4C30-8999-92F81FD0307C}', 'CIT-SF-PRESET'),
    row('themedStyle1Accent1', 'ThemedStyle1Accent1', '{3C2FFA5D-87B4-456A-9821-1D502468CF0F}', 'CIT-ECMA-TBLSTYLELST'),
    row('themedStyle1Accent2', 'ThemedStyle1Accent2', '{284E427A-3D55-4303-BF80-6455036E1DE7}', 'CIT-SF-PRESET'),
    row('themedStyle1Accent3', 'ThemedStyle1Accent3', '{69C7853C-536D-4A76-A0AE-DD22124D55A5}', 'CIT-SF-PRESET'),
    row('themedStyle1Accent4', 'ThemedStyle1Accent4', '{775DCB02-9BB8-47FD-8907-85C794F793BA}', 'CIT-SF-PRESET'),
    row('themedStyle1Accent5', 'ThemedStyle1Accent5', '{35758FB7-9AC5-4552-8A53-C91805E547FA}', 'CIT-SF-PRESET'),
    row('themedStyle1Accent6', 'ThemedStyle1Accent6', '{08FB837D-C827-4EFA-A057-4D05807E0F7C}', 'CIT-SF-PRESET'),
    row('noStyleTableGrid', 'NoStyleTableGrid', '{5940675A-B579-460E-94D1-54222C63F5DA}', 'CIT-ECMA-NOSTYLE-GRID'),
    row('themedStyle2Accent1', 'ThemedStyle2Accent1', '{D113A9D2-9D6B-4929-AA2D-F23B5EE8CBE7}', 'CIT-SF-PRESET'),
    row('themedStyle2Accent2', 'ThemedStyle2Accent2', '{18603FDC-E32A-4AB5-989C-0864C3EAD2B8}', 'CIT-SF-PRESET'),
    row('themedStyle2Accent3', 'ThemedStyle2Accent3', '{306799F8-075E-4A3A-A7F6-7FBC6576F1A4}', 'CIT-SF-PRESET'),
    row('themedStyle2Accent4', 'ThemedStyle2Accent4', '{E269D01E-BC32-4049-B463-5C60D7B0CCD2}', 'CIT-SF-PRESET'),
    row('themedStyle2Accent5', 'ThemedStyle2Accent5', '{327F97BB-C833-4FB7-BDE5-3F7075034690}', 'CIT-SF-PRESET'),
    row('themedStyle2Accent6', 'ThemedStyle2Accent6', '{638B1855-1B75-4FBE-930C-398BA8C253C6}', 'CIT-SF-PRESET'),
    row('lightStyle1', 'LightStyle1', '{9D7B26C5-4107-4FEC-AEDC-1716B250A1EF}', 'CIT-SF-PRESET'),
    row('lightStyle1Accent1', 'LightStyle1Accent1', '{3B4B98B0-60AC-42C2-AFA5-B58CD77FA1E5}', 'CIT-SF-PRESET'),
    row('lightStyle1Accent2', 'LightStyle1Accent2', '{0E3FDE45-AF77-4B5C-9715-49D594BDF05E}', 'CIT-SF-PRESET'),
    row('lightStyle1Accent3', 'LightStyle1Accent3', '{C083E6E3-FA7D-4D7B-A595-EF9225AFEA82}', 'CIT-SF-PRESET'),
    row('lightStyle1Accent4', 'LightStyle1Accent4', '{D27102A9-8310-4765-A935-A1911B00CA55}', 'CIT-SF-PRESET'),
    row('lightStyle1Accent5', 'LightStyle1Accent5', '{5FD0F851-EC5A-4D38-B0AD-8093EC10F338}', 'CIT-SF-PRESET'),
    row('lightStyle1Accent6', 'LightStyle1Accent6', '{68D230F3-CF80-4859-8CE7-A43EE81993B5}', 'CIT-SF-PRESET'),
    row('lightStyle2', 'LightStyle2', '{7E9639D4-E3E2-4D34-9284-5A2195B3D0D7}', 'CIT-SF-PRESET'),
    row('lightStyle2Accent1', 'LightStyle2Accent1', '{69012ECD-51FC-41F1-AA8D-1B2483CD663E}', 'CIT-SF-PRESET'),
    row('lightStyle2Accent2', 'LightStyle2Accent2', '{72833802-FEF1-4C79-8D5D-14CF1EAF98D9}', 'CIT-SF-PRESET'),
    row('lightStyle2Accent3', 'LightStyle2Accent3', '{F2DE63D5-997A-4646-A377-4702673A728D}', 'CIT-SF-PRESET'),
    row('lightStyle2Accent4', 'LightStyle2Accent4', '{17292A2E-F333-43FB-9621-5CBBE7FDCDCB}', 'CIT-SF-PRESET'),
    row('lightStyle2Accent5', 'LightStyle2Accent5', '{5A111915-BE36-4E01-A7E5-04B1672EAD32}', 'CIT-SF-PRESET'),
    row('lightStyle2Accent6', 'LightStyle2Accent6', '{912C8C85-51F0-491E-9774-3900AFEF0FD7}', 'CIT-SF-PRESET'),
    row('lightStyle3', 'LightStyle3', '{616DA210-FB5B-4158-B5E0-FEB733F419BA}', 'CIT-SF-PRESET'),
    row('lightStyle3Accent1', 'LightStyle3Accent1', '{BC89EF96-8CEA-46FF-86C4-4CE0E7609802}', 'CIT-SF-PRESET'),
    row('lightStyle3Accent2', 'LightStyle3Accent2', '{5DA37D80-6434-44D0-A028-1B22A696006F}', 'CIT-SF-PRESET'),
    row('lightStyle3Accent3', 'LightStyle3Accent3', '{8799B23B-EC83-4686-B30A-512413B5E67A}', 'CIT-SF-PRESET'),
    row('lightStyle3Accent4', 'LightStyle3Accent4', '{ED083AE6-46FA-4A59-8FB0-9F97EB10719F}', 'CIT-SF-PRESET'),
    row('lightStyle3Accent5', 'LightStyle3Accent5', '{BDBED569-4797-4DF1-A0F4-6AAB3CD982D8}', 'CIT-SF-PRESET'),
    row('lightStyle3Accent6', 'LightStyle3Accent6', '{E8B1032C-EA38-4F05-BA0D-38AFFFC7BED3}', 'CIT-SF-PRESET'),
    row('mediumStyle1', 'MediumStyle1', '{793D81CF-94F2-401A-BA57-92F5A7B2D0C5}', 'CIT-SF-PRESET'),
    row('mediumStyle1Accent1', 'MediumStyle1Accent1', '{B301B821-A1FF-4177-AEE7-76D212191A09}', 'CIT-SF-PRESET'),
    row('mediumStyle1Accent2', 'MediumStyle1Accent2', '{9DCAF9ED-07DC-4A11-8D7F-57B35C25682E}', 'CIT-SF-PRESET'),
    row('mediumStyle1Accent3', 'MediumStyle1Accent3', '{1FECB4D8-DB02-4DC6-A0A2-4F2EBAE1DC90}', 'CIT-SF-PRESET'),
    row('mediumStyle1Accent4', 'MediumStyle1Accent4', '{1E171933-4619-4E11-9A3F-F7608DF75F80}', 'CIT-SF-PRESET'),
    row('mediumStyle1Accent5', 'MediumStyle1Accent5', '{FABFCF23-3B69-468F-B69F-88F6DE6A72F2}', 'CIT-SF-PRESET'),
    row('mediumStyle1Accent6', 'MediumStyle1Accent6', '{10A1B5D5-9B99-4C35-A422-299274C87663}', 'CIT-SF-PRESET'),
    row('mediumStyle2', 'MediumStyle2', '{073A0DAA-6AF3-43AB-8588-CEC1D06C72B9}', 'CIT-SF-PRESET'),
    row('mediumStyle2Accent1', 'MediumStyle2Accent1', '{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}', 'CIT-ECMA-TBLSTYLELST'),
    row('mediumStyle2Accent2', 'MediumStyle2Accent2', '{21E4AEA4-8DFA-4A89-87EB-49C32662AFE0}', 'CIT-SF-PRESET'),
    row('mediumStyle2Accent3', 'MediumStyle2Accent3', '{F5AB1C69-6EDB-4FF4-983F-18BD219EF322}', 'CIT-SF-PRESET'),
    row('mediumStyle2Accent4', 'MediumStyle2Accent4', '{00A15C55-8517-42AA-B614-E9B94910E393}', 'CIT-SF-PRESET'),
    row('mediumStyle2Accent5', 'MediumStyle2Accent5', '{7DF18680-E054-41AD-8BC1-D1AEF772440D}', 'CIT-SF-PRESET'),
    row('mediumStyle2Accent6', 'MediumStyle2Accent6', '{93296810-A885-4BE3-A3E7-6D5BEEA58F35}', 'CIT-SF-PRESET'),
    row('mediumStyle3', 'MediumStyle3', '{8EC20E35-A176-4012-BC5E-935CFFF8708E}', 'CIT-SF-PRESET'),
    row('mediumStyle3Accent1', 'MediumStyle3Accent1', '{6E25E649-3F16-4E02-A733-19D2CDBF48F0}', 'CIT-SF-PRESET'),
    row('mediumStyle3Accent2', 'MediumStyle3Accent2', '{85BE263C-DBD7-4A20-BB59-AAB30ACAA65A}', 'CIT-SF-PRESET'),
    row('mediumStyle3Accent3', 'MediumStyle3Accent3', '{EB344D84-9AFB-497E-A393-DC336BA19D2E}', 'CIT-SF-PRESET'),
    row('mediumStyle3Accent4', 'MediumStyle3Accent4', '{EB9631B5-78F2-41C9-869B-9F39066F8104}', 'CIT-SF-PRESET'),
    row('mediumStyle3Accent5', 'MediumStyle3Accent5', '{74C1A8A3-306A-4EB7-A6B1-4F7E0EB9C5D6}', 'CIT-SF-PRESET'),
    row('mediumStyle3Accent6', 'MediumStyle3Accent6', '{2A488322-F2BA-4B5B-9748-0D474271808F}', 'CIT-SF-PRESET'),
    row('mediumStyle4', 'MediumStyle4', '{D7AC3CCA-C797-4891-BE02-D94E43425B78}', 'CIT-SF-PRESET'),
    row('mediumStyle4Accent1', 'MediumStyle4Accent1', '{69CF1AB2-1976-4502-BF36-3FF5EA218861}', 'CIT-SF-PRESET'),
    row('mediumStyle4Accent2', 'MediumStyle4Accent2', '{8A107856-5554-42FB-B03E-39F5DBC370BA}', 'CIT-SF-PRESET'),
    row('mediumStyle4Accent3', 'MediumStyle4Accent3', '{0505E3EF-67EA-436B-97B2-0124C06EBD24}', 'CIT-SF-PRESET'),
    row('mediumStyle4Accent4', 'MediumStyle4Accent4', '{C4B1156A-380E-4F78-BDF5-A606A8083BF9}', 'CIT-SF-PRESET'),
    row('mediumStyle4Accent5', 'MediumStyle4Accent5', '{22838BEF-8BB2-4498-84A7-C5851F593DF1}', 'CIT-SF-PRESET'),
    row('mediumStyle4Accent6', 'MediumStyle4Accent6', '{16D9F66E-5EB9-4882-86FB-DCBF35E3C3E4}', 'CIT-SF-PRESET'),
    row('darkStyle1', 'DarkStyle1', '{E8034E78-7F5D-4C2E-B375-FC64B27BC917}', 'CIT-SF-PRESET'),
    row('darkStyle1Accent1', 'DarkStyle1Accent1', '{125E5076-3810-47DD-B79F-674D7AD40C01}', 'CIT-SF-PRESET'),
    row('darkStyle1Accent2', 'DarkStyle1Accent2', '{37CE84F3-28C3-443E-9E96-99CF82512B78}', 'CIT-SF-PRESET'),
    row('darkStyle1Accent3', 'DarkStyle1Accent3', '{D03447BB-5D67-496B-8E87-E561075AD55C}', 'CIT-SF-PRESET'),
    row('darkStyle1Accent4', 'DarkStyle1Accent4', '{E929F9F4-4A8F-4326-A1B4-22849713DDAB}', 'CIT-SF-PRESET'),
    row('darkStyle1Accent5', 'DarkStyle1Accent5', '{8FD4443E-F989-4FC4-A0C8-D5A2AF1F390B}', 'CIT-SF-PRESET'),
    row('darkStyle1Accent6', 'DarkStyle1Accent6', '{AF606853-7671-496A-8E4F-DF71F8EC918B}', 'CIT-SF-PRESET'),
    row('darkStyle2', 'DarkStyle2', '{5202B0CA-FC54-4496-8BCA-5EF66A818D29}', 'CIT-SF-PRESET'),
    row('darkStyle2Accent1Accent2', 'DarkStyle2Accent1Accent2', '{0660B408-B3CF-4A94-85FC-2B1E0A45F4A2}', 'CIT-SF-PRESET'),
    row('darkStyle2Accent3Accent4', 'DarkStyle2Accent3Accent4', '{91EBBBCC-DAD2-459C-BE2E-F6DE35CF9A28}', 'CIT-SF-PRESET'),
    row('darkStyle2Accent5Accent6', 'DarkStyle2Accent5Accent6', '{46F890A9-2807-4EBB-B81D-B2AA78EC7F39}', 'CIT-SF-PRESET'),
];

const GUID_BY_MEMBER: ReadonlyMap<string, string> = new Map<string, string>(
    BUILTIN_TABLE_STYLE_CATALOG.map(function (entry: BuiltinTableStyleCatalogRow): [string, string] {
        return [entry.member, entry.guid];
    }),
);

const MEMBER_BY_GUID: ReadonlyMap<string, string> = new Map<string, string>(
    BUILTIN_TABLE_STYLE_CATALOG.map(function (entry: BuiltinTableStyleCatalogRow): [string, string] {
        return [entry.guid.toUpperCase(), entry.member];
    }),
);

/**
 * Braced style id for a cited member, or `undefined` for `none` / `custom`.
 *
 * @internal
 * @param member - Spec 044 camelCase name.
 * @returns Cited GUID when the member is in the catalog.
 */
export function builtinTableStyleGuid(member: string): string | undefined {
    return GUID_BY_MEMBER.get(member);
}

/**
 * Catalog member for a braced GUID, ignoring hex case.
 *
 * @internal
 * @param guid - Braced style id.
 * @returns Matching member, or `undefined`.
 */
export function builtinTableStyleMember(guid: string): string | undefined {
    return MEMBER_BY_GUID.get(guid.toUpperCase());
}
