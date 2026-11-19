/**
 * Hand-authored minimal PresentationML / DrawingML part templates for create.
 *
 * @remarks
 * Every element/attribute name is cited from local XSD or inspected fixtures.
 * Do not invent tags, relationship types, or EMU values.
 */
import { OFFICE_REL_ATTR_NS, PML_NS } from '../presentation/constants';
import { DML_NS } from '../shapes/constants';
import { COLOR_SCHEME_SLOTS } from '../theme/constants';
import { P14_NS } from '../presentation/shapetype';
import { arrayAt, objectGet } from '../util/es5-compat';
/**
 * Slide size EMUs (landscape 13.333" × 7.5" at 914400 EMU/inch — widescreen 16:9).
 *
 * Citation: Syncfusion Presentation / Office-family blank deck default
 * `sldSz` cx="12192000" cy="6858000" (13⅓" × 7½"). Create emits bare
 * `cx`/`cy` only — no `type` attribute (`ST_SlideSizeType` is optional;
 * schema default is `custom` when omitted).
 */
export const DEFAULT_SLIDE_SZ_CX: string = '12192000';

/** @see {@link DEFAULT_SLIDE_SZ_CX} */
export const DEFAULT_SLIDE_SZ_CY: string = '6858000';

/**
 * Notes size EMUs (portrait notes page).
 *
 * Citation: ECMA-376 Part 1 sample `notesSz` cx="6858000" cy="9144000";
 * Transitional `pml.xsd` `CT_Presentation` — `notesSz` is **required**.
 * Create keeps this notes page size with the widescreen slide default.
 */
export const DEFAULT_NOTES_SZ_CX: string = '6858000';

/** @see {@link DEFAULT_NOTES_SZ_CX} */
export const DEFAULT_NOTES_SZ_CY: string = '9144000';

/**
 * First slide master list id (`ST_SlideMasterId` minInclusive 2147483648).
 * Citation: Transitional `pml.xsd` `ST_SlideMasterId` ~886–890.
 */
export const DEFAULT_SLIDE_MASTER_LIST_ID: string = '2147483648';

/**
 * First slide layout list id (`ST_SlideLayoutId` minInclusive 2147483648).
 * Citation: Transitional `pml.xsd` `ST_SlideLayoutId` ~1480–1484.
 */
export const DEFAULT_SLIDE_LAYOUT_LIST_ID: string = '2147483648';

/**
 * First slide id (`ST_SlideId` minInclusive 256).
 * Citation: Transitional `pml.xsd` `ST_SlideId` ~867–871.
 */
export const DEFAULT_FIRST_SLIDE_ID: string = '256';

/**
 * Deterministic `p14:creationId/@val` for the initial slide's `cSld/extLst`.
 *
 * Citation: MS-Office authoring form — `p:cSld/p:extLst/p:ext` with URI
 * `{BB962C8B-B14F-4D97-AF65-F5344CB8AC3E}` and child `p14:creationId`
 * (`http://schemas.microsoft.com/office/powerpoint/2010/main`).
 * Inspected `temp/simple-create-output-ms_office.pptx` /ppt/slides/slide1.xml.
 * PowerPoint's repair heuristic flags slides missing the creationId extension.
 */
export const CREATE_SLIDE_CREATION_ID: string = '4253105357';

/**
 * Master `p:clrMap` attributes — copy of fixture identity map, not invented.
 *
 * Citation: `tests/helpers/themed-fixture.ts` `DEFAULT_CLR_MAP_ATTRS`;
 * Transitional `dml-main.xsd` `CT_ColorMapping` (~2306–2322).
 */
export const DEFAULT_CLR_MAP_ATTR_STRING: string = 'bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" ' +
  'accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" ' +
  'accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"';

/**
 * Deterministic sRGB hex per `ST_ColorSchemeIndex` slot.
 *
 * Citation: `tests/helpers/themed-fixture.ts` `THEME_SLOT_SRGB` (inspected Office-like palette).
 */
const THEME_SLOT_SRGB: Readonly<Record<(typeof COLOR_SCHEME_SLOTS)[number], string>> =
  Object.freeze({
      dk1: '000000',
      lt1: 'FFFFFF',
      dk2: '44546A',
      lt2: 'E7E6E6',
      accent1: '5B9BD5',
      accent2: 'ED7D31',
      accent3: 'A5A5A5',
      accent4: 'FFC000',
      accent5: '4472C4',
      accent6: '70AD47',
      hlink: '0563C1',
      folHlink: '954F72'
  });

/**
 * Minimal group shape header required under `CT_GroupShape` / empty `spTree`.
 *
 * Citation: Transitional `pml.xsd` `CT_GroupShape`; fixture `nvGrpHeader` pattern
 * (`cNvPr id="1"` — shape allocator must not renumber).
 *
 * `p:grpSpPr` carries a zeroed `a:xfrm` (`CT_GroupTransform2D`: off/ext/chOff/chExt
 * all 0). Schema allows bare `grpSpPr` (`xfrm` minOccurs=0 in `dml-main.xsd`), but
 * Office-family skeletons always emit the transform — SF
 * `corpus/interoperability/sf-skeleton-basic` and MS-saved decks. Trial fix #1 for
 * PowerPoint repair isolation (txStyles / presentation chrome deferred).
 *
 * @param {string} extraShapesXml - Shape XML appended after the group header; used by
 * @returns {string} The result.
 */
function emptySpTree(extraShapesXml: string = ''): string {
    return ('<p:spTree>' +
    '<p:nvGrpSpPr>' +
    '<p:cNvPr id="1" name=""/>' +
    '<p:cNvGrpSpPr/>' +
    '<p:nvPr/>' +
    '</p:nvGrpSpPr>' +
    '<p:grpSpPr>' +
    '<a:xfrm>' +
    '<a:off x="0" y="0"/>' +
    '<a:ext cx="0" cy="0"/>' +
    '<a:chOff x="0" y="0"/>' +
    '<a:chExt cx="0" cy="0"/>' +
    '</a:xfrm>' +
    '</p:grpSpPr>' +
    extraShapesXml +
    '</p:spTree>'
    );
}

/**
 * Presentation-level default paragraph styles (`p:defaultTextStyle`).
 *
 * Citation: Transitional `pml.xsd` `CT_Presentation` — `defaultTextStyle` after
 * `notesSz` (`minOccurs=0`); markup aligned to the MS-Office authoring form
 * (`temp/simple-create-output-ms_office.pptx` `ppt/presentation.xml`).
 * `defTabSz="457200"` (0.5" tab stops), `eaLnBrk="1"`, `latinLnBrk="0"`,
 * `hangingPunct="1"` on each level — matching MS-Office. The `defPPr`
 * element does not carry `defTabSz` in the MS-Office form.
 *
 * @param {number} level - The level value.
 * @param {number} marL - The marL value.
 * @returns {string} The result.
 */
function presentationDefaultLevel(level: number, marL: number): string {
    return (`<a:lvl${level}pPr marL="${String(marL)}" algn="l" defTabSz="457200" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">` +
    '<a:defRPr sz="1800" kern="1200">' +
    '<a:solidFill><a:schemeClr val="tx1"/></a:solidFill>' +
    '<a:latin typeface="+mn-lt"/>' +
    '<a:ea typeface="+mn-ea"/>' +
    '<a:cs typeface="+mn-cs"/>' +
    '</a:defRPr>' +
        `</a:lvl${level}pPr>`);
}

/** Left margins for presentation defaultTextStyle levels (0 + 457200 * n EMU). */
const PRESENTATION_DEFAULT_MAR_L: ReadonlyArray<number> = [
    0, 457200, 914400, 1371600, 1828800, 2286000, 2743200, 3200400, 3657600
];

/**
 *
 * @returns {string} The result.
 */
