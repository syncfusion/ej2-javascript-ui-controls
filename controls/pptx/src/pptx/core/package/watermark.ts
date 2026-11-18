/**
 * Trial watermark (`AddWaterMark`) for `@syncfusion/ej2-pptx` — Syncfusion
 * Presentation (.NET) behaviour parity.
 *
 * @remarks
 * Source of truth: the .NET Presentation library `SaveAsStream` /
 * `AddWaterMark` implementation. When `validateLicense('pptx')` reports an
 * unlicensed save (checked by the caller in `Presentation.save`), the
 * watermark is injected before serialization; licensed saves never touch
 * markup.
 *
 * Structure (mirrors .NET exactly):
 * - **Centre watermark** on the slide **master** (draws behind every slide
 *   that shows master shapes): a `SyncfusionLicense` text box, 455 × 50 pt,
 *   centred on the slide, rotation 333°, one paragraph
 *   "Created with a trial version of Syncfusion PowerPoint library", 18pt
 *   red, horizontally centred, vertically middle. Added only when the
 *   master's last shape is not already named `SyncfusionLicense`
 *   (idempotence guard from .NET).
 * - **Bottom watermark** on the **first and last** slides only: a
 *   `SyncfusionLicense` text box spanning the slide width × 90 pt at the
 *   bottom, white solid fill, three text parts where the middle "here" run
 *   hyperlinks to the Syncfusion claim-license-key URL in blue, 18pt red
 *   paragraph font, horizontally centred, vertically middle.
 *
 * All authoring reuses existing EJ2 Presentation APIs —
 * `shapes.addTextBox` (slide **and** master authoring, req 041),
 * `TextBody.addParagraph`, `paragraph.addTextPart`, `Font` setters,
 * `TextPart.setHyperlink` (hyperlinks-actions facade) — plus in-place
 * `a:xfrm/@rot`, `a:spPr/a:solidFill`, and `a:bodyPr/@anchor` attribute
 * writes for the three properties without public setters, following the
 * existing in-place mutation pattern (`features/tables/table-cell.ts`
 * `setDirectCellProperties`, `shapes/mutate-shape-fill.ts`).
 * Drawing ids are allocated by the shared allocator — never renumbered.
 *
 * Citations: `pml.xsd` `CT_SlideMaster` ~1379–1393 (master spTree children);
 * `dml-main.xsd` `CT_Transform2D` `@rot` (60000ths of a degree);
 * `CT_TextBody` `a:bodyPr/@anchor="ctr"`; `EG_FillProperties`
 * `a:spPr/a:solidFill/a:srgbClr`; `CT_TextCharacterProperties`
 * `a:solidFill/a:srgbClr`, `@sz` hundredths of a point;
 * `CT_Hyperlink` `a:hlinkClick` + hyperlink relationship (ECMA-376 Part 4).
 *
 * @internal
 */
import { PML_NS } from '../presentation/constants';
import { DML_NS } from '../shapes/constants';
import { asMutable, findChild, MutableOoxmlElement } from '../shapes/dom-utils';
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../xml/dom';
import { MasterSlide } from '../slideimplementation/masterslide';
import { Font } from '../text/font';
import { HorizontalAlignmentType } from '../text/paragraph-format-types';
import { Paragraph } from '../text/paragraph';
import { TextBody } from '../text/text-body';
import { TextPart } from '../text/text-part';
import { Shape } from '../shapes/shape';
import { Slide } from '../slideimplementation/slide';
import { Presentation } from './presentation';

/**
 * Watermark shape name — the .NET idempotence sentinel on the master.
 */
export const WATERMARK_SHAPE_NAME: string = 'SyncfusionLicense';
/**
 * Centre watermark text (.NET paragraph text).
 */
export const WATERMARK_CENTER_TEXT: string = 'Created with a trial version of Syncfusion PowerPoint library';
/**
 * Bottom watermark first text part (before the hyperlink run).
 */
export const WATERMARK_BOTTOM_LEAD_TEXT: string =
    'Created with a trial version of Syncfusion PowerPoint library or registered the wrong key in your application. Click ';
/**
 * Bottom watermark hyperlink run text.
 */
export const WATERMARK_BOTTOM_LINK_TEXT: string = 'here';
/**
 * Bottom watermark trailing text part.
 */
export const WATERMARK_BOTTOM_TAIL_TEXT: string = ' to obtain the valid key.';
/**
 * Bottom watermark hyperlink target (.NET `claimLicenseKeyURL`).
 */
export const WATERMARK_CLAIM_LICENSE_URL: string = 'https://www.syncfusion.com/account/claim-license-key';
/**
 * Centre watermark size: 455 × 50 points (.NET `shapeWidth` / `shapeHeight`).
 */