function presentationDefaultTextStyleXml(): string {
    let levels: string = '';
    for (let i: number = 0; i < PRESENTATION_DEFAULT_MAR_L.length; i++) {
        const marL: number | undefined = arrayAt(PRESENTATION_DEFAULT_MAR_L, i);
        if (marL === undefined) {
            continue;
        }
        levels += presentationDefaultLevel(i + 1, marL);
    }
    return ('<p:defaultTextStyle>' +
    '<a:defPPr><a:defRPr lang="en-US"/></a:defPPr>' +
    levels +
    '</p:defaultTextStyle>'
    );
}

/**
 * Builds `p:presentation` with master list, slide list, sldSz, required notesSz,
 * and Office-pragmatic `defaultTextStyle`.
 *
 * @param options - Relationship ids and slide id for the first slide entry.
 *
 * Citation: Transitional `pml.xsd` `CT_Presentation` (sldMasterIdLst, sldIdLst,
 * sldSz, notesSz required; defaultTextStyle optional after notesSz).
 * `xmlns:a` required on root so defaultTextStyle DrawingML children resolve.
 * `saveSubsetFonts="1"` is schema-optional (default false) but emitted for
 * Office-family parity. Default `sldSz` is widescreen 12192000×6858000 EMU
 * with **no** `type` attribute (do not emit `type="screen4x3"`).
 * `ST_SlideSizeType` remains optional on `CT_SlideSize`; callers may pass
 * `sldSzType` only when an explicit size type is required.
 */
/**
 * Options for {@link buildPresentationXml}.
 *
 * @remarks `slideRelId` / `slideId` are optional. When either is omitted, `p:sldIdLst` is omitted entirely — Transitional `pml.xsd`
 * `CT_Presentation` declares `sldIdLst` with `minOccurs="0"`, and load treats a missing list as zero slides. {@link Presentation.create}
 * ships an empty deck; the first slide is added only via `slides.add`.
 * @param {*} options - The options value.
 * @param {string} options.masterRelId - Master relationship id.
 * @param {string} options.masterListId - Master list id.
 * @param {string} [options.slideRelId] - Slide relationship id.
 * @param {string} [options.slideId] - Slide id.
 * @param {string} [options.sldSzCx] - Slide size width EMUs.
 * @param {string} [options.sldSzCy] - Slide size height EMUs.
 * @param {string} [options.sldSzType] - Slide size type.
 * @param {string} [options.notesSzCx] - Notes size width EMUs.
 * @param {string} [options.notesSzCy] - Notes size height EMUs.
 * @returns {string} The result.
 */
export function buildPresentationXml(options: {
    readonly masterRelId: string;
    readonly masterListId: string;
    readonly slideRelId?: string;
    readonly slideId?: string;
    readonly sldSzCx?: string;
    readonly sldSzCy?: string;
    readonly sldSzType?: string;
    readonly notesSzCx?: string;
    readonly notesSzCy?: string;
}): string {
    const sldCx: string = options.sldSzCx != null ? options.sldSzCx : DEFAULT_SLIDE_SZ_CX;
    const sldCy: string = options.sldSzCy != null ? options.sldSzCy : DEFAULT_SLIDE_SZ_CY;
    const sldType: string = options.sldSzType;
    const notesCx: string = options.notesSzCx != null ? options.notesSzCx : DEFAULT_NOTES_SZ_CX;
    const notesCy: string = options.notesSzCy != null ? options.notesSzCy : DEFAULT_NOTES_SZ_CY;
    const slideRelId: string = options.slideRelId;
    const slideId: string = options.slideId;
    const hasSlide: boolean =
    slideRelId !== undefined &&
    slideRelId.length > 0 &&
    slideId !== undefined &&
    slideId.length > 0;
    const sldIdLstXml: string = hasSlide
        ? '<p:sldIdLst>' +
      `<p:sldId id="${slideId}" r:id="${slideRelId}"/>` +
      '</p:sldIdLst>'
        : '';
    const sldTypeAttr: string =
    sldType !== undefined && sldType.length > 0 ? ` type="${sldType}"` : '';
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    `<p:presentation xmlns:p="${PML_NS}" xmlns:a="${DML_NS}" xmlns:r="${OFFICE_REL_ATTR_NS}" saveSubsetFonts="1">` +
    '<p:sldMasterIdLst>' +
    `<p:sldMasterId id="${options.masterListId}" r:id="${options.masterRelId}"/>` +
    '</p:sldMasterIdLst>' +
    sldIdLstXml +
    `<p:sldSz cx="${sldCx}" cy="${sldCy}"${sldTypeAttr}/>` +
    `<p:notesSz cx="${notesCx}" cy="${notesCy}"/>` +
    presentationDefaultTextStyleXml() +
    '</p:presentation>'
    );
}

/**
 * PowerPoint 2012 main namespace (`p15`), used by `presProps.xml` extension
 * `chartTrackingRefBased`.
 *
 * Citation: inspected `temp/simple-create-output-ms_office.pptx`
 * `ppt/presProps.xml` `p15:chartTrackingRefBased` element.
 */
const P15_NS: string = 'http://schemas.microsoft.com/office/powerpoint/2012/main';

/**
 * MS Office 2013 Theme ML namespace (`thm15`), used by the theme part
 * `a:extLst/a:ext` with URI `{05A4C25C-085E-4340-85A3-A5531E510DB2}`
 * carrying `thm15:themeFamily`.
 *
 * Citation: inspected `temp/simple-create-output-ms_office.pptx`
 * `/ppt/theme/theme1.xml` — `thm15:themeFamily` element;
 * Transitional `dml-main.xsd` `CT_OfficeStyleSheet` `extLst` optional.
 * PowerPoint's repair heuristic flags themes missing this extension.
 */
const THM15_NS: string = 'http://schemas.microsoft.com/office/thememl/2012/main';

/**
 * Builds presentation properties part (`CT_PresentationProperties`) with
 * Office-family `extLst` extension elements.
 *
 * Citation: ECMA-376 Part 1 §13.3.7 — package **shall** contain exactly one;
 * Transitional `pml.xsd` `CT_PresentationProperties` — `extLst` optional;
 * inspected `temp/simple-create-output-ms_office.pptx` `ppt/presProps.xml`
 * for the three standard `p14`/`p15` extension elements. PowerPoint's repair
 * heuristic may flag a bare `presentationPr` with no `extLst` in some
 * versions; matching the MS-Office authoring form avoids the false positive.
 *
 * @returns {string} The result.
 */
export function buildPresPropsXml(): string {
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    `<p:presentationPr xmlns:a="${DML_NS}" xmlns:r="${OFFICE_REL_ATTR_NS}" xmlns:p="${PML_NS}">` +
    '<p:extLst>' +
    '<p:ext uri="{E76CE94A-603C-4142-B9EB-6D1370010A27}">' +
    `<p14:discardImageEditData xmlns:p14="${P14_NS}" val="0"/>` +
    '</p:ext>' +
    '<p:ext uri="{D31A062A-798A-4329-ABDD-BBA856620510}">' +
    `<p14:defaultImageDpi xmlns:p14="${P14_NS}" val="32767"/>` +
    '</p:ext>' +
    '<p:ext uri="{FD5EFAAD-0ECE-453E-9831-46B23BE46B34}">' +
    `<p15:chartTrackingRefBased xmlns:p15="${P15_NS}" val="1"/>` +
    '</p:ext>' +
    '</p:extLst>' +
    '</p:presentationPr>'
    );
}

/**
 * OPC / Dublin Core namespaces for the Core Properties part.
 * Citation: ECMA-376-2 §8.3 `opc-coreProperties.xsd`; inspected fixtures
 * `docProps/core.xml` (SF skeleton ∩ MS Office rewrite — identical namespace
 * declarations, including the unused `dcmitype` prefix that Office-family
 * generators always emit).
 *
 * `dcmitype` is **not required** by `opc-coreProperties.xsd` when the part
 * contains no `dcmitype:*` element. However, PowerPoint's repair pass
 * round-trips the part against an internal schema that expects the prefix
 * to be declared when other Office-family tooling touches the package;
 * a missing declaration has been observed to trigger a repair prompt.
 * Declared for parity with the MS-Office reference fixture.
 */
const CP_NS: string = 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties';
const DC_NS: string = 'http://purl.org/dc/elements/1.1/';
const DCTERMS_NS: string = 'http://purl.org/dc/terms/';
const DCMITYPE_NS: string = 'http://purl.org/dc/dcmitype/';
const XSI_NS: string = 'http://www.w3.org/2001/XMLSchema-instance';

/**
 * Builds a minimal Core Properties part (`cp:coreProperties`).
 *
 * Citation: ECMA-376-1 §15.2.12.1; ECMA-376-2 §8.2–§8.3 (`opc-coreProperties.xsd`).
 * A package shall contain at most one Core Properties part. Create emits the
 * well-known minimal set: `dc:creator`, `cp:lastModifiedBy`, `cp:revision`,
 * `dcterms:created`, `dcterms:modified`. `created`/`modified` use a stable
 * timestamp captured at build time (W3CDTF, `xsi:type="dcterms:W3CDTF"`).
 *
 * The `dc:title` element is emitted as an **explicit empty pair**
 * (`<dc:title></dc:title>`) rather than the self-closing form
 * (`<dc:title/>`) to match the MS-Office reference fixture exactly. Some
 * PowerPoint build versions normalize this on first save but flag the
 * divergence during the repair pass; matching the reference avoids the
 * false-positive.
 *
 * @param {string} createdAt - ISO 8601 / W3CDTF timestamp for `dcterms:created` and
 * @returns {string} The result.
 */
export function buildCorePropsXml(createdAt: string = new Date().toISOString()): string {
    const stamp: string = createdAt.endsWith('Z') ? createdAt : `${createdAt}Z`;
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<cp:coreProperties ' +
    `xmlns:cp="${CP_NS}" ` +
    `xmlns:dc="${DC_NS}" ` +
    `xmlns:dcterms="${DCTERMS_NS}" ` +
    `xmlns:dcmitype="${DCMITYPE_NS}" ` +
    `xmlns:xsi="${XSI_NS}">` +
    '<dc:title></dc:title>' +
    '<dc:creator>@syncfusion/ej2-pptx</dc:creator>' +
    '<cp:lastModifiedBy>@syncfusion/ej2-pptx</cp:lastModifiedBy>' +
    '<cp:revision>1</cp:revision>' +
    `<dcterms:created xsi:type="dcterms:W3CDTF">${stamp}</dcterms:created>` +
    `<dcterms:modified xsi:type="dcterms:W3CDTF">${stamp}</dcterms:modified>` +
    '</cp:coreProperties>'
    );
}

/**
 * Extended-properties namespace (Transitional form).
 * Citation: ECMA-376-1 §15.2.12.3; Transitional
 * `shared-documentPropertiesExtended.xsd` root namespace
 * `http://schemas.openxmlformats.org/officeDocument/2006/extended-properties`.
 */
const EXTENDED_PROPS_NS: string =
  'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties';
const VT_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes';

/**
 * Builds a minimal Extended (Application) Properties part (`Properties`).
 *
 * Citation: ECMA-376-1 §15.2.12.3 — content type
 * `application/vnd.openxmlformats-officedocument.extended-properties+xml`;
 * Transitional `shared-documentPropertiesExtended.xsd`. Inspected fixtures
 * (SF skeleton ∩ MS Office rewrite) carry `Template`, `TotalTime`, `Words`,
 * `Application`, `PresentationFormat`, `Paragraphs`, `Slides`, `Notes`,
 * `HiddenSlides`, `MMClips`, `ScaleCrop`, `HeadingPairs`, `TitlesOfParts`,
 * `Company`, `LinksUpToDate`, `SharedDoc`, `HyperlinksChanged`, `AppVersion`.
 *
 * Create emits a **schema-valid** subset that accurately reflects a newly
 * built deck. The `HeadingPairs`/`TitlesOfParts` vectors include the
 * Theme entry (matching MS-Office authoring form) so the pair count and
 * parts count are internally consistent — PowerPoint's repair heuristic
 * flags mismatches between `HeadingPairs` count and `TitlesOfParts` count.
 *
 * `HeadingPairs`/`TitlesOfParts` vector sizes and `<Slides>` are
 * authoritative for `PresentationDocument.flushExtendedProperties`, which
 * re-emits this part on every `save()` from the live `p:sldIdLst` count.
 * The value passed here is the **initial** count at package-build time;
 * callers should not rely on it surviving subsequent `doc.slides.add()`.
 *
 * @param {number} slideCount - Number of slides to report in `<Slides>`.
 * @returns {string} The result.
 */
export function buildAppPropsXml(slideCount: number): string {
    const count: string = String(slideCount);
    const titlesSize: string = String(slideCount + 1);
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    `<Properties xmlns="${EXTENDED_PROPS_NS}" xmlns:vt="${VT_NS}">` +
    '<Application>@syncfusion/ej2-pptx</Application>' +
    `<Slides>${count}</Slides>` +
    '<ScaleCrop>false</ScaleCrop>' +
    '<HeadingPairs>' +
    '<vt:vector size="4" baseType="variant">' +
    '<vt:variant><vt:lpstr>Theme</vt:lpstr></vt:variant>' +
    '<vt:variant><vt:i4>1</vt:i4></vt:variant>' +
    '<vt:variant><vt:lpstr>Slide Titles</vt:lpstr></vt:variant>' +
    `<vt:variant><vt:i4>${count}</vt:i4></vt:variant>` +
    '</vt:vector>' +
    '</HeadingPairs>' +
    '<TitlesOfParts>' +
    `<vt:vector size="${titlesSize}" baseType="lpstr">` +
    '<vt:lpstr>Office Theme</vt:lpstr>' +
    titlesOfParts(slideCount) +
    '</vt:vector>' +
    '</TitlesOfParts>' +
    '<LinksUpToDate>false</LinksUpToDate>' +
    '<SharedDoc>false</SharedDoc>' +
    '<HyperlinksChanged>false</HyperlinksChanged>' +
    '</Properties>'
    );
}

/**
 *
 * @param {number} slideCount - The slideCount value.
 * @returns {string} The result.
 */
function titlesOfParts(slideCount: number): string {
    let out: string = '';
    for (let i: number = 0; i < slideCount; i++) {
        out += '<vt:lpstr>PowerPoint Presentation</vt:lpstr>';
    }
    return out;
}

/**
 * Builds view properties part matching MS-Office authoring form.
 *
 * Citation: ECMA-376 Part 1 §13.3.13 (zero-or-one); Transitional `pml.xsd`
 * `CT_ViewProperties`; markup from inspected
 * `temp/simple-create-output-ms_office.pptx` `ppt/viewProps.xml`.
 *
 * @returns {string} The result.
 */
export function buildViewPropsXml(): string {
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    `<p:viewPr xmlns:a="${DML_NS}" xmlns:r="${OFFICE_REL_ATTR_NS}" xmlns:p="${PML_NS}" ` +
    'lastView="sldThumbnailView">' +
    '<p:normalViewPr>' +
    '<p:restoredLeft sz="14972" autoAdjust="0"/>' +
    '<p:restoredTop sz="94660"/>' +
    '</p:normalViewPr>' +
    '<p:slideViewPr>' +
    '<p:cSldViewPr snapToGrid="0">' +
    '<p:cViewPr varScale="1">' +
    '<p:scale><a:sx n="71" d="100"/><a:sy n="71" d="100"/></p:scale>' +
    '<p:origin x="618" y="60"/>' +
    '</p:cViewPr>' +
    '<p:guideLst/>' +
    '</p:cSldViewPr>' +
    '</p:slideViewPr>' +
    '<p:notesTextViewPr>' +
    '<p:cViewPr>' +
    '<p:scale><a:sx n="1" d="1"/><a:sy n="1" d="1"/></p:scale>' +
    '<p:origin x="0" y="0"/>' +
    '</p:cViewPr>' +
    '</p:notesTextViewPr>' +
    '<p:gridSpacing cx="76200" cy="76200"/>' +
    '</p:viewPr>'
    );
}