const CENTER_WIDTH_PT: number = 455;
const CENTER_HEIGHT_PT: number = 50;
/**
 * Bottom watermark height: 90 points (.NET `shapeHeight`).
 */
const BOTTOM_HEIGHT_PT: number = 90;
/**
 * .NET `Rotation = 333` degrees → `a:xfrm/@rot` 60000ths (333 × 60000).
 */
const CENTER_ROTATION_ROT: string = '19980000';
/**
 * 18pt font (.NET `FontSize = 18`) — applied via the Font setter.
 */
const FONT_SIZE_PT: number = 18;
/**
 * .NET `ColorObject.Red` → `srgbClr FF0000`; `ColorObject.Blue` → `0000FF`;
 * `ColorObject.White` → `FFFFFF`.
 */
const RED_HEX: string = 'FF0000';
const BLUE_HEX: string = '0000FF';
const WHITE_HEX: string = 'FFFFFF';
/**
 * Default slide size in points when the package omits `p:sldSz`
 * (create template 12192000 × 6858000 EMU = 960 × 540 pt).
 */
const DEFAULT_SLIDE_WIDTH_PT: number = 960;
const DEFAULT_SLIDE_HEIGHT_PT: number = 540;

/**
 * Adds the trial watermark to a presentation (unlicensed save only).
 *
 * @remarks
 * .NET `AddWaterMark(IPresentation presentation)`: get each slide and add the
 * watermark to it. EJ2 iterates `presentation.slides` — the same
 * `p:sldIdLst` order .NET's `Slides` collection uses.
 *
 * @internal
 * @param {Presentation} presentation - Live presentation being saved.
 * @returns {void} Nothing.
 */
export function addWaterMark(presentation: Presentation): void {
    const slides: ReadonlyArray<Slide> = presentation.slides;
    const count: number = slides.length;
    if (count === 0) {
        return;
    }
    const slideWidth: number = presentation.slideWidth !== undefined ? presentation.slideWidth : DEFAULT_SLIDE_WIDTH_PT;
    const slideHeight: number = presentation.slideHeight !== undefined ? presentation.slideHeight : DEFAULT_SLIDE_HEIGHT_PT;
    for (let i: number = 0; i < count; i++) {
        addWaterMarkToSlide(slides[i], slideWidth, slideHeight, i + 1, count);
    }
}

/**
 * Adds the watermark shapes for one slide.
 *
 * @remarks
 * .NET `AddWaterMark(ISlide slide)`: `masterShapeCollection` is
 * `slide.LayoutSlide.MasterSlide.Shapes`; when empty or when its last shape
 * is not named `SyncfusionLicense`, the centre watermark is added to the
 * master. The bottom watermark is added to `slide.Shapes` when
 * `slide.SlideNumber == 1` or `slide.SlideNumber == Slides.Count`.
 *
 * @internal
 * @param {Slide} slide - Slide being saved.
 * @param {number} slideWidth - Slide width in points.
 * @param {number} slideHeight - Slide height in points.
 * @param {number} slideNumber - 1-based slide position (`sldIdLst` order).
 * @param {number} slideCount - Total slides.
 * @returns {void} Nothing.
 */
function addWaterMarkToSlide(slide: Slide, slideWidth: number, slideHeight: number,
                             slideNumber: number, slideCount: number): void {
    const master: MasterSlide | undefined = tryGetMaster(slide);
    if (master !== undefined) {
        const masterShapes: ReadonlyArray<Shape> = master.shapes;
        const lastShape: Shape | undefined = masterShapes.length > 0 ? masterShapes[masterShapes.length - 1] : undefined;
        const hasLicenseShape: boolean = lastShape !== undefined && lastShape.name === WATERMARK_SHAPE_NAME;
        if (masterShapes.length === 0 || !hasLicenseShape) {
            const shapeWidth: number = CENTER_WIDTH_PT;
            const shapeHeight: number = CENTER_HEIGHT_PT;
            const shapeX: number = (slideWidth / 2) - (shapeWidth / 2);
            const shapeY: number = (slideHeight / 2) - (shapeHeight / 2);
            addCenterWaterMarkShape(master, shapeX, shapeY, shapeWidth, shapeHeight);
        }
    }
    if (slideNumber === 1 || slideNumber === slideCount) {
        const shapeWidth: number = slideWidth;
        const shapeHeight: number = BOTTOM_HEIGHT_PT;
        const shapeX: number = slideWidth - shapeWidth;
        const shapeY: number = slideHeight - shapeHeight;
        addBottomWaterMarkShape(slide, shapeX, shapeY, shapeWidth, shapeHeight);
    }
}

/**
 * Resolves the slide's owning master, or `undefined` when the slide has no
 * usable layout/master chain (hand-minimal packages).
 *
 * @internal
 * @param {Slide} slide - Slide being processed.
 * @returns {MasterSlide | undefined} The master, or `undefined`.
 */
function tryGetMaster(slide: Slide): MasterSlide | undefined {
    try {
        return slide.layout.master;
    } catch {
        return undefined;
    }
}

/**
 * Centre watermark on the master (draws behind every slide).
 *
 * @remarks
 * .NET `AddCenterWaterMarkShape(ISlides shapeCollection, …)`:
 * `shapeCollection.AddTextBox(x, y, 455, 50)`;
 * `textBox.ShapeName = "SyncfusionLicense"`;
 * `textBox.Rotation = 333`;
 * `textBox.TextBody.AddParagraph("Created with a trial version of Syncfusion PowerPoint library")`;
 * `paragraph.Font.FontSize = 18`; `paragraph.Font.Color = ColorObject.Red`;
 * `paragraph.HorizontalAlignment = HorizontalAlignmentType.Center`;
 * `textBox.TextBody.VerticalAlignment = VerticalAlignmentType.Middle`.
 *
 * @internal
 * @param {MasterSlide} master - Master receiving the shape.
 * @param {number} shapeX - X offset in points.
 * @param {number} shapeY - Y offset in points.
 * @param {number} shapeWidth - Width in points.
 * @param {number} shapeHeight - Height in points.
 * @returns {void} Nothing.
 */
function addCenterWaterMarkShape(master: MasterSlide, shapeX: number, shapeY: number,
                                 shapeWidth: number, shapeHeight: number): void {
    const textBox: Shape = master.shapes.addTextBox({
        text: WATERMARK_CENTER_TEXT,
        name: WATERMARK_SHAPE_NAME,
        bounds: { x: shapeX, y: shapeY, width: shapeWidth, height: shapeHeight }
    });
    const element: OoxmlElement = textBox.getElement();
    setShapeRotation(element, CENTER_ROTATION_ROT);
    const body: TextBody = textBox.requireTextBody();
    setVerticalAlignmentMiddle(element, body);
    const paragraph: Paragraph = body.paragraphs[0];
    const font: Font = paragraph.font;
    font.fontSize = FONT_SIZE_PT;
    font.color = RED_HEX;
    paragraph.horizontalAlignment = HorizontalAlignmentType.Center;
}

/**
 * Bottom watermark on a slide (first and last slides only).
 *
 * @remarks
 * .NET `AddBottomWaterMarkShape(ISlides shapeCollection, …)`:
 * `shapeCollection.AddTextBox(x, y, slideWidth, 90)`;
 * `textBox.ShapeName = "SyncfusionLicense"`;
 * one paragraph built from three text parts —
 * lead text, hyperlinked `here` (blue run font, hyperlink text colour type),
 * trailing ` to obtain the valid key.`;
 * `textBox.Fill.SolidFill.Color = ColorObject.White`;
 * `paragraph.Font.Color = ColorObject.Red`; `paragraph.Font.FontSize = 18`;
 * `paragraph.HorizontalAlignment = HorizontalAlignmentType.Center`;
 * `textBox.TextBody.VerticalAlignment = VerticalAlignmentType.Middle`.
 *
 * @internal
 * @param {Slide} slide - Slide receiving the shape.
 * @param {number} shapeX - X offset in points.
 * @param {number} shapeY - Y offset in points.
 * @param {number} shapeWidth - Width in points.
 * @param {number} shapeHeight - Height in points.
 * @returns {void} Nothing.
 */
function addBottomWaterMarkShape(slide: Slide, shapeX: number, shapeY: number,
                                 shapeWidth: number, shapeHeight: number): void {
    const textBox: Shape = slide.shapes.addTextBox({
        text: WATERMARK_BOTTOM_LEAD_TEXT,
        name: WATERMARK_SHAPE_NAME,
        bounds: { x: shapeX, y: shapeY, width: shapeWidth, height: shapeHeight }
    });
    const element: OoxmlElement = textBox.getElement();
    setShapeSolidWhiteFill(element);
    const body: TextBody = textBox.requireTextBody();
    setVerticalAlignmentMiddle(element, body);
    const paragraph: Paragraph = body.paragraphs[0];
    const link: TextPart = paragraph.addTextPart(WATERMARK_BOTTOM_LINK_TEXT);
    paragraph.addTextPart(WATERMARK_BOTTOM_TAIL_TEXT);
    link.setHyperlink(WATERMARK_CLAIM_LICENSE_URL);
    link.font.color = BLUE_HEX;
    paragraph.font.color = RED_HEX;
    paragraph.font.fontSize = FONT_SIZE_PT;
    paragraph.horizontalAlignment = HorizontalAlignmentType.Center;
}