/**
 * Default table style list GUID used by Office / SF empty `tblStyleLst`.
 *
 * Citation: ECMA-376 Part 1 example / SF∩MS
 * `corpus/interoperability/sf-skeleton-basic` `ppt/tableStyles.xml`;
 * `dml-main.xsd` `CT_TableStyleList` `@def` required (`s:ST_Guid`).
 */
export const DEFAULT_TABLE_STYLE_LIST_DEF: string = '{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}';

/**
 * Builds empty table styles part (`a:tblStyleLst`).
 *
 * Citation: ECMA-376 Part 1 §14.2.9; content type
 * `presentationml.tableStyles+xml`; root `CT_TableStyleList` with required
 * `def` GUID and zero `tblStyle` children (schema allows minOccurs=0).
 *
 * @returns {string} The result.
 */
export function buildTableStylesXml(): string {
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    `<a:tblStyleLst xmlns:a="${DML_NS}" def="${DEFAULT_TABLE_STYLE_LIST_DEF}"/>`
    );
}

/**
 * Builds blank slide part XML (`CT_Slide`).
 *
 * Citation: Transitional `pml.xsd` `CT_Slide` / `CT_CommonSlideData`;
 * `EG_ChildSlide` (~1364–1370) — `clrMapOvr` optional but always emitted by
 * Office-family generators (`<a:masterClrMapping/>`). PowerPoint repair
 * isolation: slides missing `p:clrMapOvr` are flagged by the app repair
 * heuristic even though the schema allows omission.
 *
 * The `xmlns:r` declaration is included so relationship attributes (`r:id`)
 * resolve when the slide grows media, hyperlink, or notes relationships.
 * MS-Office slide parts always declare it on the root. The `p:extLst` with
 * a `p14:creationId` extension on `p:cSld` matches MS-Office authoring form;
 * PowerPoint's repair heuristic flags slides missing the creationId
 * extension (citation: inspected `temp/simple-create-output-ms_office.pptx`
 * slide1.xml; ECMA-376 Part 1 `CT_CommonSlideData` `extLst` optional).
 *
 * @returns {string} The result.
 */
export function buildSlideXml(): string {
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    `<p:sld xmlns:p="${PML_NS}" xmlns:a="${DML_NS}" xmlns:r="${OFFICE_REL_ATTR_NS}">` +
    `<p:cSld>${emptySpTree()}` +
    '<p:extLst><p:ext uri="{BB962C8B-B14F-4D97-AF65-F5344CB8AC3E}">' +
    `<p14:creationId xmlns:p14="${P14_NS}" val="${CREATE_SLIDE_CREATION_ID}"/>` +
    '</p:ext></p:extLst>' +
    '</p:cSld>' +
    '<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>' +
    '</p:sld>'
    );
}

/**
 * Footer triple placeholder shapes (date / footer / slide-number) shipped
 * verbatim from the MS-Office reference blank layout in
 * `temp/simple-create-output-ms_office.pptx` `ppt/slideLayouts/slideLayout7.xml`.
 *
 * @remarks
 * PowerPoint's repair heuristic flags layouts whose `spTree` lacks footer
 * placeholders. Shape ids 2–4 are reserved for the footer triple. The `p:ph`
 * attributes and `a:fld` GUIDs match the MS-Office reference exactly.
 *
 * Citation: ECMA-376 Part 1 §19.3.1.34 `p:ph`; Transitional `pml.xsd`
 * `ST_PlaceholderType`; inspected MS-Office fixture slideLayout7.xml.
 */
const LAYOUT_FOOTER_TRIPLE_XML: string =
  '<p:sp><p:nvSpPr><p:cNvPr id="2" name="Date Placeholder 1"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="dt" sz="half" idx="10"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:fld id="{5F16787E-696C-43F4-A7DC-0BC30ED02EFC}" type="datetimeFigureOut"><a:rPr lang="en-US" smtClean="0"/><a:t>9/17/2026</a:t></a:fld><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp>' +
  '<p:sp><p:nvSpPr><p:cNvPr id="3" name="Footer Placeholder 2"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="ftr" sz="quarter" idx="11"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp>' +
  '<p:sp><p:nvSpPr><p:cNvPr id="4" name="Slide Number Placeholder 3"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldNum" sz="quarter" idx="12"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:fld id="{C90F95B2-1BE0-4343-80F7-152BDA193AD6}" type="slidenum"><a:rPr lang="en-US" smtClean="0"/><a:t>\u2039#\u203A</a:t></a:fld><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp>';

/**
 * Deterministic `p14:creationId/@val` for layout `cSld/extLst`.
 *
 * Citation: inspected `temp/simple-create-output-ms_office.pptx`
 * `ppt/slideLayouts/slideLayout7.xml` — `<p14:creationId val="2199788429"/>`.
 */
const CREATE_LAYOUT_CREATION_ID: string = '2199788429';

/**
 * Builds layout part XML (`CT_SlideLayout`) with the given `ST_SlideLayoutType`.
 *
 * @remarks Create packages ship a single blank `slideLayout1` (TASK-1066). Additional types are allocated on `slides.add({ layout })`
 * without inventing content placeholders beyond the Office footer triple + `p14:creationId` chrome that PowerPoint repair expects. `slides.add` copies non-footer placeholders from the chosen layout onto the new slide.
 * `preserve="1"` + `userDrawn="1"` match MS-Office authoring form for blank layouts. Citation: Transitional `pml.xsd` `CT_SlideLayout`;
 * `ST_SlideLayoutType` ~1415–1454; ECMA-376-1 §19.7.15; `EG_ChildSlide` clrMapOvr.
 * @param {string} type - OOXML `ST_SlideLayoutType` token (e.g. `blank`, `titleOnly`, `obj`).
 * @returns {string} The result.
 */
export function buildSlideLayoutXml(type: string = 'blank'): string {
    const cSldName: string = type === 'blank' ? 'Blank' : type;
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    `<p:sldLayout xmlns:p="${PML_NS}" xmlns:a="${DML_NS}" xmlns:r="${OFFICE_REL_ATTR_NS}" type="${type}" preserve="1" userDrawn="1">` +
    `<p:cSld name="${cSldName}">${emptySpTree(LAYOUT_FOOTER_TRIPLE_XML)}` +
    '<p:extLst><p:ext uri="{BB962C8B-B14F-4D97-AF65-F5344CB8AC3E}">' +
    `<p14:creationId xmlns:p14="${P14_NS}" val="${CREATE_LAYOUT_CREATION_ID}"/>` +
    '</p:ext></p:extLst>' +
    '</p:cSld>' +
    '<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>' +
    '</p:sldLayout>'
    );
}

/**
 * Default master `p:txStyles` markup taken from Syncfusion Presentation skeleton
 * (`corpus/interoperability/sf-skeleton-basic` slide master). Schema
 * (`pml.xsd` `CT_SlideMaster`) marks `txStyles` optional (`minOccurs=0`), but
 * Office-family generators always emit it. Trial fix #2 for PowerPoint repair
 * isolation (presentation chrome still deferred).
 *
 * Structure: titleStyle lvl1 only; bodyStyle lvl1–9 with bullets; otherStyle
 * lvl1–9 plain. Theme font refs `+mj-*` / `+mn-*`, scheme colour `tx1`.
 *
 * @param {number} level - The level value.
 * @param {number} marL - The marL value.
 * @param {number} sz - The sz value.
 * @param {number} spcBefPts - The spcBefPts value.
 * @returns {string} The result.
 */