/**
 * Writes `a:xfrm/@rot` (rotation, 60000ths of a degree).
 *
 * @remarks
 * No public rotation setter exists yet; in-place attribute edit follows the
 * established mutation pattern (`table-cell.ts` `setDirectCellProperties`).
 * `addTextBox` always emits `a:xfrm`, so the element is present.
 *
 * @internal
 * @param {OoxmlElement} shapeElement - Live `p:sp` element.
 * @param {string} rot - `@rot` value.
 * @returns {void} Nothing.
 */
function setShapeRotation(shapeElement: OoxmlElement, rot: string): void {
    const spPr: OoxmlElement | undefined = findChild(shapeElement, PML_NS, 'spPr');
    if (spPr === undefined) {
        return;
    }
    const xfrm: OoxmlElement | undefined = findChild(spPr, DML_NS, 'xfrm');
    if (xfrm === undefined) {
        return;
    }
    setUnprefixedAttr(xfrm, 'rot', rot);
}

/**
 * Writes `a:spPr/a:solidFill/a:srgbClr` white shape fill.
 *
 * @remarks
 * `addTextBox` emits `a:noFill` under `spPr`; the white fill replaces it per
 * `EG_FillProperties` choice semantics (one fill child). Fill children come
 * after geometry per `CT_ShapeProperties` order.
 *
 * @internal
 * @param {OoxmlElement} shapeElement - Live `p:sp` element.
 * @returns {void} Nothing.
 */
function setShapeSolidWhiteFill(shapeElement: OoxmlElement): void {
    const spPr: OoxmlElement | undefined = findChild(shapeElement, PML_NS, 'spPr');
    if (spPr === undefined) {
        return;
    }
    const srgbClr: OoxmlElement = {
        kind: 'element',
        namespaceUri: DML_NS,
        localName: 'srgbClr',
        attributes: [{ namespaceUri: '', localName: 'val', value: WHITE_HEX }],
        children: [],
        prefixHint: 'a'
    };
    const solidFill: OoxmlElement = {
        kind: 'element',
        namespaceUri: DML_NS,
        localName: 'solidFill',
        attributes: [],
        children: [srgbClr],
        prefixHint: 'a'
    };
    const mutable: MutableOoxmlElement = asMutable(spPr);
    const next: Array<OoxmlElement | OoxmlText> = mutable.children.filter((child: OoxmlElement | OoxmlText): boolean =>
        !(child.kind === 'element' && child.namespaceUri === DML_NS && child.localName === 'noFill'));
    next.push(solidFill);
    mutable.children = next;
}

/**
 * Writes `a:bodyPr/@anchor="ctr"` (vertical middle).
 *
 * @remarks
 * `addTextBox` always emits `a:bodyPr`; the anchor attribute is added
 * in place. `.NET VerticalAlignmentType.Middle` → `CT_TextBodyProperties`
 * `@anchor="ctr"` (`dml-main.xsd`).
 *
 * @internal
 * @param {OoxmlElement} shapeElement - Live `p:sp` element.
 * @param {TextBody} body - Live text body over the same element.
 * @returns {void} Nothing.
 */
function setVerticalAlignmentMiddle(shapeElement: OoxmlElement, body: TextBody): void {
    void body;
    const txBody: OoxmlElement | undefined = findChild(shapeElement, PML_NS, 'txBody');
    if (txBody === undefined) {
        return;
    }
    const bodyPr: OoxmlElement | undefined = findChild(txBody, DML_NS, 'bodyPr');
    if (bodyPr === undefined) {
        return;
    }
    setUnprefixedAttr(bodyPr, 'anchor', 'ctr');
}

/**
 * Sets an unprefixed attribute in place, preserving other attributes.
 *
 * @internal
 * @param {OoxmlElement} el - Target element.
 * @param {string} localName - Attribute local name.
 * @param {string} value - Attribute value.
 * @returns {void} Nothing.
 */
function setUnprefixedAttr(el: OoxmlElement, localName: string, value: string): void {
    const mutable: MutableOoxmlElement = asMutable(el);
    const next: OoxmlAttribute[] = [];
    let replaced: boolean = false;
    for (let i: number = 0; i < mutable.attributes.length; i++) {
        const a: OoxmlAttribute = mutable.attributes[i];
        if (a.namespaceUri === '' && a.localName === localName) {
            next.push({ ...a, value });
            replaced = true;
        } else {
            next.push(a);
        }
    }
    if (!replaced) {
        next.push({ namespaceUri: '', localName, value });
    }
    mutable.attributes = next;
}