function masterBodyLevel(
    level: number,
    marL: number,
    sz: number,
    spcBefPts: number
): string {
    return (
        `<a:lvl${level}pPr marL="${String(marL)}" indent="-228600" rtl="0" algn="l" defTabSz="914400">` +
    '<a:lnSpc><a:spcPct val="90000"/></a:lnSpc>' +
    `<a:spcBef><a:spcPts val="${String(spcBefPts)}"/></a:spcBef>` +
    '<a:buFont typeface="Arial"/>' +
    '<a:buChar char="\u2022"/>' +
    `<a:defRPr sz="${String(sz)}" kern="1200">` +
    '<a:solidFill><a:schemeClr val="tx1"/></a:solidFill>' +
    '<a:latin typeface="+mn-lt"/>' +
    '<a:ea typeface="+mn-ea"/>' +
    '<a:cs typeface="+mn-cs"/>' +
    '</a:defRPr>' +
    `</a:lvl${level}pPr>`
    );
}

/**
 *
 * @param {number} level - The level value.
 * @param {number} marL - The marL value.
 * @returns {string} The result.
 */
function masterOtherLevel(level: number, marL: number): string {
    return (
        `<a:lvl${level}pPr marL="${String(marL)}" rtl="0" algn="l" defTabSz="914400">` +
    '<a:defRPr sz="1800" kern="1200">' +
    '<a:solidFill><a:schemeClr val="tx1"/></a:solidFill>' +
    '<a:latin typeface="+mn-lt"/>' +
    '<a:ea typeface="+mn-ea"/>' +
    '<a:cs typeface="+mn-cs"/>' +
    '</a:defRPr>' +
    `</a:lvl${level}pPr>`
    );
}

/** Body indent steps and sizes matching SF skeleton master (EMU / hundredths of a point). */
const MASTER_BODY_LEVELS: ReadonlyArray<{ marL: number; sz: number; spcBefPts: number }> = [
    { marL: 228600, sz: 2800, spcBefPts: 1000 },
    { marL: 685800, sz: 2400, spcBefPts: 500 },
    { marL: 1143000, sz: 2000, spcBefPts: 500 },
    { marL: 1600200, sz: 1800, spcBefPts: 500 },
    { marL: 2057400, sz: 1800, spcBefPts: 500 },
    { marL: 2514600, sz: 1800, spcBefPts: 500 },
    { marL: 2971800, sz: 1800, spcBefPts: 500 },
    { marL: 3429000, sz: 1800, spcBefPts: 500 },
    { marL: 3886200, sz: 1800, spcBefPts: 500 }
];

/** Other-style left margins matching SF skeleton (0 + 457200 * n EMU). */
const MASTER_OTHER_MAR_L: ReadonlyArray<number> = [
    0, 457200, 914400, 1371600, 1828800, 2286000, 2743200, 3200400, 3657600
];

/**
 *
 * @returns {string} The result.
 */
function defaultMasterTxStylesXml(): string {
    const titleStyle: string =
    '<p:titleStyle>' +
    '<a:lvl1pPr rtl="0" algn="l" defTabSz="914400">' +
    '<a:lnSpc><a:spcPct val="90000"/></a:lnSpc>' +
    '<a:spcBef><a:spcPct val="0"/></a:spcBef>' +
    '<a:buNone/>' +
    '<a:defRPr sz="4400" kern="1200">' +
    '<a:solidFill><a:schemeClr val="tx1"/></a:solidFill>' +
    '<a:latin typeface="+mj-lt"/>' +
    '<a:ea typeface="+mj-ea"/>' +
    '<a:cs typeface="+mj-cs"/>' +
    '</a:defRPr>' +
    '</a:lvl1pPr>' +
    '</p:titleStyle>';

    let bodyStyle: string = '<p:bodyStyle>';
    for (let i: number = 0; i < MASTER_BODY_LEVELS.length; i++) {
        const row: { marL: number; sz: number; spcBefPts: number; } | undefined = arrayAt(MASTER_BODY_LEVELS, i);
        if (row === undefined) {
            continue;
        }
        bodyStyle += masterBodyLevel(i + 1, row.marL, row.sz, row.spcBefPts);
    }
    bodyStyle += '</p:bodyStyle>';

    let otherStyle: string = '<p:otherStyle>';
    for (let i: number = 0; i < MASTER_OTHER_MAR_L.length; i++) {
        const otherMarL: number | undefined = arrayAt(MASTER_OTHER_MAR_L, i);
        if (otherMarL === undefined) {
            continue;
        }
        otherStyle += masterOtherLevel(i + 1, otherMarL);
    }
    otherStyle += '</p:otherStyle>';

    return `<p:txStyles>${titleStyle}${bodyStyle}${otherStyle}</p:txStyles>`;
}

/**
 * Slide-master placeholder shape markup shipped verbatim from the
 * MS-Office reference minimal deck (`temp/simple-create-output-ms_office.pptx`
 * `ppt/slideMasters/slideMaster1.xml`). Do **not** edit the EMU values,
 * shape ids, or `p:ph` attributes — animation timing, hyperlinks, and
 * comments reference shape ids, and PowerPoint's PowerPoint-repair
 * heuristic rejects slide masters whose `spTree` lacks the standard
 * title/body/date/footer/slide-number placeholders (validated by the
 * `temp/swap_master_G.pptx` and `temp/swap_min_layouts_I.pptx` isolation
 * series — both opened cleanly with these exact shapes; without them
 * the minimal `type="blank"` master prompts "PowerPoint found a problem
 * with content… can attempt to repair").
 *
 * Citation: ECMA-376 Part 1 §19.3.1.34 `p:ph` (placeholder);
 * Transitional `pml.xsd` `CT_Placeholder` / `ST_PlaceholderType`;
 * MS-Office fixture `temp/simple-create-output-ms_office.pptx`.
 *
 * Shape ids 2–6 are reserved; library users' added shapes allocate from
 * id 7 onward (see `src/pptx/core/shapes/shape-id-allocator.ts`). These ids
 * remain constant across no-op saves so hyperlink/comment stable ids
 * never shift. The MS reference for positional attributes (off/ext) is
 * the 4:3 deck (9144000 × 6858000 EMU); other slide sizes override only
 * via PowerPoint's master-edit UI, which is outside the library scope.
 */
const MASTER_PLACEHOLDER_SHAPES_XML: string =
  '<p:sp><p:nvSpPr><p:cNvPr id="2" name="Title Placeholder 1"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="628650" y="365126"/><a:ext cx="7886700" cy="1325563"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0" anchor="ctr"><a:normAutofit/></a:bodyPr><a:lstStyle/><a:p><a:r><a:rPr lang="en-US"/><a:t>Click to edit Master title style</a:t></a:r><a:endParaRPr lang="en-US" dirty="0"/></a:p></p:txBody></p:sp>' +
  '<p:sp><p:nvSpPr><p:cNvPr id="3" name="Text Placeholder 2"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="628650" y="1825625"/><a:ext cx="7886700" cy="4351338"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0"><a:normAutofit/></a:bodyPr><a:lstStyle/><a:p><a:pPr lvl="0"/><a:r><a:rPr lang="en-US"/><a:t>Click to edit Master text styles</a:t></a:r></a:p><a:p><a:pPr lvl="1"/><a:r><a:rPr lang="en-US"/><a:t>Second level</a:t></a:r></a:p><a:p><a:pPr lvl="2"/><a:r><a:rPr lang="en-US"/><a:t>Third level</a:t></a:r></a:p><a:p><a:pPr lvl="3"/><a:r><a:rPr lang="en-US"/><a:t>Fourth level</a:t></a:r></a:p><a:p><a:pPr lvl="4"/><a:r><a:rPr lang="en-US"/><a:t>Fifth level</a:t></a:r><a:endParaRPr lang="en-US" dirty="0"/></a:p></p:txBody></p:sp>' +
  '<p:sp><p:nvSpPr><p:cNvPr id="4" name="Date Placeholder 3"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="dt" sz="half" idx="2"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="628650" y="6356351"/><a:ext cx="2057400" cy="365125"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0" anchor="ctr"/><a:lstStyle><a:lvl1pPr algn="l"><a:defRPr sz="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl1pPr></a:lstStyle><a:p><a:fld id="{5F16787E-696C-43F4-A7DC-0BC30ED02EFC}" type="datetimeFigureOut"><a:rPr lang="en-US" smtClean="0"/><a:t>9/17/2026</a:t></a:fld><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp>' +
  '<p:sp><p:nvSpPr><p:cNvPr id="5" name="Footer Placeholder 4"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="ftr" sz="quarter" idx="3"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="2971800" y="6356351"/><a:ext cx="3143100" cy="365125"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0" anchor="ctr"/><a:lstStyle><a:lvl1pPr algn="ctr"><a:defRPr sz="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl1pPr></a:lstStyle><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp>' +
  '<p:sp><p:nvSpPr><p:cNvPr id="6" name="Slide Number Placeholder 5"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldNum" sz="quarter" idx="4"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="6457950" y="6356351"/><a:ext cx="2057400" cy="365125"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0" anchor="ctr"/><a:lstStyle><a:lvl1pPr algn="r"><a:defRPr sz="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl1pPr></a:lstStyle><a:p><a:fld id="{C90F95B2-1BE0-4343-80F7-152BDA193AD6}" type="slidenum"><a:rPr lang="en-US" smtClean="0"/><a:t>‹#›</a:t></a:fld><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp>';

/**
 * Master background element (`p:bg`) — the first child of `p:cSld`, before
 * `spTree`. Citation: Transitional `pml.xsd` `CT_CommonSlideData` sequence
 * (`bg` minOccurs=0, then `spTree` minOccurs=1). MS-Office fixtures always
 * emit `p:bg` on the slide master; inspected
 * `temp/simple-create-output-ms_office.pptx` slideMaster1.xml.
 * `bgRef idx="1001"` references the fill style at index 1001 in the theme's
 * `fmtScheme/fillStyleLst` (the first solid fill — white background).
 * `a:schemeClr val="bg1"` resolves to the theme's `lt1` slot (white).
 * PowerPoint's repair heuristic flags masters missing `p:bg`.
 */
const MASTER_BACKGROUND_XML: string =
  '<p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg>';

/**
 * Builds slide master with required `clrMap`, layout id list entries, and
 * default `p:txStyles` (Office-pragmatic; schema-optional). The master
 * `cSld/spTree` carries the standard five placeholder shapes (title, body,
 * date, footer, slide-number) shipped verbatim from the MS-Office
 * reference minimal deck — PowerPoint's PowerPoint-repair heuristic
 * rejects slide masters whose spTree lacks them (see the
 * `temp/swap_master_G.pptx` / `temp/swap_min_layouts_I.pptx` isolation
 * series for the full root-cause record).
 *
 * @param {object} options - Layout relationship id and list id for the create skeleton
 * @param {string} options.layoutRelId - Layout relationship id.
 * @param {string} options.layoutListId - Layout list id.
 * @returns {string} The result.
 */
export function buildSlideMasterXml(options: {
    readonly layoutRelId: string;
    readonly layoutListId: string;
}): string {
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    `<p:sldMaster xmlns:p="${PML_NS}" xmlns:a="${DML_NS}" xmlns:r="${OFFICE_REL_ATTR_NS}">` +
    `<p:cSld>${MASTER_BACKGROUND_XML}${emptySpTree(MASTER_PLACEHOLDER_SHAPES_XML)}</p:cSld>` +
    `<p:clrMap ${DEFAULT_CLR_MAP_ATTR_STRING}/>` +
    '<p:sldLayoutIdLst>' +
    `<p:sldLayoutId id="${options.layoutListId}" r:id="${options.layoutRelId}"/>` +
    '</p:sldLayoutIdLst>' +
    defaultMasterTxStylesXml() +
    '</p:sldMaster>'
    );
}

/**
 * Per-script font fallback entries for `CT_FontCollection`.
 *
 * @remarks
 * Office-family themes emit a large set of `<a:font script="…" typeface="…"/>`
 * children under both `majorFont` and `minorFont` to declare the East Asian,
 * BiDi, and complex-script fallbacks for each major/minor Latin typeface. The
 * `script` attribute is `ST_TextLanguage` from `shared-misc.xsd` (e.g. `Jpan`,
 * `Hang`, `Hans`, `Hant`, `Arab`, `Hebr`, `Thai`, …). Schema-optional, but
 * PowerPoint's repair heuristic expects them to be present in an Office-family
 * theme. The `majorFont` and `minorFont` collections differ only in the
 * typeface values for a subset of scripts (see {@link MAJOR_FONT_SCRIPTS} and
 * {@link MINOR_FONT_SCRIPTS}).
 *
 * Citation: inspected `temp/simple-create-output-ms_office.pptx`
 * `/ppt/theme/theme1.xml` — both `majorFont` and `minorFont` `a:font` children.
 * Transitional `dml-main.xsd` `CT_TextFont` (`script`, `typeface` attributes);
 * `shared-misc.xsd` `ST_TextLanguage` enum values for the `script` attribute.
 */
const MAJOR_FONT_SCRIPTS: ReadonlyArray<string[]> = Object.freeze([
    ['Jpan', '游ゴシック Light'],
    ['Hang', '맑은 고딕'],
    ['Hans', '等线 Light'],
    ['Hant', '新細明體'],
    ['Arab', 'Times New Roman'],
    ['Hebr', 'Times New Roman'],
    ['Thai', 'Angsana New'],
    ['Ethi', 'Nyala'],
    ['Beng', 'Vrinda'],
    ['Gujr', 'Shruti'],
    ['Khmr', 'MoolBoran'],
    ['Knda', 'Tunga'],
    ['Guru', 'Raavi'],
    ['Cans', 'Euphemia'],
    ['Cher', 'Plantagenet Cherokee'],
    ['Yiii', 'Microsoft Yi Baiti'],
    ['Tibt', 'Microsoft Himalaya'],
    ['Thaa', 'MV Boli'],
    ['Deva', 'Mangal'],
    ['Telu', 'Gautami'],
    ['Taml', 'Latha'],
    ['Syrc', 'Estrangelo Edessa'],
    ['Orya', 'Kalinga'],
    ['Mlym', 'Kartika'],
    ['Laoo', 'DokChampa'],
    ['Sinh', 'Iskoola Pota'],
    ['Mong', 'Mongolian Baiti'],
    ['Viet', 'Times New Roman'],
    ['Uigh', 'Microsoft Uighur'],
    ['Geor', 'Sylfaen'],
    ['Armn', 'Arial'],
    ['Bugi', 'Leelawadee UI'],
    ['Bopo', 'Microsoft JhengHei'],
    ['Java', 'Javanese Text'],
    ['Lisu', 'Segoe UI'],
    ['Mymr', 'Myanmar Text'],
    ['Nkoo', 'Ebrima'],
    ['Olck', 'Nirmala UI'],
    ['Osma', 'Ebrima'],
    ['Phag', 'Phagspa'],
    ['Syrn', 'Estrangelo Edessa'],
    ['Syrj', 'Estrangelo Edessa'],
    ['Syre', 'Estrangelo Edessa'],
    ['Sora', 'Nirmala UI'],
    ['Tale', 'Microsoft Tai Le'],
    ['Talu', 'Microsoft New Tai Lue'],
    ['Tfng', 'Ebrima']
]);

/**
 * @see {@link MAJOR_FONT_SCRIPTS} — `minorFont` per-script typeface list.
 *
 * Citation: inspected `temp/simple-create-output-ms_office.pptx`
 * `/ppt/theme/theme1.xml` — `minorFont` `a:font` children.
 */
const MINOR_FONT_SCRIPTS: ReadonlyArray<string[]> = Object.freeze([
    ['Jpan', '游ゴシック'],
    ['Hang', '맑은 고딕'],
    ['Hans', '等线'],
    ['Hant', '新細明體'],
    ['Arab', 'Arial'],
    ['Hebr', 'Arial'],
    ['Thai', 'Cordia New'],
    ['Ethi', 'Nyala'],
    ['Beng', 'Vrinda'],
    ['Gujr', 'Shruti'],
    ['Khmr', 'DaunPenh'],
    ['Knda', 'Tunga'],
    ['Guru', 'Raavi'],
    ['Cans', 'Euphemia'],
    ['Cher', 'Plantagenet Cherokee'],
    ['Yiii', 'Microsoft Yi Baiti'],
    ['Tibt', 'Microsoft Himalaya'],
    ['Thaa', 'MV Boli'],
    ['Deva', 'Mangal'],
    ['Telu', 'Gautami'],
    ['Taml', 'Latha'],
    ['Syrc', 'Estrangelo Edessa'],
    ['Orya', 'Kalinga'],
    ['Mlym', 'Kartika'],
    ['Laoo', 'DokChampa'],
    ['Sinh', 'Iskoola Pota'],
    ['Mong', 'Mongolian Baiti'],
    ['Viet', 'Arial'],
    ['Uigh', 'Microsoft Uighur'],
    ['Geor', 'Sylfaen'],
    ['Armn', 'Arial'],
    ['Bugi', 'Leelawadee UI'],
    ['Bopo', 'Microsoft JhengHei'],
    ['Java', 'Javanese Text'],
    ['Lisu', 'Segoe UI'],
    ['Mymr', 'Myanmar Text'],
    ['Nkoo', 'Ebrima'],
    ['Olck', 'Nirmala UI'],
    ['Osma', 'Ebrima'],
    ['Phag', 'Phagspa'],
    ['Syrn', 'Estrangelo Edessa'],
    ['Syrj', 'Estrangelo Edessa'],
    ['Syre', 'Estrangelo Edessa'],
    ['Sora', 'Nirmala UI'],
    ['Tale', 'Microsoft Tai Le'],
    ['Talu', 'Microsoft New Tai Lue'],
    ['Tfng', 'Ebrima']
]);

/** PANOSE string for Calibri Light / Calibri (Office default Latin). */
const LATIN_PANOSE: string = '02110004020202020204';

/**
 * Builds the `<a:font script="…" typeface="…"/>` children for a font collection.
 *
 * @param {*} scriptTable - Per-script typeface pairs.
 * @returns {string} Concatenated `<a:font>` elements.
 */
function scriptFontEntriesXml(
    scriptTable: ReadonlyArray<string[]>
): string {
    let out: string = '';
    for (let i: number = 0; i < scriptTable.length; i++) {
        const entry: Array<string> = arrayAt(scriptTable, i);
        const script: string = entry[0];
        const typeface: string = entry[1];
        out += `<a:font script="${script}" typeface="${typeface}"/>`;
    }
    return out;
}

/**
 * First gradient fill in `fillStyleLst` — three-stop luminance/saturation
 * gradient at 270° (`ang="5400000"` in 60000ths of a degree).
 *
 * Citation: inspected `temp/simple-create-output-ms_office.pptx` theme1.xml
 * `fmtScheme/fillStyleLst/a:gradFill[1]` — gradient stops with `lumMod`,
 * `satMod`, and `tint` colour transforms on `phClr`.
 */
const FILL_GRAD_1: string =
  '<a:gradFill rotWithShape="1">' +
  '<a:gsLst>' +
  '<a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/><a:tint val="67000"/></a:schemeClr></a:gs>' +
  '<a:gs pos="50000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="103000"/><a:tint val="73000"/></a:schemeClr></a:gs>' +
  '<a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="109000"/><a:tint val="81000"/></a:schemeClr></a:gs>' +
  '</a:gsLst>' +
  '<a:lin ang="5400000" scaled="0"/>' +
  '</a:gradFill>';

/**
 * Second gradient fill in `fillStyleLst` — three-stop saturation/luminance
 * gradient with shade transforms.
 *
 * Citation: inspected `temp/simple-create-output-ms_office.pptx` theme1.xml
 * `fmtScheme/fillStyleLst/a:gradFill[2]`.
 */
const FILL_GRAD_2: string =
  '<a:gradFill rotWithShape="1">' +
  '<a:gsLst>' +
  '<a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/><a:tint val="94000"/></a:schemeClr></a:gs>' +
  '<a:gs pos="50000"><a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/><a:shade val="100000"/></a:schemeClr></a:gs>' +
  '<a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="99000"/><a:satMod val="120000"/><a:shade val="78000"/></a:schemeClr></a:gs>' +
  '</a:gsLst>' +
  '<a:lin ang="5400000" scaled="0"/>' +
  '</a:gradFill>';

/**
 * Background gradient fill in `bgFillStyleLst` — three-stop tint/saturation
 * gradient with shade and luminance transforms.
 *
 * Citation: inspected `temp/simple-create-output-ms_office.pptx` theme1.xml
 * `fmtScheme/bgFillStyleLst/a:gradFill[1]`.
 */
const BGFILL_GRAD: string =
  '<a:gradFill rotWithShape="1">' +
  '<a:gsLst>' +
  '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs>' +
  '<a:gs pos="50000"><a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs>' +
  '<a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/></a:schemeClr></a:gs>' +
  '</a:gsLst>' +
  '<a:lin ang="5400000" scaled="0"/>' +
  '</a:gradFill>';

/**
 * Solid fill placeholder with tint and saturation transforms for the second
 * `bgFillStyleLst` entry.
 *
 * Citation: inspected `temp/simple-create-output-ms_office.pptx` theme1.xml
 * `fmtScheme/bgFillStyleLst/a:solidFill[2]`.
 */
const BGFILL_SOLID_2: string =
  '<a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/></a:schemeClr></a:solidFill>';

/**
 * Third `effectStyle` — outer shadow with 63% alpha black, 57150 EMU blur,
 * 19050 EMU distance, 270° direction.
 *
 * Citation: inspected `temp/simple-create-output-ms_office.pptx` theme1.xml
 * `fmtScheme/effectStyleLst/a:effectStyle[3]/a:effectLst/a:outerShdw`.
 * Transitional `dml-main.xsd` `CT_EffectStyle` — `effectLst` optional;
 * Office's authoring form always populates the third style with an
 * `outerShdw`. PowerPoint's repair heuristic may flag a theme where the
 * third effect style has an empty `effectLst`.
 */
const EFFECT_STYLE_3: string =
  '<a:effectStyle><a:effectLst>' +
  '<a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0">' +
  '<a:srgbClr val="000000"><a:alpha val="63000"/></a:srgbClr>' +
  '</a:outerShdw>' +
  '</a:effectLst></a:effectStyle>';

/**
 * Builds an `a:ln` style entry with the given width, `cap`, `cmpd`, `algn`
 * attributes, a `solidFill` placeholder, `prstDash="solid"`, and
 * `miter lim="800000"`.
 *
 * @param {string} w - Line width in EMU (e.g. `12700` = 1 pt).
 * @returns {string} A complete `<a:ln>` element string.
 */
function lnStyleEntryXml(w: string): string {
    return (
        `<a:ln w="${w}" cap="flat" cmpd="sng" algn="ctr">` +
    '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>' +
    '<a:prstDash val="solid"/>' +
    '<a:miter lim="800000"/>' +
    '</a:ln>'
    );
}

/**
 * Builds the `a:objectDefaults` element with a default `lnDef` style.
 *
 * @remarks `CT_ObjectDefaults` (`dml-main.xsd`) is schema-optional (`minOccurs=0` on `CT_OfficeStyleSheet`), but PowerPoint's repair
 * heuristic expects the default line definition (`lnDef`) to be present for style resolution. The `lnDef` carries empty `spPr`, `bodyPr`,
 * `lstStyle` and a `style` referencing `accent1` for line/fill/effect and `tx1` for the minor font. Citation: inspected
 * `temp/simple-create-output-ms_office.pptx` theme1.xml `a:objectDefaults/a:lnDef` — style `lnRef idx="2"`, `fillRef idx="0"`, `effectRef
 * idx="1"`, `fontRef idx="minor"`.
 * @returns {string} The result.
 */
function objectDefaultsXml(): string {
    return (
        '<a:objectDefaults>' +
    '<a:lnDef>' +
    '<a:spPr/><a:bodyPr/><a:lstStyle/>' +
    '<a:style>' +
    '<a:lnRef idx="2"><a:schemeClr val="accent1"/></a:lnRef>' +
    '<a:fillRef idx="0"><a:schemeClr val="accent1"/></a:fillRef>' +
    '<a:effectRef idx="1"><a:schemeClr val="accent1"/></a:effectRef>' +
    '<a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef>' +
    '</a:style>' +
    '</a:lnDef>' +
    '</a:objectDefaults>'
    );
}

/**
 * Builds the `a:extLst` element carrying the MS Office 2013 theme family
 * extension (`thm15:themeFamily`).
 *
 * @remarks The `thm15:themeFamily` extension (URI `{05A4C25C-085E-4340-85A3-A5531E510DB2}`) is the MSO 2012 theme identification record.
 * PowerPoint uses it for theme versioning and identity; its absence is a common trigger for the "PowerPoint found a problem with content"
 * repair prompt. Citation: inspected `temp/simple-create-output-ms_office.pptx` theme1.xml
 * `a:extLst/a:ext[@uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}"]/ thm15:themeFamily` — `name`, `id`, `vid` attributes. The `id` and `vid`
 * are stable GUIDs matching the inspected fixture.
 * @returns {string} The result.
 */
function themeExtLstXml(): string {
    return (
        '<a:extLst>' +
    '<a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}">' +
    `<thm15:themeFamily xmlns:thm15="${THM15_NS}" name="Office Theme" ` +
    'id="{2E142A2C-CD16-42D6-873A-C26D2A0506FA}" ' +
    'vid="{1BDDFF52-6CD6-40A5-AB3C-68EB2F1E4D0A}"/>' +
    '</a:ext>' +
    '</a:extLst>'
    );
}

/**
 * Builds the Office theme part with the full Office-pragmatic structure.
 *
 * @remarks Emits the twelve-slot `clrScheme` (sRGB per slot), `fontScheme` with per-script fallback fonts,
     `fmtScheme` with gradient fills and the third `effectStyle` carrying an `outerShdw`, `objectDefaults` with a `lnDef`,
         an empty `extraClrSchemeLst`, and the `extLst` carrying `thm15:themeFamily`. Every element/attribute is cited from the inspected MS-Office `theme1.xml` fixture (`temp/simple-create-output-ms_office.pptx`) or from `dml-main.xsd` Transitional. `CT_FillStyleList` / `CT_LineStyleList` / `CT_EffectStyleList` / `CT_BackgroundFillStyleList` each require **minOccurs 3** (`dml-main.xsd` Transitional ~144–162). The three entries are: - `fillStyleLst`: solidFill, gradFill, gradFill - `lnStyleLst`: ln 12700, ln 19050, ln 25400 - `effectStyleLst`: empty effectLst, empty effectLst, outerShdw - `bgFillStyleLst`: solidFill, solidFill+tint, gradFill `CT_FontCollection` (`dml-main.xsd` Transitional ~120–127): `latin`, `ea`, `cs` are all `minOccurs=1` in this order. Office default uses empty typeface for `ea`/`cs`; `latin` carries the UI typeface (Calibri Light for `majorFont`, Calibri for `minorFont`) and a `panose` attribute. Per-script `a:font` children follow `cs`. Citation: `dml-main.xsd` `CT_OfficeStyleSheet` / `CT_BaseStyles` / `CT_StyleMatrix` / `CT_ObjectDefaults` / `CT_EmptyElement` (`extraClrSchemeLst`); inspected `temp/simple-create-output-ms_office.pptx` `/ppt/theme/theme1.xml`. /
 * @returns {string} The result.
 */
export function buildThemeXml(): string {
    // dk1/lt1 use `a:sysClr` (windowText/window) to match the MS-Office
    // authoring form. Using `a:srgbClr` for dk1/lt1 is a known trigger for
    // PowerPoint's repair heuristic. The remaining slots use `a:srgbClr`.
    //
    // Citation: inspected `temp/simple-create-output-ms_office.pptx`
    // `/ppt/theme/theme1.xml` — `<a:dk1><a:sysClr val="windowText"
    // lastClr="000000"/></a:dk1>` / `<a:lt1><a:sysClr val="window"
    // lastClr="FFFFFF"/></a:lt1>`.
    const slots: string = COLOR_SCHEME_SLOTS.map((slot: string) => {
        if (slot === 'dk1') {
            return `<a:dk1><a:sysClr val="windowText" lastClr="${String(objectGet<string>(THEME_SLOT_SRGB, String(slot)) || '')}"/></a:dk1>`;
        }
        if (slot === 'lt1') {
            return `<a:lt1><a:sysClr val="window" lastClr="${String(objectGet<string>(THEME_SLOT_SRGB, String(slot)) || '')}"/></a:lt1>`;
        }
        return `<a:${slot}><a:srgbClr val="${String(objectGet<string>(THEME_SLOT_SRGB, String(slot)) || '')}"/></a:${slot}>`;
    }).join('');

    const solidPh: string = '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>';

    const fillStyleLst: string =
    '<a:fillStyleLst>' +
    solidPh +
    FILL_GRAD_1 +
    FILL_GRAD_2 +
    '</a:fillStyleLst>';

    const lnStyleLst: string =
    '<a:lnStyleLst>' +
    lnStyleEntryXml('12700') +
    lnStyleEntryXml('19050') +
    lnStyleEntryXml('25400') +
    '</a:lnStyleLst>';

    const effectStyleLst: string =
    '<a:effectStyleLst>' +
    '<a:effectStyle><a:effectLst/></a:effectStyle>' +
    '<a:effectStyle><a:effectLst/></a:effectStyle>' +
    EFFECT_STYLE_3 +
    '</a:effectStyleLst>';

    const bgFillStyleLst: string =
    '<a:bgFillStyleLst>' +
    solidPh +
    BGFILL_SOLID_2 +
    BGFILL_GRAD +
    '</a:bgFillStyleLst>';

    const fmtScheme: string =
    '<a:fmtScheme name="Office Theme">' +
    fillStyleLst +
    lnStyleLst +
    effectStyleLst +
    bgFillStyleLst +
    '</a:fmtScheme>';

    // CT_FontCollection (dml-main.xsd Transitional ~120–127): latin, ea, cs all
    // minOccurs=1 in this order. Office default uses empty typeface for ea/cs;
    // latin carries the UI typeface (Calibri Light / Calibri) and a panose
    // attribute. Per-script a:font children follow cs.
    const fontScheme: string =
    '<a:fontScheme name="Office Theme">' +
    '<a:majorFont>' +
    `<a:latin typeface="Calibri Light" panose="${LATIN_PANOSE}"/>` +
    '<a:ea typeface=""/>' +
    '<a:cs typeface=""/>' +
    scriptFontEntriesXml(MAJOR_FONT_SCRIPTS) +
    '</a:majorFont>' +
    '<a:minorFont>' +
    `<a:latin typeface="Calibri" panose="${LATIN_PANOSE}"/>` +
    '<a:ea typeface=""/>' +
    '<a:cs typeface=""/>' +
    scriptFontEntriesXml(MINOR_FONT_SCRIPTS) +
    '</a:minorFont>' +
    '</a:fontScheme>';

    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    `<a:theme xmlns:a="${DML_NS}" name="Office Theme">` +
    '<a:themeElements>' +
    `<a:clrScheme name="Office Theme">${slots}</a:clrScheme>` +
    fontScheme +
    fmtScheme +
    '</a:themeElements>' +
    objectDefaultsXml() +
    '<a:extraClrSchemeLst/>' +
    themeExtLstXml() +
    '</a:theme>'
    );
}
